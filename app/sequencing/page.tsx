export const revalidate = 3600; // Recomputes from static JSON — cache for 1 hour

import type { Metadata } from "next";
import dependencyGraphData from "@/data/dependency_graph.json";
import { computeNetworkCentrality } from "@/lib/analytics";
import { computeSequencing } from "@/lib/sequencing";
import SequencingClient from "./SequencingClient";

export const metadata: Metadata = {
  title: "Reform Sequencing — SA Policy Space",
  description:
    "Optimal sequencing of South African policy reforms: dependency waves, critical path, and bottleneck identification.",
};

export default function SequencingPage() {
  // Build centrality map (id → keystoneScore) for priority weighting
  const centralityRankings = computeNetworkCentrality(dependencyGraphData as Parameters<typeof computeNetworkCentrality>[0]);
  const centralityMap = new Map(centralityRankings.map((n) => [n.id, n.keystoneScore]));

  const result = computeSequencing(
    dependencyGraphData as Parameters<typeof computeSequencing>[0],
    centralityMap
  );

  // Build a plain id→reform lookup (serialisable for the client component)
  const reformsById: Record<number, (typeof result.reforms)[number]> = {};
  for (const r of result.reforms) {
    reformsById[r.id] = r;
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reform Sequencing</h1>
        <p className="mt-2 text-gray-500 text-sm max-w-2xl">
          Optimal implementation order derived from the dependency graph.
          Reforms are grouped into <strong>waves</strong> — groups that can proceed in parallel
          once their predecessors are complete. The <strong>critical path</strong> is the longest
          sequential chain; <strong>bottlenecks</strong> are reforms that block the most downstream activity.
        </p>
        <p className="mt-1 text-gray-400 text-xs">
          Based on {result.reforms.length} reforms · {Object.keys(result.directLinks).reduce(
            (sum, id) => sum + (result.directLinks[+id]?.enables.length ?? 0), 0
          )} sequencing edges · {result.totalWaves} waves · critical path {result.criticalPath.length} steps long
        </p>
      </div>

      <SequencingClient
        waves={result.waves}
        criticalPath={result.criticalPath}
        bottlenecks={result.bottlenecks}
        cycleNodeIds={result.cycleNodeIds}
        directLinks={result.directLinks}
        reformsById={reformsById}
      />
    </div>
  );
}
