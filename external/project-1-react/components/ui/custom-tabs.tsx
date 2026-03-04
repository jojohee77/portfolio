import React from "react"
import { cn } from "@/lib/utils"

interface TabItem {
  value: string
  label: string
}

interface CustomTabsProps {
  tabs: TabItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function CustomTabs({ tabs, value, onValueChange, className }: CustomTabsProps) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <div className="inline-flex h-8 items-center justify-start gap-2 bg-transparent p-0 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onValueChange(tab.value)}
            className={cn(
              "rounded-full px-3 py-1 text-xs transition-all duration-200 whitespace-nowrap flex-shrink-0",
              value === tab.value
                ? "bg-blue-500 text-white shadow-none"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
