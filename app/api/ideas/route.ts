import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const constraint = searchParams.get("constraint") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;
  const packageParam = searchParams.get("package");
  const packageId = packageParam ? Number(packageParam) : undefined;
  const timeHorizon = searchParams.get("timeHorizon") ?? undefined;

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getIdeas } = await import("@/lib/supabase-api");
      return NextResponse.json(await getIdeas({ search, constraint, status, sort, packageId, timeHorizon }));
    } else {
      const { getIdeas } = await import("@/lib/local-api");
      return NextResponse.json(getIdeas({ search, constraint, status, sort, packageId, timeHorizon }));
    }
  } catch {
    return NextResponse.json([]);
  }
}
