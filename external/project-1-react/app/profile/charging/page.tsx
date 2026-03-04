"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"

import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { ScrollableTabs } from "@/components/ui/scrollable-tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, CheckCircle2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import CustomDatePicker from "@/components/ui/custom-datepicker"
import { cn } from "@/lib/utils"

const profileTabs = [
  { name: "계정정보", href: "/profile/account" },
  { name: "멤버십 관리", href: "/profile/membership" },
  { name: "결제 정보", href: "/profile/payment" },
  { name: "충전/이용내역", href: "/profile/charging" },
  { name: "MY문의", href: "/profile/inquiry" },
]

type HistoryCategory = "전체" | "사용" | "적립" | "충전"

interface MineralPackage {
  value: string
  mineral: number
  bonus?: number
  price: number
}

interface MineralHistory {
  id: number
  title: string
  category: Exclude<HistoryCategory, "전체">
  date: string
  time: string
  amount: number
  note?: string
}

const mineralPackages: MineralPackage[] = [
  { value: "100", mineral: 100, price: 10000 },
  { value: "300", mineral: 300, bonus: 30, price: 30000 },
  { value: "500", mineral: 500, bonus: 100, price: 50000 },
  { value: "700", mineral: 700, bonus: 170, price: 70000 },
  { value: "1000", mineral: 1000, bonus: 300, price: 100000 },
]

const historyData: MineralHistory[] = [
  {
    id: 1,
    title: "대량 글생성",
    category: "사용",
    date: "2025.11.12",
    time: "09:23:15",
    amount: -150,
  },
  {
    id: 2,
    title: "단건 글생성",
    category: "사용",
    date: "2025.11.10",
    time: "09:45:51",
    amount: -4.5,
  },
  {
    id: 3,
    title: "고객센터",
    category: "적립",
    date: "2025.11.08",
    time: "16:00:16",
    amount: 4.5,
  },
  {
    id: 4,
    title: "멤버십 충전",
    category: "충전",
    date: "2025.11.05",
    time: "13:40:00",
    amount: 600,
    note: "카드 결제",
  },
]

const filterTabs: HistoryCategory[] = ["전체", "사용", "적립", "충전"]

const quickRanges = [
  { label: "최근 6개월", value: "6m" },
  { label: "일주일", value: "1w" },
  { label: "1개월", value: "1m" },
  { label: "3개월", value: "3m" },
]

export default function ChargingPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeHistoryTab, setActiveHistoryTab] = useState<HistoryCategory>("전체")
  const [selectedPackage, setSelectedPackage] = useState<MineralPackage>(mineralPackages[0])
  const [isChargeDialogOpen, setIsChargeDialogOpen] = useState(false)
  const [isChargeSuccessOpen, setIsChargeSuccessOpen] = useState(false)
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [activeQuickRange, setActiveQuickRange] = useState("1w")
  const [rangeStart, setRangeStart] = useState<Date | null>(new Date("2025-11-05"))
  const [rangeEnd, setRangeEnd] = useState<Date | null>(new Date("2025-11-12"))
  const [forceEmptyHistory, setForceEmptyHistory] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = window.setTimeout(() => setIsLoading(false), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  const filteredHistory = useMemo(() => {
    if (activeHistoryTab === "전체") {
      return historyData
    }
    return historyData.filter((item) => item.category === activeHistoryTab)
  }, [activeHistoryTab])

  const displayedHistory = forceEmptyHistory ? [] : filteredHistory

  const totalMineral = 2690
  const totalCharged = 1836
  const totalEarned = 854

  const mineralUnitLabel = "미네랄"

  const handleSelectPackage = (value: string) => {
    const found = mineralPackages.find((item) => item.value === value)
    if (found) {
      setSelectedPackage(found)
    }
  }

  const handleQuickRangeSelect = (value: string) => {
    setActiveQuickRange(value)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const cloneDate = (date: Date) => new Date(date.getTime())
    const addDays = (date: Date, days: number) => {
      const result = cloneDate(date)
      result.setDate(result.getDate() + days)
      return result
    }
    const addMonths = (date: Date, months: number) => {
      const result = cloneDate(date)
      result.setMonth(result.getMonth() + months)
      return result
    }

    let startDate = cloneDate(today)
    switch (value) {
      case "6m":
        startDate = addMonths(today, -6)
        break
      case "1m":
        startDate = addMonths(today, -1)
        break
      case "3m":
        startDate = addMonths(today, -3)
        break
      case "1w":
        startDate = addDays(today, -7)
        break
      default:
        startDate = cloneDate(today)
    }

    setRangeStart(startDate)
    setRangeEnd(cloneDate(today))
  }

  const formatDateDisplay = (date: Date | null) => {
    if (!date) return "-"
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}.${month}.${day}`
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        pageTitle="마이페이지"
      />

      <div className="flex">
        <Sidebar
          currentPage="profile"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-6">
          {isLoading ? (
            <>
              <div className="hidden sm:flex sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-60" />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {profileTabs.map((_, index) => (
                  <Skeleton key={index} className="h-10 w-24 flex-shrink-0 rounded-full" />
                ))}
              </div>

              <Card className="rounded-2xl border border-transparent bg-[#f5f7fa] shadow-none py-6 sm:py-6">
                <CardHeader className="items-center space-y-3 pb-2 text-center">
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-5 w-40" />
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-center gap-3 pb-0 pt-1">
                  <Skeleton className="h-8 w-28 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </CardContent>
              </Card>

              <Card className="rounded-2xl border shadow-none py-6 sm:py-8">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-28" />
                </CardHeader>
                <CardContent className="space-y-5 pt-0">
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:text-left">
                    <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:justify-start">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-12 w-[180px] rounded-xl" />
                    </div>
                    <div className="flex items-center gap-3 text-lg font-semibold text-gray-900 sm:ml-2">
                      <Skeleton className="h-8 w-12" />
                      <div className="flex flex-col items-center sm:items-start">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="mt-1 h-4 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-12 w-full rounded-xl sm:w-32" />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border shadow-none py-6 sm:py-8">
                <CardHeader className="gap-3 pb-4">
                  <div className="flex items-center justify-between gap-3 sm:hidden">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-10 w-24 rounded-lg" />
                  </div>
                  <div className="hidden sm:flex sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-lg" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {filterTabs.map((_, index) => (
                      <Skeleton key={index} className="h-9 w-20 rounded-full" />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>

                  <div className="divide-y rounded-2xl border border-gray-200 bg-white">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">마이페이지</h1>
                  <p className="mt-1 text-sm text-muted-foreground">충전과 이용내역을 관리하세요</p>
                </div>
              </div>

              <ScrollableTabs tabs={profileTabs} />

              <Card className="rounded-2xl border border-transparent bg-[#f5f7fa] shadow-none gap-0 py-6 sm:py-6">
                <CardHeader className="items-center pb-2 text-center">
                  <CardTitle className="flex items-center justify-center gap-2 text-2xl font-semibold text-gray-900 sm:text-[24px]">
                    <Image src="/icons/icon-mineral-sm.png" alt="미네랄" width={24} height={24} />
                    {totalMineral.toLocaleString()} {mineralUnitLabel}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap items-center justify-center gap-2 pb-0 pt-1 text-base font-semibold">
                  <Badge className="rounded-full border-0 bg-[#eaf1ff] px-4 py-1 text-sm font-semibold text-[#2f5bd3]">
                    충전 {totalCharged.toLocaleString()}
                  </Badge>
                  <Badge className="rounded-full border-0 bg-[#e5f7ec] px-4 py-1 text-sm font-semibold text-[#1f9d55]">
                    적립 {totalEarned.toLocaleString()}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border shadow-none gap-2 py-6 sm:py-8">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold">미네랄 충전</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-0">
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:text-left">
                    <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:justify-start">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 sm:text-base">
                        <Image
                          src="/icons/icon-mineral-sm.png"
                          alt="미네랄"
                          width={24}
                          height={24}
                          className="h-5 w-5 sm:h-6 sm:w-6"
                        />
                        <span>미네랄</span>
                      </div>
                      <Select value={selectedPackage.value} onValueChange={handleSelectPackage}>
                        <SelectTrigger className="h-12 w-[180px] border-gray-300 sm:w-[200px]">
                          <SelectValue>
                            {(selectedPackage.mineral + (selectedPackage.bonus ?? 0)).toLocaleString()} {mineralUnitLabel}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {mineralPackages.map((item) => {
                            const totalMineral = item.mineral + (item.bonus ?? 0)
                            return (
                              <SelectItem key={item.value} value={item.value}>
                                <div className="flex w-full items-center justify-between gap-3">
                                  <span>{totalMineral.toLocaleString()} {mineralUnitLabel}</span>
                                  {item.bonus ? (
                                    <span className="text-xs font-medium text-emerald-500">
                                      + {item.bonus.toLocaleString()} {mineralUnitLabel}
                                    </span>
                                  ) : null}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-3 text-lg font-semibold text-gray-900 sm:ml-2">
                      <span className="leading-none">=</span>
                      <div className="flex flex-col items-center">
                        <span className="leading-none">₩{selectedPackage.price.toLocaleString()}</span>
                        <p className="mt-1 text-xs font-medium text-primary">10% 추가적립</p>
                      </div>
                    </div>

                    <Button
                      className="h-12 w-full rounded-xl sm:w-auto sm:px-8"
                      onClick={() => {
                        setAgreementChecked(false)
                        setIsChargeDialogOpen(true)
                      }}
                    >
                      충전하기
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border shadow-none gap-2 py-6 sm:py-8">
                <CardHeader className="gap-3 pb-4">
                  <div className="flex items-center justify-between gap-3 sm:hidden">
                    <CardTitle className="text-xl font-semibold">이용내역</CardTitle>
                    <Button variant="outline" className="h-10 gap-2 rounded-lg border-gray-300 shadow-none" onClick={() => setIsDateDialogOpen(true)}>
                      <Calendar className="h-4 w-4" />
                      조회 기간
                    </Button>
                  </div>
                  <div className="hidden sm:flex sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-xl font-semibold">이용내역</CardTitle>
                      <p className="text-sm text-muted-foreground">미네랄 사용 · 적립 · 충전 내역을 확인하세요</p>
                    </div>
                    <Button variant="outline" className="h-10 gap-2 rounded-lg border-gray-300 shadow-none" onClick={() => setIsDateDialogOpen(true)}>
                      <Calendar className="h-4 w-4" />
                      조회 기간
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {filterTabs.map((tab) => (
                      <Button
                        key={tab}
                        variant={tab === activeHistoryTab ? "default" : "outline"}
                        className={cn(
                          "h-9 rounded-full px-5 text-sm shadow-none",
                          tab === activeHistoryTab
                            ? "bg-gray-900 text-white hover:bg-gray-800"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        )}
                        onClick={() => setActiveHistoryTab(tab)}
                      >
                        {tab}
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">총 {displayedHistory.length.toString().padStart(2, "0")}건</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs text-muted-foreground hover:text-gray-900"
                      onClick={() => setForceEmptyHistory((prev) => !prev)}
                    >
                      {forceEmptyHistory ? "내역 보기" : "빈 상태 보기"}
                    </Button>
                  </div>

                  {displayedHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-gray-200 bg-white p-12">
                      <div className="relative h-16 w-16">
                        <Image src="/icons/icon-default.png" alt="데이터 없음" fill className="object-contain" />
                      </div>
                      <div className="space-y-2 text-center">
                        <h3 className="text-lg font-semibold text-gray-900">이용내역이 없습니다</h3>
                        <p className="text-sm text-muted-foreground">아직 이용내역이 없습니다.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="divide-y rounded-2xl border border-gray-200 bg-white">
                      {displayedHistory.map((item) => (
                        <div key={item.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base font-semibold text-gray-900">{item.title}</span>
                              <Badge variant="outline" className="h-6 rounded-full border-gray-200 px-2 text-xs text-gray-600">
                                {item.category}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {item.date} · {item.time}
                            </span>
                            {item.note ? <span className="text-xs text-muted-foreground">{item.note}</span> : null}
                          </div>
                          <div
                            className={cn(
                              "text-right text-base font-semibold",
                              item.amount > 0 ? "text-emerald-500" : item.amount < 0 ? "text-red-500" : "text-gray-900"
                            )}
                          >
                            {item.amount > 0 ? "+" : ""}
                            {item.amount.toLocaleString()} {mineralUnitLabel}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </main>
      </div>

      <Dialog open={isChargeDialogOpen} onOpenChange={setIsChargeDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">충전하기</DialogTitle>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center justify-between">
                <span>결제 상품</span>
                <span className="font-semibold text-gray-900">
                  {(selectedPackage.mineral + (selectedPackage.bonus ?? 0)).toLocaleString()} {mineralUnitLabel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>결제 금액</span>
                <span className="text-base font-semibold text-primary">
                  ₩{selectedPackage.price.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                <span className="block">결제 수단</span>
                <Button variant="outline" className="w-full justify-start gap-2 rounded-lg border-dashed border-gray-300 text-sm text-gray-600">
                  + 카드 등록하기
                </Button>
                <p className="text-xs text-muted-foreground">등록된 카드가 없습니다.</p>
              </div>
            </div>

            <Separator />

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Checkbox checked={agreementChecked} onCheckedChange={(value) => setAgreementChecked(Boolean(value))} />
              위의 결제 진행에 동의합니다.
            </label>
          </div>

          <DialogFooter className="mt-4 flex flex-row gap-2">
            <Button variant="ghost" className="flex-1 h-11 rounded-lg border border-gray-200" onClick={() => setIsChargeDialogOpen(false)}>
              취소
            </Button>
            <Button
              className="flex-1 h-11 rounded-lg bg-gray-900 hover:bg-gray-800"
              disabled={!agreementChecked}
              onClick={() => {
                setIsChargeDialogOpen(false)
                setAgreementChecked(false)
                setIsChargeSuccessOpen(true)
              }}
            >
              결제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isChargeSuccessOpen} onOpenChange={setIsChargeSuccessOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[420px]">
          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center gap-2 text-xl font-semibold text-gray-900">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              충전이 완료되었어요
            </DialogTitle>
            <DialogDescription className="text-center">충전내역은 이용내역에서 확인가능합니다.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-5 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">결제 상품</span>
              <span className="font-semibold text-gray-900">
                {(selectedPackage.mineral + (selectedPackage.bonus ?? 0)).toLocaleString()} {mineralUnitLabel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">결제 금액</span>
              <span className="font-semibold text-primary">
                ₩{selectedPackage.price.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">결제 수단</span>
              <span className="font-medium text-gray-900">등록된 카드</span>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button className="w-full h-11 rounded-lg" onClick={() => setIsChargeSuccessOpen(false)}>
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">조회 기간 선택</DialogTitle>
            <DialogDescription>원하는 기간을 선택해 이용내역을 조회하세요.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2">
              {quickRanges.map((range) => (
                <Button
                  key={range.value}
                  variant={range.value === activeQuickRange ? "default" : "outline"}
                  className={cn(
                    "h-10 flex-1 rounded-lg shadow-none",
                    range.value === activeQuickRange
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  )}
                  onClick={() => handleQuickRangeSelect(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>

            <div className="w-full">
              <CustomDatePicker
                selectRange
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onRangeChange={(start, end) => {
                  setRangeStart(start)
                  setRangeEnd(end)
                }}
                size="compact"
                placeholder="시작일 - 종료일 선택"
                className="w-full"
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button className="h-11 w-full rounded-lg" onClick={() => setIsDateDialogOpen(false)}>
              조회하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

