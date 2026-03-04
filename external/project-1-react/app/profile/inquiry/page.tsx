"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { cn } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDown, ChevronUp } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { ImageGallery } from "@/components/ui/image-modal"
import { InquiryModal, type InquiryFormData } from "@/components/ui/inquiry-modal"
import { Toaster } from "@/components/ui/toaster"
import { ScrollableTabs } from "@/components/ui/scrollable-tabs"
import { Skeleton } from "@/components/ui/skeleton"

// 임시 문의 데이터
const inquiryDataOriginal = [
  {
    id: 1,
    category: "서비스 이용",
    title: "계정 정보 변경 방법 문의드립니다",
    date: "2024-10-15",
    status: "답변완료",
    question: "안녕하세요. 계정 정보 중에서 이메일 주소를 변경하고 싶은데 어떻게 해야 하나요? 마이페이지에서 변경 버튼이 보이지 않습니다.",
    answer: "안녕하세요. 고객님. 계정 정보 변경은 마이페이지 > 계정정보 메뉴에서 가능합니다. 이메일 주소 옆의 '변경' 버튼을 클릭하시면 인증 절차 후 변경하실 수 있습니다. 추가로 궁금하신 사항이 있으시면 언제든 문의해주세요. 감사합니다.",
    answerDate: "2024-10-15",
    images: [],
  },
  {
    id: 2,
    category: "결제/환불",
    title: "멤버십 결제 후 혜택이 적용되지 않아요",
    date: "2024-10-12",
    status: "답변완료",
    question: "어제 프리미엄 멤버십 결제를 완료했는데, 아직도 무료 회원 상태로 표시되고 있습니다. 결제는 정상적으로 완료되었는데 혜택이 적용되지 않아서 문의드립니다. 아래 스크린샷을 첨부합니다.",
    answer: "안녕하세요. 결제 내역 확인 결과, 정상적으로 결제가 완료되었습니다. 시스템 오류로 인해 멤버십 등급이 업데이트되지 않은 것으로 확인되어 즉시 조치 완료하였습니다. 현재는 프리미엄 멤버십 혜택을 정상적으로 이용하실 수 있습니다. 불편을 드려 죄송합니다.",
    answerDate: "2024-10-13",
    images: [],
  },
  {
    id: 3,
    category: "기술 지원",
    title: "업로드 기능 오류 문의",
    date: "2024-10-08",
    status: "답변대기",
    question: "이미지 파일을 업로드하려고 하는데 계속 오류가 발생합니다. 파일 크기도 제한 이내이고 형식도 JPG인데 왜 안되는 걸까요? 오류 화면 첨부합니다.",
    answer: "",
    answerDate: "",
    images: ["/korean-business-person.jpg"],
  },
  {
    id: 4,
    category: "서비스 이용",
    title: "키워드 분석 데이터가 표시되지 않습니다",
    date: "2024-10-05",
    status: "답변완료",
    question: "키워드 분석 페이지에서 데이터가 로딩되지 않습니다. 새로고침해도 계속 로딩 중으로만 표시됩니다.",
    answer: "안녕하세요. 확인 결과, 일시적인 서버 장애로 인한 문제였습니다. 현재는 정상적으로 복구되어 키워드 분석 데이터를 확인하실 수 있습니다. 이용에 불편을 드려 대단히 죄송합니다.",
    answerDate: "2024-10-05",
    images: [],
  },
  {
    id: 5,
    category: "기타",
    title: "모바일 앱 출시 계획이 있나요?",
    date: "2024-10-01",
    status: "답변완료",
    question: "모바일에서도 편하게 이용하고 싶은데, 앱 출시 계획이 있으신가요? 반응형으로 되어있긴 하지만 앱이 있으면 더 편할 것 같아서 문의드립니다.",
    answer: "안녕하세요. 소중한 의견 감사합니다. 모바일 앱 개발은 현재 기획 단계에 있으며, 2025년 상반기 출시를 목표로 진행 중입니다. 출시 일정이 확정되면 공지사항을 통해 안내해드리겠습니다. 감사합니다.",
    answerDate: "2024-10-02",
    images: [],
  },
]

// 탭 데이터
const profileTabs = [
    { name: "계정정보", href: "/profile/account" },
    { name: "멤버십 관리", href: "/profile/membership" },
    { name: "결제 정보", href: "/profile/payment" },
    { name: "충전/이용내역", href: "/profile/charging" },
    { name: "MY문의", href: "/profile/inquiry" },
  ]

export default function InquiryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false)
  const [showEmptyState, setShowEmptyState] = useState(false)
  
  // 빈 화면 테스트용 데이터
  const inquiryData = showEmptyState ? [] : inquiryDataOriginal

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handleRowClick = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleSubmitInquiry = (data: InquiryFormData) => {
    // 문의 제출 로직
    console.log("문의 제출:", data)
    // 실제로는 API 호출 등을 수행
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="마이페이지"
      />

      <div className="flex">
        <Sidebar 
          currentPage="profile" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-6">
          {isLoading ? (
            // 스켈레톤 UI
            <>
              {/* 페이지 헤더 스켈레톤 - 데스크톱만 */}
              <div className="hidden sm:flex sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>

              {/* 탭 네비게이션 스켈레톤 */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {profileTabs.map((tab) => (
                  <Skeleton key={tab.href} className="h-10 w-24 flex-shrink-0 rounded-full" />
                ))}
              </div>

              {/* 1:1 문의내역 카드 스켈레톤 */}
              <Card className="shadow-none rounded-2xl border py-6">
                <CardHeader className="flex flex-row items-center justify-between gap-2">
                  <Skeleton className="h-6 w-32" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-9 w-28" />
                  </div>
                </CardHeader>
                <CardContent className="px-4">
                  {/* 데스크톱 테이블 스켈레톤 */}
                  <div className="hidden lg:block border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-[50px]"></TableHead>
                          <TableHead><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
                          <TableHead><Skeleton className="h-4 w-20" /></TableHead>
                          <TableHead><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
                          <TableHead><Skeleton className="h-4 w-16 mx-auto" /></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...Array(5)].map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-center">
                              <Skeleton className="h-4 w-4 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center">
                              <Skeleton className="h-4 w-20 mx-auto" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-full max-w-md" />
                            </TableCell>
                            <TableCell className="text-center">
                              <Skeleton className="h-4 w-24 mx-auto" />
                            </TableCell>
                            <TableCell className="text-center">
                              <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* 모바일 카드 스켈레톤 */}
                  <div className="lg:hidden space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-4 w-16" />
                              <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                          <Skeleton className="h-5 w-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* 페이지 헤더 - 모바일에서는 숨김 */}
              <div className="flex items-center justify-between hidden sm:block">
                <div>
                  <h1 className="text-2xl font-bold">마이페이지</h1>
                  <p className="text-sm text-muted-foreground mt-1">개인 정보를 관리하고 계정 설정을 변경하세요.</p>
                </div>
              </div>

              {/* 탭 네비게이션 */}
              <ScrollableTabs tabs={profileTabs} />

              {/* 1:1 문의내역 */}
              <Card className="shadow-none rounded-2xl border py-6">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl font-semibold">1:1 문의내역</CardTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 whitespace-nowrap"
                  onClick={() => setShowEmptyState(!showEmptyState)}
                >
                  {showEmptyState ? "데이터 보기" : "빈 화면 보기"}
                </Button>
                <Button 
                  className="bg-black hover:bg-black/90 text-white text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 whitespace-nowrap"
                  onClick={() => setIsInquiryModalOpen(true)}
                >
                  1:1문의 쓰기
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-4">
              {/* 데스크톱 테이블 뷰 */}
              <div className="hidden lg:block border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[50px] text-center"></TableHead>
                      <TableHead className="text-center font-semibold">상담구분</TableHead>
                      <TableHead className="text-left font-semibold pl-4">상담제목</TableHead>
                      <TableHead className="text-center font-semibold">작성일</TableHead>
                      <TableHead className="text-center font-semibold">답변유무</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inquiryData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <EmptyState
                            title="문의 내역이 없습니다"
                            description="궁금하신 사항이 있으시면 문의를 남겨주세요."
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      inquiryData.map((inquiry) => (
                        <>
                          <TableRow 
                            key={inquiry.id} 
                            className="hover:bg-muted/30 cursor-pointer"
                            onClick={() => handleRowClick(inquiry.id)}
                          >
                            <TableCell className="text-center">
                              {expandedId === inquiry.id ? (
                                <ChevronUp className="h-4 w-4 mx-auto" />
                              ) : (
                                <ChevronDown className="h-4 w-4 mx-auto" />
                              )}
                            </TableCell>
                            <TableCell className="text-center">{inquiry.category}</TableCell>
                            <TableCell className="text-left pl-4">{inquiry.title}</TableCell>
                            <TableCell className="text-center">{inquiry.date}</TableCell>
                            <TableCell className="text-center">
                              <span
                                className={cn(
                                  "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
                                  inquiry.status === "답변완료"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                )}
                              >
                                {inquiry.status}
                              </span>
                            </TableCell>
                          </TableRow>
                          {expandedId === inquiry.id && (
                            <TableRow key={`${inquiry.id}-detail`}>
                              <TableCell colSpan={5} className="bg-muted/20 p-6">
                                <div className="space-y-6">
                                  {/* 문의 내용 */}
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2 text-muted-foreground">문의 내용</h4>
                                    <div className="bg-white p-4 rounded-lg border">
                                      <p className="text-sm leading-relaxed">{inquiry.question}</p>
                                      
                                      {/* 첨부 이미지 */}
                                      {inquiry.images && inquiry.images.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                          <p className="text-xs font-semibold text-muted-foreground">첨부 이미지:</p>
                                          <ImageGallery images={inquiry.images} />
                                        </div>
                                      )}
                                      
                                      <p className="text-xs text-muted-foreground mt-2">작성일: {inquiry.date}</p>
                                    </div>
                                  </div>

                                  {/* 답변 내용 */}
                                  {inquiry.answer ? (
                                    <div>
                                      <h4 className="font-semibold text-sm mb-2 text-muted-foreground">답변 내용</h4>
                                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <p className="text-sm leading-relaxed">{inquiry.answer}</p>
                                        <p className="text-xs text-muted-foreground mt-2">답변일: {inquiry.answerDate}</p>
                                      </div>
                  </div>
                                  ) : (
                  <div>
                                      <h4 className="font-semibold text-sm mb-2 text-muted-foreground">답변 내용</h4>
                                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="text-sm text-muted-foreground">답변 대기 중입니다.</p>
                  </div>
                </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* 모바일 카드 뷰 */}
              <div className="lg:hidden space-y-3">
                {inquiryData.length === 0 ? (
                  <EmptyState
                    title="문의 내역이 없습니다"
                    description="궁금하신 사항이 있으시면 문의를 남겨주세요."
                    descriptionAlign="center"
                  />
                ) : (
                  inquiryData.map((inquiry) => (
                    <div key={inquiry.id} className="border rounded-lg overflow-hidden">
                      {/* 카드 헤더 */}
                      <div
                        className="p-4 bg-white cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => handleRowClick(inquiry.id)}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-muted-foreground">
                                {inquiry.category}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                                  inquiry.status === "답변완료"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                )}
                              >
                                {inquiry.status}
                              </span>
                            </div>
                            <h3 className="font-medium text-sm mb-1 line-clamp-1">
                              {inquiry.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {inquiry.date}
                            </p>
                          </div>
                          <div className="flex-shrink-0 pt-1">
                            {expandedId === inquiry.id ? (
                              <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 카드 상세 내용 */}
                      {expandedId === inquiry.id && (
                        <div className="bg-muted/20 px-3 py-4 border-t space-y-4">
                          {/* 문의 내용 */}
                  <div>
                            <h4 className="font-semibold text-sm mb-2 text-muted-foreground">문의 내용</h4>
                            <div className="bg-white p-4 rounded-lg border">
                              <p className="text-sm leading-relaxed">{inquiry.question}</p>
                              
                              {/* 첨부 이미지 */}
                              {inquiry.images && inquiry.images.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <p className="text-xs font-semibold text-muted-foreground">첨부 이미지:</p>
                                  <ImageGallery 
                                    images={inquiry.images}
                                    thumbnailWidth={120}
                                    thumbnailHeight={120}
                                    containerClassName="flex flex-wrap gap-2"
                                  />
                                </div>
                              )}
                              
                              <p className="text-xs text-muted-foreground mt-2">작성일: {inquiry.date}</p>
                            </div>
              </div>

                          {/* 답변 내용 */}
                          {inquiry.answer ? (
                            <div>
                              <h4 className="font-semibold text-sm mb-2 text-muted-foreground">답변 내용</h4>
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <p className="text-sm leading-relaxed">{inquiry.answer}</p>
                                <p className="text-xs text-muted-foreground mt-2">답변일: {inquiry.answerDate}</p>
                              </div>
                  </div>
                          ) : (
                  <div>
                              <h4 className="font-semibold text-sm mb-2 text-muted-foreground">답변 내용</h4>
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <p className="text-sm text-muted-foreground">답변 대기 중입니다.</p>
                  </div>
                </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
            </>
          )}

          {/* 문의하기 모달 */}
          <InquiryModal
            isOpen={isInquiryModalOpen}
            onClose={() => setIsInquiryModalOpen(false)}
            onSubmit={handleSubmitInquiry}
            defaultEmail="user@example.com"
          />

        </main>
      </div>
      <Toaster />
    </div>
  )
}

