'use client'

import { useState } from 'react'
import TroopAssistantPreset from './TroopAssistantPreset'
import TroopAssistantResult from './TroopAssistantResult'
import { calculateTroopDistribution } from '@/lib/TroopAssistantUtils'

export default function TroopAssistantCalculator() {
  const [troops, setTroops] = useState({
    infantry: 0,
    lancer: 0,
    marksman: 0,
  })

  const [legions, setLegions] = useState(3)
  const [ratio, setRatio] = useState([1, 2, 7])

  const result = calculateTroopDistribution(troops, ratio, legions)

  const onChange = (key, value) => {
    setTroops((prev) => ({
      ...prev,
      [key]: Number(value) || 0,
    }))
  }

  return (
    <div className="space-y-6 max-w-xl">
      {/* Input */}
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(troops).map((key) => (
          <input
            key={key}
            type="number"
            placeholder={key}
            value={troops[key]}
            onChange={(e) => onChange(key, e.target.value)}
            className="bg-zinc-800 p-2 rounded border border-white/10"
          />
        ))}
      </div>

      {/* Legion count */}
      <div>
        <label className="text-sm text-white/70">Legion count</label>
        <input
          type="number"
          min={1}
          value={legions}
          onChange={(e) => setLegions(+e.target.value || 1)}
          className="w-full bg-zinc-800 p-2 rounded border border-white/10"
        />
      </div>

      {/* Preset */}
      <TroopAssistantPreset current={ratio} onSelect={setRatio} />

      {/* Result */}
      <TroopAssistantResult result={result} />
    </div>
  )
}
