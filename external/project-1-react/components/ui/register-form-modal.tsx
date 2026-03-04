"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface RegisterFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  title: string
  children: React.ReactNode
  submitButtonText?: string
  submitButtonDisabled?: boolean
  showCloseButton?: boolean
  maxWidth?: string
  className?: string
}

export default function RegisterFormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  submitButtonText = "등록",
  submitButtonDisabled = false,
  showCloseButton = false,
  maxWidth = "max-w-[95vw] sm:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px]",
  className = ""
}: RegisterFormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidth} max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden ${className}`}>
        {/* 헤더 */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-bold m-0">{title}</DialogTitle>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                필요한 정보를 입력하여 등록하세요.
              </p>
            </div>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>
        
        {/* 폼 내용 */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/10">
          <form id="register-form" onSubmit={onSubmit} className="space-y-6">
            {children}
          </form>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t flex-shrink-0 bg-white">
          <Button 
            type="button"
            onClick={onClose}
            className="w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
          >
            취소
          </Button>
          <Button 
            type="submit" 
            form="register-form"
            disabled={submitButtonDisabled}
            className="py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg px-6"
          >
            {submitButtonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
