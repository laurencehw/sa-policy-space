-- Migration 008: Enrich international_comparisons with textbook-quality fields
-- Adds approach, gdp_impact, timeline, lessons_for_sa, sources columns.
-- Populates them for the 17 textbook entries from data/international_comparisons.json
-- (originally inserted as Section O of migration 005).
--
-- Match strategy: country + reform_year (unique for all 17 except Rwanda 2000,
-- which is disambiguated by outcome_summary ILIKE '%USD 225%').

-- ── 1. Schema changes ─────────────────────────────────────────────────────────

ALTER TABLE international_comparisons
  ADD COLUMN IF NOT EXISTS approach       TEXT,
  ADD COLUMN IF NOT EXISTS gdp_impact     TEXT,
  ADD COLUMN IF NOT EXISTS timeline       TEXT,
  ADD COLUMN IF NOT EXISTS lessons_for_sa TEXT,
  ADD COLUMN IF NOT EXISTS sources        TEXT[];

-- ── 2. Populate the 17 textbook entries ──────────────────────────────────────

-- O1. Kenya — M-Pesa and Mobile Financial Inclusion (2007)
UPDATE international_comparisons SET
  approach        = 'Kenya''s Central Bank granted Safaricom a non-bank mobile money licence in 2007, allowing M-Pesa to operate outside traditional banking regulation. The government resisted pressure from commercial banks to restrict the service. By 2020, over 96% of households had M-Pesa access and the system processed transactions equivalent to ~50% of GDP annually. M-Shwari (mobile credit) followed, providing collateral-free micro-loans to 20+ million borrowers.',
  gdp_impact      = '~1.5–2 pp GDP growth contribution (IMF, 2021)',
  timeline        = '3 years to scale (2007–2010); full ecosystem maturity by 2015',
  lessons_for_sa  = 'SA''s rigid banking-adjacent regulatory framework and lack of interoperability between mobile wallets suppresses fintech-driven SMME credit. The Intergovernmental Fintech Working Group has recommended a sandbox approach; Kenya''s experience suggests early licensing combined with regulatory patience — not restriction — is the growth path. The SARB''s Project Khokha is promising but not yet operationalised at M-Pesa scale.',
  sources         = ARRAY['IMF Article IV Kenya 2021', 'World Bank Findex 2021', 'Jack & Suri (2016), Science']
WHERE country = 'Kenya' AND reform_year = 2007;

-- O2. Kenya — National Fibre Backbone and Digital Economy Strategy (2009)
UPDATE international_comparisons SET
  approach        = 'Kenya invested in a national fibre optic cable network (National Optic Fibre Backbone Infrastructure — NOFBI) beginning 2009, combined with the landing of submarine cables (TEAMS, SEACOM, EASSy). The government mandated open access on the backbone and set aggressive rural connectivity targets. The Konza Technopolis was designated a special tech zone with simplified licensing and tax incentives.',
  gdp_impact      = 'Digital sector ~8% of GDP by 2022; startup investment USD 1.1bn in 2021',
  timeline        = '5–8 years for infrastructure maturity; ecosystem formation takes 10+ years',
  lessons_for_sa  = 'SA Connect Phase 2 has the right architecture (open access backbone) but has been hampered by execution delays and underfunding. Kenya''s model suggests that government-anchored backbone investment, combined with open access mandates and SEZ-style tech zones, creates the platform for private ecosystem formation. SA''s spectrum release bottleneck (5G licensing) is a direct analogue to Kenya''s 2010 WiMax licensing controversy — resolved by a regulator that prioritised access over incumbents.',
  sources         = ARRAY['World Bank ICT Kenya Assessment 2022', 'GSMA Mobile Economy Africa 2023', 'Kende-Robb & Mark (2021), Brookings']
WHERE country = 'Kenya' AND reform_year = 2009;

-- O3. Botswana — Institutional Quality and the Botswana Model (1966)
UPDATE international_comparisons SET
  approach        = 'At independence in 1966, Botswana was one of the world''s poorest countries. The BDP government made two foundational choices: it created an independent Minerals Management department staffed by meritocratic civil servants (resisting patronage appointments), and it established the Pula Fund — a sovereign wealth fund — to sterilise diamond revenue windfalls. Recruitment into senior civil service was based on qualifications and competitive examination. Corruption prosecutions followed discovery of state capture attempts.',
  gdp_impact      = '9%+ p.a. GDP growth for 25 years; upper-middle income status by 2000',
  timeline        = 'Institutional foundations established within 5–10 years of independence; results visible within 15 years',
  lessons_for_sa  = 'SA faces a comparable governance challenge post-state-capture: rebuilding meritocratic institutions under political pressure. Botswana''s experience shows that early investment in bureaucratic quality — not just legislation — is decisive. The NPC''s National Development Plan calls for a developmental state along these lines, but SA''s patronage networks are more entrenched than Botswana''s were. The DPSA professionalisation agenda and Public Service Amendment Bill are the SA analogues; the Botswana case suggests they must be backed by credible consequence management.',
  sources         = ARRAY['Acemoglu, Johnson & Robinson (2003), AER', 'Harvey & Lewis (1990) Oxford', 'IMF Botswana Article IV 2022']
WHERE country = 'Botswana' AND reform_year = 1966;

-- O4. Botswana — Pula Fund and Counter-Cyclical Fiscal Rule (1994)
UPDATE international_comparisons SET
  approach        = 'Botswana''s Pula Fund was established in 1994 to save diamond export revenues that exceeded the economy''s absorptive capacity. A statutory fiscal rule required that non-mining recurrent expenditure not exceed 90% of recurrent revenues. The fund grew to USD 7.9 billion (2022), equivalent to ~75% of GDP. Withdrawals require parliamentary approval and are capped at the long-run sustainable income from diamond revenues.',
  gdp_impact      = 'Fiscal surpluses sustained 3–5 years; debt-to-GDP <20% through 2020s',
  timeline        = 'Fiscal rules operationalised within 2 years; fund reached scale by early 2000s',
  lessons_for_sa  = 'SA has no commodity revenue stabilisation fund. Mineral royalties and corporate tax windfalls from commodity cycles have historically been consumed rather than saved, leaving the fiscus exposed to downturns. National Treasury''s Medium-Term Fiscal Framework implicitly acknowledges this; a legislated counter-cyclical fiscal rule — with an explicit savings mechanism — would strengthen credibility and reduce borrowing costs. The COP28 transition finance context also creates a potential use case for a Just Transition Fund analogous to the Pula structure.',
  sources         = ARRAY['Iimi (2006), IMF Working Paper', 'Bank of Botswana Annual Reports', 'IMF Fiscal Monitor 2023']
WHERE country = 'Botswana' AND reform_year = 1994;

-- O5. India — Unified Payments Interface (UPI) and India Stack (2016)
UPDATE international_comparisons SET
  approach        = 'NPCI (National Payments Corporation of India) launched UPI in 2016 as an open-architecture, interoperable, real-time payment rail. It was built as a public good — zero merchant discount rates, open APIs, no proprietary lock-in. Aadhaar biometric ID and DigiLocker (digital document store) created the identity layer. The government mandated UPI acceptance for government payments, driving adoption. By 2024, UPI processed over 100 million transactions daily.',
  gdp_impact      = 'Digital transactions USD 1.5 trillion (2023); formalisation adds est. 0.5–1pp tax revenue',
  timeline        = '2 years to critical mass (2016–2018); full ecosystem by 2022',
  lessons_for_sa  = 'SA has PayFast, SnapScan, and emerging open-banking frameworks but lacks a national interoperable payment rail. The SARB''s Vision 2025 National Payment System roadmap is the closest analogue but moves slowly. India''s model shows that government-owned, open infrastructure combined with mandated acceptance generates adoption far faster than market-led approaches. The SA fintech sector has repeatedly called for interoperability mandates — India''s experience strongly supports this.',
  sources         = ARRAY['BIS Working Paper 930 (2021)', 'NPCI Annual Report 2023-24', 'McKinsey India Digital Finance 2023']
WHERE country = 'India' AND reform_year = 2016;

-- O6. India — Direct Benefit Transfer (DBT) System (2013)
UPDATE international_comparisons SET
  approach        = 'India''s government linked Aadhaar identity (1.3 billion enrolled) to bank accounts to route welfare transfers directly to beneficiaries, bypassing intermediaries. Starting with LPG subsidies in 2013, the DBT system was expanded to 300+ government schemes by 2022. Biometric authentication at point of collection prevented ghost beneficiaries. The system was built on the India Stack infrastructure.',
  gdp_impact      = 'USD 33bn saved in leakage 2014–2022 (est.); fiscal savings ~1% of GDP p.a.',
  timeline        = '2 years to launch (2013); scaled to full government by 2017',
  lessons_for_sa  = 'SA''s social grant system (SASSA / SAPO) has faced persistent payment fraud, ghost beneficiaries, and intermediary capture. The SASSA/Net1 scandal is a direct analogue. SA has biometric data (Home Affairs) and a functioning ID system — the architectural building blocks for a DBT-style direct payment layer exist. The Government Technology Modernisation programme and Home Affairs digital ID rollout are the relevant delivery vehicles.',
  sources         = ARRAY['World Bank DBT India Assessment 2019', 'NITI Aayog DBT Mission Reports 2022', 'Muralidharan et al. (2020), AER']
WHERE country = 'India' AND reform_year = 2013;

-- O7. Chile — Individual Account Pension Reform (1981)
UPDATE international_comparisons SET
  approach        = 'Chile replaced its pay-as-you-go pension system with mandatory individual accounts (AFPs) in 1981. Workers contributed 10% of wages to private fund managers competing for mandates. The system was supported by a fiscal guarantee for minimum pension. By 2010, pension assets under management reached 70%+ of GDP, making Chile''s capital market among the deepest in Latin America and driving domestic long-term investment.',
  gdp_impact      = 'Savings rate from 5% to 21% of GDP; capital market depth enabled ~1–2pp structural GDP uplift',
  timeline        = '10 years to significant capital market depth; full maturity by mid-1990s',
  lessons_for_sa  = 'SA''s pension fund sector is large (>100% of GDP AUM) but fragmented, with limited appetite for domestic infrastructure investment and regulatory barriers to alternative assets. The challenge is not savings volume but asset allocation. The GEPF''s infrastructure mandates and Regulation 28 reform (lifting the limit on alternative investments) are the SA analogues. Chile''s experience also shows the distributional limits of pure individual-account systems — SA''s high informality means any mandatory savings reform must include a minimum guarantee for informal workers.',
  sources         = ARRAY['Edwards (1998), JEP', 'World Bank Chile Pension Review 2016', 'OECD Pensions at a Glance 2023']
WHERE country = 'Chile' AND reform_year = 1981;

-- O8. Chile — Copper Stabilisation Fund and Counter-Cyclical Fiscal Rule (1987)
UPDATE international_comparisons SET
  approach        = 'Chile created the Copper Stabilisation Fund in 1987 to save copper export windfalls above a structural price, and in 2001 formalised a structural fiscal surplus rule: the government would spend only based on the long-run copper price and estimated potential GDP, regardless of current windfall revenues. Codelco (state copper company) transferred above-baseline revenues to the fund automatically. By 2007, assets reached USD 20 billion.',
  gdp_impact      = 'USD 4bn counter-cyclical stimulus deployed 2009; sovereign spreads among lowest in EM',
  timeline        = 'Fiscal rule codified 2001; political credibility established by 2006',
  lessons_for_sa  = 'SA has no commodity revenue rule and no stabilisation fund. Mining royalties and corporate tax windfalls are fully spent in the year of receipt, making the budget highly procyclical. National Treasury''s expenditure ceiling is a partial analogue, but it is not linked to commodity prices and has been repeatedly waived for SOE bailouts. A legislated rule explicitly targeting the mineral-revenue cycle — with parliamentary lock-in similar to Chile''s — would be constitutionally feasible and would directly address SA''s fiscal fragility.',
  sources         = ARRAY['Frankel (2011), IMF Working Paper', 'IMF Chile Article IV 2023', 'Larrain & Sachs (2002), Brookings']
WHERE country = 'Chile' AND reform_year = 1987;

-- O9. Mauritius — Export Processing Zones and Services Diversification (1970)
UPDATE international_comparisons SET
  approach        = 'Mauritius established Export Processing Zones (EPZs) in 1970, offering zero tariffs on imported inputs, competitive corporate tax, and streamlined labour regulations for EPZ firms. The government simultaneously invested in education (free university) and targeted tourism and financial services as export diversification anchors. The EPZ strategy was explicitly time-limited — preferences were used to accumulate capability before graduation to full liberalisation.',
  gdp_impact      = 'GDP per capita USD 260→9,000 in 32 years; high-income country by 2019',
  timeline        = 'EPZ scale-up 5–8 years; structural diversification into services by mid-1990s',
  lessons_for_sa  = 'SA''s Special Economic Zones have underperformed relative to their Mauritian counterparts, partly due to logistics cost disadvantages and labour regulation constraints that apply even within zones. Mauritius''s model depended on fast customs clearance, reliable power, and a flexible EPZ labour market. SA''s SEZs in Richards Bay, Dube TradePort, and Coega have the physical infrastructure but lack the regulatory carve-out depth of Mauritius''s original EPZ framework. The Manufacturing Competitiveness Enhancement Programme is the SA analogue but at insufficient scale.',
  sources         = ARRAY['Subramanian & Roy (2003), IMF Working Paper', 'World Bank Mauritius Competitiveness Review 2018', 'Baissac (2011) World Bank SEZ Study']
WHERE country = 'Mauritius' AND reform_year = 1970;

-- O10. Mauritius — Business Climate Reform and Ease of Doing Business (2005)
UPDATE international_comparisons SET
  approach        = 'Following a 2005 Doing Business ranking of 32nd globally (SA was ranked 28th at the time), Mauritius launched a systematic reform programme targeting registration time (cut from 46 to 3 days), property transfer costs (cut 30%), construction permits (streamlined by single-window), and trading across borders. The effort was driven by a dedicated Reform Office in the PM''s office with cross-ministerial authority to break bureaucratic logjams.',
  gdp_impact      = 'FDI/GDP from 2.5% to 4.8%; 13th globally on Doing Business (vs SA''s 84th)',
  timeline        = '3 years for most procedural reforms; 8 years to full ranking improvement',
  lessons_for_sa  = 'SA has a Doing Business Red Tape Reform agenda under the Presidency but it lacks a dedicated, empowered reform office with cross-ministerial authority. Mauritius''s key institutional innovation was putting the Reform Office in the PM''s office with a direct political mandate. SA''s BizPortal and SARS online systems are good analogues for individual reforms; what''s missing is the coordinating institution with authority to override departmental resistance.',
  sources         = ARRAY['World Bank Doing Business 2019', 'IMF Mauritius Article IV 2022', 'Zafar (2011) World Bank Working Paper']
WHERE country = 'Mauritius' AND reform_year = 2005;

-- O11. Rwanda — Imihigo Performance Contracts and State Reconstruction (2000)
-- Disambiguation: outcome_summary ILIKE '%USD 225%' isolates the textbook entry
-- from the earlier 002/005-A5 Rwanda 2000 civil service entry.
UPDATE international_comparisons SET
  approach        = 'Rwanda rebuilt state capacity after 1994 through a combination of: merit-based senior civil service recruitment (English-French-Kinyarwanda requirements), performance contracts (Imihigo) for ministers and district leaders linked to quarterly dashboards, and a strong anti-corruption framework (Office of the Ombudsman with asset disclosure). The President personally reviewed district performance scorecards quarterly. Cabinet reshuffles followed non-performance signals.',
  gdp_impact      = 'GDP per capita USD 225→822 (2000–2020); CPI rank 49th vs SA''s 83rd',
  timeline        = 'Institutional frameworks established in 5 years; measurable improvements visible by 2010',
  lessons_for_sa  = 'SA''s performance management system (DPME, MPAT) exists but lacks consequences for non-performance. The Rwanda model is relevant to SA''s DPSA professionalisation agenda — particularly the Imihigo-style performance contracts with quarterly scorecard review. The key difference is political will: Rwanda''s system worked because failure led to consequences. SA''s framework produces dashboards that are rarely acted upon. The National Development Plan Coordination Commission is structurally similar to Rwanda''s delivery units but needs consequence management authority.',
  sources         = ARRAY['Chemouni (2014), JEA', 'World Bank Rwanda Public Sector Review 2018', 'TI Corruption Perceptions Index 2023']
WHERE country = 'Rwanda' AND reform_year = 2000
  AND outcome_summary ILIKE '%USD 225%';

-- O12. Rwanda — FDI-Led Services and Tech Sector Development (2010)
UPDATE international_comparisons SET
  approach        = 'Rwanda positioned Kigali as Africa''s MICE (meetings, incentives, conferences, exhibitions) capital through the Kigali Convention Centre, targeted visa-on-arrival expansion (120+ countries), and made English an official language in 2008 to compete for anglophone business. The Rwanda Development Board (single window for investment) reduced FDI setup time to under 24 hours. Rwanda also established Africa''s only fully operational drone delivery system (Zipline) and a 4G+ backbone covering 95% of the population.',
  gdp_impact      = 'FDI tripled 2012–2022; services exports from 24% to 48% of total',
  timeline        = '5 years to create MICE brand; 10 years for FDI ecosystem maturity',
  lessons_for_sa  = 'SA''s investment promotion (InvestSA) is structurally comparable to the RDB but more fragmented across national, provincial, and metro entities. Rwanda''s model shows that a single, empowered investment promotion agency with authority to resolve bureaucratic obstacles generates more FDI than a system with multiple overlapping agencies. SA''s O&G exploration licensing, green hydrogen opportunity zone development, and critical minerals roadmap all require RDB-style single-window delivery that does not currently exist.',
  sources         = ARRAY['UNCTAD World Investment Report 2023', 'World Bank Rwanda FDI Analysis 2022', 'AfDB Rwanda Economic Outlook 2023']
WHERE country = 'Rwanda' AND reform_year = 2010;

-- O13. Vietnam — Doi Moi Reform and FDI-Led Manufacturing Integration (1986)
UPDATE international_comparisons SET
  approach        = 'Vietnam''s Doi Moi (renewal) reforms from 1986 combined agricultural de-collectivisation with selective opening to foreign direct investment in Special Economic Zones. The government negotiated bilateral investment treaties with priority partner countries, created industrial parks with plug-and-play infrastructure, and maintained low effective corporate tax for SEZ manufacturers (10% vs standard 20%). Labour market flexibility within zones was higher than in the general economy. Electronics and garments were prioritised as anchor sectors.',
  gdp_impact      = 'GDP per capita USD 200→3,700 in 36 years; 2nd largest electronics exporter globally',
  timeline        = '10 years for initial FDI clusters; manufacturing export scale by early 2000s',
  lessons_for_sa  = 'SA''s industrial policy (Master Plans, SEZs, APDP) has been more sector-protective than FDI-attracting. Vietnam''s model is not replicable in full — lower labour costs, geographic proximity to East Asian supply chains, and a more directive state are all structural differences. But the lesson on SEZ quality (reliable power, fast customs, plug-and-play industrial sites) is directly applicable. SA''s Dube TradePort and Richards Bay SEZs have the physical potential but lack Vietnam''s labour flexibility within zones and have been hampered by Transnet port inefficiency.',
  sources         = ARRAY['IMF Vietnam Article IV 2023', 'UNCTAD Vietnam Investment Review 2022', 'Malesky (2016), JEP']
WHERE country = 'Vietnam' AND reform_year = 1986;

-- O14. Vietnam — Digital Economy Strategy and Tech Export Ecosystem (2020)
UPDATE international_comparisons SET
  approach        = 'Vietnam''s 2020 National Digital Economy Strategy targeted 20% of GDP from digital economy by 2025. The government mandated Make-in-Vietnam software development targets for public procurement, invested in 5G spectrum allocation (world''s 7th country to deploy 5G commercially, 2022), and established dedicated digital industrial parks (Vietnam Software and IT Park, Ho Chi Minh City). University partnerships with Samsung, Intel, and LG created a tech talent pipeline.',
  gdp_impact      = 'Digital economy 14.3% of GDP (2022); USD 16bn IT services exports',
  timeline        = '3 years for 5G deployment; 5 years for ecosystem maturity',
  lessons_for_sa  = 'SA''s 5G spectrum allocation was significantly delayed (Telkom legal challenges) compared to Vietnam''s streamlined approach. Vietnam''s Make-in-Vietnam software procurement preference has a SA analogue in the B-BBEE software procurement targets, but SA''s version is not enforced consistently. The tech park model (Vietnam''s SHTP) is directly relevant to SA''s plans for Tshwane Innovation Hub and Bandwidth Barn, which need dedicated SEZ status and 5G infrastructure guarantees.',
  sources         = ARRAY['GSMA Mobile Economy Asia Pacific 2023', 'World Bank Vietnam Digital Economy Assessment 2023', 'VNAT Digital Economy Report 2022']
WHERE country = 'Vietnam' AND reform_year = 2020;

-- O15. South Korea — Universal Education and Human Capital Miracle (1960)
UPDATE international_comparisons SET
  approach        = 'South Korea made universal primary and secondary education the cornerstone of its development strategy in the 1960s. The government invested 4–6% of GDP in public education, made primary school fees zero, trained teachers aggressively, and linked education outcomes to industrial policy — targeting STEM graduates for emerging export sectors. Private tutoring (hagwon) was tolerated as a quality supplement. University expansion followed industrial capability needs.',
  gdp_impact      = 'GDP per capita USD 160→6,500 (1960–1990); PISA scores top-5 globally',
  timeline        = '15–20 years for full enrolment; skills payoff in manufacturing competitiveness by 1980s',
  lessons_for_sa  = 'SA''s education system shares structural features with Korea''s starting point — wide access to primary school combined with deeply unequal quality. The critical difference is that Korea prioritised teaching quality and curriculum standards above all else. SA''s reading crisis (19% of Grade 4 learners reading for meaning — PIRLS 2021) is the proximate expression of this failure. The National Reading and Literacy Crisis Response recommended by the Basic Education committee is the single intervention most analogous to Korea''s foundational literacy push. The returns are 10–15 years distant, but delay makes the gap permanent.',
  sources         = ARRAY['Lee & Kim (2010), NBER Working Paper', 'OECD Education at a Glance 2023', 'World Bank Korea Education Review 2020']
WHERE country = 'South Korea' AND reform_year = 1960;

-- O16. South Korea — Chaebol-Led Export Industrialisation and Conditional Subsidies (1961)
UPDATE international_comparisons SET
  approach        = 'Korea''s Park Chung-hee government (1961–1979) selected strategic sectors (steel, petrochemicals, electronics, shipbuilding) and directed credit to conglomerates (chaebol) that met export targets. Subsidies were conditional and performance-based: chaebol that failed to meet export milestones lost access to subsidised credit. POSCO was established as a state steel company. The Heavy and Chemical Industry drive of 1973 targeted six sectors simultaneously.',
  gdp_impact      = '8% p.a. GDP growth for 30 years; global market leadership in 3+ sectors',
  timeline        = '10 years to visible sector emergence; 25 years to global competitiveness',
  lessons_for_sa  = 'SA''s sector Master Plans (auto, clothing, steel) are structurally analogous to Korea''s conditional subsidies but less disciplined in enforcement. Korea''s key innovation was conditionality: subsidies were withdrawn from underperformers, creating competitive pressure even within a protected framework. SA''s DTIC incentives (MCEP, EMIA) lack this conditionality — underperforming beneficiaries face no consequence. The most actionable lesson for SA is not the scale of intervention but the performance discipline: build exit criteria and performance milestones into all industrial support programmes.',
  sources         = ARRAY['Amsden (1989), Asia''s Next Giant', 'Chang (2006), The East Asian Development Experience', 'World Bank East Asian Miracle (1993)']
WHERE country = 'South Korea' AND reform_year = 1961;

-- O17. India — Skill India and PMKVY Vocational Training Programme (2015)
UPDATE international_comparisons SET
  approach        = 'India''s Pradhan Mantri Kaushal Vikas Yojana (PMKVY) targeted training 10 million youth over 4 years, using a demand-side financing model: training providers were paid per successful industry-recognised certification rather than per student enrolled. The National Skill Development Corporation (NSDC) worked with 200+ sector councils to define job-relevant standards. Recognition of Prior Learning (RPL) assessed informally-skilled workers without formal certification.',
  gdp_impact      = '14.5m trained by 2023; 15–20% wage premium for certified workers',
  timeline        = 'Launched 2015; scaled to full ambition by 2020',
  lessons_for_sa  = 'SA''s TVET and SETA system faces a direct analogue to India''s pre-PMKVY challenge: supply-side training that is not connected to employer demand. India''s output-based funding model — paying per certified outcome, not per student enrolled — is the reform that SA''s skills sector most needs. SETAs are funded by a 1% payroll levy but have weak accountability for employment outcomes. Importing the PMKVY output-based payment model into SA''s skills system, combined with the National Qualifications Framework recognition of prior learning, would directly address the artisan pipeline gap.',
  sources         = ARRAY['World Bank Skill India Assessment 2021', 'NSDC Annual Report 2022-23', 'Datta & Bhattacharjea (2022), ILO Working Paper']
WHERE country = 'India' AND reform_year = 2015;
