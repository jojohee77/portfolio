"use client"

import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface LoadingAnimationProps {
  message?: string
  subMessage?: string
  size?: number
  className?: string
}

export default function LoadingAnimation({
  message = "데이터 처리중...",
  subMessage = "잠시만 기다려 주세요.\n작업이 완료되면 자동으로 닫힙니다.",
  size = 120,
  className = "",
}: LoadingAnimationProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div style={{ width: size, height: size }}>
        <DotLottieReact
          src="/icons/Loader-animation.lottie"
          loop
          autoplay
        />
      </div>
      <div className="mt-4 text-center space-y-2">
        <p className="text-base font-semibold text-gray-800">
          {message}
        </p>
        {subMessage && (
          <p className="text-[13px] text-gray-500 whitespace-pre-line leading-snug">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  )
}

