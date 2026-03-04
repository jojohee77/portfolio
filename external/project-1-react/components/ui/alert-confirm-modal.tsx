"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AlertConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
  additionalMessage?: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  showCancel?: boolean
  showHeaderTitle?: boolean
  contentTitle?: string
  maxWidth?: string
  dismissible?: boolean
}

export default function AlertConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "계약 삭제",
  message = "해당 계약과 관련된 모든 기록이 영구 삭제됩니다. 삭제 후 복구할 수 없습니다.",
  additionalMessage,
  confirmText = "삭제하기",
  cancelText = "취소",
  isLoading = false,
  showCancel = true,
  showHeaderTitle = true,
  contentTitle,
  maxWidth = "360px",
  dismissible = true,
}: AlertConfirmModalProps) {
  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm()
    }
  }

  // "삭제" 또는 "삭제하기" 버튼일 경우에만 빨간색 사용
  const isDestructiveAction = confirmText.includes('삭제') || confirmText.includes('삭제하기')

  const renderEmphasisText = (text: string) => {
    const segments = text.split(/(\*\*.*?\*\*)/g).filter(Boolean)
    return segments.map((segment, index) => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        const content = segment.slice(2, -2)
        return (
          <span key={`bold-${index}`} className="font-semibold text-gray-900">
            {content}
          </span>
        )
      }
      return <span key={`text-${index}`}>{segment}</span>
    })
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={dismissible ? onClose : undefined}
    >
      <DialogContent 
        className="rounded-xl p-6" 
        style={{ maxWidth }}
        onPointerDownOutside={dismissible ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={dismissible ? undefined : (e) => e.preventDefault()}
      >
        {showHeaderTitle && (
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">
              {title}
            </DialogTitle>
          </DialogHeader>
        )}
        
        <div className={`${showHeaderTitle ? "py-4" : "pt-4 pb-3"} ${contentTitle ? "text-center" : ""}`}>
          {contentTitle && (
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {contentTitle}
            </h3>
          )}
          <div className="text-[16px] text-gray-500 leading-relaxed">
            {(() => {
              const lines = message.split('\n')
              const result = []
              
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i]
                const isInfoGroup = line.includes('계약번호:') || line.includes('서비스 유형:') || line.includes('담당자:') || line.includes('회사명:') || line.includes('키워드:')
                
                if (isInfoGroup) {
                  // 정보 그룹 시작
                  const infoLines = []
                  let j = i
                  
                  while (j < lines.length && (lines[j].includes('계약번호:') || lines[j].includes('서비스 유형:') || lines[j].includes('담당자:') || lines[j].includes('회사명:') || lines[j].includes('키워드:'))) {
                    infoLines.push(lines[j])
                    j++
                  }
                  
                  // 정보 그룹을 배경색과 함께 렌더링
                  result.push(
                    <div key={`info-group-${i}`} className="bg-gray-50 p-3 rounded-lg mt-2 mb-2">
                      {infoLines.map((infoLine, idx) => (
                        <div key={`info-line-${idx}`} className={
                          (infoLine.includes('계약번호:') || infoLine.includes('회사명:'))
                            ? isDestructiveAction 
                              ? "text-red-600" 
                              : "text-blue-600"
                            : "text-gray-800"
                        }>
                          {infoLine}
                        </div>
                      ))}
                    </div>
                  )
                  
                  i = j - 1 // 다음 루프에서 올바른 인덱스로 시작
                } else {
                  // 일반 텍스트 라인을 p 태그로 렌더링
                  result.push(
                    <p key={`text-line-${i}`} className="text-gray-500">
                      {renderEmphasisText(line.replace(/\\n/g, ''))}
                    </p>
                  )
                }
              }
              
              // additionalMessage가 있으면 별도의 p 태그로 추가
              if (additionalMessage) {
                result.push(
                  <p key="additional-message" className="text-red-600">
                    {additionalMessage}
                  </p>
                )
              }
              
              return result
            })()}
          </div>
        </div>

        <DialogFooter className={`gap-2 ${showCancel ? 'flex-row' : 'flex-col'}`}>
          {showCancel && (
            <Button
              variant="outline"
              className="h-11 sm:h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 border-0 rounded-xl flex-1"
              disabled={isLoading}
              onClick={onClose}
            >
              {cancelText}
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className={`h-11 sm:h-12 text-white rounded-xl ${showCancel ? 'flex-1' : 'w-full'} ${
              isDestructiveAction 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-primary hover:bg-primary/90'
            }`}
            disabled={isLoading}
          >
            {isLoading ? "처리중..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

