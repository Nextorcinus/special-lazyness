'use client'

import { useState, useEffect, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

import ResearchCategorySelector from '../../components/ResearchCategorySelector'
import ResearchSubcategoryScroll from '../../components/ResearchSubcategoryScroll'
import ResearchForm from '../../components/ResearchForm'
import ResearchTotalResult from '../../components/ResearchTotalResult'
import ResourceIcon from '../../components/ResourceIcon'

import researchData from '../../data/MaterialBasicResearch'
import { useResearchHistory } from '../../dashboard/research/ResearchHistoryContext'
import { useAddAnother } from '../../dashboard/research/AddAnotherContext'

export default function ResearchPage() {
  const { history, addToHistory } = useResearchHistory()
  const { trigger } = useAddAnother()

  const [category, setCategory] = useState('Growth')
  const [selectedSub, setSelectedSub] = useState('')

  // reset form saat +Add Another ditekan
  useEffect(() => {
    setCategory('Growth')
    setSelectedSub('')
  }, [trigger])

  // reset subkategori saat ganti kategori
  useEffect(() => {
    setSelectedSub('')
  }, [category])

  const subcategories = useMemo(
    () => Object.keys(researchData[category] || {}),
    [category]
  )

  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }
    addToHistory(resultWithId)

    // scroll ke bawah
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  const formatTime = (seconds) => {
    const d = Math.floor(seconds / 86400)
    const h = Math.floor((seconds % 86400) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    const parts = []
    if (d) parts.push(`${d}d`)
    if (h) parts.push(`${h}h`)
    if (m) parts.push(`${m}m`)
    if (s || parts.length === 0) parts.push(`${s}s`)
    return parts.join(' ')
  }

  return (
    <main className="p-1 md:p-6 text-white w-full">
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl">Research Upgrade</h2>
        <ResearchCategorySelector selected={category} onChange={setCategory} />
        <ResearchSubcategoryScroll
          items={subcategories}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

      {selectedSub && (
        <div className="mt-6 w-full md:w-3/4">
          <ResearchForm
            category={category}
            researchName={selectedSub}
            onCalculate={handleCalculate}
          />
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl px-6">Research Results</h2>

          {history.map((res) => (
            <div
              key={res.id}
              className="bg-special-inside p-6 rounded-xl shadow-2xl space-y-2 border border-zinc-800 text-yellow-400"
            >
              <div className="text-base lg:text-xl text-zinc-300 border-b border-zinc-700 pb-2 mb-2">
                {res.building}
              </div>

              <div>
                <span className="text-zinc-400">From</span> {res.fromLevel} →{' '}
                <span>{res.toLevel}</span>
              </div>

              <div>
                <span className="text-zinc-400">Original Time:</span>{' '}
                <span className="text-red-400">
                  {formatTime(res.timeOriginal)}
                </span>
              </div>

              <div>
                <span className="text-zinc-400">Reduced Time:</span>{' '}
                <span className="text-lime-400">
                  {formatTime(res.timeReduced)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-white mt-2">
                {Object.entries(res.resources || {}).map(([key, val]) => (
                  <div key={key} className="flex items-center gap-1">
                    <ResourceIcon type={key} />
                    <span>{val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <ResearchTotalResult results={history} />
        </div>
      )}
    </main>
  )
}
