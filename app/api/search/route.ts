import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

import stakeholdersData from "@/data/stakeholders.json";
import comparisonsData from "@/data/international_comparisons.json";
import textbookChapters from "@/data/textbook_chapters.json";
import reformPackagesData from "@/data/reform_packages.json";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (!raw || raw.length < 2) {
    return NextResponse.json({
      ideas: [],
      packages: [],
      stakeholders: [],
      comparisons: [],
      chapters: [],
    });
  }
  // Cap query length to prevent abuse
  const q = raw.slice(0, 200).toLowerCase();

  // ── Ideas ────────────────────────────────────────────────────────────────
  let ideas: Array<{
    id: number;
    title: string;
    description: string;
    slug: string;
    binding_constraint: string;
  }> = [];
  try {
    const { getIdeas } = await import("@/lib/api");
    const rows = await getIdeas({ search: q });
    ideas = rows.slice(0, 6).map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      slug: r.slug || slugify(r.title),
      binding_constraint: r.binding_constraint,
    }));
  } catch (e) {
    console.error("Search ideas error:", e);
  }

  // ── Packages (bundled JSON) ───────────────────────────────────────────────
  const packages = (Object.values(reformPackagesData) as any[])
    .filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.tagline?.toLowerCase().includes(q) ||
        p.theory_of_change?.toLowerCase().includes(q)
    )
    .slice(0, 4)
    .map((p) => ({
      id: p.package_id,
      name: p.name,
      tagline: p.tagline,
    }));

  // ── Stakeholders (bundled JSON) ───────────────────────────────────────────
  const stakeholders = (stakeholdersData as any[])
    .filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.primary_interests?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      primary_interests: s.primary_interests,
    }));

  // ── International Comparisons (bundled JSON) ──────────────────────────────
  const comparisons = ((comparisonsData as any).comparisons as any[])
    .filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.approach?.toLowerCase().includes(q) ||
        c.country?.toLowerCase().includes(q) ||
        c.constraint_label?.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      title: c.title,
      country: c.country,
      flag: c.flag,
      constraint_label: c.constraint_label,
    }));

  // ── Textbook Chapters (bundled JSON) ─────────────────────────────────────
  const chapters = (textbookChapters as any[])
    .filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    )
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      number: c.number,
      title: c.title,
    }));

  return NextResponse.json({ ideas, packages, stakeholders, comparisons, chapters });
}
