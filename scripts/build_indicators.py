"""
Build economic indicator JSON files for the SA Policy Space app.

Reads processed CSVs from the textbook project and produces:
  - data/indicators_summary.json  (lightweight: latest values + sparklines)
  - data/indicators_full.json     (complete historical time-series)

Usage:
  python scripts/build_indicators.py [--source-dir PATH]

Default source: G:/My Drive/book drafts/the south african economy/___Contemporary/data/processed
"""

import argparse
import csv
import json
import os
import sys
from pathlib import Path

DEFAULT_SOURCE = (
    "G:/My Drive/book drafts/the south african economy"
    "/___Contemporary/data/processed"
)

# ── Indicator Definitions ──────────────────────────────────────────────────
# Each indicator specifies: source CSV, column mapping, metadata, and which
# binding constraints it relates to.

INDICATORS = [
    # ── Growth & Macro ─────────────────────────────────────────────────────
    {
        "id": "real_gdp_growth",
        "name": "Real GDP Growth Rate",
        "source": "IMF World Economic Outlook",
        "source_code": "WEO NGDP_RPCH",
        "unit": "% year-on-year",
        "frequency": "annual",
        "binding_constraints": ["fiscal_space"],
        "hardcoded": [
            {"period": "2014", "value": 1.4},
            {"period": "2015", "value": 1.3},
            {"period": "2016", "value": 0.7},
            {"period": "2017", "value": 1.2},
            {"period": "2018", "value": 1.6},
            {"period": "2019", "value": 0.3},
            {"period": "2020", "value": -6.2},
            {"period": "2021", "value": 4.9},
            {"period": "2022", "value": 2.1},
            {"period": "2023", "value": 0.8},
            {"period": "2024", "value": 0.5},
            {"period": "2025", "value": 1.1},
        ],
    },
    {
        "id": "gfcf_gdp",
        "name": "Gross Fixed Capital Formation (% of GDP)",
        "source": "SARB / World Bank",
        "source_code": "WDI NE.GDI.FTOT.ZS",
        "unit": "% of GDP",
        "frequency": "annual",
        "binding_constraints": ["fiscal_space", "government_capacity"],
        "file": "gfcf_investment.csv",
        "period_col": "year",
        "value_col": "gfcf_pct",
    },
    {
        "id": "debt_gdp",
        "name": "Government Debt-to-GDP Ratio",
        "source": "National Treasury / IMF",
        "source_code": "WEO GGXWDG_NGDP",
        "unit": "% of GDP",
        "frequency": "annual",
        "binding_constraints": ["fiscal_space"],
        "file": "debt_gdp.csv",
        "period_col": "year",
        "value_col": "debt_pct",
        "extra_points": [{"period": "2025", "value": 77.3}],
    },
    {
        "id": "repo_rate",
        "name": "SARB Repo Rate",
        "source": "South African Reserve Bank",
        "source_code": "SARB KBP1403M",
        "unit": "%",
        "frequency": "annual",
        "binding_constraints": ["fiscal_space", "financial_access"],
        "file": "monetary_policy.csv",
        "period_col": "year",
        "value_col": "repo_rate",
        "extra_points": [{"period": "2025", "value": 7.5}],  # SARB cut to 7.5% Jan 2025
    },
    {
        "id": "twin_deficits",
        "name": "Fiscal Balance",
        "source": "National Treasury / SARB",
        "source_code": "Budget Review",
        "unit": "% of GDP",
        "frequency": "annual",
        "binding_constraints": ["fiscal_space"],
        "file": "twin_deficits.csv",
        "period_col": "year",
        "value_col": "fiscal_pct",
    },
    # ── Energy ─────────────────────────────────────────────────────────────
    {
        "id": "eskom_eaf",
        "name": "Eskom Energy Availability Factor",
        "source": "Eskom Integrated Reports",
        "source_code": "Eskom IR",
        "unit": "%",
        "frequency": "annual",
        "binding_constraints": ["energy"],
        "file": "eskom_eaf.csv",
        "period_col": "year",
        "value_col": "eaf_pct",
        "extra_points": [{"period": "2025", "value": 72.0}],  # Eskom reports improved EAF post load-shedding end
    },
    {
        "id": "load_shedding",
        "name": "Load Shedding (Electricity Shed)",
        "source": "CSIR / Eskom",
        "source_code": "CSIR Energy",
        "unit": "GWh",
        "frequency": "annual",
        "binding_constraints": ["energy"],
        "file": "load_shedding_gwh.csv",
        "period_col": "year",
        "value_col": "gwh_shed",
        "extra_points": [{"period": "2025", "value": 0.0}],  # Load shedding ended mid-2025
    },
    # ── Labour Market ──────────────────────────────────────────────────────
    {
        "id": "unemployment_rate",
        "name": "Unemployment Rate (Strict Definition)",
        "source": "Stats SA QLFS",
        "source_code": "P0211",
        "unit": "%",
        "frequency": "quarterly",
        "binding_constraints": ["labour_market"],
        "file": "lmis_unemployment_rate_total_quarterly.csv",
        "period_col": "time_period",
        "value_col": "value",
        "filter": {"indicator": "UNER"},
    },
    {
        "id": "neet_rate",
        "name": "NEET Rate (Not in Employment, Education or Training)",
        "source": "Stats SA QLFS / DE-LMIS",
        "source_code": "P0211",
        "unit": "%",
        "frequency": "quarterly",
        "binding_constraints": ["labour_market", "skills_education"],
        "file": "lmis_neet_rate_total_quarterly.csv",
        "period_col": "time_period",
        "value_col": "value",
        "filter": {"indicator": "NEETR"},
    },
    # ── Inequality & Poverty ───────────────────────────────────────────────
    {
        "id": "gini_coefficient",
        "name": "Gini Coefficient",
        "source": "World Bank / Stats SA",
        "source_code": "WDI SI.POV.GINI",
        "unit": "index (0–100)",
        "frequency": "annual",
        "binding_constraints": ["fiscal_space"],
        "file": "gini_inequality.csv",
        "period_col": "year",
        "value_col": "gini",
    },
    {
        "id": "poverty_headcount",
        "name": "Poverty Headcount (Upper-Bound Poverty Line)",
        "source": "Stats SA",
        "source_code": "P0310",
        "unit": "% of population",
        "frequency": "annual",
        "binding_constraints": ["fiscal_space"],
        "file": "poverty_headcount.csv",
        "period_col": "year",
        "value_col": "upper_bound_pct",
    },
    # ── Trade & Manufacturing ──────────────────────────────────────────────
    {
        "id": "manufacturing_index",
        "name": "Manufacturing Production Index",
        "source": "Stats SA",
        "source_code": "P3041.2",
        "unit": "index (2015=100)",
        "frequency": "monthly",
        "binding_constraints": ["trade_openness", "regulatory_burden"],
        "file": "manufacturing_production_index.csv",
        "period_col": "date",
        "value_col": "index",
        "resample": "annual",  # average monthly to annual for summary
    },
    {
        "id": "tariff_rate",
        "name": "Average Applied Tariff Rate",
        "source": "World Bank / WTO",
        "source_code": "WITS",
        "unit": "%",
        "frequency": "annual",
        "binding_constraints": ["trade_openness"],
        "file": "tariff_rates.csv",
        "period_col": "year",
        "value_col": "simple_avg_tariff",
    },
    # ── Infrastructure & Transport ─────────────────────────────────────────
    {
        "id": "transnet_freight",
        "name": "Transnet Freight Volume",
        "source": "Transnet Annual Reports",
        "source_code": "Transnet IR",
        "unit": "million tonnes",
        "frequency": "annual",
        "binding_constraints": ["transport_logistics"],
        "file": "transnet_freight.csv",
        "period_col": "year",
        "value_col": "volume_mt",
    },
    # ── Human Capital ──────────────────────────────────────────────────────
    {
        "id": "life_expectancy",
        "name": "Life Expectancy at Birth",
        "source": "World Bank / Stats SA",
        "source_code": "WDI SP.DYN.LE00.IN",
        "unit": "years",
        "frequency": "annual",
        "binding_constraints": ["health_systems"],
        "file": "life_expectancy_mortality.csv",
        "period_col": "year",
        "value_col": "life_expectancy",
    },
    {
        "id": "tertiary_enrolment",
        "name": "Tertiary Education Enrolment",
        "source": "DHET / Stats SA",
        "source_code": "P9103",
        "unit": "thousands",
        "frequency": "annual",
        "binding_constraints": ["skills_education"],
        "file": "tertiary_enrolment.csv",
        "period_col": "year",
        "value_col": "university",
        "transform": "to_thousands",
    },
]


def read_csv(filepath: str) -> list[dict]:
    """Read a CSV file and return list of row dicts."""
    with open(filepath, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader)


def parse_value(raw: str) -> float | None:
    """Parse a numeric string, returning None for NA/empty."""
    if not raw or raw.strip().upper() in ("NA", "N/A", "", "."):
        return None
    try:
        return float(raw.replace(",", ""))
    except ValueError:
        return None


def extract_period(row: dict, period_col: str) -> str | None:
    """Extract a sortable period string from a row."""
    raw = row.get(period_col, "").strip()
    if not raw:
        return None
    # Handle quarterly: "2015-Q1" → "2015-Q1"
    if "-Q" in raw:
        return raw
    # Handle monthly date: "1998-01-01" → "1998-01"
    if len(raw) >= 7 and raw[4] == "-":
        return raw[:7] if len(raw) > 4 else raw
    # Handle year: "2005" → "2005"
    try:
        int(float(raw))
        return str(int(float(raw)))
    except ValueError:
        return raw


def process_indicator(spec: dict, source_dir: str) -> dict | None:
    """Process a single indicator spec into the output format."""
    # Handle hardcoded data (e.g., IMF WEO directly)
    if "hardcoded" in spec:
        series = spec["hardcoded"]
        latest = series[-1]
        return {
            "id": spec["id"],
            "name": spec["name"],
            "source": spec["source"],
            "source_code": spec["source_code"],
            "unit": spec["unit"],
            "frequency": spec["frequency"],
            "binding_constraints": spec["binding_constraints"],
            "latest_value": latest["value"],
            "latest_period": latest["period"],
            "sparkline": series[-12:],
            "values": series,
        }

    filepath = os.path.join(source_dir, spec["file"])
    if not os.path.exists(filepath):
        print(f"  WARNING: {spec['file']} not found, skipping {spec['id']}")
        return None

    rows = read_csv(filepath)
    if not rows:
        print(f"  WARNING: {spec['file']} is empty, skipping {spec['id']}")
        return None

    # Apply row filter if specified (e.g., for LMIS data with multiple indicators)
    filter_spec = spec.get("filter")
    if filter_spec:
        rows = [r for r in rows if all(r.get(k) == v for k, v in filter_spec.items())]

    # Extract period-value pairs
    period_col = spec["period_col"]
    value_col = spec["value_col"]
    series = []
    for row in rows:
        period = extract_period(row, period_col)
        value = parse_value(row.get(value_col, ""))
        if period is not None and value is not None:
            series.append({"period": period, "value": round(value, 2)})

    if not series:
        print(f"  WARNING: no valid data for {spec['id']}")
        return None

    # Sort by period
    series.sort(key=lambda x: x["period"])

    # Remove duplicates (keep first)
    seen = set()
    deduped = []
    for pt in series:
        if pt["period"] not in seen:
            seen.add(pt["period"])
            deduped.append(pt)
    series = deduped

    # Apply transforms
    transform = spec.get("transform")
    if transform == "growth_rate":
        growth = []
        for i in range(1, len(series)):
            prev = series[i - 1]["value"]
            curr = series[i]["value"]
            if prev and prev > 0:
                rate = ((curr - prev) / prev) * 100
                growth.append({"period": series[i]["period"], "value": round(rate, 2)})
        series = growth
    elif transform == "to_thousands":
        series = [{"period": pt["period"], "value": round(pt["value"] / 1000, 1)} for pt in series]

    # Resample monthly → annual average if specified
    if spec.get("resample") == "annual":
        yearly = {}
        for pt in series:
            year = pt["period"][:4]
            yearly.setdefault(year, []).append(pt["value"])
        series = [
            {"period": y, "value": round(sum(vs) / len(vs), 1)}
            for y, vs in sorted(yearly.items())
        ]

    if not series:
        print(f"  WARNING: no data after transforms for {spec['id']}")
        return None

    # Append extra data points (e.g., 2025 estimates from IMF/SARB)
    extra = spec.get("extra_points", [])
    if extra:
        existing_periods = {pt["period"] for pt in series}
        for pt in extra:
            if pt["period"] not in existing_periods:
                series.append(pt)
        series.sort(key=lambda x: x["period"])

    latest = series[-1]
    # Sparkline: last 12 data points
    sparkline = series[-12:]

    return {
        "id": spec["id"],
        "name": spec["name"],
        "source": spec["source"],
        "source_code": spec["source_code"],
        "unit": spec["unit"],
        "frequency": spec["frequency"],
        "binding_constraints": spec["binding_constraints"],
        "latest_value": latest["value"],
        "latest_period": latest["period"],
        "sparkline": sparkline,
        "values": series,
    }


def main():
    parser = argparse.ArgumentParser(description="Build economic indicator JSON files")
    parser.add_argument(
        "--source-dir",
        default=DEFAULT_SOURCE,
        help="Path to the processed CSV directory",
    )
    args = parser.parse_args()

    source_dir = args.source_dir
    if not os.path.isdir(source_dir):
        print(f"ERROR: Source directory not found: {source_dir}")
        sys.exit(1)

    output_dir = Path(__file__).resolve().parent.parent / "data"

    print(f"Reading from: {source_dir}")
    print(f"Writing to:   {output_dir}")
    print(f"Processing {len(INDICATORS)} indicators...\n")

    results = []
    for spec in INDICATORS:
        print(f"  {spec['id']}...", end=" ")
        result = process_indicator(spec, source_dir)
        if result:
            results.append(result)
            n = len(result["values"])
            print(f"OK ({n} data points, latest: {result['latest_period']} = {result['latest_value']} {spec['unit']})")
        else:
            print("SKIPPED")

    print(f"\n{len(results)} indicators processed successfully.")

    # Write full output (all historical data)
    full_path = output_dir / "indicators_full.json"
    with open(full_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    print(f"Wrote {full_path} ({full_path.stat().st_size / 1024:.1f} KB)")

    # Write summary output (sparklines + latest values only, no full history)
    summary = []
    for ind in results:
        summary.append({
            "id": ind["id"],
            "name": ind["name"],
            "source": ind["source"],
            "source_code": ind["source_code"],
            "unit": ind["unit"],
            "frequency": ind["frequency"],
            "binding_constraints": ind["binding_constraints"],
            "latest_value": ind["latest_value"],
            "latest_period": ind["latest_period"],
            "sparkline": ind["sparkline"],
        })

    summary_path = output_dir / "indicators_summary.json"
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print(f"Wrote {summary_path} ({summary_path.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
