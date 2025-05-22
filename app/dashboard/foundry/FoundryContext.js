'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const FoundryContext = createContext()

export function FoundryProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])

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

  const assignMemberToTask = (memberName, taskName) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.name === taskName
          ? {
              ...task,
              assigned: task.assigned.includes(memberName)
                ? task.assigned
                : [...task.assigned, memberName],
            }
          : task
      )
    )
  }

  return (
    <FoundryContext.Provider
      value={{ tasks, setTasks, members, setMembers, assignMemberToTask }}
    >
      {children}
    </FoundryContext.Provider>
  )
}

export const useFoundry = () => useContext(FoundryContext)
