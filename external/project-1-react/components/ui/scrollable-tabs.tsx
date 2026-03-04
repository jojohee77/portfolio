"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export interface ScrollableTabsProps {
  /** 탭 목록 */
  tabs: Array<{
    name: string
    href: string
  }>
  /** 추가 클래스명 */
  className?: string
  /** 탭 간격 (기본: gap-4 sm:gap-6 lg:gap-8) */
  gap?: string
  /** 탭 크기 (기본: text-base sm:text-lg) */
  textSize?: string
  /** 활성 탭 스타일 */
  activeClassName?: string
  /** 비활성 탭 스타일 */
  inactiveClassName?: string
}

/**
 * 스크롤 가능한 탭 네비게이션 컴포넌트
 * 
 * @example
 * ```tsx
 * import { ScrollableTabs } from "@/components/ui/scrollable-tabs"
 * 
 * const tabs = [
 *   { name: "계정정보", href: "/profile/account" },
 *   { name: "멤버십 관리", href: "/profile/membership" },
 *   { name: "결제 정보", href: "/profile/payment" },
 * ]
 * 
 * <ScrollableTabs tabs={tabs} />
 * ```
 */
export function ScrollableTabs({
  tabs,
  className = "",
  gap = "gap-4 sm:gap-6 lg:gap-8",
  textSize = "text-base sm:text-lg",
  activeClassName = "font-extrabold text-foreground underline underline-offset-8",
  inactiveClassName = "text-muted-foreground hover:text-foreground"
}: ScrollableTabsProps) {
  const pathname = usePathname()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showRightGradient, setShowRightGradient] = useState(false)
  
  // 스크롤 위치에 따라 인디케이터 표시 여부 결정
  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    const { scrollLeft, scrollWidth, clientWidth } = container
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 5

    setShowRightGradient(!isAtEnd)
  }

  // 초기 로드 시 및 리사이즈 시 스크롤 가능 여부 확인
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const checkScroll = () => {
      const { scrollWidth, clientWidth } = container
      const hasScroll = scrollWidth > clientWidth
      setShowRightGradient(hasScroll)
    }

    checkScroll()
    window.addEventListener('resize', checkScroll)
    return () => window.removeEventListener('resize', checkScroll)
  }, [tabs])

  return (
    <div className={cn("relative w-full", className)}>
      {/* 오른쪽 스크롤 그라데이션 인디케이터 */}
      {showRightGradient && (
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 pointer-events-none z-10 bg-gradient-to-l from-muted/80 to-transparent" />
      )}

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="box-border w-full max-w-full overflow-x-auto overflow-y-hidden px-3 sm:px-4 lg:px-6 scrollbar-hide"
      >
        <div className={`flex ${gap}`}>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex-shrink-0 px-0 py-2 bg-transparent border-0 shadow-none outline-none ring-0 focus-visible:ring-0 focus:outline-none transition-all cursor-pointer whitespace-nowrap",
                  textSize,
                  isActive ? activeClassName : inactiveClassName
                )}
              >
                {tab.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ScrollableTabs
