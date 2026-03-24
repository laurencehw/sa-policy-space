"""
Collect Housing / Human Settlements committee meetings from PMG API
and store them in the local SQLite database.

Committees:
  291 – Human Settlements (National Assembly, active from 2024)
   91 – Human Settlements, Water and Sanitation (National Assembly, inactive 2009–2024)

Run from project root:
    python scripts/collect_housing_pmg.py

Respects PMG rate-limit: 2-second sleep between paginated requests.
URLs stored as https://pmg.org.za/... (human-readable, not api.pmg.org.za).
"""

import json
import os
import re
import sqlite3
import time
import urllib.request
from html.parser import HTMLParser

# ── Config ──────────────────────────────────────────────────────────────────

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "policy_ideas.db")
PMG_BASE = "https://api.pmg.org.za"
COMMITTEES = [
    (291, "Human Settlements"),
    (91, "Human Settlements, Water and Sanitation"),
]
DELAY = 2.5  # seconds between requests


# ── Helpers ─────────────────────────────────────────────────────────────────

def get_json(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "SA-Policy-Research/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


class HTMLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)

    def get_text(self):
        return " ".join(self.parts).strip()


def strip_html(html: str) -> str:
    if not html:
        return ""
    s = HTMLStripper()
    s.feed(html)
    return re.sub(r"\s+", " ", s.get_text()).strip()


def pmg_human_url(api_url: str) -> str:
    """Convert api.pmg.org.za/... URL to pmg.org.za/..."""
    if not api_url:
        return api_url
    return (
        api_url.replace("http://api.pmg.org.za", "https://pmg.org.za")
               .replace("https://api.pmg.org.za", "https://pmg.org.za")
    )


# ── Collection ───────────────────────────────────────────────────────────────

def fetch_all_meetings(committee_id: int, committee_name: str) -> list[dict]:
    """Paginate through all meetings for a committee."""
    url = f"{PMG_BASE}/committee-meeting/?format=json&filter[committee_id]={committee_id}&per_page=100"
    meetings = []
    page = 1
    while url:
        print(f"  [{committee_name}] page {page} …")
        data = get_json(url)
        batch = data.get("results", [])
        meetings.extend(batch)
        url = data.get("next")
        if url:
            time.sleep(DELAY)
        page += 1
    print(f"  [{committee_name}] fetched {len(meetings)} meetings total")
    return meetings


def insert_meetings(conn: sqlite3.Connection, meetings: list[dict], committee_id: int, committee_name: str) -> int:
    """Insert meetings into DB, skipping duplicates. Returns count inserted."""
    inserted = 0
    for m in meetings:
        pmg_id = m.get("id")
        date_raw = m.get("date") or ""
        date_str = date_raw[:10] if date_raw else None  # YYYY-MM-DD

        summary_html = m.get("summary") or ""
        body_html = m.get("body") or ""
        # Use summary if available, else truncate body
        if summary_html:
            summary_clean = strip_html(summary_html)[:2000]
        else:
            summary_clean = strip_html(body_html)[:2000]

        pmg_url = pmg_human_url(m.get("url") or "")

        # Count documents
        files = m.get("files") or []
        num_docs = len(files)

        try:
            conn.execute(
                """
                INSERT INTO meetings
                    (pmg_meeting_id, committee_name, committee_id, date, title,
                     summary_clean, pmg_url, num_documents)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    pmg_id,
                    committee_name,
                    committee_id,
                    date_str,
                    m.get("title"),
                    summary_clean,
                    pmg_url,
                    num_docs,
                ),
            )
            inserted += 1
        except sqlite3.IntegrityError:
            pass  # already exists (UNIQUE pmg_meeting_id)

    conn.commit()
    return inserted


# ── Documents ────────────────────────────────────────────────────────────────

def insert_documents(conn: sqlite3.Connection, meetings: list[dict]) -> int:
    """Insert document records linked to their meetings."""
    inserted = 0
    for m in meetings:
        pmg_id = m.get("id")
        row = conn.execute(
            "SELECT id FROM meetings WHERE pmg_meeting_id = ?", (pmg_id,)
        ).fetchone()
        if not row:
            continue
        meeting_db_id = row[0]

        for f in m.get("files") or []:
            file_url = f.get("url") or ""
            ext = os.path.splitext(file_url)[-1].lstrip(".").lower() or None
            try:
                conn.execute(
                    """
                    INSERT INTO documents (meeting_id, title, file_type, pmg_file_url, description)
                    VALUES (?, ?, ?, ?, ?)
                    """,
                    (meeting_db_id, f.get("title"), ext, file_url, f.get("description")),
                )
                inserted += 1
            except sqlite3.IntegrityError:
                pass

    conn.commit()
    return inserted


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")

    total_meetings = 0
    total_docs = 0
    all_meetings_by_committee = {}

    for cid, cname in COMMITTEES:
        print(f"\nCollecting: {cname} (ID={cid})")
        meetings = fetch_all_meetings(cid, cname)
        all_meetings_by_committee[cid] = meetings

        n = insert_meetings(conn, meetings, cid, cname)
        d = insert_documents(conn, meetings)
        print(f"  >> Inserted {n} new meetings, {d} documents")
        total_meetings += n
        total_docs += d

    # Summary
    cur = conn.cursor()
    cur.execute(
        "SELECT committee_id, committee_name, COUNT(*) as cnt "
        "FROM meetings WHERE committee_id IN (291, 91) "
        "GROUP BY committee_id, committee_name"
    )
    rows = cur.fetchall()
    print("\n-- DB Summary --")
    for r in rows:
        print(f"  Committee {r[0]} ({r[1]}): {r[2]} meetings")
    print(f"  Total new meetings inserted: {total_meetings}")
    print(f"  Total documents inserted:    {total_docs}")

    conn.close()
    print("\nDone. Run extract_housing_ideas.py next.")


if __name__ == "__main__":
    main()
