export default function TroopAssistantResult({ result }) {
  if (!result.length) return null

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Distribution Result</h3>

      {result.map((legion, index) => (
        <div
          key={index}
          className="bg-zinc-800 border border-white/10 rounded p-3"
        >
          <div className="font-medium mb-2">Legion {index + 1}</div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            {Object.entries(legion).map(([k, v]) => (
              <div key={k}>
                {k}: {v}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
