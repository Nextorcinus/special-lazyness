'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const GearHistoryContext = createContext()

export function GearHistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [resetFormTrigger, setResetFormTrigger] = useState(0)

  // ✅ Untuk reset sebagian form (per gear)
  const [resetGearParts, setResetGearParts] = useState([])

  const addToHistory = (entry) => {
    setHistory((prev) => {
      const exists = prev.some(
        (item) =>
          item.gear === entry.gear &&
          item.from === entry.from &&
          item.to === entry.to
      )
      if (exists) return prev

      return [
        ...prev,
        { ...entry, id: `${entry.gear}-${entry.from}->${entry.to}` },
      ]
    })
  }

  const updateHistory = (entry) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.gear !== entry.gear)
      return [
        ...filtered,
        { ...entry, id: `${entry.gear}-${entry.from}->${entry.to}` },
      ]
    })
  }

  const deleteHistory = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)

      // ⏺️ Tambahkan gear ke daftar yang akan direset
      const deletedItem = prev.find((item) => item.id === id)
      if (deletedItem) {
        setResetGearParts((parts) => [...parts, deletedItem.gear])
      }

      return updated
    })
  }

  const resetHistory = () => {
    setHistory([])
    setResetFormTrigger(Date.now()) // ⬅️ trigger global reset jika klik tombol Reset
  }

  // 🔁 Reset seluruh form jika history kosong
  useEffect(() => {
    if (history.length === 0) {
      setResetFormTrigger(Date.now())
    }
  }, [history])

  // ✅ Digunakan untuk konsumsi reset per-gear dari GearForm
  const consumeResetGearPart = (gear) => {
    setResetGearParts((prev) => prev.filter((g) => g !== gear))
  }

  return (
    <GearHistoryContext.Provider
      value={{
        history,
        addToHistory,
        updateHistory,
        deleteHistory,
        resetHistory,
        resetFormTrigger,
        resetGearParts,
        consumeResetGearPart,
      }}
    >
      {children}
    </GearHistoryContext.Provider>
  )
}

export const useGearHistory = () => useContext(GearHistoryContext)
