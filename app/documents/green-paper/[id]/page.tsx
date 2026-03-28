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
  const description = `Green Paper consultation document for ${idea.title}. ${(idea.description ?? "").slice(0, 120)}`;
  return {
    title: `Green Paper: ${idea.title}`,
    description,
    alternates: { canonical: `https://sa-policy-space.vercel.app/documents/green-paper/${id}` },
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
  if (!iso) return "Not recorded";
  return new Date(iso).toLocaleDateString("en-ZA", { month: "long", year: "numeric" });
}

function parseArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") { try { return JSON.parse(v); } catch { return []; } }
  return [];
}

function ratingStars(n: number, max = 5): string {
  return "★".repeat(n) + "☆".repeat(max - n);
}

const CONSTRAINT_CONTEXT: Record<string, string> = {
  energy:
    "Inadequate and unreliable electricity supply remains one of the most binding constraints on South African economic output. Load-shedding reduces manufacturing capacity utilisation, raises costs for small businesses, and deters inward investment. The National Energy Regulator of South Africa (NERSA) and Eskom's structural reform trajectory are central to resolving this constraint.",
  logistics:
    "South Africa's logistics network — dominated by Transnet Freight Rail and the Durban, Cape Town and Richards Bay ports — has seen sustained deterioration in throughput and reliability. High logistics costs erode export competitiveness and inflate consumer prices. Structural reform of port operations and rail infrastructure is essential to unlocking supply-chain efficiency.",
  skills:
    "A persistent mismatch between the qualifications produced by the education and training system and the skills demanded by the productive economy constrains both labour absorption and firm-level productivity. The Technical and Vocational Education and Training (TVET) sector, scarce-skills immigration policy, and the National Qualifications Framework are key levers for reform.",
  regulation:
    "Regulatory uncertainty, excessive compliance burdens, and slow administrative processes increase the cost of doing business and suppress investment. Regulatory impact assessments, red-tape reduction initiatives, and reforms to licensing regimes offer significant scope for productivity improvement.",
  crime:
    "High rates of violent crime, property crime, and organised criminality impose direct costs on businesses and households, distort investment location decisions, and undermine social capital. Reforms to the SAPS, the National Prosecuting Authority, and private-public crime-prevention partnerships are central to this constraint.",
  labor_market:
    "Rigid and centralised wage-setting mechanisms, high costs of employment, and structural mismatches between labour demand and supply contribute to South Africa's chronically elevated unemployment rate. Reforms to the Labour Relations Act, the Basic Conditions of Employment Act, and sectoral determinations are contested but potentially high-impact.",
  land:
    "Insecure and inequitably distributed land tenure, slow land-administration processes, and limitations on tradeable property rights constrain agricultural productivity, urban densification, and household wealth accumulation. Land reform, cadastral modernisation, and spatial planning are key policy arenas.",
  digital:
    "Insufficient broadband connectivity, high data costs, and uneven digital adoption limit participation in the digital economy. Spectrum allocation policy, open-access infrastructure models, and digital public goods are critical enablers of a modern, inclusive economy.",
  government_capacity:
    "Weak state capacity — manifested in poor project management, procurement dysfunction, and human-resources constraints in key departments and entities — limits the state's ability to implement reforms effectively. Public-service reform, professionalisation of the senior management service, and consequence management are necessary complements to legislative change.",
  corruption:
    "Corruption diverts public resources, distorts incentives, and erodes public trust in institutions. Strengthening the National Prosecuting Authority, improving asset-disclosure frameworks, reforming procurement legislation, and building a culture of accountability are prerequisites for durable reform.",
};

function getPublicCommentQuestions(idea: PolicyIdea, plan: ImplementationPlan | null): string[] {
  const constraint = idea.binding_constraint;
  const questions: string[] = [
    `Is the problem diagnosis in this Green Paper an accurate characterisation of the ${
      CONSTRAINT_LABELS[constraint as keyof typeof CONSTRAINT_LABELS] ?? constraint
    } constraint? What material factors have been omitted?`,
    `Which of the policy options presented in Chapter 3 offers the most favourable combination of impact and political feasibility? Please motivate your view with reference to evidence where possible.`,
    `What risks to implementation have not been adequately addressed in this document? How should government mitigate them?`,
    `What is the appropriate balance between national regulatory standards and provincial/local government autonomy in implementing this reform?`,
    `Which stakeholder groups are most likely to be adversely affected by this reform, and what transitional or compensatory measures should be considered?`,
  ];

  if (plan?.required_legislation) {
    questions.push(
      `This reform appears to require legislative amendments. What is the preferred legislative vehicle — a standalone Act, an amendment Bill, or secondary regulation — and why?`
    );
  }

  if (idea.reform_package) {
    questions.push(
      `To what extent should implementation of this reform be sequenced with or conditioned on progress in related reforms within the same policy package? Please provide your sequencing recommendation.`
    );
  }

  return questions;
}

// ── Sub-components ──────────────────────────────────────────────────────────

function CoatOfArms() {
  return (
    <div className="flex flex-col items-center gap-1 mb-2">
      <div
        className="w-16 h-20 rounded-t-full border-2 flex flex-col items-center justify-center"
        style={{ borderColor: "#007A4D", backgroundColor: "#f9fdf9" }}
      >
        <div className="text-2xl">⚜</div>
        <div className="flex gap-0.5 mt-1">
          <div className="w-2 h-1 rounded-sm" style={{ backgroundColor: "#007A4D" }} />
          <div className="w-2 h-1 rounded-sm" style={{ backgroundColor: "#FFB612" }} />
          <div className="w-2 h-1 rounded-sm" style={{ backgroundColor: "#DE3831" }} />
        </div>
      </div>
      <div
        className="text-[8px] font-bold uppercase tracking-widest"
        style={{ color: "#007A4D" }}
      >
        RSA
      </div>
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
        style={{ color: "#007A4D", borderColor: "#007A4D" }}
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

// ── Page ──────────────────────────────────────────────────────────────────

export default async function GreenPaperPage({
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
  const constraintContext = CONSTRAINT_CONTEXT[idea.binding_constraint] ?? "";
  const questions = getPublicCommentQuestions(idea, plan);
  const today = new Date().toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });

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
            href={`/documents/white-paper/${id}`}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            White Paper →
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
        <div
          className="p-10 text-center border-b-4"
          style={{ borderColor: "#007A4D" }}
        >
          <CoatOfArms />
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "#007A4D" }}
          >
            Republic of South Africa
          </p>
          <p className="text-xs text-gray-500 mb-6">{deptLabel}</p>

          <div
            className="inline-block px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6"
            style={{ backgroundColor: "#007A4D", color: "white" }}
          >
            Green Paper
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
            {idea.title}
          </h1>

          <p className="text-sm italic text-gray-500 mb-6">
            A discussion document for public comment on proposed policy reform
            addressing the <strong>{constraintLabel}</strong> binding constraint
            on South African economic growth.
          </p>

          <div
            className="inline-block px-4 py-2 rounded-lg text-xs border"
            style={{ borderColor: "#FFB612", backgroundColor: "#fffbeb", color: "#92600a" }}
          >
            For public comment · {today}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-gray-500 border-t pt-6" style={{ borderColor: "#e5e7eb" }}>
            <div>
              <div className="font-bold text-gray-800 text-sm">{idea.times_raised ?? "—"}×</div>
              <div>Raised in committee</div>
            </div>
            <div>
              <div className="font-bold text-gray-800 text-sm">
                {idea.growth_impact_rating != null ? ratingStars(idea.growth_impact_rating) : "—"}
              </div>
              <div>Growth impact</div>
            </div>
            <div>
              <div className="font-bold text-gray-800 text-sm">{idea.current_status?.replace(/_/g, " ") ?? "—"}</div>
              <div>Current status</div>
            </div>
          </div>
        </div>

        <div className="p-10 space-y-2">

          {/* Executive Summary */}
          <DocSection title="Executive Summary">
            <DocPara>
              This Green Paper presents a consultative discussion of proposed policy reform in respect of{" "}
              <em>{idea.title}</em>. The reform addresses the{" "}
              <strong>{constraintLabel}</strong> binding constraint on South African
              economic growth, as identified through the application of the Hausmann-Rodrik-Velasco
              (HRV) growth-diagnostics framework to analysis of{" "}
              {meetings.length > 0 ? `${meetings.length} Parliamentary committee meetings` : "parliamentary committee proceedings"}.
            </DocPara>
            <DocPara>
              {idea.description || "A detailed description of this reform proposal will be provided upon full enrichment of the policy database."}
            </DocPara>
            {(idea.growth_impact_pct != null || idea.fiscal_impact_zar_bn != null) && (
              <DocPara>
                Preliminary economic analysis suggests a potential growth impact of{" "}
                {idea.growth_impact_pct != null
                  ? `+${idea.growth_impact_pct.toFixed(1)}% of GDP`
                  : `${idea.growth_impact_rating ?? "—"}/5 on a standardised impact scale`}
                {idea.fiscal_impact_zar_bn != null
                  ? ` and a fiscal impact of R${Math.abs(idea.fiscal_impact_zar_bn).toFixed(1)} billion`
                  : ""}
                . Full quantitative modelling is presented in Chapter 4.
              </DocPara>
            )}
            <DocPara>
              The Government invites comment from all interested parties on the policy
              questions set out in Chapter 5 of this document. Submissions should be directed
              to {deptLabel} by the closing date indicated on the cover.
            </DocPara>
          </DocSection>

          {/* Chapter 1 */}
          <div className="page-break" />
          <DocSection number="Chapter 1" title="Background and Context">
            <DocPara>
              South Africa&apos;s long-run economic growth performance has been constrained by a
              set of structural binding constraints identified through systematic application of
              growth-diagnostics methodology. This chapter situates the proposed reform within
              the broader constraint landscape.
            </DocPara>

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">1.1 The Binding Constraint: {constraintLabel}</h3>
            {constraintContext && <DocPara>{constraintContext}</DocPara>}

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">1.2 The Reform Proposal</h3>
            <DocPara>
              {idea.description || "This reform proposal emerged from systematic analysis of parliamentary committee deliberations. Full descriptive content will be added as the policy database is enriched."}
            </DocPara>

            {idea.theme && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">1.3 Thematic Context</h3>
                <DocPara>
                  This reform sits within the thematic area of <strong>{idea.theme}</strong>,
                  which encompasses related policy reforms addressing complementary dimensions
                  of the {constraintLabel} constraint.
                </DocPara>
              </>
            )}

            {(keyQuotes.length > 0 || idea.key_quote) && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">1.4 Parliamentary Record</h3>
                <DocPara>
                  This reform has been raised in parliamentary committee proceedings on{" "}
                  {idea.times_raised ?? 0} occasion{(idea.times_raised ?? 0) !== 1 ? "s" : ""}.
                  The following extract from committee proceedings illustrates the nature of
                  the policy discussion:
                </DocPara>
                {keyQuotes.length > 0 ? (
                  keyQuotes.map((q, i) => (
                    <blockquote
                      key={i}
                      className="border-l-4 pl-4 italic text-gray-600 text-sm my-3"
                      style={{ borderColor: "#FFB612" }}
                    >
                      &ldquo;{q}&rdquo;
                    </blockquote>
                  ))
                ) : (
                  <blockquote
                    className="border-l-4 pl-4 italic text-gray-600 text-sm my-3"
                    style={{ borderColor: "#FFB612" }}
                  >
                    &ldquo;{idea.key_quote}&rdquo;
                  </blockquote>
                )}
              </>
            )}

            {idea.feasibility_note && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">1.5 Feasibility Assessment</h3>
                <DocPara>{idea.feasibility_note}</DocPara>
              </>
            )}
          </DocSection>

          {/* Chapter 2 */}
          <DocSection number="Chapter 2" title="Current Policy Landscape">
            <h3 className="text-sm font-bold text-gray-800 mb-2">2.1 Current Reform Status</h3>
            <DocPara>
              This reform is currently at the <strong>{idea.current_status?.replace(/_/g, " ")}</strong> stage.
              {idea.first_raised && (
                <> It was first raised in parliamentary committee proceedings in{" "}
                  <strong>{fmtMonthYear(idea.first_raised)}</strong>
                  {idea.last_discussed && idea.last_discussed !== idea.first_raised
                    ? ` and was most recently discussed in ${fmtMonthYear(idea.last_discussed)}`
                    : ""}
                  .</>
              )}
            </DocPara>

            {idea.source_committee && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">2.2 Lead Parliamentary Committee</h3>
                <DocPara>
                  The lead parliamentary committee on this matter is the{" "}
                  <strong>{idea.source_committee}</strong>. Committee deliberations have provided
                  the primary parliamentary record informing this Green Paper.
                </DocPara>
              </>
            )}

            {idea.responsible_department && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">2.3 Responsible Department</h3>
                <DocPara>
                  Primary policy responsibility for this reform rests with{" "}
                  <strong>{deptLabel}</strong>.
                  {departments.length > 1
                    ? " Given the cross-cutting nature of this reform, interdepartmental coordination will be required."
                    : ""}
                </DocPara>
              </>
            )}

            {meetings.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">2.4 Parliamentary Discussion History</h3>
                <DocPara>
                  The following table sets out the parliamentary meetings at which this
                  reform was discussed, in reverse chronological order:
                </DocPara>
                <table className="w-full text-xs border-collapse mb-4">
                  <thead>
                    <tr style={{ backgroundColor: "#007A4D", color: "white" }}>
                      <th className="text-left px-3 py-2">Date</th>
                      <th className="text-left px-3 py-2">Committee</th>
                      <th className="text-left px-3 py-2">Meeting Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meetings.slice(0, 10).map((m: any, i) => (
                      <tr
                        key={m.id}
                        style={{ backgroundColor: i % 2 === 0 ? "#f9fafb" : "white" }}
                      >
                        <td className="px-3 py-1.5 whitespace-nowrap">{fmtDate(m.date)}</td>
                        <td className="px-3 py-1.5">{m.committee_name}</td>
                        <td className="px-3 py-1.5">{m.title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {meetings.length > 10 && (
                  <DocPara>
                    <em>{meetings.length - 10} additional meetings not shown. Full record available via the Parliamentary Monitoring Group.</em>
                  </DocPara>
                )}
              </>
            )}
          </DocSection>

          {/* Chapter 3 */}
          <div className="page-break" />
          <DocSection number="Chapter 3" title="Policy Options and Analysis">
            <DocPara>
              This chapter presents the principal policy options available to government in
              addressing the {constraintLabel} constraint through{" "}
              {idea.title.toLowerCase()}. Options are evaluated against the criteria of
              impact, feasibility, cost, and implementation timeline.
            </DocPara>

            {plan && Array.isArray(plan.implementation_steps) && plan.implementation_steps.length > 0 ? (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">3.1 Preferred Policy Option: Phased Implementation Approach</h3>
                <DocPara>
                  Based on technical analysis, the following phased implementation
                  approach is presented as the preferred option for public comment:
                </DocPara>
                {plan.implementation_steps.map((step, i) => (
                  <div key={i} className="mb-4 pl-4 border-l-2" style={{ borderColor: "#007A4D" }}>
                    <div className="text-sm font-bold text-gray-800">
                      Phase {i + 1}: {step.step}
                    </div>
                    <DocPara>{step.description}</DocPara>
                    <div className="flex gap-6 text-xs text-gray-500">
                      <span><strong>Timeline:</strong> {step.timeline}</span>
                      <span><strong>Lead:</strong> {step.responsible_party}</span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">3.1 Policy Options Under Consideration</h3>
                <DocPara>
                  Government is considering a range of policy instruments to address this
                  reform area. A detailed implementation plan is under development and will
                  be included in the White Paper following the public comment process.
                </DocPara>
                <DocPara>
                  Based on analysis of parliamentary proceedings, the following broad
                  approaches have been discussed:
                </DocPara>
                <ol className="list-decimal list-outside ml-5 space-y-2 text-sm text-gray-700 mb-4">
                  <li>Legislative amendment to remove identified regulatory barriers</li>
                  <li>Institutional restructuring to clarify mandates and improve coordination</li>
                  <li>Market-oriented instruments to align incentives with policy objectives</li>
                  <li>Capacity-building and technical-assistance programmes</li>
                </ol>
              </>
            )}

            {plan?.political_feasibility_notes && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">3.2 Political Economy Considerations</h3>
                <DocPara>{plan.political_feasibility_notes}</DocPara>
              </>
            )}

            {plan?.required_legislation && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">3.3 Legislative Requirements</h3>
                <DocPara>{plan.required_legislation}</DocPara>
              </>
            )}

            {plan?.international_precedents && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">3.4 International Precedents</h3>
                <DocPara>{plan.international_precedents}</DocPara>
              </>
            )}

            {plan?.estimated_timeline && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">3.5 Implementation Timeline</h3>
                <DocPara>
                  <strong>Estimated implementation timeline:</strong> {plan.estimated_timeline}
                </DocPara>
              </>
            )}
          </DocSection>

          {/* Chapter 4 */}
          <DocSection number="Chapter 4" title="Expected Economic Impact">
            <h3 className="text-sm font-bold text-gray-800 mb-2">4.1 Growth Impact Assessment</h3>
            <DocPara>
              This reform has been assessed at a growth impact rating of{" "}
              <strong>{idea.growth_impact_rating ?? "—"}/5</strong>{" "}
              {idea.growth_impact_rating != null && <>({ratingStars(idea.growth_impact_rating)})</>}{" "}
              on the standardised SA Policy Space impact scale, and a feasibility rating of{" "}
              <strong>{idea.feasibility_rating ?? "—"}/5</strong>{" "}
              {idea.feasibility_rating != null && <>({ratingStars(idea.feasibility_rating)})</>}.
            </DocPara>

            {idea.growth_impact_pct != null && (
              <DocPara>
                Quantitative modelling estimates a potential GDP impact of{" "}
                <strong>+{idea.growth_impact_pct.toFixed(1)}%</strong> under full
                implementation, based on comparable international reform programmes.
              </DocPara>
            )}

            {idea.fiscal_impact_zar_bn != null && (
              <DocPara>
                The estimated fiscal impact is{" "}
                <strong>
                  R{Math.abs(idea.fiscal_impact_zar_bn).toFixed(1)} billion
                  {idea.fiscal_impact_zar_bn < 0 ? " (cost to the fiscus)" : " (saving to the fiscus)"}
                </strong>
                . Detailed fiscal modelling will be included in the White Paper.
              </DocPara>
            )}

            {plan?.estimated_cost && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">4.2 Estimated Implementation Cost</h3>
                <DocPara>{plan.estimated_cost}</DocPara>
              </>
            )}

            {comparisons.length > 0 && (
              <>
                <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">4.3 International Evidence on Economic Impact</h3>
                <DocPara>
                  The following table summarises GDP impact estimates from comparable
                  reform programmes in peer economies:
                </DocPara>
                <table className="w-full text-xs border-collapse mb-4">
                  <thead>
                    <tr style={{ backgroundColor: "#007A4D", color: "white" }}>
                      <th className="text-left px-3 py-2">Country</th>
                      <th className="text-left px-3 py-2">Year</th>
                      <th className="text-left px-3 py-2">GDP Impact</th>
                      <th className="text-left px-3 py-2">Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((c: any, i) => (
                      <tr
                        key={c.id ?? i}
                        style={{ backgroundColor: i % 2 === 0 ? "#f9fafb" : "white" }}
                      >
                        <td className="px-3 py-1.5 font-medium">{c.country}</td>
                        <td className="px-3 py-1.5">{c.reform_year ?? "—"}</td>
                        <td className="px-3 py-1.5">{c.gdp_impact ?? "Not quantified"}</td>
                        <td className="px-3 py-1.5">{c.timeline ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <h3 className="text-sm font-bold text-gray-800 mb-2 mt-4">4.4 Time Horizon</h3>
            <DocPara>
              This reform has been classified as a{" "}
              <strong>
                {idea.time_horizon === "quick_win"
                  ? "short-term quick win (0–12 months)"
                  : idea.time_horizon === "medium_term"
                  ? "medium-term reform (1–3 years)"
                  : idea.time_horizon === "long_term"
                  ? "long-term structural reform (3+ years)"
                  : "reform of unclassified time horizon"}
              </strong>
              . Impact projections should be interpreted accordingly.
            </DocPara>
          </DocSection>

          {/* Chapter 5 */}
          <div className="page-break" />
          <DocSection number="Chapter 5" title="Questions for Public Comment">
            <DocPara>
              Government invites written comment from all interested and affected parties
              on the following questions. Respondents need not address all questions and
              may raise additional matters not covered below. All substantive submissions
              will be acknowledged and considered in the preparation of the White Paper.
            </DocPara>
            <ol className="list-decimal list-outside ml-5 space-y-4 text-sm text-gray-700">
              {questions.map((q, i) => (
                <li key={i} className="leading-relaxed">
                  {q}
                </li>
              ))}
            </ol>

            <div
              className="mt-6 p-4 rounded-lg border"
              style={{ backgroundColor: "#f0faf4", borderColor: "#007A4D" }}
            >
              <p className="text-xs font-semibold text-gray-600 mb-1">How to Submit</p>
              <p className="text-xs text-gray-600">
                Submissions should be addressed to {deptLabel} and may be submitted
                by post, email, or through the relevant departmental online portal.
                Please indicate &ldquo;Green Paper: {idea.title} — Public Comment&rdquo;
                as the reference.
              </p>
            </div>
          </DocSection>

          {/* Appendix */}
          {comparisons.length > 0 && (
            <>
              <div className="page-break" />
              <DocSection title="Appendix A: International Case Studies">
                <DocPara>
                  This appendix provides detailed summaries of comparable reform programmes
                  implemented in peer economies, drawing on publicly available evidence to
                  inform the South African policy debate.
                </DocPara>
                {comparisons.map((c: any, i) => (
                  <div
                    key={c.id ?? i}
                    className="mb-6 p-4 rounded-lg border"
                    style={{ borderColor: "#e5e7eb", backgroundColor: "#fafafa" }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm">{c.country}</span>
                      {c.reform_year && (
                        <span className="text-xs text-gray-400">({c.reform_year})</span>
                      )}
                      {c.gdp_impact && (
                        <span
                          className="ml-auto text-xs font-semibold rounded-full px-2 py-0.5"
                          style={{ backgroundColor: "#e6f4ed", color: "#007A4D" }}
                        >
                          {c.gdp_impact} GDP impact
                        </span>
                      )}
                    </div>
                    <DocPara>{c.outcome_summary}</DocPara>
                    {c.approach && (
                      <>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Approach</p>
                        <DocPara>{c.approach}</DocPara>
                      </>
                    )}
                    {c.timeline && (
                      <p className="text-xs text-gray-500 mb-2">
                        <strong>Timeline:</strong> {c.timeline}
                      </p>
                    )}
                    {c.lessons_for_sa && (
                      <div
                        className="p-3 rounded"
                        style={{ backgroundColor: "#fffbeb", borderLeft: "3px solid #FFB612" }}
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#92600a" }}>
                          Lessons for South Africa
                        </p>
                        <p className="text-xs text-gray-700">{c.lessons_for_sa}</p>
                      </div>
                    )}
                    {(c.sources?.length || c.source_label) && (
                      <div className="mt-2 text-xs text-gray-400">
                        {c.sources?.length
                          ? c.sources.map((s: string, si: number) => <div key={si}>Source: {s}</div>)
                          : <div>Source: {c.source_label}</div>
                        }
                      </div>
                    )}
                  </div>
                ))}
              </DocSection>
            </>
          )}

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
