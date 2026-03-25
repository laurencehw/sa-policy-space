# SA Policy Space — Code Audit

*Audited: 2026-03-23*

---

## Summary

21 page routes, 13 API routes. Clean codebase — no TODO/FIXME comments, no secrets in the repo, no extraneous files. The brief generator is fully functional. Primary risks are missing error boundaries, the Node.js v24 requirement, and Supabase being wired but not actually connected.

---

## 1. Pages (21 total)

| Page | Route | Error Handling |
|------|-------|---------------|
| Home dashboard | `/` | Yes — try/catch for graph + budget JSON reads |
| Ideas list | `/ideas` | Minimal — `.catch(() => setLoading(false))` only |
| Idea detail | `/ideas/[id]` | Partial — JSON.parse try/catch; no notFound() guard |
| Packages grid | `/packages` | None detected |
| Package detail | `/packages/[id]` | Yes — `notFound()` for invalid ID and missing package |
| Briefs generator | `/briefs` | Yes — full try/catch with user-visible error state |
| Timeline | `/timeline` | Minimal — `.catch(() => setLoading(false))` only |
| Teaching | `/teaching` | Minimal — `.catch(() => setLoading(false))` only |
| About | `/about` | None detected (likely static) |
| Accountability | `/accountability` | None detected |
| Analytics | `/analytics` | None detected |
| API Docs | `/api-docs` | None detected (likely static) |
| BRRR | `/brrr` | None detected |
| Budget | `/budget` | None detected |
| Comparisons | `/comparisons` | None detected |
| Dependencies | `/dependencies` | None detected |
| Reform Index | `/reform-index` | None detected |
| Sequencing | `/sequencing` | None detected |
| Simulator | `/simulator` | None detected |
| Stakeholders | `/stakeholders` | None detected |
| Themes | `/themes` | None detected |

**No `error.tsx` files anywhere in `/app`.** Next.js error boundaries are entirely absent — uncaught errors will show the default Next.js error page rather than a graceful fallback.

Pages with `.catch(() => setLoading(false))` (timeline, teaching, ideas) swallow errors silently — the user sees a blank/loading state with no explanation.

---

## 2. API Routes (13 total)

| Route | Notes |
|-------|-------|
| `GET /api/ideas` | Core data route |
| `GET /api/ideas/[id]` | Idea detail |
| `GET /api/packages` | Packages list |
| `GET /api/packages/[id]` | Package detail |
| `GET /api/stats` | Summary stats |
| `GET /api/themes` | Themes/constraints |
| `GET /api/search` | Full-text search |
| `GET /api/dependency-graph` | Graph JSON |
| `GET /api/timeline` | Timeline data |
| `POST /api/generate-brief` | Brief generator (see §3) |
| `GET /api/v1/ideas` | Versioned public endpoint |
| `GET /api/v1/packages` | Versioned public endpoint |
| `GET /api/v1/stats` | Versioned public endpoint |

---

## 3. Brief Generator (`/api/generate-brief`)

**Status: Fully functional.**

- Uses `@anthropic-ai/sdk` with streaming via `ReadableStream`
- Model: `claude-opus-4-6` with `thinking: { type: "adaptive" }`
- Three audience modes: `policymaker`, `civil_society`, `researcher` — each with distinct tone, sections, and word targets (700 / 450 / 1100 words)
- Validates `ANTHROPIC_API_KEY` presence before executing; returns 500 if missing
- Gracefully degrades on DB fetch failure (proceeds with empty context rather than erroring out)
- Handles both package briefs (`pkg_` prefix) and idea briefs
- Already wired to Supabase vs. local-API fallback pattern

Not stubbed. The only blocker is `ANTHROPIC_API_KEY` not being set in the environment.

---

## 4. TODO / FIXME Comments

**None found** across all `.ts` and `.tsx` files.

---

## 5. Secrets & Environment Variables

**Clean — no secrets in the repo.**

- `.env`, `.env.local`, `.env.*.local` are all in `.gitignore`
- `git ls-files` confirms no env files are tracked
- No hardcoded API keys or passwords found in any source file
- All secrets accessed via `process.env.*` at runtime:
  - `ANTHROPIC_API_KEY` — required for brief generation
  - `NEXT_PUBLIC_SUPABASE_URL` — optional; controls Supabase vs. SQLite path
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — implied by Supabase usage

---

## 6. Page & Feature Count

| Category | Count |
|----------|-------|
| Page routes | 21 |
| API routes | 13 |
| Versioned API routes (`/v1/`) | 3 |
| Pages with adequate error handling | 3 (home, package detail, briefs) |
| Pages with minimal error handling | 3 (ideas list, timeline, teaching) |
| Pages with no error handling | 15 |
| `error.tsx` files | 0 |

---

## 7. Obvious Issues

**High priority:**

1. **No error boundaries.** No `error.tsx` in any route segment. Unexpected errors (DB unavailable, malformed JSON) show Next.js default crash pages. Add at minimum `app/error.tsx` as a global fallback.

2. **Node.js v24 required.** The `node:sqlite` built-in module (used in `lib/local-api.ts`) requires Node ≥ 24. Vercel's default runtime is Node 18/20. This will cause silent failures on deploy unless the Node version is pinned in `package.json` (`"engines": { "node": ">=24" }`) and Vercel project settings. Alternatively, swap to `better-sqlite3`.

3. **Supabase not connected.** `NEXT_PUBLIC_SUPABASE_URL` is checked everywhere but never set. The app runs entirely on SQLite locally. No production data path has been tested. Every API route silently falls back to local DB — correct in dev, broken in any hosted environment without the env var.

**Medium priority:**

4. **Silent error swallowing.** `ideas/page.tsx`, `timeline/page.tsx`, and `teaching/page.tsx` all use `.catch(() => setLoading(false))` — errors are consumed and the user sees a blank/loading state. Should surface a user-visible error message.

5. **`ideas/[id]/page.tsx` missing `notFound()`.** If an idea ID doesn't exist in the DB, the page likely renders with null/undefined data rather than redirecting to 404. Compare to `packages/[id]` which properly calls `notFound()`.

6. **No tests.** Zero test files in the repo. Data quality and API correctness are entirely manual. Given the project's credibility depends on data accuracy, at minimum the API routes should have smoke tests.

**Low priority:**

7. **No `loading.tsx` files.** Server components that do DB calls (home page, package detail) have no loading skeleton — Next.js will show nothing until data resolves.

8. **`package-lock.json` is tracked** but `node_modules/` is not (correct). Fine.

9. **Three versioned `/v1/` routes exist** but the other 10 routes are unversioned — mixed API versioning strategy. Low risk for now.

---

*Audit scope: static analysis only — no runtime testing performed.*
