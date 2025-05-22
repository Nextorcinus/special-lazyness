'use client'

import { Toaster } from 'sonner'
import PageWrapper from '@/components/PageWrapper'

export default function FoundryLayout({ children }) {
  return (
    <PageWrapper>
      {children}
      <Toaster richColors position="bottom-right" />
    </PageWrapper>
  )
}
