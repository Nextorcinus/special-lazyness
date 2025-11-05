'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const CharmHistoryContext = createContext()

export function CharmHistoryProvider({ children }) {
  const [history, setHistory] = useState([])

  // 🔁 Load dari localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('charmHistory')
      if (saved) {
        try {
          setHistory(JSON.parse(saved))
        } catch (err) {
          console.error('Error parsing charm history:', err)
          localStorage.removeItem('charmHistory')
        }
      }
    }
  }, [])

  // 💾 Simpan ke localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (history.length > 0) {
        localStorage.setItem('charmHistory', JSON.stringify(history))
      } else {
        localStorage.removeItem('charmHistory')
      }
    }
  }, [history])

  const addHistory = (entry) => {
    setHistory((prev) => [...prev, entry])
  }

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const resetHistory = () => {
    setHistory([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('charmHistory')
    }
  }

  return (
    <CharmHistoryContext.Provider
      value={{ history, addHistory, deleteHistory, resetHistory }}
    >
      {children}
    </CharmHistoryContext.Provider>
  )
}

export const useCharmHistory = () => useContext(CharmHistoryContext)
