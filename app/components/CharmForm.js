'use client'

import { useState } from 'react'
import charmData from '../data/MaterialDatacharm.json'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import HybridSelect from './HybridSelect'

const charmTypes = ['Cap', 'Watch', 'Coat', 'Pants', 'Belt', 'Weapon']
const charmLevels = charmData.map((item) => item.level.toString())
const valeriaLevels = Array.from({ length: 11 }, (_, i) => i.toString())

export default function CharmForm({ onSubmit }) {
  const [selection, setSelection] = useState({ type: '', from: '', to: '' })
  const [valeriaLevel, setValeriaLevel] = useState('0')

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

    const bonusPercent = Math.min(parseInt(valeriaLevel) * 2, 20)

    onSubmit?.({
      type,
      from,
      to,
      valeriaBonus: bonusPercent,
    })

    toast.success(
      `Charm calculated with Valeria Lv ${valeriaLevel} (+${bonusPercent}% SvS)`
    )
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

      <div className="bg-glass-background2 p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <Label className="text-white">Charm Type</Label>
          <HybridSelect
            value={selection.type}
            onChange={(val) => handleChange('type', val)}
            placeholder="Select Charm Type"
            options={charmTypes.map((t) => ({ value: t, label: t }))}
          />
        </div>

        <div>
          <Label className="text-white">From</Label>
          <HybridSelect
            value={selection.from}
            onChange={(val) => handleChange('from', val)}
            placeholder="From"
            options={charmLevels.map((lvl) => ({
              value: lvl,
              label: `Level ${lvl}`,
            }))}
          />
        </div>

        <div>
          <Label className="text-white">To</Label>
          <HybridSelect
            value={selection.to}
            onChange={(val) => handleChange('to', val)}
            placeholder="To"
            options={availableToLevels.map((lvl) => ({
              value: lvl,
              label: `Level ${lvl}`,
            }))}
          />
        </div>

        <div>
          <Label className="text-white">Valeria (SvS)</Label>
          <HybridSelect
            value={valeriaLevel}
            onChange={(val) => setValeriaLevel(val)}
            placeholder="Valeria Level"
            options={valeriaLevels.map((lvl) => ({
              value: lvl,
              label: `Level ${lvl} (+${Math.min(lvl * 2, 20)}%)`,
            }))}
          />
        </div>

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
