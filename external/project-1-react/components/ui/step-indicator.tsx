"use client"

import React from 'react'

export interface Step {
  number: number
  title: string
}

export interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
  className?: string
  compact?: boolean  // 컴팩트 모드 (모달, 좁은 공간용)
}

export function StepIndicator({ 
  steps, 
  currentStep, 
  onStepClick,
  className = "",
  compact = false
}: StepIndicatorProps) {
  // 컴팩트 모드용 스타일
  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-2.5 sm:p-3 ${className}`}>
        <div className="flex items-center justify-center relative">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center w-12 sm:w-14 md:w-18 lg:w-20 relative z-10">
                <button
                  onClick={() => onStepClick?.(step.number)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs transition-all duration-300 border ${
                    currentStep === step.number
                      ? 'bg-blue-500 text-white border-blue-300 ring-2 ring-blue-50 scale-105'
                      : currentStep > step.number
                      ? 'bg-blue-500 text-white border-blue-300'
                      : 'bg-white text-gray-400 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </button>
                <div className="mt-1 sm:mt-1.5 text-center w-full px-0.5">
                  <p className={`text-[9px] sm:text-[10px] md:text-[13px] font-medium transition-colors leading-tight ${
                    currentStep === step.number ? 'text-blue-600' : currentStep > step.number ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="relative flex items-center flex-shrink-0 px-0.5 sm:px-1">
                  <div className="w-3 sm:w-4 md:w-6 lg:w-8 h-[1px]">
                    {currentStep > step.number ? (
                      <div className="h-[1px] bg-blue-500" />
                    ) : currentStep === step.number ? (
                      <div className="h-[1px] bg-blue-400" />
                    ) : (
                      <div className="h-[1px] bg-gray-300" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 기본 모드용 스타일
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-3 md:p-4 ${className}`}>
      <div className="flex items-center justify-center relative overflow-x-auto py-1">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center w-16 md:w-20 lg:w-22 xl:w-24 relative z-10 py-1">
              <button
                onClick={() => onStepClick?.(step.number)}
                className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 xl:w-10 xl:h-10 rounded-full flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm transition-all duration-300 border ${
                  currentStep === step.number
                    ? 'bg-blue-500 text-white border-blue-300 ring-2 ring-blue-50 scale-110'
                    : currentStep > step.number
                    ? 'bg-blue-500 text-white border-blue-300'
                    : 'bg-white text-gray-400 border-gray-300 hover:border-gray-400'
                }`}
              >
                {currentStep > step.number ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 xl:w-7 xl:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </button>
              <div className="mt-1.5 sm:mt-2 md:mt-2 lg:mt-2.5 xl:mt-3 text-center w-full">
                <p className={`text-[12px] sm:text-xs md:text-[13px] font-medium transition-colors leading-tight ${
                  currentStep === step.number ? 'text-blue-600' : currentStep > step.number ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="relative flex items-center flex-shrink-0 -mx-1">
                <div className="w-4 sm:w-4 md:w-6 lg:w-8 xl:w-10 h-[1px]">
                  {currentStep > step.number ? (
                    <div className="h-[1px] bg-blue-500" />
                  ) : currentStep === step.number ? (
                    <div className="h-[1px] border-t border-blue-400" />
                  ) : (
                    <div className="h-[1px] border-t border-dashed border-gray-400" />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
