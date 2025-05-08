import ResourceIcon from './ResourceIcon'
import { formatToShortNumber } from '../utils/formatToShortNumber'

const resourceOrder = ['Meat', 'Wood', 'Coal', 'Iron', 'Crystal', 'RFC']

export default function TotalResult({ results }) {
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

  return (
    <div className="bg-black border border-zinc-900 p-4 rounded-xl mt-6 ">
      <h3 className="text-lg lg:text-xl mb-3 text-yellow-100">
        Total Result Required
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-md">
        {resourceOrder.map((key) => (
          <div
            key={key}
            className="flex items-center gap-2 text-lime-500 text-md md:text-lg justify-start md:justify-center"
          >
            <ResourceIcon type={key} />
            <span>{formatToShortNumber(total[key])}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
