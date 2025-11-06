// app/utils/calculateResearch.js

/**
 * Format detik → string durasi, misalnya:
 * 3661 → "0d 1h 1m 1s"
 */
export function formatDuration(seconds) {
  const total = Math.floor(seconds || 0)
  const d = Math.floor(total / 86400)
  const h = Math.floor((total % 86400) / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return `${d}d ${h}h ${m}m ${s}s`
}

/**
 * Hitung total resource, waktu asli & waktu sesudah bonus untuk research.
 */
export function calculateResearchUpgrade({
  category,
  researchName,
  tier,
  fromLevel,
  toLevel,
  researchSpeed,
  vpBonus,
  data,
}) {
  const research = data?.[category]?.[researchName]?.tiers?.[tier]
  if (!Array.isArray(research)) return null

  const from = parseInt(fromLevel)
  const to = parseInt(toLevel)
  if (isNaN(from) || isNaN(to) || to <= from) return null

  // Ambil semua level dari (fromLevel, toLevel]
  const entries = research.filter((item) => item.level > from && item.level <= to)

  // === Hitung total waktu ===
  const totalRawTime = entries.reduce(
    (sum, item) => sum + (parseFloat(item.raw_time_seconds) || 0),
    0
  )

  const totalBonus =
    (parseFloat(researchSpeed) || 0) + (parseFloat(vpBonus) || 0)
  const finalTime =
    totalRawTime > 0 ? totalRawTime / (1 + totalBonus / 100) : 0

  // === Hitung total resource ===
  const totalResources = { Meat: 0, Wood: 0, Coal: 0, Iron: 0, Steel: 0 }
  for (const item of entries) {
    if (item.resources) {
      for (const key of Object.keys(totalResources)) {
        totalResources[key] += parseInt(item.resources[key] || 0)
      }
    }
  }

  // === Return hasil lengkap ===
  return {
    id: crypto.randomUUID(), // agar bisa disimpan ke history tanpa duplikat
    name: `${researchName} ${tier}`,
    fromLevel,
    toLevel,
    timeOriginal: formatDuration(totalRawTime),
    timeReduced: formatDuration(finalTime),
    resources: totalResources,
    buffs: {
      researchSpeed: parseFloat(researchSpeed) || 0,
      vpBonus: parseFloat(vpBonus) || 0,
    },
  }
}
