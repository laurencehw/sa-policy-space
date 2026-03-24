"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ProgressStats {
  totalIdeas: number;
  ideasWithPlans: number;
  implementedCount: number;
  quickWinsCount: number;
  dormantCount: number;
  byStatus: { name: string; value: number; color: string }[];
  byConstraint: { name: string; value: number; color: string }[];
  byPackage: { name: string; total: number; implemented: number; withPlans: number }[];
  byHorizon: { name: string; value: number; color: string }[];
}

// ── Palette ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  proposed: "#3b82f6",
  debated: "#eab308",
  drafted: "#6366f1",
  stalled: "#ef4444",
  under_review: "#f97316",
  partially_implemented: "#14b8a6",
  implemented: "#22c55e",
  abandoned: "#9ca3af",
};

const CONSTRAINT_COLORS: Record<string, string> = {
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

const HORIZON_COLORS: Record<string, string> = {
  "Quick Win": "#22c55e",
  "Medium Term": "#f59e0b",
  "Long Term": "#8b5cf6",
  Unassigned: "#9ca3af",
};

const PKG_COLORS = ["#d97706", "#2563eb", "#7c3aed", "#0d9488", "#64748b"];

// ── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, accent = false,
}: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-[#007A4D] bg-[#007A4D]/5" : "border-gray-200 bg-white"}`}>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ? "text-[#007A4D]" : "text-gray-900"}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Progress Bar ───────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = "#007A4D" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-gray-500 w-10 text-right tabular-nums">{pct}%</span>
    </div>
  );
}

// ── Custom Tooltip ─────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? p.fill }}>
          {p.name}: <span className="font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ── Main Chart Component ───────────────────────────────────────────────────

export default function ProgressCharts({ stats }: { stats: ProgressStats }) {
  const plansCoverage = stats.totalIdeas > 0
    ? Math.round((stats.ideasWithPlans / stats.totalIdeas) * 100)
    : 0;

  return (
    <div className="space-y-10">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard label="Total Ideas" value={stats.totalIdeas} accent />
        <StatCard
          label="With Implementation Plans"
          value={stats.ideasWithPlans}
          sub={`${plansCoverage}% coverage`}
        />
        <StatCard
          label="Implemented / Partial"
          value={stats.implementedCount}
          sub={`${stats.totalIdeas > 0 ? Math.round((stats.implementedCount / stats.totalIdeas) * 100) : 0}% of total`}
        />
        <StatCard label="Quick Wins" value={stats.quickWinsCount} sub="short-horizon reforms" />
        <StatCard label="Dormant" value={stats.dormantCount} sub="not discussed 12+ mo" />
      </div>

      {/* ── Package Coverage ── */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Coverage by Reform Package</h2>
        <p className="text-xs text-gray-500 mb-4">
          Implementation plan coverage and progress status per package.
        </p>
        <div className="space-y-3">
          {stats.byPackage.map((pkg, i) => (
            <div key={pkg.name} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ backgroundColor: PKG_COLORS[i] }}
                >
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-gray-800">{pkg.name}</span>
                <span className="ml-auto text-xs text-gray-400">{pkg.total} ideas</span>
              </div>
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                    <span>Implementation plans</span>
                    <span>{pkg.withPlans}/{pkg.total}</span>
                  </div>
                  <ProgressBar value={pkg.withPlans} max={pkg.total} color={PKG_COLORS[i]} />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-0.5">
                    <span>Implemented / partial</span>
                    <span>{pkg.implemented}/{pkg.total}</span>
                  </div>
                  <ProgressBar value={pkg.implemented} max={pkg.total} color="#22c55e" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Status Distribution */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Ideas by Status</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stats.byStatus} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(v) => v.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 3, 3, 0]} name="Ideas">
                {stats.byStatus.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Horizon */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Time Horizon Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.byHorizon}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
                nameKey="name"
                paddingAngle={2}
              >
                {stats.byHorizon.map((entry) => (
                  <Cell key={entry.name} fill={HORIZON_COLORS[entry.name] ?? "#9ca3af"} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => [`${val} ideas`, ""]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Constraint Distribution */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 md:col-span-2">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Ideas by Binding Constraint</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stats.byConstraint} margin={{ bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={48}
              />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} name="Ideas">
                {stats.byConstraint.map((entry) => (
                  <Cell key={entry.name} fill={CONSTRAINT_COLORS[entry.name] ?? "#9ca3af"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
