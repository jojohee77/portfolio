# EventPopup 컴포넌트 가이드

## 개요

`EventPopup`은 이벤트, 공지사항, 프로모션 등을 표시하기 위한 모달 팝업 컴포넌트입니다. "다시 보지 않기" 기능을 포함하여 사용자 경험을 향상시킵니다.

## 위치

```
components/ui/event-popup.tsx
```

## 팝업 구조

일반적인 웹 팝업 구조를 따릅니다:

```
╔═════════════════════╗
║                     ║
║   이미지 영역        ║  ← 여백 없음
║   (클릭 가능)        ║
║                     ║
╠═════════════════════╣
║ 이벤트 보러가기      ║  ← 버튼 (여백 없음)
╚═════════════════════╝
  ↑ 하나의 덩어리처럼 보임
    
  ☐ 다시 보지 않기  ✕ 닫기  ← 완전 분리, 흰색 텍스트
```

**3개의 독립적인 영역:**
1. **이미지 영역**: 클릭 시 링크 이동
2. **바로가기 버튼**: `showImageButton={true}`일 때만 표시, 이미지와 여백 없이 붙음
3. **컨트롤 영역**: 완전히 분리된 별도 영역, 배경 없음, 흰색 텍스트

> 💡 이미지와 버튼은 하나의 `wrapper`로 감싸져 있어 시각적으로 하나의 덩어리처럼 보이지만, 실제로는 별개의 요소입니다.

## 주요 기능

- ✅ 이미지와 컨트롤 영역 완전 분리 (일반적인 팝업 구조)
- ✅ 이미지 하단 버튼 on/off 가능 (`showImageButton` props)
- ✅ 이미지 클릭으로 링크 이동 가능
- ✅ "다시 보지 않기" 기능 (로컬스토리지 활용)
- ✅ 커스터마이징 가능한 배경 (색상/이미지)
- ✅ 반응형 디자인
- ✅ 애니메이션 효과
- ✅ 커스텀 컨텐츠 지원 (children)
- ✅ 접근성 고려 (배경 클릭으로 닫기)

## Props

| 속성 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `isOpen` | `boolean` | ✅ | - | 팝업 오픈 상태 |
| `onClose` | `() => void` | ✅ | - | 팝업 닫기 핸들러 |
| `popupId` | `string` | ✅ | - | 팝업 고유 ID (로컬스토리지 키) |
| `onButtonClick` | `() => void` | ✅ | - | 메인 버튼/이미지 클릭 핸들러 |
| `title` | `string` | ❌ | - | 메인 타이틀 (빈 문자열이면 타이틀 영역 숨김) |
| `buttonText` | `string` | ❌ | - | 메인 버튼 텍스트 (빈 문자열이면 버튼 숨김) |
| `showImageButton` | `boolean` | ❌ | `false` | 이미지 하단에 버튼 표시 여부 |
| `topText` | `string` | ❌ | - | 상단 텍스트 |
| `subtitle` | `string` | ❌ | - | 서브 타이틀 |
| `backgroundImage` | `string` | ❌ | - | 배경 이미지 URL (<img> 태그로 렌더링, 클릭 가능) |
| `backgroundColor` | `string` | ❌ | `linear-gradient(180deg, #0A1E3D 0%, #1A3A5C 100%)` | 배경 색상 |
| `buttonColor` | `string` | ❌ | `#00A8FF` | 버튼 색상 |
| `showDoNotShowAgain` | `boolean` | ❌ | `true` | "다시 보지 않기" 표시 여부 |
| `showCloseButton` | `boolean` | ❌ | `true` | 닫기 버튼 표시 여부 |
| `width` | `string` | ❌ | `500px` | 팝업 너비 |
| `height` | `string` | ❌ | `auto` | 팝업 높이 |
| `children` | `React.ReactNode` | ❌ | - | 커스텀 컨텐츠 |

## 기본 사용법

### 1. 간단한 이벤트 팝업

```tsx
import { useState } from "react"
import EventPopup from "@/components/ui/event-popup"

export default function MyPage() {
  const [popupOpen, setPopupOpen] = useState(true)

  return (
    <div>
      <EventPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        popupId="summer-event-2024"
        title="여름 특별 이벤트"
        subtitle="최대 50% 할인"
        buttonText="이벤트 참여하기"
        onButtonClick={() => {
          window.location.href = "/event"
          setPopupOpen(false)
        }}
      />
      
      {/* 페이지 컨텐츠 */}
    </div>
  )
}
```

### 2. 커스텀 컨텐츠가 있는 팝업

```tsx
<EventPopup
  isOpen={popupOpen}
  onClose={() => setPopupOpen(false)}
  popupId="ridi2024-awards"
  topText="당신이 선택하는 올해의 리더"
  title="RIDI2024"
  subtitle="AWARDS"
  buttonText="이벤트 보러가기"
  onButtonClick={() => {
    window.open("https://example.com/event", "_blank")
    setPopupOpen(false)
  }}
  width="450px"
  height="600px"
>
  {/* 커스텀 로고 또는 이미지 */}
  <div className="relative w-48 h-48 flex items-center justify-center">
    <div className="text-[#00A8FF] font-black text-[120px]">
      R
    </div>
  </div>
</EventPopup>
```

### 3. 배경 이미지를 사용하는 팝업

```tsx
<EventPopup
  isOpen={popupOpen}
  onClose={() => setPopupOpen(false)}
  popupId="new-year-2025"
  title="2025년 새해 복 많이 받으세요"
  buttonText="혜택 받기"
  onButtonClick={() => {
    console.log("혜택 받기 클릭")
    setPopupOpen(false)
  }}
  backgroundImage="/images/new-year-bg.jpg"
  buttonColor="#FF6B6B"
/>
```

### 4. 이미지 + 하단 버튼 팝업

```tsx
<EventPopup
  isOpen={popupOpen}
  onClose={() => setPopupOpen(false)}
  popupId="ridi2024-awards"
  onButtonClick={() => {
    window.open("https://example.com/event", "_blank")
    setPopupOpen(false)
  }}
  backgroundImage="/popup-test.JPG"
  buttonText="이벤트 보러가기"
  showImageButton={true}  // 이미지 바로 아래 버튼 표시
  width="400px"
  height="600px"
/>
```
> 💡 **팁**: `showImageButton={true}`로 설정하면 이미지 바로 아래 여백 없이 버튼이 붙습니다. 이미지와 버튼이 하나의 덩어리처럼 보이지만 실제로는 별개 요소입니다. 버튼을 넣었다 뺐다 하려면 이 props를 `true`/`false`로 변경하면 됩니다.

### 5. 이미지만 있는 팝업 (버튼 없음)

```tsx
<EventPopup
  isOpen={popupOpen}
  onClose={() => setPopupOpen(false)}
  popupId="simple-popup"
  onButtonClick={() => {
    window.open("https://example.com/event", "_blank")
    setPopupOpen(false)
  }}
  backgroundImage="/popup-test.JPG"
  showImageButton={false}  // 버튼 숨김 (기본값)
  width="400px"
  height="600px"
/>
```
> 💡 **팁**: `showImageButton={false}` (기본값)이면 이미지만 표시됩니다. 이미지를 클릭하면 `onButtonClick`이 실행됩니다.

### 6. 단순한 공지 팝업 (다시 보지 않기 없음)

```tsx
<EventPopup
  isOpen={popupOpen}
  onClose={() => setPopupOpen(false)}
  popupId="maintenance-notice"
  title="시스템 점검 안내"
  subtitle="2024.12.25 02:00 ~ 04:00"
  buttonText="확인"
  onButtonClick={() => setPopupOpen(false)}
  showDoNotShowAgain={false}
  backgroundColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  width="400px"
>
  <div className="text-white/90 text-sm text-center px-4">
    <p>더 나은 서비스를 위해</p>
    <p>시스템 점검을 진행합니다.</p>
  </div>
</EventPopup>
```

## 고급 사용법

### 페이지 로드 시 자동 팝업

```tsx
"use client"

import { useState, useEffect } from "react"
import EventPopup from "@/components/ui/event-popup"

export default function Dashboard() {
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    // 페이지 로드 후 1초 뒤에 팝업 표시
    const timer = setTimeout(() => {
      setPopupOpen(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div>
      <EventPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        popupId="welcome-popup"
        title="환영합니다!"
        buttonText="시작하기"
        onButtonClick={() => setPopupOpen(false)}
      />
      
      {/* 페이지 컨텐츠 */}
    </div>
  )
}
```

### 조건부 팝업 표시

```tsx
"use client"

import { useState, useEffect } from "react"
import EventPopup from "@/components/ui/event-popup"

export default function MyPage() {
  const [popupOpen, setPopupOpen] = useState(false)

  useEffect(() => {
    // 특정 조건일 때만 팝업 표시
    const isFirstVisit = !localStorage.getItem("visited")
    const isSpecialDay = new Date().getDay() === 5 // 금요일
    
    if (isFirstVisit && isSpecialDay) {
      setPopupOpen(true)
      localStorage.setItem("visited", "true")
    }
  }, [])

  return (
    <div>
      <EventPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        popupId="friday-special"
        title="금요일 특별 할인"
        buttonText="할인받기"
        onButtonClick={() => setPopupOpen(false)}
      />
    </div>
  )
}
```

### 여러 팝업 순차적으로 표시

```tsx
"use client"

import { useState } from "react"
import EventPopup from "@/components/ui/event-popup"

export default function MyPage() {
  const [popup1Open, setPopup1Open] = useState(true)
  const [popup2Open, setPopup2Open] = useState(false)

  const handlePopup1Close = () => {
    setPopup1Open(false)
    // 첫 번째 팝업이 닫히면 두 번째 팝업 표시
    setTimeout(() => {
      setPopup2Open(true)
    }, 500)
  }

  return (
    <div>
      <EventPopup
        isOpen={popup1Open}
        onClose={handlePopup1Close}
        popupId="event-1"
        title="이벤트 1"
        buttonText="다음"
        onButtonClick={handlePopup1Close}
      />
      
      <EventPopup
        isOpen={popup2Open}
        onClose={() => setPopup2Open(false)}
        popupId="event-2"
        title="이벤트 2"
        buttonText="완료"
        onButtonClick={() => setPopup2Open(false)}
      />
    </div>
  )
}
```

## 스타일링 커스터마이징

### 그라데이션 배경

```tsx
<EventPopup
  backgroundColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  // ... 다른 props
/>
```

### 단색 배경

```tsx
<EventPopup
  backgroundColor="#1A1A2E"
  // ... 다른 props
/>
```

### 이미지 배경

```tsx
<EventPopup
  backgroundImage="/images/event-background.jpg"  // <img> 태그로 렌더링됨
  // ... 다른 props
/>
```

> 💡 **참고**: `backgroundImage`를 설정하면 CSS background가 아닌 `<img>` 태그로 렌더링됩니다. 이미지가 반복되지 않고 `object-cover`로 영역을 가득 채웁니다.

### 버튼 색상 변경

```tsx
<EventPopup
  buttonColor="#FF4081"
  // ... 다른 props
/>
```

## "다시 보지 않기" 기능

### 작동 원리

1. 사용자가 "다시 보지 않기" 체크박스를 선택하고 팝업을 닫으면
2. `localStorage`에 `event-popup-${popupId}` 키로 `"true"` 값이 저장됩니다
3. 다음 방문 시 해당 팝업은 자동으로 표시되지 않습니다

### 로컬스토리지 초기화 (개발/테스트용)

```javascript
// 특정 팝업의 "다시 보지 않기" 설정 제거
localStorage.removeItem("event-popup-ridi2024-awards")

// 모든 이벤트 팝업 설정 제거
Object.keys(localStorage).forEach(key => {
  if (key.startsWith("event-popup-")) {
    localStorage.removeItem(key)
  }
})
```

## 베스트 프랙티스

### ✅ 권장사항

1. **고유한 popupId 사용**: 각 팝업마다 고유한 ID를 지정하세요
2. **적절한 타이밍**: 페이지 로드 직후보다는 약간의 딜레이를 주는 것이 좋습니다
3. **모바일 최적화**: 작은 화면에서도 잘 보이도록 width를 적절히 설정하세요
4. **명확한 행동 유도**: 버튼 텍스트는 명확하고 구체적으로 작성하세요
5. **접근성**: 키보드로도 닫을 수 있도록 ESC 키 지원을 고려하세요

### ❌ 피해야 할 사항

1. 한 페이지에 너무 많은 팝업 표시
2. 닫기 버튼 없는 강제 팝업
3. 너무 큰 크기의 팝업 (화면을 가득 채우는)
4. 불필요하게 자주 표시되는 팝업
5. 중요하지 않은 내용으로 사용자 방해

## 접근성 고려사항

- 배경 클릭으로 팝업을 닫을 수 있습니다
- "닫기" 버튼이 명확하게 표시됩니다
- 색상 대비가 충분하여 가독성이 좋습니다
- 모바일 디바이스에서도 잘 작동합니다

## 문제 해결

### 팝업이 표시되지 않아요

1. `isOpen` prop이 `true`인지 확인하세요
2. 로컬스토리지에 "다시 보지 않기" 설정이 저장되어 있는지 확인하세요
3. z-index 충돌이 없는지 확인하세요 (EventPopup은 z-[9999] 사용)

### "다시 보지 않기"가 작동하지 않아요

1. `popupId`가 올바르게 설정되어 있는지 확인하세요
2. 브라우저 로컬스토리지가 활성화되어 있는지 확인하세요
3. 개발자 도구에서 로컬스토리지 값을 확인하세요

### 모바일에서 레이아웃이 깨져요

1. `width`를 px 대신 `90vw` 같은 상대 단위로 설정해보세요
2. `maxWidth`와 `maxHeight`가 자동으로 설정되어 있으니 커스텀이 필요하면 CSS로 오버라이드하세요

## 예제 시나리오

### 시나리오 1: 신규 기능 안내

```tsx
<EventPopup
  isOpen={showNewFeature}
  onClose={() => setShowNewFeature(false)}
  popupId="new-feature-v2"
  title="새로운 기능이 추가되었습니다!"
  subtitle="AI 기반 리포트 생성"
  buttonText="지금 사용해보기"
  onButtonClick={() => {
    router.push("/reports/new")
    setShowNewFeature(false)
  }}
  buttonColor="#10B981"
>
  <div className="text-white text-center">
    <p>클릭 한 번으로 전문적인 리포트를</p>
    <p>자동으로 생성할 수 있습니다.</p>
  </div>
</EventPopup>
```

### 시나리오 2: 기간 한정 프로모션

```tsx
<EventPopup
  isOpen={showPromo}
  onClose={() => setShowPromo(false)}
  popupId="black-friday-2024"
  topText="11월 29일까지"
  title="블랙프라이데이"
  subtitle="전 상품 최대 70% 할인"
  buttonText="쇼핑하러 가기"
  onButtonClick={() => {
    router.push("/shop/sale")
    setShowPromo(false)
  }}
  backgroundColor="linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
  buttonColor="#FFD700"
/>
```

### 시나리오 3: 사용자 피드백 요청

```tsx
<EventPopup
  isOpen={showFeedback}
  onClose={() => setShowFeedback(false)}
  popupId="user-feedback-q4"
  title="의견을 들려주세요"
  subtitle="여러분의 소중한 의견이 필요합니다"
  buttonText="설문조사 참여"
  onButtonClick={() => {
    window.open("https://survey.example.com", "_blank")
    setShowFeedback(false)
  }}
  buttonColor="#8B5CF6"
  showDoNotShowAgain={true}
>
  <div className="text-white/90 text-sm text-center">
    <p>설문조사는 약 3분 소요되며,</p>
    <p>참여하신 분들께 추첨을 통해</p>
    <p>소정의 상품을 드립니다.</p>
  </div>
</EventPopup>
```

## 관련 컴포넌트

- `Dialog` - 일반적인 다이얼로그 컴포넌트
- `AlertDialog` - 경고/확인 다이얼로그
- `Sheet` - 사이드 패널
- `LoadingModal` - 로딩 모달

## 버전 히스토리

- v1.0.0 (2024-10-13): 초기 버전 생성
  - 기본 팝업 기능
  - "다시 보지 않기" 기능
  - 커스터마이징 옵션

---

## 피드백 및 개선 제안

이 컴포넌트에 대한 피드백이나 개선 제안이 있으시면 개발팀에 문의해주세요.

