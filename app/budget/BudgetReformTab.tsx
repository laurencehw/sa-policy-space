"use client";

/**
 * Extracted from the original /budget page.tsx — renders the hardcoded
 * reform package budget alignment analysis from budget_alignment.json.
 * Pure extraction, zero logic changes.
 */

// ── Types ──────────────────────────────────────────────────────────────────

interface LineItem {
  item: string;
  allocated: number;
  recommended: number;
  department: string;
  funding_status: string;
  notes: string;
}

interface PackageBudget {
  package_id: number;
  package_name: string;
  budget_allocated: number;
  budget_recommended: number;
  gap_percentage: number;
  funding_status: string;
  summary: string;
  key_line_items: LineItem[];
}

interface ReformData {
  metadata: {
    source: string;
    base_year: string;
    currency: string;
    last_updated: string;
    notes: string;
  };
  packages: PackageBudget[];
}

// ── Style helpers ──────────────────────────────────────────────────────────

const PACKAGE_STYLES: Record<number, { border: string; bar: string; badge: string; dot: string }> = {
  1: { border: "border-amber-300",  bar: "bg-amber-400",  badge: "bg-amber-100 text-amber-800",  dot: "bg-amber-400"  },
  2: { border: "border-blue-300",   bar: "bg-blue-400",   badge: "bg-blue-100 text-blue-800",    dot: "bg-blue-400"   },
  3: { border: "border-purple-300", bar: "bg-purple-400", badge: "bg-purple-100 text-purple-800",dot: "bg-purple-400" },
  4: { border: "border-teal-300",   bar: "bg-teal-400",   badge: "bg-teal-100 text-teal-800",    dot: "bg-teal-400"   },
  5: { border: "border-slate-300",  bar: "bg-slate-400",  badge: "bg-slate-100 text-slate-700",  dot: "bg-slate-400"  },
};

const FUNDING_STATUS_CONFIG: Record<string, { label: string; badge: string }> = {
  funded:           { label: "Funded",           badge: "bg-green-100 text-green-800 ring-green-200" },
  partially_funded: { label: "Partially Funded", badge: "bg-amber-100 text-amber-800 ring-amber-200" },
  unfunded:         { label: "Unfunded",         badge: "bg-red-100 text-red-800 ring-red-200" },
  over_funded:      { label: "Over-funded",      badge: "bg-blue-100 text-blue-800 ring-blue-200" },
};

function fmt(n: number) {
  return `R${n.toFixed(1)}bn`;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function BudgetReformTab({ reformData }: { reformData: ReformData }) {
  const packages = reformData.packages as PackageBudget[];
  const meta = reformData.metadata;

  const totalAllocated = packages.reduce((s, p) => s + p.budget_allocated, 0);
  const totalRecommended = packages.reduce((s, p) => s + p.budget_recommended, 0);
  const totalGap = totalRecommended - totalAllocated;
  const overallGapPct = ((totalGap / totalRecommended) * 100).toFixed(1);

  const fundedCount = packages.filter((p) => p.funding_status === "funded").length;
  const partialCount = packages.filter((p) => p.funding_status === "partially_funded").length;
  const unfundedCount = packages.filter((p) => p.funding_status === "unfunded").length;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-sa-green">{fmt(totalAllocated)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Allocated</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-700">{fmt(totalRecommended)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Recommended</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-sa-red">{fmt(totalGap)}</div>
          <div className="text-xs text-gray-500 mt-1">Funding Gap ({overallGapPct}%)</div>
        </div>
        <div className="card text-center">
          <div className="text-sm font-bold text-gray-700 mt-1 space-y-0.5">
            <div><span className="text-green-600">{fundedCount}</span> funded</div>
            <div><span className="text-amber-600">{partialCount}</span> partial</div>
            <div><span className="text-red-500">{unfundedCount}</span> unfunded</div>
          </div>
          <div className="text-xs text-gray-500 mt-1">Package Status</div>
        </div>
      </div>

      {/* Per-Package Funding Bars */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Funding Status by Reform Package
        </h2>
        <div className="space-y-5">
          {packages.map((pkg) => {
            const style = PACKAGE_STYLES[pkg.package_id] ?? PACKAGE_STYLES[1];
            const fsCfg = FUNDING_STATUS_CONFIG[pkg.funding_status] ?? FUNDING_STATUS_CONFIG.partially_funded;
            const pct = Math.min((pkg.budget_allocated / pkg.budget_recommended) * 100, 100);
            return (
              <div key={pkg.package_id}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full ${style.dot} flex items-center justify-center text-white text-xs font-bold`}>
                      {pkg.package_id}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{pkg.package_name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={`badge ring-1 ${fsCfg.badge}`}>{fsCfg.label}</span>
                    <span>{fmt(pkg.budget_allocated)} / {fmt(pkg.budget_recommended)}</span>
                    <span className="font-medium text-gray-700">{pct.toFixed(0)}% funded</span>
                  </div>
                </div>
                <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-3 rounded-full ${style.bar}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{pkg.summary}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funded vs Unfunded Split */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
            Well-Funded Line Items
          </h3>
          <div className="space-y-2">
            {packages.flatMap((pkg) =>
              pkg.key_line_items
                .filter((li) => li.funding_status === "funded")
                .map((li) => (
                  <div key={li.item} className="flex items-start justify-between gap-2">
                    <span className="text-xs text-green-800">{li.item}</span>
                    <span className="text-xs font-medium text-green-700 flex-shrink-0">{fmt(li.allocated)}</span>
                  </div>
                ))
            )}
            {packages.flatMap((pkg) =>
              pkg.key_line_items.filter((li) => li.funding_status === "funded")
            ).length === 0 && (
              <p className="text-xs text-green-700">No fully-funded line items.</p>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
            Largest Funding Gaps
          </h3>
          <div className="space-y-2">
            {packages
              .flatMap((pkg) =>
                pkg.key_line_items
                  .filter((li) => li.funding_status !== "funded")
                  .map((li) => ({
                    ...li,
                    gap: li.recommended - li.allocated,
                    package_name: pkg.package_name,
                  }))
              )
              .sort((a, b) => b.gap - a.gap)
              .slice(0, 6)
              .map((li) => (
                <div key={li.item} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs text-red-800 line-clamp-1">{li.item}</span>
                    <span className="text-[10px] text-red-500">{li.package_name}</span>
                  </div>
                  <span className="text-xs font-medium text-red-700 flex-shrink-0">{fmt(li.gap)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Line Item Table by Package */}
      {packages.map((pkg) => {
        const style = PACKAGE_STYLES[pkg.package_id] ?? PACKAGE_STYLES[1];
        return (
          <div key={pkg.package_id} className={`card border-t-4 ${style.border} p-0 overflow-hidden`}>
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full ${style.dot} flex items-center justify-center text-white text-xs font-bold`}>
                  {pkg.package_id}
                </span>
                <h3 className="font-semibold text-gray-900">{pkg.package_name}</h3>
                <span className="text-sm text-gray-500 ml-auto">
                  Gap: {fmt(pkg.budget_recommended - pkg.budget_allocated)} ({pkg.gap_percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wide">
                    <th className="text-left px-4 py-2 font-medium">Line Item</th>
                    <th className="text-right px-3 py-2 font-medium">Allocated</th>
                    <th className="text-right px-3 py-2 font-medium">Recommended</th>
                    <th className="text-right px-3 py-2 font-medium">Gap</th>
                    <th className="text-left px-3 py-2 font-medium hidden md:table-cell">Department</th>
                    <th className="text-center px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pkg.key_line_items.map((li, i) => {
                    const gap = li.recommended - li.allocated;
                    const fsCfg = FUNDING_STATUS_CONFIG[li.funding_status] ?? FUNDING_STATUS_CONFIG.partially_funded;
                    return (
                      <tr key={i} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{li.item}</div>
                          <div className="text-gray-400 mt-0.5 leading-relaxed hidden sm:block">{li.notes}</div>
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-gray-700 whitespace-nowrap">
                          {fmt(li.allocated)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-gray-500 whitespace-nowrap">
                          {fmt(li.recommended)}
                        </td>
                        <td className={`px-3 py-3 text-right font-mono font-medium whitespace-nowrap ${gap > 0 ? "text-red-600" : "text-green-600"}`}>
                          {gap > 0 ? `−${fmt(gap)}` : `+${fmt(Math.abs(gap))}`}
                        </td>
                        <td className="px-3 py-3 text-gray-500 hidden md:table-cell max-w-[200px]">
                          <span className="line-clamp-2">{li.department}</span>
                        </td>
                        <td className="px-3 py-3 text-center">
                          <span className={`badge ring-1 text-[10px] ${fsCfg.badge}`}>{fsCfg.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td className="px-4 py-2 font-semibold text-gray-700">Package Total</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-sa-green">{fmt(pkg.budget_allocated)}</td>
                    <td className="px-3 py-2 text-right font-mono text-gray-500">{fmt(pkg.budget_recommended)}</td>
                    <td className="px-3 py-2 text-right font-mono font-semibold text-red-600">{fmt(pkg.budget_recommended - pkg.budget_allocated)}</td>
                    <td className="hidden md:table-cell" />
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      })}

      {/* Methodology Note */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">Methodology Note</p>
        <p>{meta.notes}</p>
        <p className="mt-1">
          Sources: {meta.source}. Currency: {meta.currency}. Base year: {meta.base_year}.
        </p>
      </div>
    </div>
  );
}
