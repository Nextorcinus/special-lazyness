'use client'

import { useState } from 'react'
import Image from 'next/image'
import heroesData from '../data/heroes/index.json'

export default function RallySetupCollapse({ data }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = index => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {Array.isArray(data) && data.map((gen, index) => (
        <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
          <button
            className="w-full text-left px-4 py-3 bg-gray-900 hover:bg-gray-800 font-semibold"
            onClick={() => toggle(index)}
          >
            Gen {gen.generation}
          </button>

          {openIndex === index && (
            <div className="p-4 space-y-6 bg-gray-950">
              {gen.setups.map((setup, i) => (
                <div key={i}>
                  <h3 className="text-lg font-bold mb-2">{setup.type}</h3>

                  <div className="flex gap-2 mb-3">
                    {setup.id.map(heroId => {
                      const heroInfo = heroesData.find(h => h.id === heroId)

                      if (!heroInfo) return null

                      return (
                        <Image
                          key={heroId}
                          src={`/icon/${heroInfo.thumbnail}`}
                          alt={heroInfo.name}
                          width={60}
                          height={60}
                          className="rounded"
                        />
                      )
                    })}
                  </div>

                  <ul className="text-sm leading-relaxed space-y-1">
                    <li>Troop Formation: {setup.formation}</li>
                    <li>{setup.suggest}</li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
