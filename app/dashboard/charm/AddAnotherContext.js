'use client'

import { createContext, useContext, useState } from 'react'

const AddAnotherContext = createContext()

export const AddAnotherProvider = ({ children }) => {
  const [addAnother, setAddAnother] = useState(false)

  return (
    <AddAnotherContext.Provider value={{ addAnother, setAddAnother }}>
      {children}
    </AddAnotherContext.Provider>
  )
}

export const useAddAnother = () => {
  const context = useContext(AddAnotherContext)
  if (!context) {
    throw new Error('useAddAnother must be used within an AddAnotherProvider')
  }
  return context
}
