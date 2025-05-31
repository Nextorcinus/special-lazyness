'use client'
import { useRouter } from 'next/navigation'

const StateSearch = () => {
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    const id = e.target.stateId.value
    if (!id) return
    router.push(`/dashboard/state/${id}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        name="stateId"
        placeholder="Enter State ID"
        className="bg-zinc-800 px-4 py-2 rounded"
      />
      <button
        type="submit"
        className="bg-lime-500 hover:bg-lime-600 px-4 py-2 rounded text-white"
      >
        Track
      </button>
    </form>
  )
}

export default StateSearch
