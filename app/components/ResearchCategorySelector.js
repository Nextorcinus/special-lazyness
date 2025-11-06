'use client'

import React from 'react'
import { cn } from '../lib/utils'

export default function ResearchCategorySelector({ selected, onChange }) {
  const categories = ['Growth', 'Economy', 'Battle']

  return (
    <div className="relative flex gap-4 text-sm font-medium text-white">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'buttonGlass flex items-center gap-4 transition-all duration-300',
            selected === cat && 'active text-lime-400' 
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}