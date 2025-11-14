'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import ResourceIcon from './ResourceIcon'
import CharmHistoryList from './CharmHistoryList'
import charmData from '../data/MaterialDatacharm.json'
import TotalResultCharm from './TotalResultCharm'

export default function TabSwitcherCharm({
  results = [],
  compares = [],
  onDeleteHistory,
  onResetHistory,
}) {
  const [tab, setTab] = useState('overview')

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

  const handleDelete = (id, type) => {
    onDeleteHistory?.(id)
    toast.success(`Deleted ${type} upgrade.`)
  }

  // urutkan terbaru di atas
  const sortedResults = [...results].reverse()

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
              {sortedResults.map((res, idx) => {
                const total = calculateMaterials(res.from, res.to)
                if (!total) return null

                const compare = compares?.[idx] || {}
                const resourcesToCompare = [
                  { key: 'guide', label: 'Guides' },
                  { key: 'design', label: 'Designs' },
                  { key: 'jewel', label: 'Jewels' },
                ]
                
                return (
                  <div key={res.id} className="bg-special-inside py-4 px-4 rounded-xl space-y-4 relative">
                    <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                      <div>
                        <div className="text-lg lg:text-xl text-shadow-lg text-white mb-1">{res.type}</div>
                        <span className="text-white text-sm">Level: {res.from} → {res.to}</span>
                      </div>

                      <button
                        onClick={() => handleDelete(res.id, res.type)}
                        className="buttonGlass absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-transform duration-200"
                      >
                        <img src="/icon/trash-can.png" alt="Delete" className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-2 text-center">
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
                          <div key={key} className="special-glass p-3 rounded-xl flex flex-col items-center">
                            <ResourceIcon type={key} />
                            <p className="text-sm text-white mt-1">{label}</p>
                            <p className="text-lg  text-white">{formatToShortNumber(need)}</p>
                            {have !== null && <span className={`text-xs mt-2 px-2 py-1 rounded-md ${color}`}>{diffText}</span>}
                          </div>
                        )
                      })}

                      <div className="special-glass bg-[#9797974A] border border-[#ffffff1c] px-4 py-2 rounded-lg mb-1 flex flex-col justify-center relative">
                        <span className="block text-white text-base mb-1">SvS Points:</span>
                        <span className="block text-lg text-white">{formatToShortNumber(total.svs)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              <TotalResultCharm results={results} compares={compares} />
            </>
          )}
        </div>
      )}

      {tab === 'history' && <CharmHistoryList onResetGlobal={onResetHistory} />}
    </div>
  )
}
