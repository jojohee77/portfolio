# ERD v0.1 - MariaDB 가이드

## 문서 정보
- **작성일**: 2025-11-11
- **데이터베이스**: MariaDB 10.6 이상
- **관련 파일**:
  - `erd-v0.1-mariadb.sql` - DDL 스크립트
  - `erd-v0.1-mariadb.dbml` - DBML 코드 (dbdiagram.io)

---

## 1. PostgreSQL vs MariaDB 주요 차이점

### 1.1 데이터 타입 변경

| PostgreSQL | MariaDB | 비고 |
|------------|---------|------|
| `UUID` | `CHAR(36)` | MariaDB는 네이티브 UUID 타입 없음 |
| `TEXT[]` | `JSON` | 배열 타입 대신 JSON 사용 |
| `TIMESTAMP WITH TIME ZONE` | `DATETIME` | 타임존 저장 안 함 (애플리케이션 처리) |
| `SERIAL` | `INT AUTO_INCREMENT` | notices.id |
| `uuid_generate_v4()` | `UUID()` | MariaDB 10.7+ |

### 1.2 기본값 및 자동 갱신

**PostgreSQL**:
```sql
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**MariaDB**:
```sql
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

**차이점**: MariaDB는 `ON UPDATE CURRENT_TIMESTAMP` 지원으로 자동 갱신

### 1.3 ENUM 타입

**MariaDB는 ENUM을 네이티브 지원**하며 인덱스 가능:

```sql
-- MariaDB
role ENUM('Owner', 'Admin', 'Manager', 'Member') NOT NULL DEFAULT 'Member'

-- PostgreSQL는 별도 TYPE 생성 필요
CREATE TYPE role_enum AS ENUM ('Owner', 'Admin', 'Manager', 'Member');
role role_enum NOT NULL DEFAULT 'Member'
```

### 1.4 JSON 배열

**PostgreSQL**:
```sql
services TEXT[] NOT NULL
```

**MariaDB**:
```sql
services JSON NOT NULL
-- 예시 데이터: ["SEO", "프리미엄", "하나탑"]
```

**쿼리 예시**:
```sql
-- 특정 서비스 포함 여부
SELECT * FROM contracts WHERE JSON_CONTAINS(services, '"SEO"');

-- 서비스 배열 길이
SELECT *, JSON_LENGTH(services) AS service_count FROM contracts;
```

---

## 2. MariaDB 설치 및 설정

### 2.1 설치 (Ubuntu/Debian)

```bash
# MariaDB 저장소 추가
sudo apt-get install software-properties-common
sudo apt-key adv --fetch-keys 'https://mariadb.org/mariadb_release_signing_key.asc'
sudo add-apt-repository 'deb [arch=amd64] http://mirror.one.com/mariadb/repo/10.11/ubuntu focal main'

# MariaDB 설치
sudo apt update
sudo apt install mariadb-server mariadb-client

# 버전 확인
mariadb --version
# MariaDB 10.11 이상 권장
```

### 2.2 설치 (macOS)

```bash
# Homebrew 사용
brew install mariadb

# 서비스 시작
brew services start mariadb

# 초기 보안 설정
sudo mysql_secure_installation
```

### 2.3 설치 (Windows)

1. https://mariadb.org/download 에서 MSI 설치 파일 다운로드
2. 설치 시 UTF8 선택 (utf8mb4)
3. 루트 비밀번호 설정

### 2.4 초기 설정

```sql
-- 루트 로그인
sudo mysql -u root -p

-- 애플리케이션용 사용자 생성
CREATE USER 'agoffice'@'localhost' IDENTIFIED BY 'your_secure_password';

-- 데이터베이스 생성
CREATE DATABASE agoffice
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 권한 부여
GRANT ALL PRIVILEGES ON agoffice.* TO 'agoffice'@'localhost';
FLUSH PRIVILEGES;

-- 확인
SHOW DATABASES;
USE agoffice;
```

---

## 3. DDL 스크립트 실행

### 3.1 전체 스크립트 실행

```bash
# 1. 데이터베이스 생성 및 스크립트 실행
mysql -u agoffice -p < docs/erd-v0.1-mariadb.sql

# 2. 실행 확인
mysql -u agoffice -p agoffice
```

```sql
-- 테이블 목록 확인
SHOW TABLES;

-- 특정 테이블 구조 확인
DESCRIBE users;
SHOW CREATE TABLE contracts;

-- FK 관계 확인
SELECT
  TABLE_NAME,
  COLUMN_NAME,
  CONSTRAINT_NAME,
  REFERENCED_TABLE_NAME,
  REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'agoffice'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### 3.2 단계별 실행 (권장)

```bash
# 1. 데이터베이스만 생성
mysql -u agoffice -p -e "CREATE DATABASE IF NOT EXISTS agoffice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. 테이블 생성 (FK 의존성 순서대로)
mysql -u agoffice -p agoffice < docs/erd-v0.1-mariadb.sql

# 3. Trigger 생성 확인
mysql -u agoffice -p agoffice -e "SHOW TRIGGERS;"

# 4. 초기 데이터 확인
mysql -u agoffice -p agoffice -e "SELECT * FROM users;"
```

---

## 4. MariaDB 특화 기능

### 4.1 UUID 생성

**MariaDB 10.7+**:
```sql
-- UUID() 함수 사용 (권장)
INSERT INTO users (id, name, email, password_hash)
VALUES (UUID(), '사용자명', 'user@example.com', 'hash...');
```

**MariaDB 10.6 이하**:
```sql
-- 애플리케이션에서 UUID 생성 (Node.js crypto.randomUUID())
INSERT INTO users (id, name, email, password_hash)
VALUES ('550e8400-e29b-41d4-a716-446655440000', '사용자명', 'user@example.com', 'hash...');
```

### 4.2 JSON 쿼리

```sql
-- 1. 서비스 배열에 'SEO' 포함 여부
SELECT * FROM contracts
WHERE JSON_CONTAINS(services, '"SEO"');

-- 2. 서비스 개수
SELECT contract_number, JSON_LENGTH(services) AS service_count
FROM contracts;

-- 3. 첫 번째 서비스 추출
SELECT contract_number, JSON_EXTRACT(services, '$[0]') AS first_service
FROM contracts;

-- 4. 서비스 배열 전개 (MariaDB 10.6+)
SELECT
  c.contract_number,
  JSON_VALUE(j.value, '$') AS service
FROM contracts c
CROSS JOIN JSON_TABLE(
  c.services,
  '$[*]' COLUMNS(value VARCHAR(50) PATH '$')
) AS j;
```

### 4.3 ENUM 타입 사용

```sql
-- ENUM 값 확인
SHOW COLUMNS FROM contracts LIKE 'status';

-- ENUM 값으로 필터링 (인덱스 활용)
SELECT * FROM contracts WHERE status = '신규';

-- ENUM 값 변경 (ALTER TABLE 필요)
ALTER TABLE contracts
MODIFY COLUMN status ENUM('신규', '연장', '확장', '종료') NOT NULL DEFAULT '신규';
```

**주의사항**:
- ENUM은 문자열이 아닌 정수로 저장 (메모리 효율적)
- ENUM 순서 변경 시 전체 테이블 리빌드 (대용량 테이블 주의)
- 값 추가는 끝에만 추가하면 리빌드 없음

### 4.4 Trigger

```sql
-- Trigger 목록 확인
SHOW TRIGGERS;

-- 특정 Trigger 상세 보기
SHOW CREATE TRIGGER trg_contracts_update_expired;

-- Trigger 삭제
DROP TRIGGER IF EXISTS trg_contracts_update_expired;
```

**작성된 Trigger**:
1. `trg_contracts_update_expired`: 계약 만료 여부 자동 계산
2. `trg_postings_calculate_rank_change`: 포스팅 순위 변동 자동 계산

---

## 5. 인덱스 최적화

### 5.1 인덱스 사용 확인

```sql
-- 쿼리 실행 계획 확인
EXPLAIN SELECT * FROM contracts WHERE workspace_id = 'uuid...' AND status = '신규';

-- 인덱스 사용 통계
SHOW INDEX FROM contracts;

-- 사용되지 않는 인덱스 찾기 (MariaDB 10.5+)
SELECT * FROM sys.schema_unused_indexes WHERE object_schema = 'agoffice';
```

### 5.2 복합 인덱스 순서

**좋은 예**:
```sql
-- WHERE workspace_id = ? AND status = ? ORDER BY created_at DESC
CREATE INDEX idx_contracts_workspace_status_created
ON contracts(workspace_id, status, created_at DESC);
```

**나쁜 예**:
```sql
-- 순서가 잘못됨
CREATE INDEX idx_contracts_created_status_workspace
ON contracts(created_at, status, workspace_id);
```

**원칙**:
1. WHERE 절 등호(=) 조건 컬럼
2. WHERE 절 범위(<, >, BETWEEN) 조건 컬럼
3. ORDER BY 컬럼

### 5.3 인덱스 힌트

```sql
-- 특정 인덱스 강제 사용
SELECT * FROM contracts
USE INDEX (idx_contracts_workspace_status_created)
WHERE workspace_id = 'uuid...' AND status = '신규'
ORDER BY created_at DESC;

-- 인덱스 무시
SELECT * FROM contracts
IGNORE INDEX (idx_contracts_number)
WHERE contract_number LIKE '%2024%';
```

---

## 6. 성능 튜닝

### 6.1 설정 파일 (my.cnf 또는 my.ini)

**기본 경로**:
- Linux: `/etc/mysql/mariadb.conf.d/50-server.cnf`
- macOS: `/usr/local/etc/my.cnf`
- Windows: `C:\Program Files\MariaDB 10.x\data\my.ini`

**권장 설정**:
```ini
[mysqld]
# 기본 설정
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
default-time-zone = '+09:00'

# 성능 최적화
innodb_buffer_pool_size = 2G          # 총 RAM의 70-80%
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2    # 성능 vs 안정성 (1=안정, 2=균형)
innodb_flush_method = O_DIRECT

# 연결 설정
max_connections = 200
thread_cache_size = 50

# 쿼리 캐시 (MariaDB 10.10 이하)
query_cache_type = 1
query_cache_size = 128M

# 슬로우 쿼리 로그
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 2                   # 2초 이상 쿼리 로그
```

**적용**:
```bash
sudo systemctl restart mariadb
```

### 6.2 슬로우 쿼리 분석

```bash
# 슬로우 쿼리 로그 확인
sudo tail -f /var/log/mysql/slow-query.log

# pt-query-digest (Percona Toolkit)
sudo apt install percona-toolkit
pt-query-digest /var/log/mysql/slow-query.log
```

### 6.3 테이블 최적화

```sql
-- 테이블 분석 (통계 갱신)
ANALYZE TABLE contracts;

-- 테이블 최적화 (단편화 제거)
OPTIMIZE TABLE contracts;

-- 모든 테이블 최적화
SELECT CONCAT('OPTIMIZE TABLE ', table_name, ';')
FROM information_schema.tables
WHERE table_schema = 'agoffice' AND engine = 'InnoDB';
```

---

## 7. 백업 및 복원

### 7.1 백업

```bash
# 전체 데이터베이스 백업
mysqldump -u agoffice -p agoffice > agoffice_backup_$(date +%Y%m%d).sql

# 스키마만 백업 (데이터 제외)
mysqldump -u agoffice -p --no-data agoffice > agoffice_schema.sql

# 특정 테이블만 백업
mysqldump -u agoffice -p agoffice users contracts > agoffice_users_contracts.sql

# 압축 백업
mysqldump -u agoffice -p agoffice | gzip > agoffice_backup_$(date +%Y%m%d).sql.gz
```

### 7.2 복원

```bash
# 전체 복원
mysql -u agoffice -p agoffice < agoffice_backup_20251111.sql

# 압축 파일 복원
gunzip < agoffice_backup_20251111.sql.gz | mysql -u agoffice -p agoffice

# 특정 테이블만 복원
mysql -u agoffice -p agoffice < agoffice_users_contracts.sql
```

### 7.3 자동 백업 (Cron)

```bash
# crontab 편집
crontab -e

# 매일 새벽 2시 백업
0 2 * * * mysqldump -u agoffice -p'password' agoffice | gzip > /backup/agoffice_$(date +\%Y\%m\%d).sql.gz

# 7일 이상 된 백업 파일 자동 삭제
0 3 * * * find /backup -name "agoffice_*.sql.gz" -mtime +7 -delete
```

---

## 8. Prisma와 MariaDB 연동

### 8.1 Prisma 설정

**`.env`**:
```env
DATABASE_URL="mysql://agoffice:password@localhost:3306/agoffice"
```

**`prisma/schema.prisma`**:
```prisma
datasource db {
  provider = "mysql"  // MariaDB는 mysql 프로바이더 사용
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 8.2 주의사항

**UUID 필드**:
```prisma
model User {
  id String @id @default(uuid()) @db.Char(36)
  // MariaDB: CHAR(36)
  // UUID() 함수 또는 애플리케이션에서 생성
}
```

**JSON 배열**:
```prisma
model Contract {
  services Json  // MariaDB: JSON 타입
  // 예시: ["SEO", "프리미엄", "하나탑"]
}
```

**ENUM**:
```prisma
enum Role {
  Owner
  Admin
  Manager
  Member
}

model WorkspaceUser {
  role Role @default(Member)
  // MariaDB: ENUM('Owner', 'Admin', 'Manager', 'Member')
}
```

**DATETIME vs TIMESTAMP**:
```prisma
model User {
  createdAt DateTime @default(now()) @db.DateTime
  updatedAt DateTime @updatedAt @db.DateTime
  // MariaDB: DATETIME with ON UPDATE CURRENT_TIMESTAMP
}
```

### 8.3 마이그레이션

```bash
# 마이그레이션 생성
npx prisma migrate dev --name init

# 프로덕션 배포
npx prisma migrate deploy

# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 롤백 (주의!)
npx prisma migrate reset
```

---

## 9. 문제 해결

### 9.1 문자셋 오류

**증상**: 한글 깨짐, 이모지 저장 안 됨

**해결**:
```sql
-- 데이터베이스 문자셋 확인
SHOW VARIABLES LIKE 'character%';
SHOW VARIABLES LIKE 'collation%';

-- 데이터베이스 변경
ALTER DATABASE agoffice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 테이블 변경
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 9.2 FK 제약조건 오류

**증상**: `Cannot add or update a child row: a foreign key constraint fails`

**해결**:
```sql
-- FK 체크 임시 비활성화 (개발 환경만!)
SET FOREIGN_KEY_CHECKS = 0;

-- 작업 수행
-- ...

-- FK 체크 재활성화
SET FOREIGN_KEY_CHECKS = 1;

-- FK 관계 확인
SELECT * FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'agoffice' AND REFERENCED_TABLE_NAME IS NOT NULL;
```

### 9.3 UUID() 함수 없음

**증상**: `FUNCTION agoffice.UUID does not exist`

**원인**: MariaDB 10.6 이하 버전

**해결**:
```sql
-- 방법 1: UUID_SHORT() 사용 (숫자 ID)
INSERT INTO users (id, ...) VALUES (UUID_SHORT(), ...);

-- 방법 2: 애플리케이션에서 UUID 생성 (권장)
-- Node.js: crypto.randomUUID()
-- Python: uuid.uuid4()

-- 방법 3: MariaDB 10.7+ 업그레이드
```

### 9.4 Trigger 오류

**증상**: `Trigger already exists`

**해결**:
```sql
-- Trigger 삭제 후 재생성
DROP TRIGGER IF EXISTS trg_contracts_update_expired;

-- 재생성
DELIMITER $$
CREATE TRIGGER trg_contracts_update_expired
BEFORE UPDATE ON contracts
FOR EACH ROW
BEGIN
  SET NEW.is_expired = (NEW.end_date < CURDATE());
END$$
DELIMITER ;
```

---

## 10. 체크리스트

### 10.1 설치 및 설정
- [ ] MariaDB 10.6 이상 설치
- [ ] utf8mb4 문자셋 설정
- [ ] 애플리케이션 사용자 생성
- [ ] 데이터베이스 생성

### 10.2 스키마 생성
- [ ] DDL 스크립트 실행 (`erd-v0.1-mariadb.sql`)
- [ ] 테이블 목록 확인 (20개)
- [ ] FK 관계 확인
- [ ] Trigger 생성 확인 (2개)
- [ ] 인덱스 생성 확인

### 10.3 성능 최적화
- [ ] `my.cnf` 설정 최적화
- [ ] 슬로우 쿼리 로그 활성화
- [ ] 인덱스 사용 확인 (EXPLAIN)

### 10.4 백업 및 모니터링
- [ ] 백업 스크립트 작성
- [ ] Cron 자동 백업 설정
- [ ] 복원 테스트

### 10.5 애플리케이션 연동
- [ ] Prisma 설정 (mysql 프로바이더)
- [ ] 마이그레이션 생성
- [ ] 연결 테스트

---

## 11. 다음 단계

1. ✅ MariaDB DDL 스크립트 작성
2. ✅ DBML 코드 작성 (dbdiagram.io)
3. ⏭️ Prisma 스키마 작성 (`prisma/schema.prisma`)
4. ⏭️ 시드 데이터 작성 (`prisma/seed.ts`)
5. ⏭️ API 계약서 작성 (`docs/api-spec.md`)

---

**작성 완료일**: 2025-11-11
