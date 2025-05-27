'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '../lib/utils'
import { useState } from 'react'
import { useGitVersion } from 'lib/getGitVersion'

const menu = [
  {
    label: 'Chief Gear',
    href: '/dashboard/gear',
    icon: '/icon/gear.png',
    iconHover: '/icon/gear-hover.png',
  },
  {
    label: 'Chief Charm',
    href: '/dashboard/charm',
    icon: '/icon/charm.png',
    iconHover: '/icon/charm-hover.png',
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
  {
    label: 'War Academy',
    href: '/dashboard/war-academy',
    icon: '/icon/war-academy.png',
    iconHover: '/icon/war-academy-hover.png',
  },
  {
    label: 'Widget',
    href: '/dashboard/widget',
    icon: '/icon/widget.png',
    iconHover: '/icon/widget-hover.png',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [hovered, setHovered] = useState(null)
  const version = useGitVersion() // ✅ Panggil hook di dalam komponen

  return (
    <aside className="flex flex-col justify-between w-full h-full lg:w-64 bg-[#1F1F1F] text-white">
      <div>
        <div className="flex justify-center p-4">
          <Link href="/" passHref>
            <Image
              src="/icon/specialLazynessLogo.png"
              alt="Special Lazyness Logo"
              width={179}
              height={43}
              style={{ height: 'auto' }}
              priority
            />
          </Link>
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
      <div className="mt-auto p-10 text-center text-xs text-zinc-400">
        {/* Discord Button */}
        <div className="mb-4">
          <a
            href="https://discordapp.com/users/380668333948928000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2  hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md transition"
          >
            <Image
              src="/icon/discord.png"
              alt="Discord Icon"
              width={16}
              height={16}
            />
            Contact Me
          </a>
        </div>
        © Special Lazyness. <br /> app created by special one #998
        <p className="mt-2 text-xs text-zinc-600 font-mono">
          Version: {version}
        </p>
      </div>
    </aside>
  )
}
