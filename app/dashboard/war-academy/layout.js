'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import { HeliosHistoryProvider } from './HeliosHistoryContext'
import HeliosHistoryList from '../../components/HeliosHistoryList'
import { AddAnotherProvider } from '../../dashboard/research/AddAnotherContext'
import PageWrapper from '../../components/PageWrapper'
import WelcomePopup from '../../components/Popup'

export default function HeliosLayout({ children }) {
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  const handleGlobalReset = () => {
    setResetFormTrigger(Date.now())
  }

  return (
    <>
    
      <PageWrapper>
        <HeliosHistoryProvider>
          <AddAnotherProvider>
            <div className="min-h-screen bg-special text-white">
             <main className="flex flex-col items-center w-full">
                <div className="w-full md:max-w-[865px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
                  <div className="px-2 py-10">{children} </div>
                  </div>
                   <Toaster richColors position="bottom-right" />
              </main>
            </div>
          </AddAnotherProvider>
        </HeliosHistoryProvider>
      </PageWrapper>
    </>
  )
}
