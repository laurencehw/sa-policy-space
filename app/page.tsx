export const revalidate = 3600;

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SA Policy Space — South African Reform Database",
  description:
    "Mapping South Africa's path to reform: a comprehensive database of policy ideas from parliamentary committee deliberations, assessed for growth impact and tracked for accountability.",
};
import fs from "fs";
import path from "path";
import { computeReformIndex } from "@/lib/reform-index";
import { computeNetworkCentrality } from "@/lib/analytics";
import type { DependencyGraph } from "@/lib/analytics";
import BudgetGapChart from "@/components/BudgetGapChart";

// ── Data ────────────────────────────────────────────────────────────────────

async function getHomepageData() {
  let stats = { totalIdeas: 0, meetingsAnalyzed: 0, constraintsCovered: 0, dormantIdeas: 0 };
  try {
    const api = await import("@/lib/api");
    stats = await api.getStats();
  } catch (e) {
    console.error("[home] getStats failed (build-time?):", e);
  }

  // Dynamic counts from JSON seed files
  let packageCount = 5;
  let stakeholderCount = 38;
  try {
    const pkgPath = path.resolve(process.cwd(), "data", "reform_packages.json");
    const pkgData = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
    packageCount = Object.keys(pkgData).length;
  } catch (e) { console.error("[home] reform_packages.json read failed:", e); }
  try {
    const stakeholderPath = path.resolve(process.cwd(), "data", "stakeholders.json");
    const stakeholderData = JSON.parse(fs.readFileSync(stakeholderPath, "utf-8"));
    stakeholderCount = Array.isArray(stakeholderData) ? stakeholderData.length : stakeholderCount;
  } catch (e) { console.error("[home] stakeholders.json read failed:", e); }

  let reformIndex: ReturnType<typeof computeReformIndex>;
  try {
    reformIndex = computeReformIndex();
  } catch (e) {
    console.error("[home] computeReformIndex failed (build-time?):", e);
    reformIndex = { current_score: 0, trend: "flat" as const, trend_delta: 0, package_sub_indices: [], quarterly_snapshots: [], scenarios: [], last_updated: "" };
  }

  let keystones: { id: number; title: string; keystoneScore: number }[] = [];
  try {
    const graphPath = path.resolve(process.cwd(), "data", "dependency_graph.json");
    const graph = JSON.parse(fs.readFileSync(graphPath, "utf-8")) as DependencyGraph;
    keystones = computeNetworkCentrality(graph)
      .slice(0, 3)
      .map((k) => ({ id: k.id, title: k.title, keystoneScore: k.keystoneScore }));
  } catch (e) {
    console.error("[home] dependency_graph.json read failed:", e);
  }

  let totalGap = 0;
  try {
    const budgetPath = path.resolve(process.cwd(), "data", "budget_alignment.json");
    const budgetData = JSON.parse(fs.readFileSync(budgetPath, "utf-8"));
    const allocated: number = budgetData.packages.reduce(
      (s: number, p: { budget_allocated: number }) => s + p.budget_allocated,
      0
    );
    const recommended: number = budgetData.packages.reduce(
      (s: number, p: { budget_recommended: number }) => s + p.budget_recommended,
      0
    );
    totalGap = Math.round((recommended - allocated) * 10) / 10;
  } catch (e) {
    console.error("[home] budget_alignment.json read failed:", e);
  }

  return { stats, reformIndex, keystones, totalGap, packageCount, stakeholderCount };
}

// ── Static content ───────────────────────────────────────────────────────────

const BINDING_CONSTRAINTS = [
  { id: "energy",             label: "Energy & Electricity",   icon: "⚡" },
  { id: "logistics",          label: "Logistics & Transport",  icon: "🚂" },
  { id: "skills",             label: "Skills & Education",     icon: "🎓" },
  { id: "regulation",         label: "Regulatory Burden",      icon: "📋" },
  { id: "crime",              label: "Crime & Safety",         icon: "⚖️" },
  { id: "labor_market",       label: "Labour Market",          icon: "👷" },
  { id: "land",               label: "Land & Property",        icon: "🏗️" },
  { id: "digital",            label: "Digital Infrastructure", icon: "💻" },
  { id: "government_capacity",label: "Government Capacity",    icon: "🏛️" },
  { id: "corruption",         label: "Corruption & Governance",icon: "🔍" },
];

const AUDIENCE_PATHWAYS = [
  {
    role: "Policymaker",
    tagline: "Find evidence-based reform priorities",
    description:
      "Access curated reform packages, budget alignment analysis, and AI-assisted policy briefs grounded in committee deliberations.",
    links: [
      { label: "Analytics",      href: "/analytics" },
      { label: "Brief Generator",href: "/briefs" },
      { label: "Reform Index",   href: "/reform-index" },
    ],
    borderColor: "border-sa-green",
    badgeClass: "bg-sa-green/10 text-sa-green ring-sa-green/20",
  },
  {
    role: "Researcher",
    tagline: "Explore reform dependencies and data",
    description:
      "Map how policy ideas interlock, run network centrality analysis, access raw data via the API, and explore international comparisons.",
    links: [
      { label: "Dependencies",   href: "/dependencies" },
      { label: "API Docs",       href: "/api-docs" },
      { label: "Comparisons",    href: "/comparisons" },
    ],
    borderColor: "border-[#001489]",
    badgeClass: "bg-blue-50 text-[#001489] ring-blue-200",
  },
  {
    role: "Civil Society",
    tagline: "Track accountability and progress",
    description:
      "Monitor which reform ideas are stalled, who is responsible, and how parliamentary committees are following through on commitments.",
    links: [
      { label: "Accountability", href: "/accountability" },
      { label: "Reform Index",   href: "/reform-index" },
      { label: "By Constraint",  href: "/themes" },
    ],
    borderColor: "border-sa-red",
    badgeClass: "bg-red-50 text-sa-red ring-red-200",
  },
  {
    role: "Student",
    tagline: "Learn about SA's economic challenges",
    description:
      "Access structured teaching materials, the open textbook, and data-driven explanations of South Africa's binding constraints.",
    links: [
      { label: "Teaching",       href: "/teaching" },
      { label: "By Constraint",  href: "/themes" },
    ],
    borderColor: "border-sa-gold",
    badgeClass: "bg-amber-50 text-amber-700 ring-amber-200",
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const { stats, reformIndex, keystones, totalGap, packageCount, stakeholderCount } = await getHomepageData();

  const trendArrow =
    reformIndex.trend === "up" ? "↑" : reformIndex.trend === "down" ? "↓" : "→";
  const trendColorClass =
    reformIndex.trend === "up"
      ? "text-emerald-600"
      : reformIndex.trend === "down"
      ? "text-sa-red"
      : "text-gray-400";

  return (
    <div>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="-mx-4 sm:-mx-6 -mt-8 bg-gradient-to-br from-[#007A4D] via-[#006640] to-[#004d30] text-white px-4 sm:px-6 py-14 sm:py-20">
        <div className="max-w-3xl">
          {/* Branding accent */}
          <div className="flex items-center gap-2.5 mb-5">
            <span className="flex gap-0.5">
              <span className="w-1 h-4 bg-white/70 rounded-sm" />
              <span className="w-1 h-4 bg-sa-gold rounded-sm" />
              <span className="w-1 h-4 bg-sa-red rounded-sm" />
            </span>
            <span className="text-white/60 text-xs font-medium tracking-widest uppercase">
              Beta · Independent Research · NYU Wagner
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4">
            Mapping South Africa&apos;s<br />
            <span className="text-sa-gold">Path to Reform</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
            A comprehensive database of policy reform ideas drawn from parliamentary committee
            deliberations — curated, assessed for impact, and tracked for accountability.
          </p>

          {/* Key stats */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { value: stats.totalIdeas,         label: "Policy Ideas" },
              { value: packageCount,             label: "Reform Packages" },
              { value: stats.constraintsCovered, label: "Binding Constraints" },
              { value: stakeholderCount,         label: "Stakeholders Mapped" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-4 py-3 text-center min-w-[90px]"
              >
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/ideas"
              className="bg-sa-gold text-gray-900 px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-amber-400 transition-colors"
            >
              Explore Ideas →
            </Link>
            <Link
              href="/packages"
              className="bg-white/12 text-white px-6 py-2.5 rounded-lg font-medium text-sm border border-white/25 hover:bg-white/20 transition-colors"
            >
              View Reform Packages
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why This Matters ────────────────────────────────────────────────── */}
      <section className="py-12 border-b border-gray-100">
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why This Matters</h2>
            <div className="space-y-3 text-gray-600 leading-relaxed text-[15px]">
              <p>
                South Africa&apos;s economy has grown at under 2% per year for more than a decade —
                not for want of policy ideas, but because of chronic implementation failure.
                Parliamentary portfolio committees regularly surface detailed, actionable reforms,
                yet most go unimplemented or are debated repeatedly without resolution.
              </p>
              <p>
                SA Policy Space systematically catalogues these reform proposals, organised around
                ten structural{" "}
                <strong className="text-gray-800">binding constraints</strong> — the core barriers
                that economists identify as blocking sustained, inclusive growth: energy, logistics,
                skills, regulation, crime, labour market rigidity, land access, digital infrastructure,
                government capacity, and corruption.
              </p>
              <p>
                By mapping dependencies between ideas and tracking implementation status, the platform
                identifies which reforms are{" "}
                <em className="text-gray-800">keystones</em> — those whose progress unblocks multiple
                others — and which are stalled despite political commitments.
              </p>
            </div>
            <div className="mt-5">
              <Link href="/about" className="text-sa-green text-sm font-medium hover:underline">
                Read the full methodology →
              </Link>
            </div>
          </div>

          {/* Binding constraints grid */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              {stats.constraintsCovered} Binding Constraints Covered
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {BINDING_CONSTRAINTS.map((c) => (
                <Link
                  key={c.id}
                  href={`/themes?constraint=${c.id}`}
                  className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 bg-white hover:border-sa-green/40 hover:bg-sa-green/5 transition-colors group"
                >
                  <span className="text-base leading-none">{c.icon}</span>
                  <span className="text-gray-600 group-hover:text-sa-green text-xs leading-snug">
                    {c.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What You Can Do Here ────────────────────────────────────────────── */}
      <section className="py-12 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">What You Can Do Here</h2>
        <p className="text-gray-500 text-sm mb-6">
          Different tools for different audiences — choose your starting point.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AUDIENCE_PATHWAYS.map((audience) => (
            <div
              key={audience.role}
              className={`card border-t-4 ${audience.borderColor} flex flex-col`}
            >
              <span className={`badge ${audience.badgeClass} mb-3 self-start`}>
                {audience.role}
              </span>
              <p className="font-semibold text-gray-900 text-sm mb-1.5">{audience.tagline}</p>
              <p className="text-xs text-gray-500 leading-relaxed flex-1 mb-4">
                {audience.description}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {audience.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-xs text-sa-green hover:underline font-medium"
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Latest Insights ─────────────────────────────────────────────────── */}
      <section className="py-12 border-b border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Insights</h2>
          <p className="text-gray-500 text-sm mt-0.5">Live data from the database — Q1 2026</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {/* Reform progress score */}
          <div className="card border-t-4 border-sa-green">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Reform Progress Score</h3>
              <Link href="/reform-index" className="text-xs text-sa-green hover:underline">
                Full index →
              </Link>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-bold text-sa-green">
                {reformIndex.current_score}
              </span>
              <span className="text-gray-400 text-lg mb-1">/100</span>
              <span className={`text-sm font-medium mb-1 ${trendColorClass}`}>
                {trendArrow} {reformIndex.trend_delta}pt
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-sa-green rounded-full transition-all"
                style={{ width: `${reformIndex.current_score}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-3">
              <span>0</span>
              <span>Near-term target: 40</span>
              <span>100</span>
            </div>
            <p className="text-xs text-gray-500 leading-snug mb-2">
              Weighted index across 5 reform packages. Advancing ~15–20 stalled ideas would reach the 40-point near-term target.
            </p>
            <details className="text-[10px] text-gray-400">
              <summary className="cursor-pointer hover:text-gray-600">Methodology</summary>
              <p className="mt-1 leading-relaxed">
                Each idea earns credit based on status: implemented (100%), partially implemented (60%),
                under review (30%), drafted (25%), debated (20%), proposed (10%), stalled (5%).
                Package scores are weighted by strategic importance: Infrastructure (28%),
                Human Capital (22%), State Capacity (20%), SMME (16%), Trade (14%).
                The composite score is the weighted average across all packages, scaled to 0–100.
              </p>
            </details>
          </div>

          {/* Keystone reforms */}
          <div className="card border-t-4 border-[#001489]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Top Keystone Reforms</h3>
              <Link href="/dependencies" className="text-xs text-sa-green hover:underline">
                Dependency map →
              </Link>
            </div>
            <p className="text-xs text-gray-500 mb-3 leading-snug">
              Highest network centrality — unblocking these reforms unlocks many others.
            </p>
            {keystones.length === 0 ? (
              <p className="text-xs text-gray-400 italic">Dependency data unavailable.</p>
            ) : (
              <ul className="space-y-3">
                {keystones.map((k, i) => (
                  <li key={k.id} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#001489] text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <Link
                        href={`/ideas/${k.id}`}
                        className="text-xs font-medium text-gray-800 hover:text-sa-green leading-snug block"
                      >
                        {k.title}
                      </Link>
                      <span className="text-[11px] text-gray-400">
                        Keystone score: {k.keystoneScore}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Budget alignment gap */}
          <div className="card border-t-4 border-sa-gold">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Budget Alignment Gap</h3>
              <Link href="/budget" className="text-xs text-sa-green hover:underline">
                Full analysis →
              </Link>
            </div>
            <div className="mb-2">
              <span className="text-3xl font-bold text-amber-600">
                R{totalGap > 0 ? totalGap.toFixed(1) : "—"}bn
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-snug mb-4">
              Total gap between parliamentary committee recommendations and current budget allocations
              across all 5 reform packages.
            </p>
            <BudgetGapChart packages={reformIndex.package_sub_indices.map((pkg) => ({
              name: pkg.name,
              score: pkg.score,
              package_id: pkg.package_id,
            }))} />
          </div>

        </div>
      </section>

      {/* ── Data Sources ────────────────────────────────────────────────────── */}
      <section className="py-10">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Data Sources &amp; Methodology
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Parliamentary Record</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Policy ideas are synthesised from{" "}
              <a
                href="https://pmg.org.za"
                className="text-sa-green hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                PMG
              </a>{" "}
              committee transcripts and meeting reports. Each idea is original synthesis — not
              verbatim PMG text.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Fiscal &amp; Budget Data</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Budget alignment draws on 2024/25 MTBPS allocations, National Treasury Budget
              Reviews, and Parliamentary BRRR recommendations from portfolio committees.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Comparative &amp; Academic</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              International comparisons use World Bank, IMF, and OECD datasets. The binding
              constraints framework draws on Hausmann-Rodrik-Velasco growth diagnostics.
            </p>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-gray-100">
          <Link href="/about" className="text-sm text-sa-green hover:underline font-medium">
            Full methodology and data documentation →
          </Link>
        </div>
      </section>

    </div>
  );
}
