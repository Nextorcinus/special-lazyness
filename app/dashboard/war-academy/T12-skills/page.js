'use client'

import { useState, useMemo, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

import HeliosSkillCategorySelector from '../../../components/HeliosSkillCategorySelector'
import HeliosSkillSubcategoryScroll from '../../../components/HeliosSkillSubCategorySelector'
import HeliosSkillForm from '../../../components/HeliosSkillForm'
import HeliosSkillCompareForm from '../../../components/HeliosSkillCompareForm'
import HeliosSkillTabSwitcher from '../../../components/tabSwitcherHeliosSkill'
import { useHeliosSkillHistory } from './HeliosSkillsHistoryContext'
import { useAddAnother } from '../../research/AddAnotherContext'

import HeliosSkillData from '../../../data/heliosduabelasskill.json'

export default function HeliosPage({ addAnotherTrigger }) {
  const { history, addToHistory, deleteHistory, resetHistory } =
    useHeliosSkillHistory()
  const { trigger } = useAddAnother()

  // ✅ SINGLE SOURCE OF TRUTH
  const results = history

  const [category, setCategory] = useState('Exalted Infantry')
  const [selectedSub, setSelectedSub] = useState('')
  const [compares, setCompares] = useState([])
  const [showCompareForm, setShowCompareForm] = useState(false)

  // === Subcategories ===
  const subcategories = useMemo(() => {
    if (Array.isArray(HeliosSkillData)) {
      const filtered = HeliosSkillData.filter(
        (item) => item.Category === category
      )
      return [...new Set(filtered.map((i) => i.Item.trim()))]
    }

    const key = Object.keys(HeliosSkillData).find(
      (k) => k.trim() === category.trim()
    )

    return key ? Object.keys(HeliosSkillData[key]) : []
  }, [category])

  // ✅ Sync compares dengan history
  useEffect(() => {
    setCompares((prev) => {
      const updated = [...prev]
      while (updated.length < history.length) updated.push(null)
      return updated.slice(0, history.length)
    })
  }, [history])

  // Reset trigger
  useEffect(() => {
    setCategory('Exalted Infantry')
    setSelectedSub('')
  }, [addAnotherTrigger, trigger])

  // ✅ HANYA ke context (tidak setResults lagi)
  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }
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
    setCompares(results.map(() => compareData))
    setShowCompareForm(false)
    toast.success('Comparison applied to all results!')
  }

  // ✅ hanya panggil context
  const handleDeleteHistory = (id) => {
    deleteHistory(id)
  }

  const handleResetHistory = () => {
    resetHistory()
    setCompares([])
    toast.success('History has been reset.')
  }

  return (
    <main className="text-white w-full">
      <div className="relative w-full md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl">Flame Tech T12</h2>
          <HeliosSkillCategorySelector
            selected={category}
            onChange={(newCat) => {
              setCategory(newCat)
              setSelectedSub('')
            }}
          />
        </div>

        <HeliosSkillSubcategoryScroll
          items={subcategories}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

      {/* FORM */}
      {selectedSub && (
        <div className="flex flex-col md:px-6 lg:flex-row gap-6 mt-2 w-full">
          <div className="w-full">
            <HeliosSkillForm
              category={category}
              researchName={selectedSub}
              onCalculate={handleCalculate}
              dataSource={HeliosSkillData}
            />

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
      )}

      {/* POPUP */}
      {showCompareForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#ffffff35] backdrop-blur-md p-6 rounded-xl border border-white/20 w-[90%] max-w-lg relative">
            <button
              onClick={() => setShowCompareForm(false)}
              className="absolute top-2 right-2 text-xl text-red-400 hover:text-white"
            >
              ✕
            </button>

            <HeliosSkillCompareForm
              comparedData={compares[0] || {}}
              onCompare={handleCompareSubmit}
              onCancel={() => setShowCompareForm(false)}
            />
          </div>
        </div>
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="md:p-6 mt-8 space-y-6 w-full">
          <HeliosSkillTabSwitcher
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
