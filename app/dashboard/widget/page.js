'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import heroData from '../../data/heroData'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../../components/ui/select'

import { Label } from '../../components/ui/label'

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
  const [fromLevel, setFromLevel] = useState()
  const [toLevel, setToLevel] = useState('')

  const levelOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

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
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl text-white">Widget Hero</h2>
      </div>
      <div className="bg-special-inside w-full border border-zinc-800 text-white mt-6 px-4 py-6 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto rounded-xl">
        <h1 className="text-xl mb-4 text-zinc-400">Widget Calculate</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Dropdown Hero */}
          <div className="w-full">
            <Label className="text-zinc-400 mb-1 block">Hero</Label>
            <Select
              value={selectedHero}
              onValueChange={(value) => setSelectedHero(value)}
            >
              <SelectTrigger className="w-full bg-zinc-800 text-white px-3 py-2 border border-zinc-700 rounded">
                {selectedHero !== '' ? (
                  <SelectValue />
                ) : (
                  <span className="text-muted-foreground">Choose Hero</span>
                )}
              </SelectTrigger>
              <SelectContent>
                {heroData.map((hero) => (
                  <SelectItem key={hero.heroes} value={hero.heroes}>
                    {hero.heroes}{' '}
                    {hero.status && (
                      <span className="text-red-400 ">({hero.status})</span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FROM LEVEL */}
            <div>
              <Label className="text-zinc-400">From</Label>
              <Select
                value={fromLevel}
                onValueChange={(value) => {
                  setFromLevel(value)
                  setToLevel('')
                }}
              >
                <SelectTrigger className="bg-zinc-800 bg-special-input text-white">
                  {fromLevel !== '' ? (
                    <SelectValue />
                  ) : (
                    <span className="text-muted-foreground px-3">
                      -- Select Level --
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((level) => (
                    <SelectItem key={level} value={String(level)}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* TO LEVEL */}
            <div>
              <Label className="text-zinc-400">To</Label>
              <Select
                value={toLevel}
                onValueChange={(value) => setToLevel(value)}
              >
                <SelectTrigger className="bg-zinc-800 bg-special-input text-white">
                  {toLevel !== '' ? (
                    <SelectValue />
                  ) : (
                    <span className="text-muted-foreground px-3">
                      -- Select Level --
                    </span>
                  )}
                </SelectTrigger>
                <SelectContent>
                  {levelOptions
                    .filter((level) => Number(level) > Number(fromLevel))
                    .map((level) => (
                      <SelectItem key={level} value={String(level)}>
                        {level}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Submit */}
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
              <strong className="text-lime-400">{result.name} </strong> 
              Level {result.level} "<em>{result.skill}</em>"{' '}
              <strong className="text-yellow-400">{result.value}%</strong> for{' '}
              <strong className="text-yellow-400">{result.type}</strong>
              <br />
              <span className="text-zinc-200 py-2">
                Total Widget Required from Level {fromLevel} → {toLevel} :{' '}
                <strong className="text-lime-400">
                  {result.totalRequired}
                </strong>
              </span>
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
        </p>
      </div>
    </div>
  )
}
