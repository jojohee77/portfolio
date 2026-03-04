# DataTable 컴포넌트 가이드

## 개요
`DataTable`은 데이터 목록을 테이블 형태로 표시하는 통합 컴포넌트입니다. 모바일 카드 뷰와 PC 테이블 뷰를 자동으로 전환하며, 페이지네이션과 정렬 기능을 포함합니다.

## 주요 기능
- 📱 반응형 디자인 (모바일 카드 뷰 + PC 테이블 뷰)
- 📊 유연한 컬럼 정의
- 🔄 페이지네이션 내장
- 📝 정렬 기능
- 🎨 커스터마이징 가능한 렌더링
- 🗂️ 빈 상태 처리
- 🎯 제네릭 타입 지원

## 설치 및 임포트

```tsx
import DataTable, { 
  type Column, 
  type SortOption,
  type DataTableProps 
} from "@/components/ui/data-table"
```

## Props

### 필수 Props

| Prop | 타입 | 설명 |
|------|------|------|
| `data` | `T[]` | 표시할 데이터 배열 |
| `columns` | `Column<T>[]` | 테이블 컬럼 정의 |
| `title` | `string` | 테이블 제목 |
| `totalCount` | `number` | 전체 데이터 개수 |
| `currentPage` | `number` | 현재 페이지 번호 |
| `totalPages` | `number` | 전체 페이지 수 |
| `onPageChange` | `(page: number) => void` | 페이지 변경 핸들러 |
| `renderMobileCard` | `(item: T) => ReactNode` | 모바일 카드 렌더링 함수 |

### 선택적 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `sortValue` | `string` | - | 현재 정렬 값 |
| `onSortChange` | `(value: string) => void` | - | 정렬 변경 핸들러 |
| `sortOptions` | `SortOption[]` | - | 정렬 옵션 목록 |
| `showPagination` | `boolean` | `true` | 페이지네이션 표시 여부 |
| `emptyIcon` | `string` | `"/icons/icon-default.png"` | 빈 상태 아이콘 |
| `emptyTitle` | `string` | `"데이터가 없습니다"` | 빈 상태 제목 |
| `emptyDescription` | `string` | `"해당 페이지에 표시할 정보가 없습니다."` | 빈 상태 설명 |
| `isLoading` | `boolean` | `false` | 로딩 상태 |
| `skeletonRows` | `number` | `5` | 스켈레톤 행 개수 |
| `extraButtons` | `ReactNode` | - | 타이틀 옆 추가 버튼 |
| `className` | `string` | `""` | 추가 CSS 클래스 |

## 타입 정의

### Column<T>

```tsx
interface Column<T> {
  key: string              // 컬럼 키
  label: string            // 컬럼 라벨 (헤더)
  width?: string           // 컬럼 너비 (예: "w-[140px]")
  align?: "left" | "center" | "right"  // 정렬
  render?: (item: T) => ReactNode      // 커스텀 렌더링 함수
}
```

### SortOption

```tsx
interface SortOption {
  value: string   // 정렬 값
  label: string   // 정렬 라벨
}
```

## 사용 예제

### 1. 기본 사용 (계약 목록)

```tsx
"use client"

import { useState } from "react"
import DataTable, { type Column, type SortOption } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Contract {
  id: string
  type: string
  status: string
  statusColor: string
  customer: {
    company: string
    contact: string
  }
  contractAmount: number
  services: string[]
  period: {
    start: string
    end: string
  }
  adCost: {
    total: number
  }
  registrationDate: string
}

export default function ContractListPage() {
  const [contracts, setContracts] = useState<Contract[]>([/* 데이터 */])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortValue, setSortValue] = useState("등록일순")
  const itemsPerPage = 10

  // 컬럼 정의
  const columns: Column<Contract>[] = [
    {
      key: "id",
      label: "계약번호",
      width: "w-[140px]",
      render: (contract) => (
        <div className="text-sm font-semibold text-gray-900">
          {contract.id}
        </div>
      ),
    },
    {
      key: "status",
      label: "계약상태",
      width: "w-[100px]",
      render: (contract) => (
        <Badge className={`text-xs ${contract.statusColor}`}>
          {contract.status}
        </Badge>
      ),
    },
    {
      key: "customer",
      label: "고객정보",
      width: "w-[180px]",
      render: (contract) => (
        <div className="space-y-1">
          <div className="text-sm font-semibold text-gray-900">
            {contract.customer.company}
          </div>
          <div className="text-sm text-gray-500">
            {contract.customer.contact}
          </div>
        </div>
      ),
    },
    {
      key: "period",
      label: "계약기간",
      width: "w-[160px]",
      render: (contract) => (
        <div className="text-sm text-gray-700">
          {contract.period.start.replace(/-/g, '.')} – 
          {contract.period.end.split('-').slice(1).join('.')}
        </div>
      ),
    },
    {
      key: "contractAmount",
      label: "계약금액",
      width: "w-[140px]",
      render: (contract) => (
        <div className="text-sm font-medium text-gray-900">
          ₩{contract.contractAmount.toLocaleString()}
        </div>
      ),
    },
    {
      key: "services",
      label: "서비스유형",
      width: "w-[120px]",
      render: (contract) => (
        <div className="flex flex-wrap gap-1">
          {contract.services.map((service, idx) => (
            <Badge 
              key={idx} 
              variant="secondary" 
              className="text-xs bg-blue-100 text-blue-700 border-0"
            >
              {service}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "adCost",
      label: "총 광고비",
      width: "w-[140px]",
      render: (contract) => (
        <div className="text-sm font-medium text-gray-900">
          ₩{contract.adCost.total.toLocaleString()}
        </div>
      ),
    },
    {
      key: "registrationDate",
      label: "등록일",
      width: "w-[100px]",
      render: (contract) => (
        <div className="text-sm text-gray-500">
          {contract.registrationDate}
        </div>
      ),
    },
    {
      key: "actions",
      label: "작업",
      width: "w-[100px]",
      align: "center",
      render: (contract) => (
        <div className="flex items-center justify-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:bg-gray-100"
          >
            <Eye className="size-[15px]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-blue-500 hover:bg-blue-50"
          >
            <Pencil className="size-[15px]" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-red-500 hover:bg-red-50"
          >
            <Trash2 className="size-[15px]" />
          </Button>
        </div>
      ),
    },
  ]

  // 정렬 옵션
  const sortOptions: SortOption[] = [
    { value: "등록일순", label: "등록일순" },
    { value: "기업명순", label: "기업명순" },
    { value: "계약금액순", label: "계약금액순" },
  ]

  // 모바일 카드 렌더링
  const renderMobileCard = (contract: Contract) => (
    <Card className="shadow-none rounded-xl border border-gray-200">
      <CardContent className="p-4 space-y-4">
        {/* 헤더 */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="space-y-2">
              <div className="text-sm font-semibold text-gray-900">
                {contract.id}
              </div>
              <Badge className={`text-xs ${contract.statusColor}`}>
                {contract.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
            >
              <Eye className="size-[15px]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil className="size-[15px]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="size-[15px]" />
            </Button>
          </div>
        </div>
        
        {/* 고객정보 */}
        <div className="space-y-2">
          <div className="text-xs text-gray-500">고객정보</div>
          <div className="text-sm font-semibold text-gray-900">
            {contract.customer.company}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {contract.customer.contact}
          </div>
        </div>
        
        {/* 계약기간 */}
        <div className="space-y-1 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">계약기간</div>
          <div className="text-sm text-gray-700">
            {contract.period.start.replace(/-/g, '.')} – 
            {contract.period.end.split('-').slice(1).join('.')}
          </div>
        </div>
        
        {/* 금액정보 */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="space-y-1">
            <div className="text-xs text-gray-500">계약금액</div>
            <div className="text-sm font-medium text-gray-900">
              ₩{contract.contractAmount.toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-gray-500">서비스유형</div>
            <div className="flex flex-wrap gap-1">
              {contract.services.map((service, idx) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="text-xs bg-blue-100 text-blue-700 border-0"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // 페이지네이션 계산
  const totalPages = Math.ceil(contracts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = contracts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="p-6">
      <DataTable
        data={paginatedData}
        columns={columns}
        title="계약 목록"
        totalCount={contracts.length}
        sortValue={sortValue}
        onSortChange={setSortValue}
        sortOptions={sortOptions}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        renderMobileCard={renderMobileCard}
      />
    </div>
  )
}
```

### 2. 정렬 없이 사용

```tsx
<DataTable
  data={data}
  columns={columns}
  title="사용자 목록"
  totalCount={data.length}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  renderMobileCard={renderMobileCard}
  // sortOptions를 제공하지 않으면 정렬 드롭다운이 표시되지 않음
/>
```

### 3. 페이지네이션 없이 사용

```tsx
<DataTable
  data={data}
  columns={columns}
  title="최근 활동"
  totalCount={data.length}
  currentPage={1}
  totalPages={1}
  onPageChange={() => {}}
  showPagination={false}
  renderMobileCard={renderMobileCard}
/>
```

### 4. 추가 버튼 포함

```tsx
<DataTable
  data={data}
  columns={columns}
  title="계약 목록"
  totalCount={data.length}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  renderMobileCard={renderMobileCard}
  extraButtons={
    <Button
      variant="outline"
      size="sm"
      onClick={() => console.log("버튼 클릭")}
    >
      엑셀 다운로드
    </Button>
  }
/>
```

### 5. 커스텀 빈 상태

```tsx
<DataTable
  data={[]}
  columns={columns}
  title="계약 목록"
  totalCount={0}
  currentPage={1}
  totalPages={1}
  onPageChange={() => {}}
  renderMobileCard={renderMobileCard}
  emptyIcon="/icons/custom-empty.png"
  emptyTitle="아직 계약이 없습니다"
  emptyDescription="새 계약을 등록하여 시작하세요."
/>
```

### 6. 로딩 상태 (스켈레톤)

```tsx
"use client"

import { useState, useEffect } from "react"
import DataTable from "@/components/ui/data-table"

export default function ContractListPage() {
  const [contracts, setContracts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/contracts')
        const data = await response.json()
        setContracts(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [currentPage])

  return (
    <DataTable
      data={contracts}
      columns={columns}
      title="계약 목록"
      totalCount={contracts.length}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      renderMobileCard={renderMobileCard}
      isLoading={isLoading}          // 로딩 상태
      skeletonRows={10}               // 스켈레톤 행 개수 (기본 5개)
    />
  )
}
```

**스켈레톤 커스터마이징:**

스켈레톤 행 개수를 조정하여 UI를 최적화할 수 있습니다:

```tsx
<DataTable
  // ...
  isLoading={isLoading}
  skeletonRows={3}   // 적은 수의 스켈레톤
/>
```

## 컬럼 정의 팁

### 1. 간단한 텍스트 컬럼

```tsx
{
  key: "name",
  label: "이름",
  // render 함수 없으면 자동으로 item[key] 표시
}
```

### 2. 커스텀 렌더링

```tsx
{
  key: "status",
  label: "상태",
  render: (item) => (
    <Badge className={getStatusColor(item.status)}>
      {item.status}
    </Badge>
  ),
}
```

### 3. 중앙 정렬

```tsx
{
  key: "actions",
  label: "작업",
  align: "center",
  render: (item) => (
    <div className="flex items-center justify-center gap-2">
      <Button>수정</Button>
      <Button>삭제</Button>
    </div>
  ),
}
```

### 4. 고정 너비

```tsx
{
  key: "id",
  label: "ID",
  width: "w-[100px]",  // Tailwind 클래스 사용
}
```

## 모바일 카드 렌더링 가이드

모바일 카드는 자유롭게 디자인할 수 있습니다:

```tsx
const renderMobileCard = (item: DataType) => (
  <Card className="shadow-none rounded-xl border">
    <CardContent className="p-4">
      {/* 원하는 레이아웃 */}
      <div className="space-y-3">
        <div className="font-bold">{item.title}</div>
        <div className="text-sm text-gray-500">{item.description}</div>
        <div className="flex gap-2">
          <Button size="sm">상세</Button>
          <Button size="sm" variant="outline">편집</Button>
        </div>
      </div>
    </CardContent>
  </Card>
)
```

## 반응형 디자인

| 화면 크기 | 레이아웃 |
|-----------|----------|
| 모바일 (< 1024px) | 카드 뷰 (세로 스택) |
| PC (≥ 1024px) | 테이블 뷰 |

## 스켈레톤 로딩 상태

DataTable은 로딩 중일 때 자동으로 스켈레톤 UI를 표시합니다:

### 모바일 스켈레톤
- 카드 형태의 스켈레톤
- 헤더, 본문, 액션 버튼 영역 표시
- 기본 5개 카드

### PC 테이블 스켈레톤
- 테이블 행 형태의 스켈레톤
- 모든 컬럼에 스켈레톤 표시
- 기본 5개 행

### 로딩 흐름
```
1. 데이터 로딩 시작 → isLoading={true}
2. 스켈레톤 UI 표시 (사용자에게 로딩 중임을 알림)
3. 데이터 로딩 완료 → isLoading={false}
4. 실제 데이터 표시
```

## 페이지네이션 동작

- **최대 10개 페이지 번호** 표시
- **이전/다음 버튼** 자동 비활성화
- **페이지 변경 시 자동 스크롤** (상단으로)
- 페이지 번호는 1부터 시작

## 성능 최적화 팁

### 1. 메모이제이션

```tsx
import { useMemo } from "react"

const columns = useMemo<Column<DataType>[]>(() => [
  {
    key: "id",
    label: "ID",
    render: (item) => <div>{item.id}</div>,
  },
  // ...
], [])
```

### 2. 가상 스크롤

데이터가 매우 많은 경우 서버 사이드 페이지네이션을 사용하세요.

```tsx
// 서버에서 페이지별 데이터만 가져오기
const fetchData = async (page: number) => {
  const response = await fetch(`/api/data?page=${page}&limit=10`)
  return response.json()
}
```

## 스타일 커스터마이징

### 테이블 헤더 색상 변경

컴포넌트 내부의 `TableHeader` className을 수정:

```tsx
<TableHeader className="bg-blue-50">  {/* 기본: bg-gray-100 */}
```

### 타이틀 스타일 변경

```tsx
<DataTable
  // ...
  className="custom-table"
/>
```

그리고 CSS에서:

```css
.custom-table h2 {
  color: blue;
  font-size: 1.5rem;
}
```

## 접근성

- ✅ 키보드 탐색 지원
- ✅ 스크린 리더 호환
- ✅ ARIA 속성 적용
- ✅ 명확한 레이블

## 주의사항

### 1. ID 필드 필수

데이터 타입은 반드시 `id` 필드를 포함해야 합니다:

```tsx
interface MyData {
  id: string | number  // 필수!
  // ... 기타 필드
}
```

### 2. 모바일 카드 렌더링 필수

`renderMobileCard` prop은 필수입니다. 생략하면 오류가 발생합니다.

### 3. 컬럼 키 일치

컬럼의 `key`는 데이터 객체의 실제 키와 일치해야 합니다 (render 함수 사용 시 제외).

## 문제 해결

### Q: 페이지네이션이 작동하지 않아요
A: `onPageChange` 핸들러에서 상태를 올바르게 업데이트하고, 데이터를 적절히 슬라이싱했는지 확인하세요.

### Q: 모바일에서 카드가 표시되지 않아요
A: `renderMobileCard` prop을 제공했는지 확인하세요.

### Q: 정렬 드롭다운이 표시되지 않아요
A: `sortOptions`, `sortValue`, `onSortChange`를 모두 제공해야 합니다.

### Q: 빈 상태가 표시되지 않아요
A: `data` 배열이 빈 배열 `[]`인지 확인하세요.

### Q: 스켈레톤이 표시되지 않아요
A: `isLoading={true}`를 설정했는지 확인하세요.

### Q: 스켈레톤이 너무 많이/적게 표시돼요
A: `skeletonRows` prop으로 행 개수를 조정하세요 (기본값: 5).

## 관련 컴포넌트

- `Table`: 기본 테이블 컴포넌트
- `Card`: 모바일 카드 컴포넌트
- `Select`: 정렬 선택 드롭다운
- `Button`: 액션 버튼

## 버전 히스토리

- **v1.0.0** (2025-10-10): 초기 버전 출시
  - 반응형 테이블/카드 뷰
  - 페이지네이션
  - 정렬 기능
  - 제네릭 타입 지원

## 라이선스

이 컴포넌트는 프로젝트 내부에서 자유롭게 사용 및 수정할 수 있습니다.

