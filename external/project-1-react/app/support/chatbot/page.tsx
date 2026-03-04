"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Send,
  ArrowUp,
  Bot,
  User,
  DollarSign,
  Building,
  Users,
  Briefcase,
  TrendingUp,
  FileSignature,
  Target,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  Archive,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Message {
  id: number
  sender: "user" | "bot"
  text: string
  timestamp: Date
}

const formatMessageText = (text: string) => {
  // Split text by lines to handle each line separately
  const lines = text.split("\n")

  return lines.map((line, lineIndex) => {
    // Handle headers (** text **)
    let formattedLine = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

    // Handle code blocks (` text `)
    formattedLine = formattedLine.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>',
    )

    // Handle bullet points
    if (line.trim().startsWith("•")) {
      return (
        <div key={lineIndex} className="flex items-start space-x-2 my-1">
          <span className="text-blue-600 font-bold">•</span>
          <span dangerouslySetInnerHTML={{ __html: formattedLine.replace("•", "").trim() }} />
        </div>
      )
    }

    // Handle table rows (| text | text |)
    if (line.includes("|") && line.split("|").length > 2) {
      const cells = line.split("|").filter((cell) => cell.trim() !== "")
      const isHeader = line.includes("---") // Check if it's a separator line

      if (isHeader) {
        return <div key={lineIndex} className="border-b-2 border-slate-300 my-2"></div>
      }

      return (
        <div
          key={lineIndex}
          className="grid grid-cols-3 gap-4 border-b border-slate-200 py-3 hover:bg-blue-50 rounded-lg transition-colors"
        >
          {cells.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`px-4 py-2 text-sm rounded ${
                cellIndex === 0 ? "font-semibold text-slate-800 bg-slate-100" : "text-slate-700 bg-white"
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: cell.trim() }} />
            </div>
          ))}
        </div>
      )
    }

    // Handle progress bars (for percentages)
    if (line.includes("%") && (line.includes("달성") || line.includes("완료율"))) {
      const percentMatch = line.match(/(\d+(?:\.\d+)?)%/)
      if (percentMatch) {
        const percentage = Number.parseFloat(percentMatch[1])
        const color =
          percentage >= 90
            ? "bg-emerald-500"
            : percentage >= 70
              ? "bg-blue-500"
              : percentage >= 50
                ? "bg-amber-500"
                : "bg-rose-500"

        return (
          <div key={lineIndex} className="my-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm" dangerouslySetInnerHTML={{ __html: formattedLine }} />
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 shadow-inner">
              <div
                className={`${color} h-3 rounded-full transition-all duration-700 shadow-sm`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )
      }
    }

    // Handle statistics with numbers (for KPI display)
    if (line.includes("₩") || (line.includes(":") && line.match(/\d+/))) {
      const parts = line.split(":")
      if (parts.length === 2) {
        return (
          <div
            key={lineIndex}
            className="flex justify-between items-center py-2 px-3 border-b border-slate-200 hover:bg-slate-50 rounded transition-colors"
          >
            <span className="text-sm font-medium text-slate-700">{parts[0].trim()}</span>
            <span
              className="text-sm font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded"
              dangerouslySetInnerHTML={{ __html: parts[1].trim() }}
            />
          </div>
        )
      }
    }

    // Handle checkmarks and warnings
    if (line.trim().startsWith("✅") || line.trim().startsWith("⚠️") || line.trim().startsWith("❌")) {
      return (
        <div key={lineIndex} className="flex items-start space-x-3 my-2 p-2 rounded-lg bg-slate-50">
          <span
            className={`text-lg ${
              line.trim().startsWith("✅")
                ? "text-green-600"
                : line.trim().startsWith("⚠️")
                  ? "text-amber-600"
                  : "text-red-600"
            }`}
          >
            {line.trim().charAt(0)}
          </span>
          <span className="text-slate-700" dangerouslySetInnerHTML={{ __html: formattedLine.substring(2).trim() }} />
        </div>
      )
    }

    // Regular lines
    if (line.trim() === "") {
      return <br key={lineIndex} />
    }

    return <div key={lineIndex} dangerouslySetInnerHTML={{ __html: formattedLine }} />
  })
}

interface RecentQuestion {
  id: string
  text: string
  timestamp: Date
}

export default function ChatbotPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "안녕하세요! AgOffice AI 어시스턴트입니다.\n무엇을 도와드릴까요?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([])
  const [isRecentSearchExpanded, setIsRecentSearchExpanded] = useState(true)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // localStorage에서 최근 질문 불러오기
  useEffect(() => {
    // 기본 모의 질문 데이터
    const mockQuestions: RecentQuestion[] = [
      {
        id: "mock-1",
        text: "이번달은 왜 매출이 저조해?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
      },
      {
        id: "mock-2",
        text: "이번 달 매출",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5시간 전
      },
      {
        id: "mock-3",
        text: "거래처 현황",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1일 전
      },
    ]

    const savedQuestions = localStorage.getItem("chatbot_recent_questions")
    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions).map((q: any) => ({
          ...q,
          timestamp: new Date(q.timestamp),
        }))
        setRecentQuestions(parsed)
      } catch (error) {
        console.error("Failed to parse recent questions:", error)
        // 파싱 실패 시 기본 데이터 설정
        setRecentQuestions(mockQuestions)
        localStorage.setItem("chatbot_recent_questions", JSON.stringify(mockQuestions))
      }
    } else {
      // 저장된 데이터가 없을 때 기본 모의 데이터 설정
      setRecentQuestions(mockQuestions)
      localStorage.setItem("chatbot_recent_questions", JSON.stringify(mockQuestions))
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // 최근 질문 저장하기
  const saveRecentQuestion = (question: string) => {
    const newQuestion: RecentQuestion = {
      id: Date.now().toString(),
      text: question,
      timestamp: new Date(),
    }

    setRecentQuestions((prev) => {
      // 중복 제거 및 최대 20개까지만 저장
      const filtered = prev.filter((q) => q.text !== question)
      const updated = [newQuestion, ...filtered].slice(0, 20)
      localStorage.setItem("chatbot_recent_questions", JSON.stringify(updated))
      return updated
    })
  }

  // 최근 질문 삭제하기
  const removeRecentQuestion = (id: string) => {
    setRecentQuestions((prev) => {
      const updated = prev.filter((q) => q.id !== id)
      localStorage.setItem("chatbot_recent_questions", JSON.stringify(updated))
      return updated
    })
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    {
      id: "revenue",
      label: "이번 달 매출",
      icon: DollarSign,
      color: "bg-green-500 hover:bg-green-600",
      response: `📊 **2024년 6월 매출 현황**

**총 매출**: ₩361,068,788
**전월 대비**: +0% (변동 없음)
**목표 달성률**: 85.2%

**팀별 매출 현황**:
• 1팀: ₩95,000,000 (26.3%)
• 2팀: ₩87,000,000 (24.1%)
• 3팀: ₩72,000,000 (19.9%)
• 4팀: ₩31,000,000 (8.6%)

**성과 지표**:
매출 목표 달성률: 85.2%
신규 고객 확보율: 125%
고객 만족도: 92%
프로젝트 완료율: 80%

**주요 성과**:
✅ 신규 계약 3건 체결
✅ 월 목표의 85% 달성
⚠️ 전월 대비 성장률 개선 필요`,
    },
    {
      id: "clients",
      label: "거래처 현황",
      icon: Building,
      color: "bg-blue-500 hover:bg-blue-600",
      response: `🏢 **거래처 현황 요약**

**총 거래처**: 34개 업체
**신규 거래처**: 5개 (이번 달)
**활성 계약**: 28건

**지역별 분포**:
• 서울/경기: 18개 (52.9%)
• 부산/경남: 8개 (23.5%)
• 대구/경북: 5개 (14.7%)
• 기타 지역: 3개 (8.8%)

**업종별 분포**:
• IT/테크: 12개 (35.3%)
• 제조업: 8개 (23.5%)
• 서비스업: 7개 (20.6%)
• 기타: 7개 (20.6%)

**계약 갱신 예정**: 6개 업체 (다음 달)`,
    },
    {
      id: "staff",
      label: "직원 정보",
      icon: Users,
      color: "bg-purple-500 hover:bg-purple-600",
      response: `👥 **직원 현황 정보**

**총 직원 수**: 24명
**팀별 구성**:
• 1팀: 6명 (팀장: 김영희)
• 2팀: 6명 (팀장: 박민수)
• 3팀: 6명 (팀장: 최민호)
• 4팀: 6명 (팀장: 이상훈)

**이번 달 성과**:
• 평균 인당 매출: ₩11,875,000
• 최고 성과팀: 1팀 (₩15,833,333/인)
• 업무 완료율: 87.5%

**근무 현황**:
✅ 출근: 22명
🏠 재택: 2명
📝 진행 중인 프로젝트: 156건`,
    },
    {
      id: "projects",
      label: "프로젝트 현황",
      icon: Briefcase,
      color: "bg-orange-500 hover:bg-orange-600",
      response: `📋 **프로젝트 진행 현황**

**전체 프로젝트**: 156건
**진행 상태**:
• 진행 중: 23건 (14.7%)
• 완료: 125건 (80.1%)
• 대기: 8건 (5.1%)

**이번 주 마감 예정**: 8건
**지연 프로젝트**: 2건 ⚠️

**팀별 프로젝트 수**:
• 1팀: 45건 (완료율: 88.9%)
• 2팀: 38건 (완료율: 84.2%)
• 3팀: 42건 (완료율: 78.6%)
• 4팀: 31건 (완료율: 71.0%)

**우선순위 높은 프로젝트**: 5건
**클라이언트 피드백 대기**: 3건`,
    },
    {
      id: "performance",
      label: "성과 분석",
      icon: TrendingUp,
      color: "bg-teal-500 hover:bg-teal-600",
      response: `📈 **성과 분석 리포트**

**월별 성장률**:
• 1월 → 2월: +4.2%
• 2월 → 3월: +5.8%
• 3월 → 4월: +4.1%
• 4월 → 5월: +3.7%
• 5월 → 6월: +0.0%

**KPI 달성 현황**:
✅ 매출 목표: 85.2% 달성
✅ 신규 고객: 125% 달성
⚠️ 고객 만족도: 92% (목표: 95%)
❌ 프로젝트 완료율: 80% (목표: 85%)

**개선 포인트**:
• 6월 매출 성장 정체 원인 분석 필요
• 프로젝트 완료율 향상 방안 검토
• 고객 만족도 개선 액션 플랜 수립`,
    },
    {
      id: "contracts",
      label: "계약 현황",
      icon: FileSignature,
      color: "bg-indigo-500 hover:bg-indigo-600",
      response: `📋 **계약 현황 요약**

**총 계약 건수**: 6건
**계약 상태별 현황**:

| 상태 | 건수 | 계약금액 |
|------|------|----------|
| 진행중 | 3건 | ₩285,000,000 |
| 신규 | 1건 | ₩45,000,000 |
| 완료 | 1건 | ₩32,000,000 |
| 만료 | 1건 | ₩96,000,000 |

**이번 달 주요 계약**:
• 스마트테크: ₩85,000,000 (연계약)
• 패션하우스: ₩128,000,000 (연계약)
• 그린푸드: ₩32,000,000 (프로젝트)

**만료 예정 계약**: 0건
**갱신 검토 필요**: 2건`,
    },
    {
      id: "posting",
      label: "포스팅 현황",
      icon: Target,
      color: "bg-pink-500 hover:bg-pink-600",
      response: `🎯 **포스팅 성과 현황**

**총 포스팅 수**: 21건
**키워드 성과**:
• 상위 5위 내: 8개 (38.1%)
• 6-10위: 7개 (33.3%)
• 11위 이하: 6개 (28.6%)

**거래처별 포스팅 분포**:
• 스마트테크: 3건 (평균 순위: 7.3위)
• 패션하우스: 2건 (평균 순위: 3.0위)
• 그린푸드: 1건 (평균 순위: 2.0위)
• 기타: 15건

**이번 달 성과**:
✅ 신규 포스팅: 5건
✅ 순위 상승: 12개 키워드
⚠️ 재작업 필요: 3건

**평균 키워드 순위**: 8.2위`,
    },
  ]

  // 질문에 대한 답변 생성
  const generateAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase()

    // 매출 저조 관련 질문
    if (
      lowerQuestion.includes("매출") &&
      (lowerQuestion.includes("저조") ||
        lowerQuestion.includes("왜") ||
        lowerQuestion.includes("이유") ||
        lowerQuestion.includes("원인") ||
        lowerQuestion.includes("나쁘") ||
        lowerQuestion.includes("낮"))
    ) {
      return `📊 **매출 저조 원인 분석**

10월은 **A, B 업체가 이탈한 것이 주요 원인**으로 보입니다.

**주요 요인**:
• 업체 이탈: 주요 거래처 2개사와 계약 종료
• 신규 매출 부족: 9월 대비 신규 거래처 확보 미흡
• 기존 고객 이탈 영향: 월간 매출의 약 15% 감소

**개선 방안**:
✅ 신규 매출 증대에 집중 필요
✅ 기존 고객 유지율 향상 프로그램 실행
✅ 신규 거래처 영업 활동 강화

현재 전월 대비 성장률 개선이 필요한 상황이며, 특히 신규 매출 증대에 우선순위를 두는 것이 효과적일 것으로 판단됩니다.`
    }

    // 기본 답변
    return "죄송합니다. 현재 해당 질문에 대한 구체적인 답변을 준비 중입니다. 위의 빠른 액션 버튼을 사용해 주시거나, 다른 질문을 해주세요."
  }

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    const userMessage: Message = {
      id: messages.length + 1,
      sender: "user",
      text: action.label,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    saveRecentQuestion(action.label)
    setIsTyping(true)

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        sender: "bot",
        text: action.response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  const sendMessage = () => {
    if (inputMessage.trim() !== "") {
      const questionText = inputMessage.trim()
      const userMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: questionText,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      saveRecentQuestion(questionText)
      setInputMessage("")
      setIsTyping(true)

      setTimeout(() => {
        const botMessage: Message = {
          id: messages.length + 2,
          sender: "bot",
          text: generateAnswer(questionText),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      }, 1000)
    }
  }

  // 최근 질문 클릭 핸들러
  const handleRecentQuestionClick = (question: string) => {
    const questionText = question.trim()
    if (questionText === "") return

    setMessages((prev) => {
      const userMessage: Message = {
        id: prev.length + 1,
        sender: "user",
        text: questionText,
        timestamp: new Date(),
      }
      return [...prev, userMessage]
    })
    saveRecentQuestion(questionText)
    setIsTyping(true)

    setTimeout(() => {
      setMessages((prev) => {
        const botMessage: Message = {
          id: prev.length + 1,
          sender: "bot",
          text: generateAnswer(questionText),
          timestamp: new Date(),
        }
        return [...prev, botMessage]
      })
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          currentPage="support/chatbot"
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 w-full max-w-full flex gap-4 overflow-hidden">
          {isLoading ? (
            <>
              <Card
                className={`${
                  isRecentSearchExpanded ? "w-64 lg:w-72" : "w-16"
                } flex-shrink-0 shadow-none rounded-xl border border-gray-200 flex flex-col overflow-hidden hidden md:flex transition-[width] duration-300 ease-in-out will-change-[width]`}
              >
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 flex items-center px-2 py-3 overflow-hidden relative">
                    {isRecentSearchExpanded ? (
                      <div className="flex items-center justify-between w-full min-w-[240px]">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4 rounded-full" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-6 w-6 rounded-lg" />
                      </div>
                    ) : (
                      <Skeleton className="h-6 w-6 rounded-lg mx-auto" />
                    )}
                  </div>
                  {isRecentSearchExpanded && (
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                      {[...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 bg-white p-3 space-y-2"
                        >
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <div className="flex-shrink-0 mb-4 sm:mb-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-lg md:hidden" />
                  </div>
                </div>

                <Card className="flex-1 shadow-none rounded-2xl border border-gray-200 w-full flex flex-col overflow-hidden min-h-0">
                  <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
                      {[...Array(4)].map((_, index) => (
                        <div
                          key={`message-skeleton-${index}`}
                          className={`flex ${index % 2 === 0 ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`flex items-start space-x-3 max-w-3xl ${
                              index % 2 !== 0 ? "flex-row-reverse space-x-reverse" : ""
                            }`}
                          >
                            <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 space-y-2 w-[220px] sm:w-[320px]">
                              <Skeleton className={`h-4 ${index % 2 === 0 ? "w-3/4" : "w-2/3"}`} />
                              <Skeleton className="h-4 w-11/12" />
                              <Skeleton className={`h-3 ${index % 2 === 0 ? "w-16" : "w-20"}`} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                        {[...Array(6)].map((_, index) => (
                          <Skeleton
                            key={`quick-action-skeleton-${index}`}
                            className="h-10 w-28 sm:w-32 rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 sm:p-6">
                      <div className="flex space-x-3">
                        <Skeleton className="h-12 flex-1 rounded-lg" />
                        <Skeleton className="h-12 w-12 rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <>
              <Card
                className={`${
                  isRecentSearchExpanded ? "w-64 lg:w-72" : "w-16"
                } flex-shrink-0 shadow-none rounded-xl border border-gray-200 flex flex-col overflow-hidden hidden md:flex transition-[width] duration-300 ease-in-out will-change-[width]`}
              >
                <CardContent className="p-0 flex flex-col h-full">
                  {/* 헤더 */}
                  <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50 flex items-center px-2 py-3 overflow-hidden relative">
                    {isRecentSearchExpanded ? (
                      <div className="flex items-center justify-between w-full min-w-[240px]">
                        <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2 whitespace-nowrap">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span className="opacity-100 transition-opacity duration-200">최근 검색</span>
                        </h2>
                        <button
                          onClick={() => setIsRecentSearchExpanded(false)}
                          className="p-1 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors flex-shrink-0"
                          title="접기"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsRecentSearchExpanded(true)}
                        className="p-1 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors w-full flex items-center justify-center gap-2"
                        title="펼치기"
                      >
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      </button>
                    )}
                  </div>

                  {/* 최근 질문 목록 */}
                  {isRecentSearchExpanded && (
                    <div className="flex-1 overflow-y-auto p-2">
                      {recentQuestions.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-xs">
                          <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>최근 검색한 질문이 없습니다</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {recentQuestions.map((question) => (
                            <div
                              key={question.id}
                              className="group relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                              onClick={() => handleRecentQuestionClick(question.text)}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeRecentQuestion(question.id)
                                }}
                                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <p className="text-xs text-gray-700 pr-6 line-clamp-2 leading-relaxed">{question.text}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {question.timestamp.toLocaleDateString("ko-KR", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 메인 채팅 영역 */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* 페이지 헤더 */}
                <div className="flex-shrink-0 mb-4 sm:mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold">AI 챗봇</h1>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">AgOffice 업무 관련 질문을 도와드립니다.</p>
                    </div>
                    {/* 모바일 보관함 아이콘 */}
                    <button
                      onClick={() => setIsMobileDrawerOpen(true)}
                      className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                      title="최근 검색"
                    >
                      <Archive className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* 채팅 영역 - 전체 화면 꽉 차게 */}
                <Card className="flex-1 shadow-none rounded-2xl border border-gray-200 w-full flex flex-col overflow-hidden min-h-0">
                <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
                  {/* 채팅 메시지 영역 - 스크롤 가능 */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex items-start space-x-3 max-w-3xl ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.sender === "user" ? "bg-gray-900" : "bg-blue-500"
                            }`}
                          >
                            {message.sender === "user" ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              message.sender === "user"
                                ? "bg-gray-900 text-white shadow-sm"
                                : "bg-white text-gray-900 border border-gray-200"
                            }`}
                          >
                            <div className="text-sm leading-relaxed space-y-1">{formatMessageText(message.text)}</div>
                            <p className={`text-xs mt-2 ${message.sender === "user" ? "text-gray-300" : "text-gray-500"}`}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3 max-w-3xl">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                          <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-4 py-3">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* 빠른 액션 버튼들 */}
                  <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                      {quickActions.map((action) => {
                        const Icon = action.icon
                        return (
                          <button
                            key={action.id}
                            className="cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 shadow-none rounded-lg flex-shrink-0 bg-white px-2.5 py-1.5 flex items-center gap-1.5"
                            onClick={() => handleQuickAction(action)}
                          >
                            <div
                              className={`w-5 h-5 rounded-md ${action.color} flex items-center justify-center transition-colors flex-shrink-0`}
                            >
                              <Icon className="h-3 w-3 text-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{action.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 입력 영역 */}
                  <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4 sm:p-6">
                    <div className="flex space-x-3">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="메시지를 입력하세요."
                        className="flex-1 h-12 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                      />
                      <Button onClick={sendMessage} className="h-12 w-[48px] bg-gray-900 hover:bg-gray-800 text-white shadow-none rounded-lg flex items-center justify-center">
                        <ArrowUp className="h-7 w-7" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </>
          )}
        </main>

        {/* 모바일 드로어 - 최근 검색 */}
        <>
          {/* 오버레이 */}
          <div
            className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${
              isMobileDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          {/* 드로어 */}
          <div
            className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-out ${
              isMobileDrawerOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
              <div className="flex flex-col h-full">
                {/* 드로어 헤더 */}
                <div className="flex-shrink-0 px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    최근 검색
                  </h2>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1 rounded hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* 최근 질문 목록 */}
                <div className="flex-1 overflow-y-auto p-2">
                  {recentQuestions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-xs">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>최근 검색한 질문이 없습니다</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {recentQuestions.map((question) => (
                        <div
                          key={question.id}
                          className="group relative p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => {
                            handleRecentQuestionClick(question.text)
                            setIsMobileDrawerOpen(false)
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeRecentQuestion(question.id)
                            }}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <p className="text-xs text-gray-700 pr-6 line-clamp-2 leading-relaxed">{question.text}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {question.timestamp.toLocaleDateString("ko-KR", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
        </>
      </div>
    </div>
  )
}
