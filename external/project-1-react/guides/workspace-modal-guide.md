# WorkspaceModal 가이드

`components/workspace-modal.tsx`에 정의된 `WorkspaceModal`은 워크스페이스를 생성할 때 재사용할 수 있는 공통 모달 컴포넌트입니다. 기본 입력 필드, 이메일 배지 처리, 제출/취소 버튼을 포함하고 있으며 `Dialog` 컴포넌트를 기반으로 구성되어 있습니다.

## 특징

- 워크스페이스 이름 필수 입력 필드 제공
- 콤마(,) 또는 `Enter` 입력으로 여러 이메일을 배지 형태로 추가
- 이메일 형식 검증 및 중복 방지 처리
- `onSubmit` 콜백을 통해 실제 생성 로직을 부모 컴포넌트에 위임
- `isSubmitting` 프로퍼티로 외부 비동기 처리 상태 연동 가능

## Props

| 이름 | 타입 | 기본값 | 설명 |
| --- | --- | --- | --- |
| `open` | `boolean` | `false` | 모달 표시 여부 |
| `onOpenChange` | `(open: boolean) => void` | - | 모달 열기/닫기 상태 변경 핸들러 |
| `onSubmit` | `(payload: WorkspaceModalSubmitPayload) => Promise<void> \| void` | - | 생성 버튼 클릭 시 호출되는 콜백 |
| `title` | `string` | `"새 워크스페이스"` | 모달 제목 |
| `submitButtonLabel` | `string` | `"생성"` | 생성 버튼 텍스트 |
| `cancelButtonLabel` | `string` | `"취소"` | 취소 버튼 텍스트 |
| `initialName` | `string` | `""` | 초기 워크스페이스 이름 값 |
| `initialInviteEmails` | `string[]` | `[]` | 초기 초대 이메일 목록 |
| `description` | `string` | `undefined` | 제목 아래에 표시할 보조 설명 |
| `isSubmitting` | `boolean` | `false` | 외부 로딩 상태 (버튼/입력 비활성화) |

`WorkspaceModalSubmitPayload` 타입은 `name`과 `inviteEmails` 속성을 포함하며, 각각 워크스페이스 이름과 초대 이메일 배열을 의미합니다.

## 사용 예시

```tsx
import { useState } from "react"
import WorkspaceModal, { WorkspaceModalSubmitPayload } from "@/components/workspace-modal"

export function ExampleContainer() {
  const [open, setOpen] = useState(false)

  const handleSubmit = async ({ name, inviteEmails }: WorkspaceModalSubmitPayload) => {
    // API 호출 등 필요한 처리 수행
    console.log(name, inviteEmails)
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}>워크스페이스 추가</button>
      <WorkspaceModal
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
      />
    </>
  )
}
```

## Sidebar 적용 예시

`components/sidebar.tsx`에서 아래와 같이 연결하여 사용할 수 있습니다.

```tsx
<WorkspaceModal
  open={isWorkspaceModalOpen}
  onOpenChange={setIsWorkspaceModalOpen}
  onSubmit={({ name, inviteEmails }) => {
    console.log("워크스페이스 이름:", name)
    console.log("초대 이메일 목록:", inviteEmails)
    showSuccessToast("워크스페이스가 생성됐습니다.")
  }}
/>
```

실제 생성 로직은 `onSubmit` 콜백 내부에서 API 호출 후 토스트 노출 등으로 확장하면 됩니다.

