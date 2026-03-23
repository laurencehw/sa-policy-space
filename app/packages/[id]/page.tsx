export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import type { IdeaRow, PackageDetail } from "@/lib/local-api";
import { STATUS_COLORS } from "@/lib/supabase";
import DiagramViewer from "@/components/DiagramViewer";
import implementationPlansData from "@/data/implementation_plans.json";
import fiscalEstimatesData from "@/data/fiscal_estimates.json";
import stakeholdersData from "@/data/stakeholders.json";

// ── Implementation Plan Types ──────────────────────────────────────────────

interface ActionItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "not_started";
  owner: string;
  legislative_reference?: string;
}

interface Dependency {
  from: string;
  to: string;
  description: string;
}

interface Metric {
  metric: string;
  current: string;
  target: string;
  timeline: string;
}

interface RiskFactor {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
}

interface PackageImplementationPlan {
  package_id: number;
  quick_wins: ActionItem[];
  medium_term: ActionItem[];
  long_term: ActionItem[];
  key_dependencies: Dependency[];
  success_metrics: Metric[];
  risk_factors: RiskFactor[];
}

const implementationPlans = implementationPlansData as Record<string, PackageImplementationPlan>;

// ── Fiscal Estimates ───────────────────────────────────────────────────────

interface FiscalEstimate {
  package_id: number;
  public_investment_zar_bn: number;
  private_investment_catalyzed_zar_bn: number;
  investment_timeframe_years: number;
  gdp_impact_low_pct: number;
  gdp_impact_high_pct: number;
  gdp_impact_reference_year: number;
  employment_total: number;
  annual_revenue_uplift_zar_bn: number;
  break_even_years: number;
  revenue_note: string;
  primary_sources: string[];
}

const fiscalEstimates = fiscalEstimatesData as Record<string, FiscalEstimate>;

// ── Stakeholders ──────────────────────────────────────────────────────────

type StakeholderCategory = "Government" | "Regulator" | "SOE" | "Private Sector" | "Labour" | "Civil Society" | "International";
type StakeholderStance = "champion" | "constructive_critic" | "cautious" | "concerned";

interface StakeholderEntry {
  id: string;
  name: string;
  category: StakeholderCategory;
  influence_score: number;
  stance: StakeholderStance;
  primary_interests: string;
  key_concerns: string;
  related_packages: number[];
}

const allStakeholders = stakeholdersData as StakeholderEntry[];

const STAKEHOLDER_CATEGORY_COLORS: Record<StakeholderCategory, string> = {
  Government:       "bg-blue-100 text-blue-800 ring-blue-200",
  Regulator:        "bg-purple-100 text-purple-800 ring-purple-200",
  SOE:              "bg-amber-100 text-amber-800 ring-amber-200",
  "Private Sector": "bg-teal-100 text-teal-800 ring-teal-200",
  Labour:           "bg-red-100 text-red-800 ring-red-200",
  "Civil Society":  "bg-green-100 text-green-800 ring-green-200",
  International:    "bg-slate-100 text-slate-700 ring-slate-200",
};

const STAKEHOLDER_STANCE_STYLES: Record<StakeholderStance, { badge: string; label: string }> = {
  champion:            { badge: "bg-emerald-100 text-emerald-800 ring-emerald-200", label: "Champion" },
  constructive_critic: { badge: "bg-blue-100 text-blue-800 ring-blue-200",          label: "Constructive Critic" },
  cautious:            { badge: "bg-amber-100 text-amber-800 ring-amber-200",        label: "Cautious" },
  concerned:           { badge: "bg-orange-100 text-orange-800 ring-orange-200",     label: "Concerned" },
};

function KeyStakeholdersSection({ packageId }: { packageId: number }) {
  const relevant = allStakeholders
    .filter((s) => s.related_packages.includes(packageId))
    .sort((a, b) => b.influence_score - a.influence_score);

  if (relevant.length === 0) return null;

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Key Stakeholders</h2>
        <p className="text-sm text-gray-500 mt-1">
          Major actors with a stake in this reform package, ranked by influence.{" "}
          <a href="/stakeholders" className="text-sa-green hover:underline">
            Full stakeholder map →
          </a>
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {relevant.map((s) => {
          const stanceConf = STAKEHOLDER_STANCE_STYLES[s.stance];
          return (
            <div
              key={s.id}
              className="flex flex-col gap-2 px-4 py-3 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start gap-2 justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 leading-snug mb-1.5">{s.name}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`badge ring-1 text-xs ${STAKEHOLDER_CATEGORY_COLORS[s.category]}`}>
                      {s.category}
                    </span>
                    <span className={`badge ring-1 text-xs ${stanceConf.badge}`}>
                      {stanceConf.label}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right ml-2">
                  <p className="text-xs text-gray-400">Influence</p>
                  <p className="text-lg font-bold text-gray-700">
                    {s.influence_score}
                    <span className="text-xs font-normal text-gray-400">/10</span>
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-100 pt-2">
                {s.primary_interests.length > 140
                  ? s.primary_interests.slice(0, 140).trimEnd() + "…"
                  : s.primary_interests}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FiscalImpactCard({ packageId }: { packageId: number }) {
  const est = fiscalEstimates[String(packageId)];
  if (!est) return null;
  const hasPrivate = est.private_investment_catalyzed_zar_bn > 0;
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="card space-y-0.5">
        <p className="text-xs text-gray-400">Public investment</p>
        <p className="text-xl font-bold text-gray-900">R{est.public_investment_zar_bn}bn</p>
        <p className="text-xs text-gray-400">over {est.investment_timeframe_years} years</p>
        {hasPrivate && (
          <p className="text-xs text-gray-500 mt-1">
            + R{est.private_investment_catalyzed_zar_bn}bn private capital catalysed
          </p>
        )}
      </div>
      <div className="card space-y-0.5">
        <p className="text-xs text-gray-400">GDP impact</p>
        <p className="text-xl font-bold text-gray-900">
          +{est.gdp_impact_low_pct}–{est.gdp_impact_high_pct}%
        </p>
        <p className="text-xs text-gray-400">by {est.gdp_impact_reference_year}</p>
      </div>
      <div className="card space-y-0.5">
        <p className="text-xs text-gray-400">Jobs created</p>
        <p className="text-xl font-bold text-gray-900">
          ~{(est.employment_total / 1000).toFixed(0)}k
        </p>
        <p className="text-xs text-gray-400">direct + indirect</p>
      </div>
      <div className="card space-y-0.5">
        <p className="text-xs text-gray-400">Annual revenue uplift</p>
        <p className="text-xl font-bold text-sa-green">R{est.annual_revenue_uplift_zar_bn}bn/yr</p>
        <p className="text-xs text-gray-400">break-even ~{est.break_even_years} years</p>
      </div>
    </div>
  );
}

// ── Implementation Roadmap Components ─────────────────────────────────────

const IMPL_STATUS_STYLES: Record<ActionItem["status"], { badge: string; dot: string; label: string }> = {
  completed:   { badge: "bg-green-100 text-green-800 ring-green-200",  dot: "bg-green-500",  label: "Completed"   },
  in_progress: { badge: "bg-amber-100 text-amber-800 ring-amber-200",  dot: "bg-amber-400",  label: "In Progress" },
  not_started: { badge: "bg-gray-100 text-gray-500 ring-gray-200",     dot: "bg-gray-300",   label: "Not Started" },
};

const RISK_SEVERITY_STYLES: Record<RiskFactor["severity"], string> = {
  high:   "bg-red-100 text-red-800 ring-red-200",
  medium: "bg-amber-100 text-amber-700 ring-amber-200",
  low:    "bg-blue-100 text-blue-700 ring-blue-200",
};

function ActionItemRow({ item }: { item: ActionItem }) {
  const s = IMPL_STATUS_STYLES[item.status];
  return (
    <div className="flex gap-3 py-3 px-4 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-colors">
      <div className={`mt-1.5 flex-shrink-0 w-2.5 h-2.5 rounded-full ${s.dot}`} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900 leading-snug">{item.title}</span>
          <span className={`badge ring-1 ${s.badge} flex-shrink-0 text-xs`}>{s.label}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed mb-1.5">{item.description}</p>
        <div className="flex flex-wrap gap-3 text-xs text-gray-400">
          <span><span className="font-medium text-gray-500">Owner:</span> {item.owner}</span>
          {item.legislative_reference && (
            <span><span className="font-medium text-gray-500">Legislation:</span> {item.legislative_reference}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function PhaseSection({
  title,
  timeRange,
  items,
  colorScheme,
}: {
  title: string;
  timeRange: string;
  items: ActionItem[];
  colorScheme: { bg: string; text: string; border: string; badge: string };
}) {
  const completed = items.filter((i) => i.status === "completed").length;
  const inProgress = items.filter((i) => i.status === "in_progress").length;

  return (
    <div className={`rounded-xl border ${colorScheme.border} overflow-hidden`}>
      <div className={`${colorScheme.bg} px-5 py-3 flex items-center justify-between`}>
        <div>
          <span className={`font-semibold ${colorScheme.text} text-sm`}>{title}</span>
          <span className={`ml-2 text-xs ${colorScheme.text} opacity-70`}>{timeRange}</span>
        </div>
        <div className="flex gap-2 text-xs">
          {completed > 0 && (
            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full ring-1 ring-green-200">
              {completed} completed
            </span>
          )}
          {inProgress > 0 && (
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full ring-1 ring-amber-200">
              {inProgress} in progress
            </span>
          )}
          <span className="bg-white/60 text-gray-600 px-2 py-0.5 rounded-full ring-1 ring-gray-200">
            {items.length} actions
          </span>
        </div>
      </div>
      <div className="p-3 space-y-2 bg-gray-50/50">
        {items.map((item) => (
          <ActionItemRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function ImplementationRoadmap({ plan }: { plan: PackageImplementationPlan }) {
  return (
    <div className="space-y-8">
      {/* Timeline phases */}
      <div className="space-y-4">
        <PhaseSection
          title="Quick Wins"
          timeRange="0–6 months"
          items={plan.quick_wins}
          colorScheme={{
            bg: "bg-green-50",
            text: "text-green-900",
            border: "border-green-200",
            badge: "bg-green-100 text-green-800",
          }}
        />
        <PhaseSection
          title="Medium-Term Reforms"
          timeRange="6–24 months"
          items={plan.medium_term}
          colorScheme={{
            bg: "bg-blue-50",
            text: "text-blue-900",
            border: "border-blue-200",
            badge: "bg-blue-100 text-blue-800",
          }}
        />
        <PhaseSection
          title="Long-Term Structural Changes"
          timeRange="2–5 years"
          items={plan.long_term}
          colorScheme={{
            bg: "bg-purple-50",
            text: "text-purple-900",
            border: "border-purple-200",
            badge: "bg-purple-100 text-purple-800",
          }}
        />
      </div>

      {/* Key dependencies + Success metrics side-by-side on wider screens */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Key dependencies */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Key Dependencies</h3>
          <div className="space-y-2">
            {plan.key_dependencies.map((dep, i) => (
              <div key={i} className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-100 text-sm">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-gray-800 text-xs bg-white border border-gray-200 px-2 py-0.5 rounded">
                    {dep.from}
                  </span>
                  <span className="text-gray-400 flex-shrink-0">→</span>
                  <span className="font-medium text-gray-800 text-xs bg-white border border-gray-200 px-2 py-0.5 rounded">
                    {dep.to}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{dep.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Success metrics */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Success Metrics</h3>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Metric</th>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Current</th>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">Target</th>
                  <th className="text-left px-3 py-2 text-gray-600 font-medium">By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {plan.success_metrics.map((m, i) => (
                  <tr key={i} className="bg-white hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-gray-800 font-medium leading-snug">{m.metric}</td>
                    <td className="px-3 py-2 text-gray-500">{m.current}</td>
                    <td className="px-3 py-2 text-sa-green font-medium">{m.target}</td>
                    <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{m.timeline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Risk factors */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Factors</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {plan.risk_factors.map((risk, i) => (
            <div key={i} className="px-4 py-3 rounded-lg bg-white border border-gray-100">
              <div className="flex items-start gap-2 mb-1.5">
                <span className={`badge ring-1 flex-shrink-0 ${RISK_SEVERITY_STYLES[risk.severity]} capitalize`}>
                  {risk.severity}
                </span>
                <span className="text-sm font-medium text-gray-900 leading-snug">{risk.title}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{risk.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PACKAGE_SVGS: Record<number, string> = {
  1: "/diagrams/pkg1_infrastructure_unblock.svg",
  2: "/diagrams/pkg2_smme_employment.svg",
  3: "/diagrams/pkg3_human_capital_pipeline.svg",
  4: "/diagrams/pkg4_trade_industrial_competitiveness.svg",
  5: "/diagrams/pkg5_state_capacity_governance.svg",
};

// Per-package colour scheme (mirrors packages/page.tsx)
const PACKAGE_STYLES: Record<number, { border: string; badge: string; dotColor: string; headerBg: string }> = {
  1: { border: "border-amber-400",  badge: "bg-amber-100 text-amber-800",  dotColor: "bg-amber-400",  headerBg: "bg-amber-50"  },
  2: { border: "border-blue-400",   badge: "bg-blue-100 text-blue-800",    dotColor: "bg-blue-400",   headerBg: "bg-blue-50"   },
  3: { border: "border-purple-400", badge: "bg-purple-100 text-purple-800",dotColor: "bg-purple-400", headerBg: "bg-purple-50" },
  4: { border: "border-teal-400",   badge: "bg-teal-100 text-teal-800",    dotColor: "bg-teal-400",   headerBg: "bg-teal-50"   },
  5: { border: "border-slate-400",  badge: "bg-slate-100 text-slate-700",  dotColor: "bg-slate-400",  headerBg: "bg-slate-50"  },
};

const TIME_HORIZON_LABELS: Record<string, string> = {
  quick_win:   "Quick Wins",
  medium_term: "Medium Term",
  long_term:   "Long Term",
};

const TIME_HORIZON_STYLES: Record<string, { bg: string; text: string; ring: string; badge: string }> = {
  quick_win:   { bg: "bg-green-50",  text: "text-green-900",  ring: "ring-green-200",  badge: "bg-green-100 text-green-800"  },
  medium_term: { bg: "bg-blue-50",   text: "text-blue-900",   ring: "ring-blue-200",   badge: "bg-blue-100 text-blue-800"   },
  long_term:   { bg: "bg-purple-50", text: "text-purple-900", ring: "ring-purple-200", badge: "bg-purple-100 text-purple-800" },
};

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-3 rounded-full ${i < value ? "bg-sa-green" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function IdeaCard({ idea }: { idea: IdeaRow }) {
  const statusColor = (STATUS_COLORS as Record<string, string>)[idea.current_status]
    ?? "bg-gray-50 text-gray-600 ring-gray-500/20";

  return (
    <Link href={`/ideas/${idea.id}`} className="card block space-y-2 hover:shadow-sm transition-shadow">
      <div className="flex flex-wrap gap-1.5">
        <span className={`badge ring-1 ${statusColor}`}>{idea.current_status.replace(/_/g, " ")}</span>
        {idea.feasibility_rating == null && (
          <span className="badge bg-gray-100 text-gray-400 ring-1 ring-gray-200">No feasibility rating</span>
        )}
      </div>
      <h3 className="font-medium text-gray-900 leading-snug text-sm">{idea.title}</h3>
      {idea.description && (
        <p className="text-xs text-gray-500 line-clamp-2">{idea.description}</p>
      )}
      <div className="flex items-center justify-between pt-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 w-16">Growth</span>
            <RatingBar value={idea.growth_impact_rating ?? 0} />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 w-16">Feasibility</span>
            <RatingBar value={idea.feasibility_rating ?? 0} />
          </div>
        </div>
        {idea.source_committee && (
          <span className="text-xs text-gray-400 text-right max-w-[120px] leading-tight">
            {idea.source_committee}
          </span>
        )}
      </div>
    </Link>
  );
}

function HorizonSection({
  horizon,
  ideas,
}: {
  horizon: string;
  ideas: IdeaRow[];
}) {
  if (ideas.length === 0) return null;
  const style = TIME_HORIZON_STYLES[horizon] ?? TIME_HORIZON_STYLES.quick_win;
  const label = TIME_HORIZON_LABELS[horizon] ?? horizon;

  return (
    <section>
      <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${style.bg} mb-4`}>
        <span className={`badge ring-1 ${style.badge} ${style.ring}`}>{label}</span>
        <span className={`text-sm font-medium ${style.text}`}>{ideas.length} idea{ideas.length !== 1 ? "s" : ""}</span>
        {horizon === "quick_win" && (
          <span className="text-xs text-gray-500 ml-auto">Can be achieved within 12 months</span>
        )}
        {horizon === "medium_term" && (
          <span className="text-xs text-gray-500 ml-auto">1–3 year implementation window</span>
        )}
        {horizon === "long_term" && (
          <span className="text-xs text-gray-500 ml-auto">3+ years; structural change required</span>
        )}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </section>
  );
}

export default async function PackageDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const isLocal = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  const packageId = Number(params.id);
  if (isNaN(packageId)) notFound();

  let pkg: PackageDetail | null;
  if (isLocal) {
    const { getPackageDetail } = await import("@/lib/local-api");
    pkg = getPackageDetail(packageId);
  } else {
    const { getPackageDetail } = await import("@/lib/supabase-api");
    pkg = await getPackageDetail(packageId) as PackageDetail | null;
  }
  if (!pkg) notFound();

  const style = PACKAGE_STYLES[pkg.package_id] ?? PACKAGE_STYLES[1];
  const horizonOrder = ["quick_win", "medium_term", "long_term"] as const;

  return (
    <div className="space-y-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/packages" className="hover:text-gray-600 transition-colors">Reform Packages</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[240px]">{pkg.name}</span>
      </nav>

      {/* Header */}
      <section className={`rounded-xl border-t-4 ${style.border} ${style.headerBg} p-6`}>
        <div className="flex items-start gap-3 mb-2">
          <span className={`flex-shrink-0 w-8 h-8 rounded-full ${style.dotColor} flex items-center justify-center text-white text-sm font-bold`}>
            {pkg.package_id}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{pkg.name}</h1>
            <p className="text-gray-500 italic mt-0.5">{pkg.tagline}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-4 mb-4">
          <span><strong>{pkg.idea_count}</strong> ideas</span>
          <span>Avg growth impact: <strong>{pkg.avg_growth_impact.toFixed(1)}/5</strong></span>
          <span>Avg feasibility: <strong>{pkg.avg_feasibility.toFixed(1)}/5</strong></span>
          <span><strong>{pkg.stalled_or_proposed_count}</strong> stalled or proposed</span>
          <span><strong>{pkg.implemented_or_partial_count}</strong> implemented/partial</span>
        </div>

        {/* Browse filtered link */}
        <Link
          href={`/ideas?package=${pkg.package_id}`}
          className="btn-secondary text-sm inline-block"
        >
          Browse all {pkg.idea_count} ideas in this package →
        </Link>
      </section>

      {/* Theory of change */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Theory of Change</h2>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-3">
          {pkg.theory_of_change.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </section>

      {/* Fiscal impact */}
      {fiscalEstimates[String(pkg.package_id)] && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Fiscal Impact Estimates</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Scenario estimates — not official government projections. See{" "}
                <Link href="/analytics#fiscal" className="text-sa-green hover:underline">
                  full methodology
                </Link>
                .
              </p>
            </div>
          </div>
          <FiscalImpactCard packageId={pkg.package_id} />
          <p className="mt-3 text-xs text-gray-400 leading-relaxed">
            {fiscalEstimates[String(pkg.package_id)]?.revenue_note}
          </p>
        </section>
      )}

      {/* Timeline / sequencing view */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Ideas by Time Horizon</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sequencing from quick regulatory wins through institutional reform to structural change.
        </p>

        {/* Visual timeline bar */}
        <div className="flex items-center gap-0 mb-8 rounded-xl overflow-hidden border border-gray-200 text-sm">
          {horizonOrder.map((h, i) => {
            const count = pkg.ideas_by_horizon[h].length;
            const total = pkg.idea_count || 1;
            const width = Math.max(count / total * 100, 10);
            const hs = TIME_HORIZON_STYLES[h];
            return (
              <div
                key={h}
                className={`${hs.bg} flex flex-col items-center justify-center py-3 transition-all`}
                style={{ flexBasis: `${width}%`, flexGrow: 1 }}
              >
                <span className={`font-semibold ${hs.text} text-lg`}>{count}</span>
                <span className={`text-xs ${hs.text} opacity-75`}>{TIME_HORIZON_LABELS[h]}</span>
              </div>
            );
          })}
        </div>

        {/* Ideas grouped by horizon */}
        <div className="space-y-8">
          {horizonOrder.map((h) => (
            <HorizonSection key={h} horizon={h} ideas={pkg.ideas_by_horizon[h]} />
          ))}
          {pkg.ideas_by_horizon.unassigned.length > 0 && (
            <HorizonSection horizon="unassigned" ideas={pkg.ideas_by_horizon.unassigned} />
          )}
        </div>
      </section>

      {/* Dependencies */}
      {pkg.dependencies.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Reform Dependencies</h2>
          <p className="text-sm text-gray-500 mb-4">
            Which reforms in this package enable or unlock others.
          </p>
          <div className="space-y-2">
            {pkg.dependencies.map((dep, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-100">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <Link href={`/ideas/${dep.source}`} className="font-medium text-gray-900 hover:text-sa-green truncate max-w-[220px]">
                      {dep.source_title}
                    </Link>
                    <span className="text-gray-400 flex-shrink-0">→</span>
                    <Link href={`/ideas/${dep.target}`} className="font-medium text-gray-900 hover:text-sa-green truncate max-w-[220px]">
                      {dep.target_title}
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 italic">{dep.label}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dependency flow diagram */}
      {PACKAGE_SVGS[pkg.package_id] && (
        <section>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-semibold text-gray-900">Dependency Flow Diagram</h2>
            <Link href="/dependencies" className="text-xs text-sa-green hover:underline">
              See all packages →
            </Link>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Visual map of how reforms in this package sequence and unlock each other.
          </p>
          <DiagramViewer
            src={PACKAGE_SVGS[pkg.package_id]}
            alt={`Dependency flow diagram for ${pkg.name}`}
          />
        </section>
      )}

      {/* Implementation Roadmap */}
      {implementationPlans[String(pkg.package_id)] && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Implementation Roadmap</h2>
            <p className="text-sm text-gray-500 mt-1">
              Sequenced action plan from quick regulatory wins to structural reform, with key dependencies, success metrics, and risk factors.
            </p>
          </div>
          <ImplementationRoadmap plan={implementationPlans[String(pkg.package_id)]} />
        </section>
      )}

      {/* Key Stakeholders */}
      <KeyStakeholdersSection packageId={pkg.package_id} />

    </div>
  );
}
