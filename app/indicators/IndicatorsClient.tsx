"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { CONSTRAINT_LABELS } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────

interface DataPoint {
  period: string;
  value: number;
}

interface Indicator {
  id: string;
  name: string;
  source: string;
  source_code: string;
  unit: string;
  frequency: string;
  binding_constraints: string[];
  latest_value: number;
  latest_period: string;
  sparkline: DataPoint[];
  values: DataPoint[];
}

// ── Constraint colors ─────────────────────────────────────────────────────

const CONSTRAINT_CHART_COLORS: Record<string, string> = {
  energy: "#ca8a04",
  transport_logistics: "#2563eb",
  skills_education: "#7c3aed",
  trade_openness: "#ea580c",
  regulatory_burden: "#ea580c",
  labour_market: "#db2777",
  land_housing: "#16a34a",
  digital_infrastructure: "#0891b2",
  government_capacity: "#374151",
  fiscal_space: "#059669",
  health_systems: "#e11d48",
  financial_access: "#0d9488",
  corruption_governance: "#9333ea",
};

function getChartColor(constraints: string[]): string {
  for (const c of constraints) {
    if (CONSTRAINT_CHART_COLORS[c]) return CONSTRAINT_CHART_COLORS[c];
  }
  return "#007A4D";
}

// ── Sparkline component ───────────────────────────────────────────────────

function Sparkline({ data, color }: { data: DataPoint[]; color: string }) {
  return (
    <div className="w-24 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Main chart for a single indicator ─────────────────────────────────────

function IndicatorChart({ indicator }: { indicator: Indicator }) {
  const color = getChartColor(indicator.binding_constraints);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
            {indicator.name}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {indicator.binding_constraints.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${CONSTRAINT_CHART_COLORS[c] ?? "#007A4D"}15`,
                  color: CONSTRAINT_CHART_COLORS[c] ?? "#007A4D",
                }}
              >
                {CONSTRAINT_LABELS[c as keyof typeof CONSTRAINT_LABELS] ?? c.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold" style={{ color }}>
            {indicator.latest_value.toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-400">
            {indicator.unit} ({indicator.latest_period})
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={indicator.values}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e5e7eb",
              }}
              formatter={(value: unknown) => [
                `${Number(value).toLocaleString()} ${indicator.unit}`,
                indicator.name,
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 2, fill: color }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Source */}
      <p className="text-[10px] text-gray-400">
        Source: {indicator.source} ({indicator.source_code})
        {" \u00b7 "}{indicator.frequency}
      </p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function IndicatorsClient({
  indicators,
}: {
  indicators: Indicator[];
}) {
  const [filterConstraint, setFilterConstraint] = useState<string>("");

  // Get unique constraints from the data
  const allConstraints = useMemo(() => {
    const set = new Set<string>();
    for (const ind of indicators) {
      for (const c of ind.binding_constraints) set.add(c);
    }
    return [...set].sort();
  }, [indicators]);

  const filtered = useMemo(() => {
    if (!filterConstraint) return indicators;
    return indicators.filter((ind) =>
      ind.binding_constraints.includes(filterConstraint)
    );
  }, [indicators, filterConstraint]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Economic Indicators
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Key South African economic data mapped to binding growth constraints.
          These indicators provide empirical context for the reform ideas tracked
          in this database.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {indicators.slice(0, 8).map((ind) => {
          const color = getChartColor(ind.binding_constraints);
          return (
            <div
              key={ind.id}
              className="bg-white border border-gray-200 rounded-lg px-3 py-2.5"
            >
              <p className="text-[10px] text-gray-400 truncate">{ind.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="font-bold text-sm" style={{ color }}>
                  {ind.latest_value.toLocaleString()}
                </p>
                <Sparkline data={ind.sparkline} color={color} />
              </div>
              <p className="text-[9px] text-gray-300 mt-0.5">
                {ind.unit} ({ind.latest_period})
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={filterConstraint}
          onChange={(e) => setFilterConstraint(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sa-green"
        >
          <option value="">All constraints</option>
          {allConstraints.map((c) => (
            <option key={c} value={c}>
              {CONSTRAINT_LABELS[c as keyof typeof CONSTRAINT_LABELS] ??
                c.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-400">
          {filtered.length} indicator{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {filtered.map((ind) => (
          <IndicatorChart key={ind.id} indicator={ind} />
        ))}
      </div>

      {/* Methodology note */}
      <div className="text-xs text-gray-400 border-t border-gray-100 pt-4 space-y-1">
        <p>
          All data sourced from official South African statistical agencies
          (Stats SA, SARB, National Treasury) and international organisations
          (World Bank, IMF). See individual chart sources for publication codes.
        </p>
        <p>
          Indicators are mapped to the Hausmann-Rodrik-Velasco binding constraint
          taxonomy used throughout this database. An indicator may relate to
          multiple constraints.
        </p>
      </div>
    </div>
  );
}
