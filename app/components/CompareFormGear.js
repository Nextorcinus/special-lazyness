'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function CompareFormGear({ onCompare, comparedData = {} }) {
  const [inputs, setInputs] = useState({
    plans: comparedData.plans || '',
    polish: comparedData.polish || '',
    alloy: comparedData.alloy || '',
    amber: comparedData.amber || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputs((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const parsed = {
      plans: parseInt(inputs.plans) || 0,
      polish: parseInt(inputs.polish) || 0,
      alloy: parseInt(inputs.alloy) || 0,
      amber: parseInt(inputs.amber) || 0,
    }

    const total = Object.values(parsed).reduce((sum, v) => sum + v, 0)
    if (total === 0) {
      toast.warning('All inputs are empty. Enter at least one value.')
      return
    }

    toast.success('Data successfully sent for comparison!')
    onCompare?.(parsed)
  }

  const fields = [
    { key: 'plans', label: 'Design Plans' },
    { key: 'polish', label: 'Polishing' },
    { key: 'alloy', label: 'Hardened Alloy' },
    { key: 'amber', label: 'Lunar Amber' },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-special-inside-green p-6 rounded-xl space-y-4 text-white"
    >
      <h2 className="text-xl text-white">Own Resources</h2>

      <div className="grid grid-cols-2 gap-4">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <label
              htmlFor={key}
              className="text-sm text-zinc-400 block sm:mt-1 sm:mb-1 lg:mt-3"
            >
              {label}
            </label>
            <input
              type="number"
              id={key}
              name={key}
              value={inputs[key]}
              onChange={handleChange}
              placeholder="0"
              className="w-full bg-special-input-green p-2 rounded text-zinc-400"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded text-white"
        >
          Compare
        </button>
      </div>
    </form>
  )
}
