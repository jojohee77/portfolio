# 계약 & 업무 관리 화면 매핑

## 문서 정보
- **작성일**: 2025-11-11
- **대상 화면**: 계약 관리 (`/work/contract`), 업무 관리 (`/work/task`)
- **우선순위**: High (핵심 비즈니스 로직)

---

## 1. 계약 관리 화면 (/work/contract)

### 1.1 화면 개요

**목적**: 고객 계약의 전체 라이프사이클 관리 (등록, 조회, 수정, 삭제)

**주요 기능**:
- 계약 목록 조회 (테이블 형식)
- 다양한 필터/검색 조건
- 계약 상태별 집계 (신규, 연장, 확장)
- 계약 등록/수정/삭제
- 계약 상세 정보 보기

---

### 1.2 데이터 매핑 - 계약 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | 필수 | 검색 | 정렬 | 인덱스 | 비고 |
|-------------|-------------|--------|------|------|------|------|--------|------|
| **계약번호** | Contract | contract_number | String(20) | ✓ | ✓ | ✓ | ✓ | 형식: CT-YYYY-###, UNIQUE |
| **계약 유형** | Contract | contract_type | Enum | ✓ | ✓ | ✓ | ✓ | 월계약, 프로젝트, 연계약 |
| **상태** | Contract | status | Enum | ✓ | ✓ | ✓ | ✓ | 신규, 연장, 확장 |
| **등록일** | Contract | registration_date | Date | ✓ | ✓ | ✓ | ✓ | YYYY-MM-DD |
| **업체명** | Customer | company_name | String(100) | ✓ | ✓ | ✓ | ✓ | FK: customers.id |
| **담당자** | Customer | contact_person | String(50) | ✓ | ✓ | - | - | |
| **연락처** | Customer | phone | String(20) | ✓ | ✓ | - | - | 형식: 010-####-#### |
| **주소** | Customer | address | Text | - | ✓ | - | - | |
| **지역 (시도)** | Customer | region_sido | String(20) | - | ✓ | - | ✓ | 주소에서 파싱 또는 별도 저장 |
| **지역 (시군구)** | Customer | region_sigungu | String(50) | - | ✓ | - | ✓ | |
| **부서** | Team | department | String(50) | ✓ | ✓ | - | ✓ | FK: teams.id |
| **담당 매니저** | User | manager_name | String(50) | ✓ | ✓ | ✓ | ✓ | FK: users.id (role: manager) |
| **영업 담당자** | User | sales_rep_name | String(50) | ✓ | ✓ | ✓ | ✓ | FK: users.id (role: sales) |
| **서비스** | Contract | services | String[] | ✓ | ✓ | - | - | ['SEO', '프리미엄', '하나탑'] 다중 선택 |
| **계약 금액** | Contract | amount | Decimal(15,2) | ✓ | - | ✓ | ✓ | ₩ 단위, NOT NULL |
| **포스팅 건수** | Contract | posting_count | Int | - | - | ✓ | - | 계약에 포함된 포스팅 수 |
| **광고비 (총)** | Contract | ad_cost_total | Decimal(15,2) | - | - | ✓ | - | |
| **광고비 (월)** | Contract | ad_cost_monthly | Decimal(15,2) | - | - | ✓ | - | |
| **계약 기간 (시작)** | Contract | start_date | Date | ✓ | ✓ | ✓ | ✓ | |
| **계약 기간 (종료)** | Contract | end_date | Date | ✓ | ✓ | ✓ | ✓ | |
| **만료 여부** | Contract | is_expired | Boolean | ✓ | ✓ | - | ✓ | 계산 필드: end_date < TODAY |
| **생성일시** | Contract | created_at | DateTime | ✓ | - | ✓ | ✓ | |
| **수정일시** | Contract | updated_at | DateTime | ✓ | - | ✓ | - | |

---

### 1.3 관계 (Relationships)

```
Contract (주)
├─ 1:N → WorkTask (업무)
├─ N:1 → Customer (고객) [customer_id]
├─ N:1 → Team (팀) [team_id]
├─ N:1 → User (담당 매니저) [manager_id]
└─ N:1 → User (영업 담당자) [sales_rep_id]
```

**FK 제약조건**:
- `customer_id` ON DELETE RESTRICT (고객 삭제 시 계약 먼저 삭제 필요)
- `team_id` ON DELETE RESTRICT
- `manager_id`, `sales_rep_id` ON DELETE SET NULL (담당자 퇴사 시 NULL 처리)

---

### 1.4 필터/검색 요구사항

#### 1.4.1 검색 필드

| 검색 항목 | 매핑 필드 | 검색 방식 | 비고 |
|-----------|-----------|-----------|------|
| 통합 검색 | company_name, contact_person, contract_number | LIKE '%keyword%' (OR 조건) | 메인 검색창 |
| 업체명 | Customer.company_name | LIKE '%keyword%' | |
| 담당자 | Customer.contact_person | LIKE '%keyword%' | |
| 계약번호 | Contract.contract_number | LIKE 'keyword%' | 앞부분 일치 |

#### 1.4.2 필터 조건

| 필터명 | 매핑 필드 | UI 컴포넌트 | 옵션 | 다중 선택 |
|--------|-----------|-------------|------|-----------|
| 상태 | Contract.status | 드롭다운 | 전체, 신규, 연장, 확장 | ❌ |
| 계약 유형 | Contract.contract_type | 드롭다운 | 전체, 월계약, 프로젝트, 연계약 | ❌ |
| 날짜 기준 | - | 라디오 버튼 | 등록일, 시작일, 종료일 | ❌ |
| 날짜 범위 | registration_date / start_date / end_date | DateRangePicker | 시작~종료 | - |
| 지역 (시도) | Customer.region_sido | 드롭다운 | 서울, 경기, 부산, 대구, 인천... | ❌ |
| 지역 (시군구) | Customer.region_sigungu | 드롭다운 (동적) | 시도 선택 시 로드 | ❌ |
| 부서/팀 | Team.id | 드롭다운 | 전체 팀 목록 | ❌ |
| 담당 매니저 | User.id (manager) | 드롭다운 | 팀 선택 시 해당 팀 매니저만 | ❌ |
| 영업 담당자 | User.id (sales) | 드롭다운 | 전체 영업 담당자 | ❌ |
| 만료 여부 | Contract.is_expired | 체크박스 | 만료된 계약만 보기 | ❌ |

#### 1.4.3 빠른 날짜 선택 (Quick Date Filters)

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

### 1.5 정렬 요구사항

| 컬럼명 | 정렬 가능 | 기본 정렬 | 정렬 방향 |
|--------|-----------|-----------|-----------|
| 계약번호 | ✓ | - | ASC, DESC |
| 상태 | ✓ | - | ASC, DESC |
| 등록일 | ✓ | ✓ (DESC) | ASC, DESC |
| 업체명 | ✓ | - | ASC, DESC |
| 담당 매니저 | ✓ | - | ASC, DESC |
| 영업 담당자 | ✓ | - | ASC, DESC |
| 계약 금액 | ✓ | - | ASC, DESC |
| 시작일 | ✓ | - | ASC, DESC |
| 종료일 | ✓ | - | ASC, DESC |

**기본 정렬**: `registration_date DESC` (최신 등록 순)

---

### 1.6 상태 집계 (Status Summary Cards)

| 카드명 | 쿼리 | 표시 형식 |
|--------|------|-----------|
| 전체 | `SELECT COUNT(*) FROM contracts` | 숫자 + "건" |
| 신규 | `SELECT COUNT(*) FROM contracts WHERE status = '신규'` | 숫자 + "건" |
| 연장 | `SELECT COUNT(*) FROM contracts WHERE status = '연장'` | 숫자 + "건" |
| 확장 | `SELECT COUNT(*) FROM contracts WHERE status = '확장'` | 숫자 + "건" |

**주의사항**: 필터 적용 시 카드도 함께 업데이트 (전체가 아닌 필터링된 결과의 상태별 집계)

---

### 1.7 CRUD 작업

#### 1.7.1 계약 등록 (Create)

**트리거**: "계약 등록" 버튼 클릭 → 모달 오픈

**입력 필드**:

| 필드명 | 필수 | 타입 | 검증 규칙 | 비고 |
|--------|------|------|-----------|------|
| 계약번호 | ✓ | String | 자동 생성 (CT-YYYY-###) | 읽기 전용 or 수동 입력 선택 |
| 계약 유형 | ✓ | Select | 월계약, 프로젝트, 연계약 | |
| 상태 | ✓ | Select | 신규, 연장, 확장 | 기본값: 신규 |
| 업체명 | ✓ | Autocomplete | 기존 고객 검색 or 신규 입력 | 신규 시 Customer 생성 |
| 담당자 | ✓ | String | 2-50자 | |
| 연락처 | ✓ | String | 정규식: 010-####-#### | |
| 주소 | - | Text | - | 주소 API 활용 권장 |
| 부서/팀 | ✓ | Select | DB에서 로드 | |
| 담당 매니저 | ✓ | Select | 선택된 팀의 매니저만 | |
| 영업 담당자 | ✓ | Select | 전체 영업 담당자 | |
| 서비스 | ✓ | Multi-Checkbox | SEO, 프리미엄, 하나탑 (최소 1개) | |
| 계약 금액 | ✓ | Number | >= 0, 최대 9999억 | 단위: 원 |
| 포스팅 건수 | - | Number | >= 0 | |
| 광고비 (총) | - | Number | >= 0 | |
| 광고비 (월) | - | Number | >= 0 | |
| 계약 시작일 | ✓ | Date | >= 오늘 or 과거 허용 | |
| 계약 종료일 | ✓ | Date | > 시작일 | |
| 첨부 파일 | - | File | PDF, DOCX, 최대 10MB | 계약서 스캔본 |

**저장 로직**:
1. 입력 검증 (Zod 스키마)
2. 업체명으로 Customer 검색 → 없으면 신규 생성
3. Contract 레코드 생성
4. `is_expired` 계산 (end_date < today)
5. 트랜잭션 커밋
6. 성공 토스트 + 목록 리프레시

**API 엔드포인트**: `POST /api/contracts`

---

#### 1.7.2 계약 상세 보기 (Read)

**트리거**: 테이블 행 클릭 → 상세 모달 오픈

**표시 데이터**:
- 계약 기본 정보 (모든 필드)
- 관련 업무 목록 (WorkTask 테이블 연동)
  - 업무 ID, 서비스 타입, 담당자, 상태, 기간
  - 링크: 업무 관리 페이지로 이동
- 계약 이력 (변경 로그)
  - 변경 일시, 변경자, 변경 내용
- 첨부 파일 다운로드 링크

**API 엔드포인트**: `GET /api/contracts/:id`

---

#### 1.7.3 계약 수정 (Update)

**트리거**: 상세 모달 내 "수정" 버튼 → 편집 모드 전환

**수정 가능 필드**: 등록과 동일 (계약번호 제외)

**수정 불가 필드**:
- 계약번호 (읽기 전용)
- 생성일시 (자동)

**저장 로직**:
1. 입력 검증
2. 변경 감지 (dirty check)
3. Contract 레코드 업데이트
4. 변경 로그 기록 (ChangeLog 테이블)
5. `updated_at` 자동 갱신
6. 트랜잭션 커밋
7. 성공 토스트 + 상세 모달 리프레시

**API 엔드포인트**: `PATCH /api/contracts/:id`

---

#### 1.7.4 계약 삭제 (Delete)

**트리거**: 상세 모달 내 "삭제" 버튼 → 확인 다이얼로그

**확인 메시지**:
```
이 계약을 삭제하시겠습니까?
계약번호: CT-2025-001
업체명: (주)가나다라

관련된 업무 X건도 함께 삭제됩니다.
이 작업은 되돌릴 수 없습니다.
```

**삭제 로직**:
1. 권한 확인 (Admin 또는 계약 생성자만)
2. 관련 WorkTask 존재 확인
   - 있으면: 경고 표시 + 연쇄 삭제 동의 필요
   - 없으면: 바로 삭제
3. 트랜잭션 시작
4. WorkTask 삭제 (ON DELETE CASCADE)
5. Contract 삭제
6. 트랜잭션 커밋
7. 성공 토스트 + 목록으로 이동

**API 엔드포인트**: `DELETE /api/contracts/:id`

**대안 (Soft Delete)**:
- `deleted_at` 필드 추가
- 실제 삭제 대신 `deleted_at = NOW()` 설정
- 조회 시 `WHERE deleted_at IS NULL` 필터 추가

---

### 1.8 성능 고려사항

#### 1.8.1 필수 인덱스

```sql
-- 복합 인덱스 (검색 + 정렬 최적화)
CREATE INDEX idx_contracts_status_regdate ON contracts(status, registration_date DESC);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX idx_contracts_customer ON contracts(customer_id);
CREATE INDEX idx_contracts_team_manager ON contracts(team_id, manager_id);

-- 전체 텍스트 검색 (옵션)
CREATE FULLTEXT INDEX idx_contracts_search ON contracts(contract_number, notes);
```

#### 1.8.2 N+1 문제 방지

**문제 상황**: 계약 목록 조회 시 각 계약마다 Customer, Team, User를 별도 쿼리

**해결**:
```typescript
// Prisma include 사용
const contracts = await prisma.contract.findMany({
  include: {
    customer: {
      select: { company_name: true, contact_person: true, phone: true }
    },
    team: {
      select: { name: true, department: true }
    },
    manager: {
      select: { name: true, email: true }
    },
    salesRep: {
      select: { name: true }
    }
  }
});
```

**쿼리 수**: N+1 → 1 (단일 JOIN 쿼리)

---

### 1.9 데이터 검증 규칙 (Zod Schema)

```typescript
const ContractSchema = z.object({
  contract_number: z.string().regex(/^CT-\d{4}-\d{3}$/),
  contract_type: z.enum(['월계약', '프로젝트', '연계약']),
  status: z.enum(['신규', '연장', '확장']),
  customer_id: z.string().uuid(),
  team_id: z.string().uuid(),
  manager_id: z.string().uuid(),
  sales_rep_id: z.string().uuid(),
  services: z.array(z.enum(['SEO', '프리미엄', '하나탑'])).min(1),
  amount: z.number().nonnegative().max(999999999999.99),
  posting_count: z.number().int().nonnegative().optional(),
  ad_cost_total: z.number().nonnegative().optional(),
  ad_cost_monthly: z.number().nonnegative().optional(),
  start_date: z.date(),
  end_date: z.date(),
  registration_date: z.date().default(() => new Date()),
}).refine((data) => data.end_date > data.start_date, {
  message: "종료일은 시작일보다 이후여야 합니다.",
  path: ["end_date"],
});
```

---

## 2. 업무 관리 화면 (/work/task)

### 2.1 화면 개요

**목적**: 계약에 연결된 업무(Task) 및 키워드 할당 관리

**주요 기능**:
- 업무 목록 조회 (전체업무 / 내업무 탭)
- 키워드별 담당자 할당
- 업무 상태 관리 (진행중, 완료, 대기, 보류)
- 업무별 포스팅 현황 조회

---

### 2.2 데이터 매핑 - 업무 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | 필수 | 검색 | 정렬 | 인덱스 | 비고 |
|-------------|-------------|--------|------|------|------|------|--------|------|
| **계약번호** | Contract | contract_number | String(20) | ✓ | ✓ | ✓ | ✓ | FK: contracts.id |
| **서비스 유형** | WorkTask | service_type | String(50) | ✓ | ✓ | ✓ | ✓ | SEO 최적화, SNS 마케팅, 블로그 마케팅 등 |
| **계약 설명** | WorkTask | description | Text | - | ✓ | - | - | 업무 상세 설명 |
| **팀** | Team | name | String(50) | ✓ | ✓ | ✓ | ✓ | FK: teams.id |
| **담당자** | User | name | String(50) | ✓ | ✓ | ✓ | ✓ | FK: users.id (assignee) |
| **목표 키워드** | WorkTask | target_keywords | Text | - | ✓ | - | - | 쉼표 구분 or JSON 배열 |
| **키워드 순위 제한** | WorkTask | keyword_rank_limit | Int | - | - | - | - | 목표 순위 (예: 5위 이내) |
| **상태** | WorkTask | status | Enum | ✓ | ✓ | ✓ | ✓ | 진행중, 완료, 대기, 보류 |
| **기간 (시작)** | WorkTask | start_date | Date | ✓ | ✓ | ✓ | ✓ | |
| **기간 (종료)** | WorkTask | end_date | Date | ✓ | ✓ | ✓ | ✓ | |
| **비고** | WorkTask | notes | Text | - | ✓ | - | - | |
| **생성일시** | WorkTask | created_at | DateTime | ✓ | - | ✓ | ✓ | |
| **수정일시** | WorkTask | updated_at | DateTime | ✓ | - | ✓ | - | |

---

### 2.3 키워드 할당 (Nested Table)

**부모**: WorkTask
**관계**: WorkTask 1:N KeywordAssignment

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | 필수 | 비고 |
|-------------|-------------|--------|------|------|------|
| 키워드명 | KeywordAssignment | keyword_name | String(100) | ✓ | 또는 FK: keywords.id |
| 할당 팀 | KeywordAssignment | assigned_team_id | UUID | ✓ | FK: teams.id |
| 할당 담당자 | KeywordAssignment | assigned_user_id | UUID | ✓ | FK: users.id |
| 순위 제한 | KeywordAssignment | rank_limit | Int | - | 목표 순위 |
| 목표 키워드 여부 | KeywordAssignment | is_target_keyword | Boolean | ✓ | 기본값: false |

**관계도**:
```
WorkTask (1)
└─ KeywordAssignment (N)
   ├─ FK: work_task_id
   ├─ FK: keyword_id (또는 keyword_name 직접 저장)
   ├─ FK: assigned_team_id
   └─ FK: assigned_user_id
```

---

### 2.4 탭별 데이터 필터

| 탭명 | 필터 조건 | 설명 |
|------|-----------|------|
| 전체업무 | 없음 (또는 팀 필터) | 소속 팀의 모든 업무 or 전체 |
| 내업무 | `assignee_id = 현재 사용자 ID` | 현재 로그인한 사용자가 담당자인 업무만 |

---

### 2.5 상태 집계 (Status Summary Cards)

| 카드명 | 쿼리 | 표시 형식 |
|--------|------|-----------|
| 전체 | `SELECT COUNT(*) FROM work_tasks WHERE ...` | 숫자 + "건" |
| 진행중 | `... WHERE status = '진행중'` | 숫자 + "건" |
| 완료 | `... WHERE status = '완료'` | 숫자 + "건" |
| 대기 | `... WHERE status = '대기'` | 숫자 + "건" |
| 보류 | `... WHERE status = '보류'` | 숫자 + "건" |

**주의사항**: 탭과 필터 모두 반영 (전체업무 탭 + 필터 vs 내업무 탭 + 필터)

---

### 2.6 필터/검색 요구사항

#### 2.6.1 검색 필드

| 검색 항목 | 매핑 필드 | 검색 방식 | 비고 |
|-----------|-----------|-----------|------|
| 통합 검색 | contract_number, service_type, assignee name, team name, target_keywords | LIKE '%keyword%' (OR 조건) | 메인 검색창 |

#### 2.6.2 필터 조건

| 필터명 | 매핑 필드 | UI 컴포넌트 | 옵션 | 다중 선택 |
|--------|-----------|-------------|------|-----------|
| 상태 | WorkTask.status | 드롭다운 | 전체, 진행중, 완료, 대기, 보류 | ❌ |
| 날짜 기준 | - | 라디오 버튼 | 생성일, 시작일, 종료일 | ❌ |
| 날짜 범위 | created_at / start_date / end_date | DateRangePicker | 시작~종료 | - |
| 팀 | Team.id | 드롭다운 | 전체 팀 목록 | ❌ |
| 담당자 | User.id (assignee) | 드롭다운 | 팀 선택 시 해당 팀 멤버만 | ❌ |

#### 2.6.3 빠른 날짜 선택

계약 관리와 동일 (오늘, 1주일, 1개월, 3개월, 6개월, 1년, 전체)

---

### 2.7 정렬 요구사항

| 컬럼명 | 정렬 가능 | 기본 정렬 | 정렬 방향 |
|--------|-----------|-----------|-----------|
| 계약번호 | ✓ | - | ASC, DESC |
| 서비스 유형 | ✓ | - | ASC, DESC |
| 팀 | ✓ | - | ASC, DESC |
| 담당자 | ✓ | - | ASC, DESC |
| 상태 | ✓ | - | ASC, DESC |
| 시작일 | ✓ | - | ASC, DESC |
| 종료일 | ✓ | - | ASC, DESC |
| 생성일 | ✓ | ✓ (DESC) | ASC, DESC |

**기본 정렬**: `created_at DESC` (최신 생성 순)

---

### 2.8 CRUD 작업

#### 2.8.1 업무 등록 (Create)

**트리거**: "업무 등록" 버튼 클릭 → 모달 오픈

**입력 필드**:

| 필드명 | 필수 | 타입 | 검증 규칙 | 비고 |
|--------|------|------|-----------|------|
| 계약 선택 | ✓ | Autocomplete | 활성 계약만 | 계약번호 + 업체명 표시 |
| 서비스 유형 | ✓ | Select or Text | 2-50자 | 드롭다운 + 직접 입력 |
| 팀 | ✓ | Select | DB에서 로드 | |
| 담당자 | ✓ | Select | 선택된 팀의 멤버만 | |
| 목표 키워드 | - | Textarea | 쉼표 구분 | 최대 1000자 |
| 키워드 순위 제한 | - | Number | 1-100 | 목표 순위 |
| 상태 | ✓ | Select | 진행중, 완료, 대기, 보류 | 기본값: 대기 |
| 시작일 | ✓ | Date | - | |
| 종료일 | ✓ | Date | > 시작일 | |
| 비고 | - | Textarea | 최대 5000자 | |
| **키워드 할당 (동적 테이블)** | - | - | - | 아래 참조 |

**키워드 할당 입력 (반복 가능)**:

| 필드명 | 필수 | 타입 | 비고 |
|--------|------|------|------|
| 키워드명 | ✓ | Text | 직접 입력 or 키워드 DB에서 검색 |
| 할당 팀 | ✓ | Select | 팀 목록 |
| 할당 담당자 | ✓ | Select | 선택된 팀의 멤버 |
| 순위 제한 | - | Number | 1-100 |
| 목표 키워드 | - | Checkbox | 중요 키워드 표시 |

**UI**: "키워드 추가" 버튼으로 행 추가, "삭제" 버튼으로 행 제거

**저장 로직**:
1. 입력 검증 (WorkTask + KeywordAssignment 배열)
2. 트랜잭션 시작
3. WorkTask 레코드 생성
4. KeywordAssignment 레코드 일괄 생성 (배열)
5. 키워드명이 Keyword 테이블에 없으면 생성 (upsert)
6. 트랜잭션 커밋
7. 성공 토스트 + 목록 리프레시

**API 엔드포인트**: `POST /api/work-tasks`

---

#### 2.8.2 업무 상세 보기 (Read)

**트리거**: 테이블 행 클릭 → 상세 모달 오픈

**표시 데이터**:
- 업무 기본 정보 (모든 필드)
- 키워드 할당 목록 (테이블)
- 포스팅 현황 (하단 섹션)
  - 각 키워드별 포스팅 목록
  - 컬럼: 키워드, 블로그 URL, 제목, 현재 순위, 등록일
  - 링크: 포스팅 현황 페이지로 이동

**API 엔드포인트**: `GET /api/work-tasks/:id`

**포스팅 현황 쿼리**:
```sql
SELECT p.*
FROM postings p
JOIN keyword_assignments ka ON p.keyword = ka.keyword_name
WHERE ka.work_task_id = :taskId
ORDER BY p.current_rank ASC
```

---

#### 2.8.3 업무 수정 (Update)

**트리거**: 상세 모달 내 "수정" 버튼 → 편집 모드 전환

**수정 가능 필드**: 등록과 동일

**수정 불가 필드**: 생성일시

**키워드 할당 수정**:
- 기존 할당 삭제 가능
- 새 할당 추가 가능
- 기존 할당 수정 가능 (팀/담당자 변경)

**저장 로직**:
1. 입력 검증
2. 트랜잭션 시작
3. WorkTask 레코드 업데이트
4. KeywordAssignment 변경 사항 반영
   - 삭제된 행: DELETE
   - 신규 행: INSERT
   - 수정된 행: UPDATE
5. 트랜잭션 커밋
6. 성공 토스트 + 상세 모달 리프레시

**API 엔드포인트**: `PATCH /api/work-tasks/:id`

---

#### 2.8.4 업무 삭제 (Delete)

**트리거**: 상세 모달 내 "삭제" 버튼 → 확인 다이얼로그

**확인 메시지**:
```
이 업무를 삭제하시겠습니까?
계약번호: CT-2025-001
서비스 유형: SEO 최적화

키워드 할당 X건도 함께 삭제됩니다.
이 작업은 되돌릴 수 없습니다.
```

**삭제 로직**:
1. 권한 확인 (Admin 또는 업무 생성자만)
2. 트랜잭션 시작
3. KeywordAssignment 삭제 (ON DELETE CASCADE)
4. WorkTask 삭제
5. 트랜잭션 커밋
6. 성공 토스트 + 목록으로 이동

**API 엔드포인트**: `DELETE /api/work-tasks/:id`

---

### 2.9 성능 고려사항

#### 2.9.1 필수 인덱스

```sql
-- WorkTask 인덱스
CREATE INDEX idx_worktasks_status_created ON work_tasks(status, created_at DESC);
CREATE INDEX idx_worktasks_contract ON work_tasks(contract_id);
CREATE INDEX idx_worktasks_team_assignee ON work_tasks(team_id, assignee_id);
CREATE INDEX idx_worktasks_dates ON work_tasks(start_date, end_date);

-- KeywordAssignment 인덱스
CREATE INDEX idx_keyword_assignments_task ON keyword_assignments(work_task_id);
CREATE INDEX idx_keyword_assignments_keyword ON keyword_assignments(keyword_name);
CREATE INDEX idx_keyword_assignments_user ON keyword_assignments(assigned_user_id);
```

#### 2.9.2 N+1 문제 방지

```typescript
const workTasks = await prisma.workTask.findMany({
  include: {
    contract: {
      select: { contract_number: true }
    },
    team: {
      select: { name: true }
    },
    assignee: {
      select: { name: true, email: true }
    },
    keywordAssignments: {
      include: {
        assignedTeam: { select: { name: true } },
        assignedUser: { select: { name: true } }
      }
    }
  }
});
```

---

### 2.10 데이터 검증 규칙 (Zod Schema)

```typescript
const WorkTaskSchema = z.object({
  contract_id: z.string().uuid(),
  service_type: z.string().min(2).max(50),
  description: z.string().max(5000).optional(),
  team_id: z.string().uuid(),
  assignee_id: z.string().uuid(),
  target_keywords: z.string().max(1000).optional(),
  keyword_rank_limit: z.number().int().min(1).max(100).optional(),
  status: z.enum(['진행중', '완료', '대기', '보류']),
  start_date: z.date(),
  end_date: z.date(),
  notes: z.string().max(5000).optional(),
  keywordAssignments: z.array(
    z.object({
      keyword_name: z.string().min(1).max(100),
      assigned_team_id: z.string().uuid(),
      assigned_user_id: z.string().uuid(),
      rank_limit: z.number().int().min(1).max(100).optional(),
      is_target_keyword: z.boolean().default(false),
    })
  ).optional(),
}).refine((data) => data.end_date > data.start_date, {
  message: "종료일은 시작일보다 이후여야 합니다.",
  path: ["end_date"],
});
```

---

## 3. 체크리스트

### 3.1 계약 관리 화면

- [x] 모든 테이블 컬럼과 엔티티 매핑 완료
- [x] 필터/검색 조건 명시
- [x] 정렬 필드 및 기본값 정의
- [x] CRUD 작업 흐름 상세 기술
- [x] 관계 및 FK 제약조건 명시
- [x] 인덱스 최적화 방안 제시
- [x] N+1 문제 해결 방안 제시
- [x] 데이터 검증 규칙 (Zod) 작성

### 3.2 업무 관리 화면

- [x] 업무 + 키워드 할당 매핑 완료
- [x] 탭별 필터 조건 명시
- [x] 포스팅 현황 연동 로직 정의
- [x] CRUD 작업 (특히 중첩 데이터) 상세 기술
- [x] 인덱스 최적화 방안 제시
- [x] 데이터 검증 규칙 작성

---

## 4. 다음 단계

- ⏭️ 현황 추적 화면 매핑 (`screen_mapping_status.md`)
- ⏭️ ERD 설계 및 Prisma 스키마 작성

---

**작성 완료일**: 2025-11-11
