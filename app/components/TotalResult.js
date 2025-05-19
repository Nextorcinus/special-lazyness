import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'

const resourceOrder = ['Meat', 'Wood', 'Coal', 'Iron', 'Crystal', 'RFC']

function sumDurations(durationStrs) {
  let totalSeconds = 0

  durationStrs.forEach((str) => {
    if (!str) return
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

export default function TotalResult({ results, comparedData = null }) {
  const total = results.reduce(
    (acc, curr) => {
      const res = curr.resources || {}
      resourceOrder.forEach((key) => {
        acc[key] += res[key] || 0
      })
      return acc
    },
    { Meat: 0, Wood: 0, Coal: 0, Iron: 0, Crystal: 0, RFC: 0 }
  )

  const totalOriginalTime = sumDurations(results.map((r) => r.timeOriginal))
  const totalReducedTime = sumDurations(results.map((r) => r.timeReduced))
  const totalSvSPoints = results.reduce((sum, r) => sum + (r.svsPoints || 0), 0)

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

  return (
    <div className="bg-[#0a0a0a] border border-zinc-900 p-4 rounded-xl mt-6 space-y-4">
      <h3 className="text-lg lg:text-xl mb-2 text-lime-400">
        Total Result Required
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

      <div className="text-sm text-zinc-400 mt-4 space-y-1">
        <div>
          <span className="text-zinc-400">Total Original Time: </span>
          <span className="text-red-400">{totalOriginalTime}</span>
        </div>
        <div>
          <span className="text-zinc-400">Total Reduced Time: </span>
          <span className="text-lime-400">{totalReducedTime}</span>
        </div>
        <div>
          <span className="text-zinc-400">Total SvS Points: </span>
          <span className="text-yellow-400">
            {formatToShortNumber(totalSvSPoints)}
          </span>
        </div>
      </div>
    </div>
  )
}
