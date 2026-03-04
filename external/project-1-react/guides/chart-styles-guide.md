# 차트 스타일 가이드

## 📋 개요

AgOffice의 모든 차트는 **`lib/chart-styles.ts`** 에서 중앙 집중식으로 관리됩니다. 이를 통해 일관된 스타일링과 쉬운 유지보수가 가능합니다.

---

## 🎨 차트 스타일 구조

```
lib/chart-styles.ts
├── 막대 차트 스타일
│   ├── barChartStyle (기본)
│   └── performanceBarStyle (성과분석 전용)
├── 라인 차트 스타일
│   └── lineChartStyle
├── 공통 설정
│   ├── legendConfig (범례)
│   ├── tooltipConfig (툴팁)
│   ├── commonChartOptions (기본 옵션)
│   ├── xAxisConfig (X축)
│   └── yAxisConfig (Y축)
└── 유틸리티 함수
    ├── getYAxisStepSize() (동적 stepSize)
    └── getPerformanceBarColors() (색상 결정)
```

---

## 📦 각 스타일 항목 상세 설명

### 1. **막대 차트 스타일**

#### `barChartStyle` - 기본 막대 차트
```typescript
export const barChartStyle = {
  borderRadius: 6,           // 모서리 둥글기
  borderWidth: 1,            // 테두리 두께
  barPercentage: 0.7,        // 막대 너비 비율 (0~1)
  categoryPercentage: 0.8,   // 카테고리 간격 비율
}
```

**사용 예:**
- 경쟁강도별 평균 순위 차트
- 키워드 분포 차트

#### `performanceBarStyle` - 성과분석 막대 차트
```typescript
export const performanceBarStyle = {
  borderRadius: 8,
  borderWidth: 0,            // 보더 없음 (깔끔한 외관)
  barPercentage: 0.7,
  categoryPercentage: 0.8,
}
```

**사용 예:**
- 키워드 성과 분석 차트 (1위/5위/10위/재작업)

---

### 2. **라인 차트 스타일**

```typescript
export const lineChartStyle = {
  borderWidth: 3,            // 선 두께
  tension: 0.4,              // 선의 곡선 정도 (0=직선, 1=매우 곡선)
  pointRadius: 6,            // 포인트 크기
  pointHoverRadius: 10,      // 호버 시 포인트 크기
  pointBorderWidth: 3,       // 포인트 테두리 두께
}
```

**사용 예:**
- 평균 순위 추이 선 그래프
- 매출 추이 선 그래프

---

### 3. **범례 설정**

```typescript
export const legendConfig = {
  display: true,                    // 범례 표시 여부
  position: 'top' as const,         // 위치: top, bottom, left, right
  labels: {
    color: '#475569',               // 텍스트 색상
    font: { size: 12 },             // 폰트 크기
    padding: 12,                    // 범례 아이템 간 패딩
    usePointStyle: true,            // 동그란 점 표시
  },
}
```

---

### 4. **툴팁 설정**

```typescript
export const tooltipConfig = {
  backgroundColor: 'rgba(15, 23, 42, 0.95)',  // 배경색
  titleColor: '#ffffff',                      // 제목 색상
  bodyColor: '#e2e8f0',                       // 본문 색상
  borderColor: '#475569',                     // 테두리 색상
  borderWidth: 0,                             // 테두리 없음
  padding: 16,                                // 내부 여백
  cornerRadius: 12,                           // 모서리 둥글기
}
```

**호버 시 표시되는 정보 상자 스타일**

---

### 5. **Y축 동적 stepSize**

```typescript
export function getYAxisStepSize(maxValue: number): number {
  if (maxValue <= 10) return 2      // 2, 4, 6, 8, 10
  if (maxValue <= 20) return 5      // 5, 10, 15, 20
  if (maxValue <= 50) return 10     // 10, 20, 30, 40, 50
  if (maxValue <= 100) return 20    // 20, 40, 60, 80, 100
  return Math.ceil(maxValue / 5)    // 데이터 크기에 따라 자동
}
```

**데이터 최대값에 따라 자동으로 적절한 간격을 계산합니다.**

---

### 6. **성과분석 차트 색상**

```typescript
export function getPerformanceBarColors(performanceData: PerformanceData[]) {
  return performanceData.map(d => {
    if (d.name === '1위 달성') return '#3b82f6'        // 블루
    if (d.name === '5위 안 진입') return '#60a5fa'     // 연블루
    if (d.name === '10위 안 진입') return '#B0B8C2'    // 그레이톤
    if (d.name === '재작업 필요') return '#ef4444'     // 레드
    return '#3b82f6'
  })
}
```

---

## 🚀 사용 방법

### 1. **Import 하기**

```typescript
import {
  barChartStyle,
  legendConfig,
  tooltipConfig,
  commonChartOptions,
  xAxisConfig,
  yAxisConfig,
  getYAxisStepSize,
} from "@/lib/chart-styles"
```

### 2. **차트에 적용하기**

#### 예: 막대 + 선 혼합 차트

```typescript
<Bar
  data={{
    labels: data.map(d => d.name),
    datasets: [
      {
        type: 'bar' as const,
        label: '수량',
        data: data.map(d => d.value),
        backgroundColor: '#3b82f6',
        borderWidth: barChartStyle.borderWidth,
        borderRadius: barChartStyle.borderRadius,
        barPercentage: barChartStyle.barPercentage,
        categoryPercentage: barChartStyle.categoryPercentage,
      },
      {
        type: 'line' as const,
        label: '추이',
        data: data.map(d => d.trend),
        borderColor: '#37C53C',
        borderWidth: lineChartStyle.borderWidth,
        tension: lineChartStyle.tension,
        pointRadius: lineChartStyle.pointRadius,
      }
    ]
  }}
  options={{
    ...commonChartOptions,
    plugins: {
      legend: legendConfig,
      tooltip: tooltipConfig,
    },
    scales: {
      x: xAxisConfig,
      y: {
        ...yAxisConfig,
        ticks: {
          ...yAxisConfig.ticks,
          stepSize: getYAxisStepSize(maxValue),
          callback: (value) => value, // 숫자만 표시
        }
      }
    }
  }}
/>
```

---

## 🎯 주요 색상 팔레트

| 용도 | 컬러 | HEX |
|------|------|-----|
| 아주좋음 (경쟁강도) | 🔵 | #3b82f6 |
| 좋음 (경쟁강도) | 🔵 | #60a5fa |
| 보통 (경쟁강도) | 🔵 | #93c5fd |
| 나쁨 (경쟁강도) | 🔴 | #f87171 |
| 아주나쁨 (경쟁강도) | 🔴 | #ef4444 |
| 평균 순위 라인 | 🟢 | #37C53C |
| 그레이톤 (배경) | ⚫ | #B0B8C2 |

---

## ✨ 커스터마이징 가이드

### 1. **특정 차트만 다르게 스타일링**

```typescript
// 특정 차트에서만 커스텀 옵션 사용
const customOptions = {
  ...commonChartOptions,
  plugins: {
    legend: {
      ...legendConfig,
      position: 'bottom' as const, // 범례 위치 변경
    },
    tooltip: tooltipConfig,
  },
}
```

### 2. **새로운 스타일 추가**

`lib/chart-styles.ts` 에 새로운 export 추가:

```typescript
// 매출 차트 스타일
export const revenueChartStyle = {
  borderRadius: 4,
  borderWidth: 0,
  barPercentage: 0.6,
  categoryPercentage: 0.7,
}
```

### 3. **반응형 막대 차트 스타일** ⭐ NEW

화면 너비에 따라 자동으로 막대 사이즈를 조정합니다:

```typescript
import { getResponsiveBarStyle, getResponsivePerformanceBarStyle } from "@/lib/chart-styles"

'use client'

import { useEffect, useRef, useState } from 'react'
import { Bar } from 'react-chartjs-2'

export default function MyChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    handleResize() // 초기값
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 반응형 스타일 적용 (기본값: maxBarWidth = 60px)
  const barStyle = getResponsiveBarStyle(containerWidth)

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      <Bar
        data={{
          labels: ['A', 'B', 'C'],
          datasets: [{
            label: '데이터',
            data: [10, 20, 15],
            backgroundColor: '#3b82f6',
            borderRadius: barStyle.borderRadius,
            borderWidth: barStyle.borderWidth,
            barPercentage: barStyle.barPercentage,
            categoryPercentage: barStyle.categoryPercentage,
            maxBarThickness: barStyle.maxBarThickness,  // 👈 최대 너비 제한
          }]
        }}
      />
    </div>
  )
}
```

**최대 너비 커스터마이징:**

```typescript
// 기본값 (60px 최대 너비)
const barStyle = getResponsiveBarStyle(containerWidth)

// 커스텀 최대 너비 (예: 80px)
const barStyle = getResponsiveBarStyle(containerWidth, 80)

// 더 좁은 너비 (예: 40px)
const barStyle = getResponsiveBarStyle(containerWidth, 40)
```

**반응형 기준:**

| 디바이스 | 너비 | barPercentage | categoryPercentage |
|---------|------|---------------|--------------------|
| 📱 모바일 | ≤ 350px | 0.85 | 0.95 |
| 📲 타블렛(소) | 351~600px | 0.8 | 0.9 |
| 📊 타블렛(대) | 601~900px | 0.75 | 0.85 |
| 💻 데스크톱 | > 901px | 0.7 | 0.8 |

### 4. **CSS로 컨테이너 최대 너비 제한** (선택사항)

**방법 2: CSS를 이용한 제한**

```jsx
// 차트 컨테이너에 max-width 적용
<div className="w-full max-w-4xl"> {/* 최대 1024px로 제한 */}
  <Bar data={data} options={options} />
</div>
```

Tailwind 클래스 예시:
- `max-w-2xl` : 최대 672px
- `max-w-3xl` : 최대 768px
- `max-w-4xl` : 최대 896px
- `max-w-5xl` : 최대 1024px
- `max-w-6xl` : 최대 1152px

**Chart.js + CSS 조합 (추천):**

```jsx
<div className="w-full max-w-4xl">
  <div ref={containerRef} className="w-full">
    <Bar data={data} options={options} />
  </div>
</div>
```

이렇게 하면 두 가지 제약이 동시에 적용됩니다:
- 📏 **CSS max-width**: 전체 컨테이너의 최대 너비
- 📊 **Chart.js maxBarThickness**: 개별 막대의 최대 너비

### 5. **색상 변경**

색상을 변경하려면 차트 데이터에서 직접 지정:

```typescript
backgroundColor: '#ff6b6b', // 이 색상으로 덮어쓰기
borderColor: '#ff6b6b',
```

---

## 📊 현재 적용된 차트들

| 페이지 | 차트 | 사용 스타일 | 반응형 |
|--------|------|----------|---------|
| `/status/keywords` | 경쟁강도별 평균 순위 | barChartStyle + lineChartStyle | ✅ |
| `/status/keywords` | 키워드 성과 분석 | performanceBarStyle | ✅ |
| `/status/performance` | 성과 분석 (Line) | lineChartStyle | ❌ |
| `/status/revenue` | 매출 분석 (Bar) | barChartStyle | ✅ |

---

## 🔧 문제 해결

### Q1: 막대가 너무 커요
**A:** `maxBarWidth` 파라미터를 줄이세요. `getResponsiveBarStyle(containerWidth, 40)`

### Q2: 막대가 너무 작아요
**A:** `maxBarWidth` 파라미터를 늘리세요. `getResponsiveBarStyle(containerWidth, 80)`

### Q3: Y축 레이블이 너무 많이 표시되어요
**A:** `getYAxisStepSize()` 함수를 사용해 자동 계산하거나, `stepSize`를 직접 지정하세요.

### Q4: 툴팁에 원하는 정보가 표시되지 않아요
**A:** `tooltip` 설정의 `callbacks.label` 함수를 커스터마이징하세요.

### Q5: 막대 사이에 틈이 보여요
**A:** `barPercentage` 값을 증가시키세요 (기본값 0.7 → 0.8~0.9)

### 매개변수 설명

#### `getResponsiveBarStyle(containerWidth, maxBarWidth?)`

| 매개변수 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `containerWidth` | number | 필수 | 차트 컨테이너의 너비 (px) |
| `maxBarWidth` | number | 60 | 막대의 최대 너비 (px) |

**예시:**

```typescript
// 예: 데이터가 많지 않은 차트 (좁은 막대 원함)
const barStyle = getResponsiveBarStyle(containerWidth, 40)

// 예: 데이터가 적은 차트 (넓은 막대 원함)
const barStyle = getResponsiveBarStyle(containerWidth, 80)

// 예: 수평 공간을 많이 차지할 수 있는 차트
const barStyle = getResponsiveBarStyle(containerWidth, 100)
```

---

## 📚 참고 자료

- [Chart.js 공식 문서](https://www.chartjs.org/)
- [Chart.js 색상 가이드](https://www.chartjs.org/docs/latest/general/colors.html)
- [Chart.js 옵션 참조](https://www.chartjs.org/docs/latest/general/options.html)
