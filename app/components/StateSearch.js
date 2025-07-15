'use client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const StateSearch = () => {
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    const id = Number(e.target.stateId.value)

    // Validasi manual
    if (isNaN(id) || id < 500 || id > 3148) {
      toast.error('State ID must be between 500 and 3148')
      return
    }

    router.push(`/dashboard/state/${id}`)
  }

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="number"
        name="stateId"
        min={500}
        max={3148}
        placeholder="Enter State ID (max 3100)"
        className="bg-zinc-800 px-4 py-2 rounded w-64"
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
