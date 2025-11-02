// utils/formatConstructionSpeed.js
export const formatConstructionSpeedInput = (input) => {
  // 1. Bersihkan semua kecuali angka dan satu titik
  const cleaned = input.replace(/[^0-9.]/g, '').replace(/\.+/g, '.')

  if (cleaned === '') return ''
  if (cleaned === '.') return '0.'

  // 2. Cek apakah input asli mengandung titik
  const hasDot = input.includes('.')

  // MODE DESIMAL (sudah ada titik)
  if (hasDot) {
    let num = parseFloat(cleaned)
    if (isNaN(num)) return '0.'
    if (num > 100) num = 100

    const [int, dec = ''] = cleaned.split('.')
    const limited = dec.slice(0, 2)
    return int + (limited ? '.' + limited : '')
  }

  // MODE INTEGER: ambil 4 digit terakhir
  const digits = cleaned.slice(-4)
  const value = parseInt(digits, 10)

  if (cleaned.length >= 4) {
    let num = value / 100
    if (num > 100) num = 100
    return num.toFixed(2)
  }

  // < 4 digit: tampilkan langsung
  let num = value
  if (num > 100) num = 100
  return num.toString()
}

export const formatConstructionSpeedOnBlur = (value) => {
  if (!value || value === '0.') return ''
  const num = Math.min(parseFloat(value) || 0, 100)
  return num.toFixed(2)
}
