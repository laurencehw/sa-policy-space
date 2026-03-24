export const revalidate = false; // Pure static JSON — build-time only

import brrrData from "@/data/brrr_recommendations.json";
import budgetData from "@/data/budget_alignment.json";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────────────────────────

interface BrrrRecommendation {
  id: string;
  title: string;
  committee: string;
  year_range: string;
  category: string;
  is_quick_win: boolean;
  fiscal_tier: string;
  fiscal_cost: string;
  priority_score: number;
  impact_score: number;
  feasibility_score: number;
  mtbps_alignment: string[];
  policy_space_idea_ids: number[];
  description: string;
  rationale: string;
}

interface BrrrPackage {
  package_id: number;
  package_name: string;
  brrr_committees: string[];
  total_brrr_recommendations: number;
  quick_wins_count: number;
  mtbps_aligned_count: number;
  fiscal_context: {
    allocated_rbn: number;
    recommended_rbn: number;
    gap_rbn: number;
    gap_pct: number;
    funding_status: string;
    mtbps_note: string;
  };
  top_recommendations: BrrrRecommendation[];
}

interface QuickWinsByPackage {
  package_id: number;
  package_name: string;
  count: number;
}

// ── Style helpers ──────────────────────────────────────────────────────────

const PACKAGE_STYLES: Record<number, { border: string; bar: string; badge: string; dot: string; bg: string }> = {
  1: { border: "border-amber-300",  bar: "bg-amber-400",  badge: "bg-amber-100 text-amber-800",  dot: "bg-amber-400",  bg: "bg-amber-50" },
  2: { border: "border-blue-300",   bar: "bg-blue-400",   badge: "bg-blue-100 text-blue-800",    dot: "bg-blue-400",   bg: "bg-blue-50" },
  3: { border: "border-purple-300", bar: "bg-purple-400", badge: "bg-purple-100 text-purple-800",dot: "bg-purple-400", bg: "bg-purple-50" },
  4: { border: "border-teal-300",   bar: "bg-teal-400",   badge: "bg-teal-100 text-teal-800",    dot: "bg-teal-400",   bg: "bg-teal-50" },
  5: { border: "border-slate-300",  bar: "bg-slate-400",  badge: "bg-slate-100 text-slate-700",  dot: "bg-slate-400",  bg: "bg-slate-50" },
};

const CATEGORY_BADGES: Record<string, string> = {
  "Accountability":           "bg-red-100 text-red-700",
  "Administrative Efficiency":"bg-blue-100 text-blue-700",
  "Budget/Fiscal":            "bg-orange-100 text-orange-700",
  "Capacity Building":        "bg-purple-100 text-purple-700",
  "Monitoring & Evaluation":  "bg-cyan-100 text-cyan-700",
  "Policy/Legislation":       "bg-green-100 text-green-700",
};

const FISCAL_TIER_COLORS: Record<string, string> = {
  "Tier 1": "bg-green-100 text-green-800",
  "Tier 2": "bg-yellow-100 text-yellow-800",
  "Tier 3": "bg-orange-100 text-orange-800",
  "Tier 4": "bg-red-100 text-red-800",
};

function fiscalTierKey(tier: string): string {
  const m = tier.match(/Tier \d/);
  return m ? m[0] : "Tier 3";
}

function fmt(n: number) {
  return `R${n.toFixed(1)}bn`;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatCard({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="card text-center py-4">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

function QuickWinBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 ring-1 ring-emerald-200">
      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
      Quick Win
    </span>
  );
}

function RecommendationCard({ rec, pkgId }: { rec: BrrrRecommendation; pkgId: number }) {
  const style = PACKAGE_STYLES[pkgId] ?? PACKAGE_STYLES[1];
  const catBadge = CATEGORY_BADGES[rec.category] ?? "bg-gray-100 text-gray-700";
  const tierKey = fiscalTierKey(rec.fiscal_tier);
  const tierBadge = FISCAL_TIER_COLORS[tierKey] ?? "bg-gray-100 text-gray-700";

  return (
    <div className={`rounded-xl border ${rec.is_quick_win ? "border-emerald-200 bg-emerald-50/30" : "border-gray-200 bg-white"} p-4 space-y-3`}>
      {/* Header row */}
      <div className="flex flex-wrap items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 leading-snug">{rec.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {rec.committee} · {rec.year_range}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 flex-shrink-0">
          {rec.is_quick_win && <QuickWinBadge />}
          <span className={`badge text-[10px] ${catBadge}`}>{rec.category}</span>
          <span className={`badge text-[10px] ${tierBadge}`}>{tierKey}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 leading-relaxed">{rec.description}</p>

      {/* Rationale */}
      <div className="rounded-lg bg-gray-50 border border-gray-100 px-3 py-2">
        <p className="text-[11px] text-gray-500">
          <span className="font-semibold text-gray-700">Why this matters: </span>
          {rec.rationale}
        </p>
      </div>

      {/* Footer: scores, fiscal cost, policy links */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <span className="font-medium text-gray-700">Impact</span>
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${i < rec.impact_score ? style.dot : "bg-gray-200"}`}
              />
            ))}
          </span>
        </span>
        <span className="flex items-center gap-1">
          <span className="font-medium text-gray-700">Feasibility</span>
          <span className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full ${i < rec.feasibility_score ? style.dot : "bg-gray-200"}`}
              />
            ))}
          </span>
        </span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-600 italic">{rec.fiscal_cost}</span>
        {rec.mtbps_alignment.map((tag) => (
          <span key={tag} className="badge bg-gray-100 text-gray-600 text-[10px]">{tag}</span>
        ))}
        {rec.policy_space_idea_ids.length > 0 && (
          <span className="ml-auto flex items-center gap-1">
            <span className="text-gray-400">Ideas:</span>
            {rec.policy_space_idea_ids.slice(0, 3).map((id) => (
              <Link
                key={id}
                href={`/ideas/${id}`}
                className="text-sa-green hover:underline font-mono"
              >
                #{id}
              </Link>
            ))}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function BrrrPage() {
  const meta = brrrData.metadata;
  const packages = brrrData.packages as BrrrPackage[];
  const quickWinsSummary = brrrData.quick_wins_summary;
  const mtbps = meta.mtbps_context;

  const totalRecs = meta.total_recommendations.toLocaleString();
  const quickWins = meta.quick_wins.toLocaleString();
  const brrrCount = meta.brrr_count;
  const tier1 = meta.tier_1_immediate.toLocaleString();
  const fiscOpt = meta.fiscally_optimal.toLocaleString();
  const mtbpsAligned = meta.mtbps_aligned.toLocaleString();

  // Budget alignment cross-reference
  const budgetPackages = (budgetData as { packages: { package_id: number; budget_allocated: number; budget_recommended: number; funding_status: string }[] }).packages;

  return (
    <div className="space-y-10">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="badge bg-sa-green/10 text-sa-green text-xs font-semibold">Parliamentary Analysis</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">BRRR Recommendations</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          Budget Review and Recommendations Reports (BRRRs) are tabled annually by Parliamentary Portfolio Committees
          after reviewing departmental performance. This analysis covers <strong>{brrrCount} BRRRs</strong> (2015–2025)
          and maps {totalRecs} discrete recommendations to the five reform packages.
        </p>
      </div>

      {/* ── What is a BRRR? ────────────────────────────────────────────── */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <h2 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What is a BRRR?
        </h2>
        <div className="text-sm text-blue-800 space-y-2 max-w-3xl">
          <p>
            Under Section 5(3) of the Money Bills Amendment Procedure and Related Matters Act (2009), each Parliamentary
            Portfolio Committee must produce a <strong>Budget Review and Recommendations Report</strong> after considering a
            department{"'"}s annual report and performance. BRRRs are the primary instrument through which Parliament
            holds the executive accountable for spending and service delivery.
          </p>
          <p>
            Each BRRR contains binding recommendations to Ministers on budget allocation, programme performance,
            irregular expenditure, and policy implementation. This site has analysed <strong>{brrrCount} BRRRs</strong> across
            26 committees from 2015 to 2025, extracting and scoring all {totalRecs} recommendations against fiscal
            feasibility, growth impact, and alignment with the 2025 MTBPS framework.
          </p>
        </div>
      </div>

      {/* ── Headline Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard value={brrrCount.toString()} label="BRRRs Analysed" sub="2015–2025" />
        <StatCard value={totalRecs} label="Total Recommendations" sub="Across 26 committees" />
        <StatCard value={quickWins} label="Quick Wins" sub="Low-cost, within mandate" />
        <StatCard value={tier1} label="Tier 1 Immediate" sub="Fiscally neutral" />
        <StatCard value={fiscOpt} label="Fiscally Optimal" sub="High impact + low cost" />
        <StatCard value={mtbpsAligned} label="MTBPS Aligned" sub="Matches stated priorities" />
      </div>

      {/* ── MTBPS Fiscal Context ───────────────────────────────────────── */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-3">2025 MTBPS Fiscal Context</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="text-center rounded-lg bg-gray-50 py-3 px-2">
            <div className="text-xl font-bold text-gray-900">{mtbps.debt_to_gdp_pct}%</div>
            <div className="text-xs text-gray-500">Debt-to-GDP (2025/26)</div>
            <div className="text-[11px] text-green-600 mt-0.5 font-medium">Stabilising — first peak in 15 years</div>
          </div>
          <div className="text-center rounded-lg bg-gray-50 py-3 px-2">
            <div className="text-xl font-bold text-gray-900">{mtbps.budget_deficit_pct_2025}%</div>
            <div className="text-xs text-gray-500">Budget Deficit (2025/26)</div>
            <div className="text-[11px] text-amber-600 mt-0.5 font-medium">→ {mtbps.budget_deficit_pct_2029}% by 2028/29</div>
          </div>
          <div className="text-center rounded-lg bg-gray-50 py-3 px-2">
            <div className="text-xl font-bold text-sa-green">+R{mtbps.sars_outperformance_rbn}bn</div>
            <div className="text-xs text-gray-500">SARS Revenue Outperformance</div>
            <div className="text-[11px] text-gray-400 mt-0.5">FY2024/25 vs estimates</div>
          </div>
          <div className="text-center rounded-lg bg-gray-50 py-3 px-2">
            <div className="text-xl font-bold text-gray-900">{mtbps.gdp_growth_2025}%</div>
            <div className="text-xs text-gray-500">GDP Growth (2025)</div>
            <div className="text-[11px] text-amber-600 mt-0.5 font-medium">Below potential — reforms critical</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
          <span className="font-semibold text-amber-800">Fiscal constraint: </span>
          {mtbps.key_implication}
        </p>
      </div>

      {/* ── Quick Wins Callout ─────────────────────────────────────────── */}
      <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5">
        <div className="flex flex-wrap items-start gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-emerald-900 flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              {quickWins} Quick Wins Identified
            </h2>
            <p className="text-sm text-emerald-800 mb-3">{quickWinsSummary.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(quickWinsSummary.by_package as QuickWinsByPackage[]).map((p) => {
                const style = PACKAGE_STYLES[p.package_id] ?? PACKAGE_STYLES[1];
                return (
                  <div key={p.package_id} className="text-center bg-white rounded-lg border border-emerald-200 py-2 px-1">
                    <div className={`w-5 h-5 rounded-full ${style.dot} text-white text-xs font-bold flex items-center justify-center mx-auto mb-1`}>
                      {p.package_id}
                    </div>
                    <div className="text-lg font-bold text-gray-900">{p.count}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">{p.package_name}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full sm:w-64 flex-shrink-0">
            <p className="text-xs font-semibold text-emerald-800 mb-2">Top quick win themes:</p>
            <ul className="space-y-1.5">
              {quickWinsSummary.top_themes.map((theme, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1" />
                  {theme}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Per-Package Sections ───────────────────────────────────────── */}
      {packages.map((pkg) => {
        const style = PACKAGE_STYLES[pkg.package_id] ?? PACKAGE_STYLES[1];
        const budgetPkg = budgetPackages.find((b) => b.package_id === pkg.package_id);
        const quickWinRecs = pkg.top_recommendations.filter((r) => r.is_quick_win);
        const otherRecs = pkg.top_recommendations.filter((r) => !r.is_quick_win);
        const mtbpsPct = pkg.total_brrr_recommendations > 0
          ? ((pkg.mtbps_aligned_count / pkg.total_brrr_recommendations) * 100).toFixed(0)
          : "0";
        const qwPct = pkg.total_brrr_recommendations > 0
          ? ((pkg.quick_wins_count / pkg.total_brrr_recommendations) * 100).toFixed(0)
          : "0";

        return (
          <div key={pkg.package_id} className={`card border-t-4 ${style.border} p-0 overflow-hidden`}>
            {/* Package header */}
            <div className={`px-5 py-4 ${style.bg} border-b border-gray-100`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`w-7 h-7 rounded-full ${style.dot} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {pkg.package_id}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-bold text-gray-900">{pkg.package_name}</h2>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {pkg.brrr_committees.map((c) => (
                      <span key={c} className="badge bg-white/80 text-gray-600 text-[10px]">{c}</span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/packages/${pkg.package_id}`}
                  className="text-xs text-sa-green hover:underline flex-shrink-0"
                >
                  View package →
                </Link>
              </div>
            </div>

            <div className="px-5 py-4 space-y-5">
              {/* Stats row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center rounded-lg bg-gray-50 border border-gray-100 py-2">
                  <div className="text-lg font-bold text-gray-900">{pkg.total_brrr_recommendations.toLocaleString()}</div>
                  <div className="text-[11px] text-gray-500">BRRR Recommendations</div>
                </div>
                <div className="text-center rounded-lg bg-emerald-50 border border-emerald-100 py-2">
                  <div className="text-lg font-bold text-emerald-700">{pkg.quick_wins_count}</div>
                  <div className="text-[11px] text-gray-500">Quick Wins ({qwPct}%)</div>
                </div>
                <div className="text-center rounded-lg bg-gray-50 border border-gray-100 py-2">
                  <div className="text-lg font-bold text-gray-900">{pkg.mtbps_aligned_count}</div>
                  <div className="text-[11px] text-gray-500">MTBPS Aligned ({mtbpsPct}%)</div>
                </div>
                {budgetPkg && (
                  <div className={`text-center rounded-lg py-2 border ${
                    budgetPkg.funding_status === "funded" ? "bg-green-50 border-green-200" :
                    budgetPkg.funding_status === "partially_funded" ? "bg-amber-50 border-amber-200" :
                    "bg-red-50 border-red-200"
                  }`}>
                    <div className={`text-lg font-bold ${
                      budgetPkg.funding_status === "funded" ? "text-green-700" :
                      budgetPkg.funding_status === "partially_funded" ? "text-amber-700" :
                      "text-red-700"
                    }`}>
                      {fmt(budgetPkg.budget_allocated)}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      Allocated of {fmt(budgetPkg.budget_recommended)} recommended
                    </div>
                  </div>
                )}
              </div>

              {/* Fiscal context note */}
              <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-2.5 text-xs text-gray-600">
                <span className="font-semibold text-gray-700">2025 MTBPS context: </span>
                {pkg.fiscal_context.mtbps_note}
              </div>

              {/* Quick win recommendations */}
              {quickWinRecs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-emerald-800 mb-2 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Quick Wins — actionable within 6 months, no new legislation required
                  </h3>
                  <div className="space-y-3">
                    {quickWinRecs.map((rec) => (
                      <RecommendationCard key={rec.id} rec={rec} pkgId={pkg.package_id} />
                    ))}
                  </div>
                </div>
              )}

              {/* Other recommendations */}
              {otherRecs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Medium-to-longer horizon recommendations</h3>
                  <div className="space-y-3">
                    {otherRecs.map((rec) => (
                      <RecommendationCard key={rec.id} rec={rec} pkgId={pkg.package_id} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* ── Cross-reference: Budget Alignment ─────────────────────────── */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Budget Alignment Cross-Reference</h2>
        <p className="text-xs text-gray-500 mb-4">
          The same five reform packages viewed from a funding perspective — showing gaps between BRRR-recommended
          spending and actual MTBPS allocations.
        </p>
        <div className="space-y-3">
          {budgetPackages.map((bp) => {
            const style = PACKAGE_STYLES[bp.package_id] ?? PACKAGE_STYLES[1];
            const pct = Math.min((bp.budget_allocated / bp.budget_recommended) * 100, 100);
            const brrrPkg = packages.find((p) => p.package_id === bp.package_id);
            return (
              <div key={bp.package_id}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full ${style.dot} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {bp.package_id}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {brrrPkg?.package_name ?? `Package ${bp.package_id}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{fmt(bp.budget_allocated)} allocated</span>
                    <span>{fmt(bp.budget_recommended)} recommended</span>
                    <span className="font-medium text-gray-700">{pct.toFixed(0)}% funded</span>
                  </div>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${style.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-right">
          <Link href="/budget" className="text-sm text-sa-green hover:underline">
            Full budget alignment analysis →
          </Link>
        </div>
      </div>

      {/* ── Fiscal Distribution ───────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recommendations by Fiscal Tier</h3>
          <div className="space-y-2">
            {[
              { tier: "Tier 1: Fiscally Neutral", count: meta.tier_1_immediate, pct: ((meta.tier_1_immediate / meta.total_recommendations) * 100).toFixed(0), color: "bg-green-400" },
              { tier: "Tier 2: Low Cost (<R100m)", count: meta.tier_2_near_term, pct: ((meta.tier_2_near_term / meta.total_recommendations) * 100).toFixed(1), color: "bg-yellow-400" },
              { tier: "Tier 3: Moderate Cost (R100m–R1bn)", count: 3087, pct: "58.7", color: "bg-orange-400" },
              { tier: "Tier 4: High Cost (>R1bn)", count: 508, pct: "9.7", color: "bg-red-400" },
            ].map((row) => (
              <div key={row.tier}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{row.tier}</span>
                  <span className="font-medium text-gray-900">{row.count.toLocaleString()} ({row.pct}%)</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-1.5 rounded-full ${row.color}`} style={{ width: `${row.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Portfolio Numbers</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: "Fiscally optimal (high impact + low cost)", value: meta.fiscally_optimal.toLocaleString(), color: "text-sa-green" },
              { label: "MTBPS-aligned recommendations", value: meta.mtbps_aligned.toLocaleString(), color: "text-blue-600" },
              { label: "High priority overall", value: meta.high_priority.toLocaleString(), color: "text-gray-900" },
              { label: "Require institutional reform", value: meta.requiring_institutional_reform.toLocaleString(), color: "text-amber-600" },
              { label: "Avg impact score (out of 5)", value: meta.avg_impact.toFixed(2), color: "text-gray-900" },
              { label: "Avg feasibility score (out of 5)", value: meta.avg_feasibility.toFixed(2), color: "text-gray-900" },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">{row.label}</span>
                <span className={`font-semibold ${row.color}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Source Note ───────────────────────────────────────────────── */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">Methodology Note</p>
        <p>{meta.description}</p>
        <p className="mt-1">
          Each recommendation was scored for: <strong>impact</strong> (1–5), <strong>feasibility</strong> (1–5),
          <strong> fiscal cost</strong> (1–4 tier), and <strong>MTBPS alignment</strong> (matched against 2025 MTBPS
          stated priorities). Quick wins satisfy all four criteria: impact ≥ 4, feasibility ≥ 4, fiscal tier 1 or 2,
          and within existing departmental mandate.
        </p>
        <p className="mt-1">
          Source: Parliamentary Monitoring Group (PMG) BRRR archive 2015–2025. Analysis: November 2025.
        </p>
      </div>

    </div>
  );
}
