'use client'

import React from 'react'
import { Card, CardHeader, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useHeliosHistory } from '../dashboard/war-academy/HeliosHistoryContext'
import { useAddAnother } from '../dashboard/research/AddAnotherContext'
import { toast } from 'sonner'

export default function HeliosHistoryList() {
  const { history, deleteHistory, resetHistory } = useHeliosHistory()
  const { addAnother } = useAddAnother()

  const handleReset = () => {
    resetHistory()
    toast.success('All helios history has been reset.')
  }

  return (
    <Card className="bg-special-inside text-white mt-10 border border-neutral-700">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
        <h3 className="text-lg">Helios Research History</h3>
        <Button
          className="bg-slate-500 hover:bg-red-500 text-white px-2 py-0 rounded"
          onClick={handleReset}
        >
          Reset
        </Button>
      </CardHeader>

      <CardContent className="space-y-2 px-4 pb-4">
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No history yet.</p>
        ) : (
          <>
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center bg-zinc-800 rounded px-4 py-3"
              >
                <div>
                  <div className="text-sm">{entry.building}</div>
                  <div className="text-xs text-zinc-400 p-0 mt-2">
                    {entry.fromLevel} → {entry.toLevel}
                  </div>
                </div>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-2 rounded"
                  onClick={() => {
                    deleteHistory(entry.id)
                    toast.success(`History "${entry.building}" deleted.`)
                  }}
                >
                  Delete
                </Button>
              </div>
            ))}

            <div className="pt-2 text-center">
              <Button
                onClick={addAnother}
                className="w-max bg-zinc-700 hover:bg-green-700 text-white px-4 rounded"
              >
                + Add Another Research
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
