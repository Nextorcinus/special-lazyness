'use client'
import TaskBoard from '../../components/TaskBoard'

export default function FoundryPage() {
  return (
    <main className="p-4 md:p-6 text-white w-full">
      <div className="relative mb-6 bg-special-inside border border-zinc-800 rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl text-white">R4 / R5 Assign Task</h2>
        <p className='text-sm text-zinc-500'>to do : Add task first and assign people to task</p>
      </div>
      <TaskBoard />
    </main>
  )
}
