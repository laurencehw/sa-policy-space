-- Migration 005: International Comparisons — Expanded Database
-- Targets 40–50+ total case studies (7 already inserted by 002 + 42 new entries
-- in Sections A–N + 17 entries from data/international_comparisons.json in Section O).
-- Run in the Supabase SQL editor (or via psql for self-hosted).
--
-- BINDING CONSTRAINTS in production DB (verified 2026-03):
--   corruption (1), corruption_governance (5), digital (1),
--   digital_infrastructure (2), energy (20), financial_access (14),
--   fiscal_constraint (1), fiscal_space (5), government_capacity (27),
--   health_systems (6), innovation_capacity (4), land_housing (1),
--   land_reform (1), logistics (2), other (1), regulatory_burden (25),
--   skills_education (16), transport_logistics (7)
--
-- 002 migration used wrong constraints for 5 entries (skills, regulation,
-- land, labor_market, crime) — those are fixed here with correct values.
-- Each INSERT ... SELECT is safe: if no matching idea exists the row is skipped.

-- ────────────────────────────────────────────────────────────────────────────
-- TABLE (idempotent — already created by 002, kept for standalone use)
-- ────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS international_comparisons (
    id              SERIAL PRIMARY KEY,
    idea_id         INT NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    country         TEXT NOT NULL,
    iso3            TEXT,
    reform_year     INT,
    outcome_summary TEXT NOT NULL,
    source_url      TEXT,
    source_label    TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_intl_comp_idea_id ON international_comparisons(idea_id);
CREATE INDEX IF NOT EXISTS idx_intl_comp_country  ON international_comparisons(country);

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION A: FIXED ENTRIES (failed in 002 due to wrong binding_constraint)
-- ────────────────────────────────────────────────────────────────────────────

-- A1. Skills: South Korea vocational polytechnics (1974)
--     002 used 'skills' — correct value is 'skills_education'
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'South Korea', 'KOR', 1974,
  'South Korea built a network of polytechnic colleges from 1974, funded by a mandatory training levy (0.5% of payroll) with employer governance over curriculum. By 1990, 60% of secondary graduates were in vocational tracks. Engineers from these colleges staffed semiconductor, shipbuilding, and automotive industries that drove Korea''s growth miracle. SA''s SETA system collects a similar levy but training does not match employer demand — Korea''s success rested on industry governance of curriculum, not just funding.',
  'https://www.ilo.org/asia/info/WCMS_098243/lang--en/index.htm',
  'ILO Korea VET Case Study 2018; OECD Education at a Glance 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'skills_education'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- A2. Regulation: Botswana business registration (2008)
--     002 used 'regulation' — correct value is 'regulatory_burden'
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Botswana', 'BWA', 2008,
  'Botswana streamlined business registration from 47 days to 3 days (2008–2014) by merging the Companies Registry, Tax Authority registration, and Trade Licence into a single online portal via CIPA. World Bank Doing Business rank improved from 103rd to 42nd. FDI inflows rose 40% in the following 5 years. SA''s CIPC online registration is analogous but post-registration licencing (municipal, SARS, labour) remains fragmented — precisely the gap Botswana closed with its one-stop shop.',
  'https://www.worldbank.org/en/country/botswana/overview',
  'World Bank Doing Business Botswana 2014; UNCTAD Investment Monitor'
FROM policy_ideas p
WHERE p.binding_constraint = 'regulatory_burden'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- A3. Land: Peru urban land titling (1996)
--     002 used 'land' — correct value is 'land_reform'
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Peru', 'PER', 1996,
  'Peru''s COFOPRI (Commission for the Formalisation of Informal Property) titled 1.5 million urban plots between 1996 and 2003. Titled households invested 68% more in housing improvements than untitled controls. Access to formal credit increased significantly for newly titled owners. De Soto''s dead-capital theory was directly operationalised. SA''s informal settlement upgrade programme has similar ambitions; COFOPRI''s success rested on a single-purpose agency with streamlined authority, not a multi-department committee process.',
  'https://www.worldbank.org/en/country/peru/overview',
  'Field & Torero (2006) AER 96(5); World Bank Peru Informal Housing Study 2005'
FROM policy_ideas p
WHERE p.binding_constraint = 'land_reform'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- A4. Labour market: Colombia labour reform (2002)
--     002 used 'labor_market' (no such constraint) — mapped to 'regulatory_burden'
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Colombia', 'COL', 2002,
  'Colombia''s 2002 Labour Reform (Law 789) reduced severance costs, extended the normal work-day definition, and introduced flexible contracting for micro-enterprises. Formal employment grew by 1.8 million jobs over the following 4 years. Informality fell from 60% to 52% over the decade. The reform balanced flexibility with expanded unemployment insurance. SA''s labour market mirrors Colombia''s pre-2002 position: high formal-sector protection coexisting with massive informality and youth unemployment above 60%.',
  'https://www.imf.org/external/pubs/ft/wp/2005/wp05257.pdf',
  'Kugler (2005) IMF WP/05/257; OECD Colombia Labour Market Review 2015'
FROM policy_ideas p
WHERE p.binding_constraint = 'regulatory_burden'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- A5. Crime: Medellín urban transformation (1991)
--     002 used 'crime' (no such constraint) — mapped to 'government_capacity'
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Colombia', 'COL', 1991,
  'Medellín cut homicide rates by 95% over 20 years — from 380 per 100,000 in 1991 to 18 in 2015 — through urban cable cars connecting hillside comunas to the city centre, public libraries, and community investment in former gang strongholds. Researchers call this "urbanism as crime prevention". The approach has stronger evidence for long-run sustainability than enforcement-only models. SA''s township spatial exclusion and gang violence in Cape Flats present a comparable structural challenge.',
  'https://www.undp.org/latin-america/publications/medellin-case-study',
  'Cerdá et al. (2012) Am J Epidemiol 175(10); UNDP Medellín Urban Transformation Case Study'
FROM policy_ideas p
WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION B: ENERGY (4 new — energy has 20 ideas; 002 used OFFSET 0 and 1)
-- ────────────────────────────────────────────────────────────────────────────

-- B1. Germany Energiewende (2000)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Germany', 'DEU', 2000,
  'Germany''s Energiewende (Energy Transition) scaled renewables from 6% to 46% of electricity generation between 2000 and 2022 using feed-in tariffs then competitive auctions. Renewable employment reached 300,000 jobs. Solar and wind costs fell 80% and 70% respectively; Germany hit 100% renewable days in 2022. The key policy mechanism — a guaranteed 20-year price (EEG) — eliminated investor risk and drove capital at scale, a template directly applicable to extending SA''s REIPPP programme.',
  'https://www.bmwk.de/Redaktion/EN/Dossier/renewable-energy.html',
  'BMWK Germany Energiewende Progress Report 2022; Fraunhofer ISE Energy Charts 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'energy'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- B2. Morocco Noor solar complex (2016)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Morocco', 'MAR', 2016,
  'Morocco''s Noor concentrated solar power complex at Ouarzazate — 580 MW, world''s largest CSP plant — was commissioned 2016–2018 with 8 hours of molten-salt thermal storage enabling night-time generation. Morocco targets 52% renewable electricity by 2030. World Bank and AfDB concessional finance blended with private equity reduced Morocco''s energy import bill by USD 1 billion annually. SA''s high solar irradiance and similar import dependency make this public-finance-plus-private-investment model directly applicable.',
  'https://www.worldbank.org/en/results/2019/01/30/giving-morocco-its-place-in-the-sun',
  'World Bank Noor Ouarzazate Solar Project Results 2019; IRENA Morocco Renewable Energy Report 2021'
FROM policy_ideas p
WHERE p.binding_constraint = 'energy'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- B3. Uruguay wind energy (2008)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Uruguay', 'URY', 2008,
  'Uruguay scaled wind from near-zero to 38% of electricity generation in 7 years (2008–2015) through competitive auctions with 20-year power purchase agreements denominated in USD. Private investment of USD 3 billion required no government subsidy — only a credible regulatory framework and state-utility offtake guarantee. Electricity tariffs fell 30% in real terms. Uruguay now exports surplus electricity to Argentina and Brazil. SA''s REIPPP mirrors this model; Uruguay resolved Eskom''s equivalent offtake payment risk by ring-fencing purchase obligations.',
  'https://www.irena.org/publications/2015/Nov/Renewable-Energy-Policy-Brief-Uruguay',
  'IRENA Renewable Energy Policy Brief: Uruguay 2015; IEA Uruguay Energy Profile 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'energy'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 4;

-- B4. Kenya geothermal Olkaria (2000)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Kenya', 'KEN', 2000,
  'Kenya expanded geothermal capacity from 45 MW (2000) to 878 MW (2023) — now 47% of installed capacity — through KenGen''s Olkaria complex. The key innovation: a state-owned drilling company bore exploration risk (the highest-cost phase), with private developers entering only after wells were proven. Generation cost fell from USD 0.10 to USD 0.05/kWh. SA''s geothermal potential is limited, but Kenya''s public-bears-risk/private-operates model applies to any capital-intensive energy infrastructure such as battery storage or new transmission.',
  'https://www.kengen.co.ke/',
  'KenGen Geothermal Development Report 2023; IRENA Geothermal Power in Africa 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'energy'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 5;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION C: TRANSPORT / LOGISTICS (4 new — transport_logistics has 7 ideas)
-- ────────────────────────────────────────────────────────────────────────────

-- C1. Singapore PSA port (1997)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Singapore', 'SGP', 1997,
  'Singapore corporatised PSA International in 1997, separating port authority regulation from terminal operations. PSA grew to handle 37 million TEU by 2022 — the world''s second-busiest port. Crane productivity reached 30 moves/hour vs a global average of 22. A dedicated Maritime and Port Authority retained regulatory oversight while PSA competed commercially. SA''s Transnet restructuring debate mirrors Singapore''s pre-1997 state: blended operator-regulator roles that suppress efficiency and deter private investment.',
  'https://www.mpa.gov.sg/maritime-singapore/what-maritime-singapore-offers/world-class-infrastructure',
  'Maritime and Port Authority of Singapore Port Statistics 2022; World Bank Port Reform Toolkit'
FROM policy_ideas p
WHERE p.binding_constraint = 'transport_logistics'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- C2. Netherlands logistics hub (mainport strategy)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Netherlands', 'NLD', 1990,
  'The Netherlands handles 65% of Europe''s freight through a deliberate mainport strategy centred on Rotterdam port (14.5 million TEU, Europe''s largest) and Schiphol airport. The policy concentrated infrastructure investment to make the Netherlands Europe''s distribution gateway, combined with a neutral fiscal regime for logistics companies. Logistics contributes 12% of GDP. SA''s geographic position — Cape route, sub-Saharan gateway — offers analogous potential if Durban and Coega ports reach comparable efficiency and reliability.',
  'https://www.portofrotterdam.com/en/port-authority/port-figures',
  'Port of Rotterdam Annual Report 2022; Netherlands Bureau for Economic Policy Analysis (CPB) 2020'
FROM policy_ideas p
WHERE p.binding_constraint = 'transport_logistics'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- C3. Morocco TangerMed port (2007)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Morocco', 'MAR', 2007,
  'Morocco''s TangerMed port, opened 2007, grew to 7.4 million TEU by 2022 — Africa''s largest container port — by combining a greenfield site with a free trade zone attracting Renault, Stellantis, and Airbus. The port serves as a transshipment hub for West and North Africa. Public-private partnership with Marsa Maroc financed expansion without sovereign balance sheet risk. SA''s Coega IDZ and Port of Ngqura were built on a similar model but have not matched TangerMed''s investment attraction or throughput ramp-up speed.',
  'https://www.tangermed.ma/en/key-figures/',
  'TangerMed Special Agency Key Figures 2022; World Bank Africa Connectivity Report 2021'
FROM policy_ideas p
WHERE p.binding_constraint = 'transport_logistics'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- C4. Panama Canal expansion (2007)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Panama', 'PAN', 2007,
  'Panama''s canal expansion (2007–2016, USD 5.25 billion) added a third lock set accommodating New Panamax vessels (14,000 TEU), doubling capacity and capturing larger share of global trade routes. The project was financed through bond issuance backed by canal toll revenue — infrastructure self-financing without sovereign budget pressure. Canal revenues now contribute 10% of Panama''s GDP. SA''s port expansion decisions face identical financing structure choices; Panama''s toll-backed bond model avoided the fiscal tradeoffs that delay SA''s infrastructure pipeline.',
  'https://www.pancanal.com/eng/expansion/index.html',
  'Panama Canal Authority Expansion Program Report 2016; IMF Panama Article IV 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'transport_logistics'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION D: SKILLS / EDUCATION (4 new — 16 ideas; A1 used OFFSET 0)
-- ────────────────────────────────────────────────────────────────────────────

-- D1. Finland PISA education reform
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Finland', 'FIN', 1979,
  'Finland transformed from average OECD education performance in the 1970s to consistently top PISA rankings by eliminating school inspections, abolishing ability streaming, requiring all teachers to hold master''s degrees, and giving schools full curriculum autonomy. The 2001 PISA results — Finland #1 in reading and science — attracted global attention. Teacher salaries are competitive with engineers. SA has the opposite conditions: high teacher absenteeism, weak content knowledge, and a curriculum implementation gap. Finland''s equity focus (no private school advantage) is the transferable policy design.',
  'https://www.oecd.org/education/school/programmeforinternationalstudentassessmentpisa/',
  'OECD PISA 2022 Results (Volume I); Sahlberg (2021) Finnish Lessons 3.0, Teachers College Press'
FROM policy_ideas p
WHERE p.binding_constraint = 'skills_education'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- D2. Singapore SkillsFuture (2015)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Singapore', 'SGP', 2015,
  'Singapore''s SkillsFuture programme (2015) gives every citizen aged 25+ an annual SGD 500 credit for approved training, with top-up grants for mid-career workers. By 2022, 570,000 citizens had used credits across 20,000 approved programmes. The programme is demand-driven: workers choose training, employers signal demand through wage premiums, and providers compete on outcomes. SA''s SETAs operate on a supply-push model where training providers capture levies; SkillsFuture''s demand-side design and individual-account mechanism are the critical structural differences.',
  'https://www.skillsfuture.gov.sg/AboutSkillsFuture',
  'SkillsFuture Singapore Annual Report 2022; OECD Skills Outlook Singapore 2020'
FROM policy_ideas p
WHERE p.binding_constraint = 'skills_education'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- D3. Germany dual vocational training (apprenticeship system)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Germany', 'DEU', 1969,
  'Germany''s dual vocational system combines firm-based apprenticeship (3–4 days/week) with vocational school (1–2 days/week) across 325 recognised occupations. Employer chambers (IHK, HWK) set and enforce standards; firms bear training costs but receive productive labour. Youth unemployment in Germany is consistently below 8% vs 60%+ in SA. The system produces 1.3 million new apprentices annually. SA''s SETA system lacks the employer governance, standardised qualifications, and cost-sharing that make Germany''s model function at scale.',
  'https://www.bibb.de/en/65966.php',
  'Federal Institute for Vocational Education and Training (BIBB) Data Report 2022; OECD VET Germany 2020'
FROM policy_ideas p
WHERE p.binding_constraint = 'skills_education'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- D4. Brazil ProUni higher education inclusion (2005)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Brazil', 'BRA', 2005,
  'Brazil''s ProUni programme (2005) provided 2.5 million full and partial scholarships to low-income students at private higher education institutions by 2022, exchanging corporate tax exemptions for scholarship places. University enrolment increased from 3.5 million (2003) to 8.8 million (2022). The programme expanded access without large public capital expenditure. SA''s NSFAS addresses a similar access constraint but uses direct government grants rather than tax-exemption-for-scholarship swaps that leverage existing private capacity without new infrastructure.',
  'https://www.gov.br/mec/pt-br/acesso-a-informacao/acoes-e-programas/prouni',
  'Brazil Ministry of Education ProUni Programme Data 2022; World Bank Brazil Education Review 2020'
FROM policy_ideas p
WHERE p.binding_constraint = 'skills_education'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 4;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION E: DIGITAL INFRASTRUCTURE (2 new — 2 ideas; 002 used digital OFFSET 0)
-- ────────────────────────────────────────────────────────────────────────────

-- E1. India digital stack — UPI / Aadhaar (2009)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'India', 'IND', 2009,
  'India built a national digital identity and payments stack: Aadhaar biometric ID covers 1.36 billion people; UPI processed 83 billion transactions worth USD 1.8 trillion in FY2023 — surpassing Visa and Mastercard combined. The stack is public infrastructure (UIDAI and NPCI, non-profit) with private apps competing on top. Financial inclusion rose from 35% to 80% of adults in 10 years. SA''s Smart ID rollout and SASSA payment infrastructure face the same design choice between open-stack public goods and proprietary concessions.',
  'https://www.npci.org.in/what-we-do/upi/product-statistics',
  'NPCI UPI Statistics FY2023; UIDAI Annual Report 2023; IMF India Fintech Note 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'digital_infrastructure'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- E2. South Korea broadband Cyber Korea 21 (1999)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'South Korea', 'KOR', 1999,
  'South Korea achieved 99% household broadband penetration by 2003 through the Cyber Korea 21 plan: government subsidised last-mile fibre rollout in rural areas, mandated open-access unbundling so ISPs competed on the state-owned KT network, and provided computers to 10 million low-income households. Broadband penetration drove the gaming and e-commerce export industries. SA''s broadband penetration remains below 60%; Telkom''s legacy infrastructure, like Korea''s pre-reform KT, creates bottlenecks that open-access unbundling could resolve.',
  'https://www.oecd.org/digital/broadband/oecdbroadbandportal.htm',
  'OECD Broadband Portal Korea; ITU Korea ICT Development Case Study 2004; KISDI Korea ICT Report'
FROM policy_ideas p
WHERE p.binding_constraint = 'digital_infrastructure'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION F: REGULATORY BURDEN (3 more — 25 ideas; A2 OFFSET 0, A4 OFFSET 1)
-- ────────────────────────────────────────────────────────────────────────────

-- F1. New Zealand RMA regulatory reform (1991)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'New Zealand', 'NZL', 1991,
  'New Zealand''s Resource Management Act (1991) replaced 59 separate planning statutes with a single effects-based framework, cutting median resource consent time from 24 months to under 6. Business compliance costs fell by an estimated NZD 1 billion annually. The effects-based principle — regulators assess real-world outcomes, not procedural compliance — allows innovation while maintaining environmental standards. SA''s multiple overlapping planning regimes (NEMA, SPLUMA, sector legislation) present the same fragmentation that New Zealand consolidated into a single act.',
  'https://www.mfe.govt.nz/rma',
  'New Zealand Ministry for the Environment RMA 30-Year Review 2021; World Bank NZ Regulatory Report'
FROM policy_ideas p
WHERE p.binding_constraint = 'regulatory_burden'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- F2. Singapore GoBusiness regulatory simplification
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Singapore', 'SGP', 2000,
  'Singapore consistently ranks top globally in World Bank Ease of Doing Business. Key mechanisms: a single GoBusiness portal for all business licences, a regulatory sandbox framework allowing new business models to operate before legislation catches up, and a mandatory regulatory impact assessment quantifying compliance costs for every new rule. Singapore''s regulatory philosophy — regulate by outcomes, not processes — produced the world''s fastest company incorporation (15 minutes) and 26-day construction permit approval. SA''s regulatory reform agenda mirrors Singapore''s pre-2000 baseline position.',
  'https://www.gobusiness.gov.sg/',
  'GoBusiness Singapore; World Bank Doing Business Singapore 2020; EDB Annual Report 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'regulatory_burden'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- F3. Rwanda doing business reforms (2008)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Rwanda', 'RWA', 2008,
  'Rwanda improved its World Bank Doing Business rank from 150th (2008) to 38th (2020) — the most dramatic reform trajectory in Africa — by digitising the Rwanda Development Board one-stop centre (all investment permits in one building), reducing company registration to 6 hours, and establishing a commercial court with 6-month case resolution targets. Property registration fell from 371 days to 7 days. Foreign investment grew from USD 103 million (2006) to USD 400 million (2019). Rwanda demonstrates rapid institutional improvement is achievable without decades of prior development.',
  'https://rdb.rw/doing-business-in-rwanda/',
  'Rwanda Development Board Investment Climate Report 2020; World Bank Doing Business Rwanda 2020'
FROM policy_ideas p
WHERE p.binding_constraint = 'regulatory_burden'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 4;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION G: GOVERNMENT CAPACITY (3 new — 27 ideas; 002 OFFSET 0, A5 OFFSET 1)
-- ────────────────────────────────────────────────────────────────────────────

-- G1. Singapore public service excellence
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Singapore', 'SGP', 1965,
  'Singapore''s civil service combines market-rate salaries (ministers earn USD 1–2 million/year), merit-based promotion with transparent performance scoring, and cross-agency rotation. The Public Service Division publishes annual quality scorecards. Key outcomes: universal health insurance built in 18 months (Medishield Life 2015); GST implemented in 8 months from parliamentary approval. Civil servant productivity is estimated at 3x the OECD average per staff. SA''s public service reform agenda cites Singapore; the missing ingredient is consistent consequence management for underperformance at all levels.',
  'https://www.psd.gov.sg/about-us',
  'Singapore Public Service Division Annual Report 2022; Ng Pak Tee (2020) Singapore''s Public Service, Springer'
FROM policy_ideas p
WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- G2. Botswana mineral revenue and development management
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Botswana', 'BWA', 1969,
  'Botswana negotiated a 50% equity stake in De Beers'' diamond operations (Debswana, 1969) and channelled revenues through the Pula Fund sovereign wealth fund, achieving a fiscal savings rate above 50% of GDP in boom years. GDP per capita growth averaged 9% for 30 years (1966–1996) — the fastest sustained growth in modern history. Key institutional factors: a professional finance ministry, independent auditor general, and parliamentary review of diamond contracts. SA''s management of mineral revenues and state-owned enterprise stakes could draw directly on Botswana''s governance architecture.',
  'https://www.bankofbotswana.bw/',
  'Bank of Botswana Pula Fund Annual Report 2022; Acemoglu et al. (2003) An African Success Story, CEPR'
FROM policy_ideas p
WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- G3. Malaysia Economic Planning Unit (EPU)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Malaysia', 'MYS', 1966,
  'Malaysia''s Economic Planning Unit in the Prime Minister''s Department has coordinated five-year plans since 1966, aligning ministries, GLCs, and private investment toward common targets. The EPU recruited top graduates on full scholarships, was granted cross-sectoral authority over GLC mandates and capital budgets, and reported directly to the PM. Malaysia''s GDP per capita grew from USD 400 (1965) to USD 12,000 (2020). SA''s National Planning Commission and DPME perform analogous functions but lack the EPU''s operational authority over budget allocations and GLC strategic direction.',
  'https://www.epu.gov.my/en/socio-economic-statistics',
  'Malaysia EPU Mid-Term Review 12th Malaysia Plan 2023; World Bank Malaysia Economic Monitor 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 4;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION H: CORRUPTION / GOVERNANCE (3 new — 5 ideas)
-- ────────────────────────────────────────────────────────────────────────────

-- H1. Hong Kong ICAC (1974)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Hong Kong', 'HKG', 1974,
  'Hong Kong''s ICAC, established 1974, reduced the territory from one of Asia''s most corrupt jurisdictions to a global benchmark within 15 years. Key design: independent funding (not through the police budget), a Prevention department auditing government procedures proactively, a Community Relations department normalising anti-corruption as civic culture, and statutory powers to investigate any public officer''s bank accounts without court order. By 1985 Hong Kong''s CPI equivalent exceeded 8/10. SA''s NPA, SIU and Hawks lack ICAC''s institutional independence and community trust-building mandate.',
  'https://www.icac.org.hk/en/about/overview/index.html',
  'ICAC Hong Kong Annual Report 2022; Quah (2010) Curbing Corruption in Asian Countries, Emerald'
FROM policy_ideas p
WHERE p.binding_constraint = 'corruption_governance'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- H2. Singapore CPIB anti-corruption bureau
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Singapore', 'SGP', 1960,
  'Singapore''s Corrupt Practices Investigation Bureau (CPIB), strengthened after independence in 1960, investigates both public and private sector corruption with powers to access bank accounts and compel disclosure without a court order. Civil servant and minister salaries were raised to private-sector equivalents — an "anti-corruption wage" — reducing the opportunity cost of integrity. Transparency International CPI: 85/100 (2022), consistently top 5 globally. SA''s NPA faces comparable challenges; Singapore demonstrates prosecutorial independence + competitive public salaries + rapid case resolution are the three structural enablers.',
  'https://www.cpib.gov.sg/about-cpib/our-history/',
  'CPIB Singapore Annual Report 2022; Transparency International CPI 2022; World Bank Governance Indicators'
FROM policy_ideas p
WHERE p.binding_constraint = 'corruption_governance'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- H3. Botswana governance model
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Botswana', 'BWA', 1966,
  'Botswana has maintained the cleanest governance record in sub-Saharan Africa for over 50 years, sustaining multiparty democracy and an independent judiciary despite being a diamond-dominated economy — a resource-curse exception. Key factors: small elite size at independence reducing rent-competition; Tswana kgotla (public consultation) culture; and consistent investment in a professional civil service. CPI score: 60/100 (2022), highest in Africa. SA shares Botswana''s electoral democracy and mineral wealth; the institutional gap is prosecutorial independence and the absence of a dedicated anti-corruption body with ICAC-style powers.',
  'https://www.transparency.org/en/countries/botswana',
  'Transparency International CPI 2022; Acemoglu, Johnson & Robinson (2003) An African Success Story, CEPR'
FROM policy_ideas p
WHERE p.binding_constraint = 'corruption_governance'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION I: FINANCIAL ACCESS (3 new — 14 ideas)
-- ────────────────────────────────────────────────────────────────────────────

-- I1. Kenya M-Pesa (2007)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Kenya', 'KEN', 2007,
  'Kenya''s M-Pesa mobile money platform (Safaricom, 2007) reached 51 million users and USD 314 billion in annual transaction volume by 2022 — 87% of Kenya''s GDP. Financial inclusion rose from 27% of adults (2006) to 79% (2022). M-Pesa enabled smallholder farmers to receive payments, domestic workers to remit savings, and micro-entrepreneurs to access credit (M-Shwari). Peer-reviewed studies found M-Pesa lifted 194,000 Kenyan households out of poverty. SA''s FinTech regulatory sandbox and NPS Amendment Bill face the same design choice between incumbent protection and open digital financial infrastructure.',
  'https://www.safaricom.co.ke/mpesa/',
  'Jack & Suri (2016) Science 354(6317); Safaricom M-Pesa Impact Report 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'financial_access'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- I2. India Jan Dhan Yojana financial inclusion (2014)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'India', 'IND', 2014,
  'India''s Pradhan Mantri Jan Dhan Yojana (PMJDY, 2014) opened 500 million bank accounts for unbanked adults in 5 years — the world''s largest financial inclusion programme. Zero-balance accounts linked to Aadhaar biometric ID enabled direct benefit transfer of USD 50 billion/year in subsidies, eliminating an estimated USD 12 billion in annual leakage. World Bank Global Findex: India''s banked adult share rose from 53% (2014) to 78% (2021). SA''s SASSA payment system faces analogous design choices; Jan Dhan demonstrates that government transfers drive account ownership when barriers to opening accounts are eliminated.',
  'https://pmjdy.gov.in/account',
  'Government of India PMJDY Dashboard 2023; World Bank Global Findex 2022 India Chapter'
FROM policy_ideas p
WHERE p.binding_constraint = 'financial_access'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- I3. Brazil Bolsa Família conditional cash transfers (2003)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Brazil', 'BRA', 2003,
  'Brazil''s Bolsa Família (2003) reached 14 million families (50 million people) at peak, transferring BRL 190/month conditional on children attending school and health check-ups. Poverty fell from 22% to 7% between 2003 and 2014; 29 million people exited extreme poverty. Payments were made via Caixa Econômica Federal bank cards, bringing 10 million unbanked families into the formal financial system. SA''s 18-million-recipient social grants system uses a similar architecture; Bolsa Família demonstrates the power of conditionality and financial inclusion linkages within grant programmes.',
  'https://www.gov.br/mds/pt-br/acoes-e-programas/transferencia-de-renda/bolsa-familia',
  'Brazil Ministry of Social Development Bolsa Família Report 2014; World Bank Brazil Poverty Note 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'financial_access'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION J: FISCAL SPACE (3 new — 5 ideas)
-- ────────────────────────────────────────────────────────────────────────────

-- J1. Chile copper stabilisation fund (FEES) (2006)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Chile', 'CHL', 2006,
  'Chile''s Fiscal Responsibility Law (2006) and Economic and Social Stabilisation Fund (FEES) require fiscal surpluses when copper prices exceed a structural trend estimate, saving the excess. The fund reached USD 22 billion by 2008, funding an USD 8 billion counter-cyclical stimulus during 2008–09 without raising debt. Chile''s sovereign credit rating improved to A+ (Fitch) — lowest bond spreads in Latin America. The structural balance rule is administered by an independent copper-price committee. SA''s mineral revenue volatility and rising debt present the identical fiscal management challenge this rule addresses.',
  'https://www.dipres.gob.cl/en/',
  'Chile Budget Directorate (DIPRES) Fiscal Rule Annual Report 2022; IMF Chile Article IV 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'fiscal_space'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- J2. Norway Government Pension Fund Global (1990)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Norway', 'NOR', 1990,
  'Norway''s Government Pension Fund Global (GPFG), established 1990, accumulated USD 1.4 trillion in oil revenue savings — the world''s largest sovereign wealth fund. The 4% rule caps annual fiscal spending at the fund''s estimated real return, protecting the principal. Independent Norges Bank Investment Management (NBIM) manages assets across 9,000 companies in 70 countries. Norway''s non-oil fiscal balance is structurally managed to avoid Dutch Disease. SA''s gold and platinum revenue streams, though smaller, could follow an analogous savings rule to rebuild fiscal space without raising tax rates or cutting services.',
  'https://www.nbim.no/en/the-fund/about-the-fund/',
  'Norges Bank Investment Management GPFG Annual Report 2022; IMF Norway Fiscal Framework Note 2021'
FROM policy_ideas p
WHERE p.binding_constraint = 'fiscal_space'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- J3. Botswana Pula Fund diamond savings (1994)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Botswana', 'BWA', 1994,
  'Botswana''s Pula Fund, established 1994 within the Bank of Botswana, saves long-term diamond revenues above a sustainable drawdown rate. The fund reached USD 5.7 billion by 2020. During diamond price crashes (2009, 2020) the fund provided counter-cyclical fiscal support without external borrowing. Botswana''s debt-to-GDP has never exceeded 30% despite being a single-commodity economy. The institutional key: diamond revenues flow through the fund before reaching Treasury, reversing the political economy that typically prevents savings. SA''s mineral revenue enters the general fiscus with no ring-fencing or savings mandate.',
  'https://www.bankofbotswana.bw/',
  'Bank of Botswana Annual Report 2022; Leith (2005) Why Botswana Prospered, McGill-Queen''s UP'
FROM policy_ideas p
WHERE p.binding_constraint = 'fiscal_space'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION K: HEALTH SYSTEMS (3 new — 6 ideas)
-- ────────────────────────────────────────────────────────────────────────────

-- K1. Thailand Universal Coverage Scheme (2002)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Thailand', 'THA', 2002,
  'Thailand achieved universal health coverage in 2002 (UCS) at USD 80 per person per year, serving 48 million previously uninsured citizens. Hospital admission rates doubled within 3 years; maternal mortality fell 35% over the following decade. The UCS pays district health offices by capitation rather than fee-for-service, controlling costs while incentivising prevention. Thailand''s health expenditure of 4% of GDP achieves better outcomes than many countries spending 8–10% of GDP. SA''s NHI debate centres on precisely the provider payment model that Thailand resolved with the UCS capitation approach.',
  'https://www.nhso.go.th/eng/',
  'National Health Security Office Thailand UCS Annual Report 2022; Tangcharoensathien et al. (2018) Lancet 392'
FROM policy_ideas p
WHERE p.binding_constraint = 'health_systems'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- K2. Rwanda community health workers programme (2005)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Rwanda', 'RWA', 2005,
  'Rwanda deployed 45,000 community health workers — two per village — to provide primary care to 12 million rural citizens from 2005. CHWs are elected by communities, receive three-month training, carry a drug supply kit, and are paid for performance-linked outcomes (vaccination rates, malnutrition screening). Child mortality fell from 196 per 1,000 live births (2000) to 45 (2020). Programme cost: USD 2 per capita annually. SA has 67,000 community health workers deployed inconsistently; Rwanda''s structured incentive, training, and supply-chain system demonstrates the gap between programme ambition and delivery architecture.',
  'https://www.moh.gov.rw/index.php/resources/ministry-reports',
  'Rwanda Ministry of Health Annual Report 2022; Binagwaho et al. (2014) BMJ 349:g4634'
FROM policy_ideas p
WHERE p.binding_constraint = 'health_systems'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- K3. Brazil SUS universal health system (1988)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Brazil', 'BRA', 1988,
  'Brazil''s SUS (Sistema Único de Saúde, 1988) created a universal free public health system for 210 million people. The Family Health Strategy teams (250,000 staff) provide primary care to 130 million citizens in their homes. HIV treatment through SUS — compulsory licensing of antiretrovirals from 1996 — cut AIDS mortality 50% and saved an estimated USD 1 billion. The Mais Médicos programme placed 18,000 doctors in underserved areas. SA''s NHI aspires to an equivalent architecture; Brazil demonstrates the 30-year timeline, workforce scale, and sustained political commitment the transition requires.',
  'https://www.saude.gov.br/sus',
  'Brazil Ministry of Health SUS 35 Years Report 2023; PAHO Brazil Health System Profile 2022'
FROM policy_ideas p
WHERE p.binding_constraint = 'health_systems'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION L: INNOVATION CAPACITY (3 new — 4 ideas)
-- ────────────────────────────────────────────────────────────────────────────

-- L1. Israel Start-Up Nation Yozma programme (1993)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Israel', 'ISR', 1993,
  'Israel grew from near-zero venture capital to USD 25 billion in VC investment (2021) — the world''s highest VC per capita — through the Yozma programme (1993): USD 100 million in government funds co-invested with private VCs, which could buy out the government stake at cost plus interest. This structure gave VCs upside while the government bore downside risk. 97 multinational R&D centres (Intel, Microsoft, Google) now operate in Israel. Start-up exits generated USD 44 billion in 2021. SA has the human capital base; Yozma''s co-investment matching structure is replicable through SEDA and the IDC.',
  'https://www.innovationisrael.org.il/en/',
  'Israel Innovation Authority Annual Report 2022; Senor & Singer (2009) Start-Up Nation, Twelve'
FROM policy_ideas p
WHERE p.binding_constraint = 'innovation_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- L2. Finland post-Nokia diversification (2012)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Finland', 'FIN', 2012,
  'Finland rebuilt its economy after the Nokia-led ICT crash (2012) by diversifying into gaming (Supercell, Rovio), cleantech, and health technology through the Tekes/Business Finland innovation funding agency and university-industry partnerships. R&D spending reached 3.3% of GDP. Business Finland funds 2,500 companies annually with non-dilutive grants of EUR 20,000–2 million linked to commercialisation milestones. Finland ranks #1 globally in university spin-off creation per student. SA''s overreliance on extractives presents an analogous diversification imperative; Finland''s public-risk private-upside funding model is directly transferable.',
  'https://www.businessfinland.fi/en/',
  'Business Finland Annual Report 2022; OECD Finland Innovation Policy Review 2017'
FROM policy_ideas p
WHERE p.binding_constraint = 'innovation_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- L3. South Korea KAIST technology university (1971)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'South Korea', 'KOR', 1971,
  'South Korea created KAIST (1971) as a graduate research university with English-language instruction, US-style PhD programmes, and an explicit technology commercialisation mandate. Government funded KAIST fully for its first 20 years. KAIST graduates founded Samsung''s semiconductor division, Hyundai''s R&D centre, and 7,200 start-ups to date. South Korea''s R&D spending reached 4.8% of GDP by 2022 — the world''s highest share. SA''s science councils (CSIR, SABS, NRF) were modelled on different institutional logic; KAIST''s explicit commercialisation mandate and industry-linkage tracking offer a direct reform blueprint.',
  'https://www.kaist.ac.kr/en/',
  'KAIST Research and Innovation Report 2022; OECD Korea Innovation System Review 2014'
FROM policy_ideas p
WHERE p.binding_constraint = 'innovation_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 2;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION M: LAND HOUSING (1 new — 1 idea)
-- ────────────────────────────────────────────────────────────────────────────

-- M1. Brazil Minha Casa Minha Vida housing programme (2009)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Brazil', 'BRA', 2009,
  'Brazil''s Minha Casa Minha Vida programme (2009) built 5.7 million housing units for low-income families by 2022, combining subsidised mortgages (10–30 year terms, 0.5% interest for lowest quintile) with direct construction grants and formalised land titles. The programme contributed 2% of GDP at peak activity and created 1.3 million jobs. Beneficiaries gained formal property titles, unlocking school enrolment, credit access, and address-based services. SA''s housing backlog (2.3 million units) and RDP programme face the same three gaps Brazil addressed: subsidy design, title formalisation, and bulk infrastructure co-ordination.',
  'https://www.gov.br/mdr/pt-br/assuntos/habitacao/minha-casa-minha-vida',
  'Brazil Ministry of Regional Development Minha Casa Minha Vida Report 2022; World Bank Brazil Housing Review'
FROM policy_ideas p
WHERE p.binding_constraint = 'land_housing'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- ────────────────────────────────────────────────────────────────────────────
-- SECTION N: FISCAL CONSTRAINT (1 new — 1 idea)
-- ────────────────────────────────────────────────────────────────────────────

-- N1. Ireland fiscal consolidation (2008)
INSERT INTO international_comparisons
    (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Ireland', 'IRL', 2008,
  'Ireland implemented a six-year fiscal consolidation (2008–2014) following its banking crisis, reducing its structural deficit from 11.5% to below 3% of GDP through a EUR 30 billion adjustment with a 2:1 ratio of spending cuts to tax increases. Key mechanisms: a three-year rolling budget framework, an independent Irish Fiscal Advisory Council (IFAC) established in 2011, and EU/IMF programme conditionality providing political cover for difficult decisions. Ireland''s debt-to-GDP fell from 123% (2012) to 45% (2022). SA''s fiscal trajectory requires analogous multi-year planning with independent fiscal oversight.',
  'https://www.fiscalcouncil.ie/',
  'Irish Fiscal Advisory Council Fiscal Assessment Report 2022; IMF Ireland Article IV 2023'
FROM policy_ideas p
WHERE p.binding_constraint = 'fiscal_constraint'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;


-- --------------------------------------------------------------------------------------
-- SECTION O: FROM data/international_comparisons.json (17 textbook-quality entries)
-- JSON binding_constraint -> DB mapping:
--   smme_finance_access       -> financial_access
--   state_capacity_governance -> government_capacity
--   fiscal_sustainability     -> fiscal_space
--   trade_competitiveness     -> regulatory_burden
--   industrial_policy         -> innovation_capacity
--   human_capital_skills      -> skills_education
--   digital_infrastructure    -> digital_infrastructure (direct)
-- --------------------------------------------------------------------------------------

-- O1. Kenya -- M-Pesa and Mobile Financial Inclusion (smme_finance_access -> financial_access)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Kenya', 'KEN', 2007,
  'Kenya''s Central Bank granted Safaricom a non-bank mobile money licence in 2007, resisting commercial bank pressure to restrict M-Pesa. Financial inclusion rose from 26% (2006) to 83% (2021) — among the fastest trajectories globally. Smallholder incomes rose 9–12% as payment costs fell. M-Shwari provided collateral-free micro-loans to 20+ million borrowers. IMF estimates M-Pesa contributed 1.5–2 percentage points to GDP growth over 2010–2020. SA''s rigid banking regulation suppresses comparable fintech-driven SMME credit; the SARB Project Khokha is promising but not yet at M-Pesa scale.',
  'https://www.imf.org/',
  'IMF Article IV Kenya 2021; World Bank Findex 2021; Jack & Suri (2016) Science'
FROM policy_ideas p WHERE p.binding_constraint = 'financial_access'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- O2. Kenya -- National Fibre Backbone and Digital Economy (digital_infrastructure)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Kenya', 'KEN', 2009,
  'Kenya invested in the national fibre optic backbone (NOFBI) from 2009, combined with submarine cable landings (TEAMS, SEACOM, EASSy), with an open-access mandate. Internet penetration rose from under 4% (2008) to 85%+ (2022). Nairobi became Africa''s leading tech hub (''Silicon Savannah'') hosting 400+ startups and USD 1.1 billion in startup investment by 2021. Digital services contribute ~8% of GDP. SA Connect Phase 2 has the right open-access architecture but has been hampered by execution delays and underfunding.',
  'https://www.worldbank.org/',
  'World Bank ICT Kenya Assessment 2022; GSMA Mobile Economy Africa 2023; Kende-Robb & Mark (2021) Brookings'
FROM policy_ideas p WHERE p.binding_constraint = 'digital_infrastructure'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- O3. Botswana -- Institutional Quality and the Botswana Model (state_capacity_governance -> government_capacity)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Botswana', 'BWA', 1966,
  'At independence in 1966, Botswana was one of the world''s poorest countries. The BDP government created an independent Minerals Management department staffed by meritocratic civil servants and established the Pula Fund to sterilise diamond revenue windfalls. Botswana sustained 9%+ per-capita GDP growth for 25 years (1966–1991) and reached upper-middle income status by 2000 — a resource-curse exception. Transparency International consistently ranks it the least corrupt country in sub-Saharan Africa. SA faces a comparable governance challenge post-state-capture: rebuilding meritocratic institutions under political pressure is the decisive intervention.',
  'https://www.imf.org/',
  'Acemoglu, Johnson & Robinson (2003) AER; Harvey & Lewis (1990) Oxford; IMF Botswana Article IV 2022'
FROM policy_ideas p WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 5;

-- O4. Botswana -- Pula Fund and Fiscal Rules (fiscal_sustainability -> fiscal_space)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Botswana', 'BWA', 1994,
  'Botswana''s Pula Fund (1994) saved diamond export revenues above the economy''s absorptive capacity under a statutory fiscal rule capping non-mining recurrent expenditure at 90% of recurrent revenues. The fund grew to USD 7.9 billion (2022), ~75% of GDP. External debt remained below 20% of GDP throughout. During the 2009 global financial crisis the fund provided fiscal buffer without IMF conditionality. SA has no commodity revenue stabilisation fund; mineral royalties and tax windfalls are fully consumed rather than saved, leaving the fiscus highly exposed to commodity cycles.',
  'https://www.bankofbotswana.bw/',
  'Iimi (2006) IMF Working Paper; Bank of Botswana Annual Reports; IMF Fiscal Monitor 2023'
FROM policy_ideas p WHERE p.binding_constraint = 'fiscal_space'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- O5. India -- UPI and India Stack (digital_infrastructure)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'India', 'IND', 2016,
  'NPCI launched UPI in 2016 as an open-architecture, interoperable, real-time payment rail built as a public good: zero merchant discount rates, open APIs, no proprietary lock-in. Digital payments grew from USD 8 billion (2016) to USD 1.5 trillion (2023). SMME access to merchant credit expanded to 70 million previously unbanked businesses. The India Stack DPI model has been replicated in 50+ countries. SA has emerging open-banking frameworks but lacks a national interoperable payment rail; government-owned open infrastructure generates adoption far faster than market-led alternatives.',
  'https://www.npci.org.in/',
  'BIS Working Paper 930 (2021); NPCI Annual Report 2023-24; McKinsey India Digital Finance 2023'
FROM policy_ideas p WHERE p.binding_constraint = 'digital_infrastructure'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- O6. India -- Direct Benefit Transfer system (state_capacity_governance -> government_capacity)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'India', 'IND', 2013,
  'India linked Aadhaar identity (1.3 billion enrolled) to bank accounts to route welfare transfers directly to beneficiaries. DBT expanded from LPG subsidies (2013) to 300+ government schemes by 2022. The government estimates DBT saved USD 33 billion in leakage and ghost beneficiaries between 2014 and 2022 — fiscal savings of ~1% of GDP annually. Financial inclusion rose from 35% (2011) to 80%+ (2022) driven by mandatory account opening for DBT. SA''s SASSA has faced persistent fraud; India''s DBT architecture (biometric ID + bank account linkage) is directly replicable using SA''s Home Affairs digital ID rollout.',
  'https://www.worldbank.org/',
  'World Bank DBT India Assessment 2019; NITI Aayog DBT Mission Reports 2022; Muralidharan et al. (2020) AER'
FROM policy_ideas p WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 6;

-- O7. Chile -- Individual Account Pension Reform (fiscal_sustainability -> fiscal_space)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Chile', 'CHL', 1981,
  'Chile replaced its pay-as-you-go pension system with mandatory individual accounts (AFPs) in 1981. By 2010, pension assets exceeded 70% of GDP — the deepest capital market in Latin America — funding domestic infrastructure and corporate bonds. The national savings rate rose from ~5% to ~21% of GDP over two decades. Chile''s credit rating reached A+ (Fitch) — the only Latin American country at that level. SA''s pension fund sector (>100% of GDP AUM) has limited appetite for domestic infrastructure; Regulation 28 reform lifting the limit on alternative assets is the direct SA analogue.',
  'https://www.worldbank.org/',
  'Edwards (1998) JEP; World Bank Chile Pension Review 2016; OECD Pensions at a Glance 2023'
FROM policy_ideas p WHERE p.binding_constraint = 'fiscal_space'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 4;

-- O8. Chile -- Copper Stabilisation Fund (fiscal_sustainability -> fiscal_space)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Chile', 'CHL', 1987,
  'Chile created the Copper Stabilisation Fund in 1987, formalised in 2001 as a structural fiscal surplus rule: spend only based on long-run copper price and estimated potential GDP. When the 2008–09 financial crisis hit, Chile deployed a USD 4 billion fiscal stimulus from fund savings without borrowing. Sovereign spreads fell to among the lowest in emerging markets. SA has no commodity revenue rule and no stabilisation fund; mineral royalties are fully spent in the year of receipt, making the budget highly procyclical. A legislated mineral-revenue cycle rule with parliamentary lock-in — as in Chile — is constitutionally feasible.',
  'https://www.imf.org/',
  'Frankel (2011) IMF Working Paper; IMF Chile Article IV 2023; Larrain & Sachs (2002) Brookings'
FROM policy_ideas p WHERE p.binding_constraint = 'fiscal_space'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- O9. Mauritius -- Export Processing Zones and Trade Competitiveness (trade_competitiveness -> regulatory_burden)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Mauritius', 'MUS', 1970,
  'Mauritius established Export Processing Zones (EPZs) in 1970 offering zero tariffs on imported inputs, competitive corporate tax, and streamlined labour regulations for EPZ firms. Manufacturing exports drove growth in the 1970s–80s before diversification into financial services and tourism, each contributing 10%+ of GDP. Income per capita rose from USD 260 (1968) to USD 9,000 (2000) — a 35-fold increase. Mauritius is the only sub-Saharan African country to have reached high-income status. SA''s SEZs have the physical infrastructure but lack the regulatory carve-out depth of Mauritius''s original EPZ framework.',
  'https://www.worldbank.org/',
  'Subramanian & Roy (2003) IMF Working Paper; World Bank Mauritius Competitiveness Review 2018; Baissac (2011) World Bank SEZ Study'
FROM policy_ideas p WHERE p.binding_constraint = 'regulatory_burden'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 5;

-- O10. Mauritius -- Business Climate Reform (state_capacity_governance -> government_capacity)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Mauritius', 'MUS', 2005,
  'Mauritius reached 13th globally on World Bank Doing Business by 2019 (SA dropped to 84th) through a reform programme driven by a dedicated Reform Office in the Prime Minister''s office with cross-ministerial authority to break bureaucratic logjams. Business registration fell to 3 days (vs SA''s 46 days in 2023). FDI inflows to GDP nearly doubled from 2.5% to 4.8% over the decade. The key institutional innovation — a Reform Office in the PM''s office with direct political mandate — is what SA''s BizPortal and SARS online systems lack: a coordinating institution with authority to override departmental resistance.',
  'https://www.worldbank.org/',
  'World Bank Doing Business 2019; IMF Mauritius Article IV 2022; Zafar (2011) World Bank Working Paper'
FROM policy_ideas p WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 7;

-- O11. Rwanda -- Imihigo Performance Contracts and State Reconstruction (state_capacity_governance -> government_capacity)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Rwanda', 'RWA', 2000,
  'Rwanda rebuilt state capacity after 1994 through merit-based senior civil service recruitment and Imihigo performance contracts for ministers and district leaders linked to quarterly presidential reviews. Rwanda rose from one of the world''s most fragile states to 38th on Doing Business (2020). GDP per capita grew from USD 225 (2000) to USD 822 (2020); business registration fell to 4 hours. Corruption Perceptions Index rank: 49th globally (2023), better than SA at 83rd. SA''s performance management system (DPME, MPAT) exists but lacks consequences for non-performance — Rwanda''s key institutional difference.',
  'https://www.worldbank.org/',
  'Chemouni (2014) Journal of Eastern African Studies; World Bank Rwanda Public Sector Review 2018; TI CPI 2023'
FROM policy_ideas p WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 8;

-- O12. Rwanda -- FDI-Led Services and MICE Development (trade_competitiveness -> regulatory_burden)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Rwanda', 'RWA', 2010,
  'Rwanda positioned Kigali as Africa''s MICE capital through the Kigali Convention Centre, visa-on-arrival expansion (120+ countries), and English as official language from 2008. The Rwanda Development Board reduced FDI setup time to under 24 hours. FDI inflows tripled from USD 400 million to USD 1.3 billion (2012–2022). Services exports grew from 24% to 48% of total exports. Rwanda established Africa''s only operational drone delivery network (Zipline), delivering 600,000+ blood units to remote hospitals. SA''s InvestSA is structurally comparable but more fragmented; Rwanda''s single empowered investment promotion agency model is the institutional gap.',
  'https://rdb.rw/',
  'UNCTAD World Investment Report 2023; World Bank Rwanda FDI Analysis 2022; AfDB Rwanda Economic Outlook 2023'
FROM policy_ideas p WHERE p.binding_constraint = 'regulatory_burden'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 6;

-- O13. Vietnam -- Doi Moi FDI-Led Manufacturing (industrial_policy -> innovation_capacity)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Vietnam', 'VNM', 1986,
  'Vietnam''s Doi Moi reforms from 1986 combined agricultural de-collectivisation with FDI-led manufacturing in Special Economic Zones, negotiating bilateral investment treaties and maintaining 10% effective corporate tax for SEZ manufacturers. Vietnam became the world''s 2nd largest electronics exporter (2022), having hosted essentially zero electronics FDI in 1995. Samsung invested USD 17 billion in Vietnam. GDP per capita grew from USD 200 (1986) to USD 3,700 (2022); poverty fell from 60% to under 5%. SA''s SEZ quality — reliable power, fast customs, plug-and-play industrial sites — is the most directly applicable lesson.',
  'https://www.imf.org/',
  'IMF Vietnam Article IV 2023; UNCTAD Vietnam Investment Review 2022; Malesky (2016) JEP'
FROM policy_ideas p WHERE p.binding_constraint = 'innovation_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- O14. Vietnam -- Digital Economy Strategy (digital_infrastructure)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Vietnam', 'VNM', 2020,
  'Vietnam''s 2020 National Digital Economy Strategy targeted 20% of GDP from digital economy by 2025. The government mandated Make-in-Vietnam software targets for public procurement, allocated 5G spectrum (world''s 7th commercial 5G deployment, 2022), and established dedicated digital industrial parks. Digital economy reached 14.3% of GDP in 2022 (vs 8.2% in 2018). Vietnam exported USD 16 billion in software and IT services (2022), becoming a top-10 global tech outsourcing destination. SA''s 5G spectrum allocation was significantly delayed by Telkom legal challenges; Vietnam prioritised access over incumbent protection.',
  'https://www.worldbank.org/',
  'GSMA Mobile Economy Asia Pacific 2023; World Bank Vietnam Digital Economy Assessment 2023; VNAT Digital Economy Report 2022'
FROM policy_ideas p WHERE p.binding_constraint = 'digital_infrastructure'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- O15. South Korea -- Universal Education and the East Asian Human Capital Miracle (human_capital_skills -> skills_education)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'South Korea', 'KOR', 1960,
  'South Korea made universal primary and secondary education the cornerstone of its development strategy in the 1960s, investing 4–6% of GDP in public education, making primary fees zero, and linking STEM graduate production to emerging export sectors. Primary enrolment reached 100% by 1970; secondary enrolment rose from 20% (1960) to 95% (1990). GDP per capita rose from USD 160 (1960) to USD 6,500 (1990) — among the fastest transitions in history. SA''s reading crisis (19% of Grade 4 learners reading for meaning — PIRLS 2021) demands the foundational literacy push Korea executed; delay makes the gap permanent.',
  'https://www.oecd.org/',
  'Lee & Kim (2010) NBER Working Paper; OECD Education at a Glance 2023; World Bank Korea Education Review 2020'
FROM policy_ideas p WHERE p.binding_constraint = 'skills_education'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 5;

-- O16. South Korea -- Chaebol-Led Export Industrialisation (industrial_policy -> innovation_capacity)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'South Korea', 'KOR', 1961,
  'Korea''s Park government (1961–1979) selected strategic sectors (steel, petrochemicals, electronics, shipbuilding) and directed credit to chaebol meeting export targets — subsidies were conditional and performance-based: chaebol failing export milestones lost access to subsidised credit. Korea became the world''s largest shipbuilder, a top-5 steel producer, and 3rd largest electronics manufacturer within 30 years. GDP per capita growth averaged 8% for three decades. SA''s sector Master Plans (auto, clothing, steel) are structurally analogous but less disciplined: underperforming beneficiaries face no consequences — the critical difference from Korea.',
  'https://www.worldbank.org/',
  'Amsden (1989) Asia''s Next Giant; Chang (2006) East Asian Development Experience; World Bank East Asian Miracle (1993)'
FROM policy_ideas p WHERE p.binding_constraint = 'innovation_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 3;

-- O17. India -- PMKVY Skill India Vocational Training (human_capital_skills -> skills_education)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'India', 'IND', 2015,
  'India''s Pradhan Mantri Kaushal Vikas Yojana (PMKVY, 2015) targeted 10 million youth using a demand-side financing model: training providers were paid per successful industry-recognised certification, not per student enrolled. 14.5 million persons trained and certified by 2023. Wage premium for certified workers averaged 15–20% above uncertified peers. Recognition of Prior Learning certified 7 million existing workers. Employment conversion rates (~55%) revealed that certification alone does not guarantee placement without demand-side support. SA''s SETA system has weak accountability for employment outcomes; PMKVY''s output-based payment model is the reform SA''s skills sector most needs.',
  'https://www.nsdcindia.org/',
  'World Bank Skill India Assessment 2021; NSDC Annual Report 2022-23; Datta & Bhattacharjea (2022) ILO Working Paper'
FROM policy_ideas p WHERE p.binding_constraint = 'skills_education'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 6;
