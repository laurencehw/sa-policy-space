"use client";

import { useState } from "react";
import Link from "next/link";
import type { SequencedReform, CriticalPathNode } from "@/lib/sequencing";

// ── Constants ──────────────────────────────────────────────────────────────

const PACKAGE_STYLES: Record<number, { border: string; dot: string; bg: string; badge: string; text: string }> = {
  1: { border: "border-amber-300",  dot: "bg-amber-400",  bg: "bg-amber-50",  badge: "bg-amber-100 text-amber-800",  text: "text-amber-800"  },
  2: { border: "border-blue-300",   dot: "bg-blue-400",   bg: "bg-blue-50",   badge: "bg-blue-100 text-blue-800",    text: "text-blue-800"   },
  3: { border: "border-purple-300", dot: "bg-purple-400", bg: "bg-purple-50", badge: "bg-purple-100 text-purple-800", text: "text-purple-800" },
  4: { border: "border-teal-300",   dot: "bg-teal-400",   bg: "bg-teal-50",   badge: "bg-teal-100 text-teal-800",    text: "text-teal-800"   },
  5: { border: "border-slate-300",  dot: "bg-slate-400",  bg: "bg-slate-50",  badge: "bg-slate-100 text-slate-700",  text: "text-slate-700"  },
};

const PACKAGE_NAMES: Record<number, string> = {
  1: "Infrastructure Unblock",
  2: "SMME & Employment",
  3: "Human Capital",
  4: "Trade & Industrial",
  5: "State Capacity",
};

const STATUS_COLORS: Record<string, string> = {
  proposed:             "bg-blue-50 text-blue-700",
  debated:              "bg-yellow-50 text-yellow-700",
  drafted:              "bg-indigo-50 text-indigo-700",
  stalled:              "bg-red-50 text-red-700",
  implemented:          "bg-green-50 text-green-700",
  under_review:         "bg-orange-50 text-orange-700",
  partially_implemented:"bg-teal-50 text-teal-700",
  abandoned:            "bg-gray-50 text-gray-600",
};

// ── Types ──────────────────────────────────────────────────────────────────

interface Props {
  waves: SequencedReform[][];
  criticalPath: CriticalPathNode[];
  bottlenecks: SequencedReform[];
  cycleNodeIds: number[];
  directLinks: Record<number, { enables: number[]; enabledBy: number[] }>;
  reformsById: Record<number, SequencedReform>;
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return null;
  const cls = STATUS_COLORS[status] ?? "bg-gray-50 text-gray-600";
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function PackageDot({ pkgId }: { pkgId: number | null }) {
  if (!pkgId) return <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />;
  const s = PACKAGE_STYLES[pkgId] ?? PACKAGE_STYLES[1];
  return <span className={`w-2 h-2 rounded-full ${s.dot} inline-block flex-shrink-0`} />;
}

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-sa-green rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] text-gray-500 tabular-nums w-5 text-right">{value}</span>
    </div>
  );
}

// ── Reform card (inside a wave column) ────────────────────────────────────

function ReformCard({
  reform,
  isOnCriticalPath,
  isBottleneck,
  isSelected,
  isHighlighted,
  onSelect,
}: {
  reform: SequencedReform;
  isOnCriticalPath: boolean;
  isBottleneck: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  onSelect: (id: number) => void;
}) {
  const pkgStyle = PACKAGE_STYLES[reform.reform_package ?? 0];
  const borderCls = isSelected
    ? "border-gray-700 shadow-md"
    : isHighlighted
    ? "border-sa-green/60 bg-green-50/50"
    : pkgStyle
    ? pkgStyle.border
    : "border-gray-200";

  return (
    <button
      onClick={() => onSelect(reform.id)}
      className={`w-full text-left rounded-lg border ${borderCls} bg-white p-2 transition-all hover:shadow-sm focus:outline-none focus:ring-1 focus:ring-sa-green/40 ${
        isSelected ? "ring-2 ring-gray-700/20" : ""
      } ${reform.in_cycle ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-1.5 mb-1">
        <PackageDot pkgId={reform.reform_package} />
        <p className="text-[11px] font-medium text-gray-900 leading-tight line-clamp-2 flex-1">
          {reform.title}
        </p>
      </div>
      <div className="flex flex-wrap gap-1 items-center">
        <StatusBadge status={reform.current_status} />
        {isOnCriticalPath && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-orange-100 text-orange-700">
            critical
          </span>
        )}
        {isBottleneck && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
            bottleneck
          </span>
        )}
        {reform.in_cycle && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-500">
            cycle
          </span>
        )}
      </div>
      {reform.downstream_count > 0 && (
        <p className="text-[10px] text-gray-400 mt-1">
          ↓ {reform.downstream_count} downstream
        </p>
      )}
    </button>
  );
}

// ── Detail panel ──────────────────────────────────────────────────────────

function DetailPanel({
  reform,
  directLinks,
  reformsById,
  criticalPathIds,
  onSelect,
  onClose,
}: {
  reform: SequencedReform;
  directLinks: Record<number, { enables: number[]; enabledBy: number[] }>;
  reformsById: Record<number, SequencedReform>;
  criticalPathIds: Set<number>;
  onSelect: (id: number) => void;
  onClose: () => void;
}) {
  const pkgStyle = PACKAGE_STYLES[reform.reform_package ?? 0];
  const links = directLinks[reform.id] ?? { enables: [], enabledBy: [] };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {pkgStyle && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pkgStyle.badge}`}>
                {PACKAGE_NAMES[reform.reform_package ?? 0] ?? `Pkg ${reform.reform_package}`}
              </span>
            )}
            <span className="text-xs text-gray-400">Wave {reform.wave + 1}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug">{reform.title}</h3>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded hover:bg-gray-100 text-gray-400"
          aria-label="Close detail panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        {[
          { label: "Priority", value: reform.priority_score },
          { label: "Downstream", value: reform.downstream_count },
          { label: "Upstream", value: reform.upstream_count },
          { label: "Feasibility", value: reform.feasibility_rating ?? "—" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-400">{label}</p>
            <p className="text-base font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 items-center text-xs">
        <StatusBadge status={reform.current_status} />
        {reform.time_horizon && (
          <span className="text-gray-400">{reform.time_horizon.replace(/_/g, " ")}</span>
        )}
        {reform.in_cycle && <span className="text-red-500 font-medium">⚠ dependency cycle</span>}
        {criticalPathIds.has(reform.id) && (
          <span className="text-orange-600 font-medium">★ on critical path</span>
        )}
      </div>

      {/* What this enables */}
      {links.enables.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">
            Enables ({links.enables.length})
          </p>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {links.enables.map((targetId) => {
              const t = reformsById[targetId];
              if (!t) return null;
              return (
                <button
                  key={targetId}
                  onClick={() => onSelect(targetId)}
                  className="w-full text-left flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <PackageDot pkgId={t.reform_package} />
                  <span className="text-xs text-gray-700 line-clamp-1 flex-1">{t.title}</span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">Wave {t.wave + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* What this depends on */}
      {links.enabledBy.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5">
            Depends on ({links.enabledBy.length})
          </p>
          <div className="space-y-1 max-h-36 overflow-y-auto">
            {links.enabledBy.map((sourceId) => {
              const s = reformsById[sourceId];
              if (!s) return null;
              return (
                <button
                  key={sourceId}
                  onClick={() => onSelect(sourceId)}
                  className="w-full text-left flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <PackageDot pkgId={s.reform_package} />
                  <span className="text-xs text-gray-700 line-clamp-1 flex-1">{s.title}</span>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">Wave {s.wave + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Link
        href={`/ideas/${reform.id}`}
        className="block text-center text-xs text-sa-green hover:text-sa-green/80 font-medium border border-sa-green/30 rounded-lg py-1.5 hover:bg-sa-green/5 transition-colors"
      >
        View full detail →
      </Link>
    </div>
  );
}

// ── Wave column ──────────────────────────────────────────────────────────

function WaveColumn({
  waveIndex,
  reforms,
  criticalPathIds,
  bottleneckIds,
  selectedId,
  highlightedIds,
  onSelect,
}: {
  waveIndex: number;
  reforms: SequencedReform[];
  criticalPathIds: Set<number>;
  bottleneckIds: Set<number>;
  selectedId: number | null;
  highlightedIds: Set<number>;
  onSelect: (id: number) => void;
}) {
  const hasCritical = reforms.some((r) => criticalPathIds.has(r.id));
  const pkgCounts: Record<number, number> = {};
  for (const r of reforms) {
    if (r.reform_package) pkgCounts[r.reform_package] = (pkgCounts[r.reform_package] ?? 0) + 1;
  }

  return (
    <div className="flex-shrink-0 w-56">
      <div className={`mb-2 rounded-lg px-3 py-2 ${hasCritical ? "bg-orange-50 border border-orange-200" : "bg-gray-50 border border-gray-200"}`}>
        <p className={`text-xs font-semibold ${hasCritical ? "text-orange-700" : "text-gray-700"}`}>
          Wave {waveIndex + 1}
          {hasCritical && <span className="ml-1 text-[10px]">★ critical</span>}
        </p>
        <p className="text-[10px] text-gray-500 mt-0.5">{reforms.length} reform{reforms.length !== 1 ? "s" : ""}</p>
        {/* Package colour breakdown */}
        <div className="flex gap-1 mt-1.5">
          {Object.entries(pkgCounts).map(([pkg, count]) => {
            const s = PACKAGE_STYLES[+pkg];
            return s ? (
              <span
                key={pkg}
                title={PACKAGE_NAMES[+pkg]}
                className={`text-[9px] font-medium px-1 py-0.5 rounded ${s.badge}`}
              >
                {count}
              </span>
            ) : null;
          })}
        </div>
      </div>
      <div className="space-y-1.5">
        {reforms.map((r) => (
          <ReformCard
            key={r.id}
            reform={r}
            isOnCriticalPath={criticalPathIds.has(r.id)}
            isBottleneck={bottleneckIds.has(r.id)}
            isSelected={selectedId === r.id}
            isHighlighted={highlightedIds.has(r.id)}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────

export default function SequencingClient({
  waves,
  criticalPath,
  bottlenecks,
  cycleNodeIds,
  directLinks,
  reformsById,
}: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [packageFilter, setPackageFilter] = useState<number | null>(null);

  const criticalPathIds = new Set(criticalPath.map((n) => n.id));
  const bottleneckIds = new Set(bottlenecks.map((b) => b.id));

  // When a reform is selected, highlight its direct neighbours
  const highlightedIds = new Set<number>();
  if (selectedId !== null) {
    const links = directLinks[selectedId];
    if (links) {
      for (const id of links.enables) highlightedIds.add(id);
      for (const id of links.enabledBy) highlightedIds.add(id);
    }
  }

  const selectedReform = selectedId !== null ? reformsById[selectedId] ?? null : null;

  function handleSelect(id: number) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  // Filter waves by package if a filter is active
  const filteredWaves = packageFilter
    ? waves.map((w) => w.filter((r) => r.reform_package === packageFilter))
    : waves;

  const totalReforms = waves.flat().length;

  return (
    <div className="space-y-8">

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Reforms", value: totalReforms },
          { label: "Waves", value: waves.filter((w) => w.length > 0).length },
          { label: "Critical Path Length", value: criticalPath.length },
          { label: "Bottleneck Reforms", value: bottlenecks.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Package filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-gray-500 font-medium">Filter by package:</span>
        <button
          onClick={() => setPackageFilter(null)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            packageFilter === null
              ? "bg-gray-800 text-white border-gray-800"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        {Object.entries(PACKAGE_NAMES).map(([id, name]) => {
          const s = PACKAGE_STYLES[+id];
          return (
            <button
              key={id}
              onClick={() => setPackageFilter(packageFilter === +id ? null : +id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                packageFilter === +id
                  ? `${s.badge} border-transparent`
                  : `bg-white text-gray-600 border-gray-200 hover:bg-gray-50`
              }`}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-[11px] text-gray-500 items-center">
        <span className="font-medium text-gray-600">Legend:</span>
        <span className="flex items-center gap-1"><span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">critical</span> on critical path</span>
        <span className="flex items-center gap-1"><span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded">bottleneck</span> blocks most downstream</span>
        <span className="flex items-center gap-1"><span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">cycle</span> in dependency cycle</span>
        <span className="text-gray-400">Click any reform to see its dependencies.</span>
      </div>

      {/* Main layout: waves + detail panel */}
      <div className="flex gap-4">

        {/* Wave swimlanes — horizontal scroll */}
        <div className="flex-1 min-w-0">
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3" style={{ minWidth: `${filteredWaves.filter(w => w.length > 0).length * 232}px` }}>
              {filteredWaves.map((waveReforms, waveIndex) => {
                if (waveReforms.length === 0) return null;
                return (
                  <WaveColumn
                    key={waveIndex}
                    waveIndex={waveIndex}
                    reforms={waveReforms}
                    criticalPathIds={criticalPathIds}
                    bottleneckIds={bottleneckIds}
                    selectedId={selectedId}
                    highlightedIds={highlightedIds}
                    onSelect={handleSelect}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Detail panel — sticky on the right */}
        {selectedReform && (
          <div className="w-72 flex-shrink-0 hidden lg:block">
            <div className="sticky top-20">
              <DetailPanel
                reform={selectedReform}
                directLinks={directLinks}
                reformsById={reformsById}
                criticalPathIds={criticalPathIds}
                onSelect={handleSelect}
                onClose={() => setSelectedId(null)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile detail panel — appears below swimlanes */}
      {selectedReform && (
        <div className="lg:hidden">
          <DetailPanel
            reform={selectedReform}
            directLinks={directLinks}
            reformsById={reformsById}
            criticalPathIds={criticalPathIds}
            onSelect={handleSelect}
            onClose={() => setSelectedId(null)}
          />
        </div>
      )}

      {/* Critical path section */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Critical Path</h2>
        <p className="text-sm text-gray-500 mb-4">
          Longest sequential dependency chain — {criticalPath.length} steps. Delays anywhere along this chain delay all subsequent reforms.
        </p>
        <div className="overflow-x-auto pb-2">
          <div className="flex items-start gap-0 min-w-max">
            {criticalPath.map((node, i) => {
              const r = reformsById[node.id];
              const pkgStyle = r ? PACKAGE_STYLES[r.reform_package ?? 0] : null;
              return (
                <div key={node.id} className="flex items-center">
                  <button
                    onClick={() => handleSelect(node.id)}
                    className={`w-40 rounded-lg border p-2 text-left transition-all hover:shadow-sm ${
                      pkgStyle ? pkgStyle.border + " " + pkgStyle.bg : "border-gray-200 bg-gray-50"
                    } ${selectedId === node.id ? "ring-2 ring-gray-700/20 shadow" : ""}`}
                  >
                    <p className="text-[10px] text-gray-400 mb-0.5">Wave {node.wave + 1}</p>
                    <p className="text-xs font-medium text-gray-900 leading-tight line-clamp-2">{node.title}</p>
                  </button>
                  {i < criticalPath.length - 1 && (
                    <div className="flex items-center px-1 text-gray-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottleneck table */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-1">Bottleneck Reforms</h2>
        <p className="text-sm text-gray-500 mb-4">
          Reforms that block the most downstream activity. Prioritise these to unblock the broadest set of subsequent reforms.
        </p>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2.5 text-gray-500 font-medium w-8">#</th>
                <th className="text-left px-3 py-2.5 text-gray-500 font-medium">Reform</th>
                <th className="text-center px-3 py-2.5 text-gray-500 font-medium hidden sm:table-cell w-16">Wave</th>
                <th className="text-left px-3 py-2.5 text-gray-500 font-medium hidden md:table-cell w-36">Priority</th>
                <th className="text-center px-3 py-2.5 text-gray-500 font-medium w-24">Downstream</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bottlenecks.map((r, i) => (
                <tr
                  key={r.id}
                  className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleSelect(r.id)}
                >
                  <td className="px-3 py-2.5 text-gray-400 text-xs tabular-nums">{i + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <PackageDot pkgId={r.reform_package} />
                      <span className="font-medium text-gray-900 text-xs line-clamp-2 leading-snug">
                        {r.title}
                      </span>
                    </div>
                    {criticalPathIds.has(r.id) && (
                      <span className="text-[10px] text-orange-600 font-medium ml-3.5">★ critical path</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-center hidden sm:table-cell">
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
                      {r.wave + 1}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell w-36">
                    <ScoreBar value={r.priority_score} />
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <span className="text-sm font-semibold text-gray-900">{r.downstream_count}</span>
                    <p className="text-[10px] text-gray-400">reforms</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Cycle notice */}
      {cycleNodeIds.length > 0 && (
        <section className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            {cycleNodeIds.length} Reform{cycleNodeIds.length !== 1 ? "s" : ""} in Dependency Cycles
          </h3>
          <p className="text-xs text-yellow-700">
            These reforms have circular dependencies and have been placed at the end of the wave sequence.
            They are marked with a "cycle" badge and excluded from the critical path calculation.
          </p>
        </section>
      )}

      {/* Package breakdown table */}
      <section>
        <h2 className="text-base font-semibold text-gray-900 mb-4">Reform Distribution by Package &amp; Wave</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-3 py-2 text-gray-500 font-medium">Package</th>
                {waves.map((_, i) => (
                  waves[i].length > 0 ? (
                    <th key={i} className="text-center px-2 py-2 text-gray-500 font-medium w-16">
                      W{i + 1}
                    </th>
                  ) : null
                ))}
                <th className="text-center px-3 py-2 text-gray-500 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Object.entries(PACKAGE_NAMES).map(([pkgId, name]) => {
                const s = PACKAGE_STYLES[+pkgId];
                const total = waves.flat().filter((r) => r.reform_package === +pkgId).length;
                return (
                  <tr key={pkgId} className="bg-white hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${s.text}`}>
                        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                        {name}
                      </span>
                    </td>
                    {waves.map((wave, wi) => {
                      if (wave.length === 0) return null;
                      const count = wave.filter((r) => r.reform_package === +pkgId).length;
                      return (
                        <td key={wi} className="px-2 py-2 text-center">
                          {count > 0 ? (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${s.badge}`}>
                              {count}
                            </span>
                          ) : (
                            <span className="text-gray-200">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center font-semibold text-gray-700">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
