"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PackageGap {
  name: string;
  score: number;
  package_id: number;
}

const COLORS: Record<number, string> = {
  1: "#f59e0b",
  2: "#3b82f6",
  3: "#a855f7",
  4: "#14b8a6",
  5: "#64748b",
};

export default function BudgetGapChart({ packages }: { packages: PackageGap[] }) {
  if (!packages.length) return null;

  return (
    <div className="h-32 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={packages} layout="vertical" margin={{ left: 0, right: 10, top: 0, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 9, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            width={90}
            tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 13) + "\u2026" : v}
          />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
            formatter={(value: unknown) => [`${value}/100`, "Progress"]}
          />
          <Bar
            dataKey="score"
            radius={[0, 4, 4, 0]}
            fill="#f59e0b"
            barSize={14}
            shape={(props: any) => {
              const color = COLORS[props.payload?.package_id] ?? "#f59e0b";
              return <rect {...props} fill={color} />;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
