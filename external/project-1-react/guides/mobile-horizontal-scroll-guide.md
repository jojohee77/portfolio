# 모바일 가로스크롤 문제 해결 가이드

## 문제 상황

모바일 환경에서 특정 컴포넌트(예: 탭 메뉴)에 가로 스크롤을 적용했을 때, 컴포넌트 내부가 아닌 **페이지 전체가 가로로 스크롤**되는 문제가 발생할 수 있습니다.

### 증상
- 탭이나 긴 콘텐츠가 화면 너비를 초과할 때 페이지 전체가 넓어짐
- 의도한 영역만 스크롤되지 않고 모든 콘텐츠가 가로로 늘어남
- 반응형 레이아웃이 깨짐

## 원인 분석

### 1. Flexbox의 기본 동작
```tsx
// ❌ 문제가 있는 코드
<div className="flex">
  <Sidebar />
  <main className="flex-1">
    {/* 콘텐츠 */}
  </main>
</div>
```

**문제**: `flex-1`을 사용한 flex item은 기본적으로 자식 요소의 `min-width`를 `auto`로 설정합니다. 이로 인해 자식의 콘텐츠가 넓어지면 부모도 함께 넓어집니다.

### 2. `w-max` 또는 `min-w-max` 사용
```tsx
// ❌ 문제가 있는 코드
<div className="overflow-x-auto">
  <div className="flex gap-8 w-max">
    {/* 탭들 */}
  </div>
</div>
```

**문제**: `w-max`는 콘텐츠 크기만큼 너비를 강제로 설정하므로, 부모 컨테이너의 너비 제한을 무시하고 페이지 전체를 넓힙니다.

### 3. 큰 gap 값
```tsx
// ❌ 모바일에서 문제
<div className="flex gap-8">
  {/* gap-8 = 32px로 모바일에서 너무 큼 */}
</div>
```

**문제**: 고정된 큰 gap 값은 모바일에서 불필요하게 넓은 공간을 차지합니다.

## 해결 방법

### 1. Flex 부모에 `min-w-0` 추가 (핵심 해결책)

```tsx
// ✅ 올바른 코드
<div className="flex">
  <Sidebar />
  <main className="flex-1 min-w-0">
    {/* 콘텐츠 */}
  </main>
</div>
```

**설명**: `min-w-0`은 flex item의 최소 너비를 0으로 설정하여, 콘텐츠 크기와 관계없이 부모 너비에 맞춰 축소될 수 있게 합니다.

### 2. 스크롤 영역 올바르게 구성

```tsx
// ✅ 올바른 코드
<div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide">
  <div className="flex gap-4 sm:gap-6 lg:gap-8">
    {tabs.map((tab) => (
      <Link
        key={tab.href}
        href={tab.href}
        className="flex-shrink-0 whitespace-nowrap"
      >
        {tab.name}
      </Link>
    ))}
  </div>
</div>
```

**핵심 포인트**:
- 외부 컨테이너: `w-full` + `overflow-x-auto` (너비 100%, 가로 스크롤)
- 내부 컨테이너: 너비 지정 없음 + `flex` (콘텐츠만큼 자연스럽게)
- 아이템: `flex-shrink-0` + `whitespace-nowrap` (축소 방지, 줄바꿈 방지)
- `w-max` 사용하지 않기

### 3. 음수 마진으로 스크롤 영역 확장 (선택사항)

```tsx
// ✅ 화면 가장자리까지 스크롤하고 싶을 때
<div className="w-full overflow-x-auto scrollbar-hide -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
  <div className="flex gap-4 sm:gap-6 lg:gap-8">
    {/* 아이템들 */}
  </div>
</div>
```

**설명**: 
- `-mx`: 음수 마진으로 부모의 padding을 넘어서 확장
- `px`: 내부 padding으로 콘텐츠 여백 유지
- 화면 가장자리까지 스크롤 가능하게 함

### 4. 반응형 간격 적용

```tsx
// ✅ 화면 크기별 적절한 간격
<div className="flex gap-4 sm:gap-6 lg:gap-8">
  <Link className="text-base sm:text-lg">탭1</Link>
  <Link className="text-base sm:text-lg">탭2</Link>
</div>
```

**적용**:
- 모바일: `gap-4` (16px), `text-base` (16px)
- 태블릿: `gap-6` (24px), `text-lg` (18px)
- 데스크톱: `gap-8` (32px), `text-lg` (18px)

## 완전한 예제

### 탭 네비게이션 컴포넌트

```tsx
function ProfileTabs() {
  const pathname = usePathname()
  
  const tabs = [
    { name: "계정정보", href: "/profile/account" },
    { name: "멤버십 관리", href: "/profile/membership" },
    { name: "결제 정보", href: "/profile/payment" },
    { name: "MY문의", href: "/profile/inquiry" },
  ]

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden scrollbar-hide -mx-3 sm:-mx-4 lg:-mx-6 px-3 sm:px-4 lg:px-6">
      <div className="flex gap-4 sm:gap-6 lg:gap-8">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex-shrink-0 px-0 py-2 text-base sm:text-lg bg-transparent transition-all cursor-pointer whitespace-nowrap",
                isActive
                  ? "font-extrabold text-foreground underline underline-offset-8"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
```

### 페이지 레이아웃

```tsx
export default function Page() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        {/* 핵심: min-w-0 추가 */}
        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 space-y-6">
          <h1>페이지 제목</h1>
          
          {/* 탭 네비게이션 */}
          <ProfileTabs />
          
          {/* 나머지 콘텐츠 */}
          <Card>
            {/* ... */}
          </Card>
        </main>
      </div>
    </div>
  )
}
```

## 체크리스트

해결 전 다음 사항들을 확인하세요:

- [ ] Flex 컨테이너의 main/content 영역에 `min-w-0` 적용
- [ ] 스크롤 영역에 `w-max` 또는 `min-w-max` 사용하지 않기
- [ ] 외부 컨테이너: `w-full overflow-x-auto`
- [ ] 내부 아이템: `flex-shrink-0 whitespace-nowrap`
- [ ] 반응형 gap 값 적용 (`gap-4 sm:gap-6 lg:gap-8`)
- [ ] 반응형 폰트 크기 적용 (`text-base sm:text-lg`)
- [ ] `scrollbar-hide` 클래스로 스크롤바 숨기기 (선택사항)
- [ ] 모바일 환경에서 실제 테스트

## 추가 팁

### Scrollbar 숨기기 (globals.css)

```css
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

### 디버깅 방법

1. **개발자 도구로 너비 확인**
   ```
   - 요소 검사로 각 컨테이너의 실제 너비 확인
   - computed width가 viewport를 초과하는지 확인
   ```

2. **임시 배경색 추가**
   ```tsx
   <div className="bg-red-100"> {/* 문제 영역 확인 */}
   ```

3. **브라우저 반응형 모드**
   - Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
   - 다양한 모바일 기기 크기로 테스트

## 주의사항

1. **`w-max` 사용 주의**: 특별한 이유가 없다면 스크롤 영역에서 사용하지 마세요.
2. **고정 너비 피하기**: `w-[500px]` 같은 고정 너비는 반응형을 해칩니다.
3. **Flex 중첩 구조**: 여러 단계의 flex 구조에서는 각 단계마다 `min-w-0`이 필요할 수 있습니다.
4. **CSS Custom Properties**: `width: fit-content`나 `width: max-content`도 같은 문제를 일으킵니다.

## 관련 리소스

- [MDN - CSS Flexible Box Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
- [CSS-Tricks - Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Tailwind CSS - Responsive Design](https://tailwindcss.com/docs/responsive-design)

## 버전 이력

- 2024-01-15: 초기 작성

