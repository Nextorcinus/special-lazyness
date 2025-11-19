'use client'

import React from 'react'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import ResourceIcon from './ResourceIcon'

export default function TotalResultGear({ results = [], comparedData = null }) {
  if (!results.length) return null

  const hasCompare = comparedData && Object.keys(comparedData).length > 0

  const total = results.reduce(
    (acc, curr) => {
      const res = curr.total || {}
      acc.plans += res.plans || 0
      acc.polish += res.polish || 0
      acc.alloy += res.alloy || 0
      acc.amber += res.amber || 0
      acc.svs += res.svs || 0
      return acc
    },
    { plans: 0, polish: 0, alloy: 0, amber: 0, svs: 0 }
  )

  const resources = [
    { key: 'plans', label: 'Design Plans' },
    { key: 'polish', label: 'Polishing' },
    { key: 'alloy', label: 'Hardened Alloy' },
    { key: 'amber', label: 'Lunar Amber' },
  ]

  const compare = {}
  if (hasCompare) {
    resources.forEach(({ key }) => {
      const have = comparedData?.[key] || 0
      const need = total[key]
      const diff = have - need

      const color =
        diff > 0
          ? 'text-green-400 border border-green-800 bg-green-700/25'
          : diff < 0
          ? 'text-[#FFBABA] border border-[#AD5556] bg-[#6D1B19]/25'
          : 'text-gray-200 bg-white/10'

      const diffText =
        diff > 0
          ? '+' + formatToShortNumber(diff)
          : diff < 0
          ? '-' + formatToShortNumber(Math.abs(diff))
          : 'Match'

      compare[key] = { diff, color, diffText }
    })
  }

  return (
    <div className="bg-special-inside-green border border-[#ffffff26] mt-8 rounded-xl p-6 space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Total Resource Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-2 gap-4 text-center">
        {resources.map(({ key, label }) => (
          <div
            key={key}
            className="special-glass p-3 rounded-xl flex flex-col items-center"
          >
            <ResourceIcon type={key} />
            <p className="text-sm text-white mt-1">{label}</p>
            <p className="text-base text-teal-300">
              {formatToShortNumber(total[key])}
            </p>

            {hasCompare && (
              <div className={`text-xs mt-1 px-2 py-1 rounded-md ${compare[key].color}`}>
                {compare[key].diffText}
              </div>
            )}
          </div>
        ))}

        <div className="special-glass bg-[#9797974A] border border-[#ffffff1c] px-4 py-2 rounded-lg mb-1 flex flex-col justify-center">
          <span className="block text-white text-sm mb-1">SvS Points:</span>
          <span className="block text-white text-base ">
            {formatToShortNumber(total.svs)}
          </span>
        </div>
      </div>
    </div>
  )
}
