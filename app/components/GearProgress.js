'use client'

import { useState, useEffect } from 'react'

const GearProgress = ({ total, compare }) => {
  const [existing, setExisting] = useState({
    plans: '',
    polish: '',
    alloy: '',
    amber: '',
  })

  const [result, setResult] = useState(null)

  useEffect(() => {
    if (compare) {
      setExisting({
        plans: compare.plans || '',
        polish: compare.polish || '',
        alloy: compare.alloy || '',
        amber: compare.amber || '',
      })
    }
  }, [compare])

  useEffect(() => {
    if (compare) {
      const newResult = {
        plans: (parseInt(compare.plans) || 0) - total.plans,
        polish: (parseInt(compare.polish) || 0) - total.polish,
        alloy: (parseInt(compare.alloy) || 0) - total.alloy,
        amber: (parseInt(compare.amber) || 0) - total.amber,
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
    { name: 'plans', label: 'Design Plans' },
    { name: 'polish', label: 'Polishing Solution' },
    { name: 'alloy', label: 'Hardened Alloy' },
    { name: 'amber', label: 'Lunar Amber' },
  ]

  if (!compare) return null

  return (
    <div className="mt-10 p-6 bg-special-inside rounded-xl shadow-2xl border border-zinc-800 space-y-6">
      <h3 className="text-xl  mb-4 ">
        Item Requirements Comparison
      </h3>
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
                const available = parseInt(existing[item.name]) || 0
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

export default GearProgress
