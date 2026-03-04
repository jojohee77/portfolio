# 뒤로가기 버튼 + 타이틀 헤더 가이드

## 개요
모달이나 페이지 네비게이션에서 뒤로가기 버튼과 타이틀을 함께 표시하는 헤더 컴포넌트 가이드입니다.

## 사용 사례
- 계층형 모달 (예: 팀 구성원 관리 → 팀원 추가)
- 서브페이지 헤더
- 상세 정보 화면

## 기본 구조

```tsx
import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft } from "lucide-react"

<div className="flex items-center gap-3">
  <Button
    variant="ghost"
    className="h-8 w-8 p-0 text-gray-600 hover:bg-transparent hover:text-gray-600"
    onClick={() => {
      // 뒤로 가기 로직
    }}
  >
    <ChevronLeft style={{ width: '24px', height: '24px' }} />
  </Button>
  <DialogTitle className="text-xl font-semibold">타이틀</DialogTitle>
</div>
```

## 스타일 상세 설명

### 1. 컨테이너
```jsx
<div className="flex items-center gap-3">
```
- `flex`: 가로 배치
- `items-center`: 수직 중앙 정렬
- `gap-3`: 버튼과 타이틀 사이 간격 (12px)

### 2. 뒤로가기 버튼
```jsx
<Button
  variant="ghost"           // 기본 배경 없음
  className="h-8 w-8 p-0   // 버튼 크기: 32x32px, 패딩 제거
             text-gray-600  // 아이콘 색상: 회색
             hover:bg-transparent    // 호버 배경 제거
             hover:text-gray-600"    // 호버 시 색상 유지
  onClick={...}
>
```

**주의사항:**
- `size="icon"` 속성 제거 (고정 크기 CSS 충돌)
- `p-0`: 버튼 내부 padding 제거하여 아이콘이 정확한 크기로 표시

### 3. 아이콘
```jsx
<ChevronLeft style={{ width: '24px', height: '24px' }} />
```

**왜 인라인 스타일을 사용하나?**
- Tailwind className이 먹지 않는 경우가 있음
- 인라인 스타일이 더 높은 CSS specificity를 가짐
- SVG의 내재적 크기 제약을 직접 오버라이드

**크기 옵션:**
- `'20px'`: 매우 작은 크기
- `'24px'`: 기본 크기 (권장)
- `'28px'`: 중간 크기
- `'32px'`: 큰 크기

### 4. 타이틀
```jsx
<DialogTitle className="text-xl font-semibold">
```
- `text-xl`: 헤더 텍스트 크기 (20px)
- `font-semibold`: 굵기 (600)

## 색상 커스터마이징

### 기본 (회색)
```jsx
className="text-gray-600"
```

### 파란색 (활성)
```jsx
className="text-blue-600 hover:bg-transparent hover:text-blue-600"
```

### 빨간색 (위험)
```jsx
className="text-red-600 hover:bg-transparent hover:text-red-600"
```

## 반응형 적응

### 모바일 대응
```jsx
<div className="flex items-center gap-2 sm:gap-3">
  <Button className="h-7 w-7 sm:h-8 sm:w-8 p-0 ...">
    <ChevronLeft style={{ width: '20px', height: '20px' }} />
  </Button>
  <DialogTitle className="text-lg sm:text-xl font-semibold">
    타이틀
  </DialogTitle>
</div>
```

- 모바일: gap-2, 버튼 h-7 w-7, 아이콘 20px
- 데스크톱: gap-3, 버튼 h-8 w-8, 아이콘 24px

## 일반적인 실수

❌ **잘못된 예:**
```jsx
<Button size="icon" className="h-8 w-8">
  <ChevronLeft className="h-8 w-8" />
</Button>
```
- `size="icon"`과 className의 크기 충돌
- 아이콘이 원하는 크기로 표시되지 않음

✅ **올바른 예:**
```jsx
<Button variant="ghost" className="h-8 w-8 p-0">
  <ChevronLeft style={{ width: '24px', height: '24px' }} />
</Button>
```

## 상호작용 (onClick 핸들링)

### 모달 네비게이션
```jsx
<Button
  onClick={() => {
    setCurrentModal(false)      // 현재 모달 닫기
    setPreviousModal(true)      // 이전 모달 열기
  }}
>
```

### 페이지 라우팅
```jsx
<Button
  onClick={() => {
    router.back()  // 또는 router.push(previousPath)
  }}
>
```

## 체크리스트

- [ ] `variant="ghost"` 사용
- [ ] `p-0` 추가 (패딩 제거)
- [ ] `size="icon"` 제거 (있다면)
- [ ] 아이콘에 인라인 스타일 적용
- [ ] hover 스타일: `hover:bg-transparent hover:text-[색상]`
- [ ] gap-3으로 버튼과 타이틀 간격 설정
- [ ] 뒤로가기 로직 구현
