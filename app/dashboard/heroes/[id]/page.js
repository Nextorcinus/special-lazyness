'use client'

import HeroDetail from '../../../components/HeroDetail'

export default function Page({ params }) {
  return (
    <div className="min-h-screen ">
      <HeroDetail initialId={params.id} />
    </div>
  )
}
