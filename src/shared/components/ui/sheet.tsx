"use client"

import * as React from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface SheetContextType {
  open: boolean
  setOpen: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextType | undefined>(undefined)

const Sheet = ({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) => {
  const [internalOpen, setInternalOpen] = React.useState(open ?? false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) setInternalOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <SheetContext.Provider value={{ open: isOpen, setOpen: handleOpenChange }}>
      {children}
    </SheetContext.Provider>
  )
}

const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetTrigger must be used within Sheet")

  return (
    <button
      ref={ref}
      onClick={(e) => {
        context.setOpen(true)
        onClick?.(e)
      }}
      {...props}
    />
  )
})
SheetTrigger.displayName = "SheetTrigger"

const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetClose must be used within Sheet")

  return (
    <button
      ref={ref}
      onClick={(e) => {
        context.setOpen(false)
        onClick?.(e)
      }}
      {...props}
    />
  )
})
SheetClose.displayName = "SheetClose"

// Giữ lại để không break import ở nơi khác
const SheetPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SheetOverlay = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
  )
)
SheetOverlay.displayName = "SheetOverlay"

const sideStyles = {
  left: {
    panel: "left-0 top-0 h-full w-full max-w-sm",
    enter: "translate-x-0",
    enterFrom: "-translate-x-full",
    leave: "translate-x-0",
    leaveFrom: "translate-x-0",
    leaveTo: "-translate-x-full",
  },
  right: {
    panel: "right-0 top-0 h-full w-full max-w-sm",
    enter: "translate-x-0",
    enterFrom: "translate-x-full",
    leave: "translate-x-0",
    leaveFrom: "translate-x-0",
    leaveTo: "translate-x-full",
  },
  top: {
    panel: "top-0 left-0 w-full h-[50vh]",
    enter: "translate-y-0",
    enterFrom: "-translate-y-full",
    leave: "translate-y-0",
    leaveFrom: "translate-y-0",
    leaveTo: "-translate-y-full",
  },
  bottom: {
    panel: "bottom-0 left-0 w-full h-[50vh]",
    enter: "translate-y-0",
    enterFrom: "translate-y-full",
    leave: "translate-y-0",
    leaveFrom: "translate-y-0",
    leaveTo: "translate-y-full",
  },
}

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: "left" | "right" | "top" | "bottom" }
>(({ className, children, side = "right", ...props }, ref) => {
  const context = React.useContext(SheetContext)
  if (!context) throw new Error("SheetContent must be used within Sheet")

  const styles = sideStyles[side]

  return (
    <Dialog
      open={context.open}
      onClose={() => context.setOpen(false)}
      as={React.Fragment}
    >
      <Transition show={context.open} as={React.Fragment}>
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/80"
              onClick={() => context.setOpen(false)}
            />
          </Transition.Child>

          {/* Panel */}
          <Transition.Child
            as={React.Fragment}
            enter="transform transition ease-in-out duration-300"
            enterFrom={styles.enterFrom}
            enterTo={styles.enter}
            leave="transform transition ease-in-out duration-300"
            leaveFrom={styles.leaveFrom}
            leaveTo={styles.leaveTo}
          >
            <div
              ref={ref}
              className={cn(
                "fixed z-50 flex flex-col gap-4 bg-background p-6 shadow-lg",
                styles.panel,
                className
              )}
              {...props}
            >
              {children}
              {/* Nút X đóng */}
              <button
                onClick={() => context.setOpen(false)}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </Dialog>
  )
})
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
SheetDescription.displayName = "SheetDescription"

export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetOverlay,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
