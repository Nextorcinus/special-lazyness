'use client'
import { useFoundry } from '../dashboard/foundry/FoundryContext'
import { useState } from 'react'
import { Trash2, X, Copy } from 'lucide-react'
import { toast } from 'sonner'
import ConfirmDialog from './ConfirmDialog'

export default function TaskList() {
  const { tasks, setTasks, handleUnassign, addTaskNote } = useFoundry()
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
      setTasks([...tasks, { name: taskName, assigned: [], note: '' }])
      setNewTask('')
      setSelectedTemplate('')
      toast.success(`Task "${taskName}" added.`)
    }
  }

  const handleTemplateSelect = (value) => {
    setSelectedTemplate(value)
    setNewTask(value)
  }

  // Copy ALL tasks
  const handleCopyAll = () => {
    const output = tasks
      .map((task) => {
        const members = task.assigned.length
          ? task.assigned.map((m) => `- ${m}`).join('\n')
          : '- (no members)'

        return `${task.name}
${members}

Note:
${task.note || '(empty)'}`

      })
      .join('\n\n-------------------------\n\n')

    navigator.clipboard.writeText(output)
    toast.success('All task data copied.')
  }

  // Copy single task including task note
  const copySingleTask = (task) => {
    const members = task.assigned.length
      ? task.assigned.map((m) => `- ${m}`).join('\n')
      : '- (no members)'

    const output = `${task.name}
${members}

Note:
${task.note || '(empty)'}`

    navigator.clipboard.writeText(output)
    toast.success(`Copied "${task.name}".`)
  }

  return (
    <div className="bg-special-inside  p-4 rounded-lg">
      <h2 className="text-xl mb-2">Tasks</h2>

      {/* Form */}
<div className="flex flex-col sm:flex-row gap-2 mb-4">

  <select
    value={selectedTemplate}
    onChange={(e) => handleTemplateSelect(e.target.value)}
    className="bg-zinc-800/60 border border-zinc-700 text-sm rounded-lg px-3 py-2 text-white w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-teal-500"
  >
    <option value="">Select building...</option>
    {templates.map((t, i) => (
      <option key={i} value={t}>
        {t}
      </option>
    ))}
  </select>

  <input
    value={newTask}
    onChange={(e) => setNewTask(e.target.value)}
    className="flex-grow bg-zinc-800/60 border border-zinc-700 px-3 py-2 rounded-lg text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
    placeholder="Or type custom task name..."
  />

  <button
    onClick={handleAdd}
    className="bg-teal-600 hover:bg-teal-500 px-5 py-2 rounded-lg text-sm font-medium text-white transition active:scale-95"
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
          onClick={handleCopyAll}
          className="bg-zinc-500 px-3 py-1 text-zinc-300 rounded text-sm"
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
          <li key={idx} className="bg-zinc-700/40 p-3 rounded">
            <div className="flex justify-between items-center mb-1">

              <p className="text-base text-teal-400">{task.name}</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => copySingleTask(task)}
                  className="text-blue-400 hover:text-blue-200"
                  title="Copy Task"
                >
                  <Copy className="w-4 h-4" />
                </button>

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
            </div>

            {/* Members */}
            <ul className="ml-4 text-sm text-zinc-300 space-y-1">
              {task.assigned.map((m, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>- {m}</span>
                  <button
                    onClick={() => handleUnassign(task.name, m)}
                    className="text-red-400 hover:text-red-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}

              {/* Note per task */}
              <textarea
                className="w-full bg-zinc-800/30 text-sm p-2 rounded mt-3 text-white placeholder:text-zinc-500"
                placeholder="Add task note..."
                value={task.note || ''}
                onChange={(e) => addTaskNote(task.name, e.target.value)}
              />
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
