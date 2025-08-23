'use client'

import { useState, useEffect, useRef } from 'react'
import GearForm from '../../components/GearForm'
import GearTable from '../../components/GearTable'
import GearProgress from '../../components/GearProgress'
import CompareFormGear from '../../components/CompareFormGear'
import { levels as levelsOrder } from '../../data/levels'
import rawMaterialData from '../../data/MaterialDataGear.json'
import { parseMaterialNumber } from '../../utils/parseMaterialNumber'
import { useGearHistory } from './GearContext'

const materialData = rawMaterialData.data || []

export default function GearPage() {
  const { resetFormTrigger } = useGearHistory()

  const [selectedGears, setSelectedGears] = useState([])
  const [ownResources, setOwnResources] = useState(null)

  const resultRef = useRef()
  const compareRef = useRef()

  const { updateHistory } = useGearHistory()

  const { history } = useGearHistory()

  useEffect(() => {
    if (!history || history.length === 0) {
      setSelectedGears([])
      return
    }

    const activeGears = history.map((entry) => entry.gear)
    setSelectedGears((prev) =>
      prev.filter((item) => activeGears.includes(item.gear))
    )
  }, [history])

  const handleFormSubmit = (selections) => {
    if (!materialData.length)
      return console.error('Material data belum dimuat!')

    const gearResults = []

    Object.entries(selections).forEach(([gearPart, { from, to }]) => {
      if (!from || !to) return

      const fromIndex = levelsOrder.indexOf(from)
      const toIndex = levelsOrder.indexOf(to)

      if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return

      for (let i = fromIndex; i < toIndex; i++) {
        const currentLevel = levelsOrder[i]
        const nextLevel = levelsOrder[i + 1]

        const upgradeData = materialData.find(
          (item) =>
            item.Type.toLowerCase() === gearPart.toLowerCase() &&
            item.Level.toLowerCase() === nextLevel.toLowerCase()
        )

        if (!upgradeData) return

        gearResults.push({
          gear: gearPart,
          from: currentLevel,
          to: nextLevel,
          plans: parseMaterialNumber(upgradeData.Plans),
          polish: parseMaterialNumber(upgradeData.Polish),
          alloy: parseMaterialNumber(upgradeData.Alloy),
          amber: parseMaterialNumber(upgradeData.Amber),
          svs: parseMaterialNumber(upgradeData['SvS Points']),
        })
      }

      if (from !== to) {
        updateHistory({ gear: gearPart, from, to })
      }
    })

    setSelectedGears(gearResults)
    resultRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleCompare = (resources) => {
    setOwnResources(resources)
    compareRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Reset total saat global trigger diaktifkan
  useEffect(() => {
    if (resetFormTrigger) {
      setSelectedGears([])
      setOwnResources(null)
    }
  }, [resetFormTrigger])

  const totalMaterial = selectedGears.reduce(
    (acc, item) => ({
      plans: acc.plans + item.plans,
      polish: acc.polish + item.polish,
      alloy: acc.alloy + item.alloy,
      amber: acc.amber + item.amber,
      svs: acc.svs + item.svs,
    }),
    { plans: 0, polish: 0, alloy: 0, amber: 0, svs: 0 }
  )

  return (
    <div className="p-4 md:p-6 text-white w-full">
      <div className="relative bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl text-white">Chief Gear Upgrade</h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6 w-full">
        <div className="w-full lg:w-8/12">
          <GearForm
            key={resetFormTrigger}
            onSubmit={handleFormSubmit}
            materialDataLoaded={materialData.length > 0}
            resetTrigger={resetFormTrigger}
          />
        </div>

        <div className="w-full lg:w-4/12">
          <CompareFormGear onCompare={handleCompare} />
        </div>
      </div>

      <div ref={resultRef} className="lg:flex-row gap-6 mt-6 w-full">
        <div ref={compareRef}>
          {selectedGears.length > 0 && (
            <>
              <GearTable data={selectedGears} compare={ownResources} />
              <GearProgress total={totalMaterial} compare={ownResources} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
