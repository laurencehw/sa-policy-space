/**
 * Production API layer — reads from Supabase PostgreSQL.
 * Mirrors the function signatures of local-api.ts so API routes can swap
 * between backends using a simple env-var check.
 * Import ONLY in server components and API routes.
 */

import { createClient } from "@supabase/supabase-js";
import reformPackagesData from "@/data/reform_packages.json";
import dependencyGraphData from "@/data/dependency_graph.json";
import { slugify } from "@/lib/utils";
import type { IdeaRow, IdeasResult, PackageSummary, PackageDetail, ComparisonRow } from "@/lib/local-api";

// Re-export interfaces so API routes have a stable import path
export type {
  StatsResult,
  IdeaRow,
  IdeasResult,
  ConstraintSummaryRow,
  PackageSummary,
  PackageDetail,
  TopPriorityIdea,
  TimeHorizonCounts,
  ComparisonRow,
} from "@/lib/local-api";

// Supabase client — this module is only imported when NEXT_PUBLIC_SUPABASE_URL is set
// (guarded by the api.ts dispatcher), so env vars are guaranteed present.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? (() => { throw new Error("NEXT_PUBLIC_SUPABASE_URL is required"); })(),
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? (() => { throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required"); })()
);

// ── Supabase query result shapes ──────────────────────────────────────────
// Lightweight interfaces matching the .select() projections used below.

interface MeetingDateJoin {
  date: string | null;
}

interface IdeaMeetingRow {
  idea_id: number;
  meeting_id: number;
  meetings: MeetingDateJoin | null;
}

interface IdeaListRow {
  id: number;
  title: string;
  description: string;
  binding_constraint: string;
  current_status: string;
  time_horizon: string | null;
  growth_impact_rating: number;
  feasibility_rating: number;
  times_raised: number;
  reform_package: number | null;
  source_committee: string | null;
}

interface MeetingRow {
  id: number;
  date: string;
  committee_name: string;
  title: string;
  pmg_url: string;
}

interface IdeaJoin {
  id: number;
  title: string;
  binding_constraint: string;
  reform_package: number | null;
  current_status: string;
}

interface GraphNode {
  id: number;
  title: string;
  [key: string]: unknown;
}

interface GraphLink {
  source: number;
  target: number;
  label: string;
}

// ── Stats ──────────────────────────────────────────────────────────────────

export async function getStats() {
  const [
    { count: totalIdeas },
    { count: meetingsAnalyzed },
    { data: constraintRows },
    { data: ideaMeetingDates },
  ] = await Promise.all([
    supabase.from("policy_ideas").select("*", { count: "exact", head: true }),
    supabase.from("meetings").select("*", { count: "exact", head: true }),
    supabase.from("policy_ideas").select("binding_constraint"),
    supabase.from("idea_meetings").select("idea_id, meetings(date)"),
  ]);

  const constraintsCovered = new Set(
    (constraintRows || []).map((r) => (r as { binding_constraint: string }).binding_constraint).filter(Boolean)
  ).size;

  // Dormant = ideas whose last meeting was > 12 months ago
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  const lastByIdea = new Map<number, string>();
  for (const row of (ideaMeetingDates || []) as unknown as IdeaMeetingRow[]) {
    const date = row.meetings?.date;
    if (!date) continue;
    const prev = lastByIdea.get(row.idea_id);
    if (!prev || date > prev) lastByIdea.set(row.idea_id, date);
  }
  const dormantIdeas = [...lastByIdea.values()].filter(
    (d) => d < cutoffStr
  ).length;

  return {
    totalIdeas: totalIdeas ?? 0,
    meetingsAnalyzed: meetingsAnalyzed ?? 0,
    constraintsCovered,
    dormantIdeas,
  };
}

// ── Ideas ──────────────────────────────────────────────────────────────────

export async function getIdeas(opts?: {
  search?: string;
  constraint?: string;
  status?: string;
  sort?: string;
  packageId?: number;
  timeHorizon?: string;
  limit?: number;
  offset?: number;
}): Promise<IdeasResult> {
  // Build a base query builder (applied to both count + data queries)
  function applyFilters(q: ReturnType<ReturnType<typeof supabase.from>["select"]>) {
    if (opts?.constraint) q = q.eq("binding_constraint", opts.constraint);
    if (opts?.status) q = q.eq("current_status", opts.status);
    if (opts?.packageId) q = q.eq("reform_package", opts.packageId);
    if (opts?.timeHorizon) q = q.eq("time_horizon", opts.timeHorizon);
    if (opts?.search) {
      const term = opts.search.toLowerCase().replace(/[%_\\(),.*]/g, (c) => `\\${c}`);
      q = q.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
    }
    return q;
  }

  // Count query (head-only, no data transfer)
  const { count: total } = await applyFilters(
    supabase.from("policy_ideas").select("*", { count: "exact", head: true })
  );

  // Data query with pagination
  let query = applyFilters(supabase.from("policy_ideas").select("*"));

  if (opts?.sort === "impact") {
    query = query
      .order("growth_impact_rating", { ascending: false })
      .order("times_raised", { ascending: false });
  } else {
    query = query.order("id", { ascending: false });
  }

  // Apply DB-level pagination via Supabase range()
  if (opts?.limit != null || opts?.offset != null) {
    const start = opts?.offset ?? 0;
    const end = start + (opts?.limit ?? 200) - 1;
    query = query.range(start, end);
  }

  const { data: ideas, error: ideasError } = await query;
  if (ideasError) {
    console.error("[supabase] getIdeas error:", ideasError);
    return { rows: [], total: 0 };
  }
  if (!ideas?.length) return { rows: [], total: total ?? 0 };

  // Fetch meeting dates for these ideas in one query
  const typedIdeas = ideas as unknown as Array<Record<string, unknown> & IdeaListRow>;
  const ideaIds = typedIdeas.map((i) => i.id);
  const { data: linkRows } = await supabase
    .from("idea_meetings")
    .select("idea_id, meetings(date)")
    .in("idea_id", ideaIds);

  // Group dates by idea_id
  const datesByIdea = new Map<number, string[]>();
  for (const row of (linkRows || []) as unknown as IdeaMeetingRow[]) {
    const date = row.meetings?.date;
    if (!date) continue;
    const arr = datesByIdea.get(row.idea_id) ?? [];
    arr.push(date);
    datesByIdea.set(row.idea_id, arr);
  }

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  const rows = typedIdeas.map((idea) => {
    const dates = (datesByIdea.get(idea.id) ?? []).sort();
    const first_raised = dates[0] ?? null;
    const last_discussed = dates[dates.length - 1] ?? null;
    const dormant =
      last_discussed && last_discussed < cutoffStr ? 1 : 0;
    return { ...idea, first_raised, last_discussed, dormant, slug: slugify(idea.title) } as IdeaRow;
  });

  return { rows, total: total ?? rows.length };
}

export async function getIdeaById(id: number) {
  const [{ data: idea, error: ideaError }, { data: linkRows }] = await Promise.all([
    supabase.from("policy_ideas").select("*").eq("id", id).single(),
    supabase.from("idea_meetings").select("meetings(date)").eq("idea_id", id),
  ]);

  if (ideaError) console.error("[supabase] getIdeaById error:", ideaError);
  if (!idea) return null;

  const dates = ((linkRows || []) as unknown as Array<{ meetings: MeetingDateJoin | null }>)
    .map((r) => r.meetings?.date)
    .filter((d): d is string => !!d)
    .sort();

  const first_raised = dates[0] ?? null;
  const last_discussed = dates[dates.length - 1] ?? null;
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const dormant = last_discussed && last_discussed < cutoffStr ? 1 : 0;

  return { ...idea, first_raised, last_discussed, dormant, slug: slugify(idea.title) };
}

export async function getIdeaBySlug(slug: string) {
  // Fast path: query by DB slug column if it exists (indexed, O(1))
  const { data: directMatch, error: directError } = await supabase
    .from("policy_ideas")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (!directError && directMatch) {
    return await getIdeaById(directMatch.id);
  }

  // Slow path: fetch all titles and compute slug client-side (fallback when
  // slug column is absent or slug doesn't match the DB value)
  const { data: rows, error: slugError } = await supabase
    .from("policy_ideas")
    .select("id, title");
  if (slugError) console.error("[supabase] getIdeaBySlug error:", slugError);
  if (!rows?.length) return null;
  const match = rows.find((r) => slugify(r.title) === slug);
  if (!match) return null;
  return await getIdeaById(match.id);
}

// ── Related ideas (same reform package) ───────────────────────────────────

export async function getRelatedIdeas(packageId: number, currentId: number): Promise<IdeaRow[]> {
  const { data } = await supabase
    .from("policy_ideas")
    .select("*")
    .eq("reform_package", packageId)
    .neq("id", currentId)
    .order("growth_impact_rating", { ascending: false })
    .limit(6);

  if (!data?.length) return [];

  // Fetch meeting dates so derived fields match the full getIdeas() contract
  const ideaIds = data.map((r) => (r as { id: number }).id);
  const { data: linkRows, error: linkError } = await supabase
    .from("idea_meetings")
    .select("idea_id, meetings(date)")
    .in("idea_id", ideaIds);
  if (linkError) console.error("[supabase] getRelatedIdeas idea_meetings error:", linkError);

  const datesByIdea = new Map<number, string[]>();
  for (const row of (linkRows || []) as unknown as IdeaMeetingRow[]) {
    const date = row.meetings?.date;
    if (!date) continue;
    const arr = datesByIdea.get(row.idea_id) ?? [];
    arr.push(date);
    datesByIdea.set(row.idea_id, arr);
  }

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  return data.map((r) => {
    const idea = r as unknown as Record<string, unknown> & IdeaListRow;
    const dates = (datesByIdea.get(idea.id) ?? []).sort();
    const first_raised = dates[0] ?? null;
    const last_discussed = dates[dates.length - 1] ?? null;
    const dormant = last_discussed && last_discussed < cutoffStr ? 1 : 0;
    return { ...idea, first_raised, last_discussed, dormant, slug: slugify(idea.title) } as IdeaRow;
  });
}

// ── Committees ─────────────────────────────────────────────────────────────

export async function getCommittees(): Promise<{ name: string; count: number }[]> {
  const { data } = await supabase
    .from("policy_ideas")
    .select("source_committee")
    .not("source_committee", "is", null)
    .neq("source_committee", "");

  if (!data?.length) return [];

  const counts = new Map<string, number>();
  for (const row of data) {
    if (row.source_committee) {
      counts.set(row.source_committee, (counts.get(row.source_committee) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

// ── Constraint summaries ───────────────────────────────────────────────────

export async function getConstraintSummaries() {
  const { data } = await supabase
    .from("policy_ideas")
    .select(
      "binding_constraint, growth_impact_rating, current_status"
    );

  if (!data?.length) return [];

  // Aggregate in JS (avoids needing a DB function)
  const agg = new Map<
    string,
    { total: number; impact_sum: number; stalled: number; implemented: number }
  >();

  for (const row of data) {
    const bc = row.binding_constraint;
    if (!bc) continue;
    const prev = agg.get(bc) ?? { total: 0, impact_sum: 0, stalled: 0, implemented: 0 };
    agg.set(bc, {
      total: prev.total + 1,
      impact_sum: prev.impact_sum + (row.growth_impact_rating ?? 0),
      stalled: prev.stalled + (row.current_status === "stalled" ? 1 : 0),
      implemented: prev.implemented + (row.current_status === "implemented" ? 1 : 0),
    });
  }

  return [...agg.entries()]
    .map(([binding_constraint, v]) => ({
      binding_constraint,
      total_ideas: v.total,
      avg_growth_impact: Math.round((v.impact_sum / v.total) * 10) / 10,
      stalled_count: v.stalled,
      implemented_count: v.implemented,
    }))
    .sort((a, b) => b.total_ideas - a.total_ideas);
}

// ── Implementation plans ───────────────────────────────────────────────────

export async function getImplementationPlan(ideaId: number) {
  // maybeSingle() avoids PGRST116 error when no plan exists (returns null, not error)
  const { data, error } = await supabase
    .from("implementation_plans")
    .select("*")
    .eq("idea_id", ideaId)
    .maybeSingle();

  if (error) console.error("[supabase] getImplementationPlan error:", error);
  if (!data) return null;

  // implementation_steps is JSONB in Postgres — already parsed by Supabase client
  return data;
}

// ── Source meetings for an idea ────────────────────────────────────────────

export async function getIdeaMeetings(ideaId: number) {
  const { data } = await supabase
    .from("idea_meetings")
    .select("meetings(*)")
    .eq("idea_id", ideaId)
    .order("idea_id"); // secondary order

  if (!data?.length) return [];

  // Unwrap nested meetings and sort by date desc
  return data
    .map((r) => (r as unknown as { meetings: MeetingRow | null }).meetings)
    .filter((m): m is MeetingRow => !!m)
    .sort((a, b) => (b.date > a.date ? 1 : -1))
    .map((m) => ({
      ...m,
      pmg_url: m.pmg_url?.replace(/https?:\/\/api\.pmg\.org\.za\//g, "https://pmg.org.za/"),
    }));
}

// ── Reform packages (bundled JSON, no DB needed) ──────────────────────────

export function getPackageSummaries(): PackageSummary[] {
  return Object.values(reformPackagesData) as PackageSummary[];
}

export async function getPackageTimeHorizonCounts() {
  const { data } = await supabase
    .from("policy_ideas")
    .select("reform_package, time_horizon")
    .not("reform_package", "is", null);

  const result: Record<
    number,
    { quick_win: number; medium_term: number; long_term: number }
  > = {};

  for (const row of data || []) {
    const pkg = row.reform_package as number;
    const hz = row.time_horizon as string;
    if (!result[pkg]) result[pkg] = { quick_win: 0, medium_term: 0, long_term: 0 };
    if (hz === "quick_win") result[pkg].quick_win++;
    else if (hz === "medium_term") result[pkg].medium_term++;
    else if (hz === "long_term") result[pkg].long_term++;
  }

  return result;
}

export async function getPackageDetail(packageId: number): Promise<PackageDetail | null> {
  const summaries = getPackageSummaries();
  const summary = summaries.find((s) => s.package_id === packageId);
  if (!summary) return null;

  const { rows: ideas } = await getIdeas({ packageId });

  const ideas_by_horizon: PackageDetail["ideas_by_horizon"] = {
    quick_win: ideas.filter((i) => i.time_horizon === "quick_win"),
    medium_term: ideas.filter((i) => i.time_horizon === "medium_term"),
    long_term: ideas.filter((i) => i.time_horizon === "long_term"),
    unassigned: ideas.filter((i) => !i.time_horizon),
  };

  // Read dependency graph (bundled at build time)
  let dependencies: PackageDetail["dependencies"] = [];
  try {
    const graph = dependencyGraphData as { nodes: GraphNode[]; links: GraphLink[] };
    const ideaIdSet = new Set(summary.idea_ids);
    const nodeMap = new Map<number, string>(
      graph.nodes.map((n) => [n.id, n.title])
    );
    dependencies = graph.links
      .filter((l) => ideaIdSet.has(l.source) && ideaIdSet.has(l.target))
      .map((l) => ({
        source: l.source,
        target: l.target,
        label: l.label,
        source_title: nodeMap.get(l.source) ?? `Idea #${l.source}`,
        target_title: nodeMap.get(l.target) ?? `Idea #${l.target}`,
      }));
  } catch {
    // dependency graph missing — non-fatal
  }

  return { ...summary, ideas_by_horizon, dependencies };
}

// ── International comparisons ─────────────────────────────────────────────

interface ComparisonJoinRow {
  id: number;
  idea_id: number;
  country: string;
  iso3: string | null;
  reform_year: number | null;
  outcome_summary: string;
  approach: string | null;
  gdp_impact: string | null;
  timeline: string | null;
  lessons_for_sa: string | null;
  sources: string[] | null;
  source_url: string | null;
  source_label: string | null;
  created_at: string;
  policy_ideas: { id: number; title: string; binding_constraint: string } | null;
}

export async function getComparisons(opts?: { country?: string; constraint?: string }): Promise<ComparisonRow[]> {
  let query = supabase
    .from("international_comparisons")
    .select("*, policy_ideas(id, title, binding_constraint)")
    .order("country");

  if (opts?.country) query = query.eq("country", opts.country);

  const { data, error } = await query;
  if (error) {
    console.error("[supabase] getComparisons error:", error);
    return [];
  }
  if (!data?.length) return [];

  return (data as unknown as ComparisonJoinRow[])
    .map((r) => ({
      ...r,
      idea_id: r.policy_ideas?.id ?? r.idea_id,
      idea_title: r.policy_ideas?.title ?? "",
      idea_slug: slugify(r.policy_ideas?.title ?? ""),
      binding_constraint: r.policy_ideas?.binding_constraint ?? "",
      policy_ideas: undefined,
    }))
    .filter((r) => !opts?.constraint || r.binding_constraint === opts.constraint);
}

export async function getIdeaComparisons(ideaId: number): Promise<ComparisonRow[]> {
  const { data, error } = await supabase
    .from("international_comparisons")
    .select("*, policy_ideas(id, title, binding_constraint)")
    .eq("idea_id", ideaId)
    .order("country");

  if (error) {
    console.error("[supabase] getIdeaComparisons error:", error);
    return [];
  }
  if (!data?.length) return [];

  return (data as unknown as ComparisonJoinRow[]).map((r) => ({
    ...r,
    idea_title: r.policy_ideas?.title ?? "",
    idea_slug: slugify(r.policy_ideas?.title ?? ""),
    binding_constraint: r.policy_ideas?.binding_constraint ?? "",
    policy_ideas: undefined,
  }));
}

// ── Timeline data ────────────────────────────────────────────────────────

export async function getTimelineData() {
  const [{ data: allMeetings }, { data: linkRows }] = await Promise.all([
    supabase
      .from("meetings")
      .select("id, date, committee_name, title, pmg_url")
      .order("date", { ascending: false }),
    supabase
      .from("idea_meetings")
      .select("meeting_id, policy_ideas(id, title, reform_package, current_status)"),
  ]);

  const ideasByMeeting = new Map<number, Array<{
    id: number; title: string; slug: string;
    reform_package: number | null; current_status: string;
  }>>();
  for (const row of (linkRows || []) as unknown as Array<{ meeting_id: number; policy_ideas: IdeaJoin | null }>) {
    const idea = row.policy_ideas;
    if (!idea) continue;
    const arr = ideasByMeeting.get(row.meeting_id) ?? [];
    arr.push({
      id: idea.id,
      title: idea.title,
      slug: slugify(idea.title),
      reform_package: idea.reform_package,
      current_status: idea.current_status,
    });
    ideasByMeeting.set(row.meeting_id, arr);
  }

  return ((allMeetings || []) as unknown as MeetingRow[])
    .filter((m) => ideasByMeeting.has(m.id))
    .map((m) => ({
      id: m.id,
      date: m.date,
      committee_name: m.committee_name,
      title: m.title,
      pmg_url: m.pmg_url?.replace(/https?:\/\/api\.pmg\.org\.za\//g, "https://pmg.org.za/"),
      ideas: ideasByMeeting.get(m.id) ?? [],
    }));
}
