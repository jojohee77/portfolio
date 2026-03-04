"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"

interface ScrollModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  content: string | React.ReactNode
  buttonText?: string
  onConfirm?: () => void
}

export default function ScrollModal({
  isOpen,
  onClose,
  title,
  content,
  buttonText = "확인",
  onConfirm,
}: ScrollModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  // 제목에서 (필수) 또는 (선택) 부분 분리
  const renderTitle = () => {
    const match = title.match(/^\([^)]+\)/)
    if (match) {
      const prefix = match[0]
      const rest = title.replace(/^\([^)]+\)\s*/, '')
      return (
        <>
          <span className="text-primary">{prefix}</span>
          {rest}
        </>
      )
    }
    return title
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-auto sm:max-w-[500px] max-h-[85vh] p-0 gap-0 bg-white border-none rounded-xl [&>button]:hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6">
          <DialogTitle className="text-base sm:text-lg font-bold text-gray-900 m-0 leading-none">
            {renderTitle()}
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 콘텐츠 - 스크롤 영역 */}
        <div className="px-4 sm:px-6 max-h-[50vh] overflow-y-auto border-t border-b border-gray-200">
          <div className="py-4 sm:py-6">
            {typeof content === 'string' ? (
              <pre className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {content}
              </pre>
            ) : (
              <div className="text-xs sm:text-sm text-gray-800">
                {content}
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <Button
            onClick={handleConfirm}
            className="w-full h-11 sm:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground transition-colors font-bold rounded-xl"
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

