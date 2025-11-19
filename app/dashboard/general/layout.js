'use client'

import React, { useState } from 'react'
import { Toaster } from 'sonner'
import PageWrapper from '../../components/PageWrapper'


export default function General({ children }) {
  return (
    <>
     
      <PageWrapper>
        <div className="min-h-screen bg-special text-white">
          <main className="flex flex-col items-center w-full">
            <div className="w-full md:max-w-[765px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
            <div className="px-2">{children}</div>
              <Toaster richColors position="bottom-right" />
            </div>            
          </main>

        
        </div>
      </PageWrapper>
    </>
  )
}
