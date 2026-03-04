# Chart.js 차트 가이드

## 📊 개요

AGOFFICE 프로젝트에서는 **Chart.js**를 사용하여 데이터 시각화를 구현합니다. Chart.js는 강력한 커스터마이징, 애니메이션, 인터랙션을 제공하는 오픈소스 차트 라이브러리입니다.

## 🎯 주요 기능

- ✨ **순차적 애니메이션**: 데이터가 순차적으로 나타나는 효과
- 📊 **전월 대비 증감률**: 툴팁에서 자동 계산
- 📉 **하락 구간 점선**: 값이 하락하는 구간 시각적 표시
- 🎨 **세련된 툴팁**: 다크 테마의 고급 툴팁
- 🎯 **호버 효과**: 포인트 확대 및 색상 변경

## 📦 설치

```bash
pnpm add chart.js react-chartjs-2
```

## 📝 기본 사용법

### 1. Import 및 등록

```tsx
"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js"

// Chart.js 등록 (필수!)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
)
```

### 2. 기본 차트

```tsx
export default function ChartExample() {
  const data = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [
      {
        label: '매출',
        data: [75000000, 78000000, 82000000, 85000000, 88000000, 91000000],
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
        borderWidth: 4,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 10,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 3,
        fill: false,
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 2,
        padding: 20,
        cornerRadius: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#475569" },
      },
      y: {
        grid: { color: 'rgba(226, 232, 240, 0.5)' },
        ticks: { color: "#475569" },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutCubic',
    },
  }

  return (
    <div className="w-full h-[400px]">
      <Line data={data} options={options} />
    </div>
  )
}
```

## 🚀 고급 기능

### 1. 순차적 애니메이션

```tsx
animation: {
  duration: 2000,
  easing: 'easeInOutCubic',
  delay: (context) => {
    let delay = 0
    if (context.type === 'data' && context.mode === 'default') {
      delay = context.dataIndex * 100 // 각 포인트마다 100ms 간격
    }
    return delay
  },
}
```

### 2. 전월 대비 증감률 표시

```tsx
tooltip: {
  callbacks: {
    afterLabel: function(context) {
      const dataIndex = context.dataIndex
      if (dataIndex > 0) {
        const currentValue = context.parsed.y || 0
        const previousValue = context.dataset.data[dataIndex - 1] as number
        const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1)
        const changeText = currentValue > previousValue
          ? `▲ ${change}%`
          : currentValue < previousValue
          ? `▼ ${Math.abs(Number(change))}%`
          : '―'
        return `     전월대비: ${changeText}`
      }
      return ''
    }
  }
}
```

### 3. 하락 구간 점선 표시

```tsx
datasets: [{
  // ... 다른 설정
  segment: {
    borderDash: (ctx: any) => {
      const value = ctx.p0.$context.parsed.y
      const nextValue = ctx.p1.$context.parsed.y
      return value > nextValue ? [6, 6] : undefined // 하락 시 점선
    }
  }
}]
```

### 4. 다중 라인 차트

```tsx
const teamColors = {
  "1팀": "#3b82f6",
  "2팀": "#10B981",
  "3팀": "#F59E0B",
  "4팀": "#8b5cf6",
}

const data = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  datasets: Object.keys(teamColors).map((teamName) => ({
    label: teamName,
    data: chartData.map((item) => item[teamName]),
    borderColor: teamColors[teamName as keyof typeof teamColors],
    backgroundColor: 'transparent',
    borderWidth: 4,
    tension: 0.4,
    pointRadius: 6,
    pointHoverRadius: 10,
    fill: false,
  }))
}
```

## 📋 주요 옵션

### Chart Options

| 옵션 | 타입 | 설명 |
|------|------|------|
| `responsive` | boolean | 반응형 크기 조절 (기본: true) |
| `maintainAspectRatio` | boolean | 가로세로 비율 유지 (기본: false) |
| `animation.duration` | number | 애니메이션 지속 시간 (ms) |
| `animation.easing` | string | 애니메이션 효과 (easeInOutCubic 등) |

### Dataset Options

| 옵션 | 타입 | 설명 |
|------|------|------|
| `borderColor` | string | 라인 색상 |
| `borderWidth` | number | 라인 두께 (권장: 3-4) |
| `tension` | number | 곡선 정도 (0-1, 권장: 0.4) |
| `pointRadius` | number | 포인트 크기 (권장: 6) |
| `pointHoverRadius` | number | 호버 시 포인트 크기 (권장: 10) |
| `fill` | boolean | 영역 채우기 여부 |

### Tooltip Options

| 옵션 | 타입 | 설명 |
|------|------|------|
| `backgroundColor` | string | 툴팁 배경색 |
| `padding` | number | 툴팁 내부 여백 (권장: 16-20) |
| `cornerRadius` | number | 모서리 둥글기 (권장: 12) |
| `callbacks.afterLabel` | function | 레이블 아래 추가 정보 표시 |

## 💡 사용 예시

### 성과분석 페이지 ([app/status/performance/page.tsx](../app/status/performance/page.tsx))

```tsx
<div className="w-full h-[400px] relative">
  <Line
    data={chartData}
    options={chartOptions}
  />
</div>
```

## ⚠️ 주의사항

1. **Chart.js 등록 필수**: `ChartJS.register()`를 반드시 호출해야 합니다
2. **높이 지정 필수**: 부모 요소에 명확한 높이를 지정해야 합니다
3. **"use client" 필수**: Next.js에서는 클라이언트 컴포넌트로 선언해야 합니다
4. **색상 형식**: HEX 형식 사용 (예: `#3b82f6`), CSS 변수는 사용 불가

## 🎨 추천 색상 팔레트

```tsx
const colors = {
  primary: "#3b82f6",   // 파랑
  success: "#10B981",   // 초록
  warning: "#F59E0B",   // 주황
  purple: "#8b5cf6",    // 보라
  red: "#ef4444",       // 빨강
  cyan: "#06b6d4",      // 청록
  lime: "#84cc16",      // 라임
  orange: "#f97316",    // 오렌지
}
```

## 📚 참고 자료

- [Chart.js 공식 문서](https://www.chartjs.org/docs/latest/)
- [react-chartjs-2 문서](https://react-chartjs-2.js.org/)

---

**업데이트**: 2025-10-18
