'use client'

import React, { useMemo } from 'react'

import ResourceIcon from './ResourceIcon'

import { formatToShortNumber } from '../utils/formatToShortNumber'

// ================= RESOURCE ORDER =================

const resourceOrder = [
  'Steel',
  'RFC',
  'FC Shards',
  'Meat',
  'Wood',
  'Coal',
  'Iron',
]

// ================= TIME HELPERS =================

const timeToSeconds = (time = '00:00:00') => {
  const [h = 0, m = 0, s = 0] = time.split(':').map(Number)

  return h * 3600 + m * 60 + s
}

const secondsToTime = (seconds) => {
  const h = Math.floor(seconds / 3600)

  const m = Math.floor((seconds % 3600) / 60)

  const s = seconds % 60

  return [
    String(h).padStart(2, '0'),

    String(m).padStart(2, '0'),

    String(s).padStart(2, '0'),
  ].join(':')
}

export default function TotalResultSkill({ results = [], compares = [] }) {
  // ================= EMPTY =================

  if (!results.length) {
    return null
  }

  // ================= GRAND TOTAL =================

  const totalResources = useMemo(() => {
    return results.reduce((acc, result) => {
      const resources = result?.resources || {}

      Object.entries(resources).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + Number(value || 0)
      })

      return acc
    }, {})
  }, [results])

  // ================= TOTAL POWER =================

  const totalPower = useMemo(() => {
    return results.reduce(
      (sum, item) => sum + Number(item?.power || item?.totalPower || 0),
      0
    )
  }, [results])

  // ================= TOTAL ORIGINAL TIME =================

  const totalOriginalSeconds = useMemo(() => {
    return results.reduce((total, result) => {
      const skill = result?.skills?.[0]

      return total + timeToSeconds(skill?.time)
    }, 0)
  }, [results])

  const totalOriginalTime = secondsToTime(totalOriginalSeconds)

  // ================= TOTAL REDUCED TIME =================

  const totalReducedSeconds = useMemo(() => {
    return results.reduce((total, result) => {
      const skill = result?.skills?.[0]

      const baseSeconds = timeToSeconds(skill?.time)

      const researchSpeed = Number(result?.buffs?.researchSpeed || 0)

      const vpBonus = Number(result?.buffs?.vpBonus || 0)

      const totalReduction = researchSpeed + vpBonus

      const reduced = baseSeconds * (1 - totalReduction / 100)

      return total + Math.max(0, reduced)
    }, 0)
  }, [results])

  const totalReducedTime = secondsToTime(Math.floor(totalReducedSeconds))

  // ================= COMPARE =================

  const compare = compares?.[0] || {}

  const comparedResources = compare?.resources || {}

  const hasCompare =
    compares.length > 0 && Object.keys(comparedResources).length > 0

  return (
    <div className="bg-special-inside-green border border-zinc-900 p-4 rounded-xl mt-6 space-y-4 py-6">
      {/* HEADER */}

      <h3 className="text-lg lg:text-xl mb-2 text-[#d1e635]">
        Total Resources Required
      </h3>

      {/* ================= RESOURCE ================= */}

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 text-md">
        {resourceOrder.map((key) => {
          const need = Number(totalResources?.[key] || 0)

          // HIDE 0
          if (need <= 0) {
            return null
          }

          const have = Number(comparedResources?.[key] || 0)

          const diff = have - need

          let colorClass =
            'text-xs text-zinc-100 rounded-md border border-zinc-300 bg-white/10 px-2 py-1'

          let label = 'Match'

          // POSITIVE

          if (diff > 0) {
            colorClass =
              'text-xs text-green-400 border border-green-800 bg-green-700/10 px-2 py-1'

            label = '+'
          }

          // NEGATIVE
          else if (diff < 0) {
            colorClass =
              'text-xs text-red-200 border border-red-400 bg-red-500/10 px-2 py-1'

            label = '-'
          }

          return (
            <div
              key={key}
              className="flex flex-col items-center special-glass p-3 rounded-xl border"
            >
              {/* RESOURCE */}

              <div className="flex items-center gap-1 text-[#d1e635] text-sm md:text-base mb-1">
                <ResourceIcon type={key} />

                <span>{formatToShortNumber(need)}</span>
              </div>

              {/* COMPARE */}

              {hasCompare && diff !== 0 && (
                <div className={colorClass}>
                  {label} {formatToShortNumber(Math.abs(diff))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ================= STATS ================= */}

      <div className="space-y-2 text-sm md:text-base">
        {/* POWER */}

        <div className="special-glass rounded-xl p-4 flex justify-between items-center">
          <span className="text-zinc-300">Total Power</span>

          <span className="text-[#d1e635] font-semibold">
            {formatToShortNumber(totalPower)}
          </span>
        </div>

        {/* ORIGINAL TIME */}

        <div className="special-glass rounded-xl p-4 flex justify-between items-center">
          <span className="text-zinc-300">Total Original Time</span>

          <span className="text-yellow-100 font-semibold">
            {totalOriginalTime}
          </span>
        </div>

        {/* REDUCED TIME */}

        <div className="special-glass rounded-xl p-4 flex justify-between items-center">
          <span className="text-zinc-300">Total Reduced Time</span>

          <span className="text-lime-400 font-semibold">
            {totalReducedTime}
          </span>
        </div>
      </div>
    </div>
  )
}
