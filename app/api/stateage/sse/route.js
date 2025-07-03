// app/api/stateage/sse/route.js
import stateAges from '../../../../data/state_age.json'

export async function GET(request) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const json = JSON.stringify(stateAges)
      controller.enqueue(encoder.encode(`data: ${json}\n\n`))
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
