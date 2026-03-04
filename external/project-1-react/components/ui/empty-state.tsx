import Image from "next/image"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  /** 표시할 이미지 경로 */
  imageSrc?: string
  /** 이미지 크기 (width, height 동일) */
  imageSize?: number
  /** 메인 제목 텍스트 */
  title: string
  /** 설명 텍스트 (선택사항) */
  description?: string
  /** 컨테이너 높이 */
  height?: string
  /** 추가 CSS 클래스 */
  className?: string
  /** 제목 폰트 크기 */
  titleSize?: "sm" | "base" | "lg" | "xl"
  /** 설명 텍스트 정렬 */
  descriptionAlign?: "left" | "center" | "right"
}

export function EmptyState({
  imageSrc = "/icons/icon-default.png",
  imageSize = 80,
  title,
  description,
  height = "h-[400px]",
  className,
  titleSize = "lg",
  descriptionAlign = "left",
}: EmptyStateProps) {
  const titleSizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  }

  const descriptionAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3 px-4", height, className)}>
      <Image
        src={imageSrc}
        alt={title}
        width={imageSize}
        height={imageSize}
        className="mb-2"
      />
      <p className={cn("font-medium text-gray-900", titleSizeClasses[titleSize])}>
        {title}
      </p>
      {description && (
        <p className={cn("text-sm text-gray-500", descriptionAlignClasses[descriptionAlign])}>
          {description}
        </p>
      )}
    </div>
  )
}

