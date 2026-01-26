'use client'

import { useState, useEffect } from 'react'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { toast } from 'sonner'
import ResourceIcon from './ResourceIcon'

export default function CompareFormCharm({ onCompare, comparedData = {} }) {
  const [form, setForm] = useState({
    guide: '',
    design: '',
    jewel: '',
  })

  // setiap kali comparedData berubah (misalnya dari hasil submit sebelumnya)
  // isi ulang form agar selalu sinkron
  useEffect(() => {
    setForm({
      guide: comparedData.guide || '',
      design: comparedData.design || '',
      jewel: comparedData.jewel || '',
    })
  }, [comparedData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // parsing nilai menjadi angka
    const parsed = {
      guide: parseInt(form.guide) || 0,
      design: parseInt(form.design) || 0,
      jewel: parseInt(form.jewel) || 0,
    }

    // validasi: pastikan tidak semua kosong
    const total = Object.values(parsed).reduce((sum, v) => sum + v, 0)
    if (total === 0) {
      toast.warning('All inputs are empty. Enter at least one value.')
      return
    }

    toast.success('Data successfully sent for comparison!')
    onCompare?.(parsed)

    // simpan hasil submit agar tetap tampil
    setForm(parsed)
  }

  const fields = [
    { name: 'guide', label: 'Charm Guide' },
    { name: 'design', label: 'Design Manual' },
    { name: 'jewel', label: 'Jewel Secrets' },
  ]

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-special-inside-green border border-zinc-800 rounded-xl space-y-6 text-white"
    >
      <h3 className="text-xl">Compare Resources</h3>

      {fields.map(({ name, label }) => (
        <div key={name} className="space-y-2">
          <Label htmlFor={name} className="text-white">
            {label}
          </Label>

          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <ResourceIcon type={name} />
            </div>

            <Input
              type="number"
              id={name}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full bg-special-input-green p-2 pl-12 rounded text-zinc-400"
              placeholder="0"
            />
          </div>
        </div>
      ))}

      <Button type="submit" className="mt-6 px-4 py-2 button-Form ">
        Compare
      </Button>
    </form>
  )
}
