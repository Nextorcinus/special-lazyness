// components/TierItem.js
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TierItem({ hero }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: hero.id
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="w-16 h-16 rounded overflow-hidden border border-white/20 cursor-grab active:cursor-grabbing"
      title={`${hero.name} • ${hero.rarity}`}
    >
      <img src={`/icon/${hero.thumbnail}`} alt={hero.name} className="w-full h-full object-cover" />
    </div>
  )
}
