'use client'

import { useState } from 'react'
import { Card, CardContent } from '../../components/ui/card'
import { Label } from '../../components/ui/label'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../components/ui/select'
import { toast } from 'sonner'
import FormattedNumberInput from '../../utils/FormattedNumbernInput'

export default function GeneralPage() {
  // Kalkulator Points from Time
  const [pointPerMinute, setPointPerMinute] = useState('')
  const [days, setDays] = useState('')
  const [hours, setHours] = useState('')
  const [timeResult, setTimeResult] = useState(null)

  // Kalkulator Fire Crystal
  const [itemCount, setItemCount] = useState('')
  const [pointPerItem, setPointPerItem] = useState('')
  const [fcResult, setFcResult] = useState(null)

  // Kalkulator Shard
  const [shardCount, setShardCount] = useState('')
  const [pointPerShard, setPointPerShard] = useState('')
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

  // Kalkulator Gear Essence Stone
  const [stoneCount, setStoneCount] = useState(0)
  const [pointPerStone, setPointPerStone] = useState(0)
  const [stoneResult, setStoneResult] = useState(null)

  const handleStoneCalc = () => {
    const total = stoneCount * pointPerStone
    if (stoneCount <= 0 || pointPerStone <= 0) {
      toast.error('Please input valid stone and point per stone.')
      return
    }
    setStoneResult(
      `\u2692\uFE0F Total Points from Stones:  <span class="text-lime-400">${total.toLocaleString()} pts</span>`
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
      `\uD83D\uDCC8 Estimated total points: <span class="text-lime-400">${totalPoints.toLocaleString()} pts</span>`
    )
    toast.success('Calculation complete!')
  }

  // Data Essence Stone per level
  const essenceStoneLevels = [
    0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
    170, 180, 190, 200,
  ]

  const [fromLevel, setFromLevel] = useState(0)
  const [toLevel, setToLevel] = useState(1)
  const [essenceResult, setEssenceResult] = useState(null)

  const handleEssenceCalc = () => {
    if (toLevel <= fromLevel) {
      toast.error('Target level must be greater than current level.')
      return
    }

    const total = essenceStoneLevels
      .slice(fromLevel + 1, toLevel + 1)
      .reduce((acc, cur) => acc + cur, 0)

    setEssenceResult(
      `\uD83E\uDDF1 Total Stones needed from Lv.${fromLevel} → Lv.${toLevel}:<span class="text-lime-400"> ${total.toLocaleString()} stones</span>`
    )
    toast.success('Calculation complete!')
  }

  // Kalkulator Troops Training
  const [troopCount, setTroopCount] = useState('')
  const [pointPerTroop, setPointPerTroop] = useState('')
  const [troopResult, setTroopResult] = useState(null)

  const handleTroopCalc = () => {
    const total = troopCount * pointPerTroop
    if (troopCount <= 0 || pointPerTroop <= 0) {
      toast.error('Please input valid troop count and point per troop.')
      return
    }

    setTroopResult(
      `⚔️ Total Points from Troops Trained: <span class="text-lime-400">${total.toLocaleString()} pts</span>`
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
      `\uD83D\uDD25 Total Points from Fire Crystals:<span class="text-lime-400"> ${total.toLocaleString()} pts</span>`
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
      `\uD83D\uDD39 Total Points from Shards: <span class="text-lime-400">${total.toLocaleString()} pts</span>`
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
                placeholder="Point per Minute (e.g. 30)"
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
                placeholder="Enter number day speed up"
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
                placeholder="Enter number hour speed up"
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
            <div
              className="border border-zinc-700 mt-4 p-4 rounded bg-zinc-800 text-white"
              dangerouslySetInnerHTML={{ __html: timeResult }}
            />
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
                placeholder="Enter Number FC e.g 20"
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
                placeholder="Enter Point per FC e.g 2000"
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
            <div
              className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white"
              dangerouslySetInnerHTML={{ __html: fcResult }}
            />
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
                placeholder="Enter number Shard (e.g. 40)"
              />
            </div>

            <div>
              <Label className="text-zinc-400">Points per Shard</Label>
              <Input
                type="number"
                value={pointPerShard}
                onChange={(e) => setPointPerShard(Number(e.target.value))}
                className="bg-special-input text-white"
                placeholder="Point per Shard (e.g. 1000)"
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
            <div
              className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white"
              dangerouslySetInnerHTML={{ __html: shardResult }}
            />
          )}
        </CardContent>
      </Card>

      <div className="space-y-10 mt-6">
        <Card className="bg-special-inside border-zinc-800 text-white">
          <CardContent className="space-y-6 pt-6">
            <h2 className="text-xl font-bold">
              Upgrade Level Gear with Essence Stones
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* From Level */}
              <div>
                <Label className="text-zinc-400">From Level</Label>
                <Select
                  value={fromLevel.toString()}
                  onValueChange={(val) => {
                    const valNum = Number(val)
                    setFromLevel(valNum)
                    if (toLevel <= valNum) setToLevel(valNum + 1)
                  }}
                >
                  <SelectTrigger className="bg-special-input text-white">
                    <SelectValue placeholder="Select From Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {essenceStoneLevels.map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        Lv. {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* To Level */}
              <div>
                <Label className="text-zinc-400">To Level</Label>
                <Select
                  value={toLevel.toString()}
                  onValueChange={(val) => setToLevel(Number(val))}
                >
                  <SelectTrigger className="bg-special-input text-white">
                    <SelectValue placeholder="Select To Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {essenceStoneLevels.map(
                      (_, i) =>
                        i > fromLevel && (
                          <SelectItem key={i} value={i.toString()}>
                            Lv. {i}
                          </SelectItem>
                        )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={handleEssenceCalc}
              className="bg-lime-600 hover:bg-green-700 text-white rounded-sm py-5"
            >
              Calculate Stone Needed
            </Button>

            {essenceResult && (
              <div
                className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white"
                dangerouslySetInnerHTML={{ __html: essenceResult }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-10 mt-6">
        {/* Kalkulator Gear Essence Stone */}
        <Card className="bg-special-inside border-zinc-800 text-white">
          <CardContent className="space-y-6 pt-6">
            <h2 className="text-xl font-bold">Point Essence Stone </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-zinc-400">Number of Stones</Label>
                <FormattedNumberInput
                  value={stoneCount}
                  onChange={setStoneCount}
                  placeholder="Enter number of stones"
                  className="bg-special-input text-white"
                />
              </div>
              <div>
                <Label className="text-zinc-400">Points per Stone</Label>
                <FormattedNumberInput
                  value={pointPerStone}
                  onChange={setPointPerStone}
                  className="bg-special-input text-white"
                  placeholder="Point per stone (e.g. 6000)"
                />
              </div>
            </div>

            <Button
              onClick={handleStoneCalc}
              className="bg-lime-600 hover:bg-green-700 text-white rounded-sm py-5"
            >
              Calculate Points
            </Button>

            {stoneResult && (
              <div
                className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white"
                dangerouslySetInnerHTML={{ __html: stoneResult }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Kalkulator Gather Resources */}
      <Card className="bg-special-inside border-zinc-800 text-white">
        <CardContent className=" pt-6">
          <h2 className="text-xl font-bold">Gather Resources</h2>
          <p className="text-sm text-zinc-500">
            you can change the gather unit and point per gather for each
            resource depends the event.
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
                  placeholder="total gather (e.g. 14,000,000)"
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
            <div
              className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white mt-4"
              dangerouslySetInnerHTML={{ __html: gatherResult }}
            />
          )}
        </CardContent>
      </Card>
      {/* Kalkulator Troops Training */}
      <Card className="bg-special-inside border-zinc-800 text-white">
        <CardContent className="space-y-6 pt-6">
          <h2 className="text-xl font-bold">Troops Training</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-400">Number of Troops</Label>
              <Input
                type="number"
                value={troopCount}
                onChange={(e) => setTroopCount(Number(e.target.value))}
                className="bg-special-input text-white"
                placeholder="Enter number of troops"
              />
            </div>
            <div>
              <Label className="text-zinc-400">Points per Troop</Label>
              <Input
                type="number"
                value={pointPerTroop}
                onChange={(e) => setPointPerTroop(Number(e.target.value))}
                className="bg-special-input text-white"
                placeholder="Point per troop (e.g. 5)"
              />
            </div>
          </div>

          <Button
            onClick={handleTroopCalc}
            className="bg-lime-600 hover:bg-green-700 text-white rounded-sm py-5"
          >
            Calculate Points
          </Button>

          {troopResult && (
            <div
              className="border border-zinc-700 p-4 rounded bg-zinc-800 text-white"
              dangerouslySetInnerHTML={{ __html: troopResult }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
