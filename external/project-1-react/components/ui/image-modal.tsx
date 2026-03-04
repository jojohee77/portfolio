"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageModalProps {
  /** 이미지 소스 */
  src: string
  /** 이미지 alt 텍스트 */
  alt: string
  /** 썸네일 이미지 너비 */
  thumbnailWidth?: number
  /** 썸네일 이미지 높이 */
  thumbnailHeight?: number
  /** 썸네일 추가 CSS 클래스 */
  thumbnailClassName?: string
  /** 확대 이미지 최대 너비 (모바일) */
  modalMaxWidth?: string
  /** 확대 이미지 너비 */
  modalWidth?: number
  /** 확대 이미지 높이 */
  modalHeight?: number
  /** 컨테이너 추가 CSS 클래스 */
  containerClassName?: string
}

export function ImageModal({
  src,
  alt,
  thumbnailWidth = 250,
  thumbnailHeight = 250,
  thumbnailClassName,
  modalMaxWidth = "max-w-[90vw] sm:max-w-[500px]",
  modalWidth = 500,
  modalHeight = 400,
  containerClassName,
}: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 썸네일 이미지 */}
      <div
        className={cn(
          "relative rounded-lg overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity",
          containerClassName
        )}
        style={{ width: thumbnailWidth, height: thumbnailHeight }}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-cover", thumbnailClassName)}
        />
      </div>

      {/* 확대 모달 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn(
            "p-0 border-0 bg-transparent shadow-none gap-0",
            modalMaxWidth
          )}
          showCloseButton={false}
        >
          <div className={cn("relative w-full mx-auto rounded-lg overflow-hidden", modalMaxWidth)}>
            <Image
              src={src}
              alt={alt}
              width={modalWidth}
              height={modalHeight}
              className="w-full h-auto object-contain max-h-[90vh]"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 z-50 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-colors focus:outline-none"
              aria-label="닫기"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface ImageGalleryProps {
  /** 이미지 배열 */
  images: string[]
  /** 이미지 alt 텍스트 (선택사항, 기본값은 "이미지 {index}") */
  alts?: string[]
  /** 썸네일 이미지 너비 */
  thumbnailWidth?: number
  /** 썸네일 이미지 높이 */
  thumbnailHeight?: number
  /** 갤러리 컨테이너 CSS 클래스 */
  containerClassName?: string
  /** 썸네일 추가 CSS 클래스 */
  thumbnailClassName?: string
  /** 확대 이미지 최대 너비 (모바일) */
  modalMaxWidth?: string
}

export function ImageGallery({
  images,
  alts,
  thumbnailWidth = 250,
  thumbnailHeight = 250,
  containerClassName = "flex flex-wrap gap-3",
  thumbnailClassName,
  modalMaxWidth = "max-w-[90vw] sm:max-w-[500px]",
}: ImageGalleryProps) {
  return (
    <div className={containerClassName}>
      {images.map((image, index) => (
        <ImageModal
          key={index}
          src={image}
          alt={alts?.[index] || `이미지 ${index + 1}`}
          thumbnailWidth={thumbnailWidth}
          thumbnailHeight={thumbnailHeight}
          thumbnailClassName={thumbnailClassName}
          modalMaxWidth={modalMaxWidth}
        />
      ))}
    </div>
  )
}

