'use client'

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
  return (
    <div className="lg:hidden p-4">
      <Sheet>
        <SheetTrigger className="flex flex-col gap-1 p-2 group">
          <span className="w-6 h-0.5 bg-white rounded"></span>
          <span className="w-6 h-0.5 bg-white rounded"></span>
          <span className="w-6 h-0.5 bg-white rounded"></span>
        </SheetTrigger>

        <SheetContent side="left" className="p-0 w-64 bg-zinc-900 border-none">
          <SheetHeader>
            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
          </SheetHeader>

          <SheetClose className="absolute top-4 right-4 text-white hover:text-red-500">
            ✕
          </SheetClose>

          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
