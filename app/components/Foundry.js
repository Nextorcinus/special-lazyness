'use client'
import { useEffect } from 'react'
import MemberList from './FoundryMemberList'
import TaskList from './FoundryTaskList'
import {
  FoundryProvider,
  useFoundry,
} from '../dashboard/foundry/FoundryContext'
import list from '../data/listNameMember.json'

function InnerBoard() {
  const { setMembers } = useFoundry()

  useEffect(() => {
    setMembers(list)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TaskList />
      <MemberList />
    </div>
  )
}

export default function Foundry() {
  return (
    <FoundryProvider>
      <InnerBoard />
    </FoundryProvider>
  )
}
