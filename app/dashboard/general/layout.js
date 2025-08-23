'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import PageWrapper from '../../components/PageWrapper'
import WelcomePopup from '../../components/Popup'

export default function General({ children }) {
  return (
    <>
     
      <PageWrapper>
        <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          <main className="flex flex-col w-full min-w-0">
            <div className="p-4">
              {children}
              <Toaster richColors position="bottom-right" />
            </div>

            {/* Mobile History */}
            <div className="lg:hidden px-6 sm:px-4 md:px-10 mt-4 mb-5"></div>
          </main>

          {/* Desktop History */}
          <aside className="hidden lg:block border-l bg-[#1F1F1F] border-zinc-800 p-3"></aside>
        </div>
      </PageWrapper>
    </>
  )
}
