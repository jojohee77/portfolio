"use client"

import { useState, useEffect, useRef, useMemo } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { ScrollableTabs } from "@/components/ui/scrollable-tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SearchForm } from "@/components/ui/search-form"
import { showSuccessToast, showWarningToast } from "@/lib/toast-utils"
import { Crown, Users, Calendar, CreditCard, AlertTriangle, ChevronLeft, X, Plus, Pencil, Trash2, UserPlus, MoreVertical } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import WorkspaceModal, { WorkspaceModalSubmitPayload } from "@/components/workspace-modal"
import AlertConfirmModal from "@/components/ui/alert-confirm-modal"

// 탭 데이터
const profileTabs = [
  { name: "계정정보", href: "/profile/account" },
  { name: "멤버십 관리", href: "/profile/membership" },
  { name: "결제 정보", href: "/profile/payment" },
  { name: "충전/이용내역", href: "/profile/charging" },
  { name: "MY문의", href: "/profile/inquiry" },
]

interface WorkspaceMember {
  id: number
  name: string
  email: string
  role: string
  status: string
  avatar?: string
}

const ROLE_BADGE_STYLES: Record<string, string> = {
  관리자: "border-purple-200 bg-purple-50 text-purple-700",
  "워크스페이스 관리자": "border-amber-200 bg-amber-50 text-amber-700",
  "중간 관리자": "border-indigo-200 bg-indigo-50 text-indigo-700",
  편집자: "border-blue-200 bg-blue-50 text-blue-700",
  실무자: "border-emerald-200 bg-emerald-50 text-emerald-700",
  뷰어: "border-slate-200 bg-slate-50 text-slate-700",
}

const STATUS_BADGE_STYLES: Record<string, string> = {
  활성: "bg-green-100 text-green-800",
  초대중: "bg-amber-100 text-amber-800",
  비활성: "bg-gray-100 text-gray-700",
}

interface WorkspaceItem {
  id: string
  name: string
  createdAt: string
  memberList: WorkspaceMember[]
}

export default function MembershipPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelStep, setCancelStep] = useState(1)
  const [cancelReason, setCancelReason] = useState("")
  const [cancelFeedback, setCancelFeedback] = useState("")
  const [yearlyModalOpen, setYearlyModalOpen] = useState(false)
  const [yearlyStep, setYearlyStep] = useState(1)
  const [isEmptyState, setIsEmptyState] = useState(false)
  const [workspaceList, setWorkspaceList] = useState<WorkspaceItem[]>([
    {
      id: "workspace-1",
      name: "마케팅 본부",
      createdAt: "2024-03-11",
      memberList: [
        { id: 1, name: "김승우", email: "kim.seungwoo@agoffice.com", role: "관리자", status: "활성" },
        { id: 2, name: "박나리", email: "park.nari@agoffice.com", role: "편집자", status: "활성" },
        { id: 3, name: "정민수", email: "jung.minsu@agoffice.com", role: "실무자", status: "활성" },
        { id: 4, name: "이지은", email: "lee.jieun@agoffice.com", role: "실무자", status: "활성" },
        { id: 5, name: "최현우", email: "choi.hyunwoo@agoffice.com", role: "뷰어", status: "활성" },
        { id: 6, name: "강수진", email: "kang.sujin@agoffice.com", role: "편집자", status: "활성" },
        { id: 7, name: "윤태호", email: "yoon.taeho@agoffice.com", role: "실무자", status: "활성" },
        { id: 8, name: "한소영", email: "han.soyoung@agoffice.com", role: "실무자", status: "초대중" },
        { id: 9, name: "송민준", email: "song.minjun@agoffice.com", role: "실무자", status: "활성" },
        { id: 10, name: "강지민", email: "kang.jimin@agoffice.com", role: "뷰어", status: "활성" },
        { id: 11, name: "박서준", email: "park.seojun@agoffice.com", role: "실무자", status: "활성" },
        { id: 12, name: "이하은", email: "lee.haeun@agoffice.com", role: "실무자", status: "활성" },
      ],
    },
    {
      id: "workspace-2",
      name: "D2C 프로젝트",
      createdAt: "2024-07-02",
      memberList: [
        { id: 13, name: "김철수", email: "kim.chulsoo@agoffice.com", role: "관리자", status: "활성" },
        { id: 14, name: "이영희", email: "lee.younghee@agoffice.com", role: "편집자", status: "활성" },
        { id: 15, name: "박민수", email: "park.minsu@agoffice.com", role: "실무자", status: "활성" },
        { id: 16, name: "정지은", email: "jung.jieun@agoffice.com", role: "실무자", status: "활성" },
        { id: 17, name: "최수진", email: "choi.sujin@agoffice.com", role: "뷰어", status: "활성" },
        { id: 18, name: "윤아", email: "yoon.ah@agoffice.com", role: "실무자", status: "초대중" },
      ],
    },
    {
      id: "workspace-3",
      name: "커머스 운영팀",
      createdAt: "2024-09-15",
      memberList: [
        { id: 19, name: "홍길동", email: "hong.gildong@agoffice.com", role: "워크스페이스 관리자", status: "활성" },
        { id: 20, name: "김영수", email: "kim.youngsu@agoffice.com", role: "편집자", status: "활성" },
        { id: 21, name: "박지훈", email: "park.jihun@agoffice.com", role: "실무자", status: "활성" },
        { id: 22, name: "정우성", email: "jung.woosung@agoffice.com", role: "실무자", status: "활성" },
        { id: 23, name: "강동원", email: "kang.dongwon@agoffice.com", role: "뷰어", status: "활성" },
        { id: 24, name: "윤태경", email: "yoon.taekyung@agoffice.com", role: "실무자", status: "활성" },
        { id: 25, name: "이민호", email: "lee.minho@agoffice.com", role: "실무자", status: "활성" },
        { id: 26, name: "송혜교", email: "song.hyekyo@agoffice.com", role: "편집자", status: "활성" },
        { id: 27, name: "서지수", email: "seo.jisoo@agoffice.com", role: "뷰어", status: "초대중" },
      ],
    },
  ])
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false)
  const [workspaceModalMode, setWorkspaceModalMode] = useState<"create" | "edit">("create")
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [inviteInput, setInviteInput] = useState("")
  const [inviteRole, setInviteRole] = useState("실무자")
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [memberSearchTerm, setMemberSearchTerm] = useState("")
  const [memberModalWorkspaceId, setMemberModalWorkspaceId] = useState<string | null>(null)
  const [memberModalWorkspaceName, setMemberModalWorkspaceName] = useState("")
  const [selectedWorkspaceMembers, setSelectedWorkspaceMembers] = useState<WorkspaceMember[]>([])
  const [mobileActionMenu, setMobileActionMenu] = useState<string | null>(null)
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  const activeWorkspace = activeWorkspaceId ? workspaceList.find((workspace) => workspace.id === activeWorkspaceId) : null

  const filteredWorkspaceMembers = useMemo(() => {
    const keyword = memberSearchTerm.trim().toLowerCase()
    if (!keyword) {
      return selectedWorkspaceMembers
    }

    return selectedWorkspaceMembers.filter((member) => {
      const targets = [member.name, member.email, member.role].filter(Boolean)
      return targets.some((target) => target.toLowerCase().includes(keyword))
    })
  }, [memberSearchTerm, selectedWorkspaceMembers])

  const handleWorkspaceModalOpenChange = (open: boolean) => {
    setWorkspaceModalOpen(open)
    if (!open) {
      setActiveWorkspaceId(null)
      setWorkspaceModalMode("create")
    }
  }

  const handleDeleteDialogOpenChange = (open: boolean) => {
    setDeleteDialogOpen(open)
    if (!open) {
      setActiveWorkspaceId(null)
    }
  }

  const handleWorkspaceModalSubmit = async ({ name, inviteEmails }: WorkspaceModalSubmitPayload) => {
    if (workspaceModalMode === "create") {
      const timestamp = Date.now()
      const invitedMembers: WorkspaceMember[] =
        inviteEmails.length > 0
          ? inviteEmails.map((email, index) => ({
              id: timestamp + index,
              name: email.split("@")[0] || email,
              email,
              role: "실무자",
              status: "초대중",
            }))
          : []
      const newWorkspace: WorkspaceItem = {
        id: `workspace-${timestamp}`,
        name,
        createdAt: new Date().toISOString().slice(0, 10),
        memberList: invitedMembers,
      }
      setWorkspaceList((prev) => [newWorkspace, ...prev])
      showSuccessToast(
        inviteEmails.length
          ? `워크스페이스를 생성하고 ${inviteEmails.length}명에게 초대를 보냈습니다.`
          : "워크스페이스가 생성됐습니다.",
      )
      return
    }

    if (!activeWorkspaceId || !activeWorkspace) {
      return
    }

    setWorkspaceList((prev) =>
      prev.map((workspace) => (workspace.id === activeWorkspaceId ? { ...workspace, name } : workspace)),
    )
    showSuccessToast("워크스페이스 정보가 수정됐습니다.")
  }

  const handleDeleteWorkspace = () => {
    if (!activeWorkspaceId) {
      handleDeleteDialogOpenChange(false)
      return
    }
    setWorkspaceList((prev) => prev.filter((workspace) => workspace.id !== activeWorkspaceId))
    showSuccessToast("워크스페이스가 삭제됐습니다.")
    handleDeleteDialogOpenChange(false)
  }

  const resetInviteState = () => {
    setInviteEmails([])
    setInviteInput("")
    setInviteRole("실무자")
  }

  const openInviteModal = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    resetInviteState()
    setInviteModalOpen(true)
  }

  const handleInviteModalOpenChange = (open: boolean) => {
    if (!open) {
      resetInviteState()
      setInviteModalOpen(false)
      setActiveWorkspaceId(null)
    } else {
      setInviteModalOpen(true)
    }
  }

  const handleMemberModalOpenChange = (open: boolean) => {
    if (!open) {
      setMemberModalOpen(false)
      setMemberSearchTerm("")
      setMemberModalWorkspaceId(null)
      setMemberModalWorkspaceName("")
      setSelectedWorkspaceMembers([])
      return
    }
    setMemberModalOpen(true)
  }

  const handleMemberBadgeClick = (workspaceId: string) => {
    const targetWorkspace = workspaceList.find((workspace) => workspace.id === workspaceId)
    if (!targetWorkspace) {
      return
    }

    setMemberModalWorkspaceId(workspaceId)
    setMemberModalWorkspaceName(targetWorkspace.name)
    setSelectedWorkspaceMembers([...targetWorkspace.memberList])
    setMemberSearchTerm("")
    setMemberModalOpen(true)
  }

  const addInviteEmails = (value: string) => {
    const segments = value
      .split(",")
      .map((segment) => segment.trim())
      .filter(Boolean)

    if (!segments.length) return

    setInviteEmails((prev) => {
      const next = [...prev]
      segments.forEach((email) => {
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !next.includes(email)) {
          next.push(email)
        }
      })
      return next
    })
    setInviteInput("")
  }

  const handleInviteSubmit = () => {
    if (!activeWorkspace) {
      showWarningToast("워크스페이스 정보를 불러오지 못했습니다.")
      return
    }
    if (inviteEmails.length === 0) {
      showWarningToast("초대할 멤버의 이메일을 입력해주세요.")
      return
    }
    const timestamp = Date.now()
    const newMembers: WorkspaceMember[] = inviteEmails.map((email, index) => ({
      id: timestamp + index,
      name: email.split("@")[0] || email,
      email,
      role: inviteRole,
      status: "초대중",
    }))
    setWorkspaceList((prev) =>
      prev.map((workspace) =>
        workspace.id === activeWorkspace.id ? { ...workspace, memberList: [...workspace.memberList, ...newMembers] } : workspace,
      ),
    )
    if (memberModalWorkspaceId === activeWorkspace.id) {
      setSelectedWorkspaceMembers((prev) => [...prev, ...newMembers])
    }
    showSuccessToast(`${activeWorkspace.name}에 ${inviteEmails.length}명을 ${inviteRole} 역할로 초대했습니다.`)
    handleInviteModalOpenChange(false)
  }

  useEffect(() => {
    const handleDocumentInteraction = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node

      if (mobileActionMenu && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileActionMenu(null)
        mobileMenuRef.current = null
      }
    }

    if (mobileActionMenu) {
      document.addEventListener("click", handleDocumentInteraction)
      document.addEventListener("touchstart", handleDocumentInteraction)
    }

    return () => {
      document.removeEventListener("click", handleDocumentInteraction)
      document.removeEventListener("touchstart", handleDocumentInteraction)
    }
  }, [mobileActionMenu])

  useEffect(() => {
    if (!mobileActionMenu) {
      mobileMenuRef.current = null
    }
  }, [mobileActionMenu])

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)")

    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches)
    }

    updateViewport()

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateViewport)
    } else {
      mediaQuery.addListener(updateViewport)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateViewport)
      } else {
        mediaQuery.removeListener(updateViewport)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        pageTitle="마이페이지"
      />

      <div className="flex">
        <Sidebar 
          currentPage="profile" 
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <main className="flex-1 min-w-0 p-3 sm:p-4 lg:p-6 pb-24 sm:pb-36 lg:pb-48 space-y-6">
          {isLoading ? (
            // 스켈레톤 UI
            <>
              {/* 페이지 헤더 스켈레톤 - 데스크톱만 */}
              <div className="hidden sm:flex sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-4 w-52" />
                </div>
                <Skeleton className="h-11 w-36 rounded-lg" />
              </div>

              {/* 탭 네비게이션 스켈레톤 */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {profileTabs.map((tab) => (
                  <Skeleton key={tab.href} className="h-10 w-24 flex-shrink-0 rounded-full" />
                ))}
              </div>

              {/* 멤버십 현황 카드 스켈레톤 */}
              <Card className="shadow-none rounded-2xl border py-6">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-64 mt-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 border border-gray-200 rounded-xl space-y-6">
                    {/* 상단 */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <Skeleton className="h-16 w-16 rounded-xl flex-shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-5 w-14 rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full max-w-[280px]" />
                      </div>
                    </div>

                    {/* 상세 정보 */}
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </div>

                    {/* 버튼 */}
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 워크스페이스 목록 카드 스켈레톤 */}
              <Card className="shadow-none rounded-2xl border py-6">
                <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-10 w-full rounded-lg sm:w-36" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="hidden sm:block">
                    <div className="rounded-2xl border border-gray-200 bg-white">
                      <Table>
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            {[...Array(4)].map((_, index) => (
                              <TableHead key={index} className="px-4 py-3">
                                <Skeleton className="h-4 w-24" />
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {[...Array(3)].map((_, rowIndex) => (
                            <TableRow key={rowIndex}>
                              <TableCell className="px-4 py-4">
                                <div className="space-y-2">
                                  <Skeleton className="h-4 w-32" />
                                  <Skeleton className="h-3 w-40" />
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-4">
                                <Skeleton className="h-5 w-16 rounded-full" />
                              </TableCell>
                              <TableCell className="px-4 py-4">
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell className="px-4 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  {[...Array(3)].map((__, buttonIndex) => (
                                    <Skeleton key={buttonIndex} className="h-8 w-16 rounded-md" />
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="space-y-3 sm:hidden">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-28" />
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-6 rounded-full" />
                          </div>
                        </div>
                        <div className="mt-3 flex w-full gap-2">
                          {[...Array(3)].map((__, buttonIndex) => (
                            <Skeleton key={buttonIndex} className="h-8 flex-1 rounded-md" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* 페이지 헤더 - 모바일에서는 숨김 */}
              <div className="flex items-center justify-between hidden sm:flex">
                <div>
                  <h1 className="text-2xl font-bold">마이페이지</h1>
                  <p className="text-sm text-muted-foreground mt-1">멤버십을 관리하세요</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEmptyState(!isEmptyState)}
                  className="shadow-none"
                >
                  {isEmptyState ? "유료 회원 보기" : "빈화면 보기"}
                </Button>
              </div>

              {/* 탭 네비게이션 */}
              <ScrollableTabs tabs={profileTabs} />

              {/* 멤버십 현황 */}
              <Card className="shadow-none rounded-2xl border py-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">멤버십 현황</CardTitle>
              <p className="text-sm text-muted-foreground">구독중인 멤버십 가입 현황을 확인하고, 구독을 취소할 수 있어요</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 플랜 정보 */}
              <div className="p-6 border border-gray-200 rounded-xl">
                {/* 상단: 아이콘과 타이틀 */}
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                  <div className="w-15 h-15 bg-white border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Crown className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Ag Pro</h3>
                      <Badge variant="outline" className={isEmptyState ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}>
                        {isEmptyState ? "체험" : "유료"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {isEmptyState 
                        ? "체험 기간 동안 프로 플랜 기능을 자유롭게 사용해보세요." 
                        : "2025년 1월 1일 이후 프로 플랜 기능을 사용하실 수 있습니다."}
                    </p>
                  </div>
                </div>

                {/* 하단: 상세 정보 */}
                <div className="space-y-3 text-sm mb-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground w-24">사용자 수</span>
                    <span className="font-medium">10명</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground w-24">결제금액</span>
                    <span className="font-medium">{isEmptyState ? "무료" : "99,000원"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground w-24">구독 갱신일</span>
                    <span className={`font-medium ${isEmptyState ? "text-red-600" : ""}`}>
                      {isEmptyState ? "2025-10-27" : "2025-10-19"}
                    </span>
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex flex-col gap-3">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-sm font-medium hover:bg-gray-50 shadow-none"
                  onClick={() => {
                    setYearlyModalOpen(true)
                    setYearlyStep(1)
                  }}
                >
                  {isEmptyState ? "Pro 요금제로 전환" : "연간 요금제로 전환(16% 절약)"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-sm font-medium hover:bg-gray-50 shadow-none"
                  onClick={() => {
                    setCancelModalOpen(true)
                    setCancelStep(1)
                    setCancelReason("")
                    setCancelFeedback("")
                  }}
                >
                  요금제 해지
                </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 사용량 현황 */}
          <Card className="shadow-none rounded-2xl border py-6">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl font-semibold">
                워크스페이스 목록{" "}
                <span className="text-primary text-base font-semibold">
                  ({workspaceList.length}개)
                </span>
              </CardTitle>
              <Button
                onClick={() => {
                  setWorkspaceModalMode("create")
                  setActiveWorkspaceId(null)
                  setWorkspaceModalOpen(true)
                }}
                className="h-11 w-full rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto sm:px-5"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                새 워크스페이스 추가
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {workspaceList.length > 0 ? (
                <>
                  <div className="hidden sm:block">
                    <div className="rounded-2xl border border-gray-200 bg-white">
                      <Table className="[&_td]:align-middle">
                        <TableHeader className="bg-muted/50">
                          <TableRow>
                            <TableHead className="px-4 py-3">워크스페이스</TableHead>
                            <TableHead className="px-4 py-3">멤버 수</TableHead>
                            <TableHead className="px-4 py-3">생성일</TableHead>
                            <TableHead className="w-[260px] px-3 py-3 text-center">관리</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {workspaceList.map((workspace) => (
                            <TableRow key={workspace.id}>
                              <TableCell className="px-4 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="text-base font-semibold text-gray-900">{workspace.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    멤버 초대 및 권한 관리는 워크스페이스 상세 페이지에서 진행합니다.
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-4">
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-blue-200 bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors"
                                  role="button"
                                  tabIndex={0}
                                  aria-label={`${workspace.name} 구성원 보기`}
                                  onClick={() => handleMemberBadgeClick(workspace.id)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                      event.preventDefault()
                                      handleMemberBadgeClick(workspace.id)
                                    }
                                  }}
                                >
                                  {workspace.memberList.length}명
                                </Badge>
                              </TableCell>
                              <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                                {workspace.createdAt.replace(/-/g, ".")}
                              </TableCell>
                              <TableCell className="w-[220px] px-3 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-md border-gray-300 px-2.5 text-xs font-medium text-gray-700 shadow-none transition-colors hover:border-gray-400 hover:bg-gray-50"
                                    onClick={() => {
                                      openInviteModal(workspace.id)
                                    }}
                                  >
                                    <UserPlus className="mr-1 h-3.5 w-3.5" />
                                    멤버 초대
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-md border-gray-300 px-2.5 text-xs font-medium text-gray-700 shadow-none transition-colors hover:border-gray-400 hover:bg-gray-50"
                                    onClick={() => {
                                      setWorkspaceModalMode("edit")
                                      setActiveWorkspaceId(workspace.id)
                                      setWorkspaceModalOpen(true)
                                    }}
                                  >
                                    <Pencil className="mr-1 h-3.5 w-3.5" />
                                    수정
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 rounded-md border-red-200 px-2.5 text-xs font-medium text-red-600 shadow-none transition-colors hover:border-red-300 hover:bg-red-50/80 hover:text-red-600"
                                    onClick={() => {
                                      setActiveWorkspaceId(workspace.id)
                                      handleDeleteDialogOpenChange(true)
                                    }}
                                  >
                                    <Trash2 className="mr-1 h-3.5 w-3.5" />
                                    삭제
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="space-y-3 sm:hidden">
                    {workspaceList.map((workspace) => (
                      <div key={workspace.id} className="rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-base font-semibold text-gray-900">{workspace.name}</span>
                            <p className="text-xs text-muted-foreground">
                              생성일 {workspace.createdAt.replace(/-/g, ".")}
                            </p>
                          </div>
                          <div className="relative flex items-center gap-1.5">
                            <Badge
                              variant="outline"
                              className="rounded-full border-blue-200 bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100 transition-colors"
                              role="button"
                              tabIndex={0}
                              aria-label={`${workspace.name} 구성원 보기`}
                              onClick={() => handleMemberBadgeClick(workspace.id)}
                              onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                  event.preventDefault()
                                  handleMemberBadgeClick(workspace.id)
                                }
                              }}
                            >
                              {workspace.memberList.length}명
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-md text-gray-500 shadow-none hover:bg-gray-100 hover:text-gray-700"
                              onClick={(event) => {
                                event.stopPropagation()
                                setActiveWorkspaceId(workspace.id)
                                setMobileActionMenu((prev) => (prev === workspace.id ? null : workspace.id))
                              }}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                            {mobileActionMenu === workspace.id && (
                              <div
                                ref={mobileActionMenu === workspace.id ? mobileMenuRef : null}
                                className="absolute right-0 top-9 z-[200] w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    setActiveWorkspaceId(workspace.id)
                                    openInviteModal(workspace.id)
                                    setMobileActionMenu(null)
                                  }}
                                >
                                  <UserPlus className="h-4 w-4" />
                                  멤버 초대
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-100"
                                  onClick={() => {
                                    setActiveWorkspaceId(workspace.id)
                                    setWorkspaceModalMode("edit")
                                    setWorkspaceModalOpen(true)
                                    setMobileActionMenu(null)
                                  }}
                                >
                                  <Pencil className="h-4 w-4" />
                                  수정
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50"
                                  onClick={() => {
                                    setActiveWorkspaceId(workspace.id)
                                    handleDeleteDialogOpenChange(true)
                                    setMobileActionMenu(null)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-muted/30 p-8 text-center">
                  <p className="text-base font-semibold text-gray-900">아직 등록된 워크스페이스가 없습니다.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    워크스페이스를 생성하고 팀원을 초대해 협업을 시작해 보세요.
                  </p>
                  <Button
                    className="mt-6 h-11 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    onClick={() => {
                      setWorkspaceModalMode("create")
                      setActiveWorkspaceId(null)
                      setWorkspaceModalOpen(true)
                    }}
                  >
                    <Plus className="mr-1.5 h-4 w-4" />
                    새 워크스페이스 추가
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
            </>
          )}
        </main>
      </div>

      <WorkspaceModal
        open={workspaceModalOpen}
        onOpenChange={handleWorkspaceModalOpenChange}
        onSubmit={handleWorkspaceModalSubmit}
        title={workspaceModalMode === "create" ? "새 워크스페이스" : "워크스페이스 수정"}
        submitButtonLabel={workspaceModalMode === "edit" ? "저장" : "생성"}
        cancelButtonLabel="취소"
        description={
          workspaceModalMode === "create"
            ? "워크스페이스 이름을 입력하세요."
            : activeWorkspace
            ? `${activeWorkspace.name} 정보를 수정합니다.`
            : undefined
        }
        initialName={workspaceModalMode === "create" ? "" : activeWorkspace?.name ?? ""}
        initialInviteEmails={[]}
      />

      <Dialog open={memberModalOpen} onOpenChange={handleMemberModalOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-[520px] h-[90vh] max-h-[760px] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b bg-white z-10">
            <DialogTitle className="text-xl font-semibold">워크스페이스 구성원</DialogTitle>
            {memberModalWorkspaceName && (
              <p className="text-sm text-muted-foreground mt-1">{memberModalWorkspaceName} 구성원을 확인해 보세요.</p>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-hidden flex flex-col px-6 py-6 bg-muted/10">
            <div className="flex flex-col h-full space-y-4">
              <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
                <SearchForm
                  placeholder="구성원을 검색하세요"
                  value={memberSearchTerm}
                  onChange={(value) => setMemberSearchTerm(value)}
                />
              </div>

              <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col flex-1 min-h-0 bg-white">
                <div className="bg-gray-50 px-3 sm:px-4 py-3 border-b flex items-center justify-between flex-shrink-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    구성원 리스트 ({selectedWorkspaceMembers.length}명)
                  </h3>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg gap-2"
                    disabled={!memberModalWorkspaceId}
                    onClick={() => {
                      if (!memberModalWorkspaceId) return
                      const workspaceId = memberModalWorkspaceId
                      handleMemberModalOpenChange(false)
                      openInviteModal(workspaceId)
                    }}
                  >
                    <UserPlus className="h-4 w-4" />
                    멤버 초대
                  </Button>
                </div>
                <div className="divide-y overflow-y-auto flex-1 pr-1 sm:pr-2">
                  {filteredWorkspaceMembers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>검색 결과가 없습니다.</p>
                    </div>
                  ) : (
                    filteredWorkspaceMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar ?? "/icons/icon-user-m.png"} />
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="font-medium text-sm sm:text-base text-gray-900">{member.name}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">{member.email}</div>
                            <div className="flex items-center gap-2 sm:hidden">
                              <Badge
                                variant="outline"
                                className={`text-xs ${ROLE_BADGE_STYLES[member.role] ?? "border-blue-200 bg-blue-50 text-blue-700"}`}
                              >
                                {member.role}
                              </Badge>
                              <Badge className={`text-xs ${STATUS_BADGE_STYLES[member.status] ?? "bg-gray-100 text-gray-700"}`}>
                                {member.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${ROLE_BADGE_STYLES[member.role] ?? "border-blue-200 bg-blue-50 text-blue-700"}`}
                          >
                            {member.role}
                          </Badge>
                          <Badge className={`text-xs ${STATUS_BADGE_STYLES[member.status] ?? "bg-gray-100 text-gray-700"}`}>
                            {member.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 flex justify-end gap-3 px-6 py-4 border-t bg-white">
            <Button variant="outline" className="h-11 rounded-lg px-4" onClick={() => handleMemberModalOpenChange(false)}>
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={inviteModalOpen} onOpenChange={handleInviteModalOpenChange}>
        <DialogContent className="w-[95vw] max-w-[520px] px-0 pt-0 pb-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {activeWorkspace ? `${activeWorkspace.name} 멤버 초대` : "멤버 초대"}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              초대할 멤버의 이메일을 입력하고 역할을 선택하세요.
            </p>
          </DialogHeader>

          <div className="px-6 py-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">
                초대 이메일 <span className="text-red-500">*</span>
              </Label>
              <div
                className="flex flex-wrap items-center gap-2 min-h-[44px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                onClick={() => {
                  const input = document.getElementById("invite-member-emails") as HTMLInputElement | null
                  input?.focus()
                }}
              >
                {inviteEmails.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1 pr-1">
                    <span className="text-xs">{email}</span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setInviteEmails((prev) => prev.filter((item) => item !== email))
                      }}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                      aria-label={`${email} 삭제`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <Input
                  id="invite-member-emails"
                  type="text"
                  placeholder={inviteEmails.length === 0 ? "이메일을 입력하고 엔터 또는 쉼표로 구분하세요" : ""}
                  value={inviteInput}
                  onChange={(event) => {
                    const { value } = event.target
                    setInviteInput(value)
                    if (value.includes(",")) {
                      addInviteEmails(value)
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault()
                      addInviteEmails(inviteInput)
                    } else if (event.key === "Backspace" && inviteInput === "" && inviteEmails.length > 0) {
                      setInviteEmails((prev) => prev.slice(0, -1))
                    }
                  }}
                  onBlur={() => {
                    if (inviteInput.trim()) {
                      addInviteEmails(inviteInput)
                    }
                  }}
                  className="flex-1 min-w-[140px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto placeholder:text-xs"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                여러 명을 초대하려면 콤마(,)로 구분하거나 엔터를 눌러 추가하세요.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800">역할 선택</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="w-full rounded-md border-gray-300 bg-white">
                  <SelectValue placeholder="역할을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="실무자">실무자</SelectItem>
                  <SelectItem value="중간 관리자">중간 관리자</SelectItem>
                  <SelectItem value="관리자">관리자</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t bg-white flex-row justify-end gap-3">
            <Button
              variant="outline"
              className="h-11 rounded-lg px-4"
              onClick={() => handleInviteModalOpenChange(false)}
            >
              취소
            </Button>
            <Button
              className="h-11 rounded-lg px-5 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
              onClick={handleInviteSubmit}
              disabled={inviteEmails.length === 0}
            >
              초대 보내기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertConfirmModal
        isOpen={deleteDialogOpen}
        onClose={() => handleDeleteDialogOpenChange(false)}
        onConfirm={handleDeleteWorkspace}
        title="워크스페이스 삭제"
        message={
          activeWorkspace
            ? `**${activeWorkspace.name}** 워크스페이스를 삭제하면\n초대 내역과 권한이 모두 해제됩니다.`
            : "선택한 워크스페이스를 삭제합니다."
        }
        additionalMessage="삭제 후에는 되돌릴 수 없습니다."
        confirmText="삭제하기"
        cancelText="취소"
        maxWidth={isMobileViewport ? "calc(100vw - 32px)" : "400px"}
      />

      {/* 연간 요금제 전환 모달 */}
      <Dialog open={yearlyModalOpen} onOpenChange={setYearlyModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[900px] max-h-[90vh] p-0 gap-0 overflow-hidden border-0" showCloseButton={false}>
          <div className="flex relative max-h-[90vh]">
            {/* 왼쪽: 컨텐츠 */}
            <div className="w-full sm:w-[55%] p-6 sm:p-7 overflow-y-auto sm:min-h-[648px]">
              {/* 헤더 */}
              <div className="mb-3">
                {yearlyStep > 1 && (
                  <button
                    onClick={() => setYearlyStep(yearlyStep - 1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setYearlyModalOpen(false)}
                  className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Step 1: 연간 요금제로 전환하시겠습니까? */}
              {yearlyStep === 1 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    연간 요금제로 전환하시겠습니까?
                  </h2>

                  <p className="text-gray-600 mb-4">
                    연간 결제로 전환하시면 다음과 같은 혜택을 받으실 수 있습니다.
                  </p>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">16% 할인 혜택</p>
                        <p className="text-sm text-gray-600">월간 결제 대비 연간 198,000원 절약</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">편리한 결제 관리</p>
                        <p className="text-sm text-gray-600">1년 동안 매월 결제 걱정 없이 이용</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">모든 프리미엄 기능 제공</p>
                        <p className="text-sm text-gray-600">키워드 분석, 조직관리, 계약관리 등 모든 기능 사용</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">언제든지 해지 가능</p>
                        <p className="text-sm text-gray-600">구독 기간 중 언제든 해지 가능합니다</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6 mt-8">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-gray-600">현재 월간 요금제</span>
                      <span className="text-base font-medium text-gray-900">99,000원/월</span>
                    </div>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm text-gray-600">연간 요금제</span>
                      <span className="text-base font-medium text-gray-900">999,000원/년</span>
                    </div>
                    <Separator className="my-1.5" />
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-green-600">절약 금액</span>
                      <span className="text-lg font-bold text-green-600">198,000원</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      className="w-full h-12 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                      onClick={() => setYearlyStep(2)}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      연간 요금제로 전환하기
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-12 text-sm font-medium rounded-xl shadow-none"
                      onClick={() => {
                        setYearlyModalOpen(false)
                      }}
                    >
                      월간 요금제 유지
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: 연간 요금제로 전환되었습니다 */}
              {yearlyStep === 2 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    연간 요금제로 전환되었습니다
                  </h2>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-green-900">
                      축하합니다! 연간 요금제로 전환되어 <strong>198,000원을 절약</strong>하셨습니다. <strong>다음 결제일은 2026년 10월 20일</strong>입니다.
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    전환 완료 안내
                  </h3>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">1</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">즉시 적용</p>
                        <p className="text-sm text-gray-600">연간 요금제가 바로 적용되어 모든 프리미엄 기능을 계속 이용하실 수 있습니다.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">2</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">결제 정보 확인</p>
                        <p className="text-sm text-gray-600">결제 정보 페이지에서 연간 구독 내역을 확인하실 수 있습니다.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">3</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">다음 결제일</p>
                        <p className="text-sm text-gray-600">2026년 10월 20일에 자동으로 갱신됩니다.</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                    onClick={() => {
                      showSuccessToast("연간 요금제로 전환이 완료되었습니다!")
                      setYearlyModalOpen(false)
                      setYearlyStep(1)
                    }}
                  >
                    확인
                  </Button>
                </div>
              )}
            </div>

            {/* 오른쪽: 이미지 */}
            <div className="hidden sm:block sm:w-[45%] relative">
              {yearlyStep === 1 && (
                <div className="absolute inset-0">
                  <img
                    src="/pro-img1.png"
                    alt="Pro"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {yearlyStep === 2 && (
                <div className="absolute inset-0">
                  <img
                    src="/pro-img2.png"
                    alt="Pro"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 구독 취소 모달 */}
      <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-[900px] max-h-[90vh] p-0 gap-0 overflow-hidden border-0" showCloseButton={false}>
          <div className="flex relative max-h-[90vh]">
            {/* 왼쪽: 컨텐츠 */}
            <div className="w-full sm:w-[55%] p-6 sm:p-7 overflow-y-auto sm:min-h-[648px]">
              {/* 헤더 */}
              <div className="mb-6">
                {cancelStep > 1 && (
                  <button
                    onClick={() => setCancelStep(cancelStep - 1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <button
                  onClick={() => setCancelModalOpen(false)}
                  className="absolute top-4 right-4 z-50 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Step 1: 정말 취소하시겠습니까? */}
              {cancelStep === 1 && (
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900">
                        무료 체험이 만료되기까지 아직 <strong>2일 남아</strong> 있습니다.
                      </p>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    정말 취소 하시겠습니까?
                  </h2>

                  <p className="text-gray-600 mb-6">
                    다음과 같이 마케팅 효율을 높여주는 모든 프리미엄 기능을 <br /> 이용할 수 없게 됩니다.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">키워드 자동 분석 및 추천</p>
                        <p className="text-sm text-gray-600">최적의 키워드로 검색 노출 극대화</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">AI 챗봇 통합 분석 제공</p>
                        <p className="text-sm text-gray-600">AI통합분석으로 시간절약</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">실시간 성과 분석 및 리포트</p>
                        <p className="text-sm text-gray-600">데이터 기반 마케팅 전략 수립</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Crown className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900">무제한 팀원 초대 및 협업</p>
                        <p className="text-sm text-gray-600">팀 전체의 마케팅 생산성 향상</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full h-12 text-sm font-medium rounded-xl"
                      onClick={() => {
                        setCancelModalOpen(false)
                      }}
                    >
                      <Crown className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
                      프리미엄 플랜 계속 사용
                    </Button>
                    <Button
                      className="w-full h-12 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl"
                      onClick={() => setCancelStep(2)}
                    >
                      취소 계속 진행
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: 취소하려는 이유가 무엇인가요? */}
              {cancelStep === 2 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    취소하려는 이유가 무엇인가요?
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-900">
                        무료 체험이 만료되기까지 아직 <strong>2일 남아</strong> 있습니다.
                      </p>
                    </div>
                  </div>

                  <RadioGroup value={cancelReason} onValueChange={setCancelReason} className="space-y-3 mb-8">
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="technical" id="technical" />
                      <Label htmlFor="technical" className="text-base cursor-pointer">기술적인 문제가 너무 많음</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="features" id="features" />
                      <Label htmlFor="features" className="text-base cursor-pointer">필요한 기능이 부족함</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="price" id="price" />
                      <Label htmlFor="price" className="text-base cursor-pointer">요금이 너무 비쌈</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="notuse" id="notuse" />
                      <Label htmlFor="notuse" className="text-base cursor-pointer">서비스를 자주 사용하지 않음</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="subscription" id="subscription" />
                      <Label htmlFor="subscription" className="text-base cursor-pointer">연간 구독으로 변경하고 싶음</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="text-base cursor-pointer">기타</Label>
                    </div>
                  </RadioGroup>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full h-12 text-sm font-medium rounded-xl"
                      onClick={() => {
                        setCancelModalOpen(false)
                      }}
                    >
                      <Crown className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
                      프리미엄 플랜 계속 사용
                    </Button>
                    <Button
                      className="w-full h-12 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl"
                      disabled={!cancelReason}
                      onClick={() => setCancelStep(3)}
                    >
                      취소 계속 진행
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: 구독이 취소되었습니다 */}
              {cancelStep === 3 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    구독이 취소되었습니다
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-900">
                      서비스를 이용해 주셔서 감사합니다. <strong>2025년 10월 22일</strong>에 구독이 종료되면 기존 데이터는 계속 확인할 수 있지만 프리미엄 기능은 이용할 수 없게 됩니다.
                    </p>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    피드백을 제공해 주세요
                  </h3>

                  <p className="text-sm text-gray-600 mb-4">
                    앞으로 추가되거나 개선되었으면 좋은 기능이 있다면 알려주시겠어요? <br /> 피드백을 보내주시면 모두 꼼꼼히 검토하여 서비스를 개선하는 데 소중하게 사용하겠습니다.
                  </p>

                  <Textarea
                    placeholder="어떤 점을 개선해야 할까요?"
                    value={cancelFeedback}
                    onChange={(e) => setCancelFeedback(e.target.value)}
                    className="min-h-[120px] mb-6"
                  />

                  <Button
                    className="w-full h-12 text-base font-medium bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                    onClick={() => {
                      // 피드백 제출 로직
                      showSuccessToast("구독취소가 완료됐습니다. 2025-12-12까지 이용가능합니다.")
                      setCancelModalOpen(false)
                      setCancelStep(1)
                      setCancelReason("")
                      setCancelFeedback("")
                    }}
                  >
                    의견 제출하기
                  </Button>
                </div>
              )}
            </div>

            {/* 오른쪽: 이미지 */}
            <div className="hidden sm:block sm:w-[45%] relative">
              {cancelStep === 1 && (
                <div className="absolute inset-0">
                  <img
                    src="/pro-img1.png"
                    alt="Pro"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {cancelStep === 2 && (
                <div className="absolute inset-0">
                  <img
                    src="/pro-img2.png"
                    alt="Pro"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {cancelStep === 3 && (
                <div className="absolute inset-0">
                  <img
                    src="/pro-img3.png"
                    alt="Pro"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

