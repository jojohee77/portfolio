# LoadingModal 컴포넌트 사용 가이드

## 개요

`LoadingModal`은 사용자에게 로딩 상태를 시각적으로 표시하는 공통 컴포넌트입니다. 데이터 처리, API 호출, 파일 업로드 등 시간이 걸리는 작업 중에 사용자 경험을 향상시키기 위해 사용됩니다.

## 파일 위치

```
components/ui/loading-modal.tsx
```

## 기본 사용법

### 1. 컴포넌트 임포트

```tsx
import { LoadingModal } from "@/components/ui/loading-modal"
```

### 2. 기본 사용 예시

```tsx
import React, { useState } from "react"
import { LoadingModal } from "@/components/ui/loading-modal"
import { Button } from "@/components/ui/button"

export default function MyComponent() {
  const [isLoading, setIsLoading] = useState(false)

  const handleAsyncOperation = async () => {
    setIsLoading(true)
    try {
      // 비동기 작업 수행
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log("작업 완료!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={handleAsyncOperation}>
        데이터 처리 시작
      </Button>
      
      <LoadingModal
        open={isLoading}
        onOpenChange={setIsLoading}
        title="데이터 처리 중..."
        message="잠시만 기다려 주세요."
      />
    </div>
  )
}
```

## Props 설명

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `open` | `boolean` | - | 모달의 열림/닫힘 상태 (필수) |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 모달 상태 변경 콜백 함수 |
| `title` | `string` | `"처리 중..."` | 모달 제목 |
| `message` | `string` | `"잠시만 기다려 주세요."` | 모달 메시지 |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 모달 크기 |
| `showSpinner` | `boolean` | `true` | 스피너 표시 여부 |
| `className` | `string` | `undefined` | 추가 CSS 클래스 |

## 고급 사용법

### 1. 커스텀 훅 사용 (useLoadingModal)

더 편리한 사용을 위해 제공되는 훅을 사용할 수 있습니다:

```tsx
import { useLoadingModal } from "@/components/ui/loading-modal"

export default function MyComponent() {
  const { isOpen, showLoading, hideLoading, LoadingModal } = useLoadingModal()

  const handleAsyncOperation = async () => {
    showLoading()
    try {
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log("작업 완료!")
    } finally {
      hideLoading()
    }
  }

  return (
    <div>
      <Button onClick={handleAsyncOperation}>
        데이터 처리 시작
      </Button>
      
      <LoadingModal
        title="파일 업로드 중..."
        message="파일을 서버에 업로드하고 있습니다."
        size="lg"
      />
    </div>
  )
}
```

### 2. 다양한 크기 설정

```tsx
{/* 작은 모달 */}
<LoadingModal
  open={isLoading}
  size="sm"
  title="저장 중..."
/>

{/* 중간 모달 (기본값) */}
<LoadingModal
  open={isLoading}
  size="md"
  title="데이터 처리 중..."
/>

{/* 큰 모달 */}
<LoadingModal
  open={isLoading}
  size="lg"
  title="대용량 파일 처리 중..."
  message="파일 크기가 큰 경우 시간이 오래 걸릴 수 있습니다."
/>
```

### 3. 스피너 없는 모달

```tsx
<LoadingModal
  open={isLoading}
  showSpinner={false}
  title="준비 중..."
  message="시스템을 초기화하고 있습니다."
/>
```

### 4. 커스텀 스타일링

```tsx
<LoadingModal
  open={isLoading}
  className="bg-blue-50 border-blue-200"
  title="특별한 작업 중..."
  message="이 작업은 특별한 처리가 필요합니다."
/>
```

## 사용 시나리오

### 1. API 호출 시

```tsx
const fetchData = async () => {
  setIsLoading(true)
  try {
    const response = await fetch('/api/data')
    const data = await response.json()
    setData(data)
  } catch (error) {
    console.error('데이터 로딩 실패:', error)
  } finally {
    setIsLoading(false)
  }
}

<LoadingModal
  open={isLoading}
  title="데이터 로딩 중..."
  message="서버에서 최신 데이터를 가져오고 있습니다."
/>
```

### 2. 파일 업로드 시

```tsx
const uploadFile = async (file: File) => {
  setIsUploading(true)
  try {
    const formData = new FormData()
    formData.append('file', file)
    await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
  } finally {
    setIsUploading(false)
  }
}

<LoadingModal
  open={isUploading}
  title="파일 업로드 중..."
  message="파일을 서버에 업로드하고 있습니다. 잠시만 기다려 주세요."
  size="lg"
/>
```

### 3. 폼 제출 시

```tsx
const handleSubmit = async (formData: FormData) => {
  setIsSubmitting(true)
  try {
    await submitForm(formData)
    router.push('/success')
  } catch (error) {
    setError('제출 중 오류가 발생했습니다.')
  } finally {
    setIsSubmitting(false)
  }
}

<LoadingModal
  open={isSubmitting}
  title="제출 중..."
  message="입력하신 정보를 처리하고 있습니다."
/>
```

## 주의사항

1. **접근성**: 로딩 모달은 기본적으로 닫기 버튼이 숨겨져 있습니다. 사용자가 임의로 닫을 수 없도록 설계되었습니다.

2. **타임아웃**: 장시간 로딩이 예상되는 경우, 적절한 타임아웃을 설정하여 무한 로딩을 방지하세요.

3. **에러 처리**: 로딩 중 에러가 발생한 경우 반드시 모달을 닫고 사용자에게 적절한 피드백을 제공하세요.

4. **중첩 방지**: 여러 개의 로딩 모달이 동시에 열리지 않도록 상태 관리에 주의하세요.

## 커스터마이징

필요에 따라 `components/ui/loading-modal.tsx` 파일을 수정하여 프로젝트에 맞는 스타일이나 기능을 추가할 수 있습니다:

- 애니메이션 효과 변경
- 프로그레스 바 추가
- 취소 버튼 옵션 추가
- 다국어 지원

## 예제 코드

전체 예제는 `app/organization/page.tsx` 파일의 임시모달 버튼 구현을 참고하세요.

---

이 가이드를 통해 LoadingModal 컴포넌트를 효과적으로 활용하여 더 나은 사용자 경험을 제공할 수 있습니다.
