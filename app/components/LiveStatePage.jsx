'use client'
import { useEffect, useState } from 'react'
import milestoneData from '@/data/milestones.json'
import MilestoneCard from './MilestoneCard'

export default function LiveStatePage({ stateId }) {
  const [ageInDays, setAgeInDays] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)

  useEffect(() => {
    const es = new EventSource('/api/stateage/sse')
    es.onmessage = (e) => {
      const data = JSON.parse(e.data)
      const ts = data[stateId]
      if (ts) {
        const created = new Date(ts * 1000)
        const age = Math.floor((Date.now() - created.getTime()) / 86400000)
        setAgeInDays(age)
        setCreatedAt(created)
      }
    }
    return () => es.close()
  }, [stateId])

  if (!ageInDays) return <p className="text-white p-4">Loading state data...</p>

  let milestones = milestoneData.milestones

  //  ID state berada di range 1000–1099 because merger state
  if (Number(stateId) >= 1000 && Number(stateId) <= 1099) {
    milestones = milestones.map((m) => {
      // Ubah milestone 440 menjadi 460
      if (m.days === 440) {
        return { ...m, days: 470 }
      }
      return m
    })
  }

  const achieved = milestones
    .filter((m) => m.days <= ageInDays)
    .map((m) => ({ ...m, daysAgo: ageInDays - m.days }))

  const upcoming = milestones
    .filter((m) => m.days > ageInDays)
    .map((m) => ({ ...m, daysLeft: m.days - ageInDays }))

  return (
    <div className="p-4 md:p-6 text-white w-full">
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md space-y-2 mb-6">
        <h1 className="text-2xl font-bold mb-2">State {stateId}</h1>
        <p className="text-sm text-zinc-400">
          Created At: {createdAt.toUTCString()}
        </p>
        <p className="text-lime-400 mb-6">Age: {ageInDays} days</p>
      </div>

      <h2 className="text-xl mb-4 px-2 text-zinc-400">Upcoming Updates</h2>
      <div className="space-y-6">
        {upcoming.map((m) => (
          <MilestoneCard key={m.name} milestone={m} isUpcoming />
        ))}
      </div>

      {achieved.length > 0 && (
        <>
          <h2 className="text-xl mt-12 mb-4 px-2 text-zinc-400">
            Previous Updates
          </h2>
          <div className="space-y-6">
            {achieved.reverse().map((m) => (
              <MilestoneCard key={m.name} milestone={m} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
