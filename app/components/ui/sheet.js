import * as React from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '../../lib/utils'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

export const SheetContent = React.forwardRef(
  ({ className, side = 'left', children, ...props }, ref) => {
    const descriptionId = React.useId()

    return (
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content
          ref={ref}
          aria-describedby={descriptionId}
          className={cn(
            'fixed z-50 bg-zinc-900 text-white w-64 h-full shadow-lg transition-transform',
            side === 'left' && 'left-0 top-0',
            className
          )}
          {...props}
        >
          <Dialog.Description id={descriptionId} className="sr-only">
            Sheet content area
          </Dialog.Description>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    )
  }
)
SheetContent.displayName = 'SheetContent'

export const SheetHeader = ({ className, ...props }) => (
  <div className={cn('px-4 py-2', className)} {...props} />
)
SheetHeader.displayName = 'SheetHeader'

export const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))
SheetTitle.displayName = 'SheetTitle'
