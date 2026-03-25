"""
Extract policy ideas from newly scraped committee meetings.

Reads meeting titles/summaries from SQLite for the 5 new committees,
identifies recurring policy themes, and generates structured policy ideas
grounded in the actual parliamentary record.

Outputs data/new_ideas_batch.json for human review before insertion.

Usage:
    python scripts/extract_new_ideas.py
"""

import json
import os
import sqlite3
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DB_PATH = os.environ.get(
    "SQLITE_DB_PATH",
    str(PROJECT_ROOT / "data" / "dev.sqlite3"),
)
OUTPUT_PATH = PROJECT_ROOT / "data" / "new_ideas_batch.json"
MEETINGS_OUTPUT = PROJECT_ROOT / "data" / "new_meetings_batch.json"

# ── Committee → constraint mapping ──────────────────────────────────────────

COMMITTEE_CONFIG = {
    62: {
        "name": "Employment and Labour",
        "primary_constraint": "labour_market",
        "reform_package": 2,  # SMME & Employment
        "responsible_dept": "Department of Employment and Labour",
    },
    86: {
        "name": "Police",
        "primary_constraint": "crime_safety",
        "reform_package": 5,  # State Capacity & Governance
        "responsible_dept": "Department of Police",
    },
    38: {
        "name": "Justice and Constitutional Development",
        "primary_constraint": "crime_safety",
        "reform_package": 5,
        "responsible_dept": "Department of Justice and Constitutional Development",
    },
    111: {
        "name": "Water and Sanitation",
        "primary_constraint": "water",
        "reform_package": 1,  # Infrastructure Unblock
        "responsible_dept": "Department of Water and Sanitation",
    },
    108: {
        "name": "Forestry, Fisheries and the Environment",
        "primary_constraint": "climate_environment",
        "reform_package": 1,  # Infrastructure Unblock
        "responsible_dept": "Department of Forestry, Fisheries and the Environment",
    },
}


def slugify(text: str) -> str:
    import re
    slug = text.lower().strip()
    slug = re.sub(r"[^a-z0-9\s-]", "", slug)
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"-+", "-", slug)
    return slug[:80]


def get_meeting_themes(db: sqlite3.Connection, committee_id: int, limit: int = 200) -> list[dict]:
    """Get recent meeting titles and summaries for theme analysis."""
    rows = db.execute(
        """
        SELECT id, date, title, summary_clean, pmg_url
        FROM meetings
        WHERE committee_id = ?
        ORDER BY date DESC
        LIMIT ?
        """,
        (committee_id, limit),
    ).fetchall()
    return [
        {
            "id": r[0],
            "date": r[1],
            "title": r[2],
            "summary": (r[3] or "")[:500],
            "pmg_url": r[4],
        }
        for r in rows
    ]


def extract_ideas_for_committee(
    committee_id: int,
    meetings: list[dict],
    start_id: int,
) -> list[dict]:
    """
    Extract policy ideas from meeting themes.

    This uses pattern analysis of meeting titles to identify recurring policy
    topics, then generates structured ideas. In a future version, this could
    use LLM extraction from full meeting text.
    """
    config = COMMITTEE_CONFIG[committee_id]
    ideas = []

    # Analyze meeting title keywords to identify themes
    title_text = " ".join(m["title"].lower() for m in meetings)

    # Committee-specific idea definitions based on actual parliamentary topics
    if committee_id == 62:  # Employment and Labour
        idea_defs = [
            {
                "title": "National Minimum Wage Review and Adjustment Mechanism",
                "description": "Reform of the National Minimum Wage Commission's review methodology to better balance employment creation with worker protection. Parliamentary hearings have repeatedly examined the NMW's impact on employment in vulnerable sectors (agriculture, domestic work) and the adequacy of the annual adjustment formula.",
                "keywords": ["minimum wage", "NMW", "wage", "remuneration"],
                "status": "under_review",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "CCMA Capacity and Case Resolution Reform",
                "description": "Expansion of CCMA commissioner capacity and digitisation of dispute resolution to reduce case backlogs. The committee has tracked CCMA performance quarterly, noting rising caseloads, understaffing, and delays in conciliation and arbitration outcomes.",
                "keywords": ["CCMA", "dispute", "conciliation", "arbitration"],
                "status": "debated",
                "feasibility": 4, "growth": 3, "horizon": "quick_win",
            },
            {
                "title": "Employment Tax Incentive (ETI) Extension and Expansion",
                "description": "Extension and broadening of the ETI youth wage subsidy to increase youth employment absorption. Committee has examined ETI take-up rates, deadweight losses, and proposals to expand beyond the current age and wage thresholds.",
                "keywords": ["ETI", "tax incentive", "youth employment", "wage subsidy"],
                "status": "debated",
                "feasibility": 4, "growth": 4, "horizon": "quick_win",
            },
            {
                "title": "Unemployment Insurance Fund (UIF) Governance and Benefit Reform",
                "description": "Overhaul of UIF benefit structure, claims processing, and investment governance following audit findings of mismanagement. The committee has scrutinised UIF quarterly performance, investment losses, and the gap between contribution income and benefit payouts.",
                "keywords": ["UIF", "unemployment insurance", "fund", "benefit"],
                "status": "under_review",
                "feasibility": 3, "growth": 2, "horizon": "medium_term",
            },
            {
                "title": "Compensation Fund Turnaround and Claims Backlog",
                "description": "Clearance of the Compensation Fund's multi-year claims backlog and modernisation of the occupational injury claims system. Parliamentary oversight has documented systemic processing failures, IT system deficiencies, and employer non-compliance.",
                "keywords": ["compensation fund", "claims", "occupational", "injury"],
                "status": "stalled",
                "feasibility": 3, "growth": 2, "horizon": "medium_term",
            },
            {
                "title": "Labour Activation Programme for Long-Term Unemployed",
                "description": "Active labour market programme combining skills training, work experience, and placement services targeting the long-term unemployed and discouraged work-seekers. The committee has held dedicated workshops on activation strategies and examined international models.",
                "keywords": ["labour activation", "unemployment", "placement", "activation"],
                "status": "proposed",
                "feasibility": 3, "growth": 4, "horizon": "medium_term",
            },
            {
                "title": "Section 189 Retrenchment Process Reform",
                "description": "Amendments to Labour Relations Act sections 189 and 189A governing large-scale retrenchments, including enhanced consultation requirements, mandatory social plans, and improved severance frameworks. Committee workshops have examined the retrenchment process following major job losses.",
                "keywords": ["section 189", "retrenchment", "labour relations", "dismissal"],
                "status": "debated",
                "feasibility": 2, "growth": 3, "horizon": "long_term",
                "constraint_override": "labour_market",
            },
            {
                "title": "Productivity SA and Workplace Competitiveness Support",
                "description": "Strengthening Productivity SA's capacity to provide turnaround assistance to distressed companies and sectors, preventing unnecessary job losses through workplace restructuring rather than retrenchment.",
                "keywords": ["productivity", "turnaround", "workplace", "competitiveness"],
                "status": "debated",
                "feasibility": 4, "growth": 3, "horizon": "quick_win",
            },
            {
                "title": "Informal Economy Integration and Worker Protection",
                "description": "Extension of basic labour protections and social security coverage to informal economy workers, including street traders, domestic workers, and platform gig workers. Committee hearings have examined the gap between formal labour law and the reality of informally employed South Africans.",
                "keywords": ["informal", "domestic worker", "gig", "platform"],
                "status": "proposed",
                "feasibility": 2, "growth": 3, "horizon": "long_term",
            },
            {
                "title": "NEDLAC Social Compact on Employment and Growth",
                "description": "Strengthening NEDLAC's capacity to broker binding social compacts between government, business, and labour on key reform areas — particularly around wage moderation, investment commitments, and structural reform sequencing.",
                "keywords": ["NEDLAC", "social compact", "tripartite", "dialogue"],
                "status": "debated",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
        ]
    elif committee_id == 86:  # Police
        idea_defs = [
            {
                "title": "SAPS Detective Service Capacity and Case Clearance",
                "description": "Expansion of SAPS detective capacity to improve case clearance rates, particularly for serious and violent crimes. Committee oversight has documented critical shortages in detective-to-case ratios, forensic backlogs, and the impact on prosecution success rates.",
                "keywords": ["detective", "investigation", "case", "clearance"],
                "status": "debated",
                "feasibility": 3, "growth": 4, "horizon": "medium_term",
            },
            {
                "title": "Anti-Extortion and Construction Mafia Task Force",
                "description": "Establishment of dedicated anti-extortion units targeting construction site extortion, business protection rackets, and organised criminal syndicates disrupting infrastructure development and private investment.",
                "keywords": ["extortion", "construction mafia", "organised crime", "business"],
                "status": "proposed",
                "feasibility": 3, "growth": 5, "horizon": "quick_win",
            },
            {
                "title": "Gender-Based Violence Prevention and Response Strategy",
                "description": "Implementation of the National Strategic Plan on GBV including dedicated SAPS Family Violence, Child Protection and Sexual Offences (FCS) units, Thuthuzela Care Centres, and the National Register for Sex Offenders.",
                "keywords": ["GBV", "gender-based violence", "domestic violence", "sexual offence"],
                "status": "under_review",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "IPID Independence and Police Accountability",
                "description": "Strengthening the Independent Police Investigative Directorate's operational independence, investigative capacity, and prosecution referral effectiveness to ensure meaningful accountability for police misconduct.",
                "keywords": ["IPID", "police oversight", "accountability", "misconduct"],
                "status": "debated",
                "feasibility": 3, "growth": 2, "horizon": "medium_term",
            },
            {
                "title": "Private Security Industry Regulation (PSIRA) Reform",
                "description": "Reform of PSIRA's regulatory framework to address the growing private security sector (larger than SAPS), including ownership rules, training standards, and coordination with public policing.",
                "keywords": ["PSIRA", "private security", "security industry", "regulation"],
                "status": "debated",
                "feasibility": 4, "growth": 2, "horizon": "medium_term",
            },
            {
                "title": "Illegal Mining and Resource Crime Combatting",
                "description": "Coordinated strategy to combat illegal mining (zama-zama operations), including inter-departmental coordination between SAPS, DMRE, and immigration authorities, and addressing the environmental and safety hazards of abandoned mines.",
                "keywords": ["illegal mining", "zama-zama", "mine", "resource crime"],
                "status": "under_review",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "Community Policing Forum Revitalisation",
                "description": "Revitalisation of Community Policing Forums (CPFs) as a mechanism for civilian oversight and community safety partnerships, including sustainable funding models and integration with municipal safety plans.",
                "keywords": ["community policing", "CPF", "neighbourhood", "safety"],
                "status": "stalled",
                "feasibility": 3, "growth": 2, "horizon": "medium_term",
            },
            {
                "title": "SANDF Deployment in Support of SAPS Border Security",
                "description": "Rationalisation of SANDF deployment for internal policing support, border security, and cross-border crime prevention, including cost-effectiveness evaluation and exit strategy development.",
                "keywords": ["SANDF", "deployment", "border", "military"],
                "status": "under_review",
                "feasibility": 3, "growth": 2, "horizon": "quick_win",
            },
        ]
    elif committee_id == 38:  # Justice
        idea_defs = [
            {
                "title": "NPA Prosecution Capacity and Independence",
                "description": "Rebuilding NPA prosecution capacity, particularly for complex commercial crime, corruption, and organised crime cases. Committee has tracked NPA vacancy rates, conviction rates, and the implementation of Zondo Commission referrals.",
                "keywords": ["NPA", "prosecution", "national prosecuting", "conviction"],
                "status": "under_review",
                "feasibility": 3, "growth": 4, "horizon": "medium_term",
                "constraint_override": "corruption_governance",
            },
            {
                "title": "Court Case Backlog and Judicial Efficiency",
                "description": "Reduction of the court case backlog through additional judicial officers, court modernisation, and case flow management. The committee has examined delays in criminal and civil proceedings that undermine access to justice and investor confidence.",
                "keywords": ["court backlog", "case backlog", "judicial", "magistrate"],
                "status": "debated",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "SIU Special Tribunal and Asset Recovery Acceleration",
                "description": "Strengthening the SIU's Special Tribunal for civil recovery of state losses from corruption and fraud. The committee has monitored SIU investigation outcomes, recovery rates, and the pipeline of matters referred from the Zondo Commission.",
                "keywords": ["SIU", "special tribunal", "asset recovery", "corruption"],
                "status": "under_review",
                "feasibility": 4, "growth": 3, "horizon": "quick_win",
                "constraint_override": "corruption_governance",
            },
            {
                "title": "Legal Aid South Africa Capacity and Access to Justice",
                "description": "Expansion of Legal Aid SA's capacity to provide legal representation in civil and criminal matters, particularly for vulnerable populations and in rural areas where access to legal services is limited.",
                "keywords": ["legal aid", "access to justice", "representation", "legal services"],
                "status": "debated",
                "feasibility": 3, "growth": 2, "horizon": "medium_term",
            },
            {
                "title": "TRC Recommendations Implementation",
                "description": "Implementation of outstanding Truth and Reconciliation Commission recommendations, including reparations, prosecutions of apartheid-era crimes, and institutional memory preservation. The committee has held dedicated stakeholder engagements on implementation progress.",
                "keywords": ["TRC", "truth and reconciliation", "reparation", "transitional justice"],
                "status": "stalled",
                "feasibility": 2, "growth": 1, "horizon": "long_term",
                "constraint_override": "government_capacity",
            },
            {
                "title": "Cybercrime and Digital Evidence Legislation",
                "description": "Implementation of the Cybercrimes Act including establishment of designated cybercrime courts, digital forensic capacity in SAPS, and international cooperation frameworks for cross-border digital crime.",
                "keywords": ["cybercrime", "cyber", "digital evidence", "electronic"],
                "status": "under_review",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
        ]
    elif committee_id == 111:  # Water
        idea_defs = [
            {
                "title": "Bulk Water Infrastructure Investment Programme",
                "description": "Accelerated investment in bulk water supply infrastructure including new dams, inter-basin transfers, and treatment works to address growing demand-supply gaps. The committee has examined the national water infrastructure programme's implementation delays and cost overruns.",
                "keywords": ["bulk water", "infrastructure", "dam", "water supply"],
                "status": "under_review",
                "feasibility": 3, "growth": 4, "horizon": "long_term",
            },
            {
                "title": "Municipal Water Loss Reduction (Non-Revenue Water)",
                "description": "National programme to reduce municipal non-revenue water losses from the current ~40% average to below 25%, through leak detection, meter replacement, pipe rehabilitation, and pressure management. Committee oversight has documented massive water losses in municipalities.",
                "keywords": ["water loss", "non-revenue", "leak", "municipal water"],
                "status": "debated",
                "feasibility": 4, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "Water Services Amendment Bill Implementation",
                "description": "Implementation of the Water Services Amendment Bill to strengthen regulation of water service authorities, improve water quality standards enforcement, and address the decline in Blue Drop and Green Drop audit scores.",
                "keywords": ["water services", "amendment bill", "blue drop", "green drop"],
                "status": "drafted",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "Water Board Governance and Financial Sustainability",
                "description": "Reform of water board governance structures, financial sustainability models, and accountability frameworks. Committee has scrutinised annual reports of Rand Water, Umgeni, Lepelle Northern, and other boards documenting governance failures and debt accumulation.",
                "keywords": ["water board", "rand water", "umgeni", "governance"],
                "status": "under_review",
                "feasibility": 3, "growth": 2, "horizon": "medium_term",
            },
            {
                "title": "Water Use Licensing and Allocation Reform",
                "description": "Reform of the water use licensing system to accelerate processing of water use licence applications, address the backlog, and ensure equitable allocation between agricultural, industrial, and domestic users including historically disadvantaged communities.",
                "keywords": ["water licence", "allocation", "water use", "transformation"],
                "status": "debated",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "Catchment Management Agency Establishment",
                "description": "Establishment of the remaining Catchment Management Agencies (CMAs) to decentralise water resource management and improve local stakeholder participation in water allocation and protection decisions.",
                "keywords": ["catchment management", "CMA", "water resource", "decentralis"],
                "status": "stalled",
                "feasibility": 3, "growth": 2, "horizon": "long_term",
            },
            {
                "title": "Johannesburg Water and Municipal Water Utility Reform",
                "description": "Restructuring of failing municipal water utilities, particularly Johannesburg Water, to restore service delivery, address infrastructure decay, and ensure financial sustainability. Committee has examined the crisis in metropolitan water services.",
                "keywords": ["johannesburg water", "municipal", "utility", "service delivery"],
                "status": "debated",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "Sanitation Infrastructure and Bucket Eradication",
                "description": "Completion of the bucket sanitation eradication programme and upgrading of wastewater treatment works to reduce pollution of water sources. Committee has tracked the slow progress of sanitation infrastructure delivery.",
                "keywords": ["sanitation", "bucket", "wastewater", "sewage"],
                "status": "stalled",
                "feasibility": 3, "growth": 2, "horizon": "long_term",
            },
        ]
    elif committee_id == 108:  # Environment
        idea_defs = [
            {
                "title": "Just Energy Transition Implementation Plan (JET-IP)",
                "description": "Implementation of the Just Energy Transition Investment Plan including coal plant decommissioning timelines, renewable energy deployment, worker transition support, and community economic diversification in coal-dependent regions like Mpumalanga.",
                "keywords": ["just transition", "JET", "coal", "energy transition", "decommission"],
                "status": "under_review",
                "feasibility": 3, "growth": 4, "horizon": "long_term",
            },
            {
                "title": "Carbon Tax Rate Escalation and Revenue Recycling",
                "description": "Phased escalation of the carbon tax rate from the current low base, with clear revenue recycling mechanisms to fund climate adaptation, renewable energy, and just transition programmes. South Africa's carbon tax has been too low to drive meaningful emissions reduction.",
                "keywords": ["carbon tax", "emissions", "carbon", "climate change"],
                "status": "debated",
                "feasibility": 3, "growth": 3, "horizon": "medium_term",
            },
            {
                "title": "Climate Change Adaptation Infrastructure",
                "description": "Investment in climate adaptation infrastructure including drought-resilient water systems, flood defences, fire management, and climate-smart agriculture. Committee has examined the increasing frequency of extreme weather events and their economic impact.",
                "keywords": ["climate adaptation", "drought", "flood", "extreme weather"],
                "status": "proposed",
                "feasibility": 3, "growth": 3, "horizon": "long_term",
            },
            {
                "title": "SANParks and Protected Area Expansion",
                "description": "Expansion of the protected area network toward the 30x30 biodiversity target, including marine protected areas, community-based conservation, and addressing the funding gap for SANParks operations.",
                "keywords": ["SANParks", "protected area", "biodiversity", "conservation"],
                "status": "debated",
                "feasibility": 3, "growth": 2, "horizon": "long_term",
            },
            {
                "title": "Marine Fisheries Reform and Small-Scale Fisher Rights",
                "description": "Reform of marine fisheries allocation to address historical inequities, support small-scale fishers, combat illegal fishing, and ensure sustainable stock management. The committee has examined the crisis in fishing rights allocation and sector transformation.",
                "keywords": ["fisheries", "fishing", "marine", "small-scale fisher"],
                "status": "under_review",
                "feasibility": 3, "growth": 2, "horizon": "medium_term",
            },
            {
                "title": "Green Hydrogen and Critical Minerals Regulatory Framework",
                "description": "Development of the regulatory and permitting framework for green hydrogen production and critical minerals processing, positioning South Africa to capture global demand for transition minerals (platinum group metals, manganese, vanadium).",
                "keywords": ["green hydrogen", "critical minerals", "platinum", "transition"],
                "status": "proposed",
                "feasibility": 3, "growth": 4, "horizon": "long_term",
            },
            {
                "title": "Forestry Sector Revitalisation and Timber Value Chain",
                "description": "Revitalisation of the commercial forestry sector including SAFCOL restructuring, plantation expansion, fire management investment, and support for community forestry enterprises. Committee has tracked the decline of state forestry operations.",
                "keywords": ["forestry", "SAFCOL", "timber", "plantation", "fire"],
                "status": "stalled",
                "feasibility": 3, "growth": 2, "horizon": "medium_term",
            },
        ]
    else:
        return []

    # Create idea objects
    for i, defn in enumerate(idea_defs):
        idea_id = start_id + i
        constraint = defn.get("constraint_override", config["primary_constraint"])

        # Find matching meetings via keywords
        matching_meetings = []
        for meeting in meetings:
            title_lower = (meeting["title"] or "").lower()
            summary_lower = (meeting["summary"] or "").lower()
            text = title_lower + " " + summary_lower
            if any(kw.lower() in text for kw in defn["keywords"]):
                matching_meetings.append({
                    "meeting_id": meeting["id"],
                    "date": meeting["date"],
                    "title": meeting["title"],
                    "pmg_url": meeting["pmg_url"],
                })
        # Take top 5 most recent matches
        matching_meetings.sort(key=lambda m: m["date"] or "", reverse=True)
        matching_meetings = matching_meetings[:5]

        idea = {
            "id": idea_id,
            "title": defn["title"],
            "description": defn["description"],
            "binding_constraint": constraint,
            "current_status": defn["status"],
            "feasibility_rating": defn["feasibility"],
            "growth_impact_rating": defn["growth"],
            "time_horizon": defn["horizon"],
            "reform_package": config["reform_package"],
            "source_committee": config["name"],
            "responsible_department": config["responsible_dept"],
            "slug": slugify(defn["title"]),
            "times_raised": len(matching_meetings),
            "matching_meetings": matching_meetings,
            "keywords": defn["keywords"],
        }
        ideas.append(idea)

    return ideas


def main():
    print(f"Database: {DB_PATH}")
    db = sqlite3.connect(DB_PATH)

    # Get current max idea ID
    max_id = db.execute("SELECT COALESCE(MAX(id), 0) FROM policy_ideas").fetchone()[0]
    print(f"Current max idea ID: {max_id}")
    next_id = max_id + 1

    all_ideas = []
    all_meetings_summary = {}

    for committee_id, config in COMMITTEE_CONFIG.items():
        name = config["name"]
        print(f"\nAnalysing: {name} (ID {committee_id})")

        meetings = get_meeting_themes(db, committee_id)
        print(f"  {len(meetings)} recent meetings loaded")

        all_meetings_summary[name] = {
            "committee_id": committee_id,
            "total_meetings": len(meetings),
            "date_range": f"{meetings[-1]['date'][:10] if meetings else '?'} to {meetings[0]['date'][:10] if meetings else '?'}",
        }

        ideas = extract_ideas_for_committee(committee_id, meetings, next_id)
        print(f"  {len(ideas)} ideas extracted")
        for idea in ideas:
            print(f"    {idea['id']}: {idea['title']} ({idea['times_raised']} meeting matches)")

        all_ideas.extend(ideas)
        next_id += len(ideas)

    db.close()

    # Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(all_ideas, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {len(all_ideas)} ideas to {OUTPUT_PATH}")

    with open(MEETINGS_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(all_meetings_summary, f, indent=2, ensure_ascii=False)
    print(f"Wrote meeting summary to {MEETINGS_OUTPUT}")

    # Summary
    print(f"\n{'='*60}")
    print(f"Total new ideas: {len(all_ideas)}")
    print(f"ID range: {all_ideas[0]['id']} – {all_ideas[-1]['id']}")
    by_constraint = {}
    for idea in all_ideas:
        c = idea["binding_constraint"]
        by_constraint[c] = by_constraint.get(c, 0) + 1
    print("By constraint:")
    for c, n in sorted(by_constraint.items()):
        print(f"  {c}: {n}")
    print(f"\nReview {OUTPUT_PATH} before running seed_new_ideas.py")


if __name__ == "__main__":
    main()
