'use client'

import { useState, useMemo, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'

import HeliosCategorySelector from '../../components/HeliosCategorySelector'
import HeliosSubcategoryScroll from '../../components/HeliosSubCategorySelector'
import HeliosForm from '../../components/HeliosForm'
import HeliosCompareForm from '../../components/HeliosCompareForm'
import HeliosTotalResult from '../../components/HeliosTotalResult'
import ResourceIcon from '../../components/ResourceIcon'
import { formatToShortNumber } from '../../utils/formatToShortNumber'

import heliosData from '../../data/HeliosResearch.json'
import { useHeliosHistory } from './HeliosHistoryContext'
import { useAddAnother } from '../../dashboard/research/AddAnotherContext'

export default function HeliosPage({ addAnotherTrigger }) {
  const { history, addToHistory, deleteHistory, resetHistory } =
    useHeliosHistory()
  const { trigger } = useAddAnother()

  const [category, setCategory] = useState('Infantry')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])

  const subcategories = useMemo(
    () => Object.keys(heliosData[category] || {}),
    [category]
  )

  useEffect(() => {
    setResults(history)
    setCompares(history.map(() => null))
  }, [history])

  useEffect(() => {
    setCategory('Infantry')
    setSelectedSub('')
  }, [trigger, addAnotherTrigger])

  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }
    setResults((prev) => [...prev, resultWithId])
    setCompares((prev) => [...prev, null])
    addToHistory(resultWithId)

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  const handleCompare = (data, index = null) => {
    setCompares((prev) => {
      const updated = [...prev]
      if (index === null) {
        return prev.map(() => data)
      } else {
        updated[index] = data
        return updated
      }
    })
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

  const defaultResources = useMemo(
    () => ({
      Meat: 0,
      Wood: 0,
      Coal: 0,
      Iron: 0,
      Steel: 0,
      'FC Shards': 0,
    }),
    []
  )

  return (
    <main className="p-1 md:p-6 text-white w-full">
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl">Helios Research</h2>
        <HeliosCategorySelector
          selected={category}
          onChange={setCategory}
          categories={['Infantry', 'Marksman', 'Lancer']}
        />
        <HeliosSubcategoryScroll
          items={subcategories}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

      {selectedSub && (
        <div className="flex flex-col lg:flex-row gap-6 mt-6 w-full">
          <div className="w-full lg:w-8/12">
            <HeliosForm
              category={category}
              researchName={selectedSub}
              onCalculate={handleCalculate}
              dataSource={heliosData}
            />
          </div>
          <div className="w-full lg:w-4/12">
            <HeliosCompareForm
              requiredResources={defaultResources}
              onCompare={handleCompare}
            />
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl px-6">Helios Results</h2>

          {results.map((res, index) => (
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

              <div>
                <span className="text-zinc-400 mb-5">Resources:</span>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-base">
                  {Object.entries(res.resources || {}).map(([key, value]) => {
                    const need = res.resources?.[key] || 0
                    const hasCompare = compares[0] && key in compares[0]
                    const have = hasCompare ? compares[0][key] : null

                    const diff = have - need
                    const isMatch = diff === 0
                    const color =
                      diff > 0
                        ? 'text-green-300 bg-green-700 px-2 py-1'
                        : diff < 0
                        ? 'text-red-300 bg-red-500/20 px-2 py-1'
                        : 'text-gray-200 bg-gray-700 px-2 py-1'
                    const label =
                      diff > 0 ? 'Extra +' : diff < 0 ? 'Need -' : 'Match'

                    return (
                      <div
                        key={key}
                        className="flex flex-col items-end px-0 py-1 rounded-xl mt-1"
                      >
                        <div className="flex items-center justify-between gap-1 text-lime-400 text-sm md:text-base w-full">
                          <ResourceIcon type={key} />
                          {formatToShortNumber(value)}
                        </div>
                        {hasCompare && (
                          <div
                            className={`text-xs md:text-sm rounded-md mt-1 ${color}`}
                          >
                            {label}
                            {!isMatch && (
                              <> {formatToShortNumber(Math.abs(diff))}</>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}

          <HeliosTotalResult results={results} comparedData={compares[0]} />
        </div>
      )}
    </main>
  )
}
