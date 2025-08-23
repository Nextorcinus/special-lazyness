'use client'

import { Input } from '../components/ui/input'

export default function FormattedNumberInput({ value, onChange, ...props }) {
  return (
    <Input
      type="text"
      inputMode="numeric"
      value={value === 0 ? '' : Number(value).toLocaleString()}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, '')
        if (!isNaN(raw)) {
          onChange(Number(raw))
        }
      }}
      {...props}
    />
  )
}
