export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Progress Dashboard",
  description:
    "Track implementation progress across South Africa's five reform packages — status breakdowns, stalled ideas, and milestone tracking.",
};
import ProgressCharts, { type ProgressStats } from "./ProgressCharts";
import type { IdeaRow } from "@/lib/local-api";
import { CONSTRAINT_LABELS } from "@/lib/supabase";

// ── Data fetching ──────────────────────────────────────────────────────────

const PACKAGE_NAMES: Record<number, string> = {
  1: "Infrastructure Unblock",
  2: "SMME & Employment",
  3: "Human Capital",
  4: "Trade & Industrial",
  5: "State Capacity",
};

async function getProgressData(): Promise<ProgressStats> {
  let ideas: IdeaRow[] = [];
  let ideasWithPlans = 0;

  try {
    const { getIdeas } = await import("@/lib/api");
    ideas = (await getIdeas()) as IdeaRow[];
  } catch (e) {
    console.error("[progress] getIdeas failed:", e);
  }

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { DatabaseSync } = await import("node:sqlite" as any);
      const pathMod = await import("path");
      const dbPath = process.env.SQLITE_DB_PATH ||
        pathMod.resolve(process.cwd(), "../data/dev.sqlite3");
      const db = new DatabaseSync(dbPath);
      ideasWithPlans = (db.prepare(
        "SELECT COUNT(DISTINCT idea_id) as n FROM implementation_plans"
      ).get() as any)?.n ?? 0;
      db.close();
    } else {
      const { supabase } = await import("@/lib/supabase");
      if (supabase) {
        const { count } = await supabase
          .from("implementation_plans")
          .select("idea_id", { count: "exact", head: true });
        ideasWithPlans = count ?? 0;
      }
    }
  } catch {
    ideasWithPlans = 0;
  }

  const totalIdeas = ideas.length;
  const implementedCount = ideas.filter(
    (i) => i.current_status === "implemented" || i.current_status === "partially_implemented"
  ).length;
  const quickWinsCount = ideas.filter((i) => i.time_horizon === "quick_win").length;
  const dormantCount = ideas.filter((i) => i.dormant === 1).length;

  // By status
  const statusOrder = [
    "proposed", "debated", "drafted", "under_review",
    "stalled", "partially_implemented", "implemented", "abandoned",
  ];
  const statusColorMap: Record<string, string> = {
    proposed: "#3b82f6",
    debated: "#eab308",
    drafted: "#6366f1",
    stalled: "#ef4444",
    under_review: "#f97316",
    partially_implemented: "#14b8a6",
    implemented: "#22c55e",
    abandoned: "#9ca3af",
  };
  const statusCounts = new Map<string, number>();
  for (const idea of ideas) statusCounts.set(idea.current_status, (statusCounts.get(idea.current_status) ?? 0) + 1);
  const byStatus = statusOrder
    .filter((s) => statusCounts.has(s))
    .map((s) => ({ name: s, value: statusCounts.get(s)!, color: statusColorMap[s] ?? "#9ca3af" }));

  // By constraint
  const constraintCounts = new Map<string, number>();
  for (const idea of ideas) {
    const c = idea.binding_constraint;
    if (c) constraintCounts.set(c, (constraintCounts.get(c) ?? 0) + 1);
  }
  const constraintColorMap: Record<string, string> = {
    energy: "#ca8a04", logistics: "#2563eb", skills: "#7c3aed",
    regulation: "#ea580c", crime: "#dc2626", labor_market: "#db2777",
    land: "#16a34a", digital: "#0891b2", government_capacity: "#374151", corruption: "#e11d48",
  };
  const byConstraint = [...constraintCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({
      name: (CONSTRAINT_LABELS as Record<string, string>)[k] ?? k,
      value: v,
      color: constraintColorMap[k] ?? "#9ca3af",
    }));

  // By package
  const pkgMap = new Map<number, { total: number; implemented: number }>();
  for (const idea of ideas) {
    const pkg = idea.reform_package;
    if (!pkg) continue;
    const cur = pkgMap.get(pkg) ?? { total: 0, implemented: 0 };
    cur.total++;
    if (idea.current_status === "implemented" || idea.current_status === "partially_implemented") {
      cur.implemented++;
    }
    pkgMap.set(pkg, cur);
  }
  const byPackage = [1, 2, 3, 4, 5]
    .filter((id) => pkgMap.has(id))
    .map((id) => {
      const { total, implemented } = pkgMap.get(id)!;
      return {
        name: PACKAGE_NAMES[id] ?? `Package ${id}`,
        total,
        implemented,
        withPlans: 0, // placeholder; will be overridden if we have per-package plan counts
      };
    });

  // By time horizon
  const horizonCounts = new Map<string, number>();
  for (const idea of ideas) {
    const h = idea.time_horizon ?? "unassigned";
    horizonCounts.set(h, (horizonCounts.get(h) ?? 0) + 1);
  }
  const horizonLabelMap: Record<string, string> = {
    quick_win: "Quick Win",
    medium_term: "Medium Term",
    long_term: "Long Term",
    unassigned: "Unassigned",
  };
  const byHorizon = ["quick_win", "medium_term", "long_term", "unassigned"]
    .filter((h) => horizonCounts.has(h))
    .map((h) => ({ name: horizonLabelMap[h], value: horizonCounts.get(h)!, color: "#9ca3af" }));

  return {
    totalIdeas,
    ideasWithPlans,
    implementedCount,
    quickWinsCount,
    dormantCount,
    byStatus,
    byConstraint,
    byPackage,
    byHorizon,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function ProgressPage() {
  const stats = await getProgressData();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-gray-900">Reform Progress Dashboard</h1>
        </div>
        <p className="text-sm text-gray-500 max-w-2xl">
          Coverage and progress statistics across all {stats.totalIdeas} policy ideas — showing
          implementation plan coverage, parliamentary status, and distribution by binding constraint,
          reform package, and time horizon.
        </p>
        <p className="text-[10px] text-gray-400 mt-2">
          Data refreshed hourly via ISR. Status classifications based on most recent parliamentary committee proceedings.
        </p>
        <div className="flex gap-3 mt-3">
          <Link href="/ideas" className="text-xs text-[#007A4D] hover:underline">
            Browse all ideas →
          </Link>
          <Link href="/analytics" className="text-xs text-[#007A4D] hover:underline">
            Policy analytics →
          </Link>
        </div>
      </div>

      <ProgressCharts stats={stats} />

      {/* Caveats */}
      <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
        Implementation plan counts reflect plans stored in the database; plans may be partial or in progress.
        &ldquo;Implemented / partial&rdquo; reflects parliamentary committee discussion status, not independent verification.
        Source data via PMG.
      </p>

    </div>
  );
}
