export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";
import textbookChapters from "@/data/textbook_chapters.json";

export const metadata: Metadata = {
  title: "Browse by Binding Constraint",
  description:
    "Explore South Africa's structural binding constraints — energy, logistics, skills, regulation, fiscal space, health systems, government capacity, and more — and the policy ideas addressing each.",
};
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

const CONSTRAINT_DESCRIPTIONS: Partial<Record<BindingConstraint, string>> = {
  energy: "Load-shedding, generation capacity, renewable transition, Eskom reform.",
  transport_logistics: "Freight rail, port efficiency, road freight, Transnet.",
  skills_education: "Technical education, artisan pipelines, university throughput, brain drain.",
  regulatory_burden: "Business licensing, sector-specific red tape, municipal compliance costs.",
  crime_safety: "Business crime, logistics theft, gender-based violence, policing capacity.",
  labour_market: "Hire-fire costs, sectoral minimum wages, youth employment, NEETS.",
  land_housing: "Land acquisition, housing delivery, spatial planning, title deeds.",
  digital_infrastructure: "Spectrum allocation, broadband access, data centre investment.",
  government_capacity: "SOE governance, municipal competency, procurement reform.",
  corruption_governance: "Anti-corruption institutions, SIU capacity, procurement integrity.",
  health_systems: "Public health infrastructure, NHI, disease burden, workforce shortages.",
  fiscal_space: "Debt sustainability, revenue mobilisation, budget allocation, fiscal consolidation.",
  financial_access: "SMME credit, banking access, fintech, FATF compliance.",
  innovation_capacity: "R&D investment, technology transfer, patent systems, CSIR capacity.",
  trade_openness: "AfCFTA, tariff policy, export competitiveness, trade facilitation.",
  climate_environment: "Just transition, carbon pricing, renewable energy, water security.",
  water: "Water infrastructure, dam capacity, municipal water delivery.",
};

// ── Chapter lookup ─────────────────────────────────────────────────────────

const chaptersByConstraint = new Map<string, { number: number; title: string; gitbook_url: string | null }[]>();
for (const ch of textbookChapters as Array<{ number: number; title: string; binding_constraints: string[]; gitbook_url: string | null }>) {
  for (const c of ch.binding_constraints) {
    if (!chaptersByConstraint.has(c)) chaptersByConstraint.set(c, []);
    chaptersByConstraint.get(c)!.push({ number: ch.number, title: ch.title, gitbook_url: ch.gitbook_url });
  }
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function ThemesPage() {
  let summaries: ConstraintSummary[] = [];
  try {
    summaries = await getConstraintSummaries();
  } catch (e) {
    console.error("[themes] data fetch failed (build-time?):", e);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse by Binding Constraint</h1>
        <p className="text-gray-500 text-sm mt-1">
          South Africa&apos;s growth constraints cluster into distinct areas. Each captures
          a recurring bottleneck identified across parliamentary committees.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {summaries.filter((s) => s.total_ideas > 0).map((s) => {
          const chapter = chaptersByConstraint.get(s.binding_constraint)?.[0];
          return (
            <div key={s.binding_constraint} className="card space-y-3">
              <Link
                href={`/ideas?constraint=${s.binding_constraint}`}
                className="block space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <span className={`badge ${CONSTRAINT_COLORS[s.binding_constraint]}`}>
                    {CONSTRAINT_LABELS[s.binding_constraint]}
                  </span>
                  <span className="text-xs text-gray-400">{s.total_ideas} ideas</span>
                </div>

                {CONSTRAINT_DESCRIPTIONS[s.binding_constraint] && (
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {CONSTRAINT_DESCRIPTIONS[s.binding_constraint]}
                  </p>
                )}

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

                <span className="text-xs text-sa-green group-hover:underline">
                  View ideas →
                </span>
              </Link>

              {chapter?.gitbook_url && (
                <a
                  href={chapter.gitbook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-[10px] text-gray-300 hover:text-sa-green transition-colors border-t border-gray-50 pt-2"
                  title={`Read: ${chapter.title}`}
                >
                  Background reading: Ch. {chapter.number} ↗
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
