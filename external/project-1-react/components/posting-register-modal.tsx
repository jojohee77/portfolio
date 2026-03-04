"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import CustomDatePicker from "@/components/ui/custom-datepicker"
import RegisterFormModal from "@/components/ui/register-form-modal"
import RegisterFormSection from "@/components/ui/register-form-section"
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
  registeredDate: string
  lastChecked: string
  teamName: string
  category: "신규" | "재작업"
  contractThreshold: number
}

interface PostingRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  postingData?: PostingData[]
  initialPosting?: PostingData | null
}

export default function PostingRegisterModal({ isOpen, onClose, onSubmit, postingData = [], initialPosting = null }: PostingRegisterModalProps) {
  const [formData, setFormData] = useState({
    contractNumber: "",
    clientName: "",
    serviceType: "",
    teamName: "",
    manager: "",
    startDate: "",
    endDate: "",
    postingDate: null as Date | null,
    title: "",
    keyword: "",
    targetKeyword: "",
    requiredRanking: "",
    category: "신규",
    blogUrl: "",
    memo: "",
    selectedPostingId: "",
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [targetKeywordInput, setTargetKeywordInput] = useState("")
  const [isCustomKeyword, setIsCustomKeyword] = useState(false)
  const [isTargetKeyword, setIsTargetKeyword] = useState(true)

  const resetForm = () => {
    setFormData({
      contractNumber: "",
      clientName: "",
      serviceType: "",
      teamName: "",
      manager: "",
      startDate: "",
      endDate: "",
      postingDate: null,
      title: "",
      keyword: "",
      targetKeyword: "",
      requiredRanking: "",
      category: "신규",
      blogUrl: "",
      memo: "",
      selectedPostingId: "",
    })
    setErrors({})
    setTargetKeywordInput("")
    setIsCustomKeyword(false)
    setIsTargetKeyword(true)
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    // 필수 항목 순차 검사
    if (!formData.contractNumber) {
      newErrors.contractNumber = "계약번호를 선택해주세요"
    }
    const finalTargetKeyword = isCustomKeyword ? targetKeywordInput.trim() : formData.targetKeyword
    if (!finalTargetKeyword) {
      newErrors.targetKeyword = "목표 키워드를 선택하거나 입력해주세요"
    }
    if (!formData.postingDate) {
      newErrors.postingDate = "포스팅 일자를 선택해주세요"
    }
    if (!formData.title.trim()) {
      newErrors.title = "제목을 입력해주세요"
    }
    if (!formData.blogUrl.trim()) {
      newErrors.blogUrl = "블로그 URL을 입력해주세요"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // 목표 키워드 처리: 직접 입력된 경우 사용, 아니면 선택된 값 사용
    const finalTargetKeyword = isCustomKeyword ? targetKeywordInput.trim() : formData.targetKeyword
    
    // 날짜를 문자열로 변환하여 전송
    const submitData = {
      ...formData,
      targetKeyword: finalTargetKeyword,
      isTargetKeyword: isCustomKeyword ? isTargetKeyword : true, // 직접 입력 시에만 체크박스 값 사용, 선택 시는 항상 true
      postingDate: formData.postingDate ? formData.postingDate.toISOString().split('T')[0] : ""
    }
    
    onSubmit(submitData)
    resetForm()
    onClose()
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  // 초기 포스팅 정보로 폼 채우기
  useEffect(() => {
    if (isOpen && initialPosting) {
      const selectedKeyword = initialPosting.keyword
      
      // 계약번호 찾기 (클라이언트명으로 매칭)
      const contractMap: { [key: string]: string } = {
        "스마트테크": "CT-2024-001",
        "패션하우스": "CT-2024-002",
        "그린푸드": "CT-2024-003",
        "헬스케어플러스": "CT-2024-004",
        "에듀테크": "CT-2024-005",
      }
      const matchedContract = contractMap[initialPosting.client]
      
      // 계약번호가 있으면 먼저 설정하여 목표 키워드 목록을 가져옴
      if (matchedContract) {
        handleContractSelect(matchedContract)
      }
      
      // 목표 키워드 목록 확인
      const availableKeywords = matchedContract ? getTargetKeywords(matchedContract) : []
      const isKeywordInList = availableKeywords.includes(selectedKeyword)
      
      // 목표 키워드 설정
      if (isKeywordInList) {
        // 목록에 있으면 선택 모드로
        setIsCustomKeyword(false)
        setTargetKeywordInput("")
        setFormData({
          contractNumber: matchedContract || "",
          clientName: initialPosting.client,
          serviceType: "",
          teamName: initialPosting.teamName,
          manager: initialPosting.manager,
          startDate: "",
          endDate: "",
          postingDate: null,
          title: "",
          keyword: "",
          targetKeyword: selectedKeyword,
          requiredRanking: initialPosting.contractThreshold.toString(),
          category: "재작업",
          blogUrl: "",
          memo: "",
          selectedPostingId: initialPosting.id.toString(),
        })
      } else {
        // 목록에 없으면 직접 입력 모드로
        setIsCustomKeyword(true)
        setTargetKeywordInput(selectedKeyword)
        setFormData({
          contractNumber: matchedContract || "",
          clientName: initialPosting.client,
          serviceType: "",
          teamName: initialPosting.teamName,
          manager: initialPosting.manager,
          startDate: "",
          endDate: "",
          postingDate: null,
          title: "",
          keyword: "",
          targetKeyword: "",
          requiredRanking: initialPosting.contractThreshold.toString(),
          category: "재작업",
          blogUrl: "",
          memo: "",
          selectedPostingId: initialPosting.id.toString(),
        })
      }
    } else if (isOpen && !initialPosting) {
      // 초기 포스팅이 없으면 폼 초기화
      resetForm()
    }
  }, [isOpen, initialPosting])

  const handleContractSelect = (contractNumber: string) => {
    // 계약번호 선택 시 에러 제거
    if (errors.contractNumber) {
      setErrors({ ...errors, contractNumber: "" })
    }
    
    const contractMap: { [key: string]: any } = {
      "CT-2024-001": {
        clientName: "스마트테크",
        serviceType: "SEO 최적화",
        teamName: "디지털마케팅팀",
        manager: "김마케터",
        startDate: "2024-01-15",
        endDate: "2024-06-15",
        requiredRanking: "10",
      },
      "CT-2024-002": {
        clientName: "패션하우스",
        serviceType: "콘텐츠 마케팅",
        teamName: "크리에이티브팀",
        manager: "이디자이너",
        startDate: "2024-01-18",
        endDate: "2024-07-18",
        requiredRanking: "5",
      },
      "CT-2024-003": {
        clientName: "그린푸드",
        serviceType: "브랜드 마케팅",
        teamName: "브랜드팀",
        manager: "박영양사",
        startDate: "2024-01-12",
        endDate: "2024-04-12",
        requiredRanking: "8",
      },
      "CT-2024-004": {
        clientName: "헬스케어플러스",
        serviceType: "웰니스 마케팅",
        teamName: "전략기획팀",
        manager: "최기획자",
        startDate: "2024-01-10",
        endDate: "2024-06-10",
        requiredRanking: "7",
      },
      "CT-2024-005": {
        clientName: "에듀테크",
        serviceType: "교육 콘텐츠",
        teamName: "데이터분석팀",
        manager: "정분석가",
        startDate: "2024-01-08",
        endDate: "2024-05-08",
        requiredRanking: "12",
      },
    }

    const contractData = contractMap[contractNumber] || {}
    setFormData({
      ...formData,
      contractNumber,
      ...contractData,
    })
    // 계약번호 변경 시 직접 입력 모드 초기화
    setIsCustomKeyword(false)
    setTargetKeywordInput("")
    setIsTargetKeyword(true)
  }

  const getTargetKeywords = (contractNumber: string) => {
    const keywordMap: { [key: string]: string[] } = {
      "CT-2024-001": ["온라인쇼핑몰", "이커머스", "쇼핑몰제작"],
      "CT-2024-002": ["브랜딩", "소셜미디어", "인플루언서"],
      "CT-2024-003": ["맛집", "카페", "리뷰"],
      "CT-2024-004": ["스타트업", "사업계획서", "창업"],
      "CT-2024-005": ["온라인교육", "이러닝", "교육콘텐츠"],
    }
    return keywordMap[contractNumber] || []
  }

  return (
    <RegisterFormModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title="새 포스팅 등록"
      submitButtonText="포스팅 등록"
    >
      {/* 기본 정보 */}
      <RegisterFormSection title="기본 정보">
              
        <RegisterFormFieldStart label="계약번호" required error={errors.contractNumber}>
          <Select value={formData.contractNumber} onValueChange={handleContractSelect}>
            <SelectTrigger className={`h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500 ${errors.contractNumber ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="계약번호 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CT-2024-001">CT-2024-001 - 스마트테크</SelectItem>
              <SelectItem value="CT-2024-002">CT-2024-002 - 패션하우스</SelectItem>
              <SelectItem value="CT-2024-003">CT-2024-003 - 그린푸드</SelectItem>
              <SelectItem value="CT-2024-004">CT-2024-004 - 헬스케어플러스</SelectItem>
              <SelectItem value="CT-2024-005">CT-2024-005 - 에듀테크</SelectItem>
            </SelectContent>
          </Select>
        </RegisterFormFieldStart>

        <RegisterFormField label="계약 회사명">
          <Input
            id="clientName"
            value={formData.clientName}
            readOnly
            className="h-9 w-full bg-gray-50 text-xs sm:text-sm text-gray-600 border-gray-300"
            placeholder="계약번호 선택 시 자동 입력"
          />
        </RegisterFormField>

        <RegisterFormField label="서비스 유형">
          <Input
            id="serviceType"
            value={formData.serviceType}
            readOnly
            className="h-9 w-full bg-gray-50 text-xs sm:text-sm text-gray-600 border-gray-300"
            placeholder="계약번호 선택 시 자동 입력"
          />
        </RegisterFormField>

        <RegisterFormField label="팀명">
          <Input
            id="teamName"
            value={formData.teamName}
            readOnly
            className="h-9 w-full bg-gray-50 text-xs sm:text-sm text-gray-600 border-gray-300"
            placeholder="계약번호 선택 시 자동 입력"
          />
        </RegisterFormField>

        <RegisterFormField label="담당자">
          <Input
            id="manager"
            value={formData.manager}
            readOnly
            className="h-9 w-full bg-gray-50 text-xs sm:text-sm text-gray-600 border-gray-300"
            placeholder="계약번호 선택 시 자동 입력"
          />
        </RegisterFormField>

        <RegisterFormField label="계약기간">
          <Input
            id="contractPeriod"
            value={formData.startDate && formData.endDate ? 
              `${formData.startDate.replace(/-/g, '.')} - ${formData.endDate.replace(/-/g, '.')}` : 
              ''
            }
            readOnly
            className="h-9 w-full bg-gray-50 text-xs sm:text-sm text-gray-600 border-gray-300"
            placeholder="계약번호 선택 시 자동 입력"
          />
        </RegisterFormField>
      </RegisterFormSection>

      {/* 키워드 및 순위 정보 */}
      <RegisterFormSection title="키워드 및 순위 정보">
        <RegisterFormFieldStart label="목표 키워드" required error={errors.targetKeyword}>
          <div className="space-y-2">
            {!isCustomKeyword ? (
              <Select 
                value={formData.targetKeyword} 
                onValueChange={(value) => {
                  if (value === "__custom__") {
                    setIsCustomKeyword(true)
                    setFormData({ ...formData, targetKeyword: "" })
                  } else {
                    setFormData({ ...formData, targetKeyword: value })
                    setTargetKeywordInput("")
                    // 목표 키워드 선택 시 에러 제거
                    if (errors.targetKeyword) {
                      setErrors({ ...errors, targetKeyword: "" })
                    }
                  }
                }}
                disabled={!formData.contractNumber}
              >
                <SelectTrigger className={`h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500 ${errors.targetKeyword ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="목표 키워드 선택" />
                </SelectTrigger>
                <SelectContent>
                  {getTargetKeywords(formData.contractNumber).map((keyword) => (
                    <SelectItem key={keyword} value={keyword}>
                      {keyword}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom__">직접 입력</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <>
                <Input
                  value={targetKeywordInput}
                  onChange={(e) => {
                    setTargetKeywordInput(e.target.value)
                    // 직접 입력 시 에러 제거
                    if (errors.targetKeyword && e.target.value.trim()) {
                      setErrors({ ...errors, targetKeyword: "" })
                    }
                  }}
                  placeholder="목표 키워드를 직접 입력하세요"
                  className={`h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500 ${errors.targetKeyword ? 'border-red-500' : ''}`}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isTargetKeyword"
                    checked={isTargetKeyword}
                    onCheckedChange={(checked) => setIsTargetKeyword(checked === true)}
                  />
                  <Label
                    htmlFor="isTargetKeyword"
                    className="text-xs sm:text-sm font-normal cursor-pointer"
                  >
                    타겟 키워드
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomKeyword(false)
                    setTargetKeywordInput("")
                    setFormData({ ...formData, targetKeyword: "" })
                    setIsTargetKeyword(true)
                  }}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  선택 목록으로 돌아가기
                </button>
              </>
            )}
          </div>
          {!formData.contractNumber && (
            <p className="text-xs text-gray-500 mt-1">계약번호를 먼저 선택하세요</p>
          )}
        </RegisterFormFieldStart>

        <RegisterFormField 
          label="노출보장 순위"
        >
          <Input
            id="requiredRanking"
            type="number"
            value={formData.requiredRanking}
            onChange={(e) => setFormData({ ...formData, requiredRanking: e.target.value })}
            className="h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            placeholder="노출 순위를 입력하세요"
          />
          <p className="text-xs text-gray-500 mt-1">이 순위보다 낮으면 재작업이 필요합니다 (계약번호 선택 시 자동 입력되지만 수정 가능합니다)</p>
        </RegisterFormField>
      </RegisterFormSection>

      {/* 포스팅 정보 */}
      <RegisterFormSection title="포스팅 정보">
        <RegisterFormField label="포스팅 일자" required error={errors.postingDate}>
          <CustomDatePicker
            selected={formData.postingDate}
            onChange={(date) => {
              setFormData({ ...formData, postingDate: date })
              if (errors.postingDate && date) {
                setErrors({ ...errors, postingDate: "" })
              }
            }}
            placeholder="포스팅 일자를 선택하세요"
            className={`h-9 w-full ${errors.postingDate ? 'border-red-500' : ''}`}
            size="compact"
          />
        </RegisterFormField>

        <RegisterFormField label="구분">
          <Select 
            value={formData.category} 
            onValueChange={(value: "신규" | "재작업") => {
              setFormData({ 
                ...formData, 
                category: value,
                selectedPostingId: value === "신규" ? "" : formData.selectedPostingId
              })
            }}
          >
            <SelectTrigger className="h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500">
              <SelectValue placeholder="구분 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="신규">신규</SelectItem>
              <SelectItem value="재작업">재작업</SelectItem>
            </SelectContent>
          </Select>
        </RegisterFormField>

        {formData.category === "재작업" && (
          <RegisterFormField label="기존 포스팅 선택">
            <Select 
              value={formData.selectedPostingId} 
              onValueChange={(value) => {
                const selectedPosting = postingData.find(p => p.id.toString() === value)
                if (selectedPosting) {
                  const selectedKeyword = selectedPosting.keyword
                  
                  // 계약번호 찾기 (클라이언트명으로 매칭)
                  const contractMap: { [key: string]: string } = {
                    "스마트테크": "CT-2024-001",
                    "패션하우스": "CT-2024-002",
                    "그린푸드": "CT-2024-003",
                    "헬스케어플러스": "CT-2024-004",
                    "에듀테크": "CT-2024-005",
                  }
                  const matchedContract = contractMap[selectedPosting.client]
                  
                  // 계약번호가 있으면 먼저 설정하여 목표 키워드 목록을 가져옴
                  if (matchedContract) {
                    handleContractSelect(matchedContract)
                  }
                  
                  // 목표 키워드 목록 확인
                  const availableKeywords = matchedContract ? getTargetKeywords(matchedContract) : []
                  const isKeywordInList = availableKeywords.includes(selectedKeyword)
                  
                  // 목표 키워드 설정
                  if (isKeywordInList) {
                    // 목록에 있으면 선택 모드로
                    setIsCustomKeyword(false)
                    setTargetKeywordInput("")
                    setFormData({
                      ...formData,
                      selectedPostingId: value,
                      contractNumber: matchedContract || formData.contractNumber,
                      targetKeyword: selectedKeyword,
                      clientName: selectedPosting.client,
                      teamName: selectedPosting.teamName,
                      manager: selectedPosting.manager,
                      requiredRanking: selectedPosting.contractThreshold.toString(),
                      postingDate: selectedPosting.registeredDate ? new Date(selectedPosting.registeredDate) : null,
                    })
                  } else {
                    // 목록에 없으면 직접 입력 모드로
                    setIsCustomKeyword(true)
                    setTargetKeywordInput(selectedKeyword)
                    setFormData({
                      ...formData,
                      selectedPostingId: value,
                      contractNumber: matchedContract || formData.contractNumber,
                      targetKeyword: "",
                      clientName: selectedPosting.client,
                      teamName: selectedPosting.teamName,
                      manager: selectedPosting.manager,
                      requiredRanking: selectedPosting.contractThreshold.toString(),
                      postingDate: selectedPosting.registeredDate ? new Date(selectedPosting.registeredDate) : null,
                    })
                  }
                }
              }}
            >
              <SelectTrigger className="h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500">
                <SelectValue placeholder="기존 포스팅을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {postingData.map((posting) => (
                  <SelectItem key={posting.id} value={posting.id.toString()}>
                    #{posting.id.toString().padStart(3, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">재작업할 기존 포스팅을 선택하면 정보가 자동으로 입력됩니다</p>
          </RegisterFormField>
        )}

        <RegisterFormFieldStart label="제목" required error={errors.title}>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value })
              if (errors.title && e.target.value.trim()) {
                setErrors({ ...errors, title: "" })
              }
            }}
            className={`h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500 ${errors.title ? 'border-red-500' : ''}`}
            placeholder="포스팅 제목을 입력하세요"
          />
        </RegisterFormFieldStart>

        <RegisterFormFieldStart label="블로그 URL" required error={errors.blogUrl}>
          <Input
            id="blogUrl"
            type="url"
            value={formData.blogUrl}
            onChange={(e) => {
              setFormData({ ...formData, blogUrl: e.target.value })
              if (errors.blogUrl && e.target.value.trim()) {
                setErrors({ ...errors, blogUrl: "" })
              }
            }}
            className={`h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500 ${errors.blogUrl ? 'border-red-500' : ''}`}
            placeholder="https://example.com/blog-post"
          />
        </RegisterFormFieldStart>

        <RegisterFormFieldStart label="메모">
          <Textarea
            id="memo"
            value={formData.memo}
            onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
            rows={3}
            className="w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500"
            placeholder="추가 정보나 메모를 입력하세요"
          />
        </RegisterFormFieldStart>
      </RegisterFormSection>
    </RegisterFormModal>
  )
}