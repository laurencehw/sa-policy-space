"""
SA Policy Space — Municipal Finance Data Updater
==================================================
Fetches municipal financial data from the Municipal Money API
(National Treasury / OpenUpSA) and upserts into the Supabase
municipal_finance table.

Uses BOTH v1 cubes (pre-2019 data) and v2 cubes (2019+ mSCOA data)
to get the widest possible date range.

v1 cubes: incexp, bsheet, capital, cflow — data through ~2015-2020
v2 cubes: incexp_v2, financial_position_v2, capital_v2, cflow_v2 — data from 2019+

For v2 cubes:
  - The API crashes (500) when item.code is used in the cut filter
  - Instead we drilldown by item.code and sum relevant items client-side
  - incexp_v2: revenue items (0200-1700), expenditure items (2000-3000)
  - capital_v2: sum all items
  - cflow_v2 item 0230 = Net Cash from Operating Activities
  - financial_position_v2 items 0120+0130 = Cash and Cash Equivalents

Usage:
    python update_municipal.py                     # fetch all years for metros
    python update_municipal.py --all-munis         # all municipalities (not just metros)
    python update_municipal.py --dry-run           # show what would be fetched
    python update_municipal.py --v2-only           # only fetch v2 cube data

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

# ── v1 indicators (historical data, pre-2019) ─────────────────────────
V1_INDICATORS = [
    {
        "cube": "bsheet",
        "name": "cash_and_equivalents",
        "label": "Cash and Cash Equivalents",
        "item_code": "1800",
        "aggregate": "amount.sum",
    },
    {
        "cube": "incexp",
        "name": "total_revenue",
        "label": "Total Revenue",
        "item_code": "0200",
        "aggregate": "amount.sum",
    },
    {
        "cube": "incexp",
        "name": "total_expenditure",
        "label": "Total Expenditure",
        "item_code": "0400",
        "aggregate": "amount.sum",
    },
    {
        "cube": "capital",
        "name": "total_capital_expenditure",
        "label": "Total Capital Expenditure",
        "item_code": "4100",
        "aggregate": "total_assets.sum",
    },
    {
        "cube": "cflow",
        "name": "net_cash_from_operations",
        "label": "Net Cash from Operating Activities",
        "item_code": "4200",
        "aggregate": "amount.sum",
    },
]

# ── v2 indicators (mSCOA data, 2019+) ────────────────────────────────
# IMPORTANT: v2 cubes crash (500 error) when item.code is in the cut filter.
# Instead we drilldown by item.code and filter/sum client-side.

V2_INDICATORS = [
    {
        "cube": "financial_position_v2",
        "name": "cash_and_equivalents",
        "label": "Cash and Cash Equivalents (v2)",
        "item_codes": ["0120", "0130"],  # Cash + Call deposits & investments
    },
    {
        "cube": "incexp_v2",
        "name": "total_revenue",
        "label": "Total Revenue (v2)",
        # Revenue items: Property rates through Gains on disposal of PPE
        "item_codes": [
            "0200", "0300", "0400", "0500", "0600", "0800", "0900",
            "1000", "1100", "1200", "1300", "1400", "1500", "1600", "1700",
        ],
    },
    {
        "cube": "incexp_v2",
        "name": "total_expenditure",
        "label": "Total Expenditure (v2)",
        # Expenditure items: Employee costs through Loss on disposal
        "item_codes": [
            "2000", "2100", "2200", "2300", "2400", "2500", "2600",
            "2700", "2800", "2900", "3000",
        ],
    },
    {
        "cube": "capital_v2",
        "name": "total_capital_expenditure",
        "label": "Total Capital Expenditure (v2)",
        "item_codes": None,  # sum ALL items
    },
    {
        "cube": "cflow_v2",
        "name": "net_cash_from_operations",
        "label": "Net Cash from Operating Activities (v2)",
        "item_codes": ["0230"],  # NET CASH FROM/(USED) OPERATING ACTIVITIES
    },
]

# Preferred amount types for v2 cubes, in priority order
V2_AMOUNT_TYPES = ["AUDA", "ACT", "PAUD"]

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


# ═══════════════════════════════════════════════════════════════════════
#  v1 cube fetching (original approach)
# ═══════════════════════════════════════════════════════════════════════

def fetch_v1_aggregate(cube: str, item_code: str, muni_code: str, aggregate: str = "amount.sum") -> list[dict]:
    """Use aggregate endpoint for v1 yearly summaries."""
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
    return data.get("cells", [])


def fetch_v1_facts(cube: str, item_code: str, muni_code: str) -> list[dict]:
    """Fallback: use facts endpoint for v1 data."""
    url = f"{MUNI_API_BASE}/cubes/{cube}/facts"
    params = {
        "cut": f"demarcation.code:{muni_code}|item.code:{item_code}",
        "pagesize": 100,
    }
    resp = requests.get(url, params=params, timeout=60)
    resp.raise_for_status()
    return resp.json().get("data", [])


def process_v1_cells(cells, indicator_name, muni_code, muni_name, muni_type, province, aggregate_key="amount.sum"):
    """Process v1 API data into rows for municipal_finance table."""
    rows = []
    for cell in cells:
        fy_raw = cell.get("financial_year_end.year") or cell.get("financial_period.period") or cell.get("financial_year.year")
        if not fy_raw:
            continue
        try:
            year = int(str(fy_raw)[:4])
            fy = f"{year}-{str(year + 1)[-2:]}"
        except (ValueError, TypeError):
            fy = str(fy_raw)

        amount_raw = cell.get(aggregate_key) or cell.get("amount.sum") or cell.get("amount")
        try:
            amount = int(float(str(amount_raw)))
        except (ValueError, TypeError):
            amount = None

        period_raw = cell.get("financial_period.period")
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


def fetch_v1_indicator(indicator, muni_code, muni_name, muni_type, province):
    """Fetch a single v1 indicator for a municipality."""
    agg_key = indicator.get("aggregate", "amount.sum")
    cells = fetch_v1_aggregate(indicator["cube"], indicator["item_code"], muni_code, aggregate=agg_key)
    time.sleep(0.3)

    if cells:
        return process_v1_cells(cells, indicator["name"], muni_code, muni_name, muni_type, province, aggregate_key=agg_key)
    else:
        log.info(f"    No cells from aggregate endpoint, trying facts...")
        facts = fetch_v1_facts(indicator["cube"], indicator["item_code"], muni_code)
        time.sleep(0.3)
        return process_v1_cells(facts, indicator["name"], muni_code, muni_name, muni_type, province, aggregate_key=agg_key)


# ═══════════════════════════════════════════════════════════════════════
#  v2 cube fetching (mSCOA 2019+)
# ═══════════════════════════════════════════════════════════════════════

def fetch_v2_aggregate(cube: str, muni_code: str, amount_type: str = "AUDA") -> list[dict]:
    """
    Fetch v2 cube data using the aggregate endpoint.

    IMPORTANT: v2 cubes crash (500 error) when item.code is used in the
    cut filter. Instead we drilldown by item.code and filter/sum client-side.

    We:
      - Filter by demarcation.code and amount_type (AUDA preferred)
      - Drilldown by financial_year_end.year AND item.code
      - Return all cells for client-side item filtering
    """
    url = f"{MUNI_API_BASE}/cubes/{cube}/aggregate"

    cut_parts = [
        f"demarcation.code:{muni_code}",
        f"amount_type.code:{amount_type}",
    ]
    cut = "|".join(cut_parts)

    params = {
        "cut": cut,
        "drilldown": "financial_year_end.year|item.code",
        "aggregates": "amount.sum",
        "pagesize": 10000,
    }
    log.debug(f"    v2 query: {url}?cut={cut}")
    resp = requests.get(url, params=params, timeout=90)
    resp.raise_for_status()
    data = resp.json()
    return data.get("cells", [])


def process_v2_cells(cells, indicator_name, item_codes, muni_code, muni_name, muni_type, province):
    """
    Process v2 API aggregate data into rows for municipal_finance table.

    Since v2 cubes return per-item rows (drilldown by item.code), we:
      1. Filter cells to only the relevant item codes (or keep all if item_codes is None)
      2. Sum amounts across items for each financial year
    """
    # Filter cells to relevant items
    if item_codes:
        item_set = set(item_codes)
        filtered = [c for c in cells if c.get("item.code") in item_set]
    else:
        filtered = cells

    # Group by financial year and sum
    year_totals = {}
    for cell in filtered:
        fy_raw = cell.get("financial_year_end.year")
        if not fy_raw:
            continue
        try:
            year = int(str(fy_raw)[:4])
        except (ValueError, TypeError):
            continue

        amount_raw = cell.get("amount.sum")
        try:
            amount = float(str(amount_raw))
        except (ValueError, TypeError):
            continue

        year_totals[year] = year_totals.get(year, 0.0) + amount

    # Convert to rows
    rows = []
    for year in sorted(year_totals):
        fy = f"{year}-{str(year + 1)[-2:]}"
        rows.append({
            "municipality_code": muni_code,
            "municipality_name": muni_name,
            "municipality_type": muni_type,
            "province": province,
            "indicator": indicator_name,
            "financial_year": fy,
            "period": "annual",
            "amount_rands": int(year_totals[year]),
            "source_url": f"https://municipalmoney.gov.za/profiles/municipality-{muni_code}/",
        })
    return rows


def fetch_v2_indicator(indicator, muni_code, muni_name, muni_type, province):
    """
    Fetch a single v2 indicator for a municipality.

    Tries preferred amount types in order (AUDA → ACT → PAUD).
    Drills down by item.code and sums relevant items client-side,
    because v2 cubes crash when item.code is used in the cut filter.
    """
    item_codes = indicator.get("item_codes")

    for amt_type in V2_AMOUNT_TYPES:
        try:
            cells = fetch_v2_aggregate(
                indicator["cube"], muni_code,
                amount_type=amt_type,
            )
            time.sleep(0.3)

            if cells:
                log.info(f"    Got {len(cells)} raw cells with amount_type={amt_type}")
                return process_v2_cells(cells, indicator["name"], item_codes, muni_code, muni_name, muni_type, province)
            else:
                log.debug(f"    No data for amount_type={amt_type}, trying next...")
        except Exception as e:
            log.warning(f"    Error with amount_type={amt_type}: {e}")
            time.sleep(0.3)

    log.warning(f"    No v2 data found for any amount type")
    return []


# ═══════════════════════════════════════════════════════════════════════
#  Database operations
# ═══════════════════════════════════════════════════════════════════════

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


# ═══════════════════════════════════════════════════════════════════════
#  Main
# ═══════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="Update SA Policy Space with municipal finance data")
    parser.add_argument("--all-munis", action="store_true", help="Fetch all municipalities, not just metros")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be fetched without writing to DB")
    parser.add_argument("--v1-only", action="store_true", help="Only fetch v1 cube data (pre-2019)")
    parser.add_argument("--v2-only", action="store_true", help="Only fetch v2 cube data (2019+)")
    args = parser.parse_args()

    fetch_v1 = not args.v2_only
    fetch_v2 = not args.v1_only

    municipalities = dict(METROS)

    if not args.dry_run:
        supabase = get_supabase_client()

    total_rows = 0

    for muni_code, muni_info in municipalities.items():
        muni_name = muni_info["name"]
        province = muni_info["province"]
        muni_type = "metro" if muni_code in METROS else "local"

        log.info(f"\n{'='*60}")
        log.info(f"  {muni_name} ({muni_code})")
        log.info(f"{'='*60}")

        # ── v1 indicators ──────────────────────────────────────────
        if fetch_v1:
            log.info(f"  --- v1 cubes (historical) ---")
            for indicator in V1_INDICATORS:
                log.info(f"  Fetching {indicator['label']} (cube={indicator['cube']}, item={indicator['item_code']})...")
                try:
                    rows = fetch_v1_indicator(indicator, muni_code, muni_name, muni_type, province)
                    log.info(f"    Found {len(rows)} data points")

                    if args.dry_run:
                        for r in rows[:3]:
                            amt = f"R{r['amount_rands']:,}" if r['amount_rands'] else "N/A"
                            log.info(f"    [DRY RUN] {r['financial_year']}: {amt}")
                        if len(rows) > 3:
                            log.info(f"    ... and {len(rows) - 3} more")
                        total_rows += len(rows)
                        continue

                    if rows:
                        inserted = upsert_municipal_rows(supabase, rows)
                        total_rows += inserted

                except Exception as e:
                    log.error(f"    Error: {e}")
                    continue

        # ── v2 indicators ──────────────────────────────────────────
        if fetch_v2:
            log.info(f"  --- v2 cubes (mSCOA 2019+) ---")
            for indicator in V2_INDICATORS:
                item_desc = f"items={indicator.get('item_codes', 'ALL')}"
                log.info(f"  Fetching {indicator['label']} (cube={indicator['cube']}, {item_desc})...")
                try:
                    rows = fetch_v2_indicator(indicator, muni_code, muni_name, muni_type, province)
                    log.info(f"    Found {len(rows)} data points")

                    if args.dry_run:
                        for r in rows[:5]:
                            amt = f"R{r['amount_rands']:,}" if r['amount_rands'] else "N/A"
                            log.info(f"    [DRY RUN] {r['financial_year']}: {amt}")
                        if len(rows) > 5:
                            log.info(f"    ... and {len(rows) - 5} more")
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
    if fetch_v1 and fetch_v2:
        log.info(f"(Combined v1 historical + v2 mSCOA data)")
    elif fetch_v2:
        log.info(f"(v2 mSCOA cubes only)")
    else:
        log.info(f"(v1 historical cubes only)")
    if args.dry_run:
        log.info("(This was a dry run - nothing was written to the database)")


if __name__ == "__main__":
    main()
