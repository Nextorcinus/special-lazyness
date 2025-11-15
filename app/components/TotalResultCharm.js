'use client'

import React, { useMemo } from 'react'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import ResourceIcon from './ResourceIcon'

export default function TotalResultCharm({ results = [], compares = [] }) {
  if (!results.length) return null

  // ambil 1 compare, karena compare berlaku untuk semua
  const comparedData = compares[0] || null

  // --- Hitung total kebutuhan ---
  const total = useMemo(() => {
    return results.reduce(
      (acc, curr) => {
        const res = curr.total || {}
        acc.guide += res.guide || 0
        acc.design += res.design || 0
        acc.jewel += res.jewel || 0
        acc.svs += res.svs || 0
        return acc
      },
      { guide: 0, design: 0, jewel: 0, svs: 0 }
    )
  }, [results])

  const resources = [
    { key: 'guide', label: 'Guides' },
    { key: 'design', label: 'Design' },
    { key: 'jewel', label: 'Jewel' },
  ]

  // --- Hitung compare ---
  const compare = {}
  resources.forEach(({ key }) => {
    const have = Number(comparedData?.[key] || 0)
    const need = total[key]
    const diff = have - need

    compare[key] = {
      diff,
      label: diff > 0 ? '+' : diff < 0 ? '-' : 'Match',
      color:
        diff > 0
          ? 'text-green-400 border border-green-800 bg-green-700/10'
          : diff < 0
          ? 'text-red-200 border border-red-400 bg-red-500/10'
          : 'text-gray-200 bg-white/10',
    }
  })

  return (
    <div className="bg-special-inside-green border border-[#ffffff26] mt-8 rounded-xl p-6 space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Total Resource Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-2 gap-4 text-center">
        {resources.map(({ key, label }) => (
          <div 
            key={key} 
            className="special-glass p-3 rounded-xl flex flex-col items-center"
          >
            <ResourceIcon type={key} />
            <p className="text-sm text-zinc-200 mt-1">{label}</p>

            {/* Total need */}
            <p className="text-base text-teal-300">
              {formatToShortNumber(total[key])}
            </p>

            {/* Compare diff */}
            {comparedData && (
              <div
                className={`text-xs mt-2 px-2 py-1 rounded-md ${compare[key].color}`}
              >
                {compare[key].label !== 'Match'
                  ? `${compare[key].label}${formatToShortNumber(
                      Math.abs(compare[key].diff)
                    )}`
                  : 'Match'}
              </div>
            )}
          </div>
        ))}

        {/* === SvS Points === */}
        <div className="special-glass bg-[#9797974A] border border-[#ffffff1c] px-4 py-2 rounded-lg mb-1 flex flex-col justify-center">
          <span className="block text-white text-sm mb-1">SvS Points:</span>
          <span className="block text-teal-300 text-base ">
            {formatToShortNumber(total.svs)}
          </span>
        </div>
      </div>
    </div>
  )
}
