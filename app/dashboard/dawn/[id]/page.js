// app/dashboard/heroesDawn/[id]/page.js
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import TalentPreviewModal from '../../../components/TalentPreviewModal'

export default function HeroDetail({ params }) {
  const [hero, setHero] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showTalentPreview, setShowTalentPreview] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Params ID:', params.id, 'Type:', typeof params.id)

        const dawnData = await import('../../../../data/heroesDawn.json')
        console.log('Loaded data:', dawnData.default || dawnData)

        const data = dawnData.default || dawnData

        // Cari hero dengan ID yang cocok (sebagai string)
        const foundHero = data.dawn.find((h) => h.id === params.id)
        console.log('Found hero:', foundHero)

        if (!foundHero) {
          setError(
            `Hero with ID ${params.id} not found. Available IDs: ${data.dawn
              .map((h) => h.id)
              .join(', ')}`
          )
        }

        setHero(foundHero)
      } catch (error) {
        console.error('Error loading hero data:', error)
        setError('Failed to load hero data: ' + error.message)

        try {
          const response = await fetch('/data/heroesDawn.json')
          const fallbackData = await response.json()
          const foundHero = fallbackData.dawn.find((h) => h.id === params.id)
          setHero(foundHero)
        } catch (fetchError) {
          console.error('Fetch fallback also failed:', fetchError)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (loading) {
    return (
      <div className="p-6 text-white">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-4">Loading hero data List...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-red-500">
        <div className="mb-4">Error: {error}</div>
        <Link
          href="/dashboard/dawn"
          className="text-blue-400 hover:text-blue-300"
        >
          &larr; Back to Heroes List
        </Link>
      </div>
    )
  }

  if (!hero) {
    return (
      <div className="p-6 text-red-500">
        <div className="mb-4">Hero not found</div>
        <div className="mb-4">ID: {params.id}</div>
        <Link
          href="/dashboard/dawn"
          className="text-blue-400 hover:text-blue-300"
        >
          &larr; Back to Heroes List
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      {/* Back Button */}
      <Link
        href="/dashboard/dawn"
        className="inline-block mb-6 text-lime-400 hover:text-blue-300"
      >
        &larr; Back to Heroes List
      </Link>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
        <div className="rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={
              hero['image-hero']
                ? `/icon/${hero['image-hero']}`
                : '/icon/default-hero.png'
            }
            alt={hero.name}
            width={224}
            height={240}
            className="object-contain"
            onError={(e) => {
              e.target.src = '/icon/default-hero.png'
            }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{hero.name}</h1>
          <p className="text-md text-gray-400">{hero.description}</p>
        </div>
      </div>

      {/* Talent */}
      <div className="mb-6 p-4 bg-special-inside rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">Talent: {hero.talent.name}</h2>
        </div>
        <p className="text-gray-400 mb-4">{hero.talent.description}</p>
        {hero.talent['upgrade-preview'] && (
          <button
            onClick={() => setShowTalentPreview(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            View Upgrade List
          </button>
        )}
      </div>

      {/* Expedition */}
      {hero.expedition && (
        <div className="mb-6 p-4 bg-special-inside rounded-lg">
          <h2 className="text-xl font-semibold mb-2 ">Expedition</h2>
          {Array.isArray(hero.expedition) ? (
            <ul className="list-disc pl-6">
              {hero.expedition.map((exp, idx) => (
                <li key={idx} className="text-lime-400">
                  {exp}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lime-400">{hero.expedition} *max</p>
          )}
        </div>
      )}

      {/* Skills dengan hover effects */}
      <div className="mb-6 p-4 bg-special-inside rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hero.skills.map((skill) => {
            const skillImagePath = skill['skill-img']
              ? `/icon/${skill['skill-img']}`
              : '/icon/default-skill.webp'

            return (
              <div
                key={skill.number}
                className="border border-gray-700 rounded-lg p-4 flex flex-col items-center text-center hover:bg-gray-800 transition-colors duration-200"
              >
                {/* Gambar Skill dengan frame */}
                <div className="w-32 h-32 mb-3 flex items-center justify-center  rounded-lg p-2">
                  <img
                    src={skillImagePath}
                    alt={skill.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = '/icon/skills/default-skill.webp'
                    }}
                  />
                </div>

                <span className="text-xs text-lime-400 bg-gray-800 px-2 py-1 rounded mb-2">
                  SKILL {skill.number}
                </span>
                <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                <p className="text-gray-400 text-sm">{skill.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {hero.summarize && (
        <div className="mb-6 p-4 bg-special-inside rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <div className="text-gray-400 whitespace-pre-line">
            {hero.summarize}
          </div>
        </div>
      )}

      {/* Talent Preview Modal */}
      <TalentPreviewModal
        isOpen={showTalentPreview}
        onClose={() => setShowTalentPreview(false)}
        hero={hero}
      />
    </div>
  )
}
