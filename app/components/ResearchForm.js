'use client'

import { useState, useMemo, useEffect } from 'react'
import researchData from '../data/MaterialBasicResearch'
import { Card, CardContent } from './ui/card'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Info } from 'lucide-react'

export default function ResearchForm({ category, researchName, onCalculate }) {
  const [tier, setTier] = useState('')
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [researchSpeed, setResearchSpeed] = useState('0')
  const [vpBonus, setVpBonus] = useState('0')

  // === Tier Options ===
  const tierOptions = useMemo(
    () => Object.keys(researchData[category]?.[researchName]?.tiers || {}),
    [category, researchName]
  )

  // === Level Options based on Tier ===
  const levelOptions = useMemo(() => {
    if (!tier) return []
    return (
      researchData[category]?.[researchName]?.tiers?.[tier]?.map(
        (i) => i.level
      ) || []
    )
  }, [category, researchName, tier])

  // === Reset Levels when Tier Changes ===
  useEffect(() => {
    if (tier) {
      setFromLevel(levelOptions.length <= 1 ? '0' : '')
      setToLevel('')
    }
  }, [tier, levelOptions])

  // === Filter To Levels (only greater than From) ===
  const toLevelOptions = useMemo(() => {
    const from = parseInt(fromLevel)
    if (!Array.isArray(levelOptions)) return []
    return levelOptions.filter((lvl) => lvl > from)
  }, [levelOptions, fromLevel])

  // === Handle Calculation ===
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
        Object.keys(totalResources).forEach((res) => {
          totalResources[res] += parseInt(item.resources[res] || 0)
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
    <Card className="bg-glass-background1 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl text-white">{researchName}</h2>

        <TooltipProvider>
          <div className="bg-glass-background2 p-4 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {/* === Tier Select === */}
            <div>
              <Label className="text-white text-shadow-md">Tier</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder="Select Tier" />
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

            {/* === From Level === */}
            <div>
              <Label className="text-white text-shadow-md">From</Label>
              <Select value={fromLevel} onValueChange={setFromLevel}>
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder="-- Select --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  {levelOptions.map((lvl) => (
                    <SelectItem key={lvl} value={String(lvl)}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* === To Level === */}
            <div>
              <Label className="text-white text-shadow-md">To</Label>
              <Select value={toLevel} onValueChange={setToLevel}>
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder="-- Select --" />
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

            {/* === Research Speed === */}
            <div>
              <Label className="text-white text-shadow-md">
                Research Speed (%)
              </Label>
              <Input
                type="number"
                value={researchSpeed}
                onChange={(e) => setResearchSpeed(e.target.value)}
                placeholder="e.g. 30"
                className="bg-special-input text-white"
              />
            </div>

            {/* === VP Bonus === */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Label className="text-white text-shadow-md">VP Bonus</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => e.preventDefault()}
                      onTouchStart={(e) => e.preventDefault()}
                    >
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>
                      Buff from Vice President +10%, or +20% if President
                      activates speed buff (for SvS / KOI)
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={vpBonus} onValueChange={setVpBonus}>
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder="Choose Bonus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Off</SelectItem>
                  <SelectItem value="10">10%</SelectItem>
                  <SelectItem value="20">20%</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* === Button === */}
            <Button
              onClick={handleCalculate}
              className="bg-orange-500 hover:bg-orange-400 text-sm md:text-base text-white rounded-lg py-6 md:py-10 col-span-2 md:col-span-1"
            >
              Calculate Research
            </Button>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
