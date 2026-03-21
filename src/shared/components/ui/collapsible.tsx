"use client"

import * as React from "react"

interface CollapsibleContextType {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CollapsibleContext = React.createContext<CollapsibleContextType | undefined>(undefined)

const Collapsible = ({ children, defaultOpen = false, onOpenChange }: { children: React.ReactNode; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const [open, setOpen] = React.useState(defaultOpen)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div>
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ onClick, ...props }, ref) => {
    const context = React.useContext(CollapsibleContext)
    if (!context) throw new Error("CollapsibleTrigger must be used within Collapsible")

    return (
      <button
        ref={ref}
        onClick={(e) => {
          context.onOpenChange(!context.open)
          onClick?.(e)
        }}
        {...props}
      />
    )
  }
)
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ children, ...props }, ref) => {
  const context = React.useContext(CollapsibleContext)
  if (!context) throw new Error("CollapsibleContent must be used within Collapsible")

  if (!context.open) return null

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
