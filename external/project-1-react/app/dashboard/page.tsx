"use client"

import type React from "react"
import { cloneElement, isValidElement } from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  TrendingUp,
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
  GripVertical,
  Settings,
  CreditCard,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { BellIcon } from "@heroicons/react/24/solid"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CustomTabs } from "@/components/ui/custom-tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Filler,
} from "chart.js"

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  ChartLegend,
  Filler
)
import { AlertTriangle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { chartColors } from "@/lib/chart-styles"
import Link from "next/link"
import { Sidebar, MobileMenuToggle } from "@/components/sidebar"
import Header from "@/components/header"
import EventPopup from "@/components/ui/event-popup"
import { Skeleton } from "@/components/ui/skeleton"

// 현재 페이지에 따른 메뉴 활성화 상태를 결정하는 함수
const getActiveMenuItems = () => {
  // 현재 페이지가 대시보드인 경우
  return [
    {
      id: "business",
      title: "업무관리",
      items: [
        { icon: FileContract, label: "계약현황", active: false },
        { icon: Briefcase, label: "업무현황", active: false },
      ]
    },
    {
      id: "analytics",
      title: "성과·분석",
      items: [
        { icon: MessageSquare, label: "포스팅현황", active: false },
        { icon: Search, label: "키워드현황", active: false },
        { icon: DollarSign, label: "매출현황", active: false },
        { icon: Target, label: "성과현황", active: false },
      ]
    },
    {
      id: "support",
      title: "지원",
      items: [
        { icon: Bot, label: "챗봇", active: false },
        { icon: Bell, label: "공지사항", active: false },
      ]
    },
    {
      id: "settings",
      title: "설정",
      items: [
        { icon: Building, label: "조직관리", active: false },
        { icon: Crown, label: "멤버십안내", active: false },
        { icon: User, label: "마이페이지", active: false },
      ]
    }
  ]
}

const monthlyRevenueData = [
  { month: "1월", revenue: 4200 },
  { month: "2월", revenue: 3800 },
  { month: "3월", revenue: 5100 },
  { month: "4월", revenue: 4600 },
  { month: "5월", revenue: 5800 },
  { month: "6월", revenue: 6200 },
]

// 공통 차트 팔레트 (메인 → 저채도 오렌지 → 저채도 그린 → 퍼플)
const chartPalette = [
  "#3b82f6", // primary blue
  "#F59E0B", // low-saturation orange
  "#10B981", // low-saturation green
  "#8b5cf6", // purple-500
]

// 추가 위젯용 더미 데이터
const ownerProgressData = [
  { name: "SEO", value: 45, color: chartPalette[0] },
  { name: "프리미엄", value: 30, color: chartPalette[1] },
  { name: "하나탑", value: 25, color: chartPalette[2] },
]

const contractCountTrendData = [
  { month: "1월", count: 40 },
  { month: "2월", count: 42 },
  { month: "3월", count: 39 },
  { month: "4월", count: 45 },
  { month: "5월", count: 47 },
  { month: "6월", count: 50 },
]

const serviceRevenueSumData = [
  { service: "SEO", amount: 120 },
  { service: "광고집행", amount: 95 },
  { service: "콘텐츠", amount: 70 },
  { service: "채널", amount: 55 },
]

// 팀별 성과 데이터 (단위: 원)
const teamPerformanceData = [
  { month: "1월", team1: 8000000, team2: 7000000, team3: 5500000, team4: 3000000 },
  { month: "2월", team1: 8200000, team2: 7200000, team3: 5700000, team4: 3050000 },
  { month: "3월", team1: 8400000, team2: 7400000, team3: 5900000, team4: 3100000 },
  { month: "4월", team1: 8600000, team2: 7600000, team3: 6100000, team4: 3150000 },
  { month: "5월", team1: 8800000, team2: 7800000, team3: 6300000, team4: 3200000 },
  { month: "6월", team1: 9000000, team2: 8000000, team3: 6500000, team4: 3250000 },
]

const taskStatusStackedData = [
  { team: "1팀", 진행중: 28, 완료: 35, 대기: 12 },
  { team: "2팀", 진행중: 32, 완료: 28, 대기: 15 },
  { team: "3팀", 진행중: 25, 완료: 30, 대기: 10 },
  { team: "4팀", 진행중: 18, 완료: 22, 대기: 8 },
]

const regionalCustomerData = [
  { name: "서울", value: 40, color: chartColors.primary },
  { name: "경기", value: 30, color: chartColors.teal },
  { name: "부산", value: 15, color: chartColors.secondary },
  { name: "기타", value: 15, color: chartColors.purple },
]

const performanceData = [
  { month: "1월", performance: 85 },
  { month: "2월", performance: 78 },
  { month: "3월", performance: 92 },
  { month: "4월", performance: 88 },
  { month: "5월", performance: 94 },
  { month: "6월", performance: 96 },
]

const designSystem = {
  colors: {
    primary: "var(--primary)",
    accent: "var(--chart-6)",
    neutral: "var(--muted-foreground)",
  },
}

const taskProgressData = [
  { name: "진행중", value: 8, color: "#3b82f6" }, // blue
  { name: "완료", value: 12, color: "#10B981" }, // green
  { name: "대기", value: 4, color: "#94A3B8" }, // gray (slate-400)
]

const defaultWidgets = [
  { id: "contract-overview", title: "계약 현황 개요", type: "overview", enabled: true },
  { id: "revenue-chart", title: "월별 매출 추이", type: "chart", enabled: true },
  { id: "task-progress", title: "업무 진행률", type: "donut", enabled: true },
  { id: "keyword-performance", title: "키워드 성과", type: "performance", enabled: true },
  // 추가 위젯
  { id: "owner-progress", title: "서비스별 계약 분포", type: "pie", enabled: true },
  { id: "contract-count-trend", title: "계약 단가 추이", type: "line", enabled: true },
  { id: "service-revenue-sum", title: "서비스별 매출 합계", type: "bar", enabled: true },
  { id: "team-performance", title: "팀별 성과", type: "line", enabled: true },
  { id: "task-status", title: "팀별 업무 현황", type: "stacked-bar", enabled: true },
  { id: "contract-deadline-alert", title: "계약 마감 알림", type: "card", enabled: true },
  { id: "revenue-kpi", title: "성과 KPI", type: "card", enabled: true },
  { id: "sales-kpi", title: "매출 KPI", type: "card", enabled: true },
  { id: "posting-status", title: "포스팅 현황", type: "card", enabled: true },
  { id: "profit-analysis", title: "손익 분석", type: "placeholder", enabled: true },
  { id: "regional-customer-distribution", title: "지역별 고객 분포", type: "pie", enabled: true },
  { id: "customer-status", title: "고객 현황", type: "card", enabled: true },
  { id: "task-summary", title: "업무 요약", type: "card", enabled: true },
]

const notificationData = [
  {
    id: 1,
    label: "공지",
    date: "2024-01-15",
    content: "새로운 기능 업데이트가 완료되었습니다. 더 나은 서비스를 위해 지속적으로 개선하겠습니다.",
    isRead: false
  },
  {
    id: 2,
    label: "이벤트",
    date: "2024-01-14",
    content: "신규 고객 대상 특별 할인 이벤트가 진행 중입니다. 지금 바로 확인해보세요!",
    isRead: false
  },
  {
    id: 3,
    label: "공지",
    date: "2024-01-13",
    content: "시스템 점검 안내: 1월 20일 오전 2시-4시 시스템 점검이 예정되어 있습니다.",
    isRead: true
  },
  {
    id: 4,
    label: "이벤트",
    date: "2024-01-12",
    content: "월간 리포트 발행! 이번 달 성과를 확인하고 다음 달 계획을 세워보세요.",
    isRead: true
  },
  {
    id: 5,
    label: "공지",
    date: "2024-01-11",
    content: "보안 강화를 위한 2단계 인증 설정을 권장드립니다.",
    isRead: true
  }
]

export default function Dashboard() {
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const [widgets, setWidgets] = useState(defaultWidgets)
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null)
  const [dragOverWidget, setDragOverWidget] = useState<string | null>(null)
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null)
  const [touchCurrentPos, setTouchCurrentPos] = useState<{ x: number; y: number } | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [contractFilter, setContractFilter] = useState<string>('등록일순')
  const [eventPopupOpen, setEventPopupOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const enabledWidgets = widgets.filter((w) => w.enabled)

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // 외부 클릭 시 알림 드롭다운 닫기
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
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [notificationOpen, userMenuOpen])

  const handleDeleteWidget = (widgetId: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === widgetId ? { ...w, enabled: false } : w)))
  }

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId)
    e.dataTransfer.effectAllowed = "move"
  }

  // 터치 이벤트 핸들러 추가
  const handleTouchStart = (e: React.TouchEvent, widgetId: string) => {
    if (!editMode) return
    e.preventDefault() // 기본 스크롤 동작 방지
    setDraggedWidget(widgetId)
    const touch = e.touches[0]
    setTouchStartPos({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!editMode || !draggedWidget) return
    e.preventDefault() // 기본 스크롤 동작 방지
    const touch = e.touches[0]
    setTouchCurrentPos({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!editMode || !draggedWidget) return
    
    const touch = e.changedTouches[0]
    const element = document.elementFromPoint(touch.clientX, touch.clientY)
    
    // 드롭 대상 찾기
    const dropTarget = element?.closest('[data-widget-id]')
    const targetId = dropTarget?.getAttribute('data-widget-id')
    
    if (targetId && targetId !== draggedWidget) {
      // 위젯 순서 변경
      setWidgets((prev) => {
        const newWidgets = [...prev]
        const draggedIndex = newWidgets.findIndex((w) => w.id === draggedWidget)
        const targetIndex = newWidgets.findIndex((w) => w.id === targetId)

        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedItem] = newWidgets.splice(draggedIndex, 1)
          newWidgets.splice(targetIndex, 0, draggedItem)
        }

        return newWidgets
      })
    }
    
    setDraggedWidget(null)
    setTouchStartPos(null)
    setTouchCurrentPos(null)
  }

  const handleDragOver = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    
    if (targetId && targetId !== draggedWidget) {
      setDragOverWidget(targetId)
    }
  }

  const handleDrop = (e: React.DragEvent, targetId?: string) => {
    e.preventDefault()
    setDragOverWidget(null)
    
    if (!draggedWidget) return

    // targetId가 없으면 (빈 공간에 드롭) 맨 끝에 추가
    if (!targetId) {
      setWidgets((prev) => {
        const newWidgets = [...prev]
        const draggedIndex = newWidgets.findIndex((w) => w.id === draggedWidget)
        
        if (draggedIndex !== -1) {
          const [draggedItem] = newWidgets.splice(draggedIndex, 1)
          newWidgets.push(draggedItem)
        }
        
        return newWidgets
      })
    } else if (draggedWidget !== targetId) {
      // 기존 로직: 특정 위젯 위치에 드롭
      setWidgets((prev) => {
        const newWidgets = [...prev]
        const draggedIndex = newWidgets.findIndex((w) => w.id === draggedWidget)
        const targetIndex = newWidgets.findIndex((w) => w.id === targetId)

        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedItem] = newWidgets.splice(draggedIndex, 1)
          newWidgets.splice(targetIndex, 0, draggedItem)
        }

        return newWidgets
      })
    }
    
    setDraggedWidget(null)
  }

  const handleDragEnd = () => {
    setDraggedWidget(null)
    setDragOverWidget(null)
  }

  const renderMetricCard = (
    id: string,
    title: string,
    value: string,
    badge: React.ReactNode,
    icon?: React.ReactNode,
  ) => (
    <Card
      key={id}
      className={cn(
        "shadow-none rounded-2xl border relative overflow-hidden",
        id === "revenue" ? "bg-gradient-to-b from-[#1060DA] to-[#3679DE] text-white border-transparent" : "",
        "gap-3"
      )}
    >
      <CardHeader className="pt-4 sm:pt-6 pb-1 px-4 sm:px-6 flex flex-row items-center justify-between">
        <CardTitle
          className={`text-sm font-medium ${id === "revenue" ? "text-white/90" : "text-muted-foreground"}`}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pt-1 pb-4 sm:pb-6">
        <div className={`text-base sm:text-2xl font-semibold ${id === "revenue" ? "text-white" : "text-foreground"}`}>{value}</div>
        <div
          className={`flex items-center gap-1 mt-1 text-sm ${
            id === "revenue"
              ? "text-white/90"
              : ""
          }`}
        >
          {id === "revenue" ? (
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-white/15 text-white text-xs font-medium">
              전월 대비 +6.8% 증가
            </div>
          ) : (
            badge
          )}
        </div>
      </CardContent>
      {icon && (
        <div className="absolute bottom-[2px] right-1 select-none pointer-events-none opacity-95 hidden sm:block">
          {isValidElement(icon)
            ? cloneElement(icon as any, {
                className: "h-[60px] w-[60px] xl:h-[77px] xl:w-[77px]",
              })
            : icon}
        </div>
      )}
    </Card>
  )

  const renderWidget = (widget: any) => {
    const isBeingDragged = draggedWidget === widget.id

    const widgetContent = () => {
      switch (widget.id) {
        case "contract-overview":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">계약 현황 개요</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-base font-bold text-foreground mb-1">21건</div>
                      <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
                        +3건 이번 달
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">진행중</span>
                        <span className="text-base font-bold text-foreground">15건</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">완료</span>
                        <span className="text-base font-bold text-foreground">4건</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">만료 예정</span>
                        <span className="text-base font-bold text-foreground">2건</span>
                      </div>
                    </div>
                </div>
              </CardContent>
            </Card>
          )

        case "revenue-chart":
          return (
            <Card className="xl:col-span-2 shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">월별 매출 추이</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="w-full h-[200px]">
                  <Line
                    data={{
                      labels: monthlyRevenueData.map(d => d.month),
                      datasets: [{
                        label: '매출',
                        data: monthlyRevenueData.map(d => d.revenue),
                        borderColor: '#3b82f6',
                        backgroundColor: 'transparent',
                        borderWidth: 2.5,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 10,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#3b82f6',
                        pointBorderWidth: 3,
                        fill: false,
                        segment: {
                          borderDash: (ctx: any) => {
                            const value = ctx.p0.$context.parsed.y
                            const nextValue = ctx.p1.$context.parsed.y
                            return value > nextValue ? [6, 6] : undefined
                          }
                        }
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          titleColor: '#ffffff',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 2,
                          padding: 20,
                          cornerRadius: 12,
                          titleFont: { size: 14, weight: 'bold' },
                          bodyFont: { size: 13 },
                          callbacks: {
                            label: function(context) {
                              return `     ${(context.parsed.y || 0).toLocaleString()}만원`
                            },
                            afterLabel: function(context) {
                              const dataIndex = context.dataIndex
                              if (dataIndex > 0) {
                                const currentValue = context.parsed.y || 0
                                const previousValue = monthlyRevenueData[dataIndex - 1].revenue
                                const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
                                const changeText = currentValue > previousValue
                                  ? `▲ ${change}%`
                                  : currentValue < previousValue
                                  ? `▼ ${Math.abs(Number(change))}%`
                                  : '―'
                                return `     전월대비: ${changeText}`
                              }
                              return ''
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: "#475569", font: { size: 12 } }
                        },
                        y: {
                          grid: { color: 'rgba(226, 232, 240, 0.5)' },
                          ticks: { color: "#475569", font: { size: 12 } }
                        }
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutCubic',
                        delay: (context) => {
                          let delay = 0
                          if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 100
                          }
                          return delay
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )

        case "task-progress":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">업무 진행률</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="w-full h-[200px]">
                  <Doughnut
                    data={{
                      labels: ['진행중', '완료', '대기'],
                      datasets: [{
                        data: [10, 5, 5],
                        backgroundColor: [chartColors.primary, chartColors.secondary, chartColors.gray],
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverOffset: 8,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '60%',
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom',
                          labels: {
                            color: '#475569',
                            font: { size: 12 },
                            padding: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          titleColor: '#ffffff',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 2,
                          padding: 16,
                          cornerRadius: 12,
                          callbacks: {
                            label: function(context) {
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                              const percentage = ((context.parsed / total) * 100).toFixed(1)
                              return `     ${context.label}: ${context.parsed}건 (${percentage}%)`
                            }
                          }
                        }
                      },
                      animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1500,
                        easing: 'easeInOutCubic'
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )

        case "keyword-performance":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">키워드 성과</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">상위 5위 내 키워드</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-foreground mb-1.5">77개</div>
                    <p className="text-sm text-muted-foreground mb-3">(전체 120개 중 64%)</p>
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--bg-light-blue)] text-[var(--primary)] text-sm font-medium">
                      <TrendingUp className="h-3 w-3" />
                      +8개
                    </div>
                  </div>
                  <div className="text-center pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">평균 순위 6.2위</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

        // performance-chart 제거

        case "owner-progress":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">서비스별 계약 분포</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                {(() => {
                  const getOwnerColor = (name: string) => {
                    switch (name) {
                      case "SEO":
                        return chartColors.primary
                      case "프리미엄":
                        return chartColors.teal
                      case "하나탑":
                        return chartColors.secondary
                      default:
                        return chartColors.primary
                    }
                  }
                  return (
                    <>
                      <div className="w-full h-[180px]">
                        <Bar
                          data={{
                            labels: ownerProgressData.map(d => d.name),
                            datasets: [{
                              label: '비율',
                              data: ownerProgressData.map(d => d.value),
                              backgroundColor: ownerProgressData.map(d => getOwnerColor(d.name)),
                              borderColor: ownerProgressData.map(d => getOwnerColor(d.name)),
                              borderWidth: 2,
                              borderRadius: 8,
                              barThickness: 40,
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: {
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                titleColor: '#ffffff',
                                bodyColor: '#e2e8f0',
                                borderColor: '#475569',
                                borderWidth: 2,
                                padding: 16,
                                cornerRadius: 12,
                                callbacks: {
                                  label: function(context) {
                                    return `     ${context.parsed.y}%`
                                  }
                                }
                              }
                            },
                            scales: {
                              x: {
                                grid: { display: false },
                                ticks: { color: "#475569", font: { size: 12 } }
                              },
                              y: {
                                grid: { color: 'rgba(226, 232, 240, 0.5)' },
                                ticks: { color: "#475569", font: { size: 12 } }
                              }
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeInOutCubic',
                              delay: (context) => context.dataIndex * 100
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 px-2">
                        {ownerProgressData.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getOwnerColor(item.name) }} />
                            <span className="text-sm text-muted-foreground">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )

        case "contract-count-trend":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">계약 단가 추이</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="w-full h-[200px]">
                  <Line
                    data={{
                      labels: contractCountTrendData.map(d => d.month),
                      datasets: [{
                        label: '단가',
                        data: contractCountTrendData.map(d => d.count),
                        borderColor: '#3b82f6',
                        backgroundColor: 'transparent',
                        borderWidth: 2.5,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 10,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#3b82f6',
                        pointBorderWidth: 3,
                        fill: false,
                        segment: {
                          borderDash: (ctx: any) => {
                            const value = ctx.p0.$context.parsed.y
                            const nextValue = ctx.p1.$context.parsed.y
                            return value > nextValue ? [6, 6] : undefined
                          }
                        }
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          titleColor: '#ffffff',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 2,
                          padding: 20,
                          cornerRadius: 12,
                          callbacks: {
                            label: function(context) {
                              return `     ${context.parsed.y}만원`
                            },
                            afterLabel: function(context) {
                              const dataIndex = context.dataIndex
                              if (dataIndex > 0) {
                                const currentValue = context.parsed.y || 0
                                const previousValue = contractCountTrendData[dataIndex - 1].count
                                const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
                                const changeText = currentValue > previousValue
                                  ? `▲ ${change}%`
                                  : currentValue < previousValue
                                  ? `▼ ${Math.abs(Number(change))}%`
                                  : '―'
                                return `     전월대비: ${changeText}`
                              }
                              return ''
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: "#475569", font: { size: 12 } }
                        },
                        y: {
                          grid: { color: 'rgba(226, 232, 240, 0.5)' },
                          ticks: { color: "#475569", font: { size: 12 } }
                        }
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutCubic',
                        delay: (context) => {
                          let delay = 0
                          if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 100
                          }
                          return delay
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )

        case "service-revenue-sum":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">서비스별 매출 현황</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                {(() => {
                  const getServiceColorByIndex = (index: number, name: string) => {
                    if (name === "SEO") return chartColors.primary
                    if (name === "채널") return chartColors.purple
                    if (index === 1) return chartColors.teal
                    if (index === 2) return chartColors.secondary
                    return chartColors.primary
                  }
                  return (
                    <>
                      <div className="w-full h-[200px]">
                        <Bar
                          data={{
                            labels: serviceRevenueSumData.map(d => d.service),
                            datasets: [{
                              label: '매출',
                              data: serviceRevenueSumData.map(d => d.amount),
                              backgroundColor: serviceRevenueSumData.map((d, i) => getServiceColorByIndex(i, d.service)),
                              borderColor: serviceRevenueSumData.map((d, i) => getServiceColorByIndex(i, d.service)),
                              borderWidth: 2,
                              borderRadius: 8,
                              barThickness: 40,
                            }]
                          }}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { display: false },
                              tooltip: {
                                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                titleColor: '#ffffff',
                                bodyColor: '#e2e8f0',
                                borderColor: '#475569',
                                borderWidth: 2,
                                padding: 16,
                                cornerRadius: 12,
                                callbacks: {
                                  label: function(context) {
                                    return `     ${(context.parsed.y || 0).toLocaleString()}만원`
                                  }
                                }
                              }
                            },
                            scales: {
                              x: {
                                grid: { display: false },
                                ticks: { color: "#475569", font: { size: 12 } }
                              },
                              y: {
                                grid: { color: 'rgba(226, 232, 240, 0.5)' },
                                ticks: { color: "#475569", font: { size: 12 } }
                              }
                            },
                            animation: {
                              duration: 1500,
                              easing: 'easeInOutCubic',
                              delay: (context) => context.dataIndex * 100
                            }
                          }}
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-2 px-2">
                        {serviceRevenueSumData.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getServiceColorByIndex(i, item.service) }} />
                            <span className="text-sm text-muted-foreground">{item.service}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )

        case "team-performance":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">팀별 성과</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="w-full h-[200px]">
                  <Line
                    data={{
                      labels: teamPerformanceData.map(d => d.month),
                      datasets: [
                        {
                          label: '1팀',
                          data: teamPerformanceData.map(d => d.team1),
                          borderColor: '#3b82f6',
                          backgroundColor: 'transparent',
                          borderWidth: 2.5,
                          tension: 0.4,
                          pointRadius: 5,
                          pointHoverRadius: 8,
                          pointBackgroundColor: '#ffffff',
                          pointBorderColor: '#3b82f6',
                          pointBorderWidth: 2,
                        },
                        {
                          label: '2팀',
                          data: teamPerformanceData.map(d => d.team2),
                          borderColor: '#10B981',
                          backgroundColor: 'transparent',
                          borderWidth: 2.5,
                          tension: 0.4,
                          pointRadius: 5,
                          pointHoverRadius: 8,
                          pointBackgroundColor: '#ffffff',
                          pointBorderColor: '#10B981',
                          pointBorderWidth: 2,
                        },
                        {
                          label: '3팀',
                          data: teamPerformanceData.map(d => d.team3),
                          borderColor: '#F59E0B',
                          backgroundColor: 'transparent',
                          borderWidth: 2.5,
                          tension: 0.4,
                          pointRadius: 5,
                          pointHoverRadius: 8,
                          pointBackgroundColor: '#ffffff',
                          pointBorderColor: '#F59E0B',
                          pointBorderWidth: 2,
                        },
                        {
                          label: '4팀',
                          data: teamPerformanceData.map(d => d.team4),
                          borderColor: '#8b5cf6',
                          backgroundColor: 'transparent',
                          borderWidth: 2.5,
                          tension: 0.4,
                          pointRadius: 5,
                          pointHoverRadius: 8,
                          pointBackgroundColor: '#ffffff',
                          pointBorderColor: '#8b5cf6',
                          pointBorderWidth: 2,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom',
                          labels: {
                            color: '#475569',
                            font: { size: 12 },
                            padding: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          titleColor: '#ffffff',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 2,
                          padding: 16,
                          cornerRadius: 12,
                          callbacks: {
                            label: function(context) {
                              return `     ${context.dataset.label}: ${(context.parsed.y || 0).toLocaleString()}원`
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: "#475569", font: { size: 12 } }
                        },
                        y: {
                          grid: { color: 'rgba(226, 232, 240, 0.5)' },
                          ticks: {
                            color: "#475569",
                            font: { size: 12 },
                            callback: function(value) {
                              return `${Math.round(Number(value) / 1000000)}백만`
                            }
                          }
                        }
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutCubic',
                        delay: (context) => {
                          let delay = 0
                          if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 80
                          }
                          return delay
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )

        case "task-status":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">팀별 업무 현황</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="w-full h-[200px]">
                  <Bar
                    data={{
                      labels: taskStatusStackedData.map(d => d.team),
                      datasets: [
                        {
                          label: '진행중',
                          data: taskStatusStackedData.map(d => d.진행중),
                          backgroundColor: '#3b82f6',
                          borderColor: '#3b82f6',
                          borderWidth: 1,
                          borderRadius: 6,
                          barThickness: 30,
                        },
                        {
                          label: '완료',
                          data: taskStatusStackedData.map(d => d.완료),
                          backgroundColor: chartColors.secondary,
                          borderColor: chartColors.secondary,
                          borderWidth: 1,
                          borderRadius: 6,
                          barThickness: 30,
                        },
                        {
                          label: '대기',
                          data: taskStatusStackedData.map(d => d.대기),
                          backgroundColor: chartColors.gray,
                          borderColor: chartColors.gray,
                          borderWidth: 1,
                          borderRadius: 6,
                          barThickness: 30,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom',
                          labels: {
                            color: '#475569',
                            font: { size: 12 },
                            padding: 12,
                            usePointStyle: true,
                            pointStyle: 'rect'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          titleColor: '#ffffff',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 2,
                          padding: 16,
                          cornerRadius: 12,
                          callbacks: {
                            label: function(context) {
                              return `     ${context.dataset.label}: ${context.parsed.y}건`
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          stacked: true,
                          grid: { display: false },
                          ticks: { color: "#475569", font: { size: 12 } }
                        },
                        y: {
                          stacked: true,
                          grid: { color: 'rgba(226, 232, 240, 0.5)' },
                          ticks: { color: "#475569", font: { size: 12 } }
                        }
                      },
                      animation: {
                        duration: 1500,
                        easing: 'easeInOutCubic',
                        delay: (context) => context.dataIndex * 100
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )

        case "contract-deadline-alert":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">계약 마감 알림</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-4">
                  {/* 총 건수 표시 */}
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-800">총 만료 예정 계약건 : 3건</div>
                  </div>
                  
                  {/* 개별 기업별 알림 카드들 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-normal text-red-800">(주)테크솔루션</div>
                      </div>
                      <div className="text-sm font-normal text-red-700">2025-09-30</div>
                    </div>
                    
                    <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-normal text-red-800">글로벌마케팅</div>
                      </div>
                      <div className="text-sm font-normal text-red-700">2025-10-15</div>
                    </div>
                    
                    <div className="flex items-center gap-2 py-1 px-2 rounded-lg bg-gradient-to-r from-red-50 to-red-100 border border-red-200">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-3 w-3 text-red-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-normal text-red-800">스마트비즈니스</div>
                      </div>
                      <div className="text-sm font-normal text-red-700">2025-11-20</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

        case "revenue-kpi":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">성과 KPI</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-xl p-2.5 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="text-xs font-medium text-blue-700 uppercase tracking-wide">총매출</div>
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-blue-900">₩320M</div>
                  </div>
                  
                  <div className="rounded-xl p-2.5 sm:p-4 bg-gradient-to-br from-purple-50 to-purple-100/70 border border-purple-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="text-xs font-medium text-purple-700 uppercase tracking-wide">인당 매출</div>
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-purple-900">₩5.2M</div>
                  </div>
                  
                  <div className="rounded-xl p-2.5 sm:p-4 bg-gradient-to-br from-rose-50 to-rose-100/70 border border-rose-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="text-xs font-medium text-rose-700 uppercase tracking-wide">총 인원</div>
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-rose-900">38명</div>
                  </div>
                  
                  <div className="rounded-xl p-2.5 sm:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide">평균 업체수</div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-emerald-900">12개</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

        case "sales-kpi":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">매출 KPI</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-xl p-2.5 sm:p-4 bg-gradient-to-br from-amber-50 to-amber-100/70 border border-amber-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="text-xs font-medium text-amber-700 uppercase tracking-wide">총 매출</div>
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-amber-900">₩350M</div>
                  </div>
                  
                  <div className="rounded-xl p-2.5 sm:p-4 bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide">비용비율</div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-emerald-900">88%</div>
                  </div>
                  
                  <div className="rounded-xl p-2.5 sm:p-4 bg-gradient-to-br from-indigo-50 to-indigo-100/70 border border-indigo-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="text-xs font-medium text-indigo-700 uppercase tracking-wide">평균 계약 단가</div>
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-indigo-900">₩14.7M</div>
                  </div>
                  
                  <div className="rounded-xl p-2.5 sm:p-4 bg-gradient-to-br from-cyan-50 to-cyan-100/70 border border-cyan-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="text-xs font-medium text-cyan-700 uppercase tracking-wide">포스팅비용</div>
                      <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                    </div>
                    <div className="text-base sm:text-xl font-bold text-cyan-900">₩308M</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

        case "posting-status":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">포스팅 현황</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <div className="text-2xl font-semibold text-[var(--primary)]">120</div>
                    <div className="text-xs text-muted-foreground">총 포스팅</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-red-500">15</div>
                    <div className="text-xs text-muted-foreground">재작업</div>
                  </div>
                  <div>
                    <div className="text-2xl font-semibold text-emerald-600">105</div>
                    <div className="text-xs text-muted-foreground">유효작업</div>
                  </div>
                </div>
                <div className="my-4 h-px bg-border" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">제작입률</span>
                  <span className="text-red-500 font-semibold">12.5%</span>
                </div>
              </CardContent>
            </Card>
          )

        case "profit-analysis":
          // 순위분포: 키워드/성과 분포 예시 데이터 (1~3, 4~10, 11~20, 21~50, 51+)
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">순위분포</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                {(() => {
                  const rankData = [
                    { range: "1~3위", count: 12 },
                    { range: "4~10위", count: 20 },
                    { range: "11~20위", count: 16 },
                    { range: "21~50위", count: 9 },
                    { range: "51위+", count: 5 },
                  ]
                  
                  const totalCount = rankData.reduce((sum, item) => sum + item.count, 0)
                  const maxCount = Math.max(...rankData.map(item => item.count))
                  
                  const getBarColor = (count: number) => {
                    return count === maxCount ? "#3b82f6" : "#93C5FD"
                  }
                  
                  return (
                    <div className="w-full h-[200px]">
                      <Bar
                        data={{
                          labels: rankData.map(d => d.range),
                          datasets: [{
                            label: '개수',
                            data: rankData.map(d => d.count),
                            backgroundColor: rankData.map(d => getBarColor(d.count)),
                            borderColor: rankData.map(d => getBarColor(d.count)),
                            borderWidth: 2,
                            borderRadius: 8,
                            barThickness: 50,
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { display: false },
                            tooltip: {
                              backgroundColor: 'rgba(15, 23, 42, 0.95)',
                              titleColor: '#ffffff',
                              bodyColor: '#e2e8f0',
                              borderColor: '#475569',
                              borderWidth: 2,
                              padding: 16,
                              cornerRadius: 12,
                              callbacks: {
                                title: function(context) {
                                  const index = context[0].dataIndex
                                  const count = rankData[index].count
                                  const percentage = ((count / totalCount) * 100).toFixed(1)
                                  return `${context[0].label} (${percentage}%)`
                                },
                                label: function(context) {
                                  return `     ${context.parsed.y}개`
                                }
                              }
                            }
                          },
                          scales: {
                            x: {
                              grid: { display: false },
                              ticks: { color: "#475569", font: { size: 12 } }
                            },
                            y: {
                              grid: { color: 'rgba(226, 232, 240, 0.5)' },
                              ticks: { color: "#475569", font: { size: 12 } }
                            }
                          },
                          animation: {
                            duration: 1500,
                            easing: 'easeInOutCubic',
                            delay: (context) => context.dataIndex * 100
                          }
                        }}
                      />
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )

        case "regional-customer-distribution":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">지역별 고객 분포</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="w-full h-[200px]">
                  <Doughnut
                    data={{
                      labels: regionalCustomerData.map(d => d.name),
                      datasets: [{
                        data: regionalCustomerData.map(d => d.value),
                        backgroundColor: regionalCustomerData.map(d => d.color),
                        borderColor: '#ffffff',
                        borderWidth: 3,
                        hoverOffset: 8,
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      cutout: '60%',
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom',
                          labels: {
                            color: '#475569',
                            font: { size: 12 },
                            padding: 12,
                            usePointStyle: true,
                            pointStyle: 'circle'
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          titleColor: '#ffffff',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 2,
                          padding: 16,
                          cornerRadius: 12,
                          callbacks: {
                            label: function(context) {
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                              const percentage = ((context.parsed / total) * 100).toFixed(1)
                              return `     ${context.label}: ${context.parsed}개 (${percentage}%)`
                            }
                          }
                        }
                      },
                      animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1500,
                        easing: 'easeInOutCubic'
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )

        case "customer-status":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">고객 현황</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">총 고객사</span>
                    <span className="text-2xl font-bold text-foreground">30개</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">진행중</span>
                    <span className="text-sm font-medium text-[var(--primary)]">15개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">완료</span>
                    <span className="text-sm font-medium text-emerald-600">8개</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">중지</span>
                    <span className="text-sm font-medium text-red-500">7개</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

        case "task-summary":
          return (
            <Card className="shadow-none rounded-2xl border h-auto sm:h-80 gap-3">
              <CardHeader className="pt-8 sm:pt-8 px-4 sm:px-6 pb-3">
                <CardTitle className="text-base font-semibold">업무 요약</CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">총 업무</span>
                    <span className="text-2xl font-bold text-foreground">45건</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">진행중</span>
                    <span className="text-sm font-medium text-[var(--primary)]">18건</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">대기</span>
                    <span className="text-sm font-medium text-amber-500">12건</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">완료</span>
                    <span className="text-sm font-medium text-emerald-600">15건</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

        default:
          return null
      }
    }

    return (
      <div
        key={widget.id}
        className={`relative group transition-opacity ${isBeingDragged ? "opacity-50" : ""} ${editMode ? "cursor-move" : ""}`}
        draggable={editMode}
        data-widget-id={widget.id}
        onDragStart={(e) => handleDragStart(e, widget.id)}
        onDragEnd={handleDragEnd}
        onTouchStart={(e) => handleTouchStart(e, widget.id)}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: editMode ? 'none' : 'auto' }}
      >
        {editMode && (
          <div className="absolute top-4 left-2 z-10 pointer-events-none">
            <div className="h-6 w-6 flex items-center justify-center">
              <GripVertical className="h-3 w-3 text-gray-500" />
            </div>
          </div>
        )}
        {editMode && (
          <div className="absolute top-4 right-2 z-10">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 bg-transparent hover:bg-transparent border-0 shadow-none"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteWidget(widget.id)
              }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <X className="h-3 w-3 text-gray-800" />
            </Button>
          </div>
        )}
        {widgetContent()}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* 이벤트 팝업 */}
      <EventPopup
        isOpen={eventPopupOpen}
        onClose={() => setEventPopupOpen(false)}
        popupId="ridi2024-awards"
        onButtonClick={() => {
          window.open("https://example.com/event", "_blank")
          setEventPopupOpen(false)
        }}
        backgroundImage="/popup-test2.jpg"
        buttonText="이벤트 보러가기"
        showImageButton={true}
        width="400px"
        height="500px"
      />

      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="대시보드"
      />

      <div className="flex">
        <Sidebar 
          currentPage="dashboard" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-20 sm:pb-24 lg:pb-48 space-y-4 sm:space-y-6">
          {isLoading ? (
            // 스켈레톤 UI
            <>
              {/* 모바일용 컴팩트 그룹 스켈레톤 */}
              <Card className="sm:hidden shadow-none rounded-2xl border py-2 px-0">
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <Skeleton className="h-12 w-full rounded-lg mb-3" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                </CardContent>
              </Card>

              {/* PC용 메트릭 카드 스켈레톤 */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="shadow-none rounded-2xl border relative overflow-hidden">
                    <CardHeader className="pt-4 sm:pt-6 pb-1 px-4 sm:px-6 flex flex-row items-center justify-between">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pt-1 pb-4 sm:pb-6">
                      <Skeleton className="h-6 sm:h-8 w-32 mb-2" />
                      <Skeleton className="h-4 w-28" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 대시보드 위젯 헤더 스켈레톤 */}
              <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8 md:mt-10">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-32" />
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Skeleton className="h-8 w-24 sm:w-28" />
                    <Skeleton className="h-8 w-20 sm:w-24" />
                  </div>
                </div>

                {/* 위젯 그리드 스켈레톤 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-3">
                  {[...Array(6)].map((_, i) => (
                    <Card 
                      key={i} 
                      className={`shadow-none rounded-2xl border h-auto sm:h-80 ${
                        i === 0 ? "col-span-1 sm:col-span-2 lg:col-span-12 xl:col-span-8" : "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-4"
                      }`}
                    >
                      <CardHeader className="pt-4 sm:pt-6 px-4 sm:px-6 pb-3">
                        <Skeleton className="h-5 w-32" />
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                        <Skeleton className="h-[200px] w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // 실제 콘텐츠
            <>
          {/* 모바일용 컴팩트 그룹 */}
          <Card className="sm:hidden shadow-none rounded-2xl border py-2 px-0">
            <CardContent className="p-3">
              <div className="space-y-1">
                {/* 이번 달 매출 - 별도 그룹 */}
                <div className="flex items-center justify-between py-3 px-3 mb-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium px-2 py-0.5 rounded text-white w-24 text-center">
                      이번 달 매출
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-white/90">+6.8%</div>
                    <div className="text-sm font-semibold text-white">₩308,000,000</div>
                  </div>
                </div>
                
                {/* 나머지 메트릭들 */}
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium px-2 py-0.5 rounded border border-indigo-500 text-indigo-600 w-24 text-center">
                      계약 건수
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-emerald-600">+3건</div>
                    <div className="text-sm font-semibold">21건</div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium px-2 py-0.5 rounded border border-orange-500 text-orange-600 w-24 text-center">
                      재작업 포스팅
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-emerald-600">12.5%</div>
                    <div className="text-sm font-semibold">3건</div>
                  </div>
                </div>
                <div className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium px-2 py-0.5 rounded border border-blue-500 text-blue-600 w-24 text-center">
                      우수 키워드
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-xs text-emerald-600">좋음 이상</div>
                    <div className="text-sm font-semibold">8개</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PC용 기존 그리드 */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {renderMetricCard(
              "revenue",
              "이번 달 매출",
              "₩308,000,000",
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-50 text-green-600 text-xs font-medium">
                전월 대비 +6.8% 증가
              </div>,
              <img src="/icons/icon-money.png" alt="매출 아이콘" className="h-12 w-12 sm:h-14 sm:w-14" />,
            )}
            {renderMetricCard(
              "contracts",
              "계약 건수",
              "21건",
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                전월 대비 +3건 증가
              </div>,
              <img src="/icons/icon-stamp.png" alt="계약 아이콘" className="h-12 w-12 sm:h-14 sm:w-14" />,
            )}
            
            {renderMetricCard(
              "posts",
              "재작업 포스팅",
              "3건",
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                재작업률 12.5%
              </div>,
              <img src="/icons/icon-reposting.png" alt="재작업 아이콘" className="h-12 w-12 sm:h-14 sm:w-14" />,
            )}
            {renderMetricCard(
              "keywords",
              "우수 키워드",
              "8개",
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                좋음 이상 점검결과
              </div>,
              <img src="/icons/icon-key.png" alt="키 아이콘" className="h-12 w-12 sm:h-14 sm:w-14" />,
            )}
          </div>

          <div className="space-y-3 sm:space-y-4 mt-6 sm:mt-8 md:mt-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">대시보드 위젯</h2>

              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setEditMode(!editMode)}
                  className={`transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                    editMode 
                      ? "bg-[var(--primary)] text-white border-[var(--primary)] hover:bg-[var(--primary)]/90 hover:text-white" 
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{editMode ? "편집 완료" : "위젯 편집"}</span>
                  <span className="sm:hidden">{editMode ? "완료" : "편집"}</span>
                </Button>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-[color-mix(in_oklab,var(--primary),white_30%)] to-[color-mix(in_oklab,var(--primary),white_20%)] hover:from-[color-mix(in_oklab,var(--primary),white_20%)] hover:to-[color-mix(in_oklab,var(--primary),white_10%)] text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-xs font-bold">+</span>
                      </div>
                      <span className="hidden sm:inline">위젯 추가</span>
                      <span className="sm:hidden">추가</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-2xl h-[90vh] sm:h-[85vh] overflow-hidden flex flex-col">
                    <DialogHeader className="pb-2 sm:pb-3">
                      <div>
                        <DialogTitle className="text-lg sm:text-xl font-bold">
                          위젯추가
                        </DialogTitle>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                          원하는 위젯을 선택하여 대시보드에 추가하세요.
                        </p>
                      </div>
                    </DialogHeader>
                    
                    {/* 카테고리 탭 */}
                    <div className="mt-1">
                      <CustomTabs
                        tabs={[
                          { value: "ALL", label: "ALL" },
                          { value: "계약", label: "계약" },
                          { value: "매출", label: "매출" },
                          { value: "업무", label: "업무" },
                          { value: "포스팅", label: "포스팅" },
                          { value: "성과", label: "성과" },
                          { value: "고객", label: "고객" },
                        ]}
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      />
                    </div>

                    <div className="mt-2 sm:mt-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-[70vh] sm:max-h-[65vh] overflow-y-auto pr-1 sm:pr-2 pb-4 sm:pb-6">
                        {[
                          { id: "contract-overview", name: "계약 현황 개요", desc: "계약 건수 요약 위젯", size: "M", category: "계약" },
                          { id: "owner-progress", name: "서비스별 계약 분포", desc: "서비스별 계약 비율", size: "M", category: "계약" },
                          { id: "contract-count-trend", name: "계약 단가 추이", desc: "월별 계약 단가 추이", size: "L", category: "계약" },
                          { id: "contract-deadline-alert", name: "계약 마감 알림", desc: "만료 예정 계약 알림", size: "M", category: "계약" },
                          { id: "service-revenue-sum", name: "서비스별 매출 현황", desc: "서비스별 매출 합계", size: "L", category: "매출" },
                          { id: "revenue-chart", name: "월별 매출 추이", desc: "월별 매출 변화", size: "L", category: "매출" },
                          { id: "sales-kpi", name: "매출 KPI", desc: "매출 목표 및 달성률", size: "M", category: "매출" },
                          { id: "task-progress", name: "업무 진행률", desc: "도넛 차트", size: "M", category: "업무" },
                          { id: "task-status", name: "팀별 업무 현황", desc: "팀별 스택 바", size: "L", category: "업무" },
                          { id: "task-summary", name: "업무 요약", desc: "총 업무, 진행중, 대기, 완료", size: "M", category: "업무" },
                          { id: "keyword-performance", name: "키워드 성과", desc: "우수 키워드 현황", size: "M", category: "포스팅" },
                          { id: "posting-status", name: "포스팅 현황", desc: "총/재작업/유효작업", size: "M", category: "포스팅" },
                          { id: "revenue-kpi", name: "성과 KPI", desc: "총매출, 인당매출, 인원, 업체수", size: "M", category: "성과" },
                          { id: "team-performance", name: "팀별 성과", desc: "팀 4개 라인 차트", size: "L", category: "성과" },
                          { id: "profit-analysis", name: "순위분포", desc: "바 차트", size: "L", category: "성과" },
                          { id: "customer-status", name: "고객 현황", desc: "고객 데이터 카드", size: "M", category: "고객" },
                          { id: "regional-customer-distribution", name: "지역별 고객 분포", desc: "파이 차트", size: "M", category: "고객" },
                        ]
                        .filter(w => selectedCategory === 'ALL' || w.category === selectedCategory)
                        .map((w) => {
                          const isAlreadyAdded = widgets.some((widget) => widget.id === w.id)
                          const isEnabled = widgets.find((widget) => widget.id === w.id)?.enabled
                          
                          return (
                            <button
                              key={w.id}
                              className={`group text-left rounded-lg sm:rounded-xl border transition-all duration-200 p-2.5 sm:p-3 lg:p-4 ${
                                (isAlreadyAdded && isEnabled)
                                  ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                                  : isAlreadyAdded && !isEnabled
                                  ? 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                                  : 'border-border bg-white hover:border-[var(--primary)]/50'
                              } cursor-pointer focus:outline-none  focus:border-[var(--primary)]`}
                              onClick={() => {
                                if (isAlreadyAdded) {
                                  // 이미 추가된 위젯의 경우 활성화/비활성화 토글
                                  setWidgets((prev) => 
                                    prev.map((widget) => 
                                      widget.id === w.id 
                                        ? { ...widget, enabled: !widget.enabled }
                                        : widget
                                    )
                                  )
                                } else {
                                  // 새로 추가할 위젯의 경우 즉시 추가
                                  const widgetData = [
                                    { id: "contract-overview", title: "계약 현황 개요", type: "overview" },
                                    { id: "revenue-chart", title: "월별 매출 추이", type: "chart" },
                                    { id: "task-progress", title: "업무 진행률", type: "donut" },
                                    { id: "keyword-performance", title: "키워드 성과", type: "performance" },
                                    { id: "owner-progress", title: "서비스별 계약 분포", type: "pie" },
                                    { id: "contract-count-trend", title: "계약 단가 추이", type: "line" },
                                    { id: "service-revenue-sum", title: "서비스별 매출 합계", type: "bar" },
                                    { id: "team-performance", title: "팀별 성과", type: "line" },
                                    { id: "task-status", title: "팀별 업무 현황", type: "stacked-bar" },
                                    { id: "contract-deadline-alert", title: "계약 마감 알림", type: "card" },
                                    { id: "revenue-kpi", title: "성과 KPI", type: "card" },
                                    { id: "sales-kpi", title: "매출 KPI", type: "card" },
                                    { id: "posting-status", title: "포스팅 현황", type: "card" },
                                    { id: "profit-analysis", title: "손익 분석", type: "placeholder" },
                                    { id: "regional-customer-distribution", title: "지역별 고객 분포", type: "pie" },
                                    { id: "customer-status", title: "고객 현황", type: "card" },
                                    { id: "task-summary", title: "업무 요약", type: "card" },
                                  ].find(widget => widget.id === w.id)
                                  
                                  if (widgetData) {
                                    setWidgets((prev) => [...prev, { ...widgetData, enabled: true }])
                                  }
                                }
                              }}
                            >
                              <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                                <div className="flex flex-col gap-1">
                                  <div className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium ${
                                    w.category === '계약' 
                                      ? 'bg-blue-100 text-blue-700'
                                      : w.category === '매출'
                                      ? 'bg-green-100 text-green-700'
                                      : w.category === '업무'
                                      ? 'bg-purple-100 text-purple-700'
                                      : w.category === '포스팅'
                                      ? 'bg-orange-100 text-orange-700'
                                      : w.category === '성과'
                                      ? 'bg-pink-100 text-pink-700'
                                      : w.category === '고객'
                                      ? 'bg-cyan-100 text-cyan-700'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {w.category}
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  {isAlreadyAdded && isEnabled && (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)]" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-1 sm:space-y-1.5">
                                <div className={`font-semibold transition-colors duration-200 text-sm sm:text-base ${
                                  isAlreadyAdded && !isEnabled 
                                    ? 'text-gray-500' 
                                    : 'text-foreground group-hover:text-[var(--primary)]'
                                }`}>
                                  {w.name}
                                </div>
                                <div className={`text-xs sm:text-sm leading-relaxed ${
                                  isAlreadyAdded && !isEnabled 
                                    ? 'text-gray-400' 
                                    : 'text-muted-foreground'
                                }`}>
                                  {w.desc}
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {editMode && (
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--primary)] bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary)]/10 border border-[var(--primary)]/20 px-3 sm:px-4 py-2 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></div>
                <span className="font-medium">편집 모드 활성화</span>
                <span className="text-muted-foreground hidden sm:inline">•</span>
                <span className="hidden sm:inline">위젯을 드래그하여 이동하거나 삭제할 수 있습니다</span>
                <span className="sm:hidden">드래그하여 이동/삭제</span>
              </div>
            )}

            <div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-3"
            >
              {(() => {
                const wide = new Set([
                  "revenue-chart",
                  "contract-count-trend",
                  "service-revenue-sum",
                  "team-performance",
                  "task-status",
                  "profit-analysis",
                ])

                return enabledWidgets.map((w) => {
                  const isDraggedOver = dragOverWidget === w.id
                  return (
                    <div 
                      key={w.id} 
                      className={cn(
                        wide.has(w.id) ? "col-span-1 sm:col-span-2 lg:col-span-12 xl:col-span-8" : "col-span-1 sm:col-span-2 lg:col-span-6 xl:col-span-4",
                        "transition-all duration-200",
                        isDraggedOver && editMode && "scale-[0.98]"
                      )}
                      onDragOver={(e) => handleDragOver(e, w.id)}
                      onDrop={(e) => handleDrop(e, w.id)}
                      onDragLeave={() => setDragOverWidget(null)}
                    >
                      {renderWidget(w)}
                    </div>
                  )
                })
              })()}
            </div>
          </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}


