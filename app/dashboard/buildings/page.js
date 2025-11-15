'use client'

import { useState, useMemo, useEffect } from 'react'
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



export default function Home({ addAnotherTrigger }) {
  const [category, setCategory] = useState('Basic')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])
  const [showCompareForm, setShowCompareForm] = useState(false)

  const { history, addHistory, deleteHistory, resetHistory } = useHistory()
  const { trigger } = useAddAnother()

  useEffect(() => {
    setResults(history)
    setCompares((prev) => {
      const updated = [...prev]
      while (updated.length < history.length) updated.push(null)
      return updated.slice(0, history.length)
    })
  }, [history])

  useEffect(() => {
    setCategory('Basic')
    setSelectedSub('')
  }, [addAnotherTrigger, trigger])

  useEffect(() => {
    setSelectedSub('')
  }, [category])

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

  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }
    setResults((prev) => [...prev, resultWithId])
    setCompares((prev) => [...prev, null])
    addHistory(resultWithId)

  setTimeout(() => {
    document.getElementById("latest-result")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    })
  }, 150)

  }

  const handleCompareSubmit = (compareData) => {
    if (!compareData) return
    setCompares((prev) => {
      const updated = [...prev]
      for (let i = 0; i < results.length; i++) {
        updated[i] = compareData
      }
      return updated
    })
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

  const defaultResources = useMemo(
    () => ({
      Meat: '0',
      Wood: '0',
      Coal: '0',
      Iron: '0',
      Crystal: '0',
      RFC: '0',
    }),
    []
  )

  return (
    <main className=" text-white w-full">  
      <div className="relative w-full md:p-6 ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl text-white ">Buildings Upgrade</h2>
          <CategorySelector selected={category} onChange={setCategory} />
        </div>
        <SubcategoryScroll
          items={buildings}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

      {/* === Building Form + Compare Button === */}
      {selectedSub && (
        <div className="flex flex-col md:px-6 lg:flex-row gap-6 mt-2 w-full">
          <div className="w-full">
            <BuildingForm
              category={category}
              selectedSub={selectedSub}
              onCalculate={handleCalculate}
            />

            {/* Tombol Compare selalu tampil */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowCompareForm(true)}
                className="buttonGlass flex gap-2 text-sm md:text-base "
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
                Compare Resources
              </button>
            </div>
          </div>
        </div>
      )}

 

      {/* === POPUP Compare Form === */}
      {showCompareForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#ffffff35] bg-blur p-6 rounded-xl border border-white/20 w-[90%] max-w-lg relative">
            <button
              onClick={() => setShowCompareForm(false)}
              className="absolute top-2 right-2 text-xl text-red-400 hover:text-white"
            >
              ✕
            </button>
            
            <CompareForm
              comparedData={compares[0] || {}}
              onCompare={handleCompareSubmit}
              onCancel={() => setShowCompareForm(false)}
            />
          </div>
        </div>
      )}


    {/* === Results Section === */}
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
