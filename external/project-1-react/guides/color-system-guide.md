# AGOFFICE 컬러 시스템 가이드

## 📊 개요

AGOFFICE 프로젝트에서 사용하는 차분하고 고급스러운 컬러 시스템 가이드입니다. 명도를 낮추고 채도를 중간 정도로 조정하여 선명하면서도 과하지 않은 세련된 디자인을 구현합니다.

## 🎨 컬러 팔레트

### 1. **Primary Colors (주요 색상)**

#### 파란 계열
- **Primary Blue**: `#3d66d9` - 총 포스팅 등 주요 지표
- **Chart Blue**: `#3b82f6` - 차트 월 검색량 등
- **Secondary Blue**: `#3b76e1` - 월 발행량 등 보조 지표

#### 오렌지 계열
- **Primary Orange**: `#f15532` - 재작업, 경고 상태 등
- **Secondary Orange**: `#f7811b` - 보통 상태 등

#### 그린 계열
- **Primary Green**: `#059669` - 5위 안 확률, 성공 상태 등
- **Chart Green**: `#51ab23` - 차트 월 발행량 등

#### 퍼플 계열
- **Primary Purple**: `#8946e1` - 월 검색량 등 특별 지표

#### 레드 계열
- **Primary Red**: `#f53b3b` - 블로그 포화도, 순위, 위험 상태 등

### 2. **Color Usage Guidelines**

#### 통계 카드에서의 사용
```tsx
// 총 포스팅
<div style={{color: '#3d66d9'}}>{totalPostings}건</div>

// 재작업
<div style={{color: '#f15532'}}>{reworkCount}건</div>

// 5위 안 확률
<div style={{color: '#059669'}}>{top5Rate}%</div>

// 월 검색량
<div style={{color: '#8946e1'}}>{searchVolume}</div>

// 월 발행량
<div style={{color: '#3b76e1'}}>{postVolume}</div>

// 블로그 포화도
<div style={{color: '#f53b3b'}}>{saturation}%</div>
```

#### 아이콘에서의 사용
```tsx
// 성공 아이콘
<CheckCircle style={{color: '#059669'}} />

// 좋음 아이콘
<Award style={{color: '#3d66d9'}} />

// 보통 아이콘
<Minus style={{color: '#f7811b'}} />

// 경고 아이콘
<AlertTriangle style={{color: '#f15532'}} />

// 위험 아이콘
<XCircle style={{color: '#f53b3b'}} />
```

#### 차트에서의 사용
```tsx
// 차트 데이터셋
datasets: [
  {
    label: '월 검색량',
    backgroundColor: '#3d66d9',
    borderColor: '#3d66d9',
  },
  {
    label: '월 발행량', 
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  {
    label: '순위',
    borderColor: '#f53b3b',
    pointBorderColor: '#f53b3b',
  }
]
```

## 🎯 상태별 색상 매핑

### 성과 지표
- **우수/성공**: `#059669` (그린)
- **보통/주의**: `#f7811b` (오렌지)
- **위험/실패**: `#f53b3b` (레드)

### 데이터 유형
- **주요 지표**: `#3d66d9` (파란)
- **보조 지표**: `#3b76e1` (세컨더리 블루)
- **특별 지표**: `#8946e1` (퍼플)

### 액션/상태
- **경고/재작업**: `#f15532` (오렌지)
- **위험/포화도**: `#f53b3b` (레드)

## 🏷️ Badge 색상 시스템

### 배지 배경색
```tsx
// 성공 배지
className="bg-green-50 text-green-700 border border-green-200"

// 정보 배지  
className="bg-blue-50 text-blue-700 border border-blue-200"

// 경고 배지
className="bg-orange-50 text-orange-700 border border-orange-200"

// 위험 배지
className="bg-red-50 text-red-700 border border-red-200"
```

### 배지 투명 버전
```tsx
// 투명 배지 (테두리만)
className="bg-transparent text-green-700 border border-green-300"
className="bg-transparent text-blue-700 border border-blue-300"
className="bg-transparent text-orange-700 border border-orange-300"
className="bg-transparent text-red-700 border border-red-300"
```

## 📊 차트 범례 색상

### 범례 인디케이터
```tsx
// 월 검색량
<div style={{backgroundColor: '#3d66d9', opacity: 0.8}}></div>

// 월 발행량
<div style={{backgroundColor: '#059669', opacity: 0.8}}></div>

// 순위
<div style={{backgroundColor: '#f53b3b', opacity: 0.8}}></div>
```

## 🎨 Tailwind CSS 확장

### 커스텀 색상 클래스 정의
```css
:root {
  --ag-primary-blue: #3d66d9;
  --ag-secondary-blue: #3b76e1;
  --ag-primary-orange: #f15532;
  --ag-secondary-orange: #f7811b;
  --ag-primary-green: #059669;
  --ag-primary-purple: #8946e1;
  --ag-primary-red: #f53b3b;
}
```

### Tailwind 설정 확장
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'ag-primary-blue': '#3d66d9',
        'ag-secondary-blue': '#3b76e1',
        'ag-primary-orange': '#f15532',
        'ag-secondary-orange': '#f7811b',
        'ag-primary-green': '#059669',
        'ag-primary-purple': '#8946e1',
        'ag-primary-red': '#f53b3b',
      }
    }
  }
}
```

## 💡 사용 예시

### 통계 카드 컴포넌트
```tsx
interface StatCardProps {
  title: string
  value: string | number
  color: 'blue' | 'orange' | 'green' | 'purple' | 'red'
}

const StatCard = ({ title, value, color }: StatCardProps) => {
  const colorMap = {
    blue: '#3d66d9',
    orange: '#f15532', 
    green: '#059669',
    purple: '#8946e1',
    red: '#f53b3b'
  }

  return (
    <Card className="border border-gray-200 shadow-none">
      <CardContent className="p-4">
        <div className="text-center">
          <div 
            className="text-2xl font-bold"
            style={{color: colorMap[color]}}
          >
            {value}
          </div>
          <div className="text-sm text-gray-600 mt-1">{title}</div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### 상태 배지 컴포넌트
```tsx
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'danger' | 'info'
  children: React.ReactNode
}

const StatusBadge = ({ status, children }: StatusBadgeProps) => {
  const statusClasses = {
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-orange-50 text-orange-700 border border-orange-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200'
  }

  return (
    <Badge className={`text-xs ${statusClasses[status]}`}>
      {children}
    </Badge>
  )
}
```

## ⚠️ 주의사항

1. **일관성 유지**: 모든 컴포넌트에서 동일한 색상 매핑 사용
2. **접근성 고려**: 색상만으로 정보를 전달하지 말고 텍스트나 아이콘과 함께 사용
3. **대비 확인**: 배경색과 텍스트 색상의 충분한 대비 확보
4. **브랜드 일관성**: AGOFFICE 브랜드 아이덴티티와 일치하는 색상 사용

## 🔄 업데이트 히스토리

- **v1.0** (2024-12-19): 초기 컬러 시스템 정의
- 키워드 상세정보 모달에서 적용된 차분하고 고급스러운 톤 기반

---

**작성일**: 2024-12-19  
**적용 프로젝트**: AGOFFICE  
**버전**: 1.0
