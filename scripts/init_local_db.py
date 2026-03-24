"""
Initialize local SQLite development database.

Creates data/dev.sqlite3 with the full SA Policy Space schema and seeds it
from the JSON source files.  Also applies the data migration files (UPDATE and
INSERT statements) with automatic PostgreSQL→SQLite syntax translation.

After running this script, add to .env.local:
    SQLITE_DB_PATH=./data/dev.sqlite3

Usage
-----
  python scripts/init_local_db.py              # create/rebuild dev.sqlite3
  python scripts/init_local_db.py --no-reset   # skip if DB already exists and is non-empty
  python scripts/init_local_db.py --skip-migrations   # schema + seed only, no migrations

What gets seeded
----------------
  - policy_ideas          from data/dependency_graph.json (nodes)
  - meetings              from data/dependency_graph.json (meeting metadata, if present)
  - international_comparisons  from migrations (INSERT...SELECT statements, translated)
  - implementation_plans       from migrations (INSERT statements, translated)

Notes
-----
  - DDL statements in the migration files are skipped; the schema is created
    from the hardcoded SQLite-compatible definition below.
  - PG-specific syntax (::text, TIMESTAMPTZ, NOW(), NULLS LAST, etc.) is
    translated to SQLite equivalents automatically.
  - The script is idempotent: re-running wipes and rebuilds the DB.
"""

import argparse
import json
import os
import pathlib
import re
import sqlite3
import sys

# Ensure UTF-8 output on Windows terminals that default to cp1252
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ── Paths ─────────────────────────────────────────────────────────────────────

ROOT       = pathlib.Path(__file__).parent.parent
DB_PATH    = ROOT / "data" / "dev.sqlite3"
DATA_DIR   = ROOT / "data"
MIG_DIR    = DATA_DIR / "migrations"
GRAPH_PATH = DATA_DIR / "dependency_graph.json"

# ── SQLite-compatible schema ──────────────────────────────────────────────────
# Mirrors schema.sql but uses SQLite types and omits PL/pgSQL triggers/functions.

SCHEMA = """
CREATE TABLE IF NOT EXISTS meetings (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    pmg_meeting_id      INTEGER UNIQUE NOT NULL,
    committee_name      TEXT NOT NULL,
    committee_id        INTEGER,
    date                TEXT,
    title               TEXT,
    summary_clean       TEXT,
    pmg_url             TEXT,
    num_documents       INTEGER DEFAULT 0,
    created_at          TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS documents (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    meeting_id      INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    title           TEXT,
    file_type       TEXT,
    pmg_file_url    TEXT,
    description     TEXT
);

CREATE TABLE IF NOT EXISTS policy_ideas (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    title                   TEXT NOT NULL,
    description             TEXT,
    theme                   TEXT,
    binding_constraint      TEXT,
    first_raised_date       TEXT,
    times_raised            INTEGER DEFAULT 1,
    current_status          TEXT DEFAULT 'proposed',
    feasibility_rating      INTEGER CHECK (feasibility_rating BETWEEN 1 AND 5),
    feasibility_note        TEXT,
    growth_impact_rating    INTEGER CHECK (growth_impact_rating BETWEEN 1 AND 5),
    responsible_department  TEXT,
    key_quote               TEXT,
    source_committee        TEXT,
    reform_package          INTEGER,
    time_horizon            TEXT,
    slug                    TEXT UNIQUE,
    economic_impact_estimate TEXT,
    source_url               TEXT,
    created_at              TEXT DEFAULT (datetime('now')),
    updated_at              TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS idea_meetings (
    idea_id     INTEGER NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    meeting_id  INTEGER NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    PRIMARY KEY (idea_id, meeting_id)
);

CREATE TABLE IF NOT EXISTS implementation_plans (
    id                          INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id                     INTEGER UNIQUE NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    roadmap_summary             TEXT,
    implementation_steps        TEXT,   -- stored as JSON string
    estimated_timeline          TEXT,
    estimated_cost              TEXT,
    required_legislation        TEXT,
    draft_legislation_notes     TEXT,
    political_feasibility_notes TEXT,
    international_precedents    TEXT,
    created_at                  TEXT DEFAULT (datetime('now')),
    updated_at                  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS international_comparisons (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    idea_id         INTEGER NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    country         TEXT NOT NULL,
    iso3            TEXT,
    reform_year     INTEGER,
    outcome_summary TEXT NOT NULL,
    approach        TEXT,
    gdp_impact      TEXT,
    timeline        TEXT,
    lessons_for_sa  TEXT,
    sources         TEXT,   -- stored as JSON array string
    source_url      TEXT,
    source_label    TEXT,
    created_at      TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_meetings_date           ON meetings(date);
CREATE INDEX IF NOT EXISTS idx_meetings_committee_name ON meetings(committee_name);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_theme              ON policy_ideas(theme);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_binding_constraint ON policy_ideas(binding_constraint);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_current_status     ON policy_ideas(current_status);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_growth_impact      ON policy_ideas(growth_impact_rating);
CREATE INDEX IF NOT EXISTS idx_policy_ideas_first_raised       ON policy_ideas(first_raised_date);
CREATE INDEX IF NOT EXISTS idx_documents_meeting_id ON documents(meeting_id);
CREATE INDEX IF NOT EXISTS idx_idea_meetings_idea   ON idea_meetings(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_meetings_meeting ON idea_meetings(meeting_id);
CREATE INDEX IF NOT EXISTS idx_intl_comp_idea_id ON international_comparisons(idea_id);
CREATE INDEX IF NOT EXISTS idx_intl_comp_country  ON international_comparisons(country);
"""

# ── Dept lookup (mirrors init_and_seed_db.py) ─────────────────────────────────

RESPONSIBLE_DEPT = {
    "energy":              "Department of Mineral Resources and Energy",
    "logistics":           "Department of Transport / Transnet",
    "skills":              "Department of Higher Education and Training",
    "regulatory_burden":   "DTIC / Competition Commission",
    "governance":          "DPSA / National Treasury",
    "fiscal_constraint":   "National Treasury",
    "fiscal_space":        "National Treasury",
    "land_rights":         "DALRRD",
    "land_reform":         "DALRRD",
    "land_housing":        "DALRRD / Department of Human Settlements",
    "healthcare":          "Department of Health",
    "health_systems":      "Department of Health",
    "education":           "Department of Basic Education",
    "skills_education":    "Department of Basic Education / DHET",
    "infrastructure":      "DPWI / PICC",
    "state_capacity":      "DPSA / National Treasury",
    "government_capacity": "DPSA / National Treasury",
    "finance":             "National Treasury",
    "financial_access":    "National Treasury / SARB",
    "soe":                 "DPSA / National Treasury",
    "corruption":          "DPSA / SIU",
    "corruption_governance": "DPSA / SIU",
    "digital":             "DCDT",
    "digital_infrastructure": "DCDT",
    "innovation_capacity": "DSI / DTIC",
    "transport_logistics": "Department of Transport",
}

# ── Slug ──────────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text).strip("-")
    return text

# ── PG → SQLite translation ───────────────────────────────────────────────────

# Regexes applied in order to each SQL statement
_PG_TO_SQLITE: list[tuple[re.Pattern, str]] = [
    # Remove type casts: '...'::jsonb, '...'::text, expr::int, etc.
    (re.compile(r"::(jsonb|text|int|integer|numeric|float|timestamptz|date|boolean|bigint)\b",
                re.IGNORECASE), ""),
    # NOW() → datetime('now')
    (re.compile(r"\bNOW\s*\(\s*\)", re.IGNORECASE), "datetime('now')"),
    # NULLS LAST / NULLS FIRST  (not supported in SQLite ORDER BY)
    (re.compile(r"\bNULLS\s+(LAST|FIRST)\b", re.IGNORECASE), ""),
    # Remove RETURNING clause (not needed for SQLite inserts in our context)
    (re.compile(r"\bRETURNING\s+\*\s*$", re.IGNORECASE | re.MULTILINE), ""),
]

def translate_for_sqlite(sql: str) -> str:
    """Apply lightweight PostgreSQL→SQLite syntax transformations."""
    for pattern, replacement in _PG_TO_SQLITE:
        sql = pattern.sub(replacement, sql)
    return sql


def is_ddl_statement(stmt: str) -> bool:
    """Return True if this statement is DDL (CREATE, DROP, ALTER, etc.)."""
    stripped = stmt.strip().lstrip("-").strip().upper()
    return bool(re.match(r"\s*(CREATE|DROP|ALTER|TRUNCATE|COMMENT)", stripped))


def split_sql_statements(sql: str) -> list[str]:
    """
    Split SQL into individual statements on semicolons.

    Correctly handles:
    - Single-quoted string literals (with '' escaping)
    - -- line comments (single quotes inside comments are ignored)
    - BEGIN/COMMIT transaction wrappers (silently skipped)

    Returns non-empty, non-DDL statements only.
    """
    statements = []
    current: list[str] = []
    in_string = False
    in_line_comment = False
    i = 0
    n = len(sql)

    while i < n:
        ch = sql[i]

        # Handle end of line comment
        if in_line_comment:
            current.append(ch)
            if ch == "\n":
                in_line_comment = False
            i += 1
            continue

        # Start of line comment (-- outside a string)
        if not in_string and ch == "-" and i + 1 < n and sql[i + 1] == "-":
            in_line_comment = True
            current.append(ch)
            i += 1
            continue

        # Single-quote handling
        if ch == "'" and not in_string:
            in_string = True
            current.append(ch)
        elif ch == "'" and in_string:
            # Escaped quote: '' stays in string
            if i + 1 < n and sql[i + 1] == "'":
                current.append("''")
                i += 2
                continue
            in_string = False
            current.append(ch)
        elif ch == ";" and not in_string:
            stmt = "".join(current).strip()
            # Skip pure-comment, empty, BEGIN, and COMMIT pseudo-statements
            uncommented = re.sub(r"--[^\n]*", "", stmt).strip()
            upper = uncommented.upper()
            if uncommented and upper not in ("BEGIN", "COMMIT", "ROLLBACK",
                                              "BEGIN TRANSACTION", "COMMIT TRANSACTION"):
                statements.append(stmt)
            current = []
        else:
            current.append(ch)
        i += 1

    # Remaining content after last semicolon
    stmt = "".join(current).strip()
    if stmt:
        uncommented = re.sub(r"--[^\n]*", "", stmt).strip()
        upper = uncommented.upper()
        if uncommented and upper not in ("BEGIN", "COMMIT", "ROLLBACK"):
            statements.append(stmt)

    return statements

# ── Seeding ───────────────────────────────────────────────────────────────────

def seed_policy_ideas(conn: sqlite3.Connection) -> int:
    """Seed policy_ideas from dependency_graph.json nodes. Returns count inserted."""
    if not GRAPH_PATH.exists():
        print(f"  Warning: {GRAPH_PATH} not found — skipping policy_ideas seed")
        return 0

    graph = json.loads(GRAPH_PATH.read_text(encoding="utf-8"))
    nodes = graph.get("nodes", [])

    inserted = 0
    for node in nodes:
        slug = slugify(node["title"])
        bc = node.get("binding_constraint", "")
        conn.execute("""
            INSERT INTO policy_ideas
                (id, title, theme, binding_constraint, current_status,
                 feasibility_rating, growth_impact_rating, source_committee,
                 reform_package, time_horizon, slug, responsible_department)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            node["id"],
            node["title"],
            node.get("theme"),
            bc or None,
            node.get("current_status", "proposed"),
            node.get("feasibility_rating"),
            node.get("growth_impact_rating"),
            node.get("source_committee"),
            node.get("reform_package"),
            node.get("time_horizon"),
            slug,
            RESPONSIBLE_DEPT.get(bc or "", None),
        ))
        inserted += 1

    conn.commit()
    return inserted


def apply_migration_to_sqlite(conn: sqlite3.Connection, mig_file: pathlib.Path) -> dict:
    """
    Apply a single migration file to SQLite.

    DDL statements are skipped (schema is already set up).  DML statements are
    translated from PostgreSQL syntax and executed.

    Returns: {"applied": int, "skipped_ddl": int, "errors": list[str]}
    """
    sql = mig_file.read_text(encoding="utf-8")
    statements = split_sql_statements(sql)

    applied = 0
    skipped_ddl = 0
    errors: list[str] = []

    for raw_stmt in statements:
        # Strip leading comments from the statement for classification
        uncommented = re.sub(r"--[^\n]*", "", raw_stmt).strip()
        if not uncommented:
            continue

        if is_ddl_statement(uncommented):
            skipped_ddl += 1
            continue

        translated = translate_for_sqlite(raw_stmt)
        try:
            conn.execute(translated)
            applied += 1
        except sqlite3.Error as e:
            errors.append(f"{e!r} — in: {raw_stmt[:80]}...")

    conn.commit()
    return {"applied": applied, "skipped_ddl": skipped_ddl, "errors": errors}

# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Initialize local SQLite development database.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--no-reset", action="store_true",
                        help="Skip if data/dev.sqlite3 already exists and has data")
    parser.add_argument("--skip-migrations", action="store_true",
                        help="Create schema and seed JSON only; skip migration SQL files")
    parser.add_argument("--db-path", default=str(DB_PATH),
                        help=f"Output path (default: {DB_PATH})")
    args = parser.parse_args()

    db_path = pathlib.Path(args.db_path)
    db_path.parent.mkdir(parents=True, exist_ok=True)

    # --no-reset: skip if DB already has data
    if args.no_reset and db_path.exists():
        try:
            conn = sqlite3.connect(str(db_path))
            cur = conn.execute("SELECT COUNT(*) FROM policy_ideas")
            count = cur.fetchone()[0]
            conn.close()
            if count > 0:
                print(f"Database already initialised ({count} ideas). Use without --no-reset to rebuild.")
                return
        except sqlite3.Error:
            pass  # DB exists but is incomplete — fall through to rebuild

    # Remove existing DB for a clean rebuild
    if db_path.exists():
        db_path.unlink()
        print(f"Removed existing {db_path.name}")

    print(f"Initialising {db_path} …\n")
    conn = sqlite3.connect(str(db_path))
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")

    # ── Schema ────────────────────────────────────────────────────────────────
    print("  Creating schema …")
    conn.executescript(SCHEMA)
    print("  [ok] Schema created (all tables + indexes)")

    # ── Seed policy_ideas ─────────────────────────────────────────────────────
    print("  Seeding policy_ideas from dependency_graph.json …")
    idea_count = seed_policy_ideas(conn)
    if idea_count:
        print(f"  [ok] {idea_count} policy ideas inserted")
    else:
        print("  [!]  No ideas seeded — check that data/dependency_graph.json exists")

    # ── Apply migrations ──────────────────────────────────────────────────────
    if not args.skip_migrations:
        if not MIG_DIR.exists():
            print(f"\n  Warning: {MIG_DIR} not found — skipping migrations")
        else:
            mig_files = sorted(MIG_DIR.glob("*.sql"), key=lambda p: p.name)
            print(f"\n  Applying {len(mig_files)} migration file(s) …")
            total_applied = 0
            total_skipped = 0
            total_errors = 0

            for mig_file in mig_files:
                result = apply_migration_to_sqlite(conn, mig_file)
                status = "[ok]" if not result["errors"] else "[!] "
                print(
                    f"  {status} {mig_file.name:<55} "
                    f"{result['applied']:>3} stmts applied, "
                    f"{result['skipped_ddl']:>2} DDL skipped"
                    + (f", {len(result['errors'])} error(s)" if result["errors"] else "")
                )
                if result["errors"]:
                    for err in result["errors"][:3]:  # show first 3 errors
                        print(f"      → {err}")
                total_applied += result["applied"]
                total_skipped += result["skipped_ddl"]
                total_errors += len(result["errors"])

            print(f"\n  Migrations: {total_applied} statements applied, "
                  f"{total_skipped} DDL skipped, {total_errors} error(s)")
            if total_errors:
                print("  Note: Some migration errors are expected when running PG-specific")
                print("  INSERT...SELECT patterns against an incomplete local dataset.")

    # ── Summary ───────────────────────────────────────────────────────────────
    print("\n  Final counts:")
    tables = [
        "policy_ideas", "meetings", "idea_meetings",
        "implementation_plans", "international_comparisons", "documents"
    ]
    for table in tables:
        try:
            cur = conn.execute(f"SELECT COUNT(*) FROM {table}")
            n = cur.fetchone()[0]
            print(f"    {table:<35} {n:>6} rows")
        except sqlite3.Error:
            print(f"    {table:<35}  (table missing)")

    conn.close()

    print(f"\nDone. Database at: {db_path}")
    print()
    print("Add to .env.local:")
    print(f"  SQLITE_DB_PATH={db_path}")
    print()
    print("Then start the dev server:")
    print("  npm run dev")


if __name__ == "__main__":
    main()
