'use client'

import { useEffect, useState } from 'react'
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
import { useCharmHistory } from '../dashboard/charm/CharmHistoryContext'

const maxLevel = Math.max(...charmData.map((item) => item.level))
const charmLevels = Array.from({ length: maxLevel + 1 }, (_, i) => `${i}`)

const charmParts = {
  Lancer: ['Cap', 'Watch'],
  Infantry: ['Coat', 'Pants'],
  Marksman: ['Belt', 'Weapon'],
}

export default function CharmForm({ onSubmit, onReset, dataLoaded }) {
  const initialState = Object.values(charmParts)
    .flat()
    .reduce((acc, part) => {
      acc[part] = Array.from({ length: 3 }, () => ({ from: '', to: '' }))
      return acc
    }, {})

  const [selections, setSelections] = useState(initialState)

  const { resetGearPairs, consumeResetGearPair, history } = useCharmHistory()

  // ✅ Reset hanya input yang dihapus (tanpa trigger render error)
  useEffect(() => {
    if (!Array.isArray(resetGearPairs) || resetGearPairs.length === 0) return

    const updated = { ...selections }
    let changed = false

    resetGearPairs.forEach(({ part, index }) => {
      const stillExists = history.some(
        (entry) => entry.gear === part && entry.index === index
      )
      if (stillExists) return

      if (updated[part] && updated[part][index]) {
        updated[part][index] = { from: '', to: '' }
        changed = true
      }
    })

    if (changed) {
      setSelections(updated)
    }
  }, [resetGearPairs, history])

  // ✅ Konsumsi resetGearPairs setelah perubahan
  useEffect(() => {
    if (!Array.isArray(resetGearPairs) || resetGearPairs.length === 0) return

    resetGearPairs.forEach(({ part, index }) => {
      const stillExists = history.some(
        (entry) => entry.gear === part && entry.index === index
      )
      if (!stillExists) {
        consumeResetGearPair(part, index)
      }
    })
  }, [resetGearPairs, history])

  const getLevelIndex = (level) => charmLevels.indexOf(level)

  const handleChange = (part, index, type, value) => {
    setSelections((prev) => {
      const updatedPart = [...prev[part]]
      updatedPart[index] = {
        ...updatedPart[index],
        [type]: value,
      }

      if (
        type === 'from' &&
        updatedPart[index].to &&
        getLevelIndex(updatedPart[index].to) <= getLevelIndex(value)
      ) {
        updatedPart[index].to = ''
      }

      return { ...prev, [part]: updatedPart }
    })
  }

  const handleCalculate = (e) => {
    e.preventDefault()
    if (dataLoaded) {
      toast.success('Charm upgrade calculated!')
      onSubmit(selections)
    } else {
      toast.warning('Data not fully loaded yet.')
    }
  }

  const handleLocalReset = () => {
    setSelections(initialState)
    onReset?.()
    toast.info('Form reset.')
  }

  return (
    <form
      onSubmit={handleCalculate}
      className="p-6 bg-special-inside rounded-xl shadow-2xl border border-zinc-800 space-y-6"
    >
      <h2 className="text-xl">Select Level</h2>

      {Object.entries(charmParts).map(([category, parts]) => (
        <div key={category} className="space-y-2">
          <Label className="text-white text-md font-bold block mt-4">
            {category}
          </Label>
          {parts.map((part) => (
            <div
              key={part}
              className="flex flex-col gap-2 items-start flex-wrap"
            >
              <Label className="w-20 text-sm text-zinc-400 pt-1 sm:pt-0">
                {part}
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {selections[part].map((pair, idx) => {
                  const availableTo = pair.from
                    ? charmLevels.slice(getLevelIndex(pair.from) + 1)
                    : charmLevels

                  return (
                    <div key={idx} className="grid grid-cols-2 gap-2">
                      <Select
                        value={pair.from}
                        onValueChange={(val) =>
                          handleChange(part, idx, 'from', val)
                        }
                      >
                        <SelectTrigger className="w-full bg-zinc-800 text-white border border-zinc-600">
                          <SelectValue placeholder="From" />
                        </SelectTrigger>
                        <SelectContent>
                          {charmLevels.map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                              {lvl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select
                        value={pair.to}
                        onValueChange={(val) =>
                          handleChange(part, idx, 'to', val)
                        }
                        disabled={!pair.from}
                      >
                        <SelectTrigger className="w-full bg-zinc-800 text-white border border-zinc-600">
                          <SelectValue placeholder="To" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableTo.map((lvl) => (
                            <SelectItem key={lvl} value={lvl}>
                              {lvl}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <Button
          type="submit"
          disabled={!dataLoaded}
          className="bg-lime-600 text-white text-base hover:bg-green-700 rounded-sm py-5"
        >
          Calculate
        </Button>
      </div>
    </form>
  )
}
