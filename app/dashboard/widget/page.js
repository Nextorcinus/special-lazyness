'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import heroData from '../../data/heroData'
import { Label } from '../../components/ui/label'
import HybridSelect from '../../components/HybridSelect'

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

  const levelOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

  const [selectedHero, setSelectedHero] = useState('')
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [result, setResult] = useState(null)

  function getTotalRequired(from, to) {
    return levelData
      .filter((lvl) => lvl.level > from && lvl.level <= to)
      .reduce((sum, lvl) => sum + lvl.required, 0)
  }

  function handleSubmit(e) {
    e.preventDefault()

    const hero = heroData.find((h) => h.heroes === selectedHero)
    const level = levelData.find((l) => l.level === Number(toLevel))
    const totalRequired = getTotalRequired(Number(fromLevel), Number(toLevel))

    if (hero && level) {
      setResult({
        name: hero.heroes,
        level: level.level,
        status: hero.status,
        value: level.value,
        type: level.type,
        skill: hero[level.type],
        totalRequired,
      })

      toast.success('Widget successfully calculated!')
    } else {
      setResult(null)
      toast.error('Data is incomplete or not found.')
    }
  }

  useEffect(() => {
    if (toLevel && Number(toLevel) <= Number(fromLevel)) {
      setToLevel('')
    }
  }, [fromLevel])

  return (
    <div className="p-4 md:p-6 text-white w-full">

      {/* Title */}
      <div className="mt-6 px-4 py-2 max-w-2xl mx-auto">
        <h2 className="text-2xl">Widget Hero</h2>
      </div>

      {/* FORM */}
      <div className="bg-special-inside mt-3 px-4 py-5 max-w-2xl mx-auto rounded-xl">

        <h1 className="text-xl mb-4">Widget Calculate</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* HERO DROPDOWN */}
          <div className="w-full">
            <Label className="mb-1 block">Hero</Label>

            <HybridSelect
              value={selectedHero}
              onChange={setSelectedHero}
              placeholder="Choose Hero"
              className="bg-special-input text-white"
              options={heroData.map((hero) => ({
                value: hero.heroes,
                label: hero.status
                  ? `${hero.heroes} (${hero.status})`
                  : hero.heroes,
              }))}
            />
          </div>

          {/* FROM / TO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* FROM */}
            <div>
              <Label className="mb-1">From</Label>

              <HybridSelect
                value={fromLevel}
                onChange={(v) => {
                  setFromLevel(v)
                  setToLevel('')
                }}
                placeholder="Select Level"
                className="bg-special-input text-white"
                options={levelOptions.map((lvl) => ({
                  value: lvl,
                  label: lvl,
                }))}
              />
            </div>

            {/* TO */}
            <div>
              <Label className="mb-1">To</Label>

              <HybridSelect
                value={toLevel}
                onChange={setToLevel}
                disabled={!fromLevel}
                placeholder="Select Level"
                className="bg-special-input text-white"
                options={levelOptions
                  .filter((lvl) => Number(lvl) > Number(fromLevel))
                  .map((lvl) => ({
                    value: lvl,
                    label: lvl,
                  }))}
              />
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="button-Form text-white rounded-lg py-4 px-4 w-full sm:w-auto"
          >
            Analyze
          </button>
        </form>

        {/* Error message */}
        {!result && selectedHero && (
          <p className="mt-3 text-red-400"></p>
        )}
      </div>

      {/* RESULT */}
      {result && (
        <div className="mt-6 p-4 bg-special-inside-green max-w-2xl mx-auto rounded-xl border">
          <p>
            <strong className="text-lime-400">{result.name}</strong> Level{' '}
            {result.level}{' '}
            "<em>{result.skill}</em>"{' '}
            <strong className="text-yellow-400">{result.value}%</strong> for{' '}
            <strong className="text-yellow-400">{result.type}</strong>
          </p>

          <p className="text-zinc-200 mt-2">
            Total Widget Required from Level {fromLevel} → {toLevel}:{' '}
            <strong className="text-lime-400">
              {result.totalRequired} stones
            </strong>
          </p>
        </div>
      )}

      {/* NOTE */}
      <div className="max-w-2xl mx-auto mt-6 text-white">
        <p className="text-sm">
          Note: Exploration skills work for exploration battles (exploration,
          arena, intel). Expedition skills only work in expedition battles.
        </p>
      </div>
    </div>
  )
}
