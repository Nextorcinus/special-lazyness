// utils/formatFromShortNumber.js

export function formatFromShortNumber(shortNumber) {
  if (typeof shortNumber !== 'string') return 0

  const trimmed = shortNumber.trim().toUpperCase()

  // Handle angka biasa
  if (!isNaN(trimmed) && !isNaN(parseFloat(trimmed))) {
    return parseFloat(trimmed)
  }

  // Handle format dengan K, M, B
  const match = trimmed.match(/^([\d.]+)\s*([KMB])?$/i)
  if (!match) return 0

  const number = parseFloat(match[1])
  const suffix = match[2]

  switch (suffix?.toUpperCase()) {
    case 'K':
      return number * 1_000
    case 'M':
      return number * 1_000_000
    case 'B':
      return number * 1_000_000_000
    default:
      return number
  }
}
