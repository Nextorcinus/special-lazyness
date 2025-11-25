'use client'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TierItem from './TierItem'

export default function TierRow({ label, color, heroes = [] }) {
  return (
    <div className="flex w-full gap-3 items-center">
      
      {/* Label Tier */}
      <div
        className="
          flex items-center justify-center font-bold text-black
          rounded
          w-14 h-10 text-base
          sm:w-20 sm:h-16 sm:text-xl
        "
        style={{ backgroundColor: color, flexShrink: 0 }}
      >
        {label}
      </div>

      {/* Area Dropzone */}
      <div
        className="
          flex-1 bg-white/10 rounded-lg p-2 min-h-[52px]
          sm:p-3 sm:min-h-[64px] border border-white/20
        "
      >
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
