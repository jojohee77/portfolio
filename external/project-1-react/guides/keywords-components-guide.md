# 키워드 현황 컴포넌트 가이드

## 개요
키워드 현황 페이지는 여러 개의 재사용 가능한 컴포넌트로 분리되어 있습니다. 각 컴포넌트는 단일 책임 원칙을 따르며, 계약 현황 페이지의 디자인 시스템과 일관성을 유지합니다.

## 디렉토리 구조
```
components/
└── keywords/
    ├── keywords-stats-cards.tsx      # 통계 카드 컴포넌트
    ├── keywords-filter-bar.tsx       # 검색 및 필터 바 컴포넌트
    ├── keywords-charts.tsx           # 차트 컴포넌트
    ├── keywords-table.tsx            # 테이블 컴포넌트
    └── keyword-detail-modal.tsx      # 상세 모달 컴포넌트
```

## 1. KeywordsStatsCards 컴포넌트

### 용도
키워드 현황의 주요 통계를 카드 형태로 표시합니다.

### Props
```typescript
interface KeywordsStatsCardsProps {
  totalKeywords: number        // 총 키워드 수
  totalPostings: number        // 총 포스팅 수
  totalReworks: number         // 총 재작업 수
  averageTop5Rate: number      // 평균 5위 안 확률
  excellentKeywords: number    // 우수 키워드 수
  filter: string | null        // 현재 활성화된 필터
}
```

### 사용 예시
```tsx
<KeywordsStatsCards
  totalKeywords={totalKeywords}
  totalPostings={totalPostings}
  totalReworks={totalReworks}
  averageTop5Rate={averageTop5Rate}
  excellentKeywords={excellentKeywords}
  filter={filter}
/>
```

### 디자인 특징
- 계약 현황과 동일한 카드 스타일 (rounded-2xl, shadow-none)
- 클릭 가능한 카드 (재작업, 5위 안 확률, 우수 키워드)
- 선택된 카드는 `ring-2 ring-blue-500 bg-blue-50` 스타일 적용
- 각 카드는 border 색상으로 구분 (blue, green, orange, purple, red)
- TrendingUp/TrendingDown 아이콘으로 증감 표시

## 2. KeywordsFilterBar 컴포넌트

### 용도
키워드 검색 및 필터링 기능을 제공합니다.

### Props
```typescript
interface KeywordsFilterBarProps {
  searchTerm: string                    // 검색어
  onSearchTermChange: (value: string) => void
  selectedCompetition: string           // 선택된 경쟁강도
  onCompetitionChange: (value: string) => void
  selectedClient: string                // 선택된 고객사
  onClientChange: (value: string) => void
  competitionLevels: string[]           // 경쟁강도 옵션 목록
  clients: string[]                     // 고객사 목록
}
```

### 사용 예시
```tsx
<KeywordsFilterBar
  searchTerm={searchTerm}
  onSearchTermChange={setSearchTerm}
  selectedCompetition={selectedCompetition}
  onCompetitionChange={setSelectedCompetition}
  selectedClient={selectedClient}
  onClientChange={setSelectedClient}
  competitionLevels={competitionLevels}
  clients={clients}
/>
```

### 디자인 특징
- 계약 현황과 동일한 레이아웃 (rounded-xl, border-gray-200)
- 검색 input은 높이 40px로 통일
- Select 컴포넌트는 border-gray-300 스타일
- 반응형: 모바일에서는 세로로 배치

## 3. KeywordsCharts 컴포넌트

### 용도
경쟁강도별 평균 순위와 키워드 성과 분석 차트를 표시합니다.

### Props
```typescript
interface CompetitionData {
  name: string
  value: number
  avgRank: number
  color: string
}

interface PerformanceData {
  name: string
  value: number
  total: number
  percentage: number
}

interface KeywordsChartsProps {
  competitionData: CompetitionData[]
  performanceData: PerformanceData[]
}
```

### 사용 예시
```tsx
<KeywordsCharts
  competitionData={competitionData}
  performanceData={performanceData}
/>
```

### 디자인 특징
- 2개의 차트를 grid로 배치 (grid-cols-1 lg:grid-cols-2)
- 카드 스타일: shadow-none rounded-xl border-gray-200
- Recharts 라이브러리 사용
- 일관된 폰트 크기 및 색상 팔레트

## 4. KeywordsTable 컴포넌트

### 용도
키워드 목록을 테이블 형태로 표시하고 페이지네이션을 제공합니다.

### Props
```typescript
interface KeywordData {
  keyword: string
  totalPostings: number
  reworkCount: number
  top5Rate: number
  top1Rate: number
  competitionLevel: "아주좋음" | "좋음" | "보통" | "나쁨" | "아주나쁨"
  averageRank: number
  bestRank: number
  worstRank: number
  clients: string[]
  monthlySearchVolume?: number
  monthlyPostVolume?: number
  blogSaturation?: number
}

interface KeywordsTableProps {
  filteredData: KeywordData[]
  paginatedData: KeywordData[]
  currentPage: number
  totalPages: number
  itemsPerPage: number
  startIndex: number
  endIndex: number
  onPageChange: (page: number) => void
  onViewDetail: (keyword: KeywordData) => void
  onExcelDownload: () => void
}
```

### 사용 예시
```tsx
<KeywordsTable
  filteredData={filteredData}
  paginatedData={paginatedData}
  currentPage={currentPage}
  totalPages={totalPages}
  itemsPerPage={itemsPerPage}
  startIndex={startIndex}
  endIndex={endIndex}
  onPageChange={handlePageChange}
  onViewDetail={handleViewDetail}
  onExcelDownload={handleExcelDownload}
/>
```

### 디자인 특징
- 테이블 헤더: bg-gray-100, font-semibold text-gray-700
- 테이블 행: hover:bg-gray-50 transition-colors
- 버튼 스타일:
  - 엑셀 다운로드: bg-primary, rounded-lg
  - 상세보기: ghost 스타일, size-icon
- 페이지네이션: 계약 현황과 동일한 스타일 (rounded-full 버튼)

## 5. KeywordDetailModal 컴포넌트

### 용도
선택된 키워드의 상세 정보를 모달로 표시합니다.

### Props
```typescript
interface PostingDetail {
  id: number
  title: string
  client: string
  blogUrl: string
  registeredDate: string
  currentRank: number
  category: "신규" | "재작업"
  manager: string
  teamName: string
}

interface KeywordData {
  keyword: string
  totalPostings: number
  reworkCount: number
  top5Rate: number
  competitionLevel: "아주좋음" | "좋음" | "보통" | "나쁨" | "아주나쁨"
  monthlySearchVolume?: number
  monthlyPostVolume?: number
  blogSaturation?: number
  postingDetails: PostingDetail[]
  rankingHistory: { date: string; rank: number; searchVolume: number; monthlyPosts: number }[]
  clients: string[]
}

interface KeywordDetailModalProps {
  isOpen: boolean
  keyword: KeywordData | null
  onClose: () => void
  onCopyToClipboard: (text: string) => Promise<void>
}
```

### 사용 예시
```tsx
<KeywordDetailModal
  isOpen={isDetailModalOpen}
  keyword={selectedKeyword}
  onClose={() => {
    setIsDetailModalOpen(false)
    setSelectedKeyword(null)
  }}
  onCopyToClipboard={copyToClipboard}
/>
```

### 디자인 특징
- createPortal을 사용하여 body에 렌더링
- 배경: fixed inset-0 bg-black bg-opacity-50 z-50
- 모달: max-w-6xl max-h-[90vh] overflow-y-auto
- 7개의 통계 카드를 grid로 배치 (grid-cols-1 md:grid-cols-7)
- 복합 차트 (ComposedChart): 순위, 검색량, 발행량 동시 표시
- 포스팅 상세 목록을 테이블로 표시

## 공통 디자인 시스템

### 색상 팔레트
- Primary: blue (border-blue-500, text-blue-600)
- Success: green (border-green-500, text-green-600)
- Warning: orange (border-orange-500, text-orange-600)
- Error: red (border-red-500, text-red-600)
- Info: purple (border-purple-500, text-purple-600)

### 카드 스타일
```css
shadow-none rounded-xl border border-gray-200
```

### 버튼 스타일
- Primary: `bg-primary text-white shadow-none rounded-lg`
- Outline: `variant="outline" shadow-none rounded-lg border-gray-300`
- Ghost: `variant="ghost" hover:bg-gray-100`

### 반응형 브레이크포인트
- sm: 640px (모바일)
- md: 768px (태블릿)
- lg: 1024px (데스크톱)
- xl: 1280px (큰 화면)

## 메인 페이지 구조

```tsx
export default function KeywordStatus() {
  // 상태 관리
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCompetition, setSelectedCompetition] = useState("all")
  const [selectedClient, setSelectedClient] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null)

  // 데이터 필터링 및 페이지네이션
  const filteredData = keywordData.filter(...)
  const paginatedData = filteredData.slice(startIndex, endIndex)

  // 통계 계산
  const totalKeywords = filteredData.length
  const totalPostings = filteredData.reduce(...)
  // ...

  // 차트 데이터 생성
  const competitionData = competitionLevels.map(...)
  const performanceData = [...]

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* 통계 카드 */}
      <KeywordsStatsCards ... />
      {/* 필터 및 검색 */}
      <KeywordsFilterBar ... />
      {/* 차트 섹션 */}
      <KeywordsCharts ... />
      {/* 키워드 목록 테이블 */}
      <KeywordsTable ... />
      {/* 상세보기 모달 */}
      <KeywordDetailModal ... />
    </div>
  )
}
```

## 사용 시 주의사항

1. **타입 일관성**: 모든 컴포넌트는 동일한 `KeywordData` 타입을 사용합니다.

2. **상태 관리**: 부모 컴포넌트(page.tsx)에서 모든 상태를 관리하고 props로 전달합니다.

3. **이벤트 핸들러**: 각 컴포넌트는 이벤트 핸들러를 props로 받아 실행합니다.

4. **스타일 일관성**: 계약 현황 페이지와 동일한 디자인 시스템을 따릅니다.

5. **반응형**: 모든 컴포넌트는 모바일부터 데스크톱까지 반응형으로 동작합니다.

## 확장 가능성

새로운 기능을 추가할 때는 다음 원칙을 따르세요:

1. **컴포넌트 분리**: 50줄 이상의 JSX는 별도 컴포넌트로 분리
2. **재사용성**: 다른 페이지에서도 사용 가능하도록 설계
3. **Props 인터페이스**: 명확한 타입 정의
4. **디자인 일관성**: 기존 컴포넌트의 스타일을 따름

## 예시: 새로운 필터 추가하기

1. KeywordsFilterBar 컴포넌트에 새로운 Select 추가
2. Props 인터페이스에 새로운 props 추가
3. 부모 컴포넌트에서 상태 및 핸들러 추가
4. 필터링 로직에 새로운 조건 추가

```tsx
// KeywordsFilterBar.tsx
<Select value={selectedStatus} onValueChange={onStatusChange}>
  <SelectTrigger className="w-full sm:w-48 border border-gray-300 h-10">
    <SelectValue placeholder="상태 선택" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">전체 상태</SelectItem>
    <SelectItem value="active">활성</SelectItem>
    <SelectItem value="inactive">비활성</SelectItem>
  </SelectContent>
</Select>

// page.tsx
const [selectedStatus, setSelectedStatus] = useState("all")

const filteredData = keywordData.filter((item) => {
  // ... 기존 필터링 로직
  const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
  return matchesSearch && matchesCompetition && matchesClient && matchesStatus
})
```
