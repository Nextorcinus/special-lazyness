import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from './components/Sidebar'
import MobileSidebar from './components/MobileSidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Special Lazyness',
  description: 'Upgrade Calculator for Chief Gear, Research, and Buildings',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen bg-zinc-950 text-white">
          {/* Sidebar untuk Desktop */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Konten Utama + Mobile Sidebar */}
          <div className="flex-1 flex flex-col">
            <MobileSidebar />
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
