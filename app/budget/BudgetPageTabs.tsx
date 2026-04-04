"use client";

import { useState } from "react";
import BudgetReformTab from "./BudgetReformTab";
import BudgetExplorerTab from "./BudgetExplorerTab";
import ConsolidatedTab from "./ConsolidatedTab";
import type { BudgetSummary, BudgetByDepartment, BudgetByProgramme, ConsolidatedByFunction, PolicyIdea } from "@/lib/supabase";

type TabId = "reform" | "consolidated" | "explorer";

interface Props {
  reformData: {
    metadata: {
      source: string;
      base_year: string;
      currency: string;
      last_updated: string;
      notes: string;
    };
    packages: Array<{
      package_id: number;
      package_name: string;
      budget_allocated: number;
      budget_recommended: number;
      gap_percentage: number;
      funding_status: string;
      summary: string;
      key_line_items: Array<{
        item: string;
        allocated: number;
        recommended: number;
        department: string;
        funding_status: string;
        notes: string;
      }>;
    }>;
  };
  budgetSummary: BudgetSummary | null;
  departments: BudgetByDepartment[];
  programmes: BudgetByProgramme[];
  consolidated: ConsolidatedByFunction[];
  policyIdeas: Pick<PolicyIdea, "id" | "title" | "slug" | "responsible_department" | "current_status" | "feasibility_rating" | "growth_impact_rating">[];
}

const TABS: { id: TabId; label: string }[] = [
  { id: "reform", label: "Reform Analysis" },
  { id: "consolidated", label: "Consolidated Spending" },
  { id: "explorer", label: "National Dept. Votes" },
];

export default function BudgetPageTabs({ reformData, budgetSummary, departments, programmes, consolidated, policyIdeas }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("reform");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Budget Alignment Analysis</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Cross-referencing reform package recommendations against actual National Budget allocations,
          with consolidated government spending by function and department-level detail.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px" role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-sa-green text-sa-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "reform" && <BudgetReformTab reformData={reformData} />}
      {activeTab === "consolidated" && <ConsolidatedTab data={consolidated} />}
      {activeTab === "explorer" && (
        <BudgetExplorerTab
          budgetSummary={budgetSummary}
          departments={departments}
          programmes={programmes}
          policyIdeas={policyIdeas}
        />
      )}
    </div>
  );
}
