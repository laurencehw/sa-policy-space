/**
 * Reform sequencing analysis for SA Policy Space.
 * Computes topological waves, critical path, bottleneck reforms, and priority scores.
 * Pure functions — no DB calls, no async I/O.
 */

import type { DependencyGraph } from "@/lib/analytics";

// ── Types ──────────────────────────────────────────────────────────────────

export interface SequencedReform {
  id: number;
  title: string;
  wave: number;               // 0-indexed wave number
  reform_package: number | null;
  package_name: string | null;
  current_status: string | null;
  feasibility_rating: number | null;
  growth_impact_rating: number | null;
  time_horizon: string | null;
  priority_score: number;     // 0–100 composite
  downstream_count: number;   // reforms this unlocks (direct + indirect)
  upstream_count: number;     // reforms this depends on (direct + indirect)
  in_cycle: boolean;          // true if part of a dependency cycle
}

export interface CriticalPathNode {
  id: number;
  title: string;
  wave: number;
}

export interface SequencingResult {
  reforms: SequencedReform[];              // All reforms with wave assignments
  waves: SequencedReform[][];             // Grouped by wave (index = wave number)
  criticalPath: CriticalPathNode[];        // Longest sequential dependency chain
  bottlenecks: SequencedReform[];          // Top 10 reforms blocking most downstream
  cycleNodeIds: number[];                  // Node IDs caught in dependency cycles
  totalWaves: number;
  /** id → { enables: target ids, enabledBy: source ids } — for interactive UI */
  directLinks: Record<number, { enables: number[]; enabledBy: number[] }>;
}

// ── Internal helpers ───────────────────────────────────────────────────────

/** Edges that define sequencing order (skip "tension" edges). */
function isSeqEdge(type: string | undefined): boolean {
  return !type || type === "enables" || type === "depends_on";
}

// ── Public: compute sequencing ─────────────────────────────────────────────

/**
 * Compute reform waves, critical path, and bottlenecks from the dependency graph.
 *
 * @param graph       The full dependency graph (nodes + links).
 * @param centralityMap  Optional map of id → keystoneScore (0–100) for priority weighting.
 */
export function computeSequencing(
  graph: DependencyGraph,
  centralityMap?: Map<number, number>
): SequencingResult {
  const { nodes, links } = graph;

  const empty: SequencingResult = {
    reforms: [],
    waves: [],
    criticalPath: [],
    bottlenecks: [],
    cycleNodeIds: [],
    totalWaves: 0,
    directLinks: {},
  };
  if (nodes.length === 0) return empty;

  const nodeIds = new Set(nodes.map((n) => n.id));
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Build forward/backward adjacency from sequencing edges only
  const outEdges = new Map<number, number[]>();
  const inEdges = new Map<number, number[]>();
  for (const id of nodeIds) {
    outEdges.set(id, []);
    inEdges.set(id, []);
  }

  // Also build full direct-link map (enables + depends_on + tension) for the UI
  const directLinks: Record<number, { enables: number[]; enabledBy: number[] }> = {};
  for (const id of nodeIds) {
    directLinks[id] = { enables: [], enabledBy: [] };
  }

  for (const link of links) {
    if (!nodeIds.has(link.source) || !nodeIds.has(link.target)) continue;
    const type = (link as { type?: string }).type;
    // Track all non-tension edges for the direct-link UI
    if (type !== "tension") {
      directLinks[link.source].enables.push(link.target);
      directLinks[link.target].enabledBy.push(link.source);
    }
    // Only sequencing edges for wave/topology computation
    if (isSeqEdge(type)) {
      outEdges.get(link.source)!.push(link.target);
      inEdges.get(link.target)!.push(link.source);
    }
  }

  // ── Kahn's BFS: wave assignment ──────────────────────────────────────────

  const inDeg = new Map<number, number>();
  for (const id of nodeIds) {
    inDeg.set(id, (inEdges.get(id) ?? []).length);
  }

  const waveOf = new Map<number, number>();
  let currentBatch: number[] = [];
  for (const id of nodeIds) {
    if ((inDeg.get(id) ?? 0) === 0) {
      currentBatch.push(id);
      waveOf.set(id, 0);
    }
  }

  const topoOrder: number[] = [];
  let currentWave = 0;

  while (currentBatch.length > 0) {
    const nextBatch: number[] = [];
    for (const u of currentBatch) {
      topoOrder.push(u);
      for (const v of outEdges.get(u) ?? []) {
        const newDeg = (inDeg.get(v) ?? 1) - 1;
        inDeg.set(v, newDeg);
        // v's wave = latest predecessor wave + 1
        const candidateWave = (waveOf.get(u) ?? 0) + 1;
        if (candidateWave > (waveOf.get(v) ?? 0)) {
          waveOf.set(v, candidateWave);
        }
        if (newDeg === 0) {
          nextBatch.push(v);
        }
      }
    }
    currentBatch = nextBatch;
    currentWave++;
  }

  // Nodes absent from topoOrder are in cycles → assign to max wave + 1
  const processedIds = new Set(topoOrder);
  const cycleNodeIds: number[] = [];
  const maxDagWave = waveOf.size > 0 ? Math.max(...waveOf.values()) : 0;
  for (const id of nodeIds) {
    if (!processedIds.has(id)) {
      cycleNodeIds.push(id);
      waveOf.set(id, maxDagWave + 1);
    }
  }

  // ── Downstream / upstream counts ─────────────────────────────────────────
  // Compute reachable set from each node via DFS (with visited guard for cycles)

  function reachableCount(startId: number, adj: Map<number, number[]>): number {
    const visited = new Set<number>();
    const stack = [startId];
    while (stack.length > 0) {
      const curr = stack.pop()!;
      for (const next of adj.get(curr) ?? []) {
        if (!visited.has(next) && next !== startId) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
    return visited.size;
  }

  const downstreamCount = new Map<number, number>();
  const upstreamCount = new Map<number, number>();
  for (const id of nodeIds) {
    downstreamCount.set(id, reachableCount(id, outEdges));
    upstreamCount.set(id, reachableCount(id, inEdges));
  }

  // ── Priority score ─────────────────────────────────────────────────────
  // 40% keystone centrality + 30% feasibility + 30% downstream reach

  const maxDownstream = Math.max(1, ...downstreamCount.values());
  const cycleSet = new Set(cycleNodeIds);

  const reforms: SequencedReform[] = nodes.map((n) => {
    const raw = nodeMap.get(n.id)!;
    const feas = (raw["feasibility_rating"] as number | null) ?? null;
    const feasNorm = feas != null ? feas / 5 : 0.4; // default mid if missing
    const keystoneNorm = (centralityMap?.get(n.id) ?? 0) / 100;
    const downstreamNorm = (downstreamCount.get(n.id) ?? 0) / maxDownstream;
    const priority = Math.round(keystoneNorm * 40 + feasNorm * 30 + downstreamNorm * 30);

    return {
      id: n.id,
      title: n.title,
      wave: waveOf.get(n.id) ?? 0,
      reform_package: (raw["reform_package"] as number) ?? null,
      package_name: (raw["package_name"] as string) ?? null,
      current_status: (raw["current_status"] as string) ?? null,
      feasibility_rating: feas,
      growth_impact_rating: (raw["growth_impact_rating"] as number | null) ?? null,
      time_horizon: (raw["time_horizon"] as string) ?? null,
      priority_score: priority,
      downstream_count: downstreamCount.get(n.id) ?? 0,
      upstream_count: upstreamCount.get(n.id) ?? 0,
      in_cycle: cycleSet.has(n.id),
    };
  });

  // ── Group by wave ─────────────────────────────────────────────────────

  const totalWaves = (waveOf.size > 0 ? Math.max(...waveOf.values()) : 0) + 1;
  const waves: SequencedReform[][] = Array.from({ length: totalWaves }, () => []);
  for (const r of reforms) {
    waves[r.wave].push(r);
  }
  for (const w of waves) {
    w.sort((a, b) => b.priority_score - a.priority_score);
  }

  // ── Critical path (longest chain in DAG) ─────────────────────────────────
  // DP in topological order: longest[v] = length of longest path ENDING at v

  const longest = new Map<number, number>();
  const longestPrev = new Map<number, number | null>();
  for (const id of nodeIds) {
    longest.set(id, 0);
    longestPrev.set(id, null);
  }

  for (const u of topoOrder) {
    const lu = longest.get(u) ?? 0;
    for (const v of outEdges.get(u) ?? []) {
      if (lu + 1 > (longest.get(v) ?? 0)) {
        longest.set(v, lu + 1);
        longestPrev.set(v, u);
      }
    }
  }

  // Find the node at the end of the longest chain
  let cpEnd = topoOrder[0] ?? -1;
  let cpLen = 0;
  for (const [id, len] of longest) {
    if (len > cpLen) {
      cpLen = len;
      cpEnd = id;
    }
  }

  // Trace back from cpEnd
  const criticalPath: CriticalPathNode[] = [];
  let curr: number | null = cpEnd;
  while (curr !== null) {
    const raw = nodeMap.get(curr);
    if (raw) {
      criticalPath.unshift({
        id: curr,
        title: raw.title,
        wave: waveOf.get(curr) ?? 0,
      });
    }
    curr = longestPrev.get(curr) ?? null;
  }

  // ── Bottlenecks ────────────────────────────────────────────────────────

  const bottlenecks = [...reforms]
    .filter((r) => !r.in_cycle && r.downstream_count > 0)
    .sort((a, b) => b.downstream_count - a.downstream_count)
    .slice(0, 10);

  return {
    reforms,
    waves,
    criticalPath,
    bottlenecks,
    cycleNodeIds,
    totalWaves,
    directLinks,
  };
}
