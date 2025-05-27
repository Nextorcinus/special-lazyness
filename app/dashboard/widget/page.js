'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import heroData from '../../data/heroData'

export default function WidgetPage({ onCalculate }) {
  let levelData = [
    { level: 1, required: 5, value: 5, type: 'exploration' },
    { level: 2, required: 10, value: 5, type: 'expedition' },
    { level: 3, required: 15, value: 7.5, type: 'exploration' },
    { level: 4, required: 20, value: 7.5, type: 'expedition' },
    { level: 5, required: 25, value: 10, type: 'exploration' },
    { level: 6, required: 30, value: 10, type: 'expedition' },
    { level: 7, required: 35, value: 12.5, type: 'exploration' },
    { level: 8, required: 40, value: 12.5, type: 'expedition' },
    { level: 9, required: 45, value: 15, type: 'exploration' },
    { level: 10, required: 50, value: 15, type: 'exploration' },
  ]

  const [input, setInput] = useState('')
  const [selectedHero, setSelectedHero] = useState('')
  const [selectedRequired, setSelectedRequired] = useState('')
  const [result, setResult] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    const hero = heroData.find((h) => h.heroes === selectedHero)
    const level = levelData.find((l) => l.required === Number(selectedRequired))

    console.log('Selected hero:', selectedHero)
    console.log(
      'Hero list:',
      heroData.map((h) => h.heroes)
    )

    if (hero && level) {
      setResult({
        name: hero.heroes,
        level: level.level,
        value: level.value,
        type: level.type,
        skill: hero[level.type],
      })
      toast.success('Widget successfully calculated!')
    } else {
      setResult(null)
      toast.error('Data is incomplete or not found.')
    }
  }

  return (
    <div className="p-4 md:p-6 text-white w-full">
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl text-white">Widget Hero</h2>
      </div>
      <div className="bg-special-inside w-full border-zinc-800 text-white mt-6 px-4 py-6 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto rounded">
        <h1 className="text-xl mb-4 text-zinc-400">Widget Calculate</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown Hero */}
          <select
            value={selectedHero}
            onChange={(e) => setSelectedHero(e.target.value)}
            className="w-full bg-zinc-800 bg-special-input text-white px-3 py-2 border border-zinc-700 rounded"
          >
            <option value="">Choose Hero</option>
            {heroData.map((hero) => (
              <option key={hero.heroes} value={hero.heroes}>
                {hero.heroes}
              </option>
            ))}
          </select>

          {/* Dropdown Required Widget */}
          <select
            value={selectedRequired}
            onChange={(e) => setSelectedRequired(e.target.value)}
            className="w-full bg-zinc-800 bg-special-input text-white px-3 py-2 border border-zinc-700 rounded"
          >
            <option value="">Choose Required Widget</option>
            {levelData.map((item) => (
              <option key={item.required} value={item.required}>
                Level {item.level} - Required {item.required}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-lime-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            Analyze
          </button>
        </form>

        {/* Hasil */}
        {result && (
          <div className="mt-6 p-4 bg-zinc-900 rounded text-zinc-400 shadow-md border border-zinc-800">
            <p>
              <strong className="text-lime-400">{result.name}</strong> Widget
              Level {result.level} "<em>{result.skill}</em>"{' '}
              <strong className="text-yellow-400">{result.value}%</strong> for{' '}
              <strong className="text-zinc-200">{result.type}</strong>
            </p>
          </div>
        )}

        {!result && input && (
          <p className="mt-4 text-red-400">
            Data tidak ditemukan untuk required: {input}
          </p>
        )}
      </div>
      <div className="max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mt-6 text-zinc-400">
        <p className="text-sm">
          Note: Exploration skills are designed for exploration battles (
          <em>exploration, arena or intel</em>) and expedition skills are
          exclusively used in expedition battles.
          <br></br>for require widget needs must be completed each level, cannot be directly. e.g Target level 4: 5 + 10 + 15 + 20 = 50 items needed
        </p>
      </div>
    </div>
  )
}
