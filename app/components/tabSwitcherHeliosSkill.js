'use client'

import React, { useMemo, useState } from 'react'
import HeliosSkillHistoryList from './HeliosSkillHistoryList'
import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { useHeliosSkillHistory } from '../dashboard/war-academy/T12-skills/HeliosSkillsHistoryContext'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { useAddAnother } from '../dashboard/research/AddAnotherContext'
import TotalResultSkill from './TotalResultHeliosSkill'

export default function TabSwitcherSkill({
  results = [],
  compares = [],
  onDeleteHistory,
  onResetHistory,
}) {
  const [tab, setTab] = useState('overview')
  const { deleteHistory } = useHeliosSkillHistory()
  const { addAnother } = useAddAnother()

  const resultsWithTotal = useMemo(() => {
    if (!Array.isArray(results) || results.length === 0) return []

    const total = results.reduce(
      (acc, res) => {
        const baseResources =
          res && typeof res.resources === 'object' ? res.resources : {}

        Object.entries(baseResources).forEach(([key, value]) => {
          const val = Number(value || 0)
          acc.resources[key] = (acc.resources[key] || 0) + val
        })

        return acc
      },
      { resources: {} }
    )

    return [
      ...results,
      {
        id: 'total',
        building: 'Total',
        resources: total.resources,
      },
    ]
  }, [results])

  const sortedResults = useMemo(() => {
    return [...resultsWithTotal].reverse()
  }, [resultsWithTotal])

  return (
    <div>
      {/* === TAB BUTTON === */}
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

      {/* ================= OVERVIEW ================= */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {sortedResults.map((res, index) => {
            const isTotal = res?.id === 'total'
            if (isTotal) return null

            const compare = compares?.[0] || {}
            const resources =
              res && typeof res.resources === 'object' ? res.resources : {}

            const attributes = Array.isArray(res.attributes)
              ? res.attributes
              : []

            const isLatest = index === 0

            return (
              <div
                key={res.id}
                id={isLatest ? 'latest-result' : undefined}
                className="bg-special-inside py-4 px-4 rounded-xl space-y-3"
              >
                {/* === HEADER === */}
                <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                  <div>
                    {res.category && (
                      <div className="text-xs text-yellow-400 font-medium mb-0.5">
                        {res.category}
                      </div>
                    )}
                    <div className="text-lg lg:text-xl text-shadow-lg text-white mb-1">
                      {res.building}
                    </div>

                    <span className="text-white text-sm">
                      {res.fromLevel} → {res.toLevel}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      deleteHistory(res.id)
                      toast.success(`History ${res.building} deleted`)
                    }}
                    className="special-glass absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src="/icon/trash-can.png"
                      alt="Delete"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* === RESOURCES === */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 2xl:grid-cols-6 gap-4">
                  {Object.entries(resources).map(([key, value]) => {
                    const compareVal =
                      compare?.resources?.[key] !== undefined
                        ? Number(compare.resources[key])
                        : null

                    const val = Number(value || 0)
                    const diff = compareVal !== null ? compareVal - val : null

                    let colorClass =
                      'text-xs text-gray-200 bg-white/20 px-2 py-1'
                    let label = 'Match'

                    if (diff > 0) {
                      colorClass =
                        'text-xs text-green-400 border border-green-800 bg-green-700/10 px-2 py-1'
                      label = '+'
                    } else if (diff < 0) {
                      colorClass =
                        'text-xs text-red-200 border border-red-400 bg-red-500/10 px-2 py-1'
                      label = '-'
                    }

                    return (
                      <div
                        key={key}
                        className="flex flex-col items-center special-glass px-2 py-2 rounded-xl"
                      >
                        <div className="flex items-center gap-1 text-sm md:text-base">
                          <ResourceIcon type={key} />
                          {formatToShortNumber(val)}
                        </div>

                        {diff !== null && (
                          <div className={`rounded-md mt-1 ${colorClass}`}>
                            {label}
                            {diff !== 0 && (
                              <> {formatToShortNumber(Math.abs(diff))}</>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}

                  {/* === POWER === */}
                  {res.power && (
                    <div className="flex flex-col items-center justify-center special-glass px-2 py-2 rounded-xl">
                      <div className="flex items-center  gap-1 text-sm md:text-base">
                        Power : {formatToShortNumber(Number(res.power))}
                      </div>
                    </div>
                  )}
                </div>

                {/* === ATTRIBUTES === */}
                {attributes.length > 0 && (
                  <div className="flex gap-2 flex-wrap mt-2">
                    {attributes.map((attr, i) => {
                      const isPercent = attr.unit === '%'

                      return (
                        <div
                          key={i}
                          className={`text-xs px-3 py-1 rounded-full border font-medium ${
                            isPercent
                              ? 'bg-blue-500/20 border-blue-400 text-blue-100'
                              : 'bg-yellow-500/20 border-yellow-400 text-yellow-200'
                          }`}
                        >
                          {attr.name} :{' '}
                          {isPercent ? `${attr.value}%` : `+${attr.value}`}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {/* === ADD ANOTHER === */}
          <div className="bg-special-inside-dotted flex justify-center p-6 rounded-xl">
            <Button
              onClick={() => {
                addAnother()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="w-max buttonGlass text-white px-4 rounded"
            >
              + Unlock Other
            </Button>
          </div>

          {/* === TOTAL RESULT === */}
          <TotalResultSkill results={resultsWithTotal} compares={compares} />
        </div>
      )}

      {/* ================= HISTORY ================= */}
      {tab === 'history' && (
        <HeliosSkillHistoryList
          onDelete={onDeleteHistory}
          onReset={onResetHistory}
        />
      )}
    </div>
  )
}
