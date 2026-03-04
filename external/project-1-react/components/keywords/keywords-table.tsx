"use client"

import type { ReactNode } from "react"
import DataTable, { type Column } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Eye, Download, Info, Lock } from "lucide-react"
import type { KeywordData, PostingDetail, Ranking } from "@/app/status/keywords/page"

interface KeywordsTableProps {
  filteredData: KeywordData[]
  paginatedData: KeywordData[]
  currentPage: number
  totalPages: number
  itemsPerPage: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onViewDetail: (keyword: KeywordData) => void
  onExcelDownload: () => void
  onLockedClick?: (keyword: string, client?: string) => void
}

// 경쟁강도 뱃지 색상
const getCompetitionColor = (level: string) => {
  switch (level) {
    case "아주좋음":
      return "bg-green-100 text-green-700 border-green-300"
    case "좋음":
      return "bg-blue-100 text-blue-700 border-blue-300"
    case "보통":
      return "bg-yellow-100 text-yellow-700 border-yellow-300"
    case "나쁨":
      return "bg-orange-100 text-orange-700 border-orange-300"
    case "아주나쁨":
      return "bg-red-100 text-red-700 border-red-300"
    default:
      return "bg-gray-100 text-gray-700 border-gray-300"
  }
}

const LockedMetricButton = ({
  size = "md",
  ariaLabel = "추적 키워드 등록",
  onClick,
}: {
  size?: "sm" | "md"
  ariaLabel?: string
  onClick?: () => void
}) => {
  const buttonSizeClass = size === "sm" ? "h-6 w-[34px]" : "h-7 w-[34px]"
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition-colors shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35)] ${buttonSizeClass}`}
      aria-label={ariaLabel}
      title="추적 키워드를 등록하면 확인할 수 있어요"
    >
      <Lock className="h-3 w-3" />
    </button>
  )
}

// 블러 이미지 경로 (public 폴더 루트에 위치)
const BLUR_IMAGE_PATH = "/blur-metric.png"

// 블러 이미지 컴포넌트 (잠금 상태일 때 실제 데이터 대신 블러 이미지 표시)
const BlurMetricImage = ({ width = 40, height = 20 }: { width?: number; height?: number }) => {
  return (
    <img
      src={BLUR_IMAGE_PATH}
      alt=""
      className="select-none"
      style={{ width: `${width}px`, height: `${height}px`, objectFit: "contain" }}
      draggable={false}
    />
  )
}

// 키워드 문자열을 기반으로 일관된 더미 데이터 생성 (보안을 위한 더미 값)
// 블러 이미지를 사용하면 이 함수는 필요 없지만, 혹시 모를 경우를 대비해 유지
const generateDummyData = (keyword: string) => {
  // 키워드 문자열의 해시값을 기반으로 더미 데이터 생성 (항상 같은 키워드는 같은 더미 값 반환)
  let hash = 0
  for (let i = 0; i < keyword.length; i++) {
    const char = keyword.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  const absHash = Math.abs(hash)

  // 더미 값 범위 설정 (실제 데이터처럼 보이지만 의미 없는 값)
  const top5Rate = 45 + (absHash % 15) // 45-59%
  const top1Rate = 8 + (absHash % 7) // 8-14%
  const baseAverageRank = 7 + (absHash % 10) // 7-16위 정수부
  const decimalPart = ((Math.floor(absHash / 10) % 10) / 10) // 0.0 ~ 0.9 범위 소수부
  const averageRank = parseFloat((baseAverageRank + decimalPart).toFixed(1))
  const bestRank = 3 + (absHash % 6) // 3-8위
  const worstRank = 18 + (absHash % 10) // 18-27위
  
  return {
    top5Rate,
    top1Rate,
    averageRank,
    bestRank,
    worstRank,
  }
}

export function KeywordsTable({
  filteredData,
  paginatedData,
  currentPage,
  totalPages,
  onPageChange,
  onViewDetail,
  onExcelDownload,
  onLockedClick,
}: KeywordsTableProps) {
  // ID 필드 추가 (DataTable에서 필수)
  const dataWithId = paginatedData.map((item, index) => ({
    ...item,
    id: `keyword-${index}`,
  }))

  const getClientName = (item: KeywordData & { id: string | number }) => item.primaryClient || item.clients?.[0]

  const formatAverageRankValue = (value?: number) => {
    if (value === undefined || value === null) {
      return "-"
    }
    const numericValue = Number(value)
    if (Number.isNaN(numericValue)) {
      return "-"
    }
    const rounded = Number(numericValue.toFixed(1))
    const isInteger = Math.abs(rounded - Math.round(rounded)) < 1e-9
    return isInteger ? `${Math.round(rounded)}위` : `${rounded.toFixed(1)}위`
  }

  const renderLockedMetric = (
    item: KeywordData & { id: string | number },
    value: string,
    options: { 
      showButton?: boolean
      unlockedClass?: string
      unlockedContent?: ReactNode
      imageWidth?: number // 블러 이미지 너비
      imageHeight?: number // 블러 이미지 높이
    } = {},
  ) => {
    const { showButton = false, unlockedClass = "text-sm text-gray-700", unlockedContent, imageWidth = 40, imageHeight = 20 } = options

    if (item.isTrackingActive === false) {
      // 잠금 상태일 때는 블러 이미지 표시 (보안을 위해 실제 데이터를 DOM에 포함하지 않음)
      return (
        <div className={`flex flex-col items-center ${showButton ? "gap-2" : ""}`}>
          <div className="relative flex items-center justify-center">
            <BlurMetricImage width={imageWidth} height={imageHeight} />
            {showButton && (
              <div className="absolute inset-0 flex items-center justify-center">
                <LockedMetricButton size="sm" onClick={() => onLockedClick?.(item.keyword, getClientName(item))} />
              </div>
            )}
          </div>
          {showButton && (
            <span className="text-[10px] text-gray-500 font-medium">순위 정보 모두보기</span>
          )}
        </div>
      )
    }

    return <div className={unlockedClass}>{unlockedContent ?? value}</div>
  }

  const renderMobileMetricRow = (
    item: KeywordData & { id: string | number },
    label: string,
    value: string,
    options: { 
      highlightClass?: string
      showButton?: boolean
      unlockedContent?: ReactNode
      imageWidth?: number // 블러 이미지 너비
      imageHeight?: number // 블러 이미지 높이
    } = {},
  ) => {
    const { highlightClass = "text-gray-900", showButton = false, unlockedContent, imageWidth = 40, imageHeight = 20 } = options

    return (
      <div className="flex items-center justify-between py-3 border-b border-gray-100 mb-0">
        <div className="text-sm text-gray-500">{label}</div>
        {item.isTrackingActive === false ? (
          <div className={`flex flex-col ${showButton ? "items-end gap-2" : "items-end"}`}>
            <div className="relative flex items-center justify-end">
              {/* 잠금 상태일 때는 블러 이미지 표시 (보안을 위해 실제 데이터를 DOM에 포함하지 않음) */}
              <BlurMetricImage width={imageWidth} height={imageHeight} />
              {showButton && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LockedMetricButton size="sm" onClick={() => onLockedClick?.(item.keyword, getClientName(item))} />
                </div>
              )}
            </div>
            {showButton && (
              <span className="text-[11px] text-gray-500 font-medium">순위 정보 모두보기</span>
            )}
          </div>
        ) : (
          <div className={`text-sm ${highlightClass}`}>{unlockedContent ?? value}</div>
        )}
      </div>
    )
  }

  // 컬럼 정의
  const columns: Column<KeywordData & { id: string | number }>[] = [
    {
      key: "keyword",
      label: "키워드",
      width: "w-[160px]",
      render: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-gray-900">{item.keyword}</span>
          {item.isTarget && (
            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
              타겟
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "totalPostings",
      label: "포스팅횟수",
      width: "w-[100px]",
      align: "center",
      render: (item) => (
        <div className="text-sm text-gray-700">{item.totalPostings}건</div>
      ),
    },
    {
      key: "reworkCount",
      label: "재작업",
      width: "w-[80px]",
      align: "center",
      render: (item) => (
        <div className={`text-sm font-medium ${item.reworkCount > 0 ? "text-orange-600" : "text-gray-500"}`}>
          {item.reworkCount}건
        </div>
      ),
    },
    {
      key: "clients",
      label: "고객사",
      width: "w-[110px]",
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.primaryClient || item.clients?.[0] ? (
            <Badge
              variant="secondary"
              className="text-xs bg-blue-50 text-blue-700 border-0"
            >
              {item.primaryClient || item.clients[0]}
            </Badge>
          ) : (
            <span className="text-xs text-gray-400">미지정</span>
          )}
        </div>
      ),
    },
    {
      key: "competitionLevel",
      label: (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-center gap-1 cursor-help">
              경쟁강도
              <Info className="h-3 w-3 text-blue-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 max-w-sm">
            <div className="space-y-3">
              {/* 헤더 섹션 */}
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Info className="h-4 w-4 text-blue-500" />
                경쟁강도 기준
              </div>
              
              
              {/* 기준 목록 섹션 */}
              <div className="space-y-2">
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-semibold text-xs min-w-[60px]">아주좋음</span>
                    <span className="text-gray-600 text-xs">재작업 0회, 노출 유지 1달 이상</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                    <span className="text-blue-700 font-semibold text-xs min-w-[60px]">좋음</span>
                    <span className="text-gray-600 text-xs">재작업 0회, 노출 유지 2주 이상</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-700 font-semibold text-xs min-w-[60px]">보통</span>
                    <span className="text-gray-600 text-xs">재작업 0회, 노출 유지 7일 이상</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-orange-50 rounded-lg">
                    <span className="text-orange-700 font-semibold text-xs min-w-[60px]">나쁨</span>
                    <span className="text-gray-600 text-xs">재작업 1회 이상, 노출 유지 3일 이내</span>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                    <span className="text-red-700 font-semibold text-xs min-w-[60px]">아주나쁨</span>
                    <span className="text-gray-600 text-xs">재작업 3회 이상, 노출 유지 1일 이내</span>
                  </div>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      ),
      width: "w-[100px]",
      align: "center",
      render: (item) => (
        <Badge
          variant="outline"
          className={`text-xs ${getCompetitionColor(item.competitionLevel)}`}
        >
          {item.competitionLevel}
        </Badge>
      ),
    },
    {
      key: "top5Rate",
      label: "5위 안 확률",
      width: "w-[110px]",
      align: "center",
      render: (item) => renderLockedMetric(item, `${item.top5Rate}%`, {
        unlockedClass: "text-sm text-gray-700",
        imageWidth: 35, // 퍼센트 표시는 좀 더 작게
        imageHeight: 18,
      }),
    },
    {
      key: "top1Rate",
      label: "1위 확률",
      width: "w-[100px]",
      align: "center",
      render: (item) => renderLockedMetric(item, `${Math.round(item.top1Rate)}%`, {
        unlockedClass: "text-sm font-medium text-blue-600",
        imageWidth: 35,
        imageHeight: 18,
      }),
    },
    {
      key: "averageRank",
      label: "평균순위",
      width: "w-[90px]",
      align: "center",
      render: (item) => renderLockedMetric(item, formatAverageRankValue(item.averageRank), {
        showButton: true,
        unlockedClass: "text-sm text-gray-700",
        imageWidth: 40, // "위"가 붙어서 조금 더 넓게
        imageHeight: 20,
      }),
    },
    {
      key: "bestRank",
      label: "최고순위",
      width: "w-[90px]",
      align: "center",
      render: (item) => renderLockedMetric(item, `${item.bestRank}위`, {
        unlockedClass: "text-sm font-medium text-green-600",
        imageWidth: 40,
        imageHeight: 20,
      }),
    },
    {
      key: "worstRank",
      label: "최저순위",
      width: "w-[90px]",
      align: "center",
      render: (item) => renderLockedMetric(item, `${item.worstRank}위`, {
        unlockedClass: "text-sm text-gray-500",
        imageWidth: 40,
        imageHeight: 20,
      }),
    },
    {
      key: "actions",
      label: "작업",
      width: "w-[80px]",
      align: "center",
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetail(item)}
          className="h-8 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
        >
          <Eye className="h-4 w-4 mr-1" />
          상세
        </Button>
      ),
    },
  ]

  // 모바일 카드 렌더링
  const renderMobileCard = (item: KeywordData & { id: string | number }) => {
    return (
      <Card className="shadow-none rounded-xl border border-gray-200">
        <CardContent className="p-4 space-y-4 mb-0">
          {/* 헤더 */}
          <div className="flex items-start justify-between pb-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="text-sm font-semibold text-gray-900">
                  {item.keyword}
                </div>
                {item.isTarget && (
                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                    타겟
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetail(item)}
              className="h-8 hover:bg-blue-50 hover:text-blue-600"
            >
              <Eye className="h-4 w-4 mr-1" />
              상세
            </Button>
          </div>

        {/* 포스팅 정보 */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 mb-0">
          <div className="text-sm text-gray-500">포스팅횟수</div>
          <div className="text-sm font-medium text-gray-900">{item.totalPostings}건</div>
        </div>

        {/* 재작업 정보 */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 mb-0">
          <div className="text-sm text-gray-500">재작업</div>
          <div className={`text-sm font-medium ${item.reworkCount > 0 ? "text-orange-600" : "text-gray-500"}`}>
            {item.reworkCount}건
          </div>
        </div>

        {/* 고객사 */}
        <div className="py-3 border-b border-gray-100 mb-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">고객사</div>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {item.primaryClient || item.clients?.[0] ? (
              <Badge
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 border-0"
              >
                {item.primaryClient || item.clients[0]}
              </Badge>
            ) : (
              <span className="text-xs text-gray-400">미지정</span>
            )}
          </div>
        </div>

        {/* 경쟁강도 섹션 */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100 mb-0">
          <div className="text-sm text-gray-500">경쟁강도</div>
          <Badge
            variant="outline"
            className={`text-xs ${getCompetitionColor(item.competitionLevel)}`}
          >
            {item.competitionLevel}
          </Badge>
        </div>

        {renderMobileMetricRow(item, "5위 안 확률", `${item.top5Rate}%`, { 
          showButton: true,
          imageWidth: 35,
          imageHeight: 18,
        })}
        {renderMobileMetricRow(item, "1위 확률", `${Math.round(item.top1Rate)}%`, {
          showButton: false,
          highlightClass: "text-blue-600",
          imageWidth: 35,
          imageHeight: 18,
        })}
        {renderMobileMetricRow(item, "평균순위", formatAverageRankValue(item.averageRank), { 
          showButton: false,
          imageWidth: 40,
          imageHeight: 20,
        })}
        {renderMobileMetricRow(item, "최고순위", `${item.bestRank}위`, {
          showButton: false,
          highlightClass: "text-green-600",
          imageWidth: 40,
          imageHeight: 20,
        })}
        {renderMobileMetricRow(item, "최저순위", `${item.worstRank}위`, {
          showButton: false,
          highlightClass: "text-gray-500",
          imageWidth: 40,
          imageHeight: 20,
        })}
        
      </CardContent>
    </Card>
    )
  }

  return (
    <DataTable
      data={dataWithId}
      columns={columns}
      title={`키워드 목록 (${filteredData.length}개)`}
      totalCount={filteredData.length}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      renderMobileCard={renderMobileCard}
      showCompetitionInfo={true}
      extraButtons={
        <Button
          size="sm"
          variant="outline"
          onClick={onExcelDownload}
          className="text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs h-8 px-3 flex-shrink-0 shadow-none"
        >
          <img src="/icons/icon-excel.png" alt="Excel" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          엑셀 다운로드
        </Button>
      }
      emptyTitle="등록된 키워드가 없습니다"
      emptyDescription="키워드를 등록하여 성과를 분석해보세요."
    />
  )
}
