# Ag Office Tour Modal Guide

조직/대시보드 등에서 재사용할 수 있는 투어(튜토리얼) 모달 컴포넌트 사용법입니다.  
컴포넌트 위치: `components/tutorials/tour-modal.tsx`

## 주요 특징
- 단계별 이미지와 설명을 전달하는 온보딩 모달
- 슬라이드별 CTA 버튼, 이미지 비율(카드/와이드) 제어
- 첫 단계·중간 단계·마지막 단계에 따라 기본 버튼 레이블 자동 변경
- 트리거 버튼을 외부에서 주입해 원하는 위치에서 호출 가능

## 컴포넌트 인터페이스
```ts
type ImageVariant = 'card' | 'wide'

interface TourSlide {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  imageVariant?: ImageVariant    // 기본값 'wide'
  imageWidth?: number            // wide 모드일 때 기본 880
  imageHeight?: number           // wide 모드일 때 기본 480
  cta?: {
    label: string
    href: string
  }
}

interface TourModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  slides: TourSlide[]
  headline?: string              // 상단 서브 타이틀 (기본값 'Ag Office 둘러보기')
  trigger?: React.ReactNode      // DialogTrigger에 주입할 버튼/요소
  firstActionLabel?: string      // 1단계 기본 버튼 라벨 (기본값 '둘러보기')
  nextActionLabel?: string       // 2~N-1 단계 버튼 라벨 (기본값 '다음')
  finishActionLabel?: string     // 마지막 단계 버튼 라벨 (기본값 '완료')
  skipLabel?: string             // 건너뛰기 버튼 라벨 (기본값 '건너뛰기')
}
```

## 기본 사용 예시
```tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { TourModal, type TourSlide } from '@/components/tutorials/tour-modal'

const slides: TourSlide[] = [
  {
    title: 'OOO님, 환영합니다! 멤버 초대를 하고 바로 시작해보세요!',
    description: '당신의 역할에 맞는 기능부터 빠르게 확인해보세요.',
    imageSrc: '/images/step1.jpg',
    imageAlt: '조직관리 첫 단계 안내 이미지',
    imageVariant: 'card',
    cta: { label: '멤버 초대하기', href: '/settings/organization' },
  },
  {
    title: '계약현황으로 전체 파이프라인을 확인하세요',
    description: '계약 진행 상황과 주요 지표를 한눈에 확인하고 관리하세요.',
    imageSrc: '/images/step2.jpg',
    imageVariant: 'wide',
  },
  // ...나머지 슬라이드
]

export function OrganizationPageTour() {
  const [open, setOpen] = useState(false)

  return (
    <TourModal
      open={open}
      onOpenChange={setOpen}
      slides={slides}
      headline="Ag Office 둘러보기"
      trigger={
        <Button variant="outline" size="lg">
          튜토리얼 안내
        </Button>
      }
    />
  )
}
```

## 구현 팁
- 이미지가 4:3 비율 카드형이라면 `imageVariant: 'card'`만 지정하면 됩니다.
- 와이드 이미지는 `imageVariant: 'wide'`로 두고 필요 시 `imageWidth`, `imageHeight`를 덮어써서 해상도를 조정합니다.
- 슬라이드별 CTA가 필요 없다면 `cta` 속성을 생략하세요.
- 모달을 닫으면 내부에서 자동으로 1단계로 리셋됩니다.
- 추가적인 텍스트/레이아웃 커스터마이징이 필요하면 `tour-modal.tsx` 컴포넌트 내부를 참고해 확장할 수 있습니다.

