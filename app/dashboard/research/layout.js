// ✅ layout.js
'use client'

import React from 'react'
import { useState } from 'react'
import { Toaster } from 'sonner'
import { ResearchHistoryProvider } from '../../dashboard/research/ResearchHistoryContext'
import ResearchHistoryList from '../../components/ResearhHistoryList'
import { AddAnotherProvider } from '../../dashboard/research/AddAnotherContext'
import PageWrapper from '../../components/PageWrapper'
import WelcomePopup from '../../components/Popup'

export default function ResearchLayout({ children }) {
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  const handleGlobalReset = () => {
    console.log('[LAYOUT] 🔁 handleGlobalReset dipanggil')
    setResetFormTrigger(Date.now())
  }

  return (
    <>
     
    <PageWrapper>
    <ResearchHistoryProvider>
      <AddAnotherProvider>
        {' '}
        {/* ⬅️ Tambahkan ini */}
        <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          <main className="flex flex-col w-full min-w-0">
            <div className="p-4">
              {children}
              <Toaster richColors position="bottom-right" />
            </div>

            {/* Mobile History */}
            <div className="lg:hidden px-6 sm:px-4 md:px-10 mt-4 mb-5">
              <ResearchHistoryList />
            </div>
          </main>

          {/* Desktop History */}
          <aside className="hidden lg:block border-l bg-[#1F1F1F] border-zinc-800 p-3">
            <ResearchHistoryList />
          </aside>
        </div>
      </AddAnotherProvider>
    </ResearchHistoryProvider>
    </PageWrapper>
  </>
  )
}
