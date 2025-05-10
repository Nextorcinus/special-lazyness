// ✅ layout.js
'use client'

import { useState } from 'react'
import { GearHistoryProvider } from './GearContext'
import GearHistoryList from '@/components/GearHistoryList'

export default function GearLayout({ children }) {
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  const handleGlobalReset = () => {
    setResetFormTrigger(Date.now()) // trigger baru
  }

  return (
    <GearHistoryProvider>
      <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        <main className="flex flex-col w-full min-w-0">
          <div className="p-4">
            {/* kirim prop resetFormTrigger ke page */}
            {children &&
              typeof children === 'object' &&
              'type' in children &&
              children.type && (
                <children.type
                  {...children.props}
                  resetFormTrigger={resetFormTrigger}
                />
              )}
          </div>

          <div className="lg:hidden px-6 sm:px-4 md:px-10 mt-4 mb-5">
            <GearHistoryList onResetGlobal={handleGlobalReset} />
          </div>
        </main>

        <aside className="hidden lg:block border-l bg-[#1F1F1F] border-zinc-800 p-3">
          <GearHistoryList onResetGlobal={handleGlobalReset} />
        </aside>
      </div>
    </GearHistoryProvider>
  )
}
