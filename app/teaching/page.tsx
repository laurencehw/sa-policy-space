"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import textbookChapters from "@/data/textbook_chapters.json";

interface PolicyIdea {
  id: number;
  title: string;
  binding_constraint: string;
  current_status: string;
  growth_impact_rating: number;
  feasibility_rating: number;
  reform_package: number | null;
  theme: string;
  slug: string;
}

interface Chapter {
  id: number;
  number: number;
  title: string;
  description: string;
  binding_constraints: string[];
  reform_packages: number[];
  seminar_questions: string[];
}

const STATUS_COLORS: Record<string, string> = {
  implemented: "bg-green-100 text-green-800",
  partially_implemented: "bg-teal-100 text-teal-800",
  under_review: "bg-blue-100 text-blue-800",
  drafted: "bg-indigo-100 text-indigo-800",
  debated: "bg-purple-100 text-purple-800",
  proposed: "bg-gray-100 text-gray-700",
  stalled: "bg-red-100 text-red-700",
  abandoned: "bg-gray-100 text-gray-500",
};

const STATUS_LABELS: Record<string, string> = {
  implemented: "Implemented",
  partially_implemented: "Partial",
  under_review: "Under Review",
  drafted: "Drafted",
  debated: "Debated",
  proposed: "Proposed",
  stalled: "Stalled",
  abandoned: "Abandoned",
};

const CONSTRAINT_LABELS: Record<string, string> = {
  energy: "Energy",
  logistics: "Logistics",
  skills: "Skills",
  regulation: "Regulation",
  crime: "Crime",
  labor_market: "Labour Market",
  land: "Land",
  digital: "Digital",
  government_capacity: "Gov. Capacity",
  corruption: "Corruption",
};

function RatingDots({ value, max = 5 }: { value: number | null; max?: number }) {
  if (!value) return <span className="text-gray-300 text-xs">—</span>;
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${
            i < value ? "bg-sa-green" : "bg-gray-200"
          }`}
        />
      ))}
    </span>
  );
}

export default function TeachingPage() {
  const [ideas, setIdeas] = useState<PolicyIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data) => {
        setIdeas(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Match ideas to each chapter
  const chaptersWithIdeas = useMemo(() => {
    return (textbookChapters as Chapter[]).map((chapter) => {
      const linked = ideas
        .filter(
          (idea) =>
            chapter.binding_constraints.includes(idea.binding_constraint) ||
            (idea.reform_package !== null &&
              chapter.reform_packages.includes(idea.reform_package))
        )
        .sort((a, b) => (b.growth_impact_rating ?? 0) - (a.growth_impact_rating ?? 0))
        .slice(0, 8);
      return { ...chapter, linked_ideas: linked };
    });
  }, [ideas]);

  function toggleChapter(id: number) {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleQuestions(id: number) {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Teaching Resources</h1>
        <p className="text-gray-500 text-sm mt-1">
          Policy ideas mapped to chapters of{" "}
          <em>The South African Economy: A Contemporary Textbook</em>
        </p>
      </div>

      {/* Intro card */}
      <div className="rounded-xl border border-sa-green/20 bg-sa-green/5 p-5">
        <p className="text-sm text-gray-700 leading-relaxed">
          Each chapter below is linked to relevant policy ideas from parliamentary committee
          proceedings — giving students and instructors live case material that connects
          textbook theory to current reform debates. Expand a chapter to see linked ideas and
          seminar discussion questions.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Ideas are matched by binding constraint and reform package. Impact ratings are on a
          1–5 scale.
        </p>
      </div>

      {/* Chapter cards */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {chaptersWithIdeas.map((chapter) => {
            const isExpanded = expandedChapters.has(chapter.id);
            const showQ = expandedQuestions.has(chapter.id);

            return (
              <div
                key={chapter.id}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                {/* Chapter header — always visible */}
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-sa-green/10 text-sa-green text-sm font-bold flex items-center justify-center">
                    {chapter.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="font-semibold text-gray-900 text-sm">
                        {chapter.title}
                      </h2>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400">
                          {chapter.linked_ideas.length} idea
                          {chapter.linked_ideas.length !== 1 ? "s" : ""}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {chapter.description}
                    </p>
                    {/* Constraint tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {chapter.binding_constraints.slice(0, 5).map((c) => (
                        <span
                          key={c}
                          className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                        >
                          {CONSTRAINT_LABELS[c] ?? c}
                        </span>
                      ))}
                      {chapter.binding_constraints.length > 5 && (
                        <span className="text-xs text-gray-400">
                          +{chapter.binding_constraints.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                    {/* Linked policy ideas */}
                    {chapter.linked_ideas.length > 0 ? (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Linked Policy Ideas
                        </h3>
                        <div className="space-y-2">
                          {chapter.linked_ideas.map((idea) => (
                            <Link
                              key={idea.id}
                              href={`/ideas/${idea.slug || idea.id}`}
                              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-100 hover:border-sa-green/30 hover:bg-sa-green/5 transition-colors group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-900 font-medium truncate group-hover:text-sa-green transition-colors">
                                  {idea.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                  {CONSTRAINT_LABELS[idea.binding_constraint] ??
                                    idea.binding_constraint}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    STATUS_COLORS[idea.current_status] ??
                                    "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {STATUS_LABELS[idea.current_status] ?? idea.current_status}
                                </span>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-400">Impact</span>
                                  <RatingDots value={idea.growth_impact_rating} />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No directly linked ideas for this chapter yet.
                      </p>
                    )}

                    {/* Seminar questions */}
                    <div>
                      <button
                        onClick={() => toggleQuestions(chapter.id)}
                        className="flex items-center gap-2 text-xs font-semibold text-sa-green hover:text-sa-green/80 transition-colors"
                      >
                        <svg
                          className={`w-3.5 h-3.5 transition-transform ${
                            showQ ? "rotate-90" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                        {showQ ? "Hide" : "Show"} seminar discussion questions (
                        {chapter.seminar_questions.length})
                      </button>

                      {showQ && (
                        <ol className="mt-3 space-y-2 list-decimal list-inside">
                          {chapter.seminar_questions.map((q, i) => (
                            <li key={i} className="text-sm text-gray-700 leading-relaxed">
                              {q}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer note */}
      <div className="text-xs text-gray-400 border-t border-gray-100 pt-4">
        Policy ideas sourced from parliamentary committee proceedings via{" "}
        <a
          href="https://pmg.org.za"
          className="underline hover:text-gray-600"
          target="_blank"
          rel="noopener noreferrer"
        >
          PMG
        </a>
        . Textbook chapter structure based on{" "}
        <em>The South African Economy: A Contemporary Textbook</em>.
      </div>
    </div>
  );
}
