'use client'

import { createContext, useContext, useState } from 'react'

const AddAnotherContext = createContext()

export function AddAnotherProvider({ children }) {
  const [trigger, setTrigger] = useState(0)

  const addAnother = () => setTrigger(Date.now())

  return (
    <AddAnotherContext.Provider value={{ trigger, addAnother }}>
      {children}
    </AddAnotherContext.Provider>
  )
}

export function useAddAnother() {
  return useContext(AddAnotherContext)
}
