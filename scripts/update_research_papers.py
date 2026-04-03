"""
SA Policy Space - EconRSA Research Papers Updater
Scrapes new publications from EconRSA and upserts into the Supabase
research_papers table.

Usage:
    python update_research_papers.py               # check for new papers
    python update_research_papers.py --enrich      # also fetch abstracts/dates
    python update_research_papers.py --dry-run     # show what would be added

Environment variables required:
    SUPABASE_URL      - Your Supabase project URL
    SUPABASE_KEY      - Your Supabase service_role key
"""

import os, sys, re, time, logging, argparse, requests
from supabase import create_client

ERSA_BASE = "https://econrsa.org"
PUBLICATION_PAGES = [
    {"url":f"{ERSA_BASE}/policy-insights/","paper_type":"policy_paper","label":"Policy Insights"},
    {"url":f"{ERSA_BASE}/publications/","paper_type":"policy_paper","label":"Publications"},
]
ERSA_WPS_BASE = "https://ersawps.org/index.php/working-paper-series"

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

def fetch_page(url):
    resp = requests.get(url, timeout=60, headers={"User-Agent":"SA-Policy-Space-Bot/1.0 (academic research; contact: lwilsesamson@gmail.com)"})
    resp.raise_for_status(); return resp.text

def extract_ersa_publications(html, paper_type):
    papers = []
    for match in re.finditer(r'href="(https://econrsa\.org/publications/[^"]+)"[^>]*>([^<]*)</a>', html, re.IGNORECASE):
        url, title = match.group(1), match.group(2).strip()
        if not title or len(title) < 10: continue
        slug = url.rstrip("/").split("/")[-1]
        papers.append({"title":title,"url":url,"source_org":"ERSA","paper_type":paper_type,"ersa_paper_id":f"ersa-{slug}","authors":None,"publication_date":None,"abstract":None,"themes":[]})
    return papers

def extract_working_papers_ojs(html):
    papers = []
    for match in re.finditer(r'<a[^>]*href="(https://ersawps\.org/index\.php/working-paper-series/article/view/\d+)"[^>]*>\s*([^<]+)</a>', html, re.IGNORECASE):
        url, title = match.group(1), match.group(2).strip()
        if not title or len(title) < 10: continue
        article_id = url.rstrip("/").split("/")[-1]
        papers.append({"title":title,"url":url,"source_org":"ERSA","paper_type":"working_paper","ersa_paper_id":f"ersa-wp-{article_id}","authors":None,"publication_date":None,"abstract":None,"themes":[]})
    return papers

def enrich_paper_detail(paper):
    try:
        html = fetch_page(paper["url"]); time.sleep(0.5)
        m = re.search(r'<meta\s+(?:name|property)="(?:description|og:description)"\s+content="([^"]*)"', html, re.IGNORECASE)
        if m: paper["abstract"] = m.group(1).strip()[:1000]
        m = re.search(r'datetime="(\d{4}-\d{2}-\d{2})', html, re.IGNORECASE)
        if m: paper["publication_date"] = m.group(1)
        m = re.search(r'<meta\s+(?:name|property)="(?:author|article:author)"\s+content="([^"]*)"', html, re.IGNORECASE)
        if m: paper["authors"] = m.group(1).strip()
    except Exception as e: log.warning(f"  Could not enrich paper: {e}")
    return paper

def infer_themes(title):
    tl = title.lower(); themes = []
    kw = {"trade":["trade","export","import","tariff"],"competition":["competition","merger","antitrust"],"growth":["growth","gdp"],"employment":["employment","labour","labor","job","unemployment"],"investment":["investment","capital","fdi"],"housing":["housing","urban","spatial"],"agriculture":["agriculture","farming","food"],"mining":["mining","mineral"],"manufacturing":["manufacturing","industrial"],"education":["education","skills","training"],"health":["health","medical"],"energy":["energy","electricity","eskom"],"fiscal":["fiscal","budget","tax"],"monetary":["monetary","inflation","interest rate"],"bee":["bee","empowerment","transformation"],"infrastructure":["infrastructure","transport","logistics"],"regulation":["regulation","reform","governance"]}
    for theme, words in kw.items():
        if any(w in tl for w in words): themes.append(theme)
    return themes if themes else ["general"]

def get_supabase_client():
    url = os.environ.get("SUPABASE_URL"); key = os.environ.get("SUPABASE_KEY")
    if not url or not key: log.error("Missing SUPABASE_URL or SUPABASE_KEY"); sys.exit(1)
    return create_client(url, key)

def get_existing_paper_ids(supabase):
    result = supabase.table("research_papers").select("ersa_paper_id").not_.is_("ersa_paper_id","null").execute()
    return {row["ersa_paper_id"] for row in result.data}

def upsert_papers(supabase, papers):
    count = 0
    for paper in papers:
        try: supabase.table("research_papers").upsert(paper, on_conflict="ersa_paper_id").execute(); count += 1
        except Exception as e: log.error(f"  Error inserting '{paper['title'][:50]}': {e}")
    return count

def main():
    parser = argparse.ArgumentParser(description="Update SA Policy Space with EconRSA publications")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--enrich", action="store_true")
    args = parser.parse_args()
    all_papers = []
    for pc in PUBLICATION_PAGES:
        log.info(f"\nFetching {pc['label']} from {pc['url']}...")
        try:
            html = fetch_page(pc["url"]); papers = extract_ersa_publications(html, pc["paper_type"])
            log.info(f"  Found {len(papers)} papers"); all_papers.extend(papers); time.sleep(1)
        except Exception as e: log.error(f"  Failed: {e}")
    log.info(f"\nFetching working papers from {ERSA_WPS_BASE}...")
    try:
        html = fetch_page(ERSA_WPS_BASE); wp = extract_working_papers_ojs(html)
        log.info(f"  Found {len(wp)} working papers"); all_papers.extend(wp)
    except Exception as e: log.error(f"  Failed: {e}")
    seen = set(); unique = []
    for p in all_papers:
        if p["ersa_paper_id"] not in seen: seen.add(p["ersa_paper_id"]); unique.append(p)
    log.info(f"\nTotal unique papers found: {len(unique)}")
    if not args.dry_run:
        supabase = get_supabase_client(); existing = get_existing_paper_ids(supabase)
        log.info(f"Already in database: {len(existing)} papers")
        new_papers = [p for p in unique if p["ersa_paper_id"] not in existing]
        log.info(f"New papers to add: {len(new_papers)}")
    else: new_papers = unique
    if args.enrich and new_papers:
        log.info("Enriching papers..."); new_papers = [enrich_paper_detail(p) for p in new_papers]
    for p in new_papers:
        if not p.get("themes"): p["themes"] = infer_themes(p["title"])
    if args.dry_run:
        log.info("\n[DRY RUN] Papers that would be added:")
        for p in new_papers: log.info(f"  - {p['publication_date'] or 'no date'}: {p['title'][:80]}")
    else:
        inserted = upsert_papers(supabase, new_papers); log.info(f"\nInserted {inserted} new papers")
    log.info(f"\n{'='*60}\nDone!")
    if args.dry_run: log.info("(This was a dry run)")

if __name__ == "__main__": main()
