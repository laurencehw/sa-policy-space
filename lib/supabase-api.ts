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

// Re-export interfaces so API routes have a stable import path
export type {
  StatsResult,
  IdeaRow,
  ConstraintSummaryRow,
  PackageSummary,
  PackageDetail,
  TopPriorityIdea,
  TimeHorizonCounts,
} from "@/lib/local-api";

// Supabase client — env vars are guaranteed present when this module is used
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
    (constraintRows || []).map((r: any) => r.binding_constraint).filter(Boolean)
  ).size;

  // Dormant = ideas whose last meeting was > 12 months ago
  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 1);
  const cutoffStr = cutoff.toISOString().split("T")[0];

  const lastByIdea = new Map<number, string>();
  for (const row of ideaMeetingDates || []) {
    const date = (row.meetings as any)?.date;
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
}) {
  // Fetch matching ideas — select only columns needed for list/filter views
  let query = supabase.from("policy_ideas").select(
    "id, title, description, binding_constraint, current_status, time_horizon, " +
    "growth_impact_rating, feasibility_rating, times_raised, reform_package, source_committee, slug"
  );

  if (opts?.constraint) query = query.eq("binding_constraint", opts.constraint);
  if (opts?.status) query = query.eq("current_status", opts.status);
  if (opts?.packageId) query = query.eq("reform_package", opts.packageId);
  if (opts?.timeHorizon) query = query.eq("time_horizon", opts.timeHorizon);
  if (opts?.search) {
    const term = opts.search.toLowerCase();
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  if (opts?.sort === "impact") {
    query = query
      .order("growth_impact_rating", { ascending: false })
      .order("times_raised", { ascending: false });
  } else {
    query = query.order("id", { ascending: false });
  }

  const { data: ideas, error: ideasError } = await query;
  if (ideasError) {
    console.error("[supabase] getIdeas error:", ideasError);
    return [];
  }
  if (!ideas?.length) return [];

  // Fetch meeting dates for these ideas in one query
  const ideaIds = ideas.map((i: any) => i.id);
  const { data: linkRows } = await supabase
    .from("idea_meetings")
    .select("idea_id, meetings(date)")
    .in("idea_id", ideaIds);

  // Group dates by idea_id
  const datesByIdea = new Map<number, string[]>();
  for (const row of linkRows || []) {
    const date = (row.meetings as any)?.date;
    if (!date) continue;
    const arr = datesByIdea.get(row.idea_id) ?? [];
    arr.push(date);
    datesByIdea.set(row.idea_id, arr);
  }

  const cutoffStr = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return ideas.map((idea: any) => {
    const dates = (datesByIdea.get(idea.id) ?? []).sort();
    const first_raised = dates[0] ?? null;
    const last_discussed = dates[dates.length - 1] ?? null;
    const dormant =
      last_discussed && last_discussed < cutoffStr ? 1 : 0;
    return { ...idea, first_raised, last_discussed, dormant, slug: slugify(idea.title) };
  });
}

export async function getIdeaById(id: number) {
  const [{ data: idea, error: ideaError }, { data: linkRows }] = await Promise.all([
    supabase.from("policy_ideas").select("*").eq("id", id).single(),
    supabase.from("idea_meetings").select("meetings(date)").eq("idea_id", id),
  ]);

  if (ideaError) console.error("[supabase] getIdeaById error:", ideaError);
  if (!idea) return null;

  const dates = (linkRows || [])
    .map((r: any) => r.meetings?.date)
    .filter(Boolean)
    .sort();

  const first_raised = dates[0] ?? null;
  const last_discussed = dates[dates.length - 1] ?? null;
  const cutoffStr = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const dormant = last_discussed && last_discussed < cutoffStr ? 1 : 0;

  return { ...idea, first_raised, last_discussed, dormant, slug: slugify(idea.title) };
}

export async function getIdeaBySlug(slug: string) {
  const { data: rows, error: slugError } = await supabase
    .from("policy_ideas")
    .select("id, title");
  if (slugError) console.error("[supabase] getIdeaBySlug error:", slugError);
  if (!rows?.length) return null;
  const match = rows.find((r: any) => slugify(r.title) === slug);
  if (!match) return null;
  return await getIdeaById(match.id);
}

// ── Related ideas (same reform package) ───────────────────────────────────

export async function getRelatedIdeas(packageId: number, currentId: number) {
  const { data } = await supabase
    .from("policy_ideas")
    .select("id, title, current_status, time_horizon, growth_impact_rating")
    .eq("reform_package", packageId)
    .neq("id", currentId)
    .order("growth_impact_rating", { ascending: false })
    .limit(6);

  if (!data?.length) return [];
  return (data as any[]).map((r) => ({ ...r, slug: slugify(r.title) }));
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
  const { data } = await supabase
    .from("implementation_plans")
    .select("*")
    .eq("idea_id", ideaId)
    .single();

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
  return (data as any[])
    .map((r) => r.meetings)
    .filter(Boolean)
    .sort((a: any, b: any) => (b.date > a.date ? 1 : -1))
    .map((m: any) => ({
      ...m,
      pmg_url: m.pmg_url?.replace("https://api.pmg.org.za/", "https://pmg.org.za/"),
    }));
}

// ── Reform packages (bundled JSON, no DB needed) ──────────────────────────

export function getPackageSummaries() {
  return Object.values(reformPackagesData) as any[];
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

export async function getPackageDetail(packageId: number) {
  const summaries = getPackageSummaries();
  const summary = summaries.find((s: any) => s.package_id === packageId);
  if (!summary) return null;

  const ideas = await getIdeas({ packageId });

  const ideas_by_horizon = {
    quick_win: ideas.filter((i: any) => i.time_horizon === "quick_win"),
    medium_term: ideas.filter((i: any) => i.time_horizon === "medium_term"),
    long_term: ideas.filter((i: any) => i.time_horizon === "long_term"),
    unassigned: ideas.filter((i: any) => !i.time_horizon),
  };

  // Read dependency graph (bundled at build time)
  let dependencies: any[] = [];
  try {
    const graph = dependencyGraphData as any;
    const ideaIdSet = new Set(summary.idea_ids);
    const nodeMap = new Map<number, string>(
      graph.nodes.map((n: any) => [n.id, n.title])
    );
    dependencies = (
      graph.links as Array<{ source: number; target: number; label: string }>
    )
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
  for (const row of linkRows || []) {
    const idea = (row as any).policy_ideas;
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

  return (allMeetings || [])
    .filter((m: any) => ideasByMeeting.has(m.id))
    .map((m: any) => ({
      id: m.id,
      date: m.date,
      committee_name: m.committee_name,
      title: m.title,
      pmg_url: m.pmg_url?.replace("https://api.pmg.org.za/", "https://pmg.org.za/"),
      ideas: ideasByMeeting.get(m.id) ?? [],
    }));
}
