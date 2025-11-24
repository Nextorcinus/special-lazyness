// app/components/PassivePopup.js
'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function PassivePopup({ passive, onClose }) {
  if (!passive) return null

  return (
    <>
      {/* Desktop View */}
      <motion.div
        className="hidden md:block fixed inset-0 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="absolute right-0 top-0 h-full w-80 bg-[#1F1C2E] bg-opacity-60 backdrop-blur-sm text-white pt-[100px] px-6 pb-6 border-l border-[#4E4E4E]"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-[100px] right-4 text-white text-xl"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-sm uppercase text-green-400 font-medium mb-4">
            Unique Passive
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={`/icon/${passive.icon}.png`}
              alt={passive.name}
              width={60}
              height={60}
              className="rounded-md border border-white/20"
            />
            <h3 className="text-lg font-bold">{passive.name}</h3>
          </div>
          <div className="text-sm text-white/80">
            <p className="mb-2">{passive.ability}</p>
            {Array.isArray(passive.stats) && (
              <p className="text-white/60">Stats: <span className='text-white'>{passive.stats.join(', ')}
              </span></p>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile View */}
      <motion.div
        className="md:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div
          className="relative bg-[#1a1a1a] p-6 rounded-lg max-w-xs w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-white text-xl"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-sm uppercase text-green-400 font-medium mb-1">
            Unique Passive
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={`/icon/${passive.icon}.png`}
              alt={passive.name}
              width={48}
              height={48}
              className="rounded-md border border-white/20"
            />
            <h3 className="text-lg font-bold">{passive.name}</h3>
          </div>
          <div className="text-sm text-white/80">
            <p className="mb-2">{passive.ability}</p>
            {Array.isArray(passive.stats) && (
              <p className="text-white/60">Stats: {passive.stats.join(', ')}</p>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}
