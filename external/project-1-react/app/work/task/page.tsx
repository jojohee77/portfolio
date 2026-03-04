"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CommonSelect } from "@/components/ui/common-select"
import DataTable, { type Column } from "@/components/ui/data-table"
import SearchFilterPanel, { type StatusOption } from "@/components/ui/search-filter-panel"
import WorkRegisterModal from "@/components/work-register-modal"
import WorkStatusDetailModal from "@/components/work-status-detail-modal"
import StatusSummaryCards from "@/components/ui/card-status-summary"
import WorkDeleteModal from "@/components/work-delete-modal"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

interface KeywordAssignment {
  id: string
  keyword: string
  teamName: string
  assignee: string
  rankLimit: number
  isTargetKeyword: boolean
}

interface WorkTask {
  id: string
  contractNumber: string
  serviceType: string
  contractDescription: string
  startDate: string
  endDate: string
  teamName: string
  assignee: string
  targetKeywords: string
  keywordRankLimit: number
  status: "진행중" | "완료" | "대기" | "보류"
  notes: string
  createdAt: string
  keywordAssignments?: KeywordAssignment[]
}

const WorkStatusManagement: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)
  
  // TODO: 설정 > 부서/팀관리에서 등록된 실제 데이터와 연동 필요
  const [departments] = useState([
    {
      id: "dept1",
      name: "마케팅팀",
      members: ["김철수", "이영희", "박민수", "최지영"],
    },
    {
      id: "dept2",
      name: "개발팀",
      members: ["정개발", "한코딩", "임프로", "서버관"],
    },
    {
      id: "dept3",
      name: "디자인팀",
      members: ["김디자인", "이UI", "박UX", "최그래픽"],
    },
    {
      id: "dept4",
      name: "영업팀",
      members: ["강영업", "윤세일즈", "조마케팅", "신비즈"],
    },
    {
      id: "dept5",
      name: "기획팀",
      members: ["홍기획", "양전략", "구분석", "노기획"],
    },
  ])


  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedCard, setSelectedCard] = useState<string>("all") // 카드 필터 전용 상태
  const [dateCriteria, setDateCriteria] = useState("생성일")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("1년")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null)

  const [isStatusDetailModalOpen, setIsStatusDetailModalOpen] = useState(false)
  const [selectedStatusTask, setSelectedStatusTask] = useState<WorkTask | null>(null)

  // Sample posting data connected to work tasks
  const [postingData] = useState([
    {
      workTaskId: "W001",
      keyword: "온라인쇼핑몰",
      assignee: "김마케팅",
      period: "2024-01-15 ~ 2024-06-15",
      postingCount: 15,
      reworkCount: 3,
      validCount: 12,
    },
    {
      workTaskId: "W001",
      keyword: "이커머스",
      assignee: "김마케팅",
      period: "2024-01-15 ~ 2024-06-15",
      postingCount: 12,
      reworkCount: 2,
      validCount: 10,
    },
    {
      workTaskId: "W001",
      keyword: "쇼핑몰제작",
      assignee: "김마케팅",
      period: "2024-01-15 ~ 2024-06-15",
      postingCount: 8,
      reworkCount: 1,
      validCount: 7,
    },
    {
      workTaskId: "W002",
      keyword: "브랜딩",
      assignee: "박콘텐츠",
      period: "2024-02-01 ~ 2024-07-31",
      postingCount: 20,
      reworkCount: 4,
      validCount: 16,
    },
    {
      workTaskId: "W002",
      keyword: "소셜미디어",
      assignee: "박콘텐츠",
      period: "2024-02-01 ~ 2024-07-31",
      postingCount: 18,
      reworkCount: 2,
      validCount: 16,
    },
    {
      workTaskId: "W003",
      keyword: "맛집",
      assignee: "이블로그",
      period: "2024-01-20 ~ 2024-04-20",
      postingCount: 25,
      reworkCount: 1,
      validCount: 24,
    },
  ])

  // 계약 데이터 추가
  const [contracts] = useState([
    {
      contractNumber: "CT-2024-001",
      clientName: "ABC 쇼핑몰",
      serviceType: "SEO 최적화",
      contractDescription: "웹사이트 검색엔진 최적화 및 키워드 상위 노출 서비스",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
    },
    {
      contractNumber: "CT-2024-002",
      clientName: "XYZ 브랜드",
      serviceType: "SNS 마케팅",
      contractDescription: "인스타그램, 페이스북 콘텐츠 제작 및 관리 서비스",
      startDate: "2024-02-01",
      endDate: "2024-07-31",
    },
    {
      contractNumber: "CT-2024-003",
      clientName: "맛집 리뷰 블로그",
      serviceType: "블로그 마케팅",
      contractDescription: "네이버 블로그 포스팅 및 키워드 최적화",
      startDate: "2024-01-20",
      endDate: "2024-04-20",
    },
    {
      contractNumber: "CT-2024-004",
      clientName: "스타트업 A",
      serviceType: "통합 디지털 마케팅",
      contractDescription: "SEO, SNS, 광고 운영 통합 마케팅 서비스",
      startDate: "2024-03-01",
      endDate: "2024-08-31",
    },
    {
      contractNumber: "CT-2024-005",
      clientName: "온라인 교육업체",
      serviceType: "콘텐츠 제작",
      contractDescription: "교육 콘텐츠 제작 및 마케팅 자료 개발",
      startDate: "2024-02-15",
      endDate: "2024-05-15",
    },
  ])

  // 샘플 업무 데이터 (기본값)
  const defaultWorkTasks: WorkTask[] = [
    {
      id: "W001",
      contractNumber: "CT-2024-001",
      serviceType: "SEO 최적화",
      contractDescription: "웹사이트 검색엔진 최적화 및 키워드 상위 노출",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      teamName: "디지털마케팅팀",
      assignee: "김마케팅",
      targetKeywords: "온라인쇼핑몰, 이커머스, 쇼핑몰제작",
      keywordRankLimit: 10,
      status: "진행중",
      notes: "월 2회 리포트 제출 필요. 클라이언트 요청사항: 주간 랭킹 보고서 추가 제공",
      createdAt: "2024-01-10",
      keywordAssignments: [
        { id: "k1", keyword: "온라인쇼핑몰", teamName: "마케팅팀", assignee: "김마케팅", rankLimit: 10, isTargetKeyword: true },
        { id: "k2", keyword: "이커머스", teamName: "마케팅팀", assignee: "김마케팅", rankLimit: 10, isTargetKeyword: true },
        { id: "k3", keyword: "쇼핑몰제작", teamName: "마케팅팀", assignee: "이영희", rankLimit: 15, isTargetKeyword: false },
        { id: "k4", keyword: "온라인판매", teamName: "마케팅팀", assignee: "박민수", rankLimit: 12, isTargetKeyword: false },
        { id: "k5", keyword: "쇼핑몰운영", teamName: "마케팅팀", assignee: "최지영", rankLimit: 8, isTargetKeyword: true },
      ],
    },
    {
      id: "W002",
      contractNumber: "CT-2024-002",
      serviceType: "SNS 마케팅",
      contractDescription: "인스타그램, 페이스북 콘텐츠 제작 및 관리",
      startDate: "2024-02-01",
      endDate: "2024-07-31",
      teamName: "콘텐츠팀",
      assignee: "박콘텐츠",
      targetKeywords: "브랜딩, 소셜미디어, 인플루언서",
      keywordRankLimit: 15,
      status: "진행중",
      notes: "주 3회 포스팅 업로드. 인플루언서 협업 진행 중",
      createdAt: "2024-01-25",
      keywordAssignments: [
        { id: "k6", keyword: "브랜딩", teamName: "콘텐츠팀", assignee: "박콘텐츠", rankLimit: 15, isTargetKeyword: true },
        { id: "k7", keyword: "소셜미디어", teamName: "콘텐츠팀", assignee: "박콘텐츠", rankLimit: 12, isTargetKeyword: false },
        { id: "k8", keyword: "인플루언서", teamName: "콘텐츠팀", assignee: "김디자인", rankLimit: 10, isTargetKeyword: true },
      ],
    },
    {
      id: "W003",
      contractNumber: "CT-2024-003",
      serviceType: "블로그 마케팅",
      contractDescription: "네이버 블로그 포스팅 및 키워드 최적화",
      startDate: "2024-01-20",
      endDate: "2024-04-20",
      teamName: "콘텐츠팀",
      assignee: "이블로그",
      targetKeywords: "맛집, 카페, 리뷰",
      keywordRankLimit: 5,
      status: "완료",
      notes: "고객 만족도 높음. 계약 연장 협의 중",
      createdAt: "2024-01-15",
      keywordAssignments: [
        { id: "k9", keyword: "맛집", teamName: "콘텐츠팀", assignee: "이블로그", rankLimit: 5, isTargetKeyword: true },
        { id: "k10", keyword: "카페", teamName: "콘텐츠팀", assignee: "이블로그", rankLimit: 5, isTargetKeyword: true },
        { id: "k11", keyword: "리뷰", teamName: "콘텐츠팀", assignee: "최지영", rankLimit: 8, isTargetKeyword: false },
        { id: "k12", keyword: "맛집추천", teamName: "콘텐츠팀", assignee: "이블로그", rankLimit: 6, isTargetKeyword: true },
      ],
    },
    {
      id: "W004",
      contractNumber: "CT-2024-004",
      serviceType: "통합 디지털 마케팅",
      contractDescription: "SEO, SNS, 광고 운영 통합 마케팅 서비스",
      startDate: "2024-03-01",
      endDate: "2024-08-31",
      teamName: "마케팅팀",
      assignee: "김마케팅",
      targetKeywords: "스타트업, 창업, 벤처기업",
      keywordRankLimit: 10,
      status: "진행중",
      notes: "광고 예산 월 500만원. 월간 성과 리포트 필수",
      createdAt: "2024-02-20",
      keywordAssignments: [
        { id: "k13", keyword: "스타트업", teamName: "마케팅팀", assignee: "김마케팅", rankLimit: 10, isTargetKeyword: true },
        { id: "k14", keyword: "창업", teamName: "마케팅팀", assignee: "이영희", rankLimit: 12, isTargetKeyword: true },
        { id: "k15", keyword: "벤처기업", teamName: "마케팅팀", assignee: "박민수", rankLimit: 15, isTargetKeyword: false },
        { id: "k16", keyword: "스타트업마케팅", teamName: "마케팅팀", assignee: "김마케팅", rankLimit: 8, isTargetKeyword: true },
        { id: "k17", keyword: "창업지원", teamName: "마케팅팀", assignee: "최지영", rankLimit: 10, isTargetKeyword: false },
      ],
    },
    {
      id: "W005",
      contractNumber: "CT-2024-005",
      serviceType: "콘텐츠 제작",
      contractDescription: "교육 콘텐츠 제작 및 마케팅 자료 개발",
      startDate: "2024-02-15",
      endDate: "2024-05-15",
      teamName: "콘텐츠팀",
      assignee: "박콘텐츠",
      targetKeywords: "온라인교육, 이러닝, 교육플랫폼",
      keywordRankLimit: 12,
      status: "대기",
      notes: "계약 체결 완료, 킥오프 미팅 예정",
      createdAt: "2024-02-10",
      keywordAssignments: [
        { id: "k18", keyword: "온라인교육", teamName: "콘텐츠팀", assignee: "박콘텐츠", rankLimit: 12, isTargetKeyword: true },
        { id: "k19", keyword: "이러닝", teamName: "콘텐츠팀", assignee: "김디자인", rankLimit: 10, isTargetKeyword: false },
        { id: "k20", keyword: "교육플랫폼", teamName: "콘텐츠팀", assignee: "이UI", rankLimit: 15, isTargetKeyword: true },
      ],
    },
    {
      id: "W006",
      contractNumber: "CT-2024-001",
      serviceType: "SEO 최적화",
      contractDescription: "웹사이트 검색엔진 최적화 및 키워드 상위 노출",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      teamName: "개발팀",
      assignee: "정개발",
      targetKeywords: "웹개발, 홈페이지제작, 반응형웹",
      keywordRankLimit: 10,
      status: "보류",
      notes: "기술 검토 중. 클라이언트 추가 요구사항 확인 필요",
      createdAt: "2024-01-18",
      keywordAssignments: [
        { id: "k21", keyword: "웹개발", teamName: "개발팀", assignee: "정개발", rankLimit: 10, isTargetKeyword: true },
        { id: "k22", keyword: "홈페이지제작", teamName: "개발팀", assignee: "한코딩", rankLimit: 8, isTargetKeyword: false },
        { id: "k23", keyword: "반응형웹", teamName: "개발팀", assignee: "임프로", rankLimit: 12, isTargetKeyword: true },
        { id: "k24", keyword: "웹사이트개발", teamName: "개발팀", assignee: "서버관", rankLimit: 10, isTargetKeyword: false },
      ],
    },
    {
      id: "W007",
      contractNumber: "CT-2024-002",
      serviceType: "SNS 마케팅",
      contractDescription: "인스타그램, 페이스북 콘텐츠 제작 및 관리",
      startDate: "2024-02-01",
      endDate: "2024-07-31",
      teamName: "디자인팀",
      assignee: "김디자인",
      targetKeywords: "비주얼디자인, 그래픽디자인, 브랜드디자인",
      keywordRankLimit: 15,
      status: "진행중",
      notes: "월 20개 디자인 시안 제작. 클라이언트 피드백 반영 중",
      createdAt: "2024-01-28",
      keywordAssignments: [
        { id: "k25", keyword: "비주얼디자인", teamName: "디자인팀", assignee: "김디자인", rankLimit: 15, isTargetKeyword: true },
        { id: "k26", keyword: "그래픽디자인", teamName: "디자인팀", assignee: "이UI", rankLimit: 12, isTargetKeyword: true },
        { id: "k27", keyword: "브랜드디자인", teamName: "디자인팀", assignee: "박UX", rankLimit: 10, isTargetKeyword: false },
      ],
    },
    {
      id: "W008",
      contractNumber: "CT-2024-004",
      serviceType: "통합 디지털 마케팅",
      contractDescription: "SEO, SNS, 광고 운영 통합 마케팅 서비스",
      startDate: "2024-03-01",
      endDate: "2024-08-31",
      teamName: "영업팀",
      assignee: "강영업",
      targetKeywords: "B2B마케팅, 영업전략, 비즈니스개발",
      keywordRankLimit: 10,
      status: "완료",
      notes: "프로젝트 성공적 완료. 고객사 재계약 확정",
      createdAt: "2024-02-25",
      keywordAssignments: [
        { id: "k28", keyword: "B2B마케팅", teamName: "영업팀", assignee: "강영업", rankLimit: 10, isTargetKeyword: true },
        { id: "k29", keyword: "영업전략", teamName: "영업팀", assignee: "윤세일즈", rankLimit: 8, isTargetKeyword: true },
        { id: "k30", keyword: "비즈니스개발", teamName: "영업팀", assignee: "조마케팅", rankLimit: 12, isTargetKeyword: false },
        { id: "k31", keyword: "영업컨설팅", teamName: "영업팀", assignee: "신비즈", rankLimit: 10, isTargetKeyword: true },
      ],
    },
  ]

  // 업무 목록 상태 (로컬스토리지에서 초기화)
  const [workTasks, setWorkTasks] = useState<WorkTask[]>([])



  const handleStatusClick = (task: WorkTask) => {
    setSelectedStatusTask(task)
    setIsStatusDetailModalOpen(true)
  }

  const getStatusBadge = (status: string, task?: WorkTask) => {
    const statusConfig = {
      진행중: {
        variant: "default" as const,
        icon: Clock,
        color: "bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer",
      },
      완료: {
        variant: "default" as const,
        icon: CheckCircle,
        color: "bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer",
      },
      대기: {
        variant: "secondary" as const,
        icon: AlertCircle,
        color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 cursor-pointer",
      },
      보류: {
        variant: "destructive" as const,
        icon: XCircle,
        color: "bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer",
      },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={config.color} onClick={task ? () => handleStatusClick(task) : undefined}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    )
  }

  const [currentUser] = useState("김마케팅") // 현재 로그인한 사용자 (샘플)

  // 상태 옵션 정의
  const statusOptions: StatusOption[] = [
    { value: "all", label: "전체" },
    { value: "진행중", label: "진행중" },
    { value: "완료", label: "완료" },
    { value: "대기", label: "대기" },
    { value: "보류", label: "보류" },
  ]

  // 날짜 기준 옵션 정의
  const dateOptions = [
    { value: "생성일", label: "생성일" },
    { value: "시작일", label: "시작일" },
    { value: "종료일", label: "종료일" },
  ]

  // 카드 필터 핸들러
  const handleCardFilterChange = (filter: string) => {
    setSelectedCard(filter)
  }

  const filteredTasks = workTasks.filter((task) => {
    const matchesSearch =
      task.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.targetKeywords.toLowerCase().includes(searchTerm.toLowerCase())
    
    // SearchFilterPanel 필터
    const matchesFilter = filterStatus === "all" || task.status === filterStatus
    
    // 카드 필터 (selectedCard)
    let matchesCard = true
    if (selectedCard !== "all") {
      switch (selectedCard) {
        case "전체":
          matchesCard = true
          break
        case "진행중":
          matchesCard = task.status === "진행중"
          break
        case "완료":
          matchesCard = task.status === "완료"
          break
        case "대기":
          matchesCard = task.status === "대기"
          break
        case "보류":
          matchesCard = task.status === "보류"
          break
      }
    }
    
    const matchesTab = activeTab === "all" || (activeTab === "my" && task.assignee === currentUser)
    return matchesSearch && matchesFilter && matchesCard && matchesTab
  })

  const currentTabTasks = activeTab === "all" ? workTasks : workTasks.filter((task) => task.assignee === currentUser)
  const statusCounts = {
    전체: currentTabTasks.length,
    진행중: currentTabTasks.filter((t) => t.status === "진행중").length,
    완료: currentTabTasks.filter((t) => t.status === "완료").length,
    대기: currentTabTasks.filter((t) => t.status === "대기").length,
    보류: currentTabTasks.filter((t) => t.status === "보류").length,
  }

  // 업무 등록/수정 핸들러
  const handleWorkSubmit = (data: any) => {
    if (isEditModalOpen && selectedTask) {
      // 수정 모드
      const updatedTasks = workTasks.map((task) => 
        task.id === selectedTask.id ? { 
          ...task, 
          ...data,
          keywordAssignments: data.keywordAssignments || []
        } : task
      )
      setWorkTasks(updatedTasks)
      setIsEditModalOpen(false)
      setSelectedTask(null)
    } else {
      // 등록 모드
      const workTask: WorkTask = {
        id: `W${String(workTasks.length + 1).padStart(3, "0")}`,
        ...data,
        keywordAssignments: data.keywordAssignments || [],
        createdAt: new Date().toISOString().split("T")[0],
      }
      setWorkTasks([...workTasks, workTask])
      setIsAddModalOpen(false)
    }
  }

  const handleViewDetail = (task: WorkTask) => {
    setSelectedTask(task)
    setIsDetailModalOpen(true)
  }

  const handleEditTask = (task: WorkTask) => {
    setSelectedTask(task)
    setIsEditModalOpen(true)
  }


  const handleDeleteTask = (task: WorkTask) => {
    setSelectedTask(task)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!selectedTask) return

    const updatedTasks = workTasks.filter((task) => task.id !== selectedTask.id)
    setWorkTasks(updatedTasks)
    setIsDeleteDialogOpen(false)
    setSelectedTask(null)
  }


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
    setEndDate(period === "전체" ? null : today)
    setSelectedPeriod(period)
  }

  // 검색 실행
  const handleSearch = () => {
    console.log("검색 실행:", { searchTerm, filterStatus, dateCriteria, startDate, endDate })
    // 실제 검색 로직 구현
  }

  // 초기화
  const handleReset = () => {
    setSearchTerm("")
    setFilterStatus("all")
    setDateCriteria("생성일")
    setStartDate(null)
    setEndDate(null)
    setSelectedPeriod("1년")
    handleQuickDateSelect("1년")
  }

  // 로컬스토리지에서 업무 목록 로드 및 초기화
  useEffect(() => {
    const loadWorkTasks = () => {
      try {
        const storedWorkTasks = localStorage.getItem('workTasks')
        if (storedWorkTasks) {
          const parsedTasks = JSON.parse(storedWorkTasks)
          setWorkTasks(parsedTasks)
        } else {
          // 로컬스토리지에 데이터가 없으면 기본 샘플 데이터 사용 및 저장
          setWorkTasks(defaultWorkTasks)
          localStorage.setItem('workTasks', JSON.stringify(defaultWorkTasks))
        }
      } catch (error) {
        console.error('업무 목록 로드 중 오류:', error)
        setWorkTasks(defaultWorkTasks)
      }
    }

    loadWorkTasks()

    // storage 이벤트 리스너 추가 (다른 탭/페이지에서 변경 감지)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'workTasks' && e.newValue) {
        try {
          const parsedTasks = JSON.parse(e.newValue)
          setWorkTasks(parsedTasks)
        } catch (error) {
          console.error('업무 목록 업데이트 중 오류:', error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // workTasks 변경 시 로컬스토리지에 저장
  useEffect(() => {
    if (workTasks.length > 0) {
      try {
        localStorage.setItem('workTasks', JSON.stringify(workTasks))
      } catch (error) {
        console.error('업무 목록 저장 중 오류:', error)
      }
    }
  }, [workTasks])

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

  // 컴포넌트 마운트 시 1년치 날짜 기본 설정
  useEffect(() => {
    handleQuickDateSelect("1년")
  }, [])

  // DataTable을 위한 컬럼 정의
  const columns: Column<WorkTask>[] = [
    {
      key: "contractNumber",
      label: "계약번호",
      width: "w-[140px]",
      render: (task) => (
                        <div className="font-mono text-sm">{task.contractNumber}</div>
      ),
    },
    {
      key: "serviceType",
      label: "서비스 유형",
      width: "w-[180px]",
      render: (task) => (
                        <div>
                          <div className="font-medium">{task.serviceType}</div>
                          <div className="text-sm text-slate-500 truncate max-w-xs">{task.contractDescription}</div>
                        </div>
      ),
    },
    {
      key: "assignee",
      label: "담당자",
      width: "w-[160px]",
      render: (task) => (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <div>
                            <div className="font-medium">{task.assignee}</div>
                            <div className="text-sm text-slate-500">({task.teamName})</div>
                          </div>
                        </div>
      ),
    },
    {
      key: "targetKeywords",
      label: "목표 키워드",
      width: "w-[220px]",
      render: (task) => {
        const hasKeywordAssignments = task.keywordAssignments && task.keywordAssignments.length > 0
        const keywordCount = hasKeywordAssignments ? task.keywordAssignments?.length || 0 : 0
        
        return (
          <div className="text-sm">
            {hasKeywordAssignments ? (
              <>
                <div className="font-medium text-blue-600 mb-1">
                  총 {keywordCount}개 키워드
                </div>
                <div className="text-slate-600 text-xs space-y-0.5">
                  {task.keywordAssignments?.slice(0, 2).map((ka) => (
                    <div key={ka.id} className="truncate">
                      • {ka.keyword} ({ka.assignee}, {ka.rankLimit}위)
                    </div>
                  ))}
                  {keywordCount > 2 && (
                    <div className="text-slate-400">외 {keywordCount - 2}개...</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div>{task.targetKeywords}</div>
                <div className="text-slate-500">노출 보장 순위: {task.keywordRankLimit}위</div>
              </>
            )}
          </div>
        )
      },
    },
    {
      key: "status",
      label: "상태",
      width: "w-[100px]",
      render: (task) => getStatusBadge(task.status, task),
    },
    {
      key: "period",
      label: "기간",
      width: "w-[160px]",
      render: (task) => (
                        <div className="text-sm">
                          <div>{task.startDate}</div>
                          <div className="text-slate-500">~ {task.endDate}</div>
                        </div>
      ),
    },
    {
      key: "actions",
      label: "작업",
      width: "w-[100px]",
      align: "center",
      render: (task) => (
        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewDetail(task)
                            }}
                            title="상세보기"
                          >
            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:bg-blue-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditTask(task)
                            }}
                            title="수정"
                          >
            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteTask(task)
                            }}
                            title="삭제"
                          >
            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
      ),
    },
  ]

  // 모바일 카드 렌더링 함수
  const renderMobileCard = (task: WorkTask) => (
    <Card className="shadow-none rounded-xl border border-gray-200">
      <CardContent className="p-4 space-y-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-start gap-3">
                  <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900 font-mono">{task.contractNumber}</div>
              {getStatusBadge(task.status, task)}
                  </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => handleViewDetail(task)}
            >
              <Eye className="size-[15px]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => handleEditTask(task)}
            >
              <Edit className="size-[15px]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
              onClick={() => handleDeleteTask(task)}
            >
              <Trash2 className="size-[15px]" />
                </Button>
                  </div>
                </div>

        {/* 서비스 정보 */}
                <div className="space-y-2">
          <div className="text-xs text-gray-500">서비스 유형</div>
          <div className="text-sm font-semibold text-gray-900">{task.serviceType}</div>
          <div className="text-sm text-gray-500 mt-1">{task.contractDescription}</div>
                </div>

        {/* 담당자 정보 */}
        <div className="space-y-1 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">담당자</div>
          <div className="text-sm text-gray-700">
            {task.assignee} ({task.teamName})
                  </div>
                </div>

        {/* 키워드 및 기간 */}
        <div className="grid grid-cols-1 gap-4 pt-3 border-t border-gray-100">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">목표 키워드</div>
            {task.keywordAssignments && task.keywordAssignments.length > 0 ? (
              <>
                <div className="text-sm font-semibold text-blue-600 mb-1">
                  총 {task.keywordAssignments.length}개 키워드
                </div>
                <div className="space-y-1">
                  {task.keywordAssignments.slice(0, 3).map((ka) => (
                    <div key={ka.id} className="text-xs text-gray-600">
                      • {ka.keyword} ({ka.assignee}, {ka.rankLimit}위)
                    </div>
                  ))}
                  {task.keywordAssignments.length > 3 && (
                    <div className="text-xs text-gray-400">외 {task.keywordAssignments.length - 3}개...</div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-gray-900">{task.targetKeywords}</div>
                <div className="text-xs text-gray-500">노출 보장 순위: {task.keywordRankLimit}위</div>
              </>
            )}
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">작업 기간</div>
            <div className="text-sm text-gray-700">
              {task.startDate} ~ {task.endDate}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="업무현황"
      />

      <div className="flex">
        <Sidebar
          currentPage="work/task"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6 w-full max-w-full">
          {isPageLoading ? (
            <>
              {/* 페이지 헤더 스켈레톤 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                <div className="flex-shrink-0 space-y-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>

              {/* 요약 카드 스켈레톤 */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 w-full">
                {[...Array(4)].map((_, i) => (
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
                    <div className="flex gap-2">
                      <Skeleton className="h-10 w-20" />
                      <Skeleton className="h-10 w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 업무 목록 헤더 스켈레톤 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>

              {/* 테이블 스켈레톤 */}
              <Card className="shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* 테이블 헤더 스켈레톤 */}
                      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-20" />
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
                          </div>
                        </div>
                      ))}
                    </div>
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
                <h1 className="text-xl sm:text-2xl font-bold">업무현황</h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">계약된 내용을 바탕으로 담당자에게 업무를 배정합니다.</p>
              </div>
              
              {/* 버튼 영역 - 데스크톱에서만 표시 */}
              <div className="hidden sm:flex gap-2 flex-wrap justify-end">
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground shadow-none rounded-lg"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  새 업무 등록
                </Button>
              </div>
            </div>

      {/* 탭 섹션 - 모바일에서는 버튼과 같은 라인 */}
      <div className="flex items-center justify-between gap-2 sm:justify-start">
        <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            전체업무
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "my" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            내업무
          </button>
        </div>
        
        {/* 모바일 버튼 - 탭과 같은 라인, 우측 배치 */}
        <Button 
          size="lg"
          className="bg-primary text-primary-foreground shadow-none rounded-lg sm:hidden max-w-[120px]"
          onClick={() => setIsAddModalOpen(true)}
        >
          새 업무 등록
        </Button>
      </div>

            {/* 요약 카드 */}
            <StatusSummaryCards
              statusCounts={statusCounts}
              activeFilter={selectedCard}
              onFilterChange={handleCardFilterChange}
            />

            {/* 검색 및 필터 */}
            <SearchFilterPanel
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              searchPlaceholder="계약번호, 서비스 유형, 담당자 검색"
              statusFilter={filterStatus}
              onStatusFilterChange={setFilterStatus}
              statusOptions={statusOptions}
              statusLabel="업무상태"
              dateCriteria={dateCriteria}
              onDateCriteriaChange={setDateCriteria}
              dateOptions={dateOptions}
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={(start, end) => {
                setStartDate(start)
                setEndDate(end)
              }}
              selectedPeriod={selectedPeriod}
              onPeriodChange={handleQuickDateSelect}
              onSearch={handleSearch}
              onReset={handleReset}
            />


            {/* DataTable */}
            <DataTable
              data={filteredTasks}
              columns={columns}
              title="업무 목록"
              totalCount={filteredTasks.length}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              renderMobileCard={renderMobileCard}
              isLoading={isLoading}
              skeletonRows={5}
              emptyTitle="데이터가 없습니다"
              emptyDescription={
                searchTerm || filterStatus !== "all"
                  ? "검색 조건에 맞는 업무가 없습니다. 검색 조건을 변경해보세요."
                  : "등록된 업무가 없습니다. 새 업무를 등록해주세요."
              }
            />

            {/* 업무 등록 모달 */}
            <WorkRegisterModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onSubmit={handleWorkSubmit}
              mode="create"
            />

            {/* 업무 상세보기 모달 */}
            <WorkRegisterModal
              isOpen={isDetailModalOpen}
              onClose={() => {
                setIsDetailModalOpen(false)
                setSelectedTask(null)
              }}
              onSubmit={() => {}}
              mode="view"
              initialData={selectedTask ? {
                contractNumber: selectedTask.contractNumber,
                serviceType: selectedTask.serviceType,
                contractDescription: selectedTask.contractDescription,
                startDate: selectedTask.startDate,
                endDate: selectedTask.endDate,
                teamName: selectedTask.teamName,
                assignee: selectedTask.assignee,
                targetKeywords: selectedTask.targetKeywords,
                keywordRankLimit: selectedTask.keywordRankLimit,
                status: selectedTask.status,
                notes: selectedTask.notes,
                keywordAssignments: selectedTask.keywordAssignments || [],
              } : undefined}
              workTaskId={selectedTask?.id}
              onEdit={() => {
                setIsDetailModalOpen(false)
                handleEditTask(selectedTask!)
              }}
            />

            {/* 업무 삭제 모달 */}
            <WorkDeleteModal
              isOpen={isDeleteDialogOpen}
              onClose={() => setIsDeleteDialogOpen(false)}
              workTask={selectedTask}
              onConfirm={confirmDelete}
            />

            {/* 업무 수정 모달 */}
            <WorkRegisterModal
              isOpen={isEditModalOpen}
              onClose={() => {
              setIsEditModalOpen(false)
                setSelectedTask(null)
              }}
              onSubmit={handleWorkSubmit}
              mode="edit"
              initialData={selectedTask ? {
                contractNumber: selectedTask.contractNumber,
                serviceType: selectedTask.serviceType,
                contractDescription: selectedTask.contractDescription,
                startDate: selectedTask.startDate,
                endDate: selectedTask.endDate,
                teamName: selectedTask.teamName,
                assignee: selectedTask.assignee,
                targetKeywords: selectedTask.targetKeywords,
                keywordRankLimit: selectedTask.keywordRankLimit,
                status: selectedTask.status,
                notes: selectedTask.notes,
                keywordAssignments: selectedTask.keywordAssignments || [],
              } : undefined}
              workTaskId={selectedTask?.id}
            />

            {/* 상태 상세 모달 */}
            <WorkStatusDetailModal
              isOpen={isStatusDetailModalOpen}
              onClose={() => setIsStatusDetailModalOpen(false)}
              task={selectedStatusTask}
              postingData={postingData}
            />
          </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default WorkStatusManagement
