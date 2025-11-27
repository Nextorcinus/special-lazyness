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
      className="w-16 h-16 rounded overflow-hidden border border-white/20 cursor-pointer active:cursor-grabbing block relative"
    >
      {/* Badge generation */}
      <div className="absolute top-0.5 right-0.5 z-10 border border-yellow-900 bg-lime-500 text-black text-[10px] font-bold px-1 py-[1px] rounded">
        {hero.generation}
      </div>

      {/* Thumbnail */}
      <img
        src={`/icon/${hero.thumbnail}`}
        alt={hero.name}
        className="w-full h-full object-cover"
      />
    </Link>
  )
}
