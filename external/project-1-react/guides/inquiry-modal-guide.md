# InquiryModal 컴포넌트 가이드

## 개요
`InquiryModal`은 사용자가 1:1 문의를 작성할 수 있는 모달 컴포넌트입니다. 문의 유형, 이메일, 제목, 내용, 파일 첨부 기능을 제공하며, 완전히 커스터마이징 가능합니다.

## 주요 기능
- 📝 완전한 문의 폼 (유형, 이메일, 제목, 내용)
- 📎 파일 첨부 기능 (선택적)
- ✅ 폼 유효성 검사
- 🎨 커스터마이징 가능한 옵션
- 📱 반응형 디자인
- 🔔 성공 토스트 메시지
- ♿ 접근성 지원

## 설치 및 임포트

```tsx
import { InquiryModal, type InquiryFormData } from "@/components/ui/inquiry-modal"
```

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `isOpen` | `boolean` | **필수** | 모달 열림 상태 |
| `onClose` | `() => void` | **필수** | 모달 닫기 핸들러 |
| `onSubmit` | `(data: InquiryFormData) => void` | - | 문의 제출 핸들러 |
| `defaultEmail` | `string` | `""` | 초기 이메일 값 |
| `inquiryTypes` | `InquiryTypeOption[]` | 기본 유형 | 문의 유형 옵션 |
| `title` | `string` | `"1:1 문의하기"` | 모달 제목 |
| `description` | `string` | `"문의 내용을..."` | 모달 설명 |
| `successMessage` | `string` | `"문의하기 등록완료"` | 성공 토스트 메시지 |
| `allowFileUpload` | `boolean` | `true` | 파일 업로드 허용 여부 |
| `fileUploadConfig` | `FileUploadConfig` | 기본 설정 | 파일 업로드 설정 |
| `maxWidth` | `string` | `"max-w-[calc(100%-2rem)] sm:max-w-[512px]"` | 모달 최대 너비 |

## 타입 정의

### InquiryFormData

```tsx
interface InquiryFormData {
  inquiryType: string      // 문의 유형
  email: string            // 이메일
  title: string            // 제목
  content: string          // 내용
  attachedFiles: File[]    // 첨부 파일
}
```

### InquiryTypeOption

```tsx
interface InquiryTypeOption {
  value: string   // 옵션 값
  label: string   // 옵션 라벨
}
```

### FileUploadConfig

```tsx
interface FileUploadConfig {
  accept?: string      // 허용 파일 형식
  maxSizeMB?: number   // 최대 파일 크기 (MB)
  mainText?: string    // 메인 텍스트
  subText?: string     // 서브 텍스트
}
```

## 기본 문의 유형

```tsx
const defaultInquiryTypes = [
  { value: "서비스 이용", label: "서비스 이용" },
  { value: "결제/환불", label: "결제/환불" },
  { value: "기술 지원", label: "기술 지원" },
  { value: "기타", label: "기타" },
]
```

## 사용 예제

### 1. 기본 사용

```tsx
"use client"

import { useState } from "react"
import { InquiryModal } from "@/components/ui/inquiry-modal"
import { Button } from "@/components/ui/button"

export default function MyPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        문의하기
      </Button>

      <InquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
```

### 2. 커스텀 제출 핸들러

```tsx
import { InquiryModal, type InquiryFormData } from "@/components/ui/inquiry-modal"

export default function MyPage() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (data: InquiryFormData) => {
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        console.log('문의가 성공적으로 제출되었습니다')
      }
    } catch (error) {
      console.error('문의 제출 실패:', error)
    }
  }

  return (
    <InquiryModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
    />
  )
}
```

### 3. 초기 이메일 설정

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultEmail="user@example.com"
/>
```

### 4. 커스텀 문의 유형

```tsx
const customInquiryTypes = [
  { value: "제품 문의", label: "제품 문의" },
  { value: "배송 문의", label: "배송 문의" },
  { value: "교환/반품", label: "교환/반품" },
  { value: "기타", label: "기타" },
]

<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  inquiryTypes={customInquiryTypes}
/>
```

### 5. 커스텀 제목과 설명

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="고객 지원 문의"
  description="궁금하신 사항을 남겨주시면 24시간 내에 답변드리겠습니다."
/>
```

### 6. 파일 업로드 비활성화

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  allowFileUpload={false}
/>
```

### 7. 커스텀 파일 업로드 설정

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fileUploadConfig={{
    accept: ".pdf,.doc,.docx",
    maxSizeMB: 5,
    mainText: "문서를 업로드하세요",
    subText: "PDF, DOC 파일만 업로드 가능합니다 (최대 5MB)",
  }}
/>
```

### 8. 커스텀 성공 메시지

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  successMessage="문의가 성공적으로 접수되었습니다!"
/>
```

### 9. 모달 크기 조정

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  maxWidth="max-w-[95vw] sm:max-w-[600px]"
/>
```

## 실제 사용 사례

### 고객 지원 페이지

```tsx
"use client"

import { useState } from "react"
import { InquiryModal, type InquiryFormData } from "@/components/ui/inquiry-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SupportPage() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = async (data: InquiryFormData) => {
    // API 호출
    await fetch('/api/support/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>고객 지원</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">궁금하신 사항이 있으시면 문의해주세요.</p>
          <Button onClick={() => setIsOpen(true)}>
            문의하기
          </Button>
        </CardContent>
      </Card>

      <InquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
        defaultEmail="user@example.com"
      />
    </div>
  )
}
```

### 제품 상세 페이지

```tsx
"use client"

import { useState } from "react"
import { InquiryModal } from "@/components/ui/inquiry-modal"
import { Button } from "@/components/ui/button"

export default function ProductDetail({ product }: { product: Product }) {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)

  const productInquiryTypes = [
    { value: "제품 사양", label: "제품 사양" },
    { value: "재고 문의", label: "재고 문의" },
    { value: "가격 문의", label: "가격 문의" },
    { value: "기타", label: "기타" },
  ]

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      <Button onClick={() => setIsInquiryOpen(true)}>
        제품 문의하기
      </Button>

      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        inquiryTypes={productInquiryTypes}
        title="제품 문의"
        description="제품에 대해 궁금하신 점을 남겨주세요."
      />
    </div>
  )
}
```

### 사용자 인증 후 이메일 자동 입력

```tsx
"use client"

import { useState, useEffect } from "react"
import { InquiryModal } from "@/components/ui/inquiry-modal"
import { useUser } from "@/hooks/use-user"

export default function MyInquiryPage() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()

  return (
    <InquiryModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      defaultEmail={user?.email || ""}
    />
  )
}
```

### 파일 업로드 없이 간단한 문의

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  allowFileUpload={false}
  title="빠른 문의"
  description="간단한 문의사항을 남겨주세요."
  maxWidth="max-w-[90vw] sm:max-w-[400px]"
/>
```

## 폼 유효성 검사

모달은 자동으로 폼 유효성을 검사합니다:

- ✅ 문의 유형 선택 필수
- ✅ 이메일 입력 필수
- ✅ 제목 입력 필수
- ✅ 내용 입력 필수
- ✅ 모든 필수 항목이 입력되어야 제출 버튼 활성화

```tsx
// 내부적으로 다음과 같이 검사됨
const isFormValid = inquiryType && email && title && content
```

## 파일 업로드 설정

### 이미지만 허용

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fileUploadConfig={{
    accept: ".jpg,.jpeg,.png,.gif,.webp",
    maxSizeMB: 10,
    mainText: "이미지를 업로드하세요",
    subText: "JPG, PNG, GIF 파일만 업로드 가능합니다 (최대 10MB)",
  }}
/>
```

### 문서만 허용

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fileUploadConfig={{
    accept: ".pdf,.doc,.docx,.xls,.xlsx",
    maxSizeMB: 20,
    mainText: "문서를 업로드하세요",
    subText: "PDF, Word, Excel 파일 업로드 가능 (최대 20MB)",
  }}
/>
```

### 모든 파일 허용

```tsx
<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  fileUploadConfig={{
    accept: "*",
    maxSizeMB: 50,
    mainText: "파일을 업로드하세요",
    subText: "모든 파일 형식 업로드 가능 (최대 50MB)",
  }}
/>
```

## 스타일 커스터마이징

### 모달 크기 조정

```tsx
// 작은 모달
<InquiryModal maxWidth="max-w-[90vw] sm:max-w-[400px]" />

// 중간 모달 (기본)
<InquiryModal maxWidth="max-w-[calc(100%-2rem)] sm:max-w-[512px]" />

// 큰 모달
<InquiryModal maxWidth="max-w-[95vw] sm:max-w-[700px]" />
```

## 반응형 디자인

컴포넌트는 자동으로 반응형으로 동작합니다:

- **모바일**: 
  - 최대 너비: `calc(100% - 2rem)`
  - 작은 폰트 크기
  - 작은 버튼 높이
  
- **데스크톱**:
  - 최대 너비: 512px (기본)
  - 큰 폰트 크기
  - 큰 버튼 높이

## 접근성

- ✅ 키보드 네비게이션 지원
- ✅ ESC 키로 모달 닫기
- ✅ 포커스 관리
- ✅ ARIA 속성 적용
- ✅ 레이블과 입력 필드 연결
- ✅ 필수 항목 표시 (*)

## 데이터 처리

### 제출 데이터 구조

```tsx
const handleSubmit = (data: InquiryFormData) => {
  console.log(data)
  // {
  //   inquiryType: "서비스 이용",
  //   email: "user@example.com",
  //   title: "문의 제목",
  //   content: "문의 내용...",
  //   attachedFiles: [File, File, ...]
  // }
}
```

### API 전송 예제

```tsx
const handleSubmit = async (data: InquiryFormData) => {
  const formData = new FormData()
  formData.append('inquiryType', data.inquiryType)
  formData.append('email', data.email)
  formData.append('title', data.title)
  formData.append('content', data.content)
  
  data.attachedFiles.forEach((file, index) => {
    formData.append(`file${index}`, file)
  })

  try {
    const response = await fetch('/api/inquiries', {
      method: 'POST',
      body: formData,
    })
    
    if (response.ok) {
      console.log('문의 제출 성공')
    }
  } catch (error) {
    console.error('문의 제출 실패:', error)
  }
}
```

## 주의사항

### 1. Toaster 컴포넌트 필요
성공 토스트 메시지를 표시하려면 `Toaster` 컴포넌트가 필요합니다:

```tsx
import { Toaster } from "@/components/ui/toaster"

export default function Layout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
```

### 2. 파일 크기 제한
큰 파일은 서버 업로드 제한을 초과할 수 있으므로 적절한 크기로 제한하세요:

```tsx
// 권장 크기
- 이미지: 10MB 이하
- 문서: 20MB 이하
- 기타: 50MB 이하
```

### 3. 이메일 유효성 검사
기본적으로 HTML5 이메일 유효성 검사만 수행됩니다. 추가 검사가 필요한 경우 커스텀 핸들러를 구현하세요.

### 4. 폼 초기화
모달이 닫힐 때 자동으로 폼이 초기화됩니다. 이 동작을 변경하려면 컴포넌트를 수정해야 합니다.

## 문제 해결

### Q: 토스트 메시지가 표시되지 않아요
A: `Toaster` 컴포넌트가 렌더링되어 있는지 확인하세요.

### Q: 파일 업로드가 작동하지 않아요
A: `FileUpload` 컴포넌트가 올바르게 설치되어 있는지 확인하세요.

### Q: 모달이 열리지 않아요
A: `isOpen` state가 올바르게 관리되고 있는지 확인하세요.

### Q: 제출 버튼이 비활성화되어 있어요
A: 모든 필수 항목(문의 유형, 이메일, 제목, 내용)이 입력되었는지 확인하세요.

### Q: 커스텀 문의 유형이 표시되지 않아요
A: `inquiryTypes` prop의 형식이 올바른지 확인하세요:
```tsx
[{ value: "값", label: "라벨" }, ...]
```

## 고급 사용법

### 조건부 문의 유형

```tsx
const getInquiryTypes = (userType: string) => {
  if (userType === "premium") {
    return [
      { value: "우선 지원", label: "우선 지원" },
      { value: "기술 지원", label: "기술 지원" },
      { value: "기타", label: "기타" },
    ]
  }
  
  return [
    { value: "일반 문의", label: "일반 문의" },
    { value: "기타", label: "기타" },
  ]
}

<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  inquiryTypes={getInquiryTypes(user.type)}
/>
```

### 제출 전 확인

```tsx
const handleSubmit = (data: InquiryFormData) => {
  if (confirm('문의를 제출하시겠습니까?')) {
    // API 호출
    submitInquiry(data)
  }
}

<InquiryModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
/>
```

### 제출 후 페이지 이동

```tsx
import { useRouter } from "next/navigation"

const router = useRouter()

const handleSubmit = async (data: InquiryFormData) => {
  await submitInquiry(data)
  router.push('/inquiries/success')
}
```

## 관련 컴포넌트

- `Dialog`: 모달 기본 컴포넌트
- `FileUpload`: 파일 업로드 컴포넌트
- `Select`: 선택 박스 컴포넌트
- `Input`: 입력 필드 컴포넌트
- `Textarea`: 텍스트 영역 컴포넌트
- `Button`: 버튼 컴포넌트

## 버전 히스토리

- **v1.0.0** (2025-10-19): 초기 버전 출시
  - 기본 문의 폼 기능
  - 파일 업로드 지원
  - 커스터마이징 옵션
  - 반응형 디자인

## 라이선스

이 컴포넌트는 프로젝트 내부에서 자유롭게 사용 및 수정할 수 있습니다.

