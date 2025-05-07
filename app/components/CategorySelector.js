'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export default function CategorySelector({ selected, onChange }) {
  return (
    <div className="absolute right-6 top-6 flex gap-4 text-sm font-medium text-zinc-400">
      {['Basic', 'Fire Crystal'].map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            'transition-colors',
            selected === cat && 'text-green-500 font-semibold'
          )}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
