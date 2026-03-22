import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getConstraintSummaries } = await import("@/lib/supabase-api");
      return NextResponse.json(await getConstraintSummaries());
    } else {
      const { getConstraintSummaries } = await import("@/lib/local-api");
      return NextResponse.json(getConstraintSummaries());
    }
  } catch {
    return NextResponse.json([]);
  }
}
