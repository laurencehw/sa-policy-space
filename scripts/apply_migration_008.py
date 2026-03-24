"""
Apply migration 008 — Enrich international_comparisons with textbook fields.

Requires SUPABASE_SERVICE_ROLE_KEY in the environment (or .env.local).
The service key is available at: Supabase Dashboard → Project Settings → API → service_role

Usage:
  1. Add SUPABASE_SERVICE_ROLE_KEY=<your-key> to .env.local  (or export it)
  2. python scripts/apply_migration_008.py

The script uses the Supabase Management REST API (/v1/projects/{ref}/database/query)
to execute the full migration SQL in a single request.
"""

import os
import sys
import json
import pathlib
import urllib.request
import urllib.error
import ssl

# ── Load env ──────────────────────────────────────────────────────────────────

ROOT = pathlib.Path(__file__).parent.parent

def load_env(path: pathlib.Path):
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        key = key.strip()
        val = val.strip().strip('"')
        if key not in os.environ:
            os.environ[key] = val

load_env(ROOT / ".env.local")

SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "")
PROJECT_REF = SUPABASE_URL.split("//")[-1].split(".")[0] if SUPABASE_URL else ""

if not SERVICE_KEY:
    print("ERROR: SUPABASE_SERVICE_ROLE_KEY not found.")
    print("Add it to .env.local — find it at:")
    print("  Supabase Dashboard → Project Settings → API → service_role key")
    print()
    print("Alternatively, run the migration manually in the Supabase SQL Editor:")
    print(f"  {ROOT / 'data' / 'migrations' / '008_enrich_comparisons.sql'}")
    sys.exit(1)

# ── Read migration SQL ─────────────────────────────────────────────────────────

sql_path = ROOT / "data" / "migrations" / "008_enrich_comparisons.sql"
sql = sql_path.read_text(encoding="utf-8")

print(f"Applying {sql_path.name} to project {PROJECT_REF} …")

# ── Execute via Supabase Management API ───────────────────────────────────────
# POST https://api.supabase.com/v1/projects/{ref}/database/query

api_url = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"

payload = json.dumps({"query": sql}).encode("utf-8")
req = urllib.request.Request(
    api_url,
    data=payload,
    headers={
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
    },
    method="POST",
)

ctx = ssl.create_default_context()
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        body = resp.read().decode()
        print("✓ Migration applied successfully.")
        if body.strip():
            print("Response:", body[:500])
except urllib.error.HTTPError as e:
    err_body = e.read().decode()
    print(f"✗ HTTP {e.code}: {err_body[:600]}")
    print()
    print("If the Management API requires a Personal Access Token (not service role key),")
    print("run the migration manually in the Supabase SQL Editor.")
    sys.exit(1)
