import { NextResponse } from "next/server";
import { getPackageSummaries, getPackageTimeHorizonCounts } from "@/lib/api";

export const dynamic = "force-dynamic";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    const [summaries, horizonCounts] = await Promise.all([
      getPackageSummaries(),
      getPackageTimeHorizonCounts(),
    ]);
    const data = summaries.map((s) => ({
      ...s,
      horizon_counts: horizonCounts[s.package_id] ?? { quick_win: 0, medium_term: 0, long_term: 0 },
    }));
    return NextResponse.json({ version: "1", data, meta: { count: data.length } }, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json({ version: "1", data: [], meta: { count: 0 } }, { headers: CORS_HEADERS });
  }
}
