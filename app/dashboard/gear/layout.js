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
        <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          <main className="flex flex-col w-full min-w-0">
            <div className="p-4">
              {children}
              <Toaster richColors position="bottom-right" />
            </div>

            <div className="lg:hidden px-6 sm:px-4 md:px-10 mt-4 mb-5">
              <GearHistoryList />
            </div>
          </main>

          <aside className="hidden lg:block border-l bg-[#1F1F1F] border-zinc-800 p-3">
            <GearHistoryList />
          </aside>
        </div>
      </GearHistoryProvider>
    </PageWrapper>
  </>
  )
}
