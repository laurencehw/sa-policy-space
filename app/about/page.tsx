import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">About SA Policy Space</h1>
        <p className="text-gray-500 text-sm mt-1">
          What this is, what it isn&apos;t, and how we work.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">What Is This?</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          SA Policy Space tracks policy ideas that emerge from South African parliamentary
          committee proceedings. The Parliamentary Monitoring Group (PMG) documents thousands
          of committee meetings — a rich but unwieldy record of what government is actually
          discussing. This project reads that record and asks: which ideas keep coming up?
          Which ones are feasible? Which are stalled, and why?
        </p>
        <p className="text-sm text-gray-700 leading-relaxed">
          The goal is to surface the best ideas for removing South Africa&apos;s binding growth
          constraints — and to hold the system accountable when good ideas go nowhere.
        </p>
      </section>

      {/* Download card */}
      <section>
        <a
          href="/documents/SA_Growth_Agenda_Integrated_Framework.docx"
          download
          className="flex items-start gap-4 p-5 rounded-xl border-2 border-sa-green/30 bg-sa-green/5 hover:bg-sa-green/10 hover:border-sa-green/50 transition-colors group"
        >
          <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-sa-green/10 group-hover:bg-sa-green/20 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-sa-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm group-hover:text-sa-green transition-colors">
              Download Full Report: SA Growth Agenda Integrated Framework
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Synthesis of all five reform packages with dependency analysis, theory of change, and sequencing priorities. Word document (.docx)
            </p>
          </div>
          <span className="flex-shrink-0 text-xs text-sa-green font-medium opacity-80 group-hover:opacity-100 mt-0.5">
            .docx ↓
          </span>
        </a>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Methodology</h2>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex gap-2">
            <span className="text-sa-green font-bold mt-0.5">1.</span>
            <span>
              <strong>Source layer:</strong> We index meetings and documents from the PMG API.
              We link back to PMG as the authoritative record — we do not reproduce their minutes.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-sa-green font-bold mt-0.5">2.</span>
            <span>
              <strong>Policy idea extraction:</strong> From committee discussions, we synthesise
              distinct policy proposals. Each idea is our original interpretation, not PMG verbatim text.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-sa-green font-bold mt-0.5">3.</span>
            <span>
              <strong>Assessment:</strong> Each idea is scored on growth impact (1–5) and
              feasibility (1–5), assigned a binding constraint category, and tracked for status
              over time.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-sa-green font-bold mt-0.5">4.</span>
            <span>
              <strong>Implementation plans:</strong> High-priority ideas get a detailed roadmap:
              steps, timeline, cost estimate, required legislation, and international precedents.
            </span>
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">What This Is Not</h2>
        <ul className="space-y-1.5 text-sm text-gray-700 list-disc list-inside">
          <li>Not a reproduction of PMG content (we link, not copy)</li>
          <li>Not an official government resource</li>
          <li>Not a comprehensive Hansard — we focus on actionable policy ideas</li>
          <li>Not neutral: we make editorial judgements about impact and feasibility</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Binding Constraints Framework</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We organise ideas around ten binding constraints on South African growth, drawing on
          the World Bank, NPC, and academic literature (Hausmann, Rodrik, Velasco diagnostic
          framework). These are: energy, logistics, skills, regulation, crime, labour market,
          land, digital infrastructure, government capacity, and corruption.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Data & Credits</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Committee meeting data sourced from the{" "}
          <a
            href="https://pmg.org.za"
            className="text-sa-green underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Parliamentary Monitoring Group (PMG)
          </a>{" "}
          API. PMG is an independent organisation that monitors South African Parliament.
          They are the authoritative source for committee proceedings — visit their site
          for full minutes, documents, and historical records.
        </p>
        <p className="text-sm text-gray-700">
          Created by{" "}
          <a
            href="https://github.com/laurencehw/"
            className="text-sa-green underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Laurence Wilse-Samson
          </a>
          , NYU Wagner School of Public Policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold text-gray-900">Developer API</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          SA Policy Space exposes a public JSON API for researchers and developers. No
          authentication required.
        </p>
        <Link
          href="/api-docs"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:border-sa-green/40 hover:bg-sa-green/5 transition-colors text-sm font-medium text-gray-700 hover:text-sa-green"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          View API Documentation
        </Link>
      </section>

      <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-3">
        <Link href="/ideas" className="btn-primary inline-block">
          Browse Policy Ideas
        </Link>
        <Link href="/reform-index" className="btn-secondary inline-block">
          Reform Progress Index
        </Link>
      </div>
    </div>
  );
}
