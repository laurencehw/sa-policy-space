import { NextResponse } from "next/server";
import { getIdeaComparisons, getComparisons } from "@/lib/api";

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
    return NextResponse.json(await getComparisons({ country, constraint }));
  } catch {
    return NextResponse.json([]);
  }
}
