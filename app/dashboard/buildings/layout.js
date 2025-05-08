'use client'

import { HistoryProvider } from './HistoryContext'
import { AddAnotherProvider } from './AddAnotherContext'
import HistoryList from '../../components/HistoryList'

export default function BuildingsLayout({ children }) {
  return (
    <HistoryProvider>
      <AddAnotherProvider>
        <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          <main className="flex flex-col w-full min-w-0">
            <div className="p-4">{children}</div>

            {/* Mobile HistoryList */}
            <div className="lg:hidden px-4 mt-4">
              <HistoryList />
            </div>
          </main>

          {/* Desktop HistoryList */}
          <aside className="hidden lg:block border-l bg-[#1F1F1F] border-zinc-800 p-3">
            <HistoryList />
          </aside>
        </div>
      </AddAnotherProvider>
    </HistoryProvider>
  )
}
