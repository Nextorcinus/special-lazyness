'use client'

import { createContext, useContext, useState } from 'react'

const AddAnotherContext = createContext()

export function AddAnotherProvider({ children }) {
  const [trigger, setTrigger] = useState(0)

  const addAnother = () => {
    console.log('🔄 [AddAnotherContext] addAnother called')
    const newTrigger = Date.now()
    setTrigger(newTrigger)
    console.log('📈 Trigger set to:', newTrigger)
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