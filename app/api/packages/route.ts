import { NextResponse } from "next/server";
import { getPackageSummaries, getPackageTimeHorizonCounts } from "@/lib/api";

export const revalidate = 3600;

export async function GET() {
  try {
    const [summaries, horizonCounts] = await Promise.all([
      getPackageSummaries(),
      getPackageTimeHorizonCounts(),
    ]);
    const result = summaries.map((s) => ({
      ...s,
      horizon_counts: horizonCounts[s.package_id] ?? { quick_win: 0, medium_term: 0, long_term: 0 },
    }));
    return NextResponse.json(result);
  } catch (err) {
    console.error("packages route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
