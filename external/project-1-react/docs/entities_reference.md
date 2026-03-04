# 핵심 엔티티 참조 (Entities Reference)

## 문서 정보
- **작성일**: 2025-11-11
- **목적**: 전체 데이터 모델의 엔티티 정의 및 관계 명세
- **다음 단계**: ERD 다이어그램 작성, Prisma 스키마 구현

---

## 1. 엔티티 개요

### 1.1 엔티티 분류

#### 핵심 비즈니스 엔티티
- **Contract**: 계약 관리
- **WorkTask**: 업무 관리
- **Posting**: 포스팅 추적
- **Keyword**: 키워드 마스터
- **Customer**: 고객 정보

#### 조직/사용자 엔티티
- **User**: 사용자
- **Team**: 팀
- **Workspace**: 워크스페이스
- **WorkspaceUser**: 워크스페이스 멤버십

#### 집계/분석 엔티티
- **Revenue**: 매출 집계
- **Performance**: 성과 집계
- **RankingHistory**: 순위 이력

#### 지원 엔티티
- **Membership**: 멤버십 구독
- **Payment**: 결제 내역
- **PaymentMethod**: 결제 수단
- **Notice**: 공지사항
- **Inquiry**: 문의
- **Notification**: 알림
- **ChatMessage**: 챗봇 메시지
- **KeywordAssignment**: 키워드 할당

---

## 2. 엔티티 상세 정의

### 2.1 User (사용자)

**목적**: 시스템 사용자 정보

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| name | VARCHAR(50) | ✓ | - | - | - | |
| email | VARCHAR(100) | ✓ | - | UNIQUE | - | 로그인 ID |
| password_hash | VARCHAR(255) | ✓ | - | - | - | bcrypt 해시 |
| phone | VARCHAR(20) | - | NULL | - | - | 010-####-#### |
| company_name | VARCHAR(100) | - | NULL | - | - | |
| position | VARCHAR(50) | - | NULL | - | - | 직책 |
| avatar_url | VARCHAR(500) | - | NULL | - | - | S3 등 |
| two_factor_enabled | BOOLEAN | ✓ | false | - | - | |
| last_login_at | TIMESTAMP | - | NULL | ✓ | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |
| deleted_at | TIMESTAMP | - | NULL | ✓ | - | Soft delete |

**인덱스**:
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_login ON users(last_login_at);
CREATE INDEX idx_users_deleted ON users(deleted_at);
```

---

### 2.2 Workspace (워크스페이스)

**목적**: 다중 테넌트 워크스페이스 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| name | VARCHAR(100) | ✓ | - | - | - | |
| logo_url | VARCHAR(500) | - | NULL | - | - | |
| description | TEXT | - | NULL | - | - | |
| owner_id | UUID | ✓ | - | ✓ | FK → users.id | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `owner_id` → `users.id` ON DELETE RESTRICT

---

### 2.3 Team (팀)

**목적**: 팀/부서 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| name | VARCHAR(50) | ✓ | - | - | - | 1팀, 마케팅팀 등 |
| department | VARCHAR(50) | - | NULL | - | - | |
| lead_id | UUID | - | NULL | ✓ | FK → users.id | 팀장 |
| description | TEXT | - | NULL | - | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE CASCADE
- `lead_id` → `users.id` ON DELETE SET NULL

**복합 UNIQUE 인덱스**:
```sql
CREATE UNIQUE INDEX idx_teams_workspace_name ON teams(workspace_id, name);
```

---

### 2.4 WorkspaceUser (워크스페이스 멤버십)

**목적**: 사용자-워크스페이스-팀 간의 N:N 관계 및 역할 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| user_id | UUID | ✓ | - | ✓ | FK → users.id | |
| team_id | UUID | - | NULL | ✓ | FK → teams.id | |
| role | ENUM | ✓ | 'Member' | ✓ | Owner, Admin, Manager, Member | |
| status | ENUM | ✓ | '초대중' | ✓ | 활성, 비활성, 초대중 | |
| joined_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE CASCADE
- `user_id` → `users.id` ON DELETE CASCADE
- `team_id` → `teams.id` ON DELETE SET NULL

**복합 UNIQUE 인덱스**:
```sql
CREATE UNIQUE INDEX idx_workspace_users_unique ON workspace_users(workspace_id, user_id);
```

---

### 2.5 Customer (고객)

**목적**: 고객사 정보

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| company_name | VARCHAR(100) | ✓ | - | ✓ | - | |
| contact_person | VARCHAR(50) | ✓ | - | - | - | 담당자 |
| phone | VARCHAR(20) | ✓ | - | - | - | |
| address | TEXT | - | NULL | - | - | |
| region_sido | VARCHAR(20) | - | NULL | ✓ | - | 서울, 경기 등 |
| region_sigungu | VARCHAR(50) | - | NULL | ✓ | - | 강남구, 수원시 등 |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE RESTRICT

**인덱스**:
```sql
CREATE INDEX idx_customers_company_name ON customers(company_name);
CREATE INDEX idx_customers_region ON customers(region_sido, region_sigungu);
```

---

### 2.6 Contract (계약)

**목적**: 고객 계약 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| contract_number | VARCHAR(20) | ✓ | - | UNIQUE | - | CT-YYYY-### |
| contract_type | ENUM | ✓ | - | ✓ | 월계약, 프로젝트, 연계약 | |
| status | ENUM | ✓ | '신규' | ✓ | 신규, 연장, 확장 | |
| customer_id | UUID | ✓ | - | ✓ | FK → customers.id | |
| team_id | UUID | ✓ | - | ✓ | FK → teams.id | |
| manager_id | UUID | ✓ | - | ✓ | FK → users.id | 담당 매니저 |
| sales_rep_id | UUID | ✓ | - | ✓ | FK → users.id | 영업 담당자 |
| services | TEXT[] | ✓ | - | - | - | ['SEO', '프리미엄', '하나탑'] |
| amount | DECIMAL(15,2) | ✓ | - | ✓ | CHECK >= 0 | 계약 금액 |
| posting_count | INT | - | NULL | - | CHECK >= 0 | |
| ad_cost_total | DECIMAL(15,2) | - | NULL | - | CHECK >= 0 | |
| ad_cost_monthly | DECIMAL(15,2) | - | NULL | - | CHECK >= 0 | |
| start_date | DATE | ✓ | - | ✓ | - | |
| end_date | DATE | ✓ | - | ✓ | CHECK > start_date | |
| is_expired | BOOLEAN | ✓ | false | ✓ | - | 계산 필드 or 트리거 |
| registration_date | DATE | ✓ | CURRENT_DATE | ✓ | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE CASCADE
- `customer_id` → `customers.id` ON DELETE RESTRICT
- `team_id` → `teams.id` ON DELETE RESTRICT
- `manager_id`, `sales_rep_id` → `users.id` ON DELETE SET NULL

**복합 인덱스**:
```sql
CREATE INDEX idx_contracts_status_regdate ON contracts(status, registration_date DESC);
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date);
CREATE INDEX idx_contracts_team_manager ON contracts(team_id, manager_id);
CREATE UNIQUE INDEX idx_contracts_number ON contracts(contract_number);
```

---

### 2.7 WorkTask (업무)

**목적**: 계약 기반 업무/작업 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| contract_id | UUID | ✓ | - | ✓ | FK → contracts.id | |
| service_type | VARCHAR(50) | ✓ | - | ✓ | - | SEO 최적화, SNS 마케팅 등 |
| description | TEXT | - | NULL | - | - | |
| team_id | UUID | ✓ | - | ✓ | FK → teams.id | |
| assignee_id | UUID | ✓ | - | ✓ | FK → users.id | 담당자 |
| target_keywords | TEXT | - | NULL | - | - | 쉼표 구분 or JSON |
| keyword_rank_limit | INT | - | NULL | - | CHECK 1-100 | 목표 순위 |
| status | ENUM | ✓ | '대기' | ✓ | 진행중, 완료, 대기, 보류 | |
| start_date | DATE | ✓ | - | ✓ | - | |
| end_date | DATE | ✓ | - | ✓ | CHECK > start_date | |
| notes | TEXT | - | NULL | - | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE CASCADE
- `contract_id` → `contracts.id` ON DELETE CASCADE
- `team_id` → `teams.id` ON DELETE RESTRICT
- `assignee_id` → `users.id` ON DELETE SET NULL

**복합 인덱스**:
```sql
CREATE INDEX idx_worktasks_status_created ON work_tasks(status, created_at DESC);
CREATE INDEX idx_worktasks_contract ON work_tasks(contract_id);
CREATE INDEX idx_worktasks_team_assignee ON work_tasks(team_id, assignee_id);
CREATE INDEX idx_worktasks_dates ON work_tasks(start_date, end_date);
```

---

### 2.8 KeywordAssignment (키워드 할당)

**목적**: 업무별 키워드 할당 및 담당자 지정

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| work_task_id | UUID | ✓ | - | ✓ | FK → work_tasks.id | |
| keyword_name | VARCHAR(100) | ✓ | - | ✓ | - | 또는 keyword_id (FK) |
| assigned_team_id | UUID | ✓ | - | ✓ | FK → teams.id | |
| assigned_user_id | UUID | ✓ | - | ✓ | FK → users.id | |
| rank_limit | INT | - | NULL | - | CHECK 1-100 | 목표 순위 |
| is_target_keyword | BOOLEAN | ✓ | false | - | - | 중요 키워드 |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `work_task_id` → `work_tasks.id` ON DELETE CASCADE
- `assigned_team_id` → `teams.id` ON DELETE RESTRICT
- `assigned_user_id` → `users.id` ON DELETE SET NULL

**인덱스**:
```sql
CREATE INDEX idx_keyword_assignments_task ON keyword_assignments(work_task_id);
CREATE INDEX idx_keyword_assignments_keyword ON keyword_assignments(keyword_name);
CREATE INDEX idx_keyword_assignments_user ON keyword_assignments(assigned_user_id);
```

---

### 2.9 Keyword (키워드 마스터)

**목적**: 키워드 정보 및 경쟁도 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| name | VARCHAR(100) | ✓ | - | UNIQUE (per workspace) | - | |
| competition_level | ENUM | - | NULL | ✓ | 아주좋음, 좋음, 보통, 나쁨, 아주나쁨 | |
| monthly_search_volume | INT | - | NULL | - | - | Naver API |
| monthly_post_volume | INT | - | NULL | - | - | |
| blog_saturation | DECIMAL(5,2) | - | NULL | - | - | 0-100% |
| is_target | BOOLEAN | ✓ | false | ✓ | - | 목표 키워드 |
| is_tracking_active | BOOLEAN | ✓ | true | ✓ | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE CASCADE

**복합 UNIQUE 인덱스**:
```sql
CREATE UNIQUE INDEX idx_keywords_workspace_name ON keywords(workspace_id, name);
CREATE INDEX idx_keywords_competition ON keywords(competition_level);
CREATE INDEX idx_keywords_target ON keywords(is_target);
```

---

### 2.10 Posting (포스팅)

**목적**: 블로그 포스팅 순위 추적

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| blog_url | VARCHAR(500) | ✓ | - | UNIQUE | - | |
| customer_id | UUID | ✓ | - | ✓ | FK → customers.id | |
| title | VARCHAR(200) | ✓ | - | - | - | |
| keyword | VARCHAR(100) | ✓ | - | ✓ | - | 또는 keyword_id (FK) |
| manager_id | UUID | ✓ | - | ✓ | FK → users.id | |
| team_id | UUID | ✓ | - | ✓ | FK → teams.id | |
| category | ENUM | ✓ | '신규' | ✓ | 신규, 재작업 | |
| contract_threshold | INT | - | NULL | - | CHECK 1-100 | 목표 순위 |
| current_rank | INT | - | NULL | ✓ | CHECK 1-100 | |
| rank_change | INT | - | NULL | - | - | 계산 필드 |
| is_favorite | BOOLEAN | ✓ | false | ✓ | - | |
| original_posting_id | UUID | - | NULL | ✓ | FK → postings.id | Self-reference |
| is_tracking_active | BOOLEAN | ✓ | true | ✓ | - | |
| registered_date | DATE | ✓ | CURRENT_DATE | ✓ | - | |
| last_checked | TIMESTAMP | - | NULL | ✓ | - | 마지막 순위 체크 |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE CASCADE
- `customer_id` → `customers.id` ON DELETE RESTRICT
- `manager_id` → `users.id` ON DELETE SET NULL
- `team_id` → `teams.id` ON DELETE SET NULL
- `original_posting_id` → `postings.id` ON DELETE SET NULL

**인덱스**:
```sql
CREATE INDEX idx_postings_keyword ON postings(keyword);
CREATE INDEX idx_postings_customer ON postings(customer_id);
CREATE INDEX idx_postings_manager ON postings(manager_id);
CREATE INDEX idx_postings_team ON postings(team_id);
CREATE INDEX idx_postings_category_rank ON postings(category, current_rank);
CREATE INDEX idx_postings_favorite ON postings(is_favorite);
CREATE INDEX idx_postings_registered ON postings(registered_date DESC);
CREATE UNIQUE INDEX idx_postings_url ON postings(blog_url);
```

---

### 2.11 RankingHistory (순위 이력)

**목적**: 포스팅별 일별 순위 추적

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| posting_id | UUID | ✓ | - | ✓ | FK → postings.id | |
| checked_date | DATE | ✓ | - | ✓ | - | YYYY-MM-DD |
| rank | INT | - | NULL | - | CHECK 1-100 | NULL = 순위권 밖 |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |

**FK 제약조건**:
- `posting_id` → `postings.id` ON DELETE CASCADE

**복합 UNIQUE 인덱스**:
```sql
CREATE UNIQUE INDEX idx_ranking_history_unique ON ranking_history(posting_id, checked_date);
CREATE INDEX idx_ranking_history_date ON ranking_history(checked_date DESC);
```

---

### 2.12 Revenue (매출 집계)

**목적**: 서비스별/월별 매출 집계 (집계 테이블)

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| year | INT | ✓ | - | ✓ | CHECK >= 2020 | |
| half | ENUM | - | NULL | ✓ | 상반기, 하반기, NULL | |
| month | INT | ✓ | - | ✓ | CHECK 1-12 | |
| service_name | VARCHAR(50) | ✓ | - | ✓ | - | SEO, 프리미엄, 하나탑 |
| team_id | UUID | - | NULL | ✓ | FK → teams.id | 팀별 집계 (옵션) |
| total_revenue | DECIMAL(15,2) | ✓ | 0 | - | CHECK >= 0 | |
| contracts_count | INT | ✓ | 0 | - | CHECK >= 0 | |
| posting_cost | DECIMAL(15,2) | - | NULL | - | CHECK >= 0 | |
| posting_count | INT | - | NULL | - | CHECK >= 0 | |
| avg_contract_value | DECIMAL(15,2) | - | NULL | - | - | 계산 필드 |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE CASCADE
- `team_id` → `teams.id` ON DELETE CASCADE

**복합 UNIQUE 인덱스**:
```sql
CREATE UNIQUE INDEX idx_revenue_unique ON revenue(workspace_id, year, month, service_name, team_id);
CREATE INDEX idx_revenue_year_month ON revenue(year, month);
CREATE INDEX idx_revenue_service ON revenue(service_name);
```

---

### 2.13 Performance (성과 집계)

**목적**: 팀별/개인별 성과 집계 (집계 테이블)

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| workspace_id | UUID | ✓ | - | ✓ | FK → workspaces.id | |
| year | INT | ✓ | - | ✓ | CHECK >= 2020 | |
| half | ENUM | - | NULL | ✓ | 상반기, 하반기, NULL | |
| month | INT | ✓ | - | ✓ | CHECK 1-12 | |
| team_id | UUID | ✓ | - | ✓ | FK → teams.id | |
| member_id | UUID | ✓ | - | ✓ | FK → users.id | |
| monthly_revenue | DECIMAL(15,2) | ✓ | 0 | - | CHECK >= 0 | |
| contract_count | INT | ✓ | 0 | - | CHECK >= 0 | |
| company_count | INT | ✓ | 0 | - | CHECK >= 0 | 담당 업체 수 |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `workspace_id` → `workspaces.id` ON DELETE CASCADE
- `team_id` → `teams.id` ON DELETE CASCADE
- `member_id` → `users.id` ON DELETE CASCADE

**복합 UNIQUE 인덱스**:
```sql
CREATE UNIQUE INDEX idx_performance_unique ON performance(workspace_id, year, month, team_id, member_id);
CREATE INDEX idx_performance_year_month ON performance(year, month);
CREATE INDEX idx_performance_team ON performance(team_id);
CREATE INDEX idx_performance_member ON performance(member_id);
```

---

### 2.14 Membership (멤버십 구독)

**목적**: 사용자 멤버십 플랜 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| user_id | UUID | ✓ | - | UNIQUE | FK → users.id | 1 user = 1 active membership |
| level | ENUM | ✓ | 'BASIC' | ✓ | BASIC, STANDARD, PREMIUM | |
| status | ENUM | ✓ | '활성' | ✓ | 활성, 비활성, 만료 | |
| start_date | DATE | ✓ | - | - | - | |
| end_date | DATE | ✓ | - | ✓ | CHECK > start_date | |
| renewal_date | DATE | - | NULL | ✓ | - | 자동 갱신 예정일 |
| billing_cycle | ENUM | ✓ | 'monthly' | - | monthly, annual | |
| payment_method_id | UUID | - | NULL | ✓ | FK → payment_methods.id | |
| price_monthly | DECIMAL(10,2) | ✓ | - | - | CHECK >= 0 | |
| price_annual | DECIMAL(10,2) | ✓ | - | - | CHECK >= 0 | |
| is_auto_renew | BOOLEAN | ✓ | true | - | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `user_id` → `users.id` ON DELETE CASCADE
- `payment_method_id` → `payment_methods.id` ON DELETE SET NULL

**인덱스**:
```sql
CREATE UNIQUE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_level ON memberships(level);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_end_date ON memberships(end_date);
```

---

### 2.15 PaymentMethod (결제 수단)

**목적**: 사용자 결제 수단 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| user_id | UUID | ✓ | - | ✓ | FK → users.id | |
| type | ENUM | ✓ | 'card' | - | card, bank_transfer | |
| card_last4 | VARCHAR(4) | - | NULL | - | - | |
| card_brand | VARCHAR(20) | - | NULL | - | - | Visa, Mastercard, ... |
| expiry_month | INT | - | NULL | - | CHECK 1-12 | |
| expiry_year | INT | - | NULL | - | CHECK >= 2020 | |
| billing_name | VARCHAR(100) | - | NULL | - | - | |
| pg_token | VARCHAR(500) | - | NULL | - | - | 암호화 권장 |
| is_default | BOOLEAN | ✓ | false | - | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `user_id` → `users.id` ON DELETE CASCADE

**인덱스**:
```sql
CREATE INDEX idx_payment_methods_user ON payment_methods(user_id);
```

---

### 2.16 Payment (결제 내역)

**목적**: 결제 트랜잭션 기록

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| user_id | UUID | ✓ | - | ✓ | FK → users.id | |
| membership_id | UUID | - | NULL | ✓ | FK → memberships.id | |
| amount | DECIMAL(10,2) | ✓ | - | - | CHECK >= 0 | |
| currency | VARCHAR(3) | ✓ | 'KRW' | - | - | KRW, USD, ... |
| method | VARCHAR(50) | ✓ | - | - | - | card_****1234, bank_transfer |
| status | ENUM | ✓ | '진행중' | ✓ | 완료, 진행중, 실패, 환불 | |
| product_name | VARCHAR(100) | ✓ | - | - | - | |
| payment_date | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| receipt_url | VARCHAR(500) | - | NULL | - | - | |
| pg_transaction_id | VARCHAR(100) | - | NULL | ✓ | - | PG사 거래 ID |
| failure_reason | TEXT | - | NULL | - | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `user_id` → `users.id` ON DELETE RESTRICT
- `membership_id` → `memberships.id` ON DELETE SET NULL

**인덱스**:
```sql
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_membership ON payments(membership_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(payment_date DESC);
CREATE INDEX idx_payments_pg_txn ON payments(pg_transaction_id);
```

---

### 2.17 Notice (공지사항)

**목적**: 시스템 공지사항

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | INT | ✓ | AUTO_INCREMENT | PK | - | |
| type | ENUM | ✓ | '공지' | ✓ | 공지, 이벤트, 업데이트 | |
| title | VARCHAR(200) | ✓ | - | - | - | |
| content | TEXT | ✓ | - | - | - | HTML or Markdown |
| author_id | UUID | ✓ | - | ✓ | FK → users.id | |
| is_pinned | BOOLEAN | ✓ | false | ✓ | - | 상단 고정 |
| view_count | INT | ✓ | 0 | - | CHECK >= 0 | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `author_id` → `users.id` ON DELETE SET NULL

**인덱스**:
```sql
CREATE INDEX idx_notices_type ON notices(type);
CREATE INDEX idx_notices_pinned_created ON notices(is_pinned DESC, created_at DESC);
```

---

### 2.18 Inquiry (문의)

**목적**: 고객 지원 문의

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| user_id | UUID | ✓ | - | ✓ | FK → users.id | |
| subject | VARCHAR(200) | ✓ | - | - | - | |
| category | ENUM | ✓ | '기타' | ✓ | 버그, 기능요청, 기타 | |
| description | TEXT | ✓ | - | - | - | |
| attachment_url | VARCHAR(500) | - | NULL | - | - | |
| status | ENUM | ✓ | '접수' | ✓ | 접수, 답변중, 완료 | |
| response | TEXT | - | NULL | - | - | 관리자 답변 |
| responded_at | TIMESTAMP | - | NULL | ✓ | - | |
| responder_id | UUID | - | NULL | - | FK → users.id | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |
| updated_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | - | ON UPDATE | |

**FK 제약조건**:
- `user_id` → `users.id` ON DELETE RESTRICT
- `responder_id` → `users.id` ON DELETE SET NULL

**인덱스**:
```sql
CREATE INDEX idx_inquiries_user ON inquiries(user_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_category ON inquiries(category);
CREATE INDEX idx_inquiries_created ON inquiries(created_at DESC);
```

---

### 2.19 Notification (알림)

**목적**: 사용자 알림 관리

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| user_id | UUID | ✓ | - | ✓ | FK → users.id | |
| type | VARCHAR(50) | ✓ | - | ✓ | - | 계약만료, 업무완료, 순위변동 등 |
| message | TEXT | ✓ | - | - | - | |
| link_url | VARCHAR(500) | - | NULL | - | - | 클릭 시 이동할 URL |
| is_read | BOOLEAN | ✓ | false | ✓ | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |

**FK 제약조건**:
- `user_id` → `users.id` ON DELETE CASCADE

**인덱스**:
```sql
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
```

---

### 2.20 ChatMessage (챗봇 메시지)

**목적**: 챗봇 대화 이력

| 필드명 | 타입 | 필수 | 기본값 | 인덱스 | 제약조건 | 비고 |
|--------|------|------|--------|--------|----------|------|
| id | UUID | ✓ | uuid_generate_v4() | PK | - | |
| user_id | UUID | ✓ | - | ✓ | FK → users.id | |
| sender_type | ENUM | ✓ | - | - | user, bot, admin | |
| message | TEXT | ✓ | - | - | - | |
| created_at | TIMESTAMP | ✓ | CURRENT_TIMESTAMP | ✓ | - | |

**FK 제약조건**:
- `user_id` → `users.id` ON DELETE CASCADE

**인덱스**:
```sql
CREATE INDEX idx_chat_messages_user_created ON chat_messages(user_id, created_at DESC);
```

---

## 3. 엔티티 관계도 (ERD Summary)

### 3.1 주요 관계

```
Workspace (1) ─────────┬─────────────────────────────┐
                       │                             │
                       ├─ (N) Team                  │
                       │     └─ (1) User [lead]     │
                       │                             │
                       ├─ (N) WorkspaceUser          │
                       │     ├─ (1) User             │
                       │     └─ (1) Team             │
                       │                             │
                       ├─ (N) Customer               │
                       │                             │
                       ├─ (N) Contract               │
                       │     ├─ (1) Customer         │
                       │     ├─ (1) Team             │
                       │     ├─ (1) User [manager]   │
                       │     └─ (1) User [sales_rep] │
                       │                             │
                       ├─ (N) WorkTask               │
                       │     ├─ (1) Contract         │
                       │     ├─ (1) Team             │
                       │     ├─ (1) User [assignee]  │
                       │     └─ (N) KeywordAssignment│
                       │           ├─ (1) Team       │
                       │           └─ (1) User       │
                       │                             │
                       ├─ (N) Posting                │
                       │     ├─ (1) Customer         │
                       │     ├─ (1) Team             │
                       │     ├─ (1) User [manager]   │
                       │     ├─ (1) Posting [original] (Self)
                       │     └─ (N) RankingHistory   │
                       │                             │
                       ├─ (N) Keyword                │
                       │                             │
                       ├─ (N) Revenue                │
                       │     └─ (1) Team (optional)  │
                       │                             │
                       └─ (N) Performance            │
                             ├─ (1) Team             │
                             └─ (1) User [member]    │

User (1) ──────────────┬────────────────────────────┐
                       │                            │
                       ├─ (1) Membership            │
                       │     └─ (1) PaymentMethod   │
                       │                            │
                       ├─ (N) Payment               │
                       │     └─ (1) Membership      │
                       │                            │
                       ├─ (N) PaymentMethod         │
                       │                            │
                       ├─ (N) Inquiry               │
                       │                            │
                       ├─ (N) Notification          │
                       │                            │
                       └─ (N) ChatMessage           │
```

### 3.2 Cardinality 요약

| 관계 | Cardinality | FK 제약 | 비고 |
|------|-------------|---------|------|
| Workspace → Team | 1:N | CASCADE | |
| Workspace → Customer | 1:N | RESTRICT | |
| Workspace → Contract | 1:N | CASCADE | |
| Customer → Contract | 1:N | RESTRICT | |
| Contract → WorkTask | 1:N | CASCADE | |
| WorkTask → KeywordAssignment | 1:N | CASCADE | |
| Posting → RankingHistory | 1:N | CASCADE | |
| Posting → Posting (original) | 1:N (Self) | SET NULL | |
| Team → Contract | 1:N | RESTRICT | |
| Team → WorkTask | 1:N | RESTRICT | |
| User → Membership | 1:1 | CASCADE | |
| User → Payment | 1:N | RESTRICT | |
| Workspace ↔ User (WorkspaceUser) | N:N | CASCADE | 중간 테이블 |

---

## 4. 데이터 무결성 규칙

### 4.1 CHECK 제약조건

```sql
-- Contract
ALTER TABLE contracts ADD CONSTRAINT chk_contracts_amount CHECK (amount >= 0);
ALTER TABLE contracts ADD CONSTRAINT chk_contracts_dates CHECK (end_date > start_date);
ALTER TABLE contracts ADD CONSTRAINT chk_contracts_posting_count CHECK (posting_count IS NULL OR posting_count >= 0);

-- WorkTask
ALTER TABLE work_tasks ADD CONSTRAINT chk_worktasks_dates CHECK (end_date > start_date);
ALTER TABLE work_tasks ADD CONSTRAINT chk_worktasks_rank_limit CHECK (keyword_rank_limit IS NULL OR (keyword_rank_limit BETWEEN 1 AND 100));

-- Posting
ALTER TABLE postings ADD CONSTRAINT chk_postings_rank CHECK (current_rank IS NULL OR (current_rank BETWEEN 1 AND 100));
ALTER TABLE postings ADD CONSTRAINT chk_postings_threshold CHECK (contract_threshold IS NULL OR (contract_threshold BETWEEN 1 AND 100));

-- RankingHistory
ALTER TABLE ranking_history ADD CONSTRAINT chk_ranking_rank CHECK (rank IS NULL OR (rank BETWEEN 1 AND 100));

-- Revenue & Performance
ALTER TABLE revenue ADD CONSTRAINT chk_revenue_amount CHECK (total_revenue >= 0);
ALTER TABLE revenue ADD CONSTRAINT chk_revenue_year CHECK (year >= 2020);
ALTER TABLE revenue ADD CONSTRAINT chk_revenue_month CHECK (month BETWEEN 1 AND 12);

ALTER TABLE performance ADD CONSTRAINT chk_performance_revenue CHECK (monthly_revenue >= 0);
ALTER TABLE performance ADD CONSTRAINT chk_performance_year CHECK (year >= 2020);
ALTER TABLE performance ADD CONSTRAINT chk_performance_month CHECK (month BETWEEN 1 AND 12);

-- Payment
ALTER TABLE payments ADD CONSTRAINT chk_payments_amount CHECK (amount >= 0);
```

### 4.2 트리거 (Trigger) 권장사항

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

-- Notice.view_count 증가
-- (애플리케이션 로직으로 처리 권장)
```

---

## 5. 인덱싱 전략 요약

### 5.1 고빈도 쿼리 패턴

| 쿼리 패턴 | 인덱스 |
|-----------|--------|
| 워크스페이스별 계약 조회 + 정렬 | `(workspace_id, status, registration_date DESC)` |
| 팀별 업무 조회 + 담당자 필터 | `(team_id, assignee_id, status)` |
| 키워드별 포스팅 집계 | `(keyword)` |
| 포스팅 순위 이력 (30일) | `(posting_id, checked_date DESC)` |
| 사용자별 알림 (읽지 않은 것만) | `(user_id, is_read, created_at DESC)` |

### 5.2 복합 인덱스 vs 단일 인덱스

**복합 인덱스 우선**:
- WHERE + ORDER BY가 함께 쓰이는 경우
- 예: `WHERE workspace_id = ? AND status = ? ORDER BY created_at DESC`
  → `(workspace_id, status, created_at DESC)`

**단일 인덱스**:
- UNIQUE 제약 (email, contract_number 등)
- FK (자동 생성 권장)

---

## 6. 다음 단계

### 6.1 ERD 다이어그램 작성

**도구 권장**:
- [dbdiagram.io](https://dbdiagram.io) (온라인, 무료)
- [Draw.io](https://draw.io) (오프라인, 무료)
- [Lucidchart](https://lucidchart.com) (유료, 협업 기능)

**포함 사항**:
- 모든 엔티티 (테이블)
- PK, FK 표시
- 관계선 (1:1, 1:N, N:N)
- Cardinality 및 Optionality 표시

---

### 6.2 Prisma 스키마 작성

**파일**: `prisma/schema.prisma`

**예시** (User 엔티티):
```prisma
model User {
  id                  String       @id @default(uuid())
  name                String       @db.VarChar(50)
  email               String       @unique @db.VarChar(100)
  passwordHash        String       @map("password_hash") @db.VarChar(255)
  phone               String?      @db.VarChar(20)
  companyName         String?      @map("company_name") @db.VarChar(100)
  position            String?      @db.VarChar(50)
  avatarUrl           String?      @map("avatar_url") @db.VarChar(500)
  twoFactorEnabled    Boolean      @default(false) @map("two_factor_enabled")
  lastLoginAt         DateTime?    @map("last_login_at")
  createdAt           DateTime     @default(now()) @map("created_at")
  updatedAt           DateTime     @updatedAt @map("updated_at")
  deletedAt           DateTime?    @map("deleted_at")

  // Relations
  ownedWorkspaces     Workspace[]  @relation("WorkspaceOwner")
  workspaceUsers      WorkspaceUser[]
  teamsLed            Team[]       @relation("TeamLead")
  contracts           Contract[]   @relation("ContractManager")
  salesContracts      Contract[]   @relation("ContractSalesRep")
  workTasks           WorkTask[]   @relation("WorkTaskAssignee")
  postings            Posting[]    @relation("PostingManager")
  membership          Membership?
  payments            Payment[]
  paymentMethods      PaymentMethod[]
  inquiries           Inquiry[]
  inquiryResponses    Inquiry[]    @relation("InquiryResponder")
  notifications       Notification[]
  chatMessages        ChatMessage[]
  performances        Performance[]

  @@index([email])
  @@index([lastLoginAt])
  @@index([deletedAt])
  @@map("users")
}
```

---

### 6.3 마이그레이션 전략

**초기 마이그레이션**:
```bash
npx prisma migrate dev --name init
```

**이후 변경사항**:
```bash
npx prisma migrate dev --name add_keyword_saturation_field
```

**프로덕션 배포**:
```bash
npx prisma migrate deploy
```

---

## 7. 체크리스트

- [x] 모든 핵심 엔티티 정의 완료
- [x] 엔티티별 필드, 타입, 제약조건 명시
- [x] FK 관계 및 ON DELETE/UPDATE 정책 정의
- [x] 인덱스 전략 수립
- [x] 복합 UNIQUE 인덱스 정의
- [x] CHECK 제약조건 명시
- [x] 트리거 필요 여부 판단
- [ ] ERD 다이어그램 작성 (**다음 단계**)
- [ ] Prisma 스키마 구현 (**다음 단계**)
- [ ] 마이그레이션 파일 생성 (**다음 단계**)

---

**작성 완료일**: 2025-11-11

**다음 문서**: `docs/erd-v0.1.png`, `prisma/schema.prisma`
