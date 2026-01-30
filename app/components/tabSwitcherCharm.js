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
  compares = {},
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

  const resultsWithTotal = useMemo(() => {
    return results.map((r) => {
      const base = calculateMaterials(r.from, r.to) ?? {
        guide: 0,
        design: 0,
        jewel: 0,
        svs: 0,
        stat: 0,
      }

      const bonus = Math.min(r.valeriaBonus || 0, 20)
      const finalSvS = Math.round(base.svs * (1 + bonus / 100))

      return {
        ...r,
        valeriaBonus: bonus,
        total: {
          ...base,
          svs: finalSvS,
          stat: base.stat,
        },
      }
    })
  }, [results])

  const hasCompare =
    compares && Object.values(compares).some((v) => Number(v) > 0)

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
                      {['guide', 'design', 'jewel'].map((key) => {
                        const have = Number(compares?.[key] || 0)
                        const need = total[key]
                        const diff = have - need

                        const badge =
                          diff > 0
                            ? {
                                text: `+${formatToShortNumber(diff)}`,
                                class:
                                  'text-green-400 border border-green-800 bg-green-700/10',
                              }
                            : diff < 0
                              ? {
                                  text: `-${formatToShortNumber(Math.abs(diff))}`,
                                  class:
                                    'text-red-300 border border-red-600 bg-red-500/10',
                                }
                              : {
                                  text: 'Match',
                                  class: 'text-gray-300 bg-white/10',
                                }

                        return (
                          <div
                            key={key}
                            className="special-glass p-3 rounded-xl flex flex-col items-center"
                          >
                            <ResourceIcon type={key} />
                            <p className="text-sm text-zinc-200 mt-1">{key}</p>

                            <p className="text-base text-white">
                              {formatToShortNumber(need)}
                            </p>

                            {hasCompare && (
                              <span
                                className={`text-xs mt-2 px-2 py-1 rounded-md ${badge.class}`}
                              >
                                {badge.text}
                              </span>
                            )}
                          </div>
                        )
                      })}

                      <div className="special-glass p-3 rounded-xl flex flex-col justify-center">
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

                      <div className="col-span-full border-t border-white/10 my-1" />

                      <div className="col-span-full w-full p-3 rounded-xl flex flex-col gap-2">
                        <span className="text-sm text-left text-white mb-1">
                          {statLabelMap[res.type]}
                        </span>

                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                          {/* Lethality */}
                          <div
                            className="w-full sm:w-auto sm:min-w-[100px]
                 px-3 py-2 rounded-xl
                 bg-cyan-500/20 border border-cyan-400/30
                 text-center"
                          >
                            <div className="text-[11px] text-cyan-200/80">
                              Lethality
                            </div>
                            <div className="text-sm font-semibold text-white">
                              +{(total.stat ?? 0).toFixed(1)}%
                            </div>
                          </div>

                          {/* Health */}
                          <div
                            className="w-full sm:w-auto sm:min-w-[90px] px-3 py-2 rounded-xl
                  bg-amber-500/20 border border-amber-400/30
                  text-amber-200 text-center"
                          >
                            <div className="text-[11px] text-amber-200/80">
                              Health
                            </div>
                            <div className="text-sm font-semibold text-white">
                              +{(total.stat ?? 0).toFixed(1)}%
                            </div>
                          </div>
                        </div>
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
