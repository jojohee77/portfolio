# AlertConfirmModal (얼럿 & 확인 모달) 사용 가이드

## 개요

`AlertConfirmModal`은 사용자에게 확인을 받는 범용 모달 컴포넌트입니다. 삭제 확인, 얼럿 메시지, 경고 알림 등 다양한 확인 작업에 일관된 UX를 제공합니다.

**주요 사용 사례:**
- 삭제 확인 모달 (확인/취소 버튼)
- 얼럿창 (확인 버튼만)
- 경고 메시지
- 일반 확인 다이얼로그

## 파일 위치

```
components/ui/alert-confirm-modal.tsx
```

## 주요 특징

- ✅ 일관된 삭제 확인 UX 제공
- ✅ 커스터마이징 가능한 제목, 메시지, 버튼 텍스트
- ✅ 로딩 상태 지원
- ✅ 반응형 디자인 (모바일/데스크톱 최적화)
- ✅ 접근성 고려 (키보드 네비게이션, 스크린 리더 지원)

## Props

| Props | 타입 | 필수 | 기본값 | 설명 |
|-------|------|------|--------|------|
| `isOpen` | `boolean` | ✅ | - | 모달 열림/닫힘 상태 |
| `onClose` | `() => void` | ✅ | - | 모달 닫기 콜백 함수 |
| `onConfirm` | `() => void` | ✅ | - | 확인 버튼 클릭 시 콜백 함수 |
| `title` | `string` | ❌ | "계약 삭제" | 헤더 제목 |
| `message` | `string` | ❌ | "해당 계약과 관련된 모든 기록이 영구 삭제됩니다..." | 본문 메시지 |
| `confirmText` | `string` | ❌ | "삭제하기" | 확인 버튼 텍스트 |
| `cancelText` | `string` | ❌ | "취소" | 취소 버튼 텍스트 |
| `isLoading` | `boolean` | ❌ | `false` | 로딩 상태 (버튼 비활성화) |
| `showCancel` | `boolean` | ❌ | `true` | 취소 버튼 표시 여부 |
| `showHeaderTitle` | `boolean` | ❌ | `true` | 헤더 타이틀 표시 여부 |
| `contentTitle` | `string` | ❌ | - | 본문 내 타이틀 (헤더 대신 사용) |
| `maxWidth` | `string` | ❌ | "360px" | 모달 최대 너비 |
| `dismissible` | `boolean` | ❌ | `true` | 바깥 영역 클릭/ESC로 닫기 허용 |

## 기본 사용법

### 1. 컴포넌트 import

```tsx
import AlertConfirmModal from "@/components/ui/alert-confirm-modal"
```

### 2. 상태 관리

```tsx
const [deleteModalOpen, setDeleteModalOpen] = useState(false)
const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
```

### 3. 삭제 핸들러

```tsx
const handleDelete = (id: string) => {
  setDeleteTargetId(id)
  setDeleteModalOpen(true)
}

const handleConfirmDelete = () => {
  if (deleteTargetId) {
    // 실제 삭제 로직 실행
    console.log('삭제할 ID:', deleteTargetId)
    
    // 삭제 완료 후
    setDeleteModalOpen(false)
    setDeleteTargetId(null)
    // 성공 토스트 표시
  }
}
```

### 4. 컴포넌트 사용

```tsx
<AlertConfirmModal
  isOpen={deleteModalOpen}
  onClose={() => setDeleteModalOpen(false)}
  onConfirm={handleConfirmDelete}
/>
```

## 사용 예시

### 예시 1: 얼럿창 (확인 버튼만)

```tsx
const AlertExample = () => {
  const [alertOpen, setAlertOpen] = useState(false)

  const handleShowAlert = () => {
    setAlertOpen(true)
  }

  const handleAlertConfirm = () => {
    console.log('확인 클릭')
    showSuccessToast('확인되었습니다')
    setAlertOpen(false)
  }

  return (
    <div>
      <Button onClick={handleShowAlert}>
        얼럿 표시
      </Button>

      <AlertConfirmModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={handleAlertConfirm}
        showHeaderTitle={false}
        contentTitle="얼럿창 테스트!"
        message="얼럿창 메시지입니다."
        confirmText="확인"
        showCancel={false}
        maxWidth="320px"
      />
    </div>
  )
}
```

### 예시 2: 계약 삭제

```tsx
const ContractPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<string | null>(null)

  const handleDeleteContract = (contractId: string) => {
    setSelectedContract(contractId)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedContract) {
      try {
        await deleteContract(selectedContract)
        showSuccessToast("계약이 삭제되었습니다")
      } catch (error) {
        showErrorToast("삭제 중 오류가 발생했습니다")
      }
      setDeleteModalOpen(false)
      setSelectedContract(null)
    }
  }

  return (
    <div>
      {/* 계약 목록 */}
      <Button 
        variant="ghost" 
        onClick={() => handleDeleteContract(contract.id)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="계약 삭제"
        message="해당 계약과 관련된 모든 기록이 영구 삭제됩니다. 삭제 후 복구할 수 없습니다. 정말 삭제하시겠습니까?"
      />
    </div>
  )
}
```

### 예시 3: 사용자 삭제 (로딩 상태 포함)

```tsx
const UserManagementPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)

  const handleDeleteUser = (userId: string) => {
    setDeleteUserId(userId)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (deleteUserId) {
      setIsDeleting(true)
      try {
        await deleteUser(deleteUserId)
        showSuccessToast("사용자가 삭제되었습니다")
        setDeleteModalOpen(false)
      } catch (error) {
        showErrorToast("삭제 중 오류가 발생했습니다")
      } finally {
        setIsDeleting(false)
        setDeleteUserId(null)
      }
    }
  }

  return (
    <AlertConfirmModal
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleConfirmDelete}
      title="사용자 삭제"
      message="해당 사용자의 모든 데이터가 영구 삭제됩니다. 삭제 후 복구할 수 없습니다."
      confirmText="삭제"
      cancelText="취소"
      isLoading={isDeleting}
    />
  )
}
```

### 예시 4: 게시물 삭제 (커스텀 메시지)

```tsx
const PostListPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<Post | null>(null)

  const handleDeletePost = (post: Post) => {
    setPostToDelete(post)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (postToDelete) {
      await deletePost(postToDelete.id)
      showSuccessToast(`"${postToDelete.title}" 게시물이 삭제되었습니다`)
      setDeleteModalOpen(false)
      setPostToDelete(null)
    }
  }

  return (
    <AlertConfirmModal
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleConfirmDelete}
      title="게시물 삭제"
      message={`"${postToDelete?.title}" 게시물을 삭제하시겠습니까? 삭제된 게시물은 복구할 수 없습니다.`}
      confirmText="삭제하기"
      cancelText="취소"
    />
  )
}
```

### 예시 5: 여러 항목 일괄 삭제

```tsx
const BulkDeleteExample = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleBulkDelete = () => {
    if (selectedItems.length > 0) {
      setDeleteModalOpen(true)
    }
  }

  const handleConfirmBulkDelete = async () => {
    try {
      await bulkDeleteItems(selectedItems)
      showSuccessToast(`${selectedItems.length}개 항목이 삭제되었습니다`)
      setSelectedItems([])
    } catch (error) {
      showErrorToast("삭제 중 오류가 발생했습니다")
    }
    setDeleteModalOpen(false)
  }

  return (
    <AlertConfirmModal
      isOpen={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      onConfirm={handleConfirmBulkDelete}
      title="선택 항목 삭제"
      message={`선택한 ${selectedItems.length}개 항목을 삭제하시겠습니까? 삭제된 항목은 복구할 수 없습니다.`}
      confirmText="삭제하기"
    />
  )
}
```

## 디자인 특징

### 모달 크기 및 레이아웃

- **최대 너비**: 360px (고정)
- **라운드**: `rounded-xl`
- **반응형**: 모바일/데스크톱 최적화

### 색상 및 스타일

- **제목**: 검정색, 20px, 굵은 글씨
- **메시지**: 회색, 16px
- **취소 버튼**: 회색 배경 (`bg-gray-100`)
- **확인 버튼**: Primary 컬러 (`bg-primary`)
- **버튼 높이**: 44px (모바일), 48px (데스크톱)

### 로딩 상태

- `isLoading={true}` 시 버튼들이 비활성화됨
- 확인 버튼 텍스트가 "처리중..."으로 변경됨

## 접근성 고려사항

- **키보드 네비게이션**: Tab 키로 버튼 간 이동 가능
- **스크린 리더**: 적절한 ARIA 레이블 제공
- **포커스 관리**: 모달 열림 시 자동 포커스
- **ESC 키**: 모달 닫기 지원

## 사용 시 주의사항

1. **삭제 확인**: 반드시 사용자에게 삭제 작업의 위험성을 명확히 안내
2. **복구 불가능**: 삭제 후 복구가 불가능함을 명시
3. **로딩 상태**: API 호출 시 `isLoading` 상태 사용 권장
4. **에러 처리**: 삭제 실패 시 적절한 에러 메시지 표시
5. **성공 피드백**: 삭제 완료 후 토스트 메시지 표시
6. **바깥 영역 클릭**: 기본적으로 바깥 영역 클릭/ESC 키로 모달이 닫힙니다. 중요한 작업은 `dismissible={false}` 사용

## 커스터마이징

더 많은 커스터마이징이 필요한 경우 `components/ui/alert-confirm-modal.tsx` 파일을 직접 수정하거나, props를 활용하여 다양하게 커스터마이징할 수 있습니다.

### 얼럿창 스타일

```tsx
// 작은 얼럿창
<AlertConfirmModal
  isOpen={open}
  onClose={onClose}
  onConfirm={onConfirm}
  showHeaderTitle={false}
  contentTitle="알림"
  message="작업이 완료되었습니다."
  confirmText="확인"
  showCancel={false}
  maxWidth="320px"
/>

// 큰 얼럿창
<AlertConfirmModal
  isOpen={open}
  onClose={onClose}
  onConfirm={onConfirm}
  showHeaderTitle={false}
  contentTitle="중요 공지"
  message="시스템 점검이 예정되어 있습니다. 2024-01-15 02:00~04:00"
  confirmText="확인"
  showCancel={false}
  maxWidth="400px"
/>
```

### 기타 커스터마이징

- 버튼 스타일 변경
- 애니메이션 추가
- 아이콘 추가
- 다국어 지원

## 얼럿창 vs 삭제 확인 모달

| 특징 | 얼럿창 | 삭제 확인 모달 |
|------|--------|---------------|
| 용도 | 정보 전달, 단순 알림 | 중요한 삭제 작업 확인 |
| 버튼 개수 | 1개 (확인) | 2개 (취소/삭제) |
| `showCancel` | `false` | `true` (기본값) |
| `showHeaderTitle` | `false` (본문 타이틀 사용) | `true` (기본값) |
| `contentTitle` | 사용 | 사용 안 함 |
| `maxWidth` | 작게 (320px) | 기본 (360px) |
| 메시지 톤 | 친근함 | 경고/주의 |
| 사용 예시 | "작업이 완료되었습니다!" | "정말 삭제하시겠습니까?" |

## 관련 컴포넌트

- `Dialog` (기반 컴포넌트)
- `Button` (버튼 컴포넌트)
- Toast 시스템 (성공/에러 메시지)

## 업무 삭제 모달 사용법

### WorkDeleteModal 컴포넌트

업무 삭제를 위한 전용 모달 컴포넌트입니다. `AlertConfirmModal`을 기반으로 구현되어 있으며, 업무의 상세 정보를 표시합니다.

#### 파일 위치
```
components/work-delete-modal.tsx
```

#### Props

| Props | 타입 | 필수 | 설명 |
|-------|------|------|------|
| `isOpen` | `boolean` | ✅ | 모달 열림/닫힘 상태 |
| `onClose` | `() => void` | ✅ | 모달 닫기 콜백 함수 |
| `workTask` | `WorkTask \| null` | ✅ | 삭제할 업무 데이터 |
| `onConfirm` | `() => void` | ✅ | 삭제 확인 콜백 함수 |

#### WorkTask 인터페이스

```tsx
interface WorkTask {
  id: string
  contractNumber: string
  serviceType: string
  contractDescription: string
  startDate: string
  endDate: string
  teamName: string
  assignee: string
  targetKeywords: string
  keywordRankLimit: number
  status: "진행중" | "완료" | "대기" | "보류"
  notes: string
  createdAt: string
}
```

### 기본 사용법

#### 1. 컴포넌트 import

```tsx
import WorkDeleteModal from "@/components/work-delete-modal"
```

#### 2. 상태 관리

```tsx
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null)
```

#### 3. 삭제 핸들러

```tsx
const handleDeleteTask = (task: WorkTask) => {
  setSelectedTask(task)
  setIsDeleteModalOpen(true)
}

const handleConfirmDelete = () => {
  if (selectedTask) {
    // 실제 삭제 로직 실행
    console.log('삭제할 업무:', selectedTask.id)
    
    // 삭제 완료 후
    setIsDeleteModalOpen(false)
    setSelectedTask(null)
    // 성공 토스트 표시
  }
}
```

#### 4. 컴포넌트 사용

```tsx
<WorkDeleteModal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  workTask={selectedTask}
  onConfirm={handleConfirmDelete}
/>
```

### 사용 예시

#### 예시 1: 업무 목록에서 삭제

```tsx
const WorkTaskList = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null)
  const [workTasks, setWorkTasks] = useState<WorkTask[]>([])

  const handleDeleteTask = (task: WorkTask) => {
    setSelectedTask(task)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedTask) {
      try {
        // API 호출로 업무 삭제
        await deleteWorkTask(selectedTask.id)
        
        // 로컬 상태에서도 제거
        setWorkTasks(prev => prev.filter(task => task.id !== selectedTask.id))
        
        showSuccessToast("업무가 삭제되었습니다")
      } catch (error) {
        showErrorToast("삭제 중 오류가 발생했습니다")
      }
      
      setDeleteModalOpen(false)
      setSelectedTask(null)
    }
  }

  return (
    <div>
      {/* 업무 목록 */}
      {workTasks.map(task => (
        <div key={task.id} className="flex items-center justify-between">
          <div>
            <div className="font-medium">{task.contractNumber}</div>
            <div className="text-sm text-gray-500">{task.serviceType}</div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeleteTask(task)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* 삭제 모달 */}
      <WorkDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        workTask={selectedTask}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
```

#### 예시 2: DataTable에서 삭제

```tsx
const WorkTaskTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<WorkTask | null>(null)

  const handleDeleteTask = (task: WorkTask) => {
    setSelectedTask(task)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedTask) {
      await deleteWorkTask(selectedTask.id)
      showSuccessToast("업무가 삭제되었습니다")
      setDeleteModalOpen(false)
      setSelectedTask(null)
    }
  }

  const columns: Column<WorkTask>[] = [
    // ... 다른 컬럼들
    {
      key: "actions",
      label: "작업",
      render: (task) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteTask(task)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <DataTable
        data={workTasks}
        columns={columns}
        // ... 기타 props
      />

      <WorkDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        workTask={selectedTask}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
```

### 모달 표시 정보

업무 삭제 모달에는 다음 정보가 표시됩니다:

- **계약번호**: `workTask.contractNumber`
- **서비스 유형**: `workTask.serviceType`
- **담당자**: `workTask.assignee`

### 디자인 특징

- **제목**: "업무 삭제"
- **메시지**: 업무 상세 정보와 함께 경고 메시지
- **확인 버튼**: "삭제하기" (빨간색)
- **취소 버튼**: "취소" (회색)

### 주의사항

1. **데이터 검증**: `workTask`가 `null`인 경우 모달이 렌더링되지 않음
2. **삭제 확인**: 업무의 중요 정보를 표시하여 사용자가 올바른 업무를 삭제하는지 확인
3. **복구 불가**: 삭제 후 복구가 불가능함을 명시
4. **관련 데이터**: 업무와 연관된 다른 데이터도 함께 삭제될 수 있음을 고려

### 커스터마이징

더 많은 정보를 표시하거나 다른 스타일을 원하는 경우 `WorkDeleteModal` 컴포넌트를 직접 수정할 수 있습니다:

```tsx
// 추가 정보 표시 예시
message={`다음 업무를 삭제하시겠습니까?

계약번호: ${workTask.contractNumber}
서비스 유형: ${workTask.serviceType}
담당자: ${workTask.assignee}
팀: ${workTask.teamName}
시작일: ${workTask.startDate}
종료일: ${workTask.endDate}
상태: ${workTask.status}

이 작업은 되돌릴 수 없습니다.`}
```

## 포스팅 삭제 모달 사용법

### PostingDeleteModal 컴포넌트

포스팅 삭제를 위한 전용 모달 컴포넌트입니다. `AlertConfirmModal`을 기반으로 구현되어 있으며, 포스팅의 상세 정보를 표시합니다.

#### 파일 위치
```
components/posting-delete-modal.tsx
```

#### Props

| Props | 타입 | 필수 | 설명 |
|-------|------|------|------|
| `isOpen` | `boolean` | ✅ | 모달 열림/닫힘 상태 |
| `onClose` | `() => void` | ✅ | 모달 닫기 콜백 함수 |
| `posting` | `PostingData \| null` | ✅ | 삭제할 포스팅 데이터 |
| `onConfirm` | `() => void` | ✅ | 삭제 확인 콜백 함수 |

#### PostingData 인터페이스

```tsx
interface PostingData {
  id: number
  blogUrl: string
  client: string
  title: string
  keyword: string
  manager: string
  rank: number
  change: number
  history: any[]
  registeredDate: string
  lastChecked: string
  teamName: string
  category: "신규" | "재작업"
  contractThreshold: number
}
```

### 기본 사용법

#### 1. 컴포넌트 import

```tsx
import PostingDeleteModal from "@/components/posting-delete-modal"
```

#### 2. 상태 관리

```tsx
const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
const [selectedPosting, setSelectedPosting] = useState<PostingData | null>(null)
```

#### 3. 삭제 핸들러

```tsx
const handleDeletePosting = (posting: PostingData) => {
  setSelectedPosting(posting)
  setIsDeleteModalOpen(true)
}

const handleConfirmDelete = () => {
  if (selectedPosting) {
    // 실제 삭제 로직 실행
    console.log('삭제할 포스팅:', selectedPosting.id)
    
    // 삭제 완료 후
    setIsDeleteModalOpen(false)
    setSelectedPosting(null)
    // 성공 토스트 표시
  }
}
```

#### 4. 컴포넌트 사용

```tsx
<PostingDeleteModal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  posting={selectedPosting}
  onConfirm={handleConfirmDelete}
/>
```

### 사용 예시

#### 예시 1: 포스팅 목록에서 삭제

```tsx
const PostingListPage = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPosting, setSelectedPosting] = useState<PostingData | null>(null)
  const [postingData, setPostingData] = useState<PostingData[]>([])

  const handleDeletePosting = (posting: PostingData) => {
    setSelectedPosting(posting)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedPosting) {
      try {
        // API 호출로 포스팅 삭제
        await deletePosting(selectedPosting.id)
        
        // 로컬 상태에서도 제거
        setPostingData(prev => prev.filter(p => p.id !== selectedPosting.id))
        
        showSuccessToast("포스팅이 삭제되었습니다")
      } catch (error) {
        showErrorToast("삭제 중 오류가 발생했습니다")
      }
      
      setDeleteModalOpen(false)
      setSelectedPosting(null)
    }
  }

  return (
    <div>
      {/* 포스팅 목록 */}
      {postingData.map(posting => (
        <div key={posting.id} className="flex items-center justify-between">
          <div>
            <div className="font-medium">{posting.title}</div>
            <div className="text-sm text-gray-500">{posting.client}</div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDeletePosting(posting)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {/* 삭제 모달 */}
      <PostingDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        posting={selectedPosting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
```

#### 예시 2: DataTable에서 삭제

```tsx
const PostingTable = () => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedPosting, setSelectedPosting] = useState<PostingData | null>(null)

  const handleDeletePosting = (posting: PostingData) => {
    setSelectedPosting(posting)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedPosting) {
      await deletePosting(selectedPosting.id)
      showSuccessToast("포스팅이 삭제되었습니다")
      setDeleteModalOpen(false)
      setSelectedPosting(null)
    }
  }

  const columns: Column<PostingData>[] = [
    // ... 다른 컬럼들
    {
      key: "actions",
      label: "작업",
      render: (posting) => (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeletePosting(posting)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <DataTable
        data={postingData}
        columns={columns}
        // ... 기타 props
      />

      <PostingDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        posting={selectedPosting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
```

### 모달 표시 정보

포스팅 삭제 모달에는 다음 정보가 표시됩니다:

- **회사명**: `posting.client`
- **키워드**: `posting.keyword`
- **담당자**: `posting.manager`

### 디자인 특징

- **제목**: "포스팅 삭제"
- **메시지**: 포스팅 상세 정보와 함께 경고 메시지
- **확인 버튼**: "삭제하기" (빨간색)
- **취소 버튼**: "취소" (회색)

### 주의사항

1. **데이터 검증**: `posting`이 `null`인 경우 모달이 렌더링되지 않음
2. **삭제 확인**: 포스팅의 중요 정보를 표시하여 사용자가 올바른 포스팅을 삭제하는지 확인
3. **복구 불가**: 삭제 후 복구가 불가능함을 명시
4. **관련 데이터**: 포스팅과 연관된 다른 데이터도 함께 삭제될 수 있음을 고려

### 커스터마이징

더 많은 정보를 표시하거나 다른 스타일을 원하는 경우 `PostingDeleteModal` 컴포넌트를 직접 수정할 수 있습니다:

```tsx
// 추가 정보 표시 예시
message={`다음 포스팅을 삭제하시겠습니까?

회사명: ${posting.client}
제목: ${posting.title}
키워드: ${posting.keyword}
담당자: ${posting.manager}
팀: ${posting.teamName}
현재 순위: ${posting.rank}위
등록일: ${posting.registeredDate}
카테고리: ${posting.category}

이 작업은 되돌릴 수 없습니다.`}
```

## 문의

더 자세한 정보나 문제가 있는 경우 개발팀에 문의하세요.
