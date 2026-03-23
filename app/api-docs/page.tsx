"use client";

import { useState } from "react";
import Link from "next/link";

interface Endpoint {
  method: "GET";
  path: string;
  description: string;
  params?: { name: string; type: string; description: string; required?: boolean }[];
  example_response: string;
  curl: string;
}

const BASE_URL = "https://sa-policy-space.vercel.app";

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/api/v1/ideas",
    description:
      "List policy ideas with optional filtering and sorting. Returns a paginated array of idea objects.",
    params: [
      { name: "search", type: "string", description: "Full-text search across title and description" },
      {
        name: "constraint",
        type: "string",
        description:
          "Filter by binding constraint: energy | logistics | skills | regulation | crime | labor_market | land | digital | government_capacity | corruption",
      },
      {
        name: "status",
        type: "string",
        description:
          "Filter by status: proposed | debated | drafted | stalled | implemented | partially_implemented | under_review | abandoned",
      },
      {
        name: "package",
        type: "integer",
        description: "Filter by reform package ID (1–5)",
      },
      {
        name: "timeHorizon",
        type: "string",
        description: "Filter by time horizon: quick_win | medium_term | long_term",
      },
      {
        name: "sort",
        type: "string",
        description: "Sort order: impact (default) | feasibility | recent",
      },
    ],
    example_response: JSON.stringify(
      {
        version: "1",
        data: [
          {
            id: 42,
            title: "Electricity Regulation Amendment Act — Competitive Electricity Market",
            binding_constraint: "energy",
            current_status: "implemented",
            growth_impact_rating: 5,
            feasibility_rating: 4,
            reform_package: 1,
            time_horizon: "medium_term",
            source_committee: "Mineral Resources and Energy",
            slug: "electricity-regulation-amendment-act",
          },
        ],
        meta: { count: 123 },
      },
      null,
      2
    ),
    curl: `curl "${BASE_URL}/api/v1/ideas?constraint=energy&status=implemented"`,
  },
  {
    method: "GET",
    path: "/api/v1/ideas/:id",
    description:
      "Retrieve a single policy idea by numeric ID or slug. Includes implementation plan steps if available.",
    params: [
      { name: "id", type: "string", description: "Numeric ID or URL slug", required: true },
    ],
    example_response: JSON.stringify(
      {
        version: "1",
        data: {
          id: 42,
          title: "Electricity Regulation Amendment Act — Competitive Electricity Market",
          description: "Amend the Electricity Regulation Act to create a competitive...",
          binding_constraint: "energy",
          current_status: "implemented",
          growth_impact_rating: 5,
          feasibility_rating: 4,
          reform_package: 1,
          first_raised: "2022-03-14",
          last_discussed: "2024-11-08",
          dormant: 0,
        },
      },
      null,
      2
    ),
    curl: `curl "${BASE_URL}/api/v1/ideas/42"`,
  },
  {
    method: "GET",
    path: "/api/v1/packages",
    description:
      "List all five reform packages with summary statistics, time horizon breakdowns, and top priority ideas.",
    params: [],
    example_response: JSON.stringify(
      {
        version: "1",
        data: [
          {
            package_id: 1,
            name: "Infrastructure Unblock",
            tagline: "Remove physical bottlenecks that constrain all economic activity",
            idea_count: 29,
            avg_growth_impact: 3.97,
            avg_feasibility: 3.15,
            implemented_or_partial_count: 11,
            stalled_or_proposed_count: 11,
            horizon_counts: { quick_win: 6, medium_term: 18, long_term: 5 },
          },
        ],
        meta: { count: 5 },
      },
      null,
      2
    ),
    curl: `curl "${BASE_URL}/api/v1/packages"`,
  },
  {
    method: "GET",
    path: "/api/v1/stats",
    description:
      "High-level dashboard statistics: total ideas tracked, meetings analysed, constraints covered, and dormant ideas.",
    params: [],
    example_response: JSON.stringify(
      {
        version: "1",
        data: {
          totalIdeas: 123,
          meetingsAnalyzed: 87,
          constraintsCovered: 10,
          dormantIdeas: 14,
        },
      },
      null,
      2
    ),
    curl: `curl "${BASE_URL}/api/v1/stats"`,
  },
];

const LEGACY_ENDPOINTS = [
  { path: "/api/ideas", description: "Ideas — unversioned (stable, no breaking changes planned)" },
  { path: "/api/packages", description: "Packages — unversioned" },
  { path: "/api/stats", description: "Stats — unversioned" },
  { path: "/api/themes", description: "Constraint summaries — unversioned" },
  { path: "/api/dependency-graph", description: "D3 dependency graph data" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="flex items-center gap-1 px-2 py-1 rounded text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-sa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function ApiDocsPage() {
  const [openEndpoints, setOpenEndpoints] = useState<Set<number>>(
    new Set([0]) // first endpoint open by default
  );

  function toggle(i: number) {
    setOpenEndpoints((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
        <p className="text-gray-500 text-sm mt-1">
          Public read-only API for SA Policy Space data
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-3 text-sm text-gray-700">
        <p className="leading-relaxed">
          SA Policy Space exposes a JSON API for researchers, developers, and policy tools.
          All endpoints are read-only and publicly accessible — no API key required.
          The versioned <code className="font-mono bg-gray-100 px-1 rounded">/api/v1/</code>{" "}
          endpoints carry a stability guarantee; the unversioned endpoints are stable but
          unversioned.
        </p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>No authentication required</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>JSON responses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span>Rate limiting planned for future versions</span>
          </div>
        </div>
      </section>

      {/* Base URL */}
      <section className="space-y-2">
        <h2 className="font-semibold text-gray-900">Base URL</h2>
        <div className="flex items-center justify-between bg-gray-900 text-gray-100 rounded-lg px-4 py-2.5">
          <code className="font-mono text-sm text-green-400">{BASE_URL}</code>
          <CopyButton text={BASE_URL} />
        </div>
      </section>

      {/* Versioned endpoints */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Versioned Endpoints (v1)</h2>
        <p className="text-sm text-gray-500">
          These endpoints follow semver-style versioning. Breaking changes will increment the
          version prefix.
        </p>

        <div className="space-y-2">
          {ENDPOINTS.map((ep, i) => {
            const isOpen = openEndpoints.has(i);
            return (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono font-bold bg-sa-green/10 text-sa-green">
                    {ep.method}
                  </span>
                  <code className="flex-1 font-mono text-sm text-gray-800">{ep.path}</code>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-4">
                    <p className="text-sm text-gray-700">{ep.description}</p>

                    {/* Parameters */}
                    {ep.params && ep.params.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Query Parameters
                        </h4>
                        <div className="space-y-2">
                          {ep.params.map((p) => (
                            <div key={p.name} className="flex gap-3 text-sm">
                              <code className="flex-shrink-0 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded h-fit mt-0.5">
                                {p.name}
                              </code>
                              <div>
                                <span className="text-xs text-gray-400 mr-2">{p.type}</span>
                                {p.required && (
                                  <span className="text-xs text-red-500 mr-2">required</span>
                                )}
                                <span className="text-gray-600">{p.description}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* cURL */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Example Request
                      </h4>
                      <div className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-2">
                        <code className="font-mono text-xs text-green-300 break-all">
                          {ep.curl}
                        </code>
                        <CopyButton text={ep.curl} />
                      </div>
                    </div>

                    {/* Example response */}
                    <div>
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Example Response
                      </h4>
                      <div className="relative">
                        <pre className="bg-gray-950 text-gray-100 rounded-lg px-4 py-3 text-xs font-mono overflow-x-auto leading-relaxed max-h-64 overflow-y-auto">
                          {ep.example_response}
                        </pre>
                        <div className="absolute top-2 right-2">
                          <CopyButton text={ep.curl} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Legacy/unversioned endpoints */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Unversioned Endpoints</h2>
        <p className="text-sm text-gray-500">
          Stable but without formal versioning guarantees. Used by the SA Policy Space
          application itself.
        </p>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          {LEGACY_ENDPOINTS.map((ep, i) => (
            <div
              key={ep.path}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                i < LEGACY_ENDPOINTS.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-mono font-bold bg-gray-100 text-gray-600">
                GET
              </span>
              <code className="font-mono text-gray-800 w-52 flex-shrink-0">{ep.path}</code>
              <span className="text-gray-500 text-xs">{ep.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Rate limits & future */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Rate Limits & API Keys</h2>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <p>
            <strong>Currently:</strong> No rate limits. The API is open and free for
            research use.
          </p>
          <p className="mt-1">
            <strong>Planned:</strong> API key authentication and per-key rate limits will
            be introduced in a future version to support higher-traffic use cases. Keys will
            be issued free of charge for academic and policy research.
          </p>
        </div>
      </section>

      {/* Data freshness */}
      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Data & Attribution</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Policy idea data is synthesised from South African parliamentary committee
          proceedings sourced via the{" "}
          <a
            href="https://pmg.org.za"
            className="text-sa-green underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Parliamentary Monitoring Group (PMG)
          </a>
          . Ideas represent original editorial synthesis — not PMG verbatim text. If you
          use this data in research or publications, please cite SA Policy Space and PMG as
          the original source of meeting records.
        </p>
      </section>

      <div className="pt-4 border-t border-gray-200 flex gap-3">
        <Link href="/ideas" className="btn-primary inline-block text-sm">
          Browse Ideas
        </Link>
        <Link href="/about" className="btn-secondary inline-block text-sm">
          About the Project
        </Link>
      </div>
    </div>
  );
}
