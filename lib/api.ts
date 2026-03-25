/**
 * Unified API dispatcher — resolves to local-api (SQLite) or supabase-api
 * based on the NEXT_PUBLIC_SUPABASE_URL environment variable.
 *
 * Every exported function returns a Promise regardless of backend,
 * so callers never need to know which backend is active.
 *
 * Import this module (not local-api or supabase-api directly) in API routes
 * and server components.
 */

import type {
  StatsResult,
  IdeaRow,
  ConstraintSummaryRow,
  PackageSummary,
  PackageDetail,
  TimeHorizonCounts,
  ComparisonRow,
} from "@/lib/local-api";

export type {
  StatsResult,
  IdeaRow,
  ConstraintSummaryRow,
  PackageSummary,
  PackageDetail,
  TimeHorizonCounts,
  ComparisonRow,
};

const isSupabase = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL;

// ── Stats ──────────────────────────────────────────────────────────────────

export async function getStats(): Promise<StatsResult> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getStats();
  }
  const mod = await import("@/lib/local-api");
  return mod.getStats();
}

// ── Ideas ──────────────────────────────────────────────────────────────────

export async function getIdeas(opts?: {
  search?: string;
  constraint?: string;
  status?: string;
  sort?: string;
  packageId?: number;
  timeHorizon?: string;
}): Promise<IdeaRow[]> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getIdeas(opts);
  }
  const mod = await import("@/lib/local-api");
  return mod.getIdeas(opts);
}

export async function getIdeaById(id: number): Promise<IdeaRow | null> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getIdeaById(id);
  }
  const mod = await import("@/lib/local-api");
  return mod.getIdeaById(id);
}

export async function getIdeaBySlug(slug: string): Promise<IdeaRow | null> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getIdeaBySlug(slug);
  }
  const mod = await import("@/lib/local-api");
  return mod.getIdeaBySlug(slug);
}

export async function getRelatedIdeas(packageId: number, excludeId: number): Promise<IdeaRow[]> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getRelatedIdeas(packageId, excludeId);
  }
  const mod = await import("@/lib/local-api");
  return mod.getRelatedIdeas(packageId, excludeId);
}

// ── Implementation Plans ────────────────────────────────────────────────────

export async function getImplementationPlan(ideaId: number) {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getImplementationPlan(ideaId);
  }
  const mod = await import("@/lib/local-api");
  return mod.getImplementationPlan(ideaId);
}

// ── Meetings ────────────────────────────────────────────────────────────────

export async function getIdeaMeetings(ideaId: number) {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getIdeaMeetings(ideaId);
  }
  const mod = await import("@/lib/local-api");
  return mod.getIdeaMeetings(ideaId);
}

// ── Constraints / Themes ────────────────────────────────────────────────────

export async function getConstraintSummaries(): Promise<ConstraintSummaryRow[]> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getConstraintSummaries();
  }
  const mod = await import("@/lib/local-api");
  return mod.getConstraintSummaries();
}

// ── Packages ────────────────────────────────────────────────────────────────

export async function getPackageSummaries(): Promise<PackageSummary[]> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getPackageSummaries();
  }
  const mod = await import("@/lib/local-api");
  return mod.getPackageSummaries();
}

export async function getPackageTimeHorizonCounts(): Promise<Record<number, TimeHorizonCounts>> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getPackageTimeHorizonCounts();
  }
  const mod = await import("@/lib/local-api");
  return mod.getPackageTimeHorizonCounts();
}

export async function getPackageDetail(packageId: number): Promise<PackageDetail | null> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getPackageDetail(packageId);
  }
  const mod = await import("@/lib/local-api");
  return mod.getPackageDetail(packageId);
}

// ── Comparisons ─────────────────────────────────────────────────────────────

export async function getComparisons(opts?: {
  country?: string;
  constraint?: string;
}): Promise<ComparisonRow[]> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getComparisons(opts);
  }
  const mod = await import("@/lib/local-api");
  return mod.getComparisons(opts);
}

export async function getIdeaComparisons(ideaId: number): Promise<ComparisonRow[]> {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getIdeaComparisons(ideaId);
  }
  const mod = await import("@/lib/local-api");
  return mod.getIdeaComparisons(ideaId);
}

// ── Timeline ────────────────────────────────────────────────────────────────

export async function getTimelineData() {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getTimelineData();
  }
  const mod = await import("@/lib/local-api");
  return mod.getTimelineData();
}

// ── Committees ──────────────────────────────────────────────────────────────

export async function getCommittees() {
  if (isSupabase()) {
    const mod = await import("@/lib/supabase-api");
    return mod.getCommittees();
  }
  const mod = await import("@/lib/local-api");
  return mod.getCommittees();
}
