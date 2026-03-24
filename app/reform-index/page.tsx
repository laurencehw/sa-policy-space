import { computeReformIndex } from "@/lib/reform-index";
import type { PackageSubIndex, QuarterlySnapshot } from "@/lib/reform-index";
import Link from "next/link";

export const revalidate = 3600; // Computed from static JSON

// SA flag palette used across the app
const PACKAGE_COLORS: Record<number, { bar: string; text: string; bg: string }> = {
  1: { bar: "bg-amber-400", text: "text-amber-700", bg: "bg-amber-50" },
  2: { bar: "bg-blue-400", text: "text-blue-700", bg: "bg-blue-50" },
  3: { bar: "bg-purple-400", text: "text-purple-700", bg: "bg-purple-50" },
  4: { bar: "bg-teal-400", text: "text-teal-700", bg: "bg-teal-50" },
  5: { bar: "bg-slate-400", text: "text-slate-700", bg: "bg-slate-50" },
};

function TrendArrow({ trend, delta }: { trend: "up" | "down" | "flat"; delta: number }) {
  if (trend === "flat") return <span className="text-gray-400">→</span>;
  const up = trend === "up";
  return (
    <span className={`flex items-center gap-1 ${up ? "text-sa-green" : "text-red-500"}`}>
      {up ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      )}
      <span className="text-base font-semibold">+{delta} pts this quarter</span>
    </span>
  );
}

// SVG line chart for quarterly snapshots
function QuarterlyChart({ snapshots }: { snapshots: QuarterlySnapshot[] }) {
  const W = 680;
  const H = 240;
  const PAD_L = 50;
  const PAD_R = 24;
  const PAD_T = 20;
  const PAD_B = 48;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  const scores = snapshots.map((s) => s.overall);
  const maxScore = Math.max(...scores, 50); // minimum ceiling of 50

  const xScale = (i: number) => PAD_L + (i / (snapshots.length - 1)) * chartW;
  const yScale = (v: number) => PAD_T + chartH - (v / maxScore) * chartH;

  const points = snapshots.map((s, i) => ({
    x: xScale(i),
    y: yScale(s.overall),
    label: s.quarter,
    value: s.overall,
  }));

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(" ");

  // Area fill path (close to bottom)
  const areaD =
    pathD +
    ` L ${points[points.length - 1].x.toFixed(1)},${(PAD_T + chartH).toFixed(1)}` +
    ` L ${PAD_L},${(PAD_T + chartH).toFixed(1)} Z`;

  // Y-axis grid lines
  const yTicks = [0, 10, 20, 30, 40, 50].filter((t) => t <= maxScore + 5);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Quarterly reform index progression">
      {/* Grid lines */}
      {yTicks.map((t) => (
        <g key={t}>
          <line
            x1={PAD_L}
            y1={yScale(t)}
            x2={W - PAD_R}
            y2={yScale(t)}
            stroke="#e5e7eb"
            strokeWidth={1}
          />
          <text
            x={PAD_L - 6}
            y={yScale(t) + 4}
            textAnchor="end"
            fontSize={10}
            fill="#9ca3af"
          >
            {t}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <path d={areaD} fill="#007A4D" fillOpacity={0.08} />

      {/* Line */}
      <path d={pathD} fill="none" stroke="#007A4D" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

      {/* Data points */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill="#007A4D" />
          {/* Value label above point */}
          <text
            x={p.x}
            y={p.y - 8}
            textAnchor="middle"
            fontSize={10}
            fontWeight={i === points.length - 1 ? "700" : "400"}
            fill={i === points.length - 1 ? "#007A4D" : "#6b7280"}
          >
            {p.value}
          </text>
          {/* X-axis label */}
          <text
            x={p.x}
            y={PAD_T + chartH + 18}
            textAnchor="middle"
            fontSize={10}
            fill="#9ca3af"
          >
            {p.label.replace(" 20", " '")}
          </text>
        </g>
      ))}

      {/* Y-axis label */}
      <text
        x={12}
        y={PAD_T + chartH / 2}
        textAnchor="middle"
        fontSize={10}
        fill="#9ca3af"
        transform={`rotate(-90, 12, ${PAD_T + chartH / 2})`}
      >
        Index (0–100)
      </text>

      {/* "Current" marker */}
      <line
        x1={points[points.length - 1].x}
        y1={PAD_T}
        x2={points[points.length - 1].x}
        y2={PAD_T + chartH}
        stroke="#007A4D"
        strokeWidth={1}
        strokeDasharray="3 3"
        opacity={0.4}
      />
    </svg>
  );
}

export default function ReformIndexPage() {
  const index = computeReformIndex();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reform Progress Index</h1>
        <p className="text-gray-500 text-sm mt-1">
          Synthetic measure of South Africa&apos;s reform implementation progress —
          weighted by strategic importance.
        </p>
      </div>

      {/* Hero score */}
      <section className="rounded-2xl border-2 border-sa-green/20 bg-gradient-to-br from-sa-green/5 to-white p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Overall Index</p>
            <div className="flex items-end gap-3">
              <span className="text-7xl font-black text-sa-green tabular-nums">
                {index.current_score}
              </span>
              <span className="text-2xl text-gray-400 mb-2">/100</span>
            </div>
            <div className="mt-2">
              <TrendArrow trend={index.trend} delta={index.trend_delta} />
            </div>
          </div>

          <div className="sm:ml-auto text-right">
            <p className="text-xs text-gray-400">Last updated</p>
            <p className="text-sm text-gray-600">{index.last_updated}</p>
            <div className="mt-3">
              <div className="w-48 bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-sa-green h-2.5 rounded-full"
                  style={{ width: `${index.current_score}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {index.current_score}% of full implementation potential
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quarterly chart */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Quarterly Progression</h2>
        <p className="text-sm text-gray-500">
          Simulated index progression based on known implementation status changes over
          the past six quarters.
        </p>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <QuarterlyChart snapshots={index.quarterly_snapshots} />
        </div>
      </section>

      {/* Package sub-indices */}
      <section className="space-y-4">
        <h2 className="font-semibold text-gray-900">Package Sub-Indices</h2>
        <p className="text-sm text-gray-500">
          Each reform package is scored independently. Package weights reflect strategic
          importance and cross-sector growth multipliers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {index.package_sub_indices.map((pkg) => {
            const colors = PACKAGE_COLORS[pkg.package_id] ?? PACKAGE_COLORS[1];
            return (
              <div
                key={pkg.package_id}
                className={`rounded-xl border border-gray-200 p-5 ${colors.bg}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className={`font-semibold text-sm ${colors.text}`}>{pkg.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{pkg.tagline}</p>
                  </div>
                  <span className={`text-2xl font-black tabular-nums ${colors.text}`}>
                    {pkg.score}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="w-full bg-white/60 rounded-full h-1.5">
                    <div
                      className={`${colors.bar} h-1.5 rounded-full transition-all`}
                      style={{ width: `${pkg.score}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {pkg.implemented_count + pkg.partial_count} / {pkg.idea_count} ideas progressed
                  </span>
                  <span>
                    Weight{" "}
                    <strong className={colors.text}>
                      {Math.round(pkg.weight * 100)}%
                    </strong>
                  </span>
                </div>

                <div className="mt-2 flex gap-3 text-xs">
                  <span className="text-gray-500">
                    Avg impact:{" "}
                    <span className="font-medium text-gray-700">
                      {pkg.avg_impact.toFixed(1)}/5
                    </span>
                  </span>
                  <span className="text-gray-500">
                    Importance:{" "}
                    <span className="font-medium text-gray-700">{pkg.importance}/5</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Scenario analysis */}
      <section className="space-y-4">
        <h2 className="font-semibold text-gray-900">What Would It Take to Reach X?</h2>
        <p className="text-sm text-gray-500">
          Scenario analysis showing the reform effort required to reach milestone scores.
        </p>
        <div className="space-y-3">
          {index.scenarios.map((scenario) => (
            <div
              key={scenario.target}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-center">
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-gray-700 tabular-nums">
                      {scenario.target}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    +{scenario.gap} pts
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{scenario.label}</p>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {scenario.narrative}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="space-y-4 border-t border-gray-200 pt-8">
        <h2 className="font-semibold text-gray-900">Methodology</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p className="leading-relaxed">
            The Reform Progress Index is a synthetic, weighted composite of implementation
            progress across South Africa&apos;s five reform packages. It is designed to summarise
            the trajectory of reform, not to capture political intent or parliamentary debate.
          </p>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm">Status weights</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1.5 pr-4 font-semibold text-gray-700">Status</th>
                    <th className="text-right py-1.5 font-semibold text-gray-700">Index credit</th>
                    <th className="text-left py-1.5 pl-4 text-gray-500">Rationale</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Implemented", "1.00", "Full reform benefit realised"],
                    ["Partially implemented", "0.60", "Substantial but incomplete progress"],
                    ["Under review", "0.30", "Active government attention"],
                    ["Drafted", "0.25", "Legislative or regulatory text exists"],
                    ["Debated", "0.20", "Parliamentary discussion ongoing"],
                    ["Proposed", "0.10", "Policy idea on record, no action"],
                    ["Stalled", "0.05", "Acknowledged but blocked"],
                    ["Abandoned", "0.00", "No credit"],
                  ].map(([status, weight, note]) => (
                    <tr key={status} className="border-b border-gray-100">
                      <td className="py-1.5 pr-4 font-medium text-gray-800">{status}</td>
                      <td className="py-1.5 text-right font-mono text-sa-green font-bold">{weight}</td>
                      <td className="py-1.5 pl-4 text-gray-500">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm">Package weights</h3>
            <p className="text-gray-600">
              Package weights reflect assessed strategic importance and cross-sector growth
              multipliers: Infrastructure (28%), Human Capital (22%), State Capacity (20%),
              SMME &amp; Employment (16%), Trade &amp; Industrial (14%). These weights are
              based on the theory of change described in each package and on the binding
              constraint literature for South Africa.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-sm">Limitations</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Status estimates are based on parliamentary proceedings, not independent assessment</li>
              <li>Partial implementation within categories uses estimated splits (55/45 and 40/60)</li>
              <li>Quarterly snapshots before the current period are simulated, not observed</li>
              <li>The index does not capture quality of implementation, only binary status movement</li>
              <li>Reform interdependencies (e.g., infrastructure enabling SMME growth) are not modelled</li>
            </ul>
          </div>
        </div>
      </section>

      <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
        <Link href="/packages" className="btn-primary inline-block">
          Browse Reform Packages
        </Link>
        <Link href="/ideas" className="btn-secondary inline-block">
          All Policy Ideas
        </Link>
      </div>
    </div>
  );
}
