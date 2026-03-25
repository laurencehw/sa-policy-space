# Data Changelog

Version history for the SA Policy Space dataset. This tracks changes to the
policy ideas, stakeholder mappings, fiscal estimates, and other research data —
not code changes (see git history for those).

## March 2026

### 2026-03-25 (data quality fixes)
- **Constraint normalization**: Merged duplicate constraint values (corruption→
  corruption_governance, digital→digital_infrastructure, land/land_reform→land_housing,
  regulation→regulatory_burden). Now exactly 18 distinct constraints.
- **Comparison mapping fix**: Reassigned 11 mismatched international comparisons
  where case study topics didn't match linked policy ideas (e.g., Colombia homicide
  reduction was linked to Fiscal Consolidation instead of Community Policing).
- **Idea enrichment**: All 39 new ideas expanded to 500-700 char descriptions
  with specific March 2026 data points and institutional references.
- **Mobile responsiveness**: Fixed search overflow, stats grid, graph panel,
  touch targets, table scroll on narrow screens.
- **Component tests**: 7 new React component smoke tests (total: 90 tests).

### 2026-03-25 (continued)
- **5 new committees scraped**: Employment & Labour (751 meetings), Police (933),
  Justice (1,563), Water & Sanitation (706), Environment (382). Total: 4,335 new
  meetings from the PMG API.
- **39 new policy ideas** (IDs 140-178) extracted from the new committees:
  labour_market (10), crime_safety (11), water (8), climate_environment (7),
  corruption_governance (2), government_capacity (1).
- **Trade openness**: 6 existing Trade committee ideas re-tagged from
  regulatory_burden to trade_openness (migration 017).
- **Stakeholder stances**: 202 new stances added for new ideas (total: 458).
- **Dependency graph**: 39 new nodes + 13 cross-constraint edges added.
- **Reform packages**: New idea IDs added to all 5 packages.
- Total ideas: 132 → 177. All constraint categories now populated.

### 2026-03-25
- **Economic indicators**: Added 16 time-series indicators from Stats SA, SARB,
  IMF, and World Bank. Includes GDP growth, unemployment, Eskom EAF, load
  shedding, Gini coefficient, debt/GDP, and more. Updated to 2025 where
  available (IMF WEO April 2025 estimates).
- **Stakeholder stances**: Added 256 AI-drafted idea-level stakeholder stances
  across 11 key actors and 94 policy ideas. All marked `is_human_reviewed: false`.
- **Textbook integration**: Added chapter abstracts, key findings, and GitBook
  URLs for all 15 textbook chapters.
- **Constraint taxonomy**: Expanded from 10 to 26 binding constraint types to
  match the full database vocabulary.

### 2026-03-23
- **Deployment**: Live on Vercel at sa-policy-space.vercel.app
- **OECD references**: Added OECD Economic Survey cross-references to policy ideas
- **Feasibility ratings**: Migration 013 added feasibility ratings across ideas
- **Implementation plans**: Migrations 012a-012h populated implementation plans
  for high-priority ideas across all 5 reform packages

### 2026-03-22 (Initial dataset)
- 132 policy ideas from 1,061 PMG committee meetings (Nov 2021 – Feb 2024)
- 5 reform packages with theories of change
- ~400 dependency graph edges
- 38 stakeholders mapped
- 59 international comparisons
- Budget alignment data (2024/25 MTBPS)
- Fiscal estimates per reform package

## Data Sources

| Source | Coverage | Update Frequency |
|--------|----------|-----------------|
| PMG (Parliamentary Monitoring Group) | Committee proceedings | Manual collection |
| Stats SA | GDP, CPI, employment, poverty | As published |
| SARB (Reserve Bank) | Monetary policy, external accounts | As published |
| IMF World Economic Outlook | GDP forecasts, debt projections | Biannual (Apr/Oct) |
| World Bank WDI | Comparative indicators | Annual |
| National Treasury | Budget, MTBPS, fiscal data | Annual |
| Eskom | EAF, load shedding | Annual reports |
| Transnet | Freight volumes | Annual reports |
