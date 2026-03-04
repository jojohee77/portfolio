"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronUp, ChevronDown } from "lucide-react"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import StatusSummaryCards from "@/components/ui/card-status-summary"
import { KeywordsCharts } from "@/components/keywords/keywords-charts"
import { KeywordsTable } from "@/components/keywords/keywords-table"
import { KeywordDetailModal } from "@/components/keywords/keyword-detail-modal"
import { generateKeywordData } from "@/lib/generate-keyword-data"
import TrackingKeywordRegisterModal from "@/components/keywords/tracking-keyword-register-modal"

export interface PostingDetail {
  id: number
  title: string
  client: string
  blogUrl: string
  registeredDate: string
  currentRank: number
  category: "신규" | "재작업"
  manager: string
  teamName: string
  rankings: Ranking[]
  lastChecked: string
}

export interface KeywordData {
  keyword: string
  totalPostings: number
  reworkCount: number
  top5Rate: number
  top1Rate: number
  competitionLevel: "아주좋음" | "좋음" | "보통" | "나쁨" | "아주나쁨"
  averageRank: number
  bestRank: number
  worstRank: number
  clients: string[]
  primaryClient?: string
  isTrackingActive?: boolean
  postingDetails: PostingDetail[]
  rankingHistory: { date: string; rank: number; searchVolume: number; monthlyPosts: number }[]
  monthlySearchVolume: number
  monthlyPostVolume: number
  blogSaturation: number
  isTarget?: boolean
}

export interface Ranking {
  keyword: string
  rank: number
  change: number
  history: { date: string; rank: number }[]
}

export default function KeywordStatus() {
  const { toast } = useToast()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompetition, setSelectedCompetition] = useState("all")
  const [selectedClient, setSelectedClient] = useState("all")
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("1년")
  const [activeFilter, setActiveFilter] = useState("전체")
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const itemsPerPage = 15
  const router = useRouter()
  const searchParams = useSearchParams()

  // 포스팅현황 데이터를 기반으로 키워드 데이터 생성 (30개)
  const [keywordData, setKeywordData] = useState<KeywordData[]>([])
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [trackingModalInitialKeywords, setTrackingModalInitialKeywords] = useState<string[]>([])
  const [trackingModalInitialClients, setTrackingModalInitialClients] = useState<string[]>([])

  const normalizedKeywordData = useMemo(() => {
    return keywordData.flatMap((item) => {
      if (!item.clients || item.clients.length === 0) {
        return [
          {
            ...item,
            primaryClient: undefined,
            isTrackingActive: item.isTrackingActive,
            clients: [],
            postingDetails: (item.postingDetails || []).slice(),
          },
        ]
      }

      return item.clients.map((client) => {
        const details = (item.postingDetails || []).filter((detail) => detail.client === client)
        return {
          ...item,
          primaryClient: client,
          isTrackingActive: item.isTrackingActive,
          clients: [client],
          postingDetails: details.length > 0 ? details : (item.postingDetails || []),
        }
      })
    })
  }, [keywordData])

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

  // 검색 실행
  const handleSearch = () => {
    console.log("검색 실행:", { searchTerm, selectedCompetition, selectedClient })
    setCurrentPage(1)
  }

  // 초기화
  const handleReset = () => {
    setSearchTerm("")
    setSelectedCompetition("all")
    setSelectedClient("all")
    setCurrentPage(1)
  }

  // 클라이언트에서만 데이터 생성 (hydration 에러 방지)
  useEffect(() => {
    // 페이지 로딩 시뮬레이션
    const loadData = async () => {
      setIsPageLoading(true)
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 800))
      const generated = generateKeywordData(30)
      const lockedKeywords = new Set<string>()
      for (const item of generated) {
        if (lockedKeywords.size >= 3) break
        if (!lockedKeywords.has(item.keyword)) {
          lockedKeywords.add(item.keyword)
        }
      }
      const decorated = generated.map((item) => ({
        ...item,
        isTrackingActive: !lockedKeywords.has(item.keyword),
      }))
      setKeywordData(decorated)
      setIsPageLoading(false)
    }
    loadData()
  }, [])



  // URL 파라미터에 따른 초기 필터 설정
  useEffect(() => {
    const filter = searchParams.get("filter")
    if (filter === "rework") {
      setActiveFilter("재작업")
    } else if (filter === "top5") {
      setActiveFilter("5위 안 확률")
    } else if (filter === "excellent") {
      setActiveFilter("우수 키워드")
    } else {
      setActiveFilter("전체")
    }
  }, [searchParams])

  const clients = Array.from(
    new Set(
      normalizedKeywordData
        .flatMap((k) => (k.clients && k.clients.length > 0 ? k.clients : []))
        .filter((client): client is string => Boolean(client))
    )
  )
  const competitionLevels = ["아주좋음", "좋음", "보통", "나쁨", "아주나쁨"]

  const filter = searchParams.get("filter")

  const filteredData = normalizedKeywordData.filter((item) => {
    const matchesSearch =
      item.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.clients.some((client) => client.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCompetition = selectedCompetition === "all" || item.competitionLevel === selectedCompetition
    const matchesClient = selectedClient === "all" || item.clients.includes(selectedClient)

    // 기간 필터 적용
    const matchesDate = (() => {
      if (!startDate || !endDate) return true
      const itemDate = new Date(item.rankingHistory[item.rankingHistory.length - 1]?.date || "")
      const start = new Date(startDate)
      const end = new Date(endDate)
      return itemDate >= start && itemDate <= end
    })()

    // 기간 선택 필터 적용
    const matchesPeriod = (() => {
      if (selectedPeriod === "전체") return true
      const days = selectedPeriod === "7일" ? 7 : selectedPeriod === "30일" ? 30 : selectedPeriod === "3개월" ? 90 : 365
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)
      const itemDate = new Date(item.rankingHistory[item.rankingHistory.length - 1]?.date || "")
      return itemDate >= cutoffDate
    })()

    let matchesFilter = true

    if (filter === "rework") {
      matchesFilter = item.reworkCount > 0
    } else if (filter === "top5") {
      matchesFilter = item.top5Rate >= 80
    } else if (filter === "excellent") {
      matchesFilter = item.competitionLevel === "아주좋음" || item.competitionLevel === "좋음"
    }

    return matchesSearch && matchesCompetition && matchesClient && matchesDate && matchesPeriod && matchesFilter
  }).sort((a, b) => {
    // 타겟 키워드를 상단에 배치
    if (a.isTarget && !b.isTarget) return -1
    if (!a.isTarget && b.isTarget) return 1
    return 0
  })

  // 키워드 목록에서 중복 키워드를 하나로 합치기
  const displayData = filteredData

  // 페이징된 데이터 계산
  const totalPages = Math.ceil(displayData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedData = displayData.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCompetition, selectedClient, startDate, endDate, selectedPeriod])

  const handleViewDetail = (keyword: KeywordData) => {
    setSelectedKeyword(keyword)
    setIsDetailModalOpen(true)
  }

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

  const handleExcelDownload = () => {
    const headers = [
      "키워드",
      "고객사",
      "포스팅횟수",
      "재작업횟수",
      "5위안에포스팅된확률",
      "1위확률",
      "월검색량",
      "월발행량",
      "블로그포화도",
      "경쟁강도",
      "평균순위",
      "최고순위",
      "최저순위",
    ]

    const csvData = displayData.map((item) => [
      item.keyword,
      item.primaryClient || item.clients[0] || "",
      item.totalPostings.toString(),
      item.reworkCount.toString(),
      `${item.top5Rate}%`,
      `${item.top1Rate}%`,
      item.monthlySearchVolume?.toString() || "0",
      item.monthlyPostVolume?.toString() || "0",
      `${item.blogSaturation?.toString() || "0"}%`,
      item.competitionLevel,
      item.averageRank.toString(),
      item.bestRank.toString(),
      item.worstRank.toString(),
    ])

    const csvContent = [headers, ...csvData].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)

    const today = new Date().toISOString().slice(0, 10)
    link.setAttribute("download", `키워드현황_${today}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "다운로드가 완료되었습니다.",
      duration: 2000,
    })
  }

  // 통계 계산
  const totalKeywords = displayData.length
  const totalPostings = displayData.reduce((acc, item) => acc + item.totalPostings, 0)
  const totalReworks = displayData.reduce((acc, item) => acc + item.reworkCount, 0)
  const averageTop5Rate = Math.round(
    displayData.length > 0
      ? displayData.reduce((acc, item) => acc + item.top5Rate, 0) / displayData.length
      : 0,
  )
  const excellentKeywords = displayData.filter(
    (item) => item.competitionLevel === "아주좋음" || item.competitionLevel === "좋음",
  ).length

  // card-status-summary용 상태별 카운트 데이터
  const statusCounts = {
    전체: totalKeywords,
    "총 포스팅": totalPostings,
    재작업: totalReworks,
    "5위 안 확률": averageTop5Rate,
    "우수 키워드": excellentKeywords
  }

  // 부가 설명 텍스트
  const descriptions = {
    전체: "등록된 키워드 수",
    "총 포스팅": "키워드별 포스팅 합계",
    재작업: "재작업한 포스팅",
    "5위 안 확률": "평균 상위 노출 확률",
    "우수 키워드": "좋음 이상 경쟁강도"
  }

  // 차트 데이터
  const competitionData = competitionLevels.map((level) => {
    const filtered = displayData.filter((item) => item.competitionLevel === level)
    const count = filtered.length
    return {
      name: level,
      value: count,
      avgRank: count > 0 
        ? filtered.reduce((acc, item) => acc + item.averageRank, 0) / count 
        : 0,
      color:
        level === "아주좋음"
          ? "#3b82f6"
          : level === "좋음"
            ? "#60a5fa"
            : level === "보통"
              ? "#93c5fd"
              : level === "나쁨"
                ? "#f87171"
                : "#ef4444",
    }
  })

  // 최대값 계산 (데이터가 있는 항목만)
  const maxCompetitionValue = Math.max(
    ...competitionData.filter(d => d.value > 0).map(d => d.value),
    1
  )

  // 성과 분석 데이터
  const performanceData = [
    {
      name: "1위 달성",
      value: displayData.filter((item) => item.bestRank === 1).length,
      total: displayData.length,
      percentage:
        displayData.length > 0
          ? Math.round((displayData.filter((item) => item.bestRank === 1).length / displayData.length) * 100)
          : 0,
    },
    {
      name: "5위 안 진입",
      value: displayData.filter((item) => item.bestRank <= 5).length,
      total: displayData.length,
      percentage:
        displayData.length > 0
          ? Math.round((displayData.filter((item) => item.bestRank <= 5).length / displayData.length) * 100)
          : 0,
    },
    {
      name: "10위 안 진입",
      value: displayData.filter((item) => item.bestRank <= 10).length,
      total: displayData.length,
      percentage:
        displayData.length > 0
          ? Math.round((displayData.filter((item) => item.bestRank <= 10).length / displayData.length) * 100)
          : 0,
    },
    {
      name: "재작업 필요",
      value: displayData.filter((item) => item.reworkCount > 0).length,
      total: displayData.length,
      percentage:
        displayData.length > 0
          ? Math.round((displayData.filter((item) => item.reworkCount > 0).length / displayData.length) * 100)
          : 0,
    },
  ]

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenTrackingModal = (keyword?: string, client?: string) => {
    setTrackingModalInitialKeywords(keyword ? [keyword] : [])
    setTrackingModalInitialClients(client ? [client] : [])
    setIsTrackingModalOpen(true)
  }

  const handleCloseTrackingModal = () => {
    setIsTrackingModalOpen(false)
    setTrackingModalInitialKeywords([])
    setTrackingModalInitialClients([])
  }

  const handleTrackingRegisterSubmit = (keywords: { keyword: string }[]) => {
    toast({
      title: "키워드가 등록되었습니다.",
      description: `${keywords.length}개의 키워드가 추적 목록에 추가되었습니다.`,
      duration: 3000,
    })
    handleCloseTrackingModal()
  }

  // card-status-summary 필터 변경 핸들러
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    
    // URL 파라미터 업데이트
    const params = new URLSearchParams(searchParams.toString())
    
    if (filter === "전체") {
      params.delete("filter")
    } else if (filter === "재작업") {
      params.set("filter", "rework")
    } else if (filter === "5위 안 확률") {
      params.set("filter", "top5")
    } else if (filter === "우수 키워드") {
      params.set("filter", "excellent")
    } else {
      params.delete("filter")
    }
    
    router.push(`/status/keywords?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="키워드현황"
      />

      <div className="flex">
        <Sidebar
          currentPage="status/keywords"
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
              </div>

              {/* 통계 카드 스켈레톤 */}
              <div className="md:hidden">
                <Card className="shadow-none rounded-2xl border">
                  <CardContent className="p-3 space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3">
                        <div className="space-y-1 text-left">
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <div className="space-y-1 text-right">
                          <Skeleton className="h-5 w-16" />
                          <Skeleton className="h-3 w-12 ml-auto" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="py-3 shadow-none rounded-2xl border">
                    <CardContent className="px-4 py-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Skeleton className="h-6 w-12" />
                          <Skeleton className="h-3 w-10" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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

              {/* 차트 스켈레톤 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                  <Card key={i} className="shadow-none rounded-xl border border-gray-200">
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-40 mb-4" />
                      <Skeleton className="h-64 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>

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
                  <div className="flex justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-10 rounded-full" />
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
                <h1 className="text-xl sm:text-2xl font-bold">키워드현황</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">등록된 키워드별 성과와 경쟁강도를 분석합니다</p>
                </div>
              </div>
              
              {/* 버튼 영역 - 항상 표시 */}
              <div className="flex items-center space-x-2 justify-end w-full sm:w-auto">
                {filter && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.delete("filter")
                      router.push(`/status/keywords?${params.toString()}`)
                    }}
                    className="shadow-none rounded-lg text-gray-600 border-gray-300"
                  >
                    <X className="h-4 w-4 mr-1" />
                    필터 해제
                  </Button>
                )}
              </div>
            </div>

            {/* 통계 카드 */}
            <StatusSummaryCards
              statusCounts={statusCounts}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              descriptions={descriptions}
              variant="compact"
              showTrend={true}
            />

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

                    {/* 두 번째 줄: 필터 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 w-full">
                      <span className="text-xs sm:text-sm text-gray-900 md:w-30 flex-shrink-0">필터</span>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full">
                        <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
                          <SelectTrigger className="w-full sm:w-32 shadow-none bg-white text-gray-700 font-normal text-xs">
                            <SelectValue placeholder="경쟁강도" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">전체 경쟁강도</SelectItem>
                            {competitionLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={selectedClient} onValueChange={setSelectedClient}>
                          <SelectTrigger className="w-full sm:w-32 shadow-none bg-white text-gray-700 font-normal text-xs">
                            <SelectValue placeholder="고객사" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">전체 고객사</SelectItem>
                            {clients.map((client) => (
                              <SelectItem key={client} value={client}>
                                {client}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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

            {/* 차트 섹션 */}
            <KeywordsCharts competitionData={competitionData} performanceData={performanceData} maxCompetitionValue={maxCompetitionValue} />

            {/* 키워드 목록 테이블 */}
            <KeywordsTable
              filteredData={displayData}
              paginatedData={paginatedData}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={handlePageChange}
              onViewDetail={handleViewDetail}
              onExcelDownload={handleExcelDownload}
              onLockedClick={handleOpenTrackingModal}
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

            <TrackingKeywordRegisterModal
              isOpen={isTrackingModalOpen}
              onClose={handleCloseTrackingModal}
              onSubmit={handleTrackingRegisterSubmit}
              initialKeywords={trackingModalInitialKeywords}
              initialClients={trackingModalInitialClients}
            />
          </div>
          )}
        </main>
      </div>
    </div>
  )
}
