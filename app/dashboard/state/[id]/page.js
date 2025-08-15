import dynamic from 'next/dynamic'

// Disable SSR karena SSE hanya bisa di client
const LiveStatePage = dynamic(() => import('@/app/components/LiveStatePage'), {
  ssr: false,
})

export default function StatePage({ params }) {
  return <LiveStatePage stateId={params.id} />
}
