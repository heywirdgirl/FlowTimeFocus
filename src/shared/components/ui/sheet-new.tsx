"use client"

import * as React from "react"
import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogClose, DialogContent } from "./dialog"

const Sheet = Dialog
const SheetTrigger = DialogTrigger
const SheetPortal = DialogPortal
const SheetOverlay = DialogOverlay
const SheetClose = DialogClose

const SheetContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { side?: "left" | "right" | "top" | "bottom" }
>(({ className, side = "right", ...props }, ref) => {
  const sideStyles = {
    left: "left-0 h-full w-full max-w-sm",
    right: "right-0 h-full w-full max-w-sm",
    top: "top-0 w-full h-[50vh]",
    bottom: "bottom-0 w-full h-[50vh]",
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogContent
        ref={ref}
        className={`fixed z-50 gap-4 bg-background p-6 shadow-lg duration-200 ${sideStyles[side]} ${className || ""}`}
        {...props}
      />
    </SheetPortal>
  )
})
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col space-y-2 text-center sm:text-left ${className || ""}`} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className || ""}`} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={`text-lg font-semibold leading-none tracking-tight ${className || ""}`} {...props} />
  )
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={`text-sm text-muted-foreground ${className || ""}`} {...props} />
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
