import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Methodology | SA Policy Space",
  description:
    "How SA Policy Space identifies, scores, and categorises policy reform ideas from South African parliamentary committee proceedings.",
};

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl space-y-12">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex gap-0.5">
            <span className="w-1 h-5 bg-sa-green rounded-sm" />
            <span className="w-1 h-5 bg-sa-gold rounded-sm" />
            <span className="w-1 h-5 bg-sa-red rounded-sm" />
          </span>
          <span className="text-xs font-medium text-sa-green uppercase tracking-wider">Research Methodology</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">How SA Policy Space Works</h1>
        <p className="text-gray-500 mt-2 leading-relaxed">
          A transparent account of how policy ideas are sourced, assessed, categorised, and presented —
          including what this tool can and cannot tell you.
        </p>
      </div>

      {/* 1. Data Sources */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sa-green text-white text-sm font-bold flex items-center justify-center mt-0.5">1</span>
          <h2 className="text-xl font-semibold text-gray-900 pt-1">Data Sources</h2>
        </div>
        <div className="ml-11 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            All policy ideas are sourced from committee proceedings documented by the{" "}
            <a
              href="https://pmg.org.za"
              className="text-sa-green underline hover:text-green-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Parliamentary Monitoring Group (PMG)
            </a>
            , an independent organisation that monitors the South African Parliament and maintains
            the most comprehensive public record of committee deliberations. PMG is the authoritative
            source — this project reads and synthesises their record; it does not reproduce it.
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            The database draws on proceedings from the following parliamentary portfolio and select committees:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              "Mineral Resources and Energy",
              "Trade, Industry and Competition",
              "Transport",
              "Public Works and Infrastructure",
              "Finance (Standing Committee)",
              "Finance (Select Committee, NCOP)",
              "Public Enterprises",
              "Basic Education",
              "Higher Education and Training",
              "Health",
              "Small Business Development",
              "Science, Technology and Innovation",
            ].map((committee) => (
              <div
                key={committee}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sa-green flex-shrink-0" />
                {committee}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Coverage spans 2015–2025, with particular depth for the 7th Parliament (2024 onwards)
            following the Government of National Unity. Meeting records include committee minutes,
            briefing documents, and oral evidence sessions.
          </p>
        </div>
      </section>

      {/* 2. Extraction Process */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sa-green text-white text-sm font-bold flex items-center justify-center mt-0.5">2</span>
          <h2 className="text-xl font-semibold text-gray-900 pt-1">Extraction Process</h2>
        </div>
        <div className="ml-11 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Parliamentary committee transcripts are rich in policy content but rarely organised
            around discrete, actionable ideas. The extraction process turns deliberative text
            into a structured database of reform proposals.
          </p>
          <div className="space-y-3">
            <div className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <span className="text-sa-green font-bold text-sm mt-0.5 flex-shrink-0">Step 1</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Thematic scanning</p>
                <p className="text-sm text-gray-600 mt-1">
                  Each meeting record is read for recurring themes: explicit proposals by members
                  or witnesses, references to draft legislation, performance gaps acknowledged by
                  departments, and cross-committee patterns (the same constraint surfacing in
                  multiple committees signals a binding bottleneck rather than a one-off complaint).
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <span className="text-sa-green font-bold text-sm mt-0.5 flex-shrink-0">Step 2</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Idea synthesis</p>
                <p className="text-sm text-gray-600 mt-1">
                  Each distinct policy proposal is written up as an original synthesis — not
                  verbatim PMG text. We focus on proposals with <em>measurable outcomes</em>:
                  ideas that could, in principle, be evaluated against a counterfactual. Vague
                  aspirations (&ldquo;improve coordination&rdquo;) are excluded unless linked to
                  a concrete mechanism.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
              <span className="text-sa-green font-bold text-sm mt-0.5 flex-shrink-0">Step 3</span>
              <div>
                <p className="text-sm font-medium text-gray-900">Deduplication and linkage</p>
                <p className="text-sm text-gray-600 mt-1">
                  Recurring proposals (the same idea discussed in 2019, 2022, and 2025) are
                  merged into a single record with a meeting history. Frequency of appearance
                  is one signal of political salience, but it does not directly enter the
                  growth-impact or feasibility score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Scoring Methodology */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sa-green text-white text-sm font-bold flex items-center justify-center mt-0.5">3</span>
          <h2 className="text-xl font-semibold text-gray-900 pt-1">Scoring Methodology</h2>
        </div>
        <div className="ml-11 space-y-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            Each policy idea is rated on two dimensions, both on a 1–5 scale. These are
            researcher assessments, not algorithmic scores — they reflect judgement informed
            by the economic literature, international precedent, and South Africa–specific context.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Growth Impact */}
            <div className="p-5 rounded-xl border-2 border-sa-green/20 bg-sa-green/5 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-sa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="font-semibold text-gray-900">Growth Impact (1–5)</h3>
              </div>
              <p className="text-sm text-gray-600">
                Potential contribution to GDP growth or productivity over a 5–10 year horizon,
                anchored to the South African context. Draws on macro-econometric estimates
                (where available), analogous reforms in comparable economies, and the degree to
                which the reform addresses an identified binding constraint.
              </p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">5</span>
                  <span>Systemic change; could shift long-run growth path by &gt;0.5 pp/yr</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">4</span>
                  <span>Significant sectoral impact; productivity gains or investment unlock</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">3</span>
                  <span>Moderate, targeted improvement in a specific constraint</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">2</span>
                  <span>Marginal or highly contingent on complementary reforms</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">1</span>
                  <span>Minimal direct growth link; primarily distributional or procedural</span>
                </div>
              </div>
            </div>

            {/* Feasibility */}
            <div className="p-5 rounded-xl border-2 border-sa-gold/30 bg-sa-gold/5 space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-gray-900">Feasibility (1–5)</h3>
              </div>
              <p className="text-sm text-gray-600">
                Composite assessment of implementation likelihood, considering political
                feasibility (coalition alignment, veto players), institutional capacity
                (does the responsible department have the bandwidth?), budget requirements,
                and legislative complexity. Time horizon also matters: quick wins score
                higher even if long-run impact is moderate.
              </p>
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">5</span>
                  <span>Low barriers; executive action or secondary legislation sufficient</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">4</span>
                  <span>Primary legislation required but broad political support exists</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">3</span>
                  <span>Contested terrain; requires negotiation across coalition partners</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">2</span>
                  <span>Significant institutional or fiscal barriers; multi-year effort</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900 w-4">1</span>
                  <span>Politically or institutionally blocked under current conditions</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
            <strong>Researcher judgement note:</strong> These scores are not produced by an
            algorithm. They reflect the researcher&apos;s synthesis of available evidence and
            should be treated as informed starting points for analysis, not precise measurements.
            Scores are reviewed and updated as the political economy evolves.
          </div>
        </div>
      </section>

      {/* 4. Binding Constraints Framework */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sa-green text-white text-sm font-bold flex items-center justify-center mt-0.5">4</span>
          <h2 className="text-xl font-semibold text-gray-900 pt-1">Binding Constraints Framework</h2>
        </div>
        <div className="ml-11 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Policy ideas are organised around ten binding constraints on South African growth.
            The conceptual foundation is the Hausmann–Rodrik–Velasco (HRV) growth diagnostics
            framework, which holds that growth is best accelerated by removing the <em>most
            binding</em> constraint rather than attempting comprehensive reform across all fronts
            simultaneously. The approach asks: what is the shadow price of relaxing each
            constraint? Where is the return to reform highest given current conditions?
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            The ten constraints are drawn from the World Bank&apos;s South Africa Country
            Economic Memoranda, the National Planning Commission&apos;s diagnostic, and the
            academic literature on South African structural bottlenecks.
          </p>
          <div className="grid gap-3">
            {[
              {
                key: "energy",
                label: "Energy & Electricity",
                color: "bg-yellow-50 border-yellow-200",
                dot: "bg-yellow-500",
                desc: "Load-shedding and unreliable supply remain the most acute short-run constraint on output. Reforms cover generation, transmission, distribution, and the regulatory framework.",
              },
              {
                key: "logistics",
                label: "Logistics & Transport",
                color: "bg-blue-50 border-blue-200",
                dot: "bg-blue-500",
                desc: "Transnet's network deterioration and Durban port inefficiency raise the cost of traded goods and undermine export competitiveness, particularly in mining and agriculture.",
              },
              {
                key: "skills",
                label: "Skills & Education",
                color: "bg-purple-50 border-purple-200",
                dot: "bg-purple-500",
                desc: "A skills mismatch — scarce technical and professional graduates, large numbers of youth neither in employment, education, nor training — constrains both the formal labour market and firm investment.",
              },
              {
                key: "regulation",
                label: "Regulation",
                color: "bg-orange-50 border-orange-200",
                dot: "bg-orange-500",
                desc: "Complex product market regulation, licensing burdens, and slow permitting processes raise the cost of doing business and deter investment, especially for smaller firms and new entrants.",
              },
              {
                key: "crime",
                label: "Crime & Safety",
                color: "bg-red-50 border-red-200",
                dot: "bg-red-500",
                desc: "High rates of violent crime and business disruption (including organised crime targeting infrastructure) impose direct costs on firms and households and deter tourism and foreign investment.",
              },
              {
                key: "labor_market",
                label: "Labour Market",
                color: "bg-pink-50 border-pink-200",
                dot: "bg-pink-500",
                desc: "Rigid collective bargaining structures, high minimum wages relative to productivity in low-skill sectors, and search frictions contribute to structural unemployment above 30%.",
              },
              {
                key: "land",
                label: "Land & Property",
                color: "bg-green-50 border-green-200",
                dot: "bg-green-500",
                desc: "Unresolved land tenure, a backlogged title registry, and slow urban land release constrain agricultural investment, housing supply, and household balance sheets.",
              },
              {
                key: "digital",
                label: "Digital Infrastructure",
                color: "bg-cyan-50 border-cyan-200",
                dot: "bg-cyan-500",
                desc: "Broadband penetration remains uneven, with high wholesale prices limiting connectivity for small firms and low-income households — a constraint on the service economy and e-government.",
              },
              {
                key: "government_capacity",
                label: "Government Capacity",
                color: "bg-gray-50 border-gray-200",
                dot: "bg-gray-500",
                desc: "Depleted technical capacity in key departments (SARS, DPWI, ESKOM oversight) and municipalities means that even well-designed reforms struggle to clear the implementation bottleneck.",
              },
              {
                key: "corruption",
                label: "Corruption & Governance",
                color: "bg-rose-50 border-rose-200",
                dot: "bg-rose-500",
                desc: "Corruption in procurement, licensing, and service delivery raises costs, diverts public investment, and undermines the credibility of institutions needed for all other reforms to succeed.",
              },
            ].map((constraint) => (
              <div
                key={constraint.key}
                className={`flex gap-3 p-4 rounded-xl border ${constraint.color}`}
              >
                <span className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${constraint.dot}`} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{constraint.label}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{constraint.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Reference: Hausmann, R., Rodrik, D., &amp; Velasco, A. (2005). Growth Diagnostics.{" "}
            <em>Harvard Kennedy School Working Paper.</em> Applied to South Africa in NPC (2011),{" "}
            <em>National Development Plan 2030.</em>
          </p>
        </div>
      </section>

      {/* 5. Reform Packages */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sa-green text-white text-sm font-bold flex items-center justify-center mt-0.5">5</span>
          <h2 className="text-xl font-semibold text-gray-900 pt-1">Reform Packages</h2>
        </div>
        <div className="ml-11 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            Individual policy ideas are grouped into five sequenced reform packages. Packaging
            reflects three considerations: (1) <strong>implementation dependencies</strong> — some
            reforms are preconditions for others; (2) <strong>political economy sequencing</strong> —
            early wins build credibility and coalition support for harder subsequent reforms; and
            (3) <strong>institutional ownership</strong> — ideas within a package tend to share
            a common lead department or coordinating body, reducing handoff costs.
          </p>
          <div className="grid gap-3">
            {[
              { num: 1, name: "Infrastructure Unblock", color: "bg-amber-400", desc: "Energy, logistics, and digital infrastructure — the most acute short-run constraints. Package 1 reforms are largely within executive reach and would generate immediate investment signals." },
              { num: 2, name: "SMME & Employment Acceleration", color: "bg-blue-400", desc: "Regulatory, labour-market, and finance reforms that lower barriers for small business formation and formal employment — targeting structural unemployment." },
              { num: 3, name: "Human Capital Pipeline", color: "bg-purple-400", desc: "Basic education quality, TVET expansion, and graduate market alignment. Longer time horizon but essential for sustaining growth beyond the infrastructure cycle." },
              { num: 4, name: "Trade & Industrial Competitiveness", color: "bg-teal-400", desc: "Export facilitation, industrial policy rationalisation, and regional integration. Builds on infrastructure and skills gains from Packages 1–3." },
              { num: 5, name: "State Capacity & Governance", color: "bg-slate-400", desc: "Anti-corruption, professionalisation of the civil service, and municipal fiscal reform. These are cross-cutting reforms that raise the return on investment in all other packages." },
            ].map((pkg) => (
              <div key={pkg.num} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                <div className={`flex-shrink-0 w-9 h-9 rounded-full ${pkg.color} flex items-center justify-center text-white font-bold text-sm`}>
                  {pkg.num}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{pkg.name}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{pkg.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            The sequencing logic is described in detail on each{" "}
            <Link href="/packages" className="text-sa-green underline hover:text-green-700">
              Package page
            </Link>
            , including dependency maps and theory-of-change narratives.
          </p>
        </div>
      </section>

      {/* 6. International Comparisons */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sa-green text-white text-sm font-bold flex items-center justify-center mt-0.5">6</span>
          <h2 className="text-xl font-semibold text-gray-900 pt-1">International Comparisons</h2>
        </div>
        <div className="ml-11 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            The database includes 59 case studies drawn from countries that have implemented
            reforms analogous to those in the SA policy space. Peer cases are selected on three
            criteria:
          </p>
          <div className="space-y-2">
            {[
              { label: "Comparable development context", desc: "Upper-middle-income or transitioning economies with similar structural features — high inequality, resource dependence, or post-apartheid/post-transition legacy institutions." },
              { label: "Analogous reform type", desc: "The case involves a reform of the same kind (e.g., independent power producer frameworks, skills levy redesign, land title formalisation) allowing mechanism-level comparison, not just headline outcome mapping." },
              { label: "Documented outcomes", desc: "Cases are included only where there is peer-reviewed or credible grey literature on outcomes, including failures. We do not extrapolate from intent or political announcements." },
            ].map((c, i) => (
              <div key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="text-sa-green font-bold mt-0.5 flex-shrink-0">✓</span>
                <span><strong>{c.label}:</strong> {c.desc}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Countries represented include Chile, India, Vietnam, Brazil, South Korea, Rwanda,
            Kenya, Indonesia, Botswana, Morocco, and others. Explore the full dataset at{" "}
            <Link href="/comparisons" className="text-sa-green underline hover:text-green-700">
              International Comparisons
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 7. Limitations & Caveats */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sa-green text-white text-sm font-bold flex items-center justify-center mt-0.5">7</span>
          <h2 className="text-xl font-semibold text-gray-900 pt-1">Limitations &amp; Caveats</h2>
        </div>
        <div className="ml-11">
          <div className="p-5 rounded-xl border border-gray-200 bg-gray-50 space-y-3 text-sm text-gray-700">
            <div className="flex gap-2">
              <span className="text-gray-400 font-bold flex-shrink-0">—</span>
              <p><strong>Research tool, not a policy blueprint.</strong> SA Policy Space is designed to
              surface ideas and facilitate analysis. It should not be read as an endorsement of
              any particular reform path or a substitute for formal policy evaluation.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 font-bold flex-shrink-0">—</span>
              <p><strong>Scores reflect researcher judgement.</strong> Growth impact and feasibility
              ratings are not outputs of an econometric model. Reasonable analysts will disagree,
              especially on feasibility scores, which are sensitive to rapidly changing political
              conditions.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 font-bold flex-shrink-0">—</span>
              <p><strong>Coverage is not exhaustive.</strong> The database prioritises ideas with
              measurable growth linkages from key economic committees. Social policy committees,
              security and justice committees, and some NCOP proceedings are less fully covered.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 font-bold flex-shrink-0">—</span>
              <p><strong>Periodic updates.</strong> The database is updated periodically but does
              not reflect real-time parliamentary activity. Status updates (e.g., &ldquo;implemented&rdquo;,
              &ldquo;stalled&rdquo;) may lag actual developments by weeks or months.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 font-bold flex-shrink-0">—</span>
              <p><strong>Original synthesis, not verbatim PMG.</strong> Policy idea descriptions
              are the researcher&apos;s interpretive synthesis. They should not be attributed to
              committee members, departments, or PMG. For verbatim records, consult the{" "}
              <a href="https://pmg.org.za" className="text-sa-green underline" target="_blank" rel="noopener noreferrer">PMG directly</a>.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-gray-400 font-bold flex-shrink-0">—</span>
              <p><strong>Not an official resource.</strong> This project is independent research
              conducted at NYU Wagner. It has no affiliation with the South African government,
              Parliament, or PMG.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Citation */}
      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-sa-green text-white text-sm font-bold flex items-center justify-center mt-0.5">8</span>
          <h2 className="text-xl font-semibold text-gray-900 pt-1">How to Cite</h2>
        </div>
        <div className="ml-11 space-y-3">
          <p className="text-sm text-gray-700">
            For academic use, please cite as follows:
          </p>
          <div className="p-4 rounded-xl bg-gray-900 text-gray-100 font-mono text-sm leading-relaxed">
            Wilse-Samson, L. (2026). <em className="not-italic text-sa-gold">SA Policy Space: Mapping South Africa&apos;s Path to Reform.</em>{" "}
            NYU Wagner School of Public Policy.{" "}
            <span className="text-cyan-400">https://sa-policy-space.vercel.app</span>
          </div>
          <p className="text-sm text-gray-500">
            BibTeX:
          </p>
          <pre className="p-4 rounded-xl bg-gray-900 text-gray-300 text-xs leading-relaxed overflow-x-auto">
{`@misc{wilsesamson2026sapolicyspace,
  author    = {Wilse-Samson, Laurence},
  title     = {SA Policy Space: Mapping South Africa's Path to Reform},
  year      = {2026},
  publisher = {NYU Wagner School of Public Policy},
  url       = {https://sa-policy-space.vercel.app}
}`}
          </pre>
          <p className="text-sm text-gray-500">
            For questions or feedback:{" "}
            <a href="mailto:lw3387@nyu.edu" className="text-sa-green underline hover:text-green-700">
              lw3387@nyu.edu
            </a>
          </p>
        </div>
      </section>

      {/* Footer links */}
      <div className="pt-6 border-t border-gray-200 flex flex-wrap gap-3">
        <Link href="/ideas" className="btn-primary inline-block">
          Browse Policy Ideas
        </Link>
        <Link href="/about" className="btn-secondary inline-block">
          About This Project
        </Link>
        <Link href="/api-docs" className="btn-secondary inline-block">
          Developer API
        </Link>
      </div>
    </div>
  );
}
