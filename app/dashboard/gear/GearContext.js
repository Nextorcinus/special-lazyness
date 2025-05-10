'use client'

import { createContext, useContext, useState } from 'react'

const GearHistoryContext = createContext()

export function GearHistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  const addToHistory = (entry) => {
    setHistory((prev) => {
      const exists = prev.some(
        (item) =>
          item.gear === entry.gear &&
          item.from === entry.from &&
          item.to === entry.to
      )
      if (exists) return prev

      return [
        ...prev,
        { ...entry, id: `${entry.gear}-${entry.from}->${entry.to}` },
      ]
    })
  }

  const updateHistory = (entry) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.gear !== entry.gear)
      return [
        ...filtered,
        { ...entry, id: `${entry.gear}-${entry.from}->${entry.to}` },
      ]
    })
  }

  const deleteHistory = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      if (updated.length === 0) {
        setResetFormTrigger(Date.now()) // 💥 trigger global reset jika sudah kosong
      }
      return updated
    })
  }

  const resetHistory = () => {
    setHistory([])
    setResetFormTrigger(Date.now()) // ⬅️ inilah trigger global reset
  }

  return (
    <GearHistoryContext.Provider
      value={{
        history,
        addToHistory,
        updateHistory,
        deleteHistory,
        resetHistory,
        resetFormTrigger,
      }}
    >
      {children}
    </GearHistoryContext.Provider>
  )
}

export const useGearHistory = () => useContext(GearHistoryContext)
