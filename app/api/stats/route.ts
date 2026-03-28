import { NextResponse } from "next/server";
import { getStats } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json(await getStats());
  } catch (err) {
    console.error("stats route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
