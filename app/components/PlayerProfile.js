'use client'
import { useEffect, useState } from 'react'

export default function PlayerProfile({ playerId }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playerId) return

    async function fetchData() {
      try {
        const res = await fetch(`/api/player?playerId=${playerId}`)
        const result = await res.json()

        if (result.code === 0 && result.data) {
          setData(result.data)
        } else {
          setError('failed to load player date')
        }
      } catch (err) {
        console.error(err)
        setError('failed to load.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [playerId])

  if (loading) return <p className="text-center mt-4">loading player...</p>
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (!data)
    return <p className="text-center text-gray-500">data not found</p>

  return (
  <div className="max-w-[220px] mx-auto bg-[#0e2642b9] border border-zinc-100/40 rounded-xl shadow-md p-4 text-center">
    <img
      src={data.avatar_image}
      alt={data.nickname}
      className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-gray-200"
    />

      <p className="text-xs text-zinc-400">ID: {data.fid}</p>
    <h2 className="text-lg text-white mb-1">
      {data.nickname}
    </h2>

    <div className="flex justify-center items-center gap-2 mb-2">
      <span className="text-white text-sm font-medium">Furnace:</span>
      <img
        src={data.stove_lv_content}
        alt="Furnace Level"
        className="w-7 h-7"
      />
    </div>

    <p className="text-gray-300 text-sm -mt-1">State: {data.kid}</p>
  </div>
)

}
