# ScrollModal 사용 가이드

## 개요

`ScrollModal`은 긴 콘텐츠를 스크롤하여 볼 수 있는 공통 모달 컴포넌트입니다. 약관 동의, 공지사항, 긴 텍스트 내용 등을 표시할 때 사용됩니다.

## 파일 위치

```
components/scroll-modal.tsx
```

## 주요 특징

- ✅ 반응형 디자인 (모바일/데스크톱 최적화)
- ✅ 스크롤 가능한 콘텐츠 영역
- ✅ 커스터마이징 가능한 제목 및 버튼
- ✅ (필수)/(선택) 텍스트 자동 컬러 처리
- ✅ 문자열 또는 React 컴포넌트 콘텐츠 지원
- ✅ 자동 닫기 버튼 (Dialog 컴포넌트 기반)

## Props

| Props | 타입 | 필수 | 기본값 | 설명 |
|-------|------|------|--------|------|
| `isOpen` | `boolean` | ✅ | - | 모달 열림/닫힘 상태 |
| `onClose` | `() => void` | ✅ | - | 모달 닫기 콜백 함수 |
| `title` | `string` | ✅ | - | 모달 제목 |
| `content` | `string \| React.ReactNode` | ✅ | - | 모달 콘텐츠 |
| `buttonText` | `string` | ❌ | "확인" | 하단 버튼 텍스트 |
| `onConfirm` | `() => void` | ❌ | - | 확인 버튼 클릭 시 추가 콜백 |

## 기본 사용법

### 1. 컴포넌트 import

```tsx
import ScrollModal from "@/components/scroll-modal"
```

### 2. 상태 관리

```tsx
const [modalOpen, setModalOpen] = useState(false)
const [modalContent, setModalContent] = useState({
  title: "",
  content: ""
})
```

### 3. 모달 열기 함수

```tsx
const openModal = (title: string, content: string) => {
  setModalContent({ title, content })
  setModalOpen(true)
}
```

### 4. 컴포넌트 사용

```tsx
<ScrollModal
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  title={modalContent.title}
  content={modalContent.content}
/>
```

## 사용 예시

### 예시 1: 약관 동의 팝업

```tsx
"use client"

import { useState } from "react"
import ScrollModal from "@/components/scroll-modal"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  const [isOpen, setIsOpen] = useState(false)
  
  const termsContent = `제 1조 목적
이 약관은 서비스 이용과 관련된 권리와 의무를 규정합니다.

제 2조 정의
1. "서비스"란 회사가 제공하는 모든 서비스를 의미합니다.
2. "회원"이란 서비스를 이용하는 자를 말합니다.
...`

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>
        이용약관 보기
      </Button>
      
      <ScrollModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="(필수) 이용약관"
        content={termsContent}
        buttonText="확인"
      />
    </div>
  )
}
```

### 예시 2: 공지사항 팝업

```tsx
const NoticeModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        공지사항
      </Button>
      
      <ScrollModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="시스템 점검 안내"
        content="2024년 1월 1일 오전 2시부터 6시까지 시스템 점검이 진행됩니다..."
        buttonText="확인"
      />
    </>
  )
}
```

### 예시 3: HTML/JSX 콘텐츠 사용

```tsx
const DetailModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const htmlContent = (
    <div>
      <h3 className="text-lg font-bold mb-4">상세 내용</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li>항목 1</li>
        <li>항목 2</li>
        <li>항목 3</li>
      </ul>
      <p className="mt-4 text-gray-600">
        추가 설명이 들어갑니다.
      </p>
    </div>
  )
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        상세보기
      </Button>
      
      <ScrollModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="상세 정보"
        content={htmlContent}
        buttonText="닫기"
      />
    </>
  )
}
```

### 예시 4: 확인 콜백 사용

```tsx
const ConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleConfirm = () => {
    console.log("사용자가 확인을 클릭했습니다")
    // 추가 로직 실행
  }
  
  return (
    <ScrollModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="알림"
      content="이 작업을 진행하시겠습니까?"
      buttonText="확인"
      onConfirm={handleConfirm}
    />
  )
}
```

## 디자인 특징

### 반응형 디자인

- **모바일**: 양쪽 1rem 여백, 작은 폰트 크기
- **데스크톱**: 최대 500px 너비, 큰 폰트 크기

### 스타일링

- **헤더**: (필수)/(선택) 텍스트는 primary 컬러, 나머지는 블랙
- **콘텐츠**: 스크롤 가능, 최대 높이 50vh
- **버튼**: Primary 컬러, rounded-xl, 반응형 크기

### 닫기 버튼

ScrollModal은 Dialog 컴포넌트를 기반으로 하여 자동으로 닫기 버튼이 생성됩니다:

- **위치**: 헤더 우측 상단
- **아이콘**: X 아이콘
- **스타일**: Dialog 컴포넌트의 기본 스타일
- **기능**: 모달 닫기 및 onClose 콜백 실행

```tsx
// 닫기 버튼은 자동으로 생성됩니다
<ScrollModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="모달 제목"
  content="모달 내용"
/>
```

### 하단 버튼 고정

ScrollModal의 하단 버튼은 고정되어 스크롤과 관계없이 항상 하단에 표시됩니다:

- **위치**: 모달 하단 고정
- **스타일**: `flex-shrink-0` (크기 고정)
- **배경**: 흰색 배경으로 콘텐츠와 구분
- **스크롤**: 콘텐츠 영역만 스크롤, 버튼은 고정

```tsx
// 하단 버튼 구조 예시
<div className="flex justify-end gap-2 px-6 py-4 border-t flex-shrink-0 bg-white">
  <Button onClick={onClose}>취소</Button>
  <Button onClick={onConfirm}>확인</Button>
</div>
```

### 색상 처리

제목에 "(필수)" 또는 "(선택)"이 포함된 경우 자동으로 해당 부분만 primary 컬러로 표시됩니다.

```tsx
// 자동 색상 처리
<ScrollModal
  title="(필수) 개인정보 수집 및 이용"
  // "(필수)"는 primary 컬러, "개인정보 수집 및 이용"은 블랙
/>
```

## 실전 활용: 약관 관리

여러 약관을 관리하는 경우의 패턴:

```tsx
const SignupPage = () => {
  const [termsDialog, setTermsDialog] = useState({
    isOpen: false,
    title: '',
    content: ''
  })
  
  const termsContent = {
    serviceTerms: {
      title: '(필수) 이용약관',
      content: '이용약관 내용...'
    },
    privacyPolicy: {
      title: '(필수) 개인정보 수집 및 이용',
      content: '개인정보 처리방침...'
    }
  }
  
  const openTermsDialog = (type: keyof typeof termsContent) => {
    setTermsDialog({
      isOpen: true,
      title: termsContent[type].title,
      content: termsContent[type].content
    })
  }
  
  return (
    <div>
      <Button onClick={() => openTermsDialog('serviceTerms')}>
        이용약관 보기
      </Button>
      <Button onClick={() => openTermsDialog('privacyPolicy')}>
        개인정보처리방침 보기
      </Button>
      
      <ScrollModal
        isOpen={termsDialog.isOpen}
        onClose={() => setTermsDialog({...termsDialog, isOpen: false})}
        title={termsDialog.title}
        content={termsDialog.content}
        buttonText="확인"
      />
    </div>
  )
}
```

## 주의사항

1. **콘텐츠 타입**: 문자열은 `<pre>` 태그로, React 노드는 `<div>`로 렌더링됩니다.
2. **긴 콘텐츠**: 콘텐츠가 50vh를 넘으면 자동으로 스크롤이 생성됩니다.
3. **모바일 UX**: 모바일에서도 충분한 여백과 가독성을 제공합니다.
4. **접근성**: 닫기 버튼과 확인 버튼으로 모달을 닫을 수 있습니다.
5. **닫기 버튼**: Dialog 컴포넌트 기반으로 자동 생성되며, 커스터마이징이 제한적입니다.
6. **하단 버튼 고정**: 버튼은 항상 하단에 고정되어 스크롤해도 보입니다.

## 커스터마이징

더 많은 커스터마이징이 필요한 경우 `components/scroll-modal.tsx` 파일을 직접 수정하여 사용할 수 있습니다.

예를 들어:
- 버튼 스타일 변경
- 헤더/푸터 레이아웃 조정
- 애니메이션 추가
- 다중 버튼 지원

## 문의

더 자세한 정보나 문제가 있는 경우 개발팀에 문의하세요.

