import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    let data;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getIdeas } = await import("@/lib/supabase-api");
      data = await getIdeas({ search, constraint, status, sort, packageId, timeHorizon });
    } else {
      const { getIdeas } = await import("@/lib/local-api");
      data = getIdeas({ search, constraint, status, sort, packageId, timeHorizon });
    }
    return NextResponse.json({
      version: "1",
      data,
      meta: { count: data.length },
    });
  } catch {
    return NextResponse.json({ version: "1", data: [], meta: { count: 0 } });
  }
}
