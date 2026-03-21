"use client"

import * as React from "react"

import { cn } from "@/shared/lib/utils"

const Slider = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [value, setValue] = React.useState(props.value || props.defaultValue || 0)

  return (
    <div className="relative flex w-full touch-none select-none items-center">
      <input
        ref={ref}
        type="range"
        className={cn(
          "relative h-2 w-full cursor-pointer appearance-none overflow-hidden rounded-full bg-secondary [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:bg-transparent",
          className
        )}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    </div>
  )
})
Slider.displayName = "Slider"

export { Slider }
