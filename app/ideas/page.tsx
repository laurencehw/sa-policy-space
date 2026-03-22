"use client";

import { useState, useEffect, Suspense } from "react";
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

const ALL_CONSTRAINTS = Object.keys(CONSTRAINT_LABELS) as BindingConstraint[];
const ALL_STATUSES: PolicyStatus[] = [
  "proposed", "debated", "drafted", "stalled", "implemented", "abandoned",
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

function IdeasContent() {
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get("package") ?? "";

  const [allIdeas, setAllIdeas] = useState<PolicyIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterConstraint, setFilterConstraint] = useState<BindingConstraint | "">("");
  const [filterStatus, setFilterStatus] = useState<PolicyStatus | "">("");
  const [filterPackage, setFilterPackage] = useState<string>(initialPackage);
  const [filterHorizon, setFilterHorizon] = useState<string>("");

  // Fetch once on mount; client-side filtering handles search/filter
  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data) => {
        setAllIdeas(data as PolicyIdea[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = allIdeas.filter((idea: any) => {
    const matchesSearch =
      !search ||
      idea.title.toLowerCase().includes(search.toLowerCase()) ||
      idea.description?.toLowerCase().includes(search.toLowerCase());
    const matchesConstraint =
      !filterConstraint || idea.binding_constraint === filterConstraint;
    const matchesStatus = !filterStatus || idea.current_status === filterStatus;
    const matchesPackage =
      !filterPackage || String(idea.reform_package) === filterPackage;
    const matchesHorizon =
      !filterHorizon || idea.time_horizon === filterHorizon;
    return matchesSearch && matchesConstraint && matchesStatus && matchesPackage && matchesHorizon;
  });

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
          placeholder="Search ideas…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-sa-green focus:border-transparent"
        />
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
      </div>

      {/* Active package filter banner */}
      {filterPackage && (
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <span>Filtered to: <strong>{PACKAGE_NAMES[Number(filterPackage)]}</strong></span>
          <button
            onClick={() => setFilterPackage("")}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            Clear ×
          </button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-sm">Loading ideas…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-sm">
            {allIdeas.length === 0
              ? "No ideas seeded yet. Add rows to the policy_ideas table."
              : "No ideas match your filters."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((idea) => (
            <Link key={idea.id} href={`/ideas/${idea.id}`} className="card block space-y-2">
              {/* Tags row */}
              <div className="flex flex-wrap gap-1.5">
                <span className={`badge ${CONSTRAINT_COLORS[idea.binding_constraint]}`}>
                  {CONSTRAINT_LABELS[idea.binding_constraint]}
                </span>
                <span className={`badge ring-1 ${(STATUS_COLORS as Record<string, string>)[(idea as any).current_status] ?? "bg-gray-50 text-gray-600 ring-gray-500/20"}`}>
                  {(idea as any).current_status?.replace(/_/g, " ")}
                </span>
                {(idea as any).time_horizon && (
                  <span className={`badge ring-1 ${
                    (idea as any).time_horizon === "quick_win"
                      ? "bg-green-50 text-green-700 ring-green-600/20"
                      : (idea as any).time_horizon === "medium_term"
                      ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                      : "bg-purple-50 text-purple-700 ring-purple-600/20"
                  }`}>
                    {TIME_HORIZON_LABELS[(idea as any).time_horizon]}
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
                    Raised {idea.times_raised}×
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
    </div>
  );
}

export default function IdeasPage() {
  return (
    <Suspense fallback={<div className="card text-center py-12 text-gray-400"><p className="text-sm">Loading ideas…</p></div>}>
      <IdeasContent />
    </Suspense>
  );
}
