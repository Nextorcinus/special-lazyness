'use client'

import { useEffect, useState } from 'react'
import { levels } from '../data/levels'
import { Label } from '../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import { useGearHistory } from '../dashboard/gear/GearContext'

const gearParts = ['Cap', 'Watch', 'Coat', 'Pants', 'Belt', 'Weapon']

export default function GearForm({
  onSubmit,
  onReset,
  materialDataLoaded,
  resetTrigger,
}) {
  const initialState = {
    type: '',
    from: '',
    to: '',
  }

  const [selection, setSelection] = useState(initialState)
  const { resetGearParts } = useGearHistory()

  // Reset saat trigger aktif
  useEffect(() => {
    setSelection(initialState)
  }, [resetTrigger])

  const getLevelIndex = (level) => levels.indexOf(level)

  const handleChange = (field, value) => {
    setSelection((prev) => {
      const updated = { ...prev, [field]: value }

      // Pastikan "to" selalu lebih tinggi dari "from"
      if (
        field === 'from' &&
        updated.to &&
        getLevelIndex(updated.to) <= getLevelIndex(value)
      ) {
        updated.to = ''
      }

      return updated
    })
  }

  // --- Tombol Calculate ---
 const handleCalculate = (e) => {
  e.preventDefault()

  if (!selection.type || !selection.from || !selection.to) {
    toast.warning('Lengkapi semua pilihan terlebih dahulu.')
    return
  }

  if (!materialDataLoaded) {
    toast.warning('Data belum dimuat sepenuhnya.')
  }

  toast.success('Upgrade calculated successfully!')
  onSubmit(selection)
}


  // --- Tombol Reset Lokal ---
  const handleLocalReset = () => {
    setSelection(initialState)
    if (onReset) onReset()
    toast.info('Form telah direset.')
  }

  const availableToLevels = selection.from
    ? levels.slice(getLevelIndex(selection.from) + 1)
    : levels

  return (
    <div className="p-6 bg-special-inside rounded-xl space-y-6">
      <h2 className="text-xl">Select Gear Upgrade</h2>

    <div className="bg-glass-background2 sm:items-center p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-col-4 2xl:grid-cols-4 gap-4 ">

      <div>
        <Label className="text-white">Gear Type</Label>
        <Select
          value={selection.type}
          onValueChange={(val) => handleChange('type', val)}
        >
          <SelectTrigger className="bg-special-input text-white w-full">
            <SelectValue placeholder="Select Gear Type" />
          </SelectTrigger>
          <SelectContent>
            {gearParts.map((part) => (
              <SelectItem key={part} value={part}>
                {part}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">From</Label>
        
          <Select
            value={selection.from}
            onValueChange={(val) => handleChange('from', val)}
          >
            <SelectTrigger className="bg-special-input text-white">
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>
      <div>
        <Label className="text-white">To</Label>
        <Select
            value={selection.to}
            onValueChange={(val) => handleChange('to', val)}
            disabled={!selection.from}
          >
            <SelectTrigger className="bg-special-input text-white">
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {availableToLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>
    

   
      <div className="flex ">
        <Button
  type="button"
  onClick={handleCalculate}
  className="bg-orange-500 hover:bg-orange-400 text-sm md:text-base text-white  rounded-lg py-6 md:py-8"
>
  Calculate
</Button>
</div>
        
      </div>
    </div>
  )
}
