'use client'

import Image from 'next/image'
import {
  autoBearTrapFormation,
  applyRatioToLegion,
} from '../../utils/TroopAssistantUtils'
import TroopAssistantPreset from './TroopAssistantPreset'
import TroopLegionCard from './TroopLegionCard'
import FormattedNumberInput from '../../utils/FormattedNumbernInput'
import { useHistory } from '../../dashboard/troops/HistoryContext'
import { toast } from 'sonner'
import { useState } from 'react'

export default function TroopAssistantCalculator() {
  const {
    troops,
    setTroops,
    joinerCount,
    setJoinerCount,
    rallySize,
    setRallySize,
    joinerSize,
    setJoinerSize,
    legions,
    setLegions,
  } = useHistory()

  const [tumblingLevel, setTumblingLevel] = useState(0)
  const [cityBuff, setCityBuff] = useState(0)
  const [entrapmentLevel, setEntrapmentLevel] = useState(0)

  const tumblingValues = [
    0, 1500, 3000, 4500, 6000, 7500, 9000, 10500, 12000, 13500, 15000,
  ]

  const entrapmentValues = [
    0, 0, 3600, 7200, 10800, 14400, 18000, 21600, 25200, 28800, 32400,
  ]

  const baseTotal =
    Number(troops?.infantry || 0) +
    Number(troops?.lancer || 0) +
    Number(troops?.marksman || 0)

  const tumblingBuff = tumblingValues[tumblingLevel] || 0
  const entrapmentBuff = entrapmentValues[entrapmentLevel] || 0

  const cityBuffValue = Math.floor((rallySize || 0) * cityBuff)

  const finalRallySize =
    (Number(rallySize) || 0) + tumblingBuff + entrapmentBuff + cityBuffValue

  const maxJoinerCapacity =
    joinerCount > 0 ? Math.floor(baseTotal / joinerCount) : 0

  const onTroopChange = (key, value) => {
    setTroops((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

const totalRequired =
  legions.reduce(
    (acc, legion) => ({
      infantry:
        acc.infantry +
        (legion.infantry || 0),

      lancer:
        acc.lancer +
        (legion.lancer || 0),

      marksman:
        acc.marksman +
        (legion.marksman || 0),
    }),
    {
      infantry: 0,
      lancer: 0,
      marksman: 0,
    }
  )

// =========================
// LOCKED / UNLOCKED
// =========================

const lockedLegions =
  legions.filter(
    (l) => l.isLocked
  )

const unlockedLegions =
  legions.filter(
    (l) => !l.isLocked
  )

// =========================
// USED BY LOCKED
// =========================

const lockedUsed =
  lockedLegions.reduce(
    (acc, legion) => ({
      infantry:
        acc.infantry +
        (legion.infantry || 0),

      lancer:
        acc.lancer +
        (legion.lancer || 0),

      marksman:
        acc.marksman +
        (legion.marksman || 0),
    }),
    {
      infantry: 0,
      lancer: 0,
      marksman: 0,
    }
  )

// =========================
// REMAINING TROOPS
// =========================

const remainingTroops = {
  infantry: Math.max(
    0,
    (troops?.infantry || 0) -
      lockedUsed.infantry
  ),

  lancer: Math.max(
    0,
    (troops?.lancer || 0) -
      lockedUsed.lancer
  ),

  marksman: Math.max(
    0,
    (troops?.marksman || 0) -
      lockedUsed.marksman
  ),
}

// =========================
// TOTAL CAPACITY UNLOCKED
// =========================

const unlockedCapacity =
  unlockedLegions.reduce(
    (sum, legion) =>
      sum +
      (legion.maxSize || 0),
    0
  )

// =========================
// RAW RATIO
// =========================

const totalRemainingTroops =
  remainingTroops.infantry +
  remainingTroops.lancer +
  remainingTroops.marksman

const rawRatio = {
  infantry:
    totalRemainingTroops > 0
      ? Math.floor(
          (remainingTroops.infantry /
            totalRemainingTroops) *
            100
        )
      : 0,

  lancer:
    totalRemainingTroops > 0
      ? Math.floor(
          (remainingTroops.lancer /
            totalRemainingTroops) *
            100
        )
      : 0,

  marksman:
    totalRemainingTroops > 0
      ? Math.floor(
          (remainingTroops.marksman /
            totalRemainingTroops) *
            100
        )
      : 0,
}
const preferredRatio = {
  infantry:
    rawRatio.infantry,

  lancer:
    rawRatio.lancer,

  marksman:
    rawRatio.marksman,
}

// =========================
// FORCE RULE
// infantry < lancer < marksman
// =========================

let infantry =
  Math.max(
    1,
    Math.min(
      rawRatio.infantry,
      rawRatio.lancer - 1
    )
  )

let lancer =
  Math.max(
    infantry + 1,
    Math.min(
      rawRatio.lancer,
      rawRatio.marksman - 1
    )
  )

let marksman =
  Math.max(
    lancer + 1,
    rawRatio.marksman
  )

// normalize to 100
const total =
  infantry +
  lancer +
  marksman

infantry = Math.round(
  (infantry / total) * 100
)

lancer = Math.round(
  (lancer / total) * 100
)

marksman =
  100 -
  infantry -
  lancer

// ensure order
if (
  infantry >= lancer
) {
  lancer =
    infantry + 1
}

if (
  lancer >= marksman
) {
  marksman =
    lancer + 1
  infantry =
    Math.max(
      1,
      100 -
        lancer -
        marksman
    )
}

const suggestedRatio = {
  infantry,
  lancer,
  marksman,
}

// =========================
// SIMULATE REAL RESULT
// =========================

const simulatedLegions =
  unlockedLegions.map(
    (legion) => {
      const capacity =
        legion.maxSize

      let inf =
        Math.floor(
          (suggestedRatio.infantry /
            100) *
            capacity
        )

      let lan =
        Math.floor(
          (suggestedRatio.lancer /
            100) *
            capacity
        )

      let mar =
        capacity -
        inf -
        lan

      mar = Math.min(
        mar,
        remainingTroops.marksman
      )

      lan = Math.min(
        lan,
        remainingTroops.lancer
      )

      inf = Math.min(
        inf,
        remainingTroops.infantry
      )

      return {
        infantry: inf,
        lancer: lan,
        marksman: mar,
      }
    }
  )

const simulatedTotal =
  simulatedLegions.reduce(
    (acc, legion) => ({
      infantry:
        acc.infantry +
        legion.infantry,

      lancer:
        acc.lancer +
        legion.lancer,

      marksman:
        acc.marksman +
        legion.marksman,
    }),
    {
      infantry: 0,
      lancer: 0,
      marksman: 0,
    }
  )

const simulatedGrandTotal =
  simulatedTotal.infantry +
  simulatedTotal.lancer +
  simulatedTotal.marksman

const realSuggestedRatio =
  simulatedGrandTotal >
  0
    ? {
        infantry:
          Math.round(
            (simulatedTotal.infantry /
              simulatedGrandTotal) *
              100
          ),

        lancer:
          Math.round(
            (simulatedTotal.lancer /
              simulatedGrandTotal) *
              100
          ),

        marksman:
          100 -
          Math.round(
            (simulatedTotal.infantry /
              simulatedGrandTotal) *
              100
          ) -
          Math.round(
            (simulatedTotal.lancer /
              simulatedGrandTotal) *
              100
          ),
      }
    : {
        infantry: 0,
        lancer: 0,
        marksman: 0,
      }

const suggestedTotal =
  realSuggestedRatio.infantry
realSuggestedRatio.lancer
realSuggestedRatio.marksman

const applySuggestedRatio =
  () => {
    const updated =
      legions.map((l) => ({
        ...l,
        ratio: l.ratio
          ? { ...l.ratio }
          : {
              infantry: 1,
              lancer: 1,
              marksman: 98,
            },
      }))

    const unlocked =
      updated.filter(
        (l) => !l.isLocked
      )

    if (
      unlocked.length === 0
    ) {
      toast.error(
        'All legions are locked'
      )
      return
    }

    // remaining troops
    const remaining = {
      infantry:
        remainingTroops.infantry,

      lancer:
        remainingTroops.lancer,

      marksman:
        remainingTroops.marksman,
    }

    unlocked.forEach(
      (legion) => {
        const capacity =
          legion.maxSize

        // use suggested ratio
        let inf =
          Math.floor(
            (suggestedRatio.infantry /
              100) *
              capacity
          )

        let lan =
          Math.floor(
            (suggestedRatio.lancer /
              100) *
              capacity
          )

        let mar =
          capacity -
          inf -
          lan

        // respect remaining troop
        mar = Math.min(
          mar,
          remaining.marksman
        )

        lan = Math.min(
          lan,
          remaining.lancer
        )

        inf = Math.min(
          inf,
          remaining.infantry
        )

        // if marksman shortage
        // move to lancer first
        let leftover =
          capacity -
          (inf + lan + mar)

        if (
          leftover > 0
        ) {
          const extraLancer =
            Math.min(
              leftover,
              remaining.lancer -
                lan
            )

          lan +=
            Math.max(
              0,
              extraLancer
            )

          leftover =
            capacity -
            (inf +
              lan +
              mar)

          const extraInf =
            Math.min(
              leftover,
              remaining.infantry -
                inf
            )

          inf +=
            Math.max(
              0,
              extraInf
            )
        }

        remaining.infantry -=
          inf

        remaining.lancer -=
          lan

        remaining.marksman -=
          mar

        const total =
          inf + lan + mar

        legion.infantry =
          inf

        legion.lancer =
          lan

        legion.marksman =
          mar

        legion.ratio = {
          infantry:
            total > 0
              ? Math.round(
                  (inf /
                    total) *
                    100
                )
              : 0,

          lancer:
            total > 0
              ? Math.round(
                  (lan /
                    total) *
                    100
                )
              : 0,

          marksman:
            total > 0
              ? 100 -
                Math.round(
                  (inf /
                    total) *
                    100
                ) -
                Math.round(
                  (lan /
                    total) *
                    100
                )
              : 0,
        }
      }
    )

    setLegions(updated)

    toast.success(
      'Suggested troops applied'
    )
  }
  const handleDistribute = () => {
    const safeTroops = {
      infantry: Number(troops?.infantry) || 0,
      lancer: Number(troops?.lancer) || 0,
      marksman: Number(troops?.marksman) || 0,
    }

    if (
      safeTroops.infantry === 0 &&
      safeTroops.lancer === 0 &&
      safeTroops.marksman === 0
    ) {
      toast.error('Please enter troop numbers first')
      return
    }

    const safeJoinerSize = Math.min(joinerSize || 0, maxJoinerCapacity)

   const result = autoBearTrapFormation({
  totalTroops: safeTroops,
  rallySize: finalRallySize,
  joinerSize: safeJoinerSize,
  joinerCount,
})

// preserve lock state
const mergedResult = result.map(
  (newLegion, index) => {
    const oldLegion =
      legions[index]

    return {
      ...newLegion,

      // keep previous lock
      isLocked:
        oldLegion?.isLocked ??
        false,

      // keep ratio too
      ratio:
  oldLegion?.ratio
    ? {
        infantry:
          oldLegion.ratio
            .infantry,

        lancer:
          oldLegion.ratio
            .lancer,

        marksman:
          oldLegion.ratio
            .marksman,
      }
    : {
        infantry: 1,
        lancer: 1,
        marksman: 98,
      },
    }
  }
)

setLegions(mergedResult)

    toast.success(
      `Rally calculated successfully. ${result.length} formations created`
    )
  }

  return (
    <div className="space-y-6 max-w-[700px] mx-auto">
      <div className="bg-special-inside p-4 rounded-2xl">
        <h2 className="text-2xl text-white mb-1">Troops Setup</h2>
        <p className="text-sm text-white mb-4">
          Enter the total number of troops for each type.
        </p>

        <div className="grid grid-cols-3 gap-4">
          {Object.keys(troops).map((key) => (
            <div key={key}>
              <label className="block text-sm mb-1 capitalize">{key}</label>
              <FormattedNumberInput
                value={troops[key]}
                onChange={(value) => onTroopChange(key, value)}
                className="w-full bg-special-input p-2 rounded-md text-right"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-special-inside p-4 rounded-2xl space-y-4">
        <h3 className="text-xl text-white">Bear Trap Formation Auto Setup</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-white">Rally Starter size</label>
            <FormattedNumberInput
              value={rallySize}
              onChange={(value) => setRallySize(value || 0)}
              className="w-full bg-special-input p-2 rounded-md text-right"
            />
          </div>

          <div>
            <label className="text-sm text-white">Total March</label>
            <FormattedNumberInput
              value={joinerCount}
              onChange={(value) => setJoinerCount(value || 1)}
              className="w-full bg-special-input p-2 rounded-md text-right"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-white p-2">
            Joiner March max capacity
          </span>

          <div className="flex gap-2 items-center">
            <FormattedNumberInput
              value={joinerSize}
              onChange={(value) =>
                setJoinerSize(Math.min(value || 0, maxJoinerCapacity))
              }
              className="w-28 bg-special-input p-1.5 rounded-md text-right text-sm"
            />
            <span className="text-xs text-white">
              Max ≈ {maxJoinerCapacity.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <h4 className="text-white font-semibold">Additional Buff</h4>

          <div>
            <label className="text-sm text-white flex items-center gap-2">
              <Image
                src="/icon/tumbling.png"
                alt="tumbling"
                width={40}
                height={40}
              />
              Snow Ape Pet Buff
            </label>

            <select
              value={tumblingLevel}
              onChange={(e) => setTumblingLevel(Number(e.target.value))}
              className="w-full bg-special-input p-2 rounded-md"
            >
              {tumblingValues.map((_, i) => (
                <option key={i} value={i}>
                  Level {i} (+{tumblingValues[i].toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-white flex items-center gap-2">
              <Image
                src="/icon/capacity.png"
                alt="capacity"
                width={40}
                height={40}
              />
              Buff Capacity City
            </label>

            <select
              value={cityBuff}
              onChange={(e) => setCityBuff(Number(e.target.value))}
              className="w-full bg-special-input p-2 rounded-md"
            >
              <option value={0}>None (0%)</option>
              <option value={0.1}>10%</option>
              <option value={0.2}>20%</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white flex items-center gap-2">
              <Image
                src="/icon/entrapment.png"
                alt="entrapment"
                width={40}
                height={40}
              />
              Entrapment Level Cryille
            </label>

            <select
              value={entrapmentLevel}
              onChange={(e) => setEntrapmentLevel(Number(e.target.value))}
              className="w-full bg-special-input p-2 rounded-md"
            >
              {entrapmentValues.map((_, i) => (
                <option key={i} value={i}>
                  Level {i} (+{entrapmentValues[i].toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-white opacity-70">
            Rally size after buff: {finalRallySize.toLocaleString()}
          </p>
        </div>

        <button
          onClick={handleDistribute}
          className="px-5 py-2 rounded-xl button-Form text-white"
        >
          Calculate Formation
        </button>
      </div>

      <div className="space-y-4">
        {legions.map((legion, index) => (
          <TroopLegionCard
            key={legion.id}
            legion={legion}
            index={index}
            isRallyStarter={index === 0}
            totalTroops={troops}
            legions={legions}
            onUpdate={(updated) => {
              setLegions((prev) =>
                prev.map((l) => (l.id === updated.id ? updated : l))
              )
            }}
            onRemove={() => {
              setLegions((prev) => prev.filter((l) => l.id !== legion.id))
            }}
          />
        ))}
      </div>

      {legions.length > 0 && (
  <div className="bg-special-inside p-5 rounded-2xl border border-white/10 space-y-4">
    <h3 className="text-xl font-semibold text-white">
      Total Required for {legions.length} Squads
    </h3>

    {['infantry', 'lancer', 'marksman'].map(
      (type) => {
        const required =
          totalRequired[type]

        const available =
          troops?.[type] || 0

        const isEnough =
          required <= available

        const remain =
          available - required

        return (
          <div
            key={type}
            className={`rounded-xl border p-4 ${
              isEnough
                ? 'border-cyan-400/30 bg-cyan-500/5'
                : 'border-red-400/30 bg-red-500/5'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="capitalize text-white/70 text-sm">
                  {type}
                </p>

                <p className="text-lg font-semibold text-white">
                  Required:{' '}
                  {required.toLocaleString()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-white/50">
                  Available
                </p>

                <p className="font-semibold text-cyan-300">
                  {available.toLocaleString()}
                </p>

                <div
                  className={`mt-2 px-3 py-1 rounded-lg text-sm font-semibold ${
                    isEnough
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {isEnough
                    ? '✓ OK'
                    : `✕ ${remain.toLocaleString()}`}
                </div>
              </div>
            </div>
          </div>
        )
      }
    )}

    <div className="rounded-xl border border-amber-400/20 bg-amber-500/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-amber-300">
            💡 Suggested Ratio
          </p>

          <p className="text-xs text-white/50">
            Based on available troops
          </p>
        </div>

        <button
  onClick={applySuggestedRatio}
  className="px-4 py-2 rounded-lg text-sm bg-amber-400 text-black font-semibold hover:scale-105 transition"
>
  Apply to March
</button>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-white/60">
            Preferred
          </span>

          <span className="text-cyan-300 font-medium">
            Infantry:{' '}
            {preferredRatio.infantry}% •
            Lancer:{' '}
            {preferredRatio.lancer}% •
            Marksman:{' '}
            {preferredRatio.marksman}%
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-white/60">
            Suggested
          </span>

          <span className="text-green-300 font-medium">
            Infantry:{' '}
            {suggestedRatio.infantry}% •
            Lancer:{' '}
            {suggestedRatio.lancer}% •
            Marksman:{' '}
            {suggestedRatio.marksman}%
          </span>
        </div>

        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-white/60">
            Total Ratio
          </span>

          <span className="font-semibold text-green-400">
            {suggestedTotal}%
          </span>
        </div>

        <p className="text-xs text-amber-200/80 italic">
          🔒 Locked ratios are kept at
          your preferred values
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  )
}
