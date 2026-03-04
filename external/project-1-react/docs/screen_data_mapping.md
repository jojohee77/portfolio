# 화면-데이터 매핑 (Screen-Data Mapping)

## 문서 정보
- **작성일**: 2025-11-11
- **프로젝트**: AgOffice (마케팅 관리 플랫폼)
- **목적**: 각 화면에서 필요한 데이터 항목을 명확히 하고 엔티티/필드 매핑 정의
- **기술 스택**: Next.js 14 (App Router), TypeScript, Prisma ORM

## 문서 구조

이 문서는 다음과 같이 분리되어 있습니다:

1. **screen_data_mapping.md** (현재 문서) - 전체 개요 및 체크리스트
2. **screen_mapping_contract_work.md** - 계약 & 업무 관리 화면 상세 매핑
3. **screen_mapping_status.md** - 현황 추적 화면 상세 매핑 (포스팅, 키워드, 매출, 성과, 블로그순위)
4. **screen_mapping_profile_settings.md** - 프로필, 설정, 멤버십 화면 상세 매핑
5. **entities_reference.md** - 핵심 엔티티 정의 및 관계도

---

## 1. 화면 목록 및 우선순위

### 1.1 핵심 업무 화면 (High Priority)

| 화면명 | 라우트 | 주요 기능 | 매핑 문서 |
|--------|--------|-----------|-----------|
| 대시보드 | `/dashboard` | 위젯 기반 KPI 종합 현황 | 본 문서 §3 |
| 계약 관리 | `/work/contract` | 계약 CRUD, 필터링, 검색 | contract_work.md §2 |
| 업무 관리 | `/work/task` | 업무/키워드 할당 관리 | contract_work.md §3 |
| 포스팅 현황 | `/status/posting` | 블로그 포스팅 순위 추적 | status.md §2 |
| 키워드 현황 | `/status/keywords` | 키워드별 성과 분석 | status.md §3 |
| 매출 현황 | `/status/revenue` | 서비스별/월별 매출 분석 | status.md §4 |
| 성과 현황 | `/status/performance` | 팀/개인별 성과 추적 | status.md §5 |

### 1.2 지원 기능 화면 (Medium Priority)

| 화면명 | 라우트 | 주요 기능 | 매핑 문서 |
|--------|--------|-----------|-----------|
| 블로그 순위추적 | `/status/blog-ranking` | 일일 키워드 순위 모니터링 | status.md §6 |
| 조직 관리 | `/settings/organization` | 팀/멤버 관리 | profile_settings.md §5 |
| 프로필 관리 | `/profile/account` | 사용자 정보 수정 | profile_settings.md §2 |
| 멤버십 관리 | `/profile/membership` | 구독 플랜 관리 | profile_settings.md §3 |
| 결제 내역 | `/profile/payment` | 결제 이력 조회 | profile_settings.md §4 |
| 공지사항 | `/support/notices` | 공지 목록/상세 조회 | profile_settings.md §6 |
| 챗봇 | `/support/chatbot` | AI 지원 | profile_settings.md §7 |

### 1.3 인증 화면 (Low Priority - UI Only)

| 화면명 | 라우트 | 주요 기능 | 비고 |
|--------|--------|-----------|------|
| 로그인 | `/login` | SNS/이메일 로그인 | NextAuth 활용 예정 |
| 이메일 로그인 | `/login/email` | 이메일/비밀번호 로그인 | |
| 회원가입 | `/signup` | 신규 사용자 등록 | |
| 회원가입 완료 | `/signup/complete` | 가입 완료 안내 | |
| 멤버십 선택 | `/membership` | 플랜 선택 | |
| 결제 | `/membership/payment/[cycle]/[level]` | 결제 처리 | |

---

## 2. 공통 데이터 요구사항

### 2.1 모든 화면 공통

| 데이터 항목 | 매핑 엔티티 | 필드명 | 타입 | 필수 | 비고 |
|-------------|-------------|--------|------|------|------|
| 현재 사용자 정보 | User | id, name, email, avatar | String | ✓ | 세션/JWT에서 추출 |
| 워크스페이스 정보 | Workspace | id, name, logo | String | ✓ | 다중 워크스페이스 지원 |
| 소속 팀 정보 | Team | id, name | String | ✓ | 권한 체크용 |
| 타임존 | User | timezone | String | - | 기본값: Asia/Seoul |
| 알림 목록 | Notification | id, type, message, is_read, created_at | Mixed | - | 헤더에 표시 (최대 5개) |

### 2.2 날짜/시간 처리 규칙

- **입력 형식**: ISO 8601 (YYYY-MM-DD, YYYY-MM-DDTHH:mm:ssZ)
- **표시 형식**:
  - 날짜: YYYY년 MM월 DD일 (한국어)
  - 시간: HH:mm (24시간)
  - 상대 시간: "방금 전", "3시간 전", "2일 전"
- **타임존**: 모든 날짜는 UTC로 저장, 표시 시 한국 시간으로 변환
- **필터링**: 날짜 범위는 start_date (00:00:00) ~ end_date (23:59:59)

### 2.3 금액/수량 처리 규칙

- **금액 타입**: Decimal(15, 2) - 억 단위까지 지원, 소수점 2자리
- **통화**: KRW (₩)
- **표시 형식**:
  - 기본: 1,000,000원
  - 차트/테이블: 숫자만 표시 (축에 단위 표기)
  - 대시보드 카드: 천만원 이상 시 "억원" 단위 표시 (예: 1.2억원)

### 2.4 페이지네이션 규칙

- **기본 페이지 크기**: 15개
- **페이지 크기 옵션**: 15, 30, 50, 100
- **응답 형식**:
```typescript
{
  data: T[],
  pagination: {
    page: number,        // 현재 페이지 (1부터 시작)
    pageSize: number,    // 페이지당 항목 수
    totalItems: number,  // 전체 항목 수
    totalPages: number   // 전체 페이지 수
  }
}
```

### 2.5 정렬 규칙

- **기본 정렬**: 최신순 (created_at DESC)
- **정렬 필드**: 각 화면별로 정의 (테이블 컬럼 헤더 클릭)
- **정렬 방향**: ASC (오름차순), DESC (내림차순)
- **다중 정렬**: 현재 지원 안 함 (추후 고려)

### 2.6 검색/필터 규칙

- **검색 타입**:
  - 전체 텍스트 검색: LIKE '%keyword%' (대소문자 무시)
  - 정확한 매칭: = 'value'
- **필터 조합**: AND 조건 (모든 필터 동시 만족)
- **날짜 범위**: start_date와 end_date 모두 포함 (inclusive)

---

## 3. 대시보드 화면 (/dashboard)

### 3.1 화면 개요

- **목적**: 핵심 KPI와 주요 지표를 위젯 형태로 한눈에 확인
- **사용자 액션**: 위젯 추가/제거, 드래그&드롭 재배치, 필터 적용
- **데이터 갱신**: 실시간 (웹소켓) 또는 주기적 폴링 (30초)

### 3.2 위젯별 데이터 매핑

#### 3.2.1 계약 현황 위젯 (Contract Overview)

| 데이터 항목 | 매핑 엔티티 | 필드/조건 | 정렬 | 필수 |
|-------------|-------------|-----------|------|------|
| 신규 계약 수 | Contract | status = '신규' | COUNT | ✓ |
| 연장 계약 수 | Contract | status = '연장' | COUNT | ✓ |
| 확장 계약 수 | Contract | status = '확장' | COUNT | ✓ |
| 기준 기간 | - | 현재 월 or 사용자 선택 | - | ✓ |

**관계**: N/A (단순 집계)

**쿼리 최적화**:
- 인덱스: `contracts(status, created_at)`
- 캐싱: 5분 (서버 사이드)

---

#### 3.2.2 월별 매출 추이 위젯 (Monthly Revenue Trend)

| 데이터 항목 | 매핑 엔티티 | 필드/조건 | 정렬 | 필수 |
|-------------|-------------|-----------|------|------|
| 월 (X축) | Revenue | year, month | month ASC | ✓ |
| 매출액 (Y축) | Revenue | total_revenue | - | ✓ |
| 계약 건수 | Revenue | contracts_count | - | - |
| 전월 대비 증감율 | Revenue | (계산 필드) | - | - |
| 기준 기간 | - | 최근 6개월 | - | ✓ |

**관계**:
- Revenue 1:N Team (팀별 매출 분리 가능)

**계산 로직**:
```typescript
// 전월 대비 증감율
const growthRate = ((currentMonth - previousMonth) / previousMonth) * 100;
```

**쿼리 최적화**:
- 인덱스: `revenue(year, month, team_id)`
- 미리 계산된 집계 테이블 사용 권장

---

#### 3.2.3 업무 진행 현황 위젯 (Task Progress)

| 데이터 항목 | 매핑 엔티티 | 필드/조건 | 정렬 | 필수 |
|-------------|-------------|-----------|------|------|
| 진행중 | WorkTask | status = '진행중' | COUNT | ✓ |
| 완료 | WorkTask | status = '완료' | COUNT | ✓ |
| 대기 | WorkTask | status = '대기' | COUNT | ✓ |
| 보류 | WorkTask | status = '보류' | COUNT | - |
| 완료율 | WorkTask | (계산 필드) | - | ✓ |

**계산 로직**:
```typescript
// 완료율
const completionRate = (completed / (total - onHold)) * 100;
```

**쿼리 최적화**:
- 인덱스: `work_tasks(status, team_id, assignee_id)`

---

#### 3.2.4 키워드 성과 위젯 (Keyword Performance)

| 데이터 항목 | 매핑 엔티티 | 필드/조건 | 정렬 | 필수 |
|-------------|-------------|-----------|------|------|
| 목표 키워드 수 | Keyword | is_target = true | COUNT | ✓ |
| 상위 노출 키워드 수 | Posting | current_rank <= 5 | COUNT(DISTINCT keyword) | ✓ |
| 달성율 | - | (계산 필드) | - | ✓ |
| 평균 순위 | Posting | current_rank | AVG | ✓ |

**관계**:
- Keyword 1:N Posting
- Posting N:1 WorkTask

---

#### 3.2.5 서비스별 계약 분포 (Service Distribution)

| 데이터 항목 | 매핑 엔티티 | 필드/조건 | 정렬 | 필수 |
|-------------|-------------|-----------|------|------|
| SEO 계약 수 | Contract | 'SEO' IN services | COUNT | ✓ |
| 프리미엄 계약 수 | Contract | '프리미엄' IN services | COUNT | ✓ |
| 하나탑 계약 수 | Contract | '하나탑' IN services | COUNT | ✓ |
| 비율 | - | (계산 필드) | - | ✓ |

**주의사항**:
- `services` 필드는 배열 타입 (한 계약이 여러 서비스 포함 가능)
- 중복 카운트 가능 (합계 > 전체 계약 수)

---

#### 3.2.6 팀별 성과 위젯 (Team Performance)

| 데이터 항목 | 매핑 엔티티 | 필드/조건 | 정렬 | 필수 |
|-------------|-------------|-----------|------|------|
| 팀명 | Team | name | - | ✓ |
| 월 매출 | Revenue | total_revenue GROUP BY team_id | month ASC | ✓ |
| 계약 건수 | Performance | contract_count | - | ✓ |
| 인당 매출 | Performance | monthly_revenue / member_count | - | ✓ |

**관계**:
- Team 1:N Performance
- Team 1:N Contract

---

### 3.3 알림 드롭다운 (Header)

| 데이터 항목 | 매핑 엔티티 | 필드 | 정렬 | 필수 |
|-------------|-------------|------|------|------|
| 알림 ID | Notification | id | - | ✓ |
| 알림 타입 | Notification | type (계약만료, 업무완료, 순위변동 등) | - | ✓ |
| 알림 메시지 | Notification | message | - | ✓ |
| 읽음 여부 | Notification | is_read | - | ✓ |
| 생성 시간 | Notification | created_at | created_at DESC | ✓ |
| 관련 링크 | Notification | link_url | - | - |

**제약**: 최근 5개만 표시 (무한 스크롤 없음)

---

## 4. 체크리스트

### 4.1 화면-데이터 매핑 완료 기준

- [x] 모든 주요 화면의 데이터 항목을 나열함
- [x] 각 항목에 대해 매핑 엔티티와 필드를 명시함
- [x] 필수/옵션 구분을 명확히 함
- [x] 정렬/검색/필터 기준을 정의함
- [ ] 금액/수량/단위/시간대 타입 민감 항목을 표시함 ← **현재 진행 중**
- [ ] 각 화면의 CRUD 작업을 모두 포함함
- [ ] 관계 및 외래키를 명시함
- [ ] 성능 고려사항 (인덱스, N+1) 표시함

### 4.2 문서 검증 항목

- [ ] PM/디자이너가 문서를 검토하고 누락된 필드가 없는지 확인
- [ ] 백엔드 개발자가 엔티티/관계가 ERD와 일치하는지 검증
- [ ] 프론트엔드 개발자가 API 응답 형식과 매핑되는지 확인
- [ ] 복잡한 쿼리 (JOIN 3개 이상, 서브쿼리)에 대한 성능 테스트 계획 수립
- [ ] 페이지네이션이 필요한 화면 식별 완료

---

## 5. 다음 단계

1. ✅ **화면-데이터 매핑 완료** (현재 문서)
2. ⏭️ **ERD v0.1 설계** → `docs/erd-v0.1.png`, `docs/entities.md`
3. ⏭️ **API 계약서 작성** → `docs/api-spec.md`
4. ⏭️ **Prisma 스키마 작성** → `prisma/schema.prisma`

---

## 6. 참고 문서

- [계약 & 업무 관리 화면 매핑](./screen_mapping_contract_work.md)
- [현황 추적 화면 매핑](./screen_mapping_status.md)
- [프로필 & 설정 화면 매핑](./screen_mapping_profile_settings.md)
- [핵심 엔티티 참조](./entities_reference.md)
- [API 계약서](./api-spec.md) (작성 예정)
- [ERD 다이어그램](./erd-v0.1.png) (작성 예정)
