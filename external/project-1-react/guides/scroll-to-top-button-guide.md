# Scroll To Top 버튼 가이드

## 📌 개요

모바일 환경에서 페이지 스크롤이 길어질 때 화면 오른쪽 하단에 나타나는 TOP 버튼입니다. 사용자가 빠르게 페이지 상단으로 돌아갈 수 있도록 돕습니다.

## 🎨 디자인 명세

### 외형
- **형태**: 원형 (Circle)
- **색상**: Primary Blue (`#0c5ce2`) - 투명도 80%
- **호버 효과**: 투명도 100% (opacity-100)
- **크기**: 48px (w-12 h-12)

### 아이콘 및 텍스트
- **아이콘**: 위쪽 화살표 (ChevronUp)
- **텍스트**: "TOP" (영문, 대문자)
- **텍스트 크기**: 12px (text-xs)
- **텍스트 굵기**: Semibold (font-semibold)
- **색상**: White (`#ffffff`)
- **레이아웃**: 아이콘 위, 텍스트 아래 (세로 정렬)

### 위치 및 배치
- **위치**: 고정 (Fixed)
- **가로 정렬**: 오른쪽 끝 (right-6 = 24px)
- **세로 정렬**: 하단 (bottom-6 = 24px)
- **z-index**: 50 (다른 요소 위에 표시)

## 🔧 기술 명세

### 컴포넌트 위치
```
components/scroll-to-top-button.tsx
```

### 자동 적용
- `Providers` 컴포넌트에 포함되어 있어 **모든 페이지에 자동으로 적용**됩니다
- 추가 설정이 필요 없습니다

### 활성화 조건
1. **모바일 화면만**: 768px 이하 (useIsMobile 훅 기반)
2. **스크롤 위치**: 300px 이상 스크롤했을 때만 표시
3. **Smooth 애니메이션**: 클릭 시 부드러운 스크롤 이동

## 💻 코드 예시

### 기본 사용 (자동 적용)
```tsx
// 별도 설정 불필요 - Providers에 포함되어 있음
// app/layout.tsx에서 자동으로 모든 페이지에 적용됩니다
```

### 특정 페이지에서만 비활성화하기 (필요시)
```tsx
// 만약 특정 페이지에서 TOP 버튼을 제외하고 싶다면
// Providers 컴포넌트 조건부 렌더링 추가 필요
// (현재는 모든 페이지에 자동 적용)
```

## 📱 모바일 반응형

### 스크린 사이즈별 동작
| 크기 | 상태 | 설명 |
|------|------|------|
| **< 768px** | 활성화 | 모바일 환경에서 TOP 버튼 표시 |
| **≥ 768px** | 비활성화 | 데스크톱/태블릿에서는 표시 안 함 |

### 스크롤 거리별 동작
| 거리 | 상태 | 설명 |
|------|------|------|
| **0px ~ 299px** | 숨김 | 페이지 상단 근처에서는 불필요 |
| **300px 이상** | 표시 | 충분히 스크롤했을 때 버튼 표시 |

## 🎯 인터랙션

### 기본 동작
1. **표시**: 모바일에서 300px 이상 스크롤 시 나타남
2. **클릭**: 부드러운 애니메이션과 함께 페이지 상단으로 이동
3. **호버**: 투명도 증가로 버튼 강조 (opacity: 80% → 100%)

### 키보드 접근성
```tsx
aria-label="페이지 맨 위로 이동"  // 스크린 리더 지원
```

## 🎨 커스터마이징

### 표시되는 스크롤 높이 변경
```tsx
// scroll-to-top-button.tsx에서
setIsVisible(window.scrollY > 300)  // 기본값: 300px
setIsVisible(window.scrollY > 500)  // 변경값: 500px
```

### 버튼 크기 조정
```tsx
className="w-12 h-12"  // 기본값: 48px
className="w-14 h-14"  // 변경값: 56px
```

### 위치 조정
```tsx
className="bottom-6 right-6"   // 기본값: 하단 24px, 우측 24px
className="bottom-8 right-8"   // 변경값: 하단 32px, 우측 32px
```

### 색상 커스터마이징
```tsx
// 배경 색상
<div className="bg-primary opacity-80">  // 기본값: Primary Blue
<div className="bg-blue-600 opacity-80"> // 변경값: 다른 파란색

// 텍스트 색상
className="text-primary-foreground"      // 기본값: White
className="text-white"                   // 변경값: 명시적 White
```

## 📊 스타일 가이드

### Tailwind CSS 클래스 분석
```tsx
// 컨테이너
fixed bottom-6 right-6 z-50                    // 위치 & 레이어

// 배경 원형
w-12 h-12 rounded-full                         // 48px 원형
bg-primary opacity-80 hover:opacity-100        // 색상 & 투명도
transition-opacity                            // 부드러운 전환

// 컨텐츠 (아이콘 + 텍스트)
flex flex-col items-center justify-center      // 중앙 정렬

// 아이콘
w-5 h-5 text-primary-foreground               // 20px 화이트

// 텍스트
text-xs font-semibold text-primary-foreground  // 12px Semibold 화이트
leading-tight                                  // 줄 간격 조정
```

## 🔍 CSS 변수 참고

### 프로젝트의 주요 색상 변수
```css
--primary: #0c5ce2              /* Primary Blue */
--primary-foreground: #ffffff   /* White */
```

## 🚀 성능 고려사항

### 최적화 포인트
1. **이벤트 리스너 정리**: useEffect cleanup에서 제거
2. **조건부 렌더링**: 모바일이 아니면 null 반환 (DOM에 추가 안 함)
3. **Z-index 관리**: z-50으로 모달/팝업 위에 표시 가능 (필요시 조정)

## ✅ 체크리스트

구현 시 확인 사항:
- [ ] 모바일에서만 표시 확인 (768px 이하)
- [ ] 스크롤 300px 이상에서 버튼 나타남 확인
- [ ] 클릭 시 부드럽게 상단으로 이동 확인
- [ ] 호버 효과 (투명도 변화) 확인
- [ ] 아이콘 및 텍스트 "TOP" 표시 확인
- [ ] 우측 하단 위치 확인 (margin: 24px)
- [ ] 다양한 모바일 디바이스에서 테스트

## 📚 관련 리소스

- **아이콘**: Lucide React의 `ChevronUp`
- **모바일 감지**: `useIsMobile()` 훅
- **적용 컴포넌트**: `Providers` 컴포넌트
- **색상 시스템**: [color-system-guide.md](./color-system-guide.md)

## 🔄 버전 히스토리

- **v1.0** (2024-12-20): 초기 구현
  - 모바일 전용 TOP 버튼
  - 스크롤 300px 기준 표시
  - Smooth 스크롤 애니메이션
  - 모든 페이지에 자동 적용

---

**작성일**: 2024-12-20  
**적용 프로젝트**: AGOFFICE  
**버전**: 1.0
