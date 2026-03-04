"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, X, Hand } from "lucide-react"

interface ScrollHintToastProps {
  show?: boolean
  autoHideDuration?: number
  onClose?: () => void
  text?: string
}

/**
 * 좌우 스크롤 안내 토스트 컴포넌트
 * 
 * 사용자에게 수평 스크롤 가능함을 알려주는 공통 토스트 컴포넌트
 * 
 * @param show - 토스트 표시 여부 (기본값: true)
 * @param autoHideDuration - 자동 숨김 시간 (기본값: 3000ms)
 * @param onClose - 토스트 닫기 콜백
 * @param text - 안내 텍스트 (기본값: "좌우로 스크롤 하세요")
 * 
 * @example
 * // 기본 사용
 * <ScrollHintToast show={showToast} onClose={() => setShowToast(false)} />
 * 
 * // 커스텀 텍스트
 * <ScrollHintToast 
 *   show={showToast} 
 *   text="좌우로 드래그하세요"
 *   autoHideDuration={5000}
 * />
 */
export function ScrollHintToast({
  show = true,
  autoHideDuration = 3000,
  onClose,
  text = "좌우로 스크롤 하세요"
}: ScrollHintToastProps) {
  const [isVisible, setIsVisible] = useState(show)

  useEffect(() => {
    setIsVisible(show)
  }, [show])

  useEffect(() => {
    if (isVisible && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, autoHideDuration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, autoHideDuration, onClose])

  if (!isVisible) return null

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 animate-in fade-in duration-500">
      <div className="bg-gray-700 bg-opacity-90 rounded-xl px-4 py-3 flex flex-col items-center gap-2 shadow-lg">
        {/* 좌우 화살표와 손가락 아이콘 */}
        <div className="relative flex items-center justify-center">
          <ArrowLeft className="h-5 w-5 text-green-400" />
          <Hand className="h-7 w-7 text-white mx-2 cursor-pointer" />
          <ArrowRight className="h-5 w-5 text-green-400" />
        </div>
        
        {/* 안내 텍스트 */}
        <div className="text-center">
          <p className="text-white text-xs font-medium">{text}</p>
        </div>
        
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 text-gray-400 hover:text-white"
          aria-label="닫기"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
