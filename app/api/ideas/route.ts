import { NextResponse } from "next/server";
import { getIdeas } from "@/lib/api";

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
  const limit = Math.min(Math.max(1, Number(searchParams.get("limit")) || 200), 200);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);

  try {
    const { rows, total } = await getIdeas({ search, constraint, status, sort, packageId, timeHorizon, limit, offset });
    return NextResponse.json({
      data: rows,
      meta: { total, limit, offset },
    });
  } catch (err) {
    console.error("ideas route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
