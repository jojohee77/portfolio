"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  date?: { from: Date; to: Date }
  onDateChange?: (date: { from: Date; to: Date } | undefined) => void
  placeholder?: string
  className?: string
}

export function DateRangePicker({
  date,
  onDateChange,
  placeholder = "날짜 범위 선택",
  className
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) return

    if (selectedRange.from && selectedRange.to) {
      // 범위가 완성됨
      onDateChange?.({ from: selectedRange.from, to: selectedRange.to })
      setIsOpen(false)
    } else if (selectedRange.from) {
      // 시작 날짜만 선택됨
      onDateChange?.({ from: selectedRange.from, to: selectedRange.from })
    }
  }

  const formatDateRange = () => {
    if (!date?.from) return placeholder
    
    if (date.from && date.to) {
      if (date.from.getTime() === date.to.getTime()) {
        return format(date.from, "yyyy-MM-dd", { locale: ko })
      }
      return `${format(date.from, "yyyy-MM-dd", { locale: ko })} ~ ${format(date.to, "yyyy-MM-dd", { locale: ko })}`
    }
    
    return format(date.from, "yyyy-MM-dd", { locale: ko })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={handleDateSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
