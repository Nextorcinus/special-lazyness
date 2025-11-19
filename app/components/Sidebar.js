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
  { label: 'Foundry', href: '/dashboard/foundry', icon: '/icon-menu/foundry.png' }
]

export default function Sidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)

  return (
    <aside
      className={cn(
        "fixed top-1/2 -translate-y-1/2 z-[9999]",
        "special-glass-menu text-white flex flex-col items-center",
        "transition-all duration-300  rounded-[20px] shadow-lg py-6 px-3 ",
        expanded ? "w-[260px]" : "w-[90px] rounded-[40px] py-6 px-2",
        ""
      )}
      style={{ left: '1%' }}
    >
      {/* Toggle Arrow */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "absolute right-[-14px] top-1/2 -translate-y-1/2",
          "w-7 h-7 bg-[#02020240] backdrop-blur-md rounded-full",
          "flex items-center justify-center shadow-md border text-white border-zinc-200/40",
          "hover:bg-white/30 transition"
        )}
      >
        {expanded ? "🡨" : "🡪"}
      </button>

      

      {/* Navigation */}
      <nav className="flex flex-col gap-2 w-full px-3 mt-4">
        {menu.map((item) => {
          const isActive = pathname.startsWith(item.href)

          return (
           <Link
  key={item.label}
  href={item.href}
  onClick={() => setExpanded(false)}   
  className={cn(
    "flex items-center rounded-xl transition py-1 cursor-pointer",
    isActive ? "text-[#B3F35F] bg-[#17546c]/50" : "text-white/80 hover:text-white hover:bg-white/10 ",
  )}
>
  <Image
    src={item.icon}
    alt={item.label}
    width={44}
    height={44}
    loading="lazy"
  />

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
