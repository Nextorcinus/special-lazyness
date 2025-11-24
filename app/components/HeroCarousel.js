import { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'

export default function HeroCarousel({ heroes, activeIndex, onSelect }) {
  const visibleCount = 5
  const half = Math.floor(visibleCount / 2)
  const thumbRefs = useRef([])

  const visibleThumbnails = useMemo(() => {
    const total = heroes.length
    const result = []

    for (let i = -half; i <= half; i++) {
      const idx = (activeIndex + i + total) % total
      result.push({ ...heroes[idx], realIndex: idx })
    }

    return result
  }, [activeIndex, heroes])

  // Reset thumbRefs before rendering new elements
  useEffect(() => {
    thumbRefs.current = []
  }, [activeIndex])

  const setRef = (el) => {
    if (el) thumbRefs.current.push(el)
  }

  return (
    <div className="flex gap-2 items-center">
  {visibleThumbnails.map((h, i) => (
    <div
      key={h.id + '-' + i}
      ref={setRef}
      onClick={() => onSelect(h.realIndex)}
      className={`rounded-full border-2 overflow-hidden cursor-pointer ${
        h.realIndex === activeIndex
          ? 'border-green-400 opacity-100'
          : 'border-transparent opacity-50'
      }`}
      style={{ width: 50, height: 50 }}
    >
    <Image
    src={`/icon/${h.thumbnail || "placeholder.png"}`}
    alt={h.name || "Hero Thumbnail"}
    width={50}
    height={50}
    className="object-cover"
    onError={() => {}}
    />
    </div>
  ))}
</div>

  )
}
