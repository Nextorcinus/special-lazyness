import React from 'react'

export default function HeroesDawnLayout({ children }) {
  return (
    <div className="min-h-screen bg-special text-white">
      <header className="p-4 border-b border-gray-400">
        <h1 className="text-2xl font-bold">Dawn Heroes</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}
