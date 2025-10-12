'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

const FoundryContext = createContext()

export function FoundryProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])

  // ✅ Unassign dengan logika pengganti (c)
  const handleUnassign = (taskName, memberName) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.name !== taskName) return task

        // Hapus member yang dihapus
        const updated = task.assigned.filter((m) => m !== memberName)

        // Jika yang dihapus adalah captain (punya "(c)")
        const wasCaptain = memberName.includes('(c)')

        // Jika ada anggota tersisa dan yang dihapus adalah captain
        if (wasCaptain && updated.length > 0) {
          // Jadikan anggota pertama sebagai (c) baru
          const [first, ...rest] = updated
          const newAssigned = [`${first} (c)`, ...rest]
          toast.info(`"${first}" is now the new captain of "${taskName}".`)
          return { ...task, assigned: newAssigned }
        }

        // Jika bukan captain, cukup kembalikan list baru
        return { ...task, assigned: updated }
      })
    )

    toast.info(`"${memberName}" removed from "${taskName}".`)
  }

  // ✅ Load saved tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('foundry-tasks')
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch {
        console.error('Error parsing saved tasks')
      }
    }
  }, [])

  // ✅ Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('foundry-tasks', JSON.stringify(tasks))
  }, [tasks])

  // ✅ Assign logic — menambahkan (c) jika anggota pertama
  const assignMemberToTask = (memberName, taskName) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.name !== taskName) return task

        if (task.assigned.includes(memberName)) return task

        const first = task.assigned.length === 0
        const newMember = first ? `${memberName} (c)` : memberName

        return {
          ...task,
          assigned: [...task.assigned, newMember],
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
        handleUnassign, // ✅ tambahkan supaya TaskList bisa pakai versi baru
      }}
    >
      {children}
    </FoundryContext.Provider>
  )
}

export const useFoundry = () => useContext(FoundryContext)
