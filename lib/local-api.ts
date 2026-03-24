/**
 * Local development API layer — reads from SQLite at data/dev.sqlite3.
 * Uses Node.js built-in node:sqlite (stable in Node.js v24).
 * Import ONLY in server components and API routes (not "use client" files).
 */

// @ts-ignore — node:sqlite types may not be present until @types/node is installed
import { DatabaseSync } from "node:sqlite";
import path from "path";
import fs from "fs";
import { slugify } from "@/lib/utils";

// SQLITE_DB_PATH env var (set in .env.local) overrides the default relative path.
// Default assumes cwd() is the frontend/ dir when running next dev.
const DB_PATH =
  process.env.SQLITE_DB_PATH ||
  path.resolve(process.cwd(), "../data/dev.sqlite3");

// Data directory (parent of dev.sqlite3) — used to locate processed JSON files.
const DATA_DIR = path.dirname(DB_PATH);

function getDb(): InstanceType<typeof DatabaseSync> {
  return new DatabaseSync(DB_PATH);
}

// ── Stats ──────────────────────────────────────────────────────────────────

export interface StatsResult {
  totalIdeas: number;
  meetingsAnalyzed: number;
  constraintsCovered: number;
  dormantIdeas: number;
}

export function getStats(): StatsResult {
  const db = getDb();
  try {
    const totalIdeas = (db.prepare("SELECT COUNT(*) as n FROM policy_ideas").get() as any).n as number;
    const meetingsAnalyzed = (db.prepare("SELECT COUNT(*) as n FROM meetings").get() as any).n as number;
    const constraintsCovered = (
      db.prepare("SELECT COUNT(DISTINCT binding_constraint) as n FROM policy_ideas").get() as any
    ).n as number;
    const dormantIdeas = (db.prepare(`
      SELECT COUNT(*) as n FROM (
        SELECT p.id
        FROM policy_ideas p
        JOIN idea_meetings im ON im.idea_id = p.id
        JOIN meetings m ON m.id = im.meeting_id
        GROUP BY p.id
        HAVING MAX(m.date) < date('now', '-12 months')
      )
    `).get() as any).n as number;
    return { totalIdeas, meetingsAnalyzed, constraintsCovered, dormantIdeas };
  } finally {
    db.close();
  }
}

// ── Ideas ──────────────────────────────────────────────────────────────────

export interface IdeaRow {
  id: number;
  title: string;
  description: string;
  theme: string;
  binding_constraint: string;
  first_raised_date: string;
  times_raised: number;
  current_status: string;
  feasibility_rating: number;
  growth_impact_rating: number;
  responsible_department: string;
  key_quote: string;
  reform_package: number | null;
  time_horizon: string | null;
  source_committee: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  // Derived from idea_meetings → meetings
  first_raised: string | null;
  last_discussed: string | null;
  dormant: number; // 1 if last_discussed > 12 months ago, else 0
}

export function getIdeas(opts?: {
  search?: string;
  constraint?: string;
  status?: string;
  sort?: string;
  packageId?: number;
  timeHorizon?: string;
}): IdeaRow[] {
  const db = getDb();
  try {
    // node:sqlite uses positional ? params; build array
    const conditions: string[] = [];
    const params: unknown[] = [];

    if (opts?.constraint) {
      conditions.push("binding_constraint = ?");
      params.push(opts.constraint);
    }
    if (opts?.status) {
      conditions.push("current_status = ?");
      params.push(opts.status);
    }
    if (opts?.packageId) {
      conditions.push("reform_package = ?");
      params.push(opts.packageId);
    }
    if (opts?.timeHorizon) {
      conditions.push("time_horizon = ?");
      params.push(opts.timeHorizon);
    }
    if (opts?.search) {
      conditions.push("(LOWER(title) LIKE ? OR LOWER(description) LIKE ?)");
      const like = `%${opts.search.toLowerCase()}%`;
      params.push(like, like);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const order = opts?.sort === "impact"
      ? "ORDER BY growth_impact_rating DESC, times_raised DESC"
      : "ORDER BY id DESC";

    const stmt = db.prepare(`
      SELECT p.*,
        (SELECT MIN(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) AS first_raised,
        (SELECT MAX(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) AS last_discussed,
        CASE WHEN (SELECT MAX(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) < date('now', '-12 months') THEN 1 ELSE 0 END AS dormant
      FROM policy_ideas p ${where} ${order}
    `);
    const rows = (params.length ? stmt.all(...params) : stmt.all()) as IdeaRow[];
    return rows.map((r) => ({ ...r, slug: slugify(r.title) }));
  } finally {
    db.close();
  }
}

export function getIdeaById(id: number): IdeaRow | null {
  const db = getDb();
  try {
    const row = (db.prepare(`
      SELECT p.*,
        (SELECT MIN(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) AS first_raised,
        (SELECT MAX(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) AS last_discussed,
        CASE WHEN (SELECT MAX(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) < date('now', '-12 months') THEN 1 ELSE 0 END AS dormant
      FROM policy_ideas p WHERE p.id = ?
    `).get(id) as IdeaRow) ?? null;
    return row ? { ...row, slug: slugify(row.title) } : null;
  } finally {
    db.close();
  }
}

export function getIdeaBySlug(slug: string): IdeaRow | null {
  const db = getDb();
  try {
    const rows = db.prepare(`
      SELECT p.*,
        (SELECT MIN(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) AS first_raised,
        (SELECT MAX(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) AS last_discussed,
        CASE WHEN (SELECT MAX(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) < date('now', '-12 months') THEN 1 ELSE 0 END AS dormant
      FROM policy_ideas p
    `).all() as IdeaRow[];
    const match = rows.find((r) => slugify(r.title) === slug);
    return match ? { ...match, slug: slugify(match.title) } : null;
  } finally {
    db.close();
  }
}

// ── Related ideas (same reform package) ───────────────────────────────────

export function getRelatedIdeas(packageId: number, currentId: number): IdeaRow[] {
  const db = getDb();
  try {
    const rows = db.prepare(`
      SELECT p.*,
        (SELECT MIN(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) AS first_raised,
        (SELECT MAX(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) AS last_discussed,
        CASE WHEN (SELECT MAX(m.date) FROM idea_meetings im JOIN meetings m ON m.id = im.meeting_id WHERE im.idea_id = p.id) < date('now', '-12 months') THEN 1 ELSE 0 END AS dormant
      FROM policy_ideas p
      WHERE p.reform_package = ? AND p.id != ?
      ORDER BY p.growth_impact_rating DESC, p.id
    `).all(packageId, currentId) as IdeaRow[];
    return rows.map((r) => ({ ...r, slug: slugify(r.title) }));
  } finally {
    db.close();
  }
}

// ── Constraint summaries ───────────────────────────────────────────────────

export interface ConstraintSummaryRow {
  binding_constraint: string;
  total_ideas: number;
  avg_growth_impact: number;
  stalled_count: number;
  implemented_count: number;
}

export function getConstraintSummaries(): ConstraintSummaryRow[] {
  const db = getDb();
  try {
    return db
      .prepare(
        `SELECT
           binding_constraint,
           COUNT(*) AS total_ideas,
           ROUND(AVG(growth_impact_rating), 1) AS avg_growth_impact,
           SUM(CASE WHEN current_status = 'stalled' THEN 1 ELSE 0 END) AS stalled_count,
           SUM(CASE WHEN current_status = 'implemented' THEN 1 ELSE 0 END) AS implemented_count
         FROM policy_ideas
         GROUP BY binding_constraint
         ORDER BY total_ideas DESC`
      )
      .all() as ConstraintSummaryRow[];
  } finally {
    db.close();
  }
}

// ── Committees ─────────────────────────────────────────────────────────────

export function getCommittees(): { name: string; count: number }[] {
  const db = getDb();
  try {
    return db.prepare(`
      SELECT source_committee AS name, COUNT(*) AS count
      FROM policy_ideas
      WHERE source_committee IS NOT NULL AND source_committee != ''
      GROUP BY source_committee
      ORDER BY count DESC, name
    `).all() as { name: string; count: number }[];
  } finally {
    db.close();
  }
}

// ── Implementation plans ───────────────────────────────────────────────────

export function getImplementationPlan(ideaId: number): Record<string, unknown> | null {
  const db = getDb();
  try {
    const row = db
      .prepare("SELECT * FROM implementation_plans WHERE idea_id = ?")
      .get(ideaId) as Record<string, unknown> | undefined;
    if (!row) return null;
    if (typeof row.implementation_steps === "string") {
      try {
        row.implementation_steps = JSON.parse(row.implementation_steps);
      } catch {}
    }
    return row;
  } finally {
    db.close();
  }
}

// ── Source meetings for an idea ────────────────────────────────────────────

export function getIdeaMeetings(ideaId: number): unknown[] {
  const db = getDb();
  try {
    return (db
      .prepare(
        `SELECT m.*
         FROM meetings m
         JOIN idea_meetings im ON im.meeting_id = m.id
         WHERE im.idea_id = ?
         ORDER BY m.date DESC`
      )
      .all(ideaId) as any[])
      .map((m: any) => ({
        ...m,
        pmg_url: m.pmg_url?.replace("https://api.pmg.org.za/", "https://pmg.org.za/"),
      }));
  } finally {
    db.close();
  }
}

// ── Reform packages ────────────────────────────────────────────────────────

export interface TopPriorityIdea {
  id: number;
  title: string;
  source_committee: string;
  current_status: string;
  growth_impact_rating: number;
  feasibility_rating: number | null;
}

export interface PackageSummary {
  package_id: number;
  name: string;
  tagline: string;
  theory_of_change: string;
  idea_count: number;
  avg_feasibility: number;
  avg_growth_impact: number;
  stalled_or_proposed_count: number;
  implemented_or_partial_count: number;
  top_priority_ideas: TopPriorityIdea[];
  idea_ids: number[];
}

export interface TimeHorizonCounts {
  quick_win: number;
  medium_term: number;
  long_term: number;
}

export interface PackageDetail extends PackageSummary {
  ideas_by_horizon: {
    quick_win: IdeaRow[];
    medium_term: IdeaRow[];
    long_term: IdeaRow[];
    unassigned: IdeaRow[];
  };
  dependencies: Array<{
    source: number;
    target: number;
    label: string;
    source_title: string;
    target_title: string;
  }>;
}

export function getPackageSummaries(): PackageSummary[] {
  const jsonPath = path.join(DATA_DIR, "processed", "reform_packages.json");
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  return Object.values(raw) as PackageSummary[];
}

export function getPackageTimeHorizonCounts(): Record<number, TimeHorizonCounts> {
  const db = getDb();
  try {
    const rows = db.prepare(`
      SELECT
        reform_package,
        SUM(CASE WHEN time_horizon = 'quick_win' THEN 1 ELSE 0 END) AS quick_win,
        SUM(CASE WHEN time_horizon = 'medium_term' THEN 1 ELSE 0 END) AS medium_term,
        SUM(CASE WHEN time_horizon = 'long_term' THEN 1 ELSE 0 END) AS long_term
      FROM policy_ideas
      WHERE reform_package IS NOT NULL
      GROUP BY reform_package
    `).all() as Array<{ reform_package: number; quick_win: number; medium_term: number; long_term: number }>;

    const result: Record<number, TimeHorizonCounts> = {};
    for (const row of rows) {
      result[row.reform_package] = {
        quick_win: row.quick_win,
        medium_term: row.medium_term,
        long_term: row.long_term,
      };
    }
    return result;
  } finally {
    db.close();
  }
}

export function getPackageDetail(packageId: number): PackageDetail | null {
  const summaries = getPackageSummaries();
  const summary = summaries.find((s) => s.package_id === packageId);
  if (!summary) return null;

  const ideas = getIdeas({ packageId });

  const ideas_by_horizon = {
    quick_win: ideas.filter((i) => i.time_horizon === "quick_win"),
    medium_term: ideas.filter((i) => i.time_horizon === "medium_term"),
    long_term: ideas.filter((i) => i.time_horizon === "long_term"),
    unassigned: ideas.filter((i) => !i.time_horizon),
  };

  // Read dependency graph and filter to edges within this package
  const graphPath = path.join(DATA_DIR, "processed", "dependency_graph.json");
  let dependencies: PackageDetail["dependencies"] = [];
  try {
    const graph = JSON.parse(fs.readFileSync(graphPath, "utf-8"));
    const ideaIdSet = new Set(summary.idea_ids);
    const nodeMap = new Map<number, string>(
      graph.nodes.map((n: any) => [n.id, n.title])
    );
    dependencies = (graph.links as Array<{ source: number; target: number; label: string }>)
      .filter((l) => ideaIdSet.has(l.source) && ideaIdSet.has(l.target))
      .map((l) => ({
        source: l.source,
        target: l.target,
        label: l.label,
        source_title: nodeMap.get(l.source) ?? `Idea #${l.source}`,
        target_title: nodeMap.get(l.target) ?? `Idea #${l.target}`,
      }));
  } catch {
    // If graph file is missing, dependencies stay empty
  }

  return { ...summary, ideas_by_horizon, dependencies };
}

// ── International comparisons ─────────────────────────────────────────────

export interface ComparisonRow {
  id: number;
  idea_id: number;
  idea_title: string;
  idea_slug: string;
  binding_constraint: string;
  country: string;
  iso3: string | null;
  reform_year: number | null;
  outcome_summary: string;
  source_url: string | null;
  source_label: string | null;
  created_at: string;
}

export function getComparisons(opts?: { country?: string; constraint?: string }): ComparisonRow[] {
  const db = getDb();
  try {
    const conditions: string[] = [];
    const params: unknown[] = [];
    if (opts?.country) {
      conditions.push("ic.country = ?");
      params.push(opts.country);
    }
    if (opts?.constraint) {
      conditions.push("p.binding_constraint = ?");
      params.push(opts.constraint);
    }
    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const rows = (db.prepare(`
      SELECT ic.*, p.title AS idea_title, p.binding_constraint
      FROM international_comparisons ic
      JOIN policy_ideas p ON p.id = ic.idea_id
      ${where}
      ORDER BY p.binding_constraint, ic.country
    `).all(...params) as any[]);
    return rows.map((r) => ({ ...r, idea_slug: slugify(r.idea_title) }));
  } catch {
    // Table may not exist if migration hasn't been run locally
    return [];
  } finally {
    db.close();
  }
}

export function getIdeaComparisons(ideaId: number): ComparisonRow[] {
  const db = getDb();
  try {
    const rows = (db.prepare(`
      SELECT ic.*, p.title AS idea_title, p.binding_constraint
      FROM international_comparisons ic
      JOIN policy_ideas p ON p.id = ic.idea_id
      WHERE ic.idea_id = ?
      ORDER BY ic.country
    `).all(ideaId) as any[]);
    return rows.map((r) => ({ ...r, idea_slug: slugify(r.idea_title) }));
  } catch {
    return [];
  } finally {
    db.close();
  }
}

// ── Timeline data ────────────────────────────────────────────────────────

export interface TimelineMeeting {
  id: number;
  date: string;
  committee_name: string;
  title: string;
  pmg_url: string;
  ideas: Array<{
    id: number;
    title: string;
    slug: string;
    reform_package: number | null;
    current_status: string;
  }>;
}

export function getTimelineData(): TimelineMeeting[] {
  const db = getDb();
  try {
    const meetings = db.prepare(`
      SELECT DISTINCT m.id, m.date, m.committee_name, m.title, m.pmg_url
      FROM meetings m
      INNER JOIN idea_meetings im ON im.meeting_id = m.id
      ORDER BY m.date DESC
    `).all() as Array<{
      id: number; date: string; committee_name: string; title: string; pmg_url: string;
    }>;

    if (!meetings.length) return [];

    const ideaLinks = db.prepare(`
      SELECT im.meeting_id, p.id, p.title, p.reform_package, p.current_status
      FROM idea_meetings im
      JOIN policy_ideas p ON p.id = im.idea_id
    `).all() as Array<{
      meeting_id: number; id: number; title: string;
      reform_package: number | null; current_status: string;
    }>;

    const ideasByMeeting = new Map<number, Array<{
      id: number; title: string; slug: string;
      reform_package: number | null; current_status: string;
    }>>();
    for (const link of ideaLinks) {
      const arr = ideasByMeeting.get(link.meeting_id) ?? [];
      arr.push({
        id: link.id,
        title: link.title,
        slug: slugify(link.title),
        reform_package: link.reform_package,
        current_status: link.current_status,
      });
      ideasByMeeting.set(link.meeting_id, arr);
    }

    return meetings.map((m) => ({
      ...m,
      pmg_url: m.pmg_url?.replace("https://api.pmg.org.za/", "https://pmg.org.za/"),
      ideas: ideasByMeeting.get(m.id) ?? [],
    }));
  } finally {
    db.close();
  }
}
