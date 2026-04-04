"use client";

import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid, Cell,
} from "recharts";
import { formatRands } from "@/lib/utils";
import type { MunicipalFinance } from "@/lib/supabase";

// ── Constants ─────────────────────────────────────────────────────────────

const INDICATOR_LABELS: Record<string, string> = {
  cash_and_equivalents: "Cash & Equivalents",
  total_revenue: "Total Revenue",
  total_expenditure: "Total Expenditure",
  total_capital_expenditure: "Capital Expenditure",
  net_cash_from_operations: "Net Cash from Operations",
};

const INDICATOR_COLORS: Record<string, string> = {
  total_revenue: "#007A4D",
  total_expenditure: "#DE3831",
  total_capital_expenditure: "#FFB612",
  cash_and_equivalents: "#2563eb",
  net_cash_from_operations: "#7c3aed",
};

const METRO_COLORS: Record<string, string> = {
  CPT: "#007A4D",
  JHB: "#FFB612",
  ETH: "#DE3831",
  TSH: "#2563eb",
  EKU: "#7c3aed",
  NMA: "#ea580c",
  MAN: "#0891b2",
  BUF: "#059669",
};

const PROVINCE_GROUPS: Record<string, string[]> = {
  "Gauteng": ["JHB", "TSH", "EKU"],
  "Western Cape": ["CPT"],
  "KwaZulu-Natal": ["ETH"],
  "Eastern Cape": ["NMA", "BUF"],
  "Free State": ["MAN"],
};

type ViewMode = "overview" | "detail" | "compare";

const fmtTooltip = (value: unknown) => formatRands(Number(value));

// ── Component ─────────────────────────────────────────────────────────────

export default function MunicipalClient({ initialData }: { initialData: MunicipalFinance[] }) {
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [selectedMetro, setSelectedMetro] = useState("");
  const [compareIndicator, setCompareIndicator] = useState("total_revenue");

  // ── Derived data ────────────────────────────────────────────────────────

  const latestYear = useMemo(() => {
    const years = [...new Set(initialData.map((r) => r.financial_year))].sort();
    return years[years.length - 1] ?? "";
  }, [initialData]);

  const metros = useMemo(() => {
    const map = new Map<string, { code: string; name: string; province: string }>();
    for (const r of initialData) {
      if (!map.has(r.municipality_code)) {
        map.set(r.municipality_code, {
          code: r.municipality_code,
          name: r.municipality_name,
          province: r.province,
        });
      }
    }
    return Array.from(map.values());
  }, [initialData]);

  const metroSummaries = useMemo(() => {
    return metros.map((m) => {
      const latestRows = initialData.filter(
        (r) => r.municipality_code === m.code && r.financial_year === latestYear
      );
      const get = (ind: string) => latestRows.find((r) => r.indicator === ind)?.amount_rands ?? 0;
      const revenue = get("total_revenue");
      const expenditure = get("total_expenditure");
      const capex = get("total_capital_expenditure");
      const gap = revenue - expenditure;
      const capexPct = expenditure > 0 ? (capex / expenditure) * 100 : 0;
      return { ...m, revenue, expenditure, capex, gap, capexPct };
    });
  }, [metros, initialData, latestYear]);

  const selectedMetroData = useMemo(() => {
    if (!selectedMetro) return null;
    const rows = initialData.filter((r) => r.municipality_code === selectedMetro);
    const info = metros.find((m) => m.code === selectedMetro);
    const years = [...new Set(rows.map((r) => r.financial_year))].sort();

    const timeSeries = years.map((yr) => {
      const yearRows = rows.filter((r) => r.financial_year === yr);
      const entry: Record<string, unknown> = { year: yr };
      for (const ind of Object.keys(INDICATOR_LABELS)) {
        entry[ind] = yearRows.find((r) => r.indicator === ind)?.amount_rands ?? null;
      }
      return entry;
    });

    return { info, rows, years, timeSeries };
  }, [initialData, selectedMetro, metros]);

  const compareData = useMemo(() => {
    return metroSummaries.map((m) => {
      const row = initialData.find(
        (r) => r.municipality_code === m.code && r.financial_year === latestYear && r.indicator === compareIndicator
      );
      return { name: m.name, code: m.code, value: row?.amount_rands ?? 0 };
    }).sort((a, b) => b.value - a.value);
  }, [initialData, metroSummaries, latestYear, compareIndicator]);

  // ── Handlers ────────────────────────────────────────────────────────────

  const openDetail = (code: string) => {
    setSelectedMetro(code);
    setViewMode("detail");
  };

  if (initialData.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No municipal finance data available</p>
        <p className="text-sm mt-1">Data will appear here once loaded from the database.</p>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Municipal Finance Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Financial indicators for South Africa&apos;s 8 metropolitan municipalities. Source: National Treasury Municipal Money API.
          {latestYear && <span> Latest data: {latestYear}.</span>}
        </p>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-0 -mb-px">
          {([
            { id: "overview" as ViewMode, label: "Metro Overview" },
            { id: "detail" as ViewMode, label: "Metro Detail" },
            { id: "compare" as ViewMode, label: "Compare Metros" },
          ]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                viewMode === tab.id
                  ? "border-sa-green text-sa-green"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
      {viewMode === "overview" && (
        <div className="space-y-8">
          {Object.entries(PROVINCE_GROUPS).map(([province, codes]) => {
            const provMetros = metroSummaries.filter((m) => codes.includes(m.code));
            if (provMetros.length === 0) return null;
            return (
              <div key={province}>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">{province}</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {provMetros.map((m) => (
                    <button
                      key={m.code}
                      onClick={() => openDetail(m.code)}
                      className="card p-4 text-left hover:border-sa-green/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: METRO_COLORS[m.code] ?? "#64748b" }}
                        />
                        <span className="font-semibold text-gray-900">{m.name}</span>
                        <span className="text-[10px] text-gray-400 ml-auto">{m.code}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-gray-500">Revenue</div>
                          <div className="font-medium text-gray-900">{formatRands(m.revenue)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Expenditure</div>
                          <div className="font-medium text-gray-900">{formatRands(m.expenditure)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Surplus/Deficit</div>
                          <div className={`font-medium ${m.gap >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {m.gap >= 0 ? "+" : ""}{formatRands(m.gap)}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Capex % of Total</div>
                          <div className="font-medium text-gray-700">{m.capexPct.toFixed(1)}%</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── DETAIL ───────────────────────────────────────────────────────── */}
      {viewMode === "detail" && (
        <div className="space-y-6">
          {/* Metro Selector */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedMetro}
              onChange={(e) => setSelectedMetro(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sa-green focus:border-sa-green"
            >
              <option value="">-- Select a metro --</option>
              {metros.map((m) => (
                <option key={m.code} value={m.code}>{m.name}</option>
              ))}
            </select>
            <button
              onClick={() => setViewMode("overview")}
              className="text-sm text-sa-green hover:underline"
            >
              Back to overview
            </button>
          </div>

          {selectedMetroData?.info && (
            <>
              {/* Metro header */}
              <div className="card p-5 border-t-4" style={{ borderTopColor: METRO_COLORS[selectedMetro] ?? "#64748b" }}>
                <h2 className="text-lg font-semibold text-gray-900">{selectedMetroData.info.name}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedMetroData.info.province} &middot; {selectedMetroData.years.length} years of data ({selectedMetroData.years[0]} to {selectedMetroData.years[selectedMetroData.years.length - 1]})
                </p>
              </div>

              {/* Time series chart */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Financial Indicators Over Time</h3>
                <div style={{ width: "100%", height: 350 }}>
                  <ResponsiveContainer>
                    <LineChart data={selectedMetroData.timeSeries} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={(v) => formatRands(v)} tick={{ fontSize: 10 }} width={70} />
                      <Tooltip formatter={fmtTooltip} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      {Object.entries(INDICATOR_LABELS).map(([key, label]) => (
                        <Line
                          key={key}
                          type="monotone"
                          dataKey={key}
                          name={label}
                          stroke={INDICATOR_COLORS[key] ?? "#64748b"}
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          connectNulls
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Key metrics cards */}
              {(() => {
                const summary = metroSummaries.find((m) => m.code === selectedMetro);
                if (!summary) return null;
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="card text-center">
                      <div className="text-xl font-bold text-sa-green">{formatRands(summary.revenue)}</div>
                      <div className="text-xs text-gray-500 mt-1">Revenue ({latestYear})</div>
                    </div>
                    <div className="card text-center">
                      <div className="text-xl font-bold text-gray-700">{formatRands(summary.expenditure)}</div>
                      <div className="text-xs text-gray-500 mt-1">Expenditure ({latestYear})</div>
                    </div>
                    <div className="card text-center">
                      <div className={`text-xl font-bold ${summary.gap >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {summary.gap >= 0 ? "+" : ""}{formatRands(summary.gap)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Surplus / Deficit</div>
                    </div>
                    <div className="card text-center">
                      <div className="text-xl font-bold text-gray-700">{summary.capexPct.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500 mt-1">Capex / Total Exp.</div>
                    </div>
                  </div>
                );
              })()}

              {/* Data table */}
              <div className="card p-0 overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">All Data Points</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wide">
                        <th className="text-left px-4 py-2 font-medium">Year</th>
                        {Object.values(INDICATOR_LABELS).map((label) => (
                          <th key={label} className="text-right px-3 py-2 font-medium">{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedMetroData.timeSeries.map((row) => (
                        <tr key={row.year as string} className="hover:bg-gray-50">
                          <td className="px-4 py-2 font-medium text-gray-900">{row.year as string}</td>
                          {Object.keys(INDICATOR_LABELS).map((key) => (
                            <td key={key} className="px-3 py-2 text-right font-mono text-gray-700">
                              {row[key] != null ? formatRands(row[key] as number) : "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {!selectedMetro && (
            <div className="text-center py-12 text-gray-500">
              <p>Select a metro above, or click a metro card in the overview.</p>
            </div>
          )}
        </div>
      )}

      {/* ── COMPARE ──────────────────────────────────────────────────────── */}
      {viewMode === "compare" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="compare-indicator" className="text-sm text-gray-700 font-medium">
              Compare by:
            </label>
            <select
              id="compare-indicator"
              value={compareIndicator}
              onChange={(e) => setCompareIndicator(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sa-green focus:border-sa-green"
            >
              {Object.entries(INDICATOR_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <span className="text-xs text-gray-400">({latestYear})</span>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              {INDICATOR_LABELS[compareIndicator]} — All Metros ({latestYear})
            </h3>
            <div style={{ width: "100%", height: Math.max(compareData.length * 50, 200) }}>
              <ResponsiveContainer>
                <BarChart data={compareData} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <XAxis type="number" tickFormatter={(v) => formatRands(v)} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={fmtTooltip} />
                  <Bar dataKey="value" name={INDICATOR_LABELS[compareIndicator]} radius={[0, 4, 4, 0]}>
                    {compareData.map((d) => (
                      <Cell key={d.code} fill={METRO_COLORS[d.code] ?? "#64748b"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Summary table */}
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] tracking-wide">
                    <th className="text-left px-4 py-2 font-medium">Metro</th>
                    <th className="text-right px-4 py-2 font-medium">{INDICATOR_LABELS[compareIndicator]}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {compareData.map((d) => (
                    <tr key={d.code} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <button
                          onClick={() => openDetail(d.code)}
                          className="font-medium text-gray-900 hover:text-sa-green"
                        >
                          {d.name}
                        </button>
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-gray-700">{formatRands(d.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Data source note */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">Data Source</p>
        <p>
          National Treasury Municipal Money API. Covers 8 metropolitan municipalities.
          Financial data is reported annually in South African Rands.
        </p>
      </div>
    </div>
  );
}
