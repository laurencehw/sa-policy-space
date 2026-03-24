"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on outside tap or click
  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 text-gray-500"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50 py-3 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <nav className="flex flex-col px-4 gap-0.5 text-sm text-gray-700">
            {/* Primary — visually prominent */}
            <Link href="/ideas" onClick={close} className="px-3 py-2.5 rounded-md font-medium text-gray-900 hover:bg-sa-green/10 active:bg-sa-green/15">Ideas</Link>
            <Link href="/packages" onClick={close} className="px-3 py-2.5 rounded-md font-medium text-gray-900 hover:bg-sa-green/10 active:bg-sa-green/15">Packages</Link>

            <div className="h-px bg-gray-100 my-2" />

            {/* Analyse */}
            <p className="px-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Analyse</p>
            <Link href="/analytics" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Analytics</Link>
            <Link href="/progress" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Reform Progress</Link>
            <Link href="/matrix" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Feasibility Matrix</Link>
            <Link href="/compare" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Compare Ideas</Link>
            <Link href="/timeline" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Parliamentary Timeline</Link>
            <Link href="/dependencies" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Dependencies</Link>
            <Link href="/stakeholders" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Stakeholders</Link>
            <Link href="/simulator" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Feasibility Simulator</Link>
            <Link href="/reform-index" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Reform Index</Link>
            <Link href="/brrr" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">BRRR Recommendations</Link>
            <Link href="/sequencing" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Reform Sequencing</Link>
            <Link href="/themes" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">By Constraint</Link>

            <div className="h-px bg-gray-100 my-2" />

            {/* Resources */}
            <p className="px-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">Resources</p>
            <Link href="/documents" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Document Generator</Link>
            <Link href="/budget" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Budget Alignment</Link>
            <Link href="/comparisons" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">International Comparisons</Link>
            <Link href="/accountability" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Accountability Dashboard</Link>
            <Link href="/briefs" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Brief Generator</Link>
            <Link href="/teaching" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Teaching</Link>
            <Link href="/api-docs" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">API Docs</Link>
            <Link href="/methodology" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">Methodology</Link>
            <Link href="/about" onClick={close} className="px-5 py-2 rounded-md hover:bg-gray-50 active:bg-gray-100">About</Link>

            <a
              href="/documents/SA_Growth_Agenda_Integrated_Framework.docx"
              download
              onClick={close}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-md text-sa-green font-medium hover:bg-sa-green/5 active:bg-sa-green/10"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Download Report
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
