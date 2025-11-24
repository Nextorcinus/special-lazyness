import React from 'react'

export default function HeroesLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B0A10] text-white">
      <main className="flex flex-col items-center w-full">
        <div className="w-full md:max-w-[765px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="px-2 py-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
