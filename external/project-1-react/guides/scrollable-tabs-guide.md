# ScrollableTabs 컴포넌트 가이드

스크롤 가능한 탭 네비게이션 컴포넌트입니다. 모바일에서 탭이 많을 때 가로 스크롤로 모든 탭에 접근할 수 있습니다.

## 📋 개요

- **파일 위치**: `components/ui/scrollable-tabs.tsx`
- **타입**: React 함수형 컴포넌트
- **주요 기능**: 
  - 가로 스크롤 가능한 탭 네비게이션
  - 현재 경로에 따른 활성 탭 표시
  - 스크롤 가능할 때 시각적 인디케이터 표시
  - 반응형 디자인 (모바일/태블릿/데스크톱)

## 🚀 설치 및 임포트

```tsx
import { ScrollableTabs } from "@/components/ui/scrollable-tabs"
// 또는
import ScrollableTabs from "@/components/ui/scrollable-tabs"
```

## 💻 기본 사용법

```tsx
const tabs = [
  { name: "계정정보", href: "/profile/account" },
  { name: "멤버십 관리", href: "/profile/membership" },
  { name: "결제 정보", href: "/profile/payment" },
  { name: "MY문의", href: "/profile/inquiry" },
]

function MyPage() {
  return (
    <div>
      <h1>마이페이지</h1>
      <ScrollableTabs tabs={tabs} />
      {/* 나머지 콘텐츠 */}
    </div>
  )
}
```

## 🔧 Props API

### ScrollableTabsProps

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `tabs` | `Array<{name: string, href: string}>` | **필수** | 탭 목록 |
| `className` | `string` | `""` | 추가 CSS 클래스 |
| `gap` | `string` | `"gap-4 sm:gap-6 lg:gap-8"` | 탭 간격 |
| `textSize` | `string` | `"text-base sm:text-lg"` | 탭 텍스트 크기 |
| `activeClassName` | `string` | `"font-extrabold text-foreground underline underline-offset-8"` | 활성 탭 스타일 |
| `inactiveClassName` | `string` | `"text-muted-foreground hover:text-foreground"` | 비활성 탭 스타일 |

### Tab 객체

```tsx
interface Tab {
  name: string    // 탭에 표시될 텍스트
  href: string   // 클릭 시 이동할 경로
}
```

## 🎨 커스터마이징

### 1. 탭 간격 조정

```tsx
// 기본 간격
<ScrollableTabs tabs={tabs} />

// 커스텀 간격
<ScrollableTabs 
  tabs={tabs} 
  gap="gap-2 sm:gap-4 lg:gap-6" 
/>
```

### 2. 탭 크기 조정

```tsx
// 기본 크기
<ScrollableTabs tabs={tabs} />

// 커스텀 크기
<ScrollableTabs 
  tabs={tabs} 
  textSize="text-sm sm:text-base lg:text-lg" 
/>
```

### 3. 활성/비활성 탭 스타일 커스터마이징

```tsx
<ScrollableTabs 
  tabs={tabs}
  activeClassName="font-bold text-blue-600 border-b-2 border-blue-600"
  inactiveClassName="text-gray-500 hover:text-gray-700"
/>
```

### 4. 전체 컨테이너 스타일

```tsx
<ScrollableTabs 
  tabs={tabs}
  className="mb-6 bg-gray-50 p-4 rounded-lg"
/>
```

## 📱 반응형 동작

### 모바일 (< 640px)
- 탭 간격: 16px (`gap-4`)
- 텍스트 크기: 16px (`text-base`)
- 그라데이션 너비: 48px (`w-12`)

### 태블릿 (640px - 1024px)
- 탭 간격: 24px (`gap-6`)
- 텍스트 크기: 18px (`text-lg`)
- 그라데이션 너비: 48px (`w-12`)

### 데스크톱 (≥ 1024px)
- 탭 간격: 32px (`gap-8`)
- 텍스트 크기: 18px (`text-lg`)
- 그라데이션 너비: 64px (`w-16`)

## 🔄 동적 기능

### 스크롤 인디케이터
- 탭이 화면 너비를 초과할 때만 오른쪽에 그라데이션 표시
- 끝까지 스크롤하면 자동으로 사라짐
- 스크롤바는 숨김 처리 (`scrollbar-hide`)

### 활성 탭 감지
- `usePathname()` 훅으로 현재 경로와 탭 href 비교
- 정확한 매칭 시 활성 상태로 표시

## 💡 사용 예제

### 1. 마이페이지 탭

```tsx
const profileTabs = [
  { name: "계정정보", href: "/profile/account" },
  { name: "멤버십 관리", href: "/profile/membership" },
  { name: "결제 정보", href: "/profile/payment" },
  { name: "MY문의", href: "/profile/inquiry" },
]

<ScrollableTabs tabs={profileTabs} />
```

### 2. 상태 관리 탭

```tsx
const statusTabs = [
  { name: "포스팅현황", href: "/status/posting" },
  { name: "키워드현황", href: "/status/keywords" },
  { name: "매출현황", href: "/status/revenue" },
  { name: "성과현황", href: "/status/performance" },
]

<ScrollableTabs 
  tabs={statusTabs}
  className="mb-4"
/>
```

### 3. 커스텀 스타일 탭

```tsx
<ScrollableTabs 
  tabs={tabs}
  gap="gap-6 sm:gap-8"
  textSize="text-lg sm:text-xl"
  activeClassName="font-bold text-primary border-b-2 border-primary"
  inactiveClassName="text-gray-600 hover:text-gray-800"
  className="border-b border-gray-200 pb-2"
/>
```

## ⚠️ 주의사항

1. **탭 href와 현재 경로 정확히 일치해야 함**
   ```tsx
   // ✅ 올바른 예
   { name: "계정정보", href: "/profile/account" }
   
   // ❌ 잘못된 예 (trailing slash 불일치)
   { name: "계정정보", href: "/profile/account/" }
   ```

2. **탭 이름은 적절한 길이로 제한**
   - 너무 긴 이름은 모바일에서 가독성 저하
   - 권장: 2-6자 정도

3. **탭 개수 고려**
   - 3-4개: 대부분의 화면에서 문제없음
   - 5개 이상: 스크롤 인디케이터 표시됨

## 🐛 트러블슈팅

### 문제: 활성 탭이 제대로 표시되지 않음

**원인**: href와 현재 경로가 정확히 일치하지 않음

**해결책**:
```tsx
// 현재 경로 확인
console.log(pathname) // 예: "/profile/account"

// 탭 href와 정확히 일치시킴
{ name: "계정정보", href: "/profile/account" }
```

### 문제: 스크롤 인디케이터가 표시되지 않음

**원인**: 탭이 화면 너비를 초과하지 않음

**해결책**:
- 임시로 더 많은 탭 추가하여 테스트
- 또는 `gap` 값을 줄여서 공간 확보

### 문제: 모바일에서 스크롤이 되지 않음

**원인**: CSS 스크롤바 숨김 클래스 미적용

**해결책**:
```css
/* globals.css에 추가 */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

## 🔗 관련 컴포넌트

- [기본 Tabs 컴포넌트](./tabs.tsx) - 단순한 탭 (스크롤 기능 없음)
- [StepIndicator 컴포넌트](./step-indicator.tsx) - 단계별 진행 표시
- [StepNavigation 컴포넌트](./step-navigation.tsx) - 단계별 네비게이션

## 📝 업데이트 이력

- **2025-01-15**: 초기 작성
- **2025-01-15**: ScrollableTabs 컴포넌트 생성
- **2025-01-15**: 가이드 문서 작성

---

**유지보수**: 새로운 기능 추가나 변경사항이 있을 때 이 가이드를 업데이트해주세요.
