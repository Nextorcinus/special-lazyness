import basicData from '../data/BasicBuilding.json'
import fireCrystalData from '../data/buildings.json'

// Utility untuk konversi string durasi ke detik
function parseDurationToSeconds(str) {
  const d = str.match(/(\d+)d/)?.[1] || 0
  const h = str.match(/(\d+)h/)?.[1] || 0
  const m = str.match(/(\d+)m/)?.[1] || 0
  return +d * 86400 + +h * 3600 + +m * 60
}

// Format detik ke string waktu
function formatDuration(seconds) {
  const d = Math.floor(seconds / 86400)
  const h = Math.floor((seconds % 86400) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return `${d}d ${h}h ${m}m ${s}s`
}

// parse untuk menyeesuaikan buff didalam input
function normalizeBuff(value, map = {}) {
  return map[value] ?? (parseFloat(value) || 0)
}

// Mapping Buffs
const petBuffMap = {
  Off: 0,
  'Lv.1': 5,
  'Lv.2': 7,
  'Lv.3': 9,
  'Lv.4': 12,
  'Lv.5': 15,
}

const zinmanBuffMap = {
  Off: 0,
  'Lv.1': 3,
  'Lv.2': 6,
  'Lv.3': 9,
  'Lv.4': 12,
  'Lv.5': 15,
}

const vpBuffMap = {
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
    // console.warn(' Level not found on data:', { fromLevel, toLevel })
    return null
  }

  const range = buildingEntries.slice(startIndex + 1, endIndex + 1)

  let totalSeconds = 0
  const rawResources = {
    Meat: 0,
    Wood: 0,
    Coal: 0,
    Iron: 0,
    Crystal: 0,
    RFC: 0,
  }

  const zinman = normalizeBuff(buffs.zinmanSkill, zinmanBuffMap)
  const zinmanMultiplier = 1 - zinman / 100

  // console.log(
  //   'Building Range:',
  //   range.map((r) => r.Level)
  // )

  for (const r of range) {
    const seconds = parseDurationToSeconds(r.Duration || '0m')
    totalSeconds += seconds

    // console.log(`Duration ${r.Level}: ${r.Duration} = ${seconds}s`)

    // Calculate Zinman skill
    rawResources.Meat +=
      (+r.Meat?.toString().replace(/[^0-9.]/g, '') || 0) * zinmanMultiplier
    rawResources.Wood +=
      (+r.Wood?.toString().replace(/[^0-9.]/g, '') || 0) * zinmanMultiplier
    rawResources.Coal +=
      (+r.Coal?.toString().replace(/[^0-9.]/g, '') || 0) * zinmanMultiplier
    rawResources.Iron +=
      (+r.Iron?.toString().replace(/[^0-9.]/g, '') || 0) * zinmanMultiplier

    // Zinman tidak mempengaruhi RFC dan Crystal
    rawResources.Crystal += +r.Crystal || 0
    rawResources.RFC += +r['Refined Fire Crystal'] || 0
  }

  const constructionSpeed = parseFloat(buffs.constructionSpeed) || 0
  const vp = normalizeBuff(buffs.vpLevel, vpBuffMap)
  const pet = normalizeBuff(buffs.petLevel, petBuffMap)
  const doubleTime = buffs.doubleTime ? 20 : 0

  const totalBuff = constructionSpeed + vp + pet + doubleTime // hapus Zinman tidak mempengaruhi waktu

  // console.log(' Buff Breakdown:', {
  //   constructionSpeed,
  //   vp,
  //   pet,
  //   zinman,
  //   doubleTime,
  //   totalBuffPercent: totalBuff,
  // })

  const reducedSeconds = totalSeconds / (1 + totalBuff / 100)

  // console.log(' Total Seconds:', totalSeconds)
  // console.log(' Reduced Seconds:', reducedSeconds)
  // console.log(' Formatted Original:', formatDuration(totalSeconds))
  // console.log(' Formatted Reduced:', formatDuration(reducedSeconds))
  // console.log(' Total Resources:', rawResources)

  return {
    building,
    fromLevel,
    toLevel,
    buffs,
    timeOriginal: formatDuration(totalSeconds),
    timeReduced: formatDuration(reducedSeconds),
    rawResources,
    resources: { ...rawResources },
    svsPoints: range.reduce((sum, r) => {
      const svs = parseInt(
        (r['SvS Points'] || '0').toString().replace(/,/g, '')
      )
      return sum + (isNaN(svs) ? 0 : svs)
    }, 0),
  }
}
