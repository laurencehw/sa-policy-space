"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Label,
} from "recharts";
import {
  CONSTRAINT_LABELS,
  type PolicyIdea,
  type BindingConstraint,
} from "@/lib/supabase";

// ── Constants ──────────────────────────────────────────────────────────────

const CONSTRAINT_HEX: Record<string, string> = {
  energy: "#ca8a04",
  logistics: "#2563eb",
  skills: "#7c3aed",
  regulation: "#ea580c",
  crime: "#dc2626",
  labor_market: "#db2777",
  land: "#16a34a",
  digital: "#0891b2",
  government_capacity: "#374151",
  corruption: "#e11d48",
};

const QUADRANT_LABELS = [
  { x: 4.4, y: 4.4, text: "Strategic Priorities", color: "#007A4D" },
  { x: 1.2, y: 4.4, text: "Long-term Investments", color: "#2563eb" },
  { x: 4.4, y: 1.2, text: "Quick Wins", color: "#16a34a" },
  { x: 1.2, y: 1.2, text: "Low Priority", color: "#9ca3af" },
];

// ── Custom Dot ─────────────────────────────────────────────────────────────

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  const color = CONSTRAINT_HEX[payload.binding_constraint] ?? "#9ca3af";
  const isHovered = props.isHovered;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={isHovered ? 9 : 7}
      fill={color}
      fillOpacity={isHovered ? 1 : 0.75}
      stroke={isHovered ? "#111" : "white"}
      strokeWidth={isHovered ? 2 : 1}
      style={{ cursor: "pointer", transition: "r 0.1s, opacity 0.1s" }}
    />
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────

function MatrixTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const idea = payload[0]?.payload as PolicyIdea & { x: number; y: number };
  if (!idea) return null;
  const color = CONSTRAINT_HEX[idea.binding_constraint] ?? "#9ca3af";
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 max-w-xs text-xs">
      <p className="font-semibold text-gray-900 text-sm leading-snug mb-1">{idea.title}</p>
      <div className="flex items-center gap-1.5 mb-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-gray-500">
          {(CONSTRAINT_LABELS as Record<string, string>)[idea.binding_constraint] ?? idea.binding_constraint}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-gray-600">
        <span>Feasibility</span>
        <span className="font-medium">{idea.feasibility_rating}/5</span>
        <span>Growth impact</span>
        <span className="font-medium">{idea.growth_impact_rating}/5</span>
        <span>Status</span>
        <span className="font-medium capitalize">{idea.current_status?.replace(/_/g, " ")}</span>
      </div>
      <p className="mt-2 text-[#007A4D] font-medium">Click to view →</p>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────

function ConstraintLegend({
  activeConstraint,
  onToggle,
  counts,
}: {
  activeConstraint: string | null;
  onToggle: (c: string) => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(CONSTRAINT_LABELS).map(([key, label]) => {
        if (!counts[key]) return null;
        const color = CONSTRAINT_HEX[key] ?? "#9ca3af";
        const active = !activeConstraint || activeConstraint === key;
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className="flex items-center gap-1.5 text-xs rounded-full px-2.5 py-1 transition-all"
            style={{
              backgroundColor: active ? `${color}20` : "#f3f4f6",
              color: active ? color : "#9ca3af",
              border: `1px solid ${active ? `${color}60` : "#e5e7eb"}`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: active ? color : "#d1d5db" }} />
            {label}
            <span className="font-medium">({counts[key]})</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function MatrixPage() {
  const router = useRouter();
  const [allIdeas, setAllIdeas] = useState<PolicyIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeConstraint, setActiveConstraint] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data) => { setAllIdeas(data as PolicyIdea[]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function toggleConstraint(c: string) {
    setActiveConstraint((prev) => (prev === c ? null : c));
  }

  // Add tiny jitter so overlapping dots are visible
  const chartData = useMemo(() =>
    allIdeas
      .filter((i) => i.feasibility_rating && i.growth_impact_rating)
      .map((i) => ({
        ...i,
        x: i.feasibility_rating + (Math.random() - 0.5) * 0.15,
        y: i.growth_impact_rating + (Math.random() - 0.5) * 0.15,
      })),
    [allIdeas]
  );

  const filteredData = useMemo(() =>
    activeConstraint
      ? chartData.filter((d) => d.binding_constraint === activeConstraint)
      : chartData,
    [chartData, activeConstraint]
  );

  const constraintCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const idea of allIdeas) {
      if (idea.binding_constraint) {
        counts[idea.binding_constraint] = (counts[idea.binding_constraint] ?? 0) + 1;
      }
    }
    return counts;
  }, [allIdeas]);

  function handleDotClick(data: any) {
    if (data?.activePayload?.[0]?.payload?.slug) {
      router.push(`/ideas/${data.activePayload[0].payload.slug}`);
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feasibility Matrix</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Each dot is a policy idea, plotted by political feasibility (x-axis) against economic
          growth impact (y-axis). Click any dot to view the idea. Filter by binding constraint
          using the legend below.
        </p>
      </div>

      {/* Legend */}
      {!loading && (
        <ConstraintLegend
          activeConstraint={activeConstraint}
          onToggle={toggleConstraint}
          counts={constraintCounts}
        />
      )}

      {/* Chart */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">
        {loading ? (
          <div className="h-96 flex items-center justify-center text-gray-400 text-sm">
            Loading ideas…
          </div>
        ) : filteredData.length === 0 ? (
          <div className="h-96 flex items-center justify-center text-gray-400 text-sm">
            No ideas match current filter.
          </div>
        ) : (
          <>
            {/* Quadrant labels overlay */}
            <div className="relative">
              <ResponsiveContainer width="100%" height={440}>
                <ScatterChart
                  margin={{ top: 24, right: 32, bottom: 40, left: 32 }}
                  onClick={handleDotClick}
                  style={{ cursor: "default" }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    domain={[0.5, 5.5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickLine={false}
                  >
                    <Label
                      value="Political Feasibility →"
                      position="insideBottom"
                      offset={-20}
                      style={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                    />
                  </XAxis>
                  <YAxis
                    type="number"
                    dataKey="y"
                    domain={[0.5, 5.5]}
                    ticks={[1, 2, 3, 4, 5]}
                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                    tickLine={false}
                  >
                    <Label
                      value="Economic Growth Impact →"
                      angle={-90}
                      position="insideLeft"
                      offset={14}
                      style={{ fontSize: 12, fill: "#6b7280", fontWeight: 500 }}
                    />
                  </YAxis>
                  {/* Quadrant dividers */}
                  <ReferenceLine x={3} stroke="#e5e7eb" strokeDasharray="4 4" />
                  <ReferenceLine y={3} stroke="#e5e7eb" strokeDasharray="4 4" />
                  <Tooltip content={<MatrixTooltip />} />
                  <Scatter
                    data={filteredData}
                    shape={(props: any) => {
                      const color = CONSTRAINT_HEX[props.binding_constraint] ?? "#9ca3af";
                      return (
                        <circle
                          cx={props.cx}
                          cy={props.cy}
                          r={6}
                          fill={color}
                          fillOpacity={0.75}
                          stroke="white"
                          strokeWidth={1}
                          style={{ cursor: "pointer" }}
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>

              {/* Quadrant label overlays */}
              <div className="absolute inset-0 pointer-events-none" style={{ margin: "24px 32px 40px 32px" }}>
                <div className="relative w-full h-full">
                  <span className="absolute top-1 right-1 text-[10px] font-semibold text-[#007A4D] bg-[#007A4D]/10 px-2 py-0.5 rounded-full">
                    Strategic Priorities
                  </span>
                  <span className="absolute top-1 left-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    Long-term Investments
                  </span>
                  <span className="absolute bottom-1 right-1 text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Quick Wins
                  </span>
                  <span className="absolute bottom-1 left-1 text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Low Priority
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-2">
              {filteredData.length} ideas plotted · Click any dot to view detail · Small jitter applied to separate overlapping dots
            </p>
          </>
        )}
      </div>

      {/* Quadrant guide */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Strategic Priorities", desc: "High growth + high feasibility — prioritise immediately", color: "#007A4D", bg: "bg-[#007A4D]/5 border-[#007A4D]/20" },
          { label: "Quick Wins", desc: "Feasible but lower impact — fast to implement, good signals", color: "#16a34a", bg: "bg-green-50 border-green-200" },
          { label: "Long-term Investments", desc: "High impact but low feasibility — worth sustained political effort", color: "#2563eb", bg: "bg-blue-50 border-blue-200" },
          { label: "Low Priority", desc: "Low impact and low feasibility — deprioritise", color: "#9ca3af", bg: "bg-gray-50 border-gray-200" },
        ].map((q) => (
          <div key={q.label} className={`rounded-xl border p-3 ${q.bg}`}>
            <p className="text-xs font-semibold mb-0.5" style={{ color: q.color }}>{q.label}</p>
            <p className="text-[11px] text-gray-500 leading-relaxed">{q.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
