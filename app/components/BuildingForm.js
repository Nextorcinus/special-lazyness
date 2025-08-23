'use client'

import React, { useState, useEffect, useMemo } from 'react'
import basicData from '../data/BasicBuilding.json'
import fireCrystalData from '../data/buildings.json'
import { calculateUpgrade } from '../utils/calculateUpgrade'

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
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import { toast } from 'sonner'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Info } from 'lucide-react'

const buildingAliasMap = {
  Marksman: 'Marksman',
  Lancer: 'Lancer Camp',
  Infantry: 'Infantry',
  Research: 'Research Center',
  Command: 'Command Center',
  Embassy: 'Embassy',
}

function BuildingForm({
  category,
  selectedSub,
  defaultValues = {},
  onCalculate,
}) {
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [petLevel, setPetLevel] = useState('Off')
  const [vpLevel, setvpLevel] = useState('Off')
  const [doubleTime, setDoubleTime] = useState(false)
  const [zinmanSkill, setZinmanSkill] = useState('Off')
  const [constructionSpeed, setConstructionSpeed] = useState(0)

  const data = category === 'Basic' ? basicData : fireCrystalData
  const normalizedBuilding = buildingAliasMap[selectedSub] || selectedSub

  // parsing data untuk mengurutkan level yang ada
  const levelOptions = useMemo(() => {
    const buildingEntries = data.filter(
      (b) =>
        b.Building?.trim().toLowerCase() ===
        normalizedBuilding.trim().toLowerCase()
    )

    const levels = buildingEntries.map((b) => b.Level)
    return Array.from(new Set(levels))
  }, [normalizedBuilding, data])

  // perbandingan level dari dan ke
  // jika from level tidak ada , maka to level akan menampilkan semua level yang ada
  // jika form level ada maka to level akan menampilkan level yang lebih besar dari from level
  const filteredToLevels = useMemo(() => {
    if (!fromLevel) return levelOptions

    const fromIndex = levelOptions.findIndex((lvl) => lvl === fromLevel)
    return levelOptions.slice(fromIndex + 1)
  }, [fromLevel, levelOptions])

  useEffect(() => {
    if (!defaultValues || !selectedSub) return

    setFromLevel((prev) => prev || defaultValues.fromLevel || '')
    setToLevel((prev) => prev || defaultValues.toLevel || '')
    setPetLevel((prev) => prev || defaultValues.buffs?.petLevel || 'Off')
    setvpLevel((prev) => prev || defaultValues.buffs?.vpLevel || 'Off')
    setDoubleTime((prev) =>
      typeof prev === 'boolean'
        ? prev
        : defaultValues.buffs?.doubleTime || false
    )
    setZinmanSkill((prev) => prev || defaultValues.buffs?.zinmanSkill || 'Off')
    setConstructionSpeed(
      (prev) => prev || defaultValues.buffs?.constructionSpeed || 0
    )
  }, [defaultValues, selectedSub])

  const handleSubmit = () => {
    const result = calculateUpgrade({
      category,
      building: selectedSub,
      fromLevel,
      toLevel,
      buffs: {
        petLevel,
        vpLevel,
        doubleTime,
        zinmanSkill,
        constructionSpeed: +constructionSpeed,
      },
    })

    if (result) {
      toast.success('The upgrade calculation was successful!')
      onCalculate(result)
    } else {
      toast.error('Invalid level or missing data.')
    }
  }

  const petLevels = ['Off', 'Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5']
  const vpLevels = ['Off', '10%', '20%']
  const zinmanLevels = ['Off', 'Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5']

  return (
    <Card className="bg-special-inside border-zinc-800 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl">{selectedSub}</h2>

        {levelOptions.length === 0 && (
          <p className="text-red-400 text-sm">
            ⚠ Data level for &quot;{selectedSub}&quot; not found on JSON.
          </p>
        )}
        <TooltipProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <Label className="text-zinc-400">From</Label>

              <Select
                value={fromLevel}
                onValueChange={(v) => {
                  setFromLevel(v)
                  setToLevel('')
                }}
              >
                <SelectTrigger className="bg-zinc-800 bg-special-input text-white">
                  <SelectValue placeholder="-- Select Level --" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-zinc-400 ">To</Label>
              <Select value={toLevel} onValueChange={setToLevel}>
                <SelectTrigger className="bg-zinc-800 bg-special-input text-white">
                  <SelectValue placeholder="-- Select Level --" />
                </SelectTrigger>
                <SelectContent>
                  {filteredToLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-zinc-400">Pet</Label>
              <Select value={petLevel} onValueChange={setPetLevel}>
                <SelectTrigger className="bg-zinc-800 bg-special-input text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {petLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Label className="text-zinc-400">Vp</Label>
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
                      Buff from Vice President +10%, + if president activates
                      buff speed (for SvS /KOI) choose 20%
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <Select value={vpLevel} onValueChange={setvpLevel}>
                <SelectTrigger className="bg-zinc-800 bg-special-input text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {vpLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-zinc-400">Zinman Skill</Label>
              <Select value={zinmanSkill} onValueChange={setZinmanSkill}>
                <SelectTrigger className=" bg-special-input  text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {zinmanLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-zinc-400">Const Speed (%)</Label>
              <Input
                type="number"
                value={constructionSpeed}
                onChange={(e) => setConstructionSpeed(e.target.value)}
                min={0}
                max={100}
                className=" shadow-md hover:shadow-lg bg-special-input text-white"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Checkbox checked={doubleTime} onCheckedChange={setDoubleTime} />
              <Label>Double Time</Label>
            </div>
          </div>
        </TooltipProvider>
        <Button
          onClick={handleSubmit}
          className="bg-lime-600 text-white hover:bg-green-700 rounded-sm py-5"
        >
          Calculate Upgrade
        </Button>
      </CardContent>
    </Card>
  )
}

export default BuildingForm
