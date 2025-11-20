'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'

import { Info } from 'lucide-react'

import HybridSelect from '../components/HybridSelect'   // ← seragam dengan form lain

export default function HeliosForm({ category, researchName, onCalculate, dataSource }) {
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [speed, setSpeed] = useState('0')
  const [vpBonus, setVpBonus] = useState('0')
  const [doubleTime, setDoubleTime] = useState(false)

  const levelOptions = useMemo(() => {
    return dataSource?.[category]?.[researchName]?.map((item) => item.level) || []
  }, [category, researchName, dataSource])

  const toLevelOptions = useMemo(() => {
    const f = parseInt(fromLevel)
    return levelOptions.filter((lvl) => lvl > f)
  }, [levelOptions, fromLevel])

  const handleCalculate = () => {
    const from = parseInt(fromLevel)
    const to = parseInt(toLevel)
    const researchSpeedValue = parseFloat(speed) || 0
    const vpBonusValue = parseFloat(vpBonus) || 0
    const speedBonus = researchSpeedValue + vpBonusValue

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
        researchSpeed: researchSpeedValue,
        vpLevel: vpBonusValue > 0 ? `${vpBonusValue}%` : 'Off',
        doubleTime,
        petLevel: 'Off',
        zinmanSkill: 'Off',
      },
    }

    onCalculate?.(result)
    toast.success('Helios research calculation complete!')
  }

  return (
    <Card className="bg-glass-background1 sm:items-center text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        
        <h2 className="text-xl">{researchName}</h2>

        {levelOptions.length === 0 && (
          <p className="text-red-400 text-sm">
            ⚠ Data for “{researchName}” not found in dataset.
          </p>
        )}

        <TooltipProvider>
          <div className="bg-glass-background2 p-4 grid grid-cols-2 md:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4">

            {/* FROM LEVEL */}
            <div>
              <Label className="text-white">From</Label>

              <HybridSelect
                value={fromLevel}
                onChange={(v) => {
                  setFromLevel(v)
                  setToLevel('')
                }}
                placeholder="Select Level"
                options={levelOptions.map((lvl) => ({
                  value: String(lvl),
                  label: lvl,
                }))}
                className="bg-special-input text-white"
              />
            </div>

            {/* TO LEVEL */}
            <div>
              <Label className="text-white">To</Label>

              <HybridSelect
                value={toLevel}
                onChange={setToLevel}
                placeholder="Select Level"
                disabled={!fromLevel}
                options={toLevelOptions.map((lvl) => ({
                  value: String(lvl),
                  label: lvl,
                }))}
                className="bg-special-input text-white"
              />
            </div>

            {/* RESEARCH SPEED */}
            <div>
              <Label className="text-white flex items-center gap-1 mb-2
              ">
                Research (%)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Includes gear, talents, and buffs.</p>
                  </TooltipContent>
                </Tooltip>
              </Label>

              <Input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="Example: 25"
                className="bg-special-input text-white"
              />
            </div>

            {/* VP BONUS */}
            <div>
              <Label className="text-white flex items-center gap-1 mb-2">
                VP Bonus
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Vice President bonus: +10% or +20%</p>
                  </TooltipContent>
                </Tooltip>
              </Label>

              <HybridSelect
                value={vpBonus}
                onChange={setVpBonus}
                placeholder="VP Bonus"
                options={[
                  { value: '0', label: 'Off' },
                  { value: '10', label: '10%' },
                  { value: '20', label: '20%' },
                ]}
                className="bg-special-input text-white"
              />
            </div>

            {/* DOUBLE TIME */}
            <div className="flex flex-col justify-center">
              <Label className="text-white mb-1">Double Time</Label>
              <div className="flex items-center gap-2">
                <input
                  id="doubleTime"
                  type="checkbox"
                  checked={doubleTime}
                  onChange={(e) => setDoubleTime(e.target.checked)}
                  className="w-5 h-5 accent-cyan-300 cursor-pointer"
                />
                <Label htmlFor="doubleTime">Active</Label>
              </div>
            </div>

            {/* BUTTON */}
            <div className="col-span-2 md:col-span-1 flex items-center">
              <Button
                onClick={handleCalculate}
                className="button-Form text-sm md:text-base text-white rounded-lg py-6 md:py-6 w-full"
              >
                Calculate
              </Button>
            </div>

          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
