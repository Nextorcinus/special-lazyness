'use client'

import React, { useState, useEffect, useMemo } from 'react'
import basicData from '../data/BasicBuilding.json'
import fireCrystalData from '../data/buildings.json'
import { calculateUpgrade } from '../utils/calculateUpgrade'

function BuildingForm({ category, selectedSub, defaultValues = {}, onCalculate }) {
  const [fromLevel, setFromLevel] = useState('')
  const [toLevel, setToLevel] = useState('')
  const [petLevel, setPetLevel] = useState('Lv.1')
  const [vipLevel, setVipLevel] = useState('Lv.1')
  const [doubleTime, setDoubleTime] = useState(false)
  const [zinmanSkill, setZinmanSkill] = useState('Lv.1')
  const [constructionSpeed, setConstructionSpeed] = useState(0)

  const data = category === 'Basic' ? basicData : fireCrystalData

  const levelOptions = useMemo(() => {
    const levels = data
      .filter(b => b.Building?.trim().toLowerCase() === selectedSub.trim().toLowerCase())
      .map(b => b.Level)

      return Array.from(new Set(levels)).sort((a, b) => {
        const parseLevel = (lvl) => parseFloat(String(lvl).replace(/[^\d.]/g, '')) || 0
        return parseLevel(a) - parseLevel(b)
      })
  }, [selectedSub, category])

  const filteredToLevels = useMemo(() => {
    if (!fromLevel) return levelOptions
    return levelOptions.filter(level => level > fromLevel)
  }, [fromLevel, levelOptions])

  useEffect(() => {
    if (defaultValues && selectedSub) {
      setFromLevel((prev) =>
        defaultValues.fromLevel && defaultValues.fromLevel !== prev
          ? defaultValues.fromLevel
          : prev
      )
      setToLevel((prev) =>
        defaultValues.toLevel && defaultValues.toLevel !== prev
          ? defaultValues.toLevel
          : prev
      )
      setPetLevel(defaultValues.buffs?.petLevel || 'Lv.1')
      setVipLevel(defaultValues.buffs?.vipLevel || 'Lv.1')
      setDoubleTime(defaultValues.buffs?.doubleTime || false)
      setZinmanSkill(defaultValues.buffs?.zinmanSkill || 'Lv.1')
      setConstructionSpeed(defaultValues.buffs?.constructionSpeed || 0)
    }
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

  const buffLevels = Array.from({ length: 30 }, (_, i) => `Lv.${i + 1}`)

  return (
    <div className="bg-gray-900 p-4 rounded-xl space-y-4 mt-6 text-white shadow-lg">
      <h2 className="text-xl font-bold">{selectedSub}</h2>

      {levelOptions.length === 0 && (
          <p className="text-red-400 text-sm">
          ⚠ Data level untuk &quot;{selectedSub}&quot; tidak ditemukan dalam JSON.
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
              <option key={level} value={level}>{level}</option>
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
              <option key={level} value={level}>{level}</option>
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
            {buffLevels.map((level) => (
              <option key={level}>{level}</option>
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
            {buffLevels.map((level) => (
              <option key={level}>{level}</option>
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
            {buffLevels.map((level) => (
              <option key={level}>{level}</option>
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
