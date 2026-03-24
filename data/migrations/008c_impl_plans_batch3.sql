-- Migration 008c: Implementation Plans — Batch 3 (IDs 35–49)
-- Energy sector reform: IRP update, nuclear, NERSA reform, solar water heaters,
-- petroleum development, fuel deregulation, mining rehabilitation, gas infrastructure,
-- critical minerals, and grid expansion.
-- Format mirrors 004_implementation_plans.sql

BEGIN;

-- ── ID 35: Integrated Resource Plan (IRP) 2024 Update ────────────────────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    35,
    'The IRP 2024 update revises South Africa''s long-term electricity mix to integrate accelerated renewable energy procurement, a revised coal decommissioning schedule aligned with Eskom''s generation fleet condition assessments, and a confirmed 2,500 MW nuclear new-build allocation. The DMRE leads the process in consultation with NERSA, National Treasury, and Eskom, with a statutory public participation process required under the Electricity Regulation Act. An updated load forecast is the critical input — the IRP 2019 overestimated industrial demand — and revised projections must account for embedded generation growth, efficiency gains, and structural economic shifts. The IRP underpins all subsequent REIPPPP procurement decisions and should be gazetted no later than Q3 2025 to unblock Rounds 7–9.',
    '[
      {"step":1,"description":"Commission updated demand forecast study incorporating embedded generation uptake, industrial efficiency trends, and economic growth scenarios; peer-review by CSIR Energy Centre","timeline":"Q1–Q2 2025","responsible_party":"DMRE / CSIR Energy Centre"},
      {"step":2,"description":"Publish IRP 2024 draft for public comment in the Government Gazette with a 60-day comment period; convene regional public hearings in all nine provinces","timeline":"Q2 2025","responsible_party":"DMRE"},
      {"step":3,"description":"Integrate comments and revise draft; obtain Cabinet approval at the Economic Cluster Cabinet committee","timeline":"Q3 2025","responsible_party":"DMRE / Presidency / Cabinet Economic Cluster"},
      {"step":4,"description":"Publish final IRP 2024 in the Government Gazette; issue procurement schedules for REIPPPP Rounds 7–9 and the gas-to-power programme based on updated capacity requirements","timeline":"Q3 2025","responsible_party":"DMRE / NERSA / IPP Office"},
      {"step":5,"description":"Initiate rolling IRP review mechanism: annual monitoring report to Parliament on capacity additions, decommissioning milestones, and demand deviations, with a mandatory five-year full revision cycle","timeline":"Annual from Q1 2026","responsible_party":"DMRE / Portfolio Committee on Mineral Resources and Energy"}
    ]'::jsonb,
    '12 months from initiation to gazettal (Q1–Q3 2025); mandatory five-year full revision thereafter',
    'R8–12 million for demand study, modelling, and public participation; absorbed within DMRE operational budget',
    'No new primary legislation required. Electricity Regulation Act 4 of 2006 (Section 34) provides the statutory basis for ministerial IRP determinations. NERSA concurrence required on tariff implications.',
    'The Minister of Mineral Resources and Energy issues the IRP as a Section 34 determination under the ERA. NERSA must concur on tariff-related elements. No parliamentary vote required; the Portfolio Committee on Mineral Resources and Energy receives the IRP for oversight briefing.',
    'Strong consensus within the economic cluster on the need for an updated IRP; the 2019 IRP''s coal assumptions are widely acknowledged as outdated. Industry (SAPVIA, SAWEA, Minerals Council) and environmental groups broadly support the update. Political tensions exist around coal decommissioning timelines and NUM/AMCU labour implications.',
    'Germany''s Energiewende successive energy plans provide a model for structured revision cycles with parliamentary oversight. Australia''s Integrated System Plan (AEMO) uses annual reviews with open-data demand modelling SA could replicate. IEA World Energy Outlook scenario methodology informed CSIR''s modelling approach for prior IRP iterations.'
);

-- ── ID 36: Koeberg Nuclear Power Plant Long-Term Operation Extension ──────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    36,
    'The Koeberg long-term operation (LTO) extension secures 1,860 MW of baseload zero-carbon generation through at least 2044, providing critical system stability during the transition to renewables. The NNR granted the safety case for LTO in 2023 following Eskom''s Periodic Safety Review submission; steam generator replacement for both units was completed in 2023–24. Implementation now focuses on the continuous ageing management programme, regulatory reporting obligations, workforce retention, and spent fuel management for the extended operating period. This is the lowest-cost firm low-carbon generation option available to South Africa in the near term, with a projected LCOE below R1.20/kWh.',
    '[
      {"step":1,"description":"Complete Unit 1 and Unit 2 steam generator replacement and submit Periodic Safety Review (PSR) documentation to the NNR for the extended operating period to 2044","timeline":"2023–2024 (substantially complete)","responsible_party":"Eskom Nuclear / NNR"},
      {"step":2,"description":"Implement the Ageing Management Programme (AMP): annual inspections of reactor pressure vessels, primary circuit components, and civil structures; quarterly reporting to NNR as required by operating licence conditions","timeline":"Ongoing annually through 2044","responsible_party":"Eskom Nuclear (Koeberg) / NNR Inspectorate"},
      {"step":3,"description":"Negotiate and sign the long-term fuel supply agreement with a qualified nuclear fuel supplier (Framatome/Westinghouse/TVEL) covering enrichment, fabrication, and delivery for 20 years of extended operations","timeline":"Q1–Q3 2025","responsible_party":"Eskom / DMRE"},
      {"step":4,"description":"Finalise the spent fuel management plan: dry cask storage expansion at Koeberg Interim Spent Fuel Storage Facility to accommodate additional fuel assemblies through 2044","timeline":"Q2 2025–Q4 2026","responsible_party":"Eskom Nuclear / NNR / DMRE"},
      {"step":5,"description":"Workforce retention programme: succession planning for 500+ skilled nuclear operators and engineers; NNR-accredited training and bursary scheme for nuclear engineering graduates at Wits and UCT","timeline":"Q3 2025–Q4 2026","responsible_party":"Eskom Human Resources / NNR / NSTF"}
    ]'::jsonb,
    'NNR LTO approval granted 2023; ongoing ageing management through 2044; fuel supply agreement Q3 2025; spent fuel facility expansion Q4 2026',
    'Steam generator replacement: R25 billion (Eskom capital, substantially complete). Ongoing LTO ageing management: ~R800 million/year. Spent fuel storage expansion: ~R2 billion (2025–2026). Total LTO programme cost ~R43 billion to 2044 vs. R150–200 billion for equivalent new-build replacement.',
    'No new primary legislation required. NNR Act 47 of 1999 and Nuclear Energy Act 46 of 1999 provide the complete framework. The NNR operating licence constitutes the operative regulatory instrument.',
    'The NNR issued the safety authorisation following Eskom''s PSR submission in 2023. The operating licence extension is governed by the NNR Act and requires no legislative amendment. A ministerial Section 34 determination under the ERA is advisable to entrench LTO in the IRP framework.',
    'Broad support: Koeberg is the only operating nuclear station and LTO avoids a 1,860 MW capacity gap during a grid crisis. ANC, DA, and most GNU parties support it on energy security grounds. Environmental NGOs (Earthlife Africa, groundWork) maintain principled opposition but have not challenged the LTO licence in court.',
    'France''s EDF has operated LTO programmes across its 56-reactor fleet, extending plant lives to 60 years — the global model. The US NRC has granted 20-year LTO extensions to over 80 reactors. Finland''s Loviisa NPP operates under a similar safety case framework and provides a directly applicable small-fleet precedent.'
);

-- ── ID 37: Nuclear Build Programme ───────────────────────────────────────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    37,
    'The IRP 2023/24 allocates 2,500 MW of new nuclear capacity as firm baseload to complement variable renewables, reversing the post-2017 moratorium following the collapse of the Zuma-era deal. DMRE is leading a competitive procurement process through the NNEECC with technology options including large light-water reactors (AP1000, EPR, VVER, HPR1000) and small modular reactors; a formal RFI process is underway. Site preparation work continues at Thyspunt (Eastern Cape) and desktop reviews at Bantamsklip (Western Cape). A government financial guarantee of R100–200 billion must be accommodated within the fiscal framework and represents the single largest constraint on programme viability.',
    '[
      {"step":1,"description":"Complete the RFI process and publish a formal Request for Proposals for the 2,500 MW nuclear new-build: technology requirements, financing structures, local content obligations (40% by value target), and skills transfer provisions","timeline":"Q2–Q4 2025","responsible_party":"DMRE / NNEECC / National Treasury"},
      {"step":2,"description":"Finalise site selection between Thyspunt and Bantamsklip: environmental impact assessment under NEMA, NNR site characterisation approval, and National Ports Authority assessment for marine access","timeline":"Q1–Q4 2026","responsible_party":"DMRE / NNR / DFFE / National Ports Authority"},
      {"step":3,"description":"Negotiate the intergovernmental agreement with the selected vendor country (France, Russia, China, USA, or South Korea) establishing technology transfer, financing terms, and the government-to-government guarantee framework","timeline":"2025–2027","responsible_party":"DMRE / National Treasury / DIRCO"},
      {"step":4,"description":"Obtain financial close: structure the funding package (DFI debt, export credit agency support, government guarantee, equity) and have National Treasury publish the contingent liability note in the MTEF","timeline":"2027–2029","responsible_party":"National Treasury / DBSA / IPP Office / DMRE"},
      {"step":5,"description":"NNR construction licence application: submit and obtain construction authorisation under the NNR Act for the selected site and technology","timeline":"2028–2031","responsible_party":"Project SPV / Eskom / NNR"},
      {"step":6,"description":"First-concrete milestone and parliamentary oversight report to Portfolio Committee on Mineral Resources and Energy on programme cost and schedule","timeline":"2031–2032","responsible_party":"DMRE / Eskom / NNR"}
    ]'::jsonb,
    'RFP Q4 2025; site selection 2026; IGA signed 2027; financial close 2029; construction licence 2031; first power ~2035–2038',
    'R150–250 billion total capital cost (technology-dependent); government guarantee R100–200 billion; DBSA and industrial development finance may cover 20–30% of debt component',
    'No new primary legislation required for procurement. Nuclear Energy Act 46 of 1999 and NNR Act 47 of 1999 provide the framework. A ministerial Section 34 determination under the ERA formalises procurement. An amendment to State Finance Guarantee legislation may be required to accommodate the scale of the contingent liability.',
    'A Section 34 ministerial determination under the ERA will formally trigger the procurement process. NERSA must concur on tariff implications. For an IPP structure, the Nuclear Energy Act would need amendment to allow private generation licensees. The NNR Act requires no amendment for the procurement phase.',
    'Nuclear new-build historically divides the ANC (pro-nuclear industrial wing vs. fiscal conservatives). The Zuma-era scandal creates political sensitivity. DA broadly supportive if fiscally sound. GNU dynamics make a R150B+ government guarantee politically difficult without National Treasury concurrence. Labour (NUM, COSATU) supports on job-creation grounds.',
    'UAE''s Barakah NPP (4×APR1400) demonstrates a government-to-government procurement model in a non-OECD country — directly relevant. UK''s Hinkley Point C provides a cautionary tale on cost overruns. South Korea''s domestic nuclear programme (24 operating units, <$3,000/kW) is the global benchmark for cost control.'
);

-- ── ID 38: NERSA Municipal Tariff Rationalization and Cost-Reflective Pricing ─────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    38,
    'Municipal electricity distributors — responsible for approximately 40% of South Africa''s electricity distribution — operate with widely diverging tariff structures that cross-subsidise from industrial to residential consumers and suppress demand-side investment. NERSA''s Municipal Tariff Guidelines set a framework but enforcement is limited, with many municipalities filing non-compliant tariffs or failing to file altogether. The reform establishes NERSA''s binding authority over municipal electricity tariffs, mandates cost-reflective pricing aligned with the national tariff framework, and introduces a three-year rationalisation path for municipalities with unsustainable cross-subsidy structures. Coordination with the Electricity Distribution Industry Restructuring process managed by COGTA is essential.',
    '[
      {"step":1,"description":"Amend Electricity Regulation Act Section 15 to give NERSA explicit binding authority to approve, reject, or cap municipal electricity tariffs; eliminate the current advisory-only guideline regime","timeline":"Q1–Q3 2026","responsible_party":"DMRE / NERSA / COGTA / Parliament"},
      {"step":2,"description":"Publish NERSA Municipal Tariff Rationalisation Framework: benchmarking methodology, cost-of-supply study requirements, maximum cross-subsidy levels, and three-year phased compliance timeline","timeline":"Q1 2026","responsible_party":"NERSA / COGTA"},
      {"step":3,"description":"Conduct cost-of-supply studies for all 257 licensed municipal distributors; NERSA to fund studies for Category B and C municipalities through a levy on licensees","timeline":"Q2 2025–Q4 2026","responsible_party":"NERSA / Municipal Distributors"},
      {"step":4,"description":"Implement a Municipal Electricity Audit programme: annual NERSA inspections of metering infrastructure, non-technical loss rates, and tariff compliance; publish results in an Annual Municipal Tariff Report","timeline":"Annual from Q1 2026","responsible_party":"NERSA / COGTA"},
      {"step":5,"description":"Establish a Municipal Distribution Infrastructure Grant through National Treasury to fund metering upgrades and loss-reduction investments in municipalities transitioning to cost-reflective tariffs","timeline":"Q3 2025–Q1 2026 (budget process)","responsible_party":"National Treasury / NERSA / COGTA"}
    ]'::jsonb,
    '18 months for legislative amendment and framework (Q1 2025–Q3 2026); three-year rationalisation path for municipalities (2026–2029)',
    'NERSA cost-of-supply studies: ~R150 million over two years (funded by licensee levy). Municipal Distribution Infrastructure Grant: R2–5 billion over MTEF. NERSA capacity expansion for audit function: R80 million/year.',
    'Amendment to Electricity Regulation Act 4 of 2006 (Section 15) converting NERSA municipal tariff guidelines from advisory to binding. The ERA Amendment Act (2024) may require a targeted further amendment to close the binding authority gap on municipal tariffs.',
    'The ERA Amendment Act (2024) expanded NERSA''s mandate but did not fully resolve the binding authority question on municipal tariffs. A further targeted amendment to Section 15, or a regulation under Section 35, is required. The Electricity Distribution Industry Restructuring process must be coordinated to avoid conflicting distribution licensing regimes.',
    'Municipal tariff reform faces resistance from metro governments (City of Cape Town, Ekurhuleni, eThekwini) who derive cross-subsidy revenue from industrial customers. ANC-controlled municipalities are ambivalent. National Treasury supports reform for fiscal sustainability. The COGTA Section 154 intervention mechanism is the backstop for non-compliant municipalities but is politically costly to invoke.',
    'The UK''s Ofgem RIIO distribution price control framework is the benchmark for binding regulatory tariff determination with cost-of-service methodology. Australia''s AEMC distribution determination framework provides a comparable model for cost-reflective pricing transition. Botswana''s BPC single national tariff framework offers an African precedent for rationalisation at scale.'
);

-- ── ID 39: Integrated Energy Plan Update — Gas and Energy Diversification ─────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    39,
    'South Africa''s Integrated Energy Plan — last published in 2016 — predates the LNG import market development, the Orange Basin offshore gas discoveries (Brulpadda/Luiperd), the hydrogen economy strategy, and the current energy crisis. An updated IEP must integrate cross-sector energy planning (electricity, liquid fuels, gas, hydrogen, and efficiency) and provide the long-term demand and supply scenarios underpinning the Gas Master Plan, IRP 2024, and hydrogen export strategy. The DMRE leads in consultation with NERSA, Stats SA, the Gas Task Team, and the Economic Reconstruction and Recovery Plan cluster. The IEP is the strategic foundation without which other energy reforms lack coherence.',
    '[
      {"step":1,"description":"Commission multi-scenario energy demand modelling for the IEP 2024 update covering electricity, gas, liquid fuels, hydrogen, and energy efficiency in industry, transport, and households through 2050","timeline":"Q1–Q3 2025","responsible_party":"DMRE / CSIR Energy Centre / Stats SA"},
      {"step":2,"description":"Convene the National Energy Planning Taskforce: DMRE, NERSA, National Treasury, DSI (hydrogen), DFFE (emissions), Eskom, and Transnet to coordinate cross-sector planning assumptions","timeline":"Q1 2025 (ongoing)","responsible_party":"DMRE / Presidency Economic Cluster"},
      {"step":3,"description":"Publish draft IEP 2024 for 60-day public comment; hold industry workshops on gas-to-power, LNG imports, and hydrogen export infrastructure assumptions","timeline":"Q3 2025","responsible_party":"DMRE"},
      {"step":4,"description":"Integrate gas diversification scenarios: LNG import terminals at Richards Bay, Coega, and Saldanha Bay; domestic gas development timelines; ROMPCO pipeline capacity expansions from Mozambique","timeline":"Q2–Q4 2025","responsible_party":"DMRE / Transnet Pipelines / iGas"},
      {"step":5,"description":"Cabinet approval of IEP 2024 and publication in the Government Gazette; issue updated Gas Utilisation Master Plan based on IEP scenarios","timeline":"Q4 2025","responsible_party":"DMRE / Cabinet Economic Cluster"},
      {"step":6,"description":"Establish a biennial IEP monitoring process with a cross-departmental energy data committee (DMRE, Stats SA, NERSA) to track energy balances and scenario deviations","timeline":"Q1 2026 onwards","responsible_party":"DMRE / Stats SA / NERSA"}
    ]'::jsonb,
    'IEP 2024 publication Q4 2025; Gas Utilisation Master Plan update Q1 2026; biennial review cycle from 2027',
    'IEP modelling and public participation: R15–20 million within DMRE operational budget; Gas Utilisation Master Plan update: R5–8 million; cross-departmental data committee: minimal marginal cost',
    'No new legislation required. The IEP is a policy document issued by the Minister of Mineral Resources and Energy. The Gas Act 48 of 2001 and Petroleum Pipelines Act 60 of 2003 provide the regulatory basis for Gas Master Plan elements. ERA Amendment Act (2024) cross-references the IEP for electricity planning purposes.',
    'The IEP is a ministerial policy document requiring Cabinet approval but no parliamentary vote. NERSA must be consulted on tariff implications. The 2016 IEP is universally acknowledged as outdated; no significant political opposition to the update. Tensions exist around the gas vs. renewables balance and LNG import dependency. Coal stakeholders (NUM, Minerals Council) seek accommodation of a longer coal transition in IEP scenarios.',
    'Germany''s National Energy and Climate Plan provides a template for cross-sector integrated planning with mandatory five-year revision cycles. The UK''s Energy Security Strategy (2022) demonstrates how an integrated plan can address supply diversification across electricity, gas, and hydrogen. Kenya''s National Energy Policy (2018) provides a developing-economy model for integrating off-grid and gas diversification in a single framework.'
);

-- ── ID 40: NERSA Independence and Regulatory Authority Reform ─────────────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    40,
    'NERSA''s effective regulatory independence is constrained by Parliamentary budget control, ministerial appointment of commissioners, and an outdated regulatory methodology ill-suited to a competitive multi-generator market. The ERA Amendment Act (2024) dramatically expanded NERSA''s mandate — third-party grid access, licensing of dozens of new generators, wholesale market oversight — without commensurate independence reforms. The reform package proposes full budget autonomy funded through licensee fees, judicial appointment of commissioners to fixed non-renewable terms, a dedicated competitive market regulation division, and a Regulatory Asset Base methodology for networks replacing the current MYPD framework. Independent, credible regulation is the foundational condition for private investment in generation and grid infrastructure.',
    '[
      {"step":1,"description":"Publish the NERSA Regulatory Independence White Paper: proposals on budget autonomy, appointment reform, and regulatory methodology; commission an independent regulatory review benchmarking SA against emerging market best practice","timeline":"Q2 2025","responsible_party":"DMRE / NERSA / National Treasury"},
      {"step":2,"description":"Draft and introduce the National Energy Regulator Amendment Act: full budget autonomy funded through an annual licensee levy, replacement of ministerial appointment with an independent panel process, and fixed non-renewable 7-year terms for commissioners","timeline":"Q3 2025–Q2 2026","responsible_party":"DMRE / Department of Justice / Parliament"},
      {"step":3,"description":"Establish NERSA''s Electricity Market Regulation Division: recruit 30 specialist market regulation staff and develop wholesale electricity market rules for the competitive segment under the ERA Amendment Act","timeline":"Q1 2025–Q2 2026","responsible_party":"NERSA / DMRE"},
      {"step":4,"description":"Publish updated NERSA Electricity Tariff Methodology: migrate from the MYPD framework to a regulatory asset base (RAB) approach for transmission and distribution networks, with incentive regulation for efficiency","timeline":"Q3 2025–Q2 2026","responsible_party":"NERSA / National Treasury"},
      {"step":5,"description":"Strengthen NERSA gas and petroleum pipeline regulatory capacity: hire 15 additional specialist staff, publish updated gas tariff methodology, and develop the LNG terminal licensing framework","timeline":"Q1–Q4 2026","responsible_party":"NERSA"},
      {"step":6,"description":"Annual NERSA regulatory performance report to Parliament: benchmarking against OECD regulatory independence indicators, decision timeliness metrics, and licensee compliance rates","timeline":"Annual from Q2 2026","responsible_party":"NERSA / Portfolio Committee on Mineral Resources and Energy"}
    ]'::jsonb,
    '18 months for legislation (Q2 2025–Q2 2026); regulatory methodology update Q2 2026; full market regulation division operational Q2 2026',
    'NERSA operational budget increase: R200 million/year (licensee-funded, no net fiscal cost). Market Regulation Division staffing: R80 million/year. Regulatory methodology update: R15 million consulting cost. Net fiscal impact: nil.',
    'Amendment to the National Energy Regulator Act 40 of 2004: budget autonomy, appointment process reform, and fixed commissioner terms. Consequential amendments to the Electricity Regulation Act (Section 4), Gas Act 48 of 2001, and Petroleum Pipelines Act 60 of 2003. ERA Amendment Act (2024) must be read alongside any NERA amendment.',
    'The NERA amendment is a Section 75 ordinary bill not requiring NCOP concurrence. DMRE leads; National Treasury and Department of Justice are co-sponsors. Commissioner appointment reform is politically sensitive — the Minister currently exercises significant discretionary power and any JSC-type process reduces ministerial patronage.',
    'ANC''s economic cluster is divided — reform-oriented officials (Treasury, DMRE technocrats) support independence; patronage networks within NERSA oppose. DA strongly supports regulatory independence. Business (B4SA, SACCI, SAPVIA) is a strong proponent. World Bank and IEA have both formally recommended NERSA independence reforms in 2022–2024 technical assistance reports.',
    'The UK''s Ofgem operates with full financial independence funded through licensee fees — the global model for energy regulatory independence. Brazil''s ANEEL was reformed in 2019 to introduce fixed non-renewable terms for directors, significantly reducing political interference. Ghana''s PURC provides an African model for energy regulatory independence. The IEA''s Regulatory Best Practice Guide (2022) explicitly recommends the RAB tariff methodology SA is adopting.'
);

-- ── ID 41: Solar Water Heater Programme Expansion ────────────────────────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    41,
    'The Solar Water Heater Programme targets 1 million installations using an ESCO delivery model to eliminate the upfront capital barrier that constrained prior rounds. Electric geysers account for 35–40% of residential electricity consumption and 400–600 MW of peak demand; systematic substitution is one of the most cost-effective demand-side interventions available. The Eskom rebate programme and DMRE subsidies for low-income households provide the fiscal foundation; the ESCO model shifts procurement, installation, and maintenance risk from households to service companies. SABS accreditation standards address the quality failures of imported units that undermined earlier rounds.',
    '[
      {"step":1,"description":"Publish revised SWHP programme guidelines incorporating the ESCO service model: competitive tendering for ESCO contracts, SABS accreditation standards, installation warranty requirements, and performance-based payment linked to measured energy savings","timeline":"Q1 2025","responsible_party":"DMRE / Eskom"},
      {"step":2,"description":"Procure 10 regional ESCO contracts via competitive tender (CIDB-registered contractors); ESCO contracts cover installation, maintenance, and performance monitoring for 5-year periods","timeline":"Q2–Q4 2025","responsible_party":"DMRE / National Treasury (SCM process)"},
      {"step":3,"description":"Launch low-income subsidy stream: DMRE subsidy of R8,000–R12,000 per unit for households earning below R3,500/month in partnership with municipalities and Social Housing Institutions; integrate with the Housing Subsidy System","timeline":"Q2 2025–Q4 2026","responsible_party":"DMRE / Department of Human Settlements / SASSA"},
      {"step":4,"description":"Implement Eskom rebate programme for middle-income households via the MyEskom Customer Portal; target 200,000 applications per year at R5,000 per unit average","timeline":"Q1 2025 (ongoing)","responsible_party":"Eskom / DMRE"},
      {"step":5,"description":"Establish a national SWH performance monitoring system tracking installations, measured energy savings, warranty claims, and ESCO performance; publish annual report to Portfolio Committee","timeline":"Q2 2025 onwards","responsible_party":"DMRE / SABS"},
      {"step":6,"description":"Review and tighten SABS accreditation standards: mandatory 5-year performance warranty, corrosion resistance testing, and thermal performance certification aligned with ISO 9459","timeline":"Q1–Q3 2025","responsible_party":"SABS / DMRE"}
    ]'::jsonb,
    '5-year programme 2025–2030: 200,000 installations/year target; 1 million total by 2030; 400–600 MW peak demand reduction',
    'Total programme cost over 5 years: R8–12 billion (DMRE subsidies R4B + Eskom rebates R3B + ESCO operational costs R1–2B). Cost per MWh saved: R0.40–0.60/kWh over the 15-year SWH lifetime — one of the lowest-cost demand-side resources available.',
    'No new primary legislation required. The SWHP operates under DMRE programme authority and Eskom tariff licence conditions. National Building Regulations (SANS 204) already includes solar water heater provisions for new buildings.',
    'No new legislation required at national level. Municipalities wishing to mandate SWH in new developments require by-law amendments to building and planning regulations. National Treasury SCM regulations govern the ESCO procurement process.',
    'Strong consensus on the SWHP concept; previous rounds succeeded technically but failed on scale and quality. ANC, DA, and coalition partners all support. Eskom supports peak demand reduction. The ESCO model reduces programme administration burden on DMRE. Installation quality and maintenance risks are the primary implementation challenges, not political opposition.',
    'Morocco''s national SWH programme achieved 700,000 installations in 10 years using a similar ESCO delivery model — directly applicable. Tunisia''s PROSOL programme (200,000 installations, 2005–2015) used commercial bank financing with government interest rate subsidies. Brazil''s Programa Solar Brasil demonstrates integration with social housing at scale.'
);

-- ── ID 42: Electricity Regulation Amendment Act — Competitive Electricity Market ───────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    42,
    'The ERA Amendment Act (2024) provides the legislative foundation for South Africa''s transition from a vertically integrated state monopoly to a competitive wholesale electricity market with multiple generators, a separate transmission company (NTCSA), an independent system operator, and third-party grid access. Implementation is the critical challenge: NERSA must develop market rules, NTCSA must be functionally separated from Eskom, and the competitive generation segment must be opened to IPPs at commercial scale. The reform is the most structurally significant energy market change since electrification and is projected to reduce the long-run cost of electricity by 15–25% through competition. The success metric is the number of bilateral PPAs concluded and the reduction in load-shedding hours.',
    '[
      {"step":1,"description":"Complete the functional separation of NTCSA from Eskom: board appointment, operational independence (separate IT systems, staff, accounts), and transfer of transmission and system operator functions under the ERA Amendment Act","timeline":"Q2 2025–Q1 2026","responsible_party":"DMRE / Eskom / National Treasury"},
      {"step":2,"description":"NERSA publish the Electricity Market Rules: market operator function, balancing mechanism, spot market structure, and congestion management methodology for the competitive segment","timeline":"Q3 2025–Q3 2026","responsible_party":"NERSA / NTCSA"},
      {"step":3,"description":"Open the commercial third-party access regime: NERSA to issue standardised Grid Connection Agreements for all generation licensees above 1 MW; publish Grid Code update incorporating third-party access provisions","timeline":"Q4 2025–Q2 2026","responsible_party":"NERSA / NTCSA / DMRE"},
      {"step":4,"description":"Phase 1 competitive market: run parallel REIPPPP procurement alongside competitive bilateral contracting; allow large industrial customers (>100 GWh/year) to purchase directly from IPPs via PPAs","timeline":"Q1 2026–Q4 2027","responsible_party":"DMRE / NERSA / IPP Office"},
      {"step":5,"description":"Develop the Capacity Market mechanism: design capacity payments for firm dispatchable capacity (gas peakers, storage) to ensure system adequacy alongside the competitive energy market","timeline":"Q2 2026–Q4 2027","responsible_party":"NERSA / NTCSA / National Treasury"},
      {"step":6,"description":"Annual briefing to Portfolio Committee on Mineral Resources and Energy on market concentration, IPP participation rates, and electricity price trends","timeline":"Annual from Q2 2026","responsible_party":"NERSA / DMRE / NTCSA"}
    ]'::jsonb,
    'ERA Amendment Act enacted 2024; NTCSA functional separation Q1 2026; market rules Q3 2026; Phase 1 competitive market Q4 2027; full competitive market 2030',
    'NTCSA establishment costs: ~R1.5 billion (IT systems, corporate setup, staff transfer). NERSA market rules development: R50 million. Market operator infrastructure: R200–400 million. Projected consumer savings from competition: R15–30 billion/year over the medium term.',
    'ERA Amendment Act 23 of 2024 (enacted): the primary legislative instrument. Consequential amendments to the Eskom Act 40 of 2002 (functional separation) and the Companies Act (NTCSA incorporation). The Grid Code update is a technical instrument issued by NERSA under Section 35 of the ERA.',
    'The ERA Amendment Act has been enacted; implementation is the current challenge. NTCSA incorporation requires Cabinet approval and National Treasury concurrence on debt and asset allocation. The Schedule 2 public entity status of NTCSA requires a ministerial determination. Market rules are a NERSA regulatory process requiring no further primary legislation.',
    'Business (B4SA, SACCI, SEIFSA), renewables industry (SAPVIA, SAWEA), and large energy users (EIUG) strongly favour competitive market opening. Eskom internal resistance to unbundling is the primary implementation risk. NUM concerns about employment during unbundling require structured transition agreements. GNU partners broadly supportive.',
    'Britain''s 1989 Electricity Act privatisation is the original model; SA''s reform is more gradualist. Chile''s 1982 electricity market reform (the first in the world) provides long-run lessons on competitive market design. Australia''s National Electricity Market (1998) is directly comparable in structure to what SA is building and is the most relevant contemporary reference.'
);

-- ── ID 43: Gas Amendment Bill — LNG Import Infrastructure and City Gas ────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    43,
    'South Africa faces a looming industrial gas shortage as the Mozambican ROMPCO pipeline supply is constrained and domestic Sasol gas fields deplete. The Gas Amendment Bill updates the Gas Act 2001 framework for LNG imports, enables LNG terminal licensing at Richards Bay, Coega, and Saldanha Bay, and creates a city gas distribution licensing regime to develop piped gas networks in urban areas. LNG import infrastructure is the bridge fuel for industrial decarbonisation and the gas-to-power programme; city gas networks reduce residential electricity demand by providing an alternative to electric geysers and cooking in medium-density urban areas. DMRE and NERSA co-lead the regulatory framework development, with the DMRE''s Gas Master Plan providing the demand basis.',
    '[
      {"step":1,"description":"Table the Gas Amendment Bill in Parliament: key provisions include LNG terminal licensing under NERSA, open-access regasification infrastructure obligations, city gas distribution licensing, and transition from ROMPCO-dominant supply to a diversified import-plus-domestic model","timeline":"Q2 2025–Q1 2026","responsible_party":"DMRE / Department of Justice / Parliament"},
      {"step":2,"description":"NERSA publish the LNG Terminal Licensing Framework: technical requirements, safety standards (NRCS), open-access pricing methodology, and EIA integration with DFFE","timeline":"Q3 2025–Q2 2026","responsible_party":"NERSA / DMRE / DFFE"},
      {"step":3,"description":"Facilitate competing LNG terminal feasibility studies at three candidate sites (Richards Bay, Coega, Saldanha Bay): DMRE data room access, NRCS pre-qualification, Transnet Pipelines and iGas pipeline connection assessments","timeline":"Q2 2025–Q4 2026","responsible_party":"DMRE / Transnet Pipelines / iGas / National Ports Authority"},
      {"step":4,"description":"Issue city gas distribution licences in 5 pilot cities (Johannesburg, Cape Town, Durban, Ekurhuleni, Tshwane): NERSA to tender 20-year exclusive city gas distribution concessions","timeline":"Q1 2026–Q4 2027","responsible_party":"NERSA / DMRE / Local Municipalities"},
      {"step":5,"description":"Develop the Gas Master Plan update integrating LNG import scenarios, domestic offshore gas production timelines (Brulpadda/Luiperd), and city gas demand projections through 2040","timeline":"Q1–Q4 2026","responsible_party":"DMRE / iGas / NERSA"},
      {"step":6,"description":"Conclude bilateral LNG supply framework agreements with QatarEnergy, US LNG exporters (Venture Global, Sabine Pass), and ENH Mozambique for competitive long-term supply","timeline":"2025–2027","responsible_party":"DMRE / DIRCO / iGas"}
    ]'::jsonb,
    'Gas Amendment Bill enacted Q1 2026; LNG licensing framework Q2 2026; first terminal FID 2027–2028; city gas pilot licences Q4 2027; LNG first gas 2028–2030',
    'LNG terminal infrastructure: R8–15 billion per terminal (private sector funded, potential sovereign guarantee). City gas network development: R2–4 billion per major metro (private sector concession). DMRE and NERSA regulatory capacity: R100 million over 2 years.',
    'Gas Amendment Bill (new primary legislation): amends the Gas Act 48 of 2001 to add LNG-specific licensing provisions, open-access obligations for LNG terminals, and city gas distribution licensing. NRCS Act and OHSA regulations require updating for LNG safety standards.',
    'The Gas Amendment Bill is a Section 75 ordinary bill. DMRE leads; NERSA, DFFE, and dtic are co-signatories. LNG terminal siting at ports requires National Ports Authority (under the National Ports Act) and Transnet concurrence. DFFE EIA processes must run in parallel with licensing.',
    'Gas sector reform has strong industry support (Sasol, industrial gas users, EIUG). Petrochemical industries facing supply shortfalls are vocal proponents. ANC Economic Transformation Committee supports LNG as a transition fuel. Environmental NGOs oppose LNG expansion as inconsistent with the Paris Agreement; DFFE must manage the climate impact assessment process.',
    'Brazil''s city gas concession model (25-year exclusive licences, regulated tariffs) has successfully built piped gas networks in São Paulo, Rio, and 11 other cities — directly applicable. Chile''s LNG import terminal at Quintero (2009) demonstrates a medium-sized economy''s successful LNG infrastructure development. Qatar LNG supply agreements with South Korea and Japan provide the template for SA''s long-term supply contracting.'
);

-- ── ID 44: Upstream Petroleum Resources Development Act ───────────────────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    44,
    'The Upstream Petroleum Resources Development Act, assented to by President Ramaphosa in November 2024, ends decades of legal ambiguity under the MPRDA and establishes a dedicated framework administered by SAAPEE. Implementation focuses on the regulations, licensing systems, and institutional capacity required to operationalise the Act and attract investment into the Orange Basin discoveries. TotalEnergies (Brulpadda/Luiperd), Shell, and other majors have been awaiting regulatory certainty; the Act''s passage is expected to unlock several billion dollars of exploration and development investment. PETROSA''s 20% free-carry and the black equity requirements must be operationalised with sufficient flexibility to avoid deterring investors while meeting transformation objectives.',
    '[
      {"step":1,"description":"Publish the UPRDA regulations in the Government Gazette: technical specifications for reconnaissance permits, exploration rights, production rights, and retention permits; SAAPEE licensing portal and fee schedule","timeline":"Q1–Q3 2025","responsible_party":"DMRE / SAAPEE"},
      {"step":2,"description":"Operationalise SAAPEE: appoint board and CEO, establish licensing division, environmental compliance unit, and community liaison function; transfer MPRDA petroleum licensing files to SAAPEE","timeline":"Q1–Q2 2025","responsible_party":"DMRE"},
      {"step":3,"description":"Gazette the Black Equity Participation framework under the UPRDA: minimum black equity thresholds, BBBEE scoring methodology, and the carried-interest mechanism for PETROSA''s 20% free-carry","timeline":"Q2–Q3 2025","responsible_party":"DMRE / SAAPEE / dtic"},
      {"step":4,"description":"Issue first-round UPRDA exploration rights in the Orange Basin: invite applications from TotalEnergies, Shell, and other qualified operators; process within the 90-day statutory timeline","timeline":"Q3 2025–Q2 2026","responsible_party":"SAAPEE / DMRE"},
      {"step":5,"description":"Negotiate and finalise the development plan for Brulpadda/Luiperd fields with TotalEnergies: production sharing terms, gas-to-power supply commitment, and domestic market obligation defining minimum SA gas supply volumes","timeline":"2025–2027","responsible_party":"DMRE / SAAPEE / PETROSA / National Treasury"},
      {"step":6,"description":"Publish PETROSA transformation roadmap: corporate restructuring from PetroSA to PETROSA under the UPRDA framework; commercialisation strategy for the free-carry interest","timeline":"Q3 2025–Q2 2026","responsible_party":"DMRE / PETROSA Board"}
    ]'::jsonb,
    'UPRDA assented November 2024; SAAPEE operationalised Q2 2025; regulations published Q3 2025; first Orange Basin rights Q2 2026; Brulpadda development FID 2027–2028',
    'SAAPEE establishment: R200 million over 3 years (government). PETROSA restructuring: R50–100 million. Private sector exploration investment expected: R5–15 billion over 5 years. Fiscal revenue at peak production (2035+): petroleum royalties, corporate tax, and PETROSA dividends estimated at R10–30 billion/year.',
    'Upstream Petroleum Resources Development Act (enacted November 2024): the primary instrument. UPRDA regulations (subordinate legislation) to be published. Consequential amendment to the MPRDA to remove petroleum provisions. PETROSA formation requires corporate restructuring under the Companies Act.',
    'The UPRDA is enacted; implementation focuses on subordinate legislation and institutional setup. SAAPEE board appointment requires a Cabinet approval process. The BEP framework regulation is politically sensitive — high thresholds deter international majors; low thresholds draw EFF criticism. National Treasury and dtic must co-sign the BEP framework regulation.',
    'The UPRDA has cross-party support: ANC (resource nationalism via PETROSA free-carry), DA (investment certainty), and EFF (state participation) all see aligned elements. Minerals Council SA and SAOGA are engaged in the regulatory process. Environmental NGOs oppose offshore drilling; DFFE EIA process is the key battleground.',
    'Norway''s Equinor model — state participation through a carried interest in private licences — is the global reference for free-carry structures. Angola''s Sonangol and Nigeria''s NNPC provide African precedents for managing state participation alongside international major investment. Mozambique''s LNG development (ENH + TotalEnergies) is the most directly comparable offshore gas development in the region.'
);

-- ── ID 45: Critical Minerals Beneficiation Strategy ──────────────────────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    45,
    'South Africa holds world-leading reserves of platinum group metals (>80% of global reserves), manganese (>30%), vanadium, chromium, and titanium — minerals central to the global energy transition. The Critical Minerals Beneficiation Strategy aims to shift South Africa from primary ore export toward refined and processed critical minerals, capturing more value in-country and positioning SA as a strategic partner in EU, US, and Asian supply chains. DMRE leads in partnership with dtic, DBSA, and the IDC. The strategy must address the enabling constraints — competitive industrial electricity, skills, and infrastructure — alongside mineral policy itself; beneficiation cannot succeed without energy reform proceeding in parallel.',
    '[
      {"step":1,"description":"Publish the Critical Minerals Beneficiation Strategy and Action Plan: priority minerals (PGMs, manganese, vanadium, chromite, titanium), target beneficiation stages (smelting, refining, fabrication, component manufacture), and investment targets by mineral stream","timeline":"Q2 2025","responsible_party":"DMRE / dtic"},
      {"step":2,"description":"Establish a Critical Minerals Investment Office within DMRE: single-point-of-contact for investors, permitting facilitation, environmental coordination, and infrastructure support requests for qualifying beneficiation projects","timeline":"Q3 2025","responsible_party":"DMRE / dtic"},
      {"step":3,"description":"Negotiate Critical Minerals Partnership Agreements with the EU (European Critical Raw Materials Act), USA (IRA supply chain provisions), Japan, and South Korea: supply commitments, offtake agreements, and technology transfer terms","timeline":"Q2 2025–Q2 2026","responsible_party":"DMRE / DIRCO / dtic"},
      {"step":4,"description":"Expand SEZ critical minerals processing hubs: Coega, Richards Bay IDZ, and Matlosana SEZ as designated processing zones with dedicated power supply, water, and logistics infrastructure","timeline":"Q3 2025–Q4 2026","responsible_party":"dtic / DMRE / Transnet / DBSA"},
      {"step":5,"description":"Develop IDC and DBSA co-investment facility: R10 billion blended finance for first-loss equity in PGM fuel cell manufacturing, manganese battery material processing, and vanadium flow battery production","timeline":"Q3 2025–Q2 2026","responsible_party":"IDC / DBSA / National Treasury"},
      {"step":6,"description":"Establish skills pipeline through Minerals Council partnerships with TVET colleges in mining regions (Limpopo, North West, Northern Cape, Mpumalanga): beneficiation technician training in metallurgy, refining, and advanced materials processing","timeline":"Q1 2026–Q4 2027","responsible_party":"DMRE / DHET / Minerals Council SA"}
    ]'::jsonb,
    'Strategy published Q2 2025; Investment Office Q3 2025; Partnership Agreements 2026; SEZ hubs operational 2027; IDC/DBSA facility deployed 2026; skills pipeline 2026–2027',
    'IDC/DBSA blended finance facility: R10 billion. SEZ infrastructure upgrades: R5–8 billion (DBSA/government). Critical Minerals Investment Office: R50 million/year. Total public investment: R15–20 billion over 5 years, expected to leverage R50–100 billion in private sector beneficiation investment through 2030.',
    'No new primary legislation required beyond existing frameworks. The Minerals and Mining Development Bill (under development) includes beneficiation obligation provisions. The Mineral and Petroleum Resources Royalty Act (2008) may require amendment to provide royalty relief for qualifying beneficiation activities. SEZ Act 16 of 2014 provides the legal framework for designated processing zones.',
    'Beneficiation obligation provisions in the MMDB are the key legislative instrument. A royalty relief regulation under the MPRA requires only Minister of Finance approval. SEZ designation orders are ministerial decisions under the SEZ Act requiring no parliamentary vote.',
    'Beneficiation strategy has broad political support — ANC resource nationalism, DA industrial policy, and EFF state-led industrialisation positions all find alignment. Industry (Minerals Council, Anglo American, Sibanye-Stillwater, Implats) supports the partnership model but resists mandatory beneficiation obligations. The electricity cost barrier is the key technical-political constraint: beneficiation requires globally competitive industrial power rates.',
    'Botswana''s diamond beneficiation agreement with De Beers — requiring local sorting and valuation — demonstrates a successful resource nationalism model. Norway''s aluminium beneficiation (based on cheap hydropower) shows how energy competitive advantage enables resource value addition. Chile''s lithium beneficiation strategy under CODELCO provides a direct peer case for battery minerals. The EU''s Critical Raw Materials Act (2024) creates specific market access incentives for SA beneficiation.'
);

-- ── ID 46: Fuel Price Deregulation (Inland Margins) ──────────────────────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    46,
    'South Africa''s regulated fuel price model — governed by DMRE''s Basic Fuel Price formula, fixed levies, and regulated distribution margins — creates structural inefficiencies: it suppresses investment in alternative fuels (LPG, CNG), protects incumbent refiners from competition, and cross-subsidises coastal-to-inland distribution at the cost of manufacturing and agri-processing competitiveness. The Competition Commission''s 2023 Fuel Markets Inquiry recommended partial deregulation of inland retail margins while retaining regulation of the fuel levy and Road Accident Fund levy. The reform removes DMRE price controls on retail margins, introduces zone-based pricing eliminating the coastal-to-inland cross-subsidy, and allows market entry for LPG and CNG retailers. A regulated floor price mechanism protects against predatory pricing during the transition.',
    '[
      {"step":1,"description":"Publish the Fuels Sector Reform White Paper incorporating Competition Commission recommendations: partial deregulation of inland retail margins, zone-based pricing, LPG/CNG market entry framework, and retention of the Basic Fuel Price formula for crude import pricing","timeline":"Q2 2025","responsible_party":"DMRE / Competition Commission"},
      {"step":2,"description":"Amend the Petroleum Products Act 120 of 1977: remove DMRE retail margin price-fixing power; introduce zone-based wholesale pricing; add LPG and CNG licensing provisions","timeline":"Q3 2025–Q2 2026","responsible_party":"DMRE / Department of Justice / Parliament"},
      {"step":3,"description":"Implement zone-based wholesale pricing: NERSA to calculate and publish cost-of-supply zones for coastal vs. inland markets; introduce a two-zone wholesale price ceiling eliminating the blanket coastal-to-inland cross-subsidy","timeline":"Q3 2026","responsible_party":"NERSA / DMRE"},
      {"step":4,"description":"Establish the Petroleum Market Monitor within NERSA: monthly publication of retail fuel price data by region, gross margin analysis, market concentration metrics, and Competition Commission referrals for margin abuse","timeline":"Q3 2025","responsible_party":"NERSA / Competition Commission"},
      {"step":5,"description":"LPG and CNG market entry facilitation: DMRE fast-track licensing for new LPG retailers and CNG filling stations; amend National Building Regulations to clarify CNG station safety standards","timeline":"Q1 2026–Q2 2027","responsible_party":"DMRE / NRCS / Local Municipalities"},
      {"step":6,"description":"24-month impact assessment: Competition Commission review of retail margin levels, market entry rates, and consumer price movements across income deciles; report to Parliament","timeline":"Q2 2028","responsible_party":"Competition Commission / National Treasury / DMRE"}
    ]'::jsonb,
    'White Paper Q2 2025; Petroleum Products Act amendment Q2 2026; zone-based pricing Q3 2026; LPG/CNG licensing Q2 2027; 24-month review Q2 2028',
    'Regulatory reform costs: R30 million (NERSA market monitor, Competition Commission capacity). No direct fiscal cost; potential fuel levy revenue protection through the Basic Fuel Price formula. Consumer savings from competitive margin reduction estimated at R3–8 billion/year once inland margins are deregulated.',
    'Amendment to the Petroleum Products Act 120 of 1977: remove retail margin price controls; introduce zone-based pricing. Petroleum Pipelines Act 60 of 2003: consequential amendments for zone-based pipeline tariffs. The Liquid Fuels Charter (transformation instrument) requires updating alongside deregulation.',
    'The Petroleum Products Act amendment is a Section 75 bill. DMRE leads; National Treasury (fuel levy impact), dtic (Liquid Fuels Charter), and Competition Commission are co-signatories. The reform must accommodate the Liquid Fuels Charter''s transformation objectives to avoid legal challenges from BEE licensees who benefit from current regulated margins.',
    'Fuel price deregulation is politically sensitive: motorists and civil society associate the term with higher retail prices. The reform must be communicated as a margin competition measure. Labour (SATAWU) fears job losses if smaller retailers exit; empirical evidence from competitive markets suggests the opposite. ANC''s economic cluster is divided; DA strongly supports. Competition Commission backing is the strongest political shield.',
    'Kenya deregulated retail fuel margins in 2010 and saw immediate market entry and downward price pressure in competitive urban zones. Chile deregulated fuel retail margins in the 1990s, achieving consistent 5–8% reductions in competitive areas. Australia''s ACCC petrol price monitoring provides the model for the Petroleum Market Monitor SA is adopting. India''s partial fuel deregulation (diesel, 2014) demonstrates the political management of a full-to-partial regulation transition.'
);

-- ── ID 47: Derelict and Ownerless Mines Rehabilitation Fund ──────────────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    47,
    'South Africa has approximately 6,000 derelict and ownerless mines generating acid mine drainage (AMD), sinkhole risk, and water pollution — a legacy of 130 years of gold, coal, and base metals mining. The DMRE DOM Unit manages rehabilitation with ~R700 million/year against an estimated R50 billion backlog; Rand Water spends R2 billion/year pumping Western Basin AMD to protect Johannesburg''s water supply, a preventable recurring cost. A dedicated Rehabilitation Fund, capitalised through a mining royalties top-up levy, green bond issuance, and international climate finance under the Just Energy Transition framework, would systematically address this liability over 20 years. The Mines and Minerals Development Bill must include strengthened financial provision requirements to prevent the backlog from growing.',
    '[
      {"step":1,"description":"Gazette the Derelict and Ownerless Mines Rehabilitation Framework: funding model (annual levy on Minerals Council members of 0.5–1% of royalty payments), governance structure (independent fund board), procurement process for rehabilitation contractors, and 20-year rehabilitation schedule by priority site","timeline":"Q2 2025","responsible_party":"DMRE / National Treasury"},
      {"step":2,"description":"Establish the DOM Rehabilitation Fund as a Schedule 3B public entity under the PFMA: independent board with environmental engineering, finance, and community representation; dedicated accounting officer and audit committee","timeline":"Q3 2025–Q1 2026","responsible_party":"DMRE / National Treasury"},
      {"step":3,"description":"Issue the first tranches of DOM Rehabilitation Green Bonds: R5 billion in 5-year bonds under the National Treasury Green Bond Framework (2024), listed on the JSE and accessible to pension funds under Regulation 28 green infrastructure allocation","timeline":"Q2–Q4 2026","responsible_party":"National Treasury / DOM Fund Board / JSE"},
      {"step":4,"description":"Prioritise Western Basin and Eastern Basin AMD rehabilitation: contract AMD pumping and treatment infrastructure upgrades; coordinate with Rand Water, TCTA, and Department of Water and Sanitation on long-term water quality monitoring","timeline":"Q3 2025 (ongoing)","responsible_party":"DMRE / TCTA / Department of Water and Sanitation"},
      {"step":5,"description":"Strengthen financial provision enforcement for active mines: implement MMDB financial provision regulations requiring independent certification of rehabilitation funds, increasing currently underfunded provisions for the 1,500 active mines with rehabilitation liabilities","timeline":"Q1–Q4 2026","responsible_party":"DMRE Mineral Regulation Division"},
      {"step":6,"description":"Apply to JET-IP international partners (UK, EU, USA, France, Germany) for a DOM rehabilitation co-financing tranche as part of the Just Transition coal region component","timeline":"Q2 2025–Q2 2026","responsible_party":"National Treasury / Presidency / DMRE"}
    ]'::jsonb,
    'Fund established Q1 2026; green bonds Q4 2026; AMD rehabilitation priority sites 2025 (ongoing); active mine financial provision reforms Q4 2026; 20-year rehabilitation programme 2026–2046',
    'DOM Rehabilitation Fund capitalisation target: R20 billion over 10 years (levy contributions R1B/year + green bonds R5B + JET-IP climate finance R5B). Current annual rehabilitation budget: R700 million/year. TCTA AMD pumping costs of R2 billion/year become avoidable at scale. Total rehabilitation cost for full backlog: R50 billion over 20 years.',
    'Amendment to the MPRDA or new Mines and Minerals Development Bill: creates statutory basis for the DOM Rehabilitation Fund and mandatory levy mechanism. PFMA amendment or ministerial determination to list the Fund as a Schedule 3B public entity. National Treasury Green Bond Framework (2024) already provides the issuance framework.',
    'The DOM Fund requires a statutory basis — either an MPRDA amendment or a provision in the MMDB. The MMDB is currently before Parliament and may be the vehicle. A Schedule 3B listing requires a ministerial determination by both the Minister of DMRE and the Minister of Finance. Green bond issuance is within existing Treasury authority. JET-IP climate finance applications require Cabinet approval.',
    'Mining sector (Minerals Council SA) supports a well-governed fund as it provides certainty and limits retroactive liability claims. Environmental groups (groundWork, Centre for Environmental Rights) strongly support. Communities near DOMs are active advocates. National Treasury is cautious about a new public entity but supportive of the green bond model. ANC, DA, and EFF all have political reasons to support.',
    'The US Superfund programme (CERCLA, 1980) is the global model for legacy mine rehabilitation funded by industry levies. Canada''s National Orphaned and Abandoned Mines Initiative (NOAMI) provides a more applicable governance model for SA. Australia''s Queensland Mine Rehabilitation Fund uses a financial assurance bond scheme that informs the active mine provision strengthening element. Chile''s Cierre de Faenas fund provides a directly applicable Latin American precedent.'
);

-- ── ID 48: National Nuclear Regulator Capacity for New Nuclear Build ──────────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    48,
    'The National Nuclear Regulator is calibrated for oversight of Koeberg''s two operating units; the addition of a 2,500 MW nuclear build programme (ID 37) and the Koeberg LTO extension (ID 36) requires a fundamental scaling of regulatory technical capacity. Without NNR expansion, the nuclear build programme faces a regulatory bottleneck that could delay construction licensing by 3–5 years. The reform involves an NNR Act amendment to fund the regulator through a licence fee mechanism (removing Parliamentary budget dependence), a targeted hiring programme for nuclear engineers, and bilateral technical assistance agreements with the IAEA, France''s ASN, and South Korea''s KINS. Success is measured by NNR readiness to receive and process a construction licence application by 2028.',
    '[
      {"step":1,"description":"Publish the NNR Capacity Development Plan: assessment of staffing gaps for new-build oversight (construction inspectors, safety case reviewers, environmental specialists), hiring plan for 80 additional technical staff, and a 5-year budget plan funded through licence fees","timeline":"Q2 2025","responsible_party":"NNR Board / DMRE"},
      {"step":2,"description":"Amend the National Nuclear Regulator Act 47 of 1999: replace Parliamentary appropriation with a licence fee funding model (annual fee paid by nuclear installation licensees, scaled to installation complexity and MW capacity)","timeline":"Q3 2025–Q2 2026","responsible_party":"DMRE / National Treasury / Parliament"},
      {"step":3,"description":"Conclude bilateral technical assistance agreements with the IAEA (Technical Cooperation programme), France''s Autorité de Sûreté Nucléaire (ASN), and South Korea''s KINS: resident expert secondments, training placements, and an IRRS mission","timeline":"Q1–Q4 2025","responsible_party":"NNR / DMRE / DIRCO"},
      {"step":4,"description":"Launch NNR bursary and graduate programme: 20 bursaries per year for nuclear engineering and physics graduates at Wits, University of Pretoria, and NWU Potchefstroom; mandatory 5-year NNR service commitment; competitive salary benchmarked against Eskom nuclear division","timeline":"Q3 2025","responsible_party":"NNR / DHET / Wits / UP / NWU"},
      {"step":5,"description":"Develop the Construction Licence Review Framework for new-build: site evaluation methodology, probabilistic risk assessment standards, EIA integration, and the Construction Licence Application Guide for prospective vendors","timeline":"Q2 2025–Q4 2026","responsible_party":"NNR / DMRE"},
      {"step":6,"description":"IAEA Integrated Regulatory Review Service (IRRS) mission: invite the IAEA to peer-review NNR''s regulatory framework; implement recommendations as a condition of the nuclear build programme","timeline":"Q1–Q4 2026","responsible_party":"NNR / DMRE / IAEA"}
    ]'::jsonb,
    'NNR Capacity Plan Q2 2025; NNR Act amendment Q2 2026; bilateral agreements Q4 2025; bursary programme Q3 2025; IRRS mission Q4 2026; NNR ready for construction licence application 2028',
    'NNR budget increase: from ~R350 million/year to ~R650 million/year over 5 years (funded through licence fees, not National Treasury). IAEA Technical Cooperation funding: ~R50 million over 5 years (grant). Bursary programme: R15 million/year. Net public cost: marginal (licence fee model shifts burden to licensees).',
    'Amendment to the National Nuclear Regulator Act 47 of 1999: introduce licence fee funding mechanism replacing Parliamentary appropriation; amend Section 36 (NNR funding) and related financial governance provisions. Consequential amendment to the NNR''s PFMA public entity classification may be required if the fee model changes its Schedule category.',
    'The NNR Act amendment is a Section 75 ordinary bill. DMRE leads; National Treasury concurs on the financial governance model. IAEA bilateral agreements are concluded under executive authority (DIRCO) and require no parliamentary ratification under the Vienna Convention framework. The bursary programme is within existing DHET programmatic authority.',
    'NNR capacity expansion has strong consensus: DMRE, Eskom, nuclear industry, and Parliament all agree the NNR cannot oversee a new-build with current staffing. No political opposition to the principle. The political sensitivity is around the licence fee levy on Eskom. National Treasury supports the fee model to remove NNR from the annual appropriation process.',
    'The US NRC expanded from 3,000 to 4,300 staff during the nuclear renaissance (2007–2012) using a licence fee model — the global benchmark. France''s ASN bilateral technical assistance programme with emerging nuclear countries (UAE, Vietnam, Poland) provides the model for NNR-ASN cooperation. The UK''s Office for Nuclear Regulation expanded capacity for its new-build programme and provides detailed case studies on regulatory recruitment in competitive markets.'
);

-- ── ID 49: Renewable Energy Grid Integration and Transmission Expansion ───────────────
INSERT INTO implementation_plans (
    idea_id, roadmap_summary, implementation_steps, estimated_timeline,
    estimated_cost, required_legislation, draft_legislation_notes,
    political_feasibility_notes, international_precedents
) VALUES (
    49,
    'South Africa has allocated over 12,000 MW of renewable energy through REIPPPP Rounds 1–6 and emergency procurement, but grid connection constraints, queue management failures, and transmission infrastructure gaps are blocking connection of allocated and planned capacity. The Just Energy Transition Investment Plan — with R131 billion in international commitments from the UK, EU, USA, France, and Germany — designates transmission expansion as a priority investment. The National Transmission Company of South Africa (NTCSA) under the ERA Amendment Act (2024) assumes responsibility for transmission planning; NERSA must update the Grid Code; and NTCSA must clear a 6,000+ MW connection application backlog. Transmission expansion is the binding constraint on the energy transition, with success measured by MW of renewable capacity successfully connected per year.',
    '[
      {"step":1,"description":"Publish the NTCSA Transmission Development Plan: 10-year infrastructure investment plan identifying priority transmission corridors for renewable energy zones (Northern Cape, Western Cape wind corridors, Eastern Cape), voltage upgrades, and new substations; budget R130–180 billion over 10 years","timeline":"Q2 2025","responsible_party":"NTCSA / Eskom / NERSA"},
      {"step":2,"description":"Implement grid connection queue reform: NERSA and NTCSA publish a transparent queue management framework with first-come-first-served processing, queue position expiry for projects without financial close, and a published connection timeline commitment per application","timeline":"Q3 2025","responsible_party":"NERSA / NTCSA"},
      {"step":3,"description":"Fast-track 7 priority transmission projects from the TDP: Northern Cape HVDC corridor (Pofadder–Poseidon), Cape Peninsula grid reinforcement, Eastern Cape wind corridor upgrades, and Mpumalanga HVDC interconnects; obtain NERSA approval and commence procurement","timeline":"Q4 2025–Q2 2026","responsible_party":"NTCSA / Eskom Transmission / NERSA"},
      {"step":4,"description":"Deploy JET-IP international finance: National Treasury and NTCSA draw down JET-IP transmission tranche from AFD (France), KfW (Germany), and AfDB; structure concessional debt for priority transmission projects at below-market rates","timeline":"Q1 2025–Q4 2026","responsible_party":"National Treasury / NTCSA / DBSA / AFD / KfW"},
      {"step":5,"description":"Update the NERSA Grid Code: incorporate ERA Amendment Act (2024) third-party access provisions, establish technical standards for large-scale battery storage grid connection, and update fault ride-through requirements for variable renewable energy","timeline":"Q2–Q4 2025","responsible_party":"NERSA / NTCSA / SAPVIA / SAWEA"},
      {"step":6,"description":"Establish the Transmission Infrastructure Task Force (DMRE, NTCSA, National Treasury, DFFE, IPP Office): monthly reporting on transmission project progress, EIA timelines, and connection queue clearance rates","timeline":"Q2 2025 (ongoing)","responsible_party":"Presidency / DMRE / NTCSA"},
      {"step":7,"description":"Annual briefing to Portfolio Committee on Mineral Resources and Energy on transmission project status, JET-IP draw-down rates, and queue clearance; publish NTCSA Annual Transmission Report","timeline":"Annual from Q3 2025","responsible_party":"NTCSA / NERSA / DMRE"}
    ]'::jsonb,
    'TDP published Q2 2025; queue reform Q3 2025; priority projects procurement Q2 2026; JET-IP draw-down 2025–2027; Grid Code update Q4 2025; 10-year build programme 2025–2035',
    'Total transmission investment requirement: R130–180 billion over 10 years (NTCSA TDP). JET-IP international finance: R131 billion (concessional loans and grants). DBSA and DFI co-investment: R30–50 billion. Annual NTCSA capital budget: R13–18 billion/year.',
    'ERA Amendment Act 23 of 2024 (enacted): provides the NTCSA statutory framework and third-party access mandate. NERSA Grid Code update is a regulatory instrument under Section 35 of the ERA (no primary legislation required). National Treasury concurrence required for concessional debt draw-down under the JET-IP framework. The Expropriation Act (2024) provides the updated framework for servitude acquisition for transmission lines.',
    'The ERA Amendment Act provides the statutory basis; no further primary legislation required for transmission expansion. The JET-IP concessional finance draw-down is an executive process requiring National Treasury approval. Environmental authorisations for transmission corridors under NEMA are the critical process path — DFFE processing times of 12–36 months for large infrastructure EIAs are the primary regulatory bottleneck.',
    'JET-IP international finance is a strong political enabler: the R131 billion commitment has broad GNU consensus. Eskom unions (NUM, NUMSA) broadly support transmission investment as a jobs creator. IPP developers (SAPVIA, SAWEA) are the strongest advocates given connection queue frustrations. Environmental groups support renewable expansion but may contest specific transmission corridor routing through sensitive areas.',
    'Germany''s Energieleitungsausbau (transmission corridor law) provides a model for streamlining EIA processes for priority transmission projects, reducing project EIAs to site-specific assessments. Australia''s NEM transmission expansion under AEMO provides a comparable queue management and cost allocation model. Chile''s 500kV HVDC backbone (2017–2023) connecting the Atacama solar zone to Santiago demonstrates renewable energy corridor investment at scale.'
);

COMMIT;
