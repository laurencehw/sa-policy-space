export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/utils";
import CitationWidget from "@/components/CitationWidget";
import {
  CONSTRAINT_LABELS,
  CONSTRAINT_COLORS,
  STATUS_COLORS,
  type PolicyIdea,
  type ImplementationPlan,
  type Meeting,
} from "@/lib/supabase";

// ── Data fetching ──────────────────────────────────────────────────────────

async function fetchIdeaById(id: number): Promise<PolicyIdea | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getIdeaById } = await import("@/lib/local-api");
    return getIdeaById(id) as PolicyIdea | null;
  }
  const { getIdeaById } = await import("@/lib/supabase-api");
  return await getIdeaById(id) as PolicyIdea | null;
}

async function fetchIdeaBySlug(slug: string): Promise<PolicyIdea | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getIdeaBySlug } = await import("@/lib/local-api");
    return getIdeaBySlug(slug) as PolicyIdea | null;
  }
  const { getIdeaBySlug } = await import("@/lib/supabase-api");
  return await getIdeaBySlug(slug) as PolicyIdea | null;
}

async function getImplementationPlan(ideaId: number): Promise<ImplementationPlan | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getImplementationPlan: localPlan } = await import("@/lib/local-api");
    return localPlan(ideaId) as ImplementationPlan | null;
  }
  const { getImplementationPlan: supabasePlan } = await import("@/lib/supabase-api");
  return await supabasePlan(ideaId) as ImplementationPlan | null;
}

async function getSourceMeetings(ideaId: number): Promise<Meeting[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getIdeaMeetings } = await import("@/lib/local-api");
    return getIdeaMeetings(ideaId) as Meeting[];
  }
  const { getIdeaMeetings } = await import("@/lib/supabase-api");
  return await getIdeaMeetings(ideaId) as Meeting[];
}

async function fetchRelatedIdeas(packageId: number, currentId: number): Promise<any[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getRelatedIdeas } = await import("@/lib/local-api");
    return getRelatedIdeas(packageId, currentId) as any[];
  }
  const { getRelatedIdeas } = await import("@/lib/supabase-api");
  return await getRelatedIdeas(packageId, currentId) as any[];
}

async function fetchIdeaComparisons(ideaId: number): Promise<any[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getIdeaComparisons } = await import("@/lib/local-api");
    return getIdeaComparisons(ideaId) as any[];
  }
  const { getIdeaComparisons } = await import("@/lib/supabase-api");
  return await getIdeaComparisons(ideaId) as any[];
}

function fmtMonthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

/** Safely parse a field that might be a JSON string or already an array */
function parseArrayField(value: unknown): string[] | null {
  if (!value) return null;
  if (Array.isArray(value)) return value as string[];
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return null; }
  }
  return null;
}

// ISO 3166-1 alpha-3 → flag emoji (flags use alpha-2 regional indicators)
const ISO3_FLAG: Record<string, string> = {
  CHL: "🇨🇱", IND: "🇮🇳", VNM: "🇻🇳", BRA: "🇧🇷",
  KOR: "🇰🇷", EST: "🇪🇪", BWA: "🇧🇼", RWA: "🇷🇼",
  GEO: "🇬🇪", PER: "🇵🇪", COL: "🇨🇴", SLV: "🇸🇻",
  KEN: "🇰🇪", MUS: "🇲🇺", IDN: "🇮🇩", MYS: "🇲🇾",
  TUR: "🇹🇷", MEX: "🇲🇽", POL: "🇵🇱",
};

// ── Sub-components ─────────────────────────────────────────────────────────

function TimeHorizonBadge({ horizon }: { horizon: string | null | undefined }) {
  if (!horizon) return null;
  const config: Record<string, { label: string; className: string }> = {
    quick_win:   { label: "Quick Win",   className: "bg-green-100 text-green-800 ring-green-600/20" },
    medium_term: { label: "Medium Term", className: "bg-amber-100 text-amber-800 ring-amber-600/20" },
    long_term:   { label: "Long Term",   className: "bg-red-100 text-red-800 ring-red-600/20" },
  };
  const c = config[horizon];
  if (!c) return null;
  return (
    <span className={`badge ring-1 ${c.className}`}>{c.label}</span>
  );
}

function RatingIndicator({ label, value, max = 5 }: {
  label: string;
  value: number;
  max?: number;
}) {
  const percentage = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span>{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full">
        <div
          className="h-2 bg-sa-green rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ImplementationStep({
  step,
  index,
}: {
  step: { step: string; description: string; timeline: string; responsible_party: string };
  index: number;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sa-green text-white text-xs
                      flex items-center justify-center font-semibold mt-0.5">
        {index + 1}
      </div>
      <div>
        <div className="font-medium text-sm text-gray-900">{step.step}</div>
        <p className="text-sm text-gray-600 mt-0.5">{step.description}</p>
        <div className="flex gap-3 mt-1 text-xs text-gray-400">
          <span>⏱ {step.timeline}</span>
          <span>👤 {step.responsible_party}</span>
        </div>
      </div>
    </div>
  );
}

function NoData() {
  return (
    <div className="card text-center py-16 text-gray-400">
      <p className="text-sm font-medium text-gray-700 mb-1">No data yet</p>
      <p className="text-xs">
        Seed the database, then this page will show the full idea detail.
      </p>
      <Link href="/ideas" className="text-sa-green text-sm hover:underline mt-3 inline-block">
        ← Back to Ideas
      </Link>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function IdeaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const slugOrId = params.id;

  // Numeric ID → look up and redirect to canonical slug URL
  if (/^\d+$/.test(slugOrId)) {
    const idea = await fetchIdeaById(parseInt(slugOrId, 10));
    if (!idea) return <NoData />;
    redirect(`/ideas/${idea.slug || slugify(idea.title)}`);
  }

  // Slug lookup
  const idea = await fetchIdeaBySlug(slugOrId);
  if (!idea) return <NoData />;

  const [plan, meetings, relatedIdeas, comparisons] = await Promise.all([
    getImplementationPlan(idea.id),
    getSourceMeetings(idea.id),
    idea.reform_package ? fetchRelatedIdeas(idea.reform_package, idea.id) : Promise.resolve([]),
    fetchIdeaComparisons(idea.id),
  ]);

  // Parse enriched array fields (may arrive as JSON strings from SQLite)
  const keyQuotes = parseArrayField(idea.key_quotes);
  const departments = parseArrayField(idea.responsible_departments);

  return (
    <div className="max-w-3xl space-y-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/ideas" className="hover:text-gray-600 transition-colors">Ideas</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[240px]">{idea.title}</span>
      </nav>

      {/* Header */}
      <div>
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`badge ${CONSTRAINT_COLORS[idea.binding_constraint]}`}>
            {CONSTRAINT_LABELS[idea.binding_constraint]}
          </span>
          <span className={`badge ring-1 ${(STATUS_COLORS as Record<string, string>)[idea.current_status] ?? "bg-gray-50 text-gray-600 ring-gray-500/20"}`}>
            {idea.current_status?.replace(/_/g, " ")}
          </span>
          <TimeHorizonBadge horizon={idea.time_horizon} />
          {idea.times_raised > 1 && (
            <span className="badge bg-gray-100 text-gray-600 ring-gray-200">
              Raised {idea.times_raised}× in committee
            </span>
          )}
          {idea.source_committee && (
            <span className="badge bg-gray-50 text-gray-600 ring-1 ring-gray-200">
              {idea.source_committee}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{idea.title}</h1>
        {idea.theme && (
          <p className="text-sm text-gray-500 mt-1">Theme: {idea.theme}</p>
        )}

        {/* Date timeline */}
        {(idea.first_raised || idea.last_discussed) && (
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
            {idea.first_raised && (
              <span>
                <span className="text-gray-400 text-xs uppercase tracking-wide mr-1">First raised</span>
                <span className="font-medium text-gray-700">{fmtMonthYear(idea.first_raised)}</span>
              </span>
            )}
            {idea.last_discussed && (
              <span>
                <span className="text-gray-400 text-xs uppercase tracking-wide mr-1">Last discussed</span>
                <span className="font-medium text-gray-700">{fmtMonthYear(idea.last_discussed)}</span>
              </span>
            )}
            {idea.dormant === 1 && (
              <span className="badge bg-gray-100 text-gray-500 ring-1 ring-gray-300 text-xs">
                Dormant — not discussed in 12+ months
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/briefs?title=${encodeURIComponent(idea.title)}`}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-[#007A4D] text-white hover:bg-[#005f3b] transition-colors font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Generate Brief
        </Link>
        <Link
          href={`/compare?add=${encodeURIComponent(idea.slug || idea.id)}`}
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Compare
        </Link>
        <Link
          href="/matrix"
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="1" /><circle cx="5" cy="5" r="1" /><circle cx="19" cy="5" r="1" /><circle cx="5" cy="19" r="1" /><circle cx="19" cy="19" r="1" />
          </svg>
          Feasibility Matrix
        </Link>
      </div>

      {/* Assessment */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-sm text-gray-700">Assessment</h2>
        <RatingIndicator label="Growth Impact" value={idea.growth_impact_rating} />
        <RatingIndicator label="Feasibility" value={idea.feasibility_rating} />

        {/* Quantified impact numbers */}
        {(idea.growth_impact_pct != null || idea.fiscal_impact_zar_bn != null) && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            {idea.growth_impact_pct != null && (
              <div className="rounded-lg bg-green-50 px-3 py-2">
                <p className="text-xs text-gray-500 mb-0.5">Growth Impact</p>
                <p className="font-semibold text-green-800 text-sm">
                  {idea.growth_impact_pct > 0 ? "+" : ""}
                  {idea.growth_impact_pct.toFixed(1)}% GDP
                </p>
              </div>
            )}
            {idea.fiscal_impact_zar_bn != null && (
              <div className="rounded-lg bg-amber-50 px-3 py-2">
                <p className="text-xs text-gray-500 mb-0.5">Fiscal Impact</p>
                <p className="font-semibold text-amber-800 text-sm">
                  R {Math.abs(idea.fiscal_impact_zar_bn).toFixed(1)} bn
                  {idea.fiscal_impact_zar_bn < 0 ? " cost" : " saving"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Responsible department(s) */}
        {departments && departments.length > 0 ? (
          <div className="pt-1">
            <p className="text-xs text-gray-500 mb-1.5">Responsible departments</p>
            <div className="flex flex-wrap gap-1.5">
              {departments.map((dept) => (
                <span
                  key={dept}
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: "#e6f4ed", color: "#007A4D" }}
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        ) : idea.responsible_department ? (
          <p className="text-xs text-gray-500 pt-1">
            Responsible: <span className="font-medium text-gray-700">{idea.responsible_department}</span>
          </p>
        ) : null}
      </div>

      {/* Feasibility Assessment callout */}
      {idea.feasibility_note && (
        <div
          className="rounded-lg border-l-4 p-4"
          style={{ backgroundColor: "#f0faf4", borderColor: "#007A4D" }}
        >
          <h2 className="font-semibold text-sm mb-1" style={{ color: "#007A4D" }}>
            Feasibility Assessment
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{idea.feasibility_note}</p>
        </div>
      )}

      {/* Description */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed">{idea.description}</p>
      </div>

      {/* Key Quotes (array) */}
      {keyQuotes && keyQuotes.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-900">Key Quotes</h2>
          {keyQuotes.map((quote, i) => (
            <blockquote
              key={i}
              className="border-l-4 pl-4 italic text-gray-600"
              style={{ borderColor: "#FFB612" }}
            >
              {quote}
            </blockquote>
          ))}
        </div>
      )}

      {/* Key Quote (single, fallback) */}
      {!keyQuotes?.length && idea.key_quote && (
        <blockquote className="border-l-4 border-sa-gold pl-4 italic text-gray-600">
          {idea.key_quote}
        </blockquote>
      )}

      {/* Implementation Plan */}
      {plan && (
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Implementation Roadmap</h2>
          {plan.roadmap_summary && (
            <p className="text-sm text-gray-700">{plan.roadmap_summary}</p>
          )}

          {plan.implementation_steps?.length > 0 && (
            <div className="space-y-4 pt-2">
              {plan.implementation_steps.map((step, i) => (
                <ImplementationStep key={i} step={step} index={i} />
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 pt-2 text-sm">
            {plan.estimated_timeline && (
              <div>
                <span className="text-gray-500 text-xs">Timeline</span>
                <p className="font-medium">{plan.estimated_timeline}</p>
              </div>
            )}
            {plan.estimated_cost && (
              <div>
                <span className="text-gray-500 text-xs">Estimated Cost</span>
                <p className="font-medium">{plan.estimated_cost}</p>
              </div>
            )}
          </div>

          {plan.required_legislation && (
            <div>
              <span className="text-xs text-gray-500">Required Legislation</span>
              <p className="text-sm mt-0.5">{plan.required_legislation}</p>
            </div>
          )}

          {plan.political_feasibility_notes && (
            <div
              className="rounded-lg border-l-4 p-3"
              style={{ backgroundColor: "#fffbeb", borderColor: "#FFB612" }}
            >
              <span className="text-xs font-medium" style={{ color: "#92600a" }}>
                Political Feasibility
              </span>
              <p className="text-sm mt-0.5 text-gray-700">{plan.political_feasibility_notes}</p>
            </div>
          )}

          {plan.international_precedents && (
            <div>
              <span className="text-xs text-gray-500">International Precedents</span>
              <p className="text-sm mt-0.5">{plan.international_precedents}</p>
            </div>
          )}
        </div>
      )}

      {/* International Comparisons */}
      {comparisons.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-semibold text-gray-900">International Comparisons</h2>
            <Link href="/comparisons" className="text-xs text-sa-green hover:underline">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {comparisons.map((c: any) => (
              <div key={c.id} className="card space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2">
                  {c.iso3 && ISO3_FLAG[c.iso3] && (
                    <span className="text-lg leading-none">{ISO3_FLAG[c.iso3]}</span>
                  )}
                  <span className="font-semibold text-sm text-gray-900">{c.country}</span>
                  {c.reform_year && (
                    <span className="text-xs text-gray-400">{c.reform_year}</span>
                  )}
                  {/* GDP impact pill */}
                  {c.gdp_impact && (
                    <span className="ml-auto text-[11px] font-medium rounded-full px-2 py-0.5 bg-green-50 text-green-800 ring-1 ring-green-200 flex-shrink-0">
                      📈 {c.gdp_impact}
                    </span>
                  )}
                </div>

                {/* Outcome summary */}
                <p className="text-sm text-gray-700 leading-relaxed">{c.outcome_summary}</p>

                {/* Approach (shown when rich data available) */}
                {c.approach && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Approach</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{c.approach}</p>
                  </div>
                )}

                {/* Timeline */}
                {c.timeline && (
                  <p className="text-xs text-gray-500">
                    <span className="font-medium text-gray-600">Timeline: </span>{c.timeline}
                  </p>
                )}

                {/* Lessons for SA */}
                {c.lessons_for_sa && (
                  <div
                    className="rounded-lg p-3"
                    style={{ backgroundColor: "#fffbeb", borderLeft: "3px solid #FFB612" }}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#92600a" }}>
                      Lessons for South Africa
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">{c.lessons_for_sa}</p>
                  </div>
                )}

                {/* Sources */}
                {(c.sources?.length || c.source_label) && (
                  <div className="text-xs text-gray-400 space-y-0.5">
                    {c.sources?.length ? (
                      c.sources.map((s: string, i: number) => <p key={i}>· {s}</p>)
                    ) : c.source_url ? (
                      <a
                        href={c.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-sa-green hover:underline"
                      >
                        {c.source_label}
                      </a>
                    ) : (
                      <span>{c.source_label}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Reforms */}
      {relatedIdeas.length > 0 && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Related Reforms in Package</h2>
          <div className="space-y-2">
            {relatedIdeas.slice(0, 6).map((related: any) => (
              <Link
                key={related.id}
                href={`/ideas/${related.slug}`}
                className="card flex items-center justify-between group hover:border-sa-green transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-sa-green">
                    {related.title}
                  </p>
                  <div className="flex gap-2 mt-0.5">
                    {related.current_status && (
                      <span className="text-xs text-gray-400">{related.current_status}</span>
                    )}
                    {related.time_horizon && (
                      <TimeHorizonBadge horizon={related.time_horizon} />
                    )}
                  </div>
                </div>
                <span className="text-xs text-sa-green flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
          {relatedIdeas.length > 6 && idea.reform_package && (
            <Link
              href={`/ideas?package=${idea.reform_package}`}
              className="mt-3 inline-block text-sm text-sa-green hover:underline"
            >
              View all {relatedIdeas.length + 1} reforms in this package →
            </Link>
          )}
        </div>
      )}

      {/* Citation */}
      <CitationWidget title={idea.title} slug={idea.slug || slugify(idea.title)} />

      {/* Source Meetings / Timeline */}
      {meetings.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Discussion Timeline</h2>
            <span className="text-xs text-gray-400">{meetings.length} meeting{meetings.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="space-y-2">
            {meetings.map((meeting) => (
              <a
                key={meeting.id}
                href={meeting.pmg_url?.replace(/https?:\/\/api\.pmg\.org\.za\//g, "https://pmg.org.za/")}
                target="_blank"
                rel="noopener noreferrer"
                className="card flex items-center justify-between group"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 group-hover:text-sa-green">
                    {meeting.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {meeting.committee_name} · {fmtMonthYear(meeting.date)}
                  </p>
                </div>
                <span className="text-xs text-sa-green">PMG ↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
