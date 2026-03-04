"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/ui/file-upload"
import { showSuccessToast } from "@/lib/toast-utils"

interface InquiryModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean
  /** 모달 닫기 핸들러 */
  onClose: () => void
  /** 문의 제출 핸들러 */
  onSubmit?: (data: InquiryFormData) => void
  /** 초기 이메일 값 */
  defaultEmail?: string
  /** 문의 유형 옵션 */
  inquiryTypes?: InquiryTypeOption[]
  /** 모달 제목 */
  title?: string
  /** 모달 설명 */
  description?: string
  /** 성공 토스트 메시지 */
  successMessage?: string
  /** 파일 업로드 허용 여부 */
  allowFileUpload?: boolean
  /** 파일 업로드 설정 */
  fileUploadConfig?: FileUploadConfig
  /** 모달 최대 너비 */
  maxWidth?: string
}

interface InquiryTypeOption {
  value: string
  label: string
}

interface FileUploadConfig {
  accept?: string
  maxSizeMB?: number
  mainText?: string
  subText?: string
}

export interface InquiryFormData {
  inquiryType: string
  email: string
  title: string
  content: string
  attachedFiles: File[]
}

const defaultInquiryTypes: InquiryTypeOption[] = [
  { value: "서비스 이용", label: "서비스 이용" },
  { value: "결제/환불", label: "결제/환불" },
  { value: "기술 지원", label: "기술 지원" },
  { value: "기타", label: "기타" },
]

export function InquiryModal({
  isOpen,
  onClose,
  onSubmit,
  defaultEmail = "",
  inquiryTypes = defaultInquiryTypes,
  title = "1:1 문의하기",
  description = "문의 내용을 작성해주시면 빠르게 답변드리겠습니다.",
  successMessage = "문의하기 등록완료",
  allowFileUpload = true,
  fileUploadConfig = {
    accept: ".jpg,.jpeg,.png,.gif,.webp",
    maxSizeMB: 10,
    mainText: "이미지를 업로드하세요",
    subText: "JPG, PNG, GIF 파일만 업로드 가능합니다 (최대 10MB)",
  },
  maxWidth = "max-w-[calc(100%-2rem)] sm:max-w-[512px]",
}: InquiryModalProps) {
  const [inquiryType, setInquiryType] = useState("")
  const [email, setEmail] = useState(defaultEmail)
  const [inquiryTitle, setInquiryTitle] = useState("")
  const [content, setContent] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])

  const handleSubmit = () => {
    const formData: InquiryFormData = {
      inquiryType,
      email,
      title: inquiryTitle,
      content,
      attachedFiles,
    }

    if (onSubmit) {
      onSubmit(formData)
    } else {
      console.log("문의 제출:", formData)
    }

    showSuccessToast(successMessage)
    handleClose()
  }

  const handleClose = () => {
    // 폼 초기화
    setInquiryType("")
    setEmail(defaultEmail)
    setInquiryTitle("")
    setContent("")
    setAttachedFiles([])
    onClose()
  }

  const isFormValid = inquiryType && email && inquiryTitle && content

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`${maxWidth} flex flex-col max-h-[90vh] p-0`}>
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b">
          <DialogTitle className="text-lg sm:text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription className="text-sm">{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto flex-1">
          {/* 문의 유형 */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="inquiryType" className="text-sm sm:text-base">
              문의 유형 <span className="text-red-500">*</span>
            </Label>
            <Select value={inquiryType} onValueChange={setInquiryType}>
              <SelectTrigger id="inquiryType" className="w-full shadow-none text-sm sm:text-base">
                <SelectValue placeholder="문의 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquiryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 이메일 */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">
              이메일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              className="shadow-none text-sm sm:text-base"
            />
          </div>

          {/* 제목 */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="title" className="text-sm sm:text-base">
              제목 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={inquiryTitle}
              onChange={(e) => setInquiryTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="shadow-none text-sm sm:text-base"
            />
          </div>

          {/* 내용 */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="content" className="text-sm sm:text-base">
              내용 <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="문의 내용을 상세히 입력해주세요"
              rows={4}
              className="resize-none text-sm sm:text-base min-h-[100px] sm:min-h-[120px] shadow-none"
            />
          </div>

          {/* 파일 첨부 */}
          {allowFileUpload && (
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-sm sm:text-base">사진 첨부</Label>
              <FileUpload
                accept={fileUploadConfig.accept}
                multiple={true}
                maxSizeMB={fileUploadConfig.maxSizeMB}
                mainText={fileUploadConfig.mainText}
                subText={fileUploadConfig.subText}
                onChange={setAttachedFiles}
                showFileList={true}
              />
            </div>
          )}
        </div>

        <div className="flex flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t bg-white">
          <Button
            variant="outline"
            onClick={handleClose}
            className="w-auto h-10 sm:h-11 text-sm sm:text-base"
          >
            취소
          </Button>
          <Button
            className="bg-black hover:bg-black/90 text-white w-auto h-10 sm:h-11 text-sm sm:text-base"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            문의하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

