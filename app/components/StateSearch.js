'use client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'   

const StateSearch = () => {
  const router = useRouter()

 const handleSearch = (e) => {
  e.preventDefault()
  const id = Number(e.target.stateId.value)
  if (!id || id < 880) {
    toast.error('State ID must be 880 or higher')
    return
  }
  router.push(`/dashboard/state/${id}`)
}


  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <input
        type="number"
        name="stateId"
        min={880}
        placeholder="Enter State ID (min 900)"
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
