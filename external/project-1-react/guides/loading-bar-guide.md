# LoadingBar 사용 가이드

## 개요

`LoadingBar`는 데이터 로딩 중임을 사용자에게 알리는 가로 막대형 로딩 인디케이터 컴포넌트입니다. 임시저장 불러오기, 파일 업로드, 데이터 가져오기 등 비동기 작업 시 사용됩니다.

## 파일 위치

```
components/ui/loading-bar.tsx
```

## 주요 특징

- ✅ 커스터마이징 가능한 메시지
- ✅ 조절 가능한 바 높이
- ✅ 조절 가능한 바 너비
- ✅ 반응형 폰트 크기
- ✅ 부드러운 애니메이션 효과
- ✅ 간단한 사용법

## Props

| Props | 타입 | 필수 | 기본값 | 설명 |
|-------|------|------|--------|------|
| `message` | `string` | ❌ | "불러오는중입니다" | 로딩바 위에 표시할 메시지 |
| `barHeight` | `number` | ❌ | 8 | 로딩바 높이 (px 단위) |
| `barWidth` | `string` | ❌ | "max-w-xs" | 로딩바 최대 너비 (Tailwind 클래스) |
| `fontSize` | `'xs' \| 'sm' \| 'base'` | ❌ | "xs" | 메시지 폰트 크기 |
| `className` | `string` | ❌ | "" | 추가 CSS 클래스 |

## 기본 사용법

### 1. 컴포넌트 import

```tsx
import LoadingBar from "@/components/ui/loading-bar"
```

### 2. 로딩 상태 관리

```tsx
const [isLoading, setIsLoading] = useState(false)

const handleLoad = async () => {
  setIsLoading(true)
  try {
    await fetchData()
  } finally {
    setIsLoading(false)
  }
}
```

### 3. 조건부 렌더링

```tsx
{isLoading ? (
  <LoadingBar />
) : (
  <div>콘텐츠</div>
)}
```

## 사용 예시

### 예시 1: 기본 사용

```tsx
"use client"

import { useState } from "react"
import LoadingBar from "@/components/ui/loading-bar"

export default function MyComponent() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div>
      {isLoading ? (
        <LoadingBar />
      ) : (
        <div>데이터 표시</div>
      )}
    </div>
  )
}
```

### 예시 2: 커스텀 메시지

```tsx
<LoadingBar message="데이터를 가져오는 중입니다" />
```

### 예시 3: 높이 조절

```tsx
// 얇은 로딩바 (6px)
<LoadingBar barHeight={6} />

// 기본 로딩바 (8px)
<LoadingBar barHeight={8} />

// 두꺼운 로딩바 (12px)
<LoadingBar barHeight={12} />
```

### 예시 4: 너비 조절

```tsx
// 좁은 로딩바
<LoadingBar barWidth="max-w-[200px]" />

// 기본 로딩바
<LoadingBar barWidth="max-w-xs" />

// 넓은 로딩바
<LoadingBar barWidth="max-w-md" />

// 전체 너비
<LoadingBar barWidth="w-full" />
```

### 예시 5: 폰트 크기 조절

```tsx
// 작은 폰트 (12px)
<LoadingBar fontSize="xs" />

// 중간 폰트 (14px)
<LoadingBar fontSize="sm" />

// 큰 폰트 (16px)
<LoadingBar fontSize="base" />
```

### 예시 6: 여러 옵션 조합

```tsx
<LoadingBar
  message="파일을 업로드하는 중입니다"
  barHeight={10}
  barWidth="max-w-md"
  fontSize="sm"
  className="my-8"
/>
```

## 실전 활용 예시

### 임시저장 불러오기

```tsx
const DraftListModal = () => {
  const [isLoadingDraft, setIsLoadingDraft] = useState(false)

  const handleLoadDraft = async (draftId: string) => {
    setIsLoadingDraft(true)
    try {
      await loadDraftData(draftId)
      // 성공 처리
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingDraft(false)
    }
  }

  return (
    <div>
      {isLoadingDraft ? (
        <LoadingBar message="임시저장을 불러오는 중입니다" />
      ) : (
        <div>
          {draftList.map(draft => (
            <div key={draft.id} onClick={() => handleLoadDraft(draft.id)}>
              {draft.title}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 파일 업로드

```tsx
const FileUploadForm = () => {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      await uploadFile(file)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      {isUploading ? (
        <LoadingBar 
          message="파일을 업로드하는 중입니다"
          barHeight={10}
          barWidth="max-w-md"
        />
      ) : (
        <input type="file" onChange={(e) => handleUpload(e.target.files?.[0])} />
      )}
    </div>
  )
}
```

### 데이터 가져오기

```tsx
const DataList = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await getData()
        setData(result)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-6">
      {isLoading ? (
        <LoadingBar 
          message="데이터를 불러오는 중입니다"
          barHeight={8}
          fontSize="sm"
        />
      ) : (
        <div>
          {data.map(item => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### 모달 내부 사용

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>데이터 목록</DialogTitle>
    </DialogHeader>
    
    <div className="py-4">
      {isLoading ? (
        <LoadingBar 
          message="목록을 불러오는 중입니다"
          barHeight={8}
          barWidth="max-w-xs"
        />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      )}
    </div>
  </DialogContent>
</Dialog>
```

## 디자인 특징

### 애니메이션

- 로딩바가 좌우로 부드럽게 움직입니다
- 1.5초 주기로 반복됩니다
- `ease-in-out` 타이밍 함수 사용

### 색상

- **배경**: 회색 (`bg-gray-200`)
- **진행바**: 파란색 (`bg-blue-600`)
- **텍스트**: 중간 회색 (`text-gray-600`)

### 반응형

- 메시지는 다양한 폰트 크기 지원
- 로딩바 너비는 Tailwind 클래스로 조절 가능
- 모바일/데스크톱 모두 최적화

## 주의사항

1. **애니메이션 CSS 필요**: `globals.css`에 `@keyframes loading` 애니메이션이 정의되어 있어야 합니다.

```css
@keyframes loading {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(250%);
  }
  100% {
    transform: translateX(-100%);
  }
}
```

2. **높이 제한**: `barHeight`는 너무 크거나 작으면 시각적으로 어색할 수 있습니다 (권장: 6-12px).

3. **메시지 길이**: 너무 긴 메시지는 줄바꿈될 수 있으므로 간결하게 작성하세요.

4. **로딩 시간**: 로딩이 예상보다 오래 걸릴 경우 추가 메시지나 진행률 표시를 고려하세요.

## 접근성

- 로딩 메시지는 스크린 리더가 읽을 수 있습니다
- 시각적 피드백과 텍스트 피드백을 모두 제공합니다

## 커스터마이징

더 많은 커스터마이징이 필요한 경우 `components/ui/loading-bar.tsx` 파일을 수정할 수 있습니다:

- 색상 변경 (`bg-blue-600` → 다른 색상)
- 애니메이션 속도 조절 (`1.5s` → 다른 값)
- 진행바 너비 조절 (`width: '40%'` → 다른 값)
- 추가 스타일링

## Props 타입 정의

```typescript
interface LoadingBarProps {
  message?: string           // 로딩 메시지
  barHeight?: number         // 바 높이 (px)
  barWidth?: string          // 바 너비 (Tailwind 클래스)
  fontSize?: 'xs' | 'sm' | 'base'  // 폰트 크기
  className?: string         // 추가 클래스
}
```

## 사이즈 가이드

### 폰트 크기
- `xs`: 12px (기본값, 작은 UI용)
- `sm`: 14px (일반적인 사용)
- `base`: 16px (강조가 필요한 경우)

### 바 높이
- `6px`: 매우 얇은 로딩바
- `8px`: 기본값, 대부분의 경우 적합
- `10px`: 중간 두께
- `12px`: 두꺼운 로딩바

### 바 너비
- `max-w-[200px]`: 좁은 로딩바
- `max-w-xs` (320px): 기본값
- `max-w-sm` (384px): 조금 넓게
- `max-w-md` (448px): 넓게
- `w-full`: 전체 너비

## 문의

더 자세한 정보나 문제가 있는 경우 개발팀에 문의하세요.

