"use client";

import { useState } from "react";
import glossaryData from "@/data/glossary.json";

interface TranslationEntry {
  text: string;
  note?: string;
}

interface GlossaryTerm {
  id: string;
  term: string;
  fullTerm?: string;
  category: string;
  definition: string;
  translations: {
    af: TranslationEntry;
    zu: TranslationEntry;
    xh: TranslationEntry;
  };
}

const terms = glossaryData as GlossaryTerm[];

interface GlossaryTooltipProps {
  /** The `id` field of the glossary term (e.g. "gdp", "load-shedding") */
  termId: string;
  children: React.ReactNode;
}

/**
 * Wraps text with a dotted underline and shows a definition tooltip on hover.
 * Import and use on idea pages where a glossary term appears in context.
 *
 * Example:
 *   <GlossaryTooltip termId="bbbee">BBBEE compliance requirements</GlossaryTooltip>
 */
export default function GlossaryTooltip({
  termId,
  children,
}: GlossaryTooltipProps) {
  const [visible, setVisible] = useState(false);
  const term = terms.find((t) => t.id === termId);

  if (!term) return <>{children}</>;

  return (
    <span
      className="relative inline"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span
        className="border-b border-dotted border-sa-green cursor-help"
        tabIndex={0}
        role="button"
        aria-describedby={`glossary-tooltip-${termId}`}
      >
        {children}
      </span>
      {visible && (
        <span
          id={`glossary-tooltip-${termId}`}
          role="tooltip"
          className="absolute bottom-full left-0 mb-2 z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg text-xs pointer-events-none"
        >
          <span className="block font-semibold text-gray-900 mb-1">
            {term.term}
            {term.fullTerm && (
              <span className="font-normal text-gray-500">
                {" "}
                — {term.fullTerm}
              </span>
            )}
          </span>
          <span className="block text-gray-600 leading-relaxed">
            {term.definition}
          </span>
          <span className="block mt-1.5 text-sa-green/70 font-medium">
            → View in glossary
          </span>
        </span>
      )}
    </span>
  );
}
