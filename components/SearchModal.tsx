"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

interface SearchIdea {
  id: number;
  title: string;
  description: string;
  slug: string;
  binding_constraint: string;
}
interface SearchPackage {
  id: number;
  name: string;
  tagline: string;
}
interface SearchStakeholder {
  id: string;
  name: string;
  category: string;
  primary_interests: string;
}
interface SearchComparison {
  id: string;
  title: string;
  country: string;
  flag: string;
  constraint_label: string;
}
interface SearchChapter {
  id: number;
  number: number;
  title: string;
}

interface SearchResults {
  ideas: SearchIdea[];
  packages: SearchPackage[];
  stakeholders: SearchStakeholder[];
  comparisons: SearchComparison[];
  chapters: SearchChapter[];
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Focus input when opened; reset when closed
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults(null);
    }
  }, [open]);

  const search = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data);
      } catch {
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    search(val);
  }

  const totalResults = results
    ? results.ideas.length +
      results.packages.length +
      results.stakeholders.length +
      results.comparisons.length +
      results.chapters.length
    : 0;

  return (
    <>
      {/* Trigger button — shown in header */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        aria-label="Search (Ctrl+K)"
      >
        <svg
          className="w-4 h-4"
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
        <span className="hidden sm:inline text-xs">Search</span>
        <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-400 font-mono leading-none">
          ⌘K
        </kbd>
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-[15vh] px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
            {/* Search input row */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <svg
                className="w-4 h-4 text-gray-400 flex-shrink-0"
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
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search ideas, packages, stakeholders…"
                className="flex-1 text-sm outline-none bg-transparent text-gray-900 placeholder-gray-400"
              />
              {loading && (
                <div className="w-3 h-3 border-2 border-gray-200 border-t-sa-green rounded-full animate-spin flex-shrink-0" />
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-[10px] text-gray-400 hover:text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 font-mono"
              >
                Esc
              </button>
            </div>

            {/* Results pane */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.trim().length < 2 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">
                  Type at least 2 characters to search across ideas, packages,
                  stakeholders, and more
                </div>
              ) : results && totalResults === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-gray-400">
                  No results for{" "}
                  <span className="font-medium text-gray-600">
                    &ldquo;{query}&rdquo;
                  </span>
                </div>
              ) : results ? (
                <div className="py-2">
                  {results.ideas.length > 0 && (
                    <ResultSection title="Ideas" count={results.ideas.length}>
                      {results.ideas.map((item) => (
                        <ResultLink
                          key={item.id}
                          href={`/ideas/${item.slug}`}
                          onClick={() => setOpen(false)}
                          title={item.title}
                          subtitle={item.binding_constraint?.replace(/_/g, " ")}
                          icon="💡"
                        />
                      ))}
                    </ResultSection>
                  )}

                  {results.packages.length > 0 && (
                    <ResultSection
                      title="Reform Packages"
                      count={results.packages.length}
                    >
                      {results.packages.map((item) => (
                        <ResultLink
                          key={item.id}
                          href={`/packages/${item.id}`}
                          onClick={() => setOpen(false)}
                          title={item.name}
                          subtitle={item.tagline}
                          icon="📦"
                        />
                      ))}
                    </ResultSection>
                  )}

                  {results.stakeholders.length > 0 && (
                    <ResultSection
                      title="Stakeholders"
                      count={results.stakeholders.length}
                    >
                      {results.stakeholders.map((item) => (
                        <ResultLink
                          key={item.id}
                          href="/stakeholders"
                          onClick={() => setOpen(false)}
                          title={item.name}
                          subtitle={`${item.category} · ${item.primary_interests?.slice(0, 70)}`}
                          icon="👥"
                        />
                      ))}
                    </ResultSection>
                  )}

                  {results.comparisons.length > 0 && (
                    <ResultSection
                      title="International Comparisons"
                      count={results.comparisons.length}
                    >
                      {results.comparisons.map((item) => (
                        <ResultLink
                          key={item.id}
                          href="/comparisons"
                          onClick={() => setOpen(false)}
                          title={`${item.flag} ${item.title}`}
                          subtitle={`${item.country} · ${item.constraint_label}`}
                          icon="🌍"
                        />
                      ))}
                    </ResultSection>
                  )}

                  {results.chapters.length > 0 && (
                    <ResultSection
                      title="Textbook Chapters"
                      count={results.chapters.length}
                    >
                      {results.chapters.map((item) => (
                        <ResultLink
                          key={item.id}
                          href="/teaching"
                          onClick={() => setOpen(false)}
                          title={`Ch. ${item.number}: ${item.title}`}
                          subtitle="Teaching Resources"
                          icon="📚"
                        />
                      ))}
                    </ResultSection>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ResultSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="px-4 py-1.5 flex items-center gap-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
          {title}
        </span>
        <span className="text-[10px] text-gray-300">{count}</span>
      </div>
      {children}
    </div>
  );
}

function ResultLink({
  href,
  onClick,
  title,
  subtitle,
  icon,
}: {
  href: string;
  onClick: () => void;
  title: string;
  subtitle?: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors group"
    >
      <span className="text-base flex-shrink-0 leading-none">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 font-medium truncate group-hover:text-sa-green transition-colors">
          {title}
        </p>
        {subtitle && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{subtitle}</p>
        )}
      </div>
      <svg
        className="w-3 h-3 text-gray-300 flex-shrink-0 group-hover:text-sa-green transition-colors"
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
    </Link>
  );
}
