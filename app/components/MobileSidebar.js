"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { cn } from "../lib/utils";

const menu = [
  { label: "Chief Gear", href: "/dashboard/gear", icon: "/icon-menu/chief-gear.png" },
  { label: "Chief Charm", href: "/dashboard/charm", icon: "/icon-menu/charm.png" },
  { label: "Research", href: "/dashboard/research", icon: "/icon-menu/research.png" },
  { label: "Buildings Upgrade", href: "/dashboard/buildings", icon: "/icon-menu/building.png" },
  { label: "War Academy", href: "/dashboard/war-academy", icon: "/icon-menu/war-academy.png" },
  { label: "Widget", href: "/dashboard/widget", icon: "/icon-menu/widget.png" },
  { label: "Calc Points", href: "/dashboard/general", icon: "/icon-menu/calc.png" },
  { label: "State Age", href: "/dashboard/state", icon: "/icon-menu/state.png" },
  { label: "Experts", href: "/dashboard/dawn", icon: "/icon-menu/dawn.png" },
  { label: 'Foundry', href: '/dashboard/foundry', icon: '/icon-menu/foundry.png' }
];

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // close automatically when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>

        {/* HAMBURGER → X ANIMATION */}
        <SheetTrigger className="relative w-10 h-10 flex items-center justify-center p-2">
          <div className="relative w-6 h-6">
            {/* Line 1 */}
            <span
              className={cn(
                "absolute left-0 w-6 h-[2px] bg-white rounded transition-all duration-300",
                open ? "top-3 rotate-45" : "top-1 rotate-0"
              )}
            />

            {/* Line 2 */}
            <span
              className={cn(
                "absolute left-0 w-6 h-[2px] bg-white rounded transition-all duration-200",
                open ? "opacity-0" : "top-2.5 opacity-100"
              )}
            />

            {/* Line 3 */}
            <span
              className={cn(
                "absolute left-0 w-6 h-[2px] bg-white rounded transition-all duration-300",
                open ? "top-3 -rotate-45" : "top-4 rotate-0"
              )}
            />
          </div>
        </SheetTrigger>

        {/* SIDEBAR */}
        <SheetContent
          side="left"
          className={cn(
            "p-0 w-72 bg-[#044146e6] text-white border-r border-white/10",
            "data-[state=open]:animate-slideInLeft data-[state=closed]:animate-slideOutLeft"
          )}
        >

          {/* HEADER */}
          <SheetHeader className="p-4 border-b border-white/10 relative">
            <SheetTitle className="text-lg font-semibold text-white">
              Navigation
            </SheetTitle>

            <SheetClose className="absolute right-4 top-4 text-white text-2xl hover:text-red-400">
              ✕
            </SheetClose>
          </SheetHeader>

          {/* MENU LIST */}
          <nav className="flex flex-col py-3">
            {menu.map((item) => {
              const isActive = pathname.startsWith(item.href);

              return (
                <SheetClose key={item.label} asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 px-4 py-3 rounded-md transition text-white",
                      isActive
                        ? "bg-white/10 text-[#B3F35F]"
                        : "hover:bg-white/10"
                    )}
                  >
                    <Image
                      src={item.icon}
                      alt={item.label}
                      width={49}
                      height={49}
                    />

                    <span className="text-base text-teal-300">{item.label}</span>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
