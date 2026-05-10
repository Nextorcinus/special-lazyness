'use client'

import { useState, useEffect } from 'react'
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

  const results = history

  // ================= CATEGORY =================

  const [category, setCategory] = useState('Infantry')

  // ================= SUBCATEGORY =================

  const [selectedSubcategory, setSelectedSubcategory] = useState('Skill 1')

  // ================= COMPARE =================

  const [compares, setCompares] = useState([])

  const [showCompareForm, setShowCompareForm] = useState(false)

  // ================= COMPARE SYNC =================

  useEffect(() => {
    setCompares((prev) => {
      const updated = [...prev]

      while (updated.length < history.length) {
        updated.push(null)
      }

      return updated.slice(0, history.length)
    })
  }, [history])

  // ================= RESET =================

  useEffect(() => {
    setCategory('Infantry')

    setSelectedSubcategory('Skill 1')
  }, [addAnotherTrigger, trigger])

  // ================= CALCULATE =================

  const handleCalculate = (data) => {
    const resultWithId = {
      ...data,
      id: uuidv4(),
    }

    addToHistory(resultWithId)

    setTimeout(() => {
      document.getElementById('latest-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 150)
  }

  // ================= COMPARE =================

  const handleCompareSubmit = (compareData) => {
    if (!compareData) return

    setCompares(results.map(() => compareData))

    setShowCompareForm(false)

    toast.success('Comparison applied to all results!')
  }

  // ================= DELETE =================

  const handleDeleteHistory = (id) => {
    deleteHistory(id)
  }

  // ================= RESET HISTORY =================

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
            onChange={(newCategory) => {
              setCategory(newCategory)

              setSelectedSubcategory('Skill 1')
            }}
          />
        </div>

        {/* SUBCATEGORY */}

        <HeliosSkillSubcategoryScroll
          dataSource={HeliosSkillData}
          selected={selectedSubcategory}
          onSelect={setSelectedSubcategory}
        />
      </div>

      {/* FORM */}

      <div className="flex flex-col md:px-6 lg:flex-row gap-6 mt-2 w-full">
        <div className="w-full">
          <HeliosSkillForm
            unit={category}
            selectedSubcategory={selectedSubcategory}
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
