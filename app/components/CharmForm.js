'use client'

import { useState } from 'react'
import charmData from '../data/MaterialDatacharm.json'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'

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

  // === Hitung ===
  const handleCalculate = (e) => {
    e.preventDefault()

    const { type, from, to } = selection
    if (!type || !from || !to) {
      toast.warning('Please select type, from, and to level.')
      return
    }

    const fromIndex = charmData.findIndex((item) => item.level === parseInt(from))
    const toIndex = charmData.findIndex((item) => item.level === parseInt(to))
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
      toast.error('Invalid level range selected.')
      return
    }

    // Hitung total bahan
    const total = { guide: 0, design: 0, jewel: 0, svs: 0 }
    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const data = charmData[i]
      if (!data) continue
      total.guide += data.guide_cost || 0
      total.design += data.design_cost || 0
      total.jewel += data.jewel_cost || 0
      total.svs += data.svs_point || 0
    }

    const result = {
      type,
      from,
      to,
      total,
    }

    
    onSubmit?.(result)
    
    toast.success(`Charm upgrade calculated: ${type} ${from} → ${to}`)
  }

  const handleLocalReset = () => {
    setSelection(initialState)
    onReset?.()
    toast.info('Charm form has been reset.')
  }

  const availableToLevels = selection.from
    ? charmLevels.filter((lvl) => parseInt(lvl) > parseInt(selection.from))
    : charmLevels

  return (
    <form
      onSubmit={handleCalculate}
      className="py-4 px-4 bg-special-inside rounded-xl space-y-6"
    >
      <h2 className="text-xl text-white">Select Charm</h2>

      {/* === Input Area === */}
      <div className="bg-glass-background2 sm:items-center p-4 grid grid-cols-1 md:grid-cols-4 xl:grid-col-4 2xl:grid-cols-4 gap-4">
        {/* Type */}
        <div>
          <Label className="text-white">Charm Type</Label>
          <Select
            value={selection.type}
            onValueChange={(val) => handleChange('type', val)}
          >
            <SelectTrigger className="bg-special-input text-white w-full">
              <SelectValue placeholder="Select Charm Type" />
            </SelectTrigger>
            <SelectContent>
              {charmTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* From */}
        <div>
          <Label className="text-white">From</Label>
          <Select
            value={selection.from}
            onValueChange={(val) => handleChange('from', val)}
          >
            <SelectTrigger className="bg-special-input text-white w-full">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {charmLevels.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  Level {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* To */}
        <div>
          <Label className="text-white">To</Label>
          <Select
            value={selection.to}
            onValueChange={(val) => handleChange('to', val)}
            disabled={!selection.from}
          >
            <SelectTrigger className="bg-special-input text-white w-full">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {availableToLevels.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  Level {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Calculate */}
        <div className="flex">
          <Button
            type="submit"
            className="button-Form text-sm md:text-base text-white rounded-lg py-6 md:py-6 w-full"
          >
            Calculate
          </Button>
        </div>
      </div>

     
    </form>
  )
}
