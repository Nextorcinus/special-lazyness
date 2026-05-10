'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '../components/ui/select'

export default function HybridSelect({
  value,
  onChange,
  options = [],
  placeholder,
  className = '',
}) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () =>
      setIsMobile(
        typeof window !== 'undefined' &&
          (window.innerWidth <= 865 ||
            /iPhone|iPod|Android/i.test(navigator.userAgent))
      )

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ✅ normalize value
  const safeValue = value === null || value === undefined ? '' : String(value)

  const safeOptions = options.map((opt) => ({
    value: String(opt.value),
    label: opt.label,
  }))

  // ✅ cari selected label manual
  const selectedOption = safeOptions.find((opt) => opt.value === safeValue)

  // === MOBILE ===
  if (isMobile) {
    return (
      <select
        value={safeValue}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-special-input text-white w-full rounded-md p-2 ${className}`}
      >
        <option value="">{placeholder}</option>
        {safeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    )
  }

  // === DESKTOP ===
  return (
    <Select value={safeValue} onValueChange={onChange}>
      <SelectTrigger
        className={`bg-special-input text-white w-full ${className}`}
      >
        <SelectValue placeholder={placeholder || 'Select'} />
      </SelectTrigger>

      <SelectContent
        position="popper"
        side="bottom"
        align="start"
        sideOffset={6}
        avoidCollisions={false}
        collisionPadding={0}
        className="z-[9999] max-h-[320px] overflow-y-auto"
      >
        {safeOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
