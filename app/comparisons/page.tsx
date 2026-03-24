"use client";

import { useState, useMemo } from "react";
import comparisonsData from "@/data/international_comparisons.json";

// ── Types ──────────────────────────────────────────────────────────────────

interface Comparison {
  id: string;
  country: string;
  flag: string;
  binding_constraint: string;
  constraint_label: string;
  title: string;
  period: string;
  approach: string;
  outcome: string;
  gdp_impact: string;
  timeline: string;
  lessons_for_sa: string;
  sources: string[];
}

const CONSTRAINT_COLORS: Record<string, string> = {
  energy_infrastructure:     "bg-amber-100 text-amber-800 ring-amber-200",
  logistics_ports_rail:      "bg-orange-100 text-orange-800 ring-orange-200",
  water_infrastructure:      "bg-blue-100 text-blue-800 ring-blue-200",
  smme_finance_access:       "bg-teal-100 text-teal-800 ring-teal-200",
  labour_market_rigidity:    "bg-red-100 text-red-800 ring-red-200",
  human_capital_skills:      "bg-purple-100 text-purple-800 ring-purple-200",
  health_system:             "bg-pink-100 text-pink-800 ring-pink-200",
  trade_competitiveness:     "bg-green-100 text-green-800 ring-green-200",
  industrial_policy:         "bg-lime-100 text-lime-800 ring-lime-200",
  state_capacity_governance: "bg-slate-100 text-slate-700 ring-slate-200",
  fiscal_sustainability:     "bg-indigo-100 text-indigo-800 ring-indigo-200",
  digital_infrastructure:    "bg-cyan-100 text-cyan-800 ring-cyan-200",
  land_spatial_planning:     "bg-yellow-100 text-yellow-800 ring-yellow-200",
  crime_rule_of_law:         "bg-rose-100 text-rose-800 ring-rose-200",
};

const COUNTRY_COLORS: Record<string, string> = {
  Kenya:        "bg-red-50 border-red-200",
  Botswana:     "bg-blue-50 border-blue-200",
  India:        "bg-orange-50 border-orange-200",
  Chile:        "bg-red-50 border-red-200",
  Mauritius:    "bg-indigo-50 border-indigo-200",
  Rwanda:       "bg-blue-50 border-blue-200",
  Vietnam:      "bg-red-50 border-red-200",
  "South Korea":"bg-blue-50 border-blue-200",
};

const comparisons = comparisonsData.comparisons as Comparison[];
const meta = comparisonsData.metadata;

// Get unique constraints and countries
const ALL_CONSTRAINTS = Array.from(
  new Set(comparisons.map((c) => c.binding_constraint))
).sort();

const ALL_COUNTRIES = Array.from(
  new Set(comparisons.map((c) => c.country))
).sort();

// ── Component ─────────────────────────────────────────────────────────────

export default function ComparisonsPage() {
  const [constraintFilter, setConstraintFilter] = useState<string>("");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return comparisons.filter((c) => {
      if (constraintFilter && c.binding_constraint !== constraintFilter) return false;
      if (countryFilter && c.country !== countryFilter) return false;
      return true;
    });
  }, [constraintFilter, countryFilter]);

  // Group by constraint for sectioned view when no filter
  const byConstraint = useMemo(() => {
    const groups: Record<string, Comparison[]> = {};
    filtered.forEach((c) => {
      if (!groups[c.constraint_label]) groups[c.constraint_label] = [];
      groups[c.constraint_label].push(c);
    });
    return groups;
  }, [filtered]);

  const constraintGroups = Object.entries(byConstraint).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">International Comparisons</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          For each binding growth constraint, how have peer economies approached it — and what can South Africa learn?
          Cases are drawn from Kenya, Botswana, India, Chile, Mauritius, Rwanda, Vietnam, and South Korea.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-sa-green">{comparisons.length}</div>
          <div className="text-xs text-gray-500 mt-1">Case Studies</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-sa-green">{ALL_COUNTRIES.length}</div>
          <div className="text-xs text-gray-500 mt-1">Peer Economies</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-sa-green">{ALL_CONSTRAINTS.length}</div>
          <div className="text-xs text-gray-500 mt-1">Constraints Covered</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Filter by Binding Constraint
          </label>
          <select
            value={constraintFilter}
            onChange={(e) => setConstraintFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sa-green/30 min-w-[220px]"
          >
            <option value="">All constraints</option>
            {ALL_CONSTRAINTS.map((c) => {
              const label = comparisons.find((x) => x.binding_constraint === c)?.constraint_label ?? c;
              return (
                <option key={c} value={c}>{label}</option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Filter by Country
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCountryFilter("")}
              className={`px-2.5 py-1 rounded-full text-xs font-medium ring-1 transition-colors ${
                !countryFilter ? "bg-gray-900 text-white ring-gray-900" : "bg-white text-gray-600 ring-gray-200 hover:ring-gray-300"
              }`}
            >
              All
            </button>
            {ALL_COUNTRIES.map((c) => {
              const flag = comparisons.find((x) => x.country === c)?.flag ?? "";
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
                  {flag} {c}
                </button>
              );
            })}
          </div>
        </div>

        {(constraintFilter || countryFilter) && (
          <button
            onClick={() => { setConstraintFilter(""); setCountryFilter(""); }}
            className="text-xs text-sa-green hover:underline self-end pb-1.5"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        Showing {filtered.length} case {filtered.length !== 1 ? "studies" : "study"}
        {constraintFilter || countryFilter ? " (filtered)" : ""}
      </p>

      {/* Case Studies — grouped by constraint */}
      {constraintGroups.length === 0 ? (
        <div className="card text-center py-10 text-gray-400">
          <p>No comparisons match the selected filters.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {constraintGroups.map(([constraintLabel, cases]) => {
            const constraintKey = cases[0].binding_constraint;
            const badgeStyle = CONSTRAINT_COLORS[constraintKey] ?? "bg-gray-100 text-gray-700 ring-gray-200";

            return (
              <div key={constraintLabel}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`badge ring-1 ${badgeStyle}`}>{constraintLabel}</span>
                  <span className="text-xs text-gray-400">{cases.length} case{cases.length !== 1 ? "s" : ""}</span>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cases.map((c) => {
                    const isOpen = expandedId === c.id;
                    const cardBg = COUNTRY_COLORS[c.country] ?? "bg-gray-50 border-gray-200";

                    return (
                      <div
                        key={c.id}
                        className={`rounded-xl border overflow-hidden ${cardBg} ${isOpen ? "shadow-md sm:col-span-2 lg:col-span-3" : "hover:shadow-sm"} transition-all`}
                      >
                        {/* Card header */}
                        <button
                          className="w-full text-left p-4"
                          onClick={() => setExpandedId(isOpen ? null : c.id)}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-2xl">{c.flag}</span>
                                <span className="font-semibold text-gray-900 text-sm">{c.country}</span>
                                <span className="text-xs text-gray-400">{c.period}</span>
                              </div>
                              <h3 className="font-medium text-gray-900 text-sm leading-snug mb-2">
                                {c.title}
                              </h3>
                              <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                                {c.approach}
                              </p>
                            </div>
                            <span className="text-gray-400 text-xs flex-shrink-0 mt-1">
                              {isOpen ? "▲" : "▼"}
                            </span>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-black/5">
                            <div className="flex items-start gap-1.5">
                              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide flex-shrink-0 mt-0.5">GDP Impact:</span>
                              <span className="text-xs text-gray-700">{c.gdp_impact}</span>
                            </div>
                          </div>
                        </button>

                        {/* Expanded detail */}
                        {isOpen && (
                          <div className="border-t border-black/5 bg-white/70 p-5 space-y-5">
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

                              <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Approach</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{c.approach}</p>
                              </div>

                              <div>
                                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Outcome</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{c.outcome}</p>
                                <div className="mt-2 text-xs text-gray-500">
                                  <span className="font-medium">Timeline:</span> {c.timeline}
                                </div>
                              </div>

                              <div>
                                <p className="text-[11px] font-semibold text-sa-green uppercase tracking-wide mb-1.5">
                                  Lessons for South Africa
                                </p>
                                <div className="rounded-lg bg-sa-green/5 border border-sa-green/20 p-3">
                                  <p className="text-sm text-gray-700 leading-relaxed">{c.lessons_for_sa}</p>
                                </div>
                              </div>
                            </div>

                            {/* Sources */}
                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Sources</p>
                              <div className="flex flex-wrap gap-2">
                                {c.sources.map((src, i) => (
                                  <span key={i} className="text-[10px] text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                                    {src}
                                  </span>
                                ))}
                              </div>
                            </div>
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

      {/* Methodology */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500 space-y-1">
        <p className="font-medium text-gray-700">Peer Selection Methodology</p>
        <p>{meta.methodology}</p>
      </div>

    </div>
  );
}
