# ImageModal 컴포넌트 가이드

## 개요
`ImageModal`은 이미지를 클릭하면 확대된 모달로 볼 수 있는 컴포넌트입니다. 썸네일 이미지와 확대 모달을 함께 제공하며, 갤러리 형태로도 사용할 수 있습니다.

## 주요 기능
- 🖼️ 썸네일 이미지 클릭 시 확대 모달
- 📱 반응형 디자인 (모바일/데스크톱)
- 🎨 커스터마이징 가능한 크기와 스타일
- 🖱️ 호버 효과 및 부드러운 전환
- 🔄 갤러리 모드 지원
- ♿ 접근성 지원 (키보드 네비게이션, ARIA)

## 설치 및 임포트

```tsx
import { ImageModal, ImageGallery } from "@/components/ui/image-modal"
```

## 컴포넌트 종류

### 1. ImageModal
단일 이미지를 확대하는 기본 컴포넌트

### 2. ImageGallery
여러 이미지를 갤러리 형태로 표시하는 컴포넌트

## Props

### ImageModal Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `src` | `string` | **필수** | 이미지 소스 경로 |
| `alt` | `string` | **필수** | 이미지 alt 텍스트 |
| `thumbnailWidth` | `number` | `250` | 썸네일 너비 (px) |
| `thumbnailHeight` | `number` | `250` | 썸네일 높이 (px) |
| `thumbnailClassName` | `string` | - | 썸네일 이미지 추가 CSS 클래스 |
| `modalMaxWidth` | `string` | `"max-w-[90vw] sm:max-w-[500px]"` | 확대 모달 최대 너비 |
| `modalWidth` | `number` | `500` | 확대 이미지 너비 |
| `modalHeight` | `number` | `400` | 확대 이미지 높이 |
| `containerClassName` | `string` | - | 썸네일 컨테이너 추가 CSS 클래스 |

### ImageGallery Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `images` | `string[]` | **필수** | 이미지 소스 배열 |
| `alts` | `string[]` | - | 각 이미지의 alt 텍스트 배열 |
| `thumbnailWidth` | `number` | `250` | 썸네일 너비 (px) |
| `thumbnailHeight` | `number` | `250` | 썸네일 높이 (px) |
| `containerClassName` | `string` | `"flex flex-wrap gap-3"` | 갤러리 컨테이너 CSS 클래스 |
| `thumbnailClassName` | `string` | - | 썸네일 이미지 추가 CSS 클래스 |
| `modalMaxWidth` | `string` | `"max-w-[90vw] sm:max-w-[500px]"` | 확대 모달 최대 너비 |

## 사용 예제

### 1. 기본 사용 (단일 이미지)

```tsx
import { ImageModal } from "@/components/ui/image-modal"

export default function MyPage() {
  return (
    <ImageModal
      src="/images/photo.jpg"
      alt="사진"
    />
  )
}
```

### 2. 커스텀 크기

```tsx
<ImageModal
  src="/images/photo.jpg"
  alt="사진"
  thumbnailWidth={200}
  thumbnailHeight={200}
  modalMaxWidth="max-w-[95vw] sm:max-w-[600px]"
/>
```

### 3. 이미지 갤러리

```tsx
import { ImageGallery } from "@/components/ui/image-modal"

export default function Gallery() {
  const images = [
    "/images/photo1.jpg",
    "/images/photo2.jpg",
    "/images/photo3.jpg",
  ]

  return (
    <ImageGallery
      images={images}
      alts={["사진 1", "사진 2", "사진 3"]}
    />
  )
}
```

### 4. 문의 내역에서 첨부 이미지 표시

```tsx
{inquiry.images && inquiry.images.length > 0 && (
  <div className="mt-4 space-y-2">
    <p className="text-xs font-semibold text-muted-foreground">첨부 이미지:</p>
    <ImageGallery
      images={inquiry.images}
      thumbnailWidth={250}
      thumbnailHeight={250}
    />
  </div>
)}
```

### 5. 작은 썸네일 갤러리

```tsx
<ImageGallery
  images={images}
  thumbnailWidth={150}
  thumbnailHeight={150}
  containerClassName="flex gap-2"
/>
```

### 6. 그리드 레이아웃 갤러리

```tsx
<ImageGallery
  images={images}
  containerClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  thumbnailWidth={200}
  thumbnailHeight={200}
/>
```

### 7. 커스텀 스타일링

```tsx
<ImageModal
  src="/images/photo.jpg"
  alt="사진"
  containerClassName="shadow-lg rounded-xl"
  thumbnailClassName="opacity-90 hover:opacity-100"
/>
```

## 실제 사용 사례

### 문의 상세 페이지

```tsx
"use client"

import { ImageGallery } from "@/components/ui/image-modal"

interface Inquiry {
  id: number
  title: string
  content: string
  images: string[]
}

export default function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{inquiry.title}</h2>
      <p className="text-gray-700">{inquiry.content}</p>
      
      {inquiry.images.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-600">첨부 이미지</h3>
          <ImageGallery
            images={inquiry.images}
            thumbnailWidth={250}
            thumbnailHeight={250}
          />
        </div>
      )}
    </div>
  )
}
```

### 제품 상세 페이지

```tsx
"use client"

import { ImageGallery } from "@/components/ui/image-modal"

interface Product {
  id: number
  name: string
  images: string[]
}

export default function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">제품 이미지</h2>
        <ImageGallery
          images={product.images}
          thumbnailWidth={300}
          thumbnailHeight={300}
          containerClassName="grid grid-cols-2 md:grid-cols-3 gap-4"
        />
      </div>
    </div>
  )
}
```

### 프로필 사진

```tsx
<ImageModal
  src="/images/profile.jpg"
  alt="프로필 사진"
  thumbnailWidth={100}
  thumbnailHeight={100}
  containerClassName="rounded-full overflow-hidden"
  modalMaxWidth="max-w-[80vw] sm:max-w-[400px]"
/>
```

### 블로그 포스트 이미지

```tsx
<div className="my-8">
  <ImageModal
    src="/images/blog-image.jpg"
    alt="블로그 이미지"
    thumbnailWidth={600}
    thumbnailHeight={400}
    containerClassName="w-full"
  />
</div>
```

## 스타일 커스터마이징

### 썸네일 테두리 변경

```tsx
<ImageModal
  src="/images/photo.jpg"
  alt="사진"
  containerClassName="border-2 border-blue-500 rounded-xl"
/>
```

### 썸네일 그림자 효과

```tsx
<ImageModal
  src="/images/photo.jpg"
  alt="사진"
  containerClassName="shadow-xl hover:shadow-2xl transition-shadow"
/>
```

### 갤러리 간격 조정

```tsx
<ImageGallery
  images={images}
  containerClassName="flex flex-wrap gap-6"
/>
```

### 모바일에서 다른 크기

```tsx
<div className="w-full">
  {/* 모바일 */}
  <div className="block md:hidden">
    <ImageGallery
      images={images}
      thumbnailWidth={150}
      thumbnailHeight={150}
    />
  </div>
  
  {/* 데스크톱 */}
  <div className="hidden md:block">
    <ImageGallery
      images={images}
      thumbnailWidth={250}
      thumbnailHeight={250}
    />
  </div>
</div>
```

## 반응형 디자인

### 모바일 최적화

```tsx
<ImageModal
  src="/images/photo.jpg"
  alt="사진"
  thumbnailWidth={150}
  thumbnailHeight={150}
  modalMaxWidth="max-w-[95vw] sm:max-w-[500px]"
/>
```

### 태블릿/데스크톱 최적화

```tsx
<ImageGallery
  images={images}
  containerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
  thumbnailWidth={250}
  thumbnailHeight={250}
  modalMaxWidth="max-w-[90vw] sm:max-w-[600px] lg:max-w-[800px]"
/>
```

## 접근성

- ✅ 키보드 네비게이션 지원 (ESC로 모달 닫기)
- ✅ 스크린 리더 호환 (alt 텍스트)
- ✅ ARIA 속성 적용 (aria-label)
- ✅ 포커스 관리
- ✅ 명확한 닫기 버튼

## 성능 최적화

### Next.js Image 최적화

컴포넌트는 Next.js의 `Image` 컴포넌트를 사용하여 자동으로 이미지를 최적화합니다:
- 자동 이미지 최적화
- Lazy loading
- 적절한 이미지 포맷 선택 (WebP 등)
- 반응형 이미지

### 로딩 성능

```tsx
// 이미지가 많은 경우 페이지네이션 고려
const displayedImages = images.slice(0, 12)

<ImageGallery images={displayedImages} />
```

## 주의사항

### 1. 이미지 경로
이미지 경로가 올바른지 확인하세요:

```tsx
// 잘못된 경로 ❌
<ImageModal src="photo.jpg" alt="사진" />

// 올바른 경로 ✅
<ImageModal src="/images/photo.jpg" alt="사진" />
```

### 2. alt 텍스트
접근성을 위해 항상 의미 있는 alt 텍스트를 제공하세요:

```tsx
// 나쁜 예 ❌
<ImageModal src="/photo.jpg" alt="이미지" />

// 좋은 예 ✅
<ImageModal src="/photo.jpg" alt="제품 상세 사진" />
```

### 3. 이미지 크기
큰 이미지는 로딩 시간이 길어질 수 있으므로 적절한 크기로 최적화하세요:

```tsx
// 권장 크기
- 썸네일: 250x250 ~ 300x300
- 확대 이미지: 500x400 ~ 800x600
```

### 4. 갤러리 이미지 개수
너무 많은 이미지는 페이지 성능에 영향을 줄 수 있습니다:

```tsx
// 한 번에 표시할 이미지 수 제한
const MAX_IMAGES = 20
const displayImages = images.slice(0, MAX_IMAGES)
```

## 문제 해결

### Q: 이미지가 표시되지 않아요
A: 이미지 경로를 확인하고, `public` 폴더에 이미지가 있는지 확인하세요.

### Q: 모달이 열리지 않아요
A: `"use client"` 지시어가 파일 상단에 있는지 확인하세요.

### Q: 썸네일 크기가 맞지 않아요
A: `thumbnailWidth`와 `thumbnailHeight` props를 조정하세요.

### Q: 모바일에서 이미지가 너무 커요
A: `modalMaxWidth` prop을 조정하세요:
```tsx
modalMaxWidth="max-w-[85vw] sm:max-w-[500px]"
```

### Q: 갤러리 레이아웃이 깨져요
A: `containerClassName`을 사용하여 적절한 레이아웃을 설정하세요:
```tsx
containerClassName="grid grid-cols-2 md:grid-cols-3 gap-4"
```

## 고급 사용법

### 동적 이미지 로딩

```tsx
"use client"

import { useState, useEffect } from "react"
import { ImageGallery } from "@/components/ui/image-modal"

export default function DynamicGallery() {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    // API에서 이미지 로드
    fetch('/api/images')
      .then(res => res.json())
      .then(data => setImages(data.images))
  }, [])

  return <ImageGallery images={images} />
}
```

### 이미지 필터링

```tsx
const [filter, setFilter] = useState("all")
const filteredImages = images.filter(img => 
  filter === "all" || img.includes(filter)
)

<ImageGallery images={filteredImages} />
```

### 무한 스크롤 갤러리

```tsx
"use client"

import { useState } from "react"
import { ImageGallery } from "@/components/ui/image-modal"
import { Button } from "@/components/ui/button"

export default function InfiniteGallery({ allImages }: { allImages: string[] }) {
  const [displayCount, setDisplayCount] = useState(12)
  const displayedImages = allImages.slice(0, displayCount)

  return (
    <div className="space-y-4">
      <ImageGallery images={displayedImages} />
      
      {displayCount < allImages.length && (
        <div className="text-center">
          <Button onClick={() => setDisplayCount(prev => prev + 12)}>
            더 보기
          </Button>
        </div>
      )}
    </div>
  )
}
```

## 관련 컴포넌트

- `Dialog`: 모달 기본 컴포넌트
- `Image`: Next.js 이미지 컴포넌트
- `Button`: 버튼 컴포넌트

## 버전 히스토리

- **v1.0.0** (2025-10-19): 초기 버전 출시
  - ImageModal 컴포넌트
  - ImageGallery 컴포넌트
  - 반응형 디자인
  - 커스터마이징 옵션

## 라이선스

이 컴포넌트는 프로젝트 내부에서 자유롭게 사용 및 수정할 수 있습니다.

