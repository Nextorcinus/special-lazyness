'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { useState } from 'react'

const menu = [
  {
    label: 'Chief Gear',
    href: '/dashboard/gear',
    icon: '/icon/gear.png',
    iconHover: '/icon/gear-hover.png',
  },
  {
    label: 'Research',
    href: '/dashboard/research',
    icon: '/icon/research.png',
    iconHover: '/icon/research-hover.png',
  },
  {
    label: 'Buildings Upgrade',
    href: '/dashboard/buildings',
    icon: '/icon/buildings.png',
    iconHover: '/icon/buildings-hover.png',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState(null)

  return (
    <aside className="w-full h-full lg:w-64 bg-[#1F1F1F] text-white justify-between">
      <div>
        <div className="flex justify-center p-4">
          <Image
            src="/icon/specialLazynessLogo.png"
            alt="Special Lazyness Logo"
            width={179}
            height={43}
            style={{ height: 'auto' }}
            priority
          />
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {menu.map((item) => {
            const isActive = pathname === item.href
            const isHover = hovered === item.label

            return (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-zinc-800 text-green-500'
                    : 'hover:bg-zinc-800 text-zinc-300'
                )}
              >
                <Image
                  src={isHover || isActive ? item.iconHover : item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-zinc-500">
        © Special Lazyness
      </div>
    </aside>
  )
}
