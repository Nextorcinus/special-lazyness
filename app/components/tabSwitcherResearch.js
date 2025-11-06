'use client'

import React, { useState } from 'react'
import TotalResult from './TotalResult'
import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { useResearchHistory } from '../dashboard/research/ResearchHistoryContext'
import { useAddAnother } from '../dashboard/research/AddAnotherContext'
import ResearchHistoryList from './ResearhHistoryList'
import { toast } from 'sonner'
import { Button } from './ui/button'

export default function TabSwitcherResearch({ compares, onResetHistory }) {
  const [tab, setTab] = useState('overview')
  const { history, deleteHistory } = useResearchHistory()
  const { addAnother } = useAddAnother()

  const handleDelete = (id, name) => {
    deleteHistory(id)
    toast.success(`Deleted research "${name}" from history.`)
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

      {/* === TAB: OVERVIEW === */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {history.length === 0 ? (
            <p className="text-center text-gray-400">No research results yet.</p>
          ) : (
            history.map((res) => {
              const compare = compares?.[0] || {}

              return (
                <div
                  key={res.id}
                  className="bg-special-inside p-6 rounded-xl space-y-2 relative"
                >
                  {/* === Header === */}
                  <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                    <div>
                      <div className="text-lg lg:text-xl text-shadow-lg text-white mb-1">
                        {res.name}
                      </div>
                      <span className="text-white text-sm">
                        Lv. {res.fromLevel} → {res.toLevel}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(res.id, res.research)}
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 2xl:grid-cols-6 gap-4">
                    {Object.entries(res.resources || {}).map(([key, value]) => {
                      const need = res.rawResources?.[key] || value
                      const hasCompare = compare && key in compare
                      const have = hasCompare ? compare[key] : null
                      const diff = hasCompare ? have - need : 0
                      const color =
                        diff > 0
                          ? 'text-xs text-green-400 border border-green-800 bg-green-700/10 px-2 py-1 rounded'
                          : diff < 0
                          ? 'text-xs text-red-200 border border-red-400 bg-red-500/10 px-2 py-1 rounded'
                          : 'text-xs text-gray-200 bg-white/20 px-2 py-1 rounded'
                      const label =
                        diff > 0 ? '+' : diff < 0 ? '-' : 'Match'

                      return (
                        <div
                          key={key}
                          className="flex flex-col justify-center special-glass items-center px-2 py-2 rounded-xl"
                        >
                          <div className="flex items-center justify-between gap-1 text-white text-sm md:text-base w-full">
                            <ResourceIcon type={key} />
                            {formatToShortNumber(value)}
                          </div>
                          {hasCompare && (
                            <div className={`mt-1 ${color}`}>
                              {label}
                              {diff !== 0 && (
                                <> {formatToShortNumber(Math.abs(diff))}</>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* === Time Info === */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-2 mt-4">
                    <div className="special-glass px-4 py-2 rounded-lg mb-1">
                      <span className="block text-[#ffeed8] text-base mb-1">
                        Original Time
                      </span>
                      <span className="block text-[#ffeed8] text-base">
                        {res.timeOriginal}
                      </span>
                    </div>
                    <div className="px-4 py-2 rounded-lg">
                      <span className="block text-white text-base mb-1">
                        Reduced Time
                      </span>
                      <span className="block text-white text-base">
                        {res.timeReduced}
                      </span>
                    </div>
                  </div>

                  {/* === Buff Info === */}
                  {res.buffs && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-3 text-sm border-t border-[#ffffff1c] pt-2 text-[#FFDB98]">
                      {res.buffs.researchSpeed > 0 && (
                        <div className="bg-[#FFDB9833] border border-[#FFDB984D] px-2 py-1 rounded-md">
                          Research Speed: {res.buffs.researchSpeed}%
                        </div>
                      )}
                      {res.buffs.vpBonus > 0 && (
                        <div className="bg-[#FFDB9833] border border-[#FFDB984D] px-2 py-1 rounded-md">
                          VP Bonus: {res.buffs.vpBonus}%
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}

          {/* === Add Another === */}
          <div className="bg-special-inside-dotted flex justify-center p-6 rounded-xl ">
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

          <TotalResult results={history} comparedData={compares?.[0]} />
        </div>
      )}

      {/* === TAB: HISTORY === */}
      {tab === 'history' && (
        <ResearchHistoryList
          onDelete={handleDelete}
          onReset={onResetHistory}
        />
      )}
    </div>
  )
}
