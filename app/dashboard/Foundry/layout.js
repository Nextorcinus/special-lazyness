'use client'

import { Toaster } from 'sonner'
import PageWrapper from '@/components/PageWrapper'
import WelcomePopup from '@/components/Popup'

export default function FoundryLayout({ children }) {
  return (
    <>
      <WelcomePopup />
      <PageWrapper>
        {children}
        <Toaster richColors position="bottom-right" />
      </PageWrapper>
    </>
  )
}
