'use client'

import React, { useRef, useEffect } from 'react'

export default function SubcategoryScroll({ items, selected, onSelect }) {
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
      className="flex overflow-x-auto gap-2 no-scrollbar select-none cursor-grab py-2 px-1"
    >
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
            selected === item
              ? 'bg-green-500 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  )
}
