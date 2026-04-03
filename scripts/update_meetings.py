"""
SA Policy Space — PMG Data Updater
===================================
Fetches new committee meetings and documents from the PMG API
and upserts them into the Supabase database.

Usage:
    python update_meetings.py                  # fetch meetings from last 30 days
    python update_meetings.py --days 90        # fetch meetings from last 90 days
    python update_meetings.py --since 2026-03-01  # fetch meetings since a specific date

Environment variables required:
    SUPABASE_URL      - Your Supabase project URL
    SUPABASE_KEY      - Your Supabase service_role key (NOT the anon key)
"""

import os
import sys
import time
import logging
import argparse
import requests
from datetime import datetime, timedelta
from supabase import create_client

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

PMG_API_BASE = "https://api.pmg.org.za"

# The 15 committees you track
TRACKED_COMMITTEES = {
    28: "Basic Education",
    3: "Energy",
    75: "Finance Select Committee (NCOP)",
    24: "Finance Standing Committee",
    63: "Health",
    64: "Higher Education and Training",
    291: "Human Settlements",
    91: "Human Settlements, Water and Sanitation",
    58: "Mineral Resources",
    73: "Public Enterprises",
    32: "Public Works and Infrastructure",
    23: "Science, Technology and Innovation",
    116: "Small Business Development",
    98: "Trade, Industry and Competition",
    26: "Transport",
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# PMG API helpers
# ---------------------------------------------------------------------------

def pmg_get(endpoint: str, params: dict | None = None) -> list[dict]:
    """
    Fetch all pages from a PMG API endpoint.
    Returns the combined list of results.
    """
    url = f"{PMG_API_BASE}/{endpoint}/"
    all_results = []
    params = params or {}
    page = 0

    while url:
        params_with_page = {**params, "page": page}
        log.debug(f"GET {url} params={params_with_page}")

        resp = requests.get(url, params=params_with_page, timeout=60)
        resp.raise_for_status()
        data = resp.json()

        results = data.get("results", [])
        all_results.extend(results)
        log.info(f"  Fetched page {page}: {len(results)} results (total so far: {len(all_results)})")

        # PMG returns a 'next' URL for pagination
        next_url = data.get("next")
        if next_url and len(results) > 0:
            url = next_url
            params = {}  # next URL already has params baked in
            page += 1
            time.sleep(0.5)  # be polite to the API
        else:
            break

    return all_results


def fetch_meetings_for_committee(committee_id: int, since_date: str) -> list[dict]:
    """Fetch meetings for a single committee since a given date."""
    # The PMG API supports filtering by committee_id
    # We'll fetch all and filter by date client-side for reliability
    meetings = pmg_get("committee-meeting", {
        "filter[committee_id]": committee_id,
    })

    # Filter to only meetings on or after since_date
    filtered = []
    for m in meetings:
        meeting_date = m.get("date", "")
        if meeting_date and meeting_date >= since_date:
            filtered.append(m)

    return filtered


def fetch_meeting_detail(pmg_meeting_id: int) -> dict:
    """Fetch full detail for a single meeting (includes documents/files)."""
    url = f"{PMG_API_BASE}/committee-meeting/{pmg_meeting_id}/"
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    return resp.json()

# ---------------------------------------------------------------------------
# Supabase helpers
# ---------------------------------------------------------------------------

def get_supabase_client():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        log.error("Missing SUPABASE_URL or SUPABASE_KEY environment variables")
        sys.exit(1)
    return create_client(url, key)


def get_existing_pmg_ids(supabase) -> set[int]:
    """Get all pmg_meeting_ids already in the database."""
    result = supabase.table("meetings").select("pmg_meeting_id").execute()
    return {row["pmg_meeting_id"] for row in result.data}


def upsert_meeting(supabase, meeting_data: dict, committee_id: int, committee_name: str) -> int | None:
    """
    Insert or update a meeting in Supabase.
    Returns the meeting's Supabase id, or None on failure.
    """
    pmg_id = meeting_data.get("id")
    row = {
        "pmg_meeting_id": pmg_id,
        "committee_name": committee_name,
        "committee_id": committee_id,
        "date": meeting_data.get("date"),
        "title": meeting_data.get("title", ""),
        "summary_clean": clean_summary(meeting_data.get("summary", "")),
        "pmg_url": f"https://pmg.org.za/committee-meeting/{pmg_id}/",
        "num_documents": len(meeting_data.get("files", [])),
    }

    result = supabase.table("meetings").upsert(
        row,
        on_conflict="pmg_meeting_id",  # uses the unique constraint
    ).execute()

    if result.data:
        return result.data[0]["id"]
    return None


def upsert_documents(supabase, meeting_db_id: int, files: list[dict]):
    """Insert documents associated with a meeting."""
    if not files:
        return

    for f in files:
        file_url = f.get("url", "")
        file_title = f.get("title", "")
        file_type = infer_file_type(file_url)

        row = {
            "meeting_id": meeting_db_id,
            "title": file_title,
            "file_type": file_type,
            "pmg_file_url": file_url,
            "description": f.get("description", ""),
        }

        # Check if this exact document already exists (by meeting + url)
        existing = (
            supabase.table("documents")
            .select("id")
            .eq("meeting_id", meeting_db_id)
            .eq("pmg_file_url", file_url)
            .execute()
        )
        if existing.data:
            continue  # skip duplicates

        supabase.table("documents").insert(row).execute()

# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

def clean_summary(raw: str) -> str:
    """Basic cleanup of HTML tags from PMG summaries."""
    if not raw:
        return ""
    # Strip common HTML tags
    import re
    text = re.sub(r"<[^>]+>", " ", raw)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def infer_file_type(url: str) -> str:
    """Infer file type from URL extension."""
    url_lower = url.lower()
    for ext in ["pdf", "pptx", "ppt", "docx", "doc", "xlsx", "xls", "mp3", "mp4"]:
        if url_lower.endswith(f".{ext}"):
            return ext
    return "other"

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Update SA Policy Space with new PMG meetings")
    parser.add_argument("--days", type=int, default=30, help="Fetch meetings from the last N days (default: 30)")
    parser.add_argument("--since", type=str, default=None, help="Fetch meetings since this date (YYYY-MM-DD)")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be fetched without writing to DB")
    args = parser.parse_args()

    if args.since:
        since_date = args.since
    else:
        since_date = (datetime.now() - timedelta(days=args.days)).strftime("%Y-%m-%d")

    log.info(f"Fetching meetings since {since_date}")

    # Connect to Supabase
    if not args.dry_run:
        supabase = get_supabase_client()
        existing_ids = get_existing_pmg_ids(supabase)
        log.info(f"Found {len(existing_ids)} existing meetings in database")
    else:
        existing_ids = set()

    total_new = 0
    total_docs = 0

    for committee_id, committee_name in TRACKED_COMMITTEES.items():
        log.info(f"\n--- {committee_name} (PMG committee_id={committee_id}) ---")

        try:
            meetings = fetch_meetings_for_committee(committee_id, since_date)
        except Exception as e:
            log.error(f"  Failed to fetch meetings: {e}")
            continue

        # Filter out meetings we already have
        new_meetings = [m for m in meetings if m.get("id") not in existing_ids]
        log.info(f"  Found {len(meetings)} meetings since {since_date}, {len(new_meetings)} are new")

        if args.dry_run:
            for m in new_meetings:
                log.info(f"  [DRY RUN] Would add: {m.get('date')} - {m.get('title', '')[:80]}")
            total_new += len(new_meetings)
            continue

        for m in new_meetings:
            pmg_id = m.get("id")
            try:
                # Fetch full meeting detail to get documents
                detail = fetch_meeting_detail(pmg_id)
                time.sleep(0.3)

                meeting_db_id = upsert_meeting(supabase, detail, committee_id, committee_name)
                if meeting_db_id is None:
                    log.warning(f"  Failed to upsert meeting {pmg_id}")
                    continue

                files = detail.get("files", [])
                upsert_documents(supabase, meeting_db_id, files)

                log.info(f"  Added: {detail.get('date')} - {detail.get('title', '')[:60]} ({len(files)} docs)")
                total_new += 1
                total_docs += len(files)

            except Exception as e:
                log.error(f"  Error processing meeting {pmg_id}: {e}")
                continue

    log.info(f"\n{'='*60}")
    log.info(f"Done! Added {total_new} new meetings and {total_docs} documents.")
    if args.dry_run:
        log.info("(This was a dry run — nothing was written to the database)")


if __name__ == "__main__":
    main()
