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
import HybridSelect from '../components/HybridSelect'

export default function HeliosDuaBelasForm({
  category,
  researchName,
  onCalculate,
  dataSource,
}) {
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [speed, setSpeed] = useState('0')
  const [vpBonus, setVpBonus] = useState('0')

  // === LEVEL OPTIONS ===
  const levelOptions = useMemo(() => {
    const levels =
      dataSource?.[category]?.[researchName]?.map((item) =>
        parseInt(item.level)
      ) || []

    return [0, ...levels].sort((a, b) => a - b)
  }, [category, researchName, dataSource])

  // === TO LEVEL FILTER ===
  const toLevelOptions = useMemo(() => {
    const f = parseInt(fromLevel)
    return levelOptions.filter((lvl) => lvl > f)
  }, [levelOptions, fromLevel])

  // === CALCULATE ===
  const handleCalculate = () => {
    const from = parseInt(fromLevel)
    const to = parseInt(toLevel)

    const researchSpeedValue = parseFloat(speed) || 0
    const vpBonusValue = parseFloat(vpBonus) || 0

    if (isNaN(from) || isNaN(to) || to <= from) {
      toast.error('Make sure levels are selected correctly.')
      return
    }

    const entries =
      dataSource?.[category]?.[researchName]?.filter((item) => {
        const lvl = parseInt(item.level)
        return lvl > from && lvl <= to
      }) || []

    // === TOTAL RESOURCE ===
    const total = {
      Steel: 0,
      RFC: 0,
      'FC Shards': 0,
    }

    entries.forEach((item) => {
      total.Steel += Number(item.Steel || 0)
      total.RFC += Number(item.RFC || 0)
      total['FC Shards'] += Number(item['FC Shards'] || 0)
    })

    const result = {
      id: `${researchName}-${fromLevel}->${toLevel}`,
      building: researchName,
      category,
      fromLevel,
      toLevel,
      resources: total,
      buffs: {
        researchSpeed: researchSpeedValue,
        vpBonus: vpBonusValue,
      },
    }

    onCalculate?.(result)
    toast.success('Helios T12 calculation complete!')
  }

  return (
    <Card className="bg-glass-background1 sm:items-center text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl">{researchName}</h2>

        {levelOptions.length === 0 && (
          <p className="text-red-400 text-sm">
            ⚠ Data for “{researchName}” not found.
          </p>
        )}

        <TooltipProvider>
          <div className="bg-glass-background2 p-4 grid grid-cols-2 md:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {/* FROM */}
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

            {/* TO */}
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

            {/* RESEARCH SPEED
            <div>
              <Label className="text-white flex items-center gap-1 mb-2">
                Research (%)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>Includes gear, talents, buffs</TooltipContent>
                </Tooltip>
              </Label>

              <Input
                type="number"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                placeholder="Example: 25"
                className="bg-special-input text-white"
              />
            </div> */}

            {/* VP BONUS */}
            {/* <div>
              <Label className="text-white flex items-center gap-1 mb-2">
                VP Bonus
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Vice President bonus: +10% / +20%
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
            </div> */}

            {/* BUTTON */}
            <div className="col-span-2 md:col-span-1 flex items-center">
              <Button
                onClick={handleCalculate}
                className="button-Form text-sm md:text-base text-white rounded-lg py-6 w-full"
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
