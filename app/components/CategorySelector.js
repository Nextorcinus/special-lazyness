'use client'

import React from 'react'
import Image from 'next/image' 
import { cn } from '../lib/utils'

export default function CategorySelector({ selected, onChange }) {
  const categories = [
    { name: 'Basic' },
    { name: 'Fire Crystal'},
  ]

  return (
    <div className="relative  flex gap-4 text-sm font-medium text-white">
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onChange(cat.name)}
          className={cn(
            'buttonGlass flex items-center gap-4 transition-all duration-300',
            selected === cat.name && 'active text-lime-400'
          )}
        >

          {cat.name}
        </button>
      ))}
    </div>
  )
}
