"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import stakeholdersData from "@/data/stakeholders.json";

type Category =
  | "Government"
  | "Regulator"
  | "SOE"
  | "Private Sector"
  | "Labour"
  | "Civil Society"
  | "International";

type Position = "supporter" | "opponent" | "neutral" | "mixed";

interface Stakeholder {
  id: string;
  name: string;
  category: Category;
  influence_score: number;
  support_level: number;
  key_interests: string;
  related_packages: number[];
  position: Position;
}

const stakeholders = stakeholdersData as Stakeholder[];

const CATEGORY_COLORS: Record<Category, { dot: string; badge: string }> = {
  Government:       { dot: "bg-blue-500",   badge: "bg-blue-100 text-blue-800 ring-blue-200" },
  Regulator:        { dot: "bg-purple-500", badge: "bg-purple-100 text-purple-800 ring-purple-200" },
  SOE:              { dot: "bg-amber-500",  badge: "bg-amber-100 text-amber-800 ring-amber-200" },
  "Private Sector": { dot: "bg-teal-500",   badge: "bg-teal-100 text-teal-800 ring-teal-200" },
  Labour:           { dot: "bg-red-500",    badge: "bg-red-100 text-red-800 ring-red-200" },
  "Civil Society":  { dot: "bg-green-500",  badge: "bg-green-100 text-green-800 ring-green-200" },
  International:    { dot: "bg-slate-500",  badge: "bg-slate-100 text-slate-700 ring-slate-200" },
};

const POSITION_STYLES: Record<Position, string> = {
  supporter: "bg-green-100 text-green-800 ring-green-200",
  opponent:  "bg-red-100 text-red-800 ring-red-200",
  neutral:   "bg-gray-100 text-gray-600 ring-gray-200",
  mixed:     "bg-amber-100 text-amber-800 ring-amber-200",
};

const ALL_CATEGORIES: Category[] = [
  "Government",
  "Regulator",
  "SOE",
  "Private Sector",
  "Labour",
  "Civil Society",
  "International",
];

const PACKAGE_NAMES: Record<number, string> = {
  1: "Infrastructure Unblock",
  2: "SMME & Employment",
  3: "Human Capital Pipeline",
  4: "Trade & Industrial Competitiveness",
  5: "State Capacity & Governance",
};

// Matrix dimensions
const MATRIX_W = 560;
const MATRIX_H = 400;
const PAD = 40;

function getX(support_level: number) {
  // support_level: -5 to +5 → left to right
  return PAD + ((support_level + 5) / 10) * (MATRIX_W - 2 * PAD);
}

function getY(influence_score: number) {
  // influence_score: 1–10 → bottom to top
  return MATRIX_H - PAD - ((influence_score - 1) / 9) * (MATRIX_H - 2 * PAD);
}

export default function StakeholdersPage() {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(ALL_CATEGORIES)
  );
  const [packageFilter, setPackageFilter] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return stakeholders.filter((s) => {
      if (!activeCategories.has(s.category)) return false;
      if (packageFilter !== null && !s.related_packages.includes(packageFilter)) return false;
      return true;
    });
  }, [activeCategories, packageFilter]);

  function toggleCategory(cat: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  const hovered = hoveredId ? stakeholders.find((s) => s.id === hoveredId) : null;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stakeholder Mapping</h1>
        <p className="text-sm text-gray-500 mt-1">
          Influence vs. support across ~30 key actors in the SA reform landscape.
          Quadrants identify champions, blockers, potential allies, and peripheral risks.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-start">
        {/* Category filters */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Category</p>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategories(new Set(ALL_CATEGORIES))}
              className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 transition-colors ${
                activeCategories.size === ALL_CATEGORIES.length
                  ? "bg-gray-900 text-white ring-gray-900"
                  : "bg-white text-gray-600 ring-gray-200 hover:ring-gray-300"
              }`}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const colors = CATEGORY_COLORS[cat];
              const active = activeCategories.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ring-1 transition-colors ${
                    active
                      ? `${colors.badge} ring-1`
                      : "bg-white text-gray-400 ring-gray-200 opacity-50 hover:opacity-75"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Package filter */}
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Reform Package</p>
          <select
            value={packageFilter ?? ""}
            onChange={(e) =>
              setPackageFilter(e.target.value === "" ? null : Number(e.target.value))
            }
            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sa-green/30"
          >
            <option value="">All packages</option>
            {Object.entries(PACKAGE_NAMES).map(([id, name]) => (
              <option key={id} value={id}>
                Pkg {id}: {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrix */}
      <div className="card p-4 overflow-x-auto">
        <div className="relative" style={{ width: MATRIX_W, height: MATRIX_H, maxWidth: "100%" }}>
          {/* Quadrant backgrounds */}
          <div
            className="absolute bg-green-50/70 rounded-tl"
            style={{
              left: PAD,
              top: PAD,
              width: (MATRIX_W - 2 * PAD) / 2,
              height: (MATRIX_H - 2 * PAD) / 2,
            }}
          />
          <div
            className="absolute bg-red-50/70 rounded-tr"
            style={{
              left: PAD + (MATRIX_W - 2 * PAD) / 2,
              top: PAD,
              width: (MATRIX_W - 2 * PAD) / 2,
              height: (MATRIX_H - 2 * PAD) / 2,
            }}
          />
          <div
            className="absolute bg-blue-50/40 rounded-bl"
            style={{
              left: PAD,
              top: PAD + (MATRIX_H - 2 * PAD) / 2,
              width: (MATRIX_W - 2 * PAD) / 2,
              height: (MATRIX_H - 2 * PAD) / 2,
            }}
          />
          <div
            className="absolute bg-orange-50/40 rounded-br"
            style={{
              left: PAD + (MATRIX_W - 2 * PAD) / 2,
              top: PAD + (MATRIX_H - 2 * PAD) / 2,
              width: (MATRIX_W - 2 * PAD) / 2,
              height: (MATRIX_H - 2 * PAD) / 2,
            }}
          />

          {/* Quadrant labels */}
          <span className="absolute text-xs font-semibold text-green-700 opacity-60" style={{ left: PAD + 6, top: PAD + 4 }}>
            Champions
          </span>
          <span className="absolute text-xs font-semibold text-red-700 opacity-60" style={{ right: 6, top: PAD + 4 }}>
            Blockers
          </span>
          <span className="absolute text-xs font-semibold text-blue-700 opacity-60" style={{ left: PAD + 6, bottom: 4 }}>
            Potential allies
          </span>
          <span className="absolute text-xs font-semibold text-orange-700 opacity-60" style={{ right: 6, bottom: 4 }}>
            Risks
          </span>

          {/* Axis lines */}
          {/* Vertical midline */}
          <div
            className="absolute border-l border-dashed border-gray-300"
            style={{
              left: PAD + (MATRIX_W - 2 * PAD) / 2,
              top: PAD,
              height: MATRIX_H - 2 * PAD,
            }}
          />
          {/* Horizontal midline */}
          <div
            className="absolute border-t border-dashed border-gray-300"
            style={{
              left: PAD,
              top: PAD + (MATRIX_H - 2 * PAD) / 2,
              width: MATRIX_W - 2 * PAD,
            }}
          />

          {/* Axis labels */}
          <span className="absolute text-[10px] text-gray-400" style={{ left: PAD, top: MATRIX_H - 16 }}>
            Opposed
          </span>
          <span className="absolute text-[10px] text-gray-400" style={{ right: 0, top: MATRIX_H - 16 }}>
            Supportive
          </span>
          <span
            className="absolute text-[10px] text-gray-400 rotate-[-90deg] origin-left"
            style={{ left: 10, top: MATRIX_H / 2 + 10 }}
          >
            Influence
          </span>

          {/* Dots */}
          {filtered.map((s) => {
            const x = getX(s.support_level);
            const y = getY(s.influence_score);
            const colors = CATEGORY_COLORS[s.category];
            const isHovered = hoveredId === s.id;
            return (
              <button
                key={s.id}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none group"
                style={{ left: x, top: y }}
                title={s.name}
              >
                <span
                  className={`block rounded-full border-2 border-white shadow transition-transform ${colors.dot} ${
                    isHovered ? "scale-150" : "hover:scale-125"
                  }`}
                  style={{
                    width: 8 + s.influence_score * 1.2,
                    height: 8 + s.influence_score * 1.2,
                  }}
                />
                {isHovered && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded pointer-events-none z-20 shadow-lg">
                    {s.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
          {ALL_CATEGORIES.filter((c) => activeCategories.has(c)).map((cat) => (
            <span key={cat} className="flex items-center gap-1 text-xs text-gray-500">
              <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat].dot}`} />
              {cat}
            </span>
          ))}
          <span className="text-xs text-gray-400 ml-auto">Dot size = influence score</span>
        </div>
      </div>

      {/* Stakeholder table */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          Stakeholders{" "}
          <span className="text-sm font-normal text-gray-400">({filtered.length})</span>
        </h2>
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Stakeholder
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Influence
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Support
                </th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered
                .sort((a, b) => b.influence_score - a.influence_score)
                .map((s) => {
                  const catColors = CATEGORY_COLORS[s.category];
                  const isExpanded = expandedId === s.id;
                  return (
                    <>
                      <tr
                        key={s.id}
                        className="bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : s.id)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`flex-shrink-0 w-2 h-2 rounded-full ${catColors.dot}`} />
                            <span className="font-medium text-gray-900 text-sm">{s.name}</span>
                            <span className="text-gray-300 text-xs ml-auto">
                              {isExpanded ? "▲" : "▼"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`badge ring-1 text-xs ${catColors.badge}`}>
                            {s.category}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <span
                                  key={i}
                                  className={`h-1.5 w-2 rounded-full ${
                                    i < s.influence_score ? "bg-gray-700" : "bg-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{s.influence_score}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: 48,
                                background: `linear-gradient(to right, #ef4444 0%, #e5e7eb 50%, #22c55e 100%)`,
                              }}
                            />
                            <span
                              className={`text-xs font-medium ${
                                s.support_level > 0
                                  ? "text-green-700"
                                  : s.support_level < 0
                                  ? "text-red-700"
                                  : "text-gray-500"
                              }`}
                            >
                              {s.support_level > 0 ? "+" : ""}
                              {s.support_level}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span
                            className={`badge ring-1 text-xs capitalize ${POSITION_STYLES[s.position]}`}
                          >
                            {s.position}
                          </span>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${s.id}-detail`} className="bg-gray-50">
                          <td colSpan={5} className="px-4 py-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-0.5">
                                  Key interests
                                </p>
                                <p className="text-sm text-gray-700">{s.key_interests}</p>
                              </div>
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <span>
                                  <span className="font-medium text-gray-700">Influence:</span>{" "}
                                  {s.influence_score}/10
                                </span>
                                <span>
                                  <span className="font-medium text-gray-700">Support:</span>{" "}
                                  {s.support_level > 0 ? "+" : ""}
                                  {s.support_level}/+5
                                </span>
                                <span>
                                  <span className="font-medium text-gray-700">Position:</span>{" "}
                                  <span className="capitalize">{s.position}</span>
                                </span>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500 mb-1">
                                  Related reform packages
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {s.related_packages.map((pkgId) => (
                                    <a
                                      key={pkgId}
                                      href={`/packages/${pkgId}`}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-gray-200 text-xs text-gray-600 hover:border-sa-green hover:text-sa-green transition-colors"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Pkg {pkgId}: {PACKAGE_NAMES[pkgId]}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
