"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CommonSelect } from "@/components/ui/common-select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AlertConfirmModal from "@/components/ui/alert-confirm-modal"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sidebar, MobileMenuToggle } from "@/components/sidebar"
import Header from "@/components/header"
import { Menu } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } from "@/lib/toast-utils"
import ContractRegisterModal, { type ContractFormData } from "@/components/contract-register-modal"
import SearchFilterPanel, { type StatusOption, type DateCriteriaOption } from "@/components/ui/search-filter-panel"
import RegionSearch from "@/components/ui/region-search"
import LoadingBar from "@/components/ui/loading-bar"
import LoadingAnimation from "@/components/ui/loading-animation"
import StatusSummaryCards from "@/components/ui/card-status-summary"
import { loadRegionData, createRegionOptions, type RegionData } from "@/lib/regions-data"

import {
  X,
  Home,
  LucideContrast as FileContract,
  Briefcase,
  MessageSquare,
  DollarSign,
  Target,
  Bot,
  Building,
  Crown,
  Bell,
  BookOpen,
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
  Filter,
  Plus,
  PenSquare,
  Calendar as CalendarIcon,
  Phone,
  Mail,
  MapPin,
  Upload,
  TrendingUp,
  TrendingDown,
  Info,
} from "lucide-react"


const notificationData = [
  {
    id: 1,
    label: "공지",
    date: "2024-01-15",
    content: "새로운 기능 업데이트가 완료되었습니다. 더 나은 서비스를 위해 지속적으로 개선하겠습니다.",
    isRead: false,
  },
  {
    id: 2,
    label: "이벤트",
    date: "2024-01-14",
    content: "신규 고객 대상 특별 할인 이벤트가 진행 중입니다. 지금 바로 확인해보세요!",
    isRead: false,
  },
]

// 지역 표시 유틸리티 함수
const formatRegionDisplay = (address: string): string => {
  if (!address) return ""
  
  // 주소에서 지역 정보 추출
  const parts = address.split(' ')
  if (parts.length < 2) return address
  
  const sido = parts[0] // 시도
  const sgg = parts[1]  // 시군구
  
  // 서울특별시인 경우 구단위로 표시
  if (sido === "서울시" || sido === "서울특별시") {
    return sgg // 구로구, 강남구, 강서구, 금천구 등
  }
  
  // 그 외 지역은 시단위로 표시
  return sgg // 계양구, 강화군, 미추홀구 등
}

// 계약 데이터
const contractData = [
  {
    id: "CT-2025-001",
    type: "월계약",
    status: "신규",
    statusColor: "bg-green-100 text-green-800",
    registrationDate: "2025-01-01",
    customer: {
      company: "Smart Tech",
      contact: "김대표",
      phone: "010-1234-5678",
      address: "서울시 강남구 테헤란로 123",
    },
    team: {
      department: "마케팅1팀",
      manager: "박나리",
      sales: "김철수",
    },
    services: ["SEO", "프리미엄"],
    contractAmount: 8500000,
    postingCount: 20,
    adCost: {
      total: 12000000,
      monthly: 1000000,
    },
    period: {
      start: "2025-01-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-002",
    type: "프로젝트",
    status: "연장",
    statusColor: "bg-blue-100 text-blue-800",
    registrationDate: "2025-02-01",
    customer: {
      company: "Green Food",
      contact: "이영희",
      phone: "010-2345-6789",
      address: "부산시 해운대구 센텀중앙로 456",
    },
    team: {
      department: "마케팅2팀",
      manager: "김철수",
      sales: "박민수",
    },
    services: ["SEO"],
    contractAmount: 3200000,
    postingCount: 15,
    adCost: {
      total: 5000000,
      monthly: 1250000,
    },
    period: {
      start: "2025-02-01",
      end: "2025-05-31",
      expired: true,
    },
  },
  {
    id: "CT-2025-003",
    type: "연계약",
    status: "확장",
    statusColor: "bg-purple-100 text-purple-800",
    registrationDate: "2025-01-15",
    customer: {
      company: "Fashion House",
      contact: "정민수",
      phone: "010-3456-7890",
      address: "서울시 종로구 세종대로 789",
    },
    team: {
      department: "마케팅1팀",
      manager: "박나리",
      sales: "김철수",
    },
    services: ["SEO", "프리미엄", "하니탑"],
    contractAmount: 12800000,
    postingCount: 30,
    adCost: {
      total: 18000000,
      monthly: 1500000,
    },
    period: {
      start: "2025-01-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-004",
    type: "월계약",
    status: "신규",
    statusColor: "bg-green-100 text-green-800",
    registrationDate: "2025-03-01",
    customer: {
      company: "Healthcare Plus",
      contact: "최현우",
      phone: "010-4567-8901",
      address: "대구시 수성구 동대구로 321",
    },
    team: {
      department: "마케팅3팀",
      manager: "이지은",
      sales: "강수진",
    },
    services: ["프리미엄"],
    contractAmount: 6700000,
    postingCount: 25,
    adCost: {
      total: 8000000,
      monthly: 800000,
    },
    period: {
      start: "2025-03-01",
      end: "2025-02-28",
      expired: true,
    },
  },
  {
    id: "CT-2025-005",
    type: "프로젝트",
    status: "만료",
    statusColor: "bg-red-100 text-red-800",
    registrationDate: "2024-11-01",
    customer: {
      company: "Tech Solutions",
      contact: "윤태호",
      phone: "010-5678-9012",
      address: "인천시 연수구 컨벤시아대로 654",
    },
    team: {
      department: "마케팅2팀",
      manager: "김철수",
      sales: "박민수",
    },
    services: ["SEO", "하니탑"],
    contractAmount: 5500000,
    postingCount: 18,
    adCost: {
      total: 7500000,
      monthly: 1250000,
    },
    period: {
      start: "2024-11-01",
      end: "2024-12-31",
      expired: true,
    },
  },
  {
    id: "CT-2025-006",
    type: "연계약",
    status: "연장",
    statusColor: "bg-blue-100 text-blue-800",
    registrationDate: "2025-02-15",
    customer: {
      company: "Global Marketing",
      contact: "한소영",
      phone: "010-6789-0123",
      address: "광주시 서구 상무대로 987",
    },
    team: {
      department: "마케팅4팀",
      manager: "정민수",
      sales: "최현우",
    },
    services: ["프리미엄"],
    contractAmount: 9200000,
    postingCount: 22,
    adCost: {
      total: 13500000,
      monthly: 1125000,
    },
    period: {
      start: "2025-02-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-007",
    type: "월계약",
    status: "신규",
    statusColor: "bg-green-100 text-green-800",
    registrationDate: "2025-03-10",
    customer: {
      company: "Digital Wave",
      contact: "송민준",
      phone: "010-7890-1234",
      address: "대전시 유성구 과학로 234",
    },
    team: {
      department: "마케팅1팀",
      manager: "박나리",
      sales: "김철수",
    },
    services: ["SEO", "하니탑"],
    contractAmount: 7200000,
    postingCount: 18,
    adCost: {
      total: 9600000,
      monthly: 800000,
    },
    period: {
      start: "2025-03-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-008",
    type: "프로젝트",
    status: "확장",
    statusColor: "bg-purple-100 text-purple-800",
    registrationDate: "2025-01-20",
    customer: {
      company: "Creative Studio",
      contact: "강지민",
      phone: "010-8901-2345",
      address: "서울시 마포구 월드컵로 567",
    },
    team: {
      department: "마케팅2팀",
      manager: "김철수",
      sales: "박민수",
    },
    services: ["프리미엄", "하니탑"],
    contractAmount: 10500000,
    postingCount: 28,
    adCost: {
      total: 15000000,
      monthly: 1500000,
    },
    period: {
      start: "2025-01-15",
      end: "2025-10-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-009",
    type: "연계약",
    status: "신규",
    statusColor: "bg-green-100 text-green-800",
    registrationDate: "2025-02-20",
    customer: {
      company: "Wellness Center",
      contact: "박서준",
      phone: "010-9012-3456",
      address: "경기도 성남시 분당구 판교로 890",
    },
    team: {
      department: "마케팅3팀",
      manager: "이지은",
      sales: "강수진",
    },
    services: ["SEO", "프리미엄"],
    contractAmount: 11000000,
    postingCount: 35,
    adCost: {
      total: 16000000,
      monthly: 1333333,
    },
    period: {
      start: "2025-02-01",
      end: "2026-01-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-010",
    type: "월계약",
    status: "연장",
    statusColor: "bg-blue-100 text-blue-800",
    registrationDate: "2025-01-05",
    customer: {
      company: "Future Tech",
      contact: "이하은",
      phone: "010-0123-4567",
      address: "서울시 강서구 마곡중앙로 123",
    },
    team: {
      department: "마케팅4팀",
      manager: "정민수",
      sales: "최현우",
    },
    services: ["SEO"],
    contractAmount: 5800000,
    postingCount: 12,
    adCost: {
      total: 7200000,
      monthly: 600000,
    },
    period: {
      start: "2025-01-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-011",
    type: "프로젝트",
    status: "신규",
    statusColor: "bg-green-100 text-green-800",
    registrationDate: "2025-03-15",
    customer: {
      company: "Blue Ocean",
      contact: "김영수",
      phone: "010-1111-2222",
      address: "울산시 남구 삼산로 456",
    },
    team: {
      department: "마케팅1팀",
      manager: "박나리",
      sales: "김철수",
    },
    services: ["프리미엄", "하니탑"],
    contractAmount: 9800000,
    postingCount: 26,
    adCost: {
      total: 14000000,
      monthly: 1400000,
    },
    period: {
      start: "2025-03-15",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-012",
    type: "연계약",
    status: "확장",
    statusColor: "bg-purple-100 text-purple-800",
    registrationDate: "2025-02-10",
    customer: {
      company: "Sunrise Corp",
      contact: "박지훈",
      phone: "010-2222-3333",
      address: "경기도 수원시 영통구 광교로 789",
    },
    team: {
      department: "마케팅2팀",
      manager: "김철수",
      sales: "박민수",
    },
    services: ["SEO", "프리미엄"],
    contractAmount: 11500000,
    postingCount: 32,
    adCost: {
      total: 17000000,
      monthly: 1416666,
    },
    period: {
      start: "2025-02-01",
      end: "2026-01-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-013",
    type: "월계약",
    status: "신규",
    statusColor: "bg-green-100 text-green-800",
    registrationDate: "2025-03-20",
    customer: {
      company: "Dream Solutions",
      contact: "최수진",
      phone: "010-3333-4444",
      address: "제주시 첨단로 123",
    },
    team: {
      department: "마케팅3팀",
      manager: "이지은",
      sales: "강수진",
    },
    services: ["SEO"],
    contractAmount: 4500000,
    postingCount: 14,
    adCost: {
      total: 6000000,
      monthly: 500000,
    },
    period: {
      start: "2025-03-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-014",
    type: "프로젝트",
    status: "연장",
    statusColor: "bg-blue-100 text-blue-800",
    registrationDate: "2025-01-25",
    customer: {
      company: "Innovation Lab",
      contact: "정우성",
      phone: "010-4444-5555",
      address: "대전시 서구 둔산로 234",
    },
    team: {
      department: "마케팅4팀",
      manager: "정민수",
      sales: "최현우",
    },
    services: ["프리미엄"],
    contractAmount: 7800000,
    postingCount: 21,
    adCost: {
      total: 10500000,
      monthly: 1050000,
    },
    period: {
      start: "2025-02-01",
      end: "2025-11-30",
      expired: false,
    },
  },
  {
    id: "CT-2025-015",
    type: "연계약",
    status: "만료",
    statusColor: "bg-red-100 text-red-800",
    registrationDate: "2024-12-01",
    customer: {
      company: "Legacy Systems",
      contact: "강동원",
      phone: "010-5555-6666",
      address: "광주시 북구 첨단과기로 567",
    },
    team: {
      department: "마케팅1팀",
      manager: "박나리",
      sales: "김철수",
    },
    services: ["SEO", "하니탑"],
    contractAmount: 6200000,
    postingCount: 17,
    adCost: {
      total: 8500000,
      monthly: 708333,
    },
    period: {
      start: "2024-12-01",
      end: "2024-12-31",
      expired: true,
    },
  },
  {
    id: "CT-2025-016",
    type: "월계약",
    status: "확장",
    statusColor: "bg-purple-100 text-purple-800",
    registrationDate: "2025-02-28",
    customer: {
      company: "Bright Future",
      contact: "윤아",
      phone: "010-6666-7777",
      address: "서울시 송파구 올림픽로 890",
    },
    team: {
      department: "마케팅2팀",
      manager: "김철수",
      sales: "박민수",
    },
    services: ["프리미엄", "하니탑"],
    contractAmount: 13500000,
    postingCount: 38,
    adCost: {
      total: 19500000,
      monthly: 1625000,
    },
    period: {
      start: "2025-03-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-017",
    type: "프로젝트",
    status: "신규",
    statusColor: "bg-green-100 text-green-800",
    registrationDate: "2025-03-05",
    customer: {
      company: "Alpha Marketing",
      contact: "이민호",
      phone: "010-7777-8888",
      address: "부산시 남구 용호로 321",
    },
    team: {
      department: "마케팅3팀",
      manager: "이지은",
      sales: "강수진",
    },
    services: ["SEO", "프리미엄"],
    contractAmount: 10200000,
    postingCount: 29,
    adCost: {
      total: 15000000,
      monthly: 1500000,
    },
    period: {
      start: "2025-03-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-018",
    type: "연계약",
    status: "연장",
    statusColor: "bg-blue-100 text-blue-800",
    registrationDate: "2025-01-18",
    customer: {
      company: "Golden Gate",
      contact: "송혜교",
      phone: "010-8888-9999",
      address: "인천시 남동구 예술로 654",
    },
    team: {
      department: "마케팅4팀",
      manager: "정민수",
      sales: "최현우",
    },
    services: ["하니탑"],
    contractAmount: 5200000,
    postingCount: 13,
    adCost: {
      total: 6800000,
      monthly: 566666,
    },
    period: {
      start: "2025-02-01",
      end: "2026-01-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-019",
    type: "월계약",
    status: "신규",
    statusColor: "bg-green-100 text-green-800",
    registrationDate: "2025-03-12",
    customer: {
      company: "Peak Performance",
      contact: "현빈",
      phone: "010-9999-0000",
      address: "경기도 고양시 일산서구 킨텍스로 147",
    },
    team: {
      department: "마케팅1팀",
      manager: "박나리",
      sales: "김철수",
    },
    services: ["SEO", "프리미엄", "하니탑"],
    contractAmount: 15000000,
    postingCount: 40,
    adCost: {
      total: 22000000,
      monthly: 1833333,
    },
    period: {
      start: "2025-03-01",
      end: "2025-12-31",
      expired: false,
    },
  },
  {
    id: "CT-2025-020",
    type: "프로젝트",
    status: "확장",
    statusColor: "bg-purple-100 text-purple-800",
    registrationDate: "2025-02-05",
    customer: {
      company: "Victory Marketing",
      contact: "전지현",
      phone: "010-0000-1111",
      address: "서울시 영등포구 여의대로 999",
    },
    team: {
      department: "마케팅2팀",
      manager: "김철수",
      sales: "박민수",
    },
    services: ["프리미엄"],
    contractAmount: 8900000,
    postingCount: 24,
    adCost: {
      total: 12000000,
      monthly: 1200000,
    },
    period: {
      start: "2025-02-01",
      end: "2025-11-30",
      expired: false,
    },
  },
]

// 총 광고비 계산 함수 (월광고비 × 계약기간)
const calculateTotalAdCost = (monthlyAdCost: number, startDate: string, endDate: string) => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // 더 정확한 월 계산
  const yearDiff = end.getFullYear() - start.getFullYear()
  const monthDiff = end.getMonth() - start.getMonth()
  const totalMonths = yearDiff * 12 + monthDiff + 1 // 시작월 포함
  
  return monthlyAdCost * totalMonths
}

export default function ContractPage() {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateCriteria, setDateCriteria] = useState("계약등록일")
  const [dateRange, setDateRange] = useState<Date[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("1년")
  const [selectedCard, setSelectedCard] = useState<string>("all")
  const [contractFilter, setContractFilter] = useState<string>('등록일순')
  const [selectedContract, setSelectedContract] = useState<typeof contractData[0] | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<typeof contractData[0] | null>(null)
  
  // 선택된 계약 관리
  const [selectedContracts, setSelectedContracts] = useState<string[]>([])
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  
  // 계약 데이터 상태 관리
  const [contracts, setContracts] = useState(contractData)
  
  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // 디폴트 화면 보기 상태
  const [showEmptyState, setShowEmptyState] = useState(false)
  
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true)
  const [isPageLoading, setIsPageLoading] = useState(true)

  // 계약상품 표시 형태 (상세보기용)
  const [detailProductType, setDetailProductType] = useState<'select' | 'manual'>('select')
  
  // 하위상품 목록 펼침 상태 (직접입력형용)
  const [expandedSubProducts, setExpandedSubProducts] = useState<{[key: number]: boolean}>({})
  
  // 계약서 첨부 및 기타 사항 데이터 표시 여부
  const [showAttachmentData, setShowAttachmentData] = useState(false)
  
  // 로딩바 팝업 상태
  const [loadingBarDialogOpen, setLoadingBarDialogOpen] = useState(false)
  
  // 로딩 애니메이션 팝업 상태
  const [loadingAnimationDialogOpen, setLoadingAnimationDialogOpen] = useState(false)
  
  // 얼럿창 팝업 상태
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  
  // 선택복사 모달 상태
  const [copyModalOpen, setCopyModalOpen] = useState(false)
  const [copiedContractIds, setCopiedContractIds] = useState<string[]>([])

  // 지역 데이터 상태
  const [regionData, setRegionData] = useState<RegionData[]>([])
  const [regionOptions, setRegionOptions] = useState<any[]>([])
  const [isRegionDataLoading, setIsRegionDataLoading] = useState(false)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

  // 상태 옵션 정의
  const statusOptions: StatusOption[] = [
    { value: "all", label: "전체" },
    { value: "신규", label: "신규" },
    { value: "연장", label: "연장" },
    { value: "확장", label: "확장" },
    { value: "만료", label: "만료" },
  ]

  // 날짜 기준 옵션 정의
  const dateOptions: DateCriteriaOption[] = [
    { value: "계약등록일", label: "계약등록일" },
    { value: "계약시작일", label: "계약시작일" },
    { value: "계약종료일", label: "계약종료일" },
  ]

  // 컴포넌트 마운트 시 1년치 날짜 기본 설정
  useEffect(() => {
    handleQuickDateSelect("1년")
  }, [])

  // 지역 데이터 로드
  useEffect(() => {
    const loadRegions = async () => {
      setIsRegionDataLoading(true)
      try {
        const data = await loadRegionData()
        setRegionData(data)
        const options = createRegionOptions(data)
        setRegionOptions(options as unknown as any[])
      } catch (error) {
        console.error('지역 데이터 로드 실패:', error)
      } finally {
        setIsRegionDataLoading(false)
      }
    }
    
    loadRegions()
  }, [])

  // 페이지 초기 로딩 시뮬레이션
  useEffect(() => {
    setIsPageLoading(true)
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsPageLoading(false)
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // 로딩 애니메이션 팝업 자동 닫기 (3초)
  useEffect(() => {
    if (loadingAnimationDialogOpen) {
      const timer = setTimeout(() => {
        setLoadingAnimationDialogOpen(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [loadingAnimationDialogOpen])

  // 카드 필터 핸들러
  const handleFilterChange = (filter: string) => {
    setSelectedCard(filter)
  }

  // 계약 등록 제출 핸들러
  const handleContractSubmit = (data: ContractFormData, type: 'draft' | 'submit') => {
    console.log(`${type === 'draft' ? '임시저장' : '등록'} 데이터:`, data)
    
    if (type === 'draft') {
      showSuccessToast("임시저장 완료")
    } else if (type === 'submit') {
      showSuccessToast("계약 등록이 완료되었습니다")
      setRegisterDialogOpen(false)
      // 여기에 데이터 재조회 등 추가 로직
    }
  }

  // 계약 수정 제출 핸들러
  const handleContractEdit = (data: ContractFormData, type: 'draft' | 'submit') => {
    // 수정 모드에서는 'submit'만 호출됨 (임시저장 버튼 없음)
    console.log('수정 데이터:', data)
    
    showSuccessToast("계약 수정이 완료되었습니다")
    setEditDialogOpen(false)
    setEditingContract(null)
    // 여기에 데이터 재조회 등 추가 로직
  }

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (contract: typeof contractData[0]) => {
    // 계약 데이터를 ContractFormData 형식으로 변환
    const formattedData: Partial<ContractFormData> = {
      companyName: contract.customer.company,
      contactPerson: contract.customer.contact,
      email: "example@company.com", // 실제로는 contract 데이터에서 가져와야 함
      phone: contract.customer.phone,
      address: contract.customer.address,
      detailAddress: "",
        region: "",
        regionDetail: "",
      contractType: contract.type === "월계약" ? "monthly" : contract.type === "연계약" ? "annual" : "project",
        contractProduct: "select",
      operationTeam: "operation1",
      salesPerson: "sales1",
      monthlyAdCost: `₩${contract.adCost.monthly.toLocaleString()}`,
      postingCount: contract.postingCount.toString(),
      startDate: contract.period.start,
      endDate: contract.period.end,
        memo: "",
      products: contract.services.map((service, index) => ({
        id: index + 1,
        productOption: service.toLowerCase(),
        productAmount: `₩${(contract.contractAmount / contract.services.length).toLocaleString()}`,
        department: contract.team.department,
        manager: contract.team.sales,
      }))
    }
    
    setEditingContract(contract)
    setEditDialogOpen(true)
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
    setEndDate(period === "전체" ? null : (period === "전체" ? end : today))
    setSelectedPeriod(period)
  }

  // 검색 실행
  const handleSearch = () => {
    console.log("검색 실행:", { searchTerm, statusFilter, dateCriteria, startDate, endDate })
    // 검색 시 첫 페이지로 이동
    setCurrentPage(1)
  }

  // 초기화
  const handleReset = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateCriteria("계약등록일")
    setStartDate(null)
    setEndDate(null)
    setSelectedPeriod("1년")
    setSelectedRegions([])
    setCurrentPage(1)
    handleQuickDateSelect("1년")
  }


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (notificationOpen || userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [notificationOpen, userMenuOpen])

  // 카카오 주소 API 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)
    
    return () => {
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  // 필터링된 계약 데이터
  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = searchTerm === "" || 
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customer.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.team.sales.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    
    // 지역 필터링 로직
    let matchesRegion = true
    if (selectedRegions.length > 0) {
      const contractRegion = formatRegionDisplay(contract.customer.address)
      matchesRegion = selectedRegions.some(region => 
        region.includes(contractRegion) || contractRegion.includes(region)
      )
    }
    
    // 날짜 필터링 로직
    let matchesDate = true
    if (startDate && endDate) {
      const contractDate = new Date(
        dateCriteria === "계약등록일" ? contract.registrationDate :
        dateCriteria === "계약시작일" ? contract.period.start :
        contract.period.end
      )
      matchesDate = contractDate >= startDate && contractDate <= endDate
    }
    
    // 카드 필터링 로직
    let matchesCard = true
    if (selectedCard !== "all") {
      switch (selectedCard) {
        case "전체":
          matchesCard = true // 전체 계약
          break
        case "신규":
          matchesCard = contract.status === "신규"
          break
        case "연장":
          matchesCard = contract.status === "연장"
          break
        case "확장":
          matchesCard = contract.status === "확장"
          break
        case "만료":
          matchesCard = contract.status === "만료"
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesRegion && matchesDate && matchesCard
  }).sort((a, b) => {
    // 정렬 로직
    switch (contractFilter) {
      case "등록일순":
        return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime() // 최신순
      case "기업명순":
        return a.customer.company.localeCompare(b.customer.company)
      case "월광고비순":
        return b.adCost.monthly - a.adCost.monthly // 높은 순
      default:
        return 0
    }
  })

  // 통계 데이터 계산
  const totalContracts = contracts.length
  const newContracts = contracts.filter(c => c.status === "신규").length
  const extensionContracts = contracts.filter(c => c.status === "연장").length
  const expansionContracts = contracts.filter(c => c.status === "확장").length
  const expiredContracts = contracts.filter(c => c.status === "만료").length

  // StatusSummaryCards용 데이터
  const statusCounts = {
    전체: totalContracts,
    신규: newContracts,
    연장: extensionContracts,
    확장: expansionContracts,
    만료: expiredContracts
  }

  // 페이지네이션 계산
  const totalPages = Math.max(1, Math.ceil(filteredContracts.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedContracts = showEmptyState ? [] : filteredContracts.slice(startIndex, endIndex)

  // 페이지 변경 시 맨 위로 스크롤
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 체크박스 핸들러
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContracts(paginatedContracts.map(c => c.id))
    } else {
      setSelectedContracts([])
    }
  }

  const handleSelectContract = (contractId: string) => {
    setSelectedContracts(prev => {
      if (prev.includes(contractId)) {
        return prev.filter(id => id !== contractId)
      } else {
        return [...prev, contractId]
      }
    })
  }

  const handleDeleteSelected = () => {
    if (selectedContracts.length === 0) return
    setDeleteConfirmOpen(true)
  }

  const handleDeleteSingle = (contractId: string) => {
    setSelectedContracts([contractId])
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    console.log('삭제할 계약:', selectedContracts)
    showSuccessToast(`${selectedContracts.length}개의 계약이 삭제되었습니다`)
    setSelectedContracts([])
    setDeleteConfirmOpen(false)
  }

  // 얼럿창 확인 핸들러
  const handleAlertConfirm = () => {
    console.log('얼럿창 확인 클릭')
    showSuccessToast('확인되었습니다')
    setAlertModalOpen(false)
  }

  // 선택한 계약번호 복사 확인 모달 열기
  const handleCopySelectedContracts = () => {
    if (selectedContracts.length === 0) {
      showErrorToast('복사할 계약을 선택해주세요')
      return
    }
    setCopyModalOpen(true)
  }

  // 실제 복사 실행
  const handleConfirmCopy = async () => {
    try {
      // 선택된 계약들의 원본 데이터 찾기
      const selectedContractData = contracts.filter(contract => 
        selectedContracts.includes(contract.id)
      )
      
      // 복사된 계약 데이터 생성 (순번 추가)
      const copiedContracts = selectedContractData.map((contract, index) => ({
        ...contract,
        id: `${contract.id}(${index + 1})`,
        registrationDate: new Date().toISOString().split('T')[0], // 오늘 날짜로 설정
      }))
      
      // 테이블에 복사된 계약 추가
      setContracts([...copiedContracts, ...contracts])
      
      // 클립보드에 계약번호 복사
      const numberedContractIds = copiedContracts.map(c => c.id)
      const copiedText = numberedContractIds.join('\n')
      await navigator.clipboard.writeText(copiedText)
      
      setCopiedContractIds(numberedContractIds)
      setCopyModalOpen(false)
      setSelectedContracts([]) // 선택 해제
      showSuccessToast(`${copiedContracts.length}개의 계약이 복사되어 추가되었습니다`)
    } catch (err) {
      showErrorToast('복사에 실패했습니다')
    }
  }

  // 전체 선택 여부 확인
  const isAllSelected = paginatedContracts.length > 0 && selectedContracts.length === paginatedContracts.length

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="계약현황"
      />

      <div className="flex">
        <Sidebar 
          currentPage="work/contract" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6 w-full max-w-full">
          {isPageLoading ? (
            <>
              {/* 페이지 헤더 스켈레톤 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                <div className="flex-shrink-0 hidden sm:block space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
                  <Skeleton className="h-10 w-full sm:w-24" />
                  <Skeleton className="h-10 w-full sm:w-40" />
                  <Skeleton className="h-10 w-full sm:w-32" />
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
                          <Skeleton className="h-3 w-14 ml-auto" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="py-2 md:py-3 shadow-none rounded-2xl border">
                    <CardContent className="px-4 py-2 md:px-4 md:py-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <Skeleton className="h-5 w-20 mb-1 md:mb-1.5" />
                        </div>
                        <div className="flex flex-col items-end">
                          <Skeleton className="h-6 sm:h-7 w-20" />
                          <Skeleton className="h-3 w-12 mt-0.5 md:mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 검색 및 필터 스켈레톤 */}
              <Card className="shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full sm:w-32" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Skeleton className="h-10 w-full sm:w-40" />
                    <Skeleton className="h-10 w-full sm:w-32" />
                    <Skeleton className="h-10 w-full sm:w-32" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-9 w-full sm:flex-1" />
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <Skeleton className="h-9 w-full sm:w-20" />
                    <Skeleton className="h-9 w-full sm:w-16" />
                  </div>
                </CardContent>
              </Card>

              {/* 계약 목록 헤더 스켈레톤 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 w-full">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-9 w-32" />
              </div>

              {/* 테이블 스켈레톤 (데스크톱 이상에서만 표시) */}
              <Card className="hidden lg:block shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-100">
                        <TableRow className="!border-b !border-gray-200 py-3">
                          <TableHead className="w-[130px] text-left pl-6 py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[90px] text-left py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[170px] text-left py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[100px] text-left py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[120px] text-left py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[180px] text-left py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[130px] text-left py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[130px] text-left py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[120px] text-left py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                          <TableHead className="w-[100px] text-center py-4">
                            <Skeleton className="h-4 w-12 mx-auto" />
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...Array(5)].map((_, index) => (
                          <TableRow key={index} className="border-b border-gray-100">
                            <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="py-4"><Skeleton className="h-6 w-12" /></TableCell>
                            <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                            <TableCell className="py-4"><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell className="py-4"><Skeleton className="h-4 w-28" /></TableCell>
                            <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center justify-center gap-1">
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                                <Skeleton className="h-8 w-8 rounded" />
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* 페이지 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                {/* 타이틀 영역 - 모바일에서는 숨김 */}
                <div className="flex-shrink-0 hidden sm:block">
                  <h1 className="text-xl sm:text-2xl font-bold">계약현황</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">고객 계약을 등록하고 관리하세요.</p>
                </div>
                
                {/* 버튼 영역 - 항상 표시 */}
                <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="shadow-none rounded-lg"
                    onClick={() => setAlertModalOpen(true)}
                  >
                    얼럿창
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="shadow-none rounded-lg"
                    onClick={() => setLoadingBarDialogOpen(true)}
                  >
                    불러오기 로딩바 보기
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="shadow-none rounded-lg"
                    onClick={() => setLoadingAnimationDialogOpen(true)}
                  >
                    써클 로딩 보기
                  </Button>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground shadow-none rounded-lg"
                    onClick={() => setRegisterDialogOpen(true)}
                  >
                    새 계약 등록
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
          <SearchFilterPanel
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            searchPlaceholder="검색어를 입력하세요"
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={statusOptions}
            statusLabel="계약상태"
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
            showRegionSearch={true}
            selectedRegions={selectedRegions}
            onRegionsChange={setSelectedRegions}
            regionOptions={regionOptions}
            isRegionDataLoading={isRegionDataLoading}
          />

          {/* 계약 목록 */}
          <div className="flex flex-col gap-3 mb-2 sm:mb-4 mt-6 sm:mt-8 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 w-full">
              <div className="flex items-center gap-2 flex-wrap min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold whitespace-nowrap">
                  계약 목록 <span className="text-xs sm:text-sm text-blue-600 font-normal">({filteredContracts.length}개)</span>
                </h2>
                <Button
                  variant={isLoading ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsLoading(!isLoading)}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                >
                  {isLoading ? "로딩 중..." : "스켈레톤 보기"}
                </Button>
                <Button
                  variant={showEmptyState ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowEmptyState(!showEmptyState)}
                  className="h-7 sm:h-8 px-2 sm:px-3 text-xs"
                >
                  {showEmptyState ? "데이터 보기" : "빈 상태 보기"}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                  <Button
                    variant="default"
                    size="default"
                    onClick={handleCopySelectedContracts}
                    disabled={selectedContracts.length === 0}
                    className="text-sm px-4 py-3 shadow-none"
                  >
                    선택복사
                  </Button>
                <CommonSelect
                  value={contractFilter}
                  onValueChange={setContractFilter}
                  options={[
                    { value: "등록일순", label: "등록일순" },
                    { value: "기업명순", label: "기업명순" },
                    { value: "월광고비순", label: "월 광고비순" }
                  ]}
                  triggerClassName="flex-shrink-0"
                />
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
                        <Skeleton className="h-4 w-28" />
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
                      <div className="space-y-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100 space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <div className="flex flex-wrap gap-1">
                        {[...Array(3)].map((__, badgeIndex) => (
                          <Skeleton key={badgeIndex} className="h-5 w-12 rounded-full" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : paginatedContracts.length === 0 ? (
              <Card className="shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 relative">
                      <Image
                        src="/icons/icon-default.png"
                        alt="계약 없음"
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">데이터가 없습니다</h3>
                      <p className="text-sm text-gray-500">해당 페이지에 표시할 정보가 없습니다.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              paginatedContracts.map((contract) => (
                <Card key={contract.id} className="shadow-none rounded-xl border border-gray-200">
                  <CardContent className="p-4 space-y-4">
                  {/* 헤더 */}
                  <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                    <div className="flex items-start gap-3">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold text-gray-900">{contract.id}</div>
                        <Badge className={`text-xs ${contract.statusColor}`}>
                          {contract.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => {
                          setSelectedContract(contract)
                          setDetailDialogOpen(true)
                        }}
                      >
                        <Eye className="size-[15px]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                        onClick={() => handleEditClick(contract)}
                      >
                        <Pencil className="size-[15px]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteSingle(contract.id)}
                      >
                        <Trash2 className="size-[15px]" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* 고객정보 */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">고객정보</div>
                    <div className="text-sm font-semibold text-gray-900">{contract.customer.company}</div>
                    <div className="text-sm text-gray-500 mt-1">{contract.customer.contact}</div>
                  </div>
                  
                  {/* 지역정보 */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">지역</div>
                    <div className="text-sm font-medium text-gray-900">{formatRegionDisplay(contract.customer.address)}</div>
                  </div>
                  
                  {/* 계약기간 */}
                  <div className="space-y-1 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500">계약기간</div>
                    <div className={`text-sm ${contract.status === '만료' ? 'text-red-500' : 'text-gray-700'}`}>
                      {contract.period.start.replace(/-/g, '.')} – {contract.period.end.split('-').slice(1).join('.')}
                    </div>
                  </div>
                  
                  {/* 금액정보 */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">월 광고비</div>
                      <div className="text-sm font-medium text-gray-900">₩{contract.adCost.monthly.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">서비스유형</div>
                      <div className="flex flex-wrap gap-1">
                        {contract.services.map((service, idx) => (
                          <div key={idx} className="relative group">
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-blue-100 text-blue-700 border-0 cursor-pointer hover:bg-blue-200 active:bg-blue-300 active:scale-95 transition-all duration-150 touch-manipulation"
                              onClick={() => {
                                // 모바일에서 툴팁 토글
                                const tooltip = document.getElementById(`tooltip-${contract.id}-${idx}`)
                                if (tooltip) {
                                  tooltip.classList.toggle('opacity-0')
                                  tooltip.classList.toggle('opacity-100')
                                }
                              }}
                            >
                              {service}
                              <Info className="ml-1 w-3 h-3 opacity-60" />
                            </Badge>
                            <div 
                              id={`tooltip-${contract.id}-${idx}`}
                              className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
                            >
                              {contract.team.department} ({contract.team.manager})
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* 영업자 */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">영업자</div>
                      <div className="text-sm font-medium text-gray-900">{contract.team.sales}</div>
                    </div>
                  </div>
                  
                  {/* 광고비/등록일 */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">총 광고비</div>
                      <div className="text-sm font-medium text-gray-900">₩{calculateTotalAdCost(contract.adCost.monthly, contract.period.start, contract.period.end).toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500">등록일</div>
                      <div className="text-sm text-gray-500">{contract.registrationDate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>

          {/* PC 테이블 뷰 */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-lg w-full">
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow className="!border-b !border-gray-200 py-3">
                    <TableHead className="w-[40px] text-center py-4 font-semibold text-gray-700">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            setSelectedContracts(paginatedContracts.map(contract => contract.id))
                          } else {
                            setSelectedContracts([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-[130px] text-left pl-6 py-4 font-semibold text-gray-700">계약번호</TableHead>
                    <TableHead className="w-[90px] text-left py-4 font-semibold text-gray-700">계약상태</TableHead>
                    <TableHead className="w-[170px] text-left py-4 font-semibold text-gray-700">고객정보</TableHead>
                    <TableHead className="w-[100px] text-left py-4 font-semibold text-gray-700">지역</TableHead>
                    <TableHead className="w-[120px] text-left py-4 font-semibold text-gray-700">영업자</TableHead>
                    <TableHead className="w-[180px] text-left py-4 font-semibold text-gray-700">서비스유형</TableHead>
                    <TableHead className="w-[130px] text-left py-4 font-semibold text-gray-700">월 광고비</TableHead>
                    <TableHead className="w-[130px] text-left py-4 font-semibold text-gray-700">총 광고비</TableHead>
                    <TableHead className="w-[120px] text-left py-4 font-semibold text-gray-700">계약기간</TableHead>
                    <TableHead className="w-[100px] text-center py-4 font-semibold text-gray-700">작업</TableHead>
                  </TableRow>
                </TableHeader>
            <TableBody>
              {isLoading ? (
                // 🎨 로딩 중일 때 스켈레톤 표시
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="border-b border-gray-100">
                    <TableCell className="text-center py-4"><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                    <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-1">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedContracts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-80">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 relative">
                        <Image
                          src="/icons/icon-default.png"
                          alt="계약 없음"
                          width={64}
                          height={64}
                          className="object-contain"
                        />
                      </div>
                      <div className="space-y-2 text-center">
                        <h3 className="text-lg font-semibold text-gray-900">데이터가 없습니다</h3>
                        <p className="text-sm text-gray-500">해당 페이지에 표시할 정보가 없습니다.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedContracts.map((contract, index) => (
                      <TableRow key={contract.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {/* 0. 체크박스 */}
                      <TableCell className="text-center py-4">
                        <Checkbox
                          checked={selectedContracts.includes(contract.id)}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              setSelectedContracts([...selectedContracts, contract.id])
                            } else {
                              setSelectedContracts(selectedContracts.filter(id => id !== contract.id))
                            }
                          }}
                        />
                      </TableCell>
                      {/* 1. 계약번호 */}
                      <TableCell className="pl-6 py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-900">{contract.id}</div>
                          <div className="text-xs text-gray-500">{contract.registrationDate}</div>
                        </div>
                      </TableCell>
                      {/* 2. 진행상태 */}
                      <TableCell className="py-4">
                        <Badge className={`text-xs ${contract.statusColor}`}>
                          {contract.status}
                        </Badge>
                      </TableCell>
                      {/* 3. 고객정보 */}
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-900">{contract.customer.company}</div>
                          <div className="text-sm text-gray-500">{contract.customer.contact}</div>
                        </div>
                      </TableCell>
                      {/* 4. 지역 */}
                      <TableCell className="py-4">
                        <div className="text-sm font-medium text-gray-900">{formatRegionDisplay(contract.customer.address)}</div>
                      </TableCell>
                      {/* 5. 영업자 */}
                      <TableCell className="py-4">
                        <div className="text-sm font-medium text-gray-900">{contract.team.sales}</div>
                      </TableCell>
                      {/* 6. 서비스유형 */}
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {contract.services.map((service, idx) => (
                            <div key={idx} className="relative group">
                              <Badge 
                                variant="secondary" 
                                className="text-xs bg-blue-100 text-blue-700 border-0 "
                              >
                                {service}
                              </Badge>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                                {contract.team.department} ({contract.team.manager})
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      {/* 7. 월 광고비 */}
                      <TableCell className="py-4">
                        <div className="text-sm font-medium text-gray-900">₩{contract.adCost.monthly.toLocaleString()}</div>
                      </TableCell>
                      {/* 8. 총 광고비 */}
                      <TableCell className="py-4">
                        <div className="text-sm text-gray-700">
                          ₩{calculateTotalAdCost(contract.adCost.monthly, contract.period.start, contract.period.end).toLocaleString()}
                        </div>
                      </TableCell>
                      {/* 9. 계약기간 */}
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <div className={`text-sm ${contract.status === '만료' ? 'text-red-500' : 'text-gray-900'}`}>
                            {contract.period.start.replace(/-/g, '.')}
                          </div>
                          <div className={`text-sm ${contract.status === '만료' ? 'text-red-500' : 'text-gray-500'}`}>
                            ~ {contract.period.end.replace(/-/g, '.')}
                          </div>
                        </div>
                      </TableCell>
                      {/* 10. 작업 */}
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                            onClick={() => {
                              setSelectedContract(contract)
                              setDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="size-[15px]" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
                            onClick={() => handleEditClick(contract)}
                          >
                            <Pencil className="size-[15px]" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() => handleDeleteSingle(contract.id)}
                          >
                            <Trash2 className="size-[15px]" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* 페이지네이션 */}
          {filteredContracts.length > 0 && (
            <div className="mt-4 sm:mt-6 flex items-center justify-center w-full px-2">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* 이전 버튼 */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(page)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
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

          {/* 상세보기 다이얼로그 */}
          <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px] max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
              <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold m-0">계약 상세정보</DialogTitle>
                </div>
              </DialogHeader>
              
              {selectedContract && (
                <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/10">
                  <div className="space-y-6">
                    {/* 1단계: 고객 정보 */}
                    <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0 pb-0">
                      <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-slate-50">
                        <h3 className="text-base font-semibold text-gray-800">
                          고객 정보
                        </h3>
                      </div>
                      <CardContent className="px-4 md:px-8">
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              회사명
                            </Label>
                            <p className="text-sm text-gray-900">{selectedContract.customer.company}</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              계약자명
                            </Label>
                            <p className="text-sm text-gray-900">{selectedContract.customer.contact}</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              이메일
                            </Label>
                            <p className="text-sm text-gray-900">example@company.com</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              전화번호
                            </Label>
                            <p className="text-sm text-gray-900">{selectedContract.customer.phone}</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 py-4">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0 md:pt-0">
                              사업장 주소
                            </Label>
                            <div className="flex flex-col gap-2 w-full md:w-80">
                              <p className="text-sm text-gray-900">{selectedContract.customer.address}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 2단계: 계약 조건 및 내용 */}
                    <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0 pb-0">
                      <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-slate-50">
                        <h3 className="text-base font-semibold text-gray-800">
                          계약 조건 및 내용
                        </h3>
                      </div>
                      <CardContent className="px-4 md:px-8">
                        <div>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              계약상태
                            </Label>
                            <p className="text-sm text-gray-900">{selectedContract.status}</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              계약 유형
                            </Label>
                            <p className="text-sm text-gray-900">{selectedContract.type}</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              총 광고비
                            </Label>
                            <p className="text-sm text-primary">₩{calculateTotalAdCost(selectedContract.adCost.monthly, selectedContract.period.start, selectedContract.period.end).toLocaleString()}</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              월 광고비
                            </Label>
                            <p className="text-sm text-gray-900">₩{selectedContract.adCost.monthly.toLocaleString()}</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              포스팅 건수
                            </Label>
                            <p className="text-sm text-gray-900">{selectedContract.postingCount}건</p>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              계약 기간
                            </Label>
                            <div className="flex items-center gap-2">
                              <p className={`text-sm ${selectedContract.status === '만료' ? 'text-red-500' : 'text-gray-900'}`}>{selectedContract.period.start}</p>
                              <span className={`text-sm ${selectedContract.status === '만료' ? 'text-red-400' : 'text-gray-400'}`}>~</span>
                              <p className={`text-sm ${selectedContract.status === '만료' ? 'text-red-500' : 'text-gray-900'}`}>{selectedContract.period.end}</p>
                              {selectedContract.period.expired && (
                                <Badge variant="destructive" className="text-xs ml-2">
                                  만료됨
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4">
                            <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                              영업자
                            </Label>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-900">{selectedContract.team.sales}</p>
                              <p className="text-xs text-gray-500">{selectedContract.team.department}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* 3단계: 계약상품 */}
                    <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0">
                      <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-gray-800">
                            계약상품
                          </h3>
                          <div className="inline-flex">
                            <Button
                              type="button"
                              variant={detailProductType === 'select' ? 'default' : 'outline'}
                              size="sm"
                              className="h-7 px-3 rounded-l-md rounded-r-none text-xs"
                              onClick={() => setDetailProductType('select')}
                            >
                              선택형
                            </Button>
                            <Button
                              type="button"
                              variant={detailProductType === 'manual' ? 'default' : 'outline'}
                              size="sm"
                              className="h-7 px-3 rounded-r-md rounded-l-none -ml-px text-xs"
                              onClick={() => setDetailProductType('manual')}
                            >
                              직접입력형
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-0">
                        <div>
                          {/* 선택형 - 상품 목록 */}
                          {detailProductType === 'select' && (
                          <div className="space-y-4 px-4 md:px-6 pt-4">
                            {selectedContract.services.map((service, index) => (
                              <div key={index} className="relative border border-blue-200 rounded-xl p-4 md:p-5 bg-blue-50/50">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                      {index + 1}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-500">상품 {index + 1}</span>
                                  </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                                  <Label className="text-sm font-medium text-gray-500 md:w-[80px] flex-shrink-0">
                                    상품선택
                                  </Label>
                                  <div className="w-full md:max-w-[280px] lg:max-w-[300px]">
                                    <p className="text-sm text-gray-900">{service}</p>
                                  </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                                  <Label className="text-sm font-medium text-gray-500 md:w-[80px] flex-shrink-0">
                                    상품금액
                                  </Label>
                                  <div className="w-full md:max-w-[280px] lg:max-w-[300px]">
                                    <p className="text-sm text-gray-900">₩{(selectedContract.contractAmount / selectedContract.services.length).toLocaleString()}</p>
                                  </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                                  <Label className="text-sm font-medium text-gray-500 md:w-[80px] flex-shrink-0">담당자</Label>
                                  <div className="w-full md:max-w-[280px] lg:max-w-[300px]">
                                    <p className="text-sm text-gray-900">{selectedContract.team.department} <span className="text-gray-400">|</span> {selectedContract.team.sales}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          )}

                          {/* 직접입력형 - 상품 목록 */}
                          {detailProductType === 'manual' && (
                          <div className="space-y-4 px-4 md:px-6 pt-4">
                            {/* 예시: 2개의 상품 세트 */}
                            {[1, 2].map((setIndex) => (
                              <div key={setIndex} className="relative border border-blue-200 rounded-xl p-4 md:p-5 lg:p-6 bg-white">
                                <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-blue-100">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                      {setIndex}
                                    </div>
                                    <span className="text-base font-bold text-gray-800">상품 세트 {setIndex}</span>
                                  </div>
                                </div>

                                <div className="mb-2 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-100">
                                  <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-200">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <Label className="text-sm font-bold text-gray-800">대표상품 정보</Label>
                                  </div>
                                  
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Label className="text-sm font-medium text-gray-500 w-20 flex-shrink-0">
                                        상품명
                                      </Label>
                                      <p className="text-sm text-gray-900">통합 마케팅 패키지 {setIndex}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <Label className="text-sm font-medium text-gray-500 w-20 flex-shrink-0">
                                        상품금액
                                      </Label>
                                      <p className="text-sm text-gray-900">₩{(selectedContract.contractAmount / 2).toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                        
                                <div className="p-3 md:p-4">
                                  <div 
                                    className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200 cursor-pointer hover:bg-gray-50 -mx-3 -mt-3 px-3 pt-3 rounded-t-xl transition-colors"
                                    onClick={() => setExpandedSubProducts(prev => ({...prev, [setIndex]: !prev[setIndex]}))}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                      <Label className="text-sm font-bold text-gray-800 cursor-pointer">하위상품 목록 ({selectedContract.services.length}개)</Label>
                                    </div>
                                    <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform ${expandedSubProducts[setIndex] ? 'rotate-180' : ''}`} />
                                  </div>
                                  
                                  {expandedSubProducts[setIndex] && (
                                  <div>
                                    {selectedContract.services.map((service, subIndex) => (
                                      <div key={subIndex} className={`p-3 bg-gray-50 rounded-xl border border-gray-300 ${subIndex < selectedContract.services.length - 1 ? 'mb-3' : ''}`}>
                                        <div className="flex items-center gap-3 mb-3">
                                          <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                            {subIndex + 1}
                                          </div>
                                          <div className="flex items-center gap-2 flex-1">
                                            {service.includes('SEO') && (
                                              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-0">
                                                SEO
                                              </Badge>
                                            )}
                                            {service.includes('프리미엄') && (
                                              <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-0">
                                                프리미엄
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-gray-900">₩{(selectedContract.contractAmount / selectedContract.services.length / 2).toLocaleString()}</p>
                                        </div>
                                        
                                        <div className="pt-3 mt-3 border-t border-gray-200">
                                          <p className="text-sm text-gray-900">{selectedContract.team.department} <span className="text-gray-400 px-1">|</span> {selectedContract.team.sales}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 4단계: 계약서 첨부 및 기타 사항 */}
                    <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0">
                      <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-slate-50">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-gray-800">
                            계약서 첨부 및 기타 사항
                          </h3>
                          <div className="inline-flex">
                            <Button
                              type="button"
                              variant={!showAttachmentData ? 'default' : 'outline'}
                              size="sm"
                              className="h-7 px-3 rounded-l-md rounded-r-none text-xs"
                              onClick={() => setShowAttachmentData(false)}
                            >
                              빈 데이터
                            </Button>
                            <Button
                              type="button"
                              variant={showAttachmentData ? 'default' : 'outline'}
                              size="sm"
                              className="h-7 px-3 rounded-r-md rounded-l-none -ml-px text-xs"
                              onClick={() => setShowAttachmentData(true)}
                            >
                              데이터 있음
                            </Button>
                          </div>
                        </div>
                      </div>
                      <CardContent className="px-4 md:px-8">
                        {!showAttachmentData ? (
                          <div>
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                              <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                                계약 조건 및 <br className="md:block hidden" /> 특이사항
                              </Label>
                              <p className="text-sm text-gray-900 whitespace-pre-wrap">특이사항 없음</p>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4">
                              <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                                계약서 첨부파일
                              </Label>
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">첨부된 파일이 없습니다.</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 py-4 border-b border-gray-100">
                              <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0 md:pt-1">
                                계약 조건 및 <br className="md:block hidden" /> 특이사항
                              </Label>
                              <div className="flex-1">
                                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                  <p className="text-sm text-gray-900 whitespace-pre-wrap font-normal">
                                    {'1. 계약 기간 중 서비스 변경 시 사전 협의 필요\n2. 월 광고비는 매월 1일 자동 결제\n3. 계약 해지 시 30일 전 서면 통보 필수\n4. 포스팅 건수는 월 단위로 조정 가능'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 py-4">
                              <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0 md:pt-1">
                                계약서 첨부파일
                              </Label>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 font-medium truncate">마케팅_계약서_2025.pdf</p>
                                    <p className="text-xs text-gray-500">2.5 MB · 2025-01-15</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 font-medium truncate">사업자등록증.pdf</p>
                                    <p className="text-xs text-gray-500">1.2 MB · 2025-01-15</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 px-6 py-4 border-t flex-shrink-0 bg-white">
                <Button
                  variant="outline"
                  onClick={() => setDetailDialogOpen(false)}
                >
                  닫기
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 삭제 확인 모달 */}
          <AlertConfirmModal
            isOpen={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
            onConfirm={handleConfirmDelete}
            title="계약 삭제"
            message="해당 계약과 관련된 모든 기록이 영구 삭제됩니다."
            additionalMessage="정말 삭제하시겠습니까?"
          />

          {/* 계약 등록 모달 */}
          <ContractRegisterModal
            isOpen={registerDialogOpen}
            onClose={() => setRegisterDialogOpen(false)}
            onSubmit={handleContractSubmit}
            mode="create"
          />

          {/* 계약 수정 모달 */}
          <ContractRegisterModal
            isOpen={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false)
              setEditingContract(null)
            }}
            onSubmit={handleContractEdit}
            mode="edit"
            initialData={editingContract ? {
              companyName: editingContract.customer.company,
              contactPerson: editingContract.customer.contact,
              email: "example@company.com",
              phone: editingContract.customer.phone,
              address: editingContract.customer.address,
              detailAddress: "",
              region: "",
              regionDetail: "",
              contractType: editingContract.type === "월계약" ? "monthly" : editingContract.type === "연계약" ? "annual" : "project",
              contractProduct: "select",
              operationTeam: "operation1",
              salesPerson: "sales1",
              monthlyAdCost: `₩${editingContract.adCost.monthly.toLocaleString()}`,
              postingCount: editingContract.postingCount.toString(),
              startDate: editingContract.period.start,
              endDate: editingContract.period.end,
              memo: "",
              products: editingContract.services.map((service, index) => ({
                id: index + 1,
                productOption: service.toLowerCase(),
                productAmount: `₩${(editingContract.contractAmount / editingContract.services.length).toLocaleString()}`,
                department: editingContract.team.department,
                manager: editingContract.team.sales,
              }))
            } : undefined}
            contractId={editingContract?.id}
          />

          {/* 막대형 로딩바 보기 팝업 (임시) */}
          <Dialog open={loadingBarDialogOpen} onOpenChange={setLoadingBarDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">막대로딩 컴포넌트</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <LoadingBar />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setLoadingBarDialogOpen(false)}
                >
                  닫기
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 로티 애니메이션 로딩 보기 팝업 (임시) */}
          <Dialog open={loadingAnimationDialogOpen} onOpenChange={setLoadingAnimationDialogOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">써클로딩 컴포넌트</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <div className="border border-gray-200 rounded-lg p-6 bg-white">
                  <LoadingAnimation size={60} />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setLoadingAnimationDialogOpen(false)}
                >
                  닫기
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* 얼럿창 팝업 (임시) */}
          <AlertConfirmModal
            isOpen={alertModalOpen}
            onClose={() => setAlertModalOpen(false)}
            onConfirm={handleAlertConfirm}
            showHeaderTitle={false}
            contentTitle="얼럿창 테스트!"
            message="얼럿창 메시지입니다."
            confirmText="확인"
            showCancel={false}
            maxWidth="320px"
          />

          {/* 선택복사 확인 모달 */}
          <AlertConfirmModal
            isOpen={copyModalOpen}
            onClose={() => setCopyModalOpen(false)}
            onConfirm={handleConfirmCopy}
            showHeaderTitle={false}
            contentTitle="계약 복사"
            message={`선택한 ${selectedContracts.length}개의 계약을 복사하시겠습니까?\n계약번호: ${selectedContracts.join(', ')}`}
            confirmText="복사하기"
            cancelText="취소"
            maxWidth="400px"
          />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
