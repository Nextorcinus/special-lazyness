'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export default function CompareFormGear({ onCompare }) {
  const [inputs, setInputs] = useState({
    plans: '',
    polish: '',
    alloy: '',
    amber: '',
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
    onCompare(parsed)

    const total = Object.values(parsed).reduce((sum, val) => sum + val, 0)
    if (total === 0) {
      toast.warning('All inputs are empty. Enter at least one value.')
      return
    }

    toast.success('Data sent successfully compared!')
    onCompare(parsed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-special-inside-green p-6 rounded-xl border border-zinc-800 shadow space-y-4"
    >
      <h2 className="text-xl text-white ">Own Resources</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="plans"
            className="text-sm text-zinc-400 block sm:mt-1 sm:mb-1 lg:mt-3"
          >
            Design Plans
          </label>
          <input
            type="number"
            id="plans"
            name="plans"
            value={inputs.plans}
            onChange={handleChange}
            placeholder=""
            className="w-full bg-special-input-green p-2 rounded text-zinc-400"
          />
        </div>

        <div>
          <label
            htmlFor="polish"
            className="text-sm text-zinc-400 block sm:mt-1 sm:mb-1 lg:mt-3"
          >
            Polishing
          </label>
          <input
            type="number"
            id="polish"
            name="polish"
            value={inputs.polish}
            onChange={handleChange}
            placeholder=""
            className="w-full bg-special-input-green p-2 rounded text-zinc-400"
          />
        </div>

        <div>
          <label
            htmlFor="alloy"
            className="text-sm text-zinc-400 block sm:mt-1 sm:mb-1 lg:mt-3"
          >
            Hardened Alloy
          </label>
          <input
            type="number"
            id="alloy"
            name="alloy"
            value={inputs.alloy}
            onChange={handleChange}
            placeholder=""
            className="w-full bg-special-input-green p-2 rounded text-zinc-400"
          />
        </div>

        <div>
          <label
            htmlFor="amber"
            className="text-sm text-zinc-400 block sm:mt-1 sm:mb-1 lg:mt-3"
          >
            Lunar Amber
          </label>
          <input
            type="number"
            id="amber"
            name="amber"
            value={inputs.amber}
            onChange={handleChange}
            placeholder=""
            className="w-full bg-special-input-green p-2 rounded text-zinc-400"
          />
        </div>
      </div>

      <div className="flex">
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-lime-600 hover:bg-green-700 rounded text-white"
        >
          Compare
        </button>
      </div>
    </form>
  )
}
