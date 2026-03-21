"use client"

import * as React from "react"
import { Circle } from "lucide-react"

import { cn } from "@/shared/lib/utils"

interface RadioGroupContextType {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextType>({})

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string
    onValueChange?: (value: string) => void
    defaultValue?: string
  }
>(({ className, value, onValueChange, defaultValue, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue || value)

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue)
    onValueChange?.(newValue)
  }

  return (
    <RadioGroupContext.Provider value={{ value: internalValue, onValueChange: handleValueChange }}>
      <div
        ref={ref}
        className={cn("grid gap-2", className)}
        role="radiogroup"
        {...props}
      />
    </RadioGroupContext.Provider>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(RadioGroupContext)
  const isChecked = context.value === value

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="radio"
        value={value}
        checked={isChecked}
        onChange={(e) => context.onValueChange?.(e.target.value)}
        className="sr-only"
        {...props}
      />
      <div
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-colors",
          isChecked && "bg-primary",
          className
        )}
      >
        {isChecked && <Circle className="h-2.5 w-2.5 fill-primary text-background" />}
      </div>
    </label>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
