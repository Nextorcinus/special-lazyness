'use client'

import React, { useMemo, useState } from 'react'

import HeliosSkillHistoryList from './HeliosSkillHistoryList'
import ResourceIcon from './ResourceIcon'
import TotalResultSkill from './TotalResultHeliosSkill'

import { formatToShortNumber } from '../utils/formatToShortNumber'

import { useHeliosSkillHistory } from '../dashboard/war-academy/T12-skills/HeliosSkillsHistoryContext'

import { toast } from 'sonner'

import { Button } from './ui/button'

import { useAddAnother } from '../dashboard/research/AddAnotherContext'

export default function TabSwitcherSkill({
  results = [],
  compares = [],
  onDeleteHistory,
  onResetHistory,
}) {
  const [tab, setTab] = useState('overview')

  const { deleteHistory } = useHeliosSkillHistory()

  const { addAnother } = useAddAnother()

  // ================= GRAND TOTAL =================

  const grandTotalResources = useMemo(() => {
    if (!Array.isArray(results) || results.length === 0) {
      return {}
    }

    return results.reduce((acc, result) => {
      const resources = result?.resources || {}

      Object.entries(resources).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + Number(value || 0)
      })

      return acc
    }, {})
  }, [results])

  // ================= SORT =================

  const sortedResults = useMemo(() => {
    return [...results].reverse()
  }, [results])

  return (
    <div>
      {/* ================= TAB BUTTON ================= */}

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
            const resources = res?.resources || {}

            const compare = compares?.[0] || {}

            const compareResources = compare?.resources || {}

            const skills = Array.isArray(res?.skills) ? res.skills : []

            const isLatest = index === 0

            return (
              <div
                key={res.id}
                id={isLatest ? 'latest-result' : undefined}
                className="bg-special-inside py-4 px-4 rounded-xl space-y-5"
              >
                {/* ================= HEADER ================= */}

                <div className="relative flex justify-between items-center bg-title-result mb-4 pr-12">
                  <div>
                    <div className="text-lg lg:text-xl text-shadow-lg text-white mb-1">
                      Helios Result
                    </div>

                    <div className="text-sm text-yellow-300">{res?.unit}</div>
                  </div>

                  <button
                    onClick={() => {
                      deleteHistory(res.id)

                      toast.success('Result deleted')
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

                {/* ================= SKILL DETAILS ================= */}

                <div className="space-y-4">
                  {skills.map((skill, idx) => (
                    <div
                      key={idx}
                      className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-4"
                    >
                      {/* HEADER */}
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {skill?.name}
                          </div>

                          <div className="text-sm text-white/70">
                            {skill?.category}
                          </div>

                          <div className="text-sm text-yellow-300 mt-1">
                            Level {skill?.fromLevel} → {skill?.toLevel}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <div className="text-xs px-3 py-1 rounded-full border bg-cyan-500/20 border-cyan-400 text-cyan-100 capitalize">
                            {skill?.type}
                          </div>

                          <div className="text-xs px-3 py-1 rounded-full border bg-yellow-500/20 border-yellow-400 text-yellow-100">
                            {skill?.category === 'Solar Supremacy' ? (
                              <>
                                Capacity:{' '}
                                {formatToShortNumber(
                                  Number(skill?.capacity || 0)
                                )}
                              </>
                            ) : (
                              <>{skill?.stat || 0}%</>
                            )}
                          </div>

                          <div className="text-xs px-3 py-1 rounded-full border bg-purple-500/20 border-purple-400 text-purple-100">
                            Power:{' '}
                            {formatToShortNumber(Number(skill?.power || 0))}
                          </div>

                          <div className="text-xs px-3 py-1 rounded-full border bg-green-500/20 border-green-400 text-green-100">
                            Time:{skill?.time}
                          </div>
                        </div>
                      </div>

                      {/* RESOURCES */}
                      <div>
                        <div className="text-sm text-white/70 mb-2">
                          Resources Needed (Level {skill?.toLevel})
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2">
                          {Object.entries(skill.resources || {})
                            .filter(([, value]) => Number(value) > 0)
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="special-glass rounded-lg px-3 py-2 flex items-center justify-center gap-2 text-sm"
                              >
                                <ResourceIcon type={key} />

                                <span>
                                  {formatToShortNumber(Number(value || 0))}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ================= BUFFS ================= */}

                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="text-xs px-3 py-1 rounded-full border border-purple-400 bg-purple-500/10">
                    Research Speed: {res?.buffs?.researchSpeed || 0}%
                  </div>

                  <div className="text-xs px-3 py-1 rounded-full border border-pink-400 bg-pink-500/10">
                    VP Bonus: {res?.buffs?.vpBonus || 0}%
                  </div>
                </div>
              </div>
            )
          })}

          {/* ================= ADD ANOTHER ================= */}

          <div className="bg-special-inside-dotted flex justify-center p-6 rounded-xl">
            <Button
              onClick={() => {
                addAnother()

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }}
              className="w-max buttonGlass text-white px-4 rounded"
            >
              + Unlock Other
            </Button>
          </div>

          {/* ================= GRAND TOTAL ================= */}

          <TotalResultSkill
            results={results}
            totalResources={grandTotalResources}
            compares={compares}
          />
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
