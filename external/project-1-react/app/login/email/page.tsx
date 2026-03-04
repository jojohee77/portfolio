"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export default function EmailLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const handleSignup = () => {
    window.location.href = '/signup'
  }

  // 이메일 로그인 핸들러
  const handleEmailLogin = () => {
    // 유효성 검사 초기화
    setEmailError("")
    setPasswordError("")

    // 아이디 유효성 검사
    if (!email || email.trim() === "") {
      setEmailError("아이디를 입력해주세요.")
      return
    }

    // 비밀번호 유효성 검사
    if (!password || password.trim() === "") {
      setPasswordError("비밀번호를 입력해주세요.")
      return
    }

    console.log("이메일 로그인 시도", { email, password })
    // 이메일 로그인 로직 구현
    // 실제 구현 시 이메일 로그인 API 호출
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-white sm:bg-gradient-to-br sm:from-slate-50 sm:to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* 전체 컨테이너 */}
        <Card className="rounded-3xl border-none shadow-none sm:border sm:border-border sm:shadow-lg">
          <CardContent className="p-6 sm:p-10">
            {/* 헤더 섹션 */}
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                {/* Mobile logo */}
                <Image
                  src="/logo-symbol.png"
                  alt="AgOffice Symbol"
                  width={128}
                  height={128}
                  className="block md:hidden flex-shrink-0 w-20 h-20 object-contain"
                  quality={100}
                  priority
                />
                {/* PC/Tablet logo */}
                <Image
                  src="/logo-main.png"
                  alt="AgOffice"
                  width={512}
                  height={512}
                  className="hidden md:block flex-shrink-0 md:w-48 lg:w-[160px] max-w-[160px] h-auto object-contain"
                  sizes="(max-width: 1024px) 192px, 160px"
                  quality={100}
                  priority
                />
              </div>
              <p className="text-muted-foreground text-sm font-medium">서비스 이용을 위해 로그인 해주세요.</p>
            </div>

            {/* 이메일 로그인 폼 */}
            <div className="space-y-4 mb-4">
              {/* 아이디 필드 */}
              <div className="space-y-1">
                <Input
                  id="email"
                  type="email"
                  placeholder="아이디를 입력하세요"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError("")
                  }}
                  className={`h-[50px] rounded-xl ${emailError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                {emailError && (
                  <p className="text-sm text-red-500 px-1">{emailError}</p>
                )}
              </div>

              {/* 비밀번호 필드 */}
              <div className="space-y-1">
                <Input
                  id="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setPasswordError("")
                  }}
                  className={`h-[50px] rounded-xl ${passwordError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                {passwordError && (
                  <p className="text-sm text-red-500 px-1">{passwordError}</p>
                )}
              </div>

              {/* 로그인 버튼 */}
              <Button
                onClick={handleEmailLogin}
                className="w-full h-[50px] rounded-xl font-semibold text-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer mb-2"
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                }}
              >
                로그인
              </Button>

              {/* 자동 로그인 및 아이디/비밀번호 찾기 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-muted-foreground cursor-pointer font-normal"
                  >
                    자동 로그인
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  className="h-9 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all duration-200 font-medium cursor-pointer"
                  onClick={() => window.location.href = '/find'}
                >
                  아이디/비밀번호 찾기
                </Button>
              </div>
            </div>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
            </div>

            {/* 회원가입 버튼 */}
            <div className="mb-6">
              <Button
                onClick={handleSignup}
                className="w-full h-[50px] rounded-xl font-semibold text-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: '#374151',
                  color: '#ffffff',
                }}
              >
                회원가입
              </Button>
            </div>

            {/* 하단 정보 */}
            <div className="text-center pt-6 mt-6">
              <p className="text-xs text-muted-foreground font-medium">© 2025 AgOffice. All rights reserved.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
