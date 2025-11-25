import HeroDetail from '@/app/components/HeroDetail'
import { headers } from 'next/headers'

export default async function HeroDetailPage({ params }) {
  const { id } = params

  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const base = `${protocol}://${host}`

  const res = await fetch(`${base}/api/heroes/${id}`, {
    cache: 'force-cache'
  })
  const hero = await res.json()

  return <HeroDetail initialId={id} initialHero={hero} />
}
