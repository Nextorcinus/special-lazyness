'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HeroList() {
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/heroes/index')
      .then(r => r.json())
      .then(data => setHeroes(data || []))
      .catch(err => {
        console.error('Failed to load heroes index', err)
        setHeroes([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="w-full mx-auto py-10 text-white">
      <h1 className="text-3xl font-bold mb-8">Hero List</h1>

      {heroes.length === 0 && (
        <p className="text-white/60">Tidak ada hero ditemukan</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {heroes.map(hero => (
          <Link
            key={hero.id}
            href={`/dashboard/heroes/${hero.id}`} 
            className="group bg-zinc-700/20 border border-white/10 rounded-xl p-3 hover:bg-teal-700 transition"
          >
            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg">
              <img
                src={`/icon/${hero.thumbnail}`}
                alt={hero.name}
                draggable="false"
                className="w-full h-full object-cover group-hover:scale-105 transition"
              />
            </div>

            <div className="mt-3">
              <p className="text-lg font-semibold text-green-400">
                {hero.name}
              </p>
              <p className="text-sm text-white/50">
                {hero.rarity} {hero.class}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
