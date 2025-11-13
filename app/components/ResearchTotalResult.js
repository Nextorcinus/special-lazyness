'use client'

import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'

const resourceOrder = ['Meat', 'Wood', 'Coal', 'Iron', 'Steel']

function sumDurations(durationStrs) {
  let totalSeconds = 0

  durationStrs.forEach((item) => {
    if (!item) return

    // Jika input berupa angka (detik)
    if (typeof item === 'number') {
      totalSeconds += item
      return
    }

    // Jika input berupa string waktu (mis. "1d 3h 20m")
    const str = String(item)
    const regex =
      /(\d+)\s*d(?:ay)?s?|\s*(\d+)\s*h(?:our)?s?|\s*(\d+)\s*m(?:in)?s?|\s*(\d+)\s*s(?:ec)?s?/gi
    let match
    while ((match = regex.exec(str)) !== null) {
      const [_, d, h, m, s] = match.map(Number)
      if (!isNaN(d)) totalSeconds += d * 86400
      if (!isNaN(h)) totalSeconds += h * 3600
      if (!isNaN(m)) totalSeconds += m * 60
      if (!isNaN(s)) totalSeconds += s
    }
  })

  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${days}d ${hours}h ${minutes}m ${seconds}s`
}

export default function ResearchTotalResult({ results = [], comparedData = null }) {
  if (!Array.isArray(results) || results.length === 0) {
    return null
  }

  const total = results.reduce(
    (acc, curr) => {
      const res = curr.resources || {}
      resourceOrder.forEach((key) => {
        acc[key] += res[key] || 0
      })
      return acc
    },
    { Meat: 0, Wood: 0, Coal: 0, Iron: 0, Steel: 0 }
  )

  const totalOriginalTime = sumDurations(results.map((r) => r.timeOriginal))
  const totalReducedTime = sumDurations(results.map((r) => r.timeReduced))

  const compare = {}
  resourceOrder.forEach((key) => {
    const have = comparedData?.[key] || 0
    const need = total[key]
    const diff = have - need

    compare[key] = {
      diff,
      color:
        diff > 0
          ? 'text-xs text-green-400 border border-green-800 bg-green-700/10 px-2 py-1 rounded'
          : diff < 0
          ? 'text-xs text-red-200 border border-red-400 bg-red-500/10 px-2 py-1 rounded'
          : 'text-xs text-gray-200 bg-white/20 px-2 py-1 rounded',
      label: diff > 0 ? '+' : diff < 0 ? '-' : 'Match',
    }
  })

  return (
    <div className="bg-special-inside p-4 rounded-xl mt-6 space-y-4 py-6 border border-zinc-900">
      <h3 className="text-lg lg:text-xl mb-2 text-[#d1e635] text-shadow-lg">
        Total Research Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-md">
        {resourceOrder.map((key) => (
          <div
            key={key}
            className="flex flex-col items-center special-glass p-2 rounded-xl border"
          >
            <div className="flex items-center gap-1 text-[#d1e635] text-sm md:text-sm lg:text-base mb-1">
              <ResourceIcon type={key} />
              <span>{formatToShortNumber(total[key])}</span>
            </div>

            {comparedData && (
              <div className={compare[key].color}>
                {compare[key].label}
                {compare[key].label !== 'Match' && (
                  <> {formatToShortNumber(Math.abs(compare[key].diff))}</>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-sm md:text-base text-zinc-400 mt-4 space-y-1 border-t border-[#ffffff1c] pt-3">
        <div>
          <span className="text-zinc-300">Total Original Time: </span>
          <span className="text-yellow-100">{totalOriginalTime}</span>
        </div>
        <div>
          <span className="text-zinc-300">Total Reduced Time: </span>
          <span className="text-lime-400">{totalReducedTime}</span>
        </div>
      </div>
    </div>
  )
}
