"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ── Types & Data ───────────────────────────────────────────────────────────

type Audience = "policymaker" | "civil_society" | "researcher";

const AUDIENCE_CONFIG: Record<Audience, { label: string; icon: string; description: string; color: string }> = {
  policymaker: {
    label: "Policymaker",
    icon: "🏛",
    description: "For ministers, senior officials, and advisors. Action-oriented with implementation detail.",
    color: "border-blue-300 bg-blue-50 text-blue-800",
  },
  civil_society: {
    label: "Civil Society",
    icon: "✊",
    description: "For NGOs, advocacy groups, and engaged citizens. Plain language, accountability-focused.",
    color: "border-green-300 bg-green-50 text-green-800",
  },
  researcher: {
    label: "Researcher",
    icon: "📖",
    description: "For academics, think-tanks, and graduate students. Formal structure with citations and methodology.",
    color: "border-purple-300 bg-purple-50 text-purple-800",
  },
};

const BRIEF_SECTIONS: Record<Audience, { title: string; description: string }[]> = {
  policymaker: [
    { title: "Problem Statement", description: "A precise articulation of the binding constraint — what it costs the economy in GDP, jobs, or tax revenue." },
    { title: "Proposed Intervention", description: "The specific policy action recommended, with draft regulatory or legislative reference where applicable." },
    { title: "Evidence Base", description: "2–3 key data points supporting the intervention, drawn from SA-specific research and international precedent." },
    { title: "Implementation Pathway", description: "Sequenced 90-day, 12-month, and 3-year action plan. Who does what, in what order." },
    { title: "Cost Estimate", description: "Order-of-magnitude fiscal cost, revenue or savings impact, and required sources of funding." },
    { title: "International Precedents", description: "1–2 peer economy examples with outcomes, timelines, and adaptation notes for SA context." },
  ],
  civil_society: [
    { title: "Plain-Language Summary", description: "What this policy does, in plain English — no jargon. Suitable for social media, public meetings, or media briefings." },
    { title: "What Government Promised", description: "Exact commitments made in parliamentary committees, government plans, or the NDP. With dates." },
    { title: "Current Status", description: "Where implementation stands today. Traffic light assessment: on track / partial / stalled." },
    { title: "Accountability Checklist", description: "Specific measurable milestones the public can use to track progress. Dates and responsible officials named." },
    { title: "Who to Contact", description: "Portfolio minister, department, parliamentary committee chair. Contact details and submission process." },
  ],
  researcher: [
    { title: "Formal Problem Definition", description: "Precise economic framing of the binding constraint. Growth diagnostics framework reference where applicable." },
    { title: "Literature Context", description: "Situating the proposal within the relevant theoretical and empirical literature. Key authors and findings." },
    { title: "Data Sources", description: "Primary data used: SARB, Stats SA, National Treasury, PMG committee proceedings, World Bank, IMF." },
    { title: "Methodology", description: "How the reform's growth and employment impact is estimated. Identification strategy, counterfactual, uncertainty range." },
    { title: "Policy Implications", description: "What the evidence implies for SA-specific policy design. Distributional effects, political economy constraints." },
    { title: "References", description: "Full citations in APA format. Key South African empirical papers and international comparative evidence." },
  ],
};

const REFORM_OPTIONS = [
  { value: "", label: "— Select an idea or package —" },
  { value: "pkg_1", label: "Package 1: Infrastructure Unblock" },
  { value: "pkg_2", label: "Package 2: SMME & Employment Acceleration" },
  { value: "pkg_3", label: "Package 3: Human Capital Pipeline" },
  { value: "pkg_4", label: "Package 4: Trade & Industrial Competitiveness" },
  { value: "pkg_5", label: "Package 5: State Capacity & Governance" },
  { value: "idea_eskom", label: "Idea: Eskom Restructuring" },
  { value: "idea_reading", label: "Idea: National Reading Crisis Response" },
  { value: "idea_tvet", label: "Idea: TVET College Quality Reform" },
  { value: "idea_afcfta", label: "Idea: AfCFTA Implementation" },
  { value: "idea_sars", label: "Idea: SARS Capacity Expansion" },
  { value: "idea_prasa", label: "Idea: PRASA Recapitalisation" },
  { value: "idea_minerals", label: "Idea: Critical Minerals Beneficiation" },
  { value: "idea_nhi", label: "Idea: National Health Insurance Implementation" },
  { value: "idea_smme_ombud", label: "Idea: SMME Ombud Service" },
  { value: "idea_fatf", label: "Idea: FATF Greylisting Exit (implemented)" },
];

// ── Markdown renderer ──────────────────────────────────────────────────────
// Handles ## headers and **bold** inline — no external dependency required.

function renderMarkdown(text: string): React.ReactNode[] {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h3 key={i} className="text-base font-bold text-gray-900 mt-6 mb-2 pb-1 border-b border-gray-200">
          {line.slice(3)}
        </h3>
      );
    }
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }
    // Inline **bold**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) =>
      part.startsWith("**") && part.endsWith("**")
        ? <strong key={j}>{part.slice(2, -2)}</strong>
        : part
    );
    return (
      <p key={i} className="text-sm text-gray-700 leading-relaxed">
        {rendered}
      </p>
    );
  });
}

// ── Inner Component ────────────────────────────────────────────────────────

function BriefsContent() {
  const searchParams = useSearchParams();
  const titleParam = searchParams.get("title") ?? "";

  // Build options: prepend a custom option if titleParam not in the hardcoded list
  const customOption = titleParam && !REFORM_OPTIONS.some((o) => o.label.includes(titleParam))
    ? { value: `custom_${titleParam}`, label: `Idea: ${titleParam}` }
    : null;
  const allOptions = customOption ? [REFORM_OPTIONS[0], customOption, ...REFORM_OPTIONS.slice(1)] : REFORM_OPTIONS;

  const [selectedIdea, setSelectedIdea] = useState(
    customOption ? customOption.value : ""
  );
  const [audience, setAudience] = useState<Audience>("policymaker");
  const [generating, setGenerating] = useState(false);
  const [briefContent, setBriefContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!selectedIdea) return;
    setGenerating(true);
    setBriefContent("");
    setError(null);

    const reformLabel = allOptions.find((o) => o.value === selectedIdea)?.label ?? "";

    try {
      const res = await fetch("/api/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reformId: selectedIdea, audience, reformLabel }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? `Server error ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setBriefContent((prev) => prev + decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate brief");
    } finally {
      setGenerating(false);
    }
  }

  const canGenerate = !!selectedIdea;
  const sections = BRIEF_SECTIONS[audience];
  const audienceCfg = AUDIENCE_CONFIG[audience];
  const reformLabel = allOptions.find((o) => o.value === selectedIdea)?.label ?? "";
  const reformTitle = reformLabel.replace(/^(Idea|Package \d): /, "") || "Reform Title";

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policy Brief Generator</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Generate tailored policy briefs from SA Policy Space data — structured for policymakers,
          civil society, or researchers. Powered by Claude AI.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="card p-5 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">

          {/* Reform selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Reform Idea or Package
            </label>
            <select
              value={selectedIdea}
              onChange={(e) => { setSelectedIdea(e.target.value); setBriefContent(""); setError(null); }}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sa-green/30"
            >
              {allOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1.5">
              Choose any idea from the database or an entire reform package.
            </p>
          </div>

          {/* Audience selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intended Audience
            </label>
            <div className="space-y-2">
              {(Object.entries(AUDIENCE_CONFIG) as [Audience, typeof AUDIENCE_CONFIG[Audience]][]).map(
                ([key, cfg]) => (
                  <label
                    key={key}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      audience === key ? cfg.color : "border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="audience"
                      value={key}
                      checked={audience === key}
                      onChange={() => { setAudience(key); setBriefContent(""); setError(null); }}
                      className="mt-0.5 accent-sa-green"
                    />
                    <div>
                      <div className="font-medium text-sm">
                        {cfg.icon} {cfg.label}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{cfg.description}</div>
                    </div>
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div>
          <button
            onClick={handleGenerate}
            disabled={!canGenerate || generating}
            className={`btn-primary ${!canGenerate ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Generating…
              </span>
            ) : (
              "Generate Brief"
            )}
          </button>
          {!canGenerate && (
            <p className="text-xs text-gray-400 mt-1.5">Select a reform idea or package to enable generation.</p>
          )}
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-500 text-lg flex-shrink-0">✕</span>
              <div>
                <p className="font-semibold text-red-900 text-sm">Generation failed</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Generated Brief — shown once content starts arriving */}
      {briefContent && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-semibold text-gray-900">Generated Brief</h2>
            <span className="text-xs text-gray-400">— {audienceCfg.label} format</span>
            {generating && (
              <span className="text-xs text-sa-green animate-pulse">● streaming…</span>
            )}
          </div>

          <div className={`rounded-2xl border-2 p-1 ${audienceCfg.color.split(" bg-")[0]} overflow-hidden`}>
            <div className="bg-white rounded-xl p-5">

              {/* Brief header */}
              <div className={`rounded-lg p-4 mb-5 ${audienceCfg.color}`}>
                <div className="text-[10px] font-semibold uppercase tracking-wide opacity-70 mb-1">
                  SA Policy Space — {audienceCfg.label} Brief
                </div>
                <div className="font-bold text-lg">{reformTitle}</div>
                <div className="text-sm opacity-80 mt-0.5">
                  {audienceCfg.icon} For {audienceCfg.label}s · SA Policy Space · {new Date().getFullYear()}
                </div>
              </div>

              {/* Rendered markdown content */}
              <div className="space-y-1">
                {renderMarkdown(briefContent)}
              </div>

              {/* Footer */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">SA Policy Space · sapolicyspace.org</span>
                <span className="text-[10px] text-gray-400">Parliamentary source data via PMG</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview — shown when no brief yet generated */}
      {!briefContent && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-semibold text-gray-900">
              Brief Structure Preview
            </h2>
            <span className="text-xs text-gray-400">— {audienceCfg.label} format</span>
          </div>

          <div className={`rounded-2xl border-2 p-1 ${audienceCfg.color.split(" bg-")[0]} overflow-hidden`}>
            <div className="bg-white rounded-xl p-5 space-y-0">

              {/* Simulated brief header */}
              <div className={`rounded-lg p-4 mb-4 ${audienceCfg.color}`}>
                <div className="text-[10px] font-semibold uppercase tracking-wide opacity-70 mb-1">
                  SA Policy Space — {audienceCfg.label} Brief
                </div>
                <div className="font-bold text-lg">
                  {selectedIdea ? reformTitle : "Reform Title"}
                </div>
                <div className="text-sm opacity-80 mt-0.5">
                  {audienceCfg.icon} For {audienceCfg.label}s · SA Policy Space · {new Date().getFullYear()}
                </div>
              </div>

              {/* Section previews */}
              <div className="space-y-3">
                {sections.map((section, i) => (
                  <div key={i} className="group">
                    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-b-0">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900 text-sm">{section.title}</div>
                        <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {section.description}
                        </div>
                        {/* Placeholder content lines */}
                        <div className="mt-2 space-y-1.5">
                          <div className="h-2.5 bg-gray-100 rounded-full w-full" />
                          <div className="h-2.5 bg-gray-100 rounded-full w-4/5" />
                          <div className="h-2.5 bg-gray-100 rounded-full w-3/4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer watermark */}
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-gray-400">SA Policy Space · sapolicyspace.org</span>
                <span className="text-[10px] text-gray-400">Parliamentary source data via PMG</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audience comparison table */}
      <div className="card p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Brief Format by Audience</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 text-gray-500 font-medium">Format Element</th>
                <th className="text-center py-2 px-3 text-blue-700 font-medium">🏛 Policymaker</th>
                <th className="text-center py-2 px-3 text-green-700 font-medium">✊ Civil Society</th>
                <th className="text-center py-2 px-3 text-purple-700 font-medium">📖 Researcher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                ["Length", "2 pages", "1 page", "4+ pages"],
                ["Language", "Technical but action-oriented", "Plain English", "Academic / formal"],
                ["Key section", "Implementation Pathway", "Accountability Checklist", "Methodology"],
                ["Numbers focus", "Cost & fiscal impact", "Deadlines & targets", "Effect size & confidence"],
                ["Calls to action", "Decision / directive", "Contact officials", "Further research"],
                ["Citation style", "Minimal, footnoted", "None", "Full APA"],
                ["Data density", "Medium", "Low", "High"],
              ].map(([feature, ...values]) => (
                <tr key={feature} className="hover:bg-gray-50">
                  <td className="py-2 pr-4 font-medium text-gray-700">{feature}</td>
                  {values.map((v, i) => (
                    <td key={i} className="py-2 px-3 text-center text-gray-600">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// ── Page export ─────────────────────────────────────────────────────────────

export default function BriefsPage() {
  return (
    <Suspense fallback={<div className="card text-center py-12 text-gray-400"><p className="text-sm">Loading…</p></div>}>
      <BriefsContent />
    </Suspense>
  );
}
