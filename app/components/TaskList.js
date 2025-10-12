'use client'
import { useFoundry } from '../dashboard/foundry/FoundryContext'
import { useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from '../components/ConfirmDialog'

export default function TaskList() {
  const { tasks, setTasks } = useFoundry()
  const [newTask, setNewTask] = useState('')

  const handleAdd = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { name: newTask, assigned: [] }])
      setNewTask('')
      toast.success(`Tasks "${newTask}" added.`)
    }
  }

  const handleUnassign = (taskName, memberName) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.name === taskName
          ? {
              ...task,
              assigned: task.assigned.filter((m) => m !== memberName),
            }
          : task
      )
    )
    toast.info(`"${memberName}" removed from "${taskName}"`)
  }

  const handleCopy = () => {
    const output = tasks
      .map((task) => {
        const members = task.assigned.length
          ? task.assigned.map((m) => `- ${m}`).join('\n')
          : '- (no members)'
        return `${task.name}\n${members}`
      })
      .join('\n\n')

    navigator.clipboard.writeText(output)
    toast.success('The task result is successfully copied to the clipboard.')
  }

  return (
    <div className="bg-zinc-800 p-4 rounded">
      <h2 className="text-xl mb-2">Tasks</h2>

      {/* Tambah Tugas */}
      <div className="flex gap-2 mb-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow bg-zinc-700 p-2 rounded"
          placeholder="Enter building task name"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 px-4 py-2 rounded text-sm"
        >
          Add
        </button>
      </div>
      <p className="text-zinc-300 text-sm italic mb-3">
        Building Task: Boiler Room, Prototype I, Repair Stations I & II, Repair
        Stations III & IV, Prototype II, Transit Station, Imperial Building
      </p>

      {/* Tools */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCopy}
          className="bg-zinc-400 px-3 py-1 rounded text-sm"
        >
          Copy all text
        </button>

        <ConfirmDialog
          title="Reset all tasks?"
          description="This will delete the entire task list and all assigned members."
          onConfirm={() => {
            setTasks([])
            toast.success('All tasks were successfully reset.')
          }}
        >
          <button className="bg-red-700 px-3 py-1 rounded text-sm">
            Reset
          </button>
        </ConfirmDialog>
      </div>

      {/* Daftar Tugas */}
      <ul className="space-y-2">
        {tasks.map((task, idx) => (
          <li key={idx} className="bg-zinc-700 p-3 rounded">
            <div className="flex justify-between items-center mb-1">
              <p className="text-base text-lime-400">{task.name}</p>
              <ConfirmDialog
                title={`Delete task "${task.name}"?`}
                description="This task will be deleted along with all its assignments."
                onConfirm={() => {
                  setTasks((prev) => prev.filter((_, i) => i !== idx))
                  toast.success(`Tasks "${task.name}" successfully deleted.`)
                }}
              >
                <button
                  className="text-red-400 hover:text-red-200"
                  title="Delete Task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </ConfirmDialog>
            </div>

            <ul className="ml-4 text-sm text-zinc-300 space-y-1">
              {task.assigned.map((m, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>- {m}</span>
                  <button
                    onClick={() => handleUnassign(task.name, m)}
                    className="text-red-400 hover:text-red-200"
                    title="Unassign"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      
    </div>
  )
}
