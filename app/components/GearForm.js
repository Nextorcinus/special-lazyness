'use client'

import { useEffect, useState } from 'react'
import { levels } from '../data/levels'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import { useGearHistory } from '../dashboard/gear/GearContext'
import HybridSelect from '../components/HybridSelect'

const gearParts = ['Cap', 'Watch', 'Coat', 'Pants', 'Belt', 'Weapon']
const valeriaLevels = Array.from({ length: 11 }, (_, i) => i.toString())

export default function GearForm({
  onSubmit,
  onReset,
  materialDataLoaded,
  resetTrigger,
}) {
  const initialState = {
    type: '',
    from: '',
    to: '',
    valeriaLevel: '0',
  }

  const [selection, setSelection] = useState(initialState)
  const { resetGearParts } = useGearHistory()

  useEffect(() => {
    setSelection(initialState)
  }, [resetTrigger])

  const getLevelIndex = (level) => levels.indexOf(level)

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

    if (!selection.type || !selection.from || !selection.to) {
      toast.warning('Lengkapi semua pilihan terlebih dahulu.')
      return
    }

    if (!materialDataLoaded) {
      toast.warning('Data belum dimuat sepenuhnya.')
    }

    const level = parseInt(selection.valeriaLevel || '0')
    const bonusPercent = Math.min(level * 2, 20)

    toast.success(
      `Upgrade calculated with Valeria Lv.${level} (+${bonusPercent}% SvS)`
    )

    onSubmit({
      ...selection,
      valeriaBonus: bonusPercent,
    })
  }

  const availableToLevels = selection.from
    ? levels.slice(getLevelIndex(selection.from) + 1)
    : levels

  return (
    <div className="py-4 px-4 bg-special-inside rounded-xl space-y-6">
      <h2 className="text-xl">Select Gear Upgrade</h2>

      <div className="bg-glass-background2 p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* GEAR TYPE */}
        <div>
          <Label className="text-white">Gear Type</Label>
          <HybridSelect
            value={selection.type}
            onChange={(val) => handleChange('type', val)}
            placeholder="Select Gear Type"
            options={gearParts.map((p) => ({ value: p, label: p }))}
            className="bg-special-input text-white w-full"
          />
        </div>

        {/* FROM */}
        <div>
          <Label className="text-white">From</Label>
          <HybridSelect
            value={selection.from}
            onChange={(val) => handleChange('from', val)}
            placeholder="From"
            options={levels.map((lvl) => ({ value: lvl, label: lvl }))}
            className="bg-special-input text-white w-full"
          />
        </div>

        {/* TO */}
        <div>
          <Label className="text-white">To</Label>
          <HybridSelect
            value={selection.to}
            onChange={(val) => handleChange('to', val)}
            placeholder="To"
            disabled={!selection.from}
            options={availableToLevels.map((lvl) => ({
              value: lvl,
              label: lvl,
            }))}
            className="bg-special-input text-white w-full"
          />
        </div>

        {/* VALERIA */}
        <div>
          <Label className="text-white">Valeria Bonus</Label>
          <HybridSelect
            value={selection.valeriaLevel}
            onChange={(val) => handleChange('valeriaLevel', val)}
            placeholder="Valeria Level"
            options={valeriaLevels.map((lvl) => ({
              value: lvl,
              label: `Lv.${lvl} (+${Math.min(lvl * 2, 20)}%)`,
            }))}
            className="bg-special-input text-white w-full"
          />
        </div>

        {/* BUTTON */}
        <div className="flex">
          <Button
            type="button"
            onClick={handleCalculate}
            className="button-Form text-sm md:text-base text-white rounded-lg py-4 md:py-6 w-full"
          >
            Calculate
          </Button>
        </div>
      </div>
    </div>
  )
}
