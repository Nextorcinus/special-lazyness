'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const HeliosDuaBelasHistoryContext = createContext()

const STORAGE_KEY = 'helios-duabelas-history'

export function HeliosDuaBelasHistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // ✅ LOAD dulu
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (stored) {
        const parsed = JSON.parse(stored)

        if (Array.isArray(parsed)) {
          const cleaned = parsed.map((item) => ({
            ...item,
            category: item.category ?? null,
          }))
          setHistory(cleaned)
        }
      }
    } catch (e) {
      console.warn('Failed to load history:', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // ✅ SAVE hanya setelah load selesai
  useEffect(() => {
    if (!isLoaded) return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch (e) {
      console.warn('Failed to save history:', e)
    }
  }, [history, isLoaded])

  const addToHistory = (entry) => {
    setHistory((prev) => [entry, ...prev])
  }

  const deleteHistory = (id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const resetHistory = () => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <HeliosDuaBelasHistoryContext.Provider
      value={{ history, addToHistory, deleteHistory, resetHistory }}
    >
      {children}
    </HeliosDuaBelasHistoryContext.Provider>
  )
}

export function useHeliosDuaBelasHistory() {
  return useContext(HeliosDuaBelasHistoryContext)
}
