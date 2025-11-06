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
        <div className="min-h-screen bg-special text-white">
          <main className="flex flex-col items-center w-full">
            <div className="w-full max-w-[1200px] px-4 md:px-6 lg:px-8">
            <div className="p-4">
              {children}
              </div>
              <Toaster richColors position="bottom-right" />
            </div>
          </main>        
        </div>
      </AddAnotherProvider>
    </ResearchHistoryProvider>
    </PageWrapper>
  </>
  )
}
