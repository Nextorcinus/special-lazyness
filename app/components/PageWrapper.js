'use client'

import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const NUM_COLUMNS = 5
const COLUMN_COLOR = '#262626'

export default function PageTransitionWrapper({ children }) {
  const pathname = usePathname()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    setIsTransitioning(true)
    setShowContent(false)

    const enterTimeout = setTimeout(() => {
      setIsTransitioning(false)
      setShowContent(true)
    }, 500)

    return () => {
      clearTimeout(enterTimeout)
    }
  }, [pathname])

  return (
    <div className="relative overflow-hidden w-full h-full">
      {isTransitioning && (
        <div className="absolute inset-0 z-50 flex">
          {[...Array(NUM_COLUMNS)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1"
              style={{ backgroundColor: COLUMN_COLOR }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                delay: i * 0.07,
                duration: 0.45,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {showContent && (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="relative z-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
