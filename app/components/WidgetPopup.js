'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function WidgetPopup({ widget, onClose }) {
  if (!widget) return null

  return (
    <>
      {/* Desktop */}
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
            Widget Detail
          </h2>

          {/* Icon + Name */}
          <div className="flex items-center gap-3 mb-3">
            <Image
              src={`/icon/${widget.icon}.png`}
              alt={widget.name}
              width={60}
              height={60}
              className="rounded-md border border-white/20"
            />
            <h3 className="text-lg font-bold">{widget.name}</h3>
          </div>

          <div className="text-sm text-white/80 space-y-1">
            <p className="text-white/60">
              Affect On: <span className="text-white">{widget.affectOn}</span>
            </p>
            <p className="text-white/60">
              Level: <span className="text-white">{widget.level}</span>
            </p>
          </div>

          {widget.stats?.exploration && (
            <div className="mt-4 text-sm">
              <Image
                src={`/icon/${widget.stats.exploration.icon}`}
                alt="exploration icon"
                width={40}
                height={40}
              />
              <h4 className="text-green-400 font-semibold mb-2 mt-2">
                Exploration
              </h4>
              <p className="text-zinc-400">
                Name:
                <span className="text-white">
                  {' '}
                  {widget.stats.exploration.name}
                </span>
              </p>
              <p className="text-zinc-400">
                Attack:
                <span className="text-white">
                  {' '}
                  {widget.stats.exploration.attack}
                </span>
              </p>
              <p className="text-zinc-400">
                Defense:{' '}
                <span className="text-white">
                  {widget.stats.exploration.defense}
                </span>
              </p>
              <p className="text-zinc-400">
                Health:
                <span className="text-white">
                  {' '}
                  {widget.stats.exploration.health}
                </span>
              </p>
              {widget.stats.exploration.ability && (
                <p className="text-white/80 mt-2 ">
                  {widget.stats.exploration.ability}
                </p>
              )}
            </div>
          )}

          {widget.stats?.expedition && (
            <div className="mt-4 text-sm">
              <Image
                src={`/icon/${widget.stats.expedition.icon}`}
                alt="expedition icon"
                width={40}
                height={40}
              />
              <h4 className="text-green-400 font-semibold  mb-2 mt-2">
                Expedition
              </h4>
              <p className="text-zinc-400">
                Name:{' '}
                <span className="text-white">
                  {widget.stats.expedition.name}
                </span>{' '}
              </p>
              <p className="text-zinc-400">
                Lethality:{' '}
                <span className="text-white">
                  {' '}
                  {widget.stats.expedition.lethality}
                </span>
              </p>
              <p className="text-zinc-400">
                Health:{' '}
                <span className="text-white">
                  {' '}
                  {widget.stats.expedition.Health}
                </span>
              </p>
              {widget.stats.expedition.ability && (
                <p className="text-white/80 mt-2">
                  {widget.stats.expedition.ability}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Mobile */}
      <motion.div
        className="md:hidden fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-6"
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
          <h2 className="text-sm uppercase text-green-400 font-medium mb-2">
            Widget Detail
          </h2>

          <div className="flex items-center gap-3 mb-3">
            <Image
              src={`/icon/${widget.icon}.png`}
              alt={widget.name}
              width={48}
              height={48}
              className="rounded-md border border-white/20"
            />
            <h3 className="text-lg font-bold">{widget.name}</h3>
          </div>

          <div className="text-sm text-white/80 space-y-1">
            <p className="text-white/60">
              Affect On: <span className="text-white">{widget.affectOn}</span>
            </p>
            <p className="text-white/60">
              Level: <span className="text-white">{widget.level}</span>
            </p>
          </div>

          {widget.stats?.exploration && (
            <div className="mt-4 text-sm">
              <Image
                src={`/icon/${widget.stats.expedition.icon}`}
                alt="expedition icon"
                width={40}
                height={40}
              />
              <h4 className="text-green-400 font-semibold mb-2 mt-2">
                Exploration
              </h4>
              <p className="text-zinc-400">
                Name:
                <span className="text-white">
                  {' '}
                  {widget.stats.exploration.name}
                </span>
              </p>
              <p className="text-zinc-400">
                Attack:
                <span className="text-white">
                  {' '}
                  {widget.stats.exploration.attack}
                </span>
              </p>
              <p className="text-zinc-400">
                Defense:{' '}
                <span className="text-white">
                  {widget.stats.exploration.defense}
                </span>
              </p>
              <p className="text-zinc-400">
                Health:
                <span className="text-white">
                  {' '}
                  {widget.stats.exploration.health}
                </span>
              </p>
              {widget.stats.exploration.ability && (
                <p className="text-white/80 mt-2 ">
                  {widget.stats.exploration.ability}
                </p>
              )}
            </div>
          )}

          {widget.stats?.expedition && (
            <div className="mt-4 text-sm">
              <Image
                src={`/icon/${widget.stats.expedition.icon}`}
                alt="expedition icon"
                width={40}
                height={40}
              />
              <h4 className="text-green-400 font-semibold  mb-2 mt-2">
                Expedition
              </h4>
              <p className="text-zinc-400">
                Name:{' '}
                <span className="text-white">
                  {widget.stats.expedition.name}
                </span>{' '}
              </p>
              <p className="text-zinc-400">
                Lethality:{' '}
                <span className="text-white">
                  {' '}
                  {widget.stats.expedition.lethality}
                </span>
              </p>
              <p className="text-zinc-400">
                Health:{' '}
                <span className="text-white">
                  {' '}
                  {widget.stats.expedition.Health}
                </span>
              </p>
              {widget.stats.expedition.ability && (
                <p className="text-white/80 mt-2">
                  {widget.stats.expedition.ability}
                </p>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
