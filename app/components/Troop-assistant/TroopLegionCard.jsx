'use client'

import { useEffect, useRef, useState } from 'react'
import {
  clampTroopValue,
  applyRatioToLegion,
  legionTotal,
} from '../../utils/TroopAssistantUtils'
import FormattedNumberInput from '../../utils/FormattedNumbernInput'

export default function TroopLegionCard({
  legion,
  index,
  isRallyStarter,
  totalTroops,
  legions,
  onUpdate,
  onRemove,
}) {
  const title = isRallyStarter ? 'Rally Starter' : `March ${index + 1}`

  const presets = [
    { name: '1:1:98', value: [1, 1, 98] },
    { name: '3:2:95', value: [3, 2, 95] },
    { name: '1:2:97', value: [1, 2, 97] },
    { name: '2:2:96', value: [2, 2, 96] },
    { name: '5:2:93', value: [5, 2, 93] },
    { name: 'Custom', value: null },
  ]

  const CUSTOM_PRESET_INDEX =
  presets.length - 1

  const [activePresetIndex, setActivePresetIndex] = useState(0)
 const [customRatio, setCustomRatio] = useState({
  infantry: 0,
  lancer: 0,
  marksman: 0,
})

const customTotal =
  customRatio.infantry +
  customRatio.lancer +
  customRatio.marksman

const isValidCustom =
  customTotal === 100

const hasAppliedDefault =
  useRef(false)


  useEffect(() => {
  if (hasAppliedDefault.current) return

  const defaultRatio =
    presets[0].value

  applyRatioToLegion({
    legion,
    ratio: defaultRatio,
    totalTroops,
    legions,
    respectGlobalLimit: false,
  })

  onUpdate({
    ...legion,
    ratio: {
      infantry:
        defaultRatio[0],
      lancer:
        defaultRatio[1],
      marksman:
        defaultRatio[2],
    },
  })

  hasAppliedDefault.current = true
}, [])

useEffect(() => {
  if (
    !legion?.ratio
  )
    return

  const foundIndex =
    presets.findIndex(
      (p) => {
        if (!p.value)
          return false

        return (
          p.value[0] ===
            legion.ratio
              .infantry &&
          p.value[1] ===
            legion.ratio
              .lancer &&
          p.value[2] ===
            legion.ratio
              .marksman
        )
      }
    )

  const presetIndex =
    foundIndex >= 0
      ? foundIndex
      : CUSTOM_PRESET_INDEX

  setActivePresetIndex(
    presetIndex
  )

  // IMPORTANT:
  // only sync custom ratio
  // when preset changes
  setCustomRatio({
  infantry:
    legion.ratio
      .infantry,

  lancer:
    legion.ratio
      .lancer,

  marksman:
    legion.ratio
      .marksman,
})
}, [legion?.ratio])


  const handleChange = (
  type,
  value
) => {
  const newValue =
    clampTroopValue({
      legion,
      type,
      value,
      totalTroops,
      legions,
    })

  const updatedLegion = {
    ...legion,
    [type]: newValue,
  }

  // sync ratio from troop
  updatedLegion.ratio = {
    infantry:
      legion.maxSize > 0
        ? Math.round(
            (
              updatedLegion.infantry /
              legion.maxSize
            ) * 100
          )
        : 0,

    lancer:
      legion.maxSize > 0
        ? Math.round(
            (
              updatedLegion.lancer /
              legion.maxSize
            ) * 100
          )
        : 0,

    marksman:
      legion.maxSize > 0
        ? Math.round(
            (
              updatedLegion.marksman /
              legion.maxSize
            ) * 100
          )
        : 0,
  }

  onUpdate(
    updatedLegion
  )
}

  const toggleLock = () => {
  onUpdate({
    ...legion,
    isLocked: !legion.isLocked,
  })
}

  const handlePreset = (
  ratio,
  index
) => {
  if (!ratio) {
    setCustomRatio({
      infantry: 0,
      lancer: 0,
      marksman: 0,
    })

    setActivePresetIndex(index)
    return
  }

  applyRatioToLegion({
    legion,
    ratio,
    totalTroops,
    legions,
    respectGlobalLimit: false,
  })

  setActivePresetIndex(index)

  onUpdate({
    ...legion,

    ratio: {
      infantry: ratio[0],
      lancer: ratio[1],
      marksman: ratio[2],
    },
  })
}

 const handleCustomChange = (
  type,
  value
) => {
  let num =
    Number(value) || 0

  if (num < 0)
    num = 0

  if (num > 100)
    num = 100

  const newRatio = {
    ...customRatio,
    [type]: num,
  }

  setCustomRatio(
    newRatio
  )

  const capacity =
    legion.maxSize

  const infantry =
    Math.floor(
      capacity *
        (newRatio.infantry /
          100)
    )

  const lancer =
    Math.floor(
      capacity *
        (newRatio.lancer /
          100)
    )

  const marksman =
    Math.floor(
      capacity *
        (newRatio.marksman /
          100)
    )

  onUpdate({
    ...legion,
    infantry,
    lancer,
    marksman,
    ratio: newRatio,
  })
}

// button fill remaining ratio to 100%
const handleNormalize =
  () => {
    console.log(
      'FILL CLICKED'
    )
    const total =
      customRatio.infantry +
      customRatio.lancer +
      customRatio.marksman

      console.log(
      'TOTAL:',
      total
    )

    if (
      total >= 100
    )
      return

    const missing =
      100 - total

    let target =
      'lancer'

    // prioritize empty slot
    if (
      customRatio.lancer ===
      0
    ) {
      target = 'lancer'
    } else if (
      customRatio.marksman ===
      0
    ) {
      target =
        'marksman'
    } else if (
      customRatio.infantry ===
      0
    ) {
      target =
        'infantry'
    } else {
      // fallback
      target =
        customRatio.lancer <
        customRatio.marksman
          ? 'lancer'
          : 'marksman'
    }

    const filled = {
      ...customRatio,
      [target]:
        customRatio[
          target
        ] + missing,
    }

    setCustomRatio(
      filled
    )

    const capacity =
      legion.maxSize

    onUpdate({
      ...legion,

      infantry:
        Math.floor(
          capacity *
            (filled.infantry /
              100)
        ),

      lancer:
        Math.floor(
          capacity *
            (filled.lancer /
              100)
        ),

      marksman:
        Math.floor(
          capacity *
            (filled.marksman /
              100)
        ),

      ratio: filled,
    })
  }

  return (
    <div className="bg-special-inside p-4 rounded-2xl space-y-4 border border-white/10">
      {/* Header */}
      <div className="flex justify-between items-center">
  <div className="flex items-center gap-3">
    <h4 className="font-semibold text-white">
      {title}
    </h4>

    <button
  onClick={() =>
    onUpdate({
      ...legion,
      isLocked:
        !legion.isLocked,
    })
  }
  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs border transition
    ${
      legion.isLocked
        ? 'border-amber-400/40 bg-amber-500/10 text-amber-300'
        : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
    }
  `}
>
  <span>
    {legion.isLocked
      ? '🔒'
      : '🔓'}
  </span>

  <span>
    {legion.isLocked
      ? 'Locked'
      : 'Unlocked'}
  </span>
</button>
  </div>

  {!isRallyStarter && (
    <button
      onClick={onRemove}
      className="text-red-400 hover:text-red-500 text-sm"
      title="Remove legion"
    >
      ✕
    </button>
  )}
</div>

      {/* Max size & total */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <label className="text-xs text-white">Max March Size</label>
          <FormattedNumberInput
            value={legion.maxSize}
            onChange={(value) =>
              onUpdate({
                ...legion,
                maxSize: value,
              })
            }
            className="w-full bg-special-input rounded-md text-right"
          />
        </div>

        <div>
          <label className="text-xs text-slate-300 block text-right ">
            Total
          </label>
          <FormattedNumberInput
            readOnly
            value={legionTotal(legion)}
            disabled={
  legion.isLocked
}
            className="w-full bg-transparent border-0 shadow-0 text-right text-lime-300 disabled:text-white
    disabled:opacity-70
    disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {/* Presets */}
      <div>
        <div className="text-xs text-white mb-2">Quick Presets %</div>

        <div className="flex gap-2 flex-wrap border-t border-white/10 pt-3">
          {presets.map((p, i) => {
            const isActive = i === activePresetIndex

            return (
              <button
                key={p.name}
                disabled={
    legion.isLocked
  }
                onClick={() => handlePreset(p.value, i)}
                className={`px-3 py-1 rounded-md text-sm transition
                  ${
                  legion.isLocked
      ? 'opacity-90 cursor-not-allowed bg-white/7 border border-white/40 text-zinc-300/90'   
                    :isActive
                      ? 'bg-cyan-400/30 border border-cyan-300 text-cyan-200'
                      : 'bg-white/5 border border-cyan-300/80 text-cyan-100/90 hover:bg-white/10'
                  }
                `}
              >
                {p.name}
              </button>
            )
          })}
        </div>

        {/* custom ratio */}
        {presets[activePresetIndex]?.name === 'Custom' && (
          <div
            className={`grid grid-cols-3 gap-2 mt-2 p-2 rounded-lg border
      ${isValidCustom ? 'border-green-400/40 bg-green-400/5' : 'border-red-400/40 bg-red-400/5'}
    `}
          >
            {['infantry', 'lancer', 'marksman'].map((type) => (
              <div key={type}>
                <label className="text-xs text-white/70 capitalize">
                  {type} %
                </label>
               <input
  type="number"
  min={0}
  max={100}
  readOnly={
    legion.isLocked
  }
  disabled={
    legion.isLocked
  }
  value={
    customRatio[type]
  }
  onChange={(e) =>
    handleCustomChange(
      type,
      e.target.value
    )
  }
  className={`
    w-full
    p-2
    rounded-md
    text-right
    text-sm
    text-white
    outline-none
    bg-special-input
    disabled:opacity-70
    disabled:text-black/60
    disabled:cursor-not-allowed
    [::-webkit-inner-spin-button]:appearance-none
    [::-webkit-outer-spin-button]:appearance-none
    [moz-appearance:textfield]
    ${
      isValidCustom
        ? 'border border-green-400/30'
        : 'border border-red-400/40'
    }
  `}
/>
              </div>
            ))}

            <div className="col-span-3 flex items-center justify-between">
  <button
    onClick={
      handleNormalize
    }
    disabled={
      legion.isLocked
    }
    className="
      px-3
      py-1
      text-xs
      rounded-md
      border
      border-cyan-400/30
      text-cyan-300
      hover:bg-cyan-400/10
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
  >
    Fill
  </button>

  <div
    className={`text-xs text-right
      ${
        isValidCustom
          ? 'text-green-400'
          : 'text-red-400'
      }
    `}
  >
    Total: {customTotal} / 100
    {!isValidCustom &&
      ' (must be exactly 100)'}
  </div>
</div>
          </div>
        )}
      </div>

      {/* Troop sliders */}
      {['infantry', 'lancer', 'marksman'].map((type) => (
        <div key={type} className="space-y-1">
          <div className="flex justify-between items-center">
            <label className="capitalize text-sm text-white/80">{type}</label>

            <FormattedNumberInput
            disabled={
  legion.isLocked
}
              value={legion[type]}
              onChange={(value) => handleChange(type, value)}
              className="w-24 p-1 rounded-md text-lime-300 text-right text-sm border-0 disabled:text-white
    disabled:opacity-70
    disabled:cursor-not-allowed"
            />
          </div>

          <input
            type="range"
            disabled={
  legion.isLocked
}
            min={0}
            max={legion.maxSize}
            value={legion[type]}
            onChange={(e) => handleChange(type, Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/40"
          />
        </div>
      ))}

   
    </div>
  )
}

  