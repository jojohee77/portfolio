# Custom DatePicker 가이드

## 개요
CustomDatePicker는 단일 날짜 선택과 날짜 범위 선택을 지원하는 커스텀 달력 컴포넌트입니다.

## 주요 기능
- ✅ 단일 날짜 선택
- ✅ 날짜 범위 선택 (시작일 ~ 종료일)
- ✅ 이전/다음 달 네비게이션
- ✅ 날짜 비활성화 (minDate, maxDate)
- ✅ 커스텀 스타일링
- ✅ 반응형 디자인

## 사용법

### 기본 사용법

```tsx
import CustomDatePicker from '@/components/ui/custom-datepicker'

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <CustomDatePicker
      selected={selectedDate}
      onChange={setSelectedDate}
      placeholder="날짜를 선택하세요"
    />
  )
}
```

### 날짜 범위 선택

```tsx
import CustomDatePicker from '@/components/ui/custom-datepicker'

function MyComponent() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleRangeChange = (start: Date | null, end: Date | null) => {
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <CustomDatePicker
      selectRange={true}
      rangeStart={startDate}
      rangeEnd={endDate}
      onRangeChange={handleRangeChange}
      placeholder="시작일 - 종료일 선택"
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selected` | `Date \| null` | `undefined` | 선택된 날짜 (단일 선택 모드) |
| `onChange` | `(date: Date \| null) => void` | `undefined` | 날짜 변경 핸들러 (단일 선택) |
| `onRangeChange` | `(start: Date \| null, end: Date \| null) => void` | `undefined` | 범위 변경 핸들러 |
| `placeholder` | `string` | `"날짜를 선택하세요"` | 플레이스홀더 텍스트 |
| `className` | `string` | `undefined` | 추가 CSS 클래스 |
| `minDate` | `Date` | `undefined` | 선택 가능한 최소 날짜 |
| `maxDate` | `Date` | `undefined` | 선택 가능한 최대 날짜 |
| `disabled` | `boolean` | `false` | 비활성화 상태 |
| `rangeStart` | `Date \| null` | `undefined` | 범위 시작일 |
| `rangeEnd` | `Date \| null` | `undefined` | 범위 종료일 |
| `selectRange` | `boolean` | `false` | 범위 선택 모드 활성화 |
| `size` | `'default' \| 'small' \| 'compact'` | `'default'` | 달력 크기 (입력 필드 및 드롭다운) |
| `position` | `'top' \| 'bottom'` | `'bottom'` | 달력 드롭다운 위치 |

## 고급 사용법

### 작은 크기 달력 (검색폼용)

```tsx
<CustomDatePicker
  selectRange={true}
  rangeStart={startDate}
  rangeEnd={endDate}
  onRangeChange={handleRangeChange}
  placeholder="시작일 - 종료일 선택"
  size="small"
/>
```

### 컴팩트 크기 달력 (모달/좁은 공간용)

```tsx
<CustomDatePicker
  selected={selectedDate}
  onChange={setSelectedDate}
  placeholder="포스팅 일자를 선택하세요"
  size="compact"
/>
```

**크기 비교:**
- `size="default"`: 입력 필드 높이 36px (h-9), 달력 너비 280px
  - 날짜 버튼: 28px × 28px (데스크톱), 폰트: 13px
  - 일반적인 용도에 적합
  
- `size="small"`: 입력 필드 높이 32px (h-8), 달력 너비 280px
  - 날짜 버튼: 24px × 24px, 폰트: 10-11px
  - 검색 필터, 테이블 내 날짜 선택에 적합
  
- `size="compact"`: 입력 필드 높이 36px (h-9), 달력 너비 270px
  - 날짜 버튼: 24px × 24px, 폰트: 12px
  - 모달, 좁은 영역, 모바일 최적화
  - 오늘 날짜 표시 점: 4px (더 명확함)
  - 완전한 원형 날짜 선택 버튼
  - 커서 호버 시 포인터 표시

### 날짜 제한 설정

```tsx
const today = new Date()
const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())

<CustomDatePicker
  selected={selectedDate}
  onChange={setSelectedDate}
  minDate={today}
  maxDate={maxDate}
  placeholder="오늘부터 1년 후까지 선택 가능"
/>
```

### 커스텀 스타일링

```tsx
<CustomDatePicker
  selected={selectedDate}
  onChange={setSelectedDate}
  className="w-full border-2 border-blue-500"
  placeholder="커스텀 스타일 적용"
/>
```

### 비활성화 상태

```tsx
<CustomDatePicker
  selected={selectedDate}
  onChange={setSelectedDate}
  disabled={true}
  placeholder="비활성화된 달력"
/>
```

## 스타일링 가이드

### 기본 스타일
- 달력 컨테이너: `320px` 고정 너비
- 날짜 버튼: `40px × 40px` 정사각형
- 선택된 날짜: 원형 배경 (primary 컬러)
- 범위 선택: 연한 파란색 배경으로 연결

### 커스터마이징
```tsx
// 달력 너비 조정
<div style={{ width: '400px' }}>
  <CustomDatePicker ... />
</div>

// 추가 스타일 적용
<CustomDatePicker
  className="shadow-lg border-2"
  ...
/>
```

## 이벤트 처리

### 날짜 선택 이벤트

```tsx
const handleDateChange = (date: Date | null) => {
  if (date) {
    console.log('선택된 날짜:', date.toLocaleDateString('ko-KR'))
  } else {
    console.log('날짜 선택 해제')
  }
}
```

### 범위 선택 이벤트

```tsx
const handleRangeChange = (start: Date | null, end: Date | null) => {
  if (start && end) {
    console.log('선택된 범위:', {
      시작일: start.toLocaleDateString('ko-KR'),
      종료일: end.toLocaleDateString('ko-KR')
    })
  }
}
```

## 접근성

- 키보드 네비게이션 지원
- 스크린 리더 호환
- 포커스 관리
- ARIA 속성 자동 적용

## 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 주의사항

1. **날짜 형식**: 모든 날짜는 `Date` 객체로 처리됩니다.
2. **시간대**: 로컬 시간대를 사용합니다.
3. **성능**: 대량의 날짜 데이터 처리 시 가상화를 고려하세요.
4. **모바일**: 터치 디바이스에서 최적화되어 있습니다.

## 예제 모음

### 폼에서 사용

```tsx
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthDate: null as Date | null,
    eventDate: null as Date | null
  })

  return (
    <form>
      <div>
        <label>생년월일</label>
        <CustomDatePicker
          selected={formData.birthDate}
          onChange={(date) => setFormData(prev => ({ ...prev, birthDate: date }))}
          maxDate={new Date()}
          placeholder="생년월일을 선택하세요"
        />
      </div>
      
      <div>
        <label>이벤트 기간</label>
        <CustomDatePicker
          selectRange={true}
          rangeStart={formData.eventDate}
          onRangeChange={(start, end) => setFormData(prev => ({ 
            ...prev, 
            eventDate: start,
            eventEndDate: end 
          }))}
          placeholder="이벤트 기간을 선택하세요"
        />
      </div>
    </form>
  )
}
```

### 조건부 렌더링

```tsx
function ConditionalDatePicker() {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <div>
      <button onClick={() => setShowDatePicker(!showDatePicker)}>
        날짜 선택기 {showDatePicker ? '숨기기' : '보이기'}
      </button>
      
      {showDatePicker && (
        <CustomDatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          placeholder="날짜를 선택하세요"
        />
      )}
    </div>
  )
}
```

## 문제 해결

### 자주 발생하는 문제

1. **날짜가 선택되지 않음**
   - `onChange` 또는 `onRangeChange` 핸들러가 올바르게 설정되었는지 확인
   - `disabled` prop이 `true`로 설정되지 않았는지 확인

2. **스타일이 적용되지 않음**
   - `className` prop이 올바르게 전달되었는지 확인
   - CSS 우선순위 문제일 수 있음

3. **범위 선택이 작동하지 않음**
   - `selectRange={true}` 설정 확인
   - `onRangeChange` 핸들러 구현 확인

### 디버깅 팁

```tsx
// 날짜 변경 로깅
const handleDateChange = (date: Date | null) => {
  console.log('Date changed:', date)
  setSelectedDate(date)
}

// 범위 변경 로깅
const handleRangeChange = (start: Date | null, end: Date | null) => {
  console.log('Range changed:', { start, end })
  setStartDate(start)
  setEndDate(end)
}
```

## 업데이트 히스토리

- **v1.0.0**: 초기 버전
- **v1.1.0**: 범위 선택 기능 추가
- **v1.2.0**: 접근성 개선
- **v1.3.0**: 모바일 최적화
- **v1.4.0**: 커스텀 스타일링 지원

## 라이선스

MIT License
