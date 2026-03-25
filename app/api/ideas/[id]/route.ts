import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return NextResponse.json(null, { status: 404 });

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const { getIdeaById, getImplementationPlan, getIdeaMeetings } = await import("@/lib/supabase-api");
      const idea = await getIdeaById(id);
      if (!idea) return NextResponse.json(null, { status: 404 });
      const [plan, meetings] = await Promise.all([
        getImplementationPlan(id),
        getIdeaMeetings(id),
      ]);
      return NextResponse.json({ idea, plan, meetings });
    } else {
      const { getIdeaById, getImplementationPlan, getIdeaMeetings } = await import("@/lib/local-api");
      const idea = getIdeaById(id);
      if (!idea) return NextResponse.json(null, { status: 404 });
      return NextResponse.json({
        idea,
        plan: getImplementationPlan(id),
        meetings: getIdeaMeetings(id),
      });
    }
  } catch {
    return NextResponse.json(null, { status: 500 });
  }
}
