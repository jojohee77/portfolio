"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import DataTable, { type Column } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, X, ArrowRight, Hand, TrendingUp, TrendingDown, Loader2 } from "lucide-react"

interface DailyRanking {
  date: string // YYYY-MM-DD
  rank: number | null // null이면 순위 없음, 10위 초과면 순위 밖
  status?: "collecting" | null // 수집중 상태
}

interface DailyKeywordData {
  id: string
  keyword: string
  clients: string[] // 여러 고객사
  rankings: DailyRanking[] // 한 달치 순위 데이터
}

interface KeywordSourceData {
  keyword: string
  clients: string[]
}

interface DailyKeywordsTableProps {
  onBack: () => void
  onCopyToClipboard?: (text: string) => void
  onKeywordClick?: (keyword: string) => void
  onRegisterClick?: () => void
  keywordData?: KeywordSourceData[]
  searchTerm: string
}

// 순위 뱃지 색상
const getRankColor = (rank: number | null) => {
  if (!rank) return "bg-gray-100 text-gray-400 border-gray-200"
  if (rank === 1) return "bg-red-100 text-red-700 border-red-300"
  if (rank <= 3) return "bg-orange-100 text-orange-700 border-orange-300"
  if (rank <= 5) return "bg-blue-100 text-blue-700 border-blue-300"
  if (rank <= 10) return "bg-green-100 text-green-700 border-green-300"
  return "bg-gray-100 text-gray-600 border-gray-300"
}

// 한 달치 날짜 배열 생성 (오늘부터 30일 전까지)
const generateDateRange = (days: number = 30): string[] => {
  const dates: string[] = []
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  return dates
}

// 날짜를 'M/D' 형식으로 변환
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}`
}

// 더미 데이터 생성
const generateDummyData = (dateRange: string[], keywordData?: KeywordSourceData[]): DailyKeywordData[] => {
  // keywordData가 있으면 그걸 사용, 없으면 기본 더미 데이터
  const sourceData = keywordData || [
    { keyword: "마포한의원", clients: ["SM엔터"] },
    { keyword: "강남피부과", clients: ["JYP엔터"] },
    { keyword: "서울치과", clients: ["하이브"] },
    { keyword: "분당성형외과", clients: [] },
    { keyword: "신림정형외과", clients: [] },
    { keyword: "압구정피부과", clients: [] },
    { keyword: "강북한의원", clients: [] },
    { keyword: "송파내과", clients: [] },
    { keyword: "일산산부인과", clients: [] },
    { keyword: "수원치과", clients: [] },
    { keyword: "AI 솔루션", clients: [] },
    { keyword: "AI 솔루션", clients: [] },
    { keyword: "AI 솔루션", clients: [] },
  ]

  // 오늘 날짜 확인 (dateRange의 첫 번째 날짜가 오늘)
  const today = new Date().toISOString().split('T')[0]
  const isToday = (date: string) => date === today

  return sourceData.map((item, idx) => {
    // clients가 없거나 빈 배열인지 확인 - 명시적으로 처리
    let clients: string[] = []
    if (item.clients !== undefined && item.clients !== null) {
      if (Array.isArray(item.clients)) {
        clients = item.clients.length > 0 ? [...item.clients] : []
      }
    }
    
    return {
      id: `keyword-${idx}`,
      keyword: item.keyword,
      clients: clients,
      rankings: dateRange.map((date) => {
      // 오늘 날짜만 수집중 상태 가능
      if (isToday(date)) {
        const rand = Math.random()
        // 30% 확률로 오늘 날짜는 수집중
        if (rand < 0.3) {
          return { date, rank: null, status: "collecting" as const }
        }
      }
      
      // 과거 날짜는 수집 완료된 상태 (모든 날짜에 순위가 있어야 함)
      const rank = Math.floor(Math.random() * 20) + 1
      return { date, rank, status: null }
    }),
    }
  })
}

export function DailyKeywordsTable({ onBack, onCopyToClipboard, onKeywordClick, onRegisterClick, keywordData, searchTerm }: DailyKeywordsTableProps) {
  const [showEmptyState, setShowEmptyState] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<DailyKeywordData[]>([])
  const [showScrollToast, setShowScrollToast] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const itemsPerPage = 15

  // 스크롤 안내 토스트 자동 숨김
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollToast(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])
  
  // 날짜 범위 생성
  const dateRange = useMemo(() => generateDateRange(30), [])
  
  // 데이터 로딩
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 500))
      setData(generateDummyData(dateRange, keywordData))
      setIsLoading(false)
    }
    loadData()
  }, [dateRange, keywordData])

  // 검색어 필터링
  const filteredData = useMemo(() => {
    let result = data

    // 검색어 필터링 (page.tsx에서 전달받은 searchTerm 사용)
    if (searchTerm) {
      result = result.filter(item =>
        item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clients.some(client => client.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    return result
  }, [data, searchTerm])

  // 페이징
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = showEmptyState ? [] : filteredData.slice(startIndex, startIndex + itemsPerPage)

  // 검색어 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // 드래그 스크롤 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    // 버튼이나 클릭 가능한 요소에서는 드래그 안함
    if ((e.target as HTMLElement).closest('button, a, [role="button"]')) return
    
    if (!scrollContainerRef.current) return
    
    setIsDragging(true)
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft)
    setScrollLeft(scrollContainerRef.current.scrollLeft)
    scrollContainerRef.current.style.cursor = 'grabbing'
    scrollContainerRef.current.style.userSelect = 'none'
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return
    
    e.preventDefault()
    const x = e.pageX - scrollContainerRef.current.offsetLeft
    const walk = (x - startX) * 2 // 스크롤 속도 조절
    scrollContainerRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
    scrollContainerRef.current.style.cursor = 'grab'
    scrollContainerRef.current.style.userSelect = 'auto'
    }
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab'
      scrollContainerRef.current.style.userSelect = 'auto'
    }
  }

  // 동적 컬럼 생성
  const columns = useMemo<Column<DailyKeywordData>[]>(() => {
    const baseColumns: Column<DailyKeywordData>[] = [
      {
        key: "keyword",
        label: "키워드",
        width: "w-[140px]",
        render: (item) => (
          <button
            onClick={() => onKeywordClick?.(item.keyword)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            {item.keyword}
          </button>
        ),
      },
      {
        key: "clients",
        label: "고객사",
        width: "w-[120px]",
        render: (item) => {
          // 디버깅: 실제 데이터 확인
          const clients = item.clients || []
          const hasClients = Array.isArray(clients) && clients.length > 0
          
          return (
            <div className="flex flex-wrap gap-1">
              {hasClients ? (
                <>
                  {clients.slice(0, 2).map((client, idx) => (
                    <span key={idx} className="text-xs text-gray-900 px-2 py-0.5">
                      {client}
                    </span>
                  ))}
                  {clients.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{clients.length - 2}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-xs text-gray-400 px-2 py-0.5">
                  미지정
                </span>
              )}
            </div>
          )
        },
      },
    ]

    // 날짜별 컬럼 추가
    const dateColumns: Column<DailyKeywordData>[] = dateRange.map((date, index) => ({
      key: `date-${date}`,
      label: formatDate(date),
      width: "w-[80px]",
      align: "center" as const,
      render: (item) => {
        const ranking = item.rankings.find(r => r.date === date)
        const rank = ranking?.rank
        const status = ranking?.status
        
        // 오늘 날짜 확인
        const today = new Date().toISOString().split('T')[0]
        const isToday = date === today
        
        // 수집중 상태 확인 (오늘 날짜만)
        if (isToday && status === "collecting") {
          return (
            <div className="flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-center gap-1">
                <span className="text-xs text-blue-600 leading-tight">수집중</span>
                <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
              </div>
            </div>
          )
        }
        
        // 15위 초과면 순위 밖
        if (rank !== null && rank > 15) {
          return (
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-xs text-gray-500 leading-tight">순위 밖</span>
            </div>
          )
        }
        
        // 이전 날짜의 순위 찾기 (오늘 기준으로 더 최근 날짜)
        let previousRank: number | null = null
        if (index < dateRange.length - 1) {
          const previousDate = dateRange[index + 1]
          const previousRanking = item.rankings.find(r => r.date === previousDate)
          // 이전 날짜가 수집중이거나 순위 밖이 아닌 경우만 비교
          if (previousRanking && previousRanking.status !== "collecting" && previousRanking.rank !== null && previousRanking.rank <= 15) {
            previousRank = previousRanking.rank
          }
        }
        
        // 순위 변화 계산 (순위가 낮아질수록 좋음, 숫자가 작아질수록 좋음)
        // 이전 순위 - 현재 순위: 양수면 개선(상승), 음수면 악화(하강)
        const rankChange = previousRank !== null && rank !== null && rank <= 15 ? previousRank - rank : null
        
        // 순위가 있으면 항상 표시 (변동이 없어도 순위 표시)
        if (rank !== null && rank <= 15) {
          return (
            <div className="flex flex-col items-center justify-center gap-0.5">
              <span className="text-sm font-semibold text-gray-900 leading-tight">
                {rank}위
              </span>
              {rankChange !== null && rankChange !== 0 && (
                <div
                  className={`flex items-center justify-center gap-0.5 text-[10px] leading-tight ${
                    rankChange > 0
                      ? "text-green-600"
                      : rankChange < 0
                        ? "text-red-600"
                        : "text-slate-500"
                  }`}
                >
                  {rankChange > 0 ? (
                    <TrendingUp className="h-2 w-2" />
                  ) : rankChange < 0 ? (
                    <TrendingDown className="h-2 w-2" />
                  ) : null}
                  {rankChange > 0 ? "+" : ""}
                  {rankChange > 0 ? rankChange : -rankChange}
                </div>
              )}
            </div>
          )
        }
        
        // 순위가 없거나 15위 초과인 경우는 이미 위에서 처리됨
        return (
          <div className="flex flex-col items-center justify-center gap-0.5">
            <span className="text-sm text-gray-400">-</span>
          </div>
        )
      },
    }))

    return [...baseColumns, ...dateColumns]
  }, [dateRange])

  // 모바일 카드 렌더링
  const renderMobileCard = (item: DailyKeywordData) => (
    <Card className="shadow-none rounded-xl border border-gray-200">
      <CardContent className="p-4 space-y-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="space-y-2">
            <button
              onClick={() => onKeywordClick?.(item.keyword)}
              className="text-sm font-normal text-blue-600 underline hover:text-blue-700 cursor-pointer"
            >
              {item.keyword}
            </button>
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-xs text-gray-500">고객사:</span>
              {item.clients && Array.isArray(item.clients) && item.clients.length > 0 ? (
                item.clients.map((client, idx) => (
                  <span
                    key={idx}
                    className="text-xs text-gray-900 px-2 py-0.5"
                  >
                    {client}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-400 px-2 py-0.5">
                  미지정
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 최근 7일 순위 */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-700">최근 7일 순위</div>
          <div className="grid grid-cols-7 gap-2">
            {item.rankings.slice(0, 7).map((ranking, idx) => {
              // 오늘 날짜 확인
              const today = new Date().toISOString().split('T')[0]
              const isToday = ranking.date === today
              
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className="text-xs text-gray-500">
                    {formatDate(ranking.date)}
                  </div>
                  {isToday && ranking.status === "collecting" ? (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-blue-600">수집중</span>
                      <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
                    </div>
                  ) : ranking.rank !== null && ranking.rank > 15 ? (
                    <span className="text-xs text-gray-500">순위 밖</span>
                  ) : ranking.rank !== null && ranking.rank <= 15 ? (
                    <span className="text-sm font-semibold text-gray-900">
                      {ranking.rank}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            전체 기간: {dateRange.length}일
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    const headers = ["고객사", "키워드", ...dateRange.map(formatDate)]
    
    const today = new Date().toISOString().split('T')[0]
    
    const csvData = filteredData.map((item) => {
      // 고객사 처리
      const clientsText = item.clients && Array.isArray(item.clients) && item.clients.length > 0
        ? item.clients.join(", ")
        : "미지정"
      
      // 순위 데이터 처리 (화면 표시 로직과 동일)
      const rankingsText = item.rankings.map((r) => {
        const isToday = r.date === today
        
        // 수집중 상태 확인 (오늘 날짜만)
        if (isToday && r.status === "collecting") {
          return "수집중"
        }
        
        // 15위 초과면 순위 밖
        if (r.rank !== null && r.rank > 15) {
          return "순위 밖"
        }
        
        // 순위가 있으면 표시
        if (r.rank !== null && r.rank <= 15) {
          return `${r.rank}위`
        }
        
        // 그 외는 "-"
        return "-"
      })
      
      return [
        clientsText,
        item.keyword,
        ...rankingsText,
      ]
    })
    
    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n")
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)

    const todayStr = new Date().toISOString().slice(0, 10)
    link.setAttribute("download", `일별키워드순위_${todayStr}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
    return (
    <div className="space-y-4 w-full min-w-0">
      
      {/* 데이터가 없을 때: 간단한 카드 박스만 표시 */}
      {!isLoading && (showEmptyState || paginatedData.length === 0) ? (
        <div className="border border-gray-200 rounded-lg p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Button
              onClick={onRegisterClick}
              className="mb-4 h-11 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
            >
              추적 키워드 등록하기
            </Button>
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-0">등록된 추적 키워드가 없습니다</h3>
              <p className="text-sm text-gray-500">추적 키워드를 등록하고 서비스를 이용하세요</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 테이블 타이틀 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold">
                일별 키워드 순위 <span className="text-xs sm:text-sm text-blue-600 font-normal">({filteredData.length}개)</span>
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showEmptyState ? "default" : "outline"}
                size="sm"
                onClick={() => setShowEmptyState(!showEmptyState)}
                className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
              >
                {showEmptyState ? "데이터 보기" : "빈 상태 보기"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExcelDownload}
                className="text-gray-600 border-gray-300 bg-white hover:bg-gray-50 text-xs h-8 px-3 flex-shrink-0 shadow-none"
              >
                <img src="/icons/icon-excel.png" alt="Excel" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                엑셀 다운로드
              </Button>
            </div>
          </div>
          
          {/* 테이블 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white relative w-full min-w-0">
        {/* 스크롤 안내 토스트 */}
        {showScrollToast && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in duration-500">
            <div className="bg-gray-700 bg-opacity-90 rounded-xl px-4 py-3 flex flex-col items-center gap-2 shadow-lg">
              {/* 좌우 화살표와 손가락 아이콘 */}
              <div className="relative flex items-center justify-center">
                <ArrowLeft className="h-5 w-5 text-green-400" />
                <Hand className="h-7 w-7 text-white mx-2 cursor-pointer" />
                <ArrowRight className="h-5 w-5 text-green-400" />
            </div>
            
              {/* 안내 텍스트 */}
              <div className="text-center">
                <p className="text-white text-xs font-medium">좌우로 스크롤 하세요</p>
          </div>
          
              {/* 닫기 버튼 */}
              <button
                onClick={() => setShowScrollToast(false)}
                className="absolute top-1 right-1 text-gray-400 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
              </div>
            </div>
        )}
        
        {/* 테이블 - 고정/스크롤 분리 구조 */}
        <div className="relative flex min-w-0 w-full">
          {/* 왼쪽 고정 영역 */}
          <div className="flex-shrink-0 bg-white border-r border-gray-300">
            {/* 고정 헤더 */}
            <div className="flex daily-keywords-table-header" style={{ backgroundColor: '#f3f4f6' }}>
              <div className="w-[80px] sm:w-[120px] px-2 sm:px-4 py-4 text-xs sm:text-sm font-semibold text-gray-700 text-center flex items-center justify-center daily-keywords-header-cell">고객사</div>
              <div className="w-[100px] sm:w-[140px] px-2 sm:px-4 py-4 text-xs sm:text-sm font-semibold text-gray-700 text-center flex items-center justify-center daily-keywords-header-cell">키워드</div>
                  </div>
                  
            {/* 고정 데이터 */}
            <div className="bg-white">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <div key={`fixed-${index}`} className="flex h-[57px]">
                    <div className="w-[80px] sm:w-[120px] px-2 sm:px-4 py-4 text-center flex items-center justify-center daily-keywords-data-cell">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="w-[100px] sm:w-[140px] px-2 sm:px-4 py-4 text-center flex items-center justify-center daily-keywords-data-cell overflow-y-auto">
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        </div>
                ))
              ) : (
                paginatedData.map((item, idx) => (
                  <div key={`fixed-${item.id}`} className="flex group h-[57px]">
                    <div className="w-[80px] sm:w-[120px] px-2 sm:px-4 py-4 text-center flex items-center justify-center group-hover:bg-gray-50 daily-keywords-data-cell">
                      {item.clients && Array.isArray(item.clients) && item.clients.length > 0 ? (
                        <span className="text-xs sm:text-sm font-normal text-gray-900">
                          {item.clients[0]}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm text-gray-400">
                          미지정
                        </span>
                      )}
                    </div>
                    <div className="w-[100px] sm:w-[140px] px-2 sm:px-4 py-4 text-center flex items-center justify-center group-hover:bg-gray-50 daily-keywords-data-cell overflow-y-auto">
                          <button
                        onClick={() => onKeywordClick?.(item.keyword)}
                        className="text-xs sm:text-sm font-normal text-blue-600 underline hover:text-blue-700 cursor-pointer"
                          >
                            {item.keyword}
                          </button>
                        </div>
                  </div>
                ))
              )}
                        </div>
                      </div>
                      
          {/* 오른쪽 스크롤 영역 */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 min-w-0 overflow-x-auto cursor-grab select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* 스크롤 헤더 */}
            <div className="flex daily-keywords-table-header" style={{ backgroundColor: '#f3f4f6' }}>
              {dateRange.map((date) => (
                <div key={date} className="w-[80px] px-2 py-4 text-xs sm:text-sm font-semibold text-gray-700 text-center flex-shrink-0 flex items-center justify-center daily-keywords-header-cell">
                  {formatDate(date)}
                </div>
              ))}
            </div>
            
            {/* 스크롤 데이터 */}
            <div>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <div key={`scroll-${index}`} className="flex h-[57px] bg-white">
                    {dateRange.map((date) => (
                      <div key={date} className="w-[80px] px-2 py-4 text-center flex-shrink-0 flex items-center justify-center daily-keywords-data-cell">
                        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                ))
              ) : (
                paginatedData.map((item, idx) => (
                  <div key={`scroll-${item.id}`} className="flex bg-white hover:bg-gray-50 h-[57px]">
                    {dateRange.map((date, dateIndex) => {
                      const ranking = item.rankings.find(r => r.date === date)
                      const rank = ranking?.rank
                      const status = ranking?.status
                      
                      // 오늘 날짜 확인
                      const today = new Date().toISOString().split('T')[0]
                      const isToday = date === today
                      
                      // 수집중 상태 확인 (오늘 날짜만)
                      if (isToday && status === "collecting") {
                        return (
                          <div key={date} className="w-[80px] px-2 text-center flex-shrink-0 flex flex-col items-center justify-center daily-keywords-data-cell gap-0.5">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-blue-600 leading-tight">수집중</span>
                              <Loader2 className="h-3 w-3 text-blue-600 animate-spin" />
                            </div>
                          </div>
                        )
                      }
                      
                      // 15위 초과면 순위 밖
                      if (rank !== null && rank > 15) {
                        return (
                          <div key={date} className="w-[80px] px-2 text-center flex-shrink-0 flex flex-col items-center justify-center daily-keywords-data-cell gap-0.5">
                            <span className="text-xs text-gray-500 leading-tight">순위 밖</span>
                          </div>
                        )
                      }
                      
                      // 이전 날짜의 순위 찾기
                      let previousRank: number | null = null
                      if (dateIndex < dateRange.length - 1) {
                        const previousDate = dateRange[dateIndex + 1]
                        const previousRanking = item.rankings.find(r => r.date === previousDate)
                        // 이전 날짜가 수집중이거나 순위 밖이 아닌 경우만 비교
                        if (previousRanking && previousRanking.status !== "collecting" && previousRanking.rank !== null && previousRanking.rank <= 15) {
                          previousRank = previousRanking.rank
                        }
                      }
                      
                      // 순위 변화 계산
                      const rankChange = previousRank !== null && rank !== null && rank <= 15 ? previousRank - rank : null
                      
                      // 순위가 있으면 항상 표시 (변동이 없어도 순위 표시)
                      if (rank !== null && rank <= 15) {
                        return (
                          <div key={date} className="w-[80px] px-2 text-center flex-shrink-0 flex flex-col items-center justify-center daily-keywords-data-cell gap-0.5">
                            <span className="text-xs sm:text-sm text-gray-700 font-semibold leading-tight">{rank}</span>
                            {rankChange !== null && rankChange !== 0 && (
                              <div
                                className={`flex items-center justify-center gap-0.5 text-[10px] leading-tight ${
                                  rankChange > 0
                                    ? "text-green-600"
                                    : rankChange < 0
                                      ? "text-red-600"
                                      : "text-slate-500"
                                }`}
                              >
                                {rankChange > 0 ? (
                                  <TrendingUp className="h-2 w-2" />
                                ) : rankChange < 0 ? (
                                  <TrendingDown className="h-2 w-2" />
                                ) : null}
                                {rankChange > 0 ? "+" : ""}
                                {rankChange > 0 ? rankChange : -rankChange}
                              </div>
                            )}
                          </div>
                        )
                      }
                      
                      // 순위가 없거나 15위 초과인 경우는 이미 위에서 처리됨
                      return (
                        <div key={date} className="w-[80px] px-2 text-center flex-shrink-0 flex flex-col items-center justify-center daily-keywords-data-cell gap-0.5">
                          <span className="text-xs sm:text-sm text-gray-400">-</span>
                        </div>
                      )
                    })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          </div>

          {/* 페이지네이션 */}
          {paginatedData.length > 0 && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center gap-2">
            {/* 이전 버튼 */}
            <button
              onClick={() => {
                if (currentPage > 1) {
                  setCurrentPage(currentPage - 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
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
                  onClick={() => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
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
              onClick={() => {
                if (currentPage < totalPages) {
                  setCurrentPage(currentPage + 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
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
        </>
      )}
    </div>
  )
}

