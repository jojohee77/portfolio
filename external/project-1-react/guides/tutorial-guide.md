# 튜토리얼 가이드 (버전1 & 버전2)

Ag Office에서는 간단한 하이라이트 안내가 필요한 경우 `튜토리얼 버전1`(커스텀 Spotlight), 단계별 온보딩이 필요한 경우 `튜토리얼 버전2`(슬라이드 모달)를 사용할 수 있습니다. 아래 내용을 참고하여 페이지에 맞는 방식을 선택하세요.

---

## 공통 준비 사항
1. **타깃 요소 식별자 부여**  
   Spotlight로 강조할 요소에 `data-tour-id` 속성을 부여합니다.  
   예) `data-tour-id="workspace-select"`
2. **훅 가져오기**  
   ```tsx
   import { useTutorials } from "@/components/tutorials/tutorial-provider"

   const { startJoyride, stopJoyride, isJoyrideRunning } = useTutorials()
   ```
3. **뷰포트 분기(선택)**  
   데스크톱/모바일에 따라 다른 스텝을 보여주고 싶다면 `matchMedia("(max-width: 1279px)")` 로 분기합니다.

---

## 튜토리얼 버전1 (Spotlight 안내)
- 파일 위치: `components/tutorials/tutorial-provider.tsx`
- 사용 목적: 화면 일부만 강조하며 짧은 안내를 제공할 때
- 버튼 레이블은 다단계 → `다음/닫기`, 단일 단계 → `알겠습니다`

### API
```ts
startJoyride({
  steps: TutorialStep[]
})

stopJoyride()
```

`TutorialStep` 옵션
| 속성 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `target` | string | (필수) | spotlight를 적용할 셀렉터 |
| `content` | string | (필수) | 안내 문구 (`\n`으로 줄바꿈) |
| `placement` | "top" \| "bottom" \| "left" \| "right" | `right` | 툴팁 위치 |
| `spotlightPadding` | number | 8 | 타깃 요소와 spotlight 사이 여백 |
| `borderRadius` | number | 12 | spotlight 모서리 둥근 정도 |

### 사용 예시
```tsx
const isMobile = window.matchMedia("(max-width: 1279px)").matches

const steps = isMobile
  ? [
      {
        target: "[data-tour-id='mobile-sidebar-toggle']",
        content: "멤버초대, 워크스페이스 생성, 키워드 현황을 확인해보세요.",
        placement: "bottom",
        spotlightPadding: 4,
      },
    ]
  : [
      {
        target: "[data-tour-id='workspace-select']",
        content: "워크스페이스가 생성되었습니다.",
        placement: "right",
        spotlightPadding: 2,
      },
      {
        target: "[data-tour-id='settings-organization']",
        content: "조직관리 페이지에서 새로운 멤버를 초대해보세요.",
        placement: "right",
        spotlightPadding: 2,
      },
    ]

startJoyride({ steps })
```

### 팁
- `isJoyrideRunning` 을 이용해 실행 중인지 감지할 수 있습니다.  
  뷰포트가 변경되면 새로운 스텝 배열로 `startJoyride` 를 다시 호출해 주면 됩니다.
- Spotlight가 화면 밖으로 나가면 `placement` 를 조정하거나 `spotlightPadding` 값을 늘려보세요.

---

## 튜토리얼 버전2 (Tour Modal)
- 파일 위치: `components/tutorials/tour-modal.tsx`
- 사용 목적: 슬라이드 이미지와 텍스트가 필요한 풀 온보딩, 다단계 설명
- 세부 옵션은 `guides/tour-modal-guide.md`에 정리되어 있습니다.

### 기본 사용 패턴
```tsx
import { TourModal, type TourSlide } from "@/components/tutorials/tour-modal"

const slides: TourSlide[] = [
  {
    title: "OOO님, 환영합니다!",
    description: "역할에 맞는 기능부터 빠르게 확인해보세요.",
    imageSrc: "/images/step1.jpg",
    imageVariant: "card",
  },
  {
    title: "계약현황에서 파이프라인을 한눈에",
    description: "진행 상황과 주요 지표를 실시간으로 관리하세요.",
    imageSrc: "/images/step2.jpg",
  },
]

return (
  <TourModal
    open={open}
    onOpenChange={setOpen}
    slides={slides}
    headline="튜토리얼 버전2"
    trigger={
      <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10">
        튜토리얼 버전2
      </Button>
    }
  />
)
```

### 팁
- 슬라이드별 CTA 버튼이 필요하면 `cta` 속성을 사용합니다.
- 이미지 비율은 `imageVariant` (`card`,`wide`)와 `imageWidth`,`imageHeight`로 조정할 수 있습니다.
- 모달을 닫으면 자동으로 첫 슬라이드로 초기화됩니다.

---

## 어떤 버전을 선택할까?
| 상황 | 추천 버전 |
| --- | --- |
| 특정 버튼이나 영역만 빠르게 안내하고 싶을 때 | **버전1** |
| 제품 투어/온보딩처럼 다단계 설명이 필요할 때 | **버전2** |
| 모바일/데스크톱 별로 다른 단계 구성이 필요할 때 | 둘 다 가능 (조건부 스텝 구성) |

---

## 체크리스트
1. 타깃 요소에 `data-tour-id`가 붙어 있는지 확인
2. `useTutorials` / `TourModal` 중 필요한 훅과 컴포넌트를 import
3. 두 버튼의 레이블은 각각 `튜토리얼 버전1`, `튜토리얼 버전2`로 노출
4. 뷰포트가 바뀔 경우 `startJoyride`를 다시 호출해 위치를 갱신
5. 불필요한 의존성(`react-joyride`, `shepherd.js`)이 남아 있지 않은지 확인

이 가이드를 바탕으로 페이지 특성에 맞는 튜토리얼 방식을 선택해 주세요. 필요한 추가 디자인/기능이 있다면 언제든지 요청 가능합니다.
