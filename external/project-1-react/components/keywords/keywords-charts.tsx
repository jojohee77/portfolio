"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Bar, Line } from "react-chartjs-2"
import { useEffect, useRef, useState } from "react"
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
} from "chart.js"
import {
  barChartStyle,
  performanceBarStyle,
  lineChartStyle,
  legendConfig,
  tooltipConfig,
  commonChartOptions,
  xAxisConfig,
  yAxisConfig,
  yAxisTicksCallback,
  getYAxisStepSize,
  getPerformanceBarColors,
  getResponsiveBarStyle,
  getResponsivePerformanceBarStyle,
} from "@/lib/chart-styles"

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
)

interface CompetitionData {
  name: string
  value: number
  avgRank: number
  color: string
}

interface PerformanceData {
  name: string
  value: number
  total: number
  percentage: number
}

interface KeywordsChartsProps {
  competitionData: CompetitionData[]
  performanceData: PerformanceData[]
  maxCompetitionValue?: number
}

export function KeywordsCharts({ competitionData, performanceData, maxCompetitionValue = 0 }: KeywordsChartsProps) {
  const yStepSize = maxCompetitionValue > 0 ? getYAxisStepSize(maxCompetitionValue) : 2
  const containerRef1 = useRef<HTMLDivElement>(null)
  const containerRef2 = useRef<HTMLDivElement>(null)
  const [containerWidth1, setContainerWidth1] = useState(0)
  const [containerWidth2, setContainerWidth2] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef1.current) {
        setContainerWidth1(containerRef1.current.offsetWidth)
      }
      if (containerRef2.current) {
        setContainerWidth2(containerRef2.current.offsetWidth)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const responsiveBarStyle = getResponsiveBarStyle(containerWidth1)
  const responsivePerformanceStyle = getResponsivePerformanceBarStyle(containerWidth2)
  
  // 데이터가 있는 항목만 필터링 (값이 0인 항목 제외)
  const filteredCompetitionData = competitionData.filter((item) => item.value > 0 && item.avgRank > 0)
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 경쟁강도별 평균 순위 */}
      <Card className="shadow-none rounded-xl border border-gray-200 py-4 sm:py-6">
        <CardHeader>
          <CardTitle>경쟁강도별 평균 순위</CardTitle>
          <p className="text-sm text-gray-600">경쟁강도에 따른 키워드 분포와 평균 순위</p>
        </CardHeader>
        <CardContent>
          <div ref={containerRef1} className="h-64">
            <Bar
              data={{
                labels: filteredCompetitionData.map(d => d.name),
                datasets: [
                  {
                    type: 'line' as const,
                    label: '평균 순위',
                    data: filteredCompetitionData.map(d => d.avgRank),
                    borderColor: '#37C53C',
                    backgroundColor: 'transparent',
                    borderWidth: lineChartStyle.borderWidth,
                    tension: lineChartStyle.tension,
                    pointRadius: lineChartStyle.pointRadius,
                    pointHoverRadius: lineChartStyle.pointHoverRadius,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#37C53C',
                    pointBorderWidth: lineChartStyle.pointBorderWidth,
                    yAxisID: 'y1',
                  },
                  {
                    type: 'bar' as const,
                    label: '키워드 수',
                    data: filteredCompetitionData.map(d => d.value),
                    backgroundColor: filteredCompetitionData.map(d => d.color),
                    borderColor: filteredCompetitionData.map(d => d.color),
                    borderWidth: barChartStyle.borderWidth,
                    borderRadius: barChartStyle.borderRadius,
                    barPercentage: responsiveBarStyle.barPercentage,
                    categoryPercentage: responsiveBarStyle.categoryPercentage,
                    yAxisID: 'y',
                  },
                ]
              }}
              options={{
                ...commonChartOptions,
                layout: {
                  padding: {
                    top: 10,
                    bottom: 10,
                    left: 0,
                    right: 0
                  }
                },
                plugins: {
                  legend: legendConfig,
                  tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                      label: function(context) {
                        const label = context.dataset.label || ''
                        if (label === '키워드 수') {
                          return `     ${label}: ${context.parsed.y}`
                        } else if (label === '평균 순위') {
                          return `     ${label}: ${context.parsed.y.toFixed(1)}`
                        }
                        return `     ${label}: ${context.parsed.y}`
                      }
                    }
                  }
                },
                scales: {
                  x: xAxisConfig,
                  y: {
                    type: 'linear' as const,
                    display: true,
                    position: 'left' as const,
                    grid: { color: 'rgba(226, 232, 240, 0.5)' },
                    ticks: { 
                      color: "#475569", 
                      font: { size: 11 },
                      stepSize: yStepSize,
                      callback: function(value) {
                        return value
                      }
                    },
                    title: {
                      display: true,
                      text: '키워드 수',
                      color: '#475569',
                      font: { size: 11, weight: 'bold' }
                    }
                  },
                  y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    grid: { display: false },
                    reverse: true,
                    ticks: { 
                      color: "#475569", 
                      font: { size: 11 },
                      stepSize: 5,
                      callback: function(value) {
                        // 정수만 표시
                        if (Number.isInteger(value) && value >= 1) {
                          return value
                        }
                        return ''
                      }
                    },
                    title: {
                      display: true,
                      text: '평균 순위',
                      color: '#475569',
                      font: { size: 11, weight: 'bold' }
                    },
                    min: 1,
                    max: 21
                  }
                },
                animation: {
                  duration: 1500,
                  easing: 'easeInOutCubic',
                  delay: (context) => {
                    let delay = 0
                    if (context.type === 'data' && context.mode === 'default') {
                      delay = context.dataIndex * 100
                    }
                    return delay
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {filteredCompetitionData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs">
                    {item.name} ({item.value}개, 평균 {item.avgRank.toFixed(1)}위)
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* 키워드 성과 분석 */}
      <Card className="shadow-none rounded-xl border border-gray-200 py-4 sm:py-6">
        <CardHeader>
          <CardTitle>키워드 성과 분석</CardTitle>
          <p className="text-sm text-gray-600">목표 순위 달성률과 재작업 현황</p>
        </CardHeader>
        <CardContent>
          <div ref={containerRef2} className="h-64">
            <Bar
              data={{
                labels: performanceData.map(d => d.name),
                datasets: [{
                  label: '달성률',
                  data: performanceData.map(d => d.percentage),
                  backgroundColor: getPerformanceBarColors(performanceData),
                  borderColor: getPerformanceBarColors(performanceData),
                  borderWidth: performanceBarStyle.borderWidth,
                  borderRadius: performanceBarStyle.borderRadius,
                  barPercentage: responsivePerformanceStyle.barPercentage,
                  categoryPercentage: responsivePerformanceStyle.categoryPercentage,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    ...tooltipConfig,
                    callbacks: {
                      label: function(context) {
                        const index = context.dataIndex
                        const item = performanceData[index]
                        return [
                          `     달성률: ${context.parsed.y}`,
                          `     키워드 수: ${item.value}/${item.total}개`
                        ]
                      }
                    }
                  }
                },
                scales: {
                  x: xAxisConfig,
                  y: {
                    grid: { color: 'rgba(226, 232, 240, 0.5)' },
                    ticks: { 
                      color: "#475569", 
                      font: { size: 11 },
                      stepSize: 20,
                      callback: function(value) {
                        return value
                      }
                    },
                    min: 0,
                    max: 100
                  }
                },
                animation: {
                  duration: 1500,
                  easing: 'easeInOutCubic',
                  delay: (context) => context.dataIndex * 100
                }
              }}
            />
          </div>
          <div className="mt-4 space-y-2">
            {performanceData.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-xs">
                <span className="text-gray-600">{item.name}</span>
                <span className="text-gray-900">
                  {item.percentage}% ({item.value}/{item.total}개)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
