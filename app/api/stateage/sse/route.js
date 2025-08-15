import stateAges from '../app/data/stateAges.json'

export async function GET() {
  return new Response(JSON.stringify(stateAges), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store', // biar selalu fresh
    },
  })
}
