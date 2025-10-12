'use client'
import { useFoundry } from '../dashboard/foundry/FoundryContext'
import { useState } from 'react'

export default function MemberList() {
  const { members, tasks, assignMemberToTask } = useFoundry()
  const [selectedMember, setSelectedMember] = useState(null)
  const [sortBy, setSortBy] = useState('name')
  const [search, setSearch] = useState('')

const getAssignedNames = () => {
  return tasks.flatMap((task) =>
    task.assigned.map((name) => name.replace(/\s*\(c\)$/, '').trim())
  )
}

  // Filtered + sorted
  const assignedNames = getAssignedNames()
  const filtered = members
    .filter((m) => !assignedNames.includes(m.Name)) // filter keluar yang sudah di-assign
    .filter((m) => {
      const query = search.toLowerCase()
      const fcText = `fc ${m['Furnace Level'] || ''}`.toLowerCase()
      return (
        m.Name.toLowerCase().includes(query) ||
        m.Power.toLowerCase().includes(query) ||
        fcText.includes(query)
      )
    })

const sortedMembers = [...filtered].sort((a, b) => {
  if (sortBy === 'name') return a.Name.localeCompare(b.Name)

  const parsePower = (value) => {
    if (!value) return 0
    const num = parseFloat(value)
    if (isNaN(num)) return 0
    const suffix = value.trim().slice(-1).toUpperCase()
    if (suffix === 'K') return num * 1e3
    if (suffix === 'M') return num * 1e6
    if (suffix === 'B') return num * 1e9
    return num
  }

  if (sortBy === 'power') {
    return parsePower(b.Power) - parsePower(a.Power)
  }

  if (sortBy === 'furnace')
    return (b['Furnace Level'] || 0) - (a['Furnace Level'] || 0)
    
  return 0
})

  const handleAssign = (taskName) => {
    assignMemberToTask(selectedMember, taskName)
    setSelectedMember(null)
  }

  return (
    <div className="bg-zinc-800 p-4 rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl">Member List</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-zinc-700 text-sm rounded px-2 py-1 text-white"
        >
          <option value="name">Sort: Name</option>
          <option value="power">Sort: Power</option>
          <option value="furnace">Sort: FC Level</option>
        </select>
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, power or FC"
        className="mb-3 w-full bg-zinc-700 text-sm p-2 rounded text-white placeholder:text-zinc-400"
      />

      <ul className="space-y-1 max-h-80 overflow-y-auto">
        {sortedMembers.map((member, i) => (
          <li
            key={i}
            onClick={() => setSelectedMember(member.Name)}
            className="flex justify-between items-center border border-zinc-600 p-2 rounded bg-zinc-700 hover:bg-zinc-600 cursor-pointer"
          >
            <div>
              {member.Name}{' '}
              <span className="text-sm text-zinc-400">({member.Power})</span>
            </div>
            <span className="text-sm text-lime-600 ml-2">
              FC {member['Furnace Level'] || 0}
            </span>
          </li>
        ))}
      </ul>

      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-zinc-900 p-6 rounded w-80">
            <h3 className="text-lg mb-2">Assign to Task</h3>
            {tasks.length === 0 ? (
              <p className="text-sm text-zinc-400">No tasks available. please add the tasks first</p>
            ) : (
              <ul className="space-y-2">
                {tasks.map((task, i) => (
                  <li key={i}>
                    <button
                      onClick={() => handleAssign(task.name)}
                      className="w-full text-left bg-zinc-700 hover:bg-zinc-600 p-2 rounded"
                    >
                      {task.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setSelectedMember(null)}
              className="mt-4 text-sm text-red-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
