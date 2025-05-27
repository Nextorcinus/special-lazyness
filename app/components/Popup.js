'use client'

import { useEffect, useState } from 'react'
import { useGitVersion } from 'lib/getGitVersion'

export default function WelcomePopup() {
  const [showPopup, setShowPopup] = useState(false)
  const version = useGitVersion()

  useEffect(() => {
    const hasClosed = localStorage.getItem('welcomePopupClosed')
    if (!hasClosed) {
      setShowPopup(true)
    }
  }, [])

  const handleClose = () => {
    setShowPopup(false)
    localStorage.setItem('welcomePopupClosed', 'true')
  }

  if (!showPopup) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 ">
      <div className="bg-zinc-900 p-6 rounded shadow-lg max-w-sm w-full text-white rounded-xl">
        <h2 className="text-lg text-lime-500 mb-2">
          Update App Version.{version}
        </h2>
        <p className="text-sm text-zinc-300 mb-4">
          <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
            <li>Added Hero Widget</li>
            <li>Added Foundry Task Page for R4/R5</li>
            <li>Fixed Stable Charm delete bug</li>
            <li>Improved Chief Charm logic & comparison</li>
            <li>Optimized stability & performance</li>
            <li>Delete now targets selected entry only</li>
          </ul>
        </p>
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
