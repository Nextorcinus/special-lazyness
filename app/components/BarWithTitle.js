'use client'

import { motion } from 'framer-motion'

export default function BarWithTitle({ label, value, max, isPercent }) {
  const safeValue = Number(value) || 0
  const safeMax = Number(max) || 1

 const percent = isPercent
  ? (safeValue > 1 ? safeValue / 100 : safeValue) * 100
  : (safeValue / safeMax) * 100

  const safePercent = Math.max(0, Math.min(100, percent))

  return (
    <div className="mb-2">
      <div className="flex justify-between mb-1">
        <span>{label}</span>
        <span>{Math.round(safeValue)}</span>
      </div>

      <div className="w-full h-2 bg-white/10 rounded">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safePercent}%` }}
          transition={{ duration: 0.4 }}
          className="h-full bg-green-400 rounded"
        />
      </div>
    </div>
  )
}
