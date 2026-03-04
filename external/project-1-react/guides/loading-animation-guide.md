# LoadingAnimation (로티 써클 로딩) 사용 가이드

## 개요

`LoadingAnimation`은 Lottie 애니메이션을 활용한 써클형 로딩 인디케이터 컴포넌트입니다. 데이터 로딩, 파일 업로드, 처리 대기 등 비동기 작업 시 사용자에게 시각적 피드백을 제공합니다.

## 파일 위치

```
components/ui/loading-animation.tsx
```

## 주요 특징

- ✅ Lottie 애니메이션 기반 부드러운 로딩 효과
- ✅ 커스터마이징 가능한 메인 메시지
- ✅ 서브 메시지로 추가 정보 제공
- ✅ 조절 가능한 애니메이션 크기
- ✅ 간단한 사용법
- ✅ 반응형 디자인

## Props

| Props | 타입 | 필수 | 기본값 | 설명 |
|-------|------|------|--------|------|
| `message` | `string` | ❌ | "잠시만 기다려주세요" | 메인 로딩 메시지 |
| `subMessage` | `string` | ❌ | "잠시만 기다려 주세요.\n작업이 완료되면 자동으로 닫힙니다." | 서브 안내 메시지 (빈 문자열로 숨김 가능) |
| `size` | `number` | ❌ | 120 | 로딩 애니메이션 크기 (px 단위) |
| `className` | `string` | ❌ | "" | 추가 CSS 클래스 |

## 기본 사용법

### 1. 컴포넌트 import

```tsx
import LoadingAnimation from "@/components/ui/loading-animation"
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
  <LoadingAnimation />
) : (
  <div>콘텐츠</div>
)}
```

## 사용 예시

### 예시 1: 기본 사용

```tsx
"use client"

import { useState } from "react"
import LoadingAnimation from "@/components/ui/loading-animation"

export default function MyComponent() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div>
      {isLoading ? (
        <LoadingAnimation />
      ) : (
        <div>데이터 표시</div>
      )}
    </div>
  )
}
```

### 예시 2: 커스텀 메시지

```tsx
<LoadingAnimation 
  message="데이터를 가져오는 중입니다"
  subMessage="잠시만 기다려주세요."
/>
```

### 예시 3: 크기 조절

```tsx
// 작은 로딩 (60px)
<LoadingAnimation size={60} />

// 기본 로딩 (120px)
<LoadingAnimation size={120} />

// 큰 로딩 (160px)
<LoadingAnimation size={160} />
```

### 예시 4: 서브 메시지 없이 사용

```tsx
<LoadingAnimation 
  message="처리 중입니다"
  subMessage=""
/>
```

### 예시 5: 여러 옵션 조합

```tsx
<LoadingAnimation
  message="파일을 업로드하는 중입니다"
  subMessage="용량이 큰 파일은 시간이 조금 더 걸릴 수 있습니다."
  size={80}
  className="my-8"
/>
```

## 실전 활용 예시

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
        <LoadingAnimation 
          message="데이터를 불러오는 중입니다"
          size={80}
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
        <LoadingAnimation 
          message="파일을 업로드하는 중입니다"
          subMessage="용량이 큰 파일은 시간이 조금 더 걸릴 수 있습니다.\n잠시만 기다려주세요."
          size={100}
        />
      ) : (
        <input type="file" onChange={(e) => handleUpload(e.target.files?.[0])} />
      )}
    </div>
  )
}
```

### 폼 제출 처리

```tsx
const FormSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      await submitForm(data)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {isSubmitting ? (
        <LoadingAnimation 
          message="정보를 저장하는 중입니다"
          subMessage="완료되면 알려드릴게요!"
          size={70}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          {/* 폼 필드 */}
        </form>
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
      <DialogTitle>데이터 처리</DialogTitle>
    </DialogHeader>
    
    <div className="py-4">
      {isLoading ? (
        <LoadingAnimation 
          message="처리 중입니다"
          subMessage="잠시만 기다려주세요."
          size={80}
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

### 전체 페이지 로딩

```tsx
const PageWithLoading = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await loadInitialData()
      setIsLoading(false)
    }
    init()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingAnimation 
          message="페이지를 준비하는 중입니다"
          subMessage="잠시만 기다려주세요."
          size={120}
        />
      </div>
    )
  }

  return <div>{/* 페이지 컨텐츠 */}</div>
}
```

## 디자인 특징

### 애니메이션

- Lottie 파일 기반의 부드러운 써클 애니메이션
- 자동 재생 및 무한 반복
- 고품질 벡터 애니메이션

### 텍스트 스타일

- **메인 메시지**: 16px, 세미볼드, 진한 회색 (`text-gray-800`)
- **서브 메시지**: 13px, 일반, 연한 회색 (`text-gray-500`)
- **줄 간격**: `leading-snug` (1.375) - 조밀하고 읽기 좋은 간격

### 레이아웃

- 중앙 정렬 디자인
- 적절한 여백과 간격
- 반응형 지원

## 크기 가이드

### 권장 크기

- **60-80px**: 작은 로딩 표시 (모달, 카드 내부)
- **100-120px**: 일반적인 사용 (페이지 섹션)
- **140-160px**: 강조가 필요한 경우 (전체 페이지 로딩)

## 의존성

### 필수 패키지

```json
{
  "@lottiefiles/dotlottie-react": "^0.17.5"
}
```

### Lottie 파일

```
public/icons/Loader-animation.lottie
```

## 주의사항

1. **Lottie 파일 필수**: `/public/icons/Loader-animation.lottie` 파일이 있어야 합니다.

2. **비동기 처리**: 로딩 상태는 반드시 `finally` 블록에서 해제하여 에러 발생 시에도 로딩이 멈추도록 해야 합니다.

3. **메시지 길이**: 서브 메시지가 너무 길면 레이아웃이 깨질 수 있으므로 간결하게 작성하세요.

4. **크기 제한**: 너무 작은 크기(40px 이하)는 애니메이션이 잘 보이지 않을 수 있습니다.

5. **줄바꿈**: 서브 메시지에서 `\n`을 사용하여 줄바꿈할 수 있습니다.

## 접근성

- 시각적 애니메이션과 함께 텍스트 메시지를 제공하여 명확한 피드백 제공
- 스크린 리더가 메시지를 읽을 수 있도록 구조화

## 커스터마이징

더 많은 커스터마이징이 필요한 경우 `components/ui/loading-animation.tsx` 파일을 수정할 수 있습니다:

### Lottie 파일 변경

```tsx
<DotLottieReact
  src="/icons/your-custom-animation.lottie"  // 다른 Lottie 파일 사용
  loop
  autoplay
/>
```

### 텍스트 색상 변경

```tsx
<p className="text-base font-semibold text-blue-800">  // 파란색으로 변경
  {message}
</p>
```

### 애니메이션 속도 조절

```tsx
<DotLottieReact
  src="/icons/Loader-animation.lottie"
  loop
  autoplay
  speed={1.5}  // 1.5배속
/>
```

## Props 타입 정의

```typescript
interface LoadingAnimationProps {
  message?: string          // 메인 메시지
  subMessage?: string       // 서브 메시지 (선택적)
  size?: number            // 애니메이션 크기 (px)
  className?: string       // 추가 클래스
}
```

## LoadingBar vs LoadingAnimation

| 특징 | LoadingBar | LoadingAnimation |
|------|-----------|------------------|
| 타입 | 막대형 | 써클형 |
| 애니메이션 | CSS 애니메이션 | Lottie 애니메이션 |
| 크기 | 가로로 확장 | 정사각형 |
| 용도 | 간단한 로딩 표시 | 강조된 로딩 표시 |
| 파일 크기 | 작음 | 중간 (Lottie 파일 포함) |
| 서브 메시지 | ❌ | ✅ |

## 문의

더 자세한 정보나 문제가 있는 경우 개발팀에 문의하세요.

