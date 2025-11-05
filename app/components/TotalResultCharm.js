'use client'

import React, { useMemo } from 'react'
import { formatToShortNumber } from '../utils/formatToShortNumber'
import ResourceIcon from './ResourceIcon'

export default function TotalResultCharm({ results = [] }) {
  // 💡 Hitung total seluruh hasil
  const totalResources = useMemo(() => {
    const total = { guide: 0, design: 0, jewel: 0, svs: 0 }

    results.forEach((res) => {
      if (!res?.total) return
      total.guide += res.total.guide || 0
      total.design += res.total.design || 0
      total.jewel += res.total.jewel || 0
      total.svs += res.total.svs || 0
    })

    return total
  }, [results])

  // Tidak tampil jika belum ada hasil
  if (!results.length) return null

  return (
    <div className="bg-special-inside-green border border-[#ffffff26] mt-8 rounded-xl p-6 space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Total Resource Summary
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-center">
        {/* === Guide === */}
        <div className="special-glass p-3 rounded-xl flex flex-col items-center">
          <ResourceIcon type="guide" />
          <p className="text-sm text-white mt-1">Guides</p>
          <p className="text-lg font-semibold text-white">
            {formatToShortNumber(totalResources.guide)}
          </p>
        </div>

        {/* === Design === */}
        <div className="special-glass p-3 rounded-xl flex flex-col items-center">
          <ResourceIcon type="design" />
          <p className="text-sm text-white mt-1">Designs</p>
          <p className="text-lg font-semibold text-white">
            {formatToShortNumber(totalResources.design)}
          </p>
        </div>

        {/* === Jewel === */}
        <div className="special-glass p-3 rounded-xl flex flex-col items-center">
          <ResourceIcon type="jewel" />
          <p className="text-sm text-white mt-1">Secrets</p>
          <p className="text-lg font-semibold text-white">
            {formatToShortNumber(totalResources.jewel)}
          </p>
        </div>

        {/* === SvS Points === */}
        <div className="special-glass bg-[#9797974A] border border-[#ffffff1c] px-4 py-2 rounded-lg mb-1 flex flex-col items-center">
          <span className="block text-white text-base mb-1">SvS Points:</span>
          <span className="block text-white text-lg font-semibold">
            {formatToShortNumber(totalResources.svs)}
          </span>
        </div>
      </div>
    </div>
  )
}
