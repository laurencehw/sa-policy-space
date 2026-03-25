import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getTimelineData } = await import("@/lib/supabase-api");
      return NextResponse.json(await getTimelineData());
    } else {
      const { getTimelineData } = await import("@/lib/local-api");
      return NextResponse.json(getTimelineData());
    }
  } catch (err) {
    console.error("Timeline API error:", err);
    return NextResponse.json([]);
  }
}
