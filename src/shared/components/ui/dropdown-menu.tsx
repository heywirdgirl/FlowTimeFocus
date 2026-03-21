"use client"

import * as React from "react"
import { Menu, Transition } from "@headlessui/react"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/shared/lib/utils"

type DropdownMenuAlign = "start" | "end" | "center"

type DropdownMenuProps = React.ComponentPropsWithoutRef<"div"> & {
  asChild?: boolean
}

const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ className, children, ...props }, ref) => (
    <Menu as="div" className={cn("relative inline-block text-left", className)} ref={ref} {...props}>
      {children}
    </Menu>
  )
)
DropdownMenu.displayName = "DropdownMenu"

const DropdownMenuTrigger = React.forwardRef<
  HTMLElement,
  React.PropsWithChildren<{
    asChild?: boolean
    className?: string
  } & React.ComponentPropsWithoutRef<"button">>
>(({ asChild, className, children, ...props }, ref) => {
  const Component = asChild ? React.Fragment : "button"
  return (
    <Menu.Button as={Component} ref={ref as any} className={className} {...props}>
      {children}
    </Menu.Button>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { align?: DropdownMenuAlign }
>(({ className, align = "start", children, ...props }, ref) => {
  const alignStyles =
    align === "end"
      ? "right-0"
      : align === "center"
      ? "left-1/2 -translate-x-1/2"
      : "left-0"

  return (
    <Transition
      as={React.Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        ref={ref}
        className={cn(
          "absolute z-50 mt-2 min-w-[8rem] origin-top-right divide-y overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          alignStyles,
          className
        )}
        {...props}
      >
        {children}
      </Menu.Items>
    </Transition>
  )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { inset?: boolean; onSelect?: (event: React.MouseEvent<HTMLButtonElement>) => void }>(
  ({ className, inset, onSelect, onClick, children, ...props }, ref) => (
    <Menu.Item>
      {({ active, disabled }) => (
        <button
          type="button"
          ref={ref}
          className={cn(
            "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
            active && "bg-accent text-accent-foreground",
            disabled && "opacity-50 pointer-events-none",
            inset && "pl-8",
            className
          )}
          onClick={(event) => {
            if (disabled) {
              event.preventDefault()
              return
            }
            onClick?.(event)
            onSelect?.(event)
          }}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  )
)
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuLabel: React.FC<React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }> = ({ className, inset, ...props }) => (
  <div
    className={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
    {...props}
  />
)
DropdownMenuLabel.displayName = "DropdownMenuLabel"

const DropdownMenuSeparator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn("mx-1 my-1 h-px bg-muted", className)} {...props} />
)
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuShortcut: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span className={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...props} />
)
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

const DropdownMenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>
const DropdownMenuGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)
const DropdownMenuPortal: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => <>{children}</>
const DropdownMenuSub: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children }) => <>{children}</>
const DropdownMenuSubContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn(className)} {...props}>
    {children}
  </div>
)
const DropdownMenuSubTrigger = DropdownMenuTrigger
const DropdownMenuRadioGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
)
const DropdownMenuCheckboxItem = DropdownMenuItem
const DropdownMenuRadioItem = DropdownMenuItem

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuProvider,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
