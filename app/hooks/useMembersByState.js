'use client'
import { useState, useEffect } from 'react'

export function useMembersByState(state) {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/list-member/${state}`)
        const json = await res.json()

        if (json.success) {
          setMembers(json.data)
        } else {
          setMembers([])
        }
      } catch (err) {
        setMembers([])
      }
      setLoading(false)
    }

    if (state) load()
  }, [state])

  console.log("FETCHING FOR STATE:", state)
console.log("API URL:", `/api/list-member/${state}`)

  return { members, loading }
}
