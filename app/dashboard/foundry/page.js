'use client'
import { useFoundry } from './FoundryContext'
import Foundry from '../../components/Foundry'

export default function FoundryPage() {
  const { selectedState, setSelectedState } = useFoundry()

  return (
    <main className="p-0 md:p-6 text-white w-full">
      <div className="relative mb-6 bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md flex justify-between">

        <div>
          <h2 className="text-2xl text-white">R4 / R5 Assign Task</h2>
          <p className='text-sm text-white'>to do : Add task first and assign people to task</p>
        </div>

       <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        className="bg-zinc-800/60 border border-zinc-700 text-sm rounded-lg px-2 py-1"
      >
        <option value="991">State 991</option>
        <option value="1067">State 1067</option>
      </select>
      </div>

      <Foundry />
    </main>
  )
}
