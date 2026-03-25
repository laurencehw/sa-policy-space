import { NextResponse } from "next/server";
import { getIdeas } from "@/lib/api";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

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
    const data = await getIdeas({ search, constraint, status, sort, packageId, timeHorizon });
    return NextResponse.json({ version: "1", data, meta: { count: data.length } }, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json({ version: "1", data: [], meta: { count: 0 } }, { headers: CORS_HEADERS });
  }
}
