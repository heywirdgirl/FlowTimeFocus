"use client"

import * as React from "react"

import { cn } from "@/shared/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number | null }
>(({ className, value = 0, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ width: `${Math.min(value || 0, 100)}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
