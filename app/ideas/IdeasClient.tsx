"use client";

import { useState, useMemo, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CONSTRAINT_LABELS,
  STATUS_COLORS,
  CONSTRAINT_COLORS,
  type PolicyIdea,
  type BindingConstraint,
  type PolicyStatus,
} from "@/lib/supabase";
import { slugify } from "@/lib/utils";

const ALL_CONSTRAINTS = Object.keys(CONSTRAINT_LABELS) as BindingConstraint[];
const ALL_STATUSES: PolicyStatus[] = [
  "proposed", "debated", "drafted", "under_review", "stalled",
  "partially_implemented", "implemented", "abandoned",
];

const PACKAGE_NAMES: Record<number, string> = {
  1: "Infrastructure Unblock",
  2: "SMME & Employment Acceleration",
  3: "Human Capital Pipeline",
  4: "Trade & Industrial Competitiveness",
  5: "State Capacity & Governance",
};

const TIME_HORIZON_LABELS: Record<string, string> = {
  quick_win:   "Quick Win",
  medium_term: "Medium Term",
  long_term:   "Long Term",
};

type SortKey = "combined" | "growth" | "feasibility" | "last_discussed" | "alpha";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "combined",      label: "Combined Score" },
  { value: "growth",        label: "Growth Impact" },
  { value: "feasibility",   label: "Feasibility" },
  { value: "last_discussed", label: "Last Discussed" },
  { value: "alpha",         label: "A\u2013Z" },
];

const RATING_OPTIONS = [
  { value: "", label: "Any" },
  { value: "1", label: "1+" },
  { value: "2", label: "2+" },
  { value: "3", label: "3+" },
  { value: "4", label: "4+" },
  { value: "5", label: "5" },
];

function sortIdeas(ideas: PolicyIdea[], sortBy: SortKey): PolicyIdea[] {
  return [...ideas].sort((a, b) => {
    switch (sortBy) {
      case "growth":
        return b.growth_impact_rating - a.growth_impact_rating;
      case "feasibility":
        return b.feasibility_rating - a.feasibility_rating;
      case "last_discussed": {
        const aT = a.last_discussed ? new Date(a.last_discussed).getTime() : 0;
        const bT = b.last_discussed ? new Date(b.last_discussed).getTime() : 0;
        return bT - aT;
      }
      case "alpha":
        return a.title.localeCompare(b.title);
      default: // "combined"
        return (b.growth_impact_rating + b.feasibility_rating) -
               (a.growth_impact_rating + a.feasibility_rating);
    }
  });
}

function escapeCSV(val: string | number | null | undefined): string {
  if (val == null) return "";
  const s = String(val).replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

function downloadIdeasCSV(ideas: PolicyIdea[]) {
  const headers = [
    "id", "title", "binding_constraint", "current_status", "time_horizon",
    "growth_impact_rating", "feasibility_rating", "reform_package",
    "source_committee", "responsible_department", "description",
  ];
  const rows = ideas.map((idea) => [
    idea.id,
    idea.title,
    CONSTRAINT_LABELS[idea.binding_constraint] ?? idea.binding_constraint,
    idea.current_status,
    idea.time_horizon ?? "",
    idea.growth_impact_rating,
    idea.feasibility_rating,
    idea.reform_package ?? "",
    idea.source_committee ?? "",
    idea.responsible_department ?? "",
    idea.description ? idea.description.slice(0, 500) : "",
  ]);
  const csv = [headers, ...rows].map((r) => r.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sa-policy-ideas.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function fmtMonthYear(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

function RatingBar({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 w-4 rounded-full ${i < value ? "bg-sa-green" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function IdeasContent({ initialIdeas }: { initialIdeas: PolicyIdea[] }) {
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get("package") ?? "";
  const initialConstraint = (searchParams.get("constraint") ?? "") as BindingConstraint | "";

  const allIdeas = initialIdeas;
  const [search, setSearch] = useState("");
  const [filterConstraint, setFilterConstraint] = useState<BindingConstraint | "">(initialConstraint);
  const [filterStatus, setFilterStatus] = useState<PolicyStatus | "">("");
  const [filterPackage, setFilterPackage] = useState<string>(initialPackage);
  const [filterHorizon, setFilterHorizon] = useState<string>("");
  const [filterCommittee, setFilterCommittee] = useState<string>("");
  const [filterMinFeasibility, setFilterMinFeasibility] = useState<string>("");
  const [filterMinGrowth, setFilterMinGrowth] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortKey>("combined");
  const [visibleCount, setVisibleCount] = useState(24);

  const committees = useMemo(() => {
    const counts = new Map<string, number>();
    for (const idea of allIdeas) {
      const c = idea.source_committee;
      if (c) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [allIdeas]);

  // Reset pagination when filters change
  const filterKey = `${search}|${filterConstraint}|${filterStatus}|${filterPackage}|${filterHorizon}|${filterCommittee}|${filterMinFeasibility}|${filterMinGrowth}|${sortBy}`;
  const prevFilterKey = useRef(filterKey);
  if (prevFilterKey.current !== filterKey) {
    prevFilterKey.current = filterKey;
    if (visibleCount !== 24) setVisibleCount(24);
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const base = allIdeas.filter((idea) => {
      const matchesSearch =
        !search ||
        idea.title.toLowerCase().includes(q) ||
        idea.description?.toLowerCase().includes(q) ||
        idea.binding_constraint?.toLowerCase().includes(q) ||
        CONSTRAINT_LABELS[idea.binding_constraint]?.toLowerCase().includes(q) ||
        idea.source_committee?.toLowerCase().includes(q) ||
        idea.responsible_department?.toLowerCase().includes(q);
      const matchesConstraint =
        !filterConstraint || idea.binding_constraint === filterConstraint;
      const matchesStatus = !filterStatus || idea.current_status === filterStatus;
      const matchesPackage =
        !filterPackage || String(idea.reform_package) === filterPackage;
      const matchesHorizon =
        !filterHorizon || idea.time_horizon === filterHorizon;
      const matchesCommittee =
        !filterCommittee || idea.source_committee === filterCommittee;
      const matchesMinFeasibility =
        !filterMinFeasibility || idea.feasibility_rating >= Number(filterMinFeasibility);
      const matchesMinGrowth =
        !filterMinGrowth || idea.growth_impact_rating >= Number(filterMinGrowth);
      return matchesSearch && matchesConstraint && matchesStatus && matchesPackage && matchesHorizon && matchesCommittee && matchesMinFeasibility && matchesMinGrowth;
    });
    return sortIdeas(base, sortBy);
  }, [allIdeas, search, filterConstraint, filterStatus, filterPackage, filterHorizon, filterCommittee, filterMinFeasibility, filterMinGrowth, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policy Ideas</h1>
        <p className="text-gray-500 text-sm mt-1">
          Original synthesis from parliamentary committee proceedings.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <input
          type="search"
          placeholder="Search ideas\u2026"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-sa-green focus:border-transparent"
        />
        <select
          value={filterCommittee}
          onChange={(e) => setFilterCommittee(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-sa-green"
        >
          <option value="">All Committees</option>
          {committees.map(({ name, count }) => (
            <option key={name} value={name}>{name} ({count})</option>
          ))}
        </select>
        <select
          value={filterPackage}
          onChange={(e) => setFilterPackage(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-sa-green"
        >
          <option value="">All packages</option>
          {Object.entries(PACKAGE_NAMES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
        <select
          value={filterHorizon}
          onChange={(e) => setFilterHorizon(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-sa-green"
        >
          <option value="">All horizons</option>
          {Object.entries(TIME_HORIZON_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={filterConstraint}
          onChange={(e) => setFilterConstraint(e.target.value as BindingConstraint | "")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-sa-green"
        >
          <option value="">All constraints</option>
          {ALL_CONSTRAINTS.map((c) => (
            <option key={c} value={c}>{CONSTRAINT_LABELS[c]}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as PolicyStatus | "")}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-sa-green"
        >
          <option value="">All statuses</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        {/* Min feasibility */}
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-400 whitespace-nowrap">Feasibility &ge;</label>
          <select
            value={filterMinFeasibility}
            onChange={(e) => setFilterMinFeasibility(e.target.value)}
            className="rounded-lg border border-gray-300 px-2 py-2 text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-sa-green"
            aria-label="Minimum feasibility"
          >
            {RATING_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {/* Min growth */}
        <div className="flex items-center gap-1">
          <label className="text-xs text-gray-400 whitespace-nowrap">Growth &ge;</label>
          <select
            value={filterMinGrowth}
            onChange={(e) => setFilterMinGrowth(e.target.value)}
            className="rounded-lg border border-gray-300 px-2 py-2 text-sm bg-white
                       focus:outline-none focus:ring-2 focus:ring-sa-green"
            aria-label="Minimum growth impact"
          >
            {RATING_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        {/* Sort control */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="rounded-lg border border-[#007A4D] px-3 py-2 text-sm bg-white
                     text-[#007A4D] font-medium
                     focus:outline-none focus:ring-2 focus:ring-sa-green"
          aria-label="Sort ideas by"
        >
          {SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>Sort: {label}</option>
          ))}
        </select>
      </div>

      {/* Active filter banners */}
      {(filterPackage || filterCommittee || filterConstraint) && (
        <div className="flex flex-wrap gap-2">
          {filterConstraint && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span>Constraint: <strong>{CONSTRAINT_LABELS[filterConstraint]}</strong></span>
              <button
                onClick={() => setFilterConstraint("")}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          )}
          {filterPackage && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span>Package: <strong>{PACKAGE_NAMES[Number(filterPackage)]}</strong></span>
              <button
                onClick={() => setFilterPackage("")}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          )}
          {filterCommittee && (
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span>Committee: <strong>{filterCommittee}</strong></span>
              <button
                onClick={() => setFilterCommittee("")}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results count + sort label + download */}
      {allIdeas.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            {filtered.length} idea{filtered.length !== 1 ? "s" : ""}
            {" \u00b7 "}sorted by{" "}
            <span className="font-medium text-gray-500">
              {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
            </span>
          </p>
          <button
            onClick={() => downloadIdeasCSV(filtered)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#FFB612] text-[#92600a] hover:bg-[#FFB612]/10 transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>
        </div>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-sm">
            {allIdeas.length === 0
              ? "No ideas seeded yet. Add rows to the policy_ideas table."
              : "No ideas match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.slice(0, visibleCount).map((idea) => (
            <Link key={idea.id} href={`/ideas/${idea.slug || slugify(idea.title)}`} className="card block space-y-2">
              {/* Tags row */}
              <div className="flex flex-wrap gap-1.5">
                <span className={`badge ${CONSTRAINT_COLORS[idea.binding_constraint]}`}>
                  {CONSTRAINT_LABELS[idea.binding_constraint]}
                </span>
                <span className={`badge ring-1 ${(STATUS_COLORS as Record<string, string>)[idea.current_status] ?? "bg-gray-50 text-gray-600 ring-gray-500/20"}`}>
                  {idea.current_status?.replace(/_/g, " ")}
                </span>
                {idea.time_horizon && (
                  <span className={`badge ring-1 ${
                    idea.time_horizon === "quick_win"
                      ? "bg-green-50 text-green-700 ring-green-600/20"
                      : idea.time_horizon === "medium_term"
                      ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                      : "bg-purple-50 text-purple-700 ring-purple-600/20"
                  }`}>
                    {TIME_HORIZON_LABELS[idea.time_horizon]}
                  </span>
                )}
                {idea.dormant === 1 && (
                  <span className="badge bg-gray-100 text-gray-500 ring-1 ring-gray-300">
                    Dormant
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="font-medium text-gray-900 leading-snug text-sm">
                {idea.title}
              </h3>

              {/* Description snippet */}
              {idea.description && (
                <p className="text-xs text-gray-500 line-clamp-2">{idea.description}</p>
              )}

              {/* Ratings */}
              <div className="flex items-center justify-between pt-1">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 w-16">Growth</span>
                    <RatingBar value={idea.growth_impact_rating} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-gray-400 w-16">Feasibility</span>
                    <RatingBar value={idea.feasibility_rating} />
                  </div>
                </div>
                {idea.times_raised > 1 && (
                  <span className="text-xs text-gray-400">
                    Raised {idea.times_raised}&times;
                  </span>
                )}
              </div>

              {/* Dates */}
              {(idea.first_raised || idea.last_discussed) && (
                <div className="flex gap-3 pt-1 border-t border-gray-100 text-xs text-gray-400">
                  {idea.first_raised && (
                    <span>First raised: {fmtMonthYear(idea.first_raised)}</span>
                  )}
                  {idea.last_discussed && (
                    <span>Last discussed: {fmtMonthYear(idea.last_discussed)}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Show more */}
      {filtered.length > visibleCount && (
        <div className="text-center pt-2">
          <button
            onClick={() => setVisibleCount((v) => v + 24)}
            className="text-sm text-sa-green hover:underline font-medium"
          >
            Show more ({filtered.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

export default function IdeasClient({ initialIdeas }: { initialIdeas: PolicyIdea[] }) {
  return (
    <Suspense fallback={<div className="card text-center py-12 text-gray-400"><p className="text-sm">Loading ideas&hellip;</p></div>}>
      <IdeasContent initialIdeas={initialIdeas} />
    </Suspense>
  );
}
