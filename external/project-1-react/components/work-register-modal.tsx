"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import CustomDatePicker from "@/components/ui/custom-datepicker"
import { X, Download, Upload, Plus, Trash2, AlertCircle, FileSpreadsheet } from "lucide-react"
import * as XLSX from "xlsx"

export interface KeywordAssignment {
  id: string
  keyword: string
  teamName: string
  assignee: string
  rankLimit: number
  isTargetKeyword: boolean
}

interface WorkTask {
  id: string
  contractNumber: string
  serviceType: string
  contractDescription: string
  startDate: string
  endDate: string
  teamName: string
  assignee: string
  targetKeywords: string
  keywordRankLimit: number
  status: "진행중" | "완료" | "대기" | "보류"
  notes: string
  createdAt: string
  keywordAssignments?: KeywordAssignment[]
}

interface WorkFormData {
  contractNumber: string
  serviceType: string
  contractDescription: string
  startDate: string
  endDate: string
  teamName: string
  assignee: string
  targetKeywords: string
  keywordRankLimit: number
  status: "진행중" | "완료" | "대기" | "보류"
  notes: string
  keywordAssignments: KeywordAssignment[]
}

interface WorkRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: WorkFormData) => void
  mode: "create" | "edit" | "view"
  initialData?: Partial<WorkFormData>
  workTaskId?: string
  onEdit?: () => void
}

interface Department {
  id: string
  name: string
  members: string[]
}

interface Contract {
  contractNumber: string
  clientName: string
  serviceType: string
  contractDescription: string
  startDate: string
  endDate: string
  assignee: string
}

const WorkRegisterModal: React.FC<WorkRegisterModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
  workTaskId,
  onEdit,
}) => {
  const isViewMode = mode === "view"
  // TODO: 설정 > 부서/팀관리에서 등록된 실제 데이터와 연동 필요
  const [departments] = useState<Department[]>([
    {
      id: "dept1",
      name: "마케팅팀",
      members: ["김철수", "이영희", "박민수", "최지영"],
    },
    {
      id: "dept2",
      name: "개발팀",
      members: ["정개발", "한코딩", "임프로", "서버관"],
    },
    {
      id: "dept3",
      name: "디자인팀",
      members: ["김디자인", "이UI", "박UX", "최그래픽"],
    },
    {
      id: "dept4",
      name: "영업팀",
      members: ["강영업", "윤세일즈", "조마케팅", "신비즈"],
    },
    {
      id: "dept5",
      name: "기획팀",
      members: ["홍기획", "양전략", "구분석", "노기획"],
    },
  ])

  // 계약 데이터
  const [contracts] = useState<Contract[]>([
    {
      contractNumber: "CT-2024-001",
      clientName: "ABC 쇼핑몰",
      serviceType: "SEO 최적화",
      contractDescription: "웹사이트 검색엔진 최적화 및 키워드 상위 노출 서비스",
      startDate: "2024-01-15",
      endDate: "2024-06-15",
      assignee: "김철수",
    },
    {
      contractNumber: "CT-2024-002",
      clientName: "XYZ 브랜드",
      serviceType: "SNS 마케팅",
      contractDescription: "인스타그램, 페이스북 콘텐츠 제작 및 관리 서비스",
      startDate: "2024-02-01",
      endDate: "2024-07-31",
      assignee: "이영희",
    },
    {
      contractNumber: "CT-2024-003",
      clientName: "맛집 리뷰 블로그",
      serviceType: "블로그 마케팅",
      contractDescription: "네이버 블로그 포스팅 및 키워드 최적화",
      startDate: "2024-01-20",
      endDate: "2024-04-20",
      assignee: "박민수",
    },
    {
      contractNumber: "CT-2024-004",
      clientName: "스타트업 A",
      serviceType: "통합 디지털 마케팅",
      contractDescription: "SEO, SNS, 광고 운영 통합 마케팅 서비스",
      startDate: "2024-03-01",
      endDate: "2024-08-31",
      assignee: "최지영",
    },
    {
      contractNumber: "CT-2024-005",
      clientName: "온라인 교육업체",
      serviceType: "콘텐츠 제작",
      contractDescription: "교육 콘텐츠 제작 및 마케팅 자료 개발",
      startDate: "2024-02-15",
      endDate: "2024-05-15",
      assignee: "정개발",
    },
  ])

  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [formData, setFormData] = useState<WorkFormData>({
    contractNumber: "",
    serviceType: "",
    contractDescription: "",
    startDate: "",
    endDate: "",
    teamName: "",
    assignee: "",
    targetKeywords: "",
    keywordRankLimit: 10,
    status: "대기",
    notes: "",
    keywordAssignments: [],
  })

  const [uploadMethod, setUploadMethod] = useState<"excel" | "manual">("manual")
  const [keywordAssignments, setKeywordAssignments] = useState<KeywordAssignment[]>([])
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  // 모달이 열릴 때 초기 데이터 설정
  useEffect(() => {
    if (isOpen) {
      if ((mode === "edit" || mode === "view") && initialData) {
        const newFormData = {
          contractNumber: initialData.contractNumber || "",
          serviceType: initialData.serviceType || "",
          contractDescription: initialData.contractDescription || "",
          startDate: initialData.startDate || "",
          endDate: initialData.endDate || "",
          teamName: initialData.teamName || "",
          assignee: initialData.assignee || "",
          targetKeywords: initialData.targetKeywords || "",
          keywordRankLimit: initialData.keywordRankLimit || 10,
          status: initialData.status || "대기",
          notes: initialData.notes || "",
          keywordAssignments: initialData.keywordAssignments || [],
        }
        setFormData(newFormData)
        setKeywordAssignments(initialData.keywordAssignments || [])
        const selectedDept = departments.find((dept) => dept.name === initialData.teamName)
        setSelectedTeamMembers(selectedDept ? selectedDept.members : [])
      } else {
        // 새 업무 등록 시 초기값 설정
        setFormData({
          contractNumber: "",
          serviceType: "",
          contractDescription: "",
          startDate: "",
          endDate: "",
          teamName: "",
          assignee: "",
          targetKeywords: "",
          keywordRankLimit: 10,
          status: "대기",
          notes: "",
          keywordAssignments: [],
        })
        // 직접입력 탭에서 기본 키워드 입력폼 1개 표시
        setKeywordAssignments([{
          id: `default-${Date.now()}`,
          keyword: "",
          teamName: "",
          assignee: "",
          rankLimit: 10,
          isTargetKeyword: false,
        }])
        setSelectedTeamMembers([])
      }
    }
  }, [isOpen, mode, initialData, departments])

  // 계약번호 선택 핸들러
  const handleContractSelect = (contractNumber: string) => {
    const selectedContract = contracts.find((c) => c.contractNumber === contractNumber)
    if (selectedContract) {
      setFormData({
        ...formData,
        contractNumber: selectedContract.contractNumber,
        serviceType: selectedContract.serviceType,
        contractDescription: selectedContract.contractDescription,
        startDate: selectedContract.startDate,
        endDate: selectedContract.endDate,
        assignee: selectedContract.assignee,
      })
      // 에러 메시지 제거
      if (errors.contractNumber) {
        setErrors({ ...errors, contractNumber: "" })
      }
    }
  }

  // 팀 변경 핸들러
  const handleTeamChange = (teamName: string) => {
    const selectedDept = departments.find((dept) => dept.name === teamName)
    setSelectedTeamMembers(selectedDept ? selectedDept.members : [])
    setFormData({ ...formData, teamName, assignee: "" })
  }

  // 엑셀 템플릿 다운로드
  const downloadTemplate = () => {
    const template = [
      {
        키워드: "예시: 온라인쇼핑몰",
        팀명: "예시: 마케팅팀",
        담당자: "예시: 김철수",
        노출보장순위: 10,
        타겟키워드: "NO",
      },
      {
        키워드: "예시: 상품배송",
        팀명: "예시: 개발팀",
        담당자: "예시: 정개발",
        노출보장순위: 15,
        타겟키워드: "YES",
      },
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "업무배정")
    
    // 컬럼 너비 설정
    ws["!cols"] = [
      { wch: 20 }, // 키워드
      { wch: 15 }, // 팀명
      { wch: 15 }, // 담당자
      { wch: 15 }, // 노출보장순위
      { wch: 12 }, // 타겟키워드
    ]
    
    // 헤더 행 스타일 설정 (그레이 배경)
    const headerCells = ['A1', 'B1', 'C1', 'D1', 'E1']
    headerCells.forEach(cell => {
      if (ws[cell]) {
        ws[cell].s = {
          fill: {
            fgColor: { rgb: "D3D3D3" }
          },
          font: {
            bold: true
          },
          alignment: {
            horizontal: "center",
            vertical: "center"
          }
        }
      }
    })
    
    // 데이터 검증 추가 (타겟키워드 컬럼에 드롭다운)
    if (!ws['!dataValidation']) ws['!dataValidation'] = []
    
    // E열(타겟키워드)에 대한 데이터 검증 설정 - 2행부터 1000행까지
    for (let row = 2; row <= 1000; row++) {
      ws['!dataValidation'].push({
        type: 'list',
        allowBlank: true,
        sqref: `E${row}`,
        formulas: ['"YES,NO"']
      })
    }
    
    XLSX.writeFile(wb, "업무배정_템플릿.xlsx", { cellStyles: true })
  }

  // 엑셀 파일 파싱
  const handleExcelUpload = (files: File[]) => {
    if (files.length === 0) return

    const file = files[0]
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: "binary" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)

        const parsed: KeywordAssignment[] = jsonData.map((row: any, index) => {
          const targetValue = String(row["타겟키워드"] || row["target"] || "").toUpperCase()
          return {
            id: `excel-${Date.now()}-${index}`,
            keyword: String(row["키워드"] || row["keyword"] || "").trim(),
            teamName: String(row["팀명"] || row["team"] || "").trim(),
            assignee: String(row["담당자"] || row["assignee"] || "").trim(),
            rankLimit: Number(row["노출보장순위"] || row["rank"] || 10),
            isTargetKeyword: targetValue === "TRUE" || targetValue === "1" || targetValue === "YES",
          }
        })

        // 빈 행 제거
        const validData = parsed.filter(item => item.keyword && item.teamName && item.assignee)
        
        setKeywordAssignments(validData)
        
        // 키워드 에러 메시지 제거
        if (errors.keywordAssignments) {
          setErrors({ ...errors, keywordAssignments: "" })
        }
        
        if (validData.length === 0) {
          alert("유효한 데이터가 없습니다. 템플릿 형식을 확인해주세요.")
        }
      } catch (error) {
        console.error("엑셀 파일 파싱 오류:", error)
        alert("엑셀 파일을 읽는 중 오류가 발생했습니다. 파일 형식을 확인해주세요.")
      }
    }

    reader.readAsBinaryString(file)
  }

  // 수동으로 행 추가
  const addManualRow = () => {
    setKeywordAssignments([
      ...keywordAssignments,
      {
        id: `manual-${Date.now()}`,
        keyword: "",
        teamName: "",
        assignee: "",
        rankLimit: 10,
        isTargetKeyword: false,
      },
    ])
    // 키워드 에러 메시지 제거
    if (errors.keywordAssignments) {
      setErrors({ ...errors, keywordAssignments: "" })
    }
  }

  // 행 삭제
  const deleteRow = (id: string) => {
    setKeywordAssignments(keywordAssignments.filter((item) => item.id !== id))
  }

  // 행 수정
  const updateRow = (id: string, field: keyof KeywordAssignment, value: any) => {
    setKeywordAssignments((prev) => 
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
    // 키워드 에러 메시지 제거
    if (errors.keywordAssignments) {
      setErrors({ ...errors, keywordAssignments: "" })
    }
  }

  // 전체 삭제
  const clearAll = () => {
    if (keywordAssignments.length > 0) {
      // 기본 키워드 입력폼 1개는 항상 유지
      setKeywordAssignments([{
        id: `default-${Date.now()}`,
        keyword: "",
        teamName: "",
        assignee: "",
        rankLimit: 10,
        isTargetKeyword: false,
      }])
    }
  }

  // 폼 제출 핸들러
  const handleSubmit = () => {
    // 에러 초기화
    setErrors({})
    
    // 유효성 검사
    if (!formData.contractNumber) {
      setErrors({ contractNumber: "계약번호를 선택해주세요." })
      return
    }

    if (keywordAssignments.length === 0) {
      setErrors({ ...errors, keywordAssignments: "최소 1개 이상의 키워드를 등록해주세요." })
      return
    }

    // 키워드 데이터 검증
    const invalidRows = keywordAssignments.filter(
      (item) => !item.keyword.trim() || !item.teamName.trim() || !item.assignee.trim()
    )

    if (invalidRows.length > 0) {
      setErrors({ ...errors, keywordAssignments: "모든 키워드 행의 정보를 입력해주세요. (키워드, 팀명, 담당자)" })
      return
    }

    const submitData = {
      ...formData,
      keywordAssignments,
    }

    onSubmit(submitData)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col relative z-[10000]">
        {/* 포지션 고정 닫기 버튼 (계약 등록 모달 스타일) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 rounded-full text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer"
          aria-label="모달 닫기"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* 고정 헤더 */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">
                {mode === "create" ? "새 업무 등록" : mode === "view" ? "업무 상세 정보" : "업무 수정"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {mode === "create" 
                  ? "계약된 내용을 바탕으로 담당자에게 업무를 배정합니다." 
                  : `업무 ID: ${workTaskId}`}
              </p>
            </div>
            {/* 헤더 내 닫기 버튼 제거 (상단 우측 고정 버튼 사용) */}
          </div>

        {/* 스크롤 가능한 컨텐츠 */}
        <div className="overflow-y-auto flex-1 p-6">

          <div className="grid gap-4">
            {/* 기본 정보 섹션 */}
            <div className="space-y-4 sm:space-y-3 sm:bg-gray-50/50 sm:rounded-lg sm:border sm:border-gray-200 sm:p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
                <Label htmlFor="contractNumber" className="md:w-32 md:pt-2 shrink-0 text-sm text-gray-600">계약번호</Label>
                <div className="flex-1">
                {isViewMode ? (
                  <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 h-9 flex items-center text-xs sm:text-sm text-gray-600">
                    {formData.contractNumber}
                  </div>
                ) : (
                  <Select value={formData.contractNumber} onValueChange={handleContractSelect}>
                    <SelectTrigger className="relative z-[10001] h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500">
                      <SelectValue placeholder="계약번호 선택" />
                    </SelectTrigger>
                    <SelectContent className="z-[10002]">
                      {contracts.map((contract) => (
                        <SelectItem key={contract.contractNumber} value={contract.contractNumber}>
                          {contract.contractNumber} - {contract.clientName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                  {errors.contractNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.contractNumber}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <Label htmlFor="status" className="md:w-32 shrink-0 text-sm text-gray-600">상태</Label>
                <div className="flex-1">
                {isViewMode ? (
                  <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 h-9 flex items-center text-xs sm:text-sm text-gray-600">
                    {formData.status}
                  </div>
                ) : (
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger className="h-9 w-full bg-white text-xs sm:text-sm border-gray-400 hover:border-gray-500 focus:border-blue-500">
                      <SelectValue placeholder="상태 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="대기">대기</SelectItem>
                      <SelectItem value="진행중">진행중</SelectItem>
                      <SelectItem value="완료">완료</SelectItem>
                      <SelectItem value="보류">보류</SelectItem>
                    </SelectContent>
                  </Select>
                )}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <Label htmlFor="assignee" className="md:w-32 shrink-0 text-sm text-gray-600">담당자</Label>
                <div className="flex-1">
                {isViewMode ? (
                  <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 h-9 flex items-center text-xs sm:text-sm text-gray-600">
                    {formData.assignee}
                  </div>
                ) : (
                  <Input
                    id="assignee"
                    value={formData.assignee}
                    readOnly
                    className="h-9 bg-gray-100 border-gray-300 text-xs sm:text-sm"
                    placeholder="계약번호를 선택하면 자동으로 설정됩니다"
                  />
                )}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <Label htmlFor="serviceType" className="md:w-32 shrink-0 text-sm text-gray-600">서비스 유형</Label>
                <div className="flex-1">
                {isViewMode ? (
                  <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 h-9 flex items-center text-xs sm:text-sm text-gray-600">
                    {formData.serviceType}
                  </div>
                ) : (
                  <Input
                    id="serviceType"
                    value={formData.serviceType}
                    readOnly
                    className="bg-gray-100 border-gray-300 h-9 text-xs sm:text-sm"
                    placeholder="계약번호를 선택하면 자동으로 설정됩니다"
                  />
                )}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                <Label htmlFor="dateRange" className="md:w-32 shrink-0 text-sm text-gray-600">계약 기간</Label>
                <div className="flex-1">
                  {isViewMode ? (
                    <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 h-9 flex items-center text-xs sm:text-sm text-gray-600">
                      {formData.startDate} ~ {formData.endDate}
                    </div>
                  ) : (
                    <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 h-9 flex items-center text-xs sm:text-sm text-gray-600">
                      {formData.startDate && formData.endDate 
                        ? `${formData.startDate} ~ ${formData.endDate}`
                        : "계약번호를 선택하면 자동으로 설정됩니다"
                      }
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
                <Label htmlFor="contractDescription" className="md:w-32 md:pt-2 shrink-0 text-sm text-gray-600">계약설명</Label>
                <div className="flex-1">
                  {isViewMode ? (
                    <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 min-h-[72px] flex items-start text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {formData.contractDescription}
                    </div>
                  ) : (
                    <div className="bg-gray-100 border border-gray-300 rounded-md px-3 py-2 min-h-[72px] flex items-start text-xs sm:text-sm text-gray-600">
                      {formData.contractDescription || "계약번호를 선택하면 자동으로 설정됩니다"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 선택된 계약 정보 박스 제거 */}

            {/* 키워드 배정 섹션 */}
            <div className="border-t pt-6">
              {!isViewMode && (
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-base sm:text-lg font-semibold text-slate-900">키워드별 담당자 배정</h4>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      엑셀로 대량 업로드하거나 직접 입력할 수 있습니다.
                    </p>
                  </div>
                </div>
              )}

              <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                {!isViewMode && (
                  <Tabs
                    value={uploadMethod}
                    onValueChange={(v: any) => setUploadMethod(v)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 h-11 rounded-none border-b border-gray-200">
                      <TabsTrigger
                        value="manual"
                        className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none text-gray-500 font-medium h-9 flex items-center justify-center rounded-lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        직접입력
                      </TabsTrigger>
                      <TabsTrigger
                        value="excel"
                        className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none text-gray-500 font-medium h-9 flex items-center justify-center rounded-lg"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        엑셀 대량등록
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="excel" className="space-y-3 px-4 pt-2 pb-4">
                      <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" />
                            <p className="text-xs sm:text-sm text-gray-900 font-medium">
                              엑셀 파일로 여러 키워드를 한 번에 등록할 수 있습니다.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={downloadTemplate}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 px-3 flex-shrink-0 w-full md:w-auto"
                          >
                            <FileSpreadsheet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            엑셀 템플릿 다운
                          </Button>
                        </div>
                      </div>

                      <div className="px-1">
                        <FileUpload
                          accept=".xlsx,.xls,.csv"
                          multiple={false}
                          maxSizeMB={5}
                          mainText="엑셀 파일을 업로드하세요"
                          subText="xlsx, xls, csv 파일만 업로드 가능합니다 (최대 5MB)"
                          onChange={handleExcelUpload}
                          showFileList={false}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="manual" className="space-y-3 px-4 pt-2 pb-4">
                      <div className="bg-gray-100 p-3 sm:p-4 rounded-lg">
                        <p className="text-xs sm:text-sm text-slate-700 mb-2 sm:mb-3">
                          키워드를 직접 입력하여 등록할 수 있습니다.
                        </p>
                        <Button
                          onClick={addManualRow}
                          size="sm"
                          variant="outline"
                          className="w-full shadow-none border-primary text-primary hover:bg-primary/10 hover:text-primary h-9 sm:h-11 py-2 sm:py-3"
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          키워드 추가
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}

                {keywordAssignments.length > 0 && (
                  <div className="p-4 sm:p-5 pt-0 sm:pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">
                        {isViewMode ? "키워드 목록" : "등록된 키워드 목록"}{" "}
                        <span className="text-blue-600 font-semibold">({keywordAssignments.length}개)</span>
                      </h5>
                      {!isViewMode && (
                        <Button
                          size="sm"
                          onClick={clearAll}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 h-7 flex items-center gap-0"
                        >
                          <X className="w-3 h-3" />
                          전체 삭제
                        </Button>
                      )}
                    </div>

                    <div className="hidden md:block border rounded-lg overflow-hidden">
                      <div className="max-h-96 overflow-y-auto">
                        <Table>
                          <TableHeader className="bg-slate-50 sticky top-0 z-10">
                            <TableRow>
                              <TableHead className="w-12 text-center">번호</TableHead>
                              <TableHead className="w-12 text-center">타겟</TableHead>
                              <TableHead className="w-1/4">키워드</TableHead>
                              <TableHead className="w-1/5">팀명</TableHead>
                              <TableHead className="w-1/6">담당자</TableHead>
                              <TableHead className="w-24 text-center">노출 보장 순위</TableHead>
                              {!isViewMode && <TableHead className="w-16 text-center">삭제</TableHead>}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {keywordAssignments.map((item, index) => (
                              <TableRow key={item.id}>
                                <TableCell className="text-center text-sm text-gray-500">{index + 1}</TableCell>
                                <TableCell className="text-center">
                                  {isViewMode ? (
                                    <div className="text-sm text-center">{item.isTargetKeyword ? "✓" : "-"}</div>
                                  ) : (
                                    <Checkbox
                                      checked={item.isTargetKeyword}
                                      onCheckedChange={(checked) =>
                                        updateRow(item.id, "isTargetKeyword", checked)
                                      }
                                    />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isViewMode ? (
                                    <div className="text-sm font-medium">{item.keyword}</div>
                                  ) : (
                                    <Input
                                      type="text"
                                      value={item.keyword}
                                      onChange={(e) => updateRow(item.id, "keyword", e.target.value)}
                                      className="w-full h-9 bg-white"
                                      placeholder="키워드 입력"
                                    />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isViewMode ? (
                                    <div className="text-sm">{item.teamName}</div>
                                  ) : (
                                    <Select
                                      value={item.teamName || undefined}
                                      onValueChange={(value) => {
                                        updateRow(item.id, "teamName", value)
                                        updateRow(item.id, "assignee", "")
                                      }}
                                    >
                                      <SelectTrigger className="h-9 w-full bg-white">
                                        <SelectValue placeholder="팀 선택" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {departments.map((dept) => (
                                          <SelectItem key={dept.id} value={dept.name}>
                                            {dept.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {isViewMode ? (
                                    <div className="text-sm">{item.assignee}</div>
                                  ) : (
                                    <Select
                                      value={item.assignee || undefined}
                                      onValueChange={(value) => updateRow(item.id, "assignee", value)}
                                    >
                                      <SelectTrigger className="h-9 w-full bg-white">
                                        <SelectValue
                                          placeholder={item.teamName ? "담당자 선택" : "먼저 팀 선택"}
                                        />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {item.teamName ? (
                                          departments
                                            .find((dept) => dept.name === item.teamName)
                                            ?.members.map((member) => (
                                              <SelectItem key={member} value={member}>
                                                {member}
                                              </SelectItem>
                                            ))
                                        ) : (
                                          <div className="px-2 py-1.5 text-sm text-gray-500">먼저 팀을 선택하세요</div>
                                        )}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  {isViewMode ? (
                                    <div className="text-sm">{item.rankLimit}위</div>
                                  ) : (
                                    <Input
                                      type="number"
                                      value={item.rankLimit}
                                      onChange={(e) => updateRow(item.id, "rankLimit", Number(e.target.value))}
                                      className="w-full h-9 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                      min="1"
                                      max="100"
                                    />
                                  )}
                                </TableCell>
                                {!isViewMode && (
                                  <TableCell className="text-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteRow(item.id)}
                                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </TableCell>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>

                    <div className="md:hidden space-y-3 max-h-96 overflow-y-auto">
                      {keywordAssignments.map((item, index) => (
                        <div key={item.id} className="bg-white border rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                              {isViewMode ? (
                                <div className="text-xs text-gray-600">
                                  타겟: {item.isTargetKeyword ? "✓" : "-"}
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <Checkbox
                                    id={`mobile-target-${item.id}`}
                                    checked={item.isTargetKeyword}
                                    onCheckedChange={(checked) => updateRow(item.id, "isTargetKeyword", checked)}
                                    className="h-4 w-4"
                                  />
                                  <label
                                    htmlFor={`mobile-target-${item.id}`}
                                    className="text-xs text-gray-600 cursor-pointer ml-1"
                                  >
                                    타겟
                                  </label>
                                </div>
                              )}
                            </div>
                            {!isViewMode && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteRow(item.id)}
                                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">키워드</label>
                              {isViewMode ? (
                                <div className="text-xs sm:text-sm font-medium text-gray-900">{item.keyword}</div>
                              ) : (
                                <Input
                                  type="text"
                                  value={item.keyword}
                                  onChange={(e) => updateRow(item.id, "keyword", e.target.value)}
                                  className="w-full h-9 bg-white text-xs sm:text-sm"
                                  placeholder="키워드 입력"
                                />
                              )}
                            </div>

                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">팀명</label>
                              {isViewMode ? (
                                <div className="text-xs sm:text-sm text-gray-900">{item.teamName}</div>
                              ) : (
                                <Select
                                  value={item.teamName || undefined}
                                  onValueChange={(value) => {
                                    updateRow(item.id, "teamName", value)
                                    updateRow(item.id, "assignee", "")
                                  }}
                                >
                                  <SelectTrigger className="h-9 w-full bg-white text-xs sm:text-sm">
                                    <SelectValue placeholder="팀 선택" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departments.map((dept) => (
                                      <SelectItem key={dept.id} value={dept.name}>
                                        {dept.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>

                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">담당자</label>
                              {isViewMode ? (
                                <div className="text-xs sm:text-sm text-gray-900">{item.assignee}</div>
                              ) : (
                                <Select
                                  value={item.assignee || undefined}
                                  onValueChange={(value) => updateRow(item.id, "assignee", value)}
                                >
                                  <SelectTrigger className="h-9 w-full bg-white text-xs sm:text-sm">
                                    <SelectValue
                                      placeholder={item.teamName ? "담당자 선택" : "먼저 팀 선택"}
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {item.teamName ? (
                                      departments
                                        .find((dept) => dept.name === item.teamName)
                                        ?.members.map((member) => (
                                          <SelectItem key={member} value={member}>
                                            {member}
                                          </SelectItem>
                                        ))
                                    ) : (
                                      <div className="px-2 py-1.5 text-xs sm:text-sm text-gray-500">
                                        먼저 팀을 선택하세요
                                      </div>
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>

                            <div>
                              <label className="text-xs font-medium text-gray-500 mb-1 block">노출 보장 순위</label>
                              {isViewMode ? (
                                <div className="text-xs sm:text-sm text-gray-900">{item.rankLimit}위</div>
                              ) : (
                                <Input
                                  type="number"
                                  value={item.rankLimit}
                                  onChange={(e) => updateRow(item.id, "rankLimit", Number(e.target.value))}
                                  className="w-full h-9 bg-white text-xs sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min="1"
                                  max="100"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.keywordAssignments && (
                  <p className="text-sm text-red-600 px-4 sm:px-5 pb-4">{errors.keywordAssignments}</p>
                )}
              </div>
            </div>

            {/* 비고 섹션 */}
            <div className="border-t pt-6">
              <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-4">
                <Label htmlFor="notes" className="md:w-32 md:pt-2 shrink-0 text-sm text-gray-600">비고</Label>
                <div className="flex-1">
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="추가 메모나 특이사항을 입력하세요"
                    rows={3}
                    className="shadow-none bg-white text-xs sm:text-sm"
                    readOnly={isViewMode}
                    disabled={isViewMode}
                  />
                </div>
              </div>
            </div>

            </div>
          </div>

        {/* 고정 푸터 */}
        <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t bg-white">
          {isViewMode ? (
            <>
              <Button 
                onClick={onClose}
                className="w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
              >
                닫기
              </Button>
              {onEdit && (
                <Button
                  onClick={() => {
                    onClose()
                    onEdit()
                  }}
                  className="py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg px-6"
                >
                  수정
                </Button>
              )}
            </>
          ) : (
            <>
              <Button 
                onClick={onClose}
                className="w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
              >
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                className="py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg px-6"
                disabled={!formData.contractNumber || keywordAssignments.length === 0}
              >
                {mode === "create" ? "등록" : "수정 완료"}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default WorkRegisterModal
