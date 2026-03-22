import Link from "next/link";
import { CONSTRAINT_LABELS, type BindingConstraint } from "@/lib/supabase";

// ── Data fetching ──────────────────────────────────────────────────────────

const isLocal = !process.env.NEXT_PUBLIC_SUPABASE_URL;

const PACKAGE_STYLES: Record<number, { border: string; dot: string }> = {
  1: { border: "border-amber-300",  dot: "bg-amber-400"  },
  2: { border: "border-blue-300",   dot: "bg-blue-400"   },
  3: { border: "border-purple-300", dot: "bg-purple-400" },
  4: { border: "border-teal-300",   dot: "bg-teal-400"   },
  5: { border: "border-slate-300",  dot: "bg-slate-400"  },
};

async function getDashboardData() {
  if (!isLocal) {
    return {
      stats: { totalIdeas: 0, meetingsAnalyzed: 0, constraintsCovered: 0 },
      featuredIdeas: [] as Array<{
        id: number; title: string; binding_constraint: BindingConstraint;
        growth_impact_rating: number; current_status: string; description: string;
      }>,
      stalledIdeas: [] as Array<{ id: number; title: string; times_raised: number; responsible_department: string }>,
      packageSummaries: [] as Array<{ package_id: number; name: string; tagline: string; idea_count: number; avg_growth_impact: number }>,
    };
  }

  const { getStats, getIdeas, getPackageSummaries } = await import("@/lib/local-api");
  const stats = getStats();
  const topIdeas = getIdeas({ sort: "impact" }).slice(0, 6);
  const stalledIdeas = getIdeas({ status: "stalled" }).slice(0, 5);
  const packageSummaries = getPackageSummaries();

  return {
    stats,
    featuredIdeas: topIdeas as Array<{
      id: number; title: string; binding_constraint: BindingConstraint;
      growth_impact_rating: number; current_status: string; description: string;
    }>,
    stalledIdeas: stalledIdeas as Array<{
      id: number; title: string; times_raised: number; responsible_department: string;
    }>,
    packageSummaries,
  };
}

// ── Rating dots component ──────────────────────────────────────────────────

function RatingDots({ value, max = 5, color = "bg-sa-green" }: {
  value: number;
  max?: number;
  color?: string;
}) {
  return (
    <span className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`rating-dot ${i < value ? color : "bg-gray-200"}`}
        />
      ))}
    </span>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { stats, featuredIdeas, stalledIdeas, packageSummaries } = await getDashboardData();

  return (
    <div className="space-y-10">

      {/* Hero */}
      <section className="py-8 sm:py-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge bg-sa-green/10 text-sa-green ring-sa-green/20">
              Beta
            </span>
            <span className="text-sm text-gray-500">Parliamentary intelligence for growth</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
            SA Policy Space:<br />
            <span className="text-sa-green">Ideas for Growth</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Tracking policy ideas that emerge from South African parliamentary
            committee proceedings — curated, assessed, and held accountable.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/ideas" className="btn-primary">Browse Ideas</Link>
            <Link href="/packages" className="btn-secondary">Reform Packages</Link>
            <Link href="/themes" className="btn-secondary">By Binding Constraint</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Policy Ideas", value: stats.totalIdeas },
            { label: "Meetings Analysed", value: stats.meetingsAnalyzed },
            { label: "Constraints Covered", value: stats.constraintsCovered },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <div className="text-2xl sm:text-3xl font-bold text-sa-green">
                {s.value > 0 ? s.value.toLocaleString() : "—"}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured High-Impact Ideas */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">High-Impact Ideas</h2>
          <Link href="/ideas?sort=impact" className="text-sm text-sa-green hover:underline">
            View all →
          </Link>
        </div>
        {featuredIdeas.length === 0 ? (
          <div className="card text-center py-10 text-gray-400">
            <p className="text-sm">No ideas seeded yet.</p>
            <p className="text-xs mt-1">
              Add entries to the{" "}
              <code className="bg-gray-100 px-1 rounded">policy_ideas</code> table to populate this section.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredIdeas.map((idea) => (
              <Link key={idea.id} href={`/ideas/${idea.id}`} className="card block">
                <div className="flex items-center justify-between mb-2">
                  <span className="badge bg-gray-100 text-gray-700 ring-gray-200">
                    {CONSTRAINT_LABELS[idea.binding_constraint as BindingConstraint]}
                  </span>
                  <RatingDots value={idea.growth_impact_rating} />
                </div>
                <h3 className="font-medium text-gray-900 text-sm leading-snug mb-1">
                  {idea.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{idea.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Reform Packages */}
      {packageSummaries.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Reform Packages</h2>
            <Link href="/packages" className="text-sm text-sa-green hover:underline">
              View all packages →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {packageSummaries.map((pkg) => {
              const style = PACKAGE_STYLES[pkg.package_id] ?? PACKAGE_STYLES[1];
              return (
                <Link
                  key={pkg.package_id}
                  href={`/packages/${pkg.package_id}`}
                  className={`card block border-t-4 ${style.border} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-5 h-5 rounded-full ${style.dot} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {pkg.package_id}
                    </span>
                    <h3 className="font-medium text-gray-900 text-sm leading-tight">{pkg.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 italic mb-2">{pkg.tagline}</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">{pkg.idea_count}</span> ideas &middot; growth {pkg.avg_growth_impact.toFixed(1)}/5
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Stalled Ideas Callout */}
      <section className="rounded-xl border-l-4 border-sa-red bg-red-50 p-5">
        <h2 className="font-semibold text-red-900 mb-1">⚠ Stalled Ideas</h2>
        <p className="text-sm text-red-800 mb-4">
          These proposals have been raised repeatedly in committee but remain unimplemented.
        </p>
        {stalledIdeas.length === 0 ? (
          <p className="text-xs text-red-600">
            None catalogued yet —{" "}
            <Link href="/ideas?status=stalled" className="underline">
              check back as we seed the data
            </Link>.
          </p>
        ) : (
          <ul className="space-y-2">
            {stalledIdeas.map((idea) => (
              <li key={idea.id} className="flex items-center justify-between">
                <Link href={`/ideas/${idea.id}`} className="text-sm text-red-900 hover:underline">
                  {idea.title}
                </Link>
                <span className="text-xs text-red-600">
                  Raised {idea.times_raised}× — {idea.responsible_department}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

    </div>
  );
}
