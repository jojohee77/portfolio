# 모바일 필드 텍스트 가이드라인

## 📱 개요

모바일 환경(640px 이하)에서 폼 필드의 텍스트 크기를 최적화하여 가독성과 공간 활용을 개선합니다.

---

## 🎯 기본 원칙

### 브레이크포인트
- **모바일**: 640px 이하 (`< sm`)
- **데스크톱**: 640px 이상 (`≥ sm`)

### 폰트 크기 규칙

| 요소 | 모바일 | 데스크톱 | 클래스 |
|------|--------|----------|--------|
| **라벨 (Label)** | 14px | 현재 크기 유지 | `text-sm` |
| **필드 내용** | 12px | 현재 크기 유지 | `text-xs sm:text-sm` 또는 `text-xs sm:text-base` |

---

## 📝 적용 방법

### 1. Label (라벨)

```tsx
// ✅ 모든 환경에서 14px 고정
<Label htmlFor="field" className="text-sm">
  계약번호
</Label>
```

### 2. Input 필드

```tsx
// ✅ 모바일 12px, 데스크톱 14px
<Input
  id="field"
  className="text-xs sm:text-sm"
  placeholder="입력하세요"
/>

// ✅ 읽기 전용 필드 (회색 배경)
<Input
  readOnly
  className="bg-gray-100 border-gray-300 text-xs sm:text-sm"
  value={data}
/>
```

### 3. Select 박스

```tsx
// ✅ SelectTrigger에 폰트 크기 적용
<Select value={value} onValueChange={onChange}>
  <SelectTrigger className="text-xs sm:text-sm">
    <SelectValue placeholder="선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">옵션1</SelectItem>
    <SelectItem value="option2">옵션2</SelectItem>
  </SelectContent>
</Select>
```

### 4. Textarea

```tsx
// ✅ 모바일 12px, 데스크톱 14px
<Textarea
  className="text-xs sm:text-sm"
  placeholder="내용을 입력하세요"
  rows={3}
/>
```

### 5. 읽기 전용 필드 (div)

```tsx
// ✅ 상세보기 모드의 필드
<div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 h-9 flex items-center text-xs sm:text-sm text-gray-600">
  {data}
</div>

// ✅ 여러 줄 텍스트
<div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 min-h-[72px] flex items-start text-xs sm:text-sm text-gray-600 leading-relaxed">
  {description}
</div>
```

---

## 🎨 실제 예시

### 폼 필드 그룹

```tsx
<div className="space-y-3">
  {/* 계약번호 */}
  <div className="flex flex-col gap-0 md:flex-row md:items-start md:gap-4">
    <Label htmlFor="contractNumber" className="md:w-32 md:pt-2 shrink-0 text-sm">
      계약번호
    </Label>
    <div className="flex-1">
      <Select value={contractNumber} onValueChange={setContractNumber}>
        <SelectTrigger className="h-9 w-full bg-white text-xs sm:text-sm">
          <SelectValue placeholder="계약번호 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CT-2024-001">CT-2024-001</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>

  {/* 담당자 */}
  <div className="flex flex-col gap-0 md:flex-row md:items-center md:gap-4">
    <Label htmlFor="assignee" className="md:w-32 shrink-0 text-sm">
      담당자
    </Label>
    <div className="flex-1">
      <Input
        id="assignee"
        className="h-9 text-xs sm:text-sm"
        placeholder="담당자명을 입력하세요"
      />
    </div>
  </div>

  {/* 비고 */}
  <div className="flex flex-col gap-0 md:flex-row md:items-start md:gap-4">
    <Label htmlFor="notes" className="md:w-32 md:pt-2 shrink-0 text-sm">
      비고
    </Label>
    <div className="flex-1">
      <Textarea
        id="notes"
        className="text-xs sm:text-sm"
        placeholder="추가 메모를 입력하세요"
        rows={3}
      />
    </div>
  </div>
</div>
```

---

## 📊 시각적 비교

### 모바일 (< 640px)
```
계약번호 [14px]
┌─────────────────────────┐
│ CT-2024-001 [12px]      │
└─────────────────────────┘

담당자 [14px]
┌─────────────────────────┐
│ 김철수 [12px]           │
└─────────────────────────┘
```

### 데스크톱 (≥ 640px)
```
계약번호 [14px]
┌─────────────────────────┐
│ CT-2024-001 [14px]      │
└─────────────────────────┘

담당자 [14px]
┌─────────────────────────┐
│ 김철수 [14px]           │
└─────────────────────────┘
```

---

## ✅ 체크리스트

새로운 폼을 만들 때 다음 사항을 확인하세요:

- [ ] 모든 Label에 `text-sm` 적용
- [ ] 모든 Input에 `text-xs sm:text-sm` 적용
- [ ] 모든 SelectTrigger에 `text-xs sm:text-sm` 적용
- [ ] 모든 Textarea에 `text-xs sm:text-sm` 적용
- [ ] 읽기 전용 필드(div)에 `text-xs sm:text-sm` 적용
- [ ] 모바일 환경(640px 이하)에서 테스트 완료

---

## 🚫 주의사항

### ❌ 잘못된 예시

```tsx
// ❌ 라벨에 반응형 폰트 적용
<Label className="text-xs sm:text-sm">계약번호</Label>

// ❌ 필드에 고정 폰트만 적용
<Input className="text-sm" />

// ❌ SelectTrigger에 폰트 크기 누락
<SelectTrigger className="h-9 w-full">
  <SelectValue placeholder="선택" />
</SelectTrigger>
```

### ✅ 올바른 예시

```tsx
// ✅ 라벨은 고정 14px
<Label className="text-sm">계약번호</Label>

// ✅ 필드는 반응형
<Input className="text-xs sm:text-sm" />

// ✅ SelectTrigger에 폰트 크기 적용
<SelectTrigger className="h-9 w-full text-xs sm:text-sm">
  <SelectValue placeholder="선택" />
</SelectTrigger>
```

---

## 🔄 기존 코드 마이그레이션

### Before (기존)
```tsx
<Label className="text-base">계약번호</Label>
<Input className="text-sm" />
<SelectTrigger className="h-9">
  <SelectValue />
</SelectTrigger>
```

### After (적용 후)
```tsx
<Label className="text-sm">계약번호</Label>
<Input className="text-xs sm:text-sm" />
<SelectTrigger className="h-9 text-xs sm:text-sm">
  <SelectValue />
</SelectTrigger>
```

---

## 📚 참고

- Tailwind CSS 폰트 크기: https://tailwindcss.com/docs/font-size
- Tailwind CSS 브레이크포인트: https://tailwindcss.com/docs/responsive-design
- `text-xs`: 12px (0.75rem)
- `text-sm`: 14px (0.875rem)
- `text-base`: 16px (1rem)
- `sm` 브레이크포인트: 640px

---

## 💡 팁

1. **일관성 유지**: 모든 폼 필드에 동일한 패턴 적용
2. **테스트**: 모바일 환경에서 실제로 확인
3. **접근성**: 12px도 충분히 읽기 쉬운 크기이지만, 너무 작은 텍스트는 피하기
4. **컴포넌트화**: 공통 Input/Select 컴포넌트를 만들어 자동으로 적용되게 하기

---

**작성일**: 2024-10-21  
**버전**: 1.0  
**적용 프로젝트**: AGOFFICE

