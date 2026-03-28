export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { CONSTRAINT_LABELS } from "@/lib/supabase";
import type { PolicyIdea, ImplementationPlan, Meeting } from "@/lib/supabase";

// ── Data fetching ──────────────────────────────────────────────────────────

async function fetchIdea(id: number): Promise<PolicyIdea | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getIdeaById } = await import("@/lib/local-api");
    return getIdeaById(id) as PolicyIdea | null;
  }
  const { getIdeaById } = await import("@/lib/supabase-api");
  return await getIdeaById(id) as PolicyIdea | null;
}

async function fetchPlan(ideaId: number): Promise<ImplementationPlan | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getImplementationPlan } = await import("@/lib/local-api");
    return getImplementationPlan(ideaId) as ImplementationPlan | null;
  }
  const { getImplementationPlan } = await import("@/lib/supabase-api");
  return await getImplementationPlan(ideaId) as ImplementationPlan | null;
}

async function fetchMeetings(ideaId: number): Promise<Meeting[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getIdeaMeetings } = await import("@/lib/local-api");
    return getIdeaMeetings(ideaId) as Meeting[];
  }
  const { getIdeaMeetings } = await import("@/lib/supabase-api");
  return await getIdeaMeetings(ideaId) as Meeting[];
}

async function fetchComparisons(ideaId: number): Promise<any[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { getIdeaComparisons } = await import("@/lib/local-api");
    return getIdeaComparisons(ideaId) as any[];
  }
  const { getIdeaComparisons } = await import("@/lib/supabase-api");
  return await getIdeaComparisons(ideaId) as any[];
}

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = Number((await params).id);
  const idea = await fetchIdea(id);
  if (!idea) return {};
  const description = `White Paper policy framework for ${idea.title}. ${(idea.description ?? "").slice(0, 120)}`;
  return {
    title: `White Paper: ${idea.title}`,
    description,
    alternates: { canonical: `https://sa-policy-space.vercel.app/documents/white-paper/${id}` },
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "Not recorded";
  return new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function fmtMonthYear(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}

function parseArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") { try { return JSON.parse(v); } catch { return []; } }
  return [];
}

const CONSTRAINT_RATIONALE: Record<string, { diagnosis: string; urgency: string }> = {
  energy: {
    diagnosis:
      "The national electricity system faces a structural capacity deficit, with generation inadequacy manifesting as systemic load-shedding. The International Monetary Fund (2023) estimates that load-shedding has reduced GDP growth by approximately 2 percentage points per annum. The root causes include decades of underinvestment in generation capacity, deferred maintenance, and governance failures at Eskom.",
    urgency:
      "Without structural reform of electricity supply, South Africa cannot achieve the 3–5% annual growth rate required to meaningfully reduce unemployment. Every month of inaction compounds the economic damage and investor-confidence deficit.",
  },
  logistics: {
    diagnosis:
      "Transnet Freight Rail's throughput has fallen by approximately 30% since 2019, while port performance at Durban and Cape Town has deteriorated to rank among the worst globally. The World Bank Logistics Performance Index shows South Africa declining from 20th to 39th place between 2018 and 2023. This constrains mining, agricultural, and manufacturing export competitiveness directly.",
    urgency:
      "South Africa's position as a commodity exporter makes logistics performance a first-order growth constraint. The current trajectory of deterioration, if unchecked, risks permanent market-share losses to Mozambique, Namibia, and other regional competitors.",
  },
  skills: {
    diagnosis:
      "The National Income Dynamics Study and NIDS-CRAM data consistently show that skills mismatches and poor foundation education are a primary barrier to labour absorption in the formal economy. South Africa scores among the lowest in mathematics and literacy in the PIRLS and TIMSS international assessments.",
    urgency:
      "Skills constraints compound over time: cohorts that do not acquire foundational numeracy and literacy in the early grades face permanently reduced labour-market prospects. Early intervention is essential.",
  },
  regulation: {
    diagnosis:
      "The World Bank Doing Business Index (now the Business Ready indicator) consistently identifies South Africa as having excessive regulatory burden in areas including construction permitting, business registration, and cross-border trade. BLSA's Red Tape Commission has documented over 200 regulatory obstacles to investment and growth.",
    urgency:
      "Regulatory dysfunction imposes an ongoing 'tax' on every business operating in South Africa. In a low-growth environment, this deadweight loss is particularly acute.",
  },
  crime: {
    diagnosis:
      "South Africa has one of the highest homicide rates in the world, and organised crime has captured parts of the construction, taxi, and extortion industries. Business surveys consistently rank crime as a top barrier to investment. The direct cost of crime to the economy is estimated at 6–10% of GDP annually.",
    urgency:
      "Business formation in high-crime areas is structurally suppressed. Unless crime is reduced, other economic reforms will have limited impact in the most affected communities.",
  },
  labor_market: {
    diagnosis:
      "South Africa's structural unemployment rate is approximately 32–35% (narrow definition), the highest among major economies. Rigidities in the Labour Relations Act and BCEA, combined with centralised bargaining extending to non-parties, create barriers to formal employment particularly for young, unskilled workers.",
    urgency:
      "Youth unemployment is a time-sensitive crisis: skills atrophy during prolonged unemployment spells, creating a permanent scarring effect on lifetime earnings and productivity.",
  },
  land: {
    diagnosis:
      "The combination of apartheid-era spatial legacies, slow land-administration processes, and insecure tenure constrains both agricultural productivity and urban economic density. The LSLRA property-rights environment creates investment uncertainty.",
    urgency:
      "Urban land constraints in Cape Town, Johannesburg, and other cities are a primary driver of high housing costs and long commutes, which reduce effective labour supply.",
  },
  digital: {
    diagnosis:
      "South Africa ranks 65th on the Global Innovation Index (2023), constrained by high data costs and uneven broadband access. The failure to license high-demand spectrum (700 MHz, 2600 MHz) for over a decade has suppressed investment in 4G and 5G infrastructure.",
    urgency:
      "The digital economy is the primary engine of productivity growth globally. Delay in spectrum allocation and open-access infrastructure investment compounds South Africa's competitiveness deficit.",
  },
  government_capacity: {
    diagnosis:
      "Government Auditor-General reports show persistent regression in audit outcomes across national and provincial departments. Project management deficiencies, procurement irregularities, and human-resources instability in key state-owned entities constrain delivery capacity.",
    urgency:
      "State capacity is a precondition for the successful implementation of all other reforms. Without rebuilding institutional capacity, reforms risk remaining aspirational.",
  },
  corruption: {
    diagnosis:
      "The State Capture Inquiry (2022) documented systemic corruption across SOEs, the SAPS, NPA, SARS, and other entities during 2014–2018. While recovery is underway, Transparency International's CPI shows South Africa declining from 41 to 43 (out of 100) between 2015 and 2023.",
    urgency:
      "Corruption diverts resources from public services, suppresses private investment, and erodes the social contract. Anti-corruption reforms are necessary conditions for restoring confidence in the state.",
  },
};

// ── Sub-components ──────────────────────────────────────────────────────────

function CoatOfArms() {
  return (
    <div className="flex flex-col items-center gap-1 mb-2">
      <div
        className="w-16 h-20 rounded-t-full border-2 flex flex-col items-center justify-center"
        style={{ borderColor: "#1a1a2e", backgroundColor: "#f8f8fc" }}
      >
        <div className="text-2xl">⚜</div>
        <div className="flex gap-0.5 mt-1">
          <div className="w-2 h-1 rounded-sm" style={{ backgroundColor: "#007A4D" }} />
          <div className="w-2 h-1 rounded-sm" style={{ backgroundColor: "#FFB612" }} />
          <div className="w-2 h-1 rounded-sm" style={{ backgroundColor: "#DE3831" }} />
        </div>
      </div>
      <div className="text-[8px] font-bold uppercase tracking-widest text-gray-500">RSA</div>
    </div>
  );
}

function DocSection({ number, title, children }: {
  number?: string; title: string; children: React.ReactNode;
}) {
  return (
    <section className="doc-section mb-10">
      <h2
        className="text-base font-bold uppercase tracking-wide mb-4 pb-2 border-b-2"
        style={{ color: "#1a1a2e", borderColor: "#1a1a2e" }}
      >
        {number && <span className="mr-2">{number}</span>}
        {title}
      </h2>
      {children}
    </section>
  );
}

function DocPara({ children }: { children: React.ReactNode }) {
  return <p className="text-sm leading-relaxed text-gray-800 mb-3">{children}</p>;
}

function KPIRow({ kpi, target, timeline, lead }: {
  kpi: string; target: string; timeline: string; lead: string;
}) {
  return (
    <tr>
      <td className="px-3 py-1.5 text-sm">{kpi}</td>
      <td className="px-3 py-1.5 text-sm">{target}</td>
      <td className="px-3 py-1.5 text-sm">{timeline}</td>
      <td className="px-3 py-1.5 text-sm">{lead}</td>
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function WhitePaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseInt((await params).id, 10);
  if (isNaN(id)) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Invalid idea ID.</p>
        <Link href="/documents" className="text-[#007A4D] hover:underline mt-2 inline-block">← Back to Documents</Link>
      </div>
    );
  }

  const [idea, plan, meetings, comparisons] = await Promise.all([
    fetchIdea(id),
    fetchPlan(id),
    fetchMeetings(id),
    fetchComparisons(id),
  ]);

  if (!idea) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Reform idea not found.</p>
        <Link href="/documents" className="text-[#007A4D] hover:underline mt-2 inline-block">← Back to Documents</Link>
      </div>
    );
  }

  const keyQuotes = parseArray(idea.key_quotes);
  const departments = parseArray(idea.responsible_departments);
  const deptLabel = departments.length > 0
    ? departments.join("; ")
    : (idea.responsible_department || "Responsible Department");
  const constraintLabel = CONSTRAINT_LABELS[idea.binding_constraint as keyof typeof CONSTRAINT_LABELS]
    ?? idea.binding_constraint?.replace(/_/g, " ");
  const constraintInfo = CONSTRAINT_RATIONALE[idea.binding_constraint];
  const today = new Date().toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });

  // Generate KPIs from implementation steps, or use defaults
  const kpis: Array<{ kpi: string; target: string; timeline: string; lead: string }> = [];
  if (plan && Array.isArray(plan.implementation_steps) && plan.implementation_steps.length > 0) {
    plan.implementation_steps.forEach((step, i) => {
      kpis.push({
        kpi: `Phase ${i + 1} completed: ${step.step}`,
        target: "100% completion",
        timeline: step.timeline,
        lead: step.responsible_party,
      });
    });
  } else {
    kpis.push(
      { kpi: "Reform legislation enacted", target: "Bill passed", timeline: "Year 1", lead: deptLabel },
      { kpi: "Implementation unit established", target: "Operational unit", timeline: "Year 1", lead: deptLabel },
      { kpi: "Stakeholder consultation completed", target: "All key parties consulted", timeline: "Year 1", lead: deptLabel },
      { kpi: "First annual progress review", target: "Report tabled in Parliament", timeline: "Year 2", lead: deptLabel },
    );
  }

  const printStyles = `
    @media print {
      header, footer, .no-print { display: none !important; }
      main { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
      body { background: white !important; }
      .doc-section { page-break-inside: avoid; }
      .page-break { page-break-before: always; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />

      {/* Toolbar — screen only */}
      <div className="no-print flex items-center justify-between mb-6 flex-wrap gap-3">
        <Link href="/documents" className="text-sm text-[#007A4D] hover:underline flex items-center gap-1">
          ← Back to Documents
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href={`/documents/green-paper/${id}`}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← Green Paper
          </Link>
          <Link
            href={`/documents/bill/${id}`}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Template Bill →
          </Link>
          <PrintButton label="Download as PDF" />
        </div>
      </div>

      {/* Document */}
      <article
        className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 rounded-xl"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >

        {/* Cover Page */}
        <div className="p-10 text-center border-b-4" style={{ borderColor: "#1a1a2e" }}>
          <CoatOfArms />
          <p className="text-xs font-bold uppercase tracking-widest mb-1 text-gray-700">
            Republic of South Africa
          </p>
          <p className="text-xs text-gray-500 mb-6">{deptLabel}</p>

          <div
            className="inline-block px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6"
            style={{ backgroundColor: "#1a1a2e", color: "white" }}
          >
            White Paper
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {idea.title}
          </h1>

          <p className="text-sm italic text-gray-500 mb-6">
            A definitive statement of government policy on reform addressing the{" "}
            <strong>{constraintLabel}</strong> binding constraint on South African economic growth.
          </p>

          <div
            className="inline-block px-4 py-2 rounded-lg text-xs border"
            style={{ borderColor: "#007A4D", backgroundColor: "#e6f4ed", color: "#007A4D" }}
          >
            Policy Statement · {today}
          </div>

          <div className="mt-8 grid grid-cols-4 gap-3 text-center text-xs text-gray-500 border-t pt-6" style={{ borderColor: "#e5e7eb" }}>
            <div>
              <div className="font-bold text-gray-800 text-sm capitalize">{idea.current_status?.replace(/_/g, " ")}</div>
              <div>Status</div>
            </div>
            <div>
              <div className="font-bold text-gray-800 text-sm">{idea.growth_impact_rating ?? "—"}/5</div>
              <div>Growth impact</div>
            </div>
            <div>
              <div className="font-bold text-gray-800 text-sm">{idea.feasibility_rating ?? "—"}/5</div>
              <div>Feasibility</div>
            </div>
            <div>
              <div className="font-bold text-gray-800 text-sm capitalize">
                {idea.time_horizon?.replace(/_/g, " ") ?? "TBD"}
              </div>
              <div>Time horizon</div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-2">

          {/* Foreword */}
          <DocSection title="Foreword">
            <DocPara>
              This White Paper represents the Government&apos;s definitive statement of policy
              on <em>{idea.title}</em>. It follows a consultative process informed by
              parliamentary committee deliberations spanning{" "}
              {idea.times_raised ?? 0} recorded instance{(idea.times_raised ?? 0) !== 1 ? "s" : ""} of
              discussion, international evidence, and technical analysis.
            </DocPara>
            <DocPara>
              South Africa&apos;s medium-term growth trajectory requires decisive action on
              structural binding constraints. The{" "}
              <strong>{constraintLabel}</strong> constraint addressed in this White Paper
              is among the most significant determinants of economic performance, employment
              creation, and shared prosperity.
            </DocPara>
            <DocPara>
              Government commits to implementing the policy framework set out in this White
              Paper with urgency, transparency, and accountability. Progress will be reported
              to Parliament on an annual basis.
            </DocPara>
            <div className="mt-6 text-right">
              <p className="text-sm font-semibold text-gray-700">{deptLabel}</p>
              <p className="text-xs text-gray-400">{today}</p>
            </div>
          </DocSection>

          {/* Chapter 1 */}
          <div className="page-break" />
          <DocSection number="Chapter 1" title="Policy Rationale">
            <h3 className="text-sm font-bold text-gray-800 mb-2">1.1 The Growth-Diagnostics Framework</h3>
            <DocPara>
              Government has applied the Hausmann-Rodrik-Velasco (HRV) growth-diagnostics
              framework to identify the binding constraints on South African economic growth.
              This framework directs reform effort toward the constraints that are most
              immediately binding — those where relaxation would yield the highest marginal
              returns to the economy.
            </DocPara>

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">
              1.2 The {constraintLabel} Constraint
            </h3>
            {constraintInfo ? (
              <>
                <DocPara>{constraintInfo.diagnosis}</DocPara>
                <DocPara>
                  <strong>Urgency:</strong> {constraintInfo.urgency}
                </DocPara>
              </>
            ) : (
              <DocPara>
                Analysis of parliamentary committee proceedings and national economic data
                confirms that the {constraintLabel} constraint is a significant binding
                factor on South African economic performance. Detailed diagnostic analysis
                is available in the accompanying technical annexure.
              </DocPara>
            )}

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">1.3 Why This Reform</h3>
            <DocPara>
              {idea.description || "A detailed description of this reform's rationale will be provided in the finalised White Paper. The reform has been identified through systematic analysis of parliamentary committee proceedings and aligned with national growth-diagnostics priorities."}
            </DocPara>

            {idea.feasibility_note && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">1.4 Feasibility Assessment</h3>
                <DocPara>{idea.feasibility_note}</DocPara>
              </>
            )}

            {(keyQuotes.length > 0 || idea.key_quote) && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">1.5 Parliamentary Record</h3>
                <DocPara>
                  Parliamentary committee proceedings have provided an important record of
                  expert and stakeholder opinion on this reform. The following extracts
                  are illustrative:
                </DocPara>
                {(keyQuotes.length > 0 ? keyQuotes : [idea.key_quote]).map((q, i) => (
                  <blockquote
                    key={i}
                    className="border-l-4 pl-4 italic text-gray-600 text-sm my-3"
                    style={{ borderColor: "#FFB612" }}
                  >
                    &ldquo;{q}&rdquo;
                  </blockquote>
                ))}
              </>
            )}
          </DocSection>

          {/* Chapter 2 */}
          <DocSection number="Chapter 2" title="Policy Framework">
            <h3 className="text-sm font-bold text-gray-800 mb-2">2.1 Policy Objective</h3>
            <DocPara>
              The objective of this policy is to address the {constraintLabel} binding
              constraint through <strong>{idea.title}</strong>, thereby contributing to
              South Africa&apos;s long-run growth trajectory and the National Development
              Plan&apos;s employment and inequality objectives.
            </DocPara>

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">2.2 Guiding Principles</h3>
            <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-gray-700 mb-4">
              <li><strong>Developmental effectiveness:</strong> Policy instruments shall be designed to maximise growth impact within fiscal constraints.</li>
              <li><strong>Equity:</strong> Reform benefits shall be distributed in a manner consistent with the constitutional obligation to progressively realise socioeconomic rights.</li>
              <li><strong>Institutional integrity:</strong> Implementation shall strengthen rather than bypass existing institutions of accountability.</li>
              <li><strong>Evidence-based adaptation:</strong> Policy shall be reviewed against measurable outcomes at regular intervals, with adjustments made on the basis of evidence.</li>
              <li><strong>International alignment:</strong> South Africa shall adopt international best practice where applicable, adapting it to domestic context.</li>
            </ol>

            {plan?.roadmap_summary && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">2.3 Policy Approach</h3>
                <DocPara>{plan.roadmap_summary}</DocPara>
              </>
            )}

            {comparisons.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">2.4 International Policy Models</h3>
                <DocPara>
                  Government has drawn on experience in the following peer economies in
                  designing this policy framework:
                </DocPara>
                <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-gray-700 mb-4">
                  {comparisons.map((c: any, i) => (
                    <li key={i}>
                      <strong>{c.country}</strong>
                      {c.reform_year ? ` (${c.reform_year})` : ""}: {c.outcome_summary}
                      {c.gdp_impact ? ` — GDP impact: ${c.gdp_impact}.` : "."}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </DocSection>

          {/* Chapter 3 */}
          <div className="page-break" />
          <DocSection number="Chapter 3" title="Implementation Strategy">
            {plan && Array.isArray(plan.implementation_steps) && plan.implementation_steps.length > 0 ? (
              <>
                <DocPara>
                  Government will implement this policy through a phased approach, as
                  detailed below. Each phase has defined milestones, responsible parties,
                  and timelines against which progress will be measured.
                </DocPara>
                {plan.implementation_steps.map((step, i) => (
                  <div
                    key={i}
                    className="mb-6 border rounded-lg overflow-hidden"
                    style={{ borderColor: "#e5e7eb" }}
                  >
                    <div
                      className="px-4 py-3 flex items-center gap-3"
                      style={{ backgroundColor: "#1a1a2e", color: "white" }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#FFB612", color: "#1a1a2e" }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-semibold text-sm">{step.step}</span>
                    </div>
                    <div className="px-4 py-3">
                      <DocPara>{step.description}</DocPara>
                      <div className="grid grid-cols-2 gap-4 text-xs mt-2">
                        <div>
                          <span className="font-semibold text-gray-500">Timeline: </span>
                          <span className="text-gray-700">{step.timeline}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-500">Lead: </span>
                          <span className="text-gray-700">{step.responsible_party}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <DocPara>
                  A detailed implementation roadmap will be finalised following the public
                  consultation process and will be included in the implementation plan
                  appended to the final White Paper. The indicative phases are:
                </DocPara>
                <div className="space-y-3 mb-4">
                  {[
                    { phase: "Phase 1: Preparation", desc: "Establish implementation unit, complete legislative drafting, initiate stakeholder consultation.", timeline: "Months 1–6" },
                    { phase: "Phase 2: Legislation", desc: "Table and pass enabling legislation; promulgate regulations.", timeline: "Months 6–18" },
                    { phase: "Phase 3: Implementation", desc: "Deploy operational changes, build institutional capacity, begin service delivery.", timeline: "Year 2–3" },
                    { phase: "Phase 4: Consolidation", desc: "Evaluate outcomes, address implementation gaps, scale successful interventions.", timeline: "Year 3+" },
                  ].map((p, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: "#1a1a2e", color: "white" }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{p.phase}</div>
                        <div className="text-xs text-gray-600">{p.desc}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{p.timeline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {plan?.estimated_timeline && (
              <div
                className="p-4 rounded-lg mt-4"
                style={{ backgroundColor: "#e6f4ed", border: "1px solid #007A4D" }}
              >
                <p className="text-xs font-semibold text-gray-600 mb-1">Total Implementation Timeline</p>
                <p className="text-sm text-gray-800">{plan.estimated_timeline}</p>
              </div>
            )}
          </DocSection>

          {/* Chapter 4 */}
          <DocSection number="Chapter 4" title="Institutional Arrangements">
            <h3 className="text-sm font-bold text-gray-800 mb-2">4.1 Lead Department</h3>
            <DocPara>
              Policy ownership and implementation responsibility is vested in{" "}
              <strong>{deptLabel}</strong>. This department will establish a dedicated
              implementation unit responsible for coordinating delivery across all
              relevant government entities.
            </DocPara>

            {departments.length > 1 && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">4.2 Interdepartmental Coordination</h3>
                <DocPara>
                  Given the cross-cutting nature of this reform, the following departments
                  will participate in an interdepartmental implementation committee:
                </DocPara>
                <ul className="list-disc list-outside ml-5 space-y-1 text-sm text-gray-700 mb-4">
                  {departments.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
              </>
            )}

            {plan?.required_legislation && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">4.3 Legislative Framework</h3>
                <DocPara>{plan.required_legislation}</DocPara>
              </>
            )}

            {plan?.draft_legislation_notes && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">4.4 Legislative Drafting Notes</h3>
                <DocPara>{plan.draft_legislation_notes}</DocPara>
              </>
            )}

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">
              {plan?.required_legislation ? "4.5" : "4.3"} Oversight and Accountability
            </h3>
            <DocPara>
              Progress on implementation will be subject to parliamentary oversight by the{" "}
              {idea.source_committee ?? "relevant Portfolio Committee"}. An annual
              implementation report will be tabled in Parliament. The Auditor-General will
              include implementation performance in regular audit cycles.
            </DocPara>
          </DocSection>

          {/* Chapter 5 */}
          <div className="page-break" />
          <DocSection number="Chapter 5" title="Financial Implications">
            <h3 className="text-sm font-bold text-gray-800 mb-2">5.1 Implementation Costs</h3>
            {plan?.estimated_cost ? (
              <DocPara>{plan.estimated_cost}</DocPara>
            ) : (
              <DocPara>
                Detailed cost estimates are subject to further technical analysis. Provisional
                allocations will be included in the forthcoming Medium Term Expenditure Framework
                (MTEF) submission.
              </DocPara>
            )}

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">5.2 Growth Impact Projections</h3>
            <DocPara>
              This reform has been assessed at a growth impact rating of{" "}
              <strong>{idea.growth_impact_rating}/5</strong> on the standardised SA Policy Space
              impact scale.
              {idea.growth_impact_pct != null && (
                <> Quantitative modelling estimates a potential GDP contribution of{" "}
                  <strong>+{idea.growth_impact_pct.toFixed(1)}% of GDP</strong> under full
                  implementation.</>
              )}
            </DocPara>

            {idea.fiscal_impact_zar_bn != null && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">5.3 Fiscal Impact</h3>
                <DocPara>
                  The net fiscal impact of this reform is estimated at{" "}
                  <strong>
                    R{Math.abs(idea.fiscal_impact_zar_bn).toFixed(1)} billion{" "}
                    {idea.fiscal_impact_zar_bn < 0 ? "(cost to the fiscus)" : "(saving to the fiscus)"}
                  </strong>
                  . Detailed fiscal modelling will be published as a technical annexure.
                </DocPara>
              </>
            )}

            {comparisons.some((c: any) => c.gdp_impact) && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">5.4 International Benchmarks</h3>
                <DocPara>
                  International evidence from comparable reform programmes suggests the
                  following economic outcomes:
                </DocPara>
                <table className="w-full text-xs border-collapse mb-4">
                  <thead>
                    <tr style={{ backgroundColor: "#1a1a2e", color: "white" }}>
                      <th className="text-left px-3 py-2">Country</th>
                      <th className="text-left px-3 py-2">GDP Impact</th>
                      <th className="text-left px-3 py-2">Timeline to Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.filter((c: any) => c.gdp_impact).map((c: any, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9fafb" : "white" }}>
                        <td className="px-3 py-1.5 font-medium">{c.country}</td>
                        <td className="px-3 py-1.5">{c.gdp_impact}</td>
                        <td className="px-3 py-1.5">{c.timeline ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </DocSection>

          {/* Chapter 6 */}
          <DocSection number="Chapter 6" title="Monitoring and Evaluation">
            <h3 className="text-sm font-bold text-gray-800 mb-2">6.1 Performance Indicators</h3>
            <DocPara>
              The following key performance indicators (KPIs) will be used to measure
              implementation progress and policy outcomes:
            </DocPara>
            <table className="w-full text-xs border-collapse mb-4">
              <thead>
                <tr style={{ backgroundColor: "#1a1a2e", color: "white" }}>
                  <th className="text-left px-3 py-2">KPI</th>
                  <th className="text-left px-3 py-2">Target</th>
                  <th className="text-left px-3 py-2">Timeline</th>
                  <th className="text-left px-3 py-2">Lead</th>
                </tr>
              </thead>
              <tbody>
                {kpis.map((kpi, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#f9fafb" : "white" }}>
                    <KPIRow {...kpi} />
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">6.2 Reporting</h3>
            <DocPara>
              An annual implementation report will be submitted to Parliament no later than
              31 October each year. The report will include progress against all KPIs,
              explanation of variances, and updated projections for the remaining
              implementation period.
            </DocPara>

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">6.3 Evaluation Schedule</h3>
            <DocPara>
              A mid-term evaluation will be conducted at the midpoint of the implementation
              period, and a summative evaluation will be conducted within 12 months of
              the expected implementation completion date. Evaluation findings will be
              made publicly available.
            </DocPara>

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">6.4 Success Criteria</h3>
            <DocPara>
              This reform will be considered successfully implemented when:
            </DocPara>
            <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-gray-700 mb-4">
              <li>All legislative and regulatory requirements have been enacted and promulgated.</li>
              <li>The institutional arrangements specified in Chapter 4 are fully operational.</li>
              <li>Baseline data collection has been completed and progress reporting is in place.</li>
              <li>Measurable improvement in the {constraintLabel} constraint indicators can be demonstrated.</li>
            </ol>
          </DocSection>

          {/* Footer */}
          <div
            className="border-t pt-6 mt-8 text-xs text-gray-400 text-center"
            style={{ borderColor: "#e5e7eb" }}
          >
            <p>
              Generated from SA Policy Space · Reform Idea #{idea.id} ·{" "}
              <Link href={`/ideas/${idea.slug}`} className="no-print text-[#007A4D] hover:underline">
                View full record
              </Link>
            </p>
            <p className="mt-1">
              SA Policy Space is independent research. Source data via the Parliamentary Monitoring Group (pmg.org.za).
            </p>
          </div>

        </div>
      </article>
    </>
  );
}
