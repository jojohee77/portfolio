# 계약 등록 모달 (Contract Register Modal) 가이드

## 개요
`ContractRegisterModal`은 계약 정보를 단계별로 입력받을 수 있는 공통 모달 컴포넌트입니다. 4단계의 스텝으로 구성되어 있으며, 고객 정보부터 계약 조건, 계약 상품, 첨부 파일까지 체계적으로 관리할 수 있습니다.

## 주요 기능
- ✅ 4단계 스텝 네비게이션
- ✅ 선택형/직접입력형 상품 등록
- ✅ 카카오 주소 API 연동
- ✅ 자동 포맷팅 (전화번호, 금액)
- ✅ 임시저장 / 최종 등록 (등록 모드)
- ✅ **등록 / 수정 모드 지원**
- ✅ 수정 모드: 임시저장 버튼 제거, 취소 버튼 & '수정하기' 버튼으로 표시
- ✅ 반응형 디자인 (모바일/태블릿/데스크톱)

## 설치 및 사용

### 1. 필수 의존성
이 컴포넌트는 다음 컴포넌트들에 의존합니다:
- `@/components/ui/button`
- `@/components/ui/input`
- `@/components/ui/card`
- `@/components/ui/select`
- `@/components/ui/dialog`
- `@/components/ui/label`
- `@/components/ui/textarea`
- `@/components/ui/custom-datepicker`
- `@/components/ui/step-indicator`
- `@/components/ui/step-navigation`
- `@/lib/toast-utils`

### 2. 카카오 주소 API 스크립트 로드
부모 컴포넌트에서 카카오 주소 API 스크립트를 로드해야 합니다:

```tsx
useEffect(() => {
  const script = document.createElement('script')
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
  script.async = true
  document.head.appendChild(script)
  
  return () => {
    const existingScript = document.querySelector('script[src*="postcode.v2.js"]')
    if (existingScript) {
      document.head.removeChild(existingScript)
    }
  }
}, [])
```

### 3. 기본 사용법

```tsx
import ContractRegisterModal from "@/components/contract-register-modal"
import { useState } from "react"

export default function MyPage() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setRegisterDialogOpen(true)}>
        새 계약 등록
      </Button>

      <ContractRegisterModal
        isOpen={registerDialogOpen}
        onClose={() => setRegisterDialogOpen(false)}
      />
    </div>
  )
}
```

### 4. 커스텀 처리가 필요한 경우

`onSubmit` 콜백을 사용하여 등록 데이터를 직접 처리할 수 있습니다:

```tsx
import ContractRegisterModal, { type ContractFormData } from "@/components/contract-register-modal"
import { useState } from "react"

export default function MyPage() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)

  const handleContractSubmit = (data: ContractFormData, type: 'draft' | 'submit') => {
    if (type === 'draft') {
      // 임시저장 로직
      console.log('임시저장:', data)
      // API 호출 등
    } else {
      // 최종 등록 로직
      console.log('최종 등록:', data)
      // API 호출 후 성공 시
      setRegisterDialogOpen(false)
    }
  }

  return (
    <div>
      <Button onClick={() => setRegisterDialogOpen(true)}>
        새 계약 등록
      </Button>

      <ContractRegisterModal
        isOpen={registerDialogOpen}
        onClose={() => setRegisterDialogOpen(false)}
        onSubmit={handleContractSubmit}
        mode="create"
      />
    </div>
  )
}
```

### 5. 수정 모드 사용법

기존 계약을 수정할 때는 `mode="edit"`와 `initialData`를 전달합니다:

```tsx
import ContractRegisterModal, { type ContractFormData } from "@/components/contract-register-modal"
import { useState } from "react"

export default function MyPage() {
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingContract, setEditingContract] = useState(null)

  const handleEditClick = (contract) => {
    // 계약 데이터를 ContractFormData 형식으로 변환
    setEditingContract(contract)
    setEditDialogOpen(true)
  }

  const handleContractEdit = (data: ContractFormData, type: 'draft' | 'submit') => {
    // 수정 모드에서는 'submit'만 호출됨 (임시저장 버튼 없음)
    console.log('수정 완료:', data)
    setEditDialogOpen(false)
    setEditingContract(null)
  }

  return (
    <div>
      <Button onClick={() => handleEditClick(someContract)}>
        계약 수정
      </Button>

      <ContractRegisterModal
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false)
          setEditingContract(null)
        }}
        onSubmit={handleContractEdit}
        mode="edit"
        initialData={editingContract ? {
          companyName: editingContract.customer.company,
          contactPerson: editingContract.customer.contact,
          email: editingContract.customer.email,
          phone: editingContract.customer.phone,
          address: editingContract.customer.address,
          contractType: "monthly",
          contractAmount: `₩${editingContract.contractAmount.toLocaleString()}`,
          totalAdCost: `₩${editingContract.adCost.total.toLocaleString()}`,
          monthlyAdCost: `₩${editingContract.adCost.monthly.toLocaleString()}`,
          postingCount: editingContract.postingCount.toString(),
          startDate: editingContract.period.start,
          endDate: editingContract.period.end,
          // ... 기타 필드
        } : undefined}
        contractId={editingContract?.id}
      />
    </div>
  )
}
```

## Props

### ContractRegisterModalProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | ✅ | - | 모달 열림/닫힘 상태 |
| `onClose` | `() => void` | ✅ | - | 모달 닫기 콜백 |
| `onSubmit` | `(data: ContractFormData, type: 'draft' \| 'submit') => void` | ❌ | undefined | 등록/임시저장/수정 시 호출되는 콜백 |
| `mode` | `'create' \| 'edit'` | ❌ | 'create' | 모달 모드 (등록/수정) |
| `initialData` | `Partial<ContractFormData>` | ❌ | undefined | 수정 모드 시 초기 데이터 |
| `contractId` | `string` | ❌ | undefined | 수정 모드 시 계약 ID |

### ContractFormData

폼 데이터 타입:

```typescript
interface ContractFormData {
  // 고객 정보
  companyName: string          // 회사명
  contactPerson: string        // 계약자명
  email: string                // 이메일
  phone: string                // 전화번호 (자동 포맷: 010-0000-0000)
  region: string               // 지역 (시/도)
  regionDetail: string         // 상세 지역 (시/군/구)
  address: string              // 주소
  detailAddress: string        // 상세 주소
  
  // 계약 조건
  contractType: string         // 계약 유형 (monthly/annual/project)
  contractAmount: string       // 계약 금액 (자동 포맷: ₩1,000,000)
  totalAdCost: string          // 총 광고비
  monthlyAdCost: string        // 월 광고비
  postingCount: string         // 포스팅 건수
  startDate: string            // 계약 시작일 (YYYY-MM-DD)
  endDate: string              // 계약 종료일 (YYYY-MM-DD)
  
  // 계약 상품
  contractProduct: "select" | "manual"  // 상품 유형
  products?: any               // 상품 배열 (선택형 또는 직접입력형)
  
  // 기타
  memo: string                 // 계약 조건 및 특이사항
}
```

## 단계별 구성

### Step 1: 고객 정보
- 회사명 (필수)
- 계약자명 (필수)
- 이메일 (필수)
- 전화번호 (필수, 자동 포맷팅)
- 사업장 주소 (필수, 카카오 주소 API 연동)

### Step 2: 계약 조건 및 내용
- 계약 유형 (필수): 월계약/연계약/프로젝트
- 계약 금액 (필수, 자동 포맷팅)
- 총 광고비 (필수, 자동 포맷팅)
- 월 광고비 (필수, 자동 포맷팅)
- 포스팅 건수 (필수)
- 계약 기간 (필수, 날짜 범위 선택)

### Step 3: 계약상품
두 가지 유형 중 선택:

#### 선택형
- 미리 정의된 상품 목록에서 선택
- 상품 추가/삭제 가능
- 각 상품마다 금액 및 담당자 지정

#### 직접입력형
- 대표상품 정보 입력
- 하위상품 목록 관리
- 각 하위상품마다 팀 및 담당자 지정

### Step 4: 첨부 및 완료
- 계약 조건 및 특이사항 (메모)
- 계약서 파일 업로드 (PDF, DOC, DOCX)
- 업로드 박스에 커스텀 아이콘 표시 (icon-upload.png)

## 등록 모드 vs 수정 모드

### 등록 모드 (mode="create")
- 모달 타이틀: **"계약 등록"**
- 하단 버튼:
  - **임시저장** 버튼: 작성 중인 내용을 임시로 저장
  - **저장하기** 버튼: 최종 등록 (마지막 단계에만 표시)
- 빈 폼으로 시작

### 수정 모드 (mode="edit")
- 모달 타이틀: **"계약 수정"**
- 하단 버튼:
  - ~~임시저장 버튼~~ (표시 안 됨)
  - **취소** 버튼: 수정 취소 및 모달 닫기
  - **수정하기** 버튼: 수정 내용 저장 (마지막 단계에만 표시)
- 기존 데이터로 폼이 채워짐 (initialData)

## 자동 포맷팅

### 전화번호
입력한 숫자가 자동으로 `010-0000-0000` 형식으로 포맷팅됩니다.

```typescript
// 입력: 01012345678
// 결과: 010-1234-5678
```

### 금액
입력한 숫자가 자동으로 천단위 콤마와 원화 기호가 추가됩니다.

```typescript
// 입력: 1000000
// 결과: ₩1,000,000
```

## 커스터마이징

### 1. 상품 옵션 변경

`components/contract-register-modal.tsx` 파일에서 상품 옵션을 수정할 수 있습니다:

```tsx
// 선택형 상품 옵션 (Line ~2237)
<SelectContent>
  <SelectItem value="seo">SEO</SelectItem>
  <SelectItem value="premium">프리미엄</SelectItem>
  <SelectItem value="hanatop">하나탑</SelectItem>
  {/* 여기에 새로운 상품 추가 */}
</SelectContent>
```

### 2. 계약 유형 변경

```tsx
// 계약 유형 옵션 (Line ~676)
<SelectContent>
  <SelectItem value="monthly">월계약</SelectItem>
  <SelectItem value="annual">연계약</SelectItem>
  <SelectItem value="project">프로젝트</SelectItem>
  {/* 여기에 새로운 계약 유형 추가 */}
</SelectContent>
```

### 3. 부서 및 담당자 옵션 변경

```tsx
// 부서 옵션 (Line ~2283)
<SelectContent>
  <SelectItem value="none">미선택</SelectItem>
  <SelectItem value="sales">영업팀</SelectItem>
  <SelectItem value="marketing">마케팅팀</SelectItem>
  <SelectItem value="operation">운영팀</SelectItem>
  <SelectItem value="dev">개발팀</SelectItem>
</SelectContent>

// 담당자 옵션 (Line ~2302)
<SelectContent>
  <SelectItem value="none">미선택</SelectItem>
  <SelectItem value="manager1">김담당</SelectItem>
  <SelectItem value="manager2">이매니저</SelectItem>
  <SelectItem value="manager3">박책임</SelectItem>
</SelectContent>
```

## 스타일링

### 모달 크기 조정
DialogContent의 `max-w-` 클래스를 수정하여 모달 크기를 변경할 수 있습니다:

```tsx
<DialogContent className="max-w-[95vw] sm:max-w-[600px] lg:max-w-[800px] ...">
```

### 스텝 인디케이터 모드
compact 모드를 변경하여 스텝 인디케이터 스타일을 조정할 수 있습니다:

```tsx
<StepIndicator 
  steps={steps}
  currentStep={currentStep}
  onStepClick={handleStepClick}
  compact={false}  // true: 컴팩트 모드, false: 풀 모드
/>
```

## 예제: 실제 프로젝트 적용 (등록 + 수정)

```tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import ContractRegisterModal, { type ContractFormData } from "@/components/contract-register-modal"
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"

export default function ContractPage() {
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingContract, setEditingContract] = useState(null)

  // 카카오 주소 API 로드
  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js'
    script.async = true
    document.head.appendChild(script)
    
    return () => {
      const existingScript = document.querySelector('script[src*="postcode.v2.js"]')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [])

  // 계약 등록 핸들러
  const handleContractSubmit = async (data: ContractFormData, type: 'draft' | 'submit') => {
    try {
      if (type === 'draft') {
        // 임시저장 API 호출
        const response = await fetch('/api/contracts/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        
        if (response.ok) {
          showSuccessToast("임시저장 완료")
        }
      } else {
        // 최종 등록 API 호출
        const response = await fetch('/api/contracts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        
        if (response.ok) {
          showSuccessToast("계약 등록이 완료되었습니다")
          setRegisterDialogOpen(false)
          // 데이터 재조회 등 추가 처리
        }
      }
    } catch (error) {
      showErrorToast("오류가 발생했습니다")
      console.error(error)
    }
  }

  // 계약 수정 핸들러
  const handleContractEdit = async (data: ContractFormData, type: 'draft' | 'submit') => {
    try {
      // 수정 모드에서는 'submit'만 호출됨 (임시저장 버튼 없음)
      const response = await fetch(`/api/contracts/${data.contractId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        showSuccessToast("계약 수정이 완료되었습니다")
        setEditDialogOpen(false)
        setEditingContract(null)
        // 데이터 재조회
      }
    } catch (error) {
      showErrorToast("오류가 발생했습니다")
      console.error(error)
    }
  }

  // 수정 버튼 클릭
  const handleEditClick = (contract) => {
    setEditingContract(contract)
    setEditDialogOpen(true)
  }

  return (
    <div className="p-6">
      <Button onClick={() => setRegisterDialogOpen(true)}>
        새 계약 등록
      </Button>

      {/* 계약 목록 */}
      <div className="mt-6">
        {contracts.map(contract => (
          <div key={contract.id}>
            <span>{contract.name}</span>
            <Button onClick={() => handleEditClick(contract)}>
              수정
            </Button>
          </div>
        ))}
      </div>

      {/* 계약 등록 모달 */}
      <ContractRegisterModal
        isOpen={registerDialogOpen}
        onClose={() => setRegisterDialogOpen(false)}
        onSubmit={handleContractSubmit}
        mode="create"
      />

      {/* 계약 수정 모달 */}
      <ContractRegisterModal
        isOpen={editDialogOpen}
        onClose={() => {
          setEditDialogOpen(false)
          setEditingContract(null)
        }}
        onSubmit={handleContractEdit}
        mode="edit"
        initialData={editingContract ? {
          companyName: editingContract.customer.company,
          contactPerson: editingContract.customer.contact,
          email: editingContract.customer.email,
          phone: editingContract.customer.phone,
          address: editingContract.customer.address,
          contractType: editingContract.type,
          contractAmount: `₩${editingContract.contractAmount.toLocaleString()}`,
          // ... 나머지 필드
        } : undefined}
        contractId={editingContract?.id}
      />
    </div>
  )
}
```

## 주의사항

1. **카카오 주소 API**: 주소 검색 기능을 사용하려면 반드시 카카오 주소 API 스크립트를 로드해야 합니다.

2. **Toast 알림**: 성공/오류 메시지 표시를 위해 `toast-utils`가 필요합니다.

3. **폼 초기화**: 모달이 닫힐 때 자동으로 폼이 초기화됩니다.

4. **데이터 검증**: 현재는 기본적인 required 속성만 있으므로, 필요시 추가적인 검증 로직을 구현해야 합니다.

5. **파일 업로드**: 파일 업로드는 현재 클라이언트 측에서만 처리되므로, 실제 업로드 로직을 별도로 구현해야 합니다.

6. **수정 모드**: 
   - `initialData`는 `Partial<ContractFormData>` 타입이므로 필요한 필드만 전달할 수 있습니다.
   - 금액 필드는 반드시 `₩` 기호와 함께 포맷팅하여 전달해야 합니다 (예: `₩1,000,000`)
   - 날짜 필드는 `YYYY-MM-DD` 형식의 문자열로 전달해야 합니다.
   - `contractId`는 수정 시 서버에 전달되어야 하는 식별자입니다.
   - **임시저장 버튼이 표시되지 않으며**, `onSubmit` 콜백은 항상 `type='submit'`으로만 호출됩니다.
   - 최종 버튼 텍스트는 "수정하기"로 표시됩니다.

## 문제 해결

### 주소 검색이 작동하지 않는 경우
- 카카오 주소 API 스크립트가 로드되었는지 확인
- 브라우저 콘솔에서 오류 메시지 확인

### 포맷팅이 제대로 작동하지 않는 경우
- `handleInputChange` 함수의 조건문 확인
- 입력 필드의 `field` 이름이 올바른지 확인

### 모달이 닫히지 않는 경우
- `onClose` 콜백이 제대로 전달되었는지 확인
- 상위 컴포넌트의 상태 관리 확인

### 수정 모드에서 데이터가 로드되지 않는 경우
- `initialData`가 올바른 형식으로 전달되었는지 확인
- 날짜 필드가 `YYYY-MM-DD` 형식인지 확인
- 금액 필드가 `₩` 기호와 함께 포맷팅되었는지 확인
- 브라우저 콘솔에서 오류 메시지 확인

### 수정 후 데이터가 반영되지 않는 경우
- `onSubmit` 콜백에서 API 호출이 성공했는지 확인
- 성공 후 데이터 재조회 로직이 실행되는지 확인

## 버전 정보
- **버전**: 1.4.0
- **최종 업데이트**: 2025-10-10
- **호환성**: React 18+, Next.js 13+
- **변경사항**: 
  - v1.4.0: 파일 업로드 아이콘을 커스텀 이미지로 변경 (icon-upload.png), 취소 버튼 스타일 임시저장과 동일하게 변경
  - v1.3.0: 수정 모드에 취소 버튼 추가
  - v1.2.0: 수정 모드에서 임시저장 버튼 제거, '수정하기' 버튼으로 변경
  - v1.1.0: 수정 모드 추가 (mode, initialData, contractId props)
  - v1.0.0: 초기 릴리즈

## 라이선스
이 컴포넌트는 프로젝트 내부에서 자유롭게 사용 및 수정할 수 있습니다.

