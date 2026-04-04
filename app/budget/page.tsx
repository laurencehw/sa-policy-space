export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { BudgetSummary, BudgetByDepartment, BudgetByProgramme, PolicyIdea } from "@/lib/supabase";
import budgetData from "@/data/budget_alignment.json";
import BudgetPageTabs from "./BudgetPageTabs";

export const metadata: Metadata = {
  title: "Budget Alignment",
  description:
    "Analysis of budget allocation gaps between parliamentary committee recommendations and actual National Treasury allocations across South Africa's reform packages, plus detailed department-level budget data.",
};

export default async function BudgetPage() {
  let budgetSummary: BudgetSummary | null = null;
  let departments: BudgetByDepartment[] = [];
  let programmes: BudgetByProgramme[] = [];
  let policyIdeas: Pick<PolicyIdea, "id" | "title" | "slug" | "responsible_department" | "current_status" | "feasibility_rating" | "growth_impact_rating">[] = [];

  if (supabase) {
    try {
      const [summaryResult, deptResult, progResult, ideasResult] = await Promise.all([
        supabase
          .from("budget_summary")
          .select("*")
          .eq("financial_year", "2026-27")
          .single(),
        supabase
          .from("budget_by_department")
          .select("*")
          .eq("financial_year", "2026-27")
          .order("total_amount", { ascending: false }),
        supabase
          .from("budget_by_programme")
          .select("*")
          .eq("financial_year", "2026-27")
          .order("total_amount", { ascending: false }),
        supabase
          .from("policy_ideas")
          .select("id, title, slug, responsible_department, current_status, feasibility_rating, growth_impact_rating"),
      ]);
      budgetSummary = (summaryResult.data ?? null) as BudgetSummary | null;
      departments = (deptResult.data ?? []) as BudgetByDepartment[];
      programmes = (progResult.data ?? []) as BudgetByProgramme[];
      policyIdeas = (ideasResult.data ?? []) as typeof policyIdeas;
    } catch (e) {
      console.error("[budget] data fetch failed:", e);
    }
  }

  return (
    <BudgetPageTabs
      reformData={budgetData as typeof budgetData}
      budgetSummary={budgetSummary}
      departments={departments}
      programmes={programmes}
      policyIdeas={policyIdeas}
    />
  );
}
