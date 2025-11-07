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

  console.log('🔧 [ResearchForm] Render state:', {
    category,
    researchName,
    tier,
    fromLevel,
    toLevel,
    researchSpeed,
    vpBonus
  })

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
    
    // Ambil semua level yang tersedia untuk tier ini, urutkan dan filter undefined
    const levels = tierData.map(item => item.level).filter(level => level !== undefined)
    return Array.from(new Set(levels)).sort((a, b) => a - b)
  }, [category, researchName, tier])

  // === Filter level tujuan ===
  // Jika from level tidak ada, maka to level akan menampilkan semua level yang ada
  // Jika from level ada, maka to level akan menampilkan level yang lebih besar dari from level
  const filteredToLevels = useMemo(() => {
    if (!fromLevel) return levelOptions

    const fromLevelNum = parseInt(fromLevel)
    return levelOptions.filter(level => level > fromLevelNum)
  }, [fromLevel, levelOptions])

  // === Reset level ketika Tier berubah ===
  useEffect(() => {
    console.log('🔄 [ResearchForm] Tier changed:', {
      tier,
      levelOptions,
      resettingLevels: !!tier
    })
    
    if (tier) {
      setFromLevel('')
      setToLevel('')
    }
  }, [tier])

  // === Load default values jika ada ===
  useEffect(() => {
    if (!defaultValues || !researchName) return

    console.log('📥 [ResearchForm] Loading default values:', defaultValues)
    
    setTier(prev => prev || defaultValues.tier || '')
    setFromLevel(prev => prev || String(defaultValues.fromLevel || ''))
    setToLevel(prev => prev || String(defaultValues.toLevel || ''))
    setResearchSpeed(prev => prev || String(defaultValues.buffs?.researchSpeed || '0'))
    setVpBonus(prev => prev || String(defaultValues.buffs?.vpBonus || '0'))
  }, [defaultValues, researchName])

  // === Hitung hasil research ===
  const handleCalculate = () => {
    console.log('🧮 [ResearchForm] Calculate button clicked with state:', {
      tier,
      fromLevel,
      toLevel,
      researchSpeed,
      vpBonus
    })

    const from = parseInt(fromLevel)
    const to = parseInt(toLevel)

    // Validasi input
    if (!tier) {
      toast.error('Please select Tier.')
      return
    }

    if (isNaN(from) || isNaN(to)) {
      toast.error('Please select valid Levels.')
      return
    }

    if (to <= from) {
      toast.error('"To" level must be greater than "From" level.')
      return
    }

    // Validasi level tersedia di data
    const isValidFrom = levelOptions.includes(from) || from === 0
    const isValidTo = levelOptions.includes(to)
    
    if (!isValidFrom || !isValidTo) {
      console.log('❌ [ResearchForm] Level validation failed:', {
        from, to, levelOptions,
        isValidFrom, isValidTo
      })
      toast.error('Selected levels are not available for this tier.')
      return
    }

    console.log('✅ [ResearchForm] Validation passed, calculating...')

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

    console.log('📊 [ResearchForm] Calculation result:', result)

    if (!result) {
      console.log('❌ [ResearchForm] Calculation returned null/undefined')
      toast.error('Calculation failed. Please check your inputs.')
      return
    }

    console.log('🚀 [ResearchForm] Calling onCalculate callback')
    onCalculate?.(result)
    toast.success('Research calculation completed!')
    
    // Reset form setelah berhasil (opsional)
    console.log('🔄 [ResearchForm] Resetting form fields')
    setFromLevel('')
    setToLevel('')
    setResearchSpeed('0')
    setVpBonus('0')
  }

  // VP Bonus options
  const vpBonusOptions = ["0", "10", "20"]

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
                  setToLevel('') // Reset toLevel ketika fromLevel berubah
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
              <Label className="text-white text-shadow-md">
                Research Speed (%)
              </Label>
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
                      {bonus === "0" ? "Off" : `${bonus}%`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* === Button === */}
            <div className="flex items-end">
              <Button
                onClick={handleCalculate}
                disabled={!tier || !fromLevel || !toLevel}
                className="bg-orange-500 hover:bg-orange-400 text-sm md:text-base text-white rounded-lg py-6 md:py-4 w-full disabled:bg-gray-600 disabled:cursor-not-allowed"
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