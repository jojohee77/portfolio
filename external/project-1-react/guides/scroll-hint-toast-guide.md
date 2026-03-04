# 좌우 스크롤 안내 토스트 가이드 (ScrollHintToast)

## 📋 개요

`ScrollHintToast`는 사용자에게 수평 스크롤이 가능함을 알려주는 공통 컴포넌트입니다. 모바일 환경에서 터치 드래그/스크롤 가능한 영역을 명확히 표시합니다.

## 🎨 특징

- ✅ 일관된 UI/UX 제공 (⬅️ 손가락 👆 ➡️ 디자인)
- ✅ 자동 숨김 기능 (3초)
- ✅ 사용자 수동 닫기 버튼
- ✅ 커스텀 텍스트 지원
- ✅ 재사용 가능한 컴포넌트

## 📦 Props

| Props | 타입 | 기본값 | 설명 |
|-------|------|--------|------|
| `show` | `boolean` | `true` | 토스트 표시 여부 |
| `autoHideDuration` | `number` | `3000` | 자동 숨김 시간 (ms) |
| `onClose` | `() => void` | - | 토스트 닫기 콜백 |
| `text` | `string` | `"좌우로 스크롤 하세요"` | 안내 텍스트 |

## 💡 사용 예시

### 1️⃣ 기본 사용법

```tsx
import { ScrollHintToast } from "@/components/scroll-hint-toast"
import { useState } from "react"

export function MyComponent() {
  const [showToast, setShowToast] = useState(true)

  return (
    <div className="relative">
      <ScrollHintToast 
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      {/* 스크롤 가능한 컨텐츠 */}
    </div>
  )
}
```

### 2️⃣ 커스텀 텍스트

```tsx
<ScrollHintToast 
  show={showToast}
  text="좌우로 드래그하세요"
  onClose={() => setShowToast(false)}
/>
```

### 3️⃣ 자동 숨김 시간 변경

```tsx
<ScrollHintToast 
  show={showToast}
  autoHideDuration={5000}  // 5초
  onClose={() => setShowToast(false)}
/>
```

### 4️⃣ 차트와 함께 사용 (KeywordDetailModal 예시)

```tsx
const [showScrollToast, setShowScrollToast] = useState(true)

return (
  <div className="md:hidden h-64 overflow-hidden relative">
    <ScrollHintToast 
      show={showScrollToast}
      onClose={() => setShowScrollToast(false)}
    />
    <Bar data={chartData} options={chartOptions} />
  </div>
)
```

### 5️⃣ 테이블과 함께 사용 (DailyKeywordsTable 예시)

```tsx
const [showScrollToast, setShowScrollToast] = useState(true)

return (
  <div className="relative">
    <ScrollHintToast 
      show={showScrollToast}
      text="테이블을 좌우로 스크롤하세요"
      onClose={() => setShowScrollToast(false)}
    />
    {/* 테이블 컨텐츠 */}
  </div>
)
```

## 🎯 Best Practices

### ✅ DO (해야 할 것)

1. **부모 요소에 `relative` 추가**
   ```tsx
   <div className="relative">
     <ScrollHintToast show={showToast} />
     {/* 스크롤 컨텐츠 */}
   </div>
   ```

2. **모바일에만 표시하기**
   ```tsx
   <div className="md:hidden relative">
     <ScrollHintToast show={showToast} />
   </div>
   ```

3. **상태 관리 정리**
   ```tsx
   // 토스트를 더 이상 표시하지 않으려면
   const handleScroll = () => {
     setShowToast(false)  // 첫 스크롤 시 숨기기
   }
   ```

### ❌ DON'T (하지 말아야 할 것)

1. **부모 요소의 `position` 설정 안 함**
   ```tsx
   // 잘못됨
   <div>
     <ScrollHintToast show={showToast} />
   </div>
   ```

2. **여러 토스트 동시 표시**
   ```tsx
   // 각 요소마다 하나씩만 사용
   ```

3. **자동 숨김 시간을 0으로 설정**
   ```tsx
   // 사용자가 수동으로 닫기 버튼을 눌러야 함
   autoHideDuration={0}
   ```

## 📱 반응형 레이아웃

```tsx
// PC에서는 숨기고 모바일에서만 표시
<div className="md:hidden relative h-64">
  <ScrollHintToast show={showToast} />
  {/* 모바일 스크롤 컨텐츠 */}
</div>

// PC 버전
<div className="hidden md:block h-80">
  {/* PC 고정 레이아웃 */}
</div>
```

## 🔧 고급 사용법

### 터치 이벤트와 통합

```tsx
const handleTouchEnd = (e: React.TouchEvent) => {
  const dragDistance = startX - endX
  
  if (Math.abs(dragDistance) > 50) {
    setShowToast(false)  // 스크롤 시작 시 토스트 숨기기
  }
}

return (
  <div 
    className="relative"
    onTouchEnd={handleTouchEnd}
  >
    <ScrollHintToast show={showToast} />
  </div>
)
```

### 조건부 표시

```tsx
// 첫 방문 시만 표시
const [isFirstVisit, setIsFirstVisit] = useState(true)

useEffect(() => {
  const visited = localStorage.getItem("visited")
  if (visited) {
    setIsFirstVisit(false)
  }
}, [])

return (
  <ScrollHintToast 
    show={showToast && isFirstVisit}
    onClose={() => {
      setShowToast(false)
      localStorage.setItem("visited", "true")
    }}
  />
)
```

## 📊 현재 적용되는 컴포넌트

- ✅ `KeywordDetailModal` - 모바일 차트 스크롤 안내
- ✅ `DailyKeywordsTable` - 테이블 좌우 스크롤 안내

## 🔄 마이그레이션 가이드

### 기존 코드 (중복)
```tsx
{showScrollToast && (
  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
    <div className="bg-gray-700 bg-opacity-90 rounded-xl px-4 py-3">
      {/* 토스트 내용 */}
    </div>
  </div>
)}
```

### 신규 코드 (공통 컴포넌트 사용)
```tsx
import { ScrollHintToast } from "@/components/scroll-hint-toast"

<ScrollHintToast 
  show={showScrollToast}
  onClose={() => setShowScrollToast(false)}
/>
```

## 🎨 스타일 커스터마이징

기본 스타일은 고정되어 있지만, 필요시 컴포넌트를 확장할 수 있습니다:

```tsx
// 기존 컴포넌트는 유지하고, 새 props 추가 예시
interface ScrollHintToastProps {
  // ... 기존 props
  bgColor?: string      // 배경색
  textColor?: string    // 텍스트색
  size?: 'sm' | 'md' | 'lg'  // 크기
}
```

## 📝 자주 묻는 질문 (FAQ)

**Q: 토스트가 표시되지 않아요**
- A: 부모 요소에 `position: relative` 또는 `relative` 클래스가 있는지 확인하세요

**Q: 자동 숨김 시간을 비활성화하려면?**
- A: `autoHideDuration={0}`으로 설정하면 사용자가 수동으로 닫을 때까지 유지됩니다

**Q: 모바일에서만 표시하려면?**
- A: 부모 div에 `md:hidden` 클래스를 추가하세요

**Q: 여러 개 표시할 수 있나요?**
- A: 각 스크롤 가능한 요소마다 하나씩 사용하세요. 겹치지 않도록 주의하세요
