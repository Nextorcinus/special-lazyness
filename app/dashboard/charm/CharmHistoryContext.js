'use client'

import { createContext, useContext, useState } from 'react'

const CharmHistoryContext = createContext()

export const CharmHistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([])
  const [resetFormTrigger, setResetFormTrigger] = useState(0)
  const [resetGearPairs, setResetGearPairs] = useState([])

  const updateHistory = (entry) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => !(item.gear === entry.gear && item.index === entry.index)
      )
      return [...filtered, { ...entry, id: `${entry.gear}-${entry.index}` }]
    })
  }

  const deleteHistory = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      const deleted = prev.find((item) => item.id === id)

      if (deleted) {
        setResetGearPairs((prevReset) => [
          ...prevReset,
          { part: deleted.gear, index: deleted.index },
        ])
      }

      return updated
    })

    // Do not trigger resetFormTrigger anymore here
  }

  const resetHistory = () => {
    setHistory([])
    setResetFormTrigger((prev) => prev + 1)
  }

  const consumeResetGearPair = (part, index) => {
    setResetGearPairs((prev) =>
      prev.filter((item) => !(item.part === part && item.index === index))
    )
  }

  return (
    <CharmHistoryContext.Provider
      value={{
        history,
        updateHistory,
        deleteHistory,
        resetHistory,
        resetFormTrigger,
        resetGearPairs,
        consumeResetGearPair,
      }}
    >
      {children}
    </CharmHistoryContext.Provider>
  )
}

export const useCharmHistory = () => {
  const context = useContext(CharmHistoryContext)
  if (!context) {
    throw new Error('useCharmHistory must be used within CharmHistoryProvider')
  }
  return context
}
