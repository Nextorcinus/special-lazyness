export function formatToShortNumber(number) {
  if (typeof number !== 'number' || isNaN(number)) return '0'

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(1).replace(/\.0$/, '')} B`
  } else if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1).replace(/\.0$/, '')} M`
  } else if (number >= 1_000) {
    return `${(number / 1000).toFixed(2).replace(/\.?0+$/, '')} K`
  } else {
    return number.toString()
  }
}
