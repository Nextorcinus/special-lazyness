'use client'

import React from 'react'
import { cn } from '../lib/utils'

export default function HeliosCategorySelector({ selected, onChange }) {
  const categories = ['Infantry', 'Marksman', 'Lancer']

  return (
    <div className="relative sm:absolute sm:right-6 sm:top-6 mt-4 sm:mt-0 flex gap-4 text-sm font-medium text-white">
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
