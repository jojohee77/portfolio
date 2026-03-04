"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { InquiryModal } from "@/components/ui/inquiry-modal"

interface PaymentInfo {
  ulevel: {
    ulevel_nm: string
    ulevel_desc: string
    paid_level_yn: string
    monthly_price: number
    annual_price: number
    next_pay_yyyymmdd: string
    pay_yyyymmdd: string
    pay_period: string
    pay_cancel_yn: string
  }
  card: {
    card_company: string
    card_number: string
  } | null
}

export default function MembershipPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAnnual, setIsAnnual] = useState(false)
  const [showInquiryDialog, setShowInquiryDialog] = useState(false)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleSubscribe = (planIndex: number) => {
    const cycle = isAnnual ? "annual" : "monthly"
    if (planIndex === 0) {
      router.push(`/membership/payment/${cycle}/BASIC`)
    } else if (planIndex === 1) {
      router.push(`/membership/payment/${cycle}/STANDARD`)
    } else if (planIndex === 2) {
      router.push(`/membership/payment/${cycle}/PREMIUM`)
    }
  }

  const handleSubmitInquiry = () => {
    console.log("문의하기 완료")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          pageTitle="멤버십 안내"
          pageDescription="AgOffice의 다양한 멤버십 플랜을 확인하고 선택하세요"
          hideMobileDescription
        />

        <div className="flex">
          <Sidebar
            currentPage="membership"
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-6">
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="text-center space-y-6">
                <div className="flex justify-center mt-6 mb-6">
                  <Skeleton className="h-14 w-40 rounded-xl" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-64 mx-auto" />
                  <Skeleton className="h-4 w-72 mx-auto" />
                  <Skeleton className="h-4 w-48 mx-auto" />
                </div>
                <div className="flex items-center justify-center mt-8">
                  <Skeleton className="h-10 w-56 rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 max-[966px]:grid-cols-1 min-[967px]:grid-cols-2 min-[1201px]:grid-cols-3 min-[1501px]:grid-cols-4 gap-6 mt-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Card key={index} className="rounded-2xl border shadow-none flex flex-col">
                    <CardHeader className="space-y-3 pt-8 pb-6">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-8 w-28" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow pb-6">
                      <Separator />
                      <Skeleton className="h-4 w-20" />
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((__, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="mt-auto pt-6 pb-8">
                      <Skeleton className="h-11 w-full rounded-lg" />
                    </CardFooter>
                  </Card>
                ))}
              </div>

              <div className="space-y-4">
                <Skeleton className="h-7 w-40" />
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="h-4 w-full mt-3" />
                      <Skeleton className="h-4 w-3/4 mt-2" />
                    </div>
                  ))}
                </div>
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
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="멤버십 안내"
        pageDescription="AgOffice의 다양한 멤버십 플랜을 확인하고 선택하세요"
        hideMobileDescription
      />

      <div className="flex">
        <Sidebar 
          currentPage="membership" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-6">
              <div className="hidden sm:flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">멤버십 안내</h1>
                  <p className="text-sm text-muted-foreground mt-1">AgOffice의 다양한 멤버십 플랜을 확인하고 선택하세요</p>
                </div>
              </div>

              <section className="flex flex-col gap-6 max-w-none">
                <div className="text-center space-y-6">
                  <div className="flex justify-center mt-6 mb-6">
                    <Image src="/logo-main.png" alt="AgOffice" width={180} height={58} priority />
                  </div>
                  <p className="text-md lg:text-xl dark:text-gray-300">
                    AI 통합 마케팅 솔루션 <br />
                    {isAnnual ? "지금 연간결제하면 최대" : "지금 월간결제하면 최대"}{" "}
                    <span className="text-primary font-bold">{isAnnual ? "72% 🎉" : "67% 🎉"}</span> 할인된{" "}
                    <br className="md:hidden" /> 가격으로!
                  </p>

                  <div className="flex items-center justify-center mt-8">
                    <div className="relative flex items-center">
                      <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                        <button
                          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                            !isAnnual ? "bg-primary text-primary-foreground shadow-md" : "dark:text-gray-300 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600"
                          }`}
                          onClick={() => setIsAnnual(false)}
                        >
                          월간
                        </button>
                        <button
                          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                            isAnnual ? "bg-primary text-primary-foreground shadow-md" : "dark:text-gray-300 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600"
                          }`}
                          onClick={() => setIsAnnual(true)}
                        >
                          연간
                        </button>
                      </div>
                      {isAnnual && (
                        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 text-primary font-medium whitespace-nowrap text-sm sm:text-base">
                          2개월 무료
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 max-[966px]:grid-cols-1 min-[967px]:grid-cols-2 min-[1201px]:grid-cols-3 min-[1501px]:grid-cols-4 gap-6 mt-4">
                  <Card className="dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white relative overflow-hidden flex flex-col">
                    <CardHeader className="pt-8 pb-6">
                      <CardTitle className="dark:text-white text-gray-900">무료</CardTitle>
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold dark:text-white text-gray-900">Free</span>
                      </div>
                      <CardDescription className="mt-2">
                        누구나 무료로 AgOffice의 다양한 기능을 14일간 <br /> 이용할 수 있습니다.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow pb-6">
                      <Separator className="bg-gray-200 dark:bg-[#333333]" />
                      <div className="text-sm font-medium mb-4">주요 기능</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>
                            체험용 20 미네랄 제공 <strong className="font-semibold">(14일 유효)</strong>
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>워크스페이스 1개 등록</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>
                            전체 메뉴 활성화 (키워드 순위는 별도)<br />
                            <span className="text-xs text-muted-foreground">
                              대시보드 · 계약현황 · 업무현황 · 키워드 분석 · 포스팅 관리 · 조직관리
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>AI 챗봇 통합 분석 제공</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto pt-6 pb-8">
                      {paymentInfo?.ulevel?.paid_level_yn === "N" ? (
                        <Button className="w-full dark:bg-[#444] bg-gray-200 dark:hover:bg-[#555] hover:bg-gray-300 dark:text-white text-gray-700" disabled>
                          이용중
                        </Button>
                      ) : (
                        <Button className="w-full dark:bg-[#444] bg-gray-200 dark:hover:bg-[#555] hover:bg-gray-300 dark:text-white text-gray-700" disabled>
                          이용완료
                        </Button>
                      )}
                    </CardFooter>
                  </Card>

                  <Card className="dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white relative overflow-hidden flex flex-col">
                    <Badge className="absolute right-0 top-0 bg-secondary text-primary text-sm border-none px-4 py-2 rounded-none rounded-bl-lg pointer-events-none cursor-default select-none">
                      {isAnnual ? "67%" : "60%"}
                    </Badge>
                    <CardHeader className="pt-8 pb-6">
                      <CardTitle className="dark:text-white text-gray-900">베이직</CardTitle>
                      <div className="flex flex-col">
                        <span className="text-lg line-through text-gray-400">₩{isAnnual ? "32,000" : "32,000"}</span>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold dark:text-white text-gray-900">₩{isAnnual ? "10,500" : "12,600"}원</span>
                          <span className="text-gray-600 dark:text-gray-300 ml-1 text-sm">/월 VAT포함</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow pb-6">
                      <Separator className="bg-gray-200 dark:bg-[#333333]" />
                      <div className="text-sm font-medium mt-4 mb-2">주요 기능</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>매월 100 미네랄 충전</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>워크스페이스 1개 등록</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>
                            전체 메뉴 활성화 (키워드 순위는 별도)<br />
                            <span className="text-xs text-muted-foreground">
                              대시보드 · 계약현황 · 업무현황 · 키워드 분석 · 포스팅 관리 · 조직관리
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>AI 챗봇 통합 분석 제공</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto pt-6 pb-8">
                      {paymentInfo?.ulevel?.paid_level_yn === "Y" && paymentInfo?.ulevel?.ulevel_nm?.includes("베이직") ? (
                        <Button className="w-full dark:bg-[#444] bg-gray-200 dark:hover:bg-[#555] hover:bg-gray-300 dark:text-white text-gray-700" disabled>
                          이용중
                        </Button>
                      ) : (
                        <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white h-[46px] rounded-lg" onClick={() => handleSubscribe(0)} disabled={paymentInfo?.ulevel?.paid_level_yn === "Y"}>
                          멤버십 이용하기
                        </Button>
                      )}
                    </CardFooter>
                  </Card>

                  <Card className="dark:border-gray-600 border-gray-600 dark:bg-[#333333] bg-white relative overflow-hidden flex flex-col border">
                    <Badge className="absolute right-0 top-0 bg-secondary text-primary text-sm border-none px-4 py-2 rounded-none rounded-bl-lg pointer-events-none cursor-default select-none">
                      {isAnnual ? "72%" : "67%"}
                    </Badge>
                    <CardHeader className="pt-8 pb-6">
                      <CardTitle className="dark:text-white text-gray-900 flex items-center gap-2">
                        스탠다드 <Badge className="bg-primary text-primary-foreground text-[10px] leading-none px-2 py-0.5">추천</Badge>
                      </CardTitle>
                      <div className="flex flex-col">
                        <span className="text-lg line-through text-gray-400">₩{isAnnual ? "48,000" : "48,000"}</span>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold dark:text-white text-gray-900">₩{isAnnual ? "13,000" : "15,600"}원</span>
                          <span className="text-gray-600 dark:text-gray-300 ml-1 text-sm">/월 VAT포함</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow pb-6">
                      <Separator className="bg-gray-200 dark:bg-[#333333]" />
                      <div className="text-sm font-medium mt-4 mb-2">주요 기능</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>매월 100 미네랄 충전</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>워크스페이스 2개 등록</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>
                            전체 메뉴 활성화 (키워드 순위는 별도)<br />
                            <span className="text-xs text-muted-foreground">
                              대시보드 · 계약현황 · 업무현황 · 키워드 분석 · 포스팅 관리 · 조직관리
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>AI 챗봇 통합 분석 제공</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto pt-6 pb-8">
                      {paymentInfo?.ulevel?.paid_level_yn === "Y" && paymentInfo?.ulevel?.ulevel_nm?.includes("스탠다드") ? (
                        <Button className="w-full dark:bg-[#444] bg-gray-200 dark:hover:bg-[#555] hover:bg-gray-300 dark:text-white text-gray-700" disabled>
                          이용중
                        </Button>
                      ) : (
                        <Button
                          className="w-full text-white h-[46px] rounded-lg"
                          onClick={() => handleSubscribe(1)}
                          disabled={paymentInfo?.ulevel?.paid_level_yn === "Y"}
                          style={{
                            background: "linear-gradient(-45deg, #0c5ce2, #3b82f6, #0c5ce2, #3b82f6)",
                            backgroundSize: "300% 300%",
                            animation: "gradient-animation 3s ease infinite"
                          }}
                        >
                          멤버십 이용하기
                        </Button>
                      )}
                    </CardFooter>
                  </Card>

                  <Card className="dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white relative overflow-hidden flex flex-col">
                    <Badge className="absolute right-0 top-0 bg-secondary text-primary text-sm border-none px-4 py-2 rounded-none rounded-bl-lg pointer-events-none cursor-default select-none">
                      {isAnnual ? "71%" : "66%"}
                    </Badge>
                    <CardHeader className="pt-8 pb-6">
                      <CardTitle className="dark:text-white text-gray-900">프리미엄</CardTitle>
                      <div className="flex flex-col">
                        <span className="text-lg line-through text-gray-400">₩{isAnnual ? "173,000" : "173,000"}</span>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold dark:text-white text-gray-900">₩{isAnnual ? "49,000" : "58,800"}원</span>
                          <span className="text-gray-600 dark:text-gray-300 ml-1 text-sm">/월 VAT포함</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 flex-grow pb-6">
                      <Separator className="bg-gray-200 dark:bg-[#333333]" />
                      <div className="text-sm font-medium mt-4 mb-2">주요 기능</div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>매월 300 미네랄 충전</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>워크스페이스 무제한 등록</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>
                            전체 메뉴 활성화 (키워드 순위는 별도)<br />
                            <span className="text-xs text-muted-foreground">
                              대시보드 · 계약현황 · 업무현황 · 키워드 분석 · 포스팅 관리 · 조직관리
                            </span>
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary mt-0.5" />
                          <span>AI 챗봇 통합 분석 제공</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto pt-6 pb-8">
                      {paymentInfo?.ulevel?.paid_level_yn === "Y" && paymentInfo?.ulevel?.ulevel_nm?.includes("프리미엄") ? (
                        <Button className="w-full dark:bg-[#444] bg-gray-200 dark:hover:bg-[#555] hover:bg-gray-300 dark:text-white text-gray-700" disabled>
                          이용중
                        </Button>
                      ) : (
                        <Button className="w-full bg-gray-700 hover:bg-gray-800 text-white h-[46px] rounded-lg" onClick={() => handleSubscribe(2)} disabled={paymentInfo?.ulevel?.paid_level_yn === "Y"}>
                          멤버십 이용하기
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold mb-4">자주 묻는 질문</h3>
                  <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1" className="border border-b last:!border-b dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3">AgOffice는 누가 사용하면 좋나요?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4 leading-normal">
                AgOffice는 마케팅 회사를 위해 설계된 AI 기반 통합 관리 플랫폼입니다.<br />
                광고 대행사, 인하우스 마케팅팀, 프리랜서 마케터 등 여러 고객사·브랜드를 동시에 운영하는 사람에게 특히 유용합니다.<br />
                워크스페이스를 여러 개 등록해 회사별로 구분 관리할 수 있으며, 조직원 초대 및 역할별 기능 제한 설정도 가능합니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border border-b last:!border-b dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3">결제는 어떤 방식으로 이루어지나요?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4 leading-normal">
                멤버십은 월간 및 연간결제 두가지 방식이 존재하며 '카드결제' 방법으로 결제 할 수 있습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="border border-b last:!border-b dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3">환불은 어떻게 할 수 있나요?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4 leading-normal">
                AgOffice의 환불 정책은 서비스이용약관에 따라 결제 후 7일 이내 사용 이력이 없을 시에만 가능합니다.<br />
                환불 문의는 마이페이지 → MY문의 → 우측 '1:1문의 쓰기'를 통해 접수할 수 있습니다. 접수된 문의에 대한 답변은 MY문의에서 확인하실 수 있습니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="border border-b last:!border-b dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3">미네랄은 언제까지 사용할 수 있나요?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4 leading-normal">
                유상으로 충전된 미네랄의 경우 유효기간은 <strong className="font-semibold">발행일로부터 5년</strong> 동안 사용하 실수 있습니다.
                <br />
                단, 가입시/이벤트 참여 시/친구초대 보상 등 무상으로 지급된 미네랄의 경우 <strong className="font-semibold">별도 안내된 유효기간</strong> 내 사용이 가능합니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5" className="border border-b last:!border-b dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3">조직원은 어떻게 관리하나요?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4 leading-normal">
                관리자는 조직원 초대 기능을 통해 멤버를 추가하고, ‘업무관리’, ‘성과분석’, ‘키워드순위’ 등 기능별 접근 권한을 설정할 수 있습니다.<br />
                이를 통해 팀원별 역할 구분이 명확해지고, 회사 전체의 작업 효율이 높아집니다.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6" className="border border-b last:!border-b dark:border-[#404040] border-gray-200 dark:bg-[#333333] bg-white rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3">직원별 업무 성과는 어떻게 확인하나요?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4 leading-normal">
                AgOffice는 마케팅 사원이 직접 업로드한 포스팅 데이터를 기반으로 개인별 활동량, 노출 순위, 키워드 성과를 자동 분석합니다.<br />
                이를 통해 누가 어떤 고객사의 키워드를 담당했고, 어떤 콘텐츠가 순위에 오르지 않았는지도 AI가 자동 리포트로 정리해줍니다.
              </AccordionContent>
            </AccordionItem>
              </Accordion>
            </div>

            <InquiryModal
              isOpen={showInquiryDialog}
              onClose={() => setShowInquiryDialog(false)}
              onSubmit={handleSubmitInquiry}
              title="프리미엄 문의하기"
              description="프리미엄 멤버십과 관련해 궁금한 내용을 남겨주세요."
              successMessage="문의하기 완료"
            />
          </section>
        </main>
      </div>
    </div>
  )
}

