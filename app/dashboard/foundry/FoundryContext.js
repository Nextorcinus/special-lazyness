'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'
import { useMembersByState } from '../../hooks/useMembersByState' 

const FoundryContext = createContext()

export function FoundryProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [selectedState, setSelectedState] = useState('991')

  // Fetch members berdasarkan state
  const { members: fetchedMembers } = useMembersByState(selectedState)

  useEffect(() => {
  console.log("STATE SELECTED:", selectedState)
  console.log("FETCHED MEMBERS:", fetchedMembers)
}, [selectedState, fetchedMembers])

  // Apply hasil fetched ke state members
  useEffect(() => {
    setMembers(fetchedMembers || [])
  }, [fetchedMembers])

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

  const addTaskNote = (taskName, text) => {
    setTasks(prev =>
      prev.map(task =>
        task.name === taskName
          ? { ...task, note: text }
          : task
      )
    )
  }

  // Load saved tasks
  useEffect(() => {
    const saved = localStorage.getItem('foundry-tasks')
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)

      const normalized = Array.isArray(parsed)
        ? parsed.map(task => ({
            name: task.name,
            assigned: Array.isArray(task.assigned) ? task.assigned : [],
            note: typeof task.note === 'string' ? task.note : ''
          }))
        : []

      setTasks(normalized)
    } catch (e) {
      console.error('Error parsing saved tasks', e)
    }
  }, [])

  // Save tasks
  useEffect(() => {
    localStorage.setItem('foundry-tasks', JSON.stringify(tasks))
  }, [tasks])

  // Assign member to task
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
        addTaskNote,
        selectedState,
        setSelectedState
      }}
    >
      {children}
    </FoundryContext.Provider>
  )
}

export const useFoundry = () => useContext(FoundryContext)
