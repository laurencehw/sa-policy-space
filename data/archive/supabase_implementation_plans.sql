-- Supabase SQL Editor: Implementation Plans — Top 10 Quick-Win Ideas
-- Run this in the Supabase SQL Editor (or via psql against the hosted Supabase database).
-- This is identical to data/migrations/004_implementation_plans.sql.
-- Populates the implementation_plans table for the 10 highest-impact quick_win ideas,
-- ranked by growth_impact_rating DESC, feasibility_rating DESC.
--
-- Targets (Supabase/PostgreSQL):
--   implementation_steps  → JSONB
--   estimated_cost, etc.  → TEXT
--
-- Ideas covered (in order):
--   11  SMME Regulatory Burden Reduction                               (impact=5)
--   124 SARB Inflation Target Reform – Point Target at 3% (±1pp)      (impact=4, feasibility=5)
--   21  FATF Greylisting Exit — AML/CFT Legislative Package            (impact=4, feasibility=4)
--   24  SARS Capacity Expansion and Revenue Recovery                   (impact=4, feasibility=4)
--   114 National Small Enterprise Amendment Act: Ombud Operationalisation (impact=4, feasibility=4)
--   117 SMME Red Tape Reduction: BizPortal and Compliance Integration  (impact=4, feasibility=4)
--   3   AGOA Retention and Post-AGOA Trade Diversification             (impact=4)
--   53  University Certification Backlog Elimination                   (impact=3, feasibility=4)
--   113 African Medicines Agency Treaty Ratification & SAHPRA Strengthening (impact=3, feasibility=4)
--   29  AML/CFT Implementation Monitoring — NCOP and Provincial Layer  (impact=3, feasibility=3)
-- ─────────────────────────────────────────────────────────────────────────────────────

-- ── 1. ID 11: SMME Regulatory Burden Reduction ───────────────────────────────────────
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
    11,
    'A coordinated cross-sphere programme to halve SMME compliance costs by 2030, anchored by the SMME Ombud Service, BizPortal expansion, and the Business Licensing Reform Act. Success depends on COGTA securing municipal buy-in and a single compliance dashboard replacing fragmented reporting obligations.',
    '[
      {"step":1,"description":"Appoint the Small Enterprise Ombud under the National Small Enterprise Amendment Act (2023) and establish the national office in Pretoria with an online complaint portal","timeline":"Q1 2025 (complete)","responsible_party":"Department of Small Business Development (DSBD)"},
      {"step":2,"description":"Mandate all licensing bodies to integrate with BizPortal through a standardised API by December 2025; publish API standards and developer documentation","timeline":"Q2–Q4 2025","responsible_party":"CIPC / DSBD / DTIC"},
      {"step":3,"description":"Introduce a deemed-approval mechanism: licences auto-granted after 30 working days if no formal objection received, via legislative amendment to the Business Act 71 of 1991","timeline":"Q1–Q2 2026","responsible_party":"DTIC / National Treasury / Parliament"},
      {"step":4,"description":"Establish a Red Tape Reduction Unit within DSBD with investigative powers and publish an annual business compliance cost register covering all national and provincial regulations affecting SMMEs","timeline":"Q2 2025–Q1 2026","responsible_party":"DSBD / Presidency / COGTA"},
      {"step":5,"description":"Negotiate a simplified Employer Tax Compliance Package for SMMEs with fewer than 10 employees: quarterly PAYE filing, threshold-based UIF exemption, and auto-assessment integration with SARS e-filing","timeline":"Q3 2025–Q2 2026","responsible_party":"SARS / National Treasury / Department of Employment and Labour"},
      {"step":6,"description":"Table the Business Licensing Reform Bill in Parliament, consolidating the Business Act, the Liquor Act licensing provisions, and Environmental Health licensing into a single national framework with mutual recognition across provinces","timeline":"Q1–Q4 2026","responsible_party":"DTIC / COGTA / Parliament"},
      {"step":7,"description":"Mid-term compliance cost review: benchmark against World Bank Business Enabling Environment (BEE) indicators; report to Portfolio Committee on Small Business Development","timeline":"Q2 2027","responsible_party":"DSBD / National Treasury"}
    ]'::jsonb,
    '18 months to full operationalisation (Q1 2025–Q2 2026); 50% compliance cost reduction target by 2030',
    'R500 million over 3 years (MTBPS 2025 SMME package allocation): BizPortal API integration ~R180m, Ombud Service staffing ~R120m/year, Red Tape Unit ~R40m/year',
    'Amendment to Business Act 71 of 1991 (deemed-approval provision); National Small Enterprise Amendment Act 26 of 2023 (enacted); Business Licensing Reform Bill (new); Companies Act 2008 regulations update',
    'The Business Act amendment requires a Section 76 bill (affecting local government competence) — full NCOP process applies. A draft bill was circulated for comment by DTIC in September 2024. Key provisions: deemed-approval clause, mandatory API integration obligation on licensing bodies, civil liability for unreasonable delays. The Business Licensing Reform Bill should be introduced as an omnibus consolidation bill.',
    'Strong multiparty support in Portfolio Committee on Small Business Development; GNU dynamics favour reform-oriented legislation with DA and ANC alignment. Municipal resistance is the primary risk — COGTA Section 154 support intervention mechanism may be required for non-compliant metros. National Treasury conditional grant leverage over municipalities is the most effective lever. Business associations (NAFCOC, SACCI, Business Unity SA) strongly supportive.',
    'Rwanda''s 2010 Single Business Permit eliminated multiple licences, reduced registration time from 16 days to 6 hours, and contributed to sustained 9% GDP growth. Malaysia''s MyBusiness portal (2015) integrated 47 agencies, cutting compliance costs 40% in 3 years. Portugal''s Empresa na Hora (2005) reduced company formation to 1 hour — the model for BizPortal''s design.'
);

-- ── 2. ID 124: SARB Inflation Target Reform – Point Target at 3% (±1pp) ─────────────
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
    124,
    'The reform is structurally complete: announced at MTBPS November 2025 and effective from the 2025/26 MPC cycle. Implementation now focuses on communication strategy (anchoring expectations), MPC forward guidance, and monitoring the pass-through to bond yields and the neutral repo rate. The 3% point target with ±1pp tolerance band aligns SA with best-practice emerging market frameworks and is projected to save R15–20 billion/year in debt service costs as the inflation risk premium compresses.',
    '[
      {"step":1,"description":"Formal MPC announcement of the new 3% point target (±1pp) with a supporting technical note on inflation expectations, credibility transition path, and implications for the neutral real interest rate","timeline":"November 2025 (complete)","responsible_party":"South African Reserve Bank (SARB) Monetary Policy Committee"},
      {"step":2,"description":"SARB publish Monetary Policy Review incorporating the new target: modelling of structural disinflation path, expected 10-year bond yield impact, and updated neutral rate estimate","timeline":"Q1 2026","responsible_party":"SARB Research Department"},
      {"step":3,"description":"National Treasury publish framework note on fiscal implications: projected debt service cost savings, updated borrowing cost assumptions in the Medium-Term Expenditure Framework (MTEF)","timeline":"Budget 2026 (February 2026)","responsible_party":"National Treasury / Budget Office"},
      {"step":4,"description":"Communication campaign targeting wage negotiators, pension funds, and bond market participants to re-anchor inflation expectations toward 3% breakeven; update National Development Plan growth model inflation assumptions","timeline":"Q1–Q2 2026","responsible_party":"SARB Communications / National Treasury"},
      {"step":5,"description":"12-month pass-through review: monitor BER inflation expectations survey, 10-year bond yields vs. inflation breakeven, and MPC repo rate trajectory relative to the new neutral rate estimate","timeline":"Q4 2026","responsible_party":"SARB MPC / National Treasury"},
      {"step":6,"description":"Parliamentary briefing to the Standing Committee on Finance (SCOF) and Portfolio Committee on Finance on the framework change and its fiscal dividend implications","timeline":"Q1 2026","responsible_party":"SARB Governor / National Treasury Director-General"}
    ]'::jsonb,
    'Announced November 2025; 12-month expectation anchoring period through 2026; full debt service saving benefit realised over 2–3 years as bond market adjusts',
    'No direct fiscal cost; estimated debt service saving of R15–20 billion/year over the medium term as the long-run inflation risk premium compresses (MTBPS 2025 estimate based on R5.4 trillion debt stock)',
    'None required. The SARB inflation target is set administratively by the Minister of Finance under Section 224(2) of the Constitution (coordinated monetary-fiscal objective). The South African Reserve Bank Act 90 of 1989 provides the operational independence framework. An amendment to the MPC Charter (SARB internal document) formalises the ±1pp tolerance band interpretation.',
    'No new legislation required. The Minister of Finance''s mandate letter to the SARB Governor, published as part of MTBPS documentation, constitutes the formal framework change. The MPC Charter amendment is an internal SARB governance document and requires no external approval process.',
    'Strong support across the fiscal policy establishment and GNU economic cluster. Labour-aligned economists (NUMSA, COSATU research) argue the lower target may sustain higher real interest rates in the near term — a transitional credibility risk. DA and ANC economic clusters both support the reform for its fiscal dividend. EFF opposes SARB independence on political-economy grounds but lacks blocking power.',
    'Chile adopted 3% ±1pp in 2000 — now the benchmark framework for emerging market central banks. Czech Republic, Peru, and South Korea operate similar frameworks with strong credibility. IMF 2023 Article IV review of SA monetary policy explicitly recommended a lower target to reduce the inflation risk premium. New Zealand (2% midpoint) and Australia (2–3% band) demonstrate tight bands with operational independence do not impair long-run growth.'
);

-- ── 3. ID 21: FATF Greylisting Exit — AML/CFT Legislative Package ────────────────────
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
    21,
    'South Africa formally exited the FATF grey list on 24 October 2025 after completing all 22 action items within 32 months. The remaining agenda is institutionalisation: ensuring the legislative reforms passed under pressure (General Laws Amendment Act, FIC Act amendments, NPO Act reforms) are fully operationalised and not reversed. The FATF regular follow-up report due 2027 is the next external accountability checkpoint. A correspondent banking relationship restoration and S&P sovereign outlook upgrade in November 2025 confirm the macroeconomic dividend is already materialising.',
    '[
      {"step":1,"description":"Operationalise beneficial ownership registers for companies (CIPC) and trusts (SARS): integrate with the FIC database and enable law enforcement query access","timeline":"Q1–Q2 2026","responsible_party":"CIPC / SARS / Financial Intelligence Centre (FIC)"},
      {"step":2,"description":"Expand the Asset Forfeiture Unit (AFU): fill 120 vacant investigator posts, implement case management system upgrade, and extend the Specialised Commercial Crime Unit (SCCU) to all 9 provinces","timeline":"Q1 2026–Q2 2027","responsible_party":"National Prosecuting Authority (NPA) / SAPS / Department of Justice"},
      {"step":3,"description":"Implement risk-based AML/CFT supervision framework for Designated Non-Financial Businesses and Professions (DNFBPs): real estate agents, attorneys, accountants, car dealers — sector-specific risk guidance papers to be gazetted","timeline":"Q1–Q4 2026","responsible_party":"FSCA / FIC / Law Society of SA / IRBA"},
      {"step":4,"description":"Non-Profit Organisation sector risk framework: operationalise the NPO Regulatory Framework published under the amended NPO Act; establish risk-based monitoring for high-risk NPOs without restricting legitimate civil society activity","timeline":"Q2 2026–Q1 2027","responsible_party":"Department of Social Development / FIC"},
      {"step":5,"description":"Prepare FATF Mutual Evaluation Follow-Up Report (due 2027): convene inter-agency NATJOINTS working group; compile implementation evidence disaggregated by action item; engage FATF Secretariat","timeline":"Q1–Q4 2027","responsible_party":"National Treasury / FIC / NATJOINTS"},
      {"step":6,"description":"Restore and maintain correspondent banking relationships: bilateral engagement with SWIFT, Citibank, Standard Chartered, and Deutsche Bank to confirm full reinstatement of tier-1 correspondent access at reduced KYC compliance premium","timeline":"Q1–Q2 2026","responsible_party":"National Treasury / SARB / FSCA / Banking Association SA"}
    ]'::jsonb,
    'Exit achieved October 2025; 18-month post-exit institutionalisation phase (Q4 2025–Q2 2027); FATF follow-up report 2027',
    'R4.2 billion committed across the 22 action item programme (2023–2025); ongoing annual cost approximately R800 million — AFU staffing ~R350m, FIC systems ~R200m, FSCA supervisory expansion ~R150m, NPA capacity ~R100m',
    'All primary legislation enacted: General Laws (AML/CFT) Amendment Act 22 of 2022; FIC Amendment Act (2023); NPO Act amendments (2024); Criminal Procedure Act amendments (crypto-asset seizure provisions). Secondary legislation outstanding: NPO Risk Framework Regulations (Department of Social Development); FSCA DNFBP sector-specific risk guidance papers (FIC Act framework).',
    'Outstanding secondary legislation: FSCA must gazette final DNFBP sector guidance papers under the FIC Act. Attorney AML obligations (attorneys as accountable institutions) remain contested — the Law Society of SA challenged aspects in the High Court. A compliance waiver regime for low-risk legal services is under negotiation between FIC and the Law Society. NPO Act Risk Framework Regulations were mandated by June 2025; delays represent a residual FATF compliance risk.',
    'Extremely high political salience — grey list exit is among the GNU''s most credible reform achievements. Cross-party support is strong. The primary risk is implementation fatigue: momentum that characterised 2023–2025 may dissipate with immediate FATF pressure removed. The 2027 FATF follow-up deadline provides the external accountability mechanism to sustain reform.',
    'Pakistan exited the FATF grey list in October 2022 after a 4-year programme; AFU-equivalent (NAB) staff tripling was credited as the decisive factor. Mauritius exited in 2021 after an 18-month programme — its trust registry reform directly parallels SA''s CIPC beneficial ownership register. Botswana (2021) demonstrated that politically committed governments can exit rapidly with targeted legislative packages even under resource constraints.'
);

-- ── 4. ID 24: SARS Capacity Expansion and Revenue Recovery ───────────────────────────
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
    24,
    'SARS''s R19.3 billion revenue outperformance in 2025 demonstrates that institutional capacity is the single highest-leverage fiscal reform. The 2024–2028 Strategic Plan targets expanding the tax base by 1.5 million taxpayers, recovering R150 billion in outstanding tax debt, and deploying AI-powered audit tools. VAT refund backlogs (harming business cash flow) and multinational transfer pricing (R60–80 billion annual base erosion gap) are the two highest-value compliance opportunities. Every R1 invested in SARS capacity returns R6–R10 in revenue — the best return on investment in the government portfolio.',
    '[
      {"step":1,"description":"Expand third-party data integration: mandate real-time data sharing from the Deeds Office (property transactions), banking institutions (bank transaction data under Section 70 of TAA), motor vehicle registration (eNaTIS), and short-term rental platforms (Airbnb, Booking.com)","timeline":"Q1–Q3 2026","responsible_party":"SARS / National Treasury / Department of Agriculture, Land Reform and Rural Development (Deeds)"},
      {"step":2,"description":"Deploy AI-powered audit selection system across all tax types: risk-score all registered taxpayers, prioritise Large Business Centre transfer pricing cases, and auto-flag VAT refund anomalies using machine learning","timeline":"Q1 2026–Q2 2027","responsible_party":"SARS IT Division / Large Business Centre (LBC)"},
      {"step":3,"description":"Staff the Large Business Centre to full complement: recruit 180 additional transfer pricing specialists and multinational risk analysts (currently 30% vacant); partner with SAICA for a professional secondment programme","timeline":"Q1–Q4 2026","responsible_party":"SARS Human Resources / LBC / South African Institute of Chartered Accountants (SAICA)"},
      {"step":4,"description":"VAT Refund Processing Reform: reduce average VAT refund processing time from 21 to 7 working days through automated verification algorithms; implement a ring-fenced VAT Refund Reserve Account","timeline":"Q2 2026–Q1 2027","responsible_party":"SARS VAT Division / SARS IT"},
      {"step":5,"description":"Outstanding tax debt recovery programme: segment the R150 billion debt book by collectability (viable vs. uncollectable); deploy dedicated commercial debt collectors for R50k–R500k segment; write off genuinely uncollectable pre-2015 Secondary Tax on Companies credits","timeline":"Q1 2026–Q4 2027","responsible_party":"SARS Debt Management / National Treasury"},
      {"step":6,"description":"BEPS Pillar Two legislation: introduce the global minimum tax (15%) for SA-based multinationals in the 2026 Taxation Laws Amendment Bill; implement Country-by-Country Reporting (CbCR) matching algorithm to detect base erosion","timeline":"Q1–Q4 2026 (legislation); ongoing enforcement","responsible_party":"SARS / National Treasury / Parliament (Finance Committee)"},
      {"step":7,"description":"Annual BRRR performance report to Portfolio Committee on Finance: report on tax base expansion, audit yield, VAT refund turnaround, and outstanding debt recovery against 2024–2028 Strategic Plan targets","timeline":"Annually (Q2 each year)","responsible_party":"SARS Commissioner / Portfolio Committee on Finance"}
    ]'::jsonb,
    '2024–2028 Strategic Plan horizon; quick wins (VAT refund reform, LBC staffing) within 12 months; full tax base expansion and BEPS Pillar Two enforcement by 2028',
    'SARS operating budget R7.2 billion (2025/26); additional revenue recovery investment R1.2 billion/year; OECD benchmark: each R1 invested in tax administration returns R6–R10 in additional revenue. MTBPS 2025 cites SARS capacity as the primary fiscal stabilisation mechanism in the absence of new tax rate increases.',
    'Tax Administration Act 28 of 2011 (Section 70 third-party data mandate — regulations update needed for digital platform operators); Income Tax Act amendment for BEPS Pillar Two (15% global minimum tax); Taxation Laws Amendment Act 2025 (annual omnibus bill process). No new primary legislation required for AI audit tools, LBC staffing, or VAT refund process redesign.',
    'National Treasury published a BEPS Pillar Two discussion paper in 2023; draft legislation expected in the 2026 Taxation Laws Amendment Bill (annual parliamentary process). The CbCR regime is already operational; the gap is cross-referencing CbCR submissions with income tax returns — a SARS IT integration project, not a legislative gap. Section 70 TAA regulations need updating to include digital platform operators and short-term rental intermediaries (a 2026 regulatory priority).',
    'SARS institutional recovery has rare genuine multiparty consensus — the Moyane-era collapse was politically damaging across all parties, and the Kieswetter-era recovery is publicly credited across the political spectrum. The PC on Finance BRRRs show strong parliamentary enthusiasm for SARS capacity investment. Resistance comes from the business community on VAT over-verification risks and from multinational corporations on Pillar Two compliance costs — neither has blocking power in the current GNU configuration.',
    'Rwanda Revenue Authority: 60% revenue increase over 5 years through IT investment and third-party data integration, growing the tax-to-GDP ratio from 10% to 17%. Kenya''s iTax system (2013) automated returns and cut compliance time 70% while expanding the tax base by 2 million taxpayers in 3 years. Georgia (2004–2012) achieved the fastest improvement in the IMF Tax Administration Diagnostic Assessment Tool (TADAT) history through radical institutional reform directly analogous to SARS''s post-Moyane recovery.'
);

-- ── 5. ID 114: National Small Enterprise Amendment Act: Ombud Operationalisation ──────
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
    114,
    'The National Small Enterprise Amendment Act (2023) established the SMME Ombud Service to give small businesses a dedicated, low-cost dispute resolution mechanism against government agencies and large corporations. The Ombud was appointed in early 2025. The current challenge is raising SMME awareness, establishing functional offices in all 9 provinces, and gazettiing the Regulations that define complaint procedures and enforcement powers.',
    '[
      {"step":1,"description":"Appoint Small Enterprise Ombud and deputy ombud; establish the national office in Pretoria and publish contact details, online complaint portal URL, and case lodgement process in the Government Gazette and via CIPC registration confirmation emails","timeline":"Q1 2025 (complete)","responsible_party":"Department of Small Business Development (DSBD)"},
      {"step":2,"description":"Establish regional offices or satellite service points in all 9 provinces, prioritising KwaZulu-Natal, Western Cape, and Gauteng as highest SMME-density provinces; utilise existing SEDA branch infrastructure where available","timeline":"Q2 2025–Q2 2026","responsible_party":"Small Enterprise Ombud Service / SEDA / DSBD"},
      {"step":3,"description":"Develop online complaint management system: integrated with BizPortal; allow complainants to track case status in real time; publish monthly case statistics disaggregated by province, sector, and complaint type","timeline":"Q2–Q4 2025","responsible_party":"Ombud Service IT / CIPC / DSBD"},
      {"step":4,"description":"SMME awareness campaign: partner with NAFCOC, SACCI, Black Business Council, and organised retail to disseminate Ombud Service contact details; include mandatory Ombud reference in all CIPC company registration confirmation communications","timeline":"Q2–Q4 2025","responsible_party":"DSBD Communications / Ombud Service"},
      {"step":5,"description":"Gazette Regulations under the Amendment Act governing: complaint procedures, investigation timelines (proposed maximum 90 working days), remedies available, and enforcement mechanisms for Ombud determinations against private parties","timeline":"Q1–Q3 2025","responsible_party":"DSBD Legal Services / Ombud Service / Department of Justice"},
      {"step":6,"description":"First Annual Report to Parliament: case statistics, systemic findings on most common SMME regulatory grievances, and recommendations for legislative or regulatory reform to Portfolio Committee on Small Business Development","timeline":"Q2 2026","responsible_party":"Small Enterprise Ombud / Portfolio Committee on Small Business Development"}
    ]'::jsonb,
    '12 months to full national operationalisation (Q1 2025–Q1 2026); annual reporting cycle thereafter',
    'R120 million/year operating budget (9 provincial offices, online systems, staff of approximately 80); funded within DSBD MTEF allocation; SEDA infrastructure sharing reduces capital cost by approximately R30 million',
    'National Small Enterprise Amendment Act 26 of 2023 (enacted — primary legal basis); Regulations under the Act to be gazetted by the Minister of Small Business Development; integration with National Credit Act 34 of 2005 complaint procedures for SMME financing disputes',
    'The Amendment Act grants the Ombud power to investigate, mediate, and make binding determinations. Enforcement of Ombud determinations against government departments requires referral to the Public Protector or court — a gap that may require a future amendment granting the Ombud direct enforcement power against organs of state. The Regulations must specify maximum investigation timelines and a fee structure (proposed: free for complainants with annual turnover below R10 million). A Section 10A regulation amendment is sufficient — no parliamentary process required for the fee structure.',
    'The Amendment Act passed with broad support in 2023. The Ombud concept has strong support from SMME advocacy organisations. Resistance from large corporations subject to Ombud jurisdiction is managed through the mediation-first approach. National Treasury has confirmed the operating budget is secure within the DSBD baseline. Primary risk is provincial office infrastructure costs exceeding projections in higher-cost metros.',
    'UK Small Business Commissioner (2017): received over 5,000 complaints in the first 3 years and identified late payment by large corporations as the dominant systemic issue — UK subsequently legislated mandatory 30-day payment terms for SME suppliers. Australia''s Australian Small Business and Family Enterprise Ombudsman (ASBFEO, 2016) achieved an 85% mediation success rate, avoiding court costs for both parties. Both models demonstrate that Ombud effectiveness depends on proactive systemic reviews, not just reactive case resolution.'
);

-- ── 6. ID 117: SMME Red Tape Reduction: BizPortal and Compliance Integration ─────────
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
    117,
    'BizPortal has reduced company registration time from 25 days to 5 days since 2021. The next phase integrates business licensing beyond company formation — the hardest regulatory burden for operational SMMEs. The R500 million MTBPS 2025 investment covers API integration with all licensing bodies, a Red Tape Reduction Unit within DSBD, and a deemed-approval licensing mechanism. Operation Vulindlela (Presidency/National Treasury) provides the institutional escalation mechanism for departmental non-compliance.',
    '[
      {"step":1,"description":"Publish mandatory API integration standards for all licensing bodies (national, provincial, and municipal); gazette under DSBD regulations with a compliance deadline of 30 June 2026","timeline":"Q2 2025–Q1 2026","responsible_party":"DSBD / CIPC / DTIC / COGTA"},
      {"step":2,"description":"Integrate BizPortal with remaining national agencies: Department of Health (food safety licences), DAFF (agricultural permits), DFFE (environmental authorisations), and sector-specific bodies (NRCS, SACAA, ITAC)","timeline":"Q3 2025–Q2 2026","responsible_party":"CIPC IT / DSBD / relevant sector departments"},
      {"step":3,"description":"Pilot deemed-approval licensing mechanism in 3 metros (Tshwane, eThekwini, Buffalo City Metropolitan Municipality): automatic licence issuance after 30 working days if no formal objection; evaluate outcomes before national rollout","timeline":"Q2–Q4 2026","responsible_party":"DSBD / COGTA / participating metros"},
      {"step":4,"description":"Establish Red Tape Reduction Unit within DSBD: 25-person investigative unit with authority to refer regulatory bottlenecks to the Presidency''s Operation Vulindlela for escalation above departmental level","timeline":"Q1–Q2 2026","responsible_party":"DSBD / Presidency (Operation Vulindlela)"},
      {"step":5,"description":"Publish South Africa''s first Business Regulatory Impact Register: comprehensive catalogue of all national and provincial regulations affecting SMMEs, with compliance cost estimates per regulation and sunset clause review schedule","timeline":"Q3 2026","responsible_party":"DSBD / National Treasury / Presidency"},
      {"step":6,"description":"Legislative amendment to Business Act 71 of 1991: introduce deemed-approval clause nationally (with carve-out for health, safety, and environmental licences); repeal obsolete licensing categories; mandate 30-working-day maximum processing for all business licences","timeline":"Q1–Q4 2026","responsible_party":"DTIC / DSBD / Parliament"}
    ]'::jsonb,
    '12–18 months to full BizPortal licensing integration (Q2 2025–Q4 2026); deemed-approval mechanism national rollout by 2027',
    'R500 million over 3 years (MTBPS 2025 SMME regulatory reform package): BizPortal API integration ~R180m, Red Tape Unit staffing ~R120m over 3 years, municipal support and training ~R100m, licensing register digital infrastructure ~R100m',
    'Amendment to Business Act 71 of 1991 (deemed-approval, maximum processing times, mandatory API integration obligation); DSBD Regulations under NSEA 2023 (Red Tape Unit investigative powers); repeal of Municipal Systems Act provisions requiring paper-based licence submissions',
    'The Business Act amendment is a Section 76 bill requiring NCOP concurrence (it affects local government competence and COGTA must co-sponsor). The deemed-approval clause will face resistance from environmental and health licensing bodies — a narrowly drafted carve-out for health, safety, and environmental categories is required for passage, but must be time-limited to prevent the carve-out expanding to swallow the reform. DTIC and DSBD should engage SALGA directly before second reading.',
    'Operation Vulindlela (Presidency/National Treasury joint unit) actively supports this reform agenda and has the political leverage to overcome departmental resistance. DA''s deregulation agenda and ANC''s SMME employment creation narrative create a strong GNU consensus. Municipal resistance through SALGA is the main structural obstacle — early SALGA engagement is essential to prevent an NCOP blockage on the Section 76 bill.',
    'Singapore''s GoBusiness portal (2020): single-window licensing for 300+ business types, reduced average licence approval time from 14 days to 1.5 days. Estonia''s e-Business Register: company formation completed in 18 minutes online — the global benchmark for digital business registration. New Zealand''s Business.govt.nz consolidated compliance hub reduced business compliance costs by NZ$1.1 billion over 5 years, validated by independent Treasury review.'
);

-- ── 7. ID 3: AGOA Retention and Post-AGOA Trade Diversification ──────────────────────
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
    3,
    'The one-year AGOA extension to September 2026 provides a narrow diplomatic window to negotiate either a longer-term renewal or, more strategically, bilateral sectoral arrangements (particularly for automotive). The 82% collapse in US auto exports in 2025H1 — driven by 30% Trump tariffs subsequently reduced under a 90-day pause — has accelerated the AfCFTA and EU-SACUM EPA diversification agenda. A post-AGOA strategic trade framework is the priority, run in parallel with ongoing US diplomatic engagement leveraging SA''s critical minerals assets (platinum, manganese, chrome).',
    '[
      {"step":1,"description":"Convene the AGOA/Trade Diversification Task Force: DTIC, DIRCO, National Treasury, ITAC, and automotive OEMs (BMW, Mercedes-Benz, Ford, Toyota); mandate quarterly reporting to Cabinet''s Economic Cluster","timeline":"Q1 2026","responsible_party":"DTIC / DIRCO / Presidency Economic Cluster"},
      {"step":2,"description":"Diplomatic engagement with US Trade Representative (USTR) on automotive sector carve-out: propose a USMCA-analogous mechanism for SA auto exports; leverage SA''s critical minerals endowment as a negotiating asset for IRA-linked trade concessions","timeline":"Q1–Q3 2026 (before AGOA expiry, September 2026)","responsible_party":"DIRCO / DTIC / SA Embassy Washington DC / Presidency"},
      {"step":3,"description":"Accelerate EU-SACUM EPA implementation: fast-track tariff schedule operationalisation for agri-processed goods (wine, citrus, rooibos, deciduous fruit, nuts) where EU market access improves relative to AGOA; publish an SME exporter toolkit and tariff rate lookup tool","timeline":"Q1–Q2 2026","responsible_party":"DTIC / ITAC / DAFF / National Treasury"},
      {"step":4,"description":"AfCFTA operationalisation: conclude Phase 2 negotiations (investment, competition, intellectual property); increase SA manufactured exports to African markets through APDP-linked export incentive for intra-African vehicle and components trade","timeline":"Q2 2026–Q4 2027","responsible_party":"DTIC / DIRCO / AfCFTA Secretariat (Accra)"},
      {"step":5,"description":"BRICS+ trade and payments infrastructure: negotiate local currency settlement mechanisms with China (SA''s largest single trading partner), India, and UAE; pilot rand-yuan direct settlement for mining commodity exports through a SARB-approved bilateral clearing arrangement","timeline":"Q2 2026–Q2 2027","responsible_party":"National Treasury / SARB / DIRCO"},
      {"step":6,"description":"Post-AGOA contingency plan: if AGOA not renewed post-September 2026, activate enhanced Automotive Investment Scheme (AIS) support for OEMs retooling for alternative export markets; engage WTO on MFN tariff fallback and safeguard mechanisms","timeline":"Q3 2026 (contingency trigger upon lapse)","responsible_party":"DTIC / National Treasury / ITAC"}
    ]'::jsonb,
    'Diplomatic engagement phase: Q1–Q3 2026 (AGOA renewal window); post-AGOA trade diversification framework: 18–36 months (2026–2027)',
    'AGOA diplomatic engagement: ~R50m (embassy capacity, trade negotiation staff); EU-SACUM EPA implementation support R200m/year; AfCFTA operationalisation R500m over 3 years; AIS automotive production support R4 billion/year (existing programme, enhanced if AGOA lapses without replacement)',
    'No new primary legislation for AGOA diplomatic engagement (executive trade policy authority). Customs and Excise Act amendment may be required for BRICS+ local currency settlement clearing mechanism. AfCFTA Phase 2 negotiations on investment will ultimately require bilateral investment treaty ratification by Parliament. ITAC tariff amendments for AfCFTA Guided Trade Initiative published as Government Gazette notices — not primary legislation.',
    'The rand-yuan direct settlement pilot requires a SARB Exchange Control Circular amendment (secondary legislation); National Treasury consultation under Section 9 of the Currency and Exchanges Act required. AfCFTA Phase 2 investment chapter will ultimately require Parliament to ratify bilateral investment treaties — a Section 231(2) process. ITAC tariff schedule amendments for AfCFTA are administrative notices under the International Trade Administration Act 71 of 2002.',
    'High political sensitivity: AGOA dependency on the US diplomatic relationship is a GNU vulnerability given SA-US tensions over Ukraine/Russia positioning, the ICJ Gaza case, and the ANC''s non-aligned foreign policy stance. The Presidency and DIRCO must balance AGOA engagement with strategic autonomy. Automotive OEMs are foreign-owned and have strong lobbying capacity but limited domestic political weight. The GNU''s economic growth imperative creates strong bipartisan support for trade diversification as insurance against AGOA loss.',
    'Mexico''s NAFTA-to-USMCA renegotiation (2018): successfully secured automotive carve-outs protecting maquiladora exports — SA can use Mexico''s rules-of-origin approach as a direct template for a US-SA automotive arrangement. Vietnam''s simultaneous EU FTA (EVFTA 2020) and CPTPP membership reduced single-market exposure and grew manufactured exports 40% in 3 years. Morocco''s automotive export strategy built a US$10 billion/year export cluster (Renault-Nissan hub) by combining AfCFTA access with EU EPA preferences — the most directly analogous case for SA''s APDP-backed assembly sector.'
);

-- ── 8. ID 53: University Certification Backlog Elimination ────────────────────────────
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
    53,
    'Approximately 350,000 certificates remain unissued from the 2017–2022 period, preventing graduates from accessing employment and professional registration. The key barrier is NSFAS outstanding debt being used as a lever to withhold transcripts — a legally questionable practice that DHET must end by Ministerial Directive. SAQA''s National Learners'' Records Database (NLRD) provides the digital infrastructure for a rapid bulk verification and issuance programme. This is a high-impact, low-cost quick win requiring political will rather than new resources.',
    '[
      {"step":1,"description":"DHET Ministerial Directive: instruct all public universities and TVET colleges to immediately release certificates for graduates who have met academic requirements, regardless of outstanding NSFAS debt; debt to be managed separately through SARS payroll integration","timeline":"Q1 2025 (urgent — should already be in process)","responsible_party":"Department of Higher Education and Training (DHET) / Minister of Higher Education"},
      {"step":2,"description":"Institutional backlog audit: each university and TVET college to submit a full backlog report (student name, qualification, completion year, reason for non-issuance) to DHET within 60 calendar days","timeline":"Q1 2025","responsible_party":"DHET / University Registrars / TVET College Principals"},
      {"step":3,"description":"SAQA NLRD digitisation: enrol all backlog students in the National Learners'' Records Database; issue digital certificates via SAQA''s online verification platform (directly accessible to employers without institutional intermediary)","timeline":"Q2 2025–Q1 2026","responsible_party":"SAQA / DHET / Universities"},
      {"step":4,"description":"NSFAS debt management reform: implement income-contingent repayment tracking via SARS payroll data integration; formally decouple outstanding NSFAS debt from academic records, transcripts, and certificate issuance","timeline":"Q2 2025–Q4 2026","responsible_party":"NSFAS / SARS / National Treasury"},
      {"step":5,"description":"Professional registration fast-track: partner with HPCSA, SACAP, ECSA, and SAICA to establish expedited professional registration pathways for graduates whose qualification verification was delayed by the backlog","timeline":"Q2–Q4 2025","responsible_party":"Professional councils / SAQA / DHET"},
      {"step":6,"description":"Quarterly progress reports to Portfolio Committee on Higher Education: backlog reduction numbers disaggregated by institution, province, and qualification type; red-flag institutions with sustained non-compliance for DHET intervention","timeline":"Quarterly from Q2 2025","responsible_party":"DHET / Portfolio Committee on Higher Education, Science and Technology"}
    ]'::jsonb,
    '6 months to clear 80% of the backlog (with Ministerial Directive and SAQA infrastructure); 12 months for full systemic reform (NSFAS debt decoupling); permanent solution operational by Q1 2026',
    'R80 million for SAQA digitisation and verification platform upgrade; R15 million for institutional compliance support; NSFAS debt management reform integrated into existing NSFAS IT modernisation budget (R2.3 billion MTEF allocation already approved)',
    'No new primary legislation required. DHET Ministerial Directive issued under the Higher Education Act 101 of 1997 (Section 41, relating to conditional grants to institutions) is the primary instrument. NSFAS Act 56 of 1999 regulations on debt recovery need amendment to permanently formalise the certificate-debt decoupling. South African Qualifications Authority Act 58 of 1995 provides the NLRD legal framework — no amendment needed.',
    'A DHET Ministerial Directive is the fastest instrument — no legislative process required, can be issued within days of political decision. The NSFAS Act regulation amendment (Section 10A) is gazetteable without a parliamentary process — only the Minister''s signature and a 30-day public comment period are required. This makes the legal pathway unusually swift relative to the scale of the problem being solved.',
    'Strong cross-party support; the Portfolio Committee on Higher Education has flagged this annually since 2021 with no effective DHET response. NSFAS institutional resistance — using debt leverage to ensure repayment — is the primary obstacle and requires clear Ministerial intervention with explicit legal basis. Universities broadly support certificate release as it improves their graduate employment metrics. Student organisations (SASCO, PASMA, SRC structures) strongly support. This is a low political-cost, high-impact win for the Minister of Higher Education.',
    'Kenya''s Higher Education Loans Board (Helb) successfully decoupled loan repayment from transcript release in 2016 through income-contingent repayment via Kenya Revenue Authority payroll data integration — the direct template for SA''s proposed NSFAS-SARS model. Nigeria''s NYSC corps member digital certificate system provides the SAQA verification model. Australia''s HECS-HELP income-contingent repayment system (the original global model) has never withheld credentials for debt — repayment operates entirely through the tax system, with no role for academic administration.'
);

-- ── 9. ID 113: African Medicines Agency Treaty Ratification and SAHPRA Strengthening ─
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
    113,
    'South Africa has ratified the AMA Treaty and SAHPRA is positioned as the continent''s lead reference regulatory authority. The implementation agenda focuses on: (1) clearing SAHPRA''s registration backlog through risk-stratified review lanes (critical for NHI benefit package design); (2) operationalising AMA reliance mechanisms that allow other African countries to rely on SAHPRA reviews, reducing continental regulatory duplication; and (3) combating the proliferation of substandard and falsified medicines under the September 2025 National Action Plan.',
    '[
      {"step":1,"description":"SAHPRA backlog clearance programme: implement risk-stratified review lanes — expedited for essential medicines and NHI benefit package medicines (target 90 days), standard for generics, enhanced review for novel biologicals and advanced therapy medicinal products","timeline":"Q1 2026–Q4 2027","responsible_party":"SAHPRA Medicines Evaluation and Registration Division / Department of Health"},
      {"step":2,"description":"Operationalise AMA reliance mechanism: develop a standard SAHPRA assessment package format compatible with AMA harmonised dossier requirements; onboard 5 African countries as initial reliance partners (Ghana, Kenya, Tanzania, Zimbabwe, Botswana)","timeline":"Q1–Q4 2026","responsible_party":"SAHPRA / AMA Secretariat (Yaoundé, Cameroon) / DIRCO"},
      {"step":3,"description":"Implement WHO Collaborative Registration Procedure (CRP): fast-track registration of all WHO-prequalified medicines to a maximum of 90 days (current average is 18 months) through a ministerial regulatory amendment","timeline":"Q1 2026 (regulatory process change only — no legislation required)","responsible_party":"SAHPRA Medicines Evaluation and Registration Division"},
      {"step":4,"description":"National Action Plan on Substandard and Falsified Medical Products: implement joint WHO-SAHPRA action plan (launched 30 September 2025); establish a rapid alert system linked to Interpol Project Pangea and the WHO Global Surveillance and Monitoring System","timeline":"Q4 2025–Q4 2026","responsible_party":"SAHPRA / Department of Health / SAPS / Interpol National Central Bureau"},
      {"step":5,"description":"eCTD dossier standardisation: complete migration to ICH eCTD v4.0 submission standard; publish updated labelling requirements aligned with ICH E3/E6 guidelines; attract international pharmaceutical manufacturers to use SA as their African market gateway registration jurisdiction","timeline":"Q2 2026–Q2 2027","responsible_party":"SAHPRA / ICH observer status engagement"},
      {"step":6,"description":"NHI benefit package medicines registration priority lane: SAHPRA and the National Department of Health to jointly identify medicines proposed for the NHI benefit package and establish a dedicated fast-track review process with a 90-day target","timeline":"Q1 2026–Q4 2027","responsible_party":"SAHPRA / National Department of Health / NHI Implementation Office"}
    ]'::jsonb,
    '18 months to full AMA reliance operationalisation and material backlog reduction (Q1 2026–Q2 2027)',
    'SAHPRA annual budget R350 million (2025/26); backlog clearance requires an additional R80 million/year for temporary reviewer capacity (contract pharmacists and clinical evaluators); AMA reliance programme R25 million/year for technical assistance and capacity sharing with partner regulatory authorities',
    'AMA Treaty ratified (complete). SAHPRA established under the South African Health Products Regulatory Authority Act 35 of 2015. No new primary legislation required. Regulatory amendments needed under the Medicines and Related Substances Act 101 of 1965: SAHPRA Regulations on fast-track registration lanes and WHO CRP implementation — published as Government Notice by the Minister of Health.',
    'The Medicines Act 101 of 1965 is the primary regulatory framework for SAHPRA''s registration procedures. Fast-track lane amendments to the Regulations can be made by the Minister of Health via Government Notice (faster than primary legislation; 30-day public comment period applies). The Counterfeit Goods Act 37 of 1997 and the Medicines Act Section 22G provide the legal framework for SAPS and SAHPRA anti-counterfeiting operations. The NHI Act 20 of 2023 creates the statutory obligation for the NHI Fund to procure only registered medicines — making SAHPRA''s backlog clearance a legal prerequisite for NHI implementation.',
    'SAHPRA strengthening has strong cross-party support and strong international support (WHO, African Union, Bill and Melinda Gates Foundation). NHI political dynamics are more complex — SAHPRA''s role in NHI benefit package design is contested by private sector interests, but the AMA reliance mechanism is operationally separate from NHI. Department of Health credibility post-COVID vaccine rollout (net positive despite distribution challenges) supports the reform agenda. Budget constraints are the main risk — SAHPRA is structurally under-resourced relative to the regulatory burden it carries.',
    'Tanzania''s TFDA became an AMA reliance pioneer: fast-tracked registration of over 200 medicines in 2023 using SAHPRA review packages, reducing average registration time from 24 months to 6 months for those products. Ghana FDA''s WHO CRP implementation (2022): 93 essential medicines registered in 90 days, used as the WHO model for African regulatory capacity. Australia''s TGA reliance on European EMA assessments (2016) reduced duplication effort by 60% while maintaining Australian-specific safety standards — the direct operational model for SAHPRA''s AMA reference authority role.'
);

-- ── 10. ID 29: AML/CFT Implementation Monitoring — NCOP and Provincial Layer ─────────
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
    29,
    'South Africa''s FATF grey list exit (October 2025) was the national-level achievement. The remaining structural gap is provincial and local implementation: DNFBPs (estate agents, attorneys, accountants, car dealers) in provinces are the weakest link in the AML/CFT compliance chain, with significant variation in suspicious transaction reporting rates across provinces. The NCOP Select Committee on Security and Justice is the constitutional oversight mechanism for provincial implementation monitoring, and this programme gives it the data and mandate to exercise that role effectively.',
    '[
      {"step":1,"description":"NCOP Select Committee monitoring programme: schedule quarterly briefings from National Treasury, FIC, and SAPS on provincial DNFBP compliance rates and Suspicious Transaction Report (STR) volumes; require provincial COGTA MECs to appear annually","timeline":"Q1 2026–Q4 2027 (ongoing)","responsible_party":"NCOP Select Committee on Security and Justice / National Treasury / FIC"},
      {"step":2,"description":"Provincial FIC compliance roadshow: FIC regional offices to conduct AML/CFT compliance workshops with provincial DNFBP associations (Law Society provincial branches, SAIPA, IEASA — estate agents) in all 9 provinces, prioritising Eastern Cape and KwaZulu-Natal","timeline":"Q1–Q4 2026","responsible_party":"Financial Intelligence Centre / Provincial FIC Regional Offices"},
      {"step":3,"description":"Suspicious Transaction Report (STR) provincial monitoring: publish quarterly STR statistics disaggregated by province and DNFBP sector; identify provinces with systematic under-reporting relative to economic activity and investigate whether it reflects compliance failure or structural issues","timeline":"Q1 2026 onwards","responsible_party":"Financial Intelligence Centre / National Treasury"},
      {"step":4,"description":"Municipal AML capacity programme: train municipal finance officers on AML obligations for cash-intensive municipal services (rates payments, liquor licence fees, business permits); partner with SALGA for a standardised training programme and accreditation scheme","timeline":"Q2 2026–Q2 2027","responsible_party":"FIC / COGTA / South African Local Government Association (SALGA)"},
      {"step":5,"description":"Prepare provincial implementation chapter for FATF 2027 Follow-Up Report: document STR volumes, DNFBP on-site inspection rates, provincial asset forfeiture outcomes, and NPO sector compliance data, disaggregated by province","timeline":"Q1–Q4 2027","responsible_party":"National Treasury / FIC / NPA / NATJOINTS"},
      {"step":6,"description":"Beneficial ownership register provincial outreach: CIPC to conduct targeted outreach to provincial professional service providers (accountants, attorneys) on company and trust beneficial ownership registration requirements and the legal consequences of non-compliance","timeline":"Q1–Q3 2026","responsible_party":"CIPC / FIC / Law Society of SA / SAICA"}
    ]'::jsonb,
    'Ongoing monitoring programme tied to FATF follow-up cycle (Q1 2026–Q4 2027); provincial compliance rates should reach >80% STR compliance for all DNFBP sectors by 2027',
    'FIC provincial operations: R150 million/year (existing budget); SALGA training partnership: R15 million; CIPC outreach programme: R10 million; net marginal cost above existing FIC baseline approximately R30 million/year — one of the lowest cost-per-impact ratios in the reform portfolio',
    'All primary legislation enacted. Outstanding secondary legislation: NPO Act Risk Framework Regulations (Department of Social Development, mandated by June 2025 — delayed); FSCA DNFBP sector-specific guidance papers under the FIC Act. No new primary legislation required for the provincial monitoring programme.',
    'The NPO Act Risk Framework Regulations are the most important outstanding secondary legislation — governing how civil society is supervised for AML/CFT risk without stifling legitimate non-profit activity. The Department of Social Development was mandated to gazette these by June 2025; delays represent a residual FATF compliance risk ahead of the 2027 review. The attorney STR obligations under FIC Act Section 29 remain subject to legal challenge by the Law Society — an FIC amicus brief defending the obligations is being prepared for the High Court proceedings.',
    'Provincial monitoring is politically less sensitive than the national legislative reforms, but faces implementation fatigue. The NCOP has historically been a weaker oversight body than the National Assembly; strengthening NCOP monitoring capacity on this docket requires active leadership from the Select Committee chairperson and proactive scheduling by the NCOP Programming Committee. ANC provincial governments in KZN and Eastern Cape — where DNFBP compliance rates are lowest — may resist scrutiny of politically connected entities. The external accountability of the 2027 FATF follow-up report is the most effective political lever to maintain momentum.',
    'Pakistan''s FATF exit programme (2022) specifically required provincial monitoring through National Counter Terrorism Authority (NACTA) provincial coordinators — directly parallels SA''s NCOP-FIC monitoring structure. The UK''s Joint Money Laundering Steering Group (JMLSG) industry-led guidance model for DNFBPs (rather than purely regulatory mandates) improved voluntary compliance rates by 40% in 3 years — FIC could adapt this through the professional associations (Law Society, SAIPA, IEASA) rather than relying solely on inspection-based enforcement.'
);
