'use client'

import { autoBearTrapFormation } from '../../utils/TroopAssistantUtils'
import TroopAssistantPreset from './TroopAssistantPreset'
import TroopLegionCard from './TroopLegionCard'
import FormattedNumberInput from '../../utils/FormattedNumbernInput'
import { useHistory } from '../../dashboard/troops/HistoryContext'
import { toast } from 'sonner'

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

  const totalTroopCount =
    Number(troops?.infantry || 0) +
    Number(troops?.lancer || 0) +
    Number(troops?.marksman || 0)

  const maxJoinerCapacity =
    joinerCount > 0 ? Math.floor(totalTroopCount / joinerCount) : 0

  const onTroopChange = (key, value) => {
    setTroops((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleDistribute = () => {
    const safeTroops = {
      infantry: Number(troops.infantry) || 0,
      lancer: Number(troops.lancer) || 0,
      marksman: Number(troops.marksman) || 0,
    }

    if (
      safeTroops.infantry === 0 &&
      safeTroops.lancer === 0 &&
      safeTroops.marksman === 0
    ) {
      toast.error('Please enter troop numbers first')
      return
    }

    const safeJoinerSize = Math.min(joinerSize, maxJoinerCapacity)

    const result = autoBearTrapFormation({
      totalTroops: safeTroops,
      rallySize,
      joinerSize: safeJoinerSize,
      joinerCount,
    })

    setLegions(result)

    toast.success(
      `Rally calculated successfully. ${result.length} formations created`
    )
  }

  return (
    <div className="space-y-6 max-w-[700px] mx-auto">
      <div className="bg-special-inside p-4 rounded-2xl">
        <h2 className="text-2xl text-white mb-1">Army Setup</h2>
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
    </div>
  )
}
