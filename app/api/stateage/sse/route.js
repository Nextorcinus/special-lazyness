// app/api/stateage/route.js
import stateAges from '@/data/state_age.json'

export async function GET() {
  return new Response(JSON.stringify(stateAges), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}
