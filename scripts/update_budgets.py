"""
SA Policy Space — Vulekamali Budget Data Updater
==================================================
Fetches national department budget data from the Vulekamali CKAN API
and upserts into the Supabase department_budgets table.

Usage:
    python update_budgets.py                       # fetch latest available year
    python update_budgets.py --year 2025-26        # fetch a specific financial year
    python update_budgets.py --all-years           # fetch all years (initial load)
    python update_budgets.py --dry-run             # show what would be fetched

Environment variables required:
    SUPABASE_URL      - Your Supabase project URL
    SUPABASE_KEY      - Your Supabase service_role key
"""

import os
import sys
import logging
import argparse
import requests
from supabase import create_client

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

CKAN_BASE = "https://data.vulekamali.gov.za/api/3"

# Departments that map to your tracked committees / policy ideas
# Maps Vulekamali department names → your policy_ideas.responsible_department values
TRACKED_DEPARTMENTS = [
    "Basic Education",
    "Health",
    "Higher Education and Training",
    "Human Settlements",
    "Mineral Resources and Energy",
    "Public Enterprises",
    "Public Works and Infrastructure",
    "Science, Technology and Innovation",
    "Small Business Development",
    "Trade, Industry and Competition",
    "Transport",
    "National Treasury",
    "Water and Sanitation",
    "Agriculture, Land Reform and Rural Development",
    "Employment and Labour",
]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# CKAN API helpers
# ---------------------------------------------------------------------------

def ckan_search_datasets(query: str) -> list[dict]:
    """Search for datasets on Vulekamali CKAN."""
    url = f"{CKAN_BASE}/action/package_search"
    resp = requests.get(url, params={"q": query, "rows": 50}, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    if data.get("success"):
        return data["result"]["results"]
    return []


def ckan_get_datastore(resource_id: str, limit: int = 32000, offset: int = 0) -> dict:
    """Fetch records from a CKAN datastore resource."""
    url = f"{CKAN_BASE}/action/datastore_search"
    resp = requests.get(url, params={
        "resource_id": resource_id,
        "limit": limit,
        "offset": offset,
    }, timeout=120)
    resp.raise_for_status()
    data = resp.json()
    if data.get("success"):
        return data["result"]
    return {"records": [], "total": 0}


def find_ene_datasets(financial_year: str | None = None) -> list[dict]:
    """
    Find Estimates of National Expenditure datasets.
    These contain the department-level budget breakdowns.
    """
    query = "Estimates of National Expenditure"
    if financial_year:
        query += f" {financial_year}"

    datasets = ckan_search_datasets(query)

    # Filter to actual ENE datasets (not adjusted, not provincial)
    ene_datasets = []
    for ds in datasets:
        title = ds.get("title", "").lower()
        if "estimates of national expenditure" in title:
            ene_datasets.append(ds)

    return ene_datasets


def find_csv_resources(dataset: dict) -> list[dict]:
    """Find CSV resources within a CKAN dataset."""
    resources = dataset.get("resources", [])
    csv_resources = [
        r for r in resources
        if r.get("format", "").upper() == "CSV"
        or r.get("url", "").lower().endswith(".csv")
    ]
    return csv_resources


def download_csv_resource(url: str) -> list[dict]:
    """Download and parse a CSV resource."""
    import csv
    import io

    resp = requests.get(url, timeout=120)
    resp.raise_for_status()

    text = resp.text
    reader = csv.DictReader(io.StringIO(text))
    return list(reader)

# ---------------------------------------------------------------------------
# Data processing
# ---------------------------------------------------------------------------

def process_budget_records(records: list[dict], financial_year: str, source_url: str) -> list[dict]:
    """
    Process raw budget records into rows for our department_budgets table.
    Vulekamali CSV fields vary but typically include:
    - Department / Vote
    - Programme
    - Sub-programme
    - Econ1, Econ2 (economic classifications)
    - Budget Phase
    - Financial Year
    - Value / Amount
    """
    rows = []

    for record in records:
        # Try to extract department name from various possible field names
        dept = (
            record.get("Department") or
            record.get("department") or
            record.get("Vote") or
            record.get("vote") or
            ""
        ).strip()

        if not dept:
            continue

        # Check if this is a department we track
        dept_match = None
        for tracked in TRACKED_DEPARTMENTS:
            if tracked.lower() in dept.lower() or dept.lower() in tracked.lower():
                dept_match = tracked
                break

        if not dept_match:
            continue

        programme = (
            record.get("Programme") or
            record.get("programme") or
            ""
        ).strip() or None

        sub_programme = (
            record.get("Sub-programme") or
            record.get("Subprogramme") or
            record.get("sub_programme") or
            ""
        ).strip() or None

        econ1 = (
            record.get("Econ1") or
            record.get("Economic Classification 1") or
            record.get("economic_classification_1") or
            ""
        ).strip() or None

        econ2 = (
            record.get("Econ2") or
            record.get("Economic Classification 2") or
            record.get("economic_classification_2") or
            ""
        ).strip() or None

        budget_phase = (
            record.get("Budget Phase") or
            record.get("budget_phase") or
            record.get("BudgetPhase") or
            "Main Appropriation"
        ).strip()

        fy = (
            record.get("Financial Year") or
            record.get("financial_year") or
            record.get("FinancialYear") or
            financial_year
        ).strip()

        # Parse amount — might be in 'Value', 'Amount', or a year column
        amount_raw = (
            record.get("Value") or
            record.get("value") or
            record.get("Amount") or
            record.get("amount") or
            "0"
        )

        try:
            # Vulekamali amounts are sometimes in thousands
            amount = int(float(str(amount_raw).replace(",", "").replace(" ", "")))
        except (ValueError, TypeError):
            amount = None

        vote_raw = (
            record.get("Vote Number") or
            record.get("vote_number") or
            record.get("VoteNumber") or
            ""
        )
        try:
            vote_number = int(vote_raw)
        except (ValueError, TypeError):
            vote_number = None

        rows.append({
            "department_name": dept_match,
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


def upsert_budget_rows(supabase, rows: list[dict]):
    """Upsert budget rows in batches."""
    BATCH_SIZE = 500
    total = 0

    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        try:
            supabase.table("department_budgets").upsert(
                batch,
                on_conflict="department_name,programme,financial_year,budget_phase,economic_classification_1,sphere,province",
            ).execute()
            total += len(batch)
            log.info(f"  Upserted batch {i//BATCH_SIZE + 1}: {len(batch)} rows (total: {total})")
        except Exception as e:
            log.error(f"  Error upserting batch: {e}")

    return total

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Update SA Policy Space with Vulekamali budget data")
    parser.add_argument("--year", type=str, default=None, help="Financial year to fetch (e.g. '2025-26')")
    parser.add_argument("--all-years", action="store_true", help="Fetch all available years")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be fetched without writing to DB")
    args = parser.parse_args()

    log.info("Searching for Estimates of National Expenditure datasets on Vulekamali...")

    datasets = find_ene_datasets(args.year)
    log.info(f"Found {len(datasets)} ENE datasets")

    if not datasets:
        # Fallback: try a broader search
        log.info("Trying broader search...")
        datasets = ckan_search_datasets("national expenditure budget")
        log.info(f"Found {len(datasets)} datasets with broader search")

    total_rows = 0

    if not args.dry_run:
        supabase = get_supabase_client()

    for ds in datasets:
        title = ds.get("title", "Unknown")
        log.info(f"\n--- Dataset: {title} ---")

        # Try datastore API first (structured), fall back to CSV download
        csv_resources = find_csv_resources(ds)

        if not csv_resources:
            log.info("  No CSV resources found, skipping")
            continue

        for resource in csv_resources:
            res_name = resource.get("name", resource.get("description", "unnamed"))
            res_url = resource.get("url", "")
            res_id = resource.get("id", "")

            log.info(f"  Resource: {res_name}")

            records = []

            # Try datastore first
            if res_id:
                try:
                    result = ckan_get_datastore(res_id)
                    records = result.get("records", [])
                    total_available = result.get("total", 0)
                    log.info(f"    Datastore: {len(records)} of {total_available} records")

                    # Fetch remaining pages if needed
                    while len(records) < total_available:
                        result = ckan_get_datastore(res_id, offset=len(records))
                        page_records = result.get("records", [])
                        if not page_records:
                            break
                        records.extend(page_records)
                        log.info(f"    Fetched page: {len(records)} of {total_available}")

                except Exception as e:
                    log.warning(f"    Datastore failed ({e}), trying CSV download...")

            # Fall back to CSV download
            if not records and res_url:
                try:
                    records = download_csv_resource(res_url)
                    log.info(f"    CSV download: {len(records)} records")
                except Exception as e:
                    log.error(f"    CSV download failed: {e}")
                    continue

            if not records:
                continue

            # Log sample fields for debugging
            if records:
                sample = records[0]
                log.info(f"    Sample fields: {list(sample.keys())[:10]}")

            # Process records
            fy = args.year or "unknown"
            budget_rows = process_budget_records(records, fy, res_url)
            log.info(f"    Processed {len(budget_rows)} rows for tracked departments")

            if args.dry_run:
                # Show sample
                depts_found = set(r["department_name"] for r in budget_rows)
                log.info(f"    [DRY RUN] Departments found: {depts_found}")
                for dept in depts_found:
                    dept_rows = [r for r in budget_rows if r["department_name"] == dept]
                    log.info(f"      {dept}: {len(dept_rows)} rows")
                total_rows += len(budget_rows)
                continue

            if budget_rows:
                inserted = upsert_budget_rows(supabase, budget_rows)
                total_rows += inserted

    log.info(f"\n{'='*60}")
    log.info(f"Done! Processed {total_rows} budget rows.")
    if args.dry_run:
        log.info("(This was a dry run — nothing was written to the database)")


if __name__ == "__main__":
    main()
