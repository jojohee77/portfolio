"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { StepIndicator, Step } from "@/components/ui/step-indicator"
import { SearchForm } from "@/components/ui/search-form"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

interface TeamLeader {
  value: string
  name: string
  email: string
}

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TeamFormData) => void
  mode: 'add' | 'edit'
  initialData?: {
    name: string
    leader: string
    description: string
    members?: number[] // 기존 팀원 ID 배열
  }
}

interface TeamFormData {
  name: string
  leader: string
  description: string
  members?: number[]
}

interface TeamMember {
  id: number
  name: string
  email: string
  position: string
}

const teamLeaders: TeamLeader[] = [
  { value: "팀장을 선택해주세요", name: "팀장을 선택해주세요", email: "" },
  { value: "박나리", name: "박나리", email: "park.nari@company.com" },
  { value: "김철수", name: "김철수", email: "kim.chulsoo@company.com" },
  { value: "이영희", name: "이영희", email: "lee.younghee@company.com" },
  { value: "정민수", name: "정민수", email: "jung.minsu@company.com" },
  { value: "김승우", name: "김승우", email: "kim.seungwoo@company.com" },
  { value: "강수진", name: "강수진", email: "kang.sujin@company.com" },
  { value: "윤태호", name: "윤태호", email: "yoon.taeho@company.com" },
  { value: "한소영", name: "한소영", email: "han.soyoung@company.com" },
  { value: "송민준", name: "송민준", email: "song.minjun@company.com" },
  { value: "강지민", name: "강지민", email: "kang.jimin@company.com" },
  { value: "박서준", name: "박서준", email: "park.seojun@company.com" },
  { value: "이하은", name: "이하은", email: "lee.haeun@company.com" },
  { value: "김영수", name: "김영수", email: "kim.youngsu@company.com" },
  { value: "박지훈", name: "박지훈", email: "park.jihun@company.com" },
  { value: "최수진", name: "최수진", email: "choi.sujin@company.com" },
  { value: "정우성", name: "정우성", email: "jung.woosung@company.com" },
  { value: "강동원", name: "강동원", email: "kang.dongwon@company.com" },
  { value: "윤아", name: "윤아", email: "yoon.ah@company.com" },
  { value: "이민호", name: "이민호", email: "lee.minho@company.com" },
  { value: "송혜교", name: "송혜교", email: "song.hyekyo@company.com" },
  { value: "홍길동", name: "홍길동", email: "hong.gildong@company.com" }
]

const availableMembers: TeamMember[] = [
  { id: 1, name: "김철수", email: "kim@company.com", position: "팀장" },
  { id: 2, name: "이영희", email: "lee@company.com", position: "팀원" },
  { id: 3, name: "박민수", email: "park@company.com", position: "팀원" },
  { id: 4, name: "정지은", email: "jung@company.com", position: "팀원" },
  { id: 5, name: "최현우", email: "choi@company.com", position: "팀원" },
  { id: 6, name: "강수진", email: "kang@company.com", position: "팀원" },
  { id: 7, name: "윤태호", email: "yoon@company.com", position: "팀원" },
  { id: 8, name: "한소영", email: "han@company.com", position: "팀원" }
]

export default function TeamModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode, 
  initialData 
}: TeamModalProps) {
  const [currentStep, setCurrentStep] = useState(1) // 1: 팀 정보, 2: 팀원 추가, 3: 완료
  const [formData, setFormData] = useState<TeamFormData>({
    name: initialData?.name || "",
    leader: initialData?.leader || "팀장을 선택해주세요",
    description: initialData?.description || "",
    members: []
  })
  const [leaderSearch, setLeaderSearch] = useState("")
  const [memberSearch, setMemberSearch] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<Set<number>>(new Set())
  const searchRef = useRef<HTMLInputElement>(null)
  const memberSearchRef = useRef<HTMLInputElement>(null)

  // 검색 필드 포커스 유지
  useEffect(() => {
    if (leaderSearch && searchRef.current) {
      searchRef.current.focus()
    }
  }, [leaderSearch])

  useEffect(() => {
    if (memberSearch && memberSearchRef.current) {
      memberSearchRef.current.focus()
    }
  }, [memberSearch])

  // 모달이 열릴 때 초기 데이터 설정
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1)
      if (initialData) {
        setFormData({
          name: initialData.name || "",
          leader: initialData.leader || "팀장을 선택해주세요",
          description: initialData.description || "",
          members: initialData.members || []
        })
        // 기존 팀원들을 선택된 상태로 설정
        setSelectedMembers(new Set(initialData.members || []))
      } else if (mode === 'add') {
        setFormData({
          name: "",
          leader: "팀장을 선택해주세요",
          description: "",
          members: []
        })
        setSelectedMembers(new Set())
      }
      setLeaderSearch("")
      setMemberSearch("")
    }
  }, [isOpen, initialData, mode])

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      members: Array.from(selectedMembers)
    }
    onSubmit(finalData)
    setFormData({
      name: "",
      leader: "팀장을 선택해주세요",
      description: "",
      members: []
    })
    setSelectedMembers(new Set())
    setLeaderSearch("")
    setMemberSearch("")
    setCurrentStep(1)
  }

  const handleClose = () => {
    onClose()
    setLeaderSearch("")
    setMemberSearch("")
    setSelectedMembers(new Set())
    setCurrentStep(1)
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2)
    } else {
      handleSubmit()
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(1)
  }

  const filteredLeaders = leaderSearch.length >= 2 
    ? teamLeaders.filter(leader => 
        leader.name.toLowerCase().includes(leaderSearch.toLowerCase()) ||
        (leader.email && leader.email.toLowerCase().includes(leaderSearch.toLowerCase()))
      )
    : teamLeaders

  const filteredMembers = memberSearch.length >= 2
    ? availableMembers.filter(member =>
        member.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        member.email.toLowerCase().includes(memberSearch.toLowerCase())
      )
    : availableMembers

  // 체크된 사원들을 맨 위로 정렬
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aSelected = selectedMembers.has(a.id)
    const bSelected = selectedMembers.has(b.id)
    
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    return 0
  })

  const getTitle = () => {
    if (mode === 'edit') return '팀 정보 수정'
    return '새 팀 추가'
  }

  // 공통 스텝 정의
  const teamSteps: Step[] = [
    { number: 1, title: '팀 정보' },
    { number: 2, title: '팀원 선택' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[512px] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-2">
          <DialogTitle className="text-xl font-semibold">{getTitle()}</DialogTitle>
          {mode === 'add' && (
            <div className="mt-3">
              <StepIndicator 
                steps={teamSteps}
                currentStep={currentStep}
                compact={true}
              />
            </div>
          )}
        </DialogHeader>
        
        <div className="py-2">
          <div className="space-y-4">
            {/* 1단계: 팀 정보 */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <Label htmlFor="teamName" className="text-sm font-medium text-gray-600 w-full sm:w-24 flex-shrink-0">
                    팀명 <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="teamName" 
                    placeholder="팀명을 입력하세요" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="placeholder:text-gray-400 w-full shadow-none bg-white" 
                  />
                </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <Label htmlFor="teamLeader" className="text-sm font-medium text-gray-600 w-full sm:w-24 flex-shrink-0">
                  팀장
                </Label>
                <Select 
                  value={formData.leader} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, leader: value }))}
                  onOpenChange={(open) => {
                    if (!open) {
                      setLeaderSearch("")
                    }
                  }}
                >
                  <SelectTrigger className="bg-white shadow-none w-full">
                    <SelectValue placeholder="팀장을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {/* 검색 필드 */}
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          ref={searchRef}
                          placeholder="이름 or 이메일로 검색"
                          value={leaderSearch}
                          onChange={(e) => {
                            e.preventDefault()
                            setLeaderSearch(e.target.value)
                          }}
                          className="pl-8 h-8 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {/* 팀장 목록 */}
                    <div className="max-h-40 overflow-y-auto">
                      {(() => {
                        if (leaderSearch.length >= 2 && filteredLeaders.length === 0) {
                          return (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              검색 결과가 없습니다.
                            </div>
                          )
                        }
                        
                        return filteredLeaders.map((leader) => (
                          <SelectItem key={leader.value} value={leader.value} className="py-2">
                            <div className="flex items-center justify-between w-full gap-4">
                              <span className={`font-medium ${leader.value === "팀장을 선택해주세요" ? "text-gray-500" : ""}`}>
                                {leader.name}
                              </span>
                              {leader.email && (
                                <span className="text-xs text-gray-500">{leader.email}</span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      })()}
                    </div>
                  </SelectContent>
                </Select>
              </div>
              
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
                  <Label htmlFor="teamDescription" className="text-sm font-medium text-gray-600 w-full sm:w-24 flex-shrink-0 mt-1">
                    설명
                  </Label>
                  <Textarea 
                    id="teamDescription" 
                    placeholder="팀에 대한 설명을 입력하세요"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[80px] placeholder:text-gray-400 w-full shadow-none bg-white"
                  />
                </div>
              </div>
            )}

            {/* 2단계: 팀원 선택 (팀 추가 모드에서만) */}
            {currentStep === 2 && mode === 'add' && (
              <div className="space-y-4">
                {/* 검색 영역 */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <SearchForm
                    ref={memberSearchRef}
                    placeholder="사원을 검색하세요"
                    value={memberSearch}
                    onChange={(value) => setMemberSearch(value)}
                  />
                </div>

                {/* 사원 리스트 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">등록된 사원 ({selectedMembers.size}명 선택됨)</h3>
                  </div>
                  <div className="divide-y max-h-96 overflow-y-auto">
                    {sortedMembers.map((member) => (
                      <div 
                        key={member.id} 
                        className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          const newSelected = new Set(selectedMembers)
                          if (selectedMembers.has(member.id)) {
                            newSelected.delete(member.id)
                          } else {
                            newSelected.add(member.id)
                          }
                          setSelectedMembers(newSelected)
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            id={`member-${member.id}`}
                            checked={selectedMembers.has(member.id)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedMembers)
                              if (checked) {
                                newSelected.add(member.id)
                              } else {
                                newSelected.delete(member.id)
                              }
                              setSelectedMembers(newSelected)
                            }}
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/icons/icon-user-m.png" />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-muted-foreground">{member.email}</div>
                            <div className="text-xs text-muted-foreground">{member.position}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 액션 버튼 */}
        <div className="flex-shrink-0 flex justify-end gap-3 pt-4 border-t bg-white">
          {/* 팀 추가 모드: 1단계일 때 다음 버튼만 */}
          {mode === 'add' && currentStep === 1 && (
            <Button 
              onClick={handleNextStep}
              className="w-20 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg"
            >
              다음
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}

          {/* 팀 추가 모드: 2단계일 때 이전(왼쪽), 취소/저장(오른쪽) */}
          {mode === 'add' && currentStep === 2 && (
            <>
              <Button 
                onClick={handlePrevStep} 
                variant="outline"
                className="w-auto py-3 h-12 text-sm font-medium rounded-lg mr-auto"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                이전
              </Button>
              <Button 
                onClick={handleClose} 
                className="w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
              >
                취소
              </Button>
              <Button 
                onClick={handleNextStep}
                className="w-20 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg"
              >
                저장
              </Button>
            </>
          )}

          {/* 팀 수정 모드: 취소/수정 버튼 */}
          {mode === 'edit' && (
            <>
              <Button 
                onClick={handleClose} 
                className="w-20 py-3 h-12 bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm font-medium rounded-lg"
              >
                취소
              </Button>
              <Button 
                onClick={handleSubmit}
                className="w-20 py-3 h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium rounded-lg"
              >
                수정
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
