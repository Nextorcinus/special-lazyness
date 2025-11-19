'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const NUM_COLUMNS = 3

export default function PageTransitionWrapper({ children }) {
  const pathname = usePathname()
  const [active, setActive] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false)
      return
    }

    setActive(true)
    const t = setTimeout(() => setActive(false), 500)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div className="relative overflow-hidden w-full h-full">

      {/* Spotify overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            key="overlay"
            className="absolute inset-0 z-50 flex"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background:
                'linear-gradient(135deg, rgba(29,185,84,0.35), rgba(80,55,151,0.35))',
              backdropFilter: 'blur(22px)'
            }}
          >
            {[...Array(NUM_COLUMNS)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1"
                initial={{ y: '120%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(0,0,0,0.12))',
                  
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-0"
      >
        {children}
      </motion.div>
    </div>
  )
}
