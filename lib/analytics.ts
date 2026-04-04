/**
 * Analytics utilities for SA Policy Space.
 * Computes network centrality (betweenness + PageRank) and reform momentum scores.
 * Pure functions — no DB calls, no async I/O.
 */

import type { IdeaRow } from "@/lib/local-api";

// ── Graph types ───────────────────────────────────────────────────────────

export interface GraphNode {
  id: number;
  title: string;
  source_committee?: string | null;
  reform_package?: number | null;
  current_status?: string | null;
  growth_impact_rating?: number | null;
  [key: string]: unknown;
}

export interface GraphLink {
  source: number;
  target: number;
  label?: string;
}

export interface DependencyGraph {
  nodes: GraphNode[];
  links: GraphLink[];
  directed?: boolean;
}

// ── Centrality output type ────────────────────────────────────────────────

export interface NodeCentrality {
  id: number;
  title: string;
  betweenness_norm: number; // 0–1
  pagerank_norm: number;    // 0–1
  keystoneScore: number;    // 0–100 composite
  in_degree: number;
  out_degree: number;
  reform_package: number | null;
  source_committee: string | null;
  current_status: string | null;
  growth_impact_rating: number | null;
}

// ── Momentum output type ──────────────────────────────────────────────────

export interface MomentumScore {
  id: number;
  title: string;
  momentum_score: number;         // 0–100
  times_raised: number;
  last_discussed: string | null;
  months_since_discussed: number | null;
  reform_package: number | null;
  source_committee: string | null;
  current_status: string;
}

// ── PageRank ──────────────────────────────────────────────────────────────

function computePageRank(
  nodes: GraphNode[],
  links: GraphLink[],
  damping = 0.85,
  iterations = 50
): Map<number, number> {
  const N = nodes.length;
  const ids = nodes.map((n) => n.id);
  const idx = new Map(ids.map((id, i) => [id, i]));

  const outEdges: number[][] = Array.from({ length: N }, () => []);
  const inEdges: number[][] = Array.from({ length: N }, () => []);

  for (const l of links) {
    const s = idx.get(l.source);
    const t = idx.get(l.target);
    if (s !== undefined && t !== undefined) {
      outEdges[s].push(t);
      inEdges[t].push(s);
    }
  }

  let rank = new Float64Array(N).fill(1 / N);

  for (let iter = 0; iter < iterations; iter++) {
    const next = new Float64Array(N).fill((1 - damping) / N);

    // Dangling-node mass redistributed uniformly
    let dangling = 0;
    for (let u = 0; u < N; u++) {
      if (outEdges[u].length === 0) dangling += rank[u];
    }
    const danglingContrib = (damping * dangling) / N;

    for (let v = 0; v < N; v++) {
      next[v] += danglingContrib;
      for (const u of inEdges[v]) {
        next[v] += (damping * rank[u]) / outEdges[u].length;
      }
    }
    rank = next;
  }

  return new Map(ids.map((id, i) => [id, rank[i]]));
}

// ── Betweenness centrality (Brandes algorithm) ────────────────────────────

function computeBetweenness(
  nodes: GraphNode[],
  links: GraphLink[]
): Map<number, number> {
  const N = nodes.length;
  const ids = nodes.map((n) => n.id);
  const idx = new Map(ids.map((id, i) => [id, i]));

  const adj: number[][] = Array.from({ length: N }, () => []);
  for (const l of links) {
    const s = idx.get(l.source);
    const t = idx.get(l.target);
    if (s !== undefined && t !== undefined) adj[s].push(t);
  }

  const cb = new Float64Array(N);

  for (let s = 0; s < N; s++) {
    const stack: number[] = [];
    const pred: number[][] = Array.from({ length: N }, () => []);
    const sigma = new Float64Array(N);
    sigma[s] = 1;
    const dist = new Int32Array(N).fill(-1);
    dist[s] = 0;

    const queue: number[] = [s];
    let qi = 0;

    while (qi < queue.length) {
      const v = queue[qi++];
      stack.push(v);
      for (const w of adj[v]) {
        if (dist[w] < 0) {
          queue.push(w);
          dist[w] = dist[v] + 1;
        }
        if (dist[w] === dist[v] + 1) {
          sigma[w] += sigma[v];
          pred[w].push(v);
        }
      }
    }

    const delta = new Float64Array(N);
    while (stack.length > 0) {
      const w = stack.pop()!;
      for (const v of pred[w]) {
        delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
      }
      if (w !== s) cb[w] += delta[w];
    }
  }

  return new Map(ids.map((id, i) => [id, cb[i]]));
}

// ── Public: network centrality ────────────────────────────────────────────

export function computeNetworkCentrality(graph: DependencyGraph): NodeCentrality[] {
  const { nodes, links } = graph;
  if (nodes.length === 0) return [];

  const prMap = computePageRank(nodes, links);
  const btMap = computeBetweenness(nodes, links);

  const inDeg = new Map<number, number>();
  const outDeg = new Map<number, number>();
  for (const n of nodes) { inDeg.set(n.id, 0); outDeg.set(n.id, 0); }
  for (const l of links) {
    outDeg.set(l.source, (outDeg.get(l.source) ?? 0) + 1);
    inDeg.set(l.target, (inDeg.get(l.target) ?? 0) + 1);
  }

  const maxBt = Math.max(...btMap.values(), 1e-9);
  const maxPr = Math.max(...prMap.values(), 1e-9);

  return nodes
    .map((n) => {
      const bt = btMap.get(n.id) ?? 0;
      const pr = prMap.get(n.id) ?? 0;
      const bt_norm = bt / maxBt;
      const pr_norm = pr / maxPr;
      return {
        id: n.id,
        title: n.title,
        betweenness_norm: Math.round(bt_norm * 1000) / 1000,
        pagerank_norm: Math.round(pr_norm * 1000) / 1000,
        keystoneScore: Math.round((0.5 * bt_norm + 0.5 * pr_norm) * 100),
        in_degree: inDeg.get(n.id) ?? 0,
        out_degree: outDeg.get(n.id) ?? 0,
        reform_package: (n.reform_package as number) ?? null,
        source_committee: (n.source_committee as string) ?? null,
        current_status: (n.current_status as string) ?? null,
        growth_impact_rating: (n.growth_impact_rating as number) ?? null,
      };
    })
    .sort((a, b) => b.keystoneScore - a.keystoneScore);
}

// ── Public: momentum scoring ──────────────────────────────────────────────

const STATUS_MOMENTUM: Record<string, number> = {
  implemented:  0.40,
  debated:      1.00,
  drafted:      0.85,
  under_review: 0.80,
  proposed:     0.60,
  stalled:      0.20,
  abandoned:    0.00,
};

export function computeMomentumScores(ideas: IdeaRow[]): MomentumScore[] {
  if (ideas.length === 0) return [];

  const maxRaised = Math.max(...ideas.map((i) => i.times_raised ?? 0), 1);
  const now = new Date();

  return ideas
    .map((idea) => {
      const raisedNorm = (idea.times_raised ?? 0) / maxRaised;

      let months_since: number | null = null;
      let recencyWeight = 0.5; // fallback when no meeting date
      if (idea.last_discussed) {
        const last = new Date(idea.last_discussed);
        const lastTime = last.getTime();
        // Guard against invalid date strings producing NaN
        if (!isNaN(lastTime)) {
          months_since = Math.max(
            0,
            (now.getTime() - lastTime) / (1000 * 60 * 60 * 24 * 30.44)
          );
          recencyWeight = Math.exp(-0.08 * months_since);
        }
      }

      const statusWeight = STATUS_MOMENTUM[idea.current_status] ?? 0.5;

      const score = Math.min(
        100,
        Math.round(raisedNorm * 40 + recencyWeight * 40 + statusWeight * 20)
      );

      return {
        id: idea.id,
        title: idea.title,
        momentum_score: score,
        times_raised: idea.times_raised ?? 0,
        last_discussed: idea.last_discussed,
        months_since_discussed:
          months_since !== null ? Math.round(months_since) : null,
        reform_package: idea.reform_package,
        source_committee: idea.source_committee,
        current_status: idea.current_status,
      };
    })
    .sort((a, b) => b.momentum_score - a.momentum_score);
}
