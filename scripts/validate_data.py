"""
Data validation pipeline for SA Policy Space.

Checks data integrity and reports coverage statistics.  Designed to run both
locally (against the SQLite dev database) and in CI (against Supabase).

Data sources (checked in order):
  1. Supabase REST API — if NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set
  2. Local SQLite      — if SQLITE_DB_PATH is set, or data/dev.sqlite3 exists

Usage
-----
  python scripts/validate_data.py                 # auto-detect data source
  python scripts/validate_data.py --source supabase
  python scripts/validate_data.py --source sqlite
  python scripts/validate_data.py --json          # machine-readable output (for CI)
  python scripts/validate_data.py --warn-only     # always exit 0 (report but don't fail)

Exit codes
----------
  0 — all checks pass (or --warn-only)
  1 — one or more critical checks failed
"""

import argparse
import json
import os
import pathlib
import re
import sqlite3
import ssl
import sys
import urllib.error
import urllib.request
from typing import Any

# Ensure UTF-8 output on Windows terminals that default to cp1252
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ── Paths & env ───────────────────────────────────────────────────────────────

ROOT = pathlib.Path(__file__).parent.parent

def load_env(path: pathlib.Path) -> None:
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip('"').strip("'")
        if key not in os.environ:
            os.environ[key] = val

load_env(ROOT / ".env.local")
load_env(ROOT / ".env")

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
ANON_KEY     = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
SQLITE_PATH  = os.environ.get("SQLITE_DB_PATH", str(ROOT / "data" / "dev.sqlite3"))

# ── Supabase REST helpers ─────────────────────────────────────────────────────

def supabase_get(table: str, params: str = "", select: str = "*") -> list[dict]:
    """Fetch rows from a Supabase table via PostgREST."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?select={select}"
    if params:
        url += "&" + params
    req = urllib.request.Request(
        url,
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Accept": "application/json",
        },
    )
    ctx = ssl.create_default_context()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        raise RuntimeError(f"Supabase GET /{table} returned HTTP {e.code}: {body[:200]}")

def supabase_count(table: str, params: str = "") -> int:
    """Return the row count for a filtered Supabase table query."""
    url = f"{SUPABASE_URL}/rest/v1/{table}?select=id"
    if params:
        url += "&" + params
    req = urllib.request.Request(
        url,
        headers={
            "apikey": ANON_KEY,
            "Authorization": f"Bearer {ANON_KEY}",
            "Prefer": "count=exact",
            "Accept": "application/json",
        },
    )
    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
        # Count is in the Content-Range header: "0-99/132"
        content_range = resp.headers.get("Content-Range", "")
        if "/" in content_range:
            return int(content_range.split("/")[-1])
        # Fallback: count returned rows
        return len(json.loads(resp.read().decode("utf-8")))

# ── SQLite helpers ────────────────────────────────────────────────────────────

def sqlite_query(conn: sqlite3.Connection, sql: str, params: tuple = ()) -> list[dict]:
    conn.row_factory = sqlite3.Row
    cur = conn.execute(sql, params)
    return [dict(row) for row in cur.fetchall()]

def sqlite_count(conn: sqlite3.Connection, table: str, where: str = "", params: tuple = ()) -> int:
    clause = f"WHERE {where}" if where else ""
    cur = conn.execute(f"SELECT COUNT(*) FROM {table} {clause}", params)
    return cur.fetchone()[0]

def table_exists(conn: sqlite3.Connection, table: str) -> bool:
    cur = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?", (table,)
    )
    return cur.fetchone() is not None

# ── Validation checks ─────────────────────────────────────────────────────────

class Check:
    """Represents a single validation check result."""
    def __init__(self, name: str, passed: bool, message: str,
                 critical: bool = True, detail: str | None = None):
        self.name = name
        self.passed = passed
        self.message = message
        self.critical = critical
        self.detail = detail  # optional extra info (e.g. list of bad IDs)

    def to_dict(self) -> dict:
        d = {"name": self.name, "passed": self.passed, "message": self.message,
             "critical": self.critical}
        if self.detail:
            d["detail"] = self.detail
        return d


def validate_supabase() -> list[Check]:
    """Run all validation checks against Supabase via REST API."""
    checks: list[Check] = []

    # ── 1. Connect / count ideas ──────────────────────────────────────────────
    try:
        total_ideas = supabase_count("policy_ideas")
    except Exception as e:
        checks.append(Check("supabase_connection", False, f"Cannot connect to Supabase: {e}"))
        return checks  # nothing else can run

    checks.append(Check("supabase_connection", True, f"Connected — {total_ideas} policy ideas"))

    if total_ideas == 0:
        checks.append(Check("ideas_exist", False, "policy_ideas table is empty — database needs seeding"))
        return checks

    # ── 2. Ideas: descriptions ────────────────────────────────────────────────
    no_desc = supabase_count("policy_ideas", "description=is.null")
    empty_desc = supabase_count("policy_ideas", "description=eq.")
    missing_desc = no_desc + empty_desc
    desc_coverage = total_ideas - missing_desc
    checks.append(Check(
        "ideas_have_descriptions",
        missing_desc == 0,
        f"{desc_coverage}/{total_ideas} ideas have descriptions ({missing_desc} missing)",
        critical=False,
    ))

    # ── 3. Ideas: time_horizon ────────────────────────────────────────────────
    no_horizon = supabase_count("policy_ideas", "time_horizon=is.null")
    horizon_coverage = total_ideas - no_horizon
    checks.append(Check(
        "ideas_have_time_horizon",
        no_horizon == 0,
        f"{horizon_coverage}/{total_ideas} ideas have time_horizon ({no_horizon} missing)",
        critical=False,
    ))

    # ── 4. Ideas: reform_package ──────────────────────────────────────────────
    no_package = supabase_count("policy_ideas", "reform_package=is.null")
    package_coverage = total_ideas - no_package
    checks.append(Check(
        "ideas_have_reform_package",
        no_package == 0,
        f"{package_coverage}/{total_ideas} ideas assigned to a reform package ({no_package} unassigned)",
        critical=False,
    ))

    # ── 5. Implementation plans coverage ─────────────────────────────────────
    total_plans = supabase_count("implementation_plans")
    checks.append(Check(
        "implementation_plans_coverage",
        total_plans > 0,
        f"{total_plans}/{total_ideas} ideas have implementation plans "
        f"({total_plans / total_ideas * 100:.0f}%)",
        critical=False,
    ))

    # ── 6. Implementation plans: orphaned ────────────────────────────────────
    try:
        # Fetch plan idea_ids and idea ids to cross-check
        plans = supabase_get("implementation_plans", select="idea_id")
        ideas = supabase_get("policy_ideas", select="id")
        idea_ids = {r["id"] for r in ideas}
        orphaned_plans = [r["idea_id"] for r in plans if r["idea_id"] not in idea_ids]
        checks.append(Check(
            "implementation_plans_no_orphans",
            len(orphaned_plans) == 0,
            f"No orphaned implementation plans" if not orphaned_plans
            else f"{len(orphaned_plans)} plans reference non-existent ideas",
            critical=True,
            detail=str(orphaned_plans) if orphaned_plans else None,
        ))
    except Exception as e:
        checks.append(Check("implementation_plans_no_orphans", False,
                            f"Could not check orphaned plans: {e}"))

    # ── 7. International comparisons ──────────────────────────────────────────
    try:
        total_comps = supabase_count("international_comparisons")
        checks.append(Check(
            "international_comparisons_exist",
            total_comps > 0,
            f"{total_comps} international comparison records",
            critical=False,
        ))

        if total_comps > 0:
            # Check enrichment fields (added in migration 005 and 008)
            no_approach = supabase_count(
                "international_comparisons", "approach=is.null"
            )
            no_lessons = supabase_count(
                "international_comparisons", "lessons_for_sa=is.null"
            )
            enriched = total_comps - max(no_approach, no_lessons)
            checks.append(Check(
                "comparisons_enriched",
                no_approach == 0 and no_lessons == 0,
                f"{enriched}/{total_comps} comparisons have approach + lessons_for_sa "
                f"({no_approach} missing approach, {no_lessons} missing lessons)",
                critical=False,
            ))

            # Orphaned comparisons
            comps = supabase_get("international_comparisons", select="idea_id,country")
            orphaned_comps = [r for r in comps if r["idea_id"] not in idea_ids]
            checks.append(Check(
                "comparisons_no_orphans",
                len(orphaned_comps) == 0,
                "No orphaned comparisons" if not orphaned_comps
                else f"{len(orphaned_comps)} comparisons reference non-existent ideas",
                critical=True,
                detail=[f"{r['country']} (idea_id={r['idea_id']})" for r in orphaned_comps] or None,
            ))
    except Exception as e:
        checks.append(Check("international_comparisons_exist", False,
                            f"Could not check comparisons: {e}", critical=False))

    # ── 8. Source URL integrity: no api.pmg.org.za ────────────────────────────
    try:
        # Check meetings table
        bad_meetings = supabase_count("meetings", "pmg_url=like.*api.pmg.org.za*")
        bad_docs = supabase_count("documents", "pmg_file_url=like.*api.pmg.org.za*")
        total_bad = bad_meetings + bad_docs
        checks.append(Check(
            "no_api_pmg_urls",
            total_bad == 0,
            f"No api.pmg.org.za URLs found" if total_bad == 0
            else f"{total_bad} records still use api.pmg.org.za URLs "
                 f"({bad_meetings} meetings, {bad_docs} documents) — run migration 001/009",
            critical=True,
        ))
    except Exception as e:
        checks.append(Check("no_api_pmg_urls", False, f"Could not check URLs: {e}", critical=False))

    return checks


def validate_sqlite(db_path: str) -> list[Check]:
    """Run all validation checks against local SQLite database."""
    checks: list[Check] = []

    if not pathlib.Path(db_path).exists():
        checks.append(Check(
            "sqlite_exists", False,
            f"SQLite database not found: {db_path}\n"
            f"  Run: python scripts/init_local_db.py",
        ))
        return checks

    try:
        conn = sqlite3.connect(db_path)
    except Exception as e:
        checks.append(Check("sqlite_connect", False, f"Cannot open database: {e}"))
        return checks

    checks.append(Check("sqlite_exists", True, f"Connected to {db_path}"))

    # ── 1. Ideas ──────────────────────────────────────────────────────────────
    total_ideas = sqlite_count(conn, "policy_ideas")
    if total_ideas == 0:
        checks.append(Check("ideas_exist", False,
                            "policy_ideas is empty — run: python scripts/init_local_db.py"))
        conn.close()
        return checks

    checks.append(Check("ideas_exist", True, f"{total_ideas} policy ideas"))

    # Descriptions
    missing_desc = sqlite_count(
        conn, "policy_ideas",
        "(description IS NULL OR description = '')"
    )
    checks.append(Check(
        "ideas_have_descriptions",
        missing_desc == 0,
        f"{total_ideas - missing_desc}/{total_ideas} ideas have descriptions ({missing_desc} missing)",
        critical=False,
    ))

    # time_horizon
    no_horizon = sqlite_count(conn, "policy_ideas", "time_horizon IS NULL")
    checks.append(Check(
        "ideas_have_time_horizon",
        no_horizon == 0,
        f"{total_ideas - no_horizon}/{total_ideas} ideas have time_horizon ({no_horizon} missing)",
        critical=False,
    ))

    # reform_package
    no_package = sqlite_count(conn, "policy_ideas", "reform_package IS NULL")
    checks.append(Check(
        "ideas_have_reform_package",
        no_package == 0,
        f"{total_ideas - no_package}/{total_ideas} ideas assigned to reform package ({no_package} unassigned)",
        critical=False,
    ))

    # ── 2. Implementation plans ───────────────────────────────────────────────
    total_plans = sqlite_count(conn, "implementation_plans") if table_exists(conn, "implementation_plans") else 0
    checks.append(Check(
        "implementation_plans_coverage",
        total_plans > 0,
        f"{total_plans}/{total_ideas} ideas have implementation plans "
        f"({total_plans / total_ideas * 100:.0f}%)",
        critical=False,
    ))

    if total_plans > 0:
        orphaned = sqlite_query(conn, """
            SELECT ip.idea_id FROM implementation_plans ip
            LEFT JOIN policy_ideas p ON p.id = ip.idea_id
            WHERE p.id IS NULL
        """)
        checks.append(Check(
            "implementation_plans_no_orphans",
            len(orphaned) == 0,
            "No orphaned implementation plans" if not orphaned
            else f"{len(orphaned)} plans reference non-existent ideas",
            critical=True,
            detail=[r["idea_id"] for r in orphaned] or None,
        ))

    # ── 3. International comparisons ──────────────────────────────────────────
    if table_exists(conn, "international_comparisons"):
        total_comps = sqlite_count(conn, "international_comparisons")
        checks.append(Check(
            "international_comparisons_exist",
            total_comps > 0,
            f"{total_comps} international comparison records",
            critical=False,
        ))

        if total_comps > 0:
            no_approach = sqlite_count(conn, "international_comparisons", "approach IS NULL")
            no_lessons  = sqlite_count(conn, "international_comparisons", "lessons_for_sa IS NULL")
            enriched = total_comps - max(no_approach, no_lessons)
            checks.append(Check(
                "comparisons_enriched",
                no_approach == 0 and no_lessons == 0,
                f"{enriched}/{total_comps} comparisons enriched "
                f"({no_approach} missing approach, {no_lessons} missing lessons_for_sa)",
                critical=False,
            ))

            orphaned_comps = sqlite_query(conn, """
                SELECT ic.idea_id, ic.country FROM international_comparisons ic
                LEFT JOIN policy_ideas p ON p.id = ic.idea_id
                WHERE p.id IS NULL
            """)
            checks.append(Check(
                "comparisons_no_orphans",
                len(orphaned_comps) == 0,
                "No orphaned comparisons" if not orphaned_comps
                else f"{len(orphaned_comps)} comparisons reference non-existent ideas",
                critical=True,
            ))
    else:
        checks.append(Check(
            "international_comparisons_exist", False,
            "international_comparisons table missing — run migration 002",
            critical=False,
        ))

    # ── 4. Source URL integrity ───────────────────────────────────────────────
    if table_exists(conn, "meetings"):
        bad_meetings = sqlite_count(conn, "meetings",
                                    "pmg_url LIKE '%api.pmg.org.za%'")
        bad_docs = (
            sqlite_count(conn, "documents", "pmg_file_url LIKE '%api.pmg.org.za%'")
            if table_exists(conn, "documents") else 0
        )
        total_bad = bad_meetings + bad_docs
        checks.append(Check(
            "no_api_pmg_urls",
            total_bad == 0,
            "No api.pmg.org.za URLs" if total_bad == 0
            else f"{total_bad} records use api.pmg.org.za URLs — run migrations 001 and 009",
            critical=True,
        ))

    conn.close()
    return checks


def validate_json_files() -> list[Check]:
    """
    Lightweight validation that runs without any database connection.
    Checks the JSON source files for basic integrity.
    Used in CI when no Supabase credentials are available.
    """
    checks: list[Check] = []
    data_dir = ROOT / "data"

    required_files = [
        "dependency_graph.json",
        "reform_packages.json",
        "implementation_plans.json",
        "international_comparisons.json",
    ]
    for fname in required_files:
        fpath = data_dir / fname
        if not fpath.exists():
            checks.append(Check(f"file_{fname}", False, f"Missing: data/{fname}", critical=True))
            continue
        try:
            data = json.loads(fpath.read_text(encoding="utf-8"))
            checks.append(Check(f"file_{fname}", True, f"data/{fname} is valid JSON"))
        except json.JSONDecodeError as e:
            checks.append(Check(f"file_{fname}", False, f"Invalid JSON in data/{fname}: {e}",
                                critical=True))

    # Check dependency_graph node count
    graph_path = data_dir / "dependency_graph.json"
    if graph_path.exists():
        try:
            graph = json.loads(graph_path.read_text(encoding="utf-8"))
            nodes = graph.get("nodes", [])
            links = graph.get("links", [])
            checks.append(Check(
                "dependency_graph_structure",
                len(nodes) > 0,
                f"dependency_graph has {len(nodes)} nodes, {len(links)} links",
                critical=True,
            ))

            # Check for ideas missing key fields
            missing_bc = [n for n in nodes if not n.get("binding_constraint")]
            missing_status = [n for n in nodes if not n.get("current_status")]
            checks.append(Check(
                "dependency_graph_fields",
                len(missing_bc) == 0,
                f"All {len(nodes)} ideas have binding_constraint" if not missing_bc
                else f"{len(missing_bc)} ideas missing binding_constraint: "
                     f"{[n.get('id') for n in missing_bc[:5]]}",
                critical=False,
            ))

            # Check for source URL issues in any embedded fields
            api_url_pattern = re.compile(r'api\.pmg\.org\.za')
            graph_text = graph_path.read_text(encoding="utf-8")
            if api_url_pattern.search(graph_text):
                checks.append(Check(
                    "json_no_api_pmg_urls",
                    False,
                    "dependency_graph.json contains api.pmg.org.za URLs",
                    critical=False,
                ))
            else:
                checks.append(Check(
                    "json_no_api_pmg_urls",
                    True,
                    "No api.pmg.org.za URLs in dependency_graph.json",
                ))
        except Exception as e:
            checks.append(Check("dependency_graph_structure", False,
                                f"Could not parse dependency_graph.json: {e}"))

    # Check migrations directory
    mig_dir = ROOT / "data" / "migrations"
    mig_files = sorted(mig_dir.glob("*.sql")) if mig_dir.exists() else []
    checks.append(Check(
        "migrations_directory",
        len(mig_files) > 0,
        f"{len(mig_files)} migration files in data/migrations/",
        critical=False,
    ))

    return checks


# ── Reporting ─────────────────────────────────────────────────────────────────

def print_report(checks: list[Check], source: str, json_output: bool) -> int:
    """Print validation report. Returns exit code (0 = pass, 1 = fail)."""
    failures = [c for c in checks if not c.passed and c.critical]
    warnings = [c for c in checks if not c.passed and not c.critical]

    if json_output:
        report = {
            "source": source,
            "passed": len(failures) == 0,
            "total_checks": len(checks),
            "failures": len(failures),
            "warnings": len(warnings),
            "checks": [c.to_dict() for c in checks],
        }
        print(json.dumps(report, indent=2))
        return 1 if failures else 0

    # Human-readable output
    print(f"\nSA Policy Space - Data Validation  [{source}]")
    print("=" * 60)

    for c in checks:
        icon = "[ok]  " if c.passed else ("[FAIL]" if c.critical else "[WARN]")
        label = "" if c.critical else " (warning)"
        print(f"  {icon} {c.message}{label}")
        if c.detail:
            detail_str = str(c.detail)
            if len(detail_str) > 120:
                detail_str = detail_str[:120] + "..."
            print(f"         -> {detail_str}")

    print()
    if failures:
        print(f"  RESULT: {len(failures)} critical failure(s), {len(warnings)} warning(s)")
    elif warnings:
        print(f"  RESULT: All critical checks passed  ({len(warnings)} warning(s))")
    else:
        print(f"  RESULT: All {len(checks)} checks passed [ok]")
    print()

    return 1 if failures else 0


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Validate SA Policy Space data integrity.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--source", choices=["supabase", "sqlite", "json", "auto"],
                        default="auto",
                        help="Data source to validate against (default: auto-detect)")
    parser.add_argument("--json", action="store_true",
                        help="Output JSON (for CI / machine consumption)")
    parser.add_argument("--warn-only", action="store_true",
                        help="Exit 0 even if checks fail (report only)")
    args = parser.parse_args()

    # Determine source
    source = args.source
    if source == "auto":
        if SUPABASE_URL and ANON_KEY:
            source = "supabase"
        elif pathlib.Path(SQLITE_PATH).exists():
            source = "sqlite"
        else:
            source = "json"
            if not args.json:
                print("Note: No database connection configured - validating JSON source files only.")
                print("  Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY for full validation.\n")
                print()

    if source == "supabase":
        if not SUPABASE_URL or not ANON_KEY:
            print("ERROR: Supabase source requires NEXT_PUBLIC_SUPABASE_URL and "
                  "NEXT_PUBLIC_SUPABASE_ANON_KEY", file=sys.stderr)
            sys.exit(1)
        checks = validate_supabase()
    elif source == "sqlite":
        checks = validate_sqlite(SQLITE_PATH)
    else:  # json
        checks = validate_json_files()

    exit_code = print_report(checks, source, args.json)

    if not args.warn_only:
        sys.exit(exit_code)


if __name__ == "__main__":
    main()
