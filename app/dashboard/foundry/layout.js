'use client'

import PageWrapper from '../../components/PageWrapper'
import { FoundryProvider } from './FoundryContext'

export default function FoundryLayout({ children }) {
  return (
    <FoundryProvider>
      <PageWrapper>
        <div className="min-h-screen bg-special text-white">
          <main className="flex flex-col items-center w-full">
            <div className="w-full md:max-w-[765px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
              <div className="px-2 py-10">
                {children}
              </div>
            </div>
          </main>
        </div>
      </PageWrapper>
    </FoundryProvider>
  )
}