import basicData from '../data/BasicBuilding.json'
import fireCrystalData from '../data/buildings.json'

function parseDuration(str) {
  const d = str.match(/(\d+)d/)?.[1] || 0
  const h = str.match(/(\d+)h/)?.[1] || 0
  const m = str.match(/(\d+)m/)?.[1] || 0
  const s = str.match(/(\d+)s/)?.[1] || 0
  return +d * 1440 + +h * 60 + +m + +s / 60
}

function formatDuration(mins) {
  const totalSeconds = Math.round(mins * 60) // Konversi menit ke detik
  const d = Math.floor(totalSeconds / 86400) // 86400 detik = 1 hari
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60

  return `${d}d ${h}h ${m}m ${s}s`
}

function getPetBuff(level) {
  const map = {
    Off: 0,
    'Lv.1': 5,
    'Lv.2': 7,
    'Lv.3': 9,
    'Lv.4': 12,
    'Lv.5': 15,
  }
  return map[level] || 0
}

function getZinmanBuff(level) {
  const map = {
    Off: 0,
    'Lv.1': 3,
    'Lv.2': 6,
    'Lv.3': 9,
    'Lv.4': 12,
    'Lv.5': 15,
  }
  return map[level] || 0
}

// ✅ Tambahkan ini
const vpBuff = {
  Off: 0,
  '10%': 10,
  '20%': 20,
}

export function calculateUpgrade({
  category,
  building,
  fromLevel,
  toLevel,
  buffs,
}) {
  const data = category === 'Basic' ? basicData : fireCrystalData

  const buildingEntries = data.filter(
    (b) => b.Building?.trim().toLowerCase() === building.trim().toLowerCase()
  )

  const startIndex = buildingEntries.findIndex((b) => b.Level === fromLevel)
  const endIndex = buildingEntries.findIndex((b) => b.Level === toLevel)

  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    console.warn('Level tidak ditemukan dalam data:', { fromLevel, toLevel })
    return null
  }

  const range = buildingEntries.slice(startIndex + 1, endIndex + 1)

  let totalMins = 0
  const rawResources = {
    Meat: 0,
    Wood: 0,
    Coal: 0,
    Iron: 0,
    Crystal: 0,
    RFC: 0,
  }

  for (const r of range) {
    totalMins += parseDuration(r.Duration || '0m')
    rawResources.Meat += +r.Meat?.toString().replace(/[^0-9.]/g, '') || 0
    rawResources.Wood += +r.Wood?.toString().replace(/[^0-9.]/g, '') || 0
    rawResources.Coal += +r.Coal?.toString().replace(/[^0-9.]/g, '') || 0
    rawResources.Iron += +r.Iron?.toString().replace(/[^0-9.]/g, '') || 0
    rawResources.Crystal += +r.Crystal || 0
    rawResources.RFC += +r['Refined Fire Crystal'] || 0
  }

  const buffPercent =
    getPetBuff(buffs.petLevel) +
    (vpBuff[buffs.vpLevel] || 0) +
    getZinmanBuff(buffs.zinmanSkill) +
    (buffs.doubleTime ? 20 : 0) +
    (buffs.constructionSpeed || 0)

  const reducedMins = totalMins / (1 + buffPercent / 100)

  const totalSvsPoints = range.reduce((sum, item) => {
    const svs = parseInt(
      (item['SvS Points'] || '0').toString().replace(/,/g, '')
    )
    return sum + (isNaN(svs) ? 0 : svs)
  }, 0)

  return {
    building,
    fromLevel,
    toLevel,
    buffs,
    timeOriginal: formatDuration(totalMins),
    timeReduced: formatDuration(reducedMins),
    rawResources,
    resources: { ...rawResources },
    svsPoints: totalSvsPoints,
  }
}
