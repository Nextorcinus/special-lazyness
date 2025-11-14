'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { useState } from 'react'

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

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-[9999]",
        "bg-special-inside text-white flex flex-col items-center",
        "transition-all duration-300 rounded-2xl shadow-lg py-6 px-3",
        expanded ? "w-[260px]" : "w-[120px] py-6 px-3",
        "overflow-hidden"
      )}
      style={{ left: '1%' }}
    >
      {/* Toggle Arrow */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "absolute right-[-14px] top-1/2 -translate-y-1/2",
          "w-7 h-7 bg-[#FFFFFF20] backdrop-blur-md rounded-full",
          "flex items-center justify-center shadow-md border border-white/20",
          "hover:bg-white/30 transition"
        )}
      >
        {expanded ? "◀" : "▶"}
      </button>

      

      {/* Navigation */}
      <nav className="flex flex-col gap-2 w-full px-3 mt-4">
        {menu.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center rounded-md transition py-1",
                isActive ? "text-[#B3F35F]" : "text-white/80 hover:text-white"
              )}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={49}
                height={49}
              />

              {/* smoother text slide */}
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap text-base transition-all duration-300",
                  expanded
                    ? "opacity-100 text-white ml-3 max-w-[200px]"
                    : "opacity-0 ml-0 max-w-0"
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
