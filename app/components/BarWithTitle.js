'use client'

import { motion } from 'framer-motion'

export default function BarWithTitle({ label, value, max, isPercent }) {
  const percent = Math.min((value / max) * 100, 100)
  const val = isPercent ? `${value}%` : value

  return (
    <div className="mb-3 py-1">
      <div className="w-full h-6 md:h-8  bg-gray-700/40 rounded-full relative overflow-hidden shadow-inner">
        {/* Bar Isi (Animated + Gradient + Rounded) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full absolute top-0 left-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #22c55e, #14b8a6)',
          }}
        />

        {/* Label dan Angka di atas bar */}
        <div className="absolute inset-0 px-3 flex items-center justify-between text-sm leading-none font-semibold text-white z-10 ">
          <span>{label}</span>
          <span>{val}</span>
        </div>
      </div>
    </div>
  )
}
