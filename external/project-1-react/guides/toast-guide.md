# 토스트(Toast) 알림 사용 가이드

프로젝트에서 사용하는 토스트 알림 시스템에 대한 가이드입니다.

## 📋 목차
1. [개요](#개요)
2. [토스트 타입](#토스트-타입)
3. [설치 및 설정](#설치-및-설정)
4. [기본 사용법](#기본-사용법)
5. [공통 유틸리티 함수](#공통-유틸리티-함수)
6. [사용 예시](#사용-예시)
7. [커스터마이징](#커스터마이징)

---

## 개요

토스트는 사용자에게 간단한 피드백을 제공하는 UI 컴포넌트입니다. 
화면 하단 중앙에 3초간 표시되며, 4가지 타입을 지원합니다.

### 특징
- ✅ 화면 하단 중앙 배치
- ✅ 자동 사라짐 (3초)
- ✅ 최상위 z-index (999999)
- ✅ 그레이 배경 (투명도 90%)
- ✅ 4가지 타입 (성공, 오류, 경고, 정보)

---

## 토스트 타입

### 1. 🟢 Success (성공/완료)
**언제 사용?**
- 데이터 저장 완료
- 작업 성공
- 임시저장 완료

**아이콘**: 초록색 원형 + 흰색 체크(✓)
**예시 메시지**: "저장되었습니다", "임시저장 완료"

---

### 2. 🔴 Error (실패/오류)
**언제 사용?**
- 서버 오류
- 유효성 검증 실패
- 네트워크 에러
- 작업 실패

**아이콘**: 빨간색 원형 + 흰색 X
**예시 메시지**: "저장에 실패했습니다. 다시 시도해주세요."

---

### 3. 🟡 Warning (경고/주의)
**언제 사용?**
- 위험 동작 전 경고
- 삭제 전 확인
- 데이터 손실 가능성

**아이콘**: 노란색 솔리드 삼각형 + 검은색 느낌표(!)
**예시 메시지**: "삭제된 데이터는 복구할 수 없습니다."

---

### 4. 🔵 Info (정보/알림)
**언제 사용?**
- 공지사항
- 가이드 안내
- 단순 정보 전달
- 업데이트 알림

**아이콘**: 파란색 원형 + 흰색 i
**예시 메시지**: "새로운 업데이트가 있습니다."

---

## 설치 및 설정

### 1. Layout에 Toaster 추가

`app/layout.tsx`에 Toaster 컴포넌트를 추가해야 합니다.

```tsx
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

### 2. 필요한 파일들

다음 파일들이 프로젝트에 있어야 합니다:

- `components/ui/toast.tsx` - 토스트 컴포넌트
- `components/ui/toaster.tsx` - 토스트 렌더러
- `hooks/use-toast.ts` - 토스트 훅
- `lib/toast-utils.ts` - 공통 유틸리티 함수

---

## 기본 사용법

### 방법 1: useToast 훅 사용

```tsx
import { useToast } from "@/hooks/use-toast"

function MyComponent() {
  const { toast } = useToast()

  const handleSave = () => {
    // 성공 토스트
    toast({
      variant: "success",
      description: "저장되었습니다"
    })
  }

  return <button onClick={handleSave}>저장</button>
}
```

### 방법 2: 공통 유틸리티 함수 사용 (권장 ⭐)

```tsx
import { showSuccessToast } from "@/lib/toast-utils"

function MyComponent() {
  const handleSave = () => {
    showSuccessToast("저장되었습니다")
  }

  return <button onClick={handleSave}>저장</button>
}
```

---

## 공통 유틸리티 함수

`lib/toast-utils.ts`에서 제공하는 함수들:

### showSuccessToast(message)
성공 토스트를 표시합니다.

```tsx
import { showSuccessToast } from "@/lib/toast-utils"

showSuccessToast("저장되었습니다")
showSuccessToast("임시저장 완료")
showSuccessToast("등록이 완료되었습니다")
```

---

### showErrorToast(message)
오류 토스트를 표시합니다.

```tsx
import { showErrorToast } from "@/lib/toast-utils"

showErrorToast("저장에 실패했습니다. 다시 시도해주세요.")
showErrorToast("네트워크 오류가 발생했습니다.")
showErrorToast("필수 항목을 입력해주세요.")
```

---

### showWarningToast(message)
경고 토스트를 표시합니다.

```tsx
import { showWarningToast } from "@/lib/toast-utils"

showWarningToast("삭제된 데이터는 복구할 수 없습니다.")
showWarningToast("변경사항이 저장되지 않았습니다.")
showWarningToast("이 작업은 되돌릴 수 없습니다.")
```

---

### showInfoToast(message)
정보 토스트를 표시합니다.

```tsx
import { showInfoToast } from "@/lib/toast-utils"

showInfoToast("새로운 업데이트가 있습니다.")
showInfoToast("시스템 점검이 예정되어 있습니다.")
showInfoToast("파일 업로드는 최대 10MB까지 가능합니다.")
```

---

## 사용 예시

### 예시 1: 폼 저장

```tsx
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"

function FormComponent() {
  const handleSubmit = async (data) => {
    try {
      await saveData(data)
      showSuccessToast("저장되었습니다")
    } catch (error) {
      showErrorToast("저장에 실패했습니다. 다시 시도해주세요.")
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

---

### 예시 2: 임시저장

```tsx
import { showSuccessToast } from "@/lib/toast-utils"

function RegisterPage() {
  const handleDraftSave = () => {
    // 임시저장 로직
    saveDraft(formData)
    showSuccessToast("임시저장 완료")
  }

  return (
    <Button onClick={handleDraftSave}>
      임시저장
    </Button>
  )
}
```

---

### 예시 3: 데이터 삭제

```tsx
import { showWarningToast, showSuccessToast } from "@/lib/toast-utils"

function DataList() {
  const handleDelete = async (id) => {
    // 경고 표시
    showWarningToast("삭제된 데이터는 복구할 수 없습니다.")
    
    // 사용자 확인 후 삭제
    if (confirm("정말 삭제하시겠습니까?")) {
      await deleteData(id)
      showSuccessToast("삭제되었습니다")
    }
  }

  return <button onClick={handleDelete}>삭제</button>
}
```

---

### 예시 4: API 에러 처리

```tsx
import { showErrorToast } from "@/lib/toast-utils"

async function fetchData() {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error('API Error')
    }
    return await response.json()
  } catch (error) {
    showErrorToast("데이터를 불러오는데 실패했습니다.")
  }
}
```

---

### 예시 5: 유효성 검증

```tsx
import { showWarningToast } from "@/lib/toast-utils"

function validateForm(data) {
  if (!data.email) {
    showWarningToast("이메일을 입력해주세요.")
    return false
  }
  
  if (!data.password) {
    showWarningToast("비밀번호를 입력해주세요.")
    return false
  }
  
  return true
}
```

---

### 예시 6: 파일 업로드

```tsx
import { showSuccessToast, showErrorToast, showInfoToast } from "@/lib/toast-utils"

function FileUpload() {
  const handleUpload = async (file) => {
    // 파일 크기 체크
    if (file.size > 10 * 1024 * 1024) {
      showInfoToast("파일 크기는 10MB를 초과할 수 없습니다.")
      return
    }

    try {
      await uploadFile(file)
      showSuccessToast("파일이 업로드되었습니다.")
    } catch (error) {
      showErrorToast("파일 업로드에 실패했습니다.")
    }
  }

  return <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
}
```

---

## 커스터마이징

### 토스트 표시 시간 변경

`components/ui/use-toast.ts` 또는 `hooks/use-toast.ts` 파일에서:

```ts
const TOAST_REMOVE_DELAY = 3000 // 3초 (기본값)
// 원하는 시간으로 변경 (밀리초 단위)
```

---

### 토스트 위치 변경

`components/ui/toast.tsx`의 `ToastViewport`에서:

```tsx
// 현재: 하단 중앙
className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[999999]"

// 상단 중앙으로 변경
className="fixed top-8 left-1/2 -translate-x-1/2 z-[999999]"

// 우측 상단으로 변경
className="fixed top-8 right-8 z-[999999]"
```

---

### 토스트 배경색 변경

`components/ui/toast.tsx`의 `toastVariants`에서:

```tsx
default: 'border-none bg-[#6B7280]/90 text-white backdrop-blur-sm'
// 원하는 색상으로 변경
```

---

### 새로운 variant 추가

1. `components/ui/toast.tsx`의 variants에 추가:

```tsx
variants: {
  variant: {
    default: '...',
    success: '...',
    error: '...',
    warning: '...',
    info: '...',
    custom: 'border-none bg-purple-500/90 text-white backdrop-blur-sm', // 새로운 variant
  },
}
```

2. `components/ui/toaster.tsx`의 `getIcon`에 추가:

```tsx
case 'custom':
  return (
    <div className="...">
      {/* 커스텀 아이콘 */}
    </div>
  )
```

3. `lib/toast-utils.ts`에 함수 추가:

```tsx
export const showCustomToast = (message: string) => {
  toast({
    variant: "custom",
    description: message,
  })
}
```

---

## 주의사항

### ⚠️ 주의할 점

1. **Layout에 Toaster 추가 필수**
   - `<Toaster />` 컴포넌트가 없으면 토스트가 표시되지 않습니다.

2. **너무 긴 메시지 지양**
   - 토스트는 간단한 피드백용이므로 1-2줄로 제한하세요.
   - 긴 설명이 필요하면 Dialog나 Modal을 사용하세요.

3. **동시에 여러 토스트 표시**
   - 현재는 한 번에 1개만 표시되도록 설정되어 있습니다.
   - `TOAST_LIMIT` 값을 변경하면 동시 표시 개수를 조정할 수 있습니다.

4. **적절한 타입 선택**
   - Success: 성공적인 작업 완료
   - Error: 치명적인 오류, 작업 실패
   - Warning: 주의가 필요한 상황, 확인 필요
   - Info: 단순 정보 전달

---

## 트러블슈팅

### 토스트가 표시되지 않아요
- Layout에 `<Toaster />` 컴포넌트가 추가되어 있는지 확인하세요.
- 브라우저 콘솔에 에러가 없는지 확인하세요.

### 토스트가 너무 빨리 사라져요
- `use-toast.ts`의 `TOAST_REMOVE_DELAY` 값을 증가시키세요.

### 토스트 위치를 변경하고 싶어요
- `toast.tsx`의 `ToastViewport` className을 수정하세요.

### z-index가 다른 요소보다 낮아요
- `ToastViewport`의 z-index를 더 높은 값으로 변경하세요.

---

## 체크리스트

프로젝트에서 토스트를 사용하기 전 확인하세요:

- [ ] `app/layout.tsx`에 `<Toaster />` 추가
- [ ] 필요한 모든 파일이 존재하는지 확인
- [ ] `lib/toast-utils.ts` import 가능한지 확인
- [ ] 테스트 토스트가 정상적으로 표시되는지 확인

---

## 참고 자료

- [Radix UI Toast](https://www.radix-ui.com/docs/primitives/components/toast)
- [Shadcn UI Toast](https://ui.shadcn.com/docs/components/toast)

---

**작성일**: 2024
**버전**: 1.0.0

