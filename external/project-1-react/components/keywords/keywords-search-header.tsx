"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import { useState, useEffect } from "react"

interface KeywordsSearchHeaderProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  selectedPeriod: string
  onPeriodChange: (period: string) => void
}

export function KeywordsSearchHeader({
  searchTerm,
  onSearchTermChange,
  selectedPeriod,
  onPeriodChange,
}: KeywordsSearchHeaderProps) {
  const periodOptions = ["오늘", "1주일", "1개월", "3개월", "6개월", "1년", "전체"]
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800)
  const [sidebarVisible, setSidebarVisible] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(256) // 사이드바의 실제 너비

  // 사이드바 상태 + 화면 크기 모두 감지 (통합)
  useEffect(() => {
    const checkSidebarState = () => {
      requestAnimationFrame(() => {
        const sidebar = document.querySelector('aside')
        if (sidebar) {
          const computedStyle = window.getComputedStyle(sidebar)
          
          // Tailwind xl: 1280px 기준으로 사이드바 표시 여부 판단
          const isXLScreen = window.matchMedia('(min-width: 1280px)').matches
          const isVisible = isXLScreen && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden'
          setSidebarVisible(isVisible)
          
          // 사이드바의 실제 너비 가져오기
          const width = parseInt(computedStyle.width, 10)
          if (!isNaN(width) && width > 0 && isVisible) {
            setSidebarWidth(width)
          }
        }
        
        // 화면 크기도 같이 업데이트
        setScreenWidth(window.innerWidth)
      })
    }

    checkSidebarState()
    
    // 통합된 resize 리스너 (단 한 번만 등록)
    window.addEventListener('resize', checkSidebarState)
    
    // ResizeObserver로 사이드바 크기 변경 실시간 감지
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        checkSidebarState()
      })
      
      const sidebar = document.querySelector('aside')
      if (sidebar) {
        resizeObserver.observe(sidebar)
      }
    }

    // MutationObserver로 visibility 변경 감지
    const observer = new MutationObserver(checkSidebarState)
    const sidebar = document.querySelector('aside')
    if (sidebar) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class', 'style'],
      })
    }

    // 단일 클린업 함수
    return () => {
      window.removeEventListener('resize', checkSidebarState)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      observer.disconnect()
    }
  }, [])

  // 기간 선택 핸들러
  const handlePeriodChange = (period: string) => {
    const today = new Date()
    let start = new Date()

    switch (period) {
      case "오늘":
        start = today
        break
      case "1주일":
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "1개월":
        start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        break
      case "3개월":
        start = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
        break
      case "6개월":
        start = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())
        break
      case "1년":
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        break
      case "전체":
        start = new Date(2020, 0, 1)
        break
    }

    onPeriodChange(period)
  }

  const isMobile = screenWidth < 768

  return (
    <div 
      className="fixed top-16 right-0 z-40 bg-white/30 backdrop-blur-md border-b border-white/20 transition-all duration-300"
      style={{
        // 모바일 또는 사이드바가 보이지 않으면: left: 0
        // PC이고 사이드바가 보이면: left은 사이드바의 실제 너비
        left: (!isMobile && sidebarVisible) ? `${sidebarWidth}px` : '0px',
        right: '0px',
        // left와 right가 모두 지정되면 width는 자동으로 계산됨
      }}
    >
      <div className="mx-auto flex-1">
        <div className="flex items-center gap-3 md:gap-6 px-3 md:px-6 py-2 md:py-4 w-full">
          {/* 검색어 입력 */}
          <div className="relative flex-1 min-w-0 flex-shrink-0">
            <Input
              placeholder="키워드명, 고객사로 검색"
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pl-10 pr-4 h-10 w-full bg-white/40 backdrop-blur-sm text-sm text-gray-900 border border-primary rounded-lg placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
          </div>

          {/* 기간 선택 */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[100px] md:w-40 bg-white/40 backdrop-blur-sm text-sm text-gray-900 border border-primary rounded-lg font-normal shadow-none focus:ring-2 focus:ring-primary [height:40px!important]">
                <SelectValue placeholder="기간" />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
