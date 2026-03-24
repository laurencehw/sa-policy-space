"""
Sync migration files to Supabase production database.

Reads SQL files from data/migrations/ in alphabetical order, tracks which
have already been applied in .migrations_state.json, and executes pending
migrations via the Supabase Management API.

Requirements
------------
SUPABASE_SERVICE_ROLE_KEY  (mandatory) — service role key from Supabase dashboard
NEXT_PUBLIC_SUPABASE_URL   (optional) — used to auto-detect project ref

Both can live in .env.local (automatically loaded).

Usage
-----
  python scripts/sync_to_supabase.py                # apply all pending migrations
  python scripts/sync_to_supabase.py --dry-run       # preview without executing
  python scripts/sync_to_supabase.py --list          # show current migration status
  python scripts/sync_to_supabase.py --force         # re-apply all migrations (destructive)
  python scripts/sync_to_supabase.py --migration 003_idea_descriptions.sql

Notes
-----
- State is tracked locally in .migrations_state.json (should be committed to git
  so the team shares a consistent view of what has been applied).
- DDL statements (CREATE TABLE, CREATE INDEX, etc.) and DML statements (INSERT,
  UPDATE) are both executed via the Management API, which accepts arbitrary SQL.
- The Management API endpoint is:
    POST https://api.supabase.com/v1/projects/{ref}/database/query
  and requires Bearer authorisation with the service role key.
- If you do not have the service role key, run migrations manually in the
  Supabase SQL Editor and then mark them applied with --mark-applied.
"""

import argparse
import json
import os
import pathlib
import re
import ssl
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone

# Ensure UTF-8 output on Windows terminals that default to cp1252
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# ── Paths ─────────────────────────────────────────────────────────────────────

ROOT = pathlib.Path(__file__).parent.parent
MIGRATIONS_DIR = ROOT / "data" / "migrations"
STATE_FILE = ROOT / ".migrations_state.json"

# ── Env loading ───────────────────────────────────────────────────────────────

def load_env(path: pathlib.Path) -> None:
    """Load key=value pairs from a .env file into os.environ (no overwrite)."""
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

# ── Config ────────────────────────────────────────────────────────────────────

SERVICE_KEY  = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")

# Derive project ref from URL: https://naxafsgmvffaqzfhkfig.supabase.co → naxafsgmvffaqzfhkfig
PROJECT_REF = (
    SUPABASE_URL.split("//")[-1].split(".")[0]
    if SUPABASE_URL
    else os.environ.get("SUPABASE_PROJECT_REF", "")
)

# ── State management ──────────────────────────────────────────────────────────

def load_state() -> dict:
    """Load migration state from STATE_FILE, creating it if missing."""
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            print(f"Warning: {STATE_FILE} is malformed — starting fresh.", file=sys.stderr)
    return {"applied": [], "last_updated": None}

def save_state(state: dict) -> None:
    state["last_updated"] = datetime.now(timezone.utc).isoformat()
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")

# ── Migration discovery ───────────────────────────────────────────────────────

def get_migration_files() -> list[pathlib.Path]:
    """Return migration SQL files sorted by filename (alphabetical = chronological)."""
    if not MIGRATIONS_DIR.exists():
        print(f"ERROR: migrations directory not found: {MIGRATIONS_DIR}", file=sys.stderr)
        sys.exit(1)
    files = sorted(MIGRATIONS_DIR.glob("*.sql"), key=lambda p: p.name)
    return files

def classify_sql(sql: str) -> str:
    """Return 'ddl', 'dml', or 'mixed' based on statement types in the SQL."""
    upper = sql.upper()
    has_ddl = bool(re.search(r'\b(CREATE|DROP|ALTER|TRUNCATE)\b', upper))
    has_dml = bool(re.search(r'\b(INSERT|UPDATE|DELETE|UPSERT)\b', upper))
    if has_ddl and has_dml:
        return "mixed"
    if has_ddl:
        return "ddl"
    return "dml"

# ── Supabase Management API ───────────────────────────────────────────────────

def execute_sql(sql: str, project_ref: str, service_key: str, dry_run: bool = False) -> dict:
    """
    Execute arbitrary SQL against Supabase via the Management API.

    Returns a dict with keys: success (bool), message (str), duration_ms (float).
    """
    if dry_run:
        return {"success": True, "message": "(dry-run — not executed)", "duration_ms": 0}

    url = f"https://api.supabase.com/v1/projects/{project_ref}/database/query"
    payload = json.dumps({"query": sql}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={
            "Authorization": f"Bearer {service_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    ctx = ssl.create_default_context()
    t0 = time.monotonic()
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=120) as resp:
            body = resp.read().decode("utf-8")
            duration_ms = (time.monotonic() - t0) * 1000
            return {"success": True, "message": body[:200] if body.strip() else "OK", "duration_ms": duration_ms}
    except urllib.error.HTTPError as e:
        duration_ms = (time.monotonic() - t0) * 1000
        err_body = e.read().decode("utf-8")
        return {"success": False, "message": f"HTTP {e.code}: {err_body[:400]}", "duration_ms": duration_ms}
    except urllib.error.URLError as e:
        duration_ms = (time.monotonic() - t0) * 1000
        return {"success": False, "message": f"Network error: {e.reason}", "duration_ms": duration_ms}

# ── Commands ──────────────────────────────────────────────────────────────────

def cmd_list(args) -> None:
    """Print current migration status."""
    state = load_state()
    applied = set(state.get("applied", []))
    files = get_migration_files()

    if not files:
        print("No migration files found in", MIGRATIONS_DIR)
        return

    print(f"\nMigrations ({len(files)} total, {len(applied)} applied)\n")
    print(f"  {'STATUS':<11}  {'FILE'}")
    print(f"  {'-'*11}  {'-'*50}")
    for f in files:
        status = "[applied]" if f.name in applied else "[pending]"
        sql = f.read_text(encoding="utf-8")
        kind = classify_sql(sql)
        size_kb = len(sql.encode()) / 1024
        print(f"  {status:<11}  {f.name:<50}  ({kind}, {size_kb:.1f}kB)")

    pending = [f for f in files if f.name not in applied]
    if pending:
        print(f"\n  {len(pending)} pending migration(s) — run without --list to apply.")
    else:
        print("\n  All migrations applied.")
    print()


def cmd_apply(args) -> None:
    """Apply pending (or forced) migrations."""
    if not SERVICE_KEY:
        print("ERROR: SUPABASE_SERVICE_ROLE_KEY not set.", file=sys.stderr)
        print("Add it to .env.local — get it from:", file=sys.stderr)
        print("  Supabase Dashboard → Project Settings → API → service_role key", file=sys.stderr)
        print("", file=sys.stderr)
        print("Alternatively, run migrations manually in the Supabase SQL Editor", file=sys.stderr)
        print(f"and mark them applied with: --mark-applied <filename>", file=sys.stderr)
        sys.exit(1)

    if not PROJECT_REF:
        print("ERROR: Cannot determine project ref.", file=sys.stderr)
        print("Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_PROJECT_REF in .env.local", file=sys.stderr)
        sys.exit(1)

    state = load_state()
    applied_set = set(state.get("applied", []))
    files = get_migration_files()

    # Filter to specific migration if requested
    if args.migration:
        target = args.migration if args.migration.endswith(".sql") else args.migration + ".sql"
        files = [f for f in files if f.name == target]
        if not files:
            print(f"ERROR: Migration not found: {target}", file=sys.stderr)
            print(f"Available: {[f.name for f in get_migration_files()]}", file=sys.stderr)
            sys.exit(1)

    pending = files if args.force else [f for f in files if f.name not in applied_set]

    if not pending:
        print("Nothing to apply — all migrations are up to date.")
        print("Use --force to re-apply, or --list to see status.")
        return

    mode = "DRY RUN — " if args.dry_run else ""
    print(f"\n{mode}Applying {len(pending)} migration(s) to project {PROJECT_REF}\n")

    success_count = 0
    fail_count = 0

    for mig_file in pending:
        sql = mig_file.read_text(encoding="utf-8")
        kind = classify_sql(sql)
        size_kb = len(sql.encode()) / 1024
        prefix = "(already applied) " if args.force and mig_file.name in applied_set else ""
        print(f"  → {mig_file.name}  [{kind}, {size_kb:.1f}kB]  {prefix}")

        result = execute_sql(sql, PROJECT_REF, SERVICE_KEY, dry_run=args.dry_run)

        if result["success"]:
            print(f"     [ok] {result['duration_ms']:.0f}ms — {result['message']}")
            if not args.dry_run:
                if mig_file.name not in state["applied"]:
                    state["applied"].append(mig_file.name)
                save_state(state)
            success_count += 1
        else:
            print(f"     [FAILED] — {result['message']}", file=sys.stderr)
            fail_count += 1
            if not args.continue_on_error:
                print("\nAborting — fix the error above and re-run.", file=sys.stderr)
                print("Successfully applied migrations have been recorded.", file=sys.stderr)
                sys.exit(1)

    print(f"\n  Done: {success_count} applied, {fail_count} failed.\n")
    if fail_count:
        sys.exit(1)


def cmd_mark_applied(args) -> None:
    """Mark a migration as applied without executing it (for manual migrations)."""
    state = load_state()
    applied_set = set(state.get("applied", []))
    filename = args.mark_applied
    if not filename.endswith(".sql"):
        filename += ".sql"

    files = {f.name for f in get_migration_files()}
    if filename not in files:
        print(f"ERROR: {filename} is not a known migration file.", file=sys.stderr)
        sys.exit(1)

    if filename in applied_set:
        print(f"{filename} is already marked as applied.")
        return

    state["applied"].append(filename)
    save_state(state)
    print(f"Marked {filename} as applied.")

# ── CLI ───────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Sync SQL migrations to Supabase production.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--list", action="store_true", help="Show migration status and exit")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print what would be applied without executing")
    parser.add_argument("--force", action="store_true",
                        help="Re-apply all migrations (even already-applied ones)")
    parser.add_argument("--migration", metavar="FILE",
                        help="Apply only this specific migration file")
    parser.add_argument("--mark-applied", metavar="FILE",
                        help="Mark a migration as applied without executing it")
    parser.add_argument("--continue-on-error", action="store_true",
                        help="Keep going if a migration fails (default: stop on first error)")

    args = parser.parse_args()

    if args.list:
        cmd_list(args)
    elif args.mark_applied:
        cmd_mark_applied(args)
    else:
        cmd_apply(args)


if __name__ == "__main__":
    main()
