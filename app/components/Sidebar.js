'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '../lib/utils'
import { useState } from 'react'
import { useGitVersion } from 'lib/getGitVersion'

const menu = [
  {
    label: 'Chief Gear',
    href: '/dashboard/gear',
    icon: '/icon-menu/chief-gear.png',
    iconHover: '/icon-menu/chief-gear-hover.png',
  },
  {
    label: 'Chief Charm',
    href: '/dashboard/charm',
    icon: '/icon-menu/charm.png',
    iconHover: '/icon-menu/charm-hover.png',
  },
  {
    label: 'Research',
    href: '/dashboard/research',
    icon: '/icon-menu/research.png',
    iconHover: '/icon-menu/research-hover.png',
  },
  {
    label: 'Buildings Upgrade',
    href: '/dashboard/buildings',
    icon: '/icon-menu/building.png',
    iconHover: '/icon-menu/building-hover.png',
  },
  {
    label: 'War Academy',
    href: '/dashboard/war-academy',
    icon: '/icon-menu/war-academy.png',
    iconHover: '/icon-menu/war-academy-hover.png',
  },
  {
    label: 'Widget',
    href: '/dashboard/widget',
    icon: '/icon-menu/widget.png',
    iconHover: '/icon-menu/widget-hover.png',
  },
  {
    label: 'Calc Points',
    href: '/dashboard/general',
    icon: '/icon-menu/calc.png',
    iconHover: '/icon-menu/calc-hover.png',
  },
  {
    label: 'State Age',
    href: '/dashboard/state',
    icon: '/icon-menu/state.png',
    iconHover: '/icon-menu/state-hover.png',
  },
  {
    label: 'Experts',
    href: '/dashboard/dawn',
    icon: '/icon-menu/dawn.png',
    iconHover: '/icon-menu/dawn-hover.png',
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [hovered, setHovered] = useState(null)
  const version = useGitVersion()

  return (
    <aside
      className={cn(
        'group fixed left-0 top-1/2 -translate-y-1/2 z-[9999] bg-special-inside text-white flex flex-col justify-between items-center transition-all duration-300',
        'w-20 hover:w-64 rounded-2xl overflow-hidden shadow-lg'
      )}
      style={{ height: '80vh', left: '1%' }}
    >
      <div className="w-full">
        <div className="flex justify-center p-4">
          <Link href="/" passHref>
            <Image
              src="/icon/logo-special-small.png"
              alt="Special Lazyness Logo"
              width={49}
              height={49}
              priority
              className="hidden group-hover:block transition-all duration-300 rounded-[50%]"
            />

            <Image
              src="/icon/logo-special-small.png"
              alt="Special Lazyness Logo"
              width={49}
              height={49}
              className="block group-hover:hidden transition-all duration-300 rounded-[50%]"
            />
          </Link>
        </div>

        <nav className="flex flex-col gap-2 px-2 mt-2">
          {menu.map((item) => {
            const isActive = pathname === item.href
            const isHover = hovered === item.label
            const iconSrc = isHover || isActive ? item.iconHover : item.icon

            const linkClasses = cn(
              'flex items-center gap-3 px-3  rounded-md transition-all duration-200',
              isActive ? ' text-[#B3F35F]' : 'hover: text-zinc-300'
            )

            const content = (
              <>
                <Image src={iconSrc} alt={item.label} width={49} height={49} />
                <span
                  className={cn(
                    'whitespace-nowrap overflow-hidden transition-all duration-300',
                    'opacity-0 group-hover:opacity-100 group-hover:translate-x-0',
                    'translate-x-[-10px]'
                  )}
                >
                  {item.label}
                </span>
              </>
            )

            if (item.label === 'State Age') {
              return isActive ? (
                <div
                  key={item.label}
                  className={`${linkClasses} cursor-default`}
                >
                  {content}
                </div>
              ) : (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  onMouseEnter={() => setHovered(item.label)}
                  onMouseLeave={() => setHovered(null)}
                  className={linkClasses}
                >
                  {content}
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
                className={linkClasses}
              >
                {content}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-zinc-400 w-full">
        <div className="flex flex-col items-center gap-2">
          <a
            href="https://discordapp.com/users/380668333948928000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:bg-indigo-700 text-white text-sm px-2 py-2 rounded-md transition"
          >
            <Image
              src="/icon/discord.png"
              alt="Discord Icon"
              width={16}
              height={16}
            />
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Contact Me
            </span>
          </a>

          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
            © Special Lazyness
            <br /> app created by special one #991
            <p className="mt-1 text-xs text-zinc-600 font-mono">
              Version: {version}
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
