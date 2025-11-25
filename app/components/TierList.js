// components/TierList.js
'use client'

import { useState } from 'react'
import TierRow from './TierRow'
import heroesData from '../data/heroes/index.json'

const TIERS = ['SS', 'A', 'B', 'C', 'D']


const TIER_COLORS = {
  SS: '#ff8b8b', 
  A:  '#ffbf93', 
  B:  '#fdff99', 
  C:  '#99c064',  
  D:  '#8ac3b5'  
}

export default function TierList() {
  
  const initial = {}
  TIERS.forEach(t => {
    initial[t] = heroesData.filter(h => (h.tier ?? 'A') === t)
  })

  const [tiers, setTiers] = useState(initial)

  return (
    <div className="p-6 space-y-4">
      {TIERS.map(tier => (
        <TierRow
          key={tier}
          label={tier}
          color={TIER_COLORS[tier]}
          heroes={tiers[tier]}
        />
      ))}
    </div>
  )
}
