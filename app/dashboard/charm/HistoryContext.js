'use client'

import { createContext, useContext, useState } from 'react'

const CharmHistoryContext = createContext()

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  const addToHistory = (entry) => {
    setHistory((prev) => {
      const exists = prev.some(
        (item) => item.from === entry.from && item.to === entry.to
      )
      if (exists) return prev
      return [...prev, { ...entry, id: `${entry.from}->${entry.to}` }]
    })
  }

  const updateHistory = (entry) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.id !== `${entry.from}->${entry.to}`
      )
      return [...filtered, { ...entry, id: `${entry.from}->${entry.to}` }]
    })
  }

  const deleteHistory = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      if (updated.length === 0) setResetFormTrigger(Date.now())
      return updated
    })
  }

  const resetHistory = () => {
    setHistory([])
    setResetFormTrigger(Date.now())
  }

  return (
    <CharmHistoryContext.Provider
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
    </CharmHistoryContext.Provider>
  )
}

export const useCharmHistory = () => useContext(CharmHistoryContext)
