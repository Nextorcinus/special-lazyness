'use client'

import React, { useRef, useEffect } from 'react'
import { cn } from '../lib/utils'

export default function HeliosSubcategoryScroll({ items, selected, onSelect }) {
  const scrollRef = useRef(null)
  let isDown = false
  let startX = 0
  let scrollLeft = 0

  useEffect(() => {
    const slider = scrollRef.current
    if (!slider) return

    const onMouseDown = (e) => {
      isDown = true
      slider.classList.add('cursor-grabbing')
      startX = e.pageX - slider.offsetLeft
      scrollLeft = slider.scrollLeft
    }

    const onMouseLeave = () => {
      isDown = false
      slider.classList.remove('cursor-grabbing')
    }

    const onMouseUp = () => {
      isDown = false
      slider.classList.remove('cursor-grabbing')
    }

    const onMouseMove = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - slider.offsetLeft
      const walk = (x - startX) * 1.5
      slider.scrollLeft = scrollLeft - walk
    }

    slider.addEventListener('mousedown', onMouseDown)
    slider.addEventListener('mouseleave', onMouseLeave)
    slider.addEventListener('mouseup', onMouseUp)
    slider.addEventListener('mousemove', onMouseMove)

    return () => {
      slider.removeEventListener('mousedown', onMouseDown)
      slider.removeEventListener('mouseleave', onMouseLeave)
      slider.removeEventListener('mouseup', onMouseUp)
      slider.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div
      ref={scrollRef}
      className="bg-special-cat p-1 w-full overflow-x-auto no-scrollbar mt-4 rounded-xl"
    >
      <div className="flex gap-1 cursor-grab select-none w-max">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm transition whitespace-nowrap',
              selected === item
                ? 'bg-lime-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
