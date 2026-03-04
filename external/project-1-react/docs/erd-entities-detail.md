# ERD 엔티티 상세 문서

## 문서 정보
- **작성일**: 2025-11-11
- **프로젝트**: AgOffice ERD v0.1
- **ERD 파일**: `erd-v0.1.dbml`, `erd-v0.1.png`
- **목적**: 데이터베이스 스키마 구현을 위한 상세 명세

---

## 1. 엔티티 개요

### 1.1 엔티티 분류 및 개수

| 분류 | 엔티티 수 | 엔티티 목록 |
|------|-----------|-------------|
| **조직/사용자** | 4개 | users, workspaces, teams, workspace_users |
| **고객/계약** | 2개 | customers, contracts |
| **업무 관리** | 2개 | work_tasks, keyword_assignments |
| **포스팅 추적** | 3개 | keywords, postings, ranking_history |
| **집계** | 2개 | revenue, performance |
| **멤버십/결제** | 3개 | memberships, payment_methods, payments |
| **지원 기능** | 4개 | notices, inquiries, notifications, chat_messages |
| **총계** | **20개** | - |

### 1.2 관계 통계

- **1:N 관계**: 35개
- **N:N 관계**: 1개 (workspace_users)
- **1:1 관계**: 1개 (users - memberships)
- **Self-reference**: 1개 (postings)

---

## 2. 핵심 비즈니스 흐름

### 2.1 계약 생성 흐름

```
1. Customer 생성/선택
   └─> Contract 생성
       ├─> Team 할당
       ├─> Manager (User) 할당
       ├─> Sales Rep (User) 할당
       └─> Services 선택 (배열)

2. Contract 기반으로 WorkTask 생성
   ├─> Team 할당
   ├─> Assignee (User) 할당
   └─> KeywordAssignment 생성 (N개)
       ├─> 키워드명
       ├─> 할당 팀
       └─> 할당 담당자
```

### 2.2 포스팅 추적 흐름

```
1. Keyword 등록 (마스터 데이터)
   ├─> 경쟁도 설정
   └─> 추적 활성화

2. Posting 등록
   ├─> Customer 연결
   ├─> Keyword 연결 (또는 키워드명 직접 입력)
   ├─> Manager 할당
   └─> 추적 활성화

3. 자동 순위 체크 (Cron Job)
   └─> RankingHistory 기록 생성 (매일)
       ├─> checked_date
       └─> rank

4. Posting 업데이트
   ├─> current_rank 갱신
   └─> rank_change 계산
```

### 2.3 매출/성과 집계 흐름

```
1. 계약 데이터 수집
   └─> Contract (amount, start_date, services 등)

2. 집계 테이블 생성 (Cron Job, 매일)
   ├─> Revenue 집계
   │   ├─> 서비스별
   │   ├─> 월별
   │   └─> 팀별 (옵션)
   │
   └─> Performance 집계
       ├─> 팀별
       ├─> 개인별
       └─> 월별

3. 대시보드/리포트 조회
   └─> 집계 테이블에서 빠르게 조회
```

---

## 3. 엔티티별 상세 명세

### 3.1 조직/사용자 엔티티

#### 3.1.1 users (사용자)

**목적**: 시스템 사용자 계정 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `email`: 로그인 ID, UNIQUE
- `password_hash`: bcrypt 해시
- `two_factor_enabled`: 2단계 인증 여부
- `deleted_at`: Soft delete용

**관계**:
- 1:N → workspaces (owner)
- N:N → workspaces (via workspace_users)
- 1:N → teams (lead)
- 1:N → contracts (manager, sales_rep)
- 1:N → work_tasks (assignee)
- 1:N → postings (manager)
- 1:1 → memberships
- 1:N → payments, payment_methods
- 1:N → notices (author), inquiries, notifications, chat_messages

**인덱스**:
- `idx_users_email` (UNIQUE)
- `idx_users_last_login`
- `idx_users_deleted`

**비즈니스 규칙**:
- 이메일 변경 시 인증 필요
- 비밀번호는 최소 8자, 영문+숫자+특수문자
- Soft delete: `deleted_at IS NULL`로 필터링

---

#### 3.1.2 workspaces (워크스페이스)

**목적**: 다중 테넌트 워크스페이스 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `name`: 워크스페이스 이름
- `owner_id`: FK → users.id (ON DELETE RESTRICT)

**관계**:
- N:1 → users (owner)
- 1:N → teams, customers, contracts, work_tasks, postings, keywords
- 1:N → revenue, performance
- N:N → users (via workspace_users)

**인덱스**:
- `idx_workspaces_owner`

**비즈니스 규칙**:
- 1 User는 여러 Workspace를 소유할 수 있음
- Workspace 삭제 시 owner만 가능
- 삭제 시 모든 하위 데이터도 CASCADE 삭제 (주의!)

---

#### 3.1.3 teams (팀/부서)

**목적**: 팀/부서 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `workspace_id`: FK → workspaces.id (ON DELETE CASCADE)
- `name`: 팀명 (예: 1팀, 마케팅팀)
- `lead_id`: FK → users.id (팀장, ON DELETE SET NULL)

**관계**:
- N:1 → workspaces
- N:1 → users (lead)
- 1:N → workspace_users
- 1:N → contracts, work_tasks, keyword_assignments, postings
- 1:N → revenue, performance

**인덱스**:
- `idx_teams_workspace`
- `idx_teams_lead`
- `idx_teams_workspace_name` (UNIQUE: workspace_id, name)

**비즈니스 규칙**:
- 같은 Workspace 내에서 팀명 중복 불가
- 팀장 퇴사 시 `lead_id = NULL` (팀은 유지)

---

#### 3.1.4 workspace_users (워크스페이스 멤버십)

**목적**: 사용자-워크스페이스-팀 간의 N:N 관계 및 역할 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `workspace_id`: FK → workspaces.id (ON DELETE CASCADE)
- `user_id`: FK → users.id (ON DELETE CASCADE)
- `team_id`: FK → teams.id (ON DELETE SET NULL)
- `role`: ENUM (Owner, Admin, Manager, Member)
- `status`: ENUM (활성, 비활성, 초대중)

**관계**:
- N:1 → workspaces
- N:1 → users
- N:1 → teams

**인덱스**:
- `idx_workspace_users_unique` (UNIQUE: workspace_id, user_id)
- `idx_workspace_users_workspace`
- `idx_workspace_users_user`
- `idx_workspace_users_team`
- `idx_workspace_users_role`
- `idx_workspace_users_status`

**비즈니스 규칙**:
- 1 User는 1 Workspace에 1번만 속할 수 있음
- 초대 시 `status = '초대중'`, 수락 시 `status = '활성'`
- Owner는 Workspace당 1명 권장 (workspace.owner_id와 일치)

---

### 3.2 고객 및 계약 엔티티

#### 3.2.1 customers (고객)

**목적**: 고객사 정보 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `workspace_id`: FK → workspaces.id (ON DELETE RESTRICT)
- `company_name`: 업체명
- `contact_person`: 담당자
- `region_sido`, `region_sigungu`: 지역 정보

**관계**:
- N:1 → workspaces
- 1:N → contracts
- 1:N → postings

**인덱스**:
- `idx_customers_workspace`
- `idx_customers_company_name`
- `idx_customers_region` (복합: region_sido, region_sigungu)

**비즈니스 규칙**:
- 고객 삭제 시 계약이 있으면 RESTRICT (삭제 불가)
- 동일 업체명 허용 (다른 지역 등)

---

#### 3.2.2 contracts (계약)

**목적**: 고객 계약 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `contract_number`: VARCHAR(20), UNIQUE (CT-YYYY-###)
- `contract_type`: ENUM (월계약, 프로젝트, 연계약)
- `status`: ENUM (신규, 연장, 확장)
- `customer_id`: FK → customers.id (ON DELETE RESTRICT)
- `team_id`: FK → teams.id (ON DELETE RESTRICT)
- `manager_id`: FK → users.id (ON DELETE SET NULL)
- `sales_rep_id`: FK → users.id (ON DELETE SET NULL)
- `services`: TEXT[] (배열: SEO, 프리미엄, 하나탑)
- `amount`: DECIMAL(15,2) (계약 금액)
- `is_expired`: BOOLEAN (만료 여부)

**관계**:
- N:1 → workspaces
- N:1 → customers
- N:1 → teams
- N:1 → users (manager, sales_rep)
- 1:N → work_tasks

**인덱스**:
- `idx_contracts_number` (UNIQUE)
- `idx_contracts_workspace`
- `idx_contracts_customer`
- `idx_contracts_team`
- `idx_contracts_manager`
- `idx_contracts_sales_rep`
- `idx_contracts_status_regdate` (복합)
- `idx_contracts_dates` (복합: start_date, end_date)
- `idx_contracts_expired`

**비즈니스 규칙**:
- `end_date > start_date` (CHECK 제약)
- `amount >= 0` (CHECK 제약)
- `is_expired` 자동 계산 (Trigger 또는 애플리케이션 로직)
- 고객 또는 팀 삭제 시 RESTRICT (계약 먼저 삭제 필요)
- 담당자 퇴사 시 SET NULL

---

### 3.3 업무 관리 엔티티

#### 3.3.1 work_tasks (업무/작업)

**목적**: 계약 기반 업무 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `contract_id`: FK → contracts.id (ON DELETE CASCADE)
- `service_type`: VARCHAR(50) (SEO 최적화, SNS 마케팅 등)
- `team_id`: FK → teams.id (ON DELETE RESTRICT)
- `assignee_id`: FK → users.id (담당자, ON DELETE SET NULL)
- `status`: ENUM (진행중, 완료, 대기, 보류)
- `target_keywords`: TEXT (쉼표 구분 또는 JSON)

**관계**:
- N:1 → workspaces
- N:1 → contracts
- N:1 → teams
- N:1 → users (assignee)
- 1:N → keyword_assignments

**인덱스**:
- `idx_worktasks_workspace`
- `idx_worktasks_contract`
- `idx_worktasks_team`
- `idx_worktasks_assignee`
- `idx_worktasks_status_created` (복합)
- `idx_worktasks_dates` (복합)

**비즈니스 규칙**:
- `end_date > start_date` (CHECK 제약)
- 계약 삭제 시 업무도 CASCADE 삭제
- 담당자 퇴사 시 SET NULL

---

#### 3.3.2 keyword_assignments (키워드 할당)

**목적**: 업무별 키워드 할당 및 담당자 지정

**주요 필드**:
- `id`: UUID, Primary Key
- `work_task_id`: FK → work_tasks.id (ON DELETE CASCADE)
- `keyword_name`: VARCHAR(100)
- `assigned_team_id`: FK → teams.id (ON DELETE RESTRICT)
- `assigned_user_id`: FK → users.id (ON DELETE SET NULL)
- `is_target_keyword`: BOOLEAN (중요 키워드 표시)

**관계**:
- N:1 → work_tasks
- N:1 → teams
- N:1 → users

**인덱스**:
- `idx_keyword_assignments_task`
- `idx_keyword_assignments_keyword`
- `idx_keyword_assignments_user`
- `idx_keyword_assignments_team`

**비즈니스 규칙**:
- 업무 삭제 시 할당도 CASCADE 삭제
- 담당자 퇴사 시 SET NULL

---

### 3.4 포스팅 추적 엔티티

#### 3.4.1 keywords (키워드 마스터)

**목적**: 키워드 정보 및 경쟁도 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `workspace_id`: FK → workspaces.id (ON DELETE CASCADE)
- `name`: VARCHAR(100) (키워드명)
- `competition_level`: ENUM (아주좋음, 좋음, 보통, 나쁨, 아주나쁨)
- `monthly_search_volume`: INT (월간 검색량)
- `is_target`: BOOLEAN (목표 키워드)
- `is_tracking_active`: BOOLEAN (추적 활성화)

**관계**:
- N:1 → workspaces
- (Posting과는 keyword 필드로 간접 연결)

**인덱스**:
- `idx_keywords_workspace`
- `idx_keywords_workspace_name` (UNIQUE: workspace_id, name)
- `idx_keywords_competition`
- `idx_keywords_target`
- `idx_keywords_tracking`

**비즈니스 규칙**:
- 같은 Workspace 내에서 키워드명 중복 불가
- 마스터 데이터로 사용 (Posting.keyword는 String 또는 FK 선택 가능)

---

#### 3.4.2 postings (포스팅)

**목적**: 블로그 포스팅 순위 추적

**주요 필드**:
- `id`: UUID, Primary Key
- `blog_url`: VARCHAR(500), UNIQUE
- `customer_id`: FK → customers.id (ON DELETE RESTRICT)
- `keyword`: VARCHAR(100) (또는 keyword_id FK)
- `manager_id`: FK → users.id (ON DELETE SET NULL)
- `team_id`: FK → teams.id (ON DELETE SET NULL)
- `category`: ENUM (신규, 재작업)
- `current_rank`: INT (1-100)
- `rank_change`: INT (계산 필드)
- `is_favorite`: BOOLEAN (즐겨찾기)
- `original_posting_id`: UUID (Self-reference, 재작업의 경우)

**관계**:
- N:1 → workspaces
- N:1 → customers
- N:1 → users (manager)
- N:1 → teams
- N:1 → postings (original, Self-reference)
- 1:N → ranking_history

**인덱스**:
- `idx_postings_url` (UNIQUE)
- `idx_postings_workspace`
- `idx_postings_customer`
- `idx_postings_keyword`
- `idx_postings_manager`
- `idx_postings_team`
- `idx_postings_category_rank` (복합)
- `idx_postings_favorite`
- `idx_postings_registered`
- `idx_postings_last_checked`
- `idx_postings_original`

**비즈니스 규칙**:
- `blog_url` 중복 불가 (UNIQUE)
- `current_rank`: 1-100 또는 NULL (CHECK 제약)
- 원본 포스팅 삭제 시 `original_posting_id = NULL`
- `rank_change` 자동 계산 (Trigger 또는 애플리케이션)

---

#### 3.4.3 ranking_history (순위 이력)

**목적**: 포스팅별 일별 순위 추적

**주요 필드**:
- `id`: UUID, Primary Key
- `posting_id`: FK → postings.id (ON DELETE CASCADE)
- `checked_date`: DATE
- `rank`: INT (1-100 또는 NULL)

**관계**:
- N:1 → postings

**인덱스**:
- `idx_ranking_history_posting`
- `idx_ranking_history_date`
- `idx_ranking_history_unique` (UNIQUE: posting_id, checked_date)

**비즈니스 규칙**:
- 1 포스팅당 1 날짜에 1개 레코드만 (UNIQUE)
- 포스팅 삭제 시 이력도 CASCADE 삭제
- `rank = NULL`: 순위권 밖 (100위 이하)

---

### 3.5 집계 엔티티

#### 3.5.1 revenue (매출 집계)

**목적**: 서비스별/월별 매출 집계 (미리 계산된 집계 테이블)

**주요 필드**:
- `id`: UUID, Primary Key
- `workspace_id`: FK → workspaces.id (ON DELETE CASCADE)
- `year`: INT (2024, 2025, ...)
- `half`: ENUM (상반기, 하반기, NULL)
- `month`: INT (1-12)
- `service_name`: VARCHAR(50) (SEO, 프리미엄, 하나탑)
- `team_id`: UUID (FK → teams.id, 옵션)
- `total_revenue`: DECIMAL(15,2) (총 매출)
- `contracts_count`: INT (계약 건수)

**관계**:
- N:1 → workspaces
- N:1 → teams (옵션)

**인덱스**:
- `idx_revenue_workspace`
- `idx_revenue_year_month` (복합)
- `idx_revenue_service`
- `idx_revenue_team`
- `idx_revenue_unique` (UNIQUE: workspace_id, year, month, service_name, team_id)

**비즈니스 규칙**:
- 집계 테이블: Cron으로 매일 갱신
- 같은 조건(year, month, service, team)에 대해 1개 레코드만
- `year >= 2020`, `month 1-12` (CHECK 제약)

---

#### 3.5.2 performance (성과 집계)

**목적**: 팀별/개인별 성과 집계

**주요 필드**:
- `id`: UUID, Primary Key
- `workspace_id`: FK → workspaces.id (ON DELETE CASCADE)
- `year`: INT
- `half`: ENUM (상반기, 하반기, NULL)
- `month`: INT (1-12)
- `team_id`: UUID (FK → teams.id, ON DELETE CASCADE)
- `member_id`: UUID (FK → users.id, ON DELETE CASCADE)
- `monthly_revenue`: DECIMAL(15,2)
- `contract_count`: INT
- `company_count`: INT (담당 업체 수)

**관계**:
- N:1 → workspaces
- N:1 → teams
- N:1 → users (member)

**인덱스**:
- `idx_performance_workspace`
- `idx_performance_year_month` (복합)
- `idx_performance_team`
- `idx_performance_member`
- `idx_performance_unique` (UNIQUE: workspace_id, year, month, team_id, member_id)

**비즈니스 규칙**:
- 집계 테이블: Cron으로 매일 갱신
- 같은 조건(year, month, team, member)에 대해 1개 레코드만

---

### 3.6 멤버십/결제 엔티티

#### 3.6.1 memberships (멤버십)

**목적**: 사용자 멤버십 플랜 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `user_id`: UUID, UNIQUE (FK → users.id, 1:1 관계)
- `level`: ENUM (BASIC, STANDARD, PREMIUM)
- `status`: ENUM (활성, 비활성, 만료)
- `billing_cycle`: ENUM (monthly, annual)
- `is_auto_renew`: BOOLEAN

**관계**:
- 1:1 → users (user_id UNIQUE)
- N:1 → payment_methods
- 1:N → payments

**인덱스**:
- `idx_memberships_user` (UNIQUE)
- `idx_memberships_level`
- `idx_memberships_status`
- `idx_memberships_end_date`

**비즈니스 규칙**:
- 1 User는 1개의 Active Membership만 가질 수 있음
- `end_date > start_date` (CHECK 제약)
- 만료 체크: Cron으로 매일 `end_date < today` → `status = '만료'`

---

#### 3.6.2 payment_methods (결제 수단)

**목적**: 사용자 결제 수단 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `user_id`: UUID (FK → users.id)
- `type`: ENUM (card, bank_transfer)
- `card_last4`: VARCHAR(4) (카드 마지막 4자리만)
- `pg_token`: VARCHAR(500) (PG사 토큰, 암호화 권장)
- `is_default`: BOOLEAN

**관계**:
- N:1 → users
- 1:N → memberships

**인덱스**:
- `idx_payment_methods_user`
- `idx_payment_methods_default`

**비즈니스 규칙**:
- 카드 정보는 PG사에 저장, 토큰만 보관
- `pg_token` 암호화 필수
- 1 User당 여러 결제 수단 가능

---

#### 3.6.3 payments (결제 내역)

**목적**: 결제 트랜잭션 기록

**주요 필드**:
- `id`: UUID, Primary Key
- `user_id`: UUID (FK → users.id, ON DELETE RESTRICT)
- `membership_id`: UUID (FK → memberships.id, ON DELETE SET NULL)
- `amount`: DECIMAL(10,2)
- `status`: ENUM (완료, 진행중, 실패, 환불)
- `pg_transaction_id`: VARCHAR(100) (PG사 거래 ID)

**관계**:
- N:1 → users
- N:1 → memberships

**인덱스**:
- `idx_payments_user`
- `idx_payments_membership`
- `idx_payments_status`
- `idx_payments_date`
- `idx_payments_pg_txn`

**비즈니스 규칙**:
- 결제 실패 시 `failure_reason` 기록
- 환불 시 별도 레코드 생성 (`status = '환불'`)
- 사용자 삭제 시 RESTRICT (결제 이력 보존)

---

### 3.7 지원 기능 엔티티

#### 3.7.1 notices (공지사항)

**목적**: 시스템 공지사항

**주요 필드**:
- `id`: INT, AUTO_INCREMENT, Primary Key
- `type`: ENUM (공지, 이벤트, 업데이트)
- `is_pinned`: BOOLEAN (상단 고정)
- `view_count`: INT (조회수)

**관계**:
- N:1 → users (author)

**인덱스**:
- `idx_notices_type`
- `idx_notices_pinned_created` (복합: is_pinned DESC, created_at DESC)
- `idx_notices_author`

**비즈니스 규칙**:
- 상단 고정은 여러 개 가능
- 조회 시 `is_pinned DESC, created_at DESC` 정렬

---

#### 3.7.2 inquiries (문의)

**목적**: 고객 지원 문의

**주요 필드**:
- `id`: UUID, Primary Key
- `user_id`: UUID (FK → users.id)
- `category`: ENUM (버그, 기능요청, 기타)
- `status`: ENUM (접수, 답변중, 완료)
- `responder_id`: UUID (FK → users.id, 관리자)

**관계**:
- N:1 → users (문의자)
- N:1 → users (답변자)

**인덱스**:
- `idx_inquiries_user`
- `idx_inquiries_category`
- `idx_inquiries_status`
- `idx_inquiries_created`
- `idx_inquiries_responder`

**비즈니스 규칙**:
- 답변 완료 시 `responded_at` 자동 기록
- 파일 첨부는 S3 등에 저장 후 URL만 보관

---

#### 3.7.3 notifications (알림)

**목적**: 사용자 알림 관리

**주요 필드**:
- `id`: UUID, Primary Key
- `user_id`: UUID (FK → users.id)
- `type`: VARCHAR(50) (계약만료, 업무완료, 순위변동 등)
- `is_read`: BOOLEAN

**관계**:
- N:1 → users

**인덱스**:
- `idx_notifications_user_read` (복합: user_id, is_read)
- `idx_notifications_created`
- `idx_notifications_type`

**비즈니스 규칙**:
- 읽지 않은 알림만 헤더에 표시 (`is_read = false`)
- 30일 이상 된 알림 자동 삭제 (옵션)

---

#### 3.7.4 chat_messages (챗봇 메시지)

**목적**: 챗봇 대화 이력

**주요 필드**:
- `id`: UUID, Primary Key
- `user_id`: UUID (FK → users.id)
- `sender_type`: ENUM (user, bot, admin)
- `message`: TEXT

**관계**:
- N:1 → users

**인덱스**:
- `idx_chat_messages_user_created` (복합: user_id, created_at DESC)
- `idx_chat_messages_sender_type`

**비즈니스 규칙**:
- 대화 이력은 사용자별로 최근 100개만 로드 (페이지네이션)
- AI 챗봇: OpenAI API 등 활용

---

## 4. FK 제약조건 요약

### 4.1 ON DELETE 정책

| FK 관계 | ON DELETE 정책 | 이유 |
|---------|----------------|------|
| workspaces → users (owner) | RESTRICT | 소유자 삭제 전 워크스페이스 양도 필요 |
| teams → workspaces | CASCADE | 워크스페이스 삭제 시 팀도 삭제 |
| teams → users (lead) | SET NULL | 팀장 퇴사해도 팀은 유지 |
| customers → workspaces | RESTRICT | 워크스페이스 삭제 전 고객 정리 필요 |
| contracts → customers | RESTRICT | 고객 삭제 전 계약 정리 필요 |
| contracts → teams | RESTRICT | 팀 삭제 전 계약 재할당 필요 |
| contracts → users (manager/sales) | SET NULL | 담당자 퇴사해도 계약은 유지 |
| work_tasks → contracts | CASCADE | 계약 삭제 시 업무도 삭제 |
| work_tasks → users (assignee) | SET NULL | 담당자 퇴사해도 업무는 유지 |
| keyword_assignments → work_tasks | CASCADE | 업무 삭제 시 할당도 삭제 |
| postings → customers | RESTRICT | 고객 삭제 전 포스팅 정리 필요 |
| postings → users (manager) | SET NULL | 담당자 퇴사해도 포스팅은 유지 |
| postings → postings (original) | SET NULL | 원본 삭제해도 재작업은 유지 |
| ranking_history → postings | CASCADE | 포스팅 삭제 시 이력도 삭제 |
| revenue → teams | CASCADE | 팀 삭제 시 집계도 삭제 (재생성 가능) |
| memberships → users | CASCADE | 사용자 삭제 시 멤버십도 삭제 |
| payments → users | RESTRICT | 사용자 삭제 전 결제 이력 보존 필요 |

### 4.2 CASCADE 주의사항

**위험한 CASCADE**:
- `workspaces → teams/customers/contracts` 등 (워크스페이스 삭제 시 대량 데이터 삭제)
- 프로덕션에서는 Soft Delete 권장

**안전한 CASCADE**:
- `work_tasks → keyword_assignments` (업무 삭제 시 할당도 삭제)
- `postings → ranking_history` (포스팅 삭제 시 이력도 삭제)

---

## 5. 인덱싱 전략 요약

### 5.1 필수 인덱스

#### 단일 인덱스
- PK: 모든 테이블
- UNIQUE: `users.email`, `contracts.contract_number`, `postings.blog_url` 등
- FK: 모든 외래 키

#### 복합 인덱스
- **검색 + 정렬**: `(workspace_id, status, created_at DESC)`
- **UNIQUE 조합**: `(workspace_id, name)`, `(posting_id, checked_date)`
- **필터 조합**: `(user_id, is_read)`, `(category, current_rank)`

### 5.2 인덱스 최적화 팁

**복합 인덱스 순서**:
1. WHERE 절에 자주 사용되는 컬럼
2. 카디널리티가 높은 컬럼 (다양한 값)
3. ORDER BY 컬럼

**예시**:
```sql
-- 좋음
CREATE INDEX idx_contracts_workspace_status_date
ON contracts(workspace_id, status, created_at DESC);

-- 나쁨 (순서 잘못됨)
CREATE INDEX idx_contracts_date_status_workspace
ON contracts(created_at, status, workspace_id);
```

**과도한 인덱스 주의**:
- INSERT/UPDATE 성능 저하
- 디스크 공간 낭비
- 쿼리 플래너 혼란

---

## 6. CHECK 제약조건 요약

```sql
-- Contracts
CHECK (amount >= 0)
CHECK (end_date > start_date)
CHECK (posting_count IS NULL OR posting_count >= 0)

-- Work Tasks
CHECK (end_date > start_date)
CHECK (keyword_rank_limit IS NULL OR keyword_rank_limit BETWEEN 1 AND 100)

-- Postings
CHECK (current_rank IS NULL OR current_rank BETWEEN 1 AND 100)
CHECK (contract_threshold IS NULL OR contract_threshold BETWEEN 1 AND 100)

-- Ranking History
CHECK (rank IS NULL OR rank BETWEEN 1 AND 100)

-- Revenue
CHECK (total_revenue >= 0)
CHECK (year >= 2020)
CHECK (month BETWEEN 1 AND 12)

-- Performance
CHECK (monthly_revenue >= 0)
CHECK (year >= 2020)
CHECK (month BETWEEN 1 AND 12)

-- Payments
CHECK (amount >= 0)

-- Payment Methods
CHECK (expiry_month IS NULL OR expiry_month BETWEEN 1 AND 12)
CHECK (expiry_year IS NULL OR expiry_year >= 2020)
```

---

## 7. Trigger 권장사항

### 7.1 자동 계산 Trigger

```sql
-- Contract.is_expired 자동 업데이트
CREATE TRIGGER update_contract_expired
BEFORE UPDATE ON contracts
FOR EACH ROW
BEGIN
  SET NEW.is_expired = (NEW.end_date < CURDATE());
END;

-- Posting.rank_change 자동 계산
CREATE TRIGGER calculate_rank_change
BEFORE UPDATE ON postings
FOR EACH ROW
BEGIN
  IF NEW.current_rank IS NOT NULL AND OLD.current_rank IS NOT NULL THEN
    SET NEW.rank_change = NEW.current_rank - OLD.current_rank;
  END IF;
END;
```

### 7.2 감사(Audit) Trigger (옵션)

```sql
-- Contract 변경 이력 기록
CREATE TRIGGER audit_contract_changes
AFTER UPDATE ON contracts
FOR EACH ROW
BEGIN
  INSERT INTO contract_audit_log (
    contract_id, changed_by, changed_at, old_values, new_values
  ) VALUES (
    NEW.id, @current_user_id, NOW(),
    JSON_OBJECT('amount', OLD.amount, 'status', OLD.status),
    JSON_OBJECT('amount', NEW.amount, 'status', NEW.status)
  );
END;
```

---

## 8. 마이그레이션 순서

### 8.1 테이블 생성 순서 (FK 의존성 고려)

```
1. users (독립)
2. workspaces (→ users)
3. teams (→ workspaces, users)
4. workspace_users (→ workspaces, users, teams)
5. customers (→ workspaces)
6. contracts (→ workspaces, customers, teams, users)
7. work_tasks (→ workspaces, contracts, teams, users)
8. keyword_assignments (→ work_tasks, teams, users)
9. keywords (→ workspaces)
10. postings (→ workspaces, customers, teams, users, postings)
11. ranking_history (→ postings)
12. revenue (→ workspaces, teams)
13. performance (→ workspaces, teams, users)
14. memberships (→ users, payment_methods)
15. payment_methods (→ users)
16. payments (→ users, memberships)
17. notices (→ users)
18. inquiries (→ users)
19. notifications (→ users)
20. chat_messages (→ users)
```

### 8.2 시드 데이터 순서

```
1. users (관리자 계정)
2. workspaces (기본 워크스페이스)
3. teams (기본 팀)
4. workspace_users (관리자 할당)
5. keywords (기본 키워드)
6. memberships (관리자 PREMIUM 플랜)
```

---

## 9. 다음 단계

### 9.1 ERD 시각화

**온라인 도구**:
1. https://dbdiagram.io 접속
2. `erd-v0.1.dbml` 파일 내용 복사
3. 붙여넣기 → 자동 다이어그램 생성
4. PNG 또는 PDF로 내보내기 → `erd-v0.1.png`

### 9.2 Prisma 스키마 작성

`prisma/schema.prisma` 파일 생성 및 엔티티 정의

### 9.3 마이그레이션 실행

```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

---

## 10. 체크리스트

- [x] 모든 엔티티 정의 완료 (20개)
- [x] FK 관계 및 ON DELETE 정책 명시
- [x] 인덱스 전략 수립
- [x] CHECK 제약조건 정의
- [x] Trigger 권장사항 제시
- [x] 마이그레이션 순서 정리
- [ ] ERD 다이어그램 생성 (**다음 단계**)
- [ ] Prisma 스키마 작성 (**다음 단계**)

---

**작성 완료일**: 2025-11-11
