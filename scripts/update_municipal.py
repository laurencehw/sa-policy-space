"""
SA Policy Space — Municipal Finance Data Updater
==================================================
Fetches municipal financial data from the Municipal Money API
(National Treasury / OpenUpSA) and upserts into the Supabase
municipal_finance table.

Usage:
    python update_municipal.py                     # fetch latest year for all metros
    python update_municipal.py --year 2024-25      # specific financial year
    python update_municipal.py --all-munis         # all municipalities (not just metros)
    python update_municipal.py --dry-run           # show what would be fetched

Environment variables required:
    SUPABASE_URL      - Your Supabase project URL
    SUPABASE_KEY      - Your Supabase service_role key
"""

import os
import sys
import time
import logging
import argparse
import requests
from supabase import create_client

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

MUNI_API_BASE = "https://municipaldata.treasury.gov.za/api"

# Key financial indicators to track
INDICATORS = [
    {
        "cube": "financial_position",
        "name": "cash_and_equivalents",
        "label": "Cash and Cash Equivalents",
        "item_code": "1800",
    },
    {
        "cube": "incexp",
        "name": "total_revenue",
        "label": "Total Revenue",
        "item_code": "0200",
    },
    {
        "cube": "incexp",
        "name": "total_expenditure",
        "label": "Total Expenditure",
        "item_code": "0400",
    },
    {
        "cube": "capital",
        "name": "total_capital_expenditure",
        "label": "Total Capital Expenditure",
        "item_code": "4100",
    },
    {
        "cube": "cflow",
        "name": "net_cash_from_operations",
        "label": "Net Cash from Operating Activities",
        "item_code": "4200",
    },
]

# 8 metropolitan municipalities (highest impact, start here)
METROS = {
    "CPT": {"name": "City of Cape Town", "province": "Western Cape"},
    "JHB": {"name": "City of Johannesburg", "province": "Gauteng"},
    "ETH": {"name": "eThekwini", "province": "KwaZulu-Natal"},
    "TSH": {"name": "City of Tshwane", "province": "Gauteng"},
    "EKU": {"name": "Ekurhuleni", "province": "Gauteng"},
    "NMA": {"name": "Nelson Mandela Bay", "province": "Eastern Cape"},
    "MAN": {"name": "Mangaung", "province": "Free State"},
    "BUF": {"name": "Buffalo City", "province": "Eastern Cape"},
}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Municipal Money API helpers
# ---------------------------------------------------------------------------

def fetch_municipalities() -> list[dict]:
    """Fetch list of all municipalities from the API."""
    url = f"{MUNI_API_BASE}/cubes/municipalities/facts"
    resp = requests.get(url, params={"pagesize": 500}, timeout=60)
    resp.raise_for_status()
    return resp.json().get("data", [])


def fetch_indicator_data(
    cube: str,
    item_code: str,
    muni_code: str,
    financial_year: str | None = None,
) -> list[dict]:
    """
    Fetch financial data for a specific indicator and municipality.
    The Municipal Money API uses an OLAP-style cube query.
    """
    url = f"{MUNI_API_BASE}/cubes/{cube}/facts"

    params = {
        "cut": f"municipality.demarcation_code:{muni_code}|item.code:{item_code}",
        "pagesize": 100,
    }

    if financial_year:
        # Convert '2024-25' format to the API's year format
        start_year = financial_year.split("-")[0]
        params["cut"] += f"|financial_year.year:{start_year}"

    resp = requests.get(url, params=params, timeout=60)
    resp.raise_for_status()
    data = resp.json()

    return data.get("data", [])


def fetch_indicator_aggregate(
    cube: str,
    item_code: str,
    muni_code: str,
) -> list[dict]:
    """
    Alternative: use aggregate endpoint for summarized data.
    """
    url = f"{MUNI_API_BASE}/cubes/{cube}/aggregate"

    params = {
        "cut": f"municipality.demarcation_code:{muni_code}|item.code:{item_code}",
        "drilldown": "financial_year.year",
        "pagesize": 50,
    }

    resp = requests.get(url, params=params, timeout=60)
    resp.raise_for_status()
    data = resp.json()

    return data.get("cells", [])

# ---------------------------------------------------------------------------
# Data processing
# ---------------------------------------------------------------------------

def process_facts(
    facts: list[dict],
    indicator_name: str,
    muni_code: str,
    muni_name: str,
    muni_type: str,
    province: str,
) -> list[dict]:
    """Process raw API facts into rows for our municipal_finance table."""
    rows = []

    for fact in facts:
        # Extract financial year
        fy_raw = fact.get("financial_year.year") or fact.get("financial_period.period")
        if not fy_raw:
            continue

        # Convert year to 'YYYY-YY' format
        try:
            year = int(str(fy_raw)[:4])
            fy = f"{year}-{str(year + 1)[-2:]}"
        except (ValueError, TypeError):
            fy = str(fy_raw)

        # Extract amount
        amount_raw = fact.get("amount.sum") or fact.get("amount")
        try:
            amount = int(float(str(amount_raw)))
        except (ValueError, TypeError):
            amount = None

        # Determine period
        period_raw = fact.get("financial_period.period")
        if period_raw and "q" in str(period_raw).lower():
            period = str(period_raw).lower()
        else:
            period = "annual"

        rows.append({
            "municipality_code": muni_code,
            "municipality_name": muni_name,
            "municipality_type": muni_type,
            "province": province,
            "indicator": indicator_name,
            "financial_year": fy,
            "period": period,
            "amount_rands": amount,
            "source_url": f"https://municipalmoney.gov.za/profiles/municipality-{muni_code}/",
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


def upsert_municipal_rows(supabase, rows: list[dict]):
    """Upsert municipal finance rows in batches."""
    BATCH_SIZE = 200
    total = 0

    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i:i + BATCH_SIZE]
        try:
            supabase.table("municipal_finance").upsert(
                batch,
                on_conflict="municipality_code,indicator,financial_year,period",
            ).execute()
            total += len(batch)
        except Exception as e:
            log.error(f"  Error upserting batch: {e}")

    return total

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Update SA Policy Space with municipal finance data")
    parser.add_argument("--year", type=str, default=None, help="Financial year (e.g. '2024-25')")
    parser.add_argument("--all-munis", action="store_true", help="Fetch all municipalities, not just metros")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be fetched without writing to DB")
    args = parser.parse_args()

    municipalities = dict(METROS)

    if args.all_munis:
        log.info("Fetching full municipality list from API...")
        try:
            all_munis = fetch_municipalities()
            for m in all_munis:
                code = m.get("municipality.demarcation_code", "")
                name = m.get("municipality.name", "")
                if code and name and code not in municipalities:
                    municipalities[code] = {
                        "name": name,
                        "province": m.get("municipality.province_name", ""),
                    }
            log.info(f"Loaded {len(municipalities)} municipalities")
        except Exception as e:
            log.warning(f"Failed to fetch full list, using metros only: {e}")

    if not args.dry_run:
        supabase = get_supabase_client()

    total_rows = 0

    for muni_code, muni_info in municipalities.items():
        muni_name = muni_info["name"]
        province = muni_info["province"]
        muni_type = "metro" if muni_code in METROS else "local"

        log.info(f"\n--- {muni_name} ({muni_code}) ---")

        for indicator in INDICATORS:
            log.info(f"  Fetching {indicator['label']}...")

            try:
                # Try aggregate endpoint first (gives yearly summaries)
                cells = fetch_indicator_aggregate(
                    indicator["cube"],
                    indicator["item_code"],
                    muni_code,
                )
                time.sleep(0.3)

                if cells:
                    rows = process_facts(
                        cells,
                        indicator["name"],
                        muni_code,
                        muni_name,
                        muni_type,
                        province,
                    )
                else:
                    # Fall back to facts endpoint
                    facts = fetch_indicator_data(
                        indicator["cube"],
                        indicator["item_code"],
                        muni_code,
                        args.year,
                    )
                    time.sleep(0.3)
                    rows = process_facts(
                        facts,
                        indicator["name"],
                        muni_code,
                        muni_name,
                        muni_type,
                        province,
                    )

                log.info(f"    Found {len(rows)} data points")

                if args.dry_run:
                    for r in rows[:3]:
                        log.info(f"    [DRY RUN] {r['financial_year']}: R{r['amount_rands']:,}" if r['amount_rands'] else f"    [DRY RUN] {r['financial_year']}: N/A")
                    total_rows += len(rows)
                    continue

                if rows:
                    inserted = upsert_municipal_rows(supabase, rows)
                    total_rows += inserted

            except Exception as e:
                log.error(f"    Error: {e}")
                continue

    log.info(f"\n{'='*60}")
    log.info(f"Done! Processed {total_rows} municipal finance data points.")
    if args.dry_run:
        log.info("(This was a dry run — nothing was written to the database)")


if __name__ == "__main__":
    main()
