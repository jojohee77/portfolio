"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollableTabs } from "@/components/ui/scrollable-tabs"
import { Sidebar } from "@/components/sidebar"
import Header from "@/components/header"
import { showSuccessToast } from "@/lib/toast-utils"
import { Crown, Edit, Save, Camera } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// 사용자 정보 타입
interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  department: string
  position: string
  permission: string
  permissionColor: string
  status: string
  statusColor: string
  joinDate: string
  lastAccess: string
}

// 기본 사용자 정보
const defaultUserProfile: UserProfile = {
  id: "1",
  name: "김승우",
  email: "kim.seungwoo@company.com",
  phone: "010-1234-5678",
  avatar: "/icons/icon-user-m.png",
  department: "경영진",
  position: "대표",
  permission: "전체 관리자",
  permissionColor: "bg-red-50 text-red-700 border border-red-200",
  status: "활성",
  statusColor: "bg-green-100 text-green-800",
  joinDate: "2024-01-01",
  lastAccess: "2024-01-15 09:30",
}

const profileTabs = [
  { name: "계정정보", href: "/profile/account" },
  { name: "멤버십 관리", href: "/profile/membership" },
  { name: "결제 정보", href: "/profile/payment" },
  { name: "충전/이용내역", href: "/profile/charging" },
  { name: "MY문의", href: "/profile/inquiry" },
]

// ProfileTabs 컴포넌트 - ScrollableTabs 사용
function ProfileTabs() {
  return <ScrollableTabs tabs={profileTabs} />
}

export default function AccountPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile)
  const [editProfile, setEditProfile] = useState<UserProfile>(defaultUserProfile)
  const [avatarModalOpen, setAvatarModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // 데이터 로딩 시뮬레이션
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // 프로필 수정 시작
  const handleEditStart = () => {
    setEditProfile({ ...userProfile })
    setIsEditing(true)
  }

  // 프로필 수정 취소
  const handleEditCancel = () => {
    setEditProfile({ ...userProfile })
    setIsEditing(false)
  }

  // 프로필 저장
  const handleSave = () => {
    setUserProfile({ ...editProfile })
    setIsEditing(false)
    showSuccessToast("프로필이 성공적으로 수정되었습니다")
  }

  // 아바타 업로드
  const handleAvatarUpload = () => {
    if (selectedFile) {
      showSuccessToast("프로필 사진이 업로드되었습니다")
      setAvatarModalOpen(false)
      setSelectedFile(null)
    }
  }

  // 파일 선택 핸들러
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      // 이미지 미리보기 URL 생성
      const imageUrl = URL.createObjectURL(file)
      // 프로필 이미지 즉시 업데이트
      setUserProfile({ ...userProfile, avatar: imageUrl })
      setEditProfile({ ...editProfile, avatar: imageUrl })
      // 바로 업로드 처리
      showSuccessToast("프로필 사진이 업로드되었습니다")
      // 실제 구현에서는 서버로 파일 전송
    }
  }

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
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              {/* 탭 네비게이션 스켈레톤 */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {profileTabs.map((tab) => (
                  <Skeleton key={tab.href} className="h-10 w-24 flex-shrink-0 rounded-full" />
                ))}
              </div>

              {/* 프로필 카드 스켈레톤 */}
              <Card className="shadow-none rounded-2xl border gap-4 py-6">
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 프로필 사진 및 기본 정보 스켈레톤 */}
                  <div className="flex items-center gap-4 sm:gap-6">
                    <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* 상세 정보 스켈레톤 */}
                  <div className="space-y-1">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                        <Skeleton className="h-4 w-20 sm:w-[120px]" />
                        <Skeleton className="h-4 w-full sm:w-64" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 버튼 스켈레톤 */}
              <div className="flex justify-end -mt-2">
                <Skeleton className="h-10 w-24" />
              </div>
            </>
          ) : (
            <>
              {/* 페이지 헤더 - 모바일에서는 숨김 */}
              <div className="flex items-center justify-between hidden sm:flex">
                <div>
                  <h1 className="text-2xl font-bold">마이페이지</h1>
                  <p className="text-sm text-muted-foreground mt-1">계정정보를 관리하세요</p>
                </div>
              </div>

              {/* 탭 네비게이션 */}
              <ProfileTabs />

              {/* 프로필 정보 카드 */}
              <Card className="shadow-none rounded-2xl border gap-4 py-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 프로필 사진 및 기본 정보 */}
              <div className="flex items-center gap-4 sm:gap-6">
                 <div className="relative flex-shrink-0">
                   <Avatar 
                     className="h-16 w-16 sm:h-20 sm:w-20 border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                     onClick={() => document.getElementById('avatar-upload')?.click()}
                   >
                     <AvatarImage src={userProfile.avatar} className="object-cover" />
                     <AvatarFallback className="text-sm">{userProfile.name.charAt(0)}</AvatarFallback>
                   </Avatar>
                   <Button
                     size="icon"
                     className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gray-400 hover:bg-gray-500"
                     onClick={() => document.getElementById('avatar-upload')?.click()}
                   >
                     <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                   </Button>
                   <input
                     id="avatar-upload"
                     type="file"
                     accept="image/*"
                     className="hidden"
                     onChange={handleFileSelect}
                   />
                 </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg sm:text-xl font-bold">{userProfile.name}</h3>
                    <span className="text-xs sm:text-sm text-gray-500">경영진 · 대표</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={`${userProfile.statusColor} text-xs`}>
                      {userProfile.status}
                    </Badge>
                    <Badge variant="secondary" className={`${userProfile.permissionColor} text-xs`}>
                      {userProfile.permission}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

               {/* 상세 정보 - 정렬된 리스트 */}
               <div className="space-y-1">
                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                   <div className="flex items-center gap-2 sm:w-[120px]">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                     <span className="text-sm sm:text-base font-semibold text-gray-900">이름</span>
                   </div>
                   {isEditing ? (
                     <Input
                       value={editProfile.name}
                       onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                       className="shadow-none h-9 w-full sm:flex-1 sm:min-w-0 sm:max-w-[400px] border-gray-400 focus:border-gray-600 text-base font-normal"
                       style={{ fontSize: '16px' }}
                     />
                   ) : (
                     <span className="text-base sm:text-lg text-gray-600 break-all">{userProfile.name}</span>
                   )}
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                   <div className="flex items-center gap-2 sm:w-[120px]">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                     <span className="text-sm sm:text-base font-semibold text-gray-900">이메일</span>
                   </div>
                   <span className="text-base sm:text-lg text-gray-600 break-all">{userProfile.email}</span>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                   <div className="flex items-center gap-2 sm:w-[120px]">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                     <span className="text-sm sm:text-base font-semibold text-gray-900">전화번호</span>
                   </div>
                   {isEditing ? (
                     <Input
                       value={editProfile.phone}
                       onChange={(e) => setEditProfile({ ...editProfile, phone: e.target.value })}
                       className="shadow-none h-9 w-full sm:flex-1 sm:min-w-0 sm:max-w-[400px] border-gray-400 focus:border-gray-600 text-base font-normal"
                       style={{ fontSize: '16px' }}
                     />
                   ) : (
                     <span className="text-base sm:text-lg text-gray-600 break-all">{userProfile.phone}</span>
                   )}
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                   <div className="flex items-center gap-2 sm:w-[120px]">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                     <span className="text-sm sm:text-base font-semibold text-gray-900">부서</span>
                   </div>
                   <span className="text-base sm:text-lg text-gray-600 break-all">{userProfile.department}</span>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                   <div className="flex items-center gap-2 sm:w-[120px]">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                     <span className="text-sm sm:text-base font-semibold text-gray-900">직급</span>
                   </div>
                   <span className="text-base sm:text-lg text-gray-600 break-all">{userProfile.position}</span>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                   <div className="flex items-center gap-2 sm:w-[120px]">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                     <span className="text-sm sm:text-base font-semibold text-gray-900">가입일</span>
                   </div>
                   <span className="text-base sm:text-lg text-gray-600 break-all">{userProfile.joinDate}</span>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-2">
                   <div className="flex items-center gap-2 sm:w-[120px]">
                     <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                     <span className="text-sm sm:text-base font-semibold text-gray-900">최근 접속</span>
                   </div>
                   <span className="text-base sm:text-lg text-gray-600 break-all">{userProfile.lastAccess}</span>
                 </div>
               </div>

            </CardContent>
          </Card>

          {/* 수정하기 버튼 - 카드 바깥 하단 */}
          <div className="flex justify-end -mt-2">
            {!isEditing ? (
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground shadow-none rounded-lg w-24"
                onClick={handleEditStart}
              >
                수정하기
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="shadow-none rounded-lg w-20"
                  onClick={handleEditCancel}
                >
                  취소
                </Button>
                <Button 
                  size="lg"
                  className="bg-primary text-primary-foreground shadow-none rounded-lg w-20"
                  onClick={handleSave}
                >
                  저장
                </Button>
              </div>
            )}
          </div>
            </>
          )}

          {/* 아바타 업로드 모달 */}
          <Dialog open={avatarModalOpen} onOpenChange={setAvatarModalOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-[450px]">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">프로필 사진 변경</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border border-gray-200">
                      <AvatarImage src={selectedFile ? URL.createObjectURL(selectedFile) : userProfile.avatar} className="object-cover" />
                      <AvatarFallback className="text-sm">{userProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="avatar" className="text-sm font-medium">파일 선택</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="shadow-none"
                  />
                </div>
                
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    선택된 파일: {selectedFile.name}
                  </p>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setAvatarModalOpen(false)
                    setSelectedFile(null)
                  }}
                >
                  취소
                </Button>
                <Button 
                  onClick={handleAvatarUpload}
                  disabled={!selectedFile}
                >
                  업로드
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}

