"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface EventPopupProps {
  /** 팝업 오픈 상태 */
  isOpen: boolean
  /** 팝업 닫기 핸들러 */
  onClose: () => void
  /** 팝업 고유 ID (로컬스토리지 키로 사용) */
  popupId: string
  /** 상단 텍스트 (선택사항) */
  topText?: string
  /** 메인 타이틀 (선택사항, 빈 문자열이면 타이틀 영역 숨김) */
  title?: string
  /** 서브 타이틀 (선택사항) */
  subtitle?: string
  /** 배경 이미지 URL (선택사항, <img> 태그로 렌더링됨, 클릭 시 onButtonClick 실행) */
  backgroundImage?: string
  /** 배경 색상 (기본: 다크 그라데이션, backgroundImage가 없을 때만 적용) */
  backgroundColor?: string
  /** 메인 버튼 텍스트 (선택사항, 빈 문자열이면 버튼 숨김) */
  buttonText?: string
  /** 메인 버튼/이미지 클릭 핸들러 */
  onButtonClick: () => void
  /** 버튼 색상 (기본: 파란색) */
  buttonColor?: string
  /** 이미지 하단에 버튼 표시 여부 (기본: false) */
  showImageButton?: boolean
  /** "다시 보지 않기" 기능 사용 여부 (기본: true) */
  showDoNotShowAgain?: boolean
  /** 닫기 버튼 표시 여부 (기본: true) */
  showCloseButton?: boolean
  /** 팝업 너비 (기본: 500px) */
  width?: string
  /** 팝업 높이 (기본: auto) */
  height?: string
  /** 커스텀 컨텐츠 (이미지나 추가 요소) */
  children?: React.ReactNode
}

export default function EventPopup({
  isOpen,
  onClose,
  popupId,
  topText,
  title,
  subtitle,
  backgroundImage,
  backgroundColor = "linear-gradient(180deg, #0A1E3D 0%, #1A3A5C 100%)",
  buttonText,
  onButtonClick,
  buttonColor = "#00A8FF",
  showImageButton = false,
  showDoNotShowAgain = true,
  showCloseButton = true,
  width = "500px",
  height = "auto",
  children,
}: EventPopupProps) {
  const [doNotShowAgain, setDoNotShowAgain] = useState(false)
  const [visible, setVisible] = useState(isOpen)

  useEffect(() => {
    setVisible(isOpen)
  }, [isOpen])

  // 로컬스토리지에서 "다시 보지 않기" 상태 확인
  useEffect(() => {
    if (typeof window !== "undefined") {
      const doNotShow = localStorage.getItem(`event-popup-${popupId}`)
      if (doNotShow === "true") {
        setVisible(false)
      }
    }
  }, [popupId])

  const handleClose = () => {
    if (doNotShowAgain) {
      localStorage.setItem(`event-popup-${popupId}`, "true")
    }
    setVisible(false)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative animate-in fade-in zoom-in-95 duration-300 flex flex-col gap-3"
        style={{
          width: width,
          maxWidth: "90vw",
        }}
      >
        {/* 이미지 + 버튼 영역 (하나처럼 보이는 그룹) */}
        <div className="shadow-2xl overflow-hidden" style={{ borderRadius: '1rem' }}>
          {/* 이미지 영역 */}
          <div
            className="relative w-full"
            style={{
              aspectRatio: "4 / 5",
              maxHeight: "80vh",
            }}
          >
            {backgroundImage ? (
              <img 
                src={backgroundImage} 
                alt="popup" 
                className="w-full h-full object-cover object-center cursor-pointer"
                onClick={onButtonClick}
              />
            ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-8"
              style={{
                background: backgroundColor,
              }}
            >
              {/* 상단 텍스트 */}
              {topText && (
                <div className="text-center mb-4">
                  <p className="text-white/80 text-sm font-medium tracking-wide">{topText}</p>
                </div>
              )}

              {/* 메인 컨텐츠 영역 */}
              <div className="flex-1 flex flex-col items-center justify-center">
                {children}

                {/* 타이틀 */}
                {title && (
                  <div className="text-center mt-6">
                    <h2 className="text-white text-4xl font-bold tracking-tight mb-2">{title}</h2>
                    {subtitle && <p className="text-white/70 text-lg font-medium">{subtitle}</p>}
                  </div>
                )}
              </div>
            </div>
          )}
          </div>

          {/* 바로가기 버튼 (이미지 바로 아래, 여백 없음) */}
          {showImageButton && buttonText && (
            <Button
              onClick={onButtonClick}
              className="w-full h-16 text-white font-semibold text-base rounded-none hover:opacity-90 transition-all duration-200"
              style={{
                backgroundColor: buttonColor,
                border: "none",
                margin: 0,
                borderRadius: 0,
              }}
            >
              {buttonText}
            </Button>
          )}
        </div>

        {/* 하단 컨트롤 영역 (완전 분리) */}
        <div className="px-4 flex items-center justify-between">
          {/* 다시 보지 않기 */}
          {showDoNotShowAgain && (
            <div className="flex items-center gap-2">
              <Checkbox
                id={`doNotShow-${popupId}`}
                checked={doNotShowAgain}
                onCheckedChange={(checked) => setDoNotShowAgain(checked as boolean)}
                className="rounded-full border border-white bg-transparent data-[state=checked]:bg-transparent data-[state=checked]:border-white data-[state=checked]:text-white"
                style={{ borderWidth: '1px' }}
              />
              <label
                htmlFor={`doNotShow-${popupId}`}
                className="text-white text-sm cursor-pointer select-none"
              >
                다시 보지 않기
              </label>
            </div>
          )}

          {/* 닫기 버튼 */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="text-white hover:text-white/80 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              닫기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

