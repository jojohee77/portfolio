"use client"

import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { ChevronUp } from "lucide-react"

export function ScrollToTopButton() {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(false)

  // 스크롤 위치 감지
  const handleScroll = () => {
    // 스크롤이 300px 이상일 때 버튼 표시
    setIsVisible(window.scrollY > 300)
  }

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 모바일에서만 표시
  if (!isMobile || !isVisible) {
    return null
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center"
      aria-label="페이지 맨 위로 이동"
    >
      {/* 원형 배경 */}
      <div className="absolute inset-0 rounded-full bg-primary opacity-80 hover:opacity-100 transition-opacity" />
      
      {/* 컨텐츠 */}
      <div className="relative flex flex-col items-center justify-center gap-0 -translate-y-1">
        <ChevronUp className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
        <span className="text-xs font-semibold text-primary-foreground leading-none">TOP</span>
      </div>
    </button>
  )
}
