'use client'

import HeroDetail from '../../../components/HeroDetail'

export default function HeroDetailPage({ params }) {
  return <HeroDetail initialId={params.id} />
}
