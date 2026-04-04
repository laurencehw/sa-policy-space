export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import type { DepartmentBudget, PolicyIdea } from "@/lib/supabase";
import budgetData from "@/data/budget_alignment.json";
import BudgetPageTabs from "./BudgetPageTabs";

export const metadata: Metadata = {
  title: "Budget Alignment",
  description:
    "Analysis of budget allocation gaps between parliamentary committee recommendations and actual National Treasury allocations across South Africa's reform packages, plus detailed department-level budget data.",
};

export default async function BudgetPage() {
  let budgetRows: DepartmentBudget[] = [];
  let policyIdeas: Pick<PolicyIdea, "id" | "title" | "slug" | "responsible_department" | "current_status" | "feasibility_rating" | "growth_impact_rating">[] = [];

  if (supabase) {
    try {
      const [budgetResult, ideasResult] = await Promise.all([
        supabase
          .from("department_budgets")
          .select("department_name, programme, sub_programme, economic_classification_1, economic_classification_2, financial_year, budget_phase, amount_rands, vote_number")
          .order("department_name"),
        supabase
          .from("policy_ideas")
          .select("id, title, slug, responsible_department, current_status, feasibility_rating, growth_impact_rating"),
      ]);
      budgetRows = (budgetResult.data ?? []) as DepartmentBudget[];
      policyIdeas = (ideasResult.data ?? []) as typeof policyIdeas;
    } catch (e) {
      console.error("[budget] data fetch failed:", e);
    }
  }

  return (
    <BudgetPageTabs
      reformData={budgetData as typeof budgetData}
      budgetRows={budgetRows}
      policyIdeas={policyIdeas}
    />
  );
}
