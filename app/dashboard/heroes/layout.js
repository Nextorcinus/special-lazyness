import React from 'react'

export default function HeroesLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex justify-center items-center text-white">
      <main className="w-full flex justify-center">
        <div className="w-full md:max-w-[765px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="py-2">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
