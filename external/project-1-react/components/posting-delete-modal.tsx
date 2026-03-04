"use client"

import AlertConfirmModal from "@/components/ui/alert-confirm-modal"

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

interface PostingDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  posting: PostingData | null
  onConfirm: () => void
}

export default function PostingDeleteModal({
  isOpen,
  onClose,
  posting,
  onConfirm
}: PostingDeleteModalProps) {
  if (!posting) return null

  return (
    <AlertConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="포스팅 삭제"
      message={`다음 포스팅을 삭제하시겠습니까?\n\n회사명: ${posting.client}\n키워드: ${posting.keyword}\n담당자: ${posting.manager}\n\n이 작업은 되돌릴 수 없습니다.`}
      confirmText="삭제하기"
      cancelText="취소"
    />
  )
}
