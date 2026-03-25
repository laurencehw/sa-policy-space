# SA Policy Space

A research database of 132 South African policy reform ideas extracted from parliamentary committee proceedings, organised around binding economic growth constraints.

**Live site:** [sa-policy-space.vercel.app](https://sa-policy-space.vercel.app)

## What this is

South Africa's economy has grown at under 2% per year for more than a decade — not for want of policy ideas, but because of chronic implementation failure. This project surfaces, organises, and analyses reform proposals from 1,061 parliamentary committee meetings sourced via the [Parliamentary Monitoring Group](https://pmg.org.za) (PMG) API.

Ideas are grouped into **5 reform packages** and classified by **18 binding constraint types** following the Hausmann-Rodrik-Velasco growth diagnostics framework. A dependency graph (~400 edges) captures sequencing logic between reforms.

**Policy ideas are original synthesis, not PMG verbatim text.** Meeting records link back to PMG as the authoritative source.

## Features

- **132 policy ideas** with descriptions, feasibility ratings, growth impact scores, and fiscal estimates
- **5 reform packages** with theories of change, implementation plans, and dependency diagrams
- **Economic indicators** — 16 SA time-series (GDP, unemployment, load shedding, Gini, etc.) mapped to binding constraints
- **Analytics dashboard** — keystone reform scoring (PageRank + betweenness centrality), parliamentary momentum tracking
- **Interactive dependency graph** — D3 force-directed network with filtering, search, and SVG export
- **International comparisons** — 59 peer country reform outcomes mapped to SA ideas
- **Stakeholder mapping** — 38 actors with influence scores, plus idea-level political stance analysis
- **Policy brief generator** — AI-generated briefs tailored to policymakers, researchers, or civil society
- **Budget alignment analysis** — reform costs vs. current MTBPS allocations
- **Timeline with indicator overlays** — parliamentary activity overlaid with economic data
- **Reform progress index** — synthetic 0–100 score tracking implementation across packages
- **Legislation generator** — template Green Papers, White Papers, and Bills
- **Teaching materials** — case studies, exercises, and links to the companion textbook
- **Public API** — versioned JSON endpoints for researchers (`/api/v1/`)

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database (local) | SQLite via Node.js `node:sqlite` |
| Database (prod) | Supabase (PostgreSQL) |
| Charts | Recharts |
| Graph | D3.js (force-directed dependency network) |
| AI | Anthropic Claude API (brief generator) |
| Deployment | Vercel (ISR caching) |
| CI | GitHub Actions (build + test + data validation) |

## Getting started

### Prerequisites

- **Node.js >= 22.5** (required for `node:sqlite` built-in)
- Python 3.11+ (for data scripts and validation)

### Setup

```bash
git clone https://github.com/laurencehw/sa-policy-space.git
cd sa-policy-space
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your values (see .env.example for docs)

# Initialise the local SQLite database
npm run db:init

# Start development server
npm run dev
```

The app runs at `http://localhost:3000`. Without Supabase env vars, it falls back to the local SQLite database automatically.

### Environment variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | For prod | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For prod | Supabase anonymous key |
| `ANTHROPIC_API_KEY` | For briefs | Powers the AI brief generator |
| `SQLITE_DB_PATH` | For local dev | Path to SQLite database file |

## Project structure

```
app/                   → Next.js pages and API routes (31 pages, 14 API routes)
components/            → Shared React components (DependencyGraph, SearchModal, etc.)
lib/
  api.ts               → Unified data dispatcher (resolves to local or Supabase)
  local-api.ts          → SQLite data access layer
  supabase-api.ts       → Supabase data access layer
  supabase.ts           → Types, UI constants, Supabase client
  analytics.ts          → Keystone scoring, momentum calculations
  reform-index.ts       → Reform progress index computation
  sequencing.ts         → Reform dependency analysis
data/
  migrations/           → Numbered SQL migrations (001–016)
  archive/              → One-off SQL scripts already applied (reference only)
  indicators_*.json     → Economic indicator time-series (16 indicators)
  *.json                → Derived data (reform packages, fiscal estimates, stakeholders, etc.)
  CHANGELOG.md          → Dataset version history
scripts/                → Python data collection, enrichment, and validation
docs/                   → ROADMAP.md, PROJECT_AUDIT.md
__tests__/              → Jest test suite (API routes, data validation, utilities)
schema.sql              → Full PostgreSQL schema
```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm test` | Run Jest test suite |
| `npm run validate` | Validate JSON data files |
| `npm run db:init` | Initialise local SQLite database |
| `npm run db:migrate` | Sync migrations to Supabase |
| `npm run lint` | Run ESLint |

## Data sources

All parliamentary data is sourced from the [PMG API](https://api.pmg.org.za). Economic indicators come from Stats SA, SARB, IMF, and World Bank. Policy ideas, reform packages, dependency relationships, and assessments are original research. See [`data/CHANGELOG.md`](data/CHANGELOG.md) for dataset version history.

## Companion textbook

This project is paired with [The South African Economy: A Contemporary Analysis](https://laurence-wilse-samson.gitbook.io/textbooks/the-south-african-economy), an open textbook covering the same themes in depth. Chapter references appear on constraint and idea pages.

## How to cite

```
Wilse-Samson, L. (2026). SA Policy Space: A Database of South African Reform Ideas.
NYU Wagner School of Public Policy. https://sa-policy-space.vercel.app
```

## License

[MIT](LICENSE)

## Author

[Laurence Wilse-Samson](https://github.com/laurencehw) — NYU Wagner School of Public Policy
