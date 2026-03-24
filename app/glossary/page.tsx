"use client";

import { useState, useMemo } from "react";
import glossaryData from "@/data/glossary.json";

interface TranslationEntry {
  text: string;
  note?: string;
}

interface GlossaryTerm {
  id: string;
  term: string;
  fullTerm?: string;
  category: string;
  definition: string;
  translations: {
    af: TranslationEntry;
    zu: TranslationEntry;
    xh: TranslationEntry;
  };
}

const LANGUAGES = [
  { code: "af", label: "Afrikaans" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
] as const;

type LangCode = (typeof LANGUAGES)[number]["code"];

const CATEGORY_STYLES: Record<string, { label: string; color: string }> = {
  economic: {
    label: "Economic",
    color: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
  policy: {
    label: "Policy",
    color: "bg-purple-50 text-purple-700 ring-purple-600/20",
  },
  "sa-specific": {
    label: "SA-Specific",
    color: "bg-sa-green/10 text-sa-green ring-sa-green/20",
  },
};

const ALL_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const terms = glossaryData as GlossaryTerm[];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeLangs, setActiveLangs] = useState<LangCode[]>(["af"]);
  const [alphaFilter, setAlphaFilter] = useState<string | null>(null);

  const usedLetters = useMemo(
    () => new Set(terms.map((t) => t.term[0].toUpperCase())),
    []
  );

  const filtered = useMemo(() => {
    let result = terms;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.term.toLowerCase().includes(q) ||
          t.fullTerm?.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q)
      );
    }
    if (alphaFilter) {
      result = result.filter((t) =>
        t.term.toUpperCase().startsWith(alphaFilter)
      );
    }
    return [...result].sort((a, b) => a.term.localeCompare(b.term));
  }, [search, alphaFilter]);

  const toggleLang = (code: LangCode) => {
    setActiveLangs((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex gap-0.5">
            <span className="w-1 h-5 bg-sa-green rounded-sm" />
            <span className="w-1 h-5 bg-sa-gold rounded-sm" />
            <span className="w-1 h-5 bg-sa-red rounded-sm" />
          </span>
          <h1 className="text-2xl font-bold text-gray-900">Policy Glossary</h1>
        </div>
        <p className="text-gray-600 max-w-2xl">
          Key economic and policy terms translated into South Africa&apos;s
          official languages. South Africa has 11 official languages; this
          glossary covers Afrikaans, isiZulu, and isiXhosa alongside English
          definitions. Many technical economic terms are widely used in English
          across all communities.
        </p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            {terms.filter((t) => t.category === "economic").length} Economic
            terms
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            {terms.filter((t) => t.category === "policy").length} Policy terms
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sa-green" />
            {terms.filter((t) => t.category === "sa-specific").length}{" "}
            SA-specific terms
          </span>
        </div>
      </div>

      {/* Sticky controls */}
      <div className="sticky top-14 bg-white/95 backdrop-blur-sm z-10 py-4 border-b border-gray-100 mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {/* Search */}
        <div className="relative mb-3">
          <input
            type="search"
            placeholder="Search terms or definitions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sa-green/30 focus:border-sa-green bg-white"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Language toggles */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500">
            Show translations:
          </span>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => toggleLang(lang.code)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                activeLangs.includes(lang.code)
                  ? "bg-sa-green text-white border-sa-green"
                  : "bg-white text-gray-600 border-gray-200 hover:border-sa-green/50 hover:text-sa-green"
              }`}
            >
              {lang.label}
            </button>
          ))}
          {activeLangs.length > 0 && (
            <button
              onClick={() => setActiveLangs([])}
              className="px-3 py-1 rounded-full text-xs text-gray-400 border border-gray-100 hover:text-gray-600 transition-colors"
            >
              Hide all
            </button>
          )}
        </div>
      </div>

      {/* Alphabetical index */}
      <div className="flex flex-wrap gap-0.5 mb-5">
        <button
          onClick={() => setAlphaFilter(null)}
          className={`px-2 h-7 text-xs font-medium rounded transition-colors ${
            alphaFilter === null
              ? "bg-sa-green text-white"
              : "text-gray-500 hover:bg-sa-green/10 hover:text-sa-green"
          }`}
        >
          All
        </button>
        {ALL_LETTERS.map((letter) => (
          <button
            key={letter}
            onClick={() =>
              setAlphaFilter(alphaFilter === letter ? null : letter)
            }
            disabled={!usedLetters.has(letter)}
            className={`w-7 h-7 text-xs font-medium rounded transition-colors ${
              alphaFilter === letter
                ? "bg-sa-green text-white"
                : usedLetters.has(letter)
                  ? "text-gray-600 hover:bg-sa-green/10 hover:text-sa-green"
                  : "text-gray-200 cursor-default"
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-4">
        {filtered.length} term{filtered.length !== 1 ? "s" : ""}
        {(search || alphaFilter) && " matched"}
      </p>

      {/* Terms grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg mb-1">No terms found</p>
          <p className="text-sm">Try a different search term or clear the filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((term) => (
            <TermCard key={term.id} term={term} activeLangs={activeLangs} />
          ))}
        </div>
      )}

      {/* Footer note */}
      <div className="mt-12 pt-6 border-t border-gray-100 text-xs text-gray-400 max-w-2xl">
        <p>
          Translations marked &ldquo;commonly used in English&rdquo; reflect
          that the English term is the standard usage across South African
          languages, including in official documents and media. Many technical
          economic and policy terms have been borrowed directly into Nguni and
          Sotho languages without adaptation.
        </p>
      </div>
    </div>
  );
}

function TermCard({
  term,
  activeLangs,
}: {
  term: GlossaryTerm;
  activeLangs: LangCode[];
}) {
  const catStyle =
    CATEGORY_STYLES[term.category] ?? CATEGORY_STYLES["policy"];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm flex flex-col gap-2 hover:border-gray-200 transition-colors">
      {/* Term header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="font-semibold text-gray-900 leading-snug">
            {term.term}
          </h2>
          {term.fullTerm && (
            <p className="text-xs text-gray-500 mt-0.5 leading-snug">
              {term.fullTerm}
            </p>
          )}
        </div>
        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full ring-1 ring-inset font-medium ${catStyle.color}`}
        >
          {catStyle.label}
        </span>
      </div>

      {/* Definition */}
      <p className="text-sm text-gray-600 leading-relaxed flex-1">
        {term.definition}
      </p>

      {/* Translations */}
      {activeLangs.length > 0 && (
        <div className="pt-2 mt-auto border-t border-gray-50 space-y-1.5">
          {activeLangs.map((code) => {
            const lang = LANGUAGES.find((l) => l.code === code)!;
            const t = term.translations[code];
            return (
              <div key={code} className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-gray-400 w-16 shrink-0">
                  {lang.label}
                </span>
                <span className="text-xs text-gray-700">{t.text}</span>
                {t.note && (
                  <span className="text-xs text-gray-400 italic">
                    ({t.note})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
