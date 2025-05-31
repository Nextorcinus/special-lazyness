'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import FormattedNumberInput from '@/utils/FormattedNumbernInput'

export default function GeneralPage() {
  // Kalkulator Points from Time
  const [pointPerMinute, setPointPerMinute] = useState(30)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [timeResult, setTimeResult] = useState(null)

  // Kalkulator Fire Crystal
  const [itemCount, setItemCount] = useState(0)
  const [pointPerItem, setPointPerItem] = useState(0)
  const [fcResult, setFcResult] = useState(null)

  // Kalkulator Shard
  const [shardCount, setShardCount] = useState(0)
  const [pointPerShard, setPointPerShard] = useState(0)
  const [shardResult, setShardResult] = useState(null)

  // Kalkulator Gather Resources (4 jenis)
  const [gatherInputs, setGatherInputs] = useState([
    { label: 'Meat', gatherUnit: 1000, pointPerGather: 3, totalGathered: 0 },
    { label: 'Wood', gatherUnit: 1000, pointPerGather: 3, totalGathered: 0 },
    { label: 'Coal', gatherUnit: 200, pointPerGather: 3, totalGathered: 0 },
    { label: 'Iron', gatherUnit: 50, pointPerGather: 3, totalGathered: 0 },
  ])
  const [gatherResult, setGatherResult] = useState(null)

  const handleGatherInputChange = (index, field, value) => {
    setGatherInputs((prev) => {
      const updated = [...prev]
      updated[index][field] = Number(value)
      return updated
    })
  }

  const handleGatherCalc = () => {
    let total = 0
    for (const res of gatherInputs) {
      if (
        res.totalGathered > 0 &&
        res.gatherUnit > 0 &&
        res.pointPerGather > 0
      ) {
        total += (res.totalGathered / res.gatherUnit) * res.pointPerGather
      }
    }
    setGatherResult(
      `⛏️ Total Points from All Gathering: ${Math.floor(
        total
      ).toLocaleString()} pts`
    )
    toast.success('Calculation complete!')
  }

  const handleTimeCalc = () => {
    const totalMinutes = (days * 24 + hours) * 60
    const totalPoints = totalMinutes * pointPerMinute

    if (totalPoints <= 0) {
      toast.error('Please input valid time and points per minute.')
      return
    }

    setTimeResult(
      `\uD83D\uDCC8 Estimated total points: ${totalPoints.toLocaleString()} pts`
    )
    toast.success('Calculation complete!')
  }

  const handleFireCrystalCalc = () => {
    const total = itemCount * pointPerItem

    if (itemCount <= 0 || pointPerItem <= 0) {
      toast.error('Please input valid item and point per item.')
      return
    }

    setFcResult(
      `\uD83D\uDD25 Total Points from Fire Crystals: ${total.toLocaleString()} pts`
    )
    toast.success('Calculation complete!')
  }

  const handleShardCalc = () => {
    const total = shardCount * pointPerShard

    if (shardCount <= 0 || pointPerShard <= 0) {
      toast.error('Please input valid shard and point per shard.')
      return
    }

    setShardResult(
      `\uD83D\uDD39 Total Points from Shards: ${total.toLocaleString()} pts`
    )
    toast.success('Calculation complete!')
  }

  return (
    <div className="space-y-10 mt-6">
      {/* Kalkulator Waktu ke Poin */}
      <Card className="bg-special-inside border-zinc-800 text-white">
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold">Calc Use Speedup</h2>
          <p className="text-sm text-zinc-400">
            construction / research / training / promotion
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div>
              <Label className="text-zinc-400">Points per minute</Label>
              <Input
                type="number"
                value={pointPerMinute}
                onChange={(e) => setPointPerMinute(Number(e.target.value))}
                className="bg-special-input text-white"
                min={0}
              />
            </div>

            <div>
              <Label className="text-zinc-400">Days</Label>
              <Input
                type="number"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="bg-special-input text-white"
                min={0}
              />
            </div>

            <div>
              <Label className="text-zinc-400">Hours</Label>
              <Input
                type="number"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="bg-special-input text-white"
                min={0}
                max={23}
              />
            </div>
          </div>

          <Button
            onClick={handleTimeCalc}
            className="bg-lime-600 hover:bg-green-700 text-white rounded-sm py-5 mt-4"
          >
            Calculate Points
          </Button>

          {timeResult && (
            <div className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white mt-4">
              {timeResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kalkulator Fire Crystal */}
      <Card className="bg-special-inside border-zinc-800 text-white">
        <CardContent className="space-y-6 pt-6">
          <h2 className="text-xl font-bold">Fire Crystal</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-400">Fire Crystal</Label>
              <Input
                type="number"
                value={itemCount}
                onChange={(e) => setItemCount(Number(e.target.value))}
                className="bg-special-input text-white"
                min={0}
              />
            </div>

            <div>
              <Label className="text-zinc-400">Points per Item</Label>
              <Input
                type="number"
                value={pointPerItem}
                onChange={(e) => setPointPerItem(Number(e.target.value))}
                className="bg-special-input text-white"
                min={0}
              />
            </div>
          </div>

          <Button
            onClick={handleFireCrystalCalc}
            className="bg-lime-600 hover:bg-green-700 text-white rounded-sm py-5"
          >
            Calculate Points
          </Button>

          {fcResult && (
            <div className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white">
              {fcResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kalkulator Shard */}
      <Card className="bg-special-inside border-zinc-800 text-white">
        <CardContent className="space-y-6 pt-6">
          <h2 className="text-xl font-bold">Shards Epic/Mythic</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-400">Shards</Label>
              <Input
                type="number"
                value={shardCount}
                onChange={(e) => setShardCount(Number(e.target.value))}
                className="bg-special-input text-white"
                min={0}
              />
            </div>

            <div>
              <Label className="text-zinc-400">Points per Shard</Label>
              <Input
                type="number"
                value={pointPerShard}
                onChange={(e) => setPointPerShard(Number(e.target.value))}
                className="bg-special-input text-white"
                min={0}
              />
            </div>
          </div>

          <Button
            onClick={handleShardCalc}
            className="bg-lime-600 hover:bg-green-700 text-white rounded-sm py-5"
          >
            Calculate Points
          </Button>

          {shardResult && (
            <div className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white">
              {shardResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kalkulator Gather Resources */}
      <Card className="bg-special-inside border-zinc-800 text-white">
        <CardContent className=" pt-6">
          <h2 className="text-xl font-bold">Gather Resources</h2>
           <p className="text-sm text-zinc-500">
            you can change the gather unit and point per gather for each resource depends the event.
          </p>

          {gatherInputs.map((res, index) => (
            <div
              key={res.label}
              className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4"
            >
              <div>
                <Label className="text-zinc-300">{res.label}</Label>
                <Input
                  type="number"
                  value={res.gatherUnit}
                  onChange={(e) =>
                    handleGatherInputChange(index, 'gatherUnit', e.target.value)
                  }
                  className="bg-special-input text-white"
                  min={1}
                />
              </div>
              <div>
                <Label className="text-zinc-400">{res.label} – Point</Label>
                <Input
                  type="number"
                  value={res.pointPerGather}
                  onChange={(e) =>
                    handleGatherInputChange(
                      index,
                      'pointPerGather',
                      e.target.value
                    )
                  }
                  className="bg-special-input text-white"
                  min={0}
                />
              </div>
              <div className="col-span-full md:col-span-1">
                <Label className="text-zinc-400">
                  {res.label} – Total Gathered
                </Label>
                <FormattedNumberInput
                  value={res.totalGathered}
                  onChange={(val) =>
                    handleGatherInputChange(index, 'totalGathered', val)
                  }
                  className="bg-special-input text-white"
                />
              </div>
            </div>
          ))}

          <Button
            onClick={handleGatherCalc}
            className="bg-lime-600 hover:bg-green-700 text-white rounded-sm py-5 mt-4"
          >
            Calculate Points
          </Button>

          {gatherResult && (
            <div className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white mt-4">
              {gatherResult}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
