import { NextResponse } from 'next/server'
import basicData from '../../../../data/BasicBuilding.json'

export async function GET() {
  return NextResponse.json(basicData, {
    status: 200,
    headers: {
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
    },
  })
}
