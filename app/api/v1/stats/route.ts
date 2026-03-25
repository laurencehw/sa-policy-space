import { NextResponse } from "next/server";
import { getStats } from "@/lib/api";

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
    const data = await getStats();
    return NextResponse.json({ version: "1", data }, { headers: CORS_HEADERS });
  } catch {
    return NextResponse.json({
      version: "1",
      data: { totalIdeas: 0, meetingsAnalyzed: 0, constraintsCovered: 0, dormantIdeas: 0 },
    }, { headers: CORS_HEADERS });
  }
}
