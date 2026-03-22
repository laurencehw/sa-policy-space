import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const packageId = Number(params.id);
  if (isNaN(packageId)) {
    return NextResponse.json({ error: "Invalid package id" }, { status: 400 });
  }

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getPackageDetail } = await import("@/lib/supabase-api");
      const detail = await getPackageDetail(packageId);
      if (!detail) return NextResponse.json({ error: "Package not found" }, { status: 404 });
      return NextResponse.json(detail);
    } else {
      const { getPackageDetail } = await import("@/lib/local-api");
      const detail = getPackageDetail(packageId);
      if (!detail) return NextResponse.json({ error: "Package not found" }, { status: 404 });
      return NextResponse.json(detail);
    }
  } catch (err) {
    console.error("package detail route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
