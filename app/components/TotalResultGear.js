'use client'

import React, { useMemo } from 'react'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import ResourceIcon from './ResourceIcon'
import materialDataRaw from '../data/MaterialDataGear.json'

const materialData = materialDataRaw.data || []

export default function TotalResultGear({ results = [] }) {
  
  const totalAll = useMemo(() => {
    const total = {
      plans: 0,
      polish: 0,
      alloy: 0,
      amber: 0,
      svs: 0,
    }

    results.forEach((res) => {
      const gearData = materialData.filter(
        (item) => item.Type.toLowerCase() === res.type.toLowerCase()
      )

      const levels = gearData.map((item) => item.Level)
      const fromIndex = levels.indexOf(res.from)
      const toIndex = levels.indexOf(res.to)
      if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return

      for (let i = fromIndex + 1; i <= toIndex; i++) {
        const data = gearData[i]
        if (!data) continue
        total.plans += parseInt(data.Plans) || 0
        total.polish += parseInt(data.Polish) || 0
        total.alloy += parseInt(data.Alloy) || 0
        total.amber += parseInt(data.Amber) || 0
        total.svs += parseInt(data['SvS Points']) || 0
      }
    })

    return total
  }, [results])

  if (results.length === 0) return null

  return (
    <div className="bg-special-inside-green border border-zinc-900 p-4 rounded-xl mt-6 space-y-4 py-6">
      <h3 className="text-lg lg:text-xl mb-2 text-[#d1e635]">Total Gear Upgrade Materials</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {[
          { key: 'plans', label: 'Design Plans' },
          { key: 'polish', label: 'Polish' },
          { key: 'alloy', label: 'Alloy' },
          { key: 'amber', label: 'Amber' },
          { key: 'svs', label: 'SvS Points', color: '#FFDB98' },
        ].map(({ key, label, color }) => (
          <div
            key={key}
            className="special-glass p-3 rounded-xl flex flex-col items-center"
          >
            <ResourceIcon type={key} />
            <p className="text-sm text-white mt-1">{label}</p>
            <p
              className="text-lg font-semibold"
              style={{ color: color || '#FFFFFF' }}
            >
              {formatToShortNumber(totalAll[key])}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
