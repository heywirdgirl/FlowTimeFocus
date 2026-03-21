"use client"

import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(false)

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        ref={ref}
        type="checkbox"
        className="sr-only"
        onChange={(e) => setIsChecked(e.target.checked)}
        {...props}
      />
      <div
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-colors",
          isChecked && "bg-primary text-primary-foreground",
          className
        )}
      >
        {isChecked && <Check className="h-4 w-4" />}
      </div>
    </label>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
