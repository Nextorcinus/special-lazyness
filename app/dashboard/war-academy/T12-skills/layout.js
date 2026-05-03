'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import { HeliosSkillsHistoryProvider } from './HeliosSkillsHistoryContext'

import { AddAnotherProvider } from '../../../dashboard/research/AddAnotherContext'
import PageWrapper from '../../../components/PageWrapper'

export default function HeliosSkillLayout({ children }) {
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  const handleGlobalReset = () => {
    setResetFormTrigger(Date.now())
  }

  console.log({
    PageWrapper,
    HeliosSkillsHistoryProvider,
    AddAnotherProvider,
  })

  return (
    <>
      <PageWrapper>
        <HeliosSkillsHistoryProvider>
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
        </HeliosSkillsHistoryProvider>
      </PageWrapper>
    </>
  )
}
