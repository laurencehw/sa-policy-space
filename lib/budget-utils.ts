/**
 * Pure aggregation & matching utilities for the budget explorer.
 * Safe to import in both server and client components.
 */

import type { DepartmentBudget, PolicyIdea } from "@/lib/supabase";

// ── Aggregation ───────────────────────────────────────────────────────────

export function aggregateByDepartment(
  rows: DepartmentBudget[]
): { department: string; total: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const amt = r.amount_rands ?? 0;
    map.set(r.department_name, (map.get(r.department_name) ?? 0) + amt);
  }
  return Array.from(map, ([department, total]) => ({ department, total }))
    .sort((a, b) => b.total - a.total);
}

export function aggregateByProgramme(
  rows: DepartmentBudget[],
  department: string
): { programme: string; total: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    if (r.department_name !== department || !r.programme) continue;
    const amt = r.amount_rands ?? 0;
    map.set(r.programme, (map.get(r.programme) ?? 0) + amt);
  }
  return Array.from(map, ([programme, total]) => ({ programme, total }))
    .sort((a, b) => b.total - a.total);
}

export function aggregateByClassification(
  rows: DepartmentBudget[],
  department: string
): { classification: string; total: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    if (r.department_name !== department) continue;
    const cls = r.economic_classification_1 ?? "Unclassified";
    const amt = r.amount_rands ?? 0;
    map.set(cls, (map.get(cls) ?? 0) + amt);
  }
  return Array.from(map, ([classification, total]) => ({ classification, total }))
    .sort((a, b) => b.total - a.total);
}

export function aggregateBySubProgramme(
  rows: DepartmentBudget[],
  department: string,
  programme: string
): { subProgramme: string; total: number }[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    if (r.department_name !== department || r.programme !== programme) continue;
    const sub = r.sub_programme ?? "Unspecified";
    const amt = r.amount_rands ?? 0;
    map.set(sub, (map.get(sub) ?? 0) + amt);
  }
  return Array.from(map, ([subProgramme, total]) => ({ subProgramme, total }))
    .sort((a, b) => b.total - a.total);
}

// ── Department → Policy idea matching ─────────────────────────────────────

/**
 * Match a budget department name to policy ideas by keyword overlap.
 * department_name e.g. "Basic Education"
 * responsible_department e.g. "Department of Basic Education / SETA"
 */
export function matchDepartmentToIdeas(
  deptName: string,
  ideas: Pick<PolicyIdea, "id" | "title" | "slug" | "responsible_department" | "current_status" | "feasibility_rating" | "growth_impact_rating">[]
): typeof ideas {
  const keywords = deptName
    .toLowerCase()
    .replace(/and/g, "")
    .split(/[\s,/]+/)
    .filter((w) => w.length > 2);

  return ideas.filter((idea) => {
    const rd = (idea.responsible_department ?? "").toLowerCase();
    return keywords.every((kw) => rd.includes(kw));
  });
}

// ── Department colour palette ─────────────────────────────────────────────

const DEPT_COLORS = [
  "#007A4D", "#FFB612", "#2563eb", "#dc2626", "#7c3aed",
  "#ea580c", "#0891b2", "#059669", "#d946ef", "#f59e0b",
  "#6366f1", "#14b8a6", "#e11d48", "#64748b",
];

export function getDepartmentColor(index: number): string {
  return DEPT_COLORS[index % DEPT_COLORS.length];
}
