export default function TroopAssistantPreset({ current, onSelect }) {
  const presets = [
    { name: 'Inf Focus', value: [5, 3, 2] },
    { name: 'Balanced', value: [3, 3, 4] },
    { name: 'Marksman Meta', value: [1, 2, 7] },
  ]

  return (
    <div>
      <div className="text-sm mb-2 text-white/70">Preset ratio</div>

      <div className="flex gap-2">
        {presets.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onSelect(preset.value)}
            className={`px-3 py-1 rounded text-sm border ${
              preset.value.join() === current.join()
                ? 'bg-teal-600 border-teal-400'
                : 'bg-zinc-800 border-white/10'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  )
}
