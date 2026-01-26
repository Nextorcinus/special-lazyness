'use client'

import React from 'react'
import { toast } from 'sonner'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { parseNumber } from '../utils/parseNumber'
import ResourceIcon from './ResourceIcon'

export default function CompareFormGear({
  requiredResources = {},
  comparedData = {},
  onCompare,
  readonly = false,
  showComparisonTitle = false,
}) {
  const resources = [
    { key: 'plans', label: 'Design Plans' },
    { key: 'polish', label: 'Polishing' },
    { key: 'alloy', label: 'Hardened Alloy' },
    { key: 'amber', label: 'Lunar Amber' },
  ]

  const handleCompare = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {}
    let hasValue = false

    resources.forEach(({ key }) => {
      const inputValue = formData.get(key) || ''
      if (inputValue.trim() === '') {
        data[key] = 0
        return
      }

      const value = parseNumber(inputValue)
      data[key] = value

      if (!isNaN(value) && value > 0) {
        hasValue = true
      }
    })

    if (!hasValue) {
      toast.warning('All inputs are empty. Enter at least one value.')
      return
    }

    toast.success('Data successfully sent for comparison!')
    onCompare?.(data)
  }

  // Untuk display default value saat edit ulang
  const getDefaultValue = (key) => {
    const value = comparedData?.[key]
    if (!value || value === 0) return ''
    return formatToShortNumber(value)
  }

  return (
    <div className="bg-special-inside-green p-6 rounded-xl text-white">
      {!readonly && <h2 className="text-xl mb-2">Own Resources</h2>}

      {readonly ? (
        <div>
          {readonly && showComparisonTitle && (
            <h4 className="mb-4 text-md font-semibold">Comparison Result</h4>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4 text-sm">
            {Object.entries(requiredResources).map(([key, need]) => {
              const have = comparedData[key] || 0
              const diff = have - need
              const status = diff >= 0 ? 'Surplus' : 'Missing'
              const color = diff >= 0 ? 'text-green-400' : 'text-red-400'
              const display = diff >= 0 ? '+' : '-'

              return (
                <div key={key} className={`text-sm ${color}`}>
                  {status}: {display}
                  {formatToShortNumber(Math.abs(diff))}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <form onSubmit={handleCompare}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map(({ key, label }) => (
              <div key={key} className="space-y-1">
                <label htmlFor={key} className="text-sm text-white block">
                  {label}
                </label>

                <div className="relative">
                  <div className="absolute left-3 top-[40%] -translate-y-1/2 pointer-events-none opacity-80">
                    <ResourceIcon type={key} />
                  </div>

                  <input
                    type="text"
                    id={key}
                    name={key}
                    defaultValue={getDefaultValue(key)}
                    placeholder="e.g. 35 M, 1.5 K"
                    className="
            w-full
            bg-special-input-green
            text-zinc-200
            placeholder:text-zinc-500
            rounded-lg
            px-3
            py-2
            pl-11
            border border-white/10
            focus:outline-none
            focus:ring-2
            focus:ring-teal-500/40
            transition
          "
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 button-Form rounded text-white"
            >
              Compare
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
