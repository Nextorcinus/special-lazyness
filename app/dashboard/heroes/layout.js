import React from 'react'

export default function HeroesLayout({ children }) {
  return (
    <main className="w-full flex justify-center text-white">
      <div className="w-full md:max-w-[765px] xl:max-w-[1200px] mt-0 md:mt-12 px-4 md:px-6 lg:px-8">
        <div className="py-2">
          {children}
        </div>
      </div>
    </main>
  )
}
