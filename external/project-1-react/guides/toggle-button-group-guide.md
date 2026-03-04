# ToggleButtonGroup 컴포넌트 가이드

## 📋 개요

`ToggleButtonGroup`은 일관된 디자인의 토글 버튼 그룹을 제공하는 재사용 가능한 컴포넌트입니다.

## 🚀 기본 사용법

### 1. Import
```tsx
import { ToggleButtonGroup } from "@/components/ui/toggle-button-group"
```

### 2. 기본 사용
```tsx
const [selectedValue, setSelectedValue] = useState("option1")

<ToggleButtonGroup
  options={[
    { value: "option1", label: "옵션 1" },
    { value: "option2", label: "옵션 2" }
  ]}
  value={selectedValue}
  onValueChange={setSelectedValue}
/>
```

## 🎨 커스터마이징 옵션

### 색상 (color)
```tsx
// 파란색 (기본)
color="blue"

// 초록색
color="green"

// 보라색
color="purple"

// 빨간색
color="red"

// 주황색
color="orange"
```

### 크기 (size)
```tsx
// 작은 크기 (기본)
size="sm"  // h-7 sm:h-8 px-2 sm:px-3 text-xs

// 중간 크기
size="md"  // h-8 sm:h-10 px-3 sm:px-4 text-sm

// 큰 크기
size="lg"  // h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base
```

### 스타일 (variant)
```tsx
// 기본 스타일 (회색 배경)
variant="default"  // bg-slate-100 rounded-lg p-1

// 컴팩트 스타일 (연한 배경)
variant="compact"  // bg-slate-50 rounded-md p-0.5

// 아웃라인 스타일 (테두리)
variant="outline"  // border border-slate-200 rounded-lg p-1
```

## 📝 사용 예시

### 1. 기간 선택 토글
```tsx
const [selectedPeriod, setSelectedPeriod] = useState("monthly")

<ToggleButtonGroup
  options={[
    { value: "daily", label: "일별" },
    { value: "weekly", label: "주별" },
    { value: "monthly", label: "월별" },
    { value: "yearly", label: "연별" }
  ]}
  value={selectedPeriod}
  onValueChange={setSelectedPeriod}
  color="blue"
  size="md"
/>
```

### 2. 상태 필터 토글
```tsx
const [selectedStatus, setSelectedStatus] = useState("all")

<ToggleButtonGroup
  options={[
    { value: "all", label: "전체" },
    { value: "active", label: "활성" },
    { value: "inactive", label: "비활성" },
    { value: "pending", label: "대기" }
  ]}
  value={selectedStatus}
  onValueChange={setSelectedStatus}
  color="green"
  variant="compact"
/>
```

### 3. 팀 선택 토글
```tsx
const [selectedTeam, setSelectedTeam] = useState("team1")

<ToggleButtonGroup
  options={[
    { value: "team1", label: "1팀" },
    { value: "team2", label: "2팀" },
    { value: "team3", label: "3팀" },
    { value: "team4", label: "4팀" }
  ]}
  value={selectedTeam}
  onValueChange={setSelectedTeam}
  color="purple"
  size="lg"
/>
```

## 🎯 실제 적용 사례

### 매출현황 페이지
```tsx
// 상반기/하반기 토글
<ToggleButtonGroup
  options={[
    { value: "first", label: "상반기" },
    { value: "second", label: "하반기" }
  ]}
  value={selectedHalf}
  onValueChange={setSelectedHalf}
/>
```

### 성과현황 페이지
```tsx
// 전체/상반기/하반기 토글
<ToggleButtonGroup
  options={[
    { value: "전체", label: "전체" },
    { value: "상반기", label: "상반기" },
    { value: "하반기", label: "하반기" }
  ]}
  value={selectedHalf}
  onValueChange={setSelectedHalf}
  color="blue"
/>
```

### 업무현황 페이지
```tsx
// 팀/개인 성과 토글
<ToggleButtonGroup
  options={[
    { value: "team", label: "팀별 성과" },
    { value: "individual", label: "개인별 성과" }
  ]}
  value={activeTab}
  onValueChange={setActiveTab}
  color="green"
  size="md"
/>
```

## 🔧 고급 사용법

### 커스텀 클래스 추가
```tsx
<ToggleButtonGroup
  options={options}
  value={value}
  onValueChange={setValue}
  className="my-custom-class"
  color="blue"
/>
```

### 조건부 옵션
```tsx
const getOptions = () => {
  const baseOptions = [
    { value: "all", label: "전체" },
    { value: "active", label: "활성" }
  ]
  
  if (userRole === "admin") {
    baseOptions.push({ value: "inactive", label: "비활성" })
  }
  
  return baseOptions
}

<ToggleButtonGroup
  options={getOptions()}
  value={selectedStatus}
  onValueChange={setSelectedStatus}
/>
```

### 동적 색상 변경
```tsx
const getColor = (status: string) => {
  switch (status) {
    case "success": return "green"
    case "warning": return "orange"
    case "error": return "red"
    default: return "blue"
  }
}

<ToggleButtonGroup
  options={options}
  value={selectedValue}
  onValueChange={setSelectedValue}
  color={getColor(selectedValue)}
/>
```

## 📱 반응형 디자인

컴포넌트는 자동으로 반응형 디자인을 적용합니다:

- **모바일**: 작은 크기 (`h-7`, `px-2`, `text-xs`)
- **데스크톱**: 큰 크기 (`sm:h-8`, `sm:px-3`)

## 🎨 디자인 시스템

### 색상 팔레트
- **Blue**: `bg-blue-600` (기본)
- **Green**: `bg-green-600`
- **Purple**: `bg-purple-600`
- **Red**: `bg-red-600`
- **Orange**: `bg-orange-600`

### 타이포그래피
- **Small**: `text-xs`
- **Medium**: `text-sm`
- **Large**: `text-sm sm:text-base`

### 간격
- **Small**: `px-2 sm:px-3`
- **Medium**: `px-3 sm:px-4`
- **Large**: `px-4 sm:px-6`

## ⚠️ 주의사항

1. **옵션 배열**: `options`는 반드시 `value`와 `label` 속성을 가져야 합니다.
2. **값 동기화**: `value`와 `onValueChange`를 올바르게 연결해야 합니다.
3. **접근성**: 스크린 리더 사용자를 위해 명확한 라벨을 제공하세요.

## 🐛 문제 해결

### 토글이 작동하지 않는 경우
```tsx
// ❌ 잘못된 사용
<ToggleButtonGroup
  options={options}
  value={selectedValue}
  onValueChange={() => {}} // 빈 함수
/>

// ✅ 올바른 사용
<ToggleButtonGroup
  options={options}
  value={selectedValue}
  onValueChange={setSelectedValue} // 상태 업데이트 함수
/>
```

### 스타일이 적용되지 않는 경우
```tsx
// ❌ 잘못된 사용
<ToggleButtonGroup
  options={options}
  value={value}
  onValueChange={setValue}
  color="invalid-color" // 존재하지 않는 색상
/>

// ✅ 올바른 사용
<ToggleButtonGroup
  options={options}
  value={value}
  onValueChange={setValue}
  color="blue" // 유효한 색상
/>
```

## 📚 관련 컴포넌트

- `Button` - 기본 버튼 컴포넌트
- `CommonSelect` - 드롭다운 선택 컴포넌트
- `StatusSummaryCards` - 상태 요약 카드 컴포넌트

## 🔄 업데이트 히스토리

- **v1.0.0**: 초기 버전 (기본 토글 기능)
- **v1.1.0**: 색상 커스터마이징 추가
- **v1.2.0**: 크기 및 스타일 옵션 추가
- **v1.3.0**: 반응형 디자인 개선
