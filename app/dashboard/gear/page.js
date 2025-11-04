'use client'

import { useState, useEffect, useMemo } from 'react'
import GearForm from '../../components/GearForm'
import CompareFormGear from '../../components/CompareFormGear'
import TabSwitcherGear from '../../components/tabSwitcherGear'
import { v4 as uuidv4 } from 'uuid'
import { useGearHistory } from './GearContext'
import { toast } from 'sonner'
import '../../globals.css'

export default function GearPage() {
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])
  const [showCompareForm, setShowCompareForm] = useState(false)

  const { history, addToHistory, deleteHistory, resetHistory } = useGearHistory()

  // Sinkronisasi hasil dengan history
  useEffect(() => {
    setResults(history)
    setCompares((prev) => {
      const updated = [...prev]
      while (updated.length < history.length) updated.push(null)
      return updated.slice(0, history.length)
    })
  }, [history])

  // Hitung hasil gear upgrade dari GearForm
  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }
    setResults((prev) => [...prev, resultWithId])
    setCompares((prev) => [...prev, null])
    addToHistory(resultWithId)

    toast.success('Gear upgrade calculated!')
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  // Submit perbandingan resource
  const handleCompareSubmit = (compareData) => {
    if (!compareData) return
    setCompares((prev) => {
      const updated = [...prev]
      for (let i = 0; i < results.length; i++) {
        updated[i] = compareData
      }
      return updated
    })
    setShowCompareForm(false)
    toast.success('Comparison applied to all results!')
  }

  // Hapus 1 riwayat gear
  const handleDeleteHistory = (id) => {
    deleteHistory(id)
    const updated = history.filter((item) => item.id !== id)
    setResults(updated)
    setCompares((prev) => prev.filter((_, i) => i < updated.length))
  }

  // Reset semua history
  const handleResetHistory = () => {
    resetHistory()
    setResults([])
    setCompares([])
    toast.success('Gear history has been reset.')
  }

  // Nilai default untuk CompareFormGear
  const defaultResources = useMemo(
    () => ({
      plans: 0,
      polish: 0,
      alloy: 0,
      amber: 0,
    }),
    []
  )

  return (
    <main className="text-white w-full">
      {/* === Header === */}
      <div className="relative w-full md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl text-white">Chief Gear Upgrade</h2>
        </div>
      </div>

      {/* === Gear Form + Compare Button === */}
      <div className="flex flex-col md:p-6 lg:flex-row gap-6 mt-6 w-full">
        <div className="w-full">
          <GearForm onSubmit={handleCalculate} />

          {/* Tombol Compare selalu tampil */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowCompareForm(true)}
              className="buttonGlass flex gap-2 text-sm md:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Compare Resources
            </button>
          </div>
        </div>
      </div>

      {/* === POPUP Compare Form === */}
      {showCompareForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#ffffff35] bg-blur p-6 rounded-xl border border-white/20 w-[90%] max-w-lg relative">
            <button
              onClick={() => setShowCompareForm(false)}
              className="absolute top-2 right-2 text-xl text-red-400 hover:text-white"
            >
              ✕
            </button>

            <CompareFormGear
              onCompare={handleCompareSubmit}
              comparedData={compares[0] || defaultResources}
              onCancel={() => setShowCompareForm(false)}
            />
          </div>
        </div>
      )}

      {/* === Results Section === */}
      {results.length > 0 && (
        <div className="md:p-6 mt-8 space-y-6 w-full">
          <TabSwitcherGear
            results={results}
            compares={compares}
            onDeleteHistory={handleDeleteHistory}
            onResetHistory={handleResetHistory}
          />
        </div>
      )}
    </main>
  )
}
