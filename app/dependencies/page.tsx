import type { Metadata } from 'next'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const DependencyGraph = dynamic(() => import('@/components/DependencyGraph'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
      Loading dependency graph…
    </div>
  ),
})

const DiagramViewer = dynamic(() => import('@/components/DiagramViewer'), {
  ssr: false,
  loading: () => (
    <div className="h-48 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
      Loading diagram…
    </div>
  ),
})

export const metadata: Metadata = {
  title: 'Reform Dependencies — SA Policy Space',
  description: 'Interactive dependency graph showing how reforms sequence and unlock each other across the five SA policy packages.',
}

const PACKAGES = [
  {
    id: 1,
    name: 'Infrastructure Unblocking',
    svg: '/diagrams/pkg1_infrastructure_unblock.svg',
    badge: 'bg-amber-100 text-amber-800 ring-amber-300/60',
    dot: 'bg-amber-400',
  },
  {
    id: 2,
    name: 'SMME & Employment',
    svg: '/diagrams/pkg2_smme_employment.svg',
    badge: 'bg-blue-100 text-blue-800 ring-blue-300/60',
    dot: 'bg-blue-400',
  },
  {
    id: 3,
    name: 'Human Capital Pipeline',
    svg: '/diagrams/pkg3_human_capital_pipeline.svg',
    badge: 'bg-purple-100 text-purple-800 ring-purple-300/60',
    dot: 'bg-purple-400',
  },
  {
    id: 4,
    name: 'Trade & Industrial Competitiveness',
    svg: '/diagrams/pkg4_trade_industrial_competitiveness.svg',
    badge: 'bg-teal-100 text-teal-800 ring-teal-300/60',
    dot: 'bg-teal-400',
  },
  {
    id: 5,
    name: 'State Capacity & Governance',
    svg: '/diagrams/pkg5_state_capacity_governance.svg',
    badge: 'bg-slate-100 text-slate-700 ring-slate-300/60',
    dot: 'bg-slate-400',
  },
]

export default function DependenciesPage() {
  return (
    <div className="space-y-10">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reform Dependencies</h1>
        <p className="mt-2 text-gray-500 text-sm max-w-2xl">
          How reforms sequence and unlock each other across the five policy packages.
          Hover nodes to see connections, click for details, drag to rearrange, scroll to zoom.
          Filter by package or status, or search by idea name.
        </p>
      </div>

      {/* Interactive D3 graph */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Interactive Dependency Graph</h2>
          <Link href="/packages" className="text-xs text-sa-green hover:underline">
            Browse reform packages →
          </Link>
        </div>
        <DependencyGraph />
      </section>

      {/* Static flow diagrams (reference) */}
      <section className="space-y-3">
        <details className="group border border-gray-200 rounded-xl overflow-hidden">
          <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer select-none bg-white hover:bg-gray-50 transition-colors [&::-webkit-details-marker]:hidden">
            <span className="font-medium text-gray-700 text-sm">Static flow diagrams (reference)</span>
            <svg
              className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0 transition-transform group-open:rotate-180"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>

          <div className="px-5 pb-5 pt-3 border-t border-gray-100 bg-gray-50/50 space-y-3">
            <p className="text-xs text-gray-500 mb-4">
              Pre-generated SVG diagrams showing dependency flow within each package.
            </p>

            {/* Overview */}
            <details className="group/inner border border-gray-200 rounded-xl overflow-hidden">
              <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none bg-white hover:bg-gray-50 transition-colors [&::-webkit-details-marker]:hidden">
                <span className="font-medium text-gray-900 text-sm">Overview: All Packages</span>
                <svg
                  className="w-4 h-4 text-gray-400 ml-auto flex-shrink-0 transition-transform group-open/inner:rotate-180"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50/50">
                <DiagramViewer
                  src="/diagrams/overview_packages.svg"
                  alt="Overview dependency flow diagram across all reform packages"
                  defaultZoom={0.8}
                />
              </div>
            </details>

            {/* Per-package */}
            {PACKAGES.map(pkg => (
              <details key={pkg.id} className="group/inner border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none bg-white hover:bg-gray-50 transition-colors [&::-webkit-details-marker]:hidden">
                  <span className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold ${pkg.dot}`}>
                    {pkg.id}
                  </span>
                  <span className={`badge ring-1 ${pkg.badge}`}>Package {pkg.id}</span>
                  <span className="font-medium text-gray-900 text-sm">{pkg.name}</span>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="ml-auto text-xs text-sa-green hover:underline mr-3"
                  >
                    View package →
                  </Link>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0 transition-transform group-open/inner:rotate-180"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 pt-3 border-t border-gray-100 bg-gray-50/50">
                  <DiagramViewer
                    src={pkg.svg}
                    alt={`Dependency flow diagram for Package ${pkg.id}: ${pkg.name}`}
                  />
                </div>
              </details>
            ))}
          </div>
        </details>
      </section>

    </div>
  )
}
