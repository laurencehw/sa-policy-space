"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { ResearchPaper, PolicyIdea, BindingConstraint } from "@/lib/supabase";
import { CONSTRAINT_LABELS, CONSTRAINT_COLORS } from "@/lib/supabase";

// ── Theme → binding constraint mapping ────────────────────────────────────

const THEME_TO_CONSTRAINT: Record<string, BindingConstraint | null> = {
  energy: "energy",
  trade: "trade_openness",
  employment: "labour_market",
  education: "skills_education",
  health: "health_systems",
  infrastructure: "transport_logistics",
  fiscal: "fiscal_space",
  housing: "land_housing",
  regulation: "regulatory_burden",
  growth: null,
  investment: "financial_access",
  monetary: "fiscal_space",
  climate: "climate_environment",
  water: "water",
  digital: "digital_infrastructure",
  crime: "crime_safety",
  corruption: "corruption_governance",
  governance: "government_capacity",
  innovation: "innovation_capacity",
  skills: "skills_education",
  labour: "labour_market",
  transport: "transport_logistics",
  land: "land_housing",
};

function themeToConstraints(theme: string): BindingConstraint[] {
  const lower = theme.toLowerCase().replace(/[_-]/g, "");
  for (const [key, constraint] of Object.entries(THEME_TO_CONSTRAINT)) {
    if (lower.includes(key) && constraint) return [constraint];
  }
  return [];
}

const PAPER_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  working_paper: { label: "Working Paper", color: "bg-blue-100 text-blue-800 ring-blue-200" },
  policy_brief: { label: "Policy Brief", color: "bg-green-100 text-green-800 ring-green-200" },
  conference_report: { label: "Conference Report", color: "bg-purple-100 text-purple-800 ring-purple-200" },
  synthesis: { label: "Synthesis", color: "bg-amber-100 text-amber-800 ring-amber-200" },
};

const THEME_COLORS = [
  "bg-blue-100 text-blue-700", "bg-green-100 text-green-700", "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700", "bg-red-100 text-red-700", "bg-teal-100 text-teal-700",
  "bg-indigo-100 text-indigo-700", "bg-pink-100 text-pink-700", "bg-cyan-100 text-cyan-700",
  "bg-orange-100 text-orange-700", "bg-lime-100 text-lime-700", "bg-sky-100 text-sky-700",
];

// ── Component ─────────────────────────────────────────────────────────────

interface Props {
  initialPapers: ResearchPaper[];
  policyIdeas: Pick<PolicyIdea, "id" | "title" | "slug" | "binding_constraint" | "current_status">[];
}

export default function ResearchClient({ initialPapers, policyIdeas }: Props) {
  const [search, setSearch] = useState("");
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // ── Derived data ────────────────────────────────────────────────────────

  const allThemes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of initialPapers) {
      for (const t of p.themes ?? []) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return Array.from(counts, ([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count);
  }, [initialPapers]);

  const filteredPapers = useMemo(() => {
    let papers = initialPapers;
    if (search) {
      const q = search.toLowerCase();
      papers = papers.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.authors ?? "").toLowerCase().includes(q) ||
          (p.abstract ?? "").toLowerCase().includes(q)
      );
    }
    if (selectedThemes.length > 0) {
      papers = papers.filter((p) =>
        selectedThemes.some((t) => (p.themes ?? []).includes(t))
      );
    }
    return papers;
  }, [initialPapers, search, selectedThemes]);

  const themeChartData = useMemo(() => {
    return allThemes.slice(0, 15).map((t, i) => ({
      theme: t.theme.replace(/_/g, " "),
      count: t.count,
      fill: ["#007A4D", "#FFB612", "#2563eb", "#dc2626", "#7c3aed", "#ea580c", "#0891b2", "#059669", "#d946ef", "#f59e0b", "#6366f1", "#14b8a6", "#e11d48", "#64748b", "#0d9488"][i % 15],
    }));
  }, [allThemes]);

  function getRelatedIdeas(paper: ResearchPaper) {
    const constraints = new Set<BindingConstraint>();
    for (const t of paper.themes ?? []) {
      for (const c of themeToConstraints(t)) constraints.add(c);
    }
    if (constraints.size === 0) return [];
    return policyIdeas.filter((idea) => constraints.has(idea.binding_constraint));
  }

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((t) => t !== theme) : [...prev, theme]
    );
  };

  if (initialPapers.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium">No research papers available</p>
        <p className="text-sm mt-1">Papers will appear here once loaded from the database.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Research & Evidence Base</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Academic and policy research papers mapped to South African reform themes.
          {initialPapers.length} papers covering {allThemes.length} themes.
        </p>
      </div>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search papers by title, author, or abstract..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-96 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-sa-green focus:border-sa-green"
        />
      </div>

      {/* Theme filter pills */}
      <div className="flex flex-wrap gap-2">
        {allThemes.map((t, i) => {
          const isActive = selectedThemes.includes(t.theme);
          return (
            <button
              key={t.theme}
              onClick={() => toggleTheme(t.theme)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ring-1 ring-inset ${
                isActive
                  ? "bg-sa-green text-white ring-sa-green"
                  : `${THEME_COLORS[i % THEME_COLORS.length]} ring-gray-200 hover:ring-gray-300`
              }`}
            >
              {t.theme.replace(/_/g, " ")}
              <span className={`text-[10px] ${isActive ? "text-white/80" : "opacity-60"}`}>({t.count})</span>
            </button>
          );
        })}
        {selectedThemes.length > 0 && (
          <button
            onClick={() => setSelectedThemes([])}
            className="text-xs text-gray-500 hover:text-gray-700 underline ml-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        Showing {filteredPapers.length} of {initialPapers.length} papers
      </p>

      {/* Paper cards */}
      <div className="space-y-4">
        {filteredPapers.map((paper) => {
          const isExpanded = expandedId === paper.id;
          const ptCfg = PAPER_TYPE_LABELS[paper.paper_type] ?? { label: paper.paper_type, color: "bg-gray-100 text-gray-700 ring-gray-200" };
          const related = isExpanded ? getRelatedIdeas(paper) : [];

          return (
            <div key={paper.id} className="card p-0 overflow-hidden">
              <div className="p-5">
                {/* Title & meta */}
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <h3 className="text-base font-semibold text-gray-900 flex-1 min-w-0">
                    {paper.url ? (
                      <a href={paper.url} target="_blank" rel="noopener noreferrer" className="hover:text-sa-green">
                        {paper.title}
                      </a>
                    ) : (
                      paper.title
                    )}
                  </h3>
                  <span className={`badge ring-1 text-[10px] flex-shrink-0 ${ptCfg.color}`}>
                    {ptCfg.label}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
                  {paper.authors && <span>{paper.authors}</span>}
                  {paper.publication_date && (
                    <span>{new Date(paper.publication_date).toLocaleDateString("en-ZA", { year: "numeric", month: "short" })}</span>
                  )}
                  <span>{paper.source_org}</span>
                </div>

                {/* Theme badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {(paper.themes ?? []).map((theme, i) => (
                    <span
                      key={theme}
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${THEME_COLORS[i % THEME_COLORS.length]}`}
                    >
                      {theme.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>

                {/* Abstract preview */}
                {paper.abstract && (
                  <p className={`text-xs text-gray-600 leading-relaxed ${isExpanded ? "" : "line-clamp-3"}`}>
                    {paper.abstract}
                  </p>
                )}

                {/* Expand/collapse */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : paper.id)}
                  className="text-xs text-sa-green hover:underline mt-2 font-medium"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                  {/* Links */}
                  <div className="flex gap-3">
                    {paper.url && (
                      <a
                        href={paper.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sa-green hover:underline font-medium"
                      >
                        View Paper
                      </a>
                    )}
                    {paper.pdf_url && (
                      <a
                        href={paper.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sa-green hover:underline font-medium"
                      >
                        Download PDF
                      </a>
                    )}
                  </div>

                  {/* Related policy ideas */}
                  {related.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">
                        Related Policy Ideas ({related.length})
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {related.slice(0, 6).map((idea) => (
                          <Link
                            key={idea.id}
                            href={`/ideas/${idea.slug || idea.id}`}
                            className="block p-2 rounded-lg border border-gray-200 bg-white hover:border-sa-green/30 transition-colors"
                          >
                            <div className="text-xs font-medium text-gray-900 line-clamp-2">{idea.title}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`inline-block rounded-full px-1.5 py-0.5 text-[9px] font-medium ${CONSTRAINT_COLORS[idea.binding_constraint] ?? "bg-gray-100 text-gray-600"}`}>
                                {CONSTRAINT_LABELS[idea.binding_constraint] ?? idea.binding_constraint}
                              </span>
                              <span className="text-[10px] text-gray-400 capitalize">
                                {(idea.current_status ?? "").replace(/_/g, " ")}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      {related.length > 6 && (
                        <p className="text-[10px] text-gray-400 mt-1">+ {related.length - 6} more ideas</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Evidence strength chart */}
      {themeChartData.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Evidence Coverage by Theme</h3>
          <div style={{ width: "100%", height: Math.max(themeChartData.length * 32, 150) }}>
            <ResponsiveContainer>
              <BarChart data={themeChartData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="theme" width={120} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" name="Papers" radius={[0, 4, 4, 0]}>
                  {themeChartData.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Source note */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700 mb-1">About This Data</p>
        <p>
          Research papers sourced from ERSA (Economic Research Southern Africa) conference reports and working papers.
          Theme-to-policy mapping connects paper themes to binding constraints tracked in the policy ideas database.
        </p>
      </div>
    </div>
  );
}
