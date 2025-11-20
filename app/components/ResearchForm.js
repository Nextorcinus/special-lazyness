'use client'

import { useState, useMemo, useEffect } from 'react'
import researchData from '../data/MaterialBasicResearch'
import { Card, CardContent } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Info } from 'lucide-react'

import HybridSelect from '../components/HybridSelect'   // ← dipakai untuk menyamakan semua form

import { calculateResearchUpgrade } from '../utils/calculateResearch'

export default function ResearchForm({ 
  category, 
  researchName, 
  defaultValues = {}, 
  onCalculate 
}) {
  const [tier, setTier] = useState('')
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [researchSpeed, setResearchSpeed] = useState('0')
  const [vpBonus, setVpBonus] = useState('0')

  const tierOptions = useMemo(
    () => Object.keys(researchData[category]?.[researchName]?.tiers || {}),
    [category, researchName]
  )

  const levelOptions = useMemo(() => {
    if (!tier) return []
    const tierData = researchData[category]?.[researchName]?.tiers?.[tier]
    if (!tierData) return []

    const levels = tierData.map(item => item.level).filter(l => l !== undefined)
    return Array.from(new Set(levels)).sort((a, b) => a - b)
  }, [category, researchName, tier])

  const filteredToLevels = useMemo(() => {
    if (!fromLevel) return levelOptions
    const f = parseInt(fromLevel)
    return levelOptions.filter(l => l > f)
  }, [fromLevel, levelOptions])

  useEffect(() => {
    if (tier) {
      setFromLevel('')
      setToLevel('')
    }
  }, [tier])

  useEffect(() => {
    if (!defaultValues || !researchName) return 

    setTier(defaultValues.tier || '')
    setFromLevel(String(defaultValues.fromLevel || ''))
    setToLevel(String(defaultValues.toLevel || ''))
    setResearchSpeed(String(defaultValues.buffs?.researchSpeed || '0'))
    setVpBonus(String(defaultValues.buffs?.vpBonus || '0'))
  }, [researchName])

  const handleCalculate = () => {
    const from = parseInt(fromLevel)
    const to = parseInt(toLevel)

    if (!tier) return toast.error('Please select Tier.')
    if (isNaN(from) || isNaN(to)) return toast.error('Please select valid Levels.')
    if (to <= from) return toast.error('"To" must be higher than "From".')

    const isValidFrom = levelOptions.includes(from) || from === 0
    const isValidTo = levelOptions.includes(to)
    if (!isValidFrom || !isValidTo) {
      return toast.error('Selected levels are not available for this tier.')
    }

    const result = calculateResearchUpgrade({
      category,
      researchName,
      tier,
      fromLevel: from,
      toLevel: to,
      researchSpeed: parseInt(researchSpeed) || 0,
      vpBonus: parseInt(vpBonus) || 0,
      data: researchData,
    })

    if (!result) {
      return toast.error('Calculation failed. Check your inputs.')
    }

    result.tier = tier
    result.fromLevel = from
    result.toLevel = to
    result.research = researchName

    onCalculate?.(result)

    toast.success('Research calculation completed.')

    setFromLevel('')
    setToLevel('')
  }

  const vpBonusOptions = [
    { value: '0', label: 'Off' },
    { value: '10', label: '10%' },
    { value: '20', label: '20%' }
  ]

  return (
    <Card className="bg-glass-background1 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl">{researchName}</h2>

        {tierOptions.length === 0 && (
          <p className="text-red-400 text-sm">
            ⚠ Data for "{researchName}" not found in this category.
          </p>
        )}

        <TooltipProvider>
          <div className="bg-glass-background2 p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-4">

            {/* Tier */}
            <div>
              <Label className="text-white">Tier</Label>
              <HybridSelect
                value={tier}
                onChange={setTier}
                placeholder="Select Tier"
                options={tierOptions.map(t => ({ value: t, label: t }))}
                className="bg-special-input text-white"
              />
            </div>

            {/* From */}
            <div>
              <Label className="text-white">From</Label>
              <HybridSelect
                value={fromLevel}
                onChange={(v) => { setFromLevel(v); setToLevel(''); }}
                placeholder={tier ? "From" : "Select Tier first"}
                disabled={!tier}
                options={[
                  { value: '0', label: '0' },
                  ...levelOptions.map(l => ({ value: String(l), label: l }))
                ]}
                className="bg-special-input text-white"
              />
            </div>

            {/* To */}
            <div>
              <Label className="text-white">To</Label>
              <HybridSelect
                value={toLevel}
                onChange={setToLevel}
                placeholder={fromLevel ? "To" : "Select From first"}
                disabled={!fromLevel}
                options={filteredToLevels.map(l => ({ value: String(l), label: l }))}
                className="bg-special-input text-white"
              />
            </div>

            {/* Research Speed */}
            <div>
              <Label className="text-white">Research Speed (%)</Label>
              <Input
                type="number"
                value={researchSpeed}
                onChange={(e) => setResearchSpeed(e.target.value)}
                placeholder="e.g. 30"
                className="bg-special-input text-white"
                min="0"
                max="100"
              />
            </div>

            {/* VP Bonus */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Label className="text-white">VP Bonus</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>+10% VP buff or +20% if President activates buff.</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <HybridSelect
                value={vpBonus}
                onChange={setVpBonus}
                placeholder="VP Bonus"
                options={vpBonusOptions}
                className="bg-special-input text-white"
              />
            </div>

            {/* Calculate */}
            <div className="flex items-center">
              <Button
                onClick={handleCalculate}
                disabled={!tier || !fromLevel || !toLevel}
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
