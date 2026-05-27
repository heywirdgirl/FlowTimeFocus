"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const Select = SelectPrimitive.Root

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: any; placeholder?: string }>(
  ({ className, children, value, placeholder, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      <span className="block truncate">{value || placeholder || children}</span>
      <SelectPrimitive.Icon>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
)
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
          className
        )}
        {...props}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: any }>(
  ({ className, children, value, ...props }, ref) => (
    <SelectPrimitive.Item
      value={value}
      ref={ref}
      className={cn(
        "relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-900",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className={cn("block truncate")}>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
        <Check className="h-5 w-5" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
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
