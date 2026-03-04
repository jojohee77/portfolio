# 조성희 포트폴리오

브랜드에 색을 더하는 웹디자이너, 조성희의 포트폴리오 웹사이트입니다.

## 🚀 기술 스택

- **Framework**: React 18.3.1
- **Language**: TypeScript 5.5.3
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **Routing**: React Router DOM 7.13.0
- **Icons**: Lucide React 0.487.0
- **Animation**: Framer Motion 11.0.0

## 📁 프로젝트 구조

```
portfolio/
├── src/
│   ├── components/
│   │   ├── shared/           # 공통 컴포넌트 (여러 페이지에서 재사용)
│   │   │   └── ContactSection.tsx
│   │   ├── sections/         # 메인 페이지 섹션
│   │   │   ├── HeroSection.tsx
│   │   │   ├── IntroSection.tsx
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── ExperienceSection.tsx
│   │   │   ├── SkillSection.tsx
│   │   │   └── ProjectsSection.tsx
│   │   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   │   │   ├── Badge.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── SectionTitle.tsx
│   │   │   └── SkillIcon.tsx
│   │   └── ScrollToTop.tsx
│   ├── data/                 # 데이터 파일
│   │   ├── projects.ts
│   │   ├── experience.ts
│   │   └── skills.ts
│   ├── pages/                # 페이지 컴포넌트
│   │   ├── MainPage.tsx
│   │   └── projects/
│   │       ├── AgOfficeDetail.tsx
│   │       ├── BbagleAiDetail.tsx
│   │       ├── GazetAiDetail.tsx
│   │       └── HamsterMbtiDetail.tsx
│   ├── styles/
│   │   └── index.css
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── images/              # 모든 이미지 파일 (27개 필수)
│       ├── IMAGE_LIST.md    # 이미지 목록 가이드
│       ├── profile.png
│       ├── ag-office.png
│       └── ... (나머지 이미지들)
└── index.html
```

## 🛠️ 설치 및 실행

### 1. 이미지 추가 (필수!)

`public/images/` 폴더에 이미지 파일들을 넣으세요. 
자세한 목록은 `public/images/IMAGE_LIST.md` 참고

**필수 이미지 (27개)**
- profile.png (1개)
- 프로젝트 썸네일 (9개): ag-office.png, bbagle-ai.png 등
- 스킬 아이콘 (17개): html.png, css.png, photoshop.png 등

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:5174 으로 접속하세요.

### 4. 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 5. 프리뷰

```bash
npm run preview
```

## 📱 주요 기능

### ✅ 반응형 디자인
- 모바일, 태블릿, 데스크톱 모두 최적화
- Tailwind CSS의 반응형 클래스 활용

### ✅ 공통 컴포넌트
- ContactSection: 모든 페이지 하단에서 재사용
- UI 컴포넌트: Badge, ProjectCard, SectionTitle 등

### ✅ 페이지 구성
- **메인 페이지**: Hero, Intro, Profile, Experience, Skill, Projects, Contact
- **프로젝트 상세 페이지**: 4개 프로젝트 (Ag오피스, 빠글AI, 가제트AI, 햄찌MBTI)

### ✅ 데이터 관리
- 프로젝트, 경력, 스킬 데이터를 별도 파일로 분리
- 쉬운 유지보수 및 업데이트

## 🎨 디자인 시스템

### 색상
- Primary: `#29E160` (녹색)
- Background: `#2B2B2B` (다크 그레이)
- Text: `#F4F4F4`, `#E9E9E9`, `#A0A0A0`

### 반응형 브레이크포인트
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1440px

## 📝 다음 단계

### 필수 작업
1. `/public/assets/` 폴더에 이미지 파일 추가
   - profile.png (프로필 사진)
   - projects/ (프로젝트 썸네일)
   - skills/ (스킬 아이콘)

2. 폰트 파일 추가 (선택사항)
   - Paperlogy 폰트 또는 대체 폰트

### 선택 작업
- 애니메이션 추가 (Framer Motion)
- SEO 최적화
- 이미지 최적화
- 로딩 상태 개선

## 📄 라이선스

© 2026 Jodesign. All rights reserved.

## 👤 Contact

- **Email**: jodesign94@gmail.com
- **Phone**: 010-6480-1979
