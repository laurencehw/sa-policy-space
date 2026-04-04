/**
 * Pure matching & colour utilities for the budget explorer.
 * Safe to import in both server and client components.
 */

import type { PolicyIdea } from "@/lib/supabase";

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
