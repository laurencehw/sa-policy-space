"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { formatRands } from "@/lib/utils";
import type { ConsolidatedByFunction } from "@/lib/supabase";

const FUNC_COLORS: Record<string, string> = {
  "Learning and culture": "#7c3aed",
  "Social development": "#dc2626",
  "Debt-service costs": "#64748b",
  "Health": "#059669",
  "Community development": "#ea580c",
  "Economic development": "#2563eb",
  "Peace and security": "#0891b2",
  "General public services": "#d946ef",
  "Contingency reserve": "#a3a3a3",
};

const fmtTooltip = (value: unknown) => formatRands(Number(value));

interface Props {
  data: ConsolidatedByFunction[];
}

export default function ConsolidatedTab({ data }: Props) {
  const [selectedYear, setSelectedYear] = useState("2026/27");

  const financialYears = useMemo(
    () => [...new Set(data.map((d) => d.financial_year))].sort(),
    [data]
  );

  // Bar chart: spending by function for selected year
  const yearData = useMemo(
    () => data
      .filter((d) => d.financial_year === selectedYear)
      .map((d) => ({
        function_group: d.function_group,
        total: d.total_rands,
        fill: FUNC_COLORS[d.function_group] ?? "#64748b",
      }))
      .sort((a, b) => b.total - a.total),
    [data, selectedYear]
  );

  const totalSpend = useMemo(
    () => yearData.reduce((s, d) => s + d.total, 0),
    [yearData]
  );

  // Line chart: trends over time (exclude contingency reserve for clarity)
  const trendData = useMemo(() => {
    const byYear = new Map<string, Record<string, number>>();
    for (const d of data) {
      if (d.function_group === "Contingency reserve") continue;
      if (!byYear.has(d.financial_year)) byYear.set(d.financial_year, { year: 0 } as unknown as Record<string, number>);
      const entry = byYear.get(d.financial_year)!;
      entry.year = entry.year || 0;
      entry[d.function_group] = d.total_rands;
    }
    return [...byYear.entries()]
      .map(([fy, vals]) => ({ financialYear: fy, ...vals }))
      .sort((a, b) => a.financialYear.localeCompare(b.financialYear));
  }, [data]);

  const trendFunctions = useMemo(
    () => [...new Set(data.map((d) => d.function_group))]
      .filter((f) => f !== "Contingency reserve")
      .sort((a, b) => {
        const aTotal = data.filter((d) => d.function_group === a && d.financial_year === selectedYear)[0]?.total_rands ?? 0;
        const bTotal = data.filter((d) => d.function_group === b && d.financial_year === selectedYear)[0]?.total_rands ?? 0;
        return bTotal - aTotal;
      }),
    [data, selectedYear]
  );

  if (data.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No consolidated expenditure data available</p>
        <p className="text-sm mt-1">Data from National Treasury Budget Review pivot tables will appear here once loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Explainer */}
      <div className="card p-4 bg-blue-50 border-blue-200">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">Consolidated government spending</span> includes
          national, provincial, local government, and social security funds — showing the true
          allocation of public resources by function. Source: National Treasury Budget Review.
          Values in R billions.
        </p>
      </div>

      {/* Summary + Year Selector */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div>
          <div className="text-2xl font-bold text-sa-green">{formatRands(totalSpend)}</div>
          <div className="text-xs text-gray-500">Total consolidated expenditure, {selectedYear}</div>
        </div>
        <div className="sm:ml-auto">
          <label htmlFor="fy-select" className="block text-xs font-medium text-gray-500 mb-1">Financial Year</label>
          <select
            id="fy-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-sa-green focus:border-sa-green"
          >
            {financialYears.map((fy) => (
              <option key={fy} value={fy}>{fy}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Bar Chart: Spending by Function */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Spending by Function — {selectedYear}
        </h2>
        <div style={{ width: "100%", height: Math.max(yearData.length * 44, 200) }}>
          <ResponsiveContainer>
            <BarChart data={yearData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <XAxis type="number" tickFormatter={(v) => formatRands(v)} tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="function_group"
                width={160}
                tick={{ fontSize: 11 }}
              />
              <Tooltip formatter={fmtTooltip} />
              <Bar dataKey="total" name="Expenditure" radius={[0, 4, 4, 0]}>
                {yearData.map((d, i) => (
                  <rect key={i} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Function Detail — {selectedYear}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wide">
                <th className="text-left px-4 py-2 font-medium">Function</th>
                <th className="text-right px-4 py-2 font-medium">Total</th>
                <th className="text-right px-4 py-2 font-medium">% of Budget</th>
                <th className="text-right px-4 py-2 font-medium">Current</th>
                <th className="text-right px-4 py-2 font-medium">Capital & Transfers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {yearData.map((d) => {
                const row = data.find((r) => r.function_group === d.function_group && r.financial_year === selectedYear);
                const pct = totalSpend > 0 ? (d.total / totalSpend) * 100 : 0;
                const currentRands = (row?.current_rthousands ?? 0) * 1000;
                const capitalRands = (row?.capital_transfers_rthousands ?? 0) * 1000;
                return (
                  <tr key={d.function_group} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5">
                      <span className="inline-block w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: d.fill }} />
                      <span className="font-medium text-gray-900">{d.function_group}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-gray-700">{formatRands(d.total)}</td>
                    <td className="px-4 py-2.5 text-right text-gray-500">{pct.toFixed(1)}%</td>
                    <td className="px-4 py-2.5 text-right font-mono text-gray-500">{formatRands(currentRands)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-gray-500">{formatRands(capitalRands)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td className="px-4 py-2 font-semibold text-gray-700">Total</td>
                <td className="px-4 py-2 text-right font-mono font-semibold text-sa-green">{formatRands(totalSpend)}</td>
                <td className="px-4 py-2 text-right text-gray-500">100%</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Spending Trends by Function (2022/23–2028/29)
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          Outcomes through 2023/24, revised estimate 2024/25, medium-term estimates 2025/26–2028/29.
        </p>
        <div style={{ width: "100%", height: 380 }}>
          <ResponsiveContainer>
            <LineChart data={trendData} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="financialYear" tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={(v) => formatRands(v)} tick={{ fontSize: 10 }} width={70} />
              <Tooltip formatter={fmtTooltip} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {trendFunctions.map((func) => (
                <Line
                  key={func}
                  type="monotone"
                  dataKey={func}
                  stroke={FUNC_COLORS[func] ?? "#64748b"}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  name={func}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
