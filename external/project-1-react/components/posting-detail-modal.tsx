"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Copy, ExternalLink, Edit } from "lucide-react"

interface RankingHistory {
  date: string
  rank: number
}

interface PostingData {
  id: number
  blogUrl: string
  client: string
  title: string
  keyword: string
  manager: string
  rank: number
  change: number
  history: RankingHistory[]
  registeredDate: string
  lastChecked: string
  teamName: string
  category: "신규" | "재작업"
  contractThreshold: number
  isTrackingActive?: boolean
}

interface PostingDetailModalProps {
  isOpen: boolean
  onClose: () => void
  posting: PostingData | null
  onEdit: (posting: PostingData) => void
  onCopyUrl: (url: string) => void
  getRankingBadge: (rank: number) => string
  getRankingChangeIcon: (change: number) => React.ReactNode
}

export default function PostingDetailModal({
  isOpen,
  onClose,
  posting,
  onEdit,
  onCopyUrl,
  getRankingBadge,
  getRankingChangeIcon
}: PostingDetailModalProps) {
  const contractInfo: Record<string, {
    contractNumber: string
    serviceType: string
    contractPeriod: string
  }> = {
    "스마트테크": {
      contractNumber: "CT-2024-001",
      serviceType: "SEO 최적화",
      contractPeriod: "2024.01.15 ~ 2024.06.15",
    },
    "패션하우스": {
      contractNumber: "CT-2024-002",
      serviceType: "콘텐츠 마케팅",
      contractPeriod: "2024.01.18 ~ 2024.07.18",
    },
    "그린푸드": {
      contractNumber: "CT-2024-003",
      serviceType: "브랜드 마케팅",
      contractPeriod: "2024.01.12 ~ 2024.04.12",
    },
    "헬스케어플러스": {
      contractNumber: "CT-2024-004",
      serviceType: "웰니스 마케팅",
      contractPeriod: "2024.01.10 ~ 2024.06.10",
    },
    "에듀테크": {
      contractNumber: "CT-2024-005",
      serviceType: "교육 콘텐츠",
      contractPeriod: "2024.01.08 ~ 2024.05.08",
    },
    "부동산투자": {
      contractNumber: "CT-2024-006",
      serviceType: "부동산 컨설팅",
      contractPeriod: "2024.01.05 ~ 2024.06.05",
    },
    "여행가이드": {
      contractNumber: "CT-2024-007",
      serviceType: "여행 콘텐츠",
      contractPeriod: "2024.01.14 ~ 2024.06.14",
    },
    "뷰티트렌드": {
      contractNumber: "CT-2024-008",
      serviceType: "뷰티 마케팅",
      contractPeriod: "2024.01.13 ~ 2024.06.13",
    },
  }

  if (!posting) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px] max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold m-0">포스팅 상세정보</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/10">
          <div className="space-y-6">
            {/* 기본 정보 */}
            <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0 pb-0">
              <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-slate-50">
                <h3 className="text-base font-semibold text-gray-800">
                  기본 정보
                </h3>
              </div>
              <CardContent className="px-4 md:px-8">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      고객사
                    </Label>
                    <p className="text-sm text-gray-900">{posting.client}</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      계약번호
                    </Label>
                    <p className="text-sm text-gray-900">
                      {contractInfo[posting.client]?.contractNumber || "-"}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      서비스 유형
                    </Label>
                    <p className="text-sm text-gray-900">
                      {contractInfo[posting.client]?.serviceType || "-"}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      담당자
                    </Label>
                    <p className="text-sm text-gray-900">{posting.manager} ({posting.teamName})</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      계약기간
                    </Label>
                    <p className="text-sm text-gray-900">
                      {contractInfo[posting.client]?.contractPeriod || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 포스팅 정보 */}
            <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0 pb-0">
              <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-slate-50">
                <h3 className="text-base font-semibold text-gray-800">
                  포스팅 정보
                </h3>
              </div>
              <CardContent className="px-4 md:px-8">
                <div>
                  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0 md:pt-1">
                      제목
                    </Label>
                    <p className="text-sm text-gray-900">{posting.title}</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 py-4">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0 md:pt-1">
                      블로그 URL
                    </Label>
                    <div className="flex items-center gap-2 flex-1">
                      <a
                        href={posting.blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm break-all line-clamp-2 flex-1"
                      >
                        {posting.blogUrl}
                      </a>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCopyUrl(posting.blogUrl)}
                        className="shadow-none rounded-lg border-0 bg-transparent hover:bg-transparent h-6 w-6 p-0 flex-shrink-0"
                      >
                        <Copy className="h-3 w-3 text-gray-400" strokeWidth={2.5} />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      카테고리
                    </Label>
                    <div>
                      <Badge variant={posting.category === "신규" ? "default" : "secondary"}>
                        {posting.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      등록일
                    </Label>
                    <p className="text-sm text-gray-900">{posting.registeredDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 키워드 및 순위 정보 */}
            <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0 pb-0">
              <div className="px-4 md:px-6 py-3 border-b border-gray-200 bg-slate-50">
                <h3 className="text-base font-semibold text-gray-800">
                  키워드 및 순위 정보
                </h3>
              </div>
              <CardContent className="px-4 md:px-8">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      타겟 키워드
                    </Label>
                    <div>
                      <Badge variant="secondary">
                        {posting.keyword}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      현재 순위
                    </Label>
                    {posting.isTrackingActive ? (
                      <div className="flex items-center gap-2">
                        <Badge className={`${getRankingBadge(posting.rank)} border text-xs px-2 py-0.5`}>
                          {posting.rank}위
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(posting.lastChecked).toLocaleString("ko-KR", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          })} 기준
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">-</p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      순위 변동
                    </Label>
                    {posting.isTrackingActive ? (
                      posting.change !== 0 ? (
                        <div className="flex items-center gap-2">
                          {getRankingChangeIcon(posting.change)}
                          <span className="text-sm font-medium">{Math.abs(posting.change)}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">-</p>
                      )
                    ) : (
                      <p className="text-sm text-gray-400">-</p>
                    )}
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      노출 보장 순위
                    </Label>
                    <p className="text-sm text-gray-900">{posting.contractThreshold}위</p>
                  </div>
                  {posting.rank > posting.contractThreshold && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 my-4">
                      <p className="text-sm text-red-800 font-medium">
                        ⚠️ 재작업 필요: 현재 순위가 노출 보장 순위({posting.contractThreshold}위)를 초과했습니다.
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 py-4 border-b border-gray-100">
                    <Label className="text-sm font-medium text-gray-500 md:w-[120px] flex-shrink-0">
                      순위 히스토리
                    </Label>
                    <p className="text-sm text-gray-900">{posting.history.length}일 기록</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t flex-shrink-0 bg-white">
          <Button
            onClick={onClose}
            className="w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
          >
            닫기
          </Button>
          <Button
            onClick={() => {
              onClose()
              onEdit(posting)
            }}
            className="py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg px-6"
          >
            수정
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
