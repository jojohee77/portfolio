"use client"

import type React from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  // 이메일 로그인 핸들러
  const handleEmailLogin = () => {
    window.location.href = '/login/email'
  }

  // SNS 로그인 핸들러
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 시도")
    // 카카오 로그인 로직 구현
    // 실제 구현 시 카카오 OAuth 연동
    window.location.href = '/signup?sns=kakao'
  }

  const handleNaverLogin = () => {
    console.log("네이버 로그인 시도")
    // 네이버 로그인 로직 구현
    // 실제 구현 시 네이버 OAuth 연동
    window.location.href = '/signup?sns=naver'
  }

  const handleGoogleLogin = () => {
    console.log("구글 로그인 시도")
    // 구글 로그인 로직 구현
    // 실제 구현 시 구글 OAuth 연동
    window.location.href = '/signup?sns=google'
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

            {/* 로그인 버튼들 */}
            <div className="space-y-4 mb-0">
              {/* 이메일 로그인 */}
              <Button
                onClick={handleEmailLogin}
                className="w-full h-[50px] rounded-xl font-semibold text-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                이메일 로그인
              </Button>

              {/* 카카오 로그인 */}
              <Button
                onClick={handleKakaoLogin}
                className="w-full h-[50px] rounded-xl font-semibold text-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: '#FEE500',
                  color: '#000000',
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3C6.477 3 2 6.359 2 10.5c0 2.617 1.674 4.908 4.197 6.283-.172.633-.683 2.494-.785 2.891-.123.484.177.478.373.347.154-.103 2.416-1.603 3.203-2.116.654.09 1.328.137 2.012.137 5.523 0 10-3.359 10-7.5S17.523 3 12 3z"/>
                </svg>
                카카오 로그인
              </Button>

              {/* 네이버 로그인 */}
              <Button
                onClick={handleNaverLogin}
                className="w-full h-[50px] rounded-xl font-semibold text-sm text-white transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                style={{
                  backgroundColor: '#03C75A',
                }}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
                네이버 로그인
              </Button>

              {/* 구글 로그인 */}
              <Button
                onClick={handleGoogleLogin}
                variant="outline"
                className="w-full h-[50px] rounded-xl font-semibold text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                구글 로그인
              </Button>
            </div>

            {/* 구분선 */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
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
