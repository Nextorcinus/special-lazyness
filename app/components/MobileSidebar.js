'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from './ui/sheet'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '../lib/utils'

const menu = [
  { label: 'Chief Gear', href: '/dashboard/gear', icon: '/icon-menu/chief-gear.png' },
  { label: 'Chief Charm', href: '/dashboard/charm', icon: '/icon-menu/charm.png' },
  { label: 'Research', href: '/dashboard/research', icon: '/icon-menu/research.png' },
  { label: 'Buildings Upgrade', href: '/dashboard/buildings', icon: '/icon-menu/building.png' },
  { label: 'War Academy', href: '/dashboard/war-academy', icon: '/icon-menu/war-academy.png' },
  { label: 'Widget', href: '/dashboard/widget', icon: '/icon-menu/widget.png' },
  { label: 'Calc Points', href: '/dashboard/general', icon: '/icon-menu/calc.png' },
  { label: 'State Age', href: '/dashboard/state', icon: '/icon-menu/state.png' },
  { label: 'Experts', href: '/dashboard/dawn', icon: '/icon-menu/dawn.png' },
]

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Tutup saat pindah halaman
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="lg:hidden p-4 bg-zinc-800">
      <Sheet open={open} onOpenChange={setOpen}>
        
        {/* HAMBURGER */}
        <SheetTrigger className="flex flex-col gap-1 p-2">
          <span className="w-7 h-0.5 bg-white rounded"></span>
          <span className="w-7 h-0.5 bg-white rounded"></span>
          <span className="w-7 h-0.5 bg-white rounded"></span>
        </SheetTrigger>


        {/* SIDEBAR MOBILE */}
        <SheetContent
          side="left"
          className="p-0 w-72 bg-[#044146e6] text-white border-r border-white/10"
        >
          {/* HEADER */}
          <SheetHeader className="p-4 border-b border-white/10 relative">
            <SheetTitle className="text-lg font-semibold text-white">
              Navigation
            </SheetTitle>

            {/* ICON X CLOSE */}
            <SheetClose 
              className="absolute right-4 top-4 text-white text-2xl hover:text-red-400"
            >
              ✕
            </SheetClose>
          </SheetHeader>

          {/* MENU LIST */}
          <nav className="flex flex-col py-3">
            {menu.map((item) => {
              const isActive = pathname.startsWith(item.href)

              return (
                <SheetClose key={item.label} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-md transition text-white",
                      isActive
                        ? "bg-white/10 text-[#B3F35F]"
                        : "hover:bg-white/10"
                    )}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={49}
                      height={49}
                      className="opacity-100"
                    />

                    <span className="text-base text-white">{item.label}</span>
                  </Link>
                </SheetClose>
              )
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}
