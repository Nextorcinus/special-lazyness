'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const HistoryContext = createContext()

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('buildingHistory')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('buildingHistory', JSON.stringify(history))
  }, [history])

  const addHistory = (entry) => {
    setHistory((prev) => [...prev, entry])
  }

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const resetHistory = () => {
    setHistory([])
    localStorage.removeItem('buildingHistory')
  }

  return (
    <HistoryContext.Provider
      value={{ history, addHistory, deleteHistory, resetHistory }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => useContext(HistoryContext)
