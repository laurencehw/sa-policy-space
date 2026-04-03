"""
SA Policy Space — Vulekamali Budget Data Updater
==================================================
Fetches national department budget data by scraping CSV download links
from vulekamali.gov.za and upserts into the Supabase department_budgets table.

Usage:
    python update_budgets.py                       # fetch 2026-27 (latest)
    python update_budgets.py --year 2025-26        # fetch a specific financial year
    python update_budgets.py --all-years           # fetch all available years
    python update_budgets.py --dry-run             # show what would be fetched

Environment variables required:
    SUPABASE_URL      - Your Supabase project URL
    SUPABASE_KEY      - Your Supabase service_role key
"""

import os
import sys
import re
import csv
import io
import logging
import argparse
from urllib.parse import urljoin
import requests
from supabase import create_client

VULEKAMALI_BASE = "https://vulekamali.gov.za"

AVAILABLE_YEARS = [
    "2020-21", "2022-23", "2023-24", "2024-25", "2025-26", "2026-27",
]

TRACKED_DEPARTMENTS = [
    "Basic Education",
    "Health",
    "Higher Education and Training",
    "Higher Education, Science and Innovation",
    "Human Settlements",
    "Mineral Resources and Energy",
    "Mineral Resources",
    "Public Enterprises",
    "Public Works and Infrastructure",
    "Science, Technology and Innovation",
    "Science and Technology",
    "Small Business Development",
    "Trade, Industry and Competition",
    "Trade and Industry",
    "Transport",
    "National Treasury",
    "Water and Sanitation",
    "Agriculture, Land Reform and Rural Development",
    "Agriculture, Forestry and Fisheries",
    "Employment and Labour",
    "Labour",
    "Energy",
]

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)


def find_csv_url(financial_year: str) -> str | None:
    """Scrape the vulekamali dataset page to find the CSV download link."""
    page_url = f"{VULEKAMALI_BASE}/datasets/estimates-of-national-expenditure/estimates-of-national-expenditure-{financial_year}"
    log.info(f"  Fetching dataset page: {page_url}")
    resp = requests.get(page_url, timeout=60)
    resp.raise_for_status()
    html = resp.text

    csv_matches = re.findall(r'href="(resources/[^"]+\.csv)"', html, re.IGNORECASE)
    if not csv_matches:
        csv_matches = re.findall(r'href="(https?://[^"]+\.csv)"', html, re.IGNORECASE)

    if csv_matches:
        csv_path = csv_matches[0]
        if csv_path.startswith("http"):
            return csv_path
        else:
            # urljoin resolves relative to the parent path segment, e.g.
            # urljoin(".../estimates-of-national-expenditure-2026-27", "resources/file.csv")
            # → ".../estimates-of-national-expenditure/resources/file.csv"
            resolved = urljoin(page_url, csv_path)
            log.info(f"  Resolved CSV URL: {resolved}")
            return resolved
    return None


def download_csv(url: str) -> list[dict]:
    """Download and parse a CSV file."""
    log.info(f"  Downloading CSV: {url}")
    resp = requests.get(url, timeout=120)
    resp.raise_for_status()
    text = resp.content.decode("utf-8-sig")
    reader = csv.DictReader(io.StringIO(text))
    rows = list(reader)
    log.info(f"  Downloaded {len(rows)} rows, columns: {reader.fieldnames[:8] if reader.fieldnames else 'none'}")
    return rows


def match_department(raw_name: str) -> str | None:
    """Match a raw department name to our tracked list."""
    if not raw_name:
        return None
    raw_lower = raw_name.strip().lower()
    for tracked in TRACKED_DEPARTMENTS:
        if tracked.lower() == raw_lower:
            return tracked
        if tracked.lower() in raw_lower or raw_lower in tracked.lower():
            return tracked
    return None


def process_budget_rows(records: list[dict], financial_year: str, source_url: str) -> list[dict]:
    """Process raw CSV records into rows for the department_budgets table."""
    rows = []
    if not records:
        return rows

    sample_keys = list(records[0].keys())
    log.info(f"  CSV columns: {sample_keys}")

    # Build flexible column mapping
    col_map = {}
    for key in sample_keys:
        kl = key.strip().lower()
        if kl in ("department", "vote", "dept"):
            col_map["dept"] = key
        elif kl in ("programme", "program"):
            col_map["programme"] = key
        elif kl in ("subprogramme", "sub-programme", "sub_programme", "subprogram"):
            col_map["sub_programme"] = key
        elif "econ" in kl and "1" in kl:
            col_map["econ1"] = key
        elif "econ" in kl and "2" in kl:
            col_map["econ2"] = key
        elif kl in ("budget phase", "budget_phase", "budgetphase", "type"):
            col_map["budget_phase"] = key
        elif kl in ("financial year", "financial_year", "financialyear", "fy"):
            col_map["fy"] = key
        elif kl in ("value", "amount", "r thousand", "r thousands", "r'000"):
            col_map["amount"] = key
        elif kl in ("vote number", "vote_number", "votenumber"):
            col_map["vote_number"] = key

    log.info(f"  Column mapping: {col_map}")

    # If no department column found, try matching by content
    if "dept" not in col_map:
        for key in sample_keys:
            sample_vals = set(str(records[i].get(key, "")).strip() for i in range(min(50, len(records))))
            if any(match_department(v) for v in sample_vals):
                col_map["dept"] = key
                log.info(f"  Found department column by content: '{key}'")
                break

    if "dept" not in col_map:
        log.error("  Cannot identify department column - skipping this file")
        return rows

    for record in records:
        dept_raw = str(record.get(col_map.get("dept", ""), "")).strip()
        dept = match_department(dept_raw)
        if not dept:
            continue

        programme = str(record.get(col_map.get("programme", ""), "")).strip() or None
        sub_programme = str(record.get(col_map.get("sub_programme", ""), "")).strip() or None
        econ1 = str(record.get(col_map.get("econ1", ""), "")).strip() or None
        econ2 = str(record.get(col_map.get("econ2", ""), "")).strip() or None
        budget_phase = str(record.get(col_map.get("budget_phase", ""), "")).strip() or "Main Appropriation"
        fy = str(record.get(col_map.get("fy", ""), "")).strip() or financial_year

        amount_raw = str(record.get(col_map.get("amount", ""), "0")).strip()
        try:
            amount = int(float(amount_raw.replace(",", "").replace(" ", "")))
        except (ValueError, TypeError):
            amount = None

        vote_raw = str(record.get(col_map.get("vote_number", ""), "")).strip()
        try:
            vote_number = int(vote_raw)
        except (ValueError, TypeError):
            vote_number = None

        rows.append({
            "department_name": dept,
            "programme": programme,
            "sub_programme": sub_programme,
            "economic_classification_1": econ1,
            "economic_classification_2": econ2,
            "financial_year": fy,
            "budget_phase": budget_phase,
            "amount_rands": amount,
            "vote_number": vote_number,
            "sphere": "national",
            "province": None,
            "source_url": source_url,
        })

    return rows


def get_supabase_client():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        log.error("Missing SUPABASE_URL or SUPABASE_KEY environment variables")
        sys.exit(1)
    return create_client(url, key)


def delete_and_insert_budget_rows(supabase, rows: list[dict], financial_year: str) -> int:
    """Delete existing rows for the financial year, then insert fresh data.

    This avoids ON CONFLICT issues when the CSV has more granularity
    (sub_programme, econ2-5) than the unique constraint covers.
    """
    # Safety check: never delete without a financial year filter
    if not financial_year or len(financial_year) < 6:
        log.error(f"  Invalid financial year '{financial_year}' — refusing to delete")
        return 0

    # Step 1: Delete all existing rows for this financial year
    try:
        supabase.table("department_budgets").delete().eq(
            "financial_year", financial_year
        ).execute()
        log.info(f"  Deleted existing rows for {financial_year}")
    except Exception as e:
        log.error(f"  Error deleting rows for {financial_year}: {e}")
        return 0

    # Step 2: Insert fresh data in batches
    BATCH_SIZE = 500
    total = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        try:
            supabase.table("department_budgets").insert(batch).execute()
            total += len(batch)
            log.info(f"  Inserted batch {i // BATCH_SIZE + 1}: {len(batch)} rows (total: {total})")
        except Exception as e:
            log.error(f"  Error inserting batch: {e}")
    return total


def main():
    parser = argparse.ArgumentParser(description="Update SA Policy Space with Vulekamali budget data")
    parser.add_argument("--year", type=str, default=None, help="Financial year (e.g. '2025-26')")
    parser.add_argument("--all-years", action="store_true", help="Fetch all available years")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be fetched without writing to DB")
    args = parser.parse_args()

    if args.all_years:
        years = AVAILABLE_YEARS
    elif args.year:
        years = [args.year]
    else:
        years = [AVAILABLE_YEARS[-1]]

    log.info(f"Will fetch ENE data for: {years}")

    if not args.dry_run:
        supabase = get_supabase_client()

    total_rows = 0

    for fy in years:
        log.info(f"\n{'='*60}")
        log.info(f"Processing ENE {fy}")

        try:
            csv_url = find_csv_url(fy)
        except Exception as e:
            log.error(f"  Failed to load dataset page: {e}")
            continue

        if not csv_url:
            log.warning(f"  No CSV found for {fy}, skipping")
            continue

        try:
            records = download_csv(csv_url)
        except Exception as e:
            log.error(f"  Failed to download CSV: {e}")
            continue

        budget_rows = process_budget_rows(records, fy, csv_url)
        log.info(f"  Extracted {len(budget_rows)} rows for tracked departments")

        if args.dry_run:
            depts_found = set(r["department_name"] for r in budget_rows)
            log.info(f"  [DRY RUN] Departments: {depts_found}")
            for dept in sorted(depts_found):
                dept_rows = [r for r in budget_rows if r["department_name"] == dept]
                log.info(f"    {dept}: {len(dept_rows)} rows")
            total_rows += len(budget_rows)
            continue

        if budget_rows:
            inserted = delete_and_insert_budget_rows(supabase, budget_rows, fy)
            total_rows += inserted

    log.info(f"\n{'='*60}")
    log.info(f"Done! Processed {total_rows} budget rows across {len(years)} year(s).")
    if args.dry_run:
        log.info("(This was a dry run - nothing was written to the database)")


if __name__ == "__main__":
    main()
