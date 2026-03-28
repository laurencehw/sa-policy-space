"use client";

import dynamic from "next/dynamic";

export const DependencyGraph = dynamic(
  () => import("@/components/DependencyGraph"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] rounded-xl border border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-3">
        <div
          className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "#007A4D40", borderTopColor: "#007A4D" }}
        />
        <p className="text-gray-400 text-sm">
          Rendering 123-node dependency graph...
        </p>
        <p className="text-gray-300 text-xs">
          Hover nodes to see connections, click for details, drag to rearrange
        </p>
      </div>
    ),
  }
);

export const DiagramViewer = dynamic(
  () => import("@/components/DiagramViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="h-48 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
        Loading diagram…
      </div>
    ),
  }
);
