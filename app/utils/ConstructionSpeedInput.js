// utils/formatConstructionSpeed.js
export const formatConstructionSpeedInput = (raw) => {
  // 1. Bersihkan semua kecuali angka & titik
  const cleaned = raw.replace(/[^0-9.]/g, '')

  if (cleaned === '') return ''

  // 2. Apakah user sedang mengetik titik desimal?
  const hasDot = raw.includes('.')

  // -------------------------------------------------
  //  MODE DESIMAL (user sudah ketik titik)
  // -------------------------------------------------
  if (hasDot) {
    let num = parseFloat(cleaned)
    if (isNaN(num)) return ''
    if (num > 100) num = 100

    // Batasi 2 angka di belakang koma saat mengetik
    const [int, dec = ''] = cleaned.split('.')
    const limitedDec = dec.slice(0, 2)
    return `${int}${limitedDec ? '.' + limitedDec : ''}`
  }

  // -------------------------------------------------
  //  MODE INTEGER (belum ada titik)
  // -------------------------------------------------
  // Ambil maksimal 4 digit terakhir → mencegah overflow
  const digits = cleaned.slice(-4)
  const intVal = parseInt(digits, 10)

  if (cleaned.length >= 4) {
    // 4+ digit → bagi 100
    let num = intVal / 100
    if (num > 100) num = 100
    return num.toFixed(2)
  }

  // < 4 digit → tampilkan apa adanya (tapi tetap batasi 100)
  let num = intVal
  if (num > 100) num = 100
  return num.toString()
}

export const formatConstructionSpeedOnBlur = (value) => {
  if (!value) return ''
  const num = Math.min(parseFloat(value) || 0, 100)
  return num.toFixed(2)
}
