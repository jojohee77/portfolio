# 등록폼 모달 공통 모듈 가이드

## 개요

등록/수정 모달의 일관된 UI/UX를 제공하는 공통 컴포넌트 모듈입니다. 모든 등록폼 모달에서 동일한 스타일과 레이아웃을 사용할 수 있습니다.

## 컴포넌트 구성

### 1. RegisterFormModal (메인 레이아웃)
- 모달의 전체 구조를 담당
- 헤더, 폼 내용, 하단 버튼 영역으로 구성
- **모달 중첩 방지**: 단일 Dialog 컴포넌트 사용

### 2. RegisterFormSection (섹션 구분)
- 폼 내용을 논리적 섹션으로 구분
- 각 섹션별 제목과 구분선 제공

### 3. RegisterFormField (필드 레이아웃)
- 개별 폼 필드의 레이아웃 표준화
- 라벨, 입력 필드, 에러 메시지 통합 관리

## 사용법

### 기본 구조

```tsx
import RegisterFormModal from "@/components/ui/register-form-modal"
import RegisterFormSection from "@/components/ui/register-form-section"
import RegisterFormField, { RegisterFormFieldStart } from "@/components/ui/register-form-field"

export default function MyRegisterModal({ isOpen, onClose, onSubmit }) {
  return (
    <RegisterFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="새 항목 등록"
      submitButtonText="등록"
    >
      <RegisterFormSection title="기본 정보">
        <RegisterFormField label="이름" required>
          <Input value={name} onChange={setName} />
        </RegisterFormField>
        
        <RegisterFormFieldStart label="설명">
          <Textarea value={description} onChange={setDescription} />
        </RegisterFormFieldStart>
      </RegisterFormSection>
    </RegisterFormModal>
  )
}
```

## 컴포넌트 상세

### RegisterFormModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | - | 모달 열림/닫힘 상태 |
| `onClose` | `() => void` | - | 모달 닫기 핸들러 |
| `onSubmit` | `(e: FormEvent) => void` | - | 폼 제출 핸들러 |
| `title` | `string` | - | 모달 제목 |
| `children` | `React.ReactNode` | - | 폼 내용 |
| `submitButtonText` | `string` | `"등록"` | 제출 버튼 텍스트 |
| `submitButtonDisabled` | `boolean` | `false` | 제출 버튼 비활성화 |
| `showCloseButton` | `boolean` | `true` | 닫기 버튼 표시 여부 |
| `maxWidth` | `string` | `"max-w-[95vw] sm:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px]"` | 최대 너비 |
| `className` | `string` | `""` | 추가 CSS 클래스 |

### RegisterFormSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | 섹션 제목 |
| `children` | `React.ReactNode` | - | 섹션 내용 |
| `className` | `string` | `""` | 추가 CSS 클래스 |

### RegisterFormField Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string \| React.ReactNode` | - | 필드 라벨 |
| `required` | `boolean` | `false` | 필수 필드 여부 (빨간 별표 표시) |
| `children` | `React.ReactNode` | - | 입력 필드 |
| `error` | `string` | - | 에러 메시지 |
| `className` | `string` | `""` | 추가 CSS 클래스 |
| `labelClassName` | `string` | `"md:w-32 shrink-0 text-sm text-gray-600"` | 라벨 CSS 클래스 |

## 필드 레이아웃 변형

### RegisterFormFieldStart
- 라벨과 입력 필드가 상단 정렬
- Textarea 등 높이가 있는 필드에 적합

```tsx
<RegisterFormFieldStart label="설명" required>
  <Textarea value={description} onChange={setDescription} />
</RegisterFormFieldStart>
```

### RegisterFormFieldCenter
- 라벨과 입력 필드가 중앙 정렬
- 일반적인 Input 필드에 적합

```tsx
<RegisterFormFieldCenter label="이름" required>
  <Input value={name} onChange={setName} />
</RegisterFormFieldCenter>
```

## 반응형 디자인

### 모바일 (기본)
- 모든 필드가 세로로 배치
- 라벨과 입력 필드가 전체 너비 사용

### 태블릿 이상 (md:)
- 라벨과 입력 필드가 가로로 배치
- 라벨은 고정 너비 (32 = 128px)
- 입력 필드는 남은 공간 사용

## 스타일 가이드

### 색상
- **배경**: `bg-muted/10` (연한 회색)
- **섹션 배경**: `bg-white` (흰색)
- **경계선**: `border-gray-200` (연한 회색)
- **에러**: `text-red-500` (빨간색)

### 간격
- **섹션 간격**: `space-y-6` (24px)
- **필드 간격**: `space-y-4` (16px)
- **모바일 필드 간격**: `space-y-3` (12px)

### 타이포그래피
- **모달 제목**: `text-xl font-bold`
- **섹션 제목**: `text-lg font-semibold`
- **라벨**: `text-sm text-gray-600`
- **에러 메시지**: `text-xs text-red-500`

## 유효성 검사 통합

### 에러 상태 표시
```tsx
const [errors, setErrors] = useState<{[key: string]: string}>({})

<RegisterFormField 
  label="이름" 
  required 
  error={errors.name}
>
  <Input 
    value={name} 
    onChange={setName}
    className={errors.name ? 'border-red-500' : ''}
  />
</RegisterFormField>
```

### 유효성 검사 함수
```tsx
const validateForm = () => {
  const newErrors: {[key: string]: string} = {}
  
  if (!name.trim()) {
    newErrors.name = "이름을 입력해주세요"
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

## 실제 사용 예시

### 포스팅 등록 모달
```tsx
export default function PostingRegisterModal({ isOpen, onClose, onSubmit }) {
  return (
    <RegisterFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="새 포스팅 등록"
      submitButtonText="포스팅 등록"
    >
      {/* 기본 정보 섹션 */}
      <RegisterFormSection title="기본 정보">
        <RegisterFormFieldStart label="계약번호" required error={errors.contractNumber}>
          <Select value={contractNumber} onValueChange={setContractNumber}>
            <SelectTrigger className={errors.contractNumber ? 'border-red-500' : ''}>
              <SelectValue placeholder="계약번호 선택" />
            </SelectTrigger>
            <SelectContent>
              {/* 옵션들 */}
            </SelectContent>
          </Select>
        </RegisterFormFieldStart>
        
        <RegisterFormField label="계약 회사명">
          <Input value={clientName} readOnly className="bg-gray-50" />
        </RegisterFormField>
      </RegisterFormSection>

      {/* 포스팅 정보 섹션 */}
      <RegisterFormSection title="포스팅 정보">
        <RegisterFormField label="포스팅 일자" required error={errors.postingDate}>
          <CustomDatePicker
            selected={postingDate}
            onChange={setPostingDate}
            className={errors.postingDate ? 'border-red-500' : ''}
          />
        </RegisterFormField>
        
        <RegisterFormFieldStart label="제목" required error={errors.title}>
          <Input 
            value={title} 
            onChange={setTitle}
            className={errors.title ? 'border-red-500' : ''}
          />
        </RegisterFormFieldStart>
      </RegisterFormSection>
    </RegisterFormModal>
  )
}
```

## 모달 중첩 방지

### 문제점
- 이전에는 `ModalFormLayout` 내부에서 또 다른 `Dialog`를 사용하여 모달 중첩 발생
- 포털(Portal) 중복으로 인한 렌더링 오류

### 해결책
- `RegisterFormModal`은 단일 `Dialog` 컴포넌트만 사용
- 내부에 추가 모달 컴포넌트 사용 금지
- 모든 폼 로직은 `RegisterFormModal` 내부에서 처리

## 장점

1. **일관성**: 모든 모달이 동일한 스타일과 레이아웃 사용
2. **재사용성**: 공통 컴포넌트로 중복 코드 제거
3. **유지보수성**: 스타일 변경 시 한 곳에서 수정
4. **반응형**: 모바일과 데스크톱에서 최적화된 레이아웃
5. **접근성**: 표준화된 폼 구조로 접근성 향상
6. **모달 중첩 방지**: 단일 Dialog 구조로 안정성 확보

## 주의사항

1. **폼 ID**: `RegisterFormModal`은 자동으로 `register-form` ID를 생성하므로 중복 사용 시 주의
2. **에러 상태**: 유효성 검사 에러는 각 필드별로 관리
3. **반응형**: 라벨 너비는 `md:w-32`로 고정되어 있으므로 긴 라벨은 줄바꿈 고려
4. **스크롤**: 긴 폼의 경우 `overflow-y-auto`로 스크롤 처리
5. **모달 중첩 금지**: `RegisterFormModal` 내부에서 다른 모달 컴포넌트 사용 금지

## 확장 가능성

- **다단계 폼**: StepIndicator와 연동 가능
- **동적 필드**: 조건부 필드 표시/숨김
- **파일 업로드**: FileUpload 컴포넌트 통합
- **날짜 범위**: CustomDatePicker와 연동
- **검색 필드**: Select with search 기능

## 마이그레이션 가이드

### 기존 모달에서 공통 모듈로 변경

1. **Import 변경**:
```tsx
// 기존
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// 변경 후
import RegisterFormModal from "@/components/ui/register-form-modal"
import RegisterFormSection from "@/components/ui/register-form-section"
import RegisterFormField from "@/components/ui/register-form-field"
```

2. **구조 변경**:
```tsx
// 기존
<Dialog open={isOpen} onOpenChange={onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
    </DialogHeader>
    <div className="flex-1 overflow-y-auto">
      <form onSubmit={handleSubmit}>
        {/* 폼 내용 */}
      </form>
    </div>
    <div className="flex justify-end gap-3">
      {/* 버튼들 */}
    </div>
  </DialogContent>
</Dialog>

// 변경 후
<RegisterFormModal
  isOpen={isOpen}
  onClose={onClose}
  onSubmit={handleSubmit}
  title="제목"
>
  <RegisterFormSection title="섹션 제목">
    <RegisterFormField label="필드명" required>
      {/* 입력 필드 */}
    </RegisterFormField>
  </RegisterFormSection>
</RegisterFormModal>
```
