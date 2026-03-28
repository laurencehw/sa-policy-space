import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const startedAt = Date.now();

export async function GET() {
  const uptime = Math.floor((Date.now() - startedAt) / 1000);

  let db = "unknown";
  let ideaCount = 0;
  try {
    const { getStats } = await import("@/lib/api");
    const stats = await getStats();
    ideaCount = stats.totalIdeas;
    db = "ok";
  } catch {
    db = "error";
  }

  return NextResponse.json({
    status: db === "ok" ? "healthy" : "degraded",
    uptime,
    db,
    ideas: ideaCount,
    timestamp: new Date().toISOString(),
  });
}
