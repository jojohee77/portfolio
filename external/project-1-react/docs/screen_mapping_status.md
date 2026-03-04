# 현황 추적 화면 매핑

## 문서 정보
- **작성일**: 2025-11-11
- **대상 화면**: 포스팅 현황, 키워드 현황, 매출 현황, 성과 현황, 블로그 순위추적
- **우선순위**: High (핵심 분석 기능)

---

## 1. 포스팅 현황 화면 (/status/posting)

### 1.1 화면 개요

**목적**: 블로그 포스팅의 검색 순위 추적 및 관리

**주요 기능**:
- 포스팅별 현재 순위 및 순위 변동 추적
- 신규 포스팅 vs 재작업 포스팅 구분
- 키워드별 그룹핑
- 30일 순위 이력 차트
- 즐겨찾기 기능

---

### 1.2 데이터 매핑 - 포스팅 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | 필수 | 검색 | 정렬 | 인덱스 | 비고 |
|-------------|-------------|--------|------|------|------|------|--------|------|
| **블로그 URL** | Posting | blog_url | String(500) | ✓ | ✓ | - | ✓ | UNIQUE, 클릭 가능 링크 |
| **고객명** | Customer | company_name | String(100) | ✓ | ✓ | ✓ | ✓ | FK: customers.id |
| **제목** | Posting | title | String(200) | ✓ | ✓ | ✓ | - | 포스팅 제목 |
| **키워드** | Posting | keyword | String(100) | ✓ | ✓ | ✓ | ✓ | 검색 대상 키워드 |
| **담당자** | User | name | String(50) | ✓ | ✓ | ✓ | ✓ | FK: users.id (manager) |
| **현재 순위** | Posting | current_rank | Int | - | - | ✓ | ✓ | 1-100, NULL 가능 (순위권 밖) |
| **순위 변동** | Posting | rank_change | Int | - | - | ✓ | - | 계산 필드: current_rank - previous_rank |
| **등록일** | Posting | registered_date | Date | ✓ | ✓ | ✓ | ✓ | |
| **최종 확인일** | Posting | last_checked | DateTime | - | - | ✓ | ✓ | 순위 마지막 체크 시간 |
| **팀명** | Team | name | String(50) | ✓ | ✓ | ✓ | ✓ | FK: teams.id |
| **카테고리** | Posting | category | Enum | ✓ | ✓ | ✓ | ✓ | 신규, 재작업 |
| **목표 순위** | Posting | contract_threshold | Int | - | - | - | - | 계약상 목표 순위 (예: 5위) |
| **즐겨찾기** | Posting | is_favorite | Boolean | ✓ | ✓ | ✓ | ✓ | 기본값: false |
| **원본 포스팅 ID** | Posting | original_posting_id | UUID | - | - | - | ✓ | 재작업인 경우 원본 참조, FK: postings.id |
| **추적 상태** | Posting | is_tracking_active | Boolean | ✓ | ✓ | - | ✓ | 자동 순위 체크 활성화 여부 |
| **생성일시** | Posting | created_at | DateTime | ✓ | - | ✓ | ✓ | |
| **수정일시** | Posting | updated_at | DateTime | ✓ | - | ✓ | - | |

---

### 1.3 순위 이력 (Ranking History)

**저장 방식**: 별도 테이블 or JSON 필드

#### 옵션 1: 별도 테이블 (권장)

```
RankingHistory
├─ id (PK)
├─ posting_id (FK)
├─ checked_date (Date, UNIQUE with posting_id)
├─ rank (Int)
└─ created_at (DateTime)

복합 UNIQUE 인덱스: (posting_id, checked_date)
```

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| posting_id | UUID | ✓ | ✓ | FK: postings.id |
| checked_date | Date | ✓ | ✓ | YYYY-MM-DD |
| rank | Int | - | - | 1-100, NULL 가능 |
| created_at | DateTime | ✓ | ✓ | |

**쿼리 예시** (최근 30일):
```sql
SELECT checked_date, rank
FROM ranking_history
WHERE posting_id = :id
  AND checked_date >= CURDATE() - INTERVAL 30 DAY
ORDER BY checked_date ASC
```

#### 옵션 2: JSON 필드 (단순 구현)

```typescript
// Posting.ranking_history (JSON or JSONB)
[
  { "date": "2025-01-01", "rank": 15 },
  { "date": "2025-01-02", "rank": 12 },
  ...
]
```

**장점**: 단순, 빠른 조회
**단점**: 집계 쿼리 어려움, 인덱싱 불가

---

### 1.4 관계 (Relationships)

```
Posting (주)
├─ N:1 → Customer (고객) [customer_id]
├─ N:1 → User (담당자) [manager_id]
├─ N:1 → Team (팀) [team_id]
├─ N:1 → Posting (원본 포스팅) [original_posting_id] (Self-reference)
├─ N:1 → Keyword (키워드) [keyword_id] (옵션: keyword 컬럼을 String 대신 FK로)
└─ 1:N → RankingHistory (순위 이력)
```

**FK 제약조건**:
- `customer_id` ON DELETE RESTRICT
- `manager_id`, `team_id` ON DELETE SET NULL
- `original_posting_id` ON DELETE SET NULL (원본 삭제 시 재작업 포스팅은 유지)

---

### 1.5 필터/검색 요구사항

#### 1.5.1 검색 필드

| 검색 항목 | 매핑 필드 | 검색 방식 | 비고 |
|-----------|-----------|-----------|------|
| 통합 검색 | keyword, blog_url, customer.company_name, title | LIKE '%keyword%' (OR 조건) | 메인 검색창 |

#### 1.5.2 필터 조건

| 필터명 | 매핑 필드 | UI 컴포넌트 | 옵션 | 다중 선택 |
|--------|-----------|-------------|------|-----------|
| 고객 | Customer.id | 드롭다운 (검색 가능) | 전체 고객 목록 | ❌ |
| 팀 | Team.id | 드롭다운 | 전체 팀 목록 | ❌ |
| 담당자 | User.id (manager) | 드롭다운 | 팀 선택 시 해당 팀 멤버만 | ❌ |
| 카테고리 | Posting.category | 라디오 버튼 | 전체, 신규, 재작업 | ❌ |
| 즐겨찾기 | Posting.is_favorite | 체크박스 | 즐겨찾기만 보기 | ❌ |
| 순위 범위 | Posting.current_rank | 슬라이더 or 입력 | 예: 1-5위 (상위노출) | - |
| 날짜 범위 | Posting.registered_date or last_checked | DateRangePicker | 시작~종료 | - |

#### 1.5.3 빠른 필터 (Quick Filters)

| 버튼명 | 필터 조건 | 설명 |
|--------|-----------|------|
| 상위 노출 | `current_rank <= 5` | 1-5위 포스팅만 |
| 하위 노출 | `current_rank > contract_threshold` | 목표 순위 미달 |
| 순위 상승 | `rank_change < 0` | 순위가 올라간 포스팅 (숫자 감소) |
| 순위 하락 | `rank_change > 0` | 순위가 떨어진 포스팅 |
| 즐겨찾기 | `is_favorite = true` | 즐겨찾기 포스팅 |

#### 1.5.4 빠른 날짜 선택

| 버튼명 | 기간 | 계산 로직 |
|--------|------|-----------|
| 오늘 | 오늘 | TODAY |
| 1주일 | 최근 7일 | TODAY - 7 days ~ TODAY |
| 1개월 | 최근 30일 | TODAY - 30 days ~ TODAY |
| 3개월 | 최근 90일 | TODAY - 90 days ~ TODAY |
| 6개월 | 최근 180일 | TODAY - 180 days ~ TODAY |
| 1년 | 최근 365일 | TODAY - 365 days ~ TODAY |
| 전체 | 제한 없음 | NULL |

---

### 1.6 정렬 요구사항

| 컬럼명 | 정렬 가능 | 기본 정렬 | 정렬 방향 |
|--------|-----------|-----------|-----------|
| 고객명 | ✓ | - | ASC, DESC |
| 제목 | ✓ | - | ASC, DESC |
| 키워드 | ✓ | - | ASC, DESC |
| 담당자 | ✓ | - | ASC, DESC |
| 현재 순위 | ✓ | - | ASC, DESC (오름차순 = 상위 순위) |
| 순위 변동 | ✓ | - | ASC, DESC |
| 등록일 | ✓ | ✓ (DESC) | ASC, DESC |
| 최종 확인일 | ✓ | - | ASC, DESC |
| 팀명 | ✓ | - | ASC, DESC |
| 즐겨찾기 | ✓ | - | DESC (즐겨찾기 먼저) |

**기본 정렬**: `registered_date DESC` (최신 등록 순)
**2차 정렬** (옵션): `current_rank ASC` (같은 날짜면 순위 높은 것 우선)

---

### 1.7 상태 집계 (Status Summary Cards)

| 카드명 | 쿼리 | 표시 형식 |
|--------|------|-----------|
| 전체 | `SELECT COUNT(*) FROM postings WHERE ...` | 숫자 + "건" |
| 신규 | `... WHERE category = '신규'` | 숫자 + "건" |
| 재작업 | `... WHERE category = '재작업'` | 숫자 + "건" |
| 상위노출 | `... WHERE current_rank <= 5` | 숫자 + "건" |
| 하위노출 | `... WHERE current_rank > contract_threshold` | 숫자 + "건" |

**색상 가이드**:
- 상위노출: 초록색 (성공)
- 하위노출: 빨간색 (경고)
- 신규/재작업: 중립 색상

---

### 1.8 키워드별 그룹핑 (Grouping)

**UI**: 아코디언 형식 (키워드 > 포스팅 목록)

**그룹 헤더 데이터**:

| 표시 항목 | 쿼리 | 비고 |
|-----------|------|------|
| 키워드명 | `keyword` | 그룹 키 |
| 포스팅 수 | `COUNT(*)` | 해당 키워드의 총 포스팅 수 |
| 평균 순위 | `AVG(current_rank)` | NULL 제외 |
| 상위 노출 수 | `COUNT(*) WHERE rank <= 5` | 1-5위 포스팅 수 |

**정렬**: 키워드명 가나다순 or 포스팅 수 내림차순

**쿼리 예시**:
```sql
SELECT
  keyword,
  COUNT(*) AS posting_count,
  AVG(current_rank) AS avg_rank,
  SUM(CASE WHEN current_rank <= 5 THEN 1 ELSE 0 END) AS top5_count
FROM postings
WHERE ...
GROUP BY keyword
ORDER BY keyword ASC
```

---

### 1.9 CRUD 작업

#### 1.9.1 포스팅 등록 (Create)

**트리거**: "포스팅 등록" 버튼 클릭 → 모달 오픈

**입력 필드**:

| 필드명 | 필수 | 타입 | 검증 규칙 | 비고 |
|--------|------|------|-----------|------|
| 블로그 URL | ✓ | String(500) | URL 형식, UNIQUE | |
| 고객 선택 | ✓ | Autocomplete | 기존 고객만 | |
| 제목 | ✓ | String(200) | 2-200자 | |
| 키워드 | ✓ | Autocomplete | 기존 키워드 or 신규 입력 | |
| 팀 | ✓ | Select | DB에서 로드 | |
| 담당자 | ✓ | Select | 선택된 팀의 멤버만 | |
| 카테고리 | ✓ | Radio | 신규, 재작업 | 기본값: 신규 |
| 원본 포스팅 | - | Autocomplete | 카테고리=재작업인 경우 필수 | 같은 키워드의 포스팅만 |
| 목표 순위 | - | Number | 1-100 | 계약에서 자동 가져오기 or 수동 입력 |
| 현재 순위 | - | Number | 1-100 | 등록 시 수동 입력 or 자동 체크 |
| 등록일 | ✓ | Date | <= 오늘 | 기본값: 오늘 |
| 추적 상태 | ✓ | Toggle | 활성/비활성 | 기본값: 활성 |
| 즐겨찾기 | - | Checkbox | true/false | 기본값: false |

**저장 로직**:
1. 입력 검증 (URL 중복 체크 필수)
2. 키워드가 Keyword 테이블에 없으면 생성 (upsert)
3. Posting 레코드 생성
4. 현재 순위가 입력되었으면 RankingHistory 첫 레코드 생성
5. 트랜잭션 커밋
6. 성공 토스트 + 목록 리프레시

**API 엔드포인트**: `POST /api/postings`

---

#### 1.9.2 포스팅 상세 보기 (Read)

**트리거**: 테이블 행 클릭 → 상세 모달 오픈

**표시 데이터**:
- 포스팅 기본 정보 (모든 필드)
- 순위 이력 차트 (30일)
  - X축: 날짜
  - Y축: 순위 (역순: 1위가 위)
  - 목표 순위 기준선 (빨간 점선)
- 순위 변동 통계
  - 최고 순위
  - 최저 순위
  - 평균 순위
  - 30일 변동폭
- 원본 포스팅 정보 (재작업인 경우)
  - 원본 URL, 제목, 최종 순위
  - 링크: 원본 포스팅 상세로 이동
- 재작업 포스팅 목록 (이 포스팅이 원본인 경우)

**API 엔드포인트**: `GET /api/postings/:id`

**순위 이력 조회**:
```sql
SELECT checked_date, rank
FROM ranking_history
WHERE posting_id = :id
  AND checked_date >= CURDATE() - INTERVAL 30 DAY
ORDER BY checked_date ASC
```

---

#### 1.9.3 포스팅 수정 (Update)

**트리거**: 상세 모달 내 "수정" 버튼 → 편집 모드 전환

**수정 가능 필드**: 등록과 거의 동일

**수정 불가 필드**:
- 블로그 URL (중요: 변경 시 다른 포스팅으로 인식)
- 생성일시

**주의사항**:
- 현재 순위 수동 수정 시 RankingHistory에 새 레코드 추가 (오늘 날짜)
- 카테고리를 "재작업"으로 변경 시 원본 포스팅 선택 필수
- 원본 포스팅 변경 시 기존 관계 해제

**API 엔드포인트**: `PATCH /api/postings/:id`

---

#### 1.9.4 포스팅 삭제 (Delete)

**트리거**: 상세 모달 내 "삭제" 버튼 → 확인 다이얼로그

**확인 메시지**:
```
이 포스팅을 삭제하시겠습니까?
키워드: [키워드명]
블로그 URL: [URL]

순위 이력 X건도 함께 삭제됩니다.
[이 포스팅을 원본으로 하는 재작업 포스팅 Y건이 있습니다.]
이 작업은 되돌릴 수 없습니다.
```

**삭제 로직**:
1. 권한 확인 (Admin 또는 담당자만)
2. 재작업 포스팅 확인
   - 있으면: `original_posting_id = NULL` 처리 or 삭제 차단
3. 트랜잭션 시작
4. RankingHistory 삭제 (ON DELETE CASCADE)
5. Posting 삭제
6. 트랜잭션 커밋
7. 성공 토스트 + 목록으로 이동

**API 엔드포인트**: `DELETE /api/postings/:id`

---

#### 1.9.5 즐겨찾기 토글

**트리거**: 별 아이콘 클릭

**로직**:
```sql
UPDATE postings
SET is_favorite = NOT is_favorite
WHERE id = :id
```

**API 엔드포인트**: `PATCH /api/postings/:id/favorite`

**응답**: 새로운 `is_favorite` 값 반환

---

#### 1.9.6 URL 복사

**트리거**: URL 옆 복사 아이콘 클릭

**로직**: 클라이언트 사이드
```typescript
await navigator.clipboard.writeText(posting.blog_url);
toast.success('URL이 클립보드에 복사되었습니다.');
```

---

#### 1.9.7 순위 이력 차트 보기

**트리거**: "순위 추이" 버튼 클릭 → 차트 모달 오픈

**표시 데이터**:
- 30일 순위 추이 라인 차트
- 목표 순위 기준선
- 데이터 테이블 (날짜, 순위)

---

### 1.10 자동 순위 체크 (Background Job)

**요구사항**: 추적 활성화된 포스팅의 순위를 자동으로 주기적 체크

**구현 방안**:
1. **Cron Job** (권장)
   - 매일 새벽 3시 실행
   - 검색 API 호출 (Naver, Google)
   - 순위 파싱 및 RankingHistory 기록
   - `last_checked`, `current_rank`, `rank_change` 업데이트

2. **Queue System** (고급)
   - BullMQ, RabbitMQ 등 사용
   - API 호출 속도 제한 고려
   - 실패 시 재시도

**의사 코드**:
```typescript
// Cron: 매일 03:00
async function checkRankings() {
  const postings = await prisma.posting.findMany({
    where: { is_tracking_active: true }
  });

  for (const posting of postings) {
    try {
      const rank = await fetchRankFromSearchAPI(posting.keyword, posting.blog_url);
      const previous_rank = posting.current_rank;

      await prisma.$transaction([
        prisma.posting.update({
          where: { id: posting.id },
          data: {
            current_rank: rank,
            rank_change: rank ? rank - (previous_rank || rank) : null,
            last_checked: new Date()
          }
        }),
        prisma.rankingHistory.create({
          data: {
            posting_id: posting.id,
            checked_date: new Date(),
            rank: rank
          }
        })
      ]);
    } catch (error) {
      console.error(`Failed to check rank for posting ${posting.id}:`, error);
      // 에러 로그 기록, 알림 발송 등
    }
  }
}
```

---

### 1.11 성능 고려사항

#### 1.11.1 필수 인덱스

```sql
-- Posting 인덱스
CREATE INDEX idx_postings_keyword ON postings(keyword);
CREATE INDEX idx_postings_customer ON postings(customer_id);
CREATE INDEX idx_postings_manager ON postings(manager_id);
CREATE INDEX idx_postings_team ON postings(team_id);
CREATE INDEX idx_postings_category_rank ON postings(category, current_rank);
CREATE INDEX idx_postings_favorite ON postings(is_favorite);
CREATE INDEX idx_postings_registered ON postings(registered_date DESC);
CREATE UNIQUE INDEX idx_postings_url ON postings(blog_url);

-- RankingHistory 인덱스
CREATE INDEX idx_ranking_history_posting_date ON ranking_history(posting_id, checked_date DESC);
CREATE UNIQUE INDEX idx_ranking_history_unique ON ranking_history(posting_id, checked_date);
```

#### 1.11.2 N+1 문제 방지

```typescript
const postings = await prisma.posting.findMany({
  include: {
    customer: { select: { company_name: true } },
    manager: { select: { name: true } },
    team: { select: { name: true } },
    originalPosting: { select: { id: true, title: true, blog_url: true } }
  }
});
```

#### 1.11.3 대용량 데이터 처리

- **페이지네이션**: 필수 (기본 15개, 최대 100개)
- **가상 스크롤**: 100개 초과 시 고려
- **캐싱**: 집계 데이터는 Redis 캐시 (TTL: 5분)

---

### 1.12 데이터 검증 규칙 (Zod Schema)

```typescript
const PostingSchema = z.object({
  blog_url: z.string().url().max(500),
  customer_id: z.string().uuid(),
  title: z.string().min(2).max(200),
  keyword: z.string().min(1).max(100),
  manager_id: z.string().uuid(),
  team_id: z.string().uuid(),
  category: z.enum(['신규', '재작업']),
  original_posting_id: z.string().uuid().optional(),
  contract_threshold: z.number().int().min(1).max(100).optional(),
  current_rank: z.number().int().min(1).max(100).optional(),
  registered_date: z.date().max(new Date()),
  is_tracking_active: z.boolean().default(true),
  is_favorite: z.boolean().default(false),
}).refine((data) => {
  // 재작업인 경우 원본 포스팅 필수
  if (data.category === '재작업' && !data.original_posting_id) {
    return false;
  }
  return true;
}, {
  message: "재작업 포스팅은 원본 포스팅을 선택해야 합니다.",
  path: ["original_posting_id"],
});
```

---

## 2. 키워드 현황 화면 (/status/keywords)

### 2.1 화면 개요

**목적**: 키워드별 성과 집계 및 분석

**주요 기능**:
- 키워드별 포스팅 통계
- 상위 노출률 (Top 5, Top 1)
- 경쟁도 분석
- 키워드 상세 (포스팅 목록, 순위 이력)

---

### 2.2 데이터 매핑 - 키워드 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드/계산 | 타입 | 필수 | 검색 | 정렬 | 인덱스 | 비고 |
|-------------|-------------|-----------|------|------|------|------|--------|------|
| **키워드명** | Keyword | name | String(100) | ✓ | ✓ | ✓ | ✓ | UNIQUE |
| **총 포스팅 수** | - | COUNT(postings) | Int | - | - | ✓ | - | 집계 필드 |
| **재작업 수** | - | COUNT WHERE category='재작업' | Int | - | - | ✓ | - | |
| **상위 5% 비율** | - | (COUNT WHERE rank<=5) / total * 100 | Decimal | - | - | ✓ | - | % 표시 |
| **1위 비율** | - | (COUNT WHERE rank=1) / total * 100 | Decimal | - | - | ✓ | - | % 표시 |
| **경쟁도** | Keyword | competition_level | Enum | - | ✓ | ✓ | ✓ | 아주좋음, 좋음, 보통, 나쁨, 아주나쁨 |
| **평균 순위** | - | AVG(current_rank) | Decimal | - | - | ✓ | - | 소수점 1자리 |
| **최고 순위** | - | MIN(current_rank) | Int | - | - | ✓ | - | |
| **최저 순위** | - | MAX(current_rank) | Int | - | - | ✓ | - | |
| **고객 목록** | - | GROUP_CONCAT(DISTINCT customers) | String | - | ✓ | - | - | 쉼표 구분 |
| **추적 상태** | Keyword | is_tracking_active | Boolean | ✓ | ✓ | - | ✓ | |

**쿼리 예시**:
```sql
SELECT
  k.name AS keyword,
  COUNT(p.id) AS total_postings,
  SUM(CASE WHEN p.category = '재작업' THEN 1 ELSE 0 END) AS rework_count,
  ROUND(SUM(CASE WHEN p.current_rank <= 5 THEN 1 ELSE 0 END) * 100.0 / COUNT(p.id), 2) AS top5_rate,
  ROUND(SUM(CASE WHEN p.current_rank = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(p.id), 2) AS top1_rate,
  k.competition_level,
  ROUND(AVG(p.current_rank), 1) AS avg_rank,
  MIN(p.current_rank) AS best_rank,
  MAX(p.current_rank) AS worst_rank,
  GROUP_CONCAT(DISTINCT c.company_name SEPARATOR ', ') AS clients
FROM keywords k
LEFT JOIN postings p ON k.name = p.keyword
LEFT JOIN customers c ON p.customer_id = c.id
WHERE p.current_rank IS NOT NULL
GROUP BY k.id
ORDER BY total_postings DESC
```

---

### 2.3 키워드 상세 정보 (추가 필드)

**Keyword 테이블 추가 필드**:

| 필드명 | 타입 | 필수 | 비고 |
|--------|------|------|------|
| monthly_search_volume | Int | - | 월간 검색량 (Naver API) |
| monthly_post_volume | Int | - | 월간 발행량 (경쟁 지표) |
| blog_saturation | Decimal(5,2) | - | 블로그 포화도 (%) |
| is_target | Boolean | ✓ | 목표 키워드 여부, 기본값: false |
| created_at | DateTime | ✓ | |
| updated_at | DateTime | ✓ | |

---

### 2.4 관계 (Relationships)

```
Keyword (주)
├─ 1:N → Posting (포스팅) [keyword]
└─ 1:N → KeywordRankingHistory (키워드 전체 순위 이력) (옵션)
```

**주의**: Posting.keyword를 String으로 저장하는 경우, Keyword 테이블은 마스터 데이터로만 사용
**권장**: Posting.keyword_id (FK)로 정규화

---

### 2.5 필터/검색 요구사항

#### 2.5.1 검색 필드

| 검색 항목 | 매핑 필드 | 검색 방식 |
|-----------|-----------|-----------|
| 키워드명 | Keyword.name | LIKE '%keyword%' |
| 고객명 | Customer.company_name (JOIN) | LIKE '%keyword%' |

#### 2.5.2 필터 조건

| 필터명 | 매핑 필드 | UI 컴포넌트 | 옵션 |
|--------|-----------|-------------|------|
| 경쟁도 | Keyword.competition_level | 드롭다운 | 전체, 아주좋음, 좋음, 보통, 나쁨, 아주나쁨 |
| 고객 | Customer.id (JOIN) | 드롭다운 | 전체 고객 목록 |
| 목표 키워드 | Keyword.is_target | 체크박스 | 목표 키워드만 보기 |
| 추적 상태 | Keyword.is_tracking_active | 체크박스 | 추적 중인 키워드만 |

#### 2.5.3 빠른 필터

| 버튼명 | 필터 조건 | 설명 |
|--------|-----------|------|
| 상위 노출 우수 | `top5_rate >= 50` | 절반 이상 상위 5위 |
| 경쟁도 높음 | `competition_level IN ('나쁨', '아주나쁨')` | 어려운 키워드 |
| 재작업 많음 | `rework_count >= 3` | 재작업이 많은 키워드 |

---

### 2.6 정렬 요구사항

| 컬럼명 | 정렬 가능 | 기본 정렬 | 정렬 방향 |
|--------|-----------|-----------|-----------|
| 키워드명 | ✓ | - | ASC, DESC |
| 총 포스팅 수 | ✓ | ✓ (DESC) | ASC, DESC |
| 재작업 수 | ✓ | - | ASC, DESC |
| 상위 5% 비율 | ✓ | - | ASC, DESC |
| 1위 비율 | ✓ | - | ASC, DESC |
| 경쟁도 | ✓ | - | ASC, DESC |
| 평균 순위 | ✓ | - | ASC, DESC (오름차순 = 상위 순위) |
| 최고 순위 | ✓ | - | ASC, DESC |
| 최저 순위 | ✓ | - | ASC, DESC |

**기본 정렬**: `total_postings DESC` (포스팅 많은 순)

---

### 2.7 키워드 상세 모달

**트리거**: 테이블 행 클릭 → 상세 모달 오픈

**표시 데이터**:

#### 2.7.1 기본 정보
- 키워드명
- 경쟁도
- 월간 검색량
- 월간 발행량
- 블로그 포화도
- 추적 상태

#### 2.7.2 포스팅 목록 (Nested Table)

| 컬럼명 | 데이터 출처 |
|--------|-------------|
| 제목 | Posting.title |
| 고객 | Customer.company_name |
| 블로그 URL | Posting.blog_url (클릭 가능) |
| 등록일 | Posting.registered_date |
| 현재 순위 | Posting.current_rank |
| 카테고리 | Posting.category (신규/재작업) |
| 담당자 | User.name |
| 팀명 | Team.name |

**정렬**: 현재 순위 오름차순 (상위 순위 먼저)

**쿼리**:
```sql
SELECT p.*, c.company_name, u.name AS manager_name, t.name AS team_name
FROM postings p
JOIN customers c ON p.customer_id = c.id
JOIN users u ON p.manager_id = u.id
JOIN teams t ON p.team_id = t.id
WHERE p.keyword = :keywordName
ORDER BY p.current_rank ASC
```

#### 2.7.3 순위 이력 차트 (30일)

- X축: 날짜
- Y축: 평균 순위 (해당 키워드의 모든 포스팅 평균)
- 개별 포스팅 선택 시 해당 포스팅 순위 표시 (오버레이)

**쿼리**:
```sql
-- 키워드 전체 평균 순위 (30일)
SELECT
  rh.checked_date,
  AVG(rh.rank) AS avg_rank
FROM ranking_history rh
JOIN postings p ON rh.posting_id = p.id
WHERE p.keyword = :keywordName
  AND rh.checked_date >= CURDATE() - INTERVAL 30 DAY
GROUP BY rh.checked_date
ORDER BY rh.checked_date ASC
```

---

### 2.8 CRUD 작업

#### 2.8.1 키워드 추적 등록 (Create)

**트리거**: "키워드 추적 등록" 버튼 클릭 → 모달 오픈

**입력 필드**:

| 필드명 | 필수 | 타입 | 검증 규칙 |
|--------|------|------|-----------|
| 키워드명 | ✓ | String(100) | 2-100자, UNIQUE |
| 경쟁도 | - | Select | 아주좋음~아주나쁨 |
| 목표 키워드 | - | Checkbox | true/false |
| 추적 상태 | ✓ | Toggle | 활성/비활성, 기본값: 활성 |

**저장 로직**:
1. 입력 검증 (중복 체크)
2. Keyword 레코드 생성
3. 트랜잭션 커밋
4. 성공 토스트 + 목록 리프레시

**API 엔드포인트**: `POST /api/keywords`

---

#### 2.8.2 키워드 수정 (Update)

**트리거**: 상세 모달 내 "수정" 버튼

**수정 가능 필드**: 경쟁도, 목표 키워드, 추적 상태

**수정 불가 필드**: 키워드명 (PK 역할)

**API 엔드포인트**: `PATCH /api/keywords/:id`

---

#### 2.8.3 키워드 삭제 (Delete)

**주의**: 키워드 삭제 시 관련 포스팅의 `keyword` 필드 처리 필요
- Posting.keyword_id (FK)인 경우: FK 제약으로 삭제 차단 (권장)
- Posting.keyword (String)인 경우: Keyword 테이블 삭제 가능 (마스터 데이터만 삭제)

---

### 2.9 성능 고려사항

#### 2.9.1 필수 인덱스

```sql
-- Keyword 인덱스
CREATE UNIQUE INDEX idx_keywords_name ON keywords(name);
CREATE INDEX idx_keywords_competition ON keywords(competition_level);
CREATE INDEX idx_keywords_target ON keywords(is_target);
```

#### 2.9.2 집계 쿼리 최적화

**문제**: 키워드별 포스팅 집계는 매번 계산하면 느림

**해결**:
1. **Materialized View** (PostgreSQL)
   - 주기적으로 갱신 (매일 새벽)
   - 빠른 조회
2. **집계 테이블** (keyword_statistics)
   - 컬럼: keyword_id, total_postings, top5_rate, avg_rank, last_updated
   - Cron으로 매일 갱신
3. **Redis 캐시** (간단)
   - TTL: 1시간
   - 캐시 무효화: 포스팅 생성/수정/삭제 시

---

## 3. 매출 현황 화면 (/status/revenue)

### 3.1 화면 개요

**목적**: 서비스별/월별 매출 집계 및 분석

**주요 기능**:
- KPI 카드 (총 매출, 평균 매출, 계약 건수 등)
- 월별 매출 추이 차트 (막대 + 선 혼합)
- 서비스별 매출 테이블
- 계약 상세 목록 (모달)

---

### 3.2 데이터 매핑 - KPI 카드

| KPI 항목 | 매핑 엔티티/계산 | 쿼리 | 표시 형식 | 비교 |
|----------|------------------|------|-----------|------|
| **총 매출** | Revenue | SUM(total_revenue) WHERE year=:year | ₩ 1.2억원 | 전년 동기 대비 +15% |
| **월 평균 매출** | Revenue | AVG(total_revenue) WHERE year=:year AND month <= :currentMonth | ₩ 5,000만원 | 6개월 평균 |
| **계약 건수** | Revenue | SUM(contracts_count) WHERE year=:year | 120건 | 누적 |
| **포스팅 비용** | Revenue | SUM(posting_cost) WHERE year=:year | ₩ 3,000만원 | 총합 |
| **평균 계약단가** | Revenue | SUM(total_revenue) / SUM(contracts_count) | ₩ 100만원 | 평균 |

**전년 대비 계산**:
```sql
SELECT
  SUM(total_revenue) AS current_year_revenue,
  (
    SELECT SUM(total_revenue)
    FROM revenue
    WHERE year = :year - 1 AND month <= :currentMonth
  ) AS previous_year_revenue
FROM revenue
WHERE year = :year AND month <= :currentMonth
```

---

### 3.3 데이터 매핑 - 월별 매출 차트

**차트 타입**: 혼합 (막대 + 선)
- 막대: 월별 매출
- 선: 포스팅 비용

| 데이터 항목 | 매핑 엔티티 | 필드 | 집계 |
|-------------|-------------|------|------|
| 월 (X축) | Revenue | month | 1-12 |
| 월별 매출 (Y축 왼쪽) | Revenue | total_revenue | SUM BY month |
| 포스팅 비용 (Y축 오른쪽) | Revenue | posting_cost | SUM BY month |

**쿼리**:
```sql
SELECT
  month,
  SUM(total_revenue) AS monthly_revenue,
  SUM(posting_cost) AS monthly_posting_cost
FROM revenue
WHERE year = :year
  AND (half IS NULL OR half = :half)  -- 상반기/하반기 필터
GROUP BY month
ORDER BY month ASC
```

---

### 3.4 데이터 매핑 - 서비스별 매출 테이블

| 컬럼명 | 매핑 엔티티 | 필드/계산 | 타입 | 정렬 | 비고 |
|--------|-------------|-----------|------|------|------|
| **서비스명** | Revenue | service_name | String | ✓ | SEO, 프리미엄, 하나탑 |
| **계약 매출 (총)** | Revenue | total_contract_revenue | Decimal | ✓ | 계약 금액 총합 |
| **월 매출** | Revenue | monthly_revenue | Decimal | ✓ | 선택된 월의 매출 |
| **평균 포스팅 단가** | Revenue | avg_posting_cost | Decimal | ✓ | posting_cost / posting_count |
| **평균 계약 단가** | Revenue | avg_contract_value | Decimal | ✓ | total_revenue / contracts_count |
| **계약 건수** | Revenue | contracts_count | Int | ✓ | 클릭 시 상세 모달 |
| **매출 비율** | - | (service_revenue / total_revenue) * 100 | Decimal | ✓ | % 표시 |

**쿼리**:
```sql
SELECT
  service_name,
  SUM(total_revenue) AS total_contract_revenue,
  SUM(CASE WHEN month = :selectedMonth THEN total_revenue ELSE 0 END) AS monthly_revenue,
  AVG(posting_cost / NULLIF(posting_count, 0)) AS avg_posting_cost,
  AVG(total_revenue / NULLIF(contracts_count, 0)) AS avg_contract_value,
  SUM(contracts_count) AS contracts_count,
  ROUND(SUM(total_revenue) * 100.0 / (SELECT SUM(total_revenue) FROM revenue WHERE year = :year), 2) AS revenue_percentage
FROM revenue
WHERE year = :year
GROUP BY service_name
ORDER BY total_contract_revenue DESC
```

**주의**: `service_name`이 Revenue 테이블에 없는 경우, Contract 테이블에서 집계 필요

---

### 3.5 데이터 스키마 - Revenue 테이블

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | UUID | ✓ | PK | |
| year | Int | ✓ | ✓ | 2024, 2025, ... |
| half | Enum | - | ✓ | '상반기', '하반기', NULL (전체) |
| month | Int | ✓ | ✓ | 1-12 |
| service_name | String(50) | ✓ | ✓ | SEO, 프리미엄, 하나탑 |
| team_id | UUID | - | ✓ | FK: teams.id (팀별 집계용) |
| total_revenue | Decimal(15,2) | ✓ | - | 총 매출 |
| contracts_count | Int | ✓ | - | 계약 건수 |
| posting_cost | Decimal(15,2) | - | - | 포스팅 비용 |
| posting_count | Int | - | - | 포스팅 건수 |
| avg_contract_value | Decimal(15,2) | - | - | 평균 계약 단가 (계산 필드) |
| created_at | DateTime | ✓ | ✓ | |
| updated_at | DateTime | ✓ | - | |

**복합 UNIQUE 인덱스**: `(year, month, service_name, team_id)`

---

### 3.6 필터/검색 요구사항

| 필터명 | UI 컴포넌트 | 옵션 | 기본값 |
|--------|-------------|------|--------|
| 연도 | 드롭다운 | 2024, 2025, ... | 현재 연도 |
| 반기 | 토글 버튼 | 전체, 상반기, 하반기 | 전체 |
| 월 선택 | 버튼 그룹 | 1월~12월, 상반기 전체, 하반기 전체 | 현재 월 |

**상반기**: 1-6월
**하반기**: 7-12월

---

### 3.7 계약 상세 모달

**트리거**: 서비스별 매출 테이블의 "계약 건수" 클릭

**표시 데이터**: 해당 서비스/연도/월의 계약 목록

| 컬럼명 | 데이터 출처 |
|--------|-------------|
| 업체명 | Customer.company_name |
| 서비스 | Contract.services (배지) |
| 계약 기간 | Contract.start_date ~ end_date |
| 계약 금액 | Contract.amount |
| 상태 | - | 진행중, 완료 (end_date 기준) |

**쿼리**:
```sql
SELECT c.*, cust.company_name
FROM contracts c
JOIN customers cust ON c.customer_id = cust.id
WHERE :serviceName = ANY(c.services)
  AND YEAR(c.start_date) = :year
  AND MONTH(c.start_date) = :month
ORDER BY c.amount DESC
```

---

### 3.8 CSV 다운로드

**트리거**: "CSV 다운로드" 버튼 클릭

**파일명**: `매출현황_{연도}_{월}.csv`

**포함 데이터**: 서비스별 매출 테이블 전체

**컬럼**: 서비스명, 계약 매출 (총), 월 매출, 평균 포스팅 단가, 평균 계약 단가, 계약 건수, 매출 비율

---

### 3.9 성능 고려사항

#### 3.9.1 집계 테이블 방식 (권장)

**문제**: 매번 Contract 테이블에서 집계하면 느림

**해결**: Revenue 집계 테이블 미리 계산
- **Cron**: 매일 새벽 실행
- **트리거**: Contract 생성/수정/삭제 시 Revenue 업데이트

**집계 로직** (의사 코드):
```typescript
// 매일 새벽 실행
async function aggregateRevenue() {
  const year = new Date().getFullYear();

  for (let month = 1; month <= 12; month++) {
    for (const service of ['SEO', '프리미엄', '하나탑']) {
      const contracts = await prisma.contract.findMany({
        where: {
          services: { has: service },
          start_date: {
            gte: new Date(year, month - 1, 1),
            lt: new Date(year, month, 1)
          }
        }
      });

      const total_revenue = contracts.reduce((sum, c) => sum + c.amount, 0);
      const contracts_count = contracts.length;
      const posting_cost = contracts.reduce((sum, c) => sum + (c.ad_cost_monthly || 0), 0);

      await prisma.revenue.upsert({
        where: {
          year_month_service: { year, month, service_name: service }
        },
        update: { total_revenue, contracts_count, posting_cost },
        create: { year, month, service_name: service, total_revenue, contracts_count, posting_cost }
      });
    }
  }
}
```

#### 3.9.2 인덱스

```sql
CREATE INDEX idx_revenue_year_month ON revenue(year, month);
CREATE INDEX idx_revenue_service ON revenue(service_name);
CREATE UNIQUE INDEX idx_revenue_unique ON revenue(year, month, service_name, team_id);
```

---

## 4. 성과 현황 화면 (/status/performance)

### 4.1 화면 개요

**목적**: 팀별/개인별 성과 추적 및 비교

**주요 기능**:
- KPI 카드 (총 매출, 총 인원, 인당 매출 등)
- 팀 성과 비교 차트
- 팀별 성과 테이블
- 개인별 성과 테이블

---

### 4.2 데이터 매핑 - KPI 카드

| KPI 항목 | 계산 | 쿼리 | 표시 형식 |
|----------|------|------|-----------|
| **총 매출** | SUM(monthly_revenue) | 선택된 연도/반기 | ₩ 5.0억원 |
| **총 계약 매출** | SUM(monthly_revenue) WHERE team별 | 전체 팀 합계 | ₩ 5.0억원 |
| **총 인원** | COUNT(DISTINCT member_id) | 활성 멤버만 | 50명 |
| **평균 인당 매출** | 총 매출 / 총 인원 | 월별 | ₩ 1,000만원/월 |
| **평균 업체 수** | AVG(company_count) | 팀 평균 | 10개/팀 |

---

### 4.3 데이터 매핑 - 팀 성과 테이블

| 컬럼명 | 매핑 엔티티 | 필드/계산 | 타입 | 정렬 |
|--------|-------------|-----------|------|------|
| **팀명** | Team | name | String | ✓ |
| **월 매출** | Performance | SUM(monthly_revenue) BY team_id | Decimal | ✓ |
| **계약 건수** | Performance | SUM(contract_count) BY team_id | Int | ✓ |
| **인원** | - | COUNT(DISTINCT member_id) BY team_id | Int | ✓ |
| **인당 매출** | - | 월 매출 / 인원 | Decimal | ✓ |
| **업체 수** | Performance | SUM(company_count) BY team_id | Int | ✓ |

**쿼리**:
```sql
SELECT
  t.name AS team_name,
  SUM(p.monthly_revenue) AS total_revenue,
  SUM(p.contract_count) AS total_contracts,
  COUNT(DISTINCT p.member_id) AS member_count,
  SUM(p.monthly_revenue) / COUNT(DISTINCT p.member_id) AS revenue_per_member,
  SUM(p.company_count) AS total_companies
FROM performance p
JOIN teams t ON p.team_id = t.id
WHERE p.year = :year
  AND (:half IS NULL OR p.half = :half)
GROUP BY t.id
ORDER BY total_revenue DESC
```

---

### 4.4 데이터 매핑 - 개인 성과 테이블

| 컬럼명 | 매핑 엔티티 | 필드/계산 | 타입 | 정렬 |
|--------|-------------|-----------|------|------|
| **이름** | User | name | String | ✓ |
| **팀** | Team | name | String | ✓ |
| **월 매출** | Performance | monthly_revenue | Decimal | ✓ |
| **계약 건수** | Performance | contract_count | Int | ✓ |
| **업체 수** | Performance | company_count | Int | ✓ |

**쿼리**:
```sql
SELECT
  u.name AS member_name,
  t.name AS team_name,
  SUM(p.monthly_revenue) AS total_revenue,
  SUM(p.contract_count) AS total_contracts,
  SUM(p.company_count) AS total_companies
FROM performance p
JOIN users u ON p.member_id = u.id
JOIN teams t ON p.team_id = t.id
WHERE p.year = :year
  AND (:half IS NULL OR p.half = :half)
  AND (:teamId IS NULL OR p.team_id = :teamId)
GROUP BY u.id, t.id
ORDER BY total_revenue DESC
```

---

### 4.5 데이터 스키마 - Performance 테이블

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | UUID | ✓ | PK | |
| year | Int | ✓ | ✓ | 2024, 2025, ... |
| half | Enum | - | ✓ | '상반기', '하반기', NULL (전체) |
| month | Int | ✓ | ✓ | 1-12 |
| team_id | UUID | ✓ | ✓ | FK: teams.id |
| member_id | UUID | ✓ | ✓ | FK: users.id |
| monthly_revenue | Decimal(15,2) | ✓ | - | 월 매출 |
| contract_count | Int | ✓ | - | 계약 건수 |
| company_count | Int | ✓ | - | 담당 업체 수 |
| created_at | DateTime | ✓ | ✓ | |
| updated_at | DateTime | ✓ | - | |

**복합 UNIQUE 인덱스**: `(year, month, team_id, member_id)`

---

### 4.6 팀 비교 차트

**차트 타입**: 다중 선 그래프

| 데이터 항목 | 설명 |
|-------------|------|
| X축 | 월 (1-12) |
| Y축 | 선택된 지표 (월 매출, 계약 건수, 업체 수) |
| 선 (Series) | 각 팀 (최대 4개 팀 선택 가능) |

**쿼리**:
```sql
SELECT
  p.month,
  t.name AS team_name,
  SUM(p.monthly_revenue) AS value
FROM performance p
JOIN teams t ON p.team_id = t.id
WHERE p.year = :year
  AND p.team_id IN (:selectedTeamIds)
GROUP BY p.month, t.id
ORDER BY p.month ASC, t.name ASC
```

---

### 4.7 필터/검색 요구사항

| 필터명 | UI 컴포넌트 | 옵션 | 기본값 |
|--------|-------------|------|--------|
| 연도 | 드롭다운 | 2024, 2025, ... | 현재 연도 |
| 반기 | 토글 버튼 | 전체, 상반기, 하반기 | 전체 |
| 팀 선택 (차트용) | 다중 체크박스 | 1팀, 2팀, 3팀, 4팀 | 전체 선택 |
| 팀 필터 (개인 성과용) | 드롭다운 | 전체 팀 목록 | 전체 |
| 차트 지표 | 드롭다운 | 월 매출, 계약 건수, 업체 수 | 월 매출 |

---

### 4.8 성과 상세 모달

**트리거**: 팀/개인 성과 행 클릭

**표시 데이터**: 월별 상세 성과

| 컬럼명 | 데이터 출처 |
|--------|-------------|
| 월 | Performance.month |
| 매출 | Performance.monthly_revenue |
| 계약 건수 | Performance.contract_count |
| 업체 수 | Performance.company_count |

**쿼리**:
```sql
SELECT month, monthly_revenue, contract_count, company_count
FROM performance
WHERE year = :year
  AND team_id = :teamId
  AND member_id = :memberId
ORDER BY month ASC
```

---

### 4.9 성능 고려사항

#### 4.9.1 집계 테이블 방식 (권장)

Revenue 테이블과 마찬가지로 Performance 테이블을 미리 집계

**집계 로직** (의사 코드):
```typescript
async function aggregatePerformance() {
  const year = new Date().getFullYear();

  for (let month = 1; month <= 12; month++) {
    const contracts = await prisma.contract.findMany({
      where: {
        start_date: {
          gte: new Date(year, month - 1, 1),
          lt: new Date(year, month, 1)
        }
      },
      include: {
        team: true,
        manager: true
      }
    });

    // 팀별/개인별 집계
    const performanceMap = new Map();

    for (const contract of contracts) {
      const key = `${contract.team_id}_${contract.manager_id}`;
      if (!performanceMap.has(key)) {
        performanceMap.set(key, {
          team_id: contract.team_id,
          member_id: contract.manager_id,
          monthly_revenue: 0,
          contract_count: 0,
          companies: new Set()
        });
      }

      const perf = performanceMap.get(key);
      perf.monthly_revenue += contract.amount;
      perf.contract_count += 1;
      perf.companies.add(contract.customer_id);
    }

    // DB 저장
    for (const [key, perf] of performanceMap) {
      await prisma.performance.upsert({
        where: {
          year_month_team_member: {
            year, month,
            team_id: perf.team_id,
            member_id: perf.member_id
          }
        },
        update: {
          monthly_revenue: perf.monthly_revenue,
          contract_count: perf.contract_count,
          company_count: perf.companies.size
        },
        create: {
          year, month,
          team_id: perf.team_id,
          member_id: perf.member_id,
          monthly_revenue: perf.monthly_revenue,
          contract_count: perf.contract_count,
          company_count: perf.companies.size
        }
      });
    }
  }
}
```

#### 4.9.2 인덱스

```sql
CREATE INDEX idx_performance_year_month ON performance(year, month);
CREATE INDEX idx_performance_team ON performance(team_id);
CREATE INDEX idx_performance_member ON performance(member_id);
CREATE UNIQUE INDEX idx_performance_unique ON performance(year, month, team_id, member_id);
```

---

## 5. 블로그 순위추적 화면 (/status/blog-ranking)

### 5.1 화면 개요

**목적**: 일일 키워드 순위 모니터링 (간소화된 버전)

**주요 기능**:
- 오늘 추적 중인 키워드 목록
- 키워드별 고객 목록
- 키워드 상세 (포스팅 목록 + 30일 순위 차트)

---

### 5.2 데이터 매핑 - 일일 키워드 목록

| 컬럼명 | 매핑 엔티티 | 필드/계산 | 타입 | 검색 | 정렬 |
|--------|-------------|-----------|------|------|------|
| **키워드명** | Keyword | name | String | ✓ | ✓ |
| **관련 고객** | - | GROUP_CONCAT(DISTINCT customers) | String | ✓ | - |
| **최종 업데이트** | Posting | MAX(last_checked) | DateTime | - | ✓ |

**쿼리**:
```sql
SELECT
  k.name AS keyword,
  GROUP_CONCAT(DISTINCT c.company_name SEPARATOR ', ') AS clients,
  MAX(p.last_checked) AS last_updated
FROM keywords k
JOIN postings p ON k.name = p.keyword
JOIN customers c ON p.customer_id = c.id
WHERE k.is_tracking_active = true
  AND p.is_tracking_active = true
GROUP BY k.id
ORDER BY last_updated DESC
```

---

### 5.3 키워드 상세 모달

포스팅 현황 화면의 키워드 상세와 동일

---

### 5.4 필터/검색 요구사항

| 필터명 | UI 컴포넌트 | 옵션 |
|--------|-------------|------|
| 키워드 검색 | 검색창 | LIKE '%keyword%' |
| 날짜 범위 | DateRangePicker | 최종 업데이트 기준 |

---

### 5.5 추적 키워드 등록

포스팅 현황 화면의 키워드 추적 등록과 동일

---

## 6. 체크리스트

### 6.1 포스팅 현황

- [x] 테이블 컬럼 매핑 완료
- [x] 순위 이력 저장 방식 정의 (별도 테이블 권장)
- [x] 필터/검색 조건 명시
- [x] CRUD 작업 상세 기술
- [x] 자동 순위 체크 로직 정의
- [x] 성능 최적화 방안 제시

### 6.2 키워드 현황

- [x] 집계 필드 및 쿼리 정의
- [x] 키워드 상세 모달 구조 설계
- [x] 경쟁도 지표 정의
- [x] 집계 테이블/캐시 전략 제시

### 6.3 매출 현황

- [x] KPI 카드 계산 로직 정의
- [x] 서비스별 매출 집계 쿼리 작성
- [x] Revenue 집계 테이블 설계
- [x] CSV 다운로드 스펙 정의

### 6.4 성과 현황

- [x] 팀별/개인별 성과 집계 쿼리 작성
- [x] Performance 집계 테이블 설계
- [x] 차트 데이터 구조 정의
- [x] 집계 로직 구현 방안 제시

### 6.5 블로그 순위추적

- [x] 간소화된 화면 구조 정의
- [x] 키워드 현황과의 차이점 명시

---

## 7. 다음 단계

- ⏭️ 프로필 & 설정 화면 매핑 (`screen_mapping_profile_settings.md`)
- ⏭️ 핵심 엔티티 참조 문서 (`entities_reference.md`)
- ⏭️ ERD 설계 및 Prisma 스키마 작성

---

**작성 완료일**: 2025-11-11
