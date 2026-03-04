# ListTable 컴포넌트 가이드

## 개요
`ListTable`은 공지사항과 같은 리스트형 데이터를 표시하는 컴포넌트입니다. PC에서는 테이블 형태로, 모바일에서는 심플한 리스트 형태로 자동 전환됩니다.

## 주요 기능
- 📱 반응형 디자인 (모바일 리스트 뷰 + PC 테이블 뷰)
- 📊 유연한 컬럼 정의
- 🔄 페이지네이션 내장
- 📝 정렬 기능 (선택)
- 🎨 커스터마이징 가능한 렌더링
- 🗂️ 빈 상태 처리
- ⚡ 로딩 스켈레톤
- 🎯 제네릭 타입 지원

## DataTable과의 차이점

| 특징 | DataTable | ListTable |
|------|-----------|-----------|
| 모바일 뷰 | 카드 형태 (개별 카드) | 리스트 형태 (하나의 카드 안에 리스트) |
| 용도 | 복잡한 데이터 (계약, 작업 등) | 심플한 리스트 (공지사항, 게시판 등) |
| 모바일 스타일 | 카드 간격 있음 | 리스트 아이템 보더로 구분 |
| 카드 패딩 | 개별 카드 패딩 | 전체 카드에 좌우 패딩 |

## 설치 및 임포트

```tsx
import ListTable, { 
  type Column, 
  type SortOption,
  type ListTableProps 
} from "@/components/ui/list-table"
```

## Props

### 필수 Props

| Prop | 타입 | 설명 |
|------|------|------|
| `data` | `T[]` | 표시할 데이터 배열 |
| `columns` | `Column<T>[]` | 테이블 컬럼 정의 |
| `totalCount` | `number` | 전체 데이터 개수 |
| `currentPage` | `number` | 현재 페이지 번호 |
| `totalPages` | `number` | 전체 페이지 수 |
| `onPageChange` | `(page: number) => void` | 페이지 변경 핸들러 |
| `renderMobileItem` | `(item: T) => ReactNode` | 모바일 리스트 아이템 렌더링 함수 |

### 선택적 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | - | 테이블 제목 |
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
| `titleButtons` | `ReactNode` | - | 타이틀 안쪽 버튼들 |
| `className` | `string` | `""` | 추가 CSS 클래스 |

## 타입 정의

### Column<T>

```tsx
interface Column<T> {
  key: string              // 컬럼 키
  label: ReactNode         // 컬럼 라벨 (헤더)
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

### 1. 기본 사용 (공지사항 목록)

```tsx
"use client"

import { useState } from "react"
import ListTable, { type Column } from "@/components/ui/list-table"
import { Badge } from "@/components/ui/badge"

interface Notice {
  id: number
  type: string
  typeColor: string
  title: string
  author: string
  registrationDate: string
  viewCount: number
  isPinned: boolean
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([/* 데이터 */])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 컬럼 정의
  const columns: Column<Notice>[] = [
    {
      key: "id",
      label: "번호",
      width: "w-[60px]",
      align: "center",
      render: (notice) => (
        notice.isPinned ? (
          <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 border-0">
            필독
          </Badge>
        ) : (
          <span className="text-sm text-gray-700">{notice.id}</span>
        )
      ),
    },
    {
      key: "type",
      label: "유형",
      width: "w-[80px]",
      render: (notice) => (
        <Badge variant="secondary" className={`text-xs ${notice.typeColor} border-0`}>
          {notice.type}
        </Badge>
      ),
    },
    {
      key: "title",
      label: "제목",
      width: "w-[400px]",
      render: (notice) => (
        <div
          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer truncate"
          onClick={() => handleViewDetail(notice.id)}
          title={notice.title}
        >
          {notice.title}
        </div>
      ),
    },
    {
      key: "author",
      label: "작성자",
      width: "w-[120px]",
      align: "center",
      render: (notice) => (
        <div className="text-sm text-gray-700">{notice.author}</div>
      ),
    },
    {
      key: "registrationDate",
      label: "등록일",
      width: "w-[120px]",
      align: "center",
      render: (notice) => (
        <div className="text-sm text-gray-500">{notice.registrationDate}</div>
      ),
    },
    {
      key: "viewCount",
      label: "조회수",
      width: "w-[100px]",
      align: "center",
      render: (notice) => (
        <div className="text-sm text-gray-700">{notice.viewCount.toLocaleString()}</div>
      ),
    },
  ]

  // 모바일 리스트 아이템 렌더링
  const renderMobileItem = (notice: Notice) => (
    <div
      className="bg-white border-b border-gray-200 py-6 cursor-pointer active:bg-gray-50"
      onClick={() => handleViewDetail(notice.id)}
    >
      <div className="space-y-2">
        {/* 배지 */}
        <div className="flex items-center gap-2">
          {notice.isPinned && (
            <Badge variant="secondary" className="text-xs bg-red-50 text-red-600 border-0">
              필독
            </Badge>
          )}
          <Badge variant="secondary" className={`text-xs ${notice.typeColor} border-0`}>
            {notice.type}
          </Badge>
        </div>
        
        {/* 제목 */}
        <div className="text-[15px] font-medium text-gray-900 line-clamp-2 leading-snug">
          {notice.title}
        </div>
        
        {/* 메타 정보 */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>조회 {notice.viewCount.toLocaleString()}</span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              {notice.author}
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  // 페이지네이션 계산
  const totalPages = Math.ceil(notices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = notices.slice(startIndex, startIndex + itemsPerPage)

  const handleViewDetail = (id: number) => {
    // 상세 페이지로 이동
  }

  return (
    <div className="p-6">
      <ListTable
        data={paginatedData}
        columns={columns}
        totalCount={notices.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        renderMobileItem={renderMobileItem}
      />
    </div>
  )
}
```

### 2. 타이틀과 정렬 포함

```tsx
<ListTable
  data={paginatedData}
  columns={columns}
  title="공지사항"
  totalCount={notices.length}
  sortValue={sortValue}
  onSortChange={setSortValue}
  sortOptions={[
    { value: "등록일순", label: "등록일순" },
    { value: "제목순", label: "제목순" },
    { value: "조회수순", label: "조회수순" },
  ]}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  renderMobileItem={renderMobileItem}
/>
```

### 3. 로딩 상태

```tsx
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true)
    // 데이터 로딩
    setIsLoading(false)
  }
  fetchData()
}, [])

<ListTable
  data={paginatedData}
  columns={columns}
  totalCount={notices.length}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  renderMobileItem={renderMobileItem}
  isLoading={isLoading}
  skeletonRows={10}
/>
```

### 4. 커스텀 빈 상태

```tsx
<ListTable
  data={[]}
  columns={columns}
  totalCount={0}
  currentPage={1}
  totalPages={1}
  onPageChange={() => {}}
  renderMobileItem={renderMobileItem}
  emptyIcon="/icons/icon-default.png"
  emptyTitle="공지사항이 없습니다"
  emptyDescription="검색 조건을 변경해보세요."
/>
```

## 모바일 리스트 아이템 디자인 가이드

### 기본 구조

```tsx
const renderMobileItem = (item: DataType) => (
  <div className="bg-white border-b border-gray-200 py-6 cursor-pointer active:bg-gray-50">
    <div className="space-y-2">
      {/* 상단: 배지, 태그 등 */}
      <div className="flex items-center gap-2">
        {/* 배지들 */}
      </div>
      
      {/* 중간: 제목 또는 주요 내용 */}
      <div className="text-[15px] font-medium text-gray-900 line-clamp-2">
        {item.title}
      </div>
      
      {/* 하단: 메타 정보 */}
      <div className="text-xs text-gray-500">
        {/* 날짜, 작성자, 조회수 등 */}
      </div>
    </div>
  </div>
)
```

### 스타일 가이드

| 요소 | 클래스 | 설명 |
|------|--------|------|
| 컨테이너 | `py-6` | 상하 24px 패딩 |
| 컨테이너 | `border-b border-gray-200` | 하단 보더 |
| 제목 | `text-[15px] font-medium` | 15px, 중간 굵기 |
| 제목 | `line-clamp-2` | 최대 2줄 표시 |
| 메타 정보 | `text-xs text-gray-500` | 작은 텍스트, 회색 |
| 구분자 | `w-1 h-1 bg-gray-400 rounded-full` | 작은 점 |

### 터치 피드백

```tsx
className="cursor-pointer active:bg-gray-50"
```

모바일에서 터치 시 배경색이 회색으로 변경되어 피드백을 제공합니다.

## 반응형 디자인

| 화면 크기 | 레이아웃 | 특징 |
|-----------|----------|------|
| 모바일 (< 1024px) | 리스트 뷰 | 하나의 카드 안에 리스트 아이템들 |
| PC (≥ 1024px) | 테이블 뷰 | 일반 테이블 형태 |

## 페이지네이션

- **최대 10개 페이지 번호** 표시
- **이전/다음 버튼** 자동 비활성화
- **페이지 변경 시 자동 스크롤** (상단으로)
- 1페이지만 있어도 페이지네이션 표시

## 스타일 커스터마이징

### 모바일 카드 여백 조정

Card 컴포넌트의 패딩은 `px-4 py-0 gap-0`으로 고정되어 있습니다:
- `px-4`: 좌우 16px 패딩
- `py-0`: 상하 패딩 없음
- `gap-0`: 내부 요소 간 간격 없음

### 리스트 아이템 여백 조정

각 리스트 아이템의 `py-6`을 조정하여 상하 여백을 변경할 수 있습니다.

## 주의사항

### 1. ID 필드 필수

데이터 타입은 반드시 `id` 필드를 포함해야 합니다:

```tsx
interface MyData {
  id: string | number  // 필수!
  // ... 기타 필드
}
```

### 2. 모바일 리스트 아이템 렌더링 필수

`renderMobileItem` prop은 필수입니다. 생략하면 오류가 발생합니다.

### 3. 컬럼 키 일치

컬럼의 `key`는 데이터 객체의 실제 키와 일치해야 합니다 (render 함수 사용 시 제외).

### 4. 모바일 리스트 스타일

모바일 리스트 아이템은 다음 클래스를 반드시 포함해야 합니다:
- `bg-white`: 흰색 배경
- `border-b border-gray-200`: 하단 보더
- `py-6`: 상하 패딩 (조정 가능)

## DataTable vs ListTable 선택 가이드

### DataTable 사용

- 복잡한 데이터 구조 (계약, 작업, 프로젝트 등)
- 모바일에서 카드 형태로 많은 정보 표시 필요
- 각 아이템이 독립적인 카드로 보여야 할 때

### ListTable 사용

- 심플한 리스트 데이터 (공지사항, 게시판, FAQ 등)
- 모바일에서 깔끔한 리스트 형태 선호
- 제목 중심의 간단한 정보 표시

## 문제 해결

### Q: 모바일에서 카드 여백이 너무 넓어요
A: Card 컴포넌트의 `px-4`를 `px-3` 또는 `px-2`로 조정하세요.

### Q: 리스트 아이템 간격을 조정하고 싶어요
A: `renderMobileItem`의 `py-6`을 `py-4` 또는 `py-8`로 변경하세요.

### Q: 페이지네이션이 표시되지 않아요
A: `showPagination={true}`를 설정하고 `data.length > 0`인지 확인하세요.

### Q: 모바일에서 리스트가 카드로 감싸지지 않아요
A: `renderMobileItem`에서 반환하는 요소에 `bg-white`와 `border-b`가 있는지 확인하세요.

## 관련 컴포넌트

- `DataTable`: 복잡한 데이터용 테이블 컴포넌트
- `Card`: 카드 컴포넌트
- `Badge`: 배지 컴포넌트
- `Table`: 기본 테이블 컴포넌트

## 버전 히스토리

- **v1.0.0** (2025-01-23): 초기 버전 출시
  - 반응형 테이블/리스트 뷰
  - 페이지네이션
  - 정렬 기능 (선택)
  - 제네릭 타입 지원
  - 모바일 최적화 리스트 뷰

## 라이선스

이 컴포넌트는 프로젝트 내부에서 자유롭게 사용 및 수정할 수 있습니다.

