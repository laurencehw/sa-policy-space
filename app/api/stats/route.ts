import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getStats } = await import("@/lib/supabase-api");
      return NextResponse.json(await getStats());
    } else {
      const { getStats } = await import("@/lib/local-api");
      return NextResponse.json(getStats());
    }
  } catch {
    return NextResponse.json({ totalIdeas: 0, meetingsAnalyzed: 0, constraintsCovered: 0, dormantIdeas: 0 });
  }
}
