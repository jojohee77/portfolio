# AGOFFICE 컴포넌트 가이드

이 디렉토리에는 AGOFFICE 프로젝트에서 사용하는 공통 컴포넌트들의 사용 가이드 문서가 포함되어 있습니다.

## 📚 가이드 목록

### UI 컴포넌트

#### 1. [FileUpload 컴포넌트](./file-upload-guide.md)
파일 업로드 기능을 제공하는 재사용 가능한 공통 컴포넌트입니다.
- 드래그 앤 드롭 지원
- 파일 크기/타입 검증
- 업로드된 파일 목록 표시
- **위치**: `components/ui/file-upload.tsx`
- **사용처**: 계약등록 모달, 문서 업로드 등

#### 2. [CustomDatePicker 컴포넌트](./custom-datepicker-guide.md)
날짜 선택 기능을 제공하는 커스텀 데이트피커 컴포넌트입니다.
- 단일/범위 날짜 선택
- 한글화
- 커스텀 스타일링
- **위치**: `components/ui/custom-datepicker.tsx`

#### 3. [Toast 알림](./toast-guide.md)
사용자에게 알림 메시지를 표시하는 토스트 컴포넌트입니다.
- 성공/에러/경고/정보 타입
- 자동 닫힘
- 커스텀 아이콘
- **위치**: `components/ui/toast.tsx`, `lib/toast-utils.ts`

#### 4. [AlertConfirmModal 컴포넌트 (얼럿 & 확인 모달)](./alert-confirm-modal-guide.md)
얼럿창과 삭제 확인을 위한 범용 모달 컴포넌트입니다.
- 얼럿창 (확인 버튼만)
- 삭제 확인 모달 (취소/확인 버튼)
- 커스텀 메시지/버튼
- 바깥 영역 클릭으로 닫기
- **위치**: `components/ui/alert-confirm-modal.tsx`

#### 5. [LoadingModal 컴포넌트](./loading-modal-guide.md)
로딩 상태를 표시하는 모달 컴포넌트입니다.
- 전역 로딩 표시
- 커스텀 메시지
- **위치**: `components/ui/loading-modal.tsx`

#### 6. [ScrollModal 컴포넌트](./scroll-modal-guide.md)
스크롤 가능한 모달 컴포넌트입니다.
- 긴 콘텐츠 처리
- 반응형 디자인
- **위치**: `components/scroll-modal.tsx`

#### 7. [StepIndicator 컴포넌트](./step-indicator-guide.md)
다단계 프로세스의 진행 상황을 표시하는 컴포넌트입니다.
- 단계 표시
- 클릭 가능한 단계
- **위치**: `components/ui/step-indicator.tsx`

#### 8. [StepNavigation 컴포넌트](./step-navigation-guide.md)
다단계 프로세스의 네비게이션을 제공하는 컴포넌트입니다.
- 이전/다음 버튼
- 임시저장/제출
- **위치**: `components/ui/step-navigation.tsx`

#### 8-1. [튜토리얼 가이드 (버전1 & 버전2)](./tutorial-guide.md)
대시보드 등에서 사용하는 Spotlight 튜토리얼(버전1)과 모달 투어(버전2)에 대한 통합 가이드입니다.
- spotlight 기반 커스텀 오버레이
- TourModal 기반 온보딩 슬라이드
- 데스크톱/모바일 분기 예시 포함
- **위치**: `components/tutorials/tutorial-provider.tsx`, `components/tutorials/tour-modal.tsx`

#### 9. [SearchFilterPanel 컴포넌트](./search-filter-panel-guide.md)
검색 및 필터링 기능을 제공하는 통합 패널 컴포넌트입니다.
- 검색어 입력
- 상태 필터 (체크박스)
- 날짜 범위 선택
- 반응형 레이아웃
- **위치**: `components/ui/search-filter-panel.tsx`
- **사용처**: 계약현황, 업무현황 등

#### 10. [DataTable 컴포넌트](./data-table-guide.md)
데이터 목록을 테이블 형태로 표시하는 통합 컴포넌트입니다.
- 반응형 디자인 (모바일 카드 + PC 테이블)
- 페이지네이션 내장
- 정렬 기능
- 제네릭 타입 지원
- **위치**: `components/ui/data-table.tsx`
- **사용처**: 계약목록, 사용자목록 등

#### 10-1. [모바일 최적화 가이드 (통합)](./mobile-guide.md) ⭐
모바일 환경에 최적화된 모든 패턴을 통합한 가이드입니다.
- 📱 모바일 페이지 타이틀 (Header)
- 📊 MobileDataTable (데스크톱 테이블)
- 📱 MobileCardList (모바일 카드 리스트)
- 💳 KPI 카드 최적화
- 🔄 반응형 패턴
- **위치**: `components/ui/mobile-data-table.tsx`, `components/header.tsx`
- **사용처**: 모든 모바일 최적화가 필요한 페이지

#### 10-2. [모바일 가로스크롤 문제 해결 가이드](./mobile-horizontal-scroll-guide.md) 🔧
모바일에서 페이지 전체가 가로스크롤되는 문제를 해결하는 가이드입니다.
- 🐛 문제 원인 분석 (Flexbox, w-max, gap)
- ✅ 해결 방법 (min-w-0, 올바른 overflow 구조)
- 📱 탭 네비게이션 가로스크롤 구현
- 🎯 반응형 간격 및 크기 조정
- 🔍 디버깅 팁
- **핵심 키워드**: `min-w-0`, `overflow-x-auto`, 반응형 레이아웃
- **사용처**: 탭 메뉴, 긴 콘텐츠 리스트, 가로 스크롤 영역

#### 11. [LoadingBar 컴포넌트](./loading-bar-guide.md)
막대형 로딩 인디케이터 컴포넌트입니다.
- 가로 막대형 로딩
- 블루 그라데이션 효과
- 커스터마이징 가능한 메시지/크기
- **위치**: `components/ui/loading-bar.tsx`
- **사용처**: 데이터 로딩, 임시저장 불러오기 등

#### 12. [LoadingAnimation 컴포넌트](./loading-animation-guide.md)
Lottie 애니메이션 기반 써클형 로딩 인디케이터 컴포넌트입니다.
- 부드러운 써클 애니메이션
- 메인/서브 메시지 지원
- 조절 가능한 크기
- **위치**: `components/ui/loading-animation.tsx`
- **사용처**: 파일 업로드, 데이터 처리 등

#### 13. [EventPopup 컴포넌트](./event-popup-guide.md)
이벤트, 공지사항, 프로모션을 표시하기 위한 모달 팝업 컴포넌트입니다.
- "다시 보지 않기" 기능 (로컬스토리지)
- 커스터마이징 가능한 배경/버튼
- 반응형 디자인
- 애니메이션 효과
- **위치**: `components/ui/event-popup.tsx`
- **사용처**: 이벤트 안내, 신규 기능 홍보, 프로모션 등

#### 14. [CommonSelect 컴포넌트](./common-select-guide.md)
재사용 가능한 공통 셀렉트박스 컴포넌트입니다.
- 일관된 디자인 제공
- 레이블 유무 선택 가능 (CommonSelect / LabeledSelect)
- TypeScript 완벽 지원
- 커스터마이징 가능한 스타일
- 반응형 디자인
- **위치**: `components/ui/common-select.tsx`
- **사용처**: 연도 선택, 정렬 필터, 카테고리 선택 등

#### 14-1. [StatusSummaryCards 반응형 가이드 (중요!)](./card-status-summary-responsive-guide.md) ⭐
상태 카드의 반응형 레이아웃을 선택적으로 적용하는 가이드입니다.
- **Default**: 태블릿부터 5개 컬럼 그리드
- **Compact**: 데스크톱부터만 5개 컬럼 그리드 (태블릿에서도 리스트 유지) ✨
- 페이지별 선택 적용 가능
- 다른 페이지에 영향 없음
- **위치**: `components/ui/card-status-summary.tsx`
- **사용처**: 키워드현황, 매출현황, 업무현황 등

### 차트 & 시각화

#### 15. [Chart.js 차트](./chart-guide.md)
Chart.js를 사용한 데이터 시각화 컴포넌트입니다.
- 라인 차트, 바 차트, 파이 차트 등
- 순차적 애니메이션 효과
- 전월 대비 증감률 자동 계산
- 하락 구간 점선 표시
- 세련된 툴팁 및 호버 효과
- **라이브러리**: `chart.js`, `react-chartjs-2`
- **사용처**: 매출현황, 성과현황, 대시보드 등

### 로딩 & 스켈레톤

#### 16. [DataTable 스켈레톤](./data-table-skeleton-example.md)
DataTable 컴포넌트에 스켈레톤 로딩 UI를 적용하는 가이드입니다.
- DataTable 전용 스켈레톤
- `isLoading` prop으로 간단히 적용
- 자동 행/열 스켈레톤 생성
- **사용처**: 계약목록, 사용자목록 등 테이블 로딩

#### 17. [전체 페이지 스켈레톤](./full-page-skeleton-guide.md)
전체 페이지 레이아웃의 스켈레톤 UI를 적용하는 가이드입니다.
- 페이지 전체 스켈레톤
- 헤더, KPI, 차트, 테이블 등 모든 요소 지원
- 로딩 상태 관리
- API 데이터 로딩과 연동
- **위치**: `components/ui/skeleton.tsx`
- **사용처**: 매출현황, 성과현황 등 대시보드 페이지


### 복합 컴포넌트

#### 18. [ContractRegisterModal 컴포넌트](./contract-register-modal-guide.md)
계약 등록/수정을 위한 전체 모달 컴포넌트입니다.
- 4단계 등록 프로세스
- 폼 유효성 검사
- 임시저장 기능
- **위치**: `components/contract-register-modal.tsx`

## 🚀 빠른 시작

### 1. 컴포넌트 임포트
```tsx
import { FileUpload } from "@/components/ui/file-upload"
import { CustomDatePicker } from "@/components/ui/custom-datepicker"
import { showSuccessToast } from "@/lib/toast-utils"
```

### 2. 기본 사용
```tsx
// 파일 업로드
<FileUpload 
  accept=".pdf,.doc,.docx"
  onChange={(files) => console.log(files)}
/>

// 토스트 알림
showSuccessToast("저장되었습니다!")

// 얼럿창
<AlertConfirmModal
  isOpen={alertOpen}
  onClose={() => setAlertOpen(false)}
  onConfirm={() => console.log('확인')}
  showHeaderTitle={false}
  contentTitle="알림"
  message="작업이 완료되었습니다."
  confirmText="확인"
  showCancel={false}
  maxWidth="320px"
/>

// 날짜 선택
<CustomDatePicker
  selectRange={true}
  onRangeChange={(start, end) => console.log(start, end)}
/>

// 검색 필터 패널
<SearchFilterPanel
  searchTerm={searchTerm}
  onSearchTermChange={setSearchTerm}
  statusFilter={statusFilter}
  onStatusFilterChange={setStatusFilter}
  statusOptions={statusOptions}
  startDate={startDate}
  endDate={endDate}
  onDateRangeChange={(start, end) => {
    setStartDate(start)
    setEndDate(end)
  }}
  selectedPeriod={selectedPeriod}
  onPeriodChange={handleQuickDateSelect}
  onSearch={handleSearch}
  onReset={handleReset}
/>

// 데이터 테이블 (전체 기능)
<DataTable
  data={data}
  columns={columns}
  title="계약 목록"
  totalCount={data.length}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
  renderMobileCard={renderCard}
/>

// 모바일 데이터 테이블 (간단한 버전)
import { MobileDataTable, type MobileColumn } from "@/components/ui/mobile-data-table"

const columns: MobileColumn<Data>[] = [
  { key: 'name', label: '이름', align: 'left', mobileWidth: '100px' },
  { 
    key: 'value', 
    label: '금액', 
    align: 'right',
    mobileWidth: '120px',
    render: (item) => `₩${item.value.toLocaleString()}`
  }
]

<MobileDataTable
  data={data}
  columns={columns}
  isLoading={isLoading}
  showScrollHint={true}
/>

// 모바일 카드 리스트
import { MobileCardList } from "@/components/ui/mobile-data-table"

<MobileCardList
  data={contracts}
  renderCard={(contract) => [
    { label: "업체명", value: contract.company },
    { label: "금액", value: `₩${contract.amount.toLocaleString()}`, highlight: true }
  ]}
  onItemClick={(contract) => router.push(`/contract/${contract.id}`)}
/>

// 로딩 인디케이터
import LoadingBar from "@/components/ui/loading-bar"
import LoadingAnimation from "@/components/ui/loading-animation"

// 막대형 로딩
<LoadingBar message="데이터를 불러오는 중입니다" />

// 써클 로딩 (Lottie)
<LoadingAnimation 
  size={60}
  message="잠시만 기다려주세요"
  subMessage="이 작업은 최대 1분까지 소요될 수 있어요."
/>

// 이벤트 팝업 (이미지형)
import EventPopup from "@/components/ui/event-popup"

<EventPopup
  isOpen={popupOpen}
  onClose={() => setPopupOpen(false)}
  popupId="summer-event-2024"
  onButtonClick={() => {
    window.open("https://example.com/event", "_blank")
    setPopupOpen(false)
  }}
  backgroundImage="/event-popup.jpg"
  width="400px"
  height="600px"
/>

// 이벤트 팝업 (텍스트형)
<EventPopup
  isOpen={popupOpen}
  onClose={() => setPopupOpen(false)}
  popupId="notice-popup"
  title="여름 특별 이벤트"
  subtitle="최대 50% 할인"
  buttonText="이벤트 참여하기"
  onButtonClick={() => {
    window.location.href = "/event"
    setPopupOpen(false)
  }}
/>

// 공통 셀렉트박스 (레이블 있음)
import { LabeledSelect } from "@/components/ui/common-select"

<LabeledSelect
  label="연도:"
  value={selectedYear}
  onValueChange={setSelectedYear}
  options={[
    { value: "2024", label: "2024년" },
    { value: "2025", label: "2025년" }
  ]}
/>

// 공통 셀렉트박스 (레이블 없음)
import { CommonSelect } from "@/components/ui/common-select"

<CommonSelect
  value={sortFilter}
  onValueChange={setSortFilter}
  options={[
    { value: "newest", label: "최신순" },
    { value: "oldest", label: "오래된순" }
  ]}
/>

// Chart.js 차트
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const chartData = {
  labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
  datasets: [{
    label: '매출',
    data: [75000000, 78000000, 82000000, 85000000, 88000000, 91000000],
    borderColor: '#3b82f6',
    borderWidth: 4,
    tension: 0.4,
    pointRadius: 6,
  }]
}

<div className="w-full h-[400px]">
  <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
</div>

// 📱 모바일 최적화 (통합 가이드 참조: guides/mobile-guide.md)

// 1) 페이지 타이틀
import Header from "@/components/header"

<Header
  pageTitle="매출현황"
  pageDescription="월별 매출 현황 및 서비스별 분석"
  sidebarCollapsed={sidebarCollapsed}
  onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
/>

// 페이지 헤더 숨기기
<div className="hidden sm:block">
  <h1>매출현황</h1>
  <p>월별 매출 현황 및 서비스별 분석</p>
</div>

// 2) 반응형 데이터 표시 (모바일 카드 + 데스크톱 테이블)
import { MobileCardList, MobileDataTable } from "@/components/ui/mobile-data-table"

{/* 모바일: 카드 */}
<div className="block sm:hidden">
  <MobileCardList
    data={data}
    renderCard={(item) => [
      { label: '이름', value: item.name },
      { label: '금액', value: formatCurrency(item.amount), highlight: true }
    ]}
  />
</div>

{/* 데스크톱: 테이블 */}
<div className="hidden sm:block">
  <MobileDataTable
    data={data}
    columns={[
      { key: 'name', label: '이름', align: 'center' },
      { key: 'amount', label: '금액', align: 'right' }
    ]}
  />
</div>

// 3) KPI 카드 최적화
import { Card, CardContent } from "@/components/ui/card"

<Card className="py-2 sm:py-3">
  <CardContent className="px-2 sm:px-3">
    <p className="text-[9px] sm:text-sm">라벨</p>
    <p className="text-xs sm:text-xl font-bold">값</p>
  </CardContent>
</Card>
```

## 📁 프로젝트 구조

```
AGOFFICE/
├── components/
│   ├── ui/                      # UI 공통 컴포넌트
│   │   ├── file-upload.tsx      # 파일 업로드
│   │   ├── custom-datepicker.tsx
│   │   ├── toast.tsx
│   │   ├── alert-confirm-modal.tsx
│   │   ├── loading-modal.tsx
│   │   ├── loading-bar.tsx      # 막대형 로딩
│   │   ├── loading-animation.tsx # 써클 로딩 (Lottie)
│   │   ├── event-popup.tsx      # 이벤트 팝업
│   │   ├── common-select.tsx    # 공통 셀렉트박스
│   │   ├── step-indicator.tsx
│   │   ├── step-navigation.tsx
│   │   ├── search-filter-panel.tsx
│   │   └── data-table.tsx
│   ├── contract-register-modal.tsx
│   ├── scroll-modal.tsx
│   └── ...
├── guides/                      # 가이드 문서
│   ├── README.md               # 이 파일
│   ├── file-upload-guide.md
│   ├── loading-bar-guide.md
│   ├── loading-animation-guide.md
│   └── ...
├── public/
│   └── icons/
│       └── Loader-animation.lottie  # Lottie 애니메이션 파일
└── lib/
    └── toast-utils.ts          # Toast 유틸리티

```

## 💡 컨벤션

### 파일명
- 컴포넌트: `kebab-case.tsx` (예: `file-upload.tsx`)
- 가이드: `kebab-case-guide.md` (예: `file-upload-guide.md`)

### 컴포넌트 작성 규칙
1. Props 인터페이스는 컴포넌트명 + `Props` (예: `FileUploadProps`)
2. 모든 props에 JSDoc 주석 작성
3. `"use client"` 디렉티브 필요 시 상단에 명시
4. 기본값은 props 디스트럭처링에서 설정

### 가이드 문서 작성 규칙
1. 개요 및 주요 기능
2. 설치 및 임포트
3. 기본 사용법
4. Props API 테이블
5. 고급 사용 예제
6. 주의사항
7. 트러블슈팅

## 🔧 개발 가이드

### 새로운 공통 컴포넌트 추가하기

1. **컴포넌트 생성**
   ```bash
   # components/ui/ 또는 components/에 파일 생성
   components/ui/your-component.tsx
   ```

2. **가이드 문서 작성**
   ```bash
   guides/your-component-guide.md
   ```

3. **이 README 업데이트**
   - 가이드 목록에 추가
   - 간단한 설명 포함

4. **사용 예제 작성**
   - 실제 프로젝트에서 사용하는 패턴 문서화

## 🐛 문제 해결

### 일반적인 문제

1. **임포트 오류**
   - `@/` 경로가 올바른지 확인
   - `tsconfig.json`의 paths 설정 확인

2. **스타일 적용 안 됨**
   - Tailwind CSS 클래스가 올바른지 확인
   - `globals.css`가 임포트되었는지 확인

3. **타입 오류**
   - Props 인터페이스 확인
   - 필수/선택 props 구분

## 📞 지원

문제가 발생하거나 개선 사항이 있다면:
1. 해당 컴포넌트의 가이드 문서 확인
2. 트러블슈팅 섹션 참조
3. 코드 리뷰 요청

## 📝 업데이트 이력

- **2025-10-23**: StatusSummaryCards 반응형 가이드 추가 (variant prop으로 페이지별 선택 적용)
- **2025-10-19**: 모바일 가로스크롤 문제 해결 가이드 추가
- **2025-10-18**: Chart.js 차트 가이드 추가
- **2025-10-17**: 모바일 가이드 통합 (페이지 타이틀 + 데이터 표시 + KPI 최적화를 1개 가이드로 통합)
- **2025-10-17**: MobileCardList 컴포넌트 가이드 추가
- **2025-10-17**: MobileDataTable (모바일 최적화 테이블) 컴포넌트 및 가이드 추가
- **2025-10-17**: 모바일 페이지 타이틀 패턴 가이드 추가
- **2025-10-17**: CommonSelect (공통 셀렉트박스) 컴포넌트 및 가이드 추가
- **2025-10-13**: EventPopup (이벤트 팝업) 컴포넌트 및 가이드 추가
- **2025-10-12**: AlertConfirmModal 컴포넌트 및 가이드 파일명 변경 (delete-confirm-modal → alert-confirm-modal)
- **2025-10-12**: DeleteConfirmModal 가이드 업데이트 (얼럿창 사용법 추가, Dialog 기반으로 변경)
- **2025-10-12**: LoadingAnimation (Lottie 써클 로딩) 컴포넌트 및 가이드 추가
- **2025-10-12**: LoadingBar 가이드 업데이트 (그라데이션 효과)
- **2025-10-10**: DataTable 컴포넌트 및 가이드 추가
- **2025-10-10**: SearchFilterPanel 컴포넌트 및 가이드 추가
- **2025-10-10**: FileUpload 컴포넌트 및 가이드 추가
- **2025-01-XX**: 초기 가이드 시스템 구축

---

**유지보수**: 새로운 컴포넌트를 추가할 때마다 이 README를 업데이트해주세요.

