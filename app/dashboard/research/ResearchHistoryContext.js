'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ResearchHistoryContext = createContext()

export function ResearchHistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('researchHistory')
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        // Sort by timestamp descending (newest first)
        const sortedHistory = parsedHistory.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        setHistory(sortedHistory)
      } catch (error) {
        console.error('Error parsing saved research history:', error)
        localStorage.removeItem('researchHistory')
      }
    }
    setIsLoaded(true)
  }, [])

  // Save history to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded) {
      if (history.length > 0) {
        localStorage.setItem('researchHistory', JSON.stringify(history))
      } else {
        localStorage.removeItem('researchHistory')
      }
    }
  }, [history, isLoaded])

  const addToHistory = (entry) => {
    setHistory((prev) => {
      const exists = prev.some(
        (item) =>
          item.id === entry.id || (
            item.research === entry.research &&
            item.fromLevel === entry.fromLevel &&
            item.toLevel === entry.toLevel
          )
      )
      if (exists) return prev

      const newEntry = {
        ...entry,
        id: entry.id || `${entry.research || entry.name}-${entry.fromLevel}->${entry.toLevel}-${Date.now()}`,
        timestamp: entry.timestamp || Date.now(),
      }

      // Add new entry at the beginning (newest first)
      const newHistory = [newEntry, ...prev]
      
      // Limit history to last 50 entries to prevent localStorage overflow
      return newHistory.slice(0, 50)
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
      value={{ 
        history, 
        addToHistory, 
        deleteHistory, 
        resetHistory,
        isLoaded 
      }}
    >
      {children}
    </ResearchHistoryContext.Provider>
  )
}

export function useResearchHistory() {
  const context = useContext(ResearchHistoryContext)
  if (!context) {
    throw new Error('useResearchHistory must be used within ResearchHistoryProvider')
  }
  return context
}