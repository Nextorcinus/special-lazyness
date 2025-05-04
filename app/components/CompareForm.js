'use client'

import React from 'react'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import { parseNumber } from '../utils/parseNumber'

function CompareForm({ requiredResources = {}, comparedData = {}, onCompare, readonly = false }) {
  const resources = ['Meat', 'Wood', 'Coal', 'Iron', 'Crystal', 'RFC']

  const handleCompare = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const data = {}
    resources.forEach((key) => {
      data[key] = parseFloat(formData.get(key)) || 0
    })
    onCompare?.(data)
  }

  return (
    <div className="bg-gray-900 p-4 mt-4 rounded-xl text-white shadow">
      {!readonly && <h3 className="text-lg font-semibold mb-2">Compare Your Resources</h3>}
      {readonly ? (
        <div>
          <h4 className="font-semibold mb-2">Comparison Result</h4>
          <ul className="text-sm space-y-1">
            {resources.map((key) => {
              const have = parseNumber(comparedData?.[key] ?? 0)
              const need = parseNumber(requiredResources?.[key] ?? 0)
              const diff = have - need
              const status =
                diff >= 0
                  ? `→ Surplus: ${formatToShortNumber(diff)}`
                  : `→ Missing: ${formatToShortNumber(Math.abs(diff))}`
              const color = diff >= 0 ? 'text-green-400' : 'text-red-400'

              return (
                <li key={key}>
                  <strong>{key}:</strong>{' '}
                  You have <span className="text-blue-300">{formatToShortNumber(have)}</span> / Need{' '}
                  <span className="text-yellow-300">{formatToShortNumber(need)}</span>{' '}
                  <span className={color}>{status}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <form onSubmit={handleCompare}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {resources.map((key) => (
              <div key={key}>
                <label htmlFor={key} className="text-sm block mb-1">
                  {key}
                </label>
                <input
                  type="number"
                  step="any"
                  name={key}
                  id={key}
                  defaultValue={comparedData?.[key] || ''}
                  className="w-full bg-gray-800 p-2 rounded text-white"
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Compare
          </button>
        </form>
      )}
    </div>
  )
}

export default CompareForm
