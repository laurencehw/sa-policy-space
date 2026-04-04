'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { select } from 'd3-selection'
import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide } from 'd3-force'
import { zoom as d3Zoom, zoomIdentity } from 'd3-zoom'
import { drag as d3Drag } from 'd3-drag'
import 'd3-transition' // side-effect import: adds .transition() to selections
import type { SimulationNodeDatum, SimulationLinkDatum, ZoomBehavior } from 'd3'
import Link from 'next/link'
import { slugify } from '@/lib/utils'

// ── Types ───────────────────────────────────────────────────────────────────

interface GraphNode extends SimulationNodeDatum {
  id: number
  title: string
  source_committee: string
  theme: string
  binding_constraint: string
  current_status: string
  feasibility_rating: number | null
  growth_impact_rating: number
  reform_package: number
  package_name: string
  time_horizon: string
}

interface GraphLink extends SimulationLinkDatum<GraphNode> {
  label: string
}

interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}

// ── Constants ───────────────────────────────────────────────────────────────

const PACKAGE_COLORS: Record<number, string> = {
  1: '#f59e0b', // amber  — Infrastructure Unblock
  2: '#3b82f6', // blue   — SMME & Employment
  3: '#a855f7', // purple — Human Capital Pipeline
  4: '#14b8a6', // teal   — Trade & Industrial Competitiveness
  5: '#64748b', // slate  — State Capacity & Governance
}

const PACKAGE_NAMES: Record<number, string> = {
  1: 'Infrastructure Unblock',
  2: 'SMME & Employment',
  3: 'Human Capital Pipeline',
  4: 'Trade & Industrial Competitiveness',
  5: 'State Capacity & Governance',
}

const STATUS_COLORS: Record<string, string> = {
  implemented:           '#22c55e',
  partially_implemented: '#eab308',
  under_review:          '#60a5fa',
  debated:               '#f97316',
  in_progress:           '#f97316',
  stalled:               '#ef4444',
  proposed:              '#d1d5db',
}

const STATUS_LABELS: Record<string, string> = {
  implemented:           'Implemented',
  partially_implemented: 'Partial',
  under_review:          'Under Review',
  debated:               'Debated',
  in_progress:           'In Progress',
  stalled:               'Stalled',
  proposed:              'Proposed',
}

const ALL_STATUSES = [
  'implemented',
  'partially_implemented',
  'under_review',
  'debated',
  'stalled',
  'proposed',
]

// ── Helpers ─────────────────────────────────────────────────────────────────

function nodeRadius(d: GraphNode): number {
  return 4 + d.growth_impact_rating * 2
}

// ── Component ────────────────────────────────────────────────────────────────

export default function DependencyGraph() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef       = useRef<SVGSVGElement>(null)
  const zoomRef      = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
  const tooltipRef   = useRef<HTMLDivElement>(null)

  const [graphData,      setGraphData]      = useState<GraphData | null>(null)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState<string | null>(null)
  const [activePackages, setActivePackages] = useState(new Set([1, 2, 3, 4, 5]))
  const [activeStatuses, setActiveStatuses] = useState(new Set(ALL_STATUSES))
  const [searchQuery,    setSearchQuery]    = useState('')
  const [selectedNode,   setSelectedNode]   = useState<GraphNode | null>(null)
  const [tooltipData,    setTooltipData]    = useState<GraphNode | null>(null)

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/dependency-graph')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data: GraphData) => {
        setGraphData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('[DependencyGraph] Failed to load:', err)
        setError('Failed to load dependency graph data.')
        setLoading(false)
      })
  }, [])

  // ── D3 initialisation (runs once when data arrives) ────────────────────────
  useEffect(() => {
    if (!graphData || !svgRef.current || !containerRef.current) return

    const container = containerRef.current
    const width  = container.clientWidth  || 900
    const height = 600

    const svg = select(svgRef.current)
    svg.attr('width', width).attr('height', height)
    svg.selectAll('*').remove()

    // ── Arrow markers ────────────────────────────────────────────────────────
    const defs = svg.append('defs')

    const addArrow = (id: string, color: string) =>
      defs.append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 10)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', color)

    addArrow('arrow',    '#94a3b8')
    addArrow('arrow-hi', '#475569')

    // ── Main group (zoom target) ─────────────────────────────────────────────
    const g = svg.append('g')

    // ── Copy data for simulation ─────────────────────────────────────────────
    const nodes: GraphNode[] = graphData.nodes.map(n => ({ ...n }))
    const links: GraphLink[] = graphData.links.map(l => ({ ...l }))

    // ── Package cluster centres (pentagon) ───────────────────────────────────
    const cx = width  / 2
    const cy = height / 2
    const clusterR = Math.min(width, height) * 0.27
    const pkgCenters: Record<number, { x: number; y: number }> = {}
    for (let i = 0; i < 5; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5
      pkgCenters[i + 1] = {
        x: cx + clusterR * Math.cos(angle),
        y: cy + clusterR * Math.sin(angle),
      }
    }

    // ── Force simulation ─────────────────────────────────────────────────────
    const simulation = forceSimulation<GraphNode, GraphLink>(nodes)
      .force(
        'link',
        forceLink<GraphNode, GraphLink>(links)
          .id(d => d.id)
          .distance(80)
          .strength(0.3),
      )
      .force('charge',  forceManyBody<GraphNode>().strength(-120))
      .force('center',  forceCenter(cx, cy))
      .force('collide', forceCollide<GraphNode>().radius(d => nodeRadius(d) + 6))
      .force('cluster', (alpha: number) => {
        for (const node of nodes) {
          const centre = pkgCenters[node.reform_package]
          if (!centre || node.x == null || node.y == null) continue
          node.vx = (node.vx ?? 0) + (centre.x - node.x) * 0.08 * alpha
          node.vy = (node.vy ?? 0) + (centre.y - node.y) * 0.08 * alpha
        }
      })

    // ── Links ────────────────────────────────────────────────────────────────
    const linkElems = g.append('g')
      .attr('class', 'links')
      .selectAll<SVGPathElement, GraphLink>('path')
      .data(links)
      .join('path')
      .attr('fill',        'none')
      .attr('stroke',      '#cbd5e1')
      .attr('stroke-width', 1.5)
      .attr('marker-end',  'url(#arrow)')

    // ── Node groups ──────────────────────────────────────────────────────────
    const nodeElems = g.append('g')
      .attr('class', 'nodes')
      .selectAll<SVGGElement, GraphNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-g')
      .style('cursor', 'pointer')

    nodeElems.append('circle')
      .attr('r',            nodeRadius)
      .attr('fill',         d => STATUS_COLORS[d.current_status] ?? '#d1d5db')
      .attr('fill-opacity', 0.9)
      .attr('stroke',       d => PACKAGE_COLORS[d.reform_package] ?? '#94a3b8')
      .attr('stroke-width', 2.5)

    // ── Events ───────────────────────────────────────────────────────────────
    nodeElems
      .on('mouseover', function (event: MouseEvent, d: GraphNode) {
        // Highlight connected edges
        linkElems
          .attr('stroke', (l: GraphLink) => {
            const s = (l.source as GraphNode).id ?? l.source
            const t = (l.target as GraphNode).id ?? l.target
            return s === d.id || t === d.id ? '#475569' : '#e2e8f0'
          })
          .attr('stroke-width', (l: GraphLink) => {
            const s = (l.source as GraphNode).id ?? l.source
            const t = (l.target as GraphNode).id ?? l.target
            return s === d.id || t === d.id ? 2.5 : 1
          })
          .attr('marker-end', (l: GraphLink) => {
            const s = (l.source as GraphNode).id ?? l.source
            const t = (l.target as GraphNode).id ?? l.target
            return s === d.id || t === d.id ? 'url(#arrow-hi)' : 'url(#arrow)'
          })

        // Dim unconnected nodes
        nodeElems.select('circle')
          .attr('fill-opacity', (n: GraphNode) => {
            if (n.id === d.id) return 1
            const connected = links.some((l: GraphLink) => {
              const s = (l.source as GraphNode).id ?? l.source
              const t = (l.target as GraphNode).id ?? l.target
              return (s === d.id && t === n.id) || (t === d.id && s === n.id)
            })
            return connected ? 0.85 : 0.18
          })

        // Tooltip (position only — content via React state)
        setTooltipData(d)
        if (tooltipRef.current) {
          tooltipRef.current.style.display = 'block'
          tooltipRef.current.style.left    = `${event.clientX + 16}px`
          tooltipRef.current.style.top     = `${event.clientY - 8}px`
        }
      })
      .on('mousemove', function (event: MouseEvent) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.clientX + 16}px`
          tooltipRef.current.style.top  = `${event.clientY - 8}px`
        }
      })
      .on('mouseout', function () {
        linkElems
          .attr('stroke',       '#cbd5e1')
          .attr('stroke-width', 1.5)
          .attr('marker-end',   'url(#arrow)')
        nodeElems.select('circle').attr('fill-opacity', 0.9)
        setTooltipData(null)
        if (tooltipRef.current) tooltipRef.current.style.display = 'none'
      })
      .on('click', function (_: MouseEvent, d: GraphNode) {
        setSelectedNode(d)
        setTooltipData(null)
        if (tooltipRef.current) tooltipRef.current.style.display = 'none'
      })

    // ── Drag ─────────────────────────────────────────────────────────────────
    nodeElems.call(
      d3Drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }),
    )

    // ── Zoom / pan ───────────────────────────────────────────────────────────
    const zoom = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.15, 6])
      .on('zoom', event => g.attr('transform', event.transform))

    svg.call(zoom)
    zoomRef.current = zoom

    // ── Tick ─────────────────────────────────────────────────────────────────
    simulation.on('tick', () => {
      linkElems.attr('d', (l: GraphLink) => {
        const source = l.source as GraphNode
        const target = l.target as GraphNode
        if (source.x == null || source.y == null || target.x == null || target.y == null) return ''
        const dx   = target.x - source.x
        const dy   = target.y - source.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist === 0) return ''
        const tr    = nodeRadius(target) + 3
        if (dist <= tr) return ''
        const ratio = (dist - tr) / dist
        return `M${source.x},${source.y}L${source.x + dx * ratio},${source.y + dy * ratio}`
      })

      nodeElems.attr('transform', (d: GraphNode) => `translate(${d.x ?? 0},${d.y ?? 0})`)
    })

    return () => {
      simulation.stop()
      // Remove D3 event listeners to prevent leaks on remount
      nodeElems
        .on('mouseover', null)
        .on('mousemove', null)
        .on('mouseout', null)
        .on('click', null)
        .on('.drag', null)
      svg.on('.zoom', null)
    }
  }, [graphData]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Filter / search visibility ────────────────────────────────────────────
  useEffect(() => {
    if (!svgRef.current || !graphData) return
    const q = searchQuery.toLowerCase().trim()

    select(svgRef.current)
      .selectAll<SVGGElement, GraphNode>('.node-g')
      .each(function (d) {
        const visible =
          (!q || d.title.toLowerCase().includes(q)) &&
          activePackages.has(d.reform_package) &&
          activeStatuses.has(d.current_status)
        select(this)
          .transition()
          .duration(200)
          .style('opacity',        visible ? 1 : 0.04)
          .style('pointer-events', visible ? 'auto' : 'none')
      })
  }, [activePackages, activeStatuses, searchQuery, graphData])

  // ── Callbacks ────────────────────────────────────────────────────────────
  const resetView = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      select(svgRef.current)
        .transition()
        .duration(750)
        .call(zoomRef.current.transform, zoomIdentity)
    }
  }, [])

  const resetAll = useCallback(() => {
    resetView()
    setActivePackages(new Set([1, 2, 3, 4, 5]))
    setActiveStatuses(new Set(ALL_STATUSES))
    setSearchQuery('')
    setSelectedNode(null)
  }, [resetView])

  const togglePackage = (id: number) =>
    setActivePackages(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleStatus = (s: string) =>
    setActiveStatuses(prev => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: '#007A4D40', borderTopColor: '#007A4D' }}
        />
        <p className="text-gray-400 text-sm">Loading dependency graph…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-gray-400">
        <p className="text-sm font-medium text-gray-600">{error}</p>
        <button
          onClick={() => { setError(null); setLoading(true); window.location.reload() }}
          className="text-xs text-sa-green hover:underline"
        >
          Try again
        </button>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">

      {/* ── Controls ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center bg-gray-50/70 border border-gray-200 rounded-xl px-4 py-3">

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search ideas…"
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sa-green/30 bg-white w-44"
        />

        {/* Package toggles */}
        <div className="flex flex-wrap gap-1.5">
          {([1, 2, 3, 4, 5] as const).map(id => (
            <button
              key={id}
              onClick={() => togglePackage(id)}
              title={PACKAGE_NAMES[id]}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                activePackages.has(id)
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-400 border-gray-200 opacity-50'
              }`}
              style={
                activePackages.has(id)
                  ? { backgroundColor: PACKAGE_COLORS[id], borderColor: PACKAGE_COLORS[id] }
                  : {}
              }
            >
              P{id}
            </button>
          ))}
        </div>

        {/* Status toggles */}
        <div className="flex flex-wrap gap-1.5">
          {ALL_STATUSES.map(status => (
            <button
              key={status}
              onClick={() => toggleStatus(status)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                activeStatuses.has(status)
                  ? 'text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-400 border-gray-200 opacity-50'
              }`}
              style={
                activeStatuses.has(status)
                  ? { backgroundColor: STATUS_COLORS[status], borderColor: STATUS_COLORS[status] }
                  : {}
              }
            >
              {STATUS_LABELS[status]}
            </button>
          ))}
        </div>

        {/* Reset + Export */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => {
              if (!svgRef.current) return
              const svgEl = svgRef.current
              const serializer = new XMLSerializer()
              const svgStr = serializer.serializeToString(svgEl)
              const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'sa-policy-dependency-graph.svg'
              a.click()
              URL.revokeObjectURL(url)
            }}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-white transition-colors"
            title="Download SVG for use in presentations or publications"
          >
            Export SVG
          </button>
          <button
            onClick={resetAll}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-white transition-colors"
          >
            Reset view
          </button>
        </div>
      </div>

      {/* ── Graph + side panel ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-4 items-start">

        {/* SVG */}
        <div
          ref={containerRef}
          className="flex-1 w-full border border-gray-200 rounded-xl overflow-hidden bg-white relative"
          style={{ minHeight: 'min(600px, 70vh)' }}
        >
          <svg ref={svgRef} className="w-full block" />
        </div>

        {/* Selected node panel */}
        {selectedNode && (
          <div className="w-full md:w-72 flex-shrink-0 border border-gray-200 rounded-xl bg-white p-4 space-y-3 self-start">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">
                {selectedNode.title}
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-700 flex-shrink-0 text-xl leading-none mt-0.5"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0 border-2"
                  style={{
                    borderColor:     PACKAGE_COLORS[selectedNode.reform_package],
                    backgroundColor: 'white',
                  }}
                />
                <span>{PACKAGE_NAMES[selectedNode.reform_package]}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[selectedNode.current_status] }}
                />
                <span>
                  {STATUS_LABELS[selectedNode.current_status] ?? selectedNode.current_status}
                </span>
              </div>

              <div>
                <span className="text-gray-400">Growth impact: </span>
                <span className="text-amber-500">
                  {'★'.repeat(selectedNode.growth_impact_rating)}
                  {'☆'.repeat(5 - selectedNode.growth_impact_rating)}
                </span>
                <span className="text-gray-400 ml-1">({selectedNode.growth_impact_rating}/5)</span>
              </div>

              {selectedNode.feasibility_rating != null && (
                <div>
                  <span className="text-gray-400">Feasibility: </span>
                  {selectedNode.feasibility_rating}/5
                </div>
              )}

              <div>
                <span className="text-gray-400">Committee: </span>
                {selectedNode.source_committee}
              </div>

              <div>
                <span className="text-gray-400">Horizon: </span>
                {selectedNode.time_horizon.replace(/_/g, ' ')}
              </div>
            </div>

            <Link
              href={`/ideas/${slugify(selectedNode.title)}`}
              className="block w-full text-center px-3 py-2 bg-sa-green text-white rounded-lg text-xs font-medium hover:bg-opacity-90 transition-colors"
            >
              View idea details →
            </Link>
          </div>
        )}
      </div>

      {/* ── Legend ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-6 text-xs text-gray-500 px-1 pt-1">
        <div>
          <div className="font-medium text-gray-700 mb-1.5">Packages (ring)</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {([1, 2, 3, 4, 5] as const).map(id => (
              <span key={id} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-full border-2 bg-white"
                  style={{ borderColor: PACKAGE_COLORS[id] }}
                />
                P{id}: {PACKAGE_NAMES[id]}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="font-medium text-gray-700 mb-1.5">Status (fill)</div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {ALL_STATUSES.map(s => (
              <span key={s} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[s] }}
                />
                {STATUS_LABELS[s]}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-400">
          <span>Node size = growth impact (1–5) · Click node for details · Drag to rearrange · Scroll to zoom</span>
        </div>
      </div>

      {/* ── Tooltip (imperatively positioned) ───────────────────────────── */}
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-xs max-w-xs pointer-events-none"
        style={{ display: 'none', left: 0, top: 0 }}
      >
        {tooltipData && (
          <>
            <div className="font-semibold text-gray-900 mb-1 leading-snug">{tooltipData.title}</div>
            <div className="text-gray-500 mb-1">{PACKAGE_NAMES[tooltipData.reform_package]}</div>
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_COLORS[tooltipData.current_status] }}
              />
              <span>{STATUS_LABELS[tooltipData.current_status] ?? tooltipData.current_status}</span>
              <span className="text-gray-400 ml-2">Impact {tooltipData.growth_impact_rating}/5</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
