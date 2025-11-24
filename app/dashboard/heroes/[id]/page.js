'use client'

import HeroDetail from '../app/components/HeroDetail.js'

export default function Page({ params }) {
  return (
    <div className="min-h-screen ">
      <HeroDetail initialId={params.id} />
    </div>
  )
}
