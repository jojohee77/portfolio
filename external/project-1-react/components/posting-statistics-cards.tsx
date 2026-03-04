"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface PostingStatisticsCardsProps {
  filteredData: any[]
  selectedCard: string | null
  onCardClick: (cardType: string) => void
}

export default function PostingStatisticsCards({ 
  filteredData,
  selectedCard,
  onCardClick
}: PostingStatisticsCardsProps) {
  const totalPostings = filteredData.length
  const reworkKeywords = filteredData.filter((p) => p.rank > p.contractThreshold).length
  const validWork = filteredData.filter((p) => p.rank <= p.contractThreshold).length
  const top5Keywords = filteredData.filter((p) => p.rank <= 5).length
  const top5Percentage = filteredData.length > 0 
    ? Math.round((top5Keywords / filteredData.length) * 100) 
    : 0
  const averageRank = filteredData.length > 0 
    ? (filteredData.reduce((sum, p) => sum + p.rank, 0) / filteredData.length).toFixed(1)
    : 0

  const cards = [
    {
      id: "total",
      title: "총 포스팅",
      value: totalPostings,
      unit: "건",
      description: "등록된 포스팅 수",
      color: "border-blue-500 text-blue-600",
      trend: { value: "+2", direction: "up" as const }
    },
    {
      id: "rework",
      title: "재작업 키워드",
      value: reworkKeywords,
      unit: "건",
      description: "재작업한 포스팅",
      color: "border-red-500 text-red-600",
      trend: { value: "-1", direction: "down" as const }
    },
    {
      id: "valid",
      title: "유효작업",
      value: validWork,
      unit: "건",
      description: "총 포스팅 - 재작업",
      color: "border-green-500 text-green-600",
      trend: { value: "+3", direction: "up" as const }
    },
    {
      id: "top5",
      title: "상위 5위 키워드",
      value: top5Keywords,
      unit: `개 (${top5Percentage}%)`,
      description: "5위 이내 노출 키워드",
      color: "border-purple-500 text-purple-600",
      trend: { value: "+1", direction: "up" as const }
    },
    {
      id: "average",
      title: "평균 키워드 순위",
      value: averageRank,
      unit: "위",
      description: "전체 키워드 평균",
      color: "border-blue-500 text-blue-600",
      trend: null
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
      {cards.map((card) => (
        <Card 
          key={card.id}
          className={`py-2 md:py-6 shadow-none rounded-2xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
            selectedCard === card.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
          }`}
          onClick={() => onCardClick(card.id)}
        >
          <CardContent className="px-4 py-2 md:p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className={`inline-block px-2 py-0.5 mb-1 md:mb-2 text-xs font-medium border rounded-md ${card.color}`}>
                  {card.title}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="text-2xl font-semibold">{card.value}{card.unit.includes('%') ? '' : card.unit}</div>
                {card.trend && (
                  <div className={`flex items-center gap-1 text-xs mt-0.5 md:mt-1 ${
                    card.trend.direction === 'up' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {card.trend.direction === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {card.trend.value}
                  </div>
                )}
                {!card.trend && (
                  <div className="text-xs text-muted-foreground mt-0.5 md:mt-1">
                    {card.description}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
