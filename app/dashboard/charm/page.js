'use client'

import { useState, useEffect, useRef } from 'react'
import CharmForm from '@/components/CharmForm'
import CharmTable from '@/components/CharmTable'
import CharmProgress from '@/components/CharmProgress'
import CompareFormCharm from '@/components/CharmFormCompare'
import { useCharmHistory } from './HistoryContext'
import charmDataRaw from '@/data/MaterialDatacharm.json'

export default function CharmPage() {
  const { updateHistory, resetFormTrigger } = useCharmHistory()
  const [results, setResults] = useState([])
  const [ownResources, setOwnResources] = useState(null)

  const resultRef = useRef()
  const compareRef = useRef()

  const handleFormSubmit = (selections) => {
    const upgrades = []

    const classMap = {
      Cap: 'Lancer',
      Watch: 'Lancer',
      Coat: 'Infantry',
      Pants: 'Infantry',
      Belt: 'Marksman',
      Weapon: 'Marksman',
    }

    for (const [part, pairs] of Object.entries(selections)) {
      const charmClass = classMap[part] || 'Unknown'

      pairs.forEach(({ from, to }) => {
        const fromLevel = parseInt(from)
        const toLevel = parseInt(to)

        if (!from || !to || fromLevel >= toLevel) return

        for (let i = fromLevel + 1; i <= toLevel; i++) {
          const levelData = charmDataRaw.find((item) => item.level === i)
          if (!levelData) return

          upgrades.push({
            gear: part,
            class: charmClass, // ✅ tambahkan class
            from: `${i - 1}`,
            to: `${i}`,
            guide: levelData.guide_cost,
            design: levelData.design_cost,
            power: levelData.power_diff,
            stat_total: levelData.stat_total,
            svs: levelData.svs_point || 0,
          })
        }

        updateHistory({ gear: part, from, to })
      })
    }

    setResults(upgrades)
    resultRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCompare = (resources) => {
    setOwnResources(resources)
    compareRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (resetFormTrigger) {
      setResults([])
      setOwnResources(null)
    }
  }, [resetFormTrigger])

  const total = results.reduce(
    (acc, item) => ({
      guide: acc.guide + item.guide,
      design: acc.design + item.design,
      power: acc.power + item.power,
      stat: acc.stat + item.stat,
      svs: acc.svs + item.svs,
    }),
    { guide: 0, design: 0, power: 0, stat: 0, svs: 0 }
  )

  return (
    <div className="p-4 md:p-6 text-white w-full">
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl text-white">Charm Upgrade Calculator</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 w-full">
        <div className="w-full lg:w-8/12">
          <CharmForm
            key={resetFormTrigger}
            onSubmit={handleFormSubmit}
            dataLoaded={!!charmDataRaw?.length}
            resetTrigger={resetFormTrigger}
          />
        </div>

        <div className="w-full lg:w-4/12">
          <CompareFormCharm onCompare={handleCompare} />
        </div>
      </div>

      <div ref={resultRef} className="lg:flex-row gap-6 mt-6 w-full">
        {results.length > 0 && (
          <>
            <CharmTable data={results} />
            <div ref={compareRef}>
              <CharmProgress total={total} compare={ownResources} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
