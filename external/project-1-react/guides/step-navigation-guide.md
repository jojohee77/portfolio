# StepNavigation 컴포넌트 가이드

## 개요

`StepNavigation`은 다단계 폼이나 프로세스에서 하단에 고정되는 네비게이션 버튼 영역을 제공하는 컴포넌트입니다. 이전/다음/임시저장/저장하기 버튼을 통합 관리합니다.

## 파일 위치

```
components/ui/step-navigation.tsx
```

## Props 인터페이스

```typescript
export interface StepNavigationProps {
  currentStep: number          // 현재 단계 번호 (필수)
  totalSteps: number           // 전체 단계 수 (필수)
  onPrev?: () => void          // 이전 버튼 클릭 핸들러 (선택)
  onNext?: () => void          // 다음 버튼 클릭 핸들러 (선택)
  onDraft?: () => void         // 임시저장 버튼 클릭 핸들러 (선택)
  onSubmit?: () => void        // 저장하기 버튼 클릭 핸들러 (선택)
  onCancel?: () => void        // 취소 버튼 클릭 핸들러 (선택)
  showPrev?: boolean           // 이전 버튼 표시 여부 (기본: currentStep > 1)
  showDraft?: boolean          // 임시저장 버튼 표시 여부 (기본: true)
  showCancel?: boolean         // 취소 버튼 표시 여부 (기본: false)
  prevLabel?: string           // 이전 버튼 텍스트 (기본: "이전")
  nextLabel?: string           // 다음 버튼 텍스트 (기본: "다음")
  draftLabel?: string          // 임시저장 버튼 텍스트 (기본: "임시저장")
  submitLabel?: string         // 제출 버튼 텍스트 (기본: "저장하기")
  cancelLabel?: string         // 취소 버튼 텍스트 (기본: "취소")
  className?: string           // 추가 CSS 클래스 (선택)
}
```

## 기본 사용법

### 1. 기본 스텝 네비게이션

```tsx
import { StepNavigation } from "@/components/ui/step-navigation"

function MyForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleDraft = () => {
    console.log('임시저장')
    // 임시저장 로직
  }

  const handleSubmit = () => {
    console.log('최종 제출')
    // 제출 로직
  }

  return (
    <div>
      {/* 폼 내용 */}
      
      {/* 하단 네비게이션 */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrev={handlePrev}
        onNext={handleNext}
        onDraft={handleDraft}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
```

### 2. 임시저장 없는 버전

```tsx
<StepNavigation
  currentStep={currentStep}
  totalSteps={totalSteps}
  onPrev={handlePrev}
  onNext={handleNext}
  onSubmit={handleSubmit}
  showDraft={false}  // 임시저장 버튼 숨김
/>
```

### 3. 커스텀 라벨

```tsx
<StepNavigation
  currentStep={currentStep}
  totalSteps={totalSteps}
  onPrev={handlePrev}
  onNext={handleNext}
  onDraft={handleDraft}
  onSubmit={handleSubmit}
  prevLabel="뒤로"
  nextLabel="계속"
  draftLabel="나중에 하기"
  submitLabel="완료"
/>
```

### 4. 모달에서 사용

```tsx
<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
  <DialogContent className="max-w-7xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
    <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 bg-white z-10">
      <DialogTitle>계약 등록</DialogTitle>
    </DialogHeader>
    
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {/* 폼 내용 */}
      {currentStep === 1 && <Step1Content />}
      {currentStep === 2 && <Step2Content />}
      {currentStep === 3 && <Step3Content />}
      {currentStep === 4 && <Step4Content />}
    </div>

    {/* 하단 네비게이션 - 모달 하단에 고정 */}
    <StepNavigation
      currentStep={currentStep}
      totalSteps={4}
      onPrev={handlePrev}
      onNext={handleNext}
      onDraft={handleDraft}
      onSubmit={handleSubmit}
    />
  </DialogContent>
</Dialog>
```

## 버튼 동작 방식

### 1. 첫 번째 단계 (currentStep === 1)
- **표시**: [단계 표시] [임시저장] [다음]
- 이전 버튼은 자동으로 숨김

### 2. 중간 단계 (1 < currentStep < totalSteps)
- **표시**: [단계 표시] [이전] [임시저장] [다음]
- 모든 버튼 표시

### 3. 마지막 단계 (currentStep === totalSteps)
- **표시**: [단계 표시] [이전] [임시저장] [저장하기]
- 다음 버튼이 저장하기 버튼으로 변경
- 저장하기 버튼에 체크 아이콘 표시

### 4. 취소 버튼 표시 (showCancel=true)
- **표시**: [단계 표시] [이전] [취소] [다음/저장하기]
- 임시저장 버튼 대신 취소 버튼 표시
- 주로 수정 모드에서 사용
- 취소 버튼은 임시저장 버튼과 동일한 스타일 (회색 배경)

## 스타일 및 디자인

### 버튼 스타일

#### 이전 버튼
- 스타일: `outline` variant
- 색상: 회색 테두리, 회색 텍스트
- 아이콘: 왼쪽 화살표
- 반응형: 모바일에서는 아이콘만, 데스크톱에서는 텍스트 포함

#### 다음 버튼
- 스타일: `solid` variant
- 색상: 파란색 배경, 흰색 텍스트
- 아이콘: 오른쪽 화살표
- 위치: 텍스트 오른쪽

#### 임시저장 버튼
- 스타일: 회색 배경
- 색상: 회색 배경, 진한 회색 텍스트
- 아이콘: 없음

#### 취소 버튼
- 스타일: 회색 배경 (임시저장 버튼과 동일)
- 색상: 회색 배경, 진한 회색 텍스트
- 아이콘: 없음
- 표시 조건: `showCancel={true}`일 때만 표시

#### 저장하기 버튼 (마지막 단계)
- 스타일: `primary` variant
- 색상: Primary 색상, 흰색 텍스트
- 아이콘: 체크 아이콘 (왼쪽)
- 크기: 다른 버튼보다 약간 넓음

### 레이아웃
- **고정 위치**: 하단에 고정 (`flex-shrink-0`)
- **배경**: 흰색 배경 + 상단 그림자
- **정렬**: 좌우 정렬 (단계/이전 왼쪽, 임시저장/다음 오른쪽)
- **간격**: 버튼 간 8-12px 간격
- **z-index**: `z-10` (다른 요소 위에 표시)

## 실제 사용 예시

### 1. 계약 등록 페이지

```tsx
// app/register/page.tsx
import { useState } from "react"
import { StepNavigation } from "@/components/ui/step-navigation"
import { showSuccessToast } from "@/lib/toast-utils"

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleDraft = () => {
    // 임시저장 로직
    const draftData = {
      step: currentStep,
      data: formData
    }
    localStorage.setItem('draft', JSON.stringify(draftData))
    showSuccessToast("임시저장 완료")
  }

  const handleSubmit = () => {
    // 최종 제출 로직
    console.log('제출:', formData)
    showSuccessToast("등록이 완료되었습니다")
    router.push('/contract')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">
        {/* 스텝 인디케이터 */}
        {/* 폼 내용 */}
        {currentStep === 1 && <CustomerInfo />}
        {currentStep === 2 && <ContractTerms />}
        {currentStep === 3 && <Products />}
        {currentStep === 4 && <Attachments />}
      </main>

      {/* 하단 네비게이션 - 페이지 하단 고정 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white">
        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
          onDraft={handleDraft}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
```

### 2. 모달 내 등록 폼

```tsx
// app/contract/page.tsx
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { StepNavigation } from "@/components/ui/step-navigation"

export default function ContractPage() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleSubmit = () => {
    // 제출 로직
    showSuccessToast("계약 등록이 완료되었습니다")
    setRegisterDialogOpen(false)
    // 폼 초기화
    setCurrentStep(1)
  }

  return (
    <div>
      <Button onClick={() => setRegisterDialogOpen(true)}>
        새 계약 등록
      </Button>

      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle>계약 등록</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {/* 폼 내용 */}
          </div>

          {/* 하단 네비게이션 */}
          <StepNavigation
            currentStep={currentStep}
            totalSteps={4}
            onPrev={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            onNext={() => setCurrentStep(prev => Math.min(4, prev + 1))}
            onDraft={handleDraft}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

### 3. 수정 모드 (취소 버튼 포함)

```tsx
// 수정 모드에서 취소 버튼 사용
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { StepNavigation } from "@/components/ui/step-navigation"

export default function EditContractModal({ isOpen, onClose, contract }) {
  const [currentStep, setCurrentStep] = useState(1)

  const handleCancel = () => {
    // 취소 확인 없이 바로 닫기
    onClose()
  }

  const handleSubmit = () => {
    // 수정 로직
    showSuccessToast("계약 수정이 완료되었습니다")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>계약 수정</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {/* 폼 내용 */}
        </div>

        {/* 하단 네비게이션 - 취소 버튼 포함 */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={4}
          onPrev={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          onNext={() => setCurrentStep(prev => Math.min(4, prev + 1))}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          showDraft={false}      // 임시저장 버튼 숨김
          showCancel={true}      // 취소 버튼 표시
          submitLabel="수정하기"  // 버튼 텍스트 변경
        />
      </DialogContent>
    </Dialog>
  )
}
```

## 주의사항

### 1. 핸들러 함수

- 필요한 핸들러만 전달하세요
- `onSubmit`은 마지막 단계에서만 작동합니다
- `onNext`는 마지막 단계가 아닐 때만 작동합니다
- 핸들러를 전달하지 않으면 해당 버튼이 표시되지 않습니다

### 2. 레이아웃

- 일반 페이지에서 사용 시 `fixed bottom-0`로 고정하세요
- 모달에서 사용 시 `DialogContent`의 자식으로 배치하세요
- 상위 컨테이너가 `flex flex-col` 구조여야 올바르게 하단에 고정됩니다

### 3. 반응형

- 모바일에서는 버튼 텍스트가 일부 숨겨질 수 있습니다
- 이전 버튼은 모바일에서 아이콘만 표시됩니다
- 버튼 크기가 자동으로 조정됩니다

### 4. 접근성

- 모든 버튼은 키보드로 접근 가능합니다
- Tab 키로 순차적으로 이동할 수 있습니다
- Enter 또는 Space 키로 실행 가능합니다

## 커스터마이징

### 배경색 변경

```tsx
<StepNavigation
  currentStep={currentStep}
  totalSteps={totalSteps}
  onPrev={handlePrev}
  onNext={handleNext}
  className="bg-gray-50"  // 배경색 변경
/>
```

### 버튼 크기 조정

컴포넌트 내부 코드를 수정하여 버튼 크기를 조정할 수 있습니다:

```tsx
// 작은 버튼
className="px-2 md:px-4 py-1 md:py-2 h-8 md:h-10"

// 큰 버튼
className="px-4 md:px-8 py-3 md:py-4 h-12 md:h-14"
```

### 그림자 제거

```tsx
<StepNavigation
  currentStep={currentStep}
  totalSteps={totalSteps}
  onPrev={handlePrev}
  onNext={handleNext}
  className="shadow-none"  // 그림자 제거
/>
```

## 트러블슈팅

### Q: 버튼이 작동하지 않아요
A: 핸들러 함수(`onPrev`, `onNext`, `onDraft`, `onSubmit`)가 올바르게 전달되었는지 확인하세요.

### Q: 이전 버튼이 표시되지 않아요
A: `currentStep`이 1보다 큰지 확인하세요. 또는 `showPrev={true}`를 명시적으로 설정하세요.

### Q: 저장하기 버튼이 표시되지 않아요
A: `currentStep === totalSteps`인지 확인하고, `onSubmit` 핸들러가 전달되었는지 확인하세요.

### Q: 모달에서 네비게이션이 모달 밖으로 나가요
A: `DialogContent`에 `overflow-hidden` 클래스를 추가하고, `flex flex-col` 구조를 사용하세요.

### Q: 모바일에서 버튼이 잘려 보여요
A: 반응형 클래스가 올바르게 적용되었는지 확인하세요. 필요시 `className`으로 추가 스타일을 지정하세요.

## 관련 컴포넌트

- **StepIndicator**: 상단에 표시되는 진행 단계 인디케이터
- **Button**: 기본 버튼 컴포넌트

## 조합 사용 예시

```tsx
<div className="min-h-screen flex flex-col">
  {/* 상단 스텝 인디케이터 */}
  <StepIndicator 
    steps={steps}
    currentStep={currentStep}
  />

  {/* 메인 컨텐츠 */}
  <main className="flex-1">
    {/* 폼 내용 */}
  </main>

  {/* 하단 네비게이션 */}
  <StepNavigation
    currentStep={currentStep}
    totalSteps={totalSteps}
    onPrev={handlePrev}
    onNext={handleNext}
    onDraft={handleDraft}
    onSubmit={handleSubmit}
  />
</div>
```

## 업데이트 이력

- **v1.0.0** (2025-01-XX): 초기 버전 생성
  - 기본 스텝 네비게이션 기능
  - 이전/다음/임시저장/저장하기 버튼
  - 반응형 디자인
  - 하단 고정 레이아웃
  - 모달 지원

