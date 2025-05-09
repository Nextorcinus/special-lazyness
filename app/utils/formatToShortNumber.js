// utils/formatToShortNumber.js

export function formatToShortNumber(number) {
  if (typeof number !== 'number' || isNaN(number)) return '0'

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(1)} B`
  } else if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)} M`
  } else if (number >= 1_000) {
    return `${(number / 1_000).toFixed(2)} K`
  } else {
    return number.toString()
  }
}
