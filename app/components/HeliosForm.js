'use client'

import { useState, useMemo } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from './ui/select'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useHeliosHistory } from '../dashboard/war-academy/HeliosHistoryContext'

export default function HeliosForm({
  category,
  researchName,
  onCalculate,
  dataSource,
}) {
  const [fromLevel, setFromLevel] = useState('') // default kosong, bisa diubah ke '0'
  const [toLevel, setToLevel] = useState('')
  const [speed, setSpeed] = useState('0')
  const [vpBonus, setVpBonus] = useState('0')
  const { addToHistory } = useHeliosHistory()

  const levelOptions = useMemo(() => {
    return (
      dataSource?.[category]?.[researchName]?.map((item) => item.level) || []
    )
  }, [category, researchName, dataSource])

  const toLevelOptions = useMemo(() => {
    const from = parseInt(fromLevel)
    return levelOptions.filter((lvl) => lvl > from)
  }, [levelOptions, fromLevel])

  const handleCalculate = () => {
    const from = parseInt(fromLevel)
    const to = parseInt(toLevel)
    const speedBonus = (parseFloat(speed) || 0) + (parseFloat(vpBonus) || 0)

    if (isNaN(from) || isNaN(to) || to <= from) {
      toast.error('Make sure levels are selected correctly.')
      return
    }

    const entries = dataSource[category][researchName].filter(
      (item) => item.level > from && item.level <= to
    )

    const raw = entries.reduce(
      (sum, item) => sum + (item.raw_time_seconds || 0),
      0
    )
    const reduced = raw / (1 + speedBonus / 100)

    const resources = {
      Meat: 0,
      Wood: 0,
      Coal: 0,
      Iron: 0,
      Steel: 0,
      'FC Shards': 0,
    }

    entries.forEach((item) => {
      Object.entries(resources).forEach(([key]) => {
        resources[key] += item.resources?.[key] || 0
      })
    })

    const result = {
      id: `${researchName}-${fromLevel}->${toLevel}`,
      building: researchName,
      fromLevel,
      toLevel,
      timeOriginal: raw,
      timeReduced: reduced,
      resources,
    }

    onCalculate(result)
    toast.success('Helios research calculation complete!')
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-special-inside rounded-xl shadow-2xl border border-zinc-800 mt-6">
      {/* From */}
      <div>
        <Label className="text-zinc-400">From</Label>
        <Select value={fromLevel} onValueChange={setFromLevel}>
          <SelectTrigger className="bg-special-input text-white">
            <SelectValue placeholder="From Level">
              {fromLevel !== '' ? fromLevel : undefined}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {levelOptions.map((lvl) => (
              <SelectItem key={lvl} value={String(lvl)}>
                {lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* To */}
      <div>
        <Label className="text-zinc-400">To</Label>
        <Select value={toLevel} onValueChange={setToLevel}>
          <SelectTrigger className="bg-special-input text-white">
            <SelectValue placeholder="To Level" />
          </SelectTrigger>
          <SelectContent>
            {toLevelOptions.map((lvl) => (
              <SelectItem key={lvl} value={String(lvl)}>
                {lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Speed */}
      <div>
        <Label className="text-zinc-400">Research Speed (%)</Label>
        <Input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          placeholder="Contoh: 25"
          className="bg-special-input text-white"
        />
      </div>

      {/* VP Bonus */}
      <div>
        <Label className="text-zinc-400">VP Bonus</Label>
        <Select value={vpBonus} onValueChange={setVpBonus}>
          <SelectTrigger className="bg-special-input text-white">
            <SelectValue placeholder="Choose VP Bonus" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Off</SelectItem>
            <SelectItem value="10">10%</SelectItem>
            <SelectItem value="20">20%</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Button */}
      <div className="col-span-full">
        <Button
          onClick={handleCalculate}
          className="bg-lime-600 mt-2 text-white hover:bg-green-700 rounded-sm py-5 w-full"
        >
          Calculate Helios Research
        </Button>
      </div>
    </div>
  )
}
