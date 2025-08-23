'use client'

import { useEffect, useState } from 'react'
import { levels } from '../data/levels'
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
import { useGearHistory } from '../dashboard/gear/GearContext'

const gearParts = ['Cap', 'Watch', 'Coat', 'Pants', 'Belt', 'Weapon']

const GearForm = ({ onSubmit, onReset, materialDataLoaded, resetTrigger }) => {
  const initialState = gearParts.reduce((acc, part) => {
    acc[part] = { from: '', to: '' }
    return acc
  }, {})

  const [selections, setSelections] = useState(initialState)
  const { resetGearParts, consumeResetGearPart } = useGearHistory()

  useEffect(() => {
    setSelections(initialState)
  }, [resetTrigger])

  // ✅ Reset hanya bagian tertentu jika dihapus dari history
  useEffect(() => {
    if (!resetGearParts || resetGearParts.length === 0) return

    const updated = { ...selections }
    let didReset = false

    resetGearParts.forEach((gear) => {
      if (updated[gear]) {
        updated[gear] = { from: '', to: '' }
        consumeResetGearPart(gear)
        didReset = true
      }
    })

    if (didReset) {
      setSelections(updated)
    }
  }, [JSON.stringify(resetGearParts)])

  const getLevelIndex = (level) => levels.indexOf(level)

  const handleChange = (part, type, value) => {
    setSelections((prev) => {
      const updated = {
        ...prev,
        [part]: {
          ...prev[part],
          [type]: value,
        },
      }

      if (
        type === 'from' &&
        updated[part].to &&
        getLevelIndex(updated[part].to) <= getLevelIndex(value)
      ) {
        updated[part].to = ''
      }

      return updated
    })
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    if (materialDataLoaded) {
      toast.success('Upgrade calculated successfully!')
      onSubmit(selections)
    } else {
      toast.warning('Data belum dimuat sepenuhnya.')
    }
  }

  const handleLocalReset = () => {
    setSelections(initialState)
    if (onReset) onReset()
    toast.info('Form telah direset.')
  }

  return (
    <form
      onSubmit={handleCalculate}
      className="p-6 bg-special-inside rounded-xl shadow-2xl border border-zinc-800 space-y-6"
    >
      <h2 className="text-xl">Selected Gear Items</h2>

      {gearParts.map((part) => {
        const fromValue = selections[part].from
        const availableToLevels = fromValue
          ? levels.slice(getLevelIndex(fromValue) + 1)
          : levels

        return (
          <div key={`${part}-${resetTrigger}`} className="space-y-2">
            <Label className="text-zinc-400">{part}</Label>
            <div className="flex flex-row gap-4">
              <Select
                value={selections[part].from}
                onValueChange={(val) => handleChange(part, 'from', val)}
              >
                <SelectTrigger className="border-zinc-600 bg-special-input w-1/2 bg-zinc-800 text-white">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selections[part].to}
                onValueChange={(val) => handleChange(part, 'to', val)}
                disabled={!fromValue}
              >
                <SelectTrigger className="bg-special-input border border-zinc-600 w-1/2 bg-zinc-800 text-white">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  {availableToLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      })}

      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={!materialDataLoaded}
          className="bg-lime-600 text-white text-base hover:bg-green-700 rounded-sm py-5"
        >
          Calculate
        </Button>
      </div>
    </form>
  )
}

export default GearForm
