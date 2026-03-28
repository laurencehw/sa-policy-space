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

/** Dynamically import the active backend module. */
function backend() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
    ? import("@/lib/supabase-api")
    : import("@/lib/local-api");
}

// ── Stats ──────────────────────────────────────────────────────────────────

export async function getStats(): Promise<StatsResult> {
  return (await backend()).getStats();
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
  return (await backend()).getIdeas(opts);
}

export async function getIdeaById(id: number): Promise<IdeaRow | null> {
  return (await backend()).getIdeaById(id);
}

export async function getIdeaBySlug(slug: string): Promise<IdeaRow | null> {
  return (await backend()).getIdeaBySlug(slug);
}

export async function getRelatedIdeas(packageId: number, excludeId: number): Promise<IdeaRow[]> {
  return (await backend()).getRelatedIdeas(packageId, excludeId);
}

// ── Implementation Plans ────────────────────────────────────────────────────

export async function getImplementationPlan(ideaId: number) {
  return (await backend()).getImplementationPlan(ideaId);
}

// ── Meetings ────────────────────────────────────────────────────────────────

export async function getIdeaMeetings(ideaId: number) {
  return (await backend()).getIdeaMeetings(ideaId);
}

// ── Constraints / Themes ────────────────────────────────────────────────────

export async function getConstraintSummaries(): Promise<ConstraintSummaryRow[]> {
  return (await backend()).getConstraintSummaries();
}

// ── Packages ────────────────────────────────────────────────────────────────

export async function getPackageSummaries(): Promise<PackageSummary[]> {
  return (await backend()).getPackageSummaries();
}

export async function getPackageTimeHorizonCounts(): Promise<Record<number, TimeHorizonCounts>> {
  return (await backend()).getPackageTimeHorizonCounts();
}

export async function getPackageDetail(packageId: number): Promise<PackageDetail | null> {
  return (await backend()).getPackageDetail(packageId);
}

// ── Comparisons ─────────────────────────────────────────────────────────────

export async function getComparisons(opts?: {
  country?: string;
  constraint?: string;
}): Promise<ComparisonRow[]> {
  return (await backend()).getComparisons(opts);
}

export async function getIdeaComparisons(ideaId: number): Promise<ComparisonRow[]> {
  return (await backend()).getIdeaComparisons(ideaId);
}

// ── Timeline ────────────────────────────────────────────────────────────────

export async function getTimelineData() {
  return (await backend()).getTimelineData();
}

// ── Committees ──────────────────────────────────────────────────────────────

export async function getCommittees() {
  return (await backend()).getCommittees();
}
