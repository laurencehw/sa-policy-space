import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    let data;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getPackageSummaries, getPackageTimeHorizonCounts } = await import("@/lib/supabase-api");
      const summaries = getPackageSummaries();
      const horizonCounts = await getPackageTimeHorizonCounts();
      data = summaries.map((s: any) => ({
        ...s,
        horizon_counts: horizonCounts[s.package_id] ?? { quick_win: 0, medium_term: 0, long_term: 0 },
      }));
    } else {
      const { getPackageSummaries, getPackageTimeHorizonCounts } = await import("@/lib/local-api");
      const summaries = getPackageSummaries();
      const horizonCounts = getPackageTimeHorizonCounts();
      data = summaries.map((s) => ({
        ...s,
        horizon_counts: horizonCounts[s.package_id] ?? { quick_win: 0, medium_term: 0, long_term: 0 },
      }));
    }
    return NextResponse.json({
      version: "1",
      data,
      meta: { count: data.length },
    });
  } catch {
    return NextResponse.json({ version: "1", data: [], meta: { count: 0 } });
  }
}
