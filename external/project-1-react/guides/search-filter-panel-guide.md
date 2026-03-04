# SearchFilterPanel 컴포넌트 가이드

## 개요
`SearchFilterPanel`은 검색어, 상태 필터, 날짜 범위 선택 기능을 제공하는 통합 검색 필터 패널 컴포넌트입니다. 계약 현황, 업무 현황 등 다양한 리스트 페이지에서 재사용할 수 있도록 설계되었습니다.

## 주요 기능
- 🔍 검색어 입력
- ✅ 다중 상태 필터 (체크박스)
- 📅 날짜 범위 선택 (기준 날짜 선택, 빠른 선택, 직접 입력)
- 🔄 초기화 및 검색 버튼
- 📋 아코디언 기능 (상세 필터 접기/펼치기)
  - 기본 상태: 펼쳐있음 (모든 필터 표시)
  - 닫힌 상태: 검색어 필드만 표시
  - 상세 버튼으로 상태 전환 (상세▲/상세▼)
- 🎨 연한 블루 배경의 모던한 디자인
- 📱 반응형 레이아웃 (모바일/태블릿/PC)

## 설치 및 임포트

```tsx
import SearchFilterPanel, { 
  type StatusOption, 
  type DateCriteriaOption,
  type SearchFilterPanelProps 
} from "@/components/ui/search-filter-panel"
```

## Props

### 필수 Props

| Prop | 타입 | 설명 |
|------|------|------|
| `searchTerm` | `string` | 현재 검색어 값 |
| `onSearchTermChange` | `(value: string) => void` | 검색어 변경 핸들러 |
| `statusFilter` | `string` | 현재 선택된 상태 필터 값 |
| `onStatusFilterChange` | `(value: string) => void` | 상태 필터 변경 핸들러 |
| `statusOptions` | `StatusOption[]` | 상태 필터 옵션 목록 |
| `startDate` | `Date \| null` | 시작 날짜 |
| `endDate` | `Date \| null` | 종료 날짜 |
| `onDateRangeChange` | `(start: Date \| null, end: Date \| null) => void` | 날짜 범위 변경 핸들러 |
| `selectedPeriod` | `string` | 현재 선택된 기간 (예: "1년", "1개월") |
| `onPeriodChange` | `(period: string) => void` | 기간 변경 핸들러 |
| `onSearch` | `() => void` | 검색 버튼 클릭 핸들러 |
| `onReset` | `() => void` | 초기화 버튼 클릭 핸들러 |

### 선택적 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `searchPlaceholder` | `string` | `"검색어를 입력하세요"` | 검색어 입력 필드 플레이스홀더 |
| `statusLabel` | `string` | `"상태"` | 상태 필터 섹션 라벨 |
| `dateCriteria` | `string` | - | 날짜 기준 선택 값 (예: "계약등록일") |
| `onDateCriteriaChange` | `(value: string) => void` | - | 날짜 기준 변경 핸들러 |
| `dateOptions` | `DateCriteriaOption[]` | - | 날짜 기준 옵션 목록 |
| `periodOptions` | `string[]` | `["오늘", "1주일", "1개월", "3개월", "6개월", "1년", "전체"]` | 빠른 날짜 선택 옵션 |
| `dateLabel` | `string` | `"기간"` | 날짜 필터 섹션 라벨 |
| `showDateFilter` | `boolean` | `true` | 날짜 필터 표시 여부 |
| `className` | `string` | `""` | 추가 CSS 클래스 |

## 타입 정의

```tsx
export interface StatusOption {
  value: string
  label: string
}

export interface DateCriteriaOption {
  value: string
  label: string
}
```

## 사용 예제

### 1. 기본 사용 (계약 현황 페이지)

```tsx
"use client"

import { useState, useEffect } from "react"
import SearchFilterPanel, { type StatusOption } from "@/components/ui/search-filter-panel"

export default function ContractPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateCriteria, setDateCriteria] = useState("계약등록일")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("1년")

  // 상태 옵션 정의
  const statusOptions: StatusOption[] = [
    { value: "all", label: "전체" },
    { value: "신규", label: "신규" },
    { value: "연장", label: "연장" },
    { value: "확장", label: "확장" },
    { value: "만료", label: "만료" },
  ]

  // 날짜 기준 옵션 정의
  const dateOptions = [
    { value: "계약등록일", label: "계약등록일" },
    { value: "계약시작일", label: "계약시작일" },
    { value: "계약종료일", label: "계약종료일" },
  ]

  // 빠른 날짜 선택 핸들러
  const handleQuickDateSelect = (period: string) => {
    const today = new Date()
    let start = new Date()
    let end = new Date()

    switch (period) {
      case "오늘":
        start = end = today
        break
      case "1주일":
        start = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "1개월":
        start = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
        break
      case "3개월":
        start = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
        break
      case "6개월":
        start = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate())
        break
      case "1년":
        start = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
        break
      case "전체":
        start = new Date(2020, 0, 1)
        end = new Date(2030, 11, 31)
        break
    }

    setStartDate(period === "전체" ? null : start)
    setEndDate(period === "전체" ? null : today)
    setSelectedPeriod(period)
  }

  // 초기 1년치 날짜 설정
  useEffect(() => {
    handleQuickDateSelect("1년")
  }, [])

  // 검색 실행
  const handleSearch = () => {
    console.log("검색 실행:", { 
      searchTerm, 
      statusFilter, 
      dateCriteria, 
      startDate, 
      endDate 
    })
    // 실제 검색 로직 구현
  }

  // 초기화
  const handleReset = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateCriteria("계약등록일")
    setStartDate(null)
    setEndDate(null)
    setSelectedPeriod("1년")
    handleQuickDateSelect("1년")
  }

  return (
    <div className="p-6">
      <SearchFilterPanel
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchPlaceholder="계약번호, 회사명, 담당자명으로 검색"
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={statusOptions}
        statusLabel="계약상태"
        dateCriteria={dateCriteria}
        onDateCriteriaChange={setDateCriteria}
        dateOptions={dateOptions}
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={(start, end) => {
          setStartDate(start)
          setEndDate(end)
        }}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handleQuickDateSelect}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      
      {/* 검색 결과 표시 */}
      <div className="mt-6">
        {/* 결과 리스트 */}
      </div>
    </div>
  )
}
```

### 2. 날짜 필터 없이 사용

```tsx
<SearchFilterPanel
  searchTerm={searchTerm}
  onSearchTermChange={setSearchTerm}
  statusFilter={statusFilter}
  onStatusFilterChange={setStatusFilter}
  statusOptions={statusOptions}
  startDate={null}
  endDate={null}
  onDateRangeChange={() => {}}
  selectedPeriod=""
  onPeriodChange={() => {}}
  showDateFilter={false}
  onSearch={handleSearch}
  onReset={handleReset}
/>
```

### 3. 업무 현황 페이지에서 사용

```tsx
const taskStatusOptions: StatusOption[] = [
  { value: "all", label: "전체" },
  { value: "진행중", label: "진행중" },
  { value: "완료", label: "완료" },
  { value: "대기", label: "대기" },
  { value: "보류", label: "보류" },
]

<SearchFilterPanel
  searchTerm={searchTerm}
  onSearchTermChange={setSearchTerm}
  searchPlaceholder="업무명, 담당자로 검색"
  statusFilter={statusFilter}
  onStatusFilterChange={setStatusFilter}
  statusOptions={taskStatusOptions}
  statusLabel="업무상태"
  dateCriteria={dateCriteria}
  onDateCriteriaChange={setDateCriteria}
  dateOptions={[
    { value: "생성일", label: "생성일" },
    { value: "시작일", label: "시작일" },
    { value: "종료일", label: "종료일" },
  ]}
  startDate={startDate}
  endDate={endDate}
  onDateRangeChange={(start, end) => {
    setStartDate(start)
    setEndDate(end)
  }}
  selectedPeriod={selectedPeriod}
  onPeriodChange={handleQuickDateSelect}
  dateLabel="작업기간"
  onSearch={handleSearch}
  onReset={handleReset}
/>
```

### 4. 커스텀 기간 옵션 사용

```tsx
<SearchFilterPanel
  searchTerm={searchTerm}
  onSearchTermChange={setSearchTerm}
  statusFilter={statusFilter}
  onStatusFilterChange={setStatusFilter}
  statusOptions={statusOptions}
  startDate={startDate}
  endDate={endDate}
  onDateRangeChange={(start, end) => {
    setStartDate(start)
    setEndDate(end)
  }}
  selectedPeriod={selectedPeriod}
  onPeriodChange={handleQuickDateSelect}
  periodOptions={["오늘", "어제", "이번주", "이번달", "저번달", "전체"]}
  onSearch={handleSearch}
  onReset={handleReset}
/>
```

## 레이아웃 구조

### 기본 상태 (펼쳐짐)
```
┌─────────────────────────────────────────────────┐
│  검색 필터 패널 (bg-slate-50)                     │
├─────────────────────────────────────────────────┤
│  검색어: [________________🔍]                     │
├─────────────────────────────────────────────────┤
│  상태: ☑전체 ☐신규 ☐연장 ☐확장 ☐만료              │
├─────────────────────────────────────────────────┤
│  기간: [기준▼] [오늘][1주일][1개월]...            │
│        [날짜 선택 📅]                             │
├─────────────────────────────────────────────────┤
│      [초기화]    [검색]    [상세▲]                │
└─────────────────────────────────────────────────┘
```

### 닫힌 상태
```
┌─────────────────────────────────────────────────┐
│  검색 필터 패널 (bg-slate-50)                     │
├─────────────────────────────────────────────────┤
│  검색어: [________________🔍]                     │
├─────────────────────────────────────────────────┤
│      [초기화]    [검색]    [상세▼]                │
└─────────────────────────────────────────────────┘
```

## 스타일 커스터마이징

### CSS 클래스 추가

```tsx
<SearchFilterPanel
  // ... props
  className="shadow-lg"
/>
```

### Tailwind 유틸리티로 커스터마이징

컴포넌트는 Tailwind CSS를 사용하므로, 필요한 경우 컴포넌트 소스를 직접 수정하여 스타일을 변경할 수 있습니다.

주요 스타일 클래스:
- `bg-slate-50`: 상단 필터 영역 배경색
- `bg-white`: 전체 패널 배경색
- `border rounded-xl`: 패널 테두리 및 둥근 모서리
- `text-gray-900`: 라벨 텍스트 색상

## 접근성 고려사항

- ✅ 모든 체크박스는 `Label`과 연결되어 있습니다
- ✅ 키보드 탐색 지원
- ✅ 적절한 `placeholder` 텍스트 제공
- ✅ 버튼에 명확한 레이블 사용

## 반응형 디자인

| 화면 크기 | 레이아웃 |
|-----------|----------|
| 모바일 (< 768px) | 세로 스택 레이아웃 |
| 태블릿 (768px - 1024px) | 하이브리드 레이아웃 |
| PC (> 1024px) | 가로 레이아웃 |

## 성능 최적화 팁

1. **메모이제이션**: 자주 변경되지 않는 옵션 배열은 컴포넌트 외부에 정의하세요.

```tsx
const STATUS_OPTIONS: StatusOption[] = [
  { value: "all", label: "전체" },
  { value: "신규", label: "신규" },
  // ...
]
```

2. **디바운싱**: 검색어 입력 시 디바운싱을 적용하여 성능을 개선하세요.

```tsx
import { useMemo } from "react"
import debounce from "lodash/debounce"

const debouncedSearch = useMemo(
  () => debounce((term: string) => {
    // 검색 로직
  }, 300),
  []
)

const handleSearchTermChange = (value: string) => {
  setSearchTerm(value)
  debouncedSearch(value)
}
```

## 주의사항

1. **날짜 선택 핸들러**: `onPeriodChange`는 빠른 날짜 선택 버튼 클릭 시 실제 날짜를 계산하여 `startDate`와 `endDate`를 업데이트해야 합니다.

2. **날짜 기준 옵션**: `dateCriteria`, `onDateCriteriaChange`, `dateOptions`는 모두 함께 제공되거나 모두 생략되어야 합니다.

3. **"전체" 기간**: `selectedPeriod`가 "전체"일 때는 날짜 입력이 비활성화됩니다.

## 문제 해결

### Q: 날짜 선택이 작동하지 않아요
A: `CustomDatePicker` 컴포넌트가 올바르게 설치되어 있는지 확인하세요. `@/components/ui/custom-datepicker`를 임포트할 수 있어야 합니다.

### Q: 검색 버튼을 눌러도 아무 일도 일어나지 않아요
A: `onSearch` prop에 실제 검색 로직을 구현했는지 확인하세요.

### Q: 초기화 버튼이 모든 상태를 초기화하지 않아요
A: `onReset` 핸들러에서 모든 상태를 원하는 초기값으로 설정했는지 확인하세요.

## 관련 컴포넌트

- `CustomDatePicker`: 날짜 범위 선택 컴포넌트
- `Input`: 검색어 입력 필드
- `Checkbox`: 상태 필터 체크박스
- `Select`: 날짜 기준 선택 드롭다운
- `Button`: 검색 및 초기화 버튼

## 버전 히스토리

- **v1.1.0** (2025-01-XX): 아코디언 기능 추가
  - 상세 필터 접기/펼치기 기능
  - 닫힌 상태에서 검색어 필드만 표시
  - 상세 버튼으로 상태 전환 (상세▲/상세▼)

- **v1.0.0** (2025-01-10): 초기 버전 출시
  - 기본 검색, 필터, 날짜 선택 기능
  - 반응형 레이아웃
  - 커스터마이징 가능한 옵션들

## 라이선스

이 컴포넌트는 프로젝트 내부에서 자유롭게 사용 및 수정할 수 있습니다.

