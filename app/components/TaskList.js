'use client'
import { useFoundry } from '../dashboard/foundry/FoundryContext'
import { useState } from 'react'
import { Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from '../components/ConfirmDialog'

export default function TaskList() {
  const { tasks, setTasks, handleUnassign } = useFoundry()
  const [newTask, setNewTask] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')

  const templates = [
    'Boiler Room',
    'Prototype I',
    'Prototype II',
    'Repair Station I',
    'Repair Station II',
    'Repair Station III',
    'Repair Station IV',
    'Transit Station',
    'Munition',
    'Mercenary Imperial Building',
  ]

  const handleAdd = () => {
    const taskName = newTask.trim()
    if (taskName) {
      setTasks([...tasks, { name: taskName, assigned: [] }])
      setNewTask('')
      setSelectedTemplate('')
      toast.success(`Task "${taskName}" added.`)
    }
  }

  const handleTemplateSelect = (value) => {
    setSelectedTemplate(value)
    setNewTask(value)
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
    toast.success('The task result has been copied to the clipboard.')
  }

  return (
    <div className="bg-zinc-800 p-4 rounded">
      <h2 className="text-xl mb-2">Tasks</h2>

      {/* cek form disini yeee */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <select
          value={selectedTemplate}
          onChange={(e) => handleTemplateSelect(e.target.value)}
          className="bg-zinc-700 text-sm rounded px-2 py-2 text-white w-full sm:w-1/3"
        >
          <option value="">Select Building...</option>
          {templates.map((t, i) => (
            <option key={i} value={t}>
              {t}
            </option>
          ))}
        </select>

        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-grow bg-zinc-700 p-2 rounded text-sm text-white placeholder:text-zinc-400"
          placeholder="or type here for custom"
        />
        <button
          onClick={handleAdd}
          className="bg-green-600 px-4 py-2 rounded text-sm hover:bg-green-500 transition"
        >
          Add
        </button>
      </div>

      <p className="text-zinc-300 text-sm italic mb-3">
        You can select a building or type your own custom task name.
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
          description="This will delete all tasks and assignments."
          onConfirm={() => {
            setTasks([])
            toast.success('All tasks have been reset.')
          }}
        >
          <button className="bg-red-700 px-3 py-1 rounded text-sm">
            Reset
          </button>
        </ConfirmDialog>
      </div>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task, idx) => (
          <li key={idx} className="bg-zinc-700 p-3 rounded">
            <div className="flex justify-between items-center mb-1">
              <p className="text-base text-lime-400">{task.name}</p>

              <ConfirmDialog
                title={`Delete task "${task.name}"?`}
                description="This will delete this task and its assigned members."
                onConfirm={() => {
                  setTasks((prev) => prev.filter((_, i) => i !== idx))
                  toast.success(`Task "${task.name}" deleted.`)
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
