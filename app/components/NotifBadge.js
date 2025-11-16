"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

export default function NotifBadge() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const iconRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "State 1067 updated successfully", read: false },
    { id: 2, text: "New data added to Research > Economy", read: false },
    { id: 3, text: "Building upgrade result saved", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* 🔥 CLICK OUTSIDE CLOSE */
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      const dropdown = dropdownRef.current;
      const iconButton = iconRef.current;

      if (iconButton?.contains(e.target)) return; // klik icon → ignore
      if (dropdown?.contains(e.target)) return;   // klik dropdown → ignore

      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open]);

  /* DROPDOWN ELEMENT */
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

            /* === MOBILE CENTER === */
            top-[70px] left-[20%] -translate-x-1/2 
            w-72

            /* === DESKTOP RIGHT UNDER ICON === */
            md:top-[65px]
            md:left-auto
            md:right-[20px]
            md:translate-x-0
          "
        >
          <div
            className="
              w-72 rounded-xl bg-zinc-900/95 
              backdrop-blur-2xl border border-white/20 
              shadow-2xl p-4
            "
          >
            {/* HEADER */}
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

            {/* CONTENT */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`
                    p-3 rounded-lg text-sm border transition
                    ${
                      notif.read
                        ? "bg-white/5 text-gray-200 border-white/10"
                        : "bg-[#B3F35F]/10 text-[#B3F35F] border-[#B3F35F]/20"
                    }
                  `}
                >
                  {notif.text}
                </div>
              ))}
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
        <span className="text-lg">🔔</span>

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

      {/* DROPDOWN PORTAL */}
      {typeof window !== "undefined" && createPortal(dropdown, document.body)}
    </>
  );
}
