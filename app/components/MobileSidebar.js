'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from './ui/sheet'
import Sidebar from './Sidebar'

export default function MobileSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // tutup sheet tiap kali path berubah
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="lg:hidden p-4 bg-zinc-800">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="flex flex-col gap-1 p-2">
          <span className="w-6 h-0.5 bg-white rounded"></span>
          <span className="w-6 h-0.5 bg-white rounded"></span>
          <span className="w-6 h-0.5 bg-white rounded"></span>
        </SheetTrigger>

        <SheetContent side="left" className="p-0 w-64 bg-zinc-900 border-none">
          <SheetHeader className="py-0">
            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
          </SheetHeader>

          <SheetClose className="fixed top-2 left-[254px] bg-[#1f1f1f] px-4 py-2 text-white hover:text-red-500 rounded">
            ✕
          </SheetClose>

          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
