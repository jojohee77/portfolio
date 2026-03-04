# 모바일 최적화 가이드

## 📱 개요

모바일 환경에 최적화된 UI 패턴과 컴포넌트 사용법을 통합한 가이드입니다. 이 가이드만으로 모바일 최적화를 완벽하게 적용할 수 있습니다.

## 📚 목차

1. [모바일 페이지 타이틀](#1-모바일-페이지-타이틀)
2. [모바일 데이터 표시 (테이블/카드)](#2-모바일-데이터-표시)
3. [KPI 카드 최적화](#3-kpi-카드-최적화)
4. [반응형 패턴](#4-반응형-패턴)
5. [모바일 최적화 체크리스트](#5-모바일-최적화-체크리스트)

---

## 1. 모바일 페이지 타이틀

### 📌 핵심 개념

모바일에서는 Header의 로고 옆에 페이지 타이틀을 표시하고, 페이지 내부의 헤더는 숨깁니다.

### ✅ 구현 방법

**1) Header 컴포넌트에 pageTitle만 추가** (권장)

```tsx
<Header
  sidebarCollapsed={sidebarCollapsed}
  onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
  pageTitle="매출현황"
/>
```

> 💡 **Tip**: `pageDescription`은 모바일 헤더에 표시하기에 너무 길 수 있습니다. 
> 긴 설명은 생략하고 타이틀만 표시하는 것을 권장합니다.

**2) 페이지 헤더 영역 구성** ⭐ 중요

```tsx
{/* 페이지 헤더 */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
  {/* 타이틀 영역 - 모바일에서는 숨김 */}
  <div className="flex-shrink-0 hidden sm:block">
    <h1 className="text-xl sm:text-2xl font-bold">매출현황</h1>
    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
      월별 매출 현황 및 서비스별 분석
    </p>
  </div>
  
  {/* 버튼 영역 - 항상 표시 */}
  <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
    <Button>새 데이터 등록</Button>
  </div>
</div>
```

> ⚠️ **주의**: 전체 헤더 영역에 `hidden sm:flex`를 적용하면 버튼까지 숨겨집니다!
> 타이틀 영역만 `hidden sm:block`으로 숨기세요.

**3) (선택) pageDescription 사용**

짧은 설명이 필요한 경우에만 사용하세요:

```tsx
<Header
  sidebarCollapsed={sidebarCollapsed}
  onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
  pageTitle="대시보드"
  pageDescription="전체 현황"
/>
```

### 📋 페이지별 추천 타이틀

| 페이지 | 타이틀 | 비고 |
|-------|--------|------|
| `/dashboard` | "대시보드" | pageDescription 생략 권장 |
| `/status/keywords` | "키워드현황" | pageDescription 생략 권장 |
| `/work/contract` | "계약현황" | pageDescription 생략 권장 |
| `/work/task` | "업무현황" | pageDescription 생략 권장 |
| `/status/posting` | "포스팅현황" | pageDescription 생략 권장 |

> **참고**: 대부분의 경우 타이틀만으로 충분하며, 긴 설명은 페이지 내용으로 처리하는 것이 좋습니다.

---

## 2. 모바일 데이터 표시

### 📌 핵심 개념

- **모바일**: `MobileCardList` (좌우 스크롤 없음)
- **데스크톱**: `MobileDataTable` (테이블 형태)

### 🎯 언제 사용하나요?

#### MobileCardList (모바일 권장 ⭐)
- 좌우 스크롤을 피하고 싶을 때
- 6개 이상의 필드가 있는 경우
- 터치 인터랙션이 중요한 경우

#### MobileDataTable (데스크톱 권장)
- 테이블 형태로 표시할 때
- 여러 컬럼을 비교해야 할 때
- 5-7개의 컬럼이 있는 경우

### ✅ 사용법

#### 1) 임포트

```tsx
import { MobileCardList, MobileDataTable, type MobileColumn } from "@/components/ui/mobile-data-table"
```

#### 2) MobileCardList (모바일 카드)

```tsx
<MobileCardList
  data={serviceData}
  renderCard={(service) => [
    { 
      label: '서비스', 
      value: service.name 
    },
    { 
      label: '총 계약매출', 
      value: formatCurrency(service.totalRevenue) 
    },
    { 
      label: '월 매출', 
      value: formatCurrency(service.monthlyRevenue), 
      highlight: true  // 파란색으로 강조
    },
    { 
      label: '계약업체', 
      value: `${service.contracts}건` 
    }
  ]}
  isLoading={isLoading}
  emptyText="데이터가 없습니다"
  onItemClick={(service) => console.log(service)}
/>
```

#### 3) MobileDataTable (데스크톱 테이블)

```tsx
const columns: MobileColumn<ServiceData>[] = [
  {
    key: 'name',
    label: '서비스',
    align: 'center',
    mobileWidth: '100px'
  },
  {
    key: 'revenue',
    label: '매출',
    align: 'right',
    mobileWidth: '120px',
    render: (item) => formatCurrency(item.revenue)
  },
  {
    key: 'contracts',
    label: '계약건수',
    align: 'center',
    mobileWidth: '80px'
  }
]

<MobileDataTable
  data={serviceData}
  columns={columns}
  isLoading={isLoading}
  showScrollHint={false}
/>
```

### 📊 Props API

#### MobileCardList Props

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `data` | `T[]` | ✅ | 표시할 데이터 |
| `renderCard` | `(item: T) => MobileCardItem[]` | ✅ | 카드 렌더링 함수 |
| `isLoading` | `boolean` | ❌ | 로딩 상태 |
| `skeletonCount` | `number` | ❌ | 스켈레톤 개수 (기본: 3) |
| `emptyText` | `string` | ❌ | 빈 상태 텍스트 |
| `onItemClick` | `(item: T) => void` | ❌ | 카드 클릭 이벤트 |

#### MobileDataTable Props

| Prop | 타입 | 필수 | 설명 |
|------|------|------|------|
| `data` | `T[]` | ✅ | 표시할 데이터 |
| `columns` | `MobileColumn<T>[]` | ✅ | 컬럼 정의 |
| `isLoading` | `boolean` | ❌ | 로딩 상태 |
| `showScrollHint` | `boolean` | ❌ | 스크롤 안내 표시 |

---

## 3. KPI 카드 최적화

### 📌 핵심 개념

Card 컴포넌트의 여백을 최적화하여 모바일에서 컴팩트하게 표시합니다.

### ✅ 구현 방법

```tsx
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign } from "lucide-react"

<div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
  <Card className="shadow-none rounded-lg border border-gray-200 py-2 sm:py-3">
    <CardContent className="px-2 sm:px-3">
      <div className="flex items-start justify-between gap-1.5">
        <div className="flex-1 min-w-0">
          <p className="text-[9px] sm:text-sm text-slate-600 mb-0.5 sm:mb-2 leading-tight">
            총 매출 (6개월)
          </p>
          <p className="text-xs sm:text-xl lg:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-[8px] sm:text-sm text-green-600">
            +12.5% 전년 동기
          </p>
        </div>
        <DollarSign className="h-3.5 w-3.5 sm:h-6 sm:w-6 text-slate-400 flex-shrink-0" />
      </div>
    </CardContent>
  </Card>
</div>
```

### 🎨 스타일 가이드

#### 1) 여백 최적화

```tsx
// Card 여백
py-2 sm:py-3          // 모바일 8px, 데스크톱 12px

// CardContent 여백
px-2 sm:px-3          // 좌우만 8-12px

// 기본 (py-6) 대비 67% 감소!
```

#### 2) 폰트 크기

```tsx
// 라벨
text-[9px] sm:text-sm       // 9px → 14px

// 값
text-xs sm:text-xl lg:text-2xl    // 12px → 20px → 24px

// 설명
text-[8px] sm:text-sm       // 8px → 14px
```

#### 3) 간격

```tsx
gap-1.5                // 6px
gap-2 sm:gap-3 lg:gap-4    // 8px → 12px → 16px
mb-0.5 sm:mb-2         // 2px → 8px
```

#### 4) 아이콘 크기

```tsx
h-3.5 w-3.5 sm:h-6 sm:w-6  // 14px → 24px
```

---

## 4. 반응형 패턴

### 🌟 추천 패턴: 모바일 카드 + 데스크톱 테이블

```tsx
export default function RevenuePage() {
  const serviceData = [...] // 데이터
  
  return (
    <div className="space-y-4">
      {/* 모바일: 카드 리스트 (좌우 스크롤 없음) */}
      <div className="block sm:hidden">
        <MobileCardList
          data={serviceData}
          renderCard={(service) => [
            { label: '서비스', value: service.name },
            { label: '월 매출', value: formatCurrency(service.revenue), highlight: true },
            { label: '계약업체', value: `${service.contracts}건` }
          ]}
        />
      </div>

      {/* 데스크톱: 테이블 */}
      <div className="hidden sm:block">
        <MobileDataTable
          data={serviceData}
          columns={[
            { key: 'name', label: '서비스', align: 'center' },
            { key: 'revenue', label: '매출', align: 'right', render: (item) => formatCurrency(item.revenue) },
            { key: 'contracts', label: '계약업체', align: 'center' }
          ]}
        />
      </div>
    </div>
  )
}
```

### 📱 반응형 클래스

```tsx
// 모바일에서만 표시
sm:hidden             // sm 이상에서 숨김
block sm:hidden       // 모바일에서 block

// 데스크톱에서만 표시
hidden sm:block       // 모바일에서 숨김, sm 이상에서 표시
```

---

## 5. 모바일 최적화 체크리스트

### ✅ 페이지 레벨

- [ ] Header에 `pageTitle`, `pageDescription` 추가
- [ ] 페이지 내부 헤더에 `hidden sm:block` 적용
- [ ] 타이틀과 설명이 일치하는지 확인

### ✅ 데이터 표시

- [ ] 모바일: `MobileCardList` 사용
- [ ] 데스크톱: `MobileDataTable` 사용
- [ ] 중요 데이터에 `highlight: true` 적용
- [ ] 로딩 상태 (`isLoading`) 처리
- [ ] 빈 상태 (`emptyText`) 설정

### ✅ KPI 카드

- [ ] Card에 `py-2 sm:py-3` 적용
- [ ] CardContent에 `px-2 sm:px-3` 적용
- [ ] 폰트 크기 반응형 적용
- [ ] 아이콘 크기 `h-3.5 w-3.5 sm:h-6 sm:w-6`
- [ ] 그리드 간격 `gap-2 sm:gap-3 lg:gap-4`

### ✅ 터치 최적화

- [ ] 버튼 최소 높이 `min-h-[44px]`
- [ ] `touch-manipulation` 클래스 추가
- [ ] 카드 클릭 이벤트 설정
- [ ] 내부 버튼에 `e.stopPropagation()` 처리

---

## 📝 전체 예제

### 완벽한 모바일 최적화 페이지

```tsx
"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { MobileCardList, MobileDataTable, type MobileColumn } from "@/components/ui/mobile-data-table"
import { DollarSign, TrendingUp } from "lucide-react"

type ServiceData = {
  name: string
  revenue: number
  contracts: number
}

export default function RevenuePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const serviceData: ServiceData[] = [
    { name: "SEO", revenue: 30000000, contracts: 15 },
    { name: "프리미엄", revenue: 25000000, contracts: 12 }
  ]
  
  const totalRevenue = serviceData.reduce((sum, s) => sum + s.revenue, 0)
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0
    }).format(value)
  }
  
  const columns: MobileColumn<ServiceData>[] = [
    {
      key: 'name',
      label: '서비스',
      align: 'center',
      mobileWidth: '100px'
    },
    {
      key: 'revenue',
      label: '매출',
      align: 'right',
      mobileWidth: '120px',
      render: (item) => formatCurrency(item.revenue)
    },
    {
      key: 'contracts',
      label: '계약업체',
      align: 'center',
      mobileWidth: '80px',
      render: (item) => `${item.contracts}건`
    }
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* 1. 페이지 타이틀 - Header에 전달 (타이틀만) */}
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="매출현황"
      />

      <div className="flex">
        <Sidebar 
          currentPage="revenue" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
          {/* 2. 페이지 헤더 영역 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
            {/* 타이틀 영역 - 모바일에서는 숨김 */}
            <div className="flex-shrink-0 hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold">매출현황</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                월별 매출 현황 및 서비스별 분석
              </p>
            </div>
            
            {/* 버튼 영역 - 항상 표시 */}
            <div className="flex gap-2 flex-wrap justify-end w-full sm:w-auto">
              <Button>새 데이터 등록</Button>
            </div>
          </div>

          {/* 3. KPI 카드 섹션 - 컴팩트 최적화 */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
            <Card className="shadow-none rounded-lg border border-gray-200 py-2 sm:py-3">
              <CardContent className="px-2 sm:px-3">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-sm text-slate-600 mb-0.5 sm:mb-2 leading-tight">
                      총 매출
                    </p>
                    <p className="text-xs sm:text-xl lg:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
                      {formatCurrency(totalRevenue)}
                    </p>
                    <p className="text-[8px] sm:text-sm text-green-600">
                      +12.5% 증가
                    </p>
                  </div>
                  <DollarSign className="h-3.5 w-3.5 sm:h-6 sm:w-6 text-slate-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none rounded-lg border border-gray-200 py-2 sm:py-3">
              <CardContent className="px-2 sm:px-3">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] sm:text-sm text-slate-600 mb-0.5 sm:mb-2 leading-tight">
                      월 평균
                    </p>
                    <p className="text-xs sm:text-xl lg:text-2xl font-bold text-slate-900 mb-0.5 sm:mb-1 truncate">
                      {formatCurrency(totalRevenue / 2)}
                    </p>
                    <p className="text-[8px] sm:text-sm text-slate-500">
                      2개월 평균
                    </p>
                  </div>
                  <TrendingUp className="h-3.5 w-3.5 sm:h-6 sm:w-6 text-slate-400 flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 4. 서비스별 매출 - 반응형 패턴 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">서비스별 매출 현황</h2>

            {/* 모바일: 카드 리스트 */}
            <div className="block sm:hidden">
              <MobileCardList
                data={serviceData}
                isLoading={isLoading}
                renderCard={(service) => [
                  { label: '서비스', value: service.name },
                  { 
                    label: '매출', 
                    value: formatCurrency(service.revenue),
                    highlight: true 
                  },
                  { label: '계약업체', value: `${service.contracts}건` }
                ]}
              />
            </div>

            {/* 데스크톱: 테이블 */}
            <div className="hidden sm:block">
              <MobileDataTable
                data={serviceData}
                columns={columns}
                isLoading={isLoading}
                showScrollHint={false}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
```

---

## 🎯 빠른 참조

### 자주 사용하는 클래스

```tsx
// 여백
py-2 sm:py-3          // 위아래 여백
px-2 sm:px-3          // 좌우 여백
gap-2 sm:gap-3 lg:gap-4    // 간격

// 폰트
text-[9px] sm:text-sm      // 라벨
text-xs sm:text-xl         // 값
text-[8px] sm:text-sm      // 설명

// 반응형 표시
hidden sm:block       // 모바일 숨김
block sm:hidden       // 데스크톱 숨김

// 터치
min-h-[44px]          // 최소 터치 영역
touch-manipulation    // 터치 최적화
```

### 자주 사용하는 패턴

```tsx
// 1. 페이지 타이틀 (권장)
<Header pageTitle="제목" />

// 2. 페이지 타이틀 + 짧은 설명 (선택)
<Header pageTitle="제목" pageDescription="짧은 설명" />

// 3. 페이지 헤더 영역 구성 (중요!)
<div className="flex sm:flex-row sm:justify-between w-full">
  {/* 타이틀만 숨김 */}
  <div className="hidden sm:block">
    <h1>제목</h1>
    <p>설명</p>
  </div>
  {/* 버튼은 유지 */}
  <div className="flex justify-end w-full sm:w-auto">
    <Button>버튼</Button>
  </div>
</div>

// 3. 반응형 데이터 표시
<div className="block sm:hidden">
  <MobileCardList data={data} renderCard={...} />
</div>
<div className="hidden sm:block">
  <MobileDataTable data={data} columns={...} />
</div>

// 4. KPI 카드
<Card className="py-2 sm:py-3">
  <CardContent className="px-2 sm:px-3">
    ...
  </CardContent>
</Card>
```

---

## 📚 관련 컴포넌트

- **Header** (`components/header.tsx`) - 페이지 타이틀 표시
- **MobileCardList** (`components/ui/mobile-data-table.tsx`) - 모바일 카드 리스트
- **MobileDataTable** (`components/ui/mobile-data-table.tsx`) - 데스크톱 테이블
- **Card** (`components/ui/card.tsx`) - KPI 카드

---

## 🔧 문제 해결

### Q: 모바일에서 헤더의 버튼까지 사라집니다
```tsx
// ❌ 잘못된 방법: 전체 영역에 hidden 적용
<div className="hidden sm:flex">
  <div><h1>제목</h1></div>
  <div><Button>버튼</Button></div>  {/* 버튼도 숨겨짐! */}
</div>

// ✅ 올바른 방법: 타이틀 영역만 hidden 적용
<div className="flex sm:justify-between w-full">
  <div className="hidden sm:block">  {/* 타이틀만 숨김 */}
    <h1>제목</h1>
  </div>
  <div className="flex justify-end w-full sm:w-auto">
    <Button>버튼</Button>  {/* 버튼은 유지 */}
  </div>
</div>
```

### Q: 페이지 타이틀이 너무 길어서 잘립니다
```tsx
// 해결방법 1: 타이틀을 짧게 변경 (권장)
<Header pageTitle="짧은제목" />

// 해결방법 2: pageDescription 제거
// 긴 설명은 페이지 컨텐츠 영역에 배치

// 해결방법 3: Header 컴포넌트의 max-w 조절 (비권장)
```

### Q: 카드가 너무 크게 표시됩니다
```tsx
// 필드 개수를 6-8개로 제한하세요
renderCard={(item) => [
  // 6-8개의 필드만 표시
]}
```

### Q: 테이블이 모바일에서 너무 작습니다
```tsx
// mobileWidth를 더 크게 설정하세요
{ key: 'name', label: '이름', mobileWidth: '150px' }
```

### Q: 터치가 반응하지 않습니다
```tsx
// touch-manipulation과 min-h-[44px]를 추가하세요
<Button className="min-h-[44px] touch-manipulation">
```

---

## ✅ 업데이트 이력

- **2025-10-23**: 버튼 유지 방법 추가 (타이틀만 숨기고 버튼은 표시)
- **2025-10-23**: 모바일 타이틀 권장사항 업데이트 (pageDescription 생략 권장)
- **2025-10-17**: 모바일 가이드 통합 (페이지 타이틀 + 데이터 표시 + KPI 최적화)
- **2025-10-17**: 핵심 내용만 요약하여 1개 가이드로 재작성

---

**이 가이드만으로 모든 모바일 최적화를 적용할 수 있습니다!** 🎉

