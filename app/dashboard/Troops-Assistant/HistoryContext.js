'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const HistoryContext = createContext(null)
const STORAGE_KEY = 'troop-assistant-state'

const defaultState = {
  troops: {
    infantry: '',
    lancer: '',
    marksman: '',
  },
  joinerCount: 6,
  rallySize: 150000,
  joinerSize: 120000,
  legions: [],
}

export function HistoryProvider({ children }) {
  const [hydrated, setHydrated] = useState(false)

  const [troops, setTroops] = useState(defaultState.troops)
  const [joinerCount, setJoinerCount] = useState(defaultState.joinerCount)
  const [rallySize, setRallySize] = useState(defaultState.rallySize)
  const [joinerSize, setJoinerSize] = useState(defaultState.joinerSize)
  const [legions, setLegions] = useState(defaultState.legions)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)

        setTroops(data.troops ?? defaultState.troops)
        setJoinerCount(data.joinerCount ?? defaultState.joinerCount)
        setRallySize(data.rallySize ?? defaultState.rallySize)
        setJoinerSize(data.joinerSize ?? defaultState.joinerSize)
        setLegions(data.legions ?? [])
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        troops,
        joinerCount,
        rallySize,
        joinerSize,
        legions,
      })
    )
  }, [hydrated, troops, joinerCount, rallySize, joinerSize, legions])

  if (!hydrated) return null

  return (
    <HistoryContext.Provider
      value={{
        troops,
        setTroops,
        joinerCount,
        setJoinerCount,
        rallySize,
        setRallySize,
        joinerSize,
        setJoinerSize,
        legions,
        setLegions,
      }}
    >
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) {
    throw new Error('useHistory must be used inside HistoryProvider')
  }
  return ctx
}
