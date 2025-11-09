'use client'

import React, { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { Button } from './ui/button'
import ResourceIcon from './ResourceIcon'
import GearHistoryList from './GearHistoryList'
import materialDataRaw from '../data/MaterialDataGear.json'
import TotalResultGear from './TotalResultGear'

const materialData = materialDataRaw.data || []

export default function TabSwitcherGear({
  results,
  compares,
  onDeleteHistory,
  onResetHistory,
}) {
  const [tab, setTab] = useState('overview')

  // === Hitung total bahan dari level "from" ke "to" ===
  const calculateMaterials = (gear, from, to) => {
    const levels = materialData
      .filter((item) => item.Type.toLowerCase() === gear.toLowerCase())
      .map((item) => item.Level)
    const fromIndex = levels.indexOf(from)
    const toIndex = levels.indexOf(to)
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null

    const total = { plans: 0, polish: 0, alloy: 0, amber: 0, svs: 0 }

    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const data = materialData.find(
        (d) =>
          d.Type.toLowerCase() === gear.toLowerCase() &&
          d.Level.toLowerCase() === levels[i].toLowerCase()
      )
      if (data) {
        total.plans += parseInt(data.Plans) || 0
        total.polish += parseInt(data.Polish) || 0
        total.alloy += parseInt(data.Alloy) || 0
        total.amber += parseInt(data.Amber) || 0
        total.svs += parseInt(data['SvS Points']) || 0
      }
    }

    return total
  }

  // 💡 Tambahkan hasil total ke setiap result agar bisa dijumlahkan global
  const resultsWithTotal = useMemo(() => {
    return results
      .map((res) => ({
        ...res,
        total: calculateMaterials(res.type, res.from, res.to),
      }))
      .filter((r) => r.total !== null)
  }, [results])

  const sortedResults = [...resultsWithTotal].reverse()

  return (
    <div>
      {/* === Tabs === */}
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

      {/* === Overview Tab === */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {sortedResults.map((res, idx) => {
            const total = res.total
            const compare = compares?.[idx] || {}

            const resourcesToCompare = [
              { key: 'plans', label: 'Design Plans' },
              { key: 'polish', label: 'Polish' },
              { key: 'alloy', label: 'Alloy' },
              { key: 'amber', label: 'Amber' },
            ]

            return (
              <div
                key={res.id}
                className="bg-special-inside py-4 px-4 rounded-xl space-y-4 relative"
              >
                {/* Header */}
                <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                  <div>
                    <div className="text-lg lg:text-xl text-shadow-lg text-white mb-1">
                      {res.type}
                    </div>
                    <span className="text-white text-sm">
                      {res.from} → {res.to}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onDeleteHistory(res.id)
                      toast.success(`Deleted ${res.type} upgrade.`)
                    }}
                    className="buttonGlass absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src="/icon/trash-can.png"
                      alt="Delete"
                      className="w-5 h-5"
                    />
                  </button>
                </div>

                {/* === Resources === */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 gap-y-2 text-center">
                  {resourcesToCompare.map(({ key, label }) => {
                    const need = total[key]
                    const have = compare?.[key] ?? null
                    const diff = have !== null ? have - need : 0

                    const color =
                      diff > 0
                        ? 'text-green-400 border border-green-800 bg-green-700/10'
                        : diff < 0
                        ? 'text-red-200 border border-red-400 bg-red-500/10'
                        : 'text-gray-200 bg-white/10'

                    const diffText =
                      have === null
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
                        <p className="text-sm text-white mt-1">{label}</p>
                        <p className="text-lg font-semibold text-white">
                          {formatToShortNumber(need)}
                        </p>
                        {have !== null && (
                          <span
                            className={`text-xs mt-1 px-2 py-1 rounded-md ${color}`}
                          >
                            {diffText}
                          </span>
                        )}
                      </div>
                    )
                  })}

                  <div className="special-glass flex flex-col justify-center relative">
                    <span className="block text-white text-base mb-1">
                      SvS Points:
                    </span>
                    <span className="block text-white text-base mb-1">
                      {formatToShortNumber(total.svs)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

         
          <TotalResultGear results={resultsWithTotal} comparedData={compares[0]} />
        </div>
      )}

      {/* === History Tab === */}
      {tab === 'history' && <GearHistoryList onResetGlobal={onResetHistory} />}
    </div>
  )
}
