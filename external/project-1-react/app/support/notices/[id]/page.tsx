"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Eye, Calendar, User, ChevronUp, ChevronDown } from "lucide-react"

// 공지사항 상세 데이터 타입
interface NoticeDetail {
  id: number
  type: string
  typeColor: string
  title: string
  content: string
  author: string
  registrationDate: string
  viewCount: number
  isPinned: boolean
}

// 공지사항 상세 데이터 (실제로는 API에서 가져옴)
const noticeDetailData: Record<number, NoticeDetail> = {
  1: {
    id: 1,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "2025년 1월 정기 서버 점검 안내",
    content: `안녕하세요. 고객 여러분.

더 나은 서비스 제공을 위해 정기 서버 점검을 진행합니다.

점검 일시: 2025년 1월 20일 (월) 02:00 ~ 06:00 (4시간)
점검 내용:
- 서버 하드웨어 점검 및 업그레이드
- 보안 패치 적용
- 데이터베이스 최적화
- 시스템 안정성 개선

점검 시간 동안 서비스 이용이 일시 중단되오니 양해 부탁드립니다.
문의사항이 있으시면 고객센터로 연락 주시기 바랍니다.

감사합니다.`,
    author: "관리자",
    registrationDate: "2025-01-15",
    viewCount: 342,
    isPinned: true,
  },
  2: {
    id: 2,
    type: "이벤트",
    typeColor: "bg-green-100 text-green-800",
    title: "신규 고객 대상 특별 할인 이벤트",
    content: `신규 가입 고객을 위한 특별 할인 이벤트를 진행합니다!

이벤트 기간: 2025년 1월 14일 ~ 2025년 2월 14일
혜택 내용:
- 첫 달 이용료 30% 할인
- 무료 프리미엄 기능 1개월 체험
- 전용 상담사 배정

신규 가입 후 7일 이내 서비스 이용 시 자동으로 혜택이 적용됩니다.
이번 기회를 놓치지 마세요!

자세한 내용은 고객센터로 문의해 주세요.`,
    author: "마케팅팀",
    registrationDate: "2025-01-14",
    viewCount: 528,
    isPinned: true,
  },
  3: {
    id: 3,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "새로운 기능 업데이트 안내",
    content: `사용자 편의성 향상을 위한 새로운 기능이 추가되었습니다.

주요 업데이트 내용:
1. 대시보드 UI 개선
   - 더욱 직관적인 레이아웃
   - 실시간 데이터 시각화 강화

2. 모바일 앱 성능 개선
   - 로딩 속도 30% 향상
   - 배터리 소모 최적화

3. 새로운 보고서 기능
   - 커스텀 보고서 생성
   - 자동 스케줄링 지원

4. 알림 시스템 강화
   - 다양한 알림 채널 지원
   - 알림 우선순위 설정

자세한 사용 방법은 도움말 페이지를 참고해 주세요.`,
    author: "개발팀",
    registrationDate: "2025-01-10",
    viewCount: 892,
    isPinned: false,
  },
  4: {
    id: 4,
    type: "업데이트",
    typeColor: "bg-purple-100 text-purple-800",
    title: "모바일 앱 2.0 버전 출시",
    content: `모바일 앱이 2.0 버전으로 대규모 업데이트되었습니다.

새로운 기능:
- 완전히 새로워진 UI/UX
- 다크 모드 지원
- 오프라인 모드
- 향상된 검색 기능
- 위젯 지원

버그 수정:
- 로그인 오류 해결
- 알림 미수신 문제 해결
- 데이터 동기화 오류 해결

앱스토어와 구글 플레이에서 업데이트하실 수 있습니다.
더욱 빠르고 편리한 서비스를 경험하세요!`,
    author: "개발팀",
    registrationDate: "2025-01-08",
    viewCount: 671,
    isPinned: false,
  },
  5: {
    id: 5,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "개인정보처리방침 변경 안내",
    content: `개인정보처리방침이 일부 변경되었습니다.

변경 시행일: 2025년 1월 15일
주요 변경 내용:

1. 개인정보 수집 항목 명시 강화
2. 제3자 제공 관련 내용 추가
3. 개인정보 보유 기간 세분화
4. 정보주체의 권리 행사 방법 보완

변경된 개인정보처리방침은 홈페이지 하단에서 확인하실 수 있습니다.
궁금하신 사항은 개인정보 보호책임자에게 문의해 주세요.

감사합니다.`,
    author: "관리자",
    registrationDate: "2025-01-05",
    viewCount: 445,
    isPinned: false,
  },
  6: {
    id: 6,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "연말연시 고객지원 운영 안내",
    content: `연말연시 고객지원 운영 시간을 안내드립니다.

특별 운영 기간:
- 2024년 12월 30일 ~ 2025년 1월 2일

운영 시간:
- 12월 30일: 오전 9시 ~ 오후 6시
- 12월 31일: 오전 9시 ~ 오후 3시
- 1월 1일: 휴무
- 1월 2일: 정상 운영 (오전 9시 ~ 오후 6시)

긴급 문의는 이메일로 남겨주시면 순차적으로 처리하겠습니다.
새해 복 많이 받으세요!`,
    author: "고객지원팀",
    registrationDate: "2024-12-28",
    viewCount: 623,
    isPinned: false,
  },
  7: {
    id: 7,
    type: "이벤트",
    typeColor: "bg-green-100 text-green-800",
    title: "2024년 연말 감사 이벤트",
    content: `2024년 한 해 동안 보내주신 사랑에 감사드립니다.

이벤트 내용:
1. 추첨을 통해 100명에게 스타벅스 기프티콘 증정
2. 전 고객 대상 포인트 2배 적립
3. 프리미엄 서비스 1개월 무료 체험권 증정

참여 방법:
- 이벤트 페이지에서 응모하기 버튼 클릭
- 간단한 설문 작성 (소요 시간: 2분)
- 자동 응모 완료

당첨자 발표: 2025년 1월 5일
당첨자에게는 개별 연락드립니다.

많은 참여 부탁드립니다!`,
    author: "마케팅팀",
    registrationDate: "2024-12-20",
    viewCount: 1204,
    isPinned: false,
  },
  8: {
    id: 8,
    type: "공지",
    typeColor: "bg-blue-100 text-blue-800",
    title: "서비스 이용약관 개정 안내",
    content: `서비스 이용약관이 개정되었음을 알려드립니다.

개정 시행일: 2024년 12월 20일
주요 개정 내용:

1. 서비스 이용 범위 명확화
2. 환불 정책 개선
3. 금지행위 항목 추가
4. 분쟁 해결 절차 보완

개정된 이용약관은 홈페이지에서 확인하실 수 있으며,
시행일 이후 서비스 이용 시 개정된 약관에 동의한 것으로 간주됩니다.

문의사항은 고객센터로 연락 주시기 바랍니다.`,
    author: "관리자",
    registrationDate: "2024-12-15",
    viewCount: 356,
    isPinned: false,
  },
}

export default function NoticeDetailPage() {
  const router = useRouter()
  const params = useParams()
  const noticeId = Number(params.id)

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notice, setNotice] = useState<NoticeDetail | null>(null)

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      const noticeData = noticeDetailData[noticeId]
      if (noticeData) {
        setNotice(noticeData)
      }
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [noticeId])

  // 목록으로 돌아가기
  const handleBack = () => {
    router.push("/support/notices")
  }

  // 이전글 이동
  const handlePrevious = () => {
    if (noticeId > 1) {
      router.push(`/support/notices/${noticeId - 1}`)
    }
  }

  // 다음글 이동
  const handleNext = () => {
    const maxId = Math.max(...Object.keys(noticeDetailData).map(Number))
    if (noticeId < maxId) {
      router.push(`/support/notices/${noticeId + 1}`)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex">
        <Sidebar
          currentPage="support/notices"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 w-full max-w-full">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* 네비게이션 버튼 */}
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePrevious}
                disabled={noticeId <= 1}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronUp className="h-4 w-4 mr-1" />
                이전글
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleNext}
                disabled={noticeId >= Math.max(...Object.keys(noticeDetailData).map(Number))}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown className="h-4 w-4 mr-1" />
                다음글
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleBack}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300"
              >
                목록
              </Button>
            </div>

            {/* 공지사항 내용 */}
            <Card className="border border-gray-200 rounded-none shadow-none">
              <CardContent className="px-8 sm:px-12 lg:px-16 py-6">
                {isLoading ? (
                  // 로딩 중 스켈레톤
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                      <Skeleton className="h-8 w-3/4" />
                    </div>

                    <Separator />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-5 w-24" />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                ) : notice ? (
                  <div className="space-y-6">
                    {/* 헤더 */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {notice.isPinned && (
                          <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 border-0">
                            필독
                          </Badge>
                        )}
                        <Badge variant="secondary" className={`text-xs ${notice.typeColor} border-0`}>
                          {notice.type}
                        </Badge>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {notice.title}
                      </h1>
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex flex-row items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{notice.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{notice.registrationDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        <span>조회수 {notice.viewCount.toLocaleString()}</span>
                      </div>
                    </div>

                    <Separator />

                    {/* 본문 내용 */}
                    <div className="prose prose-sm sm:prose max-w-none">
                      <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {notice.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  // 공지사항을 찾을 수 없음
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-500">공지사항을 찾을 수 없습니다.</p>
                    <Button
                      onClick={handleBack}
                      className="mt-4"
                    >
                      목록으로 돌아가기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 하단 버튼 */}
            {!isLoading && notice && (
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300"
                >
                  목록
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
