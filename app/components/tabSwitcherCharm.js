'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { Button } from './ui/button'
import ResourceIcon from './ResourceIcon'
import CharmHistoryList from './CharmHistoryList'
import charmData from '../data/MaterialDatacharm.json'
import TotalResultCharm from './TotalResultCharm'

export default function TabSwitcherCharm({
  results,
  compares,
  onDeleteHistory,
  onResetHistory,
}) {
  const [tab, setTab] = useState('overview')

  // === Hitung total bahan berdasarkan level from → to ===
  const calculateMaterials = (from, to) => {
    const fromIndex = charmData.findIndex((i) => i.level === parseInt(from))
    const toIndex = charmData.findIndex((i) => i.level === parseInt(to))
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null

    const total = { guide: 0, design: 0, jewel: 0, svs: 0 }
    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const data = charmData[i]
      if (!data) continue
      total.guide += data.guide_cost || 0
      total.design += data.design_cost || 0
      total.jewel += data.jewel_cost || 0
      total.svs += data.svs_point || 0
    }
    return total
  }

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

      {/* === Overview === */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {results.map((res, idx) => {
            const total = calculateMaterials(res.from, res.to)
            if (!total) return null

            const compare = compares?.[idx] || {}

            // 💡 daftar resource untuk dibandingkan
            const resourcesToCompare = [
              { key: 'guide', label: 'Guides' },
              { key: 'design', label: 'Designs' },
              { key: 'jewel', label: 'Secrets' },
            ]

            return (
              <div
                key={res.id}
                className="bg-special-inside p-6 rounded-xl space-y-4 relative"
              >
                {/* === Header === */}
                <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                  <div>
                    <div className="text-lg lg:text-xl text-shadow-lg text-white mb-1">
                      {res.type}
                    </div>
                    <span className="text-white text-sm">Level</span>{' '}
                    <span className="text-white text-sm">
                      : {res.from} → {res.to}
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

                {/* === Resources Grid === */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
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
                        <p className="text-sm text-white mt-1 mb-1">{label}</p>
                        <p className="text-lg text-sm text-white mt-1">
                          {formatToShortNumber(need)}
                        </p>
                        {have !== null && (
                          <span
                            className={`text-xs mt-2 px-2 py-1 rounded-md ${color}`}
                          >
                            {diffText}
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {/* === SvS Points === */}
                  <div className="special-glass bg-[#9797974A] border border-[#ffffff1c] px-4 py-2 rounded-lg mb-1">
                    <span className="block text-white text-base mb-1">
                      SvS Points:
                    </span>
                    <span className="block text-white text-sm mb-1">
                      {formatToShortNumber(total.svs)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
          <TotalResultCharm results={results} />
        </div>
      )}


      
      {/* === History Tab === */}
      {tab === 'history' && <CharmHistoryList onResetGlobal={onResetHistory} />}
    </div>
  )
}
