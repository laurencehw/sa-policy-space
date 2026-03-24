"""
Apply migration 009 — Fix PMG URLs (http://api.pmg.org.za → https://pmg.org.za).

Uses the Supabase REST API (PostgREST) with the anon key, which has UPDATE
permission on meetings.pmg_url.  Fetches all affected rows, computes the
corrected URL in Python, then PATCHes each row by id.

Usage:
  python scripts/apply_migration_009.py
"""

import os
import re
import sys
import json
import time
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
    "Prefer":        "return=representation",
}

ctx = ssl.create_default_context()
API_PMG_RE = re.compile(r"https?://api\.pmg\.org\.za/")


def get(path: str, *, extra_headers=None):
    req = urllib.request.Request(
        SUPABASE_URL + path,
        headers={**HEADERS, **(extra_headers or {})},
    )
    with urllib.request.urlopen(req, context=ctx) as r:
        return json.loads(r.read().decode()), dict(r.headers)


def patch_row(table: str, row_id: int, payload: dict):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        SUPABASE_URL + f"/rest/v1/{table}?id=eq.{row_id}",
        data=data,
        headers={**HEADERS, "Prefer": "return=minimal"},
        method="PATCH",
    )
    with urllib.request.urlopen(req, context=ctx) as r:
        return r.status


# ── Fetch all meetings with api.pmg URLs ──────────────────────────────────

print("Fetching meetings with api.pmg.org.za URLs …")
rows = []
page_size = 1000
offset = 0
while True:
    data, hdrs = get(
        f"/rest/v1/meetings?pmg_url=ilike.*api.pmg.org.za*"
        f"&select=id,pmg_url&limit={page_size}&offset={offset}",
        extra_headers={"Range": f"{offset}-{offset + page_size - 1}"},
    )
    rows.extend(data)
    cr = hdrs.get("Content-Range", "")
    # Content-Range: 0-999/1061  → parse total
    try:
        total = int(cr.split("/")[1])
    except (IndexError, ValueError):
        total = len(rows)
    print(f"  fetched {len(rows)} / {total}")
    if len(rows) >= total:
        break
    offset += page_size

print(f"Total rows to fix: {len(rows)}")
if not rows:
    print("Nothing to do.")
    sys.exit(0)

# ── Patch each row ─────────────────────────────────────────────────────────

fixed = 0
errors = 0
for i, row in enumerate(rows, 1):
    old_url = row["pmg_url"] or ""
    new_url = API_PMG_RE.sub("https://pmg.org.za/", old_url)
    if new_url == old_url:
        continue
    try:
        status = patch_row("meetings", row["id"], {"pmg_url": new_url})
        fixed += 1
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:200]
        print(f"  ERROR patching id={row['id']}: HTTP {e.code} — {body}")
        errors += 1
    if i % 100 == 0:
        print(f"  processed {i}/{len(rows)} …")

print(f"\nDone. Fixed: {fixed}, Errors: {errors}")
if errors:
    sys.exit(1)
