// ✅ layout.js
'use client'

import React from 'react'
import { useState } from 'react'
import { GearHistoryProvider } from './GearContext'
import GearHistoryList from '../../components/GearHistoryList'
import PageWrapper from '../../components/PageWrapper'
import { Toaster } from 'sonner'
import WelcomePopup from '../../components/Popup'

export default function GearLayout({ children }) {
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  const handleGlobalReset = () => {
    console.log('[LAYOUT] 🔁 handleGlobalReset dipanggil')
    setResetFormTrigger(Date.now())
  }

  return (
  <>
 
    <PageWrapper>
      <GearHistoryProvider>
        <div className="min-h-screen bg-special text-white">
          <main className="flex flex-col items-center w-full">
            <div className="w-full max-w-[1200px] px-4 md:px-6 lg:px-8">
            <div className="px-2 py-10">
              {children}
              <Toaster richColors position="bottom-right" />
            </div>
            </div>
            </main>
        </div>
      </GearHistoryProvider>
    </PageWrapper>
  </>
  )
}
