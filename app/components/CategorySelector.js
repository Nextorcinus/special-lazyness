'use client'

import React from 'react'
import Image from 'next/image' // ✅ import dari next/image
import { cn } from '../lib/utils'

export default function CategorySelector({ selected, onChange }) {
  const categories = [
    { name: 'Basic', icon: '/icon/basic.png' },
    { name: 'Fire Crystal', icon: '/icon/fire_crystal.png' },
  ]

  return (
    <div className="relative  mt-2 flex gap-4 text-sm font-medium text-white">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onChange(cat.name)}
          className={cn(
            'buttonGlass flex items-center gap-2 transition-all duration-300',
            selected === cat.name && 'active text-lime-400'
          )}
        >
          <Image
            src={cat.icon}
            alt={cat.name}
            width={25}
            height={25}
            className={cn(
              ' transition-all duration-300',
              selected === cat.name && ' scale-110'
            )}
          />
          {cat.name}
        </button>
      ))}
    </div>
  )
}
