"use client"

import * as React from "react"
import { Listbox, Transition } from "@headlessui/react"
import { Check, ChevronUpDown } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const Select = Listbox

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: any; placeholder?: string }>(
  ({ className, children, value, placeholder, ...props }, ref) => (
    <Listbox.Button
      as="button"
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      <span className="block truncate">{value || placeholder || children}</span>
      <ChevronUpDown className="h-4 w-4 opacity-50" />
    </Listbox.Button>
  )
)
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <Transition
      as={React.Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options
        ref={ref}
        className={cn(
          "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
          className
        )}
        {...props}
      >
        {children}
      </Listbox.Options>
    </Transition>
  )
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: any }>(
  ({ className, children, value, ...props }, ref) => (
    <Listbox.Option
      value={value}
      className={({ active }) =>
        cn(
          active ? "bg-blue-100 text-blue-900" : "text-gray-900",
          "relative cursor-default select-none py-2 pl-10 pr-4",
          className
        )
      }
      {...props}
    >
      {({ selected }) => (
        <>
          <span className={cn("block truncate", selected ? "font-medium" : "font-normal")}>
            {children}
          </span>
          {selected ? (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
              <Check className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
        </>
      )}
    </Listbox.Option>
  )
)
SelectItem.displayName = "SelectItem"

const SelectValue = ({ value }: { value?: any }) => <>{value}</>

export {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
}
