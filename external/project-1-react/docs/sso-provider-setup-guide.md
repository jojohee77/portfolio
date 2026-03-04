# SSO 프로바이더 설정 가이드

각 SSO 서비스(구글, 카카오, 네이버)에 Redirect URI를 등록하는 방법을 안내합니다.

## 콜백 URL 형식

NextAuth는 다음 형식의 콜백 URL을 사용합니다:

```
{도메인}/api/auth/callback/{프로바이더명}
```

### 예시

**개발 환경 (로컬):**
- 구글: `http://localhost:3000/api/auth/callback/google`
- 카카오: `http://localhost:3000/api/auth/callback/kakao`
- 네이버: `http://localhost:3000/api/auth/callback/naver`

**프로덕션 환경:**
- 구글: `https://yourdomain.com/api/auth/callback/google`
- 카카오: `https://yourdomain.com/api/auth/callback/kakao`
- 네이버: `https://yourdomain.com/api/auth/callback/naver`

---

## 1. 구글 (Google) OAuth 설정

### 1.1 Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인

### 1.2 프로젝트 생성/선택

1. 상단 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: `AGOFFICE`)
4. "만들기" 클릭

### 1.3 OAuth 동의 화면 설정

1. 좌측 메뉴에서 **"API 및 서비스" > "OAuth 동의 화면"** 선택
2. 사용자 유형 선택:
   - **외부**: 일반 사용자도 사용 가능
   - **내부**: Google Workspace 내부 사용자만 사용 가능
3. 앱 정보 입력:
   - 앱 이름: `AGOFFICE`
   - 사용자 지원 이메일: 본인 이메일
   - 앱 로고: (선택사항)
   - 앱 도메인: `yourdomain.com` (프로덕션)
   - 개발자 연락처 정보: 본인 이메일
4. "저장 후 계속" 클릭
5. 범위(Scopes) 설정:
   - "범위 추가 또는 삭제" 클릭
   - 다음 범위 선택:
     - `userinfo.email`
     - `userinfo.profile`
   - "업데이트" 클릭
6. "저장 후 계속" 클릭
7. 테스트 사용자 추가 (외부 앱인 경우):
   - "사용자 추가" 클릭
   - 테스트할 이메일 주소 입력
   - "추가" 클릭
8. "저장 후 계속" 클릭

### 1.4 OAuth 클라이언트 ID 생성

1. 좌측 메뉴에서 **"API 및 서비스" > "사용자 인증 정보"** 선택
2. 상단 "+ 사용자 인증 정보 만들기" > **"OAuth 클라이언트 ID"** 선택
3. 애플리케이션 유형: **"웹 애플리케이션"** 선택
4. 이름 입력: `AGOFFICE Web Client`
5. 승인된 JavaScript 원본:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://yourdomain.com`
6. 승인된 리디렉션 URI:
   - 개발: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/google`
7. "만들기" 클릭
8. **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사
   - 이 값들을 `.env` 파일에 설정:
     ```
     GOOGLE_CLIENT_ID="복사한-클라이언트-ID"
     GOOGLE_CLIENT_SECRET="복사한-클라이언트-보안-비밀번호"
     ```

### 1.5 Google+ API 활성화 (필요시)

1. "API 및 서비스" > "라이브러리" 선택
2. "Google+ API" 검색 후 활성화

---

## 2. 카카오 (Kakao) OAuth 설정

### 2.1 Kakao Developers 접속

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 카카오 계정으로 로그인

### 2.2 애플리케이션 등록

1. 상단 "내 애플리케이션" 클릭
2. "+ 애플리케이션 추가하기" 클릭
3. 앱 정보 입력:
   - 앱 이름: `AGOFFICE`
   - 사업자명: (선택사항)
4. "저장" 클릭

### 2.3 플랫폼 설정

1. 등록한 애플리케이션 클릭
2. 좌측 메뉴에서 **"앱 설정" > "플랫폼"** 선택
3. "Web 플랫폼 등록" 클릭
4. 사이트 도메인 입력:
   - 개발: `http://localhost:3000`
   - 프로덕션: `https://yourdomain.com`
5. "저장" 클릭

### 2.4 카카오 로그인 활성화

1. 좌측 메뉴에서 **"제품 설정" > "카카오 로그인"** 선택
2. "활성화 설정" ON
3. Redirect URI 등록:
   - 개발: `http://localhost:3000/api/auth/callback/kakao`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/kakao`
   - "+ URI 추가" 클릭하여 각각 추가
4. "저장" 클릭

### 2.5 동의 항목 설정

1. 좌측 메뉴에서 **"제품 설정" > "카카오 로그인" > "동의항목"** 선택
2. 필수 동의 항목 설정:
   - **닉네임** (필수)
   - **프로필 사진** (선택)
   - **카카오계정(이메일)** (필수)
3. "저장" 클릭

### 2.6 REST API 키 확인

1. 좌측 메뉴에서 **"앱 설정" > "앱 키"** 선택
2. **REST API 키** 복사
   - 이 값이 `KAKAO_CLIENT_ID`입니다
3. **Client Secret** 생성:
   - "제품 설정" > "카카오 로그인" > "보안" 선택
   - "Client Secret 코드" 생성
   - 생성된 코드 복사 (한 번만 표시되므로 주의!)
4. `.env` 파일에 설정:
   ```
   KAKAO_CLIENT_ID="복사한-REST-API-키"
   KAKAO_CLIENT_SECRET="생성한-Client-Secret-코드"
   ```

---

## 3. 네이버 (Naver) OAuth 설정

### 3.1 Naver Developers 접속

1. [Naver Developers](https://developers.naver.com/) 접속
2. 네이버 계정으로 로그인

### 3.2 애플리케이션 등록

1. 상단 "Application" > "애플리케이션 등록" 클릭
2. 애플리케이션 정보 입력:
   - 애플리케이션 이름: `AGOFFICE`
   - 사용 API: **"네이버 로그인"** 선택
   - 로그인 오픈 API 서비스 환경: **"서비스 환경"** 선택
   - 서비스 URL:
     - 개발: `http://localhost:3000`
     - 프로덕션: `https://yourdomain.com`
   - Callback URL:
     - 개발: `http://localhost:3000/api/auth/callback/naver`
     - 프로덕션: `https://yourdomain.com/api/auth/callback/naver`
3. "등록하기" 클릭

### 3.3 클라이언트 ID 및 Secret 확인

1. 등록한 애플리케이션 클릭
2. **Client ID** 복사
3. **Client Secret** 복사
4. `.env` 파일에 설정:
   ```
   NAVER_CLIENT_ID="복사한-Client-ID"
   NAVER_CLIENT_SECRET="복사한-Client-Secret"
   ```

### 3.4 API 설정 확인

1. "API 설정" 탭에서 다음 항목이 활성화되어 있는지 확인:
   - 네이버 로그인
   - 사용자 정보 조회 (이메일, 이름, 프로필 사진)

---

## 4. 환경 변수 설정

모든 프로바이더 설정이 완료되면 `.env` 파일에 다음 변수들을 설정하세요:

```env
# 구글 OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# 카카오 OAuth
KAKAO_CLIENT_ID="your-kakao-rest-api-key"
KAKAO_CLIENT_SECRET="your-kakao-client-secret"

# 네이버 OAuth
NAVER_CLIENT_ID="your-naver-client-id"
NAVER_CLIENT_SECRET="your-naver-client-secret"

# NextAuth 설정
NEXTAUTH_URL="http://localhost:3000"  # 개발 환경
# NEXTAUTH_URL="https://yourdomain.com"  # 프로덕션 환경
NEXTAUTH_SECRET="your-nextauth-secret"
```

---

## 5. 테스트 방법

### 5.1 개발 서버 실행

```bash
pnpm dev
```

### 5.2 로그인 페이지 접속

브라우저에서 `http://localhost:3000/login` 접속

### 5.3 SSO 로그인 테스트

각 프로바이더 버튼 클릭하여 로그인 플로우 확인:
- 구글 로그인 버튼 클릭
- 카카오 로그인 버튼 클릭
- 네이버 로그인 버튼 클릭

### 5.4 콜백 URL 확인

로그인 성공 후 다음 URL로 리디렉션되는지 확인:
- `http://localhost:3000/api/auth/callback/{provider}`

---

## 6. 프로덕션 배포 시 주의사항

### 6.1 도메인 변경

프로덕션 환경에서는 다음을 변경해야 합니다:

1. **각 프로바이더 콘솔에서:**
   - Redirect URI를 프로덕션 도메인으로 변경
   - 예: `https://yourdomain.com/api/auth/callback/google`

2. **환경 변수:**
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   ```

### 6.2 HTTPS 필수

모든 프로바이더는 프로덕션 환경에서 HTTPS를 요구합니다.

### 6.3 Client Secret 보안

- Client Secret은 절대 공개 저장소에 커밋하지 마세요
- 환경 변수로만 관리하세요
- 프로덕션 환경에서는 안전한 환경 변수 관리 도구 사용

---

## 7. 문제 해결

### 7.1 "redirect_uri_mismatch" 오류

**원인:** 등록된 Redirect URI와 실제 요청 URI가 일치하지 않음

**해결:**
1. 각 프로바이더 콘솔에서 등록한 Redirect URI 확인
2. 실제 요청 URI와 정확히 일치하는지 확인
3. 프로토콜(http/https), 도메인, 경로가 모두 일치해야 함

### 7.2 "invalid_client" 오류

**원인:** Client ID 또는 Client Secret이 잘못됨

**해결:**
1. `.env` 파일의 Client ID/Secret 확인
2. 각 프로바이더 콘솔에서 값 재확인
3. 공백이나 따옴표가 포함되지 않았는지 확인

### 7.3 카카오 "KAE101" 오류

**원인:** 동의 항목이 설정되지 않음

**해결:**
1. 카카오 개발자 콘솔에서 동의 항목 설정 확인
2. 필수 동의 항목(닉네임, 이메일)이 활성화되어 있는지 확인

### 7.4 네이버 "invalid_request" 오류

**원인:** Callback URL이 등록되지 않았거나 잘못됨

**해결:**
1. 네이버 개발자 콘솔에서 Callback URL 확인
2. 정확한 URL 형식 확인: `https://yourdomain.com/api/auth/callback/naver`

---

## 8. 체크리스트

각 프로바이더 설정 완료 후 확인:

### 구글
- [ ] OAuth 동의 화면 설정 완료
- [ ] OAuth 클라이언트 ID 생성 완료
- [ ] Redirect URI 등록 완료
- [ ] Client ID/Secret 환경 변수 설정 완료

### 카카오
- [ ] 애플리케이션 등록 완료
- [ ] Web 플랫폼 등록 완료
- [ ] 카카오 로그인 활성화 완료
- [ ] Redirect URI 등록 완료
- [ ] 동의 항목 설정 완료
- [ ] REST API 키 및 Client Secret 환경 변수 설정 완료

### 네이버
- [ ] 애플리케이션 등록 완료
- [ ] Callback URL 등록 완료
- [ ] Client ID/Secret 환경 변수 설정 완료

---

**작성일**: 2025-01-27
**버전**: 1.0.0

