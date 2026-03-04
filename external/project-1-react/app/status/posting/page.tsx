"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  ExternalLink,
  FileX,
  Download,
  Star,
  MoreVertical,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Lock,
  Info,
} from "lucide-react"
import { showSuccessToast, showErrorToast, showInfoToast } from "@/lib/toast-utils"
import StatusSummaryCards from "@/components/ui/card-status-summary"
import PostingSearchFilter from "@/components/posting-search-filter"
import PostingDetailModal from "@/components/posting-detail-modal"
import PostingEditModal from "@/components/posting-edit-modal"
import PostingDeleteModal from "@/components/posting-delete-modal"
import PostingChartModal from "@/components/posting-chart-modal"
import PostingRegisterModal from "@/components/posting-register-modal"
import TrackingKeywordRegisterModal from "@/components/keywords/tracking-keyword-register-modal"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface RankingHistory {
  date: string
  rank: number
}

interface PostingData {
  id: number
  blogUrl: string
  client: string
  title: string
  keyword: string
  manager: string
  rank: number
  change: number
  history: RankingHistory[]
  registeredDate: string
  lastChecked: string
  teamName: string
  category: "신규" | "재작업"
  contractThreshold: number
  isFavorite?: boolean
  originalPostingId?: number // 재작업한 원본 포스팅 ID
  isTrackingActive?: boolean
}

export default function PostingPage() {
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClient, setSelectedClient] = useState("all")
  const [selectedTeam, setSelectedTeam] = useState("all")
  const [selectedManager, setSelectedManager] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedPeriod, setSelectedPeriod] = useState("전체")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // 카드 선택 상태 추가 (기본값: all)
  const [selectedCard, setSelectedCard] = useState<string>("all")

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false)
  const [trackingModalInitialKeywords, setTrackingModalInitialKeywords] = useState<string[]>([])
  const [trackingModalInitialClients, setTrackingModalInitialClients] = useState<string[]>([])
  const [selectedPosting, setSelectedPosting] = useState<PostingData | null>(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())
  const [selectedKeywordData, setSelectedKeywordData] = useState<{
    keyword: string
    history: RankingHistory[]
    contractThreshold?: number
    isRework?: boolean
    reworkStartDate?: string
  } | null>(null)
  const [editFormData, setEditFormData] = useState({
    postingDate: "",
    title: "",
    category: "신규" as "신규" | "재작업",
    blogUrl: "",
    keyword: "",
    memo: "",
  })

  // 샘플 데이터
  const [postingData, setPostingData] = useState<PostingData[]>([
    {
      id: 1,
      blogUrl: "https://smarttech.blog.com/ai-solution-2024",
      client: "스마트테크",
      title: "2024년 AI 솔루션 트렌드와 전망",
      keyword: "AI 솔루션",
      manager: "김마케터",
      rank: 3,
      change: 2,
      history: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rank: Math.max(1, Math.min(20, 15 - Math.floor(i / 3) + Math.floor(Math.random() * 3))),
      })),
      registeredDate: "2024-01-15",
      lastChecked: "2024-01-20",
      teamName: "디지털마케팅팀",
      category: "신규",
      contractThreshold: 10,
      isFavorite: false,
      isTrackingActive: true,
    },
    {
      id: 2,
      blogUrl: "https://fashionhouse.co.kr/spring-fashion-guide",
      client: "패션하우스",
      title: "2024 봄 패션 트렌드 완벽 가이드",
      keyword: "봄 패션",
      manager: "이디자이너",
      rank: 1,
      change: 1,
      history: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rank: Math.max(1, Math.min(10, 8 - Math.floor(i / 4))),
      })),
      registeredDate: "2024-01-18",
      lastChecked: "2024-01-20",
      teamName: "크리에이티브팀",
      category: "신규",
      contractThreshold: 5,
      isFavorite: true,
      isTrackingActive: true,
    },
    {
      id: 3,
      blogUrl: "https://greenfood.com/organic-recipe-collection",
      client: "그린푸드",
      title: "건강한 유기농 레시피 모음집",
      keyword: "유기농 레시피",
      manager: "박영양사",
      rank: 2,
      change: 0,
      history: Array.from({ length: 25 }, (_, i) => {
        const dayMs = 24 * 60 * 60 * 1000
        const daysAgo = 24 - i
        const rankProgress = Math.floor((i / 24) * 14)
        return {
          date: new Date(Date.now() - daysAgo * dayMs).toISOString().split("T")[0],
          rank: Math.max(2, 16 - rankProgress),
        }
      }),
      registeredDate: "2024-01-12",
      lastChecked: "2024-01-19",
      teamName: "브랜드팀",
      category: "재작업",
      contractThreshold: 8,
      isFavorite: false,
      originalPostingId: 1, // #001을 재작업
      isTrackingActive: true,
    },
    {
      id: 4,
      blogUrl: "https://healthplus.co.kr/wellness-tips",
      client: "헬스케어플러스",
      title: "2024 웰니스 트렌드와 건강 관리법",
      keyword: "웰니스",
      manager: "최기획자",
      rank: 4,
      change: 1,
      history: Array.from({ length: 20 }, (_, i) => ({
        date: new Date(Date.now() - (19 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rank: Math.max(1, Math.min(15, 12 - Math.floor(i / 3))),
      })),
      registeredDate: "2024-01-10",
      lastChecked: "2024-01-15",
      teamName: "전략기획팀",
      category: "신규",
      contractThreshold: 7,
      isFavorite: false,
      isTrackingActive: false,
    },
    {
      id: 5,
      blogUrl: "https://edutech.kr/online-learning-guide",
      client: "에듀테크",
      title: "온라인 학습의 미래와 효과적인 학습법",
      keyword: "온라인 학습",
      manager: "정분석가",
      rank: 15,
      change: -2,
      history: Array.from({ length: 25 }, (_, i) => ({
        date: new Date(Date.now() - (24 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rank: Math.max(10, Math.min(20, 18 - Math.floor(i / 5))),
      })),
      registeredDate: "2024-01-08",
      lastChecked: "2024-01-11",
      teamName: "데이터분석팀",
      category: "재작업",
      contractThreshold: 12,
      isFavorite: true,
      originalPostingId: 4, // #004를 재작업
      isTrackingActive: true,
    },
    {
      id: 6,
      blogUrl: "https://realestate.com/investment-tips",
      client: "부동산투자",
      title: "2024 부동산 투자 전략과 시장 전망",
      keyword: "부동산 투자",
      manager: "김마케터",
      rank: 5,
      change: 2,
      history: Array.from({ length: 20 }, (_, i) => ({
        date: new Date(Date.now() - (19 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rank: Math.max(3, Math.min(12, 10 - Math.floor(i / 4))),
      })),
      registeredDate: "2024-01-05",
      lastChecked: "2024-01-08",
      teamName: "디지털마케팅팀",
      category: "신규",
      contractThreshold: 10,
      isFavorite: false,
      isTrackingActive: false,
    },
    {
      id: 7,
      blogUrl: "https://travelguide.kr/jeju-hidden-spots",
      client: "여행가이드",
      title: "제주도 숨은 명소 완벽 가이드",
      keyword: "제주도 여행",
      manager: "이디자이너",
      rank: 2,
      change: 1,
      history: Array.from({ length: 18 }, (_, i) => ({
        date: new Date(Date.now() - (17 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rank: Math.max(1, Math.min(8, 6 - Math.floor(i / 3))),
      })),
      registeredDate: "2024-01-14",
      lastChecked: "2024-01-17",
      teamName: "크리에이티브팀",
      category: "신규",
      contractThreshold: 5,
      isFavorite: false,
      isTrackingActive: false,
    },
    {
      id: 8,
      blogUrl: "https://beautytrend.kr/skincare-routine",
      client: "뷰티트렌드",
      title: "겨울철 피부관리 루틴 완벽 가이드",
      keyword: "피부관리",
      manager: "김마케터",
      rank: 4,
      change: 2,
      history: Array.from({ length: 22 }, (_, i) => ({
        date: new Date(Date.now() - (21 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rank: Math.max(2, Math.min(10, 8 - Math.floor(i / 4))),
      })),
      registeredDate: "2024-01-13",
      lastChecked: "2024-01-16",
      teamName: "디지털마케팅팀",
      category: "신규",
      contractThreshold: 10,
      isFavorite: false,
      isTrackingActive: false,
    },
  ])

  const clients = [...new Set(postingData.map((p) => p.client))]
  const teams = [...new Set(postingData.map((p) => p.teamName))]
  const managers = [...new Set(postingData.map((p) => p.manager))]

  // 상태별 카운트 데이터 생성
  const statusCounts = useMemo(() => ({
    전체: postingData.length,
    재작업: postingData.filter(item => item.rank > item.contractThreshold).length,
    유효: postingData.filter(item => item.rank <= item.contractThreshold).length,
    "5위 안": postingData.filter(item => item.rank <= 5).length,
    평균: Math.round(postingData.reduce((sum, item) => sum + item.rank, 0) / postingData.length) || 0
  }), [postingData])

  // StatusSummaryCards용 필터 핸들러
  const handleFilterChange = (filter: string) => {
    setSelectedCard(filter)
  }

  // 즐겨찾기 토글 핸들러
  const toggleFavorite = (id: number) => {
    setPostingData(
      postingData.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    )
  }

const filteredData = postingData.filter((item) => {
  const normalizedSearch = searchTerm.trim().toLowerCase()
  const numericSearch = normalizedSearch.replace(/[^0-9]/g, "")
  const formattedId = `#${item.id.toString().padStart(3, "0")}`.toLowerCase()

  const matchesSearch =
    normalizedSearch === "" ||
    item.title.toLowerCase().includes(normalizedSearch) ||
    item.client.toLowerCase().includes(normalizedSearch) ||
    item.keyword.toLowerCase().includes(normalizedSearch) ||
    formattedId.includes(normalizedSearch) ||
    (numericSearch !== "" && item.id.toString().includes(numericSearch))

    const matchesClient = selectedClient === "all" || item.client === selectedClient
    const matchesTeam = selectedTeam === "all" || item.teamName === selectedTeam
    const matchesManager = selectedManager === "all" || item.manager === selectedManager

    // 날짜 범위 필터
    const registeredDate = new Date(item.registeredDate)
    const startDateFilter = startDate ? new Date(startDate) : null
    const endDateFilter = endDate ? new Date(endDate) : null

    const matchesDateRange =
      (!startDateFilter || registeredDate >= startDateFilter) && (!endDateFilter || registeredDate <= endDateFilter)

    // 카드 필터링 로직
    let matchesCard = true
    if (selectedCard !== "all") {
      switch (selectedCard) {
        case "전체":
          matchesCard = true // 전체 포스팅
          break
        case "재작업":
          matchesCard = item.rank > item.contractThreshold
          break
        case "유효":
          matchesCard = item.rank <= item.contractThreshold
          break
        case "5위 안":
          matchesCard = item.rank <= 5
          break
        case "평균":
          matchesCard = true // 평균은 전체
          break
      }
    }

    return matchesSearch && matchesClient && matchesTeam && matchesManager && matchesDateRange && matchesCard
  }).sort((a, b) => {
    // 즐겨찾기가 먼저 오도록 정렬
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return 0
  })

  // 포스팅 그룹화: 재작업 체인을 그룹으로 묶기
  const groupedPostings = useMemo(() => {
    const groups: { [key: number]: PostingData[] } = {}
    const processed = new Set<number>()
    
    // 재작업 체인의 최신 포스팅을 찾아서 그룹화
    filteredData.forEach((posting) => {
      if (processed.has(posting.id)) return
      
      // 재작업 체인 추적: 원본부터 최신까지
      const chain: PostingData[] = []
      
      // 원본 포스팅 찾기 (originalPostingId가 없는 포스팅까지 거슬러 올라가기)
      let rootPosting: PostingData = posting
      while (rootPosting.originalPostingId) {
        const original = filteredData.find(p => p.id === rootPosting.originalPostingId)
        if (original) {
          rootPosting = original
        } else {
          break
        }
      }
      
      // 원본부터 시작해서 최신까지 체인 구성
      let current: PostingData | undefined = rootPosting
      while (current) {
        chain.push(current)
        processed.add(current.id)
        
        // 이 포스팅을 원본으로 하는 다음 포스팅 찾기
        const nextPosting = filteredData.find(p => p.originalPostingId === current!.id)
        if (nextPosting) {
          current = nextPosting
        } else {
          break
        }
      }
      
      // 최신 포스팅 ID를 그룹 키로 사용
      const latestPosting = chain[chain.length - 1]
      groups[latestPosting.id] = chain
    })
    
    return groups
  }, [filteredData])
  
  const sortedGroupEntries = useMemo(() => {
    return Object.entries(groupedPostings).sort((a, b) => {
      const aLatest = a[1][a[1].length - 1]
      const bLatest = b[1][b[1].length - 1]

      if (aLatest.isFavorite && !bLatest.isFavorite) return -1
      if (!aLatest.isFavorite && bLatest.isFavorite) return 1

      const aDate = new Date(aLatest.registeredDate).getTime()
      const bDate = new Date(bLatest.registeredDate).getTime()

      if (bDate !== aDate) {
        return bDate - aDate
      }

      return bLatest.id - aLatest.id
    })
  }, [groupedPostings])

  // 그룹화된 포스팅을 평탄화하여 페이지네이션
  const flattenedPostings = useMemo(() => {
    return sortedGroupEntries.flatMap(([, group]) => group)
  }, [sortedGroupEntries])

  const handleExcelDownload = async () => {
    const XLSX = await import("xlsx")

    const rows: Record<string, string>[] = []

    sortedGroupEntries.forEach(([groupId, group]) => {
      const latest = group[group.length - 1]
      const previous = group.slice(0, -1)
      const groupLabel = `#${groupId.padStart(3, "0")}`

      rows.push({
        그룹: groupLabel,
        구분: "최신",
        번호: `#${latest.id.toString().padStart(3, "0")}`,
        회사명: latest.client,
        제목: latest.title,
        키워드: latest.keyword,
        "현재 순위": latest.isTrackingActive ? `${latest.rank}위` : "",
        "순위 변동": latest.isTrackingActive
          ? `${latest.change > 0 ? "+" : ""}${latest.change}`
          : "",
        담당자: `${latest.manager} (${latest.teamName})`,
        등록일: latest.registeredDate,
        "계약 기간": `${latest.registeredDate.replace(/-/g, ".")} ~ ${latest.lastChecked.replace(/-/g, ".")}`,
        "포스팅 일자": latest.registeredDate,
        카테고리: latest.category,
      })

      previous.forEach((item) => {
        rows.push({
          그룹: groupLabel,
          구분: "이전",
          번호: `#${item.id.toString().padStart(3, "0")}`,
          회사명: "",
          제목: item.title,
          키워드: "",
          "현재 순위": "",
          "순위 변동": "",
          담당자: "",
          등록일: item.registeredDate,
          "계약 기간": `${item.registeredDate.replace(/-/g, ".")} ~ ${item.lastChecked.replace(/-/g, ".")}`,
          "포스팅 일자": item.registeredDate,
          카테고리: item.category,
        })
      })

      rows.push({})
    })

    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "포스팅현황")

    const excelArray = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelArray], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "posting_status.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const totalGroups = sortedGroupEntries.length
  
  const totalPages = Math.ceil(totalGroups / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedGroups = sortedGroupEntries.slice(startIndex, startIndex + itemsPerPage)
  
  const toggleGroup = (groupId: number) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedClient, selectedTeam, selectedManager, startDate, endDate, itemsPerPage])

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownIndex(null)
      }
    }

    if (openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside)
    }
  }, [openDropdownIndex])

  // 페이지 초기 로딩 시뮬레이션
  useEffect(() => {
    setIsPageLoading(true)
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsPageLoading(false)
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // 빠른 기간 선택 핸들러
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    const today = new Date()
    let start: Date | null = null
    let end: Date | null = null

    switch (period) {
      case "오늘":
        start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        break
      case "1주일":
        end = today
        start = new Date()
        start.setDate(end.getDate() - 7)
        break
      case "1개월":
        end = today
        start = new Date()
        start.setMonth(end.getMonth() - 1)
        break
      case "3개월":
        end = today
        start = new Date()
        start.setMonth(end.getMonth() - 3)
        break
      case "6개월":
        end = today
        start = new Date()
        start.setMonth(end.getMonth() - 6)
        break
      case "1년":
        end = today
        start = new Date()
        start.setFullYear(end.getFullYear() - 1)
        break
      case "전체":
        start = null
        end = null
        break
    }
    setStartDate(start)
    setEndDate(end)
  }

  const getRankingBadge = (rank: number) => {
    if (rank <= 3) return "bg-green-100 text-green-800 border-green-500"
    if (rank <= 10) return "bg-yellow-100 text-yellow-800 border-yellow-500"
    return "bg-red-100 text-red-800 border-red-500"
  }

  const getRankingChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-green-600" />
    if (change < 0) return <TrendingDown className="h-3 w-3 text-red-600" />
    return <Minus className="h-3 w-3 text-gray-400" />
  }

  const handleRankingClick = (posting: PostingData) => {
    const isRework = posting.category === "재작업" || !!posting.originalPostingId

    setSelectedKeywordData({
      keyword: posting.keyword,
      history: posting.history,
      contractThreshold: posting.contractThreshold,
      isRework,
      reworkStartDate: isRework ? posting.registeredDate : undefined,
    })
    setIsChartDialogOpen(true)
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
    showSuccessToast(`${keywords.length}개의 키워드가 추적 목록에 추가되었습니다.`)
    handleCloseTrackingModal()
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
    const baseClasses = "h-6 w-[34px] text-[11px]"
    const largeClasses = "h-6 w-[34px] text-xs"
    return (
      <button
        type="button"
        onClick={() => {
          if (onClick) {
            onClick()
          } else {
            handleOpenTrackingModal()
          }
        }}
        className={`inline-flex items-center justify-center gap-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition-colors shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35)] font-medium ${size === "sm" ? baseClasses : largeClasses}`}
        aria-label={ariaLabel}
        title="추적 키워드를 등록하면 확인할 수 있어요"
      >
        <Lock className="h-3 w-3" />
      </button>
    )
  }

  const MetricHeaderWithTooltip = ({ label }: { label: string }) => (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex items-center gap-1 cursor-help select-none">
            <span>{label}</span>
            <Info className="h-3.5 w-3.5 text-gray-400" />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          sideOffset={6}
          className="bg-white text-gray-700 border border-gray-200 shadow-lg rounded-md px-3 py-2"
        >
          <p className="text-xs font-semibold text-gray-900">추적 키워드 등록 필요</p>
          <p className="text-[11px] text-gray-600 mt-1 whitespace-nowrap">
            추적 키워드를 등록하면 현재순위/ 순위 현황를 확인할 수 있어요.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  const handleViewDetail = (posting: PostingData) => {
    setSelectedPosting(posting)
    setIsDetailDialogOpen(true)
  }

  const handleEdit = (posting: PostingData) => {
    setSelectedPosting(posting)
    setEditFormData({
      postingDate: posting.registeredDate,
      title: posting.title,
      category: posting.category,
      blogUrl: posting.blogUrl,
      keyword: posting.keyword,
      memo: "",
    })
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setPostingData(
      postingData.map((p) => {
        if (p.id === selectedPosting?.id) {
          return {
            ...p,
            title: editFormData.title,
            blogUrl: editFormData.blogUrl,
            registeredDate: editFormData.postingDate,
            category: editFormData.category,
            keyword: editFormData.keyword,
          }
        }
        return p
      })
    )

    setIsEditDialogOpen(false)
    setSelectedPosting(null)
    showSuccessToast("포스팅이 수정되었습니다")
  }

  const handleDelete = (posting: PostingData) => {
    setSelectedPosting(posting)
    setIsDeleteDialogOpen(true)
  }

  const handleRepost = (posting: PostingData) => {
    setSelectedPosting(posting)
    setIsAddModalOpen(true)
  }

  const confirmDelete = () => {
    if (selectedPosting) {
      setPostingData(postingData.filter((p) => p.id !== selectedPosting.id))
      setIsDeleteDialogOpen(false)
      setSelectedPosting(null)
      showSuccessToast("포스팅이 삭제되었습니다")
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      showSuccessToast("링크가 복사되었습니다")
    } catch (err) {
      console.error("복사 실패:", err)
      showErrorToast("링크 복사에 실패했습니다")
    }
  }


  const handlePostingSubmit = (data: any) => {
    // 재작업인 경우 originalPostingId 설정
    const originalPostingId = data.category === "재작업" && selectedPosting ? selectedPosting.id : undefined
    
    const newPosting: PostingData = {
      id: Math.max(...postingData.map(p => p.id)) + 1,
      blogUrl: data.blogUrl,
      client: data.clientName,
      title: data.title,
      keyword: data.targetKeyword,
      manager: data.manager,
      rank: Math.floor(Math.random() * 20) + 1, // 임시 랜덤 순위
      change: Math.floor(Math.random() * 10) - 5, // 임시 랜덤 변동
      history: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        rank: Math.max(1, Math.min(20, 15 - Math.floor(i / 3) + Math.floor(Math.random() * 3))),
      })),
      registeredDate: data.postingDate,
      lastChecked: new Date().toISOString().split("T")[0],
      teamName: data.teamName,
      category: data.category,
      contractThreshold: parseInt(data.requiredRanking) || 10,
      isFavorite: false,
      originalPostingId: originalPostingId,
    }

    setPostingData([newPosting, ...postingData])
    
    // 업무 목록에 키워드 자동 추가
    try {
      const storedWorkTasks = localStorage.getItem('workTasks')
      let workTasks: any[] = storedWorkTasks ? JSON.parse(storedWorkTasks) : []
      
      // 해당 계약번호의 업무 찾기
      const targetWorkTask = workTasks.find(
        (task: any) => task.contractNumber === data.contractNumber
      )
      
      if (targetWorkTask && data.targetKeyword) {
        const newKeyword = data.targetKeyword.trim()
        const existingKeywords = targetWorkTask.targetKeywords 
          ? targetWorkTask.targetKeywords.split(',').map((k: string) => k.trim())
          : []
        
        // 키워드가 이미 존재하지 않으면 추가
        if (!existingKeywords.includes(newKeyword)) {
          // targetKeywords에 추가
          const updatedKeywords = [...existingKeywords, newKeyword].join(', ')
          targetWorkTask.targetKeywords = updatedKeywords
          
          // keywordAssignments에 추가
          const keywordAssignments = targetWorkTask.keywordAssignments || []
          const newKeywordId = `k${Date.now()}`
          const newKeywordAssignment = {
            id: newKeywordId,
            keyword: newKeyword,
            teamName: data.teamName || targetWorkTask.teamName || '',
            assignee: data.manager || targetWorkTask.assignee || '',
            rankLimit: parseInt(data.requiredRanking) || targetWorkTask.keywordRankLimit || 10,
            isTargetKeyword: data.isTargetKeyword !== undefined ? data.isTargetKeyword : true
          }
          
          targetWorkTask.keywordAssignments = [...keywordAssignments, newKeywordAssignment]
          
          // 업데이트된 업무 목록을 로컬스토리지에 저장
          const updatedWorkTasks = workTasks.map((task: any) =>
            task.contractNumber === data.contractNumber ? targetWorkTask : task
          )
          localStorage.setItem('workTasks', JSON.stringify(updatedWorkTasks))
        }
      }
    } catch (error) {
      console.error('업무 목록 업데이트 중 오류:', error)
    }
    
    showSuccessToast("포스팅이 등록되었습니다")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="포스팅현황"
      />

      <div className="flex">
        <Sidebar
          currentPage="status/posting"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6 min-w-0">
          {isPageLoading ? (
            <>
              {/* 페이지 헤더 스켈레톤 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                <div className="hidden sm:block space-y-2">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
                  <Skeleton className="h-10 w-full sm:w-32" />
                </div>
              </div>

              {/* 요약 카드 스켈레톤 */}
              <div className="md:hidden">
                <Card className="shadow-none rounded-2xl border">
                  <CardContent className="p-3 space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3">
                        <div className="space-y-1 text-left">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-20" />
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
                          <Skeleton className="h-6 w-12" />
                          <Skeleton className="h-3 w-10" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 검색 및 필터 스켈레톤 */}
              <Card className="shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                  </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 포스팅 목록 헤더 스켈레톤 */}
              <div className="flex flex-col gap-3 mb-2 sm:mb-4 mt-6 sm:mt-8 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 w-full">
                  <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>

              {/* 테이블 스켈레톤 */}
              <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden w-full">
                <div className="overflow-x-auto w-full">
                  <div className="min-w-full">
                    {/* 테이블 헤더 스켈레톤 */}
                    <div className="bg-gray-100 border-b border-gray-200 px-4 py-3">
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                  </div>
                    </div>
                    {/* 테이블 행 스켈레톤 */}
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="border-b border-gray-100 px-4 py-4">
                        <div className="flex gap-4 items-center">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
            {/* 타이틀 영역 - 모바일에서는 숨김 */}
            <div className="flex-shrink-0 hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold">포스팅현황</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">고객별 블로그 포스팅과 키워드 노출 순위를 관리합니다</p>
              </div>
            
            {/* 버튼 영역 - 항상 표시 */}
            <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground shadow-none rounded-lg"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                새 포스팅 등록
              </Button>
            </div>
            </div>

          {/* 요약 카드 */}
          <StatusSummaryCards
            statusCounts={statusCounts}
            activeFilter={selectedCard}
            onFilterChange={handleFilterChange}
          />

          {/* 검색 및 필터 */}
          <PostingSearchFilter
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            selectedClient={selectedClient}
            onClientChange={setSelectedClient}
            selectedTeam={selectedTeam}
            onTeamChange={setSelectedTeam}
            selectedManager={selectedManager}
            onManagerChange={setSelectedManager}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            clients={clients}
            teams={teams}
            managers={managers}
          />

          {/* 포스팅 목록 */}
          <div className="flex flex-col gap-3 mb-2 sm:mb-4 mt-6 sm:mt-8 w-full">
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-3 w-full">
              <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold whitespace-nowrap">
                  포스팅 목록 <span className="text-xs sm:text-sm text-blue-600 font-normal">({totalGroups}개)</span>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger className="h-8 w-[88px] text-xs">
                    <SelectValue placeholder="10개" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10개씩</SelectItem>
                    <SelectItem value="15">15개씩</SelectItem>
                    <SelectItem value="30">30개씩</SelectItem>
                    <SelectItem value="50">50개씩</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={handleExcelDownload}
                  className="text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs h-8 px-3 flex-shrink-0 shadow-none"
                >
                  <img src="/icons/icon-excel.png" alt="Excel" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  엑셀 다운로드
                </Button>
              </div>
            </div>
          </div>

          {/* 모바일 카드 뷰 */}
          <div className="block lg:hidden space-y-3 sm:space-y-4 w-full">
            {isLoading ? (
              // 🎨 로딩 중일 때 스켈레톤 표시
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={`skeleton-mobile-${index}`} className="shadow-none rounded-xl border border-gray-200">
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
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : paginatedGroups.length === 0 ? (
              <Card className="shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <FileX className="h-12 w-12 text-slate-300" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-slate-900">데이터가 없습니다</h3>
                      <p className="text-sm text-slate-500">
                        {searchTerm || selectedClient !== "all"
                          ? "검색 조건에 맞는 포스팅이 없습니다."
                          : "등록된 포스팅이 없습니다. 새 포스팅을 등록해주세요."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              paginatedGroups.map(([groupId, group]) => {
                const latestPosting = group[group.length - 1] // 최신 포스팅
                const previousPostings = group.slice(0, -1) // 이전 포스팅들
                const isExpanded = expandedGroups.has(Number(groupId))
                const hasReworkHistory = previousPostings.length > 0
                
                return (
                  <div key={groupId} className="space-y-2">
                    {/* 최신 포스팅 카드 */}
                    <Card className="shadow-none rounded-xl border border-gray-200">
                      <CardContent className="p-4 space-y-4">
                        {/* 헤더 */}
                        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleFavorite(latestPosting.id)
                                  }}
                                  className="flex-shrink-0 hover:scale-110 transition-transform"
                                  title={latestPosting.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      latestPosting.isFavorite
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300 hover:text-yellow-400"
                                    }`}
                                  />
                                </button>
                                <div className="text-sm font-semibold text-gray-900">#{latestPosting.id.toString().padStart(3, "0")}</div>
                                {hasReworkHistory && (
                                  <button
                                    onClick={() => toggleGroup(Number(groupId))}
                                    className="flex-shrink-0 mt-1 text-gray-500 hover:text-gray-700 transition-colors"
                                    title={isExpanded ? "접기" : "펼치기"}
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-5 w-5" />
                                    ) : (
                                      <ChevronDown className="h-5 w-5" />
                                    )}
                                  </button>
                                )}
                                {hasReworkHistory && (
                                  <Badge variant="outline" className="text-xs border-green-300 text-green-600">
                                    재작업 {previousPostings.length}회
                                  </Badge>
                                )}
                              </div>
                              <Badge variant="outline" className="border-slate-300 text-xs">
                                {latestPosting.client}
                              </Badge>
                            </div>
                          </div>
                          <div className="relative" ref={openDropdownIndex === latestPosting.id ? dropdownRef : null}>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenDropdownIndex(openDropdownIndex === latestPosting.id ? null : latestPosting.id)
                              }}
                            >
                              <MoreVertical className="size-[15px]" />
                            </Button>
                            
                            {openDropdownIndex === latestPosting.id && (
                              <div className="absolute right-0 top-9 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewDetail(latestPosting)
                                    setOpenDropdownIndex(null)
                                  }}
                                  onTouchStart={(e) => {
                                    e.stopPropagation()
                                    handleViewDetail(latestPosting)
                                    setOpenDropdownIndex(null)
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-gray-700 active:bg-gray-100"
                                >
                                  <Eye className="h-4 w-4" />
                                  상세보기
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(latestPosting)
                                    setOpenDropdownIndex(null)
                                  }}
                                  onTouchStart={(e) => {
                                    e.stopPropagation()
                                    handleEdit(latestPosting)
                                    setOpenDropdownIndex(null)
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-blue-600 active:bg-gray-100"
                                >
                                  <Edit className="h-4 w-4" />
                                  수정
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRepost(latestPosting)
                                    setOpenDropdownIndex(null)
                                  }}
                                  onTouchStart={(e) => {
                                    e.stopPropagation()
                                    handleRepost(latestPosting)
                                    setOpenDropdownIndex(null)
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-green-600 active:bg-gray-100"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  재작업
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(latestPosting)
                                    setOpenDropdownIndex(null)
                                  }}
                                  onTouchStart={(e) => {
                                    e.stopPropagation()
                                    handleDelete(latestPosting)
                                    setOpenDropdownIndex(null)
                                  }}
                                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-red-600 active:bg-gray-100"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* 포스팅 정보 */}
                        <div className="space-y-2">
                          <div className="text-xs text-gray-500">포스팅 정보</div>
                          <div className="text-sm font-semibold text-gray-900">{latestPosting.title}</div>
                          <div className="flex items-center gap-2 text-xs">
                            <a
                              href={latestPosting.blogUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate max-w-[200px]"
                              title={latestPosting.blogUrl}
                            >
                              {latestPosting.blogUrl}
                            </a>
                            <button
                              onClick={() => copyToClipboard(latestPosting.blogUrl)}
                              className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                              title="URL 복사"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <a
                              href={latestPosting.blogUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="새 탭에서 열기"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                        
                        {/* 키워드 및 순위 (최종 버전만 표시) */}
                        <div className="space-y-1 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500">키워드 및 순위</div>
                          <div className="flex flex-col gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {latestPosting.keyword}
                            </Badge>
                            {latestPosting.isTrackingActive ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Badge
                                      className={`${getRankingBadge(latestPosting.rank)} border cursor-pointer hover:opacity-80 text-xs`}
                                      onClick={() => handleRankingClick(latestPosting)}
                                    >
                                      {latestPosting.rank}위
                                    </Badge>
                                    {latestPosting.rank > latestPosting.contractThreshold && (
                                      <div
                                        className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                        title={`재작업 필요 (${latestPosting.contractThreshold}위 초과)`}
                                      />
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  {latestPosting.change !== 0 ? (
                                    <>
                                      {getRankingChangeIcon(latestPosting.change)}
                                      <span className="font-medium text-gray-600">{latestPosting.change > 0 ? '+' : ''}{latestPosting.change}</span>
                                    </>
                                  ) : (
                                    <span className="text-gray-400">-</span>
                                  )}
                                </div>
                              </div>
                            ) : (
                                  <div className="flex flex-col items-start gap-1">
                                <LockedMetricButton
                                  ariaLabel={`${latestPosting.title}의 순위 정보를 확인하려면 추적 키워드를 등록하세요`}
                                  onClick={() => handleOpenTrackingModal(latestPosting.keyword, latestPosting.client)}
                                />
                                    <span className="text-[11px] text-gray-500">
                                      추적 키워드를 등록하면 순위를 바로 확인할 수 있어요
                                    </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* 담당자 정보 */}
                        <div className="space-y-1 pt-3 border-t border-gray-100">
                          <div className="text-xs text-gray-500">담당자</div>
                          <div className="text-sm font-medium text-gray-900">{latestPosting.manager}</div>
                          <div className="text-sm text-gray-500">({latestPosting.teamName})</div>
                        </div>
                        
                        {/* 날짜 정보 */}
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">등록일</div>
                            <div className="text-sm text-gray-500">{latestPosting.registeredDate}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-500">계약기간</div>
                            <div className="text-sm text-gray-500">
                              {latestPosting.registeredDate.replace(/-/g, '.')} ~ {latestPosting.lastChecked.replace(/-/g, '.')}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* 이전 포스팅들 (아코디언) */}
                    {isExpanded && hasReworkHistory && (
                      <div className="space-y-2 pl-2 border-l-2 border-gray-300">
                        {previousPostings.map((item, index) => (
                <Card key={item.id} className="shadow-none rounded-lg border border-gray-200 bg-gray-50/50">
                  <CardContent className="p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-600">#{item.id.toString().padStart(3, "0")}</div>
                        <div className="text-sm text-gray-600 truncate">{item.title}</div>
                      </div>
                      <div className="relative flex-shrink-0" ref={openDropdownIndex === item.id ? dropdownRef : null}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDropdownIndex(openDropdownIndex === item.id ? null : item.id)
                          }}
                        >
                          <MoreVertical className="size-[14px]" />
                        </Button>
                        
                        {openDropdownIndex === item.id && (
                          <div className="absolute right-0 top-8 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewDetail(item)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                handleViewDetail(item)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-gray-700 active:bg-gray-100"
                            >
                              <Eye className="h-4 w-4" />
                              상세보기
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(item)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                handleEdit(item)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-blue-600 active:bg-gray-100"
                            >
                              <Edit className="h-4 w-4" />
                              수정
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRepost(item)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                handleRepost(item)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-green-600 active:bg-gray-100"
                            >
                              <RotateCcw className="h-4 w-4" />
                              재작업
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDelete(item)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                handleDelete(item)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-red-600 active:bg-gray-100"
                            >
                              <Trash2 className="h-4 w-4" />
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <a
                        href={item.blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate max-w-[160px]"
                        title={item.blogUrl}
                      >
                        {item.blogUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(item.blogUrl)}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                        title="URL 복사"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                      <a
                        href={item.blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                        title="새 탭에서 열기"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="text-xs text-gray-500">등록일 {item.registeredDate}</div>
                    <div className="text-xs text-gray-500">포스팅 일자 {item.registeredDate}</div>
                  </CardContent>
                </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* PC 테이블 뷰 */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-lg w-full">
            <div className="overflow-x-auto w-full">
                  <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow className="!border-b !border-gray-200 py-3">
                    <TableHead className="w-[100px] text-left pl-6 py-4 font-semibold text-gray-700">번호</TableHead>
                    <TableHead className="w-[120px] text-left py-4 font-semibold text-gray-700">회사명</TableHead>
                    <TableHead className="w-[300px] text-left py-4 font-semibold text-gray-700">제목</TableHead>
                    <TableHead className="w-[120px] text-left py-4 font-semibold text-gray-700">키워드</TableHead>
                    <TableHead className="w-[140px] text-center py-4 font-semibold text-gray-700">
                      <MetricHeaderWithTooltip label="현재 순위/순위 변동" />
                    </TableHead>
                    <TableHead className="w-[140px] text-left py-4 font-semibold text-gray-700">담당자(팀명)</TableHead>
                    <TableHead className="w-[100px] text-left py-4 font-semibold text-gray-700">등록일</TableHead>
                    <TableHead className="w-[120px] text-left py-4 font-semibold text-gray-700">계약일자</TableHead>
                    <TableHead className="w-[110px] text-left py-4 font-semibold text-gray-700">포스팅 일자</TableHead>
                    <TableHead className="w-[84px] text-center py-4 px-2 font-semibold text-gray-700">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                    // 🎨 로딩 중일 때 스켈레톤 표시
                        Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`skeleton-${index}`} className="border-b border-gray-100">
                        <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-64" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell className="py-4"><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="py-4 px-2 w-[84px] max-w-[84px]">
                          <div className="flex items-center justify-center gap-1">
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                                <Skeleton className="h-8 w-8" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : paginatedGroups.length === 0 ? (
                        <TableRow>
                      <TableCell colSpan={10} className="h-80">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <div className="w-16 h-16 relative">
                            <Image
                              src="/icons/icon-default.png"
                              alt="포스팅 없음"
                              width={64}
                              height={64}
                              className="object-contain"
                            />
                          </div>
                          <div className="space-y-2 text-center">
                            <h3 className="text-lg font-semibold text-gray-900">데이터가 없습니다</h3>
                            <p className="text-sm text-gray-500">
                                {searchTerm || selectedClient !== "all"
                                  ? "검색 조건에 맞는 포스팅이 없습니다."
                                  : "등록된 포스팅이 없습니다. 새 포스팅을 등록해주세요."}
                              </p>
                          </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedGroups.flatMap(([groupId, group]) => {
                          const latestPosting = group[group.length - 1] // 최신 포스팅
                          const previousPostings = group.slice(0, -1) // 이전 포스팅들
                          const isExpanded = expandedGroups.has(Number(groupId))
                          const hasReworkHistory = previousPostings.length > 0
                          
                          return [
                            // 최신 포스팅 행
                            <TableRow key={latestPosting.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              {/* 번호 */}
                              <TableCell className="pl-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(latestPosting.id)
                                    }}
                                    className="flex-shrink-0 hover:scale-110 transition-transform"
                                    title={latestPosting.isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
                                  >
                                    <Star
                                      className={`w-5 h-5 ${
                                        latestPosting.isFavorite
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300 hover:text-yellow-400"
                                      }`}
                                    />
                                  </button>
                                  <div className="text-sm font-semibold text-gray-900">#{latestPosting.id.toString().padStart(3, "0")}</div>
                                  {hasReworkHistory && (
                                    <button
                                      onClick={() => toggleGroup(Number(groupId))}
                                      className="flex-shrink-0 text-gray-500 hover:text-gray-700 transition-colors"
                                      title={isExpanded ? "접기" : "펼치기"}
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="h-5 w-5" />
                                      ) : (
                                        <ChevronDown className="h-5 w-5" />
                                      )}
                                    </button>
                                  )}
                                  {hasReworkHistory && (
                                    <Badge variant="outline" className="text-xs border-green-300 text-green-600 bg-green-50">
                                      재작업 {previousPostings.length}회
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>

                              {/* 회사명 */}
                              <TableCell className="py-4">
                                <Badge variant="outline" className="border-slate-300 whitespace-nowrap">
                                  {latestPosting.client}
                                </Badge>
                              </TableCell>

                              {/* 제목 */}
                              <TableCell className="py-4">
                                <div className="space-y-1">
                                  <p className="font-medium text-sm text-gray-900">{latestPosting.title}</p>
                                  <div className="flex items-center gap-2 text-xs">
                                    <a
                                      href={latestPosting.blogUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline truncate max-w-[250px]"
                                      title={latestPosting.blogUrl}
                                    >
                                      {latestPosting.blogUrl}
                                    </a>
                                    <button
                                      onClick={() => copyToClipboard(latestPosting.blogUrl)}
                                      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                      title="URL 복사"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </button>
                                    <a
                                      href={latestPosting.blogUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                      title="새 탭에서 열기"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                </div>
                              </TableCell>

                              {/* 키워드 */}
                              <TableCell className="py-4">
                                <Badge variant="secondary" className="whitespace-nowrap">
                                  {latestPosting.keyword}
                                </Badge>
                              </TableCell>

                              {/* 순위 현황 */}
                              <TableCell className="py-4 text-center">
                                {latestPosting.isTrackingActive ? (
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-center gap-1">
                              <Badge
                                      className={`${getRankingBadge(latestPosting.rank)} border cursor-pointer hover:opacity-80 whitespace-nowrap`}
                                      onClick={() => handleRankingClick(latestPosting)}
                                      >
                                        {latestPosting.rank}위
                                      </Badge>
                                      {latestPosting.rank > latestPosting.contractThreshold && (
                                        <div
                                          className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                                          title={`재작업 필요 (${latestPosting.contractThreshold}위 초과)`}
                                        />
                                      )}
                                    </div>
                                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                      {latestPosting.change !== 0 ? (
                                        <>
                                          {getRankingChangeIcon(latestPosting.change)}
                                          <span className="font-medium text-gray-600">
                                            {latestPosting.change > 0 ? '+' : ''}{latestPosting.change}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center gap-2">
                                    <LockedMetricButton
                                      ariaLabel={`${latestPosting.title}의 순위 정보를 확인하려면 추적 키워드를 등록하세요`}
                                      onClick={() => handleOpenTrackingModal(latestPosting.keyword, latestPosting.client)}
                                    />
                                  </div>
                                )}
                              </TableCell>

                              {/* 담당자(팀명) */}
                              <TableCell className="py-4">
                                <div className="space-y-1">
                                  <div className="text-sm font-semibold text-gray-900">{latestPosting.manager}</div>
                                  <div className="text-sm text-gray-500">({latestPosting.teamName})</div>
                                </div>
                              </TableCell>

                              {/* 등록일 */}
                              <TableCell className="py-4">
                                <div className="text-sm text-gray-500">{latestPosting.registeredDate}</div>
                              </TableCell>

                              {/* 계약일자 */}
                              <TableCell className="py-4">
                                <div className="space-y-1">
                                  <div className="text-sm text-gray-900">
                                    {latestPosting.registeredDate.replace(/-/g, '.')}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ~ {latestPosting.lastChecked.replace(/-/g, '.')}
                                  </div>
                                </div>
                              </TableCell>

                              {/* 포스팅 일자 */}
                              <TableCell className="py-4">
                                <div className="text-sm text-gray-500">{latestPosting.registeredDate}</div>
                              </TableCell>

                              {/* 작업 */}
                              <TableCell className="py-4 px-2 w-[84px] max-w-[84px]">
                                <div className="flex items-center justify-center">
                                  <div className="relative" ref={openDropdownIndex === latestPosting.id ? dropdownRef : null}>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setOpenDropdownIndex(openDropdownIndex === latestPosting.id ? null : latestPosting.id)
                                      }}
                                    >
                                      <MoreVertical className="size-[15px]" />
                                    </Button>
                                    
                                    {openDropdownIndex === latestPosting.id && (
                                      <div className="absolute right-0 top-9 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] py-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleViewDetail(latestPosting)
                                            setOpenDropdownIndex(null)
                                          }}
                                          onTouchStart={(e) => {
                                            e.stopPropagation()
                                            handleViewDetail(latestPosting)
                                            setOpenDropdownIndex(null)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-gray-700 active:bg-gray-100"
                                        >
                                          <Eye className="h-4 w-4" />
                                          상세보기
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleEdit(latestPosting)
                                            setOpenDropdownIndex(null)
                                          }}
                                          onTouchStart={(e) => {
                                            e.stopPropagation()
                                            handleEdit(latestPosting)
                                            setOpenDropdownIndex(null)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-blue-600 active:bg-gray-100"
                                        >
                                          <Edit className="h-4 w-4" />
                                          수정
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleRepost(latestPosting)
                                            setOpenDropdownIndex(null)
                                          }}
                                          onTouchStart={(e) => {
                                            e.stopPropagation()
                                            handleRepost(latestPosting)
                                            setOpenDropdownIndex(null)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-green-600 active:bg-gray-100"
                                        >
                                          <RotateCcw className="h-4 w-4" />
                                          재작업
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleDelete(latestPosting)
                                            setOpenDropdownIndex(null)
                                          }}
                                          onTouchStart={(e) => {
                                            e.stopPropagation()
                                            handleDelete(latestPosting)
                                            setOpenDropdownIndex(null)
                                          }}
                                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-red-600 active:bg-gray-100"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          삭제
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>,
                            // 이전 포스팅들 (아코디언)
                            ...(isExpanded && hasReworkHistory ? previousPostings.map((item, index) => (
                              <TableRow key={item.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors bg-gray-50/80">
                                {/* 번호 */}
                                <TableCell className="pl-6 py-3">
                                  <div className="flex items-center gap-2 pl-10">
                                    <div className="text-sm font-semibold text-gray-600">#{item.id.toString().padStart(3, "0")}</div>
                                  </div>
                                </TableCell>

                                {/* 회사명 - 중복 표기 안 함 */}
                                <TableCell className="py-3">
                                  <div className="text-sm text-gray-400">-</div>
                                </TableCell>

                                {/* 제목 */}
                                <TableCell className="py-3">
                                  <div className="space-y-1">
                                    <p className="font-medium text-sm text-gray-600 truncate">{item.title}</p>
                                    <div className="flex items-center gap-1 text-xs">
                                      <a
                                        href={item.blogUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline truncate max-w-[200px]"
                                        title={item.blogUrl}
                                      >
                                        {item.blogUrl}
                                      </a>
                                      <button
                                        onClick={() => copyToClipboard(item.blogUrl)}
                                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                        title="URL 복사"
                                      >
                                        <Copy className="h-3 w-3" />
                                      </button>
                                      <a
                                        href={item.blogUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                        title="새 탭에서 열기"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                      </a>
                                    </div>
                                  </div>
                                </TableCell>

                                {/* 키워드 */}
                                <TableCell className="py-3">
                                  <div className="text-sm text-gray-400">-</div>
                                </TableCell>

                                {/* 순위 현황 (이전 포스팅은 표시 안 함) */}
                                <TableCell className="py-3">
                                  <div className="text-sm text-gray-400">-</div>
                                </TableCell>

                                {/* 담당자(팀명) - 중복 표기 안 함 */}
                                <TableCell className="py-3">
                                  <div className="text-sm text-gray-400">-</div>
                                </TableCell>

                                {/* 등록일 */}
                                <TableCell className="py-3">
                                  <div className="text-sm text-gray-500">{item.registeredDate}</div>
                                </TableCell>

                                {/* 계약일자 */}
                                <TableCell className="py-3">
                                  <div className="text-sm text-gray-400">-</div>
                                </TableCell>

                                {/* 포스팅 일자 */}
                                <TableCell className="py-3">
                                  <div className="text-sm text-gray-500">{item.registeredDate}</div>
                                </TableCell>

                                {/* 작업 */}
                                <TableCell className="py-3 px-2 w-[84px] max-w-[84px]">
                                  <div className="flex items-center justify-center">
                                    <div className="relative" ref={openDropdownIndex === item.id ? dropdownRef : null}>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          setOpenDropdownIndex(openDropdownIndex === item.id ? null : item.id)
                                        }}
                                      >
                                        <MoreVertical className="size-[14px]" />
                                      </Button>
                                      
                                      {openDropdownIndex === item.id && (
                                        <div className="absolute right-0 top-8 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] py-1">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleViewDetail(item)
                                              setOpenDropdownIndex(null)
                                            }}
                                            onTouchStart={(e) => {
                                              e.stopPropagation()
                                              handleViewDetail(item)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-gray-700 active:bg-gray-100"
                                          >
                                            <Eye className="h-4 w-4" />
                                            상세보기
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleEdit(item)
                                              setOpenDropdownIndex(null)
                                            }}
                                            onTouchStart={(e) => {
                                              e.stopPropagation()
                                              handleEdit(item)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-blue-600 active:bg-gray-100"
                                          >
                                            <Edit className="h-4 w-4" />
                                            수정
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleRepost(item)
                                              setOpenDropdownIndex(null)
                                            }}
                                            onTouchStart={(e) => {
                                              e.stopPropagation()
                                              handleRepost(item)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-green-600 active:bg-gray-100"
                                          >
                                            <RotateCcw className="h-4 w-4" />
                                            재작업
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              handleDelete(item)
                                              setOpenDropdownIndex(null)
                                            }}
                                            onTouchStart={(e) => {
                                              e.stopPropagation()
                                              handleDelete(item)
                                              setOpenDropdownIndex(null)
                                            }}
                                            className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-red-600 active:bg-gray-100"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                            삭제
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            )) : [])
                          ]
                        })
                      )}
                    </TableBody>
                  </Table>
            </div>
                </div>

                {/* 페이지네이션 */}
          {totalGroups > 0 && (
            <div className="mt-4 sm:mt-6 flex items-center justify-center w-full px-2">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* 이전 버튼 */}
                <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-7 h-7 sm:w-[30px] sm:h-[30px] flex items-center justify-center rounded-full border transition-colors ${
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
                <div className="flex items-center gap-1 sm:gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                              onClick={() => setCurrentPage(page)}
                      className={`w-7 h-7 sm:w-[30px] sm:h-[30px] flex items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-colors ${
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
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className={`w-7 h-7 sm:w-[30px] sm:h-[30px] flex items-center justify-center rounded-full border transition-colors ${
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

          {/* 차트 모달 */}
          <TrackingKeywordRegisterModal
            isOpen={isTrackingModalOpen}
            onClose={handleCloseTrackingModal}
            onSubmit={handleTrackingRegisterSubmit}
            initialKeywords={trackingModalInitialKeywords}
            initialClients={trackingModalInitialClients}
          />

          {/* 순위 차트 모달 */}
          <PostingChartModal
            isOpen={isChartDialogOpen}
            onClose={() => setIsChartDialogOpen(false)}
            keyword={selectedKeywordData?.keyword || ""}
            history={selectedKeywordData?.history || []}
            contractThreshold={selectedKeywordData?.contractThreshold}
            reworkStartDate={selectedKeywordData?.reworkStartDate}
          />

          {/* 상세보기 모달 */}
          <PostingDetailModal
            isOpen={isDetailDialogOpen}
            onClose={() => setIsDetailDialogOpen(false)}
            posting={selectedPosting}
            onEdit={handleEdit}
            onCopyUrl={copyToClipboard}
            getRankingBadge={getRankingBadge}
            getRankingChangeIcon={getRankingChangeIcon}
          />

          {/* 수정 모달 */}
          <PostingEditModal
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            posting={selectedPosting}
            editFormData={editFormData}
            onFormDataChange={setEditFormData}
            onSubmit={handleEditSubmit}
          />

          {/* 삭제 확인 모달 */}
          <PostingDeleteModal
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            posting={selectedPosting}
            onConfirm={confirmDelete}
          />

          {/* 포스팅 등록 모달 */}
          <PostingRegisterModal
            isOpen={isAddModalOpen}
            onClose={() => {
              setIsAddModalOpen(false)
              setSelectedPosting(null)
            }}
            onSubmit={handlePostingSubmit}
            postingData={postingData}
            initialPosting={selectedPosting}
          />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

