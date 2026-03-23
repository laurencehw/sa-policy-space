"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";

// ── Static data (no DB dependency needed — this page is civil-society facing) ──

interface ReformPackage {
  id: number;
  name: string;
  tagline: string;
  plain_summary: string;
  implementation_pct: number;
  traffic_light: "red" | "amber" | "green";
  promises: { promised: string; happened: string; status: "delivered" | "partial" | "broken" | "pending" }[];
  minister_portfolio: string;
  dept_website: string;
  contact_note: string;
}

const PACKAGES: ReformPackage[] = [
  {
    id: 1,
    name: "Infrastructure Unblock",
    tagline: "Fix power, rail, and water so the economy can work",
    plain_summary:
      "South Africa loses billions each year because the lights keep going out, our trains don't run, and our ports are too slow. This package covers government promises to fix Eskom, modernise Transnet's railways, and maintain water supply. Some progress has been made on electricity — load-shedding has reduced — but rail and water remain severely underfunded and behind schedule.",
    implementation_pct: 38,
    traffic_light: "amber",
    promises: [
      {
        promised: "Restructure Eskom into separate generation, transmission, and distribution companies",
        happened: "Eskom Transmission (Pty) Ltd was legally separated in 2023. Generation separation is still in progress. Distribution reform has not begun.",
        status: "partial",
      },
      {
        promised: "End load-shedding by end of 2024",
        happened: "Load-shedding effectively ended for extended periods in mid-2024 due to new generation capacity and reduced industrial demand. However structural surplus has not been secured.",
        status: "partial",
      },
      {
        promised: "Accelerate private power generation — remove the 100MW licensing cap",
        happened: "Delivered. The cap was removed in June 2021. Over 100 private power projects have since been registered with NERSA.",
        status: "delivered",
      },
      {
        promised: "Recapitalise PRASA and restore passenger rail services",
        happened: "R9.9bn allocated but only a fraction disbursed to operational use. Metrorail services in Cape Town, Johannesburg, and Durban remain well below pre-2019 levels. Most stations remain unsafe.",
        status: "partial",
      },
      {
        promised: "Resolve Transnet port and rail backlogs — Strategic Equity Partners by 2023",
        happened: "MSC and other shipping lines partnered for Durban terminal operations. Rail concessions are under negotiation. Container terminal efficiency remains below peer ports.",
        status: "partial",
      },
    ],
    minister_portfolio: "Electricity and Energy / Transport / Water and Sanitation",
    dept_website: "https://www.energy.gov.za",
    contact_note: "Contact the Electricity and Energy Portfolio Committee via Parliament's e-petitions system to register concerns about power infrastructure.",
  },
  {
    id: 2,
    name: "SMME & Employment Acceleration",
    tagline: "Help small businesses create jobs",
    plain_summary:
      "South Africa's unemployment rate is one of the highest in the world, at over 32%. Small businesses are supposed to be the engine of job creation, but they face mountains of red tape, can't access affordable loans, and struggle to win government contracts. This package tracks promises to simplify starting a business, expand small-business lending, and include more small businesses in government procurement.",
    implementation_pct: 22,
    traffic_light: "red",
    promises: [
      {
        promised: "Operationalise the SMME Ombud Service (National Small Enterprise Amendment Act)",
        happened: "The Act was signed but the Ombud Service office has only partial capacity. Most small businesses are unaware it exists.",
        status: "partial",
      },
      {
        promised: "Make it possible to start a business online in one day via BizPortal",
        happened: "BizPortal is live and improving. Business registration time has fallen to under 5 days for straightforward cases. However many compliance steps (SARS, UIF, COID) remain offline.",
        status: "partial",
      },
      {
        promised: "Set aside 30% of government procurement for small businesses",
        happened: "The 30% set-aside is law but enforcement is uneven. Large departments routinely fail to meet targets without consequence. Few small businesses are aware of how to register.",
        status: "partial",
      },
      {
        promised: "Place 1 million young people in private sector employment through the YES programme",
        happened: "Approximately 130,000 placements recorded by 2023. Far short of the 1 million target. Government matching incentives were cut due to fiscal pressure.",
        status: "broken",
      },
      {
        promised: "Reform SEFA to expand affordable lending to micro-enterprises",
        happened: "SEFA has increased its lending book but interest rates remain above commercial bank rates for most borrowers. Turnaround times have improved modestly.",
        status: "partial",
      },
    ],
    minister_portfolio: "Small Business Development / Employment and Labour",
    dept_website: "https://www.dsbd.gov.za",
    contact_note: "Submit a complaint about SMME procurement non-compliance directly to the SMME Ombud Service at smmeboard.gov.za.",
  },
  {
    id: 3,
    name: "Human Capital Pipeline",
    tagline: "Better schools, hospitals, and skills for the future",
    plain_summary:
      "South Africa's children are not learning to read: only 1 in 5 Grade 4 learners can read for meaning. Our hospitals are understaffed. Our TVET colleges produce far fewer artisans than the economy needs. This package tracks government promises on improving education quality, expanding early childhood development, training more artisans, and reforming the health system — including the National Health Insurance.",
    implementation_pct: 19,
    traffic_light: "red",
    promises: [
      {
        promised: "Transfer Early Childhood Development from Social Development to Basic Education and expand subsidised ECD coverage",
        happened: "Transfer to DBE completed in 2022. Subsidy expansion has been partial — fewer than 40% of targeted additional children are enrolled in subsidised ECD by 2024.",
        status: "partial",
      },
      {
        promised: "Implement a dedicated National Reading and Literacy Crisis Response Programme",
        happened: "No dedicated crisis programme exists. DBE participates in the Reading Norms and Standards initiative but funding is far below committee recommendations.",
        status: "pending",
      },
      {
        promised: "Expand TVET college capacity and improve industry relevance",
        happened: "Capex allocations have increased modestly. Curriculum review is ongoing. However, enrolment growth has been faster than quality improvements — lecturer shortage remains critical.",
        status: "partial",
      },
      {
        promised: "Pass and begin implementing the National Health Insurance Act",
        happened: "NHI Act signed into law in May 2024. Implementation planning is at an early stage. No contracts with private providers have been concluded. Medical community and employer organisations have challenged the Act in court.",
        status: "partial",
      },
      {
        promised: "Formalise Community Health Workers and expand the primary healthcare platform",
        happened: "CHW formalisation (salaries, recognition) has stalled due to fiscal constraints. PHC clinic revitalisation is behind the targets set in the District Health Systems plan.",
        status: "partial",
      },
    ],
    minister_portfolio: "Basic Education / Higher Education and Training / Health",
    dept_website: "https://www.education.gov.za",
    contact_note: "Contact Equal Education (equaleducation.org.za) or Section27 (section27.org.za) for civil society support on education accountability.",
  },
  {
    id: 4,
    name: "Trade & Industrial Competitiveness",
    tagline: "Sell more to the world and build industries that last",
    plain_summary:
      "South Africa has valuable minerals, a skilled manufacturing workforce, and preferential trade access to major markets. But we are not making the most of these advantages. This package covers government promises to implement the AfCFTA free trade agreement, develop a strategy for critical minerals, support automotive and manufacturing sectors, and create a plan for economic zones that actually work.",
    implementation_pct: 28,
    traffic_light: "red",
    promises: [
      {
        promised: "Implement the AfCFTA by removing tariff and non-tariff barriers and operationalising the SA AfCFTA office",
        happened: "SA has an AfCFTA office but it is severely underfunded. Tariff schedules have been submitted but non-tariff barrier reduction is minimal. Border crossing times have not improved.",
        status: "partial",
      },
      {
        promised: "Develop a Critical Minerals Beneficiation Strategy and catalytic fund",
        happened: "A strategy was tabled but lacks a dedicated investment vehicle. DTIC's beneficiation incentives remain at the same level as the pre-strategy baseline.",
        status: "partial",
      },
      {
        promised: "Implement the Automotive Master Plan including EV transition incentives",
        happened: "APDP Phase 2 is under implementation. An EV White Paper was published in 2023. EV-specific incentives are under development but not yet in the tax framework.",
        status: "partial",
      },
      {
        promised: "Maintain and expand AGOA market access for SA exporters",
        happened: "SA retained AGOA eligibility in 2024 review. However, export uptake of AGOA preferences has grown slowly due to logistics and standards compliance costs.",
        status: "partial",
      },
      {
        promised: "Improve Special Economic Zone performance — faster approvals, better infrastructure",
        happened: "SEZ applications have a new online portal. However, Transnet logistics delays continue to undermine SEZ competitiveness. No new major SEZ anchor investment was concluded in 2023–24.",
        status: "partial",
      },
    ],
    minister_portfolio: "Trade, Industry and Competition / Mineral Resources and Energy",
    dept_website: "https://www.thedtic.gov.za",
    contact_note: "Track AfCFTA implementation updates via the African Union Trade Observatory and ITAC (itac.org.za).",
  },
  {
    id: 5,
    name: "State Capacity & Governance",
    tagline: "A government that works — and can be held to account",
    plain_summary:
      "None of the other reforms will succeed if the government cannot implement them. This package covers promises to improve how government works: reducing corruption, expanding SARS's capacity to collect more taxes, reforming state-owned enterprises, and exiting the FATF grey list that was harming SA's ability to do business globally. One major win: SA was removed from the FATF grey list in 2024.",
    implementation_pct: 45,
    traffic_light: "amber",
    promises: [
      {
        promised: "Exit FATF greylisting by fully implementing the anti-money laundering legislative package",
        happened: "Delivered. SA was removed from the FATF grey list in October 2024 after passing the required legislation and demonstrating enforcement capacity.",
        status: "delivered",
      },
      {
        promised: "Stabilise the NPA and expand the Investigating Directorate to prosecute state capture",
        happened: "The NPA has improved its senior leadership. The Investigating Directorate has been renamed and its mandate expanded. State capture prosecutions are progressing slowly — no senior convictions as of early 2026.",
        status: "partial",
      },
      {
        promised: "Expand SARS's capacity to close the tax gap (estimated at R300bn+ annually)",
        happened: "SARS revenue collection has improved significantly since 2018 under the current Commissioner. However, staffing levels remain below pre-Moyane-era peaks and IT modernisation is ongoing.",
        status: "partial",
      },
      {
        promised: "Reduce the public service headcount through voluntary severance and improve performance management",
        happened: "Some voluntary severance packages were offered. Public service wage bill pressure continues. Performance management systems (MPAT) are in place but consequence management is weak.",
        status: "partial",
      },
      {
        promised: "Implement credible fiscal consolidation — reduce the budget deficit to below 4% of GDP",
        happened: "The deficit has been on a consolidation path but remains above 4% of GDP. Eskom debt support and social grant expansion have complicated the trajectory. Debt-to-GDP continues to rise.",
        status: "partial",
      },
    ],
    minister_portfolio: "Finance / Justice / Public Service and Administration",
    dept_website: "https://www.treasury.gov.za",
    contact_note: "Register for Budget Justice Coalition (budgetjusticesa.org) updates, and submit comments during the annual budget consultation process via National Treasury.",
  },
];

// ── Traffic Light ─────────────────────────────────────────────────────────

const TRAFFIC_CONFIG = {
  green: {
    bg: "bg-green-50 border-green-300",
    dot: "bg-green-500",
    label: "On Track",
    labelStyle: "text-green-700 bg-green-100",
    pctStyle: "text-green-700",
  },
  amber: {
    bg: "bg-amber-50 border-amber-300",
    dot: "bg-amber-500",
    label: "Partially Delivered",
    labelStyle: "text-amber-700 bg-amber-100",
    pctStyle: "text-amber-700",
  },
  red: {
    bg: "bg-red-50 border-red-300",
    dot: "bg-red-500",
    label: "Behind / Stalled",
    labelStyle: "text-red-700 bg-red-100",
    pctStyle: "text-red-700",
  },
} as const;

const PROMISE_STATUS_CONFIG = {
  delivered: { icon: "✓", style: "text-green-700 bg-green-50 border-green-200" },
  partial:   { icon: "◑", style: "text-amber-700 bg-amber-50 border-amber-200" },
  broken:    { icon: "✗", style: "text-red-700 bg-red-50 border-red-200" },
  pending:   { icon: "○", style: "text-gray-600 bg-gray-50 border-gray-200" },
} as const;

// ── Component ─────────────────────────────────────────────────────────────

export default function AccountabilityPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);

  function handleShare(pkg: ReformPackage) {
    const text = `SA Policy Space: "${pkg.name}" — ${pkg.implementation_pct}% implemented (${pkg.traffic_light === "green" ? "On Track" : pkg.traffic_light === "amber" ? "Partial" : "Behind"}). Track government commitments at sapolicyspace.org/accountability`;
    if (navigator.share) {
      navigator.share({ title: "SA Policy Space Accountability", text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      setShareMsg(pkg.name);
      setTimeout(() => setShareMsg(null), 2500);
    }
  }

  return (
    <div className="space-y-8">

      {/* OG / Twitter meta is set via metadata export in server component;
          for client component we use the head tag approach below */}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Accountability Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1 max-w-2xl">
          Plain-language tracking of government reform commitments. What was promised — and what happened.
          Updated as new committee evidence becomes available.
        </p>
      </div>

      {/* Traffic Light Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(["green", "amber", "red"] as const).map((tl) => {
          const cfg = TRAFFIC_CONFIG[tl];
          const count = PACKAGES.filter((p) => p.traffic_light === tl).length;
          return (
            <div key={tl} className={`rounded-xl border p-4 ${cfg.bg} flex items-center gap-3`}>
              <span className={`w-4 h-4 rounded-full flex-shrink-0 ${cfg.dot}`} />
              <div>
                <div className="font-semibold text-gray-900">
                  {count} package{count !== 1 ? "s" : ""}
                </div>
                <div className="text-xs text-gray-600">{cfg.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Package Cards */}
      <div className="space-y-4">
        {PACKAGES.map((pkg) => {
          const tl = TRAFFIC_CONFIG[pkg.traffic_light];
          const isOpen = expanded === pkg.id;

          const deliveredCount = pkg.promises.filter((p) => p.status === "delivered").length;
          const partialCount = pkg.promises.filter((p) => p.status === "partial").length;
          const brokenCount = pkg.promises.filter((p) => p.status === "broken").length;
          const pendingCount = pkg.promises.filter((p) => p.status === "pending").length;

          return (
            <div
              key={pkg.id}
              className={`rounded-2xl border-2 overflow-hidden ${tl.bg} ${isOpen ? "shadow-md" : ""}`}
            >
              {/* Card header */}
              <button
                className="w-full text-left px-5 py-5"
                onClick={() => setExpanded(isOpen ? null : pkg.id)}
              >
                <div className="flex flex-wrap items-start gap-3">
                  {/* Traffic light dot */}
                  <span className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full ${tl.dot}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-gray-900">{pkg.name}</h2>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tl.labelStyle}`}>
                        {tl.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-2">{pkg.tagline}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{pkg.plain_summary}</p>
                  </div>

                  {/* Progress circle / pct */}
                  <div className="flex-shrink-0 text-right">
                    <div className={`text-3xl font-bold ${tl.pctStyle}`}>
                      {pkg.implementation_pct}%
                    </div>
                    <div className="text-xs text-gray-500">implemented</div>
                    <div className="text-[10px] text-gray-400 mt-1">{isOpen ? "▲ Less" : "▼ Promises"}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 w-full bg-white/60 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${tl.dot}`}
                    style={{ width: `${pkg.implementation_pct}%` }}
                  />
                </div>

                {/* Promise tally */}
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-600">
                  {deliveredCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="text-green-600 font-semibold">✓ {deliveredCount}</span> delivered
                    </span>
                  )}
                  {partialCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="text-amber-600 font-semibold">◑ {partialCount}</span> partial
                    </span>
                  )}
                  {brokenCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="text-red-600 font-semibold">✗ {brokenCount}</span> broken
                    </span>
                  )}
                  {pendingCount > 0 && (
                    <span className="flex items-center gap-1">
                      <span className="text-gray-500 font-semibold">○ {pendingCount}</span> not started
                    </span>
                  )}
                </div>
              </button>

              {/* Expanded: promises + take action */}
              {isOpen && (
                <div className="border-t border-white/50 bg-white/70 px-5 py-5 space-y-5">

                  {/* What was promised vs what happened */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      What Was Promised — What Happened
                    </h3>
                    <div className="space-y-3">
                      {pkg.promises.map((promise, i) => {
                        const psCfg = PROMISE_STATUS_CONFIG[promise.status];
                        return (
                          <div
                            key={i}
                            className={`rounded-xl border p-4 ${psCfg.style}`}
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <span className="flex-shrink-0 font-bold text-sm">{psCfg.icon}</span>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 leading-snug">
                                  Promised: {promise.promised}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed pl-5">
                              <span className="font-medium text-gray-800">What happened: </span>
                              {promise.happened}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Take Action */}
                  <div className="rounded-xl bg-sa-green/5 border border-sa-green/20 p-4">
                    <h3 className="text-sm font-semibold text-sa-green mb-2">Take Action</h3>
                    <p className="text-xs text-gray-700 mb-3">{pkg.contact_note}</p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={pkg.dept_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        Department Website ↗
                      </a>
                      <a
                        href="https://www.parliament.gov.za/committee-meetings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        Committee Meetings ↗
                      </a>
                      <a
                        href="https://pmg.org.za"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        PMG Source Data ↗
                      </a>
                      <button
                        onClick={() => handleShare(pkg)}
                        className="btn-secondary text-xs py-1.5 px-3"
                      >
                        {shareMsg === pkg.name ? "Copied!" : "Share ↗"}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Responsible portfolio: {pkg.minister_portfolio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl p-4">
        <span className="font-medium text-gray-700">Legend:</span>
        {Object.entries(PROMISE_STATUS_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1">
            <span className="font-semibold">{cfg.icon}</span>
            <span className="capitalize">{key === "broken" ? "Not delivered" : key}</span>
          </span>
        ))}
        <span className="ml-auto text-gray-400">Traffic lights are updated as committee evidence accumulates.</span>
      </div>

    </div>
  );
}
