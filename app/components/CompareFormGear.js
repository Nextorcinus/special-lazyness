'use client'

import React, { useState, useEffect } from 'react'
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

  const [form, setForm] = useState({
    plans: '',
    polish: '',
    alloy: '',
    amber: '',
    exchange: '',
  })

  useEffect(() => {
    setForm({
      plans: comparedData.plans ? formatToShortNumber(comparedData.plans) : '',
      polish: comparedData.polish
        ? formatToShortNumber(comparedData.polish)
        : '',
      alloy: comparedData.alloy ? formatToShortNumber(comparedData.alloy) : '',
      amber: comparedData.amber ? formatToShortNumber(comparedData.amber) : '',
      exchange: '',
    })
  }, [comparedData])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => {
      const next = { ...prev, [name]: value }

      if (name === 'exchange') {
        const plans = parseNumber(prev.plans || '0')
        const exchangeValue = parseNumber(value || '0')

        const used = Math.min(plans, exchangeValue)
        const amber = Math.floor(used / 10)
        const remainingPlans = plans - used

        next.plans =
          remainingPlans > 0 ? formatToShortNumber(remainingPlans) : ''
        next.amber = amber > 0 ? formatToShortNumber(amber) : ''
      }

      return next
    })
  }

  const handleCompare = (e) => {
    e.preventDefault()

    const data = {
      plans: parseNumber(form.plans || '0'),
      polish: parseNumber(form.polish || '0'),
      alloy: parseNumber(form.alloy || '0'),
      amber: parseNumber(form.amber || '0'),
    }

    const hasValue = Object.values(data).some((v) => v > 0)

    if (!hasValue) {
      toast.warning('All inputs are empty. Enter at least one value.')
      return
    }

    toast.success('Data successfully sent for comparison!')
    onCompare?.(data)
  }

  if (readonly) {
    return (
      <div className="bg-special-inside-green p-6 rounded-xl text-white">
        {showComparisonTitle && (
          <h4 className="mb-4 text-md font-semibold">Comparison Result</h4>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4 text-sm">
          {Object.entries(requiredResources).map(([key, need]) => {
            const have = comparedData[key] || 0
            const diff = have - need
            const color = diff >= 0 ? 'text-green-400' : 'text-red-400'
            const symbol = diff >= 0 ? '+' : '-'

            return (
              <div key={key} className={`text-sm ${color}`}>
                {symbol}
                {formatToShortNumber(Math.abs(diff))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-special-inside-green p-6 rounded-xl text-white">
      <h2 className="text-xl mb-2">Own Resources</h2>

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
                  value={form[key]}
                  onChange={handleChange}
                  placeholder="e.g. 35 M, 1.5 K"
                  className="
                    w-full bg-special-input-green text-zinc-200
                    placeholder:text-zinc-500 rounded-lg
                    px-3 py-2 pl-11 border border-white/10
                    focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition
                  "
                />
              </div>
            </div>
          ))}

          {/* Exchange field */}
          <div className="space-y-1">
            <label htmlFor="exchange" className="text-sm text-white block">
              Exchange Design Plans
            </label>

            <input
              type="text"
              id="exchange"
              name="exchange"
              value={form.exchange}
              onChange={handleChange}
              placeholder="e.g. 50"
              className="
                w-full bg-special-input-green text-zinc-200
                placeholder:text-zinc-500 rounded-lg
                px-3 py-2 border border-white/10
                focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition
              "
            />

            <p className="text-xs text-zinc-400">10 Plans → 1 Amber</p>
          </div>
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
    </div>
  )
}
