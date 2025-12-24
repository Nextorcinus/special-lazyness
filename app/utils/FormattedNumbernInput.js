'use client'

import { Input } from '../components/ui/input'

export default function FormattedNumberInput({ value, onChange, ...props }) {
  const displayValue =
    value === null || value === undefined || value === 0
      ? ''
      : Number(value).toLocaleString('en-US')

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, '')

        if (raw === '') {
          onChange(0)
          return
        }

        const numeric = Number(raw)
        if (!Number.isNaN(numeric)) {
          onChange(numeric)
        }
      }}
      {...props}
    />
  )
}
