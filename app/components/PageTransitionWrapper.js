'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const NUM_COLUMNS = 3
const COLUMN_COLOR = '#147883'

export default function PageTransitionWrapper({ children }) {
  const pathname = usePathname()
  const [active, setActive] = useState(false)

  useEffect(() => {
    setActive(true)
    const timeout = setTimeout(() => setActive(false), 380)
    return () => clearTimeout(timeout)
  }, [pathname])

  return (
    <div className="relative overflow-hidden w-full h-full">

      <AnimatePresence>
        {active && (
          <motion.div
            key="overlay"
            className="absolute inset-0 z-50 flex"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {[...Array(NUM_COLUMNS)].map((_, i) => (
              <motion.div
                key={i}
                className="flex-1"
                style={{ backgroundColor: COLUMN_COLOR }}
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                exit={{ y: '110%' }}
                transition={{
                  delay: i * 0.045,
                  duration: 0.33,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: active ? 0 : 1,
          y: active ? 20 : 0
        }}
        transition={{
          duration: 0.32,
          ease: [0.25, 0.1, 0.25, 1]
        }}
        className="relative z-0"
      >
        {children}
      </motion.div>

    </div>
  )
}
