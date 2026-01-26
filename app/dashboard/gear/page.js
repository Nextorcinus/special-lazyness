'use client'

import { useState, useEffect, useMemo } from 'react'
import GearForm from '../../components/GearForm'
import CompareFormGear from '../../components/CompareFormGear'
import TabSwitcherGear from '../../components/tabSwitcherGear'
import { useGearHistory } from './GearContext'
import { toast } from 'sonner'
import '../../globals.css'

export default function GearPage() {
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])
  const [showCompareForm, setShowCompareForm] = useState(false)
  const [tab, setTab] = useState('overview')

  const { history, addToHistory, deleteHistory, resetHistory } =
    useGearHistory()

  // Sinkronkan hasil lokal dengan Context history
  useEffect(() => {
    setResults(history)

    setCompares((prev) => {
      const updated = [...prev]
      while (updated.length < history.length) updated.push(null)
      return updated.slice(0, history.length)
    })
  }, [history])

  // === Calculate Gear ===
  const handleCalculate = (data) => {
    if (!data || !data.type || !data.from || !data.to) {
      toast.warning('Please complete all fields before calculating.')
      return
    }

    // Masukkan ke history via context
    addToHistory(data)

    toast.success('Gear upgrade calculated!')

    setTab('overview')

    // Apply compare otomatis ke hasil terbaru
    if (compares.length > 0 && compares[0] !== null) {
      const compareObj = compares[0]

      setCompares((prev) => {
        const updated = [...prev, compareObj]
        return updated
      })
    }

    // Scroll to latest result
    setTimeout(() => {
      document.getElementById('latest-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 200)
  }

  // === Compare Data ===
  const handleCompareSubmit = (compareData) => {
    if (history.length === 0) {
      toast.error(
        'No calculation result available, please submit a calculation first.'
      )
      return
    }

    if (!compareData) return

    const compareObj = {
      plans: Number(compareData.plans || 0),
      polish: Number(compareData.polish || 0),
      alloy: Number(compareData.alloy || 0),
      amber: Number(compareData.amber || 0),
      svs: Number(compareData.svs || 0),
    }

    // Apply compare ke seluruh results
    setCompares(history.map(() => compareObj))

    setShowCompareForm(false)
    toast.success('Comparison applied to all results!')
  }

  // === Delete History ===
  const handleDeleteHistory = (id) => {
    const index = results.findIndex((r) => r.id === id)

    deleteHistory(id)

    setCompares((prev) => prev.filter((_, i) => i !== index))
  }

  // === Reset Semua ===
  const handleResetHistory = () => {
    resetHistory()
    setResults([])
    setCompares([])
    toast.success('Gear history has been reset.')
  }

  // default compare
  const defaultResources = useMemo(
    () => ({
      plans: 0,
      polish: 0,
      alloy: 0,
      amber: 0,
      svs: 0,
    }),
    []
  )

  return (
    <main className="text-white w-full">
      {/* Header */}
      <div className="relative w-full md:px-6 md:py-0 py-4 md:mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 px-6">
          <h2 className="text-2xl text-white">Chief Gear</h2>
        </div>
      </div>

      {/* Gear Form */}
      <div className="flex flex-col md:p-6 lg:flex-row gap-6 w-full">
        <div className="w-full">
          <GearForm onSubmit={handleCalculate} materialDataLoaded={true} />

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowCompareForm(true)}
              className="buttonGlass flex gap-2 text-sm md:text-base"
            >
              Compare Resources
            </button>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#ffffff35] backdrop-blur p-6 rounded-xl border border-white/20 w-[90%] max-w-lg relative">
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

      {/* Results Section */}
      {results.length > 0 && (
        <div className="md:p-6 py-4 mt-2 space-y-6 w-full">
          <TabSwitcherGear
            tab={tab}
            setTab={setTab}
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
