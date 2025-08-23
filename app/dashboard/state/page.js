'use client'
import StateSearch from '../../components/StateSearch'
import { Toast } from 'sonner'

export default function StateIndexPage() {
  return (
    <div className="flex justify-center items-center min-h-screen  text-lime-400">
      <div className="p-6 text-center">
        <h1 className="text-xl font-bold mb-4">State Age Track</h1>
        <StateSearch />
      </div>
    </div>
  )
}
