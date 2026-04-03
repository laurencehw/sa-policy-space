"""
SA Policy Space — Municipal Finance Data Updater
==================================================
Fetches municipal financial data from the Municipal Money API
(National Treasury / OpenUpSA) and upserts into the Supabase
municipal_finance table.

Usage:
    python update_municipal.py                     # fetch all years for metros
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

MUNI_API_BASE = "https://municipaldata.treasury.gov.za/api"

INDICATORS = [
    {"cube": "bsheet", "name": "cash_and_equivalents", "label": "Cash and Cash Equivalents", "item_code": "1800", "aggregate": "amount.sum"},
    {"cube": "incexp", "name": "total_revenue", "label": "Total Revenue", "item_code": "0200", "aggregate": "amount.sum"},
    {"cube": "incexp", "name": "total_expenditure", "label": "Total Expenditure", "item_code": "0400", "aggregate": "amount.sum"},
    {"cube": "capital", "name": "total_capital_expenditure", "label": "Total Capital Expenditure", "item_code": "4100", "aggregate": "total_assets.sum"},
    {"cube": "cflow", "name": "net_cash_from_operations", "label": "Net Cash from Operating Activities", "item_code": "4200", "aggregate": "amount.sum"},
]

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

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)


def fetch_indicator_aggregate(cube: str, item_code: str, muni_code: str, aggregate: str = "amount.sum") -> list[dict]:
    """Use aggregate endpoint for yearly summaries."""
    url = f"{MUNI_API_BASE}/cubes/{cube}/aggregate"
    params = {
        "cut": f"demarcation.code:{muni_code}|item.code:{item_code}",
        "drilldown": "financial_year_end.year",
        "aggregates": aggregate,
        "pagesize": 50,
    }
    resp = requests.get(url, params=params, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    log.debug(f"    API response keys: {list(data.keys())}, cells count: {len(data.get('cells', []))}")
    return data.get("cells", [])


def fetch_indicator_facts(cube: str, item_code: str, muni_code: str) -> list[dict]:
    """Fallback: use facts endpoint."""
    url = f"{MUNI_API_BASE}/cubes/{cube}/facts"
    params = {
        "cut": f"demarcation.code:{muni_code}|item.code:{item_code}",
        "pagesize": 100,
    }
    resp = requests.get(url, params=params, timeout=60)
    resp.raise_for_status()
    return resp.json().get("data", [])


def process_facts(facts, indicator_name, muni_code, muni_name, muni_type, province, aggregate_key: str = "amount.sum"):
    """Process raw API data into rows for municipal_finance table."""
    rows = []
    for fact in facts:
        # The API uses financial_year_end.year for the year dimension
        fy_raw = fact.get("financial_year_end.year") or fact.get("financial_period.period") or fact.get("financial_year.year")
        if not fy_raw:
            log.debug(f"    Skipping cell with no year: {list(fact.keys())}")
            continue
        try:
            year = int(str(fy_raw)[:4])
            fy = f"{year}-{str(year + 1)[-2:]}"
        except (ValueError, TypeError):
            fy = str(fy_raw)

        # Try the specific aggregate key first (e.g. total_assets.sum for capital), then fallback
        amount_raw = fact.get(aggregate_key) or fact.get("amount.sum") or fact.get("amount")
        try:
            amount = int(float(str(amount_raw)))
        except (ValueError, TypeError):
            amount = None

        period_raw = fact.get("financial_period.period")
        period = str(period_raw).lower() if period_raw and "q" in str(period_raw).lower() else "annual"

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


def get_supabase_client():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        log.error("Missing SUPABASE_URL or SUPABASE_KEY environment variables")
        sys.exit(1)
    return create_client(url, key)


def upsert_municipal_rows(supabase, rows):
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


def main():
    parser = argparse.ArgumentParser(description="Update SA Policy Space with municipal finance data")
    parser.add_argument("--all-munis", action="store_true", help="Fetch all municipalities, not just metros")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be fetched without writing to DB")
    args = parser.parse_args()

    municipalities = dict(METROS)

    if not args.dry_run:
        supabase = get_supabase_client()

    total_rows = 0

    for muni_code, muni_info in municipalities.items():
        muni_name = muni_info["name"]
        province = muni_info["province"]
        muni_type = "metro" if muni_code in METROS else "local"

        log.info(f"\n--- {muni_name} ({muni_code}) ---")

        for indicator in INDICATORS:
            agg_key = indicator.get("aggregate", "amount.sum")
            log.info(f"  Fetching {indicator['label']} (cube={indicator['cube']}, item={indicator['item_code']}, agg={agg_key})...")
            try:
                cells = fetch_indicator_aggregate(indicator["cube"], indicator["item_code"], muni_code, aggregate=agg_key)
                time.sleep(0.3)

                if cells:
                    rows = process_facts(cells, indicator["name"], muni_code, muni_name, muni_type, province, aggregate_key=agg_key)
                else:
                    log.info(f"    No cells from aggregate endpoint, trying facts...")
                    facts = fetch_indicator_facts(indicator["cube"], indicator["item_code"], muni_code)
                    time.sleep(0.3)
                    rows = process_facts(facts, indicator["name"], muni_code, muni_name, muni_type, province, aggregate_key=agg_key)

                log.info(f"    Found {len(rows)} data points")

                if args.dry_run:
                    for r in rows[:3]:
                        amt = f"R{r['amount_rands']:,}" if r['amount_rands'] else "N/A"
                        log.info(f"    [DRY RUN] {r['financial_year']}: {amt}")
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
        log.info("(This was a dry run - nothing was written to the database)")


if __name__ == "__main__":
    main()
