import HeroList from '../../components/HeroList'
import { headers } from 'next/headers'

export default async function HeroesDashboardPage() {
  const host = headers().get('host')
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
  const base = `${protocol}://${host}`

  const res = await fetch(`${base}/api/heroes/index`, {
    next: { revalidate: 10 }
  })
  const heroes = await res.json()

  return <HeroList heroes={heroes} />
}
