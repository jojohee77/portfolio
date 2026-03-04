'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomDatePickerProps {
  selected?: Date | null
  onChange?: (date: Date | null) => void
  onRangeChange?: (start: Date | null, end: Date | null) => void
  placeholder?: string
  className?: string
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
  rangeStart?: Date | null
  rangeEnd?: Date | null
  selectRange?: boolean
  size?: 'default' | 'small' | 'compact'
  position?: 'top' | 'bottom'
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  onChange,
  onRangeChange,
  placeholder = "날짜를 선택하세요",
  className,
  minDate,
  maxDate,
  disabled = false,
  rangeStart,
  rangeEnd,
  selectRange = false,
  size = 'default',
  position = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(selected || rangeStart || new Date())
  const [currentYear, setCurrentYear] = useState(selected || rangeStart || new Date())
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [tempRangeStart, setTempRangeStart] = useState<Date | null>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // 월 변경
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  // 년도 변경
  const changeYear = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setFullYear(newDate.getFullYear() - 1)
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1)
      }
      return newDate
    })
  }

  // 날짜 선택
  const selectDate = (date: Date) => {
    if (selectRange && onRangeChange) {
      // 범위 선택 모드
      if (!tempRangeStart || (rangeStart && rangeEnd)) {
        // 첫 번째 날짜 선택 또는 재선택
        setTempRangeStart(date)
        onRangeChange(date, null)
      } else {
        // 두 번째 날짜 선택
        if (date < tempRangeStart) {
          // 선택한 날짜가 시작일보다 이전이면 순서 바꾸기
          onRangeChange(date, tempRangeStart)
        } else {
          onRangeChange(tempRangeStart, date)
        }
        setTempRangeStart(null)
        setIsOpen(false)
      }
    } else if (onChange) {
      // 단일 선택 모드
      onChange(date)
      setIsOpen(false)
    }
  }

  // 달력 데이터 생성 - 이전달 포함, 다음달 제외
  const generateCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const calendar = []
    const current = new Date(startDate)
    
    for (let week = 0; week < 6; week++) {
      const weekDays = []
      let hasCurrentMonthDate = false
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(current)
        const dateYear = date.getFullYear()
        const dateMonth = date.getMonth()
        
        // 다음달 날짜만 제외 (이전달은 포함)
        const isNextMonth = (dateYear === year && dateMonth > month) || dateYear > year
        
        if (isNextMonth) {
          weekDays.push(null)
        } else {
          weekDays.push(date)
          // 현재 달의 날짜인지 확인
          if (dateMonth === month && dateYear === year) {
            hasCurrentMonthDate = true
          }
        }
        current.setDate(current.getDate() + 1)
      }
      
      // 현재 달의 날짜가 있는 주만 추가
      if (hasCurrentMonthDate) {
        calendar.push(weekDays)
      }
    }
    
    return calendar
  }

  // 날짜 포맷팅
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '').replace(/\.$/, '')
  }

  // 요일 이름
  const weekDays = ['일', '월', '화', '수', '목', '금', '토']
  
  const calendar = generateCalendar()
  const isDateDisabled = (date: Date) => {
    // 날짜만 비교하기 위해 시간을 00:00:00으로 설정
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    
    if (minDate) {
      const minDateOnly = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
      if (dateOnly < minDateOnly) return true
    }
    
    if (maxDate) {
      const maxDateOnly = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
      if (dateOnly > maxDateOnly) return true
    }
    
    return false
  }

  const isDateSelected = (date: Date) => {
    if (!selected) return false
    return date.toDateString() === selected.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isOtherMonth = (date: Date) => {
    return date.getMonth() !== currentMonth.getMonth()
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  // 범위 스타일링 함수들
  const isInRange = (date: Date) => {
    if (!rangeStart || !rangeEnd) return false
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const startOnly = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), rangeStart.getDate())
    const endOnly = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate())
    return dateOnly >= startOnly && dateOnly <= endOnly
  }

  const isRangeStart = (date: Date) => {
    if (!rangeStart) return false
    return date.toDateString() === rangeStart.toDateString()
  }

  const isRangeEnd = (date: Date) => {
    if (!rangeEnd) return false
    return date.toDateString() === rangeEnd.toDateString()
  }

  const isRangeMiddle = (date: Date) => {
    return isInRange(date) && !isRangeStart(date) && !isRangeEnd(date)
  }

  // 범위 선택 표시 텍스트
  const getRangeDisplayText = () => {
    if (selectRange) {
      if (rangeStart && rangeEnd) {
        return `${formatDate(rangeStart)} - ${formatDate(rangeEnd)}`
      } else if (rangeStart) {
        return `${formatDate(rangeStart)} - 종료일 선택`
      }
      return placeholder
    }
    return selected ? formatDate(selected) : placeholder
  }

  return (
    <div className="relative z-10" ref={dropdownRef}>
      {/* 입력 필드 */}
      <div
        className={cn(
          "flex items-center w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer",
          size === 'compact' ? "h-9 text-xs sm:text-sm" : size === 'small' ? "h-8 text-xs" : "h-9 text-xs sm:text-sm",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={cn(
          "flex-1 text-left",
          (!selected && !rangeStart) && "text-gray-400"
        )}>
          {getRangeDisplayText()}
        </span>
        <Calendar className={cn(
          "text-gray-400 ml-2",
          size === 'default' ? "h-4 w-4" : "h-3.5 w-3.5"
        )} />
      </div>

      {/* 달력 드롭다운 */}
      {isOpen && (
        <div 
          className={cn(
            "absolute bg-white border border-gray-200 rounded-2xl shadow-lg z-50",
            size === 'compact' ? "w-[270px]" : "w-[280px]",
            "right-0 sm:left-0 sm:translate-x-0",
            position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          )}
        >
          {/* 헤더 */}
          <div className={cn(
            "flex items-center justify-between border-b border-gray-200 bg-white rounded-t-2xl",
            size === 'compact' ? "px-2 py-1.5" : size === 'small' ? "px-2 sm:px-3 py-1.5 sm:py-2" : "px-3 sm:px-4 py-2 sm:py-3"
          )}>
            <button
              type="button"
              onClick={() => changeMonth('prev')}
              className={cn(
                "flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors",
                size === 'compact' ? "w-6 h-6" : size === 'small' ? "w-6 h-6 sm:w-7 sm:h-7" : "w-7 h-7 sm:w-8 sm:h-8"
              )}
            >
              <ChevronLeft className={cn(
                "text-gray-600",
                size === 'compact' ? "w-3 h-3" : size === 'small' ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4"
              )} />
            </button>
            
            <span className={cn(
              "font-bold text-gray-900",
              size === 'compact' ? "text-sm" : size === 'small' ? "text-sm sm:text-base" : "text-base sm:text-lg"
            )}>
              {currentMonth.getFullYear()}.{String(currentMonth.getMonth() + 1).padStart(2, '0')}
            </span>
            
            <button
              type="button"
              onClick={() => changeMonth('next')}
              className={cn(
                "flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors",
                size === 'compact' ? "w-6 h-6" : size === 'small' ? "w-6 h-6 sm:w-7 sm:h-7" : "w-7 h-7 sm:w-8 sm:h-8"
              )}
            >
              <ChevronRight className={cn(
                "text-gray-600",
                size === 'compact' ? "w-3 h-3" : size === 'small' ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4"
              )} />
            </button>
          </div>

          {/* 요일 헤더 */}
          <div className={cn(
            "grid grid-cols-7 gap-0",
            size === 'compact' ? "px-2 py-1.5" : size === 'small' ? "px-2 sm:px-3 py-1.5" : "px-2 sm:px-3 py-2"
          )}>
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={cn(
                  "text-center font-semibold",
                  size === 'compact' ? "text-[12px] py-1" : size === 'small' ? "text-[10px] sm:text-[11px] py-1 sm:py-1.5" : "text-[11px] sm:text-[13px] py-1.5 sm:py-2",
                  index === 0 && "text-red-500", // 일요일
                  index === 6 && "text-blue-500"  // 토요일
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 날짜 그리드 */}
          <div className={cn(
            size === 'compact' ? "px-2 pb-2" : size === 'small' ? "px-2 sm:px-3 pb-2 sm:pb-3" : "px-2 sm:px-3 pb-3 sm:pb-4"
          )}>
            {calendar.map((week, weekIndex) => (
              <div key={weekIndex} className={cn(
                "grid grid-cols-7",
                size === 'compact' ? "gap-y-0.5" : size === 'small' ? "gap-y-0.5" : "gap-y-0.5 sm:gap-y-1"
              )}>
                {week.map((date, dayIndex) => {
                  // null인 경우 빈 공간 (다음달 날짜)
                  if (date === null) {
                    return (
                      <div key={`empty-${dayIndex}`} className={cn(
                        "w-full",
                        size === 'compact' ? "h-7" : size === 'small' ? "h-7 sm:h-8" : "h-8 sm:h-10"
                      )} />
                    )
                  }
                  
                  const disabled = isDateDisabled(date)
                  const selected = isDateSelected(date)
                  const currentMonth = isCurrentMonth(date)
                  const inRange = isInRange(date)
                  const rangeStart = isRangeStart(date)
                  const rangeEnd = isRangeEnd(date)
                  const rangeMiddle = isRangeMiddle(date)
                  const today = isToday(date)
                  
                  return (
                    <div
                      key={date.toISOString()}
                      className={cn(
                        "w-full relative flex items-center justify-center m-0 p-0",
                        size === 'compact' ? "h-7" : size === 'small' ? "h-7 sm:h-8" : "h-8 sm:h-10"
                      )}
                      style={{
                        backgroundImage: rangeStart 
                          ? 'linear-gradient(90deg, #fff 50%, #e3f2fd 0)'
                          : rangeEnd
                          ? 'linear-gradient(90deg, #e3f2fd 50%, #fff 0)'
                          : rangeMiddle
                          ? 'none'
                          : 'none',
                        backgroundColor: rangeMiddle ? '#e3f2fd' : 'transparent'
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => !disabled && selectDate(date)}
                        disabled={disabled}
                        className={cn(
                          "transition-colors relative m-0 p-0 aspect-square cursor-pointer",
                          size === 'compact' ? "w-6 h-6 text-[12px]" : size === 'small' ? "w-6 h-6 sm:w-7 sm:h-7 text-[10px] sm:text-[11px]" : "w-7 h-7 sm:w-8 sm:h-8 text-[11px] sm:text-[13px]",
                          "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500",
                          !currentMonth && "text-gray-400",
                          currentMonth && "text-gray-900",
                          selected && "bg-blue-600 text-white hover:bg-blue-700 hover:text-black rounded-full",
                          disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
                          // 기본 스타일
                          !inRange && "rounded-full",
                          // 범위 내 날짜 스타일
                          inRange && !rangeStart && !rangeEnd && "bg-transparent text-blue-900",
                          // 시작/종료 날짜 - 원형
                          rangeStart && "bg-primary text-white rounded-full hover:text-black z-10",
                          rangeEnd && "bg-primary text-white rounded-full hover:text-black z-10"
                        )}
                      >
                        <span className="relative z-10">{date.getDate()}</span>
                        {today && !selected && !rangeStart && !rangeEnd && (
                          <div className={cn(
                            "absolute left-1/2 -translate-x-1/2 rounded-full bg-blue-500",
                            size === 'compact' ? "bottom-0.5 w-1 h-1" : size === 'small' ? "bottom-0.5 w-0.5 h-0.5" : "bottom-0.5 sm:bottom-1 w-0.5 sm:w-1 h-0.5 sm:h-1"
                          )} />
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomDatePicker
