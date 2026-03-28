import { NextResponse } from "next/server";
import { getTimelineData } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getTimelineData());
  } catch (err) {
    console.error("Timeline API error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
