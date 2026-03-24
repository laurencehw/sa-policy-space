-- Migration 009: Package narrative content
-- Adds narrative enrichment columns to reform_packages table (creates table if not exists).
-- The primary source of truth for this data is data/reform_packages.json (bundled at build time).
-- This migration syncs the narrative content to Supabase for future DB-driven use.

-- Create the table (if moving package data to DB in future)
CREATE TABLE IF NOT EXISTS reform_packages (
  package_id          integer PRIMARY KEY,
  name                text NOT NULL,
  tagline             text,
  theory_of_change    text,
  overview            text,
  binding_constraints_addressed text,
  sequencing_rationale          text,
  international_precedents      text,
  expected_impact               text,
  idea_count          integer,
  avg_feasibility     numeric(4,2),
  avg_growth_impact   numeric(4,2),
  stalled_or_proposed_count     integer,
  implemented_or_partial_count  integer,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);

-- Add narrative columns if table already existed without them
ALTER TABLE reform_packages
  ADD COLUMN IF NOT EXISTS overview                      text,
  ADD COLUMN IF NOT EXISTS binding_constraints_addressed text,
  ADD COLUMN IF NOT EXISTS sequencing_rationale          text,
  ADD COLUMN IF NOT EXISTS international_precedents      text,
  ADD COLUMN IF NOT EXISTS expected_impact               text;

-- ── Package 1: Infrastructure Unblock ─────────────────────────────────────

INSERT INTO reform_packages (
  package_id, name, tagline, theory_of_change,
  overview, binding_constraints_addressed, sequencing_rationale,
  international_precedents, expected_impact,
  idea_count, avg_feasibility, avg_growth_impact,
  stalled_or_proposed_count, implemented_or_partial_count
) VALUES (
  1,
  'Infrastructure Unblock',
  'Remove physical bottlenecks that constrain all economic activity',
  'South Africa''s growth ceiling is set by infrastructure failure. Load-shedding cuts industrial output by an estimated 5–7% of potential GDP; dysfunctional ports and rail add 15–30% to logistics costs for exporters; deteriorating roads raise transport poverty in rural areas. These bottlenecks interact: an SMME that survives power cuts still cannot compete internationally if Transnet cannot move its goods reliably. Infrastructure reform therefore carries the highest cross-sector growth multiplier of any package.

The package is sequenced around the energy anchor: Eskom restructuring and the Electricity Regulation Amendment Act create the competitive platform; grid expansion and renewables integration deliver the supply; and parallel Transnet and port reforms unblock the logistics corridor. Water and digital infrastructure close the gap. Most reforms here require institutional change and capital, placing the majority in the medium-term — but quick regulatory wins (NERSA independence, self-generation licensing, IRP update) can deliver measurable relief within a year.',

  'South Africa''s infrastructure deficit is both its most visible economic problem and its most tractable one. Unlike deficits in human capital — where today''s investment takes a decade to appear in the workforce — infrastructure investment pays dividends relatively quickly: a mine that cannot export, a factory running diesel generators, a logistics chain adding weeks to delivery times all respond to physical improvements within years, not decades. The Infrastructure Unblock package targets the bottlenecks where constraint relief yields the highest cross-sectoral growth multiplier.

The energy anchor dominates everything else. Load-shedding destroyed an estimated R338 billion in output between 2020 and 2024, suppressing investment confidence across every sector. Eskom''s recovery and liberalisation of electricity generation under the Electricity Regulation Amendment Act are the most time-critical reforms in this package — they unlock the returns to virtually every other investment in the economy. Parallel reforms to Transnet''s port and rail operations address the logistics corridor that exporters, miners, and manufacturers depend on.

The package is deliberately front-loaded with regulatory changes requiring no capital outlay. Removing licensing thresholds for self-generation, establishing NERSA''s independence, and updating the Integrated Resource Plan change incentive structures and crowd in private capital at minimal fiscal cost. Capital-intensive network expansions follow once the regulatory platform is in place — a sequencing principle that distinguishes workable infrastructure reform from expensive fiscal sinkholes.',

  'In the Hausmann-Rodrik-Velasco diagnostic framework, this package addresses low social returns arising from infrastructure failure. Electricity, logistics, and water deficits raise the cost of all economic activity — not by raising the price of any single input but by imposing premium costs (diesel backup, alternative logistics, water storage) that erode margins and make SA producers uncompetitive at the margin of global value chain participation. A secondary constraint is the coordination failure inherent in network industries: electricity grids, rail networks, and ports are natural monopolies where private actors cannot solve the coordination problem unilaterally, requiring state action to restructure the market.',

  'Regulatory liberalisation comes first because it can be achieved by amendment and immediately changes private sector incentive structures without fiscal outlays. NERSA independence, self-generation deregulation, and the IRP update are 12-month deliverables. Institutional restructuring — Eskom unbundling, Transnet governance reform — follows because it requires legislative change and management capacity-building. Capital-intensive infrastructure (transmission expansion, port deepening, water treatment investment) comes last, partly financed by the private capital that prior regulatory reform has already crowded in. Inverting this sequence — deploying capital before the regulatory environment changes — creates fiscal sinkholes, as South Africa''s own history of Eskom capital programmes demonstrates.',

  'Chile reformed its electricity sector in the 1980s, separating generation from transmission and distribution and creating an independent regulator. By the 2000s, Chile had Latin America''s lowest electricity tariffs and most reliable supply, attracting substantial mining investment — the lesson being that regulatory restructuring precedes investment, not the reverse. India''s Electricity Act (2003) opened generation to competition; capacity grew from 112 GW to over 400 GW by 2022. Colombia''s logistics reform (CONPES 3547, 2008) and subsequent port modernisation reduced logistics costs for exporters by an estimated 15% over a decade. Kenya''s geothermal corridor demonstrates that state development corporations can effectively de-risk private generation investment when governance is competent.',

  'Full implementation is estimated to add 1.5–2.5 percentage points to South Africa''s potential GDP growth rate, with the energy reforms accounting for roughly half. Eskom stabilisation and competitive generation reform are expected to reduce electricity costs for industrial users by 20–30% in real terms within 5 years. Transnet and port reforms could reduce logistics costs for exporters by 15–20%, improving competitiveness in manufacturing and agri-processing. The package is estimated to catalyse R300–400 billion in private infrastructure investment over 10 years, with fiscal multipliers meaning each rand of public enabling investment generates R2–4 in private capital deployment.',

  29, 3.15, 3.97, 11, 11
)
ON CONFLICT (package_id) DO UPDATE SET
  overview                      = EXCLUDED.overview,
  binding_constraints_addressed = EXCLUDED.binding_constraints_addressed,
  sequencing_rationale          = EXCLUDED.sequencing_rationale,
  international_precedents      = EXCLUDED.international_precedents,
  expected_impact               = EXCLUDED.expected_impact,
  updated_at                    = now();

-- ── Package 2: SMME & Employment Acceleration ──────────────────────────────

INSERT INTO reform_packages (
  package_id, name, tagline, theory_of_change,
  overview, binding_constraints_addressed, sequencing_rationale,
  international_precedents, expected_impact,
  idea_count, avg_feasibility, avg_growth_impact,
  stalled_or_proposed_count, implemented_or_partial_count
) VALUES (
  2,
  'SMME & Employment Acceleration',
  'Remove friction from SA''s best short-term jobs engine',
  'With formal employment growing at under 1% per year and the unemployment rate structurally above 30%, the only credible near-term jobs engine is small and medium enterprise growth. SMMEs account for roughly 60% of employment but face a regulatory environment ranked among the most burdensome in sub-Saharan Africa: multi-step compliance, slow dispute resolution, constrained access to finance, and procurement markets effectively closed to new entrants. Each layer of friction is a lost job.

This package attacks friction directly. Red-tape reduction and BizPortal integration can be achieved by regulatory amendment alone — they are quick wins. SEFA mandate reform and SMME procurement enforcement require institutional alignment but no new spending. The informal economy integration reforms have the longest political economy, but even partial progress — simplified tax registration, dignified trading infrastructure — expands the base. Taken together, the package targets the regulatory and financial bottlenecks identified by the Presidential SMME Summit as the binding constraints on small-business job creation.',

  'South Africa''s unemployment rate — above 40% on the expanded definition — is structurally unlike that of most middle-income countries. It is not primarily a macroeconomic problem amenable to demand stimulus, nor principally a skills problem that education spending alone can address. It is a market access and regulatory problem: millions of South Africans have skills, energy, and entrepreneurial ambition but face an entry environment designed, in effect, for large incumbents. The SMME & Employment Acceleration package is the growth diagnostics answer to why the private sector''s job-creation engine is so persistently stalled.

The core friction is not capital — it is regulatory burden and market exclusion. BizPortal integration, compliance streamlining, and the SMME Ombud Service operationalisation are low-cost reforms achievable by ministerial directive within 12 months. They change the immediate experience of anyone attempting to formalise an enterprise. The second layer — procurement market access and SEFA mandate reform — requires institutional co-ordination but no major spending. The third layer — informal economy integration — addresses the hardest category: the 2–3 million South Africans in survivalist informal employment who are, in many cases, one regulatory accommodation away from productive formal participation.

Unusually among the reform packages, this one generates employment at essentially zero net fiscal cost. The HRV diagnostic suggests that for SMME growth, the binding constraint is not low returns — small businesses in South Africa face high demand from an underserved population — but prohibitively high entry and survival costs. Removing these frictions is a genuine free lunch, which makes its persistence over three decades of democratic government something of a diagnostic puzzle.',

  'The primary binding constraint is market failure in small business entry and survival: regulatory friction, information asymmetries in credit markets, and systematic exclusion from procurement markets. In HRV terms, this is a microeconomic risk and coordination failure — the small business regulatory environment was designed for large formal enterprises and imposes disproportionate compliance costs on new and small firms. Secondary constraints include financial market failure (SEFA''s limited risk-capital mandate relative to the scale of the gap) and missing markets for affordable business development services that would reduce the first-three-year failure rate of new enterprises.',

  'Quick regulatory wins — BizPortal integration, the SMME Ombud, red-tape audits — are prioritised because they require no fiscal outlay and deliver visible early results that build political coalition for deeper reform. Procurement reform follows because it requires government-side process changes (payment timelines, set-aside thresholds, compliance requirements) rather than private sector behaviour change. Informal economy integration comes last because it requires both supply-side accommodation (dignified trading infrastructure, simplified tax registration) and demand-side behaviour change, which takes longer to achieve. Skills and access-to-finance reforms run throughout as enablers.',

  'Rwanda''s business environment reforms between 2005 and 2015 reduced the time to register a business from 16 days to 4 hours, contributing to a 7-fold increase in formal registrations and sustained 7–8% GDP growth — the key drivers were political commitment and digitalisation, not capital expenditure. Brazil''s Simples Nacional system (2006) created a unified tax regime for small enterprises, reducing compliance costs by an estimated 90% for micro-businesses and bringing 7 million firms into the formal economy within 5 years. Colombia''s formalisation programme combined simplified registration with tax incentives and business development services. Mexico''s experience with procurement set-asides demonstrates that market access reform can shift supplier composition without sacrificing value for money.',

  'The package targets 400,000–600,000 net new formal jobs over 5 years, primarily in services, retail, construction, and light manufacturing. Procurement market access reform is estimated to redirect R50–80 billion annually toward qualifying small enterprises, generating secondary income multiplier effects. Formalisation of informal economy participants could add R30–50 billion to the national tax base within 5 years. International evidence suggests reducing business entry costs by 50% — achievable through full BizPortal integration — increases registered business numbers by 25–40%, and that simplified tax compliance correlates with 15–25% higher SMME survival rates at the 3-year mark.',

  18, 3.05, 3.33, 11, 5
)
ON CONFLICT (package_id) DO UPDATE SET
  overview                      = EXCLUDED.overview,
  binding_constraints_addressed = EXCLUDED.binding_constraints_addressed,
  sequencing_rationale          = EXCLUDED.sequencing_rationale,
  international_precedents      = EXCLUDED.international_precedents,
  expected_impact               = EXCLUDED.expected_impact,
  updated_at                    = now();

-- ── Package 3: Human Capital Pipeline ─────────────────────────────────────

INSERT INTO reform_packages (
  package_id, name, tagline, theory_of_change,
  overview, binding_constraints_addressed, sequencing_rationale,
  international_precedents, expected_impact,
  idea_count, avg_feasibility, avg_growth_impact,
  stalled_or_proposed_count, implemented_or_partial_count
) VALUES (
  3,
  'Human Capital Pipeline',
  'Invest now because the lags are a decade long',
  'South Africa''s medium-term growth potential is capped by human capital failure. Only 19% of Grade 4 learners can read for meaning (PIRLS 2021) — the worst outcome among middle-income comparators. The TVET system produces artisans at roughly 20% of the economy''s estimated need. Healthcare worker unemployment coexists with healthcare worker shortages in public facilities. These are not primarily fiscal problems; they are institutional, pedagogical, and governance failures that can be addressed now, but whose full returns arrive in 8–15 years. Starting late means locking in the human capital deficit for a generation.

The package is anchored in the reading crisis: foundation literacy is the prerequisite for every other human capital outcome. ECD reform feeds into primary literacy; primary literacy feeds TVET take-up and university readiness; TVET quality feeds the manufacturing and energy transition skills pipelines. Health system strengthening runs in parallel as a labour productivity intervention — TB, mental health, and the primary healthcare platform directly affect workforce capacity. NHI implementation is included because a credible roadmap is necessary to prevent further talent flight from the public health system.',

  'No middle-income country has sustained 5% growth with 30% youth unemployment and a literacy crisis affecting the majority of its primary school children. South Africa''s human capital deficit is simultaneously its deepest structural problem and its most expensive to fix — deep because it compounds across generations, expensive because the lags between investment and outcome stretch 8–15 years. The Human Capital Pipeline package begins from this uncomfortable arithmetic: South Africa cannot grow its way out of inequality without fixing its schools, but fixing schools takes a decade. The time to start is therefore not tomorrow.

The package''s anchor is the literacy crisis. PIRLS 2021 placed only 19% of South African Grade 4 children at the reading-for-meaning benchmark — the worst outcome of any middle-income country tested. A child who cannot read by Grade 4 has a dramatically reduced probability of completing secondary school, accessing TVET, or participating in the formal labour market as an adult. Foundation Phase literacy is therefore not merely an education metric but a labour market policy intervention with a 10-year lag. ECD expansion, mother-tongue instruction fidelity, and structured literacy programmes in Grades 1–3 are the highest-return human capital investments South Africa can make.

TVET reform and health system strengthening run in parallel because the current skill composition of the labour market is misaligned with demand, and because health outcomes — TB prevalence, untreated mental illness, primary care access — directly reduce workforce capacity. South Africa spends comparably to higher-performing peers as a share of GDP on education; the problem is not resources but institutional delivery quality.',

  'The binding constraint is low human capital quality — a case of low social returns arising not from inadequate public spending but from institutional failure in delivery. In the HRV diagnostic, low-quality human capital keeps South Africa''s economy locked in less sophisticated production activities where skill intensity is low, limiting both productivity growth and wages for the majority. Secondary constraints include skills mismatch (the TVET system producing artisans in the wrong trades at insufficient volume) and health system failure (TB prevalence, untreated mental health, primary care gaps reducing effective workforce participation and life expectancy).',

  'Foundation Phase literacy reform is sequenced first because it is the prerequisite for all other human capital outcomes and can be initiated through curriculum reform and teacher coaching with minimal capital investment — no new schools need to be built to fix how reading is taught. ECD expansion requires more fiscal commitment but can begin incrementally with community-based models. TVET quality reform is sequenced for the medium term because it requires industry partnerships, infrastructure investment, and curriculum redesign that cannot be rushed. Health system reforms — TB control, mental health scale-up, primary care platform strengthening — benefit from some early governance quick wins but are largely medium-to-long-term investments.',

  'Poland''s education reforms between 1999 and 2009 transformed its PISA scores from below OECD average to consistently above average through curriculum reform, teacher professionalisation, and structural school system changes — demonstrating that systemic coherence outperforms isolated interventions. Vietnam''s exceptional PISA performance despite low per-capita spending shows that institutional quality matters more than expenditure levels. Brazil''s Bolsa Família demonstrated that conditional transfers tied to school attendance can dramatically reduce dropout and improve learning outcomes for children from poor households. Chile''s SIMCE assessment created school-level accountability and drove continuous improvement over two decades. Ethiopia''s health extension worker programme showed that community-based primary care can improve health outcomes at scale and low cost.',

  'Full implementation is projected to raise South Africa''s potential labour productivity by 0.5–1.5% per year over a 15-year horizon, as better-educated cohorts enter the workforce. The return on the reading crisis intervention alone is estimated at 8–12% annually by economists applying standard human capital pricing models. TVET reform targeting artisan supply could reduce the engineering skills premium by 30–40%, making manufacturing investment more internationally competitive. Health system strengthening — particularly TB control — is estimated to recover 0.3–0.5% of GDP annually in lost workforce productivity. The alternative — locking in the human capital deficit for another generation — has a compound cost that dwarfs the investment.',

  42, 3.05, 3.26, 18, 7
)
ON CONFLICT (package_id) DO UPDATE SET
  overview                      = EXCLUDED.overview,
  binding_constraints_addressed = EXCLUDED.binding_constraints_addressed,
  sequencing_rationale          = EXCLUDED.sequencing_rationale,
  international_precedents      = EXCLUDED.international_precedents,
  expected_impact               = EXCLUDED.expected_impact,
  updated_at                    = now();

-- ── Package 4: Trade & Industrial Competitiveness ─────────────────────────

INSERT INTO reform_packages (
  package_id, name, tagline, theory_of_change,
  overview, binding_constraints_addressed, sequencing_rationale,
  international_precedents, expected_impact,
  idea_count, avg_feasibility, avg_growth_impact,
  stalled_or_proposed_count, implemented_or_partial_count
) VALUES (
  4,
  'Trade & Industrial Competitiveness',
  'Align incentives with comparative advantage and compete globally',
  'South Africa''s economy is too small to grow on domestic demand alone. With a GDP of roughly $380 billion and structural unemployment above 30%, sustainable growth requires deeper participation in global value chains. AfCFTA creates a $3 trillion continental market; AGOA provides preferential US access; the energy transition creates demand for South African critical minerals and green hydrogen. But capturing these opportunities requires competitive logistics, credible industrial policy, and a regulatory environment that rewards investment.

The package combines trade facilitation (AfCFTA, AGOA, BRICS+ payment systems) with sector-specific master plans (auto, textiles, steel, minerals beneficiation) and the horizontal enablers that make them credible: competition policy, IP reform, and digital markets. Science, technology, and innovation reforms connect commercial R&D to industrial strategy. The theory of change is comparative advantage: South Africa has structural strengths in minerals, automotive assembly, agri-processing, and potentially green hydrogen — industrial policy should reinforce these positions rather than try to create winners from scratch.',

  'South Africa''s productive structure is simultaneously a story of extraordinary natural endowment and relative industrial underperformance. It holds the world''s largest reserves of platinum group metals, significant chrome, manganese, titanium, and vanadium deposits, a globally competitive automotive assembly base, and agricultural exports that punch above the country''s weight in global specialty markets. Yet its export basket has barely diversified over three decades, its integration into global value chains remains limited, and its share of continental manufacturing has declined relative to faster-moving peers. The Trade & Industrial Competitiveness package addresses the gap between potential and performance.

The theory of change draws on Ricardo Hausmann''s product space analysis: South Africa''s challenge is not simply to produce more of what it already makes, but to develop productive capabilities that allow movement into adjacent, higher-value activities. Minerals beneficiation is the paradigmatic case — South Africa already has the input endowment, technical base, and global market relationships; what it lacks is a policy environment making value-addition attractive relative to raw-concentrate export. Similarly, the automotive sector''s EV transition is not a threat but an opportunity if industrial policy provides the right transition support.

This package requires more institutional sophistication than the others because effective industrial policy is genuinely difficult: it requires the state to identify and support activities where market failures are real, while resisting capture by incumbents seeking protection from competition. The international evidence is clear that the critical success factor is not the choice of sector but the choice of instrument — R&D tax incentives, export-linked performance conditions, and contestable procurement work better than discretionary subsidies.',

  'The primary binding constraint is market failure in productive diversification — the ''self-discovery'' problem identified by Hausmann and Rodrik (2003): private returns to discovering that a new product is viable are lower than social returns because competitors can immediately imitate a successful innovator. This problem is most acute in minerals beneficiation, green hydrogen, and advanced manufacturing. Secondary constraints include coordination failures in export market development (individual firms cannot afford the market intelligence and relationship-building that collective action could achieve), missing markets in long-term trade finance, and concentrated domestic markets that reduce competitive pressure on incumbents.',

  'Trade facilitation reforms — AfCFTA implementation, AGOA utilisation maximisation, customs modernisation — are quick wins because they expand the market immediately addressable by existing SA producers without requiring industrial investment. Sector master plans (automotive, steel, agri-processing, minerals beneficiation) are medium-term because they require co-development with industry and investment commitments that take time to materialise. Science, technology, and innovation reforms — increasing GERD, improving IP frameworks, developing the university-to-industry commercialisation pipeline — are long-term because their returns compound over decades. Competition policy reforms run throughout, since concentrated domestic markets are a structural drag on competitiveness across all sectors.',

  'Botswana''s renegotiated diamond beneficiation agreement with De Beers (2011) required domestic polishing; within a decade Botswana became the world''s second-largest diamond cutting and polishing centre — demonstrating that resource nationalism and private partnership can co-exist when terms are reasonable. Mauritius transformed from a single-crop economy to a diversified financial services and light manufacturing hub between 1970 and 2000, using export processing zones, preferential trade agreements, and active investment promotion. Morocco''s automotive ecosystem development — from near-zero to 700,000 vehicles per year in 15 years — shows what African industrial policy can achieve with sustained sectoral focus and strategic investment promotion. South Korea''s conditional support for strategic sectors with performance-linked incentives demonstrates that structural transformation is possible within a generation when state capacity is adequate.',

  'Trade and industrial competitiveness reforms are estimated to add 0.5–1.0 percentage points to annual growth through improved export performance and higher value-added manufacturing. AfCFTA full implementation could increase South Africa''s intra-African exports by $50–70 billion over 10 years, given its role as the continent''s most diversified industrial producer. Minerals beneficiation at scale could generate R80–120 billion in additional annual GDP by 2035. The green hydrogen economy represents a potential $20–50 billion export opportunity by 2040 if South Africa captures a 5–10% share of projected global demand — a plausible scenario given its solar and wind endowments, existing platinum catalyst production, and deep-water port infrastructure.',

  23, 2.89, 3.26, 8, 1
)
ON CONFLICT (package_id) DO UPDATE SET
  overview                      = EXCLUDED.overview,
  binding_constraints_addressed = EXCLUDED.binding_constraints_addressed,
  sequencing_rationale          = EXCLUDED.sequencing_rationale,
  international_precedents      = EXCLUDED.international_precedents,
  expected_impact               = EXCLUDED.expected_impact,
  updated_at                    = now();

-- ── Package 5: State Capacity & Governance ────────────────────────────────

INSERT INTO reform_packages (
  package_id, name, tagline, theory_of_change,
  overview, binding_constraints_addressed, sequencing_rationale,
  international_precedents, expected_impact,
  idea_count, avg_feasibility, avg_growth_impact,
  stalled_or_proposed_count, implemented_or_partial_count
) VALUES (
  5,
  'State Capacity & Governance',
  'None of the above works without a capable state',
  'Every other reform package is mediated by state institutions: regulators, procurement systems, tax authorities, SOE boards, provincial departments. Where those institutions are captured, underfunded, or dysfunctional, reform legislation sits unimplemented and fiscal resources leak. South Africa''s structural fiscal deficit — debt service now absorbs over 20 cents of every revenue rand — is itself a governance failure compounded by Eskom bailouts, SOE losses, and revenue shortfalls that a fully capacitated SARS could partially recover.

This package addresses the enabling conditions for all other packages. FATF greylisting exit is the most urgent: it raises borrowing costs, impairs correspondent banking, and signals institutional fragility to investors. Fiscal consolidation and SARS capacity expansion create the headroom for infrastructure investment. SOE reform — not just Eskom but the full portfolio — reduces contingent liabilities. Anti-corruption and consequence management reforms close the governance loop. Without meaningful progress here, the other four packages will be partially implemented, poorly resourced, and chronically stalled.',

  'South Africa''s governance crisis is not an abstract concern about political culture — it carries a precise and measurable fiscal cost. Load-shedding was partly a governance failure: the decisions that left Eskom technically and financially insolvent were not acts of God but of procurement fraud, political interference in appointments, and systematic underinvestment in maintenance. The FATF greylisting, lifted in 2023 but leaving institutional scar tissue, emerged from legislative and enforcement gaps that sophisticated jurisdictions had addressed years earlier. Debt service now absorbs over 22 cents of every rand of government revenue — crowding out spending on nurses, teachers, and infrastructure — because fiscal consolidation was deferred across three successive administrations.

The State Capacity & Governance package is therefore not aspirational good-government reform: it is the enabling condition for every other package in this database. A state that cannot maintain its electricity infrastructure cannot implement an energy transition. A state that cannot manage procurement without systematic leakage cannot deliver affordable housing at scale. A state that cannot collect the taxes legally due cannot fund its human capital investment commitments. The binding constraint on South Africa''s reform capacity is not ideas — this database contains 139 of them — but institutional execution.

The package is organised around three interdependent pillars: fiscal sustainability (debt stabilisation, SARS capacity restoration, expenditure quality), SOE rationalisation (Eskom completion and the broader portfolio), and anti-corruption and consequence management. These pillars are mutually reinforcing: fiscal space requires ending SOE bailouts; SOE performance requires anti-corruption enforcement; anti-corruption requires independent institutions with tenure and resources.',

  'The binding constraint in HRV terms is microeconomic risk — specifically, the risk that investment returns will be appropriated through corruption, regulatory capture, or contract renegotiation. This raises the cost of capital across the economy and reduces the probability of long-horizon investment that requires a credible state counterparty (infrastructure PPPs, mining rights, export processing zones). Secondary constraints include fiscal crowding out (high debt service reduces the state''s capacity to invest in public goods), SOE contingent liabilities that create fiscal instability and suppress sovereign credit ratings, and insufficient administrative capacity that prevents regulatory and delivery agencies from functioning competently even when legislation is sound.',

  'FATF compliance has the highest near-term urgency because its absence raises borrowing costs and impairs financial system functioning — and it is a tractable governance reform with immediate, measurable external validation. SARS capacity expansion is sequenced early because it generates its own fiscal return (every rand invested in SARS recovers an estimated R10–12 in additional revenue) and changes the fiscal arithmetic for everything else. Fiscal consolidation is medium-term because it requires both revenue measures and expenditure reprioritisation that need political consensus across coalition partners. SOE rationalisation beyond Eskom is medium-to-long term given workforce implications and sector-specific regulatory redesign. Anti-corruption institutional reforms — NPA capacity, SIU resourcing, asset forfeiture, consequence management — are longest-horizon because they require institutional culture change, not just legislative amendment.',

  'Estonia''s public sector digitalisation between 1997 and 2010 demonstrates that a country with weak legacy institutions can leapfrog to governance excellence through technology-enabled transparency — e-government reduced corruption opportunities by minimising discretionary human interaction in public services. Botswana''s Directorate on Corruption and Economic Crime, established at independence, has maintained the country as one of Africa''s least corrupt despite natural resource wealth, demonstrating that governance institutions can be built alongside resource booms. Rwanda''s dramatic governance improvement post-1994 — from near-failed state to one of Africa''s better-governed countries — was enabled by clear political commitment, merit-based civil service recruitment, and robust accountability mechanisms. Colombia''s constitutional fiscal rules (2011 Fiscal Sustainability Act) demonstrate that legislative constraints on expenditure growth can be durable when political will to enforce them exists.',

  'Governance and state capacity reforms have diffuse but large economic effects. Elimination of the governance risk premium on South African sovereign debt is estimated to reduce borrowing costs by 100–150 basis points over 5 years, saving R15–25 billion annually in debt service. Full SARS capacity restoration is estimated to recover R50–80 billion in annual tax gap. SOE rationalisation — ending Eskom bailout requirements and reducing contingent liabilities — could free R40–60 billion annually for productive investment. Improved public procurement integrity, bringing South Africa to OECD average procurement efficiency, could recover 10–15% of procurement spend (R40–60 billion per year). The compound effect — improved fiscal space, lower cost of capital, higher investment confidence — is estimated at 0.8–1.5 additional percentage points of annual GDP growth.',

  27, 2.96, 3.12, 10, 7
)
ON CONFLICT (package_id) DO UPDATE SET
  overview                      = EXCLUDED.overview,
  binding_constraints_addressed = EXCLUDED.binding_constraints_addressed,
  sequencing_rationale          = EXCLUDED.sequencing_rationale,
  international_precedents      = EXCLUDED.international_precedents,
  expected_impact               = EXCLUDED.expected_impact,
  updated_at                    = now();
