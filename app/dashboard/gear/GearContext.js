'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const GearHistoryContext = createContext()

export function GearHistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [resetFormTrigger, setResetFormTrigger] = useState(0)
  const [resetGearParts, setResetGearParts] = useState([])

  // Load from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gearHistory')
      if (saved) {
        try {
          setHistory(JSON.parse(saved))
        } catch (error) {
          console.error("Error parsing gearHistory:", error)
          localStorage.removeItem('gearHistory')
        }
      }
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (history.length > 0) {
        localStorage.setItem('gearHistory', JSON.stringify(history))
      } else {
        localStorage.removeItem('gearHistory')
      }
    }
  }, [history])

  // Add to history (Context is the ONLY ID creator)
  const addToHistory = (entry) => {
    setHistory(prev => {
      const exists = prev.some(
        item => item.type === entry.type && item.from === entry.from && item.to === entry.to
      )
      if (exists) return prev

      return [
        ...prev,
        {
          ...entry,
          id: `${entry.type}-${entry.from}-${entry.to}-${Date.now()}`
        }
      ]
    })
  }

  // Delete based on ID
  const deleteHistory = (id) => {
    setHistory(prev => {
      const deleted = prev.find(x => x.id === id)
      if (deleted) {
        setResetGearParts(old => [...old, deleted.type])
      }

      return prev.filter(item => item.id !== id)
    })
  }

  const resetHistory = () => {
    setHistory([])
    setResetFormTrigger(Date.now())
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gearHistory')
    }
  }

  // Reset form when history empty
  useEffect(() => {
    if (history.length === 0) {
      setResetFormTrigger(Date.now())
    }
  }, [history])

  const consumeResetGearPart = (gear) => {
    setResetGearParts(prev => prev.filter(g => g !== gear))
  }

  return (
    <GearHistoryContext.Provider value={{
      history,
      addToHistory,
      deleteHistory,
      resetHistory,
      resetFormTrigger,
      resetGearParts,
      consumeResetGearPart,
    }}>
      {children}
    </GearHistoryContext.Provider>
  )
}

export const useGearHistory = () => useContext(GearHistoryContext)
