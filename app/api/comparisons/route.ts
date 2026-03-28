import { NextResponse } from "next/server";
import { getIdeaComparisons, getComparisons } from "@/lib/api";
import jsonComparisons from "@/data/international_comparisons.json";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") ?? undefined;
  const constraint = searchParams.get("constraint") ?? undefined;
  const ideaIdParam = searchParams.get("ideaId");
  const ideaId = ideaIdParam ? Number(ideaIdParam) : undefined;

  try {
    if (ideaId) {
      return NextResponse.json(await getIdeaComparisons(ideaId));
    }
    const dbResults = await getComparisons({ country, constraint });
    if (dbResults.length > 0) {
      return NextResponse.json(dbResults);
    }
    // Fallback to JSON file if DB table is empty/missing
    let fallback = (jsonComparisons as any).comparisons ?? jsonComparisons;
    if (country) fallback = fallback.filter((c: any) => c.country === country);
    if (constraint) fallback = fallback.filter((c: any) => c.binding_constraint === constraint);
    return NextResponse.json(fallback);
  } catch (err) {
    console.error("comparisons route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
