'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const AddAnotherContext = createContext()

export function AddAnotherProvider({ children }) {
  const [trigger, setTrigger] = useState(0)

  // Load last trigger from localStorage (optional, untuk persistence)
  useEffect(() => {
    const savedTrigger = localStorage.getItem('lastAddAnotherTrigger')
    if (savedTrigger) {
      setTrigger(Number(savedTrigger))
    }
  }, [])

  const addAnother = () => {
    const newTrigger = Date.now()
    setTrigger(newTrigger)
    // Save trigger to localStorage (optional)
    localStorage.setItem('lastAddAnotherTrigger', newTrigger.toString())
  }

  return (
    <AddAnotherContext.Provider value={{ trigger, addAnother }}>
      {children}
    </AddAnotherContext.Provider>
  )
}

export function useAddAnother() {
  const context = useContext(AddAnotherContext)
  if (!context) {
    throw new Error('useAddAnother must be used within AddAnotherProvider')
  }
  return context
}