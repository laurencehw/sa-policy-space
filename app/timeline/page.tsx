"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import indicatorsSummary from "@/data/indicators_summary.json";

// ─── Types ────────────────────────────────────────────────────────────────

interface IdeaSummary {
  id: number;
  title: string;
  slug: string;
  reform_package: number | null;
  current_status: string;
}

interface TimelineMeeting {
  id: number;
  date: string;
  committee_name: string;
  title: string;
  pmg_url: string;
  ideas: IdeaSummary[];
}

// ─── Constants ───────────────────────────────────────────────────────────

const PACKAGE_NAMES: Record<number, string> = {
  1: "Infrastructure Unblock",
  2: "SMME & Employment",
  3: "Human Capital",
  4: "Trade & Industry",
  5: "State Capacity",
};

const PACKAGE_COLORS: Record<number, string> = {
  1: "#007A4D",
  2: "#FFB612",
  3: "#1D4ED8",
  4: "#7C3AED",
  5: "#DC2626",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ─── Helpers ──────────────────────────────────────────────────────────────

function getMonthKey(date: string) {
  return date.slice(0, 7); // "2024-03"
}

function fmtMonthLabel(key: string) {
  const [year, month] = key.split("-");
  return `${MONTHS[parseInt(month) - 1]} ${year}`;
}

function fmtShortDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

// ─── Activity Chart ───────────────────────────────────────────────────────

function ActivityChart({
  buckets,
  maxCount,
  onClickMonth,
}: {
  buckets: Array<[string, number]>;
  maxCount: number;
  onClickMonth: (key: string) => void;
}) {
  if (!buckets.length) return null;

  const CHART_H = 72;
  const capped = Math.max(maxCount, 1);

  return (
    <div>
      {/* Bars */}
      <div className="flex items-end gap-px" style={{ height: `${CHART_H}px` }}>
        {buckets.map(([key, count]) => {
          const frac = count / capped;
          const h = Math.max(frac * CHART_H, 3);
          const alpha = 0.2 + frac * 0.8;
          return (
            <button
              key={key}
              onClick={() => onClickMonth(key)}
              title={`${fmtMonthLabel(key)}: ${count} meeting${count !== 1 ? "s" : ""}`}
              className="flex-1 rounded-t-sm transition-opacity hover:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-sa-green"
              style={{
                height: `${h}px`,
                backgroundColor: `rgba(0,122,77,${alpha})`,
                minWidth: "3px",
              }}
            />
          );
        })}
      </div>

      {/* Year ticks */}
      <div className="flex gap-px mt-1">
        {buckets.map(([key]) => {
          const isJan = key.endsWith("-01");
          const isJul = key.endsWith("-07");
          return (
            <div key={key} className="flex-1 text-center" style={{ minWidth: "3px" }}>
              {isJan && (
                <span className="text-[8px] text-gray-400 select-none">{key.slice(2, 4)}</span>
              )}
              {isJul && (
                <span className="text-[8px] text-gray-200 select-none">·</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Meeting Card ─────────────────────────────────────────────────────────

function MeetingCard({ meeting }: { meeting: TimelineMeeting }) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-4 hover:border-[#007A4D]/30 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3">
        {/* Date stamp */}
        <div className="shrink-0 text-right min-w-[46px]">
          <div className="text-sm font-semibold text-gray-800 tabular-nums">
            {fmtShortDate(meeting.date)}
          </div>
          <div className="text-xs text-gray-400 tabular-nums">
            {meeting.date.slice(0, 4)}
          </div>
        </div>

        {/* Vertical rule */}
        <div className="shrink-0 w-px self-stretch bg-gray-100 mt-1" />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: "#007A4D18", color: "#007A4D" }}
            >
              {meeting.committee_name}
            </span>
            {meeting.pmg_url && (
              <a
                href={meeting.pmg_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-gray-300 hover:text-[#007A4D] transition-colors"
                title="View on PMG"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>

          <p className="text-sm text-gray-800 font-medium leading-snug mb-2.5">
            {meeting.title}
          </p>

          {meeting.ideas.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {meeting.ideas.map((idea) => {
                const pkgColor = idea.reform_package != null
                  ? PACKAGE_COLORS[idea.reform_package]
                  : "#9CA3AF";
                return (
                  <Link
                    key={idea.id}
                    href={`/ideas/${idea.slug}`}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs border border-gray-200 bg-gray-50 hover:bg-[#007A4D]/5 hover:border-[#007A4D]/25 text-gray-600 hover:text-[#007A4D] transition-all max-w-[220px]"
                    title={idea.title}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: pkgColor }}
                    />
                    <span className="truncate">{idea.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Indicator Overlay Types ──────────────────────────────────────────────

interface IndicatorSummary {
  id: string;
  name: string;
  unit: string;
  frequency: string;
  sparkline: { period: string; value: number }[];
}

const OVERLAY_INDICATORS = indicatorsSummary as IndicatorSummary[];

/**
 * Expand indicator sparkline to monthly resolution for alignment with
 * monthly meeting buckets.
 */
function expandToMonthly(data: { period: string; value: number }[], freq: string): Map<string, number> {
  const map = new Map<string, number>();
  for (const pt of data) {
    if (freq === "annual") {
      for (let m = 1; m <= 12; m++) {
        map.set(`${pt.period}-${String(m).padStart(2, "0")}`, pt.value);
      }
    } else if (freq === "quarterly") {
      const match = pt.period.match(/^(\d{4})-Q(\d)$/);
      if (match) {
        const year = match[1];
        const q = parseInt(match[2]);
        const startMonth = (q - 1) * 3 + 1;
        for (let m = startMonth; m < startMonth + 3; m++) {
          map.set(`${year}-${String(m).padStart(2, "0")}`, pt.value);
        }
      }
    } else {
      map.set(pt.period, pt.value);
    }
  }
  return map;
}

function IndicatorOverlayChart({
  buckets,
  indicator,
}: {
  buckets: Array<[string, number]>;
  indicator: IndicatorSummary;
}) {
  const monthlyValues = useMemo(
    () => expandToMonthly(indicator.sparkline, indicator.frequency),
    [indicator]
  );

  const chartData = useMemo(() => {
    return buckets.map(([key, count]) => ({
      month: key,
      meetings: count,
      indicator: monthlyValues.get(key) ?? null,
    }));
  }, [buckets, monthlyValues]);

  const hasOverlap = chartData.some((d) => d.indicator !== null);
  if (!hasOverlap) return null;

  return (
    <div className="h-52 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 9, fill: "#9ca3af" }}
            tickLine={false}
            interval="preserveStartEnd"
            tickFormatter={(v: string) => v.endsWith("-01") ? v.slice(0, 4) : ""}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 9, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 9, fill: "#ca8a04" }}
            tickLine={false}
            axisLine={false}
            width={50}
          />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
            labelFormatter={(label) => fmtMonthLabel(String(label))}
          />
          <Legend
            wrapperStyle={{ fontSize: 10 }}
            formatter={(value: string) =>
              value === "meetings" ? "Committee Meetings" : indicator.name
            }
          />
          <Bar yAxisId="left" dataKey="meetings" fill="rgba(0,122,77,0.25)" radius={[2, 2, 0, 0]} />
          <Line yAxisId="right" type="stepAfter" dataKey="indicator" stroke="#ca8a04" strokeWidth={2} dot={false} connectNulls />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const [meetings, setMeetings] = useState<TimelineMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState("all");
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [overlayIndicator, setOverlayIndicator] = useState<string>("");
  const monthRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    fetch("/api/timeline")
      .then((r) => r.json())
      .then((data: TimelineMeeting[]) => {
        setMeetings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const committees = useMemo(() => {
    const seen = new Set<string>();
    for (const m of meetings) {
      if (m.committee_name) seen.add(m.committee_name);
    }
    return [...seen].sort();
  }, [meetings]);

  const filtered = useMemo(() => {
    return meetings.filter((m) => {
      if (selectedCommittee !== "all" && m.committee_name !== selectedCommittee) return false;
      if (selectedPackage !== null && !m.ideas.some((i) => i.reform_package === selectedPackage))
        return false;
      return true;
    });
  }, [meetings, selectedCommittee, selectedPackage]);

  const { buckets, maxCount } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of filtered) {
      const key = getMonthKey(m.date);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    const sorted = [...counts.entries()].sort(([a], [b]) => a.localeCompare(b));
    const max = Math.max(...sorted.map(([, c]) => c), 1);
    return { buckets: sorted, maxCount: max };
  }, [filtered]);

  const grouped = useMemo(() => {
    const byYear = new Map<string, Map<string, TimelineMeeting[]>>();
    for (const m of filtered) {
      const year = m.date.slice(0, 4);
      const key = getMonthKey(m.date);
      if (!byYear.has(year)) byYear.set(year, new Map());
      const byMonth = byYear.get(year)!;
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key)!.push(m);
    }
    return [...byYear.entries()]
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([year, months]) => ({
        year,
        months: [...months.entries()]
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([key, list]) => ({
            key,
            label: fmtMonthLabel(key),
            meetings: list.sort((a, b) => b.date.localeCompare(a.date)),
          })),
      }));
  }, [filtered]);

  function scrollToMonth(key: string) {
    const el = monthRefs.current[key];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const hasFilters = selectedCommittee !== "all" || selectedPackage !== null;

  // Date range from raw unfiltered meetings (sorted desc already)
  const earliestKey = meetings.length ? getMonthKey(meetings[meetings.length - 1].date) : null;
  const latestKey = meetings.length ? getMonthKey(meetings[0].date) : null;
  const dateRangeLabel =
    earliestKey && latestKey ? `${fmtMonthLabel(earliestKey)} – ${fmtMonthLabel(latestKey)}` : null;

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="flex gap-0.5">
            <span className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#007A4D" }} />
            <span className="w-1 h-5 rounded-sm" style={{ backgroundColor: "#FFB612" }} />
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Parliamentary Timeline</h1>
        </div>
        <p className="text-gray-500 text-sm">
          Committee meetings where reform ideas were discussed
          {dateRangeLabel && <span className="text-gray-400"> · {dateRangeLabel}</span>}
        </p>

        {!loading && meetings.length > 0 && (
          <div className="flex flex-wrap gap-5 mt-3">
            <Stat value={meetings.length} label="total meetings" />
            <Stat value={committees.length} label="committees" />
            <Stat value={filtered.length} label={hasFilters ? "showing" : "indexed"} highlight={hasFilters} />
          </div>
        )}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
        {/* Committee */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Committee</span>
          <select
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007A4D]/30 max-w-[260px] truncate"
          >
            <option value="all">All Committees</option>
            {committees.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="h-5 w-px bg-gray-200 hidden sm:block" />

        {/* Reform package */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Package</span>
          <button
            onClick={() => setSelectedPackage(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              selectedPackage === null
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            All
          </button>
          {Object.entries(PACKAGE_NAMES).map(([idStr, name]) => {
            const pkgId = Number(idStr);
            const active = selectedPackage === pkgId;
            const color = PACKAGE_COLORS[pkgId];
            return (
              <button
                key={pkgId}
                onClick={() => setSelectedPackage(active ? null : pkgId)}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
                style={
                  active
                    ? { backgroundColor: color, borderColor: color, color: "#fff" }
                    : { backgroundColor: "#fff", borderColor: "#E5E7EB", color: "#4B5563" }
                }
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 mb-px"
                  style={{ backgroundColor: active ? "rgba(255,255,255,0.8)" : color }}
                />
                {name}
              </button>
            );
          })}
        </div>

        {hasFilters && (
          <>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <button
              onClick={() => { setSelectedCommittee("all"); setSelectedPackage(null); }}
              className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2"
            >
              Clear filters
            </button>
          </>
        )}
      </div>

      {/* ── Body ── */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Activity chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Monthly Activity</h2>
              <span className="text-xs text-gray-400">Click a bar to jump to that month</span>
            </div>
            <ActivityChart
              buckets={buckets}
              maxCount={maxCount}
              onClickMonth={scrollToMonth}
            />
            {buckets.length > 1 && (
              <div className="flex justify-between mt-1 text-[10px] text-gray-400 select-none">
                <span>{fmtMonthLabel(buckets[0][0])}</span>
                <span className="text-gray-300">
                  peak: {maxCount} meeting{maxCount !== 1 ? "s" : ""} in a month
                </span>
                <span>{fmtMonthLabel(buckets[buckets.length - 1][0])}</span>
              </div>
            )}

            {/* Indicator overlay */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-gray-500">
                  Overlay economic indicator
                </label>
                <select
                  value={overlayIndicator}
                  onChange={(e) => setOverlayIndicator(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#007A4D]/30"
                >
                  <option value="">None</option>
                  {OVERLAY_INDICATORS.map((ind) => (
                    <option key={ind.id} value={ind.id}>
                      {ind.name} ({ind.unit})
                    </option>
                  ))}
                </select>
              </div>
              {overlayIndicator && (() => {
                const ind = OVERLAY_INDICATORS.find((i) => i.id === overlayIndicator);
                if (!ind) return null;
                return (
                  <>
                    <IndicatorOverlayChart buckets={buckets} indicator={ind} />
                    <p className="text-[9px] text-gray-400 mt-1">
                      Source: {ind.name} — meetings (green bars, left axis) vs. {ind.unit} (gold line, right axis)
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-10">
            {grouped.map(({ year, months }) => (
              <section key={year}>
                {/* Year sticky header */}
                <div className="sticky top-14 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-white/95 backdrop-blur-sm border-b border-gray-100 mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-gray-900">{year}</h2>
                    <span className="text-sm text-gray-400">
                      {months.reduce((s, m) => s + m.meetings.length, 0)} meetings
                    </span>
                  </div>
                </div>

                <div className="space-y-8">
                  {months.map(({ key, label, meetings: monthMeetings }) => (
                    <div
                      key={key}
                      ref={(el) => { monthRefs.current[key] = el; }}
                      className="scroll-mt-28"
                    >
                      {/* Month header */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <h3 className="text-sm font-semibold text-gray-600">{label}</h3>
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: "#007A4D15", color: "#007A4D" }}
                        >
                          {monthMeetings.length} meeting{monthMeetings.length !== 1 ? "s" : ""}
                        </span>
                        <div className="flex-1 h-px bg-gray-100" />
                      </div>

                      {/* Meeting cards */}
                      <div className="space-y-3 pl-0 sm:pl-3 border-l-2 border-gray-100 ml-1">
                        {monthMeetings.map((m) => (
                          <MeetingCard key={m.id} meeting={m} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────

function Stat({
  value,
  label,
  highlight = false,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-sm">
      <span
        className="font-semibold"
        style={{ color: highlight ? "#007A4D" : "#111827" }}
      >
        {value.toLocaleString()}
      </span>
      <span className="text-gray-500 ml-1">{label}</span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div
        className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: "#007A4D40", borderTopColor: "#007A4D" }}
      />
      <p className="text-sm text-gray-400">Loading timeline…</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-sm">No meetings match the current filters.</p>
      <p className="text-gray-400 text-xs mt-1">Try clearing the committee or package filter.</p>
    </div>
  );
}
