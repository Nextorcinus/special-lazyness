'use client'

import { useState, useEffect, useMemo } from 'react'
import CharmForm from '../../components/CharmForm'
import CompareFormCharm from '../../components/CharmFormCompare'
import TabSwitcherCharm from '../../components/tabSwitcherCharm'
import { v4 as uuidv4 } from 'uuid'
import { useCharmHistory } from './CharmHistoryContext'
import { toast } from 'sonner'
import '../../globals.css'

export default function CharmPage() {
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])
  const [showCompareForm, setShowCompareForm] = useState(false)

  const { history, addHistory, deleteHistory, resetHistory } = useCharmHistory()

  // Sinkronkan hasil dengan history
  useEffect(() => {
    setResults(history)
    setCompares((prev) => {
      const updated = [...prev]
      while (updated.length < history.length) updated.push(null)
      return updated.slice(0, history.length)
    })
  }, [history])

  // === 1️⃣ Hitung Charm ===
  const handleCalculate = (data) => {
    if (!data || !data.type || !data.from || !data.to) {
      toast.warning('Please fill all required fields.')
      return
    }

    const resultWithId = { ...data, id: uuidv4() }
    setResults((prev) => [...prev, resultWithId])
    setCompares((prev) => [...prev, null])
    addHistory(resultWithId)

    toast.success('Charm upgrade calculated!')
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 200)
  }

  // === 2️⃣ Compare ===
  const handleCompareSubmit = (compareData) => {
    if (!compareData) return

    const newCompares = results.map(() => ({
      guide: Number(compareData.guide || 0),
      design: Number(compareData.design || 0),
      jewel: Number(compareData.jewel || 0),
      svs: Number(compareData.svs || 0),
    }))

    setCompares(newCompares)
    setShowCompareForm(false)
    toast.success('Comparison applied to all results!')
  }

  // === 3️⃣ Delete satu history ===
  const handleDeleteHistory = (id) => {
    deleteHistory(id)
    const updated = results.filter((item) => item.id !== id)
    setResults(updated)
    setCompares((prev) => prev.filter((_, i) => i < updated.length))
  }

  // === 4️⃣ Reset semua ===
  const handleResetHistory = () => {
    resetHistory()
    setResults([])
    setCompares([])
    toast.success('Charm history has been reset.')
  }

  const defaultResources = useMemo(
    () => ({
      guide: 0,
      design: 0,
      jewel: 0,
      svs: 0,
    }),
    []
  )

  return (
    <main className="text-white w-full">
      {/* === Header === */}
      <div className="relative w-full md:px-6 py-0 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl text-white">Chief Charm Upgrade</h2>
        </div>
      </div>

      {/* === Charm Form === */}
      <div className="flex flex-col md:p-6 lg:flex-row gap-6 w-full">
        <div className="w-full">
          <CharmForm onSubmit={handleCalculate} />

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

      {/* === Compare Popup === */}
      {showCompareForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#ffffff35] backdrop-blur p-6 rounded-xl border border-white/20 w-[90%] max-w-lg relative">
            <button
              onClick={() => setShowCompareForm(false)}
              className="absolute top-2 right-2 text-xl text-red-400 hover:text-white"
            >
              ✕
            </button>

            <CompareFormCharm
              onCompare={handleCompareSubmit}
              comparedData={compares[0] || defaultResources}
              onCancel={() => setShowCompareForm(false)}
            />
          </div>
        </div>
      )}

      {/* === Results Section === */}
      {Array.isArray(results) && results.length > 0 && (
        <div className="md:p-6 mt-8 space-y-6 w-full">
          <TabSwitcherCharm
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
