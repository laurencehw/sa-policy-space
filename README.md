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
- **Analytics dashboard** — keystone reform scoring (PageRank + betweenness centrality), parliamentary momentum tracking
- **International comparisons** — peer country reform outcomes mapped to SA ideas
- **Stakeholder mapping** — 38 actors with influence scores and stance analysis
- **Policy brief generator** — AI-generated briefs tailored to policymakers, researchers, or civil society
- **Budget alignment analysis** — reform costs vs. current budget allocations
- **Teaching materials** — case studies and exercises for economics courses
- **Public API** — JSON endpoints for researchers (`/api/v1/`)

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Database (local) | SQLite via Node.js `node:sqlite` |
| Database (prod) | Supabase (PostgreSQL) |
| AI | Anthropic Claude API (brief generator) |
| Deployment | Vercel |
| CI | GitHub Actions (build + test + data validation) |

## Getting started

### Prerequisites

- **Node.js >= 22** (required for `node:sqlite` built-in)
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
app/                   → Next.js pages and API routes (30 pages, 14 API routes)
components/            → Shared React components
lib/
  local-api.ts         → SQLite data access layer
  supabase-api.ts      → Supabase data access layer
  supabase.ts          → Types, UI constants, Supabase client
  analytics.ts         → Keystone scoring, momentum calculations
  sequencing.ts        → Reform dependency analysis
data/
  migrations/          → Numbered SQL migrations (applied sequentially)
  archive/             → One-off SQL scripts already applied (reference only)
  *.json               → Derived data files (reform packages, fiscal estimates, etc.)
scripts/               → Python data collection, enrichment, and validation
__tests__/             → Jest test suite
schema.sql             → Full PostgreSQL schema
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

All parliamentary data is sourced from the [PMG API](https://api.pmg.org.za). Policy ideas, reform packages, dependency relationships, and assessments are original research.

## Author

[Laurence Wilse-Samson](https://github.com/laurencehw) — NYU Wagner School of Public Policy
