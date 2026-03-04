# SingleSearchForm 컴포넌트 가이드

## 개요
`SingleSearchForm`은 셀렉트박스와 검색 필드가 결합된 단일 검색 폼 컴포넌트입니다. 팀 관리, 계정 관리 등 다양한 리스트 페이지에서 재사용할 수 있도록 설계되었습니다.

## 주요 기능
- 🔍 검색어 입력 (검색 아이콘 포함)
- 📋 카테고리별 검색 (셀렉트박스)
- ⌨️ Enter 키로 검색 실행
- 📱 반응형 레이아웃 (모바일/태블릿/PC)
- 🎨 일관된 디자인 시스템

## 설치 및 임포트

```tsx
import SingleSearchForm, { 
  type SearchOption, 
  type SingleSearchFormProps 
} from "@/components/ui/single-search-form"
```

## Props

### 필수 Props

| Prop | 타입 | 설명 |
|------|------|------|
| `searchTerm` | `string` | 현재 검색어 값 |
| `onSearchTermChange` | `(value: string) => void` | 검색어 변경 핸들러 |
| `selectedCategory` | `string` | 현재 선택된 카테고리 값 |
| `onCategoryChange` | `(value: string) => void` | 카테고리 변경 핸들러 |
| `categoryOptions` | `SearchOption[]` | 카테고리 옵션 목록 |

### 선택적 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `searchPlaceholder` | `string` | `"검색어를 입력해주세요."` | 검색어 입력 필드 플레이스홀더 |
| `selectPlaceholder` | `string` | `"항목"` | 셀렉트박스 플레이스홀더 |
| `onSearch` | `() => void` | - | 검색 실행 핸들러 (Enter 키 또는 버튼 클릭 시) |
| `selectWidth` | `string` | `"140px"` | 셀렉트박스 너비 |
| `className` | `string` | `""` | 추가 CSS 클래스 |

## 타입 정의

```tsx
export interface SearchOption {
  value: string
  label: string
}

export interface SingleSearchFormProps {
  searchTerm: string
  onSearchTermChange: (value: string) => void
  searchPlaceholder?: string
  selectedCategory: string
  onCategoryChange: (value: string) => void
  categoryOptions: SearchOption[]
  selectPlaceholder?: string
  onSearch?: () => void
  selectWidth?: string
  className?: string
}
```

## 사용 예제

### 1. 기본 사용 (팀 관리 페이지)

```tsx
"use client"

import { useState } from "react"
import SingleSearchForm, { type SearchOption } from "@/components/ui/single-search-form"

export default function TeamPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 카테고리 옵션 정의
  const categoryOptions: SearchOption[] = [
    { value: "all", label: "전체" },
    { value: "name", label: "팀명" },
    { value: "leader", label: "팀장" },
    { value: "members", label: "구성원" },
  ]

  // 검색 실행 핸들러
  const handleSearch = () => {
    console.log("검색 실행:", { selectedCategory, searchTerm })
    // 실제 검색 로직 구현
  }

  return (
    <div className="p-6">
      <SingleSearchForm
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        searchPlaceholder="팀명, 구성원으로 검색"
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categoryOptions={categoryOptions}
        selectPlaceholder="항목"
        onSearch={handleSearch}
      />
      
      {/* 검색 결과 표시 */}
      <div className="mt-6">
        {/* 결과 리스트 */}
      </div>
    </div>
  )
}
```

### 2. 계정 관리 페이지에서 사용

```tsx
const accountCategoryOptions: SearchOption[] = [
  { value: "all", label: "전체" },
  { value: "name", label: "이름" },
  { value: "email", label: "이메일" },
  { value: "department", label: "부서" },
  { value: "position", label: "직급" },
]

<SingleSearchForm
  searchTerm={searchTerm}
  onSearchTermChange={setSearchTerm}
  searchPlaceholder="이름, 이메일, 부서로 검색"
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  categoryOptions={accountCategoryOptions}
  selectPlaceholder="검색 항목"
  onSearch={handleSearch}
  selectWidth="120px"
/>
```

### 3. 커스텀 너비 사용

```tsx
<SingleSearchForm
  searchTerm={searchTerm}
  onSearchTermChange={setSearchTerm}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  categoryOptions={categoryOptions}
  onSearch={handleSearch}
  selectWidth="160px"
  className="mb-4"
/>
```

### 4. 검색 핸들러 없이 사용

```tsx
<SingleSearchForm
  searchTerm={searchTerm}
  onSearchTermChange={setSearchTerm}
  selectedCategory={selectedCategory}
  onCategoryChange={setSelectedCategory}
  categoryOptions={categoryOptions}
  // onSearch 생략 - Enter 키 기능만 비활성화됨
/>
```

## 레이아웃 구조

```
┌─────────────────────────────────────────────────┐
│  검색 폼 (bg-slate-50, rounded-xl, border)      │
├─────────────────────────────────────────────────┤
│  [셀렉트박스▼] [검색어 입력 필드🔍]              │
└─────────────────────────────────────────────────┘
```

## 스타일 커스터마이징

### CSS 클래스 추가

```tsx
<SingleSearchForm
  // ... props
  className="shadow-lg mb-6"
/>
```

### 셀렉트박스 너비 조정

```tsx
<SingleSearchForm
  // ... props
  selectWidth="180px"  // 더 넓은 셀렉트박스
/>
```

## 반응형 디자인

| 화면 크기 | 레이아웃 |
|-----------|----------|
| 모바일 (< 768px) | 세로 스택 레이아웃 |
| 태블릿 (768px - 1024px) | 세로 스택 레이아웃 |
| PC (> 1024px) | 가로 레이아웃 |

## 접근성 고려사항

- ✅ 키보드 탐색 지원
- ✅ 적절한 `placeholder` 텍스트 제공
- ✅ Enter 키로 검색 실행
- ✅ 시맨틱 HTML 구조 사용

## 성능 최적화 팁

1. **메모이제이션**: 자주 변경되지 않는 옵션 배열은 컴포넌트 외부에 정의하세요.

```tsx
const CATEGORY_OPTIONS: SearchOption[] = [
  { value: "all", label: "전체" },
  { value: "name", label: "팀명" },
  // ...
]
```

2. **디바운싱**: 검색어 입력 시 디바운싱을 적용하여 성능을 개선하세요.

```tsx
import { useMemo } from "react"
import debounce from "lodash/debounce"

const debouncedSearch = useMemo(
  () => debounce((term: string, category: string) => {
    // 검색 로직
  }, 300),
  []
)

const handleSearchTermChange = (value: string) => {
  setSearchTerm(value)
  debouncedSearch(value, selectedCategory)
}
```

## 주의사항

1. **카테고리 옵션**: `categoryOptions` 배열은 `value`와 `label` 속성을 모두 포함해야 합니다.

2. **검색 핸들러**: `onSearch`가 제공되지 않으면 Enter 키 기능이 비활성화됩니다.

3. **셀렉트박스 너비**: `selectWidth`는 Tailwind CSS 클래스로 변환되므로 유효한 CSS 값이어야 합니다.

## 문제 해결

### Q: 셀렉트박스 너비가 적용되지 않아요
A: `selectWidth` prop이 올바른 CSS 값인지 확인하세요. 예: `"140px"`, `"10rem"`

### Q: Enter 키를 눌러도 검색이 실행되지 않아요
A: `onSearch` prop이 제공되었는지 확인하세요.

### Q: 모바일에서 레이아웃이 깨져요
A: 부모 컨테이너에 적절한 패딩과 마진이 설정되어 있는지 확인하세요.

## 관련 컴포넌트

- `SearchFilterPanel`: 더 복잡한 검색 필터가 필요한 경우
- `Input`: 검색어 입력 필드
- `Select`: 카테고리 선택 드롭다운
- `Button`: 검색 실행 버튼 (필요시 추가)

## 버전 히스토리

- **v1.0.0** (2025-01-15): 초기 버전 출시
  - 기본 셀렉트박스 + 검색 필드 기능
  - 반응형 레이아웃
  - 커스터마이징 가능한 옵션들

## 라이선스

이 컴포넌트는 프로젝트 내부에서 자유롭게 사용 및 수정할 수 있습니다.
