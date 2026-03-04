"use client"

import type React from "react"
import { useEffect } from "react"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SignupCompletePage() {
  useEffect(() => {
    // 즉시 첫 번째 폭죽 발사
    const fireConfetti = () => {
      confetti({
        particleCount: 100,
        startVelocity: 55,
        spread: 360,
        ticks: 120,
        gravity: 0.9,
        origin: { x: 0.5, y: 0.5 },
        scalar: 1.2,
        zIndex: 9999,
      })
    }

    // 페이지 로드 시 즉시 실행
    fireConfetti()
    
    // 짧은 간격으로 추가 폭죽 발사
    const t1 = setTimeout(() => fireConfetti(), 150)
    const t2 = setTimeout(() => fireConfetti(), 300)
    const t3 = setTimeout(() => fireConfetti(), 450)
    
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center p-4 pt-8">
      
      
      <div className="w-full max-w-md">
        {/* 전체 컨테이너 */}
        <Card className="border border-border rounded-3xl">
          <CardContent className="p-8">
            {/* 완료 메시지 */}
            <div className="text-center space-y-6">

              {/* 완료 메시지 */}
              <div className="space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">가입을 축하합니다!</h2>
                <p className="text-muted-foreground text-lg mt-4 font-medium">
                  마케팅이 시작되는곳,<br />
                  AgOffice에 오신 것을 환영합니다.
                </p>
              </div>

              {/* 축하 아이콘 */}
              <div className="flex justify-center py-10">
                <img 
                  src="/icons/icon-congratulations.png" 
                  alt="축하 아이콘" 
                  className="w-42 h-42 animate-float"
                />
              </div>



              {/* 액션 버튼들 */}
              <div className="pt-4">
                <Button
                  className="w-full h-12 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl cursor-pointer"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  로그인하기
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
