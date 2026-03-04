import { toast } from "@/hooks/use-toast"

/**
 * 토스트 공통 유틸리티
 * 4가지 타입의 토스트를 쉽게 사용할 수 있는 함수들을 제공합니다.
 */

/**
 * 성공 토스트 표시
 * @param message - 표시할 메시지
 * @example
 * showSuccessToast("저장되었습니다")
 */
export const showSuccessToast = (message: string) => {
  toast({
    variant: "success",
    description: message,
  })
}

/**
 * 오류 토스트 표시
 * @param message - 표시할 오류 메시지
 * @example
 * showErrorToast("저장에 실패했습니다. 다시 시도해주세요.")
 */
export const showErrorToast = (message: string) => {
  toast({
    variant: "error",
    description: message,
  })
}

/**
 * 경고 토스트 표시
 * @param message - 표시할 경고 메시지
 * @example
 * showWarningToast("삭제된 데이터는 복구할 수 없습니다.")
 */
export const showWarningToast = (message: string) => {
  toast({
    variant: "warning",
    description: message,
  })
}

/**
 * 정보 토스트 표시
 * @param message - 표시할 정보 메시지
 * @example
 * showInfoToast("새로운 업데이트가 있습니다.")
 */
export const showInfoToast = (message: string) => {
  toast({
    variant: "info",
    description: message,
  })
}

