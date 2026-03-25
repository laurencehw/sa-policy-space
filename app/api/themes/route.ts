import { NextResponse } from "next/server";
import { getConstraintSummaries } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getConstraintSummaries());
  } catch {
    return NextResponse.json([]);
  }
}
