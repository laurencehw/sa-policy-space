"""
SA Policy Space — EconRSA Research Papers Updater
===================================================
Scrapes new publications from EconRSA (working papers, policy papers,
policy insights) and upserts into the Supabase research_papers table.

Usage:
    python update_research_papers.py               # check for new papers
    python update_research_papers.py --dry-run     # show what would be added

Environment variables required:
    SUPABASE_URL      - Your Supabase project URL
    SUPABASE_KEY      - Your Supabase service_role key
"""

import os
import sys
import re
import time
import logging
import argparse
import requests
from datetime import datetime
from supabase import create_client

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

ERSA_BASE = "https://econrsa.org"

# Pages to scrape for publications
PUBLICATION_PAGES = [
    {
        "url": f"{ERSA_BASE}/policy-insights/",
        "paper_type": "policy_paper",
        "label": "Policy Insights",
    },
    {
        "url": f"{ERSA_BASE}/publications/",
        "paper_type": "policy_paper",
        "label": "Publications",
    },
]

# Also check the OJS working papers repository
ERSA_WPS_BASE = "https://ersawps.org/index.php/working-paper-series"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Scraping helpers
# ---------------------------------------------------------------------------

def fetch_page(url: str) -> str:
    """Fetch a web page and return its HTML."""
    resp = requests.get(url, timeout=60, headers={
        "User-Agent": "SA-Policy-Space-Bot/1.0 (academic research; contact: lwilsesamson@gmail.com)"
    })
    resp.raise_for_status()
    return resp.text


def extract_ersa_publications(html: str, paper_type: str) -> list[dict]:
    """
    Extract publication entries from an ERSA page.
    ERSA uses WordPress/Elementor — publications are typically in
    article cards with title, date, author, and link.
    """
    papers = []

    # Pattern to match publication links and titles
    # ERSA pages use <a href="/publications/..."> with title text
    link_pattern = re.compile(
        r'href="(https://econrsa\.org/publications/[^"]+)"[^>]*>([^<]*)</a>',
        re.IGNORECASE,
    )

    # Date pattern (e.g., "March 25, 2026" or "February 9, 2026")
    date_pattern = re.compile(
        r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})',
        re.IGNORECASE,
    )

    # Author pattern
    author_pattern = re.compile(
        r'(?:by|author[/:])\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)',
        re.IGNORECASE,
    )

    # Find all publication links
    for match in link_pattern.finditer(html):
        url = match.group(1)
        title = match.group(2).strip()

        if not title or len(title) < 10:
            continue

        # Generate a stable ID from the URL
        slug = url.rstrip("/").split("/")[-1]
        ersa_id = f"ersa-{slug}"

        paper = {
            "title": title,
            "url": url,
            "source_org": "ERSA",
            "paper_type": paper_type,
            "ersa_paper_id": ersa_id,
            "authors": None,
            "publication_date": None,
            "abstract": None,
            "themes": [],
        }

        papers.append(paper)

    return papers


def extract_working_papers_ojs(html: str) -> list[dict]:
    """
    Extract working papers from the ERSA OJS repository.
    OJS has a more structured layout.
    """
    papers = []

    # OJS article pattern
    article_pattern = re.compile(
        r'<a[^>]*href="(https://ersawps\.org/index\.php/working-paper-series/article/view/\d+)"[^>]*>\s*([^<]+)</a>',
        re.IGNORECASE,
    )

    for match in article_pattern.finditer(html):
        url = match.group(1)
        title = match.group(2).strip()

        if not title or len(title) < 10:
            continue

        # Extract article ID from URL
        article_id = url.rstrip("/").split("/")[-1]
        ersa_id = f"ersa-wp-{article_id}"

        paper = {
            "title": title,
            "url": url,
            "source_org": "ERSA",
            "paper_type": "working_paper",
            "ersa_paper_id": ersa_id,
            "authors": None,
            "publication_date": None,
            "abstract": None,
            "themes": [],
        }

        papers.append(paper)

    return papers


def enrich_paper_detail(paper: dict) -> dict:
    """
    Fetch the individual paper page to extract abstract, authors, date.
    """
    try:
        html = fetch_page(paper["url"])
        time.sleep(0.5)

        # Try to extract abstract/description
        # Look for meta description or content summary
        meta_desc = re.search(
            r'<meta\s+(?:name|property)="(?:description|og:description)"\s+content="([^"]*)"',
            html, re.IGNORECASE
        )
        if meta_desc:
            paper["abstract"] = meta_desc.group(1).strip()[:1000]

        # Try to extract date
        date_match = re.search(
            r'datetime="(\d{4}-\d{2}-\d{2})',
            html, re.IGNORECASE
        )
        if date_match:
            paper["publication_date"] = date_match.group(1)

        # Try to extract author
        author_meta = re.search(
            r'<meta\s+(?:name|property)="(?:author|article:author)"\s+content="([^"]*)"',
            html, re.IGNORECASE
        )
        if author_meta:
            paper["authors"] = author_meta.group(1).strip()

    except Exception as e:
        log.warning(f"  Could not enrich paper: {e}")

    return paper


def infer_themes(title: str) -> list[str]:
    """Infer theme tags from paper title."""
    title_lower = title.lower()
    themes = []

    theme_keywords = {
        "trade": ["trade", "export", "import", "tariff"],
        "competition": ["competition", "merger", "antitrust", "market concentration"],
        "growth": ["growth", "gdp", "economic performance"],
        "employment": ["employment", "labour", "labor", "job", "unemployment"],
        "investment": ["investment", "capital", "fdi"],
        "housing": ["housing", "urban", "spatial"],
        "agriculture": ["agriculture", "farming", "food", "agri"],
        "mining": ["mining", "mineral", "resources"],
        "manufacturing": ["manufacturing", "industrial", "factory"],
        "education": ["education", "skills", "training", "university"],
        "health": ["health", "medical", "pharmaceutical"],
        "energy": ["energy", "electricity", "eskom", "renewable"],
        "fiscal": ["fiscal", "budget", "tax", "expenditure", "treasury"],
        "monetary": ["monetary", "inflation", "interest rate", "reserve bank"],
        "bee": ["bee", "empowerment", "transformation", "b-bbee"],
        "infrastructure": ["infrastructure", "transport", "logistics"],
        "regulation": ["regulation", "reform", "policy", "governance"],
    }

    for theme, keywords in theme_keywords.items():
        if any(kw in title_lower for kw in keywords):
            themes.append(theme)

    return themes if themes else ["general"]

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


def get_existing_paper_ids(supabase) -> set[str]:
    """Get all existing ersa_paper_ids."""
    result = supabase.table("research_papers").select("ersa_paper_id").not_.is_("ersa_paper_id", "null").execute()
    return {row["ersa_paper_id"] for row in result.data}


def upsert_papers(supabase, papers: list[dict]) -> int:
    """Insert new papers."""
    count = 0
    for paper in papers:
        try:
            supabase.table("research_papers").upsert(
                paper,
                on_conflict="ersa_paper_id",
            ).execute()
            count += 1
        except Exception as e:
            log.error(f"  Error inserting '{paper['title'][:50]}': {e}")
    return count

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="Update SA Policy Space with EconRSA publications")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be added without writing to DB")
    parser.add_argument("--enrich", action="store_true", help="Fetch individual paper pages for abstracts/dates")
    args = parser.parse_args()

    all_papers = []

    # Scrape ERSA publication pages
    for page_config in PUBLICATION_PAGES:
        log.info(f"\nFetching {page_config['label']} from {page_config['url']}...")
        try:
            html = fetch_page(page_config["url"])
            papers = extract_ersa_publications(html, page_config["paper_type"])
            log.info(f"  Found {len(papers)} papers")
            all_papers.extend(papers)
            time.sleep(1)
        except Exception as e:
            log.error(f"  Failed to fetch {page_config['url']}: {e}")

    # Scrape ERSA working papers (OJS)
    log.info(f"\nFetching working papers from {ERSA_WPS_BASE}...")
    try:
        html = fetch_page(ERSA_WPS_BASE)
        wp_papers = extract_working_papers_ojs(html)
        log.info(f"  Found {len(wp_papers)} working papers")
        all_papers.extend(wp_papers)
    except Exception as e:
        log.error(f"  Failed to fetch working papers: {e}")

    # Deduplicate by ersa_paper_id
    seen = set()
    unique_papers = []
    for p in all_papers:
        if p["ersa_paper_id"] not in seen:
            seen.add(p["ersa_paper_id"])
            unique_papers.append(p)

    log.info(f"\nTotal unique papers found: {len(unique_papers)}")

    if not args.dry_run:
        supabase = get_supabase_client()
        existing_ids = get_existing_paper_ids(supabase)
        log.info(f"Already in database: {len(existing_ids)} papers")

        new_papers = [p for p in unique_papers if p["ersa_paper_id"] not in existing_ids]
        log.info(f"New papers to add: {len(new_papers)}")
    else:
        new_papers = unique_papers

    # Enrich with abstracts/dates if requested
    if args.enrich and new_papers:
        log.info("Enriching papers with metadata from individual pages...")
        for i, paper in enumerate(new_papers):
            paper = enrich_paper_detail(paper)
            new_papers[i] = paper

    # Add theme tags
    for paper in new_papers:
        if not paper.get("themes"):
            paper["themes"] = infer_themes(paper["title"])

    if args.dry_run:
        log.info("\n[DRY RUN] Papers that would be added:")
        for p in new_papers:
            log.info(f"  - {p['publication_date'] or 'no date'}: {p['title'][:80]}")
            log.info(f"    Type: {p['paper_type']}, Themes: {p['themes']}")
    else:
        inserted = upsert_papers(supabase, new_papers)
        log.info(f"\nInserted {inserted} new papers")

    log.info(f"\n{'='*60}")
    log.info(f"Done!")
    if args.dry_run:
        log.info("(This was a dry run — nothing was written to the database)")


if __name__ == "__main__":
    main()
