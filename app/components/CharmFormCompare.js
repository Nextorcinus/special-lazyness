'use client'

import { useState } from 'react'
import { Label } from '../components/ui/label'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export default function CompareFormCharm({ onCompare }) {
  const [form, setForm] = useState({
    guide: '',
    design: '',
    jewel: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onCompare?.(form)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-special-inside-green border border-zinc-800 rounded-xl space-y-6"
    >
      <h3 className="text-xl">Compare Resources</h3>

      {[
        { name: 'guide', label: 'Charm Guide' },
        { name: 'design', label: 'Design Manual' },
        { name: 'jewel', label: 'Jewel Secrets' },
      ].map((item) => (
        <div key={item.name} className="space-y-2">
          <Label htmlFor={item.name} className="text-zinc-400">
            {item.label}
          </Label>
          <Input
            type="number"
            id={item.name}
            name={item.name}
            value={form[item.name]}
            onChange={handleChange}
            className="w-full bg-special-input-green p-2 rounded text-zinc-400"
            placeholder="0"
          />
        </div>
      ))}

      <Button
        type="submit"
        className="mt-6 px-4 py-2 bg-lime-600 hover:bg-green-700 rounded text-white"
      >
        Compare
      </Button>
    </form>
  )
}
