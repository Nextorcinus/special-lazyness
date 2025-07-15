'use client'
import { useEffect, useState } from 'react'

export default function LiveStateAge({ stateId }) {
  const [createdAt, setCreatedAt] = useState(null)
  const [ageInDays, setAgeInDays] = useState(null)

  useEffect(() => {
    const es = new EventSource('/api/stateage/sse') 
    es.onmessage = (e) => {
      const data = JSON.parse(e.data)
      const ts = data[stateId]
      if (ts) {
        const created = new Date(ts * 1000)
        const age = Math.floor((Date.now() - created.getTime()) / 86400000)
        setCreatedAt(created.toUTCString())
        setAgeInDays(age)
      }
    }
    return () => es.close()
  }, [stateId])

  if (ageInDays == null) return <p>Loading...</p>

  return (
    <div>
      <h2 className="text-xl font-bold">State {stateId}</h2>
      <p>Created At: {createdAt}</p>
      <p className="text-lime-400">Age: {ageInDays} days</p>
    </div>
  )
}
