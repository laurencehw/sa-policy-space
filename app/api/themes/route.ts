import { NextResponse } from "next/server";
import { getConstraintSummaries } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  try {
    return NextResponse.json(await getConstraintSummaries());
  } catch (err) {
    console.error("themes route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
