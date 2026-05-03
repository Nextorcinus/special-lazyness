'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner'
import HybridSelect from '../components/HybridSelect'

export default function HeliosSkillForm({
  category,
  researchName,
  onCalculate,
  dataSource,
}) {
  const [fromLevel, setFromLevel] = useState('0')
  const [toLevel, setToLevel] = useState('')

  // ✅ ambil data + normalize key SEKALI
  const { levelOptions, entriesData } = useMemo(() => {
    const categoryData = dataSource?.[category]
    if (!categoryData) return { levelOptions: [], entriesData: [] }

    const matchedKey = Object.keys(categoryData).find(
      (key) => key.trim().toLowerCase() === researchName.trim().toLowerCase()
    )

    if (!matchedKey) return { levelOptions: [], entriesData: [] }

    const data = categoryData[matchedKey]

    const levels = data.map((item) => parseInt(item.level))

    return {
      levelOptions: [...new Set([0, ...levels])].sort((a, b) => a - b),
      entriesData: data,
    }
  }, [category, researchName, dataSource])

  // === TO LEVEL FILTER ===
  const toLevelOptions = useMemo(() => {
    const f = parseInt(fromLevel ?? '0')
    return levelOptions.filter((lvl) => lvl > f)
  }, [levelOptions, fromLevel])

  // === CALCULATE ===
  const handleCalculate = () => {
    const from = parseInt(fromLevel ?? '0')
    const to = parseInt(toLevel)

    if (isNaN(from) || isNaN(to) || to <= from) {
      toast.error('Make sure levels are selected correctly.')
      return
    }

    const entries = entriesData.filter((item) => {
      const lvl = parseInt(item.level)
      return lvl > from && lvl <= to
    })

    // === RESOURCE TOTAL ===
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

    // ✅ AMBIL LEVEL TERAKHIR
    const lastEntry =
      entries.length > 0
        ? entries[entries.length - 1]
        : entriesData.find((e) => Number(e.level) === to)

    // ✅ POWER
    const power = lastEntry ? Number(lastEntry.power || 0) : 0

    // ✅ ATTRIBUTES
    const attributes = Array.isArray(lastEntry?.attributes)
      ? lastEntry.attributes
      : []

    const result = {
      id: `${researchName}-${fromLevel}->${toLevel}`,
      building: researchName,
      category,
      fromLevel,
      toLevel,
      resources: total,

      power,
      attributes,
    }

    console.log('FORM RESULT:', result)

    onCalculate?.(result)
    toast.success('Helios T12 calculation complete!')
  }

  return (
    <Card className="bg-glass-background1 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl">{researchName}</h2>

        {levelOptions.length === 0 && (
          <p className="text-red-400 text-sm">
            ⚠ Data for “{researchName}” not found.
          </p>
        )}

        <div className="bg-glass-background2 p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* FROM */}
          <div>
            <Label>From</Label>
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
            />
          </div>

          {/* TO */}
          <div>
            <Label>To</Label>
            <HybridSelect
              value={toLevel}
              onChange={setToLevel}
              placeholder="Select Level"
              disabled={fromLevel === ''}
              options={toLevelOptions.map((lvl) => ({
                value: String(lvl),
                label: lvl,
              }))}
            />
          </div>

          {/* BUTTON */}
          <div className="col-span-2 md:col-span-1 flex items-center">
            <Button onClick={handleCalculate} className="w-full py-5">
              Calculate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
