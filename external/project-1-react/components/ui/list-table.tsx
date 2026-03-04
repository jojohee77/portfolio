"use client"

import React, { ReactNode } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CommonSelect } from "@/components/ui/common-select"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
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

export interface ListTableProps<T> {
  // 데이터
  data: T[]
  columns: Column<T>[]
  
  // 테이블 타이틀 (선택)
  title?: string
  totalCount: number
  
  // 정렬 (선택)
  sortValue?: string
  onSortChange?: (value: string) => void
  sortOptions?: SortOption[]
  
  // 페이지네이션
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showPagination?: boolean
  
  // 모바일 리스트 렌더링
  renderMobileItem: (item: T) => ReactNode
  
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
  
  // 스타일
  className?: string
}

export function ListTable<T extends { id: string | number }>({
  data,
  columns,
  title,
  totalCount,
  sortValue,
  onSortChange,
  sortOptions,
  currentPage,
  totalPages,
  onPageChange,
  showPagination = true,
  renderMobileItem,
  emptyIcon = "/icons/icon-default.png",
  emptyTitle = "데이터가 없습니다",
  emptyDescription = "해당 페이지에 표시할 정보가 없습니다.",
  isLoading = false,
  skeletonRows = 5,
  extraButtons,
  titleButtons,
  className = "",
}: ListTableProps<T>) {
  
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

  // 모바일 리스트 스켈레톤
  const renderMobileItemSkeleton = () => (
    <div className="bg-white border-b border-gray-200 py-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )

  // 테이블 행 스켈레톤
  const renderTableRowSkeleton = () => (
    <TableRow className="border-b border-gray-100">
      {columns.map((column, index) => (
        <TableCell key={column.key} className={`py-4 ${index === 0 ? 'pl-3' : ''}`}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  )

  return (
    <div className={className}>
      {/* 테이블 타이틀 */}
      {title && (
        <div className="flex flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">
              {title}
            </h2>
            {titleButtons && (
              <div className="flex items-center gap-2">
                {titleButtons}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 정렬 및 추가 버튼 */}
      {(sortOptions && sortOptions.length > 0 && onSortChange) || extraButtons ? (
        <div className="flex flex-row items-center justify-end gap-3 mb-4">
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
      ) : null}

      {/* 모바일 전용 버튼들 */}
      <div className="block lg:hidden mb-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {extraButtons}
        </div>
      </div>

      {/* 모바일 리스트 뷰 */}
      <div className="block lg:hidden">
        {isLoading ? (
          // 로딩 중일 때 스켈레톤 표시
          <Card className="shadow-none rounded-lg border border-gray-200 overflow-hidden px-4 py-0 gap-0">
            {Array.from({ length: skeletonRows }).map((_, index) => (
              <div key={`skeleton-mobile-${index}`}>
                {renderMobileItemSkeleton()}
              </div>
            ))}
          </Card>
        ) : data.length === 0 ? (
          <Card className="shadow-none rounded-xl border border-gray-200">
            <CardContent className="p-12 text-center">
              {renderEmptyState()}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-none rounded-lg border border-gray-200 overflow-hidden px-4 py-0 gap-0">
            {data.map((item) => (
              <div key={item.id}>
                {renderMobileItem(item)}
              </div>
            ))}
          </Card>
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
      {showPagination && data.length > 0 && (
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

export default ListTable

