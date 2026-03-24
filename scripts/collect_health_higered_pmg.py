"""
Collect Health (63) and Higher Education & Training (64) committee meetings
from PMG API and store them in the local SQLite database.

Committees:
  63  – Health (Portfolio Committee on Health)
  64  – Higher Education and Training

Run from project root:
    python scripts/collect_health_higered_pmg.py

Respects PMG rate-limit: 2.5-second sleep between paginated requests.
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
    (63, "Health"),
    (64, "Higher Education and Training"),
]
DELAY = 2.5  # seconds between requests

# Map committee_id → source_committee name in policy_ideas table
COMMITTEE_SOURCE_MAP = {
    63: "Health",
    64: "Higher Education and Training",
}

# Keywords for linking ideas to meetings (idea_id → list of search terms)
IDEA_KEYWORDS = {
    # Health ideas (IDs 104–113)
    104: ["NHI", "national health insurance", "health fund"],
    105: ["PEPFAR", "HIV", "AIDS", "antiretroviral"],
    106: ["healthcare worker", "health worker", "community health worker", "CHW"],
    107: ["tuberculosis", "TB", "TB elimination", "drug-resistant"],
    108: ["primary health", "PHC", "clinic", "community health"],
    109: ["mental health", "Mental Health Care Act", "psychiatric"],
    110: ["tobacco", "electronic nicotine", "vaping", "cigarette"],
    111: ["provincial health", "health department", "turnaround", "underspending"],
    112: ["private health", "health market inquiry", "medical scheme", "HMI"],
    113: ["SAHPRA", "medicines", "African medicines", "regulatory authority"],
    # Higher Education ideas (IDs 50–57)
    50: ["NSFAS", "student funding", "bursary", "post-school"],
    51: ["TVET", "artisan", "vocational", "technical college"],
    52: ["SETA", "skills development levy", "skills levy", "sector education"],
    53: ["certification backlog", "graduation backlog", "outstanding certificates"],
    54: ["research", "R&D", "innovation", "gross expenditure on R&D"],
    55: ["NSFAS fraud", "NSFAS administration", "student allowance fraud"],
    56: ["CET college", "community education", "second chance", "adult education"],
    57: ["advanced manufacturing", "electric vehicle", "energy transition", "green skills"],
}


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
        if summary_html:
            summary_clean = strip_html(summary_html)[:2000]
        else:
            summary_clean = strip_html(body_html)[:2000]

        pmg_url = pmg_human_url(m.get("url") or "")

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


def link_ideas_to_meetings(conn: sqlite3.Connection, committee_ids: list[int]) -> int:
    """Link existing policy ideas to their source meetings using keyword search."""
    cur = conn.cursor()
    links_inserted = 0

    for idea_id, keywords in IDEA_KEYWORDS.items():
        for kw in keywords[:2]:  # use top 2 keywords per idea
            cur.execute(
                """
                SELECT id FROM meetings
                WHERE committee_id IN ({})
                  AND (lower(title) LIKE ? OR lower(summary_clean) LIKE ?)
                ORDER BY date DESC
                LIMIT 3
                """.format(",".join("?" * len(committee_ids))),
                (*committee_ids, f"%{kw.lower()}%", f"%{kw.lower()}%"),
            )
            for (meeting_db_id,) in cur.fetchall():
                try:
                    conn.execute(
                        "INSERT INTO idea_meetings (idea_id, meeting_id) VALUES (?, ?)",
                        (idea_id, meeting_db_id),
                    )
                    links_inserted += 1
                except sqlite3.IntegrityError:
                    pass  # duplicate link

    conn.commit()
    return links_inserted


# ── Supabase migration SQL ────────────────────────────────────────────────────

def escape_sql_string(s) -> str:
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"


def generate_migration_sql(conn: sqlite3.Connection, committee_ids: list[int]) -> str:
    cur = conn.cursor()

    # Fetch meetings
    cur.execute(
        """
        SELECT pmg_meeting_id, committee_name, committee_id, date, title,
               summary_clean, pmg_url, num_documents
        FROM meetings
        WHERE committee_id IN ({})
        ORDER BY committee_id, date
        """.format(",".join("?" * len(committee_ids))),
        committee_ids,
    )
    meetings = cur.fetchall()

    # Fetch idea_meetings links for these committees' ideas
    idea_ids = list(IDEA_KEYWORDS.keys())
    cur.execute(
        """
        SELECT im.idea_id, im.meeting_id
        FROM idea_meetings im
        JOIN meetings m ON m.id = im.meeting_id
        WHERE m.committee_id IN ({})
        ORDER BY im.idea_id, im.meeting_id
        """.format(",".join("?" * len(committee_ids))),
        committee_ids,
    )
    links = cur.fetchall()

    lines = []
    lines.append("-- Health & Higher Education — Supabase Migration")
    lines.append("-- Generated from PMG committee data (committees 63 & 64)")
    lines.append(f"-- {len(meetings)} meetings")
    lines.append("-- Run in Supabase SQL editor after existing migrations")
    lines.append("")
    lines.append("-- ============================================================")
    lines.append(f"-- 1. MEETINGS ({len(meetings)} rows from committees 63 and 64)")
    lines.append("-- ============================================================")
    lines.append("")
    lines.append("INSERT INTO meetings")
    lines.append("    (pmg_meeting_id, committee_name, committee_id, date, title,")
    lines.append("     summary_clean, pmg_url, num_documents)")
    lines.append("VALUES")

    rows = []
    for pmg_id, cname, cid, date, title, summary, url, ndocs in meetings:
        row = (
            f"    ({pmg_id}, {escape_sql_string(cname)}, {cid}, "
            f"{escape_sql_string(date)}, {escape_sql_string(title)}, "
            f"{escape_sql_string(summary)}, {escape_sql_string(url)}, {ndocs or 0})"
        )
        rows.append(row)
    lines.append(",\n".join(rows))
    lines.append("ON CONFLICT (pmg_meeting_id) DO NOTHING;")
    lines.append("")

    if links:
        lines.append("-- ============================================================")
        lines.append(f"-- 2. IDEA-MEETING LINKS ({len(links)} rows)")
        lines.append("-- ============================================================")
        lines.append("")
        lines.append("INSERT INTO idea_meetings (idea_id, meeting_id)")
        lines.append("SELECT pi.id, m.id")
        lines.append("FROM meetings m")
        lines.append("JOIN policy_ideas pi ON pi.id IN (")
        lines.append("    -- idea_id mapped via pmg_meeting_id lookup")
        lines.append("    SELECT idea_id FROM (VALUES")

        link_rows = []
        for idea_id, meeting_db_id in links:
            # Get pmg_meeting_id for this meeting
            cur.execute("SELECT pmg_meeting_id FROM meetings WHERE id = ?", (meeting_db_id,))
            pmg_row = cur.fetchone()
            if pmg_row:
                link_rows.append(f"        ({idea_id}, {pmg_row[0]})")

        if link_rows:
            lines.append(",\n".join(link_rows))
            lines.append("    ) AS t(idea_id, pmg_meeting_id)")
            lines.append("    WHERE t.pmg_meeting_id = m.pmg_meeting_id")
            lines.append(")")
            lines.append("WHERE m.pmg_meeting_id IN (")
            pmg_ids_str = ", ".join(str(r[1]) for r in links if cur.execute("SELECT pmg_meeting_id FROM meetings WHERE id=?", (r[1],)).fetchone())

    # Simpler approach for idea_meetings - direct INSERT with pmg_meeting_id subquery
    lines_idea = []
    lines_idea.append("")
    lines_idea.append("-- ============================================================")
    lines_idea.append(f"-- 2. IDEA-MEETING LINKS")
    lines_idea.append("-- ============================================================")
    lines_idea.append("")

    # Build a flat INSERT with explicit (idea_id, pmg_meeting_id) pairs
    cur.execute(
        """
        SELECT im.idea_id, m.pmg_meeting_id
        FROM idea_meetings im
        JOIN meetings m ON m.id = im.meeting_id
        WHERE m.committee_id IN ({})
        ORDER BY im.idea_id, m.pmg_meeting_id
        """.format(",".join("?" * len(committee_ids))),
        committee_ids,
    )
    flat_links = cur.fetchall()

    if flat_links:
        lines_idea.append("INSERT INTO idea_meetings (idea_id, meeting_id)")
        lines_idea.append("SELECT v.idea_id, m.id")
        lines_idea.append("FROM (VALUES")
        vrows = [f"    ({idea_id}, {pmg_id})" for idea_id, pmg_id in flat_links]
        lines_idea.append(",\n".join(vrows))
        lines_idea.append(") AS v(idea_id, pmg_meeting_id)")
        lines_idea.append("JOIN meetings m ON m.pmg_meeting_id = v.pmg_meeting_id")
        lines_idea.append("ON CONFLICT DO NOTHING;")

    # Replace the complex link section with the simpler one
    # Find where link section starts
    result = "\n".join(lines)
    # Strip the incomplete link section and append the clean one
    link_start = result.find("-- ============================================================\n-- 2. IDEA-MEETING LINKS")
    if link_start != -1:
        result = result[:link_start]
    result = result + "\n".join(lines_idea)

    return result


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")

    committee_ids = [cid for cid, _ in COMMITTEES]
    total_meetings = 0
    total_docs = 0
    all_raw: dict[int, list[dict]] = {}

    for cid, cname in COMMITTEES:
        print(f"\nCollecting: {cname} (ID={cid})")
        meetings = fetch_all_meetings(cid, cname)
        all_raw[cid] = meetings

        n = insert_meetings(conn, meetings, cid, cname)
        d = insert_documents(conn, meetings)
        print(f"  >> Inserted {n} new meetings, {d} documents")
        total_meetings += n
        total_docs += d

    # Link ideas to meetings
    print("\nLinking ideas to meetings …")
    links = link_ideas_to_meetings(conn, committee_ids)
    print(f"  >> {links} idea_meetings links inserted")

    # Summary
    cur = conn.cursor()
    cur.execute(
        "SELECT committee_id, committee_name, COUNT(*) "
        "FROM meetings WHERE committee_id IN (63, 64) "
        "GROUP BY committee_id, committee_name"
    )
    print("\n-- DB Summary --")
    for r in cur.fetchall():
        print(f"  Committee {r[0]} ({r[1]}): {r[2]} meetings")
    print(f"  Total new meetings inserted: {total_meetings}")
    print(f"  Total documents inserted:    {total_docs}")
    print(f"  Total idea_meetings links:   {links}")

    # Generate migration SQL
    out_path = os.path.join(os.path.dirname(__file__), "..", "data", "supabase_health_higered_meetings.sql")
    print(f"\nGenerating migration SQL -> {out_path}")
    sql = generate_migration_sql(conn, committee_ids)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(sql)
    size_kb = os.path.getsize(out_path) / 1024
    print(f"  Written: {os.path.basename(out_path)} ({size_kb:.1f} KB)")

    conn.close()
    print("\nDone.")


if __name__ == "__main__":
    main()
