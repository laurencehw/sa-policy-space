-- ============================================================
-- 2025-2026 Policy Update Migration
-- Generated: 2026-03-23
-- Source: FATF Plenary Oct 2025, MTBPS Nov 2025, REIPPP BW7,
--         Q4 2025 QLFS, Operation Vulindlela Phase II progress,
--         S&P sovereign review Nov 2025, AfCFTA Jan 2026
-- Format: Supabase/PostgreSQL (uses NOW() for timestamps)
-- SQLite version: replace NOW() with datetime('now')
-- ============================================================

-- ============================================================
-- 1. FATF GREYLIST EXIT — 24 October 2025
-- ============================================================

-- id=21: FATF Greylisting Exit — AML/CFT Legislative Package
-- SA formally exited the FATF grey list at the Paris Plenary, 24 Oct 2025,
-- completing all 22 action items in 32 months.
UPDATE policy_ideas SET
  current_status     = 'implemented',
  description        = 'South Africa was placed on the FATF grey list in February 2023 following a mutual evaluation that found deficiencies in anti-money laundering and counter-terrorism financing controls. The government''s response was a coordinated inter-agency reform programme — led by the NATJOINTS structure — covering 22 action items across legislative reform and institutional capacity. Key legislative changes included: the General Laws (Anti-Money Laundering and Combating Terrorism Financing) Amendment Act (beneficial ownership registers for companies and trusts), amendments to the FIC Act expanding accountable institutions and supervisory obligations, reform of the Non-Profit Organisations Act to introduce risk-based supervision of the NPO sector, and imposition of AML obligations on the legal profession. Institutional changes included expansion of the Asset Forfeiture Unit, upgraded Financial Intelligence Centre systems, and dedicated SAPS Commercial Crime capacity. South Africa formally exited the FATF grey list at the FATF Plenary in Paris on 24 October 2025 — the 22nd and final action item completed within 32 months, faster than the majority of greylisted jurisdictions. The exit restored correspondent banking relationships, reduced cross-border payment compliance costs, and contributed to the S&P sovereign outlook upgrade in November 2025. SA is now in FATF''s regular enhanced follow-up cycle with a compliance report due in 2027.',
  key_quote          = 'South Africa''s exit from the FATF grey list on 24 October 2025 — completing all 22 action items in 32 months — demonstrates that a constitutional democracy can execute a comprehensive AML/CFT reform programme while maintaining the rule of law. — FATF Plenary Statement, Paris, October 2025',
  feasibility_note   = 'Fully implemented. Exit confirmed 24 October 2025 at FATF Plenary, Paris. SA now in regular enhanced follow-up cycle; next progress report to FATF due 2027. Post-exit risks: provincial-level AML supervision gaps (estate agents, motor dealers, cash-intensive businesses) and NPO sector compliance remain ongoing enforcement challenges.',
  updated_at         = NOW()
WHERE id = 21;

-- id=29: AML/CFT Implementation Monitoring — NCOP and Provincial Layer
UPDATE policy_ideas SET
  current_status     = 'implemented',
  feasibility_note   = 'Post-greylisting: SA exited the FATF grey list 24 October 2025 after completing all 22 action items. The NCOP and provincial oversight layer (PCAS mechanism) now transitions from remediation monitoring to a sustained compliance assurance role. FATF will review SA''s compliance in 2027. Key residual gap: provincial supervisors of estate agents, motor dealers, and cash-intensive SMEs require capacity support to sustain AML/CFT compliance standards achieved during the greylisting period.',
  updated_at         = NOW()
WHERE id = 29;

-- ============================================================
-- 2. ENERGY SECTOR PROGRESS
-- ============================================================

-- id=20: Energy Bounce-Back and Industrial Energy Self-Generation
-- 300+ consecutive days without load-shedding as of early 2026; EAF ~69%
UPDATE policy_ideas SET
  current_status     = 'implemented',
  feasibility_note   = 'Milestone achieved: as of early 2026, South Africa has recorded over 300 consecutive days without load-shedding — a historic reversal from the 2023 nadir of 335 stages of Stage 6 shedding. Eskom''s Energy Availability Factor (EAF) improved from approximately 58% in 2023 to approximately 69% in 2025. Private sector self-generation investment reached R30.78 billion across 1,401 MW of embedded generation capacity. The Energy Bounce-Back Loan Guarantee Scheme and accelerated depreciation allowances materially accelerated uptake. Remaining structural risks: the ageing coal fleet is fragile (unplanned outage rate above benchmark), and transmission constraints limit full integration of the growing renewable base. The end of load-shedding does not signal the end of energy risk — it signals the beginning of a more complex grid management challenge.',
  updated_at         = NOW()
WHERE id = 20;

-- id=35: Integrated Resource Plan 2024 — Bid Window 7
UPDATE policy_ideas SET
  feasibility_note   = 'Significant progress: REIPPP Bid Window 7 awarded 3,940 MW of renewable energy projects (wind, solar PV, and battery storage) in 2025, with financial close expected 2026. The 300+ days without load-shedding indicates that private embedded generation combined with Eskom''s EAF recovery has stabilised supply ahead of formal IRP procurement timelines. IRP 2024 remains under NERSA review. Key risk: transmission grid capacity must expand to absorb BW7 projects — the NTCSA capitalisation programme (id=62) is on the critical path. The end of load-shedding does not reduce the urgency of the IRP investment programme; it creates the window to build the energy system SA needs rather than the emergency generation it required.',
  updated_at         = NOW()
WHERE id = 35;

-- id=58: Eskom Restructuring — Unbundling approved Cabinet December 2025
UPDATE policy_ideas SET
  current_status     = 'implemented',
  feasibility_note   = 'Major milestone: Eskom unbundling formally approved by Cabinet in December 2025. The National Transmission Company of South Africa (NTCSA) received its operating licence under the Electricity Regulation Act, completing the legal separation of transmission from generation and distribution. Generation and distribution subsidiaries remain under the Eskom Group structure. The 300+ days without load-shedding validates the restructuring rationale — Eskom''s governance and operational reforms under the restructuring programme have contributed to the EAF improvement from 58% to approximately 69%. Remaining contested phase: Regional Electricity Distributor (RED) restructuring, which is linked to the municipal revenue protection debate and has no timeline commitment.',
  updated_at         = NOW()
WHERE id = 58;

-- id=61: Eskom Debt Relief Conditions and Restructuring Framework
UPDATE policy_ideas SET
  feasibility_note   = 'Progress on conditions: the R254 billion Eskom debt relief framework (MTBPS 2025) is being disbursed against restructuring milestones. EAF improved to approximately 69% — approaching the 70% threshold linked to second-tranche conditions. NTCSA licensing and Cabinet unbundling approval (December 2025) are key milestones achieved. Conditions outstanding: NTCSA financial capitalisation (separation of balance sheet from Eskom Group), and EDI restructuring progress (linked to municipal electricity distribution reform). The no-load-shedding record reduces the political risk of restructuring-related disruption.',
  updated_at         = NOW()
WHERE id = 61;

-- id=62: National Transmission Company Capitalisation and Grid Expansion
-- NTCSA received its operating licence in 2025
UPDATE policy_ideas SET
  current_status     = 'under_review',
  feasibility_note   = 'NTCSA licensed: received operating licence under the Electricity Regulation Act in 2025, confirming legal and operational separation from Eskom generation. Financial capitalisation — estimated R180 billion over 10 years for transmission infrastructure — is the next critical milestone, targeted for 2026/27. Battery Energy Storage Programme Round 1 procurement is underway. NERSA approval processes for transmission projects remain a 2–4 year bottleneck requiring regulatory reform. The grid expansion investment is the binding constraint on absorbing Bid Window 7''s 3,940 MW of new renewable capacity.',
  updated_at         = NOW()
WHERE id = 62;

-- id=49: Renewable Energy Grid Integration and Transmission Expansion
UPDATE policy_ideas SET
  feasibility_note   = 'Progress: NTCSA licensed (2025), separating transmission governance from Eskom. BW7 awarded 3,940 MW to be integrated into the grid by 2027–2028. Grid Connection Code update underway. Battery Storage Programme Round 1 in procurement phase. Key bottleneck: NERSA approval timelines for transmission infrastructure (2–4 years) lag investment requirements. The Transmission Development Plan 2024–2033 requires R180 billion — partially addressed by Eskom debt relief conditionality and NTCSA capitalisation roadmap.',
  updated_at         = NOW()
WHERE id = 49;

-- ============================================================
-- 3. FISCAL CONSOLIDATION
-- ============================================================

-- id=23: Fiscal Consolidation and Debt Stabilisation
-- Debt-to-GDP ~78.9%, two primary surpluses, VAT at 15% (increase withdrawn),
-- S&P outlook upgrade Nov 2025
UPDATE policy_ideas SET
  description        = 'South Africa''s fiscal consolidation programme — anchored in the 2022 MTBPS and subsequent Medium-Term Expenditure Frameworks — has produced two consecutive primary budget surpluses (2023/24 and 2024/25 fiscal years), the first such achievement since the Mbeki era. The debt-to-GDP ratio is stabilising at approximately 78.9% — well below the 2022 trajectory that projected debt peaking above 85% of GDP. Key consolidation mechanisms: above-projection SARS revenue performance (R54 billion in additional collections in 2024/25), reduced Eskom emergency transfers following the structured debt relief framework, and public service compensation moderation. A proposed VAT increase from 15% to 15.5% was announced in Budget 2025 but subsequently withdrawn following intense parliamentary opposition and business confidence concerns; VAT remains at 15%. S&P Global upgraded South Africa''s sovereign credit outlook from negative to stable in November 2025 (rating maintained at BB-), citing fiscal consolidation progress, FATF grey list exit, and reduced load-shedding as structural improvements. The consolidation is now entering a more politically constrained phase: social spending pressures (SRD grant permanence, NHI costing, PEPFAR transition financing) create upward expenditure pressures that will test the medium-term framework from 2026 onwards.',
  feasibility_note   = 'Significant progress: two consecutive primary surpluses achieved. Debt-to-GDP stabilising at ~78.9%. S&P upgraded sovereign outlook to stable November 2025. VAT increase withdrawn — VAT remains at 15%. Key risks for 2026: SRD grant permanence decision, NHI costing, commodity revenue volatility, and municipal bailout pressures. The S&P upgrade is credit-positive but investment-grade status (BBB-) remains 2–3 notches away without sustained growth and further consolidation.',
  updated_at         = NOW()
WHERE id = 23;

-- ============================================================
-- 4. SARB INFLATION TARGET REFORM (NEW ENTRY)
-- MTBPS November 2025: 3-6% band replaced by 3% point target (±1pp)
-- ============================================================

INSERT INTO policy_ideas (
  id, title, description, theme, binding_constraint,
  first_raised_date, current_status,
  feasibility_rating, growth_impact_rating,
  responsible_department, key_quote,
  source_committee, reform_package, time_horizon,
  created_at, updated_at
) VALUES (
  124,
  'SARB Inflation Target Reform — Point Target at 3% (±1pp)',
  'At the Medium-Term Budget Policy Statement delivered on 13 November 2025, the South African Reserve Bank and National Treasury jointly announced a reform to South Africa''s monetary policy framework: the existing 3–6% inflation target band, in place since 2000, would be replaced by a point target of 3% with a tolerance band of ±1 percentage point, effective from the 2025/26 monetary policy cycle. The change is the most significant reform to the SARB''s inflation targeting framework in 25 years. Since the target''s introduction, headline CPI has averaged approximately 5.8% per annum — consistently gravitating toward the upper end of the band — implying a structural inflation risk premium embedded in long-term bond yields and a higher neutral real interest rate than necessary. A tighter, lower target aligns South Africa with best-practice inflation targeting frameworks in peer emerging market central banks (South Korea: 2% target; Chile: 3% ±1pp; Czech Republic: 2% ±1pp; Peru: 2% ±1pp). The SARB''s Monetary Policy Committee retains operational independence in achieving the target. By anchoring inflation expectations closer to 3%, the reform is expected to: reduce the inflation risk premium in the 10-year government bond yield by 30–50 basis points over a 3-year period, lower the neutral real repo rate, and create space for a sustained monetary easing cycle without triggering credibility concerns. The 2025 MTBPS fiscal framework note estimated that a 1 percentage point reduction in long-run inflation reduces the annual debt service cost on the R5.4 trillion stock of government debt by approximately R15–20 billion annually.',
  'Fiscal policy',
  'fiscal_constraint',
  '2025-11-13',
  'implemented',
  5,
  4,
  'South African Reserve Bank / National Treasury',
  'Replacing the 3–6% inflation band with a 3% point target is the most significant monetary policy reform in South Africa in two decades — it signals that low, stable prices are a policy goal, not just a hope. — MTBPS 2025, National Treasury, November 2025',
  'Finance',
  2,
  'quick_win',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  description    = EXCLUDED.description,
  feasibility_note = 'Implemented: announced at MTBPS November 2025, effective immediately. SARB''s MPC now formally targets 3% CPI (±1pp). First test is the 2026 interest rate cycle. Market reaction post-announcement: long bond yields compressed modestly, consistent with improved credibility. Political risk: low — SARB constitutional independence insulates the target from political interference. Directly linked to S&P sovereign outlook upgrade and fiscal consolidation narrative.',
  updated_at     = NOW();

-- ============================================================
-- 5. OPERATION VULINDLELA PHASE II
-- Spectrum auction (R14.4B), 11 private rail operators,
-- water licensing reform, visa reforms, expanded to 7 areas
-- ============================================================

-- id=59: Transnet Freight Rail and Port Private Sector Participation
UPDATE policy_ideas SET
  feasibility_note   = 'OV Phase II progress: 11 private rail operators have been granted third-party access to the Transnet freight network under Operation Vulindlela Phase II as of 2025 — a structural shift from zero private operators in 2022. Chrome and manganese exporters in the Northern Cape and North West are primary beneficiaries. Spectrum auction: R14.4 billion raised in the 2024 spectrum auction (Operation Vulindlela Phase I deliverable), providing the bandwidth foundation for Transnet''s digital logistics platform. Water licensing reform (NWRS digitalisation) and visa reform (critical skills, e-visa expansion) are additional OV Phase II workstreams expanding the programme to 7 reform areas. Port concessioning for Durban and Ngqura container terminals remains the key outstanding deliverable; productivity at Durban (23 moves/hour vs. global benchmark 35+) is the primary logistics cost constraint.',
  updated_at         = NOW()
WHERE id = 59;

-- id=79: Freight Rail Third-Party Access and Transnet Separation
UPDATE policy_ideas SET
  feasibility_note   = 'Significant progress: 11 private rail operators are operating on the Transnet network under third-party access arrangements as of 2025 — the core OV Phase II rail deliverable. This is a structural change from 2022 when no private operators had network access. Chrome, manganese, and agricultural commodity flows (Northern Cape, North West, Western Cape) are benefiting from improved capacity and scheduling. Full third-party access legislation (Transnet Amendment Act) remains pending in Parliament. The R180 billion rail maintenance backlog is the medium-term constraint on throughput expansion — network reliability, not access rights, will be the binding constraint by 2027.',
  updated_at         = NOW()
WHERE id = 79;

-- ============================================================
-- 6. TRADE DEVELOPMENTS
-- AGOA extended 1 year, Trump tariffs (30%→10%),
-- auto exports down 82%, AfCFTA tariff schedule Jan 2026
-- ============================================================

-- id=3: AGOA Retention and Post-AGOA Trade Diversification
UPDATE policy_ideas SET
  description        = 'AGOA (African Growth and Opportunity Act) provides duty-free access to the US market for approximately 1,800 South African product lines. The programme, set to expire in September 2025, was extended for one year to September 2026 following intensive SA diplomatic engagement — a shorter extension than the multi-year renewal sought by industry and trade officials. This limited renewal is occurring against a backdrop of sharply deteriorating trade relations: the Trump administration announced 30% tariffs on South African goods in April 2025 (subsequently reduced to 10% under a 90-day pause arrangement). SA''s automotive exports to the US — AGOA''s highest-value category, accounting for R40+ billion annually from BMW Rosslyn, Mercedes-Benz East London, Ford Silverton, and Toyota Prospecton — fell approximately 82% year-on-year in 2025H1, representing a structural shock to the APDP-supported assembly sector. The collapse in US auto exports has accelerated the imperative of the JET trade diversification agenda: expanding market access under the EU-SACU-Mozambique Economic Partnership Agreement (SACUM EPA), developing AfCFTA industrial trade flows, and growing BRICS+ payment and trade infrastructure. The one-year AGOA extension provides limited planning certainty; a post-AGOA trade framework is now the strategic priority. Diplomatic engagement with the Trump administration to negotiate sectoral carve-outs for automotive production (analogous to the USMCA carve-out for Canadian and Mexican auto exports) is ongoing.',
  feasibility_note   = 'Status as of early 2026: AGOA extended 1 year to September 2026 (shorter than sought). US tariffs on SA goods at 10% (down from initial 30% announcement). Automotive exports to US down approximately 82% year-on-year — a critical structural shock to APDP assemblers. SACUM EPA, AfCFTA, and BRICS+ diversification are now industrial survival imperatives. S&P upgrade and FATF exit have improved SA''s diplomatic credibility in trade negotiations.',
  updated_at         = NOW()
WHERE id = 3;

-- id=4: AfCFTA Implementation and Intra-African Trade Expansion
UPDATE policy_ideas SET
  feasibility_note   = 'Significant milestone: AfCFTA tariff schedules became effective January 2026, covering the first tranche of tariff liberalisation across 54 African Union member states. This is a structural opportunity for South African manufacturing — particularly automotive, agro-processing, chemicals, and pharmaceuticals — as US AGOA access deteriorates due to Trump tariff policy. SA''s R-CTFL, steel, and auto master plans are directly linked to the AfCFTA industrial trade rationale. Key remaining bottlenecks: non-tariff barriers (divergent product standards, rules of origin complexity, customs procedure harmonisation) are now the binding constraints on actualising intra-African trade gains. The AU''s Pan-African Payment and Settlement System (PAPSS) is operational in pilot phase and will reduce the foreign currency transaction costs that currently suppress cross-border trade.',
  updated_at         = NOW()
WHERE id = 4;

-- id=5: EV White Paper — Auto exports down 82%, US tariff shock
UPDATE policy_ideas SET
  feasibility_note   = 'Critical risk materialised: SA automotive exports to the US fell approximately 82% in 2025H1 following US tariff imposition (30%, subsequently reduced to 10%), devastating APDP-supported assemblers (BMW Rosslyn, Mercedes-Benz, Ford, Toyota). The EV White Paper transition framework must now accommodate this severe external demand shock alongside the domestic EV transition mandate. AGOA extension for only one year (to September 2026) provides insufficient planning certainty for new EV model investment decisions requiring 3–5 year capital commitments. The domestic EV market transition target (phasing out new ICE vehicle sales by 2035) remains in the White Paper but now requires revised financing assumptions given the loss of US export revenue. AfCFTA and SACUM EPA markets are the strategic alternative to US dependency for SA''s automotive export volumes.',
  updated_at         = NOW()
WHERE id = 5;

-- ============================================================
-- 7. UNEMPLOYMENT — Q4 2025 QLFS
-- Official: 31.4% | Youth (15-34): 58.5%
-- ============================================================

-- id=26: Inclusive Growth Spending Review — Labour Market Context
UPDATE policy_ideas SET
  feasibility_note   = 'Q4 2025 QLFS: official unemployment rate 31.4% (narrow definition, unchanged from Q3 2025); youth unemployment (15–34) at 58.5%; expanded unemployment rate (including discouraged workers) approximately 42.5%. Labour force participation rate: 56.3%. The end of load-shedding has supported services sector employment recovery, but manufacturing employment continues to contract — partly reflecting the automotive export shock (US tariffs), CTFL import competition, and ongoing capital deepening in mining. The SRD grant (R370/month) covers approximately 9.3 million beneficiaries and represents a de facto basic income floor, but is not linked to work-seeking or skills development activities. The Inclusive Growth Spending Review should prioritise: expansion of the Employment Tax Incentive (ETI) for youth workers, the Jobs Fund''s fourth investment round, EPWP reform toward skills-pathway integration, and SMME employer de-registration cost reduction.',
  updated_at         = NOW()
WHERE id = 26;
