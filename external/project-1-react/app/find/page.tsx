"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type FindType = "id" | "password"

export default function FindPage() {
  const [findType, setFindType] = useState<FindType>("id")
  
  // 아이디 찾기 상태
  const [idFindStep, setIdFindStep] = useState(1) // 1: 인증 및 입력, 2: 결과
  const [idFindData, setIdFindData] = useState({
    authType: "email", // email or phone
    email: "",
    phone: "",
    authCode: "",
    foundId: "",
  })
  const [idFindErrors, setIdFindErrors] = useState({
    email: "",
    phone: "",
    authCode: "",
  })
  const [idAuthSent, setIdAuthSent] = useState(false) // 인증번호 발송 여부

  // 비밀번호 찾기 상태
  const [passwordFindStep, setPasswordFindStep] = useState(1) // 1: 아이디 입력, 2: 인증번호 발송, 3: 인증번호 입력, 4: 비밀번호 재설정, 5: 완료
  const [passwordFindData, setPasswordFindData] = useState({
    id: "",
    authType: "email",
    email: "",
    phone: "",
    authCode: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordFindErrors, setPasswordFindErrors] = useState({
    id: "",
    email: "",
    phone: "",
    authCode: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordAuthSent, setPasswordAuthSent] = useState(false) // 인증번호 발송 여부

  // 타이머 상태
  const [idFindTimer, setIdFindTimer] = useState(0) // 아이디 찾기 타이머 (초)
  const [passwordFindTimer, setPasswordFindTimer] = useState(0) // 비밀번호 찾기 타이머 (초)
  const idFindTimerRef = useRef<NodeJS.Timeout | null>(null)
  const passwordFindTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 타이머 관련 함수들
  const startIdFindTimer = () => {
    setIdFindTimer(180) // 3분 = 180초
    if (idFindTimerRef.current) {
      clearInterval(idFindTimerRef.current)
    }
    idFindTimerRef.current = setInterval(() => {
      setIdFindTimer((prev) => {
        if (prev <= 1) {
          clearInterval(idFindTimerRef.current!)
          setIdFindErrors(prev => ({ ...prev, authCode: "인증번호가 만료되었습니다. 다시 발송해주세요." }))
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startPasswordFindTimer = () => {
    setPasswordFindTimer(180) // 3분 = 180초
    if (passwordFindTimerRef.current) {
      clearInterval(passwordFindTimerRef.current)
    }
    passwordFindTimerRef.current = setInterval(() => {
      setPasswordFindTimer((prev) => {
        if (prev <= 1) {
          clearInterval(passwordFindTimerRef.current!)
          setPasswordFindErrors(prev => ({ ...prev, authCode: "인증번호가 만료되었습니다. 다시 발송해주세요." }))
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (idFindTimerRef.current) {
        clearInterval(idFindTimerRef.current)
      }
      if (passwordFindTimerRef.current) {
        clearInterval(passwordFindTimerRef.current)
      }
    }
  }, [])

  // 아이디 찾기 핸들러
  const handleIdFindInputChange = (field: string, value: string) => {
    // 휴대폰 번호 입력 시 하이픈 제거
    const processedValue = field === "phone" ? value.replace(/[^0-9]/g, "") : value
    setIdFindData(prev => ({ ...prev, [field]: processedValue }))
    if (idFindErrors[field as keyof typeof idFindErrors]) {
      setIdFindErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleIdFindAuthTypeChange = (value: string) => {
    setIdFindData(prev => ({ ...prev, authType: value, email: "", phone: "" }))
    setIdFindErrors({ email: "", phone: "", authCode: "" })
    setIdAuthSent(false) // 인증방식 변경 시 발송 상태 초기화
  }

  const handleIdFindSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = { email: "", phone: "", authCode: "" }
    
    if (!idAuthSent) {
      // 인증번호 발송 단계
      if (idFindData.authType === "email") {
        if (!idFindData.email) {
          newErrors.email = "이메일을 입력해주세요."
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(idFindData.email)) {
          newErrors.email = "올바른 이메일 형식을 입력해주세요."
        }
      } else {
        if (!idFindData.phone) {
          newErrors.phone = "휴대폰 번호를 입력해주세요."
        } else if (!/^010\d{8}$/.test(idFindData.phone)) {
          newErrors.phone = "올바른 휴대폰 번호 형식을 입력해주세요. (01012345678)"
        }
      }
      
      if (!Object.values(newErrors).some(error => error)) {
        // 인증번호 발송 시뮬레이션
        console.log(`${idFindData.authType === "email" ? "이메일" : "SMS"} 인증번호 발송:`, 
                   idFindData.authType === "email" ? idFindData.email : idFindData.phone)
        setIdAuthSent(true)
        startIdFindTimer() // 타이머 시작
      }
    } else {
      // 인증번호 확인 단계
      if (!idFindData.authCode) {
        newErrors.authCode = "인증번호를 입력해주세요."
      } else if (idFindData.authCode.length !== 6) {
        newErrors.authCode = "인증번호는 6자리입니다."
      }
      
      if (!Object.values(newErrors).some(error => error)) {
        // 인증 성공 시뮬레이션
        setIdFindData(prev => ({ ...prev, foundId: "user***@example.com" }))
        setIdFindStep(2) // 결과 화면으로
      }
    }
    
    setIdFindErrors(newErrors)
  }

  // 비밀번호 찾기 핸들러
  const handlePasswordFindInputChange = (field: string, value: string) => {
    // 휴대폰 번호 입력 시 하이픈 제거
    const processedValue = field === "phone" ? value.replace(/[^0-9]/g, "") : value
    setPasswordFindData(prev => {
      const next = { ...prev, [field]: processedValue }
      return next
    })

    // 개별 필드 에러 초기화
    if (passwordFindErrors[field as keyof typeof passwordFindErrors]) {
      setPasswordFindErrors(prev => ({ ...prev, [field]: "" }))
    }

    // 새 비밀번호 일치 여부 실시간 검증
    if (field === "newPassword" || field === "confirmPassword") {
      setPasswordFindErrors(prev => {
        const nextErrors = { ...prev }
        const newPwd = field === "newPassword" ? processedValue : passwordFindData.newPassword
        const confirmPwd = field === "confirmPassword" ? processedValue : passwordFindData.confirmPassword

        // 조건: 둘 다 값이 있을 때만 불일치 에러 표시, 일치하면 제거
        if (newPwd && confirmPwd && newPwd !== confirmPwd) {
          nextErrors.confirmPassword = "비밀번호가 일치하지 않습니다."
        } else if (nextErrors.confirmPassword) {
          nextErrors.confirmPassword = ""
        }

        return nextErrors
      })
    }
  }

  const handlePasswordFindAuthTypeChange = (value: string) => {
    setPasswordFindData(prev => ({ ...prev, authType: value, email: "", phone: "" }))
    setPasswordFindErrors({ id: "", email: "", phone: "", authCode: "", newPassword: "", confirmPassword: "" })
    setPasswordAuthSent(false) // 인증방식 변경 시 발송 상태 초기화
  }

  const validatePassword = (password: string) => {
    if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다."
    if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return "영문, 숫자, 특수문자를 포함해야 합니다."
    }
    return ""
  }

  const handlePasswordFindSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors = { id: "", email: "", phone: "", authCode: "", newPassword: "", confirmPassword: "" }
    
    if (passwordFindStep === 1) {
      // 아이디 입력 단계
      if (!passwordFindData.id) {
        newErrors.id = "아이디를 입력해주세요."
      }
      
      if (!Object.values(newErrors).some(error => error)) {
        setPasswordFindStep(2)
      }
    } else if (passwordFindStep === 2) {
      if (!passwordAuthSent) {
        // 인증번호 발송 단계
        if (passwordFindData.authType === "email") {
          if (!passwordFindData.email) {
            newErrors.email = "이메일을 입력해주세요."
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passwordFindData.email)) {
            newErrors.email = "올바른 이메일 형식을 입력해주세요."
          }
        } else {
          if (!passwordFindData.phone) {
            newErrors.phone = "휴대폰 번호를 입력해주세요."
          } else if (!/^010\d{8}$/.test(passwordFindData.phone)) {
            newErrors.phone = "올바른 휴대폰 번호 형식을 입력해주세요. (01012345678)"
          }
        }
        
        if (!Object.values(newErrors).some(error => error)) {
          // 인증번호 발송 시뮬레이션
          console.log(`${passwordFindData.authType === "email" ? "이메일" : "SMS"} 인증번호 발송`)
          setPasswordAuthSent(true)
          startPasswordFindTimer() // 타이머 시작
        }
      } else {
        // 인증번호 확인 단계
        if (!passwordFindData.authCode) {
          newErrors.authCode = "인증번호를 입력해주세요."
        } else if (passwordFindData.authCode.length !== 6) {
          newErrors.authCode = "인증번호는 6자리입니다."
        }
        
        if (!Object.values(newErrors).some(error => error)) {
          // 인증 성공 시뮬레이션
          setPasswordFindStep(3)
        }
      }
    } else if (passwordFindStep === 3) {
      // 비밀번호 재설정 단계
      if (!passwordFindData.newPassword) {
        newErrors.newPassword = "새 비밀번호를 입력해주세요."
      } else {
        const passwordError = validatePassword(passwordFindData.newPassword)
        if (passwordError) {
          newErrors.newPassword = passwordError
        }
      }
      
      if (!passwordFindData.confirmPassword) {
        newErrors.confirmPassword = "비밀번호 확인을 입력해주세요."
      } else if (passwordFindData.newPassword !== passwordFindData.confirmPassword) {
        newErrors.confirmPassword = "비밀번호가 일치하지 않습니다."
      }
      
      if (!Object.values(newErrors).some(error => error)) {
        // 비밀번호 변경 성공
        setPasswordFindStep(4)
      }
    }
    
    setPasswordFindErrors(newErrors)
  }

  const resetIdFind = () => {
    setIdFindStep(1)
    setIdFindData({ authType: "email", email: "", phone: "", authCode: "", foundId: "" })
    setIdFindErrors({ email: "", phone: "", authCode: "" })
    setIdAuthSent(false)
    setIdFindTimer(0)
    if (idFindTimerRef.current) {
      clearInterval(idFindTimerRef.current)
    }
  }

  const resetPasswordFind = () => {
    setPasswordFindStep(1)
    setPasswordFindData({ id: "", authType: "email", email: "", phone: "", authCode: "", newPassword: "", confirmPassword: "" })
    setPasswordFindErrors({ id: "", email: "", phone: "", authCode: "", newPassword: "", confirmPassword: "" })
    setPasswordAuthSent(false)
    setPasswordFindTimer(0)
    if (passwordFindTimerRef.current) {
      clearInterval(passwordFindTimerRef.current)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border border-border rounded-3xl shadow-lg" style={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          <CardContent className="p-10">
            {/* 헤더 */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">아이디/비밀번호 찾기</h1>
              <p className="text-muted-foreground text-sm font-medium">회원정보를 확인해보세요</p>
            </div>

            {/* 탭 */}
            <Tabs value={findType} onValueChange={(value) => {
              setFindType(value as FindType)
              resetIdFind()
              resetPasswordFind()
            }}>
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted p-1 rounded-xl">
                <TabsTrigger 
                  value="id" 
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold rounded-lg transition-all duration-200"
                >
                  아이디 찾기
                </TabsTrigger>
                <TabsTrigger 
                  value="password"
                  className="data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary font-semibold rounded-lg transition-all duration-200"
                >
                  비밀번호 찾기
                </TabsTrigger>
              </TabsList>

              {/* 아이디 찾기 탭 */}
              <TabsContent value="id" className="space-y-6">
                {idFindStep === 1 && (
                  <>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-foreground block">인증 방식 선택</Label>
                        <RadioGroup value={idFindData.authType} onValueChange={handleIdFindAuthTypeChange} className="space-y-0">
                          <div 
                            className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => handleIdFindAuthTypeChange("email")}
                          >
                            <RadioGroupItem value="email" id="id-email" className="border-2 pointer-events-none" />
                            <Label htmlFor="id-email" className="text-sm font-medium text-foreground cursor-pointer pointer-events-none">이메일 인증</Label>
                          </div>
                          <div 
                            className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => handleIdFindAuthTypeChange("phone")}
                          >
                            <RadioGroupItem value="phone" id="id-phone" className="border-2 pointer-events-none" />
                            <Label htmlFor="id-phone" className="text-sm font-medium text-foreground cursor-pointer pointer-events-none">휴대폰 인증</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {idFindData.authType === "email" ? (
                        <div className="space-y-3">
                          <Label htmlFor="id-email-input" className="text-sm font-semibold text-foreground block">등록된 이메일 주소</Label>
                          <Input
                            id="id-email-input"
                            type="email"
                            placeholder="이메일을 입력하세요"
                            value={idFindData.email}
                            onChange={(e) => handleIdFindInputChange("email", e.target.value)}
                            className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  ${
                              idFindErrors.email 
                                ? "border-destructive focus:border-destructive " 
                                : "border-border focus:border-primary"
                            }`}
                          />
                          {idFindErrors.email && (
                            <div className="flex items-center space-x-1 mt-2">
                              <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <p className="text-sm text-destructive font-medium">{idFindErrors.email}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Label htmlFor="id-phone-input" className="text-sm font-semibold text-foreground block">등록된 휴대폰 번호</Label>
                          <Input
                            id="id-phone-input"
                            type="tel"
                            placeholder="'-' 없이 연락처를 입력하세요'"
                            value={idFindData.phone}
                            onChange={(e) => handleIdFindInputChange("phone", e.target.value)}
                            className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  ${
                              idFindErrors.phone 
                                ? "border-destructive focus:border-destructive " 
                                : "border-border focus:border-primary"
                            }`}
                          />
                          {idFindErrors.phone && (
                            <div className="flex items-center space-x-1 mt-2">
                              <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <p className="text-sm text-destructive font-medium">{idFindErrors.phone}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 인증번호 입력 필드 - 발송 후 표시 */}
                      {idAuthSent && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="id-auth-code">인증번호</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // 재전송 로직
                                console.log(`${idFindData.authType === "email" ? "이메일" : "SMS"} 인증번호 재전송:`, 
                                           idFindData.authType === "email" ? idFindData.email : idFindData.phone)
                                setIdFindTimer(180) // 타이머 리셋
                                startIdFindTimer() // 타이머 재시작
                              }}
                              className="text-xs text-primary hover:text-primary/80 p-1 h-auto font-medium"
                            >
                              재전송
                            </Button>
                          </div>
                          <div className="relative">
                            <Input
                              id="id-auth-code"
                              type="text"
                              placeholder="6자리 인증번호"
                              value={idFindData.authCode}
                              onChange={(e) => handleIdFindInputChange("authCode", e.target.value)}
                              className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  pr-16 ${
                                idFindErrors.authCode 
                                  ? "border-destructive focus:border-destructive " 
                                  : "border-border focus:border-primary"
                              }`}
                              maxLength={6}
                            />
                            {idFindTimer > 0 && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <span className="text-sm font-medium text-red-500">
                                  {formatTime(idFindTimer)}
                                </span>
                              </div>
                            )}
                          </div>
                          {idFindErrors.authCode && (
                            <div className="flex items-center space-x-1 mt-2">
                              <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <p className="text-sm text-destructive font-medium">{idFindErrors.authCode}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleIdFindSubmit}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                      >
                        {idAuthSent ? "인증 확인" : "인증번호 발송"}
                      </Button>
                    </div>
                  </>
                )}

                {idFindStep === 2 && (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-green-600 text-lg font-semibold mb-2">
                        아이디 찾기 완료
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        회원님의 아이디는
                      </p>
                      <div className="text-xl font-bold text-green-700 mb-4">
                        {idFindData.foundId}
                      </div>
                      <p className="text-xs text-gray-500">
                        입니다.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={() => window.location.href = '/login'}
                        className="w-full h-11 bg-primary hover:bg-primary/90"
                      >
                        로그인하기
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetIdFind}
                        className="w-full h-11"
                      >
                        다시 찾기
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* 비밀번호 찾기 탭 */}
              <TabsContent value="password" className="space-y-6">
                {passwordFindStep === 1 && (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="password-id" className="text-sm font-semibold text-foreground block">아이디</Label>
                      <Input
                        id="password-id"
                        type="text"
                        placeholder="아이디를 입력하세요"
                        value={passwordFindData.id}
                        onChange={(e) => handlePasswordFindInputChange("id", e.target.value)}
                        className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  ${
                          passwordFindErrors.id 
                            ? "border-destructive focus:border-destructive " 
                            : "border-border focus:border-primary"
                        }`}
                      />
                      {passwordFindErrors.id && (
                        <div className="flex items-center space-x-1 mt-2">
                          <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <p className="text-sm text-destructive font-medium">{passwordFindErrors.id}</p>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handlePasswordFindSubmit}
                      className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      다음 단계
                    </Button>
                  </>
                )}

                {passwordFindStep === 2 && (
                  <>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-foreground block">인증 방식 선택</Label>
                        <RadioGroup value={passwordFindData.authType} onValueChange={handlePasswordFindAuthTypeChange} className="space-y-0">
                          <div 
                            className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => handlePasswordFindAuthTypeChange("email")}
                          >
                            <RadioGroupItem value="email" id="password-email" className="border-2 pointer-events-none" />
                            <Label htmlFor="password-email" className="text-sm font-medium text-foreground cursor-pointer pointer-events-none">이메일 인증</Label>
                          </div>
                          <div 
                            className="flex items-center space-x-3 p-3 rounded-xl border-2 border-border hover:border-primary/50 transition-colors cursor-pointer"
                            onClick={() => handlePasswordFindAuthTypeChange("phone")}
                          >
                            <RadioGroupItem value="phone" id="password-phone" className="border-2 pointer-events-none" />
                            <Label htmlFor="password-phone" className="text-sm font-medium text-foreground cursor-pointer pointer-events-none">휴대폰 인증</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {!passwordAuthSent && (
                        <>
                          {passwordFindData.authType === "email" ? (
                            <div className="space-y-3">
                              <Label htmlFor="password-email-input" className="text-sm font-semibold text-foreground block">등록된 이메일 주소</Label>
                              <Input
                                id="password-email-input"
                                type="email"
                                placeholder="이메일을 입력하세요"
                                value={passwordFindData.email}
                                onChange={(e) => handlePasswordFindInputChange("email", e.target.value)}
                                className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  ${
                                  passwordFindErrors.email 
                                    ? "border-destructive focus:border-destructive " 
                                    : "border-border focus:border-primary"
                                }`}
                              />
                              {passwordFindErrors.email && (
                                <div className="flex items-center space-x-1 mt-2">
                                  <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-destructive font-medium">{passwordFindErrors.email}</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Label htmlFor="password-phone-input" className="text-sm font-semibold text-foreground block">등록된 휴대폰 번호</Label>
                              <Input
                                id="password-phone-input"
                                type="tel"
                                placeholder="'-' 없이 연락처를 입력하세요"
                                value={passwordFindData.phone}
                                onChange={(e) => handlePasswordFindInputChange("phone", e.target.value)}
                                className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  ${
                                  passwordFindErrors.phone 
                                    ? "border-destructive focus:border-destructive " 
                                    : "border-border focus:border-primary"
                                }`}
                              />
                              {passwordFindErrors.phone && (
                                <div className="flex items-center space-x-1 mt-2">
                                  <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  <p className="text-sm text-destructive font-medium">{passwordFindErrors.phone}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}

                      {/* 인증번호 입력 필드 - 발송 후 표시 */}
                      {passwordAuthSent && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="password-auth-code">인증번호</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // 재전송 로직
                                console.log(`${passwordFindData.authType === "email" ? "이메일" : "SMS"} 인증번호 재전송`)
                                setPasswordFindTimer(180) // 타이머 리셋
                                startPasswordFindTimer() // 타이머 재시작
                              }}
                              className="text-xs text-primary hover:text-primary/80 p-1 h-auto font-medium"
                            >
                              재전송
                            </Button>
                          </div>
                          <div className="relative">
                            <Input
                              id="password-auth-code"
                              type="text"
                              placeholder="6자리 인증번호"
                              value={passwordFindData.authCode}
                              onChange={(e) => handlePasswordFindInputChange("authCode", e.target.value)}
                              className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  pr-16 ${
                                passwordFindErrors.authCode 
                                  ? "border-destructive focus:border-destructive " 
                                  : "border-border focus:border-primary"
                              }`}
                              maxLength={6}
                            />
                            {passwordFindTimer > 0 && (
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <span className="text-sm font-medium text-red-500">
                                  {formatTime(passwordFindTimer)}
                                </span>
                              </div>
                            )}
                          </div>
                          {passwordFindErrors.authCode && (
                            <div className="flex items-center space-x-1 mt-2">
                              <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <p className="text-sm text-destructive font-medium">{passwordFindErrors.authCode}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handlePasswordFindSubmit}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                      >
                        {passwordAuthSent ? "인증 확인" : "인증번호 발송"}
                      </Button>
                    </div>
                  </>
                )}

                {passwordFindStep === 3 && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">새 비밀번호</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="새 비밀번호를 입력하세요"
                          value={passwordFindData.newPassword}
                          onChange={(e) => handlePasswordFindInputChange("newPassword", e.target.value)}
                          className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  ${
                            passwordFindErrors.newPassword 
                              ? "border-destructive focus:border-destructive " 
                              : "border-border focus:border-primary"
                          }`}
                        />
                        {passwordFindErrors.newPassword && (
                          <div className="flex items-center space-x-1 mt-2">
                            <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-destructive font-medium">{passwordFindErrors.newPassword}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          • 비밀번호: 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">비밀번호 확인</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="비밀번호를 다시 입력하세요"
                          value={passwordFindData.confirmPassword}
                          onChange={(e) => handlePasswordFindInputChange("confirmPassword", e.target.value)}
                          className={`h-12 rounded-xl border-2 bg-background transition-all duration-200 focus:bg-background  ${
                            passwordFindErrors.confirmPassword 
                              ? "border-destructive focus:border-destructive " 
                              : "border-border focus:border-primary"
                          }`}
                        />
                        {passwordFindErrors.confirmPassword && (
                          <div className="flex items-center space-x-1 mt-2">
                            <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm text-destructive font-medium">{passwordFindErrors.confirmPassword}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handlePasswordFindSubmit}
                        className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                      >
                        비밀번호 변경
                      </Button>
                    </div>
                  </>
                )}

                {passwordFindStep === 4 && (
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-green-50 rounded-lg">
                      <div className="text-green-600 text-lg font-semibold mb-2">
                        비밀번호 변경 완료
                      </div>
                      <p className="text-sm text-gray-600">
                        비밀번호가 성공적으로 변경되었습니다.<br />
                        다시 로그인 해주세요.
                      </p>
                    </div>

                    <Button
                      onClick={() => window.location.href = '/login'}
                      className="w-full h-11 bg-primary hover:bg-primary/90"
                    >
                      로그인하기
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {/* 하단 링크 */}
            <div className="text-center mt-6">
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/login'}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                로그인으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
