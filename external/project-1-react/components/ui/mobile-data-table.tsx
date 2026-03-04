"use client"

import React, { ReactNode } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * 모바일 데이터 테이블 컬럼 타입
 */
export interface MobileColumn<T> {
  key: string
  label: string
  width?: string
  align?: "left" | "center" | "right"
  mobileWidth?: string // 모바일용 최소 너비
  render?: (item: T) => ReactNode
}

/**
 * 모바일 데이터 테이블 Props
 */
export interface MobileDataTableProps<T> {
  // 필수: 데이터와 컬럼
  data: T[]
  columns: MobileColumn<T>[]
  
  // 선택: 로딩 상태
  isLoading?: boolean
  skeletonRows?: number
  
  // 선택: 스크롤 안내
  showScrollHint?: boolean
  scrollHintText?: string
  
  // 선택: 그라데이션 힌트
  showGradientHint?: boolean
  
  // 선택: 빈 상태
  emptyText?: string
  emptyIcon?: ReactNode
  
  // 선택: 테이블 스타일
  headerClassName?: string
  rowClassName?: string
  cellClassName?: string
}

/**
 * 모바일 최적화 데이터 테이블 컴포넌트
 * 
 * @description
 * 모바일 환경에서 최적화된 데이터 테이블 컴포넌트입니다.
 * - 가로 스크롤 지원
 * - 스크롤 안내 표시
 * - 컴팩트한 디자인
 * - 반응형 폰트 크기
 * 
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', label: '이름', align: 'left' as const },
 *   { key: 'value', label: '금액', align: 'right' as const, render: (item) => formatCurrency(item.value) }
 * ]
 * 
 * <MobileDataTable
 *   data={data}
 *   columns={columns}
 *   isLoading={isLoading}
 *   showScrollHint={true}
 * />
 * ```
 */
export function MobileDataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  skeletonRows = 3,
  showScrollHint = true,
  scrollHintText = "좌우로 스크롤하여 전체 내용을 확인하세요",
  showGradientHint = true,
  emptyText = "데이터가 없습니다",
  emptyIcon,
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
}: MobileDataTableProps<T>) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className={`bg-gray-100 ${headerClassName}`}>
              <TableRow className="!border-b !border-gray-200">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="text-xs sm:text-sm font-semibold text-gray-700 py-3 sm:py-4 whitespace-nowrap"
                    style={{ 
                      textAlign: column.align || "left",
                      minWidth: column.mobileWidth || column.width || "auto"
                    }}
                  >
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(skeletonRows)].map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-gray-100">
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className="py-3 sm:py-4"
                      style={{ textAlign: column.align || "left" }}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  // 빈 상태
  if (!data || data.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
          <p className="text-sm text-slate-500">{emptyText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* 모바일 스크롤 안내 */}
      {showScrollHint && (
        <div className="sm:hidden bg-blue-50 border-b border-blue-100 px-3 py-2 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
          <span className="text-xs text-blue-700 font-medium">{scrollHintText}</span>
        </div>
      )}
      
      <div className="relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <Table>
            <TableHeader className={`bg-gray-100 ${headerClassName}`}>
              <TableRow className="!border-b !border-gray-200">
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className="text-xs sm:text-sm font-semibold text-gray-700 py-3 sm:py-4 whitespace-nowrap"
                    style={{ 
                      textAlign: column.align || "left",
                      minWidth: column.mobileWidth || column.width || "auto"
                    }}
                  >
                    {column.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, rowIndex) => (
                <TableRow 
                  key={rowIndex} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${rowClassName}`}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={`py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap ${cellClassName}`}
                      style={{ 
                        textAlign: column.align || "left",
                        minWidth: column.mobileWidth || column.width || "auto"
                      }}
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* 모바일 스크롤 힌트 그라데이션 */}
        {showGradientHint && (
          <div className="sm:hidden absolute top-0 right-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none"></div>
        )}
      </div>
    </div>
  )
}

/**
 * 카드형 모바일 데이터 표시 컴포넌트
 * 
 * @description
 * 테이블 대신 카드로 데이터를 표시하는 모바일 전용 컴포넌트입니다.
 * 복잡한 데이터를 모바일에서 더 읽기 쉽게 표시할 때 사용합니다.
 */
export interface MobileCardItem {
  label: string
  value: ReactNode
  highlight?: boolean
}

export interface MobileCardListProps<T> {
  data: T[]
  renderCard: (item: T, index: number) => MobileCardItem[]
  isLoading?: boolean
  skeletonCount?: number
  emptyText?: string
  emptyIcon?: ReactNode
  onItemClick?: (item: T, index: number) => void
}

export function MobileCardList<T>({
  data,
  renderCard,
  isLoading = false,
  skeletonCount = 3,
  emptyText = "데이터가 없습니다",
  emptyIcon,
  onItemClick,
}: MobileCardListProps<T>) {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(skeletonCount)].map((_, i) => (
          <Card key={i} className="shadow-none border border-gray-200">
            <CardContent className="p-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // 빈 상태
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-none border border-gray-200">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center">
            {emptyIcon && <div className="mb-3">{emptyIcon}</div>}
            <p className="text-sm text-slate-500">{emptyText}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {data.map((item, index) => {
        const cardItems = renderCard(item, index)
        return (
          <Card 
            key={index} 
            className="shadow-none border border-gray-200 hover:border-blue-300 transition-colors"
            onClick={() => onItemClick?.(item, index)}
          >
            <CardContent className="p-3">
              <div className="space-y-1.5">
                {cardItems.map((cardItem, i) => (
                  <div key={i} className="flex justify-between items-center gap-2">
                    <span className="text-[10px] text-slate-600 flex-shrink-0">{cardItem.label}</span>
                    <span className={`text-xs font-medium text-right ${cardItem.highlight ? 'text-blue-600' : 'text-slate-900'}`}>
                      {cardItem.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

