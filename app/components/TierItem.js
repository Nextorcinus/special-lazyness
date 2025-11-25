import Link from "next/link"
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
    <Link
      ref={setNodeRef}
      href={`/dashboard/heroes/${hero.id}`}
      style={style}
      {...attributes}
      {...listeners}
      className="w-16 h-16 rounded overflow-hidden border border-white/20 cursor-pointer active:cursor-grabbing block"
    >
      <img
        src={`/icon/${hero.thumbnail}`}
        alt={hero.name}
        className="w-full h-full object-cover"
      />
    </Link>
  )
}
