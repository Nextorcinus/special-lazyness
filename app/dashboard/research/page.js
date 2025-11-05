'use client'

import { useState, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import ResearchCategorySelector from '../../components/ResearchCategorySelector'
import ResearchSubcategoryScroll from '../../components/ResearchSubcategoryScroll'
import ResearchForm from '../../components/ResearchForm'
import TabSwitcherResearch from '../../components/TabSwitcherResearch'

import researchData from '../../data/MaterialBasicResearch'
import { useResearchHistory } from './ResearchHistoryContext'
import { useAddAnother } from './AddAnotherContext'

export default function ResearchPage() {
  const { history, addToHistory, deleteHistory, resetHistory } = useResearchHistory()
  const { trigger } = useAddAnother()

  const [category, setCategory] = useState('Growth')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])

  // Reset form saat tekan +Add Another
  useEffect(() => {
    setCategory('Growth')
    setSelectedSub('')
  }, [trigger])

  // Reset subcategory saat ganti kategori
  useEffect(() => {
    setSelectedSub('')
  }, [category])

  const subcategories = useMemo(
    () => Object.keys(researchData[category] || {}),
    [category]
  )

  // Tambah hasil ke history dan tab Overview
  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }
    addToHistory(resultWithId)
    setResults((prev) => [...prev, resultWithId])

    // Scroll smooth ke bawah setelah hitung
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 200)
  }

  return (
    <main className="p-1 md:p-6 text-white w-full">
      {/* === Header & Category Selector === */}
      <div className="relative w-full md:p-6">
        <h2 className="text-2xl font-semibold mb-2">Research Upgrade</h2>

        <ResearchCategorySelector selected={category} onChange={setCategory} />

        <ResearchSubcategoryScroll
          items={subcategories}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

      {/* === Form Input === */}
      {selectedSub && (
        <div className="flex flex-col md:px-6 lg:flex-row gap-6 mt-2 w-full">
          <div className="w-full">
            <ResearchForm
              category={category}
              researchName={selectedSub}
              onCalculate={handleCalculate}
            />
          </div>
        </div>
      )}

      {/* === Tab Switcher (Overview + History) === */}
      {history.length > 0 && (
        <div className="mt-10 md:px-6">
          <TabSwitcherResearch
            results={results}
            compares={compares}
            onDeleteHistory={deleteHistory}
            onResetHistory={resetHistory}
          />
        </div>
      )}
    </main>
  )
}
