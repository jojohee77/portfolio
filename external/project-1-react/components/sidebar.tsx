"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import {
  Home,
  FileText,
  Briefcase,
  MessageSquare,
  Search,
  DollarSign,
  Target,
  Bot,
  Bell,
  Building,
  Crown,
  User,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ChevronDown,
  Folders,
  Plus,
  TrendingUp,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { showSuccessToast } from "@/lib/toast-utils"
import WorkspaceModal, { WorkspaceModalSubmitPayload } from "@/components/workspace-modal"

interface SidebarProps {
  currentPage?: string
  className?: string
  onToggleCollapse?: () => void
  collapsed?: boolean
}

// 현재 페이지에 따른 메뉴 활성화 상태를 결정하는 함수
const getActiveMenuItems = (currentPage: string = "") => {
  const isActive = (page: string) => {
    // work 관련 페이지들의 정확한 매칭을 위해 경로 기반으로 체크
    if (page === "contract" && currentPage === "work/contract") return true
    if (page === "work" && currentPage === "work/task") return true
    // status 관련 페이지들의 정확한 매칭을 위해 경로 기반으로 체크
    if (page === "posting" && currentPage === "status/posting") return true
    if (page === "keywords" && currentPage === "status/keywords") return true
    if (page === "blog-ranking" && currentPage === "status/blog-ranking") return true
    if (page === "revenue" && currentPage === "status/revenue") return true
    if (page === "performance" && currentPage === "status/performance") return true
    // support 관련 페이지들의 정확한 매칭을 위해 경로 기반으로 체크
    if (page === "chatbot" && currentPage === "support/chatbot") return true
    if (page === "notices" && currentPage === "support/notices") return true
    return currentPage === page || currentPage.endsWith(`/${page}`)
  }
  
  return [
    {
      id: "business",
      title: "업무관리",
      items: [
        { icon: FileText, label: "계약현황", active: isActive("contract"), href: "/work/contract" },
        { icon: Briefcase, label: "업무현황", active: isActive("work"), href: "/work/task" },
      ]
    },
    {
      id: "analytics", 
      title: "성과·분석",
      items: [
        { icon: MessageSquare, label: "포스팅현황", active: isActive("posting"), href: "/status/posting" },
        { icon: Search, label: "키워드현황", active: isActive("keywords"), href: "/status/keywords" },
        { icon: TrendingUp, label: "블로그 순위추적", active: isActive("blog-ranking"), href: "/status/blog-ranking" },
        { icon: DollarSign, label: "매출현황", active: isActive("revenue"), href: "/status/revenue" },
        { icon: Target, label: "성과현황", active: isActive("performance"), href: "/status/performance" },
      ]
    },
    {
      id: "support",
      title: "지원",
      items: [
        { icon: Bot, label: "챗봇", active: isActive("chatbot"), href: "/support/chatbot" },
        { icon: Bell, label: "공지사항", active: isActive("notices"), href: "/support/notices" },
      ]
    },
    {
      id: "settings",
      title: "설정", 
      items: [
        { icon: Building, label: "조직관리", active: isActive("organization"), href: "/settings/organization" },
        { icon: Crown, label: "멤버십안내", active: false, href: "/membership" },
        { icon: User, label: "마이페이지", active: isActive("profile"), href: "/profile" },
      ]
    }
  ]
}

export function Sidebar({ currentPage = "", className, onToggleCollapse, collapsed = false }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['business', 'analytics', 'settings']))
  const remainingMinerals = 2690
  
  // 현재 페이지에 따라 해당 그룹만 열고 나머지는 닫기
  useEffect(() => {
    let targetGroup = ''
    
    if (currentPage.includes('work') || currentPage.includes('contract')) {
      targetGroup = 'business'
    } else if (currentPage.includes('posting') || currentPage.includes('keywords') || currentPage.includes('blog-ranking') || currentPage.includes('revenue') || currentPage.includes('performance')) {
      targetGroup = 'analytics'
    } else if (currentPage.includes('support')) {
      targetGroup = 'support'
    } else if (currentPage.includes('organization') || currentPage.includes('membership') || currentPage.includes('profile')) {
      targetGroup = 'settings'
    }
    
    if (targetGroup) {
      setExpandedGroups(new Set([targetGroup]))
    }
  }, [currentPage])
  const [selectedWorkspace, setSelectedWorkspace] = useState("default")
  const [workspaceSelectOpen, setWorkspaceSelectOpen] = useState(false)
  const [workspaceHoverOpen, setWorkspaceHoverOpen] = useState(false)
  const workspaceButtonRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false)
  
  // 워크스페이스 목록 (실제로는 API에서 가져올 수 있습니다)
  const workspaces = [
    { value: "default", label: "기본 워크스페이스" },
    { value: "workspace1", label: "프로젝트 A" },
    { value: "workspace2", label: "프로젝트 B" },
    { value: "workspace3", label: "마케팅팀" },
  ]
  
  const sidebarMenuGroups = getActiveMenuItems(currentPage)

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev)
      if (newSet.has(groupId)) {
        newSet.delete(groupId)
      } else {
        newSet.add(groupId)
      }
      return newSet
    })
  }

  // 모바일/태블릿 메뉴 토글 이벤트 리스너
  useEffect(() => {
    const handleToggle = () => setSidebarOpen(prev => !prev)
    window.addEventListener('toggleSidebar', handleToggle)
    return () => window.removeEventListener('toggleSidebar', handleToggle)
  }, [])

  // 드롭다운 위치 계산
  useEffect(() => {
    const updatePosition = () => {
      if (workspaceHoverOpen && workspaceButtonRef.current && collapsed) {
        const rect = workspaceButtonRef.current.getBoundingClientRect()
        setDropdownPosition({
          top: rect.top,
          left: rect.right + 8
        })
      }
    }

    if (workspaceHoverOpen && collapsed) {
      // 약간의 지연을 주어 렌더링 완료 후 계산
      setTimeout(updatePosition, 0)
      
      // 스크롤 시에도 위치 업데이트
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [workspaceHoverOpen, collapsed])

  return (
    <>
      {/* 모바일/태블릿 오버레이 (1024px 이하) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] xl:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      <aside
        className={cn(
          "fixed xl:sticky top-0 xl:top-16 left-0 z-[110] bg-white border-r border-border transform transition-all duration-300 ease-in-out w-64",
          "shadow-lg xl:shadow-none h-[100dvh] xl:h-[calc(100vh-4rem)] max-h-screen flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0",
          collapsed ? "xl:w-16" : "xl:w-64",
          className
        )}
      >
        {/* 모바일/태블릿 헤더 (1024px 이하) */}
        <div className="flex items-center justify-between p-4 xl:hidden flex-shrink-0">
          <span className="font-semibold">메뉴</span>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>


        <div className="flex flex-col flex-1 overflow-hidden min-h-0">
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 min-h-0">
            {/* 워크스페이스 선택 */}
            <div className="mb-4">
              {/* 모바일 또는 PC에서 펼쳐진 상태 */}
              <div
                className={cn("relative", collapsed && "xl:hidden")}
                data-tour-id="workspace-select"
              >
                <Select 
                  value={selectedWorkspace} 
                  onValueChange={setSelectedWorkspace}
                  open={workspaceSelectOpen}
                  onOpenChange={setWorkspaceSelectOpen}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-600 hover:border-gray-700 rounded-lg transition-all text-sm font-bold [&>span[data-radix-select-icon]]:hidden [&_svg]:hidden" style={{ height: '40px' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.value} value={workspace.value}>
                        {workspace.label}
                      </SelectItem>
                    ))}
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setWorkspaceSelectOpen(false)
                          setIsWorkspaceModalOpen(true)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-accent/50 rounded-md transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                        <span>추가</span>
                      </button>
                    </div>
                  </SelectContent>
                </Select>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-200 text-muted-foreground",
                    workspaceSelectOpen && "rotate-180"
                  )}
                />
              </div>
              
              {/* PC에서 닫힌 상태 */}
              <div 
                ref={workspaceButtonRef as React.RefObject<HTMLDivElement>}
                className={cn("relative hidden", collapsed && "xl:block")}
                onMouseEnter={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setWorkspaceHoverOpen(true)
                }}
                onMouseLeave={() => {
                  closeTimeoutRef.current = setTimeout(() => {
                    setWorkspaceHoverOpen(false)
                  }, 100)
                }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-center px-2 py-2.5 rounded-lg text-foreground font-bold text-base hover:bg-accent/50 border border-gray-600"
                  title={workspaces.find(w => w.value === selectedWorkspace)?.label}
                >
                  {workspaces.find(w => w.value === selectedWorkspace)?.label.charAt(0) || '기'}
                </Button>
              </div>
            </div>

            {/* 대시보드 - 독립 메뉴 */}
            <div className="mb-3">
              <Link href="/dashboard">
                <Button
                  variant={currentPage === "dashboard" ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 text-sm py-2.5 rounded-lg",
                    currentPage === "dashboard" 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm",
                    collapsed && "xl:justify-center xl:px-2"
                  )}
                >
                  <Home className="h-4 w-4 flex-shrink-0" />
                  <span className={cn("truncate", collapsed && "xl:hidden")}>대시보드</span>
                </Button>
              </Link>
            </div>
            
            {sidebarMenuGroups.map((group) => (
              <div key={group.id} className="space-y-0.5">
                {/* 그룹 제목 - 모바일에서는 항상 보임 */}
                <div className={cn(collapsed && "xl:hidden")}>
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 group"
                  >
                    <span className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-primary rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                      {group.title}
                    </span>
                    <div className="transition-transform duration-200">
                      {expandedGroups.has(group.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </button>
                </div>
                
                {/* 메뉴 아이템들 - 모바일에서는 항상 보임 */}
                <div className={cn("ml-4 space-y-0.5 border-l border-border/50 pl-3", 
                  collapsed && "xl:hidden",
                  !expandedGroups.has(group.id) && "hidden"
                )}>
                  {group.items.map((item, index) => (
                    <Link key={index} href={item.href}>
                      <Button
                        variant={item.active ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start gap-3 text-sm py-2.5 rounded-lg",
                          item.active 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm"
                        )}
                        data-tour-id={item.label === "조직관리" ? "settings-organization" : undefined}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* 접힌 상태에서 그룹 아이템들 - PC에서만 보임 */}
                <div className={cn("space-y-0.5 hidden", collapsed && "xl:block")}>
                  {group.items.map((item, index) => (
                    <Link key={index} href={item.href}>
                      <Button
                        variant={item.active ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-center px-2 py-2.5 rounded-lg",
                          item.active 
                            ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm"
                        )}
                        data-tour-id={item.label === "조직관리" ? "settings-organization" : undefined}
                        title={item.label}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>
          
          {/* 하단 고정 영역 - 모바일에서는 항상 보임 */}
          <div className={cn("border-t border-border/50 flex-shrink-0", collapsed && "xl:hidden")}>
            {/* 이용가이드 메뉴 */}
            <div className="p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sm py-2.5 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm"
              >
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">이용가이드</span>
              </Button>
            </div>
            
            {/* 보유 미네랄 표시 */}
            <div className="px-4 pb-4 xl:hidden border-t border-border/50 pt-4">
              <Link href="/profile/charging">
                <div className="flex items-center justify-between gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <span className="text-xs font-medium text-muted-foreground">보유 미네랄</span>
                  <div className="flex items-center gap-1.5 border border-primary text-primary px-2.5 py-1 rounded-full bg-primary/5">
                    <Image
                      src="/icons/icon-mineral-sm.png"
                      alt="미네랄 아이콘"
                      width={16}
                      height={16}
                      className="shrink-0"
                    />
                    <span className="text-xs font-semibold">{remainingMinerals.toLocaleString()}</span>
                    <span className="text-[11px] font-medium">미네랄</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* 버전 정보 */}
            <div className="px-4 pb-4">
              <div className="text-xs text-muted-foreground text-center">
                AgOffice v1.0
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 워크스페이스 드롭다운 (collapsed 상태에서만) */}
      {collapsed && workspaceHoverOpen && (
        <div
          className="fixed z-[120]"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`
          }}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current)
              closeTimeoutRef.current = null
            }
            setWorkspaceHoverOpen(true)
          }}
          onMouseLeave={() => {
            closeTimeoutRef.current = setTimeout(() => {
              setWorkspaceHoverOpen(false)
            }, 100)
          }}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-[200px]">
            {workspaces.map((workspace) => (
              <button
                key={workspace.value}
                onClick={() => {
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setSelectedWorkspace(workspace.value)
                  setWorkspaceHoverOpen(false)
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors whitespace-nowrap overflow-hidden text-ellipsis",
                  selectedWorkspace === workspace.value && "bg-accent text-primary font-semibold"
                )}
              >
                {workspace.label}
              </button>
            ))}
            <div className="border-t border-border mt-1 pt-1">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  if (closeTimeoutRef.current) {
                    clearTimeout(closeTimeoutRef.current)
                    closeTimeoutRef.current = null
                  }
                  setWorkspaceHoverOpen(false)
                  setIsWorkspaceModalOpen(true)
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-accent/50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>추가</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 새 워크스페이스 생성 모달 */}
      <WorkspaceModal
        open={isWorkspaceModalOpen}
        onOpenChange={setIsWorkspaceModalOpen}
        onSubmit={({ name, inviteEmails }: WorkspaceModalSubmitPayload) => {
          console.log("워크스페이스 이름:", name)
          console.log("초대 이메일 목록:", inviteEmails)
          showSuccessToast("워크스페이스가 생성됐습니다.")
        }}
      />
    </>
  )
}

// 모바일/태블릿 메뉴 토글 버튼 컴포넌트 (1024px 이하에서 표시)
export function MobileMenuToggle() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="xl:hidden"
      onClick={() => {
        // 사이드바 열기 로직은 Sidebar 컴포넌트 내부에서 처리
        const event = new CustomEvent('toggleSidebar')
        window.dispatchEvent(event)
      }}
      data-tour-id="mobile-sidebar-toggle"
    >
      <Menu className="h-5 w-5" />
    </Button>
  )
}
