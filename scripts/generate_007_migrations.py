#!/usr/bin/env python
"""
Generate 007a/b/c/d description migration files for remaining ~100 policy ideas.
Run from project root: python scripts/generate_007_migrations.py
"""

import re
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MIGRATIONS_DIR = os.path.join(ROOT, "data", "migrations")

# ─────────────────────────────────────────────────────────────────────────────
# Step 1: Already-covered IDs (migrations 003 and 006) — skip these
# ─────────────────────────────────────────────────────────────────────────────
COVERED_003 = {21, 23, 24, 25, 32, 35, 36, 38, 39, 42, 43, 45, 49, 50, 51,
               52, 57, 58, 59, 61, 62, 70, 76, 77, 79, 80, 88, 107, 114, 117}
COVERED_006 = {124, 125, 126, 127, 128, 129, 130, 131, 132}
ALREADY_COVERED = COVERED_003 | COVERED_006


# ─────────────────────────────────────────────────────────────────────────────
# Step 2: Extract descriptions from enrichment migration (UPDATE format)
# ─────────────────────────────────────────────────────────────────────────────
def extract_enrichment_descriptions():
    path = os.path.join(ROOT, "data", "supabase_enrichment_migration.sql")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    blocks = content.split("UPDATE policy_ideas SET")
    descs = {}
    for block in blocks[1:]:
        id_match = re.search(r"WHERE id = (\d+)", block)
        if not id_match:
            continue
        iid = int(id_match.group(1))
        if iid in descs:
            continue  # first occurrence wins
        desc_match = re.search(r"description = '((?:[^']|'')*?)'\s*[,\n]", block)
        if desc_match:
            descs[iid] = desc_match.group(1).replace("''", "'")
    return descs


# ─────────────────────────────────────────────────────────────────────────────
# Step 3: Extract descriptions from housing migration (INSERT format)
# ─────────────────────────────────────────────────────────────────────────────
def extract_housing_descriptions(target_ids):
    path = os.path.join(ROOT, "data", "supabase_housing_migration.sql")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    idx = content.find("INSERT INTO policy_ideas")
    section = content[idx:]

    descs = {}
    for tid in target_ids:
        # Match (id, 'title', 'description', ...)
        pattern = rf"\(\s*{tid}\s*,\s*'(?:[^']|'')*?'\s*,\s*'((?:[^']|'')*?)'\s*,"
        m = re.search(pattern, section)
        if m:
            descs[tid] = m.group(1).replace("''", "'")
    return descs


# ─────────────────────────────────────────────────────────────────────────────
# Step 4: New descriptions for IDs with no existing description anywhere
# ─────────────────────────────────────────────────────────────────────────────
NEW_DESCRIPTIONS = {
    92: (
        "South Africa's constitution recognises 11 official languages, yet most public "
        "schools transition to English or Afrikaans as the language of instruction by "
        "Grade 4, despite robust international evidence that children learn to read and "
        "comprehend most effectively in their mother tongue. The DBE's Language in "
        "Education Policy (LiEP, 1997) mandates mother-tongue-based multilingual "
        "education (MTBMLE) in the Foundation Phase but implementation has been "
        "inconsistent, particularly in Nguni and Sotho language groups. Scaling up "
        "MTBMLE requires qualified teachers in all official languages at Foundation "
        "Phase level, graded reader materials in all 11 languages, and provincial "
        "language policy enforcement mechanisms. South Africa's PIRLS 2021 last-place "
        "ranking among 57 countries is directly linked to inadequate mother-tongue "
        "literacy instruction."
    ),
    93: (
        "Approximately 5-7 million South African learners travel more than 5 km to "
        "their nearest school, yet the country lacks a nationally funded, consistently "
        "implemented learner transport programme. The DBE's Learner Transport Policy "
        "(2015) provides a framework but funding is a provincial competence, resulting "
        "in wide inter-provincial variation: some provinces provide subsidies while "
        "others provide none. Irregular or absent transport contributes to absenteeism, "
        "dropout, and gender-based safety risks for girls. The PC on Basic Education's "
        "BRRRs consistently flagged learner transport as a critical equity gap, "
        "particularly in rural Eastern Cape, Limpopo, and KwaZulu-Natal. A national "
        "conditional grant with standardised norms and minimum service standards is the "
        "proposed reform."
    ),
    94: (
        "South Africa's Education White Paper 6 (2001) committed to a full-service "
        "inclusive education system, but implementation has lagged severely. There are "
        "approximately 460 special schools nationally serving children with moderate-"
        "to-severe barriers to learning, but these schools are overcrowded and "
        "under-resourced. The DBE's plan to convert 30% of ordinary schools to "
        "'full-service schools' — equipped to accommodate learners with mild-to-moderate "
        "barriers to learning — has stalled at under 10% national conversion. Key gaps "
        "include shortage of specialised educators, lack of assistive devices and "
        "accessible infrastructure, and inadequate inter-departmental coordination with "
        "the Department of Social Development. Amendments to the South African Schools "
        "Act to mandate reasonable accommodation are under consideration."
    ),
    95: (
        "South Africa has approximately 2,700 micro-schools with fewer than 100 learners "
        "each, predominantly in rural areas with declining populations. These schools "
        "often cannot offer Grades 10-12 subjects, lack functioning laboratories or "
        "libraries, and struggle to attract qualified teachers. The DBE's rationalisation "
        "policy — providing financial incentives and transport subsidies for consolidating "
        "learners into better-resourced nearby schools — has been politically contentious "
        "as communities resist closures. National Treasury's MTEF baseline reviews have "
        "repeatedly identified micro-school rationalisation as a fiscal efficiency "
        "opportunity, and evidence on learning outcomes in micro-schools versus "
        "consolidated institutions has renewed interest in voluntary consolidation "
        "paired with guaranteed learner transport."
    ),
    96: (
        "The Property Management Trading Entity (PMTE) within DPWI manages approximately "
        "83,000 immovable state assets valued at over R100 billion, including offices, "
        "warehouses, police stations, courts, and vacant land, yet operates at a chronic "
        "deficit because large portions of the portfolio are underutilised, poorly "
        "maintained, or yield below-market rentals from user departments. National "
        "Treasury spending reviews have identified the PMTE portfolio as a significant "
        "unrealised fiscal asset. Key reforms under review include disposing of "
        "non-strategic assets, commercialising well-located land parcels for affordable "
        "housing, enforcing accurate user department lease payments, and implementing a "
        "government-wide facilities management system. The AGSA has persistently flagged "
        "irregular expenditure, incomplete asset registers, and audit backlogs in the "
        "PMTE as governance concerns."
    ),
    97: (
        "The Department of Public Works and Infrastructure (DPWI) has received qualified "
        "or adverse audit opinions from the AGSA for multiple consecutive years, "
        "reflecting systemic failures in financial management, procurement, and "
        "consequence management. The department manages over R100 billion in "
        "infrastructure programmes — including EPWP, capital works, and government "
        "leases — yet has struggled to maintain accurate asset registers, resolve "
        "irregular expenditure findings, and take disciplinary action against officials "
        "implicated in procurement irregularities. DPWI's enterprise renewal programme "
        "— covering BAS and LOGIS financial system implementation and supply chain "
        "management overhaul — is under review by SCOPA. Active referrals to the SIU "
        "where criminality is suspected are central to the consequence management "
        "component."
    ),
    98: (
        "The Expanded Public Works Programme (EPWP) has created over 14 million work "
        "opportunities since 2004, primarily in labour-intensive construction, "
        "environmental care, and social sector activities, but has been criticised for "
        "offering short-term, low-wage employment with minimal skills transfer and for "
        "susceptibility to political patronage at municipal level. Reform proposals "
        "include linking EPWP participation to formal artisan training under TVET "
        "college or SETA frameworks, establishing minimum training hours and "
        "certification requirements per project, and shifting the programme toward "
        "infrastructure maintenance where community-based workers can develop durable "
        "skills. The PC on Public Works' BRRRs flag inconsistent reporting and absence "
        "of post-EPWP employment outcome data as persistent governance gaps."
    ),
    100: (
        "South Africa's public infrastructure — schools, hospitals, courts, police "
        "stations, and government offices — suffers chronic underfunding of maintenance "
        "estimated by DPWI at R1 billion annually in deferred costs. When capital "
        "budgets are under pressure, departments routinely cut maintenance first, "
        "accelerating deterioration of state assets. National Treasury and DPWI are "
        "developing a Maintenance Delivery Improvement Programme that would ring-fence "
        "a minimum maintenance allocation (proposed at 1-1.5% of asset replacement "
        "value per year) in departmental budgets, enforce it through conditional grant "
        "conditions, and track compliance through infrastructure condition indices. The "
        "Government Immovable Asset Management Act (GIAMA) provides the statutory basis "
        "for asset condition reporting but enforcement has been weak."
    ),
    101: (
        "National Treasury's PPP Unit administers South Africa's public-private "
        "partnership framework under Treasury Regulation 16, which requires extensive "
        "feasibility studies, value-for-money assessments, and multi-stage National "
        "Treasury approval. While this oversight protects public finances, the process "
        "has been criticised as too slow and costly — particularly for smaller social "
        "infrastructure PPPs covering schools, health centres, and correctional "
        "facilities — with fewer than 40 PPP agreements reaching financial close since "
        "2000. DPWI and National Treasury are reviewing streamlined approval pathways "
        "for social infrastructure PPPs below a defined threshold, an off-balance-sheet "
        "framework for municipal-level PPPs, and better alignment with the "
        "Infrastructure Fund's blended finance model established in 2020."
    ),
    102: (
        "The South African government owns or leases approximately 83,000 properties "
        "through the PMTE, representing one of the country's largest institutional "
        "electricity consumers, with energy costs estimated at R4-6 billion annually. "
        "Mandatory green building standards for new government construction and major "
        "refurbishments — aligned with the Green Star SA rating system administered by "
        "the Green Building Council of South Africa (GBCSA) — would reduce state energy "
        "costs, signal market leadership, and deliver co-benefits in water efficiency "
        "and occupant health. DPWI's Green Building Framework (2022) sets aspirational "
        "targets but lacks binding standards or enforcement mechanisms. A Ministerial "
        "Determination under the Government Immovable Asset Management Act (GIAMA) "
        "could make Green Star compliance mandatory for all new government buildings "
        "above a defined cost threshold."
    ),
    103: (
        "DPWI and other national departments own significant well-located urban land "
        "— including former military bases, unused state hospitals, and surplus "
        "government offices — that is not being used productively. Releasing these "
        "parcels for affordable housing, mixed-use development, or social infrastructure "
        "could dramatically reduce the cost of urban land for low-income housing "
        "programmes without requiring expropriation. Operation Vulindlela identified "
        "public land release as a Phase I priority but progress has been slow due to "
        "inter-departmental coordination failures, disputes over land valuations, and "
        "competing departmental claims. A centralised Land Release Coordinating "
        "Committee with National Treasury, DPWI, DHS, and DTIC representation, backed "
        "by a Cabinet directive with implementation deadlines, is the proposed "
        "governance mechanism."
    ),
    110: (
        "South Africa's tobacco control framework has not been substantively updated "
        "since the Tobacco Products Control Act (1993), despite the global proliferation "
        "of electronic nicotine delivery systems (ENDS), heated tobacco products, and "
        "waterpipes. The Tobacco Products and Electronic Delivery Systems Control Bill "
        "— providing for plain packaging, comprehensive advertising bans, and regulation "
        "of ENDS products — was tabled in 2018 and approved by Cabinet in 2022 but has "
        "been delayed by industry lobbying, jurisdictional disputes between the "
        "Departments of Health and Trade, Industry and Competition, and concerns about "
        "tax revenue implications. South Africa is a signatory to the WHO Framework "
        "Convention on Tobacco Control (FCTC), creating an international obligation to "
        "enact these measures. The PC on Health's BRRRs consistently flagged the Bill's "
        "stalled progress as a public health governance failure."
    ),
    119: (
        "The Small Enterprise Development Agency (SEDA) operates a network of over 50 "
        "enterprise development centres providing business advisory, training, and "
        "incubation services across South Africa, but a 2024 DSBD performance review "
        "found that services are perceived as generic, insufficiently linked to market "
        "demand, and inaccessible in deep rural areas and townships. Reform proposals "
        "include transitioning from generic advisory to sector-specialist hubs covering "
        "agri-processing, ICT, tourism, and the creative economy; deploying digital "
        "service delivery for basic advisory functions to extend geographic reach; and "
        "establishing outcome-based performance contracts for SEDA tied to measurable "
        "enterprise growth and job creation metrics. The PC on Small Business "
        "Development's BRRRs repeatedly flagged SEDA's high administration spend "
        "(over 40% of budget) versus actual enterprise impact."
    ),
    120: (
        "South Africa's cooperative development programme, administered by the DSBD "
        "through the Cooperatives Incentive Scheme (CIS) and SEDA incubation, has "
        "disbursed hundreds of millions in grants since the Cooperatives Act (2005) yet "
        "produced few sustainable, scaled cooperative enterprises — a DSBD evaluation "
        "found an 80-90% failure rate within five years. The proposed outcome-based "
        "redesign replaces upfront capital grants with patient development capital "
        "linked to revenue milestones, restricts support to cooperatives in sectors "
        "with demonstrated market demand (particularly construction, waste, and "
        "community services), and mandates technical skills development alongside "
        "financial support. The IDC's cooperative financing window provides a model "
        "for scaling to smaller entities under DSBD's remit."
    ),
    121: (
        "South Africa's informal economy employs an estimated 2.8-3.2 million workers "
        "predominantly in retail, food vending, and household services, but operates "
        "largely outside the formal regulatory and tax system. SARS's Turnover Tax "
        "regime for businesses below R1 million annual turnover has seen slow uptake "
        "due to administrative complexity, while municipal trading infrastructure — "
        "market stalls, ablution facilities, electricity connections — is chronically "
        "inadequate in most townships and CBDs. The DSBD's Informal Economy Policy "
        "Framework (2019) and Operation Vulindlela's work on the spatial economy "
        "identify informal economy formalisation as an untapped labour market and fiscal "
        "resource. This reform combines SARS simplification with COGTA/SALGA-driven "
        "municipal infrastructure investment to lower the cost of formalisation."
    ),
    123: (
        "South Africa's Just Energy Transition (JET) Investment Plan commits R1.5 "
        "trillion over 20 years to transition away from coal, creating significant "
        "commercial opportunities in renewable energy installation, energy efficiency "
        "retrofitting, battery storage, and green manufacturing. Most of these "
        "opportunities require upfront capital that small and medium enterprises cannot "
        "easily access through commercial banks, which apply standard credit criteria "
        "penalising early-stage energy companies. The DSBD, in coordination with the "
        "Small Enterprise Finance Agency (SEFA), is developing a dedicated JET-SMME "
        "Finance Facility providing blended first-loss instruments, technical assistance "
        "grants, and revenue-based financing. The facility would complement the "
        "International Partners Group's $8.5 billion JET-IP commitments, which are "
        "directed primarily at large infrastructure."
    ),
}


# ─────────────────────────────────────────────────────────────────────────────
# Step 5: Build combined description map and determine 007 IDs
# ─────────────────────────────────────────────────────────────────────────────
def build_all_descriptions():
    enrichment = extract_enrichment_descriptions()
    housing = extract_housing_descriptions(range(133, 140))

    all_descs = {}
    all_descs.update(enrichment)
    all_descs.update(housing)
    all_descs.update(NEW_DESCRIPTIONS)
    return all_descs


def get_007_ids(all_descs):
    """Return sorted list of IDs that need 007 migration (not already covered)."""
    return sorted(iid for iid in all_descs if iid not in ALREADY_COVERED)


# ─────────────────────────────────────────────────────────────────────────────
# Step 6: Generate SQL migration files
# ─────────────────────────────────────────────────────────────────────────────
def sql_escape(s):
    """Escape single quotes for SQL."""
    return s.replace("'", "''")


def make_batch_sql(batch_ids, all_descs, batch_label, total_ids):
    lines = []
    lines.append(f"-- ============================================================")
    lines.append(f"-- Migration 007{batch_label}: Remaining policy idea descriptions")
    lines.append(f"-- Batch {batch_label.upper()}: {len(batch_ids)} ideas (IDs {batch_ids[0]}-{batch_ids[-1]})")
    lines.append(f"-- Part of a {len(total_ids)}-idea update covering all ideas without")
    lines.append(f"-- formal migration descriptions (all except 003/006 coverage)")
    lines.append(f"-- Generated: 2026-03-24")
    lines.append(f"-- ============================================================")
    lines.append("")
    lines.append("BEGIN;")
    lines.append("")
    for iid in batch_ids:
        desc = sql_escape(all_descs[iid])
        lines.append(f"-- id={iid}")
        lines.append(f"UPDATE policy_ideas SET")
        lines.append(f"  description = '{desc}',")
        lines.append(f"  updated_at = NOW()")
        lines.append(f"WHERE id = {iid};")
        lines.append("")
    lines.append("COMMIT;")
    return "\n".join(lines)


def main():
    all_descs = build_all_descriptions()
    ids_007 = get_007_ids(all_descs)

    print(f"Total descriptions available: {len(all_descs)}")
    print(f"Already covered by 003/006: {len(ALREADY_COVERED)}")
    print(f"IDs for 007 migration: {len(ids_007)}")
    print(f"IDs: {ids_007}")

    # Split into batches of ~25 (yielding 4 files for ~100 IDs)
    batch_size = 25
    batches = []
    for i in range(0, len(ids_007), batch_size):
        batches.append(ids_007[i:i + batch_size])

    labels = ["a", "b", "c", "d", "e"]
    files_written = []

    os.makedirs(MIGRATIONS_DIR, exist_ok=True)

    for label, batch in zip(labels, batches):
        filename = f"007{label}_descriptions_batch{labels.index(label)+1}.sql"
        filepath = os.path.join(MIGRATIONS_DIR, filename)
        sql = make_batch_sql(batch, all_descs, label, ids_007)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(sql)
        files_written.append((filepath, len(batch)))
        print(f"  Written: {filename} ({len(batch)} IDs, "
              f"IDs {batch[0]}-{batch[-1]})")

    # Combined file
    combined_path = os.path.join(ROOT, "data", "supabase_remaining_descriptions.sql")
    combined_lines = [
        "-- ============================================================",
        "-- Combined reference: all remaining policy idea descriptions",
        "-- Mirrors 007a-007d migrations; apply those in sequence instead",
        "-- Generated: 2026-03-24",
        "-- ============================================================",
        "",
        "BEGIN;",
        "",
    ]
    for iid in ids_007:
        desc = sql_escape(all_descs[iid])
        combined_lines.append(f"-- id={iid}")
        combined_lines.append(f"UPDATE policy_ideas SET")
        combined_lines.append(f"  description = '{desc}',")
        combined_lines.append(f"  updated_at = NOW()")
        combined_lines.append(f"WHERE id = {iid};")
        combined_lines.append("")
    combined_lines.append("COMMIT;")

    with open(combined_path, "w", encoding="utf-8") as f:
        f.write("\n".join(combined_lines))
    print(f"  Written: supabase_remaining_descriptions.sql ({len(ids_007)} IDs total)")

    # Summary
    print(f"\nDone. Files written to {MIGRATIONS_DIR}:")
    for fp, n in files_written:
        print(f"  {os.path.basename(fp)}: {n} ideas")
    print(f"  supabase_remaining_descriptions.sql: {len(ids_007)} ideas")


if __name__ == "__main__":
    main()
