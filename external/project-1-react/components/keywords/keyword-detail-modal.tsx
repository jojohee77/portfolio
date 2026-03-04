"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Line, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
  ChartDataset,
} from "chart.js"
import {
  CheckCircle,
  Award,
  Minus,
  AlertTriangle,
  XCircle,
  Copy,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  X,
  Hand,
  Lock,
} from "lucide-react"
import type { KeywordData, PostingDetail, Ranking } from "@/app/status/keywords/page"
import { useState, useRef, useEffect } from "react"

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
)

interface KeywordDetailModalProps {
  isOpen: boolean
  keyword: KeywordData | null
  onClose: () => void
  onCopyToClipboard: (text: string) => Promise<void>
}

export function KeywordDetailModal({ isOpen, keyword, onClose, onCopyToClipboard }: KeywordDetailModalProps) {
  // 모든 state를 조건 없이 선언 (hook 규칙)
  const [chartDataType] = useState<'full' | '7days'>('full')
  const [visibleDaysStart, setVisibleDaysStart] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedChartData, setSelectedChartData] = useState<{ date: string; index: number } | null>(null)
  const initedRef = useRef(false)
  const [showScrollToast, setShowScrollToast] = useState(true)
  const showRankingData = keyword?.isTrackingActive !== false

  // 스크롤 토스트 자동 숨김 효과 (모든 hook을 if 전에 선언)
  useEffect(() => {
    // 모달이 열릴 때마다 토스트를 다시 표시
    if (isOpen) {
      setShowScrollToast(true)
      const timer = setTimeout(() => {
        setShowScrollToast(false)
      }, 3000) // 3초 후 숨김
      return () => clearTimeout(timer)
    }
  }, [isOpen])
  
  if (!isOpen || !keyword) return null

  // 모바일에서 보이는 데이터 범위 계산
  const VISIBLE_DAYS = 7
  const maxStartIndex = Math.max(0, keyword.rankingHistory.length - VISIBLE_DAYS)
  const visibleDaysEnd = Math.min(visibleDaysStart + VISIBLE_DAYS - 1, keyword.rankingHistory.length - 1)
  const visibleData = keyword.rankingHistory.slice(visibleDaysStart, visibleDaysEnd + 1)
  
  // 초기값 설정: 첫 로드 시 최근 데이터 자동 표시 (한 번만)
  if (!initedRef.current && visibleData.length > 0 && !selectedChartData) {
    setSelectedChartData({
      date: visibleData[visibleData.length - 1].date,
      index: visibleData.length - 1
    })
    initedRef.current = true
  }

  const getCompetitionBadge = (level: string) => {
    switch (level) {
      case "아주좋음":
        return "bg-green-50 border border-green-200 text-green-700"
      case "좋음":
        return "bg-blue-50 border border-blue-200 text-blue-700"
      case "보통":
        return "bg-yellow-50 border border-yellow-200 text-yellow-700"
      case "나쁨":
        return "bg-orange-50 border border-orange-200 text-orange-700"
      case "아주나쁨":
        return "bg-red-50 border border-red-200 text-red-700"
      default:
        return "bg-gray-50 border border-gray-200 text-gray-700"
    }
  }

  const getCompetitionIcon = (level: string) => {
    switch (level) {
      case "아주좋음":
        return <CheckCircle className="h-4 w-4" style={{color: '#059669'}} />
      case "좋음":
        return <Award className="h-4 w-4" style={{color: '#3d66d9'}} />
      case "보통":
        return <Minus className="h-4 w-4" style={{color: '#f7811b'}} />
      case "나쁨":
        return <AlertTriangle className="h-4 w-4" style={{color: '#f15532'}} />
      case "아주나쁨":
        return <XCircle className="h-4 w-4" style={{color: '#f53b3b'}} />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  // 모바일용 7일치 데이터
  const last7DaysData = keyword.rankingHistory.slice(-7)
  const chartData = chartDataType === '7days' ? last7DaysData : keyword.rankingHistory
  const mobileDatasets: ChartDataset<'bar' | 'line', number[]>[] = [
    {
      type: 'bar',
      label: '월 검색량',
      data: visibleData.map(d => d.searchVolume),
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      borderWidth: 1,
      borderRadius: 4,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'bar',
      label: '월 발행량',
      data: visibleData.map(d => d.monthlyPosts),
      backgroundColor: '#51ab23',
      borderColor: '#51ab23',
      borderWidth: 1,
      borderRadius: 4,
      yAxisID: 'y',
      order: 2,
    },
  ]

  if (showRankingData) {
    mobileDatasets.push({
      type: 'line',
      label: '순위',
      data: visibleData.map(d => d.rank),
      borderColor: '#f53b3b',
      backgroundColor: 'transparent',
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 5,
      pointHoverRadius: 8,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#f53b3b',
      pointBorderWidth: 2.5,
      yAxisID: 'y1',
      order: 1,
    })
  }

  const desktopDatasets: ChartDataset<'bar' | 'line', number[]>[] = [
    {
      type: 'bar',
      label: '월 검색량',
      data: chartData.map(d => d.searchVolume),
      backgroundColor: '#3b82f6',
      borderColor: '#3b82f6',
      borderWidth: 1,
      borderRadius: 4,
      yAxisID: 'y',
      order: 2,
    },
    {
      type: 'bar',
      label: '월 발행량',
      data: chartData.map(d => d.monthlyPosts),
      backgroundColor: '#51ab23',
      borderColor: '#51ab23',
      borderWidth: 1,
      borderRadius: 4,
      yAxisID: 'y',
      order: 2,
    },
  ]

  if (showRankingData) {
    desktopDatasets.push({
      type: 'line',
      label: '순위',
      data: chartData.map(d => d.rank),
      borderColor: '#f53b3b',
      backgroundColor: 'transparent',
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#f53b3b',
      pointBorderWidth: 2.5,
      yAxisID: 'y1',
      order: 1,
    })
  }
  
  // 터치 드래그 처리
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setIsDragging(false)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === 0) return
    
    const touchEndX = e.changedTouches[0].clientX
    const dragDistance = touchStartX - touchEndX
    
    // 50px 이상 드래그해야 반응
    if (Math.abs(dragDistance) > 50) {
      e.stopPropagation()
      e.preventDefault()
      setIsDragging(true)
      const scrollDelta = dragDistance > 0 ? 1 : -1
      const newStartIndex = Math.max(0, Math.min(visibleDaysStart + scrollDelta, maxStartIndex))
      setVisibleDaysStart(newStartIndex)
      
      // 드래그 후 500ms 동안 클릭 비활성화
      setTimeout(() => setIsDragging(false), 500)
    }
    
    setTouchStartX(0)
  }

  // 모달 외부 영역 클릭 시 드래그 상태 즉시 해제
  const handleModalTouchStart = (e: React.TouchEvent) => {
    // 차트 컨테이너가 아니면 즉시 드래그 상태 해제
    const chartContainer = (e.target as HTMLElement).closest('.md\\:hidden.h-64')
    if (!chartContainer) {
      setIsDragging(false)
      setSelectedChartData(null)
    }
  }

  // 차트 클릭 시 데이터 저장
  const handleChartClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return
    
    const div = e.currentTarget
    const rect = div.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // 클릭된 위치가 차트 영역인지 확인
    const chartWidth = rect.width
    const barWidth = chartWidth / (visibleData.length + 1)
    const clickedIndex = Math.floor(x / barWidth)
    
    if (clickedIndex >= 0 && clickedIndex < visibleData.length) {
      setSelectedChartData({
        date: visibleData[clickedIndex].date,
        index: clickedIndex
      })
    }
  }

  // 다른 곳 터치 시 선택 해제
  const handleClearSelection = () => {
    setSelectedChartData(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[90vw] lg:!max-w-6xl w-full max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white border-none rounded-xl [&>button]:hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
          <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 m-0 leading-none">
            키워드 상세정보: {keyword.keyword}
            {keyword.primaryClient || keyword.clients?.[0] ? (
              <span className="text-sm sm:text-base font-medium text-gray-500 ml-2">
                |
                <span className="ml-2">{keyword.primaryClient || keyword.clients?.[0]}</span>
              </span>
            ) : null}
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 콘텐츠 - 스크롤 영역 */}
        <div className="px-4 sm:px-6 max-h-[60vh] overflow-y-auto">
          <div className="py-0" onTouchStart={handleModalTouchStart}>

          <div className="space-y-4 sm:space-y-6">
            {/* 키워드 통계 */}
            
            {/* 모바일 뷰 - 컴팩트 리스트 */}
            <div className="md:hidden">
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-600">총 포스팅</span>
                      <span className="text-sm font-medium" style={{color: '#3d66d9'}}>{keyword.totalPostings}건</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-600">재작업</span>
                      <span className="text-sm font-medium" style={{color: '#f15532'}}>{keyword.reworkCount}건</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-600">경쟁강도</span>
                      <div className="flex items-center space-x-1">
                        {getCompetitionIcon(keyword.competitionLevel)}
                        <Badge className={`text-xs ${getCompetitionBadge(keyword.competitionLevel)}`}>
                          {keyword.competitionLevel}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-600">월 검색량</span>
                      <span className="text-sm font-medium" style={{color: '#8946e1'}}>
                        {keyword.monthlySearchVolume?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-600">월 발행량</span>
                      <span className="text-sm font-medium" style={{color: '#3b76e1'}}>
                        {keyword.monthlyPostVolume?.toLocaleString() || "0"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-600">블로그 포화도</span>
                      <span className="text-sm font-medium" style={{color: '#f53b3b'}}>
                        {keyword.blogSaturation?.toFixed(1) || "0"}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-gray-600">5위 안 확률</span>
                      {keyword.isTrackingActive ? (
                        <span className="text-sm font-medium" style={{color: '#059669'}}>{keyword.top5Rate}%</span>
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 데스크톱 뷰 - 그리드 카드 */}
            <div className="hidden md:grid md:grid-cols-7 gap-3 md:gap-4">
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-3 md:p-4">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold" style={{color: '#3d66d9'}}>{keyword.totalPostings}건</div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">총 포스팅</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-3 md:p-4">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold" style={{color: '#f15532'}}>{keyword.reworkCount}건</div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">재작업</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-3 md:p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 md:space-x-2">
                      {getCompetitionIcon(keyword.competitionLevel)}
                      <Badge className={`text-xs ${getCompetitionBadge(keyword.competitionLevel)}`}>
                        {keyword.competitionLevel}
                      </Badge>
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">경쟁강도</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-3 md:p-4">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold" style={{color: '#8946e1'}}>
                      {keyword.monthlySearchVolume?.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">월 검색량</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-3 md:p-4">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold" style={{color: '#3b76e1'}}>
                      {keyword.monthlyPostVolume?.toLocaleString() || "0"}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">월 발행량</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-3 md:p-4">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold" style={{color: '#f53b3b'}}>
                      {keyword.blogSaturation?.toFixed(1) || "0"}%
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">블로그 포화도</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-none">
                <CardContent className="p-3 md:p-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center h-6 md:h-7">
                      {keyword.isTrackingActive ? (
                        <span className="text-lg md:text-xl font-bold" style={{color: '#059669'}}>{keyword.top5Rate}%</span>
                      ) : (
                        <Lock className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">5위 안 확률</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 복합 차트 */}
            <Card className="border border-gray-200 shadow-none gap-0 pt-3">
              <CardHeader className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <CardTitle className="text-sm sm:text-base md:text-lg">
                    순위 변화 및 검색량/발행량 추이
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 md:p-6">
                {/* 모바일: Y축 고정 + 차트만 스크롤 */}
                <div 
                  className="md:hidden h-64 overflow-hidden relative" 
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onClick={handleChartClick}
                  style={{ 
                    cursor: isDragging ? 'grabbing' : 'grab', 
                    pointerEvents: isDragging ? 'none' : 'auto',
                    touchAction: 'none'
                  }}
                >
                  {/* 스크롤 안내 토스트 */}
                  {showScrollToast && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in duration-500">
                      <div className="bg-gray-700 bg-opacity-90 rounded-xl px-4 py-3 flex flex-col items-center gap-2 shadow-lg">
                        {/* 좌우 화살표 아이콘 */}
                        <div className="relative flex items-center justify-center">
                          <ArrowLeft className="h-5 w-5 text-green-400" />
                          <Hand className="h-7 w-7 text-white mx-2 cursor-pointer" />
                          <ArrowRight className="h-5 w-5 text-green-400" />
                        </div>
                        
                        {/* 안내 텍스트 */}
                        <div className="text-center">
                          <p className="text-white text-xs font-medium">좌우로 스크롤 하세요</p>
                        </div>
                        
                        {/* 닫기 버튼 */}
                        <button
                          onClick={() => setShowScrollToast(false)}
                          className="absolute top-1 right-1 text-gray-400 hover:text-white"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                  <Bar
                    data={{
                      labels: visibleData.map(d => {
                        const date = new Date(d.date)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }),
                      datasets: mobileDatasets as unknown as ChartDataset<'bar', number[]>[]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      layout: {
                        padding: {
                          top: 20,
                          bottom: 10,
                          left: 10,
                          right: 10
                        }
                      },
                      interaction: {
                        mode: isDragging ? 'index' : 'index' as const,
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top' as const,
                          labels: {
                            color: '#475569',
                            font: { size: 12 },
                            padding: 12,
                            usePointStyle: true,
                          }
                        },
                        tooltip: {
                          enabled: false,
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          titleColor: '#ffffff',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 2,
                          padding: 20,
                          cornerRadius: 12,
                          callbacks: {
                            title: function(context) {
                              const index = context[0].dataIndex
                              const dateStr = visibleData[index].date
                              const date = new Date(dateStr)
                              return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
                            },
                            label: function(context) {
                              const label = context.dataset.label || ''
                              const parsedValue = typeof context.parsed.y === 'number' ? context.parsed.y : 0
                              if (label === '순위') {
                                return `     ${label}: ${parsedValue}위`
                              } else if (label === '월 검색량' || label === '월 발행량') {
                                return `     ${label}: ${parsedValue.toLocaleString()}`
                              }
                              return `     ${label}: ${parsedValue}`
                            },
                            afterLabel: function(context) {
                              const dataIndex = context.dataIndex
                              const label = context.dataset.label || ''
                              
                              if (dataIndex > 0) {
                                if (label === '순위') {
                                  const currentRank = typeof context.parsed.y === 'number' ? context.parsed.y : 0
                                  const previousRank = visibleData[dataIndex - 1].rank
                                  const change = previousRank - currentRank
                                  const changeText = change > 0
                                    ? `▲ ${change}위 상승`
                                    : change < 0
                                    ? `▼ ${Math.abs(change)}위 하락`
                                    : '― 변화없음'
                                  return `     전일 대비: ${changeText}`
                                } else {
                                  const currentValue = typeof context.parsed.y === 'number' ? context.parsed.y : 0
                                  const previousValue = context.dataset.data[dataIndex - 1] as number
                                  const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
                                  const changeText = currentValue > previousValue
                                    ? `▲ ${change}%`
                                    : currentValue < previousValue
                                    ? `▼ ${Math.abs(Number(change))}%`
                                    : '―'
                                  return `     전일 대비: ${changeText}`
                                }
                              }
                              return ''
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: "#64748b", font: { size: 12 } }
                        },
                        y: {
                          type: 'linear' as const,
                          display: true,
                          position: 'right' as const,
                          grid: { color: 'rgba(226, 232, 240, 0.5)' },
                          min: 0,
                          max: Math.max(...keyword.rankingHistory.map(d => d.searchVolume), ...keyword.rankingHistory.map(d => d.monthlyPosts)),
                          ticks: { 
                            color: "#64748b", 
                            font: { size: 12 },
                            callback: function(value) {
                              return `${(Number(value) / 1000).toFixed(0)}k`
                            }
                          },
                          title: {
                            display: true,
                            text: '검색량/발행량',
                            color: '#64748b',
                            font: { size: 11, weight: 'bold' }
                          }
                        },
                        y1: {
                          type: 'linear' as const,
                          display: showRankingData,
                          position: 'left' as const,
                          grid: { display: false },
                          reverse: true,
                          ticks: { 
                            color: "#64748b", 
                            font: { size: 12 },
                            callback: function(value) {
                              return value + '위'
                            }
                          },
                          title: {
                            display: showRankingData,
                            text: '순위 (낮을수록 상위)',
                            color: '#64748b',
                            font: { size: 11, weight: 'bold' }
                          },
                          min: 0.5,
                          max: 20.5,
                          offset: true
                        }
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutCubic',
                        delay: (context) => {
                          let delay = 0
                          if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 80
                          }
                          return delay
                        }
                      }
                    }}
                  />
                </div>

                {/* 데스크톱: 전체 데이터 */}
                <div className="hidden md:block h-64 sm:h-72 md:h-80">
                  <Bar
                    data={{
                      labels: chartData.map(d => {
                        const date = new Date(d.date)
                        return `${date.getMonth() + 1}/${date.getDate()}`
                      }),
                      datasets: desktopDatasets as unknown as ChartDataset<'bar', number[]>[]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      layout: {
                        padding: {
                          top: 20,
                          bottom: 10,
                          left: 10,
                          right: 10
                        }
                      },
                      interaction: {
                        mode: 'index' as const,
                        intersect: false,
                      },
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top' as const,
                          labels: {
                            color: '#475569',
                            font: { size: 12 },
                            padding: 12,
                            usePointStyle: true,
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(15, 23, 42, 0.95)',
                          titleColor: '#ffffff',
                          bodyColor: '#e2e8f0',
                          borderColor: '#475569',
                          borderWidth: 2,
                          padding: 20,
                          cornerRadius: 12,
                          callbacks: {
                            title: function(context) {
                              const index = context[0].dataIndex
                              const dateStr = keyword.rankingHistory[index].date
                              const date = new Date(dateStr)
                              return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
                            },
                            label: function(context) {
                              const label = context.dataset.label || ''
                              const parsedValue = typeof context.parsed.y === 'number' ? context.parsed.y : 0
                              if (label === '순위') {
                                return `     ${label}: ${parsedValue}위`
                              } else if (label === '월 검색량' || label === '월 발행량') {
                                return `     ${label}: ${parsedValue.toLocaleString()}`
                              }
                              return `     ${label}: ${parsedValue}`
                            },
                            afterLabel: function(context) {
                              const dataIndex = context.dataIndex
                              const label = context.dataset.label || ''
                              
                              if (dataIndex > 0) {
                                if (label === '순위') {
                                  const currentRank = typeof context.parsed.y === 'number' ? context.parsed.y : 0
                                  const previousRank = chartData[dataIndex - 1].rank
                                  const change = previousRank - currentRank
                                  const changeText = change > 0
                                    ? `▲ ${change}위 상승`
                                    : change < 0
                                    ? `▼ ${Math.abs(change)}위 하락`
                                    : '― 변화없음'
                                  return `     전일 대비: ${changeText}`
                                } else {
                                  const currentValue = typeof context.parsed.y === 'number' ? context.parsed.y : 0
                                  const previousValue = context.dataset.data[dataIndex - 1] as number
                                  const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
                                  const changeText = currentValue > previousValue
                                    ? `▲ ${change}%`
                                    : currentValue < previousValue
                                    ? `▼ ${Math.abs(Number(change))}%`
                                    : '―'
                                  return `     전일 대비: ${changeText}`
                                }
                              }
                              return ''
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: { display: false },
                          ticks: { color: "#64748b", font: { size: 12 } }
                        },
                        y: {
                          type: 'linear' as const,
                          display: true,
                          position: 'right' as const,
                          grid: { color: 'rgba(226, 232, 240, 0.5)' },
                          ticks: { 
                            color: "#64748b", 
                            font: { size: 12 },
                            callback: function(value) {
                              return `${(Number(value) / 1000).toFixed(0)}k`
                            }
                          },
                          title: {
                            display: true,
                            text: '검색량/발행량',
                            color: '#64748b',
                            font: { size: 11, weight: 'bold' }
                          }
                        },
                        y1: {
                          type: 'linear' as const,
                          display: showRankingData,
                          position: 'left' as const,
                          grid: { display: false },
                          reverse: true,
                          ticks: { 
                            color: "#64748b", 
                            font: { size: 12 },
                            callback: function(value) {
                              return value + '위'
                            }
                          },
                          title: {
                            display: showRankingData,
                            text: '순위 (낮을수록 상위)',
                            color: '#64748b',
                            font: { size: 11, weight: 'bold' }
                          },
                          min: 0.5,
                          max: 20.5,
                          offset: true
                        }
                      },
                      animation: {
                        duration: 2000,
                        easing: 'easeInOutCubic',
                        delay: (context) => {
                          let delay = 0
                          if (context.type === 'data' && context.mode === 'default') {
                            delay = context.dataIndex * 80
                          }
                          return delay
                        }
                      }
                    }}
                  />
                </div>

                <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-sm opacity-80"></div>
                    <span className="text-xs sm:text-sm text-slate-600">월 검색량</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm" style={{backgroundColor: '#51ab23', opacity: 0.8}}></div>
                    <span className="text-xs sm:text-sm text-slate-600">월 발행량</span>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{backgroundColor: '#f53b3b', opacity: 0.8}}></div>
                    <span className="text-xs sm:text-sm text-slate-600">순위</span>
                  </div>
                </div>

                {/* 모바일: 하단 정보 박스 */}
                {selectedChartData && (
                  <div className="md:hidden mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-sm font-semibold text-gray-900 mb-3">
                      {new Date(selectedChartData.date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="space-y-2">
                      {/* 순위 */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">순위</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-red-600">
                            {visibleData[selectedChartData.index]?.rank || '-'}위
                          </div>
                          {selectedChartData.index > 0 && (
                            <div className="text-xs text-gray-500">
                              {(() => {
                                const currentRank = visibleData[selectedChartData.index]?.rank || 0
                                const previousRank = visibleData[selectedChartData.index - 1]?.rank || 0
                                const change = previousRank - currentRank
                                if (change > 0) {
                                  return `▲ ${change}위 상승`
                                } else if (change < 0) {
                                  return `▼ ${Math.abs(change)}위 하락`
                                } else {
                                  return '― 변화없음'
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 월 검색량 */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">월 검색량</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-blue-600">
                            {visibleData[selectedChartData.index]?.searchVolume.toLocaleString() || '-'}
                          </div>
                          {selectedChartData.index > 0 && (
                            <div className="text-xs text-gray-500">
                              {(() => {
                                const current = visibleData[selectedChartData.index]?.searchVolume || 0
                                const previous = visibleData[selectedChartData.index - 1]?.searchVolume || 0
                                if (previous === 0) return '-'
                                const change = ((current - previous) / previous * 100).toFixed(1)
                                if (current > previous) {
                                  return `▲ ${change}%`
                                } else if (current < previous) {
                                  return `▼ ${Math.abs(Number(change))}%`
                                } else {
                                  return '―'
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 월 발행량 */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">월 발행량</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold" style={{color: '#51ab23'}}>
                            {visibleData[selectedChartData.index]?.monthlyPosts || '-'}
                          </div>
                          {selectedChartData.index > 0 && (
                            <div className="text-xs text-gray-500">
                              {(() => {
                                const current = visibleData[selectedChartData.index]?.monthlyPosts || 0
                                const previous = visibleData[selectedChartData.index - 1]?.monthlyPosts || 0
                                if (previous === 0) return '-'
                                const change = ((current - previous) / previous * 100).toFixed(1)
                                if (current > previous) {
                                  return `▲ ${change}%`
                                } else if (current < previous) {
                                  return `▼ ${Math.abs(Number(change))}%`
                                } else {
                                  return '―'
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 포스팅 상세 목록 */}
            <Card className="border border-gray-200 shadow-none gap-0 pt-0">
              <CardHeader className="px-3 sm:px-4 md:px-6 gap-0 py-6">
                <CardTitle className="text-sm sm:text-base md:text-lg">포스팅 상세 목록 ({keyword.postingDetails.length}건)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* 모바일 카드 뷰 */}
                <div className="block md:hidden space-y-3 p-3">
                  {keyword.postingDetails.map((posting) => (
                    <Card key={posting.id} className="border border-gray-200 shadow-none">
                      <CardContent className="p-3 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="font-medium text-sm">#{posting.id.toString().padStart(3, "0")}</div>
                          <Badge
                            variant="secondary"
                            className={
                              posting.category === "재작업"
                                ? "bg-orange-50 text-orange-700 border border-orange-200 text-xs"
                                : "bg-blue-50 text-blue-700 border border-blue-200 text-xs"
                            }
                          >
                            {posting.category}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{posting.title}</div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-500">고객사</div>
                            {posting.client ? (
                              <Badge variant="outline" className="bg-transparent border border-blue-300 text-blue-700 mt-1">
                                {posting.client}
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400 mt-1">미지정</span>
                            )}
                          </div>
                          <div>
                            <div className="text-gray-500">현재 순위</div>
                            {keyword.isTrackingActive ? (
                              <Badge
                                className={`mt-1 ${
                                  posting.currentRank <= 3
                                    ? "bg-transparent text-green-700 border border-green-300"
                                    : posting.currentRank <= 10
                                      ? "bg-transparent text-yellow-700 border border-yellow-300"
                                      : "bg-transparent text-red-700 border border-red-300"
                                }`}
                              >
                                {posting.currentRank}위
                              </Badge>
                            ) : (
                              <span className="mt-1 inline-block text-xs text-gray-400">-</span>
                            )}
                          </div>
                          <div>
                            <div className="text-gray-500">등록일</div>
                            <div className="mt-1">{posting.registeredDate}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">담당자</div>
                            <div className="mt-1">{posting.manager}</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <div className="text-gray-500 text-xs mb-1">블로그 URL</div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 text-xs font-mono truncate flex-1">
                              {posting.blogUrl}
                            </span>
                            <div className="flex gap-1 flex-shrink-0">
                              <button
                                onClick={() => onCopyToClipboard(posting.blogUrl)}
                                className="text-gray-400 hover:text-gray-600 p-1.5 rounded hover:bg-gray-100"
                                title="URL 복사"
                                type="button"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </button>
                              <a
                                href={posting.blogUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-50"
                                title="새 탭에서 열기"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* 데스크톱 테이블 뷰 */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-100">
                      <TableRow className="!border-b !border-gray-200">
                        <TableHead className="w-[80px] text-left pl-6 py-4 font-semibold text-gray-700">ID</TableHead>
                        <TableHead className="w-[300px] text-left py-4 font-semibold text-gray-700">제목</TableHead>
                        <TableHead className="w-[120px] text-left py-4 font-semibold text-gray-700">고객사</TableHead>
                        <TableHead className="w-[100px] text-left py-4 font-semibold text-gray-700">현재 순위</TableHead>
                        <TableHead className="w-[120px] text-left py-4 font-semibold text-gray-700">등록일</TableHead>
                        <TableHead className="w-[100px] text-left py-4 font-semibold text-gray-700">구분</TableHead>
                        <TableHead className="w-[160px] text-left py-4 font-semibold text-gray-700">담당자</TableHead>
                        <TableHead className="text-left py-4 font-semibold text-gray-700">블로그 URL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {keyword.postingDetails.map((posting) => (
                        <TableRow key={posting.id} className="border-b border-gray-100">
                          <TableCell className="pl-6 py-4 font-medium text-gray-800" style={{fontSize: '13px'}}>
                            #{posting.id.toString().padStart(3, "0")}
                          </TableCell>
                          <TableCell className="py-4 max-w-xs">
                            <div className="truncate text-gray-800" title={posting.title} style={{fontSize: '13px'}}>
                              {posting.title}
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            {posting.client ? (
                              <Badge variant="outline" className="bg-transparent border border-blue-300 text-blue-700" style={{fontSize: '13px'}}>
                                {posting.client}
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400" style={{fontSize: '13px'}}>미지정</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4">
                            {keyword.isTrackingActive ? (
                              <Badge
                                className={
                                  posting.currentRank <= 3
                                    ? "bg-transparent text-green-700 border border-green-300"
                                    : posting.currentRank <= 10
                                      ? "bg-transparent text-yellow-700 border border-yellow-300"
                                      : "bg-transparent text-red-700 border border-red-300"
                                }
                                style={{fontSize: '13px'}}
                              >
                                {posting.currentRank}위
                              </Badge>
                            ) : (
                              <span className="text-xs text-gray-400" style={{fontSize: '13px'}}>-</span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-gray-800" style={{fontSize: '13px'}}>{posting.registeredDate}</TableCell>
                          <TableCell className="py-4">
                            <Badge
                              variant="secondary"
                              className={
                                posting.category === "재작업"
                                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }
                              style={{fontSize: '13px'}}
                            >
                              {posting.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4 text-gray-800" style={{fontSize: '13px'}}>
                            {posting.manager} ({posting.teamName})
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-600 text-xs font-mono truncate max-w-xs" title={posting.blogUrl}>
                                {posting.blogUrl}
                              </span>
                              <div className="flex space-x-1 flex-shrink-0">
                                <button
                                  onClick={() => onCopyToClipboard(posting.blogUrl)}
                                  className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                  title="URL 복사"
                                  type="button"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                                <a
                                  href={posting.blogUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                  title="새 탭에서 열기"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* 고객사 정보 */}
            <Card className="border border-gray-200 shadow-none gap-0 pt-0">
              <CardHeader className="px-3 sm:px-4 md:px-6 gap-0 py-6">
                <CardTitle className="text-sm sm:text-base md:text-lg">고객사</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-wrap gap-2 px-3 sm:px-4 md:px-6 py-3">
                  {keyword.primaryClient || keyword.clients?.[0] ? (
                    <Badge variant="outline" className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm">
                      {keyword.primaryClient || keyword.clients?.[0]}
                    </Badge>
                  ) : (
                    <span className="text-xs sm:text-sm text-gray-400 px-2 py-0.5 sm:px-3 sm:py-1">
                      미지정
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end px-4 sm:px-6 py-4 sm:py-6">
          <Button
            onClick={onClose}
            className="h-11 sm:h-12 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors font-bold rounded-xl px-4 sm:px-6"
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
