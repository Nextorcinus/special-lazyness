'use client'

import { useState, useEffect, useMemo } from 'react'
import CharmForm from '../../components/CharmForm'
import CompareFormCharm from '../../components/CharmFormCompare'
import TabSwitcherCharm from '../../components/tabSwitcherCharm'
import { v4 as uuidv4 } from 'uuid'
import { useCharmHistory } from './CharmHistoryContext'
import { toast } from 'sonner'
import '../../globals.css'

export default function CharmPage() {
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState({
    guide: 0,
    design: 0,
    jewel: 0,
    svs: 0,
  })
  const [showCompareForm, setShowCompareForm] = useState(false)
  const [tab, setTab] = useState('overview')

  const { history, addHistory, deleteHistory, resetHistory } = useCharmHistory()

  useEffect(() => {
    setResults(history)
  }, [history])

  const handleCalculate = (data) => {
    if (!data || !data.type || !data.from || !data.to) {
      toast.warning('Please fill all required fields.')
      return
    }

    const resultWithId = {
      ...data,
      id: uuidv4(),
    }

    setResults((prev) => [...prev, resultWithId])
    addHistory(resultWithId)

    toast.success('Charm upgrade calculated!')
    setTimeout(() => {
      document.getElementById('latest-result')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 200)
  }

  const handleCompareSubmit = (compareData) => {
    if (results.length === 0) {
      toast.error(
        'No calculation result available, please submit a calculation first.'
      )
      return
    }

    setCompares({
      guide: Number(compareData.guide || 0),
      design: Number(compareData.design || 0),
      jewel: Number(compareData.jewel || 0),
      svs: Number(compareData.svs || 0),
    })

    setShowCompareForm(false)
    toast.success('Comparison applied to all results!')
  }

  const handleDeleteHistory = (id) => {
    deleteHistory(id)
    const updated = results.filter((item) => item.id !== id)
    setResults(updated)
  }

  const handleResetHistory = () => {
    resetHistory()
    setResults([])
    toast.success('Charm history has been reset.')
  }

  const defaultResources = useMemo(
    () => ({
      guide: 0,
      design: 0,
      jewel: 0,
      svs: 0,
    }),
    []
  )

  return (
    <main className="text-white w-full">
      <div className="relative w-full md:px-6 md:py-0 py-4 mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
          <h2 className="text-2xl text-white px-6">Chief Charm</h2>
        </div>
      </div>

      <div className="flex flex-col md:p-6 lg:flex-row gap-6 w-full">
        <div className="w-full">
          <CharmForm
            onSubmit={handleCalculate}
            onAutoSwitch={() => setTab('overview')}
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

      {showCompareForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#ffffff35] backdrop-blur p-6 rounded-xl border border-white/20 w-[90%] max-w-lg relative">
            <button
              onClick={() => setShowCompareForm(false)}
              className="absolute top-2 right-2 text-xl text-red-400 hover:text-white"
            >
              ✕
            </button>

            <CompareFormCharm
              onCompare={handleCompareSubmit}
              comparedData={compares}
              onCancel={() => setShowCompareForm(false)}
            />
          </div>
        </div>
      )}

      {Array.isArray(results) && results.length > 0 && (
        <div className="md:p-6 mt-8 space-y-6 w-full">
          <TabSwitcherCharm
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
