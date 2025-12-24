'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function NotifBadge() {
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)
  const iconRef = useRef(null)

  const [notifications, setNotifications] = useState([])
  const [isReady, setIsReady] = useState(false)

  /* tambahkan versi notif */
  const NOTIF_VERSION = 1

  const defaultNotifications = [
    {
      id: 1,
      text: 'Troops Assistant Feature Added',
      href: '/dashboard/troops',
      read: false,
    },
    {
      id: 2,
      text: 'New Charm Lv.16 Updated',
      href: '/dashboard/research',
      read: true,
    },
    {
      id: 3,
      text: 'New Gear Pink T4 Updated',
      href: '/dashboard/gear',
      read: true,
    },
    {
      id: 4,
      text: 'New Expert Hero Dawn',
      href: '/dashboard/dawn',
      read: true,
    },
    {
      id: 5,
      text: 'Heroes Whiteout Survival',
      href: '/dashboard/heroes',
      read: true,
    },
    {
      id: 6,
      text: 'New UI interface',
      href: null,
      read: true,
    },
  ]

  /* LOAD FROM LOCALSTORAGE, TAPI CEK VERSI */
  useEffect(() => {
    const saved = localStorage.getItem('notifications')
    const savedVersion = localStorage.getItem('notif_version')

    if (saved && String(savedVersion) === String(NOTIF_VERSION)) {
      setNotifications(JSON.parse(saved))
    } else {
      setNotifications(defaultNotifications)
      localStorage.setItem('notif_version', NOTIF_VERSION)
      localStorage.setItem(
        'notifications',
        JSON.stringify(defaultNotifications)
      )
    }

    setIsReady(true)
  }, [])

  /* SAVE TO LOCALSTORAGE */
  useEffect(() => {
    if (isReady) {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    }
  }, [notifications, isReady])

  /* CLICK OUTSIDE */
  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e) => {
      if (iconRef.current?.contains(e.target)) return
      if (dropdownRef.current?.contains(e.target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [open])

  if (!isReady) {
    return (
      <button className="relative w-9 h-9 rounded-full flex items-center justify-center">
        <span className="text-lg">🔔</span>
      </button>
    )
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  /* DROPDOWN */
  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className="fixed z-[99999] top-[60px] left-[20%] w-72 md:top-[65px] md:left-auto md:right-[160px]"
        >
          <div className="w-72 rounded-xl bg-zinc-900/45 backdrop-blur-lg border border-white/20 shadow-2xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-white">
                Notifications
              </span>

              {unreadCount > 0 && (
                <button
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, read: true }))
                    )
                  }
                  className="text-xs text-[#B3F35F] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto  pr-1">
              {notifications.map((notif) =>
                notif.href ? (
                  <Link
                    key={notif.id}
                    href={notif.href}
                    className="block"
                    onClick={(e) => {
                      e.preventDefault()

                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notif.id ? { ...n, read: true } : n
                        )
                      )

                      setOpen(false)

                      setTimeout(() => router.push(notif.href), 50)
                    }}
                  >
                    <div
                      className={
                        notif.read
                          ? 'p-3 rounded-lg text-sm border bg-white/5 text-gray-200 border-white/10'
                          : 'p-3 rounded-lg text-sm border bg-[#B3F35F]/10 text-[#B3F35F] border-[#B3F35F]/20'
                      }
                    >
                      {notif.text}
                    </div>
                  </Link>
                ) : (
                  <div
                    key={notif.id}
                    onClick={() =>
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notif.id ? { ...n, read: true } : n
                        )
                      )
                    }
                    className={
                      notif.read
                        ? 'p-3 rounded-lg text-sm border bg-white/5 text-gray-200 border-white/10'
                        : 'p-3 rounded-lg text-sm border bg-[#B3F35F]/10 text-[#B3F35F] border-[#B3F35F]/20'
                    }
                  >
                    {notif.text}
                  </div>
                )
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <button
        ref={iconRef}
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center"
      >
        <Image
          src="/icon/notif.png"
          width={22}
          height={22}
          alt="Notification Icon"
          className="object-contain"
        />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {typeof window !== 'undefined' && createPortal(dropdown, document.body)}
    </>
  )
}
