"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/shared/lib/utils"

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple"
    defaultValue?: string | string[]
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
  }
>(
  (
    {
      type = "single",
      defaultValue,
      value: controlledValue,
      onValueChange,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [openItems, setOpenItems] = React.useState<string[]>(
      Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : []
    )

    const value = controlledValue
      ? Array.isArray(controlledValue)
        ? controlledValue
        : [controlledValue]
      : openItems

    const handleToggle = (itemId: string) => {
      let newValue: string[]

      if (type === "single") {
        newValue = value.includes(itemId) ? [] : [itemId]
      } else {
        newValue = value.includes(itemId)
          ? value.filter((id) => id !== itemId)
          : [...value, itemId]
      }

      setOpenItems(newValue)
      onValueChange?.(type === "single" ? newValue[0] : newValue)
    }

    const childrenWithProps = React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          openItems,
          onToggle: handleToggle,
        } as any)
      }
      return child
    })

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {childrenWithProps}
      </div>
    )
  }
)
Accordion.displayName = "Accordion"

interface AccordionItemContextType {
  isOpen: boolean
  onToggle: () => void
  itemId: string
}

const AccordionItemContext = React.createContext<AccordionItemContextType | null>(null)

const useAccordionItem = () => {
  const context = React.useContext(AccordionItemContext)
  if (!context) {
    throw new Error("AccordionItem components must be used within AccordionItem")
  }
  return context
}

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value: string
    openItems?: string[]
    onToggle?: (itemId: string) => void
  }
>(({ value, openItems = [], onToggle, className, children, ...props }, ref) => {
  const isOpen = openItems.includes(value)

  return (
    <AccordionItemContext.Provider
      value={{
        isOpen,
        onToggle: () => onToggle?.(value),
        itemId: value,
      }}
    >
      <div ref={ref} className={cn("border-b", className)} {...props}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  )
})
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen, onToggle } = useAccordionItem()

  return (
    <button
      ref={ref}
      onClick={onToggle}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useAccordionItem()

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all",
        isOpen ? "py-4" : "py-0"
      )}
      {...props}
    >
      <div className={cn("", className)}>{children}</div>
    </div>
  )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
