"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface IdeaOption {
  id: number;
  title: string;
  binding_constraint: string;
  current_status: string;
  reform_package: number | null;
}

const DOC_TYPES = [
  {
    key: "green-paper",
    label: "Green Paper",
    subtitle: "Discussion Document for Public Comment",
    description:
      "A consultative document presenting policy options and inviting public comment. Includes background, policy analysis, international comparisons, economic impact, and questions for stakeholders.",
    color: "#007A4D",
    bg: "#e6f4ed",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    chapters: [
      "Executive Summary",
      "Background & Context",
      "Current Policy Landscape",
      "Policy Options & Analysis",
      "Expected Economic Impact",
      "Questions for Public Comment",
      "Appendix: International Case Studies",
    ],
  },
  {
    key: "white-paper",
    label: "White Paper",
    subtitle: "Definitive Policy Statement",
    description:
      "A formal statement of government policy after consultation. Presents the chosen policy direction, implementation framework, institutional arrangements, financial implications, and M&E plan.",
    color: "#1a1a2e",
    bg: "#f0f0f8",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    chapters: [
      "Foreword",
      "Policy Rationale",
      "Policy Framework",
      "Implementation Strategy",
      "Institutional Arrangements",
      "Financial Implications",
      "Monitoring & Evaluation",
    ],
  },
  {
    key: "bill",
    label: "Template Bill",
    subtitle: "SA Government Gazette Bill Format",
    description:
      "Skeleton legislation in South African Government Gazette format. Includes long title, preamble with WHEREAS clauses, definitions, objects, powers, regulations, and transitional provisions.",
    color: "#8B0000",
    bg: "#fef2f2",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    chapters: [
      "Long Title",
      "Preamble",
      "Definitions",
      "Objects of Act",
      "Establishment & Administration",
      "Powers and Functions",
      "Regulations & Standards",
      "Transitional Provisions",
      "Short Title & Commencement",
    ],
  },
];

export default function DocumentsPage() {
  const [ideas, setIdeas] = useState<IdeaOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data) => {
        setIdeas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = ideas.filter((i) =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );
  const selected = ideas.find((i) => i.id === selectedId);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="flex gap-0.5">
            <span className="w-1.5 h-6 rounded-sm" style={{ backgroundColor: "#007A4D" }} />
            <span className="w-1.5 h-6 rounded-sm" style={{ backgroundColor: "#FFB612" }} />
            <span className="w-1.5 h-6 rounded-sm" style={{ backgroundColor: "#DE3831" }} />
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Policy Document Generator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Generate formal SA government policy documents from any reform idea in the database.
          Select a reform idea below, then choose the document type to generate.
        </p>
      </div>

      {/* Idea selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-bold">1</span>
          Select a Reform Idea
        </h2>

        {loading ? (
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Search reform ideas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A4D]/30 focus:border-[#007A4D]"
            />
            <div className="max-h-56 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-50">
              {filtered.slice(0, 50).map((idea) => (
                <button
                  key={idea.id}
                  onClick={() => { setSelectedId(idea.id); setSearch(""); }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                    selectedId === idea.id ? "bg-[#e6f4ed] text-[#007A4D] font-medium" : "text-gray-700"
                  }`}
                >
                  <span className="font-medium">{idea.title}</span>
                  <span className="ml-2 text-xs text-gray-400">
                    #{idea.id} · {idea.binding_constraint?.replace(/_/g, " ")}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm text-gray-400">No ideas match your search.</p>
              )}
            </div>

            {selected && (
              <div className="flex items-center gap-2 text-sm text-[#007A4D] font-medium mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Selected: {selected.title}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document type cards */}
      <div>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs flex items-center justify-center font-bold">2</span>
          Choose Document Type
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {DOC_TYPES.map((doc) => (
            <div
              key={doc.key}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4"
            >
              {/* Icon + label */}
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: doc.bg, color: doc.color }}
                >
                  {doc.icon}
                </div>
                <div>
                  <div
                    className="text-sm font-semibold uppercase tracking-wide"
                    style={{ color: doc.color }}
                  >
                    {doc.label}
                  </div>
                  <div className="text-xs text-gray-500">{doc.subtitle}</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{doc.description}</p>

              {/* Chapter list */}
              <div className="space-y-1">
                {doc.chapters.map((ch, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                      style={{ backgroundColor: doc.bg, color: doc.color }}
                    >
                      {i + 1}
                    </span>
                    {ch}
                  </div>
                ))}
              </div>

              {/* Generate button */}
              <div className="mt-auto pt-2">
                {selectedId ? (
                  <Link
                    href={`/documents/${doc.key}/${selectedId}`}
                    className="block text-center px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: doc.color }}
                  >
                    Generate {doc.label}
                  </Link>
                ) : (
                  <div
                    className="block text-center px-4 py-2 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed"
                    style={{ backgroundColor: "#f3f4f6" }}
                  >
                    Select an idea first
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
        <strong>Note:</strong> Documents are generated from the reform idea database. Richer ideas
        (with implementation plans and international comparisons) produce more complete documents.
        All documents are formatted for printing — use the &ldquo;Download as PDF&rdquo; button on
        each document page.
      </div>
    </div>
  );
}
