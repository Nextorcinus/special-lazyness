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
import { useResearchHistory } from '../dashboard/research/ResearchHistoryContext'

export default function HeliosForm({
  category,
  researchName,
  onCalculate,
  dataSource,
}) {
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [speed, setSpeed] = useState('0')

  const { addToHistory } = useResearchHistory()

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
    const speedBonus = parseFloat(speed) || 0

    if (isNaN(from) || isNaN(to) || to <= from) return

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
      Object.keys(resources).forEach((key) => {
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

    addToHistory(result)
    onCalculate(result)
  }

  return (
    <div className="grid gap-4">
      <div>
        <Label>Level Dari</Label>
        <Select value={fromLevel} onValueChange={setFromLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Level Awal" />
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

      <div>
        <Label>Level Ke</Label>
        <Select value={toLevel} onValueChange={setToLevel}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Level Akhir" />
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

      <div>
        <Label>Research Speed (%)</Label>
        <Input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          placeholder="Contoh: 25"
        />
      </div>

      <Button onClick={handleCalculate}>Hitung</Button>
    </div>
  )
}
