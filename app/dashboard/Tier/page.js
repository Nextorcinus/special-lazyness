'use client'

import TierList from '../../components/TierList'
import Link from "next/link"

export default function Page() {
  return (
    <div className="p-1 md:p-6 space-y-2">
        <Link
        href="/dashboard/heroes"
        className="text-green-400 hover:underline mb-12"
        >
        ← BACK
        </Link>

      <h1 className="text-3xl font-bold text-white mb-6">
        Hero Tier List Bear Hunt
      </h1>

      <TierList />
    </div>
  )
}
