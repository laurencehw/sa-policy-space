"use client";

export const dynamic = "force-dynamic";

import { useState, useMemo } from "react";
import stakeholdersData from "@/data/stakeholders.json";
import reformPackagesData from "@/data/reform_packages.json";

// ── Types ─────────────────────────────────────────────────────────────────

type Stance = "champion" | "constructive_critic" | "cautious" | "concerned";
type Category =
  | "Government"
  | "Regulator"
  | "SOE"
  | "Private Sector"
  | "Labour"
  | "Civil Society"
  | "International";

interface Stakeholder {
  id: string;
  name: string;
  category: Category;
  influence_score: number;
  stance: Stance;
  related_packages: number[];
}

interface PackageData {
  package_id: number;
  name: string;
  tagline: string;
}

const stakeholders = stakeholdersData as Stakeholder[];
const reformPackages = (Object.values(reformPackagesData) as PackageData[]).sort(
  (a, b) => a.package_id - b.package_id
);

// ── Scoring constants ─────────────────────────────────────────────────────

const STANCE_WEIGHTS: Record<Stance, number> = {
  champion: 2,
  constructive_critic: 1,
  cautious: -0.5,
  concerned: -1.5,
};

const STANCES: Stance[] = ["champion", "constructive_critic", "cautious", "concerned"];

const STANCE_LABELS: Record<Stance, string> = {
  champion: "Champion",
  constructive_critic: "Critic",
  cautious: "Cautious",
  concerned: "Concerned",
};

const STANCE_ACTIVE: Record<Stance, string> = {
  champion: "bg-emerald-500 text-white",
  constructive_critic: "bg-blue-500 text-white",
  cautious: "bg-amber-500 text-white",
  concerned: "bg-orange-600 text-white",
};

const CATEGORY_DOT: Record<Category, string> = {
  Government: "bg-blue-500",
  Regulator: "bg-purple-500",
  SOE: "bg-amber-500",
  "Private Sector": "bg-teal-500",
  Labour: "bg-red-500",
  "Civil Society": "bg-green-500",
  International: "bg-slate-500",
};

const FEASIBILITY_THRESHOLD = 60;

// ── Baseline helpers ──────────────────────────────────────────────────────

function baselineStances(): Record<string, Stance> {
  return Object.fromEntries(stakeholders.map((s) => [s.id, s.stance]));
}
function baselineInfluences(): Record<string, number> {
  return Object.fromEntries(stakeholders.map((s) => [s.id, s.influence_score]));
}

// ── Feasibility calculation ───────────────────────────────────────────────

function computeFeasibility(
  packageId: number,
  stances: Record<string, Stance>,
  influences: Record<string, number>
): number {
  const relevant = stakeholders.filter((s) =>
    s.related_packages.includes(packageId)
  );
  if (relevant.length === 0) return 50;

  let raw = 0,
    min = 0,
    max = 0;
  for (const s of relevant) {
    const inf = influences[s.id] ?? s.influence_score;
    const stance = stances[s.id] ?? s.stance;
    raw += STANCE_WEIGHTS[stance] * inf;
    min += -1.5 * inf;
    max += 2 * inf;
  }
  if (max === min) return 50;
  return Math.max(0, Math.min(100, Math.round(((raw - min) / (max - min)) * 100)));
}

// ── Coalition finder (greedy: highest-influence swing stakeholders first) ─

interface CoalitionStep {
  stakeholder: Stakeholder;
  fromStance: Stance;
  cumulativeScore: number;
}

function findCoalition(
  packageId: number,
  stances: Record<string, Stance>,
  influences: Record<string, number>
): CoalitionStep[] {
  if (computeFeasibility(packageId, stances, influences) >= FEASIBILITY_THRESHOLD) return [];

  const relevant = stakeholders.filter((s) =>
    s.related_packages.includes(packageId)
  );
  const swingable = relevant
    .filter((s) => stances[s.id] === "cautious" || stances[s.id] === "concerned")
    .sort(
      (a, b) =>
        (influences[b.id] ?? b.influence_score) - (influences[a.id] ?? a.influence_score)
    );

  const steps: CoalitionStep[] = [];
  let sim = { ...stances };
  let score = computeFeasibility(packageId, sim, influences);

  for (const s of swingable) {
    if (score >= FEASIBILITY_THRESHOLD) break;
    sim = { ...sim, [s.id]: "constructive_critic" };
    score = computeFeasibility(packageId, sim, influences);
    steps.push({ stakeholder: s, fromStance: stances[s.id] as Stance, cumulativeScore: score });
  }

  return steps;
}

// ── Preset scenarios ──────────────────────────────────────────────────────

interface Scenario {
  id: string;
  label: string;
  description: string;
  icon: string;
  apply: (
    stances: Record<string, Stance>,
    influences: Record<string, number>
  ) => { stances: Record<string, Stance>; influences: Record<string, number> };
}

const SCENARIOS: Scenario[] = [
  {
    id: "nedlac",
    label: "NEDLAC Grand Bargain",
    description: "Labour unions shift to constructive critics",
    icon: "🤝",
    apply: (s, inf) => ({
      stances: {
        ...s,
        cosatu: "constructive_critic",
        num: "constructive_critic",
        numsa: "constructive_critic",
        saftu: "constructive_critic",
      },
      influences: { ...inf },
    }),
  },
  {
    id: "business",
    label: "Business Confidence Surge",
    description: "Business federations shift to champions",
    icon: "📈",
    apply: (s, inf) => ({
      stances: {
        ...s,
        busa: "champion",
        blsa: "champion",
        "mining-council": "champion",
        "renewable-ipps": "champion",
        "fintech-sector": "champion",
      },
      influences: { ...inf },
    }),
  },
  {
    id: "fiscal",
    label: "Fiscal Crisis",
    description: "Treasury and fiscal bodies gain outsized influence",
    icon: "📉",
    apply: (s, inf) => ({
      stances: { ...s },
      influences: {
        ...inf,
        "national-treasury": 10,
        sarb: 10,
        imf: 8,
      },
    }),
  },
  {
    id: "election",
    label: "Election Year",
    description: "Government actors shift cautious on reform",
    icon: "🗳️",
    apply: (s, inf) => ({
      stances: {
        ...s,
        presidency: "cautious",
        "parliament-pcoe": "cautious",
        "parliament-pct": "cautious",
        dmre: "cautious",
        dpe: "cautious",
        dtic: "cautious",
        dcdt: "cautious",
      },
      influences: { ...inf },
    }),
  },
];

// ── Score bar colour helper ───────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= FEASIBILITY_THRESHOLD) return "bg-green-400";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

function scoreLabelColor(score: number): string {
  if (score >= FEASIBILITY_THRESHOLD) return "text-emerald-700";
  if (score >= 40) return "text-amber-700";
  return "text-red-700";
}

// ── Package short names ───────────────────────────────────────────────────

const PKG_SHORT: Record<number, string> = {
  1: "Infrastructure",
  2: "SMME & Jobs",
  3: "Human Capital",
  4: "Trade & Industry",
  5: "State Capacity",
};

// ── Main component ────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const [stances, setStances] = useState<Record<string, Stance>>(baselineStances);
  const [influences, setInfluences] = useState<Record<string, number>>(baselineInfluences);
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [packageFilter, setPackageFilter] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  // ── Derived ──

  const modifiedIds = useMemo(
    () =>
      new Set(
        stakeholders
          .filter(
            (s) =>
              stances[s.id] !== s.stance || influences[s.id] !== s.influence_score
          )
          .map((s) => s.id)
      ),
    [stances, influences]
  );

  const baseScores = useMemo(
    () =>
      Object.fromEntries(
        reformPackages.map((p) => [
          p.package_id,
          computeFeasibility(p.package_id, baselineStances(), baselineInfluences()),
        ])
      ),
    []
  );

  const scores = useMemo(
    () =>
      reformPackages.map((pkg) => ({
        pkg,
        score: computeFeasibility(pkg.package_id, stances, influences),
        baseline: baseScores[pkg.package_id],
      })),
    [stances, influences, baseScores]
  );

  const coalitions = useMemo(
    () =>
      scores
        .filter(({ score }) => score < FEASIBILITY_THRESHOLD)
        .map(({ pkg, score }) => ({
          pkg,
          score,
          steps: findCoalition(pkg.package_id, stances, influences),
        })),
    [scores, stances, influences]
  );

  // ── Actions ──

  function reset() {
    setStances(baselineStances());
    setInfluences(baselineInfluences());
    setActiveScenario(null);
  }

  function applyScenario(id: string) {
    if (activeScenario === id) {
      reset();
      return;
    }
    const scenario = SCENARIOS.find((s) => s.id === id)!;
    const base = scenario.apply(baselineStances(), baselineInfluences());
    setStances(base.stances);
    setInfluences(base.influences);
    setActiveScenario(id);
  }

  function setStance(id: string, stance: Stance) {
    setStances((prev) => ({ ...prev, [id]: stance }));
    setActiveScenario(null);
  }

  // ── Filtered + sorted stakeholder list ──

  const filteredStakeholders = useMemo(() => {
    return [...stakeholders]
      .filter((s) => {
        if (categoryFilter && s.category !== categoryFilter) return false;
        if (packageFilter !== null && !s.related_packages.includes(packageFilter)) return false;
        return true;
      })
      .sort(
        (a, b) =>
          (influences[b.id] ?? b.influence_score) - (influences[a.id] ?? a.influence_score)
      );
  }, [packageFilter, categoryFilter, influences]);

  const allCategories: Category[] = [
    "Government",
    "Regulator",
    "SOE",
    "Private Sector",
    "Labour",
    "Civil Society",
    "International",
  ];

  // ── Render ──

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Political Feasibility Simulator
        </h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Model how shifting stakeholder stances affects the political feasibility of each
          reform package. Toggle individual stances or apply a preset scenario — scores
          update in real time. Feasibility threshold: <strong>60 / 100</strong>.
        </p>
      </div>

      {/* ── Scoring key ── */}
      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
        <span className="font-medium text-gray-700">Stance weights:</span>
        {STANCES.map((s) => (
          <span key={s} className="flex items-center gap-1">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                s === "champion"
                  ? "bg-emerald-500"
                  : s === "constructive_critic"
                  ? "bg-blue-500"
                  : s === "cautious"
                  ? "bg-amber-500"
                  : "bg-orange-600"
              }`}
            />
            {STANCE_LABELS[s]} ×{" "}
            {STANCE_WEIGHTS[s] > 0 ? "+" : ""}
            {STANCE_WEIGHTS[s]} × influence
          </span>
        ))}
      </div>

      {/* ── Preset scenarios ── */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Preset Scenarios
        </p>
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((scenario) => {
            const active = activeScenario === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => applyScenario(scenario.id)}
                className={`px-3 py-2 rounded-xl text-left text-sm font-medium transition-colors ring-1 ${
                  active
                    ? "bg-gray-900 text-white ring-gray-900"
                    : "bg-white text-gray-700 ring-gray-200 hover:ring-gray-300 hover:bg-gray-50"
                }`}
              >
                <span className="mr-1">{scenario.icon}</span>
                {scenario.label}
                <span
                  className={`block text-xs font-normal mt-0.5 ${
                    active ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {scenario.description}
                </span>
              </button>
            );
          })}
          {modifiedIds.size > 0 && (
            <button
              onClick={reset}
              className="px-3 py-2 rounded-xl text-sm font-medium ring-1 bg-red-50 text-red-700 ring-red-200 hover:bg-red-100 transition-colors self-start"
            >
              ↺ Reset
              <span className="block text-xs font-normal mt-0.5 text-red-500">
                {modifiedIds.size} change{modifiedIds.size !== 1 ? "s" : ""}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div className="grid lg:grid-cols-5 gap-6 items-start">

        {/* ── Left: stakeholder controls ── */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-3">
            <select
              value={packageFilter ?? ""}
              onChange={(e) =>
                setPackageFilter(e.target.value === "" ? null : Number(e.target.value))
              }
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sa-green/30"
            >
              <option value="">All packages</option>
              {reformPackages.map((p) => (
                <option key={p.package_id} value={p.package_id}>
                  Pkg {p.package_id}: {PKG_SHORT[p.package_id]}
                </option>
              ))}
            </select>
            <select
              value={categoryFilter ?? ""}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value === "" ? null : (e.target.value as Category)
                )
              }
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sa-green/30"
            >
              <option value="">All categories</option>
              {allCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="text-xs text-gray-400 self-center">
              {filteredStakeholders.length} stakeholders
              {modifiedIds.size > 0 && (
                <span className="text-amber-600 ml-1">· {modifiedIds.size} modified</span>
              )}
            </span>
          </div>

          {/* Stakeholder list */}
          <div className="space-y-1.5 max-h-[78vh] overflow-y-auto pr-1">
            {filteredStakeholders.map((s) => {
              const isModified = modifiedIds.has(s.id);
              const currentStance = stances[s.id] ?? s.stance;
              const currentInfluence = influences[s.id] ?? s.influence_score;
              const influenceChanged = currentInfluence !== s.influence_score;
              return (
                <div
                  key={s.id}
                  className={`rounded-xl border p-2.5 transition-colors ${
                    isModified
                      ? "border-amber-200 bg-amber-50/40"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  {/* Name row */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <span
                      className={`w-2 h-2 flex-shrink-0 rounded-full ${CATEGORY_DOT[s.category]}`}
                    />
                    <span className="text-xs font-medium text-gray-900 flex-1 min-w-0 truncate">
                      {s.name}
                    </span>
                    <span
                      className={`text-[10px] flex-shrink-0 ${
                        influenceChanged ? "text-amber-600 font-semibold" : "text-gray-400"
                      }`}
                    >
                      {currentInfluence}/10
                    </span>
                    {isModified && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    )}
                  </div>
                  {/* Stance buttons */}
                  <div className="flex gap-0.5">
                    {STANCES.map((stance) => (
                      <button
                        key={stance}
                        onClick={() => setStance(s.id, stance)}
                        className={`flex-1 text-[9px] py-1 rounded-md transition-colors font-medium leading-tight ${
                          currentStance === stance
                            ? STANCE_ACTIVE[stance]
                            : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {STANCE_LABELS[stance]}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right: scores + coalition map ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* Feasibility gauges */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Reform Package Feasibility
            </h2>
            <div className="space-y-3">
              {scores.map(({ pkg, score, baseline }) => {
                const delta = score - baseline;
                return (
                  <div key={pkg.package_id} className="card p-4">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0 pr-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {pkg.name}
                        </span>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                          {pkg.tagline}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {delta !== 0 && (
                          <span
                            className={`text-xs font-medium ${
                              delta > 0 ? "text-emerald-600" : "text-red-500"
                            }`}
                          >
                            {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
                          </span>
                        )}
                        <span
                          className={`text-lg font-bold tabular-nums ${scoreLabelColor(score)}`}
                        >
                          {score}
                        </span>
                        <span className="text-xs text-gray-400">/100</span>
                      </div>
                    </div>

                    {/* Bar */}
                    <div className="relative h-3 bg-gray-100 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-300 ${scoreColor(score)}`}
                        style={{ width: `${score}%` }}
                      />
                      {/* Baseline ghost bar */}
                      {delta !== 0 && (
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-gray-300/50"
                          style={{ width: `${baseline}%` }}
                        />
                      )}
                      {/* Threshold line */}
                      <div
                        className="absolute top-0 bottom-0 w-px bg-gray-500 z-10"
                        style={{ left: `${FEASIBILITY_THRESHOLD}%` }}
                      />
                    </div>

                    {/* Bar labels */}
                    <div className="flex justify-between mt-1 relative">
                      <span className="text-[9px] text-gray-400">0</span>
                      <span
                        className="text-[9px] text-gray-500 absolute"
                        style={{ left: `calc(${FEASIBILITY_THRESHOLD}% - 10px)` }}
                      >
                        60↑
                      </span>
                      <span className="text-[9px] text-gray-400">100</span>
                    </div>

                    {/* Status chip */}
                    <div className="mt-2">
                      {score >= FEASIBILITY_THRESHOLD ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 ring-1 ring-emerald-200 px-2 py-0.5 rounded-full">
                          ✓ Feasible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 ring-1 ring-amber-200 px-2 py-0.5 rounded-full">
                          {FEASIBILITY_THRESHOLD - score} pts below threshold
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coalition map */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-1">
              Coalition Map
            </h2>
            <p className="text-xs text-gray-400 mb-3">
              Minimum shifts (greedy, highest-influence first) needed to reach the 60-point
              threshold for packages currently below it.
            </p>

            {coalitions.length === 0 ? (
              <div className="card p-5 text-center">
                <span className="text-2xl">🎉</span>
                <p className="text-sm font-semibold text-emerald-700 mt-2">
                  All packages are above the feasibility threshold
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try adjusting stakeholder stances to explore resilience.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {coalitions.map(({ pkg, score, steps }) => (
                  <div key={pkg.package_id} className="card p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-900">
                        {pkg.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        Current:{" "}
                        <span className="font-medium text-amber-700">{score}</span>
                        /100
                      </span>
                    </div>

                    {steps.length === 0 ? (
                      <p className="text-xs text-gray-400">
                        No feasible path found — all cautious/concerned stakeholders already
                        shifted. Consider addressing concerned stakeholders directly.
                      </p>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500 mb-2.5">
                          Shift these{" "}
                          <span className="font-medium">
                            {steps.filter((st) => st.cumulativeScore < FEASIBILITY_THRESHOLD + 1).length}
                          </span>{" "}
                          stakeholder{steps.length !== 1 ? "s" : ""} to{" "}
                          <span className="font-medium text-blue-700">
                            Constructive Critic
                          </span>
                          :
                        </p>
                        <div className="space-y-2">
                          {steps.map(({ stakeholder, fromStance, cumulativeScore }, i) => {
                            const crossesThreshold =
                              cumulativeScore >= FEASIBILITY_THRESHOLD &&
                              (i === 0 ||
                                steps[i - 1].cumulativeScore < FEASIBILITY_THRESHOLD);
                            return (
                              <div key={stakeholder.id}>
                                {crossesThreshold && i > 0 && (
                                  <div className="flex items-center gap-2 my-2">
                                    <div className="flex-1 border-t border-dashed border-emerald-300" />
                                    <span className="text-[9px] text-emerald-600 font-semibold uppercase tracking-wide">
                                      threshold crossed
                                    </span>
                                    <div className="flex-1 border-t border-dashed border-emerald-300" />
                                  </div>
                                )}
                                <div
                                  className={`flex items-center gap-2 p-2 rounded-lg ${
                                    crossesThreshold
                                      ? "bg-emerald-50 ring-1 ring-emerald-200"
                                      : "bg-gray-50"
                                  }`}
                                >
                                  <span
                                    className={`w-2 h-2 flex-shrink-0 rounded-full ${
                                      CATEGORY_DOT[stakeholder.category]
                                    }`}
                                  />
                                  <span className="text-xs text-gray-800 flex-1 min-w-0 truncate font-medium">
                                    {stakeholder.name}
                                  </span>
                                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                                    {STANCE_LABELS[fromStance]}
                                  </span>
                                  <span className="text-[10px] text-gray-400">→</span>
                                  <span className="text-[10px] text-blue-600 font-medium flex-shrink-0">
                                    Critic
                                  </span>
                                  <span
                                    className={`text-xs font-semibold tabular-nums flex-shrink-0 ${
                                      cumulativeScore >= FEASIBILITY_THRESHOLD
                                        ? "text-emerald-600"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    → {cumulativeScore}
                                    {cumulativeScore >= FEASIBILITY_THRESHOLD && " ✓"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      setStance(stakeholder.id, "constructive_critic")
                                    }
                                    disabled={
                                      stances[stakeholder.id] === "constructive_critic"
                                    }
                                    className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    Apply
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Apply all button */}
                        {steps.some((st) => stances[st.stakeholder.id] !== "constructive_critic") && (
                          <button
                            onClick={() => {
                              steps.forEach(({ stakeholder }) =>
                                setStance(stakeholder.id, "constructive_critic")
                              );
                            }}
                            className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                          >
                            Apply full coalition for {pkg.name}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary stats */}
          <div className="card p-4 bg-gray-50">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Simulation Summary
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {scores.filter(({ score }) => score >= FEASIBILITY_THRESHOLD).length}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  packages feasible
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(scores.reduce((acc, { score }) => acc + score, 0) / scores.length)}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">avg score</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {modifiedIds.size}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  stakeholders shifted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
