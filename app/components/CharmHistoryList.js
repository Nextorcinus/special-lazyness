'use client'

import { useCharmHistory } from '../dashboard/charm/CharmHistoryContext'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'

export default function CharmHistoryList() {
  const { history, deleteHistory, resetHistory } = useCharmHistory()

  return (
    <div className="space-y-2 text-white">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-lg">Charm Upgrade History</h4>
        {history.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              resetHistory()
              toast.success('History reset.')
            }}
          >
            Reset
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {history.map(({ gear, from, to, index, id }) => (
          <div
            key={id}
            className="flex justify-between items-center bg-zinc-800 border border-zinc-700 px-3 py-2 rounded shadow-sm"
          >
            <div>
              <p className="text-sm font-medium">{gear}</p>
              <p className="text-xs text-zinc-400">
                {from} → {to}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                deleteHistory(id)
                toast.success(`History ${gear} ${from}→${to} deleted.`)
              }}
            >
              Delete
            </Button>
          </div>
        ))}
        {history.length === 0 && (
          <p className="text-sm text-zinc-400">No history yet.</p>
        )}
      </div>
    </div>
  )
}
