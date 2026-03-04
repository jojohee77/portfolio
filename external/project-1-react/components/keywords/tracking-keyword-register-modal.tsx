"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, Plus, Trash2, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"

interface KeywordItem {
  id: string
  keyword: string
  period: "1일" | "7일" | "30일"
  source?: "manual" | "work" // 수동 입력 또는 업무현황에서 불러옴
  clients?: string[] // 고객사 (선택사항)
  clientInputText?: string // 고객사 입력 필드의 현재 값
  isClientInputVisible?: boolean
  url?: string
}

interface TrackingKeywordRegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (keywords: KeywordItem[]) => void
  initialKeywords?: string[]
  initialClients?: string[]
  remainingMinerals?: number
}

// 추적 기간별 요금 (1키워드당 1미네랄/일)
const PRICING = {
  "1일": 1, // 미네랄
  "7일": 7, // 미네랄
  "30일": 30, // 미네랄
}

export default function TrackingKeywordRegisterModal({
  isOpen,
  onClose,
  onSubmit,
  initialKeywords,
  initialClients,
  remainingMinerals,
}: TrackingKeywordRegisterModalProps) {
  const [keywords, setKeywords] = useState<KeywordItem[]>([])
  const [keywordInput, setKeywordInput] = useState("")
  const [defaultPeriod, setDefaultPeriod] = useState<"1일" | "7일" | "30일">("7일")
  const [isWorkKeywordModalOpen, setIsWorkKeywordModalOpen] = useState(false)
  const [availableWorkKeywords, setAvailableWorkKeywords] = useState<{ contractNumber: string; keywords: string[] }[]>([])
  const [selectedWorkKeywords, setSelectedWorkKeywords] = useState<string[]>([])
  const [expandedContracts, setExpandedContracts] = useState<Set<string>>(new Set())
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [showValidation, setShowValidation] = useState(false)

  const prefillSignatureRef = useRef<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const sanitizedKeywords = Array.from(
      new Set((initialKeywords ?? []).map((keyword) => keyword.trim()).filter((keyword) => keyword))
    )
    const sanitizedClients = Array.from(
      new Set((initialClients ?? []).map((client) => client.trim()).filter((client) => client))
    )

    const signature = `${sanitizedKeywords.join("|")}__${sanitizedClients.join("|")}`

    setKeywords((prev) => {
      if (sanitizedKeywords.length === 0) {
        return prev
      }

      const preparedKeywords: KeywordItem[] = sanitizedKeywords.map((keyword) => ({
        id: `prefill-${keyword}`,
        keyword,
        period: "7일",
        source: "manual" as const,
        clients: [...sanitizedClients],
        clientInputText: "",
        isClientInputVisible: false,
        url: "",
      }))

      const isSameLength = prev.length === preparedKeywords.length
      const isSameContent =
        isSameLength &&
        prev.every((item, index) => {
          const target = preparedKeywords[index]
          const prevClients = item.clients?.join("|") || ""
          const targetClients = target.clients?.join("|") || ""
          return (
            item.keyword === target.keyword &&
            item.period === target.period &&
            item.source === target.source &&
            prevClients === targetClients
          )
        })

      return isSameContent ? prev : preparedKeywords
    })

    if (prefillSignatureRef.current !== signature) {
      prefillSignatureRef.current = signature
      setKeywordInput("")
      setDefaultPeriod("7일")
    }
  }, [isOpen, initialKeywords, initialClients])

  // 업무현황에서 키워드 불러오기 (임시 데이터)
  useEffect(() => {
    // 실제로는 API에서 가져와야 하며, 현재는 /work/task 페이지의 계약-키워드 데이터를 반영한 더미 데이터입니다.
    const workKeywordsByContract = [
      {
        contractNumber: "CT-2024-001",
        keywords: [
          "온라인쇼핑몰",
          "이커머스",
          "쇼핑몰제작",
          "온라인판매",
          "쇼핑몰운영",
          "웹개발",
          "홈페이지제작",
          "반응형웹",
          "웹사이트개발",
        ],
      },
      {
        contractNumber: "CT-2024-002",
        keywords: [
          "브랜딩",
          "소셜미디어",
          "인플루언서",
          "비주얼디자인",
          "그래픽디자인",
          "브랜드디자인",
        ],
      },
      {
        contractNumber: "CT-2024-003",
        keywords: ["맛집", "카페", "리뷰", "맛집추천"],
      },
      {
        contractNumber: "CT-2024-004",
        keywords: [
          "스타트업",
          "창업",
          "벤처기업",
          "스타트업마케팅",
          "창업지원",
          "B2B마케팅",
          "영업전략",
          "비즈니스개발",
          "영업컨설팅",
        ],
      },
      {
        contractNumber: "CT-2024-005",
        keywords: ["온라인교육", "이러닝", "교육플랫폼"],
      },
      {
        contractNumber: "CT-2024-006",
        keywords: ["헬스케어", "건강관리", "웰니스", "헬스케어솔루션"],
      },
      {
        contractNumber: "CT-2024-007",
        keywords: ["리테일", "매장운영", "오프라인마케팅", "고객경험"],
      },
      {
        contractNumber: "CT-2024-008",
        keywords: ["모빌리티", "카셰어링", "전기차", "차량공유"],
      },
      {
        contractNumber: "CT-2024-009",
        keywords: ["여행상품", "투어예약", "관광콘텐츠", "지역마케팅"],
      },
      {
        contractNumber: "CT-2024-010",
        keywords: ["프롭테크", "부동산투자", "임대관리", "상권분석"],
      },
    ]
    setAvailableWorkKeywords(workKeywordsByContract)
  }, [])

  // 총 차감 예정 계산
  const totalMinerals = keywords.reduce((sum, item) => {
    return sum + PRICING[item.period]
  }, 0)

  // 키워드 추가 핸들러
  const handleAddKeyword = () => {
    const keywordText = keywordInput.trim()
    if (!keywordText) return

    // 콤마로 구분된 키워드 처리
    const keywordsToAdd = keywordText.split(",").map((k) => k.trim()).filter((k) => k)

    const newKeywords: KeywordItem[] = keywordsToAdd.map((keyword) => ({
      id: `kw-${Date.now()}-${Math.random()}`,
      keyword,
      period: defaultPeriod,
      source: "manual" as const,
      clients: [],
      clientInputText: "",
      isClientInputVisible: false,
      url: "",
    }))

    setKeywords([...keywords, ...newKeywords])
    setKeywordInput("")
  }

  // 엔터키로 키워드 추가
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddKeyword()
    }
  }

  // 업무현황 키워드 추가
  const handleAddWorkKeyword = (keyword: string) => {
    // 이미 추가된 키워드인지 확인
    if (keywords.some((k) => k.keyword === keyword)) {
      return
    }

    const newKeyword: KeywordItem = {
      id: `kw-${Date.now()}-${Math.random()}`,
      keyword,
      period: defaultPeriod,
      source: "work" as const,
      clients: [],
      clientInputText: "",
      isClientInputVisible: false,
      url: "",
    }

    setKeywords([...keywords, newKeyword])
  }

  // 선택된 업무현황 키워드들 일괄 추가
  const handleAddSelectedWorkKeywords = () => {
    const newKeywords: KeywordItem[] = selectedWorkKeywords
      .filter((keyword) => !keywords.some((k) => k.keyword === keyword))
      .map((keyword) => {
        // 업무현황에서 해당 키워드의 계약번호 정보 찾기
        const contractData = availableWorkKeywords.find((contract) => 
          contract.keywords.includes(keyword)
        )
        return {
          id: `kw-${Date.now()}-${Math.random()}-${keyword}`,
          keyword,
          period: defaultPeriod,
          source: "work" as const,
          clients: contractData ? [contractData.contractNumber] : [],
          clientInputText: "",
          isClientInputVisible: false,
          url: "",
        }
      })

    setKeywords([...keywords, ...newKeywords])
    setSelectedWorkKeywords([])
    setIsWorkKeywordModalOpen(false)
  }

  // 업무현황 모달 열 때 선택 초기화
  const handleOpenWorkKeywordModal = () => {
    setSelectedWorkKeywords([])
    setIsWorkKeywordModalOpen(true)
  }

  // 키워드 선택 토글
  const handleToggleWorkKeyword = (keyword: string) => {
    setSelectedWorkKeywords((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    )
  }

  // 전체 선택/해제
  const handleToggleAllWorkKeywords = () => {
    const allAvailableKeywords = availableWorkKeywords.flatMap((clientData) =>
      clientData.keywords.filter((kw) => !keywords.some((k) => k.keyword === kw))
    )
    if (selectedWorkKeywords.length === allAvailableKeywords.length) {
      setSelectedWorkKeywords([])
    } else {
      setSelectedWorkKeywords(allAvailableKeywords)
    }
  }

  // 고객사 아코디언 토글
  const handleToggleContract = (contractNumber: string) => {
    setExpandedContracts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(contractNumber)) {
        newSet.delete(contractNumber)
      } else {
        newSet.add(contractNumber)
      }
      return newSet
    })
  }

  // 계약번호별 전체 선택/해제
  const handleToggleContractAll = (contractNumber: string, contractKeywords: string[]) => {
    const availableKeywords = contractKeywords.filter((kw) => !keywords.some((k) => k.keyword === kw))
    const selectedCount = availableKeywords.filter((kw) => selectedWorkKeywords.includes(kw)).length
    const isAllSelected = availableKeywords.length > 0 && selectedCount === availableKeywords.length

    if (isAllSelected) {
      // 전체 해제
      setSelectedWorkKeywords((prev) => prev.filter((kw) => !availableKeywords.includes(kw)))
    } else {
      // 전체 선택
      setSelectedWorkKeywords((prev) => {
        const newSelected = [...prev]
        availableKeywords.forEach((kw) => {
          if (!newSelected.includes(kw)) {
            newSelected.push(kw)
          }
        })
        return newSelected
      })
    }
  }

  // 키워드 삭제
  const handleRemoveKeyword = (id: string) => {
    setKeywords(keywords.filter((k) => k.id !== id))
  }

  // 추적 기간 변경
  const handlePeriodChange = (id: string, period: "1일" | "7일" | "30일") => {
    setKeywords(
      keywords.map((k) => (k.id === id ? { ...k, period } : k))
    )
  }

  // 고객사 입력 핸들러
  const handleClientInput = (id: string, clientText: string) => {
    // 입력 필드의 현재 값만 업데이트 (배지 추가는 onKeyDown에서 처리)
    setKeywords(
      keywords.map((k) => {
        if (k.id === id) {
          return { ...k, clientInputText: clientText }
        }
        return k
      })
    )
  }

  const handleClientKeyDown = (id: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const input = e.currentTarget
      const clientName = input.value.trim()
      if (clientName) {
        const keyword = keywords.find((k) => k.id === id)
        const existingClients = keyword?.clients || []
        if (!existingClients.includes(clientName)) {
          setKeywords(
            keywords.map((k) => {
              if (k.id === id) {
                return {
                  ...k,
                  clients: [...existingClients, clientName],
                  clientInputText: "",
                  isClientInputVisible: false,
                }
              }
              return k
            })
          )
        } else {
          // 이미 존재하는 경우 입력만 초기화
          setKeywords(
            keywords.map((k) => {
              if (k.id === id) {
                return { ...k, clientInputText: "", isClientInputVisible: false }
              }
              return k
            })
          )
        }
      }
    }
  }

  const handleRemoveClient = (id: string, clientName: string) => {
    setKeywords(
      keywords.map((k) => {
        if (k.id === id) {
          const updatedClients = k.clients?.filter((c) => c !== clientName) || []
          return {
            ...k,
            clients: updatedClients,
            isClientInputVisible: updatedClients.length === 0 ? false : k.isClientInputVisible,
          }
        }
        return k
      })
    )
  }

  const handleToggleClientInput = (id: string, visible: boolean) => {
    setKeywords(
      keywords.map((k) => {
        if (k.id === id) {
          return { ...k, isClientInputVisible: visible, clientInputText: visible ? k.clientInputText : "" }
        }
        return k
      })
    )
  }

  const handleClientInputBlur = (id: string) => {
    const keyword = keywords.find((k) => k.id === id)
    if (!keyword) {
      return
    }

    if ((keyword.clients?.length ?? 0) > 0 && !(keyword.clientInputText?.trim())) {
      handleToggleClientInput(id, false)
    }
  }

  const handleUrlChange = (id: string, value: string) => {
    setKeywords(
      keywords.map((k) => (k.id === id ? { ...k, url: value } : k))
    )
  }

  // 일괄 추적 기간 변경
  const handleBulkPeriodChange = (period: "1일" | "7일" | "30일") => {
    setKeywords(keywords.map((k) => ({ ...k, period })))
    setDefaultPeriod(period)
  }

  // 폼 초기화
  const handleClose = () => {
    setKeywords([])
    setKeywordInput("")
    setDefaultPeriod("7일")
    setShowValidation(false)
    prefillSignatureRef.current = null
    onClose()
  }

  const hasInvalidUrls = keywords.some((k) => !(k.url && k.url.trim()))
  const isSubmitDisabled = keywords.length === 0

  const getMineralIcon = (value: number) => {
    if (value >= 10) {
      return { src: "/icons/icon-mineral-lg.png", size: 28 }
    }
    return { src: "/icons/icon-mineral-sm.png", size: 24 }
  }

  // 등록하기
  const handleSubmit = () => {
    setShowValidation(true)

    if (keywords.length === 0 || hasInvalidUrls) {
      return
    }

    onSubmit(keywords)
    handleClose()
  }

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      return
    }
    handleClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-lg">
          <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl font-bold">추적 키워드 등록</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* 키워드 입력 영역 */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">키워드 입력</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="키워드를 입력하세요 (콤마로 구분 가능)"
                    className="w-full sm:flex-1"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleAddKeyword}
                      className="flex-1 sm:flex-none whitespace-nowrap shadow-none bg-slate-200 hover:bg-slate-300 text-slate-700"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      추가
                    </Button>
                    <Button
                      type="button"
                      onClick={handleOpenWorkKeywordModal}
                      className="flex-1 sm:flex-none whitespace-nowrap shadow-none bg-slate-200 hover:bg-slate-300 text-slate-700"
                    >
                      키워드 불러오기
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  여러 키워드를 콤마(,)로 구분하여 한 번에 입력할 수 있습니다
                </p>
              </div>

              {/* 일괄 추적 기간 설정 */}
              {keywords.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Label className="text-sm font-medium whitespace-nowrap">일괄 추적 기간 설정:</Label>
                  <div className="flex gap-2">
                    {(["1일", "7일", "30일"] as const).map((period) => (
                      <Button
                        key={period}
                        type="button"
                        variant={defaultPeriod === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleBulkPeriodChange(period)}
                        className={`text-xs shadow-none ${
                          defaultPeriod === period 
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground border-primary" 
                            : ""
                        }`}
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground sm:ml-auto">
                    선택 시 모든 키워드의 추적 기간이 변경됩니다
                  </span>
                </div>
              )}

              {/* 등록된 키워드 목록 */}
              {keywords.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">등록할 키워드 ({keywords.length}개)</Label>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto border rounded-lg p-3">
                    {keywords.map((item) => (
                      <div
                        key={item.id}
                        className="relative p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveKeyword(item.id)}
                          className="absolute top-3 right-3 h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="grid gap-4 sm:grid-cols-4 sm:pr-12">
                          {/* 키워드 */}
                          <div className="space-y-2 min-w-0 order-1 sm:order-1">
                            <Label className="text-xs font-medium text-gray-700">키워드</Label>
                            <Badge
                              variant="outline"
                              className="font-semibold bg-blue-50 text-blue-700 border-blue-300 w-fit"
                            >
                              {item.keyword}
                            </Badge>
                          </div>

                          {/* 고객사 입력 */}
                          <div className="space-y-2 order-2 sm:order-2">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs font-medium text-gray-700">고객사 (선택)</Label>
                              {item.clients && item.clients.length > 0 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleClientInput(item.id, true)}
                                  className="h-6 w-6 rounded-md text-gray-500 hover:text-gray-700"
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                            {item.clients && item.clients.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap gap-2">
                                  {item.clients.map((client, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="flex items-center gap-1 bg-gray-100 text-gray-700 border-gray-300 h-6"
                                    >
                                      {client}
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveClient(item.id, client)}
                                        className="ml-1 hover:text-red-600"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                                {item.isClientInputVisible && (
                                  <div className="w-full sm:w-auto max-w-[220px]">
                                    <Input
                                      type="text"
                                      placeholder="입력 후 Enter"
                                      value={item.clientInputText || ""}
                                      onChange={(e) => handleClientInput(item.id, e.target.value)}
                                      onKeyDown={(e) => handleClientKeyDown(item.id, e)}
                                      onBlur={() => handleClientInputBlur(item.id)}
                                      className="w-full h-8 text-xs placeholder:text-[12px] bg-white"
                                      autoFocus
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Input
                                type="text"
                                placeholder="입력 후 Enter"
                                value={item.clientInputText || ""}
                                onChange={(e) => handleClientInput(item.id, e.target.value)}
                                onKeyDown={(e) => handleClientKeyDown(item.id, e)}
                                className="w-full h-9 text-xs placeholder:text-[12px] bg-white"
                              />
                            )}
                          </div>

                          {/* 추적 기간 */}
                          <div className="space-y-2 order-3 sm:order-3">
                            <Label className="text-xs font-medium text-gray-700">추적 기간</Label>
                            <Select
                              value={item.period}
                              onValueChange={(value: "1일" | "7일" | "30일") =>
                                handlePeriodChange(item.id, value)
                              }
                            >
                              <SelectTrigger className="w-full h-9 text-xs bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1일">1일</SelectItem>
                                <SelectItem value="7일">7일</SelectItem>
                                <SelectItem value="30일">30일</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* 차감 예정 */}
                          <div className="space-y-2 order-5 sm:order-4">
                            <Label className="text-xs font-medium text-gray-700">차감 예정</Label>
                            <div className="h-9 flex items-center text-xs font-semibold text-primary">
                              {PRICING[item.period].toLocaleString()} 미네랄
                            </div>
                          </div>
                          {/* URL 입력 */}
                          <div className="space-y-2 sm:col-span-4 order-4 sm:order-5">
                            <Label className="text-xs font-medium text-gray-700">URL</Label>
                            <Input
                              type="url"
                              required
                              placeholder="키워드와 관련된 URL을 입력하세요"
                              value={item.url ?? ""}
                              onChange={(e) => handleUrlChange(item.id, e.target.value)}
                              className={`w-full h-9 text-xs placeholder:text-[12px] bg-white ${showValidation && !(item.url && item.url.trim()) ? "border-destructive focus-visible:ring-destructive/40" : ""}`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 하단: 미네랄 차감 정보 및 등록 버튼 */}
          <DialogFooter className="px-6 py-4 border-t bg-gray-50 flex-shrink-0 rounded-b-lg">
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <div className="relative">
                    <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setIsTooltipOpen(!isTooltipOpen)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 inline-flex items-center justify-center rounded-md cursor-pointer"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top"
                        sideOffset={5}
                        className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 max-w-sm"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                            <Info className="h-4 w-4 text-blue-500" />
                            비용 안내
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs text-gray-600">
                              • 1키워드당 1미네랄
                            </p>
                            <p className="text-xs text-gray-600">
                              • 1일: {PRICING["1일"].toLocaleString()} 미네랄
                            </p>
                            <p className="text-xs text-gray-600">
                              • 7일: {PRICING["7일"].toLocaleString()} 미네랄
                            </p>
                            <p className="text-xs text-gray-600">
                              • 30일: {PRICING["30일"].toLocaleString()} 미네랄
                            </p>
                          </div>
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-2">
                              <Info className="h-4 w-4 text-blue-500" />
                              순위 업데이트
                            </div>
                            <p className="text-xs text-gray-600">
                              순위 업데이트는 매일 오전 9시 업데이트 됩니다.
                            </p>
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {(() => {
                    const mineralIcon = getMineralIcon(totalMinerals)
                    return (
                      <Image
                        src={mineralIcon.src}
                        alt="미네랄 아이콘"
                        width={mineralIcon.size}
                        height={mineralIcon.size}
                        className="shrink-0"
                      />
                    )
                  })()}
                  <span>차감 예정:</span>
                  <span className="text-lg font-bold text-primary">{totalMinerals.toLocaleString()}</span>
                  <span className="text-sm font-medium text-primary">미네랄</span>
                </div>
                {typeof remainingMinerals === "number" && (
                  <span className="text-xs text-muted-foreground">
                    (잔여 미네랄: {remainingMinerals.toLocaleString()})
                  </span>
                )}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <Button 
                  type="button"
                  onClick={handleClose}
                  className="flex-1 sm:flex-none sm:w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitDisabled}
                  className="flex-1 sm:flex-none py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg px-6"
                >
                  등록하기
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 업무현황 키워드 선택 모달 */}
      <Dialog open={isWorkKeywordModalOpen} onOpenChange={(open) => {
        setIsWorkKeywordModalOpen(open)
        if (!open) {
          setSelectedWorkKeywords([])
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>업무현황 키워드 불러오기</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                등록할 키워드를 선택하세요 (이미 추가된 키워드는 제외됩니다)
              </div>
              {availableWorkKeywords.flatMap((cd) => cd.keywords).filter((kw) => !keywords.some((k) => k.keyword === kw)).length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleAllWorkKeywords}
                  className="text-xs"
                >
                  {selectedWorkKeywords.length === availableWorkKeywords.flatMap((cd) => cd.keywords).filter((kw) => !keywords.some((k) => k.keyword === kw)).length
                    ? "전체 해제"
                    : "전체 선택"}
                </Button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-2">
              {availableWorkKeywords.map((contractData) => {
                const availableKeywords = contractData.keywords.filter((kw) => !keywords.some((k) => k.keyword === kw))
                if (availableKeywords.length === 0) return null
                
                const isExpanded = expandedContracts.has(contractData.contractNumber)
                const selectedCount = availableKeywords.filter((kw) => selectedWorkKeywords.includes(kw)).length
                const isAllSelected = availableKeywords.length > 0 && selectedCount === availableKeywords.length
                
                return (
                  <div key={contractData.contractNumber} className="border rounded-lg overflow-hidden">
                    {/* 고객사 헤더 */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div
                        className="flex items-center gap-2 flex-1 cursor-pointer"
                        onClick={() => handleToggleContract(contractData.contractNumber)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        )}
                        <span className="font-semibold text-gray-900">
                          {contractData.contractNumber}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({availableKeywords.length})
                        </span>
                      </div>
                      <div
                        className="flex items-center"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleContractAll(contractData.contractNumber, contractData.keywords)
                        }}
                      >
                        <Checkbox
                          checked={isAllSelected}
                          onCheckedChange={() => handleToggleContractAll(contractData.contractNumber, contractData.keywords)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    {/* 키워드 목록 (아코디언) */}
                    {isExpanded && (
                      <div className="p-2 space-y-1 bg-white">
                        {availableKeywords.map((keyword) => {
                          const isSelected = selectedWorkKeywords.includes(keyword)
                          return (
                            <div
                              key={keyword}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleWorkKeyword(keyword)
                              }}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleToggleWorkKeyword(keyword)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="text-xs text-gray-700 flex-1">
                                {keyword}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
              {availableWorkKeywords.flatMap((cd) => cd.keywords).filter((kw) => !keywords.some((k) => k.keyword === kw)).length === 0 && (
                <div className="text-center text-sm text-gray-500 py-8">
                  불러올 수 있는 키워드가 없습니다
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsWorkKeywordModalOpen(false)
                setSelectedWorkKeywords([])
              }}
              className="flex-1 sm:flex-none shadow-none"
            >
              닫기
            </Button>
            <Button
              onClick={handleAddSelectedWorkKeywords}
              disabled={selectedWorkKeywords.length === 0}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              추가 ({selectedWorkKeywords.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

