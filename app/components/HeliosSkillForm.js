'use client'

import React, { useEffect, useMemo, useState } from 'react'

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

export default function HeliosSkillForm({
  unit,
  selectedSubcategory,
  onCalculate,
  dataSource,
}) {
  const [selectedSkill, setSelectedSkill] = useState('')

  const [fromLevel, setFromLevel] = useState('0')

  const [toLevel, setToLevel] = useState('')

  // ================= BUFF =================

  const [researchSpeed, setResearchSpeed] = useState('0')

  const [vpBonus, setVpBonus] = useState('0')

  // ================= SUBCATEGORY DATA =================

  const subcategoryData = dataSource?.skills?.[selectedSubcategory] || {}

  // ================= NORMALIZE UNIT =================

  const normalizedUnit = useMemo(() => {
    return (unit || '').replace('Exalted ', '').trim().toLowerCase()
  }, [unit])

  // ================= MATCH UNIT KEY =================

  const matchedUnitKey = useMemo(() => {
    const unitKeys = Object.keys(subcategoryData?.units || {})

    return unitKeys.find((key) => {
      const normalizedKey = key.replace('Exalted ', '').trim().toLowerCase()

      return normalizedKey === normalizedUnit
    })
  }, [subcategoryData, normalizedUnit])

  // ================= TYPE =================

  const isSolar = selectedSubcategory === 'Solar Supremacy'

  const isSpecial = selectedSubcategory === 'Special Skill'

  // ================= UNIT DATA =================

  const unitData = useMemo(() => {
    if (isSolar) return null

    return (
      subcategoryData?.units?.[unit] ||
      subcategoryData?.units?.[matchedUnitKey] ||
      null
    )
  }, [subcategoryData, unit, matchedUnitKey, isSolar])

  // ================= CURRENT SKILL =================

  const currentSkill = useMemo(() => {
    // SOLAR
    if (isSolar) {
      return {
        name: 'Solar Supremacy',

        type: subcategoryData?.type || 'deployment',

        template: subcategoryData?.template || 'solar_15',
      }
    }

    // SPECIAL
    if (isSpecial) {
      if (
        unitData &&
        typeof unitData === 'object' &&
        !Array.isArray(unitData)
      ) {
        return unitData
      }

      return null
    }

    // NORMAL SKILL
    if (Array.isArray(unitData)) {
      return (
        unitData.find(
          (s) =>
            s?.name?.trim().toLowerCase() ===
            selectedSkill?.trim().toLowerCase()
        ) || null
      )
    }

    return null
  }, [isSolar, isSpecial, subcategoryData, unitData, selectedSkill])

  // ================= MAX LEVEL =================

  const maxLevel = useMemo(() => {
    if (typeof subcategoryData?.maxLevel === 'number') {
      return subcategoryData.maxLevel
    }

    if (isSolar) return 15

    if (isSpecial) return 3

    if (selectedSubcategory === 'Skill 1') {
      return 20
    }

    return 50
  }, [subcategoryData, isSolar, isSpecial, selectedSubcategory])

  // ================= LEVEL OPTIONS =================

  const levelOptions = useMemo(() => {
    return Array.from(
      {
        length: maxLevel + 1,
      },
      (_, i) => ({
        value: String(i),
        label: i,
      })
    )
  }, [maxLevel])

  // ================= SKILL OPTIONS =================

  const skillOptions = useMemo(() => {
    if (!Array.isArray(unitData)) {
      return []
    }

    return unitData.map((skill) => ({
      value: skill.name,
      label: skill.name,
    }))
  }, [unitData])

  // ================= RESET =================

  useEffect(() => {
    setSelectedSkill('')
    setFromLevel('0')
    setToLevel('')
  }, [unit, selectedSubcategory])

  // ================= SAFE GET VALUE =================

  const getValue = (item, keys = []) => {
    if (!item) return 0

    for (const key of keys) {
      const foundKey = Object.keys(item).find(
        (k) => k.trim().toLowerCase() === key.toLowerCase()
      )

      if (foundKey !== undefined) {
        const value = item[foundKey]

        if (value !== undefined && value !== null) {
          return Number(value) || 0
        }
      }
    }

    return 0
  } // ================= GET TABLE NAME =================

  const getTableName = () => {
    // SOLAR
    if (isSolar) {
      return currentSkill?.template || subcategoryData?.template || 'solar_15'
    }

    // SPECIAL
    if (isSpecial) {
      return currentSkill?.template || subcategoryData?.template || 'special_3'
    }

    // NORMAL
    return subcategoryData?.template || currentSkill?.template || ''
  }

  // ================= SKILL NAME =================

  const getCurrentSkillName = () => {
    if (isSolar) {
      return 'Solar Supremacy'
    }

    if (isSpecial) {
      return currentSkill?.name || 'Special Skill'
    }

    return currentSkill?.name || selectedSkill
  }

  // ================= CALCULATE =================

  const handleCalculate = () => {
    // VALIDATE SUBCATEGORY

    if (!selectedSubcategory) {
      toast.error('Select a subcategory first.')

      return
    }

    // VALIDATE LEVEL

    if (!toLevel || Number(toLevel) <= Number(fromLevel)) {
      toast.error('Make sure levels are selected correctly.')

      return
    }

    // NORMAL SKILL VALIDATE

    if (!isSolar && !isSpecial && !selectedSkill) {
      toast.error('Please select a skill first.')

      return
    }

    // SPECIAL / SOLAR VALIDATE

    if ((isSpecial || isSolar) && !currentSkill) {
      toast.error('Skill data not found for this unit.')

      return
    }

    // TABLE

    const tableName = getTableName()

    const table = dataSource?.tables?.[tableName] || []

    if (!table.length) {
      toast.error(`Table not found: ${tableName}`)

      return
    }

    // TARGET LEVEL
    // IMPORTANT:
    // ambil level tujuan saja
    // bukan sum

    const targetLevelData = table.find(
      (item) => Number(item.level) === Number(toLevel)
    )

    if (!targetLevelData) {
      toast.error('Target level data not found.')

      return
    }

    // ================= RESOURCES (SUM RANGE) =================

    const resultResources = {
      Steel: 0,
      RFC: 0,
      'FC Shards': 0,
      Meat: 0,
      Wood: 0,
      Coal: 0,
      Iron: 0,
    }

    // IMPORTANT:
    // sum dari from+1 sampai to

    const resourceLevels = table.filter((item) => {
      const lvl = Number(item.level)

      return lvl > Number(fromLevel) && lvl <= Number(toLevel)
    })

    resourceLevels.forEach((item) => {
      resultResources.Steel += getValue(item, ['Steel', 'steel'])

      resultResources.RFC += getValue(item, ['RFC', 'rfc'])

      resultResources['FC Shards'] += getValue(item, [
        'FC Shards',
        'F.Shards',
        'fShard',
      ])

      resultResources.Meat += getValue(item, ['Meat', 'meat'])

      resultResources.Wood += getValue(item, ['Wood', 'wood'])

      resultResources.Coal += getValue(item, ['Coal', 'coal'])

      resultResources.Iron += getValue(item, ['Iron', 'iron'])
    })

    // ================= POWER =================

    const power = Number(targetLevelData?.power) || 0

    // ================= STAT =================

    const stat = isSolar
      ? Number(targetLevelData?.capacity) || 0
      : Number(targetLevelData?.stat) || 0

    // ================= SKILL ENTRY =================

    const skillEntry = {
      name: getCurrentSkillName(),

      category: selectedSubcategory,

      type: currentSkill?.type || 'unknown',

      fromLevel: Number(fromLevel || 0),

      toLevel: Number(toLevel || 0),

      stat,

      isCapacity: isSolar,

      capacity: isSolar ? stat : null,

      power,

      time: targetLevelData?.time || '-',

      resources: resultResources,
    }

    // ================= RESULT =================

    const result = {
      id: crypto.randomUUID(),

      title: 'Helios Result',

      unit,

      category: unit,

      selectedSubcategory,

      resources: resultResources,

      totalResources: resultResources,

      power,

      totalPower: power,

      skills: [skillEntry],

      buffs: {
        researchSpeed: Number(researchSpeed || 0),

        vpBonus: Number(vpBonus || 0),
      },
    }

    console.log('FINAL HELIOS RESULT', result)

    onCalculate?.(result)

    toast.success('Helios calculation completed.')
  }
  return (
    <Card className="bg-glass-background1 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-2xl">
          {unit} • {selectedSubcategory}
        </h2>

        {/* ================= MAIN FORM ================= */}

        <div className="bg-glass-background2 p-4 rounded-xl space-y-4">
          {/* NORMAL SKILL */}

          {!isSolar && !isSpecial && (
            <div>
              <Label>Select Skill</Label>

              <HybridSelect
                value={selectedSkill}
                onChange={setSelectedSkill}
                placeholder="Choose Skill"
                options={skillOptions}
              />
            </div>
          )}

          {/* SPECIAL */}

          {isSpecial && (
            <div>
              <Label>Special Skill</Label>

              <div className="mt-2 bg-special-input border border-white/10 rounded-xl px-4 py-3 text-yellow-300">
                {currentSkill?.name || 'No special skill found'}
              </div>
            </div>
          )}

          {/* SOLAR */}

          {isSolar && (
            <div>
              <Label>Solar Supremacy</Label>

              <div className="mt-2 bg-special-input border border-white/10 rounded-xl px-4 py-3 text-yellow-300">
                Solar Supremacy
              </div>
            </div>
          )}

          {/* LEVEL */}

          <div className="grid grid-cols-2 gap-4">
            {/* FROM */}

            <div>
              <Label>From</Label>

              <HybridSelect
                value={fromLevel}
                onChange={(value) => {
                  setFromLevel(value)

                  setToLevel('')
                }}
                options={levelOptions}
              />
            </div>

            {/* TO */}

            <div>
              <Label>To</Label>

              <HybridSelect
                value={toLevel}
                onChange={setToLevel}
                placeholder="Select To"
                options={levelOptions.filter(
                  (lvl) => Number(lvl.value) > Number(fromLevel)
                )}
              />
            </div>
          </div>
        </div>

        {/* ================= BUFF ================= */}

        <TooltipProvider>
          <div className="bg-glass-background2 p-4 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* RESEARCH SPEED */}

              <div>
                <Label>Research Speed (%)</Label>

                <Input
                  type="number"
                  value={researchSpeed}
                  onChange={(e) => setResearchSpeed(e.target.value)}
                  className="bg-special-input text-white"
                  min="0"
                />
              </div>

              {/* VP BONUS */}

              <div>
                <div className="flex items-center gap-1 mb-2">
                  <Label>VP Bonus</Label>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button">
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>+10% or +20% VP buff.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <HybridSelect
                  value={vpBonus}
                  onChange={setVpBonus}
                  options={[
                    {
                      value: '0',
                      label: 'Off',
                    },
                    {
                      value: '10',
                      label: '10%',
                    },
                    {
                      value: '20',
                      label: '20%',
                    },
                  ]}
                />
              </div>

              {/* BUTTON */}

              <div className="flex items-end">
                <Button onClick={handleCalculate} className="w-full py-6">
                  Calculate
                </Button>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
