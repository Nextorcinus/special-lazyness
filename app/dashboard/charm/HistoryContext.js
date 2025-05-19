'use client'

import { createContext, useContext, useState } from 'react'

const CharmHistoryContext = createContext()

export const CharmHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([])
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  const updateHistory = (entry) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => !(item.gear === entry.gear && item.index === entry.index)
      )
      return [...filtered, { ...entry, id: `${entry.gear}-${entry.index}` }]
    })
  }

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
    setResetFormTrigger((prev) => prev + 1)
  }

  const resetHistory = () => {
    setHistory([])
    setResetFormTrigger((prev) => prev + 1)
  }

  return (
    <CharmHistoryContext.Provider
      value={{
        history,
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

export const useCharmHistory = () => {
  const context = useContext(CharmHistoryContext)
  if (!context) {
    throw new Error(
      'useCharmHistory must be used within a CharmHistoryProvider'
    )
  }
  return context
}
