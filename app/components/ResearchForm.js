'use client'

import { useState, useMemo, useEffect } from 'react'
import researchData from '../data/MaterialBasicResearch'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from './ui/select'
import { Button } from './ui/button'
import { toast } from 'sonner'

export default function ResearchForm({ category, researchName, onCalculate }) {
  const [tier, setTier] = useState('')
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [researchSpeed, setResearchSpeed] = useState('0')
  const [vpBonus, setVpBonus] = useState('0')

  // Tier options
  const tierOptions = useMemo(
    () => Object.keys(researchData[category]?.[researchName]?.tiers || {}),
    [category, researchName]
  )

  // Available levels for selected tier
  const levelOptions = useMemo(() => {
    if (
      !tier ||
      !Array.isArray(researchData[category]?.[researchName]?.tiers?.[tier])
    )
      return []
    return researchData[category][researchName].tiers[tier].map(
      (item) => item.level
    )
  }, [category, researchName, tier])

  // Set default fromLevel to '0' if only one level in data, else reset
  useEffect(() => {
    if (tier) {
      if (levelOptions.length <= 1) {
        setFromLevel('0')
      } else {
        setFromLevel('')
      }
      setToLevel('')
    }
  }, [tier, levelOptions])

  // Filter to levels greater than fromLevel
  const toLevelOptions = useMemo(() => {
    const from = parseInt(fromLevel)
    if (!Array.isArray(levelOptions)) return []
    return levelOptions.filter((lvl) => lvl > from)
  }, [levelOptions, fromLevel])

  const handleCalculate = () => {
    const from = parseInt(fromLevel)
    const to = parseInt(toLevel)

    if (isNaN(from) || isNaN(to) || to <= from || !tier) {
      toast.error('Make sure all levels and tiers are selected correctly.')
      return
    }

    const entries = researchData[category][researchName].tiers[tier].filter(
      (item) => item.level > from && item.level <= to
    )

    const totalRawTime = entries.reduce(
      (sum, item) => sum + (item.raw_time_seconds || 0),
      0
    )
    const totalBonus =
      (parseFloat(researchSpeed) || 0) + (parseFloat(vpBonus) || 0)
    const finalTime = totalRawTime / (1 + totalBonus / 100)

    const totalResources = { Meat: 0, Wood: 0, Coal: 0, Iron: 0, Steel: 0 }
    entries.forEach((item) => {
      if (item.resources) {
        Object.keys(totalResources).forEach((resource) => {
          totalResources[resource] += parseInt(item.resources[resource] || 0)
        })
      }
    })

    const result = {
      building: `${researchName} ${tier}`,
      fromLevel,
      toLevel,
      timeOriginal: totalRawTime,
      timeReduced: finalTime,
      resources: totalResources,
    }

    onCalculate?.(result)
    toast.success('Research calculation completed!')
  }

  return (
    <div
      id="research-form"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-special-inside rounded-xl shadow-2xl border border-zinc-800"
    >
      <div className="col-span-full">
        <Label className="text-zinc-400">Tier</Label>
        <Select value={tier} onValueChange={setTier}>
          <SelectTrigger className="bg-special-input text-white">
            <SelectValue placeholder="Choose Tier" />
          </SelectTrigger>
          <SelectContent>
            {tierOptions.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-zinc-400">From</Label>
        <Select value={fromLevel} onValueChange={setFromLevel}>
          <SelectTrigger className="bg-special-input text-white">
            <SelectValue placeholder="select level" />
          </SelectTrigger>
          <SelectContent>
            {/* Default level 0 option */}
            <SelectItem value="0">0</SelectItem>
            {levelOptions.map((lvl) => (
              <SelectItem key={lvl} value={String(lvl)}>
                {lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-zinc-400">To</Label>
        <Select value={toLevel} onValueChange={setToLevel}>
          <SelectTrigger className="bg-special-input text-white">
            <SelectValue placeholder="select level" />
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
        <Label className="text-zinc-400">Research Speed (%)</Label>
        <Input
          type="number"
          value={researchSpeed}
          onChange={(e) => setResearchSpeed(e.target.value)}
          placeholder="Contoh: 30"
          className="bg-special-input text-white"
        />
      </div>

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

      <Button
        onClick={handleCalculate}
        className="bg-lime-600 mt-2 text-white hover:bg-green-700 rounded-sm py-5 col-span-full"
      >
        Calculate Research
      </Button>
    </div>
  )
}
