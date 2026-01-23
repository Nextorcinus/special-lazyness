'use client'

import { useState } from 'react'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import HybridSelect from './HybridSelect'
import Image from 'next/image'

export default function AttackCalculator() {
  const [troopsAttack, setTroopsAttack] = useState('')
  const [unitAttack, setUnitAttack] = useState('')
  const [heroAttack, setHeroAttack] = useState('')

  const [skinBonus, setSkinBonus] = useState('0')
  const [synergyBonus, setSynergyBonus] = useState('0')

  const [widgetBonus, setWidgetBonus] = useState('0')
  const [buffTroops, setBuffTroops] = useState('0')
  const [petBuff, setPetBuff] = useState('0')

  const [result, setResult] = useState(null)

  const handleCalculate = (e) => {
    e.preventDefault()

    const baseCombatStat =
      Number(troopsAttack || 0) +
      Number(unitAttack || 0) +
      Number(heroAttack || 0) +
      Number(skinBonus || 0)

    const specialStatBonus =
      Number(widgetBonus || 0) + Number(buffTroops || 0) + Number(petBuff || 0)

    const specialMultiplier = specialStatBonus / 100

    const mainResult =
      baseCombatStat > 0
        ? baseCombatStat * (1 + specialMultiplier) + specialStatBonus
        : 0

    const finalResult = mainResult + Number(synergyBonus || 0)

    console.log('Base Combat Stat:', baseCombatStat)
    console.log('Special Stat Bonus:', specialStatBonus)
    console.log('Special Stat Bonus / 100:', specialMultiplier)
    console.log('Result before Synergy:', mainResult)
    console.log('Synergy Bonus:', synergyBonus)
    console.log('Final Result:', finalResult)

    setResult(finalResult)

    toast.success('Calculation completed')
  }

  return (
    <>
      <form
        onSubmit={handleCalculate}
        className="py-4 px-4 mt-10 bg-special-inside rounded-xl space-y-6"
      >
        <h2 className="text-xl text-white">Attack Calculator</h2>

        <div className="bg-glass-background2 sm:items-center p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Troops Attack */}
          <div>
            <Label className="text-white">Troops Attack</Label>
            <input
              className="w-full p-2 rounded bg-black/30 text-white"
              value={troopsAttack}
              onChange={(e) => setTroopsAttack(e.target.value)}
              placeholder="e.g 326.25"
            />
          </div>

          {/* Unit Attack */}
          <div>
            <Label className="text-white">Unit Attack</Label>
            <input
              className="w-full p-2 rounded bg-black/30 text-white"
              value={unitAttack}
              onChange={(e) => setUnitAttack(e.target.value)}
              placeholder="e.g 337.50"
            />
          </div>

          {/* Hero Attack */}
          <div>
            <Label className="text-white">Hero Attack</Label>
            <input
              className="w-full p-2 rounded bg-black/30 text-white"
              value={heroAttack}
              onChange={(e) => setHeroAttack(e.target.value)}
              placeholder="e.g 670.52"
            />
          </div>

          {/* Skin Bonus */}
          <div>
            <Label className="text-white">Skin Bonus</Label>
            <input
              className="w-full p-2 rounded bg-black/30 text-white"
              value={skinBonus}
              onChange={(e) => setSkinBonus(e.target.value)}
              placeholder="e.g 2"
            />
          </div>

          {/* Widget */}
          <div>
            <Label className="text-white">Widget</Label>
            <HybridSelect
              value={widgetBonus}
              onChange={(val) => setWidgetBonus(val)}
              placeholder="Select Widget"
              options={[
                { value: '0', label: 'None' },
                { value: '5', label: '5%' },
                { value: '7.5', label: '7.5%' },
                { value: '10', label: '10%' },
                { value: '12.5', label: '12.5%' },
                { value: '15', label: '15%' },
              ]}
            />
          </div>

          {/* Buff */}
          <div>
            <Label className="text-white">Buff</Label>
            <HybridSelect
              value={buffTroops}
              onChange={(val) => setBuffTroops(val)}
              placeholder="Select Buff"
              options={[
                { value: '0', label: 'None' },
                { value: '10', label: '10%' },
                { value: '20', label: '20%' },
              ]}
            />
          </div>

          {/* Pet */}
          <div>
            <Label className="text-white">Pet Buff</Label>
            <HybridSelect
              value={petBuff}
              onChange={(val) => setPetBuff(val)}
              placeholder="Select Pet Level"
              options={[
                { value: '0', label: 'None' },
                { value: '2.5', label: 'Lv1 (2.5%)' },
                { value: '3', label: 'Lv2 (3%)' },
                { value: '3.5', label: 'Lv3 (3.5%)' },
                { value: '4', label: 'Lv4 (4%)' },
                { value: '5', label: 'Lv5 (5%)' },
                { value: '6', label: 'Lv6 (6%)' },
                { value: '7', label: 'Lv7 (7%)' },
                { value: '8', label: 'Lv8 (8%)' },
                { value: '9', label: 'Lv9 (9%)' },
                { value: '10', label: 'Lv10 (10%)' },
              ]}
            />
          </div>

          {/* Synergy */}
          <div>
            <Label className="text-white">Synergy Bonus</Label>
            <input
              className="w-full p-2 rounded bg-black/30 text-white"
              value={synergyBonus}
              onChange={(e) => setSynergyBonus(e.target.value)}
              placeholder="e.g 10"
            />
          </div>

          {/* Button */}
          <div className="flex items-end">
            <Button
              type="submit"
              className="button-Form text-sm md:text-base text-white rounded-lg py-6 w-full"
            >
              Calculate
            </Button>
          </div>
        </div>

        {result !== null && (
          <div className="text-white text-lg">
            Result: <span className="font-bold">{result.toFixed(2)}%</span>
          </div>
        )}
      </form>

      <div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
        <h3 className="text-white text-lg font-semibold">1. Troops Attack</h3>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Image
            src="/public/icon/troopattack.png"
            alt="Troops Attack"
            width={400}
            height={200}
            className=" object-cover"
          />

          <p className="text-white/80 text-sm leading-relaxed">
            type Troop's attack from bonus overview, then for unit attack copy
            from each hero
          </p>
        </div>
      </div>
      <div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
        <h3 className="text-white text-lg font-semibold">2. Hero Attack</h3>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Image
            src="/public/icon/hero_attack.png"
            alt="Hero Attack"
            width={400}
            height={200}
            className="rounded-lg object-cover"
          />

          <p className="text-white/80 text-sm leading-relaxed">
            copy hero attack from hero info page
          </p>
        </div>
      </div>
      <div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
        <h3 className="text-white text-lg font-semibold">3. Skin Bonus</h3>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Image
            src="/public/icon/skin_bonus.png"
            alt="Skin Bonus"
            width={400}
            height={200}
            className="rounded-lg object-cover"
          />

          <p className="text-white/80 text-sm leading-relaxed">
            copy hero attack from hero info page
          </p>
        </div>
      </div>
      <div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
        <h3 className="text-white text-lg font-semibold">4. Hero Widget</h3>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Image
            src="/public/icon/hero_widget.png"
            alt="Hero Widget"
            width={400}
            height={200}
            className="rounded-lg object-cover"
          />

          <p className="text-white/80 text-sm leading-relaxed">
            check hero widget level and percentage bonus.
          </p>
        </div>
      </div>
      <div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
        <h3 className="text-white text-lg font-semibold">5. Buff Pet</h3>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Image
            src="/public/icon/buff_pet.png"
            alt="Buff Pet"
            width={400}
            height={200}
            className="rounded-lg object-cover"
          />

          <p className="text-white/80 text-sm leading-relaxed">
            check pet buff level and percentage bonus.
          </p>
        </div>
      </div>
      <div className="mt-6 bg-glass-background2 p-4 rounded-xl space-y-3">
        <h3 className="text-white text-lg font-semibold">
          6. Hero Synergy Gear Chief
        </h3>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <Image
            src="/public/icon/hero_synergy.png"
            alt="Hero Synergy"
            width={400}
            height={200}
            className="rounded-lg object-cover"
          />

          <p className="text-white/80 text-sm leading-relaxed">
            check your gear for synergy bonus.
          </p>
        </div>
      </div>
    </>
  )
}
