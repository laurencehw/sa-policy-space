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

  try {
    return NextResponse.json(await getIdeas({ search, constraint, status, sort, packageId, timeHorizon }));
  } catch (err) {
    console.error("ideas route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
