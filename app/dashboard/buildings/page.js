'use client'

import { useState, useEffect, useMemo } from 'react'
import SubcategoryScroll from '../../components/SubcategoryScroll'
import BuildingForm from '../../components/BuildingForm'
import CompareForm from '../../components/CompareForm'
import CategorySelector from '../../components/CategorySelector'
import { v4 as uuidv4 } from 'uuid'
import { useHistory } from './HistoryContext'
import '../../globals.css'
import { useAddAnother } from './AddAnotherContext'
import { toast } from 'sonner'
import TabSwitcher from '../../components/tabSwitcher'

export default function Home() {
  const [category, setCategory] = useState('Basic')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])
  const [showCompareForm, setShowCompareForm] = useState(false)

  const { history, addHistory, deleteHistory, resetHistory } = useHistory()
  const { trigger } = useAddAnother()

  // sinkron history ke result + compare
  useEffect(() => {
    setResults(history)
    setCompares(Array(history.length).fill(null))
  }, [history])

  // reset subcategory saat Basic -> FireCrystal diganti
  useEffect(() => {
    setSelectedSub('')
  }, [category])

  // daftar bangunan
  const basicBuildings = [
    'Furnace',
    'Marksman',
    'Lancers',
    'Infantry',
    'Research Center',
    'Command Center',
    'Embassy',
  ]

  const fireCrystalBuildings = [
    'FC Furnace',
    'FC Academy',
    'FC Marksman',
    'FC Lancers',
    'FC Infantry',
    'FC Embassy',
    'FC Infirmary',
    'FC Command Center',
  ]

  const buildings = category === 'Basic' ? basicBuildings : fireCrystalBuildings

  // tambah result
  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }

    setResults(prev => [...prev, resultWithId])
    setCompares(prev => [...prev, null])
    addHistory(resultWithId)

    setTimeout(() => {
      document.getElementById("latest-result")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }, 150)
  }

  // apply compare
  const handleCompareSubmit = (compareData) => {
    if (!compareData) return;

    setCompares(results.map(() => compareData))
    setShowCompareForm(false)
    toast.success("Comparison applied to all results!")
  }

  // hapus result
  const handleDeleteHistory = (id) => {
    deleteHistory(id)
    const updated = history.filter(item => item.id !== id)
    setResults(updated)
    setCompares(prev => prev.slice(0, updated.length))
  }

  // reset semua
  const handleResetHistory = () => {
    resetHistory()
    setResults([])
    setCompares([])
    toast.success("History has been reset.")
  }

  return (
    <main className="text-white w-full">
      
      {/* HEADER */}
      <div className="relative w-full md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl text-white">Buildings Upgrade</h2>
          <CategorySelector selected={category} onChange={setCategory} />
        </div>

        <SubcategoryScroll
          items={buildings}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

      {/* FORM */}
      {selectedSub && (
        <div className="flex flex-col md:px-6 lg:flex-row gap-6 mt-2 w-full">
          <div className="w-full">
            
            <BuildingForm
              category={category}
              selectedSub={selectedSub}
              onCalculate={handleCalculate}
            />

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCompareForm(true)}
                className="buttonGlass flex gap-2 text-sm md:text-base"
              >
                +
                Compare Resources
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL COMPARE */}
      {showCompareForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#ffffff35] p-6 rounded-xl border border-white/20 w-[90%] max-w-lg relative">

            <button
              onClick={() => setShowCompareForm(false)}
              className="absolute top-2 right-2 text-xl text-red-400 hover:text-white"
            >
              ✕
            </button>

            <CompareForm
              comparedData={compares[0] || {}}
              onCompare={handleCompareSubmit}
            />
          </div>
        </div>
      )}

      {/* HASIL */}
      {results.length > 0 && (
        <div className="md:p-6 mt-8 space-y-6 w-full">
          <TabSwitcher
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
