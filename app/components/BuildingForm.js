'use client'

import React, { useState, useEffect, useMemo } from 'react'
import basicData from '../data/BasicBuilding.json'
import fireCrystalData from '../data/buildings.json'
import { calculateUpgrade } from '../utils/calculateUpgrade'

const buildingAliasMap = {
  Marksman: 'Marksman',
  Lancer: 'Lancer Camp',
  Infantry: 'Infantry Camp',
  Research: 'Research Center',
  Infirmary: 'Infirmary',
  Command: 'Command Center',
  Store: 'Store House',
  Embassy: 'Embassy',
  Barricade: 'Barricade',
}

function BuildingForm({
  category,
  selectedSub,
  defaultValues = {},
  onCalculate,
}) {
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [petLevel, setPetLevel] = useState('Off')
  const [vipLevel, setVipLevel] = useState('Off')
  const [doubleTime, setDoubleTime] = useState(false)
  const [zinmanSkill, setZinmanSkill] = useState('Off')
  const [constructionSpeed, setConstructionSpeed] = useState(0)

  const data = category === 'Basic' ? basicData : fireCrystalData
  const normalizedBuilding = buildingAliasMap[selectedSub] || selectedSub

  const levelOptions = useMemo(() => {
    const levels = data
      .filter(
        (b) =>
          b.Building?.trim().toLowerCase() ===
          normalizedBuilding.trim().toLowerCase()
      )
      .map((b) => b.Level)

    return Array.from(new Set(levels)).sort((a, b) => {
      const parseLevel = (lvl) =>
        parseFloat(String(lvl).replace(/[^\d.]/g, '')) || 0
      return parseLevel(a) - parseLevel(b)
    })
  }, [normalizedBuilding, data])

  const filteredToLevels = useMemo(() => {
    if (!fromLevel) return levelOptions
    return levelOptions.filter((level) => level > fromLevel)
  }, [fromLevel, levelOptions])

  useEffect(() => {
    if (!defaultValues || !selectedSub) return

    setFromLevel((prev) => prev || defaultValues.fromLevel || '')
    setToLevel((prev) => prev || defaultValues.toLevel || '')
    setPetLevel((prev) => prev || defaultValues.buffs?.petLevel || 'Off')
    setVipLevel((prev) => prev || defaultValues.buffs?.vipLevel || 'Off')
    setDoubleTime((prev) =>
      typeof prev === 'boolean'
        ? prev
        : defaultValues.buffs?.doubleTime || false
    )
    setZinmanSkill((prev) => prev || defaultValues.buffs?.zinmanSkill || 'Off')
    setConstructionSpeed(
      (prev) => prev || defaultValues.buffs?.constructionSpeed || 0
    )
  }, [defaultValues, selectedSub])

  const handleSubmit = () => {
    const result = calculateUpgrade({
      category,
      building: selectedSub,
      fromLevel,
      toLevel,
      buffs: {
        petLevel,
        vipLevel,
        doubleTime,
        zinmanSkill,
        constructionSpeed: +constructionSpeed,
      },
    })

    if (result) {
      onCalculate(result)
    } else {
      alert('Level tidak valid atau data tidak ditemukan')
    }
  }

  const petLevels = ['Off', 'Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5']
  const vipLevels = [
    'Off',
    'VIP 4',
    'VIP 5',
    'VIP 6',
    'VIP 7',
    'VIP 8',
    'VIP 9',
    'VIP 10',
    'VIP 11',
    'VIP 12',
  ]
  const zinmanLevels = ['Off', 'Lv.1', 'Lv.2', 'Lv.3', 'Lv.4', 'Lv.5']

  return (
    <div className="bg-gray-900 p-4 rounded-xl space-y-4 mt-6 text-white shadow-lg">
      <h2 className="text-xl font-bold">{selectedSub}</h2>

      {levelOptions.length === 0 && (
        <p className="text-red-400 text-sm">
          ⚠ Data level untuk &quot;{selectedSub}&quot; tidak ditemukan dalam
          JSON.
        </p>
      )}

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block font-medium mb-1">From</label>
          <select
            value={fromLevel}
            onChange={(e) => {
              setFromLevel(e.target.value)
              setToLevel('')
            }}
            className="w-full bg-gray-800 text-white p-2 rounded"
          >
            <option value="">-- Select Level --</option>
            {levelOptions.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block font-medium mb-1">To</label>
          <select
            value={toLevel}
            onChange={(e) => setToLevel(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded"
          >
            <option value="">-- Select Level --</option>
            {filteredToLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Pet</label>
          <select
            value={petLevel}
            onChange={(e) => setPetLevel(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded"
          >
            {petLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">VIP</label>
          <select
            value={vipLevel}
            onChange={(e) => setVipLevel(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded"
          >
            {vipLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <input
            type="checkbox"
            checked={doubleTime}
            onChange={(e) => setDoubleTime(e.target.checked)}
          />
          <label>Double Time</label>
        </div>
        <div>
          <label className="block mb-1">Zinman Skill</label>
          <select
            value={zinmanSkill}
            onChange={(e) => setZinmanSkill(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded"
          >
            {zinmanLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1">Construction Speed (%)</label>
          <input
            type="number"
            value={constructionSpeed}
            onChange={(e) => setConstructionSpeed(e.target.value)}
            className="w-full bg-gray-800 text-white p-2 rounded"
            min={0}
            max={100}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
      >
        Calculate Upgrade
      </button>
    </div>
  )
}

export default BuildingForm
