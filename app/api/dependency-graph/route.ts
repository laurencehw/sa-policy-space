import { NextResponse } from 'next/server'
import graphData from '@/data/dependency_graph.json'

export const revalidate = 86400; // cache for 24 hours — graph data changes rarely

export async function GET() {
  return NextResponse.json(graphData)
}
