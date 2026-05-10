'use client'

import React from 'react'

import { Card, CardHeader, CardContent } from './ui/card'

import { Button } from './ui/button'

import { toast } from 'sonner'

import { useHeliosSkillHistory } from '../dashboard/war-academy/T12-skills/HeliosSkillsHistoryContext'

import { useAddAnother } from '../dashboard/research/AddAnotherContext'

export default function HeliosSkillHistoryList() {
  const { history, deleteHistory, resetHistory } = useHeliosSkillHistory()

  const { addAnother } = useAddAnother()

  // ================= RESET =================

  const handleReset = () => {
    resetHistory()

    toast.success('All helios history has been reset.')
  }

  return (
    <Card className="bg-special-inside text-white mt-10 border border-neutral-700">
      {/* HEADER */}

      <CardHeader className="flex flex-row items-center justify-between px-4 py-3">
        <h3 className="text-lg lg:text-xl">Helios Skill History</h3>

        <Button
          className="buttonGlass text-white px-3 rounded"
          onClick={handleReset}
        >
          Reset
        </Button>
      </CardHeader>

      {/* CONTENT */}

      <CardContent className="space-y-3 px-4 pb-4">
        {history.length === 0 ? (
          <p className="text-sm text-gray-400">No history yet.</p>
        ) : (
          <>
            {history.map((entry) => {
              const skill = entry?.skills?.[0] || {}

              return (
                <div
                  key={entry.id}
                  className="special-glass rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  {/* LEFT */}

                  <div className="space-y-1">
                    <div className="text-lg text-white font-semibold">
                      {skill?.name || 'Unknown Skill'}
                    </div>

                    <div className="text-sm text-yellow-300">
                      {entry?.unit} • {entry?.selectedSubcategory}
                    </div>

                    <div className="text-sm text-white/80">
                      Level {skill?.fromLevel ?? 0} → {skill?.toLevel ?? 0}
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="flex items-center gap-2">
                    <Button
                      className="button text-white px-3 rounded"
                      onClick={() => {
                        deleteHistory(entry.id)

                        toast.success(`"${skill?.name}" deleted.`)
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              )
            })}

            {/* ADD ANOTHER */}

            <div className="pt-3 flex justify-center">
              <Button
                onClick={addAnother}
                className="w-max buttonGlass text-white px-4 rounded"
              >
                + Unlock Other
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
