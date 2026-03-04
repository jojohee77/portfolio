"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { ScrollableTabs } from "@/components/ui/scrollable-tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CommonSelect } from "@/components/ui/common-select"
import { CreditCard, Calendar, Download, ExternalLink } from "lucide-react"
import DataTable, { type Column } from "@/components/ui/data-table"
import { showSuccessToast } from "@/lib/toast-utils"
import { Skeleton } from "@/components/ui/skeleton"

// 탭 데이터
const profileTabs = [
  { name: "계정정보", href: "/profile/account" },
  { name: "멤버십 관리", href: "/profile/membership" },
  { name: "결제 정보", href: "/profile/payment" },
  { name: "충전/이용내역", href: "/profile/charging" },
  { name: "MY문의", href: "/profile/inquiry" },
]

// 결제 내역 타입 정의
interface PaymentHistory {
  id: number
  amount: string
  date: string
  method: string
  status: string
}

// 결제 내역 데이터
const paymentHistory: PaymentHistory[] = [
  { id: 1, amount: "99,000원", date: "2024-07-01", method: "신용카드", status: "완료" },
  { id: 2, amount: "99,000원", date: "2024-06-01", method: "신용카드", status: "완료" },
  { id: 3, amount: "99,000원", date: "2024-05-01", method: "신용카드", status: "완료" },
  { id: 4, amount: "99,000원", date: "2024-04-01", method: "신용카드", status: "완료" },
]

export default function PaymentPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 빈 화면 테스트용 상태
  const [hasPaymentMethod, setHasPaymentMethod] = useState(true)
  const [hasPaymentHistory, setHasPaymentHistory] = useState(true)

  // 결제수단 변경 모달 상태
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardholderName, setCardholderName] = useState("")

  // 영수증 모달 상태
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentHistory | null>(null)

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // 결제방법 옵션
  const paymentMethodOptions = [
    { value: "credit-card", label: "신용카드" },
    { value: "debit-card", label: "체크카드" },
  ]

  // 결제수단 저장 핸들러
  const handleSavePaymentMethod = () => {
    // 유효성 검사
    if (!cardNumber || !expiryDate || !cvc || !cardholderName) {
      return
    }

    // 저장 로직
    showSuccessToast("결제수단이 변경되었습니다.")
    setPaymentModalOpen(false)
    
    // 폼 초기화
    setCardNumber("")
    setExpiryDate("")
    setCvc("")
    setCardholderName("")
  }

  // 영수증 보기 핸들러
  const handleShowReceipt = (payment: PaymentHistory) => {
    setSelectedPayment(payment)
    setReceiptModalOpen(true)
  }

  // 컬럼 정의
  const columns: Column<PaymentHistory>[] = [
    {
      key: "amount",
      label: "결제금액",
      width: "w-[140px]",
      render: (payment) => (
        <div className="text-sm font-semibold text-gray-900">
          {payment.amount}
        </div>
      ),
    },
    {
      key: "date",
      label: "결제일",
      width: "w-[120px]",
      render: (payment) => (
        <div className="text-sm text-gray-700">
          {payment.date}
        </div>
      ),
    },
    {
      key: "method",
      label: "결제 방법",
      width: "w-[120px]",
      render: (payment) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
          {payment.method}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "상태",
      width: "w-[100px]",
      render: (payment) => (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
          {payment.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "영수증",
      width: "w-[100px]",
      align: "center",
      render: (payment) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 px-3 hover:bg-gray-100"
          onClick={() => handleShowReceipt(payment)}
        >
          <Download className="h-4 w-4 mr-1" />
          영수증
        </Button>
      ),
    },
  ]

  // 모바일 카드 렌더링
  const renderMobileCard = (payment: PaymentHistory) => (
    <Card className="shadow-none rounded-xl border border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 결제금액 */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">결제금액</div>
            <div className="font-semibold text-base">{payment.amount}</div>
          </div>

          {/* 결제일 */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">결제일</div>
            <div className="text-sm">{payment.date}</div>
          </div>

          {/* 결제 방법 */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">결제 방법</div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
              {payment.method}
            </Badge>
          </div>

          {/* 상태 */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">상태</div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
              {payment.status}
            </Badge>
          </div>

          {/* 영수증 버튼 */}
          <div className="pt-2 border-t border-gray-100">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full h-9"
              onClick={() => handleShowReceipt(payment)}
            >
              <Download className="h-4 w-4 mr-1" />
              영수증
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 페이지네이션 계산
  const displayData = hasPaymentHistory ? paymentHistory : []
  const totalPages = Math.ceil(displayData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = displayData.slice(startIndex, startIndex + itemsPerPage)

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

              {/* 결제 수단 카드 스켈레톤 */}
              <Card className="shadow-none rounded-2xl border gap-3 sm:gap-6 py-6">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-4 w-80" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="space-y-4">
                      {/* 결제 방법 */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pb-4 border-b border-gray-200">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>

                      {/* 상세 정보 */}
                      <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 결제 내역 테이블 스켈레톤 */}
              <Card className="shadow-none rounded-2xl border py-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="p-4 border border-gray-200 rounded-xl">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <div className="pt-2 border-t border-gray-100">
                            <Skeleton className="h-9 w-full" />
                          </div>
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
              <div className="flex items-center justify-between hidden sm:flex">
                <div>
                  <h1 className="text-2xl font-bold">마이페이지</h1>
                  <p className="text-sm text-muted-foreground mt-1">결제 정보를 관리하세요</p>
                </div>
                {/* 테스트용 토글 버튼 */}
                <div className="flex gap-2">
                  <Button 
                    variant={hasPaymentMethod ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasPaymentMethod(!hasPaymentMethod)}
                  >
                    결제수단 {hasPaymentMethod ? '있음' : '없음'}
                  </Button>
                  <Button 
                    variant={hasPaymentHistory ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasPaymentHistory(!hasPaymentHistory)}
                  >
                    결제내역 {hasPaymentHistory ? '있음' : '없음'}
                  </Button>
                </div>
              </div>

              {/* 탭 네비게이션 */}
              <ScrollableTabs tabs={profileTabs} />

              {/* 테스트용 토글 버튼 - 모바일 */}
              <div className="flex gap-2 sm:hidden">
                <Button 
                  variant={hasPaymentMethod ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHasPaymentMethod(!hasPaymentMethod)}
                  className="flex-1"
                >
                  결제수단 {hasPaymentMethod ? '있음' : '없음'}
                </Button>
                <Button 
                  variant={hasPaymentHistory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setHasPaymentHistory(!hasPaymentHistory)}
                  className="flex-1"
                >
                  결제내역 {hasPaymentHistory ? '있음' : '없음'}
                </Button>
              </div>

              {/* 결제 수단 카드 */}
              <Card className="shadow-none rounded-2xl border gap-3 sm:gap-6 py-6">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold">결제 수단</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {hasPaymentMethod 
                          ? '결제수단 변경 모달에서 카드 정보를 수정할 수 있습니다'
                          : '등록된 결제수단이 없습니다'}
                      </p>
                    </div>
                    {hasPaymentMethod && (
                      <div className="flex justify-end sm:justify-start">
                        <Button 
                          variant="outline" 
                          className="h-10 px-4 shadow-none whitespace-nowrap"
                          onClick={() => setPaymentModalOpen(true)}
                        >
                          결제수단 변경
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {hasPaymentMethod ? (
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <div className="space-y-4">
                        {/* 결제 방법 */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm pb-4 border-b border-gray-200">
                          <span className="text-muted-foreground sm:min-w-[80px]">결제 방법</span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 w-fit">
                            신용카드
                          </Badge>
                        </div>

                        {/* 상세 정보 */}
                        <div className="space-y-3 text-sm">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <div className="flex items-center gap-2">
                              <CreditCard className="hidden sm:block h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground sm:w-24">결제금액</span>
                            </div>
                            <span className="font-medium pl-0 sm:pl-0">99,000원</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <div className="flex items-center gap-2">
                              <CreditCard className="hidden sm:block h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground sm:w-24">카드 번호</span>
                            </div>
                            <span className="font-medium pl-0 sm:pl-0">**** **** **** 1234</span>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="hidden sm:block h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-muted-foreground sm:w-24">결제일</span>
                            </div>
                            <span className="font-medium pl-0 sm:pl-0">2025-12-12</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 px-4">
                      <Button 
                        className="mb-4 h-11 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                        onClick={() => setPaymentModalOpen(true)}
                      >
                        결제수단 등록하기
                      </Button>
                      <p className="text-base font-medium text-gray-900 mb-0">
                        등록된 결제수단이 없습니다
                      </p>
                      <p className="text-sm text-gray-500">
                        결제수단을 등록하고 서비스를 이용하세요
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 결제 내역 테이블 */}
              <DataTable
                data={paginatedData}
                columns={columns}
                title="결제 내역"
                totalCount={displayData.length}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                renderMobileCard={renderMobileCard}
                showPagination={false}
                emptyIcon="/icons/icon-default.png"
                emptyTitle="결제 내역이 없습니다"
                emptyDescription="아직 결제한 내역이 없습니다."
              />
            </>
          )}
        </main>
      </div>

      {/* 결제수단 변경 모달 */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">결제수단 변경</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* 결제방법 */}
            <div className="space-y-2">
              <Label htmlFor="payment-method" className="text-sm font-medium">
                결제방법 <span className="text-red-500">*</span>
              </Label>
              <CommonSelect
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                options={paymentMethodOptions}
                placeholder="결제방법을 선택하세요"
                triggerClassName="w-full h-11"
              />
            </div>

            {/* 카드번호 */}
            <div className="space-y-2">
              <Label htmlFor="card-number" className="text-sm font-medium">
                카드번호 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '')
                  const formatted = value.match(/.{1,4}/g)?.join(' ') || value
                  if (value.length <= 16) {
                    setCardNumber(formatted)
                  }
                }}
                maxLength={19}
                className="h-11"
              />
            </div>

            {/* 유효기간 / CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date" className="text-sm font-medium">
                  유효기간 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="expiry-date"
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '')
                    if (value.length >= 2) {
                      value = value.slice(0, 2) + '/' + value.slice(2, 4)
                    }
                    if (value.length <= 5) {
                      setExpiryDate(value)
                    }
                  }}
                  maxLength={5}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc" className="text-sm font-medium">
                  CVC <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cvc"
                  type="text"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    if (value.length <= 3) {
                      setCvc(value)
                    }
                  }}
                  maxLength={3}
                  className="h-11"
                />
              </div>
            </div>

            {/* 카드 소유자명 */}
            <div className="space-y-2">
              <Label htmlFor="cardholder-name" className="text-sm font-medium">
                카드 소유자명 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="cardholder-name"
                type="text"
                placeholder="홍길동"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="h-11"
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 h-11"
              onClick={() => setPaymentModalOpen(false)}
            >
              취소
            </Button>
            <Button
              className="flex-1 h-11"
              onClick={handleSavePaymentMethod}
              disabled={!cardNumber || !expiryDate || !cvc || !cardholderName}
            >
              저장
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 영수증 모달 */}
      <Dialog open={receiptModalOpen} onOpenChange={setReceiptModalOpen}>
        <DialogContent 
          showCloseButton={false}
          className="max-h-[85vh] p-0 gap-0 sm:max-w-[500px]"
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
            <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 m-0 leading-none">
              결제 내역
            </DialogTitle>
            <button
              onClick={() => setReceiptModalOpen(false)}
              className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex-shrink-0"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 콘텐츠 - 스크롤 영역 */}
          {selectedPayment && (
            <div className="px-4 sm:px-6 max-h-[50vh] overflow-y-auto border-t border-b border-gray-200">
              <div className="py-4 sm:py-6">
                {/* 토스 스타일 영수증 디자인 */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                  {/* 헤더 */}
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 px-6 py-8 text-white">
                    <div className="text-center">
                      <div className="text-sm opacity-90 mb-2">결제 완료</div>
                      <div className="text-3xl font-bold mb-1">{selectedPayment.amount}</div>
                      <div className="text-sm opacity-80">{selectedPayment.date}</div>
                    </div>
                  </div>

                  {/* 결제 정보 */}
                  <div className="px-6 py-6 space-y-5">
                    {/* 결제 수단 */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="text-xs text-gray-500 mb-2">결제 수단</div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <span className="font-medium text-gray-900">{selectedPayment.method}</span>
                      </div>
                    </div>

                    {/* 카드 정보 */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="text-xs text-gray-500 mb-2">카드 정보</div>
                      <div className="text-sm font-medium text-gray-900">**** **** **** 1234</div>
                      <div className="text-xs text-gray-500 mt-1">홍길동</div>
                    </div>

                    {/* 주문 정보 */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="text-xs text-gray-500 mb-2">주문 정보</div>
                      <div className="text-sm font-medium text-gray-900">AGOFFICE 멤버십</div>
                      <div className="text-xs text-gray-500 mt-1">월간 구독</div>
                    </div>

                    {/* 결제 일시 */}
                    <div>
                      <div className="text-xs text-gray-500 mb-2">결제 일시</div>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedPayment.date} 14:30:25
                      </div>
                    </div>
                  </div>

                  {/* 푸터 */}
                  <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">승인번호</span>
                      <span className="font-medium text-gray-900">12345678</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-3">
            <Button 
              variant="outline"
              className="h-11 sm:h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-lg"
              onClick={() => {
                // 새 창으로 영수증 열기 로직
              }}
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              새 창으로 열기
            </Button>
            <Button 
              onClick={() => setReceiptModalOpen(false)} 
              className="w-20 py-3 h-10 sm:h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
            >
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

