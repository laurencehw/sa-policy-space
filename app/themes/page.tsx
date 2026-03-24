export const dynamic = "force-dynamic";

import Link from "next/link";
import { CONSTRAINT_LABELS, CONSTRAINT_COLORS, type BindingConstraint } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────

interface ConstraintSummary {
  binding_constraint: BindingConstraint;
  total_ideas: number;
  avg_growth_impact: number;
  stalled_count: number;
  implemented_count: number;
}

// ── Data fetching ──────────────────────────────────────────────────────────

async function getConstraintSummaries(): Promise<ConstraintSummary[]> {
  const isLocal = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (isLocal) {
    const { getConstraintSummaries: localSummaries } = await import("@/lib/local-api");
    const rows = localSummaries();
    // Merge with full constraint list so every constraint appears even if no ideas yet
    const byKey = Object.fromEntries(rows.map((r) => [r.binding_constraint, r]));
    return (Object.keys(CONSTRAINT_LABELS) as BindingConstraint[]).map((c) => ({
      binding_constraint: c,
      total_ideas: byKey[c]?.total_ideas ?? 0,
      avg_growth_impact: byKey[c]?.avg_growth_impact ?? 0,
      stalled_count: byKey[c]?.stalled_count ?? 0,
      implemented_count: byKey[c]?.implemented_count ?? 0,
    }));
  }

  const { getConstraintSummaries: supabaseSummaries } = await import("@/lib/supabase-api");
  const rows = await supabaseSummaries();
  const byKey = Object.fromEntries(rows.map((r) => [r.binding_constraint, r]));
  return (Object.keys(CONSTRAINT_LABELS) as BindingConstraint[]).map((c) => ({
    binding_constraint: c,
    total_ideas: byKey[c]?.total_ideas ?? 0,
    avg_growth_impact: byKey[c]?.avg_growth_impact ?? 0,
    stalled_count: byKey[c]?.stalled_count ?? 0,
    implemented_count: byKey[c]?.implemented_count ?? 0,
  }));
}

// ── Constraint descriptions ────────────────────────────────────────────────

const CONSTRAINT_DESCRIPTIONS: Record<BindingConstraint, string> = {
  energy: "Load-shedding, generation capacity, renewable transition, Eskom reform.",
  logistics: "Freight rail, port efficiency, road freight, Transnet.",
  skills: "Technical education, artisan pipelines, university throughput, brain drain.",
  regulation: "Business licensing, sector-specific red tape, municipal compliance costs.",
  crime: "Business crime, logistics theft, gender-based violence, policing capacity.",
  labor_market: "Hire-fire costs, sectoral minimum wages, youth employment, NEETS.",
  land: "Land acquisition for industrial use, cadastral reform, spatial planning.",
  digital: "Spectrum allocation, broadband access, data centre investment.",
  government_capacity: "SOE governance, municipal competency, procurement reform.",
  corruption: "Anti-corruption institutions, SIU capacity, procurement integrity.",
};

// ── Page ──────────────────────────────────────────────────────────────────

export default async function ThemesPage() {
  const summaries = await getConstraintSummaries();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse by Binding Constraint</h1>
        <p className="text-gray-500 text-sm mt-1">
          South Africa&apos;s growth constraints cluster into ten areas. Each captures
          a recurring bottleneck identified across parliamentary committees.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {summaries.map((s) => (
          <Link
            key={s.binding_constraint}
            href={`/ideas?constraint=${s.binding_constraint}`}
            className="card block space-y-3 group"
          >
            <div className="flex items-start justify-between">
              <span className={`badge ${CONSTRAINT_COLORS[s.binding_constraint]}`}>
                {CONSTRAINT_LABELS[s.binding_constraint]}
              </span>
              {s.total_ideas > 0 && (
                <span className="text-xs text-gray-400">{s.total_ideas} ideas</span>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {CONSTRAINT_DESCRIPTIONS[s.binding_constraint]}
            </p>

            {s.total_ideas > 0 && (
              <div className="flex gap-3 text-xs">
                {s.stalled_count > 0 && (
                  <span className="text-red-600">
                    {s.stalled_count} stalled
                  </span>
                )}
                {s.implemented_count > 0 && (
                  <span className="text-green-600">
                    {s.implemented_count} implemented
                  </span>
                )}
                {s.avg_growth_impact > 0 && (
                  <span className="text-gray-400">
                    avg impact {s.avg_growth_impact}/5
                  </span>
                )}
              </div>
            )}

            <div className="text-xs text-sa-green group-hover:underline">
              View ideas →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
