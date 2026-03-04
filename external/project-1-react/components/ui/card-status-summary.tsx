"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatusSummaryCardsProps {
  statusCounts: Record<string, string | number>
  activeFilter: string
  onFilterChange: (filter: string) => void
  className?: string
  descriptions?: Record<string, string> // 설명 텍스트 추가
  variant?: "default" | "compact" | "four-columns" // 반응형 변형 추가
  showTrend?: boolean // 트렌드 표시 여부
  customLayout?: boolean // 커스텀 레이아웃 (퍼센트를 부가설명 왼쪽으로)
}

interface StatusCardProps {
  status: string
  count: string | number
  isActive: boolean
  onClick: () => void
  showTrend?: boolean
  className?: string
  description?: string // 설명 텍스트 추가
  customLayout?: boolean // 커스텀 레이아웃
}

// 상태별 컬러 설정 함수 (범용)
const getStatusColor = (status: string) => {
  switch (status) {
    // 공통 상태
    case "전체":
      return {
        border: "border-blue-500",
        text: "text-blue-600",
        bg: "bg-blue-50",
        borderLight: "border-blue-200"
      }
    
    // 조직관리 시스템 상태
    case "전체 계정":
      return {
        border: "border-blue-500",
        text: "text-blue-600",
        bg: "bg-blue-50",
        borderLight: "border-blue-200"
      }
    case "활성 계정":
      return {
        border: "border-green-500",
        text: "text-green-600",
        bg: "bg-green-50",
        borderLight: "border-green-200"
      }
    case "비활성":
      return {
        border: "border-gray-500",
        text: "text-gray-600",
        bg: "bg-gray-50",
        borderLight: "border-gray-200"
      }
    case "관리자":
      return {
        border: "border-purple-500",
        text: "text-purple-600",
        bg: "bg-purple-50",
        borderLight: "border-purple-200"
      }
    
    // 업무관리 시스템 상태
    case "진행중":
      return {
        border: "border-blue-500",
        text: "text-blue-600",
        bg: "bg-blue-50",
        borderLight: "border-blue-200"
      }
    case "완료":
      return {
        border: "border-green-500",
        text: "text-green-600",
        bg: "bg-green-50",
        borderLight: "border-green-200"
      }
    case "대기":
      return {
        border: "border-yellow-500",
        text: "text-yellow-600",
        bg: "bg-yellow-50",
        borderLight: "border-yellow-200"
      }
    case "보류":
      return {
        border: "border-red-500",
        text: "text-red-600",
        bg: "bg-red-50",
        borderLight: "border-red-200"
      }
    
    // 계약관리 시스템 상태
    case "신규":
      return {
        border: "border-emerald-500",
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        borderLight: "border-emerald-200"
      }
    case "연장":
      return {
        border: "border-amber-500",
        text: "text-amber-600",
        bg: "bg-amber-50",
        borderLight: "border-amber-200"
      }
    case "확장":
      return {
        border: "border-purple-500",
        text: "text-purple-600",
        bg: "bg-purple-50",
        borderLight: "border-purple-200"
      }
    case "만료":
      return {
        border: "border-red-500",
        text: "text-red-600",
        bg: "bg-red-50",
        borderLight: "border-red-200"
      }
    
    // 고객관리 시스템 상태
    case "신규고객":
      return {
        border: "border-cyan-500",
        text: "text-cyan-600",
        bg: "bg-cyan-50",
        borderLight: "border-cyan-200"
      }
    case "기존고객":
      return {
        border: "border-teal-500",
        text: "text-teal-600",
        bg: "bg-teal-50",
        borderLight: "border-teal-200"
      }
    case "VIP고객":
      return {
        border: "border-rose-500",
        text: "text-rose-600",
        bg: "bg-rose-50",
        borderLight: "border-rose-200"
      }
    case "휴면고객":
      return {
        border: "border-zinc-500",
        text: "text-zinc-600",
        bg: "bg-zinc-50",
        borderLight: "border-zinc-200"
      }
    
    // 매출현황 KPI 상태
    case "총 매출":
      return {
        border: "border-emerald-500",
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        borderLight: "border-emerald-200"
      }
    case "월 평균 매출":
      return {
        border: "border-blue-500",
        text: "text-blue-600",
        bg: "bg-blue-50",
        borderLight: "border-blue-200"
      }
    case "계약 건수":
      return {
        border: "border-indigo-500",
        text: "text-indigo-600",
        bg: "bg-indigo-50",
        borderLight: "border-indigo-200"
      }
    case "포스팅 비용":
      return {
        border: "border-orange-500",
        text: "text-orange-600",
        bg: "bg-orange-50",
        borderLight: "border-orange-200"
      }
    case "평균 계약단가":
      return {
        border: "border-purple-500",
        text: "text-purple-600",
        bg: "bg-purple-50",
        borderLight: "border-purple-200"
      }
    
    // 매출현황 서비스 상태
    case "SEO":
      return {
        border: "border-blue-500",
        text: "text-blue-600",
        bg: "bg-blue-50",
        borderLight: "border-blue-200"
      }
    case "프리미엄":
      return {
        border: "border-green-500",
        text: "text-green-600",
        bg: "bg-green-50",
        borderLight: "border-green-200"
      }
    case "하나탑":
      return {
        border: "border-yellow-500",
        text: "text-yellow-600",
        bg: "bg-yellow-50",
        borderLight: "border-yellow-200"
      }
    
    // 키워드현황 시스템 상태
    case "총 포스팅":
      return {
        border: "border-green-500",
        text: "text-green-600",
        bg: "bg-green-50",
        borderLight: "border-green-200"
      }
    case "재작업":
      return {
        border: "border-orange-500",
        text: "text-orange-600",
        bg: "bg-orange-50",
        borderLight: "border-orange-200"
      }
    case "유효":
      return {
        border: "border-green-500",
        text: "text-green-600",
        bg: "bg-green-50",
        borderLight: "border-green-200"
      }
    case "5위 안":
      return {
        border: "border-purple-500",
        text: "text-purple-600",
        bg: "bg-purple-50",
        borderLight: "border-purple-200"
      }
    case "평균":
      return {
        border: "border-blue-500",
        text: "text-blue-600",
        bg: "bg-blue-50",
        borderLight: "border-blue-200"
      }
    case "5위 안 확률":
      return {
        border: "border-purple-500",
        text: "text-purple-600",
        bg: "bg-purple-50",
        borderLight: "border-purple-200"
      }
    case "우수 키워드":
      return {
        border: "border-red-500",
        text: "text-red-600",
        bg: "bg-red-50",
        borderLight: "border-red-200"
      }
    
    // 성과현황 시스템 상태
    case "총 매출":
      return {
        border: "border-emerald-500",
        text: "text-emerald-600",
        bg: "bg-emerald-50",
        borderLight: "border-emerald-200"
      }
    case "총 계약 매출":
      return {
        border: "border-blue-500",
        text: "text-blue-600",
        bg: "bg-blue-50",
        borderLight: "border-blue-200"
      }
    case "총 인원":
      return {
        border: "border-indigo-500",
        text: "text-indigo-600",
        bg: "bg-indigo-50",
        borderLight: "border-indigo-200"
      }
    case "평균 인당 매출":
      return {
        border: "border-purple-500",
        text: "text-purple-600",
        bg: "bg-purple-50",
        borderLight: "border-purple-200"
      }
    case "평균 업체 수":
      return {
        border: "border-amber-500",
        text: "text-amber-600",
        bg: "bg-amber-50",
        borderLight: "border-amber-200"
      }
    
    // 기본값 (알 수 없는 상태)
    default:
      return {
        border: "border-gray-500",
        text: "text-gray-600",
        bg: "bg-gray-50",
        borderLight: "border-gray-200"
      }
  }
}

// 트렌드 데이터 설정 함수 (범용)
const getTrendData = (status: string) => {
  switch (status) {
    // 조직관리 시스템
    case "전체 계정":
      return { value: "+5", color: "text-emerald-600" }
    case "활성 계정":
      return { value: "+3", color: "text-emerald-600" }
    case "비활성":
      return { value: "+2", color: "text-emerald-600" }
    case "관리자":
      return { value: "-", color: "text-gray-500" }
    
    // 업무관리 시스템
    case "보류":
      return { value: "-", color: "text-gray-500" }
    case "진행중":
      return { value: "+2", color: "text-emerald-600" }
    case "완료":
      return { value: "-1", color: "text-red-600" }
    case "대기":
      return { value: "+2", color: "text-emerald-600" }
    
    // 계약관리 시스템
    case "만료":
      return { value: "-", color: "text-gray-500" }
    case "신규":
      return { value: "+3", color: "text-emerald-600" }
    case "연장":
      return { value: "+1", color: "text-emerald-600" }
    case "확장":
      return { value: "+2", color: "text-emerald-600" }
    
    // 고객관리 시스템
    case "휴면고객":
      return { value: "-", color: "text-gray-500" }
    case "신규고객":
      return { value: "+5", color: "text-emerald-600" }
    case "기존고객":
      return { value: "+2", color: "text-emerald-600" }
    case "VIP고객":
      return { value: "+1", color: "text-emerald-600" }
    
    // 매출현황 KPI
    case "총 매출":
      return { value: "+12.5%", color: "text-emerald-600" }
    case "월 평균 매출":
      return { value: "+8.2%", color: "text-emerald-600" }
    case "계약 건수":
      return { value: "+15", color: "text-emerald-600" }
    case "포스팅 비용":
      return { value: "+5.3%", color: "text-emerald-600" }
    case "평균 계약단가":
      return { value: "+2.1%", color: "text-emerald-600" }
    
    // 매출현황 서비스
    case "SEO":
      return { value: "+2", color: "text-emerald-600" }
    case "프리미엄":
      return { value: "+1", color: "text-emerald-600" }
    case "하나탑":
      return { value: "+3", color: "text-emerald-600" }
    
    // 키워드현황 시스템
    case "총 포스팅":
      return { value: "-1", color: "text-red-600" }
    case "재작업":
      return { value: "+2", color: "text-emerald-600" }
    case "유효":
      return { value: "+1", color: "text-emerald-600" }
    case "5위 안":
      return { value: "+3", color: "text-emerald-600" }
    case "평균":
      return { value: "-", color: "text-gray-500" }
    case "5위 안 확률":
      return { value: "-", color: "text-gray-500" }
    case "우수 키워드":
      return { value: "+1", color: "text-emerald-600" }
    
    // 성과현황 시스템
    case "총 매출":
      return { value: "+5.2%", color: "text-emerald-600" }
    case "총 계약 매출":
      return { value: "+3.8%", color: "text-emerald-600" }
    case "총 인원":
      return { value: "+2", color: "text-emerald-600" }
    case "평균 인당 매출":
      return { value: "+4.1%", color: "text-emerald-600" }
    case "평균 업체 수":
      return { value: "+1.2", color: "text-emerald-600" }
    
    // 기본값
    default:
      return { value: "+2", color: "text-emerald-600" }
  }
}

// 숫자 데이터인지 확인하는 함수 (금액, 건수 등)
const isNumericData = (count: string | number) => {
  if (typeof count === 'string') {
    return count.startsWith('₩') || count.includes('건') || count.includes('명') || count.includes('개')
  }
  return false
}

// 개별 상태 카드 컴포넌트
const StatusCard: React.FC<StatusCardProps> = ({
  status,
  count,
  isActive,
  onClick,
  showTrend = true,
  className = "",
  description,
  customLayout = false
}) => {
  const colors = getStatusColor(status)
  const trendData = getTrendData(status)
  const isNumeric = isNumericData(count)

  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between py-1.5 px-3 rounded-lg cursor-pointer transition-all ${
        isActive ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className={`${isNumeric ? 'text-sm' : 'text-sm'} font-medium px-2 py-0.5 rounded border ${colors.border} ${colors.text}`}>
          {status}
        </div>
      </div>
      {description ? (
        // 부가 설명이 있을 때: 세로 레이아웃
        <div className="flex flex-col items-end">
          <div className={`${isNumeric ? 'text-sm' : 'text-lg'} font-semibold`}>{count}</div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            {customLayout && showTrend && (
              <div className={`${trendData.color}`}>
                <span>{trendData.value}</span>
              </div>
            )}
            <span>{description}</span>
          </div>
        </div>
      ) : (
        // 부가 설명이 없을 때: 기존 가로 레이아웃
        <div className="flex items-center gap-2">
          {showTrend && (
            <div className={`text-xs ${trendData.color}`}>
              <span>{trendData.value}</span>
            </div>
          )}
          <div className={`${isNumeric ? 'text-sm' : 'text-lg'} font-semibold`}>{count}</div>
        </div>
      )}
    </div>
  )
}

// PC 그리드 카드 컴포넌트
const DesktopStatusCard: React.FC<StatusCardProps> = ({
  status,
  count,
  isActive,
  onClick,
  showTrend = true,
  className = "",
  description,
  customLayout = false
}) => {
  const colors = getStatusColor(status)
  const trendData = getTrendData(status)
  const isNumeric = isNumericData(count)

  return (
    <Card 
      className={`py-2 md:py-3 shadow-none rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
        isActive ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
      } ${className}`}
      onClick={onClick}
    >
      <CardContent className="px-4 py-2 md:px-4 md:py-3">
        <div className="flex items-start justify-between">
          <div>
            <div className={`inline-block px-2 py-0.5 mb-1 md:mb-1.5 text-sm font-medium border rounded-md ${colors.border} ${colors.text}`}>
              {status}
            </div>
          </div>
          {description ? (
            // 부가 설명이 있을 때: 세로 레이아웃
            <div className="flex flex-col items-end">
          <div className={`${isNumeric ? 'text-lg' : 'text-2xl'} font-semibold`}>{count}</div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            {customLayout && showTrend && (
              <div className={`${trendData.color}`}>
                <span>{trendData.value}</span>
              </div>
            )}
            <span>{description}</span>
          </div>
            </div>
          ) : (
            // 부가 설명이 없을 때: 기존 가로 레이아웃
            <div className="flex flex-col items-end">
              <div className={`${isNumeric ? 'text-lg' : 'text-2xl'} font-semibold`}>{count}</div>
              {showTrend && (
                <div className={`text-xs mt-0.5 md:mt-1 ${trendData.color}`}>
                  {trendData.value}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// 메인 컴포넌트
const StatusSummaryCards: React.FC<StatusSummaryCardsProps> = ({
  statusCounts,
  activeFilter,
  onFilterChange,
  className = "",
  descriptions = {},
  variant = "default",
  showTrend = true,
  customLayout = false
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  // 외부 클릭 감지
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 컨테이너 외부를 클릭했을 때
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // 활성화된 필터가 있다면 해제
        if (activeFilter !== "all") {
          onFilterChange("all")
        }
      }
    }

    // 활성화된 필터가 있을 때만 이벤트 리스너 추가
    if (activeFilter !== "all") {
      document.addEventListener("click", handleClickOutside)
      return () => document.removeEventListener("click", handleClickOutside)
    }
  }, [activeFilter, onFilterChange])

  const handleCardClick = (status: string) => {
    // 현재 활성 필터와 클릭한 상태가 같으면 필터 해제
    const isCurrentlyActive = (status === "전체" && activeFilter === "all") || (status !== "전체" && activeFilter === status)
    
    if (isCurrentlyActive) {
      // 이미 활성화된 필터를 클릭하면 필터 해제
      onFilterChange("all")
    } else {
      // 새로운 필터 활성화
      if (status === "전체") {
        onFilterChange("all")
      } else {
        onFilterChange(status)
      }
    }
  }

  return (
    <div ref={containerRef}>
      {/* 모바일 컴팩트 뷰 */}
      <Card className={`md:hidden shadow-none rounded-2xl border py-0 ${className}`}>
        <CardContent className="p-3">
          <div className="space-y-1">
            {Object.entries(statusCounts).map(([status, count]) => {
              const isActive = (status === "전체" && activeFilter === "all") || (status !== "전체" && activeFilter === status)
              
              return (
                <StatusCard
                  key={status}
                  status={status}
                  count={count}
                  isActive={isActive}
                  onClick={() => handleCardClick(status)}
                  description={descriptions[status]}
                  customLayout={customLayout}
                  showTrend={showTrend}
                />
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 데스크톱 그리드 뷰 */}
      {variant === "default" && (
        <div className={`hidden md:grid md:grid-cols-5 gap-3 sm:gap-4 w-full ${className}`}>
          {Object.entries(statusCounts).map(([status, count]) => {
            const isActive = (status === "전체" && activeFilter === "all") || (status !== "전체" && activeFilter === status)
            
            return (
              <DesktopStatusCard
                key={status}
                status={status}
                count={count}
                isActive={isActive}
                onClick={() => handleCardClick(status)}
                description={descriptions[status]}
                customLayout={customLayout}
                showTrend={showTrend}
              />
            )
          })}
        </div>
      )}

      {/* Compact 변형 - 1024px 이상에서만 그리드 표시 */}
      {variant === "compact" && (
        <div className={`hidden lg:grid lg:grid-cols-5 gap-3 sm:gap-4 w-full ${className}`}>
          {Object.entries(statusCounts).map(([status, count]) => {
            const isActive = (status === "전체" && activeFilter === "all") || (status !== "전체" && activeFilter === status)
            
            return (
              <DesktopStatusCard
                key={status}
                status={status}
                count={count}
                isActive={isActive}
                onClick={() => handleCardClick(status)}
                description={descriptions[status]}
                customLayout={customLayout}
                showTrend={showTrend}
              />
            )
          })}
        </div>
      )}

      {/* Four Columns 변형 - 4개 카드용 (태블릿 이상에서 4컬럼 그리드) */}
      {variant === "four-columns" && (
        <div className={`hidden md:grid md:grid-cols-4 gap-3 sm:gap-4 w-full ${className}`}>
          {Object.entries(statusCounts).map(([status, count]) => {
            const isActive = (status === "전체" && activeFilter === "all") || (status !== "전체" && activeFilter === status)
            
            return (
              <DesktopStatusCard
                key={status}
                status={status}
                count={count}
                isActive={isActive}
                onClick={() => handleCardClick(status)}
                description={descriptions[status]}
                customLayout={customLayout}
                showTrend={showTrend}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default StatusSummaryCards
