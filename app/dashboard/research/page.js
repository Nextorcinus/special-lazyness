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
  const { trigger, addAnother } = useAddAnother()

  const [category, setCategory] = useState('Growth')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([]) // ✅ TAMBAHKAN STATE RESULTS
  const [compares, setCompares] = useState([])
  const [formKey, setFormKey] = useState(0)

  console.log('🎯 [page.js] Render state:', {
    category,
    selectedSub,
    formKey,
    trigger,
    historyLength: history.length,
    resultsLength: results.length
  })

  // Reset form saat Add Another ditekan - SEDERHANA seperti Building
  useEffect(() => {
    console.log('🔍 [page.js] useEffect trigger check:', { trigger })
    
    if (trigger > 0) {
      console.log('🔄 [page.js] ADD ANOTHER TRIGGERED - Resetting form...')
      
      setCategory('Growth')
      setSelectedSub('')
      setFormKey(prev => prev + 1)
      
      console.log('✅ [page.js] Form reset completed')
    }
  }, [trigger])

  // Reset subcategory saat ganti kategori
  useEffect(() => {
    console.log('🔄 [page.js] Category changed, resetting subcategory:', category)
    setSelectedSub('')
  }, [category])

  const subcategories = useMemo(
    () => Object.keys(researchData[category] || {}),
    [category]
  )

  // Auto-select first subcategory ketika category berubah
  useEffect(() => {
    if (subcategories.length > 0 && !selectedSub) {
      setSelectedSub(subcategories[0])
    }
  }, [subcategories, selectedSub])

 const handleCalculate = (data) => {
  console.log('📥 [page.js] handleCalculate received data:', data)

  const resultWithId = { 
    ...data, 
    id: uuidv4(), // selalu id unik
    name: data.research || data.name || selectedSub, // fallback
    timestamp: Date.now()
  }

  console.log('🆔 [page.js] Final resultWithId:', resultWithId)

  // 💾 Simpan langsung ke history lebih dulu agar pasti tersimpan
  addToHistory(resultWithId)

  // 🔁 Update state untuk tampilan langsung
  setResults(prev => [...prev, resultWithId])

  toast.success('Added to Research History!')
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
              key={formKey}
              category={category}
              researchName={selectedSub}
              onCalculate={handleCalculate}
            />
          </div>
        </div>
      )}

      {/* ✅ PASS RESULTS KE TabSwitcherResearch (seperti di building) */}
      <div className="mt-10 md:px-6">
        <TabSwitcherResearch
          results={results} // ✅ INI YANG PENTING!
          compares={compares}
          onDeleteHistory={deleteHistory}
          onResetHistory={resetHistory}
        />
      </div>
    </main>
  )
}