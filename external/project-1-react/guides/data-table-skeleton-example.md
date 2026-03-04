# DataTable 스켈레톤 적용 가이드

## 빠른 시작

DataTable 컴포넌트에 스켈레톤을 적용하려면 `isLoading` prop만 추가하면 됩니다.

## 기본 적용 방법

### 1단계: 로딩 상태 추가

```tsx
const [isLoading, setIsLoading] = useState(false)
```

### 2단계: DataTable에 전달

```tsx
<DataTable
  data={data}
  columns={columns}
  title="목록"
  totalCount={data.length}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  renderMobileCard={renderCard}
  isLoading={isLoading}  // ✨ 이것만 추가!
/>
```

### 3단계: 데이터 로딩 시 상태 변경

```tsx
useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)  // 로딩 시작
    try {
      const response = await fetch('/api/data')
      const data = await response.json()
      setData(data)
    } finally {
      setIsLoading(false)  // 로딩 완료
    }
  }

  fetchData()
}, [])
```

## 완전한 예제

```tsx
"use client"

import { useState, useEffect } from "react"
import DataTable, { type Column } from "@/components/ui/data-table"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Contract {
  id: string
  companyName: string
  status: string
  amount: number
}

export default function ContractPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 데이터 로딩
  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoading(true)
      
      try {
        // API 호출 (예: 2초 딜레이)
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const response = await fetch('/api/contracts')
        const data = await response.json()
        setContracts(data)
      } catch (error) {
        console.error('데이터 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContracts()
  }, [currentPage])

  // 컬럼 정의
  const columns: Column<Contract>[] = [
    {
      key: "id",
      label: "계약번호",
      width: "w-[140px]",
    },
    {
      key: "companyName",
      label: "회사명",
      width: "w-[200px]",
    },
    {
      key: "status",
      label: "상태",
      width: "w-[100px]",
      render: (contract) => (
        <Badge>{contract.status}</Badge>
      ),
    },
    {
      key: "amount",
      label: "금액",
      width: "w-[140px]",
      render: (contract) => (
        <div>₩{contract.amount.toLocaleString()}</div>
      ),
    },
  ]

  // 모바일 카드 렌더링
  const renderMobileCard = (contract: Contract) => (
    <Card className="shadow-none rounded-xl border">
      <CardContent className="p-4 space-y-3">
        <div className="font-bold">{contract.id}</div>
        <div className="text-sm">{contract.companyName}</div>
        <Badge>{contract.status}</Badge>
        <div className="text-sm">₩{contract.amount.toLocaleString()}</div>
      </CardContent>
    </Card>
  )

  // 페이지네이션
  const totalPages = Math.ceil(contracts.length / itemsPerPage)
  const paginatedData = contracts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="p-6">
      <DataTable
        data={paginatedData}
        columns={columns}
        title="계약 목록"
        totalCount={contracts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        renderMobileCard={renderMobileCard}
        isLoading={isLoading}        // 🎯 스켈레톤 적용
        skeletonRows={10}             // 스켈레톤 행 개수
      />
    </div>
  )
}
```

## 페이지 변경 시 로딩

페이지 변경 시에도 스켈레톤을 표시할 수 있습니다:

```tsx
const handlePageChange = async (page: number) => {
  setIsLoading(true)
  setCurrentPage(page)
  
  // 데이터 다시 로딩
  try {
    const response = await fetch(`/api/contracts?page=${page}`)
    const data = await response.json()
    setContracts(data)
  } finally {
    setIsLoading(false)
  }
}

<DataTable
  // ...
  onPageChange={handlePageChange}
  isLoading={isLoading}
/>
```

## 검색/필터 적용 시 로딩

검색이나 필터를 적용할 때도 스켈레톤을 사용하세요:

```tsx
const handleSearch = async (searchTerm: string) => {
  setIsLoading(true)
  
  try {
    const response = await fetch(`/api/contracts?search=${searchTerm}`)
    const data = await response.json()
    setContracts(data)
  } finally {
    setIsLoading(false)
  }
}
```

## 스켈레톤 커스터마이징

### 행 개수 조정

```tsx
<DataTable
  isLoading={isLoading}
  skeletonRows={3}   // 적은 수
/>

<DataTable
  isLoading={isLoading}
  skeletonRows={20}  // 많은 수
/>
```

### 조건부 표시

```tsx
// 첫 로딩에만 스켈레톤 표시
const [isFirstLoad, setIsFirstLoad] = useState(true)

<DataTable
  isLoading={isLoading && isFirstLoad}
  // ...
/>
```

## 시각적 효과

스켈레톤이 활성화되면:
- **모바일**: 카드 형태의 애니메이션 스켈레톤
- **PC**: 테이블 행 형태의 애니메이션 스켈레톤
- **애니메이션**: 부드러운 펄스 효과

## 주의사항

1. **로딩 상태 초기화**: 컴포넌트 마운트 시 `isLoading`을 적절히 설정하세요.
2. **finally 블록 사용**: 에러가 발생해도 로딩 상태를 해제하도록 `finally`를 사용하세요.
3. **과도한 사용 피하기**: 빠른 응답에는 스켈레톤이 오히려 방해될 수 있습니다.

## 실전 팁

### Tip 1: 최소 로딩 시간 설정

너무 빨리 사라지는 스켈레톤을 방지:

```tsx
const fetchData = async () => {
  setIsLoading(true)
  
  const [data] = await Promise.all([
    fetch('/api/data').then(r => r.json()),
    new Promise(resolve => setTimeout(resolve, 500))  // 최소 500ms
  ])
  
  setContracts(data)
  setIsLoading(false)
}
```

### Tip 2: 낙관적 UI 업데이트

데이터 추가/수정 시 즉시 UI 업데이트 후 백그라운드에서 동기화:

```tsx
const handleAdd = (newItem: Contract) => {
  // 즉시 UI에 추가
  setContracts(prev => [...prev, newItem])
  
  // 백그라운드에서 서버에 저장
  fetch('/api/contracts', {
    method: 'POST',
    body: JSON.stringify(newItem)
  })
}
```

### Tip 3: 에러 처리

로딩 실패 시 적절한 피드백:

```tsx
const [error, setError] = useState<string | null>(null)

try {
  const data = await fetch('/api/contracts').then(r => r.json())
  setContracts(data)
} catch (err) {
  setError('데이터를 불러올 수 없습니다.')
  showErrorToast('데이터 로딩 실패')
} finally {
  setIsLoading(false)
}
```

## 관련 문서

- [DataTable 컴포넌트 가이드](./data-table-guide.md)
- [Skeleton 컴포넌트](../components/ui/skeleton.tsx)

