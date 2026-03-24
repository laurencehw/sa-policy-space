"""
Extract and insert Housing / Human Settlements policy ideas into the local SQLite database.

Based on analysis of 720 meetings from:
  - Committee 291: Human Settlements (National Assembly, 2024–present)
  - Committee 91:  Human Settlements, Water and Sanitation (National Assembly, 2009–2024)

Run from project root:
    python scripts/extract_housing_ideas.py

Appends new ideas (IDs 125–139) to the policy_ideas table.
"""

import os
import re
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "policy_ideas.db")

# ── Helpers ──────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text).strip("-")
    return text


# ── Policy ideas synthesised from PMG meeting record ─────────────────────────
#
# Each idea was derived from recurring themes across the 720 committee meetings.
# Primary source meetings are noted in the key_quote / source_committee fields.
#
# Field mapping:
#   current_status: proposed | debated | drafted | stalled |
#                   implemented | abandoned | partially_implemented | under_review
#   feasibility_rating: 1 (low) – 5 (high)
#   growth_impact_rating: 1 (low) – 5 (high)
#   time_horizon: quick_win | medium_term | long_term
#   reform_package: 1–5 (see data/reform_packages.json)

NEW_IDEAS = [
    {
        "id": 125,
        "title": "Title Deed Backlog Resolution — National Vesting Programme",
        "description": (
            "An estimated 1–2 million subsidised housing beneficiaries have not received "
            "title deeds for properties they occupy, stripping them of tradeable collateral and "
            "formal property rights. The DHS Title Restoration Project (launched 2023) aims to "
            "clear the backlog through a digitised deeds registration process, improved "
            "surveyor-general throughput, and accrediting municipalities to issue deeds directly. "
            "Key barriers include incomplete township registrations, surveying backlogs, and "
            "inter-departmental data mismatches between DHS and the Deeds Registry. "
            "Parliamentary oversight has repeatedly flagged underspending on the programme, "
            "with multiple committees calling for consequence management against officials "
            "responsible for delays."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "government_capacity",
        "first_raised_date": "2009-03-01",
        "times_raised": 28,
        "current_status": "stalled",
        "feasibility_rating": 3,
        "feasibility_note": (
            "Technically tractable — digitisation and surveyor-general pipeline improvements are "
            "underway — but constrained by weak municipal capacity, incomplete township "
            "proclamations, and lack of inter-departmental IT integration. "
            "Political will exists at ministerial level but execution is chronically lagging."
        ),
        "growth_impact_rating": 3,
        "responsible_department": "Department of Human Settlements / Deeds Registry",
        "key_quote": (
            "\"Discussions focused on the challenges municipalities face in issuing title deeds, "
            "delays in project completion, and the need for uniform policies to improve efficiency.\" "
            "— Portfolio Committee on Human Settlements, June 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 3,
        "time_horizon": "medium_term",
    },
    {
        "id": 126,
        "title": "Social Housing Blocked Projects Rescue Fund",
        "description": (
            "The Social Housing Regulatory Authority (SHRA) reports that at least 10 social "
            "housing projects — all approved before 2020 — are currently blocked or stalled, "
            "primarily because COVID-19 cost escalations rendered them financially unviable "
            "under original business plans. Many involve contractor liquidations and incomplete "
            "structures deteriorating in urban areas. A dedicated rescue fund, modelled on the "
            "SHRA restructuring mechanism, would provide top-up financing, enable contractor "
            "replacement, and impose accountability conditions on social housing institutions "
            "(SHIs). This is distinct from the NHFC's broader financing role; it targets the "
            "specific class of stranded projects that have passed feasibility assessment but "
            "cannot proceed under current cost structures."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "financial_access",
        "first_raised_date": "2021-04-29",
        "times_raised": 14,
        "current_status": "stalled",
        "feasibility_rating": 3,
        "feasibility_note": (
            "SHRA already has a restructuring mechanism but it is underfunded and slow. "
            "A dedicated ring-fenced rescue vehicle with Treasury backing is feasible within "
            "existing institutional architecture. The challenge is fiscal space and convincing "
            "National Treasury that the expected social return justifies the capital injection."
        ),
        "growth_impact_rating": 3,
        "responsible_department": "Department of Human Settlements / SHRA",
        "key_quote": (
            "\"SHRA reported that all ten projects had been approved before the COVID-19 pandemic, "
            "and were now financially non-viable due to severe cost escalations, contractor "
            "liquidation, community objections, and municipal service challenges.\" "
            "— Portfolio Committee on Human Settlements, November 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 3,
        "time_horizon": "quick_win",
    },
    {
        "id": 127,
        "title": "Upgrading of Informal Settlements Programme (UISP) Scale-Up",
        "description": (
            "South Africa has approximately 2,700 informal settlements housing an estimated "
            "4 million households. The Upgrading of Informal Settlements Programme (UISP) "
            "provides incremental in-situ upgrading rather than forced relocation, offering "
            "secure tenure, basic services and community facilities. Despite strong policy "
            "support, the programme is significantly under-resourced relative to need. "
            "Parliamentary oversight visits to KwaZulu-Natal, North West, and metros consistently "
            "find slow project delivery, absent services months after relocation, and poorly "
            "coordinated intergovernmental financing. Scaling UISP to cover the identified "
            "backlog would require tripling current allocations, reforming the conditional grant "
            "structure, and giving metros greater programmatic autonomy."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "government_capacity",
        "first_raised_date": "2009-06-01",
        "times_raised": 35,
        "current_status": "under_review",
        "feasibility_rating": 3,
        "feasibility_note": (
            "Programme design is sound and internationally recognised. Constraints are "
            "fiscal (insufficient grant allocations), institutional (metro capacity, "
            "surveyor-general bottlenecks), and political (local resistance to in-situ "
            "upgrading near well-located land). Scaling is feasible if paired with conditional "
            "grant reform and metro accountability frameworks."
        ),
        "growth_impact_rating": 4,
        "responsible_department": "Department of Human Settlements",
        "key_quote": (
            "\"The presentations highlighted progress in informal settlement upgrading, housing "
            "projects such as Banana City; [but] Members expressed frustration about the lack "
            "of cooperation from municipalities and the pace of delivery.\" "
            "— Portfolio Committee on Human Settlements, March 2026"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 3,
        "time_horizon": "medium_term",
    },
    {
        "id": 128,
        "title": "First Home Finance Programme — Gap Market Subsidy Expansion",
        "description": (
            "The Finance Linked Individual Subsidy Programme (FLISP), rebranded as First Home "
            "Finance in 2024, provides a sliding-scale subsidy to households earning R3,501–"
            "R22,000 per month who do not qualify for RDP housing but cannot service a standard "
            "mortgage. Despite strong demand, the programme has been chronically underfunded, "
            "poorly marketed, and administratively complex. The NHFC-administered programme also "
            "faces allegations of internal governance failures. Expanding the programme to cover "
            "the estimated 4 million gap-market households requires: increased capitalisation of "
            "NHFC, simplified application processes through digital platforms, employer payroll "
            "deduction integration, and clearer eligibility documentation. A broader credit "
            "guarantee scheme for gap-market mortgages (backed by NHFC or a DFI) would complement "
            "the direct subsidy."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "financial_access",
        "first_raised_date": "2013-09-01",
        "times_raised": 18,
        "current_status": "under_review",
        "feasibility_rating": 3,
        "feasibility_note": (
            "Policy instrument is well-established with a functioning institutional home (NHFC). "
            "Constraints are fiscal (insufficient capitalisation) and administrative (cumbersome "
            "process). Digital simplification and employer integration are achievable with "
            "moderate investment. The programme is politically popular but delivery lags demand."
        ),
        "growth_impact_rating": 3,
        "responsible_department": "NHFC / Department of Human Settlements",
        "key_quote": (
            "\"The First Home Finance Programme aims to assist low- to middle-income households who "
            "do not qualify for RDP housing but struggle to secure commercial mortgages. The "
            "programme offers a sliding-scale subsidy based on income, with eligibility ranging "
            "from R3 501 to R22 000 per month.\" — Portfolio Committee on Human Settlements, June 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 2,
        "time_horizon": "quick_win",
    },
    {
        "id": 129,
        "title": "PIE Act Reform — Balancing Unlawful Occupation with Urban Order",
        "description": (
            "The Prevention of Illegal Eviction from and Unlawful Occupation of Land Act (PIE, "
            "1998) has become a source of significant tension between constitutionally-mandated "
            "housing rights and effective urban land management. Court processes can take years, "
            "encouraging organised land invasion — particularly in well-located urban areas. "
            "A 2025 Private Member's Bill proposed amendments to expedite evictions in cases of "
            "criminal organisation of invasions. The Department resisted, citing constitutional "
            "concerns. Parliamentary consensus appears to favour: (i) distinguishing individual "
            "occupiers from organised invasion syndicates, (ii) faster court processes for new "
            "invasions, (iii) strengthened anti-criminalisation protections for genuine "
            "vulnerability. The committee noted that metros spend hundreds of millions annually "
            "on blocked land intended for formal development."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "regulatory_burden",
        "first_raised_date": "2008-08-05",
        "times_raised": 22,
        "current_status": "debated",
        "feasibility_rating": 2,
        "feasibility_note": (
            "Constitutionally constrained — any amendment must survive section 26 housing rights "
            "scrutiny. Political feasibility is low given ANC sensitivity to eviction narratives. "
            "The EFF consistently frames reform as anti-poor. A narrowly targeted amendment "
            "targeting criminal syndicates (not vulnerable individuals) would be more defensible "
            "but requires careful drafting and a willing Minister."
        ),
        "growth_impact_rating": 3,
        "responsible_department": "Department of Human Settlements / Dept of Justice",
        "key_quote": (
            "\"The Committee noted that metros spend hundreds of millions annually on blocked land "
            "intended for formal development, and that all metros were struggling with land invasions "
            "in one form or another.\" — Portfolio Committee on Human Settlements, April 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 3,
        "time_horizon": "medium_term",
    },
    {
        "id": 130,
        "title": "Municipal Accreditation for Housing Programme Administration",
        "description": (
            "Currently, national DHS and provincial departments administer housing subsidy "
            "programmes, with municipalities as implementing agents but lacking full accreditation "
            "to independently manage housing funds. Accreditation — already provided for in the "
            "Housing Act — would allow well-performing metros to directly access and administer "
            "national housing grants, cutting the provincial intermediary layer that introduces "
            "delays and misalignment. The DHS has run a fitful accreditation process since 2004 "
            "but implementation has been inconsistent. The 2025 Housing Consumer Protection Act "
            "regulations and the forthcoming National Human Settlements Bill both create "
            "opportunities to formalise a tiered accreditation system with clear performance "
            "criteria and accountability conditions."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "government_capacity",
        "first_raised_date": "2014-01-01",
        "times_raised": 16,
        "current_status": "stalled",
        "feasibility_rating": 3,
        "feasibility_note": (
            "Legally enabled and policy-supported, but practically stalled due to provincial "
            "resistance (provinces fear losing grant pass-through funding), weak metro capacity "
            "in most cases, and the national department's reluctance to devolve control. "
            "Cape Town and eThekwini are most capable of absorbing full accreditation; "
            "most smaller municipalities are not."
        ),
        "growth_impact_rating": 3,
        "responsible_department": "Department of Human Settlements",
        "key_quote": (
            "\"Discussions focused on the challenges municipalities face in issuing title deeds, "
            "delays in project completion, and the need for uniform policies to improve efficiency. "
            "Members raised concerns on the pace of service delivery and accreditation processes.\" "
            "— Portfolio Committee on Human Settlements, June 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 3,
        "time_horizon": "medium_term",
    },
    {
        "id": 131,
        "title": "Building Inspectorate Reform Post-George Collapse",
        "description": (
            "The collapse of a five-storey building under construction in George, Western Cape "
            "on 6 May 2024 — killing 34 workers — exposed systemic failures in the building "
            "regulation regime. A DHS investigation (250 pages, released March 2025) found "
            "failed compliance inspections, absent employer safety systems, and a regulatory "
            "framework split across the NHBRC (residential), local government (municipal "
            "approval), and the Department of Employment and Labour (occupational health). "
            "Reform proposals discussed in committee include: (i) mandatory NHBRC enrolment "
            "for commercial structures, (ii) independent third-party inspectors on high-risk "
            "buildings, (iii) lifestyle audits and fit-and-proper tests for NHBRC inspectors, "
            "and (iv) a unified national building inspectorate coordinating across the three "
            "current regulatory bodies."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "regulatory_burden",
        "first_raised_date": "2024-05-06",
        "times_raised": 8,
        "current_status": "under_review",
        "feasibility_rating": 3,
        "feasibility_note": (
            "High political salience following the George tragedy creates a reform window. "
            "NHBRC and CIDB have both appeared before committee and signalled willingness to "
            "adapt. The main risk is reform being diluted through inter-departmental "
            "jurisdictional disputes between DHS, Employment and Labour, and local government. "
            "Unified inspectorate would require legislative amendment."
        ),
        "growth_impact_rating": 2,
        "responsible_department": "NHBRC / CIDB / Department of Employment and Labour",
        "key_quote": (
            "\"The report revealed significant systemic failures in regulatory oversight, "
            "compliance inspections, and accountability mechanisms across three separate "
            "regulatory bodies.\" — Portfolio Committee on Human Settlements, April 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": None,
        "time_horizon": "quick_win",
    },
    {
        "id": 132,
        "title": "Abandoned and Hijacked Buildings Recovery Programme",
        "description": (
            "Thousands of buildings in South African city centres — particularly in "
            "Johannesburg's CBD and inner Durban — have been abandoned by owners or seized "
            "by criminal hijacking syndicates, housing an estimated 700,000 people in unsafe "
            "and squalid conditions. The Housing Development Agency (HDA) was tasked in 2024 "
            "with acquiring, rehabilitating and repurposing these structures for affordable "
            "rental housing. Committee briefings in February 2026 revealed early progress but "
            "highlighted barriers: complex legal processes to expropriate hijacked buildings, "
            "incomplete interdepartmental coordination with Safety, Justice and Local Government, "
            "and insufficient HDA funding to acquire properties at market value. A clearer "
            "legislative framework — including a dedicated expropriation pathway for hijacked "
            "properties — is needed to scale the programme."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "government_capacity",
        "first_raised_date": "2020-06-01",
        "times_raised": 12,
        "current_status": "under_review",
        "feasibility_rating": 2,
        "feasibility_note": (
            "Operationally complex — hijacked building expropriation sits at the intersection "
            "of property rights, criminal law, and urban planning. HDA has limited balance sheet "
            "to acquire at scale. Political and legal contestation around expropriation is "
            "high. Long-term pilot in Johannesburg CBD provides some operational learning but "
            "citywide and national scaling faces significant obstacles."
        ),
        "growth_impact_rating": 3,
        "responsible_department": "Housing Development Agency / Department of Human Settlements",
        "key_quote": (
            "\"The Portfolio Committee received a briefing on acquired, abandoned and hijacked "
            "buildings — highlighting barriers including complex legal processes to expropriate "
            "hijacked properties and insufficient HDA funding.\" "
            "— Portfolio Committee on Human Settlements, February 2026"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 3,
        "time_horizon": "long_term",
    },
    {
        "id": 133,
        "title": "Emergency Housing Response Fund — Centralisation and Disaster Readiness",
        "description": (
            "South Africa's climate vulnerability — floods affecting Eastern Cape, KwaZulu-Natal "
            "and North West annually — exposes a broken emergency housing response system. "
            "The Emergency Housing Response Fund (EHRF) is administered at provincial level, "
            "with chronic underspending (provinces fail to access it) and allegations of "
            "political discrimination in allocations. Temporary Residential Units (TRUs) provided "
            "after disasters have become de facto permanent structures of poor quality. "
            "The DHS proposed centralising the EHRF in 2025, arguing that national administration "
            "would improve speed of response, quality control, and accountability. Parliamentary "
            "committee endorsed the principle while calling for stronger pre-positioning, "
            "provincial readiness protocols, and a cap on TRU duration with guaranteed "
            "transition to permanent housing."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "government_capacity",
        "first_raised_date": "2019-04-01",
        "times_raised": 11,
        "current_status": "under_review",
        "feasibility_rating": 3,
        "feasibility_note": (
            "Centralisation is technically straightforward and has DHS and committee support. "
            "The political challenge is provincial buy-in, as premiers resist losing control "
            "of a fund that can be used for politically visible disaster interventions. "
            "Transition to permanent housing after TRU phase requires a separate funded programme."
        ),
        "growth_impact_rating": 2,
        "responsible_department": "Department of Human Settlements",
        "key_quote": (
            "\"The NDHS explained the centralisation of the Emergency Housing Response Fund to "
            "address underspending and political discrimination by provinces. There are significant "
            "challenges with temporary residential units including quality control, beneficiary "
            "verification, and prolonged stays.\" — Portfolio Committee on Human Settlements, October 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": None,
        "time_horizon": "quick_win",
    },
    {
        "id": 134,
        "title": "Community Residential Units Programme Expansion for Urban Rental",
        "description": (
            "Community Residential Units (CRUs) are state-owned affordable rental housing "
            "for low-income households earning R0–R3,500 per month — the segment below the "
            "FLISP/First Home Finance threshold. Many CRU buildings transferred from councils "
            "to the state are in disrepair and undermanaged. The DHS has advocated expanding "
            "CRU supply through new construction and rehabilitation of existing stock in "
            "well-located urban areas, pairing supply with professional property management. "
            "Social housing institutions (SHIs) are well-placed to manage CRUs under a "
            "performance contract model. Committee discussions highlighted the need to avoid "
            "creating new informal settlements near CRU projects and the importance of "
            "proximity to economic opportunity in site selection."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "financial_access",
        "first_raised_date": "2012-01-01",
        "times_raised": 9,
        "current_status": "proposed",
        "feasibility_rating": 3,
        "feasibility_note": (
            "Strong policy rationale and existing institutional framework through SHIs. "
            "Key barriers are land cost in well-located areas, management capacity of SHIs, "
            "and the risk of creating hidden operating subsidies that crowd out other "
            "housing programmes. Needs dedicated grant funding separate from UISP and social "
            "housing allocations."
        ),
        "growth_impact_rating": 3,
        "responsible_department": "Department of Human Settlements / SHRA",
        "key_quote": (
            "\"The Committee underscored that CRU and social housing units must be located in "
            "areas with economic opportunity, not peripheral areas that reproduce poverty.\" "
            "— Portfolio Committee on Human Settlements, Water and Sanitation, 2020"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 3,
        "time_horizon": "medium_term",
    },
    {
        "id": 135,
        "title": "Housing Consumer Protection Act — Full Regulatory Rollout",
        "description": (
            "The Housing Consumer Protection Act (HCPA), enacted in 2024 to replace the "
            "Housing Consumers Protection Measures Act of 1998, creates a strengthened "
            "regulatory framework for the home building industry. Key provisions include "
            "mandatory enrolment of new homes with NHBRC, a new home warranty scheme, "
            "improved redress for defective construction, and enhanced consumer disclosure "
            "requirements. As of June 2025, the DHS was still finalising the implementing "
            "regulations. Full rollout requires aligning NHBRC's inspection capacity, "
            "integrating the CIDB contractor grading register, and training municipalities "
            "on new approval conditions. The sector welcomes clearer rules but there are "
            "concerns about compliance cost for smaller affordable housing contractors."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "regulatory_burden",
        "first_raised_date": "2021-06-01",
        "times_raised": 10,
        "current_status": "drafted",
        "feasibility_rating": 4,
        "feasibility_note": (
            "Act already passed — implementation is the challenge. NHBRC has the institutional "
            "mandate and can absorb additional enrolment fees. Main risk is regulation-light "
            "implementation that preserves old problems under a new name, and compliance "
            "burden driving small builders out of the affordable market."
        ),
        "growth_impact_rating": 2,
        "responsible_department": "NHBRC / Department of Human Settlements",
        "key_quote": (
            "\"The Department provided progress reports on the Human Settlements Draft Bill and "
            "the regulations under the Housing Consumer Protection Act. Members raised concerns "
            "on the pace of service delivery and accreditation processes.\" "
            "— Portfolio Committee on Human Settlements, June 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": None,
        "time_horizon": "quick_win",
    },
    {
        "id": 136,
        "title": "National Human Settlements Bill — Legislative Consolidation",
        "description": (
            "South Africa's housing legislative framework is fragmented across at least "
            "nine statutes, including the Housing Act (1997), Social Housing Act (2008), "
            "National Housing Code, and various sector-specific measures. The Department "
            "has been developing a comprehensive National Human Settlements Bill since 2023 "
            "that would consolidate this framework, update definitions, align with the "
            "Constitution's section 26 obligations, and provide a unified subsidy "
            "architecture. The bill addresses subsidy portability, mixed-income development "
            "standards, and the legal status of different housing typologies. Parliamentary "
            "committee engagement has been cautious, with members concerned that consolidation "
            "does not dilute rights-based protections or reduce departmental accountability."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "regulatory_burden",
        "first_raised_date": "2023-06-01",
        "times_raised": 7,
        "current_status": "debated",
        "feasibility_rating": 3,
        "feasibility_note": (
            "Technically desirable but politically complex — any legislative consolidation "
            "risks re-opening settled interpretations and creating new lobbying opportunities "
            "for vested interests. The Department has shown willingness but parliamentary "
            "timelines are tight. Constitutional court exposure on housing rights means "
            "legal risk is real if consolidation weakens protections."
        ),
        "growth_impact_rating": 2,
        "responsible_department": "Department of Human Settlements",
        "key_quote": (
            "\"The Department provided progress reports on the Human Settlements Draft Bill, "
            "which aims to consolidate the fragmented housing legislative framework into a "
            "single coherent instrument.\" — Portfolio Committee on Human Settlements, June 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": None,
        "time_horizon": "long_term",
    },
    {
        "id": 137,
        "title": "Property Practitioners Regulatory Authority — Professionalisation of Real Estate",
        "description": (
            "The Property Practitioners Regulatory Authority (PPRA) replaced the Estate Agency "
            "Affairs Board (EAAB) following the Property Practitioners Act (2019). Its mandate "
            "covers licensing, education, consumer protection, and transformation in the "
            "property sector. Committee oversight has repeatedly flagged PPRA governance "
            "failures, delayed fidelity fund certificate issuance (paralyzing property "
            "transactions), and the backlog in processing transformation and ownership "
            "requirements under the Act. Reform priorities include: (i) digitising the "
            "fidelity fund certificate process, (ii) implementing the mandatory BEE compliance "
            "provisions, (iii) improving PPRA governance and audit outcomes, and (iv) "
            "expanding the PPRA's consumer redress capacity for property transaction disputes."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "regulatory_burden",
        "first_raised_date": "2021-02-01",
        "times_raised": 14,
        "current_status": "under_review",
        "feasibility_rating": 3,
        "feasibility_note": (
            "PPRA has a clear mandate and improving governance under new leadership (as of 2025). "
            "Digital transformation of fidelity fund certificates is overdue but technically "
            "straightforward. Transformation requirements under the Property Practitioners Act "
            "are contested by incumbent agencies and will face legal challenges."
        ),
        "growth_impact_rating": 2,
        "responsible_department": "PPRA / Department of Human Settlements",
        "key_quote": (
            "\"The Portfolio Committee received briefings from the PPRA on implementing Auditor-"
            "General recommendations. Members were concerned about delayed fidelity fund "
            "certificates, paralysing property transactions.\" "
            "— Portfolio Committee on Human Settlements, March 2023"
        ),
        "source_committee": "Human Settlements",
        "reform_package": None,
        "time_horizon": "quick_win",
    },
    {
        "id": 138,
        "title": "Housing Development Agency Reform — Tackling Procurement Corruption",
        "description": (
            "The Housing Development Agency (HDA) is South Africa's primary state vehicle for "
            "identifying, acquiring, holding, and releasing land and buildings for human "
            "settlements development. A May 2025 Presidential Proclamation mandated the SIU "
            "to investigate HDA following allegations of inflating land prices in multiple "
            "provinces, corrupt contractor appointment, and misappropriation of public funds. "
            "The Committee has called for consequence management, governance reforms, and "
            "a review of the HDA's mandate to focus on strategic land assembly rather than "
            "project implementation. HDA's CEO was suspended in 2026. Resolving governance "
            "dysfunction at HDA is a prerequisite for its expanded role in the abandoned "
            "buildings programme and broader urban land assembly."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "corruption_governance",
        "first_raised_date": "2021-03-11",
        "times_raised": 16,
        "current_status": "stalled",
        "feasibility_rating": 2,
        "feasibility_note": (
            "SIU investigation is active and will produce findings, but consequence management "
            "in public entities has a poor track record. Board and executive leadership "
            "instability has been ongoing since 2019. Structural reform of HDA's mandate "
            "(away from implementation and toward strategic land assembly) would improve "
            "accountability but requires legislative amendment."
        ),
        "growth_impact_rating": 3,
        "responsible_department": "Housing Development Agency / Department of Human Settlements",
        "key_quote": (
            "\"The investigation looks into serious allegations of inflating prices on land for "
            "housing projects in several provinces. Mandated by a May 2025 Presidential "
            "Proclamation, it focuses on serious corruption, maladministration, and malfeasance.\" "
            "— Portfolio Committee on Human Settlements, November 2025"
        ),
        "source_committee": "Human Settlements",
        "reform_package": None,
        "time_horizon": "medium_term",
    },
    {
        "id": 139,
        "title": "Integrated Residential Development Programme (IRDP) Shift to Mixed-Income",
        "description": (
            "The Integrated Residential Development Programme (IRDP) was designed to create "
            "mixed-income neighbourhoods combining fully subsidised, partially subsidised, "
            "and market-rate housing — moving beyond the monolithic RDP township model. "
            "In practice, IRDP projects have largely defaulted to fully subsidised delivery "
            "due to weak demand for market-rate plots in peripheral locations and developers' "
            "preference for greenfield private projects. Committee oversight shows persistent "
            "delivery delays, contractor non-performance, and beneficiary list fraud. "
            "Reform proposals focus on: (i) requiring IRDP sites to include minimum 30% "
            "market-rate units, (ii) improving location decisions to near economic nodes, "
            "(iii) linking land release decisions to transport corridors, and (iv) integrating "
            "IRDP with the UISP in peri-urban areas where informal settlements adjoin "
            "serviced land."
        ),
        "theme": "land_and_housing",
        "binding_constraint": "government_capacity",
        "first_raised_date": "2010-01-01",
        "times_raised": 20,
        "current_status": "partially_implemented",
        "feasibility_rating": 3,
        "feasibility_note": (
            "IRDP mixed-income design has policy support in the National Development Plan "
            "and Integrated Urban Development Framework, but implementation defaults to "
            "fully subsidised delivery because developers won't cross-subsidise in poorly "
            "located sites. Genuine mixed-income outcomes require location reform (releasing "
            "well-located public land, idea 103) and transport infrastructure investment."
        ),
        "growth_impact_rating": 4,
        "responsible_department": "Department of Human Settlements",
        "key_quote": (
            "\"The Committee was informed that the IRDP aspires to create integrated mixed-income "
            "settlements, but in practice most projects default to fully subsidised delivery "
            "due to developer resistance and peripheral site selection.\" "
            "— Portfolio Committee on Human Settlements, Water and Sanitation, 2020"
        ),
        "source_committee": "Human Settlements",
        "reform_package": 3,
        "time_horizon": "long_term",
    },
]


# ── Insertion ─────────────────────────────────────────────────────────────────

def main():
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA foreign_keys = ON")
    cur = conn.cursor()

    # Verify DB state
    cur.execute("SELECT COUNT(*) FROM policy_ideas")
    existing = cur.fetchone()[0]
    print(f"Existing policy_ideas: {existing}")

    inserted = 0
    skipped = 0

    for idea in NEW_IDEAS:
        slug = slugify(idea["title"])
        try:
            conn.execute(
                """
                INSERT INTO policy_ideas (
                    id, title, description, theme, binding_constraint,
                    first_raised_date, times_raised, current_status,
                    feasibility_rating, feasibility_note, growth_impact_rating,
                    responsible_department, key_quote, source_committee,
                    reform_package, time_horizon, slug
                ) VALUES (
                    :id, :title, :description, :theme, :binding_constraint,
                    :first_raised_date, :times_raised, :current_status,
                    :feasibility_rating, :feasibility_note, :growth_impact_rating,
                    :responsible_department, :key_quote, :source_committee,
                    :reform_package, :time_horizon, :slug
                )
                """,
                {**idea, "slug": slug},
            )
            inserted += 1
            print(f"  + Inserted ID={idea['id']}: {idea['title'][:60]}")
        except sqlite3.IntegrityError as e:
            skipped += 1
            print(f"  ~ Skipped ID={idea['id']} (already exists): {e}")

    conn.commit()

    # Link each idea to its source committee meetings
    cur.execute(
        "SELECT COUNT(*) FROM meetings WHERE committee_id IN (291, 91)"
    )
    n_meetings = cur.fetchone()[0]
    print(f"\nMeetings available for linking: {n_meetings}")

    # Simple linking: attach each new idea to the 3 most relevant meetings
    # based on title keyword overlap
    IDEA_KEYWORDS = {
        125: ["title deed", "deeds", "title restoration"],
        126: ["social housing", "SHRA", "blocked projects"],
        127: ["informal settlement", "UISP", "upgrading"],
        128: ["first home finance", "FLISP", "gap market"],
        129: ["PIE", "illegal eviction", "unlawful occupation", "land invasion"],
        130: ["accreditation", "municipalities", "municipal"],
        131: ["NHBRC", "George building", "building collapse", "CIDB"],
        132: ["abandoned", "hijacked", "HDA"],
        133: ["emergency housing", "floods", "disaster"],
        134: ["community residential", "CRU", "rental"],
        135: ["housing consumer protection", "HCPA"],
        136: ["human settlements bill", "draft bill", "legislation"],
        137: ["PPRA", "property practitioners", "estate agent"],
        138: ["HDA", "housing development agency", "inflating prices", "SIU"],
        139: ["IRDP", "integrated residential", "mixed income"],
    }

    links_inserted = 0
    for idea_id, keywords in IDEA_KEYWORDS.items():
        # Find top 5 most relevant meetings
        for kw in keywords[:2]:  # use top 2 keywords
            cur.execute(
                """
                SELECT id FROM meetings
                WHERE committee_id IN (291, 91)
                  AND (lower(title) LIKE ? OR lower(summary_clean) LIKE ?)
                ORDER BY date DESC
                LIMIT 3
                """,
                (f"%{kw.lower()}%", f"%{kw.lower()}%"),
            )
            for (meeting_db_id,) in cur.fetchall():
                try:
                    conn.execute(
                        "INSERT INTO idea_meetings (idea_id, meeting_id) VALUES (?, ?)",
                        (idea_id, meeting_db_id),
                    )
                    links_inserted += 1
                except sqlite3.IntegrityError:
                    pass  # duplicate link

    conn.commit()
    print(f"idea_meetings links inserted: {links_inserted}")

    # Final tally
    cur.execute("SELECT COUNT(*) FROM policy_ideas")
    total = cur.fetchone()[0]
    cur.execute(
        "SELECT COUNT(*) FROM policy_ideas WHERE source_committee = 'Human Settlements'"
    )
    housing_count = cur.fetchone()[0]
    print(f"\nFinal policy_ideas total: {total} ({housing_count} from Human Settlements)")
    print(f"New ideas inserted: {inserted}, skipped: {skipped}")
    conn.close()
    print("\nDone. Run generate_housing_supabase_sql.py next.")


if __name__ == "__main__":
    main()
