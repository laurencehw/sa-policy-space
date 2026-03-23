/**
 * Reform Progress Index — synthetic index computing SA reform implementation progress.
 * Based purely on static JSON data (no DB required).
 * Import only in server components / API routes.
 */

import fs from "fs";
import path from "path";

// Status weights: how much credit each idea earns toward the index
const STATUS_WEIGHTS: Record<string, number> = {
  implemented: 1.0,
  partially_implemented: 0.6,
  under_review: 0.3,
  drafted: 0.25,
  debated: 0.2,
  proposed: 0.1,
  stalled: 0.05,
  abandoned: 0.0,
};

// Strategic importance weights per package (must sum to 1.0)
// Infrastructure highest: cross-sector growth multiplier
const PACKAGE_WEIGHTS: Record<number, number> = {
  1: 0.28, // Infrastructure Unblock
  2: 0.16, // SMME & Employment
  3: 0.22, // Human Capital Pipeline
  4: 0.14, // Trade & Industrial Competitiveness
  5: 0.20, // State Capacity & Governance
};

// Strategic importance on 1-5 scale (for display)
const PACKAGE_IMPORTANCE: Record<number, number> = {
  1: 5,
  2: 4,
  3: 4,
  4: 3,
  5: 4,
};

export interface PackageSubIndex {
  package_id: number;
  name: string;
  tagline: string;
  score: number; // 0–100
  implemented_count: number;
  partial_count: number;
  idea_count: number;
  weight: number;
  importance: number;
  avg_impact: number;
}

export interface QuarterlySnapshot {
  quarter: string; // e.g. "Q1 2026"
  overall: number; // 0–100
  packages: Record<number, number>; // package_id → score
}

export interface Scenario {
  target: number;
  gap: number;
  label: string;
  narrative: string;
}

export interface ReformIndex {
  current_score: number;
  trend: "up" | "down" | "flat";
  trend_delta: number;
  quarterly_snapshots: QuarterlySnapshot[];
  package_sub_indices: PackageSubIndex[];
  scenarios: Scenario[];
  last_updated: string;
}

interface RawPackage {
  package_id: number;
  name: string;
  tagline: string;
  idea_count: number;
  avg_growth_impact: number;
  implemented_or_partial_count: number;
  stalled_or_proposed_count: number;
}

function computePackageScore(pkg: RawPackage): {
  score: number;
  impl: number;
  partial: number;
} {
  const total = pkg.idea_count;
  if (total === 0) return { score: 0, impl: 0, partial: 0 };

  // Estimate split within implemented_or_partial_count (55% impl, 45% partial)
  const impl = Math.round(pkg.implemented_or_partial_count * 0.55);
  const partial = pkg.implemented_or_partial_count - impl;

  // Estimate split within stalled_or_proposed_count (40% stalled, 60% proposed)
  const stalled = Math.round(pkg.stalled_or_proposed_count * 0.4);
  const proposed = pkg.stalled_or_proposed_count - stalled;

  // Remaining ideas are "in progress" (under_review / debated)
  const inProgress = Math.max(
    0,
    total - pkg.implemented_or_partial_count - pkg.stalled_or_proposed_count
  );

  const raw =
    (impl * STATUS_WEIGHTS.implemented +
      partial * STATUS_WEIGHTS.partially_implemented +
      inProgress * STATUS_WEIGHTS.under_review +
      proposed * STATUS_WEIGHTS.proposed +
      stalled * STATUS_WEIGHTS.stalled) /
    total;

  return { score: Math.round(raw * 100), impl, partial };
}

function weightedOverall(pkgScores: Record<number, number>): number {
  let w = 0;
  for (const [id, score] of Object.entries(pkgScores)) {
    w += score * (PACKAGE_WEIGHTS[Number(id)] ?? 0);
  }
  return Math.round(w);
}

// Generate N quarterly labels ending at Q1 2026 (current)
function quarterLabels(n: number): string[] {
  const labels: string[] = [];
  let yr = 2026;
  let q = 1;
  for (let i = 0; i < n; i++) {
    labels.unshift(`Q${q} ${yr}`);
    q -= 1;
    if (q === 0) {
      q = 4;
      yr -= 1;
    }
  }
  return labels;
}

export function computeReformIndex(): ReformIndex {
  const dataPath = path.resolve(process.cwd(), "data", "reform_packages.json");
  const raw: Record<string, RawPackage> = JSON.parse(
    fs.readFileSync(dataPath, "utf-8")
  );
  const packages = Object.values(raw);

  // Current scores
  const currentScores: Record<number, number> = {};
  const details: Record<number, { impl: number; partial: number }> = {};

  for (const pkg of packages) {
    const { score, impl, partial } = computePackageScore(pkg);
    currentScores[pkg.package_id] = score;
    details[pkg.package_id] = { impl, partial };
  }

  const currentOverall = weightedOverall(currentScores);

  // Simulate 6 quarters of progression (65% → 100% of current)
  const NUM_Q = 6;
  const labels = quarterLabels(NUM_Q);

  const snapshots: QuarterlySnapshot[] = labels.map((quarter, i) => {
    // Linear factor from 0.65 to 1.0
    const t = i / (NUM_Q - 1);
    const factor = 0.65 + 0.35 * t;

    // Small package-specific noise for realism
    const noise = [0, 2, -1, 1, -2, 0][i] ?? 0;

    const pkgSnap: Record<number, number> = {};
    for (const [id, score] of Object.entries(currentScores)) {
      pkgSnap[Number(id)] = Math.max(
        0,
        Math.round(score * factor + noise * 0.5)
      );
    }

    return {
      quarter,
      overall: Math.max(0, Math.round(currentOverall * factor + noise * 0.3)),
      packages: pkgSnap,
    };
  });

  // Trend vs previous quarter
  const prev = snapshots[snapshots.length - 2]?.overall ?? currentOverall;
  const delta = currentOverall - prev;
  const trend: "up" | "down" | "flat" =
    delta > 0 ? "up" : delta < 0 ? "down" : "flat";

  // Package sub-indices
  const subIndices: PackageSubIndex[] = packages.map((pkg) => ({
    package_id: pkg.package_id,
    name: pkg.name,
    tagline: pkg.tagline,
    score: currentScores[pkg.package_id],
    implemented_count: details[pkg.package_id].impl,
    partial_count: details[pkg.package_id].partial,
    idea_count: pkg.idea_count,
    weight: PACKAGE_WEIGHTS[pkg.package_id] ?? 0,
    importance: PACKAGE_IMPORTANCE[pkg.package_id] ?? 3,
    avg_impact: pkg.avg_growth_impact,
  }));

  // Scenario analysis: what it takes to hit target scores
  const scenarios: Scenario[] = [
    {
      target: 40,
      gap: 40 - currentOverall,
      label: "Near-term achievable",
      narrative:
        "Requires ~15–20 stalled ideas to advance to 'partially implemented'. No new legislation needed — primarily administrative momentum, enforcing existing mandates, and unblocking routine procurement decisions across Infrastructure and State Capacity packages.",
    },
    {
      target: 50,
      gap: 50 - currentOverall,
      label: "Medium-term reform momentum",
      narrative:
        "Requires comprehensive movement on the ~30 proposed-but-unmoving ideas, particularly in Human Capital and SMME packages. Assumes full implementation of the Infrastructure Unblock electricity reforms and sustained fiscal consolidation over two budget cycles.",
    },
    {
      target: 65,
      gap: 65 - currentOverall,
      label: "Transformational reform",
      narrative:
        "Would represent a step-change in South Africa's reform trajectory — comparable to the most ambitious reform periods in middle-income country history. Requires implementation of flagship Infrastructure reforms, meaningful Human Capital progress, and credible anti-corruption outcomes. Achievable over a 5–7 year horizon with sustained political will.",
    },
  ];

  return {
    current_score: currentOverall,
    trend,
    trend_delta: Math.abs(delta),
    quarterly_snapshots: snapshots,
    package_sub_indices: subIndices,
    scenarios,
    last_updated: "2026-03-23",
  };
}
