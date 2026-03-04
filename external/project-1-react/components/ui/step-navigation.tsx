"use client"

import React from 'react'
import { Button } from "@/components/ui/button"

export interface StepNavigationProps {
  currentStep: number
  totalSteps: number
  onPrev?: () => void
  onNext?: () => void
  onDraft?: () => void
  onSubmit?: () => void
  onCancel?: () => void  // 취소 버튼 클릭 시 호출
  showPrev?: boolean  // 이전 버튼 표시 여부 (기본: currentStep > 1)
  showDraft?: boolean  // 임시저장 버튼 표시 여부 (기본: true)
  showCancel?: boolean  // 취소 버튼 표시 여부 (기본: false)
  prevLabel?: string  // 이전 버튼 텍스트 (기본: "이전")
  nextLabel?: string  // 다음 버튼 텍스트 (기본: "다음")
  draftLabel?: string  // 임시저장 버튼 텍스트 (기본: "임시저장")
  submitLabel?: string  // 제출 버튼 텍스트 (기본: "저장하기")
  cancelLabel?: string  // 취소 버튼 텍스트 (기본: "취소")
  className?: string
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  onDraft,
  onSubmit,
  onCancel,
  showPrev = currentStep > 1,
  showDraft = true,
  showCancel = false,
  prevLabel = "이전",
  nextLabel = "다음",
  draftLabel = "임시저장",
  submitLabel = "저장하기",
  cancelLabel = "취소",
  className = ""
}: StepNavigationProps) {
  const isLastStep = currentStep === totalSteps

  return (
    <div className={`border-t bg-white px-6 py-4 flex-shrink-0 relative z-10 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] ${className}`}>
      <div className="flex items-center justify-between gap-2">
        {/* 왼쪽: 이전 버튼 */}
        <div className="flex items-center gap-2 md:gap-4">
          {showPrev && onPrev && (
            <Button 
              variant="outline" 
              onClick={onPrev} 
              className="px-3 md:px-5 py-2 md:py-3 h-10 md:h-12 border-gray-400 text-gray-700 hover:bg-gray-50 text-xs md:text-sm font-medium rounded-lg"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">{prevLabel}</span>
            </Button>
          )}
        </div>

        {/* 오른쪽: 취소 & 임시저장 & 다음/저장하기 버튼 */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* 취소 버튼 */}
          {showCancel && onCancel && (
            <Button 
              onClick={onCancel} 
              className="px-3 md:px-6 py-2 md:py-3 h-10 md:h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs md:text-sm font-medium rounded-lg w-auto md:w-24"
            >
              {cancelLabel}
            </Button>
          )}

          {/* 임시저장 버튼 */}
          {showDraft && onDraft && (
            <Button 
              onClick={onDraft} 
              className="px-3 md:px-6 py-2 md:py-3 h-10 md:h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-xs md:text-sm font-medium rounded-lg w-auto md:w-24"
            >
              {draftLabel}
            </Button>
          )}

          {/* 다음 또는 저장하기 버튼 */}
          {isLastStep ? (
            // 마지막 단계: 저장하기 버튼
            onSubmit && (
              <Button 
                onClick={onSubmit} 
                className="gap-1 md:gap-2 px-4 md:px-8 py-2 md:py-3 h-10 md:h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-xs md:text-sm font-medium rounded-lg"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {submitLabel}
              </Button>
            )
          ) : (
            // 중간 단계: 다음 버튼
            onNext && (
              <Button 
                onClick={onNext} 
                className="px-3 md:px-6 py-2 md:py-3 h-10 md:h-12 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-medium rounded-lg w-auto md:w-24"
              >
                {nextLabel}
                <svg className="w-3 h-3 md:w-4 md:h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

