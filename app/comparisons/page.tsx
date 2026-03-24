"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { CONSTRAINT_LABELS, CONSTRAINT_COLORS } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────

interface ComparisonRow {
  id: number;
  idea_id: number;
  idea_title: string;
  idea_slug: string;
  binding_constraint: string;
  country: string;
  iso3: string | null;
  reform_year: number | null;
  outcome_summary: string;
  source_url: string | null;
  source_label: string | null;
  created_at: string;
}

// Country → flag emoji map (ISO 3166-1 alpha-3)
const FLAG: Record<string, string> = {
  CHL: "🇨🇱", IND: "🇮🇳", VNM: "🇻🇳", BRA: "🇧🇷",
  KOR: "🇰🇷", EST: "🇪🇪", BWA: "🇧🇼", RWA: "🇷🇼",
  GEO: "🇬🇪", PER: "🇵🇪", COL: "🇨🇴", SLV: "🇸🇻",
  KEN: "🇰🇪", MUS: "🇲🇺", IDN: "🇮🇩", MYS: "🇲🇾",
  TUR: "🇹🇷", MEX: "🇲🇽", POL: "🇵🇱",
};

function escapeCSV(val: string | number | null | undefined): string {
  if (val == null) return "";
  const s = String(val).replace(/"/g, '""');
  return /[",\n\r]/.test(s) ? `"${s}"` : s;
}

function downloadComparisonsCSV(rows: ComparisonRow[]) {
  const headers = [
    "id", "country", "iso3", "reform_year", "binding_constraint",
    "idea_title", "outcome_summary", "source_label", "source_url",
  ];
  const data = rows.map((r) => [
    r.id, r.country, r.iso3 ?? "", r.reform_year ?? "",
    r.binding_constraint, r.idea_title,
    r.outcome_summary, r.source_label ?? "", r.source_url ?? "",
  ]);
  const csv = [headers, ...data].map((row) => row.map(escapeCSV).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sa-international-comparisons.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function countryFlag(row: ComparisonRow): string {
  if (row.iso3 && FLAG[row.iso3]) return FLAG[row.iso3];
  return "";
}

// ── Component ──────────────────────────────────────────────────────────────

export default function ComparisonsPage() {
  const [comparisons, setComparisons] = useState<ComparisonRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState("");
  const [constraintFilter, setConstraintFilter] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/comparisons")
      .then((r) => r.json())
      .then((data) => { setComparisons(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allCountries = useMemo(
    () => [...new Set(comparisons.map((c) => c.country))].sort(),
    [comparisons]
  );
  const allConstraints = useMemo(
    () => [...new Set(comparisons.map((c) => c.binding_constraint).filter(Boolean))].sort(),
    [comparisons]
  );

  const filtered = useMemo(
    () =>
      comparisons.filter((c) => {
        if (countryFilter && c.country !== countryFilter) return false;
        if (constraintFilter && c.binding_constraint !== constraintFilter) return false;
        return true;
      }),
    [comparisons, countryFilter, constraintFilter]
  );

  // Group by binding_constraint for sectioned layout
  const byConstraint = useMemo(() => {
    const groups: Record<string, ComparisonRow[]> = {};
    filtered.forEach((c) => {
      const key = c.binding_constraint || "other";
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    });
    return groups;
  }, [filtered]);

  const constraintGroups = Object.entries(byConstraint).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">International Comparisons</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          For each policy reform idea, how have peer economies tackled similar challenges — and what did they achieve?
          Cases span energy, logistics, skills, digital infrastructure, governance reform and more.
        </p>
      </div>

      {/* Stats */}
      {!loading && comparisons.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-sa-green">{comparisons.length}</div>
            <div className="text-xs text-gray-500 mt-1">Case Studies</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-sa-green">{allCountries.length}</div>
            <div className="text-xs text-gray-500 mt-1">Countries</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-sa-green">{allConstraints.length}</div>
            <div className="text-xs text-gray-500 mt-1">Policy Areas</div>
          </div>
        </div>
      )}

      {/* Filters */}
      {!loading && comparisons.length > 0 && (
        <div className="flex flex-wrap gap-4 items-end">
          {/* Policy area filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Policy Area
            </label>
            <select
              value={constraintFilter}
              onChange={(e) => setConstraintFilter(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sa-green/30 min-w-[200px]"
            >
              <option value="">All policy areas</option>
              {allConstraints.map((c) => (
                <option key={c} value={c}>
                  {(CONSTRAINT_LABELS as Record<string, string>)[c] ?? c}
                </option>
              ))}
            </select>
          </div>

          {/* Country filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
              Country
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setCountryFilter("")}
                className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 transition-colors ${
                  !countryFilter
                    ? "bg-gray-900 text-white ring-gray-900"
                    : "bg-white text-gray-600 ring-gray-200 hover:ring-gray-300"
                }`}
              >
                All
              </button>
              {allCountries.map((c) => {
                const flag = comparisons.find((r) => r.country === c);
                const emoji = flag ? countryFlag(flag) : "";
                return (
                  <button
                    key={c}
                    onClick={() => setCountryFilter(countryFilter === c ? "" : c)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 transition-colors ${
                      countryFilter === c
                        ? "bg-gray-900 text-white ring-gray-900"
                        : "bg-white text-gray-600 ring-gray-200 hover:ring-gray-300"
                    }`}
                  >
                    {emoji} {c}
                  </button>
                );
              })}
            </div>
          </div>

          {(countryFilter || constraintFilter) && (
            <button
              onClick={() => { setCountryFilter(""); setConstraintFilter(""); }}
              className="text-xs text-sa-green hover:underline self-end pb-1.5"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-20 bg-gray-50" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && comparisons.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-sm font-medium text-gray-700 mb-1">No comparisons data yet</p>
          <p className="text-xs text-gray-400">
            Run the migration in <code className="bg-gray-100 px-1 rounded">data/migrations/002_international_comparisons.sql</code> to populate this page.
          </p>
        </div>
      )}

      {/* No filter match */}
      {!loading && comparisons.length > 0 && filtered.length === 0 && (
        <div className="card text-center py-8 text-gray-400">
          <p className="text-sm">No comparisons match the selected filters.</p>
        </div>
      )}

      {/* Results count + download */}
      {!loading && filtered.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing {filtered.length} case {filtered.length !== 1 ? "studies" : "study"}
            {countryFilter || constraintFilter ? " (filtered)" : ""}
          </p>
          <button
            onClick={() => downloadComparisonsCSV(filtered)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-[#FFB612] text-[#92600a] hover:bg-[#FFB612]/10 transition-colors font-medium"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download CSV
          </button>
        </div>
      )}

      {/* Case studies — grouped by policy area */}
      {!loading && constraintGroups.length > 0 && (
        <div className="space-y-8">
          {constraintGroups.map(([constraintKey, cases]) => {
            const constraintLabel = (CONSTRAINT_LABELS as Record<string, string>)[constraintKey] ?? constraintKey;
            const badgeStyle = (CONSTRAINT_COLORS as Record<string, string>)[constraintKey] ?? "bg-gray-100 text-gray-700";

            return (
              <div key={constraintKey}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge ${badgeStyle}`}>{constraintLabel}</span>
                  <span className="text-xs text-gray-400">
                    {cases.length} case{cases.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {cases.map((c) => {
                    const isOpen = expandedId === c.id;
                    const flag = countryFlag(c);

                    return (
                      <div
                        key={c.id}
                        className={`card overflow-hidden transition-all ${isOpen ? "shadow-md" : "hover:shadow-sm"}`}
                      >
                        {/* Card header — always visible */}
                        <button
                          className="w-full text-left"
                          onClick={() => setExpandedId(isOpen ? null : c.id)}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg leading-none">{flag}</span>
                                <span className="font-semibold text-gray-900 text-sm">{c.country}</span>
                                {c.reform_year && (
                                  <span className="text-xs text-gray-400">{c.reform_year}</span>
                                )}
                              </div>
                              <p className={`text-sm text-gray-700 leading-relaxed ${isOpen ? "" : "line-clamp-2"}`}>
                                {c.outcome_summary}
                              </p>
                            </div>
                            <span className="text-gray-400 text-xs flex-shrink-0 mt-1">
                              {isOpen ? "▲" : "▼"}
                            </span>
                          </div>
                        </button>

                        {/* Expanded detail */}
                        {isOpen && (
                          <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                            {/* Link to the related SA policy idea */}
                            {c.idea_title && (
                              <div
                                className="rounded-lg p-3"
                                style={{ backgroundColor: "#f0faf4", borderLeft: "3px solid #007A4D" }}
                              >
                                <p className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#007A4D" }}>
                                  Related SA Policy Idea
                                </p>
                                <Link
                                  href={`/ideas/${c.idea_slug}`}
                                  className="text-sm font-medium hover:underline"
                                  style={{ color: "#007A4D" }}
                                >
                                  {c.idea_title} →
                                </Link>
                              </div>
                            )}

                            {/* Source */}
                            {c.source_label && (
                              <div className="flex items-start gap-2">
                                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0 mt-0.5">
                                  Source
                                </span>
                                {c.source_url ? (
                                  <a
                                    href={c.source_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-sa-green hover:underline"
                                  >
                                    {c.source_label}
                                  </a>
                                ) : (
                                  <span className="text-xs text-gray-500">{c.source_label}</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Methodology note */}
      {!loading && comparisons.length > 0 && (
        <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500 space-y-1">
          <p className="font-medium text-gray-700">Methodology</p>
          <p>
            Peer economies selected on structural similarity to South Africa: commodity dependence,
            developing-country institutional context, or prior proximity to SA&apos;s binding constraints.
            Outcome estimates are drawn from IMF Article IV reports, World Bank country assessments,
            and peer-reviewed literature. Cases are illustrative, not exhaustive.
          </p>
        </div>
      )}
    </div>
  );
}
