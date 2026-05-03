'use client'

import React from 'react'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { parseNumber } from '../utils/parseNumber'
import ResourceIcon from './ResourceIcon'
import { toast } from 'sonner'

// ✅ khusus Helios T12
const resourceOrder = ['Steel', 'RFC', 'FC Shards']

export default function CompareFormHeliosSkill({
  requiredResources = {},
  comparedData = {},
  onCompare,
  readonly = false,
  showComparisonTitle = false,
}) {
  const handleCompare = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {}
    let hasValue = false

    resourceOrder.forEach((key) => {
      const inputValue = (formData.get(key) || '').trim()

      if (inputValue === '') {
        data[key] = 0
        return
      }

      const value = parseNumber(inputValue)
      data[key] = value

      if (!isNaN(value) && value > 0) hasValue = true
    })

    if (!hasValue) {
      toast.warning('All inputs are empty. Enter at least one value.')
      return
    }

    toast.success('Data successfully sent for comparison!')
    onCompare?.({ resources: data })
  }

  const getDefaultValue = (key) => {
    const val = comparedData?.[key] || comparedData?.resources?.[key] || 0
    if (!val || val === 0) return ''
    return formatToShortNumber(val)
  }

  return (
    <div className="lg:mt-6 p-4 bg-special-inside-green rounded-xl text-white shadow">
      {!readonly && <h3 className="text-xl mb-2">Own Resources</h3>}

      {readonly ? (
        <div>
          {showComparisonTitle && (
            <h4 className="mb-4 text-md font-semibold">Comparison Result</h4>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(requiredResources).map(([key, need]) => {
              const have =
                comparedData[key] ?? comparedData?.resources?.[key] ?? 0
              const diff = have - need
              const color = diff >= 0 ? 'text-green-400' : 'text-red-400'
              const prefix = diff >= 0 ? '+' : '-'

              return (
                <div key={key} className={`text-sm ${color}`}>
                  {prefix}
                  {formatToShortNumber(Math.abs(diff))}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleCompare}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {resourceOrder.map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="text-sm text-zinc-400 block mb-1"
                >
                  {key}
                </label>

                <input
                  type="text"
                  name={key}
                  id={key}
                  defaultValue={getDefaultValue(key)}
                  placeholder="e.g., 35M, 1.5K, 2B"
                  className="w-full bg-special-input-green p-2 rounded text-zinc-400 placeholder-zinc-500"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 px-4 py-2 bg-lime-600 hover:bg-green-700 rounded text-white w-full"
          >
            Compare
          </button>
        </form>
      )}
    </div>
  )
}
