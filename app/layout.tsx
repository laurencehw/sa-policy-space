import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import NavDropdown from "@/components/NavDropdown";

export const metadata: Metadata = {
  title: "SA Policy Space",
  description:
    "Tracking policy ideas for South African economic growth — curated from parliamentary committee proceedings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              {/* SA flag stripe accent */}
              <span className="flex gap-0.5">
                <span className="w-1 h-5 bg-sa-green rounded-sm" />
                <span className="w-1 h-5 bg-sa-gold rounded-sm" />
                <span className="w-1 h-5 bg-sa-red rounded-sm" />
              </span>
              <span className="font-semibold text-gray-900">SA Policy Space</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
              <Link href="/ideas" className="px-2.5 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors">
                Ideas
              </Link>
              <Link href="/packages" className="px-2.5 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors">
                Packages
              </Link>
              <Link href="/themes" className="px-2.5 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors">
                By Constraint
              </Link>

              {/* Analyse dropdown */}
              <NavDropdown label="Analyse">
                <Link href="/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Analytics
                </Link>
                <Link href="/dependencies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Dependencies
                </Link>
                <Link href="/stakeholders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Stakeholders
                </Link>
                <Link href="/reform-index" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Reform Index
                </Link>
                <Link href="/comparisons" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  International Comparisons
                </Link>
                <Link href="/budget" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Budget Alignment
                </Link>
              </NavDropdown>

              {/* Policy Tools dropdown */}
              <NavDropdown label="Policy Tools">
                <Link href="/accountability" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Accountability Dashboard
                </Link>
                <Link href="/briefs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Brief Generator
                </Link>
                <Link href="/teaching" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  Teaching
                </Link>
                <Link href="/api-docs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  API Docs
                </Link>
              </NavDropdown>

              <Link href="/about" className="px-2.5 py-1.5 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors">
                About
              </Link>

              <a
                href="/documents/SA_Growth_Agenda_Integrated_Framework.docx"
                download
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-sa-green/10 text-sa-green hover:bg-sa-green/20 transition-colors text-xs font-medium ml-1"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Report
              </a>
            </nav>

            {/* Mobile nav toggle placeholder */}
            <button className="sm:hidden p-2 text-gray-500" aria-label="Open menu">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
          {children}
        </main>

        <footer className="border-t border-gray-200 mt-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-2">
            <p>SA Policy Space — independent research. Source data via <a href="https://pmg.org.za" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">PMG</a>.</p>
            <p>Policy ideas are original synthesis, not PMG verbatim text.</p>
            <p>
              Built by{" "}
              <a href="https://github.com/laurencehw/" className="underline hover:text-gray-700" target="_blank" rel="noopener noreferrer">
                Laurence Wilse-Samson
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
