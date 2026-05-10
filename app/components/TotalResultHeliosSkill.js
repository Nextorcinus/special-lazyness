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

  // ================= COMPARE =================

  const compare = compares?.[0] || {}

  const comparedResources = compare?.resources || {}

  const hasCompare =
    compares.length > 0 && Object.keys(comparedResources).length > 0

  // ================= TOTAL POWER =================

  const totalPower = useMemo(() => {
    return results.reduce(
      (sum, item) => sum + Number(item?.power || item?.totalPower || 0),
      0
    )
  }, [results])

  return (
    <div className="bg-special-inside-green border border-zinc-900 p-4 rounded-xl mt-6 space-y-4 py-6">
      {/* HEADER */}

      <h3 className="text-lg lg:text-xl mb-2 text-[#d1e635]">
        Total Resources Required
      </h3>

      {/* ================= RESOURCE ================= */}

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4 text-md">
        {resourceOrder.map((key) => {
          const need = Number(totalResources?.[key] || 0)

          // HIDE 0 RESOURCE
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

      {/* ================= TOTAL POWER ================= */}

      <div className="special-glass rounded-xl p-4 flex justify-center items-center">
        <div className="text-base md:text-lg text-[#d1e635]">
          Total Power: {formatToShortNumber(totalPower)}
        </div>
      </div>
    </div>
  )
}
