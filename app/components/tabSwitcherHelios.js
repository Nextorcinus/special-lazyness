'use client'

import React, { useMemo, useState } from 'react'
import TotalResultHelios from './TotalResultHelios'
import HeliosHistoryList from './HeliosHistoryList'
import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { useHeliosHistory } from '../dashboard/war-academy/HeliosHistoryContext'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { useAddAnother } from '../dashboard/research/AddAnotherContext'
import heliosData from '../data/HeliosResearch.json'

export default function TabSwitcherHelios({
  results = [],
  compares = [],
  onDeleteHistory,
  onResetHistory,
}) {
  const [tab, setTab] = useState('overview')
  const { deleteHistory, resetHistory } = useHeliosHistory()
  const { addAnother } = useAddAnother()

  // === TOTAL CALCULATION ===
  const resultsWithTotal = useMemo(() => {
    if (!results.length) return []
    const total = results.reduce(
      (acc, res) => {
        for (const key in res.resources || {}) {
          acc[key] = (acc[key] || 0) + (res.resources[key] || 0)
        }
        return acc
      },
      {}
    )
    return [...results, { id: 'total', researchName: 'Total', resources: total }]
  }, [results])

  return (
    <div>
      {/* === Tab Buttons === */}
      <div className="flex gap-2 mb-6 border-b border-[#ffffff46]">
        {['overview', 'history'].map((t) => (
          <button
            key={t}
            className={`tab-button ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'overview' ? 'Overview' : 'History'}
          </button>
        ))}
      </div>

      {/* === TAB: OVERVIEW === */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {results.map((res) => {
            const compare = compares[0]
            return (
              <div
                key={res.id}
                className="bg-special-inside py-4 px-4 rounded-xl space-y-2"
              >
                {/* === Header === */}
                <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                  <div>
                    <div className="text-lg lg:text-2xl text-shadow-lg text-white mb-1">
                      {res.researchName || res.name}
                    </div>
                    <span className="text-white text-sm">Level </span>
                    <span className="text-white text-sm">
                      {res.fromLevel} → {res.toLevel}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      deleteHistory(res.id)
                      toast.success(
                        `History ${res.researchName || res.name} has been deleted.`
                      )
                    }}
                    className="special-glass absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-transform duration-200"
                    aria-label="Delete history"
                  >
                    <img
                      src="/icon/trash-can.png"
                      alt="Delete"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* === Resource List === */}
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 2xl:grid-cols-6 gap-4 gap-y-0 w-full">
                    {Object.entries(res.resources || {}).map(([key, value]) => {
                      const need = res.rawResources?.[key] || 0
                      const compareVal = compare?.resources?.[key] ?? null
                      const diff =
                        compareVal !== null ? compareVal - need : null
                      const isMatch = diff === 0

                      let colorClass = 'text-xs text-gray-200 bg-white/20 px-2 py-1'
                      let label = 'Match'
                      if (diff > 0)
                        colorClass =
                          'text-xs text-green-400 border border-green-800 bg-green-700/10 px-2 py-1'
                      else if (diff < 0)
                        colorClass =
                          'text-xs text-red-200 border border-red-400 bg-red-500/10 px-2 py-1'

                      if (diff > 0) label = '+'
                      else if (diff < 0) label = '-'

                      return (
                        <div
                          key={key}
                          className="flex flex-col justify-center special-glass items-center px-2 py-2 rounded-xl"
                        >
                          <div className="flex items-center justify-between gap-1 text-sm md:text-base w-full">
                            <ResourceIcon type={key} />
                            {formatToShortNumber(value)}
                          </div>
                          {diff !== null && (
                            <div className={`rounded-md mt-1 ${colorClass}`}>
                              {label}
                              {!isMatch && (
                                <> {formatToShortNumber(Math.abs(diff))}</>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* === Time & Points === */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-y-0 gap-x-4">
                  <div className="special-glass bg-[#9797974A] border border-[#ffffff1c] px-4 py-2 rounded-lg mb-1">
                    <span className="block text-white text-sm mb-1">
                      Original Time
                    </span>
                    <span className="block text-[#ffeed8] text-sm">
                      {res.timeOriginal}
                    </span>
                  </div>
                  <div className="special-glass px-4 py-2 rounded-lg">
                    <span className="block text-white text-sm mb-1">
                      Reduce Time
                    </span>
                    <span className="block text-base">{res.timeReduced}</span>
                  </div>
                  <div className="special-glass px-4 py-2 rounded-lg">
                    <span className="block text-white text-base mb-1">
                      SvS Points:
                    </span>
                    <span className="text-base block">
                      {formatToShortNumber(res.svsPoints || 0)}
                    </span>
                  </div>
                </div>

                {/* === Buffs === */}
                {res.buffs && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 text-sm border-t border-[#ffffff1c] pt-4 text-[#00ffff]">
                    {res.buffs.petLevel !== 'Off' && (
                      <div className="bg-[#03cfbe33] border border-[#35dde94d] px-2 py-1 rounded-md">
                        Pet: {res.buffs.petLevel}
                      </div>
                    )}
                    {res.buffs.vpLevel !== 'Off' && (
                      <div className="bg-[#03cfbe33] border border-[#35dde94d] px-2 py-1 rounded-md">
                        VP: {res.buffs.vpLevel}
                      </div>
                    )}
                    {res.buffs.zinmanSkill !== 'Off' && (
                      <div className="bg-[#03cfbe33] border border-[#35dde94d] px-2 py-1 rounded-md">
                        Zinman: {res.buffs.zinmanSkill}
                      </div>
                    )}
                    {res.buffs.researchSpeed > 0 && (
                      <div className="bg-[#03cfbe33] border border-[#35dde94d] px-2 py-1 rounded-md">
                        Speed: {res.buffs.researchSpeed}%
                      </div>
                    )}
                    {res.buffs.doubleTime && (
                      <div className="bg-[#03cfbe33] border border-[#35dde94d] px-2 py-1 rounded-md">
                        Double Time
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* === Add Another Button === */}
          <div className="bg-special-inside-dotted flex justify-center p-6 rounded-xl">
            <Button
              onClick={() => {
                addAnother()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="w-max buttonGlass text-white px-4 rounded"
            >
              + Add Another Research
            </Button>
          </div>

          {/* === Total Result === */}
          <TotalResultHelios results={resultsWithTotal} compares={compares} />
        </div>
      )}

      {/* === TAB: HISTORY === */}
      {tab === 'history' && (
        <HeliosHistoryList
          onDelete={onDeleteHistory}
          onReset={onResetHistory}
        />
      )}
    </div>
  )
}
