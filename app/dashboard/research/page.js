'use client'

import { useState, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import ResearchCategorySelector from '../../components/ResearchCategorySelector'
import ResearchSubcategoryScroll from '../../components/ResearchSubcategoryScroll'
import ResearchForm from '../../components/ResearchForm'
import TabSwitcherResearch from '../../components/tabSwitcherResearch'
import researchData from '../../data/MaterialBasicResearch'
import { useResearchHistory } from './ResearchHistoryContext'
import { useAddAnother } from './AddAnotherContext'
import { toast } from 'sonner'


export default function ResearchPage() {
  const { history, addToHistory, deleteHistory, resetHistory } = useResearchHistory()
  const { trigger } = useAddAnother()
  const [category, setCategory] = useState('Growth')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])

  useEffect(() => {
    setCategory('Growth')
    setSelectedSub('')
  }, [trigger])

  useEffect(() => setSelectedSub(''), [category])

  const subcategories = useMemo(
    () => Object.keys(researchData[category] || {}),
    [category]
  )

  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }

    setResults((prev) => {
      const exists = prev.some(
        (r) =>
          r.research === resultWithId.research &&
          r.fromLevel === resultWithId.fromLevel &&
          r.toLevel === resultWithId.toLevel
      )
      return exists ? prev : [...prev, resultWithId]
    })

    addToHistory(resultWithId)
    toast.success('Added to Research History!')
  }

  return (
    <main className="text-white w-full">
      <div className="relative w-full md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl font-semibold mb-2">Research Upgrade</h2>
        
        <ResearchCategorySelector selected={category} onChange={setCategory} />

        </div>
        <ResearchSubcategoryScroll
          items={subcategories}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

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
