import { NextResponse } from 'next/server'
import graphData from '@/data/dependency_graph.json'

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(graphData)
}
