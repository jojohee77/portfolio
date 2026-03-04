"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CustomDatePicker from "@/components/ui/custom-datepicker"
import { Search, ChevronUp, ChevronDown } from "lucide-react"

interface PostingSearchFilterProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  selectedClient: string
  onClientChange: (value: string) => void
  selectedTeam: string
  onTeamChange: (value: string) => void
  selectedManager: string
  onManagerChange: (value: string) => void
  startDate: Date | null
  onStartDateChange: (value: Date | null) => void
  endDate: Date | null
  onEndDateChange: (value: Date | null) => void
  selectedPeriod: string
  onPeriodChange: (value: string) => void
  clients: string[]
  teams: string[]
  managers: string[]
}

export default function PostingSearchFilter({
  searchTerm,
  onSearchTermChange,
  selectedClient,
  onClientChange,
  selectedTeam,
  onTeamChange,
  selectedManager,
  onManagerChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  selectedPeriod,
  onPeriodChange,
  clients,
  teams,
  managers
}: PostingSearchFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false) // 기본값: 접혀있음

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const handleReset = () => {
    onSearchTermChange("")
    onClientChange("all")
    onTeamChange("all")
    onManagerChange("all")
    onPeriodChange("1년")
    onStartDateChange(null)
    onEndDateChange(null)
  }

  return (
    <div className="bg-white border rounded-xl w-full max-w-full">
      {/* 상단 검색 필드들 - 연한 회색 배경 */}
      <div className={`bg-slate-50 px-3 md:px-4 py-4 sm:py-5 space-y-3 sm:space-y-4 rounded-t-xl overflow-visible ${!isExpanded ? 'rounded-b-xl' : ''}`}>
        {/* 첫 번째 줄: 검색어 필드 */}
        <div className="flex flex-row items-center gap-2 md:gap-3 w-full">
          <span className="hidden md:block text-xs sm:text-sm text-gray-900 md:w-20 flex-shrink-0">검색어</span>
          <div className="relative w-full md:min-w-0 md:max-w-2xl max-w-full flex-1">
            <Input 
              placeholder="계약번호, 회사명, 담당자명으로 검색"
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

            {/* 두 번째 줄: 필터 셀렉트들 */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
              <span className="text-xs sm:text-sm text-gray-900 md:w-20 flex-shrink-0">필터</span>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Select value={selectedClient} onValueChange={onClientChange}>
                  <SelectTrigger className="w-full sm:w-32 shadow-none bg-white text-gray-700 font-normal text-xs">
                    <SelectValue placeholder="전체 고객" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 고객</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client} value={client}>
                        {client}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedTeam} onValueChange={onTeamChange}>
                  <SelectTrigger className="w-full sm:w-32 shadow-none bg-white text-gray-700 font-normal text-xs">
                    <SelectValue placeholder="전체 팀" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 팀</SelectItem>
                    {teams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedManager} onValueChange={onManagerChange}>
                  <SelectTrigger className="w-full sm:w-32 shadow-none bg-white text-gray-700 font-normal text-xs">
                    <SelectValue placeholder="전체 담당자" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 담당자</SelectItem>
                    {managers.map((manager) => (
                      <SelectItem key={manager} value={manager}>
                        {manager}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 구분선 */}
            <div className="border-t border-gray-200"></div>

            {/* 세 번째 줄: 날짜 범위 선택 */}
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
              <span className="text-xs sm:text-sm text-gray-900 md:w-20 flex-shrink-0">기간</span>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:items-center w-full max-w-full">
                {/* 빠른 선택 버튼 */}
                <div className="flex items-center overflow-x-auto w-full sm:w-auto -mx-1 px-1">
                  {["오늘", "1주일", "1개월", "3개월", "6개월", "1년", "전체"].map((period, index) => (
                    <Button
                      key={period}
                      variant="outline"
                      size="sm"
                      className={`shadow-none text-[10px] sm:text-xs h-8 sm:h-9 px-2 sm:px-3 rounded-none font-normal flex-shrink-0 ${
                        index === 0 ? "rounded-l-md" : ""
                      } ${
                        index === 6 ? "rounded-r-md" : ""
                      } ${
                        selectedPeriod === period 
                          ? "bg-blue-100 text-blue-700 border border-primary" 
                          : index < 6 ? "text-gray-700 border-r-0" : "text-gray-700"
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
                    onRangeChange={(start, end) => {
                      onStartDateChange(start)
                      onEndDateChange(end)
                    }}
                    placeholder="시작일 - 종료일 선택"
                    disabled={selectedPeriod === "전체"}
                    size="small"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 네 번째 줄: 검색 및 초기화 버튼 (펼쳐졌을 때만 표시) */}
      {isExpanded && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 px-3 md:px-4 py-4 sm:py-5 border-t border-gray-100">
          <Button 
            variant="outline" 
            className="shadow-none w-28 sm:w-30 h-9 sm:h-10 text-sm rounded-lg border-gray-300 hover:bg-gray-100"
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button 
            className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 shadow-none w-28 sm:w-30 h-9 sm:h-10 text-sm rounded-lg"
            onClick={() => {}}
          >
            검색
          </Button>
        </div>
      )}
    </div>
  )
}
