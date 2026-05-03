'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const HeliosSkillsHistoryContext = createContext()

const STORAGE_KEY = 'helios-skills-history'

export function HeliosSkillsHistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // LOAD
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

  // SAVE
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
    <HeliosSkillsHistoryContext.Provider
      value={{ history, addToHistory, deleteHistory, resetHistory }}
    >
      {children}
    </HeliosSkillsHistoryContext.Provider>
  )
}

// ✅ FIX DI SINI (pakai nama context yang benar)
export function useHeliosSkillHistory() {
  return useContext(HeliosSkillsHistoryContext)
}
