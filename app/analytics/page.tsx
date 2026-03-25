export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Network centrality analysis, momentum scores, and fiscal impact estimates across SA's 49 policy reform ideas.",
};
import type { IdeaRow } from "@/lib/local-api";
import {
  computeNetworkCentrality,
  computeMomentumScores,
  type NodeCentrality,
  type MomentumScore,
} from "@/lib/analytics";
import dependencyGraphData from "@/data/dependency_graph.json";
import fiscalEstimatesRaw from "@/data/fiscal_estimates.json";

// ── Types ─────────────────────────────────────────────────────────────────

interface FiscalEstimate {
  package_id: number;
  package_name: string;
  public_investment_zar_bn: number;
  private_investment_catalyzed_zar_bn: number;
  total_capital_mobilised_zar_bn: number;
  investment_timeframe_years: number;
  gdp_impact_low_pct: number;
  gdp_impact_high_pct: number;
  gdp_impact_reference_year: number;
  employment_total: number;
  annual_revenue_uplift_zar_bn: number;
  break_even_years: number;
  cost_per_job_zar_thousands: number;
  revenue_note: string;
  key_assumptions: string[];
  primary_sources: string[];
}

// ── Data fetching ──────────────────────────────────────────────────────────

async function getAnalyticsData() {
  const isLocal = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let ideas: IdeaRow[];
  if (isLocal) {
    const { getIdeas } = await import("@/lib/local-api");
    ideas = getIdeas();
  } else {
    const { getIdeas } = await import("@/lib/supabase-api");
    ideas = (await getIdeas()) as IdeaRow[];
  }

  const centralityRankings = computeNetworkCentrality(dependencyGraphData as any);
  const momentumScores = computeMomentumScores(ideas);
  const fiscalEstimates = Object.values(fiscalEstimatesRaw) as FiscalEstimate[];

  return { centralityRankings, momentumScores, fiscalEstimates };
}

// ── Style constants ────────────────────────────────────────────────────────

const PACKAGE_STYLES: Record<number, { border: string; badge: string; dot: string; bg: string; text: string }> = {
  1: { border: "border-amber-300",  badge: "bg-amber-100 text-amber-800",  dot: "bg-amber-400",  bg: "bg-amber-50",  text: "text-amber-900"  },
  2: { border: "border-blue-300",   badge: "bg-blue-100 text-blue-800",    dot: "bg-blue-400",   bg: "bg-blue-50",   text: "text-blue-900"   },
  3: { border: "border-purple-300", badge: "bg-purple-100 text-purple-800",dot: "bg-purple-400", bg: "bg-purple-50", text: "text-purple-900" },
  4: { border: "border-teal-300",   badge: "bg-teal-100 text-teal-800",    dot: "bg-teal-400",   bg: "bg-teal-50",   text: "text-teal-900"   },
  5: { border: "border-slate-300",  badge: "bg-slate-100 text-slate-700",  dot: "bg-slate-400",  bg: "bg-slate-50",  text: "text-slate-900"  },
};

const STATUS_COLORS: Record<string, string> = {
  proposed:     "bg-blue-50 text-blue-700 ring-blue-600/20",
  debated:      "bg-yellow-50 text-yellow-700 ring-yellow-600/20",
  drafted:      "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  stalled:      "bg-red-50 text-red-700 ring-red-600/20",
  implemented:  "bg-green-50 text-green-700 ring-green-600/20",
  under_review: "bg-orange-50 text-orange-700 ring-orange-600/20",
  abandoned:    "bg-gray-50 text-gray-600 ring-gray-500/20",
};

const PACKAGE_NAMES: Record<number, string> = {
  1: "Infrastructure Unblock",
  2: "SMME & Employment",
  3: "Human Capital",
  4: "Trade & Industrial",
  5: "State Capacity",
};

// ── Helper components ──────────────────────────────────────────────────────

function ScoreBar({ value, max = 100, color = "bg-sa-green" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-8 text-right tabular-nums">{value}</span>
    </div>
  );
}

function PackageBadge({ pkgId }: { pkgId: number | null }) {
  if (!pkgId) return <span className="text-xs text-gray-400">—</span>;
  const s = PACKAGE_STYLES[pkgId] ?? PACKAGE_STYLES[1];
  return (
    <span className={`badge ring-1 ring-inset ${s.badge} text-xs`}>
      {PACKAGE_NAMES[pkgId] ?? `Pkg ${pkgId}`}
    </span>
  );
}

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

// ── Keystone Reforms Table ─────────────────────────────────────────────────

function KeystoneTable({ rankings }: { rankings: NodeCentrality[] }) {
  const top = rankings.slice(0, 15);
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-3 py-2.5 text-gray-500 font-medium w-8">#</th>
            <th className="text-left px-3 py-2.5 text-gray-500 font-medium">Reform</th>
            <th className="text-left px-3 py-2.5 text-gray-500 font-medium hidden md:table-cell">Package</th>
            <th className="text-left px-3 py-2.5 text-gray-500 font-medium w-36">Keystone Score</th>
            <th className="text-center px-3 py-2.5 text-gray-500 font-medium hidden sm:table-cell w-20">In ↑</th>
            <th className="text-center px-3 py-2.5 text-gray-500 font-medium hidden sm:table-cell w-20">Out ↓</th>
            <th className="text-left px-3 py-2.5 text-gray-500 font-medium hidden lg:table-cell">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {top.map((node, i) => {
            const statusColor = STATUS_COLORS[node.current_status ?? ""] ?? STATUS_COLORS.proposed;
            return (
              <tr key={node.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-3 py-2.5 text-gray-400 text-xs tabular-nums">{i + 1}</td>
                <td className="px-3 py-2.5">
                  <Link
                    href={`/ideas/${node.id}`}
                    className="font-medium text-gray-900 hover:text-sa-green leading-snug line-clamp-2 text-sm"
                  >
                    {node.title}
                  </Link>
                  {node.source_committee && (
                    <p className="text-xs text-gray-400 mt-0.5">{node.source_committee}</p>
                  )}
                </td>
                <td className="px-3 py-2.5 hidden md:table-cell">
                  <PackageBadge pkgId={node.reform_package} />
                </td>
                <td className="px-3 py-2.5 w-36">
                  <ScoreBar value={node.keystoneScore} />
                </td>
                <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                    {node.in_degree}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                    {node.out_degree}
                  </span>
                </td>
                <td className="px-3 py-2.5 hidden lg:table-cell">
                  {node.current_status && (
                    <span className={`badge ring-1 ${statusColor} capitalize text-xs`}>
                      {node.current_status.replace(/_/g, " ")}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Momentum List ──────────────────────────────────────────────────────────

function MomentumList({ scores }: { scores: MomentumScore[] }) {
  const top = scores.slice(0, 15);
  return (
    <div className="space-y-2">
      {top.map((item, i) => {
        const statusColor = STATUS_COLORS[item.current_status] ?? STATUS_COLORS.proposed;
        const pkgStyle = item.reform_package ? PACKAGE_STYLES[item.reform_package] : null;
        return (
          <div
            key={item.id}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <span className="text-sm text-gray-300 font-medium w-5 flex-shrink-0 tabular-nums">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <Link
                  href={`/ideas/${item.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-sa-green leading-snug"
                >
                  {item.title}
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`badge ring-1 ${statusColor} text-xs capitalize`}>
                  {item.current_status.replace(/_/g, " ")}
                </span>
                {pkgStyle && (
                  <span className={`badge ring-1 ring-inset ${pkgStyle.badge} text-xs`}>
                    {PACKAGE_NAMES[item.reform_package!]}
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  Raised {item.times_raised}×
                </span>
                {item.months_since_discussed !== null && (
                  <span className="text-xs text-gray-400">
                    · last {item.months_since_discussed}mo ago
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 w-28">
              <ScoreBar value={item.momentum_score} color="bg-indigo-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Fiscal Cards ───────────────────────────────────────────────────────────

function FiscalCard({ est }: { est: FiscalEstimate }) {
  const s = PACKAGE_STYLES[est.package_id] ?? PACKAGE_STYLES[1];
  const hasPrivate = est.private_investment_catalyzed_zar_bn > 0;
  return (
    <div className={`rounded-xl border-t-4 ${s.border} bg-white border border-gray-100 p-5 space-y-4`}>
      {/* Header */}
      <div className="flex items-start gap-2">
        <span
          className={`flex-shrink-0 w-7 h-7 rounded-full ${s.dot} flex items-center justify-center text-white text-xs font-bold`}
        >
          {est.package_id}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{est.package_name}</h3>
          <p className="text-xs text-gray-400">
            {est.investment_timeframe_years}-year programme
          </p>
        </div>
      </div>

      {/* Cost */}
      <div className={`rounded-lg ${s.bg} px-4 py-3`}>
        <p className="text-xs text-gray-500 mb-1">Public investment required</p>
        <p className={`text-2xl font-bold ${s.text}`}>
          R{est.public_investment_zar_bn}bn
        </p>
        {hasPrivate && (
          <p className="text-xs text-gray-500 mt-0.5">
            + R{est.private_investment_catalyzed_zar_bn}bn private capital catalysed
          </p>
        )}
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCell
          label="GDP impact"
          value={`+${est.gdp_impact_low_pct}–${est.gdp_impact_high_pct}% by ${est.gdp_impact_reference_year}`}
        />
        <StatCell
          label="Jobs created"
          value={`~${(est.employment_total / 1000).toFixed(0)}k`}
        />
        <StatCell
          label="Annual revenue uplift"
          value={`R${est.annual_revenue_uplift_zar_bn}bn/yr`}
        />
        <StatCell
          label="Fiscal break-even"
          value={`~${est.break_even_years} yrs`}
        />
      </div>

      {/* Link to package */}
      <Link
        href={`/packages/${est.package_id}`}
        className="text-xs text-sa-green hover:underline inline-flex items-center gap-1"
      >
        View reform package →
      </Link>
    </div>
  );
}

// ── Aggregate totals ───────────────────────────────────────────────────────

function FiscalAggregate({ estimates }: { estimates: FiscalEstimate[] }) {
  const totalPublic = estimates.reduce((s, e) => s + e.public_investment_zar_bn, 0);
  const totalPrivate = estimates.reduce((s, e) => s + e.private_investment_catalyzed_zar_bn, 0);
  const totalJobs = estimates.reduce((s, e) => s + e.employment_total, 0);
  const totalRevenue = estimates.reduce((s, e) => s + e.annual_revenue_uplift_zar_bn, 0);

  return (
    <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Aggregate (all 5 packages)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Total public investment</p>
          <p className="text-xl font-bold text-gray-900">R{totalPublic}bn</p>
          <p className="text-xs text-gray-400">over programme periods</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Private capital catalysed</p>
          <p className="text-xl font-bold text-gray-900">R{totalPrivate}bn</p>
          <p className="text-xs text-gray-400">via blended finance & incentives</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Total jobs created</p>
          <p className="text-xl font-bold text-gray-900">~{(totalJobs / 1000).toFixed(0)}k</p>
          <p className="text-xs text-gray-400">direct + indirect</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Combined revenue uplift</p>
          <p className="text-xl font-bold text-gray-900">R{totalRevenue}bn/yr</p>
          <p className="text-xs text-gray-400">when fully implemented</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-400 leading-relaxed">
        Estimates are additive but not independent — packages interact and some benefits overlap.
        Sequencing matters: the Infrastructure Unblock package (Pkg 1) is the growth anchor that
        amplifies returns in all others. Sources and methodology in individual package estimates.
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function AnalyticsPage() {
  const { centralityRankings, momentumScores, fiscalEstimates } =
    await getAnalyticsData();

  return (
    <div className="space-y-12">

      {/* Header */}
      <section>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Policy Analytics</h1>
        <p className="text-gray-500 max-w-2xl">
          Network analysis of reform dependencies, parliamentary momentum indicators, and fiscal impact estimates
          across South Africa&apos;s five reform packages.
        </p>
      </section>

      {/* ── Section 1: Keystone Reforms ──────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Keystone Reforms</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Reforms ranked by network centrality in the dependency graph — combining{" "}
            <span className="font-medium text-gray-700">betweenness centrality</span> (how often a
            reform lies on the shortest path between others) and{" "}
            <span className="font-medium text-gray-700">PageRank</span> (how many high-value
            reforms depend on it). High scores identify &ldquo;keystone&rdquo; reforms where
            progress creates the most downstream unlocking.
          </p>
        </div>

        {/* Methodology note */}
        <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500 bg-gray-50 rounded-lg px-4 py-3 border border-gray-100">
          <span>
            <span className="font-medium text-gray-700">In ↑</span> — number of reforms that depend on this one
          </span>
          <span>
            <span className="font-medium text-gray-700">Out ↓</span> — number of reforms this one enables
          </span>
          <span>
            <span className="font-medium text-gray-700">Score</span> — composite 0–100 (betweenness 50% + PageRank 50%)
          </span>
          <span>{centralityRankings.length} reforms in dependency graph · {centralityRankings.filter(n => n.keystoneScore > 0).length} with non-zero centrality</span>
        </div>

        <KeystoneTable rankings={centralityRankings} />
      </section>

      {/* ── Section 2: Reform Momentum ───────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Reform Momentum</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Reforms ranked by parliamentary salience — a composite of how frequently each idea has been
            raised in committee hearings (<span className="font-medium text-gray-700">times raised</span>),
            how recently it was discussed (<span className="font-medium text-gray-700">recency weighting</span>),
            and its current parliamentary status.
            High scores signal political readiness for advancement.
          </p>
        </div>

        <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
          <span>Score 0–100</span>
          <span className="text-gray-300">·</span>
          <span>Recency decays exponentially at 8% per month</span>
          <span className="text-gray-300">·</span>
          <span>{momentumScores.length} reforms scored</span>
        </div>

        <MomentumList scores={momentumScores} />
      </section>

      {/* ── Section 3: Fiscal Overview ───────────────────────────────────── */}
      <section>
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900">Fiscal Impact Overview</h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Estimated public investment requirements, GDP impact, employment creation, and fiscal returns
            for each reform package. Estimates draw on National Treasury, World Bank, IMF, and sector-specific
            studies; ranges reflect genuine uncertainty. All figures in nominal South African rand.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {fiscalEstimates.map((est) => (
            <FiscalCard key={est.package_id} est={est} />
          ))}
        </div>

        <FiscalAggregate estimates={fiscalEstimates} />

        <p className="mt-4 text-xs text-gray-400">
          These are scenario estimates, not official government projections. Cost and impact figures assume
          full implementation of all reforms in each package. Break-even calculations use a social discount
          rate of 8%. Employment figures include direct and first-order indirect effects only.
        </p>
      </section>

    </div>
  );
}
