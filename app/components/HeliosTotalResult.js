'use client'

import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'

const resourceOrder = ['Meat', 'Wood', 'Coal', 'Iron', 'Steel', 'FC Shards']

export default function HeliosTotalResult({
  results = [],
  comparedData = null,
}) {
  const total = results.reduce(
    (acc, res) => {
      resourceOrder.forEach((key) => {
        acc[key] += res.resources?.[key] || 0
      })
      acc.timeOriginal += res.timeOriginal || 0
      acc.timeReduced += res.timeReduced || 0
      return acc
    },
    {
      Meat: 0,
      Wood: 0,
      Coal: 0,
      Iron: 0,
      Steel: 0,
      'FC Shards': 0,
      timeOriginal: 0,
      timeReduced: 0,
    }
  )

  const compare = {}
  resourceOrder.forEach((key) => {
    const have = comparedData?.[key] || 0
    const need = total[key]
    const diff = have - need

    compare[key] = {
      diff,
      color:
        diff > 0
          ? 'text-green-400'
          : diff < 0
          ? 'text-red-400'
          : 'text-zinc-400',
      label: diff > 0 ? 'Extra +' : diff < 0 ? 'Need -' : 'Match',
    }
  })

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    const parts = []
    if (d) parts.push(`${d}d`)
    if (h) parts.push(`${h}h`)
    if (m) parts.push(`${m}m`)
    if (s || parts.length === 0) parts.push(`${s}s`)
    return parts.join(' ')
  }

  return (
    <div className="bg-[#0a0a0a] border border-zinc-900 p-4 rounded-xl mt-6">
      <h3 className="text-lg lg:text-xl mb-3 text-lime-400">
        Total Helios Result Required
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-md">
        {resourceOrder.map((key) => (
          <div
            key={key}
            className="flex flex-col items-center bg-black/10 p-2 rounded-xl border border-zinc-900"
          >
            <div className="flex items-center gap-1 text-lime-400 text-sm md:text-sm lg:text-base">
              <ResourceIcon type={key} />
              <span>{formatToShortNumber(total[key])}</span>
            </div>

            {comparedData && (
              <div className={`text-xs ${compare[key].color}`}>
                {compare[key].label}
                {compare[key].label !== 'Match' && (
                  <> {formatToShortNumber(Math.abs(compare[key].diff))}</>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-sm mt-4 text-zinc-400">
        Original Time:{' '}
        <span className="text-red-400">{formatTime(total.timeOriginal)}</span>
      </div>
      <div className="text-sm text-zinc-400">
        Reduced Time:{' '}
        <span className="text-lime-400">{formatTime(total.timeReduced)}</span>
      </div>
    </div>
  )
}
