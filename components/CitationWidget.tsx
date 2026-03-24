"use client";

import { useState } from "react";

interface CitationWidgetProps {
  title: string;
  slug: string;
}

const BASE_URL = "https://sa-policy-space.vercel.app";

function bibtexKey(slug: string): string {
  return "sapolicyspace2026_" + slug.replace(/-/g, "_");
}

export default function CitationWidget({ title, slug }: CitationWidgetProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<"apa" | "bibtex" | null>(null);

  const url = `${BASE_URL}/ideas/${slug}`;

  const apa = `SA Policy Space. (2026). ${title}. In Mapping South Africa's Path to Reform. NYU Wagner. Retrieved from ${url}`;

  const bibtex = `@misc{${bibtexKey(slug)},\n  title     = {${title}},\n  author    = {{SA Policy Space}},\n  year      = {2026},\n  booktitle = {Mapping South Africa's Path to Reform},\n  publisher = {NYU Wagner},\n  url       = {${url}}\n}`;

  function copy(text: string, format: "apa" | "bibtex") {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Cite this idea</span>
        </div>
        <span className="text-gray-400 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 py-4 space-y-5 bg-white">

          {/* APA */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">APA</span>
              <button
                onClick={() => copy(apa, "apa")}
                className="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                {copied === "apa" ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-700 font-mono leading-relaxed bg-gray-50 rounded-lg px-3 py-2 break-all">
              {apa}
            </p>
          </div>

          {/* BibTeX */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">BibTeX</span>
              <button
                onClick={() => copy(bibtex, "bibtex")}
                className="text-xs px-2.5 py-1 rounded border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                {copied === "bibtex" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-xs text-gray-700 font-mono leading-relaxed bg-gray-50 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre">
              {bibtex}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
}
