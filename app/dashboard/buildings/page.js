'use client'

import { useState, useMemo, useEffect } from 'react'
import SubcategoryScroll from '../../components/SubcategoryScroll'
import BuildingForm from '../../components/BuildingForm'
import CompareForm from '../../components/CompareForm'
import TotalResult from '../../components/TotalResult'
import CategorySelector from '../../components/CategorySelector'
import ResourceIcon from '../../components/ResourceIcon'
import { formatToShortNumber } from '../../utils/formatToShortNumber'
import { v4 as uuidv4 } from 'uuid'
import { useHistory } from './HistoryContext'
import '../../globals.css'
import { useAddAnother } from './AddAnotherContext'
import { toast } from 'sonner'


//  TERIMA PROPS addAnotherTrigger
export default function Home({ addAnotherTrigger }) {
  const [category, setCategory] = useState('Basic')
  const [selectedSub, setSelectedSub] = useState('')
  const [results, setResults] = useState([])
  const [compares, setCompares] = useState([])

  const { history, addHistory, deleteHistory, resetHistory } = useHistory()
  useEffect(() => {
    setResults(history)
    setCompares(history.map(() => null))
  }, [history])

  //  RESET saat trigger berubah
  useEffect(() => {
    setCategory('Basic')
    setSelectedSub('')
  }, [addAnotherTrigger])

  // fallback untuk proteksi kesalahan sub kategori belum terpilih
  useEffect(() => {
    setSelectedSub('')
  }, [category])

  const { trigger } = useAddAnother()

  useEffect(() => {
    // Saat trigger berubah, reset ke default
    setCategory('Basic')
    setSelectedSub('')
  }, [trigger])

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

  const handleDeleteHistory = (id) => {
    deleteHistory(id)
    const updated = history.filter((item) => item.id !== id)
    setResults(updated)
    setCompares(updated.map(() => null))
  }

  const handleResetHistory = () => {
    resetHistory()
    setResults([])
    setCompares([])
    toast.success('History has been reset.')
  }

  const handleAddAnother = () => {
    setSelectedSub('')
    setCategory('Basic')
    // Jika perlu juga reset hasil sebelumnya
    // setResults([])
    // setCompares([])
  }

  // Listener untuk event dari layout
  useEffect(() => {
    const handler = () => handleAddAnother()
    window.addEventListener('add-another-building', handler)
    return () => window.removeEventListener('add-another-building', handler)
  }, [])

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
    <main className="p-1 md:p-6 text-white w-full">
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl text-white">Buildings Upgrade </h2>

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

      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl px-6">Upgrade Results</h2>

          {results.map((res, idx) => (
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
                <span className="text-zinc-400 text-base">
                  Original Time :{' '}
                </span>
                <span className="text-red-400 text-base">
                  {res.timeOriginal}
                </span>
                <span className="text-zinc-500">
                  {' '}
                  <br></br>{' '}
                </span>
                <span className="text-zinc-400">Reduce Time : </span>
                <span className="text-lime-500">{res.timeReduced}</span>
              </div>

              <div className="mt-1 text-zinc-400">
                SvS Points:{' '}
                <span className="text-base">
                  {formatToShortNumber(res.svsPoints || 0)}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 mb-5">Resources: </span>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-base">
                  {Object.entries(res.resources || {}).map(([key, value]) => {
                    const need = res.rawResources?.[key] || 0
                    const hasCompare = compares[idx] && key in compares[idx]
                    const have = hasCompare ? compares[idx][key] : null

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
                        className="flex flex-col items-end  px-0 py-1 rounded-xl mt-1"
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

          <TotalResult results={results} comparedData={compares[0]} />
        </div>
      )}
    </main>
  )
}
