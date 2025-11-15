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

  // 🔥 TARUH YANG BARU DI ATAS
  const sortedResults = [...results].reverse()

  return (
    <div className="">
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-6 border-b border-[#ffffff46] ">
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
          {sortedResults.map((res, index) => {
            const compare = compares[0]

            const isLatest = index === 0 // 🎯 ITEM PALING BARU

            return (
              <div
                key={res.id}
                id={isLatest ? "latest-result" : undefined}
                className="bg-special-inside py-4 px-4 rounded-xl space-y-2 "
              >
                <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                  <div>
                    <div className="text-lg lg:text-2xl text-shadow-lg text-white mb-1">
                      {res.building}
                    </div>
                    <span className="text-white text-sm">Level</span>{" "}
                    <span className="text-white text-sm">
                      {res.fromLevel} → {res.toLevel}
                    </span>
                  </div>

                  {/* delete */}
                  <button
                    onClick={() => {
                      deleteHistory(res.id)
                      toast.success(`History ${res.building} has been deleted.`)
                    }}
                    className="special-glass absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:scale-105 transition-transform duration-200"
                  >
                    <img src="/icon/trash-can.png" className="w-5 h-5" />
                  </button>
                </div>

                {/* Resources */}
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 2xl:grid-cols-6 gap-4 gap-y-0 w-full">
                    {Object.entries(res.resources || {}).map(([key, value]) => {
                      const need = res.rawResources?.[key] || 0
                      const hasCompare = compare && key in compare
                      const have = hasCompare ? compare[key] : null
                      const diff = hasCompare ? have - need : 0

                      const color =
                        diff > 0
                          ? 'text-xs text-green-400 rounded-md border border-green-800 bg-green-700/10 px-2 py-1'
                          : diff < 0
                          ? 'text-xs text-red-200 border border-red-400 bg-red-500/10 px-2 py-1'
                          : 'text-xs text-gray-200 bg-white/20 px-2 py-1'

                      const label =
                        diff > 0 ? '+' : diff < 0 ? '-' : 'Match'

                      return (
                        <div
                          key={key}
                          className="flex flex-col justify-center special-glass items-center px-2 py-2 rounded-xl"
                        >
                          <div className="flex items-center justify-between gap-1 text-sm md:text-base w-full">
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
                </div>

                {/* Time & Points */}
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
                    <span className="block text-base">
                      {res.timeReduced}
                    </span>
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

                {/* Buffs */}
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
                    {res.buffs.constructionSpeed > 0 && (
                      <div className="bg-[#03cfbe33] border border-[#35dde94d] px-2 py-1 rounded-md">
                        Speed: {res.buffs.constructionSpeed}%
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

          {/* Add Another */}
          <div className="bg-special-inside-dotted flex justify-center p-6 rounded-xl ">
            <Button
              onClick={() => {
                addAnother()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="w-max buttonGlass text-white px-4 rounded"
            >
              + Add Another Building
            </Button>
          </div>

          {/* Total Result */}
          <TotalResult results={results} comparedData={compares?.[0]} />
        </div>
      )}

      {/* === TAB: HISTORY === */}
      {tab === 'history' && (
        <HistoryList
          onDelete={onDeleteHistory}
          onReset={onResetHistory}
        />
      )}
    </div>
  )
}
