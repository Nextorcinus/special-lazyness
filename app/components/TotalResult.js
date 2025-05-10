import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'

const resourceOrder = ['Meat', 'Wood', 'Coal', 'Iron', 'Crystal', 'RFC']

export default function TotalResult({ results, comparedData = null }) {
  // Hitung total kebutuhan dari semua hasil
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

  // Hitung compare terhadap total jika ada
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
    <div className="bg-[#0a0a0a] border border-zinc-900 p-4 rounded-xl mt-6">
      <h3 className="text-lg lg:text-xl mb-3 text-lime-400">
        Total Result Required
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-md">
        {resourceOrder.map((key) => (
          <div
            key={key}
            className="flex flex-col items-center bg-black/10 p-2 rounded-xl border border-zinc-900"
          >
            {/* Total yang dibutuhkan */}
            <div className="flex items-center gap-1 text-lime-400 text-sm md:text-sm lg:text-base">
              <ResourceIcon type={key} />
              <span>{formatToShortNumber(total[key])}</span>
            </div>

            {/* Compare */}
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
    </div>
  )
}
