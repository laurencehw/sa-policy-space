import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getPackageSummaries, getPackageTimeHorizonCounts } = await import("@/lib/supabase-api");
      const summaries = getPackageSummaries();
      const horizonCounts = await getPackageTimeHorizonCounts();
      const result = summaries.map((s: any) => ({
        ...s,
        horizon_counts: horizonCounts[s.package_id] ?? { quick_win: 0, medium_term: 0, long_term: 0 },
      }));
      return NextResponse.json(result);
    } else {
      const { getPackageSummaries, getPackageTimeHorizonCounts } = await import("@/lib/local-api");
      const summaries = getPackageSummaries();
      const horizonCounts = getPackageTimeHorizonCounts();
      const result = summaries.map((s) => ({
        ...s,
        horizon_counts: horizonCounts[s.package_id] ?? { quick_win: 0, medium_term: 0, long_term: 0 },
      }));
      return NextResponse.json(result);
    }
  } catch (err) {
    console.error("packages route error:", err);
    return NextResponse.json([]);
  }
}
