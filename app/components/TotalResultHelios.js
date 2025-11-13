'use client'

import React from 'react'
import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { formatDuration } from '../utils/calculateResearch'

// urutan sumber daya untuk tampilan
const resourceOrder = ['Meat', 'Wood', 'Coal', 'Iron', 'Steel', 'FC Shards']

export default function TotalResultHelios({ results = [], compares = [] }) {
  if (!results.length) return null

  const total = results.find((r) => r.id === 'total')
  if (!total) return null

  const compare = compares[0] || {}
  const comparedResources = compare.resources || {}

  // Hitung total SvS Points (jika ada di tiap result)
  const totalSvSPoints = results.reduce(
    (sum, r) => sum + (r.svsPoints || 0),
    0
  )

  return (
    <div className="bg-special-inside-green border border-zinc-900 p-4 rounded-xl mt-6 space-y-4 py-6">
      <h3 className="text-lg lg:text-xl mb-2 text-[#d1e635]">
        Total Result Required
      </h3>

      {/* === Resource Total === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 2xl:grid-cols-6 gap-4 text-md">
        {resourceOrder.map((key) => {
          const need = total.resources?.[key] || 0
          const have = comparedResources[key] || 0
          const diff = have - need

          let colorClass =
            'text-xs text-zinc-100 rounded-md border border-zinc-300 bg-white/10 px-2 py-1'
          let label = 'Match'
          if (diff > 0)
            colorClass =
              'text-xs text-green-400 rounded-md border border-green-800 bg-green-700/10 px-2 py-1'
          else if (diff < 0)
            colorClass =
              'text-xs text-red-200 rounded-md border border-red-400 bg-red-500/10 px-2 py-1'

          if (diff > 0) label = '+'
          else if (diff < 0) label = '-'

          return (
            <div
              key={key}
              className="flex flex-col items-center special-glass p-2 rounded-xl border"
            >
              <div className="flex items-center gap-1 text-[#d1e635] text-sm md:text-sm lg:text-base mb-1">
                <ResourceIcon type={key} />
                <span>{formatToShortNumber(need)}</span>
              </div>
              {compares.length > 0 && Object.keys(comparedResources).length > 0 && (
  <div className={`${colorClass}`}>
    {label}
    {label !== 'Match' && (
      <> {formatToShortNumber(Math.abs(diff))}</>
    )}
  </div>
)}
            </div>
          )
        })}
      </div>

      {/* === TOTAL TIME & POINTS === */}
      <div className="text-sm md:text-base text-zinc-400 mt-4 space-y-1">
        <div>
          <span className="text-zinc-300">Total Original Time: </span>
          <span className="text-yellow-100">
            {formatDuration(total.timeOriginal || 0)}
          </span>
        </div>
        <div>
          <span className="text-zinc-300">Total Reduced Time: </span>
          <span className="text-lime-400">
            {formatDuration(total.timeReduced || 0)}
          </span>
        </div>
        {totalSvSPoints > 0 && (
          <div>
            <span className="text-zinc-300">Total SvS Points: </span>
            <span className="text-yellow-400">
              {formatToShortNumber(totalSvSPoints)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
