"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import DataTable, { type Column, type SortOption } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// 공지사항 데이터 타입
interface Notice {
  id: number
  type: string
  typeColor: string
  title: string
  author: string
  registrationDate: string
  viewCount: number
  isPinned: boolean
}

// 공지사항 데이터
const noticeData: Notice[] = [
  {
    id: 1,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "2025년 1월 정기 서버 점검 안내",
    author: "관리자",
    registrationDate: "2025-01-15",
    viewCount: 342,
    isPinned: true,
  },
  {
    id: 2,
    type: "이벤트",
    typeColor: "bg-green-100 text-green-800",
    title: "신규 고객 대상 특별 할인 이벤트",
    author: "마케팅팀",
    registrationDate: "2025-01-14",
    viewCount: 528,
    isPinned: true,
  },
  {
    id: 3,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "새로운 기능 업데이트 안내",
    author: "개발팀",
    registrationDate: "2025-01-10",
    viewCount: 892,
    isPinned: false,
  },
  {
    id: 4,
    type: "업데이트",
    typeColor: "bg-purple-100 text-purple-800",
    title: "모바일 앱 2.0 버전 출시",
    author: "개발팀",
    registrationDate: "2025-01-08",
    viewCount: 671,
    isPinned: false,
  },
  {
    id: 5,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "개인정보처리방침 변경 안내",
    author: "관리자",
    registrationDate: "2025-01-05",
    viewCount: 445,
    isPinned: false,
  },
  {
    id: 6,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "연말연시 고객지원 운영 안내",
    author: "고객지원팀",
    registrationDate: "2024-12-28",
    viewCount: 623,
    isPinned: false,
  },
  {
    id: 7,
    type: "이벤트",
    typeColor: "bg-green-100 text-green-800",
    title: "2024년 연말 감사 이벤트",
    author: "마케팅팀",
    registrationDate: "2024-12-20",
    viewCount: 1204,
    isPinned: false,
  },
  {
    id: 8,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "서비스 이용약관 개정 안내",
    author: "관리자",
    registrationDate: "2024-12-15",
    viewCount: 356,
    isPinned: false,
  },
]

export default function NoticesPage() {
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // 정렬 및 페이지네이션
  const [sortValue, setSortValue] = useState("등록일순")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // 초기 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // 정렬 옵션
  const sortOptions: SortOption[] = [
    { value: "등록일순", label: "등록일순" },
    { value: "제목순", label: "제목순" },
    { value: "조회수순", label: "조회수순" },
  ]

  // 필터링된 공지사항 데이터
  const filteredNotices = noticeData.filter(notice => {
    const matchesSearch = searchTerm === "" ||
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.author.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || notice.type === typeFilter

    return matchesSearch && matchesType
  })

  // 정렬
  const sortedNotices = [...filteredNotices].sort((a, b) => {
    if (sortValue === "등록일순") {
      return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
    } else if (sortValue === "제목순") {
      return a.title.localeCompare(b.title)
    } else if (sortValue === "조회수순") {
      return b.viewCount - a.viewCount
    }
    return 0
  })

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(sortedNotices.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedNotices = sortedNotices.slice(startIndex, startIndex + itemsPerPage)

  // 상세보기 이동
  const handleViewDetail = (noticeId: number) => {
    router.push(`/support/notices/${noticeId}`)
  }

  // 모바일 카드 스켈레톤 - 공지사항 전용
  const renderNoticesMobileCardSkeleton = () => (
    <div
      className="bg-white border-b border-gray-200 py-6"
    >
      <div className="space-y-2">
        {/* 배지 */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-12" />
        </div>
        
        {/* 제목 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        
        {/* 메타 정보 */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  )

  // 컬럼 정의
  const columns: Column<Notice>[] = [
    {
      key: "id",
      label: "번호",
      width: "w-[60px]",
      align: "center",
      render: (notice) => (
        notice.isPinned ? (
          <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 border-0">
            필독
          </Badge>
        ) : (
          <span className="text-sm text-gray-700">{sortedNotices.length - sortedNotices.indexOf(notice)}</span>
        )
      ),
    },
    {
      key: "type",
      label: "유형",
      width: "w-[80px]",
      render: (notice) => (
        <Badge variant="secondary" className={`text-xs ${notice.typeColor} border-0`}>
          {notice.type}
        </Badge>
      ),
    },
    {
      key: "title",
      label: "제목",
      width: "w-[400px]",
      render: (notice) => (
        <div
          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
          onClick={() => handleViewDetail(notice.id)}
          title={notice.title}
        >
          {notice.title}
        </div>
      ),
    },
    {
      key: "author",
      label: "작성자",
      width: "w-[120px]",
      align: "center",
      render: (notice) => (
        <div className="text-sm text-gray-700">{notice.author}</div>
      ),
    },
    {
      key: "registrationDate",
      label: "등록일",
      width: "w-[120px]",
      align: "center",
      render: (notice) => (
        <div className="text-sm text-gray-500">{notice.registrationDate}</div>
      ),
    },
    {
      key: "viewCount",
      label: "조회수",
      width: "w-[100px]",
      align: "center",
      render: (notice) => (
        <div className="text-sm text-gray-700">{notice.viewCount.toLocaleString()}</div>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="공지사항"
      />

      <div className="flex">
        <Sidebar
          currentPage="support/notices"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6 w-full max-w-full">
          <div className="flex flex-col gap-3 sm:gap-4 w-full">
            {/* 타이틀 영역 - 모바일에서는 숨김 */}
            <div className="flex-shrink-0 hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold">공지사항</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                공지사항을 확인하세요.
              </p>
            </div>

          </div>

          {/* 검색 및 필터 - 테이블 위에 배치 */}
          <div className="flex flex-row gap-2 sm:gap-3 w-full mb-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-24 sm:w-32 h-9 bg-white">
                <SelectValue placeholder="유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="공지">공지</SelectItem>
                <SelectItem value="이벤트">이벤트</SelectItem>
                <SelectItem value="업데이트">업데이트</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1 sm:w-80 sm:flex-none">
              <Input
                placeholder="제목 또는 작성자로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9 h-9 bg-white"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            data={paginatedNotices}
            columns={columns}
            totalCount={sortedNotices.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            renderMobileCard={(notice) => (
              <div
                className="bg-white border-b border-gray-200 py-6 cursor-pointer active:bg-gray-50"
                onClick={() => handleViewDetail(notice.id)}
              >
                <div className="space-y-2">
                  {/* 배지 */}
                  <div className="flex items-center gap-2">
                    {notice.isPinned && (
                      <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 border-0">
                        필독
                      </Badge>
                    )}
                    <Badge variant="secondary" className={`text-xs ${notice.typeColor} border-0`}>
                      {notice.type}
                    </Badge>
                  </div>
                  
                  {/* 제목 */}
                  <div className="text-[15px] font-medium text-gray-900 line-clamp-2 leading-snug">
                    {notice.title}
                  </div>
                  
                  {/* 메타 정보 */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>조회 {notice.viewCount.toLocaleString()}</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        {notice.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            mobileCardWrapperClassName="shadow-none rounded-lg border border-gray-200 overflow-hidden px-4"
            isLoading={isLoading}
            skeletonRows={10}
            emptyTitle="공지사항이 없습니다"
            emptyDescription="검색 조건을 변경해보세요."
            renderMobileCardSkeleton={renderNoticesMobileCardSkeleton}
          />
        </main>
      </div>
    </div>
  )
}
