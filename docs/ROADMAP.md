# SA Policy Space — Roadmap

*Last updated: 2026-03-25*

---

## 1. Current State

### What Exists

A deployed web application tracking 132 South African policy reform ideas extracted from 1,061 parliamentary committee meetings sourced from the Parliamentary Monitoring Group (PMG) API. The project has a clear intellectual framework — five reform packages organised around binding growth constraints — and a rich dependency graph (~400 edges) capturing reform sequencing logic.

**Technical stack:** Next.js 14, TypeScript, Tailwind CSS, SQLite (dev) / Supabase (prod). Python scripts for data collection and analysis.

**Deployed at:** [sa-policy-space.vercel.app](https://sa-policy-space.vercel.app)

**Pages live (31):** Home dashboard, Ideas list (with filtering/pagination), Idea detail, Packages grid, Package detail (with dependency diagrams), Themes by constraint, Dependencies (interactive D3 graph), Analytics, Stakeholders, Compare, Feasibility Matrix, Progress Dashboard, Timeline (with indicator overlays), Simulator, Reform Index, BRRR Recommendations, Sequencing, Budget Alignment, Accountability, Legislation Generator (Green Paper / White Paper / Template Bill), Brief Generator, Economic Indicators, Teaching, API Docs, Glossary, Methodology, About.

### Key Stats

| Metric | Value |
|--------|-------|
| Policy ideas | 177 |
| Parliamentary committees covered | 19 |
| Committee meetings indexed | 5,000+ |
| Binding constraints covered | 18+ distinct types (all populated) |
| Reform packages | 5 |
| Dependency graph | 162 nodes, 228 edges |
| Stakeholders mapped | 38 (+ 458 idea-level stances) |
| International comparisons | 59 peer country cases |
| Economic indicators | 16 time-series (GDP, unemployment, Gini, etc.) |
| Textbook chapters linked | 15 (with GitBook URLs) |
| Tests | 83 (API routes, data validation, utilities) |
| Deployment status | **Live** — [sa-policy-space.vercel.app](https://sa-policy-space.vercel.app) |

### What Works Well

- **Data model is sound.** Normalised schema, clear separation of concerns between raw PMG data, synthesised ideas, and reform packages. The `implementation_plans` table is well-designed.
- **Reform package logic is strong.** Each of the five packages has a coherent theory of change, time horizon breakdown, and sequencing rationale. This is real intellectual value.
- **Dependency graph is the core asset.** ~400 edges capturing "requires / enables / accelerates / complements" relationships between 130+ ideas. No comparable resource exists for SA policy.
- **UI is clean and coherent.** The Tailwind interface is consistent, well-styled, and the component architecture is maintainable.
- **Binding constraints framework is defensible.** Grounded in Hausmann-Rodrik-Velasco growth diagnostics and NPC/World Bank literature.

---

## 2. Identified Gaps (from initial audit — March 2026)

> **Note:** Most gaps identified in this section have been **resolved** as of March 25, 2026.
> Kept for historical reference. See `data/CHANGELOG.md` for what was added.
>
> **Resolved:** Idea descriptions enriched (multiple migration batches), implementation plans populated,
> fiscal estimates added, stakeholder mapping (38 actors + 256 idea-level stances), international
> comparisons (59 cases), interactive D3 dependency graph with SVG export, economic indicators dashboard
> (16 time-series), textbook chapter integration, search expanded to full-text, committee filter added,
> reform momentum scoring, budget/BRRR alignment analysis, ISR caching for performance.
>
> **Remaining:** Committee coverage gaps (Health, Housing, Police partially addressed but could be deeper),
> historical PMG data pre-2021, temporal status tracking (status change history per idea).

### 2a. Content & Data Quality (Critical)

**93% of ideas are stubs.** Only 9 of 132 ideas have descriptions exceeding 500 characters. Most are one-sentence summaries. The tool cannot inform policy decisions without substantive descriptions — this is the single largest gap and it undermines everything else.

**Zero implementation plans.** The schema has an `implementation_plans` table (with fields for steps, timeline, cost estimate, required legislation, international precedents). The frontend has UI to render them. But the table is empty. The methodology page promises this content exists. It doesn't.

**No fiscal dimension.** There is no cost estimate, budget impact, or fiscal space analysis for any idea. For a project aimed at policymakers and economists, this is a fundamental gap. "What will this cost and who pays for it?" is the first question any National Treasury official asks.

**No stakeholder mapping.** Politics matters. Each idea has a `responsible_department` field but nothing about: who supports this (labour, business, ANC faction, DA)? Who blocks it (unions, incumbents, provincial governments)? Understanding the political economy of each reform is essential for sequencing — a technically sound idea with a powerful opponent will stall no matter how high its growth_impact rating.

**No international comparisons in the data.** The about page mentions international precedents as part of implementation plans, but there is no structured comparative data. Which of South Africa's constraints were solved (or failed to be solved) by peer economies — Kenya, India, Chile, Botswana? This context is what makes the assessments credible.

**Committee coverage gaps.** The following committees are absent from the raw data:
- Health (major binding constraint for human capital)
- Housing & Human Settlements (land/housing is a binding constraint but has only 1-2 ideas)
- Police / Justice (crime is listed as a binding constraint, zero committee data)
- Higher Education (skills constraint is underrepresented relative to its importance)
- Cooperative Governance (critical for service delivery issues)
- Standing Committee on Finance (more depth needed beyond Appropriations)

**Meeting content is shallow.** The `meetings` table stores titles and dates but not actual discussion content (summaries, key quotes from committee members, minister responses). The key_quote field in policy_ideas is rarely populated. Without this, the provenance claim — "grounded in what parliament actually discussed" — is thin.

**Reform status is static.** Status (proposed / under review / stalled / implemented) was assigned at data entry and is not updated. Several ideas marked "proposed" may have since moved. There is no audit trail or date of last status review.

### 2b. Analytics (Significant Gap)

**Dependency graph is underanalysed.** ~400 edges of reform sequencing data sit in a JSON file and are displayed as static SVGs. Nobody has run:
- **Network centrality analysis**: Which ideas are structural bottlenecks (high in-degree = many reforms depend on them)? These deserve priority regardless of their individual ratings.
- **Reform cluster detection**: Which ideas naturally co-move? Are the five hand-assigned packages supported by the graph structure?
- **Critical path analysis**: Given current statuses, what is the minimum set of actions that unblocks the most downstream reforms?
- **Package coherence check**: Do the 400 dependency edges mostly run within packages or across them? Cross-package dependencies reveal coordination challenges.

**No reform momentum score.** The data has `times_raised`, `first_raised_date`, `last_discussed`, and `current_status`. From these you can construct a momentum score: ideas gaining traction (recently discussed, status improving) vs. losing it (dormant, status stalled). Currently this is only partially surfaced (the "dormant" flag is computed but not foregrounded).

**No progress index over time.** There are 1,061 meetings spanning multiple years. A "reform velocity" chart — number of actionable ideas discussed per quarter, status transitions over time — would show whether parliament is accelerating or decelerating on reform. This is exactly the kind of accountability metric civil society needs.

**Budget/BRRR alignment gap.** The project mentions integration with Budget Review and Recommendations Reports (BRRR) data. No such analysis exists. Cross-referencing which reform ideas have received budget allocations vs. which are unfunded is straightforward in principle and would be highly valuable.

**Constraint severity is unscored.** Ideas are tagged to binding constraints but constraints themselves are not ranked by severity. A weighted ranking (e.g., energy costs the economy 2 GDP points, logistics 1.5 points, based on published estimates) would allow a "constraint-adjusted priority score" for ideas.

### 2c. Frontend/UX (Moderate Gap)

**Search is too limited.** Full-text search only matches title and description. It should also search key_quote, responsible_department, source_committee, and theme. A user searching for "Transnet" should find all relevant ideas.

**No committee filter.** The ideas list has constraint/status/package/time_horizon filters but not `source_committee`. Given the data comes from 10+ committees, this is an obvious missing filter.

**Dependency graph is a static SVG.** The SVGs are pre-generated, fixed images. They cannot be filtered, zoomed interactively, hovered for tooltips, or explored by clicking nodes. For a graph with 130 nodes and 400 edges, a D3 force-directed layout with filtering by package/constraint/status would transform this from a diagram into an analytical tool. This is the highest-leverage UX improvement.

**No timeline view.** The data has temporal information (first_raised_date, last_discussed) but there is no chronological view. A parliamentary timeline showing reform discussion patterns by committee and topic would reveal which ideas are gaining or losing momentum.

**Ideas list is not sortable by column.** Users can filter but cannot sort by growth_impact, feasibility, times_raised, or last_discussed in the UI. The API supports sort=impact but only one sort option is exposed.

**No sharing/export.** No way to share a filtered view, export a package as PDF, or cite a specific idea with a stable URL (ideas do have URLs but they're numeric IDs, not slugs).

**About page undersells the methodology.** The binding constraints framework deserves more explanation — why these 10/18 and not others? What were the editorial decisions? What are the known blind spots? Transparency builds credibility with researchers.

**Mobile experience is untested.** Tailwind responsive classes are used but the dependency SVG diagrams and multi-column layouts likely break on mobile.

### 2d. Policy Output (Gap Against Stated Goals)

**No policy brief generation.** The data model contains everything needed for a structured 2-page policy brief: idea description, binding constraint, growth impact, feasibility, status, responsible department, international precedents, implementation steps. These are not formatted for any audience. A policymaker or journalist cannot take anything directly from this site to a meeting.

**No presentation format.** No slide deck or executive summary format for any package. The downloadable Word report is the only non-web format, and it is a single synthesis document rather than per-package outputs.

**No connection to the textbook.** This project is supposed to integrate with _The South African Economy_ textbook. No such linkage exists — no cross-references, no chapter-to-idea mappings, no teaching notes linking empirical content to policy proposals.

**No API for researchers.** The API routes exist (`/api/ideas`, `/api/packages`, etc.) but there is no public documentation, no rate limiting, no versioning, and no stable URL. An academic wanting to cite or use this data programmatically cannot do so.

### 2e. Technical (Foundation Gaps)

**Not deployed.** This is the most basic gap: the tool is invisible to everyone except its creator. Vercel + Supabase is the obvious path; the infrastructure is designed for it.

**No data refresh pipeline.** PMG publishes new meetings continuously. The current `collect_pmg.py` script must be run manually. There is no scheduled job, no change detection, no process for reviewing new meetings and extracting new policy ideas.

**No testing.** No unit tests, no integration tests, no data validation scripts. Given the project's credibility depends on data quality, at minimum there should be validation that flags ideas with missing fields, empty descriptions, or stale status.

**Supabase integration is stubbed but not wired.** The frontend checks `process.env.NEXT_PUBLIC_SUPABASE_URL` but falls back to SQLite for all data fetching. The production path is not tested.

**Node.js v24 dependency.** The `node:sqlite` module requires Node.js v24+. This is non-standard and will cause silent failures on most hosting environments and developer machines. Should be documented prominently or replaced with better-supported `better-sqlite3`.

**No admin interface.** Adding or editing ideas requires running Python scripts and directly modifying SQLite. This is a barrier to keeping the data current.

---

## 3. Prioritised Roadmap

### Phase 1: Make It Real (Weeks 1–6)
*Goal: A deployed, credible tool with substantive content for the highest-priority ideas.*

#### 1.1 Deploy to Vercel + Supabase
**Effort:** 1–2 days | **Impact:** Critical (enables all other goals)

The project is invisible until deployed. Supabase schema is written; Vercel config is trivial for Next.js. Key tasks:
- Migrate SQLite data to Supabase Postgres
- Wire Supabase client in frontend (currently stubbed)
- Set up environment variables
- Deploy with a clean URL (sapolicyspace.org or similar)
- Verify all pages render from Postgres

#### 1.2 Write Full Descriptions for Top 30 High-Priority Ideas
**Effort:** 3–5 days | **Impact:** Critical (core content quality problem)

Prioritise: `growth_impact_rating >= 4 AND feasibility_rating >= 3`. Target ~400–600 words per idea covering:
- What the idea proposes (precisely, not vaguely)
- Why it addresses the stated binding constraint
- What the evidence base is (SA-specific data, international examples)
- What has been tried before and why it stalled
- What would change if implemented

This is the single most important content task. A tool with 30 excellent idea profiles is more useful than one with 132 stubs.

#### 1.3 Write Implementation Plans for Top 10 Quick-Win Ideas
**Effort:** 2–3 days | **Impact:** High

The `implementation_plans` table has fields for: steps JSON, timeline, cost_estimate, required_legislation, international_precedent, key_actors. Fill this for the 10 ideas with `time_horizon = 'quick_win' AND growth_impact_rating >= 4`. These are the ideas that a new government minister could pick up on day one. Structure each plan as:
1. Immediate actions (0–90 days)
2. Legislative/regulatory requirements
3. Budget envelope estimate
4. International precedent (1–2 country examples)
5. Key actors who must be in the room

#### 1.4 Add Committee and Sorting Filters to Ideas Page
**Effort:** 0.5 days | **Impact:** Medium

Add `source_committee` to the filter options in `/ideas`. Add column-sortable controls for growth_impact, feasibility, and last_discussed. These are already in the data model — this is a UI change only.

#### 1.5 Expand Full-Text Search
**Effort:** 0.5 days | **Impact:** Medium

Include `key_quote`, `responsible_department`, `source_committee`, and `theme` in the LIKE clause in `getIdeas()`. Consider SQLite FTS5 if search performance becomes an issue at larger scale.

#### 1.6 Add Slug-Based URLs for Ideas
**Effort:** 1 day | **Impact:** Medium (shareability and citation)

Replace `/ideas/[id]` with `/ideas/[slug]` where slug is a URL-safe version of the title. Stable, human-readable URLs matter for sharing and academic citation. Store slugs in the database.

---

### Phase 2: Analytical Depth (Months 2–4)
*Goal: Turn the data into genuine insight that policymakers and researchers cannot get elsewhere.*

#### 2.1 Interactive Dependency Graph (D3.js)
**Effort:** 4–6 days | **Impact:** High (transforms the core intellectual asset)

Replace the static SVG dependency diagrams with an interactive D3 force-directed graph. Features:
- Node colour by reform package, size by growth_impact_rating
- Edge colour by relationship type (requires/enables/accelerates)
- Click node → shows idea summary panel, links to detail page
- Filter by: package, constraint, status, time horizon
- Highlight: "show only bottleneck nodes" (high in-degree), "show critical path"
- Export current view as SVG/PNG

This is the highest-leverage UX investment. The 400-edge dependency graph is the project's unique intellectual contribution; making it interactive makes it usable.

#### 2.2 Network Centrality & Bottleneck Analysis
**Effort:** 1–2 days | **Impact:** High (new analytical insight)

Using the existing `dependency_graph.json`, compute with NetworkX:
- **In-degree centrality**: ideas that many other reforms depend on (structural bottlenecks)
- **Betweenness centrality**: ideas that lie on the most reform pathways
- **Strongly connected components**: clusters of mutually reinforcing reforms
- **Critical path**: given current statuses, what is the minimum action set to unblock the most reforms?

Surface this as a "Bottleneck Ideas" panel on the packages page and a sortable column in the ideas list. This is what transforms a catalogue into a strategic tool.

#### 2.3 Reform Momentum Score
**Effort:** 1 day | **Impact:** High (accountability metric)

Compute a composite score for each idea:
```
momentum = (times_raised / max_times_raised) * 0.3
          + (status_score) * 0.4       # proposed=1, under_review=2, partial=3, implemented=4, stalled=0
          + (recency_score) * 0.3      # 1 if discussed in last 6mo, 0.5 if 6-18mo, 0 if >18mo
```
Display this as a badge or sortable column. Surface "ideas gaining momentum" as a featured section on the homepage. This converts static data into a dynamic accountability tracker.

#### 2.4 Fiscal Impact Estimates
**Effort:** 3–5 days | **Impact:** High (essential for policy credibility)

For each idea in the top 30, add structured fiscal data:
- **Budget cost estimate** (R millions, with order-of-magnitude confidence: low/medium/high)
- **Revenue or savings impact** if applicable
- **Fiscal space constraint**: which ideas require new spending vs. regulatory change vs. institutional reform (zero-cost)?
- **Source**: NT budget documents, NPC estimates, academic literature

Add a `fiscal_notes` field to `policy_ideas` and surface in idea detail pages. For quick wins, flag "zero fiscal cost" prominently — these are low-hanging fruit.

#### 2.5 Stakeholder Mapping
**Effort:** 3–4 days | **Impact:** High (political economy is what makes reform happen)

Add a structured `stakeholders` field or join table per idea with:
- **Supporters**: who benefits and is likely to advocate (business associations, unions, provincial governments, NGOs)
- **Blockers**: who has veto power or strong opposition interest
- **Neutral/unclear**: key actors whose position is uncertain

Add an `opposition_risk` rating (1–5) to complement feasibility. Surface a "political economy" section on idea detail pages. This makes the tool genuinely useful to anyone trying to build reform coalitions.

#### 2.6 Committee Coverage Expansion
**Effort:** 2–3 days | **Impact:** Medium-High

Collect and process meetings from:
- Health (committee 4 or similar PMG ID)
- Higher Education & Training
- Justice & Constitutional Development (crime/rule of law)
- Housing & Human Settlements (land/housing constraint)
- Cooperative Governance (service delivery)

Target: expand from 132 ideas to 180–220, filling the underrepresented constraints (health, crime, land).

#### 2.7 Parliamentary Timeline View
**Effort:** 2–3 days | **Impact:** Medium

A chronological view of reform activity: a chart showing meetings per committee per quarter, with colour indicating whether ideas in those meetings are stalled, progressing, or implemented. This answers: "Is SA reforming faster or slower than three years ago?" Think of it as a reform velocity chart. Key page: add a `/timeline` route with a D3 chart and a table of status transitions.

#### 2.8 Automated Data Refresh Pipeline
**Effort:** 2–3 days | **Impact:** Medium (data freshness)

- Schedule `collect_pmg.py` to run weekly (GitHub Actions cron job or similar)
- Add change detection: flag meetings added since last run
- Build a simple review queue: new meetings that may contain policy ideas, for human review
- Update `last_scraped` metadata in the database
- Email/webhook notification when new high-relevance meetings are detected

#### 2.9 International Comparisons Database
**Effort:** 3–4 days | **Impact:** Medium-High (credibility + benchmarking)

A structured database benchmarking SA policy ideas and reform outcomes against peer countries. This is the data infrastructure that underpins the interactive comparisons view in Phase 3.7. Currently mentioned in the methodology but entirely absent from the data.

**Peer country set:** Brazil, Turkey, Malaysia, Kenya, Chile, Indonesia, Colombia, Botswana, Mauritius, Rwanda — selected to span income levels, institutional contexts, and constraint profiles similar to SA.

**Data model:** Create a `country_comparisons` table with:
- `constraint_type` (links to SA binding constraints taxonomy)
- `country` and `iso3` code
- `reform_approach` (free text: what did they do?)
- `outcome_summary` (what happened? growth impact, implementation timeline, degree of success)
- `implementation_year` / `year_range`
- `source_type` (IMF Article IV, World Bank, academic paper, government report)
- `source_reference` (citation string)
- `relevance_to_sa` (short note on applicability/transferability)
- Optional `idea_id` FK for direct linkage to a SA policy idea

**Comparative policy databases to draw from:**
- World Bank Doing Business / Business Ready (now deprecated but historical data is valuable)
- IMF Structural Reform Database (covers 90+ countries, 1970–2015)
- OECD PMR (Product Market Regulation) indicators for comparator countries
- World Bank SABER (education/skills reform tracking)
- IEA/IRENA transition data for energy reforms
- ILO STAT for labour market reform benchmarks

**Cross-country indicators to populate per constraint:**
- Energy: electricity access rate, SAIDI (outage hours), tariff levels, IPP share
- Logistics: LPI score, port dwell time, rail freight cost per tonne-km
- Labour: hiring/firing cost, EPRC index, informal employment share
- Finance: credit-to-GDP, SME loan access, cost of capital
- Education/skills: tertiary enrolment, PISA scores (where available), TVET completion

**Case study format (target: 2–3 per constraint):**
1. Country and constraint addressed
2. Reform approach (regulatory, institutional, investment)
3. Implementation timeline and key actors
4. Measurable outcome with source
5. SA applicability note — what would need to be different given SA's political economy?

**Curation approach:** Start with 10 high-priority SA ideas (growth_impact ≥ 4, feasibility ≥ 3) and add 3–5 comparators per idea. Prioritise constraints where peer-country evidence is strongest: energy (Chile, Kenya), logistics (Malaysia, Rwanda), labour market flexibility (Colombia, Turkey), trade/competition (Mexico, India). This gives ~40–50 structured comparison entries — enough to populate the Phase 3.7 frontend meaningfully.

**Integration with Phase 3.7:** Once this database is populated, the Interactive International Comparisons page (Phase 3.7) can be data-driven rather than static. The API endpoint `/api/v1/comparisons` should return comparators by constraint or by idea_id.

---

### Phase 3: Policy Output & Ecosystem (Months 4–12)
*Goal: Make SA Policy Space a reference tool used by researchers, journalists, civil society, and government.*

#### 3.1 Policy Brief Generator
**Effort:** 3–5 days | **Impact:** High (direct policy utility)

For any idea or reform package, generate a structured 2-page PDF policy brief:
- **For policymakers**: problem statement, proposed intervention, evidence base, implementation pathway, cost, precedents
- **For civil society**: plain-language summary, accountability checklist, who to pressure
- **For researchers**: formal structure with citations, data sources, methodological notes

Use the Claude API to draft these from structured data, with a human review step. Export as PDF using a simple HTML-to-PDF pipeline (Playwright or wkhtmltopdf). Surface a "Generate Brief" button on each idea and package page.

#### 3.2 Textbook Integration
**Effort:** 2–3 days | **Impact:** Medium-High (academic/teaching purpose)

Create a cross-reference system between chapters in _The South African Economy_ textbook and policy ideas in this database. Each textbook chapter should link to 3–8 relevant ideas. Each idea should reference the textbook chapter most relevant to its binding constraint.

Practically: add a `textbook_chapter` field to `policy_ideas`. Build a `/teaching` page that presents ideas organised by textbook chapter, suitable for seminar use. This creates a virtuous cycle: students reading the textbook encounter real policy debates; policymakers using the tool can trace ideas to their academic foundations.

#### 3.3 Public API with Documentation
**Effort:** 2–3 days | **Impact:** Medium (researcher access)

The API routes already exist. Make them public and document them:
- Stable versioned endpoints: `/api/v1/ideas`, `/api/v1/packages`, etc.
- Add OpenAPI/Swagger spec
- Rate limiting (Vercel edge functions or Supabase RLS)
- Return metadata: last_updated, source, methodology_version
- Simple API key for bulk access

Publish documentation on the about page. This enables researchers to cite and use the data programmatically and signals that the project is a proper research infrastructure.

#### 3.4 BRRR Budget Alignment Analysis
**Effort:** 3–5 days | **Impact:** High (accountability + political economy)

Cross-reference reform ideas with Budget Review and Recommendations Reports (BRRR) data:
- Which ideas have received explicit budget allocations?
- Which committees' recommendations have been funded vs. ignored?
- How does the gap between recommended and allocated spending map onto reform stalls?

This creates a "policy promise vs. delivery" accountability layer that civil society organisations, journalists, and opposition parties would find highly valuable. Surface as a dashboard: "Reform ideas with budget backing vs. unfunded."

#### 3.5 Reform Progress Index
**Effort:** 3–4 days | **Impact:** High (flagship accountability metric)

A single synthetic index — computed quarterly — measuring SA's reform momentum:
- Weighted sum of momentum scores across all ideas
- Adjusted for package importance
- Benchmarked against a "reform frontier" (what implementation speed would look like if all quick wins were implemented)
- Displayed as a chart with quarterly observations since data collection began

This is the kind of indicator that gets cited in media and policy circles. It gives the project a "news hook" — every quarter, "SA's reform momentum index fell/rose by X."

#### 3.6 Civil Society Accountability Dashboard
**Effort:** 4–6 days | **Impact:** High (audience expansion)

A simplified view of the data for non-expert users:
- "Government promised X in committee. Here's what happened."
- Traffic light status for each reform package (red/amber/green)
- Plain-language summaries of each idea
- "Hold them accountable" feature: link to relevant minister's contact/social media
- Share cards for social media

This shifts the audience from policy specialists to engaged citizens and civil society organisations — a significant expansion of the project's reach.

#### 3.7 Interactive International Comparisons
**Effort:** 3–4 days | **Impact:** Medium

For each binding constraint, a comparison panel showing:
- Which peer economies (Kenya, Botswana, India, Chile, Mauritius, Rwanda) have addressed this constraint
- What approach they used
- What outcome resulted (growth impact, time to implement)
- What SA could learn/adapt

This is currently mentioned in methodology but has no data behind it. Structured comparative data (even a curated 2–3 examples per constraint) substantially increases the tool's credibility and usefulness for advocacy.

---

## 4. Strategic Observations

### The Content Problem Dominates

No frontend feature, analytical model, or deployment improvement matters as much as fixing the content quality. A researcher encountering 123 one-sentence idea stubs will not return. The investment of 10–15 focused hours writing substantive descriptions for the top 30 ideas — with evidence, context, and honest assessment of barriers — will do more for the project's credibility than any technical improvement.

The implementation plans are the most visible gap: the about page explicitly promises them, the UI renders them, and they're empty. This is a broken promise to the first visitor who clicks through to a high-priority idea.

### The Dependency Graph Is the Core Asset

The 130-node, 400-edge dependency graph is the project's genuinely unique intellectual contribution. No comparable map of SA reform interdependencies exists in published form. Making it interactive (Phase 2.1) and analytically mined (Phase 2.2) is the single highest-leverage technical investment, because it converts a visual into an analytical tool.

### Deployment Is Blocking Everything Else

A policy tool that nobody can visit serves no policy purpose. The Supabase/Vercel path is already designed. This should happen before any other technical work.

### Political Economy Is Missing

The project correctly identifies binding constraints and reform sequencing. But it doesn't engage with the political economy of why reforms stall — who the vested interests are, which bureaucratic or coalition dynamics block which ideas. Adding stakeholder mapping (Phase 2.5) and BRRR alignment (Phase 3.4) would address this. An economist working on SA development knows that the constraint is rarely technical knowledge; it's almost always political economy. The tool should reflect this.

### Teaching Use Is an Underexploited Opportunity

The NYU Wagner connection and textbook project create a natural teaching deployment path. Graduate students using this tool for policy analysis seminars generate engagement, feedback, and citations. The textbook integration (Phase 3.2) is low-effort relative to its long-term value for the project's academic standing.

---

## 5. Effort/Impact Matrix Summary

| Item | Phase | Effort | Impact |
|------|-------|--------|--------|
| Deploy Vercel + Supabase | 1 | Low | Critical |
| Write top 30 idea descriptions | 1 | Medium | Critical |
| Write 10 implementation plans | 1 | Medium | High |
| Committee + sort filters | 1 | Very Low | Medium |
| Slug-based URLs | 1 | Low | Medium |
| Interactive D3 dependency graph | 2 | High | High |
| Bottleneck/centrality analysis | 2 | Low | High |
| Reform momentum score | 2 | Low | High |
| Fiscal impact estimates | 2 | Medium | High |
| Stakeholder mapping | 2 | Medium | High |
| Committee coverage expansion | 2 | Medium | Medium-High |
| Parliamentary timeline view | 2 | Medium | Medium |
| Automated PMG refresh pipeline | 2 | Medium | Medium |
| International Comparisons Database | 2 | Medium | Medium-High |
| Policy brief generator | 3 | Medium | High |
| Textbook integration | 3 | Low | Medium-High |
| Public API + documentation | 3 | Low | Medium |
| BRRR budget alignment | 3 | Medium | High |
| Reform Progress Index | 3 | Medium | High |
| Civil society dashboard | 3 | High | High |
| International comparisons | 3 | Medium | Medium |

---

*This roadmap should be revisited quarterly. The highest-priority items — deployment and content quality — are not technical challenges; they are time allocation decisions.*
