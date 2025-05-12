'use client'

import React, { useRef } from 'react'
import { Card, CardHeader, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useResearchHistory } from '../dashboard/research/ResearchHistoryContext'
import { useAddAnother } from '../dashboard/research/AddAnotherContext'
import { toast } from 'sonner'

export default function ResearchHistoryList() {
  const { history, deleteHistory, resetHistory } = useResearchHistory()
  const { addAnother } = useAddAnother()

  const topRef = useRef(null)

  const handleReset = () => {
    resetHistory()
    toast.success('All research history has been reset.')
  }

  const handleDelete = (id, name) => {
    deleteHistory(id)
    toast.success(`History ${name} has been deleted.`)
  }

  const handleAddAnother = () => {
    addAnother()

    if (window.innerWidth < 768) {
      const formElement = document.getElementById('research-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <div ref={topRef} />
      <Card className="bg-special-inside text-white mt-10 border border-neutral-700">
        <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
          <h3 className="text-lg">Research History</h3>
          <Button
            className="bg-slate-500 hover:bg-red-500 text-white px-2 py-0 rounded"
            onClick={handleReset}
          >
            Reset
          </Button>
        </CardHeader>

        <CardContent className="space-y-2 px-4 pb-4">
          {history.length === 0 ? (
            <p className="text-sm text-gray-400">No research history yet.</p>
          ) : (
            <>
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center bg-zinc-800 rounded px-4 py-3"
                >
                  <div>
                    <div className="text-sm">{entry.building}</div>
                    <div className="text-xs text-zinc-400 mt-1">
                      {entry.fromLevel} → {entry.toLevel}
                    </div>
                  </div>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white px-2 rounded"
                    onClick={() => handleDelete(entry.id, entry.building)}
                  >
                    Delete
                  </Button>
                </div>
              ))}

              <div className="pt-2 text-center">
                <Button
                  onClick={handleAddAnother}
                  className="w-max bg-zinc-700 hover:bg-green-700 text-white px-4 rounded"
                >
                  + Add Another Research
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  )
}
