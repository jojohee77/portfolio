# CommonSelect 컴포넌트 가이드

## 📋 목차
- [개요](#개요)
- [주요 기능](#주요-기능)
- [설치 및 임포트](#설치-및-임포트)
- [기본 사용법](#기본-사용법)
- [Props API](#props-api)
- [사용 예제](#사용-예제)
- [고급 사용법](#고급-사용법)
- [스타일 커스터마이징](#스타일-커스터마이징)
- [주의사항](#주의사항)

## 개요

`CommonSelect`는 프로젝트 전체에서 일관된 디자인과 동작을 제공하는 재사용 가능한 셀렉트박스 컴포넌트입니다. Shadcn UI의 Select 컴포넌트를 기반으로 하며, 두 가지 버전을 제공합니다:

- **CommonSelect**: 기본 셀렉트박스
- **LabeledSelect**: 레이블이 포함된 셀렉트박스

## 주요 기능

✅ **일관된 디자인**: 프로젝트 전체에서 동일한 스타일 적용
✅ **두 가지 버전**: 레이블 유무 선택 가능
✅ **타입 안전성**: TypeScript 완벽 지원
✅ **커스터마이징**: className을 통한 스타일 조정 가능
✅ **반응형**: 모바일/데스크톱 대응
✅ **접근성**: 키보드 네비게이션 지원

## 설치 및 임포트

### 기본 임포트

```tsx
// 레이블이 없는 셀렉트박스
import { CommonSelect } from "@/components/ui/common-select"

// 레이블이 있는 셀렉트박스
import { LabeledSelect } from "@/components/ui/common-select"

// 둘 다 사용
import { CommonSelect, LabeledSelect } from "@/components/ui/common-select"
```

### 타입 임포트 (필요 시)

```tsx
import type { SelectOption, CommonSelectProps, LabeledSelectProps } from "@/components/ui/common-select"
```

## 기본 사용법

### 1. CommonSelect (레이블 없음)

```tsx
import { useState } from "react"
import { CommonSelect } from "@/components/ui/common-select"

function MyComponent() {
  const [filter, setFilter] = useState("newest")

  const options = [
    { value: "newest", label: "최신순" },
    { value: "oldest", label: "오래된순" },
    { value: "popular", label: "인기순" }
  ]

  return (
    <CommonSelect
      value={filter}
      onValueChange={setFilter}
      options={options}
    />
  )
}
```

### 2. LabeledSelect (레이블 있음)

```tsx
import { useState } from "react"
import { LabeledSelect } from "@/components/ui/common-select"

function MyComponent() {
  const [selectedYear, setSelectedYear] = useState("2024")

  const yearOptions = [
    { value: "2023", label: "2023년" },
    { value: "2024", label: "2024년" },
    { value: "2025", label: "2025년" }
  ]

  return (
    <LabeledSelect
      label="연도:"
      value={selectedYear}
      onValueChange={setSelectedYear}
      options={yearOptions}
    />
  )
}
```

## Props API

### CommonSelectProps

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `value` | `string` | ✅ | - | 현재 선택된 값 |
| `onValueChange` | `(value: string) => void` | ✅ | - | 값 변경 핸들러 |
| `options` | `SelectOption[]` | ✅ | - | 옵션 배열 (value, label) |
| `placeholder` | `string` | ❌ | - | 선택되지 않았을 때 표시되는 텍스트 |
| `className` | `string` | ❌ | - | 컴포넌트 전체 래퍼 클래스 |
| `triggerClassName` | `string` | ❌ | - | 트리거 버튼 클래스 |
| `contentClassName` | `string` | ❌ | - | 드롭다운 콘텐츠 클래스 |
| `disabled` | `boolean` | ❌ | `false` | 비활성화 여부 |

### LabeledSelectProps

CommonSelectProps의 모든 props + 추가 props:

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `label` | `string` | ✅ | - | 레이블 텍스트 |
| `labelClassName` | `string` | ❌ | - | 레이블 클래스 |
| `wrapperClassName` | `string` | ❌ | - | 레이블+셀렉트 래퍼 클래스 |

### SelectOption 타입

```typescript
interface SelectOption {
  value: string  // 실제 값
  label: string  // 표시될 텍스트
}
```

## 사용 예제

### 예제 1: 연도 선택 (레이블 있음)

```tsx
import { LabeledSelect } from "@/components/ui/common-select"

function RevenuePage() {
  const [selectedYear, setSelectedYear] = useState("2024")

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <LabeledSelect
        label="연도:"
        value={selectedYear}
        onValueChange={setSelectedYear}
        options={[
          { value: "2024", label: "2024년" },
          { value: "2025", label: "2025년" }
        ]}
      />
    </div>
  )
}
```

### 예제 2: 정렬 필터 (레이블 없음)

```tsx
import { CommonSelect } from "@/components/ui/common-select"

function ContractPage() {
  const [sortFilter, setSortFilter] = useState("등록일순")

  return (
    <div className="flex items-center justify-between">
      <h2>계약 목록</h2>
      <CommonSelect
        value={sortFilter}
        onValueChange={setSortFilter}
        options={[
          { value: "등록일순", label: "등록일순" },
          { value: "기업명순", label: "기업명순" },
          { value: "계약금액순", label: "계약금액순" }
        ]}
        triggerClassName="ml-auto"
      />
    </div>
  )
}
```

### 예제 3: Placeholder 사용

```tsx
<CommonSelect
  value={category}
  onValueChange={setCategory}
  options={categoryOptions}
  placeholder="카테고리를 선택하세요"
/>
```

### 예제 4: 비활성화 상태

```tsx
<LabeledSelect
  label="상태:"
  value={status}
  onValueChange={setStatus}
  options={statusOptions}
  disabled={isLoading}
/>
```

## 고급 사용법

### 1. 동적 옵션 생성

```tsx
import { useMemo } from "react"

function DynamicSelect() {
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const yearOptions = []

    for (let i = 0; i < 5; i++) {
      const year = (currentYear - i).toString()
      yearOptions.push({
        value: year,
        label: `${year}년`
      })
    }

    return yearOptions
  }, [])

  return (
    <LabeledSelect
      label="연도:"
      value={selectedYear}
      onValueChange={setSelectedYear}
      options={years}
    />
  )
}
```

### 2. 여러 셀렉트박스 조합

```tsx
function FilterBar() {
  const [year, setYear] = useState("2024")
  const [month, setMonth] = useState("all")
  const [category, setCategory] = useState("all")

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <LabeledSelect
        label="연도:"
        value={year}
        onValueChange={setYear}
        options={yearOptions}
      />

      <LabeledSelect
        label="월:"
        value={month}
        onValueChange={setMonth}
        options={monthOptions}
      />

      <LabeledSelect
        label="카테고리:"
        value={category}
        onValueChange={setCategory}
        options={categoryOptions}
      />
    </div>
  )
}
```

### 3. 조건부 옵션

```tsx
function ConditionalSelect() {
  const [type, setType] = useState("monthly")
  const [period, setPeriod] = useState("")

  // type에 따라 다른 옵션 제공
  const periodOptions = useMemo(() => {
    if (type === "monthly") {
      return [
        { value: "1", label: "1개월" },
        { value: "3", label: "3개월" },
        { value: "6", label: "6개월" }
      ]
    }
    return [
      { value: "2024", label: "2024년" },
      { value: "2025", label: "2025년" }
    ]
  }, [type])

  return (
    <>
      <LabeledSelect
        label="유형:"
        value={type}
        onValueChange={setType}
        options={[
          { value: "monthly", label: "월별" },
          { value: "yearly", label: "연도별" }
        ]}
      />

      <LabeledSelect
        label="기간:"
        value={period}
        onValueChange={setPeriod}
        options={periodOptions}
      />
    </>
  )
}
```

## 스타일 커스터마이징

### 1. 트리거 크기 조정

```tsx
<CommonSelect
  value={value}
  onValueChange={setValue}
  options={options}
  triggerClassName="w-40 h-10"  // 너비 40, 높이 10
/>
```

### 2. 레이블 스타일 변경

```tsx
<LabeledSelect
  label="선택:"
  labelClassName="text-base font-bold text-blue-600"
  value={value}
  onValueChange={setValue}
  options={options}
/>
```

### 3. 래퍼 레이아웃 조정

```tsx
<LabeledSelect
  label="상태:"
  wrapperClassName="flex-col items-start gap-1"  // 세로 정렬
  value={value}
  onValueChange={setValue}
  options={options}
/>
```

### 4. 드롭다운 스타일

```tsx
<CommonSelect
  value={value}
  onValueChange={setValue}
  options={options}
  contentClassName="max-h-60 overflow-auto"  // 최대 높이 제한
/>
```

### 5. 전체 커스터마이징 예제

```tsx
<LabeledSelect
  label="기간 선택:"
  labelClassName="text-sm font-semibold text-gray-700"
  wrapperClassName="flex items-center gap-3"
  triggerClassName="w-48 h-10 border-2 border-blue-500"
  contentClassName="max-h-72"
  value={value}
  onValueChange={setValue}
  options={options}
/>
```

## 주의사항

### ⚠️ 중요한 사항

1. **value는 항상 문자열**
   ```tsx
   // ❌ 잘못된 예
   <CommonSelect value={123} ... />

   // ✅ 올바른 예
   <CommonSelect value="123" ... />
   ```

2. **options의 value는 고유해야 함**
   ```tsx
   // ❌ 중복된 value
   const options = [
     { value: "1", label: "옵션 1" },
     { value: "1", label: "옵션 2" }  // 중복!
   ]

   // ✅ 고유한 value
   const options = [
     { value: "1", label: "옵션 1" },
     { value: "2", label: "옵션 2" }
   ]
   ```

3. **초기값은 options에 있는 value여야 함**
   ```tsx
   const options = [
     { value: "a", label: "A" },
     { value: "b", label: "B" }
   ]

   // ❌ options에 없는 값
   const [value, setValue] = useState("c")

   // ✅ options에 있는 값
   const [value, setValue] = useState("a")
   ```

4. **onChange가 아닌 onValueChange 사용**
   ```tsx
   // ❌ 잘못된 prop 이름
   <CommonSelect onChange={...} />

   // ✅ 올바른 prop 이름
   <CommonSelect onValueChange={...} />
   ```

### 💡 권장사항

1. **options는 컴포넌트 외부 또는 useMemo로 정의**
   ```tsx
   // ✅ 권장: 상수로 정의
   const STATUS_OPTIONS = [
     { value: "active", label: "활성" },
     { value: "inactive", label: "비활성" }
   ]

   // ✅ 권장: useMemo 사용
   const options = useMemo(() => generateOptions(), [deps])

   // ❌ 비권장: 렌더링마다 새로 생성
   <CommonSelect options={[{ value: "a", label: "A" }]} />
   ```

2. **접근성을 위해 레이블 사용 권장**
   ```tsx
   // ✅ 접근성 좋음
   <LabeledSelect label="연도:" ... />

   // ⚠️ 접근성 부족 (필요한 경우만 사용)
   <CommonSelect ... />
   ```

## 트러블슈팅

### 문제 1: 선택한 값이 표시되지 않음

**원인**: value가 options에 없음

**해결**:
```tsx
// value가 options의 value 중 하나인지 확인
console.log("Current value:", value)
console.log("Available options:", options.map(o => o.value))
```

### 문제 2: onValueChange가 호출되지 않음

**원인**: prop 이름 오타 또는 함수가 아님

**해결**:
```tsx
// ✅ 올바른 사용
<CommonSelect onValueChange={(val) => console.log(val)} />

// ❌ 잘못된 prop 이름
<CommonSelect onChange={...} />
```

### 문제 3: 스타일이 적용되지 않음

**원인**: className이 오버라이드되지 않음

**해결**:
```tsx
// triggerClassName을 사용하여 트리거 스타일 변경
<CommonSelect
  triggerClassName="w-full h-12"  // 커스텀 크기
/>
```

### 문제 4: TypeScript 에러

**원인**: options 타입 불일치

**해결**:
```tsx
import type { SelectOption } from "@/components/ui/common-select"

// 타입 명시
const options: SelectOption[] = [
  { value: "1", label: "옵션 1" },
  { value: "2", label: "옵션 2" }
]
```

## 실제 사용 사례

### 1. Revenue 페이지 (매출현황)

```tsx
// app/revenue/page.tsx
<LabeledSelect
  label="연도:"
  value={selectedYear}
  onValueChange={setSelectedYear}
  options={[
    { value: "2024", label: "2024년" },
    { value: "2025", label: "2025년" }
  ]}
/>
```

### 2. Contract 페이지 (계약현황)

```tsx
// app/contract/page.tsx
<CommonSelect
  value={contractFilter}
  onValueChange={setContractFilter}
  options={[
    { value: "등록일순", label: "등록일순" },
    { value: "기업명순", label: "기업명순" },
    { value: "계약금액순", label: "계약금액순" }
  ]}
  triggerClassName="flex-shrink-0 ml-auto sm:ml-0"
/>
```

## 추가 자료

- **위치**: `components/ui/common-select.tsx`
- **의존성**: `@/components/ui/select`, `@/lib/utils`
- **Shadcn UI Select**: [문서](https://ui.shadcn.com/docs/components/select)

## 마무리

`CommonSelect` 컴포넌트를 사용하면:
- ✅ 일관된 디자인 유지
- ✅ 코드 재사용성 향상
- ✅ 유지보수 용이
- ✅ 타입 안전성 보장

프로젝트 전체에서 셀렉트박스가 필요한 경우 이 컴포넌트를 사용하세요!

---

**업데이트**: 2025-10-17
**작성자**: Development Team
