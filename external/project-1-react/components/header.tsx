"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileMenuToggle } from "@/components/sidebar"
import { Menu, Search, Bell as BellIcon, User, Crown, CreditCard, MessageSquare, FileText, Briefcase, DollarSign, Target, Bot, Building, Home, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

 interface HeaderProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
  pageTitle?: string
  pageDescription?: string
  hideMobileDescription?: boolean
 }

// 검색 가능한 메뉴 항목 정의
const searchableMenuItems = [
  { label: "대시보드", href: "/dashboard", icon: Home, group: "메인" },
  { label: "계약현황", href: "/work/contract", icon: FileText, group: "업무관리" },
  { label: "업무현황", href: "/work/task", icon: Briefcase, group: "업무관리" },
  { label: "포스팅현황", href: "/status/posting", icon: MessageSquare, group: "성과·분석" },
  { label: "키워드현황", href: "/status/keywords", icon: Search, group: "성과·분석" },
  { label: "매출현황", href: "/status/revenue", icon: DollarSign, group: "성과·분석" },
  { label: "성과현황", href: "/status/performance", icon: Target, group: "성과·분석" },
  { label: "챗봇", href: "/support/chatbot", icon: Bot, group: "지원" },
  { label: "공지사항", href: "/support/notices", icon: BellIcon, group: "지원" },
  { label: "조직관리", href: "/settings/organization", icon: Building, group: "설정" },
  { label: "멤버십안내", href: "/membership", icon: Crown, group: "설정" },
  { label: "마이페이지", href: "/profile", icon: User, group: "설정" },
]

export function Header({
  sidebarCollapsed,
  onToggleSidebar,
  pageTitle,
  pageDescription,
  hideMobileDescription,
}: HeaderProps) {
  const router = useRouter()
  const [notificationOpen, setNotificationOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<typeof searchableMenuItems>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // 전역 공통 헤더 표시 데이터 (필요 시 추후 Context/Store 연동 가능)
  const currentUserName = "김대표"
  const currentUserRole = "관리자"
  const currentUserAvatarSrc = "/icons/icon-user-m.png"
  const notificationData = [
    { id: 1, noticeId: 1, label: "공지", date: "2025-01-15", content: "2025년 1월 정기 서버 점검 안내", isRead: false },
    { id: 2, noticeId: 2, label: "이벤트", date: "2025-01-14", content: "신규 고객 대상 특별 할인 이벤트", isRead: false },
    { id: 3, noticeId: 3, label: "공지", date: "2025-01-10", content: "새로운 기능 업데이트 안내", isRead: true },
  ] as const
  const remainingMinerals = 2690

  // 검색어 기반 필터링
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([])
      setSearchOpen(false)
      return
    }

    const query = searchQuery.toLowerCase().trim()
    const filtered = searchableMenuItems.filter((item) =>
      item.label.toLowerCase().includes(query) ||
      item.group.toLowerCase().includes(query)
    )
    setSearchResults(filtered)
    setSearchOpen(true) // 검색어가 있으면 항상 드롭다운 표시
  }, [searchQuery])

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
    }
    if (notificationOpen || userMenuOpen || searchOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [notificationOpen, userMenuOpen, searchOpen])

  // 검색 결과 항목 클릭 핸들러
  const handleSearchItemClick = (href: string) => {
    router.push(href)
    setSearchQuery("")
    setSearchOpen(false)
  }

  const handleLogout = () => {
    setUserMenuOpen(false)
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("agoffice-auth-token")
        sessionStorage.removeItem("agoffice-auth-token")
      } catch (error) {
        console.warn("세션 정보를 정리하는 중 문제가 발생했습니다:", error)
      }
    }
    router.replace("/login")
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 w-full">
      <div className="flex items-center justify-between px-2 md:px-4 py-3">
        <div className="flex items-center gap-2 md:gap-4">
          <MobileMenuToggle />
          <div className="hidden xl:flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-center w-8 h-8 p-0 hover:bg-accent"
              onClick={onToggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              {/* Mobile logo */}
              <Image
                src="/logo-symbol.png"
                alt="AgOffice Symbol"
                width={64}
                height={64}
                className="block md:hidden flex-shrink-0 w-8 h-8 object-contain"
                quality={100}
                priority
              />
              {/* PC/Tablet logo */}
              <Image
                src="/logo-main.png"
                alt="AgOffice"
                width={256}
                height={256}
                className="hidden md:block flex-shrink-0 md:w-16 lg:w-32 max-w-[128px] h-auto object-contain"
                sizes="(max-width: 1024px) 64px, 128px"
                quality={100}
                priority
              />
            </Link>
            {pageTitle && (
              <div className="flex flex-col sm:hidden min-w-0">
                <span className="font-bold text-base text-foreground truncate">{pageTitle}</span>
                {pageDescription && !hideMobileDescription && (
                  <span className="text-[10px] text-muted-foreground truncate">{pageDescription}</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 pr-0 md:pr-3 lg:pr-5">
         
          <div className="md:hidden">
            <Link href="/membership">
              <Button className="gradient-animate-primary h-8 rounded-full px-3 text-xs font-semibold text-white transition-all">
                멤버십안내
              </Button>
            </Link>
          </div>
          <div className="relative hidden md:block" ref={searchRef}>
            <div className="relative">
              <Input
                placeholder="메뉴를 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setSearchOpen(true)}
                className="pr-10 w-64 bg-muted/50 border-border focus:bg-white transition-colors rounded-full"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("")
                    setSearchOpen(false)
                  }}
                  className="absolute right-8 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  {searchResults.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={index}
                        onClick={() => handleSearchItemClick(item.href)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm",
                          "hover:bg-accent hover:text-accent-foreground transition-colors",
                          "text-left"
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-foreground truncate">{item.label}</div>
                          <div className="text-xs text-muted-foreground truncate">{item.group}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            {searchOpen && searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
                <div className="text-sm text-muted-foreground text-center">
                  검색 결과가 없습니다
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/membership">
              <Button className="gradient-animate-primary h-8 rounded-full px-4 text-xs font-semibold text-white transition-all">
                멤버십안내
              </Button>
            </Link>
            <Link
              href="/profile/charging"
              className="flex h-8 items-center gap-1.5 border border-primary text-primary px-2.5 rounded-full bg-primary/5 transition hover:bg-primary/10"
            >
              <Image
                src="/icons/icon-mineral-sm.png"
                alt="미네랄 아이콘"
                width={16}
                height={16}
                className="shrink-0"
              />
              <span className="text-xs font-semibold">{remainingMinerals.toLocaleString()}</span>
              <span className="text-xs font-medium">미네랄</span>
            </Link>
          </div>
         
          <div className="relative" ref={notificationRef}>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-1 bg-transparent hover:bg-transparent relative"
              onClick={() => setNotificationOpen(!notificationOpen)}
            >
              <BellIcon className="size-5 text-gray-400" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-light rounded-full h-4 w-4 flex items-center justify-center">
                N
              </span>
            </Button>
            {notificationOpen && (
              <div className="fixed right-4 top-16 w-80 max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden sm:absolute sm:right-0 sm:top-10">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">알림</h3>
                  <Button variant="ghost" size="sm" onClick={() => setNotificationOpen(false)} className="h-6 w-6 p-0">
                    <Menu className="h-0 w-0 hidden" />
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {(notificationData || []).map((n) => (
                    <Link key={n.id} href={`/support/notices/${n.noticeId}`}>
                      <div className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!n.isRead ? "bg-blue-50" : ""}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${n.label === "공지" ? "bg-blue-100 text-blue-800" : n.label === "이벤트" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`}>
                                {n.label}
                              </span>
                              <span className="text-xs text-gray-500">{n.date}</span>
                              {!n.isRead && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed">{n.content}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                  <Link href="/support/notices">
                    <Button variant="ghost" size="sm" className="w-full text-sm text-gray-600 hover:bg-transparent hover:text-gray-600">
                      모든 알림 보기
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="relative" ref={userMenuRef}>
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <Avatar className="h-8 w-8 bg-blue-100">
                <AvatarImage src={currentUserAvatarSrc} />
                <AvatarFallback>{currentUserName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-bold">{currentUserName}</p>
                <p className="text-xs text-muted-foreground -mt-0.5">{currentUserRole}</p>
              </div>
            </div>
            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="py-2">
                  <Link href="/profile/account" className="block cursor-pointer">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" />
                      계정정보
                    </button>
                  </Link>
                  <Link href="/profile/membership" className="block cursor-pointer">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                      <Crown className="h-4 w-4" />
                      멤버십관리
                    </button>
                  </Link>
                  <Link href="/profile/payment" className="block cursor-pointer">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      결제정보
                    </button>
                  </Link>
                  <Link href="/profile/inquiry" className="block cursor-pointer">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                      <MessageSquare className="h-4 w-4" />
                      MY문의
                    </button>
                  </Link>
                </div>
                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


