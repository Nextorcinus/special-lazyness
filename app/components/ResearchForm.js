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

  

  // === Tier Options ===
  const tierOptions = useMemo(
    () => Object.keys(researchData[category]?.[researchName]?.tiers || {}),
    [category, researchName]
  )

  // === Level Options ===
  const levelOptions = useMemo(() => {
    if (!tier) return []
    const tierData = researchData[category]?.[researchName]?.tiers?.[tier]
    if (!tierData) return []
    
    const levels = tierData.map(item => item.level).filter(level => level !== undefined)
    return Array.from(new Set(levels)).sort((a, b) => a - b)
  }, [category, researchName, tier])

 
  const filteredToLevels = useMemo(() => {
    if (!fromLevel) return levelOptions
    const fromNum = parseInt(fromLevel)
    return levelOptions.filter(level => level > fromNum)
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

  // === Handle Calculate ===
  const handleCalculate = () => {
  

    const from = parseInt(fromLevel)
    const to = parseInt(toLevel)

    if (!tier) return toast.error('Please select Tier.')
    if (isNaN(from) || isNaN(to)) return toast.error('Please select valid Levels.')
    if (to <= from) return toast.error('"To" level must be greater than "From" level.')

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
      toast.error('Calculation failed. Please check your inputs.')
      return
    }

    
    result.tier = tier
    result.fromLevel = from
    result.toLevel = to
    result.research = researchName

    
    onCalculate?.(result)

    toast.success('Research calculation completed!')

    
    setFromLevel('')
    setToLevel('')
  }

  const vpBonusOptions = ['0', '10', '20']

  return (
    <Card className="bg-glass-background1 text-white mt-6">
      <CardContent className="space-y-6 pt-6">
        <h2 className="text-xl text-white">{researchName}</h2>

        {tierOptions.length === 0 && (
          <p className="text-red-400 text-sm">
            ⚠ Data for &quot;{researchName}&quot; not found in {category} category.
          </p>
        )}

        <TooltipProvider>
          <div className="bg-glass-background2 p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
            
            {/* === Tier === */}
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
              <Select 
                value={fromLevel} 
                onValueChange={(value) => {
                  setFromLevel(value)
                  setToLevel('')
                }}
                disabled={!tier}
              >
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder={tier ? "-- Select --" : "Select Tier first"} />
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
              <Select 
                value={toLevel} 
                onValueChange={setToLevel}
                disabled={!fromLevel}
              >
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder={fromLevel ? "-- Select --" : "Select From first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredToLevels.map((lvl) => (
                    <SelectItem key={lvl} value={String(lvl)}>
                      {lvl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* === Research Speed === */}
            <div>
              <Label className="text-white w-full text-shadow-md">
                Research Speed (%)
              </Label>
              <Input
                type="number"
                value={researchSpeed}
                onChange={(e) => setResearchSpeed(e.target.value)}
                placeholder="e.g. 30"
                className="bg-special-input w-full text-white"
                min="0"
                max="100"
              />
            </div>

            {/* === VP Bonus === */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <Label className="text-white text-shadow-md">VP Bonus</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button">
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>+10% VP buff or +20% if President activates buff.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={vpBonus} onValueChange={setVpBonus}>
                <SelectTrigger className="bg-special-input text-white">
                  <SelectValue placeholder="Choose Bonus" />
                </SelectTrigger>
                <SelectContent>
                  {vpBonusOptions.map((bonus) => (
                    <SelectItem key={bonus} value={bonus}>
                      {bonus === '0' ? 'Off' : `${bonus}%`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* === Button === */}
            <div className="flex items-center">
              <Button
                onClick={handleCalculate}
                disabled={!tier || !fromLevel || !toLevel}
                className="button-Form text-sm md:text-base text-white rounded-lg py-6 md:py-6 w-full disabled:bg-gray-600 disabled:cursor-not-allowed"
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
