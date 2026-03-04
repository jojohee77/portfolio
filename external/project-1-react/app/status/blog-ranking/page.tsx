"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search, ChevronUp, ChevronDown, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { DailyKeywordsTable } from "@/components/keywords/daily-keywords-table"
import { KeywordDetailModal } from "@/components/keywords/keyword-detail-modal"
import TrackingKeywordRegisterModal from "@/components/keywords/tracking-keyword-register-modal"
import { generateKeywordData } from "@/lib/generate-keyword-data"
import type { KeywordData } from "@/app/status/keywords/page"
import CustomDatePicker from "@/components/ui/custom-datepicker"

export default function BlogRankingPage() {
  const { toast } = useToast()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null)
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [remainingMinerals] = useState<number>(2690)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("1년")
  
  // 키워드 데이터 생성
  const [keywordData, setKeywordData] = useState<KeywordData[]>([])

  // 빠른 날짜 선택 함수
  const handleQuickDateSelect = (period: string) => {
    const today = new Date()
    let start = new Date()
    let end = new Date()

    switch (period) {
      case "오늘":
        start = end = today
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
        end = new Date(2030, 11, 31)
        break
    }

    setStartDate(period === "전체" ? null : start)
    setEndDate(period === "전체" ? null : (period === "전체" ? end : today))
    setSelectedPeriod(period)
  }

  // 클라이언트에서만 데이터 생성 (hydration 에러 방지)
  useEffect(() => {
    const loadData = async () => {
      setIsPageLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      setKeywordData(generateKeywordData(30))
      setIsPageLoading(false)
    }
    loadData()
    // 초기 1년치 날짜 설정
    handleQuickDateSelect("1년")
  }, [])


  // DailyKeywordsTable에 전달할 데이터 형식 변환
  const keywordSourceData = keywordData.map((k) => ({
    keyword: k.keyword,
    clients: k.clients,
  }))

  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        toast({
          title: "링크가 복사되었습니다.",
          duration: 2000,
        })
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "absolute"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        const successful = document.execCommand("copy")
        document.body.removeChild(textArea)

        if (successful) {
          toast({
            title: "링크가 복사되었습니다.",
            duration: 2000,
          })
        } else {
          throw new Error("execCommand 실패")
        }
      }
    } catch (err) {
      toast({
        title: "복사에 실패했습니다. 브라우저에서 수동으로 복사해주세요.",
        variant: "error",
        duration: 3000,
      })
    }
  }

  // 검색 실행
  const handleSearch = () => {
    console.log("검색 실행:", { 
      searchTerm,
      startDate,
      endDate,
      selectedPeriod
    })
  }

  // 초기화
  const handleReset = () => {
    setSearchTerm("")
    setStartDate(null)
    setEndDate(null)
    setSelectedPeriod("1년")
    handleQuickDateSelect("1년")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="블로그 순위추적"
      />

      <div className="flex">
        <Sidebar
          currentPage="status/blog-ranking"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6">
          {isPageLoading ? (
            <>
              {/* 페이지 헤더 스켈레톤 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                <div className="hidden sm:block space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
                  <Skeleton className="h-10 w-full sm:w-36 rounded-lg" />
                </div>
              </div>

              {/* 필터 스켈레톤 */}
              <Card className="shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-px w-full" />
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-32" />
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </div>
                  <div className="flex justify-center gap-3 pt-4 border-t">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </CardContent>
              </Card>

              {/* 테이블 스켈레톤 */}
              <Card className="shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="space-y-3">
                    {[...Array(10)].map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="space-y-6">
              {/* 페이지 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                {/* 타이틀 영역 - 모바일에서는 숨김 */}
                <div className="flex-shrink-0 hidden sm:block">
                  <h1 className="text-xl sm:text-2xl font-bold">블로그 순위추적</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">키워드별 일별 순위 추적 현황을 확인합니다</p>
                  </div>
                </div>
                
                {/* 버튼 영역 - 항상 표시 */}
                <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground shadow-none rounded-lg"
                    onClick={() => setIsRegisterModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    추적 키워드 등록
                  </Button>
                </div>
              </div>

              {/* 검색 및 필터 */}
              <div className={`bg-white border border-gray-300 rounded-xl w-full max-w-full ${!isFilterExpanded ? 'overflow-hidden' : 'overflow-visible'}`}>
                <div className={`bg-slate-50 px-3 md:px-4 py-4 sm:py-5 space-y-3 sm:space-y-4 rounded-xl overflow-visible ${!isFilterExpanded ? 'rounded-b-xl' : ''}`}>
                  {/* 첫 번째 줄: 검색어 필드 */}
                  <div className="flex flex-row items-center gap-2 md:gap-3 w-full">
                    <span className="hidden md:block text-xs sm:text-sm text-gray-900 md:w-30 flex-shrink-0">검색어</span>
                    <div className="relative w-full md:min-w-0 md:max-w-lg max-w-full">
                      <Input 
                        placeholder="키워드, 고객사명으로 검색"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 shadow-none w-full bg-white text-sm text-gray-700" 
                      />
                      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    </div>
                    {/* 상세 버튼 - 검색어 필드 오른쪽 끝에 위치 */}
                    <Button 
                      variant="outline"
                      style={{ height: '36px', fontSize: '13px' }}
                      className="w-20 md:w-[90px] rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-100 bg-gray-100 flex items-center justify-center gap-2 transition-all duration-200 shadow-none flex-shrink-0"
                      onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                    >
                      <span className="text-gray-700 font-medium">{isFilterExpanded ? "접기" : "상세"}</span>
                      {isFilterExpanded ? (
                        <ChevronUp className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      )}
                    </Button>
                  </div>

                  {/* 아코디언: 펼쳐졌을 때만 표시되는 필터 */}
                  {isFilterExpanded && (
                    <>
                      {/* 구분선 */}
                      <div className="border-t border-gray-200"></div>

                      {/* 기간별 조회 */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
                        <span className="text-xs sm:text-sm text-gray-900 md:w-30 flex-shrink-0">기간</span>
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
                                  index === ["오늘", "1주일", "1개월", "3개월", "6개월", "1년", "전체"].length - 1 ? "rounded-r-md" : ""
                                } ${
                                  selectedPeriod === period 
                                    ? "bg-blue-100 text-blue-700 border border-primary" 
                                    : index < ["오늘", "1주일", "1개월", "3개월", "6개월", "1년", "전체"].length - 1 ? "text-gray-700 border-r-0" : "text-gray-700"
                                }`}
                                onClick={() => handleQuickDateSelect(period)}
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
                                setStartDate(start)
                                setEndDate(end)
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

                {/* 검색 및 초기화 버튼 (펼쳐졌을 때만 표시) */}
                {isFilterExpanded && (
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
                      onClick={handleSearch}
                    >
                      검색
                    </Button>
                  </div>
                )}
              </div>

              {/* 일별 키워드 순위 테이블 */}
              <DailyKeywordsTable
                onBack={() => {}}
                onCopyToClipboard={copyToClipboard}
                keywordData={keywordSourceData}
                searchTerm={searchTerm}
                onKeywordClick={(keyword) => {
                  // 키워드로 데이터 찾기
                  const foundKeyword = keywordData.find((k: KeywordData) => k.keyword === keyword)
                  if (foundKeyword) {
                    setSelectedKeyword(foundKeyword)
                    setIsDetailModalOpen(true)
                  }
                }}
                onRegisterClick={() => setIsRegisterModalOpen(true)}
              />

              {/* 상세보기 모달 */}
              <KeywordDetailModal
                isOpen={isDetailModalOpen}
                keyword={selectedKeyword}
                onClose={() => {
                  setIsDetailModalOpen(false)
                  setSelectedKeyword(null)
                }}
                onCopyToClipboard={copyToClipboard}
              />

              {/* 추적 키워드 등록 모달 */}
              <TrackingKeywordRegisterModal
                isOpen={isRegisterModalOpen}
                onClose={() => setIsRegisterModalOpen(false)}
                onSubmit={(keywords) => {
                  console.log("등록된 키워드:", keywords)
                  // TODO: API 호출하여 키워드 등록
                  toast({
                    title: "키워드가 등록되었습니다.",
                    description: `${keywords.length}개의 키워드가 추적 목록에 추가되었습니다.`,
                    duration: 3000,
                  })
                }}
                remainingMinerals={remainingMinerals}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

