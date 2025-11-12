'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useHeliosHistory } from '../dashboard/war-academy/HeliosHistoryContext'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Info } from 'lucide-react'

export default function HeliosForm({ category, researchName, onCalculate, dataSource }) {
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [speed, setSpeed] = useState('0')
  const [vpBonus, setVpBonus] = useState('0')
  const [doubleTime, setDoubleTime] = useState(false) // ✅ New

  const { addToHistory } = useHeliosHistory()

  // === Level options ===
  const levelOptions = useMemo(() => {
    return dataSource?.[category]?.[researchName]?.map((item) => item.level) || []
  }, [category, researchName, dataSource])

  const toLevelOptions = useMemo(() => {
    const from = parseInt(fromLevel)
    return levelOptions.filter((lvl) => lvl > from)
  }, [levelOptions, fromLevel])

  // === Handle Calculate ===
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

    // ✅ Jika double time aktif, waktu berkurang setengah
    const reduced = (raw / (1 + speedBonus / 100)) * (doubleTime ? 0.5 : 1)

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
      buffs: {
        researchSpeed: speedBonus,
        vpLevel: vpBonus !== '0' ? `${vpBonus}%` : 'Off',
        doubleTime,
        petLevel: 'Off',
        zinmanSkill: 'Off',
      },
    }

    onCalculate?.(result)
    toast.success('Helios research calculation complete!')
  }

  // === UI ===
  return (
    <Card className="bg-glass-background1 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl text-white">{researchName}</h2>

        {levelOptions.length === 0 && (
          <p className="text-red-400 text-sm">
            ⚠ Data for “{researchName}” not found in dataset.
          </p>
        )}

        <TooltipProvider>
          <div className="bg-glass-background2 sm:items-center p-4 grid grid-cols-2 md:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5 gap-4">

            {/* From */}
            <div>
              <Label className="text-zinc-800 text-shadow-md">From</Label>
              <Select
                value={fromLevel}
                onValueChange={(v) => {
                  setFromLevel(v)
                  setToLevel('')
                }}
              >
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder="Select Level" />
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
              <Label className="text-zinc-800 text-shadow-md">To</Label>
              <Select value={toLevel} onValueChange={setToLevel}>
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder="Select Level" />
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

            {/* Research Speed */}
            <div>
              <Label className="text-zinc-800 text-shadow-md flex items-center gap-1 mt-1 mb-1 w-full">
                Research Spd (%)
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
                    <p>Includes speed from gear, talents, buffs, etc.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="Example: 25"
                className="bg-special-input w-full text-white"
              />
            </div>

            {/* VP Bonus */}
            <div>
              <Label className="text-white text-shadow-md flex items-center gap-1 mt-1 mb-1">
                VP Bonus
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
                    <p>Additional speed from Vice President buff (10% / 20%)</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
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

            {/* Double Time */}
            <div className="flex flex-col justify-center">
              <Label className="text-white text-shadow-md mb-2">
                Double Time
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="doubleTime"
                  type="checkbox"
                  checked={doubleTime}
                  onChange={(e) => setDoubleTime(e.target.checked)}
                  className="w-5 h-5 accent-[#00ffff] cursor-pointer"
                />
                <Label htmlFor="doubleTime" className="cursor-pointer">
                  Active
                </Label>
              </div>
            </div>

            {/* Button */}
            <div className="col-span-2 md:col-span-2 flex w-full items-center justify-start mt-2">
              <Button
                onClick={handleCalculate}
                className="button-Form text-sm md:text-base text-white rounded-lg py-6 md:py-6"
              >
                Calculate Research
              </Button>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
