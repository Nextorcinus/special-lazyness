'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '../lib/utils'

export default function HeliosDuaBelasCategorySelector({ selected, onChange }) {
  const categories = ['Exalted Infantry', 'Exalted Marksman', 'Exalted Lancer']

  return (
    <div className="relative sm:absolute sm:right-6 sm:top-6 mt-4 sm:mt-0 flex flex-wrap gap-2 text-sm font-medium text-white">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange?.(cat)}
          className={cn(
            'buttonGlass flex items-center gap-2 transition-all duration-300',
            selected === cat && 'active text-lime-400'
          )}
        >
          {cat}
        </button>
      ))}

      <Link
        href="/dashboard/war-academy/T12-skills"
        target="_self"
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition text-white text-sm"
      >
        Unlock Skills T12
      </Link>
    </div>
  )
}
