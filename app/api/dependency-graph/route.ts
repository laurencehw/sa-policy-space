import { NextResponse } from 'next/server'
import graphData from '@/data/dependency_graph.json'

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(graphData)
}
