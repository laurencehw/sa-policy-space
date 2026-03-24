"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  CONSTRAINT_LABELS,
  CONSTRAINT_COLORS,
  STATUS_COLORS,
  type PolicyIdea,
  type BindingConstraint,
  type PolicyStatus,
} from "@/lib/supabase";

// ── Constants ──────────────────────────────────────────────────────────────

const PACKAGE_NAMES: Record<number, string> = {
  1: "Infrastructure Unblock",
  2: "SMME & Employment Acceleration",
  3: "Human Capital Pipeline",
  4: "Trade & Industrial Competitiveness",
  5: "State Capacity & Governance",
};

const TIME_HORIZON_LABELS: Record<string, string> = {
  quick_win: "Quick Win",
  medium_term: "Medium Term",
  long_term: "Long Term",
};

const MAX_COMPARE = 3;

// ── Helper components ──────────────────────────────────────────────────────

function RatingDots({ value, max = 5, color }: { value: number; max?: number; color: string }) {
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: i < value ? color : "#e5e7eb" }}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500 tabular-nums">{value}/{max}</span>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function ComparePage() {
  const [allIdeas, setAllIdeas] = useState<PolicyIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PolicyIdea[]>([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data) => {
        setAllIdeas(data as PolicyIdea[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const selectedIds = new Set(selected.map((s) => s.id));
    return allIdeas
      .filter(
        (idea) =>
          !selectedIds.has(idea.id) &&
          (idea.title.toLowerCase().includes(q) ||
            idea.description?.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [allIdeas, search, selected]);

  function addIdea(idea: PolicyIdea) {
    if (selected.length >= MAX_COMPARE) return;
    setSelected((prev) => [...prev, idea]);
    setSearch("");
    setDropdownOpen(false);
  }

  function removeIdea(id: number) {
    setSelected((prev) => prev.filter((i) => i.id !== id));
  }

  const canAdd = selected.length < MAX_COMPARE;

  // ── Comparison table rows ─────────────────────────────────────────────

  const rows: { label: string; render: (idea: PolicyIdea) => React.ReactNode }[] = [
    {
      label: "Binding Constraint",
      render: (idea) => (
        <span className={`badge ${CONSTRAINT_COLORS[idea.binding_constraint]}`}>
          {CONSTRAINT_LABELS[idea.binding_constraint]}
        </span>
      ),
    },
    {
      label: "Status",
      render: (idea) => (
        <Badge className={(STATUS_COLORS as Record<string, string>)[idea.current_status] ?? "bg-gray-50 text-gray-600 ring-gray-500/20"}>
          {idea.current_status?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      label: "Time Horizon",
      render: (idea) =>
        idea.time_horizon ? (
          <Badge
            className={
              idea.time_horizon === "quick_win"
                ? "bg-green-50 text-green-700 ring-green-600/20"
                : idea.time_horizon === "medium_term"
                ? "bg-blue-50 text-blue-700 ring-blue-600/20"
                : "bg-purple-50 text-purple-700 ring-purple-600/20"
            }
          >
            {TIME_HORIZON_LABELS[idea.time_horizon]}
          </Badge>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
    {
      label: "Reform Package",
      render: (idea) =>
        idea.reform_package ? (
          <Link
            href={`/packages/${idea.reform_package}`}
            className="text-xs text-[#007A4D] hover:underline"
          >
            Pkg {idea.reform_package}: {PACKAGE_NAMES[idea.reform_package]}
          </Link>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
    {
      label: "Feasibility Rating",
      render: (idea) => <RatingDots value={idea.feasibility_rating} color="#007A4D" />,
    },
    {
      label: "Growth Impact Rating",
      render: (idea) => <RatingDots value={idea.growth_impact_rating} color="#FFB612" />,
    },
    {
      label: "Times Raised",
      render: (idea) => (
        <span className="text-sm font-semibold text-gray-900">{idea.times_raised}×</span>
      ),
    },
    {
      label: "Committee",
      render: (idea) => (
        <span className="text-xs text-gray-600">{idea.source_committee ?? "—"}</span>
      ),
    },
    {
      label: "Last Discussed",
      render: (idea) =>
        idea.last_discussed ? (
          <span className="text-xs text-gray-600">
            {new Date(idea.last_discussed).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compare Policy Ideas</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Select up to {MAX_COMPARE} policy ideas to compare side-by-side across feasibility, growth
          impact, timelines, and stakeholder alignment.
        </p>
      </div>

      {/* Selector */}
      <div className="card p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {selected.length}/{MAX_COMPARE} selected
          </span>
          {selected.length > 0 && (
            <button
              onClick={() => setSelected([])}
              className="text-xs text-gray-400 hover:text-gray-600 ml-auto"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Selected chips */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selected.map((idea) => (
              <div
                key={idea.id}
                className="flex items-center gap-1.5 text-xs bg-[#007A4D]/10 text-[#007A4D] rounded-full px-3 py-1.5 font-medium"
              >
                <span className="max-w-[200px] truncate">{idea.title}</span>
                <button
                  onClick={() => removeIdea(idea.id)}
                  className="hover:text-red-500 ml-0.5 leading-none"
                  aria-label={`Remove ${idea.title}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search input */}
        {canAdd && (
          <div className="relative">
            <input
              type="search"
              placeholder={loading ? "Loading ideas…" : "Search and add an idea…"}
              value={search}
              disabled={loading}
              onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true); }}
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#007A4D] focus:border-transparent"
            />
            {dropdownOpen && suggestions.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {suggestions.map((idea) => (
                  <button
                    key={idea.id}
                    onMouseDown={() => addIdea(idea)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <p className="text-sm font-medium text-gray-900 leading-snug">{idea.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {CONSTRAINT_LABELS[idea.binding_constraint]} · {idea.current_status?.replace(/_/g, " ")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comparison Table */}
      {selected.length >= 2 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs w-36 sticky left-0 bg-gray-50">
                  Field
                </th>
                {selected.map((idea, i) => (
                  <th key={idea.id} className="px-4 py-3 text-left min-w-[220px]">
                    <div className="flex items-start gap-2">
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
                        style={{ backgroundColor: ["#007A4D", "#FFB612", "#e85d04"][i] }}
                      >
                        {i + 1}
                      </span>
                      <Link
                        href={`/ideas/${idea.slug}`}
                        className="font-semibold text-gray-900 hover:text-[#007A4D] text-sm leading-snug"
                      >
                        {idea.title}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.label} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-xs text-gray-500 font-medium sticky left-0 bg-white">
                    {row.label}
                  </td>
                  {selected.map((idea) => (
                    <td key={idea.id} className="px-4 py-3">
                      {row.render(idea)}
                    </td>
                  ))}
                </tr>
              ))}
              {/* Description row */}
              <tr className="hover:bg-gray-50/50">
                <td className="px-4 py-3 text-xs text-gray-500 font-medium sticky left-0 bg-white align-top">
                  Description
                </td>
                {selected.map((idea) => (
                  <td key={idea.id} className="px-4 py-3 align-top">
                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">
                      {idea.description}
                    </p>
                    <Link
                      href={`/ideas/${idea.slug}`}
                      className="text-[11px] text-[#007A4D] hover:underline mt-1 inline-block"
                    >
                      View full detail →
                    </Link>
                  </td>
                ))}
              </tr>
              {/* Actions row */}
              <tr className="bg-gray-50/50">
                <td className="px-4 py-3" />
                {selected.map((idea) => (
                  <td key={idea.id} className="px-4 py-3">
                    <div className="flex flex-col gap-1.5">
                      <Link
                        href={`/ideas/${idea.slug}`}
                        className="text-xs font-medium text-[#007A4D] hover:underline"
                      >
                        Full detail →
                      </Link>
                      <Link
                        href={`/briefs?title=${encodeURIComponent(idea.title)}`}
                        className="text-xs text-gray-500 hover:text-[#007A4D] hover:underline"
                      >
                        Generate brief →
                      </Link>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : selected.length === 1 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-sm">Add at least one more idea to compare.</p>
          <p className="text-xs mt-1">Use the search above to find ideas.</p>
        </div>
      ) : (
        <div className="card text-center py-16 text-gray-400">
          <p className="text-base font-medium text-gray-600 mb-1">No ideas selected</p>
          <p className="text-sm">
            Search for policy ideas above to start comparing.
          </p>
          <Link href="/ideas" className="text-[#007A4D] text-sm hover:underline mt-3 inline-block">
            Browse all ideas →
          </Link>
        </div>
      )}

    </div>
  );
}
