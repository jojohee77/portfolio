"use client"

import React from "react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Sidebar, MobileMenuToggle } from "@/components/sidebar"
import Header from "@/components/header"
import DataTable, { type Column, type SortOption } from "@/components/ui/data-table"
import SearchFilterPanel, { type StatusOption, type DateCriteriaOption } from "@/components/ui/search-filter-panel"
import { showSuccessToast } from "@/lib/toast-utils"
import TeamModal from "@/components/team-modal"
import { SearchForm } from "@/components/ui/search-form"
import SingleSearchForm, { type SearchOption } from "@/components/ui/single-search-form"
import StatusSummaryCards from "@/components/ui/card-status-summary"

import {
  Menu,
  X,
  Home,
  LucideContrast as FileContract,
  Briefcase,
  MessageSquare,
  Search,
  DollarSign,
  Target,
  Bot,
  Building,
  Crown,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Users,
  UserCheck,
  Clock,
  Shield,
  Eye,
  Pencil,
  Trash2,
  Plus,
  TrendingUp,
  TrendingDown,
  Link as LinkIcon,
  MoreVertical,
  Settings,
  ChevronLeft,
} from "lucide-react"
const notificationData = [
  {
    id: 1,
    label: "공지",
    date: "2024-01-15",
    content:
      "새로운 기능 업데이트가 완료되었습니다. 더 나은 서비스를 위해 지속적으로 개선하겠습니다.",
    isRead: false,
  },
  {
    id: 2,
    label: "이벤트",
    date: "2024-01-14",
    content:
      "신규 고객 대상 특별 할인 이벤트가 진행 중입니다. 지금 바로 확인해보세요!",
    isRead: false,
  },
]

const MENU_OPTIONS = [
  { id: "dashboard", label: "대시보드" },
  { id: "contract", label: "계약현황" },
  { id: "business", label: "업무현황" },
  { id: "posting", label: "포스팅현황" },
  { id: "keyword", label: "키워드현황" },
  { id: "blogRanking", label: "블로그 순위추적" },
  { id: "sales", label: "매출현황" },
  { id: "performance", label: "성과현황" },
  { id: "chatbot", label: "챗봇" },
  { id: "organization", label: "조직 관리" },
] as const

const ALL_MENU_IDS = MENU_OPTIONS.map((menu) => menu.id)

const MENU_LABEL_MAP = MENU_OPTIONS.reduce<Record<string, string>>((acc, menu) => {
  acc[menu.id] = menu.label
  return acc
}, {})

// 계정 데이터 타입
interface AccountData {
  id: string
  name: string
  email: string
  avatar: string
  department: string
  position: string
  permission: string
  permissionColor: string
  status: string
  statusColor: string
  lastAccess: string
  joinDate: string
}

// 계정 데이터
const accountsData: AccountData[] = [
  {
    id: "1",
    name: "김승우",
    email: "kim.seungwoo@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "경영진",
    position: "대표",
    permission: "전체 관리자",
    permissionColor: "bg-red-50 text-red-700 border border-red-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-01-01",
  },
  {
    id: "2",
    name: "박나리",
    email: "park.nari@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "마케팅1팀",
    position: "팀장",
    permission: "중간 관리자",
    permissionColor: "bg-blue-50 text-blue-700 border border-blue-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-01-05",
  },
  {
    id: "3",
    name: "정민수",
    email: "jung.minsu@company.com",
    avatar: "/placeholder-user.jpg",
    department: "마케팅4팀",
    position: "인턴",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "비활성",
    statusColor: "bg-gray-100 text-gray-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-01-10",
  },
  {
    id: "4",
    name: "이영희",
    email: "lee.younghee@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "마케팅2팀",
    position: "대리",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-01-15",
  },
  {
    id: "5",
    name: "최현우",
    email: "choi.hyunwoo@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "마케팅3팀",
    position: "과장",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-02-01",
  },
  {
    id: "6",
    name: "강수진",
    email: "kang.sujin@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "광고운영팀",
    position: "차장",
    permission: "중간 관리자",
    permissionColor: "bg-blue-50 text-blue-700 border border-blue-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-02-10",
  },
  {
    id: "7",
    name: "윤태호",
    email: "yoon.taeho@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "개발QA팀",
    position: "팀장",
    permission: "중간 관리자",
    permissionColor: "bg-blue-50 text-blue-700 border border-blue-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-02-15",
  },
  {
    id: "8",
    name: "한소영",
    email: "han.soyoung@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "마케팅1팀",
    position: "사원",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-03-01",
  },
  {
    id: "9",
    name: "송민준",
    email: "song.minjun@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "마케팅2팀",
    position: "사원",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "비활성",
    statusColor: "bg-gray-100 text-gray-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-03-05",
  },
  {
    id: "10",
    name: "강지민",
    email: "kang.jimin@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "마케팅3팀",
    position: "인턴",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-03-10",
  },
  {
    id: "11",
    name: "박서준",
    email: "park.seojun@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "광고운영팀",
    position: "대리",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-03-15",
  },
  {
    id: "12",
    name: "이하은",
    email: "lee.haeun@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "개발QA팀",
    position: "사원",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "비활성",
    statusColor: "bg-gray-100 text-gray-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-03-20",
  },
  {
    id: "13",
    name: "김영수",
    email: "kim.youngsu@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "마케팅1팀",
    position: "과장",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-03-25",
  },
  {
    id: "14",
    name: "박지훈",
    email: "park.jihun@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "마케팅4팀",
    position: "대리",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-04-01",
  },
  {
    id: "15",
    name: "최수진",
    email: "choi.sujin@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "마케팅2팀",
    position: "사원",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-04-05",
  },
  {
    id: "16",
    name: "정우성",
    email: "jung.woosung@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "광고운영팀",
    position: "과장",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-04-10",
  },
  {
    id: "17",
    name: "강동원",
    email: "kang.dongwon@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "개발QA팀",
    position: "대리",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "비활성",
    statusColor: "bg-gray-100 text-gray-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-04-15",
  },
  {
    id: "18",
    name: "윤아",
    email: "yoon.ah@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "마케팅3팀",
    position: "사원",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-04-20",
  },
  {
    id: "19",
    name: "이민호",
    email: "lee.minho@company.com",
    avatar: "/icons/icon-user-m.png",
    department: "마케팅1팀",
    position: "인턴",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-04-25",
  },
  {
    id: "20",
    name: "송혜교",
    email: "song.hyekyo@company.com",
    avatar: "/icons/icon-user-w.png",
    department: "마케팅4팀",
    position: "사원",
    permission: "실무자",
    permissionColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    status: "활성",
    statusColor: "bg-green-100 text-green-800",
    lastAccess: "2024-01-15 09:30",
    joinDate: "2024-05-01",
  },
]

export default function Organization() {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("accounts")
  const [addAccountOpen, setAddAccountOpen] = useState(false)
  const [addTeamOpen, setAddTeamOpen] = useState(false)
  const [viewMembersOpen, setViewMembersOpen] = useState(false)
  const [addMemberOpen, setAddMemberOpen] = useState(false)
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false)
  const [memberSearchTerm, setMemberSearchTerm] = useState("")
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set())
  
  // 팀원 목록 상태
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "김승우", role: "팀장", email: "kim@company.com", status: "활성" },
    { id: 2, name: "박나리", role: "팀원", email: "park@company.com", status: "활성" },
    { id: 3, name: "정민수", role: "팀원", email: "jung@company.com", status: "활성" },
    { id: 4, name: "이지은", role: "팀원", email: "lee@company.com", status: "활성" },
    { id: 5, name: "최현우", role: "팀원", email: "choi@company.com", status: "활성" },
    { id: 6, name: "홍은지", role: "팀원", email: "hong@company.com", status: "활성" },
    { id: 7, name: "윤태호", role: "팀원", email: "yoon@company.com", status: "활성" },
    { id: 8, name: "서민지", role: "팀원", email: "seo@company.com", status: "활성" },
    { id: 9, name: "강수진", role: "팀원", email: "kang@company.com", status: "활성" },
    { id: 10, name: "한소영", role: "팀원", email: "han@company.com", status: "활성" }
  ])
  
  // 팀 구성원 관리 모달 열릴 때의 초기 팀원 상태 저장
  const [initialTeamMembers, setInitialTeamMembers] = useState(teamMembers)
  
  // 팀 정렬 상태
  const [teamSort, setTeamSort] = useState("팀명순")
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("실무자")
  const [linkSettingStep, setLinkSettingStep] = useState(false)
  const [linkExpiration, setLinkExpiration] = useState("7일")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [permissionModalOpen, setPermissionModalOpen] = useState(false)
  const [newPermissionName, setNewPermissionName] = useState("")
  const [selectedMenus, setSelectedMenus] = useState<Set<string>>(new Set())
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [categoryPermissions, setCategoryPermissions] = useState<{[key: string]: string[]}>({
    admin: MENU_OPTIONS.map((menu) => menu.label),
    manager: [],
    user: []
  })
  const [editTeamOpen, setEditTeamOpen] = useState(false)
  const [deleteTeamOpen, setDeleteTeamOpen] = useState(false)
  const [selectedTeamForAction, setSelectedTeamForAction] = useState<{name: string, members: number, leader: string, description: string} | null>(null)
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [showEmptyTeamState, setShowEmptyTeamState] = useState(false)
  const [isTeamLoading, setIsTeamLoading] = useState(false)
  const [accountDetailOpen, setAccountDetailOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountData | null>(null)
  const [accountEditOpen, setAccountEditOpen] = useState(false)
  const [editPosition, setEditPosition] = useState("")
  const [editPermission, setEditPermission] = useState("")
  const [editSelectedMenus, setEditSelectedMenus] = useState<Set<string>>(new Set())
  const [accountDeleteOpen, setAccountDeleteOpen] = useState(false)
  
  // 계정 상태 카드 필터
  const [activeAccountFilter, setActiveAccountFilter] = useState("all")
  
  // SearchFilterPanel 상태
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateCriteria, setDateCriteria] = useState("가입일")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("1년")
  const [accountSort, setAccountSort] = useState<string>('가입일순')
  
  // 팀 검색 관련 상태
  const [teamSearchTerm, setTeamSearchTerm] = useState("")
  const [teamSearchCategory, setTeamSearchCategory] = useState("all")
  
  // 팀 검색 카테고리 옵션
  const teamCategoryOptions: SearchOption[] = [
    { value: "all", label: "전체" },
    { value: "name", label: "팀명" },
    { value: "leader", label: "팀장" },
    { value: "members", label: "구성원" },
  ]

  // 상태 옵션 정의
  const statusOptions: StatusOption[] = [
    { value: "all", label: "전체" },
    { value: "활성", label: "활성" },
    { value: "비활성", label: "비활성" },
  ]

  // 날짜 기준 옵션 정의
  const dateOptions: DateCriteriaOption[] = [
    { value: "가입일", label: "가입일" },
  ]

  // 정렬 옵션 정의
  const sortOptions: SortOption[] = [
    { value: "가입일순", label: "가입일순" },
    { value: "이름순", label: "이름순" },
  ]
  
  // 팀 정렬 옵션 정의
  const teamSortOptions: SortOption[] = [
    { value: "팀명순", label: "팀명순" },
    { value: "구성원순", label: "구성원순" },
  ]

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
    console.log("검색 실행:", { searchTerm, statusFilter, dateCriteria, startDate, endDate })
    // 검색 실행시 페이지를 첫 번째로 리셋
    setCurrentPage(1)
  }

  // 초기화
  const handleReset = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateCriteria("가입일")
    setStartDate(null)
    setEndDate(null)
    setSelectedPeriod("1년")
    handleQuickDateSelect("1년")
  }

  // 컴포넌트 마운트 시 1년치 날짜 기본 설정
  useEffect(() => {
    handleQuickDateSelect("1년")
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  // 팀 검색 핸들러
  const handleTeamSearch = () => {
    console.log("팀 검색 실행:", { teamSearchCategory, teamSearchTerm })
    // 검색은 실시간으로 필터링되므로 여기서는 추가 로직이 필요 없음
  }

  // 팀원 삭제 핸들러
  const handleDeleteMember = (memberId: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId))
  }

  // 팀 데이터 정의
  const teamData = [
    { id: 1, name: "마케팅1팀", members: 12, leader: "박나리", description: "마케팅 업무를 담당하는 팀입니다.", memberIds: [1, 2, 3, 4, 5] }, 
    { id: 2, name: "마케팅2팀", members: 9, leader: "김철수", description: "온라인 마케팅 전략을 수립하는 팀입니다.", memberIds: [6, 7, 8] }, 
    { id: 3, name: "광고운영팀", members: 11, leader: "이영희", description: "광고 캠페인 운영 및 관리 팀입니다.", memberIds: [1, 3, 5, 7] }, 
    { id: 4, name: "개발QA팀", members: 6, leader: "정민수", description: "개발 품질 보증 및 테스트 담당 팀입니다.", memberIds: [2, 4, 6] },
    { id: 5, name: "신규팀", members: 0, leader: "-", description: "-", memberIds: [] },
    { id: 6, name: "빈팀", members: 0, leader: "-", description: "-", memberIds: [] },
    { id: 7, name: "테스트팀", members: 3, leader: "-", description: "테스트용 팀입니다.", memberIds: [1, 2, 3] },
    { id: 8, name: "개발팀", members: 8, leader: "홍길동", description: "-", memberIds: [4, 5, 6, 7, 8] }
  ]

  // 팀 검색 필터링 함수
  const getFilteredTeamData = () => {
    if (!teamSearchTerm.trim()) {
      return teamData
    }

    const searchTermLower = teamSearchTerm.trim().toLowerCase()

    return teamData.filter(team => {
      if (teamSearchCategory === "all") {
        // 전체 검색: 팀명, 팀장, 구성원 이름 모두 검색
        const matchesName = team.name.toLowerCase().includes(searchTermLower)
        const matchesLeader = team.leader !== "-" && team.leader.toLowerCase().includes(searchTermLower)
        
        // 구성원 이름 검색
        const memberNames = team.memberIds
          .map(id => teamMembers.find(m => m.id === id)?.name || "")
          .filter(name => name !== "")
        const matchesMembers = memberNames.some(name => name.toLowerCase().includes(searchTermLower))
        
        return matchesName || matchesLeader || matchesMembers
      } else if (teamSearchCategory === "name") {
        // 팀명 검색
        return team.name.toLowerCase().includes(searchTermLower)
      } else if (teamSearchCategory === "leader") {
        // 팀장 검색
        return team.leader !== "-" && team.leader.toLowerCase().includes(searchTermLower)
      } else if (teamSearchCategory === "members") {
        // 구성원 이름 검색
        const memberNames = team.memberIds
          .map(id => teamMembers.find(m => m.id === id)?.name || "")
          .filter(name => name !== "")
        return memberNames.some(name => name.toLowerCase().includes(searchTermLower))
      }
      return true
    })
  }

  // 필터링된 팀 데이터를 정렬
  const filteredTeamData = getFilteredTeamData()
  const sortedTeamData = [...filteredTeamData].sort((a, b) => {
    if (teamSort === "팀명순") {
      return a.name.localeCompare(b.name)
    } else if (teamSort === "구성원순") {
      return b.members - a.members
    }
    return 0
  })


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      // 드롭다운 외부 클릭 시 닫기 (드롭다운 컨테이너 내부 클릭은 제외)
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownIndex(null)
      }
    }
    if (notificationOpen || userMenuOpen || openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [notificationOpen, userMenuOpen, openDropdownIndex])

  // 팀 구성원 관리 모달 열릴 때 초기 상태 저장
  useEffect(() => {
    if (viewMembersOpen) {
      setInitialTeamMembers([...teamMembers])
    }
  }, [viewMembersOpen])

  // 이메일 추가 함수
  const addEmail = (email: string) => {
    const trimmedEmail = email.trim()
    if (trimmedEmail && isValidEmail(trimmedEmail) && !inviteEmails.includes(trimmedEmail)) {
      setInviteEmails([...inviteEmails, trimmedEmail])
      setCurrentEmail("")
    }
  }

  // 다중 이메일 추가 함수 (쉼표로 구분)
  const addMultipleEmails = (emailString: string) => {
    // 쉼표로 분리
    const emails = emailString.split(',').map(email => email.trim()).filter(email => email)
    
    const newEmails: string[] = []
    emails.forEach(email => {
      if (isValidEmail(email) && !inviteEmails.includes(email) && !newEmails.includes(email)) {
        newEmails.push(email)
      }
    })
    
    if (newEmails.length > 0) {
      setInviteEmails([...inviteEmails, ...newEmails])
      setCurrentEmail("")
    }
  }

  // 이메일 제거 함수
  const removeEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter(email => email !== emailToRemove))
  }

  // 이메일 유효성 검사
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // 이메일 입력 변경 처리 (쉼표 감지)
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // 쉼표가 포함되어 있으면 다중 이메일 처리
    if (value.includes(',')) {
      addMultipleEmails(value)
    } else {
      setCurrentEmail(value)
    }
  }

  // 엔터키 처리
  const handleEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      // 쉼표가 포함되어 있으면 다중 이메일 처리, 아니면 단일 이메일 처리
      if (currentEmail.includes(',')) {
        addMultipleEmails(currentEmail)
      } else {
      addEmail(currentEmail)
      }
    } else if (e.key === 'Backspace' && currentEmail === '' && inviteEmails.length > 0) {
      // 백스페이스로 마지막 이메일 제거
      const lastEmail = inviteEmails[inviteEmails.length - 1]
      removeEmail(lastEmail)
    }
  }

  // 붙여넣기 처리 (쉼표로 구분된 이메일)
  const handleEmailPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text')
    
    if (pastedText.includes(',')) {
      e.preventDefault()
      addMultipleEmails(pastedText)
    }
  }

  // 계정 테이블 컬럼 정의
  const accountColumns: Column<AccountData>[] = [
    {
      key: "user",
      label: "사용자",
      width: "w-[220px]",
      render: (account) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 flex-shrink-0">
            <AvatarImage src={account.avatar} />
            <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate flex items-center gap-1">
              {account.name}
              {account.permission === "전체 관리자" && (
                <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "이메일",
      width: "w-[240px]",
      render: (account) => (
        <div className="text-sm text-gray-600 truncate">{account.email}</div>
      ),
    },
    {
      key: "department",
      label: "부서·직급",
      width: "w-[160px]",
      render: (account) => (
        <div className="text-sm">
          <span className="font-medium">{account.department}</span>
          <span className="text-muted-foreground"> · </span>
          <span className="text-muted-foreground">{account.position}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "상태",
      width: "w-[100px]",
      render: (account) => (
        <div className="flex items-center">
          <Badge className={`${account.statusColor} text-xs`}>{account.status}</Badge>
        </div>
      ),
    },
    {
      key: "permission",
      label: "권한",
      width: "w-[130px]",
      render: (account) => (
        <div className="flex items-center">
          <Badge variant="secondary" className={`${account.permissionColor} text-xs`}>
            {account.permission}
          </Badge>
        </div>
      ),
    },
    {
      key: "joinDate",
      label: "가입일",
      width: "w-[110px]",
      render: (account) => (
        <div className="text-sm">{account.joinDate}</div>
      ),
    },
    {
      key: "actions",
      label: "작업",
      width: "w-[140px]",
      align: "center",
      render: (account) => (
        <div className="flex items-center justify-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => {
              setSelectedAccount(account)
              setAccountDetailOpen(true)
            }}
          >
            <Eye className="size-[15px]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => {
              setSelectedAccount(account)
              setEditPosition(account.position)
              setEditPermission(account.permission)
              // 권한에 따른 기본 메뉴 접근 권한 설정
              if (account.permission === "전체 관리자") {
                setEditSelectedMenus(new Set([
                  "dashboard", "contract", "business", "posting", "keyword", 
                  "sales", "performance", "chatbot", "organization"
                ]))
              } else if (account.permission === "중간 관리자") {
                setEditSelectedMenus(new Set([
                  "dashboard", "contract", "business", "posting", "keyword"
                ]))
              } else {
                setEditSelectedMenus(new Set([
                  "dashboard", "contract", "business"
                ]))
              }
              setAccountEditOpen(true)
            }}
          >
            <Pencil className="size-[15px]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              setSelectedAccount(account)
              setAccountDeleteOpen(true)
            }}
          >
            <Trash2 className="size-[15px]" />
          </Button>
        </div>
      ),
    },
  ]

  // 모바일 카드 렌더링
  const renderAccountMobileCard = (account: AccountData) => (
    <Card className="shadow-none rounded-xl border border-gray-200 py-6 relative">
      {/* 액션 버튼 - 점 세개 드롭다운 (카드 기준 absolute) */}
      <div className="absolute top-3 right-3 z-10" ref={openDropdownIndex === account.id ? dropdownRef : null}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation()
            setOpenDropdownIndex(openDropdownIndex === account.id ? null : account.id)
          }}
        >
          <MoreVertical className="size-[15px]" />
        </Button>
        
        {openDropdownIndex === account.id && (
          <div className="absolute right-0 top-9 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] py-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedAccount(account)
                    setAccountDetailOpen(true)
                    setOpenDropdownIndex(null)
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation()
                    setSelectedAccount(account)
                    setAccountDetailOpen(true)
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
                    setSelectedAccount(account)
                    setEditPosition(account.position)
                    setEditPermission(account.permission)
                    // 권한에 따른 기본 메뉴 접근 권한 설정
                    if (account.permission === "전체 관리자") {
                      setEditSelectedMenus(new Set([
                        "dashboard", "contract", "business", "posting", "keyword", 
                        "sales", "performance", "chatbot", "organization"
                      ]))
                    } else if (account.permission === "중간 관리자") {
                      setEditSelectedMenus(new Set([
                        "dashboard", "contract", "business", "posting", "keyword"
                      ]))
                    } else {
                      setEditSelectedMenus(new Set([
                        "dashboard", "contract", "business"
                      ]))
                    }
                    setAccountEditOpen(true)
                    setOpenDropdownIndex(null)
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation()
                    setSelectedAccount(account)
                    setEditPosition(account.position)
                    setEditPermission(account.permission)
                    // 권한에 따른 기본 메뉴 접근 권한 설정
                    if (account.permission === "전체 관리자") {
                      setEditSelectedMenus(new Set([
                        "dashboard", "contract", "business", "posting", "keyword", 
                        "sales", "performance", "chatbot", "organization"
                      ]))
                    } else if (account.permission === "중간 관리자") {
                      setEditSelectedMenus(new Set([
                        "dashboard", "contract", "business", "posting", "keyword"
                      ]))
                    } else {
                      setEditSelectedMenus(new Set([
                        "dashboard", "contract", "business"
                      ]))
                    }
                    setAccountEditOpen(true)
                    setOpenDropdownIndex(null)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-blue-600 hover:bg-blue-50 active:bg-blue-100"
                >
                  <Pencil className="h-4 w-4" />
                  수정
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedAccount(account)
                    setAccountDeleteOpen(true)
                    setOpenDropdownIndex(null)
                  }}
                  onTouchStart={(e) => {
                    e.stopPropagation()
                    setSelectedAccount(account)
                    setAccountDeleteOpen(true)
                    setOpenDropdownIndex(null)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 active:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  삭제
                </button>
              </div>
            )}
          </div>

      <CardContent className="px-3 space-y-3">
        {/* 기본 정보 */}
        <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
          <Avatar className="h-10 w-10 flex-shrink-0">
            <AvatarImage src={account.avatar} />
            <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="font-semibold text-gray-900 flex items-center gap-1">
              {account.name}
              {account.permission === "전체 관리자" && (
                <Crown className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              )}
            </div>
            <div className="text-sm text-gray-600">{account.email}</div>
            <Badge className={`${account.statusColor} text-xs`}>{account.status}</Badge>
          </div>
        </div>

        {/* 상세 정보 */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">부서·직급</div>
            <div className="text-sm text-right">
              <span className="font-medium">{account.department}</span>
              <span className="text-muted-foreground"> · </span>
              <span className="text-muted-foreground">{account.position}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">권한</div>
            <Badge variant="secondary" className={`${account.permissionColor} text-xs`}>
              {account.permission}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">가입일</div>
            <div className="text-sm text-gray-700 text-right">{account.joinDate}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 정렬된 계정 데이터
  const sortedAccounts = [...accountsData].sort((a, b) => {
    // 권한 우선순위: 전체관리자 > 중간관리자 > 실무자
    const getPermissionPriority = (permission: string) => {
      switch (permission) {
        case "전체 관리자": return 1
        case "중간 관리자": return 2
        case "실무자": return 3
        default: return 4
      }
    }
    
    const aPriority = getPermissionPriority(a.permission)
    const bPriority = getPermissionPriority(b.permission)
    
    // 권한 우선순위가 다르면 권한 순서대로 정렬
    if (aPriority !== bPriority) {
      return aPriority - bPriority
    }
    
    // 같은 권한 레벨 내에서만 선택된 정렬 옵션 적용
    if (accountSort === "가입일순") {
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
    } else if (accountSort === "이름순") {
      return a.name.localeCompare(b.name, 'ko')
    }
    return 0
  })

  // 필터링된 계정 데이터
  const filteredAccounts = sortedAccounts.filter(account => {
    // activeAccountFilter에 따른 필터링
    if (activeAccountFilter === "all") {
      // activeAccountFilter가 all일 때도 statusFilter 적용
      if (statusFilter !== "all" && account.status !== statusFilter) {
        return false
      }
    } else {
      // activeAccountFilter에 따른 필터링
      switch (activeAccountFilter) {
        case "전체 계정":
          break
        case "활성 계정":
          if (account.status !== "활성") return false
          break
        case "비활성":
          if (account.status !== "비활성") return false
          break
        case "관리자":
          if (account.permission !== "전체 관리자" && account.permission !== "중간 관리자") return false
          break
        default:
          break
      }
    }

    // 검색어로 필터링 (이름, 이메일, 부서)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      const matchName = account.name.toLowerCase().includes(searchLower)
      const matchEmail = account.email.toLowerCase().includes(searchLower)
      const matchDepartment = account.department.toLowerCase().includes(searchLower)
      
      if (!matchName && !matchEmail && !matchDepartment) {
        return false
      }
    }

    return true
  })

  // 페이지네이션 계산 (필터링된 데이터 기준)
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage)

  // 필터 변경시 페이지를 첫 번째로 리셋
  useEffect(() => {
    setCurrentPage(1)
  }, [activeAccountFilter, searchTerm, statusFilter])

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="조직관리"
      />

      <div className="flex">
        <Sidebar 
          currentPage="organization" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-6">
          {isPageLoading ? (
            <>
              <div className="hidden sm:flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>
                <div className="flex flex-row gap-2 justify-end">
                  <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
                  <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
                </div>
              </div>

              <div className="space-y-3">
                <Card className="shadow-none rounded-2xl border border-gray-200 md:hidden">
                  <CardContent className="p-3 space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-3"
                      >
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-14" />
                        </div>
                        <div className="text-right space-y-1">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-3 w-12 ml-auto" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Card key={i} className="shadow-none rounded-2xl border border-gray-200 py-3">
                      <CardContent className="px-4 py-3 space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-3 w-16" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Card className="shadow-none rounded-2xl border border-gray-200">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Skeleton className="h-11 w-full rounded-lg" />
                    <Skeleton className="h-11 w-full sm:w-36 rounded-lg" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <Skeleton className="h-10 w-full sm:w-28 rounded-lg" />
                    <Skeleton className="h-10 w-full sm:w-28 rounded-lg" />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="hidden sm:grid grid-cols-6 gap-4 px-6 py-3 border-b border-gray-100">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                  <div className="divide-y border-t border-gray-100">
                    {[...Array(5)].map((_, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="p-4 sm:p-6 space-y-3 sm:space-y-0 sm:grid sm:grid-cols-6 sm:gap-4"
                      >
                        {[...Array(6)].map((__, colIndex) => (
                          <Skeleton key={colIndex} className="h-4 w-full" />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-40 rounded-lg" />
                </div>
              </div>
            </>
          ) : (
            <>
          {/* 타이틀 영역 - 모바일에서는 숨김 */}
          <div className="hidden sm:flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">조직관리</h1>
              <p className="text-sm text-muted-foreground mt-1">계정과 부서/팀을 관리하고 권한을 설정하세요.</p>
            </div>
          </div>

          {/* 타이틀 하단 탭 (텍스트-only 스타일) */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="h-auto bg-transparent p-0 gap-8 shadow-none border-0 rounded-none">
                <TabsTrigger
                  value="accounts"
                  className="px-0 py-2 text-lg bg-transparent border-0 shadow-none outline-none ring-0 focus-visible:ring-0 focus:outline-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 data-[state=active]:font-extrabold data-[state=inactive]:text-muted-foreground data-[state=active]:text-foreground data-[state=active]:underline underline-offset-8 cursor-pointer"
                >
                  계정관리
                </TabsTrigger>
                <TabsTrigger
                  value="teams"
                  className="px-0 py-2 text-lg bg-transparent border-0 shadow-none outline-none ring-0 focus-visible:ring-0 focus:outline-none data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-0 data-[state=active]:font-extrabold data-[state=inactive]:text-muted-foreground data-[state=active]:text-foreground data-[state=active]:underline underline-offset-8 cursor-pointer"
                >
                  부서/팀관리
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* 버튼들 - 모바일에서는 탭 아래로 */}
            <div className="flex flex-row gap-2 lg:gap-3 justify-end">
            {activeTab === "teams" && (
              <Button 
                size="lg" 
                className="text-white shadow-none rounded-lg w-32 hover:opacity-90" 
                style={{backgroundColor: '#063a73'}}
                onClick={() => setAddTeamOpen(true)}
              >
                <Users className="h-4 w-4" />
                팀 만들기
              </Button>
            )}
            {activeTab === "accounts" && (
              <>
                <Dialog open={permissionModalOpen} onOpenChange={setPermissionModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="shadow-none rounded-lg border-gray-400">
                      <Shield className="h-4 w-4" />
                      권한 설정
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] lg:max-w-[1000px] h-[90vh] flex flex-col">
                    <DialogHeader className="flex-shrink-0 pb-2">
                      <DialogTitle className="text-xl font-semibold">권한 설정</DialogTitle>
                      <p className="text-sm text-gray-600 mt-1">권한 카테고리를 선택 후 메뉴를 추가해주세요</p>
                    </DialogHeader>
                    
                    <div className="flex-1 overflow-y-auto py-2">
                      <div className="flex flex-col lg:flex-row gap-0 lg:gap-4 h-full">
                        {/* 왼쪽: 메뉴 접근 권한 (5/11) */}
                        <div className="w-full lg:w-[40%]">
                          <div className="border border-gray-200 rounded-2xl p-6 space-y-6 bg-blue-50/30 h-full flex flex-col">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900 pb-0">메뉴 접근 권한</h3>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="shadow-none"
                                onClick={() => {
                                  // 현재 모든 메뉴가 선택되어 있으면 전체 해제, 아니면 전체 선택
                                  const isAllSelected = ALL_MENU_IDS.every(id => selectedMenus.has(id))
                                  
                                  if (isAllSelected) {
                                    setSelectedMenus(new Set())
                                  } else {
                                    setSelectedMenus(new Set(ALL_MENU_IDS))
                                  }
                                }}
                              >
                                {selectedMenus.size === ALL_MENU_IDS.length ? "전체 해제" : "전체 선택"}
                              </Button>
                            </div>
                            <div className="flex-1 min-h-0 overflow-y-auto">
                              <div className="grid grid-cols-2 gap-3 pr-2">
                                {MENU_OPTIONS.map((menu) => (
                                  <div key={menu.id} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={menu.id}
                                      checked={selectedMenus.has(menu.id)}
                                      onCheckedChange={(checked) => {
                                        const newSelected = new Set(selectedMenus)
                                        if (checked) {
                                          newSelected.add(menu.id)
                                        } else {
                                          newSelected.delete(menu.id)
                                        }
                                        setSelectedMenus(newSelected)
                                      }}
                                    />
                                    <Label htmlFor={menu.id} className="text-sm text-gray-600">{menu.label}</Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 중간: 추가하기 버튼 (1/11) */}
                        <div className="w-full lg:w-[10%] flex flex-row lg:flex-col items-center justify-center lg:justify-center py-2 lg:py-0">
                          <Button 
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-lg shadow-sm"
                            disabled={selectedCategories.size === 0 || selectedMenus.size === 0}
                            onClick={() => {
                              if (selectedCategories.size > 0 && selectedMenus.size > 0) {
                                // 선택된 모든 카테고리에 선택된 메뉴들 추가하는 로직
                                const menuLabels = Array.from(selectedMenus).map(menuId => MENU_LABEL_MAP[menuId] || menuId)
                                
                                setCategoryPermissions(prev => {
                                  const newPermissions = { ...prev }
                                  selectedCategories.forEach(categoryId => {
                                    // 기존 권한과 중복되지 않는 권한만 추가
                                    const existingPermissions = newPermissions[categoryId] || []
                                    const uniqueMenuLabels = menuLabels.filter(label => !existingPermissions.includes(label))
                                    newPermissions[categoryId] = [...existingPermissions, ...uniqueMenuLabels]
                                  })
                                  return newPermissions
                                })
                                
                                setSelectedMenus(new Set())
                                setSelectedCategories(new Set())
                              }
                            }}
                          >
                            <span className="hidden lg:inline">추가 →</span>
                            <span className="lg:hidden">↓ 추가</span>
                          </Button>
                          {selectedCategories.size === 0 && (
                            <p className="text-xs text-gray-500 text-center mt-2 hidden lg:block">카테고리 선택</p>
                          )}
                          {selectedMenus.size === 0 && selectedCategories.size > 0 && (
                            <p className="text-xs text-gray-500 text-center mt-2 hidden lg:block">메뉴 선택 필요</p>
                          )}
                        </div>

                        {/* 오른쪽: 권한 카테고리 관리 (5/11) */}
                        <div className="w-full lg:w-[50%]">
                          <div className="border border-gray-200 rounded-2xl p-6 space-y-6 bg-blue-50/30 h-full flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-900 pb-0">권한 카테고리 관리</h3>
                            
                            {/* 권한 카테고리 목록 */}
                            <div className="flex-1 min-h-0">
                              <div className="h-full overflow-y-auto space-y-3 pr-2">
                                {[
                                  { id: "admin", name: "전체 관리자", color: "bg-red-50 text-red-700 border border-red-200" },
                                  { id: "manager", name: "중간 관리자", color: "bg-blue-50 text-blue-700 border border-blue-200" },
                                  { id: "user", name: "실무자", color: "bg-emerald-50 text-emerald-700 border border-emerald-200" }
                                ].map((permission, index) => (
                                  <div 
                                    key={index}
                                    className={`rounded-lg border cursor-pointer transition-all ${
                                      selectedCategories.has(permission.id)
                                        ? 'bg-blue-50 border-blue-300' 
                                        : 'bg-white border-gray-200 hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                      const newSelected = new Set(selectedCategories)
                                      if (newSelected.has(permission.id)) {
                                        newSelected.delete(permission.id)
                                      } else {
                                        newSelected.add(permission.id)
                                      }
                                      setSelectedCategories(newSelected)
                                    }}
                                  >
                                    {/* 카테고리 헤더 */}
                                    <div className="flex items-center justify-between p-3">
                                      <Badge variant="secondary" className={`${permission.color} text-xs flex items-center gap-1`}>
                                        {permission.id === "admin" && <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                                        {permission.name}
                                      </Badge>
                                      <div className="flex items-center justify-center w-5 h-5">
                                        <svg className={`w-4 h-4 transition-colors ${
                                          selectedCategories.has(permission.id)
                                            ? 'text-primary' 
                                            : 'text-gray-400'
                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </div>
                                    </div>
                                    
                                    {/* 보더 라인 */}
                                    <div className="border-t border-gray-200 mx-3"></div>
                                    
                                    {/* 추가된 권한 라벨들 또는 기본 메시지 */}
                                    {categoryPermissions[permission.id] && categoryPermissions[permission.id].length > 0 ? (
                                      <div className="p-3 pt-2">
                                        <div className="flex flex-wrap gap-1">
                                          {categoryPermissions[permission.id].map((permissionLabel, idx) => (
                                            <span 
                                              key={idx}
                                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700 border hover:bg-gray-200 transition-colors"
                                            >
                                              {permissionLabel}
                                              <button
                                                onClick={() => {
                                                  setCategoryPermissions(prev => ({
                                                    ...prev,
                                                    [permission.id]: prev[permission.id].filter((_, index) => index !== idx)
                                                  }))
                                                }}
                                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
                                              >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                              </button>
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="p-3 pt-2">
                                        <p className="text-sm text-gray-400 text-center">권한을 추가하세요</p>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 하단 액션 버튼 */}
                    <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t bg-white">
                      <Button 
                        onClick={() => {
                          setPermissionModalOpen(false)
                          setNewPermissionName("")
                          setSelectedMenus(new Set())
                          setSelectedCategories(new Set())
                          setCategoryPermissions({
                            admin: [],
                            manager: [],
                            user: []
                          })
                        }} 
                        className="w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
                      >
                        취소
                      </Button>
                      <Button 
                        onClick={() => {
                          // 권한 설정 저장 로직 구현
                          showSuccessToast("권한 설정이 저장되었습니다")
                          setPermissionModalOpen(false)
                          setNewPermissionName("")
                          setSelectedMenus(new Set())
                          setSelectedCategories(new Set())
                        }}
                        className="w-20 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg"
                      >
                        저장
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              <Dialog open={inviteMemberOpen} onOpenChange={setInviteMemberOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary text-primary-foreground shadow-none rounded-lg w-32">
                    멤버초대
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[95vw] sm:max-w-lg flex flex-col p-0 gap-0 overflow-hidden">
                  {!linkSettingStep ? (
                    <>
                  <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 bg-white z-10">
                    <DialogTitle className="text-xl font-bold m-0">워크스페이스(으)로 사용자 초대</DialogTitle>
                  </DialogHeader>
                  
                  <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/10">
                    <div className="space-y-6">
                      {/* 초대받을 사람 */}
                      <div className="space-y-3">
                        <Label htmlFor="inviteEmail" className="text-[15px] font-medium text-gray-800">초대받을 사람:</Label>
                        <div className="border border-gray-300 rounded-md p-2 bg-white min-h-[42px] max-h-[160px] overflow-y-auto flex flex-wrap items-center gap-1 focus-within:border-ring">
                          {/* 이메일 태그들 */}
                          {inviteEmails.map((email, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                            >
                              <span>{email}</span>
                              <button
                                type="button"
                                onClick={() => removeEmail(email)}
                                className="hover:bg-blue-200 rounded-full p-0.5 ml-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                          {/* 이메일 입력 필드 */}
                          <input
                            type="email"
                            value={currentEmail}
                            onChange={handleEmailChange}
                            onKeyDown={handleEmailKeyPress}
                            onPaste={handleEmailPaste}
                            onBlur={() => {
                              if (currentEmail.trim()) {
                                // 쉼표가 있으면 다중 처리, 아니면 단일 처리
                                if (currentEmail.includes(',')) {
                                  addMultipleEmails(currentEmail)
                                } else {
                                addEmail(currentEmail)
                                }
                              }
                            }}
                            placeholder={inviteEmails.length === 0 ? "이메일 입력 후 엔터 또는 쉼표로 여러개 등록 가능" : ""}
                            className="flex-1 min-w-[200px] outline-none bg-transparent placeholder:text-gray-400 text-sm"
                          />
                        </div>
                        {inviteEmails.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="font-semibold text-gray-700">{inviteEmails.length}명</span>의 사용자를 초대합니다. 엔터를 눌러 이메일을 추가하거나 쉼표로 구분하여 여러 이메일을 입력하세요.
                          </div>
                        )}
                      </div>


                      {/* 다음 역할로 초대합니다 */}
                      <div className="space-y-3">
                        <Label className="text-[15px] font-medium text-gray-800">다음 역할로 초대합니다:</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger className="bg-white w-full border-gray-300">
                            <SelectValue placeholder="역할 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="실무자">실무자</SelectItem>
                            <SelectItem value="중간 관리자">중간 관리자</SelectItem>
                            <SelectItem value="관리자">관리자</SelectItem>
                          </SelectContent>
                        </Select>
                        </div>
                    </div>
                  </div>

                  {/* 하단 액션 버튼 */}
                  <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-t bg-white">
                    <div className="flex items-center">
                      <button 
                        onClick={() => {
                          // 모달과 독립적으로 토스트 실행
                          showSuccessToast('링크가 복사됐습니다')
                        }}
                        className="text-blue-600 p-0 h-auto bg-transparent border-none cursor-pointer hover:!bg-transparent hover:!text-blue-600 inline-flex items-center gap-1 text-sm"
                      >
                        <LinkIcon className="h-4 w-4" />
                        초대 링크 복사
                      </button>
                      <div className="w-[10px] h-px bg-gray-500 mx-1"></div>
                      <button 
                        onClick={() => setLinkSettingStep(true)}
                        className="text-gray-500 p-0 h-auto pl-0 bg-transparent border-none cursor-pointer hover:!bg-transparent hover:!text-gray-500 text-sm"
                      >
                        링크 설정 편집
                      </button>
                    </div>
                    <Button 
                      className="h-11 sm:h-12 bg-primary hover:bg-primary/90 text-white rounded-lg px-6"
                      disabled={inviteEmails.length === 0}
                      onClick={() => {
                        // 멤버 초대 로직 구현
                        console.log('초대할 이메일들:', inviteEmails)
                        setInviteMemberOpen(false)
                        setInviteEmails([])
                        setCurrentEmail("")
                      }}
                    >
                      보내기
                    </Button>
                  </div>
                  </>
                  ) : (
                    <>
                  {/* 링크 설정 단계 */}
                  <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 bg-white z-10">
                    <div>
                      <DialogTitle className="text-xl font-bold m-0 mb-2">초대 링크 설정</DialogTitle>
                      <p className="text-sm text-gray-600 font-normal m-0">
                        초대 링크는 최대 400명의 사람들과 공유할 수 있습니다. 워크스페이스의 개인 정보를 보호하려면 이 링크를 조직에 소속된 사람들과만 공유하세요.
                      </p>
                    </div>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/10">
                    <div className="space-y-6">
                      {/* 만료 기간 설정 */}
                      <div className="space-y-3">
                        <Label className="text-[15px] font-medium text-gray-800">다음 기간 이후에 링크가 만료됩니다:</Label>
                        <Select value={linkExpiration} onValueChange={setLinkExpiration}>
                          <SelectTrigger className="bg-white shadow-none w-full border-gray-300">
                            <SelectValue placeholder="만료 기간 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1일">1일</SelectItem>
                            <SelectItem value="7일">7일</SelectItem>
                            <SelectItem value="30일">30일</SelectItem>
                            <SelectItem value="절대 만료되지 않음">절대 만료되지 않음</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* 하단 액션 버튼 */}
                  <div className="flex-shrink-0 flex justify-between items-center px-6 py-4 border-t bg-white">
                    <Button variant="outline" className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300">
                      링크 비활성화
                    </Button>
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        onClick={() => setLinkSettingStep(false)}
                        className="hover:bg-gray-50"
                      >
                        취소
                      </Button>
                      <Button 
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => {
                          setLinkSettingStep(false)
                        }}
                      >
                        저장
                      </Button>
                    </div>
                  </div>
                  </>
                  )}
                </DialogContent>
              </Dialog>
              </>
            )}
            </div>
          </div>

          {/* 상단 고정 툴바 제거: 검색/필터는 상태 카드 아래로 이동 */}

          {activeTab === "accounts" && (
          <>
          <StatusSummaryCards
            statusCounts={{
              "전체 계정": 20,
              "활성 계정": 16,
              "비활성": 3,
              "관리자": 5
            }}
            activeFilter={activeAccountFilter}
            onFilterChange={setActiveAccountFilter}
            descriptions={{
              "전체 계정": "등록된 계정 수",
              "활성 계정": "활성화된 계정",
              "비활성": "비활성 계정",
              "관리자": "관리자 계정"
            }}
            className="w-full"
            variant="four-columns"
          />

          {/* 검색 및 필터 */}
          <SearchFilterPanel
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            searchPlaceholder="이름, 이메일, 부서로 검색"
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={statusOptions}
            statusLabel="계정상태"
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


          <DataTable
            data={paginatedAccounts}
            columns={accountColumns}
            title="계정 목록"
            totalCount={filteredAccounts.length}
            sortValue={accountSort}
            onSortChange={setAccountSort}
            sortOptions={sortOptions}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            renderMobileCard={renderAccountMobileCard}
            showPagination={totalPages > 1}
          />
          </>
          )}

          {activeTab === "teams" && (
          <>

            {/* 팀 검색 폼 */}
            <SingleSearchForm
              searchTerm={teamSearchTerm}
              onSearchTermChange={setTeamSearchTerm}
              searchPlaceholder="팀명, 구성원으로 검색"
              selectedCategory={teamSearchCategory}
              onCategoryChange={setTeamSearchCategory}
              categoryOptions={teamCategoryOptions}
              selectPlaceholder="항목"
              onSearch={handleTeamSearch}
              selectWidth="140px"
            />

            <DataTable
              data={showEmptyTeamState ? [] : sortedTeamData}
              extraButtons={
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="shadow-none border-gray-400"
                    onClick={() => setShowEmptyTeamState(!showEmptyTeamState)}
                  >
                    {showEmptyTeamState ? "데이터 보기" : "빈 상태 보기"}
                  </Button>
                </div>
              }
              columns={[
                {
                  key: "name",
                  label: "팀명",
                  width: "w-32",
                  render: (team) => (
                    <div className="font-medium text-gray-900">
                      {team.name}
                    </div>
                  ),
                },
                {
                  key: "leader",
                  label: "팀장",
                  width: "w-28",
                  render: (team) => (
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-amber-500" />
                      <span className={`text-sm ${team.leader === "-" ? "text-gray-400" : "text-gray-700"}`}>{team.leader === "-" ? "미정" : team.leader}</span>
                    </div>
                  ),
                },
                {
                  key: "members",
                  label: "구성원",
                  width: "w-24",
                  render: (team) => (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className={`text-sm ${team.members === 0 ? "text-gray-400" : "text-gray-700"}`}>{team.members}명</span>
                    </div>
                  ),
                },
                {
                  key: "description",
                  label: "설명",
                  render: (team) => (
                    <div className={`text-sm truncate ${team.description === "-" ? "text-gray-400" : "text-gray-600"}`} title={team.description}>
                      {team.description}
                    </div>
                  ),
                },
                {
                  key: "actions",
                  label: "관리",
                  width: "w-48",
                  align: "center",
                  render: (team) => (
                    <div className="flex items-center justify-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2 shadow-none"
                        onClick={() => setViewMembersOpen(true)}
                      >
                        <Users className="h-4 w-4" />
                        구성원
                      </Button>
                      <div className="relative" ref={openDropdownIndex === team.id ? dropdownRef : null}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDropdownIndex(openDropdownIndex === team.id ? null : team.id)
                          }}
                        >
                          <MoreVertical className="size-[15px]" />
                        </Button>
                        
                        {openDropdownIndex === team.id && (
                          <div className="absolute right-0 top-9 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setAddMemberOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                setAddMemberOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-blue-600 hover:bg-blue-50 active:bg-blue-100"
                            >
                              <Plus className="h-4 w-4" />
                              추가
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTeamForAction(team)
                                setEditTeamOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                setSelectedTeamForAction(team)
                                setEditTeamOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-gray-700 active:bg-gray-100"
                            >
                              <Pencil className="h-4 w-4" />
                              팀정보 수정
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTeamForAction(team)
                                setDeleteTeamOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                setSelectedTeamForAction(team)
                                setDeleteTeamOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 active:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                              팀 삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                },
              ]}
              title="팀 목록"
              totalCount={showEmptyTeamState ? 0 : sortedTeamData.length}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
              showPagination={false}
              sortValue={teamSort}
              onSortChange={setTeamSort}
              sortOptions={teamSortOptions}
              isLoading={isTeamLoading}
              skeletonRows={5}
              renderMobileCard={(team) => (
                <div className="border rounded-xl divide-y bg-white relative">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-medium">{team.name}</div>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className={`text-xs ${team.members === 0 ? "text-gray-400" : "text-muted-foreground"}`}>{team.members}명</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Crown className="h-3 w-3 text-amber-500" />
                        <span className={`text-xs ${team.leader === "-" ? "text-gray-400" : "text-muted-foreground"}`}>{team.leader === "-" ? "미정" : team.leader}</span>
                      </div>
                    </div>
                      {team.description && team.description !== "-" && (
                        <div className="mt-2 text-xs text-gray-500 line-clamp-2">
                          {team.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2 shadow-none"
                        onClick={() => setViewMembersOpen(true)}
                      >
                        <Users className="h-4 w-4" />
                        구성원
                      </Button>
                      <div className="relative" ref={openDropdownIndex === team.id ? dropdownRef : null}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenDropdownIndex(openDropdownIndex === team.id ? null : team.id)
                          }}
                        >
                          <MoreVertical className="size-[15px]" />
                        </Button>
                        
                        {openDropdownIndex === team.id && (
                          <div className="absolute right-0 top-9 w-36 bg-white border border-gray-300 rounded-lg shadow-lg z-[9999] py-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setAddMemberOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                setAddMemberOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-blue-600 hover:bg-blue-50 active:bg-blue-100"
                            >
                              <Plus className="h-4 w-4" />
                              추가
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTeamForAction(team)
                                setEditTeamOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                setSelectedTeamForAction(team)
                                setEditTeamOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-gray-700 active:bg-gray-100"
                            >
                              <Pencil className="h-4 w-4" />
                              팀정보 수정
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTeamForAction(team)
                                setDeleteTeamOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation()
                                setSelectedTeamForAction(team)
                                setDeleteTeamOpen(true)
                                setOpenDropdownIndex(null)
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer text-red-600 hover:bg-red-50 active:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4" />
                              팀 삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            />
          </>
          )}

          {/* 구성원 관리 모달 - 최상위 레벨로 이동 */}
          <Dialog open={viewMembersOpen} onOpenChange={setViewMembersOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[512px] h-[90vh] max-h-[760px] flex flex-col p-0 overflow-hidden">
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white">
                <DialogTitle className="text-xl font-semibold">팀 구성원 관리</DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden flex flex-col px-6 py-0 bg-muted/10">
                <div className="flex flex-col h-full space-y-4">
                  {/* 팀원 검색 */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
                    <SearchForm
                      placeholder="팀원을 검색하세요"
                      value={memberSearchTerm}
                      onChange={(value) => setMemberSearchTerm(value)}
                    />
                  </div>

                  {/* 구성원 리스트 */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
                    <div className="bg-gray-50 px-3 sm:px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">구성원 리스트 ({teamMembers.length}명)</h3>
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg gap-2"
                        onClick={() => {
                          setViewMembersOpen(false)
                          setAddMemberOpen(true)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                        팀원 추가
                      </Button>
                    </div>
                    <div className="divide-y overflow-y-auto flex-1">
                      {teamMembers.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                          <p>구성원이 없습니다.</p>
                        </div>
                      ) : (
                        teamMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 hover:bg-gray-50"
                        >
                          <div className="flex items-start gap-2 sm:gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/icons/icon-user-m.png" />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="font-medium text-sm sm:text-base">{member.name}</span>
                                {member.role === "팀장" && <Crown className="h-3 w-3 text-amber-500" />}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-3 justify-start sm:justify-end w-full sm:w-auto pl-10 sm:pl-0">
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">{member.role}</Badge>
                            <Badge className="bg-green-100 text-green-800 text-xs">{member.status}</Badge>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => {
                                handleDeleteMember(member.id)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 액션 버튼 */}
              <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t bg-white">
                <Button 
                  onClick={() => setViewMembersOpen(false)} 
                  className="w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
                >
                  취소
                </Button>
                <Button 
                  disabled={teamMembers.length === initialTeamMembers.length}
                  onClick={() => {
                    // 팀원 관리 수정 로직 구현
                    showSuccessToast("팀원 관리가 수정되었습니다")
                    setViewMembersOpen(false)
                  }}
                  className="w-20 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  수정
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 팀원 추가 모달 */}
          <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[512px] h-[90vh] max-h-[800px] flex flex-col p-0 gap-0 overflow-hidden">
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white z-10">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 text-gray-600 hover:bg-transparent hover:text-gray-600"
                    onClick={() => {
                      setAddMemberOpen(false)
                      setViewMembersOpen(true)
                    }}
                  >
                    <ChevronLeft style={{ width: '24px', height: '24px' }} />
                  </Button>
                  <DialogTitle className="text-xl font-semibold">팀원 추가</DialogTitle>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-hidden flex flex-col px-6 py-6 bg-muted/10">
                <div className="flex flex-col h-full space-y-4">
                  {/* 검색 바 */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="relative flex-1">
                      <Input 
                        placeholder="이름, 이메일로 사원을 검색하세요" 
                        value={employeeSearchTerm}
                        onChange={(e) => setEmployeeSearchTerm(e.target.value)}
                        className="pr-10 shadow-none bg-white focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-transparent"
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>

                  {/* 사원 리스트 */}
                  <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1 min-h-0">
                    <div className="bg-gray-50 px-3 sm:px-4 py-3 border-b flex-shrink-0">
                      <h3 className="text-base font-semibold text-gray-900">등록된 사원 ({selectedMembers.size}명)</h3>
                    </div>
                    <div className="divide-y overflow-y-auto flex-1">
                      {[
                        { id: 1, name: "김철수", email: "kim@company.com", department: "마케팅1팀", position: "팀장" },
                        { id: 2, name: "이영희", email: "lee@company.com", department: "마케팅2팀", position: "팀원" },
                        { id: 3, name: "박민수", email: "park@company.com", department: "광고운영팀", position: "팀원" },
                        { id: 4, name: "정지은", email: "jung@company.com", department: "개발QA팀", position: "팀원" },
                        { id: 5, name: "최현우", email: "choi@company.com", department: "마케팅1팀", position: "팀원" },
                        { id: 6, name: "강수진", email: "kang@company.com", department: "마케팅2팀", position: "팀원" },
                        { id: 7, name: "윤태호", email: "yoon@company.com", department: "광고운영팀", position: "팀원" },
                        { id: 8, name: "한소영", email: "han@company.com", department: "개발QA팀", position: "팀원" }
                      ].map((employee) => (
                        <div 
                          key={employee.id} 
                          className="flex items-center justify-between p-3 sm:p-4 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            const newSelected = new Set(selectedMembers)
                            if (selectedMembers.has(employee.id)) {
                              newSelected.delete(employee.id)
                            } else {
                              newSelected.add(employee.id)
                            }
                            setSelectedMembers(newSelected)
                          }}
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Checkbox 
                              id={`employee-${employee.id}`}
                              checked={selectedMembers.has(employee.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(selectedMembers)
                                if (checked) {
                                  newSelected.add(employee.id)
                                } else {
                                  newSelected.delete(employee.id)
                                }
                                setSelectedMembers(newSelected)
                              }}
                            />
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/icons/icon-user-m.png" />
                              <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm sm:text-base">{employee.name}</div>
                              <div className="text-xs sm:text-sm text-muted-foreground">{employee.email}</div>
                              <div className="text-xs text-muted-foreground">{employee.position}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 액션 버튼 */}
              <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t bg-white">
                <Button 
                  onClick={() => {
                    setAddMemberOpen(false)
                    setSelectedMembers(new Set())
                    setEmployeeSearchTerm("")
                  }} 
                  className="w-20 py-3 h-10 sm:h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
                >
                  취소
                </Button>
                <Button 
                  disabled={selectedMembers.size === 0}
                  onClick={() => {
                    // 선택된 사원들을 팀에 추가하는 로직
                    showSuccessToast(`${selectedMembers.size}명의 팀원이 추가되었습니다`)
                    setAddMemberOpen(false)
                    setSelectedMembers(new Set())
                    setEmployeeSearchTerm("")
                  }}
                  className="w-20 py-3 h-10 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg"
                >
                  추가
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 팀 추가 모달 */}
          <TeamModal
            isOpen={addTeamOpen}
            onClose={() => setAddTeamOpen(false)}
            onSubmit={(data) => {
              // 팀 추가 로직 구현
              console.log('새 팀 데이터:', data)
              showSuccessToast("팀이 성공적으로 추가되었습니다")
              setAddTeamOpen(false)
            }}
            mode="add"
          />

          {/* 팀 정보 수정 모달 */}
          <TeamModal
            isOpen={editTeamOpen}
            onClose={() => setEditTeamOpen(false)}
            onSubmit={(data) => {
              // 팀 수정 로직 구현
              console.log('수정된 팀 데이터:', data)
              showSuccessToast("팀 정보가 성공적으로 수정되었습니다")
              setEditTeamOpen(false)
              setSelectedTeamForAction(null)
            }}
            mode="edit"
            initialData={selectedTeamForAction ? {
              name: selectedTeamForAction.name,
              leader: selectedTeamForAction.leader,
              description: selectedTeamForAction.description,
              members: []
            } : undefined}
          />

          {/* 팀 삭제 확인 모달 */}
          <Dialog open={deleteTeamOpen} onOpenChange={setDeleteTeamOpen}>
            <DialogContent className="rounded-xl p-6" style={{ maxWidth: "360px" }}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  팀 삭제
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-4 text-center">
                <p className="text-[16px] text-gray-500 leading-relaxed">
                  <span className="font-semibold">{selectedTeamForAction?.name}</span> 팀을 삭제하시겠습니까?
                  <br />
                  <span className="text-red-600">이 작업은 되돌릴 수 없습니다.</span>
                </p>
              </div>

              <DialogFooter className="gap-2 flex-row">
                <Button
                  variant="outline"
                  className="h-11 sm:h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 rounded-xl flex-1"
                  onClick={() => setDeleteTeamOpen(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={() => {
                    // 팀 삭제 로직 구현
                    showSuccessToast(`${selectedTeamForAction?.name} 팀이 삭제되었습니다`)
                    setDeleteTeamOpen(false)
                    setSelectedTeamForAction(null)
                  }}
                  className="h-11 sm:h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1"
                >
                  삭제하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 계정 상세정보 모달 */}
          <Dialog open={accountDetailOpen} onOpenChange={setAccountDetailOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[450px] lg:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white z-10">
                <DialogTitle className="text-xl font-semibold">계정 상세정보</DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/10">
                {selectedAccount && (
                  <div className="space-y-3 sm:space-y-4">
                    {/* 기본 정보 및 계정 정보 통합 */}
                    <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">기본 정보</h3>
                      
                      {/* 프로필 정보 */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border border-gray-200 rounded-full bg-blue-100">
                          <AvatarImage src={selectedAccount.avatar} className="rounded-full" />
                          <AvatarFallback className="text-xs sm:text-sm rounded-full bg-blue-100 text-blue-700">{selectedAccount.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedAccount.name}</h4>
                            {selectedAccount.permission === "전체 관리자" && (
                              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{selectedAccount.email}</p>
                        </div>
                      </div>

                      {/* 상세 정보 세로 정렬 */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-500 w-24 text-right">부서</Label>
                          <span className="text-sm font-medium text-gray-700">{selectedAccount.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-500 w-24 text-right">직급</Label>
                          <span className="text-sm font-medium text-gray-700">{selectedAccount.position}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-500 w-24 text-right">계정 상태</Label>
                          <Badge className={`${selectedAccount.statusColor} text-xs`}>
                            {selectedAccount.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-500 w-24 text-right">권한</Label>
                          <Badge variant="secondary" className={`${selectedAccount.permissionColor} text-xs`}>
                            {selectedAccount.permission}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-500 w-24 text-right">가입일</Label>
                          <span className="text-sm font-medium text-gray-700">{selectedAccount.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* 최근 활동 (예시 데이터) */}
                    <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">최근 활동</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">로그인</p>
                            <p className="text-xs text-gray-500">2024-01-15 09:30</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">권한 변경</p>
                            <p className="text-xs text-gray-500">2024-01-10 11:15</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 액션 버튼 */}
              <div className="flex-shrink-0 flex justify-end px-6 py-3 border-t bg-white">
                <Button 
                  onClick={() => setAccountDetailOpen(false)} 
                  className="w-20 py-3 h-10 sm:h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
                >
                  닫기
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 계정 수정 모달 */}
          <Dialog open={accountEditOpen} onOpenChange={setAccountEditOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[450px] lg:max-w-[500px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
              <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white z-10">
                <DialogTitle className="text-xl font-semibold">계정 정보 수정</DialogTitle>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/10">
                {selectedAccount && (
                  <div className="space-y-3 sm:space-y-4">
                    {/* 기본 정보 및 계정 정보 통합 */}
                    <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">기본 정보</h3>
                      
                      {/* 프로필 정보 */}
                      <div className="flex flex-row items-center gap-3 sm:gap-4 mb-6">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 border border-gray-200 rounded-full bg-blue-100">
                          <AvatarImage src={selectedAccount.avatar} className="rounded-full" />
                          <AvatarFallback className="text-xs sm:text-sm rounded-full bg-blue-100 text-blue-700">{selectedAccount.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedAccount.name}</h4>
                            {selectedAccount.permission === "전체 관리자" && (
                              <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">{selectedAccount.email}</p>
                        </div>
                      </div>

                      {/* 수정 가능한 정보 */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-500 w-24 text-right">부서</Label>
                          <span className="text-sm font-medium text-gray-700">{selectedAccount.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-gray-500 w-24 text-right">직급</Label>
                          <Select value={editPosition} onValueChange={setEditPosition}>
                            <SelectTrigger className="w-32 h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="대표">대표</SelectItem>
                              <SelectItem value="팀장">팀장</SelectItem>
                              <SelectItem value="차장">차장</SelectItem>
                              <SelectItem value="과장">과장</SelectItem>
                              <SelectItem value="대리">대리</SelectItem>
                              <SelectItem value="사원">사원</SelectItem>
                              <SelectItem value="인턴">인턴</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 메뉴 접근 권한 섹션 */}
                    <div className="border border-gray-200 rounded-xl p-4 sm:p-6 bg-white">
                      {/* 섹션 헤더 */}
                      <div className="mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">메뉴 접근 권한</h3>
                        <p className="text-xs text-gray-500">
                          {editPermission === "전체 관리자" && "모든 메뉴에 접근 가능합니다"}
                          {editPermission === "중간 관리자" && "관리 기능까지 접근 가능합니다"}
                          {editPermission === "실무자" && "기본 업무 메뉴에 접근 가능합니다"}
                        </p>
                      </div>
                      
                      {/* 권한 설정 */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                            <Label className="text-sm font-medium text-gray-700">권한 레벨</Label>
                            <div className="flex items-center gap-3">
                              <Select value={editPermission} onValueChange={(value) => {
                                setEditPermission(value)
                                // 권한 변경 시 메뉴 접근 권한 자동 설정
                                if (value === "전체 관리자") {
                                  setEditSelectedMenus(new Set(ALL_MENU_IDS))
                                } else if (value === "중간 관리자") {
                                  setEditSelectedMenus(new Set([
                                    "dashboard", "contract", "business", "posting", "keyword"
                                  ]))
                                } else if (value === "실무자") {
                                  setEditSelectedMenus(new Set([
                                    "dashboard", "contract", "business"
                                  ]))
                                }
                              }}>
                                <SelectTrigger className="w-full sm:w-40 h-9 text-sm bg-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="전체 관리자">전체 관리자</SelectItem>
                                  <SelectItem value="중간 관리자">중간 관리자</SelectItem>
                                  <SelectItem value="실무자">실무자</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="shadow-none w-20 h-9"
                                onClick={() => {
                                  // 현재 모든 메뉴가 선택되어 있으면 전체 해제, 아니면 전체 선택
                                  const isAllSelected = ALL_MENU_IDS.every(id => editSelectedMenus.has(id))
                                  
                                  if (isAllSelected) {
                                    setEditSelectedMenus(new Set())
                                  } else {
                                    setEditSelectedMenus(new Set(ALL_MENU_IDS))
                                  }
                                }}
                              >
                                {editSelectedMenus.size === ALL_MENU_IDS.length ? "전체 해제" : "전체 선택"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 메뉴 목록 */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-3">접근 가능한 메뉴</h4>
                        <div className="grid grid-cols-2 gap-3">
                        {MENU_OPTIONS.map((menu) => (
                          <div key={menu.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`edit-${menu.id}`}
                              checked={editSelectedMenus.has(menu.id)}
                              onCheckedChange={(checked) => {
                                const newSelected = new Set(editSelectedMenus)
                                if (checked) {
                                  newSelected.add(menu.id)
                                } else {
                                  newSelected.delete(menu.id)
                                }
                                setEditSelectedMenus(newSelected)
                              }}
                            />
                            <Label htmlFor={`edit-${menu.id}`} className="text-sm text-gray-600">{menu.label}</Label>
                          </div>
                        ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 하단 액션 버튼 */}
              <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t bg-white">
                <Button 
                  onClick={() => {
                    setAccountEditOpen(false)
                    setEditPosition("")
                    setEditPermission("")
                    setEditSelectedMenus(new Set())
                  }} 
                  className="w-20 py-3 h-10 sm:h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
                >
                  취소
                </Button>
                <Button 
                  onClick={() => {
                    // 계정 수정 로직 구현
                    console.log('수정된 계정 정보:', {
                      account: selectedAccount,
                      position: editPosition,
                      permission: editPermission,
                      selectedMenus: Array.from(editSelectedMenus)
                    })
                    showSuccessToast("계정 정보가 수정되었습니다")
                    setAccountEditOpen(false)
                    setEditPosition("")
                    setEditPermission("")
                    setEditSelectedMenus(new Set())
                  }}
                  className="w-20 py-3 h-10 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg"
                >
                  저장
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 계정 삭제 확인 모달 */}
          <Dialog open={accountDeleteOpen} onOpenChange={setAccountDeleteOpen}>
            <DialogContent className="rounded-xl p-6" style={{ maxWidth: "360px" }}>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  계정 삭제
                </DialogTitle>
              </DialogHeader>
              
              <div className="py-4 text-center">
                <p className="text-[16px] text-gray-500 leading-relaxed">
                  <span className="font-semibold">{selectedAccount?.name}</span> 계정을 삭제하시겠습니까?
                  <br />
                  <span className="text-red-600">이 작업은 되돌릴 수 없습니다.</span>
                </p>
              </div>

              <DialogFooter className="gap-2 flex-row">
                <Button
                  variant="outline"
                  className="h-11 sm:h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 rounded-xl flex-1"
                  onClick={() => setAccountDeleteOpen(false)}
                >
                  취소
                </Button>
                <Button
                  onClick={() => {
                    // 계정 삭제 로직 구현
                    showSuccessToast(`${selectedAccount?.name} 계정이 삭제되었습니다`)
                    setAccountDeleteOpen(false)
                    setSelectedAccount(null)
                  }}
                  className="h-11 sm:h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl flex-1"
                >
                  삭제하기
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          </>
        )}
        </main>
      </div>
    </div>
  )
}



