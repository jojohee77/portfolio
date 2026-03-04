"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CustomDatePicker from "@/components/ui/custom-datepicker"
import RegionSearch from "@/components/ui/region-search"
import { Search, ChevronUp, ChevronDown } from "lucide-react"

export interface StatusOption {
  value: string
  label: string
}

export interface DateCriteriaOption {
  value: string
  label: string
}

export interface SearchFilterPanelProps {
  // 검색어
  searchTerm: string
  onSearchTermChange: (value: string) => void
  searchPlaceholder?: string
  
  // 지역 검색
  selectedRegions?: string[]
  onRegionsChange?: (regions: string[]) => void
  showRegionSearch?: boolean
  regionOptions?: any[]
  isRegionDataLoading?: boolean
  
  // 상태 필터
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  statusOptions: StatusOption[]
  statusLabel?: string
  
  // 날짜 필터
  dateCriteria?: string
  onDateCriteriaChange?: (value: string) => void
  dateOptions?: DateCriteriaOption[]
  startDate: Date | null
  endDate: Date | null
  onDateRangeChange: (start: Date | null, end: Date | null) => void
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  periodOptions?: string[]
  dateLabel?: string
  showDateFilter?: boolean
  
  // 버튼 액션
  onSearch: () => void
  onReset: () => void
  
  // 스타일 커스터마이징
  className?: string
}

export function SearchFilterPanel({
  searchTerm,
  onSearchTermChange,
  searchPlaceholder = "검색어를 입력하세요",
  selectedRegions = [],
  onRegionsChange,
  showRegionSearch = false,
  regionOptions = [],
  isRegionDataLoading = false,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  statusLabel = "상태",
  dateCriteria,
  onDateCriteriaChange,
  dateOptions,
  startDate,
  endDate,
  onDateRangeChange,
  selectedPeriod,
  onPeriodChange,
  periodOptions = ["오늘", "1주일", "1개월", "3개월", "6개월", "1년", "전체"],
  dateLabel = "기간",
  showDateFilter = true,
  onSearch,
  onReset,
  className = "",
}: SearchFilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`${className}`}>
      <div className={`bg-white border border-gray-300 rounded-xl w-full max-w-full ${!isExpanded ? 'overflow-hidden' : 'overflow-visible'}`}>
        {/* 상단 검색 필드들 - 연한 블루 배경 */}
        <div className={`bg-slate-50 px-3 md:px-4 py-4 sm:py-5 space-y-3 sm:space-y-4 rounded-t-xl overflow-visible ${!isExpanded ? 'rounded-b-xl' : ''}`}>
        {/* 첫 번째 줄: 검색어 필드 */}
        <div className="flex flex-row items-center gap-2 md:gap-3 w-full">
          <span className="hidden md:block text-xs sm:text-sm text-gray-900 md:w-30 flex-shrink-0">검색어</span>
          <div className="relative w-full md:min-w-0 md:max-w-lg max-w-full">
            <Input 
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchTermChange(e.target.value)}
              className="pr-10 shadow-none w-full bg-white text-sm text-gray-700" 
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          {/* 상세 버튼 - 검색어 필드 오른쪽 끝에 위치 */}
          <Button 
            variant="outline"
            style={{ height: '36px', fontSize: '13px' }}
            className="w-20 md:w-[90px] rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-100 bg-gray-100 flex items-center justify-center gap-2 transition-all duration-200 shadow-none flex-shrink-0"
            onClick={toggleExpanded}
          >
            <span className="text-gray-700 font-medium">{isExpanded ? "접기" : "상세"}</span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>

        {/* 아코디언: 펼쳐졌을 때만 표시되는 필터들 */}
        {isExpanded && (
          <>
            {/* 구분선 */}
            <div className="border-t border-gray-200"></div>

            {/* 지역 검색 필드 (옵션) */}
            {showRegionSearch && onRegionsChange && (
              <>
                {/* 두 번째 줄: 지역 검색 */}
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-3 w-full">
                  <span className="text-xs sm:text-sm text-gray-900 md:w-30 flex-shrink-0">지역검색</span>
                  <div className="w-full md:min-w-0 md:max-w-lg max-w-full">
                    <RegionSearch
                      selectedRegions={selectedRegions}
                      onRegionsChange={onRegionsChange}
                      placeholder="지역명 검색 예) 서울, 서초구"
                      regionOptions={regionOptions}
                      isLoading={isRegionDataLoading}
                    />
                  </div>
                </div>

                {/* 구분선 */}
                <div className="border-t border-gray-200"></div>
              </>
            )}

            {/* 세 번째 줄: 상태 필터 */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
              <span className="text-xs sm:text-sm text-gray-900 md:w-30 flex-shrink-0">{statusLabel}</span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={option.value}
                      checked={statusFilter === option.value}
                      onCheckedChange={() => onStatusFilterChange(option.value)}
                    />
                    <Label htmlFor={option.value} className="text-sm text-gray-700">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 날짜 필터 (옵션) */}
            {showDateFilter && (
              <>
                {/* 구분선 */}
                <div className="border-t border-gray-200"></div>

                {/* 네 번째 줄: 날짜 범위 선택 */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
                  <span className="text-xs sm:text-sm text-gray-900 md:w-30 flex-shrink-0">{dateLabel}</span>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center w-full max-w-full">
                    
                    {/* 기준 날짜 선택 드롭다운 (옵션) */}
                    {dateCriteria && onDateCriteriaChange && dateOptions && (
                      <Select value={dateCriteria} onValueChange={onDateCriteriaChange}>
                        <SelectTrigger className="w-full sm:w-32 shadow-none bg-white text-gray-700 font-normal text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {dateOptions.map((option) => (
                            <SelectItem 
                              key={option.value} 
                              value={option.value}
                              className="text-gray-700 font-normal text-xs"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {/* 빠른 선택 버튼 */}
                    <div className="flex items-center overflow-x-auto w-full sm:w-auto -mx-1 px-1">
                      {periodOptions.map((period, index) => (
                        <Button
                          key={period}
                          variant="outline"
                          size="sm"
                          className={`shadow-none text-[10px] sm:text-xs h-8 sm:h-9 px-2 sm:px-3 rounded-none font-normal flex-shrink-0 ${
                            index === 0 ? "rounded-l-md" : ""
                          } ${
                            index === periodOptions.length - 1 ? "rounded-r-md" : ""
                          } ${
                            selectedPeriod === period 
                              ? "bg-blue-100 text-blue-700 border border-primary" 
                              : index < periodOptions.length - 1 ? "text-gray-700 border-r-0" : "text-gray-700"
                          }`}
                          onClick={() => onPeriodChange(period)}
                        >
                          {period}
                        </Button>
                      ))}
                    </div>

                    {/* 직접 날짜 입력 */}
                    <div className="relative z-10 w-full sm:w-auto">
                      <CustomDatePicker
                        selectRange={true}
                        rangeStart={startDate}
                        rangeEnd={endDate}
                        onRangeChange={(start, end) => onDateRangeChange(start, end)}
                        placeholder="시작일 - 종료일 선택"
                        disabled={selectedPeriod === "전체"}
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* 다섯 번째 줄: 검색 및 초기화 버튼 (펼쳐졌을 때만 표시) */}
      {isExpanded && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 md:px-4 py-4 sm:py-5 border-t border-gray-100">
          <Button 
            variant="outline" 
            className="shadow-none w-28 sm:w-30 h-9 sm:h-10 text-sm rounded-lg border-gray-300 hover:bg-gray-100"
            onClick={onReset}
          >
            초기화
          </Button>
          <Button 
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 shadow-none w-28 sm:w-30 h-9 sm:h-10 text-sm rounded-lg"
            onClick={onSearch}
          >
            검색
          </Button>
        </div>
      )}
      </div>
    </div>
  )
}

export default SearchFilterPanel

