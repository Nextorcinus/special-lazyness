'use client'

import React, { useState } from 'react'
import TotalResult from './TotalResult'
import HistoryList from './HistoryList'
import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { useHistory } from '../dashboard/buildings/HistoryContext'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { useAddAnother } from '../dashboard/buildings/AddAnotherContext'

export default function TabSwitcher({
  results,
  compares,
  onDeleteHistory,
  onResetHistory,
}) {
  const [tab, setTab] = useState('overview')

  const { deleteHistory } = useHistory()
  const { addAnother } = useAddAnother()

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
          {sortedResults.map((res, index) => {
            const compare = compares?.[0]
            const isLatest = index === 0

            return (
              <div
                key={res.id}
                id={isLatest ? 'latest-result' : undefined}
                className="bg-special-inside py-4 px-4 rounded-xl space-y-2"
              >
                <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                  <div>
                    <div className="text-lg lg:text-2xl text-white mb-1">
                      {res.building}
                    </div>
                    <span className="text-white text-sm">
                      Level {res.fromLevel} → {res.toLevel}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      deleteHistory(res.id)
                      toast.success(`History ${res.building} has been deleted.`)
                    }}
                    className="special-glass absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg"
                  >
                    <img src="/icon/trash-can.png" className="w-5 h-5" />
                  </button>
                </div>

                {/* Resources */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 2xl:grid-cols-6 gap-4 gap-y-0">
                  {Object.entries(res.resources || {}).map(([key, value]) => {
                    const need = res.rawResources?.[key] || 0
                    const hasCompare = compare && key in compare
                    const have = hasCompare ? compare[key] : null
                    const diff = hasCompare ? have - need : 0

                    const color =
                      diff > 0
                        ? 'text-xs text-green-400 border border-green-800 bg-green-700/20 px-2 py-1 rounded-md'
                        : diff < 0
                          ? 'text-xs text-red-200 border border-red-400 bg-red-700/20 px-2 py-1 rounded-md'
                          : 'text-xs text-gray-200 bg-white/20 px-2 py-1 rounded-md'

                    const label = diff > 0 ? '+' : diff < 0 ? '-' : 'Match'

                    return (
                      <div
                        key={key}
                        className="flex flex-col justify-center special-glass items-center px-2 py-2 rounded-xl"
                      >
                        <div className="flex items-center justify-between gap-1 w-full">
                          <ResourceIcon type={key} />
                          {formatToShortNumber(value)}
                        </div>

                        {hasCompare && (
                          <div className={`${color} mt-1`}>
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

                {/* Time & SvS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-4">
                  <div className="special-glass px-4 py-2 rounded-lg">
                    <span className="block text-sm text-white mb-1">
                      Original Time
                    </span>
                    <span className="block text-[#ffeed8]">
                      {res.timeOriginal}
                    </span>
                  </div>

                  <div className="special-glass px-4 py-2 rounded-lg">
                    <span className="block text-sm text-white mb-1">
                      Reduced Time
                    </span>
                    <span>{res.timeReduced}</span>
                  </div>

                  <div className="special-glass px-4 py-2 rounded-lg">
                    <span className="block text-sm text-white mb-1">
                      SvS Points
                    </span>

                    <span className="text-green-400 text-base">
                      {formatToShortNumber(res.svsFinal || res.svsBase || 0)}
                    </span>

                    {res.valeriaBonus > 0 && (
                      <div className="text-xs mt-1 text-cyan-400">
                        +{res.valeriaBonus}% Valeria
                      </div>
                    )}
                  </div>
                </div>

                {/* Buffs */}
                {res.buffs && (
                  <div className="flex flex-wrap gap-2 mt-3 border-t border-[#ffffff1c] pt-4 text-cyan-300 text-sm">
                    {res.buffs.petLevel !== 'Off' && (
                      <span className="px-2 py-1 bg-[#03cfbe33] rounded-md">
                        Pet: {res.buffs.petLevel}
                      </span>
                    )}
                    {res.buffs.vpLevel !== 'Off' && (
                      <span className="px-2 py-1 bg-[#03cfbe33] rounded-md">
                        VP: {res.buffs.vpLevel}
                      </span>
                    )}
                    {res.buffs.zinmanSkill !== 'Off' && (
                      <span className="px-2 py-1 bg-[#03cfbe33] rounded-md">
                        Zinman: {res.buffs.zinmanSkill}
                      </span>
                    )}
                    {res.buffs.constructionSpeed > 0 && (
                      <span className="px-2 py-1 bg-[#03cfbe33] rounded-md">
                        Speed: {res.buffs.constructionSpeed}%
                      </span>
                    )}
                    {res.buffs.doubleTime && (
                      <span className="px-2 py-1 bg-[#03cfbe33] rounded-md">
                        Double Time
                      </span>
                    )}
                    {res.valeriaBonus > 0 && (
                      <span className="px-2 py-1 bg-[#03cfbe33] rounded-md">
                        Valeria +{res.valeriaBonus}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}

          <div className="bg-special-inside-dotted flex justify-center p-6 rounded-xl">
            <Button
              onClick={() => {
                addAnother()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="buttonGlass text-white px-4 rounded"
            >
              + Add Another Building
            </Button>
          </div>

          <TotalResult results={results} comparedData={compares?.[0]} />
        </div>
      )}

      {tab === 'history' && (
        <HistoryList onDelete={onDeleteHistory} onReset={onResetHistory} />
      )}
    </div>
  )
}
