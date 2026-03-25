import { NextResponse } from "next/server";
import { getStats } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json(await getStats());
  } catch {
    return NextResponse.json({ totalIdeas: 0, meetingsAnalyzed: 0, constraintsCovered: 0, dormantIdeas: 0 });
  }
}
