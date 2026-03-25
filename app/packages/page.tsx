export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reform Packages",
  description:
    "Five coherent reform packages for South Africa — Infrastructure Unblock, SMME & Employment, Human Capital, Trade & Industry, and State Capacity — each with a theory of change and sequencing logic.",
};
import type { PackageSummary, TimeHorizonCounts } from "@/lib/local-api";

// Per-package colour scheme
const PACKAGE_STYLES: Record<number, { border: string; badge: string; icon: string }> = {
  1: { border: "border-amber-400",  badge: "bg-amber-100 text-amber-800",  icon: "bg-amber-400"  },
  2: { border: "border-blue-400",   badge: "bg-blue-100 text-blue-800",    icon: "bg-blue-400"   },
  3: { border: "border-purple-400", badge: "bg-purple-100 text-purple-800",icon: "bg-purple-400" },
  4: { border: "border-teal-400",   badge: "bg-teal-100 text-teal-800",    icon: "bg-teal-400"   },
  5: { border: "border-slate-400",  badge: "bg-slate-100 text-slate-700",  icon: "bg-slate-400"  },
};

function RatingDots({ value, max = 5, color = "bg-sa-green" }: {
  value: number;
  max?: number;
  color?: string;
}) {
  return (
    <span className="flex gap-1 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < value ? color : "bg-gray-200"}`}
        />
      ))}
    </span>
  );
}

function firstParagraph(text: string): string {
  return text.split("\n\n")[0] ?? text;
}

export default async function PackagesPage() {
  const isLocal = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  let summaries: PackageSummary[];
  let horizonCounts: Record<number, TimeHorizonCounts>;

  if (isLocal) {
    const { getPackageSummaries, getPackageTimeHorizonCounts } = await import("@/lib/local-api");
    summaries = getPackageSummaries();
    horizonCounts = getPackageTimeHorizonCounts();
  } else {
    const { getPackageSummaries, getPackageTimeHorizonCounts } = await import("@/lib/supabase-api");
    summaries = getPackageSummaries() as PackageSummary[];
    horizonCounts = await getPackageTimeHorizonCounts();
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reform Packages</h1>
        <p className="text-gray-500 text-sm mt-1">
          Five coherent bundles of policy ideas, each with a theory of change and sequencing logic.
        </p>
      </div>

      {/* Package grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {summaries.map((pkg) => {
          const style = PACKAGE_STYLES[pkg.package_id] ?? PACKAGE_STYLES[1];
          const counts: TimeHorizonCounts = horizonCounts[pkg.package_id] ?? { quick_win: 0, medium_term: 0, long_term: 0 };

          return (
            <Link
              key={pkg.package_id}
              href={`/packages/${pkg.package_id}`}
              className={`card block border-t-4 ${style.border} hover:shadow-md transition-shadow`}
            >
              {/* Package number + name */}
              <div className="flex items-start gap-3 mb-3">
                <span className={`flex-shrink-0 w-7 h-7 rounded-full ${style.icon} flex items-center justify-center text-white text-xs font-bold`}>
                  {pkg.package_id}
                </span>
                <div>
                  <h2 className="font-semibold text-gray-900 leading-tight">{pkg.name}</h2>
                  <p className="text-xs text-gray-500 mt-0.5 italic">{pkg.tagline}</p>
                </div>
              </div>

              {/* Theory of change (first paragraph) */}
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {firstParagraph(pkg.theory_of_change)}
              </p>

              {/* Stats row */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-4">
                <span className="font-medium">{pkg.idea_count} ideas</span>
                <span className="flex items-center gap-1">
                  Growth: <RatingDots value={Math.round(pkg.avg_growth_impact)} color={style.icon} />
                  <span className="text-gray-400">({pkg.avg_growth_impact.toFixed(1)})</span>
                </span>
                <span className="flex items-center gap-1">
                  Feasibility: <RatingDots value={Math.round(pkg.avg_feasibility)} color="bg-gray-400" />
                  <span className="text-gray-400">({pkg.avg_feasibility.toFixed(1)})</span>
                </span>
              </div>

              {/* Time horizon pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {counts.quick_win > 0 && (
                  <span className="badge bg-green-50 text-green-700 ring-1 ring-green-600/20">
                    {counts.quick_win} quick win{counts.quick_win !== 1 ? "s" : ""}
                  </span>
                )}
                {counts.medium_term > 0 && (
                  <span className="badge bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
                    {counts.medium_term} medium-term
                  </span>
                )}
                {counts.long_term > 0 && (
                  <span className="badge bg-purple-50 text-purple-700 ring-1 ring-purple-600/20">
                    {counts.long_term} long-term
                  </span>
                )}
              </div>

              {/* Top 3 reforms */}
              <div className="border-t border-gray-100 pt-3 space-y-1.5">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Top priorities</p>
                {pkg.top_priority_ideas.slice(0, 3).map((idea) => (
                  <div key={idea.id} className="flex items-start gap-2">
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                    <span className="text-xs text-gray-700 leading-snug">{idea.title}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-sa-green font-medium mt-4">Explore package →</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
