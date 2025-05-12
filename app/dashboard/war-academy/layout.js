'use client'

import { cloneElement, useState } from 'react'
import { ResearchHistoryProvider } from '../../dashboard/research/ResearchHistoryContext'
import { AddAnotherProvider } from '../../dashboard/research/AddAnotherContext'
import ResearchHistoryList from '../../components/ResearhHistoryList'

export default function HeliosLayout({ children }) {
  const [addAnotherTrigger, setAddAnotherTrigger] = useState(0)

  const handleAddAnother = () => {
    setAddAnotherTrigger(Date.now())
  }

  return (
    <ResearchHistoryProvider>
      <AddAnotherProvider onAdd={handleAddAnother}>
        <div className="min-h-screen bg-special text-white grid grid-cols-1 lg:grid-cols-[1fr_320px]">
          <main className="flex flex-col w-full">
            <div className="p-4">
              {cloneElement(children, { addAnotherTrigger })}
            </div>

            {/* Mobile HistoryList */}
            <div className="lg:hidden px-4 mt-4">
              <ResearchHistoryList onAdd={handleAddAnother} />
            </div>
          </main>

          {/* Desktop HistoryList */}
          <aside className="hidden lg:block border-l border-zinc-800 p-4">
            <ResearchHistoryList onAdd={handleAddAnother} />
          </aside>
        </div>
      </AddAnotherProvider>
    </ResearchHistoryProvider>
  )
}
