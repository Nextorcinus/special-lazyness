'use client'

import { createContext, useContext, useState } from 'react'

const ResearchHistoryContext = createContext()

export function ResearchHistoryProvider({ children }) {
  const [history, setHistory] = useState([])

  const addToHistory = (entry) => {
    setHistory((prev) => {
      const exists = prev.some(
        (item) =>
          item.building === entry.building &&
          item.fromLevel === entry.fromLevel &&
          item.toLevel === entry.toLevel
      )
      if (exists) return prev

      return [
        ...prev,
        {
          ...entry,
          id: `${entry.building}-${entry.fromLevel}->${entry.toLevel}`,
        },
      ]
    })
  }

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const resetHistory = () => {
    setHistory([])
  }

  return (
    <ResearchHistoryContext.Provider
      value={{ history, addToHistory, deleteHistory, resetHistory }}
    >
      {children}
    </ResearchHistoryContext.Provider>
  )
}

export function useResearchHistory() {
  return useContext(ResearchHistoryContext)
}
