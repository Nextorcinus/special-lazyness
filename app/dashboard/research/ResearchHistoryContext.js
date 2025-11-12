'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ResearchHistoryContext = createContext()

export function ResearchHistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('researchHistory')
    console.log('Loading saved history:', savedHistory)
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory)
        console.log('Parsed history:', parsedHistory)
        setHistory(parsedHistory)
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
      console.log('Saving history to localStorage:', history)
      if (history.length > 0) {
        localStorage.setItem('researchHistory', JSON.stringify(history))
      } else {
        localStorage.removeItem('researchHistory')
      }
    }
  }, [history, isLoaded])

 const addToHistory = (entry) => {
  console.log('Adding to history:', entry)

  setHistory((prev) => {
    // Periksa apakah entry identik 100%
    const exists = prev.some(
      (item) =>
        item.research === entry.research &&
        item.fromLevel === entry.fromLevel &&
        item.toLevel === entry.toLevel &&
        item.tier === entry.tier &&
        JSON.stringify(item.buffs) === JSON.stringify(entry.buffs)
    )

    if (exists) {
      console.log('Duplicate entry detected, skipping')
      return prev
    }

    // Pastikan ID dan timestamp konsisten
    const newEntry = {
      ...entry,
      id: entry.id || `${entry.research || entry.name}-${entry.fromLevel}->${entry.toLevel}-${Date.now()}`,
      timestamp: entry.timestamp || Date.now(),
    }

    const newHistory = [newEntry, ...prev]
    
    return newHistory.slice(0, 50)
  })
}


  const deleteHistory = (id) => {
    console.log('Deleting history with id:', id)
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const resetHistory = () => {
    console.log('Resetting history')
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