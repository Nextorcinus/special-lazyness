// ✅ layout.js
'use client'

import React from 'react'
import { useState } from 'react'
import PageWrapper from '../../components/PageWrapper'
import { Toaster } from 'sonner'
import WelcomePopup from '../../components/Popup'

export default function StateLayout({ children }) {
  
  return (
  <>
    
    <PageWrapper>

        <div className="min-h-screen bg-special text-white">
          <main className="flex flex-col items-center w-full">
            <div className="w-full max-w-[1200px] px-4 md:px-6 lg:px-8">
            <div className="p-4">
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
