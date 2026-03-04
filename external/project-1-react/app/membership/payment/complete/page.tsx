"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import confetti from "canvas-confetti"

import Header from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type CycleType = "monthly" | "annual"
type LevelType = "BASIC" | "STANDARD" | "PREMIUM"

interface PlanDetail {
  name: string
  monthlyPrice: number
  annualPrice: number
  monthlyDiscount?: string
  annualDiscount?: string
}

const PLAN_DETAILS: Record<LevelType, PlanDetail> = {
  BASIC: {
    name: "베이직",
    monthlyPrice: 12600,
    annualPrice: 10500,
    monthlyDiscount: "60%",
    annualDiscount: "67%"
  },
  STANDARD: {
    name: "스탠다드",
    monthlyPrice: 15600,
    annualPrice: 13000,
    monthlyDiscount: "67%",
    annualDiscount: "72%"
  },
  PREMIUM: {
    name: "프리미엄",
    monthlyPrice: 58800,
    annualPrice: 49000,
    monthlyDiscount: "66%",
    annualDiscount: "71%"
  }
}

const formatCurrency = (value: number) => `₩${value.toLocaleString("ko-KR")}원`

export default function PaymentCompletePage() {
  const searchParams = useSearchParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [shouldCelebrate, setShouldCelebrate] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setShouldCelebrate(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!shouldCelebrate) return
    confetti({
      particleCount: 120,
      startVelocity: 45,
      spread: 320,
      ticks: 120,
      gravity: 0.9,
      origin: { x: 0.5, y: 0.4 },
      scalar: 1.1,
      zIndex: 9999
    })
  }, [shouldCelebrate])

  const cycleParam = (searchParams.get("cycle") as CycleType) || "monthly"
  const levelParam = (searchParams.get("level") as LevelType) || "BASIC"
  const methodParam = searchParams.get("method") || "card"
  const totalParam = Number(searchParams.get("total") ?? "0")

  const planDetail = PLAN_DETAILS[levelParam] ?? PLAN_DETAILS.BASIC

  const isBankTransfer = methodParam === "bank"
  const methodLabel = isBankTransfer ? "무통장 입금" : "신용/체크카드"
  const cycleLabel = cycleParam === "annual" ? "연간 결제" : "월간 결제"

  const totalAmount = useMemo(() => {
    if (totalParam > 0) {
      return totalParam
    }
    return cycleParam === "annual" ? planDetail.annualPrice * 12 : planDetail.monthlyPrice
  }, [totalParam, cycleParam, planDetail])

  const monthlyEquivalent =
    cycleParam === "annual" ? `월 ${formatCurrency(planDetail.annualPrice)}` : formatCurrency(planDetail.monthlyPrice)

  const mainIcon = isBankTransfer ? "/icons/icon-chk.png" : "/icons/icon-congratulations.png"
  const mainIconAlt = isBankTransfer ? "신청 완료 아이콘" : "축하 아이콘"
  const mainTitle = isBankTransfer ? "무통장입금 신청이 완료됐습니다" : "결제가 완료되었습니다!"
  const mainDescription = isBankTransfer
    ? "입금 후 관리자 확인 시 서비스가 활성화됩니다."
    : "선택하신 플랜이 즉시 활성화되며, 결제 내역은 마이페이지에서 확인할 수 있습니다."
  const mainIconClass = isBankTransfer ? "h-16 w-16" : "h-20 w-20 animate-float"
  const mainIconSize = isBankTransfer ? 64 : 80

  const descriptionLine = isBankTransfer
    ? "입금 후 관리자 확인 시 서비스가 활성화됩니다."
    : "선택하신 플랜이 즉시 활성화되며, 결제 내역은 마이페이지에서 확인할 수 있습니다."

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
          pageTitle="결제 완료"
          pageDescription="결제 정보를 확인하는 중입니다."
        />

        <div className="flex">
          <Sidebar
            currentPage="membership"
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          />

          <main className="flex-1 p-3 pb-24 sm:p-4 sm:pb-36 lg:p-6 lg:pb-48">
            <div className="flex h-full items-center justify-center rounded-3xl bg-muted/10 px-4 py-12">
              <div className="w-full max-w-xl">
                <Card className="border border-border rounded-3xl">
                  <CardContent className="px-5 py-10 sm:px-8">
                    <div className="flex flex-col items-center gap-6 text-center">
                      <Skeleton className="h-20 w-20 rounded-full" />
                      <div className="space-y-3 w-full">
                        <Skeleton className="h-7 w-3/4 mx-auto max-sm:w-full" />
                        <Skeleton className="h-4 w-full max-sm:w-5/6 mx-auto" />
                      </div>

                      <Card className="w-full border border-gray-200 bg-muted/10">
                        <CardHeader className="pb-0 pt-5 text-left space-y-3">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </CardHeader>
                        <CardContent className="space-y-4 pb-5 pt-4">
                          {[...Array(4)].map((_, index) => (
                            <div key={index} className="flex items-center justify-between gap-4 text-sm">
                              <Skeleton className="h-3.5 w-24" />
                              <Skeleton className="h-3.5 w-28" />
                            </div>
                          ))}
                          <div className="border-t border-gray-200 pt-4">
                            <Skeleton className="h-5 w-32" />
                          </div>
                        </CardContent>
                      </Card>

                      <Skeleton className="h-12 w-full rounded-xl sm:w-[200px]" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        pageTitle="결제 완료"
        pageDescription="결제가 정상적으로 처리되었습니다."
      />

      <div className="flex">
        <Sidebar
          currentPage="membership"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        />

        <main className="flex-1 p-3 pb-24 sm:p-4 sm:pb-36 lg:p-6 lg:pb-48">
          <div className="flex h-full items-center justify-center rounded-3xl bg-muted/10 px-4 py-12">
            <div className="w-full max-w-xl">
              <Card className="border border-border rounded-3xl">
                <CardContent className="px-5 py-10 text-center space-y-8 sm:px-8">
                  <div className="space-y-4">
                    <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                      <Image src={mainIcon} alt={mainIconAlt} width={mainIconSize} height={mainIconSize} className={mainIconClass} priority />
                    </div>
                    <div className="space-y-3">
                      <h1 className="sm:text-3xl text-xl font-bold text-foreground ">{mainTitle}</h1>
                      <p className="text-sm text-muted-foreground">{descriptionLine}</p>
                    </div>
                  </div>

                  <Card className="border border-gray-200 bg-muted/10">
                    <CardHeader className="pb-0 pt-5 text-left">
                      <CardTitle className="text-base font-semibold">결제 정보</CardTitle>
                      <CardDescription className="text-xs">
                        결제 수단과 금액을 확인해 주세요.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-5 pt-4 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">플랜 이름</span>
                        <span className="font-medium text-foreground">{planDetail.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">결제 수단</span>
                        <span className="font-medium text-foreground">{methodLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">결제 주기</span>
                        <span className="font-medium text-foreground">{cycleLabel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">월 환산 금액</span>
                        <span className="font-medium text-foreground">{monthlyEquivalent}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base font-semibold">
                        <span>총 결제 금액</span>
                        <span className="text-primary">{formatCurrency(totalAmount)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Button asChild className="h-12 w-full rounded-xl sm:w-[200px]">
                      <Link href={isBankTransfer ? "/membership" : "/dashboard"}>
                        확인
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}