'use client'

import React from 'react'
import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'

// ✅ khusus Helios T12 (pakai RFC lagi)
const resourceOrder = ['Steel', 'RFC', 'FC Shards']

export default function TotalResultDuaBelas({ results = [], compares = [] }) {
  if (!results.length) return null

  const total = results.find((r) => r.id === 'total')
  if (!total) return null

  const compare = compares[0] || {}
  const comparedResources = compare.resources || {}

  const hasCompare =
    compares.length > 0 && Object.keys(comparedResources).length > 0

  return (
    <div className="bg-special-inside-green border border-zinc-900 p-4 rounded-xl mt-6 space-y-4 py-6">
      <h3 className="text-lg lg:text-xl mb-2 text-[#d1e635]">
        Total Resources Required
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 2xl:grid-cols-6 gap-4 text-md">
        {resourceOrder.map((key) => {
          const need = Number(total.resources?.[key] || 0)
          const have = Number(comparedResources?.[key] || 0)
          const diff = have - need

          let colorClass =
            'text-xs text-zinc-100 rounded-md border border-zinc-300 bg-white/10 px-2 py-1'
          let label = 'Match'

          if (diff > 0) {
            colorClass =
              'text-xs text-green-400 border border-green-800 bg-green-700/10 px-2 py-1'
            label = '+'
          } else if (diff < 0) {
            colorClass =
              'text-xs text-red-200 border border-red-400 bg-red-500/10 px-2 py-1'
            label = '-'
          }

          return (
            <div
              key={key}
              className="flex flex-col items-center special-glass p-2 rounded-xl border"
            >
              <div className="flex items-center gap-1 text-[#d1e635] text-sm md:text-base mb-1">
                <ResourceIcon type={key} />
                <span>{formatToShortNumber(need)}</span>
              </div>

              {hasCompare && diff !== 0 && (
                <div className={colorClass}>
                  {label} {formatToShortNumber(Math.abs(diff))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
