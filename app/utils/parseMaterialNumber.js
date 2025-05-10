// utils/parseMaterialNumber.js

export function parseMaterialNumber(value) {
  if (typeof value === 'number') return value

  const cleaned = value.toString().replace(/,/g, '').trim()

  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}
