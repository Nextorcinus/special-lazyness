'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

const FoundryContext = createContext()

export function FoundryProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])

  const handleUnassign = (taskName, memberName) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.name !== taskName) return task

        const updated = task.assigned.filter(m => m !== memberName)
        const wasCaptain = memberName.includes('(c)')

        if (wasCaptain && updated.length > 0) {
          const [first, ...rest] = updated
          const newAssigned = [`${first} (c)`, ...rest]
          toast.info(`"${first}" is now the new captain of "${taskName}".`)
          return { ...task, assigned: newAssigned }
        }

        return { ...task, assigned: updated }
      })
    )

    toast.info(`"${memberName}" removed from "${taskName}".`)
  }

  // Note untuk keseluruhan task
  const addTaskNote = (taskName, text) => {
    setTasks(prev =>
      prev.map(task =>
        task.name === taskName
          ? { ...task, note: text }
          : task
      )
    )
  }

  // Load from localStorage (with normalization)
  useEffect(() => {
    const savedTasks = localStorage.getItem('foundry-tasks')
    if (savedTasks) {
      try {
        const parsed = JSON.parse(savedTasks)

        // Normalisasi field task agar selalu punya note
        const normalized = parsed.map(task => ({
          name: task.name,
          assigned: task.assigned || [],
          note: typeof task.note === 'string' ? task.note : ''
        }))

        setTasks(normalized)

      } catch {
        console.error('Error parsing saved tasks')
      }
    }
  }, [])

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('foundry-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Assign member
  const assignMemberToTask = (memberName, taskName) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.name !== taskName) return task

        if (task.assigned.includes(memberName)) return task

        const first = task.assigned.length === 0
        const newMember = first ? `${memberName} (c)` : memberName

        return {
          ...task,
          assigned: [...task.assigned, newMember]
        }
      })
    )
  }

  return (
    <FoundryContext.Provider
      value={{
        tasks,
        setTasks,
        members,
        setMembers,
        assignMemberToTask,
        handleUnassign,
        addTaskNote
      }}
    >
      {children}
    </FoundryContext.Provider>
  )
}

export const useFoundry = () => useContext(FoundryContext)
