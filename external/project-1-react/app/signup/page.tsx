"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import ScrollModal from "@/components/scroll-modal"
import AlertConfirmModal from "@/components/ui/alert-confirm-modal"

export default function SignupPage() {
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    emailId: "",
    emailDomain: "naver.com",
    password: "",
    confirmPassword: "",
    memberType: "company", // 회사 or 개인
    companyName: "",
    companySize: "",
    industry: "",
    otherIndustry: "",
    referralCode: "", // 추천인 코드
  })

  const [agreements, setAgreements] = useState({
    allAgree: false,
    serviceTerms: false,
    privacyPolicy: false,
    privacyThirdParty: false,
    marketing: false,
  })

  const [passwordMatch, setPasswordMatch] = useState(true)
  
  // 유효성 검사 에러 상태
  const [errors, setErrors] = useState({
    emailId: '',
    password: '',
    confirmPassword: '',
    agreements: ''
  })
  
  // SNS 로그인 타입 상태 (null: 일반, 'kakao' | 'naver' | 'google': SNS)
  const [snsLoginType, setSnsLoginType] = useState<string | null>(null)

  // URL 파라미터에서 SNS 타입 확인 및 초기화
  useEffect(() => {
    const snsParam = searchParams.get('sns')
    if (snsParam && (snsParam === 'kakao' || snsParam === 'naver' || snsParam === 'google')) {
      setSnsLoginType(snsParam)
      // 목업 데이터: SNS 이메일 자동 입력
      const emailData = {
        kakao: { emailId: 'kakao_user', emailDomain: 'kakao.com' },
        naver: { emailId: 'naver_user', emailDomain: 'naver.com' },
        google: { emailId: 'google_user', emailDomain: 'gmail.com' }
      }
      setFormData(prev => ({
        ...prev,
        emailId: emailData[snsParam as keyof typeof emailData].emailId,
        emailDomain: emailData[snsParam as keyof typeof emailData].emailDomain,
        password: '',
        confirmPassword: ''
      }))
    }
  }, [searchParams])
  
  // 약관 팝업 상태
  const [termsDialog, setTermsDialog] = useState<{
    isOpen: boolean
    type: string
    title: string
    content: string
  }>({
    isOpen: false,
    type: '',
    title: '',
    content: ''
  })

  // 얼럿 모달 상태
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean
    title: string
    message: string
  }>({
    isOpen: false,
    title: '',
    message: ''
  })

  // 약관 내용 정의
  const termsContent = {
    serviceTerms: {
      title: '(필수) 서비스 이용약관',
      content: `제 1조 목적
이 약관은 (주)케이미디어지식인(이하 "당사"라 합니다)에서 제공하는 인터넷 관련 서비스(이하 "서비스"라 합니다)를 이용함에 있어 당사 웹사이트의 이용조건, 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제 2조 정의
1. "당사 웹사이트"란 (주)케이미디어지식인이가 이미지 또는 폰트, PPT 소스 등(이하 "콘텐츠"라 합)을 이용자에게 공급키 위하여 컴퓨터 등 정보통신 설비를 이용하여 콘텐츠를 거래할 수 있도록 설정한 가상의 영업장을 말하며,
2. "이용자"란 "당사 웹사이트"에 접속하여 이 약관에 따라 "당사 웹사이트"가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.
3. "회원"이라 함은 "당사 웹사이트"에 개인정보를 제공하여 회원 등록을 한 자로서, "당사 웹사이트"의 정보를 지속적으로 제공받으며, "당사 웹사이트"가 제공하는 서비스를 이용할 수 있는 자를 말합니다.
4. "비회원"이라 함은 회원에 가입하지 않고 "당사 웹사이트"가 제공하는 서비스를 이용하는 자를 말합니다.

제 3조 약관 등의 명시 발효 및 개정
...`
    },
    privacyPolicy: {
      title: '(필수) 개인정보 수집 및 이용 동의',
      content: `개인정보 수집 및 이용에 대한 안내

1. 수집하는 개인정보 항목
- 필수항목: 이메일, 비밀번호, 이름, 휴대폰 번호
- 선택항목: 회사명, 회사 전화번호, 업종 정보

2. 개인정보의 수집 및 이용 목적
- 회원 가입 및 관리
- 서비스 제공 및 계약 이행
- 마케팅 및 광고 활용

3. 개인정보의 보유 및 이용기간
회원 탈퇴 시까지 보유하며, 관계 법령에 따라 일정 기간 보관할 수 있습니다.
...`
    },
    privacyThirdParty: {
      title: '(필수) 개인정보 제3자 제공',
      content: `개인정보 제3자 제공에 대한 안내

회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.

1. 이용자가 사전에 동의한 경우
2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우
...`
    },
    marketing: {
      title: '(선택) 마케팅 정보 활용 동의',
      content: `마케팅 정보 활용 동의

회사는 회원에게 다음과 같은 마케팅 정보를 이메일 및 SMS로 발송할 수 있습니다.

1. 신규 서비스 안내
2. 이벤트 및 프로모션 정보
3. 맞춤형 상품 추천
4. 할인 쿠폰 및 혜택
5. 긴급 이벤트 안내
6. 중요 서비스 업데이트

수신을 원하지 않을 경우 언제든지 수신 거부를 할 수 있습니다.
...`
    }
  }

  // 약관 팝업 열기
  const openTermsDialog = (type: keyof typeof termsContent) => {
    setTermsDialog({
      isOpen: true,
      type,
      title: termsContent[type].title,
      content: termsContent[type].content
    })
  }

  // 얼럿 모달 열기
  const showAlert = (title: string, message: string) => {
    setAlertModal({
      isOpen: true,
      title,
      message
    })
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === "password" || name === "confirmPassword") {
      const password = name === "password" ? value : formData.password
      const confirmPassword = name === "confirmPassword" ? value : formData.confirmPassword
      setPasswordMatch(password === confirmPassword)
    }
  }

  const handleAgreementChange = (agreement: keyof typeof agreements) => {
    // 약관 변경 시 에러 초기화
    if (errors.agreements) {
      setErrors(prev => ({ ...prev, agreements: '' }))
    }
    
    if (agreement === "allAgree") {
      const newValue = !agreements.allAgree
      setAgreements({
        allAgree: newValue,
        serviceTerms: newValue,
        privacyPolicy: newValue,
        privacyThirdParty: newValue,
        marketing: newValue,
      })
    } else {
      const newAgreements = {
        ...agreements,
        [agreement]: !agreements[agreement],
      }
      // 모든 필수 항목이 체크되었는지 확인
      const allChecked = newAgreements.serviceTerms && 
                        newAgreements.privacyPolicy && 
                        newAgreements.privacyThirdParty
      newAgreements.allAgree = allChecked
      setAgreements(newAgreements)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 에러 초기화
    const newErrors = {
      emailId: '',
      password: '',
      confirmPassword: '',
      agreements: ''
    }
    
    let hasError = false
    
    // 1. 이메일 검증
    if (!formData.emailId || formData.emailId.trim() === '') {
      newErrors.emailId = '이메일을 입력해주세요.'
      hasError = true
    } else if (formData.emailId.length < 2 || formData.emailId.length > 15) {
      newErrors.emailId = '이메일은 2자 이상 15자 이내로 입력해주세요.'
      hasError = true
    }
    
    // 2. 비밀번호 검증 (SNS 로그인이 아닐 경우)
    if (!snsLoginType) {
      if (!formData.password || formData.password.trim() === '') {
        newErrors.password = '비밀번호를 입력해주세요.'
        hasError = true
      } else if (formData.password.length < 6 || formData.password.length > 15) {
        newErrors.password = '비밀번호는 6자 이상 15자 이내로 입력해주세요.'
        hasError = true
      }
      
      if (!passwordMatch && formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.'
        hasError = true
      }
    }
    
    // 3. 필수 약관 동의 검증
    const requiredAgreements = [
      agreements.serviceTerms,
      agreements.privacyPolicy,
      agreements.privacyThirdParty
    ]
    
    if (!requiredAgreements.every(Boolean)) {
      newErrors.agreements = '필수 약관에 동의해주세요.'
      hasError = true
    }
    
    setErrors(newErrors)
    
    if (hasError) {
      // 첫 번째 에러 필드로 스크롤
      const firstErrorField = document.querySelector('[data-error="true"]')
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }
    
    // 모든 검증 통과 시 다음 화면으로 이동
    console.log("회원가입 시도:", formData)
    window.location.href = '/signup/complete'
  }

  const isFormValid = 
    formData.emailId.trim() !== '' &&
    formData.emailId.length >= 2 &&
    formData.emailId.length <= 15 &&
    agreements.serviceTerms && 
    agreements.privacyPolicy && 
    agreements.privacyThirdParty &&
    (snsLoginType ? true : (formData.password.trim() !== '' && passwordMatch)) // SNS 로그인 시 비밀번호 검증 제외

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 페이지 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">무료회원가입</h1>
          <div className="w-full h-px bg-gray-400"></div>
          </div>
          
        <form onSubmit={handleSubmit}>
          {/* 메인 콘텐츠 영역 - 2컬럼 레이아웃 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:divide-x lg:divide-gray-200">
            {/* 왼쪽: SNS 간편 회원가입 + 입력 폼 */}
            <div className="lg:pr-8 mb-8 lg:mb-0">
              {/* SNS 간편 회원가입 섹션 */}
              <div className="mb-10">
                <h2 className="text-xl font-bold mb-6 text-center">SNS 간편 회원가입</h2>
                <div className="flex flex-col items-center space-y-3">
                  {/* 카카오 로그인 */}
                  <Button
                    type="button"
                    className="w-64 h-12 rounded-lg font-bold text-sm transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: '#FEE500',
                      color: '#000000',
                    }}
                    onClick={() => {
                      setSnsLoginType('kakao')
                      // 목업 데이터: 카카오 이메일 자동 입력
                      setFormData(prev => ({
                        ...prev,
                        emailId: 'kakao_user',
                        emailDomain: 'kakao.com',
                        password: '',
                        confirmPassword: ''
                      }))
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3C6.477 3 2 6.359 2 10.5c0 2.617 1.674 4.908 4.197 6.283-.172.633-.683 2.494-.785 2.891-.123.484.177.478.373.347.154-.103 2.416-1.603 3.203-2.116.654.09 1.328.137 2.012.137 5.523 0 10-3.359 10-7.5S17.523 3 12 3z"/>
                    </svg>
                    카카오 로그인
                  </Button>

                  {/* 네이버 로그인 */}
                  <Button
                    type="button"
                    className="w-64 h-12 rounded-lg font-bold text-sm text-white transition-all duration-200 cursor-pointer"
                    style={{
                      backgroundColor: '#03C75A',
                    }}
                    onClick={() => {
                      setSnsLoginType('naver')
                      // 목업 데이터: 네이버 이메일 자동 입력
                      setFormData(prev => ({
                        ...prev,
                        emailId: 'naver_user',
                        emailDomain: 'naver.com',
                        password: '',
                        confirmPassword: ''
                      }))
                    }}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"/>
                    </svg>
                    네이버 로그인
                  </Button>

                  {/* 구글 로그인 */}
                  <Button
                    type="button"
                    className="w-64 h-12 rounded-lg font-semibold text-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      setSnsLoginType('google')
                      // 목업 데이터: 구글 이메일 자동 입력
                      setFormData(prev => ({
                        ...prev,
                        emailId: 'google_user',
                        emailDomain: 'gmail.com',
                        password: '',
                        confirmPassword: ''
                      }))
                    }}
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
              </div>

              {/* 구분선 */}
              <div className="w-full h-px bg-gray-200 mb-6"></div>

              {/* 이메일로 회원가입하기 섹션 */}
              <div>
                <h2 className="text-xl font-bold mb-6 text-center">이메일로 회원가입하기</h2>
        
                {/* 필수항목 표시 */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600">* 필수항목</p>
                </div>
      
                {/* 입력 폼 */}
                <div className="space-y-6">
                  {/* 아이디(이메일) */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      * 아이디(이메일)
                      </Label>
                    <div className="flex gap-2">
                      <Input
                        name="emailId"
                        placeholder="영문, 숫자, 특수문자 2자이상, 6~15자 이내"
                        value={formData.emailId}
                        onChange={(e) => {
                          // SNS 로그인 모드에서는 수정 불가
                          if (snsLoginType) return
                          // 영문, 숫자, 특수문자만 허용 (한글 제외)
                          const value = e.target.value.replace(/[^a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '')
                          setFormData(prev => ({ ...prev, emailId: value }))
                          // 에러 초기화
                          if (errors.emailId) {
                            setErrors(prev => ({ ...prev, emailId: '' }))
                          }
                        }}
                        className={`flex-1 ${errors.emailId ? 'border-red-500' : ''}`}
                        disabled={!!snsLoginType}
                        readOnly={!!snsLoginType}
                        data-error={errors.emailId ? 'true' : 'false'}
                      />
                      <span className="flex items-center px-2">@</span>
                      <Select
                        value={formData.emailDomain}
                        onValueChange={(value) => {
                          if (snsLoginType) return
                          setFormData(prev => ({ ...prev, emailDomain: value }))
                        }}
                        disabled={!!snsLoginType}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="naver.com">naver.com</SelectItem>
                          <SelectItem value="gmail.com">gmail.com</SelectItem>
                          <SelectItem value="daum.net">daum.net</SelectItem>
                          <SelectItem value="kakao.com">kakao.com</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {errors.emailId && (
                      <p className="text-xs text-red-500 mt-1">{errors.emailId}</p>
                    )}
                    {!errors.emailId && snsLoginType && (
                      <p className="text-xs text-blue-600 mt-1">
                        {snsLoginType === 'kakao' && '✓ 카카오 계정으로 로그인합니다'}
                        {snsLoginType === 'naver' && '✓ 네이버 계정으로 로그인합니다'}
                        {snsLoginType === 'google' && '✓ 구글 계정으로 로그인합니다'}
                      </p>
                    )}
                  </div>

                  {/* 비밀번호 - SNS 로그인 시 숨김 */}
                  {!snsLoginType && (
                    <>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          * 비밀번호
                        </Label>
                        <Input
                          name="password"
                          type="password"
                          placeholder="영문, 숫자, 특수문자 2가지 이상, 6~15자 이내"
                          value={formData.password}
                          onChange={(e) => {
                            handleInputChange(e)
                            // 에러 초기화
                            if (errors.password) {
                              setErrors(prev => ({ ...prev, password: '' }))
                            }
                          }}
                          className={errors.password ? "border-red-500" : ""}
                          data-error={errors.password ? 'true' : 'false'}
                        />
                        {errors.password && (
                          <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                        )}
                      </div>

                      {/* 비밀번호 확인 */}
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          * 비밀번호 확인
                        </Label>
                        <Input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => {
                            handleInputChange(e)
                            // 에러 초기화
                            if (errors.confirmPassword) {
                              setErrors(prev => ({ ...prev, confirmPassword: '' }))
                            }
                          }}
                          className={(errors.confirmPassword || (!passwordMatch && formData.confirmPassword)) ? "border-red-500" : ""}
                          data-error={(errors.confirmPassword || (!passwordMatch && formData.confirmPassword)) ? 'true' : 'false'}
                        />
                        {errors.confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                        )}
                        {!errors.confirmPassword && !passwordMatch && formData.confirmPassword && (
                          <p className="text-xs text-red-500 mt-1">비밀번호가 일치하지 않습니다.</p>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* 소속(업종) */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Label className="text-sm font-medium">
                      소속(업종)
                    </Label>
                  </div>
                  
                  {/* 회사/개인 라디오 버튼 */}
                  <RadioGroup
                    value={formData.memberType}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, memberType: value }))}
                    className="flex gap-6 mb-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="company" id="company" />
                      <Label htmlFor="company" className="cursor-pointer">회사</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="personal" id="personal" />
                      <Label htmlFor="personal" className="cursor-pointer">개인</Label>
                    </div>
                  </RadioGroup>

                  {/* 회사 선택 시 */}
                  {formData.memberType === "company" && (
                    <>
                      {/* 회사명 입력 */}
                      <Input
                        placeholder="회사명을 입력해주세요."
                        value={formData.companyName}
                        onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                        className="mb-3 bg-white"
                      />

                      {/* 안내 텍스트 */}
                      <p className="text-sm text-primary mb-4">
                        ◆ 기업 규모와 업종을 선택하셔야 맞춤상품 추천 및 할인이 가능합니다.
                      </p>

                      {/* 1. 기업규모 */}
                      <div className="mb-4">
                        <h3 className="text-sm font-bold mb-3">1. 기업규모</h3>
                        <RadioGroup
                          value={formData.companySize}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, companySize: value }))}
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="startup" id="startup" className="bg-white border-gray-300" />
                              <Label htmlFor="startup" className="text-sm cursor-pointer">스타트업 기업</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="midsize" id="midsize" className="bg-white border-gray-300" />
                              <Label htmlFor="midsize" className="text-sm cursor-pointer">중소기업</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="large" id="large" className="bg-white border-gray-300" />
                              <Label htmlFor="large" className="text-sm cursor-pointer">대기업</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="public" id="public" className="bg-white border-gray-300" />
                              <Label htmlFor="public" className="text-sm cursor-pointer">공사/공기업/공공기관</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* 2. 업종 */}
                      <div>
                        <h3 className="text-sm font-bold mb-3">2. 업종</h3>
                        <RadioGroup
                          value={formData.industry}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                        >
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="ad_agency" id="ad_agency" className="bg-white border-gray-300" />
                              <Label htmlFor="ad_agency" className="text-sm cursor-pointer">광고대행사/기획사</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="hospital" id="hospital" className="bg-white border-gray-300" />
                              <Label htmlFor="hospital" className="text-sm cursor-pointer">병원/의원/헬스/미용</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="production" id="production" className="bg-white border-gray-300" />
                              <Label htmlFor="production" className="text-sm cursor-pointer">프로덕션/영화사</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="magazine" id="magazine" className="bg-white border-gray-300" />
                              <Label htmlFor="magazine" className="text-sm cursor-pointer">신문/잡지/미디어</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="pr" id="pr" className="bg-white border-gray-300" />
                              <Label htmlFor="pr" className="text-sm cursor-pointer">기업홍보/관공서/법률/금융</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="web_agency" id="web_agency" className="bg-white border-gray-300" />
                              <Label htmlFor="web_agency" className="text-sm cursor-pointer">웹에이전시</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="culture" id="culture" className="bg-white border-gray-300" />
                              <Label htmlFor="culture" className="text-sm cursor-pointer">관광(호텔, 여행지, 숙박)</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="print" id="print" className="bg-white border-gray-300" />
                              <Label htmlFor="print" className="text-sm cursor-pointer">인쇄소/출판소</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="education" id="education" className="bg-white border-gray-300" />
                              <Label htmlFor="education" className="text-sm cursor-pointer">교육기관, 단체</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="publishing" id="publishing" className="bg-white border-gray-300" />
                              <Label htmlFor="publishing" className="text-sm cursor-pointer">출판</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="media_content" id="media_content" className="bg-white border-gray-300" />
                              <Label htmlFor="media_content" className="text-sm cursor-pointer">미디어콘텐츠창작업</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="mcn" id="mcn" className="bg-white border-gray-300" />
                              <Label htmlFor="mcn" className="text-sm cursor-pointer">MCN</Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <RadioGroupItem value="accommodation" id="accommodation" className="bg-white border-gray-300" />
                              <Label htmlFor="accommodation" className="text-sm cursor-pointer">옥외광고(간판, 현수막, 실사출력 등)</Label>
                            </div>
                            <div className="flex items-center gap-2 w-full flex-wrap sm:flex-nowrap">
                              <RadioGroupItem value="etc" id="etc" className="bg-white border-gray-300" />
                              <Label htmlFor="etc" className="text-sm cursor-pointer whitespace-nowrap">기타</Label>
                              <input
                                type="text"
                                value={formData.otherIndustry}
                                onChange={(e) => setFormData({ ...formData, otherIndustry: e.target.value })}
                                placeholder={formData.industry === 'etc' ? '직접 입력' : '기타 선택 시 입력 가능'}
                                disabled={formData.industry !== 'etc'}
                                className={`w-full sm:w-auto sm:flex-1 basis-full sm:basis-auto bg-transparent border-0 border-b text-sm px-2 py-1 focus:outline-none focus:ring-0 ${formData.industry === 'etc' ? 'border-border focus:border-foreground' : 'border-muted opacity-60 cursor-not-allowed'}`}
                              />
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    </>
                  )}

                  {/* 개인 선택 시 */}
                  {formData.memberType === "personal" && (
                    <>
                      {/* 안내 텍스트 */}
                      <p className="text-sm text-primary mb-4">
                        ◆ 기업 규모와 업종을 선택하셔야 맞춤상품 추천 및 할인이 가능합니다.
                      </p>

                      {/* 업종 선택 */}
                      <RadioGroup
                        value={formData.industry}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="general" id="general" className="bg-white border-gray-300" />
                            <Label htmlFor="general" className="text-sm cursor-pointer">일반인</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="student" id="student" className="bg-white border-gray-300" />
                            <Label htmlFor="student" className="text-sm cursor-pointer">학생</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="freelancer_ad" id="freelancer_ad" className="bg-white border-gray-300" />
                            <Label htmlFor="freelancer_ad" className="text-sm cursor-pointer">프리랜서-광고/홍보</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="freelancer_literature" id="freelancer_literature" className="bg-white border-gray-300" />
                            <Label htmlFor="freelancer_literature" className="text-sm cursor-pointer">프리랜서-문학</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="youtuber" id="youtuber" className="bg-white border-gray-300" />
                            <Label htmlFor="youtuber" className="text-sm cursor-pointer">유튜버</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </>
                  )}
                </div>
              </div>
              </div>
            </div>

            {/* 오른쪽: 약관 동의 섹션 */}
            <div className="lg:pl-8 self-start">
              {/* 추천인 코드 */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  추천인 코드 (선택)
                </Label>
                <Input
                  name="referralCode"
                  placeholder="추천인 코드를 입력해주세요"
                  value={formData.referralCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, referralCode: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
              {/* 전체 동의 */}
              <div className="mb-4 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <Checkbox
                    id="allAgree"
                    checked={agreements.allAgree}
                    onCheckedChange={() => handleAgreementChange("allAgree")}
                  />
                  <Label htmlFor="allAgree" className="text-sm cursor-pointer">
                    전체관람 및 마케팅정보 수신에 동의합니다.
                    </Label>
                  </div>
                </div>

              {/* 개별 약관 */}
              {errors.agreements && (
                <p className="text-xs text-red-500 mb-3">{errors.agreements}</p>
              )}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <Checkbox
                        id="serviceTerms"
                        checked={agreements.serviceTerms}
                        onCheckedChange={() => handleAgreementChange("serviceTerms")}
                      />
                    <Label htmlFor="serviceTerms" className="text-sm cursor-pointer">
                      (필수) 서비스 이용약관
                      </Label>
                    </div>
                    <Button
                      type="button"
                    variant="link"
                      size="sm"
                    className="text-xs text-blue-600 h-auto p-0"
                    onClick={() => openTermsDialog('serviceTerms')}
                    >
                    내용보기
                    </Button>
                  </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <Checkbox
                        id="privacyPolicy"
                        checked={agreements.privacyPolicy}
                        onCheckedChange={() => handleAgreementChange("privacyPolicy")}
                      />
                    <Label htmlFor="privacyPolicy" className="text-sm cursor-pointer">
                      (필수) 개인정보 수집 및 이용 동의
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-xs text-blue-600 h-auto p-0"
                    onClick={() => openTermsDialog('privacyPolicy')}
                  >
                    내용보기
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="privacyThirdParty"
                      checked={agreements.privacyThirdParty}
                      onCheckedChange={() => handleAgreementChange("privacyThirdParty")}
                    />
                    <Label htmlFor="privacyThirdParty" className="text-sm cursor-pointer">
                      (필수) 개인정보 제3자 제공
                    </Label>
                    </div>
                    <Button
                      type="button"
                    variant="link"
                      size="sm"
                    className="text-xs text-blue-600 h-auto p-0"
                    onClick={() => openTermsDialog('privacyThirdParty')}
                    >
                    내용보기
                    </Button>
                  </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="marketing"
                      checked={agreements.marketing}
                      onCheckedChange={() => handleAgreementChange("marketing")}
                    />
                    <Label htmlFor="marketing" className="text-sm cursor-pointer">
                      (선택) 마케팅 정보 활용 동의
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-xs text-blue-600 h-auto p-0"
                    onClick={() => openTermsDialog('marketing')}
                  >
                    내용보기
                  </Button>
                </div>
              </div>
              </div>
              
              {/* 가입하기 버튼 */}
              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full h-14 text-lg font-bold rounded-lg ${
                    isFormValid
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  동의하고 회원가입
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* 약관 팝업 */}
      <ScrollModal
        isOpen={termsDialog.isOpen}
        onClose={() => setTermsDialog({...termsDialog, isOpen: false})}
        title={termsDialog.title}
        content={termsDialog.content}
        buttonText="확인"
      />

      {/* 얼럿 모달 */}
      <AlertConfirmModal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({...alertModal, isOpen: false})}
        onConfirm={() => setAlertModal({...alertModal, isOpen: false})}
        showHeaderTitle={false}
        contentTitle={alertModal.title}
        message={alertModal.message}
        confirmText="확인"
        showCancel={false}
        maxWidth="320px"
      />
    </div>
  )
}
