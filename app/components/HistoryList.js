'use client'

import React from 'react'

function HistoryList({ history, onAdd, onDelete, onReset }) {
  return (
    <div className="bg-gray-800 text-white rounded-xl p-4 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">History Building</h3>
        <button
          onClick={onReset}
          className="bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>
      {history.length === 0 && (
        <p className="text-sm text-gray-400">No history yet.</p>
      )}
      {history.map((entry, idx) => (
        <div
          key={entry.id}
          className="flex justify-between items-center bg-gray-700 rounded p-3 mb-2"
        >
          <div>
            <div className="font-bold text-sm">{entry.building}</div>
            <div className="text-xs text-gray-300">
              {entry.fromLevel} → {entry.toLevel}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAdd(entry)}
              className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
            >
              + Add Another
            </button>
            <button
              onClick={() => onDelete(entry.id)}
              className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HistoryList
