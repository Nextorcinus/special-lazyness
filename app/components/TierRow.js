'use client'

import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TierItem from './TierItem'

export default function TierRow({ label, color, heroes = [] }) {
  return (
     <div
      className="
        flex flex-col gap-2
        sm:flex-row sm:items-center sm:gap-3
        w-full
      "
    >
      {/* Label Tier */}
      <div
        className="
          w-full h-10 text-base flex items-center justify-center
          font-bold text-black rounded
          sm:w-20 sm:h-16 sm:text-xl sm:flex-shrink-0
        "
        style={{ backgroundColor: color }}
      >
        {label}
      </div>

      {/* Dropzone */}
      <div
        className="
          w-full bg-white/10 rounded-lg p-2 min-h-[52px]
          sm:flex-1 sm:p-3 sm:min-h-[64px]
        "
      >
        <SortableContext
          items={heroes.map(h => h.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex justify-center md:justify-start gap-2 flex-wrap w-full">
            {heroes.map(hero => (
              <TierItem key={hero.id} hero={hero} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  )
}
