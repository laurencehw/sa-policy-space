'use client'

import { useState } from 'react'

interface DiagramViewerProps {
  src: string
  alt: string
  defaultZoom?: number
}

export default function DiagramViewer({ src, alt, defaultZoom = 1 }: DiagramViewerProps) {
  const [zoom, setZoom] = useState(defaultZoom)

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
        <button
          onClick={() => setZoom(z => Math.max(0.3, parseFloat((z - 0.2).toFixed(1))))}
          className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center leading-none transition-colors"
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="w-12 text-center text-xs tabular-nums">{Math.round(zoom * 100)}%</span>
        <button
          onClick={() => setZoom(z => Math.min(4, parseFloat((z + 0.2).toFixed(1))))}
          className="w-7 h-7 rounded border border-gray-200 hover:bg-gray-50 flex items-center justify-center leading-none transition-colors"
          aria-label="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoom(1)}
          className="text-xs text-gray-400 hover:text-gray-700 ml-1 transition-colors"
        >
          Reset
        </button>
        <a
          href={src}
          download
          className="ml-auto text-xs text-sa-green hover:underline"
        >
          ↓ Download SVG
        </a>
      </div>

      {/* Scrollable diagram container */}
      <div
        className="overflow-auto rounded-xl border border-gray-200 bg-white p-4"
        style={{ maxHeight: '70vh', minHeight: '200px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          style={{ width: `${zoom * 900}px`, height: 'auto', maxWidth: 'none', display: 'block' }}
        />
      </div>
    </div>
  )
}
