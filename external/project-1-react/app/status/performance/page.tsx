"use client"

import { useState, useMemo, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CommonSelect } from "@/components/ui/common-select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, Users, Building2, DollarSign, Target, Eye, MapPin, Calendar, User } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
)
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import StatusSummaryCards from "@/components/ui/card-status-summary"
import CustomDatePicker from "@/components/ui/custom-datepicker"
import { teamPerformance } from "@/lib/mocks/performance/team-performance"
import { teamCompanies } from "@/lib/mocks/performance/team-companies"
import {
  getChartData,
  getTableData,
  getAllTeamsMetricData,
} from "@/lib/mocks/performance/utils"
import type { MetricType, MonthKey, PostingData } from "@/lib/mocks/performance/types"

export default function PerformancePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedHalf, setSelectedHalf] = useState("전체")
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [selectedTeams, setSelectedTeams] = useState(["1팀", "2팀", "3팀", "4팀"])
  const [selectedChartTeam, setSelectedChartTeam] = useState<string>("전체")
  const [selectedMetric, setSelectedMetric] = useState<string>("월 매출")
  const [selectedTeamModal, setSelectedTeamModal] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"team" | "individual">("team")
  const [selectedIndividualTeam, setSelectedIndividualTeam] = useState("1팀")
  const [selectedIndividual, setSelectedIndividual] = useState<string | null>(null)
  const [selectedIndividualMembers, setSelectedIndividualMembers] = useState<string[]>([])
  const [individualDetailModal, setIndividualDetailModal] = useState<string | null>(null)
  const [selectedPersonForDetail, setSelectedPersonForDetail] = useState<string | null>(null)
  const [kpiFilter, setKpiFilter] = useState("all")
  // 월별 성과 상세 모달
  const [performanceDetailModalOpen, setPerformanceDetailModalOpen] = useState(false)
  const [detailModalTeam, setDetailModalTeam] = useState<string>("전체")
  const [detailModalYear, setDetailModalYear] = useState<string>("2024")
  const [detailModalPeriod, setDetailModalPeriod] = useState<string>("전체")
  const [detailModalDateRange, setDetailModalDateRange] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null })

  // 타입은 types.ts에서 import

  // 상단 KPI 데이터
  const kpiData = {
    totalRevenue: 285000000,
    totalContractRevenue: 420000000,
    totalMembers: 24,
    avgRevenuePerMember: 11875000,
    avgCompaniesCount: 8.5,
  }

  // KPI 데이터를 statusCounts 형태로 변환 (매출액은 전체 표시 + 원화 표시)
  const kpiStatusCounts = {
    "총 매출": `₩${kpiData.totalRevenue.toLocaleString()}`,
    "총 계약 매출": `₩${kpiData.totalContractRevenue.toLocaleString()}`,
    "총 인원": `${kpiData.totalMembers}명`,
    "평균 인당 매출": `₩${kpiData.avgRevenuePerMember.toLocaleString()}`,
    "평균 업체 수": `${kpiData.avgCompaniesCount.toFixed(1)}개`,
  }

  // KPI 설명 텍스트
  const kpiDescriptions = {
    "총 매출": `${selectedHalf} 기준`,
    "총 계약 매출": "연간 계약 기준",
    "총 인원": "전체 팀 합계",
    "평균 인당 매출": "월 평균",
    "평균 업체 수": "팀당 평균",
  }

  // 간단한 더미 데이터 (실제로는 performance-management.tsx의 전체 데이터 사용)
  const individualPostingData: Array<{ name: string; team: string; data: PostingData }> = [
    {
      name: "김영희",
      team: "1팀",
      data: {
        "1월": { posting: 78, rework: 8, valid: 70, keywords: 45, top5Keywords: 18, avgRank: 4.2 },
        "2월": { posting: 82, rework: 10, valid: 72, keywords: 48, top5Keywords: 20, avgRank: 3.9 },
        "3월": { posting: 85, rework: 12, valid: 73, keywords: 50, top5Keywords: 22, avgRank: 3.7 },
        "4월": { posting: 88, rework: 13, valid: 75, keywords: 52, top5Keywords: 24, avgRank: 3.5 },
        "5월": { posting: 90, rework: 15, valid: 75, keywords: 55, top5Keywords: 26, avgRank: 3.3 },
        "6월": { posting: 87, rework: 14, valid: 73, keywords: 53, top5Keywords: 25, avgRank: 3.6 },
        "7월": { posting: 89, rework: 16, valid: 73, keywords: 54, top5Keywords: 27, avgRank: 3.4 },
        "8월": { posting: 83, rework: 10, valid: 73, keywords: 49, top5Keywords: 21, avgRank: 4.0 },
        "9월": { posting: 85, rework: 12, valid: 73, keywords: 51, top5Keywords: 23, avgRank: 3.8 },
        "10월": { posting: 86, rework: 13, valid: 73, keywords: 52, top5Keywords: 24, avgRank: 3.6 },
        "11월": { posting: 84, rework: 11, valid: 73, keywords: 50, top5Keywords: 22, avgRank: 3.9 },
        "12월": { posting: 85, rework: 12, valid: 73, keywords: 51, top5Keywords: 23, avgRank: 3.7 },
      },
    },
    {
      name: "이철수",
      team: "1팀",
      data: {
        "1월": { posting: 70, rework: 7, valid: 63, keywords: 40, top5Keywords: 15, avgRank: 4.5 },
        "2월": { posting: 74, rework: 9, valid: 65, keywords: 43, top5Keywords: 17, avgRank: 4.2 },
        "3월": { posting: 78, rework: 15, valid: 63, keywords: 45, top5Keywords: 19, avgRank: 4.0 },
        "4월": { posting: 80, rework: 12, valid: 68, keywords: 47, top5Keywords: 21, avgRank: 3.8 },
        "5월": { posting: 82, rework: 14, valid: 68, keywords: 49, top5Keywords: 23, avgRank: 3.6 },
        "6월": { posting: 79, rework: 13, valid: 66, keywords: 46, top5Keywords: 20, avgRank: 3.9 },
        "7월": { posting: 81, rework: 15, valid: 66, keywords: 48, top5Keywords: 22, avgRank: 3.7 },
        "8월": { posting: 75, rework: 9, valid: 66, keywords: 42, top5Keywords: 16, avgRank: 4.3 },
        "9월": { posting: 78, rework: 15, valid: 63, keywords: 44, top5Keywords: 18, avgRank: 4.1 },
        "10월": { posting: 79, rework: 12, valid: 67, keywords: 46, top5Keywords: 20, avgRank: 3.9 },
        "11월": { posting: 77, rework: 10, valid: 67, keywords: 44, top5Keywords: 18, avgRank: 4.2 },
        "12월": { posting: 78, rework: 15, valid: 63, keywords: 45, top5Keywords: 19, avgRank: 4.0 },
      },
    },
  ]

  const individualPerformance = [
    {
      id: "kim-younghee",
      name: "김영희",
      team: "1팀",
      position: "팀장",
      monthlyRevenue: 47500000,
      totalContractRevenue: 560000000,
      contractCount: 12,
      avgContractValue: 46666667,
      companiesCount: 4,
      avgMonthlyRevenue: 11875000,
      postingCount: 980,
      reworkCount: 120,
      validWorkCount: 860,
      teamColor: "bg-blue-500",
    },
    {
      id: "lee-cheolsoo",
      name: "이철수",
      team: "1팀",
      position: "팀원",
      monthlyRevenue: 47500000,
      totalContractRevenue: 560000000,
      contractCount: 12,
      avgContractValue: 46666667,
      companiesCount: 4,
      avgMonthlyRevenue: 11875000,
      postingCount: 936,
      reworkCount: 110,
      validWorkCount: 826,
      teamColor: "bg-blue-500",
    },
  ]

  // teamPerformance, teamCompanies, monthlyChartData, monthlyTableData는 파일에서 import

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString()
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  // 지표에 따른 값 포맷팅 함수
  const formatMetricValue = (metric: string, value: number): string => {
    switch (metric) {
      case "월 매출":
      case "평균 포스팅 비용":
      case "총 계약 매출":
      case "업체당 매월 평균":
      case "인당 평균 매출":
        return formatCurrency(value)
      case "관리 업체":
        return `${value.toLocaleString()}개`
      case "인원":
        return `${value.toLocaleString()}명`
      case "인당 평균 업체 수":
        return `${value.toFixed(1)}개`
      default:
        return formatCurrency(value)
    }
  }

  const getFilteredMonths = (half: string): MonthKey[] => {
    if (half === "전체") {
      return ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    }
    return half === "상반기"
      ? ["1월", "2월", "3월", "4월", "5월", "6월"]
      : ["7월", "8월", "9월", "10월", "11월", "12월"]
  }

  const filteredMonths = useMemo(() => getFilteredMonths(selectedHalf), [selectedHalf])

  const filteredIndividualPerformance = useMemo(() => {
    return individualPerformance.filter((person) => person.team === selectedIndividualTeam)
  }, [selectedIndividualTeam])

  useEffect(() => {
    const teamMembers = filteredIndividualPerformance.map((person) => person.name)
    setSelectedIndividualMembers(teamMembers.slice(0, 4))
  }, [selectedIndividualTeam, filteredIndividualPerformance])

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const filteredTeamPerformance = useMemo(() => {
    return teamPerformance.map((team) => {
      const monthlyRevenueSum = filteredMonths.reduce((sum, month) => {
        const tableData = getTableData("월 매출", filteredMonths)
        const monthData = tableData.find((t) => t.team === team.name)?.data[month]
        return monthData ? sum + monthData.value : sum
      }, 0)

      return {
        ...team,
        monthlyRevenue: monthlyRevenueSum / filteredMonths.length,
      }
    })
  }, [filteredMonths])

  const generateIndividualPostingChartData = (selectedMembers: string[], months: string[]) => {
    return months.map((month) => {
      const dataPoint: any = { month }

      selectedMembers.forEach((memberName) => {
        const memberData = individualPostingData.find((data) => data.name === memberName)

        if (memberData && memberData.data && memberData.data[month]) {
          dataPoint[memberName] = memberData.data[month].posting
        } else {
          dataPoint[memberName] = 0
        }
      })

      return dataPoint
    })
  }

  const individualPostingChartData = useMemo(() => {
    return generateIndividualPostingChartData(selectedIndividualMembers, filteredMonths)
  }, [selectedIndividualMembers, filteredMonths])

  // 지표별 차트 데이터는 utils에서 import한 함수 사용
  const filteredChartData = useMemo(() => {
    if (selectedChartTeam === "전체") {
      // 전체 팀 선택 시 - 선택된 지표 기준으로 모든 팀 표시
      return getAllTeamsMetricData(selectedMetric as MetricType, filteredMonths as MonthKey[])
    } else {
      // 특정 팀 선택 시 해당 팀의 지표 데이터 반환
      return getChartData(selectedChartTeam, selectedMetric as MetricType, filteredMonths as MonthKey[])
    }
  }, [selectedChartTeam, selectedMetric, filteredMonths])

  // 테이블 데이터는 선택된 지표에 따라 동적으로 가져오기
  const filteredTableData = useMemo(() => {
    // 선택된 지표 기준으로 테이블 데이터 가져오기
    const metric = selectedMetric as MetricType
    const tableData = getTableData(metric, filteredMonths as MonthKey[])
    
    // MonthlyData 형식으로 변환 (기존 호환성 유지)
    return tableData.map((item) => ({
      team: item.team,
      data: Object.fromEntries(
        Object.entries(item.data).map(([month, value]) => [
          month,
          { revenue: value.value, change: value.change } // 기존 형식 유지
        ])
      )
    }))
  }, [selectedChartTeam, selectedMetric, filteredMonths])

  const handleIndividualMemberToggle = (memberName: string) => {
    setSelectedIndividualMembers((prev) =>
      prev.includes(memberName) ? prev.filter((m) => m !== memberName) : [...prev, memberName],
    )
  }

  const downloadCSV = (teamName: string, teamId: string) => {
    const companies = teamCompanies[teamId as keyof typeof teamCompanies] || []
    const headers = ["업체명", "지역", "상품명", "키워드 개수", "계약 기간", "담당자", "총광고비", "월광고비"]
    const csvData = companies.map((company) => [
      company.companyName,
      company.region,
      company.productName,
      `${company.keywordCount ?? (company.contractCount * 5)}개`,
      company.contractPeriod,
      company.manager,
      formatCurrency(company.totalAdCost),
      formatCurrency(company.monthlyAdCost),
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")
    const BOM = "\uFEFF"
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" })
    const today = new Date().toISOString().split("T")[0]
    const link = document.createElement("a")
    link.setAttribute("href", URL.createObjectURL(blob))
    link.setAttribute("download", `${teamName}_업체별계약상세_${today}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleTeamToggle = (teamName: string) => {
    setSelectedTeams((prevTeams) => {
      if (prevTeams.includes(teamName)) {
        return prevTeams.filter((team) => team !== teamName)
      } else {
        return [...prevTeams, teamName]
      }
    })
  }

  const teamColors = {
    "1팀": "#3b82f6",
    "2팀": "#10B981",
    "3팀": "#F59E0B",
    "4팀": "#8b5cf6",
  }

  const teamDarkColors = {
    "1팀": "#1e40af",
    "2팀": "#047857",
    "3팀": "#d97706",
    "4팀": "#7c3aed",
  }

  const teamLightColors = {
    "1팀": "#eff6ff",
    "2팀": "#f0fdf4",
    "3팀": "#fffbeb",
    "4팀": "#faf5ff",
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="성과현황"
      />

      <div className="flex">
        <Sidebar 
          currentPage="status/performance" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6 w-full max-w-full">
          {isLoading ? (
            // 스켈레톤 UI
            <>
              {/* 헤더 스켈레톤 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="hidden sm:block space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-end w-full sm:w-auto">
                  <Skeleton className="h-8 w-24 sm:w-24 rounded-lg" />
                  <Skeleton className="h-8 w-full sm:w-48 rounded-lg" />
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
                <div className="hidden md:grid grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4">
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

              {/* 탭 스켈레톤 */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 w-full sm:w-auto">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-8 w-24 rounded-md" />
                </div>
                <Skeleton className="h-8 w-full sm:w-40 rounded-lg" />
              </div>

              {/* 성과 카드 스켈레톤 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="shadow-none rounded-xl border border-gray-200">
                    <CardHeader className="pt-4 sm:pt-6 pb-3 px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-3 w-3 rounded-full" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="space-y-1.5 sm:space-y-2">
                        {[...Array(6)].map((_, j) => (
                          <div key={j} className="flex justify-between items-center">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        ))}
                      </div>
                      <Skeleton className="h-10 w-full mt-2 sm:mt-3 rounded-lg" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 차트 스켈레톤 */}
              <Card className="shadow-none rounded-xl border border-gray-200">
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[250px] w-full" />
                </CardContent>
              </Card>

              {/* 테이블 스켈레톤 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-56" />
                </div>
                {/* 모바일 카드 리스트 스켈레톤 */}
                <div className="md:hidden space-y-3">
                  {[...Array(4)].map((_, index) => (
                    <Card key={`mobile-table-${index}`} className="shadow-none rounded-2xl border border-gray-200">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[...Array(4)].map((__, i) => (
                            <div key={`mobile-table-field-${i}`} className="space-y-1">
                              <Skeleton className="h-3 w-16" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          ))}
                        </div>
                        <div className="pt-3 border-t border-gray-100 space-y-1">
                          <Skeleton className="h-3 w-20" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </div>
                        <div className="flex justify-end pt-1">
                          <Skeleton className="h-8 w-24 rounded-lg" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 데스크톱 테이블 스켈레톤 */}
                <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-100">
                      <TableRow className="!border-b !border-gray-200">
                        {[...Array(8)].map((_, i) => (
                          <TableHead key={i} className="py-4">
                            <Skeleton className="h-4 w-16" />
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(4)].map((_, rowIndex) => (
                        <TableRow key={rowIndex} className="border-b border-gray-100">
                          {[...Array(8)].map((_, colIndex) => (
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
            </>
          ) : (
            <>
              {/* 헤더 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            {/* 타이틀 영역 - 모바일에서는 숨김 */}
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold">성과현황</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">팀별 매출 성과와 월별 증감 현황을 확인하세요</p>
            </div>
            
            {/* 필터 영역 - 항상 표시 */}
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end">
              <CommonSelect
                value={selectedYear}
                onValueChange={setSelectedYear}
                options={[
                  { value: "2023", label: "2023" },
                  { value: "2024", label: "2024" },
                  { value: "2025", label: "2025" }
                ]}
                triggerClassName="w-20 sm:w-24 h-8 sm:h-10 text-xs sm:text-sm"
              />
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <Button
                  variant={selectedHalf === "전체" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedHalf("전체")}
                  className={`h-7 sm:h-8 px-2 sm:px-3 text-xs ${selectedHalf === "전체" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-600 hover:text-slate-900"}`}
                >
                  전체
                </Button>
                <Button
                  variant={selectedHalf === "상반기" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedHalf("상반기")}
                  className={`h-7 sm:h-8 px-2 sm:px-3 text-xs ${selectedHalf === "상반기" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-600 hover:text-slate-900"}`}
                >
                  상반기
                </Button>
                <Button
                  variant={selectedHalf === "하반기" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedHalf("하반기")}
                  className={`h-7 sm:h-8 px-2 sm:px-3 text-xs ${selectedHalf === "하반기" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-slate-600 hover:text-slate-900"}`}
                >
                  하반기
                </Button>
              </div>
            </div>
          </div>

          {/* 상단 KPI 요약 박스 */}
          <StatusSummaryCards
            statusCounts={kpiStatusCounts}
            activeFilter={kpiFilter}
            onFilterChange={setKpiFilter}
            descriptions={kpiDescriptions}
            className="mb-6"
            variant="compact"
            showTrend={true}
            customLayout={true}
          />

          {/* 팀/개인 성과 전환 탭 */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              <Button
                variant={activeTab === "team" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("team")}
                className={`h-7 sm:h-8 px-2 sm:px-3 text-xs transition-all duration-200 ${
                  activeTab === "team"
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                팀별 성과
              </Button>
              <Button
                variant={activeTab === "individual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("individual")}
                className={`h-7 sm:h-8 px-2 sm:px-3 text-xs transition-all duration-200 ${
                  activeTab === "individual"
                    ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                개인별 성과
              </Button>
            </div>

            {activeTab === "individual" && (
              <CommonSelect
                value={selectedIndividualTeam}
                onValueChange={setSelectedIndividualTeam}
                options={[
                  { value: "1팀", label: "1팀" },
                  { value: "2팀", label: "2팀" },
                  { value: "3팀", label: "3팀" },
                  { value: "4팀", label: "4팀" }
                ]}
                placeholder="팀 선택"
                triggerClassName="w-32 sm:w-[180px] h-8 sm:h-10 text-xs sm:text-sm"
              />
            )}
          </div>

          {/* 성과 카드 영역 */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTab === "team" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in-0 duration-300">
                {filteredTeamPerformance.map((team) => (
                  <Card key={team.id} className="hover:shadow-lg transition-shadow shadow-none rounded-xl border bg-white cursor-pointer" style={{ borderColor: teamColors[team.name as keyof typeof teamColors] }} onClick={() => setSelectedTeamModal(team.id)}>
                    <CardHeader className="pt-4 sm:pt-6 pb-3 px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base sm:text-lg font-bold text-slate-900">{team.name}</CardTitle>
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${team.color}`}></div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm text-black font-semibold">월 매출</span>
                          <span className="text-xs sm:text-sm" style={{ color: teamDarkColors[team.name as keyof typeof teamDarkColors] }}>{formatCurrency(team.monthlyRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-light text-slate-700">평균 포스팅 비용</span>
                          <span className="text-xs sm:text-sm text-slate-900">
                            {(() => {
                              const postingCostData = getTableData("평균 포스팅 비용", filteredMonths)
                              const teamData = postingCostData.find((t) => t.team === team.name)
                              if (teamData) {
                                const avg = filteredMonths.reduce((sum, month) => {
                                  const monthData = teamData.data[month]
                                  return sum + (monthData?.value || 0)
                                }, 0) / filteredMonths.length
                                return formatCurrency(avg)
                              }
                              return "-"
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-light text-slate-700">총 계약 매출</span>
                          <span className="text-xs sm:text-sm text-slate-900">{formatCurrency(team.totalContractRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-light text-slate-700">관리 업체</span>
                          <span className="text-xs sm:text-sm text-slate-900">{team.companiesCount}개</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-light text-slate-700">업체당 매월 평균</span>
                          <span className="text-xs sm:text-sm text-slate-900">{formatCurrency(team.avgCompanyRevenue)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-light text-slate-700">인원</span>
                          <span className="text-xs sm:text-sm text-slate-900">{team.memberCount}명</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-light text-slate-700">인당 평균 매출</span>
                          <span className="text-xs sm:text-sm text-slate-900">{formatCurrency(team.avgRevenuePerMember)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs sm:text-sm font-light text-slate-700">인당 평균 업체 수</span>
                          <span className="text-xs sm:text-sm text-slate-900">{Number((team.companiesCount / team.memberCount).toFixed(1))}개</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2 sm:mt-3 h-[40px] text-xs sm:text-sm shadow-none rounded-lg transition-colors text-black hover:text-black border font-normal"
                        style={{ 
                          backgroundColor: teamLightColors[team.name as keyof typeof teamLightColors],
                          borderColor: teamColors[team.name as keyof typeof teamColors]
                        }}
                        onClick={() => setSelectedTeamModal(team.id)}
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        상세보기
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* 팀별 업체 상세 모달 */}
          {filteredTeamPerformance.map((team) => (
            <Dialog
              key={`modal-${team.id}`}
              open={selectedTeamModal === team.id}
              onOpenChange={(open) => !open && setSelectedTeamModal(null)}
            >
              <DialogContent className="max-w-[95vw] sm:max-w-5xl lg:max-w-6xl max-h-[95vh] overflow-hidden flex flex-col p-4 sm:p-6">
                <DialogHeader className="flex-shrink-0">
                  <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${team.color}`}></div>
                    {team.name} 업체별 계약 상세
                  </DialogTitle>
                </DialogHeader>

                <div className="mt-4 space-y-4 flex-1 min-h-0 flex flex-col overflow-hidden">
                  {/* 테이블 헤더와 다운로드 버튼 */}
                  <div className="flex items-center justify-between flex-shrink-0">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                      계약 업체 목록 <span className="text-xs sm:text-sm text-blue-600 font-normal">({(teamCompanies[team.id as keyof typeof teamCompanies] || []).length}개)</span>
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCSV(team.name, team.id)}
                      className="flex items-center gap-2 text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs h-8 px-3 flex-shrink-0 shadow-none"
                    >
                      <img src="/icons/icon-excel.png" alt="Excel" className="w-3 h-3 sm:w-4 sm:h-4" />
                      엑셀 다운로드
                    </Button>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex-1 min-h-0 flex flex-col">
                    <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <table className="w-full caption-bottom text-sm min-w-[890px]">
                        <thead className="bg-gray-100 [&_tr]:border-b sticky top-0 z-10">
                          <tr className="!border-b !border-gray-200">
                            <th className="text-xs sm:text-sm font-semibold text-gray-700 py-4 px-4 text-left align-middle whitespace-nowrap min-w-[120px]">업체명</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-700 py-4 px-4 text-left align-middle whitespace-nowrap min-w-[100px]">지역</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-700 py-4 px-4 text-left align-middle whitespace-nowrap min-w-[100px]">상품명</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-700 py-4 px-4 text-left align-middle whitespace-nowrap min-w-[80px]">키워드 개수</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-700 py-4 px-4 text-left align-middle whitespace-nowrap min-w-[150px]">계약 기간</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-700 py-4 px-4 text-left align-middle whitespace-nowrap min-w-[100px]">담당자</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-700 py-4 px-4 text-left align-middle whitespace-nowrap min-w-[120px]">총광고비</th>
                            <th className="text-xs sm:text-sm font-semibold text-gray-700 py-4 px-4 text-left align-middle whitespace-nowrap min-w-[120px]">월광고비</th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {(teamCompanies[team.id as keyof typeof teamCompanies] || []).map((company, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <td className="font-medium text-xs sm:text-sm py-4 px-4 align-middle whitespace-nowrap">{company.companyName}</td>
                              <td className="text-xs sm:text-sm py-4 px-4 align-middle whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-slate-500 flex-shrink-0" />
                                  {company.region}
                                </div>
                              </td>
                              <td className="text-xs sm:text-sm py-4 px-4 align-middle whitespace-nowrap">{company.productName}</td>
                              <td className="text-xs sm:text-sm py-4 px-4 align-middle whitespace-nowrap">{company.keywordCount ?? (company.contractCount * 5)}개</td>
                              <td className="text-xs sm:text-sm py-4 px-4 align-middle whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-slate-500 flex-shrink-0" />
                                  {company.contractPeriod}
                                </div>
                              </td>
                              <td className="text-xs sm:text-sm py-4 px-4 align-middle whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3 text-slate-500 flex-shrink-0" />
                                  {company.manager}
                                </div>
                              </td>
                              <td className="text-xs sm:text-sm py-4 px-4 align-middle whitespace-nowrap">{formatCurrency(company.totalAdCost)}</td>
                              <td className="text-xs sm:text-sm py-4 px-4 align-middle whitespace-nowrap">{formatCurrency(company.monthlyAdCost)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}

          {/* 월별 추이 차트 */}
          <Card className="transition-all duration-300 ease-in-out shadow-none rounded-xl border border-gray-200 py-4 sm:py-6 mt-8 sm:mt-12 mb-8 sm:mb-12">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base sm:text-lg">{activeTab === "team" ? "팀별 월별 성과 추이" : "개인별 월별 포스팅 추이"}</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {activeTab === "team"
                    ? selectedChartTeam === "전체"
                      ? `전체 팀의 월별 ${selectedMetric} 변화를 확인하세요`
                      : "선택된 팀과 지표의 월별 변화를 확인하세요"
                    : "개인별 월별 포스팅 수, 재작업 수, 유효작업 수를 확인하세요"}
                </CardDescription>
              </div>
              {activeTab === "team" && (
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <CommonSelect
                    value={selectedChartTeam}
                    onValueChange={setSelectedChartTeam}
                    options={[
                      { value: "전체", label: "전체" },
                      ...teamPerformance.map((team) => ({
                        value: team.name,
                        label: team.name,
                      })),
                    ]}
                    placeholder="팀 선택"
                    triggerClassName="w-full sm:w-24 lg:w-32 h-8 sm:h-10 text-xs sm:text-sm"
                  />
                  <CommonSelect
                    value={selectedMetric}
                    onValueChange={setSelectedMetric}
                    options={[
                      { value: "월 매출", label: "월 매출" },
                      { value: "평균 포스팅 비용", label: "평균 포스팅 비용" },
                      { value: "총 계약 매출", label: "총 계약 매출" },
                      { value: "관리 업체", label: "관리 업체" },
                      { value: "업체당 매월 평균", label: "업체당 매월 평균" },
                      { value: "인원", label: "인원" },
                      { value: "인당 평균 매출", label: "인당 평균 매출" },
                      { value: "인당 평균 업체 수", label: "인당 평균 업체 수" },
                    ]}
                    placeholder="지표 선택"
                    triggerClassName="w-full sm:w-32 lg:w-[180px] h-8 sm:h-10 text-xs sm:text-sm"
                  />
                      </div>
              )}
              {activeTab === "individual" && (
                <div className="hidden lg:flex items-center space-x-4">
                  {filteredIndividualPerformance.map((person, index) => {
                      const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#f97316"]
                      return (
                        <div key={person.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={person.id}
                            checked={selectedIndividualMembers.includes(person.name)}
                            onCheckedChange={() => handleIndividualMemberToggle(person.name)}
                          />
                          <label
                            htmlFor={person.id}
                            className="text-xs sm:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            style={{ color: colors[index % colors.length] }}
                          >
                            {person.name}
                          </label>
                        </div>
                      )
                    })}
              </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px] relative">
                <Line
                  data={{
                    labels: (activeTab === "team" ? filteredChartData : individualPostingChartData).map((item) => item.month),
                    datasets:
                      activeTab === "team"
                        ? (() => {
                            if (selectedChartTeam === "전체") {
                              // 전체 선택 시 모든 팀 표시
                              const allTeamsData = filteredChartData as Array<Record<string, number | MonthKey>>
                              return Object.keys(teamColors)
                                .filter((teamName) => ["1팀", "2팀", "3팀", "4팀"].includes(teamName))
                            .map((teamName) => {
                              const color = teamColors[teamName as keyof typeof teamColors]
                              return {
                                label: `${teamName} ${selectedMetric}`,
                                    data: allTeamsData.map((item) => item[teamName] as number),
                                borderColor: color,
                                backgroundColor: 'transparent',
                                borderWidth: 2.5,
                                tension: 0.4,
                                pointRadius: 6,
                                pointHoverRadius: 10,
                                pointBackgroundColor: '#ffffff',
                                pointBorderColor: color,
                                pointBorderWidth: 3,
                                pointHoverBackgroundColor: color,
                                pointHoverBorderColor: '#ffffff',
                                pointHoverBorderWidth: 4,
                                fill: false,
                                segment: {
                                  borderDash: (ctx: any) => {
                                    const value = ctx.p0.$context.parsed.y
                                    const nextValue = ctx.p1.$context.parsed.y
                                    return value > nextValue ? [6, 6] : undefined
                                  }
                                }
                              }
                            })
                            } else {
                              // 특정 팀 선택 시 해당 팀의 지표 데이터만 표시
                              const singleTeamData = filteredChartData as Array<{ month: MonthKey; value: number }>
                              const team = teamPerformance.find((t) => t.name === selectedChartTeam)
                              const color = team ? teamColors[selectedChartTeam as keyof typeof teamColors] : "#3b82f6"
                              return [{
                                label: `${selectedChartTeam} ${selectedMetric}`,
                                data: singleTeamData.map((item) => item.value),
                                borderColor: color,
                                backgroundColor: 'transparent',
                                borderWidth: 2.5,
                                tension: 0.4,
                                pointRadius: 6,
                                pointHoverRadius: 10,
                                pointBackgroundColor: '#ffffff',
                                pointBorderColor: color,
                                pointBorderWidth: 3,
                                pointHoverBackgroundColor: color,
                                pointHoverBorderColor: '#ffffff',
                                pointHoverBorderWidth: 4,
                                fill: false,
                                segment: {
                                  borderDash: (ctx: any) => {
                                    const value = ctx.p0.$context.parsed.y
                                    const nextValue = ctx.p1.$context.parsed.y
                                    return value > nextValue ? [6, 6] : undefined
                                  }
                                }
                              }]
                            }
                          })()
                        : selectedIndividualMembers.map((memberName, index) => {
                            const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#84cc16", "#f97316"]
                            const color = colors[index % colors.length]
                            return {
                              label: `${memberName} 포스팅`,
                              data: individualPostingChartData.map((item) => item[memberName]),
                              borderColor: color,
                              backgroundColor: 'transparent',
                              borderWidth: 2.5,
                              tension: 0.4,
                              pointRadius: 6,
                              pointHoverRadius: 10,
                              pointBackgroundColor: '#ffffff',
                              pointBorderColor: color,
                              pointBorderWidth: 3,
                              pointHoverBackgroundColor: color,
                              pointHoverBorderColor: '#ffffff',
                              pointHoverBorderWidth: 4,
                              fill: false,
                              segment: {
                                borderDash: (ctx: any) => {
                                  const value = ctx.p0.$context.parsed.y
                                  const nextValue = ctx.p1.$context.parsed.y
                                  return value > nextValue ? [6, 6] : undefined
                                }
                              }
                            }
                          }),
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
                        display: false,
                      },
                      tooltip: {
                        enabled: true,
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        titleColor: '#ffffff',
                        bodyColor: '#e2e8f0',
                        borderColor: '#475569',
                        borderWidth: 2,
                        padding: 20,
                        displayColors: true,
                        usePointStyle: true,
                        boxWidth: 10,
                        boxHeight: 10,
                        titleFont: {
                          size: 15,
                          weight: 'bold' as const,
                        },
                        bodyFont: {
                          size: 14,
                        },
                        bodySpacing: 10,
                        cornerRadius: 12,
                        caretPadding: 12,
                        caretSize: 8,
                        callbacks: {
                          title: function(context) {
                            return `📊 ${context[0].label}`
                          },
                          label: function (context) {
                            const label = context.dataset.label || ""
                            const value = context.parsed.y || 0
                            if (activeTab === "team") {
                              // 지표에 따라 포맷 다르게 표시 (전체/특정 팀 동일)
                              if (selectedMetric === "관리 업체" || selectedMetric === "인원") {
                                return `  ${label}: ${value}${selectedMetric === "관리 업체" ? "개" : "명"}`
                              } else if (selectedMetric === "인당 평균 업체 수") {
                                return `  ${label}: ${value.toFixed(1)}개`
                              } else {
                                return `  ${label}: ${formatCurrency(value)}`
                              }
                            }
                            return `  ${label}: ${value}건`
                          },
                          afterLabel: function(context) {
                            const dataIndex = context.dataIndex
                            if (dataIndex > 0 && activeTab === "team") {
                              const currentValue = context.parsed.y || 0
                              const previousValue = context.dataset.data[dataIndex - 1] as number
                              if (previousValue === 0) return ''
                              const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
                              const changeText = currentValue > previousValue ? `▲ ${change}%` : currentValue < previousValue ? `▼ ${Math.abs(Number(change))}%` : '―'
                              return `     전월대비: ${changeText}`
                            } else if (dataIndex > 0 && activeTab === "individual") {
                              const currentValue = context.parsed.y || 0
                              const previousValue = context.dataset.data[dataIndex - 1] as number
                              if (previousValue === 0) return ''
                              const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
                              const changeText = currentValue > previousValue ? `▲ ${change}%` : currentValue < previousValue ? `▼ ${Math.abs(Number(change))}%` : '―'
                              return `     전월대비: ${changeText}`
                            }
                            return ''
                          }
                        },
                      },
                    },
                    scales: {
                      x: {
                        grid: {
                          display: false,
                        },
                        ticks: {
                          color: "#475569",
                          font: {
                            size: 13,
                          },
                          padding: 12,
                        },
                        border: {
                          display: false,
                        },
                      },
                      y: {
                        grid: {
                          color: 'rgba(226, 232, 240, 0.5)',
                          lineWidth: 1,
                          drawTicks: false,
                        },
                        ticks: {
                          color: "#475569",
                          font: {
                            size: 12,
                          },
                          padding: 12,
                          callback: function (value) {
                            const numValue = Number(value)
                            if (activeTab === "team") {
                              // 지표에 따라 포맷 다르게 표시 (전체/특정 팀 동일)
                              if (selectedMetric === "관리 업체" || selectedMetric === "인원") {
                                return `${numValue}${selectedMetric === "관리 업체" ? "개" : "명"}`
                              } else if (selectedMetric === "인당 평균 업체 수") {
                                return `${numValue.toFixed(1)}개`
                              } else {
                                return formatCurrency(numValue)
                              }
                            }
                            return `${numValue}건`
                          },
                        },
                        border: {
                          display: false,
                        },
                      },
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
                      },
                    },
                    hover: {
                      mode: 'index',
                      intersect: false,
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* 월별 상세 테이블 */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {activeTab === "team" ? "팀별 월별 성과 상세" : "개인별 월별 포스팅 상세"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {activeTab === "team"
                  ? "각 팀의 월별 매출과 증감률을 확인하세요"
                  : "각 개인의 월별 포스팅 수, 재작업 수를 확인하세요"}
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow className="!border-b !border-gray-200">
                      <TableHead className="w-16 sm:w-20 text-xs sm:text-sm font-semibold text-gray-700 py-4 text-center">{activeTab === "team" ? "팀" : "이름"}</TableHead>
                      {activeTab === "individual" && <TableHead className="w-12 sm:w-16 text-xs sm:text-sm font-semibold text-gray-700 py-4 text-center">팀</TableHead>}
                      {filteredMonths.map((month, i) => (
                        <TableHead key={i} className="text-center min-w-20 sm:min-w-24 text-xs sm:text-sm font-semibold text-gray-700 py-4">
                          {month}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeTab === "team"
                      ? filteredTableData.map((teamData) => (
                          <TableRow key={teamData.team} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium text-xs sm:text-sm py-4 text-center">
                              <button
                                onClick={() => {
                                  setDetailModalTeam(teamData.team)
                                  setPerformanceDetailModalOpen(true)
                                }}
                                className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
                              >
                                {teamData.team}
                              </button>
                            </TableCell>
                            {filteredMonths.map((monthKey, i) => {
                              const data = teamData.data[monthKey]
                              const currentMetric = selectedMetric
                              return (
                                <TableCell key={i} className="text-center">
                                  <div className="space-y-1">
                                    <div className="font-medium text-xs sm:text-sm">{formatMetricValue(currentMetric, data.revenue)}</div>
                                    <div
                                      className={`flex items-center justify-center gap-1 text-xs ${
                                        data.change > 0
                                          ? "text-green-600"
                                          : data.change < 0
                                            ? "text-red-600"
                                            : "text-slate-500"
                                      }`}
                                    >
                                      {data.change > 0 ? (
                                        <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                                      ) : data.change < 0 ? (
                                        <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3" />
                                      ) : null}
                                      {data.change > 0 ? "+" : ""}
                                      {data.change.toFixed(1)}%
                                    </div>
                                  </div>
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))
                      : individualPostingData
                          .filter((personData) =>
                            filteredIndividualPerformance.some((person) => person.name === personData.name),
                          )
                          .map((personData) => (
                            <TableRow key={personData.name} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                              <TableCell className="font-medium text-xs sm:text-sm py-4 text-center">{personData.name}</TableCell>
                              <TableCell className="text-center text-xs sm:text-sm text-slate-600 py-4">{personData.team}</TableCell>
                              {filteredMonths.map((monthKey, i) => {
                                const data = personData.data[monthKey]
                                if (!data)
                                  return (
                                    <TableCell key={i} className="text-center text-xs sm:text-sm">
                                      -
                                    </TableCell>
                                  )
                                return (
                                  <TableCell key={i} className="text-center">
                                    <div className="space-y-1">
                                      <button
                                        className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                        onClick={() => setSelectedPersonForDetail(personData.name)}
                                      >
                                        (포) {data.posting}건
                                      </button>
                                      <div className="text-xs text-red-600">(재) {data.rework}건</div>
                </div>
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {/* 개인별 포스팅 상세 모달 */}
          <Dialog
            open={selectedPersonForDetail !== null}
            onOpenChange={(open) => !open && setSelectedPersonForDetail(null)}
          >
            <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[95vh] flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
                  {selectedPersonForDetail && (
                    <>
                      <div
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                          filteredIndividualPerformance.find((p) => p.name === selectedPersonForDetail)?.teamColor
                        }`}
                      ></div>
                      {selectedPersonForDetail} 포스팅 상세 현황
                    </>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">{selectedPersonForDetail}님의 상세 포스팅 현황과 성과 정보입니다.</DialogDescription>
              </DialogHeader>

              {selectedPersonForDetail && (
                <div className="flex-1 overflow-y-auto pb-4">
                  <div className="space-y-4 sm:space-y-6">
                    {/* 개인 정보 요약 카드 */}
                    <Card className="shadow-none rounded-xl border border-gray-200 py-4 sm:py-6 gap-2">
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base">개인 정보 요약</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(() => {
                          const person = filteredIndividualPerformance.find((p) => p.name === selectedPersonForDetail)
                          if (!person) return null

                          // 키워드 개수 계산 (선택된 기간의 월별 키워드 개수 합계)
                          const personPostingData = individualPostingData.find((p) => p.name === selectedPersonForDetail)
                          const totalKeywords = personPostingData
                            ? filteredMonths.reduce((sum, month) => {
                                const monthData = personPostingData.data[month as keyof typeof personPostingData.data]
                                return sum + (monthData?.keywords || 0)
                              }, 0)
                            : 0

                          return (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                              <Card className="border-blue-200 bg-blue-50 shadow-none">
                                <CardContent className="p-3 sm:p-4 text-center">
                                  <p className="text-xs text-slate-600 mb-1">이번달 매출</p>
                                  <p className="text-sm sm:text-lg font-semibold text-blue-700">
                                    {formatCurrency(person.monthlyRevenue)}
                                  </p>
                                </CardContent>
                              </Card>
                              <Card className="border-green-200 bg-green-50 shadow-none">
                                <CardContent className="p-3 sm:p-4 text-center">
                                  <p className="text-xs text-slate-600 mb-1">평균 매출</p>
                                  <p className="text-sm sm:text-lg font-semibold text-green-700">
                                    {formatCurrency(person.avgMonthlyRevenue)}
                                  </p>
                                </CardContent>
                              </Card>
                              <Card className="border-purple-200 bg-purple-50 shadow-none">
                                <CardContent className="p-3 sm:p-4 text-center">
                                  <p className="text-xs text-slate-600 mb-1">키워드 개수</p>
                                  <p className="text-sm sm:text-lg font-semibold text-purple-700">{totalKeywords}개</p>
                                </CardContent>
                              </Card>
                              <Card className="border-orange-200 bg-orange-50 shadow-none">
                                <CardContent className="p-3 sm:p-4 text-center">
                                  <p className="text-xs text-slate-600 mb-1">관리 업체 수</p>
                                  <p className="text-sm sm:text-lg font-semibold text-orange-700">{person.companiesCount}개</p>
                                </CardContent>
                              </Card>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>

                    {/* 월별 포스팅 추이 그래프 */}
                    <Card className="shadow-none rounded-xl border border-gray-200 py-4 sm:py-6">
                      <CardHeader>
                        <CardTitle className="text-sm sm:text-base">월별 포스팅 추이</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">선택된 기간의 포스팅 수, 재작업 수, 유효작업 수 현황</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full h-[250px]">
                          <Line
                            data={{
                              labels: (() => {
                                const personData = individualPostingData.find((p) => p.name === selectedPersonForDetail)
                                if (!personData) return []
                                return filteredMonths.map((month) => month)
                              })(),
                              datasets: [
                                {
                                  label: "포스팅",
                                  data: (() => {
                                    const personData = individualPostingData.find((p) => p.name === selectedPersonForDetail)
                                    if (!personData) return []
                                    return filteredMonths.map((month) => personData.data[month]?.posting || 0)
                                  })(),
                                  borderColor: "#3b82f6",
                                  backgroundColor: 'transparent',
                                  borderWidth: 2.5,
                                  tension: 0.4,
                                  pointRadius: 6,
                                  pointHoverRadius: 10,
                                  pointBackgroundColor: '#ffffff',
                                  pointBorderColor: '#3b82f6',
                                  pointBorderWidth: 3,
                                  pointHoverBackgroundColor: '#3b82f6',
                                  pointHoverBorderColor: '#ffffff',
                                  pointHoverBorderWidth: 3,
                                  fill: false,
                                },
                                {
                                  label: "재작업",
                                  data: (() => {
                                    const personData = individualPostingData.find((p) => p.name === selectedPersonForDetail)
                                    if (!personData) return []
                                    return filteredMonths.map((month) => personData.data[month]?.rework || 0)
                                  })(),
                                  borderColor: "#ef4444",
                                  backgroundColor: 'transparent',
                                  borderWidth: 2.5,
                                  tension: 0.4,
                                  pointRadius: 6,
                                  pointHoverRadius: 10,
                                  pointBackgroundColor: '#ffffff',
                                  pointBorderColor: '#ef4444',
                                  pointBorderWidth: 3,
                                  pointHoverBackgroundColor: '#ef4444',
                                  pointHoverBorderColor: '#ffffff',
                                  pointHoverBorderWidth: 3,
                                  fill: false,
                                },
                                {
                                  label: "유효작업",
                                  data: (() => {
                                    const personData = individualPostingData.find((p) => p.name === selectedPersonForDetail)
                                    if (!personData) return []
                                    return filteredMonths.map((month) => personData.data[month]?.valid || 0)
                                  })(),
                                  borderColor: "#10b981",
                                  backgroundColor: 'transparent',
                                  borderWidth: 2.5,
                                  tension: 0.4,
                                  pointRadius: 6,
                                  pointHoverRadius: 10,
                                  pointBackgroundColor: '#ffffff',
                                  pointBorderColor: '#10b981',
                                  pointBorderWidth: 3,
                                  pointHoverBackgroundColor: '#10b981',
                                  pointHoverBorderColor: '#ffffff',
                                  pointHoverBorderWidth: 3,
                                  fill: false,
                                },
                              ],
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
                                  position: "top" as const,
                                  labels: {
                                    color: "#475569",
                                    font: {
                                      size: 12,
                                      weight: 500,
                                    },
                                    padding: 15,
                                    usePointStyle: true,
                                    pointStyle: 'circle',
                                  },
                                },
                                tooltip: {
                                  enabled: true,
                                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                                  titleColor: '#ffffff',
                                  bodyColor: '#e2e8f0',
                                  borderColor: '#475569',
                                  borderWidth: 2,
                                  padding: 16,
                                  displayColors: true,
                                  usePointStyle: true,
                                  boxWidth: 10,
                                  boxHeight: 10,
                                  titleFont: {
                                    size: 14,
                                    weight: 'bold' as const,
                                  },
                                  bodyFont: {
                                    size: 13,
                                  },
                                  bodySpacing: 8,
                                  cornerRadius: 12,
                                  caretPadding: 10,
                                  caretSize: 6,
                                  callbacks: {
                                    title: function(context) {
                                      return `📊 ${context[0].label}`
                                    },
                                    label: function (context) {
                                      return `  ${context.dataset.label}: ${context.parsed.y}건`
                                    },
                                    afterLabel: function(context) {
                                      const dataIndex = context.dataIndex
                                      if (dataIndex > 0) {
                                        const currentValue = context.parsed.y || 0
                                        const previousValue = context.dataset.data[dataIndex - 1] as number
                                        if (previousValue === 0) return ''
                                        const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
                                        const changeText = currentValue > previousValue ? `▲ ${change}%` : currentValue < previousValue ? `▼ ${Math.abs(Number(change))}%` : '―'
                                        return `     전월대비: ${changeText}`
                                      }
                                      return ''
                                    }
                                  },
                                },
                              },
                              scales: {
                                x: {
                                  grid: {
                                    display: false,
                                  },
                                  ticks: {
                                    color: "#475569",
                                    font: {
                                      size: 12,
                                    },
                                    padding: 8,
                                  },
                                  border: {
                                    display: false,
                                  },
                                },
                                y: {
                                  grid: {
                                    color: 'rgba(226, 232, 240, 0.5)',
                                    lineWidth: 1,
                                    drawTicks: false,
                                  },
                                  ticks: {
                                    color: "#475569",
                                    font: {
                                      size: 12,
                                    },
                                    padding: 8,
                                    callback: function (value) {
                                      return `${value}건`
                                    },
                                  },
                                  border: {
                                    display: false,
                                  },
                                },
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
                                },
                              },
                              hover: {
                                mode: 'index',
                                intersect: false,
                              },
                            }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    {/* 월별 포스팅 상세내역 테이블 */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900">월별 포스팅 상세내역</h3>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader className="bg-gray-100">
                              <TableRow className="!border-b !border-gray-200">
                                <TableHead className="w-16 sm:w-20 text-xs sm:text-sm font-semibold text-gray-700 py-4 text-center">월</TableHead>
                                <TableHead className="text-center text-xs sm:text-sm font-semibold text-gray-700 py-4">포스팅 수</TableHead>
                                <TableHead className="text-center text-xs sm:text-sm font-semibold text-gray-700 py-4">재작업 수</TableHead>
                                <TableHead className="text-center text-xs sm:text-sm font-semibold text-gray-700 py-4">유효작업 수</TableHead>
                                <TableHead className="text-center text-xs sm:text-sm font-semibold text-gray-700 py-4">키워드 수</TableHead>
                                <TableHead className="text-center text-xs sm:text-sm font-semibold text-gray-700 py-4">상위5 키워드</TableHead>
                                <TableHead className="text-center text-xs sm:text-sm font-semibold text-gray-700 py-4">평균 순위</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {(() => {
                                const personData = individualPostingData.find((p) => p.name === selectedPersonForDetail)
                                if (!personData) return null

                                return filteredMonths.map((month) => {
                                  const data = personData.data[month]
                                  if (!data) return null

                                  return (
                                    <TableRow key={month} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                      <TableCell className="font-medium text-xs sm:text-sm py-4 text-center">{month}</TableCell>
                                      <TableCell className="text-center text-xs sm:text-sm py-4">{data.posting}건</TableCell>
                                      <TableCell className="text-center text-red-600 text-xs sm:text-sm py-4">{data.rework}건</TableCell>
                                      <TableCell className="text-center text-green-600 text-xs sm:text-sm py-4">{data.valid}건</TableCell>
                                      <TableCell className="text-center text-xs sm:text-sm py-4">{data.keywords}개</TableCell>
                                      <TableCell className="text-center text-xs sm:text-sm py-4">{data.top5Keywords}개</TableCell>
                                      <TableCell className="text-center py-4">
                                        <Badge
                                          variant={
                                            data.avgRank <= 3 ? "default" : data.avgRank <= 5 ? "secondary" : "destructive"
                                          }
                                          className="text-xs"
                                        >
                                          {data.avgRank}위
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  )
                                })
                              })()}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* 월별 성과내역 상세 모달 */}
          <Dialog open={performanceDetailModalOpen} onOpenChange={setPerformanceDetailModalOpen}>
            <DialogContent className="max-w-[95vw] lg:max-w-7xl max-h-[95vh] overflow-y-auto gap-2">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">월별 성과내역 상세</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  팀별 8개 지표의 월별 상세 데이터를 확인하세요
                </DialogDescription>
              </DialogHeader>

              {/* 필터 영역 */}
              <div className="space-y-4">
                {/* 엑셀 다운로드 버튼 */}
                <div className="flex justify-end mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // 엑셀 다운로드 로직 구현
                      console.log('월별 성과내역 엑셀 다운로드')
                    }}
                    className="flex items-center gap-2 text-gray-600 border-gray-300 bg-gray-50 hover:bg-gray-100 text-xs h-8 px-3 flex-shrink-0 shadow-none"
                  >
                    <img src="/icons/icon-excel.png" alt="Excel" className="w-3 h-3 sm:w-4 sm:h-4" />
                    엑셀 다운로드
                  </Button>
                </div>

                {/* 필터 컨트롤 */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {/* 팀 선택 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">팀:</label>
                    <CommonSelect
                      value={detailModalTeam}
                      onValueChange={setDetailModalTeam}
                      options={[
                        { value: "전체", label: "전체" },
                        ...teamPerformance.map((team) => ({
                          value: team.name,
                          label: team.name,
                        })),
                      ]}
                      placeholder="팀 선택"
                      triggerClassName="w-24 sm:w-28 h-8 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>

                  {/* 년도 선택 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">년도:</label>
                    <CommonSelect
                      value={detailModalYear}
                      onValueChange={setDetailModalYear}
                      options={Array.from({ length: 3 }, (_, i) => {
                        const year = 2023 + i
                        return { value: year.toString(), label: `${year}년` }
                      })}
                      placeholder="년도 선택"
                      triggerClassName="w-24 sm:w-28 h-8 sm:h-10 text-xs sm:text-sm"
                    />
                  </div>

                  {/* 기간 설정 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">기간:</label>
                    <div className="flex items-center gap-2">
                      <CommonSelect
                        value={detailModalPeriod}
                        onValueChange={(value) => {
                          setDetailModalPeriod(value)
                          if (value !== "기간 수동 지정") {
                            setDetailModalDateRange({ start: null, end: null })
                          }
                        }}
                        options={[
                          { value: "전체", label: "전체" },
                          { value: "상반기", label: "상반기" },
                          { value: "하반기", label: "하반기" },
                          { value: "기간 수동 지정", label: "기간 수동 지정" },
                        ]}
                        placeholder="기간 선택"
                        triggerClassName="w-32 sm:w-40 h-8 sm:h-10 text-xs sm:text-sm"
                      />
                      {detailModalPeriod === "기간 수동 지정" && (
                        <CustomDatePicker
                          selectRange={true}
                          rangeStart={detailModalDateRange.start}
                          rangeEnd={detailModalDateRange.end}
                          onRangeChange={(start, end) => setDetailModalDateRange({ start, end })}
                          placeholder="시작일 - 종료일"
                          size="small"
                          className="w-48 sm:w-56"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 테이블 영역 */}
              <div className="mt-4 overflow-x-auto">
                {(() => {
                  // 모달 내 기간 필터링
                  const getModalFilteredMonths = (): MonthKey[] => {
                    if (detailModalPeriod === "전체") {
                      return ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
                    } else if (detailModalPeriod === "상반기") {
                      return ["1월", "2월", "3월", "4월", "5월", "6월"]
                    } else if (detailModalPeriod === "하반기") {
                      return ["7월", "8월", "9월", "10월", "11월", "12월"]
                    } else if (detailModalPeriod === "기간 수동 지정" && detailModalDateRange.start && detailModalDateRange.end) {
                      // 날짜 범위에서 월 추출 (간단한 구현)
                      const start = detailModalDateRange.start
                      const end = detailModalDateRange.end
                      const months: MonthKey[] = []
                      const current = new Date(start.getFullYear(), start.getMonth(), 1)
                      const endDate = new Date(end.getFullYear(), end.getMonth(), 1)
                      
                      while (current <= endDate) {
                        const monthKey = `${current.getMonth() + 1}월` as MonthKey
                        if (!months.includes(monthKey)) {
                          months.push(monthKey)
                        }
                        current.setMonth(current.getMonth() + 1)
                      }
                      return months.length > 0 ? months : ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
                    }
                    return ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
                  }

                  const modalMonths = getModalFilteredMonths()
                  const teamsToShow = detailModalTeam === "전체" 
                    ? teamPerformance.map(t => t.name)
                    : [detailModalTeam]

                  const allMetrics: MetricType[] = [
                    "월 매출",
                    "평균 포스팅 비용",
                    "총 계약 매출",
                    "관리 업체",
                    "업체당 매월 평균",
                    "인원",
                    "인당 평균 매출",
                    "인당 평균 업체 수",
                  ]

                  // 모든 팀의 지표 데이터 준비
                  const allTeamsMetrics = teamsToShow.map(teamName => {
                    const teamMetrics = allMetrics.map(metric => {
                      const tableData = getTableData(metric, modalMonths as MonthKey[])
                      const teamData = tableData.find(t => t.team === teamName)
                      return {
                        metric,
                        data: (teamData?.data || {}) as Record<MonthKey, { value: number; change: number }>,
                      }
                    })
                    return { teamName, metrics: teamMetrics }
                  })

                  return (
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="overflow-x-auto w-full">
                        <Table className="min-w-full">
                          <TableHeader className="bg-gray-100">
                            <TableRow className="!border-b !border-gray-200">
                              <TableHead className="w-[112px] sm:w-[128px] text-xs sm:text-sm font-semibold text-gray-700 py-3 px-3 border-r border-gray-200">
                                팀
                              </TableHead>
                              <TableHead className="w-32 sm:w-40 text-xs sm:text-sm font-semibold text-gray-700 py-3 bg-gray-100">
                                지표
                              </TableHead>
                              {modalMonths.map((month) => (
                                <TableHead key={month} className="text-center min-w-[120px] sm:min-w-[140px] text-xs sm:text-sm font-semibold text-gray-700 py-3 px-2">
                                  {month}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {allTeamsMetrics.map(({ teamName, metrics }, teamIndex) =>
                              metrics.map(({ metric, data }, metricIndex) => {
                                const isLastMetricInTeam = metricIndex === metrics.length - 1
                                const isLastTeam = teamIndex === allTeamsMetrics.length - 1
                                return (
                                <TableRow 
                                  key={`${teamName}-${metric}`} 
                                  className={`hover:bg-gray-50 transition-colors ${
                                    isLastMetricInTeam && !isLastTeam 
                                      ? "border-b border-gray-600" 
                                      : "border-b border-gray-100"
                                  }`}
                                >
                                  {metricIndex === 0 && (
                                    <TableCell
                                      rowSpan={8}
                                      className="font-semibold text-xs sm:text-sm py-3 px-3 align-middle text-center bg-blue-50 border-r border-gray-200 w-[112px] sm:w-[128px]"
                                      style={{ width: '112px', minWidth: '112px' }}
                                    >
                                      {teamName}
                                    </TableCell>
                                  )}
                                  <TableCell className="font-medium text-xs sm:text-sm py-3 bg-gray-100">
                                    {metric}
                                  </TableCell>
                                  {modalMonths.map((month) => {
                                    const monthKey = month as MonthKey
                                    const monthData = data[monthKey]
                                    if (!monthData) {
                                      return (
                                        <TableCell key={month} className="text-center py-3 px-2 min-w-[120px] sm:min-w-[140px]">
                                          <div className="space-y-1">-</div>
                                        </TableCell>
                                      )
                                    }
                                    return (
                                      <TableCell key={month} className="text-center py-3 px-2 min-w-[120px] sm:min-w-[140px]">
                                        <div className="space-y-1">
                                          <div className="font-medium text-xs sm:text-sm">
                                            {formatMetricValue(metric, monthData.value)}
                                          </div>
                                          <div
                                            className={`flex items-center justify-center gap-1 text-xs ${
                                              monthData.change > 0
                                                ? "text-red-600"
                                                : monthData.change < 0
                                                ? "text-blue-600"
                                                : "text-gray-500"
                                            }`}
                                          >
                                            {monthData.change > 0 ? (
                                              <>
                                                <span>▲</span>
                                                <span>{monthData.change.toFixed(2)}%</span>
                                              </>
                                            ) : monthData.change < 0 ? (
                                              <>
                                                <span>▼</span>
                                                <span>{Math.abs(monthData.change).toFixed(2)}%</span>
                                              </>
                                            ) : (
                                              <span>0%</span>
                                            )}
                                          </div>
                                        </div>
                                      </TableCell>
                                    )
                                  })}
                                </TableRow>
                              )})
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )
                })()}
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
