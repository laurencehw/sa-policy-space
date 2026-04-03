"""
enrich_new_descriptions.py
--------------------------
Enriches the description field for ideas 140-163 (labour market, crime, justice)
in data/new_ideas_batch.json with factually grounded, data-rich descriptions.

Run: python scripts/enrich_new_descriptions.py
"""

import json
import os

DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data", "new_ideas_batch.json")

# ── Enriched descriptions (keyed by policy_idea id) ──────────────────────────
UPDATES = {
    140: (
        "South Africa's national minimum wage, set at R27.58 per hour in 2024, covers approximately "
        "6.2 million workers in sectors where compliance is measurable, yet enforcement remains uneven "
        "in agriculture, domestic work, and the informal economy. The Portfolio Committee on Employment "
        "and Labour has held repeated hearings on the NMW Commission's annual review methodology, "
        "debating whether the adjustment formula—pegged to CPI plus a modest real increase—adequately "
        "balances worker protection against the employment effects in an economy with 31.9% strict "
        "unemployment. A 2022 proposed Fair Remuneration Draft Bill sought to overhaul the framework "
        "entirely, but stalled amid opposition from both organised labour (COSATU) and business "
        "(BUSA). The central policy tension remains calibrating the wage floor to avoid pricing "
        "low-skilled workers out of formal employment while providing a meaningful income anchor."
    ),
    141: (
        "The CCMA handled over 200,000 dispute cases in 2024/25, making it one of the busiest "
        "labour dispute resolution bodies globally, yet commissioner capacity has not kept pace with "
        "caseload growth—resulting in average conciliation-to-arbitration timelines that frequently "
        "exceed the statutory 30-day target. The Portfolio Committee on Employment and Labour has "
        "tracked CCMA quarterly performance since 2020, noting persistent understaffing, high "
        "commissioner attrition, and the need for digitisation of case management. The AGSA has "
        "flagged material irregularities requiring remedial action in CCMA procurement processes. "
        "Expanding commissioner capacity and completing the shift to e-filing would reduce "
        "resolution times that currently impose significant costs on both workers awaiting relief "
        "and employers facing prolonged legal uncertainty."
    ),
    142: (
        "The Employment Tax Incentive (ETI), South Africa's primary youth wage subsidy, provides "
        "employers a tax credit of up to R1,000 per month for hiring workers aged 18-29 earning "
        "below R6,500 monthly. National Treasury estimates the ETI has supported over 2.3 million "
        "youth employment opportunities since 2014, but independent evaluations suggest significant "
        "deadweight loss—subsidising hires that would have occurred regardless. With youth "
        "unemployment (15-24) at approximately 60%, the Portfolio Committee on Employment and Labour "
        "has debated expanding the ETI beyond current age and wage thresholds, extending it to "
        "long-term unemployed adults, and strengthening compliance monitoring to prevent abuse. "
        "The incentive has been repeatedly extended on a temporary basis rather than made permanent, "
        "creating planning uncertainty for employers. Treasury's 2025 budget review flagged the "
        "ETI's fiscal cost at roughly R6 billion annually."
    ),
    143: (
        "The Unemployment Insurance Fund, with assets exceeding R200 billion and covering roughly "
        "9 million contributing workers, is South Africa's largest social insurance instrument—yet "
        "its governance has been marred by investment losses, irregular expenditure, and persistent "
        "audit qualifications from the AGSA. The Portfolio Committee on Employment and Labour has "
        "scrutinised UIF quarterly performance extensively since the COVID-19 TERS disbursement "
        "revealed systemic weaknesses in claims processing and fraud detection, with the SIU "
        "investigating over R5.2 billion in irregular TERS payments. A 2025 DEL initiative to "
        "reposition the UIF aims to modernise benefit structures and strengthen investment "
        "governance under PIC oversight. The gap between the Fund's substantial asset base and "
        "its poor operational performance represents a significant missed opportunity for worker "
        "protection in an economy where job losses remain endemic."
    ),
    144: (
        "The Compensation Fund, responsible for occupational injury and disease claims under "
        "COIDA, has accumulated a backlog estimated at over 300,000 unprocessed claims, with "
        "some dating back more than a decade—leaving injured workers without legally mandated "
        "compensation. The Portfolio Committee on Employment and Labour has documented systemic "
        "IT failures, a legacy paper-based filing system, and employer non-compliance with "
        "registration requirements as root causes. The AGSA has issued repeated qualified audit "
        "opinions on the Fund, and the committee demanded consequence management for officials "
        "responsible for the backlog. A DEL-initiated turnaround plan launched in 2024 includes "
        "digitisation of the claims system and deployment of additional adjudicators, but progress "
        "has been slow against the scale of the accumulated dysfunction."
    ),
    145: (
        "South Africa's expanded unemployment rate of approximately 42% includes over 3.7 million "
        "discouraged work-seekers who have stopped looking for employment altogether, representing "
        "a structural labour market detachment that conventional job-matching cannot address. The "
        "Portfolio Committee on Employment and Labour held dedicated workshops on the Labour "
        "Activation Programme (LAP) in 2024 and 2025, examining international models from Denmark "
        "and the Netherlands that combine mandatory job-search requirements with subsidised work "
        "experience and reskilling. The LAP, presented to Parliament by the Minister in June 2025, "
        "proposes using UIF surplus funds to finance activation interventions targeting the "
        "long-term unemployed. Implementation depends on coordination between DEL, DHET, and "
        "SETAs—institutions whose fragmented mandates have historically undermined integrated "
        "employment programmes."
    ),
    146: (
        "South Africa experienced over 600 large-scale retrenchment notices under Section 189A "
        "of the Labour Relations Act in 2024, affecting tens of thousands of workers in mining, "
        "manufacturing, and retail as firms restructured amid weak economic growth. The Portfolio "
        "Committee on Employment and Labour held a dedicated November 2025 workshop on reforming "
        "Sections 189 and 189A, examining proposals for mandatory social plans (requiring firms "
        "to fund reskilling and placement services), extended consultation periods, and enhanced "
        "CCMA facilitation of large-scale retrenchments. Organised labour has pushed for stronger "
        "protections including a requirement for ministerial approval of retrenchments above a "
        "threshold, while business argues that onerous dismissal regulation deters hiring in the "
        "first place. The reform debate highlights the fundamental tension in South African labour "
        "law between protecting incumbent workers and encouraging firms to create new positions."
    ),
    147: (
        "Productivity SA, a DEL entity mandated to provide turnaround assistance to distressed "
        "companies, intervened in over 80 enterprises in 2024/25, helping to avert approximately "
        "12,000 job losses through workplace restructuring, efficiency improvements, and social "
        "plan facilitation. The Portfolio Committee on Employment and Labour has tracked "
        "Productivity SA's quarterly performance alongside CCMA and NEDLAC, noting that its "
        "budget of roughly R90 million is modest relative to the scale of firm distress in an "
        "economy where business liquidations have been rising. The AGSA flagged the need for "
        "improved performance measurement and outcome tracking. Strengthening Productivity SA's "
        "capacity to conduct rapid-response interventions in sectors facing structural change—such "
        "as the automotive sector's EV transition and coal-dependent regions under the Just "
        "Energy Transition—would provide a cost-effective alternative to retrenchment."
    ),
    148: (
        "An estimated 3 million South Africans work in the informal economy, accounting for "
        "roughly 18% of total employment, yet they remain largely excluded from basic labour "
        "protections including minimum wage enforcement, UIF coverage, and occupational health "
        "safeguards. The Portfolio Committee on Employment and Labour has examined the gap between "
        "formal labour law and informal work realities, particularly as platform gig work "
        "(e-hailing, delivery services) grows rapidly without clear employment relationship "
        "definitions. The ILO's Recommendation 204 on the transition from the informal to the "
        "formal economy, which South Africa endorsed, provides a framework for graduated "
        "formalisation. The primary obstacle remains designing protections that do not inadvertently "
        "destroy the flexibility that makes informal work viable for both workers and micro-enterprises "
        "in an economy where formal jobs are chronically scarce."
    ),
    149: (
        "NEDLAC, South Africa's statutory tripartite body bringing together government, organised "
        "business (BUSA), and organised labour (COSATU, FEDUSA, NACTU), processed over 40 pieces "
        "of legislation in 2024/25 but has struggled to broker the kind of binding social compact "
        "on structural reform that its founding vision envisaged. The Portfolio Committee on "
        "Employment and Labour has noted that NEDLAC's consensus requirement effectively gives each "
        "constituency a veto, which has stalled progress on contentious reforms including labour "
        "market flexibility, prescribed asset requirements, and immigration policy. The 2025/26 "
        "Annual Performance Plan commits NEDLAC to facilitating a social compact on employment "
        "and growth as part of the GNU's reform agenda. Whether NEDLAC can evolve from a "
        "legislative review body into a genuine pact-making institution—as Ireland's social "
        "partnership model achieved in the 1990s—remains the central governance question for "
        "South Africa's corporatist framework."
    ),
    150: (
        "South Africa's murder rate of approximately 45 per 100,000 people ranks among the highest "
        "globally, yet SAPS detective-to-population ratios remain critically strained, with roughly "
        "180,000 officers serving a population of 62 million. The Portfolio Committee on Police has "
        "documented that the Detective Services Division carries caseloads far exceeding "
        "international norms, with detective-to-case ratios in some provinces exceeding 1:80, "
        "contributing to case clearance rates below 40% for contact crimes. A February 2025 "
        "intervention plan to capacitate the Detective Services Division was presented to the "
        "committee following concerns about extortion and violent crime case backlogs. Forensic "
        "evidence processing backlogs at SAPS laboratories compound the problem, with DNA analysis "
        "turnaround times frequently exceeding six months—undermining prosecution viability and "
        "eroding public trust in the criminal justice system."
    ),
    151: (
        "Extortion of construction sites and small businesses has emerged as one of South Africa's "
        "fastest-growing organised crime categories, with SAPS reporting a 60% increase in extortion "
        "cases between 2019 and 2024, particularly in Gauteng, KwaZulu-Natal, and the Western Cape. "
        "The Portfolio Committee on Police held multiple dedicated sessions in 2024-2025 on combating "
        "extortion, including establishing an extortion hotline and oversight framework. So-called "
        "'construction mafia' syndicates have halted or delayed infrastructure projects worth billions "
        "of rand, directly undermining the government's infrastructure investment programme. SAPS "
        "established dedicated anti-extortion units in priority provinces in 2024, but the committee "
        "noted that successful prosecution requires coordination between SAPS, the NPA's organised "
        "crime unit, and the Financial Intelligence Centre to trace and seize criminal proceeds."
    ),
    152: (
        "South Africa has one of the world's highest rates of intimate partner violence and sexual "
        "offences, with over 42,000 rapes reported to SAPS in 2023/24—a figure widely understood to "
        "represent a fraction of actual incidence. The National Strategic Plan on Gender-Based "
        "Violence and Femicide (NSP-GBVF) 2020-2030 established a multi-sectoral framework, but "
        "the Portfolio Committee on Police has found implementation uneven, particularly in staffing "
        "of SAPS Family Violence, Child Protection and Sexual Offences (FCS) units and funding of "
        "Thuthuzela Care Centres providing one-stop support to survivors. A 2024 CSPS compliance "
        "audit on the Domestic Violence Act found significant gaps in police station-level "
        "implementation. The committee has called for strengthening the National Register for Sex "
        "Offenders and improving evidence collection protocols that currently contribute to case "
        "attrition rates exceeding 50% between reporting and prosecution."
    ),
    153: (
        "The Independent Police Investigative Directorate (IPID) is constitutionally mandated to "
        "investigate deaths in police custody, police shootings, torture, and corruption, yet has "
        "operated with chronic underfunding and vacancy rates that undermine its oversight capacity. "
        "The Portfolio Committee on Police has tracked IPID's performance quarterly, noting that "
        "the directorate investigates over 6,000 cases annually with a staff complement that is "
        "roughly 30% below establishment. The February 2026 committee session debated extending the "
        "IPID Executive Director's appointment amid concerns about institutional continuity. A "
        "critical structural weakness is IPID's reliance on SAPS cooperation for evidence "
        "collection in cases where SAPS members are themselves the subjects of investigation. "
        "Strengthening IPID's independence and forensic capacity is essential for rebuilding "
        "public trust in policing and ensuring constitutional accountability."
    ),
    154: (
        "South Africa's private security industry employs over 2.7 million registered active "
        "security officers—substantially more than SAPS's approximately 180,000 members—making it "
        "the largest private security sector relative to population in the world. The Private "
        "Security Industry Regulatory Authority (PSIRA) oversees this sector, but the Portfolio "
        "Committee on Police has noted persistent challenges including a material irregularity "
        "flagged by the AGSA in June 2025, inadequate training standards, and insufficient "
        "coordination between private security and public policing. The committee has debated "
        "foreign ownership restrictions in the security industry and the need for updated "
        "legislation reflecting the sector's growth from guarding services into armed response, "
        "cybersecurity, and critical infrastructure protection. Rationalising private security "
        "regulation is essential given that private provision has become the de facto primary "
        "safety mechanism for businesses and middle-income households."
    ),
    155: (
        "Illegal mining operations—known locally as zama-zama—have expanded dramatically across "
        "South Africa's estimated 6,000 abandoned and ownerless mines, generating an illicit "
        "economy estimated at R7-14 billion annually while creating severe safety, environmental, "
        "and public order hazards. The Stilfontein mine disaster of late 2024, in which hundreds "
        "of illegal miners were trapped underground, exposed the scale of the crisis and the "
        "inadequacy of the inter-departmental response. The Portfolio Committee on Police has "
        "examined coordination failures between SAPS, the DMRE, and immigration authorities, "
        "noting that zama-zama operations are closely linked to organised criminal syndicates and "
        "undocumented migration. The committee received an illegal mining petition in September "
        "2025 demanding stronger enforcement. Addressing the problem requires mine rehabilitation "
        "funding (under DMRE), border security (SAPS), and prosecution capacity (NPA)—a "
        "multi-departmental challenge that no single agency currently owns."
    ),
    156: (
        "Community Policing Forums (CPFs), established under the South African Police Service Act "
        "to enable civilian oversight and community-police partnerships at station level, exist at "
        "over 1,150 police stations but function effectively at only a fraction of them due to "
        "inadequate funding, political capture, and unclear mandates. The Portfolio Committee on "
        "Police has examined CPF functionality repeatedly, with a February 2024 session finding "
        "that most CPFs lack the resources for basic operations including meeting venues and "
        "communication equipment. The Civilian Secretariat for Police Service (CSPS) has proposed "
        "sustainable funding models and integration of CPFs with municipal Integrated Development "
        "Plans. The committee's 2024 oversight visit reports documented significant variation "
        "across provinces, with well-resourced CPFs in Western Cape metropolitan areas contrasting "
        "sharply with dysfunctional structures in rural Eastern Cape and Limpopo stations."
    ),
    157: (
        "The SANDF has been deployed in support of SAPS operations under successive presidential "
        "authorisations since 2010, with the most recent deployments in 2025-2026 focusing on "
        "border security, gang violence in the Western Cape, and support for policing operations "
        "in high-crime areas. The Portfolio Committee on Police held a March 2026 session examining "
        "the cost-effectiveness and exit strategy for SANDF deployments, noting that the military "
        "is not trained or equipped for sustained internal policing functions. Annual deployment "
        "costs exceed R1 billion, diverting resources from SANDF's primary defence mandate. The "
        "committee has questioned whether permanent SAPS capacity building—including specialised "
        "border police units and dedicated gang task forces—would be more effective than repeated "
        "temporary military deployments that address symptoms rather than the structural policing "
        "gaps driving South Africa's violent crime crisis."
    ),
    158: (
        "The National Prosecuting Authority, under NDPP Shamila Batohi's leadership since 2019, "
        "has improved its overall conviction rate to above 93% in cases that reach trial, but faces "
        "a critical capacity gap in complex commercial crime, corruption, and organised crime "
        "prosecution—precisely the categories most consequential for deterring state capture and "
        "economic crime. The Portfolio Committee on Justice and Constitutional Development has "
        "tracked NPA vacancy rates (approximately 20% in senior prosecutor positions) and the "
        "implementation of Zondo Commission referrals, of which fewer than a dozen have reached "
        "prosecution stage as of early 2026. The Constitution Twenty-First Amendment Bill proposes "
        "strengthening NPA independence by entrenching the NDPP appointment process. Rebuilding "
        "the Investigating Directorate against Corruption (IDAC), established in 2024 as a "
        "permanent NPA unit replacing the old ID, is essential for credible anti-corruption "
        "enforcement."
    ),
    159: (
        "South African courts carry a criminal case backlog estimated at over 170,000 cases, "
        "with regional courts averaging 12-18 months from plea to finalisation for serious offences "
        "—delays that undermine both access to justice and the deterrence function of the criminal "
        "justice system. The Portfolio Committee on Justice and Constitutional Development has "
        "examined judicial efficiency through magistrate vacancy rates (approximately 15% of "
        "established posts unfilled), courtroom utilisation below 70% in some districts, and "
        "the slow rollout of the Integrated Case Management System. The 2025 Judicial Matters "
        "Amendment Bill addresses some procedural bottlenecks, but structural resolution requires "
        "additional judicial officers, modernised court infrastructure, and digitisation of court "
        "records. The backlog has a direct economic impact: commercial litigation delays increase "
        "contract enforcement uncertainty, which the World Bank's Doing Business indicators have "
        "consistently identified as a constraint on South Africa's investment climate."
    ),
    160: (
        "The Special Investigating Unit, operating under presidential proclamation, has recovered "
        "or prevented losses of over R39 billion since 2019, with its dedicated Special Tribunal "
        "enabling civil recovery of state funds lost to corruption without waiting for criminal "
        "prosecution timelines. The Portfolio Committee on Justice and Constitutional Development "
        "has monitored SIU investigations including COVID-19 procurement fraud (over R14 billion "
        "in irregular contracts investigated), Digital Vibes, and matters referred from the Zondo "
        "Commission. The SIU's 2025/26 Annual Performance Plan targets accelerated case "
        "finalisation in the Special Tribunal, which had a backlog of over 400 matters. The "
        "asset recovery model—pursuing civil forfeiture and contractual set-aside rather than "
        "criminal conviction—represents the most promising near-term mechanism for recovering "
        "state capture losses, but depends on sustained funding and cooperation from departments "
        "that are sometimes reluctant to acknowledge their own procurement failures."
    ),
    161: (
        "Legal Aid South Africa provides legal representation to approximately 750,000 people "
        "annually, predominantly in criminal defence but increasingly in civil matters including "
        "labour disputes, housing evictions, and domestic violence protection orders. The Portfolio "
        "Committee on Justice and Constitutional Development has noted that Legal Aid SA's budget "
        "of roughly R2.3 billion has not kept pace with inflation or demand growth, constraining "
        "the organisation's ability to maintain its network of 64 local offices and 64 satellite "
        "offices. Rural access remains a particular challenge: in provinces like Limpopo and "
        "Eastern Cape, the nearest Legal Aid office may be over 100 km from communities needing "
        "services. The organisation's 2022/23 Annual Report documented a clean audit and high "
        "client satisfaction, but structural underfunding threatens the constitutional right to "
        "legal representation that Legal Aid SA is the primary vehicle for realising."
    ),
    162: (
        "More than 25 years after the Truth and Reconciliation Commission's final report, the "
        "majority of its recommendations remain unimplemented, including individual reparation "
        "payments to over 22,000 identified victims (only a one-off R30,000 per victim was paid "
        "in 2003), prosecution of apartheid-era crimes where amnesty was denied, and the "
        "establishment of a permanent reparations fund. The Portfolio Committee on Justice and "
        "Constitutional Development held a dedicated stakeholder engagement in May 2025 and has "
        "tracked NPA progress on TRC prosecution referrals, with the Foundation for Human Rights "
        "reporting that fewer than five cases have been successfully prosecuted. The NPA briefed "
        "the committee in February 2025 on TRC matters, acknowledging resource constraints and "
        "evidentiary challenges in cases now three decades old. The continued failure to implement "
        "TRC recommendations represents an unresolved dimension of South Africa's transition that "
        "affects institutional legitimacy and social cohesion."
    ),
    163: (
        "The Cybercrimes Act of 2020, fully commenced in 2024, provides South Africa's first "
        "comprehensive legislative framework for prosecuting cybercrime, including offences related "
        "to data interference, cyber fraud, and malicious communications. However, SAPS digital "
        "forensic capacity remains critically limited, with fewer than 200 trained cybercrime "
        "investigators for a country experiencing exponential growth in online fraud, ransomware "
        "attacks, and business email compromise. The South African Banking Risk Information Centre "
        "(SABRIC) reported digital banking fraud losses exceeding R1 billion in 2023. The Portfolio "
        "Committee on Justice and Constitutional Development has examined the Act's implementation "
        "alongside the Constitution Twenty-First Amendment Bill's anti-corruption provisions. "
        "Designated cybercrime courts and mutual legal assistance frameworks for cross-border "
        "digital evidence remain in early planning stages, leaving South Africa's digital economy "
        "growth vulnerable to escalating cyber threats."
    ),
}


def enrich_descriptions():
    """Read the JSON, update descriptions for IDs 140-163, write back."""
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        ideas = json.load(f)

    updated_count = 0
    for idea in ideas:
        idea_id = idea["id"]
        if idea_id in UPDATES:
            old_len = len(idea["description"])
            idea["description"] = UPDATES[idea_id]
            new_len = len(idea["description"])
            print(f"  ID={idea_id}: {old_len} -> {new_len} chars ({idea['title'][:50]}...)")
            updated_count += 1

    with open(DATA_PATH, "w", encoding="utf-8") as f:
        json.dump(ideas, f, indent=2, ensure_ascii=False)

    return updated_count


if __name__ == "__main__":
    print("=== Enriching descriptions for ideas 140-163 ===\n")
    count = enrich_descriptions()
    print(f"\n=== Done: {count} descriptions enriched in {DATA_PATH} ===")
