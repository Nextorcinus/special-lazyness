// utils/parseNumber.js

export function parseNumber(value) {
  if (typeof value === 'number') return value;

  const str = value.toString().replace(/,/g, '').trim().toUpperCase();

  if (str.endsWith('B')) return parseFloat(str) * 1e9;
  if (str.endsWith('M')) return parseFloat(str) * 1e6;
  if (str.endsWith('K')) return parseFloat(str) * 1e3;

  return parseFloat(str);
}
