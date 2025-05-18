'use client'

import { useState, useEffect } from 'react'

export default function CharmProgress({ total, compare }) {
  const [existing, setExisting] = useState({
    guide: '',
    design: '',
    power: '',
    stat: '',
  })

  const [result, setResult] = useState(null)

  useEffect(() => {
    if (compare) {
      setExisting({
        guide: compare.guide || '',
        design: compare.design || '',
        power: compare.power || '',
        stat: compare.stat || '',
      })
    }
  }, [compare])

  useEffect(() => {
    if (compare) {
      const newResult = {
        guide: (parseInt(compare.guide) || 0) - total.guide,
        design: (parseInt(compare.design) || 0) - total.design,
        power: (parseInt(compare.power) || 0) - total.power,
        stat: (parseFloat(compare.stat) || 0) - total.stat,
      }
      setResult(newResult)
    }
  }, [compare, total])

  const calculateProgress = (available, required) => {
    if (required <= 0) return 100
    const percent = Math.min(100, Math.max(0, (available / required) * 100))
    return Math.round(percent)
  }

  const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-400'
    return 'bg-red-500'
  }

  const fields = [
    { name: 'guide', label: 'Charm Guide' },
    { name: 'design', label: 'Design Manual' },
    { name: 'power', label: 'Power Increase' },
    { name: 'stat', label: 'Stat Bonus' },
  ]

  if (!compare) return null

  return (
    <div className="mt-10 p-6 bg-special-inside rounded-xl shadow-2xl border border-zinc-800 space-y-6">
      <h3 className="text-xl mb-4">Charm Requirements Comparison</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-zinc-700">
            <tr>
              <th className="border border-zinc-800 text-sm p-2">Item</th>
              <th className="border border-zinc-800 text-sm p-2">Status</th>
              <th className="border border-zinc-800 text-sm p-2">Progress</th>
            </tr>
          </thead>
          <tbody>
            {result &&
              fields.map((item) => {
                const available = parseFloat(existing[item.name]) || 0
                const required = total[item.name] || 0
                const progress = calculateProgress(available, required)
                const isSufficient = result[item.name] >= 0

                return (
                  <tr key={item.name}>
                    <td className="border border-zinc-800 p-2">{item.label}</td>
                    <td className="border border-zinc-800 p-2">
                      {isSufficient ? (
                        <span className="text-green-600">
                          ({result[item.name]} left) Sufficient
                        </span>
                      ) : (
                        <span className="text-red-400">
                          Need -{Math.abs(result[item.name])}
                        </span>
                      )}
                    </td>
                    <td className="border border-zinc-800 p-2">
                      <div className="w-full bg-zinc-800 rounded h-3 overflow-hidden">
                        <div
                          className={`h-3 transition-all duration-700 ease-in-out ${getProgressColor(
                            progress
                          )}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-center mt-1">
                        {progress}%
                      </div>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
