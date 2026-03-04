"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Hash, BarChart3, Activity, Target, Award, TrendingUp, TrendingDown } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

interface KeywordsStatsCardsProps {
  totalKeywords: number
  totalPostings: number
  totalReworks: number
  averageTop5Rate: number
  excellentKeywords: number
  filter: string | null
}

export function KeywordsStatsCards({
  totalKeywords,
  totalPostings,
  totalReworks,
  averageTop5Rate,
  excellentKeywords,
  filter,
}: KeywordsStatsCardsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCardClick = (filterType: "rework" | "top5" | "excellent") => {
    const newFilter = filter === filterType ? null : filterType
    const params = new URLSearchParams(searchParams.toString())
    if (newFilter) {
      params.set("filter", newFilter)
    } else {
      params.delete("filter")
    }
    router.push(`/status/keywords?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
      {/* 총 키워드 */}
      <Card className="py-2 md:py-6 shadow-none rounded-2xl border">
        <CardContent className="px-4 py-2 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 mb-1 md:mb-2 text-xs font-medium border rounded-md border-blue-500 text-blue-600">
                총 키워드
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-semibold">{totalKeywords}개</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 mt-0.5 md:mt-1">
                <TrendingUp className="h-3 w-3" />
                +2
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 총 포스팅 */}
      <Card className="py-2 md:py-6 shadow-none rounded-2xl border">
        <CardContent className="px-4 py-2 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 mb-1 md:mb-2 text-xs font-medium border rounded-md border-green-500 text-green-600">
                총 포스팅
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-semibold">{totalPostings}건</div>
              <div className="flex items-center gap-1 text-xs text-red-600 mt-0.5 md:mt-1">
                <TrendingDown className="h-3 w-3" />
                -1
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 재작업 */}
      <Card
        className={`py-2 md:py-6 shadow-none rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
          filter === "rework" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
        }`}
        onClick={() => handleCardClick("rework")}
      >
        <CardContent className="px-4 py-2 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 mb-1 md:mb-2 text-xs font-medium border rounded-md border-orange-500 text-orange-600">
                재작업
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-semibold">{totalReworks}건</div>
              <div className="flex items-center gap-1 text-xs text-emerald-600 mt-0.5 md:mt-1">
                <TrendingUp className="h-3 w-3" />
                +2
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5위 안 확률 */}
      <Card
        className={`py-2 md:py-6 shadow-none rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
          filter === "top5" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
        }`}
        onClick={() => handleCardClick("top5")}
      >
        <CardContent className="px-4 py-2 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 mb-1 md:mb-2 text-xs font-medium border rounded-md border-purple-500 text-purple-600">
                5위 안 확률
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-semibold">{averageTop5Rate}%</div>
              <div className="text-xs text-gray-500 mt-0.5 md:mt-1">-</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 우수 키워드 */}
      <Card
        className={`py-2 md:py-6 shadow-none rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
          filter === "excellent" ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
        }`}
        onClick={() => handleCardClick("excellent")}
      >
        <CardContent className="px-4 py-2 md:p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 mb-1 md:mb-2 text-xs font-medium border rounded-md border-red-500 text-red-600">
                우수 키워드
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-semibold">{excellentKeywords}개</div>
              <div className="text-xs text-muted-foreground mt-0.5 md:mt-1">좋음 이상</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
