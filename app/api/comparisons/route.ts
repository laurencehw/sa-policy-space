import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country") ?? undefined;
  const constraint = searchParams.get("constraint") ?? undefined;
  const ideaIdParam = searchParams.get("ideaId");
  const ideaId = ideaIdParam ? Number(ideaIdParam) : undefined;

  try {
    if (ideaId) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const { getIdeaComparisons } = await import("@/lib/supabase-api");
        return NextResponse.json(await getIdeaComparisons(ideaId));
      } else {
        const { getIdeaComparisons } = await import("@/lib/local-api");
        return NextResponse.json(getIdeaComparisons(ideaId));
      }
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getComparisons } = await import("@/lib/supabase-api");
      return NextResponse.json(await getComparisons({ country, constraint }));
    } else {
      const { getComparisons } = await import("@/lib/local-api");
      return NextResponse.json(getComparisons({ country, constraint }));
    }
  } catch {
    return NextResponse.json([]);
  }
}
