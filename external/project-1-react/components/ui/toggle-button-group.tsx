"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToggleButtonGroupProps {
  options: Array<{
    value: string
    label: string
  }>
  value: string
  onValueChange: (value: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "compact" | "outline"
  color?: "blue" | "green" | "purple" | "red" | "orange"
}

const sizeClasses = {
  sm: "h-7 sm:h-8 px-2 sm:px-3 text-xs",
  md: "h-8 sm:h-10 px-3 sm:px-4 text-sm",
  lg: "h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base"
}

const colorClasses = {
  blue: {
    active: "bg-blue-600 text-white hover:bg-blue-700",
    inactive: "text-slate-600 hover:text-slate-900"
  },
  green: {
    active: "bg-green-600 text-white hover:bg-green-700",
    inactive: "text-slate-600 hover:text-slate-900"
  },
  purple: {
    active: "bg-purple-600 text-white hover:bg-purple-700",
    inactive: "text-slate-600 hover:text-slate-900"
  },
  red: {
    active: "bg-red-600 text-white hover:bg-red-700",
    inactive: "text-slate-600 hover:text-slate-900"
  },
  orange: {
    active: "bg-orange-600 text-white hover:bg-orange-700",
    inactive: "text-slate-600 hover:text-slate-900"
  }
}

const variantClasses = {
  default: "bg-slate-100 rounded-lg p-1",
  compact: "bg-slate-50 rounded-md p-0.5",
  outline: "border border-slate-200 rounded-lg p-1"
}

export function ToggleButtonGroup({
  options,
  value,
  onValueChange,
  className,
  size = "sm",
  variant = "default",
  color = "blue"
}: ToggleButtonGroupProps) {
  return (
    <div className={cn(
      "flex items-center gap-1",
      variantClasses[variant],
      className
    )}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant={value === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onValueChange(option.value)}
          className={cn(
            sizeClasses[size],
            value === option.value 
              ? colorClasses[color].active 
              : colorClasses[color].inactive
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  )
}
