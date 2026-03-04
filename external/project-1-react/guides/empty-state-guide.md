# 빈 상태(Empty State) 가이드

## 개요
- 데이터가 없을 때 사용자에게 현재 상태와 다음 행동을 명확히 알려주는 통일된 UI 패턴입니다.
- 구성 요소는 `아이콘`, `타이틀`, `서브 문구` 세 영역으로 나뉘며, 전체 컨테이너는 카드 형태로 사용합니다.

## 기본 레이아웃
- 부모 컨테이너: `flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-gray-200 bg-white p-12`
  - `space-y-4`: 요소 간 간격
  - `border-dashed`: 빈 상태임을 강조
  - `p-12`: 충분한 여백으로 시각적 안정감 제공

## 아이콘 영역
- 래퍼: `div.relative.h-16.w-16`
- 이미지 컴포넌트:
  ```tsx
  <Image src="/icons/icon-default.png" alt="데이터 없음" fill className="object-contain" />
  ```
- 교체 규칙:
  - 아이콘은 64 × 64 기준
  - 상황에 맞는 아이콘을 `/icons` 하위에 추가한 후 `src`만 변경
  - 배경 또는 여백이 필요하면 `className`으로 확장

## 타이틀 영역
- 태그: `h3`
- 기본 스타일: `text-lg font-semibold text-gray-900`
- 작성 원칙:
  - 14자 내외의 간결한 문장을 사용
  - 상황을 명확히 표현(예: `이용내역이 없습니다`, `저장된 항목이 없습니다`)

## 서브 문구 영역
- 태그: `p`
- 기본 스타일: `text-sm text-muted-foreground`
- 작성 원칙:
  - 타이틀을 보완하는 안내 문장
  - 24자 내외, 필요한 경우 CTA나 다음 행동 링크를 추가
  - 문장 끝은 마침표로 마무리

## 변형 가이드
- 버튼이 필요한 경우 서브 문구 아래에 `Button` 을 배치하고 `space-y-2` 값을 조정
- 배경색이 필요한 경우 `bg-[#f8fafc]` 등 프로젝트에서 사용하는 중성 색상 활용
- 아이콘이 없거나 대체 요소가 필요하면 컨테이너는 유지하고 `div` 영역만 교체

## 예시 코드
```tsx
<div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-gray-200 bg-white p-12">
  <div className="relative h-16 w-16">
    <Image src="/icons/icon-default.png" alt="데이터 없음" fill className="object-contain" />
  </div>
  <div className="space-y-2 text-center">
    <h3 className="text-lg font-semibold text-gray-900">이용내역이 없습니다</h3>
    <p className="text-sm text-muted-foreground">아직 이용내역이 없습니다.</p>
  </div>
</div>
```
# EmptyState 컴포넌트 가이드

## 개요
`EmptyState`는 데이터가 없을 때 표시되는 빈 화면 UI 컴포넌트입니다. 테이블, 리스트 등 다양한 곳에서 일관된 빈 상태를 표시할 수 있습니다.

## 주요 기능
- 🖼️ 커스터마이징 가능한 이미지
- 📝 제목 및 설명 텍스트
- 🎨 유연한 스타일링
- 📱 반응형 디자인
- ♿ 접근성 지원

## 설치 및 임포트

```tsx
import { EmptyState } from "@/components/ui/empty-state"
```

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `imageSrc` | `string` | `"/icons/icon-default.png"` | 표시할 이미지 경로 |
| `imageSize` | `number` | `80` | 이미지 크기 (width, height 동일) |
| `title` | `string` | **필수** | 메인 제목 텍스트 |
| `description` | `string` | - | 설명 텍스트 (선택사항) |
| `height` | `string` | `"h-[400px]"` | 컨테이너 높이 |
| `className` | `string` | - | 추가 CSS 클래스 |
| `titleSize` | `"sm" \| "base" \| "lg" \| "xl"` | `"lg"` | 제목 폰트 크기 |
| `descriptionAlign` | `"left" \| "center" \| "right"` | `"left"` | 설명 텍스트 정렬 |

## 사용 예제

### 1. 기본 사용 (테이블 내부)

```tsx
import { EmptyState } from "@/components/ui/empty-state"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"

function MyTable() {
  const data = []

  return (
    <Table>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5}>
              <EmptyState
                title="데이터가 없습니다"
                description="표시할 데이터가 없습니다."
              />
            </TableCell>
          </TableRow>
        ) : (
          // 데이터 렌더링
        )}
      </TableBody>
    </Table>
  )
}
```

### 2. 문의 내역 빈 화면

```tsx
<EmptyState
  title="문의 내역이 없습니다"
  description="궁금하신 사항이 있으시면 문의를 남겨주세요."
/>
```

### 3. 커스텀 이미지 사용

```tsx
<EmptyState
  imageSrc="/icons/custom-empty.png"
  imageSize={100}
  title="검색 결과가 없습니다"
  description="다른 키워드로 검색해보세요."
/>
```

### 4. 제목 크기 변경

```tsx
<EmptyState
  title="알림이 없습니다"
  titleSize="xl"
  description="새로운 알림이 도착하면 여기에 표시됩니다."
/>
```

### 5. 설명 텍스트 중앙 정렬

```tsx
<EmptyState
  title="장바구니가 비어있습니다"
  description="상품을 추가해주세요."
  descriptionAlign="center"
/>
```

### 6. 높이 조정

```tsx
<EmptyState
  title="데이터 없음"
  description="아직 데이터가 없습니다."
  height="h-[300px]"
/>
```

### 7. 추가 스타일링

```tsx
<EmptyState
  title="팀원이 없습니다"
  description="팀원을 초대해보세요."
  className="bg-gray-50 rounded-lg"
/>
```

## 실제 사용 사례

### 계정 목록 테이블

```tsx
"use client"

import { EmptyState } from "@/components/ui/empty-state"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AccountList() {
  const accounts = []

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>권한</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {accounts.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3}>
              <EmptyState
                title="계정이 없습니다"
                description="새로운 계정을 추가해주세요."
              />
            </TableCell>
          </TableRow>
        ) : (
          accounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell>{account.name}</TableCell>
              <TableCell>{account.email}</TableCell>
              <TableCell>{account.role}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
```

### 모바일 카드 리스트

```tsx
"use client"

import { EmptyState } from "@/components/ui/empty-state"
import { Card, CardContent } from "@/components/ui/card"

export default function MobileList() {
  const items = []

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <EmptyState
          title="항목이 없습니다"
          description="새로운 항목을 추가해주세요."
          descriptionAlign="center"
        />
      ) : (
        items.map((item) => (
          <Card key={item.id}>
            <CardContent>{item.content}</CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
```

### 검색 결과 없음

```tsx
<EmptyState
  imageSrc="/icons/icon-search.png"
  title="검색 결과가 없습니다"
  description="다른 검색어로 시도해보세요."
  titleSize="xl"
  descriptionAlign="center"
/>
```

### 알림 목록

```tsx
<EmptyState
  imageSrc="/icons/icon-notification.png"
  imageSize={64}
  title="새로운 알림이 없습니다"
  description="알림이 도착하면 여기에 표시됩니다."
  height="h-[300px]"
/>
```

## 스타일 커스터마이징

### 배경색 추가

```tsx
<EmptyState
  title="데이터 없음"
  className="bg-blue-50 rounded-xl p-8"
/>
```

### 테두리 추가

```tsx
<EmptyState
  title="내역 없음"
  className="border-2 border-dashed border-gray-300 rounded-lg"
/>
```

### 그림자 효과

```tsx
<EmptyState
  title="파일 없음"
  className="shadow-lg rounded-2xl bg-white"
/>
```

## 반응형 디자인

### 모바일/데스크톱 다른 높이

```tsx
<EmptyState
  title="데이터 없음"
  height="h-[300px] md:h-[400px] lg:h-[500px]"
/>
```

### 모바일에서 이미지 크기 조정

```tsx
<div className="w-full">
  <div className="block md:hidden">
    <EmptyState
      title="데이터 없음"
      imageSize={60}
    />
  </div>
  <div className="hidden md:block">
    <EmptyState
      title="데이터 없음"
      imageSize={80}
    />
  </div>
</div>
```

## 접근성

- ✅ 이미지에 자동으로 `alt` 속성 설정 (title 사용)
- ✅ 시맨틱 HTML 구조
- ✅ 명확한 텍스트 계층 구조
- ✅ 적절한 색상 대비

## 디자인 가이드라인

### 이미지 선택
- **기본**: 일반적인 빈 상태 (`icon-default.png`)
- **검색**: 검색 관련 빈 상태 (`icon-search.png`)
- **알림**: 알림 관련 빈 상태 (`icon-notification.png`)
- **파일**: 파일 관련 빈 상태 (`icon-file.png`)

### 텍스트 작성 팁
1. **제목**: 명확하고 간결하게 (예: "데이터가 없습니다")
2. **설명**: 사용자에게 다음 행동 제안 (예: "새로운 항목을 추가해주세요")
3. **톤**: 친근하고 도움이 되는 톤 유지

### 높이 설정
- **테이블**: `h-[400px]` (기본)
- **카드 리스트**: `h-[300px]`
- **사이드바**: `h-[200px]`
- **전체 페이지**: `h-screen`

## 주의사항

### 1. colSpan 설정
테이블에서 사용할 때는 반드시 `colSpan`을 설정하세요:

```tsx
<TableCell colSpan={5}>  {/* 컬럼 수에 맞게 */}
  <EmptyState title="데이터 없음" />
</TableCell>
```

### 2. 높이 설정
부모 컨테이너의 높이를 고려하여 적절한 높이를 설정하세요:

```tsx
// 너무 낮음 ❌
<EmptyState title="데이터 없음" height="h-[100px]" />

// 적절함 ✅
<EmptyState title="데이터 없음" height="h-[400px]" />
```

### 3. 이미지 경로
이미지 경로가 올바른지 확인하세요:

```tsx
// 잘못된 경로 ❌
<EmptyState imageSrc="icon-default.png" />

// 올바른 경로 ✅
<EmptyState imageSrc="/icons/icon-default.png" />
```

## 문제 해결

### Q: 이미지가 표시되지 않아요
A: 이미지 경로를 확인하고, `public` 폴더에 이미지가 있는지 확인하세요.

### Q: 텍스트가 잘려요
A: `className`에 `px-4` 등의 패딩을 추가하거나 컨테이너 너비를 조정하세요.

### Q: 높이가 맞지 않아요
A: `height` prop을 조정하거나 부모 컨테이너의 높이를 확인하세요.

### Q: 모바일에서 레이아웃이 깨져요
A: `descriptionAlign="center"`를 사용하거나 반응형 클래스를 추가하세요.

## 관련 컴포넌트

- `Table`: 테이블 컴포넌트
- `Card`: 카드 컴포넌트
- `DataTable`: 데이터 테이블 컴포넌트

## 버전 히스토리

- **v1.0.0** (2025-10-19): 초기 버전 출시
  - 기본 빈 상태 UI
  - 커스터마이징 가능한 이미지, 텍스트
  - 반응형 디자인

## 라이선스

이 컴포넌트는 프로젝트 내부에서 자유롭게 사용 및 수정할 수 있습니다.

