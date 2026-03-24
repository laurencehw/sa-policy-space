-- Migration 002: International Comparisons Database
-- Creates the international_comparisons table and seeds 12 example entries.
-- Run in the Supabase SQL editor (or via psql for self-hosted).
--
-- Each seed row picks the highest-impact idea for the relevant binding constraint
-- so the INSERT is safe on any database state — rows simply won't insert if the
-- policy_ideas table has no matching constraint.

-- ── Table ─────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS international_comparisons (
    id              SERIAL PRIMARY KEY,
    idea_id         INT NOT NULL REFERENCES policy_ideas(id) ON DELETE CASCADE,
    country         TEXT NOT NULL,
    iso3            TEXT,               -- ISO 3166-1 alpha-3
    reform_year     INT,                -- Year reform was enacted (or start year of range)
    outcome_summary TEXT NOT NULL,      -- What happened: approach, results, transferability to SA
    source_url      TEXT,               -- URL to primary source (IMF, World Bank, paper)
    source_label    TEXT,               -- Human-readable citation label
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intl_comp_idea_id ON international_comparisons(idea_id);
CREATE INDEX IF NOT EXISTS idx_intl_comp_country  ON international_comparisons(country);

-- ── Seed data ─────────────────────────────────────────────────────────────────
-- Using INSERT ... SELECT so nothing fails if ideas don't match.
-- OFFSET 1 gives the second-ranked idea for constraints with multiple entries.

-- Energy: Chile private generation (1982)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Chile', 'CHL', 1982,
  'Chile restructured its electricity sector in 1982, separating generation, transmission and distribution and introducing competitive private generation. By 2000 private investment had tripled installed capacity. Rolling blackouts common in the 1970s were eliminated. The model became the global template for power-sector liberalisation and is directly relevant to Eskom unbundling proposals. Key success factors: an independent system operator (CDEC), long-term power purchase agreements to de-risk private investment, and regulated access to transmission infrastructure.',
  NULL,
  'World Bank Chile Energy Sector Review (2019)'
FROM policy_ideas p WHERE p.binding_constraint = 'energy'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Energy: India solar scale-up (2010)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'India', 'IND', 2010,
  'India scaled utility-scale solar from near-zero to 70 GW between 2010 and 2023 through competitive reverse auctions, viability gap funding, and the National Solar Mission. Tariffs fell from Rs 17/kWh to Rs 2/kWh — below coal. The IPP procurement model with government offtake guarantees removed private-sector financing risk. SA''s REIPPP programme closely mirrors this model; India resolved the equivalent of SA''s Eskom offtake delay by establishing a separate grid operator (SECI) with ring-fenced payment obligations.',
  NULL,
  'IEA India Renewables 2023; IEEFA South Asia Power Tracker'
FROM policy_ideas p WHERE p.binding_constraint = 'energy'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- Logistics: Vietnam port concessions (2007)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Vietnam', 'VNM', 2007,
  'Vietnam concessioned major port terminals to private operators from 2007, investing USD 3 billion in capacity expansion at Cai Mep-Thi Vai. Container throughput grew from 3 million TEU (2007) to 25 million TEU (2022). Port efficiency scores improved from bottom quartile to upper-middle globally. Success required separating port authority from terminal operations — the precise reform proposed in SA''s National Ports Act amendment — and enforcing competitive tariff regulation through an independent regulator.',
  NULL,
  'World Bank Vietnam Logistics Report 2022; UNCTAD Port Statistics'
FROM policy_ideas p WHERE p.binding_constraint = 'logistics'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Logistics: Brazil rail concessions (1997)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Brazil', 'BRA', 1997,
  'Brazil concessioned 28,000 km of federal railway to private operators in 1997. Freight volumes more than doubled over 20 years. Rail market share in freight rose from 18% to 30%. Private investment of USD 20 billion replaced chronic underinvestment. Key success factors: 30-year concession terms, capital expenditure obligations written into contracts, and an independent regulator (ANTT) with tariff-setting authority. SA''s Transnet rail concession debate mirrors Brazil''s pre-1997 institutional state almost exactly.',
  NULL,
  'ANTT Brazil Rail Regulatory Report 2021; World Bank Transport & ICT Note'
FROM policy_ideas p WHERE p.binding_constraint = 'logistics'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1 OFFSET 1;

-- Skills: South Korea vocational education (1974)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'South Korea', 'KOR', 1974,
  'South Korea built a network of polytechnic colleges from 1974, funded by a mandatory training levy (0.5% of payroll) with employer governance over curriculum. By 1990, 60% of secondary graduates were in vocational tracks. Engineers and technicians from these colleges staffed the semiconductor, shipbuilding, and automotive industries that drove Korea''s growth miracle. SA''s SETA system collects a similar levy but the training supplied does not match employer demand — Korea''s success rested on industry governance of what is taught, not just what is funded.',
  NULL,
  'ILO Korea VET Case Study 2018; OECD Education at a Glance 2022'
FROM policy_ideas p WHERE p.binding_constraint = 'skills'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Digital: Estonia e-government (2000)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Estonia', 'EST', 2000,
  'Estonia built a national digital identity infrastructure (X-Road data exchange layer, e-ID card) from 2000. By 2020, 99% of public services were available online, tax filing took 5 minutes, and company registration 18 minutes. Estimated savings: 2% of GDP annually in civil servant time. The X-Road interoperability layer — allowing government databases to communicate securely — is now licensed to Finland, Japan, and Azerbaijan. SA''s GovTech and SITA have proposed equivalent systems but lack the political mandate and interoperability standards that drove Estonian success.',
  NULL,
  'e-Estonia Government Report 2022; World Bank Digital Government Review'
FROM policy_ideas p WHERE p.binding_constraint = 'digital'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Regulation: Botswana business registration (2008)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Botswana', 'BWA', 2008,
  'Botswana streamlined business registration from 47 days to 3 days (2008–2014) by merging the Companies Registry, Tax Authority registration, and Trade Licence into a single online portal with a unified form. The CIPA one-stop shop eliminated duplicative requirements. Investment promotion improved from 103rd to 42nd in World Bank Doing Business rankings. FDI inflows rose 40% in the following 5 years. SA''s CIPC online registration is analogous but post-registration licencing (municipal, SARS, labour) remains fragmented — the gap Botswana closed.',
  NULL,
  'World Bank Doing Business Botswana 2014; UNCTAD Investment Monitor'
FROM policy_ideas p WHERE p.binding_constraint = 'regulation'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Government capacity: Rwanda civil service reform (2000)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Rwanda', 'RWA', 2000,
  'Rwanda rebuilt its civil service from near-zero after 1994, implementing performance contracts (imihigo) for every public servant from President to village level. By 2010, 90% of health facilities met service targets. Public financial management improved from bottom decile globally to top-quartile in Sub-Saharan Africa (PEFA 2015). The key mechanism: quarterly performance reviews with transparent scoring, linked to promotion and compensation. SA''s performance management system exists on paper but assessments are rarely completed and consequences non-existent — the institutional gap Rwanda closed.',
  NULL,
  'World Bank Rwanda Public Sector Reform 2015; IMF Article IV Rwanda 2022'
FROM policy_ideas p WHERE p.binding_constraint = 'government_capacity'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Corruption: Georgia anti-corruption (2004)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Georgia', 'GEO', 2004,
  'Georgia cut petty corruption dramatically after 2004: the entire traffic police (16,000 officers) was dismissed and replaced with a smaller, better-paid force. Public service salaries were raised to market rates, funded by tax administration reform that doubled the tax-to-GDP ratio. Transparency International CPI improved from 2.0 (2003) to 5.2 (2014). Doing Business rank improved from 112th (2006) to 15th (2014). The approach required political will to absorb short-term disruption but demonstrated that rapid institutional change is possible. SA''s NPA and SAPS face analogous institutional capture challenges.',
  NULL,
  'Transparency International CPI 2014; World Bank Georgia Public Sector Note'
FROM policy_ideas p WHERE p.binding_constraint = 'corruption'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Land: Peru urban land titling (1996)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Peru', 'PER', 1996,
  'Peru''s COFOPRI (Commission for the Formalisation of Informal Property) titled 1.5 million urban plots between 1996 and 2003. Titled households invested 68% more in housing improvements than untitled control groups. Access to formal credit increased significantly for newly titled owners. De Soto''s ''dead capital'' theory (ILD 1989) was directly operationalised. SA''s Upgrading of Informal Settlements programme has similar ambitions; COFOPRI''s success rested on a dedicated single-purpose agency with streamlined authority, not a multi-department committee process.',
  NULL,
  'Field & Torero (2006) AER; World Bank Peru Informal Housing Study 2005'
FROM policy_ideas p WHERE p.binding_constraint = 'land'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Labour market: Colombia labour reform (2002)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Colombia', 'COL', 2002,
  'Colombia''s 2002 labour reform (Law 789) reduced severance costs, extended the normal work-day definition, and introduced flexible contracting for micro-enterprises. Formal employment grew by 1.8 million jobs in the following 4 years. Informality fell from 60% to 52% over the decade. The reform was contested by unions but balanced with expanded unemployment insurance — a ''flexicurity lite'' approach. SA''s labour market debate mirrors Colombia''s pre-2002 position: high formal-sector protection coexisting with massive informality and youth unemployment above 60%.',
  NULL,
  'Kugler (2005) IMF WP; OECD Colombia Labour Market Review 2015'
FROM policy_ideas p WHERE p.binding_constraint = 'labor_market'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;

-- Crime: Medellín urban transformation (1991)
INSERT INTO international_comparisons (idea_id, country, iso3, reform_year, outcome_summary, source_url, source_label)
SELECT p.id, 'Colombia', 'COL', 1991,
  'Medellín reduced homicide rates by 95% over 20 years (from 380/100k in 1991 to 18/100k in 2015) through a combination of urban cable cars connecting hillside comunas to the city centre, public libraries, parks, and community investment in former gang strongholds — addressing crime through social infrastructure rather than mass incarceration. Researchers call this ''urbanism as crime prevention''. The approach has stronger evidence for long-run sustainability than enforcement-only models. SA''s township spatial exclusion and gang activity in Cape Flats present a comparable structural challenge.',
  NULL,
  'Cerdá et al. (2012) AJE; UNDP Medellín Urban Transformation Case Study'
FROM policy_ideas p WHERE p.binding_constraint = 'crime'
ORDER BY p.growth_impact_rating DESC NULLS LAST LIMIT 1;
