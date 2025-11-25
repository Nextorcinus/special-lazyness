"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

export default function HeroList({ heroes }) {
  const [search, setSearch] = useState("")
  const [filterClass, setFilterClass] = useState("all")
  const [filterGen, setFilterGen] = useState("all")

  // ambil semua class unik dari data
  const classOptions = useMemo(() => {
    const set = new Set()
    heroes.forEach(h => set.add(h.class))
    return Array.from(set)
  }, [heroes])

  // ambil generation unik
  const genOptions = useMemo(() => {
    const set = new Set()
    heroes.forEach(h => set.add(h.generation))
    return Array.from(set)
  }, [heroes])

  // filter real
  const filteredHeroes = useMemo(() => {
    return heroes.filter(h => {
      const bySearch = h.name.toLowerCase().includes(search.toLowerCase())
      const byClass = filterClass === "all" || h.class === filterClass
      const byGen = filterGen === "all" || h.generation === filterGen
      return bySearch && byClass && byGen
    })
  }, [heroes, search, filterClass, filterGen])

  return (
    <div className="w-full mx-auto py-10 text-white">

      <h1 className="text-3xl font-bold mb-6">Hero List</h1>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">

        {/* Search */}
        <input
          type="text"
          placeholder="Search hero..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-2 rounded bg-white border text-black/80 border-white/20 w-full md:w-1/4"
        />

        {/* Filter Class */}
        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          className="px-3 py-2 rounded bg-white border border-white/20 text-black/80 w-full md:w-1/4"
        >
          <option value="all">All Classes</option>
          {classOptions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Filter Generation */}
        <select
          value={filterGen}
          onChange={e => setFilterGen(e.target.value)}
          className="px-3 py-2 rounded bg-white border border-white/20 text-black/80 w-full md:w-1/4"
        >
          <option value="all">All Generation</option>
          {genOptions.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

      </div>

      {/* No data */}
      {filteredHeroes.length === 0 && (
        <p className="text-white/60">Tidak ada hero ditemukan.</p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredHeroes.map(hero => (
          <Link
            key={hero.id}
            href={`/dashboard/heroes/${hero.id}`}
            className="group bg-zinc-700/20 border border-white/10 rounded-xl p-3 hover:bg-teal-700 transition"
          >
            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg relative">

              <div className="absolute top-2 right-2 z-10 border border-yellow-900 bg-lime-500 text-black text-sm font-semibold px-2 py-0.5 rounded">
                {hero.generation}
              </div>

              <img
                src={`/icon/${hero.thumbnail}`}
                alt={hero.name}
                className="w-full h-full object-cover group-hover:scale-105 transition"
                draggable="false"
              />
            </div>

            <div className="mt-3">
              <p className="text-lg font-semibold text-green-400">{hero.name}</p>
              <p className="text-sm text-white/50">
                {hero.rarity} {hero.class}
              </p>
            </div>
          </Link>
        ))}


    {/* Floating Tier Button */}
    <Link
      href="/dashboard/Tier"
      className="
        fixed bottom-5 left-1/2 -translate-x-1/2
        bg-white/20 backdrop-blur-md
        border border-white/30
        p-3 rounded-full shadow-lg
        hover:bg-white/90 transition
        flex items-center justify-center
        z-50
      "
    >
      <img
        src="/icon/beartrap.png"
        alt="Tier"
        width="49"
        height="49"
        className="pointer-events-none"
      />
    </Link>


      </div>
    </div>
  )
}
