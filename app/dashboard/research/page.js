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
  const [formKey, setFormKey] = useState(0)

  // --- 1️⃣ Reset form jika trigger addAnother berubah ---
  useEffect(() => {
    if (trigger > 0) {
      setCategory('Growth')
      setSelectedSub('')
      setFormKey(prev => prev + 1)
      setResults([]) 
      toast.message('Form reset for new entry')
    }
  }, [trigger])


  useEffect(() => {
    setSelectedSub('')
  }, [category])

  
  const subcategories = useMemo(() => {
    return Object.keys(researchData[category] || {})
  }, [category])

  
  useEffect(() => {
    if (subcategories.length > 0 && !selectedSub) {
      setSelectedSub(subcategories[0])
    }
  }, [subcategories, selectedSub])

  
const handleCalculate = (data) => {
  console.log('📦 Received data:', data)

  if (!data) {
    toast.error('No data received from form!')
    return
  }

  const resultWithId = {
    ...data,
    id: uuidv4(),
    name: data.research || data.name || selectedSub,
    timestamp: Date.now(),
  }

  

  setResults(prev => {
    const exists = prev.some(r =>
      r.name === resultWithId.name &&
      r.fromLevel === resultWithId.fromLevel &&
      r.toLevel === resultWithId.toLevel &&
      r.tier === resultWithId.tier
    )
   
    if (exists) {
      
      return prev
    }
   
    return [resultWithId, ...prev]
  })

  addToHistory(resultWithId)
  toast.success(`${resultWithId.name} added to Research History`)
}


  return (
    <main className="p-1 md:p-6 text-white w-full">
      <div className="relative w-full md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl font-semibold mb-2">Research Upgrade</h2>
          <ResearchCategorySelector selected={category} onChange={setCategory} />
        </div>

        {subcategories.length > 0 && (
          <ResearchSubcategoryScroll
            items={subcategories}
            selected={selectedSub}
            onSelect={setSelectedSub}
          />
        )}
      </div>

      {selectedSub && (
        <div className="flex flex-col md:px-6 lg:flex-row gap-6 mt-2 w-full">
          <div className="w-full">
            <ResearchForm
              key={formKey} // hanya berubah ketika benar-benar reset
              category={category}
              researchName={selectedSub}
              onCalculate={handleCalculate}
            />
          </div>
        </div>
      )}

      <div className="mt-10 md:px-6">
        <TabSwitcherResearch
          results={results}
          compares={compares}
          onDeleteHistory={deleteHistory}
          onResetHistory={() => {
            resetHistory()
            setResults([])
          }}
        />
      </div>
    </main>
  )
}
