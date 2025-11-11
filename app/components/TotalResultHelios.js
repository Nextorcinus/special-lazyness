'use client'

import React from 'react'
import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { formatDuration } from '../utils/calculateResearch'

export default function TotalResultHelios({ results = [], compares = [] }) {
  if (!results.length) return null

  const total = results.find((r) => r.id === 'total')
  if (!total) return null

  const compare = compares[0] || {}

  return (
    <div className="bg-special-inside py-6 px-6 rounded-xl mt-8 space-y-4">
      <div className="text-xl text-white font-semibold border-b border-[#ffffff33] pb-2 mb-4">
        Total Summary
      </div>

      {/* === Resource Total === */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 2xl:grid-cols-6 gap-4">
        {Object.entries(total.resources || {}).map(([key, value]) => {
          const compareVal = compare.resources?.[key] ?? null
          const diff = compareVal !== null ? value - compareVal : null
          const isMatch = diff === 0

          let colorClass = 'text-xs text-gray-200 bg-white/20 px-2 py-1'
          let label = 'Match'
          if (diff > 0)
            colorClass =
              'text-xs text-red-200 border border-red-400 bg-red-500/10 px-2 py-1'
          else if (diff < 0)
            colorClass =
              'text-xs text-green-400 border border-green-800 bg-green-700/10 px-2 py-1'

          if (diff > 0) label = '+'
          else if (diff < 0) label = '-'

          return (
            <div
              key={key}
              className="flex flex-col justify-center special-glass items-center px-2 py-2 rounded-xl"
            >
              <div className="flex items-center justify-between gap-1 text-sm md:text-base w-full">
                <ResourceIcon type={key} />
                {formatToShortNumber(value)}
              </div>
              {diff !== null && (
                <div className={`rounded-md mt-1 ${colorClass}`}>
                  {label}
                  {!isMatch && <> {formatToShortNumber(Math.abs(diff))}</>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* === TOTAL TIME === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-y-0 gap-x-4 mt-6">
        <div className="special-glass bg-[#9797974A] border border-[#ffffff1c] px-4 py-2 rounded-lg mb-1">
          <span className="block text-white text-sm mb-1">Total Original Time</span>
          <span className="block text-[#ffeed8] text-sm">
            {formatDuration(total.timeOriginal || 0)}
          </span>
        </div>
        <div className="special-glass px-4 py-2 rounded-lg">
          <span className="block text-white text-sm mb-1">Total Reduced Time</span>
          <span className="block text-base">
            {formatDuration(total.timeReduced || 0)}
          </span>
        </div>
      </div>
    </div>
  )
}
