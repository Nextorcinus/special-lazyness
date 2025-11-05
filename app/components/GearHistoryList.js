'use client'

import React from 'react'
import { Card, CardHeader, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useGearHistory } from '../dashboard/gear/GearContext'
import { toast } from 'sonner'

export default function GearHistoryList({ onResetGlobal }) {
  const { history, deleteHistory, resetHistory } = useGearHistory()

  const handleReset = () => {
    resetHistory()
    toast.success('All history has been reset.')
    if (onResetGlobal) onResetGlobal()
  }

  return (
    <Card className="bg-special-inside text-white mt-10 border border-neutral-700">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2">
        <h3 className="text-lg">Gear Upgrade History</h3>
        <Button
          className="buttonGlass hover:bg-red-500  text-white px-2 py-0 rounded"
          onClick={handleReset}
        >
          Reset
        </Button>
      </CardHeader>

      <CardContent className="space-y-2 px-4 pb-4">
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No history yet.</p>
        ) : (
          history.map((entry) => (
            <div
              key={entry.id}
              className="flex justify-between items-center special-glass rounded px-4 py-3"
            >
              <div>
                
                <div className="text-sm font-semibold">{entry.type}</div>
                <div className="text-xs text-white mt-1">
                  {entry.from} → {entry.to}
                </div>
              </div>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                onClick={() => {
                  deleteHistory(entry.id)
                  toast.success(`History ${entry.type} has been deleted.`)

                 
                  if (history.length === 1 && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('gear:forceReset'))
                  }
                }}
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
