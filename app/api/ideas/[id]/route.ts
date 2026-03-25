import { NextResponse } from "next/server";
import { getIdeaById, getImplementationPlan, getIdeaMeetings } from "@/lib/api";

export const revalidate = 3600;

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json(null, { status: 404 });

  try {
    const idea = await getIdeaById(id);
    if (!idea) return NextResponse.json(null, { status: 404 });
    const [plan, meetings] = await Promise.all([
      getImplementationPlan(id),
      getIdeaMeetings(id),
    ]);
    return NextResponse.json({ idea, plan, meetings });
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
