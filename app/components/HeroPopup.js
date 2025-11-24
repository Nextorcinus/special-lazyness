'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroPopup({ skill, onClose }) {
  if (!skill) return null

  return (
    <>
      {/* Desktop popup */}
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
          transition={{ type: 'tween' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-[100px] right-4 text-white text-xl"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-sm uppercase text-green-400 font-medium mb-4">
            {skill.type === 'exploration'
              ? 'Skill Exploration'
              : 'Skill Expedition'}
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={`/icon/${skill.icon}`}
              alt={skill.name}
              width={60}
              height={60}
              className="rounded-md border border-white/20"
            />
            <h3 className="text-lg font-bold">{skill.name}</h3>
          </div>
          <div className="text-sm text-white/80">
            <p className="mb-2">{skill.description}</p>
            <div className="text-white/50 bg-[#100e16] p-4 rounded-lg space-y-2 mt-2">
              <div>
                Effect:{' '}
                <span className="text-white">{skill.effectName || 'None'}</span>
              </div>
              <div>
                Affect on:{' '}
                <span className="text-white">
                  {skill.affectOn?.join(', ') || 'None'}
                </span>
              </div>
              <div>
                Trigger Point:{' '}
                <span className="text-white">
                  {skill.triggerPoint || 'None'}
                </span>
              </div>
              <div>
                Trigger Time:{' '}
                <span className="text-white">
                  {skill.triggerTime || 'None'}
                </span>
              </div>
              <div>
                Stats:{' '}
                <span className="text-white">
                  {skill.stats?.join(', ') || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile popup */}
      <motion.div
        className="md:hidden fixed top-0 left-0 right-0 bottom-0 bg-black/90 backdrop-blur z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div
          className="relative bg-[#1a1a1a] p-6 rounded-lg max-w-xs w-full z-60"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="absolute top-2 right-2 text-white text-xl z-70"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-sm uppercase text-green-400 font-medium mb-1">
            {skill.type === 'exploration'
              ? 'Skill Exploration'
              : 'Skill Expedition'}
          </h2>
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={`/icon/${skill.icon}`}
              alt={skill.name}
              width={48}
              height={48}
              className="rounded-md border border-white/20"
            />
            <h3 className="text-lg font-bold">{skill.name}</h3>
          </div>
          <div className="text-sm text-white/80">
            <p className="mb-2">{skill.description}</p>
            <div className="text-white/50 bg-[#100e16] p-4 rounded-lg space-y-2 mt-2">
              <div>
                Effect:{' '}
                <span className="text-white">{skill.effectName || 'None'}</span>
              </div>
              <div>
                Affect on:{' '}
                <span className="text-white">
                  {skill.affectOn?.join(', ') || 'None'}
                </span>
              </div>
              <div>
                Trigger Point:{' '}
                <span className="text-white">
                  {skill.triggerPoint || 'None'}
                </span>
              </div>
              <div>
                Trigger Time:{' '}
                <span className="text-white">
                  {skill.triggerTime || 'None'}
                </span>
              </div>
              <div>
                Stats:{' '}
                <span className="text-white">
                  {skill.stats?.join(', ') || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
