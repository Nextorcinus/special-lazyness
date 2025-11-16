'use client'

import { useEffect, useState } from 'react'
import PlayerProfile from './PlayerProfile'
import { X } from 'lucide-react'

export default function FloatingCreatorButton() {
  const [open, setOpen] = useState(false)

  // Safeguard: kunci overflow-x agar tidak muncul scrollbar horizontal
  useEffect(() => {
    const prev = document.documentElement.style.overflowX
    document.documentElement.style.overflowX = 'hidden'
    return () => {
      document.documentElement.style.overflowX = prev
    }
  }, [])

  return (
    <>
      {/* Tombol Open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="
            fixed right-0 top-1/2 -translate-y-1/2
            text-white text-sm
            bg-teal-400/20 hover:bg-teal-700 
            px-2 py-2 rounded-l-xl
            backdrop-blur-md shadow-lg
            z-50 cursor-pointer
            overflow-hidden
          "
          style={{ writingMode: 'vertical-rl' }}
        >
          <span className="shimmer block">
            <span
              style={{
                transform: 'rotate(180deg)',
                display: 'inline-block',
              }}
            >
              © created by Special One
            </span>
          </span>
        </button>
      )}

      {/* CLICK ANYWHERE TO CLOSE */}
      {open && (
        <div>
          {/* Overlay transparan */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40"
            style={{ background: 'transparent' }}
          />

          {/* Card */}
          <div
            aria-modal="true"
            role="dialog"
            className="
              fixed top-1/2 right-0 -translate-y-1/2
              z-50
            "
            style={{ width: '260px' }}
          >
            <div
              className="
                bg-special-inside text-white shadow-2xl border border-zinc-700
                rounded-l-2xl p-4
                transition-all duration-200
              "
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-semibold">Developer</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded hover:bg-zinc-700"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[70vh] overflow-y-auto pr-1">
                <PlayerProfile playerId="155426370" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
