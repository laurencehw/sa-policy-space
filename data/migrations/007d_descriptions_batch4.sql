-- ============================================================
-- Migration 007d: Remaining policy idea descriptions
-- Batch D: 25 ideas (IDs 103-139)
-- Part of a 100-idea update covering all ideas without
-- formal migration descriptions (all except 003/006 coverage)
-- Generated: 2026-03-24
-- ============================================================

BEGIN;

-- id=103
UPDATE policy_ideas SET
  description = 'DPWI and other national departments own significant well-located urban land — including former military bases, unused state hospitals, and surplus government offices — that is not being used productively. Releasing these parcels for affordable housing, mixed-use development, or social infrastructure could dramatically reduce the cost of urban land for low-income housing programmes without requiring expropriation. Operation Vulindlela identified public land release as a Phase I priority but progress has been slow due to inter-departmental coordination failures, disputes over land valuations, and competing departmental claims. A centralised Land Release Coordinating Committee with National Treasury, DPWI, DHS, and DTIC representation, backed by a Cabinet directive with implementation deadlines, is the proposed governance mechanism.',
  updated_at = NOW()
WHERE id = 103;

-- id=104
UPDATE policy_ideas SET
  description = 'The National Health Insurance Act (signed June 2023) establishes the legal framework for a single-payer health financing system that will pool public and private healthcare funding, contract accredited health service providers, and guarantee universal access to a defined package of services. The NHI Fund is to be operationalised in phases: Phase 1 (2023–2026) focuses on registering health users and providers, establishing governance structures, and piloting primary care contracting in selected districts. Full implementation, including mandatory enrolment and the transfer of private medical scheme members, is envisioned post-2030. Costing remains deeply contested: National Treasury estimates put the full NHI at R200–300 billion annually (current combined public and private health spending is R650 billion), but critics argue the model requires R450+ billion given expanded benefits and population. The World Bank, IMF, and rating agencies have flagged NHI fiscal risk as a sovereign concern. The PC on Health BRRRs 2023–2024 note that Phase 1 implementation is behind schedule on provider accreditation and ICT system procurement. This idea''s reform requirement is essentially: develop a credible, costed, phased implementation plan that can survive actuarial scrutiny before Phase 2 commitments are locked in.',
  updated_at = NOW()
WHERE id = 104;

-- id=105
UPDATE policy_ideas SET
  description = 'The US President''s Emergency Plan for AIDS Relief (PEPFAR) has invested approximately USD 6.5 billion in South Africa''s HIV/AIDS response since 2004, currently providing around USD 650 million annually (roughly R12 billion) to support antiretroviral treatment for 5.5 million people, community health worker programmes, laboratory networks, and civil society organisations. The Trump administration''s 2025 executive order initiating a review of all PEPFAR programming created an acute fiscal risk for South Africa''s health system: approximately 2 million patients on PEPFAR-supported ART programmes, 15,000 community health workers employed through PEPFAR-funded NGOs, and 47 PEPFAR-supported laboratory facilities face potential disruption. The DOH''s PEPFAR Transition Plan (2024–2027) proposes phased domestic absorption of the HIV programme into the NHI conditional grant framework, using HIV/AIDS conditional grant increase of R8 billion over three years to absorb the highest-priority programmes. International Development Finance from GFATM (Global Fund) and EU development partners provides potential bridge financing. This reform intersects directly with CHW formalisation (id=108) and NHI implementation (id=104).',
  updated_at = NOW()
WHERE id = 105;

-- id=106
UPDATE policy_ideas SET
  description = 'South Africa produces approximately 5,000 medical graduates, 14,000 nursing graduates, and 3,000 allied health graduates annually from public universities, yet an estimated 20,000–30,000 qualified health professionals are unemployed or underemployed due to frozen posts in provincial health departments. The contradiction—a country with catastrophic health worker shortages (doctor-to-population ratio of 0.9 per 1,000 vs. WHO recommended 2.5) that simultaneously has qualified but unemployed health workers—is a consequence of provincial health budget constraints and headcount freezes imposed under fiscal consolidation. The reform proposes: a national healthcare worker employment guarantee (funded through the NHI conditional grant and an emergency health workforce allocation of R5 billion per year), priority placement in rural and under-served districts, and a community service extension for doctors and nurses from 1 year to 2 years to expand rural coverage. The PC on Health BRRRs 2022–2024 document that Eastern Cape alone has 8,000 funded but vacant health posts, suggesting the problem is partly administrative (salary budget available but HR processes failing). PEPFAR transition (id=105) makes healthcare worker absorption more urgent by 2026.',
  updated_at = NOW()
WHERE id = 106;

-- id=108
UPDATE policy_ideas SET
  description = 'South Africa''s primary healthcare (PHC) platform—comprising 3,500 public health facilities plus approximately 72,000 community health workers (CHWs) deployed through the Ward-Based PHC Outreach Teams (WBPHCOT) model—is the structural foundation for NHI. This reform consolidates the CHW programme as a formal, paid tier of the health system, implements the integrated patient registration system (IPRS) across all PHC facilities, and deploys the digital health record system (HPRS) to enable continuity of care. The PEPFAR funding transition (id=105) makes CHW formalisation urgent: an estimated 15,000 CHWs employed through PEPFAR-funded NGOs face retrenchment as US funding winds down, creating a cliff in community-level HIV/TB service delivery. The PC on Health BRRRs 2022–2024 repeatedly flagged CHW contractualisation and the absence of a national employment framework as the central gap. Cost estimates: R8–12 billion annually for full CHW formalisation, partially offset by reduced hospital admissions.',
  updated_at = NOW()
WHERE id = 108;

-- id=109
UPDATE policy_ideas SET
  description = 'South Africa''s mental health system is severely under-resourced: fewer than 20 psychiatrists per million people (WHO recommends 1 per 10,000), 95% of mental health funding allocated to acute psychiatric hospitals rather than community-based care, and an estimated 75% of people with diagnosable mental health conditions receiving no treatment. The Life Esidimeni tragedy (2017), in which 144 mentally ill patients died after the Gauteng DOH terminated psychiatric care contracts and transferred patients to unregistered NGOs, exposed the catastrophic consequences of mental health service failures. The Mental Health Care Act Amendment (under preparation since 2020) proposes: community care mandates for provincial health departments, a minimum psychiatric bed ratio per district, recognition of community-based mental health workers as a formal health cadre, and a dedicated Mental Health Conditional Grant (currently mental health is unfunded within the PHC grant). The 2025 MTBPS does not include a dedicated mental health appropriation, making the structural reform dependent on the NHI implementation framework. The PC on Health BRRRs identify Life Esidimeni docket follow-up and provincial psychiatric bed capacity as the two most repeated mental health recommendations.',
  updated_at = NOW()
WHERE id = 109;

-- id=110
UPDATE policy_ideas SET
  description = 'South Africa''s tobacco control framework has not been substantively updated since the Tobacco Products Control Act (1993), despite the global proliferation of electronic nicotine delivery systems (ENDS), heated tobacco products, and waterpipes. The Tobacco Products and Electronic Delivery Systems Control Bill — providing for plain packaging, comprehensive advertising bans, and regulation of ENDS products — was tabled in 2018 and approved by Cabinet in 2022 but has been delayed by industry lobbying, jurisdictional disputes between the Departments of Health and Trade, Industry and Competition, and concerns about tax revenue implications. South Africa is a signatory to the WHO Framework Convention on Tobacco Control (FCTC), creating an international obligation to enact these measures. The PC on Health''s BRRRs consistently flagged the Bill''s stalled progress as a public health governance failure.',
  updated_at = NOW()
WHERE id = 110;

-- id=111
UPDATE policy_ideas SET
  description = 'Seven of South Africa''s nine provincial health departments received qualified audit opinions from the Auditor-General in 2023/24, reflecting persistent failures in financial management, supply chain governance, and infrastructure maintenance. The cumulative effect—medicine stockouts, equipment breakdowns, staff non-payment, and facility collapse—falls disproportionately on the 84% of South Africans dependent on public health. The Provincial Health Department Turnaround Programme (modelled on National Treasury''s Municipal Finance Improvement Programme for local government) deploys specialist financial management, supply chain, and HR teams to the three worst-performing provinces (Eastern Cape, Limpopo, North West) with a 2-year intensive support mandate. The PC on Health BRRRs 2022–2024 document the cyclical nature of provincial health crises: the same departments that were placed under Section 100 interventions in 2011–2013 are again in distress. NHI implementation (id=104) requires a stable provincial health infrastructure as its foundation—without turnaround, NHI will formalise dysfunction rather than reform it.',
  updated_at = NOW()
WHERE id = 111;

-- id=112
UPDATE policy_ideas SET
  description = 'The Competition Commission''s Health Market Inquiry (HMI), which reported in September 2019 after five years of investigation, found that South Africa''s private healthcare market is characterised by systemically high prices driven by concentrated hospital group power, inadequate price transparency, and a medical scheme system that fails to effectively represent patient interests against providers. The HMI''s 140+ recommendations include: mandatory multi-funder contracting (hospital groups cannot negotiate individually with each medical scheme), a National Reference Price List (NRPL) setting benchmark tariffs for all procedures, compulsory quality reporting by all private hospitals and specialists, and a new market conduct regulator for the healthcare sector. Implementation has been slow: the NRPL has been delayed by legal challenges from private hospital groups and specialist associations (HASA, SAMA), and the Council for Medical Schemes (CMS) lacks enforcement capacity. The MTBPS 2025 notes that private healthcare costs constitute 45% of total health spending despite serving only 16% of the population—a resource allocation that NHI implementation must address structurally. The PC on Health BRRRs 2021–2024 consistently flag HMI implementation delays as a governance failure.',
  updated_at = NOW()
WHERE id = 112;

-- id=113
UPDATE policy_ideas SET
  description = 'The African Medicines Agency (AMA) was established under the African Union framework and opened its headquarters in Yaoundé, Cameroon in 2021 after South Africa ratified the AMA Treaty. SAHPRA (South African Health Products Regulatory Authority) — one of Africa''s most technically sophisticated medicines regulators — is positioned as a reference regulatory authority for the AMA framework, able to provide registration reliance mechanisms that allow other African countries to benefit from SAHPRA''s rigorous reviews. SAHPRA''s 2025-2030 Strategic Plan and 2025/26 Annual Performance Plan outline priorities including: implementing a fully risk-based assessment approach, reducing registration backlogs (critical for NHI benefit package design), strengthening post-market surveillance, and combating the proliferation of counterfeit pharmaceuticals and medical devices. On 30 September 2025, South Africa launched a National Action Plan on Substandard and Falsified Medical Products in partnership with WHO. SAHPRA is also refining its eCTD dossier submission standards and labelling requirements to align with international ICH guidelines, critical for attracting pharmaceutical manufacturers to register in South Africa as a gateway to African markets. The AMA-SAHPRA relationship represents South Africa''s most concrete contribution to African health system integration under the AU Agenda 2063 framework.',
  updated_at = NOW()
WHERE id = 113;

-- id=115
UPDATE policy_ideas SET
  description = 'National Treasury Instruction 3 of 2021/22 mandated that all national and provincial departments reserve 30% of all procurement contracts for Small, Medium, and Micro Enterprises (SMMEs), township enterprises, and cooperatives—an estimated R120 billion per year in procurement that should flow to small businesses. However, compliance monitoring reveals that most departments meet the target on paper by disaggregating existing contracts and awarding sub-components to SMME subcontractors, without genuinely transferring the supply chain relationship or management capacity. The reform proposes: a reclassification of SMME procurement compliance to require direct prime contracts (not subcontracts) for the 30%, mandatory Supplier Development Plans where large contractors are awarded above-threshold contracts, BizPortal integration with CSD to make SMME registration and procurement participation seamless, and monthly compliance reporting to the PC on Small Business Development. The DSBD''s SMME Barometer (2024) estimates that only 18% of the 30% target is achieved through genuine prime SMME contracts. The Jobs Fund impact evaluation (2023) found that supply chain SMME development has the highest employment multiplier of any DSBD programme.',
  updated_at = NOW()
WHERE id = 115;

-- id=116
UPDATE policy_ideas SET
  description = 'The Small Enterprise Finance Agency (SEFA), a subsidiary of the IDC, provides development finance to SMMEs and cooperatives through direct loans and wholesale lending via microfinance intermediaries. Its R2.5 billion annual deployment has been criticised by the PC on Small Business Development for: over-concentration in working capital (short-term) loans rather than growth capital (equipment, premises, expansion), excessive concentration in Gauteng (55% of portfolio) relative to provincial SMME distributions, high non-performing loan rates (above 30% in several years), and insufficient linkage with the SEDA business support ecosystem. The mandate refocus reform proposes: a 40% minimum allocation to manufacturing and agro-processing (sectors with multiplier effects), dedicated provincial deployment targets aligned with the SMME policy, a non-performing loan recovery strategy that preserves lending capacity, and a blended finance partnership with the Jobs Fund to de-risk equity investments in high-growth SMMEs. The SMME Equity Fund (proposed in the 2024 Budget) would complement SEFA''s debt offering.',
  updated_at = NOW()
WHERE id = 116;

-- id=118
UPDATE policy_ideas SET
  description = 'South Africa''s cannabis and hemp sector sits at the intersection of agricultural development, industrial policy, public health regulation, and criminal justice reform. The regulatory landscape has been shifting rapidly: hemp was recognised as an agricultural crop in 2022, since when the Department of Agriculture has issued 2,031 cultivation permits. In December 2025, the permissible THC threshold for hemp plants was raised from 0.2% to 2%, significantly expanding the range of commercially viable cultivars. The Hemp and Cannabis Commercialisation Policy is expected to reach Cabinet for approval and public comment by April 2026. An Overarching Cannabis Bill — consolidating the Cannabis for Private Purposes Act (2024), commercial cultivation, manufacturing, and research regulations — is being drafted across DTIC, DAF, DoH, and DoJCD for presentation to Parliament by mid-2027. SAHPRA administers medicinal cannabis licensing. The Department of Trade, Industry and Competition''s National Cannabis Master Plan identifies export of medicinal cannabis to the EU, UK, and US as a priority revenue opportunity, with South Africa''s climate and soil conditions competitive with established producers in Colombia and Morocco. Provincial recognition frameworks for traditional cannabis growers — particularly in the Eastern Cape and KwaZulu-Natal — address social equity in the sector''s formalisation.',
  updated_at = NOW()
WHERE id = 118;

-- id=119
UPDATE policy_ideas SET
  description = 'The Small Enterprise Development Agency (SEDA) operates a network of over 50 enterprise development centres providing business advisory, training, and incubation services across South Africa, but a 2024 DSBD performance review found that services are perceived as generic, insufficiently linked to market demand, and inaccessible in deep rural areas and townships. Reform proposals include transitioning from generic advisory to sector-specialist hubs covering agri-processing, ICT, tourism, and the creative economy; deploying digital service delivery for basic advisory functions to extend geographic reach; and establishing outcome-based performance contracts for SEDA tied to measurable enterprise growth and job creation metrics. The PC on Small Business Development''s BRRRs repeatedly flagged SEDA''s high administration spend (over 40% of budget) versus actual enterprise impact.',
  updated_at = NOW()
WHERE id = 119;

-- id=120
UPDATE policy_ideas SET
  description = 'South Africa''s cooperative development programme, administered by the DSBD through the Cooperatives Incentive Scheme (CIS) and SEDA incubation, has disbursed hundreds of millions in grants since the Cooperatives Act (2005) yet produced few sustainable, scaled cooperative enterprises — a DSBD evaluation found an 80-90% failure rate within five years. The proposed outcome-based redesign replaces upfront capital grants with patient development capital linked to revenue milestones, restricts support to cooperatives in sectors with demonstrated market demand (particularly construction, waste, and community services), and mandates technical skills development alongside financial support. The IDC''s cooperative financing window provides a model for scaling to smaller entities under DSBD''s remit.',
  updated_at = NOW()
WHERE id = 120;

-- id=121
UPDATE policy_ideas SET
  description = 'South Africa''s informal economy employs an estimated 2.8-3.2 million workers predominantly in retail, food vending, and household services, but operates largely outside the formal regulatory and tax system. SARS''s Turnover Tax regime for businesses below R1 million annual turnover has seen slow uptake due to administrative complexity, while municipal trading infrastructure — market stalls, ablution facilities, electricity connections — is chronically inadequate in most townships and CBDs. The DSBD''s Informal Economy Policy Framework (2019) and Operation Vulindlela''s work on the spatial economy identify informal economy formalisation as an untapped labour market and fiscal resource. This reform combines SARS simplification with COGTA/SALGA-driven municipal infrastructure investment to lower the cost of formalisation.',
  updated_at = NOW()
WHERE id = 121;

-- id=122
UPDATE policy_ideas SET
  description = 'The Enterprise and Supplier Development (ESD) element of BBBEE scorecards requires corporations rated above Level 5 to invest 3% of net profit after tax in developing black-owned suppliers and enterprises. Estimated annual ESD investment of R8–12 billion from complying corporations represents a major but poorly managed private sector development finance flow: much ESD spend is directed toward single-year grants, soft-skills training, or preferential procurement clauses that expire with the scorecard cycle, rather than toward multi-year supplier relationship development. The Corporate Linkage Programme reform proposes: restructuring ESD codes to require multi-year supplier development contracts (minimum 3 years), integration of ESD suppliers with the SEDA Supplier Development Hubs and IDC''s SME Finance programme, mandatory ESD supplier registration on the Central Supplier Database to create a bankable track record, and a DTI-administered ESD impact measurement framework (currently ESD is self-reported with minimal verification). The PC on Trade BRRRs identify ESD as the BBBEE element with the largest gap between scorecard compliance and developmental impact.',
  updated_at = NOW()
WHERE id = 122;

-- id=123
UPDATE policy_ideas SET
  description = 'South Africa''s Just Energy Transition (JET) Investment Plan commits R1.5 trillion over 20 years to transition away from coal, creating significant commercial opportunities in renewable energy installation, energy efficiency retrofitting, battery storage, and green manufacturing. Most of these opportunities require upfront capital that small and medium enterprises cannot easily access through commercial banks, which apply standard credit criteria penalising early-stage energy companies. The DSBD, in coordination with the Small Enterprise Finance Agency (SEFA), is developing a dedicated JET-SMME Finance Facility providing blended first-loss instruments, technical assistance grants, and revenue-based financing. The facility would complement the International Partners Group''s $8.5 billion JET-IP commitments, which are directed primarily at large infrastructure.',
  updated_at = NOW()
WHERE id = 123;

-- id=133
UPDATE policy_ideas SET
  description = 'South Africa''s climate vulnerability — floods affecting Eastern Cape, KwaZulu-Natal and North West annually — exposes a broken emergency housing response system. The Emergency Housing Response Fund (EHRF) is administered at provincial level, with chronic underspending (provinces fail to access it) and allegations of political discrimination in allocations. Temporary Residential Units (TRUs) provided after disasters have become de facto permanent structures of poor quality. The DHS proposed centralising the EHRF in 2025, arguing that national administration would improve speed of response, quality control, and accountability. Parliamentary committee endorsed the principle while calling for stronger pre-positioning, provincial readiness protocols, and a cap on TRU duration with guaranteed transition to permanent housing.',
  updated_at = NOW()
WHERE id = 133;

-- id=134
UPDATE policy_ideas SET
  description = 'Community Residential Units (CRUs) are state-owned affordable rental housing for low-income households earning R0–R3,500 per month — the segment below the FLISP/First Home Finance threshold. Many CRU buildings transferred from councils to the state are in disrepair and undermanaged. The DHS has advocated expanding CRU supply through new construction and rehabilitation of existing stock in well-located urban areas, pairing supply with professional property management. Social housing institutions (SHIs) are well-placed to manage CRUs under a performance contract model. Committee discussions highlighted the need to avoid creating new informal settlements near CRU projects and the importance of proximity to economic opportunity in site selection.',
  updated_at = NOW()
WHERE id = 134;

-- id=135
UPDATE policy_ideas SET
  description = 'The Housing Consumer Protection Act (HCPA), enacted in 2024 to replace the Housing Consumers Protection Measures Act of 1998, creates a strengthened regulatory framework for the home building industry. Key provisions include mandatory enrolment of new homes with NHBRC, a new home warranty scheme, improved redress for defective construction, and enhanced consumer disclosure requirements. As of June 2025, the DHS was still finalising the implementing regulations. Full rollout requires aligning NHBRC''s inspection capacity, integrating the CIDB contractor grading register, and training municipalities on new approval conditions. The sector welcomes clearer rules but there are concerns about compliance cost for smaller affordable housing contractors.',
  updated_at = NOW()
WHERE id = 135;

-- id=136
UPDATE policy_ideas SET
  description = 'South Africa''s housing legislative framework is fragmented across at least nine statutes, including the Housing Act (1997), Social Housing Act (2008), National Housing Code, and various sector-specific measures. The Department has been developing a comprehensive National Human Settlements Bill since 2023 that would consolidate this framework, update definitions, align with the Constitution''s section 26 obligations, and provide a unified subsidy architecture. The bill addresses subsidy portability, mixed-income development standards, and the legal status of different housing typologies. Parliamentary committee engagement has been cautious, with members concerned that consolidation does not dilute rights-based protections or reduce departmental accountability.',
  updated_at = NOW()
WHERE id = 136;

-- id=137
UPDATE policy_ideas SET
  description = 'The Property Practitioners Regulatory Authority (PPRA) replaced the Estate Agency Affairs Board (EAAB) following the Property Practitioners Act (2019). Its mandate covers licensing, education, consumer protection, and transformation in the property sector. Committee oversight has repeatedly flagged PPRA governance failures, delayed fidelity fund certificate issuance (paralyzing property transactions), and the backlog in processing transformation and ownership requirements under the Act. Reform priorities include: (i) digitising the fidelity fund certificate process, (ii) implementing the mandatory BEE compliance provisions, (iii) improving PPRA governance and audit outcomes, and (iv) expanding the PPRA''s consumer redress capacity for property transaction disputes.',
  updated_at = NOW()
WHERE id = 137;

-- id=138
UPDATE policy_ideas SET
  description = 'The Housing Development Agency (HDA) is South Africa''s primary state vehicle for identifying, acquiring, holding, and releasing land and buildings for human settlements development. A May 2025 Presidential Proclamation mandated the SIU to investigate HDA following allegations of inflating land prices in multiple provinces, corrupt contractor appointment, and misappropriation of public funds. The Committee has called for consequence management, governance reforms, and a review of the HDA''s mandate to focus on strategic land assembly rather than project implementation. HDA''s CEO was suspended in 2026. Resolving governance dysfunction at HDA is a prerequisite for its expanded role in the abandoned buildings programme and broader urban land assembly.',
  updated_at = NOW()
WHERE id = 138;

-- id=139
UPDATE policy_ideas SET
  description = 'The Integrated Residential Development Programme (IRDP) was designed to create mixed-income neighbourhoods combining fully subsidised, partially subsidised, and market-rate housing — moving beyond the monolithic RDP township model. In practice, IRDP projects have largely defaulted to fully subsidised delivery due to weak demand for market-rate plots in peripheral locations and developers'' preference for greenfield private projects. Committee oversight shows persistent delivery delays, contractor non-performance, and beneficiary list fraud. Reform proposals focus on: (i) requiring IRDP sites to include minimum 30% market-rate units, (ii) improving location decisions to near economic nodes, (iii) linking land release decisions to transport corridors, and (iv) integrating IRDP with the UISP in peri-urban areas where informal settlements adjoin serviced land.',
  updated_at = NOW()
WHERE id = 139;

COMMIT;