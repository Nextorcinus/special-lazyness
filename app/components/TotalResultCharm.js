'use client'

import React, { useMemo } from 'react'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import ResourceIcon from './ResourceIcon'

export default function TotalResultCharm({ results = [], compares = {} }) {
  if (!results.length) return null

  const hasCompare =
    compares && Object.values(compares).some((v) => Number(v) > 0)

  const total = useMemo(() => {
    return results.reduce(
      (acc, curr) => {
        const res = curr.total ?? curr ?? {}

        acc.guide += res.guide || 0
        acc.design += res.design || 0
        acc.jewel += res.jewel || 0
        acc.svs += res.svs || 0

        const typeMap = {
          Cap: 'Lancer',
          Watch: 'Lancer',
          Coat: 'Infantry',
          Pants: 'Infantry',
          Belt: 'Marksman',
          Weapon: 'Marksman',
        }

        const unitType = typeMap[curr.type]

        if (unitType && res.stat) {
          acc.stat[unitType].lethality += res.stat
          acc.stat[unitType].health += res.stat
        }

        return acc
      },
      {
        guide: 0,
        design: 0,
        jewel: 0,
        svs: 0,
        stat: {
          Infantry: { lethality: 0, health: 0 },
          Lancer: { lethality: 0, health: 0 },
          Marksman: { lethality: 0, health: 0 },
        },
      }
    )
  }, [results])

  const resources = [
    { key: 'guide', label: 'Guides' },
    { key: 'design', label: 'Design' },
    { key: 'jewel', label: 'Jewel' },
  ]

  const compare = {}
  resources.forEach(({ key }) => {
    const have = Number(compares?.[key] || 0)
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

            <p className="text-base text-teal-300">
              {formatToShortNumber(total[key])}
            </p>

            {hasCompare && (
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

        {/* SvS */}
        <div className="special-glass bg-[#9797974A] border border-[#ffffff1c] px-4 py-2 rounded-lg mb-1 flex flex-col justify-center">
          <span className="block text-white text-sm mb-1">SvS Points</span>
          <span className="block text-teal-300 text-base">
            {formatToShortNumber(total.svs)}
          </span>
        </div>

        {/* ===== Stats Summary per Unit Type ===== */}
        {Object.entries(total.stat)
          .filter(([_, v]) => v.lethality > 0 || v.health > 0)
          .map(([type, stats]) => (
            <div
              key={type}
              className="col-span-full w-full p-3 rounded-xl flex flex-col gap-2"
            >
              <span className="text-sm text-left text-white mb-1">{type}</span>

              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <div
                  className="w-full sm:w-auto sm:min-w-[100px]
                  px-3 py-2 rounded-xl
                  bg-cyan-500/20 border border-cyan-400/30 text-center"
                >
                  <div className="text-[11px] text-cyan-200/80">Lethality</div>
                  <div className="text-sm font-semibold text-white">
                    +{stats.lethality.toFixed(1)}%
                  </div>
                </div>

                <div
                  className="w-full sm:w-auto sm:min-w-[90px]
                  px-3 py-2 rounded-xl
                  bg-amber-500/20 border border-amber-400/30 text-center"
                >
                  <div className="text-[11px] text-amber-200/80">Health</div>
                  <div className="text-sm font-semibold text-white">
                    +{stats.health.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
