"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import CustomDatePicker from "@/components/ui/custom-datepicker"
import RegisterFormModal from "@/components/ui/register-form-modal"
import RegisterFormField, { RegisterFormFieldStart } from "@/components/ui/register-form-field"

interface PostingData {
  id: number
  blogUrl: string
  client: string
  title: string
  keyword: string
  manager: string
  rank: number
  change: number
  history: any[]
  registeredDate: string
  lastChecked: string
  teamName: string
  category: "신규" | "재작업"
  contractThreshold: number
}

interface EditFormData {
  postingDate: string
  title: string
  category: "신규" | "재작업"
  blogUrl: string
  keyword: string
  memo: string
}

interface PostingEditModalProps {
  isOpen: boolean
  onClose: () => void
  posting: PostingData | null
  editFormData: EditFormData
  onFormDataChange: (data: EditFormData) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function PostingEditModal({
  isOpen,
  onClose,
  posting,
  editFormData,
  onFormDataChange,
  onSubmit
}: PostingEditModalProps) {
  if (!posting) return null

  return (
    <RegisterFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      title="포스팅 수정"
      submitButtonText="수정 완료"
    >
      <RegisterFormField label="포스팅 날짜" required>
        <CustomDatePicker
          selected={editFormData.postingDate ? new Date(editFormData.postingDate) : null}
          onChange={(date) => onFormDataChange({ 
            ...editFormData, 
            postingDate: date ? date.toISOString().split('T')[0] : '' 
          })}
          placeholder="포스팅 날짜를 선택하세요"
          className="h-9 w-full"
          size="compact"
        />
      </RegisterFormField>

      <RegisterFormFieldStart label="제목" required>
        <Input
          type="text"
          placeholder="포스팅 제목을 입력하세요"
          value={editFormData.title}
          onChange={(e) => onFormDataChange({ ...editFormData, title: e.target.value })}
          className="h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500"
        />
      </RegisterFormFieldStart>

      <RegisterFormField label="카테고리" required>
        <Select
          value={editFormData.category}
          onValueChange={(value: "신규" | "재작업") => onFormDataChange({ ...editFormData, category: value })}
        >
          <SelectTrigger className="h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500">
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="신규">신규</SelectItem>
            <SelectItem value="재작업">재작업</SelectItem>
          </SelectContent>
        </Select>
      </RegisterFormField>

      <RegisterFormFieldStart label="블로그 URL" required>
        <Input
          type="url"
          placeholder="https://example.com/blog-post"
          value={editFormData.blogUrl}
          onChange={(e) => onFormDataChange({ ...editFormData, blogUrl: e.target.value })}
          className="h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500"
        />
      </RegisterFormFieldStart>

      <RegisterFormField label="타겟 키워드" required>
        <Input
          type="text"
          placeholder="키워드를 입력하세요"
          value={editFormData.keyword}
          onChange={(e) => onFormDataChange({ ...editFormData, keyword: e.target.value })}
          className="h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500"
        />
      </RegisterFormField>

      <RegisterFormFieldStart label="메모">
        <Textarea
          placeholder="추가 메모사항을 입력하세요"
          value={editFormData.memo}
          onChange={(e) => onFormDataChange({ ...editFormData, memo: e.target.value })}
          rows={3}
          className="w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500"
        />
      </RegisterFormFieldStart>
    </RegisterFormModal>
  )
}
