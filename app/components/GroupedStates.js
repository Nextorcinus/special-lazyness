// components/GroupedStates.js
'use client'

import groupedStates from '@/data/grouped_state_list.json'

export default function GroupedStates() {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available State IDs</h2>
      <div className="space-y-4">
        {Object.entries(groupedStates).map(([range, ids]) => (
          <div key={range} className="border border-zinc-700 rounded p-4">
            <h3 className="text-zinc-300 font-semibold mb-2">{range}</h3>
            <div className="flex flex-wrap gap-2 text-sm text-zinc-400">
              {ids.map((id) => (
                <span
                  key={id}
                  className="bg-zinc-800 border border-zinc-700 px-2 py-1 rounded"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
