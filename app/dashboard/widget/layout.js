'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import PageWrapper from '../../components/PageWrapper'
import WelcomePopup from '../../components/Popup'


export default function Widget({ children }) {
  return (
    <>
     
      <WelcomePopup />
      <PageWrapper>
        <div className="min-h-screen bg-special text-white">
          <main className="flex flex-col items-center w-full">
            <div className="w-full max-w-[1200px] px-4 md:px-6 lg:px-8">
            <div className="px-2">
              {children}
              <Toaster richColors position="bottom-right" />
            </div>
            </div>
          
          </main>

          
        </div>
      </PageWrapper>
    </>
  )
}
