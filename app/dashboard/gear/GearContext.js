'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const GearHistoryContext = createContext()

export function GearHistoryProvider({ children }) {
  const [history, setHistory] = useState([])
  const [resetFormTrigger, setResetFormTrigger] = useState(0)
  const [resetGearParts, setResetGearParts] = useState([])

  // 🧠 Load data dari localStorage saat pertama kali render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gearHistory')
      if (saved) {
        try {
          setHistory(JSON.parse(saved))
        } catch (err) {
          console.error('❌ Error parsing gearHistory:', err)
          localStorage.removeItem('gearHistory')
        }
      }
    }
  }, [])

  // 💾 Simpan data ke localStorage setiap kali history berubah
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (history.length > 0) {
        localStorage.setItem('gearHistory', JSON.stringify(history))
      } else {
        localStorage.removeItem('gearHistory')
      }
    }
  }, [history])

  // ➕ Tambah item baru ke history (hindari duplikat)
  const addToHistory = (entry) => {
    setHistory((prev) => {
      const exists = prev.some(
        (item) =>
          item.type === entry.type &&
          item.from === entry.from &&
          item.to === entry.to
      )

      if (exists) return prev

      return [
        ...prev,
        { ...entry, id: `${entry.type}-${entry.from}->${entry.to}-${Date.now()}` },
      ]
    })
  }

  // 🔄 Update 1 item (misal jika re-calculate gear sama)
  const updateHistory = (entry) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.type !== entry.type)
      return [
        ...filtered,
        { ...entry, id: `${entry.type}-${entry.from}->${entry.to}-${Date.now()}` },
      ]
    })
  }

  // 🗑️ Hapus item dari history
  const deleteHistory = (id) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)

      const deletedItem = prev.find((item) => item.id === id)
      if (deletedItem) {
        setResetGearParts((parts) => [...parts, deletedItem.type])
      }

      return updated
    })
  }

  // ♻️ Reset semua history
  const resetHistory = () => {
    setHistory([])
    setResetFormTrigger(Date.now())

    if (typeof window !== 'undefined') {
      localStorage.removeItem('gearHistory')
    }
  }

  // 🔁 Trigger reset form global bila history kosong
  useEffect(() => {
    if (history.length === 0) {
      setResetFormTrigger(Date.now())
    }
  }, [history])

  // ✅ Reset form khusus per gear
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
