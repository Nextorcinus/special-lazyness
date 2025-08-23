// components/DawnHeroList.js
'use client'

import DawnHeroCard from './DawnHeroCard'
import { useEffect, useState } from 'react'

export default function DawnHeroList() {
  const [heroes, setHeroes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Dynamic import dengan path yang benar
        const dawnData = await import('../../data/heroesDawn.json')
        console.log('Heroes data loaded:', dawnData.default || dawnData)

        // Pastikan kita mengakses data yang benar
        const data = dawnData.default || dawnData

        // Tambahkan role jika tidak ada
        const heroesWithRole = data.dawn.map((hero) => ({
          ...hero,
          role: hero.role || 'Dawn Hero',
        }))

        setHeroes(heroesWithRole)
      } catch (error) {
        console.error('Error loading heroes data:', error)

        // Fallback: coba fetch dari /data jika dynamic import gagal
        try {
          const response = await fetch('/data/heroesDawn.json')
          const fallbackData = await response.json()
          const heroesWithRole = fallbackData.dawn.map((hero) => ({
            ...hero,
            role: hero.role || 'Dawn Hero',
          }))
          setHeroes(heroesWithRole)
        } catch (fetchError) {
          console.error('Fetch fallback also failed:', fetchError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-white">Loading heroes...</span>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {heroes.map((hero) => (
        <DawnHeroCard key={hero.id} hero={hero} />
      ))}
    </div>
  )
}
