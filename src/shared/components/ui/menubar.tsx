"use client"

import * as React from "react"
import { cn } from "@/shared/lib/utils"

const Menubar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("flex h-10 items-center space-x-1 rounded-md border bg-background p-1", className)} {...props}>
    {children}
  </div>
)

const MenubarMenu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)

const MenubarGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)

const MenubarPortal: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => <>{children}</>
const MenubarRadioGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)

const MenubarSub: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)

const MenubarTrigger = React.forwardRef<HTMLButtonElement, { className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "flex cursor-pointer select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
MenubarTrigger.displayName = "MenubarTrigger"

const MenubarSubTrigger = MenubarTrigger

const MenubarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("absolute z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)} {...props}>
    {children}
  </div>
)

const MenubarItem = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { inset?: boolean }>(
  ({ className, inset, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
MenubarItem.displayName = "MenubarItem"

const MenubarCheckboxItem = MenubarItem
const MenubarRadioItem = MenubarItem

const MenubarSubContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn("min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground", className)} {...props}>
    {children}
  </div>
)

const MenubarLabel: React.FC<React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }> = ({ className, inset, children, ...props }) => (
  <div className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)} {...props}>
    {children}
  </div>
)

const MenubarSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
)

const MenubarShortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
)

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
