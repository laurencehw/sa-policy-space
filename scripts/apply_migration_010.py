"""
Apply migration 010 — Fill economic_impact_estimate and source_url on policy_ideas.

Parses UPDATE statements from data/migrations/010_fill_gaps.sql and
PATCHes each row via the Supabase REST API.

Usage:
  python scripts/apply_migration_010.py
"""

import os
import re
import sys
import json
import pathlib
import urllib.request
import urllib.error
import ssl

ROOT = pathlib.Path(__file__).parent.parent

# ── Load env ───────────────────────────────────────────────────────────────

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
load_env(ROOT / ".env.production.local")

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
ANON_KEY     = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

if not SUPABASE_URL or not ANON_KEY:
    print("ERROR: NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY not found.")
    sys.exit(1)

HEADERS = {
    "apikey":        ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
}

ctx = ssl.create_default_context()

# ── Parse SQL ──────────────────────────────────────────────────────────────

SQL_FILE = ROOT / "data" / "migrations" / "010_fill_gaps.sql"
sql_text = SQL_FILE.read_text(encoding="utf-8")

# Match: UPDATE policy_ideas SET economic_impact_estimate = '...', source_url = '...' WHERE id = N;
UPDATE_RE = re.compile(
    r"UPDATE policy_ideas SET "
    r"economic_impact_estimate = '((?:[^']|'')*)', "
    r"source_url = '((?:[^']|'')*)' "
    r"WHERE id = (\d+);",
    re.DOTALL,
)

updates = []
for m in UPDATE_RE.finditer(sql_text):
    eie = m.group(1).replace("''", "'")
    url = m.group(2).replace("''", "'")
    rid = int(m.group(3))
    updates.append((rid, eie, url))

print(f"Parsed {len(updates)} UPDATE statements from {SQL_FILE.name}")

# ── Patch each row ─────────────────────────────────────────────────────────

succeeded = 0
failed    = 0

for i, (row_id, eie, url) in enumerate(updates, 1):
    payload = json.dumps({
        "economic_impact_estimate": eie,
        "source_url": url,
    }).encode()
    req = urllib.request.Request(
        SUPABASE_URL + f"/rest/v1/policy_ideas?id=eq.{row_id}",
        data=payload,
        headers=HEADERS,
        method="PATCH",
    )
    try:
        with urllib.request.urlopen(req, context=ctx) as r:
            succeeded += 1
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:300]
        print(f"  ERROR id={row_id}: HTTP {e.code} — {body}")
        failed += 1

    if i % 20 == 0 or i == len(updates):
        print(f"  {i}/{len(updates)} processed …")

print(f"\nDone. Succeeded: {succeeded}, Failed: {failed}")
if failed:
    sys.exit(1)
