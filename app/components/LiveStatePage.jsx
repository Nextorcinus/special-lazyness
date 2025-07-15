'use client'

import { useEffect, useRef, useState } from 'react'
import milestoneData from '@/data/milestones.json'
import MilestoneCard from './MilestoneCard'

export default function LiveStatePage({ stateId }) {
  const [ageInDays, setAgeInDays] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const esRef = useRef(null)

  useEffect(() => {
    if (esRef.current) {
      esRef.current.close()
    }

    const es = new EventSource('https://sse-server.up.railway.app/sse')
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        const ts = data[stateId]
        if (!ts) return

        const created = new Date(ts * 1000)
        const age = Math.floor((Date.now() - created.getTime()) / 86400000)

        setAgeInDays((prev) => (prev !== age ? age : prev))
        setCreatedAt((prev) =>
          !prev || prev.getTime() !== created.getTime() ? created : prev
        )
      } catch (err) {
        console.error('Failed to parse SSE data', err)
      }
    }

    es.onerror = (e) => {
      console.error('SSE error:', e)
      es.close()
    }

    return () => {
      es.close()
    }
  }, [stateId])

  if (!ageInDays) return <p className="text-white p-4">Loading state data...</p>

  let milestones = milestoneData.milestones

  if (Number(stateId) >= 1000 && Number(stateId) <= 1099) {
    milestones = milestones.map((m) =>
      m.days === 440 ? { ...m, days: 470 } : m
    )
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
