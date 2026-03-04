-- ============================================
-- AgOffice ERD v0.1 - MariaDB DDL
-- ============================================
-- 작성일: 2025-11-11
-- 데이터베이스: MariaDB 10.6+
-- 문자셋: utf8mb4
-- Collation: utf8mb4_unicode_ci
-- ============================================

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS agoffice
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE agoffice;

-- ============================================
-- 1. 조직/사용자 관리
-- ============================================

-- users: 시스템 사용자
CREATE TABLE users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NULL,
  company_name VARCHAR(100) NULL,
  position VARCHAR(50) NULL,
  avatar_url VARCHAR(500) NULL,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,

  INDEX idx_users_email (email),
  INDEX idx_users_last_login (last_login_at),
  INDEX idx_users_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='시스템 사용자 (계정)';

-- workspaces: 워크스페이스 (다중 테넌트)
CREATE TABLE workspaces (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500) NULL,
  description TEXT NULL,
  owner_id CHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_workspaces_owner (owner_id),

  CONSTRAINT fk_workspaces_owner
    FOREIGN KEY (owner_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='워크스페이스 (다중 테넌트)';

-- teams: 팀/부서
CREATE TABLE teams (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  name VARCHAR(50) NOT NULL,
  department VARCHAR(50) NULL,
  lead_id CHAR(36) NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_teams_workspace (workspace_id),
  INDEX idx_teams_lead (lead_id),
  UNIQUE INDEX idx_teams_workspace_name (workspace_id, name),

  CONSTRAINT fk_teams_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_teams_lead
    FOREIGN KEY (lead_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='팀/부서';

-- workspace_users: 워크스페이스 멤버십 (N:N 중간 테이블)
CREATE TABLE workspace_users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  team_id CHAR(36) NULL,
  role ENUM('Owner', 'Admin', 'Manager', 'Member') NOT NULL DEFAULT 'Member',
  status ENUM('활성', '비활성', '초대중') NOT NULL DEFAULT '초대중',
  joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_workspace_users_workspace (workspace_id),
  INDEX idx_workspace_users_user (user_id),
  INDEX idx_workspace_users_team (team_id),
  INDEX idx_workspace_users_role (role),
  INDEX idx_workspace_users_status (status),
  UNIQUE INDEX idx_workspace_users_unique (workspace_id, user_id),

  CONSTRAINT fk_workspace_users_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_workspace_users_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_workspace_users_team
    FOREIGN KEY (team_id) REFERENCES teams(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='워크스페이스 멤버십 (N:N 중간 테이블)';

-- ============================================
-- 2. 고객 및 계약 관리
-- ============================================

-- customers: 고객사 정보
CREATE TABLE customers (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NULL,
  region_sido VARCHAR(20) NULL COMMENT '서울, 경기 등',
  region_sigungu VARCHAR(50) NULL COMMENT '강남구, 수원시 등',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_customers_workspace (workspace_id),
  INDEX idx_customers_company_name (company_name),
  INDEX idx_customers_region (region_sido, region_sigungu),

  CONSTRAINT fk_customers_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='고객사 정보';

-- contracts: 고객 계약
CREATE TABLE contracts (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  contract_number VARCHAR(20) NOT NULL UNIQUE COMMENT 'CT-YYYY-###',
  contract_type ENUM('월계약', '프로젝트', '연계약') NOT NULL,
  status ENUM('신규', '연장', '확장') NOT NULL DEFAULT '신규',
  customer_id CHAR(36) NOT NULL,
  team_id CHAR(36) NOT NULL,
  manager_id CHAR(36) NOT NULL,
  sales_rep_id CHAR(36) NOT NULL,
  services JSON NOT NULL COMMENT 'Array: SEO, 프리미엄, 하나탑',
  amount DECIMAL(15,2) NOT NULL,
  posting_count INT NULL,
  ad_cost_total DECIMAL(15,2) NULL,
  ad_cost_monthly DECIMAL(15,2) NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_expired BOOLEAN NOT NULL DEFAULT FALSE,
  registration_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_contracts_workspace (workspace_id),
  INDEX idx_contracts_customer (customer_id),
  INDEX idx_contracts_team (team_id),
  INDEX idx_contracts_manager (manager_id),
  INDEX idx_contracts_sales_rep (sales_rep_id),
  INDEX idx_contracts_status_regdate (status, registration_date DESC),
  INDEX idx_contracts_dates (start_date, end_date),
  INDEX idx_contracts_expired (is_expired),

  CONSTRAINT fk_contracts_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_contracts_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_contracts_team
    FOREIGN KEY (team_id) REFERENCES teams(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_contracts_manager
    FOREIGN KEY (manager_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_contracts_sales_rep
    FOREIGN KEY (sales_rep_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT chk_contracts_amount CHECK (amount >= 0),
  CONSTRAINT chk_contracts_dates CHECK (end_date > start_date),
  CONSTRAINT chk_contracts_posting_count CHECK (posting_count IS NULL OR posting_count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='고객 계약';

-- ============================================
-- 3. 업무 관리
-- ============================================

-- work_tasks: 업무/작업 관리
CREATE TABLE work_tasks (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  contract_id CHAR(36) NOT NULL,
  service_type VARCHAR(50) NOT NULL COMMENT 'SEO 최적화, SNS 마케팅 등',
  description TEXT NULL,
  team_id CHAR(36) NOT NULL,
  assignee_id CHAR(36) NOT NULL,
  target_keywords TEXT NULL COMMENT '쉼표 구분 or JSON',
  keyword_rank_limit INT NULL,
  status ENUM('진행중', '완료', '대기', '보류') NOT NULL DEFAULT '대기',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_worktasks_workspace (workspace_id),
  INDEX idx_worktasks_contract (contract_id),
  INDEX idx_worktasks_team (team_id),
  INDEX idx_worktasks_assignee (assignee_id),
  INDEX idx_worktasks_status_created (status, created_at DESC),
  INDEX idx_worktasks_dates (start_date, end_date),

  CONSTRAINT fk_worktasks_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_worktasks_contract
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_worktasks_team
    FOREIGN KEY (team_id) REFERENCES teams(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_worktasks_assignee
    FOREIGN KEY (assignee_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT chk_worktasks_dates CHECK (end_date > start_date),
  CONSTRAINT chk_worktasks_rank_limit CHECK (keyword_rank_limit IS NULL OR keyword_rank_limit BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='업무/작업 관리';

-- keyword_assignments: 업무별 키워드 할당
CREATE TABLE keyword_assignments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  work_task_id CHAR(36) NOT NULL,
  keyword_name VARCHAR(100) NOT NULL,
  assigned_team_id CHAR(36) NOT NULL,
  assigned_user_id CHAR(36) NOT NULL,
  rank_limit INT NULL,
  is_target_keyword BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_keyword_assignments_task (work_task_id),
  INDEX idx_keyword_assignments_keyword (keyword_name),
  INDEX idx_keyword_assignments_user (assigned_user_id),
  INDEX idx_keyword_assignments_team (assigned_team_id),

  CONSTRAINT fk_keyword_assignments_task
    FOREIGN KEY (work_task_id) REFERENCES work_tasks(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_keyword_assignments_team
    FOREIGN KEY (assigned_team_id) REFERENCES teams(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_keyword_assignments_user
    FOREIGN KEY (assigned_user_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT chk_keyword_assignments_rank_limit CHECK (rank_limit IS NULL OR rank_limit BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='업무별 키워드 할당';

-- ============================================
-- 4. 키워드 및 포스팅 추적
-- ============================================

-- keywords: 키워드 마스터
CREATE TABLE keywords (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  competition_level ENUM('아주좋음', '좋음', '보통', '나쁨', '아주나쁨') NULL,
  monthly_search_volume INT NULL COMMENT 'Naver API',
  monthly_post_volume INT NULL,
  blog_saturation DECIMAL(5,2) NULL COMMENT '0-100%',
  is_target BOOLEAN NOT NULL DEFAULT FALSE,
  is_tracking_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_keywords_workspace (workspace_id),
  UNIQUE INDEX idx_keywords_workspace_name (workspace_id, name),
  INDEX idx_keywords_competition (competition_level),
  INDEX idx_keywords_target (is_target),
  INDEX idx_keywords_tracking (is_tracking_active),

  CONSTRAINT fk_keywords_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='키워드 마스터';

-- postings: 블로그 포스팅 추적
CREATE TABLE postings (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  blog_url VARCHAR(500) NOT NULL UNIQUE,
  customer_id CHAR(36) NOT NULL,
  title VARCHAR(200) NOT NULL,
  keyword VARCHAR(100) NOT NULL COMMENT '또는 keyword_id FK',
  manager_id CHAR(36) NOT NULL,
  team_id CHAR(36) NOT NULL,
  category ENUM('신규', '재작업') NOT NULL DEFAULT '신규',
  contract_threshold INT NULL,
  current_rank INT NULL,
  rank_change INT NULL COMMENT '계산 필드',
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  original_posting_id CHAR(36) NULL COMMENT 'Self-reference for 재작업',
  is_tracking_active BOOLEAN NOT NULL DEFAULT TRUE,
  registered_date DATE NOT NULL DEFAULT (CURRENT_DATE),
  last_checked DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_postings_workspace (workspace_id),
  INDEX idx_postings_customer (customer_id),
  INDEX idx_postings_keyword (keyword),
  INDEX idx_postings_manager (manager_id),
  INDEX idx_postings_team (team_id),
  INDEX idx_postings_category_rank (category, current_rank),
  INDEX idx_postings_favorite (is_favorite),
  INDEX idx_postings_registered (registered_date DESC),
  INDEX idx_postings_last_checked (last_checked),
  INDEX idx_postings_original (original_posting_id),

  CONSTRAINT fk_postings_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_postings_customer
    FOREIGN KEY (customer_id) REFERENCES customers(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_postings_manager
    FOREIGN KEY (manager_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_postings_team
    FOREIGN KEY (team_id) REFERENCES teams(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_postings_original
    FOREIGN KEY (original_posting_id) REFERENCES postings(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT chk_postings_rank CHECK (current_rank IS NULL OR current_rank BETWEEN 1 AND 100),
  CONSTRAINT chk_postings_threshold CHECK (contract_threshold IS NULL OR contract_threshold BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='블로그 포스팅 추적';

-- ranking_history: 포스팅 순위 이력 (일별)
CREATE TABLE ranking_history (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  posting_id CHAR(36) NOT NULL,
  checked_date DATE NOT NULL,
  rank INT NULL COMMENT 'NULL = 순위권 밖',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_ranking_history_posting (posting_id),
  INDEX idx_ranking_history_date (checked_date DESC),
  UNIQUE INDEX idx_ranking_history_unique (posting_id, checked_date),

  CONSTRAINT fk_ranking_history_posting
    FOREIGN KEY (posting_id) REFERENCES postings(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT chk_ranking_history_rank CHECK (rank IS NULL OR rank BETWEEN 1 AND 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='포스팅 순위 이력 (일별)';

-- ============================================
-- 5. 집계 테이블 (매출/성과)
-- ============================================

-- revenue: 매출 집계 (서비스별/월별)
CREATE TABLE revenue (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  year INT NOT NULL,
  half ENUM('상반기', '하반기') NULL,
  month INT NOT NULL,
  service_name VARCHAR(50) NOT NULL COMMENT 'SEO, 프리미엄, 하나탑',
  team_id CHAR(36) NULL,
  total_revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
  contracts_count INT NOT NULL DEFAULT 0,
  posting_cost DECIMAL(15,2) NULL,
  posting_count INT NULL,
  avg_contract_value DECIMAL(15,2) NULL COMMENT '계산 필드',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_revenue_workspace (workspace_id),
  INDEX idx_revenue_year_month (year, month),
  INDEX idx_revenue_service (service_name),
  INDEX idx_revenue_team (team_id),
  UNIQUE INDEX idx_revenue_unique (workspace_id, year, month, service_name, team_id),

  CONSTRAINT fk_revenue_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_revenue_team
    FOREIGN KEY (team_id) REFERENCES teams(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT chk_revenue_amount CHECK (total_revenue >= 0),
  CONSTRAINT chk_revenue_year CHECK (year >= 2020),
  CONSTRAINT chk_revenue_month CHECK (month BETWEEN 1 AND 12),
  CONSTRAINT chk_revenue_count CHECK (contracts_count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='매출 집계 (서비스별/월별)';

-- performance: 성과 집계 (팀/개인별)
CREATE TABLE performance (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  workspace_id CHAR(36) NOT NULL,
  year INT NOT NULL,
  half ENUM('상반기', '하반기') NULL,
  month INT NOT NULL,
  team_id CHAR(36) NOT NULL,
  member_id CHAR(36) NOT NULL,
  monthly_revenue DECIMAL(15,2) NOT NULL DEFAULT 0,
  contract_count INT NOT NULL DEFAULT 0,
  company_count INT NOT NULL DEFAULT 0 COMMENT '담당 업체 수',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_performance_workspace (workspace_id),
  INDEX idx_performance_year_month (year, month),
  INDEX idx_performance_team (team_id),
  INDEX idx_performance_member (member_id),
  UNIQUE INDEX idx_performance_unique (workspace_id, year, month, team_id, member_id),

  CONSTRAINT fk_performance_workspace
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_performance_team
    FOREIGN KEY (team_id) REFERENCES teams(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_performance_member
    FOREIGN KEY (member_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT chk_performance_revenue CHECK (monthly_revenue >= 0),
  CONSTRAINT chk_performance_year CHECK (year >= 2020),
  CONSTRAINT chk_performance_month CHECK (month BETWEEN 1 AND 12),
  CONSTRAINT chk_performance_counts CHECK (contract_count >= 0 AND company_count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='성과 집계 (팀/개인별)';

-- ============================================
-- 6. 멤버십 및 결제
-- ============================================

-- payment_methods: 결제 수단 (memberships보다 먼저 생성)
CREATE TABLE payment_methods (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  type ENUM('card', 'bank_transfer') NOT NULL DEFAULT 'card',
  card_last4 VARCHAR(4) NULL,
  card_brand VARCHAR(20) NULL COMMENT 'Visa, Mastercard, ...',
  expiry_month INT NULL,
  expiry_year INT NULL,
  billing_name VARCHAR(100) NULL,
  pg_token VARCHAR(500) NULL COMMENT '암호화 권장',
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_payment_methods_user (user_id),
  INDEX idx_payment_methods_default (is_default),

  CONSTRAINT fk_payment_methods_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

  CONSTRAINT chk_payment_methods_expiry_month CHECK (expiry_month IS NULL OR expiry_month BETWEEN 1 AND 12),
  CONSTRAINT chk_payment_methods_expiry_year CHECK (expiry_year IS NULL OR expiry_year >= 2020)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='결제 수단';

-- memberships: 사용자 멤버십 구독
CREATE TABLE memberships (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL UNIQUE,
  level ENUM('BASIC', 'STANDARD', 'PREMIUM') NOT NULL DEFAULT 'BASIC',
  status ENUM('활성', '비활성', '만료') NOT NULL DEFAULT '활성',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  renewal_date DATE NULL,
  billing_cycle ENUM('monthly', 'annual') NOT NULL,
  payment_method_id CHAR(36) NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_annual DECIMAL(10,2) NOT NULL,
  is_auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_memberships_level (level),
  INDEX idx_memberships_status (status),
  INDEX idx_memberships_end_date (end_date),
  INDEX idx_memberships_payment_method (payment_method_id),

  CONSTRAINT fk_memberships_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_memberships_payment_method
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT chk_memberships_dates CHECK (end_date > start_date),
  CONSTRAINT chk_memberships_prices CHECK (price_monthly >= 0 AND price_annual >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='사용자 멤버십 구독';

-- payments: 결제 내역
CREATE TABLE payments (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  membership_id CHAR(36) NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'KRW',
  method VARCHAR(50) NOT NULL,
  status ENUM('완료', '진행중', '실패', '환불') NOT NULL DEFAULT '진행중',
  product_name VARCHAR(100) NOT NULL,
  payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  receipt_url VARCHAR(500) NULL,
  pg_transaction_id VARCHAR(100) NULL,
  failure_reason TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_payments_user (user_id),
  INDEX idx_payments_membership (membership_id),
  INDEX idx_payments_status (status),
  INDEX idx_payments_date (payment_date DESC),
  INDEX idx_payments_pg_txn (pg_transaction_id),

  CONSTRAINT fk_payments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_payments_membership
    FOREIGN KEY (membership_id) REFERENCES memberships(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT chk_payments_amount CHECK (amount >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='결제 내역';

-- ============================================
-- 7. 지원 기능
-- ============================================

-- notices: 공지사항
CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('공지', '이벤트', '업데이트') NOT NULL DEFAULT '공지',
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id CHAR(36) NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_notices_type (type),
  INDEX idx_notices_pinned_created (is_pinned DESC, created_at DESC),
  INDEX idx_notices_author (author_id),

  CONSTRAINT fk_notices_author
    FOREIGN KEY (author_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,

  CONSTRAINT chk_notices_view_count CHECK (view_count >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='공지사항';

-- inquiries: 고객 문의
CREATE TABLE inquiries (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  subject VARCHAR(200) NOT NULL,
  category ENUM('버그', '기능요청', '기타') NOT NULL DEFAULT '기타',
  description TEXT NOT NULL,
  attachment_url VARCHAR(500) NULL,
  status ENUM('접수', '답변중', '완료') NOT NULL DEFAULT '접수',
  response TEXT NULL,
  responded_at DATETIME NULL,
  responder_id CHAR(36) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_inquiries_user (user_id),
  INDEX idx_inquiries_category (category),
  INDEX idx_inquiries_status (status),
  INDEX idx_inquiries_created (created_at DESC),
  INDEX idx_inquiries_responder (responder_id),

  CONSTRAINT fk_inquiries_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT fk_inquiries_responder
    FOREIGN KEY (responder_id) REFERENCES users(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='고객 문의';

-- notifications: 사용자 알림
CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL COMMENT '계약만료, 업무완료, 순위변동 등',
  message TEXT NOT NULL,
  link_url VARCHAR(500) NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_notifications_user_read (user_id, is_read),
  INDEX idx_notifications_created (created_at DESC),
  INDEX idx_notifications_type (type),

  CONSTRAINT fk_notifications_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='사용자 알림';

-- chat_messages: 챗봇 메시지 이력
CREATE TABLE chat_messages (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  sender_type ENUM('user', 'bot', 'admin') NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_chat_messages_user_created (user_id, created_at DESC),
  INDEX idx_chat_messages_sender_type (sender_type),

  CONSTRAINT fk_chat_messages_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='챗봇 메시지 이력';

-- ============================================
-- 8. Triggers (자동 계산)
-- ============================================

-- Contract.is_expired 자동 업데이트
DELIMITER $$
CREATE TRIGGER trg_contracts_update_expired
BEFORE UPDATE ON contracts
FOR EACH ROW
BEGIN
  SET NEW.is_expired = (NEW.end_date < CURDATE());
END$$
DELIMITER ;

-- Posting.rank_change 자동 계산
DELIMITER $$
CREATE TRIGGER trg_postings_calculate_rank_change
BEFORE UPDATE ON postings
FOR EACH ROW
BEGIN
  IF NEW.current_rank IS NOT NULL AND OLD.current_rank IS NOT NULL THEN
    SET NEW.rank_change = NEW.current_rank - OLD.current_rank;
  END IF;
END$$
DELIMITER ;

-- ============================================
-- 9. 초기 데이터 (시드)
-- ============================================

-- 관리자 계정 (비밀번호: password123 의 bcrypt 해시)
INSERT INTO users (id, name, email, password_hash, created_at)
VALUES (
  UUID(),
  '관리자',
  'admin@agoffice.com',
  '$2b$10$rBV2ifXHXRGLmNKnBq7.xOq/HgZZK.5KYY5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  CURRENT_TIMESTAMP
);

-- ============================================
-- 완료
-- ============================================
-- 스크립트 실행 완료
-- 다음 단계: 시드 데이터 추가, Prisma 스키마 생성
