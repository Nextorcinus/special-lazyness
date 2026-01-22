'use client'

import React, { useMemo } from 'react'
import { toast } from 'sonner'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import ResourceIcon from './ResourceIcon'
import CharmHistoryList from './CharmHistoryList'
import charmData from '../data/MaterialDatacharm.json'
import TotalResultCharm from './TotalResultCharm'

export default function TabSwitcherCharm({
  tab,
  setTab,
  results = [],
  compares = [],
  onDeleteHistory,
  onResetHistory,
}) {
  const statLabelMap = {
    Cap: 'Lancer',
    Watch: 'Lancer',
    Coat: 'Infantry',
    Pants: 'Infantry',
    Belt: 'Marksman',
    Weapon: 'Marksman',
  }

  const calculateMaterials = (from, to) => {
    const fromIndex = charmData.findIndex((i) => i.level === parseInt(from))
    const toIndex = charmData.findIndex((i) => i.level === parseInt(to))
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null

    const total = { guide: 0, design: 0, jewel: 0, svs: 0, stat: 0 }

    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const data = charmData[i]
      if (!data) continue
      total.guide += data.guide_cost || 0
      total.design += data.design_cost || 0
      total.jewel += data.jewel_cost || 0
      total.svs += data.svs_point || 0
      total.stat += data.stat_diff || 0
    }

    return total
  }

  const handleDelete = (id, type) => {
    onDeleteHistory?.(id)
    toast.success(`Deleted ${type} upgrade.`)
  }

  const sortedResults = [...results].reverse()

  // Ini inti perbaikannya: merge base JSON dengan override svs dari form
  const resultsWithTotal = useMemo(() => {
    return results.map((r) => {
      const base = calculateMaterials(r.from, r.to) ?? {
        guide: 0,
        design: 0,
        jewel: 0,
        svs: 0,
        stat: 0,
      }

      return {
        ...r,
        total: {
          ...base, // semua dari JSON
          ...(r.total || {}), // override hanya jika form kirim svs
          stat: base.stat, // paksa stat tetap dari JSON
        },
      }
    })
  }, [results])

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
          {sortedResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">No charm upgrades yet.</p>
            </div>
          ) : (
            <>
              {sortedResults.map((res) => {
                const merged = resultsWithTotal.find((r) => r.id === res.id)
                const total = merged?.total ?? {
                  guide: 0,
                  design: 0,
                  jewel: 0,
                  svs: 0,
                  stat: 0,
                }

                return (
                  <div
                    key={res.id}
                    className="bg-special-inside py-4 px-4 rounded-xl space-y-4"
                  >
                    <div className="flex justify-between items-center bg-title-result mb-4 pr-12">
                      <div>
                        <div className="text-lg text-white mb-1">
                          {res.type}
                        </div>
                        <span className="text-white text-sm">
                          Level: {res.from} → {res.to}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(res.id, res.type)}
                        className="buttonGlass p-2 rounded-lg"
                      >
                        <img
                          src="/icon/trash-can.png"
                          alt="Delete"
                          className="w-5 h-5"
                        />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      {['guide', 'design', 'jewel'].map((key) => (
                        <div
                          key={key}
                          className="special-glass p-3 rounded-xl flex flex-col items-center"
                        >
                          <ResourceIcon type={key} />
                          <p className="text-sm text-zinc-200 mt-1">{key}</p>
                          <p className="text-base text-white">
                            {formatToShortNumber(total[key])}
                          </p>
                        </div>
                      ))}

                      <div className="special-glass p-3 rounded-xl flex flex-col justify-center">
                        <span className="text-sm text-zinc-200 mb-1">
                          SvS Points
                        </span>
                        <span className="text-white text-base">
                          {formatToShortNumber(total.svs)}
                        </span>
                      </div>

                      <div className="special-glass p-3 rounded-xl flex flex-col justify-center">
                        <span className="text-sm text-zinc-200 mb-1">
                          Stats Gain {statLabelMap[res.type]}
                        </span>
                        <span className="text-white-400 text-base">
                          +{total.stat.toFixed(1)} %
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}

              <TotalResultCharm
                results={resultsWithTotal}
                compares={compares}
              />
            </>
          )}
        </div>
      )}

      {tab === 'history' && <CharmHistoryList onResetGlobal={onResetHistory} />}
    </div>
  )
}
