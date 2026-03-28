export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import PrintButton from "@/components/PrintButton";
import { CONSTRAINT_LABELS } from "@/lib/supabase";
import type { PolicyIdea, ImplementationPlan } from "@/lib/supabase";

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

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = Number((await params).id);
  const idea = await fetchIdea(id);
  if (!idea) return {};
  const description = `Draft legislative bill for ${idea.title}. ${(idea.description ?? "").slice(0, 120)}`;
  return {
    title: `Bill: ${idea.title}`,
    description,
    alternates: { canonical: `https://sa-policy-space.vercel.app/documents/bill/${id}` },
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function parseArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v as string[];
  if (typeof v === "string") { try { return JSON.parse(v); } catch { return []; } }
  return [];
}

/** Convert idea title to an Act name, e.g. "Electricity Amendment Act, 2025" */
function toActTitle(title: string): string {
  const year = new Date().getFullYear();
  // Capitalise each major word
  const cleaned = title
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
  return `${cleaned} Act, ${year}`;
}

/** Convert Act name to short bill reference, e.g. "B 12—2025" */
function toBillRef(id: number): string {
  return `B ${id}—${new Date().getFullYear()}`;
}

const CONSTRAINT_PREAMBLE: Record<string, string[]> = {
  energy: [
    "the Constitution of the Republic of South Africa, 1996, provides in section 27 that everyone has the right to have access to social security and in section 22 that every citizen has the right to choose their trade, occupation or profession freely;",
    "section 154(1) of the Constitution requires national government to support and strengthen the capacity of municipalities to manage their own affairs and to perform their functions;",
    "load-shedding and inadequate electricity supply have materially impaired economic activity, household welfare, and the delivery of essential services across the Republic;",
    "the National Development Plan identifies reliable and affordable energy supply as foundational to achieving South Africa&apos;s long-term growth and development objectives;",
    "it is necessary to reform the legal framework governing electricity generation, transmission, and distribution in order to attract private investment, improve system reliability, and promote access to affordable energy;",
  ],
  logistics: [
    "the National Development Plan identifies an efficient, integrated logistics system as essential to South Africa&apos;s export competitiveness and long-run economic growth;",
    "the deterioration of rail freight capacity and port performance has significantly increased logistics costs for South African producers and exporters;",
    "private sector participation in logistics infrastructure is necessary to supplement public investment and restore system performance to internationally competitive standards;",
    "transparency, non-discriminatory access, and effective regulation of logistics infrastructure are prerequisites for a competitive and inclusive logistics sector;",
  ],
  skills: [
    "the Constitution of the Republic of South Africa, 1996, provides in section 29 that everyone has the right to a basic education and to further education;",
    "persistent skills mismatches between the education and training system and the demands of the productive economy constrain both labour absorption and productivity growth;",
    "reform of the skills development, vocational training, and qualification-recognition frameworks is necessary to improve human capital formation and labour-market outcomes;",
  ],
  regulation: [
    "the Constitution of the Republic of South Africa, 1996, provides in section 22 that every citizen has the right to choose their trade, occupation or profession freely;",
    "excessive, duplicative, and uncertain regulatory requirements impose significant costs on businesses and citizens and suppress economic activity;",
    "a systematic approach to regulatory reform, impact assessment, and burden reduction is required to create an enabling environment for investment, entrepreneurship, and growth;",
  ],
  crime: [
    "the Constitution of the Republic of South Africa, 1996, provides in section 12 that everyone has the right to freedom and security of the person;",
    "high rates of violent crime and organised criminality impose direct costs on businesses and households and suppress economic activity and investment;",
    "it is necessary to strengthen the criminal justice system, improve policing effectiveness, and address the root causes of criminality;",
  ],
  labor_market: [
    "the Constitution of the Republic of South Africa, 1996, provides in section 23 that everyone has the right to fair labour practices;",
    "South Africa&apos;s chronically elevated unemployment rate — particularly among youth — constitutes a national development emergency;",
    "reforms to labour market regulation are necessary to reduce the cost of formal employment, increase labour absorption, and address structural unemployment;",
  ],
  land: [
    "section 25 of the Constitution of the Republic of South Africa, 1996, requires the state to take reasonable legislative and other measures to foster conditions enabling citizens to gain access to land on an equitable basis;",
    "insecure land tenure, slow land-administration processes, and inequitable land distribution constrain agricultural productivity and economic inclusion;",
    "land reform, cadastral modernisation, and improved security of tenure are necessary to achieve equitable and productive land use;",
  ],
  digital: [
    "the National Development Plan identifies digital infrastructure as an essential enabler of economic growth, service delivery, and social inclusion;",
    "high data costs and uneven broadband access constrain South Africa&apos;s participation in the digital economy and suppress productivity growth;",
    "effective spectrum management, open-access infrastructure models, and digital public goods investment are required to create an inclusive and competitive digital economy;",
  ],
  government_capacity: [
    "effective and capable government institutions are a prerequisite for the successful implementation of all development objectives;",
    "persistent weaknesses in state capacity, project management, and public administration constrain service delivery and economic performance;",
    "systemic reform of the public service, professionalisation of government, and consequence management are required to rebuild institutional effectiveness;",
  ],
  corruption: [
    "the Constitution of the Republic of South Africa, 1996, imposes obligations of accountability, transparency, and responsible financial management on all organs of state;",
    "corruption diverts public resources, distorts incentives, and erodes public trust in the institutions of democracy;",
    "strengthening anti-corruption frameworks, improving asset disclosure, reforming procurement systems, and building a culture of accountability are essential to sustainable development;",
  ],
};

// ── Sub-components ──────────────────────────────────────────────────────────

function BillSection({ number, heading, children }: {
  number: string; heading: string; children: React.ReactNode;
}) {
  return (
    <section className="doc-section mb-8">
      <h2
        className="text-sm font-bold uppercase tracking-wide mb-3"
        style={{ color: "#8B0000" }}
      >
        {number}. {heading}
      </h2>
      {children}
    </section>
  );
}

function BillClause({ number, heading, children }: {
  number: string; heading?: string; children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="flex gap-3">
        <span className="text-sm font-bold text-gray-700 flex-shrink-0 w-8">{number}.</span>
        <div>
          {heading && (
            <span className="text-sm font-semibold text-gray-800">{heading} — </span>
          )}
          <span className="text-sm text-gray-700 leading-relaxed">{children}</span>
        </div>
      </div>
    </div>
  );
}

function SubClause({ letter, children }: { letter: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 ml-11 mb-2">
      <span className="text-sm text-gray-600 flex-shrink-0">({letter})</span>
      <span className="text-sm text-gray-700 leading-relaxed">{children}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function BillPage({
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

  const [idea, plan] = await Promise.all([
    fetchIdea(id),
    fetchPlan(id),
  ]);

  if (!idea) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p>Reform idea not found.</p>
        <Link href="/documents" className="text-[#007A4D] hover:underline mt-2 inline-block">← Back to Documents</Link>
      </div>
    );
  }

  const departments = parseArray(idea.responsible_departments);
  const deptLabel = departments.length > 0
    ? departments[0]
    : (idea.responsible_department || "the responsible Minister");
  const actTitle = toActTitle(idea.title);
  const billRef = toBillRef(id);
  const constraintLabel = CONSTRAINT_LABELS[idea.binding_constraint as keyof typeof CONSTRAINT_LABELS]
    ?? idea.binding_constraint?.replace(/_/g, " ");
  const preambleClauses = CONSTRAINT_PREAMBLE[idea.binding_constraint] ?? [
    "the Constitution of the Republic of South Africa, 1996, establishes the foundational values of human dignity, equality, and freedom;",
    "it is necessary to enact legislation to address identified policy constraints on economic growth and social development;",
  ];
  const today = new Date().toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });
  const year = new Date().getFullYear();

  // Derive objects of Act from implementation steps
  const objects: string[] = [];
  if (plan && Array.isArray(plan.implementation_steps) && plan.implementation_steps.length > 0) {
    plan.implementation_steps.slice(0, 5).forEach((step) => {
      // step.step is a sequence number (1,2,3…); use step.description for the text
      const text = String(step.description || "").trim();
      if (text) objects.push(`to ${text.charAt(0).toLowerCase() + text.slice(1)}`);
    });
  } else {
    objects.push(
      `to establish a legal framework for the implementation of ${idea.title}`,
      `to designate ${deptLabel} as the responsible authority for administration of this Act`,
      `to make provision for the making of regulations`,
      `to provide for transitional arrangements`
    );
  }
  // Always add the standard closing objects
  objects.push(
    `to provide for the establishment of oversight and accountability mechanisms`,
    `to repeal or amend any law inconsistent with this Act`,
    `to provide for matters connected therewith`
  );

  // Powers derived from implementation steps
  const powers: string[] = [];
  if (plan && Array.isArray(plan.implementation_steps) && plan.implementation_steps.length > 0) {
    plan.implementation_steps.forEach((step) => {
      const desc = String(step.description || "").trim();
      if (desc) powers.push(desc);
    });
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
            href={`/documents/white-paper/${id}`}
            className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            ← White Paper
          </Link>
          <PrintButton label="Download as PDF" />
        </div>
      </div>

      {/* Document */}
      <article
        className="max-w-3xl mx-auto bg-white shadow-sm border border-gray-200 rounded-xl"
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >

        {/* Gazette Header */}
        <div
          className="p-6 text-center border-b-2"
          style={{ borderColor: "#8B0000", backgroundColor: "#fff8f8" }}
        >
          <div className="flex justify-between items-start text-xs text-gray-500 mb-4">
            <div className="text-left">
              <div className="font-bold text-gray-700">GOVERNMENT GAZETTE</div>
              <div>REPUBLIC OF SOUTH AFRICA</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-700">STAATSKOERANT</div>
              <div>REPUBLIEK VAN SUID-AFRIKA</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-700">Vol. ___</div>
              <div>{today}</div>
            </div>
          </div>

          <div
            className="border-t border-b py-2 my-3 text-xs font-bold uppercase tracking-widest"
            style={{ borderColor: "#8B0000", color: "#8B0000" }}
          >
            {billRef}
          </div>

          <div className="flex flex-col items-center gap-1 my-4">
            <div
              className="w-14 h-18 rounded-t-full border-2 flex flex-col items-center justify-center py-2"
              style={{ borderColor: "#8B0000", backgroundColor: "#fff0f0" }}
            >
              <div className="text-xl">⚜</div>
              <div className="flex gap-0.5 mt-1">
                <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: "#007A4D" }} />
                <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: "#FFB612" }} />
                <div className="w-1.5 h-1 rounded-sm" style={{ backgroundColor: "#DE3831" }} />
              </div>
            </div>
          </div>

          <div
            className="inline-block px-6 py-2 rounded text-sm font-bold uppercase tracking-widest mb-4"
            style={{ backgroundColor: "#8B0000", color: "white" }}
          >
            BILL
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2 leading-tight uppercase tracking-wide">
            {actTitle}
          </h1>

          <p className="text-xs text-gray-500 mb-2">
            (As introduced in the National Assembly (proposed section 75); explanatory
            summary of Bill published in Government Gazette No. _____ of {today})
            [B {id}—{year}]
          </p>

          <p className="text-xs text-gray-400 mt-2">
            Template skeleton bill · For legislative drafting reference only ·
            Not a finalised government Bill
          </p>
        </div>

        <div className="p-10">

          {/* Long Title */}
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">
              LONG TITLE
            </p>
            <p className="text-sm text-gray-800 leading-relaxed italic">
              To provide a legal framework for{" "}
              {idea.title.charAt(0).toLowerCase() + idea.title.slice(1)}; to address the{" "}
              {constraintLabel} binding constraint on South African economic growth; to
              designate {deptLabel} as the responsible authority; to establish oversight
              and accountability mechanisms; to make provision for transitional arrangements;
              and to provide for matters incidental thereto.
            </p>
          </div>

          {/* Preamble */}
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
              PREAMBLE
            </p>
            <p className="text-sm text-gray-700 mb-3">
              SINCE the Republic of South Africa is founded upon the values of human dignity,
              equality, freedom, non-racialism, and non-sexism;
            </p>
            {preambleClauses.map((clause, i) => (
              <p key={i} className="text-sm text-gray-700 mb-3">
                AND SINCE{" "}
                <span dangerouslySetInnerHTML={{ __html: clause }} />
              </p>
            ))}
            {idea.description && (
              <p className="text-sm text-gray-700 mb-3">
                AND SINCE it is necessary to address through legislation the following
                policy objective: {idea.description.length > 200
                  ? idea.description.substring(0, 200) + "…"
                  : idea.description};
              </p>
            )}
            <p className="text-sm font-bold text-gray-900 mt-4">
              PARLIAMENT OF THE REPUBLIC OF SOUTH AFRICA therefore enacts as follows:—
            </p>
          </div>

          <hr style={{ borderColor: "#e5e7eb" }} className="my-6" />

          {/* Section 1: Definitions */}
          <div className="page-break" />
          <BillSection number="1" heading="Definitions">
            <BillClause number="1" heading="Definitions">
              In this Act, unless the context otherwise indicates—
            </BillClause>
            <div className="ml-11 space-y-2 text-sm text-gray-700">
              {[
                [`"Act"`, `means the ${actTitle};`],
                [`"binding constraint"`, `means the ${constraintLabel} constraint on South African economic growth as identified through application of the growth-diagnostics framework;`],
                [`"Department"`, `means ${deptLabel};`],
                [`"Director-General"`, `means the Director-General of ${deptLabel};`],
                [`"implementation plan"`, `means the plan contemplated in section 4;`],
                [`"Minister"`, `means the Cabinet member responsible for ${deptLabel};`],
                [`"organ of state"`, `bears the meaning assigned to it in section 239 of the Constitution;`],
                [`"prescribed"`, `means prescribed by regulation;`],
                [`"reform"`, `means ${idea.title.charAt(0).toLowerCase() + idea.title.slice(1)};`],
                [`"this Act"`, `includes any regulation made thereunder.`],
              ].map(([term, def], i) => (
                <div key={i} className="flex gap-3">
                  <span className="font-semibold flex-shrink-0">{term}</span>
                  <span>{def}</span>
                </div>
              ))}
            </div>
          </BillSection>

          {/* Section 2: Objects */}
          <BillSection number="2" heading="Objects of Act">
            <BillClause number="2" heading="Objects">
              The objects of this Act are—
            </BillClause>
            {objects.map((obj, i) => (
              <SubClause key={i} letter={String.fromCharCode(97 + i)}>
                {obj};
              </SubClause>
            ))}
          </BillSection>

          {/* Section 3: Application */}
          <BillSection number="3" heading="Application">
            <BillClause number="3" heading="Application">
              This Act applies to—
            </BillClause>
            <SubClause letter="a">
              all organs of state engaged in the implementation of this Act;
            </SubClause>
            <SubClause letter="b">
              private persons and entities to the extent required for the achievement of
              the objects of this Act; and
            </SubClause>
            <SubClause letter="c">
              such other persons and entities as may be prescribed.
            </SubClause>
          </BillSection>

          {/* Section 4: Establishment / Administration */}
          <div className="page-break" />
          <BillSection number="4" heading="Establishment and Administration">
            <BillClause number="4" heading="Responsible authority">
              The Minister is responsible for the administration of this Act.
            </BillClause>
            <BillClause number="5" heading="Delegation">
              The Minister may, by notice in the Gazette, delegate any power or assign any
              duty conferred or imposed upon the Minister by this Act to the Director-General
              or any other official in the Department, subject to such conditions as the
              Minister may impose.
            </BillClause>
            <BillClause number="6" heading="Implementation unit">
              <span>
                <strong>(1)</strong> The Director-General must establish an implementation
                unit within the Department to coordinate the implementation of this Act.
              </span>
            </BillClause>
            <div className="ml-11 space-y-2 text-sm text-gray-700">
              <div><strong>(2)</strong> The implementation unit must—</div>
              {[
                "develop and maintain the implementation plan;",
                "coordinate interdepartmental and intergovernmental cooperation;",
                "monitor and report on progress against the implementation plan;",
                "liaise with the private sector, civil society, and international partners; and",
                "perform such other functions as the Minister may prescribe.",
              ].map((f, i) => (
                <div key={i} className="flex gap-3 ml-4">
                  <span className="flex-shrink-0">({String.fromCharCode(97 + i)})</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <BillClause number="7" heading="Implementation plan">
              <span>
                <strong>(1)</strong> The implementation unit must, within [six] months of
                the commencement of this Act, prepare and submit to the Minister an
                implementation plan.
              </span>
            </BillClause>
            <div className="ml-11 space-y-1 text-sm text-gray-700">
              <div><strong>(2)</strong> The implementation plan must include—</div>
              {[
                "a phased programme of activities with defined milestones and timelines;",
                "identification of responsible parties for each phase;",
                "resource requirements and funding arrangements;",
                "key performance indicators and measurement methodology; and",
                "a risk register and mitigation strategies.",
              ].map((f, i) => (
                <div key={i} className="flex gap-3 ml-4">
                  <span className="flex-shrink-0">({String.fromCharCode(97 + i)})</span>
                  <span>{f}</span>
                </div>
              ))}
              <div className="mt-2">
                <strong>(3)</strong> The Minister must table the implementation plan in
                Parliament within [30] days of approving it.
              </div>
            </div>
          </BillSection>

          {/* Section 5: Powers and Functions */}
          <BillSection number="5" heading="Powers and Functions">
            <BillClause number="8" heading="General powers of Minister">
              The Minister may—
            </BillClause>
            {powers.length > 0 ? (
              powers.map((p, i) => (
                <SubClause key={i} letter={String.fromCharCode(97 + i)}>
                  {p};
                </SubClause>
              ))
            ) : (
              <>
                <SubClause letter="a">
                  issue policy directives to any organ of state regarding the implementation
                  of this Act;
                </SubClause>
                <SubClause letter="b">
                  enter into agreements with any organ of state, private entity, or
                  international organisation for the purpose of furthering the objects of
                  this Act;
                </SubClause>
                <SubClause letter="c">
                  establish advisory bodies and appoint experts to advise on matters
                  pertaining to this Act;
                </SubClause>
                <SubClause letter="d">
                  allocate functions among organs of state for implementation purposes; and
                </SubClause>
                <SubClause letter="e">
                  perform such other acts as may be necessary to achieve the objects of this Act.
                </SubClause>
              </>
            )}

            <BillClause number="9" heading="Information and reporting">
              <span>
                <strong>(1)</strong> Any organ of state or person required to implement any
                provision of this Act must furnish the Director-General with such information,
                returns, or reports as the Director-General may require.
              </span>
            </BillClause>
            <div className="ml-11 text-sm text-gray-700 mb-3">
              <strong>(2)</strong> Information provided under subsection (1) may be used
              only for the purposes of this Act.
            </div>
          </BillSection>

          {/* Section 6: Regulations */}
          <div className="page-break" />
          <BillSection number="6" heading="Regulations">
            <BillClause number="10" heading="Regulations">
              <span>
                <strong>(1)</strong> The Minister may make regulations regarding any matter
                that may or must be prescribed under this Act.
              </span>
            </BillClause>
            <div className="ml-11 text-sm text-gray-700 space-y-2">
              <div>
                <strong>(2)</strong> Without limiting subsection (1), the Minister may make
                regulations regarding—
              </div>
              {[
                "the forms, procedures, and processes applicable to applications, notices, and other matters under this Act;",
                "standards, norms, and technical specifications applicable to any activity regulated under this Act;",
                "fees payable in connection with any service provided under this Act;",
                "incentives, exemptions, or graduated requirements for small and medium enterprises;",
                "enforcement mechanisms, including inspection and compliance procedures;",
                "penalties for non-compliance, not exceeding [amount] or [period] imprisonment, or both; and",
                "any other matter necessary for the effective administration of this Act.",
              ].map((r, i) => (
                <div key={i} className="flex gap-3 ml-4">
                  <span className="flex-shrink-0">({String.fromCharCode(97 + i)})</span>
                  <span>{r}</span>
                </div>
              ))}
              <div>
                <strong>(3)</strong> Regulations made under this section must be published
                in the Gazette and are subject to parliamentary oversight as provided
                for in the Statutory Instruments Act [or applicable legislation].
              </div>
              <div>
                <strong>(4)</strong> Before making regulations, the Minister must—
              </div>
              {[
                "publish a draft of the proposed regulations for public comment for a period of not less than [30] days; and",
                "take into account all comments received.",
              ].map((r, i) => (
                <div key={i} className="flex gap-3 ml-4">
                  <span className="flex-shrink-0">({String.fromCharCode(97 + i)})</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </BillSection>

          {/* Section 7: Monitoring */}
          <BillSection number="7" heading="Monitoring, Evaluation and Reporting">
            <BillClause number="11" heading="Annual report">
              The Minister must, by [31 October] of each year, table in Parliament a report
              on the implementation of this Act during the preceding financial year, which
              must include—
            </BillClause>
            {[
              "progress against the implementation plan and key performance indicators;",
              "an assessment of the impact of the Act on the binding constraint identified in the Preamble;",
              "expenditure against allocated budget;",
              "a summary of any enforcement action taken;",
              "any amendments to the implementation plan; and",
              "proposed priorities for the forthcoming financial year.",
            ].map((r, i) => (
              <SubClause key={i} letter={String.fromCharCode(97 + i)}>
                {r}
              </SubClause>
            ))}
            <BillClause number="12" heading="Independent evaluation">
              The Minister must cause an independent evaluation of the effectiveness of
              this Act to be conducted at [five]-year intervals, and must table the
              evaluation report in Parliament.
            </BillClause>
          </BillSection>

          {/* Section 8: Transitional */}
          <BillSection number="8" heading="Transitional Provisions">
            <BillClause number="13" heading="Savings">
              Anything done under any law that is repealed or amended by this Act and
              that could have been done under this Act continues to be valid as if done
              under this Act, unless inconsistent with this Act.
            </BillClause>
            <BillClause number="14" heading="Pending matters">
              Any application, process, or proceeding pending at the commencement of this
              Act under a law repealed or amended by this Act must be finalised in
              accordance with the provisions of that law as if it had not been repealed
              or amended, unless the applicant or party requests that it be dealt with
              under this Act.
            </BillClause>
            <BillClause number="15" heading="Existing agreements">
              Any agreement concluded before the commencement of this Act that relates
              to any matter regulated by this Act remains valid for the period stipulated
              in the agreement, but must upon renewal comply with this Act.
            </BillClause>
            <BillClause number="16" heading="Interim arrangements">
              The Department may, for a period not exceeding [12] months after the
              commencement of this Act, use existing systems, processes, and staff to
              perform functions assigned to the implementation unit under section 6 until
              that unit is established and fully operational.
            </BillClause>
          </BillSection>

          {/* Section 9: Repeal */}
          <BillSection number="9" heading="Repeal or Amendment of Laws">
            <BillClause number="17" heading="Repeal and amendment">
              The laws specified in the Schedule are repealed or amended to the extent set
              out in the third column of the Schedule.
            </BillClause>
            <div
              className="mt-4 p-4 rounded border text-xs text-gray-500"
              style={{ borderColor: "#e5e7eb", backgroundColor: "#fafafa" }}
            >
              <strong>[Schedule — Laws to be repealed or amended]</strong>
              <br />
              To be completed by parliamentary legal drafters based on detailed legal
              analysis of existing legislation in the {constraintLabel} domain.
              {plan?.required_legislation && (
                <><br /><br />Relevant legislative context noted: {plan.required_legislation}</>
              )}
            </div>
          </BillSection>

          {/* Section 10: Short title */}
          <BillSection number="10" heading="Short Title and Commencement">
            <BillClause number="18" heading="Short title and commencement">
              <span>
                <strong>(1)</strong> This Act is called the {actTitle}.
              </span>
            </BillClause>
            <div className="ml-11 text-sm text-gray-700">
              <strong>(2)</strong> This Act comes into operation on a date to be determined
              by the President by proclamation in the Gazette.
            </div>
            <div className="ml-11 text-sm text-gray-700 mt-2">
              <strong>(3)</strong> The President may determine different dates for the
              commencement of different provisions of this Act.
            </div>
          </BillSection>

          {/* Drafting note */}
          <div
            className="mt-8 p-4 rounded-lg border text-xs"
            style={{
              borderColor: "#FFB612",
              backgroundColor: "#fffbeb",
              color: "#92600a",
            }}
          >
            <strong>Drafting Note:</strong> This is a skeleton template Bill generated from the
            SA Policy Space reform database. It provides the structural scaffold for legislative
            drafting but requires: (1) legal review by State Law Advisers; (2) constitutional
            analysis under relevant sections; (3) detailed Schedule of laws to be repealed or
            amended; (4) finalised definitions aligned to the relevant legal domain; and
            (5) parliamentary procedure compliance review. All bracketed items [____] require
            completion by qualified legislative drafters.
          </div>

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
