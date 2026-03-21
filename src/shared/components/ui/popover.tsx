"use client"

import * as React from "react"
import { Popover as HeadlessPopover, Transition } from "@headlessui/react"

import { cn } from "@/shared/lib/utils"

const Popover = ({ children }: { children: React.ReactNode }) => (
  <HeadlessPopover className="relative">
    {children}
  </HeadlessPopover>
)

const PopoverTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  (props, ref) => (
    <HeadlessPopover.Button as="button" ref={ref} {...props} />
  )
)
PopoverTrigger.displayName = "PopoverTrigger"

const PopoverContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <Transition
      as={React.Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <HeadlessPopover.Panel
        ref={ref}
        className={cn(
          "absolute z-10 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
          className
        )}
        {...props}
      >
        {children}
      </HeadlessPopover.Panel>
    </Transition>
  )
)
PopoverContent.displayName = "PopoverContent"

export { Popover, PopoverTrigger, PopoverContent }
