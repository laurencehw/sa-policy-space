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

type Stance = "champion" | "constructive_critic" | "cautious" | "concerned";

interface Stakeholder {
  id: string;
  name: string;
  category: Category;
  influence_score: number;
  stance: Stance;
  primary_interests: string;
  key_concerns: string;
  potential_contributions: string;
  conditions_for_engagement: string;
  related_packages: number[];
  reform_design_insights: string;
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

const STANCE_CONFIG: Record<Stance, { badge: string; label: string; short: string }> = {
  champion:           { badge: "bg-emerald-100 text-emerald-800 ring-emerald-200", label: "Champion",            short: "Champion" },
  constructive_critic:{ badge: "bg-blue-100 text-blue-800 ring-blue-200",          label: "Constructive Critic", short: "Constructive" },
  cautious:           { badge: "bg-amber-100 text-amber-800 ring-amber-200",        label: "Cautious",            short: "Cautious" },
  concerned:          { badge: "bg-orange-100 text-orange-800 ring-orange-200",     label: "Concerned",           short: "Concerned" },
};

const STANCE_ORDER: Stance[] = ["champion", "constructive_critic", "cautious", "concerned"];

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
  2: "SMME & Employment Acceleration",
  3: "Human Capital Pipeline",
  4: "Trade & Industrial Competitiveness",
  5: "State Capacity & Governance",
};

// ── Matrix ────────────────────────────────────────────────────────────────

const MATRIX_W = 600;
const MATRIX_H = 420;
const PAD_L = 44;  // left (y-axis label)
const PAD_R = 12;
const PAD_T = 40;
const PAD_B = 48;  // bottom (x-axis labels)

const INNER_W = MATRIX_W - PAD_L - PAD_R;
const INNER_H = MATRIX_H - PAD_T - PAD_B;

// X: stance column (0–3) → pixel, column centred
function stanceX(stance: Stance): number {
  const i = STANCE_ORDER.indexOf(stance);
  return PAD_L + (i + 0.5) * (INNER_W / 4);
}

// Y: influence 1–10, bottom = 1, top = 10
function influenceY(score: number): number {
  return MATRIX_H - PAD_B - ((score - 1) / 9) * INNER_H;
}

// Simple deterministic jitter within a column based on index
function jitterX(baseX: number, idx: number, total: number): number {
  const spread = Math.min((INNER_W / 4) * 0.55, 60);
  if (total <= 1) return baseX;
  const step = spread / (total - 1);
  return baseX - spread / 2 + idx * step;
}

// High-influence midpoint (above 5.5 = high, below = lower)
const MID_INFLUENCE = 5.5;
const midY = influenceY(MID_INFLUENCE);
const midX = PAD_L + INNER_W / 2; // between cautious and constructive_critic

// ── Reform Design Insight themes ─────────────────────────────────────────

const INSIGHT_THEMES: { label: string; ids: string[] }[] = [
  {
    label: "Labour & Just Transition",
    ids: ["cosatu", "num", "numsa", "saftu", "eu"],
  },
  {
    label: "Regulatory Capacity",
    ids: ["nersa", "icasa", "dmre", "competition-commission", "fsca", "sarb"],
  },
  {
    label: "Fiscal Sustainability",
    ids: ["national-treasury", "imf", "dpe", "world-bank"],
  },
  {
    label: "Investment Certainty",
    ids: ["mining-council", "busa", "blsa", "us-agoa", "renewable-ipps", "fintech-sector", "transnet"],
  },
  {
    label: "Social Compact & Inclusion",
    ids: ["section27", "seri", "equal-education", "outa", "pari"],
  },
];

const stakeholderById = Object.fromEntries(stakeholders.map((s) => [s.id, s]));

// ── Component ─────────────────────────────────────────────────────────────

export default function StakeholdersPage() {
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(ALL_CATEGORIES)
  );
  const [packageFilter, setPackageFilter] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTheme, setActiveTheme] = useState<number>(0);

  const filtered = useMemo(() => {
    return stakeholders.filter((s) => {
      if (!activeCategories.has(s.category)) return false;
      if (packageFilter !== null && !s.related_packages.includes(packageFilter)) return false;
      return true;
    });
  }, [activeCategories, packageFilter]);

  // Group filtered stakeholders by stance for jitter calculation
  const byStance = useMemo(() => {
    const groups: Record<Stance, Stakeholder[]> = {
      champion: [], constructive_critic: [], cautious: [], concerned: [],
    };
    filtered.forEach((s) => groups[s.stance].push(s));
    return groups;
  }, [filtered]);

  function toggleCategory(cat: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => b.influence_score - a.influence_score),
    [filtered]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stakeholder Mapping</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          All actors in the SA reform landscape have legitimate interests that should inform better policy design.
          This map positions stakeholders by their engagement stance and influence — not as supporters or opponents of reform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-start">
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

      {/* Influence–Stance Matrix */}
      <div className="card p-4 overflow-x-auto">
        <div className="relative" style={{ width: MATRIX_W, height: MATRIX_H }}>

          {/* Quadrant backgrounds */}
          {/* Top-left: Reform Champions */}
          <div className="absolute rounded-tl bg-emerald-50/60"
            style={{ left: PAD_L, top: PAD_T, width: INNER_W / 2, height: midY - PAD_T }} />
          {/* Top-right: Key Voices */}
          <div className="absolute rounded-tr bg-amber-50/50"
            style={{ left: midX, top: PAD_T, width: PAD_L + INNER_W - midX, height: midY - PAD_T }} />
          {/* Bottom-left: Emerging Allies */}
          <div className="absolute rounded-bl bg-blue-50/40"
            style={{ left: PAD_L, top: midY, width: INNER_W / 2, height: MATRIX_H - PAD_B - midY }} />
          {/* Bottom-right: Important Perspectives */}
          <div className="absolute bg-gray-50/60"
            style={{ left: midX, top: midY, width: PAD_L + INNER_W - midX, height: MATRIX_H - PAD_B - midY }} />

          {/* Quadrant labels */}
          <span className="absolute text-[11px] font-semibold text-emerald-700 opacity-70"
            style={{ left: PAD_L + 6, top: PAD_T + 5 }}>
            Reform Champions
          </span>
          <span className="absolute text-[11px] font-semibold text-amber-700 opacity-70"
            style={{ left: midX + 6, top: PAD_T + 5 }}>
            Key Voices
          </span>
          <span className="absolute text-[11px] font-semibold text-blue-700 opacity-70"
            style={{ left: PAD_L + 6, top: midY + 4 }}>
            Emerging Allies
          </span>
          <span className="absolute text-[11px] font-semibold text-gray-500 opacity-70"
            style={{ left: midX + 6, top: midY + 4 }}>
            Important Perspectives
          </span>

          {/* Vertical mid-line */}
          <div className="absolute border-l border-dashed border-gray-300"
            style={{ left: midX, top: PAD_T, height: INNER_H }} />
          {/* Horizontal mid-line */}
          <div className="absolute border-t border-dashed border-gray-300"
            style={{ left: PAD_L, top: midY, width: INNER_W }} />

          {/* Y-axis label */}
          <span className="absolute text-[10px] text-gray-400 rotate-[-90deg] origin-center"
            style={{ left: -4, top: MATRIX_H / 2, transformOrigin: "center center" }}>
            Influence
          </span>
          {/* Y-axis ticks */}
          {[1, 3, 5, 7, 10].map((v) => (
            <span key={v}
              className="absolute text-[9px] text-gray-400"
              style={{ left: PAD_L - 16, top: influenceY(v) - 5 }}>
              {v}
            </span>
          ))}

          {/* X-axis stance labels */}
          {STANCE_ORDER.map((st, i) => (
            <span key={st}
              className="absolute text-[10px] font-medium text-gray-500 text-center"
              style={{
                left: PAD_L + i * (INNER_W / 4),
                width: INNER_W / 4,
                top: MATRIX_H - PAD_B + 8,
              }}>
              {STANCE_CONFIG[st].short}
            </span>
          ))}

          {/* Dots */}
          {STANCE_ORDER.map((stance) => {
            const group = byStance[stance];
            const baseX = stanceX(stance);
            return group.map((s, idx) => {
              const x = jitterX(baseX, idx, group.length);
              const y = influenceY(s.influence_score);
              const colors = CATEGORY_COLORS[s.category];
              const isHovered = hoveredId === s.id;
              const size = 8 + s.influence_score * 1.3;
              return (
                <button
                  key={s.id}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{ left: x, top: y }}
                  title={s.name}
                >
                  <span
                    className={`block rounded-full border-2 border-white shadow transition-transform ${colors.dot} ${
                      isHovered ? "scale-150 z-20" : "hover:scale-125"
                    }`}
                    style={{ width: size, height: size }}
                  />
                  {isHovered && (
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-gray-900 text-white text-[10px] px-2 py-1 rounded pointer-events-none z-30 shadow-lg">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-gray-400 ml-1">·</span>
                      <span className="text-gray-300 ml-1">{s.influence_score}/10</span>
                    </span>
                  )}
                </button>
              );
            });
          })}
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-gray-100 pt-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {ALL_CATEGORIES.filter((c) => activeCategories.has(c)).map((cat) => (
              <span key={cat} className="flex items-center gap-1 text-xs text-gray-500">
                <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_COLORS[cat].dot}`} />
                {cat}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-auto">Dot size = influence score · Click to expand card below</span>
        </div>
      </div>

      {/* Reform Design Insights Panel */}
      <div className="card p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900">Reform Design Insights by Theme</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            What stakeholder concerns imply for better policy design, grouped by cross-cutting theme.
          </p>
        </div>

        {/* Theme tabs */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {INSIGHT_THEMES.map((theme, i) => (
            <button
              key={theme.label}
              onClick={() => setActiveTheme(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeTheme === i
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>

        {/* Theme content */}
        {(() => {
          const theme = INSIGHT_THEMES[activeTheme];
          const themeStakeholders = theme.ids
            .map((id) => stakeholderById[id])
            .filter(Boolean);
          return (
            <div className="space-y-3">
              {themeStakeholders.map((s) => {
                const catColors = CATEGORY_COLORS[s.category];
                const stanceConf = STANCE_CONFIG[s.stance];
                return (
                  <div key={s.id} className="rounded-lg border border-gray-100 bg-gray-50/60 p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${catColors.dot}`} />
                      <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                      <span className={`badge ring-1 text-xs ${stanceConf.badge}`}>{stanceConf.label}</span>
                      <span className="text-xs text-gray-400 ml-auto">Influence {s.influence_score}/10</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{s.reform_design_insights}</p>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Stakeholder Cards */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">
          All Stakeholders{" "}
          <span className="text-sm font-normal text-gray-400">({filtered.length})</span>
        </h2>
        <div className="space-y-2">
          {sorted.map((s) => {
            const catColors = CATEGORY_COLORS[s.category];
            const stanceConf = STANCE_CONFIG[s.stance];
            const isExpanded = expandedId === s.id;

            return (
              <div
                key={s.id}
                className={`rounded-xl border transition-all ${
                  isExpanded ? "border-gray-300 shadow-sm" : "border-gray-200"
                } bg-white overflow-hidden`}
              >
                {/* Card header — always visible */}
                <button
                  className="w-full text-left px-4 py-3.5 flex items-center gap-3 hover:bg-gray-50/60 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : s.id)}
                >
                  <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full ${catColors.dot}`} />
                  <span className="font-medium text-gray-900 text-sm flex-1 min-w-0 truncate">
                    {s.name}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`badge ring-1 text-xs hidden sm:inline-flex ${catColors.badge}`}>
                      {s.category}
                    </span>
                    <span className={`badge ring-1 text-xs ${stanceConf.badge}`}>
                      {stanceConf.label}
                    </span>
                    {/* Influence dots */}
                    <div className="hidden md:flex gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <span
                          key={i}
                          className={`h-1.5 w-2 rounded-full ${
                            i < s.influence_score ? "bg-gray-600" : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right hidden md:block">
                      {s.influence_score}/10
                    </span>
                    <span className="text-gray-400 text-xs ml-1">
                      {isExpanded ? "▲" : "▼"}
                    </span>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                    {/* Four sections in 2-col grid on wider screens */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                          Primary Interests
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {s.primary_interests}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                          Key Concerns
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">{s.key_concerns}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                          What They Bring to the Table
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {s.potential_contributions}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                          Conditions for Engagement
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {s.conditions_for_engagement}
                        </p>
                      </div>
                    </div>

                    {/* Reform Design Insight */}
                    <div className="rounded-lg bg-sa-green/5 border border-sa-green/20 px-4 py-3">
                      <p className="text-[11px] font-semibold text-sa-green uppercase tracking-wide mb-1.5">
                        Reform Design Insight
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {s.reform_design_insights}
                      </p>
                    </div>

                    {/* Related packages */}
                    {s.related_packages.length > 0 && (
                      <div>
                        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                          Related Reform Packages
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
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
