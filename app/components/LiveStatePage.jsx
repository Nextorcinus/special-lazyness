'use client'

import { useEffect, useRef, useState } from 'react'
import milestoneData from '@/data/milestones.json'
import MilestoneCard from './MilestoneCard'

export default function LiveStatePage({ stateId }) {
  const [ageInDays, setAgeInDays] = useState(null)
  const [createdAt, setCreatedAt] = useState(null)
  const esRef = useRef(null)

  useEffect(() => {
    // Tutup koneksi SSE sebelumnya
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

  if (!ageInDays) {
    return <p className="text-white p-4">Loading state data...</p>
  }

  // Siapkan milestone dan sesuaikan jika merger state
  let milestones = milestoneData.milestones
  const isMerged = Number(stateId) >= 1000 && Number(stateId) <= 1099

  if (isMerged) {
    milestones = milestones.map((m) =>
      m.days === 440 ? { ...m, days: 470 } : m
    )
  }

  const achieved = milestones
    .filter((m) => ageInDays - m.days > 7) // sudah lebih dari 7 hari yang lalu
    .map((m) => ({ ...m, daysAgo: ageInDays - m.days }))

  const upcoming = milestones
    .filter((m) => ageInDays - m.days <= 7) // tayang dalam 7 hari terakhir atau yang akan datang
    .map((m) => ({
      ...m,
      daysLeft: m.days > ageInDays ? m.days - ageInDays : 0,
      daysAgo: m.days <= ageInDays ? ageInDays - m.days : 0,
    }))

  return (
    <div className="p-4 md:p-6 text-white w-full">
      {/* Header Info */}
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md space-y-2 mb-6">
        <h1 className="text-2xl font-bold mb-2">State {stateId}</h1>
        <p className="text-sm text-zinc-400">
          Created At: {createdAt.toUTCString()}
        </p>
        <p className="text-lime-400 mb-6">Age: {ageInDays} days</p>
      </div>

      <div className="relative bg-black-900 border border-orange-800 rounded-2xl p-6 shadow-md space-y-2 mb-6">
        <p className=" text-md text-orange-600">note : Release times may vary between servers depending on their progress, activity levels, and several system related factors. The time difference is not exact and typically falls within an approximate range of <span className="font-bold">±7 to 21 days</span>. all this just helps predict new features when it will arrive on your server. reference time by wos wiki official </p>
      </div>

      {/* Upcoming Updates */}
      <h2 className="text-xl mb-4 px-2 text-zinc-400">Upcoming Updates</h2>
      <div className="space-y-6">
        {upcoming.map((m) => (
          <MilestoneCard key={`${m.name}-${m.days}`} milestone={m} isUpcoming />
        ))}
      </div>

      {/* Achieved Updates */}
      {achieved.length > 0 && (
        <>
          <h2 className="text-xl mt-12 mb-4 px-2 text-zinc-400">
            Previous Updates
          </h2>
          <div className="space-y-6">
            {achieved
              .slice()
              .reverse()
              .map((m) => (
                <MilestoneCard key={`${m.name}-${m.days}`} milestone={m} />
              ))}
          </div>
        </>
      )}
    </div>
  )
}
