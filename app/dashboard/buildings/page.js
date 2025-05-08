// page.js
'use client'

import { useState, useMemo, useEffect } from 'react'
import SubcategoryScroll from '../../components/SubcategoryScroll'
import BuildingForm from '../../components/BuildingForm'
import CompareForm from '../../components/CompareForm'
import HistoryList from '../../components/HistoryList'
import { v4 as uuidv4 } from 'uuid'
import { formatToShortNumber } from '../../utils/formatToShortNumber'
import TotalResult from '../../components/TotalResult'
import ResourceIcon from '../../components/ResourceIcon'
import CategorySelector from '../../components/CategorySelector'
import '../../globals.css'

export default function Home() {
  const [category, setCategory] = useState('Basic')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])
  const [history, setHistory] = useState([])

  const basicBuildings = [
    'Barricade',
    'Marksman',
    'Lancers',
    'Infantry',
    'Research Center',
    'Infirmary',
    'Command Center',
    'Embassy',
    'Store House',
    'Furnace',
  ]

  const fireCrystalBuildings = [
    'FC Academy',
    'FC Marksman',
    'FC Lancers',
    'FC Infantry',
    'FC Embassy',
    'FC Infirmary',
    'FC Command Center',
    'FC Furnace',
  ]

  const buildings = category === 'Basic' ? basicBuildings : fireCrystalBuildings

  useEffect(() => {
    const saved = localStorage.getItem('buildingHistory')
    if (saved) {
      const parsed = JSON.parse(saved)
      setHistory(parsed)
      setResults(parsed)
      setCompares(parsed.map(() => null))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('buildingHistory', JSON.stringify(history))
  }, [history])

  const handleCalculate = (data) => {
    const resultWithId = { ...data, id: uuidv4() }
    setResults((prev) => [...prev, resultWithId])
    setCompares((prev) => [...prev, null])
    setHistory((prev) => [...prev, resultWithId])

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    }, 100)
  }

  const handleCompare = (data, index = null) => {
    if (index === null) {
      // Compare input utama (global)
      setCompares((prev) => prev.map(() => data))
    } else {
      // Compare untuk hasil spesifik
      setCompares((prev) => {
        const updated = [...prev]
        updated[index] = data
        return updated
      })
    }
  }

  const handleDeleteHistory = (id) => {
    const updated = history.filter((item) => item.id !== id)
    setHistory(updated)
    setResults(updated)
    setCompares(updated.map(() => null))
  }

  const handleResetHistory = () => {
    setHistory([])
    setResults([])
    setCompares([])
    localStorage.removeItem('buildingHistory')
  }

  const handleAddAnother = () => {
    setSelectedSub('')
    setCategory('Basic')
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
    <main className="p-6 text-white w-full">
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl text-white">Buildings Upgrade Details</h2>

        <CategorySelector selected={category} onChange={setCategory} />
        <SubcategoryScroll
          items={buildings}
          selected={selectedSub}
          onSelect={setSelectedSub}
        />
      </div>

      {selectedSub && (
        <div className="flex flex-col lg:flex-row gap-6 mt-6 w-full">
          <div className="w-full lg:w-8/12">
            <BuildingForm
              category={category}
              selectedSub={selectedSub}
              onCalculate={handleCalculate}
            />
          </div>
          <div className="w-full lg:w-4/12">
            <CompareForm
              requiredResources={defaultResources}
              onCompare={handleCompare}
            />
          </div>
        </div>
      )}

      {Array.isArray(results) && results.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl">Upgrade Results</h2>

          {results.map((res, idx) => (
            <div
              key={res.id}
              className="bg-special-inside p-6 rounded-xl shadow-2xl space-y-4 border border-zinc-800 text-yellow-400"
            >
              <div className="text-lg lg:text-xl text-zinc-300 border-b border-zinc-700 pb-4">
                {res.building}
              </div>
              <div>
                <span className="text-zinc-400">From</span> {res.fromLevel} →{' '}
                {res.toLevel}
              </div>
              <div>
                <span className="text-zinc-400">Original Time : </span>
                <span className="text-red-400">{res.timeOriginal}</span>{' '}
                <span className="text-zinc-500">-</span>{' '}
                <span className="text-zinc-400">Reduce Time : </span>{' '}
                <span className="text-lime-400">{res.timeReduced}</span>
              </div>
              <div>
                <span className="text-red-400 mb-5">Resources: </span>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-md">
                  {Object.entries(res.resources || {}).map(([key, value]) => {
                    const need = res.rawResources?.[key] || 0
                    const hasCompare = compares[idx] && key in compares[idx]
                    const have = hasCompare ? compares[idx][key] : null

                    const diff = have - need
                    const status = diff >= 0 ? 'Surplus' : 'Missing'
                    const color = diff >= 0 ? 'text-green-400' : 'text-red-400'
                    const display = diff >= 0 ? '+' : '-'

                    return (
                      <div
                        key={key}
                        className="flex flex-col items-end bg-black/30 px-3 py-4 rounded-xl border border-zinc-800 mt-1"
                      >
                        <div className="flex items-center gap-1 text-lime-500 text-md md:text-lg">
                          <ResourceIcon type={key} />
                          {formatToShortNumber(value)}
                        </div>
                        {hasCompare && (
                          <div className={`text-sm ${color}`}>
                            {display}
                            {formatToShortNumber(Math.abs(have - need))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}

          {/* Tambahkan Total Result di sini */}
          <TotalResult results={results} />
        </div>
      )}

      <HistoryList
        history={history}
        onDelete={handleDeleteHistory}
        onReset={handleResetHistory}
        onAdd={handleAddAnother}
      />
    </main>
  )
}
