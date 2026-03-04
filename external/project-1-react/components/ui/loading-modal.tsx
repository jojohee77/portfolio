"use client"

import React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface LoadingModalProps {
  open: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  message?: string
  size?: "sm" | "md" | "lg"
  showSpinner?: boolean
  className?: string
}

export function LoadingModal({
  open,
  onOpenChange,
  title = "처리 중...",
  message = "잠시만 기다려 주세요.",
  size = "md",
  showSpinner = true,
  className
}: LoadingModalProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "flex flex-col items-center justify-center p-8 text-center",
          sizeClasses[size],
          className
        )}
        // 로딩 모달은 일반적으로 닫기 버튼을 숨김
        hideCloseButton
      >
        <div className="space-y-4">
          {showSpinner && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// 사용하기 쉬운 훅 제공
export function useLoadingModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  
  const showLoading = React.useCallback(() => {
    setIsOpen(true)
  }, [])
  
  const hideLoading = React.useCallback(() => {
    setIsOpen(false)
  }, [])
  
  return {
    isOpen,
    showLoading,
    hideLoading,
    LoadingModal: (props: Omit<LoadingModalProps, 'open' | 'onOpenChange'>) => (
      <LoadingModal {...props} open={isOpen} onOpenChange={setIsOpen} />
    )
  }
}
