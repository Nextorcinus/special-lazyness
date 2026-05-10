'use client'

import React from 'react'
import { cn } from '../lib/utils'

export default function HeliosSkillCategorySelector({ selected, onChange }) {
  const categories = [
    {
      key: 'Infantry',
      label: 'Infantry',
    },
    {
      key: 'Marksman',
      label: 'Marksman',
    },
    {
      key: 'Lancer',
      label: 'Lancer',
    },
  ]

  return (
    <div className="relative sm:absolute sm:right-6 sm:top-6 mt-4 sm:mt-0 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 w-max">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => onChange(cat.key)}
            className={cn(
              'buttonGlass px-4 py-2 text-sm whitespace-nowrap transition-all duration-300',
              selected === cat.key ? 'active text-lime-400' : 'text-white'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}
