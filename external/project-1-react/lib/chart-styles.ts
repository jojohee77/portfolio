// 막대 차트 기본 스타일
export const barChartStyle = {
  borderRadius: 6,
  borderWidth: 1,
  barPercentage: 0.7,
  categoryPercentage: 0.8,
}

// 키워드 성과 분석 막대 차트 스타일
export const performanceBarStyle = {
  borderRadius: 8,
  borderWidth: 0,
  barPercentage: 0.7,
  categoryPercentage: 0.8,
}

// 라인 차트 스타일
export const lineChartStyle = {
  borderWidth: 3,
  tension: 0.4,
  pointRadius: 6,
  pointHoverRadius: 10,
  pointBorderWidth: 3,
}

// 범례 공통 설정
export const legendConfig = {
  display: true,
  position: 'top' as const,
  labels: {
    color: '#475569',
    font: { size: 12 },
    padding: 12,
    usePointStyle: true,
  },
}

// 툴팁 공통 설정
export const tooltipConfig = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',
  titleColor: '#ffffff',
  bodyColor: '#e2e8f0',
  borderColor: '#475569',
  borderWidth: 0,
  padding: 16,
  cornerRadius: 12,
}

// 공통 옵션
export const commonChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
}

// X축 공통 설정
export const xAxisConfig = {
  grid: { display: false },
  ticks: { color: '#475569', font: { size: 11 } },
}

// Y축 공통 설정
export const yAxisConfig = {
  grid: { color: 'rgba(226, 232, 240, 0.5)' },
  ticks: { color: '#475569', font: { size: 11 } },
}

// Y축 레이블 콜백 (짝수만 표시)
export const yAxisTicksCallback = (value: number | string) => {
  const numValue = typeof value === 'string' ? parseInt(value) : value
  if (numValue % 2 === 0) {
    return numValue
  }
  return ''
}

// 데이터 최대값에 따라 적절한 stepSize 계산
export function getYAxisStepSize(maxValue: number): number {
  if (maxValue <= 10) return 2
  if (maxValue <= 20) return 5
  if (maxValue <= 50) return 10
  if (maxValue <= 100) return 20
  return Math.ceil(maxValue / 5)
}

// 반응형 창 너비에 따라 동적 막대 차트 스타일 계산
export function getResponsiveBarStyle(containerWidth: number, maxBarWidth: number = 110) {
  // 모바일: 350px 이하
  if (containerWidth <= 350) {
    return {
      borderRadius: 6,
      borderWidth: 1,
      barPercentage: 0.85,        // 더 넓은 막대
      categoryPercentage: 0.95,   // 줄어든 카테고리 간격
      maxBarThickness: maxBarWidth,
    }
  }
  
  // 타블렛 소형: 351px ~ 600px
  if (containerWidth <= 600) {
    return {
      borderRadius: 6,
      borderWidth: 1,
      barPercentage: 0.8,         // 중간 너비
      categoryPercentage: 0.9,
      maxBarThickness: maxBarWidth,
    }
  }
  
  // 타블렛 대형: 601px ~ 900px
  if (containerWidth <= 900) {
    return {
      borderRadius: 6,
      borderWidth: 1,
      barPercentage: 0.75,
      categoryPercentage: 0.85,
      maxBarThickness: maxBarWidth,
    }
  }
  
  // 데스크톱: 901px 이상
  return {
    borderRadius: 6,
    borderWidth: 1,
    barPercentage: 0.7,          // 기본값
    categoryPercentage: 0.8,
    maxBarThickness: maxBarWidth,
  }
}

// 반응형 성과분석 막대 차트 스타일
export function getResponsivePerformanceBarStyle(containerWidth: number, maxBarWidth: number = 110) {
  // 모바일: 350px 이하
  if (containerWidth <= 350) {
    return {
      borderRadius: 8,
      borderWidth: 0,
      barPercentage: 0.85,
      categoryPercentage: 0.95,
      maxBarThickness: maxBarWidth,
    }
  }
  
  // 타블렛 소형: 351px ~ 600px
  if (containerWidth <= 600) {
    return {
      borderRadius: 8,
      borderWidth: 0,
      barPercentage: 0.8,
      categoryPercentage: 0.9,
      maxBarThickness: maxBarWidth,
    }
  }
  
  // 타블렛 대형: 601px ~ 900px
  if (containerWidth <= 900) {
    return {
      borderRadius: 8,
      borderWidth: 0,
      barPercentage: 0.75,
      categoryPercentage: 0.85,
      maxBarThickness: maxBarWidth,
    }
  }
  
  // 데스크톱: 901px 이상
  return {
    borderRadius: 8,
    borderWidth: 0,
    barPercentage: 0.7,
    categoryPercentage: 0.8,
    maxBarThickness: maxBarWidth,
  }
}

// 성과분석 차트 색상 결정 함수
interface PerformanceData {
  percentage: number
  name?: string
  [key: string]: any
}

export function getPerformanceBarColors(performanceData: PerformanceData[]) {
  return performanceData.map(d => {
    if (d.name === '1위 달성') return '#3b82f6'       // 블루
    if (d.name === '5위 안 진입') return '#60a5fa'    // 연블루
    if (d.name === '10위 안 진입') return '#B0B8C2'   // 그레이톤
    if (d.name === '재작업 필요') return '#ef4444'    // 레드
    return '#3b82f6'
  })
}

// 공통 차트 색상 팔레트
export const chartColors = {
  primary: '#3b82f6',      // 블루
  secondary: '#34C44E',    // 그린
  accent: '#F59E0B',       // 오렌지
  purple: '#8367E9',      // 퍼플
  gray: '#B0B8C2',        // 그레이
  teal: '#00ADB6',        // 틸
  red: '#ef4444',         // 레드
}