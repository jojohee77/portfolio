# 전체 페이지 스켈레톤 UI 가이드

## 개요

전체 페이지 스켈레톤 UI는 페이지 로딩 시 전체 레이아웃의 스켈레톤 플레이스홀더를 표시하여 더 나은 사용자 경험을 제공합니다.
DataTable 스켈레톤과 달리, 전체 페이지의 모든 요소(헤더, KPI 카드, 차트, 테이블 등)를 스켈레톤으로 표시합니다.

## 주요 기능

- 전체 페이지 레이아웃 스켈레톤
- 부드러운 펄스 애니메이션
- 페이지 구조를 반영한 스켈레톤 디자인
- 로딩 완료 시 실제 콘텐츠로 전환

## 기본 구현

### 1단계: 필요한 import 추가

```tsx
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
```

### 2단계: 로딩 상태 추가

```tsx
const [isLoading, setIsLoading] = useState(true)
```

### 3단계: 데이터 로딩 시뮬레이션

```tsx
useEffect(() => {
  setIsLoading(true)
  const timer = setTimeout(() => {
    setIsLoading(false)
  }, 1500)
  return () => clearTimeout(timer)
}, [])
```

### 4단계: 조건부 렌더링 적용

```tsx
<main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6 w-full max-w-full">
  {isLoading ? (
    // 스켈레톤 UI
    <>
      {/* 스켈레톤 컴포넌트들 */}
    </>
  ) : (
    // 실제 콘텐츠
    <>
      {/* 실제 페이지 컨텐츠 */}
    </>
  )}
</main>
```

## 스켈레톤 컴포넌트 패턴

### 페이지 헤더 스켈레톤

```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
  <div className="flex-shrink-0 space-y-2">
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-4 w-64" />
  </div>
  <div className="flex items-center gap-2 sm:gap-4">
    <Skeleton className="h-8 w-32" />
    <Skeleton className="h-8 w-40" />
  </div>
</div>
```

### KPI 카드 스켈레톤

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
  {[...Array(5)].map((_, i) => (
    <Card key={i} className="shadow-none rounded-xl border border-gray-200">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardContent>
    </Card>
  ))}
</div>
```

### 차트 스켈레톤

```tsx
<Card className="shadow-none rounded-xl border border-gray-200 w-full">
  <CardHeader className="pb-4">
    <Skeleton className="h-6 w-64" />
    <Skeleton className="h-4 w-80 mt-2" />
  </CardHeader>
  <CardContent>
    <Skeleton className="h-[300px] sm:h-[400px] w-full" />
  </CardContent>
</Card>
```

### 버튼 그룹 스켈레톤

```tsx
<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
  {[...Array(7)].map((_, i) => (
    <Skeleton key={i} className="h-10 sm:h-12 w-full" />
  ))}
</div>
```

### 테이블 스켈레톤

```tsx
<div className="space-y-4">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div className="space-y-2">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
    <Skeleton className="h-9 w-32" />
  </div>

  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow className="!border-b !border-gray-200">
            {[...Array(6)].map((_, i) => (
              <TableHead key={i} className="py-4">
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-b border-gray-100">
              {[...Array(6)].map((_, colIndex) => (
                <TableCell key={colIndex} className="py-4">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
</div>
```

## 실전 예제

### 매출현황 페이지 스켈레톤

```tsx
"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function RevenuePage() {
  const [isLoading, setIsLoading] = useState(true)

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex-1 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-4 sm:space-y-6 w-full max-w-full">
      {isLoading ? (
        // 스켈레톤 UI
        <>
          {/* 페이지 헤더 스켈레톤 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
            <div className="flex-shrink-0 space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-40" />
            </div>
          </div>

          {/* KPI 카드 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="shadow-none rounded-xl border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 차트 스켈레톤 */}
          <Card className="shadow-none rounded-xl border border-gray-200 w-full">
            <CardHeader className="pb-4">
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-80 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] sm:h-[400px] w-full" />
            </CardContent>
          </Card>

          {/* 월별 선택 버튼 스켈레톤 */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
            {[...Array(7)].map((_, i) => (
              <Skeleton key={i} className="h-10 sm:h-12 w-full" />
            ))}
          </div>

          {/* 테이블 스켈레톤 */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-9 w-32" />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow className="!border-b !border-gray-200">
                      {[...Array(6)].map((_, i) => (
                        <TableHead key={i} className="py-4">
                          <Skeleton className="h-4 w-20" />
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(3)].map((_, rowIndex) => (
                      <TableRow key={rowIndex} className="border-b border-gray-100">
                        {[...Array(6)].map((_, colIndex) => (
                          <TableCell key={colIndex} className="py-4">
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </>
      ) : (
        // 실제 콘텐츠
        <>
          {/* 실제 페이지 컨텐츠 렌더링 */}
        </>
      )}
    </main>
  )
}
```

### 성과현황 페이지 스켈레톤

```tsx
{isLoading ? (
  // 스켈레톤 UI
  <>
    {/* 헤더 스켈레톤 */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-8 w-48" />
      </div>
    </div>

    {/* KPI 카드 스켈레톤 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="shadow-none rounded-xl border border-gray-200">
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-28 mb-2" />
            <Skeleton className="h-4 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* 탭 스켈레톤 */}
    <div className="flex items-center gap-2 sm:gap-4">
      <Skeleton className="h-8 w-48" />
    </div>

    {/* 성과 카드 스켈레톤 */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="shadow-none rounded-xl border border-gray-200">
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-16" />
          </CardHeader>
          <CardContent className="space-y-2">
            {[...Array(6)].map((_, j) => (
              <div key={j} className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
            <Skeleton className="h-8 w-full mt-3" />
          </CardContent>
        </Card>
      ))}
    </div>

    {/* 차트 스켈레톤 */}
    <Card className="shadow-none rounded-xl border border-gray-200">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[250px] w-full" />
      </CardContent>
    </Card>

    {/* 테이블 스켈레톤 */}
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow className="!border-b !border-gray-200">
              {[...Array(8)].map((_, i) => (
                <TableHead key={i} className="py-4">
                  <Skeleton className="h-4 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(4)].map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-b border-gray-100">
                {[...Array(8)].map((_, colIndex) => (
                  <TableCell key={colIndex} className="py-4">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </>
) : (
  // 실제 콘텐츠
  <>
    {/* 실제 페이지 컨텐츠 렌더링 */}
  </>
)}
```

## API 데이터 로딩과 연동

### 실제 API 호출과 함께 사용하기

```tsx
const [isLoading, setIsLoading] = useState(true)
const [data, setData] = useState(null)

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/revenue')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('데이터 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  fetchData()
}, [])
```

### 페이지 변경 시 스켈레톤 표시

```tsx
const [selectedYear, setSelectedYear] = useState("2024")

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/revenue?year=${selectedYear}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('데이터 로딩 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  fetchData()
}, [selectedYear])  // 연도 변경 시 재로딩
```

## 커스터마이징 팁

### 로딩 시간 조정

```tsx
// 짧은 로딩 (500ms)
setTimeout(() => setIsLoading(false), 500)

// 긴 로딩 (3초)
setTimeout(() => setIsLoading(false), 3000)
```

### 최소 로딩 시간 보장

```tsx
const fetchData = async () => {
  setIsLoading(true)

  const [data] = await Promise.all([
    fetch('/api/data').then(r => r.json()),
    new Promise(resolve => setTimeout(resolve, 500))  // 최소 500ms 보장
  ])

  setData(data)
  setIsLoading(false)
}
```

### 부분 스켈레톤 (특정 섹션만)

```tsx
const [isLoadingChart, setIsLoadingChart] = useState(true)
const [isLoadingTable, setIsLoadingTable] = useState(true)

// 차트는 빠르게, 테이블은 천천히 로드
useEffect(() => {
  setTimeout(() => setIsLoadingChart(false), 500)
  setTimeout(() => setIsLoadingTable(false), 1500)
}, [])

// 렌더링
{isLoadingChart ? <ChartSkeleton /> : <Chart />}
{isLoadingTable ? <TableSkeleton /> : <Table />}
```

## 성능 최적화

### 스켈레톤 컴포넌트 재사용

공통 스켈레톤 컴포넌트를 별도 파일로 분리:

```tsx
// components/skeletons/PageHeaderSkeleton.tsx
export function PageHeaderSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 w-full">
      <div className="flex-shrink-0 space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-40" />
      </div>
    </div>
  )
}
```

사용:

```tsx
import { PageHeaderSkeleton } from "@/components/skeletons/PageHeaderSkeleton"

{isLoading ? <PageHeaderSkeleton /> : <PageHeader />}
```

## 주의사항

1. **로딩 상태 초기화**: 컴포넌트 마운트 시 `isLoading`을 `true`로 설정하세요.
2. **finally 블록 사용**: 에러가 발생해도 로딩 상태를 해제하도록 `finally`를 사용하세요.
3. **과도한 사용 피하기**: 빠른 응답(< 200ms)에는 스켈레톤이 오히려 방해될 수 있습니다.
4. **레이아웃 일치**: 스켈레톤은 실제 콘텐츠의 레이아웃과 최대한 유사하게 만드세요.
5. **반응형 디자인**: 스켈레톤도 반응형으로 디자인하여 모바일에서도 잘 보이도록 하세요.

## 베스트 프랙티스

1. **일관된 디자인**: 모든 페이지에서 동일한 스켈레톤 스타일 사용
2. **적절한 크기**: 스켈레톤 크기를 실제 콘텐츠와 유사하게 설정
3. **애니메이션**: `animate-pulse`를 사용한 부드러운 애니메이션
4. **에러 처리**: 로딩 실패 시 적절한 에러 메시지 표시
5. **접근성**: 스크린 리더를 위한 `aria-label` 추가 고려

## 실제 적용 사례

- **매출현황 페이지** ([app/revenue/page.tsx](../app/revenue/page.tsx))
  - 5개의 KPI 카드 스켈레톤
  - 차트 스켈레톤
  - 7개의 월별 버튼 스켈레톤
  - 6열 × 3행 테이블 스켈레톤

- **성과현황 페이지** ([app/performance/page.tsx](../app/performance/page.tsx))
  - 5개의 KPI 카드 스켈레톤
  - 4개의 팀 성과 카드 스켈레톤
  - 차트 스켈레톤
  - 8열 × 4행 테이블 스켈레톤

## 관련 문서

- [DataTable 스켈레톤 가이드](./data-table-skeleton-example.md)
- [Skeleton 컴포넌트](../components/ui/skeleton.tsx)
- [공통 컴포넌트 가이드](./README.md)
