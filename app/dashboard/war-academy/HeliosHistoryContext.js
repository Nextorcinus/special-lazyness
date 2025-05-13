'use client'

import { createContext, useContext, useState } from 'react'

const HeliosHistoryContext = createContext()

export function HeliosHistoryProvider({ children }) {
  const [history, setHistory] = useState([])

  const addToHistory = (entry) => {
    setHistory((prev) => [entry, ...prev])
  }

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const resetHistory = () => {
    setHistory([])
  }

  return (
    <HeliosHistoryContext.Provider
      value={{ history, addToHistory, deleteHistory, resetHistory }}
    >
      {children}
    </HeliosHistoryContext.Provider>
  )
}

export function useHeliosHistory() {
  return useContext(HeliosHistoryContext)
}
