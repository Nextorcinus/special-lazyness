'use client'

import { useState } from 'react'
import charmData from '../data/MaterialDatacharm.json'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import HybridSelect from './HybridSelect'   // ← gunakan ini

const charmTypes = ['Cap', 'Watch', 'Coat', 'Pants', 'Belt', 'Weapon']
const charmLevels = charmData.map((item) => item.level.toString())

export default function CharmForm({ onSubmit, onReset }) {
  const initialState = { type: '', from: '', to: '' }
  const [selection, setSelection] = useState(initialState)

  const getLevelIndex = (level) => charmLevels.indexOf(level)

  const handleChange = (field, value) => {
    setSelection((prev) => {
      const updated = { ...prev, [field]: value }

      if (
        field === 'from' &&
        updated.to &&
        getLevelIndex(updated.to) <= getLevelIndex(value)
      ) {
        updated.to = ''
      }

      return updated
    })
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    const { type, from, to } = selection

    if (!type || !from || !to) {
      toast.warning('Please select type, from, and to level.')
      return
    }

    const fromIndex = charmData.findIndex((i) => i.level === parseInt(from))
    const toIndex = charmData.findIndex((i) => i.level === parseInt(to))

    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
      toast.error('Invalid level range selected.')
      return
    }

    const total = { guide: 0, design: 0, jewel: 0, svs: 0 }
    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const data = charmData[i]
      if (data) {
        total.guide += data.guide_cost || 0
        total.design += data.design_cost || 0
        total.jewel += data.jewel_cost || 0
        total.svs += data.svs_point || 0
      }
    }

    onSubmit?.({ type, from, to, total })
    toast.success(`Charm upgrade calculated: ${type} ${from} → ${to}`)
  }

  const availableToLevels = selection.from
    ? charmLevels.filter((lvl) => parseInt(lvl) > parseInt(selection.from))
    : charmLevels

  return (
    <form onSubmit={handleCalculate}
      className="py-4 px-4 bg-special-inside rounded-xl space-y-6"
    >
      <h2 className="text-xl text-white">Select Charm</h2>

      <div className="bg-glass-background2 p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Type */}
        <div>
          <Label className="text-white">Charm Type</Label>
          <HybridSelect
            value={selection.type}
            onChange={(val) => handleChange('type', val)}
            placeholder="Select Charm Type"
            options={charmTypes.map((t) => ({ value: t, label: t }))}
          />
        </div>

        {/* From */}
        <div>
          <Label className="text-white">From</Label>
          <HybridSelect
            value={selection.from}
            onChange={(val) => handleChange('from', val)}
            placeholder="From"
            options={charmLevels.map((lvl) => ({
              value: lvl, label: `Level ${lvl}`
            }))}
          />
        </div>

        {/* To */}
        <div>
          <Label className="text-white">To</Label>
          <HybridSelect
            value={selection.to}
            onChange={(val) => handleChange('to', val)}
            placeholder="To"
            options={availableToLevels.map((lvl) => ({
              value: lvl, label: `Level ${lvl}`
            }))}
          />
        </div>

        {/* Button */}
        <div className="flex">
          <Button
            type="submit"
            className="button-Form text-sm md:text-base text-white rounded-lg py-6 w-full"
          >
            Calculate
          </Button>
        </div>
      </div>

    </form>
  )
}
