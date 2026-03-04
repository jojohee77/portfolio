"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import { ArrowLeft, AlertCircle, Building, CreditCard, PlusCircle, Trash2 } from "lucide-react"

import Header from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

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

export default function MembershipPaymentPage() {
  const router = useRouter()
  const params = useParams<{ cycle?: string; level?: string }>()

  const normalizedCycle: CycleType =
    params?.cycle?.toLowerCase() === "annual" ? "annual" : "monthly"

  const normalizedLevel: LevelType =
    (params?.level?.toUpperCase() as LevelType) in PLAN_DETAILS ? (params?.level?.toUpperCase() as LevelType) : "BASIC"

  const planDetail = PLAN_DETAILS[normalizedLevel]
  const cycleLabel = normalizedCycle === "annual" ? "연간" : "월간"

  const priceValue = normalizedCycle === "annual" ? planDetail.annualPrice : planDetail.monthlyPrice
  const discountLabel = normalizedCycle === "annual" ? planDetail.annualDiscount : planDetail.monthlyDiscount

  const totalPriceLabel = useMemo(() => {
    if (normalizedCycle === "annual") {
      return `${formatCurrency(priceValue * 12)} /년`
    }
    return `${formatCurrency(priceValue)} /월`
  }, [normalizedCycle, priceValue])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card")
  const [selectedCard, setSelectedCard] = useState("bc-card")
  const [bankDepositor, setBankDepositor] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeRecurring, setAgreeRecurring] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  const isSubmitDisabled =
    !agreeTerms ||
    !agreePrivacy ||
    !agreeRecurring ||
    (paymentMethod === "card" && !selectedCard) ||
    (paymentMethod === "bank" && !bankDepositor)

  const handleGoBack = () => {
    router.back()
  }

  const handleDeleteCard = () => {
    setSelectedCard("")
    setIsDeleteDialogOpen(false)
  }

  const renderSavedCard = () => {
    if (!selectedCard) {
      return (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">등록된 카드가 없습니다</p>
          <Button type="button" variant="outline" className="w-full border-dashed text-muted-foreground hover:text-primary">
            <PlusCircle className="mr-2 h-4 w-4" />
            카드 등록하기
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        <Label className="text-sm text-muted-foreground">등록된 카드 선택</Label>
        <RadioGroup value={selectedCard} onValueChange={setSelectedCard} className="space-y-2">
          <label
            htmlFor="saved-bc-card"
            className={`flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 text-sm transition ${
              selectedCard === "bc-card"
                ? "border-primary bg-primary/5"
                : "border-gray-200 bg-white hover:border-primary/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="bc-card" id="saved-bc-card" className="sr-only" />
              <span
                className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                  selectedCard === "bc-card" ? "border-primary bg-primary" : "border-gray-300"
                }`}
              />
              <span className="text-sm font-medium text-foreground">BC 4906 **** **** 724*</span>
            </div>
            <AlertDialogPrimitive.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogPrimitive.Trigger asChild>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsDeleteDialogOpen(true)
                  }}
                  className="text-muted-foreground transition hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </AlertDialogPrimitive.Trigger>
              <AlertDialogPrimitive.Portal>
                <AlertDialogPrimitive.Overlay className="fixed inset-0 z-[120] bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
                <AlertDialogPrimitive.Content
                className="fixed left-1/2 top-1/2 z-[130] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 duration-200 data-[state=open]:animate-in data-[state=open]:zoom-in-90 data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 sm:max-w-lg"
                >
                  <AlertDialogPrimitive.Title className="text-lg font-semibold">카드 삭제</AlertDialogPrimitive.Title>
                  <AlertDialogPrimitive.Description className="text-sm text-muted-foreground">
                    BC 49060327****724* 카드를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  </AlertDialogPrimitive.Description>
                  <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <AlertDialogPrimitive.Cancel asChild>
                      <Button variant="outline" type="button">
                        취소
                      </Button>
                    </AlertDialogPrimitive.Cancel>
                    <AlertDialogPrimitive.Action asChild>
                      <Button
                        type="button"
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={handleDeleteCard}
                      >
                        삭제
                      </Button>
                    </AlertDialogPrimitive.Action>
                  </div>
                </AlertDialogPrimitive.Content>
              </AlertDialogPrimitive.Portal>
            </AlertDialogPrimitive.Root>
          </label>
        </RadioGroup>
        <Button type="button" variant="outline" className="w-full border-dashed text-muted-foreground hover:text-primary">
          <PlusCircle className="mr-2 h-4 w-4" />
          다른 카드 등록하기
        </Button>
      </div>
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const totalAmount = normalizedCycle === "annual" ? planDetail.annualPrice * 12 : planDetail.monthlyPrice
    router.push(
      `/membership/payment/complete?cycle=${normalizedCycle}&level=${normalizedLevel}&method=${paymentMethod}&total=${totalAmount}`
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="멤버십 결제"
        pageDescription="선택한 멤버십을 결제하고 서비스를 바로 이용해 보세요."
      />

      <div className="flex">
        <Sidebar
          currentPage="membership"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 pb-24 sm:p-4 sm:pb-36 lg:p-6 lg:pb-48">
          {isLoading ? (
            <div className="mx-auto w-full max-w-6xl space-y-6">
              <div className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-28 max-sm:w-24" />
                  <Skeleton className="h-4 w-40 max-sm:w-32" />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                <div className="space-y-6">
                  <Card className="border border-gray-200 bg-white">
                    <CardHeader className="space-y-3 pb-4 pt-5">
                      <Skeleton className="h-5 w-28 max-sm:w-24" />
                      <Skeleton className="h-4 w-48 max-sm:w-40" />
                    </CardHeader>
                    <CardContent className="space-y-5 pb-6">
                      {[...Array(2)].map((_, index) => (
                        <div key={index} className="rounded-2xl border border-gray-200 bg-muted/5 p-4 sm:p-5 space-y-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-4 w-28 max-sm:w-24" />
                          </div>
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200 bg-white">
                    <CardHeader className="space-y-3 pb-4 pt-5">
                      <Skeleton className="h-5 w-28 max-sm:w-24" />
                      <Skeleton className="h-4 w-52 max-sm:w-44" />
                    </CardHeader>
                    <CardContent className="space-y-4 pb-6">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-muted/5 p-4 sm:flex-row sm:items-start">
                          <Skeleton className="h-5 w-5 rounded-md flex-shrink-0" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-32 max-sm:w-24" />
                            <Skeleton className="h-3 w-48 max-sm:w-40" />
                          </div>
                          <Skeleton className="h-4 w-16 ml-auto hidden sm:block" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>

                <aside className="space-y-6">
                  <Card className="border border-gray-200 bg-white lg:sticky lg:top-6">
                    <CardHeader className="space-y-3 pb-4 pt-5">
                      <Skeleton className="h-5 w-28 max-sm:w-24" />
                      <Skeleton className="h-4 w-48 max-sm:w-36" />
                    </CardHeader>
                    <CardContent className="space-y-5 pb-6">
                      <div className="space-y-3 rounded-xl border border-gray-200 bg-muted/5 p-4">
                        <Skeleton className="h-4 w-32 max-sm:w-28" />
                        <Skeleton className="h-4 w-28 max-sm:w-24" />
                        <Skeleton className="h-4 w-20 max-sm:w-16" />
                      </div>
                      <Separator className="bg-gray-200" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-40 max-sm:w-32" />
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </div>
                      <Skeleton className="h-12 w-full rounded-xl" />
                    </CardContent>
                  </Card>
                </aside>
              </div>
            </div>
          ) : (
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={handleGoBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold sm:text-2xl">결제하기</h1>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"
            >
              <div className="space-y-6">
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="space-y-2 pb-4 pt-5">
                  <CardTitle className="text-lg font-semibold">결제 수단</CardTitle>
                  <CardDescription>원하시는 결제 수단을 선택하고 정보를 입력해 주세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pb-6">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) => setPaymentMethod(value as "card" | "bank")}
                  className="space-y-4"
                >
                  <label
                    htmlFor="method-card"
                    className={`block cursor-pointer rounded-2xl border px-5 py-5 transition ${
                      paymentMethod === "card"
                        ? "border-primary"
                        : "border-gray-200 hover:border-primary/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                      <RadioGroupItem value="card" id="method-card" className="sr-only" />
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        신용/체크카드
                      </div>
                    </div>
                    {paymentMethod === "card" && (
                      <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                        {renderSavedCard()}
                        <div className="rounded-lg bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
                          카드 등록 및 변경은 결제 진행 시 연결되는 결제 창에서 완료할 수 있습니다.
                        </div>
                      </div>
                    )}
                  </label>

                  <label
                    htmlFor="method-bank"
                    className={`block cursor-pointer rounded-2xl border px-5 py-5 transition ${
                      paymentMethod === "bank"
                        ? "border-primary"
                        : "border-gray-200 hover:border-primary/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 text-sm font-medium text-foreground">
                      <RadioGroupItem value="bank" id="method-bank" className="sr-only" />
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        무통장 입금
                      </div>
                    </div>
                    {paymentMethod === "bank" && (
                      <div className="mt-4 space-y-4 border-t border-gray-200 pt-4">
                        <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4">
                          <AlertCircle className="h-5 w-5 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            입금 확인 후 담당자가 멤버십을 활성화합니다. 입금 후 1영업일 이내 처리됩니다.
                          </p>
                        </div>
                        <div className="space-y-3 text-sm">
                          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                            <span className="text-muted-foreground">입금 계좌</span>
                            <span className="font-medium text-foreground">국민은행 123-456-789012</span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
                            <span className="text-muted-foreground">예금주</span>
                            <span className="font-medium text-foreground">(주)AgOffice</span>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="bank-depositor">입금자명</Label>
                            <Input
                              id="bank-depositor"
                              placeholder="입금자명을 입력해주세요"
                              value={bankDepositor}
                              onChange={(event) => setBankDepositor(event.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </label>
                </RadioGroup>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 bg-white">
                <CardHeader className="space-y-2 pb-4 pt-5">
                  <CardTitle className="text-lg font-semibold">약관 동의</CardTitle>
                  <CardDescription>모든 필수 항목에 동의해야 결제가 가능합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-6">
                  <label
                    htmlFor="agree-terms"
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-muted/5 p-4"
                  >
                    <Checkbox
                      id="agree-terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(!!checked)}
                    />
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-foreground">이용약관 동의 (필수)</span>
                      <p className="text-xs text-muted-foreground">서비스 이용약관에 동의합니다.</p>
                    </div>
                    <Button type="button" variant="link" className="ml-auto px-0 text-xs text-primary">
                      자세히 보기
                    </Button>
                  </label>

                  <label
                    htmlFor="agree-privacy"
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-muted/5 p-4"
                  >
                    <Checkbox
                      id="agree-privacy"
                      checked={agreePrivacy}
                      onCheckedChange={(checked) => setAgreePrivacy(!!checked)}
                    />
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-foreground">개인정보 수집 및 이용 동의 (필수)</span>
                      <p className="text-xs text-muted-foreground">개인정보 수집 및 이용에 동의합니다.</p>
                    </div>
                    <Button type="button" variant="link" className="ml-auto px-0 text-xs text-primary">
                      자세히 보기
                    </Button>
                  </label>

                  <label
                    htmlFor="agree-recurring"
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-muted/5 p-4"
                  >
                    <Checkbox
                      id="agree-recurring"
                      checked={agreeRecurring}
                      onCheckedChange={(checked) => setAgreeRecurring(!!checked)}
                    />
                    <div className="space-y-1">
                      <span className="text-sm font-semibold text-foreground">정기결제 동의 (필수)</span>
                      <p className="text-xs text-muted-foreground">
                        멤버십은 매월/매년 자동 결제되며, 언제든지 해지할 수 있습니다.
                      </p>
                    </div>
                  </label>
                </CardContent>
              </Card>

              <Button
                type="submit"
                disabled={isSubmitDisabled}
                className="h-12 w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                결제하기
              </Button>
            </div>

            <aside className="space-y-6">
              <Card className="sticky top-6 border border-gray-200 bg-white">
                <CardHeader className="space-y-2 pb-4 pt-5">
                  <CardTitle className="text-lg font-semibold">결제 정보</CardTitle>
                  <CardDescription>선택한 플랜의 정보를 다시 한 번 확인해 주세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pb-6">
                  <div className="space-y-3 rounded-xl border border-gray-200 bg-muted/5 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">선택한 플랜</span>
                      <span className="font-medium text-foreground">{planDetail.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">결제 주기</span>
                      <span className="font-medium text-foreground">{cycleLabel}</span>
                    </div>
                    {discountLabel && (
                      <div className="flex items-center justify-between text-sm font-semibold text-primary">
                        <span>할인 혜택</span>
                        <span>{discountLabel}</span>
                      </div>
                    )}
                  </div>

                  <Separator className="bg-gray-200" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>총 결제 금액</span>
                      <span className="text-primary">{totalPriceLabel}</span>
                    </div>
                    <p className="text-right text-xs text-muted-foreground">부가세 포함</p>
                  </div>

                  {normalizedCycle === "annual" && (
                    <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-sm text-primary">
                      연간 결제 시 월 {formatCurrency(priceValue)} 혜택과 2개월 무료 제공!
                    </div>
                  )}

                </CardContent>
              </Card>
            </aside>
          </form>
        </div>
          )}
        </main>
      </div>
    </div>
  )
}

