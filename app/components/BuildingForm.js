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

const buildingAliasMap = {
  Marksman: 'Marksman',
  Lancer: 'Lancer Camp',
  Infantry: 'Infantry Camp',
  Research: 'Research Center',
  Infirmary: 'Infirmary',
  Command: 'Command Center',
  Store: 'Store House',
  Embassy: 'Embassy',
  Barricade: 'Barricade',
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
  const [vipLevel, setVipLevel] = useState('Off')
  const [doubleTime, setDoubleTime] = useState(false)
  const [zinmanSkill, setZinmanSkill] = useState('Off')
  const [constructionSpeed, setConstructionSpeed] = useState(0)

  const data = category === 'Basic' ? basicData : fireCrystalData
  const normalizedBuilding = buildingAliasMap[selectedSub] || selectedSub

  const levelOptions = useMemo(() => {
    const levels = data
      .filter(
        (b) =>
          b.Building?.trim().toLowerCase() ===
          normalizedBuilding.trim().toLowerCase()
      )
      .map((b) => b.Level)

    return Array.from(new Set(levels)).sort((a, b) => {
      const parseLevel = (lvl) =>
        parseFloat(String(lvl).replace(/[^\d.]/g, '')) || 0
      return parseLevel(a) - parseLevel(b)
    })
  }, [normalizedBuilding, data])

  const filteredToLevels = useMemo(() => {
    if (!fromLevel) return levelOptions
    return levelOptions.filter((level) => level > fromLevel)
  }, [fromLevel, levelOptions])

  useEffect(() => {
    if (!defaultValues || !selectedSub) return

    setFromLevel((prev) => prev || defaultValues.fromLevel || '')
    setToLevel((prev) => prev || defaultValues.toLevel || '')
    setPetLevel((prev) => prev || defaultValues.buffs?.petLevel || 'Off')
    setVipLevel((prev) => prev || defaultValues.buffs?.vipLevel || 'Off')
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
        vipLevel,
        doubleTime,
        zinmanSkill,
        constructionSpeed: +constructionSpeed,
      },
    })

    if (result) {
      onCalculate(result)
    } else {
      alert('Level tidak valid atau data tidak ditemukan')
    }
  }

  const petLevels = ['Off', 'Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5']
  const vipLevels = [
    'Off',
    'VIP 4',
    'VIP 5',
    'VIP 6',
    'VIP 7',
    'VIP 8',
    'VIP 9',
    'VIP 10',
    'VIP 11',
    'VIP 12',
  ]
  const zinmanLevels = ['Off', 'Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5']

  return (
    <Card className="bg-zinc-900 border-zinc-800 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl font-bold">{selectedSub}</h2>

        {levelOptions.length === 0 && (
          <p className="text-red-400 text-sm">
            ⚠ Data level untuk "{selectedSub}" tidak ditemukan dalam JSON.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>From</Label>
            <Select
              value={fromLevel}
              onValueChange={(v) => {
                setFromLevel(v)
                setToLevel('')
              }}
            >
              <SelectTrigger className="bg-zinc-800 border-zinc-800 text-white">
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
            <Label>To</Label>
            <Select value={toLevel} onValueChange={setToLevel}>
              <SelectTrigger className="bg-zinc-800 border-zinc-800 text-white">
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
            <Label>Pet</Label>
            <Select value={petLevel} onValueChange={setPetLevel}>
              <SelectTrigger className="bg-zinc-800 border-zinc-800 text-white">
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
            <Label>VIP</Label>
            <Select value={vipLevel} onValueChange={setVipLevel}>
              <SelectTrigger className="bg-zinc-800 border-zinc-800 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vipLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2 pt-4">
            <Checkbox checked={doubleTime} onCheckedChange={setDoubleTime} />
            <Label>Double Time</Label>
          </div>
          <div>text-zinc-900">Zinman Skill</Label>
            <Select value={zinmanSkill} onValueChange={setZinmanSkill}>
              <SelectTrigger className="bg-zinc-800 border-zinc-800  text-white">
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
            <Label>Construction Speed (%)</Label>
            <Input
              type="number"
              value={constructionSpeed}
              onChange={(e) => setConstructionSpeed(e.target.value)}
              min={0}
              max={100}
              className="bg-zinc-800 border-zinc-800 text-white"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="bg-green-500 text-white hover:bg-green-600"
        >
          Calculate Upgrade
        </Button>
      </CardContent>
    </Card>
  )
}

export default BuildingForm
