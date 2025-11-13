'use client'

import React from 'react'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { parseNumber } from '../utils/parseNumber' // ✅ gunakan utils yang sama
import ResourceIcon from './ResourceIcon'
import { toast } from 'sonner'

export default function CompareFormHelios({
  requiredResources = {},
  comparedData = {},
  onCompare,
  readonly = false,
  showComparisonTitle = false,
  compareIndex = null,
}) {
  const resourceOrder = ['Meat', 'Wood', 'Coal', 'Iron', 'Steel', 'FC Shards']

  const handleCompare = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {}
    let hasValue = false

    resourceOrder.forEach((key) => {
      const inputValue = (formData.get(key) || '').trim()

      // Jika kosong
      if (inputValue === '') {
        data[key] = 0
        return
      }

      // ✅ Gunakan parseNumber dari utils (dukung satuan: K, M, B)
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

  // === Default Value Formatter ===
  const getDefaultValue = (key) => {
    const val =
      comparedData?.[key] || comparedData?.resources?.[key] || 0
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-3">
            {resourceOrder.map((key) => {
              const need = requiredResources[key] || 0
              const have =
                comparedData[key] || comparedData.resources?.[key] || 0
              const diff = have - need
              const isSurplus = diff >= 0
              const label = isSurplus ? 'Surplus' : 'Need'
              const color = isSurplus ? 'text-green-400' : 'text-red-400'

              return (
                <div key={key} className="flex flex-col text-sm">
                  <div className="flex items-center gap-1 text-lime-400">
                    <ResourceIcon type={key} />
                    <span>{formatToShortNumber(need)}</span>
                  </div>
                  <div className={`text-xs ${color}`}>
                    {label} – {formatToShortNumber(Math.abs(diff))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleCompare}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
            {resourceOrder.map((key) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="text-sm text-zinc-400 block sm:mt-1 sm:mb-1 lg:mt-3"
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
