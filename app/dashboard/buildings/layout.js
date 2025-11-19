'use client'

import { HistoryProvider } from './HistoryContext'
import { AddAnotherProvider } from './AddAnotherContext'

import { Toaster } from 'sonner'
import PageWrapper from '../../components/PageWrapper'


export default function BuildingsLayout({ children }) {
  return (
    <>
      <PageWrapper>
        <HistoryProvider>
          <AddAnotherProvider>
            <div className="min-h-screen bg-special text-white">
              <main className="flex flex-col items-center w-full">
                <div className="w-full md:max-w-[865px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
                  <div className="px-2 py-10">{children}</div>
                </div>

                <Toaster richColors position="bottom-right" />
              </main>
            </div>
          </AddAnotherProvider>
        </HistoryProvider>
      </PageWrapper>
    </>
  )
}
