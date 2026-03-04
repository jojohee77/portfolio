# 프로필 & 설정 화면 매핑

## 문서 정보
- **작성일**: 2025-11-11
- **대상 화면**: 프로필, 멤버십, 결제, 문의, 조직 관리, 공지사항, 챗봇
- **우선순위**: Medium (지원 기능)

---

## 1. 프로필 관리 화면 (/profile/account)

### 1.1 화면 개요

**목적**: 사용자 개인 정보 조회 및 수정

**주요 기능**:
- 기본 정보 수정 (이름, 이메일, 전화번호 등)
- 비밀번호 변경
- 프로필 이미지 업로드
- 2단계 인증 설정

---

### 1.2 데이터 매핑 - 계정 정보

| 화면 필드명 | 매핑 엔티티 | 필드명 | 타입 | 필수 | 수정 가능 | 비고 |
|-------------|-------------|--------|------|------|-----------|------|
| **사용자 이름** | User | name | String(50) | ✓ | ✓ | |
| **이메일** | User | email | String(100) | ✓ | ✓ | UNIQUE, 인증 필요 |
| **전화번호** | User | phone | String(20) | - | ✓ | 형식: 010-####-#### |
| **회사명** | User | company_name | String(100) | - | ✓ | |
| **직책/역할** | User | position | String(50) | - | ✓ | |
| **프로필 이미지** | User | avatar_url | String(500) | - | ✓ | S3/Cloud Storage URL |
| **비밀번호** | User | password_hash | String(255) | ✓ | ✓ | 별도 변경 폼 |
| **2단계 인증** | User | two_factor_enabled | Boolean | ✓ | ✓ | 기본값: false |
| **가입일** | User | created_at | DateTime | ✓ | ❌ | 읽기 전용 |
| **마지막 로그인** | User | last_login_at | DateTime | - | ❌ | 읽기 전용 |

---

### 1.3 CRUD 작업

#### 1.3.1 프로필 조회 (Read)

**API 엔드포인트**: `GET /api/users/me`

**응답**:
```typescript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  company_name: string,
  position: string,
  avatar_url: string,
  two_factor_enabled: boolean,
  created_at: string,
  last_login_at: string
}
```

---

#### 1.3.2 프로필 수정 (Update)

**트리거**: "저장" 버튼 클릭

**입력 필드**:

| 필드명 | 필수 | 검증 규칙 |
|--------|------|-----------|
| 이름 | ✓ | 2-50자 |
| 이메일 | ✓ | 이메일 형식, UNIQUE |
| 전화번호 | - | 정규식: 010-####-#### |
| 회사명 | - | 최대 100자 |
| 직책 | - | 최대 50자 |

**저장 로직**:
1. 입력 검증
2. 이메일 변경 시 인증 메일 발송 (변경 전 이메일 유지)
3. User 레코드 업데이트
4. `updated_at` 자동 갱신
5. 성공 토스트

**API 엔드포인트**: `PATCH /api/users/me`

---

#### 1.3.3 비밀번호 변경

**트리거**: "비밀번호 변경" 버튼 클릭 → 모달 오픈

**입력 필드**:

| 필드명 | 필수 | 검증 규칙 |
|--------|------|-----------|
| 현재 비밀번호 | ✓ | - |
| 새 비밀번호 | ✓ | 최소 8자, 영문+숫자+특수문자 |
| 새 비밀번호 확인 | ✓ | 새 비밀번호와 일치 |

**저장 로직**:
1. 현재 비밀번호 검증 (bcrypt.compare)
2. 새 비밀번호 해싱 (bcrypt.hash)
3. User.password_hash 업데이트
4. 세션 무효화 (옵션: 다른 기기 로그아웃)
5. 성공 토스트 + 로그인 페이지로 리다이렉트 (옵션)

**API 엔드포인트**: `POST /api/users/me/change-password`

---

#### 1.3.4 프로필 이미지 업로드

**트리거**: 이미지 영역 클릭 → 파일 선택

**검증 규칙**:
- 파일 타입: JPG, PNG, GIF
- 최대 크기: 5MB
- 권장 크기: 200x200px (정사각형)

**저장 로직**:
1. 파일 업로드 (S3, Cloudflare Images, Vercel Blob 등)
2. URL 반환
3. User.avatar_url 업데이트
4. 이전 이미지 삭제 (옵션)
5. 성공 토스트

**API 엔드포인트**: `POST /api/users/me/avatar`

---

#### 1.3.5 2단계 인증 설정

**트리거**: 토글 스위치

**활성화 흐름**:
1. QR 코드 생성 (Google Authenticator 등)
2. 사용자가 인증 앱에 등록
3. 6자리 코드 입력 확인
4. User.two_factor_enabled = true
5. 백업 코드 생성 및 다운로드

**비활성화 흐름**:
1. 현재 비밀번호 입력
2. 6자리 코드 입력 (또는 백업 코드)
3. User.two_factor_enabled = false

**API 엔드포인트**:
- `POST /api/users/me/2fa/enable`
- `POST /api/users/me/2fa/disable`

---

### 1.4 데이터 검증 규칙 (Zod Schema)

```typescript
const UserProfileSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email().max(100),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/).optional(),
  company_name: z.string().max(100).optional(),
  position: z.string().max(50).optional(),
});

const ChangePasswordSchema = z.object({
  current_password: z.string(),
  new_password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/),
  new_password_confirm: z.string(),
}).refine((data) => data.new_password === data.new_password_confirm, {
  message: "새 비밀번호가 일치하지 않습니다.",
  path: ["new_password_confirm"],
});
```

---

## 2. 멤버십 관리 화면 (/profile/membership)

### 2.1 화면 개요

**목적**: 현재 멤버십 상태 조회 및 플랜 변경

**주요 기능**:
- 현재 멤버십 정보 표시
- 플랜 업그레이드/다운그레이드
- 멤버십 연장
- 결제 수단 관리

---

### 2.2 데이터 매핑 - 멤버십 정보

| 화면 필드명 | 매핑 엔티티 | 필드명 | 타입 | 필수 | 수정 가능 |
|-------------|-------------|--------|------|------|-----------|
| **멤버십 레벨** | Membership | level | Enum | ✓ | ✓ | BASIC, STANDARD, PREMIUM |
| **멤버십 설명** | - | - | Text | - | ❌ | 정적 데이터 |
| **기능 목록** | - | - | Array | - | ❌ | 정적 데이터 |
| **상태** | Membership | status | Enum | ✓ | ❌ | 활성, 비활성, 만료 |
| **시작일** | Membership | start_date | Date | ✓ | ❌ | |
| **종료일** | Membership | end_date | Date | ✓ | ❌ | |
| **갱신일** | Membership | renewal_date | Date | - | ❌ | 자동 갱신 예정일 |
| **결제 수단** | Membership | payment_method | String(50) | - | ✓ | 카드, 계좌이체 |
| **카드 정보** | PaymentMethod | card_last4 | String(4) | - | ✓ | 마지막 4자리만 |
| **월간 가격** | Membership | price_monthly | Decimal(10,2) | ✓ | ❌ | |
| **연간 가격** | Membership | price_annual | Decimal(10,2) | ✓ | ❌ | 할인 적용 |

---

### 2.3 멤버십 플랜 정보 (정적 데이터)

| 플랜 | 월간 가격 | 연간 가격 | 주요 기능 |
|------|-----------|-----------|-----------|
| **BASIC** | ₩ 50,000 | ₩ 540,000 (10% 할인) | 계약 관리, 업무 관리, 기본 리포트 |
| **STANDARD** | ₩ 100,000 | ₩ 1,080,000 (10% 할인) | BASIC + 포스팅 추적, 키워드 분석, 팀 관리 (최대 5명) |
| **PREMIUM** | ₩ 200,000 | ₩ 2,160,000 (10% 할인) | STANDARD + 무제한 팀원, 고급 분석, API 접근, 우선 지원 |

---

### 2.4 CRUD 작업

#### 2.4.1 멤버십 조회 (Read)

**API 엔드포인트**: `GET /api/memberships/me`

**응답**:
```typescript
{
  id: string,
  user_id: string,
  level: 'BASIC' | 'STANDARD' | 'PREMIUM',
  status: '활성' | '비활성' | '만료',
  start_date: string,
  end_date: string,
  renewal_date: string,
  payment_method: string,
  price_monthly: number,
  price_annual: number,
  card_last4: string
}
```

---

#### 2.4.2 플랜 변경 (Update)

**트리거**: "업그레이드" or "플랜 변경" 버튼 클릭 → 플랜 선택 페이지로 이동

**흐름**:
1. 플랜 선택 (BASIC, STANDARD, PREMIUM)
2. 결제 주기 선택 (월간, 연간)
3. 결제 수단 선택/등록
4. 결제 처리
5. 멤버십 레코드 업데이트
6. 완료 페이지

**API 엔드포인트**: `POST /api/memberships/me/change-plan`

**요청 Body**:
```typescript
{
  new_level: 'STANDARD',
  billing_cycle: 'annual',
  payment_method_id: string
}
```

**비즈니스 로직**:
- **업그레이드**: 즉시 적용, 차액 결제
- **다운그레이드**: 다음 갱신일부터 적용, 환불 없음
- **연간 → 월간**: 다음 갱신일부터 적용
- **월간 → 연간**: 즉시 전환, 할인 혜택

---

#### 2.4.3 멤버십 연장

**트리거**: "연장" 버튼 클릭

**흐름**:
1. 현재 플랜 및 가격 확인
2. 결제 수단 확인
3. 결제 처리
4. `end_date` 연장 (+ 1개월 or + 1년)
5. 성공 토스트

**API 엔드포인트**: `POST /api/memberships/me/renew`

---

#### 2.4.4 결제 수단 변경

**트리거**: "결제 수단 변경" 버튼 클릭 → 모달 오픈

**입력 필드**:
- 카드 번호 (16자리)
- 유효기간 (MM/YY)
- CVC (3-4자리)
- 카드 소유자 이름

**저장 로직**:
1. 카드 정보 검증 (PG사 API: Stripe, 토스페이먼츠 등)
2. 토큰 생성 (카드 정보는 저장 안 함)
3. PaymentMethod 레코드 생성/업데이트
4. Membership.payment_method_id 업데이트
5. 성공 토스트

**API 엔드포인트**: `POST /api/payment-methods`

---

### 2.5 데이터 스키마 - Membership 테이블

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | UUID | ✓ | PK | |
| user_id | UUID | ✓ | ✓ | FK: users.id, UNIQUE (1 user = 1 active membership) |
| level | Enum | ✓ | ✓ | BASIC, STANDARD, PREMIUM |
| status | Enum | ✓ | ✓ | 활성, 비활성, 만료 |
| start_date | Date | ✓ | - | |
| end_date | Date | ✓ | ✓ | 만료일 체크용 |
| renewal_date | Date | - | ✓ | 자동 갱신 예정일 |
| billing_cycle | Enum | ✓ | - | monthly, annual |
| payment_method_id | UUID | - | ✓ | FK: payment_methods.id |
| price_monthly | Decimal(10,2) | ✓ | - | |
| price_annual | Decimal(10,2) | ✓ | - | |
| is_auto_renew | Boolean | ✓ | - | 기본값: true |
| created_at | DateTime | ✓ | ✓ | |
| updated_at | DateTime | ✓ | - | |

---

### 2.6 데이터 스키마 - PaymentMethod 테이블

| 필드명 | 타입 | 필수 | 비고 |
|--------|------|------|------|
| id | UUID | ✓ | PK |
| user_id | UUID | ✓ | FK: users.id |
| type | Enum | ✓ | card, bank_transfer |
| card_last4 | String(4) | - | 카드 마지막 4자리 |
| card_brand | String(20) | - | Visa, Mastercard, Amex, ... |
| expiry_month | Int | - | 1-12 |
| expiry_year | Int | - | 2025, 2026, ... |
| billing_name | String(100) | - | 카드 소유자 이름 |
| pg_token | String(500) | - | PG사 토큰 (암호화 권장) |
| is_default | Boolean | ✓ | 기본 결제 수단 |
| created_at | DateTime | ✓ | |
| updated_at | DateTime | ✓ | |

---

## 3. 결제 내역 화면 (/profile/payment)

### 3.1 화면 개요

**목적**: 과거 결제 내역 조회 및 영수증 다운로드

**주요 기능**:
- 결제 내역 목록 (페이지네이션)
- 영수증/세금계산서 다운로드
- 결제 실패 내역 확인

---

### 3.2 데이터 매핑 - 결제 내역 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | 정렬 | 비고 |
|-------------|-------------|--------|------|------|------|
| **결제일** | Payment | payment_date | DateTime | ✓ | YYYY-MM-DD HH:mm |
| **결제 금액** | Payment | amount | Decimal(10,2) | ✓ | ₩ 단위 |
| **결제 수단** | Payment | method | String(50) | - | 카드 끝 4자리 or 계좌이체 |
| **상태** | Payment | status | Enum | ✓ | 완료, 진행중, 실패, 환불 |
| **상품명** | Payment | product_name | String(100) | - | 예: "PREMIUM 플랜 (연간)" |
| **영수증** | Payment | receipt_url | String(500) | - | 다운로드 링크 |

---

### 3.3 데이터 스키마 - Payment 테이블

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | UUID | ✓ | PK | |
| user_id | UUID | ✓ | ✓ | FK: users.id |
| membership_id | UUID | - | ✓ | FK: memberships.id (멤버십 결제인 경우) |
| amount | Decimal(10,2) | ✓ | - | |
| currency | String(3) | ✓ | - | KRW, USD, ... |
| method | String(50) | ✓ | - | card_****1234, bank_transfer |
| status | Enum | ✓ | ✓ | 완료, 진행중, 실패, 환불 |
| product_name | String(100) | ✓ | - | |
| payment_date | DateTime | ✓ | ✓ | |
| receipt_url | String(500) | - | - | |
| pg_transaction_id | String(100) | - | ✓ | PG사 거래 ID |
| failure_reason | Text | - | - | 실패 시 사유 |
| created_at | DateTime | ✓ | ✓ | |
| updated_at | DateTime | ✓ | - | |

---

### 3.4 CRUD 작업

#### 3.4.1 결제 내역 조회 (Read)

**API 엔드포인트**: `GET /api/payments?page=1&pageSize=15`

**쿼리 파라미터**:
- `page`: 페이지 번호 (기본값: 1)
- `pageSize`: 페이지 크기 (기본값: 15)
- `status`: 상태 필터 (옵션)

**응답**:
```typescript
{
  data: Payment[],
  pagination: {
    page: number,
    pageSize: number,
    totalItems: number,
    totalPages: number
  }
}
```

---

#### 3.4.2 영수증 다운로드

**트리거**: "영수증 다운로드" 링크 클릭

**API 엔드포인트**: `GET /api/payments/:id/receipt`

**응답**: PDF 파일 다운로드 (Content-Type: application/pdf)

---

## 4. 문의하기 화면 (/profile/inquiry)

### 4.1 화면 개요

**목적**: 고객 지원 문의 및 이력 조회

**주요 기능**:
- 문의 등록 (버그, 기능 요청, 기타)
- 문의 이력 조회
- 답변 확인

---

### 4.2 데이터 매핑 - 문의 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | 정렬 |
|-------------|-------------|--------|------|------|
| **문의일** | Inquiry | created_at | DateTime | ✓ |
| **제목** | Inquiry | subject | String(200) | - |
| **카테고리** | Inquiry | category | Enum | ✓ |
| **상태** | Inquiry | status | Enum | ✓ |
| **답변일** | Inquiry | responded_at | DateTime | ✓ |

---

### 4.3 데이터 스키마 - Inquiry 테이블

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | UUID | ✓ | PK | |
| user_id | UUID | ✓ | ✓ | FK: users.id |
| subject | String(200) | ✓ | - | |
| category | Enum | ✓ | ✓ | 버그, 기능요청, 기타 |
| description | Text | ✓ | - | |
| attachment_url | String(500) | - | - | 파일 첨부 (스크린샷 등) |
| status | Enum | ✓ | ✓ | 접수, 답변중, 완료 |
| response | Text | - | - | 관리자 답변 |
| responded_at | DateTime | - | ✓ | 답변 일시 |
| responder_id | UUID | - | - | FK: users.id (관리자) |
| created_at | DateTime | ✓ | ✓ | |
| updated_at | DateTime | ✓ | - | |

---

### 4.4 CRUD 작업

#### 4.4.1 문의 등록 (Create)

**트리거**: "문의하기" 버튼 클릭 → 폼 표시

**입력 필드**:

| 필드명 | 필수 | 타입 | 검증 규칙 |
|--------|------|------|-----------|
| 제목 | ✓ | String(200) | 5-200자 |
| 카테고리 | ✓ | Select | 버그, 기능요청, 기타 |
| 내용 | ✓ | Textarea | 10-5000자 |
| 첨부 파일 | - | File | PNG, JPG, PDF, 최대 10MB |

**저장 로직**:
1. 입력 검증
2. 파일 업로드 (있는 경우)
3. Inquiry 레코드 생성 (status: 접수)
4. 관리자에게 알림 (이메일, Slack 등)
5. 성공 토스트 + 목록으로 이동

**API 엔드포인트**: `POST /api/inquiries`

---

#### 4.4.2 문의 상세 조회 (Read)

**트리거**: 목록에서 문의 클릭 → 상세 모달 오픈

**표시 데이터**:
- 문의 제목, 카테고리, 내용
- 첨부 파일 (다운로드 링크)
- 문의일, 상태
- 답변 (있는 경우)
- 답변일, 답변자 이름

**API 엔드포인트**: `GET /api/inquiries/:id`

---

## 5. 조직 관리 화면 (/settings/organization)

### 5.1 화면 개요

**목적**: 워크스페이스, 팀, 멤버 관리

**주요 기능**:
- 워크스페이스 정보 수정
- 팀 생성/수정/삭제
- 멤버 초대/역할 변경/제거
- 메뉴 권한 설정

---

### 5.2 데이터 매핑 - 워크스페이스 정보

| 화면 필드명 | 매핑 엔티티 | 필드명 | 타입 | 필수 | 수정 가능 |
|-------------|-------------|--------|------|------|-----------|
| **워크스페이스 이름** | Workspace | name | String(100) | ✓ | ✓ |
| **로고** | Workspace | logo_url | String(500) | - | ✓ |
| **설명** | Workspace | description | Text | - | ✓ |
| **멤버 수** | - | COUNT(workspace_users) | Int | - | ❌ |

---

### 5.3 데이터 매핑 - 팀 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | CRUD |
|-------------|-------------|--------|------|------|
| **팀명** | Team | name | String(50) | ✓ |
| **팀장** | Team | lead_id | UUID | ✓ |
| **멤버 수** | - | COUNT(team_members) | Int | ❌ |
| **부서 설명** | Team | description | Text | ✓ |

---

### 5.4 데이터 매핑 - 멤버 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | CRUD |
|-------------|-------------|--------|------|------|
| **이름** | User | name | String(50) | ❌ |
| **이메일** | User | email | String(100) | ❌ |
| **역할** | WorkspaceUser | role | Enum | ✓ |
| **팀** | WorkspaceUser | team_id | UUID | ✓ |
| **상태** | WorkspaceUser | status | Enum | ✓ |
| **가입일** | WorkspaceUser | joined_at | DateTime | ❌ |

**역할 (Role)**:
- **Owner**: 모든 권한 (워크스페이스 삭제 가능)
- **Admin**: 관리 권한 (멤버 관리, 팀 관리)
- **Manager**: 팀 관리 권한
- **Member**: 일반 사용자

---

### 5.5 데이터 스키마 - Workspace 테이블

| 필드명 | 타입 | 필수 | 비고 |
|--------|------|------|------|
| id | UUID | ✓ | PK |
| name | String(100) | ✓ | |
| logo_url | String(500) | - | |
| description | Text | - | |
| owner_id | UUID | ✓ | FK: users.id |
| created_at | DateTime | ✓ | |
| updated_at | DateTime | ✓ | |

---

### 5.6 데이터 스키마 - WorkspaceUser 테이블 (중간 테이블)

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | UUID | ✓ | PK | |
| workspace_id | UUID | ✓ | ✓ | FK: workspaces.id |
| user_id | UUID | ✓ | ✓ | FK: users.id |
| team_id | UUID | - | ✓ | FK: teams.id |
| role | Enum | ✓ | ✓ | Owner, Admin, Manager, Member |
| status | Enum | ✓ | ✓ | 활성, 비활성, 초대중 |
| joined_at | DateTime | ✓ | - | |
| created_at | DateTime | ✓ | - | |
| updated_at | DateTime | ✓ | - | |

**복합 UNIQUE 인덱스**: `(workspace_id, user_id)`

---

### 5.7 데이터 스키마 - Team 테이블

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | UUID | ✓ | PK | |
| workspace_id | UUID | ✓ | ✓ | FK: workspaces.id |
| name | String(50) | ✓ | - | |
| lead_id | UUID | - | ✓ | FK: users.id (팀장) |
| description | Text | - | - | |
| created_at | DateTime | ✓ | - | |
| updated_at | DateTime | ✓ | - | |

---

### 5.8 CRUD 작업

#### 5.8.1 팀 생성 (Create)

**트리거**: "팀 추가" 버튼 클릭 → 모달 오픈

**입력 필드**:
- 팀명 (필수, 2-50자)
- 팀장 선택 (옵션, 워크스페이스 멤버 중 선택)
- 설명 (옵션, 최대 500자)

**API 엔드포인트**: `POST /api/workspaces/:workspaceId/teams`

---

#### 5.8.2 멤버 초대 (Create)

**트리거**: "멤버 초대" 버튼 클릭 → 모달 오픈

**입력 필드**:
- 이메일 (필수, 쉼표로 구분하여 여러 명 초대 가능)
- 역할 (필수)
- 팀 (옵션)

**저장 로직**:
1. 이메일 검증
2. 이미 워크스페이스에 속한 사용자인지 확인
3. 초대 이메일 발송 (초대 링크 포함)
4. WorkspaceUser 레코드 생성 (status: 초대중)
5. 성공 토스트

**API 엔드포인트**: `POST /api/workspaces/:workspaceId/invitations`

---

#### 5.8.3 멤버 역할 변경 (Update)

**트리거**: 멤버 목록에서 역할 드롭다운 변경

**API 엔드포인트**: `PATCH /api/workspaces/:workspaceId/users/:userId`

**요청 Body**:
```typescript
{
  role: 'Admin'
}
```

---

#### 5.8.4 멤버 제거 (Delete)

**트리거**: "제거" 버튼 클릭 → 확인 다이얼로그

**확인 메시지**:
```
이 멤버를 워크스페이스에서 제거하시겠습니까?
이름: [이름]
이메일: [이메일]

이 작업은 되돌릴 수 없습니다.
```

**API 엔드포인트**: `DELETE /api/workspaces/:workspaceId/users/:userId`

---

### 5.9 메뉴 권한 설정

**목적**: 역할별로 접근 가능한 메뉴 정의

**데이터 스키마 - MenuPermission 테이블** (옵션):

| 필드명 | 타입 | 비고 |
|--------|------|------|
| id | UUID | PK |
| workspace_id | UUID | FK: workspaces.id |
| role | Enum | Owner, Admin, Manager, Member |
| menu_id | String(50) | dashboard, contract, work, posting, keywords, ... |
| can_read | Boolean | 조회 권한 |
| can_write | Boolean | 작성 권한 |
| can_update | Boolean | 수정 권한 |
| can_delete | Boolean | 삭제 권한 |

**기본 권한 (코드로 하드코딩 or DB 관리)**:

| 메뉴 | Owner | Admin | Manager | Member |
|------|-------|-------|---------|--------|
| 대시보드 | ✓ | ✓ | ✓ | ✓ |
| 계약 관리 | ✓ | ✓ | ✓ | 읽기만 |
| 업무 관리 | ✓ | ✓ | ✓ | ✓ |
| 포스팅 현황 | ✓ | ✓ | ✓ | ✓ |
| 키워드 현황 | ✓ | ✓ | ✓ | ✓ |
| 매출 현황 | ✓ | ✓ | 읽기만 | ❌ |
| 성과 현황 | ✓ | ✓ | 읽기만 | ❌ |
| 조직 관리 | ✓ | ✓ | 팀만 | ❌ |

---

## 6. 공지사항 화면 (/support/notices)

### 6.1 화면 개요

**목적**: 시스템 공지사항 조회

**주요 기능**:
- 공지 목록 조회 (페이지네이션)
- 공지 상세 조회
- 상단 고정 공지
- 타입별 필터 (공지, 이벤트, 업데이트)

---

### 6.2 데이터 매핑 - 공지사항 목록

| 화면 컬럼명 | 매핑 엔티티 | 필드명 | 타입 | 정렬 | 검색 |
|-------------|-------------|--------|------|------|------|
| **ID** | Notice | id | Int | ✓ | - |
| **타입** | Notice | type | Enum | ✓ | ✓ |
| **제목** | Notice | title | String(200) | ✓ | ✓ |
| **작성자** | User | name | String(50) | - | ✓ |
| **등록일** | Notice | created_at | DateTime | ✓ | ✓ |
| **조회수** | Notice | view_count | Int | ✓ | - |
| **상단 고정** | Notice | is_pinned | Boolean | - | - |

---

### 6.3 데이터 스키마 - Notice 테이블

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | Int | ✓ | PK | AUTO_INCREMENT |
| type | Enum | ✓ | ✓ | 공지, 이벤트, 업데이트 |
| title | String(200) | ✓ | - | |
| content | Text | ✓ | - | HTML or Markdown |
| author_id | UUID | ✓ | ✓ | FK: users.id |
| is_pinned | Boolean | ✓ | ✓ | 상단 고정 여부 |
| view_count | Int | ✓ | - | 기본값: 0 |
| created_at | DateTime | ✓ | ✓ | |
| updated_at | DateTime | ✓ | - | |

---

### 6.4 CRUD 작업

#### 6.4.1 공지 목록 조회 (Read)

**API 엔드포인트**: `GET /api/notices?page=1&pageSize=15&type=공지`

**쿼리**:
```sql
-- 상단 고정 공지 먼저, 그 다음 최신순
SELECT *
FROM notices
WHERE (:type IS NULL OR type = :type)
ORDER BY is_pinned DESC, created_at DESC
LIMIT :limit OFFSET :offset
```

---

#### 6.4.2 공지 상세 조회 (Read)

**트리거**: 공지 제목 클릭 → 상세 페이지로 이동 (`/support/notices/:id`)

**API 엔드포인트**: `GET /api/notices/:id`

**로직**:
1. Notice 조회
2. `view_count` 증가 (UPDATE)
3. 응답 반환

---

#### 6.4.3 공지 작성 (Create) - 관리자만

**권한**: Admin, Owner

**입력 필드**:
- 타입 (공지, 이벤트, 업데이트)
- 제목
- 내용 (WYSIWYG 에디터)
- 상단 고정 여부

**API 엔드포인트**: `POST /api/notices`

---

## 7. 챗봇 화면 (/support/chatbot)

### 7.1 화면 개요

**목적**: AI 기반 고객 지원

**주요 기능**:
- 실시간 채팅 (AI 또는 관리자)
- FAQ 자동 응답
- 대화 이력 저장

---

### 7.2 데이터 스키마 - ChatMessage 테이블

| 필드명 | 타입 | 필수 | 인덱스 | 비고 |
|--------|------|------|--------|------|
| id | UUID | ✓ | PK | |
| user_id | UUID | ✓ | ✓ | FK: users.id |
| sender_type | Enum | ✓ | - | user, bot, admin |
| message | Text | ✓ | - | |
| created_at | DateTime | ✓ | ✓ | |

---

### 7.3 API

**메시지 전송**: `POST /api/chatbot/messages`

**메시지 조회**: `GET /api/chatbot/messages?userId=:userId&limit=50`

---

## 8. 체크리스트

### 8.1 문서 완성도

- [x] 프로필 관리 화면 매핑 완료
- [x] 멤버십 관리 화면 매핑 완료
- [x] 결제 내역 화면 매핑 완료
- [x] 문의하기 화면 매핑 완료
- [x] 조직 관리 화면 매핑 완료 (워크스페이스, 팀, 멤버, 권한)
- [x] 공지사항 화면 매핑 완료
- [x] 챗봇 화면 매핑 완료

### 8.2 추가 고려사항

- [ ] NextAuth.js 통합 (인증/세션 관리)
- [ ] PG사 연동 (Stripe, 토스페이먼츠)
- [ ] 이메일 발송 서비스 (SendGrid, AWS SES)
- [ ] 파일 업로드 스토리지 (S3, Vercel Blob)
- [ ] AI 챗봇 서비스 (OpenAI API, Langchain)

---

## 9. 다음 단계

- ⏭️ 핵심 엔티티 참조 문서 (`entities_reference.md`)
- ⏭️ ERD 설계 및 Prisma 스키마 작성
- ⏭️ API 계약서 작성 (`api-spec.md`)

---

**작성 완료일**: 2025-11-11
