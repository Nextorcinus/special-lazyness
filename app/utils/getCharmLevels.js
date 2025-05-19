import charmData from '@/data/MaterialDatacharm.json'

export function getCharmLevels() {
  // Ambil satu bagian gear untuk asumsi level range yang sama
  const sampleGear = Object.keys(charmData)[0]
  const sampleLevels = charmData[sampleGear]

  // Cari level tertinggi dari key level
  const maxLevel = Math.max(
    ...Object.keys(sampleLevels).map((lvl) => parseInt(lvl))
  )

  // Hasilkan array level dari 0 sampai maxLevel
  return Array.from({ length: maxLevel + 1 }, (_, i) => `${i}`)
}
