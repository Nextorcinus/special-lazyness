"use client";

import Image from "next/image";
import Link from "next/link";
import NotifBadge from "./NotifBadge";
import MobileSidebar from "./MobileSidebar";

export default function Header() {
  return (
    <header
      className="
        w-full h-16 fixed top-0 left-0 z-[999]
        bg-white/5 backdrop-blur-xl 
        border-b border-white/10
        flex items-center justify-between
        px-6
      "
    >
      {/* LEFT AREA: LOGO */}
      <div className="flex items-center gap-3">
        <Image 
          src="/icon/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-md"
        />

        <span className="text-white  hidden md:block">
          Special Lazyness
        </span>
      </div>

      {/* RIGHT AREA */}
      <div className="flex items-center gap-5">
        
        {/* Notification */}
        <NotifBadge />

        {/* Contact Us */}
        <Link
          href="/contact"
          className="
            flex items-center gap-2 px-3 py-2 
            rounded-xl bg-white/10 hover:bg-white/20 
            border border-white/20 transition
            text-white text-sm
          "
        >
          <Image 
            src="/icon/discord.png"
            alt="Contact Us"
            width={20}
            height={20}
          />
          <span className="hidden text-white md:block">Contact Us</span>
        </Link>

        {/* Mobile Sidebar Menu Button */}
        <div className="block lg:hidden">
          <MobileSidebar />
        </div>

      </div>
    </header>
  );
}
