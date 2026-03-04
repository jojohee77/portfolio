"use client"

import AlertConfirmModal from "@/components/ui/alert-confirm-modal"

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

interface WorkDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  workTask: WorkTask | null
  onConfirm: () => void
}

export default function WorkDeleteModal({
  isOpen,
  onClose,
  workTask,
  onConfirm
}: WorkDeleteModalProps) {
  if (!workTask) return null

  return (
    <AlertConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="업무 삭제"
      message={`다음 업무를 삭제하시겠습니까?\n\n계약번호: ${workTask.contractNumber}\n서비스 유형: ${workTask.serviceType}\n담당자: ${workTask.assignee}\n\n이 작업은 되돌릴 수 없습니다.`}
      confirmText="삭제하기"
      cancelText="취소"
    />
  )
}
