"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { PieLabelRenderProps, PieLabel } from "recharts";
import { formatRands } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

const fmtTooltip = (value: unknown) => formatRands(Number(value));
import type { BudgetSummary, BudgetByDepartment, BudgetByProgramme, PolicyIdea } from "@/lib/supabase";
import {
  matchDepartmentToIdeas,
  getDepartmentColor,
} from "@/lib/budget-utils";

const PIE_COLORS = ["#007A4D", "#FFB612", "#2563eb", "#dc2626", "#7c3aed", "#64748b"];

interface Props {
  budgetSummary: BudgetSummary | null;
  departments: BudgetByDepartment[];
  programmes: BudgetByProgramme[];
  policyIdeas: Pick<PolicyIdea, "id" | "title" | "slug" | "responsible_department" | "current_status" | "feasibility_rating" | "growth_impact_rating">[];
}

export default function BudgetExplorerTab({ budgetSummary, departments, programmes, policyIdeas }: Props) {
  const [selectedDept, setSelectedDept] = useState("");
  const [expandedProgramme, setExpandedProgramme] = useState<string | null>(null);
  const [subProgrammes, setSubProgrammes] = useState<{ subProgramme: string; total: number }[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // ── Derived data ────────────────────────────────────────────────────────

  // National Treasury includes debt service + equitable share (pass-through),
  // which dwarfs line-function departments and makes the chart unreadable.
  const lineDepartments = useMemo(
    () => departments.filter((d) => d.department_name !== "National Treasury"),
    [departments]
  );
  const nationalTreasury = useMemo(
    () => departments.find((d) => d.department_name === "National Treasury"),
    [departments]
  );

  const deptChartData = useMemo(
    () => lineDepartments.map((d, i) => ({
      department: d.department_name,
      total: d.total_amount,
      fill: getDepartmentColor(i),
    })),
    [lineDepartments]
  );

  const selectedDeptData = useMemo(
    () => departments.find((d) => d.department_name === selectedDept),
    [departments, selectedDept]
  );

  const deptProgrammes = useMemo(
    () => programmes.filter((p) => p.department_name === selectedDept),
    [programmes, selectedDept]
  );

  const classificationData = useMemo(() => {
    if (!selectedDeptData) return [];
    const items: { classification: string; total: number }[] = [];
    if (selectedDeptData.current_expenditure > 0) items.push({ classification: "Current", total: selectedDeptData.current_expenditure });
    if (selectedDeptData.capital_expenditure > 0) items.push({ classification: "Capital", total: selectedDeptData.capital_expenditure });
    return items;
  }, [selectedDeptData]);

  const relatedIdeas = useMemo(
    () => (selectedDept ? matchDepartmentToIdeas(selectedDept, policyIdeas) : []),
    [selectedDept, policyIdeas]
  );

  // ── Sub-programme drill-down (on-demand fetch) ──────────────────────────

  useEffect(() => {
    if (!expandedProgramme || !selectedDept) {
      setSubProgrammes([]);
      return;
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    setLoadingSubs(true);
    const client = createClient(url, key);
    client
      .from("department_budgets")
      .select("sub_programme, amount_rands")
      .eq("department_name", selectedDept)
      .eq("programme", expandedProgramme)
      .eq("financial_year", "2026-27")
      .then(({ data }) => {
        if (!data) { setSubProgrammes([]); setLoadingSubs(false); return; }
        const map = new Map<string, number>();
        for (const r of data) {
          const sub = r.sub_programme ?? "Unspecified";
          map.set(sub, (map.get(sub) ?? 0) + (r.amount_rands ?? 0));
        }
        setSubProgrammes(
          Array.from(map, ([subProgramme, total]) => ({ subProgramme, total }))
            .sort((a, b) => b.total - a.total)
        );
        setLoadingSubs(false);
      });
  }, [expandedProgramme, selectedDept]);

  // ── Render ──────────────────────────────────────────────────────────────

  if (departments.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No budget data available</p>
        <p className="text-sm mt-1">Budget data will appear here once loaded from the database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-sa-green">{formatRands(budgetSummary?.total_budget ?? 0)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Budget</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-700">{budgetSummary?.num_departments ?? departments.length}</div>
          <div className="text-xs text-gray-500 mt-1">Departments</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-700">{budgetSummary?.num_programmes ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">Programmes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-700">{budgetSummary?.financial_year ?? "2026-27"}</div>
          <div className="text-xs text-gray-500 mt-1">Financial Year</div>
        </div>
      </div>

      {/* Scope note */}
      <div className="card p-4 bg-amber-50 border-amber-200">
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Note:</span> These are national department votes only (Estimates of National Expenditure).
          The bulk of provincial spending on health, education, and social services is funded through the
          Provincial Equitable Share and conditional grants, which are not reflected here.
          See the <span className="font-semibold">Consolidated Spending</span> tab for the full picture across all spheres of government.
        </p>
      </div>

      {/* Cross-Department Comparison */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Department Budget Rankings
        </h2>
        {nationalTreasury && (
          <p className="text-xs text-gray-500 mb-3">
            National Treasury ({formatRands(nationalTreasury.total_amount)}, incl. debt service &amp; equitable share) excluded for scale.
            <button
              onClick={() => setSelectedDept("National Treasury")}
              className="ml-1 text-sa-green hover:underline"
            >
              View details →
            </button>
          </p>
        )}
        <div style={{ width: "100%", height: Math.max(lineDepartments.length * 40, 200) }}>
          <ResponsiveContainer>
            <BarChart data={deptChartData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tickFormatter={(v) => formatRands(v)} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="department"
                width={180}
                tick={{ fontSize: 11 }}
                tickFormatter={(v: string) => v.length > 28 ? v.slice(0, 26) + "..." : v}
              />
              <Tooltip formatter={fmtTooltip} />
              <Bar dataKey="total" name="Budget" radius={[0, 4, 4, 0]}>
                {deptChartData.map((d, i) => (
                  <Cell key={i} fill={d.fill} cursor="pointer" onClick={() => setSelectedDept(d.department)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Selector */}
      <div className="card p-5">
        <label htmlFor="dept-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Department for Detailed View
        </label>
        <select
          id="dept-select"
          value={selectedDept}
          onChange={(e) => {
            setSelectedDept(e.target.value);
            setExpandedProgramme(null);
          }}
          className="w-full sm:w-96 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sa-green focus:border-sa-green"
        >
          <option value="">-- Choose a department --</option>
          {departments.map((d) => (
            <option key={d.department_name} value={d.department_name}>
              {d.department_name} ({formatRands(d.total_amount)})
            </option>
          ))}
        </select>
      </div>

      {/* Department Detail */}
      {selectedDept && selectedDeptData && (
        <div className="space-y-6">
          <div className="card p-5 border-t-4 border-sa-green">
            <h2 className="text-lg font-semibold text-gray-900">{selectedDept}</h2>
            <p className="text-2xl font-bold text-sa-green mt-1">{formatRands(selectedDeptData.total_amount)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {selectedDeptData.num_programmes} programme{selectedDeptData.num_programmes !== 1 ? "s" : ""} &middot; {selectedDeptData.financial_year} Main Appropriation
            </p>
          </div>

          {/* Programme Breakdown + Economic Classification side by side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Programme Bar Chart */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Budget by Programme</h3>
              {deptProgrammes.length > 0 ? (
                <div style={{ width: "100%", height: Math.max(deptProgrammes.length * 36, 150) }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={deptProgrammes.map((p) => ({ programme: p.programme, total: p.total_amount }))}
                      layout="vertical"
                      margin={{ left: 10, right: 20 }}
                    >
                      <XAxis type="number" tickFormatter={(v) => formatRands(v)} tick={{ fontSize: 10 }} />
                      <YAxis
                        type="category"
                        dataKey="programme"
                        width={140}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v: string) => v.length > 22 ? v.slice(0, 20) + "..." : v}
                      />
                      <Tooltip formatter={fmtTooltip} />
                      <Bar dataKey="total" name="Budget" fill="#007A4D" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No programme data available.</p>
              )}
            </div>

            {/* Current vs Capital Pie */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Current vs Capital Split</h3>
              {classificationData.length > 0 ? (
                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={classificationData}
                        dataKey="total"
                        nameKey="classification"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={((props: PieLabelRenderProps & { classification?: string }) =>
                          `${props.classification ?? ""} (${((props.percent as number) * 100).toFixed(0)}%)`) as PieLabel
                        }
                        labelLine={true}
                      >
                        {classificationData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={fmtTooltip} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No classification data available.</p>
              )}
            </div>
          </div>

          {/* Programme Detail Table with Sub-Programme Drill-Down */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Programme Details</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wide">
                    <th className="text-left px-4 py-2 font-medium">Programme</th>
                    <th className="text-right px-4 py-2 font-medium">Budget</th>
                    <th className="text-right px-4 py-2 font-medium">% of Dept</th>
                    <th className="text-center px-4 py-2 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {deptProgrammes.map((prog) => {
                    const pct = selectedDeptData.total_amount > 0 ? (prog.total_amount / selectedDeptData.total_amount) * 100 : 0;
                    const isExpanded = expandedProgramme === prog.programme;
                    return (
                      <tr key={prog.programme} className="group">
                        <td colSpan={4} className="p-0">
                          <div className="flex items-center hover:bg-gray-50 transition-colors">
                            <div className="flex-1 px-4 py-3">
                              <span className="font-medium text-gray-900">{prog.programme}</span>
                            </div>
                            <div className="px-4 py-3 text-right font-mono text-gray-700 whitespace-nowrap">
                              {formatRands(prog.total_amount)}
                            </div>
                            <div className="px-4 py-3 text-right text-gray-500 whitespace-nowrap">
                              {pct.toFixed(1)}%
                            </div>
                            <div className="px-4 py-3 text-center">
                              <button
                                onClick={() => setExpandedProgramme(isExpanded ? null : prog.programme)}
                                className="text-sa-green hover:text-sa-green/80 text-xs font-medium"
                              >
                                {isExpanded ? "Collapse" : "Expand"}
                              </button>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="bg-gray-50 border-t border-gray-100 px-8 py-2">
                              {loadingSubs ? (
                                <p className="text-xs text-gray-500 py-2">Loading sub-programmes...</p>
                              ) : subProgrammes.length > 0 ? (
                                <table className="w-full text-xs">
                                  <tbody>
                                    {subProgrammes.map((sub) => (
                                      <tr key={sub.subProgramme} className="border-b border-gray-100 last:border-0">
                                        <td className="py-1.5 text-gray-600">{sub.subProgramme}</td>
                                        <td className="py-1.5 text-right font-mono text-gray-700">{formatRands(sub.total)}</td>
                                        <td className="py-1.5 text-right text-gray-500 w-20">
                                          {prog.total_amount > 0 ? ((sub.total / prog.total_amount) * 100).toFixed(1) : 0}%
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-xs text-gray-500 py-2">No sub-programme data available.</p>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td className="px-4 py-2 font-semibold text-gray-700">Department Total</td>
                    <td className="px-4 py-2 text-right font-mono font-semibold text-sa-green">{formatRands(selectedDeptData.total_amount)}</td>
                    <td className="px-4 py-2 text-right text-gray-500">100%</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Related Policy Ideas */}
          {relatedIdeas.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Related Policy Ideas ({relatedIdeas.length})
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {relatedIdeas.slice(0, 8).map((idea) => (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.slug || idea.id}`}
                    className="block p-3 rounded-lg border border-gray-100 hover:border-sa-green/30 hover:bg-sa-green/5 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900 line-clamp-2">{idea.title}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-gray-500 capitalize">
                        {(idea.current_status ?? "").replace(/_/g, " ")}
                      </span>
                      {idea.growth_impact_rating && (
                        <span className="text-[10px] text-gray-400">
                          Growth: {idea.growth_impact_rating}/5
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {relatedIdeas.length > 8 && (
                <p className="text-xs text-gray-500 mt-3">
                  + {relatedIdeas.length - 8} more ideas
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
