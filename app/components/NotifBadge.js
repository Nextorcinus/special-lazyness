"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NotifBadge() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "State 1067 updated successfully", read: false },
    { id: 2, text: "New data added to Research > Economy", read: false },
    { id: 3, text: "Building upgrade result saved", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  return (
    <div className="relative">
      {/* ICON */}
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 rounded-full  flex items-center justify-center"
      >
        <span className="text-lg">🔔</span>

        {unreadCount > 0 && (
          <span className="absolute -top-[-10px] -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white shadow-lg">
            {unreadCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 rounded-xl bg-zinc-900/95 backdrop-blur-2xl border border-white/20 shadow-2xl p-4 z-50"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-white">Notifications</span>

              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#B3F35F] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {notifications.length === 0 && (
                <p className="text-gray-200 text-sm text-center py-3">
                  No notifications
                </p>
              )}

              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-lg text-sm border transition
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
