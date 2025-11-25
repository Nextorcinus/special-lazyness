'use client'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TierItem from './TierItem'

export default function TierRow({ label, color, heroes = [] }) {
  return (
    <div className="flex items-center w-full gap-3">
      
      {/* Kotak kiri berwarna */}
      <div
        className="w-20 h-16 rounded flex items-center justify-center font-bold text-xl text-black"
        style={{
          backgroundColor: color,
          flexShrink: 0
        }}
      >
        {label}
      </div>

      {/* Area tempat hero */}
      <div className="flex-1 min-h-[64px] rounded-lg bg-white/10 p-3">
        <SortableContext
          items={heroes.map(h => h.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-2 flex-wrap">
            {heroes.map(hero => (
              <TierItem key={hero.id} hero={hero} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
