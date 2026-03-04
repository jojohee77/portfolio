"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import CustomDatePicker from "@/components/ui/custom-datepicker"
import { StepIndicator, Step } from "@/components/ui/step-indicator"
import { StepNavigation } from "@/components/ui/step-navigation"
import { FileUpload } from "@/components/ui/file-upload"
import LoadingBar from "@/components/ui/loading-bar"
import { showSuccessToast } from "@/lib/toast-utils"
import { Plus, Trash2 } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ContractRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: ContractFormData, type: 'draft' | 'submit') => void
  mode?: 'create' | 'edit'
  initialData?: Partial<ContractFormData>
  contractId?: string
}

export interface ContractFormData {
  contractStatus: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  region: string
  regionDetail: string
  address: string
  detailAddress: string
  contractType: string
  contractProduct: "select" | "manual"
  operationTeam: string
  salesPerson: string
  monthlyAdCost: string
  postingCount: string
  startDate: string
  endDate: string
  memo: string
  products?: any
}

interface ProductSet {
  id: number
  productOption: string
  productAmount: string
  department: string
  manager: string
}

interface SubProduct {
  id: number
  name: string
  amount: string
  department: string
  manager: string
}

interface ManualProductSet {
  id: number
  mainProductName: string
  mainProductAmount: string
  subProducts: SubProduct[]
}

export default function ContractRegisterModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode = 'create',
  initialData,
  contractId 
}: ContractRegisterModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState<ContractFormData>({
    contractStatus: "",
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    region: "",
    regionDetail: "",
    address: "",
    detailAddress: "",
    contractType: "",
    contractProduct: "select",
    operationTeam: "",
    salesPerson: "",
    monthlyAdCost: "",
    postingCount: "",
    startDate: "",
    endDate: "",
    memo: "",
  })

  // 초기 데이터 로드 (편집 모드)
  useEffect(() => {
    if (mode === 'edit' && initialData && isOpen) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        phone: initialData.phone !== undefined ? sanitizePhoneNumber(initialData.phone) : prev.phone,
        // 계약상태가 없으면 기본값으로 '신규' 설정
        contractStatus: initialData.contractStatus || '신규'
      }))

      // 날짜 설정
      if (initialData.startDate) {
        setRegisterStartDate(new Date(initialData.startDate))
      }
      if (initialData.endDate) {
        setRegisterEndDate(new Date(initialData.endDate))
      }

      // 상품 데이터 설정 (있다면)
      if (initialData.products) {
        if (initialData.contractProduct === 'select') {
          setProductSets(initialData.products)
        } else if (initialData.contractProduct === 'manual') {
          setManualProductSets(initialData.products)
        }
      }
    }
  }, [mode, initialData, isOpen])

  // 상품 세트 배열 상태 (선택형)
  const [productSets, setProductSets] = useState<ProductSet[]>([
    {
      id: 1,
      productOption: "",
      productAmount: "",
      department: "none",
      manager: "none",
    }
  ])

  // 직접입력형 상품 세트 배열 상태
  const [manualProductSets, setManualProductSets] = useState<ManualProductSet[]>([
    {
      id: 1,
      mainProductName: "",
      mainProductAmount: "",
      subProducts: [
        { id: 1, name: "", amount: "", department: "none", manager: "none" }
      ],
    }
  ])

  // 날짜 상태 (DatePicker용)
  const [registerStartDate, setRegisterStartDate] = useState<Date | null>(null)
  const [registerEndDate, setRegisterEndDate] = useState<Date | null>(null)

  // 임시저장 목록 모달 상태
  const [draftListOpen, setDraftListOpen] = useState(false)
  const [isLoadingDraft, setIsLoadingDraft] = useState(false)
  
  // 불러오기 목록 모달 상태
  const [loadListOpen, setLoadListOpen] = useState(false)
  const [isLoadingLoad, setIsLoadingLoad] = useState(false)
  const [contractSearchTerm, setContractSearchTerm] = useState("")

  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [touched, setTouched] = useState<{[key: string]: boolean}>({})

  // 임시저장 데이터 샘플
  const draftList = [
    {
      id: "CT-2025-001",
      companyName: "테크 솔루션",
      savedAt: "2025.08.31 22:29"
    }
  ]

  // 불러오기용 계약 목록 데이터
  const contractList = [
    {
      id: "CT-2025-001",
      customer: {
        company: "Smart Tech",
        contact: "김대표"
      },
      services: ["SEO", "프리미엄"]
    },
    {
      id: "CT-2025-002",
      customer: {
        company: "Green Food",
        contact: "이영희"
      },
      services: ["SEO"]
    },
    {
      id: "CT-2025-003",
      customer: {
        company: "Fashion House",
        contact: "정민수"
      },
      services: ["SEO", "프리미엄", "하니탑"]
    }
  ]

  // 필터링된 계약 목록
  const filteredContractList = contractList.filter(contract => 
    contractSearchTerm === "" || 
    contract.id.toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
    contract.customer.company.toLowerCase().includes(contractSearchTerm.toLowerCase()) ||
    contract.customer.contact.toLowerCase().includes(contractSearchTerm.toLowerCase())
  )

  // 임시저장 불러오기 핸들러
  const handleLoadDraft = async (draftId: string) => {
    setIsLoadingDraft(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // 로딩 시뮬레이션
      
      // 임시저장 목업 데이터
      const mockDraftData: Partial<ContractFormData> = {
        companyName: "테크 솔루션",
        contactPerson: "김대표",
        email: "kim@techsolution.com",
        phone: "010-1234-5678",
        address: "서울시 강남구 테헤란로 123",
        detailAddress: "5층 501호",
        region: "서울",
        regionDetail: "강남구",
        contractStatus: "신규",
        contractType: "monthly",
        contractProduct: "select" as const,
        operationTeam: "operation1",
        salesPerson: "sales1",
        monthlyAdCost: "₩1,000,000",
        postingCount: "20",
        startDate: "2025-01-01",
        endDate: "2025-12-31",
        memo: "임시저장된 계약 데이터입니다.",
      }
      
      // 폼 데이터 설정
      setFormData(prev => ({
        ...prev,
        ...mockDraftData,
        phone: mockDraftData.phone ? sanitizePhoneNumber(mockDraftData.phone) : prev.phone,
      }) as ContractFormData)
      
      // 상품 데이터 설정
      const newProductSets = [
        {
          id: 1,
          productOption: "seo",
          productAmount: "₩3,000,000",
          department: "marketing",
          manager: "manager1",
        },
        {
          id: 2,
          productOption: "premium",
          productAmount: "₩2,500,000",
          department: "sales",
          manager: "manager2",
        }
      ]
      
      console.log('임시저장 불러오기 - 상품 데이터:', newProductSets)
      setProductSets(newProductSets)
      
      setDraftListOpen(false)
      showSuccessToast("임시저장 데이터를 불러왔습니다")
    } catch (error) {
      console.error('임시저장 불러오기 실패:', error)
      showSuccessToast("불러오기에 실패했습니다")
    } finally {
      setIsLoadingDraft(false)
    }
  }
  
  // 계약 불러오기 핸들러
  const handleLoadContract = async (contractId: string) => {
    setIsLoadingLoad(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)) // 로딩 시뮬레이션
      
      // 선택한 계약 찾기
      const selectedContract = contractList.find(c => c.id === contractId)
      
      if (selectedContract) {
        // 계약 목업 데이터
        const mockContractData: Partial<ContractFormData> = {
          companyName: selectedContract.customer.company,
          contactPerson: selectedContract.customer.contact,
          email: `${selectedContract.customer.contact.toLowerCase()}@${selectedContract.customer.company.toLowerCase().replace(/\s/g, '')}.com`,
          phone: "010-1234-5678",
          address: "서울시 강남구 테헤란로 456",
          detailAddress: "10층 1001호",
          region: "서울",
          regionDetail: "강남구",
          contractStatus: "신규",
          contractType: "monthly",
          contractProduct: "select" as const,
          operationTeam: "operation1",
          salesPerson: "sales1",
          monthlyAdCost: "₩1,500,000",
          postingCount: "25",
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          memo: `${selectedContract.customer.company} 계약 데이터입니다.`,
        }
        
        // 폼 데이터 설정
        setFormData(prev => ({
          ...prev,
          ...mockContractData,
          phone: mockContractData.phone ? sanitizePhoneNumber(mockContractData.phone) : prev.phone,
        }) as ContractFormData)
        
        // 서비스에 따른 상품 데이터 설정
        const departments = ["marketing", "sales", "operation", "dev"]
        const managers = ["manager1", "manager2", "manager3"]
        const productData = selectedContract.services.map((service, index) => ({
          id: index + 1,
          productOption: service.toLowerCase(),
          productAmount: "₩2,000,000",
          department: departments[index % departments.length],
          manager: managers[index % managers.length],
        }))
        
        console.log('계약 불러오기 - 상품 데이터:', productData)
        setProductSets(productData)
        
        setLoadListOpen(false)
        showSuccessToast(`${selectedContract.customer.company} 계약을 불러왔습니다`)
      }
    } catch (error) {
      console.error('계약 불러오기 실패:', error)
      showSuccessToast("불러오기에 실패했습니다")
    } finally {
      setIsLoadingLoad(false)
    }
  }

  // 등록 폼 핸들러들
  const handleAddProductSet = () => {
    const newId = Math.max(...productSets.map(s => s.id)) + 1
    setProductSets([...productSets, {
      id: newId,
      productOption: "",
      productAmount: "",
      department: "none",
      manager: "none",
    }])
  }

  const handleRemoveProductSet = (id: number) => {
    if (productSets.length > 1) {
      setProductSets(productSets.filter(set => set.id !== id))
    }
  }

  const handleProductSetChange = (id: number, field: string, value: string) => {
    setProductSets(productSets.map(set => 
      set.id === id ? { ...set, [field]: value } : set
    ))
  }

  const handleAddManualProductSet = () => {
    const newId = Math.max(...manualProductSets.map(s => s.id)) + 1
    setManualProductSets([...manualProductSets, {
      id: newId,
      mainProductName: "",
      mainProductAmount: "",
      subProducts: [{ id: 1, name: "", amount: "", department: "none", manager: "none" }],
    }])
  }

  const handleRemoveManualProductSet = (id: number) => {
    if (manualProductSets.length > 1) {
      setManualProductSets(manualProductSets.filter(set => set.id !== id))
    }
  }

  const handleManualProductSetChange = (id: number, field: string, value: string) => {
    setManualProductSets(manualProductSets.map(set => 
      set.id === id ? { ...set, [field]: value } : set
    ))
  }

  const handleAddSubProduct = (setId: number) => {
    setManualProductSets(manualProductSets.map(set => {
      if (set.id === setId) {
        const newSubId = Math.max(...set.subProducts.map(s => s.id)) + 1
        return {
          ...set,
          subProducts: [...set.subProducts, { id: newSubId, name: "", amount: "", department: "none", manager: "none" }]
        }
      }
      return set
    }))
  }

  const handleRemoveSubProduct = (setId: number, subId: number) => {
    setManualProductSets(manualProductSets.map(set => {
      if (set.id === setId && set.subProducts.length > 1) {
        return {
          ...set,
          subProducts: set.subProducts.filter(sub => sub.id !== subId)
        }
      }
      return set
    }))
  }

  const handleSubProductChange = (setId: number, subId: number, field: string, value: string) => {
    setManualProductSets(manualProductSets.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          subProducts: set.subProducts.map(sub =>
            sub.id === subId ? { ...sub, [field]: value } : sub
          )
        }
      }
      return set
    }))
  }

const sanitizePhoneNumber = (value: string) => value.replace(/[^\d]/g, '')

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    return numbers ? `₩${parseInt(numbers).toLocaleString()}` : ''
  }

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value
    
    if (field === 'phone') {
      formattedValue = sanitizePhoneNumber(value)
    } else if (['monthlyAdCost'].includes(field)) {
      formattedValue = formatCurrency(value)
    }
    
    if (field === 'contractProduct') {
      if (value === 'select') {
        setProductSets([{
          id: 1,
          productOption: "",
          productAmount: "",
          department: "none",
          manager: "none",
        }])
      } else if (value === 'manual') {
        setManualProductSets([{
          id: 1,
          mainProductName: "",
          mainProductAmount: "",
          subProducts: [{ id: 1, name: "", amount: "", department: "none", manager: "none" }],
        }])
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }))
  }

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setRegisterStartDate(start)
    setRegisterEndDate(end)
    
    const updates: { startDate?: string; endDate?: string } = {}
    
    if (start) {
      updates.startDate = start.toISOString().split('T')[0]
    }
    if (end) {
      updates.endDate = end.toISOString().split('T')[0]
    }
    
    setFormData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleAddressSearch = () => {
    if (typeof window !== 'undefined' && (window as any).daum) {
      new (window as any).daum.Postcode({
        oncomplete: function(data: any) {
          setFormData(prev => ({
            ...prev,
            region: data.sido,
            regionDetail: data.sigungu,
            address: data.address
          }))
        }
      }).open()
    }
  }

  const handleFileUpload = (files: File[]) => {
    console.log('업로드된 파일:', files)
    // TODO: 파일 업로드 처리 로직
  }

  // 유효성 검사 함수
  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {}
    
    if (step === 1) {
      if (!formData.contractStatus) {
        newErrors.contractStatus = "계약상태를 선택해주세요"
      }
      if (!formData.companyName.trim()) {
        newErrors.companyName = "회사명을 입력해주세요"
      }
      if (!formData.contactPerson.trim()) {
        newErrors.contactPerson = "계약자명을 입력해주세요"
      }
      if (!formData.email.trim()) {
        newErrors.email = "이메일을 입력해주세요"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "올바른 이메일 형식이 아닙니다"
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "전화번호를 입력해주세요"
      } else if (!/^\d+$/.test(formData.phone)) {
        newErrors.phone = "전화번호는 숫자만 입력해주세요"
      }
      if (!formData.address.trim()) {
        newErrors.address = "사업장 주소를 입력해주세요"
      }
    } else if (step === 2) {
      if (!formData.contractType) {
        newErrors.contractType = "계약 유형을 선택해주세요"
      }
      if (!formData.salesPerson) {
        newErrors.salesPerson = "영업자를 선택해주세요"
      }
      if (!formData.monthlyAdCost) {
        newErrors.monthlyAdCost = "월 광고비를 입력해주세요"
      }
      if (!formData.postingCount) {
        newErrors.postingCount = "포스팅 건수를 입력해주세요"
      }
      if (!formData.startDate || !formData.endDate) {
        newErrors.contractPeriod = "계약 기간을 선택해주세요"
      }
    } else if (step === 3) {
      if (formData.contractProduct === 'select') {
        productSets.forEach((set, index) => {
          if (!set.productOption) {
            newErrors[`product_${set.id}_option`] = "상품을 선택해주세요"
          }
          if (!set.productAmount) {
            newErrors[`product_${set.id}_amount`] = "상품금액을 입력해주세요"
          }
        })
      } else if (formData.contractProduct === 'manual') {
        manualProductSets.forEach((set, index) => {
          if (!set.mainProductName.trim()) {
            newErrors[`manual_${set.id}_name`] = "대표상품명을 입력해주세요"
          }
          if (!set.mainProductAmount) {
            newErrors[`manual_${set.id}_amount`] = "대표상품 금액을 입력해주세요"
          }
          set.subProducts.forEach((sub, subIndex) => {
            if (!sub.name.trim()) {
              newErrors[`sub_${set.id}_${sub.id}_name`] = "상품명을 입력해주세요"
            }
            if (!sub.amount) {
              newErrors[`sub_${set.id}_${sub.id}_amount`] = "금액을 입력해주세요"
            }
          })
        })
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1)
        setErrors({})
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }

  const resetForm = () => {
    setCurrentStep(1)
    setFormData({
      contractStatus: "",
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      region: "",
      regionDetail: "",
      address: "",
      detailAddress: "",
      contractType: "",
      contractProduct: "select",
      operationTeam: "",
      salesPerson: "",
      monthlyAdCost: "",
      postingCount: "",
      startDate: "",
      endDate: "",
      memo: "",
    })
    setProductSets([{
      id: 1,
      productOption: "",
      productAmount: "",
      department: "none",
      manager: "none",
    }])
    setManualProductSets([{
      id: 1,
      mainProductName: "",
      mainProductAmount: "",
      subProducts: [{ id: 1, name: "", amount: "", department: "none", manager: "none" }],
    }])
    setRegisterStartDate(null)
    setRegisterEndDate(null)
    setErrors({})
    setTouched({})
  }

  const handleSubmit = (type: 'draft' | 'submit') => {
    const submitData = {
      ...formData,
      products: formData.contractProduct === 'select' ? productSets : manualProductSets,
      ...(mode === 'edit' && contractId ? { contractId } : {})
    }
    
    if (onSubmit) {
      onSubmit(submitData, type)
    } else {
      // 기본 동작
      console.log(`${type === 'draft' ? '임시저장' : (mode === 'edit' ? '수정' : '등록')} 데이터:`, submitData)
      
      if (type === 'draft') {
        showSuccessToast("임시저장 완료")
      } else if (type === 'submit') {
        showSuccessToast(mode === 'edit' ? "계약 수정이 완료되었습니다" : "계약 등록이 완료되었습니다")
        onClose()
        resetForm()
      }
    }
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const steps: Step[] = [
    { number: 1, title: '고객 정보' },
    { number: 2, title: '계약 조건' },
    { number: 3, title: '계약상품' },
    { number: 4, title: '첨부 및 완료' },
  ]

  return (
    <Dialog open={isOpen && !draftListOpen && !loadListOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px] max-h-[95vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl font-bold m-0">
                {mode === 'edit' ? '계약 수정' : '계약 등록'}
              </DialogTitle>
              {mode === 'create' && (
                <>
                  <div className="h-4 w-0.5 bg-gray-300"></div>
                  <button
                    type="button"
                    onClick={() => setDraftListOpen(true)}
                    className="text-[13px] text-gray-700 hover:text-gray-800 underline whitespace-nowrap cursor-pointer"
                  >
                    임시저장({draftList.length})
                  </button>
                  <div className="h-4 w-0.5 bg-gray-300"></div>
                  <button
                    type="button"
                    onClick={() => setLoadListOpen(true)}
                    className="text-[13px] text-blue-600 hover:text-blue-700 underline whitespace-nowrap cursor-pointer"
                  >
                    불러오기({contractList.length})
                  </button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-muted/10">
          <div className="space-y-6">
            {/* 스텝 인디케이터 - 컴팩트 모드 */}
            <StepIndicator 
              steps={steps}
              currentStep={currentStep}
              onStepClick={handleStepClick}
              compact={true}
            />

            {/* 1단계: 고객 정보 */}
            {currentStep === 1 && (
              <>
                {/* 계약상태 선택 */}
                <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0 pb-0 mb-2">
                  <div className="px-4 md:px-6 py-4 md:py-5">
                    <div className="flex items-center gap-6">
                      <div className="text-base font-bold text-gray-900">
                        계약상태
                      </div>
                      <div className="flex items-center gap-4">
                        <RadioGroup 
                          value={formData.contractStatus} 
                          onValueChange={(value) => handleInputChange('contractStatus', value)}
                          className="flex items-center gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="신규" id="status-new" />
                            <Label htmlFor="status-new" className="text-sm font-medium text-gray-700 cursor-pointer">
                              신규
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="연장" id="status-extension" />
                            <Label htmlFor="status-extension" className="text-sm font-medium text-gray-700 cursor-pointer">
                              연장
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="확장" id="status-expansion" />
                            <Label htmlFor="status-expansion" className="text-sm font-medium text-gray-700 cursor-pointer">
                              확장
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                    {errors.contractStatus && (
                      <p className="text-xs text-red-500 mt-2">{errors.contractStatus}</p>
                    )}
                  </div>
                </Card>

                {/* 고객 정보 */}
                <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0">
                  <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-200">
                    <div className="text-base font-bold text-gray-900">
                      고객 정보
                    </div>
                  </div>
                  <CardContent className="space-y-6 pt-4 pb-4 px-4 md:px-8">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="companyName" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        회사명 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          placeholder="회사명을 입력하세요"
                          required
                          className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 w-full shadow-none ${errors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.companyName && (
                          <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="contactPerson" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        계약자명 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <Input
                          id="contactPerson"
                          value={formData.contactPerson}
                          onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                          placeholder="계약자명을 입력하세요"
                          required
                          className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 w-full shadow-none ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.contactPerson && (
                          <p className="text-xs text-red-500 mt-1">{errors.contactPerson}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        이메일 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="이메일을 입력하세요"
                          required
                          className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 w-full shadow-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        전화번호 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="숫자만 입력하세요"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          required
                          className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 w-full shadow-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                      <Label htmlFor="address" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        사업장 주소 <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex flex-col gap-2 w-full md:w-80">
                        <div className="flex gap-3">
                          <Input
                            value={formData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="주소를 검색하세요"
                            className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 flex-1 shadow-none ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                            readOnly
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddressSearch}
                            className="h-9 px-4 border-0 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-800"
                          >
                            주소 검색
                          </Button>
                        </div>
                        {errors.address && (
                          <p className="text-xs text-red-500">{errors.address}</p>
                        )}
                        <Input
                          id="detailAddress"
                          value={formData.detailAddress || ''}
                          onChange={(e) => handleInputChange('detailAddress', e.target.value)}
                          placeholder="상세 주소를 입력하세요 (동, 호수 등)"
                          className="h-9 placeholder:text-gray-400 bg-white border-gray-300 focus:border-blue-500 w-full shadow-none"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </>
            )}

            {/* 2단계: 계약 조건 및 내용 */}
            {currentStep === 2 && (
              <Card className="gap-0 shadow-none rounded-xl border border-gray-200 pt-0">
                <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-200">
                  <div className="text-base font-bold text-gray-900">
                    계약 조건 및 내용
                  </div>
                </div>
                <CardContent className="space-y-6 pt-4 pb-4 px-4 md:px-8">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="contractType" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        계약 유형 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
                          <SelectTrigger className={`h-9 bg-white focus:border-blue-500 w-full shadow-none ${errors.contractType ? 'border-red-500' : 'border-gray-300'}`}>
                            <SelectValue placeholder="계약 유형을 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">월계약</SelectItem>
                            <SelectItem value="annual">연계약</SelectItem>
                            <SelectItem value="project">프로젝트</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.contractType && (
                          <p className="text-xs text-red-500 mt-1">{errors.contractType}</p>
                        )}
                      </div>
                    </div>
                    
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="salesPerson" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        영업자 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <Select value={formData.salesPerson} onValueChange={(value) => handleInputChange('salesPerson', value)}>
                          <SelectTrigger className={`h-9 bg-white focus:border-blue-500 w-full shadow-none ${errors.salesPerson ? 'border-red-500' : 'border-gray-300'}`}>
                            <SelectValue placeholder="영업자를 선택하세요" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sales1">김철수</SelectItem>
                            <SelectItem value="sales2">이영희</SelectItem>
                            <SelectItem value="sales3">박민수</SelectItem>
                            <SelectItem value="sales4">정지은</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.salesPerson && (
                          <p className="text-xs text-red-500 mt-1">{errors.salesPerson}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="monthlyAdCost" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        월 광고비 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <Input
                          id="monthlyAdCost"
                          value={formData.monthlyAdCost}
                          onChange={(e) => handleInputChange('monthlyAdCost', e.target.value)}
                          placeholder="₩0"
                          required
                          className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 w-full shadow-none ${errors.monthlyAdCost ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.monthlyAdCost && (
                          <p className="text-xs text-red-500 mt-1">{errors.monthlyAdCost}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="postingCount" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        포스팅 건수 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <div className="relative">
                          <Input
                            id="postingCount"
                            type="number"
                            value={formData.postingCount}
                            onChange={(e) => handleInputChange('postingCount', e.target.value)}
                            placeholder="0"
                            required
                            className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 pr-12 shadow-none ${errors.postingCount ? 'border-red-500' : 'border-gray-300'}`}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-medium">건</span>
                        </div>
                        {errors.postingCount && (
                          <p className="text-xs text-red-500 mt-1">{errors.postingCount}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                      <Label className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0 md:pt-2">
                        계약 기간 <span className="text-red-500">*</span>
                      </Label>
                      <div className="w-full md:w-80">
                        <CustomDatePicker
                          selectRange={true}
                          onRangeChange={handleDateRangeChange}
                          placeholder="시작일 - 종료일 선택"
                          rangeStart={registerStartDate}
                          rangeEnd={registerEndDate}
                          position="top"
                        />
                        {errors.contractPeriod && (
                          <p className="text-xs text-red-500 mt-1">{errors.contractPeriod}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 3단계: 계약상품 */}
            {currentStep === 3 && (
              <Card className="gap-0 shadow-none rounded-xl border border-gray-200 pt-0">
                <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-200">
                  <div className="text-base font-bold text-gray-900">
                    계약상품
                  </div>
                </div>
                <CardContent className="p-0 pb-4">
                  <div>
                    <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <Label htmlFor="contractProduct" className="text-sm font-semibold text-gray-500 md:w-[120px] flex-shrink-0">
                        상품 유형 <span className="text-red-500">*</span>
                      </Label>
                      <div className="inline-flex">
                        <Button
                          type="button"
                          variant={formData.contractProduct === 'select' ? 'default' : 'outline'}
                          className="h-9 px-4 rounded-l-md rounded-r-none focus:z-10"
                          onClick={() => handleInputChange('contractProduct', 'select')}
                        >
                          선택형
                        </Button>
                        <Button
                          type="button"
                          variant={formData.contractProduct === 'manual' ? 'default' : 'outline'}
                          className="h-9 px-4 rounded-r-md rounded-l-none -ml-px focus:z-10"
                          onClick={() => handleInputChange('contractProduct', 'manual')}
                        >
                          직접입력형
                        </Button>
                      </div>
                    </div>

                    <div className="h-px bg-gray-200 mx-4 md:mx-8"></div>
                    
                    {/* 선택형 */}
                    {formData.contractProduct === 'select' && (
                      <div className="space-y-4 px-4 md:px-8 py-4">
                        {productSets.map((set, index) => {
                          console.log(`상품 ${index + 1} 렌더링:`, set)
                          return (
                          <div key={set.id} className="relative border border-blue-200 rounded-xl p-4 md:p-5 bg-blue-50/50 transition-all">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <span className="text-sm font-semibold text-gray-500">상품 {index + 1}</span>
                              </div>
                              {productSets.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveProductSet(set.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 mb-4">
                              <Label className="text-sm font-semibold text-gray-500 md:w-[100px] flex-shrink-0 md:pt-2">
                                상품선택
                              </Label>
                              <div className="w-full md:max-w-[280px] lg:max-w-[300px]">
                                <Label className="text-xs font-medium text-gray-600 mb-1 block">상품선택</Label>
                                <Select 
                                  value={set.productOption} 
                                  onValueChange={(v) => handleProductSetChange(set.id, 'productOption', v)}
                                >
                                  <SelectTrigger className={`h-9 bg-white focus:border-blue-500 w-full shadow-none ${errors[`product_${set.id}_option`] ? 'border-red-500' : 'border-gray-300'}`}>
                                    <SelectValue placeholder="상품 선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="seo">SEO</SelectItem>
                                    <SelectItem value="premium">프리미엄</SelectItem>
                                    <SelectItem value="hanatop">하나탑</SelectItem>
                                  </SelectContent>
                                </Select>
                                {errors[`product_${set.id}_option`] && (
                                  <p className="text-xs text-red-500 mt-1">{errors[`product_${set.id}_option`]}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 mb-4">
                              <Label className="text-sm font-semibold text-gray-500 md:w-[100px] flex-shrink-0 md:pt-2">
                                상품금액
                              </Label>
                              <div className="w-full md:max-w-[280px] lg:max-w-[300px]">
                                <Label className="text-xs font-medium text-gray-600 mb-1 block">상품금액</Label>
                                <Input
                                  value={set.productAmount}
                                  onChange={(e) => {
                                    const formatted = formatCurrency(e.target.value)
                                    handleProductSetChange(set.id, 'productAmount', formatted)
                                  }}
                                  placeholder="₩0"
                                  disabled={!set.productOption}
                                  className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 w-full disabled:opacity-50 disabled:cursor-not-allowed shadow-none ${errors[`product_${set.id}_amount`] ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors[`product_${set.id}_amount`] && (
                                  <p className="text-xs text-red-500 mt-1">{errors[`product_${set.id}_amount`]}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                              <Label className="text-sm font-semibold text-gray-500 md:w-[100px] flex-shrink-0 md:pt-2">담당자</Label>
                              <div className="flex flex-col gap-2 w-full">
                                <div className="w-full md:max-w-[280px] lg:max-w-[300px]">
                                  <Label className="text-xs font-medium text-gray-600 mb-1 block">팀선택</Label>
                                  <Select 
                                    value={set.department} 
                                    onValueChange={(v) => {
                                      handleProductSetChange(set.id, 'department', v)
                                      if (v === 'none') {
                                        handleProductSetChange(set.id, 'manager', 'none')
                                      }
                                    }}
                                    disabled={!set.productAmount}
                                  >
                                    <SelectTrigger className="h-9 bg-white border-gray-300 focus:border-blue-500 w-full disabled:opacity-50 disabled:cursor-not-allowed shadow-none">
                                      <SelectValue placeholder="팀선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">=미선택=</SelectItem>
                                      <SelectItem value="sales">영업팀</SelectItem>
                                      <SelectItem value="marketing">마케팅팀</SelectItem>
                                      <SelectItem value="operation">운영팀</SelectItem>
                                      <SelectItem value="dev">개발팀</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="w-full md:max-w-[280px] lg:max-w-[300px]">
                                  <Label className="text-xs font-medium text-gray-600 mb-1 block">담당자</Label>
                                  <Select 
                                    value={set.manager} 
                                    onValueChange={(v) => handleProductSetChange(set.id, 'manager', v)} 
                                    disabled={!set.productAmount}
                                  >
                                    <SelectTrigger className="h-9 bg-white border-gray-300 focus:border-blue-500 w-full disabled:opacity-50 disabled:cursor-not-allowed shadow-none">
                                      <SelectValue placeholder="담당자 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">=미선택=</SelectItem>
                                      <SelectItem value="manager1">김담당</SelectItem>
                                      <SelectItem value="manager2">이매니저</SelectItem>
                                      <SelectItem value="manager3">박책임</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          </div>
                          )
                        })}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddProductSet}
                          className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-medium transition-all"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          상품 추가
                        </Button>
                      </div>
                    )}

                    {/* 직접입력형 */}
                    {formData.contractProduct === 'manual' && (
                      <div className="space-y-4 px-4 md:px-8 py-4">
                        {manualProductSets.map((set, index) => (
                          <div key={set.id} className="relative border border-blue-200 rounded-xl p-4 md:p-5 lg:p-6 bg-white transition-all">
                            <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-blue-100">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                                <span className="text-base font-bold text-gray-800">상품 세트 {index + 1}</span>
                              </div>
                              {manualProductSets.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveManualProductSet(set.id)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <div className="mb-2 p-3 md:p-4 bg-blue-50 rounded-xl border border-blue-100">
                              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-200">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                <Label className="text-sm font-bold text-gray-800">대표상품 정보</Label>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex flex-col gap-2">
                                  <Label className="text-sm font-semibold text-gray-500">
                                    대표상품명
                                  </Label>
                                  <Input
                                    value={set.mainProductName}
                                    onChange={(e) => handleManualProductSetChange(set.id, 'mainProductName', e.target.value)}
                                    placeholder="대표상품명을 입력하세요"
                                    className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 w-full md:max-w-[280px] lg:max-w-[300px] shadow-none ${errors[`manual_${set.id}_name`] ? 'border-red-500' : 'border-gray-300'}`}
                                  />
                                  {errors[`manual_${set.id}_name`] && (
                                    <p className="text-xs text-red-500">{errors[`manual_${set.id}_name`]}</p>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2">
                                  <Label className="text-sm font-semibold text-gray-500">
                                    대표상품 금액
                                  </Label>
                                  <Input
                                    value={set.mainProductAmount}
                                    onChange={(e) => {
                                      const formatted = formatCurrency(e.target.value)
                                      handleManualProductSetChange(set.id, 'mainProductAmount', formatted)
                                    }}
                                    placeholder="₩0"
                                    disabled={!set.mainProductName}
                                    className={`h-9 placeholder:text-gray-400 bg-white focus:border-blue-500 w-full md:max-w-[280px] lg:max-w-[300px] disabled:opacity-50 disabled:cursor-not-allowed shadow-none ${errors[`manual_${set.id}_amount`] ? 'border-red-500' : 'border-gray-300'}`}
                                  />
                                  {errors[`manual_${set.id}_amount`] && (
                                    <p className="text-xs text-red-500">{errors[`manual_${set.id}_amount`]}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                    
                            <div className="p-3 md:p-4">
                              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                  <Label className="text-sm font-bold text-gray-800">하위상품 목록</Label>
                                </div>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddSubProduct(set.id)}
                                  className="h-8 px-3 text-xs border border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 font-medium"
                                >
                                  추가
                                  <Plus className="h-3.5 w-3.5 ml-0" />
                                </Button>
                              </div>
                              <div className="space-y-3">
                                {set.subProducts.map((sub, subIndex) => (
                                  <div key={sub.id} className="p-3 bg-gray-50 rounded-xl border border-gray-300">
                                    <div className="flex flex-col gap-2 mb-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                          {subIndex + 1}
                                        </div>
                                        {set.subProducts.length > 1 && (
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveSubProduct(set.id, sub.id)}
                                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-auto"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                      <div className="w-full">
                                        <Input
                                          value={sub.name}
                                          onChange={(e) => handleSubProductChange(set.id, sub.id, 'name', e.target.value)}
                                          placeholder="상품명"
                                          className={`h-9 placeholder:text-gray-400 bg-white focus:border-gray-500 w-full shadow-none ${errors[`sub_${set.id}_${sub.id}_name`] ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors[`sub_${set.id}_${sub.id}_name`] && (
                                          <p className="text-xs text-red-500 mt-1">{errors[`sub_${set.id}_${sub.id}_name`]}</p>
                                        )}
                                      </div>
                                      <div className="w-full">
                                        <Input
                                          value={sub.amount}
                                          onChange={(e) => {
                                            const formatted = formatCurrency(e.target.value)
                                            handleSubProductChange(set.id, sub.id, 'amount', formatted)
                                          }}
                                          placeholder="₩0"
                                          className={`h-9 placeholder:text-gray-400 bg-white focus:border-gray-500 w-full shadow-none ${errors[`sub_${set.id}_${sub.id}_amount`] ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                        {errors[`sub_${set.id}_${sub.id}_amount`] && (
                                          <p className="text-xs text-red-500 mt-1">{errors[`sub_${set.id}_${sub.id}_amount`]}</p>
                                        )}
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 pt-3 mt-3 border-t border-gray-200">
                                      <div className="w-full">
                                        <Label className="text-xs font-medium text-gray-600 mb-1.5 block">팀</Label>
                                        <Select 
                                          value={sub.department} 
                                          onValueChange={(v) => {
                                            handleSubProductChange(set.id, sub.id, 'department', v)
                                            if (v === 'none') {
                                              handleSubProductChange(set.id, sub.id, 'manager', 'none')
                                            }
                                          }}
                                        >
                                          <SelectTrigger className="h-9 bg-white border-gray-300 focus:border-gray-500 w-full shadow-none">
                                            <SelectValue placeholder="팀 선택" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="none">미선택</SelectItem>
                                            <SelectItem value="sales">영업팀</SelectItem>
                                            <SelectItem value="marketing">마케팅팀</SelectItem>
                                            <SelectItem value="operation">운영팀</SelectItem>
                                            <SelectItem value="dev">개발팀</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="w-full">
                                        <Label className="text-xs font-medium text-gray-600 mb-1.5 block">담당자</Label>
                                        <Select 
                                          value={sub.manager} 
                                          onValueChange={(v) => handleSubProductChange(set.id, sub.id, 'manager', v)}
                                        >
                                          <SelectTrigger className="h-9 bg-white border-gray-300 focus:border-gray-500 w-full shadow-none">
                                            <SelectValue placeholder="담당자 선택" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="none">=미선택=</SelectItem>
                                            <SelectItem value="manager1">김담당</SelectItem>
                                            <SelectItem value="manager2">이매니저</SelectItem>
                                            <SelectItem value="manager3">박책임</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddManualProductSet}
                          className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-medium transition-all"
                        >
                          <Plus className="h-5 w-5 mr-2" />
                          상품 세트 추가
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 4단계: 계약서 첨부 및 기타 사항 */}
            {currentStep === 4 && (
              <Card className="gap-0 shadow-none rounded-xl border border-gray-200 overflow-hidden pt-0">
                <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-200">
                  <div className="text-base font-bold text-gray-900">
                    계약서 첨부 및 기타 사항
                  </div>
                </div>
                <CardContent className="space-y-6 pt-4 pb-4 px-4 md:px-8">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4 pb-4 border-b border-gray-100">
                      <Label htmlFor="memo" className="text-sm font-semibold text-gray-500 md:w-20 flex-shrink-0 md:pt-3">
                        계약 조건 및 특이사항
                      </Label>
                      <Textarea
                        id="memo"
                        value={formData.memo}
                        onChange={(e) => handleInputChange('memo', e.target.value)}
                        placeholder="내용을 입력해주세요."
                        className="min-h-[120px] placeholder:text-gray-400 bg-white border-gray-300 focus:border-blue-500 rounded-xl resize-none w-full shadow-none"
                      />
                    </div>
                    
                    <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                      <Label className="text-sm font-semibold text-gray-500 md:w-20 flex-shrink-0 md:pt-3">
                        계약서 <br className=" md:block hidden" /> 첨부파일
                      </Label>
                      <FileUpload 
                        accept=".pdf,.doc,.docx"
                        multiple={true}
                        maxSizeMB={10}
                        mainText="계약서 파일을 업로드하세요"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* 하단 네비게이션 */}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={totalSteps}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
          onDraft={mode === 'create' ? () => handleSubmit('draft') : undefined}
          onSubmit={() => handleSubmit('submit')}
          onCancel={mode === 'edit' ? handleClose : undefined}
          showDraft={mode === 'create'}
          showCancel={mode === 'edit'}
          submitLabel={mode === 'edit' ? '수정하기' : '저장하기'}
        />
      </DialogContent>

      {/* 임시저장 목록 모달 */}
      <Dialog open={draftListOpen} onOpenChange={setDraftListOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px] max-h-[80vh] flex flex-col p-0 gap-0 border border-gray-300">
          
          {/* 헤더 */}
          <div className="px-4 sm:px-6 py-6 pb-2 border-b flex-shrink-0 ">
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => setDraftListOpen(false)}
                className="p-1 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 m-0 leading-none">임시저장 계약</h2>
            </div>
            <div className="">
              <p className="text-sm text-gray-600">
                총 <span className="text-blue-600 font-semibold">{draftList.length}</span>개
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 pt-6 pb-10">
            {isLoadingDraft ? (
              <LoadingBar message="불러오는중입니다" barHeight={8} />
            ) : draftList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/icons/icon-default.png"
                    alt="데이터 없음"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">임시저장된 계약이 없습니다</h3>
                <p className="text-sm text-gray-500 text-center">
                  계약 등록 중 임시저장하면<br />여기에서 확인할 수 있습니다
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {draftList.map((draft) => (
                  <div 
                    key={draft.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleLoadDraft(draft.id)}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-normal text-gray-900">
                        {draft.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {draft.savedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </DialogContent>
      </Dialog>

      {/* 불러오기 목록 모달 */}
      <Dialog open={loadListOpen} onOpenChange={setLoadListOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] lg:max-w-[600px] xl:max-w-[600px] max-h-[80vh] flex flex-col p-0 gap-0 border border-gray-300">
          
          {/* 헤더 */}
          <div className="px-4 sm:px-6 py-6 pb-4 border-b flex-shrink-0 ">
            <div className="flex items-center gap-3 mb-4">
              <button 
                onClick={() => setLoadListOpen(false)}
                className="p-1 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 m-0 leading-none">계약 목록</h2>
            </div>
            
            {/* 검색폼 */}
            <div className="mb-3">
              <Input
                type="text"
                placeholder="계약번호, 회사명, 담당자명으로 검색"
                value={contractSearchTerm}
                onChange={(e) => setContractSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="">
              <p className="text-sm text-gray-600">
                총 <span className="text-blue-600 font-semibold">{filteredContractList.length}</span>개
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 pt-6 pb-10 overflow-y-auto">
            {isLoadingLoad ? (
              <LoadingBar message="불러오는중입니다" barHeight={8} />
            ) : contractList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 mb-4 relative">
                  <Image
                    src="/icons/icon-default.png"
                    alt="데이터 없음"
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">불러올 계약이 없습니다</h3>
                <p className="text-sm text-gray-500 text-center">
                  등록된 계약이 없습니다
                </p>
              </div>
            ) : filteredContractList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 mb-4 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
                <p className="text-sm text-gray-500 text-center">
                  다른 검색어로 다시 시도해보세요
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredContractList.map((contract) => (
                  <div 
                    key={contract.id}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleLoadContract(contract.id)}
                  >
                    <div className="space-y-3">
                      {/* 계약번호 */}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {contract.id}
                        </p>
                      </div>
                      
                      {/* 고객정보 */}
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">고객정보</p>
                        <p className="text-sm text-gray-900">{contract.customer.company}</p>
                        <p className="text-xs text-gray-600 mt-0.5">{contract.customer.contact}</p>
                      </div>
                      
                      {/* 서비스유형 */}
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">서비스유형</p>
                        <div className="flex flex-wrap gap-1">
                          {contract.services.map((service, idx) => (
                            <Badge 
                              key={idx}
                              variant="secondary" 
                              className="text-xs bg-blue-100 text-blue-700 border-0"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </DialogContent>
      </Dialog>
    </Dialog>
  )
}

