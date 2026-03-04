"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { PlayIcon } from "@heroicons/react/24/solid"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface DateNavigatorProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  className?: string
}

export function DateNavigator({ selectedDate, onDateChange, className = "" }: DateNavigatorProps) {
  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate)
    prevDay.setDate(prevDay.getDate() - 1)
    onDateChange(prevDay)
  }

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)
    onDateChange(nextDay)
  }

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")

  return (
    <div className={`${className}`}>
      {/* 상단: 좌우 화살표 + (아이콘+날짜) 한 줄 */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePreviousDay}
          aria-label="이전 날"
          className="h-8 w-8 p-0 rounded-none shadow-none border-0 bg-transparent text-gray-500 hover:bg-transparent active:bg-transparent focus-visible:ring-0 focus-visible:outline-none"
        >
          <PlayIcon className="h-4 w-4 rotate-180 fill-current scale-x-50" />
        </Button>

        {/* 아이콘 + 날짜 한 그룹 */}
        <div className="flex items-center gap-2 sm:gap-1.5">
          <Calendar className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
          <div className="text-lg sm:text-lg font-bold text-gray-900">
            {format(selectedDate, "yyyy.MM.dd (E)", { locale: ko })}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNextDay}
          aria-label="다음 날"
          className="h-8 w-8 p-0 rounded-none shadow-none border-0 bg-transparent text-gray-500 hover:bg-transparent active:bg-transparent focus-visible:ring-0 focus-visible:outline-none"
          disabled={isToday}
        >
          <PlayIcon className="h-4 w-4 fill-current scale-x-50" />
        </Button>
      </div>

    </div>
  )
}

