"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotifBadge() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const defaultNotifications = [
    {
      id: 1,
      text: "State 1067 updated successfully",
      href: null,
      read: false,
    },
    {
      id: 2,
      text: "New data added to Research > Economy",
      href: "/dashboard/research",
      read: false,
    },
    {
      id: 3,
      text: "Building upgrade result saved",
      href: "/dashboard/buildings",
      read: true,
    },
  ];

  /* LOAD FROM LOCALSTORAGE */
  useEffect(() => {
    const saved = localStorage.getItem("notifications");

    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      setNotifications(defaultNotifications);
    }

    setIsReady(true);
  }, []);

  /* SAVE TO LOCALSTORAGE */
  useEffect(() => {
    if (isReady) {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    }
  }, [notifications, isReady]);

  /* CLICK OUTSIDE */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (iconRef.current?.contains(e.target)) return;
      if (dropdownRef.current?.contains(e.target)) return;
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  /* JIKA BELUM READY → JANGAN RENDER NOTIF */
  if (!isReady) {
    return (
      <button className="relative w-9 h-9 rounded-full flex items-center justify-center">
        <span className="text-lg">🔔</span>
      </button>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* DROPDOWN UI */
  const dropdown = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18 }}
          className="
            fixed z-[99999]
            top-[60px] left-[20%]  w-72
            md:top-[65px] md:left-auto md:right-[160px] md:translate-x-0
          "
        >
          <div
            className="
              w-72 rounded-xl bg-zinc-900/45 
              backdrop-blur-lg border border-white/20
              shadow-2xl p-4
            "
          >
            {/* Header */}
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

            {/* LIST */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {notifications.map((notif) =>
                notif.href ? (
                  /* === LINK NOTIFICATION === */
                  <Link
                    key={notif.id}
                    href={notif.href}
                    className="block"
                    onClick={(e) => {
                      e.preventDefault();

                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notif.id ? { ...n, read: true } : n
                        )
                      );

                      setOpen(false);

                      setTimeout(() => {
                        router.push(notif.href);
                      }, 50);
                    }}
                  >
                    <div
                      className={`
                        p-3 rounded-lg text-sm border transition cursor-pointer
                        ${
                          notif.read
                            ? "bg-white/5 text-gray-200 border-white/10"
                            : "bg-[#B3F35F]/10 text-[#B3F35F] border-[#B3F35F]/20"
                        }
                      `}
                    >
                      {notif.text}
                    </div>
                  </Link>
                ) : (
                  /* === NON-LINK NOTIFICATION === */
                  <div
                    key={notif.id}
                    onClick={() => {
                      setNotifications((prev) =>
                        prev.map((n) =>
                          n.id === notif.id ? { ...n, read: true } : n
                        )
                      );
                    }}
                    className={`
                      p-3 rounded-lg text-sm border transition cursor-default
                      ${
                        notif.read
                          ? "bg-white/5 text-gray-200 border-white/10"
                          : "bg-[#B3F35F]/10 text-[#B3F35F] border-[#B3F35F]/20"
                      }
                    `}
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
  );

  return (
    <>
      {/* ICON BUTTON */}
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
    <span
      className="
        absolute -top-1 -right-1 w-5 h-5 bg-red-500 
        rounded-full text-xs flex items-center 
        justify-center text-white shadow-lg
      "
    >
      {unreadCount}
    </span>
  )}
</button>


      {/* PORTAL */}
      {typeof window !== "undefined" && createPortal(dropdown, document.body)}
    </>
  );
}
