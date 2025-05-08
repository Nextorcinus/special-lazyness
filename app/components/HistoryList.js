'use client'

import React from 'react'
import { Card, CardHeader, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useHistory } from '../dashboard/buildings/HistoryContext'
import { useAddAnother } from '../dashboard/buildings/AddAnotherContext'

export default function HistoryList() {
  const { history, deleteHistory, resetHistory } = useHistory()
  const { addAnother } = useAddAnother()

  return (
    <Card className="bg-special-inside text-white mt-10 border border-neutral-700">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
        <h3 className="text-lg">History Building</h3>
        <Button
          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
          onClick={resetHistory}
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
                  <div className="font-semibold text-sm">{entry.building}</div>
                  <div className="text-xs text-gray-300 p-2">
                    {entry.fromLevel} → {entry.toLevel}
                  </div>
                </div>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-2  rounded"
                  onClick={() => deleteHistory(entry.id)}
                >
                  Delete
                </Button>
              </div>
            ))}

            <div className="pt-2 text-center">
              <Button
                size="sm"
                variant="default"
                onClick={addAnother}
                className="w-full"
              >
                + Add Another Building
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
