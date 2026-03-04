"use client"

import React, { ReactNode } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CommonSelect } from "@/components/ui/common-select"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface Column<T> {
  key: string
  label: ReactNode
  width?: string
  align?: "left" | "center" | "right"
  render?: (item: T) => ReactNode
}

export interface SortOption {
  value: string
  label: string
}

export interface DataTableProps<T> {
  // 데이터
  data: T[]
  columns: Column<T>[]
  
  // 테이블 타이틀
  title?: string
  totalCount: number
  
  // 정렬
  sortValue?: string
  onSortChange?: (value: string) => void
  sortOptions?: SortOption[]
  
  // 페이지네이션
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPagination?: boolean
  
  // 모바일 카드 렌더링
  renderMobileCard: (item: T) => ReactNode
  mobileCardWrapperClassName?: string
  renderMobileCardSkeleton?: () => ReactNode
  
  // 빈 상태
  emptyIcon?: string
  emptyTitle?: string
  emptyDescription?: string
  
  // 로딩 상태
  isLoading?: boolean
  skeletonRows?: number
  
  // 추가 버튼 (옵션)
  extraButtons?: ReactNode
  
  // 타이틀 옆 버튼들 (옵션)
  titleButtons?: ReactNode
  
  // 경쟁강도 안내 버튼 표시 여부 (키워드현황 페이지 전용)
  showCompetitionInfo?: boolean
  
  // 스타일
  className?: string
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  title,
  showCompetitionInfo = false,
  totalCount,
  sortValue,
  onSortChange,
  sortOptions,
  currentPage,
  totalPages,
  onPageChange,
  showPagination = true,
  renderMobileCard,
  emptyIcon = "/icons/icon-default.png",
  emptyTitle = "데이터가 없습니다",
  emptyDescription = "해당 페이지에 표시할 정보가 없습니다.",
  isLoading = false,
  skeletonRows = 5,
  extraButtons,
  titleButtons,
  mobileCardWrapperClassName = "space-y-4",
  renderMobileCardSkeleton,
  className = "",
}: DataTableProps<T>) {
  const [showCompetitionModal, setShowCompetitionModal] = useState(false)
  
  const handlePageChange = (page: number) => {
    onPageChange(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 빈 상태 렌더링
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center space-y-4 p-12">
      <div className="w-16 h-16 relative">
        <Image
          src={emptyIcon}
          alt="데이터 없음"
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-semibold text-gray-900">{emptyTitle}</h3>
        <p className="text-sm text-gray-500">{emptyDescription}</p>
      </div>
    </div>
  )

  // 모바일 카드 스켈레톤 - 기본값
  const defaultRenderMobileCardSkeleton = () => (
    <Card className="shadow-none rounded-xl border border-gray-200">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-1 pt-3 border-t border-gray-100">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>
    </Card>
  )

  // 사용할 모바일 카드 스켈레톤 함수
  const mobileCardSkeletonRenderer = renderMobileCardSkeleton || defaultRenderMobileCardSkeleton

  // 테이블 행 스켈레톤
  const renderTableRowSkeleton = () => (
    <TableRow className="border-b border-gray-100">
      {columns.map((column, index) => (
        <TableCell key={column.key} className={`py-4 ${index === 0 ? 'pl-6' : ''}`}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )

  return (
    <div className={className}>
      {/* 테이블 타이틀 및 정렬/버튼 */}
      {(title || (sortOptions && sortOptions.length > 0 && onSortChange) || extraButtons) && (
        <div className="flex flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {title && (
              <h2 className="text-lg font-semibold">
                {title}
              </h2>
            )}
            {titleButtons && (
              <div className="flex items-center gap-2">
                {titleButtons}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {sortOptions && sortOptions.length > 0 && onSortChange && (
              <CommonSelect
                value={sortValue || sortOptions[0].value}
                onValueChange={onSortChange}
                options={sortOptions}
                triggerClassName="flex-shrink-0"
              />
            )}
            <div className="hidden lg:flex items-center gap-3">
              {extraButtons}
            </div>
          </div>
        </div>
      )}

      {/* 모바일 전용 버튼들 - 키워드 목록과 같은 라인 */}
      <div className="block lg:hidden mb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {extraButtons}
        </div>
        {showCompetitionInfo && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-sm text-blue-600 underline hover:text-blue-800 hover:bg-transparent shadow-none gap-0"
            onClick={() => setShowCompetitionModal(true)}
          >
            <Info className="h-3 w-3 mr-1" />
            경쟁강도란?
          </Button>
        )}
      </div>

      {/* 경쟁강도 설명 모달 */}
      {showCompetitionInfo && showCompetitionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[99999] p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 space-y-3">
              {/* 헤더 섹션 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  <Info className="h-4 w-4 text-blue-500" />
                  경쟁강도 기준
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCompetitionModal(false)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </Button>
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
          </div>
        </div>
      )}

      {/* 모바일 카드 뷰 */}
      <div className="block lg:hidden">
        {isLoading ? (
          // 로딩 중일 때 스켈레톤 표시
          <div className="space-y-4">
            {Array.from({ length: skeletonRows }).map((_, index) => (
              <div key={`skeleton-mobile-${index}`}>
                {mobileCardSkeletonRenderer()}
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <Card className="shadow-none rounded-xl border border-gray-200">
            <CardContent className="p-12 text-center">
              {renderEmptyState()}
            </CardContent>
          </Card>
        ) : (
          <div className={mobileCardWrapperClassName}>
            {data.map((item) => (
              <div key={item.id}>
                {renderMobileCard(item)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PC 테이블 뷰 */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow className="!border-b !border-gray-200 py-3">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={`py-4 font-semibold text-gray-700 ${
                      column.width ? column.width : ''
                    } ${
                      column.align === 'center' ? 'text-center' : 
                      column.align === 'right' ? 'text-right' : 
                      'text-left'
                    } ${column.key === columns[0].key ? 'pl-3' : ''}`}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // 로딩 중일 때 스켈레톤 표시
                Array.from({ length: skeletonRows }).map((_, index) => (
                  <React.Fragment key={`skeleton-row-${index}`}>
                    {renderTableRowSkeleton()}
                  </React.Fragment>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-80">
                    {renderEmptyState()}
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow 
                    key={item.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((column, index) => (
                      <TableCell
                        key={column.key}
                        className={`py-4 ${
                          column.align === 'center' ? 'text-center' : 
                          column.align === 'right' ? 'text-right' : 
                          'text-left'
                        } ${index === 0 ? 'pl-3' : ''}`}
                      >
                        {column.render ? column.render(item) : String((item as any)[column.key])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* 페이지네이션 */}
      {showPagination && data.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {/* 이전 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`w-[30px] h-[30px] flex items-center justify-center rounded-full border transition-colors ${
                currentPage === 1
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-400 bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 페이지 번호 */}
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-[30px] h-[30px] flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* 다음 버튼 */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className={`w-[30px] h-[30px] flex items-center justify-center rounded-full border transition-colors ${
                currentPage >= totalPages
                  ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-400 bg-white text-gray-900 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable

