# CardStatusSummary 컴포넌트 사용 가이드

## 📋 개요

`CardStatusSummary`는 상태별 요약 카드를 표시하는 공통 컴포넌트입니다. 모바일과 데스크톱에서 각각 최적화된 레이아웃으로 표시됩니다.

## 🎯 주요 기능

- **반응형 디자인**: 모바일(컴팩트 리스트) / 데스크톱(그리드 카드)
- **상태별 컬러**: 각 상태에 맞는 배지 컬러 자동 적용
- **트렌드 데이터**: 상태별 상승/하강/유지 표시
- **클릭 이벤트**: 필터 변경 기능
- **커스터마이징**: 다양한 옵션 제공

## 📦 설치 및 Import

```tsx
import StatusSummaryCards from "@/components/ui/card-status-summary"
```

## 🔧 기본 사용법

### 1. 기본 구현 (부가 설명 없는 버전)

```tsx
import React, { useState } from "react"
import StatusSummaryCards from "@/components/ui/card-status-summary"

const MyComponent = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  
  // 상태별 카운트 데이터
  const statusCounts = {
    전체: 8,
    진행중: 4,
    완료: 2,
    대기: 1,
    보류: 1
  }

  return (
    <StatusSummaryCards
      statusCounts={statusCounts}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    />
  )
}
```

### 2. 부가 설명이 있는 버전

```tsx
import React, { useState } from "react"
import StatusSummaryCards from "@/components/ui/card-status-summary"

const MyComponent = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  
  // 상태별 카운트 데이터
  const statusCounts = {
    "총 매출": 28,
    "총 계약 매출": 42,
    "총 인원": 24,
    "평균 인당 매출": 1187,
    "평균 업체 수": 85
  }

  // 부가 설명 텍스트
  const descriptions = {
    "총 매출": "전체 기준",
    "총 계약 매출": "연간 계약 기준",
    "총 인원": "전체 팀 합계",
    "평균 인당 매출": "월 평균",
    "평균 업체 수": "팀당 평균"
  }

  return (
    <StatusSummaryCards
      statusCounts={statusCounts}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
      descriptions={descriptions}
    />
  )
}
```

### 3. 실제 데이터와 연동

```tsx
const MyPage = () => {
  const [filterStatus, setFilterStatus] = useState("all")
  const [workTasks, setWorkTasks] = useState([])
  
  // 실제 데이터에서 상태별 카운트 계산
  const statusCounts = {
    전체: workTasks.length,
    진행중: workTasks.filter(task => task.status === "진행중").length,
    완료: workTasks.filter(task => task.status === "완료").length,
    대기: workTasks.filter(task => task.status === "대기").length,
    보류: workTasks.filter(task => task.status === "보류").length
  }

  return (
    <div>
      <StatusSummaryCards
        statusCounts={statusCounts}
        activeFilter={filterStatus}
        onFilterChange={setFilterStatus}
      />
      
      {/* 필터링된 데이터 표시 */}
      <div>
        {workTasks
          .filter(task => filterStatus === "all" || task.status === filterStatus)
          .map(task => (
            <div key={task.id}>{task.title}</div>
          ))
        }
      </div>
    </div>
  )
}
```

## 🎨 Props 상세 설명

### StatusSummaryCards Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `statusCounts` | `Record<string, number>` | ✅ | - | 상태별 카운트 데이터 |
| `activeFilter` | `string` | ✅ | - | 현재 활성 필터 |
| `onFilterChange` | `(filter: string) => void` | ✅ | - | 필터 변경 핸들러 |
| `className` | `string` | ❌ | `""` | 추가 CSS 클래스 |
| `descriptions` | `Record<string, string>` | ❌ | `{}` | 상태별 설명 텍스트 (부가 설명) |
| `variant` | `"default" \| "compact" \| "four-columns"` | ❌ | `"default"` | 반응형 변형 선택 |

### statusCounts 데이터 구조

```tsx
const statusCounts = {
  "전체": 8,      // 전체 항목 수
  "진행중": 4,    // 진행중 상태 항목 수
  "완료": 2,     // 완료 상태 항목 수
  "대기": 1,     // 대기 상태 항목 수
  "보류": 1      // 보류 상태 항목 수
}
```

## 🎯 반응형 변형 (Variants) - 완전 가이드

### 1. Default Variant (`variant="default"`)

**기본값** - 5개 이상의 카드에 최적화

| 화면 크기 | 동작 |
|---------|------|
| 모바일 (< 768px) | 세로 리스트 뷰 |
| 태블릿 이상 (≥ 768px) | 5개 컬럼 그리드 뷰 |

**사용 시기**: 대부분의 페이지 (기본값)

```tsx
<StatusSummaryCards
  statusCounts={statusCounts}
  activeFilter={activeFilter}
  onFilterChange={handleFilterChange}
  descriptions={descriptions}
  // variant="default" (생략 가능)
/>
```

---

### 2. Compact Variant (`variant="compact"`)

**소형 화면 친화적** - 태블릿에서도 모바일 UI 유지

| 화면 크기 | 동작 |
|---------|------|
| 모바일 (< 1024px) | 세로 리스트 뷰 |
| 데스크톱 (≥ 1024px) | 5개 컬럼 그리드 뷰 |

**사용 시기**: 
- 태블릿 화면에서 5개 컬럼이 찌그러져 보이는 경우
- 1000px 이하의 모든 화면에서 읽기 편한 리스트 형태를 원하는 경우

```tsx
<StatusSummaryCards
  statusCounts={statusCounts}
  activeFilter={activeFilter}
  onFilterChange={handleFilterChange}
  descriptions={descriptions}
  variant="compact"  // ✨ 태블릿에서도 리스트 유지
/>
```

---

### 3. Four Columns Variant (`variant="four-columns"`) ✨

**4개 카드 전용** - 태블릿 이상에서 항상 4컬럼 유지

| 화면 크기 | 동작 |
|---------|------|
| 모바일 (< 768px) | 세로 리스트 뷰 |
| 태블릿 이상 (≥ 768px) | 4개 컬럼 그리드 뷰 |

**사용 시기**: 
- 정확히 4개의 상태 카드를 표시하는 경우 (예: 조직관리 페이지)
- 태블릿에서도 4개 컬럼 그리드를 유지하고 싶은 경우

```tsx
<StatusSummaryCards
  statusCounts={{
    "전체 계정": 20,
    "활성 계정": 16,
    "비활성": 3,
    "관리자": 5
  }}
  activeFilter={activeFilter}
  onFilterChange={handleFilterChange}
  descriptions={{
    "전체 계정": "등록된 계정 수",
    "활성 계정": "활성화된 계정",
    "비활성": "비활성 계정",
    "관리자": "관리자 계정"
  }}
  variant="four-columns"  // ✨ 4개 카드 최적화
/>
```

### 변형별 비교표

```
화면 크기              | Default | Compact | Four Columns
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
모바일 (< 768px)       | ✅ 리스트 | ✅ 리스트 | ✅ 리스트
태블릿 (768-1023px)    | ⚠️ 5컬럼 | ✅ 리스트 | ✅ 4컬럼 ⭐
데스크톱 (≥ 1024px)    | ✅ 5컬럼 | ✅ 5컬럼 | ✅ 4컬럼
```

**선택 기준**:
- **기본**: `variant="default"` (5개 이상의 카드)
- **태블릿 최적화**: `variant="compact"` (5개 카드가 찌그러져 보일 때)
- **4개 카드**: `variant="four-columns"` (정확히 4개의 카드) ⭐

## 🎨 상태별 컬러 시스템

컴포넌트는 자동으로 상태별 컬러를 적용합니다:

| 상태 | 배지 컬러 | 트렌드 데이터 |
|------|-----------|---------------|
| **전체** | 파란색 (blue) | +2 (초록색) |
| **진행중** | 파란색 (blue) | +2 (초록색) |
| **완료** | 초록색 (green) | -1 (빨간색) |
| **대기** | 노란색 (yellow) | +2 (초록색) |
| **보류** | 빨간색 (red) | - (회색) |

## 📱 반응형 동작

### 모바일 (< 768px)
- **레이아웃**: 세로 리스트 형태 (컴팩트)
- **카드**: 하나의 카드 안에 모든 상태 표시
- **여백**: 최적화된 간격 (py-1.5, space-y-1)
- **트렌드**: 텍스트만 표시

### 태블릿/데스크톱 (≥ 768px)
- **레이아웃**: 5열 그리드 형태
- **카드**: 개별 카드로 표시
- **트렌드**: 텍스트만 표시

## 🎨 부가 설명 기능

### 레이아웃 자동 조정
부가 설명이 있는 카드와 없는 카드는 자동으로 다른 레이아웃을 사용합니다:

#### 부가 설명이 있는 카드
```
[상태 라벨]                    [상승/하강 데이터] [큰 숫자]
                               [부가 설명 텍스트]
```

#### 부가 설명이 없는 카드 (기본)
```
[상태 라벨] ←→ [상승/하강 데이터] [큰 숫자]
```

## 📋 버전별 사용 가이드

### 🔹 기본 버전 (부가 설명 없음)

**사용 시기**: 일반적인 상태별 카운트 표시가 필요한 경우
**특징**: 
- 기존 레이아웃 유지
- 상승/하강 데이터와 큰 숫자가 가로로 배치
- 간단하고 깔끔한 디자인

**적용 예시**:
- 업무관리 시스템 (진행중, 완료, 대기, 보류)
- 계약관리 시스템 (신규, 연장, 확장, 만료)
- 고객관리 시스템 (신규고객, 기존고객, VIP고객)
- 주문관리 시스템 (주문접수, 결제완료, 배송중)

### 🔹 부가 설명 버전

**사용 시기**: 추가적인 설명이나 기준이 필요한 KPI 데이터 표시
**특징**:
- 자동으로 세로 레이아웃으로 변경
- 상승/하강 데이터가 큰 숫자 왼쪽으로 이동
- 부가 설명이 큰 숫자 하단에 표시
- 더 많은 정보를 포함할 수 있음

**적용 예시**:
- 성과현황 시스템 (총 매출, 총 계약 매출, 총 인원 등)
- KPI 대시보드 (매출 기준, 기간별 데이터)
- 통계 현황 (전체 기준, 월 평균, 팀당 평균 등)

## 🔧 커스터마이징 예시

### 1. 커스텀 클래스 추가

```tsx
<StatusSummaryCards
  statusCounts={statusCounts}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
  className="mb-6"
/>
```

### 2. 다른 상태명 사용

```tsx
const customStatusCounts = {
  "전체": 10,
  "신규": 5,
  "진행중": 3,
  "완료": 2
}

<StatusSummaryCards
  statusCounts={customStatusCounts}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>
```

### 3. 라벨 컬러 커스터마이징 (공통모듈용)

#### 3-1. 기본 컬러 시스템 이해

```tsx
// components/ui/card-status-summary.tsx 내부
const getStatusColor = (status: string) => {
  switch (status) {
    case "전체":
      return {
        border: "border-blue-500",      // 라벨 테두리 컬러 (활성화 시)
        text: "text-blue-600",          // 라벨 텍스트 컬러
        bg: "bg-blue-50",               // 카드 배경 컬러 (클릭 시)
        borderLight: "border-blue-200"  // 라벨 테두리 컬러 (비활성화 시)
      }
    // ... 다른 상태들
  }
}
```

#### 3-2. 프로젝트별 컬러 매핑 가이드

**A. 업무관리 시스템 (기본)**
```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case "전체":
      return { border: "border-blue-500", text: "text-blue-600", bg: "bg-blue-50", borderLight: "border-blue-200" }
    case "진행중":
      return { border: "border-blue-500", text: "text-blue-600", bg: "bg-blue-50", borderLight: "border-blue-200" }
    case "완료":
      return { border: "border-green-500", text: "text-green-600", bg: "bg-green-50", borderLight: "border-green-200" }
    case "대기":
      return { border: "border-yellow-500", text: "text-yellow-600", bg: "bg-yellow-50", borderLight: "border-yellow-200" }
    case "보류":
      return { border: "border-red-500", text: "text-red-600", bg: "bg-red-50", borderLight: "border-red-200" }
  }
}
```

**B. 계약관리 시스템**
```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case "전체":
      return { border: "border-indigo-500", text: "text-indigo-600", bg: "bg-indigo-50", borderLight: "border-indigo-200" }
    case "신규":
      return { border: "border-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50", borderLight: "border-emerald-200" }
    case "연장":
      return { border: "border-amber-500", text: "text-amber-600", bg: "bg-amber-50", borderLight: "border-amber-200" }
    case "확장":
      return { border: "border-purple-500", text: "text-purple-600", bg: "bg-purple-50", borderLight: "border-purple-200" }
    case "만료":
      return { border: "border-gray-500", text: "text-gray-600", bg: "bg-gray-50", borderLight: "border-gray-200" }
  }
}
```

**C. 고객관리 시스템**
```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case "전체":
      return { border: "border-slate-500", text: "text-slate-600", bg: "bg-slate-50", borderLight: "border-slate-200" }
    case "신규고객":
      return { border: "border-cyan-500", text: "text-cyan-600", bg: "bg-cyan-50", borderLight: "border-cyan-200" }
    case "기존고객":
      return { border: "border-teal-500", text: "text-teal-600", bg: "bg-teal-50", borderLight: "border-teal-200" }
    case "VIP고객":
      return { border: "border-rose-500", text: "text-rose-600", bg: "bg-rose-50", borderLight: "border-rose-200" }
    case "휴면고객":
      return { border: "border-zinc-500", text: "text-zinc-600", bg: "bg-zinc-50", borderLight: "border-zinc-200" }
  }
}
```

#### 3-3. 브랜드 컬러 적용 가이드

**브랜드 컬러가 있는 경우:**
```tsx
// 예: 브랜드 컬러가 #3B82F6 (blue-500)인 경우
const getStatusColor = (status: string) => {
  switch (status) {
    case "전체":
      return { 
        border: "border-[#3B82F6]", 
        text: "text-[#3B82F6]", 
        bg: "bg-[#3B82F6]/10", 
        borderLight: "border-[#3B82F6]/30" 
      }
    // ... 다른 상태들도 브랜드 컬러 기반으로 조정
  }
}
```

#### 3-4. 다크모드 지원 컬러

```tsx
const getStatusColor = (status: string) => {
  switch (status) {
    case "전체":
      return {
        border: "border-blue-500 dark:border-blue-400",
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        borderLight: "border-blue-200 dark:border-blue-700"
      }
    case "진행중":
      return {
        border: "border-blue-500 dark:border-blue-400",
        text: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-900/20",
        borderLight: "border-blue-200 dark:border-blue-700"
      }
    case "완료":
      return {
        border: "border-green-500 dark:border-green-400",
        text: "text-green-600 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-900/20",
        borderLight: "border-green-200 dark:border-green-700"
      }
    // ... 다른 상태들도 동일한 패턴으로 다크모드 컬러 추가
  }
}
```

#### 3-5. 접근성 고려 컬러

```tsx
// WCAG 2.1 AA 기준 충족하는 고대비 컬러
const getStatusColor = (status: string) => {
  switch (status) {
    case "전체":
      return {
        border: "border-blue-600",      // 더 진한 컬러로 대비 향상
        text: "text-blue-700",         // 텍스트 가독성 향상
        bg: "bg-blue-100",             // 배경 대비 향상
        borderLight: "border-blue-300"
      }
    case "완료":
      return {
        border: "border-green-600",    // 고대비 초록색
        text: "text-green-700",
        bg: "bg-green-100",
        borderLight: "border-green-300"
      }
    // ... 다른 상태들도 고대비 컬러 적용
  }
}
```

#### 3-6. 컬러 변경 체크리스트

**컬러 변경 시 확인사항:**
- [ ] 모든 상태에 일관된 컬러 시스템 적용
- [ ] 라이트/다크모드 모두 테스트
- [ ] 접근성 기준 (WCAG 2.1 AA) 충족
- [ ] 브랜드 가이드라인 준수
- [ ] 사용자 피드백 반영
- [ ] 다른 컴포넌트와의 일관성 유지

## 🚀 고급 사용법

### 1. 동적 데이터 업데이트

```tsx
const [data, setData] = useState([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  const fetchData = async () => {
    setLoading(true)
    const response = await api.getTasks()
    setData(response.data)
    setLoading(false)
  }
  
  fetchData()
}, [])

const statusCounts = useMemo(() => ({
  전체: data.length,
  진행중: data.filter(item => item.status === "진행중").length,
  완료: data.filter(item => item.status === "완료").length,
  대기: data.filter(item => item.status === "대기").length,
  보류: data.filter(item => item.status === "보류").length
}), [data])

if (loading) return <div>로딩 중...</div>

return (
  <StatusSummaryCards
    statusCounts={statusCounts}
    activeFilter={activeFilter}
    onFilterChange={setActiveFilter}
  />
)
```

### 2. 필터와 데이터 연동

```tsx
const filteredData = useMemo(() => {
  if (activeFilter === "all") return data
  return data.filter(item => item.status === activeFilter)
}, [data, activeFilter])

return (
  <div>
    <StatusSummaryCards
      statusCounts={statusCounts}
      activeFilter={activeFilter}
      onFilterChange={setActiveFilter}
    />
    
    <div className="mt-6">
      {filteredData.map(item => (
        <div key={item.id} className="p-4 border rounded">
          {item.title}
        </div>
      ))}
    </div>
  </div>
)
```

## 🎯 실제 적용 예시 (공통모듈 활용)

### 📋 기본 버전 예시

### 1. 업무현황 페이지

```tsx
// app/work/task/page.tsx
import StatusSummaryCards from "@/components/ui/card-status-summary"

const WorkStatusManagement = () => {
  const [filterStatus, setFilterStatus] = useState("all")
  const [workTasks, setWorkTasks] = useState([])
  
  // 실제 데이터에서 상태별 카운트 계산
  const statusCounts = {
    전체: workTasks.length,
    진행중: workTasks.filter(t => t.status === "진행중").length,
    완료: workTasks.filter(t => t.status === "완료").length,
    대기: workTasks.filter(t => t.status === "대기").length,
    보류: workTasks.filter(t => t.status === "보류").length
  }

  return (
    <div className="space-y-6">
      {/* 상태 요약 카드 */}
      <StatusSummaryCards
        statusCounts={statusCounts}
        activeFilter={filterStatus}
        onFilterChange={setFilterStatus}
      />
      
      {/* 필터링된 데이터 테이블 */}
      <DataTable 
        data={workTasks.filter(task => 
          filterStatus === "all" || task.status === filterStatus
        )}
        columns={columns}
      />
    </div>
  )
}
```

### 2. 계약현황 페이지

```tsx
// app/work/contract/page.tsx
import StatusSummaryCards from "@/components/ui/card-status-summary"

const ContractPage = () => {
  const [statusFilter, setStatusFilter] = useState("all")
  const [contracts, setContracts] = useState([])
  
  const statusCounts = {
    전체: contracts.length,
    신규: contracts.filter(c => c.status === "신규").length,
    연장: contracts.filter(c => c.status === "연장").length,
    확장: contracts.filter(c => c.status === "확장").length,
    만료: contracts.filter(c => c.status === "만료").length
  }

  return (
    <div className="space-y-6">
      <StatusSummaryCards
        statusCounts={statusCounts}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />
      
      {/* 계약 목록 */}
      <ContractList 
        contracts={contracts.filter(contract => 
          statusFilter === "all" || contract.status === statusFilter
        )}
      />
    </div>
  )
}
```

### 3. 고객관리 페이지

```tsx
// app/customer/page.tsx
import StatusSummaryCards from "@/components/ui/card-status-summary"

const CustomerPage = () => {
  const [customerFilter, setCustomerFilter] = useState("all")
  const [customers, setCustomers] = useState([])
  
  const statusCounts = {
    전체: customers.length,
    신규고객: customers.filter(c => c.type === "신규고객").length,
    기존고객: customers.filter(c => c.type === "기존고객").length,
    VIP고객: customers.filter(c => c.type === "VIP고객").length,
    휴면고객: customers.filter(c => c.type === "휴면고객").length
  }

  return (
    <div className="space-y-6">
      <StatusSummaryCards
        statusCounts={statusCounts}
        activeFilter={customerFilter}
        onFilterChange={setCustomerFilter}
      />
      
      {/* 고객 목록 */}
      <CustomerList 
        customers={customers.filter(customer => 
          customerFilter === "all" || customer.type === customerFilter
        )}
      />
    </div>
  )
}
```

### 4. 주문관리 페이지

```tsx
// app/order/page.tsx
import StatusSummaryCards from "@/components/ui/card-status-summary"

const OrderPage = () => {
  const [orderFilter, setOrderFilter] = useState("all")
  const [orders, setOrders] = useState([])
  
  const statusCounts = {
    전체: orders.length,
    주문접수: orders.filter(o => o.status === "주문접수").length,
    결제완료: orders.filter(o => o.status === "결제완료").length,
    배송중: orders.filter(o => o.status === "배송중").length,
    배송완료: orders.filter(o => o.status === "배송완료").length,
    취소: orders.filter(o => o.status === "취소").length
  }

  return (
    <div className="space-y-6">
      <StatusSummaryCards
        statusCounts={statusCounts}
        activeFilter={orderFilter}
        onFilterChange={setOrderFilter}
      />
      
      {/* 주문 목록 */}
      <OrderList 
        orders={orders.filter(order => 
          orderFilter === "all" || order.status === orderFilter
        )}
      />
    </div>
  )
}
```

### 5. 프로젝트관리 페이지

```tsx
// app/project/page.tsx
import StatusSummaryCards from "@/components/ui/card-status-summary"

const ProjectPage = () => {
  const [projectFilter, setProjectFilter] = useState("all")
  const [projects, setProjects] = useState([])
  
  const statusCounts = {
    전체: projects.length,
    기획: projects.filter(p => p.phase === "기획").length,
    개발: projects.filter(p => p.phase === "개발").length,
    테스트: projects.filter(p => p.phase === "테스트").length,
    배포: projects.filter(p => p.phase === "배포").length,
    완료: projects.filter(p => p.phase === "완료").length
  }

  return (
    <div className="space-y-6">
      <StatusSummaryCards
        statusCounts={statusCounts}
        activeFilter={projectFilter}
        onFilterChange={setProjectFilter}
      />
      
      {/* 프로젝트 목록 */}
      <ProjectList 
        projects={projects.filter(project => 
          projectFilter === "all" || project.phase === projectFilter
        )}
      />
    </div>
  )
}
```

### 📋 부가 설명 버전 예시

### 6. 성과현황 페이지 (부가 설명 포함)

```tsx
// app/status/performance/page.tsx
import StatusSummaryCards from "@/components/ui/card-status-summary"

const PerformancePage = () => {
  const [kpiFilter, setKpiFilter] = useState("all")
  const [selectedHalf, setSelectedHalf] = useState("전체")
  
  // KPI 데이터
  const kpiData = {
    totalRevenue: 285000000,
    totalContractRevenue: 420000000,
    totalMembers: 24,
    avgRevenuePerMember: 11875000,
    avgCompaniesCount: 8.5,
  }

  // KPI 데이터를 statusCounts 형태로 변환
  const kpiStatusCounts = {
    "총 매출": Math.round(kpiData.totalRevenue / 10000000), // 억원 단위
    "총 계약 매출": Math.round(kpiData.totalContractRevenue / 10000000), // 억원 단위
    "총 인원": kpiData.totalMembers,
    "평균 인당 매출": Math.round(kpiData.avgRevenuePerMember / 10000), // 만원 단위
    "평균 업체 수": Math.round(kpiData.avgCompaniesCount * 10), // 소수점 제거
  }

  // KPI 설명 텍스트
  const kpiDescriptions = {
    "총 매출": `${selectedHalf} 기준`,
    "총 계약 매출": "연간 계약 기준",
    "총 인원": "전체 팀 합계",
    "평균 인당 매출": "월 평균",
    "평균 업체 수": "팀당 평균",
  }

  return (
    <div className="space-y-6">
      {/* 부가 설명이 포함된 KPI 카드 */}
      <StatusSummaryCards
        statusCounts={kpiStatusCounts}
        activeFilter={kpiFilter}
        onFilterChange={setKpiFilter}
        descriptions={kpiDescriptions}
        className="mb-6"
      />
      
      {/* 기타 성과 데이터 */}
      <PerformanceCharts />
    </div>
  )
}
```

### 7. KPI 대시보드 (부가 설명 포함)

```tsx
// app/dashboard/kpi/page.tsx
import StatusSummaryCards from "@/components/ui/card-status-summary"

const KPIDashboard = () => {
  const [kpiFilter, setKpiFilter] = useState("all")
  
  const kpiStatusCounts = {
    "월 매출": 1250,
    "신규 고객": 45,
    "재방문율": 78,
    "평균 주문액": 85000,
    "고객 만족도": 92
  }

  const kpiDescriptions = {
    "월 매출": "이번 달 기준",
    "신규 고객": "월 신규 가입",
    "재방문율": "3개월 내 재방문",
    "평균 주문액": "월 평균",
    "고객 만족도": "5점 만점"
  }

  return (
    <div className="space-y-6">
      <StatusSummaryCards
        statusCounts={kpiStatusCounts}
        activeFilter={kpiFilter}
        onFilterChange={setKpiFilter}
        descriptions={kpiDescriptions}
      />
    </div>
  )
}
```

## 🏗️ 공통모듈 구현 가이드

### 1. 컴포넌트 구조 이해

```
components/ui/card-status-summary.tsx
├── StatusSummaryCards (메인 컴포넌트)
├── StatusCard (모바일용 개별 상태 카드)
├── DesktopStatusCard (데스크톱용 개별 상태 카드)
├── getStatusColor (상태별 컬러 함수)
└── getTrendData (트렌드 데이터 함수)
```

### 2. Props 인터페이스

```tsx
interface StatusSummaryCardsProps {
  statusCounts: Record<string, number>  // 상태별 카운트 데이터
  activeFilter: string                 // 현재 활성 필터
  onFilterChange: (filter: string) => void  // 필터 변경 핸들러
  className?: string                   // 추가 CSS 클래스
}
```

### 3. 상태 데이터 구조 표준화

```tsx
// 표준 상태 구조
interface StatusData {
  전체: number
  [key: string]: number  // 동적 상태들
}

// 예시 데이터
const statusCounts: StatusData = {
  전체: 100,
  진행중: 40,
  완료: 30,
  대기: 20,
  보류: 10
}
```

### 4. 필터 로직 표준화

```tsx
// 표준 필터 핸들러
const handleFilterChange = (filter: string) => {
  // "전체"를 "all"로 변환
  const normalizedFilter = filter === "전체" ? "all" : filter
  setActiveFilter(normalizedFilter)
}

// 필터링 로직
const filteredData = data.filter(item => 
  activeFilter === "all" || item.status === activeFilter
)
```

### 5. 반응형 디자인 표준

```tsx
// 모바일: < 768px (md)
<div className="md:hidden">
  {/* 컴팩트 리스트 뷰 */}
</div>

// 태블릿/데스크톱: ≥ 768px (md)
<div className="hidden md:grid md:grid-cols-5">
  {/* 5열 그리드 카드 뷰 */}
</div>
```

### 6. 접근성 표준

```tsx
// 키보드 네비게이션 지원
<button
  onClick={() => onFilterChange(status)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onFilterChange(status)
    }
  }}
  aria-pressed={isActive}
  role="tab"
>
  {/* 카드 내용 */}
</button>
```

## ⚠️ 주의사항

### 1. 데이터 일관성
- [ ] `statusCounts`의 키와 실제 데이터의 상태값이 일치해야 합니다
- [ ] 상태명은 한글로 통일 (예: "진행중", "완료", "대기")
- [ ] 숫자 데이터는 항상 0 이상의 정수여야 합니다
- [ ] `descriptions`의 키는 `statusCounts`의 키와 일치해야 합니다

### 2. 필터 로직
- [ ] `onFilterChange`에서 "전체"는 "all"로 변환하는 로직 필요
- [ ] 필터 변경 시 URL 파라미터도 함께 업데이트 (선택사항)
- [ ] 필터 상태는 상위 컴포넌트에서 관리

### 3. 부가 설명 사용 시 주의사항
- [ ] `descriptions`는 선택적 prop이므로 필수가 아닙니다
- [ ] 부가 설명이 있는 카드와 없는 카드가 혼재해도 정상 작동합니다
- [ ] 부가 설명 텍스트는 간결하게 작성 (너무 길면 레이아웃이 깨질 수 있음)
- [ ] 부가 설명이 있을 때만 레이아웃이 자동으로 변경됩니다

### 4. 성능 최적화
- [ ] `statusCounts` 계산은 `useMemo`로 최적화
- [ ] `descriptions`도 `useMemo`로 최적화 권장
- [ ] 대량 데이터의 경우 가상화 고려
- [ ] 불필요한 리렌더링 방지

### 5. 접근성
- [ ] 키보드 네비게이션 지원
- [ ] 스크린 리더 지원
- [ ] 색상 대비 WCAG 2.1 AA 기준 충족
- [ ] 부가 설명 텍스트도 스크린 리더에서 읽힙니다

### 6. 브라우저 호환성
- [ ] 모던 브라우저 지원 (Chrome, Firefox, Safari, Edge)
- [ ] 모바일 브라우저 최적화
- [ ] 터치 이벤트 지원

## 🔄 마이그레이션 가이드

### 1. 기존 코드에서 마이그레이션

**Before (기존 방식):**
```tsx
// 기존 인라인 카드 코드
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3 sm:gap-4 w-full">
  {Object.entries(statusCounts).map(([status, count]) => (
    <Card key={status} className="...">
      {/* 복잡한 카드 내용 */}
    </Card>
  ))}
</div>
```

**After (컴포넌트 사용):**
```tsx
// 간단한 컴포넌트 사용
<StatusSummaryCards
  statusCounts={statusCounts}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>
```

### 2. 단계별 마이그레이션

#### Step 1: 컴포넌트 Import
```tsx
// 기존
import { Card } from "@/components/ui/card"

// 변경
import StatusSummaryCards from "@/components/ui/card-status-summary"
```

#### Step 2: 상태 관리 확인
```tsx
// 필수 상태 확인
const [activeFilter, setActiveFilter] = useState("all")
const [data, setData] = useState([])

// statusCounts 계산
const statusCounts = {
  전체: data.length,
  진행중: data.filter(item => item.status === "진행중").length,
  완료: data.filter(item => item.status === "완료").length,
  대기: data.filter(item => item.status === "대기").length,
  보류: data.filter(item => item.status === "보류").length
}
```

#### Step 3: 필터 로직 업데이트
```tsx
// 기존 필터링 로직
const filteredData = data.filter(item => 
  item.status === selectedStatus
)

// 변경된 필터링 로직
const filteredData = data.filter(item => 
  activeFilter === "all" || item.status === activeFilter
)
```

#### Step 4: UI 교체
```tsx
// 기존 복잡한 카드 렌더링 제거
// <div className="grid...">
//   {Object.entries(statusCounts).map(...)}
// </div>

// 새로운 컴포넌트 사용
<StatusSummaryCards
  statusCounts={statusCounts}
  activeFilter={activeFilter}
  onFilterChange={setActiveFilter}
/>
```

### 3. 마이그레이션 체크리스트

#### 준비 단계
- [ ] 기존 카드 컴포넌트 파악
- [ ] 상태 데이터 구조 확인
- [ ] 필터 로직 분석
- [ ] 스타일링 요구사항 확인

#### 구현 단계
- [ ] `StatusSummaryCards` 컴포넌트 import
- [ ] `statusCounts` 데이터 구조 맞추기
- [ ] 필터 상태 관리 로직 구현
- [ ] 기존 카드 코드 제거

#### 테스트 단계
- [ ] 모바일/데스크톱 반응형 테스트
- [ ] 필터 기능 동작 확인
- [ ] 컬러 시스템 확인
- [ ] 접근성 테스트

#### 배포 단계
- [ ] 코드 리뷰
- [ ] 성능 테스트
- [ ] 사용자 피드백 수집
- [ ] 문서 업데이트

### 4. 문제 해결 가이드

#### 문제 1: 컬러가 적용되지 않는 경우
```tsx
// 해결: getStatusColor 함수에서 상태명 확인
const getStatusColor = (status: string) => {
  // 상태명이 정확한지 확인
  switch (status) {
    case "진행중": // 정확한 상태명 사용
      return { border: "border-blue-500", ... }
  }
}
```

#### 문제 2: 필터가 작동하지 않는 경우
```tsx
// 해결: 필터 핸들러에서 상태명 변환 확인
const handleFilterChange = (filter: string) => {
  // "전체"를 "all"로 변환하는 로직 확인
  const normalizedFilter = filter === "전체" ? "all" : filter
  setActiveFilter(normalizedFilter)
}
```

#### 문제 3: 모바일에서 레이아웃 깨지는 경우
```tsx
// 해결: 반응형 클래스 확인
<div className="md:hidden">  {/* 모바일 */}
<div className="hidden md:grid">  {/* 데스크톱 */}
```

### 5. 성능 최적화 팁

```tsx
// statusCounts 계산 최적화
const statusCounts = useMemo(() => ({
  전체: data.length,
  진행중: data.filter(item => item.status === "진행중").length,
  완료: data.filter(item => item.status === "완료").length,
  대기: data.filter(item => item.status === "대기").length,
  보류: data.filter(item => item.status === "보류").length
}), [data])

// 필터링된 데이터 최적화
const filteredData = useMemo(() => {
  return data.filter(item => 
    activeFilter === "all" || item.status === activeFilter
  )
}, [data, activeFilter])
```

## 📚 참고 자료

- [Tailwind CSS 반응형 디자인](https://tailwindcss.com/docs/responsive-design)
- [React 컴포넌트 패턴](https://react.dev/learn/thinking-in-react)
- [TypeScript 인터페이스](https://www.typescriptlang.org/docs/handbook/interfaces.html)

---

## 🔄 최신 업데이트 (v1.1)

### 2024-12-19 업데이트 내용

#### 1. **범용 상태 컬러 시스템**
- 업무관리, 계약관리, 고객관리 시스템 모든 상태 지원
- 각 시스템별 적절한 컬러 매핑 적용

#### 2. **모바일 여백 최적화**
- 카드 상하 여백: `py-2` → `py-1.5` (25% 감소)
- 카드 간격: `space-y-2` → `space-y-1` (50% 감소)
- 컨테이너 패딩: `p-4` → `p-3` (25% 감소)

#### 3. **반응형 레이아웃 개선**
- 브레이크포인트: 640px → 768px로 변경
- 태블릿/데스크톱: 768px부터 5열 그리드 적용
- lg(1024px)에서도 5열 유지로 공간 효율성 향상

### 2024-12-20 업데이트 내용 ✨

#### 1. **반응형 Variant 시스템 추가**
- `variant="default"`: 기본 반응형 (5개 이상 카드용)
- `variant="compact"`: 태블릿에서도 리스트 유지 (1024px 기준)
- `variant="four-columns"`: 4개 카드 최적화 (태블릿에서 4컬럼 유지) ⭐

#### 2. **조직관리 페이지 적용**
- 4개 카드를 `variant="four-columns"`로 구현
- 태블릿에서도 4컬럼 그리드 유지
- 모바일에서는 리스트 뷰로 자동 전환

#### 3. **가이드 통합**
- 기본 가이드에 반응형 변형 정보 통합
- 단일 가이드로 완전한 문서 제공
- 별도의 반응형 가이드는 더 이상 필요 없음

**작성일**: 2024-10-21  
**최종 업데이트**: 2024-12-20  
**버전**: 1.2 (Variant 시스템 통합)  
**적용 프로젝트**: AGOFFICE
