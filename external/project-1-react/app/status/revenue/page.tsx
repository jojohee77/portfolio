"use client"

import { useState, useEffect } from "react"
import { useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { LabeledSelect } from "@/components/ui/common-select"
import { Bar, Chart } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js"

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
)
import { TrendingUp, DollarSign, FileText, CreditCard, Target } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileDataTable, MobileCardList, type MobileColumn } from "@/components/ui/mobile-data-table"
import StatusSummaryCards from "@/components/ui/card-status-summary"
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
import { getResponsiveBarStyle } from "@/lib/chart-styles"

export default function RevenuePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [chartContainerWidth, setChartContainerWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        setChartContainerWidth(chartContainerRef.current.offsetWidth)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500)
  }, [])

  // 타입 정의
  type MonthlyData = {
    month: string
    totalRevenue: number
    contracts: number
    postingCost: number
    postingCount: number
    avgContractValue: number
    seo: number
    premium: number
    hanatop: number
  }

  type YearData = {
    first: MonthlyData[]
    second: MonthlyData[]
  }

  type AllDataType = {
    [key: string]: YearData
  }

  // 연도별, 반기별 데이터
  const allData: AllDataType = {
    "2024": {
      first: [
        { month: "1월", totalRevenue: 45000000, contracts: 8, postingCost: 12000000, postingCount: 24, avgContractValue: 5625000, seo: 18000000, premium: 15000000, hanatop: 12000000 },
        { month: "2월", totalRevenue: 52000000, contracts: 10, postingCost: 14000000, postingCount: 28, avgContractValue: 5200000, seo: 22000000, premium: 18000000, hanatop: 12000000 },
        { month: "3월", totalRevenue: 48000000, contracts: 9, postingCost: 13500000, postingCount: 27, avgContractValue: 5333333, seo: 20000000, premium: 16000000, hanatop: 12000000 },
        { month: "4월", totalRevenue: 55000000, contracts: 11, postingCost: 15000000, postingCount: 30, avgContractValue: 5000000, seo: 25000000, premium: 18000000, hanatop: 12000000 },
        { month: "5월", totalRevenue: 58000000, contracts: 12, postingCost: 16000000, postingCount: 32, avgContractValue: 4833333, seo: 26000000, premium: 20000000, hanatop: 12000000 },
        { month: "6월", totalRevenue: 62000000, contracts: 13, postingCost: 17500000, postingCount: 35, avgContractValue: 4769231, seo: 28000000, premium: 22000000, hanatop: 12000000 },
      ],
      second: [
        { month: "7월", totalRevenue: 65000000, contracts: 14, postingCost: 18000000, postingCount: 36, avgContractValue: 4642857, seo: 30000000, premium: 23000000, hanatop: 12000000 },
        { month: "8월", totalRevenue: 68000000, contracts: 15, postingCost: 19000000, postingCount: 38, avgContractValue: 4533333, seo: 32000000, premium: 24000000, hanatop: 12000000 },
        { month: "9월", totalRevenue: 63000000, contracts: 13, postingCost: 17500000, postingCount: 35, avgContractValue: 4846154, seo: 29000000, premium: 22000000, hanatop: 12000000 },
        { month: "10월", totalRevenue: 70000000, contracts: 16, postingCost: 20000000, postingCount: 40, avgContractValue: 4375000, seo: 33000000, premium: 25000000, hanatop: 12000000 },
        { month: "11월", totalRevenue: 72000000, contracts: 17, postingCost: 21000000, postingCount: 42, avgContractValue: 4235294, seo: 34000000, premium: 26000000, hanatop: 12000000 },
        { month: "12월", totalRevenue: 75000000, contracts: 18, postingCost: 22000000, postingCount: 44, avgContractValue: 4166667, seo: 35000000, premium: 28000000, hanatop: 12000000 },
      ],
    },
    "2025": {
      first: [
        { month: "1월", totalRevenue: 48000000, contracts: 9, postingCost: 13000000, postingCount: 26, avgContractValue: 5333333, seo: 20000000, premium: 16000000, hanatop: 12000000 },
        { month: "2월", totalRevenue: 55000000, contracts: 11, postingCost: 15000000, postingCount: 30, avgContractValue: 5000000, seo: 24000000, premium: 19000000, hanatop: 12000000 },
        { month: "3월", totalRevenue: 52000000, contracts: 10, postingCost: 14500000, postingCount: 29, avgContractValue: 5200000, seo: 22000000, premium: 18000000, hanatop: 12000000 },
        { month: "4월", totalRevenue: 58000000, contracts: 12, postingCost: 16000000, postingCount: 32, avgContractValue: 4833333, seo: 26000000, premium: 20000000, hanatop: 12000000 },
        { month: "5월", totalRevenue: 62000000, contracts: 13, postingCost: 17000000, postingCount: 34, avgContractValue: 4769231, seo: 28000000, premium: 22000000, hanatop: 12000000 },
        { month: "6월", totalRevenue: 65000000, contracts: 14, postingCost: 18000000, postingCount: 36, avgContractValue: 4642857, seo: 30000000, premium: 23000000, hanatop: 12000000 },
      ],
      second: [
        { month: "7월", totalRevenue: 68000000, contracts: 15, postingCost: 19000000, postingCount: 38, avgContractValue: 4533333, seo: 32000000, premium: 24000000, hanatop: 12000000 },
        { month: "8월", totalRevenue: 72000000, contracts: 16, postingCost: 20000000, postingCount: 40, avgContractValue: 4500000, seo: 34000000, premium: 26000000, hanatop: 12000000 },
        { month: "9월", totalRevenue: 70000000, contracts: 15, postingCost: 19500000, postingCount: 39, avgContractValue: 4666667, seo: 33000000, premium: 25000000, hanatop: 12000000 },
        { month: "10월", totalRevenue: 75000000, contracts: 17, postingCost: 21000000, postingCount: 42, avgContractValue: 4411765, seo: 35000000, premium: 28000000, hanatop: 12000000 },
        { month: "11월", totalRevenue: 78000000, contracts: 18, postingCost: 22000000, postingCount: 44, avgContractValue: 4333333, seo: 36000000, premium: 30000000, hanatop: 12000000 },
        { month: "12월", totalRevenue: 80000000, contracts: 19, postingCost: 23000000, postingCount: 46, avgContractValue: 4210526, seo: 38000000, premium: 30000000, hanatop: 12000000 },
      ],
    },
  }

  // 계약 업체 더미 데이터
  const contractData = {
    "1월": [
      { id: 1, company: "㈜테크솔루션", period: "2024.01.01 ~ 2024.12.31", amount: 6000000, status: "진행중", service: "SEO" },
      { id: 2, company: "디지털마케팅", period: "2024.01.15 ~ 2024.07.15", amount: 4500000, status: "완료", service: "프리미엄" },
      { id: 3, company: "스마트비즈", period: "2024.01.10 ~ 2024.06.10", amount: 3000000, status: "진행중", service: "하나탑" },
      { id: 4, company: "이노베이션", period: "2024.01.20 ~ 2024.08.20", amount: 5200000, status: "진행중", service: "SEO" },
      { id: 5, company: "글로벌테크", period: "2024.01.05 ~ 2024.05.05", amount: 2800000, status: "완료", service: "프리미엄" },
      { id: 6, company: "퓨처웍스", period: "2024.01.25 ~ 2024.09.25", amount: 4200000, status: "진행중", service: "SEO" },
      { id: 7, company: "넥스트젠", period: "2024.01.12 ~ 2024.07.12", amount: 3500000, status: "진행중", service: "하나탑" },
      { id: 8, company: "비즈니스플러스", period: "2024.01.30 ~ 2024.10.30", amount: 5800000, status: "진행중", service: "프리미엄" },
    ],
    "2월": [
      { id: 9, company: "마케팅프로", period: "2024.02.01 ~ 2024.11.01", amount: 5500000, status: "진행중", service: "SEO" },
      { id: 10, company: "디지털허브", period: "2024.02.10 ~ 2024.08.10", amount: 4000000, status: "진행중", service: "프리미엄" },
    ],
  }

  const [selectedMonth, setSelectedMonth] = useState("상반기 전체")
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedHalf, setSelectedHalf] = useState("first")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContracts, setModalContracts] = useState<Array<{ id: number; company: string; period: string; amount: number; status: string; service: string }>>([])
  const [modalTitle, setModalTitle] = useState("")
  const [kpiFilter, setKpiFilter] = useState("all")
  const [selectedCard, setSelectedCard] = useState<string>("all") // 카드 필터 전용 상태


  // 필터링된 데이터
  const monthlyData: MonthlyData[] = allData[selectedYear][selectedHalf as keyof YearData]
  const currentMonthData: MonthlyData = monthlyData.find((data: MonthlyData) => data.month === selectedMonth) || monthlyData[0]

  // 반응형 막대 차트 스타일
  const responsiveBarStyle = getResponsiveBarStyle(chartContainerWidth)

  // 전체 합계 계산
  const totalStats = {
    totalRevenue: monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.totalRevenue, 0),
    monthlyRevenue: currentMonthData.totalRevenue,
    totalContracts: monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.contracts, 0),
    totalPostingCost: monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.postingCost, 0),
    totalPostingCount: monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.postingCount, 0),
    avgContractValue: monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.totalRevenue, 0) / monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.contracts, 0),
  }

  // KPI 데이터를 statusCounts 형태로 변환
  const kpiStatusCounts = {
    "총 매출": `₩${totalStats.totalRevenue.toLocaleString()}`,
    "월 평균 매출": `₩${Math.round(totalStats.totalRevenue / 6).toLocaleString()}`,
    "계약 건수": `${totalStats.totalContracts}건`,
    "포스팅 비용": `₩${totalStats.totalPostingCost.toLocaleString()}`,
    "평균 계약단가": `₩${Math.round(totalStats.avgContractValue).toLocaleString()}`,
  }

  // KPI 부가 설명 텍스트
  const kpiDescriptions = {
    "총 매출": "전년 동기 대비",
    "월 평균 매출": "6개월 평균",
    "계약 건수": "6개월 누적",
    "포스팅 비용": "176건",
    "평균 계약단가": "건당 평균",
  }

  // 카드 필터 핸들러
  const handleCardFilterChange = (filter: string) => {
    setSelectedCard(filter)
  }

  // 서비스별 테이블 데이터
  const isFullPeriod = selectedMonth.includes("전체")
  const serviceTableData = [
    {
      name: "SEO",
      value: isFullPeriod ? monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.seo, 0) : currentMonthData.seo,
      percentage: isFullPeriod
        ? ((monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.seo, 0) / monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.totalRevenue, 0)) * 100).toFixed(1)
        : ((currentMonthData.seo / currentMonthData.totalRevenue) * 100).toFixed(1),
      contracts: 15,
      totalContractRevenue: 120000000,
      monthlyRevenue: isFullPeriod ? monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.seo, 0) : currentMonthData.seo,
      postingCost: isFullPeriod ? Math.round(monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.postingCost, 0) * 0.4) : Math.round(currentMonthData.postingCost * 0.4),
      avgContractValue: 8000000,
    },
    {
      name: "프리미엄",
      value: isFullPeriod ? monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.premium, 0) : currentMonthData.premium,
      percentage: isFullPeriod
        ? ((monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.premium, 0) / monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.totalRevenue, 0)) * 100).toFixed(1)
        : ((currentMonthData.premium / currentMonthData.totalRevenue) * 100).toFixed(1),
      contracts: 12,
      totalContractRevenue: 96000000,
      monthlyRevenue: isFullPeriod ? monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.premium, 0) : currentMonthData.premium,
      postingCost: isFullPeriod ? Math.round(monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.postingCost, 0) * 0.35) : Math.round(currentMonthData.postingCost * 0.35),
      avgContractValue: 8000000,
    },
    {
      name: "하나탑",
      value: isFullPeriod ? monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.hanatop, 0) : currentMonthData.hanatop,
      percentage: isFullPeriod
        ? ((monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.hanatop, 0) / monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.totalRevenue, 0)) * 100).toFixed(1)
        : ((currentMonthData.hanatop / currentMonthData.totalRevenue) * 100).toFixed(1),
      contracts: 8,
      totalContractRevenue: 64000000,
      monthlyRevenue: isFullPeriod ? monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.hanatop, 0) : currentMonthData.hanatop,
      postingCost: isFullPeriod ? Math.round(monthlyData.reduce((sum: number, data: MonthlyData) => sum + data.postingCost, 0) * 0.25) : Math.round(currentMonthData.postingCost * 0.25),
      avgContractValue: 8000000,
    },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("ko-KR").format(value)
  }

  useEffect(() => {
    setSelectedMonth(`${selectedHalf === "first" ? "상반기" : "하반기"} 전체`)
  }, [selectedYear, selectedHalf])

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleContractClick = (serviceName: string) => {
    const monthContracts = contractData["1월"] || []
    const contracts = monthContracts.filter((contract) => contract.service === serviceName)
    setModalContracts(contracts)
    setModalTitle(`${serviceName} 서비스 - ${selectedMonth} 계약 업체`)
    setIsModalOpen(true)
  }

  const handleCSVDownload = () => {
    try {
      const summaryData = serviceTableData.map((service) => ({
        상품구분: service.name,
        총계약매출: service.totalContractRevenue,
        월매출: service.monthlyRevenue,
        평균포스팅비용: service.postingCost,
        평균계약단가: service.avgContractValue,
        계약업체수: service.contracts,
        매출비중: `${service.percentage}%`,
      }))

      const csvContent = [
        "=== 서비스별 매출 요약 ===",
        "상품구분,총계약매출,월매출,평균포스팅비용,평균계약단가,계약업체수,매출비중",
        ...summaryData.map((row) => `${row.상품구분},${row.총계약매출},${row.월매출},${row.평균포스팅비용},${row.평균계약단가},${row.계약업체수},${row.매출비중}`),
      ].join("\n")

      const BOM = "\uFEFF"
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
      const fileName = `매출현황_${selectedYear}년_${selectedMonth}_${new Date().toISOString().slice(0, 10)}.csv`

      const link = document.createElement("a")
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute("href", url)
        link.setAttribute("download", fileName)
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error("CSV 다운로드 중 오류 발생:", error)
      alert("CSV 다운로드 중 오류가 발생했습니다.")
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="매출현황"
      />

      <div className="flex">
        <Sidebar 
          currentPage="status/revenue" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6 w-full max-w-full">
          {isLoading ? (
            // 스켈레톤 UI
            <>
              {/* 페이지 헤더 스켈레톤 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
                <div className="flex-shrink-0 hidden sm:block space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
                  <Skeleton className="h-10 w-full sm:w-32 rounded-lg" />
                  <Skeleton className="h-10 w-full sm:w-40 rounded-lg" />
                </div>
              </div>

              {/* KPI 카드 스켈레톤 */}
              <div className="space-y-3">
                <Card className="shadow-none rounded-2xl border border-gray-200 md:hidden">
                  <CardContent className="p-3 space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={`mobile-kpi-${i}`} className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-3">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <div className="text-right space-y-1">
                          <Skeleton className="h-5 w-20" />
                          <Skeleton className="h-3 w-12 ml-auto" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <div className="hidden md:grid grid-cols-2 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  {[...Array(5)].map((_, i) => (
                    <Card key={`desktop-kpi-${i}`} className="shadow-none rounded-2xl border border-gray-200 py-2 md:py-3">
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
              </div>

              {/* 차트 스켈레톤 */}
              <Card className="shadow-none rounded-xl border border-gray-200 w-full py-3">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-64" />
                  <Skeleton className="h-4 w-80 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] sm:h-[400px] w-full" />
                </CardContent>
              </Card>

              {/* 월별 선택 버튼 스켈레톤 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-10 sm:h-12 w-full" />
                ))}
              </div>

              {/* 테이블 스켈레톤 */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-9 w-full sm:w-32" />
                </div>

                {/* 모바일 카드 리스트 스켈레톤 */}
                <div className="md:hidden space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <Card key={`mobile-table-${index}`} className="shadow-none rounded-2xl border border-gray-200">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <div className="space-y-1">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-100 space-y-2">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex justify-end">
                          <Skeleton className="h-8 w-24 rounded-lg" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 데스크톱 테이블 스켈레톤 */}
                <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-100">
                        <TableRow className="!border-b !border-gray-200">
                          {[...Array(6)].map((_, i) => (
                            <TableHead key={i} className="py-4">
                              <Skeleton className="h-4 w-20" />
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...Array(3)].map((_, rowIndex) => (
                          <TableRow key={rowIndex} className="border-b border-gray-100">
                            {[...Array(6)].map((_, colIndex) => (
                              <TableCell key={colIndex} className="py-4">
                                <Skeleton className="h-4 w-full" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 페이지 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
            <div className="flex-shrink-0 hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold">매출현황</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">월별 매출 현황 및 서비스별 분석</p>
            </div>

            {/* 필터 바 */}
            <div className="flex items-center gap-2 sm:gap-4">
              <LabeledSelect
                label="연도"
                value={selectedYear}
                onValueChange={setSelectedYear}
                options={[
                  { value: "2024", label: "2024년" },
                  { value: "2025", label: "2025년" }
                ]}
              />

              <ToggleButtonGroup
                options={[
                  { value: "first", label: "상반기" },
                  { value: "second", label: "하반기" }
                ]}
                value={selectedHalf}
                onValueChange={setSelectedHalf}
              />
            </div>
          </div>

          {/* KPI 카드 섹션 */}
          <StatusSummaryCards
            statusCounts={kpiStatusCounts}
            activeFilter={selectedCard}
            onFilterChange={handleCardFilterChange}
            descriptions={kpiDescriptions}
            className="mb-6"
            variant="compact"
            showTrend={true}
            customLayout={true}
          />

          {/* 혼합 차트 섹션 */}
          <Card className="shadow-none rounded-xl border border-gray-200 w-full py-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900">월별 매출 및 포스팅 비용 현황</CardTitle>
              <p className="text-xs sm:text-sm text-slate-600">막대 차트: 월별 매출, 선 차트: 포스팅 비용</p>
            </CardHeader>
            <CardContent className="chart-content touch-manipulation">
              <div className="sm:hidden text-xs text-slate-500 mb-2 text-center">📊 차트를 터치하여 상세 정보 확인</div>
              <div ref={chartContainerRef} className="h-[350px] sm:h-[400px] w-full">
                <Chart
                  type="bar"
                  data={{
                    labels: monthlyData.map(d => d.month),
                    datasets: [
                      {
                        type: 'line' as const,
                        label: '포스팅 비용',
                        data: monthlyData.map(d => d.postingCost),
                        borderColor: '#ef4444',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 6,
                        pointHoverRadius: 10,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#ef4444',
                        pointBorderWidth: 3,
                        yAxisID: 'y',
                        order: 0,
                      },
                      {
                        type: 'bar' as const,
                        label: '월별 매출',
                        data: monthlyData.map(d => d.totalRevenue),
                        backgroundColor: '#3b82f6',
                        borderColor: '#3b82f6',
                        borderWidth: 1,
                        borderRadius: 6,
                        barPercentage: responsiveBarStyle.barPercentage,
                        categoryPercentage: responsiveBarStyle.categoryPercentage,
                        maxBarThickness: responsiveBarStyle.maxBarThickness,
                        yAxisID: 'y',
                        order: 1,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                      mode: 'index' as const,
                      intersect: false,
                    },
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top' as const,
                        labels: {
                          color: '#475569',
                          font: { size: 12 },
                          padding: 12,
                          usePointStyle: true,
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
                            const label = context.dataset.label || ''
                            if (label === '월별 매출') {
                              return `     매출: ${formatCurrency(context.parsed.y || 0)}`
                            } else if (label === '포스팅 비용') {
                              return `     포스팅: ${formatCurrency(context.parsed.y || 0)}`
                            }
                            return `     ${label}: ${context.parsed.y || 0}`
                          }
                        }
                      }
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { color: "#64748b", font: { size: 11 } }
                      },
                      y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                        grid: { color: 'rgba(226, 232, 240, 0.5)' },
                        ticks: { 
                          color: "#64748b", 
                          font: { size: 10 },
                          callback: function(value) {
                            return `${(Number(value) / 10000000).toFixed(0)}천만`
                          }
                        }
                      }
                    },
                    animation: {
                      duration: 1500,
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

          {/* 월별 선택 버튼 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            <Button
              variant={selectedMonth === `${selectedHalf === "first" ? "상반기" : "하반기"} 전체` ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedMonth(`${selectedHalf === "first" ? "상반기" : "하반기"} 전체`)}
              className={`${
                selectedMonth === `${selectedHalf === "first" ? "상반기" : "하반기"} 전체`
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300 border"
                  : "border-gray-200 text-slate-700 hover:bg-slate-50"
              } min-h-[44px] h-auto py-1.5 text-xs sm:text-xs font-medium touch-manipulation active:scale-95 transition-transform shadow-none`}
            >
              {selectedHalf === "first" ? "상반기" : "하반기"} 전체
            </Button>

            {monthlyData.map((data: MonthlyData) => (
              <Button
                key={data.month}
                variant={selectedMonth === data.month ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedMonth(data.month)}
                className={`${
                  selectedMonth === data.month
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300 border"
                    : "border-gray-200 text-slate-700 hover:bg-slate-50"
                } min-h-[44px] h-auto py-1.5 text-xs sm:text-sm font-medium touch-manipulation active:scale-95 transition-transform shadow-none`}
              >
                {data.month}
              </Button>
            ))}
          </div>

          {/* 서비스별 매출 현황 테이블 */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  서비스별 매출 현황 ({selectedMonth}) <span className="text-sm text-blue-600 font-normal">({serviceTableData.length}개)</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">선택된 월의 서비스 유형별 상세 매출 분석</p>
              </div>
              <Button
                onClick={handleCSVDownload}
                variant="outline"
                size="sm"
                className="text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs h-8 px-3 flex-shrink-0 shadow-none"
              >
                <img src="/icons/icon-excel.png" alt="Excel" className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="whitespace-nowrap">엑셀 다운로드</span>
              </Button>
            </div>

            {/* 모바일: 카드 리스트 */}
            <div className="block sm:hidden">
              <MobileCardList
                data={serviceTableData}
                renderCard={(service) => {
                  const index = serviceTableData.findIndex(s => s.name === service.name)
                  const colorMap: Record<string, string> = {
                    'SEO': '#3b82f6',
                    '프리미엄': '#10b981',
                    '하나탑': '#f59e0b'
                  }
                  const bgColorMap: Record<string, string> = {
                    'SEO': 'bg-blue-100 text-blue-800',
                    '프리미엄': 'bg-green-100 text-green-800',
                    '하나탑': 'bg-yellow-100 text-yellow-800'
                  }
                  
                  return [
                    {
                      label: '서비스',
                      value: (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: colorMap[service.name] }}
                          />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColorMap[service.name]}`}>
                            {service.name}
                          </span>
                          <span className="text-xs text-slate-500">({service.percentage}%)</span>
                        </div>
                      )
                    },
                    {
                      label: '총 계약매출',
                      value: formatCurrency(service.totalContractRevenue)
                    },
                    {
                      label: '월 매출',
                      value: formatCurrency(service.monthlyRevenue),
                      highlight: true
                    },
                    {
                      label: '평균포스팅 비용',
                      value: formatCurrency(service.postingCost)
                    },
                    {
                      label: '평균 계약단가',
                      value: formatCurrency(service.avgContractValue)
                    },
                    {
                      label: '계약업체',
                      value: (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() => handleContractClick(service.name)}
                          className="h-auto p-0 text-blue-600 hover:text-blue-800 underline"
                        >
                          {service.contracts}건
                        </Button>
                      )
                    }
                  ]
                }}
              />
            </div>

            {/* 데스크톱: 테이블 */}
            <div className="hidden sm:block">
              <MobileDataTable
                data={serviceTableData}
                columns={[
                  {
                    key: 'name',
                    label: '상품 구분',
                    align: 'center' as const,
                    mobileWidth: '100px',
                    render: (service) => {
                      const index = serviceTableData.findIndex(s => s.name === service.name)
                      return (
                        <div className="flex items-center justify-center gap-2 sm:gap-3">
                          <div
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: index === 0 ? "#3b82f6" : index === 1 ? "#10b981" : "#f59e0b" }}
                          ></div>
                          <div className="min-w-0">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                service.name === "SEO"
                                  ? "bg-blue-100 text-blue-800"
                                  : service.name === "프리미엄"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {service.name}
                            </span>
                            <p className="text-xs text-slate-500 mt-1 whitespace-nowrap">{service.percentage}% 비중</p>
                          </div>
                        </div>
                      )
                    }
                  },
                  {
                    key: 'totalContractRevenue',
                    label: '총 계약매출',
                    align: 'center' as const,
                    mobileWidth: '110px',
                    render: (service) => <span className="font-medium">{formatCurrency(service.totalContractRevenue)}</span>
                  },
                  {
                    key: 'monthlyRevenue',
                    label: '월 매출',
                    align: 'center' as const,
                    mobileWidth: '110px',
                    render: (service) => <span className="font-medium">{formatCurrency(service.monthlyRevenue)}</span>
                  },
                  {
                    key: 'postingCost',
                    label: '평균포스팅 비용',
                    align: 'center' as const,
                    mobileWidth: '100px',
                    render: (service) => <span className="font-medium">{formatCurrency(service.postingCost)}</span>
                  },
                  {
                    key: 'avgContractValue',
                    label: '평균 계약단가',
                    align: 'center' as const,
                    mobileWidth: '110px',
                    render: (service) => <span className="font-medium">{formatCurrency(service.avgContractValue)}</span>
                  },
                  {
                    key: 'contracts',
                    label: '계약업체',
                    align: 'center' as const,
                    mobileWidth: '80px',
                    render: (service) => (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleContractClick(service.name)}
                        className="min-h-[44px] px-3 h-auto font-medium text-blue-600 hover:text-blue-800 underline touch-manipulation"
                      >
                        {service.contracts}건
                      </Button>
                    )
                  }
                ]}
                showScrollHint={false}
                showGradientHint={false}
              />
            </div>
          </div>

          {/* 계약 업체 모달 */}
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] sm:max-h-[95vh]" aria-describedby="contract-modal-description">
              <DialogHeader className="pb-3">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">{modalTitle}</DialogTitle>
                <DialogDescription id="contract-modal-description" className="text-xs sm:text-sm text-slate-600 mt-1">
                  선택된 서비스의 계약 업체 목록을 확인할 수 있습니다.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-h-[60vh] sm:max-h-[65vh] overflow-auto">
                <div className="relative">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-gray-100 sticky top-0 z-10">
                        <TableRow className="!border-b !border-gray-200">
                          <TableHead className="text-left text-xs sm:text-sm font-semibold text-gray-700 py-3 sm:py-4 whitespace-nowrap">업체명</TableHead>
                          <TableHead className="text-left text-xs sm:text-sm font-semibold text-gray-700 py-3 sm:py-4 whitespace-nowrap">서비스</TableHead>
                          <TableHead className="text-left text-xs sm:text-sm font-semibold text-gray-700 py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">계약기간</TableHead>
                          <TableHead className="text-right text-xs sm:text-sm font-semibold text-gray-700 py-3 sm:py-4 whitespace-nowrap">계약금액</TableHead>
                          <TableHead className="text-center text-xs sm:text-sm font-semibold text-gray-700 py-3 sm:py-4 whitespace-nowrap">상태</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {modalContracts.map((contract) => (
                          <TableRow key={contract.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium text-left text-xs sm:text-sm py-3 sm:py-4">
                              <div className="flex flex-col">
                                <span className="whitespace-nowrap">{contract.company}</span>
                                <span className="text-[10px] sm:hidden text-slate-500 mt-1">{contract.period}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-left py-3 sm:py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
                                  contract.service === "SEO"
                                    ? "bg-blue-100 text-blue-800"
                                    : contract.service === "프리미엄"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {contract.service}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm text-left py-3 sm:py-4 whitespace-nowrap hidden sm:table-cell">{contract.period}</TableCell>
                            <TableCell className="font-medium text-right text-xs sm:text-sm py-3 sm:py-4 whitespace-nowrap">{formatCurrency(contract.amount)}</TableCell>
                            <TableCell className="text-center py-3 sm:py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${contract.status === "진행중" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                                {contract.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  {/* 모바일 스크롤 힌트 */}
                  <div className="sm:hidden absolute top-0 right-0 h-full w-6 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
