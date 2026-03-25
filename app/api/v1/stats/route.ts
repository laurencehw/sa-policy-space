import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    let data;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getStats } = await import("@/lib/supabase-api");
      data = await getStats();
    } else {
      const { getStats } = await import("@/lib/local-api");
      data = getStats();
    }
    return NextResponse.json({ version: "1", data });
  } catch {
    return NextResponse.json({
      version: "1",
      data: { totalIdeas: 0, meetingsAnalyzed: 0, constraintsCovered: 0, dormantIdeas: 0 },
    });
  }
}
