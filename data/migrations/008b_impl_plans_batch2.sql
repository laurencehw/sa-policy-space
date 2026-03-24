-- ============================================================
-- Migration 008b: Implementation Plans — Batch 2 (13 ideas)
-- IDs: 18, 19, 20, 22, 25, 26, 27, 28, 30, 31, 32, 33, 34
-- Note: IDs 24 and 29 are already covered by migration 004.
-- Format: INSERT ON CONFLICT DO NOTHING (idempotent).
-- Generated: 2026-03-24
-- ============================================================

BEGIN;

-- ── 1. ID 18: APDP Phase 2 Enhancement ──────────────────────────────────────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    18,
    'DTIC and ITAC will extend APDP Phase 2 incentives to 2035 and introduce an EV-transition component (volume assembly allowance for battery-electric and hybrid platforms) while commissioning Phase 3 design by 2026. The component manufacturer rebate will be reviewed to deepen local content in electronics and powertrains. ITAC will administer duty credit certificates under the revised schedule; DTIC will track OEM investment commitments through the Automotive Masterplan scorecard. Success is measured by sustained automotive export revenues above R210 billion per year and at least two major OEM investment announcements tied to EV platform localisation by 2028.',
    '[
      {"step":1,"description":"DTIC publishes revised APDP Phase 2 programme rules incorporating the EV production incentive component and revised component manufacturer rebate thresholds, gazetted for public comment","timeline":"Q2 2025","responsible_party":"Department of Trade, Industry and Competition (DTIC) / ITAC"},
      {"step":2,"description":"Commission independent review of APDP Phase 3 design options, benchmarking against Thailand AEDP and Germany KfW automotive transformation fund; consult NAAMSA, NAACAM, and organised labour on transition support requirements","timeline":"Q3 2025–Q1 2026","responsible_party":"DTIC / NAACAM / NAAMSA"},
      {"step":3,"description":"Publish APDP Phase 3 framework document for the 2026–2035 cycle covering EV-optimised assembly allowances, battery component localisation targets, and skills transition incentives; gazette for Nedlac consultation","timeline":"Q2–Q4 2026","responsible_party":"DTIC / National Treasury"},
      {"step":4,"description":"Annual Automotive Masterplan scorecard review: track OEM export volumes, component local content share, investment commitments, and employment; report to Portfolio Committee on Trade, Industry and Competition","timeline":"Annual (Q2 each year)","responsible_party":"DTIC / ITAC"}
    ]'::jsonb,
    '2025–2035 (Phase 2 extension); Phase 3 design completed by end-2026; 10-year programme horizon',
    'R12 billion per year in foregone customs duty and production incentives (existing baseline); Phase 3 design and review: R15 million (DTIC operational budget)',
    'No new primary legislation required for Phase 2 extension; ITAC tariff schedule amendment for duty credit mechanism; Phase 3 may require amendment to the International Trade Administration Act (ITAA) for revised production incentive structure',
    'Phase 2 extension is an administrative programme renewal — no parliamentary process required. Phase 3 framework will require Cabinet approval and industry consultation through Nedlac. ITAC schedule amendments are published in the Government Gazette under ITAA Section 8.',
    'Strong multi-party support aligned to auto sector employment (113,000 direct jobs). Industry (NAAMSA, NAACAM) and organised labour (NUMSA) both advocate APDP continuity. The EV transition element faces some union resistance over potential job displacement but DTIC has framed it as a just transition support programme.',
    'Thailand''s Automotive EV incentive package (2022) directed ~$1.2 billion in production incentives to attract EV manufacturing from BYD, Toyota, and MG, yielding 50,000 EV production units by 2025. Germany''s KfW automotive transformation fund (EUR 1 billion) supports component suppliers shifting from ICE to EV platforms — a model for DTIC''s component manufacturer rebate redesign.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 2. ID 19: BRICS+ Trade Facilitation and Alternative Payment Systems ──────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    19,
    'DIRCO, the SARB, and National Treasury will pursue a calibrated BRICS+ trade facilitation agenda focused on expanding NDB rand-denominated lending, piloting local currency settlement in bilateral mineral trade, and advancing CBDC interoperability through Project Khokha 2. The programme must be carefully sequenced to avoid secondary sanctions exposure or correspondent banking withdrawal by Western financial institutions, given SA''s concurrent AGOA retention and FATF greylisting obligations. Responsible departments will manage a dual-track engagement: deepening BRICS+ commercial relationships while explicitly ringfencing SA from BRICS geopolitical dimensions incompatible with its WTO, AGOA, and IMF obligations. Success is measured by a 10% increase in rand-settled intra-BRICS trade and NDB rand loan portfolio exceeding R30 billion by 2027.',
    '[
      {"step":1,"description":"SARB and National Treasury publish a local currency settlement policy framework defining permissible bilateral settlement arrangements with BRICS+ central banks; include risk limits and correspondent banking safeguards","timeline":"Q2 2025","responsible_party":"South African Reserve Bank / National Treasury"},
      {"step":2,"description":"NDB Board engagement to expand the NDB''s rand-denominated bond programme (existing rand bonds: R5 billion); target R30 billion rand loan portfolio for SA infrastructure by 2027 through NDB board resolutions","timeline":"Q2 2025–Q4 2026","responsible_party":"National Treasury / DIRCO / NDB Board"},
      {"step":3,"description":"Project Khokha 2 CBDC interoperability pilot: conduct bilateral CBDC settlement test with at least two BRICS+ central banks for mineral commodity trade settlement; publish technical assessment and risk framework","timeline":"Q3 2025–Q2 2026","responsible_party":"South African Reserve Bank / DIRCO"},
      {"step":4,"description":"Annual diplomatic and trade review: monitor rand-settled intra-BRICS trade share, NDB portfolio growth, CBDC pilot outcomes, and any correspondent banking risk indicators; report to Cabinet''s Economic Cluster","timeline":"Annual (Q1 each year)","responsible_party":"DIRCO / National Treasury / SARB"}
    ]'::jsonb,
    '2025–2027 for core milestones; CBDC interoperability is a medium-term (3–5 year) horizon',
    'Minimal direct fiscal cost; NDB lending is off-balance-sheet; SARB Project Khokha 2 operational budget (~R50 million over 2 years already allocated)',
    'No new primary legislation required; SARB administrative instruments under the SARB Act and Currency and Exchanges Act govern settlement arrangements; NDB obligations under the Treaty for the Establishment of a New Development Bank',
    'Settlement arrangements with BRICS+ central banks are governed by SARB exchange control regulations and bilateral MoUs — no parliamentary process required. NDB bond programme expansion is an NDB Board decision. CBDC framework may eventually require amendment to the Currency and Exchanges Act.',
    'Moderate feasibility. NDB rand lending has political support across the GNU. Russia-linked BRICS dimensions remain diplomatically sensitive given SA''s non-alignment posture. SARB is cautious on CBDC interoperability given correspondent banking risk. National Treasury supports NDB expansion as a non-fiscal infrastructure financing mechanism.',
    'India-UAE bilateral local currency settlement (INR-AED) launched in 2023, reducing USD dependency in a bilateral trade relationship exceeding $80 billion. China''s CIPS (Cross-Border Interbank Payment System) processes over $50 trillion annually in yuan-denominated transactions — demonstrating the infrastructure feasibility of non-dollar multilateral settlement. Brazil''s NDB-funded infrastructure bond programme (R$12 billion in BRL-denominated bonds since 2018) provides the closest precedent for SA''s NDB rand strategy.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 3. ID 20: Energy Bounce-Back and Industrial Energy Self-Generation ────────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    20,
    'National Treasury, DMRE, and the commercial banking sector will administer Phase 2 of the Energy Bounce-Back Guarantee Scheme (extending the R9 billion programme through 2026) and scale the embedded generation industrial energy cadastre to track the full private capacity pipeline. The Electricity Regulation Amendment Act (August 2024) provides the foundational licensing framework; the Department of Mineral Resources and Energy will complete outstanding secondary regulations within 12 months. DTIC will track industrial uptake through the energy cadastre and link outcomes to the Manufacturing Competitiveness Enhancement Programme. Success is measured by 2,000 MW+ of private generation capacity installed and a 30% reduction in business energy downtime costs by 2026.',
    '[
      {"step":1,"description":"National Treasury and SARB publish Phase 2 guarantee scheme parameters: extended tenor (up to 10 years), expanded eligible technologies (including green hydrogen pilot), revised lending rate cap; publish updated guidelines for participating banks","timeline":"Q1 2025","responsible_party":"National Treasury / South African Reserve Bank"},
      {"step":2,"description":"DMRE gazette outstanding 6 secondary regulations under the ERA within the statutory 12-month period: NTCSA governance regs, revised Grid Connection Code, wholesale market rules; NERSA publish regulatory capacity expansion plan","timeline":"Q1–Q3 2025","responsible_party":"Department of Mineral Resources and Energy (DMRE) / NERSA"},
      {"step":3,"description":"DTIC expand industrial energy cadastre: mandate registration of all embedded generation projects above 100 kW; integrate with municipal building approval data; publish quarterly industry uptake reports disaggregated by province and sector","timeline":"Q2 2025–Q1 2026","responsible_party":"Department of Trade, Industry and Competition (DTIC) / NERSA"},
      {"step":4,"description":"12-month programme review: benchmark against 2,000 MW installation target; assess quality of loan book through SARB supervisory data; evaluate whether grant conversion mechanism for marginal projects is warranted; report to Portfolio Committee on Electricity","timeline":"Q4 2026","responsible_party":"National Treasury / DMRE / SARB"}
    ]'::jsonb,
    'Phase 2 operational 2025–2026; cadastre and secondary regulations: 12 months from ERA commencement (August 2024–August 2025)',
    'R9 billion government guarantee (contingent liability, not direct expenditure); Section 12B tax incentive: R2.5–3.5 billion per year in foregone revenue; NERSA capacity: R150 million (existing budget)',
    'Electricity Regulation Amendment Act (ERA) signed August 2024 (complete); Income Tax Act Section 12B amendment for renewable energy accelerated depreciation (complete); NTCSA governance regulations (secondary legislation, outstanding)',
    'ERA secondary regulations are issued by the Minister of DMRE under ERA Section 35 — no further parliamentary process. The Grid Connection Code and market rules are NERSA regulatory instruments. The guarantee scheme operates under National Treasury''s existing guarantee framework (PFMA Section 70).',
    'Strong cross-party support — load-shedding reduction is the GNU''s most visible economic performance metric. NUMSA expresses concern about employment implications in Eskom but accepts private generation as a short-term necessity. Eskom board has accepted the unbundling framework. The primary political risk is delays in NTCSA establishment due to Eskom institutional resistance.',
    'Germany''s Energiewende embedded generation programme enabled 1 million rooftop solar installations within 5 years through the KfW loan guarantee scheme and feed-in tariffs. Chile''s net-billing regulation (2014) grew residential solar from near zero to 600 MW in 6 years. Bangladesh''s IDCOL Solar Home System programme (3 million installations with government-backed concessional finance) demonstrates the power of guaranteed lending schemes in driving rapid distributed energy deployment.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 4. ID 22: Two-Pot Pension System ─────────────────────────────────────────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    22,
    'The Two-Pot Retirement System is fully operational from 1 September 2024; implementation focus shifts to monitoring retirement adequacy outcomes, addressing low-income worker retirement pot insufficiency, and evaluating auto-enrolment for informal and non-standard workers. FSCA, SARS, and National Treasury will conduct a joint 12-month review (due September 2025) covering withdrawal patterns, fund administrative costs, and actuarial impact on retirement pot adequacy across income deciles. SARS will assess the tax revenue profile of the transition (R10.6 billion collected in the first four months) and its medium-term implications for the withdrawal tax baseline. The long-term adequacy challenge — low-income workers accumulating insufficient retirement pot balances — will be addressed through a National Treasury consultation on minimum contribution rates and government co-contribution options.',
    '[
      {"step":1,"description":"FSCA, SARS, and National Treasury publish joint 12-month implementation review: withdrawal patterns by income decile, fund administrative cost impacts, SARS tax collection data, and early actuarial signals on retirement pot adequacy","timeline":"September 2025","responsible_party":"Financial Sector Conduct Authority (FSCA) / SARS / National Treasury"},
      {"step":2,"description":"FSCA conduct supervisory review of fund administrators: assess compliance with seeding requirements, ring-fencing of savings pot, accuracy of benefit statements, and consumer education obligations under FAIS Act","timeline":"Q1–Q2 2025","responsible_party":"Financial Sector Conduct Authority (FSCA)"},
      {"step":3,"description":"National Treasury publish consultation paper on auto-enrolment for non-standard workers (gig economy, domestic workers, informal sector) and minimum contribution adequacy standards; Nedlac engagement with organised labour","timeline":"Q3 2025–Q1 2026","responsible_party":"National Treasury / FSCA / Department of Employment and Labour"},
      {"step":4,"description":"Pension Funds Act amendment: introduce government co-contribution mechanism for low-income workers (targeting workers below R7,000/month) and mandatory minimum retirement pot contribution floor; table in Parliament","timeline":"Q1–Q4 2026","responsible_party":"National Treasury / Parliament"}
    ]'::jsonb,
    'Implementation complete September 2024; 12-month review: September 2025; auto-enrolment consultation: 2025–2026; adequacy amendments: 2026',
    'No fiscal cost for monitoring phase; government co-contribution mechanism (if adopted): estimated R3–5 billion per year (to be determined through consultation); FSCA and SARS supervisory costs absorbed in existing budgets',
    'Revenue Laws Amendment Act 2023 (enacted); Pension Funds Act amendments for seeding: complete; auto-enrolment and co-contribution amendments: future legislation to be determined through consultation',
    'The legislative package for the Two-Pot system (Revenue Laws Amendment Act, Pension Funds Act amendments, Income Tax Act) is complete. Future amendments for auto-enrolment and government co-contribution will require new legislation — National Treasury will manage through the annual Budget revenue law amendment process.',
    'Strong political consensus across the GNU — the Two-Pot reform was one of the most broadly supported financial sector reforms in recent parliamentary history, with COSATU, NEDLAC, and all major parties supporting implementation. The adequacy gap for low-income workers is the main outstanding tension; Treasury must balance fiscal cost of co-contribution against political pressure to improve retirement outcomes.',
    'Australia''s Superannuation system (mandatory 11% contribution with government co-contribution for low earners) achieved near-universal retirement savings coverage over 30 years and is the global benchmark for adequacy. Chile''s AFP reform (2008) introduced government solidarity pillar to address low-balance retirees — relevant precedent for SA''s retirement pot adequacy challenge. Singapore''s CPF mandatory contribution system with ring-fenced healthcare and retirement accounts provided the architectural model for the Two-Pot design.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 5. ID 25: National Treasury PPP Unit and Infrastructure Financing Reform ──
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    25,
    'National Treasury will establish a dedicated Infrastructure Transaction Advisory Unit (ITAU) — staffed with transaction advisors, legal specialists, and financial structuring capacity — to cut PPP approval timelines from the current 4–7 years to under 2 years for standard social infrastructure projects. Treasury Regulation 16 will be revised to introduce a risk-based single-gateway approval replacing the current three-stage process, and the Infrastructure Fund''s disbursement rate will be accelerated from under 15% to over 50% of committed capital within 18 months. DBSA will anchor project preparation financing for the bankable project pipeline. Success is measured by at least 10 PPPs reaching financial close within 24 months of this reform and Infrastructure Fund disbursement exceeding R40 billion by 2027.',
    '[
      {"step":1,"description":"National Treasury establish the Infrastructure Transaction Advisory Unit (ITAU) within the PPP Unit: recruit 20–30 specialist transaction advisors, legal and financial structuring experts; publish revised PPP Practitioner''s Guide with streamlined risk-based approval process","timeline":"Q2–Q4 2025","responsible_party":"National Treasury / DBSA"},
      {"step":2,"description":"Revise Treasury Regulation 16: replace three-stage feasibility-and-approval process with a risk-tiered single-gateway system; projects below R2 billion use a simplified 90-day review track; publish revised regulation for 60-day public comment","timeline":"Q2–Q4 2025","responsible_party":"National Treasury / Office of the Accountant General"},
      {"step":3,"description":"Infrastructure Fund accelerated disbursement plan: identify the top 20 projects in the pipeline ready for blended finance structuring; establish dedicated project preparation grant facility (R500 million) at DBSA; target 15 projects at financial close by 2027","timeline":"Q1 2025–Q4 2027","responsible_party":"Infrastructure Fund / DBSA / National Treasury"},
      {"step":4,"description":"Publish annual PPP pipeline report: list of all projects in preparation (with stage, sector, and estimated value); benchmark against OECD PPP project preparation best practice; report to PC on Finance and PC on Public Works","timeline":"Annual (Q1 each year)","responsible_party":"National Treasury PPP Unit / Infrastructure Fund"}
    ]'::jsonb,
    '18 months to ITAU full operationalisation and revised Reg 16 commencement; Infrastructure Fund acceleration: 2025–2027; first 10 PPP closings under new framework: by 2027',
    'ITAU staffing: R150–200 million per year (specialist capacity); DBSA project preparation facility: R500 million (largely recoverable from project fees); Infrastructure Fund: existing R100 billion committed envelope (requires accelerated deployment)',
    'Amendment to Treasury Regulation 16 (Ministerial promulgation under PFMA — no parliamentary process); potential Public Finance Management Act amendment for municipal-level PPP off-balance-sheet framework',
    'Treasury Regulation 16 revision is a Ministerial instrument under the PFMA — no parliamentary approval required. The ITAU can be established as an internal organisational unit without new legislation. A future PPP Act (to consolidate PPP law and extend to SOEs and municipalities) would require parliamentary process but is not a precondition for near-term reforms.',
    'Strong support from National Treasury, DBSA, and the private sector investment community. Political risk: SOE unions and procurement-focused interests may resist private participation in large infrastructure. The Infrastructure Fund''s slow disbursement has been a Cabinet-level concern, creating political urgency for reform. GNU economic cluster has PPP acceleration as an explicit commitment.',
    'Colombia''s Agencia Nacional de Infraestructura (ANI) reduced PPP financial close timelines from 6+ years to 18 months by establishing specialist transaction teams, standardised contracts, and a mandatory project preparation budget — directly analogous to the proposed ITAU. The UK''s Infrastructure and Projects Authority (IPA) provides end-to-end advisory to government counterparties and is credited with over GBP 200 billion in project closings since 2010. Australia''s Infrastructure NSW standardised PPP contract suite reduced legal preparation time by 60%.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 6. ID 26: Inclusive Growth Spending Review ────────────────────────────────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    26,
    'National Treasury, working through the Medium-Term Expenditure Framework (MTEF) process, will commission a comprehensive Inclusive Growth Spending Review evaluating whether the R280 billion social protection budget is optimally structured for both poverty reduction and employment activation. The review will model trade-offs between the SRD grant, EPWP, and the Jobs Fund — testing whether targeted complementary spending on employment can improve labour market outcomes for grant recipients without reducing poverty coverage. DPME will lead programme evaluation using administrative data from SASSA and the UIF. The SRD grant''s legal status will be resolved by 2026/27 MTBPS as committed. Success is measured by a published spending review with evidence-based policy recommendations adopted in the 2027 Budget.',
    '[
      {"step":1,"description":"National Treasury and DPME commission the Inclusive Growth Spending Review: define scope (social grants, EPWP, Jobs Fund, youth employment interventions), appoint technical review team, establish data access protocols with SASSA and UIF","timeline":"Q1–Q2 2025","responsible_party":"National Treasury / Department of Planning, Monitoring and Evaluation (DPME)"},
      {"step":2,"description":"SASSA and DSD publish consolidated administrative data on SRD grant recipient characteristics, labour market status, and grant utilisation patterns; link to SARS taxpayer register for income verification and Jobs Fund outcome data","timeline":"Q2–Q3 2025","responsible_party":"South African Social Security Agency (SASSA) / Department of Social Development (DSD) / SARS"},
      {"step":3,"description":"Spending Review technical report: model three scenarios for social protection budget reorientation (maintain status quo, partial employment activation, full basic income grant); publish for stakeholder consultation","timeline":"Q4 2025–Q1 2026","responsible_party":"National Treasury / DPME"},
      {"step":4,"description":"Resolve SRD grant legal framework by 2026/27 MTBPS: Cabinet decision on whether to retain as permanent means-tested grant, convert to employment-linked support, or phase toward basic income grant; embody in Social Assistance Act amendment or annual Appropriations","timeline":"MTBPS 2026 (October 2026)","responsible_party":"National Treasury / DSD / Cabinet Economic Cluster"}
    ]'::jsonb,
    '12 months for spending review (2025); SRD legal framework resolution: MTBPS 2026; Budget reorientation: 2027 forward',
    'No direct fiscal cost for review process (National Treasury operational budget); potential fiscal reorientation of R5–15 billion within existing social protection envelope, not new expenditure',
    'Social Assistance Act (13 of 2004) amendment may be required to formalise SRD grant or convert to permanent means-tested structure; Appropriation Acts cover annual allocations; no new spending authority required for the review itself',
    'The SRD grant currently operates under a Section 26 emergency provision in the Social Assistance Act — its conversion to a permanent programme would require a Section 76 amendment bill through NCOP. A basic income grant would require a broader constitutional revenue mandate analysis. The spending review can proceed administratively without legislation.',
    'Complex political economy. ANC social development caucus supports a basic income grant; DA supports time-limited means-tested grants with employment linkages; EFF supports unconditional BIG. GNU dynamics require negotiated consensus. COSATU supports BIG but not SRD-to-employment conversion. Evidence from the spending review is critical to building cross-party coalition for a workable reform.',
    'Brazil''s Bolsa Família (later Bolsa Família/Auxílio Brasil) combined cash transfers with education and health conditionalities, reducing poverty while building human capital — success required well-functioning complementary services. Mexico''s Programa Prospera evaluation (Parker and Todd 2017) found conditional transfers effective in reducing school dropout but insufficient alone to overcome labour market barriers in high-unemployment regions, directly relevant to SA''s context.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 7. ID 27: Land Bank Recapitalisation and Agricultural Finance Refocus ──────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    27,
    'DALRRD and National Treasury will complete the Land Bank''s post-crisis operational recovery: resolving the NPL portfolio, shifting the loan book toward emerging and Black smallholder farmers, and integrating blended finance instruments from USAID, IDC, and international DFIs. The Land Bank Amendment Act (2023) established the development mandate; implementation now requires cultural and credit assessment transformation within the Bank. Agricultural insurance procurement — a key risk mitigation tool for smallholder lending — will be tendered by 2025. The PC on Agriculture monitors progress quarterly. Success is measured by NPL ratio below 15%, emerging farmer loan book share exceeding 30% of new disbursements, and blended finance co-investment exceeding R2 billion by 2027.',
    '[
      {"step":1,"description":"Land Bank Board and management publish 3-year Operational Recovery Plan: NPL resolution strategy (write-offs, work-outs, and provisions); revised credit assessment criteria for emerging and Black farmers; staff training programme for development-oriented lending","timeline":"Q1 2025","responsible_party":"Land and Agricultural Development Bank (Land Bank) / DALRRD"},
      {"step":2,"description":"Tender and appoint agricultural insurance provider for smallholder and emerging farmer portfolio: index-based drought insurance, multi-peril crop insurance scheme; integrate with USAID Southern Africa Food Lab blended finance facility","timeline":"Q2–Q4 2025","responsible_party":"Land Bank / Department of Agriculture, Land Reform and Rural Development (DALRRD)"},
      {"step":3,"description":"Establish Blended Finance Co-Investment Facility with IDC, USAID, and DBSA: R2 billion first-loss tranche to catalyse commercial lending to emerging farmers; structure as a special purpose vehicle with Land Bank as originator","timeline":"Q3 2025–Q2 2026","responsible_party":"Land Bank / IDC / National Treasury"},
      {"step":4,"description":"Quarterly PC on Agriculture progress report: NPL ratio, emerging farmer disbursement share, blended finance co-investment, and DALRRD land reform programme disbursement linkages; AGSA annual audit with specific development mandate metrics","timeline":"Quarterly from Q1 2025","responsible_party":"Land Bank / DALRRD / Auditor-General of SA (AGSA)"}
    ]'::jsonb,
    'NPL resolution: 2025–2026; development mandate shift: 2025–2027; blended finance facility: 2025–2026; annual monitoring thereafter',
    'R10 billion recapitalisation already disbursed (2021–2024); blended finance facility: R500 million Land Bank first-loss contribution; agricultural insurance: R150 million per year subsidy (DALRRD budget)',
    'Land Bank Amendment Act 26 of 2023 (enacted); no further primary legislation required; SARB exemption status maintained under existing banking legislation',
    'The Land Bank Amendment Act (2023) is the primary legislative instrument — it clarifies the development mandate, confirms SARB exemption, and establishes the Blended Finance Investment Committee. All implementation can proceed under existing legislative authority. Future agricultural finance reforms (e.g., agri-mortgage reform for smallholder title) may require Deeds Registries Act amendments.',
    'Moderate feasibility. Recapitalisation is complete and board/management has been renewed. The development mandate shift faces internal resistance from legacy commercial banking culture within the institution. DALRRD-Land Bank coordination has historically been weak. National Treasury has conditionality leverage through recapitalisation agreement covenants.',
    'Brazil''s BNDES Pronaf programme successfully reoriented agricultural development finance toward smallholders, growing from 25% to 65% of disbursements over 10 years through graduated credit assessment criteria and technical advisory subsidies. India''s NABARD blended finance model (credit risk guarantees for cooperative agricultural banks) enabled smallholder finance at scale without direct state lending — a model for the proposed co-investment facility structure.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 8. ID 28: Carbon Tax Phase 2 Implementation and Revenue Use ───────────────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    28,
    'SARS, DMRE, and National Treasury will implement Phase 2 of the Carbon Tax Act from 1 January 2026, reducing allowances substantially to raise the effective carbon price above R400 per tonne by 2030, and establish a dedicated revenue recycling framework directing proceeds to the Just Energy Transition Investment Plan (JET-IP). Industrial sector exemption requests (steel, cement, chemicals) will be adjudicated through SARS and DMRE by mid-2025. The disconnect between carbon tax ambition and revenue use — flagged by the PC on Finance — will be resolved through a Carbon Revenue Hypothecation Bill or Ministerial Gazette framework. Success is measured by effective carbon price exceeding R400 per tonne, annual revenue of R28–35 billion by 2030, and JET-IP funded at R75 billion per year from combined carbon revenue and international partner contributions.',
    '[
      {"step":1,"description":"SARS and DMRE finalise Phase 2 allowance schedule: publish revised Carbon Tax Rate Schedule reducing process emissions and trade exposure allowances per Carbon Tax Act Section 6 and 7; adjudicate industrial sector carbon budget compliance exemption applications","timeline":"Q1–Q2 2025 (ahead of January 2026 Phase 2 commencement)","responsible_party":"SARS / Department of Mineral Resources and Energy (DMRE) / National Treasury"},
      {"step":2,"description":"National Treasury publish Carbon Tax Revenue Recycling Framework: allocate Phase 2 revenue across JET-IP priority areas (Eskom coal plant closure fund, renewable energy transition support for workers, SMME energy transition finance); gazette as Ministerial Determination under Carbon Tax Act","timeline":"Q2–Q3 2025","responsible_party":"National Treasury / DMRE / Presidential Climate Commission"},
      {"step":3,"description":"Phase 2 commencement January 2026: SARS operationalise revised tax return schedule, update e-filing system for new allowance calculations, publish guidance notes for large emitters; DMRE activate carbon budget monitoring system","timeline":"January 2026","responsible_party":"SARS / DMRE"},
      {"step":4,"description":"Annual carbon tax effectiveness review: monitor effective price per sector, revenue collection, JET-IP disbursement, and emissions trajectory relative to NDC targets; publish in MTBPS documentation and report to PC on Finance","timeline":"Annual (MTBPS, October each year)","responsible_party":"National Treasury / SARS / Presidential Climate Commission"}
    ]'::jsonb,
    'Phase 2 commencement: January 2026; full revenue ramp-up: 2026–2030; revenue recycling framework: mid-2025',
    'No direct fiscal cost; Phase 2 generates R28–35 billion per year in new revenue by 2030; JET-IP funding commitment: R75 billion per year (combined carbon tax, international partners, DFI contributions)',
    'Carbon Tax Act 15 of 2019 (Phase 2 provisions in force from 1 January 2026 by commencement notice); revenue hypothecation may require Carbon Tax Amendment Bill or Money Bills Amendment Procedure Act process; DMRE carbon budget regulations (secondary legislation)',
    'The Carbon Tax Act Phase 2 commencement notice is a Ministerial instrument — no further parliamentary process required. Revenue hypothecation through a dedicated JET-IP fund would require a Ministerial Determination under the Carbon Tax Act Section 21 or, if creating a statutory fund, a Money Bills process. Industrial exemption adjudication is an administrative process under Carbon Tax Act Section 7.',
    'Moderate-high feasibility for Phase 2 technical implementation; revenue recycling framework is the politically contested element. Minerals Council SA (mining sector) has lobbied for extended exemptions. Steel and cement sectors face competitiveness pressure. Presidential Climate Commission provides cross-sector governance legitimacy. GNU supports JET-IP as the fiscal anchor for climate investment.',
    'Canada''s federal carbon tax (CAD 65/tonne in 2024, rising to CAD 170/tonne by 2030) with revenue returned to households via carbon rebate cheques demonstrates credible revenue recycling reducing household political resistance. South Korea''s Emissions Trading Scheme (K-ETS, operational since 2015) phased in tighter caps and introduced auctioning in Phase 3 — a comparable trajectory to SA''s Phase 2 allowance reduction. UK''s Carbon Price Support mechanism (GBP 18/tonne, effectively GBP 50+ with ETS) drove coal exit from the electricity grid within 5 years — demonstrating the transformative impact of a credible price trajectory.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 9. ID 30: Municipal Fiscal Powers and Functions Amendment Bill ────────────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    30,
    'National Treasury, SALGA, and COGTA will drive the Municipal Fiscal Powers and Functions Amendment Bill (MFPFA) through Parliament and operationalise a national development charge methodology that standardises how municipalities levy fees on new property developments. The Bill removes discretionary waiver powers captured by politically connected developers and introduces mandatory bulk infrastructure reserve funds. Implementation requires SALGA technical assistance to all 8 metropolitan municipalities and 44 secondary cities for development charge model calibration and bylaw alignment. The AGSA will incorporate development charge compliance into its municipal audit framework. Success is measured by all metros adopting MFPFA-compliant methodologies within 12 months of enactment and a 20% improvement in municipal infrastructure coverage ratios in new development areas.',
    '[
      {"step":1,"description":"Parliamentary process: finalise MFPFA Bill through NCOP (Section 76 bill affecting local government financial competence); address SALGA and municipal stakeholder submissions; Presidential assent targeted for Q2 2025","timeline":"Q1–Q2 2025","responsible_party":"National Treasury / Parliament (NCOP) / SALGA"},
      {"step":2,"description":"National Treasury publish Development Charge Methodology Regulations under the enacted MFPFA: standardised infrastructure cost allocation model, mandatory reserve fund requirements, and transition timeline for existing municipality bylaws","timeline":"Q3 2025 (within 90 days of enactment)","responsible_party":"National Treasury / COGTA"},
      {"step":3,"description":"SALGA technical assistance programme: deploy urban finance advisors to the 8 metros and 44 secondary cities to recalibrate development charge bylaws, establish reserve funds, and train municipal finance officials; costing support through NT Local Government Budget Forum","timeline":"Q3 2025–Q2 2026","responsible_party":"SALGA / National Treasury / COGTA"},
      {"step":4,"description":"AGSA incorporate development charge compliance into annual municipal audit: track reserve fund establishment, bylaw alignment, and waiver abolition; report to PC on COGTA and the Financial and Fiscal Commission","timeline":"Annual (from 2025/26 audit cycle)","responsible_party":"Auditor-General of SA (AGSA) / Financial and Fiscal Commission (FFC)"}
    ]'::jsonb,
    'MFPFA enactment: Q2 2025; regulations: Q3 2025; municipal bylaw compliance: 12 months post-enactment (Q3 2026); AGSA audit integration: 2025/26 cycle',
    'National Treasury technical assistance: R50 million (existing LGTAS budget); SALGA programme: R30 million; municipalities fund reserve accounts from development charges (self-financing)',
    'Municipal Fiscal Powers and Functions Amendment Bill (tabled 2024, Section 76 — requires NCOP concurrence); no changes to Municipal Systems Act or Local Government: Municipal Finance Management Act (MFMA) required at this stage',
    'The MFPFA is a Section 76 bill affecting local government financial powers and requires full NCOP process including provincial legislature referral. The Bill was tabled in 2024 and is currently before the Portfolio Committee on Finance; National Treasury and SALGA both support it. Development charge methodology regulations will be issued by the Minister of Finance under the enacted MFPFA — no further parliamentary process after enactment.',
    'Strong National Treasury and SALGA alignment. Some large municipalities (Johannesburg, Tshwane) resist curtailing waiver discretion. Property developers (SAPOA) support standardised methodology as it increases planning certainty. DA and ANC both support the reform as fiscally sound; EFF supports revenue transparency provisions. The primary political risk is municipal autonomy objections in NCOP.',
    'Melbourne, Australia eliminated discretionary development contribution waivers in 2010 and introduced a standardised infrastructure contributions framework, generating AUD 2.5 billion in reserve fund accumulation within 5 years and reducing infrastructure maintenance backlogs by 35%. Singapore''s Development Charge system — a transparent cost-based levy updated quarterly — is widely credited with enabling Singapore''s infrastructure investment programme without fiscal stress on the city-state''s budget.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 10. ID 31: Cooperative Banks Development and Township Financial Inclusion ──
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    31,
    'The SARB, CBDA, and National Treasury will amend the Cooperative Banks Act to create a tiered licensing framework with lower capital thresholds for community-level savings groups, establish a SARB supervisory ring-fence for cooperatives below R50 million in assets, and build an IDC-backed first-loss facility to catalyse township CFI growth. Integration with the Post Bank''s township payments infrastructure will extend digital financial access to underserved communities. The programme will target scaling total CFI assets from under R500 million to R5 billion by 2030. Success is measured by 100+ registered CFIs, 500,000 new township banking accounts, and a 25% reduction in township unbanked rate among working-age adults.',
    '[
      {"step":1,"description":"SARB and National Treasury publish Cooperative Banks Act Amendment Bill: introduce three-tier licensing framework (community savings groups < R10m; cooperative banks R10–50m; full cooperative banks > R50m) with proportionate capital and governance requirements for each tier","timeline":"Q2 2025 (bill tabling)","responsible_party":"South African Reserve Bank / National Treasury / CBDA"},
      {"step":2,"description":"Establish IDC First-Loss Facility for CFI development: R500 million facility providing subordinated capital to qualifying CFIs for on-lending in township and rural areas; CBDA to manage accreditation and oversight","timeline":"Q3 2025–Q1 2026","responsible_party":"Industrial Development Corporation (IDC) / CBDA / National Treasury"},
      {"step":3,"description":"Post Bank integration: CBDA and Post Bank establish shared ATM and digital payments access agreement for CFI members; deploy QR-payment and mobile wallet interoperability for CFI members using Post Bank infrastructure","timeline":"Q4 2025–Q2 2026","responsible_party":"Post Bank / CBDA / SARB"},
      {"step":4,"description":"CBDA annual capacity programme: deploy financial management training, IT system grants, and governance advisory to 40+ existing CFIs; recruit and onboard 20 new CFI applicants per year through community outreach in KZN and Gauteng townships","timeline":"Annual from Q1 2025","responsible_party":"CBDA / FSD Africa / UNCDF"}
    ]'::jsonb,
    'Act amendment tabling: Q2 2025; IDC facility: 2025–2026; Post Bank integration: 2025–2026; 100+ CFIs target: 2030',
    'CBDA operational budget: R80 million per year (DTIC/NT appropriation); IDC first-loss facility: R500 million (IDC balance sheet); Post Bank integration: R30 million (shared infrastructure cost)',
    'Cooperative Banks Act 40 of 2007 amendment (required for tiered licensing); no changes to Banks Act (1990) required for ring-fenced tier',
    'The Cooperative Banks Act amendment will be a Section 75 bill (no provincial mandate implications). The IDC facility can be established under IDC''s existing statutory mandate. SARB ring-fencing for small CFIs requires a Ministerial Determination under the Banks Act — no parliamentary process. The amendment bill was under development by SARB and National Treasury in 2024.',
    'Moderate feasibility. CBDA has limited institutional capacity — the IDC and SARB partnerships are critical to programme success. Commercial banks (BASA) are ambivalent but not opposed. FSD Africa and UNCDF bring international development finance expertise. The 40-year stokvel culture creates a natural pipeline for CFI formalisation.',
    'Kenya''s cooperative SACCO movement (Savings and Credit Cooperative Organisations) grew from 3,000 to over 14,000 registered SACCOs between 2008 and 2022 under a tiered regulatory framework, mobilising KES 800 billion in assets and providing credit to 6 million members — the global benchmark for cooperative banking at scale. Rwanda''s Umurenge SACCO programme (community-level savings cooperatives in every sector) achieved 70% financial inclusion among adults within 5 years through state-supported infrastructure and supervisory capacity.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 11. ID 32: GEPF Infrastructure Investment Mandate ─────────────────────────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    32,
    'National Treasury, the GEPF Board, and the PIC will formalise an infrastructure investment sub-mandate directing a defined portion of GEPF''s R2.4 trillion portfolio to domestic infrastructure via a ring-fenced blended finance vehicle that protects beneficiary actuarial returns while channelling patient capital to the R1 trillion infrastructure programme. The PIC''s governance recovery post-Zondo Commission provides the political legitimacy for a renewed developmental mandate — but ring-fencing and independent valuation of infrastructure assets are non-negotiable safeguards. The DBSA will serve as co-investment partner and project preparation agent. Success is measured by R50–120 billion directed to domestic infrastructure by 2027 and actuarial return targets maintained.',
    '[
      {"step":1,"description":"GEPF Board and PIC Investment Committee adopt an amended Infrastructure Investment Policy Statement: define infrastructure sub-mandate allocation (proposed 5–8% of AUM, i.e. R120–190 billion over 5 years); establish independent infrastructure valuation committee and reporting framework","timeline":"Q1–Q2 2025","responsible_party":"Government Employees Pension Fund (GEPF) / Public Investment Corporation (PIC) / National Treasury"},
      {"step":2,"description":"Establish Infrastructure Blended Finance SPV: PIC contributes anchor capital; DBSA and IDC provide co-investment and project preparation capacity; independent board with fiduciary mandate and quarterly beneficiary reporting","timeline":"Q2–Q3 2025","responsible_party":"PIC / DBSA / IDC / National Treasury"},
      {"step":3,"description":"First infrastructure investment tranche: allocate R50 billion across NTCSA energy transmission, Transnet logistics rehabilitation, and social infrastructure (hospitals, schools); DBSA provides project preparation and blended risk structure","timeline":"Q3 2025–Q4 2026","responsible_party":"PIC / DBSA / NTCSA / Transnet"},
      {"step":4,"description":"Annual Parliamentary briefing: GEPF and PIC report to PC on Finance on infrastructure sub-mandate performance, actuarial return vs. benchmark, project deployment, and governance compliance; AGSA audit of SPV","timeline":"Annual (Q1 each year)","responsible_party":"GEPF / PIC / AGSA / PC on Finance"}
    ]'::jsonb,
    'Investment policy amendment: Q1 2025; SPV establishment: Q2–Q3 2025; first R50 billion tranche: 2025–2026; R120 billion target: 2027',
    'No direct fiscal cost; GEPF/PIC capital deployment from existing AUM; DBSA co-investment: R10 billion (DBSA balance sheet); SPV establishment cost: R20 million',
    'GEPF Amendment Act and PIC Act (potential minor amendments to investment mandate provisions); no new primary legislation required if sub-mandate is within existing PIC Act Section 4 developmental investment scope',
    'The PIC Act Section 4 permits developmental investments subject to fiduciary duty. The infrastructure sub-mandate can be formalised through a GEPF Board resolution and PIC Investment Policy Statement amendment without new legislation. If the SPV structure requires special statutory protections for beneficiaries, a GEPF Amendment Act amendment may be needed — this can be bundled into the annual Money Bills process.',
    'High political support — GNU has made infrastructure investment a headline economic priority and PIC''s post-Zondo governance restoration creates the mandate for renewed developmental role. COSATU (GEPF beneficiary representative) is supportive if fiduciary safeguards are credible. National Treasury and GEPF Board alignment is the critical condition — both are currently favourable.',
    'Canada''s Ontario Teachers'' Pension Plan (OTPP) infrastructure programme allocates 17% of AUM to infrastructure assets globally and domestically, delivering returns 2–3pp above listed equity benchmarks over 20 years — demonstrating that pension fund infrastructure investment is fully compatible with fiduciary duty. Australia''s Future Fund infrastructure mandate (15% of AUM in infrastructure and timberland) is a government pension fund precedent for domestic infrastructure investment without political interference. The Dutch ABP pension fund''s sustainable infrastructure mandate (EUR 30 billion) demonstrates the governance model at scale.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 12. ID 33: Financial Matters Amendment — Insurance Sector and Microinsurance ─
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    33,
    'The FSCA and Prudential Authority will intensify enforcement of the Policyholder Protection Rules (PPR) targeting debit order abuse against SASSA grant recipients, mandate expense ratio disclosure for microinsurance products, and extend the microinsurance licence category to parametric agricultural products for smallholders. No new primary legislation is required — supervisory intensity is the primary lever under the existing Twin Peaks framework. The NAEDO debit order system will be reformed in coordination with PASA to eliminate unauthorised deductions from social grant payment accounts. Success is measured by PPR complaints resolved within 30 days for at least 85% of cases, debit order abuse rates below 5% of grant-recipient accounts, and 15%+ microinsurance market penetration among low-income households by 2027.',
    '[
      {"step":1,"description":"FSCA publish Conduct Standard for microinsurance expense ratios: mandate disclosure of expense ratio as a percentage of premium in all policy documents and point-of-sale communication; set industry expense ratio benchmark of 45% for basic funeral products","timeline":"Q1–Q2 2025","responsible_party":"Financial Sector Conduct Authority (FSCA)"},
      {"step":2,"description":"PASA and SARB reform NAEDO debit order system: implement mandatory authentication for deductions from SASSA-designated accounts; FSCA enforcement action against insurers with debit order abuse rates above threshold","timeline":"Q2–Q3 2025","responsible_party":"SARB / PASA / FSCA"},
      {"step":3,"description":"FSCA issue Guidance Note for parametric agricultural microinsurance: define index trigger criteria, payment timelines, and disclosure standards for crop and livestock products; pilot with 2 licensed microinsurers in Eastern Cape and KZN smallholder areas","timeline":"Q3 2025–Q2 2026","responsible_party":"FSCA / DALRRD / National Treasury"},
      {"step":4,"description":"Annual FSCA Market Conduct Report: publish microinsurance market penetration data, PPR complaint resolution rates, debit order abuse rates, and expense ratio trends; report to PC on Finance Standing Committee","timeline":"Annual (Q2 each year)","responsible_party":"FSCA / Prudential Authority (SARB)"}
    ]'::jsonb,
    '12 months for core regulatory instruments (2025); parametric pilot: 2025–2026; 15% penetration target: 2027',
    'FSCA operational budget (existing): R50 million for enforcement intensification; PASA NAEDO reform: R80 million (shared industry cost); parametric pilot: R15 million (FSCA/DALRRD)',
    'Insurance Act 18 of 2017 (operative, no amendment required); Financial Sector Regulation Act 9 of 2017 (Twin Peaks framework in force); PPR enforcement under existing Conduct Standards authority; NAEDO reform via PASA rules (no parliamentary process)',
    'All implementation actions are within existing FSCA and Prudential Authority supervisory powers under the Financial Sector Regulation Act and Insurance Act. The PPR is a delegated legislative instrument issued by the FSCA — amendments require only FSCA board resolution and Ministerial concurrence, not parliamentary process. NAEDO reform is a PASA payment system rule change under the National Payment System Act.',
    'Strong regulatory alignment between FSCA and Prudential Authority under Twin Peaks. The debit order abuse issue has parliamentary attention (PC on Finance BRRRs, NCOP Finance Committee). Burial society and funeral industry lobby is significant but the FSCA has clear mandate to protect policyholders. Parametric agricultural insurance is a new product category — insurers supportive if regulatory framework is clear.',
    'India''s Pradhan Mantri Fasal Bima Yojana (PMFBY) parametric crop insurance scheme (2016) scaled from 25 million to 56 million smallholder farmers within 4 years through standardised index triggers, government premium subsidy, and mandatory bank account linking — the model for SA''s parametric extension. Kenya''s microinsurance regulatory sandbox (2019) enabled 12 new product launches within 18 months by providing regulatory clarity within a defined test environment, growing mobile-based life insurance penetration from 4% to 22% among adults.'
) ON CONFLICT (idea_id) DO NOTHING;

-- ── 13. ID 34: Intergovernmental Fiscal Framework Review — Equitable Share ──────
INSERT INTO implementation_plans (
    idea_id,
    roadmap_summary,
    implementation_steps,
    estimated_timeline,
    estimated_cost,
    required_legislation,
    draft_legislation_notes,
    political_feasibility_notes,
    international_precedents
) VALUES (
    34,
    'National Treasury, working through the Financial and Fiscal Commission (FFC) and the Budget Council, will complete a comprehensive review of the provincial equitable share formula in time for the 2026 Budget, revising the health component to align with actual disease burden (benefiting KwaZulu-Natal and Eastern Cape) and introducing a ring-fenced infrastructure maintenance grant to prevent provincial maintenance budget raiding. The 2002 formula''s education component will be updated to reflect the cost of quality education delivery rather than enrolment counts alone. A local government equitable share reform will address the growing service delivery obligations of secondary cities not yet reflected in the formula. Success is measured by the revised formula adopted for the 2026/27 MTEF and all provinces receiving a dedicated maintenance allocation.',
    '[
      {"step":1,"description":"Financial and Fiscal Commission (FFC) commission formula review: publish technical paper on provincial equitable share formula — health component (TB/HIV burden vs. population count), education component (quality-adjusted cost), and infrastructure maintenance adequacy; engage provincial Finance MECs through Budget Council","timeline":"Q1–Q2 2025","responsible_party":"Financial and Fiscal Commission (FFC) / National Treasury"},
      {"step":2,"description":"National Treasury and FFC publish equitable share formula methodology options paper: model fiscal impact of three formula scenarios (status quo, health reweighting, full quality-adjusted revision) across all 9 provinces; present to Budget Council for political negotiation","timeline":"Q3–Q4 2025","responsible_party":"National Treasury Budget Office / FFC"},
      {"step":3,"description":"Introduce ring-fenced infrastructure maintenance conditional grant in 2026 Budget: provincial allocations based on infrastructure condition indices (DPWI); minimum 1% of asset replacement value; compliance monitored by DPWI and AGSA","timeline":"2026 Budget (February 2026)","responsible_party":"National Treasury / Department of Public Works and Infrastructure (DPWI)"},
      {"step":4,"description":"Revised equitable share formula gazetted in 2026 Division of Revenue Bill: incorporate health burden reweighting and quality-adjusted education costs; update local government formula to reflect secondary city service delivery obligations; Parliamentary process through NCOP","timeline":"Division of Revenue Bill 2026 (February–April 2026)","responsible_party":"National Treasury / Parliament (NCOP) / FFC"}
    ]'::jsonb,
    'FFC review: Q1–Q4 2025; 2026 Budget adoption: February 2026; revised formula operative: 2026/27 MTEF',
    'No direct fiscal cost for formula review (FFC and NT operational budgets); infrastructure maintenance grant: R8–12 billion per year (reallocation within existing provincial equitable share, not new spending)',
    'Division of Revenue Act (annual — formula revision embodied in DoRA); Intergovernmental Fiscal Relations Act 97 of 1997 (governs consultation process — no amendment required); no new primary legislation needed',
    'The equitable share formula is embodied in the annual Division of Revenue Act, which is a Money Bill (Section 77 of the Constitution). Formula changes are implemented through the annual budget process without separate legislative amendment. The FFC''s formula review is advisory; National Treasury makes the final determination in consultation with the Budget Council (provincial Finance MECs). Parliamentary process is through the usual Money Bills procedure — no NCOP concurrence required beyond standard DoRA process.',
    'High feasibility for maintenance grant (widely supported); formula revision is politically contested because reweighting health benefits KZN and EC at cost to wealthier provinces (WC, GP). National Treasury has strong institutional capacity for technical reform. ANC-governed provinces KZN and EC benefit and support; DA-governed WC resists health reweighting. The MTBPS 2025 commitment to completing the review by 2026 Budget creates political accountability.',
    'Australia''s Goods and Services Tax (GST) distribution formula, managed by the Commonwealth Grants Commission, is updated every 5 years based on expenditure need and revenue capacity relativities — considered the global best practice in equitable share formula design. Canada''s Federal-Provincial Equalization Programme uses a fiscal capacity formula updated annually to reflect economic relativities across 10 provinces — the comparable inter-governmental transfer framework. Germany''s Länderfinanzausgleich (fiscal equalization) incorporates health cost differentials in its allocation formula, providing the technical precedent for SA''s disease-burden health component revision.'
) ON CONFLICT (idea_id) DO NOTHING;

COMMIT;
