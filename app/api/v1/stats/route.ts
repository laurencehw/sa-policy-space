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
  } catch (err) {
    console.error("v1 stats route error:", err);
    return NextResponse.json({ version: "1", error: "Internal error" }, { status: 500, headers: CORS_HEADERS });
  }
}
