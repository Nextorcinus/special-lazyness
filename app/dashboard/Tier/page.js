'use client'

import TierList from '../../components/TierList'

export default function Page() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Hero Tier List
      </h1>

      <TierList />
    </div>
  )
}
