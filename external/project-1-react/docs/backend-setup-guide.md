# 백엔드 설정 가이드

이 문서는 AGOFFICE 프로젝트의 백엔드 설정 방법을 안내합니다.

## 목차

1. [필수 패키지 설치](#필수-패키지-설치)
2. [데이터베이스 설정](#데이터베이스-설정)
3. [환경 변수 설정](#환경-변수-설정)
4. [Prisma 마이그레이션](#prisma-마이그레이션)
5. [SSO 프로바이더 설정](#sso-프로바이더-설정)
6. [API 엔드포인트](#api-엔드포인트)

---

## 필수 패키지 설치

프로젝트 루트에서 다음 명령어를 실행하세요:

```bash
pnpm install
```

설치되는 주요 패키지:
- `@prisma/client`: Prisma ORM 클라이언트
- `next-auth`: Next.js 인증 라이브러리
- `bcryptjs`: 비밀번호 해싱
- `jsonwebtoken`: JWT 토큰 생성/검증
- `@auth/prisma-adapter`: NextAuth Prisma 어댑터

---

## 데이터베이스 설정

### MySQL/MariaDB 데이터베이스 생성

```sql
CREATE DATABASE agoffice CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 연결 문자열 형식

```
mysql://사용자명:비밀번호@호스트:포트/데이터베이스명
```

예시:
```
mysql://root:password@localhost:3306/agoffice
```

---

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 데이터베이스 연결
DATABASE_URL="mysql://user:password@localhost:3306/agoffice"

# NextAuth 설정
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here-change-in-production"

# JWT 토큰 시크릿 키
JWT_SECRET="your-jwt-secret-key-here-change-in-production"
JWT_REFRESH_SECRET="your-jwt-refresh-secret-key-here-change-in-production"

# 구글 OAuth 설정
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 카카오 OAuth 설정
KAKAO_CLIENT_ID="your-kakao-client-id"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"

# 네이버 OAuth 설정
NAVER_CLIENT_ID="your-naver-client-id"
NAVER_CLIENT_SECRET="your-naver-client-secret"
```

### 시크릿 키 생성

터미널에서 다음 명령어로 시크릿 키를 생성할 수 있습니다:

```bash
# NextAuth 시크릿
openssl rand -base64 32

# JWT 시크릿
openssl rand -base64 32
```

---

## Prisma 마이그레이션

### 1. Prisma 클라이언트 생성

```bash
npx prisma generate
```

### 2. 데이터베이스 마이그레이션

```bash
# 개발 환경
npx prisma migrate dev --name init

# 프로덕션 환경
npx prisma migrate deploy
```

### 3. Prisma Studio (선택사항)

데이터베이스를 시각적으로 확인하려면:

```bash
npx prisma studio
```

---

## SSO 프로바이더 설정

> **상세 가이드**: 각 프로바이더의 Redirect URI 등록 방법은 [SSO 프로바이더 설정 가이드](./sso-provider-setup-guide.md)를 참고하세요.

### 콜백 URL 형식

모든 프로바이더는 다음 형식의 콜백 URL을 사용합니다:

- **개발 환경**: `http://localhost:3000/api/auth/callback/{provider}`
- **프로덕션 환경**: `https://yourdomain.com/api/auth/callback/{provider}`

### 각 프로바이더별 콜백 URL

- **구글**: `/api/auth/callback/google`
- **카카오**: `/api/auth/callback/kakao`
- **네이버**: `/api/auth/callback/naver`

### 간단한 설정 요약

1. **구글**: [Google Cloud Console](https://console.cloud.google.com/)에서 OAuth 클라이언트 ID 생성
2. **카카오**: [Kakao Developers](https://developers.kakao.com/)에서 애플리케이션 등록 및 Redirect URI 설정
3. **네이버**: [Naver Developers](https://developers.naver.com/)에서 애플리케이션 등록 및 Callback URL 설정

자세한 설정 방법은 [SSO 프로바이더 설정 가이드](./sso-provider-setup-guide.md)를 참고하세요.

---

## API 엔드포인트

### 인증 관련 API

#### 1. 회원가입

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678",
  "companyName": "회사명",
  "position": "직책"
}
```

#### 2. 로그인 (NextAuth)

```http
POST /api/auth/signin/credentials
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 3. SSO 로그인

- 구글: `GET /api/auth/signin/google`
- 카카오: `GET /api/auth/signin/kakao`
- 네이버: `GET /api/auth/signin/naver`

#### 4. 토큰 갱신

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### 5. 로그아웃

```http
POST /api/auth/logout
```

---

## 데이터베이스 스키마

### 인증 관련 테이블

1. **users**: 사용자 정보
   - 자체 회원가입 및 SSO 사용자 모두 저장
   - SSO 사용자는 `password_hash`가 NULL

2. **accounts**: SSO 계정 연결
   - NextAuth용 계정 정보 저장
   - 구글, 카카오, 네이버 계정 연결

3. **sessions**: 세션 관리
   - NextAuth 세션 정보 저장

4. **tokens**: JWT 토큰 관리
   - Access Token 및 Refresh Token 저장
   - 토큰 무효화(is_revoked) 지원

---

## 보안 고려사항

1. **환경 변수 보호**
   - `.env` 파일은 절대 커밋하지 마세요
   - 프로덕션에서는 환경 변수를 안전하게 관리하세요

2. **비밀번호 해싱**
   - `bcryptjs`를 사용하여 비밀번호를 해싱합니다
   - Salt rounds는 10으로 설정되어 있습니다

3. **JWT 토큰**
   - Access Token: 15분 만료
   - Refresh Token: 7일 만료
   - 토큰은 데이터베이스에 저장되어 무효화 가능

4. **HTTPS 사용**
   - 프로덕션 환경에서는 반드시 HTTPS를 사용하세요

---

## 문제 해결

### Prisma 클라이언트 생성 오류

```bash
# Prisma 클라이언트 재생성
npx prisma generate
```

### 마이그레이션 오류

```bash
# 마이그레이션 상태 확인
npx prisma migrate status

# 마이그레이션 리셋 (주의: 데이터 삭제됨)
npx prisma migrate reset
```

### 데이터베이스 연결 오류

- `DATABASE_URL` 환경 변수가 올바른지 확인
- 데이터베이스 서버가 실행 중인지 확인
- 방화벽 설정 확인

---

## 다음 단계

1. 프론트엔드에서 인증 API 연동
2. 보호된 라우트 설정
3. 사용자 권한 관리 구현
4. 추가 비즈니스 로직 구현

---

**작성일**: 2025-01-27
**버전**: 1.0.0

