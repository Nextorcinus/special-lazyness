import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'

const resourceOrder = ['Meat', 'Wood', 'Coal', 'Iron', 'Steel']

export default function ResearchTotalResult({ results, comparedData = null }) {
  const total = results.reduce(
    (acc, curr) => {
      const res = curr.resources || {}
      resourceOrder.forEach((key) => {
        acc[key] += res[key] || 0
      })
      acc.originalTime += curr.timeOriginal || 0
      acc.reducedTime += curr.timeReduced || 0
      return acc
    },
    {
      Meat: 0,
      Wood: 0,
      Coal: 0,
      Iron: 0,
      Steel: 0,
      originalTime: 0,
      reducedTime: 0,
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
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    return `${d}d ${h}h ${m}m ${s}s`
  }

  return (
    <div className="bg-[#0a0a0a] border border-zinc-900 p-4 rounded-xl mt-6">
      <h3 className="text-lg lg:text-xl mb-3 text-lime-400">
        Total Research Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-md mb-4">
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

      <div className="text-sm text-white border-t border-zinc-800 pt-3">
        <p>
          <span className="text-zinc-400">Total Original Time:</span>{' '}
          <span className="text-red-400">{formatTime(total.originalTime)}</span>
        </p>
        <p>
          <span className="text-zinc-400">Total Reduced Time:</span>{' '}
          <span className="text-lime-400">{formatTime(total.reducedTime)}</span>
        </p>
      </div>
    </div>
  )
}
