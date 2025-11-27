'use client'

import { useState } from 'react'
import Image from 'next/image'
import heroesData from '../data/heroes/index.json'

export default function RallySetupCollapse({ data }) {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = index => {
    setOpenIndex(prev => (prev === index ? null : index))
  }

  if (!Array.isArray(data)) {
    return null
  }

  return (
    <div className="p-6 space-y-4">
      <header className="mt-6 px-4 py-2">
        <h2 className="text-2xl font-bold">Bear Hunt Guide</h2>
      </header>

      {data.map((gen, index) => (
        <section 
          key={index} 
          className="border border-white/20 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => handleToggle(index)}
            className="w-full text-left px-4 py-3 bg-white/10 hover:bg-gray-800 font-semibold"
          >
            Gen {gen.generation}
          </button>

          {openIndex === index && (
            <div className="p-4 space-y-6 bg-zinc-900/70">
              {gen.setups.map((setup, i) => (
                <div key={i} className="space-y-3">
                  <h3 className="text-lg font-bold text-white">{setup.type}</h3>

                  <div className="flex gap-2">
                    {setup.id.map(heroId => {
                      const hero = heroesData.find(h => h.id === heroId)
                      if (!hero) return null

                      return (
                        <Image
                          key={heroId}
                          src={`/icon/${hero.thumbnail}`}
                          alt={hero.name}
                          width={60}
                          height={60}
                          className="rounded shadow-md"
                        />
                      )
                    })}
                  </div>

                  <ul className="text-sm text-zinc-200 leading-relaxed space-y-1">
                    <li>
                      <span className="font-semibold text-green-400">
                        Troop Formation:
                      </span>{' '}
                      {setup.formation}
                    </li>
                    <li>{setup.suggest}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
