import React from 'react'

export default function HeroesLayout({ children }) {
  return (
    <main
      className="w-full flex justify-center text-white"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="w-full md:max-w-[765px] xl:max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="py-2">
          {children}
        </div>
      </div>
    </main>
  )
}
