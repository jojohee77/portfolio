# StepIndicator 컴포넌트 가이드

## 개요

`StepIndicator`는 다단계 프로세스나 폼에서 현재 진행 상황을 시각적으로 표시하는 컴포넌트입니다. 사용자가 몇 번째 단계에 있는지 명확하게 알 수 있도록 도와줍니다.

## 파일 위치

```
components/ui/step-indicator.tsx
```

## Props 인터페이스

```typescript
export interface Step {
  number: number    // 단계 번호 (1, 2, 3, 4...)
  title: string     // 단계 제목 (예: "고객 정보", "계약 조건")
}

export interface StepIndicatorProps {
  steps: Step[]              // 단계 배열
  currentStep: number        // 현재 진행 중인 단계 번호
  onStepClick?: (step: number) => void  // 단계 클릭 시 호출되는 함수 (선택사항)
  className?: string         // 추가 CSS 클래스 (선택사항)
  compact?: boolean          // 컴팩트 모드 - 모달이나 좁은 공간에서 사용 (선택사항, 기본값: false)
}
```

## 기본 사용법

### 1. 기본 스탭 인디케이터

```tsx
import { StepIndicator, Step } from "@/components/ui/step-indicator"

const steps: Step[] = [
  { number: 1, title: '고객 정보' },
  { number: 2, title: '계약 조건' },
  { number: 3, title: '계약상품' },
  { number: 4, title: '첨부 및 완료' },
]

function MyComponent() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <StepIndicator 
      steps={steps}
      currentStep={currentStep}
    />
  )
}
```

### 2. 클릭 가능한 스탭 인디케이터

```tsx
function MyComponent() {
  const [currentStep, setCurrentStep] = useState(1)

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
    // 추가 로직 (예: 스크롤 이동, 데이터 검증 등)
  }

  return (
    <StepIndicator 
      steps={steps}
      currentStep={currentStep}
      onStepClick={handleStepClick}
    />
  )
}
```

### 3. 컴팩트 모드 (모달, 좁은 공간용)

모달이나 좁은 공간에서 사용할 때는 `compact` prop을 `true`로 설정하세요.

```tsx
// 모달 안에서 사용
<Dialog>
  <DialogContent className="max-w-7xl">
    <StepIndicator 
      steps={steps}
      currentStep={currentStep}
      onStepClick={handleStepClick}
      compact={true}  // 컴팩트 모드 활성화
    />
    {/* 폼 내용 */}
  </DialogContent>
</Dialog>
```

**컴팩트 모드 특징:**
- 더 작은 버튼 크기 (7-8px)
- 짧은 연결선 (3-6px)
- 작은 텍스트 (9-12px)
- 줄어든 여백 (p-2.5)
- 실선 구분선 (점선 제거)

### 4. 커스텀 스타일링

```tsx
<StepIndicator 
  steps={steps}
  currentStep={currentStep}
  className="mb-8 shadow-lg"
/>
```

## 스타일 및 디자인

### 시각적 상태

- **현재 단계**: 파란색 원형 버튼, 흰색 숫자, 파란색 제목, 링 효과
- **완료된 단계**: 파란색 원형 버튼, 흰색 체크 아이콘, 파란색 제목
- **미완료 단계**: 흰색 원형 버튼, 회색 숫자, 회색 제목

### 구분선 상태

- **완료된 구분선**: 실선 파란색
- **현재 단계 구분선**: 실선 파란색
- **미완료 구분선**: 점선 회색

### 레이아웃

- **컨테이너**: 그라디언트 배경, 둥근 모서리, 보더
- **정렬**: 중앙 정렬
- **간격**: 각 스탭 간 32px 마진, 구분선 길이 96px
- **반응형**: 모바일과 데스크톱에서 모두 적절하게 표시

## 실제 사용 예시

### 1. 일반 페이지에서의 사용 (기본 모드)

```tsx
// app/register/page.tsx
import { StepIndicator, Step } from "@/components/ui/step-indicator"

export default function ContractRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  
  const steps: Step[] = [
    { number: 1, title: '고객 정보' },
    { number: 2, title: '계약 조건' },
    { number: 3, title: '계약상품' },
    { number: 4, title: '첨부 및 완료' },
  ]

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* 헤더 */}
      <div>
        <h1>계약 등록</h1>
        <p>새로운 계약을 등록하세요.</p>
      </div>

      {/* 스텝 인디케이터 - 기본 모드 */}
      <StepIndicator 
        steps={steps}
        currentStep={currentStep}
        onStepClick={handleStepClick}
      />

      {/* 단계별 컨텐츠 */}
      {currentStep === 1 && <CustomerInfoStep />}
      {currentStep === 2 && <ContractConditionsStep />}
      {currentStep === 3 && <ProductSelectionStep />}
      {currentStep === 4 && <AttachmentStep />}
    </div>
  )
}
```

### 2. 모달에서의 사용 (컴팩트 모드)

```tsx
// app/contract/page.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { StepIndicator, Step } from "@/components/ui/step-indicator"
import { useState } from "react"

export default function ContractPage() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  const steps: Step[] = [
    { number: 1, title: '고객 정보' },
    { number: 2, title: '계약 조건' },
    { number: 3, title: '계약상품' },
    { number: 4, title: '첨부 및 완료' },
  ]

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }

  return (
    <div>
      {/* 등록 버튼 */}
      <Button onClick={() => setRegisterDialogOpen(true)}>
        새 계약 등록
      </Button>

      {/* 등록 모달 */}
      <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh]">
          <DialogHeader>
            <DialogTitle>계약 등록</DialogTitle>
          </DialogHeader>
          
          <div className="overflow-y-auto px-6 py-6">
            {/* 스텝 인디케이터 - 컴팩트 모드 */}
            <StepIndicator 
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              compact={true}  // 모달에서는 컴팩트 모드 사용
            />

            {/* 단계별 컨텐츠 */}
            {currentStep === 1 && <CustomerInfoStep />}
            {currentStep === 2 && <ContractConditionsStep />}
            {currentStep === 3 && <ProductSelectionStep />}
            {currentStep === 4 && <AttachmentStep />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
```

## 주의사항

### 1. 단계 번호

- 단계 번호는 1부터 시작해야 합니다
- 연속된 숫자를 사용하는 것을 권장합니다
- 최대 6-7단계까지 권장 (UI상 너무 많으면 복잡해짐)

### 2. 제목 길이

- 각 단계 제목은 2-6글자 정도가 적절합니다
- 너무 긴 제목은 레이아웃을 깨뜨릴 수 있습니다
- 예: "고객 정보", "계약 조건", "첨부 및 완료"

### 3. 컴팩트 모드 사용

- **모달**: 모달 안에서 사용할 때는 항상 `compact={true}` 사용 권장
- **사이드바**: 좁은 사이드바나 드로어에서도 컴팩트 모드 사용
- **모바일 우선**: 작은 화면에서는 컴팩트 모드가 더 적합
- **일반 페이지**: 충분한 공간이 있는 일반 페이지에서는 기본 모드 사용

### 4. 접근성

- 스크린 리더 사용자를 위해 적절한 aria-label 추가를 고려하세요
- 키보드 네비게이션 지원 (Tab 키로 이동 가능)

## 커스터마이징

### 색상 변경

컴포넌트 내부의 CSS 클래스를 수정하여 색상을 변경할 수 있습니다:

```tsx
// 현재 단계 색상
'bg-blue-600 text-white border-blue-400'

// 완료된 단계 색상  
'bg-blue-600 text-white border-blue-400'

// 미완료 단계 색상
'bg-white text-gray-400 border-gray-300'
```

### 크기 조정

**기본 모드:**
```tsx
// 원형 버튼 크기
'w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10'

// 구분선 길이
'w-4 sm:w-4 md:w-6 lg:w-8 xl:w-24'

// 스탭 너비
'w-16 md:w-18 lg:w-20 xl:w-24'

// 텍스트 크기
'text-[10px] sm:text-xs md:text-sm'
```

**컴팩트 모드:**
```tsx
// 원형 버튼 크기
'w-7 h-7 sm:w-8 sm:h-8'  // 더 작게

// 구분선 길이
'w-3 sm:w-4 md:w-6'  // 더 짧게

// 스탭 너비
'w-12 sm:w-14 md:w-16'  // 더 좁게

// 텍스트 크기
'text-[9px] sm:text-[10px] md:text-xs'  // 더 작게

// 구분선 두께
'h-[2px]'  // 약간 두껍게 (기본 모드는 h-[1px])
```

## 트러블슈팅

### Q: 스탭이 클릭되지 않아요
A: `onStepClick` prop이 올바르게 전달되었는지 확인하세요.

### Q: 스탭 제목이 잘려 보여요
A: 제목이 너무 긴 경우 줄바꿈이 발생할 수 있습니다. 제목을 줄이거나 컨테이너 너비를 조정하세요.

### Q: 구분선이 보이지 않아요
A: 스탭이 2개 이상인지 확인하세요. 구분선은 스탭 간에만 표시됩니다.

### Q: 모달에서 스텝이 너무 커 보여요
A: `compact={true}` prop을 추가하세요. 모달이나 좁은 공간에서는 컴팩트 모드 사용을 권장합니다.

### Q: 일반 페이지에서 스텝이 너무 작아요
A: `compact` prop을 제거하거나 `compact={false}`로 설정하세요. 기본 모드가 일반 페이지에 적합합니다.

## 모드 비교표

| 항목 | 기본 모드 | 컴팩트 모드 |
|------|----------|------------|
| 사용처 | 일반 페이지, 넓은 공간 | 모달, 좁은 공간 |
| 버튼 크기 | 28-40px | 28-32px |
| 구분선 길이 | 16-96px | 12-24px |
| 텍스트 크기 | 10-14px | 9-12px |
| 패딩 | p-3 md:p-4 | p-2.5 sm:p-3 |
| 구분선 스타일 | 점선/실선 혼합 | 실선만 |
| 라운드 | rounded-xl | rounded-lg |

## 업데이트 이력

- **v1.1.0** (2025-01-XX): 컴팩트 모드 추가
  - `compact` prop 추가
  - 모달 및 좁은 공간용 스타일
  - 가이드 문서 업데이트
  
- **v1.0.0** (2024-01-XX): 초기 버전 생성
  - 기본 스탭 인디케이터 기능
  - 클릭 가능한 스탭
  - 반응형 디자인
  - 완료 상태 시각화
