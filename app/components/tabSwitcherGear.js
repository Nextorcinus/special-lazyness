'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useGearHistory } from '../dashboard/gear/GearContext'
import GearHistoryList from './GearHistoryList'
import GearTable from './GearTable'
import GearProgress from './GearProgress'


export default function TabSwitcherGear({
  results,
  compares,
  onDeleteHistory,
  onResetHistory,
}) {
  const [tab, setTab] = useState('overview')
  const { history } = useGearHistory()


  return (
    <div className="space-y-6">
      {/* === Tab Header === */}
      <div className="flex gap-2 mb-6 border-b border-[#ffffff46]">
        <button
          className={`tab-button ${tab === 'overview' ? 'active' : ''}`}
          onClick={() => setTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${tab === 'history' ? 'active' : ''}`}
          onClick={() => setTab('history')}
        >
          History
        </button>
      </div>

      {/* === TAB: OVERVIEW === */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {results.length === 0 ? (
            <p className="text-gray-400 text-sm">No gear upgrade results yet.</p>
          ) : (
            results.map((res, index) => {
              const compare = compares[index]
              return (
                <div
                  key={res.id}
                  className="bg-special-inside p-6 rounded-xl space-y-4"
                >
                  <div className="flex justify-between items-center border-b border-[#ffffff25] pb-2">
                    <h3 className="text-lg font-semibold">
                      {res.gear} ({res.from} → {res.to})
                    </h3>
                    <Button
                      onClick={() => {
                        onDeleteHistory(res.id)
                        toast.success(`${res.gear} deleted from history.`)
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white text-sm px-3"
                    >
                      Delete
                    </Button>
                  </div>

                  <GearTable data={[res]} compare={compare} />
                  <GearProgress total={res} compare={compare} />
                </div>
              )
            })
          )}
        </div>
      )}

      {/* === TAB: HISTORY === */}
      {tab === 'history' && (
        <GearHistoryList onResetGlobal={onResetHistory} />
      )}
    </div>
  )
}
