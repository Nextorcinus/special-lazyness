import { NextResponse } from 'next/server'
import fireData from '../../../../app/data/buildings.json'

export async function GET() {
  return NextResponse.json(fireData, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
    },
  })
}
