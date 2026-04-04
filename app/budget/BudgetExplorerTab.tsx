"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { PieLabelRenderProps, PieLabel } from "recharts";
import { formatRands } from "@/lib/utils";

const fmtTooltip = (value: unknown) => formatRands(Number(value));
import type { DepartmentBudget, PolicyIdea } from "@/lib/supabase";
import {
  aggregateByDepartment,
  aggregateByProgramme,
  aggregateByClassification,
  aggregateBySubProgramme,
  matchDepartmentToIdeas,
  getDepartmentColor,
} from "@/lib/budget-utils";

const PIE_COLORS = ["#007A4D", "#FFB612", "#2563eb", "#dc2626", "#7c3aed", "#64748b"];

interface Props {
  budgetRows: DepartmentBudget[];
  policyIdeas: Pick<PolicyIdea, "id" | "title" | "slug" | "responsible_department" | "current_status" | "feasibility_rating" | "growth_impact_rating">[];
}

export default function BudgetExplorerTab({ budgetRows, policyIdeas }: Props) {
  const [selectedDept, setSelectedDept] = useState("");
  const [expandedProgramme, setExpandedProgramme] = useState<string | null>(null);

  // ── Aggregations ────────────────────────────────────────────────────────

  const deptTotals = useMemo(() => aggregateByDepartment(budgetRows), [budgetRows]);

  const totalBudget = useMemo(
    () => deptTotals.reduce((s, d) => s + d.total, 0),
    [deptTotals]
  );

  const distinctProgrammes = useMemo(
    () => new Set(budgetRows.map((r) => r.programme).filter(Boolean)).size,
    [budgetRows]
  );

  const financialYears = useMemo(
    () => [...new Set(budgetRows.map((r) => r.financial_year))],
    [budgetRows]
  );

  const programmeTotals = useMemo(
    () => (selectedDept ? aggregateByProgramme(budgetRows, selectedDept) : []),
    [budgetRows, selectedDept]
  );

  const classificationTotals = useMemo(
    () => (selectedDept ? aggregateByClassification(budgetRows, selectedDept) : []),
    [budgetRows, selectedDept]
  );

  const selectedDeptTotal = useMemo(
    () => deptTotals.find((d) => d.department === selectedDept)?.total ?? 0,
    [deptTotals, selectedDept]
  );

  const relatedIdeas = useMemo(
    () => (selectedDept ? matchDepartmentToIdeas(selectedDept, policyIdeas) : []),
    [selectedDept, policyIdeas]
  );

  // ── Chart data ──────────────────────────────────────────────────────────

  const deptChartData = useMemo(
    () => deptTotals.map((d, i) => ({ ...d, fill: getDepartmentColor(i) })),
    [deptTotals]
  );

  if (budgetRows.length === 0) {
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
          <div className="text-2xl font-bold text-sa-green">{formatRands(totalBudget)}</div>
          <div className="text-xs text-gray-500 mt-1">Total Budget</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-700">{deptTotals.length}</div>
          <div className="text-xs text-gray-500 mt-1">Departments</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-700">{distinctProgrammes}</div>
          <div className="text-xs text-gray-500 mt-1">Programmes</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-gray-700">{financialYears.join(", ")}</div>
          <div className="text-xs text-gray-500 mt-1">Financial Year</div>
        </div>
      </div>

      {/* Cross-Department Comparison */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Department Budget Rankings
        </h2>
        <div style={{ width: "100%", height: Math.max(deptTotals.length * 40, 200) }}>
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
          {deptTotals.map((d) => (
            <option key={d.department} value={d.department}>
              {d.department} ({formatRands(d.total)})
            </option>
          ))}
        </select>
      </div>

      {/* Department Detail */}
      {selectedDept && (
        <div className="space-y-6">
          <div className="card p-5 border-t-4 border-sa-green">
            <h2 className="text-lg font-semibold text-gray-900">{selectedDept}</h2>
            <p className="text-2xl font-bold text-sa-green mt-1">{formatRands(selectedDeptTotal)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {programmeTotals.length} programme{programmeTotals.length !== 1 ? "s" : ""} &middot; {financialYears.join(", ")} Main Appropriation
            </p>
          </div>

          {/* Programme Breakdown + Economic Classification side by side */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Programme Bar Chart */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Budget by Programme</h3>
              {programmeTotals.length > 0 ? (
                <div style={{ width: "100%", height: Math.max(programmeTotals.length * 36, 150) }}>
                  <ResponsiveContainer>
                    <BarChart data={programmeTotals} layout="vertical" margin={{ left: 10, right: 20 }}>
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

            {/* Economic Classification Pie */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Current vs Capital Split</h3>
              {classificationTotals.length > 0 ? (
                <div style={{ width: "100%", height: 250 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={classificationTotals}
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
                        {classificationTotals.map((_, i) => (
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
                  {programmeTotals.map((prog) => {
                    const pct = selectedDeptTotal > 0 ? (prog.total / selectedDeptTotal) * 100 : 0;
                    const isExpanded = expandedProgramme === prog.programme;
                    const subProgrammes = isExpanded
                      ? aggregateBySubProgramme(budgetRows, selectedDept, prog.programme)
                      : [];
                    return (
                      <tr key={prog.programme} className="group">
                        <td colSpan={4} className="p-0">
                          <div className="flex items-center hover:bg-gray-50 transition-colors">
                            <div className="flex-1 px-4 py-3">
                              <span className="font-medium text-gray-900">{prog.programme}</span>
                            </div>
                            <div className="px-4 py-3 text-right font-mono text-gray-700 whitespace-nowrap">
                              {formatRands(prog.total)}
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
                          {isExpanded && subProgrammes.length > 0 && (
                            <div className="bg-gray-50 border-t border-gray-100 px-8 py-2">
                              <table className="w-full text-xs">
                                <tbody>
                                  {subProgrammes.map((sub) => (
                                    <tr key={sub.subProgramme} className="border-b border-gray-100 last:border-0">
                                      <td className="py-1.5 text-gray-600">{sub.subProgramme}</td>
                                      <td className="py-1.5 text-right font-mono text-gray-700">{formatRands(sub.total)}</td>
                                      <td className="py-1.5 text-right text-gray-500 w-20">
                                        {prog.total > 0 ? ((sub.total / prog.total) * 100).toFixed(1) : 0}%
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
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
                    <td className="px-4 py-2 text-right font-mono font-semibold text-sa-green">{formatRands(selectedDeptTotal)}</td>
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
