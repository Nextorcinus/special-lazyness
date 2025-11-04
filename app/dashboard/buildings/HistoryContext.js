'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const HistoryContext = createContext()

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState([])

  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('buildingHistory')
      if (saved) {
        try {
          setHistory(JSON.parse(saved))
        } catch (err) {
          console.error('Error parsing history:', err)
          localStorage.removeItem('buildingHistory')
        }
      }
    }
  }, [])

  // Simpan data ke localStorage 
 useEffect(() => {
  if (typeof window !== 'undefined') {
    if (history.length > 0) {
      localStorage.setItem('buildingHistory', JSON.stringify(history))
    } else {
      localStorage.removeItem('buildingHistory')
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
      localStorage.removeItem('buildingHistory')
    }
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
