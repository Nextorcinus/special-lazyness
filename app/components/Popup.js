'use client'

import { useEffect, useState, useRef } from 'react'
import { useGitVersion } from 'lib/getGitVersion'

export default function WelcomePopup() {
  const [showPopup, setShowPopup] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const version = useGitVersion()

  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    if (typeof window !== 'undefined') {
      const hasClosed = localStorage.getItem('welcomePopupClosed')
      if (hasClosed !== 'true') {
        setShowPopup(true)
      }
      setHasMounted(true)
    }
  }, [])

  const handleClose = () => {
    setShowPopup(false)
    localStorage.setItem('welcomePopupClosed', 'true')
  }

  if (!hasMounted || !showPopup) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-6">
      <div className="bg-zinc-900 border border-zinc-800 p-6 shadow-lg max-w-sm w-full text-white rounded-xl">
        <h2 className="text-lg text-lime-500 mb-2">
          Update App Version.{version}
        </h2>
        <div className="text-sm text-zinc-300 mb-4">
          <ul className="list-disc list-inside space-y-1">
            <li>Added Calc Points for SvS, KoI etc</li>
            <li>Renew data from state 1000-3148 State Age</li>
            <li>Added New Hero Widget Gen 8</li>
            <li>Update Academy Dawn (Experts)</li>
          </ul>
        </div>
        <button
          onClick={handleClose}
          className="bg-lime-600 hover:bg-lime-700 px-4 py-2 text-white rounded"
        >
          Got it!
        </button>
      </div>
    </div>
  )
}
