'use client'

import { useState, useMemo, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

import HeliosDuaBelasCategorySelector from '../../../components/HeliosDuaBelasCategorySelector'
import HeliosDuaBelasSubcategoryScroll from '../../../components/HeliosDuabelasSubCategorySelector'
import HeliosDuaBelasForm from '../../../components/HeliosDuaBelasForm'
import HeliosDuaBelasCompareForm from '../../../components/HeliosDuaBelasCompareForm'
import HeliosDuaBelasTabSwitcher from '../../../components/tabSwitcherHeliosDuaBelas'
import { useHeliosDuaBelasHistory } from './HeliosDuaBelasHistoryContext'
import { useAddAnother } from '../../research/AddAnotherContext'

import heliosDuaBelasData from '../../../data/heliosduabelas.json'

export default function HeliosPage({ addAnotherTrigger }) {
  const { history, addToHistory, deleteHistory, resetHistory } =
    useHeliosDuaBelasHistory()
  const { trigger } = useAddAnother()

  const [category, setCategory] = useState('Exalted Infantry')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])
  const [showCompareForm, setShowCompareForm] = useState(false)

  // === Subcategories from JSON ===
  const subcategories = useMemo(() => {
    if (Array.isArray(heliosDuaBelasData)) {
      const filtered = heliosDuaBelasData.filter(
        (item) => item.Category === category
      )
      return [...new Set(filtered.map((i) => i.Item.trim()))]
    }

    const key = Object.keys(heliosDuaBelasData).find(
      (k) => k.trim() === category.trim()
    )

    return key ? Object.keys(heliosDuaBelasData[key]) : []
  }, [category])

  // === Sync with history ===
  useEffect(() => {
    setResults(history)
    setCompares((prev) => {
      const updated = [...prev]
      while (updated.length < history.length) updated.push(null)
      return updated.slice(0, history.length)
    })
  }, [history])

  // === Reset when trigger changes ===
  useEffect(() => {
    setCategory('Exalted Infantry')
    setSelectedSub('')
  }, [addAnotherTrigger, trigger])

  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }
    setResults((prev) => [...prev, resultWithId])
    setCompares((prev) => [...prev, null])
    addToHistory(resultWithId)
    setTimeout(() => {
      document.getElementById('latest-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 150)
  }

  const handleCompareSubmit = (compareData) => {
    if (!compareData) return
    setCompares((prev) => results.map(() => compareData))
    setShowCompareForm(false)
    toast.success('Comparison applied to all results!')
  }

  const handleDeleteHistory = (id) => {
    deleteHistory(id)
    const updated = history.filter((item) => item.id !== id)
    setResults(updated)
    setCompares((prev) => prev.filter((_, i) => i < updated.length))
  }

  const handleResetHistory = () => {
    resetHistory()
    setResults([])
    setCompares([])
    toast.success('History has been reset.')
  }

  return (
    <main className="text-white w-full">
      <div className="relative w-full md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl">Flame Tech T12</h2>
          <HeliosDuaBelasCategorySelector
            selected={category}
            onChange={(newCat) => {
              setCategory(newCat)
              setSelectedSub('')
            }}
          />
        </div>
        <HeliosDuaBelasSubcategoryScroll
          items={subcategories}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

      {/* === FORM AREA === */}
      {selectedSub && (
        <div className="flex flex-col md:px-6 lg:flex-row gap-6 mt-2 w-full">
          <div className="w-full">
            <HeliosDuaBelasForm
              category={category}
              researchName={selectedSub}
              onCalculate={handleCalculate}
              dataSource={heliosDuaBelasData}
            />

            {/* Compare Button */}
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
      )}

      {/* === POPUP COMPARE === */}
      {showCompareForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#ffffff35] backdrop-blur-md p-6 rounded-xl border border-white/20 w-[90%] max-w-lg relative">
            <button
              onClick={() => setShowCompareForm(false)}
              className="absolute top-2 right-2 text-xl text-red-400 hover:text-white"
            >
              ✕
            </button>
            <HeliosDuaBelasCompareForm
              comparedData={compares[0] || {}}
              onCompare={handleCompareSubmit}
              onCancel={() => setShowCompareForm(false)}
            />
          </div>
        </div>
      )}

      {/* === RESULTS === */}
      {results.length > 0 && (
        <div className="md:p-6 mt-8 space-y-6 w-full">
          <HeliosDuaBelasTabSwitcher
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
