"""
Collect meetings from 5 missing PMG committees and store in local SQLite.

Committees:
  62  – Employment and Labour (→ labour_market)
  86  – Police (→ crime_safety)
  38  – Justice and Constitutional Development (→ crime_safety, corruption_governance)
  111 – Water and Sanitation (→ water)
  108 – Forestry, Fisheries and the Environment (→ climate_environment)

Features:
  - Exponential backoff retry (2s, 4s, 8s) on HTTP errors
  - Checkpoint file (.collect_state.json) for resumable runs
  - Rate limiting (2.5s between requests)

Run from project root:
    python scripts/collect_missing_committees.py
"""

import json
import os
import re
import sqlite3
import time
import urllib.request
import urllib.error
from html.parser import HTMLParser
from pathlib import Path

# ── Config ──────────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DB_PATH = os.environ.get(
    "SQLITE_DB_PATH",
    str(PROJECT_ROOT / "data" / "dev.sqlite3"),
)
CHECKPOINT_PATH = SCRIPT_DIR / ".collect_state.json"

PMG_BASE = "https://api.pmg.org.za"
DELAY = 2.5  # seconds between requests
MAX_RETRIES = 3

COMMITTEES = [
    (62, "Employment and Labour"),
    (86, "Police"),
    (38, "Justice and Constitutional Development"),
    (111, "Water and Sanitation"),
    (108, "Forestry, Fisheries and the Environment"),
]

# ── Helpers ─────────────────────────────────────────────────────────────────


class HTMLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts: list[str] = []

    def handle_data(self, data: str):
        self.parts.append(data)

    def get_text(self) -> str:
        return " ".join(self.parts).strip()


def strip_html(html: str) -> str:
    if not html:
        return ""
    s = HTMLStripper()
    s.feed(html)
    text = s.get_text()
    # Collapse whitespace
    text = re.sub(r"\s+", " ", text).strip()
    return text[:2000]  # cap at 2000 chars


def pmg_to_public_url(api_url: str | None) -> str:
    if not api_url:
        return ""
    return re.sub(r"https?://api\.pmg\.org\.za/", "https://pmg.org.za/", api_url)


def get_json(url: str) -> dict:
    """Fetch JSON with exponential backoff retry."""
    for attempt in range(MAX_RETRIES):
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": "SA-Policy-Research/1.0"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read())
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
            wait = 2 ** (attempt + 1)  # 2s, 4s, 8s
            print(f"    Retry {attempt + 1}/{MAX_RETRIES} after {wait}s: {e}")
            time.sleep(wait)
    raise RuntimeError(f"Failed after {MAX_RETRIES} retries: {url}")


# ── Checkpoint ──────────────────────────────────────────────────────────────


def load_checkpoint() -> dict:
    if CHECKPOINT_PATH.exists():
        return json.loads(CHECKPOINT_PATH.read_text())
    return {}


def save_checkpoint(state: dict):
    CHECKPOINT_PATH.write_text(json.dumps(state, indent=2))


# ── Database ────────────────────────────────────────────────────────────────


def ensure_tables(db: sqlite3.Connection):
    db.execute("""
        CREATE TABLE IF NOT EXISTS meetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pmg_meeting_id INTEGER UNIQUE,
            committee_name TEXT NOT NULL,
            committee_id INTEGER,
            date TEXT,
            title TEXT,
            summary_clean TEXT,
            pmg_url TEXT,
            num_documents INTEGER DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now'))
        )
    """)
    db.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            meeting_id INTEGER NOT NULL REFERENCES meetings(id),
            title TEXT,
            file_type TEXT,
            pmg_file_url TEXT,
            description TEXT
        )
    """)
    db.commit()


# ── Collection ──────────────────────────────────────────────────────────────


def collect_committee(
    db: sqlite3.Connection,
    committee_id: int,
    committee_name: str,
    checkpoint: dict,
) -> int:
    """Fetch all meetings for a committee. Returns count of new meetings inserted."""
    checkpoint_key = f"committee_{committee_id}"
    last_page = checkpoint.get(checkpoint_key, 0)

    url = (
        f"{PMG_BASE}/committee-meeting/"
        f"?format=json&filter[committee_id]={committee_id}&per_page=100"
    )

    total_inserted = 0
    page = 0

    while url:
        page += 1
        if page <= last_page:
            # Skip already-fetched pages — need to advance the URL
            print(f"  Page {page} (checkpointed, skipping fetch)...")
            # We still need the URL for the next page, so fetch but don't insert
            data = get_json(url)
            url = data.get("next")
            time.sleep(DELAY)
            continue

        print(f"  Page {page}: {url[:80]}...")
        data = get_json(url)
        results = data.get("results", [])

        for meeting in results:
            pmg_id = meeting.get("id")
            if not pmg_id:
                continue

            # Skip if already in DB
            existing = db.execute(
                "SELECT id FROM meetings WHERE pmg_meeting_id = ?", (pmg_id,)
            ).fetchone()
            if existing:
                continue

            date = meeting.get("date", "")
            title = meeting.get("title", "")
            body = strip_html(meeting.get("body", "") or "")
            pmg_url = pmg_to_public_url(meeting.get("url", ""))
            files = meeting.get("files", []) or []
            num_docs = len(files)

            cursor = db.execute(
                """
                INSERT INTO meetings (pmg_meeting_id, committee_name, committee_id,
                                      date, title, summary_clean, pmg_url, num_documents)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (pmg_id, committee_name, committee_id, date, title, body, pmg_url, num_docs),
            )
            meeting_db_id = cursor.lastrowid

            # Insert documents
            for f in files:
                db.execute(
                    """
                    INSERT INTO documents (meeting_id, title, file_type, pmg_file_url, description)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (
                        meeting_db_id,
                        f.get("title", ""),
                        f.get("file_type", ""),
                        pmg_to_public_url(f.get("url", "")),
                        f.get("description", ""),
                    ),
                )

            total_inserted += 1

        db.commit()

        # Save checkpoint after each page
        checkpoint[checkpoint_key] = page
        save_checkpoint(checkpoint)

        url = data.get("next")
        if url:
            time.sleep(DELAY)

    return total_inserted


# ── Main ────────────────────────────────────────────────────────────────────


def main():
    print(f"Database: {DB_PATH}")
    print(f"Checkpoint: {CHECKPOINT_PATH}")
    print()

    db = sqlite3.connect(DB_PATH)
    ensure_tables(db)
    checkpoint = load_checkpoint()

    total = 0
    for committee_id, committee_name in COMMITTEES:
        print(f"Collecting: {committee_name} (ID {committee_id})")
        try:
            count = collect_committee(db, committee_id, committee_name, checkpoint)
            print(f"  → {count} new meetings inserted\n")
            total += count
        except Exception as e:
            print(f"  ERROR: {e}\n")
            continue

    db.close()
    print(f"Done. {total} new meetings inserted across {len(COMMITTEES)} committees.")
    print(f"Database: {DB_PATH}")


if __name__ == "__main__":
    main()
