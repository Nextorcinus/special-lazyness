'use client'

import React, { useMemo } from 'react'
import { toast } from 'sonner'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import ResourceIcon from './ResourceIcon'
import GearHistoryList from './GearHistoryList'
import materialDataRaw from '../data/MaterialDataGear.json'
import TotalResultGear from './TotalResultGear'

const materialData = materialDataRaw.data || []

export default function TabSwitcherGear({
  tab,
  setTab,
  results,
  compares,
  onDeleteHistory,
  onResetHistory,
}) {
  const toNum = (val) => parseInt(String(val).replace(/,/g, '')) || 0

  const calculateMaterials = (gear, from, to) => {
    const levels = materialData
      .filter((i) => i.Type.toLowerCase() === gear.toLowerCase())
      .map((i) => i.Level)

    const fromIndex = levels.indexOf(from)
    const toIndex = levels.indexOf(to)

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null

    const total = { plans: 0, polish: 0, alloy: 0, amber: 0, svs: 0 }
    let finalStats = { attack: 0, defense: 0, deploy: 0 }

    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const d = materialData.find(
        (x) =>
          x.Type.toLowerCase() === gear.toLowerCase() &&
          x.Level.toLowerCase() === levels[i].toLowerCase()
      )

      if (d) {
        total.plans += toNum(d.Plans)
        total.polish += toNum(d.Polish)
        total.alloy += toNum(d.Alloy)
        total.amber += toNum(d.Amber)
        total.svs += toNum(d['SvS Points'])

        finalStats.attack = Number(d.Attack) || 0
        finalStats.defense = Number(d.Defense) || 0
        finalStats.deploy = toNum(d['troops deployment capacity'])
      }
    }

    return {
      ...total,
      stats: finalStats,
    }
  }

  // Inject valeria bonus ke setiap result
  const resultsWithTotal = useMemo(() => {
    return results
      .map((r) => {
        const base = calculateMaterials(r.type, r.from, r.to)
        if (!base) return null

        const bonus = Math.min(r.valeriaBonus || 0, 20)
        const finalSvS = Math.round(base.svs * (1 + bonus / 100))

        return {
          ...r,
          total: {
            ...base,
            svs: finalSvS, // final SvS yang dipakai UI
          },
          valeriaBonus: bonus,
        }
      })
      .filter(Boolean)
  }, [results])

  const sortedResults = [...resultsWithTotal].reverse()
  const sortedCompares = [...compares].reverse()

  return (
    <div>
      <div className="flex gap-2 mb-6 border-b border-[#ffffff46]">
        <button
          className={`tab-button ${tab === 'overview' ? 'active' : ''}`}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>

        <button
          className={`tab-button ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          History
        </button>
      </div>

      {tab === 'overview' && (
        <div className="space-y-6">
          {sortedResults.map((res, idx) => {
            const isLatest = idx === 0
            const total = res.total
            const compare = sortedCompares[idx] || null

            const fields = [
              { key: 'plans', label: 'Design Plans' },
              { key: 'polish', label: 'Polish' },
              { key: 'alloy', label: 'Alloy' },
              { key: 'amber', label: 'Amber' },
            ]

            return (
              <div
                key={res.id}
                id={isLatest ? 'latest-result' : undefined}
                className="bg-special-inside py-4 px-4 rounded-xl space-y-4 relative"
              >
                <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                  <div>
                    <div className="text-lg lg:text-xl text-white mb-1">
                      {res.type}
                    </div>
                    <span className="text-white text-sm">
                      {res.from} → {res.to}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onDeleteHistory(res.id)
                      toast.success(`Deleted ${res.type} upgrade`)
                    }}
                    className="buttonGlass absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg"
                  >
                    <img src="/icon/trash-can.png" className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                  {fields.map(({ key, label }) => {
                    const need = total[key]
                    const have = compare ? compare[key] : null
                    const diff = have !== null ? have - need : null

                    const color =
                      diff === null
                        ? 'text-gray-200 bg-white/10'
                        : diff > 0
                          ? 'text-green-400 border border-green-800 bg-green-700/25'
                          : diff < 0
                            ? 'text-[#FFBABA] border border-[#AD5556] bg-[#6D1B19]/25'
                            : 'text-gray-200 bg-white/10'

                    const diffText =
                      diff === null
                        ? ''
                        : diff > 0
                          ? `+${formatToShortNumber(diff)}`
                          : diff < 0
                            ? `-${formatToShortNumber(Math.abs(diff))}`
                            : 'Match'

                    return (
                      <div
                        key={key}
                        className="special-glass p-3 rounded-xl flex flex-col items-center"
                      >
                        <ResourceIcon type={key} />
                        <p className="text-sm text-zinc-200 mt-1">{label}</p>
                        <p className="text-base text-white">
                          {formatToShortNumber(need)}
                        </p>

                        {diff !== null && (
                          <span
                            className={`text-xs mt-1 px-2 py-1 rounded-md ${color}`}
                          >
                            {diffText}
                          </span>
                        )}
                      </div>
                    )
                  })}

                  <div className="special-glass flex flex-col justify-center">
                    <span className="block text-sm text-zinc-200 mb-1">
                      SvS Points
                    </span>

                    <span className="block text-white text-base">
                      {formatToShortNumber(total.svs)}
                    </span>

                    {res.valeriaBonus > 0 && (
                      <span className="text-xs text-cyan-400 mt-1">
                        +{res.valeriaBonus}% Valeria
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-1 ">
                    <span className="inline-flex items-center px-3 py-1 text-xs rounded-lg bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 shrink-0">
                      Attack:
                      <b className="ml-1 text-white">
                        {res.total.stats?.attack || 0}%
                      </b>
                    </span>

                    <span className="inline-flex items-center px-3 py-1 text-xs rounded-lg bg-blue-500/10 border border-blue-400/20 text-blue-200 shrink-0">
                      Defense:
                      <b className="ml-1 text-white">
                        {res.total.stats?.defense || 0}%
                      </b>
                    </span>

                    <span className="inline-flex items-center px-3 py-1 text-xs rounded-lg bg-amber-500/10 border border-amber-400/20 text-amber-200 shrink-0">
                      Deployment:
                      <b className="ml-1 text-white">
                        +{' '}
                        {res.total.stats?.deploy
                          ? formatToShortNumber(res.total.stats.deploy)
                          : '-'}
                      </b>
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          <TotalResultGear
            results={sortedResults}
            comparedData={sortedCompares[0] || {}}
          />
        </div>
      )}

      {tab === 'history' && <GearHistoryList onResetGlobal={onResetHistory} />}
    </div>
  )
}
