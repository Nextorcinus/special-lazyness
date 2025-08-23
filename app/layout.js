import './globals.css'
import Sidebar from './components/Sidebar'
import MobileSidebar from './components/MobileSidebar'
import WelcomePopup from './components/Popup'

import { Component, Router } from 'lucide-react'

export const metadata = {
  title: 'Special Lazyness',
  description: 'Upgrade Calculator for Chief Gear, Research, and Buildings',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased font-fustat">
        <WelcomePopup />
        <div className="min-h-screen bg-zinc-900 grid grid-cols-1 lg:grid-cols-[240px_1fr]">
          {/* Sidebar untuk Desktop */}
          <div className="hidden lg:block bg-black">
            <Sidebar />
          </div>

          {/* Konten Utama + Mobile Sidebar */}
          <div className="flex-1 flex flex-col">
            <MobileSidebar />
            <main className="flex-1 w-full bg-special overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  )
}
