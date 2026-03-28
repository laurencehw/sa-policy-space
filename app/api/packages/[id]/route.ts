import { NextResponse } from "next/server";
import { getPackageDetail } from "@/lib/api";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const packageId = Number((await params).id);
  if (isNaN(packageId)) {
    return NextResponse.json({ error: "Invalid package id" }, { status: 400 });
  }

  try {
    const detail = await getPackageDetail(packageId);
    if (!detail) return NextResponse.json({ error: "Package not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch (err) {
    console.error("package detail route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
