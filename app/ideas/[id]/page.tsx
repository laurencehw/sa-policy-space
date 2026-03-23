export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/utils";
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

function fmtMonthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

// ── Sub-components ─────────────────────────────────────────────────────────

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

  const [plan, meetings] = await Promise.all([
    getImplementationPlan(idea.id),
    getSourceMeetings(idea.id),
  ]);

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
          <span className={`badge ring-1 ${STATUS_COLORS[idea.current_status]}`}>
            {idea.current_status}
          </span>
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

      {/* Ratings */}
      <div className="card space-y-3">
        <h2 className="font-semibold text-sm text-gray-700">Assessment</h2>
        <RatingIndicator label="Growth Impact" value={idea.growth_impact_rating} />
        <RatingIndicator label="Feasibility" value={idea.feasibility_rating} />
        {idea.responsible_department && (
          <p className="text-xs text-gray-500 pt-1">
            Responsible: <span className="font-medium text-gray-700">{idea.responsible_department}</span>
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed">{idea.description}</p>
      </div>

      {/* Key Quote */}
      {idea.key_quote && (
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

          {plan.international_precedents && (
            <div>
              <span className="text-xs text-gray-500">International Precedents</span>
              <p className="text-sm mt-0.5">{plan.international_precedents}</p>
            </div>
          )}
        </div>
      )}

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
                href={meeting.pmg_url?.replace("https://api.pmg.org.za/", "https://pmg.org.za/")}
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
