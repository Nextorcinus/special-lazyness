// page.js
'use client'

import { useState, useMemo, useEffect } from 'react'
import SubcategoryScroll from './components/SubcategoryScroll'
import BuildingForm from './components/BuildingForm'
import CompareForm from './components/CompareForm'
import HistoryList from './components/HistoryList'
import { v4 as uuidv4 } from 'uuid'
import { formatToShortNumber } from './utils/formatToShortNumber'
import TotalResult from './components/TotalResult'
import ResourceIcon from './components/ResourceIcon'

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

  const handleCompare = (data) => {
    const updated = results.map(() => data)
    setCompares(updated)
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
    <main className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Building Upgrade Calculator</h1>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-full ${
            category === 'Basic' ? 'bg-green-500' : 'bg-gray-700'
          }`}
          onClick={() => {
            setCategory('Basic')
            setSelectedSub('')
          }}
        >
          Basic
        </button>
        <button
          className={`px-4 py-2 rounded-full ${
            category === 'Fire Crystal' ? 'bg-green-500' : 'bg-gray-700'
          }`}
          onClick={() => {
            setCategory('Fire Crystal')
            setSelectedSub('')
          }}
        >
          Fire Crystal
        </button>
      </div>

      <SubcategoryScroll
        items={buildings}
        selected={selectedSub}
        onSelect={setSelectedSub}
      />

      {selectedSub && (
        <>
          <BuildingForm
            category={category}
            selectedSub={selectedSub}
            onCalculate={handleCalculate}
          />
          <CompareForm
            requiredResources={defaultResources}
            onCompare={handleCompare}
          />
        </>
      )}

      {Array.isArray(results) && results.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold">Upgrade Results</h2>

          {results.map((res, idx) => (
            <div
              key={res.id}
              className="bg-gray-800 p-6 rounded-xl shadow-md space-y-4"
            >
              <div className="text-xl font-semibold">{res.building}</div>
              <div>
                From <strong>{res.fromLevel}</strong> →{' '}
                <strong>{res.toLevel}</strong>
              </div>
              <div>
                Time:{' '}
                <span className="text-yellow-400">{res.timeOriginal}</span> →{' '}
                <span className="text-green-400">{res.timeReduced}</span>
              </div>
              <div>
                <strong>Resources:</strong>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-md">
                  {Object.entries(res.resources || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2 text-md">
                      <ResourceIcon type={key} />
                      <span>{formatToShortNumber(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {compares[idx] && (
                <CompareForm
                  requiredResources={res.rawResources}
                  readonly
                  comparedData={compares[idx]}
                />
              )}
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
